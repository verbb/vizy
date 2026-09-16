import { expect, test, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Drag behaviour for the block type configurator.
 *
 * These run in a real browser because the things that break here are not
 * reachable from happy-dom: dnd-kit's collision detection needs layout, and the
 * two regressions this file exists for were both geometry problems — a drop
 * animation fighting the post-drop rebuild, and an empty group that could not be
 * dropped into.
 *
 * The page is served through route interception rather than a dev server, so the
 * suite stays self-contained. Requires `npm run build` first.
 */

const root = path.resolve(import.meta.dirname, '../..');
const dist = path.join(root, 'src/web/assets/field/dist');
const manifest = JSON.parse(fs.readFileSync(path.join(dist, 'manifest.json'), 'utf8'));
const entry = manifest['fieldsettings/src/ts/field-settings.ts'];

const ORIGIN = 'http://vizy.test';

const A = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const B = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
const C = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';

const summary = (uid: string, name: string) => ({
    uid, name, handle: name.toLowerCase(), icon: null, iconSvg: null, color: null, template: null,
});

/** Group one holds all three types; group two starts empty on purpose. */
const initialState = {
    groups: [
        { id: 'group-1', name: 'Content', blockTypeUids: [A, B, C], disabledBlockTypeUids: [] },
        { id: 'group-2', name: 'Layout', blockTypeUids: [], disabledBlockTypeUids: [] },
    ],
    blockTypes: { [A]: summary(A, 'Alpha'), [B]: summary(B, 'Beta'), [C]: summary(C, 'Gamma') },
    availableBlockTypes: [summary(A, 'Alpha'), summary(B, 'Beta'), summary(C, 'Gamma')],
};

const MIME: Record<string, string> = {
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
};

async function mount(page: Page): Promise<void> {
    await page.setViewportSize({ width: 1280, height: 2400 });

    await page.route(`${ORIGIN}/**`, async (route) => {
        const url = new URL(route.request().url());

        if (url.pathname === '/') {
            await route.fulfill({
                contentType: 'text/html',
                body: `<!doctype html><html><head>
                    <link rel="stylesheet" href="/${entry.css[0]}">
                    <style>
                        body { background: #fff; margin: 40px; }
                        /* Keep rows compact if shared Plugin Kit tokens are absent in this harness. */
                        .vizy-block-row { min-height: 0; }
                        .vizy-block-row-grip pk-icon, .vizy-block-row pk-icon { width: 16px; height: 16px; }
                    </style>
                    </head><body>
                    <form><vizy-field-settings data-initial='${JSON.stringify(initialState)}'></vizy-field-settings></form>
                    <script type="module" src="/${entry.file}"></script>
                    </body></html>`,
            });
            return;
        }

        const file = path.join(dist, url.pathname);

        if (!file.startsWith(dist) || !fs.existsSync(file)) {
            await route.fulfill({ status: 404, body: '' });
            return;
        }

        await route.fulfill({
            contentType: MIME[path.extname(file)] ?? 'application/octet-stream',
            body: fs.readFileSync(file),
        });
    });

    await page.goto(`${ORIGIN}/`);
    await page.waitForSelector('[data-block-row] [data-drag-handle]');
    // Let Plugin Kit's components finish their first update before measuring.
    await page.waitForFunction(() => !!document.querySelector('pk-lightswitch')?.shadowRoot);
}

/** Row order per group, reduced to first letters for readable assertions. */
async function order(page: Page, groupId: string): Promise<string[]> {
    return page.evaluate((id) => [...document.querySelectorAll(`[data-group-list="${id}"] [data-block-row]`)]
        .filter((row) => !row.hasAttribute('data-dnd-placeholder'))
        .map((row) => (row as HTMLElement).dataset.blockRow!.slice(0, 1)), groupId);
}

/** `groupIndex:uid` pairs as the surrounding Craft form would receive them. */
async function posted(page: Page): Promise<string[]> {
    return page.evaluate(() => [...document.querySelectorAll<HTMLInputElement>('input[type="hidden"]')]
        .filter((input) => input.name.includes('blockTypeUids'))
        .map((input) => `${input.name.match(/\[(\d+)\]/)?.[1]}:${input.value.slice(0, 1)}`));
}

async function dragHandleTo(page: Page, handleIndex: number, targetY: number): Promise<void> {
    const handle = page.locator('[data-block-row] [data-drag-handle]').nth(handleIndex);
    const box = (await handle.boundingBox())!;

    const x = box.x + box.width / 2;

    await page.mouse.move(x, box.y + box.height / 2);
    await page.mouse.down();

    // WebKit's pointer emulation needs the press to settle before it will treat
    // subsequent moves as a drag, and it drops collision updates if the travel
    // arrives as one large jump. Hence the pause and the staged approach.
    await page.waitForTimeout(60);
    await page.mouse.move(x, box.y + (targetY > box.y ? 20 : -20), { steps: 10 });
    await page.waitForTimeout(60);
    await page.mouse.move(x, targetY, { steps: 30 });
    await page.waitForTimeout(120);
}

test.describe('block type configurator drag', () => {
    test('reorders within a group, and the row lands where it was dropped', async ({ page }) => {
        await mount(page);

        const rows = await page.locator('[data-block-row]').all();
        const first = (await rows[0].boundingBox())!;

        // Drag Gamma above Alpha.
        await dragHandleTo(page, 2, first.y - 10);

        const beforeDrop = await order(page, 'group-1');
        await page.mouse.up();

        // Sampled immediately: the row must already be at its final position.
        // A drop animation running against the rebuilt list previously flung it
        // to the top of the viewport and eased it back.
        const atDrop = await page.evaluate(() => [...document.querySelectorAll('[data-group-list="group-1"] [data-block-row]')]
            .map((row) => Math.round(row.getBoundingClientRect().y)));

        await page.waitForTimeout(500);

        const settledTops = await page.evaluate(() => [...document.querySelectorAll('[data-group-list="group-1"] [data-block-row]')]
            .map((row) => Math.round(row.getBoundingClientRect().y)));

        expect(beforeDrop).toContain('c');
        expect(await order(page, 'group-1')).toEqual(['c', 'a', 'b']);
        expect(atDrop).toEqual(settledTops);
        expect(await posted(page)).toEqual(['0:c', '0:a', '0:b']);
    });

    test('moves a row into a group that has been emptied', async ({ page }) => {
        await mount(page);

        const target = (await page.locator('[data-group-list="group-2"]').boundingBox())!;
        await dragHandleTo(page, 0, target.y + target.height / 2);
        await page.mouse.up();
        await page.waitForTimeout(500);

        expect(await order(page, 'group-1')).toEqual(['b', 'c']);
        expect(await order(page, 'group-2')).toEqual(['a']);
        expect(await posted(page)).toEqual(['0:b', '0:c', '1:a']);
    });

    test('never lets the empty-group stand-in be dragged itself', async ({ page }) => {
        await mount(page);

        const placeholder = (await page.locator('[data-empty-placeholder]').boundingBox())!;

        await page.mouse.move(placeholder.x + placeholder.width / 2, placeholder.y + placeholder.height / 2);
        await page.mouse.down();
        await page.mouse.move(placeholder.x + placeholder.width / 2, placeholder.y - 120, { steps: 15 });
        await page.mouse.up();
        await page.waitForTimeout(400);

        expect(await order(page, 'group-1')).toEqual(['a', 'b', 'c']);
        expect(await order(page, 'group-2')).toEqual([]);
        expect(await page.locator('[data-empty-placeholder]').count()).toBe(1);
    });
});
