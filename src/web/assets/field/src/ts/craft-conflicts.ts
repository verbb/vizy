import '@verbb/plugin-kit-web/components/alert';
import '@verbb/plugin-kit-web/components/button/pk-button.js';

export interface CraftSubmitEvent {
    customTrigger?: { data(name: string): unknown };
    saveShortcut?: boolean;
    autosave?: boolean;
    preventDefault(): void;
    stopImmediatePropagation(): void;
}

interface Editor {
    isFullPage?: boolean;
    enableAutosave?: boolean;
    submittingForm?: boolean;
    settings: { draftId?: number; isUnpublishedDraft?: boolean; isProvisionalDraft?: boolean };
    serializeForm(removeActionParams: boolean): string;
    prepareData(data: string): string;
    stopListeningForChanges(): void;
    listenForChanges(): void;
    trigger(event: string): void;
}
type SaveResponse = { data: { redirect?: string }; headers?: Record<string, string> };
interface UnloadForms { not(form: HTMLFormElement): UnloadForms }
function allowNavigation(form: HTMLFormElement): void {
    const cp = (window.Craft as typeof window.Craft & { cp?: { $confirmUnloadForms?: UnloadForms } })?.cp;
    if (cp?.$confirmUnloadForms) cp.$confirmUnloadForms = cp.$confirmUnloadForms.not(form);
}
type Failure = { response?: { status?: number; data?: { message?: string; errorSummary?: unknown; vizy?: { conflict?: { code?: string; reviewUrl?: string | null } } } } };
const conflicts = new WeakSet<HTMLFormElement>();
const saving = new WeakSet<HTMLFormElement>();
const t = (message: string) => window.Craft?.t?.('vizy', message) ?? message;
const editorFor = (form: HTMLFormElement) => (window.$?.(form).data('elementEditor') as Editor | undefined);
const stop = (event: CraftSubmitEvent) => { event.preventDefault(); event.stopImmediatePropagation(); };

function notice(form: HTMLFormElement, heading: string, message: string) {
    let alert = form.querySelector<HTMLElementTagNameMap['pk-alert']>(':scope > [data-vizy-save-notice]');
    if (!alert) {
        alert = document.createElement('pk-alert');
        alert.dataset.vizySaveNotice = '';
        alert.variant = 'error';
        alert.announce = 'assertive';
        alert.tabIndex = -1;
        form.prepend(alert);
    }
    alert.heading = t(heading);
    alert.replaceChildren(document.createTextNode(t(message)));
    return alert;
}

/** A reference copy of current form values, not a claim of a restorable Craft draft. */
export function unsavedContent(form: HTMLFormElement): string {
    const serialized = editorFor(form)?.serializeForm(false);
    if (serialized === undefined) throw new Error('The editor is no longer available.');
    const fields: Array<{ name: string; value: unknown }> = [];
    for (const [name, raw] of new URLSearchParams(serialized)) {
        if (!/^(fields(?:\[|$)|title$|slug$|siteId$|elementId$|draftId$)/.test(name)) continue;
        let value: unknown = raw;
        try {
            value = JSON.parse(raw);
            // Signed transport belongs to this open editor, not the exported content.
            value = JSON.parse(JSON.stringify(value, (key, item) =>
                ['_storageToken', '_editorContextToken', '_editorId'].includes(key) ? undefined : item));
        } catch { /* Plain field values remain strings. */ }
        fields.push({ name, value });
    }
    return JSON.stringify({ format: 'vizy-unsaved-content', version: 1, fields }, null, 2);
}

export function markConflict(form: HTMLFormElement, reviewUrl?: string | null): void {
    if (conflicts.has(form)) return;
    conflicts.add(form);
    form.dataset.vizyConflict = '';
    const editor = editorFor(form);
    if (editor) {
        editor.enableAutosave = false;
        editor.stopListeningForChanges();
    }
    const alert = notice(form, 'This content changed elsewhere', 'Your changes have not been saved. Keep this editor open while you review the latest version. Download your unsaved content before reloading; the download is a reference copy, not an importable draft.');
    const actions = document.createElement('div');
    actions.slot = 'actions';
    const latest = document.createElement('pk-button');
    latest.textContent = t('View latest saved version');
    // A separate window preserves this form, including nested field widgets.
    latest.addEventListener('click', () => window.open(reviewUrl || window.location.href, '_blank', 'noopener,noreferrer'));
    const download = document.createElement('pk-button');
    download.textContent = t('Download unsaved content');
    download.addEventListener('click', () => {
        try {
            const url = URL.createObjectURL(new Blob([unsavedContent(form)], { type: 'application/json' }));
            const link = document.createElement('a');
            link.href = url;
            link.download = 'vizy-unsaved-content.json';
            link.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch {
            const message = document.createElement('p');
            message.textContent = t('The download could not be created. Keep this editor open and copy your changes before reloading.');
            alert.append(message);
        }
    });
    const reload = document.createElement('pk-button');
    reload.textContent = t('Discard changes and reload');
    reload.addEventListener('click', () => {
        if (window.confirm(t('Discard the unsaved changes in this editor and reload the saved version?'))) {
            delete form.dataset.vizyConflict;
            allowNavigation(form);
            window.location.reload();
        }
    });
    actions.append(latest, download, reload);
    alert.append(actions);
}

export function isContentConflict(error: unknown): error is Failure {
    const response = (error as Failure | null)?.response;
    return response?.status === 409 && response.data?.vizy?.conflict?.code === 'contentChanged';
}

function requestForms(data: unknown): Set<HTMLFormElement> {
    const forms = new Set<HTMLFormElement>();
    if (typeof data !== 'string') return forms;
    for (const [name, id] of new URLSearchParams(data)) {
        if (!/^vizyTransport\[[^\]]+\]\[editorId\]$/.test(name)) continue;
        const field = document.getElementById(id);
        const form = field?.matches('vizy-editor') ? field.closest('form') : null;
        if (form) forms.add(form);
    }
    return forms;
}

export function observeConflict(error: unknown, data: unknown): void {
    if (isContentConflict(error)) requestForms(data).forEach((form) => markConflict(form, (error as Failure).response?.data?.vizy?.conflict?.reviewUrl));
}

export function preventConflictedRequest(data: unknown): void {
    if ([...requestForms(data)].some((form) => conflicts.has(form))) {
        // Queued checks and Live Preview must not keep sending the rejected version.
        throw { response: { status: 409, data: { message: t('This content changed elsewhere. Your changes have not been saved.'), vizy: { conflict: { code: 'contentChanged' } } } } };
    }
}

export function blockConflictedSubmit(form: HTMLFormElement, event: CraftSubmitEvent): boolean {
    if (!conflicts.has(form)) return false;
    stop(event);
    form.querySelector<HTMLElement>('[data-vizy-save-notice]')?.focus();
    return true;
}

/** Use Craft's serializer, actions and redirects while retaining the live form on failure. */
export function submitFullPage(form: HTMLFormElement, event: CraftSubmitEvent): boolean {
    const editor = editorFor(form);
    if (!editor?.isFullPage || !window.Craft?.sendActionRequest) return false;
    const action = event.customTrigger?.data('action') ?? form.querySelector<HTMLInputElement>('input[name="action"]')?.value;
    if (!['elements/save', 'elements/save-draft', 'elements/apply-draft', 'elements/duplicate'].includes(typeof action === 'string' ? action : '')) return false;
    // Craft treats an ordinary Save on a named draft as autosave, without navigation.
    if (editor.settings.draftId && !editor.settings.isUnpublishedDraft && !editor.settings.isProvisionalDraft
        && event.autosave !== false && editor.enableAutosave
        && (event.saveShortcut || event.customTrigger?.data('action') === 'elements/save-draft')) return false;
    stop(event);
    if (saving.has(form)) return true;
    saving.add(form);
    void save(form, editor, action as string);
    return true;
}

async function save(form: HTMLFormElement, editor: Editor, action: string): Promise<void> {
    const wasInert = form.inert;
    editor.submittingForm = true;
    editor.stopListeningForChanges();
    let navigated = false;
    try {
        editor.trigger('beforeSubmit');
        const data = editor.prepareData(editor.serializeForm(false));
        // As with a native navigation, don't accept edits after capturing the save.
        form.inert = true;
        // Craft appends action overrides from the clicked menu item. Like PHP,
        // use the last value rather than the original hidden form action.
        const saveAction = new URLSearchParams(data).getAll('action').at(-1) ?? action;
        const response = await window.Craft!.sendActionRequest!('POST', saveAction, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, data,
        }) as SaveResponse;
        const redirect = response.headers?.['x-redirect'] ?? response.data?.redirect;
        if (!redirect) throw new Error('The save response did not include a destination. Check the saved version before retrying.');
        // Craft's normal full-page submission removes its unload guard too.
        allowNavigation(form);
        window.location.assign(redirect);
        navigated = true;
    } catch (error) {
        if (!form.isConnected) return;
        if (isContentConflict(error)) {
            markConflict(form, error.response?.data?.vizy?.conflict?.reviewUrl);
        } else {
            const failure = (error as Failure)?.response?.data;
            const messages: string[] = [];
            const collect = (value: unknown): void => {
                if (typeof value === 'string') messages.push(value);
                else if (value && typeof value === 'object') Object.values(value).forEach(collect);
            };
            collect(failure?.errorSummary);
            notice(form, 'Changes could not be saved', messages.join(' ') || failure?.message
                || (error instanceof Error ? error.message : 'Your changes remain in this editor. Check your connection and try saving again.'));
        }
    } finally {
        saving.delete(form);
        if (!navigated) {
            form.inert = wasInert;
            editor.submittingForm = false;
            editor.trigger('afterSubmit');
            if (!conflicts.has(form)) editor.listenForChanges();
            form.querySelector<HTMLElement>('[data-vizy-save-notice]')?.focus();
        }
    }
}

window.addEventListener('beforeunload', (event) => {
    if (document.querySelector('form[data-vizy-conflict]')) {
        event.preventDefault();
        event.returnValue = '';
    }
});
