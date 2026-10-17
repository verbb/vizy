import { beforeEach, describe, expect, it, vi } from 'vitest';
import { blockConflictedSubmit, isContentConflict, markConflict, observeSaveFailure, preventConflictedRequest, submitFullPage, unsavedContent } from '../../src/web/assets/field/src/ts/craft-conflicts';

const editors = new Map<string, any>();
const conflict = { response: { status: 409, data: { vizy: { conflict: { code: 'contentChanged' } } } } };
const event = () => ({ preventDefault: vi.fn(), stopImmediatePropagation: vi.fn() });
function form() {
    const form = document.createElement('form');
    form.id = `form-${Math.random()}`;
    form.innerHTML = '<input name="action" value="elements/save"><vizy-editor></vizy-editor>';
    form.querySelector('vizy-editor')!.id = `editor-${Math.random()}`;
    document.body.append(form);
    const editor = { isFullPage: true, settings: {}, enableAutosave: true, submittingForm: false,
        stopListeningForChanges: vi.fn(), listenForChanges: vi.fn(), trigger: vi.fn(),
        serializeForm: vi.fn(() => 'action=elements%2Fsave&title=Unsaved'), prepareData: (s: string) => s };
    editors.set(form.id, editor);
    // Happy DOM wraps createElement(form) in a named-property proxy; use the
    // same DOM identity returned by closest() in the request bridge.
    return { form: form.querySelector("vizy-editor")!.closest("form")!, editor };
}
beforeEach(() => {
    document.body.replaceChildren();
    window.Craft = { sendActionRequest: vi.fn().mockRejectedValue(conflict) };
    window.$ = ((form: HTMLFormElement) => ({ data: () => editors.get(form.id) })) as any;
});

describe('recoverable Craft conflicts', () => {
    it('recognizes only the structured conflict, not unrelated 409 errors', () => {
        expect(isContentConflict(conflict)).toBe(true);
        expect(isContentConflict({ response: { status: 409, data: { message: 'Changed' } } })).toBe(false);
        expect(isContentConflict({ response: { status: 500, data: conflict.response.data } })).toBe(false);
    });
    it('routes committed draft results from validation errors without pausing the form', () => {
        const { form: f, editor } = form();
        const other = form();
        Object.assign(editor, { draftElementIds: { 10: 20 }, draftElementUids: { original: 'existing-draft' } });
        const data = new URLSearchParams({ 'vizyTransport[test][editorId]': f.querySelector('vizy-editor')!.id }).toString();
        const response = { message: 'Heading cannot be blank.', draftElementIds: { 30: 40 }, draftElementUids: { neo: 'neo-draft' }, vizy: { results: [{ success: true, storageToken: 'committed-draft' }] } };
        const received = vi.fn();
        document.addEventListener('vizy:server-response', received);
        try {
            for (const status of [409, 500]) observeSaveFailure({ response: { status, data: response } }, data);
            observeSaveFailure({ response: { status: 400, data: { message: 'Rejected without persistence' } } }, data);
            expect(received).not.toHaveBeenCalled();
            observeSaveFailure({ response: { status: 400, data: response } }, data);
            expect(received).toHaveBeenCalledTimes(1);
            expect((received.mock.calls[0][0] as CustomEvent).detail).toBe(response);
            expect(editor.enableAutosave).toBe(true);
            expect((editor as any).draftElementIds).toEqual({ 10: 20, 30: 40 });
            expect((editor as any).draftElementUids).toEqual({ original: 'existing-draft', neo: 'neo-draft' });
            expect((other.editor as any).draftElementIds).toBeUndefined();
            expect(blockConflictedSubmit(f, event())).toBe(false);
        } finally {
            document.removeEventListener('vizy:server-response', received);
        }
    });
    it('pauses only the submitting form and blocks repeated Save and queued autosaves', () => {
        const a = form(); const b = form();
        const data = new URLSearchParams({ [`vizyTransport[abc][editorId]`]: a.form.querySelector('vizy-editor')!.id }).toString();
        observeSaveFailure(conflict, data);
        observeSaveFailure(conflict, data);
        expect(a.editor.enableAutosave).toBe(false);
        expect(b.editor.enableAutosave).toBe(true);
        expect(a.form.querySelectorAll('[data-vizy-save-notice]')).toHaveLength(1);
        expect(blockConflictedSubmit(a.form, event())).toBe(true);
        expect(blockConflictedSubmit(b.form, event())).toBe(false);
        expect(() => preventConflictedRequest(data)).toThrow();
        expect(() => preventConflictedRequest('title=Other')).not.toThrow();
    });
    it('retains the full form when a final save conflicts, without retrying the write', async () => {
        const { form: f, editor } = form();
        const ev = event();
        expect(submitFullPage(f, ev)).toBe(true);
        expect(submitFullPage(f, event())).toBe(true);
        await vi.waitFor(() => expect(f.hasAttribute('data-vizy-conflict')).toBe(true));
        expect(window.Craft!.sendActionRequest).toHaveBeenCalledTimes(1);
        expect(editor.submittingForm).toBe(false);
        expect(f.inert).toBeFalsy();
        expect(f.querySelector('vizy-editor')).not.toBeNull();
        expect(editor.listenForChanges).not.toHaveBeenCalled();
        expect(ev.preventDefault).toHaveBeenCalled();
    });
    it('keeps ordinary validation failures retryable and displays the field errors', async () => {
        window.Craft!.sendActionRequest = vi.fn().mockRejectedValue({ response: { status: 400, data: { errorSummary: ["Title cannot be blank."] } } });
        const { form: f, editor } = form();
        submitFullPage(f, event());
        await vi.waitFor(() => expect(editor.listenForChanges).toHaveBeenCalled());
        expect(f.textContent).toContain('Title cannot be blank.');
        expect(blockConflictedSubmit(f, event())).toBe(false);
        expect(editor.enableAutosave).toBe(true);
    });
    it('shows readable messages from Craft HTML summaries without inserting response markup', async () => {
        const summary = '<div class="error-summary" tabindex="-1"><div><h2>Found 2 errors</h2></div><ul class="errors"><li><a href="#" data-field-error-key="title"><em>Title</em> cannot be blank.</a></li><li><a href="#">Use &lt;draft&gt; &amp; review.<img src="invalid" onerror="alert(1)"></a></li></ul></div>';
        window.Craft!.sendActionRequest = vi.fn().mockRejectedValue({ response: { status: 400, data: { errorSummary: summary } } });
        const { form: f, editor } = form();
        submitFullPage(f, event());
        await vi.waitFor(() => expect(editor.listenForChanges).toHaveBeenCalled());
        const alert = f.querySelector('[data-vizy-save-notice]')!;
        expect(alert.textContent).toBe('Title cannot be blank. Use <draft> & review.');
        expect(alert.querySelector('a, img, em, .error-summary')).toBeNull();
        expect(f.inert).toBeFalsy();
        expect(blockConflictedSubmit(f, event())).toBe(false);
        submitFullPage(f, event());
        await vi.waitFor(() => expect(window.Craft!.sendActionRequest).toHaveBeenCalledTimes(2));
    });
    it('falls back to the response message for an empty HTML summary', async () => {
        window.Craft!.sendActionRequest = vi.fn().mockRejectedValue({ response: { status: 400, data: { errorSummary: '<div class="error-summary"><ul class="errors"></ul></div>', message: 'Entry could not be saved.' } } });
        const { form: f, editor } = form();
        submitFullPage(f, event());
        await vi.waitFor(() => expect(editor.listenForChanges).toHaveBeenCalled());
        expect(f.querySelector('[data-vizy-save-notice]')!.textContent).toBe('Entry could not be saved.');
    });
    it('exports current nested field values without signed transport or CSRF data', () => {
        const { form: f, editor } = form();
        editor.serializeForm.mockReturnValue(new URLSearchParams({
            title: 'Unsaved title', CRAFT_CSRF_TOKEN: 'secret',
            'fields[body]': JSON.stringify({ attrs: { _storageToken: 'signed' }, content: [{ attrs: { fieldSlots: { matrix: { entries: { new1: { fields: { label: 'Pending row', link: 'https://example.test' } } } } } } }] }),
            'vizyTransport[abc][editorContextToken]': 'signed-context',
        }).toString());
        markConflict(f);
        const exported = unsavedContent(f);
        expect(exported).toContain('Pending row');
        expect(exported).toContain('https://example.test');
        expect(exported).not.toContain('secret');
        expect(exported).not.toContain('signed');
    });
    it('uses the final Craft action override for Save as a new entry', async () => {
        const { form: f, editor } = form();
        editor.serializeForm.mockReturnValue('action=elements%2Fsave&action=elements%2Fduplicate&asUnpublishedDraft=true');
        submitFullPage(f, event());
        await vi.waitFor(() => expect(window.Craft!.sendActionRequest).toHaveBeenCalledWith('POST', 'elements/duplicate', expect.anything()));
    });
    it('pauses queued checks after a successful publication starts navigation', async () => {
        const { form: f, editor } = form();
        const queue = { pause: vi.fn() };
        Object.assign(editor, { queue });
        const navigate = vi.spyOn(window.location, 'assign').mockImplementation(() => {});
        window.Craft!.sendActionRequest = vi.fn().mockResolvedValue({ data: { redirect: '/admin/entries' } });
        try {
            submitFullPage(f, event());
            await vi.waitFor(() => expect(navigate).toHaveBeenCalledWith('/admin/entries'));
            expect(queue.pause).toHaveBeenCalledOnce();
            expect(editor.submittingForm).toBe(true);
            expect(f.inert).toBe(true);
            expect(editor.listenForChanges).not.toHaveBeenCalled();
        } finally {
            navigate.mockRestore();
        }
    });
    it('leaves slideout submission and non-save actions with Craft', () => {
        const { form: f, editor } = form();
        editor.isFullPage = false;
        expect(submitFullPage(f, event())).toBe(false);
        editor.isFullPage = true;
        f.querySelector('input')!.value = 'elements/delete';
        expect(submitFullPage(f, event())).toBe(false);
    });
});
