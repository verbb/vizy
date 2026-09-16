import { Extension } from '@tiptap/core';
import type { EditorManifest, ToolbarControlManifest } from '../types';

/**
 * Whether this editor's schema can honour a control.
 *
 * A second opinion on the server's own filtering, kept as a belt-and-braces guard
 * against a stale manifest naming a capability the schema lacks.
 */
function controlEnabled(manifest: EditorManifest, control: ToolbarControlManifest): boolean {
    const action = control.action;
    if (action?.command === 'toggleMark') return manifest.enabledMarks.includes(action.markName);
    if (action?.command === 'setLink') return manifest.enabledMarks.includes('link');
    if (action?.command === 'toggleNode' || action?.command === 'insertNode') {
        return manifest.enabledNodes.includes(action.nodeName);
    }
    if (action?.command === 'setHeading') return manifest.enabledNodes.includes('heading');
    return true;
}

/**
 * Drops controls the schema cannot honour, and prunes group contents rather than
 * only judging the group as a whole — otherwise a surviving group could still offer
 * a disabled capability as a menu option. A group left with nothing goes too, since
 * its trigger would open an empty menu.
 */
function pruneControls(manifest: EditorManifest, controls: readonly ToolbarControlManifest[]): ToolbarControlManifest[] {
    const pruned: ToolbarControlManifest[] = [];

    for (const control of controls) {
        if (control.kind === 'group') {
            const items = pruneControls(manifest, control.items ?? []);
            if (items.length) pruned.push({ ...control, items });
            continue;
        }
        if (controlEnabled(manifest, control)) pruned.push(control);
    }

    return pruned;
}

export function createToolbarExtension(manifest: EditorManifest) {
    const controls = pruneControls(manifest, manifest.toolbar?.controls ?? []);
    return Extension.create({
        name: 'vizyToolbar',
        addStorage: () => ({ controls }),
    });
}

export function createBubbleExtension(manifest: EditorManifest) {
    const controls = pruneControls(manifest, manifest.bubble?.controls ?? []);
    return Extension.create({
        name: 'vizyBubble',
        addStorage: () => ({ controls }),
    });
}
