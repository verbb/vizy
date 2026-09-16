import { defaultLinkAttrs } from '../../src/web/assets/field/src/ts/semantic/attrs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Editor } from '@tiptap/core';
import { BlockUiStateRegistry, FieldHostRegistry } from '../../src/web/assets/field/src/ts/registries';
import { nodeViewServices } from './support/node-view-services';
import { createEditorExtensions } from '../../src/web/assets/field/src/ts/editor-schema';
import { createInsertionRegistry } from '../../src/web/assets/field/src/ts/insertion/registry';
import {
    applySemanticLinkToEditor,
    attrsFromUrlDialog,
    getSemanticLinkEditState,
    unsetSemanticLinkFromEditor,
} from '../../src/web/assets/field/src/ts/semantic/link-apply';
import { urlLinkAttrs } from '../../src/web/assets/field/src/ts/semantic/attrs';
import { restoreCanonicalFromEditor } from '../../src/web/assets/field/src/ts/transport/opaque';
import type { EditorManifest } from '../../src/web/assets/field/src/ts/types';

const editors: Editor[] = [];

afterEach(() => editors.splice(0).forEach((editor) => editor.destroy()));

function richManifest(): EditorManifest {
    return {
        manifestVersion: 1,
        uid: 'request',
        revision: '1:test',
        hash: 'test',
        registryRevision: 'registry',
        schemaRevision: 'schema',
        enabledNodes: ['paragraph'],
        enabledMarks: ['link'],
        internalNodes: ['doc', 'text'],
        modules: [
            'vizy/core/node/doc',
            'vizy/core/node/text',
            'vizy/core/node/paragraph',
            'vizy/core/mark/link',
        ],
        toolbar: { controls: [] },
        bubble: { controls: [] },
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

function makeEditor(text = 'Hello world'): Editor {
    const ui = new BlockUiStateRegistry();
    const hosts = new FieldHostRegistry();
    const manifest = richManifest();
    let editor!: Editor;
    let insertion!: ReturnType<typeof createInsertionRegistry>;
    editor = new Editor({
        element: document.createElement('div'),
        extensions: createEditorExtensions(manifest, () => nodeViewServices({
            editor,
            manifest,
            ui,
            hosts,
            insertion,
        })),
        content: {
            type: 'doc',
            content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
        },
    });
    insertion = createInsertionRegistry({
        editor,
        manifest,
        documentRevision: () => 0,
        createUid: () => crypto.randomUUID(),
    }, 'test', []);
    editors.push(editor);
    return editor;
}

describe('semantic link apply (dialog path)', () => {
    it('attrsFromUrlDialog maps mailto/tel and plain URLs', () => {
        expect(attrsFromUrlDialog('https://example.com', true)).toMatchObject({
            type: 'url',
            value: 'https://example.com',
            newWindow: true,
        });
        expect(attrsFromUrlDialog('mailto:a@b.c', false)).toMatchObject({
            type: 'email',
            value: 'a@b.c',
        });
        expect(attrsFromUrlDialog('tel:+123', false)).toMatchObject({
            type: 'tel',
            value: '+123',
        });
    });

    it('applies a url link mark over the selection without persisting href', () => {
        const editor = makeEditor();
        editor.commands.setTextSelection({ from: 1, to: 6 }); // "Hello"
        applySemanticLinkToEditor(editor, {
            attrs: urlLinkAttrs('https://example.com', true),
            text: 'Hello',
            focus: false,
        });

        expect(editor.isActive('link')).toBe(true);
        expect(editor.getAttributes('link')).toMatchObject({
            type: 'url',
            value: 'https://example.com',
            newWindow: true,
        });

        const canonical = restoreCanonicalFromEditor(editor.getJSON() as never);
        const mark = canonical.content?.[0]?.content?.[0]?.marks?.[0];
        expect(mark?.type).toBe('link');
        expect(mark?.attrs).not.toHaveProperty('href');
        expect(mark?.attrs).toMatchObject({ type: 'url', value: 'https://example.com' });
    });

    it('applies an entry semantic link from dialog seed', () => {
        const editor = makeEditor();
        editor.commands.setTextSelection({ from: 1, to: 6 });
        const targetUid = 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee';
        applySemanticLinkToEditor(editor, {
            attrs: {
                type: 'entry',
                targetUid,
                siteMode: 'current',
                siteUid: null,
                value: null,
                suffix: null,
                newWindow: false,
                title: null,
                ariaLabel: null,
                rel: [],
                class: null,
                id: null,
                download: null,
            },
            text: 'Hello',
            focus: false,
        });

        expect(editor.getAttributes('link')).toMatchObject({
            type: 'entry',
            targetUid,
        });
    });

    it('unsets the link mark and seeds edit state from an active link', () => {
        const editor = makeEditor();
        editor.commands.setTextSelection({ from: 1, to: 6 });
        applySemanticLinkToEditor(editor, {
            attrs: urlLinkAttrs('https://example.com'),
            text: 'Hello',
            focus: false,
        });

        const seed = getSemanticLinkEditState(editor);
        expect(seed.url).toBe('https://example.com');
        expect(seed.text).toBe('Hello');

        unsetSemanticLinkFromEditor(editor, { focus: false });
        expect(editor.isActive('link')).toBe(false);
    });

    it('activateLinkControl opens the dialog path instead of window.prompt', async () => {
        const prompt = vi.spyOn(window, 'prompt').mockReturnValue('https://nope');
        const dialogMod = await import('../../src/web/assets/field/src/ts/semantic/link-dialog');
        const openSpy = vi.spyOn(dialogMod, 'openVizyLinkDialog').mockResolvedValue();
        const { activateLinkControl } = await import('../../src/web/assets/field/src/ts/semantic/link-ui');

        const editor = makeEditor();
        editor.commands.setTextSelection({ from: 1, to: 6 });
        activateLinkControl(editor, 'link', { focus: false });
        await Promise.resolve();

        expect(prompt).not.toHaveBeenCalled();
        expect(openSpy).toHaveBeenCalledOnce();
        openSpy.mockRestore();
        prompt.mockRestore();
    });
});


it.each(['javascript:alert(1)', 'java\tscript:alert(1)', 'data:text/html,unsafe'])(
    'keeps unsafe stored link %s inert in the editor', (value) => {
        const editor = makeEditor();
        editor.commands.selectAll();
        editor.commands.setSemanticLink(defaultLinkAttrs({ type: 'url', value }));
        expect(editor.view.dom.querySelector('a')?.getAttribute('href')).toBe('#');
        expect(editor.getJSON().content?.[0].content?.[0].marks?.[0].attrs?.value).toBe(value);
    },
);


it('preserves new-window isolation when stored links supply custom rel values', () => {
    const editor = makeEditor();
    editor.commands.selectAll();
    editor.commands.setSemanticLink(defaultLinkAttrs({
        type: 'url', value: 'https://example.com', newWindow: true, rel: ['nofollow', 'opener'],
    }));
    const rel = editor.view.dom.querySelector('a')!.rel.split(' ');
    expect(rel).toEqual(expect.arrayContaining(['nofollow', 'noopener', 'noreferrer']));
    expect(rel).not.toContain('opener');
});
