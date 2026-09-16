import { Extension } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import type { EditorState } from '@tiptap/pm/state';
import Suggestion, {
    exitSuggestion,
    type SuggestionProps,
} from '@tiptap/suggestion';
import type { NodeViewServices } from '../extensions';
import { BLOCK_INSERT_KINDS } from './kinds';
import { InsertionPopover } from './popover';
import { BlockBrowseHost } from './browse-host';
import { contextStillValid, executeInsertion } from './surface-helpers';
import {
    readBlockInsertView,
    writeBlockInsertView,
} from './insert-view-storage';
import type { InsertionContext } from './types';

export const VizySlashPluginKey = new PluginKey('vizySlash');

/** Module-level so slash never spins a second Floating UI shell beside gutter `+`. */
const slashPalette = new InsertionPopover();
/** Grid preference — same Blocks dialog as gutter / Add Block. */
const slashBrowse = new BlockBrowseHost();

/**
 * TipTap Suggestion detects `/`; we immediately consume it and open the shared
 * Add Block panel (Search). While that handoff runs, onExit must not close the
 * panel we are about to mount.
 */
let handoffToPanel = false;

function slashAllowed(services: NodeViewServices, from: number): InsertionContext | null {
    // Editor Config may disable blank-line `/` while keeping gutter / toolbar Add Block.
    if (services.manifest.slashInsert === false) return null;
    const context = services.insertion.buildContext('slash', from);
    if (!context) return null;
    // Blocks-only containers use gutter +, not slash in prose.
    if (context.contentType === 'blocks') return null;
    const $pos = services.editor.state.doc.resolve(from);
    if (!$pos.parent.isTextblock) return null;
    if (!services.insertion.query({
        context,
        kinds: BLOCK_INSERT_KINDS,
        limit: 1,
    }).length) return null;
    return context;
}

/**
 * Blank-line only: `/` fires when the textblock is exactly `/`
 * (startOfLine already rejects mid-sentence; this rejects `/` before existing text).
 */
export function isBlankLineSlashTrigger(state: EditorState, range: { from: number; to: number }): boolean {
    const trigger = state.doc.textBetween(range.from, range.to, '', '');
    if (trigger !== '/') return false;
    const $from = state.doc.resolve(range.from);
    if (!$from.parent.isTextblock) return false;
    const parentStart = $from.start();
    const parentEnd = $from.end();
    const before = state.doc.textBetween(parentStart, range.from, '', '');
    const after = state.doc.textBetween(range.to, parentEnd, '', '');
    return before.length === 0 && after.length === 0;
}

function caretClientRect(editor: NodeViewServices['editor'], pos: number): DOMRect {
    try {
        const coords = editor.view.coordsAtPos(pos);
        return new DOMRect(coords.left, coords.top, 0, coords.bottom - coords.top);
    } catch {
        return new DOMRect();
    }
}

function openSlashAddPanel(
    services: NodeViewServices,
    context: InsertionContext,
    insertPos: number,
): void {
    const kinds = BLOCK_INSERT_KINDS;
    const items = [...services.insertion.query({ context, kinds })];
    if (!items.length) return;

    const getClientRect = (): DOMRect | null => caretClientRect(services.editor, insertPos);
    const anchor = getClientRect() ?? new DOMRect();
    const fieldHandle = services.manifest.field.fieldHandle?.trim() || '';
    const preferred = readBlockInsertView(fieldHandle);

    const onSelect = (id: string): Promise<boolean> => {
        const fresh = services.insertion.buildContext('slash', insertPos);
        if (!fresh || !contextStillValid(context, fresh)) {
            return Promise.resolve(false);
        }
        return executeInsertion(services, fresh, id);
    };

    const onViewChange = (view: 'list' | 'grid'): void => {
        writeBlockInsertView(fieldHandle, view);
        const freshItems = [...services.insertion.query({ context, kinds })];
        if (view === 'grid') {
            slashPalette.close({ restoreFocus: false, animate: false });
            slashBrowse.open(services, context, freshItems, {
                onView: (next) => {
                    writeBlockInsertView(fieldHandle, next);
                    if (next === 'list') {
                        slashBrowse.close();
                        openSlashAddPanel(services, context, insertPos);
                    }
                },
                onSelect,
            });
            return;
        }
        slashBrowse.close();
        openSlashAddPanel(services, context, insertPos);
    };

    if (preferred === 'grid') {
        slashBrowse.open(services, context, items, {
            onView: onViewChange,
            onSelect,
        });
        return;
    }

    slashPalette.open(services, context, anchor, {
        kinds,
        getClientRect,
        // Same UI as gutter `+`: in-panel Search…, autofocus.
        filterMode: 'panel',
        autofocusFilter: true,
        holdFieldFocus: true,
        onRestoreFocus: () => {
            services.editor.commands.focus(undefined, { scrollIntoView: false });
        },
        onViewChange,
        onSelect,
    });
}

export function createSlashExtension(services: () => NodeViewServices) {
    return Extension.create({
        name: 'vizySlash',
        addProseMirrorPlugins() {
            return [
                Suggestion({
                    pluginKey: VizySlashPluginKey,
                    editor: this.editor,
                    char: '/',
                    // Blank-line only: never mid-sentence / mid-word.
                    startOfLine: true,
                    allowedPrefixes: null,
                    allow: ({ range, state }) => {
                        if (!isBlankLineSlashTrigger(state, range)) return false;
                        return slashAllowed(services(), range.from) !== null;
                    },
                    // Non-empty stub so TipTap calls onStart for bare `/`; the
                    // real catalog loads in the shared Add Block panel.
                    items: () => [{}],
                    render: () => ({
                        onStart: (props: SuggestionProps) => {
                            const svc = services();
                            const range = props.range;
                            if (!isBlankLineSlashTrigger(svc.editor.state, range)) return;
                            const context = slashAllowed(svc, range.from);
                            if (!context) return;

                            // Consume `/` and leave TipTap Suggestion; panel owns Search.
                            handoffToPanel = true;
                            const insertPos = range.from;
                            svc.editor.chain().focus().deleteRange(range).run();
                            exitSuggestion(svc.editor.view, VizySlashPluginKey);

                            const fresh = svc.insertion.buildContext('slash', insertPos) ?? context;
                            if (fresh.contentType === 'blocks') {
                                handoffToPanel = false;
                                return;
                            }
                            openSlashAddPanel(svc, fresh, insertPos);
                            handoffToPanel = false;
                        },
                        onExit: () => {
                            if (handoffToPanel) return;
                            slashPalette.close({ restoreFocus: false, animate: false });
                            slashBrowse.close();
                        },
                    }),
                    command: () => undefined,
                }),
            ];
        },
    });
}
