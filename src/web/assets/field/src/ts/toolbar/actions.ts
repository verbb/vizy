import type { Editor } from '@tiptap/core';
import { activateLinkControl } from '../semantic/link-ui';
import { activateImageControl, type VizyImageAuthoringConfig } from '../semantic/image-ui';
import { activateUrlNodeControl } from '../semantic/embed-ui';
import { activateLayoutControl } from '../layout/layout-ui';
import type { LayoutPreset } from '../layout/presets';
import type { TableOperation, ToolbarActionManifest, ToolbarControlManifest } from '../types';
import { getRegisteredControl } from '../external-registry';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/** Matches the slash command's table, so both surfaces open the same starting grid. */
const TABLE_DEFAULTS = { rows: 3, cols: 3, withHeaderRow: true } as const;

/**
 * The one place that knows how a toolbar action reaches TipTap.
 *
 * Buttons and menu options both come through here. They used to be two hardcoded
 * ladders — `#activate` for buttons, `#applyOption` for the Formatting dropdown —
 * which is how `bulletList` came to work as a button but could not have worked as a
 * menu option. Author-defined dropdowns make that split untenable, since any button
 * may now appear inside a menu.
 *
 * `options.focus` defaults to “editor already has DOM focus”. The standing toolbar
 * must not steal focus when the author was elsewhere (Craft title, another field);
 * when they *were* writing, focus is reclaimed so typing continues after the click.
 *
 * Returns whether the command ran, so a control naming something this asset cannot
 * do is dropped rather than rendered as a dead button. That case is real: a config
 * saved against a newer Vizy can meet an older cached field bundle.
 */
export function runToolbarAction(
    editor: Editor,
    action: ToolbarActionManifest,
    options?: {
        focus?: boolean;
        imageAuthoring?: VizyImageAuthoringConfig;
        layoutPresets?: readonly LayoutPreset[];
        invoker?: HTMLElement | null;
        /** Toolbar control id — used for third-party {@link registerControl} runners. */
        controlId?: string;
    },
): boolean {
    // Default: only claim focus when ProseMirror already has it. Callers that
    // opened a menu while focused pass `focus: true` explicitly — by select time
    // DOM focus is usually in the portaled panel.
    const focus = options?.focus ?? editor.view.hasFocus();

    // Third-party registered runners win when present (custom dialogs / commands).
    const registered = options?.controlId ? getRegisteredControl(options.controlId) : undefined;
    if (registered) {
        if (focus) editor.chain().focus().run();
        const result = registered.run(editor);
        return result !== false;
    }

    // Behaviour-only extensions have no PHP fallback command.
    if (action.command === 'registeredControl') {
        return false;
    }

    if (action.command === 'setLink') {
        activateLinkControl(editor, 'link', { focus });
        return true;
    }

    if (action.command === 'insertNode' && action.nodeName === 'image') {
        activateImageControl(editor, options?.imageAuthoring ?? {}, { focus });
        return true;
    }

    if (action.command === 'insertNode' && (action.nodeName === 'iframe' || action.nodeName === 'mediaEmbed')) {
        activateUrlNodeControl(editor, action.nodeName, { focus });
        return true;
    }

    if (action.command === 'wrapInLayout') {
        // Same preset chooser as slash/gutter Layout. Empty caret inserts;
        // wrapable selection wraps; caret inside a layout unwraps.
        return activateLayoutControl(editor, {
            focus,
            presets: options?.layoutPresets,
            invoker: options?.invoker,
        });
    }

    const chain = focus ? editor.chain().focus() : editor.chain();

    switch (action.command) {
        case 'toggleMark':
            chain.toggleMark(action.markName).run();
            return true;
        case 'setParagraph':
            chain.setParagraph().run();
            return true;
        case 'setHeading':
            if (!isHeadingLevel(action.level)) return false;
            chain.toggleHeading({ level: action.level }).run();
            return true;
        case 'toggleNode':
            return toggleNode(chain, action.nodeName);
        case 'insertNode':
            return insertNode(editor, action.nodeName, focus);
        case 'setTextAlign':
            // Pressing the alignment already in force clears it, so the button reads as a
            // toggle the way every other one here does rather than as a one-way apply.
            if (editor.isActive({ textAlign: action.align })) {
                chain.unsetTextAlign().run();
                return true;
            }
            chain.setTextAlign(action.align).run();
            return true;
        case 'clearFormatting':
            // Marks and block wrappers both, since "clear formatting" that left a heading
            // a heading would surprise: `clearNodes` returns the selection to paragraphs.
            chain.unsetAllMarks().clearNodes().run();
            return true;
        case 'openAddBlock':
            // Handled by VizyToolbarElement → InsertionOverlay, not TipTap.
            return false;
        case 'undo':
            chain.undo().run();
            return true;
        case 'redo':
            chain.redo().run();
            return true;
        case 'tableOperation':
            return runTableOperation(chain, action.operation);
        default:
            return false;
    }
}

/**
 * Runs one table operation, if there is a table to run it on.
 *
 * The operation names are TipTap's own command names, so this is a lookup rather than a
 * ladder. Two things can make one unavailable and both end in `false` rather than a throw:
 * the Table capability may be off, in which case the commands were never registered and a
 * stored config can still name the button; or the cursor may be outside a table, where
 * ProseMirror's own commands decline. Returning false is what stops a dead button rendering.
 */
function runTableOperation(chain: ReturnType<Editor['chain']>, operation: TableOperation): boolean {
    const command = (chain as unknown as Record<string, unknown>)[operation];
    if (typeof command !== 'function') return false;

    return (command as () => ReturnType<Editor['chain']>).call(chain).run();
}

/**
 * Node toggles are per-node commands in TipTap rather than one generic call, so this
 * stays a table. A node absent from it has no toggle and is offered as an insertion
 * instead — see `TOGGLEABLE_NODES`, which the server reads the same way.
 */
function toggleNode(chain: ReturnType<Editor['chain']>, nodeName: string): boolean {
    switch (nodeName) {
        case 'heading':
            // A bare Heading button carries no level, so it falls back to the second
            // level. The config's own default is applied server-side, which is why
            // reaching this is unusual.
            chain.toggleHeading({ level: 2 }).run();
            return true;
        case 'bulletList':
            chain.toggleBulletList().run();
            return true;
        case 'orderedList':
            chain.toggleOrderedList().run();
            return true;
        case 'blockquote':
            chain.toggleBlockquote().run();
            return true;
        case 'codeBlock':
            chain.toggleCodeBlock().run();
            return true;
        default:
            return false;
    }
}

/**
 * Placing a block, rather than wrapping the selection in one.
 *
 * Mirrors `executeNodeInsertion`, which the slash command uses: a rule and a table
 * have their own extension commands, and anything else is built to its schema
 * minimum, since wrapper nodes are invalid while empty. ProseMirror throws on
 * invalid content rather than returning false, hence the catch.
 */
function insertNode(editor: Editor, nodeName: string, focus: boolean): boolean {
    const chain = focus ? editor.chain().focus() : editor.chain();
    if (nodeName === 'horizontalRule') {
        return chain.setHorizontalRule().run();
    }
    if (nodeName === 'table') {
        return chain.insertTable(TABLE_DEFAULTS).run();
    }
    // Its own command, rather than the generic insert below: a hard break has to split the
    // text node at the cursor, and placing a created one would drop it beside the text
    // instead of into it.
    if (nodeName === 'hardBreak') {
        return chain.setHardBreak().run();
    }

    const type = editor.schema.nodes[nodeName];
    if (!type) return false;

    try {
        const node = type.createAndFill();
        if (!node) return false;
        return chain.insertContent(node.toJSON()).run();
    } catch {
        return false;
    }
}

/** Whether a control's action is one this asset can carry out. */
export function isActionable(control: ToolbarControlManifest): boolean {
    if (getRegisteredControl(control.id)) return true;
    const action = control.action;
    if (!action) return false;
    if (action.command === 'toggleNode') return TOGGLEABLE_NODES.includes(action.nodeName);
    if (action.command === 'setHeading') return isHeadingLevel(action.level);
    return KNOWN_COMMANDS.includes(action.command);
}

/** Whether a control is currently in force, for `aria-pressed`. */
export function isActionActive(
    editor: Editor,
    action: ToolbarActionManifest | undefined,
    controlId?: string,
): boolean {
    const registered = controlId ? getRegisteredControl(controlId) : undefined;
    if (registered?.isActive) {
        return !!registered.isActive(editor);
    }
    if (!action) return false;
    switch (action.command) {
        case 'toggleMark':
            return editor.isActive(action.markName);
        case 'setLink':
            return editor.isActive('link');
        case 'insertNode':
            if (action.nodeName === 'image') return editor.isActive('image');
            if (action.nodeName === 'iframe') return editor.isActive('iframe');
            if (action.nodeName === 'mediaEmbed') return editor.isActive('mediaEmbed');
            return false;
        case 'toggleNode':
            return editor.isActive(action.nodeName);
        case 'setParagraph':
            return editor.isActive('paragraph');
        case 'setHeading':
            return editor.isActive('heading', { level: action.level });
        case 'setTextAlign':
            return editor.isActive({ textAlign: action.align });
        case 'wrapInLayout':
            return editor.isActive('layout');
        default:
            // Placing a block, undoing, redoing, clearing formatting and editing a table are
            // things done to the selection rather than states it can be in. The header toggles
            // come closest to having a state, but it belongs to the row or column the cursor
            // happens to be in rather than to the button.
            return false;
    }
}

const TOGGLEABLE_NODES = ['heading', 'bulletList', 'orderedList', 'blockquote', 'codeBlock'];

const KNOWN_COMMANDS: ToolbarActionManifest['command'][] = [
    'toggleNode',
    'insertNode',
    'toggleMark',
    'setParagraph',
    'setHeading',
    'setLink',
    'setTextAlign',
    'clearFormatting',
    'undo',
    'redo',
    'wrapInLayout',
    'openAddBlock',
    'tableOperation',
];

function isHeadingLevel(level: number): level is HeadingLevel {
    return Number.isInteger(level) && level >= 1 && level <= 6;
}
