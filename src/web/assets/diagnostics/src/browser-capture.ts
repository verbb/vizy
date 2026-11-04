export const STORAGE_KEY = 'vizy:browser-diagnostics';
const RECORDING_MS = 15 * 60 * 1000;
const RETENTION_MS = 60 * 60 * 1000;
const MAX_EVENTS = 100;

type CaptureEvent = {
    kind: string;
    elapsedMs: number;
    errorType?: string;
    asset?: string;
    line?: number;
    column?: number;
    resource?: string;
    transport?: string;
    status?: number;
    message?: string;
    stack?: string;
};

type Capture = {
    owner: string;
    startedAt: number;
    status: 'recording' | 'stopped';
    includeDetails: boolean;
    returnUrl: string;
    selectedField: string;
    events: CaptureEvent[];
    dropped: number;
    environment: { browser: string; majorVersion: number; width: number; height: number };
};

export type CaptureConfig = {
    owner: string | null;
    now: number;
    returnUrl: string;
    labels: Record<'active' | 'stopped' | 'empty' | 'unavailable' | 'return' | 'discard', string>;
};

const errorNames = new Set(['Error', 'TypeError', 'RangeError', 'ReferenceError', 'SyntaxError', 'URIError', 'EvalError', 'AggregateError']);

function browserEnvironment(): Capture['environment'] {
    const ua = navigator.userAgent;
    for (const [browser, pattern] of [['edge', /Edg\/(\d+)/], ['firefox', /Firefox\/(\d+)/], ['chrome', /(?:Chrome|CriOS)\/(\d+)/], ['safari', /Version\/(\d+).*Safari/]] as const) {
        const match = ua.match(pattern);
        if (match) return { browser, majorVersion: Number(match[1]), width: innerWidth, height: innerHeight };
    }
    return { browser: 'other', majorVersion: 0, width: innerWidth, height: innerHeight };
}

// Error messages may contain authored content. Even with consent, strip URL
// query strings/fragments; never serialize arbitrary console objects or bodies.
export function detailText(value: string, limit: number): string {
    return value.slice(0, limit).replace(/https?:\/\/[^\s)"'<>]+/g, (value) => {
        try {
            const url = new URL(value);
            return `${url.origin}${url.pathname}`;
        } catch {
            return '[URL]';
        }
    });
}

export function installCapture(config: CaptureConfig): () => void {
    if (window.top !== window || document.documentElement.hasAttribute('data-vizy-capture-installed')) return () => {};
    document.documentElement.setAttribute('data-vizy-capture-installed', '');
    // Use server-relative time so a client's clock does not invalidate the report.
    const offset = config.now - Date.now();
    const now = () => Math.round(Date.now() + offset);
    let capture: Capture | null = null;
    let unavailable = false;
    let cleanup: (() => void) | null = null;
    let banner: HTMLElement | null = null;
    let retentionTimer: ReturnType<typeof setTimeout> | undefined;

    function read(): void {
        try {
            const value = sessionStorage.getItem(STORAGE_KEY);
            const parsed: Capture | null = value && value.length < 524288 ? JSON.parse(value) : null;
            if (config.owner && parsed?.owner === config.owner && Number.isInteger(parsed.startedAt)
                && parsed.startedAt <= now() + 60000 && parsed.startedAt > now() - RETENTION_MS
                && Array.isArray(parsed.events) && parsed.events.length <= MAX_EVENTS
                && ['recording', 'stopped'].includes(parsed.status)) {
                capture = parsed;
            } else {
                sessionStorage.removeItem(STORAGE_KEY);
            }
        } catch {
            unavailable = true;
        }
    }

    function persist(): boolean {
        try {
            if (capture) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(capture));
            else sessionStorage.removeItem(STORAGE_KEY);
            return true;
        } catch {
            unavailable = true;
            return false;
        }
    }

    function render(): void {
        const root = document.querySelector<HTMLElement>('[data-vizy-browser-diagnostics]');
        const status = root?.querySelector<HTMLElement>('[data-capture-status]');
        if (status) {
            status.textContent = unavailable ? config.labels.unavailable : capture?.status === 'recording'
                ? config.labels.active : capture ? `${config.labels.stopped} (${capture.events.length})` : config.labels.empty;
        }
        const discard = root?.querySelector<HTMLButtonElement>('[data-capture-discard]');
        if (discard) {
            discard.hidden = !capture;
            discard.classList.toggle('hidden', !capture);
        }
        const preview = root?.querySelector<HTMLButtonElement>('[data-capture-preview]');
        if (preview) preview.disabled = !root?.querySelector('[name="field"]') && !capture;
        banner?.remove();
        banner = null;
        if (capture?.status !== 'recording' || !document.body) return;
        banner = document.createElement('aside');
        banner.setAttribute('aria-label', config.labels.active);
        banner.dataset.vizyCaptureBanner = '';
        // This transient control exists only in the tab that opted into recording.
        Object.assign(banner.style, { position: 'fixed', bottom: '16px', right: '16px', zIndex: '10000',
            padding: '12px', background: 'var(--gray-050, #fff)', color: 'var(--gray-900, #172b4d)',
            border: '1px solid var(--gray-300, #cdd8e4)', borderRadius: '5px', boxShadow: '0 2px 8px #0002', maxWidth: 'calc(100vw - 56px)' });
        const text = document.createElement('p');
        text.textContent = config.labels.active;
        const back = document.createElement('button');
        back.type = 'button';
        back.className = 'btn';
        back.textContent = config.labels.return;
        back.addEventListener('click', () => {
            const destination = capture?.returnUrl || config.returnUrl;
            stop();
            // Stored data must not turn the return control into an external redirect.
            const url = new URL(destination, location.href);
            location.assign(url.origin === location.origin ? url.href : config.returnUrl);
        });
        const discardButton = document.createElement('button');
        discardButton.type = 'button';
        discardButton.className = 'btn';
        discardButton.textContent = config.labels.discard;
        discardButton.addEventListener('click', discardCapture);
        banner.append(text, back, discardButton);
        document.body.append(banner);
    }

    function stop(): void {
        cleanup?.();
        cleanup = null;
        if (capture) capture.status = 'stopped';
        persist();
        render();
    }

    function discardCapture(): void {
        cleanup?.();
        cleanup = null;
        clearTimeout(retentionTimer);
        capture = null;
        document.querySelector('[data-diagnostics-preview]')?.remove();
        persist();
        render();
    }

    function record(event: Omit<CaptureEvent, 'elapsedMs'>): void {
        // Diagnostics must never change application behavior, even when storage is
        // disabled, a console argument is hostile, or another plugin patches APIs.
        try {
            if (!capture || capture.status !== 'recording') return;
            if (now() >= capture.startedAt + RECORDING_MS) { stop(); return; }
            if (capture.events.length < MAX_EVENTS) {
                capture.events.push({ ...event, elapsedMs: Math.max(0, now() - capture.startedAt) });
                // Bound UTF-8 bytes as well as event count: multilingual messages
                // can otherwise exceed the server's upload limit despite truncation.
                if (new TextEncoder().encode(JSON.stringify(capture)).length > 480000) {
                    capture.events.pop();
                    capture.dropped = Math.min(1000000, capture.dropped + 1);
                }
            } else {
                capture.dropped = Math.min(1000000, capture.dropped + 1);
            }
            if (!persist()) stop();
        } catch { /* Observing a failure must not cause another failure. */ }
    }

    function describe(value: unknown): Pick<CaptureEvent, 'errorType' | 'message' | 'stack'> {
        try {
            const error = value instanceof Error ? value : null;
            const result: Pick<CaptureEvent, 'errorType' | 'message' | 'stack'> = {
                errorType: error && errorNames.has(error.name) ? error.name : 'Other',
            };
            if (capture?.includeDetails) {
                if (typeof value === 'string') result.message = detailText(value, 1000);
                else if (error) result.message = detailText(error.message, 1000);
                if (error?.stack) result.stack = detailText(error.stack, 3000);
            }
            return result;
        } catch { return { errorType: 'Other' }; }
    }

    function asset(value: string): string {
        if (!value) return 'inline';
        try {
            const url = new URL(value, location.href);
            if (url.origin !== location.origin) return 'external';
            if (/\/cpresources\//.test(url.pathname)) return /vizy|capture\.js/.test(url.pathname) ? 'vizy' : 'craft';
        } catch { return 'other'; }
        return 'other';
    }

    function observe(): void {
        if (cleanup || !capture || capture.status !== 'recording') return;
        if (capture.startedAt + RECORDING_MS <= now()) { stop(); return; }
        const generation = capture;
        const add = (event: Omit<CaptureEvent, 'elapsedMs'>) => { if (capture === generation) record(event); };
        const error = (event: Event) => {
            if (event instanceof ErrorEvent) {
                add({ kind: 'error', ...describe(event.error ?? event.message), asset: asset(event.filename), line: event.lineno, column: event.colno });
            } else if (event.target instanceof HTMLElement) {
                add({ kind: 'resource-error', resource: ['SCRIPT', 'LINK', 'IMG'].includes(event.target.tagName) ? event.target.tagName : 'OTHER' });
            }
        };
        const rejection = (event: PromiseRejectionEvent) => add({ kind: 'rejection', ...describe(event.reason) });
        window.addEventListener('error', error, true);
        window.addEventListener('unhandledrejection', rejection);
        const originalFetch = window.fetch;
        const fetchWrapper: typeof fetch = function(this: typeof window, ...args) {
            return originalFetch.apply(this, args).then((response) => {
                if (response.status >= 400) add({ kind: 'request-failure', transport: 'fetch', status: response.status });
                return response;
            }, (reason: unknown) => {
                add({ kind: 'request-failure', transport: 'fetch', status: 0 });
                throw reason;
            });
        };
        window.fetch = fetchWrapper;
        const originalSend = XMLHttpRequest.prototype.send;
        const pending = new Map<XMLHttpRequest, () => void>();
        const sendWrapper: typeof originalSend = function(this: XMLHttpRequest, body) {
            const xhr = this;
            const done = () => {
                pending.delete(xhr);
                if (xhr.status === 0 || xhr.status >= 400) add({ kind: 'request-failure', transport: 'xhr', status: xhr.status });
            };
            pending.set(xhr, done);
            xhr.addEventListener('loadend', done, { once: true });
            try { return originalSend.call(xhr, body); }
            catch (error) { xhr.removeEventListener('loadend', done); pending.delete(xhr); throw error; }
        };
        XMLHttpRequest.prototype.send = sendWrapper;
        const consoleRestores = (['error', 'warn'] as const).map((level) => {
            const original = console[level];
            const wrapper = (...args: unknown[]) => {
                try {
                    add({ kind: `console-${level}`, ...describe(args.find((arg) => typeof arg === 'string' || arg instanceof Error)) });
                } catch { /* Revoked proxies and custom error objects may throw. */ }
                original.apply(console, args);
            };
            console[level] = wrapper;
            return () => { if (console[level] === wrapper) console[level] = original; };
        });
        const timer = setTimeout(stop, Math.max(0, capture.startedAt + RECORDING_MS - now()));
        cleanup = () => {
            clearTimeout(timer);
            window.removeEventListener('error', error, true);
            window.removeEventListener('unhandledrejection', rejection);
            if (window.fetch === fetchWrapper) window.fetch = originalFetch;
            if (XMLHttpRequest.prototype.send === sendWrapper) XMLHttpRequest.prototype.send = originalSend;
            for (const [xhr, listener] of pending) xhr.removeEventListener('loadend', listener);
            pending.clear();
            consoleRestores.forEach((restore) => restore());
        };
        add({ kind: 'page' });
    }

    function retain(): void {
        clearTimeout(retentionTimer);
        if (capture) retentionTimer = setTimeout(discardCapture, Math.max(0, capture.startedAt + RETENTION_MS - now()));
    }

    function ready(): void {
        const root = document.querySelector<HTMLElement>('[data-vizy-browser-diagnostics]');
        if (root) {
            // Returning to diagnostics finishes capture before the preview is made.
            if (capture?.status === 'recording') stop();
            const field = root.querySelector<HTMLSelectElement>('[name="field"]');
            if (field && capture?.selectedField && Array.from(field.options).some((o) => o.value === capture?.selectedField)) field.value = capture.selectedField;
            root.querySelector('[data-capture-start]')?.addEventListener('click', () => {
                if (!config.owner) return;
                stop();
                document.querySelector('[data-diagnostics-preview]')?.remove();
                capture = {
                    owner: config.owner, startedAt: now(), status: 'recording',
                    includeDetails: root.querySelector<HTMLInputElement>('input[type="checkbox"][name="includeContent"]')?.checked ?? false,
                    returnUrl: root.dataset.returnUrl || config.returnUrl,
                    selectedField: field?.value || '', events: [], dropped: 0,
                    environment: browserEnvironment(),
                };
                unavailable = false;
                if (!persist()) { capture = null; render(); return; }
                observe();
                retain();
                render();
                const destination = root.dataset.entryUrl;
                if (destination) location.assign(destination);
            });
            root.querySelector('[data-capture-discard]')?.addEventListener('click', discardCapture);
            root.addEventListener('submit', () => {
                stop();
                const input = root.querySelector<HTMLInputElement>('[name="browserCapture"]');
                if (!input) return;
                const details = root.querySelector<HTMLInputElement>('input[type="checkbox"][name="includeContent"]')?.checked ?? false;
                // Remove messages locally before POST, as well as at the server boundary.
                input.value = capture ? JSON.stringify({ ...capture, events: capture.events.map(({ message, stack, ...event }) => details ? { ...event, message, stack } : event) }) : '';
            });
        }
        render();
    }

    read();
    if (!config.owner) return () => { document.documentElement.removeAttribute('data-vizy-capture-installed'); };
    observe();
    retain();
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, { once: true });
    else ready();
    // BFCache restores preserve JS state: recheck the expiry before observing again.
    const suspend = () => { cleanup?.(); cleanup = null; clearTimeout(retentionTimer); };
    const resume = (event: PageTransitionEvent) => {
        if (!event.persisted) return;
        suspend();
        capture = null;
        read();
        if (document.querySelector('[data-vizy-browser-diagnostics]') && capture) stop();
        else observe();
        retain();
        render();
    };
    window.addEventListener('pageshow', resume);
    window.addEventListener('pagehide', suspend);
    return () => {
        cleanup?.();
        clearTimeout(retentionTimer);
        banner?.remove();
        document.removeEventListener('DOMContentLoaded', ready);
        window.removeEventListener('pageshow', resume);
        window.removeEventListener('pagehide', suspend);
        document.documentElement.removeAttribute('data-vizy-capture-installed');
    };
}
