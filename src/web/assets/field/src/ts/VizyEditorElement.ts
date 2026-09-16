import { Editor, getMarkRange, posToDOMRect } from '@tiptap/core';
import { BlockUiStateRegistry, FieldHostRegistry, type FieldHostRecord } from './registries';
import { FieldLayoutLoader } from './FieldLayoutLoader';
import { eagerFieldLayoutBlockUids } from './field-layout-mount-policy';
import { getFieldAdapter } from './transport/adapters';
import {
    adaptCanonicalForEditor,
    restoreCanonicalFromEditor,
} from './transport/opaque';
import { createEditorExtensions } from './editor-schema';
import { reconcileDocument } from './reconcile-document';
import { createInsertionRegistry } from './insertion/registry';
import { registerLayoutInsertion } from './layout/insertion';
import { resolveLayoutPresets } from './layout/presets';
import type { InsertionRegistry } from './insertion/types';
import { InsertionOverlay } from './insertion/overlay';
import type { CanonicalNode, EditorBootstrap, EditorManifest, JsonValue } from './types';
import type { ToolbarUiActionDetail } from './toolbar/VizyToolbarElement';
import { refreshBlockSummaries } from './blocks/summary-sync';
import { selectLayoutTab } from './layout-tabs';
import {
    collapseEphemeralRootParagraph,
    ensureRootTypingSurface,
} from './typing-surface';
import type { VizyBlockElement } from './components/VizyBlockElement';
import { consumePendingBootstrap } from './bootstrap-queue';
import { VizyToolbarElement } from './toolbar/VizyToolbarElement';
import { VizyBubbleElement } from './toolbar/VizyBubbleElement';
import {
    activeLinkAttrs,
    VizyLinkBubbleElement,
} from './semantic/link-bubble';
import {
    isImageNodeSelected,
    VizyImageBubbleElement,
} from './semantic/image-bubble';
import {
    activeEmbedKind,
    VizyEmbedBubbleElement,
} from './semantic/embed-bubble';
import { hydrateImagePreviews } from './semantic/image-preview-cache';
import './semantic/link-dialog';
import './semantic/image-dialog';
import './semantic/url-node-dialog';
import { NodeSelection } from '@tiptap/pm/state';
import { rewriteCraftSerializedForm } from './serialize-form-capture';
import {
    EDITOR_FIELD_HAS_FOCUS_ATTR,
    installEditorSelectionGuard,
    resolveEditorBody,
} from './editor-field-focus';
import { playBlockInsertAnimation } from './blocks/block-insert-animation';
import { duplicateBlock } from './blocks/actions';
import { paintFieldBootFailure } from './field-boot-failure';

type FinalizationStatus = 'complete' | 'pending' | 'failed';
export interface ServerDocumentResult {
    requestKind: 'save' | 'autosave' | 'livePreview' | 'validation';
    submittedClientRevision: number;
    canonicalDocument: CanonicalNode;
    success: boolean;
    finalizationStatus: FinalizationStatus;
    finalizationErrors?: readonly { code?: string; message?: string }[];
    retryToken?: string | null;
}
type SubmissionMetadata = {
    editorId: string;
    fieldUid: string;
    editorContextToken: string;
    generation: number;
    clientRevision: number;
    requestKind: string;
};

function stable(value: unknown): string {
    return JSON.stringify(value, (_key, item) => {
        if (!item || typeof item !== 'object' || Array.isArray(item)) return item;
        return Object.fromEntries(Object.entries(item).sort(([a], [b]) => a.localeCompare(b)));
    });
}

/** How long to keep waiting for Craft's ElementEditor before giving up on the hook. */
const ELEMENT_EDITOR_TIMEOUT_MS = 10_000;

type SerializeFormHook = (event: { data: { serialized: string } }) => void;

/** The slice of `Craft.ElementEditor` this element touches. */
interface ElementEditorLike {
    on?: (name: string, callback: SerializeFormHook) => void;
    off?: (name: string, callback: SerializeFormHook) => void;
    serializeForm?: (removeActionParams?: boolean) => string;
    /** Craft's post-save baseline; null until something has actually been saved. */
    lastSerializedValue?: string | null;
}


export class VizyEditorElement extends HTMLElement {
    #bootstrap: EditorBootstrap | null = null;
    #editor: Editor | null = null;
    #mount: HTMLElement | null = null;
    #input: HTMLInputElement | null = null;
    #ui = new BlockUiStateRegistry();
    #hosts = new FieldHostRegistry();
    #loader: FieldLayoutLoader | null = null;
    #fieldLayoutPolicyDoc: object | null = null;
    #eagerFieldLayoutUids = new Set<string>();
    #insertion: InsertionRegistry | null = null;
    #insertionOverlay: InsertionOverlay | null = null;
    #toolbar: VizyToolbarElement | null = null;
    #bubble: VizyBubbleElement | null = null;
    #linkBubble: VizyLinkBubbleElement | null = null;
    #imageBubble: VizyImageBubbleElement | null = null;
    #embedBubble: VizyEmbedBubbleElement | null = null;
    #disposals: Array<() => void> = [];
    #revision = 0;
    #blockRevisions = new Map<string, number>();
    #writesEnabled = false;
    #contentTouched = false;
    #persistedBaselineCanonical = '';
    /** Last transport metadata minted, keyed by request kind + revision + content. */
    #lastSubmissionMetadata: { key: string; metadata: SubmissionMetadata } | null = null;
    #finalizationStatus: FinalizationStatus = 'complete';
    #finalizationErrors: readonly { code?: string; message?: string }[] = [];
    #retryToken: string | null = null;
    #generation = 0;
    #submissions = new Map<number, { revision: number; canonical: string }>();
    #reconciling = false;
    #destroyed = false;
    #disconnectTimer: number | null = null;
    /** True while an insertion palette choice is executing — skips gutter/summary work. */
    #insertionSuspended = false;

    set bootstrap(value: EditorBootstrap) {
        if (this.#editor) throw new Error('editorAlreadyBootstrapped');
        this.#bootstrap = structuredClone(value);
        if (this.isConnected) queueMicrotask(() => this.#scheduleInitialize());
    }

    connectedCallback(): void {
        if (this.#disconnectTimer !== null) {
            window.clearTimeout(this.#disconnectTimer);
            this.#disconnectTimer = null;
        }
        queueMicrotask(() => this.#scheduleInitialize());
    }

    disconnectedCallback(): void {
        // Craft often detaches field markup briefly while wiring the Element Editor.
        // Defer teardown so a same-tick reconnect can still mount the editor.
        if (this.#disconnectTimer !== null) {
            window.clearTimeout(this.#disconnectTimer);
        }
        this.#disconnectTimer = window.setTimeout(() => {
            this.#disconnectTimer = null;
            if (!this.isConnected) {
                this.#teardown();
            }
        }, 0);
    }

    #scheduleInitialize(): void {
        if (!this.#bootstrap) {
            const embedded = this.#readEmbeddedBootstrap();
            if (embedded) {
                this.#bootstrap = structuredClone(embedded);
            } else if (this.id) {
                const pending = consumePendingBootstrap(this.id);
                if (pending) {
                    this.bootstrap = pending;
                    return;
                }
            }
        }
        // Hosted editors embed bootstrap in markup; missing it leaves an empty shell.
        if (!this.#bootstrap) {
            if (this.hasAttribute('data-vizy-hosted')) {
                this.#failBoot(new Error('hostedBootstrapMissing'));
            }
            return;
        }
        try {
            this.#initialize();
        } catch (error) {
            this.#failBoot(error);
        }
    }

    /** Hosted Vizy: bootstrap JSON shipped beside the hidden document input. */
    #readEmbeddedBootstrap(): EditorBootstrap | null {
        const node = this.querySelector(':scope > template[data-vizy-bootstrap]');
        // <template> content lives in .content; textContent on the host also works.
        const raw = (node instanceof HTMLTemplateElement
            ? node.content.textContent
            : node?.textContent)?.trim();
        if (!raw) return null;
        try {
            const parsed = JSON.parse(raw) as EditorBootstrap;
            node?.remove();
            return parsed;
        } catch {
            return null;
        }
    }

    /**
     * Surface a boot failure instead of leaving an empty field frame. Tears down
     * any partial UI, keeps the hidden document input, paints the alert.
     */
    #failBoot(error: unknown): void {
        console.error('[Vizy] Editor failed to initialize', error);
        try {
            this.#teardown();
        } catch {
            // Partial construction may leave teardown itself unhappy.
        }
        paintFieldBootFailure(this, error);
    }

    get editor(): Editor | null {
        return this.#editor;
    }

    get insertionRegistry(): InsertionRegistry | null {
        return this.#insertion;
    }

    get isDirty(): boolean {
        if (!this.#editor || !this.#contentTouched) return false;
        return stable(this.#canonicalProjection()) !== this.#persistedBaselineCanonical;
    }

    get fullySaved(): boolean {
        return !this.isDirty && this.#finalizationStatus === 'complete';
    }

    get finalizationState(): {
        status: FinalizationStatus;
        errors: readonly { code?: string; message?: string }[];
        retryToken: string | null;
    } {
        return {
            status: this.#finalizationStatus,
            errors: this.#finalizationErrors,
            retryToken: this.#retryToken,
        };
    }

    flush(_reason: 'submit' | 'autosave' | 'livePreview' | 'serialize' | 'validation'): string {
        // Hosted nested editors can be read by the parent adapter before TipTap
        // finishes booting — return the SSR/bootstrap hidden input, don't throw.
        if (!this.#editor || !this.#input) {
            if (this.#bootstrap?.hosted && this.#input?.value) {
                return this.#input.value;
            }
            throw new Error('editorNotReady');
        }
        this.#flushMountedFields();
        const canonical = this.#canonicalProjection();
        const encoded = stable(canonical);
        this.#input.value = encoded;
        return encoded;
    }

    acceptServerResult(result: ServerDocumentResult, generation: number): void {
        const submission = this.#submissions.get(generation);
        if (
            generation !== this.#generation
            || !submission
            || result.submittedClientRevision !== submission.revision
        ) return;
        if (result.requestKind === 'livePreview') return;
        if (!result.success) return;
        this.#finalizationStatus = result.finalizationStatus;
        this.#finalizationErrors = result.finalizationErrors ?? [];
        this.#retryToken = result.retryToken ?? null;
        // The accepted server document is the content persistence fact. Reuse
        // UID-keyed hosts while adapting any normalization back into TipTap.
        if (result.submittedClientRevision === this.#revision) {
            this.#replaceWithServerCanonical(result.canonicalDocument);
            this.#acceptHostIdentities();
            // Baseline must use the same projection as isDirty/flush — raw
            // getJSON() / server envelopes can differ after restore+collapse.
            this.#persistedBaselineCanonical = stable(this.#canonicalProjection());
            this.#contentTouched = false;
            return;
        }
        // Pending/failed persistence advances the content baseline to prevent
        // autosave loops, but fullySaved remains false until the author catches up.
        this.#persistedBaselineCanonical = stable(this.#projectDocument(result.canonicalDocument));
        this.#contentTouched = stable(this.#canonicalProjection()) !== this.#persistedBaselineCanonical;
    }

    beginSubmission(): { generation: number; clientRevision: number } {
        const generation = ++this.#generation;
        this.#submissions.clear();
        this.#submissions.set(generation, {
            revision: this.#revision,
            canonical: stable(this.#canonicalProjection()),
        });
        return { generation, clientRevision: this.#revision };
    }

    destroy(): void {
        if (this.#destroyed) return;
        this.#destroyed = true;
        if (this.#disconnectTimer !== null) {
            window.clearTimeout(this.#disconnectTimer);
            this.#disconnectTimer = null;
        }
        this.#teardown();
    }

    #teardown(): void {
        for (const dispose of this.#disposals.splice(0)) dispose();
        this.#hosts.destroy();
        this.#ui.clear();
        this.#insertion = null;
        this.#insertionOverlay?.destroy();
        this.#insertionOverlay = null;
        this.#editor?.destroy();
        this.#editor = null;
        this.#loader?.destroy();
        this.#loader = null;
        this.#fieldLayoutPolicyDoc = null;
        this.#eagerFieldLayoutUids.clear();
        this.#mount = null;
        this.#toolbar = null;
        this.#bubble = null;
        this.#linkBubble = null;
        this.#imageBubble = null;
        this.#embedBubble = null;
        this.querySelector('.vizy-editor-shell')?.remove();
    }

    /**
     * Requests one Block's FieldLayout. Failures are recorded on the host and
     * painted on the Block body — swallow the rejection so it is not an
     * unhandled promise, then re-sync so the alert is shown.
     */
    #mountFields(blockUid: string): void {
        const pending = this.#loader?.open(blockUid);
        // open() flips the host record to `loading` synchronously, so this first
        // sync is what puts the in-flight state on the Block header.
        this.#syncFieldLayoutState(blockUid);
        void pending
            ?.catch(() => this.#refreshSummaries())
            .finally(() => this.#syncFieldLayoutState(blockUid));
    }

    /** Author Retry — clear failed host state and request a fresh FieldLayout. */
    #retryFieldLayout(blockUid: string): void {
        const pending = this.#loader?.retry(blockUid);
        this.#syncFieldLayoutState(blockUid);
        void pending
            ?.catch(() => this.#refreshSummaries())
            .finally(() => this.#syncFieldLayoutState(blockUid));
    }

    /**
     * Cache by immutable ProseMirror document identity. NodeViews ask this while
     * they are being constructed, so recalculating by walking all Blocks for
     * every NodeView would turn a 500-Block load into quadratic work.
     */
    #eagerFieldLayouts(): ReadonlySet<string> {
        if (!this.#editor || !this.#bootstrap) return this.#eagerFieldLayoutUids;
        const doc = this.#editor.state.doc;
        if (this.#fieldLayoutPolicyDoc !== doc) {
            this.#fieldLayoutPolicyDoc = doc;
            this.#eagerFieldLayoutUids = new Set(
                eagerFieldLayoutBlockUids(doc, this.#bootstrap.manifest.blockTypes),
            );
        }
        return this.#eagerFieldLayoutUids;
    }

    /** Mount every mountable FieldLayout (batched). SSR covers Blocks already in the document. */
    #mountEagerFieldLayouts(): void {
        if (!this.#editor || !this.#bootstrap) return;
        const eagerUids = this.#eagerFieldLayouts();
        this.#editor.state.doc.descendants((node) => {
            if (node.type.name !== 'vizyBlock') return;
            const uid = String(node.attrs.blockUid);
            if (!eagerUids.has(uid)) return;
            const type = this.#bootstrap!.manifest.blockTypes[String(node.attrs.blockTypeUid)];
            if (!type?.fieldLayoutUid) return;
            this.#hosts.acquire(
                uid,
                String(node.attrs.blockTypeUid),
                type.fieldLayoutUid,
                type.fieldLayoutHash ?? null,
            );
            const status = this.#hosts.get(uid)?.status;
            if (status === 'mounted' || status === 'loading' || status === 'failed') return;
            this.#mountFields(uid);
        });
    }

    #applyFieldLayoutMountPolicy(): void {
        this.#mountEagerFieldLayouts();
    }

    /** Mirrors a host record's status onto its Block header. */
    #syncFieldLayoutState(blockUid: string): void {
        const element = this.querySelector<VizyBlockElement>(
            `vizy-block[data-block-uid="${CSS.escape(blockUid)}"]`,
        );
        if (!element) return;
        const record = this.#hosts.get(blockUid);
        const status = record?.status;
        element.fieldLayoutState = status === 'mounted'
            ? 'mounted'
            : status === 'loading'
                ? 'loading'
                : status === 'failed'
                    ? 'error'
                    : 'unmounted';
        element.fieldLayoutError = status === 'failed' ? (record?.errorMessage ?? null) : null;
        if (status === 'mounted' || status === 'failed') {
            element.fieldLayoutRetrying = false;
        }
    }

    /**
     * Starts a Block's FieldLayout mount immediately. Every mountable Block is
     * eager (see `field-layout-mount-policy.ts`); the loader coalesces bursts
     * into batched requests. Name kept for the NodeView service seam.
     *
     * Initial NodeViews often construct before the document baseline settles —
     * the policy pass at end of init starts those with the final revision.
     * Writes must already be enabled before open() or we no-op here.
     */
    #observeFieldViewport(element: HTMLElement): () => void {
        const uid = element.dataset.blockUid;
        let cancelled = false;
        if (uid && this.#writesEnabled) {
            // NodeViews are constructed before onTransaction advances Block
            // revisions. Hash and render after that update so an undo/remount
            // does not immediately invalidate its own FieldLayout response.
            queueMicrotask(() => {
                if (!cancelled && element.isConnected && this.#writesEnabled) this.#mountFields(uid);
            });
        }
        return () => { cancelled = true; };
    }

    #initialize(): void {
        if (!this.#bootstrap || this.#editor || this.#destroyed || !this.isConnected) return;
        this.querySelector('.vizy-editor-shell')?.remove();
        this.#input = this.querySelector<HTMLInputElement>('input[data-vizy-document]');
        if (!this.#input) throw new Error('canonicalInputMissing');
        const manifest = this.#bootstrap.manifest;
        this.#mount = document.createElement('div');
        this.#mount.className = 'vizy-editor-body';
        // One capture guard for the whole field: control presses never focus the
        // contenteditable mid-gesture (Chromium select-all). See editor-field-focus.ts.
        this.#disposals.push(installEditorSelectionGuard(this.#mount));
        this.#toolbar = document.createElement('vizy-toolbar');
        this.#toolbar.controls = manifest.toolbar?.controls ?? [];
        const insertableUids = manifest.field.insertableBlockTypeUids ?? [];
        this.#toolbar.canAddBlock = insertableUids.length > 0;
        // One insertable type → plain + (direct insert). Several → chevron + palette.
        this.#toolbar.addBlockNeedsMenu = insertableUids.length > 1;
        if (insertableUids.length === 1) {
            const sole = manifest.blockTypes[insertableUids[0]!];
            this.#toolbar.addBlockDirectLabel = sole?.name ? `Add ${sole.name}` : null;
        } else {
            this.#toolbar.addBlockDirectLabel = null;
        }
        this.#toolbar.linkAuthoring = {
            linkOptions: this.#bootstrap.linkOptions,
            elementSiteId: this.#bootstrap.elementSiteId,
            linkSelectorStorageKeyPrefix: `VizyInput.LinkTo.${manifest.field.fieldUid || 'field'}`,
        };
        this.#toolbar.imageAuthoring = {
            volumes: this.#bootstrap.imageAuthoring?.volumes ?? [],
            transforms: this.#bootstrap.imageAuthoring?.transforms ?? [],
            defaultTransform: this.#bootstrap.imageAuthoring?.defaultTransform ?? '',
            defaultSource: this.#bootstrap.imageAuthoring?.defaultSource ?? null,
            elementSiteId: this.#bootstrap.elementSiteId,
            linkSelectorStorageKeyPrefix: `VizyInput.${manifest.field.fieldUid || 'field'}`,
        };
        // Same resolved presets slash/gutter Layout use — toolbar opens the chooser.
        this.#toolbar.layoutPresets = resolveLayoutPresets(manifest);
        this.#bubble = document.createElement('vizy-bubble');
        this.#bubble.controls = manifest.bubble?.enabled === false
            ? []
            : (manifest.bubble?.controls ?? []);
        // Link chip (URL · Edit · Unlink) — Formie/PK pattern; separate from formatting strip.
        this.#linkBubble = document.createElement('vizy-link-bubble');
        this.#imageBubble = document.createElement('vizy-image-bubble');
        this.#imageBubble.imageAuthoring = this.#toolbar.imageAuthoring;
        this.#embedBubble = document.createElement('vizy-embed-bubble');
        const surface = document.createElement('div');
        surface.className = 'vizy-editor-surface';
        this.#mount.append(this.#toolbar, surface);
        // Selection bubble portals via pk-popup on first sync — do not park it
        // under the editor body (that forced absolute coords + clipping).
        const shell = document.createElement('div');
        shell.className = 'vizy-editor-shell';
        shell.append(this.#mount);
        this.prepend(shell);
        let editor!: Editor;
        let insertion!: InsertionRegistry;
        const editorId = this.id || `vizy-editor-${manifest.field.fieldUid}`;
        const services = () => ({
            editor,
            manifest,
            ui: this.#ui,
            hosts: this.#hosts,
            insertion,
            // The loader already records the failure on the host record, which
            // the block header renders as an error state. Swallow the rejection
            // here so a rejected layout request doesn't also surface as an
            // unhandled promise error, and re-render so the state is shown.
            openFields: (uid: string) => this.#mountFields(uid),
            observeFieldViewport: (element: HTMLElement) => this.#observeFieldViewport(element),
            refreshSummaries: () => this.#refreshSummaries(),
            blockRevision: (uid: string) => this.#blockRevisions.get(uid) ?? 0,
            flushMountedFields: () => this.#flushMountedFields(),
            duplicateBlock: async (uid: string) => {
                if (!this.#editor) return false;
                return duplicateBlock(this.#editor, uid, {
                    manifest,
                    documentRevision: () => this.#revision,
                    flushMountedFields: () => this.#flushMountedFields(),
                    prefetchNewBlocks: async (items) => {
                        if (!this.#loader) return;
                        await this.#loader.prefetchNewBlocks(items);
                    },
                    animateInsert: playBlockInsertAnimation,
                });
            },
            openAddBlockAbove: (blockUid: string, invoker: HTMLElement) => {
                this.#insertionOverlay?.openAddBlockAbove(blockUid, invoker);
            },
            suspendInsertionSideEffects: () => {
                this.#insertionSuspended = true;
            },
            resumeInsertionSideEffects: () => {
                this.#insertionSuspended = false;
                this.#insertionOverlay?.sync();
                this.#refreshSummaries();
            },
            insertionSideEffectsSuspended: () => this.#insertionSuspended,
        });

        editor = new Editor({
            element: surface,
            extensions: createEditorExtensions(manifest, services),
            content: { type: 'doc', attrs: { schemaVersion: 2 }, content: [] },
            onTransaction: ({ transaction }) => {
                if (!transaction.docChanged) return;
                if (!this.#reconciling) this.#revision += 1;
                if (this.#writesEnabled) {
                    this.#contentTouched = true;
                    // TipTap-native edits (enabled, structure, …) do not touch named
                    // form controls, so Craft's FormObserver would never checkForm /
                    // create a provisional draft. Publish the hidden document + bubble
                    // change so ElementEditor sees the same dirty path as a normal field.
                    this.#publishDocumentToInput();
                }
                this.#updateBlockRevisions(transaction.before, transaction.doc);
                this.#reconcileLiveUids();
            },
        });
        this.#editor = editor;
        if (this.#toolbar) this.#toolbar.editor = editor;
        if (this.#bubble) this.#bubble.editor = editor;
        if (this.#linkBubble) this.#linkBubble.editor = editor;
        if (this.#imageBubble) this.#imageBubble.editor = editor;
        if (this.#embedBubble) this.#embedBubble.editor = editor;
        // Block header tabs toggle Craft panes + Content Area slots for multi-tab layouts.
        const onLayoutTab = ((event: CustomEvent<{ index: number }>) => {
            const block = event.target;
            if (!(block instanceof HTMLElement) || block.localName !== 'vizy-block') return;
            const uid = block.getAttribute('data-block-uid');
            if (!uid) return;
            const record = this.#hosts.get(uid);
            if (!record || record.status !== 'mounted') return;
            selectLayoutTab(record, event.detail.index, block);
        }) as EventListener;
        this.addEventListener('vizy-layout-tab-change', onLayoutTab);
        this.#disposals.push(() => this.removeEventListener('vizy-layout-tab-change', onLayoutTab));

        // Block body Retry after FieldLayout failure — dedicated event so the
        // click path is not lost on the vizy-edit-fields target guard.
        const onRetryFieldLayout = ((event: Event) => {
            const detail = (event as CustomEvent<{ blockUid?: string }>).detail;
            const fromDetail = detail?.blockUid?.trim();
            const fromTarget = event.target instanceof HTMLElement
                ? event.target.getAttribute('data-block-uid')
                : null;
            const blockUid = fromDetail || fromTarget;
            if (!blockUid) return;
            event.stopPropagation();
            this.#retryFieldLayout(blockUid);
        }) as EventListener;
        this.addEventListener('vizy-retry-field-layout', onRetryFieldLayout);
        this.#disposals.push(() => this.removeEventListener('vizy-retry-field-layout', onRetryFieldLayout));

        insertion = createInsertionRegistry(
            {
                editor,
                manifest,
                documentRevision: () => this.#revision,
                createUid: () => crypto.randomUUID(),
                prefetchBlockFieldLayout: async (args) => {
                    if (!this.#loader) return;
                    await this.#loader.prefetchNewBlock({
                        ...args,
                        documentRevision: this.#revision,
                    });
                },
                animateBlockInsert: (blockUid) => playBlockInsertAnimation(blockUid),
            },
            editorId,
            manifest.insertionItems ?? [],
        );
        this.#insertion = insertion;
        this.#disposals.push(registerLayoutInsertion(insertion, manifest));
        // Anchored to the writing surface, not the host: the overlay positions the
        // empty state and inline "+" buttons, which must line up with the prose
        // rather than the toolbar that also lives above it.
        this.#insertionOverlay = new InsertionOverlay(surface, services, {
            onToolbarAddBlockOpenChange: (open) => {
                if (this.#toolbar) this.#toolbar.addBlockOpen = open;
            },
        });
        const onToolbarUi = ((event: CustomEvent<ToolbarUiActionDetail>) => {
            const { action, invoker, hadEditorFocus } = event.detail ?? {};
            if (!invoker || !this.#insertionOverlay) return;
            if (action === 'insert-block') {
                this.#insertionOverlay.openToolbarInsert(invoker, { hadEditorFocus: !!hadEditorFocus });
            }
        }) as EventListener;
        this.#toolbar?.addEventListener('vizy-toolbar-ui', onToolbarUi);
        this.#disposals.push(() => this.#toolbar?.removeEventListener('vizy-toolbar-ui', onToolbarUi));
        editor.on('selectionUpdate', () => {
            if (this.#insertionSuspended) return;
            this.#insertionOverlay?.sync();
            this.#syncBubbles();
        });
        editor.on('blur', () => {
            // Chromium often blurs the CE on mouseup when selecting a non-editable
            // atom (image). Wait a frame — if focus returned (or our hold restored
            // it), keep the chips. Immediate hide was a visible flash with the
            // field ring.
            requestAnimationFrame(() => {
                if (!this.#editor || this.#editor.isDestroyed) return;
                try {
                    if (this.#editor.view.hasFocus()) return;
                } catch {
                    return;
                }
                // Atom select holds data-has-focus through the gesture. Hiding
                // here wiped the image/embed click anchor before re-sync, so the
                // chip opened at top-center instead of the pointer.
                const body = resolveEditorBody(this.#editor.view.dom);
                if (body?.hasAttribute(EDITOR_FIELD_HAS_FOCUS_ATTR)) return;

                // Formatting strip was omitted here — click-off to Title kept it
                // visible while selectionUpdate (in-editor) correctly hid it.
                this.#bubble?.hide();
                this.#linkBubble?.hide();
                // Soft dismiss — keep click anchors for a same-gesture re-sync.
                this.#imageBubble?.hide();
                this.#embedBubble?.hide();
            });
        });
        // Defer overlay/summary work out of ProseMirror's dispatch stack. Running
        // nodeDOM/getBoundingClientRect synchronously during insert was freezing
        // long entries before the first transaction finished (tx stayed at 0).
        editor.on('transaction', ({ transaction }) => {
            if (!transaction.docChanged) return;
            queueMicrotask(() => {
                if (!this.#editor || this.#editor.isDestroyed) return;
                if (this.#insertionSuspended) return;
                this.#insertionOverlay?.sync();
                this.#refreshSummaries();
            });
        });
        this.#disposals.push(() => {
            this.#insertionOverlay?.destroy();
            this.#insertionOverlay = null;
            this.#toolbar?.remove();
            this.#toolbar = null;
            this.#bubble?.remove();
            this.#bubble = null;
            this.#linkBubble?.remove();
            this.#linkBubble = null;
            this.#imageBubble?.remove();
            this.#imageBubble = null;
            this.#embedBubble?.remove();
            this.#embedBubble = null;
        });
        this.#loader = new FieldLayoutLoader(
            this.#hosts,
            manifest,
            this.#bootstrap.editorContextToken,
            (uid) => this.#findBlock(uid),
            (record) => this.#bindHost(record),
        );
        // Preview URLs are session-only — hydrate before NodeViews paint.
        hydrateImagePreviews(this.#bootstrap.imagePreviews);
        this.#setAcceptedCanonical(this.#adaptForEditor(this.#bootstrap.document, manifest));
        this.#adoptInitialFieldLayouts();
        // Compare like with like: the baseline is the projection of what was just
        // loaded, not the raw bootstrap. Content Area materialization can legitimately
        // add empty areas to a Block whose stored content predates them, and that must
        // not read as an author edit and trigger an autosave.
        const loaded = stable(this.#canonicalProjection());
        this.#persistedBaselineCanonical = loaded;
        // Publish to the hidden input immediately rather than waiting for the first
        // capture hook to fire, so the input is correct for any serializer — including
        // Craft paths Vizy does not hook.
        this.#input.value = loaded;
        // Hosted nested editors do not own Craft ElementEditor — the outer Vizy does.
        if (!this.#bootstrap.hosted) {
            this.#registerCaptureHooks();
        }
        this.#writesEnabled = true;
        this.#reconcileLiveUids();
        this.#applyFieldLayoutMountPolicy();
        this.#refreshSummaries();
        this.#insertionOverlay?.sync();
    }

    /**
     * Initial forms are already rendered and carry their field-instance scripts.
     * Adopt synchronously before the browser can paint loading UI, while
     * writes are still disabled so Craft widget setup remains value-neutral.
     */
    #adoptInitialFieldLayouts(): void {
        if (!this.#bootstrap || !this.#loader) return;
        for (const response of this.#bootstrap.initialFieldLayouts ?? []) {
            if (response && typeof response === 'object' && 'ok' in response && response.ok === false) {
                const record = this.#loader.adoptInitialFailure(response);
                if (record) this.#syncFieldLayoutState(record.blockUid);
                continue;
            }
            const record = this.#loader.adoptInitial(response);
            if (record) this.#syncFieldLayoutState(record.blockUid);
        }
    }

    /**
     * Attaches the `serializeForm` hook to Craft's ElementEditor, waiting for the
     * instance if it does not exist yet.
     *
     * That hook is the only thing that keeps the `vizyHost[...]` inputs of a mounted
     * field layout out of the element's serialization, and adds Vizy's autosave
     * metadata. It lives on the ElementEditor instance rather than the form, so it can
     * only be attached once that instance exists — and which of the two initialises
     * first is genuinely undecided, since Vizy's own load is asynchronous.
     *
     * This used to be a single best-effort `$form.data('elementEditor')` read whose
     * result was optional-chained away. Losing that race left nothing stripping the
     * host inputs, so a field layout mounting mid-page added a parameter Craft had
     * never seen in its dirty baseline and Craft autosaved a provisional draft the
     * author never asked for — and every autosave silently lost its Vizy metadata.
     * Neither failure reported itself. Both orders are legitimate, so wait for the
     * instance rather than assuming it.
     */
    #attachElementEditor(
        form: HTMLFormElement,
        serialize: (event: { data: { serialized: string } }) => void,
    ): void {
        let frame = 0;
        const deadline = performance.now() + ELEMENT_EDITOR_TIMEOUT_MS;
        let cancelled = false;
        this.#disposals.push(() => {
            cancelled = true;
            if (frame) cancelAnimationFrame(frame);
        });

        const attempt = () => {
            if (cancelled || this.#destroyed) return;
            const $form = window.$?.(form);
            const editor = $form?.data('elementEditor') as ElementEditorLike | undefined;
            if (!editor?.on) {
                // Craft's ElementEditor is constructed during CP init, which may be
                // after this element upgrades. Give it until the deadline, then stop:
                // a slideout or a bare form may legitimately never have one.
                if (performance.now() < deadline) frame = requestAnimationFrame(attempt);
                return;
            }

            editor.on('serializeForm', serialize);
            this.#disposals.push(() => editor.off?.('serializeForm', serialize));

            // Craft snapshots `serializeForm()` as its dirty baseline during its own
            // init and once more a frame later, so a baseline taken before this hook
            // existed was produced by the unhooked serializer. Re-take it through the
            // hooked one, or the very next check would diff hook output against
            // unhooked output and autosave. Skipped once anything has actually been
            // saved, since then the baseline reflects real persisted state.
            if (editor.lastSerializedValue == null && typeof editor.serializeForm === 'function') {
                $form?.data('initialSerializedValue', editor.serializeForm(true));
            }
        };
        attempt();
    }

    #refreshSummaries(): void {
        if (!this.#editor || !this.#bootstrap) return;
        refreshBlockSummaries(
            this.#editor,
            this.#bootstrap.manifest,
            this.#ui,
            this.#blockRevisions,
        );
    }

    /**
     * Image chip > embed chip (iframe/mediaEmbed) > link chip > formatting strip.
     * Never more than one at once.
     */
    #syncBubbles(): void {
        if (!this.#editor) return;
        const editor = this.#editor;

        if (isImageNodeSelected(editor) && this.#imageBubble && manifestHasImage(this.#bootstrap?.manifest)) {
            this.#bubble?.hide();
            this.#linkBubble?.hide();
            this.#embedBubble?.hide({ clearAnchor: true });
            this.#imageBubble.syncToImage();
            return;
        }

        this.#imageBubble?.hide({ clearAnchor: true });

        const embedKind = activeEmbedKind(editor);
        if (
            embedKind
            && this.#embedBubble
            && manifestHasNode(this.#bootstrap?.manifest, embedKind)
        ) {
            this.#bubble?.hide();
            this.#linkBubble?.hide();
            // Click-relative anchor lives on the bubble (same as image).
            this.#embedBubble.syncToEmbed(embedKind);
            return;
        }

        this.#embedBubble?.hide({ clearAnchor: true });

        const linkAttrs = activeLinkAttrs(editor);

        if (linkAttrs && this.#linkBubble && manifestHasLink(this.#bootstrap?.manifest)) {
            this.#bubble?.hide();
            const linkType = editor.state.schema.marks.link;
            const range = linkType
                ? getMarkRange(editor.state.selection.$from, linkType)
                : null;
            if (!range) {
                this.#linkBubble.hide();
                return;
            }
            this.#linkBubble.syncToLink({
                getClientRect: () => {
                    const liveType = editor.state.schema.marks.link;
                    const liveRange = liveType
                        ? getMarkRange(editor.state.selection.$from, liveType)
                        : null;
                    if (!liveRange) return new DOMRect();
                    return posToDOMRect(editor.view, liveRange.from, liveRange.to);
                },
                contextElement: editor.view.dom,
            }, linkAttrs);
            return;
        }

        this.#linkBubble?.hide();
        this.#syncFormattingBubble();
    }

    #syncFormattingBubble(): void {
        if (!this.#bubble || !this.#editor) return;
        const { selection } = this.#editor.state;
        if (selection.empty || selection instanceof NodeSelection) {
            this.#bubble.hide();
            return;
        }
        // Live rects for pk-popup autoUpdate — do not snapshot once. Floating UI
        // flip/shift keeps the strip in the viewport (Craft header / field edge).
        const editor = this.#editor;
        this.#bubble.syncToSelection({
            getClientRect: () => {
                const { selection: live } = editor.state;
                if (live.empty) return new DOMRect();
                return posToDOMRect(editor.view, live.from, live.to);
            },
            contextElement: editor.view.dom,
        });
    }

    #findBlock(uid: string): {
        node: import('@tiptap/pm/model').Node;
        revision: number;
        destination: { kind: 'root' };
    } | null {
        let found: import('@tiptap/pm/model').Node | null = null;
        let foundPos: number | null = null;
        this.#editor?.state.doc.descendants((node, pos) => {
            if (node.type.name === 'vizyBlock' && node.attrs.blockUid === uid) {
                found = node;
                foundPos = pos;
                return false;
            }
            return found === null;
        });
        if (!found || foundPos === null || !this.#editor) return null;
        return { node: found, revision: this.#blockRevisions.get(uid) ?? 0, destination: { kind: 'root' } };
    }

    #reconcileLiveUids(): void {
        queueMicrotask(() => {
            if (!this.#editor || this.#editor.isDestroyed) return;
            // A subsequent undo may already have restored a removed Block by
            // the time this runs. Dispose against the current document only.
            const live = new Set<string>();
            this.#editor.state.doc.descendants((node) => {
                if (node.type.name === 'vizyBlock') live.add(String(node.attrs.blockUid));
            });
            this.#hosts.reconcile(live);
            this.#ui.reconcile(live);
            this.#applyFieldLayoutMountPolicy();
        });
    }

    /**
     * A placement's wrapper may live in the Block's leading host or in any Content
     * Area's trailing fragment, so lookups have to span every host the Block owns.
     */
    #findWrapper(record: FieldHostRecord, wrapperId: string): HTMLElement | null {
        const selector = `#${CSS.escape(wrapperId)}`;
        for (const root of this.#hosts.roots(record.blockUid)) {
            const wrapper = root.querySelector<HTMLElement>(selector);
            if (wrapper) return wrapper;
        }
        return null;
    }

    #bindHost(record: FieldHostRecord): void {
        for (const dispose of record.disposals.splice(0)) dispose();
        record.capturedValues.clear();
        for (const metadata of record.response?.fields ?? []) {
            const wrapper = this.#findWrapper(record, metadata.wrapperId);
            if (!wrapper) continue;
            const adapter = getFieldAdapter(metadata.adapterId);
            // Snapshot what the server rendered, before anything can edit it, so the
            // flush can tell a real edit from the mere fact of having mounted.
            record.capturedValues.set(metadata.fieldLayoutElementUid, adapter.read(wrapper));
            record.disposals.push(adapter.bind(wrapper, () => {
                if (!this.#writesEnabled) return;
                this.#contentTouched = true;
                this.#revision += 1;
                // The document must already contain live edits when copy,
                // delete, drag or dirty-state checks run before the next save.
                this.#flushMountedFields(record.blockUid);
                this.#publishDocumentToInput();
            }));
        }
    }

    #flushMountedFields(onlyBlockUid?: string): void {
        if (!this.#editor) return;
        const writes = new Map<number, {
            fieldSlots: Record<string, JsonValue>;
            matrixAnchorUid: string | null;
        }>();
        const captures: Array<{ record: FieldHostRecord; uid: string; value: JsonValue }> = [];
        this.#editor.state.doc.descendants((node, pos) => {
            if (node.type.name !== 'vizyBlock') return;
            if (onlyBlockUid && node.attrs.blockUid !== onlyBlockUid) return;
            const record = this.#hosts.get(String(node.attrs.blockUid));
            if (record?.status !== 'mounted' || !record.response) return;
            // PHP can encode an empty slot map as []. Named properties assigned
            // to a JavaScript array disappear when the document is serialized.
            const slots = structuredClone({ ...(node.attrs.fieldSlots ?? {}) }) as Record<string, JsonValue>;
            let changed = false;
            let matrixAnchorUid = (node.attrs.matrixAnchorUid as string | null | undefined) ?? null;
            for (const metadata of record.response.fields) {
                const wrapper = this.#findWrapper(record, metadata.wrapperId);
                if (!wrapper) continue;
                const uid = metadata.fieldLayoutElementUid;
                const value = getFieldAdapter(metadata.adapterId).read(wrapper);
                const metaAnchor = metadata.matrixAnchorUid;
                if (typeof metaAnchor === 'string' && metaAnchor !== '' && metaAnchor !== matrixAnchorUid) {
                    matrixAnchorUid = metaAnchor;
                    changed = true;
                }
                // Mounting is value-neutral. After a save, unchanged controls may
                // also differ from PHP's canonical representation (e.g. string IDs).
                if (stable(record.capturedValues.get(uid)) === stable(value)) continue;
                captures.push({ record, uid, value });
                if (stable(slots[uid]) === stable(value)) continue;
                slots[uid] = value;
                changed = true;
            }
            if (changed) {
                writes.set(pos, { fieldSlots: slots, matrixAnchorUid });
            }
        });
        if (writes.size) {
            // Craft widgets own their input history. Capturing their current
            // values must not create a second, invisible TipTap undo operation.
            let transaction = this.#editor.state.tr.setMeta('addToHistory', false);
            for (const [pos, attrs] of writes) {
                const node = transaction.doc.nodeAt(pos);
                if (node) {
                    transaction = transaction
                        .setNodeAttribute(pos, 'fieldSlots', attrs.fieldSlots)
                        .setNodeAttribute(pos, 'matrixAnchorUid', attrs.matrixAnchorUid);
                }
            }
            this.#editor.view.dispatch(transaction);
        }
        // Advance only after every adapter read and document write succeeded.
        // Advancing each flush also preserves edits reverted to their mount value.
        for (const { record, uid, value } of captures) {
            record.capturedValues.set(uid, value);
        }
    }

    #acceptHostIdentities(): void {
        this.#editor?.state.doc.descendants((node) => {
            if (node.type.name !== 'vizyBlock') return;
            const record = this.#hosts.get(String(node.attrs.blockUid));
            for (const metadata of record?.response?.fields ?? []) {
                if (metadata.adapterId !== 'craft.matrix') continue;
                // Draft creation may replace the Matrix anchor while keeping the
                // same mounted widgets. Future captures must use the accepted UID.
                metadata.matrixAnchorUid = node.attrs.matrixAnchorUid || undefined;
            }
        });
    }

    #canonicalProjection(): CanonicalNode {
        if (!this.#editor || !this.#bootstrap) throw new Error('editorNotReady');
        return this.#projectDocument(this.#editor.getJSON() as CanonicalNode);
    }

    /** Same restore+collapse pipeline used by flush / dirty — never compare raw TipTap JSON. */
    #projectDocument(document: CanonicalNode): CanonicalNode {
        if (!this.#bootstrap) throw new Error('editorNotReady');
        return collapseEphemeralRootParagraph(
            restoreCanonicalFromEditor(document),
            this.#bootstrap.manifest,
        );
    }

    /**
     * Write TipTap's current canonical JSON into the Craft hidden input and notify
     * ElementEditor. Does not flush mounted FieldLayout widgets — that stays on
     * serializeForm / submit (those widgets already fire their own input events).
     *
     * No ElementEditor pause. Craft FormObserver only reacts to named control
     * input/change (and a narrow MutationObserver filter); menu-driven TipTap
     * edits never hit that without this publish.
     */
    #publishDocumentToInput(): void {
        if (!this.#input || !this.#editor || !this.#writesEnabled) return;
        try {
            const encoded = stable(this.#canonicalProjection());
            if (this.#input.value === encoded) return;
            this.#input.value = encoded;
            this.#input.dispatchEvent(new Event('input', { bubbles: true }));
            this.#input.dispatchEvent(new Event('change', { bubbles: true }));
        } catch {
            // Mid-teardown / pre-boot projection can throw — skip the poke.
        }
    }

    /**
     * Canonical → editor document. Transport placeholders go in for anything this
     * Editor Config cannot represent, then the root typing surface is ensured.
     */
    #adaptForEditor(document: CanonicalNode, manifest: EditorManifest): CanonicalNode {
        if (!this.#editor) throw new Error('editorNotReady');
        return ensureRootTypingSurface(
            adaptCanonicalForEditor(document, this.#editor.schema, {
                nodes: [...manifest.enabledNodes, ...manifest.internalNodes],
                marks: manifest.enabledMarks,
            }),
            manifest,
        );
    }

    #replaceWithServerCanonical(document: CanonicalNode): void {
        if (!this.#editor || !this.#bootstrap) return;
        const adapted = this.#adaptForEditor(document, this.#bootstrap.manifest);
        if (stable(this.#editor.getJSON()) === stable(adapted)) return;
        this.#reconciling = true;
        try {
            this.#setAcceptedCanonical(adapted);
        } finally {
            this.#reconciling = false;
        }
    }

    #setAcceptedCanonical(adapted: CanonicalNode): void {
        if (!this.#editor) return;
        const parsed = this.#editor.schema.nodeFromJSON(adapted);
        const transaction = reconcileDocument(this.#editor.state.tr, parsed)
            .setMeta('vizyAcceptedCanonical', true)
            .setMeta('addToHistory', false);
        if (transaction.docChanged) this.#editor.view.dispatch(transaction);
    }

    #updateBlockRevisions(
        before: import('@tiptap/pm/model').Node,
        after: import('@tiptap/pm/model').Node,
    ): void {
        const inventory = (doc: import('@tiptap/pm/model').Node): Map<string, string> => {
            const blocks = new Map<string, string>();
            doc.descendants((node) => {
                if (node.type.name === 'vizyBlock') {
                    blocks.set(String(node.attrs.blockUid), stable(node.toJSON()));
                }
            });
            return blocks;
        };
        const previous = inventory(before);
        const current = inventory(after);
        for (const [uid, hash] of current) {
            if (previous.get(uid) !== hash) {
                this.#blockRevisions.set(uid, (this.#blockRevisions.get(uid) ?? 0) + 1);
            }
        }
        for (const uid of this.#blockRevisions.keys()) {
            if (!current.has(uid)) this.#blockRevisions.delete(uid);
        }
    }

    #registerCaptureHooks(): void {
        const form = this.closest('form');
        if (!form || !this.#input) return;
        const fieldName = this.#input.name;
        const submit = () => {
            const metadata = this.#prepareSubmission('save', this.flush('submit'));
            this.#writeNativeMetadata(form, metadata);
        };
        const formdata = (event: FormDataEvent) => {
            const canonical = this.flush('serialize');
            for (const key of [...event.formData.keys()]) {
                if (key.startsWith('vizyHost[') || key.includes('[vizyHost]')) event.formData.delete(key);
            }
            event.formData.delete(fieldName);
            event.formData.append(fieldName, canonical);
        };
        form.addEventListener('submit', submit, true);
        form.addEventListener('formdata', formdata);
        this.#disposals.push(() => form.removeEventListener('submit', submit, true));
        this.#disposals.push(() => form.removeEventListener('formdata', formdata));

        const serialize = (event: { data: { serialized: string } }) => {
            const canonical = this.flush('autosave');
            const metadata = this.#prepareSubmission('autosave', canonical);
            // Must stay on encodeURIComponent (%20), not URLSearchParams (`+`): Craft's
            // ElementEditor round-trips this string with decodeURIComponent, which leaves
            // `+` as a literal plus and corrupts spaces inside the JSON document.
            event.data.serialized = rewriteCraftSerializedForm(event.data.serialized, {
                fieldName,
                canonical,
                editorId: this.id,
                metadata: Object.fromEntries(
                    Object.entries(metadata).map(([key, value]) => [key, String(value)]),
                ),
            });
        };
        this.#attachElementEditor(form, serialize);

        const response = (event: Event) => {
            const payload = (event as CustomEvent<unknown>).detail;
            if (!payload || typeof payload !== 'object') return;
            const results = (payload as { vizy?: { results?: unknown[] } }).vizy?.results;
            if (!Array.isArray(results)) return;
            for (const item of results) {
                if (
                    item
                    && typeof item === 'object'
                    && (item as { editorId?: string }).editorId === this.id
                ) {
                    const generation = Number((item as { generation?: number }).generation);
                    this.acceptServerResult(item as ServerDocumentResult, generation);
                }
            }
        };
        document.addEventListener('vizy:server-response', response);
        this.#disposals.push(() => document.removeEventListener('vizy:server-response', response));
    }

    /**
     * Mints the transport metadata for one submission, reusing the previous mint when
     * nothing has changed.
     *
     * Craft decides whether to autosave by string-comparing successive
     * `serializeForm()` results, and it posts the very string it compared. So
     * serializing has to be idempotent for unchanged content. Minting a fresh
     * generation per call made every serialization differ from the one before it, which
     * left the form permanently dirty: Craft autosaved a provisional draft moments after
     * page load, and again on every subsequent check, without the author touching
     * anything.
     *
     * A real edit bumps `#revision`, which changes the key and mints a new generation,
     * so genuine changes are still tracked one generation per distinct state. An actual
     * `save` always mints fresh, because a submit is an event rather than a state.
     */
    #prepareSubmission(
        requestKind: 'save' | 'autosave' | 'livePreview' | 'validation',
        canonical?: string,
    ): SubmissionMetadata {
        if (!this.#bootstrap) throw new Error('editorNotReady');
        const key = `${requestKind}:${this.#revision}:${canonical ?? stable(this.#canonicalProjection())}`;
        if (requestKind !== 'save' && this.#lastSubmissionMetadata?.key === key) {
            return this.#lastSubmissionMetadata.metadata;
        }
        const submission = this.beginSubmission();
        const metadata: SubmissionMetadata = {
            editorId: this.id,
            fieldUid: this.#bootstrap.manifest.field.fieldUid,
            editorContextToken: this.#bootstrap.editorContextToken,
            generation: submission.generation,
            clientRevision: submission.clientRevision,
            requestKind,
        };
        this.#lastSubmissionMetadata = { key, metadata };
        return metadata;
    }

    #writeNativeMetadata(
        form: HTMLFormElement,
        metadata: SubmissionMetadata,
    ): void {
        form.querySelectorAll(`[data-vizy-transport="${CSS.escape(this.id)}"]`).forEach((input) => input.remove());
        const prefix = `vizyTransport[${this.id}]`;
        for (const [key, value] of Object.entries(metadata)) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = `${prefix}[${key}]`;
            input.value = String(value);
            input.dataset.vizyTransport = this.id;
            form.append(input);
        }
    }
}

function manifestHasLink(manifest: EditorManifest | undefined): boolean {
    return Boolean(manifest?.enabledMarks?.includes('link'));
}

function manifestHasImage(manifest: EditorManifest | undefined): boolean {
    return Boolean(manifest?.enabledNodes?.includes('image'));
}

function manifestHasNode(manifest: EditorManifest | undefined, name: string): boolean {
    return Boolean(manifest?.enabledNodes?.includes(name));
}

customElements.define('vizy-editor', VizyEditorElement);

declare global {
    interface HTMLElementTagNameMap {
        'vizy-editor': VizyEditorElement;
    }
}
