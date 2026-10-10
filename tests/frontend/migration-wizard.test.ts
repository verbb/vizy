import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { requestMigrationWizard } from '../../src/web/assets/migrations/src/ts/migration-request';
import { installElementInternalsShim } from './support/element-internals';

installElementInternalsShim();

beforeAll(async () => {
    await import('../../src/web/assets/migrations/src/ts/migrations');
});

afterEach(() => {
    document.body.replaceChildren();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

function mountWizard(): { wizard: HTMLElement; form: HTMLFormElement } {
    document.body.innerHTML = '<main data-page-shell>Original page shell</main>';
    const wizard = document.createElement('section');
    wizard.dataset.currentWizard = '';
    wizard.setAttribute('initial-step', '1');
    wizard.innerHTML = `
        <section data-vizy-step-panel="1">
            <pk-alert data-vizy-request-error hidden></pk-alert>
            <form action="/admin/actions/vizy/rich-text-conversions/analyze-from-vizy" method="post" data-vizy-loading-step="2">
                <input type="hidden" name="action" value="vizy/rich-text-conversions/analyze-from-vizy">
                <input name="field" value="source-uid">
                <input name="destination" value="destination-uid">
            </form>
        </section>
        <section data-vizy-step-panel="2" hidden>Preview</section>
        <div data-vizy-loading hidden>
            <div data-vizy-loading-analyze hidden>Analysing</div>
            <div data-vizy-loading-copy hidden>Copying</div>
        </div>
    `;
    document.body.append(wizard);

    return {
        wizard,
        form: wizard.querySelector<HTMLFormElement>('form')!,
    };
}

function mountLoadingWizard(loadingStep: 2 | 4): { form: HTMLFormElement; wizard: HTMLElement } {
    const wizard = document.createElement('vizy-migration-wizard');
    wizard.setAttribute('active', '');
    wizard.setAttribute('initial-step', loadingStep === 2 ? '1' : '3');
    wizard.innerHTML = `
        <section data-vizy-start hidden>Landing</section>
        <div data-vizy-workflow>
            <ol>
                <li data-vizy-step="1">Choose fields</li>
                <li data-vizy-step="2">Preview</li>
                <li data-vizy-step="3">Confirm</li>
                <li data-vizy-step="4">Copy</li>
            </ol>
            <section data-vizy-step-panel="${loadingStep === 2 ? '1' : '3'}">
                <form action="/admin/actions/vizy/migration" method="post" data-vizy-loading-step="${loadingStep}"></form>
            </section>
            <div data-vizy-loading hidden>
                <pk-spinner></pk-spinner>
                <div data-vizy-loading-analyze hidden>Analysing</div>
                <div data-vizy-loading-copy hidden>Copying</div>
            </div>
            <div data-vizy-actions></div>
        </div>
    `;
    document.body.append(wizard);

    return {
        form: wizard.querySelector<HTMLFormElement>('form')!,
        wizard,
    };
}

describe('Inline migration wizard', () => {
    it.each([
        { loadingStep: 2 as const, visibleMessage: 'analyze' },
        { loadingStep: 4 as const, visibleMessage: 'copy' },
    ])('uses the default Plugin Kit spinner while loading step $loadingStep', ({ loadingStep, visibleMessage }) => {
        vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>(() => undefined)));
        const { form, wizard } = mountLoadingWizard(loadingStep);

        form.dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true }));

        const spinner = wizard.querySelector<HTMLElement & { size: string }>('pk-spinner')!;
        expect(wizard.querySelector<HTMLElement>('[data-vizy-loading]')!.hidden).toBe(false);
        expect(spinner.hasAttribute('size')).toBe(false);
        expect(spinner.size).toBe('sm');
        expect(wizard.querySelector<HTMLElement>(`[data-vizy-loading-${visibleMessage}]`)!.hidden).toBe(false);
    });

    it('moves from the landing state into the first step and back without a dialog', () => {
        const wizard = document.createElement('vizy-migration-wizard');
        wizard.setAttribute('initial-step', '1');
        wizard.innerHTML = `
                <section data-vizy-start>
                    <p>Copy converted Vizy content.</p>
                    <pk-button data-vizy-start-wizard>Start</pk-button>
                </section>
                <div data-vizy-workflow hidden>
                    <ol>
                        <li data-vizy-step="1">Choose fields</li>
                        <li data-vizy-step="2">Preview</li>
                        <li data-vizy-step="3">Confirm</li>
                        <li data-vizy-step="4">Copy</li>
                    </ol>
                    <section data-vizy-step-panel="1"><h2 data-vizy-step-heading tabindex="-1">Choose the fields</h2></section>
                    <section data-vizy-step-panel="2" hidden><h2 data-vizy-step-heading tabindex="-1">Preview</h2></section>
                    <section data-vizy-step-panel="3" hidden><h2 data-vizy-step-heading tabindex="-1">Confirm</h2></section>
                    <section data-vizy-step-panel="4" hidden><h2 data-vizy-step-heading tabindex="-1">Copy</h2></section>
                    <div data-vizy-loading hidden></div>
                    <div data-vizy-actions>
                        <pk-button data-vizy-footer-step="1" data-vizy-show-start>Cancel</pk-button>
                    </div>
                </div>
        `;
        document.body.append(wizard);

        const start = wizard.querySelector<HTMLElement>('[data-vizy-start]')!;
        const workflow = wizard.querySelector<HTMLElement>('[data-vizy-workflow]')!;

        expect(start.hidden).toBe(false);
        expect(workflow.hidden).toBe(true);
        expect(wizard.querySelector('pk-dialog')).toBeNull();

        wizard.querySelector<HTMLElement>('[data-vizy-start-wizard]')!.click();

        expect(start.hidden).toBe(true);
        expect(workflow.hidden).toBe(false);
        expect(wizard.hasAttribute('active')).toBe(true);
        expect(wizard.querySelector('[data-vizy-step="1"]')?.classList.contains('is-active')).toBe(true);
        expect(wizard.querySelector<HTMLElement>('[data-vizy-actions]')!.hidden).toBe(false);

        wizard.querySelector<HTMLElement>('[data-vizy-show-start]')!.click();

        expect(start.hidden).toBe(false);
        expect(workflow.hidden).toBe(true);
        expect(wizard.hasAttribute('active')).toBe(false);
    });

    it('shows a blocked Ajax result without an empty footer action bar', () => {
        const wizard = document.createElement('vizy-migration-wizard');
        wizard.setAttribute('initial-step', '2');
        wizard.setAttribute('active', '');
        wizard.innerHTML = `
                <section data-vizy-start>Landing</section>
                <div data-vizy-workflow hidden>
                    <ol><li data-vizy-step="1">Choose</li><li data-vizy-step="2">Preview</li></ol>
                    <section data-vizy-step-panel="1">Choose</section>
                    <section data-vizy-step-panel="2" hidden>
                        <pk-state-panel data-vizy-step-heading variant="error" tabindex="-1">
                            <p>Conflict checks — The destination field is not attached to this layout.</p>
                            <pk-button slot="actions" data-vizy-go-to="1">Choose different fields</pk-button>
                        </pk-state-panel>
                    </section>
                    <div data-vizy-loading hidden></div>
                    <div data-vizy-actions>
                        <pk-button data-vizy-footer-step="1">Preview copy</pk-button>
                    </div>
                </div>
        `;
        document.body.append(wizard);

        expect(wizard.querySelector<HTMLElement>('[data-vizy-start]')!.hidden).toBe(true);
        expect(wizard.querySelector<HTMLElement>('[data-vizy-workflow]')!.hidden).toBe(false);
        expect(wizard.querySelector<HTMLElement>('[data-vizy-step-panel="1"]')!.hidden).toBe(true);
        expect(wizard.querySelector<HTMLElement>('[data-vizy-step-panel="2"]')!.hidden).toBe(false);
        expect(wizard.querySelector<HTMLElement>('[data-vizy-actions]')!.hidden).toBe(true);
        expect(wizard.querySelector('[data-vizy-step-panel="2"] > h2')).toBeNull();
        expect(wizard.querySelector('[slot="details"]')).toBeNull();
        expect(wizard.querySelector('[data-vizy-step-panel="2"]')?.textContent).toContain('The destination field is not attached to this layout.');

        wizard.querySelector<HTMLElement>('[data-vizy-go-to="1"]')!.click();

        expect(wizard.querySelector<HTMLElement>('[data-vizy-step-panel="1"]')!.hidden).toBe(false);
        expect(wizard.querySelector<HTMLElement>('[data-vizy-actions]')!.hidden).toBe(false);
    });

    it('replaces only the wizard with the server-rendered next step', async () => {
        const responseHtml = `
            <!doctype html>
            <html><body>
                <main data-page-shell>Existing page shell</main>
                <vizy-migration-wizard initial-step="2">
                    <section data-vizy-step-panel="1">Choose fields</section>
                    <section data-vizy-step-panel="2">Server-rendered preview</section>
                </vizy-migration-wizard>
            </body></html>
        `;
        const fetchMock = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => new Response(responseHtml, {
            status: 200,
            headers: { 'Content-Type': 'text/html; charset=UTF-8' },
        }));
        vi.stubGlobal('fetch', fetchMock);

        const { wizard, form } = mountWizard();
        const replacement = await requestMigrationWizard(form);
        wizard.replaceWith(replacement);

        expect(fetchMock).toHaveBeenCalledOnce();
        expect(fetchMock.mock.calls[0]?.[0]).toBe('/admin/actions/vizy/rich-text-conversions/analyze-from-vizy');
        expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({
            method: 'post',
            credentials: 'same-origin',
        });
        expect(replacement.getAttribute('initial-step')).toBe('2');
        expect(replacement.textContent).toContain('Server-rendered preview');
        expect(document.querySelector('[data-page-shell]')?.textContent).toBe('Original page shell');
    });

    it('rejects an error response instead of replacing the current wizard', async () => {
        vi.stubGlobal('fetch', vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => new Response('Failed', {
            status: 500,
        })));
        const { wizard, form } = mountWizard();

        await expect(requestMigrationWizard(form)).rejects.toThrow('migrationRequestFailed:500');
        expect(document.querySelector('[data-current-wizard]')).toBe(wizard);
    });
});
