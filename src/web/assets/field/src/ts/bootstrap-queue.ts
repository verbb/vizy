import type { EditorBootstrap } from './types';

const pendingBootstraps = new Map<string, EditorBootstrap>();

type BootstrappableEditor = HTMLElement & {
    bootstrap: EditorBootstrap;
};

function resolveEditor(id: string): BootstrappableEditor | null {
    const element = document.getElementById(id);
    if (!(element instanceof HTMLElement) || element.localName !== 'vizy-editor') {
        return null;
    }
    if (customElements.get('vizy-editor')) {
        customElements.upgrade(element);
    }
    return element as BootstrappableEditor;
}

export function assignBootstrap(id: string, bootstrap: EditorBootstrap): boolean {
    const editor = resolveEditor(id);
    if (!editor) {
        return false;
    }
    try {
        editor.bootstrap = bootstrap;
    } catch {
        return false;
    }
    pendingBootstraps.delete(id);
    return true;
}

export function queueBootstrap(id: string, bootstrap: EditorBootstrap): void {
    pendingBootstraps.set(id, bootstrap);
}

export function consumePendingBootstrap(id: string): EditorBootstrap | null {
    const bootstrap = pendingBootstraps.get(id) ?? null;
    if (bootstrap) {
        pendingBootstraps.delete(id);
    }
    return bootstrap;
}

export function bootstrapEditorWhenReady(id: string, bootstrap: EditorBootstrap): void {
    if (assignBootstrap(id, bootstrap)) {
        return;
    }

    queueBootstrap(id, bootstrap);

    const retry = (): void => {
        if (assignBootstrap(id, bootstrap)) {
            observer?.disconnect();
        }
    };

    customElements.whenDefined('vizy-editor').then(() => {
        retry();
        requestAnimationFrame(retry);
    });

    let observer: MutationObserver | null = null;
    if (typeof MutationObserver !== 'undefined') {
        observer = new MutationObserver(retry);
        observer.observe(document.documentElement, { childList: true, subtree: true });
        window.setTimeout(() => observer?.disconnect(), 10_000);
    }
}
