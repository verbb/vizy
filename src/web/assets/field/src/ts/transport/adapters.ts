import type { JsonValue } from '../types';

export interface FieldTransportAdapter {
    read(root: HTMLElement): JsonValue;
    bind(root: HTMLElement, changed: () => void): () => void;
}

const bindInputs = (root: HTMLElement, changed: () => void): (() => void) => {
    const handler = () => changed();
    root.addEventListener('input', handler);
    root.addEventListener('change', handler);
    return () => {
        root.removeEventListener('input', handler);
        root.removeEventListener('change', handler);
    };
};

const firstControl = (root: HTMLElement): HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement => {
    const control = root.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input:not([type=hidden]), textarea, select');
    if (!control) throw new Error('adapterControlMissing');
    return control;
};

const plainText: FieldTransportAdapter = {
    read: (root) => firstControl(root).value,
    bind: bindInputs,
};

const lightswitch: FieldTransportAdapter = {
    read(root) {
        const input = root.querySelector<HTMLInputElement>('input[type=hidden]');
        if (!input) throw new Error('adapterControlMissing');
        return input.value === '1';
    },
    bind: bindInputs,
};

/**
 * Craft JSON field — textarea (CodeMirror-synced) holds JSON text, but the
 * persisted document value must be the decoded structure. Storing the raw
 * string makes Json::normalizeValue wrap a string, and the next inputHtml
 * Json.encodes it into `"{ \"test\": … }"`.
 */
const jsonField: FieldTransportAdapter = {
    read(root) {
        const control = root.querySelector<HTMLTextAreaElement>('textarea');
        if (!control) throw new Error('adapterControlMissing');
        // CodeMirror.fromTextArea keeps a CM5 instance on the textarea and
        // saves on change; flush before read in case a save is pending.
        const codeMirror = (control as HTMLTextAreaElement & {
            CodeMirror?: { save?: () => void };
        }).CodeMirror;
        codeMirror?.save?.();

        const raw = control.value;
        if (raw.trim() === '') return null;
        try {
            return JSON.parse(raw) as JsonValue;
        } catch (error) {
            // Match Craft\fields\Json::normalizeValueFromRequest error shape so
            // inputHtml can round-trip the invalid text via JsonData::getJson.
            return {
                __ERROR__: error instanceof Error ? error.message : 'Invalid JSON',
                __VALUE__: raw,
            };
        }
    },
    bind: bindInputs,
};

const relations: FieldTransportAdapter = {
    read(root) {
        const values = [...root.querySelectorAll<HTMLInputElement>('input[type=hidden][name]')]
            .filter((input) => !input.disabled && input.value !== '' && isPostedFieldName(input.name))
            .map((input) => input.value);
        return values;
    },
    bind: bindInputs,
};

/**
 * Craft Link field — Element link types register BaseElementSelectInput with
 * `name: null`, so chips get hidden inputs literally named `"null"` (JS
 * `null + ''`). Those siblings sit next to the real `…[type]` / `…[entry][value]`
 * controls. A generic bracket-tree then has two roots (`null` + `vizyHost`),
 * unwrap stops, and PHP `Link::normalizeValue` sees no `type`/`value` → null.
 * Read the Link contract explicitly as Craft's serialize shape `{type, value}`.
 */
const linkField: FieldTransportAdapter = {
    read(root) {
        const typeControl = root.querySelector<HTMLSelectElement | HTMLInputElement>(
            'select[name*="[type]"], input[type="hidden"][name*="[type]"]',
        );
        const type = (typeControl?.value || '').trim() || 'url';
        const panel = root.querySelector<HTMLElement>(`[data-link-type="${CSS.escape(type)}"]`)
            ?? root.querySelector<HTMLElement>('[data-link-type]:not(.hidden)');
        // Both element and text link types keep the posted value on a named
        // hidden/text input under the active type panel (`…[value]`).
        const valueInput = panel?.querySelector<HTMLInputElement>('input[name*="[value]"]')
            ?? root.querySelector<HTMLInputElement>(`input[name*="[${CSS.escape(type)}][value]"]`);
        const value = (valueInput?.value || '').trim();
        if (!value) return null;

        const result: Record<string, JsonValue> = { type, value };
        // Optional label / advanced attrs Craft posts beside type+value.
        for (const key of [
            'label',
            'urlSuffix',
            'target',
            'title',
            'class',
            'id',
            'rel',
            'ariaLabel',
            'filename',
        ] as const) {
            const el = root.querySelector<HTMLInputElement>(
                `input[name*="[${key}]"], textarea[name*="[${key}]"]`,
            );
            if (!el || el.disabled || !isPostedFieldName(el.name)) continue;
            if ((el.type === 'checkbox' || el.type === 'radio') && !el.checked) continue;
            const extra = el.value.trim();
            if (extra === '' || extra === '0') continue;
            result[key] = extra;
        }
        const download = root.querySelector<HTMLInputElement>('input[name*="[download]"]');
        if (download && !download.disabled && (download.checked || download.value === '1')) {
            result.download = true;
        }
        return result;
    },
    bind: bindInputs,
};

/**
 * Default transport for Craft/third-party fields without a typed adapter.
 * Reads named controls under the field wrapper as bracket-notation form data
 * (same shape Craft posts), then unwraps the single-field namespace prefix.
 */
const generic: FieldTransportAdapter = {
    read: (root) => readGenericFieldValue(root),
    bind: bindInputs,
};

/**
 * Craft ElementSelect with `name: null` stringifies to the attribute `name="null"`.
 * Those are ElementSelect chrome, not posted field values — never fold them into
 * a bracket tree (they block unwrap and poison Link / similar fields).
 */
function isPostedFieldName(name: string): boolean {
    return name !== '' && name !== 'null';
}

/** @internal exported for unit tests */
export function readGenericFieldValue(root: HTMLElement): JsonValue {
    const entries: Array<{ name: string; value: string }> = [];

    for (const el of root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
        'input[name], textarea[name], select[name]',
    )) {
        if (el.disabled) continue;
        if (!isPostedFieldName(el.name)) continue;

        if (el instanceof HTMLInputElement) {
            const type = el.type;
            if (
                type === 'button'
                || type === 'submit'
                || type === 'reset'
                || type === 'image'
                || type === 'file'
            ) {
                continue;
            }
            if ((type === 'checkbox' || type === 'radio') && !el.checked) {
                continue;
            }
        }

        if (el instanceof HTMLSelectElement && el.multiple) {
            for (const option of el.selectedOptions) {
                entries.push({ name: el.name, value: option.value });
            }
            continue;
        }

        entries.push({ name: el.name, value: el.value });
    }

    if (!entries.length) return null;

    const tree = buildBracketTree(entries);
    return unwrapSingleFieldValue(tree, entries[0]!.name);
}

function buildBracketTree(entries: Array<{ name: string; value: string }>): JsonValue {
    const root: Record<string, unknown> = {};

    for (const { name, value } of entries) {
        const path = parseBracketPath(name);
        if (!path.length) continue;
        assignPath(root, path, value);
    }

    return root as JsonValue;
}

function parseBracketPath(name: string): string[] {
    // fields[handle][date] → ['fields','handle','date']; handle[] → ['handle','']
    const path: string[] = [];
    const re = /([^[\]]+)|\[([^\]]*)\]/g;
    let match: RegExpExecArray | null;
    while ((match = re.exec(name)) !== null) {
        path.push(match[1] ?? match[2] ?? '');
    }
    return path;
}

function assignPath(target: Record<string, unknown>, path: string[], value: string): void {
    let cursor: unknown = target;
    for (let i = 0; i < path.length; i++) {
        const key = path[i]!;
        const last = i === path.length - 1;
        const nextKey = path[i + 1];
        const asArrayIndex = key === '' || /^\d+$/.test(key);

        if (last) {
            if (Array.isArray(cursor)) {
                if (key === '') {
                    cursor.push(value);
                } else {
                    cursor[Number(key)] = value;
                }
                return;
            }
            if (!cursor || typeof cursor !== 'object') return;
            const object = cursor as Record<string, unknown>;
            // Match PHP application/x-www-form-urlencoded: duplicate names last-win.
            // Arrays only come from explicit [] segments (empty path keys → array
            // parents that push above). Craft Date+Time posts locale twice (date.twig
            // + time.twig); promoting to string[] crashed getLocaleById on save.
            object[key] = value;
            return;
        }

        if (Array.isArray(cursor)) {
            const index = key === '' ? cursor.length : Number(key);
            if (cursor[index] == null) {
                cursor[index] = nextKey === '' || (nextKey !== undefined && /^\d+$/.test(nextKey))
                    ? []
                    : {};
            }
            cursor = cursor[index];
            continue;
        }

        if (!cursor || typeof cursor !== 'object') return;
        const object = cursor as Record<string, unknown>;
        if (object[key] == null) {
            // Next segment empty or numeric → array; otherwise object.
            object[key] = nextKey === '' || (nextKey !== undefined && /^\d+$/.test(nextKey))
                ? []
                : {};
        }
        // Promote scalar clash to object/array if Craft posts nested keys later.
        if (typeof object[key] !== 'object' || object[key] === null) {
            object[key] = asArrayIndex ? [] : {};
        }
        cursor = object[key];
    }
}

/**
 * Remove only the known form namespace and field handle. The field value
 * itself may contain singleton objects, which must retain their keys.
 */
function unwrapSingleFieldValue(value: JsonValue, inputName: string): JsonValue {
    const path = parseBracketPath(inputName);
    // FieldLayoutForms wraps Craft's fields[handle] in its own Vizy namespace.
    const depth = path[0] === 'vizyHost' && path[3] === 'fields' && path[4] === 'fields'
        ? 6
        : path[0] === 'fields' ? 2 : 1;
    let current: unknown = value;
    for (const key of path.slice(0, depth)) {
        if (!current || typeof current !== 'object') return null;
        current = (current as Record<string, unknown>)[key];
    }
    return (current ?? null) as JsonValue;
}

const adapters = new Map<string, FieldTransportAdapter>([
    ['craft.plainText', plainText],
    ['craft.lightswitch', lightswitch],
    ['craft.json', jsonField],
    ['craft.link', linkField],
    ['craft.entries', relations],
    ['craft.categories', relations],
    ['craft.tags', relations],
    ['craft.users', relations],
    ['craft.assets', relations],
    ['craft.generic', generic],
    // Matrix-in-Block grandfather — Craft 5 posts {entries, sortOrder}; PHP
    // DocumentSerializer syncs onto MatrixAnchor and strips the blob.
    ['craft.matrix', generic],
    // Hosted Vizy Editor — fragment object in parent Block fieldSlots.
    // Parent `#bindHost` reads adapters while the nested TipTap may still be
    // booting (bootstrap JS just ran). Never call flush until `.editor` exists.
    ['vizy.hosted', {
        read(root) {
            const input = root.querySelector<HTMLInputElement>('input[data-vizy-document]');
            const empty = { type: 'doc', attrs: { schemaVersion: 2 }, content: [] };
            const fromInput = (): JsonValue => {
                if (!input?.value) return empty;
                try {
                    return JSON.parse(input.value) as JsonValue;
                } catch {
                    throw new Error('hostedVizyDocumentInvalid');
                }
            };

            const editor = root.querySelector('vizy-editor') as HTMLElement & {
                editor?: unknown;
                flush?: (reason: string) => string;
            } | null;
            if (!editor?.editor || typeof editor.flush !== 'function') {
                return fromInput();
            }
            try {
                return JSON.parse(editor.flush('serialize')) as JsonValue;
            } catch {
                // Nested still mid-init, or projection failed — stay value-neutral.
                return fromInput();
            }
        },
        bind(root, changed) {
            const editor = root.querySelector('vizy-editor');
            if (!editor) return () => {};
            const onInput = () => changed();
            // Hosted editors publish via the same input/change bubbles as root
            // after #publishDocumentToInput — listen on the host wrapper.
            editor.addEventListener('input', onInput);
            editor.addEventListener('change', onInput);
            return () => {
                editor.removeEventListener('input', onInput);
                editor.removeEventListener('change', onInput);
            };
        },
    }],
]);

export function getFieldAdapter(adapterId: string): FieldTransportAdapter {
    const adapter = adapters.get(adapterId) ?? adapters.get('craft.generic');
    if (!adapter) throw new Error(`unsupportedFieldAdapter:${adapterId}`);
    return adapter;
}
