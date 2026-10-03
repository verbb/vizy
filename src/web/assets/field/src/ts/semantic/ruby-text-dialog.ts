import { LitElement, html } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import type { Editor } from '@tiptap/core';
import '@verbb/plugin-kit-web/components/button/pk-button.js';
import '@verbb/plugin-kit-web/components/field/pk-field.js';
import '@verbb/plugin-kit-web/components/input/pk-input.js';
import { ensurePkDialog } from '../pk-dialog';

type PkDialogEl = HTMLElement & {
    show: () => Promise<void>;
    hide: (source?: string) => Promise<void>;
};
type PkInputEl = HTMLElement & { value: string; focus: () => void };

let sharedDialog: VizyRubyTextDialogElement | null = null;
const t = (message: string): string => window.Craft?.t?.('vizy', message) ?? message;

/** Annotation editor for the official TipTap Ruby Text mark. */
@customElement('vizy-ruby-text-dialog')
export class VizyRubyTextDialogElement extends LitElement {
    #editor: Editor | null = null;
    #focus = true;

    @query('pk-dialog') accessor dialog: PkDialogEl | null = null;
    @query('pk-input') accessor annotationInput: PkInputEl | null = null;

    async openForEditor(editor: Editor, options?: { focus?: boolean }): Promise<void> {
        await ensurePkDialog();
        this.#editor = editor;
        this.#focus = options?.focus ?? true;
        await this.updateComplete;
        this.annotationInput!.value = String(editor.getAttributes('rubyText').rt ?? '');
        await this.dialog?.show();
        this.annotationInput?.focus();
    }

    render() {
        return html`
            <pk-dialog label=${t('Ruby text')} @pk-after-hide=${this.#onAfterHide}>
                <pk-field label=${t('Annotation')} instructions=${t('Enter the reading guide shown above the selected text.')}>
                    <pk-input maxlength="200" @keydown=${this.#onKeydown}></pk-input>
                </pk-field>
                <pk-button slot="footer" @click=${this.#remove}>${t('Remove')}</pk-button>
                <pk-button slot="footer" data-dialog-close>${t('Cancel')}</pk-button>
                <pk-button slot="footer" variant="primary" @click=${this.#apply}>${t('Apply')}</pk-button>
            </pk-dialog>
        `;
    }

    #apply = (): void => {
        const editor = this.#editor;
        if (!editor) return;
        const annotation = this.annotationInput?.value.trim() ?? '';
        const chain = this.#focus ? editor.chain().focus() : editor.chain();
        if (annotation) chain.setRubyText({ rt: annotation }).run();
        else chain.unsetRubyText().run();
        void this.dialog?.hide('submit');
    };

    #remove = (): void => {
        const editor = this.#editor;
        if (!editor) return;
        const chain = this.#focus ? editor.chain().focus() : editor.chain();
        chain.unsetRubyText().run();
        void this.dialog?.hide('remove');
    };

    #onKeydown = (event: KeyboardEvent): void => {
        if (event.key !== 'Enter' || event.isComposing) return;
        event.preventDefault();
        this.#apply();
    };

    #onAfterHide = (event: Event): void => {
        if (event.target === this.dialog) this.#editor = null;
    };
}

export async function openRubyTextDialogForEditor(
    editor: Editor,
    options?: { focus?: boolean },
): Promise<void> {
    await ensurePkDialog();

    if (!sharedDialog || !sharedDialog.isConnected) {
        sharedDialog = document.createElement('vizy-ruby-text-dialog') as VizyRubyTextDialogElement;
        document.body.append(sharedDialog);
        await sharedDialog.updateComplete;
    }
    await sharedDialog.openForEditor(editor, options);
}

declare global {
    interface HTMLElementTagNameMap {
        'vizy-ruby-text-dialog': VizyRubyTextDialogElement;
    }
}
