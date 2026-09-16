import { Extension } from '@tiptap/core';
import { NodeSelection } from '@tiptap/pm/state';
import type { NodeViewServices } from '../extensions';
import {
    canWrapSelection,
    unwrapLayout,
    wrapInLayout,
} from './commands';
import { defaultTwoColumnPreset, resolveLayoutPresets } from './presets';
import { findLayoutAtPos } from './resize';

export function createLayoutCommandsExtension(services: () => NodeViewServices) {
    return Extension.create({
        name: 'vizyLayoutCommands',
        addCommands() {
            return {
                wrapInLayout:
                    () => ({ editor, state }) => {
                        const svc = services();
                        if (!svc.manifest.enabledNodes.includes('layout')) return false;
                        const preset = defaultTwoColumnPreset(resolveLayoutPresets(svc.manifest));
                        const { from, to } = state.selection;
                        if (!(state.selection instanceof NodeSelection) && !canWrapSelection(editor, from, to)) {
                            return false;
                        }
                        return wrapInLayout(
                            editor,
                            from,
                            to,
                            preset,
                            () => crypto.randomUUID(),
                            'small',
                            state,
                        );
                    },
                unwrapLayout:
                    () => ({ editor, state, dispatch }) => {
                        const located = findLayoutAtPos(editor, state.selection.from);
                        if (!located) return false;
                        const layoutUid = String(located.node.attrs.layoutUid);
                        if (!dispatch) return true;
                        return unwrapLayout(editor, layoutUid);
                    },
            };
        },
    });
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        vizyLayoutCommands: {
            wrapInLayout: () => ReturnType;
            unwrapLayout: () => ReturnType;
        };
    }
}
