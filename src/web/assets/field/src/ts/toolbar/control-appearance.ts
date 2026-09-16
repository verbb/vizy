import { css, html, type TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import type { ToolbarControlManifest } from '../types';
import { MENU_CHEVRON_SVG } from '../../../../shared/menu-chevron';

/**
 * Vizy's toolbar: a flat, wrapping row of 32×32 icon buttons.
 *
 * Shared by the field toolbar (and nested Content Area strips) and the Bubble Menu
 * so colours, radius, and hover never drift. The bubble then scales the hit target
 * down — see `VizyBubbleElement`. The settings builder's toolbar preview mirrors this
 * 32×32 box in `editor-config-settings.css` (separate bundle; tests keep them in
 * step). Dropdown / Add Block triggers stay taller-square height but widen for the
 * chevron (`has-menu`). Colours use Plugin Kit's blue-tinted greys rather than a
 * neutral Craft gray.
 *
 * `box-sizing` is set explicitly because these styles live in a shadow root, where the
 * control panel's global `border-box` does not reach. Without it the transparent border
 * would push each button wider/taller than intended.
 */
export const controlAppearanceStyles = css`
    .vizy-control {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        padding: 0;
        margin: 0;
        border: 1px solid transparent;
        border-radius: 3px;
        background: transparent;
        color: var(--pk-color-gray-900, #1f2933);
        font: inherit;
        font-size: 16px;
        line-height: 1;
        cursor: pointer;
    }
    /* Icons are inline SVG from the bundled catalog, sized by font-size. */
    .vizy-control svg {
        display: block;
        width: 1em;
        height: 1em;
        fill: currentColor;
        overflow: visible;
    }
    /*
     * A text stand-in for a glyph, as the heading levels use. Sized down from the icon
     * font-size so two characters sit in the square as comfortably as an icon does.
     */
    .vizy-control .abbr {
        font-size: 0.8125rem;
        font-weight: 600;
        letter-spacing: -0.01em;
    }
    /* Only reached when a control has no mapped glyph and no stand-in. */
    .vizy-control.is-text {
        width: auto;
        padding: 0 0.5rem;
        font-size: 0.8125rem;
    }
    .vizy-control:hover,
    .vizy-control:focus-visible { background: var(--pk-color-gray-100, #e4edf6); }
    .vizy-control[aria-pressed='true'],
    .vizy-control[aria-expanded='true'] { background: var(--pk-color-slate-250, rgb(96 125 159 / 25%)); }
    .vizy-control:focus-visible {
        outline: 2px solid var(--vizy-focus);
        outline-offset: 1px;
    }
    .vizy-control:disabled {
        opacity: 0.4;
        cursor: default;
    }
    .vizy-separator {
        width: 1px;
        align-self: stretch;
        margin: 0.25rem 0.25rem;
        background: var(--vizy-border);
    }
    /*
 * Wider than a plain button: the chevron says the control opens (dropdown or
 * multi-type Add Block palette) rather than applying a mark/node in place.
 * Single-type Add Block stays a plain 32×32 + with no chevron. Drawn in CSS
 * rather than taken from the icon catalog so it cannot be confused with a
 * control's own glyph.
     */
    .vizy-control.has-menu {
        width: auto;
        min-width: 32px;
        gap: 4px;
        padding: 0 6px;
    }
    /* Plugin Kit chevron — visually distinct from a native select caret. */
    .vizy-control.has-menu .chevron {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        opacity: 0.6;
    }
    .vizy-control.has-menu .chevron svg {
        display: block;
        width: 0.625em;
        height: 0.625em;
        fill: currentColor;
        overflow: visible;
    }
`;

/**
 * A control's glyph: its icon, else the short stand-in it carries, else its label.
 *
 * `abbr` is what a heading-level button shows — "H3" reads as a glyph and fits the
 * square, while the accessible name stays "Heading 3".
 */
export function controlIcon(control: ToolbarControlManifest): TemplateResult | string {
    if (control.icon) return html`${unsafeHTML(control.icon)}`;
    if (control.abbr) return html`<span class="abbr">${control.abbr}</span>`;
    return control.label;
}

/** Chevron beside a dropdown trigger's main glyph. */
export function menuChevronIcon(): TemplateResult {
    return html`<span class="chevron" aria-hidden="true">${unsafeHTML(MENU_CHEVRON_SVG)}</span>`;
}

/**
 * Controls without a glyph must not render an unlabelled 32×32 square, so they
 * widen to show their text instead. One carrying an `abbr` keeps the square: the
 * stand-in was chosen to fit it.
 */
export function controlClass(control: ToolbarControlManifest, extra = ''): string {
    const text = !control.icon && !control.abbr;
    return ['vizy-control', text ? 'is-text' : '', extra].filter(Boolean).join(' ');
}
