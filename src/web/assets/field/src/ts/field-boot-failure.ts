/**
 * User-visible recovery when the Vizy field cannot boot.
 *
 * Module-load failures (e.g. a Lit `css` template blowing up during
 * `vizy-block` definition) prevent `vizy-editor` from registering at all —
 * Craft then waits forever on `whenDefined` and authors see a blank box.
 * Runtime failures inside `#initialize` leave the same blank shell.
 *
 * This module paints a Craft-readable alert and, when needed, registers a
 * minimal `vizy-editor` so queued bootstraps still surface the failure
 * instead of hanging. The hidden document input is left untouched so save
 * does not wipe stored content.
 */

const FAILURE_ATTR = 'data-vizy-boot-failure';

export function formatBootFailureDetail(error: unknown): string {
    if (error instanceof Error) {
        return error.stack?.trim() || error.message || error.name;
    }
    return String(error);
}

/** Paint (or replace) the failure panel inside one field host. */
export function paintFieldBootFailure(host: Element, error: unknown): void {
    if (!(host instanceof HTMLElement)) return;

    host.setAttribute('data-vizy-failed', '');
    host.querySelectorAll(`[${FAILURE_ATTR}]`).forEach((node) => node.remove());

    const shell = document.createElement('div');
    shell.className = 'vizy-editor-shell vizy-field-boot-failure';
    shell.setAttribute(FAILURE_ATTR, '');
    shell.setAttribute('role', 'alert');

    const title = document.createElement('p');
    title.className = 'vizy-field-boot-failure__title';
    title.textContent = 'Vizy failed to load';

    const body = document.createElement('p');
    body.className = 'vizy-field-boot-failure__body';
    body.textContent = 'This field could not start. Your saved content is unchanged — reload the page, or check the browser console if this continues.';

    const detail = document.createElement('pre');
    detail.className = 'vizy-field-boot-failure__detail';
    detail.textContent = formatBootFailureDetail(error);

    shell.append(title, body, detail);

    // Keep the hidden document input as a sibling after the alert.
    const input = host.querySelector('input[data-vizy-document]');
    if (input) {
        host.insertBefore(shell, input);
    } else {
        host.prepend(shell);
    }
}

/**
 * Register a stub `vizy-editor` when the real one never defined, then paint
 * every field on the page. Safe to call more than once.
 */
export function reportFieldBootFailure(error: unknown): void {
    console.error('[Vizy] Editor failed to load', error);

    if (!customElements.get('vizy-editor')) {
        class VizyEditorBootFailureElement extends HTMLElement {
            #painted = false;

            set bootstrap(_value: unknown) {
                this.#paint();
            }

            connectedCallback(): void {
                this.#paint();
            }

            #paint(): void {
                if (this.#painted) return;
                this.#painted = true;
                paintFieldBootFailure(this, error);
            }
        }
        customElements.define('vizy-editor', VizyEditorBootFailureElement);
    }

    document.querySelectorAll('vizy-editor').forEach((host) => {
        paintFieldBootFailure(host, error);
    });
}
