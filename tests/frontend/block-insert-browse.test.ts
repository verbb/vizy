import { afterEach, describe, expect, it } from 'vitest';
import {
    readBlockInsertView,
    writeBlockInsertView,
} from '../../src/web/assets/field/src/ts/insertion/insert-view-storage';
import { VizyInsertionListElement } from '../../src/web/assets/field/src/ts/components/VizyInsertionListElement';
import type { AvailableInsertion, InsertionContext } from '../../src/web/assets/field/src/ts/insertion/types';

const stubContext = { editorId: 'test', surface: 'inline' } as InsertionContext;

function blockEntry(id: string, previewImageUrl: string | null = null): AvailableInsertion {
    return {
        item: {
            id,
            kind: 'block',
            blockTypeUid: id,
            label: id,
            description: null,
            icon: { name: 'vizy-block-fallback', svg: null },
            previewImageUrl,
            group: 'Blocks',
            keywords: [],
            aliases: [],
            order: 0,
            surfaces: ['slash', 'inline', 'empty', 'browse', 'keyboard'],
            requiresInput: false,
        },
        context: stubContext,
        score: 1,
    };
}

afterEach(() => {
    localStorage.clear();
    document.querySelectorAll('vizy-insertion-list, pk-dialog').forEach((el) => el.remove());
});

describe('block insert view preference', () => {
    it('defaults to list and remembers grid per field handle', () => {
        expect(readBlockInsertView('body')).toBe('list');
        writeBlockInsertView('body', 'grid');
        expect(readBlockInsertView('body')).toBe('grid');
        expect(readBlockInsertView('sidebar')).toBe('list');
    });
});

describe('insertion list preview + view toggle', () => {
    it('shows a hover preview only when previewImageUrl is set', async () => {
        const list = new VizyInsertionListElement();
        list.items = [
            blockEntry('block:a', 'https://example.test/a.png'),
            blockEntry('block:b', null),
        ];
        list.filterable = true;
        list.setAttribute('data-open', '');
        document.body.append(list);
        await list.updateComplete;

        const buttons = list.shadowRoot!.querySelectorAll('button.option');
        expect(buttons.length).toBe(2);

        buttons[0].dispatchEvent(new Event('mouseenter'));
        await list.updateComplete;
        expect(list.shadowRoot!.querySelector('.hover-preview img')?.getAttribute('src'))
            .toBe('https://example.test/a.png');

        buttons[1].dispatchEvent(new Event('mouseenter'));
        await list.updateComplete;
        expect(list.shadowRoot!.querySelector('.hover-preview')).toBeNull();
    });

    it('emits vizy-insertion-view when grid is chosen', async () => {
        const list = new VizyInsertionListElement();
        list.items = [blockEntry('block:a')];
        list.showViewToggle = true;
        list.setAttribute('data-open', '');
        document.body.append(list);
        await list.updateComplete;

        const views: string[] = [];
        list.addEventListener('vizy-insertion-view', ((event: CustomEvent<{ view: string }>) => {
            views.push(event.detail.view);
        }) as EventListener);

        const group = list.shadowRoot!.querySelector('pk-toggle-group.view-toggle') as HTMLElement & {
            value: string[];
        };
        expect(group).toBeTruthy();
        group.dispatchEvent(new CustomEvent('pk-value-change', {
            bubbles: true,
            composed: true,
            detail: { value: ['grid'] },
        }));
        expect(views).toEqual(['grid']);
    });
});
