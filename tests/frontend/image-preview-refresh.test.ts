import { afterEach, expect, it, vi } from 'vitest';
import { refreshImagePreview } from '../../src/web/assets/field/src/ts/semantic/image-apply';
import { bumpImagePreviewUrl, getImagePreview, rememberImagePreview } from '../../src/web/assets/field/src/ts/semantic/image-preview-cache';

afterEach(() => vi.unstubAllGlobals());

it('preserves provider query strings and fragments byte-for-byte', () => {
    const url = 'https://cdn.example.test/image.jpg?width=400&token=required%2fvalue#preview';
    rememberImagePreview('signed', { assetId: 1, url, label: 'Image', transform: '' });
    expect(bumpImagePreviewUrl('signed')).toBe(url);
});

it('cache-busts plain URLs before their fragment', () => {
    rememberImagePreview('plain', { assetId: 2, url: 'https://example.test/image.jpg#preview', label: 'Image', transform: '' });
    expect(bumpImagePreviewUrl('plain')).toMatch(/^https:\/\/example.test\/image.jpg\?v=\d+#preview$/);
});

it.each(['', 'small'])('fetches a fresh provider URL after editing a %s preview', async (transform) => {
    const url = 'https://cdn.example.test/image.jpg?token=new%2Fsignature&width=400';
    const request = vi.fn().mockResolvedValue({ data: { url } });
    vi.stubGlobal('Craft', { sendActionRequest: request });
    rememberImagePreview('refresh', { assetId: 3, url: 'https://cdn.example.test/image.jpg?token=old', label: 'Image', transform });
    expect(await refreshImagePreview('refresh')).toBe(url);
    expect(getImagePreview('refresh')?.url).toBe(url);
    expect(request).toHaveBeenCalledWith('POST', transform ? 'assets/generate-transform' : 'vizy/assets/info', {
        data: { assetId: 3, handle: transform },
    });
});

it('does not replace a newer cache record when refresh completes', async () => {
    let resolve!: (value: { data: { url: string } }) => void;
    vi.stubGlobal('Craft', { sendActionRequest: () => new Promise(done => { resolve = done; }) });
    const original = { assetId: 4, url: 'https://example.test/original.jpg', label: 'Image', transform: '' };
    rememberImagePreview('stale', original);
    const pending = refreshImagePreview('stale');
    rememberImagePreview('stale', { ...original, url: 'https://example.test/newer.jpg' });
    resolve({ data: { url: 'https://example.test/stale.jpg' } });
    expect(await pending).toBeNull();
    expect(getImagePreview('stale')?.url).toBe('https://example.test/newer.jpg');
});

it('repaints an existing editor image after its cached preview is refreshed', async () => {
    const { Editor } = await import('@tiptap/core');
    const { default: StarterKit } = await import('@tiptap/starter-kit');
    const { createSemanticImage } = await import('../../src/web/assets/field/src/ts/semantic/image');
    const assetUid = '12345678-1234-4234-8234-123456789012';
    rememberImagePreview(assetUid, { assetId: 7, url: 'https://example.test/old.jpg', label: 'Image', transform: '' });
    const editor = new Editor({ extensions: [StarterKit, createSemanticImage()], content: {
        type: 'doc', content: [{ type: 'image', attrs: { assetUid } }],
    } });
    try {
        vi.stubGlobal('Craft', { sendActionRequest: vi.fn().mockResolvedValue({ data: { url: 'https://example.test/new.jpg?signature=valid' } }) });
        expect(editor.view.dom.querySelector('img')?.getAttribute('src')).toBe('https://example.test/old.jpg');
        const canonical = editor.getJSON();
        await refreshImagePreview(assetUid);
        expect(editor.view.dom.querySelector('img')?.getAttribute('src')).toBe('https://example.test/new.jpg?signature=valid');
        expect(editor.getJSON()).toEqual(canonical);
        const figure = editor.view.dom.querySelector('figure')!;
        editor.commands.setNodeSelection(0);
        editor.commands.deleteSelection();
        rememberImagePreview(assetUid, { assetId: 7, url: 'https://example.test/removed.jpg', label: 'Image', transform: '' });
        expect(figure.querySelector('img')?.getAttribute('src')).toBe('https://example.test/new.jpg?signature=valid');
    } finally { editor.destroy(); }
});
