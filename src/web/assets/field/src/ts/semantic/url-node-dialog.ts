import { LitElement, css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import type { Editor } from '@tiptap/core';
import { NodeSelection } from '@tiptap/pm/state';
import '@verbb/plugin-kit-web/components/button/pk-button.js';
import '@verbb/plugin-kit-web/components/field/pk-field.js';
import '@verbb/plugin-kit-web/components/input/pk-input.js';
import { ensurePkDialog } from '../pk-dialog';
import { normalizeHttpsUrl, resolveMediaEmbed } from './media-providers';

type PkDialogEl = HTMLElement & {
    show: () => Promise<void>;
    hide: (source?: string) => Promise<void>;
    updateComplete?: Promise<unknown>;
};
type PkInputEl = HTMLElement & { value: string };
type PkButtonEl = HTMLElement & { disabled: boolean };

export type UrlNodeKind = 'iframe' | 'mediaEmbed';

export type UrlNodeDialogSeed = {
    kind: UrlNodeKind;
    url: string;
    updating: boolean;
};

let sharedDialog: VizyUrlNodeDialogElement | null = null;

/**
 * Vizy 3 Insert/Update Media Embed / Iframe — single required URL field.
 */
@customElement('vizy-url-node-dialog')
export class VizyUrlNodeDialogElement extends LitElement {
    @property() accessor dialogTitle = 'Insert Media Embed';
    @property() accessor submitLabel = 'Insert';

    #editor: Editor | null = null;
    #seed: UrlNodeDialogSeed = { kind: 'mediaEmbed', url: '', updating: false };
    #focus = true;
    #urlId = `vizy-url-node-${Math.random().toString(36).slice(2, 9)}`;

    @query('pk-dialog') accessor dialog: PkDialogEl | null = null;
    @query('.url-node-dialog__url') accessor urlInput: PkInputEl | null = null;
    @query('.url-node-dialog__submit') accessor submitButton: PkButtonEl | null = null;

    static styles = css`
        :host { display: contents; }
        .fields {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
    `;

    async openForEditor(
        editor: Editor,
        seed: UrlNodeDialogSeed,
        options?: { focus?: boolean },
    ): Promise<void> {
        await ensurePkDialog();
        this.#editor = editor;
        this.#seed = { ...seed };
        this.#focus = options?.focus ?? true;
        const label = seed.kind === 'iframe' ? 'iFrame' : 'Media Embed';
        this.dialogTitle = seed.updating ? `Edit ${label}` : `Insert ${label}`;
        this.submitLabel = seed.updating ? 'Update' : 'Insert';
        await this.updateComplete;
        this.#syncFields();
        await this.dialog?.updateComplete;
        await this.dialog?.show();
    }

    render() {
        return html`
            <pk-dialog
                class="url-node-dialog"
                size="wide"
                label=${this.dialogTitle}
                @pk-after-hide=${this.#onAfterHide}
                @keydown=${this.#onKeyDown}
            >
                <div class="fields">
                    <pk-field label="URL" required .for=${this.#urlId}>
                        <pk-input
                            id=${this.#urlId}
                            class="url-node-dialog__url"
                            type="url"
                            placeholder="https://"
                            autofocus
                            @input=${this.#onUrlInput}
                        ></pk-input>
                    </pk-field>
                </div>
                <pk-button slot="footer" data-dialog-close>Cancel</pk-button>
                <pk-button
                    slot="footer"
                    class="url-node-dialog__submit"
                    variant="primary"
                    disabled
                    @click=${this.#onSubmit}
                >${this.submitLabel}</pk-button>
            </pk-dialog>
        `;
    }

    #syncFields(): void {
        if (this.urlInput) this.urlInput.value = this.#seed.url ?? '';
        this.#updateSubmitState();
    }

    #updateSubmitState(): void {
        const canSubmit = Boolean(normalizeHttpsUrl(this.urlInput?.value ?? ''));
        if (this.submitButton) this.submitButton.disabled = !canSubmit;
    }

    #onUrlInput = (): void => {
        this.#updateSubmitState();
    };

    #onKeyDown = (event: KeyboardEvent): void => {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        event.stopPropagation();
        this.#onSubmit();
    };

    #onSubmit = (): void => {
        const editor = this.#editor;
        const url = normalizeHttpsUrl(this.urlInput?.value ?? '');
        if (!editor || !url) return;

        const focus = this.#focus;
        const chain = focus ? editor.chain().focus() : editor.chain();
        const updating = this.#seed.updating && editor.isActive(this.#seed.kind);

        if (this.#seed.kind === 'iframe') {
            if (updating) {
                chain.updateAttributes('iframe', {
                    url,
                    frameborder: 0,
                    allowfullscreen: true,
                }).run();
            } else {
                chain.setVizyIframe({ url }).run();
            }
        } else {
            const resolved = resolveMediaEmbed(url);
            if (!resolved) return;
            const attrs = {
                url: resolved.url,
                data: resolved.html ? { html: resolved.html } : null,
            };
            if (updating) {
                chain.updateAttributes('mediaEmbed', attrs).run();
            } else {
                chain.setVizyMediaEmbed({ url: resolved.url }).run();
            }
        }

        void this.dialog?.hide('submit');
    };

    #onAfterHide = (): void => {
        this.#editor = null;
    };
}

export async function openVizyUrlNodeDialog(
    editor: Editor,
    seed: UrlNodeDialogSeed,
    options?: { focus?: boolean },
): Promise<void> {
    await ensurePkDialog();
    if (!sharedDialog || !sharedDialog.isConnected) {
        sharedDialog = document.createElement('vizy-url-node-dialog') as VizyUrlNodeDialogElement;
        document.body.append(sharedDialog);
        await sharedDialog.updateComplete;
    }
    await sharedDialog.openForEditor(editor, seed, options);
}

export function seedUrlNodeFromSelection(editor: Editor, kind: UrlNodeKind): UrlNodeDialogSeed | null {
    if (!editor.isActive(kind)) return null;
    const attrs = editor.getAttributes(kind) as { url?: string };
    return {
        kind,
        url: typeof attrs.url === 'string' ? attrs.url : '',
        updating: true,
    };
}

export function deleteSelectedUrlNode(editor: Editor, kind: UrlNodeKind, options?: { focus?: boolean }): void {
    const focus = options?.focus ?? true;
    const chain = focus ? editor.chain().focus() : editor.chain();
    const { selection } = editor.state;
    if (selection instanceof NodeSelection && selection.node.type.name === kind) {
        chain.deleteSelection().run();
        return;
    }
    if (editor.isActive(kind)) {
        const pos = selection.$from.before(selection.$from.depth);
        const node = editor.state.doc.nodeAt(pos);
        if (node?.type.name === kind) {
            chain.setNodeSelection(pos).deleteSelection().run();
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'vizy-url-node-dialog': VizyUrlNodeDialogElement;
    }
}
