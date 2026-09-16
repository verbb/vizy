import type { BlockSummaryData, BlockSummaryInferenceManifest, FieldSlots } from './types';
import type { BlockTypeManifest } from '../types';

const TITLE_MAX = 120;
const SUBTITLE_MAX = 160;
const MISSING_TYPE = 'Missing Block Type';

function boundText(value: string | null | undefined, max: number): string | null {
    if (value == null) return null;
    const trimmed = String(value).replace(/\s+/g, ' ').trim();
    if (!trimmed) return null;
    return trimmed.length <= max ? trimmed : `${trimmed.slice(0, max - 1)}…`;
}

function textFromSlot(slots: FieldSlots, placementUid: string): string | null {
    const raw = slots[placementUid];
    if (raw == null) return null;
    if (typeof raw === 'string') return raw;
    if (typeof raw === 'number' || typeof raw === 'boolean') return String(raw);
    return null;
}

function assetReference(slots: FieldSlots, placementUid: string): string | number | null {
    const raw = slots[placementUid];
    if (Array.isArray(raw) && raw.length) return raw[0] as string | number;
    if (typeof raw === 'number' || typeof raw === 'string') return raw;
    return null;
}

function pickText(
    slots: FieldSlots,
    explicit: string | null | undefined,
    candidates: readonly string[],
    fallback: string,
    max: number,
): string {
    const order = explicit ? [explicit, ...candidates.filter((uid) => uid !== explicit)] : [...candidates];
    for (const uid of order) {
        const text = boundText(textFromSlot(slots, uid), max);
        if (text) return text;
    }
    return boundText(fallback, max) ?? fallback;
}

export function projectBlockSummary(input: {
    blockUid: string;
    blockTypeUid: string;
    enabled: boolean;
    fieldSlots: FieldSlots;
    type: BlockTypeManifest | undefined;
    inference: BlockSummaryInferenceManifest | undefined;
    validation?: { errorCount?: number; descendantErrorCount?: number } | null;
    revision: number;
    explicitTitlePlacementUid?: string | null;
    explicitSubtitlePlacementUid?: string | null;
    explicitMediaPlacementUid?: string | null;
}): BlockSummaryData {
    const resolved = Boolean(input.type);
    const fallbackTitle = input.type?.name ?? MISSING_TYPE;
    const inference = input.inference ?? {
        titlePlacementUids: [],
        subtitlePlacementUids: [],
        mediaPlacementUids: [],
    };
    const title = resolved
        ? pickText(
            input.fieldSlots,
            input.explicitTitlePlacementUid,
            inference.titlePlacementUids,
            fallbackTitle,
            TITLE_MAX,
        )
        : MISSING_TYPE;
    const subtitle = resolved
        ? boundText(
            pickText(
                input.fieldSlots,
                input.explicitSubtitlePlacementUid,
                inference.subtitlePlacementUids,
                '',
                SUBTITLE_MAX,
            ) || null,
            SUBTITLE_MAX,
        )
        : null;
    const mediaUid = input.explicitMediaPlacementUid ?? inference.mediaPlacementUids[0] ?? null;
    const reference = mediaUid ? assetReference(input.fieldSlots, mediaUid) : null;
    return {
        blockUid: input.blockUid,
        blockTypeUid: input.blockTypeUid,
        typeName: fallbackTitle,
        title,
        subtitle: subtitle || null,
        media: reference != null
            ? { kind: 'asset', reference, alt: null, thumbnailUrl: null }
            : null,
        enabled: input.enabled,
        resolved,
        errorCount: input.validation?.errorCount ?? 0,
        descendantErrorCount: input.validation?.descendantErrorCount ?? 0,
        revision: input.revision,
    };
}
