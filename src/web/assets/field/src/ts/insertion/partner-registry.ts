import type {
    InsertionContext,
    InsertionDefinition,
    InsertionItemManifest,
    InsertionRuntime,
} from './types';
import { isInsertionAvailable } from './availability';

/**
 * Partner slash / gutter / browse insertions registered at runtime.
 *
 * PHP still decides which nodes appear when a capability is enabled
 * (`EditorManifests` insertion items). Use this API for custom execute
 * behaviour (dialogs, marks-as-commands, non-schema inserts) — the Vizy 4
 * replacement for Vizy 3 `Craft.Vizy.Config.registerCommands`.
 */

export interface RegisterInsertionInput {
    readonly item: InsertionItemManifest;
    readonly execute: InsertionDefinition['execute'];
    readonly isAvailable?: InsertionDefinition['isAvailable'];
}

const STRUCTURAL_DEPTH_LIMIT = 32;

const partnerInsertions = new Map<string, InsertionDefinition>();

function defaultPartnerAvailability(
    item: InsertionItemManifest,
): InsertionDefinition['isAvailable'] {
    return (context: InsertionContext, runtime: InsertionRuntime) => {
        // Built-in availability only understands layout transforms. Partner
        // transforms gate on surface + depth; partners may pass `isAvailable`
        // for richer rules (schema, selection, feature flags).
        if (item.kind === 'transform') {
            return item.surfaces.includes(context.surface)
                && context.depth <= STRUCTURAL_DEPTH_LIMIT;
        }
        return isInsertionAvailable(item, context, runtime);
    };
}

/**
 * Register a slash / gutter / browse insertion item.
 *
 * Ids must be unique across partners. When an editor boots, partner definitions
 * are merged into that field’s insertion registry (partner wins on id clash
 * with a PHP-shipped item — use that to customise execute for a core node).
 */
export function registerInsertion(input: RegisterInsertionInput): void {
    const { item, execute } = input;
    if (!item || typeof item.id !== 'string' || item.id === '') {
        throw new Error('vizyRegisterInsertionInvalidId');
    }
    if (typeof execute !== 'function') {
        throw new Error(`vizyRegisterInsertionInvalidExecute:${item.id}`);
    }
    if (partnerInsertions.has(item.id)) {
        throw new Error(`vizyRegisterInsertionDuplicate:${item.id}`);
    }

    partnerInsertions.set(item.id, {
        item,
        execute,
        isAvailable: input.isAvailable ?? defaultPartnerAvailability(item),
    });
}

export function getPartnerInsertionDefinitions(): readonly InsertionDefinition[] {
    return [...partnerInsertions.values()];
}

/** Test helper — clears partner insertions between cases. */
export function resetPartnerInsertionsForTests(): void {
    partnerInsertions.clear();
}
