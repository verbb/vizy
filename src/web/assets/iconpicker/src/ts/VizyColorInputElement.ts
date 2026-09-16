/**
 * Light-DOM bridge around `pk-color-input` for Craft CP forms.
 *
 * `pk-color-input` is form-associated (ElementInternals). Native FormData /
 * full-page submits include it, but Craft CpScreenSlideout serializes with
 * jQuery — which skips form-associated custom elements. The image browser posts
 * via a light-DOM hidden input for the same reason; colour must match.
 *
 * Host attributes (`name`, `value`, `id`, `aria-label`) are read after Craft's
 * slideout namespace rewrite, then a hidden input owns `name` and stays in sync.
 */
class VizyColorInputElement extends HTMLElement {
    #wired = false;

    connectedCallback(): void {
        if (this.#wired) return;
        this.#wired = true;

        const name = this.getAttribute('name') ?? 'color';
        const value = this.getAttribute('value') ?? '';
        const id = this.id || 'color';
        const ariaLabel = this.getAttribute('aria-label') ?? 'Color';

        // Host must not also act as a named control once the hidden input exists.
        this.removeAttribute('name');

        const hidden = document.createElement('input');
        hidden.type = 'hidden';
        hidden.name = name;
        hidden.value = value;
        hidden.id = `${id}-value`;

        const picker = document.createElement('pk-color-input') as HTMLElement & {
            value: string;
        };
        // No `name` on pk — avoids a duplicate `color` in native FormData submits.
        picker.setAttribute('value', value);
        picker.id = id;
        picker.setAttribute('aria-label', ariaLabel);

        const sync = (): void => {
            hidden.value = picker.value ?? '';
        };
        picker.addEventListener('pk-change', sync);
        picker.addEventListener('change', sync);
        picker.addEventListener('input', sync);

        this.append(hidden, picker);
    }
}

if (!customElements.get('vizy-color-input')) {
    customElements.define('vizy-color-input', VizyColorInputElement);
}

export { VizyColorInputElement };
