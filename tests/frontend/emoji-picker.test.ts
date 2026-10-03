import { afterEach, expect, it } from 'vitest';
import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { createVizyEmoji } from '../../src/web/assets/field/src/ts/semantic/emoji';
import { searchEmojiOptions } from '../../src/web/assets/field/src/ts/semantic/emoji-picker';
import { VizyToolbarElement } from '../../src/web/assets/field/src/ts/toolbar/VizyToolbarElement';
import type { ToolbarControlManifest } from '../../src/web/assets/field/src/ts/types';
import { installAnimationsShim, installElementInternalsShim } from './support/element-internals';

installElementInternalsShim();
installAnimationsShim();

const editors: Editor[] = [];
const mounted: HTMLElement[] = [];

afterEach(() => {
    editors.splice(0).forEach((editor) => editor.destroy());
    mounted.splice(0).forEach((element) => element.remove());
});

const emojiControl: ToolbarControlManifest = {
    id: 'emoji',
    kind: 'node',
    label: 'Emoji',
    action: { command: 'insertEmoji' },
};

async function mountPicker(): Promise<{ editor: Editor; toolbar: VizyToolbarElement }> {
    const editor = new Editor({
        element: document.createElement('div'),
        extensions: [Document, Paragraph, Text, createVizyEmoji()],
        content: '<p>Launch </p>',
    });
    editor.commands.focus('end');
    editors.push(editor);

    const toolbar = new VizyToolbarElement();
    toolbar.editor = editor;
    toolbar.controls = [emojiControl];
    mounted.push(toolbar);
    document.body.append(toolbar);
    await toolbar.updateComplete;

    return { editor, toolbar };
}

it('searches TipTap’s official dataset and inserts canonical emoji data from the toolbar popover', async () => {
    const { editor, toolbar } = await mountPicker();
    const root = toolbar.shadowRoot!;
    expect(root.querySelector('pk-popover')).not.toBeNull();
    expect(root.querySelector('vizy-emoji-dialog')).toBeNull();

    const search = root.querySelector<HTMLElement & { value: string }>('pk-input')!;
    search.value = 'rocket';
    search.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await toolbar.updateComplete;
    const rocket = root.querySelector<HTMLButtonElement>('button[title=":rocket:"]')!;
    rocket.click();

    expect(editor.getJSON().content?.[0]?.content?.[1]).toMatchObject({
        type: 'emoji',
        attrs: { name: 'rocket', emoji: '🚀' },
    });
});

it('uses popular defaults and exposes a clear empty search state', async () => {
    expect(searchEmojiOptions('').length).toBeGreaterThan(20);
    expect(searchEmojiOptions('').map((item) => item.name)).toContain('rocket');
    const { toolbar } = await mountPicker();
    const search = toolbar.shadowRoot!.querySelector<HTMLElement & { value: string }>('pk-input')!;
    search.value = 'not-an-emoji-at-all';
    search.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await toolbar.updateComplete;

    expect(toolbar.shadowRoot!.textContent).toContain('No emoji found.');
});
