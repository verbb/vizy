import { describe, expect, it } from 'vitest';
import '../../src/web/assets/field/src/ts/components/VizyBlockElement';

describe('vizy-block field layout loading state', () => {
    it('keeps Block header painted with no spinner while Craft layout mounts', async () => {
        const block = document.createElement('vizy-block');
        block.expectsFieldLayout = true;
        block.fieldLayoutState = 'loading';
        block.typeName = 'Block';
        block.layoutTabLabels = ['Tab 1', 'Tab 2'];
        document.body.append(block);
        await block.updateComplete;

        expect(block.shadowRoot?.querySelector('header')).not.toBeNull();
        expect(block.shadowRoot?.querySelector('.type-label')?.textContent).toBe('Block');
        expect(block.shadowRoot?.querySelector('.layout-tab')).not.toBeNull();
        expect(block.shadowRoot?.querySelector('.block-contents')).not.toBeNull();
        expect(block.shadowRoot?.querySelector('[part=body]')).not.toBeNull();
        expect(block.shadowRoot?.querySelector('[part=body]')?.getAttribute('aria-busy')).toBe('true');
        expect(block.shadowRoot?.querySelector('.field-loading')).toBeNull();
        expect(block.shadowRoot?.querySelector('pk-spinner')).toBeNull();

        block.fieldLayoutState = 'mounted';
        await block.updateComplete;

        expect(block.shadowRoot?.querySelector('[part=body]')?.hasAttribute('aria-busy')).toBe(false);
        expect(block.shadowRoot?.querySelector('header')).not.toBeNull();

        block.remove();
    });

    it('reveals the body immediately when the block type has no Craft layout', async () => {
        const block = document.createElement('vizy-block');
        block.expectsFieldLayout = false;
        block.fieldLayoutState = 'unmounted';
        document.body.append(block);
        await block.updateComplete;

        expect(block.shadowRoot?.querySelector('.field-loading')).toBeNull();
        expect(block.shadowRoot?.querySelector('pk-spinner')).toBeNull();
        expect(block.shadowRoot?.querySelector('header')).not.toBeNull();

        block.remove();
    });
});
