import type { Editor } from '@tiptap/core';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { Fragment } from '@tiptap/pm/model';
import { NodeSelection, TextSelection, type Transaction } from '@tiptap/pm/state';
import type { LayoutPreset } from './presets';
import {
    findLayoutByUid,
    findColumnByUid,
    layoutChildOffset,
    columnIndexInLayout,
    selectionTouchesLayout,
    isInsideColumn,
} from './lookup';
import { defaultTwoColumnPreset, gutterCandidates, resolveLayoutPresets } from './presets';

function emptyParagraph(schema: ProseMirrorNode['type']['schema']): ProseMirrorNode {
    return schema.nodes.paragraph.create();
}

function columnNode(
    schema: ProseMirrorNode['type']['schema'],
    columnUid: string,
    span: number,
    content: ProseMirrorNode[] = [],
): ProseMirrorNode {
    const columnType = schema.nodes.column;
    const inner = content.length ? content : [emptyParagraph(schema)];
    return columnType.create({ columnUid, span }, inner);
}

function buildLayoutNode(
    schema: ProseMirrorNode['type']['schema'],
    preset: LayoutPreset,
    layoutUid: string,
    stack: string,
    createUid: () => string,
    columnContents?: ProseMirrorNode[][],
): ProseMirrorNode {
    const columns = preset.spans.map((span, index) => columnNode(
        schema,
        createUid(),
        span,
        columnContents?.[index] ?? [],
    ));
    return schema.nodes.layout.create({ layoutUid, stack }, columns);
}

export function insertLayout(
    editor: Editor,
    preset: LayoutPreset,
    pos: number,
    createUid: () => string,
    stack = 'small',
): boolean {
    if (!editor.schema.nodes.layout || !editor.schema.nodes.column) return false;
    const layout = buildLayoutNode(editor.schema, preset, createUid(), stack, createUid);
    return editor.chain().focus().insertContentAt(pos, layout.toJSON()).run();
}

export function setLayoutPreset(
    editor: Editor,
    layoutUid: string,
    preset: LayoutPreset,
): boolean {
    const located = findLayoutByUid(editor.state.doc, layoutUid);
    if (!located || preset.spans.length !== located.node.childCount) return false;

    let tr = editor.state.tr;
    for (let index = 0; index < located.node.childCount; index += 1) {
        const child = located.node.child(index);
        const offset = layoutChildOffset(located.pos, located.node, index);
        tr = tr.setNodeMarkup(offset, undefined, { ...child.attrs, span: preset.spans[index] });
    }
    editor.view.dispatch(tr.scrollIntoView());
    return true;
}

export function resizeLayoutGutter(
    editor: Editor,
    layoutUid: string,
    leadingColumnUid: string,
    candidateIndex: number,
): boolean {
    const located = findLayoutByUid(editor.state.doc, layoutUid);
    if (!located) return false;
    const leadingIndex = columnIndexInLayout(located.node, leadingColumnUid);
    const trailingIndex = leadingIndex + 1;
    if (leadingIndex < 0 || trailingIndex >= located.node.childCount) return false;

    const leading = located.node.child(leadingIndex);
    const trailing = located.node.child(trailingIndex);
    const leadingSpan = Number(leading.attrs.span ?? 0);
    const trailingSpan = Number(trailing.attrs.span ?? 0);
    const candidates = gutterCandidates(leadingSpan, trailingSpan);
    const pair = candidates[candidateIndex];
    if (!pair) return false;

    let tr = editor.state.tr;
    const leadingOffset = layoutChildOffset(located.pos, located.node, leadingIndex);
    const trailingOffset = layoutChildOffset(located.pos, located.node, trailingIndex);
    tr = tr.setNodeMarkup(leadingOffset, undefined, { ...leading.attrs, span: pair[0] });
    tr = tr.setNodeMarkup(trailingOffset, undefined, { ...trailing.attrs, span: pair[1] });
    editor.view.dispatch(tr.scrollIntoView());
    return true;
}

export function resizeLayoutGutterByDelta(
    editor: Editor,
    layoutPos: number,
    gutterIndex: number,
    delta: number,
): boolean {
    const layout = editor.state.doc.nodeAt(layoutPos);
    if (!layout || layout.type.name !== 'layout') return false;
    const leading = layout.child(gutterIndex);
    const trailing = layout.child(gutterIndex + 1);
    if (!leading || !trailing) return false;
    const leadingSpan = Number(leading.attrs.span ?? 0);
    const trailingSpan = Number(trailing.attrs.span ?? 0);
    const candidates = gutterCandidates(leadingSpan, trailingSpan);
    const currentIndex = candidates.findIndex(([left]) => left === leadingSpan);
    const nextIndex = Math.max(0, Math.min(candidates.length - 1, currentIndex + delta));
    const layoutUid = String(layout.attrs.layoutUid);
    const leadingUid = String(leading.attrs.columnUid);
    return resizeLayoutGutter(editor, layoutUid, leadingUid, nextIndex);
}

/** Commit gutter resize from a pointer drag target leading span. */
export function commitGutterDrag(
    editor: Editor,
    layoutUid: string,
    leadingColumnUid: string,
    targetLeadingSpan: number,
): boolean {
    const located = findLayoutByUid(editor.state.doc, layoutUid);
    if (!located) return false;
    const leadingIndex = columnIndexInLayout(located.node, leadingColumnUid);
    const trailingIndex = leadingIndex + 1;
    if (leadingIndex < 0 || trailingIndex >= located.node.childCount) return false;
    const leadingSpan = Number(located.node.child(leadingIndex).attrs.span ?? 0);
    const trailingSpan = Number(located.node.child(trailingIndex).attrs.span ?? 0);
    const candidates = gutterCandidates(leadingSpan, trailingSpan);
    let bestIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;
    candidates.forEach(([left], index) => {
        const distance = Math.abs(left - targetLeadingSpan);
        if (distance < bestDistance) {
            bestDistance = distance;
            bestIndex = index;
        }
    });
    return resizeLayoutGutter(editor, layoutUid, leadingColumnUid, bestIndex);
}

export function moveColumn(
    editor: Editor,
    columnUid: string,
    direction: -1 | 1,
): boolean {
    const located = findColumnByUid(editor.state.doc, columnUid);
    if (!located || located.parent.type.name !== 'layout') return false;
    const target = located.index + direction;
    if (target < 0 || target >= located.parent.childCount) return false;

    const children: ProseMirrorNode[] = [];
    for (let index = 0; index < located.parent.childCount; index += 1) {
        children.push(located.parent.child(index));
    }
    [children[located.index], children[target]] = [children[target], children[located.index]];
    const fragment = located.parent.type.create(located.parent.attrs, children).content;
    editor.view.dispatch(
        editor.state.tr
            .replaceWith(located.parentPos + 1, located.parentPos + located.parent.content.size, fragment)
            .scrollIntoView(),
    );
    return true;
}

type WrapPlan = {
    replaceFrom: number;
    replaceTo: number;
    selected: ProseMirrorNode[];
};

export function resolveWrapPlan(
    state: Editor['state'],
    from: number,
    to: number,
): WrapPlan | null {
    if (from === to || isInsideColumn(state.doc, from) || isInsideColumn(state.doc, to)
        || selectionTouchesLayout(state.doc, from, to)) return null;
    const layoutType = state.schema.nodes.layout;
    if (!layoutType) return null;
    const selection = state.selection;

    if (selection instanceof NodeSelection) {
        const $pos = state.doc.resolve(selection.from);
        if (!selection.node.isBlock || !$pos.parent.canReplaceWith($pos.index(), $pos.index() + 1, layoutType)) return null;
        return {
            replaceFrom: selection.from,
            replaceTo: selection.to,
            selected: [selection.node],
        };
    }

    // Resolve complete sibling blocks, not inline children of the selected paragraph.
    const range = state.doc.resolve(from).blockRange(state.doc.resolve(to));
    if (!range || !range.parent.canReplaceWith(range.startIndex, range.endIndex, layoutType)) return null;
    const selected: ProseMirrorNode[] = [];
    for (let index = range.startIndex; index < range.endIndex; index += 1) {
        selected.push(range.parent.child(index));
    }
    return { replaceFrom: range.start, replaceTo: range.end, selected };
}

function blockInsertJson(node: ProseMirrorNode): Record<string, unknown> {
    if (node.isTextblock && node.textContent) {
        return {
            type: node.type.name,
            content: [{ type: 'text', text: node.textContent }],
        };
    }
    return node.toJSON() as Record<string, unknown>;
}

export function layoutJsonFromSelection(
    preset: LayoutPreset,
    selected: ProseMirrorNode[],
    createUid: () => string,
    stack: string,
): Record<string, unknown> {
    return {
        type: 'layout',
        attrs: { layoutUid: createUid(), stack },
        content: preset.spans.map((span, index) => ({
            type: 'column',
            attrs: { columnUid: createUid(), span },
            content: index === 0
                ? selected.map((node) => blockInsertJson(node))
                : [{ type: 'paragraph' }],
        })),
    };
}

export function createWrapInLayoutTransaction(
    state: Editor['state'],
    schema: Editor['schema'],
    from: number,
    to: number,
    preset: LayoutPreset,
    createUid: () => string,
    stack = 'small',
): Transaction | null {
    const plan = resolveWrapPlan(state, from, to);
    if (!plan || !plan.selected.length || preset.spans.length < 2) return null;

    const columnContents = preset.spans.map((_, index) => (index === 0 ? plan.selected : []));
    const layout = buildLayoutNode(schema, preset, createUid(), stack, createUid, columnContents);
    return state.tr.replaceWith(plan.replaceFrom, plan.replaceTo, layout).scrollIntoView();
}

export function wrapInLayout(
    editor: Editor,
    from: number,
    to: number,
    preset: LayoutPreset,
    createUid: () => string,
    stack = 'small',
    state: Editor['state'] = editor.state,
): boolean {
    const tr = createWrapInLayoutTransaction(state, editor.schema, from, to, preset, createUid, stack);
    if (!tr) return false;
    editor.view.dispatch(tr);
    return true;
}

export function unwrapLayout(editor: Editor, layoutUid: string): boolean {
    const located = findLayoutByUid(editor.state.doc, layoutUid);
    if (!located) return false;

    const flattened: ProseMirrorNode[] = [];
    located.node.forEach((column) => {
        column.forEach((child) => flattened.push(child));
    });

    const fragment = Fragment.from(flattened.length ? flattened : [emptyParagraph(editor.schema)]);
    editor.view.dispatch(
        editor.state.tr
            .replaceWith(located.pos, located.pos + located.node.nodeSize, fragment)
            .scrollIntoView(),
    );
    return true;
}

export function canWrapSelection(editor: Editor, from: number, to: number): boolean {
    return resolveWrapPlan(editor.state, from, to) !== null;
}

export function selectLayout(editor: Editor, layoutUid: string): boolean {
    const located = findLayoutByUid(editor.state.doc, layoutUid);
    if (!located) return false;
    const selection = NodeSelection.create(editor.state.doc, located.pos);
    editor.view.dispatch(editor.state.tr.setSelection(selection).scrollIntoView());
    return true;
}

export { buildLayoutNode, columnNode, emptyParagraph };
