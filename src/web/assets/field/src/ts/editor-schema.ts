import { Extension, type AnyExtension } from '@tiptap/core';
import { Slice } from '@tiptap/pm/model';
import { Plugin } from '@tiptap/pm/state';
import type { NodeViewServices } from './extensions';
import { regenerateAuthoredUids, type IdentitySchema } from './identity';
export { recursiveRegenerateAuthoredUids } from './identity';
import { resolveTrustedModules } from './modules';
import { ContentPolicy } from './policy';
import { createBlockMoveDropExtension } from './blocks/drop-extension';
import { createSlashExtension } from './insertion/slash-extension';
import { createToolbarExtension, createBubbleExtension } from './toolbar/extensions';
import { createLayoutCommandsExtension } from './layout/extension';
import { createRootTypingSurfaceExtension } from './typing-surface';
import { VizySelectionBoundaries } from './selection-boundaries';
import { preserveFieldValuesOnHistory } from './reconcile-document';
import { UndoRedo, Gapcursor } from '@tiptap/extensions';
import TextAlign from '@tiptap/extension-text-align';
import {
    OpaqueClipboard,
    UnsupportedInlineNode,
    UnsupportedNode,
} from './transport/opaque';
import type { CanonicalNode, EditorManifest } from './types';

function regenerateSlice(slice: Slice, schemaIdentity: IdentitySchema): Slice {
    const json = slice.toJSON() as unknown as { content?: CanonicalNode[]; openStart?: number; openEnd?: number };
    const transformed = regenerateAuthoredUids(json, undefined, schemaIdentity);
    const schema = slice.content.firstChild?.type.schema;
    if (!schema) return slice;
    return Slice.fromJSON(schema, transformed);
}

const CopyIdentity = Extension.create<{ schemaIdentity: IdentitySchema }>({
    name: 'vizyCopyIdentity',
    addOptions: () => ({ schemaIdentity: {} }),
    addProseMirrorPlugins() {
        const schemaIdentity = this.options.schemaIdentity;
        return [new Plugin({
            props: {
                transformPasted(slice, view) {
                    // Internal Block reorder reuses the same authored UIDs so
                    // FieldHostRegistry keeps mounted Craft DOM. Regenerating here
                    // would dispose the host and flash the FieldLayout spinner.
                    if (view.dragging?.move) return slice;
                    return regenerateSlice(slice, schemaIdentity);
                },
                handleDrop(view, event, slice, moved) {
                    if (moved || !slice) return false;
                    const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
                    if (!coordinates) return true;
                    const copied = regenerateSlice(slice, schemaIdentity);
                    view.dispatch(view.state.tr.replaceRange(coordinates.pos, coordinates.pos, copied).scrollIntoView());
                    return true;
                },
            },
        })];
    },
});

export function createEditorExtensions(
    manifest: EditorManifest,
    services: () => NodeViewServices,
): AnyExtension[] {
    const resolved = resolveTrustedModules(manifest.modules, { manifest, services });
    const byName = new Map<string, AnyExtension>();
    for (const extension of resolved) {
        if (byName.has(extension.name)) throw new Error(`duplicateEditorExtension:${extension.name}`);
        byName.set(extension.name, extension);
    }

    const expected = new Set([...manifest.enabledNodes, ...manifest.enabledMarks, ...manifest.internalNodes]);
    for (const name of expected) {
        if (!byName.has(name)) throw new Error(`missingProductionExtension:${name}`);
    }

    // Blocks that can carry an alignment. TextAlign writes a `textAlign` attribute onto
    // the types named here rather than adding a node or a mark, which is why alignment is
    // not a registry capability: there is nothing to switch on. Paragraph is always
    // present; the rest are named unconditionally because the extension only touches the
    // types it finds in the schema.
    const alignableTypes = ['paragraph', 'heading'].filter((name) => byName.has(name));

    return [
        ...byName.values(),
        // Undo and redo are a mechanic of editing rather than content, so history is
        // always loaded and is not gated on a capability. Vizy went without it entirely
        // until now: the extension list is explicit rather than StarterKit's, and no
        // history plugin was in it, which left even Cmd+Z with nothing behind it.
        UndoRedo,
        Extension.create({
            name: 'vizyFieldHistory',
            addProseMirrorPlugins: () => [preserveFieldValuesOnHistory()],
        }),
        // Empty blocks-only Content Areas have no textblock child — without a
        // gap cursor, clicks there resolve to the nearest rich caret (e.g. the
        // end of a sibling “Content Rich” area) and the empty region feels dead.
        Gapcursor,
        createRootTypingSurfaceExtension(manifest),
        VizySelectionBoundaries,
        TextAlign.configure({ types: alignableTypes }),
        UnsupportedNode,
        UnsupportedInlineNode,
        OpaqueClipboard.configure({
            schemaIdentity: manifest.blockTypes,
            beforeCopy: () => services().flushMountedFields?.(),
        }),
        CopyIdentity.configure({ schemaIdentity: manifest.blockTypes }),
        createBlockMoveDropExtension(manifest),
        ContentPolicy.configure({ manifest }),
        createToolbarExtension(manifest),
        createBubbleExtension(manifest),
        createSlashExtension(services),
        ...(manifest.enabledNodes.includes('layout') ? [createLayoutCommandsExtension(services)] : []),
    ];
}
