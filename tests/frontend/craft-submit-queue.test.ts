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
const editors = new WeakMap<HTMLFormElement, { queue: typeof queue; failed: boolean }>();
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
    if (vizy) element.innerHTML = '<vizy-editor></vizy-editor><vizy-editor></vizy-editor>';
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
});
