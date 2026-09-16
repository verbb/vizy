/** Shared Matrix-like height motion for Block insert / collapse / expand. */
export const BLOCK_HEIGHT_MOTION = {
    duration: 220,
    easing: 'cubic-bezier(0.2, 0.85, 0.25, 1)',
} as const;

export function prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    // Prefer Craft/Garnish so we match Matrix entry fold gating.
    const garnish = (window as Window & {
        Garnish?: { prefersReducedMotion?: () => boolean };
    }).Garnish;
    if (typeof garnish?.prefersReducedMotion === 'function') {
        return garnish.prefersReducedMotion();
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export type HeightMotionOptions = {
    /** Also fade opacity with the height (Matrix fieldsContainer fade). */
    fade?: boolean;
    /** Abort signal — mid-toggle cancel. */
    signal?: AbortSignal;
};

/**
 * Animate an element's height between two pixel values (Matrix Velocity-style
 * measured fold — no CSS grid 0fr/1fr). Callers own overflow / resting styles.
 */
export function animateElementHeight(
    el: HTMLElement,
    fromPx: number,
    toPx: number,
    options: HeightMotionOptions = {},
): Promise<void> {
    if (typeof el.animate !== 'function' || prefersReducedMotion()) {
        return Promise.resolve();
    }
    if (options.signal?.aborted) return Promise.resolve();

    const from: Keyframe = {
        height: `${Math.max(0, fromPx)}px`,
        ...(options.fade ? { opacity: fromPx <= toPx ? 0 : 1 } : {}),
    };
    const to: Keyframe = {
        height: `${Math.max(0, toPx)}px`,
        ...(options.fade ? { opacity: fromPx <= toPx ? 1 : 0 } : {}),
    };

    const animation = el.animate([from, to], {
        duration: BLOCK_HEIGHT_MOTION.duration,
        easing: BLOCK_HEIGHT_MOTION.easing,
        fill: 'forwards',
    });

    const onAbort = (): void => {
        try {
            animation.cancel();
        } catch {
            // Already finished.
        }
    };
    options.signal?.addEventListener('abort', onAbort, { once: true });

    return animation.finished.then(() => {
        animation.cancel();
    }).catch(() => {
        // Aborted / replaced mid-flight — caller still clears styles.
    }).finally(() => {
        options.signal?.removeEventListener('abort', onAbort);
    });
}

/**
 * Matrix-like grow-in when a Block is inserted with its FieldLayout already ready.
 */
export function playBlockInsertAnimation(blockUid: string): void {
    if (typeof document === 'undefined' || prefersReducedMotion()) return;

    const el = document.querySelector<HTMLElement>(
        `vizy-block[data-block-uid="${CSS.escape(blockUid)}"]`,
    );
    if (!el || typeof el.animate !== 'function') return;

    // Two frames: Lit + Craft widgets finish layout after sync adopt.
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            const height = el.getBoundingClientRect().height;
            if (height <= 0) return;
            el.style.overflow = 'hidden';
            const animation = el.animate(
                [
                    { height: '0px', opacity: 0.4, marginBlockStart: '0px', marginBlockEnd: '0px' },
                    { height: `${height}px`, opacity: 1 },
                ],
                {
                    duration: BLOCK_HEIGHT_MOTION.duration,
                    easing: BLOCK_HEIGHT_MOTION.easing,
                },
            );
            void animation.finished.finally(() => {
                el.style.overflow = '';
            });
        });
    });
}
