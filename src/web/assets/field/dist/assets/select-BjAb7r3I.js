import{a as e,d as t,f as n,i as r,l as i,n as a,o,p as s,r as c,s as l,t as u}from"./decorate-R0X811qp-DTGsgM1e.js";import{a as d,i as f,o as p,s as ee}from"./block-type-icon-CYOpWznJ.js";import{l as m,o as h,s as te}from"./pk-tooltip-Cmmc0916-DiAah6v3.js";import{Ht as ne,Lt as g,M as _,Ut as v,Vt as y,Wt as re,a as ie,i as b}from"./unsafe-html-DhD_KFJk.js";import{t as ae}from"./has-slot-8BvCt_qo-HazXo5ZG.js";import{n as oe,o as x,r as se}from"./required-validator-CEg8dvjS-CQD5RH5r.js";import{a as ce,i as S,n as le,r as ue,t as C}from"./pk-spinner-DweuYJ_Z-BKBHTf_C.js";import{a as w,n as T,r as E,s as D,t as O}from"./popup-pointer-CuLjk1th-CqHViPDs.js";function k(e=`default`){return e===`xxs`||e===`xs`?`xxs`:e===`lg`||e===`xl`?`sm`:`xs`}function A(e=`default`,t){return t||(e===`primary`||e===`secondary`||e===`dashed`||e===`outline`||e===`transparent`?e:`default`)}var{I:j}=n,M=e=>e,N=e=>e.strings===void 0,P=()=>document.createComment(``),F=(e,t,n)=>{let r=e._$AA.parentNode,i=t===void 0?e._$AB:t._$AA;if(n===void 0)n=new j(r.insertBefore(P(),i),r.insertBefore(P(),i),e,e.options);else{let t=n._$AB.nextSibling,a=n._$AM,o=a!==e;if(o){let t;n._$AQ?.(e),n._$AM=e,n._$AP!==void 0&&(t=e._$AU)!==a._$AU&&n._$AP(t)}if(t!==i||o){let e=n._$AA;for(;e!==t;){let t=M(e).nextSibling;M(r).insertBefore(e,i),e=t}}}return n},I=(e,t,n=e)=>(e._$AI(t,n),e),L={},R=(e,t=L)=>e._$AH=t,z=e=>e._$AH,B=e=>{e._$AR(),e._$AA.remove()},V=[r,D,p(),d(`.button`),ee(),f(`.button`),s`
        @layer pk-component {
            :host {
                font-family: var(--pk-font-family);
                cursor: pointer;
                --pk-btn-height: var(--pk-btn-height-default);
                --pk-btn-font: var(--pk-btn-font-default);
                --pk-btn-padding-inline: var(--pk-btn-padding-inline-default);
                --pk-btn-icon-size: var(--pk-btn-icon-size-default);
                --pk-btn-icon-gap: var(--pk-btn-icon-gap-default);
                --pk-btn-caret-size: var(--pk-btn-caret-size-default);
                --pk-btn-radius: var(--pk-btn-radius-default);
                /*
                 * Slotted labels inherit from the host — pin the size-token font
                 * (and button line-height) so Craft CP / Tailwind hosts match.
                 */
                font-size: var(--pk-btn-font);
                line-height: 1.2;
            }

            :host([disabled]) {
                cursor: not-allowed;
                pointer-events: none;
            }

            :host([loading]):not([disabled]) {
                pointer-events: none;
            }

            .button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: var(--pk-btn-icon-gap);
                box-sizing: border-box;
                width: auto;
                margin: 0;
                /* Every button carries a 1px border (transparent for fill/plain variants) so the box
                 * model is identical across variants and states. Prevents width shift when swapping a
                 * button between filled and outline/dashed, or toggling states. Matches Bootstrap
                 * (transparent baseline) and  (border always present, only color changes).
                 */
                border: 1px solid transparent;
                border-radius: var(--pk-btn-radius);
                font: inherit;
                font-size: var(--pk-btn-font);
                font-weight: 400;
                line-height: 1.2;
                text-decoration: none;
                white-space: nowrap;
                /* Inherit host cursor so className/style (e.g. cursor-move) pierce shadow. */
                cursor: inherit;
                user-select: none;
                vertical-align: middle;
                appearance: none;
                background: var(--pk-btn-fill, var(--pk-action-fill));
                color: var(--pk-btn-on, var(--pk-action-on));
                height: var(--pk-btn-height);
                min-height: var(--pk-btn-height);
                /* Block padding defaults to 0 (height tokens center content). Override for nav rows. */
                padding-block: var(--pk-btn-padding-block, 0);
                padding-inline: var(--pk-btn-padding-inline);
                transition: background-color 0.12s ease, box-shadow 0.12s ease, color 0.12s ease;
            }

            .button:disabled {
                opacity: 0.5;
            }

            .icon-slot {
                display: none;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                line-height: 0;
            }

            .icon-slot--has-content {
                display: inline-flex;
            }

            /* Fixed token sizes for all icons (labeled or icon-only) — matches plugin-kit-react Button. */
            .icon-slot slot::slotted(svg),
            slot[name='start']::slotted(svg),
            slot[name='end']::slotted(svg) {
                display: block;
                width: var(--pk-btn-icon-size);
                height: var(--pk-btn-icon-size);
                flex-shrink: 0;
                pointer-events: none;
            }

            .icon-slot slot::slotted(img),
            slot[name='start']::slotted(img),
            slot[name='end']::slotted(img) {
                display: block;
                width: var(--pk-btn-icon-size);
                height: var(--pk-btn-icon-size);
                object-fit: contain;
                flex-shrink: 0;
                pointer-events: none;
            }

            /* pk-icon sizes itself from font-size (1em), so scale it to the
             * icon token. This keeps the idiomatic slotted pk-icon usage in
             * sync with raw slotted svg. Set width/height explicitly — %/size-full
             * collapses when the icon-slot has no definite box.
             */
            .icon-slot slot::slotted(pk-icon),
            slot[name='start']::slotted(pk-icon),
            slot[name='end']::slotted(pk-icon) {
                font-size: var(--pk-btn-icon-size);
                width: var(--pk-btn-icon-size);
                height: var(--pk-btn-icon-size);
                /* Kill pk-icon's text-baseline nudge (-0.125em) — flex slots center optically. */
                vertical-align: 0;
                flex-shrink: 0;
                pointer-events: none;
            }

            .label {
                display: inline-flex;
                align-items: center;
                min-width: 0;
                line-height: 1.2;
            }

            /* Trailing slot (status): grow + clip the label so end sits at the far edge
             * and long titles truncate instead of colliding with the indicator.
             */
            .button:has(.icon-slot--end.icon-slot--has-content) .label:not(.is-empty) {
                flex: 1 1 auto;
                overflow: hidden;
            }

            .label.is-empty {
                display: none;
            }

            /* Icon-only (no label): square hit box = size height. Button owns the target;
             * glyph size comes from --pk-btn-icon-size. Do not Tailwind-size the Icon.
             * Opt out with icon (compact), size=none, or group-trigger (narrow disclosure cap).
             */
            :host(:not([icon]):not([size='none']):not([group-trigger])) .button:not(.has-label) {
                width: var(--pk-btn-height);
                min-width: var(--pk-btn-height);
                padding-inline: 0;
            }

            /* Compact density (icon attr): padless box that hugs the glyph.
             * size still drives --pk-btn-icon-size; height/width tiers do not apply.
             * Use for dense x / ellipsis in cells — not for table action rows (prefer square above).
             * line-height: 0 collapses whitespace flex-struts so the glyph sits dead-center.
             */
            :host([icon]) {
                display: inline-flex;
                line-height: 0;
                vertical-align: middle;
            }

            :host([icon]) .button {
                display: flex;
                width: auto;
                min-width: 0;
                height: auto;
                min-height: 0;
                padding-inline: 0.25rem;
                padding-block: 0;
                line-height: 0;
                align-items: center;
                justify-content: center;
            }

            /* Keep label space while loading even before slotchange runs. */
            .button.loading .label.is-empty {
                display: inline-flex;
                visibility: hidden;
            }

            /* Sizes — token-driven scale (see tokens.css) */
            :host([size='xxs']) {
                --pk-btn-height: var(--pk-btn-height-xxs);
                --pk-btn-font: var(--pk-btn-font-xxs);
                --pk-btn-padding-inline: var(--pk-btn-padding-inline-xxs);
                --pk-btn-icon-size: var(--pk-btn-icon-size-xxs);
                --pk-btn-icon-gap: var(--pk-btn-icon-gap-xxs);
                --pk-btn-caret-size: var(--pk-btn-caret-size-xxs);
                --pk-btn-radius: var(--pk-btn-radius-xxs);
            }

            :host([size='xs']) {
                --pk-btn-height: var(--pk-btn-height-xs);
                --pk-btn-font: var(--pk-btn-font-xs);
                --pk-btn-padding-inline: var(--pk-btn-padding-inline-xs);
                --pk-btn-icon-size: var(--pk-btn-icon-size-xs);
                --pk-btn-icon-gap: var(--pk-btn-icon-gap-xs);
                --pk-btn-caret-size: var(--pk-btn-caret-size-xs);
                --pk-btn-radius: var(--pk-btn-radius-xs);
            }

            :host([size='sm']) {
                --pk-btn-height: var(--pk-btn-height-sm);
                --pk-btn-font: var(--pk-btn-font-sm);
                --pk-btn-padding-inline: var(--pk-btn-padding-inline-sm);
                --pk-btn-icon-size: var(--pk-btn-icon-size-sm);
                --pk-btn-icon-gap: var(--pk-btn-icon-gap-sm);
                --pk-btn-caret-size: var(--pk-btn-caret-size-sm);
                --pk-btn-radius: var(--pk-btn-radius-sm);
            }

            :host([size='default']) {
                --pk-btn-height: var(--pk-btn-height-default);
                --pk-btn-font: var(--pk-btn-font-default);
                --pk-btn-padding-inline: var(--pk-btn-padding-inline-default);
                --pk-btn-icon-size: var(--pk-btn-icon-size-default);
                --pk-btn-icon-gap: var(--pk-btn-icon-gap-default);
                --pk-btn-caret-size: var(--pk-btn-caret-size-default);
                --pk-btn-radius: var(--pk-btn-radius-default);
            }

            :host([size='lg']) {
                --pk-btn-height: var(--pk-btn-height-lg);
                --pk-btn-font: var(--pk-btn-font-lg);
                --pk-btn-padding-inline: var(--pk-btn-padding-inline-lg);
                --pk-btn-icon-size: var(--pk-btn-icon-size-lg);
                --pk-btn-icon-gap: var(--pk-btn-icon-gap-lg);
                --pk-btn-caret-size: var(--pk-btn-caret-size-lg);
                --pk-btn-radius: var(--pk-btn-radius-lg);
            }

            :host([size='xl']) {
                --pk-btn-height: var(--pk-btn-height-xl);
                --pk-btn-font: var(--pk-btn-font-xl);
                --pk-btn-padding-inline: var(--pk-btn-padding-inline-xl);
                --pk-btn-icon-size: var(--pk-btn-icon-size-xl);
                --pk-btn-icon-gap: var(--pk-btn-icon-gap-xl);
                --pk-btn-caret-size: var(--pk-btn-caret-size-xl);
                --pk-btn-radius: var(--pk-btn-radius-xl);
            }

            /* No preset scale — size to content or set --pk-btn-* on the host for one-off dimensions
             * (height, padding, font, icon, radius) without fighting a named size tier.
             * Pair with icon for a padless glyph host, or set --pk-btn-padding-inline / --pk-btn-height yourself.
             */
            :host([size='none']) {
                --pk-btn-height: auto;
                --pk-btn-font: inherit;
                --pk-btn-padding-inline: 0px;
                --pk-btn-padding-block: 0px;
                --pk-btn-icon-size: 1em;
                --pk-btn-icon-gap: 0px;
                --pk-btn-caret-size: 1em;
                --pk-btn-radius: 0px;
            }

            :host([size='none']) .button {
                height: auto;
                min-height: auto;
                width: 100%;
            }

            /* Variants */
            :host([variant='default']) {
                --pk-btn-fill: var(--pk-action-fill);
                --pk-btn-fill-hover: var(--pk-action-fill-hover);
                --pk-btn-fill-active: var(--pk-action-fill-active);
                --pk-btn-on: var(--pk-action-on);
            }

            :host([variant='primary']) {
                --pk-btn-fill: var(--pk-action-primary-fill);
                --pk-btn-fill-hover: var(--pk-action-primary-fill-hover);
                --pk-btn-fill-active: var(--pk-action-primary-fill-active);
                --pk-btn-on: var(--pk-action-primary-on);
            }

            :host([variant='primary']) .button,
            :host([variant='secondary']) .button {
                -moz-osx-font-smoothing: grayscale;
                -webkit-font-smoothing: antialiased;
            }

            :host([variant='secondary']) {
                --pk-btn-fill: var(--pk-color-gray-500);
                --pk-btn-fill-hover: var(--pk-color-gray-550);
                --pk-btn-fill-active: var(--pk-color-gray-600);
                --pk-btn-on: var(--pk-color-white);
            }

            :host([variant='outline']) .button {
                background: transparent;
                border-color: var(--pk-color-slate-400);
                color: var(--pk-color-gray-700);
            }

            :host([variant='transparent']) .button {
                background: transparent;
                color: var(--pk-color-gray-700);
            }

            /* link/none opt out of the shared transparent 1px border: they never render a border, so
             * carrying one only pads the box by 2px inline (and 2px block at size='none', where height
             * is auto). These are the "inline text" / "no chrome" variants — content-sized is the point,
             * and neither participates in button-group border joins. Other variants keep the stable box.
             */
            /*
             * Craft CP sets --link-color on :root (inherits into shadow). Prefer that,
             * then kit --pk-color-link — not sky-700 (reads as a different “CP blue”).
             * Color on :host so consumer utilities (e.g. text-[var(--link-color)]) can override.
             * Height must be content-sized — default --pk-btn-height (34px) bloated table rows.
             */
            :host([variant='link']) {
                color: var(--link-color, var(--pk-color-link));
                --pk-btn-height: auto;
                --pk-btn-padding-inline: 0;
                --pk-btn-padding-block: 0;
            }

            :host([variant='link']) .button {
                background: transparent;
                border-width: 0;
                border-radius: 0;
                color: inherit;
                width: auto;
                height: auto;
                min-height: 0;
                padding: 0;
                text-underline-offset: 2px;
            }

            :host([variant='dashed']) .button {
                background: transparent;
                border-style: dashed;
                border-color: var(--pk-color-slate-500);
                color: var(--pk-color-gray-700);
            }

            :host([variant='none']) .button {
                border-width: 0;
                border-radius: 0;
                background: transparent;
                color: inherit;
            }

            /* Interaction — pseudo-classes only; playground matrices use dev/pk-button-demo-states.css */
            .button:hover:not(:disabled) {
                background: var(--pk-btn-fill-hover, var(--pk-btn-fill));
            }

            :host([variant='outline']) .button:hover:not(:disabled),
            :host([variant='transparent']) .button:hover:not(:disabled),
            :host([variant='dashed']) .button:hover:not(:disabled) {
                background: var(--pk-color-slate-150);
            }

            :host([variant='link']) .button:hover:not(:disabled) {
                background: transparent;
                text-decoration: underline;
            }

            :host([variant='none']) .button:hover:not(:disabled) {
                background: transparent;
            }

            .button:active:not(:disabled) {
                background: var(--pk-btn-fill-active, var(--pk-btn-fill-hover, var(--pk-btn-fill)));
            }

            :host([variant='outline']) .button:active:not(:disabled),
            :host([variant='transparent']) .button:active:not(:disabled),
            :host([variant='dashed']) .button:active:not(:disabled) {
                background: var(--pk-color-slate-200);
            }

            :host([variant='link']) .button:active:not(:disabled),
            :host([variant='none']) .button:active:not(:disabled) {
                background: transparent;
            }

            .button:focus {
                outline: none;
            }

            .button:focus-visible {
                box-shadow: var(--pk-shadow-focus);
            }

            /* Bordered variants: fold the button's own border into the focus ring by recoloring it to
             * the accent (and solidifying dashed) so focus reads as one cohesive ring instead of a
             * doubled border. The ring is thinned to 1px here because the recolored 1px border already
             * supplies the other half — total 2px, matching the filled variants' ring weight.
             */
            :host([variant='outline']) .button:focus-visible,
            :host([variant='dashed']) .button:focus-visible {
                border-color: var(--pk-color-sky-600);
                box-shadow: 0 0 0 1px var(--pk-color-sky-600), 0 0 5px 1px hsl(from var(--pk-color-sky-600) h s l / 0.7);
            }

            :host([variant='dashed']) .button:focus-visible {
                border-style: solid;
            }

            :host(.pk-dialog__close) .button:focus-visible {
                box-shadow: 0 0 0 2px var(--pk-color-gray-600);
            }

            :host-context(pk-button-group) {
                position: relative;
            }

            :host-context(pk-button-group[orientation='vertical']) {
                display: block;
                width: 100%;
                max-width: 100%;
                box-sizing: border-box;
            }

            :host-context(pk-button-group[orientation='vertical']) .button {
                width: 100%;
                box-sizing: border-box;
            }

            :host-context(pk-button-group:focus-visible) {
                z-index: 2;
            }

            /* Bordered variants — matching border divider (filled uses margin gap via buttonGroupIndentStyles) */

            :host([variant='primary']) .button:focus-visible,
            :host([variant='secondary']) .button:focus-visible {
                box-shadow: var(--pk-shadow-focus-inset);
            }

            :host-context(pk-button-group[exclusive]):host([aria-pressed='true']) .button {
                background: var(--pk-color-gray-500);
                color: var(--pk-color-white);
            }

            :host-context(pk-button-group[exclusive]):host([aria-pressed='true']) .button:hover:not(:disabled) {
                background: var(--pk-color-gray-550);
            }

            :host-context(pk-button-group[exclusive]):host([aria-pressed='true']) .button:active:not(:disabled) {
                background: var(--pk-color-gray-600);
            }

            :host-context(pk-button-group[exclusive]):host([aria-pressed='true']) .button:focus-visible {
                box-shadow: var(--pk-shadow-focus);
            }

            :host([variant='link']) .button:focus-visible {
                box-shadow: none;
                text-decoration: underline;
            }

            .button.loading {
                position: relative;
                cursor: default;
                pointer-events: none;
            }

            .label.loading {
                visibility: hidden;
            }

            .button.loading .icon-slot,
            .button.loading slot[name='start']::slotted(*),
            .button.loading slot[name='end']::slotted(*) {
                visibility: hidden;
            }

            .button.caret .icon-slot--end.icon-slot--has-content {
                display: none;
            }

            /* Scope to the caret span — the button host also gets class caret when
               with-caret is set; an unscoped .caret rule was adding 2px margin
               to the whole button and shifting dropdown anchors left. */
            .button > .caret {
                display: inline-flex;
                align-self: center;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                line-height: 0;
                /* Sits slightly further from the label than the flex gap alone. */
                margin-inline-start: 2px;
            }

            /* Caret has its own per-size token (--pk-btn-caret-size), kept deliberately smaller than
             * --pk-btn-icon-size so it reads as a subordinate dropdown affordance next to real icons.
             */
            .button > .caret svg {
                display: block;
                width: var(--pk-btn-caret-size);
                height: var(--pk-btn-caret-size);
            }

            :host([group-trigger]) .button {
                padding-inline: 6px;
            }

            /* Compact disclosure cap — hide content, keep only the shared SVG caret (centered). */
            :host([group-trigger]) .label,
            :host([group-trigger]) .icon-slot {
                display: none;
            }

            :host([group-trigger]) .button > .caret {
                margin-inline-start: 0;
            }

            :host([size='sm'][group-trigger]) .button,
            :host([size='xs'][group-trigger]) .button,
            :host([size='xxs'][group-trigger]) .button {
                padding-inline: 6px;
            }

            :host([size='lg'][group-trigger]) .button {
                padding-inline: 10px;
            }

            :host([size='xl'][group-trigger]) .button {
                padding-inline: 12px;
            }

            :host-context(pk-button-group[orientation='horizontal']):host([data-pk-group-join]:not([data-pk-group-divider])[variant='outline']) .button,
            :host-context(pk-button-group[orientation='horizontal']):host([data-pk-group-join]:not([data-pk-group-divider])[variant='dashed']) .button,
            :host-context(pk-button-group[orientation='horizontal']):host([data-pk-group-join]:not([data-pk-group-divider])[variant='transparent']) .button {
                border-left-width: 0;
            }

            :host-context(pk-button-group[orientation='vertical']):host([data-pk-group-join]:not([data-pk-group-divider])[variant='outline']) .button,
            :host-context(pk-button-group[orientation='vertical']):host([data-pk-group-join]:not([data-pk-group-divider])[variant='dashed']) .button,
            :host-context(pk-button-group[orientation='vertical']):host([data-pk-group-join]:not([data-pk-group-divider])[variant='transparent']) .button {
                border-top-width: 0;
            }

            :host([data-pk-group-orientation='horizontal'][data-pk-group-join]:not([data-pk-group-divider])[variant='outline']) .button,
            :host([data-pk-group-orientation='horizontal'][data-pk-group-join]:not([data-pk-group-divider])[variant='dashed']) .button,
            :host([data-pk-group-orientation='horizontal'][data-pk-group-join]:not([data-pk-group-divider])[variant='transparent']) .button {
                border-left-width: 0;
            }

            :host([data-pk-group-orientation='vertical'][data-pk-group-join]:not([data-pk-group-divider])[variant='outline']) .button,
            :host([data-pk-group-orientation='vertical'][data-pk-group-join]:not([data-pk-group-divider])[variant='dashed']) .button,
            :host([data-pk-group-orientation='vertical'][data-pk-group-join]:not([data-pk-group-divider])[variant='transparent']) .button {
                border-top-width: 0;
            }

            :host([data-pk-group-orientation='horizontal'][data-pk-group-divider][variant='outline']) .button {
                box-shadow: none;
                border-left-width: 1px;
                border-left-style: solid;
                border-left-color: var(--pk-btn-group-divider-color-outline, var(--pk-color-slate-400));
            }

            :host([data-pk-group-orientation='vertical'][data-pk-group-divider][variant='outline']) .button {
                box-shadow: none;
                border-top-width: 1px;
                border-top-style: solid;
                border-top-color: var(--pk-btn-group-divider-color-outline, var(--pk-color-slate-400));
            }

            :host([data-pk-group-orientation='horizontal'][data-pk-group-divider][variant='dashed']) .button {
                box-shadow: none;
                border-left-width: 1px;
                border-left-style: dashed;
                border-left-color: var(--pk-btn-group-divider-color-dashed, var(--pk-color-slate-500));
            }

            :host([data-pk-group-orientation='vertical'][data-pk-group-divider][variant='dashed']) .button {
                box-shadow: none;
                border-top-width: 1px;
                border-top-style: dashed;
                border-top-color: var(--pk-btn-group-divider-color-dashed, var(--pk-color-slate-500));
            }

            :host([data-pk-group-orientation='horizontal'][data-pk-group-divider][variant='outline']) .button:focus-visible,
            :host([data-pk-group-orientation='horizontal'][data-pk-group-divider][variant='dashed']) .button:focus-visible {
                box-shadow: var(--pk-shadow-focus);
            }

            :host([data-pk-group-orientation='vertical'][data-pk-group-divider][variant='outline']) .button:focus-visible,
            :host([data-pk-group-orientation='vertical'][data-pk-group-divider][variant='dashed']) .button:focus-visible {
                box-shadow: var(--pk-shadow-focus);
            }

            :host([data-pk-group-orientation='horizontal'][data-pk-group-internal-trail][variant='outline']) .button,
            :host([data-pk-group-orientation='horizontal'][data-pk-group-internal-trail][variant='dashed']) .button {
                border-right-width: 0;
            }

            :host([data-pk-group-orientation='vertical'][data-pk-group-internal-trail][variant='outline']) .button,
            :host([data-pk-group-orientation='vertical'][data-pk-group-internal-trail][variant='dashed']) .button {
                border-bottom-width: 0;
            }
        }
    `],de=ie(_),H=class extends u{constructor(...e){super(...e),this.variant=`default`,this.size=`default`,this.disabled=!1,this.loading=!1,this.withCaret=!1,this.groupTrigger=!1,this.icon=!1,this.title=``,this.ariaLabel=null,this.type=`button`,this.hasDefaultSlotContent=!1,this.hasStartSlotContent=!1,this.hasEndSlotContent=!1,this.startSlotChanged=e=>{this.iconSlotChanged(e,`start`)},this.endSlotChanged=e=>{this.iconSlotChanged(e,`end`)},this.handleHostClick=e=>{if(this.disabled||this.loading||this.href||this.type!==`submit`&&this.type!==`reset`)return;let t=this.resolveAssociatedForm();if(t){if(e.preventDefault(),e.stopPropagation(),this.type===`reset`){t.reset();return}if(typeof t.requestSubmit==`function`){t.requestSubmit();return}t.dispatchEvent(new Event(`submit`,{bubbles:!0,cancelable:!0}))}}}static{this.shadowRootOptions={mode:`open`,delegatesFocus:!0}}static{this.styles=V}defaultSlotChanged(e){let t=e.target;this.hasDefaultSlotContent=t.assignedNodes({flatten:!0}).some(e=>e.nodeType===Node.TEXT_NODE?e.textContent?.trim():e.nodeType===Node.ELEMENT_NODE)}iconSlotChanged(e,t){let n=e.target.assignedNodes({flatten:!0}).some(e=>e.nodeType===Node.TEXT_NODE?e.textContent?.trim():e.nodeType===Node.ELEMENT_NODE);t===`start`?this.hasStartSlotContent=n:this.hasEndSlotContent=n}buttonClasses(){return g({button:!0,"has-label":this.hasDefaultSlotContent,loading:this.loading,caret:this.withCaret,"group-trigger":this.groupTrigger})}connectedCallback(){super.connectedCallback(),this.setAttribute(`data-slot`,`button`),this.addEventListener(`click`,this.handleHostClick)}disconnectedCallback(){this.removeEventListener(`click`,this.handleHostClick),super.disconnectedCallback()}resolveAssociatedForm(){let e=(this.form||this.getAttribute(`form`)||``).trim();if(e){let t=this.ownerDocument?.getElementById(e);if(t instanceof HTMLFormElement&&t.id!==`main`)return t}let t=this.closest(`form`);return t&&t.id!==`main`?t:null}render(){let e=this.spinnerSize||k(this.size),n=A(this.variant,this.spinnerVariant),r=!!this.href,a=this.ariaLabel||this.title||``;return t`
            ${r?t`
                    <a
                        part="base"
                        class=${this.buttonClasses()}
                        href=${this.href}
                        target=${this.target??i}
                        rel=${this.rel??i}
                        aria-label=${a||i}
                    >
                        ${this.renderInner(e,n)}
                    </a>
                `:t`
                    <button
                        part="base"
                        class=${this.buttonClasses()}
                        type=${this.type}
                        ?disabled=${this.disabled}
                        aria-disabled=${this.disabled?`true`:i}
                        aria-busy=${this.loading?`true`:i}
                        aria-label=${a||i}
                        name=${this.name??i}
                        value=${this.value??i}
                    >
                        ${this.renderInner(e,n)}
                    </button>
                `}
        `}renderInner(e,n){return t`
            <span
                class=${g({"icon-slot":!0,"icon-slot--start":!0,"icon-slot--has-content":this.hasStartSlotContent})}
            >
                <slot name="start" @slotchange=${this.startSlotChanged}></slot>
            </span>
            ${this.loading?t`
                    <pk-spinner
                        variant=${n}
                        size=${e}
                        tone=${this.spinnerTone??i}
                        centered
                    ></pk-spinner>
                `:i}
            <span
                class=${g({label:!0,"is-empty":!this.hasDefaultSlotContent,loading:this.loading})}
            >
                <slot @slotchange=${this.defaultSlotChanged}></slot>
            </span>
            <span
                class=${g({"icon-slot":!0,"icon-slot--end":!0,"icon-slot--has-content":this.hasEndSlotContent})}
            >
                <slot name="end" @slotchange=${this.endSlotChanged}></slot>
            </span>
            ${this.withCaret||this.groupTrigger?t`<span part="caret" class="caret">${S(de)}</span>`:i}
        `}};a([l({reflect:!0})],H.prototype,`variant`,void 0),a([l({reflect:!0})],H.prototype,`size`,void 0),a([l({type:Boolean,reflect:!0})],H.prototype,`disabled`,void 0),a([l({type:Boolean,reflect:!0})],H.prototype,`loading`,void 0),a([l({reflect:!0,attribute:`spinner-size`})],H.prototype,`spinnerSize`,void 0),a([l({reflect:!0,attribute:`spinner-variant`})],H.prototype,`spinnerVariant`,void 0),a([l({reflect:!0,attribute:`spinner-tone`})],H.prototype,`spinnerTone`,void 0),a([l({type:Boolean,reflect:!0,attribute:`with-caret`})],H.prototype,`withCaret`,void 0),a([l({type:Boolean,reflect:!0,attribute:`group-trigger`})],H.prototype,`groupTrigger`,void 0),a([l({type:Boolean,reflect:!0})],H.prototype,`icon`,void 0),a([l()],H.prototype,`href`,void 0),a([l()],H.prototype,`target`,void 0),a([l()],H.prototype,`rel`,void 0),a([l()],H.prototype,`name`,void 0),a([l()],H.prototype,`value`,void 0),a([l()],H.prototype,`title`,void 0),a([l({attribute:`aria-label`})],H.prototype,`ariaLabel`,void 0),a([l()],H.prototype,`type`,void 0),a([l({reflect:!0})],H.prototype,`form`,void 0),a([o()],H.prototype,`hasDefaultSlotContent`,void 0),a([o()],H.prototype,`hasStartSlotContent`,void 0),a([o()],H.prototype,`hasEndSlotContent`,void 0),H=a([c(`pk-button`)],H);var U=new Set([`ArrowDown`,`ArrowUp`,`ArrowLeft`,`ArrowRight`,`Home`,`End`,`Enter`,` `,`Escape`]);function W(e){return e.key.length===1&&!e.ctrlKey&&!e.metaKey&&!e.altKey}function G(e){return e.filter(e=>!e.hasAttribute(`disabled`)&&!e.hasAttribute(`hidden`)&&e.getAttribute(`aria-disabled`)!==`true`&&e.getAttribute(`aria-hidden`)!==`true`)}function K(e,t,n){if(n){n(t);return}let r=e[t];if(r instanceof HTMLElement&&`focusControl`in r&&typeof r.focusControl==`function`){r.focusControl();return}r?.focus()}function fe(e){if(!e)return;let t=e.shadowRoot?.querySelector(`.option`);if(t instanceof HTMLButtonElement){t.click();return}e.click()}function q(e,t){let n=G(t.items),r=t.loop===!0;if(n.length===0)return t.currentIndex;let i=Math.max(0,t.currentIndex),a=n[i]??n[0];switch(i=n.indexOf(a),i<0&&(i=0),e.key){case`ArrowDown`:case`ArrowRight`:return e.preventDefault(),i=r&&i>=n.length-1?0:Math.min(i+1,n.length-1),K(n,i,t.focusItem),t.onSelect(i),i;case`ArrowUp`:case`ArrowLeft`:return e.preventDefault(),i=r&&i<=0?n.length-1:Math.max(i-1,0),K(n,i,t.focusItem),t.onSelect(i),i;case`Home`:return e.preventDefault(),i=0,K(n,i,t.focusItem),t.onSelect(i),i;case`End`:return e.preventDefault(),i=n.length-1,K(n,i,t.focusItem),t.onSelect(i),i;case`Enter`:case` `:return t.multiselect||(e.preventDefault(),fe(n[i])),i;case`Escape`:return e.preventDefault(),t.onClose?.(),i;default:return i}}function J(e,t){let n=``,r=0,i=()=>{n=``,window.clearTimeout(r)};return{handleKey:a=>{if(a.key.length!==1||a.ctrlKey||a.metaKey||a.altKey)return;n+=a.key.toLowerCase(),window.clearTimeout(r),r=window.setTimeout(i,750);let o=G(e);for(let e=0;e<o.length;e+=1)if((o[e]?.textContent??``).trim().toLowerCase().startsWith(n)){t(e),a.preventDefault();return}},reset:i}}var Y=e=>e.hidden||e.hasAttribute(`data-pk-filter-empty`),X=e=>{let t=[...e.querySelectorAll(`:scope > pk-option, :scope > pk-option-group, :scope > pk-separator`)],n=(e,n)=>{for(let r=e+n;n<0?r>=0:r<t.length;r+=n){let e=t[r];if(!(!e||e.localName===`pk-separator`))return e}return null};for(let e=0;e<t.length;e+=1){let r=t[e];if(!r||r.localName!==`pk-separator`)continue;let i=n(e,-1),a=n(e,1);r.hidden=!i||!a||Y(i)||Y(a)}};function pe(e,t){let n=String(e??``),r=String(t??``).trim();if(!r)return[{text:n,match:!1}];let i=n.toLowerCase(),a=r.toLowerCase(),o=[],s=0,c=i.indexOf(a);for(;c!==-1;)c>s&&o.push({text:n.slice(s,c),match:!1}),o.push({text:n.slice(c,c+r.length),match:!0}),s=c+r.length,c=i.indexOf(a,s);return s<n.length&&o.push({text:n.slice(s),match:!1}),o.length>0?o:[{text:n,match:!1}]}var me=s`
    @layer pk-component {
        :host {
            display: block;
            /*
             * Slotted option labels inherit type metrics from this host (same
             * Craft-vs-Tailwind trap as pk-dropdown-item). Size tokens arrive via
             * pk-select ::slotted(pk-option) custom properties.
             */
            font-family: var(--pk-font-family);
            font-size: var(--pk-select-item-font-size, var(--pk-font-size-base));
            line-height: var(--pk-select-item-line-height, 1.4);
            color: var(--pk-color-gray-700);
        }

        .option {
            position: relative;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            width: 100%;
            margin: 0;
            min-height: var(--pk-select-item-min-height, var(--pk-input-height));
            padding-block: var(--pk-select-item-padding-block, 6px);
            padding-inline-start: var(--pk-select-item-padding-inline, 10px);
            padding-inline-end: var(--pk-select-item-padding-inline-end, 2rem);
            border: var(--pk-select-trigger-border-width, 1px) solid transparent;
            background: transparent;
            color: inherit;
            font: inherit;
            font-family: var(--pk-font-family);
            font-size: var(--pk-select-item-font-size, var(--pk-font-size-base));
            line-height: var(--pk-select-item-line-height, 1.4);
            text-align: left;
            white-space: nowrap;
            cursor: default;
            user-select: none;
            outline: none;
            box-sizing: border-box;
        }

        .start {
            display: none;
            flex: 0 0 auto;
            align-items: center;
        }

        :host([data-has-start]) .start {
            display: inline-flex;
        }

        :host([hidden]) {
            display: none !important;
        }

        .option:focus-visible,
        :host([highlighted]) .option {
            background: var(--pk-color-slate-100);
        }

        :host([disabled]) .option,
        .option[aria-disabled='true'] {
            pointer-events: none;
            opacity: 0.5;
        }

        .check {
            position: absolute;
            inset-inline-end: var(--pk-select-item-indicator-inset, 0.5rem);
            top: 50%;
            display: none;
            align-items: center;
            justify-content: center;
            width: var(--pk-select-item-indicator-size, 0.75rem);
            height: var(--pk-select-item-indicator-size, 0.75rem);
            color: var(--pk-color-gray-700);
            pointer-events: none;
            transform: translateY(-50%);
            line-height: 0;
        }

        :host([selected]) .check {
            display: inline-flex;
        }

        .check svg {
            display: block;
            width: var(--pk-select-item-indicator-size, 0.75rem);
            height: var(--pk-select-item-indicator-size, 0.75rem);
            flex-shrink: 0;
            pointer-events: none;
        }

        .label {
            flex: 1;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            /* Allow custom multi-line option layouts (title + subtitle) to stack. */
            white-space: normal;
        }

        .match {
            padding: 0;
            border-radius: 2px;
            background: var(--pk-color-blue-100);
            color: inherit;
        }
    }
`,he=b(x.check),Z=class extends u{constructor(...e){super(...e),this.value=``,this.label=``,this.disabled=!1,this.selected=!1,this.highlighted=!1,this.hidden=!1,this.focusIndex=-1,this.optionId=``,this.matchQuery=``}static{this.styles=me}focusControl(e=!0){this.shadowRoot?.querySelector(`.option`)?.focus({preventScroll:e})}getLabel(){if(this.label.trim())return this.label.trim();let e=this.shadowRoot?.querySelector(`slot:not([name])`);return e?e.assignedNodes().map(e=>(e.textContent??``).trim()).filter(Boolean).join(` `).trim():this.textContent?.trim()??this.value}getSearchText(){let e=this.shadowRoot?.querySelector(`slot:not([name])`);return e&&e.assignedNodes().map(e=>(e.textContent??``).trim()).filter(Boolean).join(` `).trim()||this.getLabel()}hasRichLabelContent(){return[...this.children].some(e=>e instanceof HTMLElement?!e.slot||e.slot===``:!1)}getStartElements(){return[...this.querySelectorAll(`:scope > [slot="start"]`)].filter(e=>e instanceof HTMLElement)}firstUpdated(){(this.shadowRoot?.querySelector(`slot[name="start"]`))?.addEventListener(`slotchange`,()=>this.syncStartDecoration()),this.syncStartDecoration()}syncStartDecoration(){this.toggleAttribute(`data-has-start`,this.getStartElements().length>0)}handleClick(){this.disabled||this.dispatchEvent(new CustomEvent(`pk-option-select`,{detail:{value:this.value},bubbles:!0,composed:!0}))}handleMouseEnter(){this.disabled||this.hidden||this.dispatchEvent(new CustomEvent(`pk-option-highlight`,{detail:{value:this.value},bubbles:!0,composed:!0}))}handleKeyDown(e){if(!new Set([`ArrowDown`,`ArrowUp`,`ArrowLeft`,`ArrowRight`,`Home`,`End`,`Enter`,` `,`Escape`]).has(e.key))return;let t=this.closest(`pk-select, pk-combobox, pk-autocomplete`),n=t?null:this.closest(`[role="listbox"]`);if(!t&&!n)return;e.preventDefault(),e.stopPropagation();let r=new CustomEvent(`pk-listbox-keydown`,{detail:{keyboardEvent:e},bubbles:!0});if(t){t.dispatchEvent(r);return}n.dispatchEvent(r)}renderLabel(){let e=this.matchQuery.trim();return!e||this.hasRichLabelContent()?t`
                <span part="label" class="label">
                    <slot></slot>
                </span>
            `:t`
            <span part="label" class="label">
                ${pe(this.getLabel(),e).map(e=>e.match?t`<mark class="match">${e.text}</mark>`:t`<span>${e.text}</span>`)}
            </span>
        `}render(){return t`
            <button
                part="option"
                type="button"
                class="option"
                role="option"
                id=${this.optionId||i}
                ?disabled=${this.disabled}
                aria-disabled=${this.disabled?`true`:i}
                aria-selected=${this.selected?`true`:`false`}
                tabindex=${this.focusIndex}
                @click=${this.handleClick}
                @mouseenter=${this.handleMouseEnter}
                @keydown=${this.handleKeyDown}
            >
                <span part="start" class="start">
                    <slot name="start"></slot>
                </span>
                ${this.renderLabel()}
                <span part="check" class="check" aria-hidden="true">${S(he)}</span>
            </button>
        `}};a([l()],Z.prototype,`value`,void 0),a([l()],Z.prototype,`label`,void 0),a([l({type:Boolean,reflect:!0})],Z.prototype,`disabled`,void 0),a([l({type:Boolean,reflect:!0})],Z.prototype,`selected`,void 0),a([l({type:Boolean,reflect:!0})],Z.prototype,`highlighted`,void 0),a([l({type:Boolean,reflect:!0})],Z.prototype,`hidden`,void 0),a([l({type:Number,attribute:`focus-index`})],Z.prototype,`focusIndex`,void 0),a([l()],Z.prototype,`optionId`,void 0),a([l({attribute:!1})],Z.prototype,`matchQuery`,void 0),Z=a([c(`pk-option`)],Z);var ge=[ce,s`
    ${D}
    @layer pk-component {
        :host {
            display: inline-block;
            position: relative;
            width: fit-content;
            max-width: 100%;
            align-self: flex-start;
            flex: none;
            color: var(--pk-color-gray-700);
            font-family: var(--pk-font-family);
            font-size: var(--pk-font-size-base);
            line-height: var(--pk-line-height);
            --pk-select-trigger-border-width: 1px;
            --pk-select-item-min-height: var(--pk-input-height);
            --pk-select-item-padding-block: 6px;
            --pk-select-item-padding-inline: 10px;
            --pk-select-item-padding-inline-end: 2rem;
            --pk-select-item-font-size: var(--pk-font-size-base);
            --pk-select-item-line-height: var(--pk-input-control-line-height, 1.25rem);
            --pk-select-item-indicator-size: 0.75rem;
            --pk-select-item-indicator-inset: 0.5rem;
            /* v1 SelectLabel default: text-xs → 12px */
            --pk-select-group-label-font-size: 12px;
            --pk-select-decoration-size: 0.875rem;
        }

        :host([width='full']) {
            display: block;
            width: 100%;
        }

        :host([width='full']) .control {
            width: 100%;
        }

        :host([width='full']) button.control .icon {
            margin-inline-start: auto;
        }

        .control {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            /* Fill the host when consumers set min-width/width on :host. */
            width: 100%;
            max-width: 100%;
            min-width: 0;
            margin: 0;
            padding: var(--pk-select-item-padding-block) var(--pk-select-item-padding-inline);
            border: var(--pk-select-trigger-border-width) solid transparent;
            border-radius: var(--pk-radius-lg);
            --pk-select-fill: var(--pk-color-slate-250);
            --pk-select-fill-hover: var(--pk-color-slate-300);
            background: var(--pk-select-fill);
            color: var(--pk-color-gray-700);
            font: inherit;
            font-size: var(--pk-select-item-font-size);
            line-height: var(--pk-input-control-line-height, 1.25rem);
            white-space: nowrap;
            cursor: pointer;
            outline: none;
            box-sizing: border-box;
            transition: border-color 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
        }

        button.control {
            appearance: none;
            -webkit-appearance: none;
            text-align: left;
            background-color: var(--pk-select-fill);
            border: var(--pk-select-trigger-border-width) solid transparent;
        }

        :host(:not([disabled])) .control:hover:not(.is-disabled):not(:disabled),
        :host(:not([disabled])) button.control:hover:not(.is-disabled):not(:disabled) {
            background: var(--pk-select-fill-hover);
        }

        :host(:not([disabled])) button.control:hover:not(.is-disabled):not(:disabled) {
            background-color: var(--pk-select-fill-hover);
        }

        :host(:not([invalid]):not(:state(user-invalid))) button.control:focus-visible,
        :host(:not([invalid]):not(:state(user-invalid))[data-state='focus-visible']) button.control {
            border-color: var(--pk-color-sky-600);
            box-shadow: var(--pk-input-focus-shadow);
        }

        .control.is-disabled {
            cursor: not-allowed;
            opacity: 0.5;
        }

        .trigger {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex: 0 0 auto;
            min-width: 0;
            padding: 0;
            border: 0;
            background: transparent;
            color: inherit;
            font: inherit;
            cursor: inherit;
            outline: none;
        }

        .control > .trigger:not(.trigger--icon) {
            flex: 0 1 auto;
            justify-content: flex-start;
        }

        .trigger--icon {
            width: 1.25rem;
        }

        .trigger-start {
            display: none;
            flex: 0 0 auto;
            align-items: center;
        }

        .trigger-start.has-decoration {
            display: inline-flex;
        }

        .control-start,
        .control-end {
            display: inline-flex;
            align-items: center;
            flex-shrink: 0;
            line-height: 0;
            color: var(--pk-color-gray-600);
        }

        slot[name='start']::slotted(svg),
        slot[name='end']::slotted(svg) {
            width: var(--pk-select-decoration-size);
            height: var(--pk-select-decoration-size);
        }

        .value {
            flex: 1 1 auto;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: left;
        }

        .icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            line-height: 0;
            pointer-events: none;
            color: var(--pk-color-gray-600);
        }

        /* Extra space before the expand chevron (control gap stays for start icon ↔ label). */
        .control > .icon,
        .control > .trigger--icon {
            margin-inline-start: 0.25rem;
        }

        .icon svg {
            display: block;
            width: 0.75rem;
            height: 0.75rem;
        }

        .tags {
            display: flex;
            flex: 0 1 auto;
            flex-wrap: wrap;
            gap: 0.25rem;
            min-width: 0;
        }

        .tag {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            max-width: 10ch;
            padding: 0.125rem 0.375rem;
            border-radius: var(--pk-radius-sm);
            background: var(--pk-color-gray-200);
            color: var(--pk-color-gray-800);
            font-size: 12px;
            line-height: 1.3;
        }

        .tag-label {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .tag-remove {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 0.875rem;
            height: 0.875rem;
            padding: 0;
            border: 0;
            border-radius: var(--pk-radius-sm);
            background: transparent;
            color: var(--pk-color-gray-600);
            cursor: pointer;
        }

        .tag-remove:hover {
            background: rgb(0 0 0 / 8%);
        }

        .clear-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 1.25rem;
            height: 1.25rem;
            padding: 0;
            border: 0;
            border-radius: var(--pk-radius-sm);
            background: transparent;
            color: var(--pk-color-gray-600);
            cursor: pointer;
            flex-shrink: 0;
        }

        .clear-button:hover {
            background: rgb(0 0 0 / 6%);
            color: var(--pk-color-gray-800);
        }

        .value-input {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }

        .panel ::slotted(pk-separator) {
            margin: 4px 0;
        }

        .panel {
            width: max-content;
            min-width: var(--pk-select-anchor-width, 8rem);
            max-height: 16rem;
            overflow: auto;
            padding: 0;
            border: 0;
            border-radius: var(--pk-radius-md);
            background: var(--pk-color-white);
            box-shadow: var(--pk-shadow-popup);
            color: var(--pk-color-gray-700);
            outline: none;
        }

        .panel[hidden] {
            display: none !important;
        }

        :host([invalid]) .control,
        :host(:state(user-invalid)) .control {
            border-color: var(--pk-color-rose-600);
        }

        :host([invalid]) button.control:focus-visible,
        :host([invalid][data-state='focus-visible']) button.control,
        :host(:state(user-invalid)) button.control:focus-visible,
        :host(:state(user-invalid)[data-state='focus-visible']) button.control {
            border-color: var(--pk-color-rose-600);
            box-shadow: var(--pk-input-invalid-focus-shadow);
        }

        :host([size='xs']) {
            --pk-select-item-min-height: 0;
            --pk-select-item-padding-block: 4px;
            --pk-select-item-padding-inline: 8px;
            --pk-select-item-padding-inline-end: 1.75rem;
            --pk-select-item-font-size: 11px;
            --pk-select-item-line-height: 1.25;
            /* v1 SelectLabel xs: text-[11px] */
            --pk-select-group-label-font-size: 11px;
            --pk-select-decoration-size: 0.625rem;
        }

        :host([size='xs']) .control {
            border-radius: var(--pk-radius-sm);
            /* Match trigger line-height to the compact item token (default is 1.25rem). */
            line-height: var(--pk-select-item-line-height, 1.25);
        }

        :host([size='xs']) .icon svg {
            width: 0.625rem;
            height: 0.625rem;
        }

        /* Options live in light DOM; ::slotted pushes size tokens onto each pk-option
         * host so the open listbox matches the trigger (inheritance alone is flaky when
         * the panel is promoted to the popover top layer). */
        :host([size='xs']) ::slotted(pk-option) {
            --pk-select-item-min-height: 0;
            --pk-select-item-padding-block: 4px;
            --pk-select-item-padding-inline: 8px;
            --pk-select-item-padding-inline-end: 1.75rem;
            --pk-select-item-font-size: 11px;
            --pk-select-item-line-height: 1.25;
            --pk-select-item-indicator-size: 0.625rem;
        }

        :host([size='xs']) .panel {
            max-height: 12rem;
        }

        /* Editable-table cells only (class set by pk-editable-table) — compact chip + menu. */
        :host(.cell-pk-control) {
            --pk-select-item-min-height: 0;
            --pk-select-item-padding-block: 5px;
            --pk-select-item-padding-inline: 8px;
            --pk-select-item-padding-inline-end: 1.5rem;
            --pk-select-item-font-size: 11px;
            --pk-select-item-line-height: 1.2;
            /* Compact table chip — match xs label size. */
            --pk-select-group-label-font-size: 11px;
            --pk-select-decoration-size: 0.625rem;
            --pk-select-item-indicator-size: 0.625rem;
        }

        :host(.cell-pk-control) .control {
            border-radius: var(--pk-radius-sm);
            line-height: var(--pk-select-item-line-height, 1.2);
        }

        :host(.cell-pk-control) ::slotted(pk-option) {
            --pk-select-item-min-height: 0;
            --pk-select-item-padding-block: 5px;
            --pk-select-item-padding-inline: 8px;
            --pk-select-item-padding-inline-end: 1.5rem;
            --pk-select-item-font-size: 11px;
            --pk-select-item-line-height: 1.2;
            --pk-select-item-indicator-size: 0.625rem;
        }

        :host(.cell-pk-control) .panel {
            max-height: 11rem;
        }

        :host([size='sm']) {
            --pk-select-item-min-height: 0;
            --pk-select-item-padding-block: 6px;
            --pk-select-item-padding-inline: 10px;
            --pk-select-item-padding-inline-end: 1.75rem;
            --pk-select-item-font-size: 12px;
            --pk-select-item-indicator-inset: 0.625rem;
            /* v1 SelectLabel sm: text-[12px] */
            --pk-select-group-label-font-size: 12px;
            --pk-select-decoration-size: 0.6875rem;
        }

        :host([size='sm']) .control {
            border-radius: var(--pk-radius-md);
        }

        :host([size='sm']) .icon svg {
            width: 0.6875rem;
            height: 0.6875rem;
        }

        :host([size='lg']) {
            --pk-select-item-padding-block: 8px;
            --pk-select-item-padding-inline: 12px;
            --pk-select-item-font-size: var(--pk-font-size-base);
            --pk-select-item-indicator-inset: 0.75rem;
            /* v1 SelectLabel lg: text-sm → 14px */
            --pk-select-group-label-font-size: 14px;
            --pk-select-decoration-size: 1rem;
        }

        :host([size='xl']) {
            --pk-select-item-padding-block: 10px;
            --pk-select-item-padding-inline: 14px;
            --pk-select-item-padding-inline-end: 2.25rem;
            --pk-select-item-font-size: var(--pk-font-size-base);
            --pk-select-item-indicator-inset: 0.875rem;
            /* v1 SelectLabel xl: text-base → 16px */
            --pk-select-group-label-font-size: 16px;
            --pk-select-decoration-size: 1.125rem;
        }

        :host([size='xl']) .icon svg {
            width: 0.875rem;
            height: 0.875rem;
        }
    }
`],_e=b(x.chevronDown),Q=class extends se{constructor(...e){super(...e),this.assumeInteractionOn=[`blur`,`input`],this.open=!1,this.multiple=!1,this.placement=`bottom-start`,this.sideOffset=4,this.clearable=!1,this.withClear=!1,this.invalid=!1,this.size=`default`,this.placeholder=``,this.value=``,this.defaultValue=``,this.values=[],this.defaultValues=[],this.ariaLabel=null,this.loopFocus=!1,this.hasSlotController=new ae(this,`start`,`end`),this.listboxId=m(`pk-select-listbox`),this.triggerId=m(`pk-select-trigger`),this.options=[],this.highlightedIndex=0,this.dismissRegistered=!1,this.panelEventTarget=null,this.typeToSelect=J([],()=>{}),this.closing=!1,this.panelAnimated=!1,this.handleOptionsMutation=(e={})=>{let t=this.getOptionElements(),n=t.length!==this.options.length||t.some((e,t)=>e!==this.options[t]);this.options=t,this.applySelection(),this.updateTypeToSelect(),e.render!==!1&&n&&this.requestUpdate()},this.syncOptions=()=>{this.handleOptionsMutation({render:!0})},this.togglePanel=e=>{e?.preventDefault(),e?.stopPropagation(),!(this.disabled||this.closing)&&(this.open?this.closePanel(`api`):this.openPanel())},this.onDocumentPointerDown=e=>{this.isPointerInside(e)||this.closePanel(`light-dismiss`)},this.onDocumentKeyDown=e=>{if(this.open){if(e.key===`Escape`){if(!C(this))return;e.preventDefault(),e.stopPropagation(),this.closePanel(`escape`);return}(U.has(e.key)||W(e))&&O(e,{anchor:this.getPopupAnchor(),panel:this.panelElement})&&(e.preventDefault(),e.stopPropagation(),this.onListboxKeyDown(e))}},this.handleOptionSelect=e=>{let{value:t}=e.detail;this.multiple?this.values=this.values.includes(t)?this.values.filter(e=>e!==t):[...this.values,t]:(this.value=t,this.closePanel(`api`)),this.applySelection(),this.emitValueChange()},this.handleOptionHighlight=e=>{if(!this.open)return;let t=this.getEnabledVisibleOptions().findIndex(t=>t.value===e.detail.value);t!==-1&&t!==this.highlightedIndex&&(this.highlightedIndex=t,this.syncHighlight())},this.onKeyDown=e=>{if(!this.open){(e.key===`ArrowDown`||e.key===`Enter`||e.key===` `)&&(e.preventDefault(),this.openPanel());return}this.onListboxKeyDown(e)},this.handleListboxKeyDownEvent=e=>{this.open&&this.onListboxKeyDown(e.detail.keyboardEvent)}}static{this.styles=ge}static get validators(){return[...super.validators,oe(),{observedAttributes:[`required`],checkValidity:e=>{let t=e,n={message:`Please select an item in the list.`,isValid:!0,invalidKeys:[]};return!t.required||!(t.multiple?t.values.length===0:!t.value)?n:(n.isValid=!1,n.invalidKeys.push(`valueMissing`),n)}}]}get panelElement(){return this.popupElement?.getContentElement()??null}connectedCallback(){this.refreshOptions(),super.connectedCallback(),this.addEventListener(`pk-listbox-keydown`,this.handleListboxKeyDownEvent),this.addEventListener(`keydown`,this.onKeyDown),this.optionsObserver=new MutationObserver(()=>{this.handleOptionsMutation({render:!0})}),this.optionsObserver.observe(this,{childList:!0,subtree:!0})}disconnectedCallback(){this.unbindPanelEvents(),this.removeEventListener(`pk-listbox-keydown`,this.handleListboxKeyDownEvent),this.removeEventListener(`keydown`,this.onKeyDown),this.optionsObserver?.disconnect(),this.closePanel(`api`),super.disconnectedCallback()}updated(e){(e.has(`value`)||e.has(`values`)||e.has(`multiple`))&&this.applySelection(),super.updated(e)}getOptionElements(){let e=this.popupElement?.getContentElement()?.querySelectorAll(`pk-option`);return e&&e.length>0?[...e]:[...this.querySelectorAll(`pk-option`)]}refreshOptions(){this.handleOptionsMutation({render:!1})}bindPanelEvents(){let e=this.panelElement;!e||e===this.panelEventTarget||(this.unbindPanelEvents(),this.panelEventTarget=e,e.addEventListener(`pk-option-select`,this.handleOptionSelect),e.addEventListener(`pk-option-highlight`,this.handleOptionHighlight),e.addEventListener(`pk-listbox-keydown`,this.handleListboxKeyDownEvent))}unbindPanelEvents(){this.panelEventTarget&&=(this.panelEventTarget.removeEventListener(`pk-option-select`,this.handleOptionSelect),this.panelEventTarget.removeEventListener(`pk-option-highlight`,this.handleOptionHighlight),this.panelEventTarget.removeEventListener(`pk-listbox-keydown`,this.handleListboxKeyDownEvent),null)}get validationTarget(){return this.input??this.triggerButton??this.controlElement}getAriaMirrorTarget(){return this.triggerButton??this.controlElement??null}syncFormValue(){if(!this.name){this.setFormValue(null);return}if(this.multiple){let e=new FormData;for(let t of this.values)e.append(this.name,t);this.setFormValue(e);return}this.setFormValue(this.value||``)}resetToDefaultValue(){this.multiple?this.values=[...this.defaultValues]:this.value=this.defaultValue,this.applySelection()}restoreFormState(e){if(e instanceof FormData&&this.name){this.values=e.getAll(this.name).map(String);return}typeof e==`string`&&(this.value=e)}isOptionInHiddenGroup(e){return!!e.closest(`pk-option-group`)?.hidden}getVisibleOptions(){return this.options.filter(e=>!this.isOptionInHiddenGroup(e))}getEnabledVisibleOptions(){return this.getVisibleOptions().filter(e=>!e.disabled)}isSelected(e){return this.multiple?this.values.includes(e):this.value===e}applySelection(){let e=this.getVisibleOptions();for(let t of this.options)t.selected=this.isSelected(t.value),t.hidden=!e.includes(t),t.optionId=`${this.listboxId}-option-${t.value}`;for(let e of this.querySelectorAll(`pk-option-group`)){let t=[...e.querySelectorAll(`pk-option`)];e.hidden=t.length>0&&t.every(e=>e.hidden)}X(this),this.syncValueInput(),this.syncTriggerDecorations(),this.open&&this.syncHighlight()}syncValueInput(){if(this.input){if(this.multiple){this.input.value=this.values.join(`,`),this.input.required=this.required;return}this.input.value=this.value,this.input.required=this.required}}getDisplayValue(){if(this.multiple){let e=this.getSelectedOptions().map(e=>e.getLabel());return e.length>0?e.join(`, `):this.placeholder}return this.options.find(e=>e.value===this.value)?.getLabel()||this.placeholder}getSelectedOptions(){return this.options.filter(e=>this.isSelected(e.value))}syncTriggerDecorations(){let e=this.triggerStartElement;if(!e||this.multiple)return;e.replaceChildren(),e.classList.remove(`has-decoration`);let t=this.options.find(e=>e.value===this.value);if(t){for(let n of t.getStartElements())e.append(n.cloneNode(!0));e.classList.toggle(`has-decoration`,e.childElementCount>0)}}hasSelection(){return this.multiple?this.values.length>0:this.options.some(e=>e.value===this.value)||!!this.value}syncHighlightedIndexToSelection(){if(this.multiple)return;let e=this.getEnabledVisibleOptions();if(e.length===0)return;let t=e.findIndex(e=>e.value===this.value);t>=0&&(this.highlightedIndex=t)}syncHighlight(){let e=this.getEnabledVisibleOptions();for(let e of this.options)e.highlighted=!1,e.focusIndex=-1;if(e.length===0){this.highlightedIndex=0;return}this.highlightedIndex>=e.length&&(this.highlightedIndex=0);let t=e[this.highlightedIndex];t&&this.panelElement&&(t.highlighted=!0,t.focusIndex=0,w(t,this.panelElement,`vertical`,`auto`))}updateTypeToSelect(){this.typeToSelect=J(this.getEnabledVisibleOptions(),e=>{this.highlightedIndex=e,this.syncHighlight(),this.getEnabledVisibleOptions()[e]?.focusControl()})}getPopupAnchor(){return this.controlElement??null}getActiveDescendantId(){return this.getEnabledVisibleOptions()[this.highlightedIndex]?.optionId||null}async show(){this.open||this.closing||this.disabled||await this.openPanel()}async hide(e=`api`){!this.open||this.closing||await this.closePanel(e)}openPanel(){let e=this.getPopupAnchor();if(!e||this.closing)return Promise.resolve();this.dispatchEvent(new re),this.closing=!1,this.panelAnimated=!1,this.open=!0,this.popupElement.active=!0,this.applySelection(),this.syncHighlightedIndexToSelection(),this.panelElement&&(this.panelElement.hidden=!1,h(this.panelElement,this.placement));let t=e.getBoundingClientRect().width;return this.style.setProperty(`--pk-select-anchor-width`,`${t}px`),this.registerDismissHandlers(),this.syncHighlight(),this.updateTypeToSelect(),this.updateComplete.then(async()=>{let e=await te(this.popupElement,this.placement,300,{requireEvent:!0});this.panelElement&&h(this.panelElement,e),this.panelAnimated=!0,this.bindPanelEvents(),this.refreshOptions(),this.getEnabledVisibleOptions()[this.highlightedIndex]?.focusControl(),this.dispatchEvent(new ne),this.dispatchEvent(new CustomEvent(`pk-open-change`,{detail:{open:!0},bubbles:!0,composed:!0}))})}async closePanel(e=`unknown`){if(!this.open||this.closing)return;let t=new v(e);this.dispatchEvent(t)&&(this.typeToSelect.reset(),this.unbindPanelEvents(),this.unregisterDismissHandlers(),this.closing=!0,this.panelAnimated=!1,await this.waitForExitAnimation(),this.open=!1,this.closing=!1,this.panelAnimated=!1,this.panelElement&&(this.panelElement.hidden=!0,this.panelElement.removeAttribute(`data-side`)),this.popupElement.active=!1,this.dispatchEvent(new y),this.dispatchEvent(new CustomEvent(`pk-open-change`,{detail:{open:!1},bubbles:!0,composed:!0})),this.shouldReturnFocusToTrigger(e)?this.triggerButton?.focus({preventScroll:!0}):this.triggerButton?.blur())}waitForExitAnimation(){let e=this.panelElement;return e?new Promise(t=>{let n=!1,r=()=>{n||(n=!0,e.removeEventListener(`animationend`,i),window.clearTimeout(a),e.classList.remove(`closing`),t())},i=t=>{t.target===e&&t.animationName.startsWith(`pk-popup-content-out`)&&r()};e.classList.add(`closing`),e.addEventListener(`animationend`,i);let a=window.setTimeout(r,150)}):Promise.resolve()}shouldReturnFocusToTrigger(e){return e!==`light-dismiss`&&e!==`pointer-dismiss`}registerDismissHandlers(){le(this),this.dismissRegistered=!0,document.addEventListener(`pointerdown`,this.onDocumentPointerDown,!0),document.addEventListener(`keydown`,this.onDocumentKeyDown,!0)}unregisterDismissHandlers(){this.dismissRegistered&&=(ue(this),!1),document.removeEventListener(`pointerdown`,this.onDocumentPointerDown,!0),document.removeEventListener(`keydown`,this.onDocumentKeyDown,!0)}isPointerInside(e){return T(e,{anchor:this.getPopupAnchor(),panel:this.panelElement})}removeTag(e,t){t.preventDefault(),t.stopPropagation(),this.values=this.values.filter(t=>t!==e),this.applySelection(),this.emitValueChange()}handleClear(e){e.preventDefault(),e.stopPropagation(),this.multiple?this.values=[]:this.value=``,this.applySelection(),this.dispatchEvent(new E),this.emitValueChange(),this.triggerButton?.focus()}emitValueChange(){this.dispatchEvent(new CustomEvent(`pk-change`,{detail:{value:this.multiple?[...this.values]:this.value},bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`input`,{bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0}))}onListboxKeyDown(e){let t=this.getEnabledVisibleOptions();this.highlightedIndex=q(e,{items:t,currentIndex:this.highlightedIndex,multiselect:this.multiple,loop:this.loopFocus,onSelect:e=>{this.highlightedIndex=e,this.syncHighlight()},focusItem:e=>{t[e]?.focusControl()},onClose:()=>{this.closePanel(`escape`)}}),e.key.length===1&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&this.typeToSelect.handleKey(e)}renderTags(){return this.getSelectedOptions().map(e=>t`
            <span class="tag" part="tag">
                <span class="tag-label">${e.getLabel()}</span>
                <button
                    type="button"
                    class="tag-remove"
                    part="tag-remove"
                    aria-label=${`Remove ${e.getLabel()}`}
                    @click=${t=>this.removeTag(e.value,t)}
                >
                    ×
                </button>
            </span>
        `)}renderChevronIcon(){return t`
            <span class="icon" aria-hidden="true">${S(_e)}</span>
        `}renderHostDecorationSlot(e){return this.hasSlotController.test(e)?t`
            <span part=${e} class=${e===`start`?`control-start`:`control-end`}>
                <slot name=${e}></slot>
            </span>
        `:t`<slot name=${e} hidden></slot>`}render(){let e=this.getDisplayValue(),n=!this.hasSelection(),r=(this.clearable||this.withClear)&&this.hasSelection()&&!this.disabled;return t`
            <input
                class="value-input"
                part="value-input"
                tabindex="-1"
                aria-hidden="true"
                .value=${this.multiple?this.values.join(`,`):this.value}
                ?required=${this.required}
                @input=${()=>this.updateValidity()}
            />
            ${this.multiple?t`
                    <div
                        part="control"
                        class=${g({control:!0,"is-disabled":this.disabled})}
                    >
                        ${this.renderHostDecorationSlot(`start`)}
                        ${this.hasSelection()?t`
                                <div class="tags" part="tags">${this.renderTags()}</div>
                                ${r?t`
                                        <button
                                            type="button"
                                            class="clear-button"
                                            part="clear-button"
                                            aria-label="Clear selection"
                                            @click=${this.handleClear}
                                        >
                                            ×
                                        </button>
                                    `:i}
                            `:t`
                                <button
                                    part="trigger"
                                    type="button"
                                    class="trigger"
                                    id=${this.triggerId}
                                    ?disabled=${this.disabled}
                                    aria-label=${this.ariaLabel??i}
                                    aria-haspopup="listbox"
                                    aria-expanded=${this.open?`true`:`false`}
                                    aria-controls=${this.listboxId}
                                    @click=${this.togglePanel}
                                >
                                    <span class="value is-placeholder">${this.placeholder}</span>
                                </button>
                            `}
                        ${this.renderHostDecorationSlot(`end`)}
                        <button
                            type="button"
                            class="trigger trigger--icon"
                            part="trigger expand-button"
                            aria-label="Toggle options"
                            ?disabled=${this.disabled}
                            @click=${this.togglePanel}
                        >
                            ${this.renderChevronIcon()}
                        </button>
                    </div>
                `:t`
                    <button
                        part="control"
                        type="button"
                        class=${g({control:!0,"is-disabled":this.disabled})}
                        id=${this.triggerId}
                        ?disabled=${this.disabled}
                        aria-label=${this.ariaLabel??i}
                        aria-haspopup="listbox"
                        aria-expanded=${this.open?`true`:`false`}
                        aria-controls=${this.listboxId}
                        @click=${this.togglePanel}
                    >
                        ${this.renderHostDecorationSlot(`start`)}
                        <span part="trigger-start" class="trigger-start"></span>
                        <span
                            class=${g({value:!0,"is-placeholder":n})}
                        >${e}</span>
                        ${r?t`
                                <span
                                    class="clear-button"
                                    part="clear-button"
                                    role="button"
                                    tabindex="-1"
                                    aria-label="Clear selection"
                                    @click=${this.handleClear}
                                >
                                    ×
                                </span>
                            `:i}
                        ${this.renderHostDecorationSlot(`end`)}
                        ${this.renderChevronIcon()}
                    </button>
                `}
            <pk-popup
                .anchor=${this.getPopupAnchor()??``}
                .placement=${this.placement}
                .distance=${this.sideOffset}
                .sync=${`width`}
                flip
                shift
            >
                <div
                    part="panel"
                    class=${g({panel:!0,"pk-popup-content":!0,closing:this.closing})}
                    id=${this.listboxId}
                    role="listbox"
                    aria-multiselectable=${this.multiple?`true`:`false`}
                    tabindex="-1"
                    ?hidden=${!this.open&&!this.closing}
                    data-open=${this.panelAnimated&&!this.closing?``:i}
                    @slotchange=${this.syncOptions}
                >
                    <slot></slot>
                </div>
            </pk-popup>
        `}};a([l({type:Boolean,reflect:!0})],Q.prototype,`open`,void 0),a([l({type:Boolean,reflect:!0})],Q.prototype,`multiple`,void 0),a([l({reflect:!0})],Q.prototype,`placement`,void 0),a([l({attribute:`side-offset`,type:Number})],Q.prototype,`sideOffset`,void 0),a([l({type:Boolean,reflect:!0})],Q.prototype,`clearable`,void 0),a([l({attribute:`with-clear`,type:Boolean})],Q.prototype,`withClear`,void 0),a([l({type:Boolean,reflect:!0})],Q.prototype,`invalid`,void 0),a([l({reflect:!0})],Q.prototype,`size`,void 0),a([l({reflect:!0})],Q.prototype,`width`,void 0),a([l()],Q.prototype,`placeholder`,void 0),a([l()],Q.prototype,`value`,void 0),a([l({attribute:`default-value`})],Q.prototype,`defaultValue`,void 0),a([l({type:Array,attribute:!1})],Q.prototype,`values`,void 0),a([l({attribute:!1})],Q.prototype,`defaultValues`,void 0),a([l({attribute:`aria-label`})],Q.prototype,`ariaLabel`,void 0),a([l({attribute:`loop-focus`,type:Boolean})],Q.prototype,`loopFocus`,void 0),a([e(`.trigger-start`)],Q.prototype,`triggerStartElement`,void 0),a([e(`pk-popup`)],Q.prototype,`popupElement`,void 0),a([e(`.control`)],Q.prototype,`controlElement`,void 0),a([e(`button.control, .control > button.trigger`)],Q.prototype,`triggerButton`,void 0),a([e(`.value-input`)],Q.prototype,`input`,void 0),a([o()],Q.prototype,`highlightedIndex`,void 0),a([o()],Q.prototype,`closing`,void 0),a([o()],Q.prototype,`panelAnimated`,void 0),Q=a([c(`pk-select`)],Q);var ve=s`
    @layer pk-component {
        :host {
            display: block;
        }

        /* Hard hex fallbacks: when groups portal outside pk-select, size-token
         * vars / theme tokens may be absent and invalid color inherits option black.
         * Weight/color match v1 ComboboxLabel / SelectLabel (text-slate-700, no font-medium). */
        .label {
            padding-block-start: var(--pk-select-group-label-padding-block-start, 8px);
            padding-block-end: var(--pk-select-group-label-padding-block-end, 2px);
            padding-inline: var(--pk-select-item-padding-inline, 10px);
            color: var(--pk-select-group-label-color, var(--pk-color-slate-700, rgba(96, 125, 159, 0.7)));
            font-family: var(--pk-font-family);
            /* Default matches v1 ComboboxLabel/SelectLabel text-xs (12px). */
            font-size: var(--pk-select-group-label-font-size, 12px);
            font-weight: 400;
            line-height: 1.3;
            /* Light-DOM ancestors (e.g. Formie empty dropzone text-center) must not center labels. */
            text-align: left;
            user-select: none;
            pointer-events: none;
        }

        :host([hidden]),
        :host([data-pk-filter-empty]) {
            display: none !important;
        }
    }
`,$=class extends u{constructor(...e){super(...e),this.label=``,this.hidden=!1,this.labelId=m(`pk-option-group-label`)}static{this.styles=ve}connectedCallback(){super.connectedCallback(),this.setAttribute(`role`,`group`),this.setAttribute(`aria-labelledby`,this.labelId)}render(){return t`
            <div part="label" class="label" id=${this.labelId}>${this.label}</div>
            <div role="presentation">
                <slot></slot>
            </div>
        `}};a([l({reflect:!0})],$.prototype,`label`,void 0),a([l({type:Boolean,reflect:!0})],$.prototype,`hidden`,void 0),$=a([c(`pk-option-group`)],$);export{z as a,N as c,X as i,I as l,q as n,B as o,W as r,R as s,U as t,F as u};
//# sourceMappingURL=select-BjAb7r3I.js.map