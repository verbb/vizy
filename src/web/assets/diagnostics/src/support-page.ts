import type { CaptureController } from './browser-capture';

type Labels = Record<'copied' | 'copyFailed' | 'failed', string>;

// Runs the Utilities page. The server builds each review, and the page then copies
// or saves exactly the report text it's showing.
export function mountSupportPage(root: HTMLElement, capture: CaptureController, labels: Labels): () => void {
    const reviewRoot = root.querySelector<HTMLElement>('[data-support-review]');
    const form = root.querySelector<HTMLFormElement>('[data-support-form]');
    let includeContent = true;
    let headline = '';
    let filename = 'vizy-support-report.json';
    let requestId = 0;

    function show(screen: string): void {
        root.querySelectorAll<HTMLElement>('[data-screen]').forEach((section) => {
            section.hidden = section.dataset.screen !== screen;
        });
    }

    function fail(message: string): void {
        const target = root.querySelector('[data-support-error]');
        if (target) target.textContent = message;
        show('error');
    }

    async function loadReview(): Promise<void> {
        const request = ++requestId;
        const open = Array.from(root.querySelectorAll<HTMLDetailsElement>('[data-support-review] details[open]')).map((details) => details.dataset.key);
        show('loading');

        const body = new FormData(form ?? undefined);
        body.set('includeContent', includeContent ? '1' : '0');
        body.set('browserCapture', capture.payload(includeContent));

        try {
            const response = await fetch(root.dataset.reviewAction ?? '', {
                method: 'POST',
                headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                body,
            });
            const result = await response.json() as { html?: string; headline?: string; filename?: string; message?: string };

            // A newer review, such as from a quick change of the checkbox, has replaced this one.
            if (request !== requestId) return;

            if (!response.ok || typeof result.html !== 'string' || !reviewRoot) {
                fail(result.message ?? labels.failed);
                return;
            }

            reviewRoot.innerHTML = result.html;
            headline = result.headline ?? '';
            filename = result.filename ?? filename;
            reviewRoot.querySelectorAll<HTMLDetailsElement>('details').forEach((details) => {
                details.open = open.includes(details.dataset.key);
            });
            show('review');
        } catch {
            if (request === requestId) fail(labels.failed);
        }
    }

    function report(): string {
        return root.querySelector('[data-support-report]')?.textContent ?? '';
    }

    function setShareStatus(message: string, success: boolean): void {
        const status = root.querySelector<HTMLElement>('[data-support-share-status]');
        if (!status) return;
        status.setAttribute('variant', success ? 'success' : 'warning');
        status.textContent = message;
        status.hidden = false;
    }

    async function copy(): Promise<void> {
        const text = `Vizy support report: ${headline}\n\n\`\`\`json\n${report()}\n\`\`\``;

        try {
            await navigator.clipboard.writeText(text);
            setShareStatus(labels.copied, true);
        } catch {
            setShareStatus(labels.copyFailed, false);
        }
    }

    function download(): void {
        const url = URL.createObjectURL(new Blob([report()], { type: 'application/json;charset=utf-8' }));
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.append(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function refresh(): void {
        requestId++;
        const status = capture.status();

        if (status === 'unavailable') {
            show('unavailable');
        } else if (status === 'recording') {
            show('watching');
        } else if (status === 'stopped') {
            void loadReview();
        } else {
            includeContent = true;
            show('start');
        }
    }

    function onClick(event: Event): void {
        const target = (event.target as Element).closest('button, pk-button');
        if (!target) return;

        if (target.matches('[data-support-start]')) {
            capture.start();
        } else if (target.matches('[data-support-restart]')) {
            capture.discard();
            refresh();
        } else if (target.matches('[data-support-copy]')) {
            void copy();
        } else if (target.matches('[data-support-download]')) {
            download();
        }
    }

    function onChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        if (!target.matches('[data-support-include]')) return;
        includeContent = target.checked;
        void loadReview();
    }

    root.addEventListener('click', onClick);
    root.addEventListener('change', onChange);
    capture.onChange(refresh);
    refresh();

    return () => {
        root.removeEventListener('click', onClick);
        root.removeEventListener('change', onChange);
    };
}
