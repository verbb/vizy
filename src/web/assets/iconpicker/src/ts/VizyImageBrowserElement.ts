import '@verbb/plugin-kit-web/components/image-browser';
import type {
    PkImageBrowser,
    PkImageBrowserGroup,
    PkImageBrowserItem,
} from '@verbb/plugin-kit-web/components/image-browser/pk-image-browser.js';

/**
 * Icon catalog payload from `vizy/icons/index` — `svg` becomes PK `preview`.
 */
type IconApiGroup = {
    name: string;
    icons: Array<{ label: string; value: string; svg: string }>;
};

/**
 * Flat preview-image rows from `vizy/block-previews/index` — `url` becomes PK `preview`.
 */
type PreviewApiItem = {
    label: string;
    value: string;
    url: string;
};

type PreviewApiGroup = {
    name: string;
    items: PkImageBrowserItem[];
};

/**
 * Font Awesome is ~1.7 MB across ~2,000 icons — fetch once per page URL and share
 * across every `vizy-image-browser` (and anything that only needs `loadIconSvg`).
 */
const catalogByUrl = new Map<string, Promise<PkImageBrowserGroup[]>>();

function t(message: string, params: Record<string, string | number> = {}): string {
    const globals = window as typeof window & {
        Craft?: { t: (cat: string, msg: string, params?: Record<string, unknown>) => string };
    };
    const translated = globals.Craft?.t('vizy', message, params);
    if (translated !== undefined) {
        return translated;
    }

    return Object.entries(params).reduce(
        (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
        message,
    );
}

function isIconApiGroups(payload: unknown): payload is IconApiGroup[] {
    if (!Array.isArray(payload) || payload.length === 0) {
        return false;
    }

    const first = payload[0] as Record<string, unknown>;
    return Array.isArray(first?.icons);
}

function isPreviewApiGroups(payload: unknown): payload is PreviewApiGroup[] {
    if (!Array.isArray(payload) || payload.length === 0) {
        return false;
    }

    const first = payload[0] as Record<string, unknown>;
    return Array.isArray(first?.items) && typeof first?.name === 'string';
}

function mapIconGroups(groups: IconApiGroup[]): PkImageBrowserGroup[] {
    return groups.map((group) => ({
        name: group.name,
        items: group.icons.map((icon) => ({
            label: icon.label,
            value: icon.value,
            preview: icon.svg,
        })),
    }));
}

function mapPreviewItems(items: PreviewApiItem[]): PkImageBrowserItem[] {
    return items.map((item) => ({
        label: item.label,
        value: item.value,
        preview: item.url,
    }));
}

function normalizeCatalog(payload: unknown): PkImageBrowserGroup[] {
    if (!Array.isArray(payload)) {
        return [];
    }

    if (payload.length === 0) {
        return [];
    }

    if (isIconApiGroups(payload)) {
        return mapIconGroups(payload);
    }

    if (isPreviewApiGroups(payload)) {
        return payload;
    }

    // Flat preview catalog from `block-previews/index` — one unnamed group.
    return [{ name: '', items: mapPreviewItems(payload as PreviewApiItem[]) }];
}

function loadCatalog(url: string): Promise<PkImageBrowserGroup[]> {
    const pending = catalogByUrl.get(url) ?? fetch(url, { headers: { Accept: 'application/json' } })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Catalog request failed: ${response.status}`);
            }
            return response.json() as Promise<unknown>;
        })
        .then(normalizeCatalog)
        .catch((error) => {
            catalogByUrl.delete(url);
            throw error;
        });

    catalogByUrl.set(url, pending);
    return pending;
}

/**
 * SVG for one catalog value — shares the icon catalog fetch with the picker.
 */
export async function loadIconSvg(url: string, value: string): Promise<string | null> {
    if (value === '') {
        return null;
    }

    for (const group of await loadCatalog(url)) {
        const found = group.items.find((item) => item.value === value);
        if (found?.preview && /^\s*<svg[\s>]/i.test(found.preview)) {
            return found.preview;
        }
    }

    return null;
}

type BrowserHost = HTMLElement & PkImageBrowser;

/**
 * Light-DOM bridge around `pk-image-browser` for Craft CP forms.
 *
 * Same serialize gap as `vizy-color-input`: Craft CpScreenSlideout uses jQuery
 * and skips form-associated custom elements, so a hidden input owns `name`.
 *
 * Catalog is host-owned (PK is presentational only). Icons load from
 * `data-catalog-url`; preview images may use that URL or inline `data-catalog`.
 */
class VizyImageBrowserElement extends HTMLElement {
    #wired = false;

    connectedCallback(): void {
        if (this.#wired) {
            return;
        }
        this.#wired = true;

        const name = this.getAttribute('name') ?? 'value';
        const value = this.getAttribute('value') ?? '';
        const id = this.id || 'image-browser';
        // PK renamed density → mode; label-mode defaults to tooltip (shared pk-tooltip).
        const mode = (this.getAttribute('mode') ?? 'icon') as 'icon' | 'image';
        const labelMode = (this.getAttribute('label-mode') ?? 'tooltip') as 'tooltip' | 'inline' | 'none';
        const ariaLabel = this.getAttribute('aria-label')
            ?? (mode === 'image' ? t('Preview Image') : t('Icon'));
        const placeholder = this.getAttribute('placeholder')
            ?? (mode === 'image' ? t('Choose a preview image') : t('Choose an icon'));
        const searchPlaceholder = this.getAttribute('search-placeholder')
            ?? (mode === 'image' ? t('Search images') : t('Search icons'));
        const emptyMessage = this.getAttribute('empty-message')
            ?? (mode === 'image' ? t('No images match your query.') : t('No icons match your query.'));
        const selectedLabel = this.getAttribute('data-selected-label') ?? '';
        const selectedPreview = this.getAttribute('data-selected-preview') ?? '';
        const catalogUrl = this.getAttribute('data-catalog-url') ?? '';
        const catalogJson = this.getAttribute('data-catalog');

        // Host must not also act as a named control once the hidden input exists.
        this.removeAttribute('name');

        const hidden = document.createElement('input');
        hidden.type = 'hidden';
        hidden.name = name;
        hidden.value = value;
        hidden.id = `${id}-value`;

        const browser = document.createElement('pk-image-browser') as BrowserHost;
        browser.id = id;
        browser.mode = mode;
        browser.labelMode = labelMode;
        browser.value = value;
        browser.placeholder = placeholder;
        browser.searchPlaceholder = searchPlaceholder;
        browser.emptyMessage = emptyMessage;
        browser.ariaLabel = ariaLabel;
        browser.withClear = true;
        if (selectedLabel !== '') {
            browser.selectedLabel = selectedLabel;
        }
        if (selectedPreview !== '') {
            browser.selectedPreview = selectedPreview;
        }

        const sync = (): void => {
            hidden.value = browser.value ?? '';
        };
        browser.addEventListener('pk-change', sync);
        browser.addEventListener('change', sync);
        browser.addEventListener('input', sync);

        this.append(hidden, browser);

        if (catalogJson) {
            try {
                browser.groups = normalizeCatalog(JSON.parse(catalogJson));
            } catch {
                browser.emptyMessage = t('Couldn’t load catalog.');
            }
            return;
        }

        if (catalogUrl === '') {
            return;
        }

        // Host-driven warm: PK shows a panel spinner while `loading` is set —
        // empty groups alone would look like a miss, not a fetch in flight.
        browser.loading = true;
        void loadCatalog(catalogUrl).then((groups) => {
            browser.groups = groups;
            browser.loading = false;
        }).catch(() => {
            browser.loading = false;
            browser.emptyMessage = mode === 'image'
                ? t('Couldn’t load images.')
                : t('Couldn’t load icons.');
        });
    }
}

if (!customElements.get('vizy-image-browser')) {
    customElements.define('vizy-image-browser', VizyImageBrowserElement);
}

export { VizyImageBrowserElement };

declare global {
    interface HTMLElementTagNameMap {
        'vizy-image-browser': VizyImageBrowserElement;
    }
}
