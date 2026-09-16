import { LitElement, css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import type { Editor } from '@tiptap/core';
import '@verbb/plugin-kit-web/components/button/pk-button.js';
import '@verbb/plugin-kit-web/components/checkbox/pk-checkbox.js';
import '@verbb/plugin-kit-web/components/field/pk-field.js';
import '@verbb/plugin-kit-web/components/input/pk-input.js';
import '@verbb/plugin-kit-web/components/select';
import { ensurePkDialog } from '../pk-dialog';
import {
    applySemanticImageToEditor,
    attrsFromImageDialog,
    generateTransformUrl,
    IMAGE_SIZE_OPTIONS,
    type ImageDialogSeed,
} from './image-apply';
import type { ImageSize } from './attrs';

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
type PkSelectEl = HTMLElement & { value: string };

let sharedDialog: VizyImageDialogElement | null = null;

/**
 * Insert/Update Image dialog — Formie/Vizy 3 layout (preview + fields).
 * Persists semantic image attrs (`assetUid`); Craft transform is preview-only.
 */
@customElement('vizy-image-dialog')
export class VizyImageDialogElement extends LitElement {
    @property() accessor dialogTitle = 'Insert Image';
    @property() accessor submitLabel = 'Insert';

    #editor: Editor | null = null;
    #seed: ImageDialogSeed | null = null;
    #previewRequest = 0;
    #focus = true;
    #id = Math.random().toString(36).slice(2, 9);

    @query('pk-dialog') accessor dialog: PkDialogEl | null = null;
    @query('.image-dialog__alt') accessor altInput: PkInputEl | null = null;
    @query('.image-dialog__title') accessor titleInput: PkInputEl | null = null;
    @query('.image-dialog__url') accessor urlInput: PkInputEl | null = null;
    @query('pk-checkbox') accessor newTabCheckbox: PkCheckboxEl | null = null;
    @query('.image-dialog__size') accessor sizeSelect: PkSelectEl | null = null;
    @query('.image-dialog__transform') accessor transformSelect: PkSelectEl | null = null;
    @query('.image-dialog__preview-img') accessor previewImg: HTMLImageElement | null = null;

    /** Transform options from field bootstrap (handles). */
    @property({ attribute: false })
    accessor transforms: Array<{ handle: string; name: string }> = [];

    static styles = css`
        :host { display: contents; }
        /* ~800×500 — pk-dialog reads these custom props on the panel (inherit into shadow). */
        .image-dialog {
            --pk-dialog-width: 800px;
            --pk-dialog-max-width: 800px;
            --pk-dialog-height: 500px;
            --pk-dialog-max-height: min(500px, calc(100vh - 2rem));
        }
        .body {
            display: flex;
            gap: 0;
            box-sizing: border-box;
            height: 100%;
            min-height: 0;
        }
        .preview {
            box-sizing: border-box;
            width: 200px;
            flex: 0 0 200px;
            padding: 1rem;
        }
        .preview img {
            display: block;
            max-width: 200px;
            width: 100%;
            height: auto;
            border-radius: 3px;
        }
        .preview-empty {
            color: var(--pk-color-gray-500, #6b7280);
            font-size: 0.875rem;
        }
        .fields {
            flex: 1 1 auto;
            display: flex;
            flex-direction: column;
            gap: 0.85rem;
            padding: 1rem;
            min-width: 0;
            overflow: auto;
        }
        pk-select {
            display: block;
            width: 100%;
        }
    `;

    async openForEditor(
        editor: Editor,
        seed: ImageDialogSeed,
        options?: {
            focus?: boolean;
            transforms?: Array<{ handle: string; name: string }>;
        },
    ): Promise<void> {
        await ensurePkDialog();
        this.#editor = editor;
        this.#seed = { ...seed };
        this.#focus = options?.focus ?? true;
        if (options?.transforms) this.transforms = options.transforms;
        this.dialogTitle = seed.updating ? 'Edit Image' : 'Insert Image';
        this.submitLabel = seed.updating ? 'Update' : 'Insert';
        await this.updateComplete;
        this.#syncFields();
        await this.dialog?.updateComplete;
        await this.dialog?.show();
    }

    render() {
        return html`
            <pk-dialog
                class="image-dialog"
                size="wide"
                label=${this.dialogTitle}
                without-body-padding
                @pk-after-hide=${this.#onAfterHide}
            >
                <div class="body">
                    <div class="preview">
                        ${this.#seed?.previewUrl
                            ? html`<img class="image-dialog__preview-img" src=${this.#seed.previewUrl} alt="">`
                            : html`<p class="preview-empty">No preview</p>`}
                    </div>
                    <div class="fields">
                        <pk-field label="Alt Text" .for=${`vizy-img-alt-${this.#id}`}>
                            <pk-input id=${`vizy-img-alt-${this.#id}`} class="image-dialog__alt" type="text" autofocus></pk-input>
                        </pk-field>
                        <pk-field label="Title" .for=${`vizy-img-title-${this.#id}`}>
                            <pk-input id=${`vizy-img-title-${this.#id}`} class="image-dialog__title" type="text"></pk-input>
                        </pk-field>
                        <pk-field label="URL" .for=${`vizy-img-url-${this.#id}`}>
                            <pk-input id=${`vizy-img-url-${this.#id}`} class="image-dialog__url" type="url" placeholder="https://"></pk-input>
                        </pk-field>
                        <pk-checkbox>Open link in new tab</pk-checkbox>
                        <pk-field label="Size" .for=${`vizy-img-size-${this.#id}`}>
                            <pk-select
                                id=${`vizy-img-size-${this.#id}`}
                                class="image-dialog__size"
                                width="full"
                            >
                                ${IMAGE_SIZE_OPTIONS.map((opt) => html`
                                    <pk-option value=${opt.value} label=${opt.label}>${opt.label}</pk-option>
                                `)}
                            </pk-select>
                        </pk-field>
                        ${this.transforms.length > 0 ? html`
                            <pk-field label="Transform" .for=${`vizy-img-transform-${this.#id}`}>
                                <pk-select
                                    id=${`vizy-img-transform-${this.#id}`}
                                    class="image-dialog__transform"
                                    width="full"
                                    @pk-change=${this.#onTransformChange}
                                >
                                    <pk-option value="" label="No Transform">No Transform</pk-option>
                                    ${this.transforms.map((t) => html`
                                        <pk-option value=${t.handle} label=${t.name}>${t.name}</pk-option>
                                    `)}
                                </pk-select>
                            </pk-field>
                        ` : null}
                    </div>
                </div>
                <pk-button slot="footer" data-dialog-close>Cancel</pk-button>
                <pk-button
                    slot="footer"
                    variant="primary"
                    @click=${this.#onSubmit}
                >${this.submitLabel}</pk-button>
            </pk-dialog>
        `;
    }

    #syncFields(): void {
        const seed = this.#seed;
        if (!seed) return;
        if (this.altInput) this.altInput.value = seed.alt;
        if (this.titleInput) this.titleInput.value = seed.title;
        if (this.urlInput) this.urlInput.value = seed.linkUrl;
        if (this.newTabCheckbox) this.newTabCheckbox.checked = seed.openInNewTab;
        if (this.sizeSelect) this.sizeSelect.value = seed.size;
        if (this.transformSelect) this.transformSelect.value = seed.transform;
        if (this.previewImg && seed.previewUrl) this.previewImg.src = seed.previewUrl;
    }

    #onTransformChange = (): void => {
        const seed = this.#seed;
        if (!seed || !this.transformSelect) return;
        const handle = this.transformSelect.value;
        const request = ++this.#previewRequest;
        seed.transform = handle;
        void generateTransformUrl(seed.assetId, handle).then((url) => {
            // The dialog is shared across images; only its latest request may paint.
            if (!url || !this.isConnected || this.#seed !== seed || request !== this.#previewRequest) return;
            seed.previewUrl = url;
            if (this.previewImg) this.previewImg.src = url;
            this.requestUpdate();
        });
    };

    #onSubmit = (): void => {
        const editor = this.#editor;
        const seed = this.#seed;
        if (!editor || !seed) return;

        const next: ImageDialogSeed = {
            ...seed,
            alt: this.altInput?.value ?? '',
            title: this.titleInput?.value ?? '',
            linkUrl: this.urlInput?.value ?? '',
            openInNewTab: Boolean(this.newTabCheckbox?.checked),
            size: (this.sizeSelect?.value as ImageSize) || 'default',
            transform: this.transformSelect?.value ?? seed.transform,
        };

        applySemanticImageToEditor(editor, {
            attrs: attrsFromImageDialog(next),
            preview: {
                assetId: next.assetId,
                url: next.previewUrl,
                label: next.alt || next.title || 'Image',
                transform: next.transform,
            },
            focus: this.#focus,
            replaceSelection: next.updating,
        });

        void this.dialog?.hide('submit');
    };

    #onAfterHide = (): void => {
        this.#editor = null;
        this.#seed = null;
    };
}

export async function openVizyImageDialog(
    editor: Editor,
    seed: ImageDialogSeed,
    options?: {
        focus?: boolean;
        transforms?: Array<{ handle: string; name: string }>;
    },
): Promise<void> {
    await ensurePkDialog();
    if (!sharedDialog || !sharedDialog.isConnected) {
        sharedDialog = document.createElement('vizy-image-dialog') as VizyImageDialogElement;
        document.body.append(sharedDialog);
        await sharedDialog.updateComplete;
    }
    await sharedDialog.openForEditor(editor, seed, options);
}

declare global {
    interface HTMLElementTagNameMap {
        'vizy-image-dialog': VizyImageDialogElement;
    }
}
