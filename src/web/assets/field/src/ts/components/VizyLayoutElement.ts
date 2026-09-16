import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { Editor } from '@tiptap/core';
import { moveLayoutColumn } from '../layout/resize';
import { nodeViewShellStyles } from './node-view-shell';

/**
 * Layout UI is intentionally quiet: no header, no outer frame, no resize
 * gutters. Columns carry the dotted wells; span ratios come from the preset.
 * Unwrap stays on the Layout toolbar control; column reorder remains available
 * via `moveColumn` for commands.
 */
@customElement('vizy-layout')
export class VizyLayoutElement extends LitElement {
    @property({ type: String, reflect: true }) accessor layoutUid = '';
    @property({ type: String, reflect: true }) accessor stack = 'small';
    @property({ attribute: false }) accessor layoutPos: number | null = null;
    @property({ attribute: false }) accessor editor: Editor | null = null;
    @property({ attribute: false }) accessor columnSpans: number[] = [];
    @property({ attribute: false }) accessor columnUids: string[] = [];

    static styles = [nodeViewShellStyles, css`
        /* Flex — not block — so ProseMirror break-spaces does not paint Lit
           template newlines as multi-line blank height. */
        :host {
            display: flex;
            flex-direction: column;
            margin: 0.5rem 0;
        }
        /* Columns live in the light-DOM contentDOM (ProseMirror parent of every
           vizy-column). That wrapper is the only slotted node — so the 12-col
           grid MUST be on it, not on this shadow .grid. */
        .grid-shell {
            display: flex;
            flex-direction: column;
            position: relative;
        }
        .grid {
            display: block;
            width: 100%;
            min-width: 0;
        }
        ::slotted(.vizy-layout-columns) {
            display: grid;
            grid-template-columns: repeat(12, minmax(0, 1fr));
            gap: 0.75rem;
            width: 100%;
            min-height: 0;
            align-items: start;
            box-sizing: border-box;
        }
    `];

    render() {
        // Compact template: avoid break-spaces turning newlines into height.
        return html`<div class="grid-shell" part="grid-shell"><div class="grid" part="grid"><slot name="columns"></slot></div></div>`;
    }

    moveColumn(index: number, direction: -1 | 1): void {
        if (this.editor == null || this.layoutPos == null) return;
        moveLayoutColumn(this.editor, this.layoutPos, index, direction);
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'vizy-layout': VizyLayoutElement;
    }
}

@customElement('vizy-column')
export class VizyColumnElement extends LitElement {
    @property({ type: String, reflect: true }) accessor columnUid = '';
    @property({ type: Number, reflect: true }) accessor span = 12;
    @property({ type: Number, reflect: true }) accessor columnIndex = 0;
    @property({ type: Number, reflect: true }) accessor columnCount = 1;

    static styles = [nodeViewShellStyles, css`
        /* Border is also set in vizy.css on the host — light DOM wins for CP
           visibility. Keep packing tight; no min-height well. */
        :host {
            display: flex;
            flex-direction: column;
            min-width: 0;
            min-height: 0;
            box-sizing: border-box;
            padding: 0.375rem 0.5rem;
            background: var(--pk-color-white, #fff);
        }
        [part=column] {
            display: flex;
            flex-direction: column;
            flex: 1 1 auto;
            min-height: 0;
            min-width: 0;
        }
    `];

    render() {
        return html`<div part="column"><slot name="content"></slot></div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'vizy-column': VizyColumnElement;
    }
}
