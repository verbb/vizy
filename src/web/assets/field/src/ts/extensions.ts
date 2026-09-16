import { Node, mergeAttributes, type Editor } from '@tiptap/core';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import type { Decoration, DecorationSource, NodeView, ViewMutationRecord } from '@tiptap/pm/view';
import type { BlockUiStateRegistry, FieldHostRegistry } from './registries';
import type { EditorManifest, JsonValue } from './types';
import type { InsertionRegistry } from './insertion/types';
import { projectBlockSummary } from './blocks/summary-projection';
import {
    addBlockAboveLabel,
    deleteBlock,
    moveBlockByOffset,
    queryAddBlockAbove,
    toggleBlockEnabled,
} from './blocks/actions';
import { selectBlockForDrag, wireBlockDragHandle } from './blocks/drag';
import { isBlockDragHostArmed } from './blocks/drag-arm';
import {
    forgetCollapsedBlock,
    rememberCollapsedBlock,
} from './blocks/collapsed-storage';
import {
    holdEditorFieldFocusForPointerGesture,
    resolveEditorBody,
    restoreEditorFocus,
} from './editor-field-focus';

import './components/VizyBlockElement';
import { VizyBlockElement } from './components/VizyBlockElement';

export interface NodeViewServices {
    editor: Editor;
    manifest: EditorManifest;
    ui: BlockUiStateRegistry;
    hosts: FieldHostRegistry;
    insertion: InsertionRegistry;
    openFields(blockUid: string): void;
    /** Mounts the Block's FieldLayout on viewport entry, or immediately when under the eager threshold. */
    observeFieldViewport(element: HTMLElement): () => void;
    refreshSummaries(): void;
    blockRevision(blockUid: string): number;
    /**
     * Prefetch FieldLayouts for a duplicate, then insert the complete card
     * (Matrix-style wait-then-appear).
     */
    duplicateBlock(blockUid: string): Promise<boolean>;
    /** Capture live Craft controls before copying or changing Block structure. */
    flushMountedFields?: () => void;
    /**
     * Block ⋯ "Add Block above": one allowed type inserts immediately; several
     * opens the shared insertion list anchored on `invoker`.
     */
    openAddBlockAbove?(blockUid: string, invoker: HTMLElement): void;
    /** Pauses gutter/summary side effects while an insertion runs. */
    suspendInsertionSideEffects?: () => void;
    resumeInsertionSideEffects?: () => void;
    insertionSideEffectsSuspended?: () => boolean;
}

type ViewProps = {
    editor: Editor;
    node: ProseMirrorNode;
    getPos: () => number | undefined;
    decorations: readonly Decoration[];
    innerDecorations: DecorationSource;
};

function pathContains(event: Event, target: globalThis.Node): boolean {
    return event.composedPath().includes(target);
}

class BlockNodeView implements NodeView {
    readonly dom: VizyBlockElement;
    /** Leaf Block — no TipTap contentDOM; Craft FieldLayout mounts into this slot. */
    readonly #layoutMount: HTMLElement;
    readonly #services: NodeViewServices;
    /** TipTap’s editor — available even when services() was snapshotted mid-construction. */
    readonly #editor: Editor;
    readonly #uid: string;
    readonly #getPos: () => number | undefined;
    #node: ProseMirrorNode;
    #destroyed = false;
    #unobserveViewport: (() => void) | null = null;
    #dragDisposal: (() => void) | null = null;

    constructor(props: ViewProps, services: NodeViewServices) {
        this.#node = props.node;
        this.#services = services;
        this.#editor = props.editor;
        this.#getPos = props.getPos;
        this.#uid = String(props.node.attrs.blockUid);
        const blockTypeUid = String(props.node.attrs.blockTypeUid);
        const type = services.manifest.blockTypes[blockTypeUid];
        const record = services.hosts.acquire(
            this.#uid,
            blockTypeUid,
            type?.fieldLayoutUid ?? null,
            type?.fieldLayoutHash ?? null,
        );
        const state = services.ui.get(this.#uid);

        this.dom = document.createElement('vizy-block');
        this.dom.blockUid = this.#uid;
        this.dom.setAttribute('data-block-uid', this.#uid);
        if (type?.color) {
            // Set the CSS var before first paint so accent tints immediately.
            this.dom.style.setProperty('--vizy-block-accent-color', type.color);
            this.dom.accentColor = type.color;
        }
        if (type?.iconSvg) {
            this.dom.typeIconSvg = type.iconSvg;
        }
        const enabled = Boolean(props.node.attrs.enabled);
        this.dom.enabled = enabled;
        this.dom.disabled = !enabled;
        // Disabled blocks always start folded; registry stays aligned for re-open.
        this.dom.collapsed = !enabled || state.collapsed;
        if (!enabled && !state.collapsed) {
            services.ui.update(this.#uid, { collapsed: true });
        }
        // First paint: project immediately so header shows the Block Type name
        // (e.g. "Card") rather than the empty-title fallback "Block" until the
        // next document update happens to call applySummary.
        const summary = state.summary ?? projectBlockSummary({
            blockUid: this.#uid,
            blockTypeUid,
            enabled: Boolean(props.node.attrs.enabled),
            fieldSlots: (props.node.attrs.fieldSlots ?? {}) as Record<string, JsonValue>,
            type,
            inference: type?.summaryInference,
            revision: services.blockRevision(this.#uid),
            explicitTitlePlacementUid: type?.summary?.titlePlacementUid,
            explicitSubtitlePlacementUid: type?.summary?.subtitlePlacementUid,
            explicitMediaPlacementUid: type?.summary?.mediaPlacementUid,
        });
        if (!state.summary) {
            services.ui.update(this.#uid, { summary });
        }
        this.dom.applySummary(summary);
        // Sync host status *before* expectsFieldLayout. Otherwise a remount of an
        // already-mounted Block briefly reports unmounted+expects before the sync
        // lands (aria-busy flicker). Mounted hosts must win on the first paint.
        this.#syncFieldLayoutState();
        this.dom.expectsFieldLayout = Boolean(type?.fieldLayoutUid);
        if (type?.layoutTabLabels?.length) {
            this.dom.layoutTabLabels = type.layoutTabLabels;
        }
        // One Craft FLD host per Block (registry-owned). Nesting lives in Hosted
        // Vizy mounts inside this host — not TipTap children of vizyBlock.
        this.#layoutMount = document.createElement('div');
        this.#layoutMount.dataset.vizyBlockContent = '';
        this.#layoutMount.slot = 'layout';
        this.#layoutMount.append(record.root);
        this.dom.append(this.#layoutMount);
        this.dom.addEventListener('vizy-collapse-change', this.#collapse as EventListener);
        this.dom.addEventListener('vizy-edit-fields', this.#openFields);
        this.dom.addEventListener('vizy-block-action', this.#action as EventListener);
        this.dom.addEventListener('vizy-block-header-activate', this.#activateHeader);
        // Defer: Editor boot often constructs NodeViews before the insertion
        // registry is assigned on the services closure (empty doc in production;
        // fixtures with initial Blocks in tests).
        queueMicrotask(() => {
            if (this.#destroyed) return;
            this.#syncAddAboveMenu();
        });
        if (type?.fieldLayoutUid) {
            this.#unobserveViewport = services.observeFieldViewport(this.dom);
        }
        this.dom.draggable = false;
        // Editor.view is not ready while the first NodeViews mount — defer wiring.
        queueMicrotask(() => {
            if (this.#destroyed) return;
            this.#dragDisposal = wireBlockDragHandle(this.dom, {
                getPos: () => this.#getPos(),
                getLabel: () => this.dom.typeName || 'Block',
                getView: () => this.#editor.view,
                onDragChange: (dragging) => {
                    this.dom.dragging = dragging;
                    this.#services.ui.update(this.#uid, { view: { dragging } });
                },
            });
        });
    }

    /** PM marks draggable nodes on the host when selected — grip-only reorder. */
    #draggableResetPending = false;
    #resetHandleDraggable(): void {
        // Grip mousedown arms drag *and* selects the Block. selectNode() would
        // clear host.draggable on a microtask and force a second gesture — skip
        // while the host is armed (see blocks/drag-arm.ts).
        if (isBlockDragHostArmed(this.dom)) return;
        this.dom.draggable = false;
        this.dom.removeAttribute('draggable');
        // Coalesce: every update()/selectNode() used to schedule its own microtask,
        // and each removeAttribute re-entered PM's mutation path.
        if (this.#draggableResetPending) return;
        this.#draggableResetPending = true;
        queueMicrotask(() => {
            this.#draggableResetPending = false;
            if (this.#destroyed) return;
            if (isBlockDragHostArmed(this.dom)) return;
            this.dom.draggable = false;
            this.dom.removeAttribute('draggable');
        });
    }

    /** Keeps the UI state registry and the Block header on the same status. */
    #syncFieldLayoutState(): void {
        const record = this.#services.hosts.get(this.#uid);
        const status = record?.status;
        const fieldLayout = status === 'mounted'
            ? 'mounted'
            : status === 'loading'
                ? 'loading'
                : status === 'failed'
                    ? 'error'
                    : 'unmounted';
        this.#services.ui.get(this.#uid).view.fieldLayout = fieldLayout;
        this.dom.fieldLayoutState = fieldLayout;
        this.dom.fieldLayoutError = status === 'failed' ? (record?.errorMessage ?? null) : null;
        if (status === 'mounted' || status === 'failed') {
            this.dom.fieldLayoutRetrying = false;
        }
    }

    #collapse = (event: CustomEvent<{ collapsed: boolean; persist?: boolean }>): void => {
        // Nested Blocks also emit composed header events; only handle our own.
        if (event.target !== this.dom) return;
        event.stopPropagation();
        const collapsed = event.detail.collapsed;
        this.#services.ui.update(this.#uid, { collapsed });
        // Author toggle persists; disable/enable forced folds pass persist:false.
        if (event.detail.persist === false) return;
        if (collapsed) {
            rememberCollapsedBlock(this.#uid);
        } else {
            forgetCollapsedBlock(this.#uid);
        }
    };

    #openFields = (event: Event): void => {
        if (event.target !== this.dom) return;
        event.stopPropagation();
        this.#services.ui.update(this.#uid, { editingFields: true });
        this.#services.openFields(this.#uid);
    };

    /**
     * Header press: select this Block as a node. Avoids leaving a text caret
     * parked inside a nested Hosted writing surface.
     * Nested Blocks stop propagation so an outer Block is not also selected.
     *
     * Do not focus ProseMirror on pointerdown (select-all + focus flicker). Hold
     * field `data-has-focus` so selection paint stays up; claim DOM focus once
     * on pointerup so Enter hits the editor, not the Craft entry form.
     */
    #activateHeader = (event: Event): void => {
        if (event.target !== this.dom) return;
        event.stopPropagation();
        const pos = this.#getPos();
        if (pos == null) return;
        try {
            selectBlockForDrag(this.#editor.view, pos);
            const body = resolveEditorBody(this.#editor.view.dom);
            holdEditorFieldFocusForPointerGesture(body, () => {
                restoreEditorFocus(this.#editor, { force: true });
            });
        } catch {
            // Editor may be mid-teardown.
        }
    };

    #action = (event: CustomEvent<{ action: string; invoker?: HTMLElement }>): void => {
        // Without this guard, Delete on an inner Block bubbles to every ancestor
        // and confirms/deletes the whole nest — leaving the field empty.
        if (event.target !== this.dom) return;
        event.stopPropagation();
        const { action, invoker } = event.detail;
        const editor = this.#editor;
        switch (action) {
            case 'duplicate':
                this.#services.suspendInsertionSideEffects?.();
                void this.#services.duplicateBlock(this.#uid).finally(() => {
                    this.#services.resumeInsertionSideEffects?.();
                    this.#services.refreshSummaries();
                });
                return;
            case 'delete': {
                // Confirm is opt-in via field setting — Delete is already a
                // deliberate menu action, so the default is remove immediately.
                const confirmDeletion = this.#services.manifest.field.confirmBlockDeletion === true;
                if (confirmDeletion) {
                    const message = window.Craft?.t?.('vizy', 'Delete this block?')
                        ?? 'Delete this block?';
                    if (!window.confirm(message)) break;
                }
                forgetCollapsedBlock(this.#uid);
                deleteBlock(editor, this.#uid);
                break;
            }
            case 'toggleEnabled':
                toggleBlockEnabled(editor, this.#uid);
                break;
            case 'moveUp':
                moveBlockByOffset(editor, this.#uid, -1);
                break;
            case 'moveDown':
                moveBlockByOffset(editor, this.#uid, 1);
                break;
            case 'addAbove': {
                // Matrix-style: picker / one-shot insert via shared insertion overlay.
                const anchor = invoker
                    ?? this.dom.shadowRoot?.querySelector<HTMLElement>('[part="menu-trigger"]')
                    ?? null;
                if (anchor) {
                    this.#services.openAddBlockAbove?.(this.#uid, anchor);
                }
                break;
            }
            default:
                break;
        }
        this.#services.refreshSummaries();
    };

    update(node: ProseMirrorNode): boolean {
        if (
            node.type !== this.#node.type
            || String(node.attrs.blockUid) !== this.#uid
            || String(node.attrs.blockTypeUid) !== String(this.#node.attrs.blockTypeUid)
        ) return false;
        this.#node = node;
        const state = this.#services.ui.get(this.#uid);
        this.dom.enabled = Boolean(node.attrs.enabled);
        this.dom.disabled = !node.attrs.enabled;
        this.dom.applySummary(state.summary);
        this.#syncFieldLayoutState();
        this.#syncAddAboveMenu();
        this.#resetHandleDraggable();
        return true;
    }

    /** Keep ⋯ "Add … above" label/availability aligned with insert policy at this Block. */
    #syncAddAboveMenu(): void {
        const registry = this.#services.insertion;
        if (!registry?.buildContext) {
            this.dom.canAddAbove = false;
            this.dom.addAboveLabel = 'Add Block above';
            return;
        }
        const choices = queryAddBlockAbove(this.#editor, registry, this.#uid);
        this.dom.canAddAbove = choices.length > 0;
        this.dom.addAboveLabel = addBlockAboveLabel(this.#editor, registry, this.#uid);
    }

    selectNode(): void {
        this.dom.selected = true;
        this.#services.ui.update(this.#uid, { view: { selected: true } });
        this.#resetHandleDraggable();
    }

    deselectNode(): void {
        this.dom.selected = false;
        this.#services.ui.update(this.#uid, { view: { selected: false } });
        this.#resetHandleDraggable();
    }

    stopEvent(event: Event): boolean {
        const handle = this.dom.shadowRoot?.querySelector('[data-vizy-drag-handle]');
        if (handle && pathContains(event, handle)) return false;
        return this.#services.hosts.roots(this.#uid).some((host) => pathContains(event, host))
            || (this.dom.shadowRoot ? event.composedPath().includes(this.dom.shadowRoot) : false);
    }

    ignoreMutation(mutation: ViewMutationRecord): boolean {
        if (mutation.type === 'selection') return false;
        // Leaf Block: host UI, Craft fields, and Hosted Vizy mounts are not
        // ProseMirror content — ignore every DOM mutation under the card.
        return true;
    }

    destroy(): void {
        if (this.#destroyed) return;
        this.#destroyed = true;
        this.#unobserveViewport?.();
        this.#unobserveViewport = null;
        this.#dragDisposal?.();
        this.#dragDisposal = null;
        this.dom.removeEventListener('vizy-collapse-change', this.#collapse as EventListener);
        this.dom.removeEventListener('vizy-edit-fields', this.#openFields);
        this.dom.removeEventListener('vizy-block-action', this.#action as EventListener);
        this.dom.removeEventListener('vizy-block-header-activate', this.#activateHeader);
        this.#services.hosts.releaseView(this.#uid);
    }
}

/**
 * TipTap leaf: Blocks carry Craft FieldLayout (and Hosted Vizy) outside the
 * document tree. Nested composition is Hosted-only — never TipTap children.
 */
export function createVizyBlock(services: () => NodeViewServices) {
    return Node.create({
        name: 'vizyBlock',
        group: 'block',
        content: '',
        defining: true,
        isolating: true,
        selectable: true,
        draggable: true,
        addAttributes: () => ({
            blockUid: { default: null, rendered: false },
            blockTypeUid: { default: null, rendered: false },
            enabled: { default: true, rendered: false },
            fieldSlots: { default: {}, rendered: false },
            // Grandfathered Matrix-in-Block identity; Entries live on MatrixAnchor.
            matrixAnchorUid: { default: null, rendered: false },
        }),
        parseHTML: () => [],
        renderHTML: ({ HTMLAttributes }) => ['vizy-block', mergeAttributes(HTMLAttributes)],
        addNodeView: () => (props) => new BlockNodeView(props as ViewProps, services()),
    });
}
