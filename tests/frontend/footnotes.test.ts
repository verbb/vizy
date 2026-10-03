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
});
