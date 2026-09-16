import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Editor } from '@tiptap/core';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import '../../src/web/assets/field/src/ts/toolbar/VizyToolbarElement';
import '../../src/web/assets/field/src/ts/toolbar/VizyBubbleElement';
import type { ToolbarControlManifest } from '../../src/web/assets/field/src/ts/types';

const BOLD_SVG = '<svg viewBox="0 0 384 512"><path d="M0 0h1v1H0z"/></svg>';

const editors: Editor[] = [];

afterEach(() => {
    editors.splice(0).forEach((editor) => editor.destroy());
    document.body.replaceChildren();
});

function makeEditor(): Editor {
    const editor = new Editor({
        extensions: [Document, Paragraph, Text, Bold, Heading.configure({ levels: [2, 3] })],
        content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] }] },
    });
    editors.push(editor);
    return editor;
}

function boldControl(icon: string | null = BOLD_SVG): ToolbarControlManifest {
    return { id: 'bold', kind: 'mark', label: 'Bold', icon, action: { command: 'toggleMark', markName: 'bold' } };
}

function formattingControl(): ToolbarControlManifest {
    return {
        id: 'group:formatting',
        kind: 'group',
        label: 'Formatting',
        icon: BOLD_SVG,
        items: [
            { id: 'paragraph', kind: 'node', label: 'Paragraph', icon: null, action: { command: 'setParagraph' } },
            { id: 'heading2', kind: 'node', label: 'Heading 2', icon: null, action: { command: 'setHeading', level: 2 } },
        ],
    };
}

/** An action cluster: an author's own dropdown, with a fixed trigger. */
function listsControl(): ToolbarControlManifest {
    return {
        id: 'group:group:bulletList',
        kind: 'group',
        label: 'Lists',
        icon: BOLD_SVG,
        items: [
            { id: 'bulletList', kind: 'node', label: 'Bulleted list', icon: BOLD_SVG, action: { command: 'toggleNode', nodeName: 'bulletList' } },
        ],
    };
}

async function mountToolbar(controls: ToolbarControlManifest[], editor: Editor) {
    const toolbar = document.createElement('vizy-toolbar');
    toolbar.editor = editor;
    toolbar.controls = controls;
    document.body.append(toolbar);
    await toolbar.updateComplete;
    return toolbar;
}

describe('toolbar', () => {
    it('renders a placeable Add Block action from the Editor Config roster', async () => {
        const toolbar = document.createElement('vizy-toolbar');
        toolbar.editor = makeEditor();
        toolbar.canAddBlock = true;
        toolbar.addBlockNeedsMenu = true;
        toolbar.controls = [
            {
                id: 'addBlock',
                kind: 'action',
                label: 'Add Block',
                icon: null,
                action: { command: 'openAddBlock' },
            },
            boldControl(),
        ];
        document.body.append(toolbar);
        await toolbar.updateComplete;

        const add = toolbar.shadowRoot?.querySelector('[data-vizy-toolbar-add-block]');
        expect(add).not.toBeNull();
        expect(add?.getAttribute('aria-label')).toBe('Add Block');
        expect(add?.classList.contains('has-menu')).toBe(true);
        expect(add?.getAttribute('aria-expanded')).toBe('false');
        expect(add?.querySelector('pk-icon[icon="plus"]')).not.toBeNull();
        expect(add?.querySelector('.chevron svg')).not.toBeNull();
        expect(toolbar.shadowRoot?.querySelectorAll('button')).toHaveLength(2);

        toolbar.addBlockOpen = true;
        await toolbar.updateComplete;
        expect(add?.getAttribute('aria-expanded')).toBe('true');
    });

    it('renders Add Block without a chevron when only one Block Type is insertable', async () => {
        const toolbar = document.createElement('vizy-toolbar');
        toolbar.editor = makeEditor();
        toolbar.canAddBlock = true;
        toolbar.addBlockNeedsMenu = false;
        toolbar.addBlockDirectLabel = 'Add Card';
        toolbar.controls = [
            {
                id: 'addBlock',
                kind: 'action',
                label: 'Add Block',
                icon: null,
                action: { command: 'openAddBlock' },
            },
        ];
        document.body.append(toolbar);
        await toolbar.updateComplete;

        const add = toolbar.shadowRoot?.querySelector('[data-vizy-toolbar-add-block]');
        expect(add?.getAttribute('aria-label')).toBe('Add Card');
        expect(add?.classList.contains('has-menu')).toBe(false);
        expect(add?.hasAttribute('aria-expanded')).toBe(false);
        expect(add?.querySelector('.chevron')).toBeNull();
        expect(add?.querySelector('pk-icon[icon="plus"]')).not.toBeNull();
    });

    it('hides placed Add Block when the field has no insertable Block Types', async () => {
        const toolbar = document.createElement('vizy-toolbar');
        toolbar.editor = makeEditor();
        toolbar.canAddBlock = false;
        toolbar.controls = [
            {
                id: 'addBlock',
                kind: 'action',
                label: 'Add Block',
                icon: null,
                action: { command: 'openAddBlock' },
            },
            boldControl(),
        ];
        document.body.append(toolbar);
        await toolbar.updateComplete;

        expect(toolbar.shadowRoot?.querySelector('[data-vizy-toolbar-add-block]')).toBeNull();
        expect(toolbar.shadowRoot?.querySelectorAll('button')).toHaveLength(1);
    });

    it('emits hadEditorFocus false when Add Block opens cold', async () => {
        const editor = makeEditor();
        const toolbar = document.createElement('vizy-toolbar');
        toolbar.editor = editor;
        toolbar.canAddBlock = true;
        toolbar.controls = [
            {
                id: 'addBlock',
                kind: 'action',
                label: 'Add Block',
                icon: null,
                action: { command: 'openAddBlock' },
            },
        ];
        document.body.append(toolbar);
        await toolbar.updateComplete;

        const seen: boolean[] = [];
        toolbar.addEventListener('vizy-toolbar-ui', ((event: CustomEvent) => {
            seen.push(event.detail.hadEditorFocus);
        }) as EventListener);

        document.body.focus();
        expect(editor.view.hasFocus()).toBe(false);

        const add = toolbar.shadowRoot?.querySelector('[data-vizy-toolbar-add-block]') as HTMLButtonElement;
        add.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
        add.click();

        expect(seen).toEqual([false]);
    });

    it('emits hadEditorFocus true when Add Block opens warm', async () => {
        const editor = makeEditor();
        const fieldBody = document.createElement('div');
        fieldBody.className = 'vizy-editor-body';
        fieldBody.append(editor.view.dom);
        document.body.append(fieldBody);
        editor.view.focus();

        const toolbar = document.createElement('vizy-toolbar');
        toolbar.editor = editor;
        toolbar.canAddBlock = true;
        toolbar.controls = [
            {
                id: 'addBlock',
                kind: 'action',
                label: 'Add Block',
                icon: null,
                action: { command: 'openAddBlock' },
            },
        ];
        document.body.append(toolbar);
        await toolbar.updateComplete;

        const seen: boolean[] = [];
        toolbar.addEventListener('vizy-toolbar-ui', ((event: CustomEvent) => {
            seen.push(event.detail.hadEditorFocus);
        }) as EventListener);

        const add = toolbar.shadowRoot?.querySelector('[data-vizy-toolbar-add-block]') as HTMLButtonElement;
        add.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
        add.click();

        expect(seen).toEqual([true]);
        fieldBody.remove();
    });

    it('renders controls as icon buttons carrying an accessible name', async () => {
        const toolbar = await mountToolbar([boldControl()], makeEditor());
        const button = toolbar.shadowRoot?.querySelector('button');

        // The glyph is the only visible content, so the name must come from
        // attributes rather than text.
        expect(button?.querySelector('svg')).not.toBeNull();
        expect(button?.getAttribute('aria-label')).toBe('Bold');
        // Name comes from aria-label + shared pk-tooltip; native title would
        // paint a second browser tip over the kit one.
        expect(button?.hasAttribute('title')).toBe(false);
        expect(button?.textContent?.trim()).toBe('');
    });

    it('falls back to a text label when a control has no mapped glyph', async () => {
        const toolbar = await mountToolbar([boldControl(null)], makeEditor());
        const button = toolbar.shadowRoot?.querySelector('button');

        // An unlabelled empty 36px square would be unusable.
        expect(button?.querySelector('svg')).toBeNull();
        expect(button?.classList.contains('is-text')).toBe(true);
        expect(button?.textContent?.trim()).toBe('Bold');
    });

    it('draws a short stand-in glyph in the square, keeping the full name for the label', async () => {
        // How the heading levels are drawn, as Vizy 3 drew them: Font Awesome's free set
        // has no H4 to H6, so three of them would otherwise share the generic glyph and be
        // impossible to tell apart.
        const toolbar = await mountToolbar([{
            id: 'heading3',
            kind: 'node',
            label: 'Heading 3',
            icon: null,
            abbr: 'H3',
            action: { command: 'setHeading', level: 3 },
        }], makeEditor());
        const button = toolbar.shadowRoot?.querySelector('button');

        expect(button?.querySelector('.abbr')?.textContent).toBe('H3');
        // The stand-in was chosen to fit, so the button keeps the 36px square that every
        // other one has rather than widening the way a full label has to.
        expect(button?.classList.contains('is-text')).toBe(false);
        expect(button?.getAttribute('aria-label')).toBe('Heading 3');
    });

    it('renders a separator as a rule rather than a button', async () => {
        const toolbar = await mountToolbar([
            boldControl(),
            { id: 'separator', kind: 'presentation', label: 'Separator', icon: null, presentation: 'separator' },
            { id: 'italic', kind: 'mark', label: 'Italic', icon: BOLD_SVG, action: { command: 'toggleMark', markName: 'italic' } },
        ], makeEditor());

        expect(toolbar.shadowRoot?.querySelector('.vizy-separator')).not.toBeNull();
        expect(toolbar.shadowRoot?.querySelectorAll('button')).toHaveLength(2);
    });

    it('skips a presentation token with neither a rule nor contents', async () => {
        // `more` is retired; anything like it must not render as a dead button.
        const toolbar = await mountToolbar([
            { id: 'more', kind: 'presentation', label: 'More', icon: null, presentation: 'more' },
        ], makeEditor());

        expect(toolbar.shadowRoot?.querySelectorAll('button')).toHaveLength(0);
    });

    it('skips a control naming a command it cannot carry out', async () => {
        // A config saved against a newer Vizy, met by an older cached field bundle. A
        // button that silently does nothing is worse than one that is not there.
        const toolbar = await mountToolbar([
            { id: 'timeTravel', kind: 'node', label: 'Time travel', icon: BOLD_SVG, action: { command: 'wormhole' } as never },
            boldControl(),
        ], makeEditor());

        const buttons = toolbar.shadowRoot?.querySelectorAll('button') ?? [];
        expect(Array.from(buttons).map((button) => button.getAttribute('aria-label'))).toEqual(['Bold']);
    });

    it('drops a group whose every item is unrecognised, rather than opening an empty menu', async () => {
        const toolbar = await mountToolbar([
            {
                id: 'group:group:nothing',
                kind: 'group',
                label: 'Nothing',
                icon: BOLD_SVG,
                items: [{ id: 'x', kind: 'node', label: 'X', icon: null, action: { command: 'wormhole' } as never }],
            },
        ], makeEditor());

        expect(toolbar.shadowRoot?.querySelectorAll('button')).toHaveLength(0);
    });

    it('reflects active mark state on the button', async () => {
        const editor = makeEditor();
        const toolbar = await mountToolbar([boldControl()], editor);
        const button = toolbar.shadowRoot?.querySelector('button');
        expect(button?.getAttribute('aria-pressed')).toBe('false');

        editor.commands.setTextSelection({ from: 1, to: 6 });
        button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await toolbar.updateComplete;

        expect(editor.isActive('bold')).toBe(true);
        expect(toolbar.shadowRoot?.querySelector('button')?.getAttribute('aria-pressed')).toBe('true');
    });

    it('draws dropdown triggers with an SVG chevron beside the main glyph', async () => {
        const toolbar = await mountToolbar([formattingControl()], makeEditor());
        const trigger = toolbar.shadowRoot?.querySelector('pk-dropdown-menu button[slot="trigger"]');

        expect(trigger?.classList.contains('has-menu')).toBe(true);
        expect(trigger?.querySelector('.chevron svg')).not.toBeNull();
        expect(trigger?.querySelector('.chevron')?.textContent?.trim()).toBe('');
    });

    it('keeps the shared pk-tooltip from expanding the toolbar strip', async () => {
        const toolbar = await mountToolbar([boldControl()], makeEditor());

        expect(toolbar.shadowRoot?.querySelector('pk-tooltip')).not.toBeNull();
    });

    it('drops separators left dangling when the controls around them do not render', async () => {
        const toolbar = await mountToolbar([
            boldControl(),
            { id: 'separator', kind: 'presentation', label: 'Separator', icon: null, presentation: 'separator' },
            { id: 'timeTravel', kind: 'node', label: 'Time travel', icon: BOLD_SVG, action: { command: 'wormhole' } as never },
            { id: 'separator', kind: 'presentation', label: 'Separator', icon: null, presentation: 'separator' },
            { id: 'italic', kind: 'mark', label: 'Italic', icon: BOLD_SVG, action: { command: 'toggleMark', markName: 'italic' } },
        ], makeEditor());

        expect(toolbar.shadowRoot?.querySelectorAll('.vizy-separator')).toHaveLength(1);
        expect(toolbar.shadowRoot?.querySelectorAll('button')).toHaveLength(2);
    });

    it('opens the Formatting dropdown and applies a heading option', async () => {
        const editor = makeEditor();
        const toolbar = await mountToolbar([formattingControl()], editor);
        const menu = toolbar.shadowRoot?.querySelector('pk-dropdown-menu') as HTMLElement & { open: boolean };
        const trigger = menu?.querySelector('button[slot="trigger"]');

        expect(menu?.open).toBe(false);

        trigger?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await toolbar.updateComplete;
        await Promise.resolve();

        expect(menu?.open).toBe(true);
        const options = menu?.querySelectorAll('pk-dropdown-item');
        expect(Array.from(options ?? []).map((option) => option.textContent?.trim()))
            .toEqual(['Paragraph', 'Heading 2']);

        menu?.dispatchEvent(new CustomEvent('pk-select', {
            bubbles: true,
            composed: true,
            detail: { value: 'heading2' },
        }));
        await toolbar.updateComplete;

        expect(editor.isActive('heading', { level: 2 })).toBe(true);
    });

    it('keeps a fixed glyph on Formatting, matching the Editor Config preview', async () => {
        // The trigger used to rewrite itself into "Paragraph" / "Heading 2" text whenever
        // reflectsValue was set. That matched CKEditor's style picker, but not Vizy 3, not
        // Alignment/Table on the same row, and not the settings preview — so authors saw a
        // pilcrow in the builder and a text label in the field. Current value stays in the
        // open menu via aria-pressed.
        const editor = makeEditor();
        const toolbar = await mountToolbar([formattingControl(), listsControl()], editor);
        const trigger = () => toolbar.shadowRoot?.querySelectorAll('pk-dropdown-menu button[slot="trigger"]') ?? [];

        expect(trigger()[0]?.querySelector('svg')).not.toBeNull();
        expect(trigger()[0]?.classList.contains('is-text')).toBe(false);
        expect(trigger()[0]?.getAttribute('aria-label')).toBe('Formatting');

        editor.commands.setHeading({ level: 2 });
        toolbar.requestUpdate();
        await toolbar.updateComplete;

        expect(trigger()[0]?.querySelector('svg')).not.toBeNull();
        expect(trigger()[0]?.textContent?.trim()).toBe('');
        expect(trigger()[0]?.getAttribute('aria-label')).toBe('Formatting');

        expect(trigger()[1]?.querySelector('svg')).not.toBeNull();
        expect(trigger()[1]?.textContent?.trim()).toBe('');
    });

    it('runs a node toggle from inside a menu, which a button-only command ladder could not', async () => {
        const editor = new Editor({
            extensions: [Document, Paragraph, Text, Bold, Heading.configure({ levels: [2, 3] }), BulletList, ListItem],
            content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] }] },
        });
        editors.push(editor);

        const toolbar = await mountToolbar([listsControl()], editor);
        const menu = toolbar.shadowRoot?.querySelector('pk-dropdown-menu') as HTMLElement;
        menu?.querySelector('button[slot="trigger"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await toolbar.updateComplete;

        menu?.dispatchEvent(new CustomEvent('pk-select', {
            bubbles: true,
            composed: true,
            detail: { value: 'bulletList' },
        }));
        await toolbar.updateComplete;

        expect(editor.isActive('bulletList')).toBe(true);
    });

    it('closes the dropdown on Escape and on an outside pointer press', async () => {
        const editor = makeEditor();
        const toolbar = await mountToolbar([formattingControl()], editor);
        const menu = () => toolbar.shadowRoot?.querySelector('pk-dropdown-menu') as HTMLElement & { open: boolean };
        const open = async () => {
            menu()?.querySelector('button[slot="trigger"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            await toolbar.updateComplete;
            await Promise.resolve();
        };

        await open();
        expect(menu()?.open).toBe(true);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        await toolbar.updateComplete;
        await Promise.resolve();
        expect(menu()?.open).toBe(false);

        await open();
        document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }));
        await toolbar.updateComplete;
        await Promise.resolve();
        expect(menu()?.open).toBe(false);
    });

    it('holds field focus ring while a toolbar menu is open and restores on close without mousedown focus', async () => {
        const editor = makeEditor();
        // Put the editor surface in field focus ring so restore + hold resolve.
        const fieldBody = document.createElement('div');
        fieldBody.className = 'vizy-editor-body';
        fieldBody.append(editor.view.dom);
        document.body.append(fieldBody);
        editor.view.focus();

        const toolbar = await mountToolbar([formattingControl()], editor);
        const menu = toolbar.shadowRoot?.querySelector('pk-dropdown-menu') as HTMLElement & { open: boolean };
        const trigger = menu?.querySelector('button[slot="trigger"]') as HTMLButtonElement;

        // Capture focused-at-gesture before open (same path as a real click).
        trigger.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
        menu.dispatchEvent(new CustomEvent('pk-open-change', {
            bubbles: true,
            composed: true,
            detail: { open: true },
        }));
        expect(fieldBody.hasAttribute('data-has-focus')).toBe(true);

        // mousedown must only preserve selection — never focus (select-all footgun).
        const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
        trigger.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);

        menu.dispatchEvent(new CustomEvent('pk-open-change', {
            bubbles: true,
            composed: true,
            detail: { open: false },
        }));
        await Promise.resolve();
        await Promise.resolve();
        expect(fieldBody.hasAttribute('data-has-focus')).toBe(false);

        fieldBody.remove();
    });

    it('does not paint field focus ring or restore focus when a toolbar menu opens cold', async () => {
        const editor = makeEditor();
        const fieldBody = document.createElement('div');
        fieldBody.className = 'vizy-editor-body';
        fieldBody.append(editor.view.dom);
        document.body.append(fieldBody);

        const toolbar = await mountToolbar([formattingControl()], editor);
        const menu = toolbar.shadowRoot?.querySelector('pk-dropdown-menu') as HTMLElement;
        const trigger = menu?.querySelector('button[slot="trigger"]') as HTMLButtonElement;

        document.body.focus();
        expect(editor.view.hasFocus()).toBe(false);

        trigger.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
        menu.dispatchEvent(new CustomEvent('pk-open-change', {
            bubbles: true,
            composed: true,
            detail: { open: true },
        }));
        expect(fieldBody.hasAttribute('data-has-focus')).toBe(false);

        menu.dispatchEvent(new CustomEvent('pk-open-change', {
            bubbles: true,
            composed: true,
            detail: { open: false },
        }));
        await Promise.resolve();
        await Promise.resolve();

        expect(editor.isFocused).toBe(false);
        expect(fieldBody.hasAttribute('data-has-focus')).toBe(false);

        fieldBody.remove();
        editor.destroy();
    });

    it('does not restore editor focus when an open menu closes from an outside pointer press', async () => {
        const editor = makeEditor();
        const fieldBody = document.createElement('div');
        fieldBody.className = 'vizy-editor-body';
        fieldBody.append(editor.view.dom);
        document.body.append(fieldBody);
        editor.view.focus();

        const toolbar = await mountToolbar([formattingControl()], editor);
        const menu = toolbar.shadowRoot?.querySelector('pk-dropdown-menu') as HTMLElement;
        const trigger = menu?.querySelector('button[slot="trigger"]') as HTMLButtonElement;
        trigger.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
        menu.dispatchEvent(new CustomEvent('pk-open-change', {
            bubbles: true,
            composed: true,
            detail: { open: true },
        }));

        document.body.focus();
        document.body.dispatchEvent(new PointerEvent('pointerdown', {
            bubbles: true,
            composed: true,
        }));
        menu.dispatchEvent(new CustomEvent('pk-open-change', {
            bubbles: true,
            composed: true,
            detail: { open: false },
        }));
        await Promise.resolve();

        expect(editor.isFocused).toBe(false);
        expect(document.activeElement).toBe(document.body);
        expect(fieldBody.hasAttribute('data-has-focus')).toBe(false);

        fieldBody.remove();
    });

    it('does not restore editor focus when toggling a menu closed via its trigger', async () => {
        const editor = makeEditor();
        const fieldBody = document.createElement('div');
        fieldBody.className = 'vizy-editor-body';
        fieldBody.append(editor.view.dom);
        document.body.append(fieldBody);
        editor.view.focus();

        const toolbar = await mountToolbar([formattingControl()], editor);
        const menu = toolbar.shadowRoot?.querySelector('pk-dropdown-menu') as HTMLElement;
        const trigger = menu?.querySelector('button[slot="trigger"]') as HTMLButtonElement;

        trigger.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
        menu.dispatchEvent(new CustomEvent('pk-open-change', {
            bubbles: true,
            composed: true,
            detail: { open: true },
        }));
        expect(fieldBody.hasAttribute('data-has-focus')).toBe(true);

        // Rapid toggle: pointer on the trigger must not bounce focus into the editor.
        trigger.focus();
        trigger.dispatchEvent(new PointerEvent('pointerdown', {
            bubbles: true,
            composed: true,
            cancelable: true,
        }));
        menu.dispatchEvent(new CustomEvent('pk-open-change', {
            bubbles: true,
            composed: true,
            detail: { open: false },
        }));
        await Promise.resolve();
        await Promise.resolve();

        expect(editor.isFocused).toBe(false);
        expect(fieldBody.hasAttribute('data-has-focus')).toBe(false);

        fieldBody.remove();
    });

    it('ignores a closed notification from a menu that was never open', async () => {
        const editor = makeEditor();
        const fieldBody = document.createElement('div');
        fieldBody.className = 'vizy-editor-body';
        fieldBody.append(editor.view.dom);
        document.body.append(fieldBody);

        const toolbar = await mountToolbar([formattingControl()], editor);
        const menu = toolbar.shadowRoot?.querySelector('pk-dropdown-menu') as HTMLElement;

        // This mirrors PK synchronizing a closed menu after an unrelated page
        // click. Body focus must not be interpreted as permission to enter Vizy.
        document.body.focus();
        menu.dispatchEvent(new CustomEvent('pk-open-change', {
            bubbles: true,
            composed: true,
            detail: { open: false },
        }));
        await Promise.resolve();

        expect(editor.isFocused).toBe(false);
        expect(document.activeElement).toBe(document.body);
        expect(fieldBody.hasAttribute('data-has-focus')).toBe(false);

        fieldBody.remove();
    });

    it('owns sticky toolbars by focus (root until Hosted nested is active)', () => {
        const css = readFileSync(
            resolve(process.cwd(), 'src/web/assets/field/src/ts/vizy.css'),
            'utf8',
        );
        // Default is static — only the ownership selectors pin under Craft header.
        expect(css).toMatch(/vizy-toolbar\s*\{[^}]*position:\s*static/);
        expect(css).toContain('vizy-editor:not([data-vizy-hosted])');
        expect(css).toContain('vizy-editor[data-vizy-hosted]');
        expect(css).toContain('data-has-focus');
        expect(css).toMatch(
            /vizy-editor:not\(\[data-vizy-hosted\]\)[\s\S]*?>\s*vizy-toolbar\s*\{[^}]*position:\s*sticky/,
        );
        expect(css).toMatch(
            /vizy-editor\[data-vizy-hosted\][\s\S]*?>\s*vizy-toolbar\s*\{[^}]*position:\s*sticky/,
        );
    });

    it('draws bubble controls smaller than the field toolbar', () => {
        const real = readFileSync(
            resolve(process.cwd(), 'src/web/assets/field/src/ts/toolbar/control-appearance.ts'),
            'utf8',
        );
        const bubble = readFileSync(
            resolve(process.cwd(), 'src/web/assets/field/src/ts/toolbar/VizyBubbleElement.ts'),
            'utf8',
        );
        const toolbarBox = real.match(/\.vizy-control\s*\{[^}]*width:\s*([^;]+);[^}]*height:\s*([^;]+);[^}]*font-size:\s*([^;]+);/) ?? [];
        expect(toolbarBox.slice(1)).toEqual(['32px', '32px', '16px']);
        expect(bubble).toMatch(/\.vizy-control\s*\{[^}]*width:\s*26px/);
        expect(bubble).toMatch(/\.vizy-control\s*\{[^}]*height:\s*28px/);
        expect(bubble).toMatch(/\.vizy-control\s*\{[^}]*font-size:\s*14px/);
    });

    it('shares the icon appearance with the bubble menu', async () => {
        const bubble = document.createElement('vizy-bubble');
        bubble.editor = makeEditor();
        bubble.controls = [boldControl()];
        bubble.visible = true;
        document.body.append(bubble);
        await bubble.updateComplete;

        const button = bubble.shadowRoot?.querySelector('button');
        expect(button?.classList.contains('vizy-control')).toBe(true);
        expect(button?.querySelector('svg')).not.toBeNull();
        expect(button?.getAttribute('aria-label')).toBe('Bold');
    });

    it('places the selection bubble via pk-popup against a virtual selection rect', async () => {
        const bubble = document.createElement('vizy-bubble');
        bubble.editor = makeEditor();
        bubble.controls = [boldControl()];
        document.body.append(bubble);

        const rect = new DOMRect(120, 180, 48, 18);
        bubble.syncToSelection({
            getClientRect: () => rect,
            contextElement: document.body,
        });
        await bubble.updateComplete;

        const popup = document.body.querySelector('pk-popup.vizy-bubble-popup');
        expect(popup).not.toBeNull();
        expect(popup?.contains(bubble)).toBe(true);
        expect((popup as HTMLElement & { active: boolean }).active).toBe(true);
        expect(bubble.visible).toBe(true);
        expect(bubble.shadowRoot?.querySelector('.panel')).not.toBeNull();

        bubble.hide();
        expect(bubble.visible).toBe(false);
        expect((popup as HTMLElement & { active: boolean }).active).toBe(false);

        bubble.remove();
        expect(document.body.querySelector('pk-popup.vizy-bubble-popup')).toBeNull();
    });
});

describe('table contextual dropdown', () => {
    function tableDropdown(): ToolbarControlManifest {
        return {
            id: 'dropdown:table',
            kind: 'group',
            label: 'Table',
            icon: BOLD_SVG,
            items: [
                {
                    id: 'table',
                    kind: 'action',
                    label: 'Insert table',
                    icon: null,
                    action: { command: 'insertNode', nodeName: 'table' },
                },
                {
                    id: 'addRowAfter',
                    kind: 'action',
                    label: 'Add row after',
                    icon: null,
                    action: { command: 'tableOperation', operation: 'addRowAfter' },
                },
                {
                    id: 'deleteTable',
                    kind: 'action',
                    label: 'Delete table',
                    icon: null,
                    action: { command: 'tableOperation', operation: 'deleteTable' },
                },
            ],
        };
    }

    async function makeTableToolbarEditor(): Promise<{ editor: Editor; toolbar: HTMLElementTagNameMap['vizy-toolbar'] }> {
        const { BlockUiStateRegistry, FieldHostRegistry } = await import('../../src/web/assets/field/src/ts/registries');
        const { createEditorExtensions } = await import('../../src/web/assets/field/src/ts/editor-schema');
        const { createInsertionRegistry } = await import('../../src/web/assets/field/src/ts/insertion/registry');
        const { nodeViewServices } = await import('./support/node-view-services');
        const ui = new BlockUiStateRegistry();
        const hosts = new FieldHostRegistry();
        const manifest = {
            manifestVersion: 1 as const,
            uid: 'request',
            revision: '1:test',
            hash: 'test',
            registryRevision: 'registry',
            schemaRevision: 'schema',
            enabledNodes: ['paragraph', 'table', 'tableRow', 'tableCell', 'tableHeader'],
            enabledMarks: [],
            internalNodes: ['doc', 'text', 'tableRow', 'tableCell', 'tableHeader'],
            modules: [
                'vizy/core/node/doc',
                'vizy/core/node/text',
                'vizy/core/node/paragraph',
                'vizy/core/node/table',
                'vizy/core/node/tableRow',
                'vizy/core/node/tableCell',
                'vizy/core/node/tableHeader',
            ],
            field: {
                fieldUid: 'field',
                rootContentType: 'rich' as const,
                blockTypePickerGroups: [],
                allowedBlockTypeUids: [],
                insertableBlockTypeUids: [],
                minBlocks: null,
                maxBlocks: null,
            },
            blockTypes: {},
            insertionItems: [],
        };
        let editor!: Editor;
        let insertion!: ReturnType<typeof createInsertionRegistry>;
        editor = new Editor({
            element: document.createElement('div'),
            extensions: createEditorExtensions(manifest, () => nodeViewServices({
                editor, manifest, ui, hosts, insertion,
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
        const toolbar = await mountToolbar([tableDropdown()], editor);
        return { editor, toolbar };
    }

    function menuValues(toolbar: HTMLElement): string[] {
        return [...(toolbar.shadowRoot?.querySelectorAll('pk-dropdown-item') ?? [])]
            .map((item) => item.getAttribute('value') ?? '');
    }

    it('shows Insert table only when the caret is outside a table', async () => {
        const { toolbar } = await makeTableToolbarEditor();
        await toolbar.updateComplete;
        expect(menuValues(toolbar)).toEqual(['table']);
    });

    it('shows structure ops only when the caret is inside a table', async () => {
        const { editor, toolbar } = await makeTableToolbarEditor();
        editor.chain().focus().insertTable({ rows: 2, cols: 2, withHeaderRow: false }).run();
        expect(editor.isActive('table')).toBe(true);
        await toolbar.updateComplete;
        expect(menuValues(toolbar)).toEqual(['addRowAfter', 'deleteTable']);
    });
});
