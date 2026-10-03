import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { afterEach, describe, expect, it } from 'vitest';
import { createSemanticLink } from '../../src/web/assets/field/src/ts/semantic/link';
import type { LinkAttributeManifest } from '../../src/web/assets/field/src/ts/types';

const attributes: LinkAttributeManifest[] = [
    {
        name: 'nofollow',
        label: 'No follow',
        type: 'boolean',
        default: false,
        htmlAttribute: 'rel',
        htmlValue: 'nofollow external',
    },
    {
        name: 'cloaked',
        label: 'Cloaked',
        type: 'boolean',
        default: false,
        htmlAttribute: 'data-cloaked',
        htmlValue: '1',
    },
];

describe('registered Link attributes', () => {
    let editor: Editor | null = null;

    afterEach(() => {
        editor?.destroy();
        editor = null;
    });

    it('persists registered booleans and maps them to safe editor HTML', () => {
        editor = new Editor({
            extensions: [StarterKit.configure({ link: false }), createSemanticLink(attributes)],
            content: {
                type: 'doc',
                content: [{
                    type: 'paragraph',
                    content: [{
                        type: 'text',
                        text: 'External',
                        marks: [{
                            type: 'link',
                            attrs: {
                                type: 'url',
                                value: 'https://example.com',
                                newWindow: true,
                                nofollow: true,
                                cloaked: true,
                            },
                        }],
                    }],
                }],
            },
        });

        const mark = editor.getJSON().content?.[0]?.content?.[0]?.marks?.[0];
        expect(mark?.attrs).toMatchObject({ nofollow: true, cloaked: true });
        expect(editor.getHTML()).toContain('rel="nofollow external noopener noreferrer"');
        expect(editor.getHTML()).toContain('data-cloaked="1"');
    });

    it('reads mapped attributes from pasted HTML', () => {
        editor = new Editor({
            extensions: [StarterKit.configure({ link: false }), createSemanticLink(attributes)],
            content: '<p><a href="https://example.com" rel="nofollow external" data-cloaked="1">External</a></p>',
        });

        const mark = editor.getJSON().content?.[0]?.content?.[0]?.marks?.[0];
        expect(mark?.attrs).toMatchObject({ nofollow: true, cloaked: true });
    });
});
