import type { FieldLayoutResponse } from './types';

import type { BlockSummaryData, BlockViewState } from './blocks/types';
import { DEFAULT_VIEW_STATE } from './blocks/types';
import { isBlockCollapsedRemembered } from './blocks/collapsed-storage';

export interface BlockUiState {
    collapsed: boolean;
    editingFields: boolean;
    activeTabUid: string | null;
    view: BlockViewState;
    summary: BlockSummaryData | null;
}

export class BlockUiStateRegistry {
    readonly #states = new Map<string, BlockUiState>();

    get(blockUid: string): BlockUiState {
        let state = this.#states.get(blockUid);
        if (!state) {
            // Hydrate collapse from Matrix-style localStorage on first touch.
            const collapsed = isBlockCollapsedRemembered(blockUid);
            state = {
                collapsed,
                editingFields: false,
                activeTabUid: null,
                view: { ...DEFAULT_VIEW_STATE, expanded: !collapsed },
                summary: null,
            };
            this.#states.set(blockUid, state);
        }
        return state;
    }

    /**
     * `view` is patched key-by-key via `Object.assign`, so it must accept a subset.
     * `Partial<BlockUiState>` only makes `view` itself optional, which forced every
     * caller to pass all seven view flags to flip one.
     */
    update(
        blockUid: string,
        patch: Partial<Omit<BlockUiState, 'view'>> & { view?: Partial<BlockViewState> },
    ): BlockUiState {
        const state = this.get(blockUid);
        if (patch.view) Object.assign(state.view, patch.view);
        if (patch.summary !== undefined) state.summary = patch.summary;
        if (patch.collapsed !== undefined) {
            state.collapsed = patch.collapsed;
            state.view.expanded = !patch.collapsed;
        }
        if (patch.editingFields !== undefined) {
            state.editingFields = patch.editingFields;
            state.view.editing = patch.editingFields;
        }
        if (patch.activeTabUid !== undefined) state.activeTabUid = patch.activeTabUid;
        return state;
    }

    reconcile(liveUids: ReadonlySet<string>): void {
        for (const uid of this.#states.keys()) {
            if (!liveUids.has(uid)) this.#states.delete(uid);
        }
    }

    clear(): void {
        this.#states.clear();
    }
}

export type FieldHostStatus = 'idle' | 'loading' | 'mounted' | 'failed' | 'disposed';

export interface FieldHostRecord {
    blockUid: string;
    blockTypeUid: string;
    fieldLayoutUid: string | null;
    fieldLayoutHash: string | null;
    status: FieldHostStatus;
    /**
     * One Craft FieldLayout host per Block. Hosted Vizy Editors mount inside
     * this DOM; there is no TipTap-slot split of the layout.
     */
    root: HTMLElement;
    abortController: AbortController | null;
    requestId: string | null;
    requestKey: string | null;
    response: FieldLayoutResponse | null;
    /** Author-facing explanation when status is `failed`. */
    errorMessage: string | null;
    /**
     * Last successfully captured widget values, keyed by FieldLayout element UID.
     * Unchanged controls must not overwrite server-normalized canonical values.
     */
    capturedValues: Map<string, unknown>;
    pending: Promise<FieldHostRecord> | null;
    disposals: Array<() => void>;
    attachedViewCount: number;
    removed: boolean;
}

/**
 * The registry owns real Craft DOM independently from replaceable NodeViews.
 * A same-UID reorder can temporarily destroy/recreate a view without destroying
 * the field host; reconciliation disposes only UIDs absent from the document.
 */
export class FieldHostRegistry {
    readonly #records = new Map<string, FieldHostRecord>();

    /**
     * Ensures the persistent Craft DOM for a Block exists without claiming a
     * NodeView attachment. FieldLayout mounts before/alongside NodeViews, so
     * creation and view ownership are deliberately separate operations.
     */
    ensure(
        blockUid: string,
        blockTypeUid = '',
        fieldLayoutUid: string | null = null,
        fieldLayoutHash: string | null = null,
    ): FieldHostRecord {
        let record = this.#records.get(blockUid);
        if (
            record
            && (
                record.blockTypeUid !== blockTypeUid
                || record.fieldLayoutUid !== fieldLayoutUid
                || record.fieldLayoutHash !== fieldLayoutHash
            )
        ) {
            // A Block UID cannot retain widgets rendered for another schema.
            this.dispose(blockUid);
            record = undefined;
        }
        if (!record) {
            const root = document.createElement('div');
            root.dataset.vizyFieldHost = '';
            root.contentEditable = 'false';
            record = {
                blockUid,
                blockTypeUid,
                fieldLayoutUid,
                fieldLayoutHash,
                status: 'idle',
                root,
                abortController: null,
                requestId: null,
                requestKey: null,
                response: null,
                errorMessage: null,
                capturedValues: new Map(),
                pending: null,
                disposals: [],
                attachedViewCount: 0,
                removed: false,
            };
            this.#records.set(blockUid, record);
        }
        record.removed = false;
        return record;
    }

    acquire(
        blockUid: string,
        blockTypeUid = '',
        fieldLayoutUid: string | null = null,
        fieldLayoutHash: string | null = null,
    ): FieldHostRecord {
        const record = this.ensure(blockUid, blockTypeUid, fieldLayoutUid, fieldLayoutHash);
        record.attachedViewCount += 1;
        return record;
    }

    /** The single Craft host owned by a Block. */
    roots(blockUid: string): HTMLElement[] {
        const record = this.#records.get(blockUid);
        if (!record) return [];
        return [record.root];
    }

    releaseView(blockUid: string): void {
        const record = this.#records.get(blockUid);
        if (record) record.attachedViewCount = Math.max(0, record.attachedViewCount - 1);
    }

    get(blockUid: string): FieldHostRecord | undefined {
        return this.#records.get(blockUid);
    }

    reconcile(liveUids: ReadonlySet<string>): void {
        for (const [uid, record] of this.#records) {
            if (!liveUids.has(uid)) {
                record.removed = true;
                this.dispose(uid);
            }
        }
    }

    dispose(blockUid: string): void {
        const record = this.#records.get(blockUid);
        if (!record) return;
        this.#records.delete(blockUid);
        if (record.status === 'disposed') return;
        record.status = 'disposed';
        record.abortController?.abort();
        for (const dispose of record.disposals.splice(0)) dispose();
        record.root.remove();
    }

    destroy(): void {
        for (const uid of [...this.#records.keys()]) this.dispose(uid);
    }
}
