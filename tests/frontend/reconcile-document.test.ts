import { describe, expect, it } from 'vitest';
import { Schema, type Node as ProseMirrorNode } from '@tiptap/pm/model';
import { EditorState, TextSelection, type Transaction } from '@tiptap/pm/state';
import { history, undo, redo } from '@tiptap/pm/history';
import { preserveFieldValuesOnHistory, reconcileDocument } from '../../src/web/assets/field/src/ts/reconcile-document';

const schema = new Schema({
    nodes: {
        doc: { content: 'block*', attrs: { schemaVersion: { default: 2 } } },
        paragraph: { group: 'block', content: 'text*', attrs: { align: { default: null } } },
        heading: { group: 'block', content: 'text*' },
        blockquote: { group: 'block', content: 'block*' },
        vizyBlock: { group: 'block', atom: true, attrs: {
            blockUid: { default: null }, blockTypeUid: { default: 'type' },
            fieldSlots: { default: {} }, matrixAnchorUid: { default: null },
        } },
        text: {},
    },
    marks: { bold: {}, italic: {} },
});
const paragraph = (text = '') => schema.node('paragraph', null, text ? [schema.text(text)] : []);
const block = (uid: string, value: unknown) => schema.node('vizyBlock', { blockUid: uid, fieldSlots: { value } });
const document = (...content: ProseMirrorNode[]) => schema.node('doc', null, content);

function editing(doc: ReturnType<typeof document>) {
    let state = EditorState.create({ schema, doc, plugins: [history(), preserveFieldValuesOnHistory()] });
    const apply = (transaction: Transaction) => { state = state.applyTransaction(transaction).state; };
    return { get state() { return state; }, apply };
}

describe('server document reconciliation', () => {
    it('preserves selection and undo between independently normalized Blocks', () => {
        const editor = editing(document(block('a', ['1']), paragraph('Before'), block('b', ['2'])));
        const edit = editor.state.tr.insertText(' edited', 8);
        editor.apply(edit.setSelection(TextSelection.create(edit.doc, 5)));
        const accepted = document(block('a', [1]), paragraph('Before edited'), block('b', [2]));
        editor.apply(reconcileDocument(editor.state.tr, accepted).setMeta('addToHistory', false));
        expect(editor.state.doc.eq(accepted)).toBe(true);
        expect(editor.state.selection.from).toBe(5);
        expect(undo(editor.state, editor.apply)).toBe(true);
        expect(editor.state.doc.eq(document(block('a', [1]), paragraph('Before'), block('b', [2])))).toBe(true);
        expect(redo(editor.state, editor.apply)).toBe(true);
        expect(editor.state.doc.eq(accepted)).toBe(true);
    });

    it('retains text undo when the server removes a trailing empty paragraph', () => {
        const editor = editing(document(paragraph('Before'), paragraph()));
        editor.apply(editor.state.tr.insertText(' edited', 7));
        editor.apply(reconcileDocument(editor.state.tr, document(paragraph('Before edited'))).setMeta('addToHistory', false));
        expect(undo(editor.state, editor.apply)).toBe(true);
        expect(editor.state.doc.eq(document(paragraph('Before')))).toBe(true);
        expect(redo(editor.state, editor.apply)).toBe(true);
        expect(editor.state.doc.eq(document(paragraph('Before edited')))).toBe(true);
    });

    it('keeps a caret before server-trimmed whitespace in the same text run', () => {
        const editor = editing(document(paragraph('Before  ')));
        editor.apply(editor.state.tr.setSelection(TextSelection.create(editor.state.doc, 4)));
        editor.apply(reconcileDocument(editor.state.tr, document(paragraph('Before'))).setMeta('addToHistory', false));
        expect(editor.state.doc.eq(document(paragraph('Before')))).toBe(true);
        expect(editor.state.selection.from).toBe(4);
    });

    it('changes text marks without moving the caret', () => {
        const editor = editing(document(paragraph('Before')));
        editor.apply(editor.state.tr.setSelection(TextSelection.create(editor.state.doc, 4)));
        const accepted = document(schema.node('paragraph', null, [schema.text('Before', [schema.mark('bold')])]));
        editor.apply(reconcileDocument(editor.state.tr, accepted).setMeta('addToHistory', false));
        expect(editor.state.doc.eq(accepted)).toBe(true);
        expect(editor.state.selection.from).toBe(4);
    });

    it('exactly reconciles structural corrections, insertions, deletions and nested changes', () => {
        const candidates = [
            document(), document(paragraph()), document(paragraph('A')), document(paragraph('AA')),
            document(paragraph('A'), paragraph('B')), document(paragraph('A'), paragraph(), paragraph('B')),
            document(block('a', ['1']), paragraph('A'), block('b', [2])),
            document(schema.node('heading', null, [schema.text('A')])),
            document(schema.node('blockquote', null, [paragraph('A'), paragraph('B')])),
            document(schema.node('blockquote', null, [paragraph('Changed')])),
        ];
        for (const before of candidates) for (const after of candidates) {
            const state = EditorState.create({ schema, doc: before });
            const transaction = reconcileDocument(state.tr, after);
            expect(transaction.doc.toJSON()).toEqual(after.toJSON());
            transaction.doc.check();
        }
    });
});
