import { Extension } from '@tiptap/core';
import type { Fragment } from '@tiptap/pm/model';
import { Plugin } from '@tiptap/pm/state';
import type { EditorManifest } from './types';
import { isUuid } from './semantic/attrs';
import { OPAQUE_CLIPBOARD_MIME } from './transport/opaque';

type ListKind = 'ol' | 'ul';

interface OfficeListItem {
    contents: Node[];
    kind: ListKind;
    level: number;
    listId: string | null;
    start: number | null;
}

interface ListStackEntry {
    kind: ListKind;
    list: HTMLOListElement | HTMLUListElement;
    listId: string | null;
    lastItem: HTMLLIElement | null;
}

const discardedElements = new Set(['link', 'meta', 'noscript', 'script', 'style']);

function removeComments(parent: Node): void {
    for (const child of [...parent.childNodes]) {
        if (child.nodeType === Node.COMMENT_NODE) {
            child.remove();
            continue;
        }
        removeComments(child);
    }
}

function unwrap(element: Element): void {
    element.replaceWith(...element.childNodes);
}

function officeElementKind(element: Element): string | undefined {
    return /(?:^|;)\s*mso-element\s*:\s*([\w-]+)/i.exec(element.getAttribute('style') ?? '')?.[1].toLowerCase();
}

function normalizeOfficeReviewMarkup(root: DocumentFragment): void {
    // Word's HTML includes deleted revisions and comment bodies alongside final
    // author content. Never publish those review artifacts as ordinary text.
    for (const element of [...root.querySelectorAll('*')]) {
        const classes = [...element.classList].map((name) => name.toLowerCase());
        if (classes.some((name) => ['msodel', 'msocommentreference', 'msocomanchor', 'msocomtxt'].includes(name))
            || ['comment', 'comment-list'].includes(officeElementKind(element) ?? '')
            || /(?:^|;)\s*mso-table-deleted\s*:/i.test(element.getAttribute('style') ?? '')) {
            element.remove();
        } else if (classes.includes('msoins')) {
            for (const insertion of element.querySelectorAll('ins')) unwrap(insertion);
            unwrap(element);
        }
    }
}

function normalizeOfficeFootnotes(root: DocumentFragment, enabled: boolean): void {
    const definitions = [...root.querySelectorAll('[style]')]
        .filter((element) => ['footnote', 'endnote'].includes(officeElementKind(element) ?? ''));
    const list = document.createElement('section');
    list.dataset.type = 'footnoteList';
    const anchors = [...root.querySelectorAll('a[name][href]')];

    // Word groups footnote definitions before endnotes regardless of where their
    // references occur. Vizy uses one numbered list, so follow reference order.
    const referenceIndex = (definition: Element) => anchors.findIndex((anchor) =>
        /^_(?:ftn|edn)ref\d+$/i.test(anchor.getAttribute('name') ?? '')
        && anchor.getAttribute('href') === `#_${definition.id}`);
    definitions.sort((a, b) => referenceIndex(a) - referenceIndex(b));

    for (const definition of enabled ? definitions : []) {
        const references = anchors.filter((anchor) => /^_(?:ftn|edn)ref\d+$/i.test(anchor.getAttribute('name') ?? '')
            && anchor.getAttribute('href') === `#_${definition.id}`);
        if (!references.length) continue;
        const uid = crypto.randomUUID();
        const item = document.createElement('li');
        item.dataset.type = 'footnoteItem';
        item.dataset.footnoteUid = uid;
        for (const backlink of definition.querySelectorAll('a[name]')) {
            if (backlink.getAttribute('name') === `_${definition.id}`) backlink.remove();
        }
        item.append(...definition.childNodes);
        list.append(item);
        definition.remove();
        for (const reference of references) {
            const sup = document.createElement('sup');
            sup.dataset.type = 'footnoteReference';
            sup.dataset.footnoteUid = uid;
            sup.dataset.footnoteText = readableCellText(item);
            reference.replaceWith(sup);
        }
    }

    // Source fragment IDs are not retained by the editor. Keep readable labels
    // for disabled or unpaired notes without leaving links to missing targets.
    for (const anchor of anchors) {
        if (/^_(?:ftn|edn)(?:ref)?\d+$/i.test(anchor.getAttribute('name') ?? '') && root.contains(anchor)) {
            unwrap(anchor);
        }
    }
    if (!list.childElementCount) return;
    for (const wrapper of [...root.querySelectorAll('[style]')]) {
        if (['footnote-list', 'endnote-list'].includes(officeElementKind(wrapper) ?? '') && !wrapper.textContent?.trim()) {
            wrapper.remove();
        }
    }
    root.append(list);
}

function removeSourceScaffolding(root: DocumentFragment): void {
    removeComments(root);

    for (const element of [...root.querySelectorAll('*')]) {
        const tag = element.tagName.toLowerCase();
        if (discardedElements.has(tag)) {
            element.remove();
            continue;
        }

        // Office namespace elements describe its source document rather than
        // author content. Keep any meaningful descendants, but not the wrapper.
        if (tag.includes(':')) {
            if (!(element.textContent ?? '').replace(/[\s\u00a0]+/g, '')) element.remove();
            else unwrap(element);
            continue;
        }

        for (const attribute of [...element.attributes]) {
            if (attribute.name.toLowerCase().startsWith('on')) {
                element.removeAttribute(attribute.name);
            }
        }

        if (element.id.startsWith('docs-internal-guid-')) {
            element.removeAttribute('id');
        }
        if (tag === 'a' && ((!element.hasAttribute('href') && /^_/.test(element.getAttribute('name') ?? ''))
            || /^#_Ref\d+$/i.test(element.getAttribute('href') ?? ''))) {
            unwrap(element);
        }
    }
}

function normalizeAriaHeadings(root: DocumentFragment): void {
    for (const element of [...root.querySelectorAll('[role="heading"][aria-level]')]) {
        const level = Number(element.getAttribute('aria-level'));
        if (!Number.isInteger(level) || level < 1 || level > 6) continue;
        const heading = document.createElement(`h${level}`);
        heading.append(...element.childNodes);
        element.replaceWith(heading);
    }
}

function officeListDetails(paragraph: HTMLParagraphElement): Omit<OfficeListItem, 'contents'> | null {
    const style = paragraph.getAttribute('style') ?? '';
    if (!/\bmso-list\s*:/i.test(style) && !/\bMsoListParagraph\b/i.test(paragraph.className)) {
        return null;
    }

    const definition = /\bmso-list\s*:\s*([^\s;]+)[^;]*?\blevel(\d+)/i.exec(style);
    const marker = [...paragraph.querySelectorAll<HTMLElement>('span')]
        .find((span) => /\bmso-list\s*:\s*Ignore\b/i.test(span.getAttribute('style') ?? ''));
    const markerText = (marker?.textContent ?? '').replace(/\u00a0/g, ' ').trim();
    const ordered = /^(?:\(?\d+|\(?[A-Za-z]+)[.)]/.test(markerText);
    const numeric = /^\(?(\d+)[.)]/.exec(markerText);

    return {
        kind: ordered ? 'ol' : 'ul',
        level: Math.max(1, Number(definition?.[2] ?? 1)),
        listId: definition?.[1] ?? null,
        start: numeric ? Number(numeric[1]) : null,
    };
}

function officeListItem(paragraph: HTMLParagraphElement): OfficeListItem | null {
    const details = officeListDetails(paragraph);
    if (!details) return null;

    const clone = paragraph.cloneNode(true) as HTMLParagraphElement;
    for (const span of [...clone.querySelectorAll<HTMLElement>('span')]) {
        if (/\bmso-list\s*:\s*Ignore\b/i.test(span.getAttribute('style') ?? '')) {
            span.remove();
        }
    }

    // Word leaves spacing around the marker outside its ignored span. Removing
    // that indentation keeps the list item from acquiring visible leading tabs.
    const first = clone.firstChild;
    if (first?.nodeType === Node.TEXT_NODE) {
        first.textContent = (first.textContent ?? '').replace(/^[\s\u00a0]+/, '');
        if (!first.textContent) first.remove();
    }

    return {
        ...details,
        contents: [...clone.childNodes],
    };
}

function createList(item: OfficeListItem): ListStackEntry {
    const list = document.createElement(item.kind);
    if (item.kind === 'ol' && item.start !== null && item.start > 1) {
        list.setAttribute('start', String(item.start));
    }
    return { kind: item.kind, list, listId: item.listId, lastItem: null };
}

function buildOfficeLists(items: OfficeListItem[]): DocumentFragment {
    const output = document.createDocumentFragment();
    const stack: ListStackEntry[] = [];

    for (const item of items) {
        // A source can jump from level 1 to level 4 without carrying the missing
        // ancestors. Clamp that to one deeper level so the result stays valid.
        let depth = Math.min(item.level, stack.length + 1);
        if (depth > 1 && !stack[depth - 2]?.lastItem) depth = 1;
        stack.length = Math.min(stack.length, depth);

        const parent = depth === 1 ? output : stack[depth - 2].lastItem!;
        const current = stack[depth - 1];
        if (!current || current.kind !== item.kind || current.listId !== item.listId) {
            const next = createList(item);
            parent.append(next.list);
            stack.length = depth - 1;
            stack.push(next);
        }

        const list = stack[depth - 1];
        const listItem = document.createElement('li');
        listItem.append(...item.contents);
        list.list.append(listItem);
        list.lastItem = listItem;
    }

    return output;
}

function normalizeOfficeLists(root: DocumentFragment): void {
    const candidates = [...root.querySelectorAll<HTMLParagraphElement>('p')];
    for (const first of candidates) {
        if (!first.parentNode || !officeListDetails(first)) continue;
        const previous = first.previousElementSibling;
        if (previous instanceof HTMLParagraphElement && officeListDetails(previous)) continue;

        const paragraphs: HTMLParagraphElement[] = [];
        let cursor: Element | null = first;
        while (cursor instanceof HTMLParagraphElement && officeListDetails(cursor)) {
            paragraphs.push(cursor);
            cursor = cursor.nextElementSibling;
        }
        const items = paragraphs
            .map(officeListItem)
            .filter((item): item is OfficeListItem => item !== null);
        if (!items.length) continue;

        const after = paragraphs.at(-1)?.nextSibling ?? null;
        first.before(buildOfficeLists(items));
        // Remove the original paragraphs and their formatting whitespace as one
        // range. Leaving those text nodes between generated lists can make the
        // clipboard parser synthesize empty paragraphs.
        let node: ChildNode | null = first;
        while (node && node !== after) {
            const nextSibling: ChildNode | null = node.nextSibling;
            node.remove();
            node = nextSibling;
        }
    }
}

function readableCellText(cell: Element): string {
    const copy = cell.cloneNode(true) as Element;
    // Docs emits adjacent blocks without whitespace between their tags. Keep
    // those boundaries while leaving inline spans within a word untouched.
    for (const element of copy.querySelectorAll('br, p, div, li, ul, ol, blockquote, h1, h2, h3, h4, h5, h6, pre')) {
        element.before(' ');
        element.after(' ');
    }
    return (copy.textContent ?? '')
        .replace(/\u00a0/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function hasExternalImages(clipboard: DataTransfer | null): boolean {
    if (!clipboard || clipboard.getData(OPAQUE_CLIPBOARD_MIME)) return false;
    const template = document.createElement('template');
    const html = clipboard.getData('text/html');
    template.innerHTML = html;
    const images = [...template.content.querySelectorAll('img')];
    if (images.length) {
        return images.some((image) => !isUuid(image.getAttribute('data-asset-uid') ?? ''));
    }
    // Word also supplies a bitmap of the whole selection. It is an alternative
    // representation, not an omitted image in otherwise image-free HTML.
    const wordDocument = [...template.content.querySelectorAll('meta')].some((meta) =>
        meta.name.toLowerCase() === 'progid' && meta.content.toLowerCase() === 'word.document');
    if (wordDocument && !/<(?:img|v:imagedata)\b/i.test(html)) return false;
    return [...clipboard.files].some((file) => file.type.startsWith('image/'));
}

function googleDocsPasteWarnings(clipboard: DataTransfer | null): string[] {
    const raw = clipboard?.getData('application/x-vnd.google-docs-document-slice-clip+wrapped');
    if (!raw || raw.length > 2_000_000) return [];
    try {
        // Docs omits footnotes and revision semantics from its HTML/plain text.
        // Its private metadata is only a loss signal, never an import format.
        const wrapped: unknown = JSON.parse(raw);
        if (!isRecord(wrapped) || typeof wrapped.data !== 'string') return [];
        const data: unknown = JSON.parse(wrapped.data);
        if (!isRecord(data) || !isRecord(data.resolved)) return [];
        const resolved = data.resolved;
        const warnings: string[] = [];
        const hasSuggestions = ['dsl_suggestedinsertions', 'dsl_suggesteddeletions'].some((key) => {
            const suggestions = resolved[key];
            const ranges = isRecord(suggestions) ? suggestions.sgsl_sugg : null;
            return Array.isArray(ranges) && ranges.some((range) => Array.isArray(range) && range.length > 0);
        });
        if (hasSuggestions) warnings.push('googleDocsSuggestions');
        const styles = resolved.dsl_styleslices;
        if (Array.isArray(styles) && styles.some((style) => isRecord(style) && style.stsl_type === 'footnote'
            && ((isRecord(style.stsl_trailing) && typeof style.stsl_trailing.fs_id === 'string')
                || (Array.isArray(style.stsl_styles) && style.stsl_styles.some((value: unknown) => isRecord(value) && typeof value.fs_id === 'string'))))) {
            warnings.push('googleDocsFootnotes');
        }
        return warnings;
    } catch {
        return [];
    }
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function flattenUnsupportedTables(root: DocumentFragment): void {
    // Innermost tables first, so a nested table becomes readable text before its
    // containing cell is projected into the outer row.
    const tables = [...root.querySelectorAll('table')].reverse();
    for (const table of tables) {
        const replacement = document.createDocumentFragment();
        const rows = [...table.querySelectorAll('tr')]
            .filter((row) => row.closest('table') === table);
        for (const row of rows) {
            const cells = [...row.children]
                .filter((cell) => ['TD', 'TH'].includes(cell.tagName))
                .map(readableCellText)
                .filter(Boolean);
            if (!cells.length) continue;
            const paragraph = document.createElement('p');
            paragraph.textContent = cells.join(' — ');
            replacement.append(paragraph);
        }
        table.replaceWith(replacement);
    }
}

/**
 * Repairs source-specific HTML before TipTap's schema parses it. The schema is
 * deliberately still the only allowlist: this function improves structure but
 * never decides that an otherwise-disabled Vizy capability may be inserted.
 */
export function normalizePastedHtml(html: string, manifest: Pick<EditorManifest, 'enabledNodes'>): string {
    const template = document.createElement('template');
    // Word exports an invisible grid-sizing row outside its visible table rows.
    // Its conditional wrapper is lost during HTML parsing, making the row visible.
    template.innerHTML = html.replace(/<!\[if !supportMisalignedColumns\]>[\s\S]*?<!\[endif\]>/gi, '');

    normalizeOfficeReviewMarkup(template.content);
    removeSourceScaffolding(template.content);
    normalizeAriaHeadings(template.content);
    normalizeOfficeLists(template.content);
    normalizeOfficeFootnotes(template.content, manifest.enabledNodes.includes('footnoteReference'));
    if (!manifest.enabledNodes.includes('table')) {
        flattenUnsupportedTables(template.content);
    }

    return template.innerHTML;
}

function hasMeaningfulContent(fragment: Fragment): boolean {
    let meaningful = false;
    fragment.forEach((node) => {
        if (meaningful) return;
        if (node.isText) {
            meaningful = Boolean(node.text?.trim());
        } else if (node.isLeaf) {
            meaningful = true;
        } else {
            meaningful = hasMeaningfulContent(node.content);
        }
    });
    return meaningful;
}

export function createPasteNormalizer(manifest: EditorManifest): Extension {
    return Extension.create({
        name: 'vizyPasteNormalizer',
        // Run before ordinary project extensions. A project that genuinely needs
        // the untouched source can register a higher-priority transform.
        priority: 200,

        transformPastedHTML(html) {
            try {
                return normalizePastedHtml(html, manifest);
            } catch {
                // Pasting readable source is more important than a cleanup pass.
                // TipTap's schema will still reject unsupported nodes/attributes.
                return html;
            }
        },

        addProseMirrorPlugins() {
            return [new Plugin({
                props: {
                    handlePaste(view, event, slice) {
                        const clipboard = event.clipboardData;
                        const privateSlice = clipboard?.getData(OPAQUE_CLIPBOARD_MIME);
                        const html = clipboard?.getData('text/html') ?? '';
                        if (manifest.field.pasteAsPlainText && !privateSlice && html) {
                            const template = document.createElement('template');
                            template.innerHTML = html;
                            const hasRevisions = [...template.content.querySelectorAll('[class], [style]')].some((element) =>
                                [...element.classList].some((name) => ['msodel', 'msoins', 'msomovefrom', 'msomoveto'].includes(name.toLowerCase()))
                                || /(?:^|;)\s*mso-table-(?:deleted|inserted)\s*:/i.test(element.getAttribute('style') ?? ''));
                            // Word's plain text may contain both deleted and inserted
                            // revisions. Do not publish ambiguous review text or replace
                            // it with lossy HTML (which can omit equations entirely).
                            if (hasRevisions) {
                                event.preventDefault();
                                view.dom.dispatchEvent(new CustomEvent('vizy-clipboard-rejected', {
                                    bubbles: true,
                                    detail: { code: 'wordRevisionsPlainText', operation: 'paste' },
                                }));
                                return true;
                            }
                        }
                        const warnings = privateSlice
                            ? [] : googleDocsPasteWarnings(event.clipboardData);
                        if (!privateSlice && !manifest.field.pasteAsPlainText
                            && /(?:<!--\[if[^\]]*\bmsEquation\b|<m:oMath(?:Para)?[\s>])/i.test(html)) {
                            warnings.push('wordEquations');
                        }
                        if (!privateSlice && (/<!--\[if\s+supportFields\]>[\s\S]*?\b(?:REF|PAGEREF|NOTEREF)\s+[^<\s]+[\s\S]*?<!\[endif\]-->/i.test(html)
                            || /href\s*=\s*["']?#_Ref\d+/i.test(html))) {
                            warnings.push('wordCrossReferences');
                        }
                        if (!manifest.field.pasteAsPlainText && hasExternalImages(event.clipboardData)) {
                            warnings.push('externalImagesOmitted');
                        }
                        if (warnings.length) {
                            view.dom.dispatchEvent(new CustomEvent('vizy-clipboard-warning', {
                                bubbles: true,
                                detail: { codes: warnings },
                            }));
                        }
                        if (hasMeaningfulContent(slice.content)) return false;
                        const text = event.clipboardData?.getData('text/plain') ?? '';
                        if (!text.trim()) return false;

                        // An HTML-bearing clipboard can still parse to nothing (for
                        // example, an unsupported leaf). Retry through ProseMirror's
                        // own plain-text path so Paste never appears to be broken.
                        event.preventDefault();
                        view.pasteText(text, event);
                        return true;
                    },
                },
            })];
        },
    });
}
