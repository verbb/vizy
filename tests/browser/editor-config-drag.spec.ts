import { expect, test, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve(import.meta.dirname, '../../src/web/assets/field/dist');
const manifest = JSON.parse(fs.readFileSync(path.join(dist, 'manifest.json'), 'utf8'));
const entry = manifest['editorconfigsettings/src/ts/editor-config-settings.ts'];
const origin = 'https://builder.test';
const initial = {
    config: { capabilities: { nodes: [], marks: ['bold', 'italic'] }, headings: { levels: [] }, toolbar: ['bold', 'separator', 'italic'], bubble: { enabled: false, items: [] } },
    toolbarCatalog: [
        { id: 'bold', label: 'Bold', kind: 'mark', group: 'formatting', icon: null },
        { id: 'italic', label: 'Italic', kind: 'mark', group: 'formatting', icon: null },
        { id: 'separator', label: 'Separator', kind: 'presentation', group: 'layout', icon: null },
    ],
    dropdownCatalog: [], capabilityCatalog: { nodes: [], marks: [], headingAvailable: false },
};
async function mount(page: Page) {
    await page.route(`${origin}/**`, async (route) => {
        const url = new URL(route.request().url());
        if (url.pathname === '/') return route.fulfill({ contentType: 'text/html', body: `<!doctype html><html><head>${(entry.css ?? []).map((css: string) => `<link rel="stylesheet" href="/${css}">`).join('')}<style>body { margin:40px; }</style></head><body><form><vizy-editor-config-settings data-initial='${JSON.stringify(initial)}'><div data-vizy-config-host></div><div data-vizy-config-sync></div></vizy-editor-config-settings></form><script type="module" src="/${entry.file}"></script></body></html>` });
        return route.fulfill({ path: path.join(dist, 'assets', path.basename(url.pathname)) });
    });
    await page.goto(origin);
    await expect(page.locator('[data-builder-list="toolbar-active"] [data-toolbar-item]')).toHaveCount(3);
}
const active = '[data-builder-list="toolbar-active"] [data-toolbar-item]';
const order = (page: Page) => page.locator(active).evaluateAll((items) => items.map((item) => (item as HTMLElement).dataset.toolbarItem));

test('pointer reorder preserves the grabbed button geometry and posts exactly one moved item', async ({ page }) => {
    await mount(page);
    const source = page.locator(active).nth(2);
    const first = (await page.locator(active).first().boundingBox())!;
    const box = (await source.boundingBox())!;
    const grab = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    await page.mouse.move(grab.x, grab.y);
    await page.mouse.down();
    await page.mouse.move(grab.x - 12, grab.y, { steps: 5 });
    const overlay = page.locator('.is-drag-helper');
    await expect(overlay).toBeVisible();
    const carried = (await overlay.boundingBox())!;
    expect(Math.abs(carried.width - box.width)).toBeLessThan(2);
    expect(Math.abs(carried.height - box.height)).toBeLessThan(2);
    const offset = carried.x - (grab.x - 12);
    expect(offset).toBeGreaterThan(0);
    await page.mouse.move(grab.x - 24, grab.y, { steps: 5 });
    await expect.poll(async () => Math.abs((await overlay.boundingBox())!.x - (grab.x - 24) - offset)).toBeLessThan(3);
    await page.mouse.move(first.x + 2, first.y + first.height / 2, { steps: 15 });
    await page.mouse.up();
    await expect.poll(() => order(page)).toEqual(['italic', 'bold', 'separator']);
    await expect(overlay).toHaveCount(0);
    // A drag-ending click must not add/remove a second item.
    await expect(page.locator(active)).toHaveCount(3);
    const posted = await page.locator('input[name="toolbarJson"]').inputValue();
    expect(JSON.parse(posted)).toEqual(['italic', 'bold', 'separator']);
});
