import type { EditorManifest } from '../types';

/** One Editor Config layout preset: fixed spans summing to 12. */
export interface LayoutPreset {
    readonly id: string;
    readonly label: string;
    readonly spans: readonly number[];
    readonly accessibleLabel: string;
}

/** Default layout presets when the manifest does not override.
 * Naming follows common CMS column language (Two/Three/Four columns, 60/40).
 * Single-column is omitted — layouts require 2–4 columns. */
export const DEFAULT_LAYOUT_PRESETS: readonly LayoutPreset[] = Object.freeze([
    { id: 'two-columns', label: 'Two columns', spans: [6, 6], accessibleLabel: 'Two equal columns' },
    { id: 'three-columns', label: 'Three columns', spans: [4, 4, 4], accessibleLabel: 'Three equal columns' },
    { id: 'four-columns', label: 'Four columns', spans: [3, 3, 3, 3], accessibleLabel: 'Four equal columns' },
    { id: '60-40', label: '60/40', spans: [7, 5], accessibleLabel: 'Two columns, 60 percent and 40 percent' },
    { id: '40-60', label: '40/60', spans: [5, 7], accessibleLabel: 'Two columns, 40 percent and 60 percent' },
]);

export function resolveLayoutPresets(manifest: EditorManifest): LayoutPreset[] {
    const configured = manifest.layoutPresets;
    if (!configured?.length) {
        return [...DEFAULT_LAYOUT_PRESETS];
    }
    return configured.map((preset) => ({
        id: preset.id,
        label: preset.label,
        spans: preset.spans,
        accessibleLabel: preset.accessibleLabel ?? `${preset.label}, ${preset.spans.length} columns`,
    }));
}

export function findLayoutPreset(presets: readonly LayoutPreset[], presetId: string): LayoutPreset | undefined {
    return presets.find((preset) => preset.id === presetId);
}

export function presetsForColumnCount(
    presets: readonly LayoutPreset[],
    columnCount: number,
): LayoutPreset[] {
    return presets.filter((preset) => preset.spans.length === columnCount);
}

export function defaultTwoColumnPreset(presets: readonly LayoutPreset[]): LayoutPreset {
    return presets.find((preset) => preset.spans.length === 2) ?? DEFAULT_LAYOUT_PRESETS[0];
}

/** Allowed adjacent span pairs whose total equals the current pair total. */
export function gutterCandidates(leadingSpan: number, trailingSpan: number): Array<[number, number]> {
    const total = leadingSpan + trailingSpan;
    const candidates: Array<[number, number]> = [];
    for (let leading = 1; leading < total; leading += 1) {
        candidates.push([leading, total - leading]);
    }
    return candidates;
}

export function nearestCandidateIndex(
    candidates: ReadonlyArray<[number, number]>,
    leadingSpan: number,
    targetLeadingSpan: number,
): number {
    let bestIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;
    candidates.forEach(([leading], index) => {
        const distance = Math.abs(leading - targetLeadingSpan);
        if (distance < bestDistance) {
            bestDistance = distance;
            bestIndex = index;
        }
    });
    // Prefer staying on current span when distances tie.
    const currentIndex = candidates.findIndex(([leading]) => leading === leadingSpan);
    if (currentIndex >= 0) {
        const currentDistance = Math.abs(leadingSpan - targetLeadingSpan);
        if (currentDistance <= bestDistance) return currentIndex;
    }
    return bestIndex;
}

export function describeGutterRatio(leading: number, trailing: number): string {
    return `Left column ${leading} of 12, right column ${trailing} of 12`;
}
