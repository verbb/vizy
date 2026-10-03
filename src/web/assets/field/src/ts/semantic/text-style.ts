import type { Editor } from '@tiptap/core';
import {
    DEFAULT_TIPTAP_TEXT_STYLE_TOOLBAR_CONFIG,
    type TiptapTextStyleOption,
} from '@verbb/plugin-kit-tiptap-core';

export type TextStyleAttribute =
    | 'fontFamily'
    | 'fontSize'
    | 'color'
    | 'backgroundColor'
    | 'lineHeight';

export type TextStyleControlName = 'fontFamily' | 'fontSize' | 'textColor' | 'lineHeight';

/** Plugin Kit's public defaults are Vizy's canonical TextStyle choices too. */
export const TEXT_STYLE_OPTIONS = DEFAULT_TIPTAP_TEXT_STYLE_TOOLBAR_CONFIG;

export function getTextStyleValue(editor: Editor | null, attribute: TextStyleAttribute): string | null {
    const value = editor?.getAttributes('textStyle')[attribute];
    return typeof value === 'string' && value ? value : null;
}

export function getTextStyleOptionLabel(
    options: readonly TiptapTextStyleOption[],
    value: string | null,
): string {
    return options.find(option => option.value === value)?.label
        ?? options.find(option => option.value === null)?.label
        ?? 'Default';
}

/** Apply one official TextStyle attribute without disturbing the other four. */
export function setTextStyleValue(
    editor: Editor,
    attribute: TextStyleAttribute,
    value: string | null,
    options?: { focus?: boolean },
): boolean {
    const chain = options?.focus === false ? editor.chain() : editor.chain().focus();

    switch (attribute) {
        case 'fontFamily':
            return value ? chain.setFontFamily(value).run() : chain.unsetFontFamily().run();
        case 'fontSize':
            return value ? chain.setFontSize(value).run() : chain.unsetFontSize().run();
        case 'color':
            return value ? chain.setColor(value).run() : chain.unsetColor().run();
        case 'backgroundColor':
            return value ? chain.setBackgroundColor(value).run() : chain.unsetBackgroundColor().run();
        case 'lineHeight':
            return value ? chain.setLineHeight(value).run() : chain.unsetLineHeight().run();
    }
}
