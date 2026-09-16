import { Node, mergeAttributes } from '@tiptap/core';
import type { NodeView, ViewMutationRecord } from '@tiptap/pm/view';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import '../components/VizyLayoutElement';
import type { Editor } from '@tiptap/core';

type LayoutServices = () => { editor: Editor | undefined };

/**
 * Lit paints UI on the host (reflected attrs, shadow, live region). Without
 * ignoreMutation, ProseMirror treats those writes as content dirt and remounts
 * layout/column NodeViews in a microtask loop.
 */
function ignoreNodeViewShell(
    mutation: ViewMutationRecord,
    host: HTMLElement,
    contentDOM: HTMLElement,
): boolean {
    if (mutation.type === 'selection') return false;
    const target = mutation.target;
    if (!(target instanceof globalThis.Node)) return true;
    if (target === host || host.shadowRoot?.contains(target)) return true;
    return !contentDOM.contains(target);
}

class LayoutNodeView implements NodeView {
    readonly dom: HTMLElement & {
        layoutUid: string;
        stack: string;
        layoutPos: number | null;
        editor: Editor | null;
        columnSpans: number[];
        columnUids: string[];
    };
    readonly contentDOM: HTMLElement;
    #getPos: () => number | undefined;
    #services: LayoutServices;

    constructor(props: { node: ProseMirrorNode; getPos: () => number | undefined }, services: LayoutServices) {
        this.#getPos = props.getPos;
        this.#services = services;
        this.dom = document.createElement('vizy-layout') as typeof this.dom;
        this.dom.layoutUid = String(props.node.attrs.layoutUid);
        this.dom.stack = String(props.node.attrs.stack ?? 'small');
        // Single ProseMirror content parent for every column. This element is the
        // only node slotted into vizy-layout — it must own the 12-col grid itself.
        // Inline styles are the source of truth; CSS classes mirror for specificity.
        this.contentDOM = document.createElement('div');
        this.contentDOM.className = 'vizy-layout-columns';
        this.contentDOM.slot = 'columns';
        this.contentDOM.style.display = 'grid';
        this.contentDOM.style.gridTemplateColumns = 'repeat(12, minmax(0, 1fr))';
        this.contentDOM.style.gap = '0.75rem';
        this.contentDOM.style.width = '100%';
        this.contentDOM.style.minHeight = '0';
        this.contentDOM.style.alignItems = 'start';
        this.contentDOM.style.boxSizing = 'border-box';
        this.dom.append(this.contentDOM);
        // Sync before the first paint so column UI is not empty→full thrash.
        this.#sync(props.node);
    }

    #sync(node: ProseMirrorNode): void {
        this.dom.layoutUid = String(node.attrs.layoutUid);
        this.dom.stack = String(node.attrs.stack ?? 'small');
        const spans: number[] = [];
        const uids: string[] = [];
        for (let i = 0; i < node.childCount; i++) {
            const child = node.child(i);
            spans.push(Number(child.attrs.span ?? 12));
            uids.push(String(child.attrs.columnUid ?? ''));
        }
        // Assign new arrays so Lit sees a property change even when lengths match.
        this.dom.columnSpans = spans;
        this.dom.columnUids = uids;
        const editor = this.#services().editor;
        if (editor) {
            this.dom.editor = editor;
            this.dom.layoutPos = this.#getPos() ?? null;
        }
    }

    update(node: ProseMirrorNode): boolean {
        if (node.type.name !== 'layout') return false;
        this.#sync(node);
        return true;
    }

    ignoreMutation(mutation: ViewMutationRecord): boolean {
        return ignoreNodeViewShell(mutation, this.dom, this.contentDOM);
    }
}

class ColumnNodeView implements NodeView {
    readonly dom: HTMLElement & {
        columnUid: string;
        span: number;
        columnIndex: number;
        columnCount: number;
        style: CSSStyleDeclaration;
    };
    readonly contentDOM: HTMLElement;

    constructor(props: { node: ProseMirrorNode }) {
        this.dom = document.createElement('vizy-column') as typeof this.dom;
        this.contentDOM = document.createElement('div');
        this.contentDOM.slot = 'content';
        this.dom.append(this.contentDOM);
        this.#apply(props.node);
    }

    #apply(node: ProseMirrorNode): void {
        this.dom.columnUid = String(node.attrs.columnUid);
        this.dom.span = Number(node.attrs.span ?? 12);
        // Parent layout grid places *slotted hosts*, not shadow children — span on :host.
        this.dom.style.gridColumn = `span ${Math.min(12, Math.max(1, this.dom.span))}`;
        const layout = this.dom.closest('vizy-layout') as (HTMLElement & {
            columnUids?: string[];
        }) | null;
        if (layout) {
            const uids = layout.columnUids ?? [];
            this.dom.columnIndex = uids.indexOf(this.dom.columnUid);
            this.dom.columnCount = uids.length;
        }
    }

    update(node: ProseMirrorNode): boolean {
        if (node.type.name !== 'column') return false;
        this.#apply(node);
        return true;
    }

    ignoreMutation(mutation: ViewMutationRecord): boolean {
        return ignoreNodeViewShell(mutation, this.dom, this.contentDOM);
    }
}

export function createVizyLayout(services: LayoutServices) {
    return Node.create({
        name: 'layout',
        group: 'block',
        content: 'column+',
        defining: true,
        isolating: true,
        addAttributes: () => ({
            layoutUid: { default: null, rendered: false },
            stack: { default: 'small' },
        }),
        parseHTML: () => [{ tag: 'vizy-layout' }],
        renderHTML: ({ HTMLAttributes }) => ['vizy-layout', mergeAttributes(HTMLAttributes), 0],
        addNodeView: () => (props) => new LayoutNodeView(props, services),
    });
}

export function createVizyColumn() {
    return Node.create({
        name: 'column',
        content: 'block*',
        defining: true,
        isolating: true,
        addAttributes: () => ({
            columnUid: { default: null, rendered: false },
            span: { default: 12 },
        }),
        parseHTML: () => [{ tag: 'vizy-column' }],
        renderHTML: ({ HTMLAttributes }) => ['vizy-column', mergeAttributes(HTMLAttributes), 0],
        addNodeView: () => (props) => new ColumnNodeView(props),
    });
}
