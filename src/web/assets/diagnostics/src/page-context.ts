// Describes where the customer is working, using Craft's and Vizy's existing
// markup. This only reads IDs and field UIDs, never field values, and the server
// treats all of it as a hint.

export type PageElement = { id: number; canonicalId: number; siteId: number };

type ElementEditorSettings = { elementId?: unknown; canonicalId?: unknown; siteId?: unknown };
type ElementEditor = { settings?: ElementEditorSettings; checkForm?: (force: boolean, ...args: unknown[]) => Promise<unknown> | undefined };
type JQueryLike = (element: Element) => { data: (key: string) => ElementEditor | undefined };

const EDITOR_FORMS = 'form[data-element-editor]';
const UID = /^[0-9a-f-]{36}$/i;

function elementEditor(form: Element): ElementEditor | null {
    const jquery = (window as unknown as { $?: JQueryLike }).$;

    return typeof jquery === 'function' ? jquery(form).data('elementEditor') ?? null : null;
}

// The settings update when an autosave creates a draft, though the URL doesn't.
export function readElement(form: Element | null): PageElement | null {
    const settings = form ? elementEditor(form)?.settings : undefined;
    const { elementId, canonicalId, siteId } = settings ?? {};

    if (typeof elementId !== 'number' || typeof siteId !== 'number') return null;

    return { id: elementId, canonicalId: typeof canonicalId === 'number' ? canonicalId : elementId, siteId };
}

export function formFor(node: Element | null): Element | null {
    return node?.closest(EDITOR_FORMS) ?? document.querySelector('#main-form');
}

// From the editor's element form down to the editor, matching the server's document
// trails. Slideouts are their own form, so a trail starts at the nearest one.
export function trailFor(editor: Element): string | null {
    const parts: string[] = [];

    for (let node: Element | null = editor; node && !node.matches(EDITOR_FORMS); node = node.parentElement) {
        if (node.classList.contains('field')) {
            const uid = node.getAttribute('data-vizy-field-layout-element-uid') ?? node.getAttribute('data-layout-element');
            if (uid && UID.test(uid)) parts.unshift(`field:${uid}`);
        } else if (node.tagName === 'VIZY-BLOCK') {
            const uid = node.getAttribute('data-block-uid');
            if (uid && UID.test(uid)) parts.unshift(`block:${uid}`);
        } else if (node.classList.contains('matrixblock')) {
            const id = node.getAttribute('data-id');
            if (id && /^\d+$/.test(id)) parts.unshift(`row:${id}`);
        }
    }

    return parts.length ? parts.join('/') : null;
}

// Waits for every open editor's pending autosave, so the report sees the customer's
// latest work and leaving doesn't trigger the browser's unsaved-changes prompt.
export async function saveOpenEditors(timeoutMs = 10000): Promise<boolean> {
    const saves = Array.from(document.querySelectorAll(EDITOR_FORMS)).map((form) => {
        const editor = elementEditor(form);

        return typeof editor?.checkForm === 'function' ? editor.checkForm(false, true) : undefined;
    });
    const timeout = new Promise<false>((resolve) => { setTimeout(() => resolve(false), timeoutMs); });

    try {
        return await Promise.race([Promise.all(saves).then(() => true), timeout]);
    } catch {
        return false;
    }
}
