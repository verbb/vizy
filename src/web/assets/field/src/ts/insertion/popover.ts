import { VizyInsertionListElement } from '../components/VizyInsertionListElement';
import { resolveEditorBody, setEditorFieldHasFocus } from '../editor-field-focus';
import type { NodeViewServices } from '../extensions';
import { resolveActiveItemId, stepActiveItemId } from './list-state';
import { contextStillValid, executeInsertion } from './surface-helpers';
import type { AvailableInsertion, InsertionContext, InsertionKind } from './types';
import type { BlockInsertView } from './insert-view-storage';

type PkPopupVirtualElement = {
    getBoundingClientRect: () => DOMRect;
    contextElement?: Element;
};

type PkPopupEl = HTMLElement & {
    active: boolean;
    placement: string;
    distance: number;
    flip: boolean;
    flipPadding: number;
    shift: boolean;
    shiftPadding: number;
    anchorTracking: boolean;
    positionMethod?: 'fixed' | 'absolute';
    anchor: Element | string | PkPopupVirtualElement;
    reposition: () => void;
};

/** Matches `vizy-insertion-list` `:host { max-height: 20rem }`. */
export const INSERTION_LIST_MAX_HEIGHT_PX = 320;
/** Match pk-dropdown-menu inner popup padding. */
export const INSERTION_VIEWPORT_PAD_PX = 10;
/** Do not shrink below a usable row + search UI. */
export const INSERTION_LIST_MIN_HEIGHT_PX = 120;

/**
 * Clamp list height to viewport space on the connecting side so the panel
 * scrolls internally instead of extending off-screen (pk-popup has no auto-size).
 */
export function computeInsertionListMaxHeight(
    anchor: DOMRect,
    placement: string,
    options: {
        distance?: number;
        pad?: number;
        capPx?: number;
        minPx?: number;
        viewportHeight?: number;
    } = {},
): number {
    const distance = options.distance ?? 4;
    const pad = options.pad ?? INSERTION_VIEWPORT_PAD_PX;
    const cap = options.capPx ?? INSERTION_LIST_MAX_HEIGHT_PX;
    const min = options.minPx ?? INSERTION_LIST_MIN_HEIGHT_PX;
    const viewportHeight = options.viewportHeight ?? window.innerHeight;

    const side = placement.split('-')[0] || 'bottom';
    let available: number;
    switch (side) {
        case 'top':
            available = anchor.top - distance - pad;
            break;
        case 'bottom':
            available = viewportHeight - anchor.bottom - distance - pad;
            break;
        default:
            // Side placements grow vertically — use full viewport minus margins.
            available = viewportHeight - pad * 2;
            break;
    }
    return Math.max(min, Math.min(cap, Math.floor(available)));
}

/** Where filter text is typed — drives search UI and keyboard ownership. */
export type InsertionFilterMode = 'panel';

type ListSession = {
    kind: 'list';
    popup: PkPopupEl;
    list: VizyInsertionListElement;
    context: InsertionContext;
    activeId: string | null;
    returnFocus: HTMLElement | null;
    /** Prefer this over returnFocus — gutter restores the editor, never the `+`. */
    onRestoreFocus: (() => void) | null;
    /** Stable gutter chip id — survives button recycle in `#renderButtons`. */
    invokerKey: string | null;
    onClose: () => void;
    search: string;
    /** Mutable rect source — swap the fn without replacing `popup.anchor`. */
    rectSource: { getClientRect: (() => DOMRect | null) | null };
    /** Field frame that held `data-has-focus` for this session (panel mode only). */
    fieldBody: HTMLElement | null;
    filterMode: InsertionFilterMode;
    /** Persist kind filter across refresh / Search. */
    kinds: readonly InsertionKind[] | undefined;
};

export type InsertionPopoverOpenOptions = {
    search?: string;
    returnFocus?: HTMLElement | null;
    /**
     * Called when the palette restores focus (Escape / toggle-close / after insert).
     * Gutter uses this to `editor.commands.focus()` — never focus the `+` chip
     * (that retargeted outside-clicks and reopened the palette).
     */
    onRestoreFocus?: (() => void) | null;
    /** Matches `data-vizy-invoker-key` on gutter chips for toggle-after-recycle. */
    invokerKey?: string | null;
    /** Invoker control — open state sets `aria-expanded` for open paint. */
    invoker?: HTMLElement | null;
    onClose?: () => void;
    /** Override insert path (slash deletes the `/` trigger range first). */
    onSelect?: (id: string) => Promise<boolean>;
    /** Live caret/chip rect for slash / tracking anchors. */
    getClientRect?: (() => DOMRect | null) | null;
    /**
     * When set, leave TipTap Suggestion in control of the DOM list instance.
     * Prefer the shared open() path.
     */
    list?: VizyInsertionListElement;
    /**
     * In-popup Search… (gutter `+`, blank-line `/`, toolbar Add Block).
     * Default `panel`.
     */
    filterMode?: InsertionFilterMode;
    /**
     * Panel Search autofocus after pk-popup positions. Default true.
     * Cold toolbar Add Block sets false so browsing does not steal Craft title focus.
     */
    autofocusFilter?: boolean;
    /**
     * Hold field `data-has-focus` while panel Search owns DOM focus. Default true
     * for panel mode. Cold toolbar Add Block sets false.
     */
    holdFieldFocus?: boolean;
    /** Skip enter motion when hard-switching from another gutter chip. */
    skipEnterMotion?: boolean;
    /** Restrict catalog (production → Blocks only). */
    kinds?: readonly InsertionKind[];
    /** Fired when the author picks list/grid in the panel UI. */
    onViewChange?: (view: BlockInsertView) => void;
};

/**
 * Insertion palette: Plugin Kit `pk-popup` + shared `vizy-insertion-list`.
 *
 * Gutter `+`, blank-line `/`, and toolbar Add Block share panel Search
 * (autofocus unless cold toolbar opts out). Slash only opens this overlay after
 * consuming `/` on an empty paragraph — it is not a separate typeahead mode.
 */
export class InsertionPopover {
    #session: ListSession | null = null;
    #disposal: (() => void) | null = null;
    /** In-flight animated teardown — ignored if a hard close / reopen wins. */
    #exitToken = 0;
    /**
     * Session still on-screen playing exit motion after `#session` cleared.
     * Without this, `open()` during exit cancelled `finish` and left an orphan panel.
     */
    #exiting: ListSession | null = null;

    open(
        services: NodeViewServices,
        context: InsertionContext,
        anchor: DOMRect,
        options: InsertionPopoverOpenOptions = {},
    ): void {
        // Hard-close any prior panel (no exit animation) so reopen is immediate.
        this.close({ restoreFocus: false, animate: false });
        const search = options.search ?? '';
        const kinds = options.kinds;
        const results = options.list
            ? [...options.list.items]
            : [...services.insertion.query({
                context,
                search: search || undefined,
                kinds,
            })];
        if (!results.length && !options.list) return;

        const list = options.list ?? new VizyInsertionListElement();
        list.listId = list.listId || `vizy-popover-${context.surface}-${context.from}`;
        list.items = results.length ? results : list.items;
        list.query = search;
        list.filterable = true;
        list.view = 'list';
        list.showViewToggle = true;
        // No highlight until arrows (pk-combobox autoHighlight=false).
        list.activeId = null;
        list.revealActive = false;

        const getClientRect = options.getClientRect ?? (() => anchor);
        const skipEnterMotion = options.skipEnterMotion === true;
        // Panel defaults: autofocus Search + hold Craft ring. Callers (cold
        // toolbar Add Block) opt out so appearance matches Formatting menus.
        const autofocusFilter = options.autofocusFilter !== false;
        const holdFieldFocus = options.holdFieldFocus !== false;
        this.#mountList(services, {
            context,
            list,
            getClientRect,
            returnFocus: options.returnFocus ?? null,
            onRestoreFocus: options.onRestoreFocus ?? null,
            invokerKey: options.invokerKey ?? null,
            onClose: options.onClose ?? (() => undefined),
            onSelect: options.onSelect,
            onViewChange: options.onViewChange,
            search,
            filterMode: 'panel',
            autofocusFilter,
            holdFieldFocus,
            skipEnterMotion,
            kinds,
        });
    }

    stepActive(direction: 1 | -1): string | null {
        if (!this.#session) return null;
        this.#session.activeId = stepActiveItemId(
            this.#session.activeId,
            this.#session.list.items,
            direction,
        );
        this.#session.list.activeId = this.#session.activeId;
        this.#session.list.revealActive = true;
        return this.#session.activeId;
    }

    /** @deprecated Prefer stepActive — kept for call sites mid-rename. */
    stepSlash(direction: 1 | -1): string | null {
        return this.stepActive(direction);
    }

    get activeId(): string | null {
        return this.#session?.activeId ?? null;
    }

    /** Commit the highlighted row after Arrow navigation. */
    selectActive(): string | null {
        if (!this.#session) return null;
        if (this.#session.list.revealActive && this.#session.activeId) {
            return this.#session.activeId;
        }
        return null;
    }

    refresh(services: NodeViewServices): void {
        if (!this.#session) return;
        const fresh = services.insertion.buildContext(
            this.#session.context.surface,
            this.#session.context.from,
        );
        if (!contextStillValid(this.#session.context, fresh)) {
            this.close();
            return;
        }
        this.#session.context = fresh;
        const results = [...services.insertion.query({
            context: fresh,
            search: this.#session.search || undefined,
            kinds: this.#session.kinds,
        })];
        this.#session.list.items = results;
        this.#session.activeId = resolveActiveItemId(this.#session.activeId, results);
        this.#session.list.activeId = this.#session.activeId;
        if (!this.#session.activeId) {
            this.#session.list.revealActive = false;
        }
    }

    close(options: { restoreFocus?: boolean; animate?: boolean } = {}): void {
        this.#disposal?.();
        this.#disposal = null;

        const session = this.#session;
        this.#session = null;

        if (!session) {
            // Hard reopen / insert-commit: drop mid-exit. A soft duplicate close
            // (e.g. trigger click after pointerdown already started exit) must
            // leave the hide animation running — aborting it looked instant.
            if (options.animate === false) {
                this.#abortExiting();
            }
            return;
        }

        // Replacing a live session — tear down any leftover exit panel first.
        this.#abortExiting();

        const token = ++this.#exitToken;
        const shouldRestore = options.restoreFocus !== false;
        // Restore immediately (before exit motion) so the caret isn't stranded
        // while Search unmounts — especially toggle-close / Escape.
        if (shouldRestore) {
            this.#restoreSessionFocus(session);
        }

        let finished = false;
        const finish = (): void => {
            if (finished || token !== this.#exitToken) return;
            finished = true;
            if (this.#exiting === session) this.#exiting = null;
            setEditorFieldHasFocus(session.fieldBody, false);
            session.popup.active = false;
            session.popup.remove();
            session.list.remove();
            session.onClose();
        };

        // Exit motion only when asked (gutter Escape / outside click / toggle).
        // Slash and insert-commit stay instant so TipTap Suggestion teardown stays sync.
        const animate = options.animate === true && session.list.hasAttribute('data-open');
        if (!animate) {
            session.list.classList.remove('closing');
            session.list.removeAttribute('data-open');
            session.list.removeAttribute('data-instant');
            finish();
            return;
        }

        this.#exiting = session;
        session.list.removeAttribute('data-instant');
        // Keep data-open while .closing runs so the opacity gate does not snap
        // to 0; named hide keyframes (not reverse) so cancelling enter cannot
        // satisfy this animationend listener.
        session.list.classList.add('closing');
        const onEnd = (event: AnimationEvent): void => {
            if (event.target !== session.list) return;
            if (event.animationName !== 'vizy-insertion-menu-hide') return;
            session.list.removeEventListener('animationend', onEnd);
            finish();
        };
        session.list.addEventListener('animationend', onEnd);
        window.setTimeout(finish, 140);
    }

    /** Drop a mid-exit panel immediately (used before open / hard close). */
    #abortExiting(): void {
        const exiting = this.#exiting;
        this.#exiting = null;
        // Invalidate any pending animationend / timeout finish.
        ++this.#exitToken;
        if (!exiting) return;
        exiting.list.classList.remove('closing');
        exiting.list.removeAttribute('data-open');
        exiting.list.removeAttribute('data-instant');
        setEditorFieldHasFocus(exiting.fieldBody, false);
        exiting.popup.active = false;
        exiting.popup.remove();
        exiting.list.remove();
        exiting.onClose();
    }

    #restoreSessionFocus(session: ListSession): void {
        if (session.onRestoreFocus) {
            session.onRestoreFocus();
            return;
        }
        // Outside-click dismiss must NOT focus a gutter `+` — focusing during
        // pointerdown retargets the subsequent click onto the button and reopens.
        if (session.returnFocus?.classList.contains('vizy-inline-add')) return;
        session.returnFocus?.focus();
    }
    get isOpen(): boolean {
        return this.#session !== null;
    }

    /** True while an animated dismiss is still on screen. */
    get isClosing(): boolean {
        return this.#exiting !== null;
    }

    /** Same chip's exit is in flight — further clicks should not reopen. */
    isClosingInvoker(key: string | null | undefined): boolean {
        if (!key || !this.#exiting) return false;
        return this.#exiting.invokerKey === key;
    }

    /** True when the open palette was invoked from this control (gutter toggle). */
    isInvoker(el: EventTarget | null): boolean {
        if (!el || !this.#session) return false;
        // Buttons are recycled by pointer-move sync — compare stable keys.
        if (!(el instanceof HTMLElement) || !this.#session.invokerKey) return false;
        return el.dataset.vizyInvokerKey === this.#session.invokerKey;
    }

    /** Stable key for the open gutter chip, if any. */
    get invokerKey(): string | null {
        return this.#session?.invokerKey ?? null;
    }

    #mountList(
        services: NodeViewServices,
        input: {
            context: InsertionContext;
            list: VizyInsertionListElement;
            getClientRect: (() => DOMRect | null) | null;
            returnFocus: HTMLElement | null;
            onRestoreFocus: (() => void) | null;
            invokerKey: string | null;
            onClose: () => void;
            onSelect?: (id: string) => Promise<boolean>;
            onViewChange?: (view: BlockInsertView) => void;
            search: string;
            filterMode: InsertionFilterMode;
            autofocusFilter: boolean;
            holdFieldFocus: boolean;
            skipEnterMotion: boolean;
            kinds?: readonly InsertionKind[];
        },
    ): void {
        const popup = document.createElement('pk-popup') as PkPopupEl;
        popup.className = 'vizy-insertion-popup';
        popup.placement = 'bottom-start';
        popup.distance = 4;
        popup.flip = true;
        popup.flipPadding = INSERTION_VIEWPORT_PAD_PX;
        popup.shift = true;
        popup.shiftPadding = INSERTION_VIEWPORT_PAD_PX;
        popup.anchorTracking = true;
        popup.positionMethod = 'fixed';
        // Stable virtual anchor for the session lifetime. TipTap passes a new
        // getClientRect each update; we only swap the fn on rectSource so
        // pk-popup does not treat it as an anchor change (that hides the panel).
        const rectSource = { getClientRect: input.getClientRect };
        popup.anchor = {
            getBoundingClientRect: () => rectSource.getClientRect?.() ?? new DOMRect(),
        };
        popup.append(input.list);
        document.body.append(popup);

        // Panel Search steals focus out of `:focus-within`; hold the Craft ring
        // when we intentionally own focus. Cold toolbar Add Block skips both.
        const fieldBody = input.holdFieldFocus
            ? resolveEditorBody(services.editor.view.dom)
            : null;
        if (fieldBody) setEditorFieldHasFocus(fieldBody, true);

        const session: ListSession = {
            kind: 'list',
            popup,
            list: input.list,
            context: input.context,
            activeId: input.list.activeId,
            returnFocus: input.returnFocus,
            onRestoreFocus: input.onRestoreFocus,
            invokerKey: input.invokerKey,
            onClose: input.onClose,
            search: input.search,
            rectSource,
            fieldBody,
            filterMode: input.filterMode,
            kinds: input.kinds,
        };
        this.#session = session;
        popup.active = true;

        const clampListToViewport = (): void => {
            if (this.#session !== session) return;
            const rect = session.rectSource.getClientRect?.() ?? new DOMRect();
            const placement = session.popup.getAttribute('data-current-placement')
                ?? session.popup.placement;
            const maxHeight = computeInsertionListMaxHeight(rect, placement, {
                distance: session.popup.distance,
            });
            session.list.style.maxHeight = `${maxHeight}px`;
        };

        // Shrink before reveal so the first visible frame fits the viewport.
        popup.addEventListener('pk-reposition', clampListToViewport);
        clampListToViewport();

        // Reveal only after pk-popup settles — list stays opacity:0 until then
        // (see VizyInsertionListElement). Hard-switches skip enter keyframes.
        void this.#revealListMotion(session, { instant: input.skipEnterMotion });

        const runSelect = (id: string): void => {
            const handler = input.onSelect
                ?? ((itemId: string) => executeInsertion(services, session.context, itemId));
            // Close before the insert transaction settles so overlay/summary work
            // stays suspended for the insert.
            services.suspendInsertionSideEffects?.();
            const pending = handler(id);
            this.close({ restoreFocus: false, animate: false });
            void Promise.resolve(pending).finally(() => {
                services.resumeInsertionSideEffects?.();
            });
        };

        input.list.addEventListener('vizy-insertion-select', ((event: CustomEvent<{ id: string }>) => {
            runSelect(event.detail.id);
        }) as EventListener);

        input.list.addEventListener('vizy-insertion-view', ((event: CustomEvent<{ view: BlockInsertView }>) => {
            input.onViewChange?.(event.detail.view);
        }) as EventListener);

        input.list.addEventListener('vizy-insertion-filter', ((event: CustomEvent<{ query: string }>) => {
            if (!this.#session) return;
            this.#session.search = event.detail.query;
            const filtered = [...services.insertion.query({
                context: this.#session.context,
                search: this.#session.search,
                kinds: this.#session.kinds,
            })];
            this.#session.list.items = filtered;
            this.#session.list.query = this.#session.search;
            this.#session.activeId = null;
            this.#session.list.activeId = null;
            this.#session.list.revealActive = false;
        }) as EventListener);

        const onKeyDown = (event: KeyboardEvent): void => {
            if (!this.#session) return;
            if (event.key === 'Escape') {
                event.preventDefault();
                this.close({ restoreFocus: true, animate: true });
                return;
            }
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                this.stepActive(event.key === 'ArrowDown' ? 1 : -1);
                return;
            }
            if (event.key === 'Enter') {
                const id = this.#session.list.revealActive ? this.#session.activeId : null;
                if (!id) return;
                event.preventDefault();
                runSelect(id);
            }
        };
        const onPointerDown = (event: PointerEvent): void => {
            if (!this.#session) return;
            const path = event.composedPath();
            if (path.includes(this.#session.popup) || path.includes(this.#session.list)) return;
            // Gutter chips and toolbar Add Block own toggle on their `click` —
            // dismissing here caused close-then-reopen stutter and aborted the
            // hide animation (pointerdown closes, click opens / aborts exit).
            if (path.some((node) => (
                node instanceof HTMLElement && (
                    node.classList.contains('vizy-inline-add')
                    || node.hasAttribute('data-vizy-toolbar-add-block')
                )
            ))) {
                return;
            }
            // Click on editor prose/blocks (or anywhere else): dismiss without
            // stealing focus back to the `+` (that would retarget the click).
            this.close({ restoreFocus: false, animate: true });
        };
        document.addEventListener('keydown', onKeyDown, true);
        document.addEventListener('pointerdown', onPointerDown, true);
        this.#disposal = () => {
            popup.removeEventListener('pk-reposition', clampListToViewport);
            document.removeEventListener('keydown', onKeyDown, true);
            document.removeEventListener('pointerdown', onPointerDown, true);
        };

        if (input.autofocusFilter) {
            // Focus search only after pk-popup has positioned (visibility:visible).
            void input.list.focusFilterWhenReady?.();
        }
    }

    /**
     * Wait for `pk-reposition` (popup settled + `.positioned`), then set
     * `data-open` so enter motion starts on the first visible frame — same
     * sequence / scale+fade as `pk-dropdown-menu` `.panel.show`.
     */
    async #revealListMotion(
        session: ListSession,
        options: { instant?: boolean } = {},
    ): Promise<void> {
        const placement = await this.#waitForPopupPlacement(session.popup);
        if (this.#session !== session) return;

        const side = (placement.split('-')[0] || 'bottom');
        session.list.dataset.side = side;
        if (options.instant) {
            session.list.dataset.instant = '';
        } else {
            delete session.list.dataset.instant;
        }

        const floating = session.popup.shadowRoot?.querySelector('.popup');
        // Mirror transform-origin onto the list (PK sets it on the floating el).
        const origin = floating instanceof HTMLElement
            ? getComputedStyle(floating).getPropertyValue('--pk-transform-origin').trim()
            : '';
        if (origin) {
            session.list.style.setProperty('--pk-transform-origin', origin);
        }

        // Set open last — opacity gate + enter animation start in one paint.
        session.list.dataset.open = '';
    }

    /**
     * Prefer the popup's settle event over polling `.positioned` (combobox path).
     */
    #waitForPopupPlacement(popup: PkPopupEl): Promise<string> {
        const fallback = popup.placement || 'bottom-start';
        const read = (): string => popup.getAttribute('data-current-placement') ?? fallback;

        return new Promise((resolve) => {
            let settled = false;
            const finish = (): void => {
                if (settled) return;
                settled = true;
                resolve(read());
            };
            popup.addEventListener('pk-reposition', finish, { once: true });
            // Fallback if the event never fires (tests / broken host).
            window.setTimeout(finish, 300);
        });
    }
}

/** @deprecated Prefer InsertionPopover methods; kept for older call sites. */
export function refreshPopoverItems(
    popup: VizyInsertionListElement,
    results: readonly AvailableInsertion[],
    activeId: string | null,
): string | null {
    popup.items = results;
    const next = resolveActiveItemId(activeId, results);
    popup.activeId = next;
    return next;
}
