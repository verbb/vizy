/**
 * Sticky toolbar pin offset for Craft scrollports that are not the entry body.
 *
 * Entry edit uses `top: var(--header-height)` under Craft’s fixed `#header`.
 * Live Preview scrolls `.lp-editor-container .lp-content` under an absolute LP
 * preview header. Element-editor slideouts scroll `.so-body` / `.so-content`
 * under a flex `.pane-header`.
 *
 * Keep CSS `position: sticky` (no Vizy 3 scrollTop + top hacks). Write
 * `--vizy-toolbar-sticky-top` on the active scrollport(s).
 *
 * Sticky `top: 0` on a padded scrollport sits at the **content** edge (inside
 * padding), not the border edge. Pin = `overlayPx - padding-block-start`:
 * - Live Preview: overlay is the absolute LP header (~44); Craft pads
 *   `.lp-content` (~68) → often negative.
 * - Slideout: pane header is a flex sibling (overlay 0); Craft pads
 *   `.so-body` (~24) when not `showing-sidebar` → typically `-24`. Sidebar
 *   mode scrolls `.so-content` with padding 0 → pin 0.
 * Raw `0` or entry `--header-height` both leave a gap under the header.
 */

export const TOOLBAR_STICKY_TOP_VAR = '--vizy-toolbar-sticky-top';

const LP_CONTENT_SELECTOR = '.lp-editor-container .lp-content';
const LP_HEADER_SELECTOR = '.lp-editor-container > header';

/** Craft element / CP screen slideout scrollports (sidebar and single-column). */
export const SLIDEOUT_SCROLLPORT_SELECTOR = [
    '.slideout.showing-sidebar .so-body > .so-content',
    '.slideout > .so-body',
].join(', ');

const SLIDEOUT_HEADER_SELECTOR = '.slideout > .pane-header';

type GarnishLike = {
    on?: (target: unknown, event: string, handler: (...args: unknown[]) => void) => void;
};

type CraftPreviewHost = {
    Preview?: unknown;
    LivePreview?: unknown;
    Slideout?: unknown;
};

/** Padding-block-start of a scrollport, in CSS pixels. */
function scrollportPaddingTopPx(port: HTMLElement): number {
    return Math.round(
        parseFloat(getComputedStyle(port).paddingBlockStart || '0') || 0,
    );
}

/**
 * Sticky `top` for Live Preview: LP header height minus `.lp-content` padding.
 * May be negative when padding exceeds the absolute header (Craft default).
 */
export function measureLivePreviewStickyTopPx(
    root: ParentNode = document,
): number {
    const header = root.querySelector(LP_HEADER_SELECTOR);
    const content = root.querySelector(LP_CONTENT_SELECTOR);
    if (!(header instanceof HTMLElement) || !(content instanceof HTMLElement)) {
        return 0;
    }
    // Prefer layout height over getBoundingClientRect so transforms on the LP
    // shell do not skew the sticky pin.
    const headerPx = Math.round(header.offsetHeight);
    // overlay (header) − paddingEdge; see file header for why this is not raw height.
    return Math.round(headerPx - scrollportPaddingTopPx(content));
}

/**
 * Sticky `top` for one slideout scrollport: `0 - padding` (pane header is a
 * sibling above the port, not an overlay). Never entry `--header-height`.
 */
export function measureSlideoutScrollportStickyTopPx(port: HTMLElement): number {
    return Math.round(0 - scrollportPaddingTopPx(port));
}

/**
 * Whether any Craft slideout scrollport is mounted (sidebar or single-column).
 */
export function hasSlideoutScrollport(root: ParentNode = document): boolean {
    return root.querySelector(SLIDEOUT_SCROLLPORT_SELECTOR) instanceof HTMLElement;
}

/**
 * @deprecated Prefer {@link measureSlideoutScrollportStickyTopPx} per port.
 * Returns 0 when a slideout exists (legacy callers); null when none.
 */
export function measureSlideoutStickyTopPx(
    root: ParentNode = document,
): number | null {
    if (!hasSlideoutScrollport(root)) return null;
    // Keep the header query for callers / tests that assert header presence.
    void root.querySelector(SLIDEOUT_HEADER_SELECTOR);
    return 0;
}

export function applyToolbarStickyTop(
    host: HTMLElement | null,
    px: number | null,
): void {
    if (!host) return;
    if (px == null) {
        host.style.removeProperty(TOOLBAR_STICKY_TOP_VAR);
        return;
    }
    // Negative pins are valid for Live Preview (header shorter than padding).
    host.style.setProperty(TOOLBAR_STICKY_TOP_VAR, `${Math.round(px)}px`);
}

function querySlideoutScrollports(root: ParentNode = document): HTMLElement[] {
    return [...root.querySelectorAll(SLIDEOUT_SCROLLPORT_SELECTOR)]
        .filter((node): node is HTMLElement => node instanceof HTMLElement);
}

/**
 * Install once per CP page. Hooks Preview / LivePreview / Slideout when Garnish
 * is ready; watches `document.body` for LP / slideout shells so late asset boot
 * still syncs.
 */
export function installToolbarStickyOffsetBridge(): () => void {
    const tracked = new Set<HTMLElement>();
    let resizeObserver: ResizeObserver | null = null;
    let mo: MutationObserver | null = null;
    let hooked = false;
    let hookAttempts = 0;

    const clearTracked = (): void => {
        for (const host of tracked) {
            applyToolbarStickyTop(host, null);
        }
        tracked.clear();
        resizeObserver?.disconnect();
        resizeObserver = null;
    };

    const ensureObserver = (): ResizeObserver | null => {
        if (typeof ResizeObserver === 'undefined') return null;
        resizeObserver ??= new ResizeObserver(() => {
            syncAll();
        });
        return resizeObserver;
    };

    const track = (host: HTMLElement, px: number): void => {
        tracked.add(host);
        applyToolbarStickyTop(host, px);
        ensureObserver()?.observe(host);
    };

    const syncLivePreview = (): void => {
        const content = document.querySelector(LP_CONTENT_SELECTOR);
        if (!(content instanceof HTMLElement)) return;
        track(content, measureLivePreviewStickyTopPx());
        const header = document.querySelector(LP_HEADER_SELECTOR);
        if (header instanceof HTMLElement) ensureObserver()?.observe(header);
    };

    const syncSlideouts = (): void => {
        if (!hasSlideoutScrollport()) return;
        for (const port of querySlideoutScrollports()) {
            // Per-port: padded `.so-body` needs -padding; sidebar `.so-content` is 0.
            track(port, measureSlideoutScrollportStickyTopPx(port));
        }
        const header = document.querySelector(SLIDEOUT_HEADER_SELECTOR);
        if (header instanceof HTMLElement) ensureObserver()?.observe(header);
    };

    const syncAll = (): void => {
        // Drop stale inline pins, then re-apply for whatever shells are open.
        clearTracked();
        syncLivePreview();
        syncSlideouts();
    };

    const onOpen = (): void => {
        // Shell DOM is inserted then measured — two frames beats a fixed timeout.
        requestAnimationFrame(() => {
            requestAnimationFrame(syncAll);
        });
    };

    const hookCraft = (): boolean => {
        if (hooked) return true;
        const Craft = (window as Window & { Craft?: CraftPreviewHost }).Craft;
        const Garnish = (window as Window & { Garnish?: GarnishLike }).Garnish;
        if (!Garnish?.on || !Craft) return false;

        // Craft 4/5 Preview (full-screen) + legacy LivePreview enter/exit.
        if (Craft.Preview) {
            Garnish.on(Craft.Preview, 'open', onOpen);
            Garnish.on(Craft.Preview, 'close', syncAll);
        }
        if (Craft.LivePreview) {
            Garnish.on(Craft.LivePreview, 'enter', onOpen);
            Garnish.on(Craft.LivePreview, 'exit', syncAll);
        }
        // Element editor / CpScreen slideouts.
        if (Craft.Slideout) {
            Garnish.on(Craft.Slideout, 'open', onOpen);
            Garnish.on(Craft.Slideout, 'close', syncAll);
        }
        hooked = true;
        return true;
    };

    const scheduleHook = (): void => {
        if (hookCraft() || hookAttempts >= 60) return;
        hookAttempts += 1;
        window.setTimeout(scheduleHook, 100);
    };

    scheduleHook();
    syncAll();

    // Craft appends LP / slideout shells on `body`.
    if (document.body) {
        mo = new MutationObserver(() => {
            syncAll();
        });
        mo.observe(document.body, { childList: true });
    }

    return () => {
        mo?.disconnect();
        mo = null;
        clearTracked();
    };
}
