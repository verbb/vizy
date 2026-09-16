import type { InsertionContext, InsertionDefinition, InsertionRegistry, InsertionResult, InsertionRuntime } from '../insertion/types';
import type { EditorManifest } from '../types';
import { isInsideColumn } from './lookup';
import { insertLayout } from './commands';
import { findLayoutPreset, resolveLayoutPresets } from './presets';

export const LAYOUT_INSERTION_ID = 'transform:vizy:layout';

export interface LayoutInsertionInput {
    readonly presetId: string;
    readonly stack?: string;
}

function layoutEnabled(runtime: InsertionRuntime): boolean {
    return runtime.manifest.enabledNodes.includes('layout')
        && Boolean(runtime.editor.schema.nodes.layout);
}

export function isLayoutInsertionAvailable(
    context: InsertionContext,
    runtime: InsertionRuntime,
): boolean {
    if (!layoutEnabled(runtime)) return false;
    if (context.contentType === 'blocks') return false;
    if (isInsideColumn(runtime.editor.state.doc, context.from)) return false;
    return true;
}

export function executeLayoutInsertion(
    context: InsertionContext,
    runtime: InsertionRuntime,
    input?: LayoutInsertionInput,
): InsertionResult {
    if (!isLayoutInsertionAvailable(context, runtime)) {
        return { status: 'cancelled' };
    }

    const presets = resolveLayoutPresets(runtime.manifest);
    if (!presets.length) return { status: 'cancelled' };

    const presetId = input?.presetId;
    if (!presetId) {
        return presets.length === 1
            ? executeLayoutInsertion(context, runtime, { presetId: presets[0].id })
            : { status: 'opened' };
    }

    const preset = findLayoutPreset(presets, presetId);
    if (!preset) return { status: 'cancelled' };

    const inserted = insertLayout(
        runtime.editor,
        preset,
        context.from,
        runtime.createUid,
        input?.stack ?? 'small',
    );
    return inserted ? { status: 'inserted' } : { status: 'cancelled' };
}

export function layoutInsertionDefinition(manifest: EditorManifest): InsertionDefinition {
    const presets = resolveLayoutPresets(manifest);
    return {
        item: {
            id: LAYOUT_INSERTION_ID,
            kind: 'transform',
            label: 'Layout',
            description: 'Multi-column layout',
            icon: null,
            group: 'Layout',
            keywords: ['columns', 'grid', 'layout'],
            aliases: [],
            order: 0,
            surfaces: ['browse', 'empty', 'inline', 'keyboard', 'slash'],
            requiresInput: presets.length !== 1,
        },
        isAvailable: isLayoutInsertionAvailable,
        execute(context, runtime, input) {
            return executeLayoutInsertion(context, runtime, input as LayoutInsertionInput | undefined);
        },
    };
}

/** Register the layout transform when the layout capability is enabled. */
export function registerLayoutInsertion(
    registry: InsertionRegistry,
    manifest: EditorManifest,
): () => void {
    if (!manifest.enabledNodes.includes('layout')) {
        return () => undefined;
    }
    return registry.register(layoutInsertionDefinition(manifest));
}
