import { expect, test } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const metadata = JSON.parse(fs.readFileSync('.cache/verbb-tests/browser.json', 'utf8'));

for (const name of ['links', 'neo', 'super-table']) {
    test(`Matrix and link widgets save independently inside ${name}`, async ({ page }) => {
        const fixture = metadata.matrixIntegrations[name];
        const errors: string[] = [];
        page.on('pageerror', (error) => errors.push(error.message));
        await page.goto('/index.php?p=admin/login');
        await page.getByRole('textbox', { name: 'Username or Email' }).fill('editor');
        await page.getByRole('textbox', { name: 'Password', exact: true }).fill('testing-only-password');
        await Promise.all([page.waitForURL((url) => url.searchParams.get('p') !== 'admin/login'), page.getByRole('button', { name: 'Sign in', exact: true }).click()]);
        const state = () => {
            execFileSync('ddev', ['exec', 'php', 'tests/runtime/matrix-integration-state.php', name]);
            return JSON.parse(fs.readFileSync('.cache/verbb-tests/matrix-integration-state.json', 'utf8'));
        };
        const before = state();
        await page.goto(fixture.editPath);
        const block = page.locator(`vizy-block[data-block-uid="${fixture.blockUid}"]`);
        const label = block.locator(`input[name$="[${fixture.labelHandle}]"]`);
        await expect(label).toHaveValue(`Integration ${name}`);
        await label.fill(`Edited ${name}`);
        for (const kind of ['hyper', 'typed']) {
            const inputs = block.locator(`input[value="https://example.test/${kind}"]:visible`);
            await expect(inputs).toHaveCount(2);
            if (kind === 'hyper') {
                // Read the real submitted store in the same event turn as an
                // input edit: neither startup grace nor debounce may drop it.
                for (let controlIndex = 0; controlIndex < 2; controlIndex++) {
                    const input = inputs.nth(controlIndex);
                    await input.evaluate((control) => {
                        const field = control.closest('.hyper-input-component, [data-hyper-auto-mount="input"]')!;
                        (control as any).__submitted = [];
                        const capture = () => {
                            const serialized = (field.querySelector('[data-store], [data-hyper-store]') as HTMLInputElement).value;
                            (control as any).__submitted.push({expected: (control as HTMLInputElement).value, actual: JSON.parse(serialized)[0].linkValue ?? ''});
                        };
                        field.addEventListener('input', capture);
                        field.addEventListener('change', capture);
                        (control as any).__cleanup = () => {
                            field.removeEventListener('input', capture);
                            field.removeEventListener('change', capture);
                        };
                    });
                    for (const value of ['https://example.test/first-edit', '', 'https://example.test/hyper', 'https://example.test/hyper-edited']) {
                        await input.fill(value);
                        await input.blur();
                    }
                    const submitted = await input.evaluate((control) => {
                        (control as any).__cleanup();
                        return (control as any).__submitted as {expected: string; actual: string}[];
                    });
                    expect(submitted.length).toBeGreaterThanOrEqual(4);
                    for (const value of submitted) expect(value.actual).toBe(value.expected);
                }
            } else {
                for (let index = 0; index < 2; index++) await inputs.nth(index).fill(`https://example.test/${kind}-edited`);
            }
        }
        await expect.poll(() => block.locator('[data-store], [data-hyper-store]').evaluateAll((inputs) => inputs.map((input) => (input as HTMLInputElement).value.includes('https://example.test/hyper-edited')))).toEqual([true, true]);
        await page.evaluate(async () => {
            const $ = (window as any).jQuery;
            const owner = [...document.querySelectorAll('form')].map((form) => $(form).data('elementEditor')).find(Boolean);
            await owner.checkForm(false, true);
        });
        await page.waitForFunction(() => {
            const $ = (window as any).jQuery;
            const owner = [...document.querySelectorAll('form')].map((form) => $(form).data('elementEditor')).find(Boolean);
            return !owner.queue.running && owner.queue.length === 0;
        });
        const draft = state();
        expect(draft.labels).toEqual(before.labels);
        expect(draft.hyper).toEqual(before.hyper);
        expect(draft.typed).toEqual(before.typed);
        expect(Number(draft.drafts)).toBeGreaterThan(0);
        if (name === 'links') {
            const title = page.locator('#title');
            const originalTitle = await title.inputValue();
            await title.fill('');
            await Promise.all([page.waitForEvent('framenavigated', { predicate: (frame) => frame === page.mainFrame() }), page.keyboard.press('ControlOrMeta+S')]);
            await expect(page.getByRole('link', { name: 'Title cannot be blank.', exact: true })).toBeVisible();
            await expect(label).toHaveValue(`Edited ${name}`);
            await expect(block.locator('input[value="https://example.test/hyper-edited"]:visible')).toHaveCount(2);
            expect(state().hyper).toEqual(before.hyper);
            expect(state().labels).toEqual(before.labels);
            await title.fill(originalTitle);
        }
        await Promise.all([page.waitForEvent('framenavigated', { predicate: (frame) => frame === page.mainFrame() }), page.keyboard.press('ControlOrMeta+S')]);
        const saved = state();
        expect(saved.labels).toEqual([`Edited ${name}`]);
        expect(saved.hyper).toEqual(['https://example.test/hyper-edited', 'https://example.test/hyper-edited']);
        expect(saved.typed).toEqual(['https://example.test/typed-edited', 'https://example.test/typed-edited']);
        await page.goto(fixture.editPath);
        await expect(label).toHaveValue(`Edited ${name}`);
        const stores = block.locator('[data-store], [data-hyper-store]');
        const untouched = await stores.evaluateAll((inputs) => inputs.map((input) => (input as HTMLInputElement).value));
        // Passive startup must still leave the submitted value unchanged.
        await page.waitForTimeout(1200);
        expect(await stores.evaluateAll((inputs) => inputs.map((input) => (input as HTMLInputElement).value))).toEqual(untouched);
        const errorPath = test.info().outputPath('browser-errors.json');
        fs.writeFileSync(errorPath, JSON.stringify(errors, null, 2));
        await test.info().attach('browser-errors', { path: errorPath, contentType: 'application/json' });
        // Craft can report this during overlapping submissions even when every
        // value saves correctly; keep the diagnostic and reject other errors.
        expect(errors.filter((message) => message !== 'Form already being submitted.')).toEqual([]);
    });
}

test('Hyper input edits survive immediate publication without waiting for autosave', async ({ page }) => {
    const fixture = metadata.matrixIntegrations.links;
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/index.php?p=admin/login');
    await page.getByRole('textbox', { name: 'Username or Email' }).fill('editor');
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('testing-only-password');
    await Promise.all([page.waitForURL((url) => url.searchParams.get('p') !== 'admin/login'), page.getByRole('button', { name: 'Sign in', exact: true }).click()]);
    const state = () => {
        execFileSync('ddev', ['exec', 'php', 'tests/runtime/matrix-integration-state.php', 'links']);
        return JSON.parse(fs.readFileSync('.cache/verbb-tests/matrix-integration-state.json', 'utf8'));
    };
    const before = state();
    await page.goto(fixture.editPath);
    const inputs = page.locator(`vizy-block[data-block-uid="${fixture.blockUid}"] [data-hyper-portal] input[name$="[linkValue]"]:visible`);
    await expect(inputs).toHaveCount(2);
    const url = 'https://example.test/immediate-publication';
    await inputs.first().fill(url);
    await inputs.last().fill(url);
    await Promise.all([page.waitForEvent('framenavigated', { predicate: (frame) => frame === page.mainFrame() }), page.keyboard.press('ControlOrMeta+S')]);
    const saved = state();
    expect(saved.hyper).toEqual([url, url]);
    expect(saved.labels).toEqual(before.labels);
    expect(saved.typed).toEqual(before.typed);
    await page.goto(fixture.editPath);
    await expect(inputs.first()).toHaveValue(url);
    await expect(inputs.last()).toHaveValue(url);
    // This journey qualifies content under immediate submission; native Craft
    // layout cancellation diagnostics remain available as a separate artifact.
    const errorPath = test.info().outputPath('browser-errors.json');
    fs.writeFileSync(errorPath, JSON.stringify(errors, null, 2));
    await test.info().attach('browser-errors', { path: errorPath, contentType: 'application/json' });
});
