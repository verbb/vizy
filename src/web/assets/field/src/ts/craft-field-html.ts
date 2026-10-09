/**
 * Apply Craft field-instance HTML (head/body fragments from createForm) without
 * Craft.appendBodyHtml's global async queue.
 *
 * Selectize (and similar) end their scripts with onChange() reading
 * $select.data('selectize').$wrapper. Craft queues appendBodyHtml behind every
 * other CP fragment; by the time those scripts run, the Vizy host may be
 * disconnected or replaced — `$('#id')` is empty, selectize never attaches, and
 * onChange throws. Running inline scripts synchronously while the host is
 * connected matches Matrix's "HTML already in the document" assumption.
 */

const seenStylesheets = new Set<string>();
const seenExternalScripts = new Set<string>();
const pendingExternalScripts = new Map<string, Promise<void>>();
let externalScriptQueue = Promise.resolve();

function normalizeAssetUrl(url: string): string {
    return url.replace(/&/g, '&amp;');
}

function existingStylesheetHrefs(): Set<string> {
    if (seenStylesheets.size) return seenStylesheets;
    for (const link of document.querySelectorAll<HTMLLinkElement>('link[href]')) {
        seenStylesheets.add(normalizeAssetUrl(link.href));
    }
    return seenStylesheets;
}

function existingScriptSrcs(): Set<string> {
    if (seenExternalScripts.size) return seenExternalScripts;
    for (const script of document.querySelectorAll<HTMLScriptElement>('script[src]')) {
        seenExternalScripts.add(normalizeAssetUrl(script.src));
    }
    return seenExternalScripts;
}

/**
 * Parse a Craft HTML fragment into DOM nodes, preserving <script> tags.
 * Prefer jQuery.parseHTML (Craft's path) when available.
 */
function parseCraftFragment(html: string): Node[] {
    const trimmed = html.trim();
    if (!trimmed) return [];
    const jq = (window as Window & {
        jQuery?: { parseHTML: (html: string, context?: Document, keepScripts?: boolean) => Node[] | null };
    }).jQuery;
    if (typeof jq?.parseHTML === 'function') {
        return jq.parseHTML(trimmed, document, true) ?? [];
    }
    // Fallback: <template> parses scripts without executing them.
    const template = document.createElement('template');
    template.innerHTML = trimmed;
    return [...template.content.childNodes];
}

function appendStylesheet(link: HTMLLinkElement): void {
    const href = link.href;
    if (!href) return;
    const key = normalizeAssetUrl(href);
    const seen = existingStylesheetHrefs();
    if (seen.has(key)) return;
    seen.add(key);
    document.head.appendChild(link);
}

/** Load shared dependencies in response order before mounting instance scripts. */
export function prepareCraftFieldAssets(...fragments: string[]): Promise<void> | null {
    const pending: Promise<void>[] = [];
    for (const fragment of fragments) {
        for (const source of parseCraftFragment(fragment)) {
            if (!(source instanceof HTMLScriptElement) || !source.src) continue;
            const key = normalizeAssetUrl(source.src);
            const existing = pendingExternalScripts.get(key);
            if (existing) {
                pending.push(existing);
                continue;
            }
            if (existingScriptSrcs().has(key)) continue;
            const loading = Promise.all([externalScriptQueue, ...pending]).then(() => new Promise<void>((resolve, reject) => {
                const script = document.createElement('script');
                for (const attr of Array.from(source.attributes)) script.setAttribute(attr.name, attr.value);
                script.async = false;
                script.onload = () => {
                    seenExternalScripts.add(key);
                    resolve();
                };
                script.onerror = () => {
                    script.remove();
                    reject(new Error(`fieldAssetLoadFailed: ${source.src}`));
                };
                document.head.appendChild(script);
            })).finally(() => pendingExternalScripts.delete(key));
            pendingExternalScripts.set(key, loading);
            externalScriptQueue = loading.catch(() => {});
            pending.push(loading);
        }
    }
    return pending.length ? Promise.all(pending).then(() => {}) : null;
}

/**
 * Execute one inline or external script the way Craft._appendHtml does: a fresh
 * <script> element so the browser actually runs it.
 */
function runScript(source: HTMLScriptElement, parent: ParentNode): void {
    const src = source.getAttribute('src');
    if (src) {
        const absolute = source.src || src;
        const key = normalizeAssetUrl(absolute);
        const seen = existingScriptSrcs();
        if (seen.has(key)) return;
        seen.add(key);
        const script = document.createElement('script');
        for (const attr of Array.from(source.attributes)) {
            script.setAttribute(attr.name, attr.value);
        }
        parent.appendChild(script);
        return;
    }
    const script = document.createElement('script');
    for (const attr of Array.from(source.attributes)) {
        script.setAttribute(attr.name, attr.value);
    }
    script.textContent = source.textContent;
    parent.appendChild(script);
}

/**
 * Apply headHtml / bodyHtml from a FieldLayout render immediately.
 * Inline scripts run synchronously on append — callers must ensure any
 * `#id` targets those scripts look up are already in the document.
 */
export function applyCraftFieldHtml(html: string, bodyParent: ParentNode = document.body): void {
    if (!html?.trim()) return;
    const nodes = parseCraftFragment(html);
    for (const node of nodes) {
        if (!(node instanceof Element)) {
            bodyParent.appendChild(node);
            continue;
        }
        if (node.nodeName === 'LINK' && (node as HTMLLinkElement).rel === 'stylesheet') {
            appendStylesheet(node as HTMLLinkElement);
            continue;
        }
        if (node.nodeName === 'SCRIPT') {
            runScript(node as HTMLScriptElement, bodyParent);
            continue;
        }
        if (node.nodeName === 'STYLE' || node.nodeName === 'LINK') {
            document.head.appendChild(node);
            continue;
        }
        bodyParent.appendChild(node);
    }
}
