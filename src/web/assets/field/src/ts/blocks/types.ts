import type { JsonValue } from '../types';

/** Local editor state keyed by Block UID; never written to canonical JSON. */
export interface BlockViewState {
    selected: boolean;
    editing: boolean;
    expanded: boolean;
    dragging: boolean;
    dropTarget: 'none' | 'valid' | 'invalid';
    menuOpen: boolean;
    fieldLayout: 'unmounted' | 'loading' | 'mounted' | 'error';
}

export interface BlockContentState {
    enabled: boolean;
    resolved: boolean;
    errorCount: number;
    descendantErrorCount: number;
}

export interface BlockSummaryMedia {
    kind: string;
    reference: string | number | null;
    alt: string | null;
    thumbnailUrl: string | null;
}

export interface BlockSummaryData {
    blockUid: string;
    blockTypeUid: string;
    /** Block Type display name — always shown in expanded header. */
    typeName: string;
    title: string;
    subtitle: string | null;
    media: BlockSummaryMedia | null;
    enabled: boolean;
    resolved: boolean;
    errorCount: number;
    descendantErrorCount: number;
    /** Monotonic client revision used to ignore stale provider responses. */
    revision: number;
}

export interface BlockSummaryInferenceManifest {
    titlePlacementUids: string[];
    subtitlePlacementUids: string[];
    mediaPlacementUids: string[];
}

export interface BlockActionKind {
    kind:
        | 'edit'
        | 'addAbove'
        | 'duplicate'
        | 'copy'
        | 'moveUp'
        | 'moveDown'
        | 'toggleEnabled'
        | 'delete'
        | 'expand'
        | 'collapse'
        | 'expandAll'
        | 'collapseAll';
}

export type FieldSlots = Record<string, JsonValue>;

export const DEFAULT_VIEW_STATE: BlockViewState = {
    selected: false,
    editing: false,
    expanded: true,
    dragging: false,
    dropTarget: 'none',
    menuOpen: false,
    fieldLayout: 'unmounted',
};
