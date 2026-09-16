/**
 * Craft FieldLayout Tip/Warning dismissibles inside Vizy Block hosts.
 *
 * ElementEditor.handleDismissibleTips() binds `.tip-dismiss-btn` when the entry
 * form boots. Vizy mounts FieldLayout HTML later, so those buttons never get
 * listeners. Tip.php also embeds a localStorage hide-script that does not run
 * via `innerHTML`. Mirror Craft's hideTip + dismissedTips storage here.
 */

const DISMISSED_TIPS_KEY = 'dismissedTips';
const TIP_UID_ATTR = 'data-vizy-tip-uid';

function getDismissedTipUids(): string[] {
    const craft = window.Craft as
        | { getLocalStorage?: (key: string, fallback?: unknown) => unknown }
        | undefined;
    if (typeof craft?.getLocalStorage === 'function') {
        const stored = craft.getLocalStorage(DISMISSED_TIPS_KEY, []);
        return Array.isArray(stored) ? stored.filter((uid): uid is string => typeof uid === 'string') : [];
    }
    // Fallback matches Craft.getLocalStorage prefix when Craft is mid-boot.
    try {
        const systemUid = (window.Craft as { systemUid?: string } | undefined)?.systemUid ?? '';
        const raw = localStorage.getItem(`Craft-${systemUid}.${DISMISSED_TIPS_KEY}`);
        if (!raw) return [];
        const parsed = JSON.parse(raw) as unknown;
        return Array.isArray(parsed) ? parsed.filter((uid): uid is string => typeof uid === 'string') : [];
    } catch {
        return [];
    }
}

function rememberDismissedTipUid(uid: string): void {
    const craft = window.Craft as
        | {
            getLocalStorage?: (key: string, fallback?: unknown) => unknown;
            setLocalStorage?: (key: string, value: unknown) => void;
        }
        | undefined;
    const existing = getDismissedTipUids();
    if (existing.includes(uid)) return;
    const next = [...existing, uid];
    if (typeof craft?.setLocalStorage === 'function') {
        craft.setLocalStorage(DISMISSED_TIPS_KEY, next);
        return;
    }
    try {
        const systemUid = (window.Craft as { systemUid?: string } | undefined)?.systemUid ?? '';
        localStorage.setItem(`Craft-${systemUid}.${DISMISSED_TIPS_KEY}`, JSON.stringify(next));
    } catch {
        // Quota / private mode — dismiss still removes the pane for this mount.
    }
}

/**
 * Tip UID for persistence. Conditional layout elements put the UID on
 * `data-layout-element`; non-conditional Craft renders `true` there, but Tip.php
 * still embeds the real UID in its hide script.
 */
function tipUidFromContainer(container: Element): string | null {
    const stamped = container.getAttribute(TIP_UID_ATTR);
    if (stamped) return stamped;
    const attr = container.getAttribute('data-layout-element');
    if (attr && attr !== 'true' && attr !== '1') return attr;
    for (const script of container.querySelectorAll('script')) {
        const match = script.textContent?.match(/\.includes\('([^']+)'\)/);
        if (match?.[1]) return match[1];
    }
    return null;
}

function isDismissibleTipContainer(container: Element): boolean {
    return Boolean(container.querySelector('.pane.dismissible'));
}

function stampAndPruneTips(root: HTMLElement): void {
    const dismissed = new Set(getDismissedTipUids());
    for (const container of [...root.querySelectorAll('[data-layout-element]')]) {
        if (!isDismissibleTipContainer(container)) continue;
        const uid = tipUidFromContainer(container);
        if (uid) container.setAttribute(TIP_UID_ATTR, uid);
        // Tip.php scripts are dead after innerHTML — drop after reading the UID.
        for (const script of [...container.querySelectorAll('script')]) {
            if (script.textContent?.includes('dismissedTips')) script.remove();
        }
        if (uid && dismissed.has(uid)) {
            container.remove();
        }
    }
}

/**
 * Apply dismissed-tip hiding and click-to-dismiss for one FieldLayout host.
 * Returns a disposer for the delegated click listener.
 */
export function wireDismissibleTips(root: HTMLElement): () => void {
    stampAndPruneTips(root);

    const onClick = (event: Event): void => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const button = target.closest('.tip-dismiss-btn');
        if (!button || !root.contains(button)) return;

        // Craft ElementEditor may also bind later — own the dismiss inside Vizy.
        event.preventDefault();
        event.stopPropagation();

        const container = button.closest('[data-layout-element]');
        if (!container || !root.contains(container) || !isDismissibleTipContainer(container)) {
            return;
        }

        const uid = tipUidFromContainer(container);
        container.remove();
        if (uid) rememberDismissedTipUid(uid);
    };

    root.addEventListener('click', onClick);
    return () => root.removeEventListener('click', onClick);
}
