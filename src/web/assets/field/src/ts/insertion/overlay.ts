import { InsertionPopover } from './popover';
import { BlockBrowseHost } from './browse-host';
import {
    executeInsertion,
    findInlineAnchors,
    invalidateInlineAnchorCache,
    isSimpleRichTextField,
    oneChoiceDirect,
} from './surface-helpers';
import type { InsertionAnchor } from './surface-helpers';
import type { NodeViewServices } from '../extensions';
import type { InsertionContext, InsertionKind } from './types';
import { resolveEditorBody, setEditorFieldHasFocus } from '../editor-field-focus';
import { findBlockNode } from '../blocks/actions';
import { BLOCK_INSERT_KINDS } from './kinds';
import {
    readBlockInsertView,
    writeBlockInsertView,
    type BlockInsertView,
} from './insert-view-storage';
import '../components/VizyBlockBrowseDialogElement';

export type InsertionOverlayOptions = {
    /**
     * Toolbar Add Block open-state paint (`aria-expanded` via Lit). Plain DOM
     * gutter chips get `aria-expanded` set on the invoker element instead.
     */
    onToolbarAddBlockOpenChange?: (open: boolean) => void;
};

/**
 * Notion-style gutter insertion overlay (production).
 *
 * Compact left-gutter `+` inserts after the hovered row (trailing append in the
 * padding below the last row). Toolbar Add Block and Block ⋯ “Add Block above”
 * share the same Blocks-only palette (`BLOCK_INSERT_KINDS`) with optional grid
 * browse via BlockBrowseHost. Empty-state cards and Browse All were retired —
 * authors use gutter `+`, slash (where allowed), and typing.
 */
export class InsertionOverlay {
    readonly #host: HTMLElement;
    readonly #layer: HTMLElement;
    readonly #popover: InsertionPopover;
    readonly #browse = new BlockBrowseHost();
    readonly #services: () => NodeViewServices;
    readonly #onToolbarAddBlockOpenChange?: (open: boolean) => void;
    readonly #inlineButtons = new Map<string, HTMLButtonElement>();
    #pointerX = 0;
    #pointerY = 0;
    #hoveredPos: number | null = null;
    /** False after pointerleave — sync must not resurrect a chip from stale coords. */
    #pointerInside = false;
    /**
     * TipTap drag-handle pattern: hide gutter controls while typing. Cleared on
     * the next pointer move so the `+` returns when the mouse actually moves.
     */
    #typingHidden = false;
    /** Measures `--vizy-inline-add-size` from the writing surface for JS positioning. */
    #inlineAddSizeProbe: HTMLDivElement | null = null;
    /**
     * Synthetic field-focus hold while pressing gutter `+`. mousedown
     * preventDefault keeps the chip from focusing but ProseMirror still blurs,
     * which drops `:focus-within` on `.vizy-editor-body` until click opens the
     * palette — a visible ring flicker. Hold focus from pointerdown; release
     * after click (popover takes its own hold) or when the gesture ends.
     */
    #gestureBody: HTMLElement | null = null;
    /**
     * Last list/grid open context so toggling view can re-open the sibling surface
     * without losing insert position / invoker.
     */
    #lastOpen: {
        context: InsertionContext;
        invoker: HTMLElement;
        surface: InsertionContext['surface'];
        kinds?: readonly InsertionKind[];
        invokerKey: string | null;
        claimEditorFocus: boolean;
        autofocusFilter: boolean;
        rect: DOMRect;
    } | null = null;

    constructor(
        host: HTMLElement,
        services: () => NodeViewServices,
        options: InsertionOverlayOptions = {},
    ) {
        this.#host = host;
        this.#services = services;
        this.#onToolbarAddBlockOpenChange = options.onToolbarAddBlockOpenChange;
        this.#layer = document.createElement('div');
        this.#layer.className = 'vizy-insertion-overlay';
        this.#layer.dataset.vizyInsertionOverlay = '';
        host.append(this.#layer);

        this.#popover = new InsertionPopover();

        host.addEventListener('pointermove', this.#onPointerMove);
        host.addEventListener('pointerleave', this.#onPointerLeave);
        // Capture so Enter/typing hides the chip even when focus is in nested NodeViews.
        host.addEventListener('keydown', this.#onKeyDown, true);
    }

    sync(): void {
        if (this.#services().insertionSideEffectsSuspended?.()) return;
        invalidateInlineAnchorCache();
        if (this.#popover.isOpen) {
            this.#popover.refresh(this.#services());
        }
        this.#syncAddButtons();
    }

    destroy(): void {
        this.#host.removeEventListener('pointermove', this.#onPointerMove);
        this.#host.removeEventListener('pointerleave', this.#onPointerLeave);
        this.#host.removeEventListener('keydown', this.#onKeyDown, true);
        this.#releaseGestureBody();
        this.#popover.close({ animate: false, restoreFocus: false });
        this.#browse.close();
        this.#lastOpen = null;
        this.#layer.remove();
        for (const button of this.#inlineButtons.values()) button.remove();
        this.#inlineButtons.clear();
    }

    #onPointerMove = (event: PointerEvent): void => {
        this.#pointerX = event.clientX;
        this.#pointerY = event.clientY;
        this.#pointerInside = true;
        // Mouse moved again — typing no longer owns the gutter.
        this.#typingHidden = false;
        this.#syncAddButtons();
    };

    #onPointerLeave = (): void => {
        // Do not re-sync from the last in-bounds coords — that kept the `+`
        // parked on a row after the mouse left the writing surface (and
        // `:focus-within` opacity made the stale chip look intentional).
        this.#pointerInside = false;
        this.#hoveredPos = null;
        this.#clearButtons();
    };

    #onKeyDown = (): void => {
        // Same contract as TipTap's drag-handle plugin: while the editor has
        // focus, any keystroke dismisses hover controls so typing isn't blocked.
        try {
            if (!this.#services().editor.view.hasFocus()) return;
        } catch {
            return;
        }
        if (this.#typingHidden) return;
        this.#typingHidden = true;
        this.#hoveredPos = null;
        this.#clearButtons();
    };

    #syncAddButtons(): void {
        if (this.#typingHidden || this.#pointerBlocksGutter() || !this.#pointerInside) {
            this.#clearButtons();
            return;
        }
        // Match toolbar `canAddBlock`: Rich Text Only / no insertable types → no gutter.
        // Editor Config may also disable the gutter while keeping toolbar Add Block.
        if (
            isSimpleRichTextField(this.#services().manifest)
            || this.#services().manifest.gutterInsert === false
        ) {
            this.#clearButtons();
            return;
        }
        this.#syncNotionGutter();
    }

    /**
     * Toolbar Add Block — insert Vizy Blocks at the caret (or first root child
     * when unfocused). Shared Blocks-only palette with gutter `+` and slash.
     *
     * Search always autofocuses (the picker is for typing/filter). Field focus ring
     * hold + editor restore stay warm-only so a cold open from the Craft title
     * does not paint the field ring or leave the caret in ProseMirror.
     */
    openToolbarInsert(
        invoker: HTMLElement,
        options: { hadEditorFocus?: boolean } = {},
    ): void {
        const services = this.#services();
        const { editor } = services;
        let position: number;
        if (editor.view.hasFocus()) {
            position = editor.state.selection.from;
        } else {
            // Prefer start of doc content when the field is not focused.
            position = editor.state.doc.content.size === 0 ? 0 : 1;
        }
        const context = services.insertion.buildContext('inline', position);
        if (!context) return;
        // Prefer the toolbar gesture flag; fall back to live focus (keyboard).
        const hadEditorFocus = options.hadEditorFocus
            ?? editor.view.hasFocus();
        // Toolbar / gutter / slash share Blocks-only (see BLOCK_INSERT_KINDS).
        this.#activateSurface(
            context,
            invoker,
            'inline',
            BLOCK_INSERT_KINDS,
            'toolbar-plus',
            {
                autofocusFilter: true,
                claimEditorFocus: hadEditorFocus,
            },
        );
    }

    /**
     * Block ⋯ menus (and header controls) sit over the writing surface, so raw
     * pointer Y still maps to a prose row underneath and the gutter `+` would
     * chase the cursor through the menu. Suppress while a menu is open or the
     * pointer is on non-prose UI. Hosted nested Vizy also owns its own
     * gutter — do not sync this surface's chip while the pointer is inside it.
     */
    #pointerBlocksGutter(): boolean {
        if (this.#host.querySelector('vizy-block[menu-open]')) return true;
        const el = this.#contentElementUnderPointer();
        if (!el) return false;
        if (this.#isInsideNestedVizyEditor(el)) return true;
        return this.#isNonProseUi(el);
    }

    /**
     * True when the pointer is under a descendant `vizy-editor` (Hosted nested
     * field). Ancestor surfaces still receive pointermove because Hosted mounts
     * live in Block FieldLayout hosts inside this surface — without this guard
     * every nesting level would sync its own gutter chip.
     */
    #isInsideNestedVizyEditor(start: Element): boolean {
        const ownEditor = this.#host.closest('vizy-editor');
        let node: Node | null = start;
        while (node) {
            if (node === this.#host) return false;
            if (node instanceof HTMLElement && node.matches('vizy-editor')) {
                return node !== ownEditor;
            }
            if (node instanceof ShadowRoot) {
                node = node.host;
                continue;
            }
            node = node.parentNode;
        }
        return false;
    }

    #isNonProseUi(start: Element): boolean {
        let node: Node | null = start;
        while (node) {
            if (node instanceof HTMLElement) {
                // Our own gutter chip is not "blocking UI" — pointer over it
                // must keep the active container sticky (see #containerUnderPointer).
                if (node.classList.contains('vizy-insertion-overlay')
                    || node.classList.contains('vizy-inline-add')) {
                    return false;
                }
                if (node.matches('vizy-toolbar, vizy-bubble')) return true;
                // Shadow-tree block header (header / actions / ⋯ menu).
                if (node.matches(
                    'header[part="header"], header[role="group"], .menu[role="menu"], .actions, .header-end',
                )) {
                    return true;
                }
                // Prose / fields under the block — allow gutter targeting again.
                if (node.matches('section[part="body"], [part="preview"]')) {
                    return false;
                }
            }
            if (node instanceof ShadowRoot) {
                node = node.host;
                continue;
            }
            node = node.parentNode;
        }
        return false;
    }

    /**
     * Notion gutter: one `+` per row, centred on the block, always inserts
     * **after** that row. Pointer in the padding below the last row still appends.
     * Insert-before-first is left to slash / empty-container gutter, not a special case.
     */
    #syncNotionGutter(): void {
        const services = this.#services();
        const anchors = findInlineAnchors(services);
        // No insertable Block Types → empty anchors. Do not invent a chip from
        // raw row geometry (that left Rich Text Only fields with a dead `+`).
        if (!anchors.length) {
            this.#hoveredPos = null;
            this.#clearButtons();
            return;
        }
        const hostRect = this.#host.getBoundingClientRect();
        const container = this.#containerUnderPointer();
        const target = this.#resolveNotionGutterTarget(services, container, hostRect, anchors);

        if (!target) {
            this.#hoveredPos = null;
            this.#clearButtons();
            return;
        }

        this.#hoveredPos = target.position;
        this.#renderButtons([{
            key: this.#gutterButtonKey(container, target.position),
            position: target.position,
            top: target.edge,
            left: this.#gutterLeftForContainer(container, hostRect),
            mode: 'gutter',
            container,
        }]);
    }

    #gutterButtonKey(
        _container: InsertionContext['container'],
        position: number,
    ): string {
        return `gutter-root-${position}`;
    }

    #resolveNotionGutterTarget(
        services: NodeViewServices,
        container: InsertionContext['container'],
        hostRect: DOMRect,
        anchors: readonly InsertionAnchor[] = findInlineAnchors(services),
    ): { position: number; edge: number } | null {
        if (!anchors.length) return null;
        const rows = this.#rowsInContainer(services, container);
        if (!rows.length) return null;

        const trailing = this.#trailingAnchorInContainerList(anchors, container);
        const lastRow = rows[rows.length - 1];
        const row = this.#rowUnderPointer(services, container, rows);

        if (row) {
            const position = this.#insertAfterRow(services, container, row.pos, row.nodeSize, anchors);
            // Only paint when the insert gap is a real insertion boundary.
            if (!anchors.some((anchor) => (
                this.#containersMatch(anchor.context.container, container)
                && anchor.position === position
            ))) {
                return null;
            }
            return {
                position,
                edge: this.#gutterRowCenter(row),
            };
        }

        if (
            trailing
            && this.#pointerY > lastRow.rect.bottom - 4
            && this.#pointerY <= hostRect.bottom + 8
        ) {
            return {
                position: trailing.position,
                edge: this.#gutterRowCenter(lastRow),
            };
        }

        // Gaps / controls just outside the midpoint bands (large heading margins).
        return this.#nearestGutterRow(services, container, rows, 48, anchors);
    }

    #gutterRowCenter(row: { rect: DOMRect }): number {
        return (row.rect.top + row.rect.bottom) / 2;
    }

    #insertAfterRow(
        services: NodeViewServices,
        container: InsertionContext['container'],
        rowPos: number,
        nodeSize: number,
        anchors: readonly InsertionAnchor[] = findInlineAnchors(services),
    ): number {
        const target = rowPos + nodeSize;
        for (const anchor of anchors) {
            if (!this.#containersMatch(anchor.context.container, container)) continue;
            if (anchor.position === target) return anchor.position;
        }
        return target;
    }

    #nearestGutterRow(
        services: NodeViewServices,
        container: InsertionContext['container'],
        rows: Array<{ pos: number; nodeSize: number; rect: DOMRect }>,
        threshold: number,
        anchors: readonly InsertionAnchor[] = findInlineAnchors(services),
    ): { position: number; edge: number } | null {
        let best: { position: number; edge: number; dist: number } | null = null;
        for (const row of rows) {
            const edge = this.#gutterRowCenter(row);
            const dist = Math.abs(edge - this.#pointerY);
            if (dist > threshold) continue;
            const position = this.#insertAfterRow(services, container, row.pos, row.nodeSize, anchors);
            if (!anchors.some((anchor) => (
                this.#containersMatch(anchor.context.container, container)
                && anchor.position === position
            ))) {
                continue;
            }
            if (!best || dist < best.dist) {
                best = { position, edge, dist };
            }
        }
        return best ? { position: best.position, edge: best.edge } : null;
    }

    #rowsInContainer(
        services: NodeViewServices,
        container: InsertionContext['container'],
    ): Array<{ pos: number; nodeSize: number; rect: DOMRect }> {
        const { editor } = services;
        const view = editor.view;
        const rows: Array<{ pos: number; nodeSize: number; rect: DOMRect }> = [];
        const collect = (
            node: import('@tiptap/pm/model').Node,
            containerPos: number,
        ): void => {
            const contentStart = node.type.name === 'doc' ? containerPos : containerPos + 1;
            let offset = contentStart;
            node.forEach((child) => {
                const childPos = offset;
                const dom = view.nodeDOM(childPos);
                if (dom instanceof HTMLElement) {
                    rows.push({
                        pos: childPos,
                        nodeSize: child.nodeSize,
                        rect: dom.getBoundingClientRect(),
                    });
                }
                offset += child.nodeSize;
            });
        };
        collect(editor.state.doc, 0);
        return rows;
    }

    /**
     * Assign every Y in the container to one row via midpoint bands between
     * border boxes — covers heading margin gaps that getBoundingClientRect
     * excludes. The first band extends up through Content Area labels / margins.
     */
    #rowUnderPointer(
        services: NodeViewServices,
        container: InsertionContext['container'],
        rows: Array<{ pos: number; nodeSize: number; rect: DOMRect }>,
    ): { pos: number; nodeSize: number; rect: DOMRect; isLast: boolean } | null {
        if (!rows.length) return null;
        const lastPos = rows[rows.length - 1].pos;
        let best: { pos: number; nodeSize: number; rect: DOMRect; isLast: boolean; dist: number } | null = null;
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const top = i === 0
                ? this.#firstRowHitTop(services, container, row)
                : (rows[i - 1].rect.bottom + row.rect.top) / 2;
            const bottom = i === rows.length - 1
                ? row.rect.bottom + 4
                : (row.rect.bottom + rows[i + 1].rect.top) / 2;
            if (this.#pointerY < top || this.#pointerY > bottom) continue;
            const dist = Math.abs(this.#gutterRowCenter(row) - this.#pointerY);
            if (!best || dist < best.dist) {
                best = { ...row, isLast: row.pos === lastPos, dist };
            }
        }
        if (!best) return null;
        const { dist: _dist, ...target } = best;
        return target;
    }

    /** Top of the first row’s hit band — CSS margin above. */
    #firstRowHitTop(
        services: NodeViewServices,
        _container: InsertionContext['container'],
        row: { pos: number; rect: DOMRect },
    ): number {
        const dom = services.editor.view.nodeDOM(row.pos);
        if (dom instanceof HTMLElement) {
            const marginTop = Number.parseFloat(getComputedStyle(dom).marginTop) || 0;
            return row.rect.top - Math.max(marginTop, 4);
        }
        return row.rect.top - 4;
    }

    #gutterLeftForContainer(
        _container: InsertionContext['container'],
        _hostRect: DOMRect,
    ): number | null {
        return null;
    }

    #inlineAddSizePx(): number {
        if (!this.#inlineAddSizeProbe) {
            const probe = document.createElement('div');
            probe.style.cssText = [
                'position:absolute',
                'visibility:hidden',
                'pointer-events:none',
                'width:var(--vizy-inline-add-size,24px)',
                'height:0',
            ].join(';');
            this.#host.append(probe);
            this.#inlineAddSizeProbe = probe;
        }
        return this.#inlineAddSizeProbe.offsetWidth || 22;
    }

    #renderButtons(specs: Array<{
        key: string;
        position: number;
        top: number;
        left?: number | null;
        mode: 'gutter';
        container?: InsertionContext['container'];
    }>): void {
        const hostRect = this.#host.getBoundingClientRect();
        const seen = new Set<string>();

        for (const spec of specs) {
            seen.add(spec.key);
            let control = this.#inlineButtons.get(spec.key);
            if (!control) {
                control = this.#createAddControl(spec.key, spec.position);
                this.#layer.append(control);
                this.#inlineButtons.set(spec.key, control);
            }
            this.#positionAddControl(control, spec, hostRect);
            this.#stampContainerOnControl(control, spec.container ?? { kind: 'root' });
        }

        for (const [key, control] of this.#inlineButtons) {
            if (seen.has(key)) continue;
            control.remove();
            this.#inlineButtons.delete(key);
        }
    }

    /** Persist container identity on the chip so hover-over-controls stays sticky. */
    #stampContainerOnControl(
        button: HTMLElement,
        _container: InsertionContext['container'],
    ): void {
        button.dataset.vizyContainer = 'root';
    }

    #createAddControl(key: string, position: number): HTMLButtonElement {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'vizy-inline-add';
        // Stable id for toggle/switch after `#renderButtons` recycles the node.
        button.dataset.vizyInvokerKey = key;
        // Same Plugin Kit plus as toolbar Add Block (not the hand-rolled SVG).
        const icon = document.createElement('pk-icon');
        icon.setAttribute('icon', 'plus');
        icon.setAttribute('label', '');
        button.append(icon);
        button.setAttribute('aria-label', 'Add content');
        // Menu-button pattern: don't move focus onto the chip. Also hold the
        // Craft field ring — preventDefault alone still lets ProseMirror blur.
        button.addEventListener('pointerdown', this.#onAddPointerDown);
        button.addEventListener('click', () => this.#activateInline(position, button, key));
        return button;
    }

    #positionAddControl(
        button: HTMLButtonElement,
        spec: {
            top: number;
            left?: number | null;
            mode: 'gutter';
        },
        hostRect: DOMRect,
    ): void {
        button.dataset.mode = spec.mode;

        const top = spec.top - hostRect.top;
        button.style.top = `${top}px`;
        button.style.width = '';
        button.style.right = '';
        if (typeof spec.left === 'number') {
            button.style.left = `${spec.left}px`;
            button.dataset.vizyNestedAdd = '';
        } else {
            button.style.left = '';
            delete button.dataset.vizyNestedAdd;
        }
    }

    #clearButtons(): void {
        for (const button of this.#inlineButtons.values()) button.remove();
        this.#inlineButtons.clear();
    }

    #trailingAnchorInContainer(
        services: NodeViewServices,
        container: InsertionContext['container'],
    ): InsertionAnchor | null {
        return this.#trailingAnchorInContainerList(findInlineAnchors(services), container);
    }

    #runInsertion(
        services: NodeViewServices,
        context: InsertionContext,
        itemId: string,
    ): void {
        services.suspendInsertionSideEffects?.();
        this.#popover.close({ restoreFocus: false, animate: false });
        void executeInsertion(services, context, itemId).finally(() => {
            services.resumeInsertionSideEffects?.();
        });
    }

    #trailingAnchorInContainerList(
        anchors: readonly InsertionAnchor[],
        container: InsertionContext['container'],
    ): InsertionAnchor | null {
        let trailing: InsertionAnchor | null = null;
        for (const anchor of anchors) {
            if (!this.#containersMatch(anchor.context.container, container)) continue;
            if (!trailing || anchor.position > trailing.position) trailing = anchor;
        }
        return trailing;
    }

    #containersMatch(
        a: InsertionContext['container'],
        b: InsertionContext['container'],
    ): boolean {
        return a.kind === b.kind;
    }

    #containerUnderPointer(): InsertionContext['container'] {
        return { kind: 'root' };
    }

    /**
     * Topmost element under the pointer that is not insertion overlay / our popup.
     * Needed so Hosted nested editors and Block menus still suppress this gutter.
     */
    #contentElementUnderPointer(): Element | null {
        const stack = typeof document.elementsFromPoint === 'function'
            ? document.elementsFromPoint(this.#pointerX, this.#pointerY)
            : [document.elementFromPoint(this.#pointerX, this.#pointerY)].filter(
                (el): el is Element => el instanceof Element,
            );
        for (const el of stack) {
            if (!(el instanceof Element)) continue;
            if (this.#isInsertionOverlay(el)) continue;
            return el;
        }
        return null;
    }

    #isInsertionOverlay(el: Element): boolean {
        let node: Node | null = el;
        while (node) {
            if (node instanceof HTMLElement) {
                if (node.classList.contains('vizy-insertion-overlay')
                    || node.classList.contains('vizy-inline-add')
                    || node.classList.contains('vizy-insertion-popup')
                    || node.localName === 'pk-popup'
                    || node.localName === 'vizy-insertion-list') {
                    return true;
                }
            }
            if (node instanceof ShadowRoot) {
                node = node.host;
                continue;
            }
            node = node.parentNode;
        }
        return false;
    }




    #activateInline(position: number, button: HTMLButtonElement, invokerKey: string): void {
        const context = this.#services().insertion.buildContext('inline', position);
        if (!context) return;
        this.#activateSurface(
            context,
            button,
            'inline',
            BLOCK_INSERT_KINDS,
            invokerKey,
        );
    }

    /**
     * Block ⋯ "Add Block above" — same one-choice / shared-list path as gutter `+`,
     * anchored on the menu trigger, inserting before the subject Block.
     */
    openAddBlockAbove(blockUid: string, invoker: HTMLElement): void {
        const services = this.#services();
        const found = findBlockNode(services.editor, blockUid);
        if (!found) return;
        const context = services.insertion.buildContext('inline', found.pos);
        if (!context) return;
        this.#activateSurface(
            context,
            invoker,
            'inline',
            ['block'],
            `add-above:${blockUid}`,
        );
    }

    #activateSurface(
        context: InsertionContext,
        invoker: HTMLElement,
        surface: InsertionContext['surface'],
        kinds?: readonly InsertionKind[],
        invokerKey?: string,
        options: {
            claimEditorFocus?: boolean;
            /** Override Search autofocus (toolbar Add Block always focuses Search). */
            autofocusFilter?: boolean;
        } = {},
    ): void {
        const key = invokerKey
            ?? invoker.dataset.vizyInvokerKey
            ?? null;
        // Gutter / Add-above always reclaim the editor; toolbar cold does not.
        const claimEditorFocus = options.claimEditorFocus !== false;
        // Default: follow claimEditorFocus. Toolbar Add Block forces true so
        // Search is ready after Formatting toggle-close left ProseMirror blurred.
        const autofocusFilter = options.autofocusFilter ?? claimEditorFocus;

        // Same chip while its exit is still animating — ignore (don't reopen).
        if (key && this.#popover.isClosingInvoker(key)) {
            this.#releaseGestureBody();
            return;
        }

        // Same chip again → toggle closed. Toolbar Add Block leaves focus on
        // the trigger (no editor focus flash); gutter puts the caret back.
        if (
            (this.#popover.isOpen && (this.#popover.isInvoker(invoker) || (key && this.#popover.invokerKey === key)))
            || (this.#browse.isOpen && key && this.#lastOpen?.invokerKey === key)
        ) {
            const restoreFocus = claimEditorFocus && key !== 'toolbar-plus';
            this.#popover.close({ restoreFocus, animate: true });
            this.#browse.close();
            // onClose clears expanded; belt if session lacked an onClose.
            this.#setInvokerExpanded(invoker, key, false);
            this.#releaseGestureBody();
            return;
        }

        // Open on another line while a panel is up (or mid-exit) → hard switch.
        const switching = this.#popover.isOpen || this.#popover.isClosing || this.#browse.isOpen;
        const services = this.#services();
        const fresh = services.insertion.buildContext(surface, context.from);
        if (!fresh) return;

        const results = services.insertion.query({ context: fresh, kinds });
        const direct = oneChoiceDirect(results);
        if (direct) {
            this.#runInsertion(services, fresh, direct.item.id);
            this.#releaseGestureBody();
            return;
        }

        if (results.length === 0) {
            this.#releaseGestureBody();
            return;
        }

        const rect = invoker.getBoundingClientRect();
        this.#lastOpen = {
            context: fresh,
            invoker,
            surface,
            kinds,
            invokerKey: key,
            claimEditorFocus,
            autofocusFilter,
            rect,
        };

        const preferred = this.#fieldInsertView();
        if (preferred === 'grid') {
            this.#popover.close({ restoreFocus: false, animate: false });
            this.#openBrowse(services, fresh, results, {
                invoker,
                key,
                claimEditorFocus,
            });
            this.#releaseGestureBody();
            return;
        }

        this.#browse.close();
        this.#popover.open(services, fresh, rect, {
            // Identity for toggle uses invokerKey — never returnFocus the chip
            // (focusing `+` on dismiss retargeted clicks and reopened the palette).
            invokerKey: key,
            invoker,
            kinds,
            autofocusFilter,
            holdFieldFocus: claimEditorFocus,
            onRestoreFocus: claimEditorFocus
                ? () => {
                    // The insertion target can be far from ProseMirror's previous
                    // selection. Restore keyboard ownership without asking TipTap to
                    // scroll that stale selection back into view.
                    services.editor.commands.focus(undefined, { scrollIntoView: false });
                }
                : null,
            onClose: () => {
                this.#setInvokerExpanded(invoker, key, false);
            },
            onViewChange: (view) => this.#onInsertViewChange(view),
            // Switching lines: hard-replace without exit+enter stutter.
            skipEnterMotion: switching,
        });
        this.#setInvokerExpanded(invoker, key, true);
        // Popover owns field-focus focus now; drop the pointerdown gesture hold.
        this.#releaseGestureBody();
    }

    #fieldHandle(): string {
        return this.#services().manifest.field.fieldHandle?.trim() || '';
    }

    #fieldInsertView(): BlockInsertView {
        return readBlockInsertView(this.#fieldHandle());
    }

    #onInsertViewChange(view: BlockInsertView): void {
        writeBlockInsertView(this.#fieldHandle(), view);
        const last = this.#lastOpen;
        if (!last) return;
        const services = this.#services();
        if (view === 'grid') {
            const results = services.insertion.query({
                context: last.context,
                kinds: last.kinds,
            });
            this.#popover.close({ restoreFocus: false, animate: false });
            this.#openBrowse(services, last.context, results, {
                invoker: last.invoker,
                key: last.invokerKey,
                claimEditorFocus: last.claimEditorFocus,
            });
            return;
        }
        // Back to list from dialog.
        this.#browse.close();
        this.#popover.open(services, last.context, last.rect, {
            invokerKey: last.invokerKey,
            invoker: last.invoker,
            kinds: last.kinds,
            autofocusFilter: last.autofocusFilter,
            holdFieldFocus: last.claimEditorFocus,
            onRestoreFocus: last.claimEditorFocus
                ? () => {
                    services.editor.commands.focus(undefined, { scrollIntoView: false });
                }
                : null,
            onClose: () => {
                this.#setInvokerExpanded(last.invoker, last.invokerKey, false);
            },
            onViewChange: (next) => this.#onInsertViewChange(next),
        });
        this.#setInvokerExpanded(last.invoker, last.invokerKey, true);
    }

    #openBrowse(
        services: NodeViewServices,
        context: InsertionContext,
        items: readonly import('./types').AvailableInsertion[],
        options: {
            invoker: HTMLElement;
            key: string | null;
            claimEditorFocus: boolean;
        },
    ): void {
        this.#browse.open(services, context, items, {
            onView: (view) => this.#onInsertViewChange(view),
            onClose: () => {
                this.#setInvokerExpanded(options.invoker, options.key, false);
            },
        });
        this.#setInvokerExpanded(options.invoker, options.key, true);
    }

    /**
     * Open paint for palette invokers — same `aria-expanded` signal Formatting
     * gets from `pk-dropdown-menu`. Toolbar Add Block is Lit-owned (property);
     * gutter chips are plain DOM buttons.
     */
    #setInvokerExpanded(
        invoker: HTMLElement,
        key: string | null,
        open: boolean,
    ): void {
        if (key === 'toolbar-plus') {
            this.#onToolbarAddBlockOpenChange?.(open);
            return;
        }
        if (open) {
            invoker.setAttribute('aria-expanded', 'true');
        } else {
            invoker.removeAttribute('aria-expanded');
        }
    }

    #onAddPointerDown = (event: PointerEvent): void => {
        if (event.button !== 0) return;
        event.preventDefault();
        this.#holdGestureBody();
        const release = (): void => {
            window.removeEventListener('pointerup', release, true);
            window.removeEventListener('pointercancel', release, true);
            // After `click` (same task turn as pointerup → click → setTimeout 0).
            window.setTimeout(() => this.#releaseGestureBody(), 0);
        };
        window.addEventListener('pointerup', release, true);
        window.addEventListener('pointercancel', release, true);
    };

    #holdGestureBody(): void {
        if (this.#gestureBody) return;
        const body = resolveEditorBody(this.#host);
        if (!body) return;
        this.#gestureBody = body;
        setEditorFieldHasFocus(body, true);
    }

    #releaseGestureBody(): void {
        if (!this.#gestureBody) return;
        setEditorFieldHasFocus(this.#gestureBody, false);
        this.#gestureBody = null;
    }

}
