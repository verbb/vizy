import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { installElementInternalsShim } from './support/element-internals';
import {
    loadIconSvg,
} from '../../src/web/assets/iconpicker/src/ts/VizyImageBrowserElement';

// pk-image-browser is form-associated — happy-dom needs ElementInternals.
installElementInternalsShim();

const CATALOG = [
    {
        name: 'Solid',
        icons: [
            { label: 'Star', value: 'fa:star', svg: '<svg></svg>' },
            { label: 'Heart', value: 'fa:heart', svg: '<svg id="heart"></svg>' },
        ],
    },
];

/**
 * Catalog requests are cached per URL for the life of the module — unique
 * endpoints keep cases from sharing a stale promise.
 */
let endpoint = 0;
const nextUrl = (): string => `/icons/${++endpoint}`;

const flush = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

function mount(url: string, value = '', extras: Record<string, string> = {}): HTMLElement {
    const element = document.createElement('vizy-image-browser');
    element.setAttribute('name', 'icon');
    element.setAttribute('value', value);
    element.setAttribute('mode', 'icon');
    element.setAttribute('data-catalog-url', url);
    for (const [key, val] of Object.entries(extras)) {
        element.setAttribute(key, val);
    }
    document.body.append(element);
    return element;
}

type PkBrowser = HTMLElement & {
    value: string;
    groups: Array<{ name: string; items: Array<{ value: string; label: string; preview?: string }> }>;
    mode: string;
    labelMode: string;
    loading: boolean;
    emptyMessage: string;
    selectedLabel: string;
    selectedPreview: string;
};

function pk(host: HTMLElement): PkBrowser {
    return host.querySelector('pk-image-browser') as PkBrowser;
}

describe('vizy image browser (icon mode)', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn(async () => ({
            ok: true,
            json: async () => CATALOG,
        })));
    });

    afterEach(() => {
        document.body.innerHTML = '';
        vi.unstubAllGlobals();
    });

    it('posts through a light-DOM hidden input for Craft slideout serialize', async () => {
        const host = mount(nextUrl());
        await flush();

        expect(host.querySelector('input[type="hidden"][name="icon"]')).not.toBeNull();
        // pk must not also own `name` or native FormData would double-post.
        expect(pk(host).getAttribute('name')).toBeNull();
        expect(host.getAttribute('name')).toBeNull();
    });

    it('maps the icon API catalog into pk-image-browser groups', async () => {
        const host = mount(nextUrl());
        await flush();

        expect(pk(host).groups).toHaveLength(1);
        expect(pk(host).groups[0]?.name).toBe('Solid');
        expect(pk(host).groups[0]?.items[0]).toMatchObject({
            value: 'fa:star',
            label: 'Star',
            preview: '<svg></svg>',
        });
    });

    it('syncs pk-change into the hidden input', async () => {
        const host = mount(nextUrl());
        await flush();

        const browser = pk(host);
        browser.value = 'fa:heart';
        browser.dispatchEvent(new CustomEvent('pk-change', {
            detail: { value: 'fa:heart' },
            bubbles: true,
        }));
        await flush();

        expect(host.querySelector<HTMLInputElement>('input[name="icon"]')?.value).toBe('fa:heart');
    });

    it('resolves one value to its drawing via the shared catalog fetch', async () => {
        const url = nextUrl();

        expect(await loadIconSvg(url, 'fa:star')).toBe('<svg></svg>');
        expect(await loadIconSvg(url, 'fa:missing')).toBeNull();
        expect(await loadIconSvg('/never-asked', '')).toBeNull();

        mount(url);
        await flush();
        expect(vi.mocked(fetch)).toHaveBeenCalledTimes(1);
    });

    it('sets loading while the catalog URL warms', async () => {
        let resolveJson!: (value: unknown) => void;
        const jsonReady = new Promise<void>((resolve) => {
            vi.stubGlobal('fetch', vi.fn(async () => ({
                ok: true,
                json: () => new Promise((settle) => {
                    resolveJson = settle;
                    resolve();
                }),
            })));
        });

        const host = mount(nextUrl());
        expect(pk(host).loading).toBe(true);

        await jsonReady;
        resolveJson(CATALOG);
        await flush();

        expect(pk(host).loading).toBe(false);
        expect(pk(host).groups).toHaveLength(1);
    });

    it('clears loading when the catalog request fails', async () => {
        vi.stubGlobal('fetch', vi.fn(async () => {
            throw new Error('network');
        }));

        const host = mount(nextUrl());
        expect(pk(host).loading).toBe(true);
        await flush();

        expect(pk(host).loading).toBe(false);
        expect(pk(host).emptyMessage).toContain('Couldn’t load');
    });

    it('keeps server-supplied selected label/preview on the closed trigger', () => {
        const host = mount(nextUrl(), 'apple-brands', {
            'data-selected-label': 'Apple',
            'data-selected-preview': '<svg id="apple"></svg>',
        });

        expect(pk(host).selectedLabel).toBe('Apple');
        expect(pk(host).selectedPreview).toContain('apple');
        expect(pk(host).value).toBe('apple-brands');
    });

    it('accepts an inline preview-image catalog without fetching', async () => {
        const host = document.createElement('vizy-image-browser');
        host.setAttribute('name', 'previewImage');
        host.setAttribute('mode', 'image');
        host.setAttribute('label-mode', 'tooltip');
        host.setAttribute('data-catalog', JSON.stringify([
            {
                name: 'Preview Images',
                items: [
                    { label: 'Hero', value: 'hero.png', preview: '/preview/hero.png' },
                ],
            },
        ]));
        document.body.append(host);
        await flush();

        expect(vi.mocked(fetch)).not.toHaveBeenCalled();
        expect(pk(host).loading).toBe(false);
        expect(pk(host).mode).toBe('image');
        expect(pk(host).labelMode).toBe('tooltip');
        expect(pk(host).groups[0]?.items[0]?.value).toBe('hero.png');
        expect(host.querySelector('input[name="previewImage"]')).not.toBeNull();
    });
});
