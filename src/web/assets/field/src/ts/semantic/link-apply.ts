import { getMarkRange, type Editor } from '@tiptap/core';
import {
    defaultLinkAttrs,
    normalizeSemanticLinkAttrs,
    linkDisplayHref,
    urlLinkAttrs,
    type SemanticLinkAttrs,
} from './attrs';

export type LinkDialogSeed = {
    url: string;
    text: string;
    openInNewTab: boolean;
    from?: number;
    to?: number;
    /** When set, submit applies this semantic target instead of a plain URL mark. */
    semantic?: SemanticLinkAttrs;
};

function selectedText(editor: Editor): string {
    const { from, to } = editor.state.selection;
    return editor.state.doc.textBetween(from, to, ' ');
}

/** Read the current selection / active link into dialog seed fields. */
export function getSemanticLinkEditState(editor: Editor): LinkDialogSeed {
    const attrs = normalizeActiveLinkAttrs(editor);
    const { state } = editor;
    const linkType = state.schema.marks.link;
    const range = linkType ? getMarkRange(state.selection.$from, linkType) : null;
    const from = range?.from ?? state.selection.from;
    const to = range?.to ?? state.selection.to;
    const text = editor.state.doc.textBetween(from, to, ' ');

    return {
        from,
        to,
        text,
        openInNewTab: attrs.newWindow,
        // Keep metadata until the author explicitly changes the destination.
        url: linkDisplayHref(attrs),
        semantic: attrs,
    };
}

export function seedInsertLinkDialog(editor: Editor): LinkDialogSeed {
    const { from, to } = editor.state.selection;
    return {
        url: '',
        text: selectedText(editor),
        openInNewTab: false,
        from: from !== to ? from : undefined,
        to: from !== to ? to : undefined,
    };
}

/**
 * Apply a semantic link mark — mirrors Plugin Kit `applyLinkToEditor` but
 * writes semantic attrs instead of TipTap `href` / `target`.
 */
export function applySemanticLinkToEditor(
    editor: Editor,
    params: {
        attrs: SemanticLinkAttrs;
        text: string;
        from?: number;
        to?: number;
        focus?: boolean;
    },
): void {
    const focus = params.focus ?? true;
    const chain = () => (focus ? editor.chain().focus() : editor.chain());
    const savedRange = typeof params.from === 'number' && typeof params.to === 'number';
    const from = savedRange ? params.from! : editor.state.selection.from;
    const to = savedRange ? params.to! : editor.state.selection.to;
    const existingText = editor.state.doc.textBetween(from, to, ' ');
    const text = from !== to && params.text === existingText
        ? params.text
        : (params.text.trim() || fallbackLinkText(params.attrs));
    const mark = { type: 'link', attrs: params.attrs };

    if (from !== to) {
        // Applying a link must not flatten marks, hard breaks, or paragraph boundaries.
        if (text === existingText) {
            chain().setTextSelection({ from, to }).setSemanticLink(params.attrs).run();
        } else {
            chain().insertContentAt({ from, to }, [{ type: 'text', text, marks: [mark] }]).run();
        }
        return;
    }

    chain().setTextSelection(from).insertContent([{
        type: 'text',
        text,
        marks: [mark],
    }]).run();
}

export function unsetSemanticLinkFromEditor(editor: Editor, options?: { focus?: boolean }): void {
    const focus = options?.focus ?? true;
    const chain = focus ? editor.chain().focus() : editor.chain();
    chain.extendMarkRange('link').unsetSemanticLink().run();
}

/** Build attrs from dialog URL submit (plain URL / mailto / tel). */
export function attrsFromUrlDialog(url: string, openInNewTab: boolean): SemanticLinkAttrs {
    const trimmed = url.trim();
    if (trimmed.toLowerCase().startsWith('mailto:')) {
        return defaultLinkAttrs({
            type: 'email',
            value: trimmed.slice('mailto:'.length),
            newWindow: openInNewTab,
        });
    }
    if (trimmed.toLowerCase().startsWith('tel:')) {
        return defaultLinkAttrs({
            type: 'tel',
            value: trimmed.slice('tel:'.length),
            newWindow: openInNewTab,
        });
    }
    if (trimmed.toLowerCase().startsWith('sms:')) {
        return defaultLinkAttrs({
            type: 'sms',
            value: trimmed.slice('sms:'.length),
            newWindow: openInNewTab,
        });
    }
    return urlLinkAttrs(trimmed, openInNewTab);
}

function normalizeActiveLinkAttrs(editor: Editor): SemanticLinkAttrs {
    return normalizeSemanticLinkAttrs(editor.getAttributes('link') as Record<string, unknown>);
}


function fallbackLinkText(attrs: SemanticLinkAttrs): string {
    if (attrs.type === 'url' || attrs.type === 'email' || attrs.type === 'tel' || attrs.type === 'sms') {
        return attrs.value ?? linkDisplayHref(attrs);
    }
    return linkDisplayHref(attrs);
}
