import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { LayoutPreset } from './presets';

type PkPopupVirtualElement = {
    getBoundingClientRect: () => DOMRect;
};

type PkPopupEl = HTMLElement & {
    active: boolean;
    placement: string;
    distance: number;
    flip: boolean;
    shift: boolean;
    positionMethod?: 'fixed' | 'absolute';
    anchor: Element | string | PkPopupVirtualElement;
};

@customElement('vizy-layout-preset-chooser')
export class VizyLayoutPresetChooserElement extends LitElement {
    @property({ attribute: false }) accessor presets: readonly LayoutPreset[] = [];

    static styles = css`
        /* Host is content-only — pk-popup owns placement and panel UI. */
        :host {
            display: block;
            min-width: 14rem;
            max-width: 22rem;
            padding: 0.5rem;
            background: var(--pk-color-white, #fff);
            border: 1px solid var(--vizy-border, #cdd8e4);
            border-radius: 6px;
            box-shadow: 0 4px 16px rgb(0 0 0 / 12%);
        }
        h3 {
            margin: 0 0 0.5rem;
            font-size: 0.75rem;
            font-weight: 600;
            color: var(--medium-text-color, #596673);
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 0.375rem;
        }
        button {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            align-items: stretch;
            border: 1px solid var(--vizy-border);
            border-radius: 4px;
            background: #fff;
            padding: 0.375rem;
            cursor: pointer;
            font: inherit;
            text-align: left;
        }
        button:focus-visible {
            outline: 2px solid var(--vizy-focus);
            outline-offset: 1px;
        }
        button:hover { background: var(--vizy-panel, #f3f7fc); }
        .label { font-size: 0.75rem; font-weight: 600; }
        .preview {
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            gap: 2px;
            min-height: 1.25rem;
        }
        .preview span {
            background: var(--gray-200, #d7d9db);
            border-radius: 2px;
            min-height: 1rem;
        }
    `;

    render() {
        return html`
            <h3>Choose layout</h3>
            <div class="grid" role="listbox" aria-label="Layout presets">
                ${this.presets.map((preset) => html`
                    <button
                        type="button"
                        role="option"
                        aria-label=${preset.accessibleLabel}
                        @mousedown=${(event: Event) => event.preventDefault()}
                        @click=${() => this.#select(preset.id)}
                    >
                        <span class="label">${preset.label}</span>
                        <span class="preview" aria-hidden="true">
                            ${preset.spans.map((span) => html`
                                <span style=${`grid-column: span ${span}`}></span>
                            `)}
                        </span>
                    </button>
                `)}
            </div>
        `;
    }

    #select(presetId: string): void {
        this.dispatchEvent(new CustomEvent('vizy-layout-preset-select', {
            bubbles: true,
            composed: true,
            detail: { presetId },
        }));
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'vizy-layout-preset-chooser': VizyLayoutPresetChooserElement;
    }
}

type PresetChooserSession = {
    popup: PkPopupEl;
    chooser: VizyLayoutPresetChooserElement;
    returnFocus: HTMLElement | null;
    onClose: () => void;
};

export class LayoutPresetChooser {
    #session: PresetChooserSession | null = null;
    #disposal: (() => void) | null = null;

    open(
        anchor: DOMRect,
        presets: readonly LayoutPreset[],
        _mount: HTMLElement,
        options: {
            returnFocus?: HTMLElement | null;
            onSelect: (presetId: string) => void;
            onClose?: () => void;
        },
    ): void {
        this.close();
        const chooser = document.createElement('vizy-layout-preset-chooser') as VizyLayoutPresetChooserElement;
        chooser.presets = presets;

        const popup = document.createElement('pk-popup') as PkPopupEl;
        popup.className = 'vizy-layout-preset-popup';
        popup.placement = 'bottom-start';
        popup.distance = 4;
        popup.flip = true;
        popup.shift = true;
        popup.positionMethod = 'fixed';
        popup.anchor = this.#virtualAnchor(anchor);
        popup.append(chooser);
        document.body.append(popup);

        const session: PresetChooserSession = {
            popup,
            chooser,
            returnFocus: options.returnFocus ?? null,
            onClose: options.onClose ?? (() => undefined),
        };
        this.#session = session;
        popup.active = true;

        let selected = false;
        const onSelect = (presetId: string): void => {
            selected = true;
            options.onSelect(presetId);
            this.close();
        };
        chooser.addEventListener('vizy-layout-preset-select', ((event: CustomEvent<{ presetId: string }>) => {
            onSelect(event.detail.presetId);
        }) as EventListener);

        const onKeyDown = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') {
                event.preventDefault();
                this.close();
            }
        };
        const onPointerDown = (event: PointerEvent): void => {
            const path = event.composedPath();
            if (path.includes(popup) || path.includes(chooser)) return;
            this.close();
        };
        document.addEventListener('keydown', onKeyDown, true);
        document.addEventListener('pointerdown', onPointerDown, true);
        this.#disposal = () => {
            document.removeEventListener('keydown', onKeyDown, true);
            document.removeEventListener('pointerdown', onPointerDown, true);
        };
        // Capture whether this close is after a pick so onClose does not race
        // the select Promise with resolve(false).
        session.onClose = () => {
            if (!selected) options.onClose?.();
        };
    }

    close(): void {
        this.#disposal?.();
        this.#disposal = null;
        const session = this.#session;
        this.#session = null;
        if (!session) return;
        session.popup.active = false;
        session.popup.remove();
        session.returnFocus?.focus();
        session.onClose();
    }

    get isOpen(): boolean {
        return this.#session !== null;
    }

    #virtualAnchor(rect: DOMRect): PkPopupVirtualElement {
        return {
            getBoundingClientRect: () => rect,
        };
    }
}
