import { it, expect } from 'vitest';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { createSemanticLink } from '../../src/web/assets/field/src/ts/semantic/link';
import { applySemanticLinkToEditor, seedInsertLinkDialog, getSemanticLinkEditState, attrsFromUrlDialog } from '../../src/web/assets/field/src/ts/semantic/link-apply';
import { urlLinkAttrs, defaultLinkAttrs } from '../../src/web/assets/field/src/ts/semantic/attrs';
import { createSemanticImage } from '../../src/web/assets/field/src/ts/semantic/image';
import { attrsFromImageDialog, seedImageDialogFromSelection } from '../../src/web/assets/field/src/ts/semantic/image-apply';

it('adding a link keeps existing bold text', () => {
    const editor = new Editor({ extensions: [StarterKit.configure({ link: false }), createSemanticLink()], content: '<p><strong>Hello</strong> world</p>' });
    try {
        editor.commands.setTextSelection({ from: 1, to: 6 });
        const seed = seedInsertLinkDialog(editor);
        applySemanticLinkToEditor(editor, { attrs: urlLinkAttrs('https://example.com'), text: seed.text, from: seed.from, to: seed.to, focus: false });
        expect(editor.getJSON().content![0].content![0].marks!.map(mark => mark.type)).toContain('bold');
    } finally { editor.destroy(); }
});

it('image dialog round trip keeps semantic target', () => {
    const raw = { assetUid: '12345678-1234-4234-8234-123456789012', siteMode: 'fixed', siteUid: 'site-a', altMode: 'decorative', alt: null, title: '', size: 'default', imageUid: 'image-a', link: defaultLinkAttrs({ type: 'entry', targetUid: 'entry-a', suffix: '#details', ariaLabel: 'More', rel: ['nofollow'] }) };
    const seed = seedImageDialogFromSelection({ isActive: () => true, getAttributes: () => raw } as unknown as Editor)!;
    const result = attrsFromImageDialog({ ...seed, title: 'Updated' });
    expect(result).toMatchObject({ ...raw, title: 'Updated' });
    expect(attrsFromImageDialog({ ...seed, linkUrl: '' }).link).toBeNull();
    expect(attrsFromImageDialog({ ...seed, alt: 'Custom alt' }).altMode).toBe('custom');
    expect(attrsFromImageDialog({ ...seed, linkUrl: 'tel:123' }).link).toMatchObject({ type: 'tel', value: '123' });
});

it.each(['email', 'tel', 'sms'] as const)('editing %s links keeps their intent', (type) => {
    const editor = new Editor({ extensions: [StarterKit.configure({ link: false }), createSemanticLink()], content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Email', marks: [{ type: 'link', attrs: defaultLinkAttrs({ type, value: 'person@example.com' }) }] }] }] } });
    try {
        editor.commands.setTextSelection(2);
        const seed = getSemanticLinkEditState(editor);
        const submitted = seed.semantic ? { ...seed.semantic, newWindow: seed.openInNewTab } : attrsFromUrlDialog(seed.url, seed.openInNewTab);
        expect(submitted.type).toBe(type);
    } finally { editor.destroy(); }
});


it('inserts fallback link text at an empty caret', () => {
    const editor = new Editor({ extensions: [StarterKit.configure({ link: false }), createSemanticLink()], content: '<p></p>' });
    try {
        applySemanticLinkToEditor(editor, { attrs: urlLinkAttrs('https://example.com'), text: '', focus: false });
        expect(editor.state.doc.textContent).toBe('https://example.com');
    } finally { editor.destroy(); }
});

it('preserves semantic image link metadata through the editor command', () => {
    const editor = new Editor({ extensions: [StarterKit, createSemanticImage()], content: '<p></p>' });
    try {
        const link = defaultLinkAttrs({ type: 'entry', targetUid: 'entry-a', suffix: '#details', ariaLabel: 'Details', rel: ['nofollow'] });
        editor.commands.setSemanticImage({ assetUid: '12345678-1234-4234-8234-123456789012', link, altMode: 'decorative' });
        const image = editor.getJSON().content!.find(node => node.type === 'image')!;
        expect(image.attrs!.link).toEqual({ ...link, linkUid: null });
    } finally { editor.destroy(); }
});

it('preserves mixed marks and paragraph boundaries when linking unchanged text', () => {
    const editor = new Editor({ extensions: [StarterKit.configure({ link: false }), createSemanticLink()], content: '<p><strong>One</strong> <em>two</em></p><p>Three</p>' });
    try {
        editor.commands.setTextSelection({ from: 1, to: editor.state.doc.content.size - 1 });
        const seed = seedInsertLinkDialog(editor);
        applySemanticLinkToEditor(editor, { ...seed, attrs: urlLinkAttrs('https://example.com'), focus: false });
        expect(editor.state.doc.childCount).toBe(2);
        expect(editor.getJSON().content![0].content![0].marks!.map(mark => mark.type)).toContain('bold');
        expect(editor.getJSON().content![0].content![2].marks!.map(mark => mark.type)).toContain('italic');
        editor.state.doc.check();
    } finally { editor.destroy(); }
});
