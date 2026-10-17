interface MatrixObserver {
    _timeout?: number;
    pause(): void;
    resume(): void;
}

interface MatrixEntry {
    formObserver?: MatrixObserver;
}

/** Suspend native row checks for the lifetime of a full-page AJAX submission. */
export function pauseMatrixObservers(form: HTMLFormElement): () => void {
    const paused: Array<{ node: Element; entry: MatrixEntry; observer: MatrixObserver }> = [];
    for (const node of form.querySelectorAll<HTMLElement>('.matrixblock')) {
        const entry = window.$?.(node).data('entry') as MatrixEntry | undefined;
        const observer = entry?.formObserver;
        if (!entry || !observer) continue;
        observer.pause();
        // Craft's row observers bypass the element-editor queue. pause() stops
        // new events, but an already scheduled check does not test the pause
        // level. Cancel that timer as Craft.FormObserver.destroy() does; resume()
        // will check the current values after a recoverable failure.
        window.clearTimeout(observer._timeout);
        paused.push({ node, entry, observer });
    }
    return () => {
        for (const { node, entry, observer } of paused) {
            // A returned field layout may have replaced or destroyed a row.
            if (node.isConnected && entry.formObserver === observer) observer.resume();
        }
    };
}
