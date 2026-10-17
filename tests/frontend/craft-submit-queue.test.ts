import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { installCraftSubmitQueue } from '../../src/web/assets/field/src/ts/craft-submit-queue';

type TestEvent = ReturnType<typeof makeEvent>;
const makeEvent = (properties: Record<string, unknown> = {}) => ({
    type: 'submit',
    preventDefault: vi.fn(),
    stopImmediatePropagation: vi.fn(),
    ...properties,
});
const previous = vi.fn();
const special = { submit: { preDispatch: previous as (this: HTMLFormElement, event: TestEvent) => unknown } };
const replayed = vi.fn();
const editors = new WeakMap<HTMLFormElement, { queue: typeof queue; failed: boolean; isFullPage?: boolean }>();
let jobs: Array<() => Promise<void>> = [];
const queue = {
    running: true,
    unshift: vi.fn((job: () => Promise<void>) => {
        jobs.unshift(job);
        return Promise.resolve();
    }),
};
const jquery = Object.assign((form: HTMLFormElement) => ({
    data: () => editors.get(form),
    trigger: (event: TestEvent) => {
        if (special.submit.preDispatch.call(form, event) !== false) replayed(form, event);
    },
}), {
    event: { special },
    Event: (_type: string, properties: Record<string, unknown>) => makeEvent(properties),
});

function form(vizy = true) {
    const element = document.createElement('form');
    if (vizy) element.innerHTML = '<input name="action" value="elements/save"><vizy-editor></vizy-editor><vizy-editor></vizy-editor>';
    document.body.append(element);
    editors.set(element, { queue, failed: false });
    return element;
}

beforeAll(() => {
    window.Craft = {};
    window.$ = jquery as unknown as typeof window.$;
    installCraftSubmitQueue();
    // Craft can evaluate the entry asset again when it replaces field layouts.
    installCraftSubmitQueue();
});
beforeEach(() => {
    document.body.replaceChildren();
    jobs = [];
    queue.running = true;
    delete window.Craft!.sendActionRequest;
    vi.clearAllMocks();
});

describe('Craft submission queue', () => {
    it('waits once for all fields, coalesces clicks and preserves Craft action flags', async () => {
        const element = form();
        const trigger = { action: 'elements/apply-draft' };
        const event = makeEvent({ customTrigger: trigger, saveShortcut: true, autosave: false });
        expect(special.submit.preDispatch.call(element, event)).toBe(false);
        expect(special.submit.preDispatch.call(element, makeEvent())).toBe(false);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(replayed).not.toHaveBeenCalled();
        expect(jobs).toHaveLength(1);
        await jobs.shift()!();
        expect(replayed).toHaveBeenCalledExactlyOnceWith(element, expect.objectContaining({
            customTrigger: trigger, saveShortcut: true, autosave: false,
        }));
        expect(jobs).toHaveLength(0);
    });

    it('captures native submission before fields supersede the autosave generation', async () => {
        const element = form();
        const fieldSubmit = vi.fn();
        element.addEventListener('submit', fieldSubmit, true);
        const event = new SubmitEvent('submit', { bubbles: true, cancelable: true });
        element.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
        expect(fieldSubmit).not.toHaveBeenCalled();
        await jobs.shift()!();
        expect(replayed).toHaveBeenCalledOnce();
    });

    it('leaves idle editors and forms without Vizy to their existing handlers', () => {
        expect(special.submit.preDispatch.call(form(false), makeEvent())).toBeUndefined();
        queue.running = false;
        expect(special.submit.preDispatch.call(form(), makeEvent())).toBeUndefined();
        expect(jobs).toHaveLength(0);
        expect(previous).toHaveBeenCalledTimes(2);
    });

    it('lets Craft discard a provisional draft while its queue is running', () => {
        const element = form();
        const action = document.createElement('input');
        action.name = 'action';
        action.value = 'elements/delete-draft';
        element.append(action);
        const event = makeEvent();
        expect(special.submit.preDispatch.call(element, event)).toBeUndefined();
        expect(event.preventDefault).not.toHaveBeenCalled();
        expect(jobs).toHaveLength(0);
    });

    it('honours an existing submit veto', () => {
        previous.mockReturnValueOnce(false);
        expect(special.submit.preDispatch.call(form(), makeEvent())).toBe(false);
        expect(jobs).toHaveLength(0);
    });

    it('retains the form when autosave fails and allows a later retry', async () => {
        const element = form();
        special.submit.preDispatch.call(element, makeEvent());
        editors.get(element)!.failed = true;
        await jobs.shift()!();
        expect(replayed).not.toHaveBeenCalled();
        editors.get(element)!.failed = false;
        special.submit.preDispatch.call(element, makeEvent());
        await jobs.shift()!();
        expect(replayed).toHaveBeenCalledOnce();
    });

    it('does not submit a closed slideout', async () => {
        const element = form();
        special.submit.preDispatch.call(element, makeEvent());
        element.remove();
        await jobs.shift()!();
        expect(replayed).not.toHaveBeenCalled();
    });

    for (const running of [false, true]) {
        it(`holds the ${running ? 'busy' : 'idle'} queue until a failed publication restores the form`, async () => {
            const element = form();
            queue.running = running;
            const editor = Object.assign(editors.get(element)!, {
                isFullPage: true, settings: {}, submittingForm: false,
                failed: !running,
                stopListeningForChanges: vi.fn(), listenForChanges: vi.fn(), trigger: vi.fn(),
                serializeForm: () => 'action=elements%2Fsave&title=Changed', prepareData: (data: string) => data,
            });
            let rejectSave!: (error: unknown) => void;
            window.Craft!.sendActionRequest = vi.fn(() => new Promise<never>((_, reject) => { rejectSave = reject; }));
            expect(special.submit.preDispatch.call(element, makeEvent())).toBe(false);
            const completed = vi.fn();
            const job = jobs.shift()!().then(completed);
            await vi.waitFor(() => expect(editor.submittingForm).toBe(true));
            expect(completed).not.toHaveBeenCalled();
            expect(replayed).not.toHaveBeenCalled();
            rejectSave({ response: { status: 400, data: { message: 'Title is required.' } } });
            await job;
            expect(editor.submittingForm).toBe(false);
            expect(editor.listenForChanges).toHaveBeenCalledOnce();
            expect(element.inert).toBeFalsy();
            // A failed save releases the pending guard as well as the queue job.
            special.submit.preDispatch.call(element, makeEvent());
            expect(jobs).toHaveLength(1);
        });
    }
});
