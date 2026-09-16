import type { Editor } from '@tiptap/core';
import type { BlockUiStateRegistry } from '../registries';
import type { EditorManifest, JsonValue } from '../types';
import { VizyBlockElement } from '../components/VizyBlockElement';
import { projectBlockSummary } from './summary-projection';

export function refreshBlockSummaries(
    editor: Editor,
    manifest: EditorManifest,
    ui: BlockUiStateRegistry,
    blockRevisions: ReadonlyMap<string, number>,
): void {
    editor.state.doc.descendants((node, pos) => {
        if (node.type.name !== 'vizyBlock') return;
        const blockUid = String(node.attrs.blockUid);
        const blockTypeUid = String(node.attrs.blockTypeUid);
        const type = manifest.blockTypes[blockTypeUid];
        const fieldSlots = (node.attrs.fieldSlots ?? {}) as Record<string, JsonValue>;
        const summary = projectBlockSummary({
            blockUid,
            blockTypeUid,
            enabled: Boolean(node.attrs.enabled),
            fieldSlots,
            type,
            inference: type?.summaryInference,
            revision: blockRevisions.get(blockUid) ?? 0,
            explicitTitlePlacementUid: type?.summary?.titlePlacementUid,
            explicitSubtitlePlacementUid: type?.summary?.subtitlePlacementUid,
            explicitMediaPlacementUid: type?.summary?.mediaPlacementUid,
        });
        ui.update(blockUid, { summary });
        // Registry alone does not repaint UI — node views only read summary on
        // create/update. Push onto the live host so load/insert show the type name
        // (e.g. "Card") instead of the empty-title fallback "Block".
        const dom = editor.view.nodeDOM(pos);
        if (dom instanceof VizyBlockElement) {
            dom.applySummary(summary);
        }
    });
}

export function setExpandAll(ui: BlockUiStateRegistry, liveUids: ReadonlySet<string>, expanded: boolean): void {
    for (const uid of liveUids) {
        ui.update(uid, { collapsed: !expanded, view: { expanded } });
    }
}
