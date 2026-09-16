import { describe, expect, it } from 'vitest';
import { FieldHostRegistry } from '../../src/web/assets/field/src/ts/registries';
import {
    selectLayoutTab,
    stampLayoutTabIndexes,
} from '../../src/web/assets/field/src/ts/layout-tabs';

const BLOCK = 'block-uid';

function field(handle: string): string {
    return `<div class="field" id="${handle}-field">${handle}</div>`;
}

function tab(inner: string, extraClass = ''): string {
    return `<div class="flex-fields${extraClass ? ` ${extraClass}` : ''}" data-layout-tab="tab">${inner}</div>`;
}

describe('layout tabs', () => {
    it('stamps pane indexes on Craft FieldLayout panes', () => {
        const hosts = new FieldHostRegistry();
        const record = hosts.acquire(BLOCK, 'type-a', 'layout-uid', 'layout-hash');
        record.root.innerHTML = [
            tab(field('plain')),
            tab(field('plain2'), 'hidden'),
        ].join('');

        expect(stampLayoutTabIndexes(record.root)).toBe(2);
        const panes = [...record.root.querySelectorAll(':scope > .flex-fields')];
        expect((panes[0] as HTMLElement).dataset.vizyLayoutTabIndex).toBe('0');
        expect((panes[1] as HTMLElement).dataset.vizyLayoutTabIndex).toBe('1');
    });

    it('toggles Craft panes for the active layout tab', () => {
        const hosts = new FieldHostRegistry();
        const record = hosts.acquire(BLOCK, 'type-a', 'layout-uid', 'layout-hash');
        record.root.innerHTML = [
            tab(field('plain')),
            tab(field('plain2'), 'hidden'),
        ].join('');
        stampLayoutTabIndexes(record.root);

        selectLayoutTab(record, 1);
        const panes = [...record.root.querySelectorAll(':scope > .flex-fields')];
        expect(panes[0]?.classList.contains('hidden')).toBe(true);
        expect(panes[1]?.classList.contains('hidden')).toBe(false);

        selectLayoutTab(record, 0);
        expect(panes[0]?.classList.contains('hidden')).toBe(false);
        expect(panes[1]?.classList.contains('hidden')).toBe(true);
    });
});
