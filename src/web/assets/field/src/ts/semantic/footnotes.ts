import { mergeAttributes, Node } from '@tiptap/core';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { NodeSelection, Plugin, TextSelection } from '@tiptap/pm/state';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        vizyFootnotes: {
            insertFootnote: () => ReturnType;
            goToFootnoteDefinition: (footnoteUid: string) => ReturnType;
        };
    }
}

const UID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function createUuid(): string {
    if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, '0'));
    return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10).join('')}`;
}

function definitionPosition(document: ProseMirrorNode, footnoteUid: string): number | null {
    let found: number | null = null;
    document.descendants((node, position) => {
        if (found !== null) return false;
        if (node.type.name === 'footnoteItem' && node.attrs.footnoteUid === footnoteUid) {
            found = position;
            return false;
        }
        return true;
    });
    return found;
}

function textContentForDefinition(document: ProseMirrorNode, footnoteUid: string): string {
    let text = '';
    document.descendants((node) => {
        if (node.type.name !== 'footnoteItem' || node.attrs.footnoteUid !== footnoteUid) return true;
        text = node.textContent.trim().slice(0, 5000);
        return false;
    });
    return text;
}

function findFootnoteList(document: ProseMirrorNode): { node: ProseMirrorNode; position: number } | null {
    let found: { node: ProseMirrorNode; position: number } | null = null;
    document.descendants((node, position) => {
        if (node.type.name !== 'footnoteList') return true;
        found = { node, position };
        return false;
    });
    return found;
}

export const FootnoteList = Node.create({
    name: 'footnoteList',
    group: 'block',
    content: 'footnoteItem+',
    defining: true,
    isolating: true,

    parseHTML: () => [{ tag: 'section[data-type="footnoteList"]' }],
    renderHTML: ({ HTMLAttributes }) => [
        'section',
        mergeAttributes(HTMLAttributes, {
            'data-type': 'footnoteList',
            class: 'vizy-footnotes',
            role: 'doc-endnotes',
            'aria-label': 'Footnotes',
        }),
        ['ol', 0],
    ],
});

export const FootnoteItem = Node.create({
    name: 'footnoteItem',
    content: 'block+',
    defining: true,

    addAttributes: () => ({
        footnoteUid: {
            default: null,
            parseHTML: (element: HTMLElement) => element.dataset.footnoteUid ?? null,
            renderHTML: (attributes: Record<string, unknown>) => ({
                'data-footnote-uid': String(attributes.footnoteUid ?? ''),
            }),
        },
    }),

    parseHTML: () => [{ tag: 'li[data-type="footnoteItem"]' }],
    renderHTML: ({ node, HTMLAttributes }) => [
        'li',
        mergeAttributes(HTMLAttributes, {
            'data-type': 'footnoteItem',
            id: `fn-${String(node.attrs.footnoteUid ?? '')}`,
            role: 'doc-endnote',
        }),
        0,
    ],

    addKeyboardShortcuts() {
        return {
            'Mod-Enter': () => {
                const editor = this.editor;
                if (!editor) return false;
                const { $from } = editor.state.selection;
                let footnoteUid: unknown = null;
                for (let depth = $from.depth; depth >= 0; depth--) {
                    const node = $from.node(depth);
                    if (node.type.name === 'footnoteItem') {
                        footnoteUid = node.attrs.footnoteUid;
                        break;
                    }
                }
                if (typeof footnoteUid !== 'string') return false;
                let referencePosition: number | null = null;
                editor.state.doc.descendants((node, position) => {
                    if (referencePosition !== null) return false;
                    if (node.type.name === 'footnoteReference' && node.attrs.footnoteUid === footnoteUid) {
                        referencePosition = position;
                        return false;
                    }
                    return true;
                });
                if (referencePosition === null) return false;
                editor.commands.setTextSelection(referencePosition + 1);
                return true;
            },
        };
    },
});

export const FootnoteReference = Node.create({
    name: 'footnoteReference',
    group: 'inline',
    inline: true,
    atom: true,
    selectable: true,

    addAttributes: () => ({
        footnoteUid: {
            default: null,
            parseHTML: (element: HTMLElement) => element.dataset.footnoteUid ?? createUuid(),
            renderHTML: (attributes: Record<string, unknown>) => ({
                'data-footnote-uid': String(attributes.footnoteUid ?? ''),
            }),
        },
        fallbackText: {
            default: '',
            parseHTML: (element: HTMLElement) => element.dataset.footnoteText
                ?? (element.classList.contains('footnote') ? element.textContent?.trim() : '')
                ?? '',
            renderHTML: (attributes: Record<string, unknown>) => (
                typeof attributes.fallbackText === 'string' && attributes.fallbackText !== ''
                    ? { 'data-footnote-text': attributes.fallbackText }
                    : {}
            ),
        },
        number: { default: null, rendered: false },
    }),

    parseHTML: () => [
        { tag: 'sup[data-type="footnoteReference"]' },
        { tag: 'sup.footnote' },
    ],

    renderHTML: ({ node, HTMLAttributes }) => {
        const uid = String(node.attrs.footnoteUid ?? '');
        const number = String(node.attrs.number ?? '?');
        return [
            'sup',
            mergeAttributes(HTMLAttributes, {
                'data-type': 'footnoteReference',
                class: 'vizy-footnote-reference',
            }),
            ['a', {
                id: `fnref-${uid}`,
                href: `#fn-${uid}`,
                role: 'doc-noteref',
                'aria-label': `Footnote ${number}`,
            }, number],
        ];
    },

    addCommands() {
        return {
            insertFootnote: () => ({ state, dispatch }) => {
                const referenceType = state.schema.nodes.footnoteReference;
                const listType = state.schema.nodes.footnoteList;
                const itemType = state.schema.nodes.footnoteItem;
                const paragraphType = state.schema.nodes.paragraph;
                if (!referenceType || !listType || !itemType || !paragraphType) return false;

                const selected = state.selection instanceof NodeSelection ? state.selection.node : null;
                if (selected?.type === referenceType && typeof selected.attrs.footnoteUid === 'string') {
                    const position = definitionPosition(state.doc, selected.attrs.footnoteUid);
                    if (position === null) return false;
                    if (dispatch) dispatch(state.tr.setSelection(TextSelection.near(state.doc.resolve(position + 2))).scrollIntoView());
                    return true;
                }

                const footnoteUid = createUuid();
                const reference = referenceType.create({ footnoteUid, fallbackText: '', number: null });
                const item = itemType.create({ footnoteUid }, paragraphType.create());
                let transaction = state.tr.replaceSelectionWith(reference, false);
                const list = findFootnoteList(transaction.doc);

                if (list) {
                    transaction = transaction.insert(list.position + list.node.nodeSize - 1, item);
                } else {
                    transaction = transaction.insert(transaction.doc.content.size, listType.create(null, item));
                }
                const position = definitionPosition(transaction.doc, footnoteUid);
                if (position !== null) {
                    transaction = transaction.setSelection(TextSelection.near(transaction.doc.resolve(position + 2))).scrollIntoView();
                }
                if (dispatch) dispatch(transaction);
                return true;
            },
            goToFootnoteDefinition: (footnoteUid) => ({ state, dispatch }) => {
                const position = definitionPosition(state.doc, footnoteUid);
                if (position === null) return false;
                if (dispatch) dispatch(state.tr.setSelection(TextSelection.near(state.doc.resolve(position + 2))).scrollIntoView());
                return true;
            },
        };
    },

    addProseMirrorPlugins() {
        return [new Plugin({
            appendTransaction: (transactions, _oldState, newState) => {
                if (!transactions.some((transaction) => transaction.docChanged)) return null;
                const references: Array<{ node: ProseMirrorNode; position: number; uid: string }> = [];
                const items = new Map<string, { node: ProseMirrorNode; position: number }>();
                const lists: Array<{ node: ProseMirrorNode; position: number }> = [];

                newState.doc.descendants((node, position) => {
                    if (node.type.name === 'footnoteReference') {
                        const uid = String(node.attrs.footnoteUid ?? '');
                        if (UID_PATTERN.test(uid)) references.push({ node, position, uid });
                    } else if (node.type.name === 'footnoteItem') {
                        const uid = String(node.attrs.footnoteUid ?? '');
                        if (UID_PATTERN.test(uid)) items.set(uid, { node, position });
                    } else if (node.type.name === 'footnoteList') {
                        lists.push({ node, position });
                    }
                    return true;
                });

                let transaction = newState.tr;
                const referenced = new Set(references.map(({ uid }) => uid));

                // A deleted reference owns deletion of its definition. Removing a definition
                // directly is healed from the reference's plain-text clipboard fallback.
                for (const list of [...lists].reverse()) {
                    const orphanItems: Array<{ position: number; nodeSize: number }> = [];
                    list.node.forEach((item, offset) => {
                        const uid = String(item.attrs.footnoteUid ?? '');
                        if (!referenced.has(uid)) orphanItems.push({
                            position: list.position + 1 + offset,
                            nodeSize: item.nodeSize,
                        });
                    });
                    if (orphanItems.length === list.node.childCount) {
                        transaction = transaction.delete(list.position, list.position + list.node.nodeSize);
                    } else {
                        for (const orphan of orphanItems.reverse()) {
                            transaction = transaction.delete(orphan.position, orphan.position + orphan.nodeSize);
                        }
                    }
                }

                references.forEach(({ node, position, uid }, index) => {
                    const expectedNumber = index + 1;
                    const fallbackText = items.has(uid)
                        ? textContentForDefinition(newState.doc, uid)
                        : String(node.attrs.fallbackText ?? '').trim().slice(0, 5000);
                    if (node.attrs.number !== expectedNumber || node.attrs.fallbackText !== fallbackText) {
                        transaction = transaction.setNodeMarkup(transaction.mapping.map(position), undefined, {
                            ...node.attrs,
                            number: expectedNumber,
                            fallbackText,
                        });
                    }
                });

                // Copying just a reference still produces an independent, editable note.
                for (const { node, uid } of references) {
                    if (items.has(uid)) continue;
                    const itemType = newState.schema.nodes.footnoteItem;
                    const listType = newState.schema.nodes.footnoteList;
                    const paragraphType = newState.schema.nodes.paragraph;
                    if (!itemType || !listType || !paragraphType) continue;
                    const text = String(node.attrs.fallbackText ?? '').trim().slice(0, 5000);
                    const paragraph = paragraphType.create(null, text ? newState.schema.text(text) : undefined);
                    const item = itemType.create({ footnoteUid: uid }, paragraph);
                    const list = findFootnoteList(transaction.doc);
                    transaction = list
                        ? transaction.insert(list.position + list.node.nodeSize - 1, item)
                        : transaction.insert(transaction.doc.content.size, listType.create(null, item));
                }

                return transaction.docChanged ? transaction : null;
            },
        })];
    },
});
