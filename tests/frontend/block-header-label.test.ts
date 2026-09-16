import { describe, expect, it } from 'vitest';
import '../../src/web/assets/field/src/ts/components/VizyBlockElement';

describe('vizy-block header label', () => {
    it('shows the block type name when expanded; summary stays for collapsed paint', async () => {
        const block = document.createElement('vizy-block');
        block.typeName = 'Textarea';
        block.title = 'Test XML';
        block.collapsed = false;
        document.body.append(block);
        await block.updateComplete;

        const typeLabel = block.shadowRoot?.querySelector('.type-label');
        expect(typeLabel?.textContent).toBe('Textarea');
        // Summary text is kept in the DOM for collapse transitions; CSS hides it while expanded.
        expect(block.shadowRoot?.querySelector('.summary-preview')?.textContent).toBe('Test XML');
        expect(block.hasAttribute('collapsed')).toBe(false);

        block.remove();
    });

    it('shows type name plus muted summary when collapsed', async () => {
        const block = document.createElement('vizy-block');
        block.typeName = 'Content';
        block.title = 'Test XML';
        document.body.append(block);
        await block.updateComplete;
        block.collapsed = true;
        await block.updateComplete;

        expect(block.shadowRoot?.querySelector('.type-label')?.textContent).toBe('Content');
        expect(block.shadowRoot?.querySelector('.summary-preview')?.textContent).toBe('Test XML');
        expect(block.getAttribute('collapsed')).not.toBeNull();

        block.remove();
    });

    it('prevents default on header pointerdown so ProseMirror does not select-all', async () => {
        const block = document.createElement('vizy-block');
        block.typeName = 'Block A';
        document.body.append(block);
        await block.updateComplete;

        const header = block.shadowRoot?.querySelector('header');
        expect(header).not.toBeNull();
        let activated = false;
        block.addEventListener('vizy-block-header-activate', () => {
            activated = true;
        });

        const event = new PointerEvent('pointerdown', {
            button: 0,
            bubbles: true,
            cancelable: true,
            composed: true,
        });
        header!.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
        expect(activated).toBe(true);

        block.remove();
    });

    it('does not preventDefault when pointerdown starts on the drag handle', async () => {
        const block = document.createElement('vizy-block');
        block.typeName = 'Block A';
        document.body.append(block);
        await block.updateComplete;

        const handle = block.shadowRoot?.querySelector('[data-vizy-drag-handle]');
        expect(handle).not.toBeNull();
        const event = new PointerEvent('pointerdown', {
            button: 0,
            bubbles: true,
            cancelable: true,
            composed: true,
        });
        handle!.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(false);

        block.remove();
    });

    it('omits collapsed summary when it would repeat the type name', async () => {
        const block = document.createElement('vizy-block');
        block.typeName = 'Hero';
        block.title = 'Hero';
        block.collapsed = true;
        document.body.append(block);
        await block.updateComplete;

        expect(block.shadowRoot?.querySelector('.summary-preview')).toBeNull();

        block.remove();
    });
});
