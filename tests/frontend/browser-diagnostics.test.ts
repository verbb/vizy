import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { installCapture, STORAGE_KEY, type CaptureConfig } from '../../src/web/assets/diagnostics/src/browser-capture';

const config: CaptureConfig = {
    owner: 'test-owner', now: 1800000000000, returnUrl: 'http://localhost/admin/vizy/diagnostics',
    labels: { active: 'Active', stopped: 'Stopped', empty: 'Empty', unavailable: 'Unavailable', return: 'Return', discard: 'Discard' },
};
let dispose: (() => void) | undefined;
let originalFetch: typeof fetch;
function state() { return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null'); }
function setup(details = false) {
    document.body.innerHTML = `<form data-vizy-browser-diagnostics><input name="includeContent" type="hidden" value="0"><input name="includeContent" type="checkbox" ${details ? 'checked' : ''}><input name="browserCapture"><p data-capture-status></p><button type="button" data-capture-start>Start</button><button type="button" data-capture-discard>Discard</button></form>`;
    dispose = installCapture(config);
    document.dispatchEvent(new Event('DOMContentLoaded'));
}
function start() { document.querySelector<HTMLButtonElement>('[data-capture-start]')!.click(); }
function preview() {
    document.querySelector('form')!.dispatchEvent(new Event('submit'));
    return document.querySelector<HTMLInputElement>('[name="browserCapture"]')!.value;
}
function emit(message = 'PRIVATE text https://example.test/file.js?token=secret#fragment') {
    window.dispatchEvent(new ErrorEvent('error', { message, error: new TypeError(message), filename: 'https://example.test/file.js?token=secret', lineno: 23, colno: 4 }));
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

describe('tab-local browser diagnostics', () => {
    it('does not instrument until started and restores APIs on discard', () => {
        setup();
        expect(window.fetch).toBe(originalFetch);
        start();
        expect(window.fetch).not.toBe(originalFetch);
        expect(document.querySelector('[data-vizy-capture-banner]')).not.toBeNull();
        const preview = document.createElement('section');
        preview.dataset.diagnosticsPreview = '';
        document.body.append(preview);
        document.querySelector<HTMLButtonElement>('[data-capture-discard]')!.click();
        expect(window.fetch).toBe(originalFetch);
        expect(state()).toBeNull();
        expect(document.querySelector('[data-vizy-capture-banner]')).toBeNull();
        expect(document.querySelector('[data-diagnostics-preview]')).toBeNull();
    });
    it('captures metadata without messages, URLs, or console objects by default', () => {
        setup(); start(); emit();
        console.warn('PRIVATE warning', { password: 'secret' });
        const json = preview();
        expect(json).toContain('TypeError');
        expect(json).toContain('console-warn');
        expect(json).not.toMatch(/PRIVATE|token=|password|file\.js/);
        expect(state().status).toBe('stopped');
        expect(window.fetch).toBe(originalFetch);
    });
    it('records consented details but strips URL queries and removes details before a content-free POST', () => {
        setup(true); start(); emit();
        expect(state().events.find((e: { kind: string }) => e.kind === 'error').message).toContain('PRIVATE');
        expect(JSON.stringify(state())).not.toContain('token=secret');
        document.querySelector<HTMLInputElement>('input[type="checkbox"][name="includeContent"]')!.checked = false;
        expect(preview()).not.toContain('PRIVATE');
        // Switching export consent does not fabricate details that were never recorded.
        expect(state().includeDetails).toBe(true);
    });
    it('expires recording and later discards its local results', () => {
        setup(); start();
        vi.advanceTimersByTime(15 * 60 * 1000);
        expect(state().status).toBe('stopped');
        expect(window.fetch).toBe(originalFetch);
        const count = state().events.length;
        emit(); expect(state().events).toHaveLength(count);
        vi.advanceTimersByTime(45 * 60 * 1000);
        expect(state()).toBeNull();
    });
    it('resumes on a different CP page and respects a stopped capture on BFCache restore', () => {
        setup(); start(); dispose?.();
        document.body.innerHTML = '<main>Entry editor</main>';
        dispose = installCapture(config);
        document.dispatchEvent(new Event('DOMContentLoaded'));
        emit();
        expect(state().events.some((e: { kind: string }) => e.kind === 'error')).toBe(true);
        const stopped = { ...state(), status: 'stopped' };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stopped));
        const restored = new Event('pageshow');
        Object.defineProperty(restored, 'persisted', { value: true });
        window.dispatchEvent(restored);
        expect(window.fetch).toBe(originalFetch);
        expect(document.querySelector('[data-vizy-capture-banner]')).toBeNull();
    });
    it('clears prior-login capture and does not record for non-admin pages', () => {
        setup(true); start(); emit(); dispose?.();
        document.body.innerHTML = '';
        dispose = installCapture({ ...config, owner: null });
        expect(state()).toBeNull();
        expect(window.fetch).toBe(originalFetch);
    });
    it('fails without instrumentation when session storage is unavailable', () => {
        setup();
        vi.stubGlobal('sessionStorage', { getItem: () => null, removeItem: () => {}, setItem: () => { throw new Error('Blocked'); } });
        start();
        expect(window.fetch).toBe(originalFetch);
        expect(document.querySelector('[data-capture-status]')?.textContent).toBe('Unavailable');
    });
    it('preserves fetch responses and rejections without reading bodies', async () => {
        const response = new Response('PRIVATE BODY', { status: 500 });
        const reason = new Error('PRIVATE network failure');
        const fetch = vi.fn().mockResolvedValueOnce(response).mockRejectedValueOnce(reason);
        window.fetch = fetch;
        setup(); start();
        expect(await window.fetch('/private?token=secret')).toBe(response);
        await expect(window.fetch('/private')).rejects.toBe(reason);
        const json = preview();
        expect(JSON.parse(json).events.filter((e: { kind: string }) => e.kind === 'request-failure')).toHaveLength(2);
        expect(json).not.toMatch(/PRIVATE|token=|private/);
        expect(window.fetch).toBe(fetch);
    });
    it('does not attribute an old pending request to a newly started capture', async () => {
        let resolve!: (response: Response) => void;
        window.fetch = vi.fn(() => new Promise<Response>((done) => { resolve = done; }));
        setup(); start();
        const pending = window.fetch('/slow');
        start();
        resolve(new Response('', { status: 500 }));
        await pending;
        expect(state().events.filter((e: { kind: string }) => e.kind === 'request-failure')).toHaveLength(0);
    });
    it('caps stored events and stops collecting after preview', () => {
        setup(true); start();
        for (let i = 0; i < 150; i++) emit('x'.repeat(10000));
        expect(state().events).toHaveLength(100);
        expect(state().dropped).toBe(51);
        expect(sessionStorage.getItem(STORAGE_KEY)!.length).toBeLessThan(524288);
        preview(); emit();
        expect(state().dropped).toBe(51);
    });
    it('bounds UTF-8 uploads and handles hostile console objects without breaking the console', () => {
        setup(true); start();
        const proxy = Proxy.revocable({}, {});
        proxy.revoke();
        expect(() => console.error(proxy.proxy)).not.toThrow();
        for (let i = 0; i < 100; i++) emit('診'.repeat(5000));
        expect(new TextEncoder().encode(preview()).length).toBeLessThan(524288);
        expect(state().dropped).toBeGreaterThan(0);
    });
});
