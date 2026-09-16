import type { Editor } from '@tiptap/core';

/**
 * Editor focus contract (authoring UI)
 * ========================================
 *
 * Three different “focus” ideas are easy to conflate:
 *
 * 1. **ProseMirror selection** — where the caret/range lives in the doc.
 * 2. **DOM focus** — which element receives keyboard events (`document.activeElement`).
 * 3. **Field focus ring** — the Craft input ring on `.vizy-editor-body`
 *    (`:has(.vizy-editor-surface:focus-within)` or synthetic `data-has-focus`).
 *    Toolbar-only DOM focus (pk-dropdown-menu trigger/panel under vizy-toolbar)
 *    must not paint the ring — that is why Add Block (body-portaled Search)
 *    never flickered on toggle while Formatting did.
 *
 * Permanent select-all guard
 * --------------------------
 * Chromium (and friends) select the whole contenteditable when it is focused
 * during `pointerdown`/`mousedown`. Authoring UI lives inside or beside
 * that surface, so **one capture-phase listener** on `.vizy-editor-body`
 * (`installEditorSelectionGuard`) preventDefaults every control press. New
 * controls must not re-learn this — the guard is the policy.
 *
 * Rules callers must still follow:
 *
 * - **Never call `view.focus()` / `commands.focus()` during `mousedown`/`pointerdown`.**
 *   The DOM guard cannot stop a deliberate mid-press focus() — that still
 *   select-alls. Restore focus only after the pointer gesture ends.
 * - **Block selection paint is not `.ProseMirror-focused`.** It follows writing-
 *   surface activity (`:has(.vizy-editor-surface:focus-within)` / `data-has-focus`).
 *   Header gestures hold {@link holdEditorFieldFocusForPointerGesture} so the
 *   ring does not flash when Chromium blurs the CE on mouseup.
 * - **In-tree toolbar menus are not surface focus.** `pk-dropdown-menu` panels
 *   stay under vizy-toolbar; hold {@link setEditorFieldHasFocus} for warm menu
 *   sessions. Body-portaled overlays (insertion Search) leave surface
 *   `:focus-within` the same way — same hold.
 * - **Restore after the pointer gesture.** Use {@link restoreEditorFocus} on
 *   pointerup / `pk-open-change` / Escape — not on the opening mousedown.
 *   Toolbar menus and actions restore **only when the editor was already focused**
 *   at the start of the gesture; a cold toolbar click must not steal focus from
 *   the Craft title or another field.
 * - **Do not steal focus from foreign controls.** Restore skips when focus already
 *   moved to an input outside this field (Craft title, another field, etc.).
 * - **Nested Block Craft fields** are real focus targets inside the field; they
 *   correctly drive `:focus-within`. Do not force ProseMirror focus when the user
 *   clicked those.
 *
 * {@link preserveEditorSelection} remains a fine-grained alias for the same
 * `preventDefault`; redundant with the field guard and safe to call explicitly.
 */

/** Craft-style field frame around toolbar + surface (see vizy.css). */
export const EDITOR_BODY_SELECTOR = '.vizy-editor-body';

/** Presence attribute: keep field focus ring without DOM `:focus-within`. */
export const EDITOR_FIELD_HAS_FOCUS_ATTR = 'data-has-focus';

/** Mark optional UI hosts; the guard also keys off `contenteditable=false`. */
export const EDITOR_UI_ATTR = 'data-vizy-ui';

const focusHoldCounts = new WeakMap<HTMLElement, number>();

export function resolveEditorBody(from: Element | null | undefined): HTMLElement | null {
    const body = from?.closest(EDITOR_BODY_SELECTOR);
    return body instanceof HTMLElement ? body : null;
}

/**
 * Hold or release synthetic field focus ring on `.vizy-editor-body`.
 *
 * Ref-counted so insertion palette, toolbar menus, etc. can nest without
 * clobbering each other. Real keyboard focus may live in a portaled panel;
 * this only paints the Craft input ring.
 */
export function setEditorFieldHasFocus(body: HTMLElement | null, hasFocus: boolean): void {
    if (!body) return;
    const current = focusHoldCounts.get(body) ?? 0;
    const next = Math.max(0, current + (hasFocus ? 1 : -1));
    if (next === 0) {
        focusHoldCounts.delete(body);
        body.removeAttribute(EDITOR_FIELD_HAS_FOCUS_ATTR);
        return;
    }
    focusHoldCounts.set(body, next);
    body.setAttribute(EDITOR_FIELD_HAS_FOCUS_ATTR, '');
}

function isPrimaryButton(event: Event): boolean {
    return event instanceof PointerEvent || event instanceof MouseEvent
        ? event.button === 0
        : false;
}

function pathElements(event: Event): HTMLElement[] {
    return event.composedPath().filter((node): node is HTMLElement => node instanceof HTMLElement);
}

/**
 * Whether this press must `preventDefault` so the contenteditable is not focused
 * mid-gesture (Chromium select-all footgun).
 *
 * Allow default for: writing surfaces, real form fields, drag grip.
 * Preserve for: everything else inside `.vizy-editor-body` (headers, toolbar,
 * gutters, Add block, layout UI, …).
 */
export function shouldPreserveEditorSelection(event: Event): boolean {
    if (!isPrimaryButton(event)) return false;

    const path = pathElements(event);
    if (!path.some((node) => node.matches(EDITOR_BODY_SELECTOR))) return false;

    for (const node of path) {
        // HTML5 drag arming requires an uncancelled mousedown on the grip.
        if (node.matches('[data-vizy-drag-handle]')) return false;
        // Craft / native fields must receive focus.
        if (node.matches('input, textarea, select, option')) return false;
        // True nested editables (not our ce=false controls).
        if (node.getAttribute('contenteditable') === 'true') return false;
    }

    // Explicit / structural UI inside or beside the editable.
    if (path.some((node) => (
        node.getAttribute('contenteditable') === 'false'
        || node.hasAttribute(EDITOR_UI_ATTR)
        || node.matches(
            `vizy-toolbar, vizy-bubble-menu, [${EDITOR_UI_ATTR}], [data-vizy-insertion-overlay], .vizy-insertion-overlay`,
        )
    ))) {
        return true;
    }

    // Root prose / empty PM canvas — allow caret and gapcursor.
    if (path.some((node) => node.classList.contains('ProseMirror'))) return false;

    // Unknown press inside the field body: prefer no select-all.
    return true;
}

/**
 * Toolbar / gutter / menu-trigger mousedown: keep the ProseMirror selection.
 *
 * Must not focus the editor here — that selects-all during the press.
 * Prefer {@link installEditorSelectionGuard} at the field root; this helper is
 * the same `preventDefault` for call sites that want to be explicit.
 */
export function preserveEditorSelection(event: Event): void {
    event.preventDefault();
}

/**
 * Field-wide capture guard: every control press inside `.vizy-editor-body`
 * preventDefaults once, so new UI cannot regress into select-all by forgetting
 * a per-control handler.
 */
export function installEditorSelectionGuard(root: HTMLElement): () => void {
    const onPointerDown = (event: PointerEvent): void => {
        if (shouldPreserveEditorSelection(event)) {
            event.preventDefault();
        }
    };
    root.addEventListener('pointerdown', onPointerDown, true);
    return () => root.removeEventListener('pointerdown', onPointerDown, true);
}

/**
 * Safe TipTap focus probe — `editor.view` throws when the editor is destroyed
 * or not yet mounted (teardown races with pk-dropdown-menu open-change).
 */
export function editorViewHasFocus(editor: Editor | null | undefined): boolean {
    if (!editor || editor.isDestroyed) return false;
    try {
        return editor.view.hasFocus();
    } catch {
        return false;
    }
}

/**
 * Whether reclaiming ProseMirror focus would steal from an unrelated control.
 */
export function shouldRestoreEditorFocus(editor: Editor): boolean {
    const active = document.activeElement;
    if (!(active instanceof HTMLElement) || active === document.body) return true;

    // Already in (or is) the editor surface.
    if (active === editor.view.dom || editor.view.dom.contains(active)) return true;

    // Our field focus ring (toolbar triggers, block headers, …).
    const body = resolveEditorBody(editor.view.dom);
    if (body?.contains(active)) return true;

    // Portaled PK / Vizy overlays that are dismissing.
    if (active.closest('pk-popup, pk-dropdown-menu, pk-dropdown-item, vizy-insertion-list')) {
        return true;
    }

    // Craft inputs, other CP fields, etc. — leave them alone.
    return false;
}

/**
 * Safely return keyboard focus to ProseMirror after an overlay/control gesture.
 *
 * Schedules on a microtask so it never runs in the same turn as `mousedown`
 * (which would select-all). By default no-ops when focus already moved outside
 * the field (Craft title, another field). Pass `{ force: true }` when the user
 * explicitly activated editor controls (e.g. Block header) — Enter must hit the
 * editor, not submit the Craft entry form.
 *
 * Uses `view.focus()` rather than TipTap `commands.focus()`: the latter defers
 * to `requestAnimationFrame` for NodeSelections, which leaves a window where
 * Enter still submits the form after a Block header click.
 */
export function restoreEditorFocus(
    editor: Editor | null | undefined,
    options?: { force?: boolean },
): void {
    if (!editor || editor.isDestroyed) return;
    queueMicrotask(() => {
        if (editor.isDestroyed) return;
        if (!options?.force && !shouldRestoreEditorFocus(editor)) return;
        // Keep the current ProseMirror selection; only claim DOM focus.
        try {
            editor.view.focus();
        } catch {
            // View may be mid-teardown.
        }
    });
}

/**
 * Hold field authoring UI (`data-has-focus`) for one pointer gesture.
 *
 * Block selection paint keys off field activity, not `.ProseMirror-focused`.
 * Header presses preventDefault and live inside the CE, so DOM focus flickers;
 * this hold keeps the Block ring stable until pointerup, then runs `onEnd`
 * (typically one {@link restoreEditorFocus}) and releases so `:focus-within`
 * can take over.
 */
export function holdEditorFieldFocusForPointerGesture(
    body: HTMLElement | null,
    onEnd?: () => void,
): void {
    if (!body) {
        onEnd?.();
        return;
    }

    setEditorFieldHasFocus(body, true);

    const end = (): void => {
        window.removeEventListener('pointerup', end, true);
        window.removeEventListener('pointercancel', end, true);
        onEnd?.();
        // After restore's microtask so `:focus-within` is true before we drop the hold.
        queueMicrotask(() => setEditorFieldHasFocus(body, false));
    };

    window.addEventListener('pointerup', end, true);
    window.addEventListener('pointercancel', end, true);
}
