import { LitElement, css, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import type { Editor } from '@tiptap/core';
import '@verbb/plugin-kit-web/components/button/pk-button.js';
import '@verbb/plugin-kit-web/components/checkbox/pk-checkbox.js';
import '@verbb/plugin-kit-web/components/field/pk-field.js';
import '@verbb/plugin-kit-web/components/input/pk-input.js';
import { ensurePkDialog } from '../pk-dialog';

type PkDialogEl = HTMLElement & {
    show: () => Promise<void>;
    hide: (source?: string) => Promise<void>;
};
type PkInputEl = HTMLElement & { value: string; focus: () => void };
type PkCheckboxEl = HTMLElement & { checked: boolean };
type FindStorage = {
    results: unknown[];
    currentIndex: number | null;
};

let sharedDialog: VizyFindReplaceDialogElement | null = null;
const t = (message: string): string => window.Craft?.t?.('vizy', message) ?? message;

/** Vizy-owned controls for TipTap's document-local Find and Replace extension. */
@customElement('vizy-find-replace-dialog')
export class VizyFindReplaceDialogElement extends LitElement {
    #editor: Editor | null = null;
    #transactionHandler = (): void => this.requestUpdate();

    @state() accessor hasSearch = false;
    @query('pk-dialog') accessor dialog: PkDialogEl | null = null;
    @query('[data-find]') accessor findInput: PkInputEl | null = null;
    @query('[data-replace]') accessor replaceInput: PkInputEl | null = null;
    @query('[data-case]') accessor caseCheckbox: PkCheckboxEl | null = null;
    @query('[data-word]') accessor wordCheckbox: PkCheckboxEl | null = null;
    @query('[data-regex]') accessor regexCheckbox: PkCheckboxEl | null = null;

    static styles = css`
        :host { display: contents; }
        .find-fields { display: grid; gap: 0.8rem; }
        .find-options { display: flex; flex-wrap: wrap; gap: 0.5rem 1rem; }
        .find-status { color: var(--gray-500, #6b7280); min-height: 1.4rem; }
        .find-actions { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    `;

    async openForEditor(editor: Editor): Promise<void> {
        await ensurePkDialog();
        this.#detachEditor();
        this.#editor = editor;
        this.#editor.on('transaction', this.#transactionHandler);
        this.hasSearch = false;
        await this.updateComplete;
        if (this.findInput) this.findInput.value = '';
        if (this.replaceInput) this.replaceInput.value = '';
        if (this.caseCheckbox) this.caseCheckbox.checked = false;
        if (this.wordCheckbox) this.wordCheckbox.checked = false;
        if (this.regexCheckbox) this.regexCheckbox.checked = false;
        editor.commands.clearSearch();
        editor.commands.setReplaceTerm('');
        editor.commands.setCaseSensitive(false);
        editor.commands.setWholeWord(false);
        editor.commands.setUseRegex(false);
        await this.dialog?.show();
        this.findInput?.focus();
    }

    render() {
        const { current, total } = this.#status();

        return html`
            <pk-dialog label=${t('Find and replace')} size="wide" @pk-after-hide=${this.#onAfterHide}>
                <div class="find-fields">
                    <pk-field label=${t('Find')}>
                        <pk-input data-find @input=${this.#onFind} @keydown=${this.#onFindKeydown}></pk-input>
                    </pk-field>
                    <pk-field label=${t('Replace with')}>
                        <pk-input data-replace @input=${this.#onReplace}></pk-input>
                    </pk-field>
                    <div class="find-options">
                        <pk-checkbox data-case @pk-change=${this.#onOptions}>${t('Match case')}</pk-checkbox>
                        <pk-checkbox data-word @pk-change=${this.#onOptions}>${t('Whole words')}</pk-checkbox>
                        <pk-checkbox data-regex @pk-change=${this.#onOptions}>${t('Regular expression')}</pk-checkbox>
                    </div>
                    <div class="find-status" aria-live="polite">
                        ${this.hasSearch ? (total ? t('{current} of {total}').replace('{current}', String(current)).replace('{total}', String(total)) : t('No matches.')) : ''}
                    </div>
                    <div class="find-actions">
                        <pk-button ?disabled=${!total} @click=${this.#previous}>${t('Previous')}</pk-button>
                        <pk-button ?disabled=${!total} @click=${this.#next}>${t('Next')}</pk-button>
                        <pk-button ?disabled=${!total} @click=${this.#replace}>${t('Replace')}</pk-button>
                        <pk-button ?disabled=${!total} @click=${this.#replaceAll}>${t('Replace all')}</pk-button>
                    </div>
                </div>
                <pk-button slot="footer" data-dialog-close>${t('Close')}</pk-button>
            </pk-dialog>
        `;
    }

    #storage(): FindStorage {
        return (this.#editor?.storage.findAndReplace ?? { results: [], currentIndex: null }) as FindStorage;
    }

    #status(): { current: number; total: number } {
        const storage = this.#storage();
        return {
            current: storage.results.length ? (storage.currentIndex ?? 0) + 1 : 0,
            total: storage.results.length,
        };
    }

    #onFind = (event: Event): void => {
        const value = (event.target as PkInputEl).value;
        this.hasSearch = value !== '';
        this.#editor?.commands.setSearchTerm(value);
        this.requestUpdate();
    };

    #onReplace = (event: Event): void => {
        this.#editor?.commands.setReplaceTerm((event.target as PkInputEl).value);
    };

    #onOptions = (): void => {
        const editor = this.#editor;
        if (!editor) return;
        editor.commands.setCaseSensitive(!!this.caseCheckbox?.checked);
        editor.commands.setWholeWord(!!this.wordCheckbox?.checked);
        editor.commands.setUseRegex(!!this.regexCheckbox?.checked);
    };

    #onFindKeydown = (event: KeyboardEvent): void => {
        if (event.key !== 'Enter' || event.isComposing) return;
        event.preventDefault();
        if (event.shiftKey) this.#previous();
        else this.#next();
    };

    #previous = (): void => { this.#editor?.commands.goToPreviousResult(); };
    #next = (): void => { this.#editor?.commands.goToNextResult(); };
    #replace = (): void => { this.#editor?.commands.replace(); };
    #replaceAll = (): void => { this.#editor?.commands.replaceAll(); };

    #onAfterHide = (event: Event): void => {
        if (event.target === this.dialog) this.#detachEditor();
    };

    #detachEditor(): void {
        if (!this.#editor) return;
        this.#editor.commands.clearSearch();
        this.#editor.off('transaction', this.#transactionHandler);
        this.#editor = null;
    }
}

export async function openFindReplaceDialogForEditor(editor: Editor): Promise<void> {
    await ensurePkDialog();

    if (!sharedDialog || !sharedDialog.isConnected) {
        sharedDialog = document.createElement('vizy-find-replace-dialog') as VizyFindReplaceDialogElement;
        document.body.append(sharedDialog);
        await sharedDialog.updateComplete;
    }
    await sharedDialog.openForEditor(editor);
}

declare global {
    interface HTMLElementTagNameMap {
        'vizy-find-replace-dialog': VizyFindReplaceDialogElement;
    }
}
