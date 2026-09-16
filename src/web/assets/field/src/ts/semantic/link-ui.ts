import type { Editor } from '@tiptap/core';
import {
    buildCraftElementLinkUrl,
    getCraftLinkOptions,
    type ElementSelectorHost,
    type LinkElementConfig,
    type LinkOptionSchemaItem,
    type LinkOptionsInput,
} from '@verbb/plugin-kit-tiptap-core/links';
import { defaultLinkAttrs, isUuid, type SemanticLinkType } from './attrs';
import {
    getSemanticLinkEditState,
    seedInsertLinkDialog,
    unsetSemanticLinkFromEditor,
} from './link-apply';
import { openVizyLinkDialog } from './link-dialog';

export type VizyLinkOption = LinkOptionSchemaItem;

/** Bootstrap payload for Craft element link pickers. */
export type VizyLinkAuthoringConfig = {
    linkOptions?: LinkOptionsInput;
    elementSiteId?: number;
    /** Prefix for Craft element selector storage keys (per field). */
    linkSelectorStorageKeyPrefix?: string;
};

function craftElementSelectorHost(): ElementSelectorHost {
    return {
        openElementSelector: (elementType, options) => {
            const craft = window.Craft;
            // Must call as a Craft method — the implementation reads
            // `this._elementSelectorModalClasses`. Extracting the function
            // loses `this` and throws in strict mode.
            if (!craft?.createElementSelectorModal) {
                throw new Error('Craft element selector is not available in this environment.');
            }
            craft.createElementSelectorModal(elementType, options);
        },
    };
}

function selectedText(editor: Editor): string {
    const { from, to } = editor.state.selection;
    return editor.state.doc.textBetween(from, to, ' ');
}

/**
 * Open Insert/Update Link dialog. Replaces the old `window.prompt` path.
 * Unlink is a separate toolbar menu action — not a toggle on this control.
 */
export function activateLinkControl(
    editor: Editor,
    markName: string,
    options?: { focus?: boolean },
): void {
    if (markName !== 'link') {
        const focus = options?.focus ?? editor.view.hasFocus();
        const chain = focus ? editor.chain().focus() : editor.chain();
        chain.toggleMark(markName).run();
        return;
    }
    void openLinkDialogForEditor(editor, options);
}

export async function openLinkDialogForEditor(
    editor: Editor,
    options?: { focus?: boolean },
): Promise<void> {
    const seed = editor.isActive('link')
        ? getSemanticLinkEditState(editor)
        : seedInsertLinkDialog(editor);
    await openVizyLinkDialog(editor, seed, options);
}

export function unlinkFromEditor(editor: Editor, options?: { focus?: boolean }): void {
    unsetSemanticLinkFromEditor(editor, options);
}

export function craftLinkOptionsFromConfig(
    config: VizyLinkAuthoringConfig | null | undefined,
): LinkOptionSchemaItem[] {
    return getCraftLinkOptions(config?.linkOptions);
}

/**
 * Open Craft’s element selector, then the Insert Link dialog.
 * Reads `uid` from the selected chip so we can write semantic `targetUid`.
 * Falls back to a plain URL mark with the Craft `#ref:id@site` href when UID
 * is missing (selector host without data-uid).
 */
export function openCraftElementLink(
    editor: Editor,
    option: LinkElementConfig,
    config: VizyLinkAuthoringConfig,
    options?: { focus?: boolean },
): void {
    const prefix = config.linkSelectorStorageKeyPrefix
        || `VizyInput.LinkTo.${config.elementSiteId ?? 'site'}`;
    const host = craftElementSelectorHost();

    host.openElementSelector(option.elementType, {
        storageKey: `${prefix}.${option.elementType}`,
        sources: option.sources,
        criteria: option.criteria,
        defaultSiteId: config.elementSiteId,
        autoFocusSearchBox: false,
        closeOtherModals: false,
        onSelect: (elements) => {
            if (!elements?.length) return;
            const [element] = elements;
            const text = selectedText(editor) || element.label || '';
            const uid = craftElementUid(element as {
                uid?: string;
                $element?: { data?: (key: string) => unknown; attr?: (key: string) => string | undefined };
            });
            const linkType = refHandleToLinkType(option.refHandle);
            const site = siteIntent(config.elementSiteId, element.siteId);

            if (uid && linkType) {
                void openVizyLinkDialog(editor, {
                    url: element.url || '',
                    text,
                    openInNewTab: false,
                    semantic: defaultLinkAttrs({
                        type: linkType,
                        targetUid: uid,
                        siteMode: site.siteMode,
                        siteUid: site.siteUid,
                        newWindow: false,
                    }),
                }, options);
                return;
            }

            void openVizyLinkDialog(editor, {
                url: buildCraftElementLinkUrl(element, option.refHandle),
                text,
                openInNewTab: false,
            }, options);
        },
    });
}

function craftElementUid(element: {
    uid?: string;
    $element?: { data?: (key: string) => unknown; attr?: (key: string) => string | undefined };
}): string | null {
    if (typeof element.uid === 'string' && isUuid(element.uid)) return element.uid;
    const fromData = element.$element?.data?.('uid');
    if (typeof fromData === 'string' && isUuid(fromData)) return fromData;
    const fromAttr = element.$element?.attr?.('data-uid');
    if (typeof fromAttr === 'string' && isUuid(fromAttr)) return fromAttr;
    return null;
}

function refHandleToLinkType(refHandle: string): SemanticLinkType | null {
    switch (refHandle) {
        case 'entry':
            return 'entry';
        case 'asset':
            return 'asset';
        case 'category':
            return 'category';
        default:
            return null;
    }
}

function siteIntent(
    fieldSiteId: number | undefined,
    pickedSiteId: number | undefined,
): { siteMode: 'current' | 'fixed'; siteUid: string | null } {
    if (!pickedSiteId || !fieldSiteId || pickedSiteId === fieldSiteId) {
        return { siteMode: 'current', siteUid: null };
    }
    const site = window.Craft?.sites?.find((entry) => entry.id === pickedSiteId);
    return {
        siteMode: 'fixed',
        siteUid: typeof site?.uid === 'string' && isUuid(site.uid) ? site.uid : null,
    };
}
