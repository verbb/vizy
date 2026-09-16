import { Editor } from '@tiptap/core';
import { GapCursor } from '@tiptap/pm/gapcursor';
import { describe, expect, it } from 'vitest';
import { createEditorExtensions } from '../../src/web/assets/field/src/ts/editor-schema';
import type { EditorManifest } from '../../src/web/assets/field/src/ts/types';
import {
    collapseEphemeralRootParagraph,
    ensureRootTypingSurface,
} from '../../src/web/assets/field/src/ts/typing-surface';

function richManifest(): EditorManifest {
    return {
        manifestVersion: 1,
        uid: 'request',
        revision: '1:test',
        hash: 'test',
        registryRevision: 'registry',
        schemaRevision: 'schema',
        enabledNodes: ['paragraph'],
        enabledMarks: ['bold'],
        internalNodes: ['doc', 'text'],
        modules: ['vizy/core/node/doc', 'vizy/core/node/text', 'vizy/core/node/paragraph', 'vizy/core/mark/bold'],
        field: {
            fieldUid: 'field',
            rootContentType: 'rich',
            blockTypePickerGroups: [],
            allowedBlockTypeUids: [],
            insertableBlockTypeUids: [],
            minBlocks: null,
            maxBlocks: null,
        },
        blockTypes: {},
        insertionItems: [],
    };
}

describe('root typing surface', () => {
    it('seeds an empty paragraph for rich root docs with no content', () => {
        const manifest = richManifest();
        const empty = { type: 'doc', attrs: { schemaVersion: 2 }, content: [] };
        expect(ensureRootTypingSurface(empty, manifest)).toEqual({
            type: 'doc',
            attrs: { schemaVersion: 2 },
            content: [{ type: 'paragraph' }],
        });
    });

    it('collapses a lone empty paragraph back to canonical empty content', () => {
        const manifest = richManifest();
        const seeded = ensureRootTypingSurface(
            { type: 'doc', attrs: { schemaVersion: 2 }, content: [] },
            manifest,
        );
        expect(collapseEphemeralRootParagraph(seeded, manifest)).toEqual({
            type: 'doc',
            attrs: { schemaVersion: 2 },
            content: [],
        });
    });

    it('uses a text selection instead of a gap cursor in an empty rich editor', () => {
        const manifest = richManifest();
        const editor = new Editor({
            extensions: createEditorExtensions(manifest, () => {
                throw new Error('servicesNotUsed');
            }),
            content: ensureRootTypingSurface(
                { type: 'doc', attrs: { schemaVersion: 2 }, content: [] },
                manifest,
            ),
        });

        expect(editor.state.doc.firstChild?.type.name).toBe('paragraph');
        expect(editor.state.selection instanceof GapCursor).toBe(false);

        editor.destroy();
    });
});
