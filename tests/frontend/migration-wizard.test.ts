import { afterEach, describe, expect, it, vi } from 'vitest';

import { requestMigrationWizard } from '../../src/web/assets/migrations/src/ts/migration-request';

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

describe('From Vizy migration wizard', () => {
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
