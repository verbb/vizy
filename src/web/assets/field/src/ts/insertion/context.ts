import { NodeSelection } from '@tiptap/pm/state';
import type { InsertionContext, InsertionRuntime, InsertionSurface } from './types';
import { blockDepth, directBlocks, resolveContainer } from './policy-helpers';

export function buildInsertionContext(
    runtime: InsertionRuntime,
    surface: InsertionSurface,
    editorId: string,
    position?: number,
): InsertionContext | null {
    const { editor, manifest, documentRevision } = runtime;
    const { state } = editor;
    const from = position ?? state.selection.from;
    const to = position ?? state.selection.to;
    const container = resolveContainer(state.doc, from, manifest);

    let selectionKind: InsertionContext['selectionKind'] = 'text';
    if (state.selection instanceof NodeSelection) {
        selectionKind = 'node';
    } else if (state.selection.empty) {
        selectionKind = 'gap';
    }

    const directBlockCount = directBlocks(container.node).length;

    return {
        editorId,
        surface,
        from,
        to,
        selectionKind,
        container: { kind: 'root' },
        contentType: container.contentType,
        directBlockCount,
        minBlocks: container.minBlocks,
        maxBlocks: container.maxBlocks,
        depth: blockDepth(state.doc, from),
        schemaRevision: manifest.schemaRevision,
        documentRevision: String(documentRevision()),
    };
}

export function contextsMatchForExecution(stored: InsertionContext, fresh: InsertionContext): boolean {
    return stored.schemaRevision === fresh.schemaRevision
        && stored.documentRevision === fresh.documentRevision
        && stored.from === fresh.from
        && stored.to === fresh.to
        && stored.surface === fresh.surface
        && JSON.stringify(stored.container) === JSON.stringify(fresh.container);
}
