import type { InsertionItemManifest } from './types';

function normalize(value: string): string {
    return value
        .normalize('NFD')
        .replace(/\p{M}/gu, '')
        .toLowerCase()
        .trim();
}

function tokens(value: string): string[] {
    return normalize(value).split(/[\s/_-]+/).filter(Boolean);
}

/** Deterministic fuzzy score; higher is better. Zero means no match. */
export function scoreInsertionItem(item: InsertionItemManifest, search: string): number {
    const query = normalize(search);
    if (query === '') return 1;

    const haystacks = [
        item.label,
        ...(item.keywords ?? []),
        ...(item.aliases ?? []),
        item.group,
        item.description ?? '',
        item.kind === 'node' ? item.nodeName ?? '' : '',
        item.kind === 'block' ? item.blockTypeUid ?? '' : '',
    ].map(normalize);

    for (const haystack of haystacks) {
        if (haystack.startsWith(query)) return 100;
    }

    const queryTokens = tokens(query);
    let matched = 0;
    for (const token of queryTokens) {
        if (haystacks.some((haystack) => haystack.includes(token))) matched += 1;
    }
    if (matched === 0) return 0;
    return 10 + matched;
}

export function compareAvailable(
    a: { item: InsertionItemManifest; score: number },
    b: { item: InsertionItemManifest; score: number },
): number {
    if (b.score !== a.score) return b.score - a.score;
    const group = a.item.group.localeCompare(b.item.group);
    if (group !== 0) return group;
    if (a.item.order !== b.item.order) return a.item.order - b.item.order;
    return a.item.id.localeCompare(b.item.id);
}
