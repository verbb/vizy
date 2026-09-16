import { LitElement, css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import '@verbb/plugin-kit-web/components/button/pk-button.js';
import '@verbb/plugin-kit-web/components/checkbox/pk-checkbox.js';
import '@verbb/plugin-kit-web/components/field/pk-field.js';
import '@verbb/plugin-kit-web/components/input/pk-input.js';
import '@verbb/plugin-kit-web/components/select';
import { ensurePkDialog } from '../pk-dialog';
import type { LinkDialogSeed } from './link-apply';
import {
    applySemanticLinkToEditor,
    attrsFromUrlDialog,
} from './link-apply';
import type { Editor } from '@tiptap/core';
import type { SemanticLinkAttrs } from './attrs';
import { isUuid } from './attrs';

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
const defaultSettings = ['text', 'newWindow', 'site', 'title', 'classes'];
const editorSettings = new WeakMap<Editor, readonly string[]>();

/** Every link entry point shares the owning editor's policy. */
export function setEditorLinkSettings(editor: Editor, settings?: readonly string[]): void {
    editorSettings.set(editor, settings ?? defaultSettings);
}

/**
 * Insert/Update Link dialog using the owning field's enabled settings.
 * Modeled on `pk-tiptap-editor`’s link dialog; applies Vizy semantic marks.
 */
@customElement('vizy-link-dialog')
export class VizyLinkDialogElement extends LitElement {
    @property() accessor dialogTitle = 'Insert Link';
    @property() accessor submitLabel = 'Insert';

    #editor: Editor | null = null;
    #seed: LinkDialogSeed = { url: '', text: '', openInNewTab: false };
    #focus = true;
    #settings: readonly string[] = defaultSettings;
    #urlChanged = false;
    #siteValue = '';
    #urlInputId = `vizy-link-url-${Math.random().toString(36).slice(2, 9)}`;
    #textInputId = `vizy-link-text-${Math.random().toString(36).slice(2, 9)}`;

    @query('pk-dialog') accessor dialog: PkDialogEl | null = null;
    @query('.link-dialog__url-input') accessor urlInput: PkInputEl | null = null;
    @query('.link-dialog__text-input') accessor textInput: PkInputEl | null = null;
    @query('.link-dialog__title-input') accessor titleInput: PkInputEl | null = null;
    @query('.link-dialog__classes-input') accessor classesInput: PkInputEl | null = null;
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
        this.#settings = editorSettings.get(editor) ?? defaultSettings;
        this.#urlChanged = false;
        const refSiteId = this.#reference(seed.url)?.[3];
        this.#siteValue = seed.semantic?.siteMode === 'fixed'
            ? seed.semantic.siteUid ?? ''
            : this.#sites().find((site) => String(site.id) === refSiteId)?.uid ?? '';
        const updating = Boolean(seed.url.trim() || seed.semantic);
        this.dialogTitle = updating ? 'Update Link' : 'Insert Link';
        this.submitLabel = updating ? 'Update' : 'Insert';
        this.requestUpdate();
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
                    ${this.#settings.includes('text') ? html`<pk-field label="Text" .for=${this.#textInputId}>
                        <pk-input
                            id=${this.#textInputId}
                            class="link-dialog__text-input"
                            type="text"
                        ></pk-input>
                    </pk-field>` : null}
                    ${this.#settings.includes('newWindow') ? html`<pk-checkbox>Open link in new tab</pk-checkbox>` : null}
                    ${this.#settings.includes('title') ? html`
                        <pk-field label="Title" .for=${`${this.#textInputId}-title`}>
                            <pk-input id=${`${this.#textInputId}-title`} class="link-dialog__title-input"></pk-input>
                        </pk-field>` : null}
                    ${this.#settings.includes('classes') ? html`
                        <pk-field label="Classes" .for=${`${this.#textInputId}-classes`}>
                            <pk-input id=${`${this.#textInputId}-classes`} class="link-dialog__classes-input"></pk-input>
                        </pk-field>` : null}
                    ${this.#showSite() ? html`
                        <pk-field label="Site" .for=${`${this.#textInputId}-site`}>
                            <pk-select id=${`${this.#textInputId}-site`} class="link-dialog__site" width="full"
                                .value=${this.#siteValue}
                                @pk-change=${(event: Event) => { this.#siteValue = (event.target as PkInputEl).value; }}>
                                <pk-option value="" label="Link to the current site">Link to the current site</pk-option>
                                ${this.#sites().map((site) => html`<pk-option value=${site.uid} label=${site.name ?? ''}>${site.name}</pk-option>`)}
                            </pk-select>
                        </pk-field>` : null}
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
        if (this.titleInput) this.titleInput.value = this.#seed.semantic?.title ?? '';
        if (this.classesInput) this.classesInput.value = this.#seed.semantic?.class ?? '';
        this.#updateSubmitState();
    }

    #updateSubmitState(): void {
        // Element picks may leave a display-only URL; semantic payload is enough to submit.
        const canSubmit = Boolean(this.urlInput?.value.trim() || (!this.#urlChanged && this.#seed.semantic));
        if (this.submitButton) this.submitButton.disabled = !canSubmit;
    }

    #onUrlInput = (): void => {
        // Typing a URL replaces a pending element pick with a plain URL mark.
        this.#urlChanged = true;
        const refSiteId = this.#reference(this.urlInput?.value ?? '')?.[3];
        this.#siteValue = this.#sites().find((site) => String(site.id) === refSiteId)?.uid ?? '';
        this.requestUpdate();
        this.#updateSubmitState();
    };

    #onKeyDown = (event: KeyboardEvent): void => {
        if (event.key !== 'Enter') return;
        const path = event.composedPath();
        if (path.some((node) => node instanceof HTMLElement && ['pk-checkbox', 'pk-select'].includes(node.localName))) return;
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
        if (!editor || (!url && (this.#urlChanged || !this.#seed.semantic))) return;

        const openInNewTab = this.newTabCheckbox?.checked ?? this.#seed.openInNewTab;
        const text = this.textInput?.value ?? this.#seed.text;
        const attrs: SemanticLinkAttrs = this.#seed.semantic && !this.#urlChanged
            ? { ...this.#seed.semantic, newWindow: openInNewTab }
            : attrsFromUrlDialog(url, openInNewTab);
        if (this.#urlChanged && this.#seed.semantic) {
            const { title, class: classes, ariaLabel, rel, id, download, linkUid } = this.#seed.semantic;
            Object.assign(attrs, { title, class: classes, ariaLabel, rel, id, download, linkUid });
        }
        if (this.titleInput) attrs.title = this.titleInput.value.trim() || null;
        if (this.classesInput) attrs.class = this.classesInput.value.trim() || null;
        if (this.#showSite()) {
            attrs.siteMode = this.#siteValue ? 'fixed' : 'current';
            attrs.siteUid = this.#siteValue || null;
            // Fallback picker URLs carry a numeric site suffix. The explicit
            // semantic site policy now owns that choice, including current-site links.
            if (attrs.type === 'url' && attrs.value) {
                attrs.value = attrs.value.replace(/((?:#|%23)(?:entry|asset|category):\d+)(?:@\d+)?$/, '$1');
            }
        }

        applySemanticLinkToEditor(editor, {
            attrs,
            text,
            from: this.#seed.from,
            to: this.#seed.to,
            focus: this.#focus,
        });

        void this.dialog?.hide('submit');
    };

    #onAfterHide = (event: Event): void => {
        if (event.target === this.dialog) this.#editor = null;
    };

    #sites() {
        return (window.Craft?.sites ?? []).filter((site): site is { id: number; uid: string; name?: string } => (
            typeof site.id === 'number' && typeof site.uid === 'string' && isUuid(site.uid)
        ));
    }

    #reference(url: string): RegExpMatchArray | null {
        return url.match(/(?:#|%23)(entry|asset|category):(\d+)(?:@(\d+))?$/);
    }

    #showSite(): boolean {
        const type = this.#urlChanged ? null : this.#seed.semantic?.type;
        const url = this.#urlChanged ? this.urlInput?.value ?? '' : this.#seed.url;
        return this.#settings.includes('site') && this.#sites().length > 1
            && (Boolean(type && ['entry', 'asset', 'category'].includes(type)) || this.#reference(url) !== null);
    }
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
