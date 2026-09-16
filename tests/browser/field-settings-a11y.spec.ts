import { expect, test, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Accessible names and tooltip suppression for the block type configurator.
 *
 * Controls here are named the way Craft names its own icon buttons — via
 * `aria-label` rather than `title` — so hovering does not pop a native tooltip
 * over the UI. This has to be asserted in a real browser because it depends on
 * accessible name computation, including names that come from an SVG `<title>`
 * inside a component's shadow root.
 *
 * Requires `npm run build` first.
 */

const root = path.resolve(import.meta.dirname, '../..');
const dist = path.join(root, 'src/web/assets/field/dist');
const manifest = JSON.parse(fs.readFileSync(path.join(dist, 'manifest.json'), 'utf8'));
const entry = manifest['fieldsettings/src/ts/field-settings.ts'];

const ORIGIN = 'http://vizy-a11y.test';
const A = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

const summary = { uid: A, name: 'Alpha', handle: 'alpha', icon: null, iconSvg: null, color: null, template: null };

const initialState = {
    groups: [{ id: 'group-1', name: 'Content', blockTypeUids: [A], disabledBlockTypeUids: [] }],
    blockTypes: { [A]: summary },
    availableBlockTypes: [summary],
};

const MIME: Record<string, string> = { '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };

async function mount(page: Page): Promise<void> {
    await page.route(`${ORIGIN}/**`, async (route) => {
        const url = new URL(route.request().url());

        if (url.pathname === '/') {
            await route.fulfill({
                contentType: 'text/html',
                body: `<!doctype html><html><head>
                    <link rel="stylesheet" href="/${entry.css[0]}">
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
    await page.waitForFunction(() => !!document.querySelector('pk-lightswitch')?.shadowRoot);
}

test.describe('block type configurator accessible names', () => {
    test('names every control without leaving a hoverable title behind', async ({ page }) => {
        await mount(page);

        // No title attributes anywhere in the configurator, light DOM or shadow.
        const titles = await page.evaluate(() => {
            const found: string[] = [];

            const walk = (node: Element | ShadowRoot) => {
                node.querySelectorAll('*').forEach((element) => {
                    if (element.hasAttribute?.('title')) {
                        found.push(`${element.tagName.toLowerCase()}[title="${element.getAttribute('title')}"]`);
                    }
                    if ((element as HTMLElement & { shadowRoot?: ShadowRoot }).shadowRoot) {
                        walk((element as HTMLElement & { shadowRoot: ShadowRoot }).shadowRoot);
                    }
                });
            };

            walk(document.querySelector('vizy-field-settings')!);

            return found;
        });

        expect(titles).toEqual([]);

        // Names survive, so the controls are still announceable.
        await expect(page.getByRole('button', { name: 'Edit block type' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Block type actions' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Group actions' })).toBeVisible();

        // The availability switch must be reachable by name, not merely carry an
        // aria-label on its host — that does not reach the control in its shadow
        // root, which is why this asserts the computed name rather than markup.
        const named = await page.getByRole('button', { name: 'Available in this field' }).count()
            + await page.getByRole('switch', { name: 'Available in this field' }).count()
            + await page.getByRole('checkbox', { name: 'Available in this field' }).count();

        expect(named).toBeGreaterThan(0);
    });

    test('hides the availability switch label without hiding it from assistive tech', async ({ page }) => {
        await mount(page);

        // Visually hidden, so the row is not cluttered by a label repeating what
        // the switch already conveys in context.
        const box = await page.evaluate(() => {
            const label = document.querySelector('pk-lightswitch')!.shadowRoot!
                .querySelector('[part~="label"]');
            if (!label) return null;
            const rect = label.getBoundingClientRect();
            return { w: Math.round(rect.width), h: Math.round(rect.height) };
        });

        expect(box).toEqual({ w: 1, h: 1 });
    });

    test('keeps the drag handle glyph out of hit testing so it cannot pop a tooltip', async ({ page }) => {
        await mount(page);

        // The grip owns the gesture; its glyph must not be the hover target, or the
        // SVG <title> that names it would surface as a native tooltip.
        const target = await page.evaluate(() => {
            const grip = document.querySelector('[data-drag-handle]')!;
            const rect = grip.getBoundingClientRect();
            const hit = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
            return hit?.closest('[data-drag-handle]') === grip;
        });

        expect(target).toBe(true);
    });
});
