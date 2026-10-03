import { afterEach, expect, it, vi } from 'vitest';
import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import FindAndReplace from '@tiptap/extension-find-and-replace';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { ensurePkDialog } from '../../src/web/assets/field/src/ts/pk-dialog';
import { VizyFindReplaceDialogElement } from '../../src/web/assets/field/src/ts/semantic/find-replace-dialog';
import { installAnimationsShim, installElementInternalsShim } from './support/element-internals';

installElementInternalsShim();
installAnimationsShim();

const editors: Editor[] = [];
const mounted: VizyFindReplaceDialogElement[] = [];

afterEach(() => {
    editors.splice(0).forEach((editor) => editor.destroy());
    mounted.splice(0).forEach((element) => element.remove());
    vi.restoreAllMocks();
});

async function mountDialog(text = 'alpha beta alpha'): Promise<{ editor: Editor; element: VizyFindReplaceDialogElement }> {
    await ensurePkDialog();
    const editor = new Editor({
        element: document.createElement('div'),
        extensions: [Document, Paragraph, Text, FindAndReplace.configure({ injectCSS: false, searchDebounceMs: 0 })],
        content: `<p>${text}</p>`,
    });
    editors.push(editor);
    const element = new VizyFindReplaceDialogElement();
    mounted.push(element);
    document.body.append(element);
    await element.updateComplete;
    vi.spyOn(element.dialog!, 'show').mockResolvedValue();
    vi.spyOn(element.dialog!, 'hide').mockResolvedValue();
    await element.openForEditor(editor);

    return { editor, element };
}

it('finds and replaces every match through the official commands', async () => {
    const { editor, element } = await mountDialog();
    element.findInput!.value = 'alpha';
    element.findInput!.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    element.replaceInput!.value = 'omega';
    element.replaceInput!.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await element.updateComplete;

    expect(editor.storage.findAndReplace.results).toHaveLength(2);
    expect(element.shadowRoot!.textContent).toContain('1 of 2');
    const buttons = [...element.shadowRoot!.querySelectorAll('pk-button')];
    (buttons.find((button) => button.textContent?.trim() === 'Replace all') as HTMLElement).click();

    expect(editor.getText()).toBe('omega beta omega');
});

it('supports case-sensitive searches and clears highlights when closed', async () => {
    const { editor, element } = await mountDialog('Alpha alpha');
    element.findInput!.value = 'alpha';
    element.findInput!.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    expect(editor.storage.findAndReplace.results).toHaveLength(2);
    element.caseCheckbox!.checked = true;
    element.caseCheckbox!.dispatchEvent(new CustomEvent('pk-change', { bubbles: true, composed: true }));
    expect(editor.storage.findAndReplace.results).toHaveLength(1);

    element.dialog!.dispatchEvent(new CustomEvent('pk-after-hide', { bubbles: true, composed: true }));
    expect(editor.storage.findAndReplace.searchTerm).toBe('');
});
