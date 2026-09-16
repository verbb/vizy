/**
 * Wires the New/Edit buttons beside the Editor Config select in Vizy field
 * settings to a Craft slideout.
 *
 * Editor Configs are global project schema, so they are never edited inline in
 * field settings. On save we patch the select from the response instead of
 * reloading, which would discard the rest of the unsaved field settings.
 */

type CraftGlobals = typeof window & {
    Craft?: {
        t: (category: string, message: string, params?: Record<string, unknown>) => string;
        CpScreenSlideout?: new (action: string, settings?: Record<string, unknown>) => {
            on: (event: string, handler: (ev: {
                data?: Record<string, unknown>;
                response?: { data?: Record<string, unknown> };
            }) => void) => void;
        };
    };
};

type SavedEditorConfig = {
    id: string;
    label: string;
};

function openSlideout(select: HTMLSelectElement, id: string | null): void {
    const Craft = (window as CraftGlobals).Craft;
    if (!Craft?.CpScreenSlideout) return;

    const slideout = new Craft.CpScreenSlideout('vizy/editor-configs/edit', {
        params: id ? { id } : { id: 'new' },
    });

    slideout.on('submit', (event) => {
        // asSuccess payloads are not mirrored onto `event.data`; read the JSON body.
        const saved = (event.response?.data?.editorConfig ?? event.data) as SavedEditorConfig | undefined;
        if (!saved?.id) return;

        const existing = Array.from(select.options).find((option) => option.value === saved.id);
        if (existing) {
            existing.textContent = saved.label;
        } else {
            const option = document.createElement('option');
            option.value = saved.id;
            option.textContent = saved.label;
            select.append(option);
        }

        // Selecting the just-saved config matches the intent of both actions.
        select.value = saved.id;
        select.dispatchEvent(new Event('change', { bubbles: true }));
    });
}

function bind(root: ParentNode): void {
    root.querySelectorAll<HTMLElement>('[data-vizy-new-editor-config]').forEach((button) => {
        if (button.dataset.vizyBound) return;
        button.dataset.vizyBound = '1';
        button.addEventListener('click', () => {
            const select = button.closest('.flex')?.querySelector<HTMLSelectElement>('select');
            if (select) openSlideout(select, null);
        });
    });

    root.querySelectorAll<HTMLElement>('[data-vizy-edit-editor-config]').forEach((button) => {
        if (button.dataset.vizyBound) return;
        button.dataset.vizyBound = '1';
        button.addEventListener('click', () => {
            const select = button.closest('.flex')?.querySelector<HTMLSelectElement>('select');
            if (select && select.value !== '') openSlideout(select, select.value);
        });
    });
}

// Field settings HTML arrives asynchronously when the field type is switched, so
// bind on load and again whenever new settings markup is inserted.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => bind(document));
} else {
    bind(document);
}

new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            if (node instanceof HTMLElement && node.querySelector('[data-vizy-new-editor-config]')) {
                bind(node);
            }
        }
    }
}).observe(document.body, { childList: true, subtree: true });

export { bind };
