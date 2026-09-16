import type { InsertionContext, InsertionItemManifest, InsertionRuntime } from './types';
import { blockTypeAllowedInContext } from './executors';
import { isLayoutInsertionAvailable } from '../layout/insertion';

const STRUCTURAL_DEPTH_LIMIT = 32;

function surfaceAllowed(item: InsertionItemManifest, surface: InsertionContext['surface']): boolean {
    return item.surfaces.includes(surface);
}

function nodeAllowed(nodeName: string, context: InsertionContext, runtime: InsertionRuntime): boolean {
    if (context.contentType === 'blocks') return false;
    if (!runtime.manifest.enabledNodes.includes(nodeName)) return false;
    if (!runtime.editor.schema.nodes[nodeName]) return false;
    if (runtime.manifest.field.rootContentType === 'blocks') {
        return false;
    }
    return true;
}

export function isInsertionAvailable(
    item: InsertionItemManifest,
    context: InsertionContext,
    runtime: InsertionRuntime,
): boolean {
    if (!surfaceAllowed(item, context.surface)) return false;
    if (context.depth > STRUCTURAL_DEPTH_LIMIT) return false;

    if (item.kind === 'block') {
        if (context.contentType !== 'blocks' && context.contentType !== 'rich') return false;
        const blockTypeUid = item.blockTypeUid ?? item.id.replace(/^block:/, '');
        if (!blockTypeAllowedInContext(blockTypeUid, context, runtime)) return false;
        if (context.maxBlocks !== null && context.directBlockCount >= context.maxBlocks) return false;
        return true;
    }

    if (item.kind === 'node') {
        const nodeName = item.nodeName ?? item.id.replace(/^node:vizy:/, '');
        return nodeAllowed(nodeName, context, runtime);
    }

    if (item.kind === 'transform') {
        return item.id === 'transform:vizy:layout'
            && isLayoutInsertionAvailable(context, runtime);
    }

    return false;
}
