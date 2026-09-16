import { BLOCK_HEIGHT_MOTION, prefersReducedMotion } from './block-insert-animation';

type Origin = { top: number; left: number };

/** First-frame positions of sibling Blocks, captured at grip dragstart. */
let pendingOrigins: Map<string, Origin> | null = null;
let pendingGeneration = 0;

/**
 * Snapshot every direct-sibling `vizy-block` under the dragged host's parent.
 * Used for a post-drop FLIP settle without changing the HTML5 drag gesture.
 */
export function captureBlockDragOrigins(host: HTMLElement): void {
    const origins = new Map<string, Origin>();
    const parent = host.parentElement;
    if (parent) {
        for (const node of Array.from(parent.children)) {
            if (!(node instanceof HTMLElement) || node.localName !== 'vizy-block') continue;
            const uid = node.getAttribute('data-block-uid');
            if (!uid) continue;
            const rect = node.getBoundingClientRect();
            origins.set(uid, { top: rect.top, left: rect.left });
        }
    }
    // Always include the dragged host even if parent walk missed it.
    const hostUid = host.getAttribute('data-block-uid');
    if (hostUid && !origins.has(hostUid)) {
        const rect = host.getBoundingClientRect();
        origins.set(hostUid, { top: rect.top, left: rect.left });
    }
    pendingOrigins = origins;
    pendingGeneration += 1;
}

export function clearBlockDragOrigins(): void {
    pendingOrigins = null;
}

/**
 * After a successful sibling reorder, FLIP sibling Blocks from their dragstart
 * positions to their post-commit layout.
 *
 * Important: do not clear origins from `dragend` synchronously — WebKit can fire
 * `dragend` before `drop`, which used to wipe the snapshot and skip the settle.
 */
export function playBlockDropSettle(): void {
    const origins = pendingOrigins;
    const generation = pendingGeneration;
    if (!origins?.size || prefersReducedMotion()) {
        pendingOrigins = null;
        return;
    }
    if (typeof document === 'undefined') {
        pendingOrigins = null;
        return;
    }

    // Consume now so a deferred dragend clear cannot race the snapshot away
    // before measurement — we keep a local reference for the FLIP.
    pendingOrigins = null;

    const runFlip = (): void => {
        // A newer drag started — abandon this settle.
        if (generation !== pendingGeneration) return;

        for (const [uid, first] of origins) {
            const el = document.querySelector<HTMLElement>(
                `vizy-block[data-block-uid="${CSS.escape(uid)}"]`,
            );
            if (!el || typeof el.animate !== 'function') continue;
            const last = el.getBoundingClientRect();
            const dx = first.left - last.left;
            const dy = first.top - last.top;
            if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;

            // Invert → play: element is already at Last; start translated to First.
            // fill: 'backwards' applies the invert frame immediately so the double
            // rAF delay does not flash the final layout before motion starts.
            el.animate(
                [
                    { transform: `translate(${dx}px, ${dy}px)` },
                    { transform: 'translate(0px, 0px)' },
                ],
                {
                    duration: BLOCK_HEIGHT_MOTION.duration,
                    easing: BLOCK_HEIGHT_MOTION.easing,
                    fill: 'backwards',
                },
            );
        }
    };

    // Two frames: ProseMirror has moved the DOM; Lit has painted.
    requestAnimationFrame(() => {
        requestAnimationFrame(runFlip);
    });
}
