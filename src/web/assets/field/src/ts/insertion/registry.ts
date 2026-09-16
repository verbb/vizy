import type {
    InsertionContext,
    InsertionDefinition,
    InsertionItemManifest,
    InsertionRegistry,
    InsertionRequest,
    InsertionResult,
    InsertionRuntime,
} from './types';
import { buildInsertionContext, contextsMatchForExecution } from './context';
import { isInsertionAvailable } from './availability';
import { compareAvailable, scoreInsertionItem } from './search';
import { executeBlockInsertion, executeNodeInsertion } from './executors';
import { executeLayoutInsertion, isLayoutInsertionAvailable, LAYOUT_INSERTION_ID } from '../layout/insertion';
import { getPartnerInsertionDefinitions } from './partner-registry';
import type { InsertionQuery } from './types';

function definitionForItem(item: InsertionItemManifest): InsertionDefinition {
    return {
        item,
        isAvailable: (context, runtime) => {
            if (item.kind === 'transform' && item.id === LAYOUT_INSERTION_ID) {
                return isLayoutInsertionAvailable(context, runtime);
            }
            return isInsertionAvailable(item, context, runtime);
        },
        execute(context, runtime, input) {
            if (item.kind === 'block') {
                const blockTypeUid = item.blockTypeUid ?? item.id.replace(/^block:/, '');
                return executeBlockInsertion(blockTypeUid, context, runtime);
            }
            if (item.kind === 'node') {
                const nodeName = item.nodeName ?? item.id.replace(/^node:vizy:/, '');
                return executeNodeInsertion(nodeName, context, runtime);
            }
            if (item.kind === 'transform' && item.id === LAYOUT_INSERTION_ID) {
                return executeLayoutInsertion(context, runtime, input as { presetId: string } | undefined);
            }
            return { status: 'cancelled' };
        },
    };
}

export function createInsertionRegistry(
    runtime: InsertionRuntime,
    editorId: string,
    manifestItems: readonly InsertionItemManifest[],
): InsertionRegistry {
    const definitions = new Map<string, InsertionDefinition>();
    for (const item of manifestItems) {
        if (definitions.has(item.id)) {
            throw new Error(`duplicateInsertionItem:${item.id}`);
        }
        definitions.set(item.id, definitionForItem(item));
    }

    // Global partner registrations (Craft.Vizy.registerInsertion). Partner wins
    // on id clash so a custom execute can replace the default node insert path.
    for (const partner of getPartnerInsertionDefinitions()) {
        definitions.set(partner.item.id, partner);
    }

    const register = (definition: InsertionDefinition): (() => void) => {
        if (definitions.has(definition.item.id)) {
            throw new Error(`duplicateInsertionItem:${definition.item.id}`);
        }
        definitions.set(definition.item.id, definition);
        return () => {
            definitions.delete(definition.item.id);
        };
    };

    const query = (request: InsertionQuery) => {
        const results = [];
        for (const definition of definitions.values()) {
            if (request.kinds && !request.kinds.includes(definition.item.kind)) continue;
            // Use per-definition availability so partner / layout transforms
            // are not filtered out by the built-in transform allowlist.
            if (!definition.isAvailable(request.context, runtime)) continue;
            const score = request.search
                ? scoreInsertionItem(definition.item, request.search)
                : 1;
            if (request.search && score <= 0) continue;
            results.push({
                item: definition.item,
                context: request.context,
                score,
            });
        }
        results.sort(compareAvailable);
        if (request.limit !== undefined) {
            return results.slice(0, request.limit);
        }
        return results;
    };

    const execute = async (request: InsertionRequest): Promise<InsertionResult> => {
        const definition = definitions.get(request.id);
        if (!definition) return { status: 'cancelled' };
        if (definition.item.requiresInput && request.input === undefined) {
            return { status: 'opened' };
        }

        const fresh = buildInsertionContext(
            runtime,
            request.context.surface,
            request.context.editorId,
            request.context.from,
        );
        if (!fresh || !contextsMatchForExecution(request.context, fresh)) {
            return { status: 'cancelled' };
        }
        if (!definition.isAvailable(fresh, runtime)) {
            return { status: 'cancelled' };
        }
        return definition.execute(fresh, runtime, request.input);
    };

    const buildContext = (surface: InsertionContext['surface'], position?: number) =>
        buildInsertionContext(runtime, surface, editorId, position);

    return { register, query, execute, buildContext };
}

export { buildInsertionContext };
