import { afterEach, describe, expect, it } from 'vitest';
import { Editor } from '@tiptap/core';
import { createEditorExtensions } from '../../src/web/assets/field/src/ts/editor-schema';
import { normalizePastedHtml } from '../../src/web/assets/field/src/ts/paste-normalizer';
import { restoreCanonicalFromEditor } from '../../src/web/assets/field/src/ts/transport/opaque';
import type { EditorManifest } from '../../src/web/assets/field/src/ts/types';

const editors: Editor[] = [];

function manifest(nodes: string[] = ['paragraph'], marks: string[] = ['bold']): EditorManifest {
    const internalNodes = ['doc', 'text'];
    if (nodes.includes('bulletList') || nodes.includes('orderedList')) internalNodes.push('listItem');
    const modules = [
        'vizy/core/node/doc',
        'vizy/core/node/text',
        ...nodes.map((name) => `vizy/core/node/${name}`),
        ...(internalNodes.includes('listItem') ? ['vizy/core/node/listItem'] : []),
        ...marks.map((name) => `vizy/core/mark/${name}`),
    ];
    return {
        manifestVersion: 1,
        uid: 'request',
        revision: 'test',
        hash: 'test',
        registryRevision: 'registry',
        schemaRevision: 'schema',
        enabledNodes: nodes,
        enabledMarks: marks,
        internalNodes,
        modules,
        headingLevels: nodes.includes('heading') ? [2, 3] : [],
        field: {
            fieldUid: 'field',
            rootContentType: 'rich',
            blockTypePickerGroups: [],
            allowedBlockTypeUids: [],
            insertableBlockTypeUids: [],
            minBlocks: null,
            maxBlocks: null,
        },
        blockTypes: {},
        insertionItems: [],
    };
}

function editorFor(editorManifest: EditorManifest): Editor {
    const editor = new Editor({
        extensions: createEditorExtensions(editorManifest, () => {
            throw new Error('servicesNotUsed');
        }),
        content: { type: 'doc', attrs: { schemaVersion: 2 }, content: [] },
    });
    editors.push(editor);
    return editor;
}

function content(editor: Editor) {
    return restoreCanonicalFromEditor(editor.getJSON() as never).content;
}

const officeList = `
    <p class="MsoListParagraph" style="mso-list:l0 level1 lfo1">
        <span style="mso-list:Ignore">·<span>&nbsp;</span></span><strong>First item</strong>
    </p>
    <p class="MsoListParagraph" style="mso-list:l0 level1 lfo1">
        <span style="mso-list:Ignore">·<span>&nbsp;</span></span>Second item
    </p>
`;

afterEach(() => editors.splice(0).forEach((editor) => editor.destroy()));

describe('schema-aware paste normalization', () => {
    it('reconstructs Office list markup before a list-capable schema parses it', () => {
        const editor = editorFor(manifest(['paragraph', 'bulletList']));
        editor.view.pasteHTML(officeList);

        expect(content(editor)).toEqual([{
            type: 'bulletList',
            content: [
                {
                    type: 'listItem',
                    content: [{
                        type: 'paragraph',
                        content: [{ type: 'text', marks: [{ type: 'bold' }], text: 'First item' }],
                    }],
                },
                {
                    type: 'listItem',
                    content: [{
                        type: 'paragraph',
                        content: [{ type: 'text', text: 'Second item' }],
                    }],
                },
            ],
        }]);
    });

    it('lets the destination schema flatten reconstructed lists when lists are disabled', () => {
        const editor = editorFor(manifest());
        editor.view.pasteHTML(officeList);

        expect(content(editor)).toEqual([
            {
                type: 'paragraph',
                content: [{ type: 'text', marks: [{ type: 'bold' }], text: 'First item' }],
            },
            {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Second item' }],
            },
        ]);
    });

    it('keeps nested Office list order and structure', () => {
        const editor = editorFor(manifest(['paragraph', 'bulletList']));
        editor.view.pasteHTML(`
            <p class="MsoListParagraph" style="mso-list:l0 level1 lfo1"><span style="mso-list:Ignore">· </span>Outer</p>
            <p class="MsoListParagraph" style="mso-list:l0 level2 lfo1"><span style="mso-list:Ignore">· </span>Nested</p>
            <p class="MsoListParagraph" style="mso-list:l0 level1 lfo1"><span style="mso-list:Ignore">· </span>Last</p>
        `);

        const list = content(editor)?.[0];
        expect(list?.type).toBe('bulletList');
        expect(list?.content?.[0].content?.map((node) => node.type)).toEqual(['paragraph', 'bulletList']);
        const text: string[] = [];
        editor.state.doc.descendants((node) => {
            if (node.isText && node.text) text.push(node.text);
        });
        expect(text).toEqual(['Outer', 'Nested', 'Last']);
    });

    it('preserves an ordered Office list start', () => {
        const editor = editorFor(manifest(['paragraph', 'orderedList']));
        editor.view.pasteHTML(`
            <p class="MsoListParagraph" style="mso-list:l1 level1 lfo2"><span style="mso-list:Ignore">3. </span>Third</p>
            <p class="MsoListParagraph" style="mso-list:l1 level1 lfo2"><span style="mso-list:Ignore">4. </span>Fourth</p>
        `);

        expect(content(editor)).toEqual([{
            type: 'orderedList',
            attrs: { start: 3 },
            content: [
                {
                    type: 'listItem',
                    content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Third' }] }],
                },
                {
                    type: 'listItem',
                    content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Fourth' }] }],
                },
            ],
        }]);
    });

    it('projects unsupported tables into readable rows without becoming another allowlist', () => {
        const editor = editorFor(manifest());
        editor.view.pasteHTML(`
            <table>
                <tr><th>Name</th><th>Value</th></tr>
                <tr><td>Alpha</td><td>One</td></tr>
            </table>
            <p>After</p>
        `);

        expect(content(editor)).toEqual([
            { type: 'paragraph', content: [{ type: 'text', text: 'Name — Value' }] },
            { type: 'paragraph', content: [{ type: 'text', text: 'Alpha — One' }] },
            { type: 'paragraph', content: [{ type: 'text', text: 'After' }] },
        ]);

        const untouched = normalizePastedHtml('<table><tr><td>Kept</td></tr></table>', {
            enabledNodes: ['table'],
        });
        expect(untouched).toContain('<table>');
        expect(untouched).toContain('<td>Kept</td>');
    });

    it('converts semantic source headings and lets configured levels govern the result', () => {
        const editor = editorFor(manifest(['paragraph', 'heading']));
        editor.view.pasteHTML('<div role="heading" aria-level="2">Allowed</div><h4>Disallowed</h4>');

        expect(content(editor)).toEqual([
            {
                type: 'heading',
                attrs: { level: 2 },
                content: [{ type: 'text', text: 'Allowed' }],
            },
            {
                type: 'paragraph',
                content: [{ type: 'text', text: 'Disallowed' }],
            },
        ]);
    });

    it('removes source scaffolding without stripping supported inline formatting', () => {
        const editor = editorFor(manifest());
        editor.view.pasteHTML(`
            <style>.source { color: red }</style>
            <!-- source comment -->
            <p id="docs-internal-guid-value" onclick="alert(1)"><strong>Kept</strong></p>
            <o:p>&nbsp;</o:p>
        `);

        expect(editor.getText()).toBe('Kept');
        expect(editor.getJSON().content?.[0].content?.[0].marks).toEqual([{ type: 'bold' }]);
    });

    it('falls back to clipboard text when HTML contains no insertable content', () => {
        const editor = editorFor(manifest(['paragraph'], []));
        const data = new DataTransfer();
        data.setData('text/html', '<img src="https://example.test/external.jpg" alt="External">');
        data.setData('text/plain', 'External image');
        const event = new ClipboardEvent('paste');
        Object.defineProperty(event, 'clipboardData', { value: data });

        expect(editor.view.pasteHTML(data.getData('text/html'), event)).toBe(true);
        expect(editor.getText()).toBe('External image');
    });
});
