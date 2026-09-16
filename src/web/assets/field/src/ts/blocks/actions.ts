import type { Editor } from '@tiptap/core';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { Fragment, Slice } from '@tiptap/pm/model';
import { recursiveRegenerateAuthoredUids } from '../identity';
import type { CanonicalNode, EditorManifest } from '../types';
import type { InsertionRegistry } from '../insertion/types';
import type { FieldLayoutDestination } from '../FieldLayoutLoader';
import { playBlockInsertAnimation } from './block-insert-animation';

export type { FieldLayoutDestination };

export function findBlockPosition(editor: Editor, blockUid: string): number | null {
    let found: number | null = null;
    editor.state.doc.descendants((node, pos) => {
        if (node.type.name === 'vizyBlock' && String(node.attrs.blockUid) === blockUid) {
            found = pos;
            return false;
        }
        return found === null;
    });
    return found;
}

export function findBlockNode(editor: Editor, blockUid: string): { node: ProseMirrorNode; pos: number } | null {
    const pos = findBlockPosition(editor, blockUid);
    if (pos == null) return null;
    const node = editor.state.doc.nodeAt(pos);
    if (!node || node.type.name !== 'vizyBlock') return null;
    return { node, pos };
}

/** Destination for a live Block — FieldLayout is always root (Hosted nesting elsewhere). */
export function findBlockDestination(
    editor: Editor,
    blockUid: string,
): FieldLayoutDestination | null {
    if (!findBlockNode(editor, blockUid)) return null;
    return { kind: 'root' };
}

/**
 * Every mountable vizyBlock in a JSON tree. Leaf Blocks have no TipTap children;
 * Hosted nested editors boot their own FieldLayouts from Craft field mounts.
 */
export function collectMountableBlockPrefetch(
    node: CanonicalNode | Record<string, unknown>,
    rootDestination: FieldLayoutDestination,
    manifest: EditorManifest,
): Array<{
    blockUid: string;
    blockTypeUid: string;
    block: Record<string, unknown>;
    destination: FieldLayoutDestination;
}> {
    const items: Array<{
        blockUid: string;
        blockTypeUid: string;
        block: Record<string, unknown>;
        destination: FieldLayoutDestination;
    }> = [];

    const walk = (
        current: Record<string, unknown>,
        destination: FieldLayoutDestination,
    ): void => {
        if (current.type !== 'vizyBlock') {
            const content = current.content;
            if (Array.isArray(content)) {
                for (const child of content) {
                    if (child && typeof child === 'object') {
                        walk(child as Record<string, unknown>, destination);
                    }
                }
            }
            return;
        }

        const attrs = (current.attrs ?? {}) as Record<string, unknown>;
        const blockUid = String(attrs.blockUid ?? '');
        const blockTypeUid = String(attrs.blockTypeUid ?? '');
        const type = manifest.blockTypes[blockTypeUid];
        if (blockUid && type?.fieldLayoutUid) {
            items.push({
                blockUid,
                blockTypeUid,
                block: current,
                destination,
            });
        }
        // Leaf Block — do not walk TipTap children for nested Blocks.
    };

    walk(node as Record<string, unknown>, rootDestination);
    return items;
}

export interface DuplicateBlockOptions {
    manifest: EditorManifest;
    documentRevision: () => number;
    prefetchNewBlocks: (items: Array<{
        blockUid: string;
        blockTypeUid: string;
        block: Record<string, unknown>;
        destination: FieldLayoutDestination;
        documentRevision: number;
    }>) => Promise<void>;
    animateInsert?: (blockUid: string) => void;
    /** Capture mounted Craft field values into TipTap before snapshotting. */
    flushMountedFields?: () => void;
}

/**
 * Duplicate after FieldLayouts for the copy (and nested Blocks) are ready —
 * Matrix-style: wait, then insert a complete card with grow-in.
 */
export async function duplicateBlock(
    editor: Editor,
    blockUid: string,
    options?: DuplicateBlockOptions,
): Promise<boolean> {
    // Flush mounted Craft controls first so the duplicate snapshot includes
    // unsaved Plain Text / Hosted edits (not only last published attrs).
    options?.flushMountedFields?.();

    const found = findBlockNode(editor, blockUid);
    if (!found) return false;
    const json = found.node.toJSON() as CanonicalNode;
    const copy = recursiveRegenerateAuthoredUids(json, undefined, options?.manifest.blockTypes);
    const rootUid = String((copy.attrs as { blockUid?: string } | undefined)?.blockUid ?? '');
    if (!rootUid) return false;

    if (options) {
        const destination = findBlockDestination(editor, blockUid) ?? { kind: 'root' };
        const revision = options.documentRevision();
        const prefetchItems = collectMountableBlockPrefetch(copy, destination, options.manifest)
            .map((item) => ({ ...item, documentRevision: revision }));
        if (prefetchItems.length) {
            try {
                await options.prefetchNewBlocks(prefetchItems);
            } catch {
                // Still insert; open() will retry after NodeView construction.
            }
        }
    }

    // Re-resolve by UID after await — edits/moves/deletes can invalidate `found.pos`.
    const latest = findBlockNode(editor, blockUid);
    if (!latest) return false;

    const duplicated = editor.schema.nodeFromJSON(copy);
    const insertPos = latest.pos + latest.node.nodeSize;
    editor.view.dispatch(editor.state.tr.insert(insertPos, duplicated).scrollIntoView());
    (options?.animateInsert ?? playBlockInsertAnimation)(rootUid);
    return true;
}

export function deleteBlock(editor: Editor, blockUid: string): boolean {
    const found = findBlockNode(editor, blockUid);
    if (!found) return false;
    editor.view.dispatch(
        editor.state.tr.delete(found.pos, found.pos + found.node.nodeSize).scrollIntoView(),
    );
    return true;
}

export function toggleBlockEnabled(editor: Editor, blockUid: string): boolean {
    const found = findBlockNode(editor, blockUid);
    if (!found) return false;
    const enabled = !found.node.attrs.enabled;
    editor.view.dispatch(
        editor.state.tr.setNodeMarkup(found.pos, undefined, {
            ...found.node.attrs,
            enabled,
        }).scrollIntoView(),
    );
    return true;
}

export function moveBlockByOffset(editor: Editor, blockUid: string, direction: -1 | 1): boolean {
    const found = findBlockNode(editor, blockUid);
    if (!found) return false;
    const $pos = editor.state.doc.resolve(found.pos);
    const parent = $pos.parent;
    const index = $pos.index();
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= parent.childCount) return false;
    // Map the far side of the sibling through deletion, so moving down
    // inserts after that sibling rather than back at the source position.
    const targetPos = direction < 0
        ? found.pos - parent.child(index - 1).nodeSize
        : found.pos + found.node.nodeSize + parent.child(index + 1).nodeSize;
    const slice = new Slice(Fragment.from(found.node), 0, 0);
    let tr = editor.state.tr.delete(found.pos, found.pos + found.node.nodeSize);
    const mapped = tr.mapping.map(targetPos);
    tr = tr.replaceRange(mapped, mapped, slice);
    editor.view.dispatch(tr.scrollIntoView());
    return true;
}

export function copyBlockSubtree(editor: Editor, blockUid: string): CanonicalNode | null {
    const found = findBlockNode(editor, blockUid);
    if (!found) return null;
    return found.node.toJSON() as CanonicalNode;
}

/**
 * Choices for "Add Block above" on the subject Block (insert at its document
 * position). Only input-free Block types — anything needing further input
 * belongs on slash / Browse surfaces.
 */
export function queryAddBlockAbove(
    editor: Editor,
    registry: InsertionRegistry,
    blockUid: string,
): ReturnType<InsertionRegistry['query']> {
    const found = findBlockNode(editor, blockUid);
    if (!found) return [];

    const context = registry.buildContext('inline', found.pos);
    if (!context) return [];

    return registry.query({ context, kinds: ['block'] }).filter((entry) => !entry.item.requiresInput);
}

/**
 * Matrix-style "Add Block above": insert immediately when exactly one Block
 * type is available at the subject. Callers that need a picker when there are
 * several types go through InsertionOverlay.openAddBlockAbove instead.
 */
export async function addBlockAbove(
    editor: Editor,
    registry: InsertionRegistry,
    blockUid: string,
): Promise<'inserted' | 'needsChoice' | 'cancelled'> {
    const found = findBlockNode(editor, blockUid);
    if (!found) return 'cancelled';

    const context = registry.buildContext('inline', found.pos);
    if (!context) return 'cancelled';

    const results = registry.query({ context, kinds: ['block'] });
    const eligible = results.filter((entry) => !entry.item.requiresInput);
    if (eligible.length === 0) return 'cancelled';
    if (eligible.length > 1) return 'needsChoice';

    const result = await registry.execute({ id: eligible[0]!.item.id, context });
    return result.status === 'inserted' ? 'inserted' : 'cancelled';
}

/** Menu label: `Add {Name} above` when one type, else generic Matrix copy. */
export function addBlockAboveLabel(
    editor: Editor,
    registry: InsertionRegistry,
    blockUid: string,
): string {
    const choices = queryAddBlockAbove(editor, registry, blockUid);
    if (choices.length === 1) {
        return `Add ${choices[0]!.item.label} above`;
    }
    return 'Add Block above';
}
