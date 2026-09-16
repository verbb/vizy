import { afterEach, describe, expect, it } from 'vitest';

/**
 * happy-dom lacks ElementInternals, so stub pk-color-input rather than loading
 * the real form-associated control. The bridge only needs value + events.
 */
class StubPkColorInput extends HTMLElement {
    value = '';

    connectedCallback(): void {
        this.value = this.getAttribute('value') ?? '';
    }
}

if (!customElements.get('pk-color-input')) {
    customElements.define('pk-color-input', StubPkColorInput);
}

await import('../../src/web/assets/iconpicker/src/ts/VizyColorInputElement');

const flush = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

describe('vizy-color-input', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('posts through a light-DOM hidden input for Craft slideout serialize', async () => {
        const host = document.createElement('vizy-color-input');
        host.setAttribute('name', 'color');
        host.setAttribute('value', '#13b981');
        host.id = 'color';
        document.body.append(host);
        await flush();

        const hidden = host.querySelector<HTMLInputElement>('input[type="hidden"][name="color"]');
        expect(hidden).not.toBeNull();
        expect(hidden?.value).toBe('#13b981');
        // Host name is cleared so only the hidden field serializes.
        expect(host.getAttribute('name')).toBeNull();
        expect(host.querySelector('pk-color-input')?.getAttribute('name')).toBeNull();

        const picker = host.querySelector('pk-color-input') as StubPkColorInput;
        picker.value = '#ef4444';
        picker.dispatchEvent(new CustomEvent('pk-change', {
            detail: { value: '#ef4444' },
            bubbles: true,
            composed: true,
        }));
        expect(hidden?.value).toBe('#ef4444');
    });
});
