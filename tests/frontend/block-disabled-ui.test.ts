import { describe, expect, it } from 'vitest';
import '../../src/web/assets/field/src/ts/components/VizyBlockElement';

describe('vizy-block disabled UI', () => {
    it('shows a pk-status dot, stays collapsed, and drops the disabled badge', async () => {
        const block = document.createElement('vizy-block');
        block.typeName = 'Card';
        block.title = 'Some card copy';
        document.body.append(block);
        await block.updateComplete;
        // Disable after mount so the enabled→disabled path forces collapse.
        block.enabled = false;
        block.disabled = true;
        await block.updateComplete;

        expect(block.hasAttribute('disabled')).toBe(true);
        expect(block.collapsed).toBe(true);
        expect(block.hasAttribute('collapsed')).toBe(true);
        expect(block.shadowRoot?.querySelector('pk-status[status="off"]')).not.toBeNull();
        expect(block.shadowRoot?.querySelector('.badge.disabled-label')).toBeNull();
        expect(block.shadowRoot?.textContent).not.toContain('Disabled');

        block.shadowRoot?.querySelector<HTMLButtonElement>('button[part="collapse"]')?.click();
        await block.updateComplete;
        expect(block.collapsed).toBe(true);

        block.remove();
    });

    it('collapses when enabled flips to disabled', async () => {
        const block = document.createElement('vizy-block');
        block.typeName = 'Card';
        block.title = 'Some card copy';
        block.enabled = true;
        block.collapsed = false;
        document.body.append(block);
        await block.updateComplete;

        let collapsed = false;
        block.addEventListener('vizy-collapse-change', (event) => {
            collapsed = Boolean((event as CustomEvent<{ collapsed: boolean }>).detail?.collapsed);
        });

        block.enabled = false;
        block.disabled = true;
        await block.updateComplete;

        expect(block.collapsed).toBe(true);
        expect(collapsed).toBe(true);
        block.remove();
    });
});
