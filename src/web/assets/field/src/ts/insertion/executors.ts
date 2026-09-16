import type { InsertionContext, InsertionResult, InsertionRuntime } from './types';
import { canPlaceBlockTypeAtDepth, sameBlockTypeMaxDepth } from '../blocks/nesting-depth';
import { blockLevelInsertTarget } from './insert-target';

/** Leaf Block JSON — empty TipTap content; Craft fields + Hosted Vizy live in FieldLayout. */
function buildBlockNode(
    blockTypeUid: string,
    blockUid: string,
): Record<string, unknown> {
    return {
        type: 'vizyBlock',
        attrs: {
            blockUid,
            blockTypeUid,
            enabled: true,
            fieldSlots: {},
        },
    };
}

function insertPosition(context: InsertionContext): number {
    return context.from;
}

export async function executeBlockInsertion(
    blockTypeUid: string,
    context: InsertionContext,
    runtime: InsertionRuntime,
): Promise<InsertionResult> {
    const { editor, createUid } = runtime;
    const blockUid = createUid();
    const nodeJson = buildBlockNode(blockTypeUid, blockUid);
    const pos = insertPosition(context);

    // Prefetch FieldLayout HTML before the node exists so first paint is complete
    // — never shell-then-fields. Types with no Craft layout skip this.
    const type = runtime.manifest.blockTypes[blockTypeUid];
    if (type?.fieldLayoutUid && runtime.prefetchBlockFieldLayout) {
        try {
            await runtime.prefetchBlockFieldLayout({
                blockUid,
                blockTypeUid,
                block: nodeJson,
                destination: { kind: 'root' },
            });
        } catch {
            // Still insert: open() will retry after NodeView construction.
        }
    }

    const before = editor.state.doc;
    const target = blockLevelInsertTarget(before, pos);
    // No `.focus()` here: Add block / palette clicks run in the same turn as the
    // pointer gesture, and focusing a contenteditable mid-click select-alls the
    // whole ProseMirror surface in Chromium. Destination comes from `target`.
    const inserted = editor
        .chain()
        // Do not park the caret inside the new Block — leaf Blocks have no
        // TipTap writing surface; Hosted fields are a separate gesture.
        .insertContentAt(target, nodeJson, { updateSelection: false })
        .run();
    // TipTap can report success for a transaction ContentPolicy then rejects —
    // claim insert only when the doc actually changed (replace of empty p may
    // not increase content.size).
    if (!inserted || editor.state.doc.eq(before)) {
        return { status: 'cancelled' };
    }
    runtime.animateBlockInsert?.(blockUid);
    return { status: 'inserted', blockUid };
}

const TABLE_INSERT_DEFAULTS = { rows: 3, cols: 3, withHeaderRow: true } as const;

export function executeNodeInsertion(
    nodeName: string,
    context: InsertionContext,
    runtime: InsertionRuntime,
): InsertionResult {
    const { editor } = runtime;
    const type = editor.schema.nodes[nodeName];
    if (!type) return { status: 'cancelled' };

    // ProseMirror throws on invalid content rather than returning false, and this
    // runs inside an async executor, so a raw throw surfaces as an unhandled
    // rejection and the surface never learns the insertion failed.
    try {
        // A table filled to its schema minimum is a useless 1x1 grid, so use the
        // Table extension's own command to get a real starting grid.
        if (nodeName === 'table') {
            const inserted = editor
                .chain()
                .focus(undefined, { scrollIntoView: false })
                .setTextSelection(context.from)
                .insertTable(TABLE_INSERT_DEFAULTS)
                .run();
            return inserted ? { status: 'inserted' } : { status: 'cancelled' };
        }

        // TipTap's Heading defaults its `level` attribute to 1 whatever levels the schema was
        // built from, so a generic `createAndFill` on a config that disallows H1 produces a
        // heading that renders as one level and is stored as another — and is then a violation
        // on save. Insert at the first level the config actually allows instead.
        if (nodeName === 'heading') {
            const level = runtime.manifest.headingLevels?.[0];
            const heading = type.createAndFill(level ? { level } : null);
            if (!heading) return { status: 'cancelled' };

            const before = editor.state.doc;
            const target = blockLevelInsertTarget(before, context.from);
            const inserted = editor
                .chain()
                .focus(undefined, { scrollIntoView: false })
                .insertContentAt(target, heading.toJSON(), { updateSelection: true })
                .run();
            return inserted && !editor.state.doc.eq(before)
                ? { status: 'inserted' }
                : { status: 'cancelled' };
        }

        // Wrapper nodes (blockquote, lists, …) are invalid while empty, so build
        // the minimum valid subtree instead of inserting a bare `{ type }` node.
        const node = type.createAndFill();
        if (!node) return { status: 'cancelled' };

        const before = editor.state.doc;
        const target = blockLevelInsertTarget(before, context.from);
        const inserted = editor
            .chain()
            .focus(undefined, { scrollIntoView: false })
            .insertContentAt(target, node.toJSON(), { updateSelection: true })
            .run();
        return inserted && !editor.state.doc.eq(before)
            ? { status: 'inserted' }
            : { status: 'cancelled' };
    } catch {
        return { status: 'cancelled' };
    }
}

export function blockTypeAllowedInContext(
    blockTypeUid: string,
    context: InsertionContext,
    runtime: InsertionRuntime,
): boolean {
    const { manifest, editor } = runtime;
    if (!manifest.blockTypes[blockTypeUid]) return false;
    // Insertion uses the insertable subset; `allowedBlockTypeUids` stays the
    // permission/validation surface so field-locally disabled types keep
    // working for Blocks already authored with them.
    if (!manifest.field.insertableBlockTypeUids.includes(blockTypeUid)) return false;
    // Same-type consecutive depth at the root / layout surface.
    return canPlaceBlockTypeAtDepth(
        editor.state.doc,
        context.from,
        blockTypeUid,
        sameBlockTypeMaxDepth(manifest),
    );
}
