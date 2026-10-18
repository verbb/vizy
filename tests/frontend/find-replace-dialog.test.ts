import { afterEach, expect, it, vi } from 'vitest';
import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import FindAndReplace from '@tiptap/extension-find-and-replace';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { createVizyCharacterCount } from '../../src/web/assets/field/src/ts/semantic/character-count';
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

async function mountDialog(text = 'alpha beta alpha', limit: number | null = null): Promise<{ editor: Editor; element: VizyFindReplaceDialogElement }> {
    await ensurePkDialog();
    const editor = new Editor({
        element: document.createElement('div'),
        extensions: [Document, Paragraph, Text, FindAndReplace.configure({ injectCSS: false, searchDebounceMs: 0 }), createVizyCharacterCount({ limit, autoTrim: false })],
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

it.each([{ isComposing: true }, { keyCode: 229 }])('does not navigate results when Enter confirms an IME composition: %j', async (composition) => {
    const { editor, element } = await mountDialog('東京 東京');
    element.findInput!.value = '東京';
    element.findInput!.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    expect(editor.storage.findAndReplace.currentIndex).toBe(0);
    element.findInput!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', ...composition, bubbles: true, composed: true }));
    expect(editor.storage.findAndReplace.currentIndex).toBe(0);

    element.findInput!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    expect(editor.storage.findAndReplace.currentIndex).toBe(1);
});

it.each(['Replace', 'Replace all'])('explains character-limit rejection for %s and allows correction', async (action) => {
    const { editor, element } = await mountDialog('cat cat', 9);
    element.findInput!.value = 'cat';
    element.findInput!.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    element.replaceInput!.value = 'kitten';
    element.replaceInput!.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await element.updateComplete;
    const button = [...element.shadowRoot!.querySelectorAll('pk-button')].find((item) => item.textContent?.trim() === action) as HTMLElement;
    button.click();
    await element.updateComplete;

    expect(editor.getText()).toBe('cat cat');
    expect(editor.storage.findAndReplace.results).toHaveLength(2);
    expect(element.shadowRoot!.querySelector('[role="alert"]')?.textContent).toContain('character limit');

    element.replaceInput!.value = 'dog';
    element.replaceInput!.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await element.updateComplete;
    expect(element.shadowRoot!.querySelector('[role="alert"]')).toBeNull();
    button.click();
    await element.updateComplete;
    expect(editor.getText()).toBe(action === 'Replace' ? 'dog cat' : 'dog dog');
    expect(element.shadowRoot!.querySelector('[role="alert"]')).toBeNull();
});

it('allows replacements that reduce existing over-limit content and does not report unchanged text as rejected', async () => {
    const { editor, element } = await mountDialog('kitten kitten', 5);
    element.findInput!.value = 'kitten';
    element.findInput!.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    element.replaceInput!.value = 'kitten';
    element.replaceInput!.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await element.updateComplete;
    const button = [...element.shadowRoot!.querySelectorAll('pk-button')].find((item) => item.textContent?.trim() === 'Replace all') as HTMLElement;
    button.click();
    await element.updateComplete;
    expect(element.shadowRoot!.querySelector('[role="alert"]')).toBeNull();

    element.replaceInput!.value = 'cat';
    element.replaceInput!.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    button.click();
    await element.updateComplete;
    expect(editor.getText()).toBe('cat cat');
    expect(element.shadowRoot!.querySelector('[role="alert"]')).toBeNull();
});

it('checks the combined size for Replace all while allowing a single replacement at the limit', async () => {
    const { editor, element } = await mountDialog('cat cat', 8);
    element.findInput!.value = 'cat';
    element.findInput!.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    element.replaceInput!.value = 'dogs';
    element.replaceInput!.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await element.updateComplete;
    const buttons = [...element.shadowRoot!.querySelectorAll('pk-button')];
    (buttons.find((button) => button.textContent?.trim() === 'Replace all') as HTMLElement).click();
    await element.updateComplete;
    expect(editor.getText()).toBe('cat cat');
    expect(element.shadowRoot!.querySelector('[role="alert"]')).not.toBeNull();

    (buttons.find((button) => button.textContent?.trim() === 'Replace') as HTMLElement).click();
    await element.updateComplete;
    expect(editor.getText()).toBe('dogs cat');
    expect(element.shadowRoot!.querySelector('[role="alert"]')).toBeNull();
});
