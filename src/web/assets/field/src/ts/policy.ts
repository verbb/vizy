import { Extension } from '@tiptap/core';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { Plugin } from '@tiptap/pm/state';
import { sameBlockTypeMaxDepth, sameTypeDepthForBlockAt } from './blocks/nesting-depth';
import type { EditorManifest } from './types';

function directBlocks(node: ProseMirrorNode): ProseMirrorNode[] {
    const blocks: ProseMirrorNode[] = [];
    node.forEach((child) => {
        if (child.type.name === 'vizyBlock') blocks.push(child);
    });
    return blocks;
}

type ViolationInventory = Map<string, number>;

function addViolation(inventory: ViolationInventory, key: string): void {
    inventory.set(key, (inventory.get(key) ?? 0) + 1);
}

function stableNodeIdentity(node: ProseMirrorNode): string {
    for (const key of ['blockUid', 'layoutUid', 'columnUid', 'nodeUid']) {
        const value = node.attrs?.[key];
        if (typeof value === 'string' && value) return `${key}:${value}`;
    }
    return `shape:${JSON.stringify(node.toJSON(), (_key, value) => {
        if (!value || typeof value !== 'object' || Array.isArray(value)) return value;
        return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)));
    })}`;
}

function violationKeys(doc: ProseMirrorNode, manifest: EditorManifest): ViolationInventory {
    const violations: ViolationInventory = new Map();
    const rootBlocks = directBlocks(doc);
    if (manifest.field.rootContentType === 'blocks') {
        doc.forEach((child) => {
            if (child.type.name !== 'vizyBlock') addViolation(violations, `root:prose:${stableNodeIdentity(child)}`);
        });
    }
    rootBlocks.forEach((block) => {
        if (!manifest.field.allowedBlockTypeUids.includes(String(block.attrs.blockTypeUid))) {
            addViolation(violations, `root:type:${String(block.attrs.blockUid)}:${String(block.attrs.blockTypeUid)}`);
        }
    });
    if (manifest.field.minBlocks !== null && rootBlocks.length < manifest.field.minBlocks) addViolation(violations, 'root:min');
    if (manifest.field.maxBlocks !== null && rootBlocks.length > manifest.field.maxBlocks) addViolation(violations, 'root:max');

    // Same-type depth in this TipTap doc (root / layout columns). Hosted nesting
    // depth is enforced separately via HostedVizyContext — vizyBlock is a leaf.
    const maxSameTypeDepth = sameBlockTypeMaxDepth(manifest);
    doc.descendants((node, pos) => {
        if (node.type.name !== 'vizyBlock') return;
        const typeUid = String(node.attrs.blockTypeUid);
        if (sameTypeDepthForBlockAt(doc, pos, typeUid) > maxSameTypeDepth) {
            addViolation(violations, `depth:${String(node.attrs.blockUid)}:${typeUid}`);
        }
    });
    return violations;
}

export function isPolicyValid(doc: ProseMirrorNode, manifest: EditorManifest): boolean {
    return violationKeys(doc, manifest).size === 0;
}

/**
 * Existing unresolved content is preserved. A transaction is rejected only
 * when it introduces a policy violation that was not present in its own
 * current state, which also makes stale command execution fail closed.
 */
export const ContentPolicy = Extension.create<{ manifest: EditorManifest }>({
    name: 'vizyContentPolicy',
    addOptions: () => ({ manifest: null as unknown as EditorManifest }),
    addProseMirrorPlugins() {
        const manifest = this.options.manifest;
        return [new Plugin({
            filterTransaction(transaction, state) {
                if (!transaction.docChanged) return true;
                if (transaction.getMeta('vizyAcceptedCanonical') === true) return true;
                const before = violationKeys(state.doc, manifest);
                const after = violationKeys(transaction.doc, manifest);
                return [...after].every(([key, count]) => count <= (before.get(key) ?? 0));
            },
        })];
    },
});
