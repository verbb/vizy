/**
 * One shared `pk-tooltip` for a toolbar surface (main toolbar or bubble).
 *
 * Mirrors the Editor Config builder: a single manually driven hint rather than
 * one tooltip per button. Native `title` is deliberately unused — it would paint
 * a second, browser-styled tip on top of this one.
 *
 * The tooltip mounts inside the host's shadow root so `for` resolves button ids
 * via that root (`resolveElementById`), which document-level lookup cannot see.
 */
export type ToolbarTooltip = HTMLElement & {
    for: string;
    content: string;
    show: () => void;
    hide: () => void;
};

const TOOLTIP_DELAY_MS = 200;

let tooltipSeq = 0;

function callTooltip(tooltip: ToolbarTooltip, method: 'show' | 'hide'): void {
    // Happy-dom / unit mounts create a plain element when the custom element
    // is not registered; production always upgrades to pk-tooltip.
    if (typeof tooltip[method] === 'function') tooltip[method]();
}

export function attachToolbarTooltip(host: HTMLElement): () => void {
    const root = host.shadowRoot;
    if (!root) return () => {};

    const tooltip = document.createElement('pk-tooltip') as ToolbarTooltip;
    tooltip.setAttribute('trigger', 'manual');
    tooltip.setAttribute('placement', 'top');
    root.append(tooltip);

    let timer: number | null = null;

    const clearTimer = (): void => {
        if (timer === null) return;
        window.clearTimeout(timer);
        timer = null;
    };

    const controlFrom = (target: EventTarget | null): HTMLElement | null => {
        if (!(target instanceof Element)) return null;
        return target.closest('.vizy-control');
    };

    const onPointerOver = (event: PointerEvent): void => {
        const control = controlFrom(event.target);
        if (!control) return;
        const label = control.getAttribute('aria-label')?.trim();
        if (!label) return;

        clearTimer();
        timer = window.setTimeout(() => {
            timer = null;
            if (!control.isConnected) return;
            if (!control.id) control.id = `vizy-tb-${++tooltipSeq}`;
            tooltip.for = control.id;
            tooltip.content = label;
            callTooltip(tooltip, 'show');
        }, TOOLTIP_DELAY_MS);
    };

    const onPointerOut = (event: PointerEvent): void => {
        const leaving = controlFrom(event.target);
        if (!leaving) return;
        // Moving between controls: the next pointerover reschedules.
        if (controlFrom(event.relatedTarget)) return;
        clearTimer();
        callTooltip(tooltip, 'hide');
    };

    // Hide on press so a tip never hangs over an open menu or mid-click — same
    // rule as the Editor Config builder (native `title` was dropped for this).
    const onPointerDown = (): void => {
        clearTimer();
        callTooltip(tooltip, 'hide');
    };

    root.addEventListener('pointerover', onPointerOver as EventListener);
    root.addEventListener('pointerout', onPointerOut as EventListener);
    root.addEventListener('pointerdown', onPointerDown);

    return () => {
        clearTimer();
        root.removeEventListener('pointerover', onPointerOver as EventListener);
        root.removeEventListener('pointerout', onPointerOut as EventListener);
        root.removeEventListener('pointerdown', onPointerDown);
        callTooltip(tooltip, 'hide');
        tooltip.remove();
    };
}
