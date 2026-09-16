/** Canonical semantic attrs shared by link / image / table client nodes. */

import type { Node as ProseMirrorNode } from '@tiptap/pm/model';

export type SemanticLinkType = 'entry' | 'asset' | 'category' | 'url' | 'email' | 'tel' | 'sms' | 'unknown';
export type SiteMode = 'current' | 'fixed';
export type AltMode = 'asset' | 'custom' | 'decorative' | 'missing';
export type ImageSize = 'default' | 'small' | 'medium' | 'large' | 'full';

export interface SemanticLinkAttrs {
    type: SemanticLinkType;
    targetUid: string | null;
    siteMode: SiteMode;
    siteUid: string | null;
    value: string | null;
    suffix: string | null;
    newWindow: boolean;
    title: string | null;
    ariaLabel: string | null;
    rel: string[];
    class: string | null;
    id: string | null;
    download: string | boolean | null;
    linkUid?: string | null;
}

export interface SemanticImageAttrs {
    assetUid: string;
    siteMode: SiteMode;
    siteUid: string | null;
    altMode: AltMode;
    alt: string | null;
    title: string | null;
    size: ImageSize;
    /** Optional semantic link attrs wrapping the image; null when unlinked. */
    link: SemanticLinkAttrs | null;
    imageUid?: string | null;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
    return UUID_RE.test(value);
}

export function defaultLinkAttrs(overrides: Partial<SemanticLinkAttrs> = {}): SemanticLinkAttrs {
    return {
        type: 'url',
        targetUid: null,
        siteMode: 'current',
        siteUid: null,
        value: null,
        suffix: null,
        newWindow: false,
        title: null,
        ariaLabel: null,
        rel: [],
        class: null,
        id: null,
        download: null,
        ...overrides,
    };
}

/** Keep complete semantic metadata when adapting editor attributes. */
export function normalizeSemanticLinkAttrs(raw: Record<string, unknown>): SemanticLinkAttrs {
    return defaultLinkAttrs({
        type: (raw.type as SemanticLinkAttrs['type']) ?? 'url',
        targetUid: typeof raw.targetUid === 'string' ? raw.targetUid : null,
        siteMode: raw.siteMode === 'fixed' ? 'fixed' : 'current',
        siteUid: typeof raw.siteUid === 'string' ? raw.siteUid : null,
        value: typeof raw.value === 'string' ? raw.value : null,
        suffix: typeof raw.suffix === 'string' ? raw.suffix : null,
        newWindow: raw.newWindow === true,
        title: typeof raw.title === 'string' ? raw.title : null,
        ariaLabel: typeof raw.ariaLabel === 'string' ? raw.ariaLabel : null,
        rel: Array.isArray(raw.rel) ? raw.rel.filter((item): item is string => typeof item === 'string') : [],
        class: typeof raw.class === 'string' ? raw.class : null,
        id: typeof raw.id === 'string' ? raw.id : null,
        download: raw.download === true || typeof raw.download === 'string' ? raw.download : null,
        linkUid: typeof raw.linkUid === 'string' ? raw.linkUid : null,
    });
}

export function urlLinkAttrs(value: string, newWindow = false): SemanticLinkAttrs {
    return defaultLinkAttrs({ type: 'url', value, newWindow });
}

/** Editor-only href for visual feedback; never persisted in canonical JSON. */
export function linkDisplayHref(attrs: SemanticLinkAttrs): string {
    switch (attrs.type) {
        case 'url':
            return attrs.value ?? '#';
        case 'email':
            return attrs.value ? `mailto:${attrs.value}` : '#';
        case 'tel':
            return attrs.value ? `tel:${attrs.value}` : '#';
        case 'sms':
            return attrs.value ? `sms:${attrs.value}` : '#';
        case 'entry':
        case 'asset':
        case 'category':
            return attrs.targetUid ? `#vizy-link:${attrs.type}:${attrs.targetUid}` : '#';
        default:
            return '#';
    }
}

/** Distribute 1000 weight units across logical columns (remainder left-to-right). */
export function equalColumnWidths(columnCount: number): number[] {
    if (columnCount < 1) return [];
    const base = Math.floor(1000 / columnCount);
    const remainder = 1000 - base * columnCount;
    return Array.from({ length: columnCount }, (_, index) => base + (index < remainder ? 1 : 0));
}

export function columnWidthTotal(widths: number[]): number {
    return widths.reduce((sum, weight) => sum + weight, 0);
}

export function countLogicalTableColumns(tableNode: ProseMirrorNode): number {
    if (tableNode.childCount === 0) return 0;
    const firstRow = tableNode.child(0);
    let columns = 0;
    for (let index = 0; index < firstRow.childCount; index++) {
        const colspan = Number(firstRow.child(index).attrs.colspan ?? 1);
        columns += Number.isFinite(colspan) && colspan > 0 ? colspan : 1;
    }
    return columns;
}
