import { afterEach, expect, it, vi } from 'vitest';
import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import RubyText from '@tiptap/extension-ruby-text';
import Text from '@tiptap/extension-text';
import { ensurePkDialog } from '../../src/web/assets/field/src/ts/pk-dialog';
import { VizyRubyTextDialogElement } from '../../src/web/assets/field/src/ts/semantic/ruby-text-dialog';
import { installAnimationsShim, installElementInternalsShim } from './support/element-internals';

installElementInternalsShim();
installAnimationsShim();

const editors: Editor[] = [];
const mounted: VizyRubyTextDialogElement[] = [];

afterEach(() => {
    editors.splice(0).forEach(editor => editor.destroy());
    mounted.splice(0).forEach(element => element.remove());
    vi.restoreAllMocks();
});

function makeEditor(): Editor {
    const editor = new Editor({
        element: document.createElement('div'),
        extensions: [Document, Paragraph, Text, RubyText],
        content: '<p>東京</p>',
    });
    editor.commands.selectAll();
    editors.push(editor);

    return editor;
}

async function mountDialog(editor: Editor): Promise<VizyRubyTextDialogElement> {
    await ensurePkDialog();
    const element = new VizyRubyTextDialogElement();
    mounted.push(element);
    document.body.append(element);
    await element.updateComplete;
    vi.spyOn(element.dialog!, 'show').mockResolvedValue();
    vi.spyOn(element.dialog!, 'hide').mockResolvedValue();
    await element.openForEditor(editor, { focus: false });

    return element;
}

it('applies and rehydrates a ruby annotation through Vizy’s dialog', async () => {
    const editor = makeEditor();
    const element = await mountDialog(editor);
    element.annotationInput!.value = 'とうきょう';
    const apply = element.shadowRoot!.querySelector('pk-button[variant="primary"]') as HTMLElement;
    apply.click();

    expect(editor.getAttributes('rubyText')).toEqual({ rt: 'とうきょう' });
    await element.openForEditor(editor, { focus: false });
    expect(element.annotationInput!.value).toBe('とうきょう');
});

it('removes a ruby annotation without changing the text', async () => {
    const editor = makeEditor();
    editor.commands.setRubyText({ rt: 'とうきょう' });
    const element = await mountDialog(editor);
    const remove = element.shadowRoot!.querySelector('pk-button') as HTMLElement;
    remove.click();

    expect(editor.isActive('rubyText')).toBe(false);
    expect(editor.getText()).toBe('東京');
});
