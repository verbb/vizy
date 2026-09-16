import type { Editor } from '@tiptap/core';
import type { EditorManifest } from '../types';

export type InsertionSurface = 'slash' | 'inline' | 'empty' | 'browse' | 'keyboard';
export type InsertionKind = 'block' | 'node' | 'transform';

export interface InsertionIcon {
    /** Catalog / Plugin Kit lookup name (e.g. Font Awesome value or `list-ul`). */
    readonly name: string;
    /** Inline SVG from the Vizy icon catalog when available. */
    readonly svg?: string | null;
    /** Optional Block Type accent (`#rrggbb`). */
    readonly color?: string | null;
}

/** Serializable metadata shipped in the Editor manifest. */
export interface InsertionItemManifest {
    readonly id: string;
    readonly kind: InsertionKind;
    readonly label: string;
    readonly description: string | null;
    readonly icon: InsertionIcon | null;
    /** CP action URL when the Block Type has a resolvable preview image. */
    readonly previewImageUrl?: string | null;
    readonly group: string;
    readonly keywords: readonly string[];
    readonly aliases: readonly string[];
    readonly order: number;
    readonly surfaces: readonly InsertionSurface[];
    readonly requiresInput: boolean;
    readonly blockTypeUid?: string;
    readonly nodeName?: string;
}

export interface InsertionContext {
    readonly editorId: string;
    readonly surface: InsertionSurface;
    readonly from: number;
    readonly to: number;
    readonly selectionKind: 'text' | 'node' | 'gap';
    readonly container: { readonly kind: 'root' };
    readonly contentType: 'rich' | 'blocks';
    readonly directBlockCount: number;
    readonly minBlocks: number | null;
    readonly maxBlocks: number | null;
    readonly depth: number;
    readonly schemaRevision: string;
    readonly documentRevision: string;
}

export interface AvailableInsertion {
    readonly item: InsertionItemManifest;
    readonly context: InsertionContext;
    readonly score: number;
}

export interface InsertionQuery {
    readonly context: InsertionContext;
    readonly search?: string;
    readonly kinds?: readonly InsertionKind[];
    readonly limit?: number;
}

export interface InsertionRequest {
    readonly id: string;
    readonly context: InsertionContext;
    readonly input?: unknown;
}

export type InsertionResult =
    | { readonly status: 'inserted'; readonly blockUid?: string }
    | { readonly status: 'opened' }
    | { readonly status: 'cancelled' };

export interface InsertionRuntime {
    readonly editor: Editor;
    readonly manifest: EditorManifest;
    readonly documentRevision: () => number;
    readonly createUid: () => string;
    /**
     * Prefetch Craft FieldLayout HTML before the Block enters the document, so
     * first paint is a complete card (Vizy 3 feel). Optional in unit harnesses.
     */
    readonly prefetchBlockFieldLayout?: (args: {
        blockUid: string;
        blockTypeUid: string;
        block: Record<string, unknown>;
        destination: { kind: 'root' };
    }) => Promise<void>;
    /** Matrix-style grow-in after a successful Block insert. */
    readonly animateBlockInsert?: (blockUid: string) => void;
}

export interface InsertionDefinition {
    readonly item: InsertionItemManifest;
    isAvailable(context: InsertionContext, runtime: InsertionRuntime): boolean;
    execute(
        context: InsertionContext,
        runtime: InsertionRuntime,
        input?: unknown,
    ): InsertionResult | Promise<InsertionResult>;
}

export interface InsertionRegistry {
    register(definition: InsertionDefinition): () => void;
    query(query: InsertionQuery): readonly AvailableInsertion[];
    execute(request: InsertionRequest): Promise<InsertionResult>;
    buildContext(surface: InsertionSurface, position?: number): InsertionContext | null;
}
