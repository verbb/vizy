import { Mark, mergeAttributes } from '@tiptap/core';
import { isAllowedUri } from '@tiptap/extension-link';
import {
    defaultLinkAttrs,
    linkDisplayHref,
    type SemanticLinkAttrs,
    type SemanticLinkType,
} from './attrs';
import { attrsFromUrlDialog } from './link-apply';
import type { LinkAttributeManifest } from '../types';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        semanticLink: {
            setSemanticLink: (attrs: SemanticLinkAttrs) => ReturnType;
            toggleSemanticLink: (attrs?: SemanticLinkAttrs) => ReturnType;
            unsetSemanticLink: () => ReturnType;
        };
    }
}

const LINK_TYPES = new Set<SemanticLinkType>([
    'entry', 'asset', 'category', 'url', 'email', 'tel', 'sms', 'unknown',
]);

function nullableString(value: unknown): string | null {
    return typeof value === 'string' && value !== '' ? value : null;
}

function parseRel(value: unknown): string[] {
    if (Array.isArray(value)) {
        return value.filter((item): item is string => typeof item === 'string');
    }
    if (typeof value === 'string' && value.trim() !== '') {
        return value.split(/\s+/);
    }
    return [];
}

function normalizeLinkAttrs(
    raw: Record<string, unknown>,
    registeredAttributes: readonly LinkAttributeManifest[],
): SemanticLinkAttrs {
    const type = LINK_TYPES.has(raw.type as SemanticLinkType)
        ? raw.type as SemanticLinkType
        : 'url';
    const registered = Object.fromEntries(registeredAttributes.map((attribute) => [
        attribute.name,
        typeof raw[attribute.name] === 'boolean' ? raw[attribute.name] : attribute.default,
    ]));

    return defaultLinkAttrs({
        ...registered,
        type,
        targetUid: nullableString(raw.targetUid),
        siteMode: raw.siteMode === 'fixed' ? 'fixed' : 'current',
        siteUid: nullableString(raw.siteUid),
        value: nullableString(raw.value),
        suffix: nullableString(raw.suffix),
        newWindow: raw.newWindow === true,
        title: nullableString(raw.title),
        ariaLabel: nullableString(raw.ariaLabel),
        rel: parseRel(raw.rel),
        class: nullableString(raw.class),
        id: nullableString(raw.id),
        download: raw.download === true || typeof raw.download === 'string' ? raw.download : null,
        linkUid: nullableString(raw.linkUid),
    });
}

/** TipTap link mark storing semantic attrs — never raw href. */
export function createSemanticLink(registeredAttributes: readonly LinkAttributeManifest[] = []) {
    return Mark.create({
        name: 'link',
        priority: 1000,
        inclusive: true,
        keepOnSplit: false,

        addAttributes() {
            return {
                type: { default: 'url' },
                targetUid: { default: null },
                siteMode: { default: 'current' },
                siteUid: { default: null },
                value: { default: null },
                suffix: { default: null },
                newWindow: { default: false },
                title: { default: null },
                ariaLabel: { default: null },
                rel: { default: [] },
                class: { default: null },
                id: { default: null },
                download: { default: null },
                linkUid: { default: null, rendered: false },
                ...Object.fromEntries(registeredAttributes.map((attribute) => [
                    attribute.name,
                    { default: attribute.default, rendered: false },
                ])),
            };
        },

        parseHTML() {
            return [{
                tag: 'a[href]',
                getAttrs: (element) => {
                    const href = (element as HTMLElement).getAttribute('href');
                    if (!href || href.startsWith('#vizy-link:')) {
                        return false;
                    }
                    // External HTML enters the same semantic lanes as the Link dialog.
                    return normalizeLinkAttrs({
                        ...attrsFromUrlDialog(href, false),
                        ...readRegisteredAttributes(element as HTMLElement, registeredAttributes),
                    }, registeredAttributes);
                },
            }];
        },

        renderHTML({ mark }) {
            const attrs = normalizeLinkAttrs(mark.attrs as Record<string, unknown>, registeredAttributes);
            // Restored attrs bypass commands; keep unsafe stored links inert on emission.
            const candidate = linkDisplayHref(attrs);
            const href = isAllowedUri(candidate) ? candidate : '#';
            const domAttrs: Record<string, string> = {
                href,
                'data-vizy-link-type': attrs.type,
            };
            if (attrs.title) domAttrs.title = attrs.title;
            if (attrs.ariaLabel) domAttrs['aria-label'] = attrs.ariaLabel;
            if (attrs.class) domAttrs.class = attrs.class;
            if (attrs.id) domAttrs.id = attrs.id;
            if (attrs.rel.length) {
                domAttrs.rel = [...new Set(attrs.rel)].join(' ');
            }
            applyRegisteredOutput(domAttrs, attrs, registeredAttributes);
            if (attrs.newWindow) {
                domAttrs.target = '_blank';
                const rel = (domAttrs.rel ?? '').split(/\s+/)
                    .filter((value) => value && value.toLowerCase() !== 'opener');
                rel.push('noopener', 'noreferrer');
                domAttrs.rel = [...new Set(rel)].join(' ');
            }
            return ['a', mergeAttributes(domAttrs), 0];
        },

        addCommands() {
            return {
                setSemanticLink: (attributes) => ({ chain }) => chain()
                    .setMark(this.name, normalizeLinkAttrs(
                        attributes as unknown as Record<string, unknown>,
                        registeredAttributes,
                    ))
                    .setMeta('preventAutolink', true)
                    .run(),
                toggleSemanticLink: (attributes) => ({ editor, chain }) => {
                    if (editor.isActive(this.name)) {
                        return chain().unsetMark(this.name).run();
                    }
                    if (!attributes) return false;
                    return chain()
                        .setMark(this.name, normalizeLinkAttrs(
                            attributes as unknown as Record<string, unknown>,
                            registeredAttributes,
                        ))
                        .setMeta('preventAutolink', true)
                        .run();
                },
                unsetSemanticLink: () => ({ chain }) => chain().unsetMark(this.name).run(),
            };
        },
    });
}

function readRegisteredAttributes(
    element: HTMLElement,
    registeredAttributes: readonly LinkAttributeManifest[],
): Record<string, boolean> {
    return Object.fromEntries(registeredAttributes.map((attribute) => {
        const htmlAttribute = attribute.htmlAttribute;
        const htmlValue = attribute.htmlValue;
        if (!htmlAttribute || !htmlValue) return [attribute.name, attribute.default];
        const value = element.getAttribute(htmlAttribute) ?? '';
        const expected = htmlValue.split(/\s+/).filter(Boolean);
        const enabled = htmlAttribute === 'class' || htmlAttribute === 'rel'
            ? expected.every((token) => value.split(/\s+/).includes(token))
            : value === htmlValue;
        return [attribute.name, enabled];
    }));
}

function applyRegisteredOutput(
    domAttrs: Record<string, string>,
    attrs: SemanticLinkAttrs,
    registeredAttributes: readonly LinkAttributeManifest[],
): void {
    for (const attribute of registeredAttributes) {
        if (attrs[attribute.name] !== true || !attribute.htmlAttribute || !attribute.htmlValue) continue;
        if (attribute.htmlAttribute === 'class' || attribute.htmlAttribute === 'rel') {
            const tokens = (domAttrs[attribute.htmlAttribute] ?? '').split(/\s+/).filter(Boolean);
            const registeredTokens = attribute.htmlValue.split(/\s+/).filter(Boolean);
            domAttrs[attribute.htmlAttribute] = [...new Set([...tokens, ...registeredTokens])].join(' ');
        } else {
            domAttrs[attribute.htmlAttribute] = attribute.htmlValue;
        }
    }
}
