import { Mark, type Node as ProseMirrorNode } from '@tiptap/pm/model';
import { Plugin, type Transaction } from '@tiptap/pm/state';
import { isHistoryTransaction } from '@tiptap/pm/history';

/** Structural undo moves Blocks; surviving Craft widgets retain their live values. */
export function preserveFieldValuesOnHistory(): Plugin {
    return new Plugin({
        appendTransaction(transactions, before, after) {
            if (!transactions.some(isHistoryTransaction)) return null;
            const blocks = new Map<string, ProseMirrorNode>();
            before.doc.descendants((node) => {
                if (node.type.name === 'vizyBlock') blocks.set(String(node.attrs.blockUid), node);
            });
            const transaction = after.tr.setMeta('addToHistory', false);
            after.doc.descendants((node, pos) => {
                if (node.type.name !== 'vizyBlock') return;
                const previous = blocks.get(String(node.attrs.blockUid));
                if (!previous || previous.attrs.blockTypeUid !== node.attrs.blockTypeUid) return;
                for (const key of ['fieldSlots', 'matrixAnchorUid']) {
                    if (JSON.stringify(node.attrs[key]) !== JSON.stringify(previous.attrs[key])) {
                        transaction.setNodeAttribute(pos, key, previous.attrs[key]);
                    }
                }
            });
            return transaction.docChanged ? transaction : null;
        },
    });
}

/** Apply server normalization without replacing unchanged content or its history. */
export function reconcileDocument(transaction: Transaction, accepted: ProseMirrorNode): Transaction {
    const reconcile = (before: ProseMirrorNode, after: ProseMirrorNode, pos: number): void => {
        if (before.eq(after)) return;
        if (before.type !== after.type) {
            transaction.replaceWith(pos, pos + before.nodeSize, after);
            return;
        }
        if (before.isText) {
            const oldText = before.text!;
            const newText = after.text!;
            let start = 0;
            let oldEnd = oldText.length;
            let newEnd = newText.length;
            while (start < oldEnd && start < newEnd && oldText[start] === newText[start]) start++;
            while (oldEnd > start && newEnd > start && oldText[oldEnd - 1] === newText[newEnd - 1]) {
                oldEnd--;
                newEnd--;
            }
            if (start < oldEnd || start < newEnd) {
                const text = newText.slice(start, newEnd);
                transaction.replaceWith(pos + start, pos + oldEnd, text ? after.type.schema.text(text, after.marks) : []);
            }
            if (!Mark.sameSet(before.marks, after.marks)) {
                transaction.removeMark(pos, pos + newText.length);
                for (const mark of after.marks) transaction.addMark(pos, pos + newText.length, mark);
            }
            return;
        }

        // Attribute steps have no positional mapping: normalizing a relation or
        // Matrix UID must not move the caret or erase earlier text edits.
        for (const key of Object.keys(after.attrs)) {
            if (JSON.stringify(before.attrs[key]) === JSON.stringify(after.attrs[key])) continue;
            if (pos < 0) transaction.setDocAttribute(key, after.attrs[key]);
            else transaction.setNodeAttribute(pos, key, after.attrs[key]);
        }
        if (pos >= 0 && !Mark.sameSet(before.marks, after.marks)) {
            transaction.setNodeMarkup(pos, undefined, after.attrs, after.marks);
        }

        const contentStart = pos + 1;
        const children: Array<{ before: ProseMirrorNode; after: ProseMirrorNode; pos: number }> = [];
        if (before.childCount === after.childCount) {
            before.forEach((child, offset, index) => {
                children.push({ before: child, after: after.child(index), pos: contentStart + offset });
            });
        }
        if (before.childCount === after.childCount && children.every((child) => child.before.type === child.after.type)) {
            // Later changes cannot shift the positions of earlier siblings.
            for (const child of children.reverse()) reconcile(child.before, child.after, child.pos);
            return;
        }

        // Structural corrections replace only the differing content range in
        // this parent. Text and history elsewhere in the document stay intact.
        const start = before.content.findDiffStart(after.content);
        const end = before.content.findDiffEnd(after.content);
        if (start === null || end === null) return;
        const overlap = Math.max(0, start - Math.min(end.a, end.b));
        transaction.replace(contentStart + start, contentStart + end.a + overlap, after.slice(start, end.b + overlap));
    };
    reconcile(transaction.doc, accepted, -1);
    return transaction;
}
