import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { detailText, installCapture, STORAGE_KEY, type CaptureConfig } from '../../src/web/assets/diagnostics/src/browser-capture';
import { readElement, saveOpenEditors, trailFor } from '../../src/web/assets/diagnostics/src/page-context';

const labels = {
    title: 'Checking', goToPage: 'Go', makeItHappen: 'Make it happen', caught: 'Noticed {count}', saving: 'Saving',
    saveFailed: 'Save failed', ready: 'Ready', done: 'Done', cancel: 'Cancel', review: 'Review',
    copied: 'Copied', copyFailed: 'Copy failed', failed: 'Failed',
};
const config: CaptureConfig = { owner: 'test-owner', now: 1800000000000, supportUrl: 'http://localhost/admin/utilities/vizy-support', labels };
const UID_A = '11111111-1111-4111-8111-111111111111';
const UID_B = '22222222-2222-4222-8222-222222222222';
const UID_C = '33333333-3333-4333-8333-333333333333';
const SUPPORT_PAGE = `<div data-vizy-support data-review-action="/review">
    <form data-support-form></form>
    <section data-screen="unavailable"></section>
    <section data-screen="start"><button type="button" data-support-start>Start</button></section>
    <section data-screen="watching"></section>
    <section data-screen="loading"></section>
    <section data-screen="error"><p data-support-error></p></section>
    <section data-screen="review" data-support-review></section>
</div>`;
const REVIEW = `<input type="checkbox" data-support-include checked><button type="button" data-support-copy>Copy</button><button type="button" data-support-download>Download</button><button type="button" data-support-restart>Again</button><p data-support-share-status></p><pre hidden data-support-report>{"exact":"report"}</pre>`;

let dispose: (() => void) | undefined;
let originalFetch: typeof fetch;

function state() { return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null'); }
function setup(html = SUPPORT_PAGE, overrides: Partial<CaptureConfig> = {}) {
    document.body.innerHTML = html;
    dispose = installCapture({ ...config, ...overrides });
}
function screen() { return document.querySelector<HTMLElement>('[data-screen]:not([hidden])')?.dataset.screen; }
function click(selector: string) { document.querySelector<HTMLElement>(selector)!.click(); }
function start() { click('[data-support-start]'); }
function emit(message = 'PRIVATE text https://example.test/file.js?token=secret#fragment') {
    window.dispatchEvent(new ErrorEvent('error', { message, error: new TypeError(message), filename: 'https://example.test/file.js?token=secret', lineno: 23, colno: 4 }));
}
function stubElementEditor(settings: Record<string, unknown>, checkForm = vi.fn(() => Promise.resolve())) {
    vi.stubGlobal('$', () => ({ data: () => ({ settings, checkForm }) }));
    return checkForm;
}

beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(config.now);
    sessionStorage.clear();
    originalFetch = window.fetch;
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
    dispose?.();
    dispose = undefined;
    document.body.innerHTML = '';
    window.fetch = originalFetch;
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
});

describe('capture', () => {
    it('does not instrument until started and restores APIs on cancel', () => {
        setup();
        expect(screen()).toBe('start');
        expect(window.fetch).toBe(originalFetch);
        start();
        expect(screen()).toBe('watching');
        expect(window.fetch).not.toBe(originalFetch);
        expect(document.querySelector('[data-vizy-capture-banner]')).not.toBeNull();
        click('[data-banner-cancel]');
        expect(window.fetch).toBe(originalFetch);
        expect(state()).toBeNull();
        expect(document.querySelector('[data-vizy-capture-banner]')).toBeNull();
        expect(screen()).toBe('start');
    });
    it('holds messages in the tab with URL queries stripped, and never records console objects', () => {
        setup(); start(); emit();
        console.warn('PRIVATE warning', { password: 'secret' });
        const stored = JSON.stringify(state());
        expect(state().events.find((e: { kind: string }) => e.kind === 'error').message).toContain('PRIVATE');
        expect(stored).not.toMatch(/token=|password/);
    });
    it('shows how many problems it has noticed, ignoring warnings', () => {
        setup(); start();
        console.warn('A warning');
        expect(document.querySelector('[data-banner-message]')?.textContent).toBe('Go');
        emit();
        expect(document.querySelector('[data-banner-message]')?.textContent).toBe('Noticed 1');
    });
    it('stops itself, offers the review and later discards its results', () => {
        setup('<main>Entry editor</main>');
        dispose?.();
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ owner: 'test-owner', startedAt: config.now, status: 'recording', reviewed: false, context: null, events: [], dropped: 0, environment: {} }));
        setup('<main>Entry editor</main>');
        vi.advanceTimersByTime(15 * 60 * 1000);
        expect(state().status).toBe('stopped');
        expect(window.fetch).toBe(originalFetch);
        expect(document.querySelector('[data-banner-done]')?.textContent).toBe('Review');
        const count = state().events.length;
        emit(); expect(state().events).toHaveLength(count);
        vi.advanceTimersByTime(45 * 60 * 1000);
        expect(state()).toBeNull();
    });
    it('resumes on another CP page and respects a stopped capture on BFCache restore', () => {
        setup(); start(); dispose?.();
        setup('<main>Entry editor</main>');
        emit();
        expect(state().events.some((e: { kind: string }) => e.kind === 'error')).toBe(true);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state(), status: 'stopped', reviewed: true }));
        const restored = new Event('pageshow');
        Object.defineProperty(restored, 'persisted', { value: true });
        window.dispatchEvent(restored);
        expect(window.fetch).toBe(originalFetch);
        expect(document.querySelector('[data-vizy-capture-banner]')).toBeNull();
    });
    it('clears a capture from another login and does not record without permission', () => {
        setup(); start(); emit(); dispose?.();
        dispose = installCapture({ ...config, owner: null });
        expect(state()).toBeNull();
        expect(window.fetch).toBe(originalFetch);
    });
    it('fails without instrumentation when session storage is unavailable', () => {
        setup();
        vi.stubGlobal('sessionStorage', { getItem: () => null, removeItem: () => {}, setItem: () => { throw new Error('Blocked'); } });
        start();
        expect(window.fetch).toBe(originalFetch);
        expect(screen()).toBe('unavailable');
    });
    it('preserves fetch responses and rejections, recording only the failure and its source', async () => {
        const response = new Response('PRIVATE BODY', { status: 500 });
        const reason = new Error('PRIVATE network failure');
        const fetch = vi.fn().mockResolvedValueOnce(response).mockRejectedValueOnce(reason);
        window.fetch = fetch;
        setup(); start();
        expect(await window.fetch('/index.php?p=admin/actions/vizy/editor&token=secret')).toBe(response);
        await expect(window.fetch('/private')).rejects.toBe(reason);
        const failures = state().events.filter((e: { kind: string }) => e.kind === 'request-failure');
        expect(failures.map((e: { source: string }) => e.source)).toEqual(['vizy', 'other']);
        expect(JSON.stringify(state())).not.toMatch(/PRIVATE|token=|private/);
    });
    it('does not attribute an old pending request to a newly started capture', async () => {
        let resolve!: (response: Response) => void;
        window.fetch = vi.fn(() => new Promise<Response>((done) => { resolve = done; }));
        setup(); start();
        const pending = window.fetch('/slow');
        click('[data-banner-cancel]');
        start();
        resolve(new Response('', { status: 500 }));
        await pending;
        expect(state().events.filter((e: { kind: string }) => e.kind === 'request-failure')).toHaveLength(0);
    });
    it('does not count requests the page cancelled as failures', async () => {
        window.fetch = vi.fn(() => Promise.reject(new DOMException('Cancelled', 'AbortError')));
        setup(); start();
        await expect(window.fetch('/cancelled')).rejects.toBeInstanceOf(DOMException);
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/cancelled');
        xhr.send();
        xhr.abort();
        expect(state().events.filter((e: { kind: string }) => e.kind === 'request-failure')).toHaveLength(0);
    });
    it('strips query strings from absolute and relative URLs in messages', () => {
        expect(detailText('Failed https://a.test/x.js?token=1#f', 200)).toBe('Failed https://a.test/x.js');
        expect(detailText('Failed /admin/page?token=secret here', 200)).toBe('Failed /admin/page here');
        expect(detailText('Failed index.php?p=admin&token=secret', 200)).toBe('Failed index.php');
        expect(detailText('Is this fine? Yes', 200)).toBe('Is this fine? Yes');
    });
    it('caps stored events', () => {
        setup(); start();
        for (let i = 0; i < 150; i++) emit('x'.repeat(10000));
        expect(state().events).toHaveLength(100);
        expect(state().dropped).toBe(51);
        expect(sessionStorage.getItem(STORAGE_KEY)!.length).toBeLessThan(524288);
    });
    it('bounds UTF-8 storage and handles hostile console objects without breaking the console', () => {
        setup(); start();
        const proxy = Proxy.revocable({}, {});
        proxy.revoke();
        expect(() => console.error(proxy.proxy)).not.toThrow();
        for (let i = 0; i < 100; i++) emit('診'.repeat(5000));
        expect(new TextEncoder().encode(sessionStorage.getItem(STORAGE_KEY)!).length).toBeLessThan(524288);
        expect(state().dropped).toBeGreaterThan(0);
    });
});

describe('page context', () => {
    const editorPage = `<form id="main-form" data-element-editor>
        <div class="field" data-layout-element="${UID_A}"><vizy-editor id="outer"><vizy-block data-block-uid="${UID_B}">
            <div class="field" data-vizy-field-layout-element-uid="${UID_C}"><div class="matrixblock" data-id="35"><div class="field" data-layout-element="${UID_A}"><vizy-editor id="inner"><div id="prose" tabindex="0"></div></vizy-editor></div></div></div>
        </vizy-block></vizy-editor></div>
    </form>`;

    it('reads the current element, including a draft created by an autosave', () => {
        stubElementEditor({ elementId: 165, canonicalId: 156, siteId: 2, draftId: 1 });
        document.body.innerHTML = editorPage;
        expect(readElement(document.querySelector('#main-form'))).toEqual({ id: 165, canonicalId: 156, siteId: 2 });
        expect(readElement(null)).toBeNull();
    });
    it('describes the path from the form to the focused editor', () => {
        document.body.innerHTML = editorPage;
        expect(trailFor(document.querySelector('#outer')!)).toBe(`field:${UID_A}`);
        expect(trailFor(document.querySelector('#inner')!)).toBe(`field:${UID_A}/block:${UID_B}/field:${UID_C}/row:35/field:${UID_A}`);
    });
    it('remembers the focused field, without reading its text', async () => {
        stubElementEditor({ elementId: 4, canonicalId: 4, siteId: 1 });
        setup(`${editorPage}${SUPPORT_PAGE}`); start();
        document.querySelector<HTMLElement>('#prose')!.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
        expect(state().context).toEqual({ id: 4, canonicalId: 4, siteId: 1, trail: `field:${UID_A}/block:${UID_B}/field:${UID_C}/row:35/field:${UID_A}` });
        expect(JSON.stringify(state())).not.toContain('prose');
    });
    it('saves pending edits, and reports a failed or stuck save', async () => {
        document.body.innerHTML = editorPage;
        const checkForm = stubElementEditor({});
        await expect(saveOpenEditors()).resolves.toBe(true);
        expect(checkForm).toHaveBeenCalledWith(false, true);
        stubElementEditor({}, vi.fn(() => Promise.reject(new Error('500'))));
        await expect(saveOpenEditors()).resolves.toBe(false);
        stubElementEditor({}, vi.fn(() => new Promise<void>(() => {})));
        const stuck = saveOpenEditors(1000);
        await vi.advanceTimersByTimeAsync(1000);
        await expect(stuck).resolves.toBe(false);
    });
});

describe('Done', () => {
    function leavePage() {
        const assign = vi.fn();
        vi.stubGlobal('location', { ...window.location, href: 'http://localhost/admin/entries/1', assign });
        return assign;
    }
    function editorPage() {
        const running = JSON.stringify({ owner: 'test-owner', startedAt: config.now, status: 'recording', reviewed: false, context: null, events: [], dropped: 0, environment: {} });
        sessionStorage.setItem(STORAGE_KEY, running);
        setup('<form id="main-form" data-element-editor></form>');
    }

    it('saves first, reads any new draft, then goes to the review', async () => {
        const assign = leavePage();
        const settings = { elementId: 4, canonicalId: 4, siteId: 1 };
        const checkForm = stubElementEditor(settings, vi.fn(() => { settings.elementId = 165; return Promise.resolve(); }));
        editorPage();
        click('[data-banner-done]');
        expect(document.querySelector('[data-banner-message]')?.textContent).toBe('Saving');
        await vi.advanceTimersByTimeAsync(0);
        expect(checkForm).toHaveBeenCalled();
        expect(state().status).toBe('stopped');
        expect(state().context.id).toBe(165);
        expect(assign).toHaveBeenCalledWith(config.supportUrl);
    });
    it('stays on the page when cancelled during the save', async () => {
        const assign = leavePage();
        let finishSave!: () => void;
        stubElementEditor({ elementId: 4, canonicalId: 4, siteId: 1 }, vi.fn(() => new Promise<void>((resolve) => { finishSave = resolve; })));
        editorPage();
        click('[data-banner-done]');
        click('[data-banner-cancel]');
        finishSave();
        await vi.advanceTimersByTimeAsync(0);
        expect(assign).not.toHaveBeenCalled();
        expect(state()).toBeNull();
    });
    it('says when the save failed, and continues on the second press', async () => {
        const assign = leavePage();
        stubElementEditor({ elementId: 4, canonicalId: 4, siteId: 1 }, vi.fn(() => Promise.reject(new Error('500'))));
        editorPage();
        click('[data-banner-done]');
        await vi.advanceTimersByTimeAsync(0);
        expect(assign).not.toHaveBeenCalled();
        expect(state().status).toBe('recording');
        expect(document.querySelector('[data-banner-message]')?.textContent).toBe('Save failed');
        click('[data-banner-done]');
        await vi.advanceTimersByTimeAsync(0);
        expect(assign).toHaveBeenCalledWith(config.supportUrl);
    });
});

describe('review', () => {
    function stubReview(result: Record<string, unknown> = { html: REVIEW, headline: 'Found one', filename: 'report.json' }, ok = true) {
        const fetch = vi.fn(async () => new Response(JSON.stringify(result), { status: ok ? 200 : 400 }));
        vi.stubGlobal('fetch', fetch);
        return fetch;
    }
    function finished(events: Record<string, unknown>[] = []) {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ owner: 'test-owner', startedAt: config.now, status: 'stopped', reviewed: false, context: null, events, dropped: 0, environment: {} }));
    }
    function posted(fetch: ReturnType<typeof vi.fn>, call = 0) { return fetch.mock.calls[call][1].body as FormData; }

    it('builds the review from a finished check with content included by default', async () => {
        const fetch = stubReview();
        finished([{ kind: 'error', elapsedMs: 1, message: 'PRIVATE' }]);
        setup();
        await vi.advanceTimersByTimeAsync(0);
        expect(screen()).toBe('review');
        expect(posted(fetch).get('includeContent')).toBe('1');
        expect(posted(fetch).get('browserCapture')).toContain('PRIVATE');
        expect(state().reviewed).toBe(true);
    });
    it('removes error messages locally when content is unticked', async () => {
        const fetch = stubReview();
        finished([{ kind: 'error', elapsedMs: 1, message: 'PRIVATE', stack: 'PRIVATE-STACK' }]);
        setup();
        await vi.advanceTimersByTimeAsync(0);
        const box = document.querySelector<HTMLInputElement>('[data-support-include]')!;
        box.checked = false;
        box.dispatchEvent(new Event('change', { bubbles: true }));
        await vi.advanceTimersByTimeAsync(0);
        expect(posted(fetch, 1).get('includeContent')).toBe('0');
        expect(posted(fetch, 1).get('browserCapture')).not.toContain('PRIVATE');
    });
    it('copies and saves exactly the report on the page', async () => {
        stubReview();
        const writeText = vi.fn(async (_text: string) => {});
        vi.stubGlobal('navigator', { ...navigator, userAgent: navigator.userAgent, clipboard: { writeText } });
        const createObjectURL = vi.fn((_blob: Blob) => 'blob:report');
        vi.stubGlobal('URL', Object.assign(URL, { createObjectURL, revokeObjectURL: vi.fn() }));
        finished();
        setup();
        await vi.advanceTimersByTimeAsync(0);
        click('[data-support-copy]');
        await vi.advanceTimersByTimeAsync(0);
        expect(writeText.mock.calls[0][0]).toBe('Vizy support report: Found one\n\n```json\n{"exact":"report"}\n```');
        expect(document.querySelector('[data-support-share-status]')?.textContent).toBe('Copied');
        click('[data-support-download]');
        expect(await createObjectURL.mock.calls[0][0].text()).toBe('{"exact":"report"}');
    });
    it('says so when the browser refuses to copy', async () => {
        stubReview();
        vi.stubGlobal('navigator', { ...navigator, userAgent: navigator.userAgent, clipboard: { writeText: vi.fn(() => Promise.reject(new Error('Denied'))) } });
        finished();
        setup();
        await vi.advanceTimersByTimeAsync(0);
        click('[data-support-copy]');
        await vi.advanceTimersByTimeAsync(0);
        expect(document.querySelector('[data-support-share-status]')?.textContent).toBe('Copy failed');
    });
    it('shows the server’s message when a report can’t be built', async () => {
        stubReview({ message: 'Could not build' }, false);
        finished();
        setup();
        await vi.advanceTimersByTimeAsync(0);
        expect(screen()).toBe('error');
        expect(document.querySelector('[data-support-error]')?.textContent).toBe('Could not build');
    });
    it('clears the report when starting again', async () => {
        stubReview();
        finished();
        setup();
        await vi.advanceTimersByTimeAsync(0);
        click('[data-support-restart]');
        expect(state()).toBeNull();
        expect(screen()).toBe('start');
    });
});
