import { afterEach, describe, expect, it } from 'vitest';
import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { FootnoteItem, FootnoteList, FootnoteReference } from '../../src/web/assets/field/src/ts/semantic/footnotes';
import { recursiveRegenerateAuthoredUids } from '../../src/web/assets/field/src/ts/editor-schema';
import type { CanonicalNode } from '../../src/web/assets/field/src/ts/types';

const editors: Editor[] = [];
afterEach(() => editors.splice(0).forEach((editor) => editor.destroy()));

function makeEditor(): Editor {
    const editor = new Editor({
        element: document.createElement('div'),
        extensions: [Document, Paragraph, Text, FootnoteReference, FootnoteList, FootnoteItem],
        content: '<p>Statement</p>',
    });
    editors.push(editor);
    editor.commands.focus('end');
    return editor;
}

describe('footnotes', () => {
    it('inserts a stable reference/definition pair and numbers it by reference order', () => {
        const editor = makeEditor();

        expect(editor.commands.insertFootnote()).toBe(true);
        editor.commands.insertContent('Supporting source');

        const json = editor.getJSON() as CanonicalNode;
        const reference = json.content?.[0]?.content?.[1];
        const list = json.content?.[1];
        const item = list?.content?.[0];

        expect(reference).toMatchObject({
            type: 'footnoteReference',
            attrs: { number: 1, fallbackText: 'Supporting source' },
        });
        expect(reference?.attrs?.footnoteUid).toMatch(/^[0-9a-f-]{36}$/);
        expect(list?.type).toBe('footnoteList');
        expect(item).toMatchObject({
            type: 'footnoteItem',
            attrs: { footnoteUid: reference?.attrs?.footnoteUid },
        });
        expect(item?.content?.[0]?.content?.[0]?.text).toBe('Supporting source');
    });

    it('removes the paired definition when its reference is deleted', () => {
        const editor = makeEditor();
        editor.commands.insertFootnote();
        let referencePosition: number | null = null;
        editor.state.doc.descendants((node, position) => {
            if (node.type.name === 'footnoteReference') referencePosition = position;
        });
        expect(referencePosition).not.toBeNull();
        editor.view.dispatch(editor.state.tr.delete(referencePosition!, referencePosition! + 1));

        expect(editor.getJSON().content?.map((node) => node.type)).toEqual(['paragraph']);
    });

    it('moves between a selected reference and its editable definition', () => {
        const editor = makeEditor();
        editor.commands.insertFootnote();
        let referencePosition: number | null = null;
        let definitionPosition: number | null = null;
        editor.state.doc.descendants((node, position) => {
            if (node.type.name === 'footnoteReference') referencePosition = position;
            if (node.type.name === 'footnoteItem') definitionPosition = position;
        });
        expect(referencePosition).not.toBeNull();
        expect(definitionPosition).not.toBeNull();

        editor.commands.setNodeSelection(referencePosition!);
        expect(editor.commands.insertFootnote()).toBe(true);
        expect(editor.state.selection.from).toBe(definitionPosition! + 2);

        editor.view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Enter',
            ctrlKey: true,
            bubbles: true,
            cancelable: true,
        }));
        expect(editor.state.selection.from).toBe(referencePosition! + 1);
    });

    it('renumbers references after removing an earlier orphan definition list', () => {
        const referenceUid = '12345678-1234-4234-8234-123456789012';
        const editor = new Editor({
            element: document.createElement('div'),
            extensions: [Document, Paragraph, Text, FootnoteReference, FootnoteList, FootnoteItem],
            content: {
                type: 'doc',
                content: [
                    {
                        type: 'footnoteList',
                        content: [{
                            type: 'footnoteItem',
                            attrs: { footnoteUid: '87654321-4321-4321-8321-210987654321' },
                            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Orphan' }] }],
                        }],
                    },
                    {
                        type: 'paragraph',
                        content: [{
                            type: 'footnoteReference',
                            attrs: { footnoteUid: referenceUid, fallbackText: 'Restored', number: null },
                        }],
                    },
                ],
            },
        });
        editors.push(editor);
        editor.commands.insertContentAt(editor.state.doc.content.size, '<p>Trigger normalisation</p>');

        const json = editor.getJSON() as CanonicalNode;
        expect(json.content?.map((node) => node.type)).toEqual(['paragraph', 'paragraph', 'footnoteList']);
        expect(json.content?.[0]?.content?.[0]).toMatchObject({
            type: 'footnoteReference',
            attrs: { footnoteUid: referenceUid, fallbackText: 'Restored', number: 1 },
        });
        expect(json.content?.[2]?.content?.[0]?.attrs?.footnoteUid).toBe(referenceUid);
    });

    it('keeps definition numbers paired after reference moves across separate lists and deletion', () => {
        const editor = makeEditor();
        const a = '11111111-1111-4111-8111-111111111111';
        const b = '22222222-2222-4222-8222-222222222222';
        const reference = (uid: string) => ({ type: 'paragraph', content: [{ type: 'footnoteReference', attrs: { footnoteUid: uid } }] });
        const list = (uid: string, text: string) => ({ type: 'footnoteList', content: [{
            type: 'footnoteItem', attrs: { footnoteUid: uid }, content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
        }] });
        editor.commands.setContent({ type: 'doc', content: [reference(a), list(a, 'Alpha'), reference(b), list(b, 'Beta')] });
        const order = () => [...editor.view.dom.querySelectorAll('li')].map((item) => [item.textContent, item.getAttribute('value')]);
        expect(order()).toEqual([['Alpha', '1'], ['Beta', '2']]);
        expect(editor.getJSON().content?.filter((node) => node.type === 'footnoteList')).toHaveLength(1);
        const second = editor.state.doc.child(2);
        editor.commands.goToFootnoteDefinition(a);
        editor.commands.insertContent('Edited ');
        const caretOffset = editor.state.selection.$anchor.parentOffset;
        const movedPosition = editor.state.doc.child(0).nodeSize + editor.state.doc.child(1).nodeSize;
        editor.view.dispatch(editor.state.tr.delete(movedPosition, movedPosition + second.nodeSize).insert(0, second));
        expect(order()).toEqual([['Beta', '1'], ['Edited Alpha', '2']]);
        expect(editor.state.selection.$anchor.parent.textContent).toBe('Edited Alpha');
        expect(editor.state.selection.$anchor.parentOffset).toBe(caretOffset);
        expect([...editor.view.dom.querySelectorAll('sup')].map((ref) => ref.textContent)).toEqual(['1', '2']);
        editor.view.dispatch(editor.state.tr.delete(0, second.nodeSize));
        expect(order()).toEqual([['Edited Alpha', '1']]);
        expect(editor.getText()).not.toContain('Beta');
    });

    it('remaps the shared pair identity together when copied', () => {
        const sourceUid = '12345678-1234-4234-8234-123456789012';
        const input: CanonicalNode = {
            type: 'doc',
            content: [
                { type: 'paragraph', content: [{ type: 'footnoteReference', attrs: { footnoteUid: sourceUid } }] },
                {
                    type: 'footnoteList',
                    content: [{
                        type: 'footnoteItem',
                        attrs: { footnoteUid: sourceUid },
                        content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Source' }] }],
                    }],
                },
            ],
        };

        const copied = recursiveRegenerateAuthoredUids(input, () => 'copy-uid');
        expect(copied.content?.[0]?.content?.[0]?.attrs?.footnoteUid).toBe('copy-uid');
        expect(copied.content?.[1]?.content?.[0]?.attrs?.footnoteUid).toBe('copy-uid');
    });

    it('keeps paragraph boundaries when restoring a definition from a copied reference', () => {
        const editor = makeEditor();
        editor.commands.insertFootnote();
        editor.commands.insertContent('<p>First paragraph.</p><p>Second paragraph.</p>');
        const json = editor.getJSON() as CanonicalNode;
        const reference = json.content?.[0]?.content?.find((node) => node.type === 'footnoteReference');
        expect(reference?.attrs?.fallbackText).toBe('First paragraph.\n\nSecond paragraph.');

        const copy = makeEditor();
        copy.commands.insertContent(reference!);
        const list = copy.getJSON().content?.find((node) => node.type === 'footnoteList');
        expect(list?.content?.[0]).toMatchObject({
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'First paragraph.\n\nSecond paragraph.' }] }],
        });
    });
});
