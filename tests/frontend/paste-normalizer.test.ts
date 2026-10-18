import { afterEach, describe, expect, it } from 'vitest';
import { Editor } from '@tiptap/core';
import { createEditorExtensions } from '../../src/web/assets/field/src/ts/editor-schema';
import { normalizePastedHtml } from '../../src/web/assets/field/src/ts/paste-normalizer';
import { restoreCanonicalFromEditor } from '../../src/web/assets/field/src/ts/transport/opaque';
import type { CanonicalNode, EditorManifest } from '../../src/web/assets/field/src/ts/types';

const editors: Editor[] = [];

function manifest(nodes: string[] = ['paragraph'], marks: string[] = ['bold']): EditorManifest {
    const internalNodes = ['doc', 'text'];
    if (nodes.includes('bulletList') || nodes.includes('orderedList')) internalNodes.push('listItem');
    if (nodes.includes('footnoteReference')) internalNodes.push('footnoteList', 'footnoteItem');
    const modules = [
        'vizy/core/node/doc',
        'vizy/core/node/text',
        ...nodes.map((name) => `vizy/core/node/${name}`),
        ...(internalNodes.includes('listItem') ? ['vizy/core/node/listItem'] : []),
        ...(nodes.includes('footnoteReference') ? ['vizy/core/node/footnoteList', 'vizy/core/node/footnoteItem'] : []),
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
    it('pastes Word revisions as final text without publishing reviewer comments', () => {
        const editor = editorFor(manifest(['paragraph'], ['bold', 'strike']));
        editor.view.pasteHTML('<p><span class="msoDel"><del cite="mailto:reviewer" datetime="2026-10-18">Deleted wording</del></span><span class="msoIns"><ins cite="mailto:reviewer" datetime="2026-10-18"><b>Revised wording</b></ins></span></p><p><a style="mso-comment-reference:QA_1">Commented body</a><span class="MsoCommentReference"><a class="msocomanchor" href="#_msocom_1">[QA1]</a></span></p><div style="mso-element:comment-list"><div style="mso-element:comment"><p>Reviewer note</p></div></div><p><del>Intentional strike</del></p>');

        expect(editor.getText()).toBe('Revised wording\n\nCommented body\n\nIntentional strike');
        expect(editor.getJSON().content?.[0].content?.[0].marks).toEqual([{ type: 'bold' }]);
        expect(editor.getJSON().content?.[2].content?.[0].marks).toEqual([{ type: 'strike' }]);
    });

    it('removes tracked table deletions and Word grid scaffolding without removing authored empty rows', () => {
        const html = `<table>
            <tr><td>Heading</td><td colspan="2">Merged heading</td></tr>
            <tr style='mso-table-inserted:"Reviewer" 20261018T1340'><td>Inserted</td><td colspan="2">Keep</td></tr>
            <tr style='mso-table-deleted:"Reviewer" 20261018T1339'><td><span class="msoDel">Deleted</span></td><td colspan="2"></td></tr>
            <tr><td></td><td colspan="2"></td></tr>
            <![if !supportMisalignedColumns]><tr height="0"><td></td><td></td><td></td><td></td></tr><![endif]>
        </table>`;
        const template = document.createElement('template');
        template.innerHTML = normalizePastedHtml(html, { enabledNodes: ['table'] });
        const rows = [...template.content.querySelectorAll('tr')];
        expect(rows).toHaveLength(3);
        expect(rows.map((row) => row.children.length)).toEqual([2, 2, 2]);
        expect(rows[0].children[1].getAttribute('colspan')).toBe('2');
        expect(template.content.textContent).not.toContain('Deleted');
        expect(normalizePastedHtml(html, { enabledNodes: ['paragraph'] })).toContain('Inserted — Keep');
    });

    it.each([false, true])('warns about static Word cross-reference fields (plain mode: %s)', (plain) => {
        const config = manifest();
        config.field.pasteAsPlainText = plain;
        const editor = editorFor(config);
        const warnings: unknown[] = [];
        editor.view.dom.addEventListener('vizy-clipboard-warning', (event) => warnings.push((event as CustomEvent).detail));
        const data = new DataTransfer();
        data.setData('text/html', '<p><!--[if supportFields]><span style="mso-element:field-begin"></span>REF _Ref123 \\h <![endif]--><b>Destination</b><!--[if supportFields]><span style="mso-element:field-end"></span><![endif]--></p>');
        data.setData('text/plain', 'Destination');
        const event = new ClipboardEvent('paste');
        Object.defineProperty(event, 'clipboardData', { value: data });
        if (plain) editor.view.pasteText(data.getData('text/plain'), event);
        else editor.view.pasteHTML(data.getData('text/html'), event);
        expect(editor.getText()).toBe('Destination');
        expect(warnings).toEqual([{ codes: ['wordCrossReferences'] }]);
        const normalized = normalizePastedHtml('<p><a name="_Ref123">Destination</a><a href="#_Ref123">See destination</a><a href="https://example.com/">Website</a></p>', config);
        expect(normalized).not.toContain('#_Ref123');
        expect(normalized).toContain('See destination');
        expect(normalized).toContain('href="https://example.com/"');
    });

    const wordFootnote = '<p>Statement<a style="mso-footnote-id:ftn1" href="#_ftn1" name="_ftnref1"><span class="MsoFootnoteReference">[1]</span></a></p><div style="mso-element:footnote-list"><hr><div style="mso-element:footnote" id="ftn1"><p><a href="#_ftnref1" name="_ftn1">[1]</a>Supporting <b>source</b></p><p>Second paragraph</p></div></div>';

    it('keeps imported definitions at the document root when pasting into author lists', () => {
        const editor = editorFor(manifest(['paragraph', 'bulletList', 'orderedList', 'footnoteReference']));
        editor.commands.setContent('<ul><li><p>First list</p></li></ul><ol><li><p>Second list</p></li></ol>');
        editor.commands.setTextSelection(3);
        editor.view.pasteHTML(wordFootnote);
        const definitions: number[] = [];
        editor.state.doc.descendants((node, pos) => {
            if (node.type.name === 'footnoteList') definitions.push(editor.state.doc.resolve(pos).depth);
        });
        expect(definitions).toEqual([0]);
        expect(editor.getText()).toContain('First list');
        expect(editor.getText()).toContain('Second list');
    });

    it('combines footnotes from separate Word pastes into one saveable list', () => {
        const editor = editorFor(manifest(['paragraph', 'footnoteReference']));
        editor.view.pasteHTML(wordFootnote);
        editor.commands.setTextSelection(1);
        editor.view.pasteHTML(wordFootnote.replace('Supporting', 'Earlier'));
        const json = editor.getJSON() as CanonicalNode;
        const lists = json.content?.filter((node) => node.type === 'footnoteList');
        expect(lists).toHaveLength(1);
        expect(lists?.[0].content).toHaveLength(2);
        expect(lists?.[0].content?.[0].content?.[0].content?.[0].text).toBe('Earlier ');
        expect(lists?.[0].content?.[1].content?.[0].content?.[0].text).toBe('Supporting ');
        expect(lists?.[0].content?.every((item) => item.content?.length === 2)).toBe(true);
    });

    it('converts paired Word footnotes to independent native references and formatted definitions', () => {
        const editor = editorFor(manifest(['paragraph', 'footnoteReference']));
        editor.view.pasteHTML(wordFootnote);
        const first = restoreCanonicalFromEditor(editor.getJSON() as never);
        const reference = first.content?.[0].content?.find((node) => node.type === 'footnoteReference');
        const item = first.content?.find((node) => node.type === 'footnoteList')?.content?.[0];
        expect(reference?.attrs?.footnoteUid).toMatch(/^[0-9a-f-]{36}$/);
        expect(item?.attrs?.footnoteUid).toBe(reference?.attrs?.footnoteUid);
        expect(item?.content).toHaveLength(2);
        expect(item?.content?.[0].content?.[1]).toMatchObject({ text: 'source', marks: [{ type: 'bold' }] });
        expect(JSON.stringify(first)).not.toContain('[1]');
        const second = normalizePastedHtml(wordFootnote, { enabledNodes: ['footnoteReference'] });
        expect(second).not.toContain(reference?.attrs?.footnoteUid);
    });

    it('keeps disabled or incomplete source footnotes readable without creating empty native notes', () => {
        const restricted = editorFor(manifest(['paragraph'], ['bold', 'link']));
        restricted.view.pasteHTML(wordFootnote);
        expect(restricted.getText()).toContain('Supporting source');
        expect(JSON.stringify(restricted.getJSON())).not.toContain('footnoteReference');
        expect(restricted.getHTML()).not.toContain('href=');
        const enabled = editorFor(manifest(['paragraph', 'footnoteReference'], ['bold', 'link']));
        enabled.view.pasteHTML('<p>Missing definition<a href="#_ftn1" name="_ftnref1">[1]</a></p>');
        expect(enabled.getText()).toBe('Missing definition[1]');
        expect(JSON.stringify(enabled.getJSON())).not.toContain('footnoteList');
        expect(enabled.getHTML()).not.toContain('href=');
    });

    it('lists mixed Word endnotes and footnotes in reference order', () => {
        const editor = editorFor(manifest(['paragraph', 'footnoteReference']));
        editor.view.pasteHTML('<p>Endnote first<a name="_ednref1" href="#_edn1">[i]</a>Footnote second<a name="_ftnref1" href="#_ftn1">[1]</a></p><div style="mso-element:footnote" id="ftn1"><p><a name="_ftn1" href="#_ftnref1">[1]</a>Footnote definition</p></div><div style="mso-element:endnote" id="edn1"><p><a name="_edn1" href="#_ednref1">[i]</a>Endnote definition</p><p>Second paragraph</p></div>');
        const json = restoreCanonicalFromEditor(editor.getJSON() as never);
        const references = json.content?.[0].content?.filter((node) => node.type === 'footnoteReference');
        const items = json.content?.find((node) => node.type === 'footnoteList')?.content;
        expect(items?.map((node) => node.attrs?.footnoteUid)).toEqual(references?.map((node) => node.attrs?.footnoteUid));
        expect(items?.[0].content).toHaveLength(2);
        expect(items?.[0].content?.[0].content?.[0].text).toBe('Endnote definition');
        expect(references?.map((node) => node.attrs?.number)).toEqual([1, 2]);
    });

    it('rejects ambiguous plain-text Word revisions without replacing the selected content', () => {
        const config = manifest();
        config.field.pasteAsPlainText = true;
        const editor = editorFor(config);
        editor.commands.setContent('<p>Keep existing content</p>');
        editor.commands.selectAll();
        const before = editor.getJSON();
        const rejections: unknown[] = [];
        editor.view.dom.addEventListener('vizy-clipboard-rejected', (event) => rejections.push((event as CustomEvent).detail));
        const data = new DataTransfer();
        data.setData('text/html', '<p><span class="msoDel"><del>Old wording</del></span><span class="msoIns"><ins>New wording</ins></span></p>');
        data.setData('text/plain', 'Old wordingNew wording');
        const event = new ClipboardEvent('paste');
        Object.defineProperty(event, 'clipboardData', { value: data });
        editor.view.pasteText(data.getData('text/plain'), event);

        expect(editor.getJSON()).toEqual(before);
        expect(rejections).toEqual([{ code: 'wordRevisionsPlainText', operation: 'paste' }]);
    });

    it('allows resolved Word plain text, including its supplied equation text', () => {
        const config = manifest();
        config.field.pasteAsPlainText = true;
        const editor = editorFor(config);
        const data = new DataTransfer();
        data.setData('text/html', '<p>Final wording</p><!--[if gte msEquation 12]><m:oMath>source math</m:oMath><![endif]-->');
        data.setData('text/plain', 'Final wording\nx=(-b±√(b^2-4ac))/2a');
        const event = new ClipboardEvent('paste');
        Object.defineProperty(event, 'clipboardData', { value: data });
        editor.view.pasteText(data.getData('text/plain'), event);
        expect(editor.getText()).toBe('Final wording\n\nx=(-b±√(b^2-4ac))/2a');
    });

    it('warns when Word equation structure is unavailable in rich text', () => {
        const editor = editorFor(manifest());
        const warnings: unknown[] = [];
        editor.view.dom.addEventListener('vizy-clipboard-warning', (event) => warnings.push((event as CustomEvent).detail));
        const data = new DataTransfer();
        data.setData('text/html', '<p>Before</p><!--[if gte msEquation 12]><m:oMath><m:r>x</m:r></m:oMath><![endif]--><img src="file:///equation.png"><p>After</p>');
        const event = new ClipboardEvent('paste');
        Object.defineProperty(event, 'clipboardData', { value: data });
        editor.view.pasteHTML(data.getData('text/html'), event);
        expect(editor.getText()).toBe('Before\n\nAfter');
        expect(warnings).toEqual([{ codes: ['wordEquations', 'externalImagesOmitted'] }]);
    });

    it.each([false, true])('reports Docs review/footnote losses without replacing clipboard text (plain mode: %s)', (plain) => {
        const config = manifest();
        config.field.pasteAsPlainText = plain;
        const editor = editorFor(config);
        const warnings: unknown[] = [];
        editor.view.dom.addEventListener('vizy-clipboard-warning', (event) => warnings.push((event as CustomEvent).detail));
        const data = new DataTransfer();
        data.setData('text/html', '<p>Unmarked Docs source text</p>');
        data.setData('application/x-vnd.google-docs-document-slice-clip+wrapped', JSON.stringify({ data: JSON.stringify({ resolved: {
            dsl_suggesteddeletions: { sgsl_sugg: [[], null, ['suggestion-id']] },
            dsl_styleslices: [{ stsl_type: 'footnote', stsl_trailing: { fs_id: 'note-id' }, stsl_styles: [] }],
        } }) }));
        const event = new ClipboardEvent('paste');
        Object.defineProperty(event, 'clipboardData', { value: data });
        editor.view.pasteHTML(data.getData('text/html'), event);

        expect(editor.getText()).toBe('Unmarked Docs source text');
        expect(warnings).toEqual([{ codes: ['googleDocsSuggestions', 'googleDocsFootnotes'] }]);
    });

    it.each(['not JSON', '{"data":"not JSON"}', '{"data":"null"}', JSON.stringify({ data: JSON.stringify({ resolved: {
        dsl_suggestedinsertions: { sgsl_sugg: [[], null] },
        dsl_styleslices: [{ stsl_type: 'footnote', stsl_styles: [] }, null],
    } }) })])('ignores malformed or empty Docs loss metadata: %s', (raw) => {
        const editor = editorFor(manifest());
        const warnings: unknown[] = [];
        editor.view.dom.addEventListener('vizy-clipboard-warning', (event) => warnings.push((event as CustomEvent).detail));
        const data = new DataTransfer();
        data.setData('text/html', '<p>Keep this</p>');
        data.setData('application/x-vnd.google-docs-document-slice-clip+wrapped', raw);
        const event = new ClipboardEvent('paste');
        Object.defineProperty(event, 'clipboardData', { value: data });
        editor.view.pasteHTML(data.getData('text/html'), event);

        expect(editor.getText()).toBe('Keep this');
        expect(warnings).toEqual([]);
    });

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

    it('keeps block and hard-break boundaries in compact Docs table cells without splitting inline words', () => {
        const editor = editorFor(manifest());
        editor.view.pasteHTML('<table><tr><td><p>First paragraph</p><p>Second paragraph</p><ul><li>One</li><li>Two</li></ul><p>Line one<br>Line two</p><p>con<strong>nect</strong>ed</p></td><td>Next</td></tr></table>');

        expect(editor.getText()).toBe('First paragraph Second paragraph One Two Line one Line two connected — Next');
    });

    it('keeps nested table rows separate when flattening their containing cell', () => {
        const editor = editorFor(manifest());
        editor.view.pasteHTML('<table><tr><td>Before<table><tr><td>Inner one</td><td>Inner two</td></tr><tr><td>Last</td></tr></table>After</td></tr></table>');

        expect(editor.getText()).toBe('Before Inner one — Inner two Last After');
    });

    it.each([false, true])('distinguishes Word selection snapshots from embedded images (embedded: %s)', (embedded) => {
        const editor = editorFor(manifest());
        const warnings: unknown[] = [];
        editor.view.dom.addEventListener('vizy-clipboard-warning', (event) => warnings.push((event as CustomEvent).detail));
        const data = new DataTransfer();
        data.setData('text/html', `<meta name="ProgId" content="Word.Document"><p>Table text</p>${embedded ? '<img src="file:///photo.png">' : ''}`);
        Object.defineProperty(data, 'files', { value: [new File(['snapshot'], 'image.png', { type: 'image/png' })] });
        const event = new ClipboardEvent('paste');
        Object.defineProperty(event, 'clipboardData', { value: data });
        editor.view.pasteHTML(data.getData('text/html'), event);
        expect(editor.getText()).toBe('Table text');
        expect(warnings).toEqual(embedded ? [{ codes: ['externalImagesOmitted'] }] : []);
    });

    it('warns about omitted external images while preserving surrounding content', () => {
        const editor = editorFor(manifest());
        const warnings: unknown[] = [];
        editor.view.dom.addEventListener('vizy-clipboard-warning', (event) => warnings.push((event as CustomEvent).detail));
        const data = new DataTransfer();
        data.setData('text/html', '<p>Before</p><img src="https://example.test/picture.png"><p>After</p>');
        const event = new ClipboardEvent('paste');
        Object.defineProperty(event, 'clipboardData', { value: data });
        editor.view.pasteHTML(data.getData('text/html'), event);

        expect(editor.getText()).toBe('Before\n\nAfter');
        expect(warnings).toEqual([{ codes: ['externalImagesOmitted'] }]);
    });

    it.each(['plain', 'private', 'asset', 'text'])('does not warn for intentional or supported %s pastes', (kind) => {
        const config = manifest();
        config.field.pasteAsPlainText = kind === 'plain';
        const editor = editorFor(config);
        const warnings: unknown[] = [];
        editor.view.dom.addEventListener('vizy-clipboard-warning', (event) => warnings.push((event as CustomEvent).detail));
        const data = new DataTransfer();
        data.setData('text/html', kind === 'text' ? '<p>Text</p>' : `<p>Before</p><img ${kind === 'asset' ? 'data-asset-uid="11111111-1111-4111-8111-111111111111"' : ''} src="https://example.test/picture.png">`);
        if (kind === 'private') data.setData('application/x-vizy-opaque-slice+json', '{}');
        const event = new ClipboardEvent('paste');
        Object.defineProperty(event, 'clipboardData', { value: data });
        editor.view.pasteHTML(data.getData('text/html'), event);

        expect(warnings).toEqual([]);
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
