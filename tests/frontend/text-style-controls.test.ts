import { afterEach, expect, it } from 'vitest';
import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import {
    BackgroundColor,
    Color,
    FontFamily,
    FontSize,
    LineHeight,
    TextStyle,
} from '@tiptap/extension-text-style';
import {
    setTextStyleValue,
    TEXT_STYLE_OPTIONS,
} from '../../src/web/assets/field/src/ts/semantic/text-style';
import {
    VizyToolbarElement,
} from '../../src/web/assets/field/src/ts/toolbar/VizyToolbarElement';
import type { ToolbarControlManifest } from '../../src/web/assets/field/src/ts/types';

const editors: Editor[] = [];
const mounted: HTMLElement[] = [];

afterEach(() => {
    editors.splice(0).forEach(editor => editor.destroy());
    mounted.splice(0).forEach(element => element.remove());
});

function makeEditor(): Editor {
    const editor = new Editor({
        element: document.createElement('div'),
        extensions: [Document, Paragraph, Text, TextStyle, Color, BackgroundColor, FontFamily, FontSize, LineHeight],
        content: '<p>Styled text</p>',
    });
    editor.commands.selectAll();
    editors.push(editor);

    return editor;
}

const controls: ToolbarControlManifest[] = [
    ['fontFamily', 'Font family', 'fontFamily'],
    ['fontSize', 'Font size', 'fontSize'],
    ['textColor', 'Text colour', 'textColor'],
    ['lineHeight', 'Line height', 'lineHeight'],
].map(([id, label, control]) => ({
    id,
    label,
    kind: 'mark',
    action: {
        command: 'textStyleControl',
        control: control as 'fontFamily' | 'fontSize' | 'textColor' | 'lineHeight',
    },
}));

it('uses Plugin Kit defaults for the four standalone TextStyle controls', () => {
    expect(TEXT_STYLE_OPTIONS.fontSizes.map(option => option.value)).toEqual([
        null,
        '8px', '9px', '10px', '11px', '12px', '14px', '16px', '18px',
        '24px', '30px', '36px', '48px', '60px', '72px', '96px',
    ]);
    expect(TEXT_STYLE_OPTIONS.lineHeights.map(option => option.value))
        .toEqual([null, '1', '1.15', '1.5', '2']);
    expect(TEXT_STYLE_OPTIONS.textColors).toHaveLength(10);
    expect(TEXT_STYLE_OPTIONS.backgroundColors).toHaveLength(9);
});

it('applies and clears each official TextStyle attribute independently', () => {
    const editor = makeEditor();

    setTextStyleValue(editor, 'color', '#2563eb', { focus: false });
    setTextStyleValue(editor, 'backgroundColor', '#dbeafe', { focus: false });
    setTextStyleValue(editor, 'fontFamily', 'Georgia, serif', { focus: false });
    setTextStyleValue(editor, 'fontSize', '18px', { focus: false });
    setTextStyleValue(editor, 'lineHeight', '1.5', { focus: false });

    expect(editor.getAttributes('textStyle')).toMatchObject({
        color: '#2563eb',
        backgroundColor: '#dbeafe',
        fontFamily: 'Georgia, serif',
        fontSize: '18px',
        lineHeight: '1.5',
    });

    setTextStyleValue(editor, 'fontSize', null, { focus: false });
    expect(editor.getAttributes('textStyle')).toMatchObject({
        color: '#2563eb',
        backgroundColor: '#dbeafe',
        fontFamily: 'Georgia, serif',
        fontSize: null,
        lineHeight: '1.5',
    });
});

it('renders four inline menus instead of one Text style dialog trigger', async () => {
    const editor = makeEditor();
    const toolbar = new VizyToolbarElement();
    toolbar.editor = editor;
    toolbar.controls = controls;
    mounted.push(toolbar);
    document.body.append(toolbar);
    await toolbar.updateComplete;

    const root = toolbar.shadowRoot!;
    expect(root.querySelectorAll('pk-dropdown-menu')).toHaveLength(4);
    expect([...root.querySelectorAll<HTMLButtonElement>('button[slot="trigger"]')]
        .map(button => button.getAttribute('aria-label')))
        .toEqual(['Font family', 'Font size', 'Text colour', 'Line height']);
    expect(root.querySelector('vizy-text-style-dialog')).toBeNull();

    const georgia = root.querySelector<HTMLElement>('pk-dropdown-item[value="Georgia, serif"]');
    georgia?.click();
    expect(editor.getAttributes('textStyle').fontFamily).toBe('Georgia, serif');
});
