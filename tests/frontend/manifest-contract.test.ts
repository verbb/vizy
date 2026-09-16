import { expect, it } from 'vitest';
import { Editor } from '@tiptap/core';
import fixture from '../Fixtures/editor-manifest.golden.json';
import { createEditorExtensions } from '../../src/web/assets/field/src/ts/editor-schema';
import { runToolbarAction } from '../../src/web/assets/field/src/ts/toolbar/actions';
import { adaptCanonicalForEditor, restoreCanonicalFromEditor } from '../../src/web/assets/field/src/ts/transport/opaque';
import type { EditorManifest } from '../../src/web/assets/field/src/ts/types';

it('builds the production schema and executes controls from the PHP manifest', () => {
    const manifest = fixture as unknown as EditorManifest;
    const editor: Editor = new Editor({
        extensions: createEditorExtensions(manifest, () => { throw new Error('This prose fixture must not mount a Block'); }),
        content: '<p>Contract text</p>',
    });
    try {
        for (const name of manifest.enabledNodes) expect(editor.schema.nodes[name], name).toBeDefined();
        expect(editor.schema.marks.link).toBeUndefined();
        expect(editor.schema.nodes.heading.spec.attrs?.level).toBeDefined();
        editor.commands.setTextSelection({ from: 1, to: 9 });
        const bold = manifest.toolbar!.controls.find((control) => control.id === 'bold')!;
        expect(runToolbarAction(editor, bold.action!, { focus: false })).toBe(true);
        expect(editor.getJSON().content?.[0].content).toEqual([
            { type: 'text', marks: [{ type: 'bold' }], text: 'Contract' },
            { type: 'text', text: ' text' },
        ]);
        const stored = restoreCanonicalFromEditor(editor.getJSON());
        editor.commands.setContent(adaptCanonicalForEditor(stored, editor.schema, {
            nodes: manifest.enabledNodes, marks: manifest.enabledMarks,
        }));
        expect(restoreCanonicalFromEditor(editor.getJSON())).toEqual(stored);
    } finally {
        editor.destroy();
    }
});
