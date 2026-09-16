import { afterEach, describe, expect, it } from 'vitest';
import '../../src/web/assets/field/src/ts/VizyEditorElement';
import {
    assignBootstrap,
    bootstrapEditorWhenReady,
    consumePendingBootstrap,
    queueBootstrap,
} from '../../src/web/assets/field/src/ts/bootstrap-queue';
import type { EditorManifest } from '../../src/web/assets/field/src/ts/types';

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

afterEach(() => {
    document.body.innerHTML = '';
});

describe('bootstrap queue', () => {
    it('queues bootstrap data until the editor connects', async () => {
        const id = 'vizy-editor-test-queue';
        const bootstrap = {
            document: { type: 'doc', attrs: { schemaVersion: 2 }, content: [] },
            manifest: richManifest(),
            editorContextToken: 'token',
        };

        queueBootstrap(id, bootstrap);
        expect(consumePendingBootstrap(id)).toEqual(bootstrap);

        queueBootstrap(id, bootstrap);
        document.body.innerHTML = `<vizy-editor id="${id}"><input data-vizy-document type="hidden" name="body"></vizy-editor>`;
        await customElements.whenDefined('vizy-editor');

        expect(assignBootstrap(id, bootstrap)).toBe(true);
        await Promise.resolve();
        await Promise.resolve();

        const editor = document.getElementById(id) as { editor?: unknown } | null;
        expect(editor?.editor).toBeTruthy();
    });

    it('bootstraps when Craft registers JS before the element exists', async () => {
        const id = 'vizy-editor-test-late';
        const bootstrap = {
            document: { type: 'doc', attrs: { schemaVersion: 2 }, content: [] },
            manifest: richManifest(),
            editorContextToken: 'token',
        };

        bootstrapEditorWhenReady(id, bootstrap);
        await new Promise((resolve) => requestAnimationFrame(resolve));

        document.body.innerHTML = `<vizy-editor id="${id}"><input data-vizy-document type="hidden" name="body"></vizy-editor>`;
        await customElements.whenDefined('vizy-editor');
        await new Promise((resolve) => requestAnimationFrame(resolve));
        await Promise.resolve();

        const editor = document.getElementById(id) as { editor?: unknown } | null;
        expect(editor?.editor).toBeTruthy();
    });

    it('survives a brief Craft-style detach before bootstrap runs', async () => {
        const id = 'vizy-editor-test-detach';
        const bootstrap = {
            document: { type: 'doc', attrs: { schemaVersion: 2 }, content: [] },
            manifest: richManifest(),
            editorContextToken: 'token',
        };

        const element = document.createElement('vizy-editor');
        element.id = id;
        element.innerHTML = '<input data-vizy-document type="hidden" name="body">';
        document.body.append(element);
        await customElements.whenDefined('vizy-editor');

        element.remove();
        bootstrapEditorWhenReady(id, bootstrap);
        document.body.append(element);

        await new Promise((resolve) => requestAnimationFrame(resolve));
        await Promise.resolve();

        const editor = document.getElementById(id) as { editor?: unknown } | null;
        expect(editor?.editor).toBeTruthy();
    });
});
