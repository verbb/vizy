import { formFor, readElement, saveOpenEditors, trailFor } from './page-context';
import { mountSupportPage } from './support-page';

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
    source?: string;
    status?: number;
    elementId?: number;
    message?: string;
    stack?: string;
};

type Capture = {
    owner: string;
    startedAt: number;
    status: 'recording' | 'stopped';
    reviewed: boolean;
    context: { id: number; canonicalId: number; siteId: number; trail: string | null } | null;
    events: CaptureEvent[];
    dropped: number;
    environment: { browser: string; majorVersion: number; width: number; height: number };
};

export type CaptureController = {
    status: () => Capture['status'] | 'idle' | 'unavailable';
    start: () => void;
    discard: () => void;
    payload: (includeDetails: boolean) => string;
    onChange: (listener: () => void) => void;
};

export type CaptureConfig = {
    owner: string | null;
    now: number;
    supportUrl: string;
    labels: Record<'title' | 'goToPage' | 'makeItHappen' | 'caught' | 'saving' | 'saveFailed' | 'ready' | 'done' | 'cancel' | 'review' | 'copied' | 'copyFailed' | 'failed', string>;
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
    // Root-relative and bare paths, such as /admin/page?token=value or index.php?p=x.
    }).replace(/([^\s)"'<>?#]*)[?#][^\s)"'<>]*=[^\s)"'<>]*/g, '$1');
}

// Records only which system a failed request belonged to, never its URL.
function requestSource(url: string): 'vizy' | 'craft' | 'other' {
    try {
        const { pathname, searchParams } = new URL(url, location.href);
        const path = `${pathname} ${searchParams.get('p') ?? ''} ${searchParams.get('action') ?? ''}`;
        if (/(actions\/|^|\s)vizy\//.test(path)) return 'vizy';
        if (/actions\//.test(path)) return 'craft';
    } catch { /* Fall through to the generic source. */ }
    return 'other';
}

function requestUrl(input: RequestInfo | URL): string {
    return typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
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
    let bannerTimer: ReturnType<typeof setInterval> | undefined;
    let retentionTimer: ReturnType<typeof setTimeout> | undefined;
    let changeListener: (() => void) | null = null;
    let supportRoot: HTMLElement | null = null;
    let lastEditor: Element | null = null;
    let finishing = false;
    let saveFailed = false;

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

    function problemCount(): number {
        return capture?.events.filter((event) => !['page', 'console-warn'].includes(event.kind)).length ?? 0;
    }

    function clock(): string {
        const seconds = capture ? Math.max(0, Math.floor((now() - capture.startedAt) / 1000)) : 0;
        return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
    }

    function bannerMessage(): string {
        if (capture?.status === 'stopped') return config.labels.ready;
        if (finishing) return config.labels.saving;
        if (saveFailed) return config.labels.saveFailed;
        if (problemCount() > 0) return config.labels.caught.replace('{count}', String(problemCount()));
        return capture?.context ? config.labels.makeItHappen : config.labels.goToPage;
    }

    // This transient control exists only in the tab that pressed Start.
    function render(): void {
        const shown = capture?.status === 'recording' || (capture?.status === 'stopped' && !capture.reviewed && !supportRoot);

        if (!shown || !document.body) {
            banner?.remove();
            banner = null;
            clearInterval(bannerTimer);
            bannerTimer = undefined;
            return;
        }

        if (!banner) {
            banner = document.createElement('aside');
            banner.dataset.vizyCaptureBanner = '';
            banner.setAttribute('aria-label', config.labels.title);
            Object.assign(banner.style, { position: 'fixed', bottom: '16px', right: '16px', zIndex: '10000', boxSizing: 'border-box',
                width: 'min(370px, calc(100vw - 32px))', padding: '12px 14px', display: 'grid', gap: '8px', borderRadius: '10px',
                background: '#1f2d3b', color: '#f2f6fa', boxShadow: '0 6px 24px #0f1b2840', font: '14px/1.45 system-ui, sans-serif' });
            const top = document.createElement('div');
            Object.assign(top.style, { display: 'flex', gap: '8px', alignItems: 'center', fontWeight: '600' });
            const dot = document.createElement('span');
            Object.assign(dot.style, { width: '9px', height: '9px', borderRadius: '50%', background: '#ff5a5a', flex: 'none' });
            const title = document.createElement('span');
            title.textContent = config.labels.title;
            const time = document.createElement('span');
            time.dataset.bannerTime = '';
            Object.assign(time.style, { marginLeft: 'auto', fontWeight: '400', color: '#bccada', fontVariantNumeric: 'tabular-nums' });
            top.append(dot, title, time);
            const message = document.createElement('div');
            message.dataset.bannerMessage = '';
            message.setAttribute('role', 'status');
            const actions = document.createElement('div');
            Object.assign(actions.style, { display: 'flex', gap: '8px', alignItems: 'center' });
            const done = document.createElement('button');
            done.type = 'button';
            done.dataset.bannerDone = '';
            Object.assign(done.style, { padding: '6px 14px', border: '0', borderRadius: '5px', background: '#fff', color: '#1f2d3b', font: 'inherit', fontWeight: '600', cursor: 'pointer' });
            done.addEventListener('click', () => { void finish(); });
            const cancel = document.createElement('button');
            cancel.type = 'button';
            cancel.dataset.bannerCancel = '';
            cancel.textContent = config.labels.cancel;
            Object.assign(cancel.style, { padding: '6px 4px', border: '0', background: 'transparent', color: '#bccada', font: 'inherit', textDecoration: 'underline', cursor: 'pointer' });
            cancel.addEventListener('click', discardCapture);
            actions.append(done, cancel);
            banner.append(top, message, actions);
            document.body.append(banner);
        }

        const stopped = capture?.status === 'stopped';
        const doneButton = banner.querySelector<HTMLButtonElement>('[data-banner-done]');
        if (doneButton) {
            doneButton.textContent = stopped ? config.labels.review : config.labels.done;
            doneButton.disabled = finishing;
        }
        const message = banner.querySelector<HTMLElement>('[data-banner-message]');
        if (message) {
            message.textContent = bannerMessage();
            message.style.color = problemCount() > 0 || saveFailed ? '#ffd98a' : '#dbe5ef';
        }
        const time = banner.querySelector<HTMLElement>('[data-banner-time]');
        if (time) time.textContent = clock();

        if (!stopped && bannerTimer === undefined) {
            bannerTimer = setInterval(() => {
                const current = banner?.querySelector<HTMLElement>('[data-banner-time]');
                if (current) current.textContent = clock();
            }, 1000);
        }
    }

    function stop(): void {
        cleanup?.();
        cleanup = null;
        if (capture) capture.status = 'stopped';
        persist();
        render();
        changeListener?.();
    }

    function discardCapture(): void {
        cleanup?.();
        cleanup = null;
        clearTimeout(retentionTimer);
        capture = null;
        lastEditor = null;
        finishing = false;
        saveFailed = false;
        persist();
        render();
        changeListener?.();
    }

    function noteElement(form: Element | null, trail?: string | null): void {
        const element = readElement(form);
        if (!capture || !element) return;
        // Moving to another element makes the last focused field meaningless.
        const sameElement = capture.context?.canonicalId === element.canonicalId;
        capture.context = { ...element, trail: trail !== undefined ? trail : sameElement ? capture.context?.trail ?? null : null };
        persist();
    }

    // Saves any pending edits first, then reads the element again in case that save
    // just created a draft. A failed save stays visible rather than silently leaving.
    async function finish(): Promise<void> {
        if (finishing || !capture) return;

        if (capture.status === 'recording') {
            if (!saveFailed) {
                const current = capture;
                finishing = true;
                render();
                const saved = await saveOpenEditors();
                finishing = false;

                // Cancel can be pressed while saving, and they meant to stay on this page.
                if (capture !== current) return;

                if (!saved) {
                    saveFailed = true;
                    render();
                    return;
                }
            }

            noteElement(formFor(lastEditor?.isConnected ? lastEditor : null));
            stop();
        }

        // The support page has already moved on to the review.
        if (!supportRoot) location.assign(config.supportUrl);
    }

    function record(event: Omit<CaptureEvent, 'elapsedMs'>): void {
        // Diagnostics must never change application behavior, even when storage is
        // disabled, a console argument is hostile, or another plugin patches APIs.
        try {
            if (!capture || capture.status !== 'recording') return;
            if (now() >= capture.startedAt + RECORDING_MS) { stop(); return; }
            if (capture.events.length < MAX_EVENTS) {
                const elementId = capture.context?.canonicalId;
                capture.events.push({ ...event, ...(elementId ? { elementId } : {}), elapsedMs: Math.max(0, now() - capture.startedAt) });
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
            render();
        } catch { /* Observing a failure must not cause another failure. */ }
    }

    function describe(value: unknown): Pick<CaptureEvent, 'errorType' | 'message' | 'stack'> {
        try {
            const error = value instanceof Error ? value : null;
            const result: Pick<CaptureEvent, 'errorType' | 'message' | 'stack'> = {
                errorType: error && errorNames.has(error.name) ? error.name : 'Other',
            };
            // Held in this tab only. The customer decides whether they join the report.
            if (typeof value === 'string') result.message = detailText(value, 1000);
            else if (error) result.message = detailText(error.message, 1000);
            if (error?.stack) result.stack = detailText(error.stack, 3000);
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
                if (response.status >= 400) add({ kind: 'request-failure', transport: 'fetch', status: response.status, source: requestSource(requestUrl(args[0])) });
                return response;
            }, (reason: unknown) => {
                // Pages cancel their own requests routinely, which isn't a failure.
                if (!(reason instanceof DOMException && reason.name === 'AbortError')) {
                    add({ kind: 'request-failure', transport: 'fetch', status: 0, source: requestSource(requestUrl(args[0])) });
                }
                throw reason;
            });
        };
        window.fetch = fetchWrapper;
        const originalSend = XMLHttpRequest.prototype.send;
        const pending = new Map<XMLHttpRequest, () => void>();
        const sendWrapper: typeof originalSend = function(this: XMLHttpRequest, body) {
            const xhr = this;
            let aborted = false;
            xhr.addEventListener('abort', () => { aborted = true; }, { once: true });
            const done = () => {
                pending.delete(xhr);
                if (!aborted && (xhr.status === 0 || xhr.status >= 400)) add({ kind: 'request-failure', transport: 'xhr', status: xhr.status, source: requestSource(xhr.responseURL) });
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
        const onFocus = (event: FocusEvent) => {
            try {
                const editor = event.target instanceof Element ? event.target.closest('vizy-editor') : null;
                if (!editor) return;
                lastEditor = editor;
                noteElement(formFor(editor), trailFor(editor));
            } catch { /* Observing a page must not affect it. */ }
        };
        document.addEventListener('focusin', onFocus, true);
        // Craft creates its element editor after the DOM is ready.
        const onLoad = () => { setTimeout(() => { try { noteElement(formFor(null)); render(); } catch { /* As above. */ } }, 0); };
        if (document.readyState === 'complete') onLoad();
        else window.addEventListener('load', onLoad, { once: true });
        const timer = setTimeout(stop, Math.max(0, capture.startedAt + RECORDING_MS - now()));
        cleanup = () => {
            clearTimeout(timer);
            document.removeEventListener('focusin', onFocus, true);
            window.removeEventListener('load', onLoad);
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

    const controller: CaptureController = {
        status: () => (unavailable ? 'unavailable' : capture?.status ?? 'idle'),
        start: () => {
            if (!config.owner) return;
            cleanup?.();
            cleanup = null;
            capture = {
                owner: config.owner, startedAt: now(), status: 'recording', reviewed: false, context: null,
                events: [], dropped: 0, environment: browserEnvironment(),
            };
            unavailable = false;
            if (!persist()) { capture = null; render(); changeListener?.(); return; }
            observe();
            retain();
            render();
            changeListener?.();
        },
        discard: discardCapture,
        // Messages leave the tab only when the customer includes them, and the server
        // repeats the check. A finished review also stops the pill returning later.
        payload: (includeDetails) => {
            if (!capture) return '';
            capture.reviewed = true;
            persist();
            return JSON.stringify({
                ...capture,
                events: capture.events.map(({ message, stack, ...event }) => (includeDetails ? { ...event, message, stack } : event)),
            });
        },
        onChange: (listener) => { changeListener = listener; },
    };

    function ready(): void {
        supportRoot = document.querySelector<HTMLElement>('[data-vizy-support]');
        if (supportRoot) mountSupportPage(supportRoot, controller, config.labels);
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
        observe();
        retain();
        render();
        changeListener?.();
    };
    window.addEventListener('pageshow', resume);
    window.addEventListener('pagehide', suspend);
    return () => {
        cleanup?.();
        clearTimeout(retentionTimer);
        banner?.remove();
        clearInterval(bannerTimer);
        document.removeEventListener('DOMContentLoaded', ready);
        window.removeEventListener('pageshow', resume);
        window.removeEventListener('pagehide', suspend);
        document.documentElement.removeAttribute('data-vizy-capture-installed');
    };
}
