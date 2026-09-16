import type { Editor } from '@tiptap/core';
import { NodeSelection } from '@tiptap/pm/state';
import {
    canWrapSelection,
    insertLayout,
    wrapInLayout,
} from './commands';
import { isInsideColumn } from './lookup';
import { LayoutPresetChooser } from './preset-chooser';
import {
    DEFAULT_LAYOUT_PRESETS,
    findLayoutPreset,
    type LayoutPreset,
} from './presets';

const layoutPresetChooser = new LayoutPresetChooser();

export type LayoutControlOptions = {
    focus?: boolean;
    /** Resolved Editor Config presets (defaults when empty). */
    presets?: readonly LayoutPreset[];
    /** Toolbar / menu trigger — anchors the preset `pk-popup`. */
    invoker?: HTMLElement | null;
};

/**
 * Toolbar Layout: unwrap when already inside a layout; otherwise open the same
 * preset chooser slash/gutter use (or insert immediately when only one preset).
 * Empty carets insert; wrapable selections wrap into column 1.
 */
export function activateLayoutControl(
    editor: Editor,
    options: LayoutControlOptions = {},
): boolean {
    if (!editor.schema.nodes.layout || !editor.schema.nodes.column) return false;

    if (editor.isActive('layout')) {
        const chain = options.focus ? editor.chain().focus() : editor.chain();
        if (typeof chain.unwrapLayout !== 'function') return false;
        return chain.unwrapLayout().run();
    }

    const { from } = editor.state.selection;
    if (isInsideColumn(editor.state.doc, from)) return false;

    const presets = options.presets?.length
        ? options.presets
        : DEFAULT_LAYOUT_PRESETS;

    if (presets.length === 1) {
        return applyLayoutPreset(editor, presets[0], options.focus);
    }

    const mount = editor.view.dom.closest('.vizy-editor-surface')?.parentElement
        ?? editor.view.dom.parentElement;
    if (!mount) return false;

    const rect = options.invoker?.getBoundingClientRect()
        ?? (() => {
            const coords = editor.view.coordsAtPos(from);
            return new DOMRect(coords.left, coords.top, 1, coords.bottom - coords.top);
        })();

    layoutPresetChooser.open(rect, presets, mount, {
        returnFocus: options.invoker ?? (editor.view.dom as HTMLElement),
        onSelect: (presetId) => {
            const preset = findLayoutPreset(presets, presetId);
            if (!preset) return;
            applyLayoutPreset(editor, preset, true);
        },
    });
    return true;
}

function applyLayoutPreset(
    editor: Editor,
    preset: LayoutPreset,
    focus?: boolean,
): boolean {
    if (focus) {
        editor.view.focus();
    }
    const createUid = () => crypto.randomUUID();
    const { from, to } = editor.state.selection;
    const selection = editor.state.selection;
    // Match TipTap wrapInLayout: NodeSelection or a wrapable range wraps;
    // a bare caret inserts at the selection (same as slash Layout).
    if (
        selection instanceof NodeSelection
        || canWrapSelection(editor, from, to)
    ) {
        return wrapInLayout(editor, from, to, preset, createUid);
    }
    return insertLayout(editor, preset, from, createUid);
}
