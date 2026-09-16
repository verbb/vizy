/**
 * Minimal PK overlay Escape / outside-click ship gate for live authoring.
 * Individual suites cover deeper behaviour; this file is the checklist.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import '../../src/web/assets/field/src/ts/toolbar/VizyToolbarElement';
import { LayoutPresetChooser } from '../../src/web/assets/field/src/ts/layout/preset-chooser';
import { DEFAULT_LAYOUT_PRESETS } from '../../src/web/assets/field/src/ts/layout/presets';
import type { ToolbarControlManifest } from '../../src/web/assets/field/src/ts/types';

const editors: Editor[] = [];

afterEach(() => {
    editors.splice(0).forEach((editor) => editor.destroy());
    document.body.replaceChildren();
});

const ICON = '<svg viewBox="0 0 1 1"><path d="M0 0h1v1H0z"/></svg>';

function formattingControl(): ToolbarControlManifest {
    return {
        id: 'group:formatting',
        kind: 'group',
        label: 'Formatting',
        icon: ICON,
        items: [
            { id: 'paragraph', kind: 'node', label: 'Paragraph', icon: null, action: { command: 'setParagraph' } },
        ],
    };
}

describe('PK overlay wiring (Escape / outside)', () => {
    it('closes toolbar pk-dropdown-menu on Escape', async () => {
        const editor = new Editor({
            extensions: [Document, Paragraph, Text],
            content: { type: 'doc', content: [{ type: 'paragraph' }] },
        });
        editors.push(editor);

        const toolbar = document.createElement('vizy-toolbar');
        toolbar.editor = editor;
        toolbar.controls = [formattingControl()];
        document.body.append(toolbar);
        await toolbar.updateComplete;

        const menu = () => toolbar.shadowRoot?.querySelector('pk-dropdown-menu') as HTMLElement & { open: boolean };
        menu()?.querySelector('button[slot="trigger"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await toolbar.updateComplete;
        await Promise.resolve();
        expect(menu()?.open).toBe(true);

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        await toolbar.updateComplete;
        await Promise.resolve();
        expect(menu()?.open).toBe(false);
    });

    it('closes layout preset pk-popup on Escape and outside pointerdown', () => {
        const chooser = new LayoutPresetChooser();
        const mount = document.createElement('div');
        document.body.append(mount);
        const returnFocus = document.createElement('button');
        document.body.append(returnFocus);

        chooser.open(new DOMRect(10, 10, 20, 20), DEFAULT_LAYOUT_PRESETS, mount, {
            returnFocus,
            onSelect: () => undefined,
        });
        expect(chooser.isOpen).toBe(true);
        expect(document.querySelector('pk-popup.vizy-layout-preset-popup')).toBeTruthy();

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        expect(chooser.isOpen).toBe(false);

        chooser.open(new DOMRect(10, 10, 20, 20), DEFAULT_LAYOUT_PRESETS, mount, {
            returnFocus,
            onSelect: () => undefined,
        });
        expect(chooser.isOpen).toBe(true);
        document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }));
        expect(chooser.isOpen).toBe(false);
    });
});
