import { afterEach, expect, it, vi } from 'vitest';
import type { Editor } from '@tiptap/core';
import { ensurePkDialog } from '../../src/web/assets/field/src/ts/pk-dialog';
import { VizyImageDialogElement } from '../../src/web/assets/field/src/ts/semantic/image-dialog';
import type { ImageDialogSeed } from '../../src/web/assets/field/src/ts/semantic/image-apply';
import { installElementInternalsShim } from './support/element-internals';

installElementInternalsShim();

const mounted: VizyImageDialogElement[] = [];
afterEach(() => {
    mounted.splice(0).forEach(element => element.remove());
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

function seed(assetId = 1): ImageDialogSeed {
    return {
        assetUid: `asset-${assetId}`, assetId, previewUrl: `https://example.test/${assetId}.jpg`,
        alt: '', title: '', linkUrl: '', openInNewTab: false,
        size: 'default', transform: '', updating: true,
    };
}

async function mountDialog() {
    await ensurePkDialog();
    const element = new VizyImageDialogElement();
    mounted.push(element);
    document.body.append(element);
    await element.updateComplete;
    vi.spyOn(element.dialog!, 'show').mockResolvedValue();
    await element.openForEditor({} as Editor, seed(), { transforms: [{ handle: 'small', name: 'Small' }, { handle: 'large', name: 'Large' }] });
    return element;
}

function requestQueue() {
    const pending: Array<(value: { data: { url: string } }) => void> = [];
    vi.stubGlobal('Craft', {
        sendActionRequest: vi.fn(() => new Promise(resolve => pending.push(resolve))),
    });
    return pending;
}

function selectTransform(element: VizyImageDialogElement, value: string) {
    element.transformSelect!.value = value;
    element.transformSelect!.dispatchEvent(new CustomEvent('pk-change'));
}

it('ignores an older transform response after selecting a newer transform', async () => {
    const pending = requestQueue();
    const element = await mountDialog();
    selectTransform(element, 'small');
    selectTransform(element, 'large');
    expect(pending).toHaveLength(2);
    pending[1]({ data: { url: 'https://example.test/large.jpg' } });
    await vi.waitFor(() => expect(element.previewImg?.src).toBe('https://example.test/large.jpg'));
    pending[0]({ data: { url: 'https://example.test/small.jpg' } });
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(element.previewImg?.src).toBe('https://example.test/large.jpg');
});

it('ignores a transform response belonging to a previously opened image', async () => {
    const pending = requestQueue();
    const element = await mountDialog();
    selectTransform(element, 'small');
    expect(pending).toHaveLength(1);
    element.dialog!.dispatchEvent(new CustomEvent('pk-after-hide'));
    await element.openForEditor({} as Editor, seed(2));
    pending[0]({ data: { url: 'https://example.test/old-image.jpg' } });
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(element.previewImg?.src).toBe('https://example.test/2.jpg');
});

it.each(['', 'small'])('resolves the original URL when clearing an initial %s transform', async (initialTransform) => {
    const pending = requestQueue();
    const element = await mountDialog();
    await element.openForEditor({} as Editor, {
        ...seed(), transform: initialTransform, previewUrl: 'https://example.test/initial.jpg',
    });
    selectTransform(element, 'large');
    selectTransform(element, '');
    expect(window.Craft?.sendActionRequest).toHaveBeenLastCalledWith('POST', 'vizy/assets/info', {
        data: { assetId: 1, handle: '' },
    });
    pending[1]({ data: { url: 'https://example.test/original.jpg' } });
    await vi.waitFor(() => expect(element.previewImg?.src).toBe('https://example.test/original.jpg'));
    pending[0]({ data: { url: 'https://example.test/large.jpg' } });
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(element.previewImg?.src).toBe('https://example.test/original.jpg');
});
