import { Table, createTable } from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { TextSelection } from '@tiptap/pm/state';
import { Plugin } from '@tiptap/pm/state';
import { countLogicalTableColumns, equalColumnWidths } from './attrs';

function normalizeColumnWidths(raw: unknown, columnCount: number): number[] {
    if (!Array.isArray(raw) || raw.length !== columnCount) {
        return equalColumnWidths(columnCount);
    }
    const widths = raw.map((value) => Number.parseInt(String(value), 10));
    if (widths.some((value) => !Number.isInteger(value) || value < 1)) {
        return equalColumnWidths(columnCount);
    }
    const total = widths.reduce((sum, weight) => sum + weight, 0);
    if (total !== 1000) return equalColumnWidths(columnCount);
    return widths;
}

function withColumnWidths(node: ProseMirrorNode, columnCount: number): ProseMirrorNode {
    const columnWidths = normalizeColumnWidths(node.attrs.columnWidths, columnCount);
    return node.type.create({ ...node.attrs, columnWidths }, node.content, node.marks);
}

/** Table node storing semantic columnWidths (sum 1000) instead of pixel colwidth. */
export function createSemanticTable() {
    return Table.extend({
        addAttributes() {
            return {
                ...this.parent?.(),
                columnWidths: {
                    default: null,
                    parseHTML: (element) => {
                        const raw = (element as HTMLElement).getAttribute('data-column-widths');
                        if (!raw) return null;
                        try {
                            const parsed = JSON.parse(raw);
                            return Array.isArray(parsed) ? parsed : null;
                        } catch {
                            return null;
                        }
                    },
                    renderHTML: (attributes) => {
                        if (!attributes.columnWidths) return {};
                        return { 'data-column-widths': JSON.stringify(attributes.columnWidths) };
                    },
                },
            };
        },

        addCommands() {
            const parent = this.parent?.() ?? {};
            return {
                ...parent,
                insertTable: ({ rows = 3, cols = 3, withHeaderRow = true } = {}) => ({ tr, dispatch, editor }) => {
                    const node = withColumnWidths(createTable(editor.schema, rows, cols, withHeaderRow), cols);
                    if (dispatch) {
                        const offset = tr.selection.from + 1;
                        tr.replaceSelectionWith(node)
                            .scrollIntoView()
                            .setSelection(TextSelection.near(tr.doc.resolve(offset)));
                    }
                    return true;
                },
            };
        },

        addProseMirrorPlugins() {
            const parent = this.parent?.() ?? [];
            return [
                ...parent,
                new Plugin({
                    appendTransaction: (_transactions, _oldState, newState) => {
                        let transaction = newState.tr;
                        let changed = false;
                        newState.doc.descendants((node, pos) => {
                            if (node.type.name !== 'table') return;
                            const columnCount = countLogicalTableColumns(node);
                            if (columnCount < 1) return;
                            const next = normalizeColumnWidths(node.attrs.columnWidths, columnCount);
                            const current = node.attrs.columnWidths as number[] | null;
                            const currentTotal = Array.isArray(current)
                                ? current.reduce((sum, weight) => sum + weight, 0)
                                : 0;
                            if (!current || current.length !== columnCount || currentTotal !== 1000) {
                                transaction = transaction.setNodeMarkup(pos, undefined, { ...node.attrs, columnWidths: next });
                                changed = true;
                            }
                        });
                        return changed ? transaction : null;
                    },
                }),
            ];
        },
    });
}

/** colwidth is editor-resize state only; canonical table widths live on the table node. */
export function createSemanticTableCell() {
    return TableCell;
}

export function createSemanticTableHeader() {
    return TableHeader;
}
