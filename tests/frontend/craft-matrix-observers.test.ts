import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { pauseMatrixObservers } from '../../src/web/assets/field/src/ts/craft-matrix-observers';

const entries = new WeakMap<HTMLElement, { formObserver?: ReturnType<typeof observer> }>();
function observer() {
    const check = vi.fn();
    return { pause: vi.fn(), resume: vi.fn(check), check, _timeout: window.setTimeout(check, 100) };
}
function fixture() {
    const form = document.createElement('form');
    form.innerHTML = '<div class="matrixblock"></div>';
    document.body.append(form);
    const node = form.firstElementChild as HTMLElement;
    const entry = { formObserver: observer() };
    entries.set(node, entry);
    return { form, node, entry };
}
beforeEach(() => {
    vi.useFakeTimers();
    window.$ = ((node: HTMLElement) => ({ data: () => entries.get(node) })) as unknown as typeof window.$;
});
afterEach(() => {
    vi.useRealTimers();
    document.body.replaceChildren();
});

describe('native Matrix observers during publication', () => {
    it('stops a pending row check and checks current values on recovery', () => {
        const { form, entry } = fixture();
        const resume = pauseMatrixObservers(form);
        expect(entry.formObserver.pause).toHaveBeenCalledOnce();
        vi.advanceTimersByTime(200);
        expect(entry.formObserver.check).not.toHaveBeenCalled();
        resume();
        expect(entry.formObserver.resume).toHaveBeenCalledOnce();
        expect(entry.formObserver.check).toHaveBeenCalledOnce();
    });
    it('does not pause rows belonging to another form', () => {
        const a = fixture(); const b = fixture();
        pauseMatrixObservers(a.form);
        vi.advanceTimersByTime(200);
        expect(a.entry.formObserver.check).not.toHaveBeenCalled();
        expect(b.entry.formObserver.pause).not.toHaveBeenCalled();
        expect(b.entry.formObserver.check).toHaveBeenCalledOnce();
    });
    it('does not resume an observer removed or replaced by a returned layout', () => {
        for (const removed of [true, false]) {
            const { form, node, entry } = fixture();
            const previous = entry.formObserver;
            const resume = pauseMatrixObservers(form);
            if (removed) node.remove();
            else entry.formObserver = observer();
            resume();
            expect(previous.resume).not.toHaveBeenCalled();
            expect(entry.formObserver.resume).not.toHaveBeenCalled();
        }
    });
});
