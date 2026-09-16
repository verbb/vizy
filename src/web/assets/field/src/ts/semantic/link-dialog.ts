import { LitElement, css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import '@verbb/plugin-kit-web/components/button/pk-button.js';
import '@verbb/plugin-kit-web/components/checkbox/pk-checkbox.js';
import '@verbb/plugin-kit-web/components/field/pk-field.js';
import '@verbb/plugin-kit-web/components/input/pk-input.js';
import { ensurePkDialog } from '../pk-dialog';
import type { LinkDialogSeed } from './link-apply';
import {
    applySemanticLinkToEditor,
    attrsFromUrlDialog,
} from './link-apply';
import type { Editor } from '@tiptap/core';
import type { SemanticLinkAttrs } from './attrs';

type PkDialogEl = HTMLElement & {
    open: boolean;
    label: string;
    size?: string;
    show: () => Promise<void>;
    hide: (source?: string) => Promise<void>;
    updateComplete?: Promise<unknown>;
};

type PkInputEl = HTMLElement & { value: string };
type PkCheckboxEl = HTMLElement & { checked: boolean };
type PkButtonEl = HTMLElement & { disabled: boolean };

let sharedDialog: VizyLinkDialogElement | null = null;

/**
 * Plugin Kit–shaped Insert/Update Link dialog (URL, Text, new tab).
 * Modeled on `pk-tiptap-editor`’s link dialog; applies Vizy semantic marks.
 */
@customElement('vizy-link-dialog')
export class VizyLinkDialogElement extends LitElement {
    @property() accessor dialogTitle = 'Insert Link';
    @property() accessor submitLabel = 'Insert';

    #editor: Editor | null = null;
    #seed: LinkDialogSeed = { url: '', text: '', openInNewTab: false };
    #focus = true;
    #urlInputId = `vizy-link-url-${Math.random().toString(36).slice(2, 9)}`;
    #textInputId = `vizy-link-text-${Math.random().toString(36).slice(2, 9)}`;

    @query('pk-dialog') accessor dialog: PkDialogEl | null = null;
    @query('.link-dialog__url-input') accessor urlInput: PkInputEl | null = null;
    @query('.link-dialog__text-input') accessor textInput: PkInputEl | null = null;
    @query('pk-checkbox') accessor newTabCheckbox: PkCheckboxEl | null = null;
    @query('.link-dialog__submit') accessor submitButton: PkButtonEl | null = null;

    static styles = css`
        :host {
            display: contents;
        }
        .link-dialog__fields {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
    `;

    async openForEditor(
        editor: Editor,
        seed: LinkDialogSeed,
        options?: { focus?: boolean },
    ): Promise<void> {
        await ensurePkDialog();
        this.#editor = editor;
        this.#seed = { ...seed };
        this.#focus = options?.focus ?? true;
        const updating = Boolean(seed.url.trim() || seed.semantic);
        this.dialogTitle = updating ? 'Update Link' : 'Insert Link';
        this.submitLabel = updating ? 'Update' : 'Insert';
        await this.updateComplete;
        this.#syncFields();
        await this.dialog?.updateComplete;
        await this.dialog?.show();
    }

    render() {
        return html`
            <pk-dialog
                class="link-dialog"
                size="wide"
                label=${this.dialogTitle}
                @pk-after-hide=${this.#onAfterHide}
                @keydown=${this.#onKeyDown}
            >
                <div class="link-dialog__fields">
                    <pk-field label="URL" required .for=${this.#urlInputId}>
                        <pk-input
                            id=${this.#urlInputId}
                            class="link-dialog__url-input"
                            type="url"
                            placeholder="https://"
                            autofocus
                            @input=${this.#onUrlInput}
                        ></pk-input>
                    </pk-field>
                    <pk-field label="Text" .for=${this.#textInputId}>
                        <pk-input
                            id=${this.#textInputId}
                            class="link-dialog__text-input"
                            type="text"
                        ></pk-input>
                    </pk-field>
                    <pk-checkbox>Open link in new tab</pk-checkbox>
                </div>
                <pk-button slot="footer" data-dialog-close>Cancel</pk-button>
                <pk-button
                    slot="footer"
                    class="link-dialog__submit"
                    variant="primary"
                    disabled
                    @click=${this.#onSubmit}
                >${this.submitLabel}</pk-button>
            </pk-dialog>
        `;
    }

    #syncFields(): void {
        if (this.urlInput) this.urlInput.value = this.#seed.url ?? '';
        if (this.textInput) this.textInput.value = this.#seed.text ?? '';
        if (this.newTabCheckbox) this.newTabCheckbox.checked = Boolean(this.#seed.openInNewTab);
        this.#updateSubmitState();
    }

    #updateSubmitState(): void {
        // Element picks may leave a display-only URL; semantic payload is enough to submit.
        const canSubmit = Boolean(this.urlInput?.value.trim() || this.#seed.semantic);
        if (this.submitButton) this.submitButton.disabled = !canSubmit;
    }

    #onUrlInput = (): void => {
        // Typing a URL replaces a pending element pick with a plain URL mark.
        this.#seed = { ...this.#seed, semantic: undefined };
        this.#updateSubmitState();
    };

    #onKeyDown = (event: KeyboardEvent): void => {
        if (event.key !== 'Enter') return;
        const path = event.composedPath();
        if (path.some((node) => node instanceof HTMLElement && node.localName === 'pk-checkbox')) return;
        if (path.some((node) => node instanceof HTMLElement && (
            node.localName === 'pk-button' || node instanceof HTMLButtonElement
        ))) return;
        event.preventDefault();
        event.stopPropagation();
        this.#onSubmit();
    };

    #onSubmit = (): void => {
        const editor = this.#editor;
        const url = this.urlInput?.value.trim() ?? '';
        if (!editor || (!url && !this.#seed.semantic)) return;

        const openInNewTab = Boolean(this.newTabCheckbox?.checked);
        const text = this.textInput?.value ?? '';
        const attrs: SemanticLinkAttrs = this.#seed.semantic
            ? { ...this.#seed.semantic, newWindow: openInNewTab }
            : attrsFromUrlDialog(url, openInNewTab);

        applySemanticLinkToEditor(editor, {
            attrs,
            text,
            from: this.#seed.from,
            to: this.#seed.to,
            focus: this.#focus,
        });

        void this.dialog?.hide('submit');
    };

    #onAfterHide = (): void => {
        this.#editor = null;
    };
}

/** Shared body-mounted dialog — one instance for all Vizy editors on the page. */
export async function openVizyLinkDialog(
    editor: Editor,
    seed: LinkDialogSeed,
    options?: { focus?: boolean },
): Promise<void> {
    await ensurePkDialog();
    if (!sharedDialog || !sharedDialog.isConnected) {
        sharedDialog = document.createElement('vizy-link-dialog') as VizyLinkDialogElement;
        document.body.append(sharedDialog);
        await sharedDialog.updateComplete;
    }
    await sharedDialog.openForEditor(editor, seed, options);
}

declare global {
    interface HTMLElementTagNameMap {
        'vizy-link-dialog': VizyLinkDialogElement;
    }
}
