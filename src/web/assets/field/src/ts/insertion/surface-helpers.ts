import type { NodeViewServices } from '../extensions';
import type { EditorManifest } from '../types';
import type { AvailableInsertion, InsertionContext, InsertionSurface } from './types';
import { LAYOUT_INSERTION_ID } from '../layout/insertion';
import { LayoutPresetChooser } from '../layout/preset-chooser';
import { resolveLayoutPresets } from '../layout/presets';

const layoutPresetChooser = new LayoutPresetChooser();

export function contextStillValid(
    stored: InsertionContext,
    fresh: InsertionContext | null,
): fresh is InsertionContext {
    if (!fresh) return false;
    return stored.schemaRevision === fresh.schemaRevision
        && JSON.stringify(stored.container) === JSON.stringify(fresh.container);
}

export function isSimpleRichTextField(manifest: EditorManifest): boolean {
    // Rich Text Only keeps configured `allowedBlockTypeUids` for lossless mode
    // switching, but `insertableBlockTypeUids` is empty — same as a field with
    // no Block Types. Insertion surfaces (gutter `+`, Add Block) must follow
    // insertable, not allowed.
    return (manifest.field.insertableBlockTypeUids ?? []).length === 0;
}

export function oneChoiceDirect(results: readonly AvailableInsertion[]): AvailableInsertion | null {
    const eligible = results.filter((entry) => !entry.item.requiresInput);
    return eligible.length === 1 ? eligible[0] : null;
}

export async function executeInsertion(
    services: NodeViewServices,
    context: InsertionContext,
    itemId: string,
    anchor?: DOMRect,
): Promise<boolean> {
    const fresh = services.insertion.buildContext(context.surface, context.from);
    if (!fresh || !contextStillValid(context, fresh)) return false;
    const result = await services.insertion.execute({ id: itemId, context: fresh });
    if (result.status === 'inserted') return true;
    if (result.status === 'opened' && itemId === LAYOUT_INSERTION_ID) {
        return openLayoutPresetChooser(services, fresh, anchor);
    }
    return result.status === 'opened';
}

function openLayoutPresetChooser(
    services: NodeViewServices,
    context: InsertionContext,
    anchor?: DOMRect,
): Promise<boolean> {
    const presets = resolveLayoutPresets(services.manifest);
    const mount = services.editor.view.dom.closest('.vizy-editor-surface')?.parentElement
        ?? services.editor.view.dom.parentElement;
    if (!mount || !presets.length) return Promise.resolve(false);

    const rect = anchor ?? services.editor.view.coordsAtPos(context.from);
    const domRect = anchor ?? new DOMRect(rect.left, rect.top, 1, rect.bottom - rect.top);

    return new Promise((resolve) => {
        layoutPresetChooser.open(domRect, presets, mount, {
            returnFocus: services.editor.view.dom as HTMLElement,
            onSelect: (presetId) => {
                void services.insertion.execute({
                    id: LAYOUT_INSERTION_ID,
                    context,
                    input: { presetId },
                }).then((followUp) => resolve(followUp.status === 'inserted'));
            },
            onClose: () => resolve(false),
        });
    });
}

export interface InsertionAnchor {
    readonly position: number;
    readonly context: InsertionContext;
    /**
     * Which node's DOM box locates this button vertically, and which of its
     * edges. Every "after" boundary measures the bottom of the child it follows;
     * the leading boundary measures the top of the first child.
     *
     * The boundary's own `position` is deliberately not used for measurement:
     * `coordsAtPos()` describes a text caret, and either side of a Block it can
     * report the same degenerate rect, which stacked the above/below buttons.
     */
    readonly measurePos: number;
    readonly measureSide: 'top' | 'bottom';
}

interface Boundary {
    readonly position: number;
    readonly measurePos: number;
    readonly measureSide: 'top' | 'bottom';
}

let inlineAnchorCache: { docSize: number; anchors: InsertionAnchor[] } | null = null;

/** Drop cached anchors when the document changes or a sync pass begins. */
export function invalidateInlineAnchorCache(): void {
    inlineAnchorCache = null;
}

export function findInlineAnchors(
    services: NodeViewServices,
    surface: InsertionSurface = 'inline',
): InsertionAnchor[] {
    const { editor } = services;
    const docSize = editor.state.doc.content.size;
    if (inlineAnchorCache?.docSize === docSize) {
        return inlineAnchorCache.anchors;
    }
    const anchors: InsertionAnchor[] = [];
    const visitContainer = (
        node: import('@tiptap/pm/model').Node,
        basePos: number,
        contentType: 'rich' | 'blocks',
    ): void => {
        // `doc` holds its children at position 0; every other container node
        // wraps them, so its content starts one position inside itself.
        const contentStart = node.type.name === 'doc' ? basePos : basePos + 1;
        const boundaries: Boundary[] = [];
        let offset = contentStart;
        node.forEach((child) => {
            const childStart = offset;
            offset += child.nodeSize;
            // A blocks-only container can hold nothing but Blocks, so only Block
            // edges are boundaries. A rich container takes every top-level edge,
            // because prose nodes are insertion targets in their own right —
            // that is what "between nodes" means for insertion anchors.
            if (contentType === 'blocks' && child.type.name !== 'vizyBlock') return;
            if (boundaries.length === 0) {
                boundaries.push({ position: contentStart, measurePos: childStart, measureSide: 'top' });
            }
            boundaries.push({ position: offset, measurePos: childStart, measureSide: 'bottom' });
        });
        if (boundaries.length === 0) {
            // Nothing to sit between, so the sole boundary is "inside here".
            boundaries.push({ position: contentStart, measurePos: contentStart, measureSide: 'top' });
        }

        for (const boundary of boundaries) {
            const context = services.insertion.buildContext(surface, boundary.position);
            if (!context) continue;
            if (!services.insertion.query({ context, limit: 1 }).length) continue;
            anchors.push({ ...boundary, context });
        }
    };

    // A plain rich-text field (or Rich Text Only) has nothing structural to add
    // and ordinary typing as its empty state, so it deliberately gets no `+`.
    if (!isSimpleRichTextField(services.manifest)) {
        visitContainer(editor.state.doc, 0, services.manifest.field.rootContentType);
    }

    inlineAnchorCache = { docSize, anchors };
    return anchors;
}
