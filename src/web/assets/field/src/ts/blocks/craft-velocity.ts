/**
 * Thin access to Craft CP's jQuery Velocity (same stack Matrix uses).
 * VizyAsset depends on CpAsset → Garnish → VelocityAsset, so this is present
 * on entry edit screens. No bundled Velocity dependency.
 */

export type VelocityProperties = Record<string, string | number>;

export type VelocityRunOptions = {
    duration?: string | number;
    display?: string;
    complete?: () => void;
};

type VelocityCallable = {
    velocity: {
        (properties: VelocityProperties | string, options?: VelocityRunOptions | string | number): unknown;
        (properties: VelocityProperties | string, duration: string | number, complete?: () => void): unknown;
    };
};

type JqueryFactory = (value: HTMLElement | string) => VelocityCallable & Record<string, unknown>;

function jquery(): JqueryFactory | null {
    const factory = window.$ as unknown as JqueryFactory | undefined;
    return typeof factory === 'function' ? factory : null;
}

/** True when CP jQuery + Velocity plugin are on the page. */
export function craftVelocityAvailable(): boolean {
    const $ = jquery();
    if (!$) return false;
    try {
        const probe = document.createElement('div');
        return typeof $(probe).velocity === 'function';
    } catch {
        return false;
    }
}

export function velocityStop(el: HTMLElement): void {
    const $ = jquery();
    if (!$ || !craftVelocityAvailable()) return;
    try {
        $(el).velocity('stop');
    } catch {
        // Element may already be detached.
    }
}

/**
 * Run a Velocity property animation; resolves on complete (or immediately if
 * Velocity is missing).
 */
export function velocityAnimate(
    el: HTMLElement,
    properties: VelocityProperties | 'fadeOut' | 'fadeIn',
    options: VelocityRunOptions = {},
): Promise<void> {
    const $ = jquery();
    if (!$ || !craftVelocityAvailable()) {
        options.complete?.();
        return Promise.resolve();
    }

    return new Promise((resolve) => {
        const opts: VelocityRunOptions = {
            ...options,
            complete: () => {
                options.complete?.();
                resolve();
            },
        };
        try {
            $(el).velocity(properties, opts);
        } catch {
            opts.complete?.();
        }
    });
}

/** Matrix uses Velocity's `"fast"` duration token for entry collapse/expand. */
export const MATRIX_VELOCITY_DURATION = 'fast' as const;
