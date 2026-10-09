import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { applyCraftFieldHtml, prepareCraftFieldAssets } from '../../src/web/assets/field/src/ts/craft-field-html';

describe('applyCraftFieldHtml', () => {
    beforeEach(() => {
        const append = document.head.appendChild.bind(document.head);
        vi.spyOn(document.head, 'appendChild').mockImplementation((node) => {
            // Drive network completion explicitly instead of Happy DOM's disabled loader.
            if (node instanceof HTMLScriptElement) node.type = 'application/x-test';
            return append(node);
        });
        document.body.innerHTML = '';
        document.head.querySelectorAll('link[href="data:text/css,body%7B%7D"]').forEach((node) => node.remove());
    });

    afterEach(() => {
        vi.restoreAllMocks();
        document.body.innerHTML = '';
        document.head.querySelectorAll('link[href="data:text/css,body%7B%7D"]').forEach((node) => node.remove());
    });

    it('parses stylesheet links into document.head without duplicating hrefs', () => {
        applyCraftFieldHtml('<link rel="stylesheet" href="data:text/css,body%7B%7D">');
        applyCraftFieldHtml('<link rel="stylesheet" href="data:text/css,body%7B%7D">');
        expect(document.head.querySelectorAll('link[href="data:text/css,body%7B%7D"]')).toHaveLength(1);
    });

    it('appends non-script nodes to the body parent', () => {
        applyCraftFieldHtml('<div id="craft-extra">x</div>');
        expect(document.getElementById('craft-extra')?.textContent).toBe('x');
    });

    it('waits for dependencies in order and shares pending loads between field instances', async () => {
        const html = '<script src="/cold-core.js"></script><script src="/cold-mode.js"></script>';
        const first = prepareCraftFieldAssets(html);
        const second = prepareCraftFieldAssets(html);
        await new Promise((resolve) => setTimeout(resolve, 0));
        const core = document.head.querySelector<HTMLScriptElement>('script[src="/cold-core.js"]')!;
        expect(core.async).toBe(false);
        expect(document.head.querySelectorAll('script[src="/cold-core.js"]')).toHaveLength(1);
        expect(document.head.querySelector('script[src="/cold-mode.js"]')).toBeNull();
        core.dispatchEvent(new Event('load'));
        await new Promise((resolve) => setTimeout(resolve, 0));
        document.head.querySelector('script[src="/cold-mode.js"]')!.dispatchEvent(new Event('load'));
        await Promise.all([first, second]);
        applyCraftFieldHtml(html);
        expect(document.head.querySelectorAll('script[src="/cold-mode.js"]')).toHaveLength(1);
        expect(prepareCraftFieldAssets(html)).toBeNull();
    });

    it('allows retry after a dependency fails to load', async () => {
        const html = '<script src="/retry-dependency.js"></script><script src="/retry-mode.js"></script>';
        const first = prepareCraftFieldAssets(html)!;
        const rejected = expect(first).rejects.toThrow('fieldAssetLoadFailed');
        await new Promise((resolve) => setTimeout(resolve, 0));
        document.head.querySelector('script[src="/retry-dependency.js"]')!.dispatchEvent(new Event('error'));
        await rejected;
        expect(document.head.querySelector('script[src="/retry-mode.js"]')).toBeNull();
        await new Promise((resolve) => setTimeout(resolve, 0));
        const retry = prepareCraftFieldAssets(html);
        await new Promise((resolve) => setTimeout(resolve, 0));
        document.head.querySelector('script[src="/retry-dependency.js"]')!.dispatchEvent(new Event('load'));
        await new Promise((resolve) => setTimeout(resolve, 0));
        document.head.querySelector('script[src="/retry-mode.js"]')!.dispatchEvent(new Event('load'));
        await retry;
        expect(prepareCraftFieldAssets(html)).toBeNull();
    });
});
