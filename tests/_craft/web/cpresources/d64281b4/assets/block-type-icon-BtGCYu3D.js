import{_ as e,a as t,c as n,d as r,h as i,l as a,n as o,o as s,p as c,s as l,u as ee,v as u}from"./class-map-Ba3saTy9.js";import{Bt as d,Lt as f,P as p,Rt as m,Vt as h,a as g,d as te,f as ne,i as _,j as v,s as y,t as b,zt as x}from"./unsafe-html-CokSp8NY.js";import{c as S,s as C,t as w}from"./pk-popup-B9AgBC2V-CAICLNc5.js";function*T(e=document.activeElement){e!=null&&(yield e,`shadowRoot`in e&&e.shadowRoot&&e.shadowRoot.mode!==`closed`&&(yield*T(e.shadowRoot.activeElement)))}var E=e`
    @layer pk-component {
        .pk-popup-content {
            transform-origin: var(--pk-transform-origin, top);
        }

        .pk-popup-content[data-open] {
            animation: pk-popup-content-in 100ms ease-out;
        }

        .pk-popup-content[data-open][data-side='bottom'] {
            animation-name: pk-popup-content-in-bottom;
        }

        .pk-popup-content[data-open][data-side='top'] {
            animation-name: pk-popup-content-in-top;
        }

        .pk-popup-content[data-open][data-side='left'] {
            animation-name: pk-popup-content-in-left;
        }

        .pk-popup-content[data-open][data-side='right'] {
            animation-name: pk-popup-content-in-right;
        }

        /* Exit: fade + zoom only — matches tw-animate animate-out / tooltip motion. */
        .pk-popup-content.closing {
            animation: pk-popup-content-out 100ms ease-in forwards;
        }
    }

    @keyframes pk-popup-content-in {
        from {
            opacity: 0;
            transform: scale(0.95);
        }

        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    @keyframes pk-popup-content-out {
        from {
            opacity: 1;
            transform: scale(1);
        }

        to {
            opacity: 0;
            transform: scale(0.95);
        }
    }

    @keyframes pk-popup-content-in-bottom {
        from {
            opacity: 0;
            transform: scale(0.95) translateY(-0.5rem);
        }

        to {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }

    @keyframes pk-popup-content-in-top {
        from {
            opacity: 0;
            transform: scale(0.95) translateY(0.5rem);
        }

        to {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }

    @keyframes pk-popup-content-in-left {
        from {
            opacity: 0;
            transform: scale(0.95) translateX(0.5rem);
        }

        to {
            opacity: 1;
            transform: scale(1) translateX(0);
        }
    }

    @keyframes pk-popup-content-in-right {
        from {
            opacity: 0;
            transform: scale(0.95) translateX(-0.5rem);
        }

        to {
            opacity: 1;
            transform: scale(1) translateX(0);
        }
    }
`,D=class extends b{};D.directiveName=`unsafeSVG`,D.resultType=2;var O=o(D),k={default:e`
        --pk-dropdown-item-padding-block: 8px;
        --pk-dropdown-item-padding-inline: 12px;
        --pk-dropdown-item-gap: 0.625rem;
        --pk-dropdown-item-font-size: var(--pk-font-size-base);
        --pk-dropdown-item-line-height: 1.5;
        --pk-dropdown-item-icon-size: 12px;
        --pk-dropdown-label-padding-inline: 12px;
        --pk-dropdown-label-font-size: 13px;
        --pk-dropdown-details-font-size: var(--pk-font-size-sm);
    `,xs:e`
        --pk-dropdown-item-padding-block: 3px;
        --pk-dropdown-item-padding-inline: 8px;
        --pk-dropdown-item-gap: 0.375rem;
        --pk-dropdown-item-font-size: 12px;
        --pk-dropdown-item-line-height: 1.5;
        --pk-dropdown-item-icon-size: 10px;
        --pk-dropdown-label-padding-inline: 8px;
        --pk-dropdown-label-font-size: 11px;
        --pk-dropdown-details-font-size: 11px;
    `,sm:e`
        --pk-dropdown-item-padding-block: 4px;
        --pk-dropdown-item-padding-inline: 10px;
        --pk-dropdown-item-gap: 0.4375rem;
        --pk-dropdown-item-font-size: 13px;
        --pk-dropdown-item-line-height: 1.5;
        --pk-dropdown-item-icon-size: 12px;
        --pk-dropdown-label-padding-inline: 10px;
        --pk-dropdown-label-font-size: 11px;
        --pk-dropdown-details-font-size: 12px;
    `,lg:e`
        --pk-dropdown-item-padding-block: 10px;
        --pk-dropdown-item-padding-inline: 14px;
        --pk-dropdown-item-gap: 0.75rem;
        --pk-dropdown-item-font-size: 16px;
        --pk-dropdown-item-line-height: 1.5;
        --pk-dropdown-item-icon-size: 14px;
        --pk-dropdown-label-padding-inline: 14px;
        --pk-dropdown-label-font-size: 14px;
        --pk-dropdown-details-font-size: var(--pk-font-size-sm);
    `,xl:e`
        --pk-dropdown-item-padding-block: 12px;
        --pk-dropdown-item-padding-inline: 16px;
        --pk-dropdown-item-gap: 0.75rem;
        --pk-dropdown-item-font-size: 18px;
        --pk-dropdown-item-line-height: 1.5;
        --pk-dropdown-item-icon-size: 16px;
        --pk-dropdown-label-padding-inline: 16px;
        --pk-dropdown-label-font-size: 15px;
        --pk-dropdown-details-font-size: var(--pk-font-size-base);
    `},A=e`
    @layer pk-component {
        :host {
            ${k.default}
        }

        :host([size='xs']) {
            ${k.xs}
        }

        :host([size='sm']) {
            ${k.sm}
        }

        :host([size='lg']) {
            ${k.lg}
        }

        :host([size='xl']) {
            ${k.xl}
        }
    }
`,j=e`
    @layer pk-component {
        .panel[data-size='default'],
        .submenu-panel[data-size='default'] {
            ${k.default}
        }

        .panel[data-size='xs'],
        .submenu-panel[data-size='xs'] {
            ${k.xs}
        }

        .panel[data-size='sm'],
        .submenu-panel[data-size='sm'] {
            ${k.sm}
        }

        .panel[data-size='lg'],
        .submenu-panel[data-size='lg'] {
            ${k.lg}
        }

        .panel[data-size='xl'],
        .submenu-panel[data-size='xl'] {
            ${k.xl}
        }
    }
`;e`
    ${A}
    ${j}
`;var re=[E,j,e`
    @layer pk-component {
        :host {
            display: block;
            position: relative;
            /*
             * Slotted label text inherits from this host (light DOM), not from
             * shadow .item — pin size-token metrics so Craft CP / Tailwind /
             * bare hosts all get the same item rhythm.
             */
            font-size: var(--pk-dropdown-item-font-size, var(--pk-font-size-base));
            line-height: var(--pk-dropdown-item-line-height, 1.5);
            color: var(--text-color, var(--pk-color-gray-700));
        }

        .item {
            display: flex;
            align-items: center;
            gap: var(--pk-dropdown-item-gap, 0.625rem);
            width: 100%;
            margin: 0;
            padding: var(--pk-dropdown-item-padding-block, 8px) var(--pk-dropdown-item-padding-inline, 12px);
            border: 0;
            background: transparent;
            color: inherit;
            font: inherit;
            font-size: var(--pk-dropdown-item-font-size, var(--pk-font-size-base));
            /* Explicit — do not let font:inherit re-leak page line-height. */
            line-height: var(--pk-dropdown-item-line-height, 1.5);
            font-weight: normal;
            text-align: left;
            white-space: nowrap;
            cursor: default;
            user-select: none;
            outline: none;
            box-sizing: border-box;
        }

        .item:hover:not([disabled]):not([aria-disabled='true']),
        :host([data-highlighted]) .item,
        :host([submenu-open]) .item {
            background: var(--pk-color-slate-100);
        }

        .item:focus-visible {
            background: var(--pk-color-slate-100);
        }

        .item[aria-disabled='true'] {
            pointer-events: none;
            opacity: 0.5;
        }

        .label {
            flex: 1 1 auto;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .prefix {
            display: inline-flex;
            flex: 0 0 auto;
            align-items: center;
            justify-content: center;
            width: var(--pk-dropdown-item-icon-size, 12px);
            height: var(--pk-dropdown-item-icon-size, 12px);
            line-height: 0;
        }

        .prefix--empty {
            display: none;
        }

        .prefix ::slotted(*) {
            display: inline-flex;
            flex: 0 0 auto;
            align-items: center;
            justify-content: center;
            width: var(--pk-dropdown-item-icon-size, 12px);
            height: var(--pk-dropdown-item-icon-size, 12px);
            /* Kill pk-icon text-baseline nudge inside the padded flex row. */
            vertical-align: 0;
        }

        .prefix ::slotted(svg),
        .prefix ::slotted(*) svg,
        .prefix ::slotted(.pk-dropdown-item__prefix-icon) {
            display: block;
            width: var(--pk-dropdown-item-icon-size, 12px) !important;
            height: var(--pk-dropdown-item-icon-size, 12px) !important;
            max-width: var(--pk-dropdown-item-icon-size, 12px);
            max-height: var(--pk-dropdown-item-icon-size, 12px);
            flex-shrink: 0;
            pointer-events: none;
        }

        .details {
            margin-left: auto;
            color: var(--pk-color-gray-500);
            font-size: var(--pk-dropdown-details-font-size, var(--pk-font-size-sm));
            letter-spacing: 0.04em;
        }

        .details:empty {
            display: none;
        }

        .check {
            display: inline-flex;
            flex: 0 0 auto;
            align-items: center;
            justify-content: center;
            width: 12px;
            height: 12px;
            color: var(--pk-color-gray-700);
        }

        .check svg {
            display: block;
            width: 12px;
            height: 12px;
            flex-shrink: 0;
            pointer-events: none;
        }

        .submenu-icon {
            display: inline-flex;
            flex: 0 0 auto;
            align-items: center;
            justify-content: center;
            width: 1rem;
            color: var(--pk-color-gray-700);
        }

        .submenu-icon svg {
            display: block;
            width: 1em;
            height: 1em;
            flex-shrink: 0;
            pointer-events: none;
        }

        .check {
            opacity: 0;
        }

        :host([checked]) .check {
            opacity: 1;
        }

        :host([type='checkbox']) .check,
        :host([type='radio']) .check {
            margin-left: auto;
        }

        :host([type='checkbox'][checked]) .check,
        :host([type='radio'][checked]) .check {
            opacity: 1;
        }

        .submenu-icon:empty {
            display: none;
        }

        :host([destructive]) .item {
            color: var(--pk-color-error);
        }

        :host([destructive]) .item:hover:not([disabled]):not([aria-disabled='true']),
        :host([destructive]) .item:focus-visible {
            color: var(--pk-color-error);
        }

        .submenu-panel {
            width: max-content;
            min-width: 8rem;
            overflow: hidden;
            padding: 4px 0;
            border-radius: var(--pk-radius-md);
            background: var(--pk-color-white);
            box-shadow: var(--pk-shadow-popup);
            /* Match root menu panel — Craft body text, not gray-900. */
            color: var(--text-color, var(--pk-color-gray-700));
        }

        .submenu-panel ::slotted(pk-dropdown-item),
        .submenu-panel ::slotted(pk-dropdown-separator),
        .submenu-panel ::slotted(pk-dropdown-label) {
            display: block;
        }

        .submenu-panel[hidden] {
            display: none !important;
        }
    }
`],M,ie=_(v),N=_(p),P=class extends t{static{M=this}constructor(...e){super(...e),this.value=``,this.type=`normal`,this.radioGroup=``,this.disabled=!1,this.destructive=!1,this.checked=!1,this.submenuOpen=!1,this.active=!1,this.submenuAnimated=!1,this.hasSlotController=new f(this,`submenu`,`details`,`start`,`prefix`),this.handleMouseEnter=()=>{!this.hasSubmenu()||this.disabled||(this.notifyParentOfOpening(),this.submenuOpen=!0)},this.handleHostClick=e=>{this.disabled&&(e.preventDefault(),e.stopImmediatePropagation())}}static{this.styles=re}connectedCallback(){super.connectedCallback(),this.syncRole(),this.syncSubmenuAria(),this.addEventListener(`click`,this.handleHostClick),this.addEventListener(`mouseenter`,this.handleMouseEnter)}disconnectedCallback(){this.removeEventListener(`click`,this.handleHostClick),this.removeEventListener(`mouseenter`,this.handleMouseEnter),this.closeSubmenu(),super.disconnectedCallback()}updated(e){(e.has(`type`)||e.has(`checked`))&&this.syncRole(),(e.has(`submenuOpen`)||e.size===0)&&this.syncSubmenuAria(),e.has(`submenuOpen`)&&(this.submenuOpen?this.ensureSubmenuSurface():this.submenuAnimated=!1)}hasSubmenu(){return this.hasSlotController.test(`submenu`)}syncSubmenuAria(){let e=this.hasSubmenu();e?this.setAttribute(`aria-haspopup`,`menu`):this.removeAttribute(`aria-haspopup`),this.setAttribute(`aria-expanded`,e&&this.submenuOpen?`true`:`false`)}focusControl(){this.shadowRoot?.querySelector(`.item`)?.focus({preventScroll:!0})}focus(e){let t=this.shadowRoot?.querySelector(`.item`);if(t){t.focus(e);return}super.focus(e)}get submenuElement(){return this.submenuPanelElement??null}closeSubmenu(){this.submenuAnimated=!1,this.submenuOpen=!1}openSubmenu(){!this.hasSubmenu()||this.disabled||!this.isConnected||(this.notifyParentOfOpening(),this.submenuOpen=!0)}notifyParentOfOpening(){this.dispatchEvent(new CustomEvent(`pk-submenu-open`,{bubbles:!0,composed:!0,detail:{item:this}}));let e=this.parentElement;if(e)for(let t of e.children)t!==this&&t instanceof M&&t.getAttribute(`slot`)===this.getAttribute(`slot`)&&t.submenuOpen&&(t.submenuOpen=!1)}ensureSubmenuSurface(){!this.hasSubmenu()||this.disabled||(this.submenuAnimated=!0,this.updateComplete.then(()=>{!this.submenuOpen||!this.submenuPanelElement||(this.submenuPanelElement.hidden=!1,C(this.submenuPanelElement,`right-start`),S(this.submenuPopupElement,`right-start`).then(e=>{C(this.submenuPanelElement,e)}))}))}syncRole(){if(this.type===`checkbox`){this.setAttribute(`role`,`menuitemcheckbox`),this.setAttribute(`aria-checked`,this.checked?`true`:`false`);return}if(this.type===`radio`){this.setAttribute(`role`,`menuitemradio`),this.setAttribute(`aria-checked`,this.checked?`true`:`false`);return}this.setAttribute(`role`,`menuitem`),this.removeAttribute(`aria-checked`)}handleClick(e){if(this.disabled){e.preventDefault(),e.stopImmediatePropagation();return}this.hasSubmenu()&&(e.preventDefault(),this.openSubmenu())}render(){let e=this.hasSubmenu(),t=this.type===`checkbox`||this.type===`radio`,n=this.hasSlotController.test(`start`)||this.hasSlotController.test(`prefix`);return i`
            <button
                part="item"
                type="button"
                class="item"
                ?disabled=${this.disabled}
                aria-disabled=${this.disabled?`true`:c}
                @click=${this.handleClick}
            >
                <span
                    part="prefix"
                    class=${n?`prefix`:`prefix prefix--empty`}
                >
                    <slot name="start"></slot>
                    <slot name="prefix"></slot>
                </span>
                <span class="label"><slot></slot></span>
                <span class="details"><slot name="details"></slot></span>
                ${t?i`<span class="check" aria-hidden="true">${O(ie)}</span>`:c}
                ${e?i`<span class="submenu-icon" aria-hidden="true">${O(N)}</span>`:c}
            </button>
            ${e?i`
                <pk-popup
                    .active=${this.submenuOpen}
                    .anchor=${this}
                    placement="right-start"
                    .distance=${0}
                    .skidding=${-4}
                    flip
                    shift
                    hover-bridge
                    style="--pk-popup-z-index: 1001"
                >
                    <div
                        part="submenu"
                        class="submenu-panel pk-popup-content"
                        role="menu"
                        data-size=${F(this)}
                        ?hidden=${!this.submenuOpen}
                        data-open=${this.submenuAnimated?``:c}
                        aria-orientation="vertical"
                    >
                        <slot name="submenu"></slot>
                    </div>
                </pk-popup>
            `:c}
        `}};s([r()],P.prototype,`value`,void 0),s([r({reflect:!0})],P.prototype,`type`,void 0),s([r({attribute:`radio-group`})],P.prototype,`radioGroup`,void 0),s([r({type:Boolean,reflect:!0})],P.prototype,`disabled`,void 0),s([r({type:Boolean,reflect:!0})],P.prototype,`destructive`,void 0),s([r({type:Boolean,reflect:!0})],P.prototype,`checked`,void 0),s([r({attribute:`submenu-open`,type:Boolean,reflect:!0})],P.prototype,`submenuOpen`,void 0),s([r({type:Boolean})],P.prototype,`active`,void 0),s([ee()],P.prototype,`submenuAnimated`,void 0),s([a(`.submenu-panel`)],P.prototype,`submenuPanelElement`,void 0),s([a(`pk-popup`)],P.prototype,`submenuPopupElement`,void 0),P=M=s([l(`pk-dropdown-item`)],P);function F(e){let t=e.parentElement?.getAttribute(`data-size`);if(t===`xs`||t===`sm`||t==="default"||t===`lg`||t===`xl`)return t;let n=e.closest(`pk-dropdown-menu`)?.getAttribute(`size`);return n===`xs`||n===`sm`||n===`lg`||n===`xl`?n:`default`}function I(t,n=`var(--pk-btn-radius, var(--pk-radius-lg))`){let r=u(t),i=u(n);return e`
        ${r} {
            border-top-left-radius: var(--pk-bg-start-start-radius, ${i});
            border-top-right-radius: var(--pk-bg-start-end-radius, ${i});
            border-bottom-left-radius: var(--pk-bg-end-start-radius, ${i});
            border-bottom-right-radius: var(--pk-bg-end-end-radius, ${i});
        }
    `}function L(){return e`
        :host([data-pk-group-orientation='horizontal']:not([data-pk-group-item-first]):not([data-pk-group-item-last])) {
            --pk-bg-start-start-radius: 0;
            --pk-bg-start-end-radius: 0;
            --pk-bg-end-start-radius: 0;
            --pk-bg-end-end-radius: 0;
        }

        :host([data-pk-group-orientation='horizontal'][data-pk-group-item-first]:not([data-pk-group-item-last])) {
            --pk-bg-start-end-radius: 0;
            --pk-bg-end-end-radius: 0;
        }

        :host([data-pk-group-orientation='horizontal'][data-pk-group-item-last]:not([data-pk-group-item-first])) {
            --pk-bg-start-start-radius: 0;
            --pk-bg-end-start-radius: 0;
        }

        :host([data-pk-group-orientation='vertical']:not([data-pk-group-item-first]):not([data-pk-group-item-last])) {
            --pk-bg-start-start-radius: 0;
            --pk-bg-start-end-radius: 0;
            --pk-bg-end-start-radius: 0;
            --pk-bg-end-end-radius: 0;
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-item-first]:not([data-pk-group-item-last])) {
            --pk-bg-end-start-radius: 0;
            --pk-bg-end-end-radius: 0;
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-item-last]:not([data-pk-group-item-first])) {
            --pk-bg-start-start-radius: 0;
            --pk-bg-start-end-radius: 0;
        }
    `}function R(){return e`
        :host([data-pk-group-orientation='horizontal'][data-pk-group-join][variant='outline']),
        :host([data-pk-group-orientation='horizontal'][data-pk-group-join][variant='dashed']) {
            margin-inline-start: var(--pk-bg-horizontal-indent-outlined, 0);
            margin-block-start: 0;
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-join][variant='outline']),
        :host([data-pk-group-orientation='vertical'][data-pk-group-join][variant='dashed']) {
            margin-block-start: var(--pk-bg-vertical-indent-outlined, 0);
            margin-inline-start: 0;
        }

        :host([data-pk-group-orientation='horizontal'][data-pk-group-join]:not([variant='outline']):not([variant='dashed']):not([variant='link']):not([variant='none'])) {
            margin-inline-start: var(--pk-bg-horizontal-indent, 0);
            margin-block-start: 0;
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-join]:not([variant='outline']):not([variant='dashed']):not([variant='link']):not([variant='none'])) {
            margin-block-start: var(--pk-bg-vertical-indent, 0);
            margin-inline-start: 0;
        }

        :host([data-pk-group-orientation='horizontal'][data-pk-group-divider][data-pk-group-join][variant='primary']),
        :host([data-pk-group-orientation='horizontal'][data-pk-group-divider][data-pk-group-join][variant='secondary']),
        :host([data-pk-group-orientation='horizontal'][data-pk-group-divider][data-pk-group-join][variant='default']) {
            margin-inline-start: 0;
            margin-block-start: 0;
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-divider][data-pk-group-join][variant='primary']),
        :host([data-pk-group-orientation='vertical'][data-pk-group-divider][data-pk-group-join][variant='secondary']),
        :host([data-pk-group-orientation='vertical'][data-pk-group-divider][data-pk-group-join][variant='default']) {
            margin-block-start: 0;
            margin-inline-start: 0;
        }

        /* Filled variants — Craft margin gap; parent background shows through.
         * !important: outer preflight/utilities beat non-important :host margin
         * (revert-layer cannot restore shadow host values — it still specifies outer 0).
         */
        :host([data-pk-group-orientation='horizontal'][data-pk-group-internal-trail][variant='primary']),
        :host([data-pk-group-orientation='horizontal'][data-pk-group-internal-trail][variant='secondary']),
        :host([data-pk-group-orientation='horizontal'][data-pk-group-internal-trail][variant='default']) {
            margin-inline-end: var(--pk-btn-group-gap, 1px) !important;
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-internal-trail][variant='primary']),
        :host([data-pk-group-orientation='vertical'][data-pk-group-internal-trail][variant='secondary']),
        :host([data-pk-group-orientation='vertical'][data-pk-group-internal-trail][variant='default']) {
            margin-block-end: var(--pk-btn-group-gap, 1px) !important;
        }
    `}function z(t){let n=u(t);return e`
        :host([data-pk-group-orientation='horizontal'][data-pk-group-join]:not([data-pk-group-divider])) ${n} {
            border-left-width: 0;
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-join]:not([data-pk-group-divider])) ${n} {
            border-top-width: 0;
        }

        :host([data-pk-group-orientation='horizontal'][data-pk-group-divider]:not([variant='outline']):not([variant='dashed'])) ${n} {
            border-left-width: 0;
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-divider]:not([variant='outline']):not([variant='dashed'])) ${n} {
            border-top-width: 0;
        }

        :host([data-pk-group-orientation='horizontal'][data-pk-group-internal-trail][variant='outline']) ${n},
        :host([data-pk-group-orientation='horizontal'][data-pk-group-internal-trail][variant='dashed']) ${n} {
            border-right-width: 0;
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-internal-trail][variant='outline']) ${n},
        :host([data-pk-group-orientation='vertical'][data-pk-group-internal-trail][variant='dashed']) ${n} {
            border-bottom-width: 0;
        }
    `}var B=[];function V(e){B.push(e)}function H(e){for(let t=B.length-1;t>=0;--t)if(B[t]===e){B.splice(t,1);break}}function U(e){return B.length>0&&B[B.length-1]===e}function W(e,t,n=500){return new Promise(r=>{let i=new AbortController,{signal:a}=i;if(e.classList.contains(t)){r();return}e.classList.add(t);let o=!1,s=()=>{o||(o=!0,e.classList.remove(t),window.clearTimeout(c),r(),i.abort())};e.addEventListener(`animationend`,s,{once:!0,signal:a}),e.addEventListener(`animationcancel`,s,{once:!0,signal:a});let c=window.setTimeout(s,n);requestAnimationFrame(()=>{!o&&e.getAnimations().length===0&&s()})})}var G=[L(),A,j,e`
        @layer pk-component {
            /* Standalone: keep a real box so the trigger is not a flex-stretched
               child of the page (display:contents flattened pk-button to full card width).
               Button groups override below — same as legacy + React MenuButton inline-flex wrap. */
            :host {
                display: inline-block;
                position: relative;
                width: fit-content;
                max-width: 100%;
                align-self: flex-start;
                vertical-align: middle;
            }

            :host([data-pk-group-orientation]) {
                display: inline-flex;
                vertical-align: middle;
                flex: 0 0 auto;
                width: auto;
                max-width: none;
                align-self: auto;
            }

            /* Belt-and-suspenders if a parent still flattens layout onto the trigger. */
            ::slotted([slot='trigger']) {
                width: fit-content;
                max-width: 100%;
                flex: 0 0 auto;
                align-self: flex-start;
            }

            :host([data-pk-group-orientation]) ::slotted([slot='trigger']) {
                --pk-bg-start-start-radius: inherit;
                --pk-bg-start-end-radius: inherit;
                --pk-bg-end-start-radius: inherit;
                --pk-bg-end-end-radius: inherit;
                align-self: auto;
                max-width: none;
            }

            :host([data-pk-group-orientation='horizontal'][data-pk-group-join]) {
                margin-inline-start: var(--pk-bg-horizontal-indent, 0);
            }

            :host([data-pk-group-orientation='vertical'][data-pk-group-join]) {
                margin-block-start: var(--pk-bg-vertical-indent, 0);
            }

            :host([data-pk-group-orientation='horizontal'][data-pk-group-join]:has([slot='trigger'][variant='outline'], [slot='trigger'][variant='dashed'])) {
                margin-inline-start: var(--pk-bg-horizontal-indent-outlined, 0);
            }

            :host([data-pk-group-orientation='vertical'][data-pk-group-join]:has([slot='trigger'][variant='outline'], [slot='trigger'][variant='dashed'])) {
                margin-block-start: var(--pk-bg-vertical-indent-outlined, 0);
            }

            /* Menu panel — hug content; do not stretch to trigger/anchor width. */
            .panel {
                display: flex;
                flex-direction: column;
                width: max-content;
                min-width: 8rem;
                margin: 0;
                overflow: auto;
                padding: 4px 0;
                border: 0;
                border-radius: var(--pk-radius-md);
                background: var(--pk-color-white);
                box-shadow: var(--pk-shadow-popup);
                /* v1 DropdownMenuItem had no face color — inherited Craft body
                 * (--text-color ≈ gray-700). Do not force gray-900 (too dark). */
                color: var(--text-color, var(--pk-color-gray-700));
                outline: none;
                text-align: start;
                user-select: none;
                /* Match v1 Base UI: popup writes --pk-transform-origin from the
                 * anchor center on the connecting edge (e.g. top-right for
                 * bottom-end). Keyword edge centers made end-aligned menus
                 * scale from the middle of the panel. */
                transform-origin: var(--pk-transform-origin, top);
            }

            .panel.show {
                animation: pk-dropdown-menu-show 100ms ease;
            }

            .panel.hide {
                animation: pk-dropdown-menu-show 100ms ease reverse;
            }

            .panel[hidden] {
                display: none !important;
            }

            ::slotted(pk-dropdown-item),
            ::slotted(pk-dropdown-separator),
            ::slotted(pk-dropdown-label),
            .panel > pk-dropdown-item,
            .panel > pk-dropdown-separator,
            .panel > pk-dropdown-label {
                display: block;
            }

            ::slotted([data-menu-item]) {
                display: flex;
                align-items: center;
                gap: 0.625rem;
                width: 100%;
                margin: 0;
                padding: 8px 12px;
                border: 0;
                background: transparent;
                color: inherit;
                font: inherit;
                font-size: var(--pk-font-size-base);
                text-align: left;
                white-space: nowrap;
                cursor: default;
                user-select: none;
                outline: none;
                box-sizing: border-box;
            }

            ::slotted([data-menu-item]:hover:not([disabled])) {
                background: var(--pk-color-slate-100);
            }

            ::slotted([data-menu-item]:focus-visible) {
                background: var(--pk-color-slate-100);
            }

            ::slotted([data-menu-item][disabled]) {
                pointer-events: none;
                opacity: 0.5;
            }

            ::slotted(pk-dropdown-item[destructive]),
            ::slotted([data-destructive]) {
                color: var(--pk-color-error);
            }

            ::slotted([data-menu-separator]) {
                display: block;
                height: 1px;
                margin: 4px 0;
                background: var(--pk-color-slate-200);
                border: 0;
                padding: 0;
            }
        }

        /* Outside @layer so constructed stylesheets resolve the name reliably. */
        @keyframes pk-dropdown-menu-show {
            from {
                scale: 0.9;
                opacity: 0;
            }

            to {
                scale: 1;
                opacity: 1;
            }
        }
    `],K=new Set,q=class extends t{constructor(...e){super(...e),this.open=!1,this.size=`default`,this.placement=`bottom-start`,this.sideOffset=4,this.distance=4,this.skidding=0,this.for=``,this.userTypedQuery=``,this.userTypedTimeout=0,this.openSubmenuStack=[],this.openedByKeyboard=!1,this.triggerElement=null,this.handleMenuClick=e=>{let t=this.resolveMenuItem(e);if(!(!t||t.disabled)){if(t.hasSubmenu()){t.submenuOpen||(this.closeSiblingSubmenus(t),this.addToSubmenuStack(t),t.openSubmenu()),e.stopPropagation();return}this.makeSelection(t)}},this.handleSubmenuOpening=e=>{let t=e.detail?.item;t instanceof P&&(this.closeSiblingSubmenus(t),this.addToSubmenuStack(t))},this.handleGlobalMouseMove=e=>{let t=this.getCurrentSubmenuItem();if(!t?.submenuOpen||!t.submenuElement)return;let n=t.submenuElement,r=e.composedPath(),i=t.matches(`:hover`),a=!!n.matches(`:hover`),o=i||r.some(e=>e===t),s=a||r.some(e=>e instanceof HTMLElement&&e.closest(`[part="submenu"]`)===n);!o&&!s&&window.setTimeout(()=>{!i&&!a&&(t.submenuOpen=!1)},100)},this.handleTriggerClick=e=>{let t=this.getTrigger();!t||!e.composedPath().includes(t)||(e.preventDefault(),e.stopPropagation(),this.openedByKeyboard=!1,this.open=!this.open)},this.handleExternalTriggerClick=e=>{e.preventDefault(),e.stopPropagation(),this.openedByKeyboard=!1,this.open=!this.open},this.handleTriggerKeyDown=e=>{let t=this.getTrigger();!t||!e.composedPath().includes(t)||this.open||(e.key===`ArrowDown`||e.key===`ArrowUp`)&&(e.preventDefault(),e.stopPropagation(),this.openedByKeyboard=!0,this.open=!0)},this.handleDocumentKeyDown=e=>{let t=this.isRtl();if(e.key===`Escape`&&this.open&&U(this)){e.preventDefault(),e.stopPropagation(),this.open=!1,this.getTrigger()?.focus({preventScroll:!0});return}if(!this.open)return;let n=[...T()].find(e=>e.localName===`pk-dropdown-item`),r=n?.localName===`pk-dropdown-item`,i=this.getCurrentSubmenuItem(),a=!!i,o,s,c;a&&i?(o=this.getSubmenuItems(i),s=o.find(e=>e.active||e===n),c=s?o.indexOf(s):-1):(o=this.getItems(),s=o.find(e=>e.active||e===n),c=s?o.indexOf(s):-1);let l;if(e.key===`ArrowUp`&&(e.preventDefault(),e.stopPropagation(),l=c>0?o[c-1]:o[o.length-1]),e.key===`ArrowDown`&&(e.preventDefault(),e.stopPropagation(),l=c!==-1&&c<o.length-1?o[c+1]:o[0]),e.key===(t?`ArrowLeft`:`ArrowRight`)&&r&&s&&s.hasSubmenu()){e.preventDefault(),e.stopPropagation(),this.closeSiblingSubmenus(s),s.openSubmenu(),this.addToSubmenuStack(s),window.setTimeout(()=>{let e=this.getSubmenuItems(s);e.length>0&&this.setActiveItem(e,e[0])},0);return}if(e.key===(t?`ArrowRight`:`ArrowLeft`)&&a){e.preventDefault(),e.stopPropagation();let t=this.removeFromSubmenuStack();t&&(t.submenuOpen=!1,window.setTimeout(()=>{t.focus({preventScroll:!0}),t.active=!0,(t.slot===`submenu`&&t.parentElement instanceof P?this.getSubmenuItems(t.parentElement):this.getItems()).forEach(e=>{e!==t&&(e.active=!1)})},0));return}if((e.key===`Home`||e.key===`End`)&&(e.preventDefault(),e.stopPropagation(),l=e.key===`Home`?o[0]:o[o.length-1]),e.key===`Tab`){this.open=!1;return}if(e.key.length===1&&!(e.metaKey||e.ctrlKey||e.altKey)&&(e.key!==` `||this.userTypedQuery!==``)){window.clearTimeout(this.userTypedTimeout),this.userTypedTimeout=window.setTimeout(()=>{this.userTypedQuery=``},1e3),this.userTypedQuery+=e.key;let t=this.userTypedQuery.trim().toLowerCase();l=o.find(e=>(e.textContent||``).trim().toLowerCase().startsWith(t))}if(l){e.preventDefault(),e.stopPropagation(),this.setActiveItem(o,l);return}(e.key===`Enter`||e.key===` `&&this.userTypedQuery===``)&&r&&s&&(e.preventDefault(),e.stopPropagation(),s.hasSubmenu()?(this.closeSiblingSubmenus(s),s.openSubmenu(),this.addToSubmenuStack(s),window.setTimeout(()=>{let e=this.getSubmenuItems(s);e.length>0&&this.setActiveItem(e,e[0])},0)):this.makeSelection(s))},this.handleDocumentPointerDown=e=>{let t=e.composedPath(),n=this.getTrigger();t.some(e=>e===this||e===n)||(this.open=!1)}}static{this.styles=G}get panelElement(){return this.menuElement??null}get popup(){return this.popupElement??null}connectedCallback(){super.connectedCallback(),this.addEventListener(`click`,this.handleTriggerClick,!0),this.addEventListener(`keydown`,this.handleTriggerKeyDown)}firstUpdated(){let e=()=>{if(this.for){this.resolveExternalTrigger();return}this.syncSlottedTrigger()};queueMicrotask(e),requestAnimationFrame(e)}disconnectedCallback(){window.clearTimeout(this.userTypedTimeout),this.removeEventListener(`click`,this.handleTriggerClick,!0),this.removeEventListener(`keydown`,this.handleTriggerKeyDown),this.unbindTrigger(this.triggerElement),this.triggerElement=null,this.closeAllSubmenus(),this.popupElement&&(this.popupElement.active=!1),this.menuElement?.classList.remove(`show`,`hide`),document.removeEventListener(`keydown`,this.handleDocumentKeyDown),document.removeEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),document.removeEventListener(`mousemove`,this.handleGlobalMouseMove),H(this),K.delete(this),super.disconnectedCallback()}async updated(e){if(super.updated(e),e.has(`for`)&&this.resolveExternalTrigger(),e.has(`open`)&&this.syncTriggerExpanded(),!e.has(`open`))return;let t=e.get(`open`);t!==this.open&&(t!==void 0||this.open!==!1)&&(this.open?await this.showMenu():(this.closeAllSubmenus(),await this.hideMenu(`unknown`)))}getItems(e=!1){let t=(this.defaultSlot?.assignedElements({flatten:!0})??[]).filter(e=>e.localName===`pk-dropdown-item`);return e?t:t.filter(e=>!e.disabled)}getSubmenuItems(e,t=!1){let n=((e.shadowRoot?.querySelector(`slot[name="submenu"]`))?.assignedElements({flatten:!0})??[...e.children].filter(e=>e.getAttribute(`slot`)===`submenu`)).filter(e=>e.localName===`pk-dropdown-item`);return t?n:n.filter(e=>!e.disabled)}getTrigger(){return this.for?w(this,this.for)??this.triggerElement:this.querySelector(`[slot="trigger"]`)??this.triggerElement}getAnchor(){return this.getTrigger()??``}resolveExternalTrigger(){this.unbindTrigger(this.triggerElement),this.triggerElement=this.for?w(this,this.for):null,this.bindTrigger(this.triggerElement),this.requestUpdate()}onTriggerSlotChange(e){if(this.for)return;let[t]=e.target.assignedElements({flatten:!0});this.unbindTrigger(this.triggerElement),this.triggerElement=t??null,this.bindTrigger(this.triggerElement),this.requestUpdate()}syncSlottedTrigger(){let e=this.renderRoot.querySelector(`slot[name="trigger"]`);e&&this.onTriggerSlotChange({target:e})}bindTrigger(e){e&&(e.setAttribute(`aria-haspopup`,`menu`),this.for&&(e.addEventListener(`click`,this.handleExternalTriggerClick),e.addEventListener(`keydown`,this.handleTriggerKeyDown)),this.syncTriggerExpanded())}unbindTrigger(e){e?.removeEventListener(`click`,this.handleExternalTriggerClick),e?.removeEventListener(`keydown`,this.handleTriggerKeyDown)}syncTriggerExpanded(){this.getTrigger()?.setAttribute(`aria-expanded`,this.open?`true`:`false`)}closeAfterSelect(e=`api`){this.open=!1}makeSelection(e){let t=this.getTrigger();if(e.disabled)return;e.type===`checkbox`&&(e.checked=!e.checked),e.type===`radio`&&!e.checked&&(e.checked=!0);let n={value:e.value,type:e.type,checked:e.checked,radioGroup:e.radioGroup};e.dispatchEvent(new CustomEvent(`pk-select`,{detail:n,bubbles:!1,composed:!1,cancelable:!0}));let r=new CustomEvent(`pk-select`,{detail:n,bubbles:!0,composed:!0,cancelable:!0});this.dispatchEvent(r),r.defaultPrevented||(this.open=!1,t?.focus({preventScroll:!0}))}resolveMenuItem(e){let t=e.target;if(t instanceof P)return t;if(t instanceof Element){let e=t.closest(`pk-dropdown-item`);if(e instanceof P)return e}return e.composedPath().find(e=>e instanceof P)??null}whenClosed(){return this.open?new Promise(e=>{this.addEventListener(`pk-after-hide`,()=>{this.popupElement.stop().then(()=>e())},{once:!0})}):this.popupElement?.active?this.popupElement.stop():Promise.resolve()}forceDismissCleanup(){this.open=!1,this.popupElement.active=!1,this.menuElement?.classList.remove(`show`,`hide`),this.closeAllSubmenus(),document.removeEventListener(`keydown`,this.handleDocumentKeyDown),document.removeEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),document.removeEventListener(`mousemove`,this.handleGlobalMouseMove),H(this),K.delete(this)}isRtl(){return getComputedStyle(this).direction===`rtl`}addToSubmenuStack(e){let t=this.openSubmenuStack.indexOf(e);t===-1?this.openSubmenuStack.push(e):this.openSubmenuStack=this.openSubmenuStack.slice(0,t+1)}removeFromSubmenuStack(){return this.openSubmenuStack.pop()}getCurrentSubmenuItem(){return this.openSubmenuStack.length>0?this.openSubmenuStack[this.openSubmenuStack.length-1]:void 0}closeAllSubmenus(){this.getItems(!0).forEach(e=>{e.submenuOpen=!1,e.active=!1}),this.openSubmenuStack=[]}closeSiblingSubmenus(e){let t=e.closest(`pk-dropdown-item:not([slot="submenu"])`);(t instanceof P?this.getSubmenuItems(t,!0):this.getItems(!0)).forEach(t=>{t!==e&&t.submenuOpen&&(t.submenuOpen=!1)}),this.openSubmenuStack.includes(e)||this.openSubmenuStack.push(e)}setActiveItem(e,t){e.forEach(e=>{e.active=e===t,e===t?e.setAttribute(`data-highlighted`,``):e.removeAttribute(`data-highlighted`)}),t.focus({preventScroll:!0}),t.scrollIntoView({block:`nearest`})}async showMenu(){if(!this.popupElement||!this.menuElement)return;this.for&&!this.triggerElement?.isConnected&&this.resolveExternalTrigger();let e=new h;if(!this.dispatchEvent(e)){this.open=!1;return}if(this.popupElement.active&&(this.popupElement.active=!1,this.menuElement.classList.remove(`show`,`hide`),await this.updateComplete),K.forEach(e=>{e!==this&&(e.open=!1)}),this.popupElement.active=!0,this.open=!0,K.add(this),V(this),document.addEventListener(`keydown`,this.handleDocumentKeyDown),document.addEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),document.addEventListener(`mousemove`,this.handleGlobalMouseMove),await this.updateComplete,await S(this.popupElement,this.placement,100,{requireEvent:!0}),!this.open){this.popupElement.active=!1,K.delete(this),H(this),document.removeEventListener(`keydown`,this.handleDocumentKeyDown),document.removeEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),document.removeEventListener(`mousemove`,this.handleGlobalMouseMove);return}this.menuElement.classList.remove(`hide`),await W(this.menuElement,`show`);let t=this.getItems();t.length>0&&(this.openedByKeyboard?this.setActiveItem(t,t[0]):(t.forEach(e=>{e.active=!1,e.removeAttribute(`data-highlighted`)}),this.menuElement.focus({preventScroll:!0}))),this.openedByKeyboard=!1,this.dispatchEvent(new x),this.dispatchEvent(new CustomEvent(`pk-open-change`,{detail:{open:!0},bubbles:!0,composed:!0}))}async hideMenu(e){if(!this.popupElement||!this.menuElement)return;let t=new d(e);if(!this.dispatchEvent(t)){this.open=!0;return}this.open=!1,K.delete(this),H(this),document.removeEventListener(`keydown`,this.handleDocumentKeyDown),document.removeEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),document.removeEventListener(`mousemove`,this.handleGlobalMouseMove),this.userTypedQuery=``,window.clearTimeout(this.userTypedTimeout),this.getItems(!0).forEach(e=>{e.active=!1,e.removeAttribute(`data-highlighted`)}),this.menuElement.classList.remove(`show`),await W(this.menuElement,`hide`),this.popupElement.active=!1,this.dispatchEvent(new m),this.dispatchEvent(new CustomEvent(`pk-open-change`,{detail:{open:!1},bubbles:!0,composed:!0}))}render(){let e=this.hasUpdated?this.popupElement?.active:this.open;return i`
            <pk-popup
                .anchor=${this.for?this.getAnchor():``}
                placement=${this.placement}
                .distance=${this.distance||this.sideOffset}
                .skidding=${this.skidding}
                ?active=${e}
                flip
                shift
                .shiftPadding=${10}
                auto-size="vertical"
                .autoSizePadding=${10}
            >
                <slot
                    name="trigger"
                    slot="anchor"
                    @slotchange=${this.onTriggerSlotChange}
                ></slot>

                <div
                    id="menu"
                    part="panel"
                    class="panel"
                    role="menu"
                    tabindex="-1"
                    aria-orientation="vertical"
                    data-size=${this.size}
                    @click=${this.handleMenuClick}
                    @pk-submenu-open=${this.handleSubmenuOpening}
                >
                    <slot></slot>
                </div>
            </pk-popup>
        `}};s([r({type:Boolean,reflect:!0})],q.prototype,`open`,void 0),s([r({reflect:!0})],q.prototype,`size`,void 0),s([r({reflect:!0})],q.prototype,`placement`,void 0),s([r({attribute:`side-offset`,type:Number})],q.prototype,`sideOffset`,void 0),s([r({type:Number})],q.prototype,`distance`,void 0),s([r({type:Number})],q.prototype,`skidding`,void 0),s([r({reflect:!0})],q.prototype,`for`,void 0),s([a(`slot:not([name])`)],q.prototype,`defaultSlot`,void 0),s([a(`#menu`)],q.prototype,`menuElement`,void 0),s([a(`pk-popup`)],q.prototype,`popupElement`,void 0),q=s([l(`pk-dropdown-menu`)],q);var J=e`
    @layer pk-component {
        :host {
            display: block;
            /*
             * Slotted label copy inherits through the flat tree from this host
             * when page metrics would otherwise leak via font:inherit chains.
             */
            font-size: var(--pk-dropdown-label-font-size, 13px);
            line-height: 1.3;
            color: var(--pk-color-slate-700, rgba(96, 125, 159, 0.7));
        }

        /* Match v1 DropdownMenuLabel — text-slate-700, regular weight (not medium). */
        .label {
            margin: 0;
            padding-block-start: 6px;
            padding-block-end: 4px;
            padding-inline: var(--pk-dropdown-label-padding-inline, 12px);
            color: inherit;
            font: inherit;
            font-weight: 400;
            user-select: none;
            pointer-events: none;
        }
    }
`,Y=class extends t{static{this.styles=J}connectedCallback(){super.connectedCallback(),this.setAttribute(`role`,`presentation`)}render(){return i`
            <div part="label" class="label">
                <slot></slot>
            </div>
        `}};Y=s([l(`pk-dropdown-label`)],Y);var X=class extends t{static{this.styles=e`
        @layer pk-component {
            :host {
                display: block;
            }

            hr {
                display: block;
                height: 1px;
                margin: 4px 0;
                border: 0;
                padding: 0;
                background: var(--pk-color-slate-200);
            }
        }
    `}connectedCallback(){super.connectedCallback(),this.setAttribute(`role`,`separator`)}render(){return i`<hr part="base" />`}};X=s([l(`pk-dropdown-separator`)],X);var ae=[n,e`
        @layer pk-component {
            :host {
                display: block;
                box-sizing: border-box;
            }

            :host([centered]) {
                position: absolute;
                top: 50%;
                left: 50%;
                display: block;
                width: fit-content;
                height: fit-content;
                margin: 0;
                transform: translate(-50%, -50%);
            }

            .spinner {
                display: block;
                box-sizing: border-box;
                margin-inline: auto;
                border-style: solid;
                border-bottom-color: transparent;
                border-left-color: transparent;
                border-radius: 50%;
                animation: pk-spinner-spin 0.5s linear infinite;
            }

            /* Sizes */
            :host([size='xxs']) .spinner {
                width: 0.75rem;
                height: 0.75rem;
                border-width: 1px;
            }

            :host([size='xs']) .spinner {
                width: 1rem;
                height: 1rem;
                border-width: 2px;
            }

            :host([size='sm']) .spinner,
            :host(:not([size])) .spinner {
                width: 1.5rem;
                height: 1.5rem;
                border-width: 2px;
            }

            :host([size='md']) .spinner {
                width: 2rem;
                height: 2rem;
                border-width: 2px;
            }

            :host([size='lg']) .spinner {
                width: 3rem;
                height: 3rem;
                border-width: 2px;
            }

            :host([size='xl']) .spinner {
                width: 4rem;
                height: 4rem;
                border-width: 2px;
            }

            /* Variants — matched to button loading contrast */
            :host([variant='default']:not([tone])) .spinner {
                border-top-color: var(--pk-color-red-500);
                border-right-color: var(--pk-color-red-500);
            }

            :host([variant='primary']:not([tone])) .spinner,
            :host([variant='secondary']:not([tone])) .spinner {
                border-top-color: var(--pk-color-white);
                border-right-color: var(--pk-color-white);
            }

            :host([variant='dashed']:not([tone])) .spinner,
            :host([variant='outline']:not([tone])) .spinner,
            :host([variant='transparent']:not([tone])) .spinner {
                border-top-color: var(--pk-color-gray-700);
                border-right-color: var(--pk-color-gray-700);
            }

            /* Standalone tone overrides */
            :host([tone='sky']) .spinner {
                border-top-color: var(--pk-color-sky-600);
                border-right-color: var(--pk-color-sky-600);
            }

            :host([tone='emerald']) .spinner {
                border-top-color: var(--pk-color-emerald-600);
                border-right-color: var(--pk-color-emerald-600);
            }

            :host([tone='violet']) .spinner {
                border-top-color: var(--pk-color-violet-600);
                border-right-color: var(--pk-color-violet-600);
            }

            :host([tone='amber']) .spinner {
                border-top-color: var(--pk-color-amber-500);
                border-right-color: var(--pk-color-amber-500);
            }

            @keyframes pk-spinner-spin {
                to {
                    transform: rotate(360deg);
                }
            }
        }
    `],Z=class extends t{constructor(...e){super(...e),this.variant=`default`,this.size=`sm`,this.centered=!1}static{this.styles=ae}render(){return i`
            <div part="base" class="spinner" aria-hidden="true"></div>
        `}};s([r({reflect:!0})],Z.prototype,`variant`,void 0),s([r({reflect:!0})],Z.prototype,`size`,void 0),s([r({reflect:!0})],Z.prototype,`tone`,void 0),s([r({type:Boolean,reflect:!0})],Z.prototype,`centered`,void 0),Z=s([l(`pk-spinner`)],Z);var Q=class extends t{constructor(...e){super(...e),this.icon=``,this.name=``,this.unsubscribeRegistry=null}static{this.styles=e`
        :host {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex: none;
            /* Square em box + slight baseline nudge for inline text. Flex
             * parents (e.g. button slots) should zero vertical-align. */
            width: 1em;
            height: 1em;
            line-height: 1;
            vertical-align: -0.125em;
        }

        svg {
            display: block;
            width: 100%;
            height: 100%;
            fill: currentColor;
            /* Allow intentional path overhang past the icon canvas. */
            overflow: visible;
        }
    `}connectedCallback(){super.connectedCallback(),this.unsubscribeRegistry=ne(()=>{this.requestUpdate()})}disconnectedCallback(){this.unsubscribeRegistry?.(),this.unsubscribeRegistry=null,super.disconnectedCallback()}render(){let e=y(this.icon||this.name);return e?i`${O(g(e,{title:this.label}))}`:c}};s([r()],Q.prototype,`icon`,void 0),s([r()],Q.prototype,`name`,void 0),s([r()],Q.prototype,`label`,void 0),Q=s([l(`pk-icon`)],Q);var $=`vizy-block-fallback`,oe={width:512,height:512,path:`M224.3-2.5c19.8-11.4 44.2-11.4 64 0L464.2 99c19.8 11.4 32 32.6 32 55.4l0 203c0 22.9-12.2 44-32 55.4L288.3 514.5c-19.8 11.4-44.2 11.4-64 0L48.5 413c-19.8-11.4-32-32.6-32-55.4l0-203c0-22.9 12.2-44 32-55.4L224.3-2.5zm207.8 360l0-166.1-143.8 83 0 166.1 143.8-83z`},se=!1;function ce(){se||=(te({[$]:oe}),!0)}export{V as a,I as c,O as d,E as f,U as i,L as l,ce as n,H as o,W as r,z as s,$ as t,R as u};
//# sourceMappingURL=block-type-icon-BtGCYu3D.js.map