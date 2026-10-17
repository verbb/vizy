import { blockConflictedSubmit, pendingFullPageSave, saveAction, submitFullPage } from './craft-conflicts';

interface SubmitEventLike {
    type: string;
    customTrigger?: { data(name: string): unknown };
    saveShortcut?: boolean;
    autosave?: boolean;
    submitter?: HTMLElement | null;
    preventDefault(): void;
    stopImmediatePropagation(): void;
}

interface CraftQueuedEditor {
    isFullPage?: boolean;
    queue?: {
        running: boolean;
        unshift(job: () => Promise<void>): Promise<void>;
    };
    failed?: boolean;
}

interface CraftJQuery {
    (target: HTMLFormElement): {
        data(key: string): unknown;
        trigger(event: SubmitEventLike): void;
    };
    Event(type: string, properties: Record<string, unknown>): SubmitEventLike;
    event: {
        special: {
            submit?: {
                preDispatch?: (this: HTMLFormElement, event: SubmitEventLike) => unknown;
            };
        };
    };
}

/**
 * Craft cancels autosave before publishing. Cancellation can arrive after the
 * server commits, losing the acknowledgement containing Vizy's new storage token.
 * Wait for Craft's whole queue job (including draft identity reconciliation), then
 * let its original submit handlers serialize the current fields and publish.
 */
export function installCraftSubmitQueue(): void {
    const craft = window.Craft as (typeof window.Craft & { __vizySubmitQueue?: boolean });
    if (!craft || craft.__vizySubmitQueue) return;
    const $ = window.$ as CraftJQuery | undefined;
    if (!$?.event?.special || !$.Event) return;
    // Field-layout updates can evaluate the asset again in the same page. Share
    // this guard across evaluations so separate queues cannot defer each other.
    craft.__vizySubmitQueue = true;
    const pending = new WeakSet<HTMLFormElement>();
    const replaying = new WeakSet<HTMLFormElement>();
    const defer = (form: HTMLFormElement, event: SubmitEventLike): boolean => {
        if (!form.querySelector('vizy-editor')) return false;
        if (blockConflictedSubmit(form, event)) return true;
        // Destructive actions such as deleting a provisional draft already run
        // inside Craft's queue. Deferring them onto that same queue deadlocks.
        if (!saveAction(form, event)) return false;
        if (replaying.has(form)) return submitFullPage(form, event);
        const editor = $(form).data('elementEditor') as CraftQueuedEditor | undefined;
        const queue = editor?.queue;
        // Full-page saves also own a queue job when initially idle, so a late
        // native form check cannot overlap their recoverable AJAX publication.
        if (!queue || (!editor?.isFullPage && !queue.running && !pending.has(form))) return submitFullPage(form, event);
        event.preventDefault();
        event.stopImmediatePropagation();
        if (pending.has(form) || !queue) return true;
        pending.add(form);
        const waitingForAutosave = queue.running;
        // Preserve Craft's action/shortcut flags. Reusing the cancelled event would
        // also reuse its stopped-propagation state and skip Craft's submit handler.
        const resume = $.Event('submit', {
            customTrigger: event.customTrigger,
            saveShortcut: event.saveShortcut,
            autosave: event.autosave,
            submitter: event.submitter,
        });
        void queue.unshift(async () => {
            try {
                // A failure in the autosave we waited for vetoes this attempt.
                // An explicit later Save from an idle failed editor is a retry.
                if (!form.isConnected || (waitingForAutosave && editor?.failed)) return;
                replaying.add(form);
                $(form).trigger(resume);
                // jQuery trigger() does not await async submit handlers. Keep
                // queued checks behind publication; failures restore the form
                // before releasing this job, and success pauses for navigation.
                await pendingFullPageSave(form);
            } finally {
                replaying.delete(form);
                pending.delete(form);
            }
        }).catch((error: unknown) => {
            pending.delete(form);
            console.error('[Vizy] Could not finish autosave before submitting', error);
        });
        return true;
    };

    // Craft uses jQuery-triggered submits for its buttons and save shortcut; those
    // bypass native listeners. preDispatch also covers editors created later in a
    // Matrix row or slideout, without replacing their handlers or action routing.
    const special = $.event.special.submit ??= {};
    const previous = special.preDispatch;
    special.preDispatch = function(event) {
        if (previous?.call(this, event) === false) return false;
        if (this instanceof HTMLFormElement && defer(this, event)) return false;
    };
    // Native submits must be held before individual fields mint a new submission
    // generation, otherwise the in-flight acknowledgement would be superseded.
    document.addEventListener('submit', (event) => {
        if (event.target instanceof HTMLFormElement) defer(event.target, event as SubmitEvent);
    }, true);
}
