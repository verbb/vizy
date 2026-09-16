/**
 * Grip mousedown arms a Block host for HTML5 drag, then selects it. Selecting
 * triggers NodeView.selectNode → #resetHandleDraggable, which must not clear
 * `draggable` mid-gesture. A WeakSet (not a DOM attribute) survives Lit updates
 * that can drop transient data-* markers before the microtask reset runs.
 */
const armedHosts = new WeakSet<HTMLElement>();

export function armBlockDragHost(host: HTMLElement): void {
    armedHosts.add(host);
    host.draggable = true;
}

export function disarmBlockDragHost(host: HTMLElement): void {
    armedHosts.delete(host);
    host.draggable = false;
    host.removeAttribute('draggable');
}

export function isBlockDragHostArmed(host: HTMLElement): boolean {
    return armedHosts.has(host);
}
