import { NodeSelection } from '@tiptap/pm/state';
import type { EditorView } from '@tiptap/pm/view';
import { armBlockDragHost, disarmBlockDragHost } from './drag-arm';
import { captureBlockDragOrigins, clearBlockDragOrigins } from './block-drop-settle';
import {
    armDraggedVizyBlock,
    clearArmedDraggedVizyBlock,
} from './drop-rules';

/** Ghost pill label — Vizy 3-style preview (block type name, not the grip icon). */
export function createBlockDragGhost(label: string): HTMLElement {
    const ghost = document.createElement('div');
    ghost.className = 'vizy-block-drag-ghost';
    ghost.textContent = label;
    ghost.setAttribute('aria-hidden', 'true');
    // setDragImage requires the node to be in the document.
    Object.assign(ghost.style, {
        position: 'fixed',
        top: '-1000px',
        left: '-1000px',
        pointerEvents: 'none',
    });
    document.body.append(ghost);
    return ghost;
}

export function applyBlockDragGhost(event: DragEvent, label: string): () => void {
    const ghost = createBlockDragGhost(label);
    event.dataTransfer?.setDragImage(ghost, 16, 14);
    return () => ghost.remove();
}

export function selectBlockForDrag(view: EditorView, blockPos: number): void {
    const selection = NodeSelection.create(view.state.doc, blockPos);
    if (view.state.selection.eq(selection)) return;
    view.dispatch(view.state.tr.setSelection(selection));
}

export type BlockDragWireOptions = {
    getPos: () => number | undefined;
    getLabel: () => string;
    getView: () => EditorView;
    onDragChange: (dragging: boolean) => void;
};

function eventFromHandle(event: Event): boolean {
    return event.composedPath().some((node) => (
        node instanceof HTMLElement && (
            node.matches('[data-vizy-drag-handle]')
            || node.closest?.('[data-vizy-drag-handle]') != null
        )
    ));
}

/**
 * Wire handle-only block drag on a `<vizy-block>` host.
 *
 * Shadow DOM breaks ProseMirror's default nearestDesc drag path, and PM also
 * marks the whole node draggable on NodeSelection. We arm drag only from grip
 * mousedown (host draggable briefly), seed PM's dragging slice on dragstart,
 * and cancel any unarmed host drag (header controls).
 */
export function wireBlockDragHandle(host: HTMLElement, options: BlockDragWireOptions): () => void {
    let ghostCleanup: (() => void) | null = null;
    let handle: HTMLElement | null = null;
    /** True between grip mousedown and dragstart/dragend — gates host draggable. */
    let handleDragArmed = false;

    const beginHandleDrag = (event: DragEvent): void => {
        const view = options.getView();
        const pos = options.getPos();
        if (pos == null || !event.dataTransfer) {
            event.preventDefault();
            handleDragArmed = false;
            disarmBlockDragHost(host);
            return;
        }

        selectBlockForDrag(view, pos);
        const nodeSelection = NodeSelection.create(view.state.doc, pos);
        const draggedSlice = nodeSelection.content();
        const { dom, text, slice } = view.serializeForClipboard(draggedSlice);

        event.dataTransfer.clearData();
        event.dataTransfer.setData('text/html', dom.innerHTML);
        event.dataTransfer.setData('text/plain', text);
        event.dataTransfer.effectAllowed = 'copyMove';

        // Same shape as prosemirror-view's Dragging — powers drop + Dropcursor.
        // TipTap's public typing omits `node`; runtime still accepts it.
        view.dragging = { slice, move: true, node: nodeSelection } as typeof view.dragging;
        // Survive WebKit dragend-before-drop clearing view.dragging.
        armDraggedVizyBlock({
            uid: String(nodeSelection.node.attrs.blockUid),
            blockTypeUid: String(nodeSelection.node.attrs.blockTypeUid),
            from: nodeSelection.from,
            to: nodeSelection.from + nodeSelection.node.nodeSize,
            node: nodeSelection.node,
        });

        ghostCleanup?.();
        ghostCleanup = applyBlockDragGhost(event, options.getLabel());
        captureBlockDragOrigins(host);
        options.onDragChange(true);

        // We already seeded view.dragging — do not let PM re-derive from the host.
        event.stopPropagation();
    };

    const onHandleMouseDown = (event: MouseEvent): void => {
        if (event.button !== 0) return;
        // Do not preventDefault — that blocks HTML5 drag on the grip/host.
        const pos = options.getPos();
        if (pos == null) return;
        // Arm *before* NodeSelection so selectNode() sees the armed host.
        handleDragArmed = true;
        armBlockDragHost(host);
        selectBlockForDrag(options.getView(), pos);
    };

    const onHostDragStart = (event: DragEvent): void => {
        // Nested Blocks are separate drag sources inside this host's contentDOM.
        // Capture-phase listeners on ancestors must not cancel or hijack them —
        // dragstart's target is the draggable host, and composedPath often omits
        // the nested grip, so the parent would otherwise preventDefault and kill
        // every Content Area reorder.
        if (event.target !== host) return;

        const allowed = handleDragArmed || eventFromHandle(event);
        if (!allowed) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        // Stay armed through dragstart so NodeSelection updates from
        // beginHandleDrag cannot clear host.draggable mid-gesture.
        beginHandleDrag(event);
    };

    const onHostDragEnd = (): void => {
        handleDragArmed = false;
        disarmBlockDragHost(host);
        ghostCleanup?.();
        ghostCleanup = null;
        options.onDragChange(false);
        try {
            options.getView().dragging = null;
        } catch {
            // Editor may already be destroyed during test teardown.
        }
        // WebKit may fire dragend *before* drop. Clearing origins / armed
        // session here wiped the FLIP snapshot and blocked commit. Drop
        // consumes both on success; clear leftovers after drop has had a chance.
        window.setTimeout(() => {
            clearBlockDragOrigins();
            clearArmedDraggedVizyBlock();
        }, 100);
    };

    /** Click without drag: clear armed state so the host does not stay draggable. */
    const onPointerUp = (): void => {
        if (!handleDragArmed) return;
        // dragstart leaves handleDragArmed true until dragend; a plain click
        // never fires dragstart, so disarm here when nothing is dragging.
        try {
            if (options.getView().dragging) return;
        } catch {
            // Editor torn down.
        }
        handleDragArmed = false;
        disarmBlockDragHost(host);
    };

    const attachHandle = (): void => {
        const next = host.shadowRoot?.querySelector<HTMLElement>('[data-vizy-drag-handle]') ?? null;
        if (next === handle) return;
        handle?.removeEventListener('mousedown', onHandleMouseDown);
        handle = next;
        handle?.addEventListener('mousedown', onHandleMouseDown);
    };

    host.addEventListener('dragstart', onHostDragStart, { capture: true });
    host.addEventListener('dragend', onHostDragEnd);
    window.addEventListener('pointerup', onPointerUp, true);
    disarmBlockDragHost(host);

    attachHandle();
    const observer = host.shadowRoot
        ? new MutationObserver(() => attachHandle())
        : null;
    observer?.observe(host.shadowRoot!, { childList: true, subtree: true });

    return () => {
        observer?.disconnect();
        handle?.removeEventListener('mousedown', onHandleMouseDown);
        host.removeEventListener('dragstart', onHostDragStart, { capture: true });
        host.removeEventListener('dragend', onHostDragEnd);
        window.removeEventListener('pointerup', onPointerUp, true);
        onHostDragEnd();
    };
}
