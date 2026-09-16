import { afterEach, describe, expect, it, vi } from 'vitest';
import { Editor } from '@tiptap/core';
import { BlockUiStateRegistry, FieldHostRegistry } from '../../src/web/assets/field/src/ts/registries';
import { nodeViewServices } from './support/node-view-services';
import { createEditorExtensions } from '../../src/web/assets/field/src/ts/editor-schema';
import { createInsertionRegistry } from '../../src/web/assets/field/src/ts/insertion/registry';
import { activateUrlNodeControl } from '../../src/web/assets/field/src/ts/semantic/embed-ui';
import { installAnimationsShim, installElementInternalsShim } from './support/element-internals';
import '../../src/web/assets/field/src/ts/semantic/url-node-dialog';
import '../../src/web/assets/field/src/ts/semantic/embed-bubble';
import type { EditorManifest } from '../../src/web/assets/field/src/ts/types';

installElementInternalsShim();
installAnimationsShim();

const editors: Editor[] = [];

afterEach(() => {
    editors.splice(0).forEach((editor) => editor.destroy());
    document.body.replaceChildren();
    document.querySelectorAll('vizy-url-node-dialog').forEach((node) => node.remove());
});

function embedManifest(): EditorManifest {
    return {
        manifestVersion: 1,
        uid: 'request',
        revision: '1:test',
        hash: 'test',
        registryRevision: 'registry',
        schemaRevision: 'schema',
        enabledNodes: ['paragraph', 'iframe', 'mediaEmbed'],
        enabledMarks: [],
        internalNodes: ['doc', 'text'],
        modules: [
            'vizy/core/node/doc',
            'vizy/core/node/text',
            'vizy/core/node/paragraph',
            'vizy/core/node/iframe',
            'vizy/core/node/mediaEmbed',
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

function makeEditor(): Editor {
    const ui = new BlockUiStateRegistry();
    const hosts = new FieldHostRegistry();
    const manifest = embedManifest();
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
        content: { type: 'doc', content: [{ type: 'paragraph' }] },
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

describe('embed / iframe URL dialog', () => {
    it('opens Insert Media Embed dialog from the toolbar control', async () => {
        const editor = makeEditor();
        activateUrlNodeControl(editor, 'mediaEmbed', { focus: false });
        await vi.waitFor(() => {
            expect(document.querySelector('vizy-url-node-dialog')).toBeTruthy();
        });
        const dialog = document.querySelector('vizy-url-node-dialog')!;
        await dialog.updateComplete;
        expect(dialog.dialogTitle).toBe('Insert Media Embed');
        expect(dialog.submitLabel).toBe('Insert');
        expect(dialog.shadowRoot?.querySelector('.url-node-dialog__url')).toBeTruthy();
    });

    it('opens Edit iFrame dialog when an iframe node is selected', async () => {
        const editor = makeEditor();
        editor.chain().focus().setVizyIframe({ url: 'https://example.com/embed' }).run();
        expect(editor.isActive('iframe')).toBe(true);

        activateUrlNodeControl(editor, 'iframe', { focus: false });
        await vi.waitFor(() => {
            expect(document.querySelector('vizy-url-node-dialog')).toBeTruthy();
        });
        const dialog = document.querySelector('vizy-url-node-dialog')!;
        await dialog.updateComplete;
        expect(dialog.dialogTitle).toBe('Edit iFrame');
        expect(dialog.submitLabel).toBe('Update');
    });
});

describe('embed bubble chip', () => {
    it('shows Edit · Delete when syncToEmbed is called for a selected iframe', async () => {
        const editor = makeEditor();
        editor.chain().focus().setVizyIframe({ url: 'https://example.com/frame' }).run();

        const bubble = document.createElement('vizy-embed-bubble');
        bubble.editor = editor;
        document.body.append(bubble);
        await bubble.updateComplete;

        bubble.syncToEmbed('iframe');
        await bubble.updateComplete;
        expect(bubble.visible).toBe(true);

        const labels = [...(bubble.shadowRoot?.querySelectorAll('.action') ?? [])]
            .map((button) => button.textContent?.trim());
        expect(labels).toEqual(['Edit', 'Delete']);
    });
});


describe('untrusted stored embeds', () => {
    it('rebuilds known-provider previews without mounting stored HTML', () => {
        const editor = makeEditor();
        editor.commands.setContent({ type: 'doc', content: [{ type: 'mediaEmbed', attrs: {
            url: 'https://www.youtube.com/watch?v=abcdefghijk',
            data: { html: '<img src="invalid" onerror="window.__vizyProbe = true"><iframe srcdoc="unsafe"></iframe>' },
        } }] });
        expect(editor.view.dom.querySelector('[onerror], [srcdoc], img')).toBeNull();
        expect(editor.view.dom.querySelector('iframe')?.src).toBe('https://www.youtube.com/embed/abcdefghijk');
        expect(editor.getJSON().content?.[0].attrs?.data.html).toContain('onerror');
    });

    it('shows an inert card for unknown providers without losing stored data', () => {
        const editor = makeEditor();
        editor.commands.setContent({ type: 'doc', content: [{ type: 'mediaEmbed', attrs: {
            url: 'https://example.com/embed', data: { html: '<svg onload="window.__vizyProbe = true"></svg>' },
        } }] });
        expect(editor.view.dom.querySelector('svg, iframe')).toBeNull();
        expect(editor.view.dom.textContent).toContain('https://example.com/embed');
    });

    it.each(['javascript:alert(1)', 'data:text/html,unsafe', 'java\tscript:alert(1)'])(
        'does not emit or preview unsafe iframe URL %s', (url) => {
            const editor = makeEditor();
            editor.commands.setContent({ type: 'doc', content: [{ type: 'iframe', attrs: { url } }] });
            expect(editor.view.dom.querySelector('iframe')).toBeNull();
            expect(editor.getHTML()).not.toContain('<iframe');
        },
    );

    it('isolates iframe previews and reuses them for unchanged attributes', () => {
        const editor = makeEditor();
        editor.commands.setContent({ type: 'doc', content: [{ type: 'iframe', attrs: { url: 'https://example.com/frame' } }] });
        const frame = editor.view.dom.querySelector('iframe')!;
        expect(frame.getAttribute('sandbox')).toBe('allow-scripts');
        editor.commands.setNodeSelection(0);
        editor.commands.updateAttributes('iframe', { frameborder: 1 });
        expect(editor.view.dom.querySelector('iframe')).toBe(frame);
    });
});
