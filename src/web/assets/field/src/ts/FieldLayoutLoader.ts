import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import type { FieldHostRecord, FieldHostRegistry } from './registries';
import {
    selectLayoutTab,
    stampLayoutTabIndexes,
} from './layout-tabs';
import type { EditorManifest, FieldLayoutFailure, FieldLayoutResponse } from './types';
import type { VizyBlockElement } from './components/VizyBlockElement';
import { applyCraftFieldHtml } from './craft-field-html';
import { wireDismissibleTips } from './dismissible-tips';
import { FieldLayoutMountError, formatFieldLayoutError } from './field-layout-error';

/** Stylesheet / external-script hrefs already applied for a layout hash. */
const mountedHeadResources = new Set<string>();
const encode = new TextEncoder();

/** Must not exceed FieldLayoutController::BATCH_LIMIT. */
const BATCH_LIMIT = 25;

interface QueuedRender {
    blockUid: string;
    requestId: string;
    blockHash: string;
    record: FieldHostRecord;
    payload: Record<string, unknown>;
    resolve: (response: FieldLayoutResponse) => void;
    reject: (error: unknown) => void;
}

/** One entry of the batch endpoint's `results`, discriminated by `ok`. */
type BatchResultEntry = (FieldLayoutResponse & { ok: true }) | (FieldLayoutFailure & {
    requestId?: string;
});

interface BatchResponse {
    results: BatchResultEntry[];
}

/** FieldLayout destination — always root; nesting is Hosted Vizy, not TipTap slots. */
export type FieldLayoutDestination = { kind: 'root' };

export async function hashFieldLayoutBlock(value: unknown): Promise<string> {
    // PHP sorts object keys by UTF-8 bytes. Locale collation differs for case,
    // accents and numeric keys; JSON.stringify also reorders integer-like keys.
    // Emit sorted object members directly so both runtimes hash the same bytes.
    const compareKeys = (a: string, b: string): number => {
        const left = encode.encode(a);
        const right = encode.encode(b);
        for (let index = 0; index < Math.min(left.length, right.length); index++) {
            if (left[index] !== right[index]) return left[index] - right[index];
        }
        return left.length - right.length;
    };
    const serialize = (item: unknown): string => {
        if (Array.isArray(item)) return `[${item.map(serialize).join(',')}]`;
        if (item && typeof item === 'object') {
            return `{${Object.entries(item).filter(([, value]) => value !== undefined)
                .sort(([a], [b]) => compareKeys(a, b))
                .map(([key, value]) => `${JSON.stringify(key)}:${serialize(value)}`).join(',')}}`;
        }
        return JSON.stringify(item) ?? 'null';
    };
    const canonical = serialize(value);
    const digest = await crypto.subtle.digest('SHA-256', encode.encode(canonical));
    return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export class FieldLayoutLoader {
    constructor(
        readonly hosts: FieldHostRegistry,
        readonly manifest: EditorManifest,
        readonly contextToken: string,
        readonly findBlock: (blockUid: string) => {
            node: ProseMirrorNode;
            revision: number;
            destination: FieldLayoutDestination;
        } | null,
        readonly onMounted: (record: FieldHostRecord) => void,
    ) {}

    #queue: QueuedRender[] = [];
    #flushTimer: number | null = null;
    #inFlight = new Set<AbortController>();
    #opening = new Map<string, { record: FieldHostRecord; promise: Promise<FieldHostRecord> }>();
    #hashing = new Set<Promise<string>>();
    /** FieldLayouts fetched before the Block node exists (insert prefetch). */
    #pendingByUid = new Map<string, FieldLayoutResponse>();
    #destroyed = false;

    /** Aborts anything in flight; the editor calls this when it tears down. */
    destroy(): void {
        this.#destroyed = true;
        if (this.#flushTimer !== null) window.clearTimeout(this.#flushTimer);
        this.#flushTimer = null;
        this.#opening.clear();
        this.#pendingByUid.clear();
        for (const controller of this.#inFlight) controller.abort();
        this.#inFlight.clear();
        for (const queued of this.#queue.splice(0)) queued.reject(new Error('loaderDestroyed'));
    }

    /**
     * Renders a FieldLayout for a Block that is not yet in the document.
     * Stored until NodeView `open()` consumes it so first paint is complete.
     */
    async prefetchNewBlock(args: {
        blockUid: string;
        blockTypeUid: string;
        block: Record<string, unknown>;
        destination: FieldLayoutDestination;
        documentRevision: number;
    }): Promise<void> {
        await this.prefetchNewBlocks([args]);
    }

    /**
     * Batch-prefetch FieldLayouts for insert/duplicate before nodes exist.
     * One HTTP round trip per BATCH_LIMIT items; results land in `#pendingByUid`.
     */
    async prefetchNewBlocks(
        items: readonly {
            blockUid: string;
            blockTypeUid: string;
            block: Record<string, unknown>;
            destination: FieldLayoutDestination;
            documentRevision: number;
        }[],
    ): Promise<void> {
        if (this.#destroyed) throw new Error('loaderDestroyed');
        const mountable = items.filter((item) => (
            Boolean(this.manifest.blockTypes[item.blockTypeUid]?.fieldLayoutUid)
        ));
        if (!mountable.length) return;

        const prepared = await Promise.all(mountable.map(async (item) => ({
            item,
            blockHash: await hashFieldLayoutBlock(item.block),
            requestId: crypto.randomUUID(),
        })));

        for (let index = 0; index < prepared.length; index += BATCH_LIMIT) {
            const chunk = prepared.slice(index, index + BATCH_LIMIT);
            const controller = new AbortController();
            this.#inFlight.add(controller);
            try {
                const response = await this.#request({
                    editorContextToken: this.contextToken,
                    items: chunk.map(({ item, blockHash, requestId }) => ({
                        requestId,
                        documentRevision: item.documentRevision,
                        blockHash,
                        block: item.block,
                        destination: item.destination,
                    })),
                }, controller.signal);
                const byRequestId = new Map(
                    response.results.map((result) => [result.requestId, result]),
                );
                for (const { item, requestId } of chunk) {
                    const result = byRequestId.get(requestId);
                    if (!result || result.ok === false) {
                        throw new FieldLayoutMountError(
                            (result && result.ok === false ? result.error : null) ?? 'fieldLayoutRejected',
                            result && result.ok === false ? result.message : null,
                        );
                    }
                    this.#pendingByUid.set(item.blockUid, result);
                }
            } finally {
                this.#inFlight.delete(controller);
            }
        }
    }

    open(blockUid: string): Promise<FieldHostRecord> {
        const record = this.hosts.get(blockUid);
        if (!record || record.status === 'disposed') {
            return Promise.reject(new Error('blockRemoved'));
        }
        if (record.status === 'mounted') return Promise.resolve(record);

        // Coalesce only equivalent revision/hash requests. A newer document
        // revision must start a replacement — returning the stale pending left
        // failed hosts when the old response was rejected by the revision guard.
        if (record.status === 'loading' && record.pending) {
            const current = this.findBlock(blockUid);
            if (!current) return Promise.reject(new Error('blockRemoved'));
            const openingKey = `${blockUid}:${current.revision}`;
            const existingOpening = this.#opening.get(openingKey);
            if (existingOpening?.record === record) return existingOpening.promise;
            if (record.requestKey?.startsWith(`${current.revision}:`)) {
                return record.pending;
            }
            // Fall through: revision advanced while an older request was in flight.
        }

        // Prefetched insert HTML — mount as soon as the host is in the document
        // so the first painted frame is complete (no shell→fields jump).
        // open() often runs mid-NodeView construction (before ProseMirror inserts
        // the Block); wait for connect rather than failing as disconnected.
        const pending = this.#pendingByUid.get(blockUid);
        if (pending) {
            this.#pendingByUid.delete(blockUid);
            const mounting = this.#mount(record, pending);
            record.pending = mounting.finally(() => {
                if (record.pending === mounting) record.pending = null;
            });
            return record.pending;
        }

        const current = this.findBlock(blockUid);
        if (!current) return Promise.reject(new Error('blockRemoved'));
        const openingKey = `${blockUid}:${current.revision}`;
        const existing = this.#opening.get(openingKey);
        if (existing?.record === record) return existing.promise;

        // Hashing is asynchronous. Claim the Block before hashing so NodeView
        // construction and policy reconciliation cannot enqueue the same layout
        // several times in that window. Flip to loading here (before await) so
        // Retry / openFields sync paints busy state immediately.
        record.status = 'loading';
        record.errorMessage = null;
        const opening = this.#open(blockUid).finally(() => {
            if (this.#opening.get(openingKey)?.promise === opening) this.#opening.delete(openingKey);
        });
        // Undo can recreate a host with the same UID and revision. Its request
        // must not join an in-flight render owned by the disposed host.
        this.#opening.set(openingKey, { record, promise: opening });
        return opening;
    }

    /**
     * Author Retry after a failed mount. Clears failed state, drops any stale
     * in-flight promise for this Block, and starts a fresh request.
     */
    retry(blockUid: string): Promise<FieldHostRecord> {
        const record = this.hosts.get(blockUid);
        if (!record || record.status === 'disposed') {
            return Promise.reject(new Error('blockRemoved'));
        }
        if (record.status === 'mounted') return Promise.resolve(record);

        record.abortController?.abort();
        record.abortController = null;
        record.pending = null;
        record.requestId = null;
        record.requestKey = null;
        record.errorMessage = null;
        record.status = 'idle';

        const current = this.findBlock(blockUid);
        if (current) {
            this.#opening.delete(`${blockUid}:${current.revision}`);
        }

        return this.open(blockUid);
    }

    async #open(blockUid: string): Promise<FieldHostRecord> {
        const record = this.hosts.get(blockUid);
        const current = this.findBlock(blockUid);
        if (!record || !current || record.status === 'disposed') throw new Error('blockRemoved');
        if (record.status === 'mounted') return record;

        const block = current.node.toJSON();
        const hashing = hashFieldLayoutBlock(block);
        this.#hashing.add(hashing);
        let blockHash: string;
        try {
            blockHash = await hashing;
        } finally {
            this.#hashing.delete(hashing);
        }
        if (this.#destroyed || this.hosts.get(blockUid) !== record) {
            throw new Error('blockRemoved');
        }
        const type = this.manifest.blockTypes[String(current.node.attrs.blockTypeUid)];
        // Block types with no Craft field layout have nothing to mount.
        if (!type?.fieldLayoutUid) {
            return record;
        }
        const requestKey = `${current.revision}:${blockHash}:${type.fieldLayoutUid}:${type.fieldLayoutHash ?? ''}`;
        if (record.status === 'loading' && record.requestKey === requestKey && record.pending) return record.pending;

        record.abortController?.abort();
        const controller = new AbortController();
        const requestId = crypto.randomUUID();
        record.status = 'loading';
        record.abortController = controller;
        record.requestId = requestId;
        record.requestKey = requestKey;

        record.pending = this.#enqueue({
            blockUid,
            requestId,
            blockHash,
            record,
            payload: {
                requestId,
                documentRevision: current.revision,
                blockHash,
                block,
                destination: current.destination,
            },
        }).then((response) => {
            const latest = this.findBlock(blockUid);
            const latestType = this.manifest.blockTypes[String(latest?.node.attrs.blockTypeUid)];
            if (
                record.status === 'disposed'
                || record.requestId !== response.requestId
                || !latest
                || response.blockUid !== blockUid
                || response.blockTypeUid !== String(latest.node.attrs.blockTypeUid)
                || response.documentRevision !== latest.revision
                || response.blockHash !== blockHash
                || response.fieldLayoutUid !== latestType?.fieldLayoutUid
                || response.fieldLayoutHash !== latestType?.fieldLayoutHash
            ) {
                throw new Error('staleFieldLayoutResponse');
            }
            return this.#mount(record, response);
        }).catch((error: unknown) => {
            if (
                record.status !== 'disposed'
                && record.requestId === requestId
                && !controller.signal.aborted
            ) {
                record.status = 'failed';
                record.errorMessage = formatFieldLayoutError(error);
                console.error(`[Vizy] FieldLayout failed for block ${blockUid}`, error);
            }
            throw error;
        }).finally(() => {
            if (record.requestId === requestId) record.pending = null;
        });
        return record.pending;
    }

    /**
     * Queues one Block's render and returns its own response. Eager policy and
     * NodeView construction arrive as a burst of open() calls; coalescing them
     * into a single request keeps that to one round trip instead of one per Block.
     *
     * Wait for hashes already in progress when the opening burst is flushed.
     * Native crypto may settle siblings on different event-loop turns.
     */
    #enqueue(entry: Omit<QueuedRender, 'resolve' | 'reject'>): Promise<FieldLayoutResponse> {
        return new Promise<FieldLayoutResponse>((resolve, reject) => {
            if (this.#destroyed) {
                reject(new Error('loaderDestroyed'));
                return;
            }
            this.#queue.push({ ...entry, resolve, reject });
            if (this.#flushTimer !== null) return;
            this.#flushTimer = window.setTimeout(async () => {
                await Promise.allSettled([...this.#hashing]);
                this.#flushTimer = null;
                if (!this.#destroyed) this.#flush();
            }, 0);
        });
    }

    #flush(): void {
        const queued = this.#queue.splice(0);
        for (let index = 0; index < queued.length; index += BATCH_LIMIT) {
            void this.#sendBatch(queued.slice(index, index + BATCH_LIMIT));
        }
    }

    async #sendBatch(entries: QueuedRender[]): Promise<void> {
        const controller = new AbortController();
        this.#inFlight.add(controller);
        try {
            const response = await this.#request({
                editorContextToken: this.contextToken,
                items: entries.map((entry) => entry.payload),
            }, controller.signal);
            // Matched on requestId, which is unique per queued render, so a
            // repeated Block UID in one batch cannot cross-resolve.
            const byRequestId = new Map(response.results.map((result) => [result.requestId, result]));
            for (const entry of entries) {
                const result = byRequestId.get(entry.requestId);
                if (!result) {
                    entry.reject(new FieldLayoutMountError('missingBatchResult'));
                } else if (result.ok === false) {
                    entry.reject(new FieldLayoutMountError(
                        result.error ?? 'fieldLayoutRejected',
                        result.message,
                    ));
                } else {
                    entry.resolve(result);
                }
            }
        } catch (error: unknown) {
            for (const entry of entries) entry.reject(error);
        } finally {
            this.#inFlight.delete(controller);
        }
    }

    async #request(data: unknown, signal: AbortSignal): Promise<BatchResponse> {
        if (window.Craft?.sendActionRequest) {
            const result = await window.Craft.sendActionRequest<BatchResponse>('POST', 'vizy/field-layout/render-batch', {
                data,
                headers: { 'Content-Type': 'application/json' },
                signal,
            });
            if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
            return result.data;
        }
        const response = await fetch('/actions/vizy/field-layout/render-batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            signal,
        });
        if (!response.ok) throw new Error(`fieldLayoutRequest:${response.status}`);
        return response.json() as Promise<BatchResponse>;
    }

    /**
     * Adopts a trusted form shipped in the initial editor bootstrap. The live
     * document still has to agree on Block and layout identity; unlike an AJAX
     * response it has no meaningful client revision because it predates TipTap.
     */
    adoptInitial(response: FieldLayoutResponse): FieldHostRecord | null {
        const record = this.hosts.get(response.blockUid);
        const current = this.findBlock(response.blockUid);
        const type = current
            ? this.manifest.blockTypes[String(current.node.attrs.blockTypeUid)]
            : undefined;
        if (
            !record
            || !current
            || record.status === 'disposed'
            || response.blockTypeUid !== String(current.node.attrs.blockTypeUid)
            || response.fieldLayoutUid !== type?.fieldLayoutUid
            || response.fieldLayoutHash !== type?.fieldLayoutHash
        ) {
            return null;
        }
        if (record.status === 'mounted') return record;

        record.abortController?.abort();
        record.requestId = null;
        record.requestKey = null;
        // Connected hosts apply synchronously inside #mount (no paint flash).
        void this.#mount(record, response);
        return record;
    }

    /** Marks a Block host failed from a bootstrap-time PHP render error. */
    adoptInitialFailure(failure: FieldLayoutFailure): FieldHostRecord | null {
        const blockUid = failure.blockUid;
        if (!blockUid) return null;
        const record = this.hosts.get(blockUid);
        const current = this.findBlock(blockUid);
        if (!record || !current || record.status === 'disposed' || record.status === 'mounted') {
            return null;
        }
        record.abortController?.abort();
        record.requestId = null;
        record.requestKey = null;
        record.status = 'failed';
        record.errorMessage = formatFieldLayoutError(
            new FieldLayoutMountError(failure.error, failure.message),
        );
        record.root.innerHTML = '';
        console.error(`[Vizy] Initial FieldLayout failed for block ${blockUid}`, failure);
        this.#syncBlockError(record);
        return record;
    }

    /**
     * Apply FieldLayout HTML + Craft instance scripts once the host is in the
     * document. Prefetch `open()` often runs mid-NodeView construction — before
     * ProseMirror inserts the Block — so a disconnected host waits briefly
     * (microtask + rAF) instead of failing as `fieldHostDisconnected`.
     *
     * Already-connected hosts (bootstrap adoptInitial) apply synchronously so
     * the first paint is fields, not a loading flash.
     */
    #mount(record: FieldHostRecord, response: FieldLayoutResponse): Promise<FieldHostRecord> {
        if (record.root.isConnected) {
            this.#applyMount(record, response);
            return Promise.resolve(record);
        }

        // Keep loading UI while waiting for ProseMirror to insert the NodeView.
        record.status = 'loading';
        record.errorMessage = null;

        return new Promise((resolve) => {
            const finish = (connected: boolean): void => {
                if (record.status === 'disposed') {
                    resolve(record);
                    return;
                }
                if (connected && record.root.isConnected) {
                    this.#applyMount(record, response);
                } else {
                    this.#failMount(
                        record,
                        new FieldLayoutMountError(
                            'fieldHostDisconnected',
                            'Block fields could not initialize because the field host was not in the document.',
                        ),
                    );
                }
                resolve(record);
            };

            queueMicrotask(() => {
                if (record.status === 'disposed') {
                    resolve(record);
                    return;
                }
                if (record.root.isConnected) {
                    finish(true);
                    return;
                }
                // One frame covers insert races where the NodeView DOM lands after
                // the constructor microtask queue drains.
                requestAnimationFrame(() => finish(record.root.isConnected));
            });
        });
    }

    #applyMount(record: FieldHostRecord, response: FieldLayoutResponse): void {
        try {
            record.root.innerHTML = response.html;
            stampLayoutTabIndexes(record.root);
            // Craft field scripts (Selectize etc.) use document `$('#id')`. They must
            // run while this host is connected — Craft.appendBodyHtml's global async
            // queue is too late when TipTap remounts or the CP queue is backed up.
            if (!record.root.isConnected) {
                throw new FieldLayoutMountError(
                    'fieldHostDisconnected',
                    'Block fields could not initialize because the field host was not in the document.',
                );
            }
            // Head assets (CSS) can share a layout hash; instance bodyHtml always
            // carries per-block IDs and must run for every mount.
            const headKey = `${response.fieldLayoutHash}:${response.headHtml}`;
            if (response.headHtml && !mountedHeadResources.has(headKey)) {
                applyCraftFieldHtml(response.headHtml, document.head);
                mountedHeadResources.add(headKey);
            }
            applyCraftFieldHtml(response.bodyHtml, document.body);
            window.Craft?.initUiElements?.(record.root);
            record.response = response;
            record.errorMessage = null;
            record.status = 'mounted';
            this.#syncBlockTabs(record, response);
            // bindHost clears disposals first; tip wiring must land after it.
            this.onMounted(record);
            record.disposals.push(wireDismissibleTips(record.root));
        } catch (error: unknown) {
            this.#failMount(record, error);
            // Do not rethrow — adoptInitial would otherwise abort the whole editor
            // boot for one bad Selectize/script. open() callers read record.status.
        }
    }

    #failMount(record: FieldHostRecord, error: unknown): void {
        record.status = 'failed';
        record.response = null;
        record.errorMessage = formatFieldLayoutError(error);
        record.root.innerHTML = '';
        console.error(`[Vizy] FieldLayout mount crashed for block ${record.blockUid}`, error);
        this.#syncBlockError(record);
    }

    /**
     * Wire Craft layout tab labels onto the Block header and show tab 0.
     * Single-tab layouts leave the UI empty (Hyper-style).
     */
    #syncBlockTabs(record: FieldHostRecord, response: FieldLayoutResponse): void {
        // The same persisted Block can appear in multiple open editors.
        const block = record.root.closest<VizyBlockElement>('vizy-block');
        const labels = response.tabLabels ?? [];
        if (block) {
            block.layoutTabLabels = labels;
            block.fieldLayoutError = null;
            block.fieldLayoutState = 'mounted';
        }
        selectLayoutTab(record, 0);
    }

    #syncBlockError(record: FieldHostRecord): void {
        const block = record.root.closest<VizyBlockElement>('vizy-block');
        if (!block) return;
        block.fieldLayoutState = 'error';
        block.fieldLayoutError = record.errorMessage;
        block.fieldLayoutRetrying = false;
    }
}
