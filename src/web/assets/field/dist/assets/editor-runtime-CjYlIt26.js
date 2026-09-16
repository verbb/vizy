const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./pk-dialog-C6MJmqEE.js","./decorate-R0X811qp-DTGsgM1e.js","./block-type-icon-CYOpWznJ.js","./pk-tooltip-Cmmc0916-DiAah6v3.js","./unsafe-html-DhD_KFJk.js","./has-slot-8BvCt_qo-HazXo5ZG.js","./pk-spinner-DweuYJ_Z-BKBHTf_C.js","./required-validator-CEg8dvjS-CQD5RH5r.js","./rolldown-runtime-DK3Fl9T5.js","./popup-pointer-CuLjk1th-CqHViPDs.js"])))=>i.map(i=>d[i]);
import{a as e,c as t,d as n,l as r,n as i,o as a,p as o,r as s,s as c,t as l,u}from"./decorate-R0X811qp-DTGsgM1e.js";import{a as d,i as f,o as p,s as m,t as h}from"./block-type-icon-CYOpWznJ.js";import{a as g,i as _,l as ee,n as v,r as y}from"./pk-tooltip-Cmmc0916-DiAah6v3.js";import{Bt as b,Rt as x,n as te,zt as ne}from"./unsafe-html-DhD_KFJk.js";import{t as re}from"./has-slot-8BvCt_qo-HazXo5ZG.js";import{i as ie,n as ae,r as oe,t as se}from"./required-validator-CEg8dvjS-CQD5RH5r.js";import"./popup-CaTYHlS7.js";import{c as ce,s as le}from"./select-BjAb7r3I.js";import{t as ue}from"./preload-helper-HclGiUj8.js";import{$ as de,A as fe,B as pe,C as me,Ct as he,D as ge,E as S,F as _e,G as ve,H as ye,I as be,J as xe,K as Se,L as Ce,M as we,N as Te,O as Ee,P as De,Q as Oe,R as ke,S as Ae,St as je,T as Me,U as Ne,V as Pe,W as Fe,X as Ie,Y as Le,Z as Re,_ as ze,_t as Be,a as Ve,at as He,b as Ue,bt as We,c as Ge,ct as Ke,d as qe,dt as C,et as w,f as Je,ft as T,g as Ye,gt as Xe,h as Ze,ht as E,i as Qe,it as $e,j as et,k as D,l as tt,lt as O,m as nt,mt as rt,n as it,nt as at,o as ot,ot as st,p as ct,pt as k,q as lt,r as ut,rt as dt,s as ft,st as pt,t as mt,tt as ht,u as gt,ut as A,v as _t,vt,w as yt,x as bt,xt as j,y as xt,yt as M,z as St}from"./vizy-CuoGJkUw.js";import{r as Ct}from"./popup-pointer-CuLjk1th-CqHViPDs.js";import{n as wt,r as Tt,t as Et}from"./field-labels-CmuAW8Cl-Dn227Qfy.js";import{t as Dt}from"./menu-chevron-D0Eaxe2T.js";var N=e=>(t,n)=>{n===void 0?customElements.define(e,t):n.addInitializer(()=>{customElements.define(e,t)})},Ot=o`
    @layer pk-component {
        :host {
            display: inline-block;
            flex-shrink: 0;
            width: 0.75rem;
            height: 0.75rem;
            border-radius: 9999px;
            vertical-align: middle;
        }

        .status {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: inherit;
        }

        :host([status='all']) .status { background: linear-gradient(60deg, #184cef, #e5422b); }
        :host([status='on']) .status,
        :host([status='live']) .status,
        :host([status='active']) .status,
        :host([status='enabled']) .status,
        :host([status='teal']) .status,
        :host([status='turquoise']) .status { background: var(--pk-color-teal-550); }
        :host([status='off']) .status,
        :host([status='suspended']) .status,
        :host([status='expired']) .status,
        :host([status='red']) .status { background: var(--pk-color-red-600); }
        :host([status='warning']) .status { background: var(--pk-color-amber-100); }
        :host([status='pending']) .status,
        :host([status='orange']) .status { background: var(--pk-color-orange-400); }
        :host([status='amber']) .status { background: var(--pk-color-amber-500); }
        :host([status='yellow']) .status { background: var(--pk-color-yellow-500); }
        :host([status='lime']) .status { background: var(--pk-color-lime-500); }
        :host([status='green']) .status { background: var(--pk-color-green-600); }
        :host([status='emerald']) .status { background: var(--pk-color-emerald-500); }
        :host([status='cyan']) .status { background: var(--pk-color-cyan-500); }
        :host([status='sky']) .status { background: var(--pk-color-sky-500); }
        :host([status='blue']) .status { background: var(--pk-color-blue-600); }
        :host([status='indigo']) .status { background: var(--pk-color-indigo-500); }
        :host([status='violet']) .status { background: var(--pk-color-violet-500); }
        :host([status='purple']) .status { background: var(--pk-color-purple-500); }
        :host([status='fuchsia']) .status { background: var(--pk-color-fuchsia-500); }
        :host([status='pink']) .status { background: var(--pk-color-pink-500); }
        :host([status='rose']) .status { background: var(--pk-color-rose-500); }
        :host([status='light']) .status { background: var(--pk-color-gray-100); }
        :host([status='gray']) .status,
        :host([status='grey']) .status { background: var(--pk-color-gray-300); }
        :host([status='white']) .status { background: var(--pk-color-white); }
        :host([status='black']) .status { background: var(--pk-color-gray-800); }
        :host([status='disabled']) .status,
        :host([status='inactive']) .status {
            /* Ring color is overridable for inverted / selected surfaces. */
            background: transparent;
            box-shadow: inset 0 0 0 2px var(--pk-status-ring, var(--pk-color-gray-500));
        }
    }
`,kt=class extends l{constructor(...e){super(...e),this.status=`on`,this.ariaLabel=null}static{this.styles=Ot}render(){return n`
            <span
                part="base"
                class="status"
                role="status"
                aria-label=${this.ariaLabel??r}
            ></span>
        `}};i([c({reflect:!0})],kt.prototype,`status`,void 0),i([c({attribute:`aria-label`})],kt.prototype,`ariaLabel`,void 0),kt=i([s(`pk-status`)],kt);var At=o`
    [contenteditable='false'] {
        white-space: normal;
    }
`,jt=`.vizy-editor-body`,Mt=`data-has-focus`,Nt=new WeakMap;function Pt(e){let t=e?.closest(jt);return t instanceof HTMLElement?t:null}function Ft(e,t){if(!e)return;let n=Nt.get(e)??0,r=Math.max(0,n+(t?1:-1));if(r===0){Nt.delete(e),e.removeAttribute(Mt);return}Nt.set(e,r),e.setAttribute(Mt,``)}function It(e){return e instanceof PointerEvent||e instanceof MouseEvent?e.button===0:!1}function Lt(e){return e.composedPath().filter(e=>e instanceof HTMLElement)}function Rt(e){if(!It(e))return!1;let t=Lt(e);if(!t.some(e=>e.matches(`.vizy-editor-body`)))return!1;for(let e of t)if(e.matches(`[data-vizy-drag-handle]`)||e.matches(`input, textarea, select, option`)||e.getAttribute(`contenteditable`)===`true`)return!1;return t.some(e=>e.getAttribute(`contenteditable`)===`false`||e.hasAttribute(`data-vizy-ui`)||e.matches(`vizy-toolbar, vizy-bubble-menu, [data-vizy-ui], [data-vizy-insertion-overlay], .vizy-insertion-overlay`))?!0:!t.some(e=>e.classList.contains(`ProseMirror`))}function zt(e){e.preventDefault()}function Bt(e){let t=e=>{Rt(e)&&e.preventDefault()};return e.addEventListener(`pointerdown`,t,!0),()=>e.removeEventListener(`pointerdown`,t,!0)}function Vt(e){if(!e||e.isDestroyed)return!1;try{return e.view.hasFocus()}catch{return!1}}function Ht(e){let t=document.activeElement;return!!(!(t instanceof HTMLElement)||t===document.body||t===e.view.dom||e.view.dom.contains(t)||Pt(e.view.dom)?.contains(t)||t.closest(`pk-popup, pk-dropdown-menu, pk-dropdown-item, vizy-insertion-list`))}function Ut(e,t){!e||e.isDestroyed||queueMicrotask(()=>{if(!e.isDestroyed&&!(!t?.force&&!Ht(e)))try{e.view.focus()}catch{}})}function Wt(e,t){if(!e){t?.();return}Ft(e,!0);let n=()=>{window.removeEventListener(`pointerup`,n,!0),window.removeEventListener(`pointercancel`,n,!0),t?.(),queueMicrotask(()=>Ft(e,!1))};window.addEventListener(`pointerup`,n,!0),window.addEventListener(`pointercancel`,n,!0)}var Gt={duration:220,easing:`cubic-bezier(0.2, 0.85, 0.25, 1)`};function Kt(){if(typeof window>`u`)return!1;let e=window.Garnish;return typeof e?.prefersReducedMotion==`function`?e.prefersReducedMotion():window.matchMedia(`(prefers-reduced-motion: reduce)`).matches}function qt(e){if(typeof document>`u`||Kt())return;let t=document.querySelector(`vizy-block[data-block-uid="${CSS.escape(e)}"]`);!t||typeof t.animate!=`function`||requestAnimationFrame(()=>{requestAnimationFrame(()=>{let e=t.getBoundingClientRect().height;e<=0||(t.style.overflow=`hidden`,t.animate([{height:`0px`,opacity:.4,marginBlockStart:`0px`,marginBlockEnd:`0px`},{height:`${e}px`,opacity:1}],{duration:Gt.duration,easing:Gt.easing}).finished.finally(()=>{t.style.overflow=``}))})})}function Jt(){let e=window.$;return typeof e==`function`?e:null}function Yt(){let e=Jt();if(!e)return!1;try{return typeof e(document.createElement(`div`)).velocity==`function`}catch{return!1}}function Xt(e){let t=Jt();if(!(!t||!Yt()))try{t(e).velocity(`stop`)}catch{}}function Zt(e,t,n={}){let r=Jt();return!r||!Yt()?(n.complete?.(),Promise.resolve()):new Promise(i=>{let a={...n,complete:()=>{n.complete?.(),i()}};try{r(e).velocity(t,a)}catch{a.complete?.()}})}var Qt=`fast`;function P(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var F=class extends t{#e=``;get blockUid(){return this.#e}set blockUid(e){this.#e=e}#t=!1;get selected(){return this.#t}set selected(e){this.#t=e}#n=!0;get enabled(){return this.#n}set enabled(e){this.#n=e}#r=null;get accentColor(){return this.#r}set accentColor(e){this.#r=e}#i=null;get typeIconSvg(){return this.#i}set typeIconSvg(e){this.#i=e}#a=!1;get unresolved(){return this.#a}set unresolved(e){this.#a=e}#o=!1;get disabled(){return this.#o}set disabled(e){this.#o=e}#s=!1;get dragging(){return this.#s}set dragging(e){this.#s=e}#c=0;get errorCount(){return this.#c}set errorCount(e){this.#c=e}#l=0;get descendantErrorCount(){return this.#l}set descendantErrorCount(e){this.#l=e}#u=``;get title(){return this.#u}set title(e){this.#u=e}#d=null;get subtitle(){return this.#d}set subtitle(e){this.#d=e}#f=``;get typeName(){return this.#f}set typeName(e){this.#f=e}#p=`Add Block above`;get addAboveLabel(){return this.#p}set addAboveLabel(e){this.#p=e}#m=!0;get canAddAbove(){return this.#m}set canAddAbove(e){this.#m=e}#h=!1;get expectsFieldLayout(){return this.#h}set expectsFieldLayout(e){this.#h=e}#g=`unmounted`;get fieldLayoutState(){return this.#g}set fieldLayoutState(e){this.#g=e}#_=null;get fieldLayoutError(){return this.#_}set fieldLayoutError(e){this.#_=e}#v=!1;get fieldLayoutRetrying(){return this.#v}set fieldLayoutRetrying(e){this.#v=e}#y=[];get layoutTabLabels(){return this.#y}set layoutTabLabels(e){this.#y=e}#b=!1;get collapsed(){return this.#b}set collapsed(e){this.#b=e}#x=!1;get menuOpen(){return this.#x}set menuOpen(e){this.#x=e}#S=!1;get menuClosing(){return this.#S}set menuClosing(e){this.#S=e}#C=0;get activeLayoutTab(){return this.#C}set activeLayoutTab(e){this.#C=e}#w=null;updated(e){if(e.has(`menuOpen`)&&this.toggleAttribute(`menu-open`,this.menuOpen),e.has(`collapsed`)&&this.toggleAttribute(`collapsed`,this.collapsed),e.has(`layoutTabLabels`)&&this.activeLayoutTab!==0&&(this.activeLayoutTab=0),e.has(`enabled`)){let t=!!e.get(`enabled`);t&&!this.enabled?this.#P(!0,{animate:!0,persist:!0}):!t&&this.enabled&&this.#P(!1,{animate:!0,persist:!0})}if(e.has(`accentColor`)){if(this.accentColor)this.style.setProperty(`--vizy-block-accent-color`,this.accentColor);else{this.style.removeProperty(`--vizy-block-accent-color`);for(let e of[`--custom-bg-color`,`--custom-titlebar-bg-color`,`--custom-border-color`,`--custom-text-color`,`--vizy-block-label-color`])this.style.removeProperty(e)}}}static styles=[At,o`
        /*
         * Block header: cool-gray header, plain type label on the left, white body,
         * Matrix-style tab cutout, 24×24 icon actions on the right (drag last). Host
         * border lives in vizy.css.
         */
        :host {
            display: flex;
            flex-direction: column;
            position: relative;
            margin: 0.5rem 0;
            border-radius: 5px;
            background: var(--pk-color-white, #fff);
            /* Clip collapsed preview to the host radius only. Expanded Blocks
               must not clip later Content Areas / nested Cards — overflow:hidden
               was eating the bottom of multi-area layouts. */
            overflow: visible;
            container-type: inline-size;
            container-name: vizy-block;
            color: var(--pk-color-gray-700, #3f4d5a);
        }
        /* Matrix-parity accent ladder (Craft Color shades 50/100/200/900), derived
           from free hex via oklab so pastels read like Matrix rather than a gray wash.
           Outer border-color is applied in vizy.css — host borders cannot win from here. */
        :host([accent-color]) {
            --custom-bg-color: color-mix(in oklab, var(--vizy-block-accent-color) 9%, #fff);
            --custom-titlebar-bg-color: color-mix(in oklab, var(--vizy-block-accent-color) 16%, #fff);
            --custom-border-color: color-mix(in oklab, var(--vizy-block-accent-color) 28%, #fff);
            --custom-text-color: color-mix(in oklab, var(--vizy-block-accent-color) 62%, #000);
            --vizy-block-label-color: var(--custom-text-color);
            background: var(--custom-bg-color);
            color: var(--custom-text-color);
        }
        :host([collapsed]) {
            overflow: hidden;
        }
        :host([menu-open]) {
            /* Raise the Block while its ⋯ menu is open so the gutter chip
               suppression / stacking stay predictable. */
            z-index: 6;
        }
        /* Selected focus ring is painted from vizy.css (--pk-input-focus-shadow)
           while the field is active (focus-within / data-has-focus). */
        :host([dragging]) {
            opacity: 0.45;
        }

        header {
            position: relative;
            z-index: 2;
            display: flex;
            align-items: stretch;
            justify-content: space-between;
            gap: 0.5rem;
            /* Tighter right edge so the drag handle sits closer to the frame,
               matching Hyper’s far-right placement. */
            padding: 0 0.35rem 0 0.75rem;
            min-height: 31px;
            background: var(--vizy-panel, #f3f7fc);
            border-bottom: 1px solid var(--vizy-border);
            border-radius: 5px 5px 0 0;
            /* The header is an affordance surface, not selectable copy. */
            user-select: none;
            cursor: default;
        }
        :host([accent-color]) header {
            background: var(--custom-titlebar-bg-color);
            border-bottom-color: var(--custom-border-color);
        }
        /* Folded card is header-only — drop the header/body seam so it does not
           stack on the host bottom border (double line). */
        :host([collapsed]) header {
            border-bottom: none;
            border-radius: 5px;
        }

        /* Block type name — Hyper-style left title, not a fixed label column. */
        .type {
            display: inline-flex;
            align-items: center;
            gap: 0.375rem;
            align-self: center;
            box-sizing: border-box;
            flex: 0 1 auto;
            min-width: 0;
            max-width: 40%;
            margin: 0;
            padding: 0;
            border: none;
            background: transparent;
            color: var(--vizy-block-label-color, #667c92);
            font-size: 12px;
            font-weight: 500;
            line-height: 1.3;
            cursor: default;
        }
        :host([accent-color]) .type {
            color: var(--custom-text-color);
        }
        .type-label {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        /* Matrix entry-type glyph beside the type name — only when configured. */
        .type-icon {
            display: inline-flex;
            width: 14px;
            height: 14px;
            flex-shrink: 0;
            color: inherit;
        }
        .type-icon svg {
            width: 100%;
            height: 100%;
            fill: currentColor;
        }
        /* Collapsed-only content summary beside the type name (Vizy 3).
           Always in the DOM when text exists; clip/fade so expand/collapse
           does not pop header width in one frame. Timing matches BLOCK_HEIGHT_MOTION. */
        .summary-preview {
            display: inline-block;
            max-width: 0;
            margin-inline-start: 0;
            opacity: 0;
            font-weight: 400;
            color: var(--vizy-muted, #596673);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: bottom;
            transition:
                max-width 220ms cubic-bezier(0.2, 0.85, 0.25, 1),
                opacity 160ms ease,
                margin-inline-start 220ms cubic-bezier(0.2, 0.85, 0.25, 1);
        }
        :host([collapsed]) .summary-preview {
            max-width: 16rem;
            margin-inline-start: 0.35rem;
            opacity: 1;
        }
        :host([data-collapse-instant]) .summary-preview {
            transition: none;
        }

        .badges {
            display: flex;
            gap: 0.25rem;
            align-items: center;
            align-self: center;
            padding-inline-start: 0.25rem;
        }
        .badge {
            font-size: 0.6875rem;
            padding: 0.125rem 0.375rem;
            border-radius: 999px;
            background: var(--pk-color-gray-100, #e4edf6);
            color: var(--pk-color-gray-700, #3f4d5a);
        }
        .badge.error { background: #fde8e8; color: #b42318; }

        .header-end {
            display: flex;
            align-items: stretch;
            justify-content: flex-end;
            flex: 1 1 auto;
            min-width: 0;
            margin-left: auto;
            gap: 0.15rem;
        }

        .field-status {
            align-self: center;
            font-size: 0.75rem;
            color: var(--vizy-muted, #596673);
            padding-inline: 0.25rem;
        }

        /* Hyper-style layout tabs: cut out the header/body seam. */
        .layout-tabs {
            display: flex;
            align-items: stretch;
            align-self: stretch;
            min-width: 0;
            margin-right: 0.25rem;
            margin-bottom: -1px;
        }
        .layout-tab {
            appearance: none;
            position: relative;
            z-index: 0;
            background: transparent;
            border: 1px solid transparent;
            border-radius: 0;
            margin: 0;
            padding: 5px 10px;
            font-size: 12px;
            line-height: 1.2;
            color: var(--pk-color-gray-700, #3f4d5a);
            display: inline-flex;
            align-items: center;
            min-width: 0;
            max-width: 10rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: pointer;
        }
        .layout-tab:hover { color: var(--pk-color-gray-900, #1f2933); background: transparent; }
        .layout-tab.is-active {
            z-index: 1;
            background: var(--pk-color-white, #fff);
            border-left-color: #e3e5e8;
            border-right-color: #e3e5e8;
            border-bottom-color: var(--pk-color-white, #fff);
            color: var(--pk-color-gray-900, #1f2933);
        }
        /* Active tab cutout is for the expanded body seam — neutralize when folded. */
        :host([collapsed]) .layout-tabs {
            margin-bottom: 0;
        }
        :host([collapsed]) .layout-tab.is-active {
            border-color: transparent;
            background: color-mix(in srgb, #596673 10%, transparent);
        }
        .layout-tab-select {
            display: none;
            align-self: center;
            max-width: 10rem;
            margin-right: 0.25rem;
            font-size: 12px;
            border: 1px solid #e3e5e8;
            border-radius: 3px;
            background: var(--pk-color-white, #fff);
            padding: 0.2rem 0.4rem;
            color: var(--pk-color-gray-700, #3f4d5a);
        }
        @container vizy-block (max-width: 28rem) {
            .layout-tabs { display: none; }
            .layout-tab-select { display: inline-block; }
        }

        .actions {
            display: flex;
            align-items: center;
            align-self: center;
            gap: 0.15rem;
        }
        .actions button {
            appearance: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            flex: 0 0 auto;
            width: 24px;
            height: 24px;
            margin: 0;
            padding: 0;
            border: none;
            border-radius: 3px;
            background: transparent;
            color: var(--vizy-muted, #596673);
            cursor: pointer;
            line-height: 0;
            font-size: 14px;
        }
        .actions button:hover,
        .actions button:focus-visible {
            background: color-mix(in srgb, #596673 12%, transparent);
        }
        /* Hyper: ⋯ keeps the wash; drag handle stays bare with move cursor. */
        .actions button[part='drag-handle']:hover,
        .actions button[part='drag-handle']:focus-visible {
            background: transparent;
        }
        .actions button:focus-visible { outline: 2px solid var(--vizy-focus); outline-offset: 1px; }
        /* Higher specificity than .actions button cursor:pointer. */
        .actions button[part='drag-handle'] { cursor: move; user-select: none; }
        .actions button[part='drag-handle']:active { cursor: grabbing; }
        .action-icon {
            display: block;
            width: 12px;
            height: 12px;
        }
        [part='drag-handle'] .action-icon {
            width: 14px;
            height: 14px;
        }
        [part='drag-handle'] pk-icon.action-icon,
        [part='menu-trigger'] pk-icon.action-icon {
            display: block;
            color: inherit;
        }
        /* PK host defaults to flex-start — keep ⋯ optically centred with Hyper. */
        pk-dropdown-menu {
            display: inline-flex;
            align-self: center;
        }
        pk-dropdown-menu::part(trigger),
        button[slot='trigger'] {
            appearance: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            width: 24px;
            height: 24px;
            margin: 0;
            padding: 0;
            border: none;
            border-radius: 3px;
            background: transparent;
            color: var(--vizy-muted, #596673);
            cursor: pointer;
            line-height: 0;
        }
        button[slot='trigger']:hover,
        button[slot='trigger']:focus-visible {
            background: color-mix(in srgb, #596673 12%, transparent);
        }
        button[slot='trigger']:focus-visible {
            outline: 2px solid var(--vizy-focus);
            outline-offset: 1px;
        }

        /* Flex column so template whitespace around slots is dropped under
           ProseMirror's inherited break-spaces. Resting fold is display:none
           (Matrix hides $fieldsContainer). Motion uses Craft Velocity on the
           host height + body fade — not CSS grid 0fr↔1fr. */
        [part=body] {
            position: relative;
            z-index: 0;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            /* No flex gap — the fields and content slots are always both present,
               so gap would stack on top of body padding even when fields is empty. */
            padding: 0.75rem 0 0.3rem;
            background: var(--pk-color-white, #fff);
            border-radius: 0 0 5px 5px;
            /* Do not inherit ProseMirror break-spaces — Lit template whitespace
               between slots would otherwise add ~1 extra line per gap on mount. */
            white-space: normal;
        }
        :host([collapsed]:not([data-collapse-animating])) [part=body] {
            display: none;
        }
        /* Mid-fold: keep the body in flow so height animation can run. */
        :host([data-collapse-animating]) {
            overflow: hidden;
        }
        :host([data-collapse-animating]) [part=body] {
            display: flex;
            overflow: hidden;
        }
        /* Let the Matrix-style host wash show through; Craft inputs keep their own white. */
        :host([accent-color]) [part=body] {
            background: transparent;
        }
        .block-contents {
            display: flex;
            flex-direction: column;
            white-space: normal;
        }
        .field-layout-failure {
            box-sizing: border-box;
            margin: 0 0.5rem 0.5rem;
            padding: 0.85rem 1rem;
            border: 1px solid var(--error-color, #ef4444);
            border-radius: var(--vizy-radius, 4px);
            background: var(--pk-color-red-50, #fef2f2);
            color: var(--pk-color-gray-800, #33404d);
        }
        .field-layout-loading {
            box-sizing: border-box;
            margin: 0 0.5rem 0.5rem;
            padding: 0.85rem 1rem;
            border: 1px solid var(--vizy-border-subtle, #cdd8e4);
            border-radius: var(--vizy-radius, 4px);
            background: var(--pk-color-gray-50, #f3f7fc);
            color: var(--pk-color-gray-600, #515f6c);
            font-size: 12.5px;
        }
        .field-layout-failure__title {
            margin: 0 0 0.35rem;
            color: var(--error-color, #b91c1c);
            font-size: 13px;
            font-weight: 600;
        }
        .field-layout-failure__body {
            margin: 0 0 0.75rem;
            font-size: 12.5px;
            line-height: 1.4;
            white-space: pre-wrap;
            word-break: break-word;
        }
        .field-layout-failure__retry {
            appearance: none;
            margin: 0;
            padding: 0.35rem 0.65rem;
            border: 1px solid var(--vizy-border-subtle, #cdd8e4);
            border-radius: var(--vizy-radius, 4px);
            background: var(--white, #fff);
            color: var(--pk-color-gray-800, #33404d);
            font: inherit;
            font-size: 12px;
            cursor: pointer;
        }
        .field-layout-failure__retry:hover {
            border-color: var(--pk-color-gray-400, #7b8793);
        }
    `];applySummary(e){e&&(this.typeName=e.typeName,this.title=e.title,this.subtitle=e.subtitle,this.enabled=e.enabled,this.unresolved=!e.resolved,this.errorCount=e.errorCount,this.descendantErrorCount=e.descendantErrorCount)}#T(){let e=this.typeName||`Block`;return this.title&&this.title!==e?this.title:this.subtitle?this.subtitle:null}#E(){let e=this.typeName||`Block`;if(!this.collapsed)return e;let t=this.#T();return t?`${e}, ${t}`:e}#D(){return this.expectsFieldLayout&&this.fieldLayoutState!==`mounted`&&this.fieldLayoutState!==`error`}render(){let e=this.#T();return n`
            <header
                part="header"
                contenteditable="false"
                role="group"
                aria-label=${this.#E()}
                @pointerdown=${this.#z}
                @dblclick=${this.#B}
            >
                <div class="type" part="summary">
                    ${this.enabled?r:n`<pk-status status="off" aria-label="Disabled"></pk-status>`}
                    ${this.typeIconSvg?n`<span class="type-icon" part="type-icon" aria-hidden="true">${te(this.typeIconSvg)}</span>`:r}
                    <span class="type-label" part="type">${this.typeName||`Block`}</span>
                    ${e?n`<span class="summary-preview" part="summary-preview">${e}</span>`:r}
                </div>
                <div class="badges" part="badges">
                    ${this.errorCount?n`<span class="badge error" aria-label="${this.errorCount} errors">${this.errorCount}</span>`:r}
                    ${this.descendantErrorCount?n`<span class="badge error" aria-label="${this.descendantErrorCount} nested errors">+${this.descendantErrorCount}</span>`:r}
                    ${this.unresolved?n`<span class="badge" aria-label="Unresolved block type">?</span>`:r}
                </div>
                <div class="header-end">
                    ${this.#A()}
                    ${this.#j()}
                    <div class="actions">
                        <pk-dropdown-menu
                            size="sm"
                            placement="bottom-end"
                            @pk-open-change=${this.#U}
                            @pk-hide=${this.#V}
                            @pk-after-hide=${this.#H}
                            @pk-select=${this.#W}
                        >
                            <button
                                type="button"
                                slot="trigger"
                                part="menu-trigger"
                                aria-label="Block actions"
                                ?disabled=${this.menuClosing}
                            >
                                <pk-icon class="action-icon" icon="ellipsis" label=""></pk-icon>
                            </button>
                            ${this.enabled?n`
                                <pk-dropdown-item value="toggleCollapse">
                                    <pk-icon
                                        slot="start"
                                        icon=${this.collapsed?`up-right-and-down-left-from-center`:`down-left-and-up-right-to-center`}
                                        label=""
                                    ></pk-icon>
                                    ${this.collapsed?`Expand`:`Collapse`}
                                </pk-dropdown-item>
                            `:r}
                            <pk-dropdown-item value="duplicate">
                                <pk-icon slot="start" icon="clone" label=""></pk-icon>
                                Duplicate
                            </pk-dropdown-item>
                            <pk-dropdown-separator></pk-dropdown-separator>
                            <pk-dropdown-item value="moveUp">
                                <pk-icon slot="start" icon="arrow-up" label=""></pk-icon>
                                Move up
                            </pk-dropdown-item>
                            <pk-dropdown-item value="moveDown">
                                <pk-icon slot="start" icon="arrow-down" label=""></pk-icon>
                                Move down
                            </pk-dropdown-item>
                            <pk-dropdown-separator></pk-dropdown-separator>
                            <pk-dropdown-item value="toggleEnabled">
                                <pk-icon slot="start" icon=${this.enabled?`ban`:`check`} label=""></pk-icon>
                                ${this.enabled?`Disable`:`Enable`}
                            </pk-dropdown-item>
                            ${this.canAddAbove?n`
                                <pk-dropdown-separator></pk-dropdown-separator>
                                <pk-dropdown-item value="addAbove">
                                    <pk-icon slot="start" icon="plus" label=""></pk-icon>
                                    ${this.addAboveLabel}
                                </pk-dropdown-item>
                            `:r}
                            <pk-dropdown-separator></pk-dropdown-separator>
                            <pk-dropdown-item value="delete" destructive>
                                <pk-icon slot="start" icon="xmark" label=""></pk-icon>
                                Delete
                            </pk-dropdown-item>
                        </pk-dropdown-menu>
                        <button
                            type="button"
                            part="drag-handle"
                            data-vizy-drag-handle
                            aria-label="Move block"
                            @click=${e=>e.stopPropagation()}
                        >
                            <pk-icon class="action-icon" icon="grip-move"></pk-icon>
                        </button>
                    </div>
                </div>
            </header>
            <section
                part="body"
                ?inert=${this.collapsed}
                aria-busy=${this.#D()?`true`:r}
            >
                ${this.#O()}
                <div class="block-contents" ?hidden=${this.fieldLayoutState===`error`||this.fieldLayoutRetrying}>
                    <slot name="layout"></slot>
                </div>
            </section>
        `}#O(){return this.fieldLayoutRetrying&&this.fieldLayoutState===`loading`?n`
                <div class="field-layout-loading" part="field-layout-loading" aria-live="polite">
                    Loading fields…
                </div>
            `:this.fieldLayoutState===`error`?n`
            <div class="field-layout-failure" role="alert" part="field-layout-failure">
                <div class="field-layout-failure__title">Block fields could not load</div>
                <div class="field-layout-failure__body">${this.fieldLayoutError||`This Block’s fields failed to render. Check the browser console for details.`}</div>
                <button
                    type="button"
                    class="field-layout-failure__retry"
                    @click=${this.#k}
                    @pointerdown=${zt}
                >Retry</button>
            </div>
        `:r}#k=e=>{e.preventDefault(),e.stopPropagation(),this.fieldLayoutRetrying=!0,this.fieldLayoutState=`loading`,this.fieldLayoutError=null,this.dispatchEvent(new CustomEvent(`vizy-retry-field-layout`,{bubbles:!0,composed:!0,detail:{blockUid:this.blockUid}}))};#A(){return this.layoutTabLabels.length<2?r:n`
            <div class="layout-tabs" role="tablist" part="layout-tabs" aria-label="Layout tabs">
                ${this.layoutTabLabels.map((e,t)=>n`
                    <button
                        type="button"
                        class="layout-tab ${t===this.activeLayoutTab?`is-active`:``}"
                        role="tab"
                        aria-selected=${String(t===this.activeLayoutTab)}
                        data-vizy-layout-tab-index=${t}
                        @click=${()=>this.#M(t)}
                    >${e}</button>
                `)}
            </div>
            <select
                class="layout-tab-select"
                part="layout-tab-select"
                aria-label="Layout tab"
                .value=${String(this.activeLayoutTab)}
                @change=${e=>{let t=Number(e.target.value);this.#M(Number.isFinite(t)?t:0)}}
            >
                ${this.layoutTabLabels.map((e,t)=>n`
                    <option value=${t}>${e}</option>
                `)}
            </select>
        `}#j(){return r}#M(e){e!==this.activeLayoutTab&&(this.activeLayoutTab=e,this.dispatchEvent(new CustomEvent(`vizy-layout-tab-change`,{bubbles:!0,composed:!0,detail:{index:e}})))}#N(){!this.enabled&&this.collapsed||this.#P(!this.collapsed,{animate:!0,persist:!0})}#P(e,t){if(e===this.collapsed)return;let n=t.persist!==!1;if(this.#w?.abort(),this.#w=null,this.#I(),this.#L(),!t.animate||Kt()||!Yt()){this.setAttribute(`data-collapse-instant`,``),this.collapsed=e,this.toggleAttribute(`collapsed`,e),this.removeAttribute(`data-collapse-animating`),this.#R(e,n),requestAnimationFrame(()=>{this.removeAttribute(`data-collapse-instant`)});return}let r=new AbortController;this.#w=r,r.signal.addEventListener(`abort`,()=>this.#I(),{once:!0}),this.#F(e,r.signal,n)}async#F(e,t,n){let r=this.renderRoot.querySelector(`[part=body]`),i=this.renderRoot.querySelector(`header`);if(!r||!i){this.collapsed=e,this.toggleAttribute(`collapsed`,e),this.#R(e,n);return}if(e){let e=this.getBoundingClientRect().height;if(this.style.height=`${e}px`,this.style.overflow=`hidden`,this.setAttribute(`data-collapse-animating`,``),this.collapsed=!0,this.toggleAttribute(`collapsed`,!0),this.#R(!0,n),await this.updateComplete,t.aborted)return;let a=i.getBoundingClientRect().height;await Promise.all([Zt(this,{height:a},{duration:Qt}),Zt(r,{opacity:0},{duration:Qt})])}else{let e=this.getBoundingClientRect().height;if(this.style.height=`${e}px`,this.style.overflow=`hidden`,this.setAttribute(`data-collapse-animating`,``),this.collapsed=!1,this.toggleAttribute(`collapsed`,!1),this.#R(!1,n),await this.updateComplete,t.aborted)return;r.style.opacity=`0`,this.style.height=`auto`;let i=this.getBoundingClientRect().height;this.style.height=`${e}px`,this.offsetHeight,await Promise.all([Zt(this,{height:i},{duration:Qt}),Zt(r,{opacity:1},{duration:Qt})])}t.aborted||(this.#L(),this.removeAttribute(`data-collapse-animating`),this.#w?.signal===t&&(this.#w=null))}#I(){Xt(this);let e=this.renderRoot.querySelector(`[part=body]`);e&&Xt(e)}#L(){this.style.height=``,this.style.overflow=``;let e=this.renderRoot.querySelector(`[part=body]`);e&&(e.style.height=``,e.style.overflow=``,e.style.opacity=``,e.style.display=``)}#R(e,t){this.dispatchEvent(new CustomEvent(`vizy-collapse-change`,{bubbles:!0,composed:!0,detail:{collapsed:e,persist:t}}))}#z(e){if(e.button!==0)return;let t=e.composedPath();t.some(e=>e instanceof HTMLElement&&(e.matches(`[data-vizy-drag-handle]`)||e.closest(`[data-vizy-drag-handle]`)!=null))||t.some(e=>e instanceof HTMLElement&&e.matches(`button, select, a, input, textarea, pk-dropdown-menu, pk-dropdown-item, pk-button`))||(zt(e),this.dispatchEvent(new CustomEvent(`vizy-block-header-activate`,{bubbles:!0,composed:!0})))}#B(e){let t=e.target;t instanceof Element&&(t.closest(`button, select, a, input, textarea, pk-dropdown-menu, pk-dropdown-item`)||(e.preventDefault(),this.#N()))}#V=e=>{e.target===e.currentTarget&&(this.menuClosing=!0)};#H=e=>{e.target===e.currentTarget&&(this.menuClosing=!1)};#U=e=>{let t=!!e.detail?.open;t!==this.menuOpen&&(this.menuOpen=t,this.dispatchEvent(new CustomEvent(`vizy-menu-change`,{bubbles:!0,composed:!0,detail:{open:t}})))};#W=e=>{let t=e.detail?.value;if(!t)return;if(t===`toggleCollapse`){this.#N();return}let n=this.shadowRoot?.querySelector(`[part="menu-trigger"]`)??void 0;this.dispatchEvent(new CustomEvent(`vizy-block-action`,{bubbles:!0,composed:!0,detail:{action:t,invoker:n}}))}};P([c({attribute:`data-block-uid`,reflect:!0})],F.prototype,`blockUid`,null),P([c({type:Boolean,reflect:!0})],F.prototype,`selected`,null),P([c({type:Boolean,reflect:!0})],F.prototype,`enabled`,null),P([c({attribute:`accent-color`,reflect:!0})],F.prototype,`accentColor`,null),P([c({attribute:!1})],F.prototype,`typeIconSvg`,null),P([c({type:Boolean,reflect:!0})],F.prototype,`unresolved`,null),P([c({type:Boolean,reflect:!0})],F.prototype,`disabled`,null),P([c({type:Boolean,reflect:!0})],F.prototype,`dragging`,null),P([c({type:Number})],F.prototype,`errorCount`,null),P([c({type:Number})],F.prototype,`descendantErrorCount`,null),P([c({type:String})],F.prototype,`title`,null),P([c({type:String})],F.prototype,`subtitle`,null),P([c({type:String})],F.prototype,`typeName`,null),P([c({type:String})],F.prototype,`addAboveLabel`,null),P([c({type:Boolean})],F.prototype,`canAddAbove`,null),P([c({type:Boolean,reflect:!0,attribute:`expects-field-layout`})],F.prototype,`expectsFieldLayout`,null),P([c({attribute:`field-layout`,reflect:!0})],F.prototype,`fieldLayoutState`,null),P([c({attribute:!1})],F.prototype,`fieldLayoutError`,null),P([a()],F.prototype,`fieldLayoutRetrying`,null),P([c({attribute:!1})],F.prototype,`layoutTabLabels`,null),P([a()],F.prototype,`collapsed`,null),P([a()],F.prototype,`menuOpen`,null),P([a()],F.prototype,`menuClosing`,null),P([a()],F.prototype,`activeLayoutTab`,null),F=P([N(`vizy-block`)],F);var $t=[p(),d(`.button`),m(),f(`.button`),o`
    @layer pk-component {
        :host {
            display: inline-flex;
            vertical-align: middle;
            font-family: var(--pk-font-family);
            font-size: var(--pk-font-size-base);
            line-height: var(--pk-line-height);
        }

        .button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.25rem;
            min-width: 2rem;
            height: 2rem;
            margin: 0;
            padding: 0 0.5rem;
            border: 0;
            border-radius: var(--pk-radius-lg);
            background: transparent;
            color: inherit;
            font: inherit;
            line-height: 1.4;
            white-space: nowrap;
            cursor: pointer;
            user-select: none;
            appearance: none;
            transition: background-color 0.12s ease, box-shadow 0.12s ease;
        }

        .button:focus {
            outline: none;
        }

        .button:focus-visible {
            box-shadow: var(--pk-shadow-focus);
        }

        .button[aria-pressed='true'],
        .button[data-state='on'] {
            background: var(--pk-color-slate-250);
        }

        .button:hover:not(:disabled) {
            background: var(--pk-color-slate-250);
        }

        .button:disabled {
            cursor: not-allowed;
            opacity: 0.5;
            pointer-events: none;
        }

        :host([variant='outline']) .button {
            border: 1px solid var(--pk-color-slate-300);
            background: transparent;
            color: var(--pk-color-gray-700);
        }

        :host([variant='outline']) .button:hover:not(:disabled),
        :host([variant='outline']) .button[aria-pressed='true'],
        :host([variant='outline']) .button[data-state='on'],
        :host([variant='outline'][pressed]) .button {
            background: var(--pk-color-slate-250);
        }

        :host([size='sm']) .button {
            min-width: 1.75rem;
            height: 1.75rem;
            padding-inline: 0.375rem;
            font-size: 0.8rem;
            border-radius: min(var(--pk-radius-md), 12px);
        }

        :host([size='lg']) .button {
            min-width: 2.25rem;
            height: 2.25rem;
            padding-inline: 0.625rem;
        }

        .button ::slotted(svg) {
            width: 1rem;
            height: 1rem;
            flex-shrink: 0;
            pointer-events: none;
        }

        :host([data-pk-group-join]) .button:focus-visible {
            z-index: 1;
            position: relative;
        }

        :host([data-pk-group-join][size='sm'][data-pk-group-item-first][data-pk-group-orientation='horizontal']) .button {
            border-top-left-radius: min(var(--pk-radius-md), 12px);
            border-bottom-left-radius: min(var(--pk-radius-md), 12px);
        }

        :host([data-pk-group-join][size='sm'][data-pk-group-item-last][data-pk-group-orientation='horizontal']) .button {
            border-top-right-radius: min(var(--pk-radius-md), 12px);
            border-bottom-right-radius: min(var(--pk-radius-md), 12px);
        }

        :host([data-pk-group-join][size='sm'][data-pk-group-item-first][data-pk-group-orientation='vertical']) .button {
            border-top-left-radius: min(var(--pk-radius-md), 12px);
            border-top-right-radius: min(var(--pk-radius-md), 12px);
        }

        :host([data-pk-group-join][size='sm'][data-pk-group-item-last][data-pk-group-orientation='vertical']) .button {
            border-bottom-left-radius: min(var(--pk-radius-md), 12px);
            border-bottom-right-radius: min(var(--pk-radius-md), 12px);
        }

        :host([data-tg-orientation='vertical']) {
            display: block;
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
        }

        :host([data-tg-orientation='vertical']) .button {
            width: 100%;
            box-sizing: border-box;
        }

        :host([data-pk-group-orientation='vertical']) {
            display: block;
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
        }

        :host([data-pk-group-orientation='vertical']) .button {
            width: 100%;
            box-sizing: border-box;
        }

        :host-context(pk-button-group[exclusive]):host([pressed]) .button:focus-visible {
            box-shadow: var(--pk-shadow-focus-outset, var(--pk-shadow-focus));
        }

        :host-context(pk-button-group[exclusive]):host([variant='outline']:not([pressed])) .button {
            background: var(--pk-action-fill);
            border-color: transparent;
        }

        :host-context(pk-button-group[exclusive]):host([variant='outline'][pressed]) .button {
            border-color: transparent;
        }

        :host-context(pk-button-group[exclusive]):host([variant='outline']) .button {
            border-radius: 0;
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
    }
    `,o`
        :host([data-pk-group-join][data-pk-group-item-first][data-pk-group-orientation='horizontal'][variant='outline']) .button {
            border-left: 1px solid var(--pk-color-slate-300);
        }

        :host([data-pk-group-join][data-pk-group-item-first][data-pk-group-orientation='vertical'][variant='outline']) .button {
            border-top: 1px solid var(--pk-color-slate-300);
        }
    `],en=class extends l{constructor(...e){super(...e),this.pressed=!1,this.disabled=!1,this.variant=`default`,this.size=`default`,this.value=``,this.ariaLabel=null}static{this.shadowRootOptions={mode:`open`,delegatesFocus:!0}}static{this.styles=$t}handleClick(){this.disabled||this.closest(`pk-toggle-group`)||(this.pressed=!this.pressed,this.dispatchEvent(new CustomEvent(`pk-pressed-change`,{detail:{pressed:this.pressed},bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0})))}render(){return n`
            <button
                part="base"
                class="button"
                type="button"
                ?disabled=${this.disabled}
                aria-pressed=${this.pressed?`true`:`false`}
                aria-label=${this.ariaLabel??r}
                data-state=${this.pressed?`on`:`off`}
                @click=${this.handleClick}
            >
                <slot></slot>
            </button>
        `}};i([c({type:Boolean,reflect:!0})],en.prototype,`pressed`,void 0),i([c({type:Boolean,reflect:!0})],en.prototype,`disabled`,void 0),i([c({reflect:!0})],en.prototype,`variant`,void 0),i([c({reflect:!0})],en.prototype,`size`,void 0),i([c({attribute:`data-value`})],en.prototype,`value`,void 0),i([c({attribute:`aria-label`})],en.prototype,`ariaLabel`,void 0),en=i([s(`pk-toggle`)],en);var tn=o`
    @layer pk-component {
        :host {
            display: inline-flex;
            vertical-align: middle;
            font-family: var(--pk-font-family);
            font-size: var(--pk-font-size-base);
            line-height: var(--pk-line-height);
        }

        .group {
            display: inline-flex;
            width: fit-content;
            align-items: center;
            border-radius: var(--pk-radius-lg);
            gap: calc(var(--pk-toggle-group-spacing, 0) * 0.25rem);
        }

        :host([size='sm']) .group {
            border-radius: min(var(--pk-radius-md), 10px);
        }

        :host([orientation='vertical']) .group {
            flex-direction: column;
            align-items: stretch;
        }
    }
`,nn=`data-pk-group-join`,rn=`data-pk-group-item-first`,an=`data-pk-group-item-last`,on=`data-pk-group-orientation`,sn=`data-tg-orientation`,cn=class extends l{constructor(...e){super(...e),this.orientation=`horizontal`,this.variant=`default`,this.size=`default`,this.spacing=0,this.joined=!0,this.multiple=!1,this.value=[],this.items=[],this.syncItems=()=>{let e=this.shadowRoot?.querySelector(`slot`);e&&(this.items=e.assignedElements({flatten:!0}),this.applyGroupProps(),this.syncGroupLayout(),this.applySelection())},this.handleClick=e=>{let t=e.target.closest(`[data-value]`);if(!t||!this.items.includes(t)||this.isItemDisabled(t))return;e.preventDefault();let n=this.getItemValue(t);n&&(this.value=this.multiple?this.value.includes(n)?this.value.filter(e=>e!==n):[...this.value,n]:this.value.includes(n)?[]:[n],this.applySelection(),this.dispatchEvent(new CustomEvent(`pk-value-change`,{detail:{value:[...this.value]},bubbles:!0,composed:!0})))}}static{this.styles=tn}connectedCallback(){super.connectedCallback(),this.syncJoinedFromSpacing(),this.addEventListener(`click`,this.handleClick),this.addEventListener(`slotchange`,this.syncItems)}disconnectedCallback(){this.removeEventListener(`click`,this.handleClick),this.removeEventListener(`slotchange`,this.syncItems),super.disconnectedCallback()}updated(e){e.has(`spacing`)&&this.syncJoinedFromSpacing(),e.has(`joined`)&&!e.has(`spacing`)&&(this.spacing=this.joined?0:2),(e.has(`variant`)||e.has(`size`)||e.has(`spacing`)||e.has(`orientation`))&&this.syncGroupLayout(),e.has(`value`)&&this.items.length&&this.applySelection()}clearLayoutAttrs(e){e.removeAttribute(nn),e.removeAttribute(rn),e.removeAttribute(an),e.removeAttribute(on),e.removeAttribute(sn)}syncGroupLayout(){for(let e of this.items)this.clearLayoutAttrs(e);for(let e of this.items)this.orientation!==`horizontal`&&e.setAttribute(sn,this.orientation);if(this.spacing===0)for(let e=0;e<this.items.length;e++){let t=this.items[e];t.setAttribute(on,this.orientation),t.setAttribute(nn,``),e===0&&t.setAttribute(rn,``),e===this.items.length-1&&t.setAttribute(an,``)}}syncJoinedFromSpacing(){this.joined=this.spacing===0}applyGroupProps(){for(let e of this.items)e.tagName===`PK-TOGGLE`&&(e.setAttribute(`variant`,this.variant),e.setAttribute(`size`,this.size))}getItemValue(e){return e.getAttribute(`data-value`)??e.dataset.value??null}isItemDisabled(e){return e.hasAttribute(`disabled`)||e.matches(`:disabled`)}applySelection(){for(let e of this.items){let t=this.getItemValue(e);if(!t)continue;let n=this.value.includes(t);e.setAttribute(`aria-pressed`,n?`true`:`false`),e.tagName===`PK-TOGGLE`&&(n?e.setAttribute(`pressed`,``):e.removeAttribute(`pressed`))}}render(){return n`
            <div
                part="base"
                class="group"
                role="group"
                style=${`--pk-toggle-group-spacing: ${this.spacing}`}
                @slotchange=${this.syncItems}
            >
                <slot></slot>
            </div>
        `}};i([c({reflect:!0})],cn.prototype,`orientation`,void 0),i([c({reflect:!0})],cn.prototype,`variant`,void 0),i([c({reflect:!0})],cn.prototype,`size`,void 0),i([c({type:Number,reflect:!0})],cn.prototype,`spacing`,void 0),i([c({type:Boolean,reflect:!0})],cn.prototype,`joined`,void 0),i([c({type:Boolean})],cn.prototype,`multiple`,void 0),i([c({type:Array,attribute:!1})],cn.prototype,`value`,void 0),i([a()],cn.prototype,`items`,void 0),cn=i([s(`pk-toggle-group`)],cn);var ln={paragraph:`paragraph`,heading:`heading`,bulletList:`list-ul`,orderedList:`list-ol`,blockquote:`quote-right`,codeBlock:`code`,hardBreak:`file-dashed-line`,horizontalRule:`minus`,image:`eye`,table:`table`},un=class extends t{#e=[];get items(){return this.#e}set items(e){this.#e=e}#t=null;get activeId(){return this.#t}set activeId(e){this.#t=e}#n=``;get query(){return this.#n}set query(e){this.#n=e}#r=`vizy-insertion-list`;get listId(){return this.#r}set listId(e){this.#r=e}#i=!0;get filterable(){return this.#i}set filterable(e){this.#i=e}#a=!1;get revealActive(){return this.#a}set revealActive(e){this.#a=e}#o=!0;get showViewToggle(){return this.#o}set showViewToggle(e){this.#o=e}#s=`list`;get view(){return this.#s}set view(e){this.#s=e}#c=null;get previewUrl(){return this.#c}set previewUrl(e){this.#c=e}static styles=o`
        /*
         * Panel UI matches Plugin Kit pk-dropdown-menu (size sm triggers in
         * the field toolbar): no CSS border — the 1px ring is inside
         * --pk-shadow-popup — and the same scale+fade enter/exit. Keeps the
         * filterable insertion palette visually identical to Formatting /
         * Alignment while staying on pk-popup + this list (role map).
         */
        :host {
            display: flex;
            flex-direction: column;
            position: relative;
            /* ~set-picker width: ~288px reference → slightly tighter at 280px. */
            width: 17.5rem;
            min-width: 17.5rem;
            max-width: 17.5rem;
            max-height: 20rem;
            /* Clip here; options scroll in .scroll-body so the bar never uses sticky
             * (momentum on trackpad/phone can detach sticky mid-inertia). */
            overflow: hidden;
            margin: 0;
            padding: 4px 0;
            border: 0;
            border-radius: var(--pk-radius-md, 4px);
            background: var(--pk-color-white, #fff);
            box-shadow: var(
                --pk-shadow-popup,
                0 0 0 1px rgba(31, 41, 51, 0.1),
                0 5px 20px rgba(31, 41, 51, 0.25)
            );
            font: inherit;
            color: var(--text-color, var(--pk-color-gray-700, #3f4d5a));
            z-index: 100;
            transform-origin: var(--pk-transform-origin, top);
        }
        /*
         * Hold opacity at 0 until data-open — pk-popup flips visibility as soon
         * as .positioned lands, one frame before we can start enter motion.
         * Without this gate the panel flashes solid then re-animates from 0.
         * Exit uses named hide keyframes (not reverse) so cancelling enter does
         * not fire the same animationend close() treats as hide-complete.
         */
        :host(:not([data-open]):not(.closing)) {
            opacity: 0;
            pointer-events: none;
        }
        :host([data-open]:not(.closing)) {
            opacity: 1;
            pointer-events: auto;
            animation: vizy-insertion-menu-show 100ms ease;
        }
        /* Hard line-switch: show at rest, no enter replay. */
        :host([data-open][data-instant]:not(.closing)) {
            animation: none;
        }
        :host(.closing) {
            animation: vizy-insertion-menu-hide 100ms ease forwards;
        }
        @keyframes vizy-insertion-menu-show {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
        @keyframes vizy-insertion-menu-hide {
            from {
                opacity: 1;
                transform: scale(1);
            }
            to {
                opacity: 0;
                transform: scale(0.9);
            }
        }
        .search-row {
            flex: 0 0 auto;
            display: flex;
            gap: 0.35rem;
            align-items: center;
            padding: 0 4px 4px;
            background: var(--pk-color-white, #fff);
            border-bottom: 1px solid var(--pk-color-gray-100, #e4edf6);
        }
        .scroll-body {
            flex: 1 1 auto;
            min-height: 0;
            overflow: auto;
            overscroll-behavior: contain;
            -webkit-overflow-scrolling: touch;
        }
        .search-row .filter {
            flex: 1 1 auto;
            min-width: 0;
            display: flex;
            align-items: center;
            gap: 0.2rem;
            padding: 0 0.3rem;
            border: 1px solid transparent;
            border-radius: var(--pk-input-border-radius, 4px);
            background: transparent;
            transition: border-color 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
        }
        .search-row .filter pk-icon {
            flex: 0 0 auto;
            display: block;
            width: 0.875rem;
            height: 0.875rem;
            font-size: 0.875rem;
            color: var(--pk-color-gray-400, #9aa5b1);
            pointer-events: none;
        }
        /* Borderless resting field — outline only paints on focus. */
        .search-row .filter input[type='search'] {
            display: block;
            box-sizing: border-box;
            flex: 1 1 auto;
            width: 100%;
            min-width: 0;
            margin: 0;
            padding: 5px 2px;
            border: 0;
            border-radius: 0;
            background: transparent;
            color: var(--pk-color-gray-700, #3f4d5a);
            font: inherit;
            font-size: 0.8125rem;
            line-height: 1.4;
            outline: none;
            appearance: none;
        }
        .search-row .filter input[type='search']::-webkit-search-decoration,
        .search-row .filter input[type='search']::-webkit-search-cancel-button {
            appearance: none;
        }
        .search-row .filter input[type='search']::placeholder {
            color: var(--pk-color-gray-400, #9aa5b1);
        }
        .search-row .filter:focus-within {
            border-color: var(--pk-color-sky-600, #0284c7);
            box-shadow: var(--pk-input-focus-shadow, 0 0 0 1px var(--pk-color-sky-600, #0284c7));
            background: var(--pk-color-white, #fff);
        }
        .view-toggle {
            flex: 0 0 auto;
            align-self: stretch;
            display: inline-flex;
            align-items: stretch;
        }
        /* Same height as the Search field beside it. */
        .view-toggle pk-toggle::part(base) {
            box-sizing: border-box;
            height: var(--pk-btn-height-default, 2.125rem);
            min-height: var(--pk-btn-height-default, 2.125rem);
            min-width: var(--pk-btn-height-default, 2.125rem);
        }
        .view-toggle pk-icon {
            display: block;
            width: 0.875rem;
            height: 0.875rem;
            font-size: 0.875rem;
        }
        [part=status] {
            padding: 0.5rem 0.625rem;
            color: var(--pk-color-gray-550, #596673);
            font-size: 0.8125rem;
        }
        .group-label {
            padding: 0 0.5rem;
            font-size: 0.6rem;
            font-weight: 600;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            color: var(--pk-color-gray-550, #596673);
        }
        ul {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        li { margin: 0; }
        button.option {
            display: flex;
            width: 100%;
            gap: 0.5rem;
            align-items: center;
            border: 0;
            background: transparent;
            color: inherit;
            text-align: left;
            padding: 0.35rem 0.5rem;
            cursor: pointer;
            font: inherit;
            font-size: 0.8125rem;
            line-height: 1.35;
        }
        /* pk-combobox option highlight token — not Vizy panel blue wash. */
        button.option:hover,
        button.option:focus-visible,
        button.option[data-active='true'] {
            background: var(--pk-color-slate-100, rgba(96, 125, 159, 0.1));
            outline: none;
        }
        .glyph {
            flex: 0 0 auto;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 1.125rem;
            height: 1.125rem;
            color: var(--vizy-block-accent-color, var(--pk-color-gray-550, #596673));
            font-size: 0.875rem;
            font-weight: 600;
            line-height: 1;
        }
        .glyph pk-icon,
        .glyph svg {
            display: block;
            width: 1em;
            height: 1em;
            font-size: 1em;
            fill: currentColor;
        }
        .label { font-weight: 500; min-width: 0; }
        .hover-preview {
            position: fixed;
            z-index: 1000;
            width: min(16rem, 40vw);
            max-height: 12rem;
            padding: 0.35rem;
            border-radius: var(--pk-radius-md, 4px);
            background: var(--pk-color-white, #fff);
            box-shadow: var(
                --pk-shadow-popup,
                0 0 0 1px rgba(31, 41, 51, 0.1),
                0 5px 20px rgba(31, 41, 51, 0.25)
            );
            pointer-events: none;
        }
        .hover-preview img {
            display: block;
            width: 100%;
            max-height: 11rem;
            object-fit: contain;
            border-radius: 2px;
        }
        .visually-hidden {
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
    `;focusFilter(){let e=this.shadowRoot?.querySelector(`input[type="search"]`);return!e||getComputedStyle(e).visibility===`hidden`?!1:(e.focus({preventScroll:!0}),this.shadowRoot?.activeElement===e||document.activeElement===this)}async focusFilterWhenReady(){await this.updateComplete,await this.#l(2e3),!this.focusFilter()&&(await new Promise(e=>requestAnimationFrame(()=>e())),this.focusFilter())}#l(e){return new Promise(t=>{let n=performance.now(),r=()=>{let i=this.shadowRoot?.querySelector(`input[type="search"]`);if(i&&getComputedStyle(i).visibility!==`hidden`){t();return}if(performance.now()-n>=e){t();return}requestAnimationFrame(r)};r()})}render(){let e=this.#u(),t=this.filterable||this.showViewToggle;return n`
            ${t?n`
                <div class="search-row">
                    ${this.filterable?n`
                        <div class="filter">
                            <pk-icon icon="magnifying-glass" label=""></pk-icon>
                            <input
                                type="search"
                                placeholder="Search…"
                                .value=${this.query}
                                aria-label="Search Blocks"
                                @input=${this.#v}
                                @keydown=${this.#y}
                            />
                        </div>
                    `:r}
                    ${this.showViewToggle?n`
                        <pk-toggle-group
                            class="view-toggle"
                            variant="outline"
                            spacing="0"
                            aria-label="View"
                            .value=${[this.view]}
                            @mousedown=${e=>e.preventDefault()}
                            @pk-value-change=${this.#_}
                        >
                            <pk-toggle data-value="list" aria-label="List view">
                                <pk-icon icon="list" label=""></pk-icon>
                            </pk-toggle>
                            <pk-toggle data-value="grid" aria-label="Grid view">
                                <pk-icon icon="grid-2" label=""></pk-icon>
                            </pk-toggle>
                        </pk-toggle-group>
                    `:r}
                </div>
            `:r}
            <div class="scroll-body">
                ${this.items.length?n`
                    <div part="status" class="visually-hidden" aria-live="polite">
                        ${this.items.length} result${this.items.length===1?``:`s`}
                    </div>
                    ${e.map(([e,t])=>n`
                        <div class="group-label">${e}</div>
                        <ul part="list" role="listbox" id=${this.listId} aria-label=${e}>
                            ${t.map(e=>n`
                                <li role="presentation">
                                    <button
                                        type="button"
                                        class="option"
                                        role="option"
                                        id=${`${this.listId}-${e.item.id}`}
                                        aria-selected=${String(this.revealActive&&e.item.id===this.activeId)}
                                        data-active=${this.revealActive&&e.item.id===this.activeId?`true`:`false`}
                                        @mousedown=${e=>e.preventDefault()}
                                        @mouseenter=${()=>this.#m(e)}
                                        @focus=${()=>this.#m(e)}
                                        @mouseleave=${()=>{this.previewUrl=null}}
                                        @click=${()=>this.#b(e.item.id)}
                                    >
                                        <span
                                            class="glyph"
                                            aria-hidden="true"
                                            style=${e.item.icon?.color?`--vizy-block-accent-color: ${e.item.icon.color}`:``}
                                        >${this.#d(e)}</span>
                                        <span class="label">${e.item.label}</span>
                                    </button>
                                </li>
                            `)}
                        </ul>
                    `)}
                `:n`
                    <div part="status" role="status" aria-live="polite">
                        ${this.query?`No results for “${this.query}”`:`No insertions available`}
                    </div>
                `}
            </div>
            ${this.previewUrl?n`
                <div class="hover-preview" style=${this.#h()} aria-hidden="true">
                    <img src=${this.previewUrl} alt="" />
                </div>
            `:r}
        `}#u(){let e=new Map;for(let t of this.items){let n=t.item.group||`Other`,r=e.get(n)??[];r.push(t),e.set(n,r)}return[...e.entries()]}#d(e){if(e.item.kind===`block`)return this.#f(e);let t=e.item.icon?.svg?.trim();if(t)return te(t);let r=this.#p(e);if(r)return n`<pk-icon icon=${r} label=""></pk-icon>`;let i=e.item.label.trim();return i?e.item.nodeName===`heading`?`H`:e.item.nodeName===`bulletList`?`•`:e.item.nodeName===`orderedList`?`1`:i.slice(0,1).toUpperCase():`?`}#f(e){let t=e.item.icon?.svg?.trim(),r=e.item.icon?.name?.trim();return t&&r!==`vizy-block-fallback`?te(t):n`<pk-icon icon=${h} label=""></pk-icon>`}#p(e){return e.item.nodeName&&ln[e.item.nodeName]?ln[e.item.nodeName]:e.item.icon?.name?.trim()||null}#m(e){let t=e.item.previewImageUrl?.trim();this.previewUrl=t||null}#h(){let e=this.getBoundingClientRect(),t=Math.min(e.right+8,window.innerWidth-16-256),n=Math.max(8,Math.min(e.top,window.innerHeight-200));return`left:${Math.max(8,t)}px;top:${n}px;`}#g(e){(e!==this.view||e!==`list`)&&(this.view=e,this.dispatchEvent(new CustomEvent(`vizy-insertion-view`,{bubbles:!0,composed:!0,detail:{view:e}})))}#_=e=>{let t=e.detail?.value?.[0];if(t===`list`||t===`grid`){this.#g(t);return}let n=e.currentTarget;n.value=[this.view]};#v=e=>{let t=e.target.value;this.query=t,this.dispatchEvent(new CustomEvent(`vizy-insertion-filter`,{bubbles:!0,composed:!0,detail:{query:t}}))};#y=e=>{(e.key===`ArrowDown`||e.key===`ArrowUp`||e.key===`Enter`)&&e.stopPropagation()};#b(e){this.dispatchEvent(new CustomEvent(`vizy-insertion-select`,{bubbles:!0,composed:!0,detail:{id:e}}))}};P([c({attribute:!1})],un.prototype,`items`,null),P([c({attribute:`active-id`})],un.prototype,`activeId`,null),P([c()],un.prototype,`query`,null),P([c({attribute:`list-id`})],un.prototype,`listId`,null),P([c({type:Boolean})],un.prototype,`filterable`,null),P([c({type:Boolean,attribute:`reveal-active`})],un.prototype,`revealActive`,null),P([c({type:Boolean,attribute:`show-view-toggle`})],un.prototype,`showViewToggle`,null),P([c()],un.prototype,`view`,null),P([a()],un.prototype,`previewUrl`,null),un=P([N(`vizy-insertion-list`)],un);function dn(e,t){let n=e.state.doc.resolve(t);for(let e=n.depth;e>=1;e--){let t=n.node(e);if(t.type.name===`layout`)return{layoutPos:n.before(e),node:t}}return null}function fn(e,t,n,r){let i=e.state.doc.nodeAt(t);if(!i||i.type.name!==`layout`)return!1;let a=i.child(n);return a?tt(e,String(a.attrs.columnUid),r):!1}var pn=class extends t{#e=``;get layoutUid(){return this.#e}set layoutUid(e){this.#e=e}#t=`small`;get stack(){return this.#t}set stack(e){this.#t=e}#n=null;get layoutPos(){return this.#n}set layoutPos(e){this.#n=e}#r=null;get editor(){return this.#r}set editor(e){this.#r=e}#i=[];get columnSpans(){return this.#i}set columnSpans(e){this.#i=e}#a=[];get columnUids(){return this.#a}set columnUids(e){this.#a=e}static styles=[At,o`
        /* Flex — not block — so ProseMirror break-spaces does not paint Lit
           template newlines as multi-line blank height. */
        :host {
            display: flex;
            flex-direction: column;
            margin: 0.5rem 0;
        }
        /* Columns live in the light-DOM contentDOM (ProseMirror parent of every
           vizy-column). That wrapper is the only slotted node — so the 12-col
           grid MUST be on it, not on this shadow .grid. */
        .grid-shell {
            display: flex;
            flex-direction: column;
            position: relative;
        }
        .grid {
            display: block;
            width: 100%;
            min-width: 0;
        }
        ::slotted(.vizy-layout-columns) {
            display: grid;
            grid-template-columns: repeat(12, minmax(0, 1fr));
            gap: 0.75rem;
            width: 100%;
            min-height: 0;
            align-items: start;
            box-sizing: border-box;
        }
    `];render(){return n`<div class="grid-shell" part="grid-shell"><div class="grid" part="grid"><slot name="columns"></slot></div></div>`}moveColumn(e,t){this.editor!=null&&this.layoutPos!=null&&fn(this.editor,this.layoutPos,e,t)}};P([c({type:String,reflect:!0})],pn.prototype,`layoutUid`,null),P([c({type:String,reflect:!0})],pn.prototype,`stack`,null),P([c({attribute:!1})],pn.prototype,`layoutPos`,null),P([c({attribute:!1})],pn.prototype,`editor`,null),P([c({attribute:!1})],pn.prototype,`columnSpans`,null),P([c({attribute:!1})],pn.prototype,`columnUids`,null),pn=P([N(`vizy-layout`)],pn);var mn=class extends t{#e=``;get columnUid(){return this.#e}set columnUid(e){this.#e=e}#t=12;get span(){return this.#t}set span(e){this.#t=e}#n=0;get columnIndex(){return this.#n}set columnIndex(e){this.#n=e}#r=1;get columnCount(){return this.#r}set columnCount(e){this.#r=e}static styles=[At,o`
        /* Border is also set in vizy.css on the host — light DOM wins for CP
           visibility. Keep packing tight; no min-height well. */
        :host {
            display: flex;
            flex-direction: column;
            min-width: 0;
            min-height: 0;
            box-sizing: border-box;
            padding: 0.375rem 0.5rem;
            background: var(--pk-color-white, #fff);
        }
        [part=column] {
            display: flex;
            flex-direction: column;
            flex: 1 1 auto;
            min-height: 0;
            min-width: 0;
        }
    `];render(){return n`<div part="column"><slot name="content"></slot></div>`}};P([c({type:String,reflect:!0})],mn.prototype,`columnUid`,null),P([c({type:Number,reflect:!0})],mn.prototype,`span`,null),P([c({type:Number,reflect:!0})],mn.prototype,`columnIndex`,null),P([c({type:Number,reflect:!0})],mn.prototype,`columnCount`,null),mn=P([N(`vizy-column`)],mn);var hn=class extends t{#e=[];get presets(){return this.#e}set presets(e){this.#e=e}static styles=o`
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
    `;render(){return n`
            <h3>Choose layout</h3>
            <div class="grid" role="listbox" aria-label="Layout presets">
                ${this.presets.map(e=>n`
                    <button
                        type="button"
                        role="option"
                        aria-label=${e.accessibleLabel}
                        @mousedown=${e=>e.preventDefault()}
                        @click=${()=>this.#t(e.id)}
                    >
                        <span class="label">${e.label}</span>
                        <span class="preview" aria-hidden="true">
                            ${e.spans.map(e=>n`
                                <span style=${`grid-column: span ${e}`}></span>
                            `)}
                        </span>
                    </button>
                `)}
            </div>
        `}#t(e){this.dispatchEvent(new CustomEvent(`vizy-layout-preset-select`,{bubbles:!0,composed:!0,detail:{presetId:e}}))}};P([c({attribute:!1})],hn.prototype,`presets`,null),hn=P([N(`vizy-layout-preset-chooser`)],hn);var gn=class{#e=null;#t=null;open(e,t,n,r){this.close();let i=document.createElement(`vizy-layout-preset-chooser`);i.presets=t;let a=document.createElement(`pk-popup`);a.className=`vizy-layout-preset-popup`,a.placement=`bottom-start`,a.distance=4,a.flip=!0,a.shift=!0,a.positionMethod=`fixed`,a.anchor=this.#n(e),a.append(i),document.body.append(a);let o={popup:a,chooser:i,returnFocus:r.returnFocus??null,onClose:r.onClose??(()=>void 0)};this.#e=o,a.active=!0;let s=!1,c=e=>{s=!0,r.onSelect(e),this.close()};i.addEventListener(`vizy-layout-preset-select`,(e=>{c(e.detail.presetId)}));let l=e=>{e.key===`Escape`&&(e.preventDefault(),this.close())},u=e=>{let t=e.composedPath();t.includes(a)||t.includes(i)||this.close()};document.addEventListener(`keydown`,l,!0),document.addEventListener(`pointerdown`,u,!0),this.#t=()=>{document.removeEventListener(`keydown`,l,!0),document.removeEventListener(`pointerdown`,u,!0)},o.onClose=()=>{s||r.onClose?.()}}close(){this.#t?.(),this.#t=null;let e=this.#e;this.#e=null,e&&(e.popup.active=!1,e.popup.remove(),e.returnFocus?.focus(),e.onClose())}get isOpen(){return this.#e!==null}#n(e){return{getBoundingClientRect:()=>e}}},_n=`aaa1rp3bb0ott3vie4c1le2ogado5udhabi7c0ademy5centure6ountant0s9o1tor4d0s1ult4e0g1ro2tna4f0l1rica5g0akhan5ency5i0g1rbus3force5tel5kdn3l0ibaba4pay4lfinanz6state5y2sace3tom5m0azon4ericanexpress7family11x2fam3ica3sterdam8nalytics7droid5quan4z2o0l2partments8p0le4q0uarelle8r0ab1mco4chi3my2pa2t0e3s0da2ia2sociates9t0hleta5torney7u0ction5di0ble3o3spost5thor3o0s4w0s2x0a2z0ure5ba0by2idu3namex4d1k2r0celona5laycard4s5efoot5gains6seball5ketball8uhaus5yern5b0c1t1va3cg1n2d1e0ats2uty4er2rlin4st0buy5t2f1g1h0arti5i0ble3d1ke2ng0o3o1z2j1lack0friday9ockbuster8g1omberg7ue3m0s1w2n0pparibas9o0ats3ehringer8fa2m1nd2o0k0ing5sch2tik2on4t1utique6x2r0adesco6idgestone9oadway5ker3ther5ussels7s1t1uild0ers6siness6y1zz3v1w1y1z0h3ca0b1fe2l0l1vinklein9m0era3p2non3petown5ital0one8r0avan4ds2e0er0s4s2sa1e1h1ino4t0ering5holic7ba1n1re3c1d1enter4o1rn3f0a1d2g1h0anel2nel4rity4se2t2eap3intai5ristmas6ome4urch5i0priani6rcle4sco3tadel4i0c2y3k1l0aims4eaning6ick2nic1que6othing5ud3ub0med6m1n1o0ach3des3ffee4llege4ogne5m0mbank4unity6pany2re3uter5sec4ndos3struction8ulting7tact3ractors9oking4l1p2rsica5untry4pon0s4rses6pa2r0edit0card4union9icket5own3s1uise0s6u0isinella9v1w1x1y0mru3ou3z2dad1nce3ta1e1ing3sun4y2clk3ds2e0al0er2s3gree4livery5l1oitte5ta3mocrat6ntal2ist5si0gn4v2hl2iamonds6et2gital5rect0ory7scount3ver5h2y2j1k1m1np2o0cs1tor4g1mains5t1wnload7rive4tv2ubai3pont4rban5vag2r2z2earth3t2c0o2deka3u0cation8e1g1mail3erck5nergy4gineer0ing9terprises10pson4quipment8r0icsson6ni3s0q1tate5t1u0rovision8s2vents5xchange6pert3osed4ress5traspace10fage2il1rwinds6th3mily4n0s2rm0ers5shion4t3edex3edback6rrari3ero6i0delity5o2lm2nal1nce1ial7re0stone6mdale6sh0ing5t0ness6j1k1lickr3ghts4r2orist4wers5y2m1o0o0d1tball6rd1ex2sale4um3undation8x2r0ee1senius7l1ogans4ntier7tr2ujitsu5n0d2rniture7tbol5yi3ga0l0lery3o1up4me0s3p1rden4y2b0iz3d0n2e0a1nt0ing5orge5f1g0ee3h1i0ft0s3ves2ing5l0ass3e1obal2o4m0ail3bh2o1x2n1odaddy5ld0point6f2odyear5g0le4p1t1v2p1q1r0ainger5phics5tis4een3ipe3ocery4up4s1t1u0cci3ge2ide2tars5ru3w1y2hair2mburg5ngout5us3bo2dfc0bank7ealth0care8lp1sinki6re1mes5iphop4samitsu7tachi5v2k0t2m1n1ockey4ldings5iday5medepot5goods5s0ense7nda3rse3spital5t0ing5t0els3mail5use3w2r1sbc3t1u0ghes5yatt3undai7ibm2cbc2e1u2d1e0ee3fm2kano4l1m0amat4db2mo0bilien9n0c1dustries8finiti5o2g1k1stitute6urance4e4t0ernational10uit4vestments10o1piranga7q1r0ish4s0maili5t0anbul7t0au2v3jaguar4va3cb2e0ep2tzt3welry6io2ll2m0p2nj2o0bs1urg4t1y2p0morgan6rs3uegos4niper7kaufen5ddi3e0rryhotels6properties14fh2g1h1i0a1ds2m1ndle4tchen5wi3m1n1oeln3matsu5sher5p0mg2n2r0d1ed3uokgroup8w1y0oto4z2la0caixa5mborghini8er3nd0rover6xess5salle5t0ino3robe5w0yer5b1c1ds2ease3clerc5frak4gal2o2xus4gbt3i0dl2fe0insurance9style7ghting6ke2lly3mited4o2ncoln4k2ve1ing5k1lc1p2oan0s3cker3us3l1ndon4tte1o3ve3pl0financial11r1s1t0d0a3u0ndbeck6xe1ury5v1y2ma0drid4if1son4keup4n0agement7go3p1rket0ing3s4riott5shalls7ttel5ba2c0kinsey7d1e0d0ia3et2lbourne7me1orial6n0u2rck0msd7g1h1iami3crosoft7l1ni1t2t0subishi9k1l0b1s2m0a2n1o0bi0le4da2e1i1m1nash3ey2ster5rmon3tgage6scow4to0rcycles9v0ie4p1q1r1s0d2t0n1r2u0seum3ic4v1w1x1y1z2na0b1goya4me2vy3ba2c1e0c1t0bank4flix4work5ustar5w0s2xt0direct7us4f0l2g0o2hk2i0co2ke1on3nja3ssan1y5l1o0kia3rton4w0ruz3tv4p1r0a1w2tt2u1yc2z2obi1server7ffice5kinawa6layan0group9lo3m0ega4ne1g1l0ine5oo2pen3racle3nge4g0anic5igins6saka4tsuka4t2vh3pa0ge2nasonic7ris2s1tners4s1y3y2ccw3e0t2f0izer5g1h0armacy6d1ilips5one2to0graphy6s4ysio5ics1tet2ures6d1n0g1k2oneer5zza4k1l0ace2y0station9umbing5s3m1n0c2ohl2ker3litie5rn2st3r0axi3ess3ime3o0d0uctions8f1gressive8mo2perties3y5tection8u0dential9s1t1ub2w0c2y2qa1pon3uebec3st5racing4dio4e0ad1lestate6tor2y4cipes5d0umbrella9hab3ise0n3t2liance6n0t0als5pair3ort3ublican8st0aurant8view0s5xroth6ich0ardli6oh3l1o1p2o0cks3deo3gers4om3s0vp3u0gby3hr2n2w0e2yukyu6sa0arland6fe0ty4kura4le1on3msclub4ung5ndvik0coromant12ofi4p1rl2s1ve2xo3b0i1s2c0b1haeffler7midt4olarships8ol3ule3warz5ience5ot3d1e0arch3t2cure1ity6ek2lect4ner3rvices6ven3w1x0y3fr2g1h0angrila6rp3ell3ia1ksha5oes2p0ping5uji3w3i0lk2na1gles5te3j1k0i0n2y0pe4l0ing4m0art3ile4n0cf3o0ccer3ial4ftbank4ware6hu2lar2utions7ng1y2y2pa0ce3ort2t3r0l2s1t0ada2ples4r1tebank4farm7c0group6ockholm6rage3e3ream4udio2y3yle4u0cks3pplies3y2ort5rf1gery5zuki5v1watch4iss4x1y0dney4stems6z2tab1ipei4lk2obao4rget4tamotors6r2too4x0i3c0i2d0k2eam2ch0nology8l1masek5nnis4va3f1g1h0d1eater2re6iaa2ckets5enda4ps2res2ol4j0maxx4x2k0maxx5l1m0all4n1o0day3kyo3ols3p1ray3shiba5tal3urs3wn2yota3s3r0ade1ing4ining5vel0ers0insurance16ust3v2t1ube2i1nes3shu4v0s2w1z2ua1bank3s2g1k1nicom3versity8o2ol2ps2s1y1z2va0cations7na1guard7c1e0gas3ntures6risign5mögensberater2ung14sicherung10t2g1i0ajes4deo3g1king4llas4n1p1rgin4sa1ion4va1o3laanderen9n1odka3lvo3te1ing3o2yage5u2wales2mart4ter4ng0gou5tch0es6eather0channel12bcam3er2site5d0ding5ibo2r3f1hoswho6ien2ki2lliamhill9n0dows4e1ners6me2oodside6rk0s2ld3w2s1tc1f3xbox3erox4ihuan4n2xx2yz3yachts4hoo3maxun5ndex5e1odobashi7ga2kohama6u0tube6t1un3za0ppos4ra3ero3ip2m1one3uerich6w2`,vn=`ελ1υ2бг1ел3дети4ею2католик6ом3мкд2он1сква6онлайн5рг3рус2ф2сайт3рб3укр3қаз3հայ3ישראל5קום3ابوظبي5رامكو5لاردن4بحرين5جزائر5سعودية6عليان5مغرب5مارات5یران5بارت2زار4يتك3ھارت5تونس4سودان3رية5شبكة4عراق2ب2مان4فلسطين6قطر3كاثوليك6وم3مصر2ليسيا5وريتانيا7قع4همراه5پاکستان7ڀارت4कॉम3नेट3भारत0म्3ोत5संगठन5বাংলা5ভারত2ৰত4ਭਾਰਤ4ભારત4ଭାରତ4இந்தியா6லங்கை6சிங்கப்பூர்11భారత్5ಭಾರತ4ഭാരതം5ලංකා4คอม3ไทย3ລາວ3გე2みんな3アマゾン4クラウド4グーグル4コム2ストア3セール3ファッション6ポイント4世界2中信1国1國1文网3亚马逊3企业2佛山2信息2健康2八卦2公司1益2台湾1灣2商城1店1标2嘉里0大酒店5在线2大拿2天主教3娱乐2家電2广东2微博2慈善2我爱你3手机2招聘2政务1府2新加坡2闻2时尚2書籍2机构2淡马锡3游戏2澳門2点看2移动2组织机构4网址1店1站1络2联通2谷歌2购物2通販2集团2電訊盈科4飞利浦3食品2餐厅2香格里拉3港2닷넷1컴2삼성2한국2`,yn=`numeric`,bn=`ascii`,xn=`alpha`,Sn=`asciinumeric`,Cn=`alphanumeric`,wn=`domain`,Tn=`emoji`,En=`scheme`,Dn=`slashscheme`,On=`whitespace`;function kn(e,t){return e in t||(t[e]=[]),t[e]}function An(e,t,n){t[yn]&&(t[Sn]=!0,t[Cn]=!0),t[bn]&&(t[Sn]=!0,t[xn]=!0),t[Sn]&&(t[Cn]=!0),t[xn]&&(t[Cn]=!0),t[Cn]&&(t[wn]=!0),t[Tn]&&(t[wn]=!0);for(let r in t){let t=kn(r,n);t.indexOf(e)<0&&t.push(e)}}function jn(e,t){let n={};for(let r in t)t[r].indexOf(e)>=0&&(n[r]=!0);return n}function I(e=null){this.j={},this.jr=[],this.jd=null,this.t=e}I.groups={},I.prototype={accepts(){return!!this.t},go(e){let t=this,n=t.j[e];if(n)return n;for(let n=0;n<t.jr.length;n++){let r=t.jr[n][0],i=t.jr[n][1];if(i&&r.test(e))return i}return t.jd},has(e,t=!1){return t?e in this.j:!!this.go(e)},ta(e,t,n,r){for(let i=0;i<e.length;i++)this.tt(e[i],t,n,r)},tr(e,t,n,r){r||=I.groups;let i;return t&&t.j?i=t:(i=new I(t),n&&r&&An(t,n,r)),this.jr.push([e,i]),i},ts(e,t,n,r){let i=this,a=e.length;if(!a)return i;for(let t=0;t<a-1;t++)i=i.tt(e[t]);return i.tt(e[a-1],t,n,r)},tt(e,t,n,r){r||=I.groups;let i=this;if(t&&t.j)return i.j[e]=t,t;let a=t,o,s=i.go(e);return s?(o=new I,Object.assign(o.j,s.j),o.jr.push.apply(o.jr,s.jr),o.jd=s.jd,o.t=s.t):o=new I,a&&(r&&(o.t&&typeof o.t==`string`?An(a,Object.assign(jn(o.t,r),n),r):n&&An(a,n,r)),o.t=a),i.j[e]=o,o}};var L=(e,t,n,r,i)=>e.ta(t,n,r,i),R=(e,t,n,r,i)=>e.tr(t,n,r,i),Mn=(e,t,n,r,i)=>e.ts(t,n,r,i),z=(e,t,n,r,i)=>e.tt(t,n,r,i),Nn=`WORD`,Pn=`UWORD`,Fn=`ASCIINUMERICAL`,In=`ALPHANUMERICAL`,Ln=`LOCALHOST`,Rn=`TLD`,zn=`UTLD`,Bn=`SCHEME`,Vn=`SLASH_SCHEME`,Hn=`NUM`,Un=`WS`,Wn=`NL`,Gn=`OPENBRACE`,Kn=`CLOSEBRACE`,qn=`OPENBRACKET`,Jn=`CLOSEBRACKET`,Yn=`OPENPAREN`,Xn=`CLOSEPAREN`,Zn=`OPENANGLEBRACKET`,Qn=`CLOSEANGLEBRACKET`,$n=`FULLWIDTHLEFTPAREN`,er=`FULLWIDTHRIGHTPAREN`,tr=`LEFTCORNERBRACKET`,nr=`RIGHTCORNERBRACKET`,rr=`LEFTWHITECORNERBRACKET`,ir=`RIGHTWHITECORNERBRACKET`,ar=`FULLWIDTHLESSTHAN`,or=`FULLWIDTHGREATERTHAN`,sr=`AMPERSAND`,cr=`APOSTROPHE`,lr=`ASTERISK`,ur=`AT`,dr=`BACKSLASH`,fr=`BACKTICK`,pr=`CARET`,mr=`COLON`,hr=`COMMA`,gr=`DOLLAR`,_r=`DOT`,vr=`EQUALS`,yr=`EXCLAMATION`,br=`HYPHEN`,xr=`PERCENT`,Sr=`PIPE`,Cr=`PLUS`,wr=`POUND`,Tr=`QUERY`,Er=`QUOTE`,Dr=`FULLWIDTHMIDDLEDOT`,Or=`SEMI`,kr=`SLASH`,Ar=`TILDE`,jr=`UNDERSCORE`,Mr=`EMOJI`,Nr=`SYM`,Pr=Object.freeze({__proto__:null,ALPHANUMERICAL:In,AMPERSAND:sr,APOSTROPHE:cr,ASCIINUMERICAL:Fn,ASTERISK:lr,AT:ur,BACKSLASH:dr,BACKTICK:fr,CARET:pr,CLOSEANGLEBRACKET:Qn,CLOSEBRACE:Kn,CLOSEBRACKET:Jn,CLOSEPAREN:Xn,COLON:mr,COMMA:hr,DOLLAR:gr,DOT:_r,EMOJI:Mr,EQUALS:vr,EXCLAMATION:yr,FULLWIDTHGREATERTHAN:or,FULLWIDTHLEFTPAREN:$n,FULLWIDTHLESSTHAN:ar,FULLWIDTHMIDDLEDOT:Dr,FULLWIDTHRIGHTPAREN:er,HYPHEN:br,LEFTCORNERBRACKET:tr,LEFTWHITECORNERBRACKET:rr,LOCALHOST:Ln,NL:Wn,NUM:Hn,OPENANGLEBRACKET:Zn,OPENBRACE:Gn,OPENBRACKET:qn,OPENPAREN:Yn,PERCENT:xr,PIPE:Sr,PLUS:Cr,POUND:wr,QUERY:Tr,QUOTE:Er,RIGHTCORNERBRACKET:nr,RIGHTWHITECORNERBRACKET:ir,SCHEME:Bn,SEMI:Or,SLASH:kr,SLASH_SCHEME:Vn,SYM:Nr,TILDE:Ar,TLD:Rn,UNDERSCORE:jr,UTLD:zn,UWORD:Pn,WORD:Nn,WS:Un}),Fr=/[a-z]/,Ir=/\p{L}/u,Lr=/\p{Emoji}/u,Rr=/\d/,zr=/\s/,Br=`\r`,Vr=`
`,Hr=`️`,Ur=`‍`,Wr=`￼`,Gr=null,Kr=null;function qr(e=[]){let t={};I.groups=t;let n=new I;Gr??=Zr(_n),Kr??=Zr(vn),z(n,`'`,cr),z(n,`{`,Gn),z(n,`}`,Kn),z(n,`[`,qn),z(n,`]`,Jn),z(n,`(`,Yn),z(n,`)`,Xn),z(n,`<`,Zn),z(n,`>`,Qn),z(n,`（`,$n),z(n,`）`,er),z(n,`「`,tr),z(n,`」`,nr),z(n,`『`,rr),z(n,`』`,ir),z(n,`＜`,ar),z(n,`＞`,or),z(n,`&`,sr),z(n,`*`,lr),z(n,`@`,ur),z(n,"`",fr),z(n,`^`,pr),z(n,`:`,mr),z(n,`,`,hr),z(n,`$`,gr),z(n,`.`,_r),z(n,`=`,vr),z(n,`!`,yr),z(n,`-`,br),z(n,`%`,xr),z(n,`|`,Sr),z(n,`+`,Cr),z(n,`#`,wr),z(n,`?`,Tr),z(n,`"`,Er),z(n,`/`,kr),z(n,`;`,Or),z(n,`~`,Ar),z(n,`_`,jr),z(n,`\\`,dr),z(n,`・`,Dr);let r=R(n,Rr,Hn,{[yn]:!0});R(r,Rr,r);let i=R(r,Fr,Fn,{[Sn]:!0}),a=R(r,Ir,In,{[Cn]:!0}),o=R(n,Fr,Nn,{[bn]:!0});R(o,Rr,i),R(o,Fr,o),R(i,Rr,i),R(i,Fr,i);let s=R(n,Ir,Pn,{[xn]:!0});R(s,Fr),R(s,Rr,a),R(s,Ir,s),R(a,Rr,a),R(a,Fr),R(a,Ir,a);let c=z(n,Vr,Wn,{[On]:!0}),l=z(n,Br,Un,{[On]:!0}),u=R(n,zr,Un,{[On]:!0});z(n,Wr,u),z(l,Vr,c),z(l,Wr,u),R(l,zr,u),z(u,Br),z(u,Vr),R(u,zr,u),z(u,Wr,u);let d=R(n,Lr,Mr,{[Tn]:!0});z(d,`#`),R(d,Lr,d),z(d,Hr,d);let f=z(d,Ur);z(f,`#`),R(f,Lr,d);let p=[[Fr,o],[Rr,i]],m=[[Fr,null],[Ir,s],[Rr,a]];for(let e=0;e<Gr.length;e++)Xr(n,Gr[e],Rn,Nn,p);for(let e=0;e<Kr.length;e++)Xr(n,Kr[e],zn,Pn,m);An(Rn,{tld:!0,ascii:!0},t),An(zn,{utld:!0,alpha:!0},t),Xr(n,`file`,Bn,Nn,p),Xr(n,`mailto`,Bn,Nn,p),Xr(n,`http`,Vn,Nn,p),Xr(n,`https`,Vn,Nn,p),Xr(n,`ftp`,Vn,Nn,p),Xr(n,`ftps`,Vn,Nn,p),An(Bn,{scheme:!0,ascii:!0},t),An(Vn,{slashscheme:!0,ascii:!0},t),e=e.sort((e,t)=>e[0]>t[0]?1:-1);for(let t=0;t<e.length;t++){let r=e[t][0],i=e[t][1]?{[En]:!0}:{[Dn]:!0};r.indexOf(`-`)>=0?i[wn]=!0:Fr.test(r)?Rr.test(r)?i[Sn]=!0:i[bn]=!0:i[yn]=!0,Mn(n,r,r,i)}return Mn(n,`localhost`,Ln,{ascii:!0}),n.jd=new I(Nr),{start:n,tokens:Object.assign({groups:t},Pr)}}function Jr(e,t){let n=Yr(t.replace(/[A-Z]/g,e=>e.toLowerCase())),r=n.length,i=[],a=0,o=0;for(;o<r;){let s=e,c=null,l=0,u=null,d=-1,f=-1;for(;o<r&&(c=s.go(n[o]));)s=c,s.accepts()?(d=0,f=0,u=s):d>=0&&(d+=n[o].length,f++),l+=n[o].length,a+=n[o].length,o++;a-=d,o-=f,l-=d,i.push({t:u.t,v:t.slice(a-l,a),s:a-l,e:a})}return i}function Yr(e){let t=[],n=e.length,r=0;for(;r<n;){let i=e.charCodeAt(r),a,o=i<55296||i>56319||r+1===n||(a=e.charCodeAt(r+1))<56320||a>57343?e[r]:e.slice(r,r+2);t.push(o),r+=o.length}return t}function Xr(e,t,n,r,i){let a,o=t.length;for(let n=0;n<o-1;n++){let o=t[n];e.j[o]?a=e.j[o]:(a=new I(r),a.jr=i.slice(),e.j[o]=a),e=a}return a=new I(n),a.jr=i.slice(),e.j[t[o-1]]=a,a}function Zr(e){let t=[],n=[],r=0;for(;r<e.length;){let i=0;for(;`0123456789`.indexOf(e[r+i])>=0;)i++;if(i>0){t.push(n.join(``));for(let t=parseInt(e.substring(r,r+i),10);t>0;t--)n.pop();r+=i}else n.push(e[r]),r++}return t}var Qr={defaultProtocol:`http`,events:null,format:ei,formatHref:ei,nl2br:!1,tagName:`a`,target:null,rel:null,validate:!0,truncate:1/0,className:null,attributes:null,ignoreTags:[],render:null};function $r(e,t=null){let n=Object.assign({},Qr);e&&(n=Object.assign(n,e instanceof $r?e.o:e));let r=n.ignoreTags,i=[];for(let e=0;e<r.length;e++)i.push(r[e].toUpperCase());this.o=n,t&&(this.defaultRender=t),this.ignoreTags=i}$r.prototype={o:Qr,ignoreTags:[],defaultRender(e){return e},check(e){return this.get(`validate`,e.toString(),e)},get(e,t,n){let r=t!=null,i=this.o[e];return i&&(typeof i==`object`?(i=n.t in i?i[n.t]:Qr[e],typeof i==`function`&&r&&(i=i(t,n))):typeof i==`function`&&r&&(i=i(t,n.t,n)),i)},getObj(e,t,n){let r=this.o[e];return typeof r==`function`&&t!=null&&(r=r(t,n.t,n)),r},render(e){let t=e.render(this);return(this.get(`render`,null,e)||this.defaultRender)(t,e.t,e)}};function ei(e){return e}function ti(e,t){this.t=`token`,this.v=e,this.tk=t}ti.prototype={isLink:!1,toString(){return this.v},toHref(e){return this.toString()},toFormattedString(e){let t=this.toString(),n=e.get(`truncate`,t,this),r=e.get(`format`,t,this);return n&&r.length>n?r.substring(0,n)+`…`:r},toFormattedHref(e){return e.get(`formatHref`,this.toHref(e.get(`defaultProtocol`)),this)},startIndex(){return this.tk[0].s},endIndex(){return this.tk[this.tk.length-1].e},toObject(e=Qr.defaultProtocol){return{type:this.t,value:this.toString(),isLink:this.isLink,href:this.toHref(e),start:this.startIndex(),end:this.endIndex()}},toFormattedObject(e){return{type:this.t,value:this.toFormattedString(e),isLink:this.isLink,href:this.toFormattedHref(e),start:this.startIndex(),end:this.endIndex()}},validate(e){return e.get(`validate`,this.toString(),this)},render(e){let t=this,n=this.toHref(e.get(`defaultProtocol`)),r=e.get(`formatHref`,n,this),i=e.get(`tagName`,n,t),a=this.toFormattedString(e),o={},s=e.get(`className`,n,t),c=e.get(`target`,n,t),l=e.get(`rel`,n,t),u=e.getObj(`attributes`,n,t),d=e.getObj(`events`,n,t);return o.href=r,s&&(o.class=s),c&&(o.target=c),l&&(o.rel=l),u&&Object.assign(o,u),{tagName:i,attributes:o,content:a,eventListeners:d}}};function ni(e,t){class n extends ti{constructor(t,n){super(t,n),this.t=e}}for(let e in t)n.prototype[e]=t[e];return n.t=e,n}var ri=ni(`email`,{isLink:!0,toHref(){return`mailto:`+this.toString()}}),ii=ni(`text`),ai=ni(`nl`),oi=ni(`url`,{isLink:!0,toHref(e=Qr.defaultProtocol){return this.hasProtocol()?this.v:`${e}://${this.v}`},hasProtocol(){let e=this.tk;return e.length>=2&&e[0].t!==Ln&&e[1].t===mr}}),B=e=>new I(e);function si({groups:e}){let t=e.domain.concat([sr,lr,ur,dr,fr,pr,gr,vr,br,Hn,xr,Sr,Cr,wr,kr,Nr,Ar,jr]),n=[cr,mr,hr,_r,yr,xr,Tr,Er,Or,Zn,Qn,Gn,Kn,Jn,qn,Yn,Xn,$n,er,tr,nr,rr,ir,ar,or],r=[sr,cr,lr,dr,fr,pr,gr,vr,br,Gn,Kn,xr,Sr,Cr,wr,Tr,kr,Nr,Ar,jr],i=B(),a=z(i,Ar);L(a,r,a),L(a,e.domain,a);let o=B(),s=B(),c=B();L(i,e.domain,o),L(i,e.scheme,s),L(i,e.slashscheme,c),L(o,r,a),L(o,e.domain,o);let l=z(o,ur);z(a,ur,l),z(s,ur,l),z(c,ur,l);let u=z(a,_r);L(u,r,a),L(u,e.domain,a);let d=B();L(l,e.domain,d),L(d,e.domain,d);let f=z(d,_r);L(f,e.domain,d);let p=B(ri);L(f,e.tld,p),L(f,e.utld,p),z(l,Ln,p);let m=z(d,br);z(m,br,m),L(m,e.domain,d),L(p,e.domain,d),z(p,_r,f),z(p,br,m);let h=z(o,br),g=z(o,_r);z(h,br,h),L(h,e.domain,o),L(g,r,a),L(g,e.domain,o);let _=B(oi);L(g,e.tld,_),L(g,e.utld,_),L(_,e.domain,o),L(_,r,a),z(_,_r,g),z(_,br,h),z(_,ur,l);let ee=z(_,mr),v=B(oi);L(ee,e.numeric,v);let y=B(oi),b=B();L(y,t,y),L(y,n,b),L(b,t,y),L(b,n,b),z(_,kr,y),z(v,kr,y);let x=z(s,mr),te=z(z(z(c,mr),kr),kr);L(s,e.domain,o),z(s,_r,g),z(s,br,h),L(c,e.domain,o),z(c,_r,g),z(c,br,h),L(x,e.domain,y),z(x,kr,y),z(x,Tr,y),L(te,e.domain,y),L(te,t,y),z(te,kr,y);let ne=[[Gn,Kn],[qn,Jn],[Yn,Xn],[Zn,Qn],[$n,er],[tr,nr],[rr,ir],[ar,or]];for(let e=0;e<ne.length;e++){let[r,i]=ne[e],a=z(y,r);z(b,r,a);let o=B(oi);L(a,t,o);let s=B();L(a,n,s),z(a,i,y),L(o,t,o),L(o,n,s),L(s,t,o),L(s,n,s),z(o,i,y),z(s,i,y)}return z(i,Ln,_),z(i,Wn,ai),{start:i,tokens:Pr}}function ci(e,t,n){let r=n.length,i=0,a=[],o=[];for(;i<r;){let s=e,c=null,l=null,u=0,d=null,f=-1;for(;i<r&&!(c=s.go(n[i].t));)o.push(n[i++]);for(;i<r&&(l=c||s.go(n[i].t));)c=null,s=l,s.accepts()?(f=0,d=s):f>=0&&f++,i++,u++;if(f<0)i-=u,i<r&&(o.push(n[i]),i++);else{o.length>0&&(a.push(li(ii,t,o)),o=[]),i-=f,u-=f;let e=d.t,r=n.slice(i-u,i);a.push(li(e,t,r))}}return o.length>0&&a.push(li(ii,t,o)),a}function li(e,t,n){let r=n[0].s,i=n[n.length-1].e;return new e(t.slice(r,i),n)}var ui=typeof console<`u`&&console&&console.warn||(()=>{}),di=`until manual call of linkify.init(). Register all schemes and plugins before invoking linkify the first time.`,V={scanner:null,parser:null,tokenQueue:[],pluginQueue:[],customSchemes:[],initialized:!1};function fi(){return I.groups={},V.scanner=null,V.parser=null,V.tokenQueue=[],V.pluginQueue=[],V.customSchemes=[],V.initialized=!1,V}function pi(e,t=!1){if(V.initialized&&ui(`linkifyjs: already initialized - will not register custom scheme "${e}" ${di}`),!/^[0-9a-z]+(-[0-9a-z]+)*$/.test(e))throw Error(`linkifyjs: incorrect scheme format.
1. Must only contain digits, lowercase ASCII letters or "-"
2. Cannot start or end with "-"
3. "-" cannot repeat`);V.customSchemes.push([e,t])}function mi(){V.scanner=qr(V.customSchemes);for(let e=0;e<V.tokenQueue.length;e++)V.tokenQueue[e][1]({scanner:V.scanner});V.parser=si(V.scanner.tokens);for(let e=0;e<V.pluginQueue.length;e++)V.pluginQueue[e][1]({scanner:V.scanner,parser:V.parser});return V.initialized=!0,V}function hi(e){return V.initialized||mi(),ci(V.parser.start,e,Jr(V.scanner.start,e))}hi.scan=Jr;function gi(e,t=null,n=null){if(t&&typeof t==`object`){if(n)throw Error(`linkifyjs: Invalid link type ${t}; must be a string`);n=t,t=null}let r=new $r(n),i=hi(e),a=[];for(let e=0;e<i.length;e++){let n=i[e];n.isLink&&(!t||n.t===t)&&r.check(n)&&a.push(n.toFormattedObject(r))}return a}var _i=`[\0- \xA0 ᠎ -\u2029 　]`,vi=new RegExp(_i),yi=RegExp(`${_i}$`),bi=new RegExp(_i,`g`);function xi(e){return e.length===1?e[0].isLink:e.length===3&&e[1].isLink?[`()`,`[]`].includes(e[0].value+e[2].value):!1}function Si(e){return new C({key:new T(`autolink`),appendTransaction:(t,n,r)=>{let i=t.some(e=>e.docChanged)&&!n.doc.eq(r.doc),a=t.some(e=>e.getMeta(`preventAutolink`));if(!i||a)return;let{tr:o}=r,s=Te(n.doc,[...t]);if(ke(s).forEach(({newRange:t})=>{let n=_e(r.doc,t,e=>e.isTextblock),i,a;if(n.length>1)i=n[0],a=r.doc.textBetween(i.pos,i.pos+i.node.nodeSize,void 0,` `);else if(n.length){let e=r.doc.textBetween(t.from,t.to,` `,` `);if(!yi.test(e))return;i=n[0],a=r.doc.textBetween(i.pos,t.to,void 0,` `)}if(i&&a){let t=a.split(vi).filter(Boolean);if(t.length<=0)return!1;let n=t[t.length-1],s=i.pos+a.lastIndexOf(n);if(!n)return!1;let c=hi(n).map(t=>t.toObject(e.defaultProtocol));if(!xi(c))return!1;c.filter(e=>e.isLink).map(e=>({...e,from:s+e.start+1,to:s+e.end+1})).filter(e=>!r.schema.marks.code||!r.doc.rangeHasMark(e.from,e.to,r.schema.marks.code)).filter(t=>e.validate(t.value)).filter(t=>e.shouldAutoLink(t.value)).forEach(t=>{Pe(t.from,t.to,r.doc).some(t=>t.mark.type===e.type)||o.addMark(t.from,t.to,e.type.create({href:t.href}))})}}),o.steps.length)return o}})}function Ci(e){return new C({key:new T(`handleClickLink`),props:{handleClick:(t,n,r)=>{if(r.button!==0||!t.editable)return!1;let i=null;if(r.target instanceof HTMLAnchorElement)i=r.target;else{let t=r.target;if(!t)return!1;let n=e.editor.view.dom;i=t.closest(`a`),i&&!n.contains(i)&&(i=null)}if(!i)return!1;let a=!1;if(e.enableClickSelection&&(a=e.editor.commands.extendMarkRange(e.type.name)),e.openOnClick){let n=Ce(t.state,e.type.name),r=i.href??n.href,o=i.target??n.target;r&&(window.open(r,o),a=!0)}return a}}})}var wi=/\[([^[\]]+)\]\(((?:[^\s()]|\([^\s()]*\))+)(?:\s+(?:(["'])(.*?)\3|“(.*?)”|‘(.*?)’))?\)$/,Ti=/\[([^[\]]+)\]\(((?:[^\s()]|\([^\s()]*\))+)(?:\s+(?:(["'])(.*?)\3|“(.*?)”|‘(.*?)’))?\)/g;function Ei(e,t){let n=0;for(let r=t-1;r>=0&&e[r]===`\\`;--r)n+=1;return n%2==1}function Di(e,t){let n=0,r=0;for(;r<t;){if(e[r]!=="`"){r+=1;continue}if(n===0&&Ei(e,r)){r+=1;continue}let i=0;for(;r<t&&e[r]==="`";)i+=1,r+=1;n===0?n=i:i===n&&(n=0)}return n>0}function Oi(e,t,n){let[,r,i]=t;return(t.index?e[t.index-1]:void 0)===`!`||Ei(e,t.index??0)||Di(e,t.index??0)?!1:!!r.trim()&&n(i)}function ki(e){let[t,n,r,,i,a,o]=e,s=i??a??o;return{index:e.index??0,text:t,replaceWith:n,data:{href:r,title:s||null,markdown:!0}}}function Ai(e,t){return e.index<t.index+t.text.length&&t.index<e.index+e.text.length}function ji(e){return{href:e.data?.href,title:e.data?.title??null}}function Mi(e){let t=Oe({find:t=>{let n=wi.exec(t);return!n||!Oi(t,n,e.isAllowedHref)?null:ki(n)},type:e.type,getAttributes:ji});return new ge({find:t.find,handler:e=>{let n=t.handler(e);return n!==null&&e.state.tr.steps.length&&e.state.tr.setMeta(`preventAutolink`,!0),n}})}function Ni(e){let t=de({find:t=>{let n=[];for(let r of t.matchAll(Ti))Oi(t,r,e.isAllowedHref)&&n.push(ki(r));let r=(e.findPlainUrls?.call(e,t)??[]).filter(e=>!n.some(t=>Ai(t,e)));return[...n,...r]},type:e.type,getAttributes:ji});return new fe({find:t.find,handler:e=>{let n=t.handler(e);return n!==null&&e.state.tr.steps.length&&e.match.data?.markdown&&e.state.tr.setMeta(`preventAutolink`,!0),n}})}function Pi(e){return new C({key:new T(`handlePasteLink`),props:{handlePaste:(t,n,r)=>{let{shouldAutoLink:i}=e,{state:a}=t,{selection:o}=a,{empty:s}=o;if(s)return!1;let c=``;r.content.forEach(e=>{c+=e.textContent});let l=gi(c,{defaultProtocol:e.defaultProtocol}).find(e=>e.isLink&&e.value===c);return!c||!l||i!==void 0&&!i(l.value)?!1:e.editor.commands.setMark(e.type,{href:l.href})}}})}function Fi(e,t){let n=[`http`,`https`,`ftp`,`ftps`,`mailto`,`tel`,`callto`,`sms`,`cid`,`xmpp`];return t&&t.forEach(e=>{let t=typeof e==`string`?e:e.scheme;t&&n.push(t)}),!e||e.replace(bi,``).match(RegExp(`^(?:(?:${n.map(e=>e.replace(/[-/\\^$*+?.()|[\]{}]/g,`\\$&`)).join(`|`)}):|[^a-z]|[a-z0-9+.\\-]+(?:[^a-z+.\\-:]|$))`,`i`))}Ee.create({name:`link`,priority:1e3,keepOnSplit:!1,exitable:!0,onCreate(){this.options.validate&&!this.options.shouldAutoLink&&(this.options.shouldAutoLink=this.options.validate,console.warn("The `validate` option is deprecated. Rename to the `shouldAutoLink` option instead.")),this.options.protocols.forEach(e=>{if(typeof e==`string`){pi(e);return}pi(e.scheme,e.optionalSlashes)})},onDestroy(){fi()},inclusive(){return this.options.autolink},addOptions(){return{openOnClick:!0,enableClickSelection:!1,linkOnPaste:!0,markdownLinks:!1,autolink:!0,protocols:[],defaultProtocol:`http`,HTMLAttributes:{target:`_blank`,rel:`noopener noreferrer nofollow`,class:null},isAllowedUri:(e,t)=>!!Fi(e,t.protocols),validate:e=>!!e,shouldAutoLink:e=>{let t=/^[a-z][a-z0-9+.-]*:\/\//i.test(e),n=/^[a-z][a-z0-9+.-]*:/i.test(e);if(t||n&&!e.includes(`@`))return!0;let r=(e.includes(`@`)?e.split(`@`).pop():e).split(/[/?#:]/)[0];return!(/^\d{1,3}(\.\d{1,3}){3}$/.test(r)||!/\./.test(r))}}},addAttributes(){return{href:{default:null,parseHTML(e){return e.getAttribute(`href`)}},target:{default:this.options.HTMLAttributes.target??null},rel:{default:this.options.HTMLAttributes.rel??null},class:{default:this.options.HTMLAttributes.class??null},title:{default:null}}},parseHTML(){return[{tag:`a[href]`,getAttrs:e=>{let t=e.getAttribute(`href`);return!t||!this.options.isAllowedUri(t,{defaultValidate:e=>!!Fi(e,this.options.protocols),protocols:this.options.protocols,defaultProtocol:this.options.defaultProtocol})?!1:null}}]},renderHTML({HTMLAttributes:e}){return this.options.isAllowedUri(e.href,{defaultValidate:e=>!!Fi(e,this.options.protocols),protocols:this.options.protocols,defaultProtocol:this.options.defaultProtocol})?[`a`,w(this.options.HTMLAttributes,e),0]:[`a`,w(this.options.HTMLAttributes,{...e,href:``}),0]},markdownTokenName:`link`,parseMarkdown:(e,t)=>t.applyMark(`link`,t.parseInline(e.tokens||[]),{href:e.href,title:e.title||null}),renderMarkdown:(e,t)=>{let n=e.attrs?.href??``,r=e.attrs?.title??``,i=t.renderChildren(e);return r?`[${i}](${n} "${r}")`:`[${i}](${n})`},addCommands(){return{setLink:e=>({chain:t})=>{let{href:n}=e;return this.options.isAllowedUri(n,{defaultValidate:e=>!!Fi(e,this.options.protocols),protocols:this.options.protocols,defaultProtocol:this.options.defaultProtocol})?t().setMark(this.name,e).setMeta(`preventAutolink`,!0).run():!1},toggleLink:e=>({chain:t})=>{let{href:n}=e||{};return n&&!this.options.isAllowedUri(n,{defaultValidate:e=>!!Fi(e,this.options.protocols),protocols:this.options.protocols,defaultProtocol:this.options.defaultProtocol})?!1:t().toggleMark(this.name,e,{extendEmptyMarkRange:!0}).setMeta(`preventAutolink`,!0).run()},unsetLink:()=>({chain:e})=>e().unsetMark(this.name,{extendEmptyMarkRange:!0}).setMeta(`preventAutolink`,!0).run()}},addInputRules(){return this.options.markdownLinks?[Mi({type:this.type,isAllowedHref:e=>this.options.isAllowedUri(e,{defaultValidate:e=>!!Fi(e,this.options.protocols),protocols:this.options.protocols,defaultProtocol:this.options.defaultProtocol})})]:[]},addPasteRules(){let e=e=>{let t=[];if(e){let{protocols:n,defaultProtocol:r}=this.options;gi(e).filter(e=>e.isLink&&this.options.isAllowedUri(e.value,{defaultValidate:e=>!!Fi(e,n),protocols:n,defaultProtocol:r})).forEach(e=>{this.options.shouldAutoLink(e.value)&&t.push({text:e.value,data:{href:e.href},index:e.start})})}return t};return this.options.markdownLinks?[Ni({type:this.type,isAllowedHref:e=>this.options.isAllowedUri(e,{defaultValidate:e=>!!Fi(e,this.options.protocols),protocols:this.options.protocols,defaultProtocol:this.options.defaultProtocol}),findPlainUrls:e})]:[de({find:e,type:this.type,getAttributes:e=>({href:e.data?.href})})]},addProseMirrorPlugins(){let e=[],{protocols:t,defaultProtocol:n}=this.options;return this.options.autolink&&e.push(Si({type:this.type,defaultProtocol:this.options.defaultProtocol,validate:e=>this.options.isAllowedUri(e,{defaultValidate:e=>!!Fi(e,t),protocols:t,defaultProtocol:n}),shouldAutoLink:this.options.shouldAutoLink})),e.push(Ci({type:this.type,editor:this.editor,openOnClick:this.options.openOnClick===`whenNotEditable`||this.options.openOnClick,enableClickSelection:this.options.enableClickSelection})),this.options.linkOnPaste&&e.push(Pi({editor:this.editor,defaultProtocol:this.options.defaultProtocol,type:this.type,shouldAutoLink:this.options.shouldAutoLink})),e}});function Ii(e){return Array.isArray(e)&&e.length>0}function Li(e){if(!e)return[];if(Ii(e))return e;let t=[];return e.linkToEntry&&t.push({...e.linkToEntry,optionTitle:`Link to an entry`}),e.linkToAsset&&t.push({...e.linkToAsset,optionTitle:`Link to an asset`}),e.linkToCategory&&t.push({...e.linkToCategory,optionTitle:`Link to a category`}),t}function Ri(e,t){return`${e.url||``}#${t}:${e.id}@${e.siteId}`}var zi=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;function H(e){return zi.test(e)}function Bi(e={}){return{type:`url`,targetUid:null,siteMode:`current`,siteUid:null,value:null,suffix:null,newWindow:!1,title:null,ariaLabel:null,rel:[],class:null,id:null,download:null,...e}}function Vi(e){return Bi({type:e.type??`url`,targetUid:typeof e.targetUid==`string`?e.targetUid:null,siteMode:e.siteMode===`fixed`?`fixed`:`current`,siteUid:typeof e.siteUid==`string`?e.siteUid:null,value:typeof e.value==`string`?e.value:null,suffix:typeof e.suffix==`string`?e.suffix:null,newWindow:e.newWindow===!0,title:typeof e.title==`string`?e.title:null,ariaLabel:typeof e.ariaLabel==`string`?e.ariaLabel:null,rel:Array.isArray(e.rel)?e.rel.filter(e=>typeof e==`string`):[],class:typeof e.class==`string`?e.class:null,id:typeof e.id==`string`?e.id:null,download:e.download===!0||typeof e.download==`string`?e.download:null,linkUid:typeof e.linkUid==`string`?e.linkUid:null})}function Hi(e,t=!1){return Bi({type:`url`,value:e,newWindow:t})}function Ui(e){switch(e.type){case`url`:return e.value??`#`;case`email`:return e.value?`mailto:${e.value}`:`#`;case`tel`:return e.value?`tel:${e.value}`:`#`;case`sms`:return e.value?`sms:${e.value}`:`#`;case`entry`:case`asset`:case`category`:return e.targetUid?`#vizy-link:${e.type}:${e.targetUid}`:`#`;default:return`#`}}function Wi(e){if(e<1)return[];let t=Math.floor(1e3/e),n=1e3-t*e;return Array.from({length:e},(e,r)=>t+ +(r<n))}function Gi(e){return e.reduce((e,t)=>e+t,0)}function Ki(e){if(e.childCount===0)return 0;let t=e.child(0),n=0;for(let e=0;e<t.childCount;e++){let r=Number(t.child(e).attrs.colspan??1);n+=Number.isFinite(r)&&r>0?r:1}return n}function qi(e){let{from:t,to:n}=e.state.selection;return e.state.doc.textBetween(t,n,` `)}function Ji(e){let t=$i(e),{state:n}=e,r=n.schema.marks.link,i=r?pe(n.selection.$from,r):null,a=i?.from??n.selection.from,o=i?.to??n.selection.to;return{from:a,to:o,text:e.state.doc.textBetween(a,o,` `),openInNewTab:t.newWindow,url:Ui(t),semantic:t}}function Yi(e){let{from:t,to:n}=e.state.selection;return{url:``,text:qi(e),openInNewTab:!1,from:t===n?void 0:t,to:t===n?void 0:n}}function Xi(e,t){let n=t.focus??!0,r=()=>n?e.chain().focus():e.chain(),i=typeof t.from==`number`&&typeof t.to==`number`,a=i?t.from:e.state.selection.from,o=i?t.to:e.state.selection.to,s=e.state.doc.textBetween(a,o,` `),c=a!==o&&t.text===s?t.text:t.text.trim()||ea(t.attrs),l={type:`link`,attrs:t.attrs};if(a!==o){c===s?r().setTextSelection({from:a,to:o}).setSemanticLink(t.attrs).run():r().insertContentAt({from:a,to:o},[{type:`text`,text:c,marks:[l]}]).run();return}r().setTextSelection(a).insertContent([{type:`text`,text:c,marks:[l]}]).run()}function Zi(e,t){(t?.focus??!0?e.chain().focus():e.chain()).extendMarkRange(`link`).unsetSemanticLink().run()}function Qi(e,t){let n=e.trim();return n.toLowerCase().startsWith(`mailto:`)?Bi({type:`email`,value:n.slice(7),newWindow:t}):n.toLowerCase().startsWith(`tel:`)?Bi({type:`tel`,value:n.slice(4),newWindow:t}):n.toLowerCase().startsWith(`sms:`)?Bi({type:`sms`,value:n.slice(4),newWindow:t}):Hi(n,t)}function $i(e){return Vi(e.getAttributes(`link`))}function ea(e){return e.type===`url`||e.type===`email`||e.type===`tel`||e.type===`sms`?e.value??Ui(e):Ui(e)}var ta=e=>e??r,na=x(class extends ne{constructor(e){if(super(e),e.type!==b.PROPERTY&&e.type!==b.ATTRIBUTE&&e.type!==b.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!ce(e))throw Error("`live` bindings can only contain a single expression")}render(e){return e}update(e,[t]){if(t===u||t===r)return t;let n=e.element,i=e.name;if(e.type===b.PROPERTY){if(t===n[i])return u}else if(e.type===b.BOOLEAN_ATTRIBUTE){if(!!t===n.hasAttribute(i))return u}else if(e.type===b.ATTRIBUTE&&n.getAttribute(i)===t+``)return u;return le(e),t}}),ra=new Set([`button`,`submit`,`reset`,`checkbox`,`radio`,`file`,`image`,`hidden`]),ia=`pk-implicit-submit`,aa=(e,t)=>{if(e.key!==`Enter`||e.defaultPrevented||e.isComposing||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey)return!1;let n=(t||`text`).toLowerCase();return!ra.has(n)},oa=e=>{let t=e.closest?.(`pk-dialog`);if(t){let e=t.querySelector(`form`);if(e)return e}let n=e.form;return n&&n.id===`main`?e.closest?.(`form`)===n?null:e.closest(`form`):n},sa=(e,t,n)=>{if(e.disabled||e.readonly||!aa(t,n))return!1;let r=oa(e);return!r||r.id===`main`?!1:(t.preventDefault(),t.stopPropagation(),r.dispatchEvent(new CustomEvent(ia,{bubbles:!1,cancelable:!0})),!0)},ca=o`
    @layer pk-component {
        :host {
            display: block;
            width: 100%;
            font-family: var(--pk-font-family);
            font-size: var(--pk-font-size-base);
            line-height: var(--pk-line-height);
            /*
             * Control chrome tokens — inherit into light-DOM in-control actions
             * (e.g. pk-copy-button[slot=end]) the same way combobox/image-browser
             * size their trailing clear/expand hit targets.
             */
            --pk-input-padding-block: 6px;
            --pk-input-padding-inline: 8px;
            --pk-input-control-gap: 6px;
            --pk-input-decoration-size: 0.75rem;
        }

        :host([data-pk-group-orientation]) {
            display: flex;
            flex-direction: column;
            width: auto;
            flex: 0 1 auto;
            align-self: stretch;
        }

        :host([data-pk-group-orientation]) .form-control {
            gap: 0;
            height: 100%;
        }

        :host([data-pk-group-orientation]) .form-control__input {
            min-height: var(--pk-btn-height-default);
            height: 100%;
        }

        :host([data-pk-group-orientation]) .form-control__start,
        :host([data-pk-group-orientation]) .form-control__end {
            display: none;
        }

        :host([data-pk-group-orientation]) .form-control__input {
            width: 100%;
        }

        :host([data-pk-group-orientation]) .input {
            width: 100%;
        }

        :host([data-pk-group-orientation]) .input {
            min-height: var(--pk-btn-height-default);
            height: 100%;
        }

        :host([data-pk-group-orientation='vertical']) {
            width: 100%;
        }

        :host([data-pk-group-orientation='horizontal'][data-pk-group-join]:not([data-pk-group-divider])) {
            margin-inline-start: var(--pk-bg-horizontal-indent-outlined, 0);
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-join]:not([data-pk-group-divider])) {
            margin-block-start: var(--pk-bg-vertical-indent-outlined, 0);
        }

        :host([data-pk-group-orientation='horizontal'][data-pk-group-divider][data-pk-group-join]) {
            margin-inline-start: var(--pk-bg-horizontal-indent-outlined, 0);
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-divider][data-pk-group-join]) {
            margin-block-start: var(--pk-bg-vertical-indent-outlined, 0);
        }

        :host([data-pk-group-orientation='horizontal'][data-pk-group-divider]) .form-control__input {
            border-left-width: 1px;
            border-left-style: solid;
            border-left-color: var(--pk-btn-group-divider-color-outline, var(--pk-input-border-color));
            box-shadow: none;
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-divider]) .form-control__input {
            border-top-width: 1px;
            border-top-style: solid;
            border-top-color: var(--pk-btn-group-divider-color-outline, var(--pk-input-border-color));
            box-shadow: none;
        }

        :host([data-pk-group-divider]) .form-control__input:focus-within,
        :host([data-pk-group-divider][data-state='focus-visible']) .form-control__input {
            box-shadow: var(--pk-input-focus-shadow);
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-divider]) .form-control__input:focus-within,
        :host([data-pk-group-orientation='vertical'][data-pk-group-divider][data-state='focus-visible']) .form-control__input {
            box-shadow: var(--pk-input-focus-shadow);
        }

        /* Chrome lives on the flex shell (part=base) so slot=start/end adornments sit
         * inside the border — same visual contract as pk-input-group / v1 InputGroup.
         * Height is content-sized (v1): padding-block + --pk-input-control-line-height + border.
         * Trailing actions (clear, pk-copy-button[slot=end]) stay in flex flow so long
         * values never paint under the button — mirror combobox / image-browser.
         */
        .form-control__input {
            align-items: center;
            gap: var(--pk-input-control-gap);
            padding-inline: var(--pk-input-padding-inline);
            border: var(--pk-input-border);
            border-radius: var(--pk-input-border-radius, var(--pk-radius-sm));
            background: var(--pk-input-bg);
            background-clip: padding-box;
            box-sizing: border-box;
            transition: border-color 0.12s ease, box-shadow 0.12s ease;
        }

        .form-control__start,
        .form-control__end {
            margin: 0;
            color: var(--pk-color-gray-400);
            line-height: 0;
            align-self: stretch;
            align-items: center;
        }

        /* Decorative glyphs only — interactive in-control actions opt out below. */
        .form-control__start ::slotted(*),
        .form-control__end ::slotted(*) {
            display: block;
            max-width: 1.25rem;
            max-height: 1.25rem;
        }

        /* Copy (and similar) inside the field: flex-reserved space, not absolute overlay. */
        .form-control__end:has(::slotted(pk-copy-button)) {
            align-items: stretch;
        }

        .form-control__end ::slotted(pk-copy-button) {
            display: inline-flex;
            align-self: stretch;
            align-items: stretch;
            max-width: none;
            max-height: none;
            /*
             * Pull into trailing padding like combobox expand/clear, but leave a
             * small inset so the glyph is not tight against the field border.
             */
            margin-inline-end: calc(-1 * var(--pk-input-padding-inline) + 4px);
            margin-block: calc(-1 * var(--pk-input-padding-block));
        }

        .input {
            display: block;
            width: 100%;
            margin: 0;
            /* v1 Input default: py-1.5 + text-sm (14px / 1.25rem lh) → 34px with border. */
            padding-block: var(--pk-input-padding-block);
            padding-inline: 0;
            border: 0;
            border-radius: 0;
            background: transparent;
            /* Craft CP body / field value text. */
            color: var(--pk-color-gray-700);
            font: inherit;
            line-height: var(--pk-input-control-line-height, 1.25rem);
            appearance: none;
            box-sizing: border-box;
            outline: none;
        }

        .form-control__input .input {
            flex: 1 1 auto;
            min-width: 0;
        }

        .input::placeholder {
            color: var(--pk-input-placeholder-color, var(--pk-color-gray-400));
        }

        /*
         * Craft text:focus-visible only sets box-shadow (--focus-ring); resting border stays.
         * Do not also set border-color — --pk-input-focus-shadow already includes 0 0 0 1px,
         * so border-color + that ring reads as a double focus treatment.
         */
        :host(:not([invalid]):not(:state(user-invalid))) .form-control__input:focus-within,
        :host([data-state='focus-visible']:not([invalid]):not(:state(user-invalid))) .form-control__input {
            box-shadow: var(--pk-input-focus-shadow);
        }

        .form-control__input:has(.input:disabled) {
            cursor: not-allowed;
            opacity: 0.5;
        }

        .input:disabled {
            cursor: not-allowed;
        }

        :host([invalid]) .form-control__input,
        :host(:state(user-invalid)) .form-control__input {
            border-color: var(--pk-color-rose-600);
        }

        /* Invalid + focus: rose ring (same token as select/combobox), not sky over rose border. */
        :host([invalid]) .form-control__input:focus-within,
        :host([invalid][data-state='focus-visible']) .form-control__input,
        :host(:state(user-invalid)) .form-control__input:focus-within {
            box-shadow: var(--pk-input-invalid-focus-shadow);
        }

        :host([size='xs']) {
            --pk-input-padding-block: 4px;
            --pk-input-padding-inline: 6px;
            --pk-input-control-gap: 4px;
            --pk-input-decoration-size: 0.625rem;
        }

        :host([size='xs']) .input {
            font-size: 11px;
        }

        :host([size='sm']) {
            --pk-input-padding-block: 4px;
            --pk-input-padding-inline: 8px;
            --pk-input-control-gap: 4px;
            --pk-input-decoration-size: 0.6875rem;
        }

        :host([size='sm']) .input {
            font-size: 12px;
        }

        :host([size='lg']) {
            --pk-input-padding-block: 8px;
            --pk-input-padding-inline: 12px;
            --pk-input-control-gap: 8px;
            --pk-input-decoration-size: 0.875rem;
        }

        :host([size='lg']) .input {
            font-size: var(--pk-font-size-base);
        }

        :host([size='xl']) {
            --pk-input-padding-block: 10px;
            --pk-input-padding-inline: 16px;
            --pk-input-control-gap: 8px;
            --pk-input-decoration-size: 1rem;
        }

        :host([size='xl']) .input {
            font-size: 16px;
        }

        /*
         * Mono face + 0.9× optical size + line-height 1.5. The taller line-height
         * offsets the smaller face so padding + content height stays aligned with
         * stock inputs (1.25rem ≈ 1.5 × 12.6px). Scale the size's face, not
         * the parent em, so xs/sm/xl mono stay proportional.
         */
        :host([mono]) .input {
            font-family: var(--pk-input-mono-font-family);
            font-size: calc(var(--pk-font-size-base) * 0.9);
            line-height: var(--pk-input-mono-line-height, 1.5);
        }

        :host([mono][size='xs']) .input {
            font-size: calc(11px * 0.9);
        }

        :host([mono][size='sm']) .input {
            font-size: calc(12px * 0.9);
        }

        :host([mono][size='lg']) .input {
            font-size: calc(var(--pk-font-size-base) * 0.9);
        }

        :host([mono][size='xl']) .input {
            font-size: calc(16px * 0.9);
        }

        /* Editable-table cells (v1): flush into the row — no chrome border/radius.
         * Prefer reflected fit-cell (Lit property); data-editable-table-input is a legacy alias.
         * Fill host → form-control → input so the control spans the full td.
         */
        :host([fit-cell]),
        :host([data-editable-table-input]) {
            display: block;
            height: 100%;
            min-height: 100%;
            box-sizing: border-box;
        }

        :host([fit-cell]) .form-control,
        :host([data-editable-table-input]) .form-control {
            height: 100%;
            min-height: 100%;
            gap: 0;
        }

        :host([fit-cell]) .form-control__input,
        :host([data-editable-table-input]) .form-control__input {
            height: 100%;
            min-height: 100%;
            flex: 1 1 auto;
            padding-inline: 0;
            border: none;
            border-radius: 0;
            background: transparent;
            box-shadow: none;
        }

        :host([fit-cell]) .input,
        :host([data-editable-table-input]) .input {
            height: 100%;
            min-height: 100%;
        }

        :host([fit-cell]:not([invalid]):not(:state(user-invalid))) .form-control__input:focus-within,
        :host([fit-cell][data-state='focus-visible']:not([invalid]):not(:state(user-invalid))) .form-control__input,
        :host([data-editable-table-input]:not([invalid]):not(:state(user-invalid))) .form-control__input:focus-within,
        :host([data-editable-table-input][data-state='focus-visible']:not([invalid]):not(:state(user-invalid))) .form-control__input {
            border: none;
            box-shadow: inset 0 0 0 1px var(--pk-color-gray-200);
        }

        :host([fit-cell][invalid]) .form-control__input,
        :host([fit-cell]:state(user-invalid)) .form-control__input,
        :host([data-editable-table-input][invalid]) .form-control__input,
        :host([data-editable-table-input]:state(user-invalid)) .form-control__input {
            border: none;
            box-shadow: inset 0 0 0 1px var(--pk-color-rose-600);
        }

        :host([fit-cell][invalid]) .form-control__input:focus-within,
        :host([fit-cell][invalid][data-state='focus-visible']) .form-control__input,
        :host([fit-cell]:state(user-invalid)) .form-control__input:focus-within,
        :host([data-editable-table-input][invalid]) .form-control__input:focus-within,
        :host([data-editable-table-input][invalid][data-state='focus-visible']) .form-control__input,
        :host([data-editable-table-input]:state(user-invalid)) .form-control__input:focus-within {
            border: none;
            box-shadow: inset 0 0 0 1px var(--pk-color-rose-600);
        }

        :host([data-pk-group-orientation='horizontal'][data-pk-group-join]:not([data-pk-group-divider])) .form-control__input {
            border-left-width: 0;
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-join]:not([data-pk-group-divider])) .form-control__input {
            border-top-width: 0;
        }

        :host([data-pk-group-orientation='horizontal'][data-pk-group-divider]) .form-control__input {
            border-left-width: 1px;
            border-left-style: solid;
            border-left-color: var(--pk-btn-group-divider-color-outline, var(--pk-input-border-color));
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-divider]) .form-control__input {
            border-top-width: 1px;
            border-top-style: solid;
            border-top-color: var(--pk-btn-group-divider-color-outline, var(--pk-input-border-color));
        }

        :host([data-pk-group-orientation='horizontal'][data-pk-group-internal-trail]) .form-control__input {
            border-right-width: 0;
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-internal-trail]) .form-control__input {
            border-bottom-width: 0;
        }

        /*
         * Clear is a flex trailing action (not absolute). Reserves width in the
         * control so values cannot scroll under the glyph — same contract as
         * combobox clear/expand and image-browser clear.
         */
        .clear-button {
            display: inline-flex;
            flex-shrink: 0;
            align-self: stretch;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            width: calc(var(--pk-input-decoration-size) + var(--pk-input-padding-inline));
            margin-block: calc(-1 * var(--pk-input-padding-block));
            /* Match pk-copy-button[slot=end]: pull into padding but leave a 4px glyph inset. */
            margin-inline-end: calc(-1 * var(--pk-input-padding-inline) + 4px);
            font-size: var(--pk-input-decoration-size);
            line-height: 1;
        }
    }
`,U=class extends oe{constructor(...e){super(...e),this.assumeInteractionOn=[`blur`,`input`],this.hasSlotController=new re(this,`instructions`,`hint`,`label`,`start`,`end`),this.inputId=ee(`pk-input`),this.type=`text`,this._value=null,this.defaultValue=null,this.size=`default`,this.label=``,this.instructions=``,this.withClear=!1,this.placeholder=``,this.readonly=!1,this.invalid=!1,this.fitCell=!1,this.mono=!1,this.autofocus=!1,this.withLabel=!1,this.withInstructions=!1}static{this.styles=[Tt,p(),d(`.input`,`var(--pk-input-border-radius, var(--pk-radius-sm))`),f(`.input`),ca]}static get validators(){return[...super.validators,ae(),se()]}get value(){return this.valueHasChanged?this._value??``:this._value??this.defaultValue??``}set value(e){let t=e??``;this._value!==t&&(this.valueHasChanged=!0,this._value=t)}connectedCallback(){this.instructions=wt(this,this.instructions),this.hasAttribute(`with-hint`)&&(this.withInstructions=!0),super.connectedCallback()}syncFormValue(){this.setValue(this.value||``)}resetToDefaultValue(){this.valueHasChanged=!1,this._value=null}restoreFormState(e){typeof e==`string`&&(this.value=e)}formResetCallback(){this.valueHasChanged=!1,this._value=null,this.input&&(this.input.value=this.defaultValue??``),super.formResetCallback()}updated(e){(e.has(`value`)||e.has(`defaultValue`))&&this.setState(`blank`,!this.value),super.updated(e)}syncStandaloneAria(){if(!this.input)return;let e=!!this.label||this.hasSlotController.test(`label`,this.withLabel),t=Et((e,t)=>this.hasSlotController.test(e,t),this.instructions,this.withInstructions);ie({control:this.input,labelId:`${this.inputId}-label`,instructionsId:`${this.inputId}-instructions`,hasLabel:e,hasInstructions:t,required:this.required,invalid:this.invalid||!this.internals.validity.valid})}hasLabelContent(){return!!this.label||this.hasSlotController.test(`label`,this.withLabel)}hasInstructionsContent(){return Et((e,t)=>this.hasSlotController.test(e,t),this.instructions,this.withInstructions)}focus(e){this.input?.focus(e)}blur(){this.input?.blur()}select(){this.input?.select()}handleInput(){this.value=this.input.value,this.dispatchEvent(new Event(`input`,{bubbles:!0,composed:!0}))}handleChange(e){this.value=this.input.value,e.stopPropagation(),this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0}))}handleKeyDown(e){sa(this,e,this.type)}handleClearClick(e){e.preventDefault(),this.value!==``&&(this.value=``,this.dispatchEvent(new Ct),this.dispatchEvent(new Event(`input`,{bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0})),this.input.focus())}render(){let e=this.hasLabelContent(),t=this.hasInstructionsContent(),i=this.withClear&&!this.disabled&&!this.readonly&&this.value.length>0,a=this.hasSlotController.test(`start`),o=this.hasSlotController.test(`end`);return n`
            <div part="form-control" class="form-control">
                ${e||t?n`
                        <div part="header" class="form-control__header">
                            ${e?n`
                                    <label
                                        part="label"
                                        class="form-control__label"
                                        id=${`${this.inputId}-label`}
                                        for=${`${this.inputId}-control`}
                                    >
                                        <slot name="label">${this.label}</slot>
                                    </label>
                                `:r}

                            ${t?n`
                                    <p
                                        part="instructions"
                                        class="form-control__instructions"
                                        id=${`${this.inputId}-instructions`}
                                    >
                                        <slot name="instructions">${this.instructions}</slot>
                                        <slot name="hint"></slot>
                                    </p>
                                `:r}
                        </div>
                    `:r}

                <div part="base" class="form-control__input">
                    ${a?n`
                            <span part="start" class="form-control__start">
                                <slot name="start"></slot>
                            </span>
                        `:n`<slot name="start" hidden></slot>`}

                    <input
                        part="input"
                        class="input"
                        id=${e?`${this.inputId}-control`:r}
                        type=${this.type}
                        .value=${na(this.value)}
                        placeholder=${this.placeholder||r}
                        pattern=${ta(this.pattern)}
                        minlength=${ta(this.minlength)}
                        maxlength=${ta(this.maxlength)}
                        min=${ta(this.min)}
                        max=${ta(this.max)}
                        step=${ta(this.step)}
                        autocomplete=${ta(this.autocomplete)}
                        ?disabled=${this.disabled}
                        ?readonly=${this.readonly}
                        ?required=${this.required}
                        ?autofocus=${this.autofocus}
                        @input=${this.handleInput}
                        @change=${this.handleChange}
                        @keydown=${this.handleKeyDown}
                        @focus=${()=>this.dispatchEvent(new Event(`focus`,{bubbles:!0,composed:!0}))}
                        @blur=${()=>this.dispatchEvent(new Event(`blur`,{bubbles:!0,composed:!0}))}
                    />

                    ${i?n`
                            <button
                                part="clear-button"
                                class="icon-button clear-button"
                                type="button"
                                tabindex="-1"
                                aria-label="Clear"
                                @click=${this.handleClearClick}
                            >
                                <slot name="clear-icon">×</slot>
                            </button>
                        `:r}

                    ${o?n`
                            <span part="end" class="form-control__end">
                                <slot name="end"></slot>
                            </span>
                        `:n`<slot name="end" hidden></slot>`}
                </div>
            </div>
        `}};i([e(`input`)],U.prototype,`input`,void 0),i([c({reflect:!0})],U.prototype,`type`,void 0),i([a()],U.prototype,`value`,null),i([c({attribute:`value`,reflect:!0})],U.prototype,`defaultValue`,void 0),i([c({reflect:!0})],U.prototype,`size`,void 0),i([c()],U.prototype,`label`,void 0),i([c()],U.prototype,`instructions`,void 0),i([c({attribute:`with-clear`,type:Boolean})],U.prototype,`withClear`,void 0),i([c()],U.prototype,`placeholder`,void 0),i([c({type:Boolean,reflect:!0})],U.prototype,`readonly`,void 0),i([c({type:Boolean,reflect:!0})],U.prototype,`invalid`,void 0),i([c({type:Boolean,reflect:!0,attribute:`fit-cell`})],U.prototype,`fitCell`,void 0),i([c({type:Boolean,reflect:!0})],U.prototype,`mono`,void 0),i([c()],U.prototype,`pattern`,void 0),i([c({type:Number})],U.prototype,`minlength`,void 0),i([c({type:Number})],U.prototype,`maxlength`,void 0),i([c()],U.prototype,`min`,void 0),i([c()],U.prototype,`max`,void 0),i([c()],U.prototype,`step`,void 0),i([c()],U.prototype,`autocomplete`,void 0),i([c({type:Boolean,reflect:!0})],U.prototype,`autofocus`,void 0),i([c({attribute:`with-label`,type:Boolean})],U.prototype,`withLabel`,void 0),i([c({attribute:`with-instructions`,type:Boolean})],U.prototype,`withInstructions`,void 0),U=i([s(`pk-input`)],U);var la=null;async function ua(){typeof customElements<`u`&&customElements.get(`pk-dialog`)||(la||=ue(()=>import(`./pk-dialog-C6MJmqEE.js`).then(()=>void 0),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9]),import.meta.url).catch(e=>{if(!customElements.get(`pk-dialog`))throw e}).finally(()=>{la=null}),await la)}var da=null,fa=class extends t{#e=`Insert Link`;get dialogTitle(){return this.#e}set dialogTitle(e){this.#e=e}#t=`Insert`;get submitLabel(){return this.#t}set submitLabel(e){this.#t=e}#n=null;#r={url:``,text:``,openInNewTab:!1};#i=!0;#a=`vizy-link-url-${Math.random().toString(36).slice(2,9)}`;#o=`vizy-link-text-${Math.random().toString(36).slice(2,9)}`;#s=null;get dialog(){return this.#s}set dialog(e){this.#s=e}#c=null;get urlInput(){return this.#c}set urlInput(e){this.#c=e}#l=null;get textInput(){return this.#l}set textInput(e){this.#l=e}#u=null;get newTabCheckbox(){return this.#u}set newTabCheckbox(e){this.#u=e}#d=null;get submitButton(){return this.#d}set submitButton(e){this.#d=e}static styles=o`
        :host {
            display: contents;
        }
        .link-dialog__fields {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
    `;async openForEditor(e,t,n){await ua(),this.#n=e,this.#r={...t},this.#i=n?.focus??!0;let r=!!(t.url.trim()||t.semantic);this.dialogTitle=r?`Update Link`:`Insert Link`,this.submitLabel=r?`Update`:`Insert`,await this.updateComplete,this.#f(),await this.dialog?.updateComplete,await this.dialog?.show()}render(){return n`
            <pk-dialog
                class="link-dialog"
                size="wide"
                label=${this.dialogTitle}
                @pk-after-hide=${this.#_}
                @keydown=${this.#h}
            >
                <div class="link-dialog__fields">
                    <pk-field label="URL" required .for=${this.#a}>
                        <pk-input
                            id=${this.#a}
                            class="link-dialog__url-input"
                            type="url"
                            placeholder="https://"
                            autofocus
                            @input=${this.#m}
                        ></pk-input>
                    </pk-field>
                    <pk-field label="Text" .for=${this.#o}>
                        <pk-input
                            id=${this.#o}
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
                    @click=${this.#g}
                >${this.submitLabel}</pk-button>
            </pk-dialog>
        `}#f(){this.urlInput&&(this.urlInput.value=this.#r.url??``),this.textInput&&(this.textInput.value=this.#r.text??``),this.newTabCheckbox&&(this.newTabCheckbox.checked=!!this.#r.openInNewTab),this.#p()}#p(){let e=!!(this.urlInput?.value.trim()||this.#r.semantic);this.submitButton&&(this.submitButton.disabled=!e)}#m=()=>{this.#r={...this.#r,semantic:void 0},this.#p()};#h=e=>{if(e.key!==`Enter`)return;let t=e.composedPath();t.some(e=>e instanceof HTMLElement&&e.localName===`pk-checkbox`)||t.some(e=>e instanceof HTMLElement&&(e.localName===`pk-button`||e instanceof HTMLButtonElement))||(e.preventDefault(),e.stopPropagation(),this.#g())};#g=()=>{let e=this.#n,t=this.urlInput?.value.trim()??``;if(!e||!t&&!this.#r.semantic)return;let n=!!this.newTabCheckbox?.checked,r=this.textInput?.value??``;Xi(e,{attrs:this.#r.semantic?{...this.#r.semantic,newWindow:n}:Qi(t,n),text:r,from:this.#r.from,to:this.#r.to,focus:this.#i}),this.dialog?.hide(`submit`)};#_=()=>{this.#n=null}};P([c()],fa.prototype,`dialogTitle`,null),P([c()],fa.prototype,`submitLabel`,null),P([e(`pk-dialog`)],fa.prototype,`dialog`,null),P([e(`.link-dialog__url-input`)],fa.prototype,`urlInput`,null),P([e(`.link-dialog__text-input`)],fa.prototype,`textInput`,null),P([e(`pk-checkbox`)],fa.prototype,`newTabCheckbox`,null),P([e(`.link-dialog__submit`)],fa.prototype,`submitButton`,null),fa=P([N(`vizy-link-dialog`)],fa);async function pa(e,t,n){await ua(),(!da||!da.isConnected)&&(da=document.createElement(`vizy-link-dialog`),document.body.append(da),await da.updateComplete),await da.openForEditor(e,t,n)}function ma(){return{openElementSelector:(e,t)=>{let n=window.Craft;if(!n?.createElementSelectorModal)throw Error(`Craft element selector is not available in this environment.`);n.createElementSelectorModal(e,t)}}}function ha(e){let{from:t,to:n}=e.state.selection;return e.state.doc.textBetween(t,n,` `)}function ga(e,t,n){if(t!==`link`){(n?.focus??e.view.hasFocus()?e.chain().focus():e.chain()).toggleMark(t).run();return}_a(e,n)}async function _a(e,t){await pa(e,e.isActive(`link`)?Ji(e):Yi(e),t)}function va(e,t){Zi(e,t)}function ya(e){return Li(e?.linkOptions)}function ba(e,t,n,r){let i=n.linkSelectorStorageKeyPrefix||`VizyInput.LinkTo.${n.elementSiteId??`site`}`;ma().openElementSelector(t.elementType,{storageKey:`${i}.${t.elementType}`,sources:t.sources,criteria:t.criteria,defaultSiteId:n.elementSiteId,autoFocusSearchBox:!1,closeOtherModals:!1,onSelect:i=>{if(!i?.length)return;let[a]=i,o=ha(e)||a.label||``,s=xa(a),c=Sa(t.refHandle),l=Ca(n.elementSiteId,a.siteId);if(s&&c){pa(e,{url:a.url||``,text:o,openInNewTab:!1,semantic:Bi({type:c,targetUid:s,siteMode:l.siteMode,siteUid:l.siteUid,newWindow:!1})},r);return}pa(e,{url:Ri(a,t.refHandle),text:o,openInNewTab:!1},r)}})}function xa(e){if(typeof e.uid==`string`&&H(e.uid))return e.uid;let t=e.$element?.data?.(`uid`);if(typeof t==`string`&&H(t))return t;let n=e.$element?.attr?.(`data-uid`);return typeof n==`string`&&H(n)?n:null}function Sa(e){switch(e){case`entry`:return`entry`;case`asset`:return`asset`;case`category`:return`category`;default:return null}}function Ca(e,t){if(!t||!e||t===e)return{siteMode:`current`,siteUid:null};let n=window.Craft?.sites?.find(e=>e.id===t);return{siteMode:`fixed`,siteUid:typeof n?.uid==`string`&&H(n.uid)?n.uid:null}}var wa=new Map,Ta=new Map;function Ea(e,t){let n=Ta.get(e)??new Set;return n.add(t),Ta.set(e,n),()=>{n.delete(t),n.size===0&&Ta.delete(e)}}function Da(e,t){wa.set(e,t);for(let t of[...Ta.get(e)??[]])t()}function Oa(e){return wa.get(e)??null}function ka(e){if(e)for(let[t,n]of Object.entries(e))!t||!n?.url||Da(t,{assetId:Number(n.assetId)||0,url:n.url,label:n.label||`Image`,transform:n.transform??``})}function Aa(e){let t=wa.get(e);if(!t)return null;let n=t.url.indexOf(`#`),r=n<0?t.url:t.url.slice(0,n),i=n<0?``:t.url.slice(n),a=r.includes(`?`)?t.url:`${r}?v=${Date.now()}${i}`;return Da(e,{...t,url:a}),a}var ja=[{value:`default`,label:`Default`},{value:`small`,label:`Small`},{value:`medium`,label:`Medium`},{value:`large`,label:`Large`},{value:`full`,label:`Full`}];function Ma(e){return e.isActive(`image`)?La(e.getAttributes(`image`)):null}function Na(e){let t=Ma(e);if(!t)return null;let n=Oa(t.assetUid),r=t.link;return{assetUid:t.assetUid,assetId:n?.assetId??0,previewUrl:n?.url??``,alt:t.alt??``,title:t.title??``,linkUrl:r?Ui(r):``,openInNewTab:r?.newWindow??!1,size:t.size,transform:n?.transform??``,updating:!0,originalAttrs:t}}function Pa(e,t){Da(t.attrs.assetUid,{assetId:t.preview.assetId,url:t.preview.url,label:t.preview.label,transform:t.preview.transform});let n=t.focus??!0?e.chain().focus():e.chain();return t.replaceSelection&&e.isActive(`image`)?n.updateAttributes(`image`,t.attrs).run():n.setSemanticImage(t.attrs).run()}function Fa(e,t){let n=t?.focus??!0?e.chain().focus():e.chain();if(e.state.selection instanceof A&&e.state.selection.node.type.name===`image`){n.deleteSelection().run();return}if(e.isActive(`image`)){let t=e.state.selection.$from.before(e.state.selection.$from.depth);e.state.doc.nodeAt(t)?.type.name===`image`&&n.setNodeSelection(t).deleteSelection().run()}}function Ia(e){let t=e.alt.trim(),n=e.title.trim(),r=e.linkUrl.trim(),i=e.originalAttrs,a=i?.link,o=a?Ui(a):``,s=a&&r===o?{...a,newWindow:e.openInNewTab}:r?Qi(r,e.openInNewTab):null,c=i&&e.alt===(i.alt??``);return{assetUid:e.assetUid,siteMode:i?.siteMode??`current`,siteUid:i?.siteUid??null,altMode:c?i.altMode:t?`custom`:`asset`,alt:c?i.alt:t||null,title:n||null,size:e.size,link:s,imageUid:i?.imageUid??null}}function La(e){let t=typeof e.assetUid==`string`?e.assetUid:``;if(!t)return null;let n=[`default`,`small`,`medium`,`large`,`full`].includes(String(e.size))?e.size:`default`,r=[`asset`,`custom`,`decorative`,`missing`].includes(String(e.altMode))?e.altMode:`asset`,i=null;if(e.link&&typeof e.link==`object`){let t=e.link;i=Vi(t)}return{assetUid:t,siteMode:e.siteMode===`fixed`?`fixed`:`current`,siteUid:typeof e.siteUid==`string`?e.siteUid:null,altMode:r,alt:typeof e.alt==`string`?e.alt:null,title:typeof e.title==`string`?e.title:null,size:n,link:i,imageUid:typeof e.imageUid==`string`?e.imageUid:null}}function Ra(e,t){if(!e)return Promise.resolve(null);let n=window.Craft;return typeof n?.sendActionRequest==`function`?n.sendActionRequest(`POST`,t?`assets/generate-transform`:`vizy/assets/info`,{data:{assetId:e,handle:t}}).then(e=>e.data.url??null).catch(()=>null):Promise.resolve(null)}async function za(e){let t=Oa(e);if(!t)return null;let n=await Ra(t.assetId,t.transform);return!n||Oa(e)!==t?null:(Da(e,{...t,url:n}),Aa(e))}var Ba=null,W=class extends t{#e=`Insert Image`;get dialogTitle(){return this.#e}set dialogTitle(e){this.#e=e}#t=`Insert`;get submitLabel(){return this.#t}set submitLabel(e){this.#t=e}#n=null;#r=null;#i=0;#a=!0;#o=Math.random().toString(36).slice(2,9);#s=null;get dialog(){return this.#s}set dialog(e){this.#s=e}#c=null;get altInput(){return this.#c}set altInput(e){this.#c=e}#l=null;get titleInput(){return this.#l}set titleInput(e){this.#l=e}#u=null;get urlInput(){return this.#u}set urlInput(e){this.#u=e}#d=null;get newTabCheckbox(){return this.#d}set newTabCheckbox(e){this.#d=e}#f=null;get sizeSelect(){return this.#f}set sizeSelect(e){this.#f=e}#p=null;get transformSelect(){return this.#p}set transformSelect(e){this.#p=e}#m=null;get previewImg(){return this.#m}set previewImg(e){this.#m=e}#h=[];get transforms(){return this.#h}set transforms(e){this.#h=e}static styles=o`
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
    `;async openForEditor(e,t,n){await ua(),this.#n=e,this.#r={...t},this.#a=n?.focus??!0,n?.transforms&&(this.transforms=n.transforms),this.dialogTitle=t.updating?`Edit Image`:`Insert Image`,this.submitLabel=t.updating?`Update`:`Insert`,await this.updateComplete,this.#g(),await this.dialog?.updateComplete,await this.dialog?.show()}render(){return n`
            <pk-dialog
                class="image-dialog"
                size="wide"
                label=${this.dialogTitle}
                without-body-padding
                @pk-after-hide=${this.#y}
            >
                <div class="body">
                    <div class="preview">
                        ${this.#r?.previewUrl?n`<img class="image-dialog__preview-img" src=${this.#r.previewUrl} alt="">`:n`<p class="preview-empty">No preview</p>`}
                    </div>
                    <div class="fields">
                        <pk-field label="Alt Text" .for=${`vizy-img-alt-${this.#o}`}>
                            <pk-input id=${`vizy-img-alt-${this.#o}`} class="image-dialog__alt" type="text" autofocus></pk-input>
                        </pk-field>
                        <pk-field label="Title" .for=${`vizy-img-title-${this.#o}`}>
                            <pk-input id=${`vizy-img-title-${this.#o}`} class="image-dialog__title" type="text"></pk-input>
                        </pk-field>
                        <pk-field label="URL" .for=${`vizy-img-url-${this.#o}`}>
                            <pk-input id=${`vizy-img-url-${this.#o}`} class="image-dialog__url" type="url" placeholder="https://"></pk-input>
                        </pk-field>
                        <pk-checkbox>Open link in new tab</pk-checkbox>
                        <pk-field label="Size" .for=${`vizy-img-size-${this.#o}`}>
                            <pk-select
                                id=${`vizy-img-size-${this.#o}`}
                                class="image-dialog__size"
                                width="full"
                            >
                                ${ja.map(e=>n`
                                    <pk-option value=${e.value} label=${e.label}>${e.label}</pk-option>
                                `)}
                            </pk-select>
                        </pk-field>
                        ${this.transforms.length>0?n`
                            <pk-field label="Transform" .for=${`vizy-img-transform-${this.#o}`}>
                                <pk-select
                                    id=${`vizy-img-transform-${this.#o}`}
                                    class="image-dialog__transform"
                                    width="full"
                                    @pk-change=${this.#_}
                                >
                                    <pk-option value="" label="No Transform">No Transform</pk-option>
                                    ${this.transforms.map(e=>n`
                                        <pk-option value=${e.handle} label=${e.name}>${e.name}</pk-option>
                                    `)}
                                </pk-select>
                            </pk-field>
                        `:null}
                    </div>
                </div>
                <pk-button slot="footer" data-dialog-close>Cancel</pk-button>
                <pk-button
                    slot="footer"
                    variant="primary"
                    @click=${this.#v}
                >${this.submitLabel}</pk-button>
            </pk-dialog>
        `}#g(){let e=this.#r;e&&(this.altInput&&(this.altInput.value=e.alt),this.titleInput&&(this.titleInput.value=e.title),this.urlInput&&(this.urlInput.value=e.linkUrl),this.newTabCheckbox&&(this.newTabCheckbox.checked=e.openInNewTab),this.sizeSelect&&(this.sizeSelect.value=e.size),this.transformSelect&&(this.transformSelect.value=e.transform),this.previewImg&&e.previewUrl&&(this.previewImg.src=e.previewUrl))}#_=()=>{let e=this.#r;if(!e||!this.transformSelect)return;let t=this.transformSelect.value,n=++this.#i;e.transform=t,Ra(e.assetId,t).then(t=>{!t||!this.isConnected||this.#r!==e||n!==this.#i||(e.previewUrl=t,this.previewImg&&(this.previewImg.src=t),this.requestUpdate())})};#v=()=>{let e=this.#n,t=this.#r;if(!e||!t)return;let n={...t,alt:this.altInput?.value??``,title:this.titleInput?.value??``,linkUrl:this.urlInput?.value??``,openInNewTab:!!this.newTabCheckbox?.checked,size:this.sizeSelect?.value||`default`,transform:this.transformSelect?.value??t.transform};Pa(e,{attrs:Ia(n),preview:{assetId:n.assetId,url:n.previewUrl,label:n.alt||n.title||`Image`,transform:n.transform},focus:this.#a,replaceSelection:n.updating}),this.dialog?.hide(`submit`)};#y=()=>{this.#n=null,this.#r=null}};P([c()],W.prototype,`dialogTitle`,null),P([c()],W.prototype,`submitLabel`,null),P([e(`pk-dialog`)],W.prototype,`dialog`,null),P([e(`.image-dialog__alt`)],W.prototype,`altInput`,null),P([e(`.image-dialog__title`)],W.prototype,`titleInput`,null),P([e(`.image-dialog__url`)],W.prototype,`urlInput`,null),P([e(`pk-checkbox`)],W.prototype,`newTabCheckbox`,null),P([e(`.image-dialog__size`)],W.prototype,`sizeSelect`,null),P([e(`.image-dialog__transform`)],W.prototype,`transformSelect`,null),P([e(`.image-dialog__preview-img`)],W.prototype,`previewImg`,null),P([c({attribute:!1})],W.prototype,`transforms`,null),W=P([N(`vizy-image-dialog`)],W);async function Va(e,t,n){await ua(),(!Ba||!Ba.isConnected)&&(Ba=document.createElement(`vizy-image-dialog`),document.body.append(Ba),await Ba.updateComplete),await Ba.openForEditor(e,t,n)}function Ha(e,t,n){if(e.isActive(`image`)){let r=Na(e);if(r){Va(e,r,{focus:n?.focus,transforms:t.transforms??[]});return}}Ua(e,t,n)}function Ua(e,t,n){let r=window.Craft;if(!r?.createElementSelectorModal)throw Error(`Craft element selector is not available in this environment.`);let i=t.volumes??[],a=(t.transforms??[]).filter(e=>e.handle&&e.name);t.defaultTransform,r.createElementSelectorModal(`craft\\elements\\Asset`,{storageKey:`${t.linkSelectorStorageKeyPrefix??`VizyInput`}.ChooseImage`,multiSelect:!1,sources:i.length?i:void 0,defaultSource:t.defaultSource??void 0,criteria:{siteId:t.elementSiteId,kind:`image`},transforms:a,closeOtherModals:!1,onSelect:(r,i)=>{Wa(e,t,r,i,n)}})}async function Wa(e,t,n,r,i){if(!n?.length)return;let[a]=n;if(!a.id){console.warn(`[vizy] Image select: asset has no id`);return}let o=Ga(a),s=a.url||``,c=a.label||``,l=a.label||``;if(!o||!H(o)){let e=await Ka(a.id,a.siteId??t.elementSiteId);if(!e?.uid||!H(e.uid)){console.warn(`[vizy] Image select: could not resolve asset uid`,a.id);return}o=e.uid,s=s||e.url||``,c=c||e.alt||e.title||``,l=l||e.title||``}let u=typeof r==`string`&&r?r:t.defaultTransform??``;if(u&&(!r||typeof r!=`string`)){let e=await qa(a.id,u);e&&(s=e)}Da(o,{assetId:a.id,url:s,label:l||c||`Image`,transform:u}),await Va(e,{assetUid:o,assetId:a.id,previewUrl:s,alt:c,title:l,linkUrl:``,openInNewTab:!1,size:`default`,transform:u,updating:!1},{focus:i?.focus,transforms:t.transforms??[]})}function Ga(e){if(typeof e.uid==`string`&&H(e.uid))return e.uid;let t=e.$element?.data?.(`uid`);if(typeof t==`string`&&H(t))return t;let n=e.$element?.attr?.(`data-uid`);return typeof n==`string`&&H(n)?n:null}async function Ka(e,t){let n=window.Craft;if(typeof n?.sendActionRequest!=`function`)return null;try{let r=await n.sendActionRequest(`POST`,`vizy/assets/info`,{data:{assetId:e,siteId:t}});return r.data?.uid?{uid:r.data.uid,url:r.data.url??null,title:r.data.title??``,alt:r.data.alt??``}:null}catch(e){return console.warn(`[vizy] Image select: asset info request failed`,e),null}}async function qa(e,t){let n=window.Craft;if(!t||typeof n?.sendActionRequest!=`function`)return null;try{return(await n.sendActionRequest(`POST`,`assets/generate-transform`,{data:{assetId:e,handle:t}})).data.url??null}catch{return null}}var Ja=/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i,Ya=/(?:vimeo\.com\/(?:video\/)?)(\d+)/i;function Xa(e){let t=e.trim();if(!t)return null;try{let e=/^https?:\/\//i.test(t)?t:`https://${t}`,n=new URL(e);return n.protocol!==`https:`&&n.protocol!==`http:`?null:(n.protocol===`http:`&&(n.protocol=`https:`),n.toString())}catch{return null}}function Za(e){let t=Xa(e);if(!t)return null;let n=t.match(Ja);if(n?.[1]){let e=n[1];return{provider:`youtube`,url:t,resourceId:e,html:Qa(`https://www.youtube.com/embed/${encodeURIComponent(e)}`,`YouTube video`)}}let r=t.match(Ya);if(r?.[1]){let e=r[1];return{provider:`vimeo`,url:t,resourceId:e,html:Qa(`https://player.vimeo.com/video/${encodeURIComponent(e)}`,`Vimeo video`)}}return{provider:`unknown`,url:t,resourceId:null,html:null}}function Qa(e,t){return`<div class="vizy-media-embed__frame" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;"><iframe src="${e}" title="${$a(t)}" style="position:absolute;inset:0;width:100%;height:100%;border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`}function $a(e){return e.replace(/&/g,`&amp;`).replace(/"/g,`&quot;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`)}var eo=null,to=class extends t{#e=`Insert Media Embed`;get dialogTitle(){return this.#e}set dialogTitle(e){this.#e=e}#t=`Insert`;get submitLabel(){return this.#t}set submitLabel(e){this.#t=e}#n=null;#r={kind:`mediaEmbed`,url:``,updating:!1};#i=!0;#a=`vizy-url-node-${Math.random().toString(36).slice(2,9)}`;#o=null;get dialog(){return this.#o}set dialog(e){this.#o=e}#s=null;get urlInput(){return this.#s}set urlInput(e){this.#s=e}#c=null;get submitButton(){return this.#c}set submitButton(e){this.#c=e}static styles=o`
        :host { display: contents; }
        .fields {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
    `;async openForEditor(e,t,n){await ua(),this.#n=e,this.#r={...t},this.#i=n?.focus??!0;let r=t.kind===`iframe`?`iFrame`:`Media Embed`;this.dialogTitle=t.updating?`Edit ${r}`:`Insert ${r}`,this.submitLabel=t.updating?`Update`:`Insert`,await this.updateComplete,this.#l(),await this.dialog?.updateComplete,await this.dialog?.show()}render(){return n`
            <pk-dialog
                class="url-node-dialog"
                size="wide"
                label=${this.dialogTitle}
                @pk-after-hide=${this.#m}
                @keydown=${this.#f}
            >
                <div class="fields">
                    <pk-field label="URL" required .for=${this.#a}>
                        <pk-input
                            id=${this.#a}
                            class="url-node-dialog__url"
                            type="url"
                            placeholder="https://"
                            autofocus
                            @input=${this.#d}
                        ></pk-input>
                    </pk-field>
                </div>
                <pk-button slot="footer" data-dialog-close>Cancel</pk-button>
                <pk-button
                    slot="footer"
                    class="url-node-dialog__submit"
                    variant="primary"
                    disabled
                    @click=${this.#p}
                >${this.submitLabel}</pk-button>
            </pk-dialog>
        `}#l(){this.urlInput&&(this.urlInput.value=this.#r.url??``),this.#u()}#u(){let e=!!Xa(this.urlInput?.value??``);this.submitButton&&(this.submitButton.disabled=!e)}#d=()=>{this.#u()};#f=e=>{e.key===`Enter`&&(e.preventDefault(),e.stopPropagation(),this.#p())};#p=()=>{let e=this.#n,t=Xa(this.urlInput?.value??``);if(!e||!t)return;let n=this.#i?e.chain().focus():e.chain(),r=this.#r.updating&&e.isActive(this.#r.kind);if(this.#r.kind===`iframe`)r?n.updateAttributes(`iframe`,{url:t,frameborder:0,allowfullscreen:!0}).run():n.setVizyIframe({url:t}).run();else{let e=Za(t);if(!e)return;let i={url:e.url,data:e.html?{html:e.html}:null};r?n.updateAttributes(`mediaEmbed`,i).run():n.setVizyMediaEmbed({url:e.url}).run()}this.dialog?.hide(`submit`)};#m=()=>{this.#n=null}};P([c()],to.prototype,`dialogTitle`,null),P([c()],to.prototype,`submitLabel`,null),P([e(`pk-dialog`)],to.prototype,`dialog`,null),P([e(`.url-node-dialog__url`)],to.prototype,`urlInput`,null),P([e(`.url-node-dialog__submit`)],to.prototype,`submitButton`,null),to=P([N(`vizy-url-node-dialog`)],to);async function no(e,t,n){await ua(),(!eo||!eo.isConnected)&&(eo=document.createElement(`vizy-url-node-dialog`),document.body.append(eo),await eo.updateComplete),await eo.openForEditor(e,t,n)}function ro(e,t){if(!e.isActive(t))return null;let n=e.getAttributes(t);return{kind:t,url:typeof n.url==`string`?n.url:``,updating:!0}}function io(e,t,n){let r=n?.focus??!0?e.chain().focus():e.chain(),{selection:i}=e.state;if(i instanceof A&&i.node.type.name===t){r.deleteSelection().run();return}if(e.isActive(t)){let n=i.$from.before(i.$from.depth);e.state.doc.nodeAt(n)?.type.name===t&&r.setNodeSelection(n).deleteSelection().run()}}function ao(e,t,n){if(e.isActive(t)){let r=ro(e,t);if(r){no(e,r,{focus:n?.focus});return}}no(e,{kind:t,url:``,updating:!1},{focus:n?.focus})}var oo=new gn;function so(e,t={}){if(!e.schema.nodes.layout||!e.schema.nodes.column)return!1;if(e.isActive(`layout`)){let n=t.focus?e.chain().focus():e.chain();return typeof n.unwrapLayout==`function`&&n.unwrapLayout().run()}let{from:n}=e.state.selection;if(Ye(e.state.doc,n))return!1;let r=t.presets?.length?t.presets:Je;if(r.length===1)return co(e,r[0],t.focus);let i=e.view.dom.closest(`.vizy-editor-surface`)?.parentElement??e.view.dom.parentElement;if(!i)return!1;let a=t.invoker?.getBoundingClientRect()??(()=>{let t=e.view.coordsAtPos(n);return new DOMRect(t.left,t.top,1,t.bottom-t.top)})();return oo.open(a,r,i,{returnFocus:t.invoker??e.view.dom,onSelect:t=>{let n=nt(r,t);n&&co(e,n,!0)}}),!0}function co(e,t,n){n&&e.view.focus();let r=()=>crypto.randomUUID(),{from:i,to:a}=e.state.selection;return e.state.selection instanceof A||ft(e,i,a)?qe(e,i,a,t,r):Ge(e,t,i,r)}var lo={rows:3,cols:3,withHeaderRow:!0};function uo(e,t,n){let r=n?.focus??e.view.hasFocus(),i=n?.controlId?yt(n.controlId):void 0;if(i)return r&&e.chain().focus().run(),i.run(e)!==!1;if(t.command===`registeredControl`)return!1;if(t.command===`setLink`)return ga(e,`link`,{focus:r}),!0;if(t.command===`insertNode`&&t.nodeName===`image`)return Ha(e,n?.imageAuthoring??{},{focus:r}),!0;if(t.command===`insertNode`&&(t.nodeName===`iframe`||t.nodeName===`mediaEmbed`))return ao(e,t.nodeName,{focus:r}),!0;if(t.command===`wrapInLayout`)return so(e,{focus:r,presets:n?.layoutPresets,invoker:n?.invoker});let a=r?e.chain().focus():e.chain();switch(t.command){case`toggleMark`:return a.toggleMark(t.markName).run(),!0;case`setParagraph`:return a.setParagraph().run(),!0;case`setHeading`:return yo(t.level)?(a.toggleHeading({level:t.level}).run(),!0):!1;case`toggleNode`:return po(a,t.nodeName);case`insertNode`:return mo(e,t.nodeName,r);case`setTextAlign`:return e.isActive({textAlign:t.align})?(a.unsetTextAlign().run(),!0):(a.setTextAlign(t.align).run(),!0);case`clearFormatting`:return a.unsetAllMarks().clearNodes().run(),!0;case`openAddBlock`:return!1;case`undo`:return a.undo().run(),!0;case`redo`:return a.redo().run(),!0;case`tableOperation`:return fo(a,t.operation);default:return!1}}function fo(e,t){let n=e[t];return typeof n==`function`&&n.call(e).run()}function po(e,t){switch(t){case`heading`:return e.toggleHeading({level:2}).run(),!0;case`bulletList`:return e.toggleBulletList().run(),!0;case`orderedList`:return e.toggleOrderedList().run(),!0;case`blockquote`:return e.toggleBlockquote().run(),!0;case`codeBlock`:return e.toggleCodeBlock().run(),!0;default:return!1}}function mo(e,t,n){let r=n?e.chain().focus():e.chain();if(t===`horizontalRule`)return r.setHorizontalRule().run();if(t===`table`)return r.insertTable(lo).run();if(t===`hardBreak`)return r.setHardBreak().run();let i=e.schema.nodes[t];if(!i)return!1;try{let e=i.createAndFill();return e?r.insertContent(e.toJSON()).run():!1}catch{return!1}}function ho(e){if(yt(e.id))return!0;let t=e.action;return t?t.command===`toggleNode`?_o.includes(t.nodeName):t.command===`setHeading`?yo(t.level):vo.includes(t.command):!1}function go(e,t,n){let r=n?yt(n):void 0;if(r?.isActive)return!!r.isActive(e);if(!t)return!1;switch(t.command){case`toggleMark`:return e.isActive(t.markName);case`setLink`:return e.isActive(`link`);case`insertNode`:return t.nodeName===`image`?e.isActive(`image`):t.nodeName===`iframe`?e.isActive(`iframe`):t.nodeName===`mediaEmbed`&&e.isActive(`mediaEmbed`);case`toggleNode`:return e.isActive(t.nodeName);case`setParagraph`:return e.isActive(`paragraph`);case`setHeading`:return e.isActive(`heading`,{level:t.level});case`setTextAlign`:return e.isActive({textAlign:t.align});case`wrapInLayout`:return e.isActive(`layout`);default:return!1}}var _o=[`heading`,`bulletList`,`orderedList`,`blockquote`,`codeBlock`],vo=[`toggleNode`,`insertNode`,`toggleMark`,`setParagraph`,`setHeading`,`setLink`,`setTextAlign`,`clearFormatting`,`undo`,`redo`,`wrapInLayout`,`openAddBlock`,`tableOperation`];function yo(e){return Number.isInteger(e)&&e>=1&&e<=6}var bo=o`
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
`;function xo(e){return e.icon?n`${te(e.icon)}`:e.abbr?n`<span class="abbr">${e.abbr}</span>`:e.label}function So(){return n`<span class="chevron" aria-hidden="true">${te(Dt)}</span>`}function Co(e,t=``){return[`vizy-control`,!e.icon&&!e.abbr?`is-text`:``,t].filter(Boolean).join(` `)}var wo=200,To=0;function Eo(e,t){typeof e[t]==`function`&&e[t]()}function Do(e){let t=e.shadowRoot;if(!t)return()=>{};let n=document.createElement(`pk-tooltip`);n.setAttribute(`trigger`,`manual`),n.setAttribute(`placement`,`top`),t.append(n);let r=null,i=()=>{r!==null&&(window.clearTimeout(r),r=null)},a=e=>e instanceof Element?e.closest(`.vizy-control`):null,o=e=>{let t=a(e.target);if(!t)return;let o=t.getAttribute(`aria-label`)?.trim();o&&(i(),r=window.setTimeout(()=>{r=null,t.isConnected&&(t.id||=`vizy-tb-${++To}`,n.for=t.id,n.content=o,Eo(n,`show`))},wo))},s=e=>{a(e.target)&&(a(e.relatedTarget)||(i(),Eo(n,`hide`)))},c=()=>{i(),Eo(n,`hide`)};return t.addEventListener(`pointerover`,o),t.addEventListener(`pointerout`,s),t.addEventListener(`pointerdown`,c),()=>{i(),t.removeEventListener(`pointerover`,o),t.removeEventListener(`pointerout`,s),t.removeEventListener(`pointerdown`,c),Eo(n,`hide`),n.remove()}}var Oo=class extends t{#e=[];get controls(){return this.#e}set controls(e){this.#e=e}#t=null;get editor(){return this.#t}set editor(e){this.#t=e}#n=!1;get canAddBlock(){return this.#n}set canAddBlock(e){this.#n=e}#r=!0;get addBlockNeedsMenu(){return this.#r}set addBlockNeedsMenu(e){this.#r=e}#i=null;get addBlockDirectLabel(){return this.#i}set addBlockDirectLabel(e){this.#i=e}#a=!1;get addBlockOpen(){return this.#a}set addBlockOpen(e){this.#a=e}#o={};get linkAuthoring(){return this.#o}set linkAuthoring(e){this.#o=e}#s={};get imageAuthoring(){return this.#s}set imageAuthoring(e){this.#s=e}#c=[];get layoutPresets(){return this.#c}set layoutPresets(e){this.#c=e}#l=null;#u=null;#d=!1;#f=new Set;#p=!1;#m=!1;#h=!1;static styles=[bo,o`
            /* Outer field border lives on .vizy-editor-body (vizy.css). Host is the
               raised white strip + sticky pin; top radii fill the body's rounded frame. */
            :host {
                display: block;
                position: relative;
                border-radius: var(--vizy-radius, var(--pk-input-border-radius, 3px))
                    var(--vizy-radius, var(--pk-input-border-radius, 3px)) 0 0;
                background: var(--pk-color-white, #fff);
            }
            [role='toolbar'] {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: 4px;
                padding: 4px 6px;
            }
            pk-tooltip {
                position: absolute;
                inset: 0 auto auto 0;
                width: 0;
                height: 0;
                overflow: visible;
                pointer-events: none;
            }
            pk-dropdown-menu {
                display: inline-flex;
                align-self: center;
            }
            /* Formatting row previews — Vizy 3 weight/colour; compact sizes for the menu. */
            .preview-label[data-preview^='heading'] {
                font-weight: 400;
                color: #212529;
                line-height: 1.2;
                text-transform: none;
            }
            .preview-label[data-preview='heading1'] { font-size: 22px; letter-spacing: -0.02em; }
            .preview-label[data-preview='heading2'] { font-size: 20px; }
            .preview-label[data-preview='heading3'] { font-size: 18px; }
            .preview-label[data-preview='heading4'] { font-size: 16px; }
            .preview-label[data-preview='heading5'] { font-size: 14px; }
            .preview-label[data-preview='heading6'] { font-size: 13px; }
            .preview-label[data-preview='blockquote'] {
                font-style: italic;
                color: #596673;
                border-left: 3px solid #cdd8e4;
                padding-left: 8px;
            }
            .preview-label[data-preview='codeBlock'] {
                font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
                font-size: 13px;
            }
            .menu-icon {
                display: inline-flex;
                width: 1em;
                justify-content: center;
                color: inherit;
            }
            .menu-icon svg {
                width: 1em;
                height: 1em;
                fill: currentColor;
            }
            .toolbar-leading pk-icon,
            .vizy-control pk-icon {
                width: 1em;
                height: 1em;
                display: block;
                pointer-events: none;
            }
        `];connectedCallback(){super.connectedCallback(),document.addEventListener(`keydown`,this.#P),document.addEventListener(`pointerdown`,this.#j,!0)}firstUpdated(){this.#l=Do(this)}updated(e){e.has(`editor`)&&this.#T()}disconnectedCallback(){document.removeEventListener(`keydown`,this.#P),document.removeEventListener(`pointerdown`,this.#j,!0),this.#l?.(),this.#l=null,this.#u?.(),this.#u=null,this.#f.clear(),this.#p=!1,this.#N(),super.disconnectedCallback()}render(){let e=this.#_();return e.length?n`
            <div role="toolbar" aria-label="Formatting">
                ${e.map(e=>this.#y(e))}
            </div>
        `:null}#g(e,t){let n=t.currentTarget;n instanceof HTMLElement&&this.dispatchEvent(new CustomEvent(`vizy-toolbar-ui`,{detail:{action:e,invoker:n,hadEditorFocus:this.#m||Vt(this.editor)},bubbles:!0,composed:!0}))}#_(){let e=this.controls.filter(e=>this.#v(e)),t=[];for(let n of e){if(n.presentation===`separator`){if(!t.length||t[t.length-1]?.presentation===`separator`)continue;t.push(n);continue}t.push(n)}return t.at(-1)?.presentation===`separator`&&t.pop(),t}#v(e){return e.presentation===`separator`?!0:e.action?.command===`openAddBlock`?this.canAddBlock:e.kind===`group`?(e.items??[]).some(e=>this.#v(e)):ho(e)}#y(e){if(e.presentation===`separator`)return n`<span class="vizy-separator" role="separator"></span>`;if(e.kind===`group`){let t=(e.items??[]).filter(e=>this.#v(e));return t.length?this.#x(e,t):r}if(!this.#v(e))return r;if(e.action?.command===`setLink`)return this.#b(e);let t=e.action?.command===`openAddBlock`,i=t&&this.addBlockNeedsMenu,a=t&&this.addBlockDirectLabel?this.addBlockDirectLabel:e.label;return n`
            <button
                type="button"
                class=${Co(e,i?`has-menu`:``)}
                aria-label=${a}
                aria-pressed=${t?r:String(this.#D(e))}
                aria-expanded=${i?String(this.addBlockOpen):r}
                data-vizy-toolbar-add-block=${t?``:r}
                data-vizy-invoker-key=${t?`toolbar-plus`:r}
                @mousedown=${this.#O}
                @click=${t=>this.#k(e,t)}
                >${t?n`<pk-icon icon="plus" label=""></pk-icon>`:xo(e)}${i?So():r}</button>
        `}#b(e){let t=ya(this.linkAuthoring),i=this.#D(e),a=()=>this.#m||this.#h,o=async(e,t)=>{let n=e.currentTarget;await(n instanceof HTMLElement?n.closest(`pk-dropdown-menu`):null)?.whenClosed?.(),t()};return n`
            <pk-dropdown-menu
                size="sm"
                placement="bottom-start"
                @pk-open-change=${this.#A}
            >
                <button
                    type="button"
                    slot="trigger"
                    class=${Co(e,`has-menu`)}
                    aria-label=${e.label}
                    aria-pressed=${String(i)}
                    @mousedown=${this.#O}
                >${xo(e)}${So()}</button>
                ${t.map((e,t)=>n`
                    <pk-dropdown-item
                        value=${`craft-link:${t}`}
                        @click=${t=>{o(t,()=>{this.editor&&ba(this.editor,e,this.linkAuthoring,{focus:a()})})}}
                    >${e.optionTitle}</pk-dropdown-item>
                `)}
                ${t.length>0?n`<pk-dropdown-separator></pk-dropdown-separator>`:r}
                <pk-dropdown-item
                    value="insert-link"
                    @click=${e=>{o(e,()=>{this.editor&&_a(this.editor,{focus:a()})})}}
                >${i?`Edit Link`:`Insert Link`}</pk-dropdown-item>
                <pk-dropdown-item
                    value="unlink"
                    ?disabled=${!i}
                    @click=${()=>{!this.editor||!i||(va(this.editor,{focus:a()}),this.requestUpdate())}}
                >Unlink</pk-dropdown-item>
            </pk-dropdown-menu>
        `}#x(e,t){let i=this.#E(e),a=this.#S(e,t);return n`
            <pk-dropdown-menu
                size="sm"
                placement="bottom-start"
                @pk-open-change=${this.#A}
                @pk-select=${e=>{let t=e.detail?.value,n=a.find(e=>e.id===t);n&&this.#k(n)}}
            >
                <button
                    type="button"
                    slot="trigger"
                    class=${Co(e,`has-menu`)}
                    aria-label=${e.label}
                    @mousedown=${this.#O}
                >${xo(e)}${So()}</button>
                ${a.map(t=>n`
                    <pk-dropdown-item
                        value=${t.id}
                        type=${i?`radio`:`normal`}
                        radio-group=${i?e.id:r}
                        ?checked=${i&&this.#D(t)}
                        ?disabled=${this.#C(e,t)}
                    >
                        ${t.icon?n`<span slot="start" class="menu-icon">${xo(t)}</span>`:r}
                        <span class="preview-label" data-preview=${t.preview??r}>${t.label}</span>
                    </pk-dropdown-item>
                `)}
            </pk-dropdown-menu>
        `}#S(e,t){if(!this.#w(e))return t;let n=t.filter(e=>e.id===`table`),r=t.filter(e=>e.id!==`table`);return this.editor?.isActive(`table`)?r.length>0?r:t:n.length>0?n:r}#C(e,t){return!this.#w(e)||t.id===`table`?!1:!this.editor?.isActive(`table`)}#w(e){return e.id===`dropdown:table`||e.id.endsWith(`:table`)}#T(){this.#u?.(),this.#u=null;let e=this.editor;if(!e)return;let t=()=>{this.requestUpdate()};e.on(`selectionUpdate`,t),this.#u=()=>{e.off(`selectionUpdate`,t)}}#E(e){let t=e.id.toLowerCase();return t.includes(`formatting`)||t.includes(`alignment`)||t.includes(`align`)}#D(e){return this.editor?go(this.editor,e.action,e.id):!1}#O=e=>{this.#m=Vt(this.editor),zt(e)};#k(e,t){if(!e.action)return;if(e.action.command===`openAddBlock`){t?.currentTarget instanceof HTMLElement&&this.#g(`insert-block`,t);return}if(!this.editor)return;let n=this.#f.size>0?this.#h:this.#m,r=t?.currentTarget instanceof HTMLElement?t.currentTarget:null;uo(this.editor,e.action,{focus:n,imageAuthoring:this.imageAuthoring,layoutPresets:this.layoutPresets,invoker:r,controlId:e.id}),this.requestUpdate()}#A=e=>{let t=e.currentTarget;if(!(t instanceof HTMLElement))return;if(e.detail?.open){this.#f.add(t),this.#p=!1,this.#h=this.#m||Vt(this.editor),this.#h&&this.#M();return}if(!this.#f.delete(t)||this.#f.size>0)return;let n=!this.#p&&this.#h;this.#p=!1,this.#h=!1,this.#N(),n&&Ut(this.editor)};#j=e=>{if(this.#f.size===0)return;let t=e.composedPath();if([...this.#f].some(e=>t.includes(e))){t.some(e=>e instanceof HTMLElement&&e.getAttribute(`slot`)===`trigger`)&&(this.#p=!0);return}this.#p=!0};#M(){if(this.#d||!this.editor)return;let e=Pt(this.editor.view.dom);e&&(Ft(e,!0),this.#d=!0)}#N(){if(!this.#d||!this.editor){this.#d=!1;return}Ft(Pt(this.editor.view.dom),!1),this.#d=!1}#P=e=>{e.key===`Escape`&&(!this.shadowRoot?.querySelector(`pk-dropdown-menu[open], pk-dropdown-menu[aria-expanded="true"]`)||!this.#h||Ut(this.editor))}};P([c({attribute:!1})],Oo.prototype,`controls`,null),P([c({attribute:!1})],Oo.prototype,`editor`,null),P([c({type:Boolean,attribute:!1})],Oo.prototype,`canAddBlock`,null),P([c({type:Boolean,attribute:!1})],Oo.prototype,`addBlockNeedsMenu`,null),P([c({type:String,attribute:!1})],Oo.prototype,`addBlockDirectLabel`,null),P([c({type:Boolean,attribute:!1})],Oo.prototype,`addBlockOpen`,null),P([c({attribute:!1})],Oo.prototype,`linkAuthoring`,null),P([c({attribute:!1})],Oo.prototype,`imageAuthoring`,null),P([c({attribute:!1})],Oo.prototype,`layoutPresets`,null),Oo=P([N(`vizy-toolbar`)],Oo);var ko=10,Ao=8,jo=class extends t{#e=[];get controls(){return this.#e}set controls(e){this.#e=e}#t=null;get editor(){return this.#t}set editor(e){this.#t=e}#n=!1;get visible(){return this.#n}set visible(e){this.#n=e}#r=null;#i=null;#a={getClientRect:null,contextElement:void 0};static styles=[bo,o`
            :host {
                display: none;
            }
            :host([visible]) {
                display: block;
            }
            /*
             * Compact vs the field toolbar's 32×32 / 16px. Same panel tokens;
             * a floating selection strip should not match the standing toolbar.
             */
            .vizy-control {
                width: 26px;
                height: 28px;
                font-size: 14px;
            }
            .vizy-control.has-menu {
                min-width: 26px;
            }
            /*
             * Same zero-sized anchor as the main toolbar — see VizyToolbarElement.
             * Without it, pk-tooltip's inline-block host leaves a blank band in the panel.
             */
            pk-tooltip {
                position: absolute;
                inset: 0 auto auto 0;
                width: 0;
                height: 0;
                overflow: visible;
                pointer-events: none;
            }
            .panel {
                display: flex;
                align-items: center;
                gap: 2px;
                padding: 2px 4px;
                /* Fallback required: host is portaled under body, so field
                   --vizy-border from .vizy-editor-body does not inherit. */
                border: 1px solid var(--vizy-border, var(--pk-color-gray-200, #cdd8e4));
                border-radius: 6px;
                background: var(--pk-color-white, #fff);
                box-shadow: 0 4px 16px rgb(31 41 51 / 12%);
            }
        `];syncToSelection(e){if(!this.controls.length){this.hide();return}this.#a.getClientRect=e.getClientRect,this.#a.contextElement=e.contextElement,this.#o(),this.visible=!0,this.#i&&(this.#i.active=!0,this.#i.reposition())}hide(){this.visible=!1,this.#i&&(this.#i.active=!1)}firstUpdated(){this.#r=Do(this)}disconnectedCallback(){this.#r?.(),this.#r=null;let e=this.#i;this.#i=null,e?.isConnected&&(e.active=!1,e.remove()),super.disconnectedCallback()}render(){return!this.visible||!this.controls.length?null:n`
            <div
                class="panel"
                role="toolbar"
                aria-label="Selection formatting"
            >
                ${this.controls.map(e=>n`
                    <button
                        type="button"
                        class=${Co(e)}
                        aria-label=${e.label}
                        aria-pressed=${String(this.#c(e))}
                        @mousedown=${e=>e.preventDefault()}
                        @click=${()=>this.#l(e)}
                    >${xo(e)}</button>
                `)}
            </div>
        `}#o(){if(this.#i)return;let e=document.createElement(`pk-popup`);e.className=`vizy-bubble-popup`,e.placement=`top`,e.distance=Ao,e.flip=!0,e.flipPadding=this.#s(),e.shift=!0,e.shiftPadding=ko,e.anchorTracking=!0,e.positionMethod=`fixed`;let t=this.#a;e.anchor={getBoundingClientRect:()=>t.getClientRect?.()??new DOMRect,get contextElement(){return t.contextElement}},e.append(this),document.body.append(e),this.#i=e}#s(){let e=getComputedStyle(document.documentElement).getPropertyValue(`--header-height`).trim(),t=Number.parseFloat(e);return!Number.isFinite(t)||t<=0?ko:Math.max(ko,Math.round(t)+8)}#c(e){return this.editor?go(this.editor,e.action,e.id):!1}#l(e){!this.editor||!e.action||(uo(this.editor,e.action,{controlId:e.id}),this.requestUpdate())}};P([c({attribute:!1})],jo.prototype,`controls`,null),P([c({attribute:!1})],jo.prototype,`editor`,null),P([c({type:Boolean,reflect:!0})],jo.prototype,`visible`,null),jo=P([N(`vizy-bubble`)],jo);var Mo={selected:!1,editing:!1,expanded:!0,dragging:!1,dropTarget:`none`,menuOpen:!1,fieldLayout:`unmounted`},No=`Vizy.collapsedBlocks`;function Po(){let e=window.Craft?.systemUid;return`${typeof e==`string`&&e!==``?`Craft-${e}`:`Craft`}.${No}`}function Fo(){if(typeof localStorage>`u`)return[];try{let e=localStorage.getItem(Po());return e?e.split(`,`).map(e=>e.trim()).filter(Boolean):[]}catch{return[]}}function Io(e){if(!(typeof localStorage>`u`))try{localStorage.setItem(Po(),e.join(`,`))}catch{}}function Lo(e){return e?Fo().includes(e):!1}function Ro(e){if(!e)return;let t=Fo();t.includes(e)||(t.push(e),Io(t))}function zo(e){if(!e)return;let t=Fo(),n=t.filter(t=>t!==e);n.length!==t.length&&Io(n)}var Bo=class{#e=new Map;get(e){let t=this.#e.get(e);if(!t){let n=Lo(e);t={collapsed:n,editingFields:!1,activeTabUid:null,view:{...Mo,expanded:!n},summary:null},this.#e.set(e,t)}return t}update(e,t){let n=this.get(e);return t.view&&Object.assign(n.view,t.view),t.summary!==void 0&&(n.summary=t.summary),t.collapsed!==void 0&&(n.collapsed=t.collapsed,n.view.expanded=!t.collapsed),t.editingFields!==void 0&&(n.editingFields=t.editingFields,n.view.editing=t.editingFields),t.activeTabUid!==void 0&&(n.activeTabUid=t.activeTabUid),n}reconcile(e){for(let t of this.#e.keys())e.has(t)||this.#e.delete(t)}clear(){this.#e.clear()}},Vo=class{#e=new Map;ensure(e,t=``,n=null,r=null){let i=this.#e.get(e);if(i&&(i.blockTypeUid!==t||i.fieldLayoutUid!==n||i.fieldLayoutHash!==r)&&(this.dispose(e),i=void 0),!i){let a=document.createElement(`div`);a.dataset.vizyFieldHost=``,a.contentEditable=`false`,i={blockUid:e,blockTypeUid:t,fieldLayoutUid:n,fieldLayoutHash:r,status:`idle`,root:a,abortController:null,requestId:null,requestKey:null,response:null,errorMessage:null,capturedValues:new Map,pending:null,disposals:[],attachedViewCount:0,removed:!1},this.#e.set(e,i)}return i.removed=!1,i}acquire(e,t=``,n=null,r=null){let i=this.ensure(e,t,n,r);return i.attachedViewCount+=1,i}roots(e){let t=this.#e.get(e);return t?[t.root]:[]}releaseView(e){let t=this.#e.get(e);t&&(t.attachedViewCount=Math.max(0,t.attachedViewCount-1))}get(e){return this.#e.get(e)}reconcile(e){for(let[t,n]of this.#e)e.has(t)||(n.removed=!0,this.dispose(t))}dispose(e){let t=this.#e.get(e);if(t&&(this.#e.delete(e),t.status!==`disposed`)){t.status=`disposed`,t.abortController?.abort();for(let e of t.disposals.splice(0))e();t.root.remove()}}destroy(){for(let e of[...this.#e.keys()])this.dispose(e)}},Ho=`:scope > .flex-fields`;function Uo(e){let t=[...e.querySelectorAll(Ho)];return t.forEach((e,t)=>{e instanceof HTMLElement&&(e.dataset.vizyLayoutTabIndex=String(t))}),t.length}function Wo(e,t,n){for(let n of e.root.querySelectorAll(Ho)){if(!(n instanceof HTMLElement))continue;let e=Number(n.dataset.vizyLayoutTabIndex??`0`);n.classList.toggle(`hidden`,e!==t)}}var Go=new Set,Ko=new Set;function qo(e){return e.replace(/&/g,`&amp;`)}function Jo(){if(Go.size)return Go;for(let e of document.querySelectorAll(`link[href]`))Go.add(qo(e.href));return Go}function Yo(){if(Ko.size)return Ko;for(let e of document.querySelectorAll(`script[src]`))Ko.add(qo(e.src));return Ko}function Xo(e){let t=e.trim();if(!t)return[];let n=window.jQuery;if(typeof n?.parseHTML==`function`)return n.parseHTML(t,document,!0)??[];let r=document.createElement(`template`);return r.innerHTML=t,[...r.content.childNodes]}function Zo(e){let t=e.href;if(!t)return;let n=qo(t),r=Jo();r.has(n)||(r.add(n),document.head.appendChild(e))}function Qo(e,t){let n=e.getAttribute(`src`);if(n){let r=qo(e.src||n),i=Yo();if(i.has(r))return;i.add(r);let a=document.createElement(`script`);for(let t of Array.from(e.attributes))a.setAttribute(t.name,t.value);t.appendChild(a);return}let r=document.createElement(`script`);for(let t of Array.from(e.attributes))r.setAttribute(t.name,t.value);r.textContent=e.textContent,t.appendChild(r)}function $o(e,t=document.body){if(!e?.trim())return;let n=Xo(e);for(let e of n){if(!(e instanceof Element)){t.appendChild(e);continue}if(e.nodeName===`LINK`&&e.rel===`stylesheet`){Zo(e);continue}if(e.nodeName===`SCRIPT`){Qo(e,t);continue}if(e.nodeName===`STYLE`||e.nodeName===`LINK`){document.head.appendChild(e);continue}t.appendChild(e)}}var es=`dismissedTips`,ts=`data-vizy-tip-uid`;function ns(){let e=window.Craft;if(typeof e?.getLocalStorage==`function`){let t=e.getLocalStorage(es,[]);return Array.isArray(t)?t.filter(e=>typeof e==`string`):[]}try{let e=window.Craft?.systemUid??``,t=localStorage.getItem(`Craft-${e}.${es}`);if(!t)return[];let n=JSON.parse(t);return Array.isArray(n)?n.filter(e=>typeof e==`string`):[]}catch{return[]}}function rs(e){let t=window.Craft,n=ns();if(n.includes(e))return;let r=[...n,e];if(typeof t?.setLocalStorage==`function`){t.setLocalStorage(es,r);return}try{let e=window.Craft?.systemUid??``;localStorage.setItem(`Craft-${e}.${es}`,JSON.stringify(r))}catch{}}function is(e){let t=e.getAttribute(ts);if(t)return t;let n=e.getAttribute(`data-layout-element`);if(n&&n!==`true`&&n!==`1`)return n;for(let t of e.querySelectorAll(`script`)){let e=t.textContent?.match(/\.includes\('([^']+)'\)/);if(e?.[1])return e[1]}return null}function as(e){return!!e.querySelector(`.pane.dismissible`)}function os(e){let t=new Set(ns());for(let n of[...e.querySelectorAll(`[data-layout-element]`)]){if(!as(n))continue;let e=is(n);e&&n.setAttribute(ts,e);for(let e of[...n.querySelectorAll(`script`)])e.textContent?.includes(`dismissedTips`)&&e.remove();e&&t.has(e)&&n.remove()}}function ss(e){os(e);let t=t=>{let n=t.target;if(!(n instanceof Element))return;let r=n.closest(`.tip-dismiss-btn`);if(!r||!e.contains(r))return;t.preventDefault(),t.stopPropagation();let i=r.closest(`[data-layout-element]`);if(!i||!e.contains(i)||!as(i))return;let a=is(i);i.remove(),a&&rs(a)};return e.addEventListener(`click`,t),()=>e.removeEventListener(`click`,t)}var cs=class extends Error{code;authorMessage;constructor(e,t){let n=(t??``).trim()||ls(e);super(n),this.name=`FieldLayoutMountError`,this.code=e,this.authorMessage=n}};function ls(e){switch(e){case`unsupportedFieldCapability`:return`This Block includes a field type Vizy cannot render inside Blocks yet.`;case`fieldLayoutRenderFailed`:return`This Block’s fields failed to render.`;case`unknownBlockType`:return`This Block’s type is missing or no longer allowed on this field.`;case`staleLayout`:return`This Block’s field layout is missing. Re-save the Block Type.`;case`staleFieldLayoutResponse`:return`This Block’s fields went out of date while loading. Try Retry.`;case`fieldLayoutRejected`:case`missingBatchResult`:case`invalidBlock`:case`invalidDestination`:case`staleBlockHash`:return`This Block could not load its fields. Reload the page and try again.`;case`fieldHostDisconnected`:return`This Block’s fields could not initialize. Reload the page and try again.`;case`loaderDestroyed`:case`blockRemoved`:return`This Block was removed before its fields finished loading.`;default:return e.startsWith(`fieldLayoutRequest:`)?`This Block could not load its fields (HTTP ${e.slice(19)}).`:`This Block could not load its fields (${e}).`}}function us(e){if(e instanceof cs)return e.authorMessage;if(e instanceof Error){let t=e.message.trim();return t?/^[a-zA-Z][a-zA-Z0-9]+$/.test(t)||t.startsWith(`fieldLayoutRequest:`)?ls(t):t:ls(`fieldLayoutRejected`)}return String(e)}var ds=new Set,fs=new TextEncoder,ps=25;async function ms(e){let t=(e,t)=>{let n=fs.encode(e),r=fs.encode(t);for(let e=0;e<Math.min(n.length,r.length);e++)if(n[e]!==r[e])return n[e]-r[e];return n.length-r.length},n=e=>Array.isArray(e)?`[${e.map(n).join(`,`)}]`:e&&typeof e==`object`?`{${Object.entries(e).filter(([,e])=>e!==void 0).sort(([e],[n])=>t(e,n)).map(([e,t])=>`${JSON.stringify(e)}:${n(t)}`).join(`,`)}}`:JSON.stringify(e)??`null`,r=n(e),i=await crypto.subtle.digest(`SHA-256`,fs.encode(r));return[...new Uint8Array(i)].map(e=>e.toString(16).padStart(2,`0`)).join(``)}var hs=class{hosts;manifest;contextToken;findBlock;onMounted;constructor(e,t,n,r,i){this.hosts=e,this.manifest=t,this.contextToken=n,this.findBlock=r,this.onMounted=i}#e=[];#t=null;#n=new Set;#r=new Map;#i=new Set;#a=new Map;#o=!1;destroy(){this.#o=!0,this.#t!==null&&window.clearTimeout(this.#t),this.#t=null,this.#r.clear(),this.#a.clear();for(let e of this.#n)e.abort();this.#n.clear();for(let e of this.#e.splice(0))e.reject(Error(`loaderDestroyed`))}async prefetchNewBlock(e){await this.prefetchNewBlocks([e])}async prefetchNewBlocks(e){if(this.#o)throw Error(`loaderDestroyed`);let t=e.filter(e=>!!this.manifest.blockTypes[e.blockTypeUid]?.fieldLayoutUid);if(!t.length)return;let n=await Promise.all(t.map(async e=>({item:e,blockHash:await ms(e.block),requestId:crypto.randomUUID()})));for(let e=0;e<n.length;e+=ps){let t=n.slice(e,e+ps),r=new AbortController;this.#n.add(r);try{let e=await this.#d({editorContextToken:this.contextToken,items:t.map(({item:e,blockHash:t,requestId:n})=>({requestId:n,documentRevision:e.documentRevision,blockHash:t,block:e.block,destination:e.destination}))},r.signal),n=new Map(e.results.map(e=>[e.requestId,e]));for(let{item:e,requestId:r}of t){let t=n.get(r);if(!t||t.ok===!1)throw new cs((t&&t.ok===!1?t.error:null)??`fieldLayoutRejected`,t&&t.ok===!1?t.message:null);this.#a.set(e.blockUid,t)}}finally{this.#n.delete(r)}}}open(e){let t=this.hosts.get(e);if(!t||t.status===`disposed`)return Promise.reject(Error(`blockRemoved`));if(t.status===`mounted`)return Promise.resolve(t);if(t.status===`loading`&&t.pending){let n=this.findBlock(e);if(!n)return Promise.reject(Error(`blockRemoved`));let r=`${e}:${n.revision}`,i=this.#r.get(r);if(i?.record===t)return i.promise;if(t.requestKey?.startsWith(`${n.revision}:`))return t.pending}let n=this.#a.get(e);if(n){this.#a.delete(e);let r=this.#f(t,n);return t.pending=r.finally(()=>{t.pending===r&&(t.pending=null)}),t.pending}let r=this.findBlock(e);if(!r)return Promise.reject(Error(`blockRemoved`));let i=`${e}:${r.revision}`,a=this.#r.get(i);if(a?.record===t)return a.promise;t.status=`loading`,t.errorMessage=null;let o=this.#s(e).finally(()=>{this.#r.get(i)?.promise===o&&this.#r.delete(i)});return this.#r.set(i,{record:t,promise:o}),o}retry(e){let t=this.hosts.get(e);if(!t||t.status===`disposed`)return Promise.reject(Error(`blockRemoved`));if(t.status===`mounted`)return Promise.resolve(t);t.abortController?.abort(),t.abortController=null,t.pending=null,t.requestId=null,t.requestKey=null,t.errorMessage=null,t.status=`idle`;let n=this.findBlock(e);return n&&this.#r.delete(`${e}:${n.revision}`),this.open(e)}async#s(e){let t=this.hosts.get(e),n=this.findBlock(e);if(!t||!n||t.status===`disposed`)throw Error(`blockRemoved`);if(t.status===`mounted`)return t;let r=n.node.toJSON(),i=ms(r);this.#i.add(i);let a;try{a=await i}finally{this.#i.delete(i)}if(this.#o||this.hosts.get(e)!==t)throw Error(`blockRemoved`);let o=this.manifest.blockTypes[String(n.node.attrs.blockTypeUid)];if(!o?.fieldLayoutUid)return t;let s=`${n.revision}:${a}:${o.fieldLayoutUid}:${o.fieldLayoutHash??``}`;if(t.status===`loading`&&t.requestKey===s&&t.pending)return t.pending;t.abortController?.abort();let c=new AbortController,l=crypto.randomUUID();return t.status=`loading`,t.abortController=c,t.requestId=l,t.requestKey=s,t.pending=this.#c({blockUid:e,requestId:l,blockHash:a,record:t,payload:{requestId:l,documentRevision:n.revision,blockHash:a,block:r,destination:n.destination}}).then(n=>{let r=this.findBlock(e),i=this.manifest.blockTypes[String(r?.node.attrs.blockTypeUid)];if(t.status===`disposed`||t.requestId!==n.requestId||!r||n.blockUid!==e||n.blockTypeUid!==String(r.node.attrs.blockTypeUid)||n.documentRevision!==r.revision||n.blockHash!==a||n.fieldLayoutUid!==i?.fieldLayoutUid||n.fieldLayoutHash!==i?.fieldLayoutHash)throw Error(`staleFieldLayoutResponse`);return this.#f(t,n)}).catch(n=>{throw t.status!==`disposed`&&t.requestId===l&&!c.signal.aborted&&(t.status=`failed`,t.errorMessage=us(n),console.error(`[Vizy] FieldLayout failed for block ${e}`,n)),n}).finally(()=>{t.requestId===l&&(t.pending=null)}),t.pending}#c(e){return new Promise((t,n)=>{if(this.#o){n(Error(`loaderDestroyed`));return}this.#e.push({...e,resolve:t,reject:n}),this.#t===null&&(this.#t=window.setTimeout(async()=>{await Promise.allSettled([...this.#i]),this.#t=null,this.#o||this.#l()},0))})}#l(){let e=this.#e.splice(0);for(let t=0;t<e.length;t+=ps)this.#u(e.slice(t,t+ps))}async#u(e){let t=new AbortController;this.#n.add(t);try{let n=await this.#d({editorContextToken:this.contextToken,items:e.map(e=>e.payload)},t.signal),r=new Map(n.results.map(e=>[e.requestId,e]));for(let t of e){let e=r.get(t.requestId);e?e.ok===!1?t.reject(new cs(e.error??`fieldLayoutRejected`,e.message)):t.resolve(e):t.reject(new cs(`missingBatchResult`))}}catch(t){for(let n of e)n.reject(t)}finally{this.#n.delete(t)}}async#d(e,t){if(window.Craft?.sendActionRequest){let n=await window.Craft.sendActionRequest(`POST`,`vizy/field-layout/render-batch`,{data:e,headers:{"Content-Type":`application/json`},signal:t});if(t.aborted)throw new DOMException(`Aborted`,`AbortError`);return n.data}let n=await fetch(`/actions/vizy/field-layout/render-batch`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(e),signal:t});if(!n.ok)throw Error(`fieldLayoutRequest:${n.status}`);return n.json()}adoptInitial(e){let t=this.hosts.get(e.blockUid),n=this.findBlock(e.blockUid),r=n?this.manifest.blockTypes[String(n.node.attrs.blockTypeUid)]:void 0;return!t||!n||t.status===`disposed`||e.blockTypeUid!==String(n.node.attrs.blockTypeUid)||e.fieldLayoutUid!==r?.fieldLayoutUid||e.fieldLayoutHash!==r?.fieldLayoutHash?null:t.status===`mounted`?t:(t.abortController?.abort(),t.requestId=null,t.requestKey=null,this.#f(t,e),t)}adoptInitialFailure(e){let t=e.blockUid;if(!t)return null;let n=this.hosts.get(t),r=this.findBlock(t);return!n||!r||n.status===`disposed`||n.status===`mounted`?null:(n.abortController?.abort(),n.requestId=null,n.requestKey=null,n.status=`failed`,n.errorMessage=us(new cs(e.error,e.message)),n.root.innerHTML=``,console.error(`[Vizy] Initial FieldLayout failed for block ${t}`,e),this.#g(n),n)}#f(e,t){return e.root.isConnected?(this.#p(e,t),Promise.resolve(e)):(e.status=`loading`,e.errorMessage=null,new Promise(n=>{let r=r=>{if(e.status===`disposed`){n(e);return}r&&e.root.isConnected?this.#p(e,t):this.#m(e,new cs(`fieldHostDisconnected`,`Block fields could not initialize because the field host was not in the document.`)),n(e)};queueMicrotask(()=>{if(e.status===`disposed`){n(e);return}if(e.root.isConnected){r(!0);return}requestAnimationFrame(()=>r(e.root.isConnected))})}))}#p(e,t){try{if(e.root.innerHTML=t.html,Uo(e.root),!e.root.isConnected)throw new cs(`fieldHostDisconnected`,`Block fields could not initialize because the field host was not in the document.`);let n=`${t.fieldLayoutHash}:${t.headHtml}`;t.headHtml&&!ds.has(n)&&($o(t.headHtml,document.head),ds.add(n)),$o(t.bodyHtml,document.body),window.Craft?.initUiElements?.(e.root),e.response=t,e.errorMessage=null,e.status=`mounted`,this.#h(e,t),this.onMounted(e),e.disposals.push(ss(e.root))}catch(t){this.#m(e,t)}}#m(e,t){e.status=`failed`,e.response=null,e.errorMessage=us(t),e.root.innerHTML=``,console.error(`[Vizy] FieldLayout mount crashed for block ${e.blockUid}`,t),this.#g(e)}#h(e,t){let n=document.querySelector(`vizy-block[data-block-uid="${CSS.escape(e.blockUid)}"]`),r=t.tabLabels??[];n&&(n.layoutTabLabels=r,n.fieldLayoutError=null,n.fieldLayoutState=`mounted`),Wo(e,0)}#g(e){let t=document.querySelector(`vizy-block[data-block-uid="${CSS.escape(e.blockUid)}"]`);t&&(t.fieldLayoutState=`error`,t.fieldLayoutError=e.errorMessage,t.fieldLayoutRetrying=!1)}};function gs(e,t){let n=[];return e.descendants(e=>{e.type.name===`vizyBlock`&&t[String(e.attrs.blockTypeUid)]?.fieldLayoutUid&&n.push(String(e.attrs.blockUid))}),n}var _s=(e,t)=>{let n=()=>t();return e.addEventListener(`input`,n),e.addEventListener(`change`,n),()=>{e.removeEventListener(`input`,n),e.removeEventListener(`change`,n)}},vs=e=>{let t=e.querySelector(`input:not([type=hidden]), textarea, select`);if(!t)throw Error(`adapterControlMissing`);return t},ys={read:e=>vs(e).value,bind:_s},bs={read(e){let t=e.querySelector(`input[type=hidden]`);if(!t)throw Error(`adapterControlMissing`);return t.value===`1`},bind:_s},xs={read(e){let t=e.querySelector(`textarea`);if(!t)throw Error(`adapterControlMissing`);t.CodeMirror?.save?.();let n=t.value;if(n.trim()===``)return null;try{return JSON.parse(n)}catch(e){return{__ERROR__:e instanceof Error?e.message:`Invalid JSON`,__VALUE__:n}}},bind:_s},Ss={read(e){return[...e.querySelectorAll(`input[type=hidden][name]`)].filter(e=>!e.disabled&&e.value!==``&&Ts(e.name)).map(e=>e.value)},bind:_s},Cs={read(e){let t=(e.querySelector(`select[name*="[type]"], input[type="hidden"][name*="[type]"]`)?.value||``).trim()||`url`,n=(((e.querySelector(`[data-link-type="${CSS.escape(t)}"]`)??e.querySelector(`[data-link-type]:not(.hidden)`))?.querySelector(`input[name*="[value]"]`)??e.querySelector(`input[name*="[${CSS.escape(t)}][value]"]`))?.value||``).trim();if(!n)return null;let r={type:t,value:n};for(let t of[`label`,`urlSuffix`,`target`,`title`,`class`,`id`,`rel`,`ariaLabel`,`filename`]){let n=e.querySelector(`input[name*="[${t}]"], textarea[name*="[${t}]"]`);if(!n||n.disabled||!Ts(n.name)||(n.type===`checkbox`||n.type===`radio`)&&!n.checked)continue;let i=n.value.trim();i!==``&&i!==`0`&&(r[t]=i)}let i=e.querySelector(`input[name*="[download]"]`);return i&&!i.disabled&&(i.checked||i.value===`1`)&&(r.download=!0),r},bind:_s},ws={read:e=>Es(e),bind:_s};function Ts(e){return e!==``&&e!==`null`}function Es(e){let t=[];for(let n of e.querySelectorAll(`input[name], textarea[name], select[name]`))if(!n.disabled&&Ts(n.name)){if(n instanceof HTMLInputElement){let e=n.type;if(e===`button`||e===`submit`||e===`reset`||e===`image`||e===`file`||(e===`checkbox`||e===`radio`)&&!n.checked)continue}if(n instanceof HTMLSelectElement&&n.multiple){for(let e of n.selectedOptions)t.push({name:n.name,value:e.value});continue}t.push({name:n.name,value:n.value})}return t.length?As(Ds(t)):null}function Ds(e){let t={};for(let{name:n,value:r}of e){let e=Os(n);e.length&&ks(t,e,r)}return t}function Os(e){let t=[],n=/([^[\]]+)|\[([^\]]*)\]/g,r;for(;(r=n.exec(e))!==null;)t.push(r[1]??r[2]??``);return t}function ks(e,t,n){let r=e;for(let e=0;e<t.length;e++){let i=t[e],a=e===t.length-1,o=t[e+1],s=i===``||/^\d+$/.test(i);if(a){if(Array.isArray(r)){i===``?r.push(n):r[Number(i)]=n;return}if(!r||typeof r!=`object`)return;let e=r;e[i]=n;return}if(Array.isArray(r)){let e=i===``?r.length:Number(i);r[e]??(r[e]=o===``||o!==void 0&&/^\d+$/.test(o)?[]:{}),r=r[e];continue}if(!r||typeof r!=`object`)return;let c=r;c[i]??(c[i]=o===``||o!==void 0&&/^\d+$/.test(o)?[]:{}),(typeof c[i]!=`object`||c[i]===null)&&(c[i]=s?[]:{}),r=c[i]}}function As(e){let t=e;for(;t&&typeof t==`object`&&!Array.isArray(t);){let e=Object.keys(t);if(e.length!==1)break;t=t[e[0]]}return t??null}var js=new Map([[`craft.plainText`,ys],[`craft.lightswitch`,bs],[`craft.json`,xs],[`craft.link`,Cs],[`craft.entries`,Ss],[`craft.categories`,Ss],[`craft.tags`,Ss],[`craft.users`,Ss],[`craft.assets`,Ss],[`craft.generic`,ws],[`craft.matrix`,ws],[`vizy.hosted`,{read(e){let t=e.querySelector(`input[data-vizy-document]`),n={type:`doc`,attrs:{schemaVersion:2},content:[]},r=()=>{if(!t?.value)return n;try{return JSON.parse(t.value)}catch{throw Error(`hostedVizyDocumentInvalid`)}},i=e.querySelector(`vizy-editor`);if(!i?.editor||typeof i.flush!=`function`)return r();try{return JSON.parse(i.flush(`serialize`))}catch{return r()}},bind(e,t){let n=e.querySelector(`vizy-editor`);if(!n)return()=>{};let r=()=>t();return n.addEventListener(`input`,r),n.addEventListener(`change`,r),()=>{n.removeEventListener(`input`,r),n.removeEventListener(`change`,r)}}}]]);function Ms(e){let t=js.get(e)??js.get(`craft.generic`);if(!t)throw Error(`unsupportedFieldAdapter:${e}`);return t}var Ns=new Set([`blockUid`,`layoutUid`,`columnUid`,`linkUid`,`imageUid`,`tableUid`,`rowUid`,`cellUid`]);function Ps(e){if(!e||typeof e!=`object`||Array.isArray(e))return!1;let t=e;return t.type===`doc`&&!!t.attrs&&typeof t.attrs==`object`&&Array.isArray(t.content)}function Fs(e){return!!e&&typeof e==`object`&&!Array.isArray(e)&&`entries`in e&&typeof e.entries==`object`&&e.entries!==null&&!Array.isArray(e.entries)}function Is(e,t){let n=new Map,r={};for(let[i,a]of Object.entries(e.entries)){if(!a||typeof a!=`object`||Array.isArray(a))continue;let e=t();n.set(i,e),i.startsWith(`uid:`)&&n.set(i.slice(4),e);let o={...a,uid:e};delete o.id,delete o.ownerId,delete o.canonicalId,r[e]=o}let i=[];for(let r of Array.isArray(e.sortOrder)?e.sortOrder:[]){let e=String(r);i.push(n.get(e)??n.get(`uid:${e}`)??t())}return i.length||i.push(...Object.keys(r)),{entries:r,sortOrder:i}}function Ls(e,t=Rs,n={}){let r=new Map,i=e=>{let n=r.get(e);return n||(n=t(),r.set(e,n)),n},a=e=>{let r={...e.attrs??{}};for(let e of Ns)typeof r[e]==`string`&&r[e]!==``&&(r[e]=i(r[e]));if(e.type===`vizyBlock`){`matrixAnchorUid`in r&&(r.matrixAnchorUid=null);let e=r.fieldSlots;if(e&&typeof e==`object`&&!Array.isArray(e)){let i={};for(let[a,s]of Object.entries(e)){let e=n[String(r.blockTypeUid)]?.fieldSlotKinds?.[a];i[a]=e===`hosted`&&Ps(s)?o(s):e===`matrix`&&Fs(s)?Is(s,t):s}r.fieldSlots=i}}let s=Array.isArray(e.content)?e.content.map(e=>e&&typeof e==`object`?a(e):e):e.content;return{...e,...e.attrs||Object.keys(r).length?{attrs:r}:{},...s===void 0?{}:{content:s}}},o=e=>({...e,content:Array.isArray(e.content)?e.content.map(e=>e&&typeof e==`object`?a(e):e):e.content});if(e&&typeof e==`object`&&!Array.isArray(e)){let t=e;return t.type===`doc`?o(t):a(t)}return e}function Rs(){if(typeof crypto.randomUUID==`function`)return crypto.randomUUID();let e=crypto.getRandomValues(new Uint8Array(16));e[6]=e[6]&15|64,e[8]=e[8]&63|128;let t=[...e].map(e=>e.toString(16).padStart(2,`0`));return`${t.slice(0,4).join(``)}-${t.slice(4,6).join(``)}-${t.slice(6,8).join(``)}-${t.slice(8,10).join(``)}-${t.slice(10).join(``)}`}function zs(e,t,n){return Ls(e,t,n)}var Bs=new Set([`href`,`target`]),Vs=new Set([`src`,`width`,`height`]),Hs=new Set([`colwidth`]);function Us(e,t){let n={};for(let[r,i]of Object.entries(e))t.has(r)||(n[r]=i);return n}function Ws(e){return e&&e.map(e=>e.type!==`link`||!e.attrs?e:{...e,attrs:Us(e.attrs,Bs)})}function Gs(e,t){let n={...e};if(n.marks&&=Ws(n.marks),n.type===`image`){let e=Us(n.attrs??{},Vs),r=e.assetUid;if(typeof r!=`string`||!H(r))throw Error(`semanticImageMissingAssetUid at ${t}`);n.attrs=e}if(n.type===`table`){let e=n.attrs??{},r=e.columnWidths;if(r!=null){if(!Array.isArray(r))throw Error(`semanticTableInvalidColumnWidths at ${t}`);let i=r.map(e=>Number.parseInt(String(e),10));if(i.some(e=>!Number.isInteger(e)||e<1))throw Error(`semanticTableInvalidColumnWidths at ${t}`);if(Gi(i)!==1e3)throw Error(`semanticTableColumnWidthTotal at ${t}`);n.attrs={...e,columnWidths:i}}}return(n.type===`tableCell`||n.type===`tableHeader`)&&(n.attrs&&=Us(n.attrs,Hs)),n.content&&=n.content.map((e,n)=>Gs(e,`${t}.content[${n}]`)),n}function Ks(e){return Gs(structuredClone(e),`$`)}var qs=`application/x-vizy-opaque-slice+json`,Js=new Set([`unsupportedNode`,`unsupportedInlineNode`]),Ys=Object.freeze({maxDocumentBytes:256e3,maxRawBytes:64e3,maxNodes:2e3,maxDepth:32,maxObjectDepth:128,maxObjectWidth:1024,maxPlaceholders:256,maxPlacementAttempts:2048}),Xs=Object.freeze({...Ys,maxDocumentBytes:1/0,maxNodes:1/0,maxObjectWidth:1/0,maxObjectDepth:512}),G=class extends Error{code;path;constructor(e,t){super(`${e} at ${t}`),this.code=e,this.path=t}},Zs=e=>structuredClone(e),Qs=e=>new TextEncoder().encode(JSON.stringify(e)).length,$s=e=>typeof e==`object`&&!!e&&!Array.isArray(e);function ec(e,t,n,r=0){if(r>n.maxObjectDepth)throw new G(`objectDepthExceeded`,t);if(Array.isArray(e)){if(e.length>n.maxObjectWidth)throw new G(`objectWidthExceeded`,t);e.forEach((e,i)=>ec(e,`${t}[${i}]`,n,r+1))}else if($s(e)){if(Object.keys(e).length>n.maxObjectWidth)throw new G(`objectWidthExceeded`,t);Object.entries(e).forEach(([e,i])=>ec(i,`${t}.${e}`,n,r+1))}else if(e!==null&&![`string`,`number`,`boolean`].includes(typeof e))throw new G(`nonJsonValue`,t);else if(typeof e==`number`&&!Number.isFinite(e))throw new G(`nonJsonValue`,t)}function tc(e,t,n,r,i=0,a=!1){if(!$s(e)||typeof e.type!=`string`||!e.type)throw new G(`invalidNode`,t);if(!a&&Js.has(e.type))throw new G(`reservedCanonicalType`,t);if(++r.nodes>n.maxNodes)throw new G(`nodeCountExceeded`,t);if(i>n.maxDepth)throw new G(`nodeDepthExceeded`,t);if(`attrs`in e&&!$s(e.attrs))throw new G(`invalidNodeAttrs`,`${t}.attrs`);if(`marks`in e){if(!Array.isArray(e.marks))throw new G(`invalidMarks`,`${t}.marks`);e.marks.forEach((e,n)=>{let r=`${t}.marks[${n}]`;if(!$s(e)||typeof e.type!=`string`||!e.type)throw new G(`invalidMark`,r);if(`attrs`in e&&!$s(e.attrs))throw new G(`invalidMarkAttrs`,`${r}.attrs`)})}if(e.type===`text`&&(typeof e.text!=`string`||!e.text))throw new G(`missingText`,t);if(e.type!==`text`&&`text`in e)throw new G(`nonTextNodeText`,t);if(`content`in e){if(!Array.isArray(e.content))throw new G(`invalidContent`,`${t}.content`);e.content.forEach((e,o)=>tc(e,`${t}.content[${o}]`,n,r,i+1,a))}}function nc(e,t,n){if(Number.isFinite(t.maxDocumentBytes)&&Qs(e)>t.maxDocumentBytes)throw new G(`documentBytesExceeded`,`$`);if(ec(e,`$`,t),tc(e,`$`,t,{nodes:0},0,n),e.type!==`doc`)throw new G(`invalidDocumentRoot`,`$`)}var rc=(e,t)=>({opaque:!0,rawNode:Zs(e),reason:t}),ic=e=>`opaque`in e,ac=(e,t)=>({type:e,attrs:{transportVersion:1,reason:t.reason,originalType:t.rawNode.type,rawNode:Zs(t.rawNode)}}),oc=(e,t)=>{try{return e.nodeFromJSON(t).check(),!0}catch{return!1}};function sc(e,t,n,r){let i=n.flatMap((e,t)=>ic(e)?[t]:[]),a=[...n],o=0,s=c=>{if(++o>r.maxPlacementAttempts)throw new G(`placementAttemptsExceeded`,`$`);if(c===i.length)return oc(e,{...t,content:a});let l=i[c],u=n[l];for(let e of[`unsupportedInlineNode`,`unsupportedNode`])if(a[l]=ac(e,u),s(c+1))return!0;return!1};return s(0)?a:null}function cc(e,t,n,r={}){let i={...Xs,...r};nc(e,i,!1);let a=new Set(n.nodes),o=new Set(n.marks);if([...Js].some(e=>a.has(e)))throw new G(`reservedManifestType`,`$`);let s=0,c=e=>{if(!a.has(e.type))return rc(e,`unknownNode`);if(e.marks?.some(e=>!o.has(e.type)))return rc(e,`unknownMark`);if(!e.content)return Zs(e);let n=e.content.map(c),r=sc(t,e,n,i);if(!r)return rc(e,n.find(ic)?.reason??`unknownNode`);if(s+=n.filter(ic).length,s>i.maxPlaceholders)throw new G(`placeholderCountExceeded`,`$`);let{content:l,...u}=e;return{...Zs(u),content:r}},l=c(e);if(ic(l))throw new G(`noSafePlaceholderPlacement`,`$`);if(!oc(t,l))throw new G(`transportSchemaMismatch`,`$`);return l}function lc(e,t,n){if(Object.keys(e).sort().join(`,`)!==`attrs,type`||!$s(e.attrs))throw new G(`invalidPlaceholderShape`,t);let r=e.attrs;if(Object.keys(r).sort().join(`,`)!==`originalType,rawNode,reason,transportVersion`)throw new G(`invalidPlaceholderAttrs`,`${t}.attrs`);if(r.transportVersion!==1)throw new G(`unsupportedTransportVersion`,t);if(![`unknownNode`,`unknownMark`].includes(String(r.reason)))throw new G(`invalidPlaceholderReason`,t);if(!$s(r.rawNode)||r.originalType!==r.rawNode.type)throw new G(`placeholderTypeMismatch`,t);if(Qs(r.rawNode)>n.maxRawBytes)throw new G(`rawBytesExceeded`,t);return ec(r.rawNode,`${t}.attrs.rawNode`,n),tc(r.rawNode,`${t}.attrs.rawNode`,n,{nodes:0}),Zs(r.rawNode)}function uc(e,t={}){let n={...Xs,...t};nc(e,n,!0);let r=0,i=(e,t)=>{if(Js.has(e.type)){if(++r>n.maxPlaceholders)throw new G(`placeholderCountExceeded`,t);return lc(e,t,n)}let{content:a,...o}=e,s=Zs(o);return a&&(s.content=a.map((e,n)=>i(e,`${t}.content[${n}]`))),s},a=i(e,`$`);(!(`content`in a)||a.content===void 0)&&(a.content=[]),nc(a,n,!1);try{return dc(Ks(a))}catch(e){throw new G(e instanceof Error?e.message.split(` `)[0]:`semanticSanitizeFailed`,`$`)}}function dc(e){let t=e;if($s(t.attrs)){let e=Object.entries(t.attrs).filter(([,e])=>e!==null);e.length!==Object.keys(t.attrs).length&&(e.length===0?delete t.attrs:t.attrs=Object.fromEntries(e))}return t.marks?.forEach(e=>dc(e)),t.content?.forEach(e=>dc(e)),t}function fc(e,t={}){let n={...Ys,...t};if(!$s(e)||Object.keys(e).some(e=>![`content`,`openStart`,`openEnd`].includes(e))||!Array.isArray(e.content)||`openStart`in e&&!Number.isInteger(e.openStart)||`openEnd`in e&&!Number.isInteger(e.openEnd)||Number(e.openStart??0)<0||Number(e.openEnd??0)<0)throw new G(`invalidSliceShape`,`$clipboard`);if(Qs(e)>n.maxDocumentBytes)throw new G(`documentBytesExceeded`,`$clipboard`);let r={nodes:0},i=0;e.content.forEach((e,t)=>{ec(e,`$clipboard.content[${t}]`,n),tc(e,`$clipboard.content[${t}]`,n,r,0,!0)});let a=(e,t)=>{let r=e;if(Js.has(r.type)){if(++i>n.maxPlaceholders)throw new G(`placeholderCountExceeded`,t);lc(r,t,n);return}r.content?.forEach((e,n)=>a(e,`${t}.content[${n}]`))};return e.content.forEach((e,t)=>a(e,`$clipboard.content[${t}]`)),{...Zs(e),content:Zs(e.content),openStart:Number(e.openStart??0),openEnd:Number(e.openEnd??0)}}function pc(e,t){return D.create({name:e,inline:t,group:t?`inline`:`block`,atom:!0,selectable:!0,draggable:!t,addAttributes:()=>({transportVersion:{default:null,rendered:!1},reason:{default:null,rendered:!1},originalType:{default:null,rendered:!1},rawNode:{default:null,rendered:!1}}),parseHTML:()=>[],renderHTML:()=>[t?`span`:`div`,{class:t?`vizy-unsupported-inline`:`vizy-unsupported-block`,contenteditable:`false`,"aria-label":t?`Unsupported formatting`:`Unsupported content`},t?`Unsupported formatting`:`Unsupported content`]})}var mc=pc(`unsupportedNode`,!1),hc=pc(`unsupportedInlineNode`,!0),gc=S.create({name:`opaqueClipboard`,addOptions:()=>({schemaIdentity:{}}),addProseMirrorPlugins(){let e=this.options.schemaIdentity,t=this.options.beforeCopy,n=(e,n,r)=>{let i=n.clipboardData,a=JSON.stringify(e.state.selection.content().toJSON());if(!i||!a.includes(`"unsupported`)&&!a.includes(`"blockUid"`))return!1;try{t?.(),a=JSON.stringify(e.state.selection.content().toJSON()),r&&fc(JSON.parse(a))}catch(t){return n.preventDefault(),e.dom.dispatchEvent(new CustomEvent(`vizy-clipboard-rejected`,{bubbles:!0,detail:{code:t instanceof G?t.code:`fieldCaptureFailed`}})),!0}let o=a.includes(`"unsupported`)?`Unsupported content`:`Vizy content`;return i.setData(qs,a),i.setData(`text/plain`,o),i.setData(`text/html`,`<span class="vizy-private-clipboard">${o}</span>`),n.preventDefault(),r&&e.editable&&e.dispatch(e.state.tr.deleteSelection().setMeta(`uiEvent`,`cut`).scrollIntoView()),!0};return[new C({props:{handleDOMEvents:{copy:(e,t)=>n(e,t,!1),cut:(e,t)=>n(e,t,!0),paste(t,n){let r=n.clipboardData?.getData(qs);if(!r)return!1;n.preventDefault();try{let n=Ls(fc(JSON.parse(r)),void 0,e),i=j.fromJSON(t.state.schema,n);t.dispatch(t.state.tr.replaceSelection(i).scrollIntoView())}catch(e){t.dom.dispatchEvent(new CustomEvent(`vizy-clipboard-rejected`,{bubbles:!0,detail:{code:e instanceof G?e.code:`invalidPrivateSlice`}}))}return!0}}}})]}}),_c=new WeakSet,vc=new WeakSet;function yc(e){let t=e;return _c.add(t),t}function bc(e){return Array.isArray(e)&&_c.has(e)}function xc(e){return e.flatMap(e=>e==null?[]:Array.isArray(e)&&vc.has(e)&&!bc(e)?xc(e):[e])}function Sc(e,t){if(e===`slot`)return 0;if(e instanceof Function){let n=e(t);return Array.isArray(n)&&!bc(n)&&!vc.has(n)?yc(n):n}let{children:n,...r}=t??{};if(e===`svg`)throw Error(`SVG elements are not supported in the JSX syntax, use the array syntax instead`);if(Array.isArray(n)){if(bc(n))return yc([e,r,n]);if(n.length===0)return yc([e,r]);let t=xc(n);return t.length===0?yc([e,r]):yc([e,r,...t])}return yc(n==null?[e,r]:[e,r,n])}var Cc=(e,t)=>Sc(e,t),wc=(e,t)=>{let{state:n}=e,{selection:r}=n;if(!r.empty)return!1;let{$from:i}=r;if(i.parentOffset!==0)return!1;let a=i.depth-1;if(a<0)return!1;let o=i.node(a),s=i.index(a);if(s===0)return!1;if(o.type===t)return e.commands.lift(t.name);let c=o.child(s-1);if(c.type!==t||!c.lastChild?.isTextblock)return!1;let l=i.before()-1-1;return e.commands.command(({tr:e,dispatch:t})=>{if(!t)return!0;let n=i.parent.content,r=new j(n,0,0);return e.replace(l,i.after(),r),e.setSelection(E.create(e.doc,l+n.size)),e.scrollIntoView(),t(e),!0})},Tc=/^\s*>\s$/,Ec=D.create({name:`blockquote`,addOptions(){return{HTMLAttributes:{}}},content:`block+`,group:`block`,defining:!0,parseHTML(){return[{tag:`blockquote`}]},renderHTML({HTMLAttributes:e}){return Cc(`blockquote`,{...w(this.options.HTMLAttributes,e),children:Cc(`slot`,{})})},parseMarkdown:(e,t)=>{let n=t.parseBlockChildren??t.parseChildren;return t.createNode(`blockquote`,void 0,n(e.tokens||[]))},renderMarkdown:(e,t)=>{if(!e.content)return``;let n=[];return e.content.forEach((e,r)=>{let i=(t.renderChild?.call(t,e,r)??t.renderChildren([e])).split(`
`).map(e=>e.trim()===``?`>`:`> ${e}`);n.push(i.join(`
`))}),n.join(`
>
`)},addCommands(){return{setBlockquote:()=>({commands:e})=>e.wrapIn(this.name),toggleBlockquote:()=>({commands:e})=>e.toggleWrap(this.name),unsetBlockquote:()=>({commands:e})=>e.lift(this.name)}},addKeyboardShortcuts(){return{"Mod-Shift-b":()=>this.editor.commands.toggleBlockquote(),Backspace:()=>wc(this.editor,this.type)}},addInputRules(){return[st({find:Tc,type:this.type})]}}),Dc=/(?:^|\s)(\*\*(?!\s+\*\*)((?:[^*]+))\*\*(?!\s+\*\*))$/,Oc=/(?:^|\s)(\*\*(?!\s+\*\*)((?:[^*]+))\*\*(?!\s+\*\*))/g,kc=/(?:^|\s)(__(?!\s+__)((?:[^_]+))__(?!\s+__))$/,Ac=/(?:^|\s)(__(?!\s+__)((?:[^_]+))__(?!\s+__))/g,jc=Ee.create({name:`bold`,addOptions(){return{HTMLAttributes:{}}},parseHTML(){return[{tag:`strong`},{tag:`b`,getAttrs:e=>e.style.fontWeight!==`normal`&&null},{style:`font-weight=400`,clearMark:e=>e.type.name===this.name},{style:`font-weight`,getAttrs:e=>/^(bold(er)?|[5-9]\d{2,})$/.test(e)&&null}]},renderHTML({HTMLAttributes:e}){return Cc(`strong`,{...w(this.options.HTMLAttributes,e),children:Cc(`slot`,{})})},markdownTokenName:`strong`,parseMarkdown:(e,t)=>t.applyMark(`bold`,t.parseInline(e.tokens||[])),markdownOptions:{htmlReopen:{open:`<strong>`,close:`</strong>`}},renderMarkdown:(e,t)=>`**${t.renderChildren(e)}**`,addCommands(){return{setBold:()=>({commands:e})=>e.setMark(this.name),toggleBold:()=>({commands:e})=>e.toggleMark(this.name),unsetBold:()=>({commands:e})=>e.unsetMark(this.name)}},addKeyboardShortcuts(){return{"Mod-b":()=>this.editor.commands.toggleBold(),"Mod-B":()=>this.editor.commands.toggleBold()}},addInputRules(){return[Oe({find:Dc,type:this.type}),Oe({find:kc,type:this.type})]},addPasteRules(){return[de({find:Oc,type:this.type}),de({find:Ac,type:this.type})]}}),Mc=e=>{let t=/`([^`]+)`(?!`)$/.exec(e);return!t||t.index>0&&e[t.index-1]==="`"?null:{index:t.index,text:t[0],replaceWith:t[1]}},Nc=e=>{let t=/`([^`]+)`(?!`)/g,n=[],r;for(;(r=t.exec(e))!==null;)r.index>0&&e[r.index-1]==="`"||n.push({index:r.index,text:r[0],replaceWith:r[1]});return n},Pc=Ee.create({name:`code`,addOptions(){return{HTMLAttributes:{}}},excludes:`_`,code:!0,exitable:!0,parseHTML(){return[{tag:`code`}]},renderHTML({HTMLAttributes:e}){return[`code`,w(this.options.HTMLAttributes,e),0]},markdownTokenName:`codespan`,parseMarkdown:(e,t)=>t.applyMark(`code`,[{type:`text`,text:e.text||``}]),renderMarkdown:(e,t)=>e.content?`\`${t.renderChildren(e.content)}\``:``,addCommands(){return{setCode:()=>({commands:e})=>e.setMark(this.name),toggleCode:()=>({commands:e})=>e.toggleMark(this.name),unsetCode:()=>({commands:e})=>e.unsetMark(this.name)}},addKeyboardShortcuts(){return{"Mod-e":()=>this.editor.commands.toggleCode()}},addInputRules(){return[Oe({find:Mc,type:this.type})]},addPasteRules(){return[de({find:Nc,type:this.type})]}}),Fc=4,Ic=/^```([a-z]+)?[\s\n]$/,Lc=/^~~~([a-z]+)?[\s\n]$/,Rc=D.create({name:`codeBlock`,addOptions(){return{languageClassPrefix:`language-`,exitOnTripleEnter:!0,exitOnArrowDown:!0,exitOnArrowUp:!0,defaultLanguage:null,enableTabIndentation:!1,tabSize:Fc,HTMLAttributes:{}}},content:`text*`,marks:``,group:`block`,code:!0,defining:!0,addAttributes(){return{language:{default:this.options.defaultLanguage,parseHTML:e=>{let{languageClassPrefix:t}=this.options;return t&&[...e.firstElementChild?.classList||[]].filter(e=>e.startsWith(t)).map(e=>e.replace(t,``))[0]||null},rendered:!1}}},parseHTML(){return[{tag:`pre`,preserveWhitespace:`full`}]},renderHTML({node:e,HTMLAttributes:t}){return[`pre`,w(this.options.HTMLAttributes,t),[`code`,{class:e.attrs.language?this.options.languageClassPrefix+e.attrs.language:null},0]]},markdownTokenName:`code`,parseMarkdown:(e,t)=>e.raw?.startsWith("```")===!1&&e.raw?.startsWith(`~~~`)===!1&&e.codeBlockStyle!==`indented`?[]:t.createNode(`codeBlock`,{language:e.lang||null},e.text?[t.createTextNode(e.text)]:[]),renderMarkdown:(e,t)=>{let n=``,r=e.attrs?.language||``;return n=e.content?[`\`\`\`${r}`,t.renderChildren(e.content),"```"].join(`
`):`\`\`\`${r}\n\n\`\`\``,n},addCommands(){return{setCodeBlock:e=>({commands:t})=>t.setNode(this.name,e),toggleCodeBlock:e=>({commands:t})=>t.toggleNode(this.name,`paragraph`,e)}},addKeyboardShortcuts(){return{"Mod-Alt-c":()=>this.editor.commands.toggleCodeBlock(),Backspace:()=>{let{empty:e,$anchor:t}=this.editor.state.selection,n=t.pos===1;return!e||t.parent.type.name!==this.name?!1:n||!t.parent.textContent.length?this.editor.commands.clearNodes():!1},Tab:({editor:e})=>{if(!this.options.enableTabIndentation)return!1;let t=this.options.tabSize??Fc,{state:n}=e,{selection:r}=n,{$from:i,empty:a}=r;if(i.parent.type!==this.type)return!1;let o=` `.repeat(t);return a?e.commands.insertContent(o):e.commands.command(({tr:e})=>{let{from:t,to:i}=r,a=n.doc.textBetween(t,i,`
`,`
`).split(`
`).map(e=>o+e).join(`
`);return e.replaceWith(t,i,n.schema.text(a)),!0})},"Shift-Tab":({editor:e})=>{if(!this.options.enableTabIndentation)return!1;let t=this.options.tabSize??Fc,{state:n}=e,{selection:r}=n,{$from:i,empty:a}=r;return i.parent.type===this.type?a?e.commands.command(({tr:e})=>{let{pos:r}=i,a=i.start(),o=i.end(),s=n.doc.textBetween(a,o,`
`,`
`).split(`
`),c=0,l=0,u=r-a;for(let e=0;e<s.length;e+=1){if(l+s[e].length>=u){c=e;break}l+=s[e].length+1}let d=s[c].match(/^ */)?.[0]||``,f=Math.min(d.length,t);if(f===0)return!0;let p=a;for(let e=0;e<c;e+=1)p+=s[e].length+1;return e.delete(p,p+f),r-p<=f&&e.setSelection(E.create(e.doc,p)),!0}):e.commands.command(({tr:e})=>{let{from:i,to:a}=r,o=n.doc.textBetween(i,a,`
`,`
`).split(`
`).map(e=>{let n=e.match(/^ */)?.[0]||``,r=Math.min(n.length,t);return e.slice(r)}).join(`
`);return e.replaceWith(i,a,n.schema.text(o)),!0}):!1},Enter:({editor:e})=>{if(!this.options.exitOnTripleEnter)return!1;let{state:t}=e,{selection:n}=t,{$from:r,empty:i}=n;if(!i||r.parent.type!==this.type)return!1;let a=r.parentOffset===r.parent.nodeSize-2,o=r.parent.textContent.endsWith(`

`);return!a||!o?!1:e.chain().command(({tr:e})=>(e.delete(r.pos-2,r.pos),!0)).exitCode().run()},ArrowUp:({editor:e})=>{if(!this.options.exitOnArrowUp)return!1;let{state:t}=e,{selection:n}=t,{$from:r,empty:i}=n;if(!i||r.parent.type!==this.type||r.parentOffset!==0)return!1;let a=r.before();return a>0?!1:e.commands.insertDefaultBlock({pos:a})},ArrowDown:({editor:e})=>{if(!this.options.exitOnArrowDown)return!1;let{state:t}=e,{selection:n,doc:r}=t,{$from:i,empty:a}=n;if(!a||i.parent.type!==this.type||i.parentOffset!==i.parent.nodeSize-2)return!1;let o=i.after();return o===void 0?!1:r.nodeAt(o)?e.commands.command(({tr:e})=>(e.setSelection(k.near(r.resolve(o))),!0)):e.commands.exitCode()}}},addInputRules(){return[He({find:Ic,type:this.type,getAttributes:e=>({language:e[1]})}),He({find:Lc,type:this.type,getAttributes:e=>({language:e[1]})})]},addProseMirrorPlugins(){return[new C({key:new T(`codeBlockVSCodeHandler`),props:{handlePaste:(e,t)=>{if(!t.clipboardData||this.editor.isActive(this.type.name))return!1;let n=t.clipboardData.getData(`text/plain`),r=t.clipboardData.getData(`vscode-editor-data`),i=(r?JSON.parse(r):void 0)?.mode;if(!n||!i)return!1;let{tr:a,schema:o}=e.state,s=o.text(n.replace(/\r\n?/g,`
`));return a.replaceSelectionWith(this.type.create({language:i},s)),a.selection.$from.parent.type!==this.type&&a.setSelection(E.near(a.doc.resolve(Math.max(0,a.selection.from-2)))),a.setMeta(`paste`,!0),e.dispatch(a),!0}}})]}}),zc=D.create({name:`hardBreak`,markdownTokenName:`br`,addOptions(){return{keepMarks:!0,HTMLAttributes:{}}},inline:!0,group:`inline`,selectable:!1,linebreakReplacement:!0,parseHTML(){return[{tag:`br`}]},renderHTML({HTMLAttributes:e}){return[`br`,w(this.options.HTMLAttributes,e)]},renderText(){return`
`},renderMarkdown:()=>`  
`,parseMarkdown:()=>({type:`hardBreak`}),addCommands(){return{setHardBreak:()=>({commands:e,chain:t,state:n,editor:r})=>e.first([()=>e.exitCode(),()=>e.command(()=>{let{selection:e,storedMarks:i}=n;if(e.$from.parent.type.spec.isolating)return!1;let{keepMarks:a}=this.options,{splittableMarks:o}=r.extensionManager,s=i||e.$to.parentOffset&&e.$from.marks();return t().insertContent({type:this.name}).command(({tr:e,dispatch:t})=>{if(t&&s&&a){let t=s.filter(e=>o.includes(e.type.name));e.ensureMarks(t)}return!0}).scrollIntoView().run()})])}},addKeyboardShortcuts(){return{"Mod-Enter":()=>this.editor.commands.setHardBreak(),"Shift-Enter":()=>this.editor.commands.setHardBreak()}}}),Bc=D.create({name:`heading`,addOptions(){return{levels:[1,2,3,4,5,6],HTMLAttributes:{}}},content:`inline*`,group:`block`,defining:!0,addAttributes(){return{level:{default:1,rendered:!1}}},parseHTML(){return this.options.levels.map(e=>({tag:`h${e}`,attrs:{level:e}}))},renderHTML({node:e,HTMLAttributes:t}){return[`h${this.options.levels.includes(e.attrs.level)?e.attrs.level:this.options.levels[0]}`,w(this.options.HTMLAttributes,t),0]},parseMarkdown:(e,t)=>t.createNode(`heading`,{level:e.depth||1},t.parseInline(e.tokens||[])),renderMarkdown:(e,t)=>{let n=e.attrs?.level?parseInt(e.attrs.level,10):1,r=`#`.repeat(n);return e.content?`${r} ${t.renderChildren(e.content)}`:``},addCommands(){return{setHeading:e=>({commands:t})=>this.options.levels.includes(e.level)?t.setNode(this.name,e):!1,toggleHeading:e=>({commands:t})=>this.options.levels.includes(e.level)?t.toggleNode(this.name,`paragraph`,e):!1}},addKeyboardShortcuts(){return this.options.levels.reduce((e,t)=>({...e,[`Mod-Alt-${t}`]:()=>this.editor.commands.toggleHeading({level:t})}),{})},addInputRules(){return this.options.levels.map(e=>He({find:RegExp(`^(#{${Math.min(...this.options.levels)},${e}})\\s$`),type:this.type,getAttributes:{level:e}}))}}),Vc=D.create({name:`horizontalRule`,addOptions(){return{HTMLAttributes:{},nextNodeType:`paragraph`}},group:`block`,parseHTML(){return[{tag:`hr`}]},renderHTML({HTMLAttributes:e}){return[`hr`,w(this.options.HTMLAttributes,e)]},markdownTokenName:`hr`,parseMarkdown:(e,t)=>t.createNode(`horizontalRule`),renderMarkdown:()=>`---`,addCommands(){return{setHorizontalRule:()=>({chain:e,state:t})=>{if(!we(t,t.schema.nodes[this.name]))return!1;let{selection:n}=t,{$to:r}=n,i=e();return Re(n)?i.insertContentAt(r.pos,{type:this.name}):i.insertContent({type:this.name}),i.command(({state:e,tr:t,dispatch:n})=>{if(n){let{$to:n}=t.selection,r=n.end();if(n.nodeAfter)n.nodeAfter.isTextblock?t.setSelection(E.create(t.doc,n.pos+1)):n.nodeAfter.isBlock?t.setSelection(A.create(t.doc,n.pos)):t.setSelection(E.create(t.doc,n.pos));else{let i=(e.schema.nodes[this.options.nextNodeType]||n.parent.type.contentMatch.defaultType)?.create();i&&(t.insert(r,i),t.setSelection(E.create(t.doc,r+1)))}t.scrollIntoView()}return!0}).run()}}},addInputRules(){return[ht({find:/^(?:---|—-|___\s|\*\*\*\s)$/,type:this.type})]}}),Hc=/(?:^|\s)(\*(?!\s+\*)((?:[^*]+))\*(?!\s+\*))$/,Uc=/(?:^|\s)(\*(?!\s+\*)((?:[^*]+))\*(?!\s+\*))/g,Wc=/(?:^|\s)(_(?!\s+_)((?:[^_]+))_(?!\s+_))$/,Gc=/(?:^|\s)(_(?!\s+_)((?:[^_]+))_(?!\s+_))/g,Kc=Ee.create({name:`italic`,addOptions(){return{HTMLAttributes:{}}},parseHTML(){return[{tag:`em`},{tag:`i`,getAttrs:e=>e.style.fontStyle!==`normal`&&null},{style:`font-style=normal`,clearMark:e=>e.type.name===this.name},{style:`font-style=italic`}]},renderHTML({HTMLAttributes:e}){return[`em`,w(this.options.HTMLAttributes,e),0]},addCommands(){return{setItalic:()=>({commands:e})=>e.setMark(this.name),toggleItalic:()=>({commands:e})=>e.toggleMark(this.name),unsetItalic:()=>({commands:e})=>e.unsetMark(this.name)}},markdownTokenName:`em`,parseMarkdown:(e,t)=>t.applyMark(`italic`,t.parseInline(e.tokens||[])),markdownOptions:{htmlReopen:{open:`<em>`,close:`</em>`}},renderMarkdown:(e,t)=>`*${t.renderChildren(e)}*`,addKeyboardShortcuts(){return{"Mod-i":()=>this.editor.commands.toggleItalic(),"Mod-I":()=>this.editor.commands.toggleItalic()}},addInputRules(){return[Oe({find:Hc,type:this.type}),Oe({find:Wc,type:this.type})]},addPasteRules(){return[de({find:Uc,type:this.type}),de({find:Gc,type:this.type})]}}),qc=`listItem`,Jc=`textStyle`,Yc=/^\s*([-+*])\s$/,Xc=D.create({name:`bulletList`,addOptions(){return{itemTypeName:`listItem`,HTMLAttributes:{},keepMarks:!1,keepAttributes:!1}},group:`block list`,content(){return`${this.options.itemTypeName}+`},parseHTML(){return[{tag:`ul`}]},renderHTML({HTMLAttributes:e}){return[`ul`,w(this.options.HTMLAttributes,e),0]},markdownTokenName:`list`,parseMarkdown:(e,t)=>e.type!==`list`||e.ordered?[]:{type:`bulletList`,content:e.items?t.parseChildren(e.items):[]},renderMarkdown:(e,t)=>e.content?t.renderChildren(e.content,`
`):``,markdownOptions:{indentsContent:!0},addCommands(){return{toggleBulletList:()=>({commands:e,chain:t})=>this.options.keepAttributes?t().toggleList(this.name,this.options.itemTypeName,this.options.keepMarks).updateAttributes(qc,this.editor.getAttributes(Jc)).run():e.toggleList(this.name,this.options.itemTypeName,this.options.keepMarks)}},addKeyboardShortcuts(){return{"Mod-Shift-8":()=>this.editor.commands.toggleBulletList()}},addInputRules(){let e=st({find:Yc,type:this.type});return(this.options.keepMarks||this.options.keepAttributes)&&(e=st({find:Yc,type:this.type,keepMarks:this.options.keepMarks,keepAttributes:this.options.keepAttributes,getAttributes:()=>this.editor.getAttributes(Jc),editor:this.editor})),[e]}}),Zc=(e,t,n)=>{let{selection:r}=e;if(!r.empty)return null;let{$from:i}=r;if(!i.parent.isTextblock||i.parentOffset!==i.parent.content.size)return null;let a=-1;for(let e=i.depth;e>0;--e)if(i.node(e).type.name===t){a=e;break}if(a<0)return null;let o=i.node(a),s=i.index(a);if(s+1>=o.childCount)return null;let c=o.child(s+1);if(!n.includes(c.type.name))return null;let l=e.schema.nodes[t],u=!1;if(c.forEach(e=>{e.type===l&&e.childCount>1&&(u=!0)}),!u)return null;let d=e.doc.resolve(i.after()).nodeAfter;if(!d||!n.includes(d.type.name))return null;let f=[];return d.forEach(e=>{f.push(e)}),f.length===0?null:{listItemDepth:a,nestedList:d,nestedListPos:i.after(),insertPos:i.after(a),items:f}},Qc=(e,t,n,r)=>{let i=Zc(e,n,r);if(!i)return!1;let{selection:a}=e,{nestedList:o,nestedListPos:s,insertPos:c,items:l}=i,u=e.tr;u.delete(s,s+o.nodeSize);let d=u.mapping.map(c);return u.insert(d,M.from(l)),u.setSelection(a.map(u.doc,u.mapping)),t&&t(u),!0},$c=(e,t,n)=>Qc(e.state,e.view.dispatch,t,n),el=(e,t)=>S.create({name:`${e}BranchingDeleteKeymap`,priority:101,addKeyboardShortcuts(){let n=()=>$c(this.editor,e,t);return{Delete:n,"Mod-Delete":n}}}),tl=[[1e3,`m`],[900,`cm`],[500,`d`],[400,`cd`],[100,`c`],[90,`xc`],[50,`l`],[40,`xl`],[10,`x`],[9,`ix`],[5,`v`],[4,`iv`],[1,`i`]],nl=`abcdefghijklmnopqrstuvwxyz`,rl=String.raw`\d+|[ivxlcdmIVXLCDM]+|${`[a-zA-Z]{1,2}`}`;function il(e){let t=e,n=``;for(let[e,r]of tl)for(;t>=e;)n+=r,t-=e;return n}function al(e){return il(e).toUpperCase()}function ol(e){let t=e.toLowerCase(),n=0,r=0;for(;n<t.length;){let e=!1;for(let[i,a]of tl)if(t.startsWith(a,n)){r+=i,n+=a.length,e=!0;break}if(!e)return 0}return r}function sl(e){if(!/^[ivxlcdmIVXLCDM]+$/.test(e))return!1;let t=ol(e);return t<=0?!1:(e===e.toLowerCase()?il(t):al(t))===e}function cl(e){let t=e.toLowerCase();if(t.length===1)return t.charCodeAt(0)-97+1;if(t.length===2){let e=t.charCodeAt(0)-97,n=t.charCodeAt(1)-97;return(e+1)*26+n+1}return 0}function ll(e){if(e<=26)return nl[e-1];let t=Math.floor((e-1)/26)-1,n=(e-1)%26;return t<0?nl[n]:nl[t]+nl[n]}function ul(e){if(!(!e||/^\d+$/.test(e))){if(sl(e))return e===e.toLowerCase()?`i`:`I`;if(/^[a-z]{1,2}$/.test(e))return`a`;if(/^[A-Z]{1,2}$/.test(e))return`A`}}function dl(e){if(/^\d+$/.test(e))return parseInt(e,10);let t=ul(e);if(t===`i`||t===`I`)return ol(e);if(t===`a`||t===`A`){let t=cl(e);return t>0?t:1}let n=parseInt(e,10);return Number.isNaN(n)?1:n}function fl(e,t){if(e===`numeric`)return String(t);switch(e){case`a`:return ll(t);case`A`:return ll(t).toUpperCase();case`i`:return il(t);case`I`:return al(t);default:return String(t)}}function pl(e){if(e.length===0)return!1;let t=ul(e[0])??`numeric`,n=dl(e[0]);if(n<1)return!1;for(let r=0;r<e.length;r++){let i=fl(t,n+r);if(e[r]!==i)return!1}return!0}function ml(e){return{type:ul(e),start:dl(e)}}function hl(e){let{type:t,start:n}=ml(e),r={};return t&&(r.type=t),n!==1&&(r.start=n),r}function gl(e,t,n=`. `){let r=t+1;if(!e||e===`1`)return`${r}${n}`;switch(e){case`a`:return`${ll(r)}${n}`;case`A`:return`${ll(r).toUpperCase()}${n}`;case`i`:return`${il(r)}${n}`;case`I`:return`${al(r)}${n}`;default:return`${r}${n}`}}function _l(e){let t=e.tokens?.[0];return!!(e.text&&e.tokens?.length===1&&t?.type===`list`&&t.ordered&&t.raw===e.text)}function vl(e,t){return t.tokenizeInline?t.parseInline(t.tokenizeInline(e)):t.parseInline([{type:`text`,raw:e,text:e}])}var yl=D.create({name:`listItem`,addOptions(){return{HTMLAttributes:{},bulletListTypeName:`bulletList`,orderedListTypeName:`orderedList`}},content:`paragraph block*`,defining:!0,parseHTML(){return[{tag:`li`}]},renderHTML({HTMLAttributes:e}){return[`li`,w(this.options.HTMLAttributes,e),0]},markdownTokenName:`list_item`,parseMarkdown:(e,t)=>{if(e.type!==`list_item`)return[];let n=t.parseBlockChildren??t.parseChildren,r=[];if(e.tokens&&e.tokens.length>0){if(_l(e))return{type:`listItem`,content:[{type:`paragraph`,content:vl(e.text||``,t)}]};if(e.tokens.some(e=>e.type===`paragraph`))r=n(e.tokens);else{let i=e.tokens[0];if(i&&i.type===`text`&&i.tokens&&i.tokens.length>0){if(r=[{type:`paragraph`,content:t.parseInline(i.tokens)}],e.tokens.length>1){let t=n(e.tokens.slice(1));r.push(...t)}}else r=n(e.tokens)}}return r.length===0&&(r=[{type:`paragraph`,content:[]}]),{type:`listItem`,content:r}},renderMarkdown:(e,t,n)=>$e(e,t,e=>{if(e.parentType===`bulletList`)return`- `;if(e.parentType===`orderedList`){var t,n;let r=((t=e.meta)==null||(t=t.parentAttrs)==null?void 0:t.start)||1;return gl((n=e.meta)==null||(n=n.parentAttrs)==null?void 0:n.type,r-1+(e.index||0),`. `)}return`- `},n),addExtensions(){return[el(this.name,[this.options.bulletListTypeName,this.options.orderedListTypeName])]},addKeyboardShortcuts(){return{Enter:()=>this.editor.commands.splitListItem(this.name),Tab:()=>this.editor.commands.sinkListItem(this.name),"Shift-Tab":()=>this.editor.commands.liftListItem(this.name)}}}),bl=(e,t)=>{let{$from:n}=t.selection,r=Ne(e,t.schema),i=null,a=n.depth,o=n.pos,s=null;for(;a>0&&s===null;)i=n.node(a),i.type===r?s=a:(--a,--o);return s===null?null:{$pos:t.doc.resolve(o),depth:s}},xl=(e,t)=>{let n=bl(e,t);if(!n)return!1;let[,r]=ye(t,e,n.$pos.pos+4);return r},Sl=(e,t,n)=>{let{$anchor:r}=e.selection,i=Math.max(0,r.pos-2),a=e.doc.resolve(i).node();return!(!a||!n.includes(a.type.name))},Cl=(e,t,n)=>{if(e.commands.undoInputRule())return!0;if(e.state.selection.from!==e.state.selection.to)return!1;if(!Le(e.state,t)&&Sl(e.state,t,n)){let{$anchor:n}=e.state.selection,r=e.state.doc.resolve(n.before()-1),i=[];r.node().descendants((e,n)=>{e.type.name===t&&i.push({node:e,pos:n})});let a=i.at(-1);if(!a)return!1;let o=e.state.doc.resolve(r.start()+a.pos+1);return e.chain().cut({from:n.start()-1,to:n.end()+1},o.end()).joinForward().run()}if(!Le(e.state,t)||!xe(e.state))return!1;let{$from:r}=e.state.selection,i=r.depth-1;return r.node(i).type!==e.schema.nodes[t]||r.index(i)!==0?!1:e.chain().liftListItem(t).run()},wl=(e,t)=>{let n=xl(e,t),r=bl(e,t);return!r||!n?!1:n>r.depth},Tl=(e,t)=>{let n=xl(e,t),r=bl(e,t);return!r||!n?!1:n<r.depth},El=(e,t)=>{if(!Le(e.state,t)||!lt(e.state,t))return!1;let{selection:n}=e.state,{$from:r,$to:i}=n;return!n.empty&&r.sameParent(i)?!1:wl(t,e.state)?e.chain().focus(e.state.selection.from+4).lift(t).joinBackward().run():Tl(t,e.state)?e.chain().joinForward().joinBackward().run():e.commands.joinItemForward()},Dl=(e,t,n)=>{let{state:r}=e,{selection:i}=r;if(!i.empty)return!1;let{$from:a}=i;if(a.parentOffset!==0||!a.parent.isTextblock||Le(r,t))return!1;let o=Fe(a);if(!o||!n.includes(o.type.name))return!1;let s=o.lastChild;if(!s||s.type.name!==t)return!1;let c=a.parent;if(!s.canReplace(s.childCount,s.childCount,M.from(c)))return!1;let l=a.before(),u=a.after(),d=l-2;return e.commands.command(({tr:e,dispatch:t})=>(t&&(e.delete(l,u).insert(d,M.from(c)),e.setSelection(E.create(e.doc,d+1)),e.scrollIntoView()),!0))},Ol=S.create({name:`listKeymap`,addOptions(){return{listTypes:[{itemName:`listItem`,wrapperNames:[`bulletList`,`orderedList`]},{itemName:`taskItem`,wrapperNames:[`taskList`]}]}},addKeyboardShortcuts(){return{Delete:({editor:e})=>{let t=!1;return this.options.listTypes.forEach(({itemName:n})=>{e.state.schema.nodes[n]!==void 0&&El(e,n)&&(t=!0)}),t},"Mod-Delete":({editor:e})=>{let t=!1;return this.options.listTypes.forEach(({itemName:n})=>{e.state.schema.nodes[n]!==void 0&&El(e,n)&&(t=!0)}),t},Backspace:({editor:e})=>{let t=!1;return this.options.listTypes.forEach(({itemName:n,wrapperNames:r})=>{e.state.schema.nodes[n]!==void 0&&Cl(e,n,r)&&(t=!0)}),t},"Mod-Backspace":({editor:e})=>{let t=!1;return this.options.listTypes.forEach(({itemName:n,wrapperNames:r})=>{e.state.schema.nodes[n]!==void 0&&Cl(e,n,r)&&(t=!0)}),t},Tab:({editor:e})=>{for(let{itemName:t,wrapperNames:n}of this.options.listTypes)if(e.state.schema.nodes[t]!==void 0&&Dl(e,t,n))return!0;return!1}}}}),kl=RegExp(`^(\\s*)(${rl})([.)])\\s+(.*)$`),Al=/^\s/,jl={heading:/^#{1,6}(?:\s|$)/,bulletItem:/^[-+*]\s+/,codeFence:/^(?:```|~~~)/,blockMath:/^\$\$/,thematicBreak:/^(?:(?:-[ \t]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})$/};function Ml(e){return kl.test(e.trimStart())}function Nl(e){let t=e.trimStart();return jl.bulletItem.test(t)||Ml(t)||jl.heading.test(t)||jl.thematicBreak.test(t)&&!t.startsWith(`-`)||/^>\s?/.test(t)||jl.codeFence.test(t)||jl.blockMath.test(t)}function Pl(e){return Object.values(jl).some(t=>t.test(e))}function Fl(e){let t=[],n=[],r=!1;return e.forEach(e=>{if(r){n.push(e);return}if(e.trim()===``){r=!0,n.push(e);return}if(t.length>0&&Nl(e)){r=!0,n.push(e);return}t.push(e)}),{paragraphLines:t,blockLines:n}}function Il(e){let t=[],n=0,r=0;for(;n<e.length;){let i=e[n],a=i.match(kl);if(!a)break;let[,o,s,c,l]=a,u=o.length,d=parseInt(s,10),f=isNaN(d)?ul(s):void 0,p=isNaN(d)?dl(s):d,m=[l],h=n+1,g=[i],_=!1;for(;h<e.length;){let t=e[h];if(t.match(kl))break;if(t.trim()===``)g.push(t),m.push(``),_=!0,h+=1;else if(t.match(Al)){let e=t.length-t.trimStart().length,n=u+s.length+1;g.push(t),m.push(t.slice(Math.min(e,n))),h+=1}else{if(_||Pl(t))break;g.push(t),m.push(t),h+=1}}t.push({indent:u,number:p,type:f,content:m.join(`
`).trim(),contentLines:m,raw:g.join(`
`)}),r=h,n=h}return[t,r]}var Ll=RegExp(`^(${rl})([.)])\\s+(.+)$`);function Rl(e){let t=e.split(`
`).filter(e=>e.trim().length>0);if(t.length===0)return null;let n=[];for(let e of t){let t=e.trim().match(Ll);if(!t)return null;n.push({marker:t[1],content:t[3]})}return pl(n.map(e=>e.marker))?{type:`orderedList`,attrs:hl(n[0].marker),content:n.map(e=>({type:`listItem`,content:[{type:`paragraph`,content:[{type:`text`,text:e.content}]}]}))}:null}function zl(e,t,n){let r=[],i=0;for(;i<e.length;){let a=e[i];if(a.indent===t){let{paragraphLines:o,blockLines:s}=Fl(a.contentLines),c=o.join(`
`).trim(),l=[];c&&l.push({type:`paragraph`,raw:c,tokens:n.inlineTokens(c)});let u=s.join(`
`).trim();if(u){let e=n.blockTokens(u);l.push(...e)}let d=i+1,f=[];for(;d<e.length&&e[d].indent>t;)f.push(e[d]),d+=1;if(f.length>0){let e=zl(f,Math.min(...f.map(e=>e.indent)),n);l.push({type:`list`,ordered:!0,start:f[0].number,typeMarker:f[0].type,items:e,raw:f.map(e=>e.raw).join(`
`)})}r.push({type:`list_item`,raw:a.raw,tokens:l}),i=d}else i+=1}return r}function Bl(e,t){return e.map(e=>{if(e.type!==`list_item`)return t.parseChildren([e])[0];let n=[];return e.tokens&&e.tokens.length>0&&e.tokens.forEach(e=>{if(e.type===`paragraph`||e.type===`list`||e.type===`blockquote`||e.type===`code`)n.push(...t.parseChildren([e]));else if(e.type===`text`&&e.tokens){let r=t.parseChildren([e]);n.push({type:`paragraph`,content:r})}else{let r=t.parseChildren([e]);r.length>0&&n.push(...r)}}),{type:`listItem`,content:n}})}var Vl=`listItem`,Hl=`textStyle`,Ul=/^(\d+)\.\s$/;function Wl(e){let t=e.match(/list-style-type\s*:\s*([^;]+)/i);if(!t)return null;switch(t[1].trim().toLowerCase()){case`upper-roman`:return`I`;case`lower-roman`:return`i`;case`upper-alpha`:case`upper-latin`:return`A`;case`lower-alpha`:case`lower-latin`:return`a`;default:return null}}var Gl=D.create({name:`orderedList`,addOptions(){return{itemTypeName:`listItem`,HTMLAttributes:{},keepMarks:!1,keepAttributes:!1}},group:`block list`,content(){return`${this.options.itemTypeName}+`},addAttributes(){return{start:{default:1,parseHTML:e=>e.hasAttribute(`start`)?parseInt(e.getAttribute(`start`)||``,10):1},type:{default:null,parseHTML:e=>{let t=e.getAttribute(`type`);if(t)return t;let n=e.getAttribute(`style`);if(n){let e=Wl(n);if(e)return e}let r=e.querySelector(`li`);if(r){let e=r.getAttribute(`style`);if(e){let t=Wl(e);if(t)return t}}return null}}}},parseHTML(){return[{tag:`ol`}]},renderHTML({HTMLAttributes:e}){let{start:t,type:n,...r}=e,i=w(this.options.HTMLAttributes,r);return t!==1&&(i.start=t),n&&n!==`1`&&(i.type=n),[`ol`,i,0]},markdownTokenName:`list`,parseMarkdown:(e,t)=>{if(e.type!==`list`||!e.ordered)return[];let n=e.start||1,r=e.typeMarker,i=e.items?Bl(e.items,t):[],a={};return n!==1&&(a.start=n),r&&(a.type=r),Object.keys(a).length>0?{type:`orderedList`,attrs:a,content:i}:{type:`orderedList`,content:i}},renderMarkdown:(e,t)=>e.content?t.renderChildren(e.content,`
`):``,markdownTokenizer:{name:`orderedList`,level:`block`,start:()=>-1,tokenize:(e,t,n)=>{let r=e.split(`
`),[i,a]=Il(r);if(i.length===0)return;let o=zl(i,i[0].indent,n);if(o.length!==0)return{type:`list`,ordered:!0,start:i[0]?.number||1,typeMarker:i[0]?.type,items:o,raw:r.slice(0,a).join(`
`)}}},markdownOptions:{indentsContent:!0},addCommands(){return{toggleOrderedList:()=>({commands:e,chain:t})=>this.options.keepAttributes?t().toggleList(this.name,this.options.itemTypeName,this.options.keepMarks).updateAttributes(Vl,this.editor.getAttributes(Hl)).run():e.toggleList(this.name,this.options.itemTypeName,this.options.keepMarks)}},addKeyboardShortcuts(){return{"Mod-Shift-7":()=>this.editor.commands.toggleOrderedList()}},addProseMirrorPlugins(){return[new C({props:{handlePaste:(e,t)=>{if((t.clipboardData?.getData(`text/html`))?.trim())return!1;let n=t.clipboardData?.getData(`text/plain`);if(!n)return!1;let r=Rl(n);if(!r)return!1;try{let t=e.state.schema.nodeFromJSON(r),n=e.state.tr.replaceSelectionWith(t);return e.dispatch(n),!0}catch{return!1}}}})]},addInputRules(){let e=(e,t)=>(!t.attrs.type||t.attrs.type===`1`)&&t.childCount+t.attrs.start===+e[1],t=st({find:Ul,type:this.type,getAttributes:e=>({start:+e[1]}),joinPredicate:e});return(this.options.keepMarks||this.options.keepAttributes)&&(t=st({find:Ul,type:this.type,keepMarks:this.options.keepMarks,keepAttributes:this.options.keepAttributes,getAttributes:e=>({start:+e[1],...this.editor.getAttributes(Hl)}),joinPredicate:e,editor:this.editor})),[t]}}),Kl=/^\s*(\[([( |x])?\])\s$/,ql=`position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0`,Jl=(e,t,n)=>{var r;return(n==null||(r=n.checkboxLabel)==null?void 0:r.call(n,e,t))||`Task item checkbox for ${e.textContent||`empty task item`}`},Yl=D.create({name:`taskItem`,addOptions(){return{nested:!1,HTMLAttributes:{},taskListTypeName:`taskList`,a11y:void 0}},content(){return this.options.nested?`paragraph block*`:`paragraph+`},defining:!0,addAttributes(){return{checked:{default:!1,keepOnSplit:!1,parseHTML:e=>{let t=e.getAttribute(`data-checked`);return t===``||t===`true`},renderHTML:e=>({"data-checked":e.checked})}}},parseHTML(){return[{tag:`li[data-type="${this.name}"]`,priority:51,contentElement:e=>e.querySelector(`div`)??e}]},renderHTML({node:e,HTMLAttributes:t}){return[`li`,w(this.options.HTMLAttributes,t,{"data-type":this.name}),[`label`,[`input`,{type:`checkbox`,checked:e.attrs.checked?`checked`:null}],[`span`]],[`div`,0]]},parseMarkdown:(e,t)=>{let n=[];if(e.tokens&&e.tokens.length>0?n.push(t.createNode(`paragraph`,{},t.parseInline(e.tokens))):e.text?n.push(t.createNode(`paragraph`,{},[t.createNode(`text`,{text:e.text})])):n.push(t.createNode(`paragraph`,{},[])),e.nestedTokens&&e.nestedTokens.length>0){let r=t.parseChildren(e.nestedTokens);n.push(...r)}return t.createNode(`taskItem`,{checked:e.checked||!1},n)},renderMarkdown:(e,t)=>{let n=`- [${e.attrs?.checked?`x`:` `}] `;return $e(e,t,n)},addExtensions(){return this.options.nested?[el(this.name,[this.options.taskListTypeName])]:[]},addKeyboardShortcuts(){let e={Enter:()=>this.editor.commands.splitListItem(this.name),"Shift-Tab":()=>this.editor.commands.liftListItem(this.name)};return this.options.nested?{...e,Tab:()=>this.editor.commands.sinkListItem(this.name)}:e},addNodeView(){return({node:e,HTMLAttributes:t,getPos:n,editor:r})=>{let i=document.createElement(`li`),a=document.createElement(`label`),o=document.createElement(`span`),s=document.createElement(`input`),c=document.createElement(`div`);o.style.cssText=ql;let l=e=>{let t=Jl(e,e.attrs.checked,this.options.a11y);s.setAttribute(`aria-label`,t),o.textContent=t};l(e),a.contentEditable=`false`,s.type=`checkbox`,s.addEventListener(`mousedown`,e=>e.preventDefault()),s.addEventListener(`change`,t=>{if(!r.isEditable&&!this.options.onReadOnlyChecked){s.checked=!s.checked;return}let{checked:i}=t.target;r.isEditable&&typeof n==`function`&&r.chain().focus(void 0,{scrollIntoView:!1}).command(({tr:e})=>{let t=n();if(typeof t!=`number`)return!1;let r=e.doc.nodeAt(t);return e.setNodeMarkup(t,void 0,{...r?.attrs,checked:i}),!0}).run(),!r.isEditable&&this.options.onReadOnlyChecked&&(this.options.onReadOnlyChecked(e,i)||(s.checked=!s.checked))}),Object.entries(this.options.HTMLAttributes).forEach(([e,t])=>{i.setAttribute(e,t)}),i.dataset.checked=e.attrs.checked,s.checked=e.attrs.checked,a.append(s,o),i.append(a,c),Object.entries(t).forEach(([e,t])=>{i.setAttribute(e,t)});let u=new Set(Object.keys(t));return{dom:i,contentDOM:c,update:e=>{if(e.type!==this.type)return!1;i.dataset.checked=e.attrs.checked,s.checked=e.attrs.checked,l(e);let t=r.extensionManager.attributes,n=ve(e,t),a=new Set(Object.keys(n)),o=this.options.HTMLAttributes;return u.forEach(e=>{a.has(e)||(e in o?i.setAttribute(e,o[e]):i.removeAttribute(e))}),Object.entries(n).forEach(([e,t])=>{t==null?e in o?i.setAttribute(e,o[e]):i.removeAttribute(e):i.setAttribute(e,t)}),u=a,!0}}}},addInputRules(){return[st({find:Kl,type:this.type,getAttributes:e=>({checked:e[e.length-1]===`x`})})]}}),Xl=D.create({name:`taskList`,addOptions(){return{itemTypeName:`taskItem`,HTMLAttributes:{}}},group:`block list`,content(){return`${this.options.itemTypeName}+`},parseHTML(){return[{tag:`ul[data-type="${this.name}"]`,priority:51}]},renderHTML({HTMLAttributes:e}){return[`ul`,w(this.options.HTMLAttributes,e,{"data-type":this.name}),0]},parseMarkdown:(e,t)=>t.createNode(`taskList`,{},t.parseChildren(e.items||[])),renderMarkdown:(e,t)=>e.content?t.renderChildren(e.content,`
`):``,markdownTokenizer:{name:`taskList`,level:`block`,start(e){let t=e.match(/^\s*[-+*]\s+\[([ xX])\]\s+/)?.index;return t===void 0?-1:t},tokenize(e,t,n){let r=e=>{let t=at(e,{itemPattern:/^(\s*)([-+*])\s+\[([ xX])\]\s+(.*)$/,extractItemData:e=>({indentLevel:e[1].length,mainContent:e[4],checked:e[3].toLowerCase()===`x`}),createToken:(e,t)=>({type:`taskItem`,raw:``,mainContent:e.mainContent,indentLevel:e.indentLevel,checked:e.checked,text:e.mainContent,tokens:n.inlineTokens(e.mainContent),nestedTokens:t}),customNestedParser:r},n);if(t){let r={type:`taskList`,raw:t.raw,items:t.items},i=e.slice(t.raw.length);return i.trim()?[r,...n.blockTokens(i)]:[r]}return n.blockTokens(e)},i=at(e,{itemPattern:/^(\s*)([-+*])\s+\[([ xX])\]\s+(.*)$/,extractItemData:e=>({indentLevel:e[1].length,mainContent:e[4],checked:e[3].toLowerCase()===`x`}),createToken:(e,t)=>({type:`taskItem`,raw:``,mainContent:e.mainContent,indentLevel:e.indentLevel,checked:e.checked,text:e.mainContent,tokens:n.inlineTokens(e.mainContent),nestedTokens:t}),customNestedParser:r},n);if(i)return{type:`taskList`,raw:i.raw,items:i.items}}},markdownOptions:{indentsContent:!0},addCommands(){return{toggleTaskList:()=>({commands:e})=>e.toggleList(this.name,this.options.itemTypeName)}},addKeyboardShortcuts(){return{"Mod-Shift-9":()=>this.editor.commands.toggleTaskList()}}});S.create({name:`listKit`,addExtensions(){let e=[];return this.options.bulletList!==!1&&e.push(Xc.configure(this.options.bulletList)),this.options.listItem!==!1&&e.push(yl.configure(this.options.listItem)),this.options.listKeymap!==!1&&e.push(Ol.configure(this.options.listKeymap)),this.options.orderedList!==!1&&e.push(Gl.configure(this.options.orderedList)),this.options.taskItem!==!1&&e.push(Yl.configure(this.options.taskItem)),this.options.taskList!==!1&&e.push(Xl.configure(this.options.taskList)),e}});var Zl=`&nbsp;`,Ql=`\xA0`,$l=D.create({name:`paragraph`,priority:1e3,addOptions(){return{HTMLAttributes:{}}},group:`block`,content:`inline*`,parseHTML(){return[{tag:`p`}]},renderHTML({HTMLAttributes:e}){return[`p`,w(this.options.HTMLAttributes,e),0]},parseMarkdown:(e,t)=>{let n=e.tokens||[];if(n.length===1&&n[0].type===`image`)return t.parseChildren([n[0]]);let r=t.parseInline(n);return n.length===1&&n[0].type===`text`&&(n[0].raw===Zl||n[0].text===Zl||n[0].raw===Ql||n[0].text===Ql)&&r.length===1&&r[0].type===`text`&&(r[0].text===Zl||r[0].text===Ql)?t.createNode(`paragraph`,void 0,[]):t.createNode(`paragraph`,void 0,r)},renderMarkdown:(e,t,n)=>{if(!e)return``;let r=Array.isArray(e.content)?e.content:[];if(r.length===0){var i,a;let e=Array.isArray(n==null||(i=n.previousNode)==null?void 0:i.content)?n.previousNode.content:[];return(n==null||(a=n.previousNode)==null?void 0:a.type)===`paragraph`&&e.length===0?Zl:``}return t.renderChildren(r)},addCommands(){return{setParagraph:()=>({commands:e})=>e.setNode(this.name)}},addKeyboardShortcuts(){return{"Mod-Alt-0":()=>this.editor.commands.setParagraph()}}}),eu=/(?:^|\s)(~~(?!\s+~~)((?:[^~]+))~~(?!\s+~~))$/,tu=/(?:^|\s)(~~(?!\s+~~)((?:[^~]+))~~(?!\s+~~))/g,nu=Ee.create({name:`strike`,addOptions(){return{HTMLAttributes:{}}},parseHTML(){return[{tag:`s`},{tag:`del`},{tag:`strike`},{style:`text-decoration`,consuming:!1,getAttrs:e=>e.includes(`line-through`)?{}:!1}]},renderHTML({HTMLAttributes:e}){return[`s`,w(this.options.HTMLAttributes,e),0]},markdownTokenName:`del`,parseMarkdown:(e,t)=>t.applyMark(`strike`,t.parseInline(e.tokens||[])),renderMarkdown:(e,t)=>`~~${t.renderChildren(e)}~~`,addCommands(){return{setStrike:()=>({commands:e})=>e.setMark(this.name),toggleStrike:()=>({commands:e})=>e.toggleMark(this.name),unsetStrike:()=>({commands:e})=>e.unsetMark(this.name)}},addKeyboardShortcuts(){return{"Mod-Shift-s":()=>this.editor.commands.toggleStrike()}},addInputRules(){return[Oe({find:eu,type:this.type})]},addPasteRules(){return[de({find:tu,type:this.type})]}}),ru=D.create({name:`text`,group:`inline`,parseMarkdown:e=>({type:`text`,text:e.text||``}),renderMarkdown:e=>e.text||``}),iu=Ee.create({name:`underline`,addOptions(){return{HTMLAttributes:{}}},parseHTML(){return[{tag:`u`},{style:`text-decoration`,consuming:!1,getAttrs:e=>e.includes(`underline`)?{}:!1}]},renderHTML({HTMLAttributes:e}){return[`u`,w(this.options.HTMLAttributes,e),0]},parseMarkdown(e,t){return t.applyMark(this.name||`underline`,t.parseInline(e.tokens||[]))},renderMarkdown(e,t){return`++${t.renderChildren(e)}++`},markdownTokenizer:{name:`underline`,level:`inline`,start(e){return e.indexOf(`++`)},tokenize(e,t,n){let r=/^(\+\+)([\s\S]+?)(\+\+)/.exec(e);if(!r)return;let i=r[2].trim();return{type:`underline`,raw:r[0],text:i,tokens:n.inlineTokens(i)}}},addCommands(){return{setUnderline:()=>({commands:e})=>e.setMark(this.name),toggleUnderline:()=>({commands:e})=>e.toggleMark(this.name),unsetUnderline:()=>({commands:e})=>e.unsetMark(this.name)}},addKeyboardShortcuts(){return{"Mod-u":()=>this.editor.commands.toggleUnderline(),"Mod-U":()=>this.editor.commands.toggleUnderline()}}}),au=/(?:^|\s)(==(?!\s+==)((?:[^=]+))==(?!\s+==))$/,ou=/(?:^|\s)(==(?!\s+==)((?:[^=]+))==(?!\s+==))/g,su=Ee.create({name:`highlight`,addOptions(){return{multicolor:!1,HTMLAttributes:{}}},addAttributes(){return this.options.multicolor?{color:{default:null,parseHTML:e=>e.getAttribute(`data-color`)||Se(e,`background-color`)||e.style.backgroundColor,renderHTML:e=>e.color?{"data-color":e.color,style:`background-color: ${e.color}; color: inherit`}:{}}}:{}},parseHTML(){return[{tag:`mark`}]},renderHTML({HTMLAttributes:e}){return[`mark`,w(this.options.HTMLAttributes,e),0]},renderMarkdown:(e,t)=>`==${t.renderChildren(e)}==`,parseMarkdown:(e,t)=>t.applyMark(`highlight`,t.parseInline(e.tokens||[])),markdownTokenizer:{name:`highlight`,level:`inline`,start:e=>e.indexOf(`==`),tokenize(e,t,n){let r=/^(==)([^=]+)(==)/.exec(e);if(r){let e=r[2].trim(),t=n.inlineTokens(e);return{type:`highlight`,raw:r[0],text:e,tokens:t}}}},addCommands(){return{setHighlight:e=>({commands:t})=>t.setMark(this.name,e),toggleHighlight:e=>({commands:t})=>t.toggleMark(this.name,e),unsetHighlight:()=>({commands:e})=>e.unsetMark(this.name)}},addKeyboardShortcuts(){return{"Mod-Shift-h":()=>this.editor.commands.toggleHighlight()}},addInputRules(){return[Oe({find:au,type:this.type})]},addPasteRules(){return[de({find:ou,type:this.type})]}}),cu=Ee.create({name:`subscript`,addOptions(){return{HTMLAttributes:{}}},parseHTML(){return[{tag:`sub`},{style:`vertical-align`,getAttrs(e){return e===`sub`&&null}}]},renderHTML({HTMLAttributes:e}){return[`sub`,w(this.options.HTMLAttributes,e),0]},addCommands(){return{setSubscript:()=>({commands:e})=>e.setMark(this.name),toggleSubscript:()=>({commands:e})=>e.toggleMark(this.name),unsetSubscript:()=>({commands:e})=>e.unsetMark(this.name)}},addKeyboardShortcuts(){return{"Mod-,":()=>this.editor.commands.toggleSubscript()}}}),lu=Ee.create({name:`superscript`,addOptions(){return{HTMLAttributes:{}}},parseHTML(){return[{tag:`sup`},{style:`vertical-align`,getAttrs(e){return e===`super`&&null}}]},renderHTML({HTMLAttributes:e}){return[`sup`,w(this.options.HTMLAttributes,e),0]},addCommands(){return{setSuperscript:()=>({commands:e})=>e.setMark(this.name),toggleSuperscript:()=>({commands:e})=>e.toggleMark(this.name),unsetSuperscript:()=>({commands:e})=>e.unsetMark(this.name)}},addKeyboardShortcuts(){return{"Mod-.":()=>this.editor.commands.toggleSuperscript()}}}),uu,du;if(typeof WeakMap<`u`){let e=new WeakMap;uu=t=>e.get(t),du=(t,n)=>(e.set(t,n),n)}else{let e=[],t=0;uu=t=>{for(let n=0;n<e.length;n+=2)if(e[n]==t)return e[n+1]},du=(n,r)=>(t==10&&(t=0),e[t++]=n,e[t++]=r)}var K=class{constructor(e,t,n,r){this.width=e,this.height=t,this.map=n,this.problems=r}findCell(e){for(let t=0;t<this.map.length;t++){let n=this.map[t];if(n!=e)continue;let r=t%this.width,i=t/this.width|0,a=r+1,o=i+1;for(let e=1;a<this.width&&this.map[t+e]==n;e++)a++;for(let e=1;o<this.height&&this.map[t+this.width*e]==n;e++)o++;return{left:r,top:i,right:a,bottom:o}}throw RangeError(`No cell with offset ${e} found`)}colCount(e){for(let t=0;t<this.map.length;t++)if(this.map[t]==e)return t%this.width;throw RangeError(`No cell with offset ${e} found`)}nextCell(e,t,n){let{left:r,right:i,top:a,bottom:o}=this.findCell(e);return t==`horiz`?(n<0?r==0:i==this.width)?null:this.map[a*this.width+(n<0?r-1:i)]:(n<0?a==0:o==this.height)?null:this.map[r+this.width*(n<0?a-1:o)]}rectBetween(e,t){let{left:n,right:r,top:i,bottom:a}=this.findCell(e),{left:o,right:s,top:c,bottom:l}=this.findCell(t);return{left:Math.min(n,o),top:Math.min(i,c),right:Math.max(r,s),bottom:Math.max(a,l)}}cellsInRect(e){let t=[],n={};for(let r=e.top;r<e.bottom;r++)for(let i=e.left;i<e.right;i++){let a=r*this.width+i,o=this.map[a];n[o]||(n[o]=!0,!(i==e.left&&i&&this.map[a-1]==o||r==e.top&&r&&this.map[a-this.width]==o)&&t.push(o))}return t}positionAt(e,t,n){for(let r=0,i=0;;r++){let a=i+n.child(r).nodeSize;if(r==e){let n=t+e*this.width,r=(e+1)*this.width;for(;n<r&&this.map[n]<i;)n++;return n==r?a-1:this.map[n]}i=a}}static get(e){return uu(e)||du(e,fu(e))}};function fu(e){if(e.type.spec.tableRole!=`table`)throw RangeError(`Not a table node: `+e.type.name);let t=pu(e),n=e.childCount,r=[],i=0,a=null,o=[];for(let e=0,i=t*n;e<i;e++)r[e]=0;for(let s=0,c=0;s<n;s++){let l=e.child(s);c++;for(let e=0;;e++){for(;i<r.length&&r[i]!=0;)i++;if(e==l.childCount)break;let u=l.child(e),{colspan:d,rowspan:f,colwidth:p}=u.attrs;for(let e=0;e<f;e++){if(e+s>=n){(a||=[]).push({type:`overlong_rowspan`,pos:c,n:f-e});break}let l=i+e*t;for(let e=0;e<d;e++){r[l+e]==0?r[l+e]=c:(a||=[]).push({type:`collision`,row:s,pos:c,n:d-e});let n=p&&p[e];if(n){let r=(l+e)%t*2,i=o[r];i==null||i!=n&&o[r+1]==1?(o[r]=n,o[r+1]=1):i==n&&o[r+1]++}}}i+=d,c+=u.nodeSize}let u=(s+1)*t,d=0;for(;i<u;)r[i++]==0&&d++;d&&(a||=[]).push({type:`missing`,row:s,n:d}),c++}(t===0||n===0)&&(a||=[]).push({type:`zero_sized`});let s=new K(t,n,r,a),c=!1;for(let e=0;!c&&e<o.length;e+=2)o[e]!=null&&o[e+1]<n&&(c=!0);return c&&mu(s,o,e),s}function pu(e){let t=-1,n=!1;for(let r=0;r<e.childCount;r++){let i=e.child(r),a=0;if(n)for(let t=0;t<r;t++){let n=e.child(t);for(let e=0;e<n.childCount;e++){let i=n.child(e);t+i.attrs.rowspan>r&&(a+=i.attrs.colspan)}}for(let e=0;e<i.childCount;e++){let t=i.child(e);a+=t.attrs.colspan,t.attrs.rowspan>1&&(n=!0)}t==-1?t=a:t!=a&&(t=Math.max(t,a))}return t}function mu(e,t,n){e.problems||=[];let r={};for(let i=0;i<e.map.length;i++){let a=e.map[i];if(r[a])continue;r[a]=!0;let o=n.nodeAt(a);if(!o)throw RangeError(`No cell with offset ${a} found`);let s=null,c=o.attrs;for(let n=0;n<c.colspan;n++){let r=t[(i+n)%e.width*2];r!=null&&(!c.colwidth||c.colwidth[n]!=r)&&((s||=hu(c))[n]=r)}s&&e.problems.unshift({type:`colwidth mismatch`,pos:a,colwidth:s})}}function hu(e){if(e.colwidth)return e.colwidth.slice();let t=[];for(let n=0;n<e.colspan;n++)t.push(0);return t}function q(e){let t=e.cached.tableNodeTypes;if(!t){t=e.cached.tableNodeTypes={};for(let n in e.nodes){let r=e.nodes[n],i=r.spec.tableRole;i&&(t[i]=r)}}return t}var gu=new T(`selectingCells`);function _u(e){for(let t=e.depth-1;t>0;t--)if(e.node(t).type.spec.tableRole==`row`)return e.node(0).resolve(e.before(t+1));return null}function vu(e){for(let t=e.depth;t>0;t--){let n=e.node(t).type.spec.tableRole;if(n===`cell`||n===`header_cell`)return e.node(t)}return null}function yu(e){let t=e.selection.$head;for(let e=t.depth;e>0;e--)if(t.node(e).type.spec.tableRole==`row`)return!0;return!1}function bu(e){let t=e.selection;if(`$anchorCell`in t&&t.$anchorCell)return t.$anchorCell.pos>t.$headCell.pos?t.$anchorCell:t.$headCell;if(`node`in t&&t.node&&t.node.type.spec.tableRole==`cell`)return t.$anchor;let n=_u(t.$head)||xu(t.$head);if(n)return n;throw RangeError(`No cell found around position ${t.head}`)}function xu(e){for(let t=e.nodeAfter,n=e.pos;t;t=t.firstChild,n++){let r=t.type.spec.tableRole;if(r==`cell`||r==`header_cell`)return e.doc.resolve(n)}for(let t=e.nodeBefore,n=e.pos;t;t=t.lastChild,n--){let r=t.type.spec.tableRole;if(r==`cell`||r==`header_cell`)return e.doc.resolve(n-t.nodeSize)}}function Su(e){return e.parent.type.spec.tableRole==`row`&&!!e.nodeAfter}function Cu(e){return e.node(0).resolve(e.pos+e.nodeAfter.nodeSize)}function wu(e,t){return e.depth==t.depth&&e.pos>=t.start(-1)&&e.pos<=t.end(-1)}function Tu(e,t,n){let r=e.node(-1),i=K.get(r),a=e.start(-1),o=i.nextCell(e.pos-a,t,n);return o==null?null:e.node(0).resolve(a+o)}function Eu(e,t,n=1){let r={...e,colspan:e.colspan-n};return r.colwidth&&(r.colwidth=r.colwidth.slice(),r.colwidth.splice(t,n),r.colwidth.some(e=>e>0)||(r.colwidth=null)),r}function Du(e,t,n=1){let r={...e,colspan:e.colspan+n};if(r.colwidth){r.colwidth=r.colwidth.slice();for(let e=0;e<n;e++)r.colwidth.splice(t,0,0)}return r}function Ou(e,t,n){let r=q(t.type.schema).header_cell;for(let i=0;i<e.height;i++)if(t.nodeAt(e.map[n+i*e.width]).type!=r)return!1;return!0}var J=class e extends k{constructor(e,t=e){let n=e.node(-1),r=K.get(n),i=e.start(-1),a=r.rectBetween(e.pos-i,t.pos-i),o=e.node(0),s=r.cellsInRect(a).filter(e=>e!=t.pos-i);s.unshift(t.pos-i);let c=s.map(e=>{let t=n.nodeAt(e);if(!t)throw RangeError(`No cell with offset ${e} found`);let r=i+e+1;return new rt(o.resolve(r),o.resolve(r+t.content.size))});super(c[0].$from,c[0].$to,c),this.$anchorCell=e,this.$headCell=t}map(t,n){let r=t.resolve(n.map(this.$anchorCell.pos)),i=t.resolve(n.map(this.$headCell.pos));if(Su(r)&&Su(i)&&wu(r,i)){let t=this.$anchorCell.node(-1)!=r.node(-1);return t&&this.isRowSelection()?e.rowSelection(r,i):t&&this.isColSelection()?e.colSelection(r,i):new e(r,i)}return E.between(r,i)}content(){let e=this.$anchorCell.node(-1),t=K.get(e),n=this.$anchorCell.start(-1),r=t.rectBetween(this.$anchorCell.pos-n,this.$headCell.pos-n),i={},a=[];for(let n=r.top;n<r.bottom;n++){let o=[];for(let a=n*t.width+r.left,s=r.left;s<r.right;s++,a++){let n=t.map[a];if(i[n])continue;i[n]=!0;let s=t.findCell(n),c=e.nodeAt(n);if(!c)throw RangeError(`No cell with offset ${n} found`);let l=r.left-s.left,u=s.right-r.right;if(l>0||u>0){let e=c.attrs;if(l>0&&(e=Eu(e,0,l)),u>0&&(e=Eu(e,e.colspan-u,u)),s.left<r.left){if(c=c.type.createAndFill(e),!c)throw RangeError(`Could not create cell with attrs ${JSON.stringify(e)}`)}else c=c.type.create(e,c.content)}if(s.top<r.top||s.bottom>r.bottom){let e={...c.attrs,rowspan:Math.min(s.bottom,r.bottom)-Math.max(s.top,r.top)};c=s.top<r.top?c.type.createAndFill(e):c.type.create(e,c.content)}o.push(c)}a.push(e.child(n).copy(M.from(o)))}let o=this.isColSelection()&&this.isRowSelection()?e:a;return new j(M.from(o),1,1)}replace(e,t=j.empty){let n=e.steps.length,r=this.ranges;for(let i=0;i<r.length;i++){let{$from:a,$to:o}=r[i],s=e.mapping.slice(n);e.replace(s.map(a.pos),s.map(o.pos),i?j.empty:t)}let i=k.findFrom(e.doc.resolve(e.mapping.slice(n).map(this.to)),-1);i&&e.setSelection(i)}replaceWith(e,t){this.replace(e,new j(M.from(t),0,0))}forEachCell(e){let t=this.$anchorCell.node(-1),n=K.get(t),r=this.$anchorCell.start(-1),i=n.cellsInRect(n.rectBetween(this.$anchorCell.pos-r,this.$headCell.pos-r));for(let n=0;n<i.length;n++)e(t.nodeAt(i[n]),r+i[n])}isColSelection(){let e=this.$anchorCell.index(-1),t=this.$headCell.index(-1);if(Math.min(e,t)>0)return!1;let n=e+this.$anchorCell.nodeAfter.attrs.rowspan,r=t+this.$headCell.nodeAfter.attrs.rowspan;return Math.max(n,r)==this.$headCell.node(-1).childCount}static colSelection(t,n=t){let r=t.node(-1),i=K.get(r),a=t.start(-1),o=i.findCell(t.pos-a),s=i.findCell(n.pos-a),c=t.node(0);return o.top<=s.top?(o.top>0&&(t=c.resolve(a+i.map[o.left])),s.bottom<i.height&&(n=c.resolve(a+i.map[i.width*(i.height-1)+s.right-1]))):(s.top>0&&(n=c.resolve(a+i.map[s.left])),o.bottom<i.height&&(t=c.resolve(a+i.map[i.width*(i.height-1)+o.right-1]))),new e(t,n)}isRowSelection(){let e=this.$anchorCell.node(-1),t=K.get(e),n=this.$anchorCell.start(-1),r=t.colCount(this.$anchorCell.pos-n),i=t.colCount(this.$headCell.pos-n);if(Math.min(r,i)>0)return!1;let a=r+this.$anchorCell.nodeAfter.attrs.colspan,o=i+this.$headCell.nodeAfter.attrs.colspan;return Math.max(a,o)==t.width}eq(t){return t instanceof e&&t.$anchorCell.pos==this.$anchorCell.pos&&t.$headCell.pos==this.$headCell.pos}static rowSelection(t,n=t){let r=t.node(-1),i=K.get(r),a=t.start(-1),o=i.findCell(t.pos-a),s=i.findCell(n.pos-a),c=t.node(0);return o.left<=s.left?(o.left>0&&(t=c.resolve(a+i.map[o.top*i.width])),s.right<i.width&&(n=c.resolve(a+i.map[i.width*(s.top+1)-1]))):(s.left>0&&(n=c.resolve(a+i.map[s.top*i.width])),o.right<i.width&&(t=c.resolve(a+i.map[i.width*(o.top+1)-1]))),new e(t,n)}toJSON(){return{type:`cell`,anchor:this.$anchorCell.pos,head:this.$headCell.pos}}static fromJSON(t,n){return new e(t.resolve(n.anchor),t.resolve(n.head))}static create(t,n,r=n){return new e(t.resolve(n),t.resolve(r))}getBookmark(){return new ku(this.$anchorCell.pos,this.$headCell.pos)}};J.prototype.visible=!1,k.jsonID(`cell`,J);var ku=class e{constructor(e,t){this.anchor=e,this.head=t}map(t){return new e(t.map(this.anchor),t.map(this.head))}resolve(e){let t=e.resolve(this.anchor),n=e.resolve(this.head);return t.parent.type.spec.tableRole==`row`&&n.parent.type.spec.tableRole==`row`&&t.index()<t.parent.childCount&&n.index()<n.parent.childCount&&wu(t,n)?new J(t,n):k.near(n,1)}};function Au(e){if(!(e.selection instanceof J))return null;let t=[];return e.selection.forEachCell((e,n)=>{t.push(Ke.node(n,n+e.nodeSize,{class:`selectedCell`}))}),O.create(e.doc,t)}function ju({$from:e,$to:t}){if(e.pos==t.pos||e.pos<t.pos-6)return!1;let n=e.pos,r=t.pos,i=e.depth;for(;i>=0&&!(e.after(i+1)<e.end(i));i--,n++);for(let e=t.depth;e>=0&&!(t.before(e+1)>t.start(e));e--,r--);return n==r&&/row|table/.test(e.node(i).type.spec.tableRole)}function Mu({$from:e,$to:t}){let n,r;for(let t=e.depth;t>0;t--){let r=e.node(t);if(r.type.spec.tableRole===`cell`||r.type.spec.tableRole===`header_cell`){n=r;break}}for(let e=t.depth;e>0;e--){let n=t.node(e);if(n.type.spec.tableRole===`cell`||n.type.spec.tableRole===`header_cell`){r=n;break}}return n!==r&&t.parentOffset===0}function Nu(e,t,n){let r=(t||e).selection,i=(t||e).doc,a,o;if(r instanceof A&&(o=r.node.type.spec.tableRole)){if(o==`cell`||o==`header_cell`)a=J.create(i,r.from);else if(o==`row`){let e=i.resolve(r.from+1);a=J.rowSelection(e,e)}else if(!n){let e=K.get(r.node),t=r.from+1,n=t+e.map[e.width*e.height-1];a=J.create(i,t+1,n)}}else r instanceof E&&ju(r)?a=E.create(i,r.from):r instanceof E&&Mu(r)&&(a=E.create(i,r.$from.start(),r.$from.end()));return a&&(t||=e.tr).setSelection(a),t}var Pu=new T(`fix-tables`);function Fu(e,t,n,r){let i=e.childCount,a=t.childCount;outer:for(let o=0,s=0;o<a;o++){let a=t.child(o);for(let t=s,r=Math.min(i,o+3);t<r;t++)if(e.child(t)==a){s=t+1,n+=a.nodeSize;continue outer}r(a,n),s<i&&e.child(s).sameMarkup(a)?Fu(e.child(s),a,n+1,r):a.nodesBetween(0,a.content.size,r,n+1),n+=a.nodeSize}}function Iu(e,t){let n,r=(t,r)=>{t.type.spec.tableRole==`table`&&(n=Lu(e,t,r,n))};return t?t.doc!=e.doc&&Fu(t.doc,e.doc,0,r):e.doc.descendants(r),n}function Lu(e,t,n,r){let i=K.get(t);if(!i.problems)return r;r||=e.tr;let a=[];for(let e=0;e<i.height;e++)a.push(0);for(let e=0;e<i.problems.length;e++){let o=i.problems[e];if(o.type==`collision`){let e=t.nodeAt(o.pos);if(!e)continue;let i=e.attrs;for(let e=0;e<i.rowspan;e++)a[o.row+e]+=o.n;r.setNodeMarkup(r.mapping.map(n+1+o.pos),null,Eu(i,i.colspan-o.n,o.n))}else if(o.type==`missing`)a[o.row]+=o.n;else if(o.type==`overlong_rowspan`){let e=t.nodeAt(o.pos);if(!e)continue;r.setNodeMarkup(r.mapping.map(n+1+o.pos),null,{...e.attrs,rowspan:e.attrs.rowspan-o.n})}else if(o.type==`colwidth mismatch`){let e=t.nodeAt(o.pos);if(!e)continue;r.setNodeMarkup(r.mapping.map(n+1+o.pos),null,{...e.attrs,colwidth:o.colwidth})}else if(o.type==`zero_sized`){let e=r.mapping.map(n);r.delete(e,e+t.nodeSize)}}let o,s;for(let e=0;e<a.length;e++)a[e]&&(o??=e,s=e);for(let c=0,l=n+1;c<i.height;c++){let n=t.child(c),i=l+n.nodeSize,u=a[c];if(u>0){let t=`cell`;n.firstChild&&(t=n.firstChild.type.spec.tableRole);let a=[];for(let n=0;n<u;n++){let n=q(e.schema)[t].createAndFill();n&&a.push(n)}let d=(c==0||o==c-1)&&s==c?l+1:i-1;r.insert(r.mapping.map(d),a)}l=i}return r.setMeta(Pu,{fixTables:!0})}function Ru(e){let t=e.selection,n=bu(e),r=n.node(-1),i=n.start(-1),a=K.get(r);return{...t instanceof J?a.rectBetween(t.$anchorCell.pos-i,t.$headCell.pos-i):a.findCell(n.pos-i),tableStart:i,map:a,table:r}}function zu(e,{map:t,tableStart:n,table:r},i){let a=i>0?-1:0;Ou(t,r,i+a)&&(a=i==0||i==t.width?null:0);for(let o=0;o<t.height;o++){let s=o*t.width+i;if(i>0&&i<t.width&&t.map[s-1]==t.map[s]){let a=t.map[s],c=r.nodeAt(a);e.setNodeMarkup(e.mapping.map(n+a),null,Du(c.attrs,i-t.colCount(a))),o+=c.attrs.rowspan-1}else{let c=a==null?q(r.type.schema).cell:r.nodeAt(t.map[s+a]).type,l=t.positionAt(o,i,r);e.insert(e.mapping.map(n+l),c.createAndFill())}}return e}function Bu(e,t){if(!yu(e))return!1;if(t){let n=Ru(e);t(zu(e.tr,n,n.left))}return!0}function Vu(e,t){if(!yu(e))return!1;if(t){let n=Ru(e);t(zu(e.tr,n,n.right))}return!0}function Hu(e,{map:t,table:n,tableStart:r},i){let a=e.mapping.maps.length;for(let o=0;o<t.height;){let s=o*t.width+i,c=t.map[s],l=n.nodeAt(c),u=l.attrs;if(i>0&&t.map[s-1]==c||i<t.width-1&&t.map[s+1]==c)e.setNodeMarkup(e.mapping.slice(a).map(r+c),null,Eu(u,i-t.colCount(c)));else{let t=e.mapping.slice(a).map(r+c);e.delete(t,t+l.nodeSize)}o+=u.rowspan}}function Uu(e,t){if(!yu(e))return!1;if(t){let n=Ru(e),r=e.tr;if(n.left==0&&n.right==n.map.width)return!1;for(let e=n.right-1;Hu(r,n,e),e!=n.left;e--){let e=n.tableStart?r.doc.nodeAt(n.tableStart-1):r.doc;if(!e)throw RangeError(`No table found`);n.table=e,n.map=K.get(e)}t(r)}return!0}function Wu(e,t,n){let r=q(t.type.schema).header_cell;for(let i=0;i<e.width;i++)if(t.nodeAt(e.map[i+n*e.width])?.type!=r)return!1;return!0}function Gu(e,{map:t,tableStart:n,table:r},i){let a=n;for(let e=0;e<i;e++)a+=r.child(e).nodeSize;let o=[],s=i>0?-1:0;Wu(t,r,i+s)&&(s=i==0||i==t.height?null:0);for(let a=0,c=t.width*i;a<t.width;a++,c++)if(i>0&&i<t.height&&t.map[c]==t.map[c-t.width]){let i=t.map[c],o=r.nodeAt(i).attrs;e.setNodeMarkup(n+i,null,{...o,rowspan:o.rowspan+1}),a+=o.colspan-1}else{let e=(s==null?q(r.type.schema).cell:r.nodeAt(t.map[c+s*t.width])?.type)?.createAndFill();e&&o.push(e)}return e.insert(a,q(r.type.schema).row.create(null,o)),e}function Ku(e,t){if(!yu(e))return!1;if(t){let n=Ru(e);t(Gu(e.tr,n,n.top))}return!0}function qu(e,t){if(!yu(e))return!1;if(t){let n=Ru(e);t(Gu(e.tr,n,n.bottom))}return!0}function Ju(e,{map:t,table:n,tableStart:r},i){let a=0;for(let e=0;e<i;e++)a+=n.child(e).nodeSize;let o=a+n.child(i).nodeSize,s=e.mapping.maps.length;e.delete(a+r,o+r);let c=new Set;for(let a=0,o=i*t.width;a<t.width;a++,o++){let l=t.map[o];if(!c.has(l)){if(c.add(l),i>0&&l==t.map[o-t.width]){let t=n.nodeAt(l).attrs;e.setNodeMarkup(e.mapping.slice(s).map(l+r),null,{...t,rowspan:t.rowspan-1}),a+=t.colspan-1}else if(i<t.height&&l==t.map[o+t.width]){let o=n.nodeAt(l),c=o.attrs,u=o.type.create({...c,rowspan:o.attrs.rowspan-1},o.content),d=t.positionAt(i+1,a,n);e.insert(e.mapping.slice(s).map(r+d),u),a+=c.colspan-1}}}}function Yu(e,t){if(!yu(e))return!1;if(t){let n=Ru(e),r=e.tr;if(n.top==0&&n.bottom==n.map.height)return!1;for(let e=n.bottom-1;Ju(r,n,e),e!=n.top;e--){let e=n.tableStart?r.doc.nodeAt(n.tableStart-1):r.doc;if(!e)throw RangeError(`No table found`);n.table=e,n.map=K.get(n.table)}t(r)}return!0}function Xu(e){let t=e.content;return t.childCount==1&&t.child(0).isTextblock&&t.child(0).childCount==0}function Zu({width:e,height:t,map:n},r){let i=r.top*e+r.left,a=i,o=(r.bottom-1)*e+r.left,s=i+(r.right-r.left-1);for(let t=r.top;t<r.bottom;t++){if(r.left>0&&n[a]==n[a-1]||r.right<e&&n[s]==n[s+1])return!0;a+=e,s+=e}for(let a=r.left;a<r.right;a++){if(r.top>0&&n[i]==n[i-e]||r.bottom<t&&n[o]==n[o+e])return!0;i++,o++}return!1}function Qu(e,t){let n=e.selection;if(!(n instanceof J)||n.$anchorCell.pos==n.$headCell.pos)return!1;let r=Ru(e),{map:i}=r;if(Zu(i,r))return!1;if(t){let n=e.tr,a={},o=M.empty,s,c;for(let e=r.top;e<r.bottom;e++)for(let t=r.left;t<r.right;t++){let l=i.map[e*i.width+t],u=r.table.nodeAt(l);if(!(a[l]||!u)){if(a[l]=!0,s==null)s=l,c=u;else{Xu(u)||(o=o.append(u.content));let e=n.mapping.map(l+r.tableStart);n.delete(e,e+u.nodeSize)}}}if(s==null||c==null)return!0;if(n.setNodeMarkup(s+r.tableStart,null,{...Du(c.attrs,c.attrs.colspan,r.right-r.left-c.attrs.colspan),rowspan:r.bottom-r.top}),o.size>0){let e=s+1+c.content.size,t=Xu(c)?s+1:e;n.replaceWith(t+r.tableStart,e+r.tableStart,o)}n.setSelection(new J(n.doc.resolve(s+r.tableStart))),t(n)}return!0}function $u(e,t){let n=q(e.schema);return ed(({node:e})=>n[e.type.spec.tableRole])(e,t)}function ed(e){return(t,n)=>{let r=t.selection,i,a;if(r instanceof J){if(r.$anchorCell.pos!=r.$headCell.pos)return!1;i=r.$anchorCell.nodeAfter,a=r.$anchorCell.pos}else{if(i=vu(r.$from),!i)return!1;a=_u(r.$from)?.pos}if(i==null||a==null||i.attrs.colspan==1&&i.attrs.rowspan==1)return!1;if(n){let o=i.attrs,s=[],c=o.colwidth;o.rowspan>1&&(o={...o,rowspan:1}),o.colspan>1&&(o={...o,colspan:1});let l=Ru(t),u=t.tr;for(let e=0;e<l.right-l.left;e++)s.push(c?{...o,colwidth:c&&c[e]?[c[e]]:null}:o);let d;for(let t=l.top;t<l.bottom;t++){let n=l.map.positionAt(t,l.left,l.table);t==l.top&&(n+=i.nodeSize);for(let r=l.left,a=0;r<l.right;r++,a++)(r!=l.left||t!=l.top)&&u.insert(d=u.mapping.map(n+l.tableStart,1),e({node:i,row:t,col:r}).createAndFill(s[a]))}u.setNodeMarkup(a,e({node:i,row:l.top,col:l.left}),s[0]),r instanceof J&&u.setSelection(new J(u.doc.resolve(r.$anchorCell.pos),d?u.doc.resolve(d):void 0)),n(u)}return!0}}function td(e,t){return function(n,r){if(!yu(n))return!1;let i=bu(n);if(i.nodeAfter.attrs[e]===t)return!1;if(r){let a=n.tr;n.selection instanceof J?n.selection.forEachCell((n,r)=>{n.attrs[e]!==t&&a.setNodeMarkup(r,null,{...n.attrs,[e]:t})}):a.setNodeMarkup(i.pos,null,{...i.nodeAfter.attrs,[e]:t}),r(a)}return!0}}function nd(e){return function(t,n){if(!yu(t))return!1;if(n){let r=q(t.schema),i=Ru(t),a=t.tr,o=i.map.cellsInRect(e==`column`?{left:i.left,top:0,right:i.right,bottom:i.map.height}:e==`row`?{left:0,top:i.top,right:i.map.width,bottom:i.bottom}:i),s=o.map(e=>i.table.nodeAt(e));for(let e=0;e<o.length;e++)s[e].type==r.header_cell&&a.setNodeMarkup(i.tableStart+o[e],r.cell,s[e].attrs);if(a.steps.length===0)for(let e=0;e<o.length;e++)a.setNodeMarkup(i.tableStart+o[e],r.header_cell,s[e].attrs);n(a)}return!0}}function rd(e,t,n){let r=t.map.cellsInRect({left:0,top:0,right:e==`row`?t.map.width:1,bottom:e==`column`?t.map.height:1});for(let e=0;e<r.length;e++){let i=t.table.nodeAt(r[e]);if(i&&i.type!==n.header_cell)return!1}return!0}function id(e,t){return t||={useDeprecatedLogic:!1},t.useDeprecatedLogic?nd(e):function(t,n){if(!yu(t))return!1;if(n){let r=q(t.schema),i=Ru(t),a=t.tr,o=rd(`row`,i,r),s=rd(`column`,i,r),c=(e===`column`?o:e===`row`&&s)?1:0,l=e==`column`?{left:0,top:c,right:1,bottom:i.map.height}:e==`row`?{left:c,top:0,right:i.map.width,bottom:1}:i,u=e==`column`?s?r.cell:r.header_cell:e==`row`?o?r.cell:r.header_cell:r.cell;i.map.cellsInRect(l).forEach(e=>{let t=e+i.tableStart,n=a.doc.nodeAt(t);n&&a.setNodeMarkup(t,u,n.attrs)}),n(a)}return!0}}id(`row`,{useDeprecatedLogic:!0}),id(`column`,{useDeprecatedLogic:!0});var ad=id(`cell`,{useDeprecatedLogic:!0});function od(e,t){if(t<0){let t=e.nodeBefore;if(t)return e.pos-t.nodeSize;for(let t=e.index(-1)-1,n=e.before();t>=0;t--){let r=e.node(-1).child(t),i=r.lastChild;if(i)return n-1-i.nodeSize;n-=r.nodeSize}}else{if(e.index()<e.parent.childCount-1)return e.pos+e.nodeAfter.nodeSize;let t=e.node(-1);for(let n=e.indexAfter(-1),r=e.after();n<t.childCount;n++){let e=t.child(n);if(e.childCount)return r+1;r+=e.nodeSize}}return null}function sd(e){return function(t,n){if(!yu(t))return!1;let r=od(bu(t),e);if(r==null)return!1;if(n){let e=t.doc.resolve(r);n(t.tr.setSelection(E.between(e,Cu(e))).scrollIntoView())}return!0}}function cd(e,t){let n=e.selection.$anchor;for(let r=n.depth;r>0;r--)if(n.node(r).type.spec.tableRole==`table`)return t&&t(e.tr.delete(n.before(r),n.after(r)).scrollIntoView()),!0;return!1}function ld(e,t){let n=e.selection;if(!(n instanceof J))return!1;if(t){let r=e.tr,i=q(e.schema).cell.createAndFill().content;n.forEachCell((e,t)=>{e.content.eq(i)||r.replace(r.mapping.map(t+1),r.mapping.map(t+e.nodeSize-1),new j(i,0,0))}),r.docChanged&&t(r)}return!0}function ud(e){if(e.size===0)return null;let{content:t,openStart:n,openEnd:r}=e;for(;t.childCount==1&&(n>0&&r>0||t.child(0).type.spec.tableRole==`table`);)n--,r--,t=t.child(0).content;let i=t.child(0),a=i.type.spec.tableRole,o=i.type.schema,s=[];if(a==`row`)for(let e=0;e<t.childCount;e++){let i=t.child(e).content,a=e?0:Math.max(0,n-1),c=e<t.childCount-1?0:Math.max(0,r-1);(a||c)&&(i=fd(q(o).row,new j(i,a,c)).content),s.push(i)}else if(a==`cell`||a==`header_cell`)s.push(n||r?fd(q(o).row,new j(t,n,r)).content:t);else return null;return dd(o,s)}function dd(e,t){let n=[];for(let e=0;e<t.length;e++){let r=t[e];for(let t=r.childCount-1;t>=0;t--){let{rowspan:i,colspan:a}=r.child(t).attrs;for(let t=e;t<e+i;t++)n[t]=(n[t]||0)+a}}let r=0;for(let e=0;e<n.length;e++)r=Math.max(r,n[e]);for(let i=0;i<n.length;i++)if(i>=t.length&&t.push(M.empty),n[i]<r){let a=q(e).cell.createAndFill(),o=[];for(let e=n[i];e<r;e++)o.push(a);t[i]=t[i].append(M.from(o))}return{height:t.length,width:r,rows:t}}function fd(e,t){let n=e.createAndFill();return new Be(n).replace(0,n.content.size,t).doc}function pd({width:e,height:t,rows:n},r,i){if(e!=r){let t=[],i=[];for(let e=0;e<n.length;e++){let a=n[e],o=[];for(let n=t[e]||0,i=0;n<r;i++){let s=a.child(i%a.childCount);n+s.attrs.colspan>r&&(s=s.type.createChecked(Eu(s.attrs,s.attrs.colspan,n+s.attrs.colspan-r),s.content)),o.push(s),n+=s.attrs.colspan;for(let n=1;n<s.attrs.rowspan;n++)t[e+n]=(t[e+n]||0)+s.attrs.colspan}i.push(M.from(o))}n=i,e=r}if(t!=i){let e=[];for(let r=0,a=0;r<i;r++,a++){let o=[],s=n[a%t];for(let e=0;e<s.childCount;e++){let t=s.child(e);r+t.attrs.rowspan>i&&(t=t.type.create({...t.attrs,rowspan:Math.max(1,i-t.attrs.rowspan)},t.content)),o.push(t)}e.push(M.from(o))}n=e,t=i}return{width:e,height:t,rows:n}}function md(e,t,n,r,i,a,o){let s=e.doc.type.schema,c=q(s),l,u;if(i>t.width)for(let a=0,s=0;a<t.height;a++){let d=n.child(a);s+=d.nodeSize;let f=[],p;p=d.lastChild==null||d.lastChild.type==c.cell?l||=c.cell.createAndFill():u||=c.header_cell.createAndFill();for(let e=t.width;e<i;e++)f.push(p);e.insert(e.mapping.slice(o).map(s-1+r),f)}if(a>t.height){let s=[];for(let e=0,r=(t.height-1)*t.width;e<Math.max(t.width,i);e++){let i=e>=t.width?!1:n.nodeAt(t.map[r+e]).type==c.header_cell;s.push(i?u||=c.header_cell.createAndFill():l||=c.cell.createAndFill())}let d=c.row.create(null,M.from(s)),f=[];for(let e=t.height;e<a;e++)f.push(d);e.insert(e.mapping.slice(o).map(r+n.nodeSize-2),f)}return!!(l||u)}function hd(e,t,n,r,i,a,o,s){if(o==0||o==t.height)return!1;let c=!1;for(let l=i;l<a;l++){let i=o*t.width+l,a=t.map[i];if(t.map[i-t.width]==a){c=!0;let i=n.nodeAt(a),{top:u,left:d}=t.findCell(a);e.setNodeMarkup(e.mapping.slice(s).map(a+r),null,{...i.attrs,rowspan:o-u}),e.insert(e.mapping.slice(s).map(t.positionAt(o,d,n)),i.type.createAndFill({...i.attrs,rowspan:u+i.attrs.rowspan-o})),l+=i.attrs.colspan-1}}return c}function gd(e,t,n,r,i,a,o,s){if(o==0||o==t.width)return!1;let c=!1;for(let l=i;l<a;l++){let i=l*t.width+o,a=t.map[i];if(t.map[i-1]==a){c=!0;let i=n.nodeAt(a),u=t.colCount(a),d=e.mapping.slice(s).map(a+r);e.setNodeMarkup(d,null,Eu(i.attrs,o-u,i.attrs.colspan-(o-u))),e.insert(d+i.nodeSize,i.type.createAndFill(Eu(i.attrs,0,o-u))),l+=i.attrs.rowspan-1}}return c}function _d(e,t,n,r,i){let a=n?e.doc.nodeAt(n-1):e.doc;if(!a)throw Error(`No table found`);let o=K.get(a),{top:s,left:c}=r,l=c+i.width,u=s+i.height,d=e.tr,f=0;function p(){if(a=n?d.doc.nodeAt(n-1):d.doc,!a)throw Error(`No table found`);o=K.get(a),f=d.mapping.maps.length}md(d,o,a,n,l,u,f)&&p(),hd(d,o,a,n,c,l,s,f)&&p(),hd(d,o,a,n,c,l,u,f)&&p(),gd(d,o,a,n,s,u,c,f)&&p(),gd(d,o,a,n,s,u,l,f)&&p();for(let e=s;e<u;e++){let t=o.positionAt(e,c,a),r=o.positionAt(e,l,a);d.replace(d.mapping.slice(f).map(t+n),d.mapping.slice(f).map(r+n),new j(i.rows[e-s],0,0))}p(),d.setSelection(new J(d.doc.resolve(n+o.positionAt(s,c,a)),d.doc.resolve(n+o.positionAt(u-1,l-1,a)))),t(d)}var vd=pt({ArrowLeft:bd(`horiz`,-1),ArrowRight:bd(`horiz`,1),ArrowUp:bd(`vert`,-1),ArrowDown:bd(`vert`,1),"Shift-ArrowLeft":xd(`horiz`,-1),"Shift-ArrowRight":xd(`horiz`,1),"Shift-ArrowUp":xd(`vert`,-1),"Shift-ArrowDown":xd(`vert`,1),Backspace:ld,"Mod-Backspace":ld,Delete:ld,"Mod-Delete":ld});function yd(e,t,n){return!n.eq(e.selection)&&(t&&t(e.tr.setSelection(n).scrollIntoView()),!0)}function bd(e,t){return(n,r,i)=>{if(!i)return!1;let a=n.selection;if(a instanceof J)return yd(n,r,k.near(a.$headCell,t));if(e!=`horiz`&&!a.empty)return!1;let o=Td(i,e,t);if(o==null)return!1;if(e==`horiz`)return yd(n,r,k.near(n.doc.resolve(a.head+t),t));{let i=n.doc.resolve(o),a=Tu(i,e,t),s;return s=a?k.near(a,1):t<0?k.near(n.doc.resolve(i.before(-1)),-1):k.near(n.doc.resolve(i.after(-1)),1),yd(n,r,s)}}}function xd(e,t){return(n,r,i)=>{if(!i)return!1;let a=n.selection,o;if(a instanceof J)o=a;else{let r=Td(i,e,t);if(r==null)return!1;o=new J(n.doc.resolve(r))}let s=Tu(o.$headCell,e,t);return s?yd(n,r,new J(o.$anchorCell,s)):!1}}function Sd(e,t){let n=e.state.doc,r=_u(n.resolve(t));return r?(e.dispatch(e.state.tr.setSelection(new J(r))),!0):!1}function Cd(e,t,n){if(!yu(e.state))return!1;let r=ud(n),i=e.state.selection;if(i instanceof J){r||={width:1,height:1,rows:[M.from(fd(q(e.state.schema).cell,n))]};let t=i.$anchorCell.node(-1),a=i.$anchorCell.start(-1),o=K.get(t).rectBetween(i.$anchorCell.pos-a,i.$headCell.pos-a);return r=pd(r,o.right-o.left,o.bottom-o.top),_d(e.state,e.dispatch,a,o,r),!0}if(r){let t=bu(e.state),n=t.start(-1);return _d(e.state,e.dispatch,n,K.get(t.node(-1)).findCell(t.pos-n),r),!0}return!1}function wd(e,t){if(t.button!=0||t.ctrlKey||t.metaKey)return;let n=Ed(e,t.target),r;if(t.shiftKey&&e.state.selection instanceof J)i(e.state.selection.$anchorCell,t),t.preventDefault();else if(t.shiftKey&&n&&(r=_u(e.state.selection.$anchor))!=null&&Dd(e,t)?.pos!=r.pos)i(r,t),t.preventDefault();else if(!n)return;function i(t,n){let r=Dd(e,n),i=gu.getState(e.state)==null;if(!r||!wu(t,r)){if(i)r=t;else return}let a=new J(t,r);if(i||!e.state.selection.eq(a)){let n=e.state.tr.setSelection(a);i&&n.setMeta(gu,t.pos),e.dispatch(n)}}function a(){e.root.removeEventListener(`mouseup`,a),e.root.removeEventListener(`dragstart`,a),e.root.removeEventListener(`mousemove`,o),gu.getState(e.state)!=null&&e.dispatch(e.state.tr.setMeta(gu,-1))}function o(r){let o=r,s=gu.getState(e.state),c;if(s!=null)c=e.state.doc.resolve(s);else if(Ed(e,o.target)!=n&&(c=Dd(e,t),!c))return a();c&&i(c,o)}e.root.addEventListener(`mouseup`,a),e.root.addEventListener(`dragstart`,a),e.root.addEventListener(`mousemove`,o)}function Td(e,t,n){if(!(e.state.selection instanceof E))return null;let{$head:r}=e.state.selection;for(let i=r.depth-1;i>=0;i--){let a=r.node(i);if((n<0?r.index(i):r.indexAfter(i))!=(n<0?0:a.childCount))return null;if(a.type.spec.tableRole==`cell`||a.type.spec.tableRole==`header_cell`){let a=r.before(i),o=t==`vert`?n>0?`down`:`up`:n>0?`right`:`left`;return e.endOfTextblock(o)?a:null}}return null}function Ed(e,t){for(;t&&t!=e.dom;t=t.parentNode)if(t.nodeName==`TD`||t.nodeName==`TH`)return t;return null}function Dd(e,t){let n=e.posAtCoords({left:t.clientX,top:t.clientY});if(!n)return null;let{inside:r,pos:i}=n;return r>=0&&_u(e.state.doc.resolve(r))||_u(e.state.doc.resolve(i))}var Od=class{constructor(e,t){this.node=e,this.defaultCellMinWidth=t,this.dom=document.createElement(`div`),this.dom.className=`tableWrapper`,this.table=this.dom.appendChild(document.createElement(`table`)),this.table.style.setProperty(`--default-cell-min-width`,`${t}px`),this.colgroup=this.table.appendChild(document.createElement(`colgroup`)),kd(e,this.colgroup,this.table,t),this.contentDOM=this.table.appendChild(document.createElement(`tbody`))}update(e){return e.type==this.node.type&&(this.node=e,kd(e,this.colgroup,this.table,this.defaultCellMinWidth),!0)}ignoreMutation(e){return e.type==`attributes`&&(e.target==this.table||this.colgroup.contains(e.target))}};function kd(e,t,n,r,i,a){let o=0,s=!0,c=t.firstChild,l=e.firstChild;if(l){for(let e=0,n=0;e<l.childCount;e++){let{colspan:u,colwidth:d}=l.child(e).attrs;for(let e=0;e<u;e++,n++){let l=i==n?a:d&&d[e],u=l?l+`px`:``;if(o+=l||r,l||(s=!1),c)c.style.width!=u&&(c.style.width=u),c=c.nextSibling;else{let e=document.createElement(`col`);e.style.width=u,t.appendChild(e)}}}for(;c;){var u;let e=c.nextSibling;(u=c.parentNode)==null||u.removeChild(c),c=e}s?(n.style.width=o+`px`,n.style.minWidth=``):(n.style.width=``,n.style.minWidth=o+`px`)}}var Y=new T(`tableColumnResizing`);function Ad({handleWidth:e=5,cellMinWidth:t=25,defaultCellMinWidth:n=100,View:r=Od,lastColumnResizable:i=!0}={}){let a=new C({key:Y,state:{init(e,t){var i;let o=(i=a.spec)==null||(i=i.props)==null?void 0:i.nodeViews,s=q(t.schema).table.name;return r&&o&&(o[s]=(e,t)=>new r(e,n,t)),new jd(-1,!1)},apply(e,t){return t.apply(e)}},props:{attributes:e=>{let t=Y.getState(e);return t&&t.activeHandle>-1?{class:`resize-cursor`}:{}},handleDOMEvents:{mousemove:(t,n)=>{Md(t,n,e,i)},mouseleave:e=>{Nd(e)},mousedown:(e,r)=>{Pd(e,r,t,n)}},decorations:e=>{let t=Y.getState(e);if(t&&t.activeHandle>-1)return Ud(e,t.activeHandle)},nodeViews:{}}});return a}var jd=class e{constructor(e,t){this.activeHandle=e,this.dragging=t}apply(t){let n=this,r=t.getMeta(Y);if(r&&r.setHandle!=null)return new e(r.setHandle,!1);if(r&&r.setDragging!==void 0)return new e(n.activeHandle,r.setDragging);if(n.activeHandle>-1&&t.docChanged){let r=t.mapping.map(n.activeHandle,-1);return Su(t.doc.resolve(r))||(r=-1),new e(r,n.dragging)}return n}};function Md(e,t,n,r){if(!e.editable)return;let i=Y.getState(e.state);if(i&&!i.dragging){let a=Id(t.target),o=-1;if(a){let{left:r,right:i}=a.getBoundingClientRect();t.clientX-r<=n?o=Ld(e,t,`left`,n):i-t.clientX<=n&&(o=Ld(e,t,`right`,n))}if(o!=i.activeHandle){if(!r&&o!==-1){let t=e.state.doc.resolve(o),n=t.node(-1),r=K.get(n),i=t.start(-1);if(r.colCount(t.pos-i)+t.nodeAfter.attrs.colspan-1==r.width-1)return}zd(e,o)}}}function Nd(e){if(!e.editable)return;let t=Y.getState(e.state);t&&t.activeHandle>-1&&!t.dragging&&zd(e,-1)}function Pd(e,t,n,r){if(!e.editable)return!1;let i=e.dom.ownerDocument.defaultView??window,a=Y.getState(e.state);if(!a||a.activeHandle==-1||a.dragging)return!1;let o=e.state.doc.nodeAt(a.activeHandle),s=Fd(e,a.activeHandle,o.attrs);e.dispatch(e.state.tr.setMeta(Y,{setDragging:{startX:t.clientX,startWidth:s}}));function c(t){i.removeEventListener(`mouseup`,c),i.removeEventListener(`mousemove`,l);let r=Y.getState(e.state);r?.dragging&&(Bd(e,r.activeHandle,Rd(r.dragging,t,n)),e.dispatch(e.state.tr.setMeta(Y,{setDragging:null})))}function l(t){if(!t.which)return c(t);let i=Y.getState(e.state);if(i&&i.dragging){let a=Rd(i.dragging,t,n);Vd(e,i.activeHandle,a,r)}}return Vd(e,a.activeHandle,s,r),i.addEventListener(`mouseup`,c),i.addEventListener(`mousemove`,l),t.preventDefault(),!0}function Fd(e,t,{colspan:n,colwidth:r}){let i=r&&r[r.length-1];if(i)return i;let a=e.domAtPos(t),o=a.node.childNodes[a.offset].offsetWidth,s=n;if(r)for(let e=0;e<n;e++)r[e]&&(o-=r[e],s--);return o/s}function Id(e){for(;e&&e.nodeName!=`TD`&&e.nodeName!=`TH`;)e=e.classList&&e.classList.contains(`ProseMirror`)?null:e.parentNode;return e}function Ld(e,t,n,r){let i=n==`right`?-r:r,a=e.posAtCoords({left:t.clientX+i,top:t.clientY});if(!a)return-1;let{pos:o}=a,s=_u(e.state.doc.resolve(o));if(!s)return-1;if(n==`right`)return s.pos;let c=K.get(s.node(-1)),l=s.start(-1),u=c.map.indexOf(s.pos-l);return u%c.width==0?-1:l+c.map[u-1]}function Rd(e,t,n){let r=t.clientX-e.startX;return Math.max(n,e.startWidth+r)}function zd(e,t){e.dispatch(e.state.tr.setMeta(Y,{setHandle:t}))}function Bd(e,t,n){let r=e.state.doc.resolve(t),i=r.node(-1),a=K.get(i),o=r.start(-1),s=a.colCount(r.pos-o)+r.nodeAfter.attrs.colspan-1,c=e.state.tr;for(let e=0;e<a.height;e++){let t=e*a.width+s;if(e&&a.map[t]==a.map[t-a.width])continue;let r=a.map[t],l=i.nodeAt(r).attrs,u=l.colspan==1?0:s-a.colCount(r);if(l.colwidth&&l.colwidth[u]==n)continue;let d=l.colwidth?l.colwidth.slice():Hd(l.colspan);d[u]=n,c.setNodeMarkup(o+r,null,{...l,colwidth:d})}c.docChanged&&e.dispatch(c)}function Vd(e,t,n,r){let i=e.state.doc.resolve(t),a=i.node(-1),o=i.start(-1),s=K.get(a).colCount(i.pos-o)+i.nodeAfter.attrs.colspan-1,c=e.domAtPos(i.start(-1)).node;for(;c&&c.nodeName!=`TABLE`;)c=c.parentNode;c&&kd(a,c.firstChild,c,r,s,n)}function Hd(e){return Array(e).fill(0)}function Ud(e,t){let n=[],r=e.doc.resolve(t),i=r.node(-1);if(!i)return O.empty;let a=K.get(i),o=r.start(-1),s=a.colCount(r.pos-o)+r.nodeAfter.attrs.colspan-1;for(let t=0;t<a.height;t++){let r=s+t*a.width;if((s==a.width-1||a.map[r]!=a.map[r+1])&&(t==0||a.map[r]!=a.map[r-a.width])){let t=a.map[r],s=o+t+i.nodeAt(t).nodeSize-1,c=document.createElement(`div`);c.className=`column-resize-handle`,Y.getState(e)?.dragging&&n.push(Ke.node(o+t,o+t+i.nodeAt(t).nodeSize,{class:`column-resize-dragging`})),n.push(Ke.widget(s,c))}}return O.create(e.doc,n)}function Wd({allowTableNodeSelection:e=!1}={}){return new C({key:gu,state:{init(){return null},apply(e,t){let n=e.getMeta(gu);if(n!=null)return n==-1?null:n;if(t==null||!e.docChanged)return t;let{deleted:r,pos:i}=e.mapping.mapResult(t);return r?null:i}},props:{decorations:Au,handleDOMEvents:{mousedown:wd},createSelectionBetween(e){return gu.getState(e.state)==null?null:e.state.selection},handleTripleClick:Sd,handleKeyDown:vd,handlePaste:Cd},appendTransaction(t,n,r){return Nu(r,Iu(r,n),e)}})}function Gd(e){return e===`left`||e===`right`||e===`center`?e:null}function Kd(e){let t=(e.style.textAlign||``).trim().toLowerCase(),n=(e.getAttribute(`align`)||``).trim().toLowerCase();return Gd(t||n)}function qd(e){return Gd(e?.align)}function Jd(){return{default:null,parseHTML:e=>Kd(e),renderHTML:e=>e.align?{style:`text-align: ${e.align}`}:{}}}function Yd(e){let t=e.parentElement,n=e.closest(`table`);if(!t||!n)return null;let r=Array.from(t.children).indexOf(e),i=n.querySelectorAll(`colgroup > col`)[r]?.getAttribute(`width`);return i?[parseInt(i,10)]:null}function Xd(e){let t=e.getAttribute(`colwidth`);return t?t.split(`,`).map(e=>parseInt(e,10)):Yd(e)}var Zd=/[ \t\r\n\f]+/g;function Qd(e){return e.children.length>0?!1:(e.textContent??``).replace(Zd,``)===``}function $d(e){let t=e.createAndFill();if(!t)throw Error(`[tiptap error]: "${e.name}" has no default content to backfill.`);return t.content}var ef=D.create({name:`tableCell`,addOptions(){return{HTMLAttributes:{}}},content:`block+`,addAttributes(){return{colspan:{default:1},rowspan:{default:1},colwidth:{default:null,parseHTML:Xd},align:Jd()}},tableRole:`cell`,isolating:!0,parseHTML(){return[{tag:`td`,getAttrs:e=>Qd(e)?{}:!1,getContent:(e,t)=>$d(t.nodes[this.name])},{tag:`td`}]},renderHTML({HTMLAttributes:e}){return[`td`,w(this.options.HTMLAttributes,e),0]}}),tf=D.create({name:`tableHeader`,addOptions(){return{HTMLAttributes:{}}},content:`block+`,addAttributes(){return{colspan:{default:1},rowspan:{default:1},colwidth:{default:null,parseHTML:Xd},align:Jd()}},tableRole:`header_cell`,isolating:!0,parseHTML(){return[{tag:`th`,getAttrs:e=>Qd(e)?{}:!1,getContent:(e,t)=>$d(t.nodes[this.name])},{tag:`th`}]},renderHTML({HTMLAttributes:e}){return[`th`,w(this.options.HTMLAttributes,e),0]}}),nf=D.create({name:`tableRow`,addOptions(){return{HTMLAttributes:{}}},content:`(tableCell | tableHeader)*`,tableRole:`row`,parseHTML(){return[{tag:`tr`}]},renderHTML({HTMLAttributes:e}){return[`tr`,w(this.options.HTMLAttributes,e),0]}});function rf(e,t){return t?[`width`,`${Math.max(t,e)}px`]:[`min-width`,`${e}px`]}function af(e,t,n,r,i,a){let o=0,s=!0,c=t.firstChild,l=e.firstChild;if(l!==null)for(let e=0,n=0;e<l.childCount;e+=1){let{colspan:u,colwidth:d}=l.child(e).attrs;for(let e=0;e<u;e+=1,n+=1){let l=i===n?a:d&&d[e],u=l?`${l}px`:``;if(o+=l||r,l||(s=!1),c){if(c.style.width!==u){let[e,t]=rf(r,l);c.style.setProperty(e,t)}c=c.nextSibling}else{let e=document.createElement(`col`),[n,i]=rf(r,l);e.style.setProperty(n,i),t.appendChild(e)}}}for(;c;){var u;let e=c.nextSibling;(u=c.parentNode)==null||u.removeChild(c),c=e}let d=e.attrs.style&&typeof e.attrs.style==`string`&&/\bwidth\s*:/i.test(e.attrs.style);s&&!d?(n.style.width=`${o}px`,n.style.minWidth=``):(n.style.width=``,n.style.minWidth=`${o}px`)}var of=class{constructor(e,t,n,r={}){this.node=e,this.cellMinWidth=t,this.dom=document.createElement(`div`),this.dom.className=`tableWrapper`,this.table=this.dom.appendChild(document.createElement(`table`));for(let[e,t]of Object.entries(r))t!=null&&(e===`style`?this.table.style.cssText=String(t):this.table.setAttribute(e,String(t)));e.attrs.style&&(this.table.style.cssText=e.attrs.style),this.colgroup=this.table.appendChild(document.createElement(`colgroup`)),af(e,this.colgroup,this.table,t),this.contentDOM=this.table.appendChild(document.createElement(`tbody`))}update(e){return e.type===this.node.type&&(this.node=e,af(e,this.colgroup,this.table,this.cellMinWidth),!0)}ignoreMutation(e){let t=e.target,n=this.dom.contains(t),r=this.contentDOM.contains(t);return!!(n&&!r&&(e.type===`attributes`||e.type===`childList`||e.type===`characterData`))}};function sf(e,t,n,r){let i=0,a=!0,o=[],s=e.firstChild;if(!s)return{};for(let e=0,c=0;e<s.childCount;e+=1){let{colspan:l,colwidth:u}=s.child(e).attrs;for(let e=0;e<l;e+=1,c+=1){let s=n===c?r:u&&u[e];i+=s||t,s||(a=!1);let[l,d]=rf(t,s);o.push([`col`,{style:`${l}: ${d}`}])}}let c=a?`${i}px`:``,l=a?``:`${i}px`;return{colgroup:[`colgroup`,{},...o],tableWidth:c,tableMinWidth:l}}function cf(e,t){return t?e.createChecked(null,t):e.createAndFill()}function lf(e){if(e.cached.tableNodeTypes)return e.cached.tableNodeTypes;let t={};return Object.keys(e.nodes).forEach(n=>{let r=e.nodes[n];r.spec.tableRole&&(t[r.spec.tableRole]=r)}),e.cached.tableNodeTypes=t,t}function uf(e,t,n,r,i){let a=lf(e),o=[],s=[];for(let e=0;e<n;e+=1){let e=cf(a.cell,i);if(e&&s.push(e),r){let e=cf(a.header_cell,i);e&&o.push(e)}}let c=[];for(let e=0;e<t;e+=1)c.push(a.row.createChecked(null,r&&e===0?o:s));return a.table.createChecked(null,c)}function df(e){return e instanceof J}var ff=({editor:e})=>{let{selection:t}=e.state;if(!df(t))return!1;let n=0;return be(t.ranges[0].$from,e=>e.type.name===`table`)?.node.descendants(e=>{if(e.type.name===`table`)return!1;[`tableCell`,`tableHeader`].includes(e.type.name)&&(n+=1)}),n===t.ranges.length&&(e.commands.deleteTable(),!0)};function pf(e,t){let n=e.mapping.map(t);if(be(e.selection.$from,e=>e.type.name===`table`)?.pos===n)return;let r=e.doc.nodeAt(n);if(!r)return;let i=n+r.nodeSize-1;e.setSelection(E.near(e.doc.resolve(i),-1))}function mf(e){let t=``,n=0;for(;n<e.length;){if(e[n]===`\\`&&n+1<e.length){t+=e[n]+e[n+1],n+=2;continue}if(e[n]!=="`"){t+=e[n++];continue}let r=0;for(;n+r<e.length&&e[n+r]==="`";)r+=1;let i=n+r,a=!1;for(;i<e.length;){if(e[i]!=="`"){i+=1;continue}let o=0;for(;i+o<e.length&&e[i+o]==="`";)o+=1;if(o===r){let o=e.slice(n+r,i);t+=e.slice(n,n+r)+o.replace(/\\\||\|/g,e=>e===`|`?`\\|`:e)+e.slice(i,i+r),n=i+r,a=!0;break}i+=o}a||(t+=e.slice(n,n+r),n+=r)}return t}function hf(e){return e.split(`
`).map(e=>!e.includes(`|`)||!e.includes("`")?e:mf(e)).join(`
`)}function gf(e){return(e||``).replace(/\s+/g,` `).trim()}function _f(e,t,n={}){let r=n.cellLineSeparator??``;if(!e||!e.content||e.content.length===0)return``;let i=[];e.content.forEach(e=>{let n=[];e.content&&e.content.forEach(e=>{let i=``;i=e.content&&Array.isArray(e.content)&&e.content.length>1?e.content.map(e=>t.renderChildren(e)).join(r):e.content?t.renderChildren(e.content):``;let a=gf(i.split(r).join(`
`).replace(/[ \t]*\r?\n[ \t]*/g,`<br>`)),o=e.type===`tableHeader`,s=qd(e.attrs);n.push({text:a,isHeader:o,align:s})}),i.push(n)});let a=i.reduce((e,t)=>Math.max(e,t.length),0);if(a===0)return``;let o=Array.from({length:a}).fill(0);i.forEach(e=>{for(let t=0;t<a;t+=1){let n=(e[t]?.text||``).length;n>o[t]&&(o[t]=n),o[t]<3&&(o[t]=3)}});let s=(e,t)=>e+` `.repeat(Math.max(0,t-e.length)),c=i[0],l=c.some(e=>e.isHeader),u=Array.from({length:a}).fill(null);i.forEach(e=>{for(let t=0;t<a;t+=1)!u[t]&&e[t]?.align&&(u[t]=e[t].align)});let d=`
`,f=Array.from({length:a}).map((e,t)=>l&&c[t]&&c[t].text||``);return d+=`| ${f.map((e,t)=>s(e,o[t])).join(` | `)} |\n`,d+=`| ${o.map((e,t)=>{let n=Math.max(3,e),r=u[t];return r===`left`?`:${`-`.repeat(n)}`:r===`right`?`${`-`.repeat(n)}:`:r===`center`?`:${`-`.repeat(n)}:`:`-`.repeat(n)}).join(` | `)} |\n`,(l?i.slice(1):i).forEach(e=>{d+=`| ${Array.from({length:a}).fill(0).map((t,n)=>s(e[n]&&e[n].text||``,o[n])).join(` | `)} |\n`}),d}var vf=D.create({name:`table`,addOptions(){return{HTMLAttributes:{},resizable:!1,renderWrapper:!1,handleWidth:5,cellMinWidth:25,View:of,lastColumnResizable:!0,allowTableNodeSelection:!1}},content:`tableRow+`,tableRole:`table`,isolating:!0,group:`block`,parseHTML(){return[{tag:`table`}]},renderHTML({node:e,HTMLAttributes:t}){let{colgroup:n,tableWidth:r,tableMinWidth:i}=sf(e,this.options.cellMinWidth),a=t.style;function o(){return a||(r?`width: ${r}`:`min-width: ${i}`)}let s=[`table`,w(this.options.HTMLAttributes,t,{style:o()}),n,[`tbody`,0]];return this.options.renderWrapper?[`div`,{class:`tableWrapper`},s]:s},parseMarkdown:(e,t)=>{let n=[],r=Array.isArray(e.align)?e.align:[];if(e.header){let i=[];e.header.forEach((e,n)=>{let a=Gd(r[n]??e.align),o=a?{align:a}:{};i.push(t.createNode(`tableHeader`,o,[{type:`paragraph`,content:t.parseInline(e.tokens)}]))}),n.push(t.createNode(`tableRow`,{},i))}return e.rows&&e.rows.forEach(e=>{let i=[];e.forEach((e,n)=>{let a=Gd(r[n]??e.align),o=a?{align:a}:{};i.push(t.createNode(`tableCell`,o,[{type:`paragraph`,content:t.parseInline(e.tokens)}]))}),n.push(t.createNode(`tableRow`,{},i))}),t.createNode(`table`,void 0,n)},renderMarkdown:(e,t)=>_f(e,t),markdownTokenizer:{name:`table`,level:`block`,start:e=>{let t=e.split(`
`);if(t.length<2)return-1;let n=t[1];return!/^[ \t|:]*-[ \t|:-]*$/.test(n)||!n.includes(`|`)?-1:t[0].includes(`|`)?0:-1},tokenize(e,t,n){let r=e.indexOf(`

`),i=r>=0?e.slice(0,r):e,a=i.split(`
`);if(a.length<2)return;let o=a[1];if(!/^[ \t|:]*-[ \t|:-]*$/.test(o)||!o.includes(`|`))return;let s=hf(i);if(s===i)return;let c=n.blockTokens(s)[0];if(c?.type!==`table`||!c.raw)return;let l=c.raw.split(`
`).length,u=e.split(`
`).slice(0,l).join(`
`);return{...c,raw:u}}},addCommands(){return{insertTable:({rows:e=3,cols:t=3,withHeaderRow:n=!0}={})=>({tr:r,dispatch:i,editor:a})=>{let o=uf(a.schema,e,t,n);if(i){let e=r.selection.from+1;r.replaceSelectionWith(o).scrollIntoView().setSelection(E.near(r.doc.resolve(e)))}return!0},addColumnBefore:()=>({state:e,dispatch:t})=>Bu(e,t),addColumnAfter:()=>({state:e,dispatch:t})=>Vu(e,t),deleteColumn:()=>({state:e,dispatch:t})=>{let n=be(e.selection.$from,e=>e.type.name===`table`);return Uu(e,t&&(e=>{n&&pf(e,n.pos),t(e)}))},addRowBefore:()=>({state:e,dispatch:t})=>Ku(e,t),addRowAfter:()=>({state:e,dispatch:t})=>qu(e,t),deleteRow:()=>({state:e,dispatch:t})=>{let n=be(e.selection.$from,e=>e.type.name===`table`);return Yu(e,t&&(e=>{n&&pf(e,n.pos),t(e)}))},deleteTable:()=>({state:e,dispatch:t})=>cd(e,t),mergeCells:()=>({state:e,dispatch:t})=>Qu(e,t),splitCell:()=>({state:e,dispatch:t})=>$u(e,t),toggleHeaderColumn:()=>({state:e,dispatch:t})=>id(`column`)(e,t),toggleHeaderRow:()=>({state:e,dispatch:t})=>id(`row`)(e,t),toggleHeaderCell:()=>({state:e,dispatch:t})=>ad(e,t),mergeOrSplit:()=>({state:e,dispatch:t})=>Qu(e,t)?!0:$u(e,t),setCellAttribute:(e,t)=>({state:n,dispatch:r})=>td(e,t)(n,r),goToNextCell:()=>({state:e,dispatch:t})=>sd(1)(e,t),goToPreviousCell:()=>({state:e,dispatch:t})=>sd(-1)(e,t),fixTables:()=>({state:e,dispatch:t})=>(t&&Iu(e),!0),setCellSelection:e=>({tr:t,dispatch:n})=>{if(n){let n=J.create(t.doc,e.anchorCell,e.headCell);t.setSelection(n)}return!0}}},addKeyboardShortcuts(){return{Tab:()=>this.editor.commands.goToNextCell()?!0:this.editor.can().addRowAfter()?this.editor.chain().addRowAfter().goToNextCell().run():!1,"Shift-Tab":()=>this.editor.commands.goToPreviousCell(),Backspace:ff,"Mod-Backspace":ff,Delete:ff,"Mod-Delete":ff}},addProseMirrorPlugins(){return[...this.options.resizable&&this.editor.isEditable?[Ad({handleWidth:this.options.handleWidth,cellMinWidth:this.options.cellMinWidth,defaultCellMinWidth:this.options.cellMinWidth,View:this.options.View,lastColumnResizable:this.options.lastColumnResizable})]:[],Wd({allowTableNodeSelection:this.options.allowTableNodeSelection})]},addNodeView(){let e=this.options.resizable&&this.editor.isEditable,t=this.options.View;return e||!t?null:({node:e,view:n,HTMLAttributes:r})=>{let i=w(this.options.HTMLAttributes,r);return new t(e,this.options.cellMinWidth,n,i)}},extendNodeSchema(e){let t={name:e.name,options:e.options,storage:e.storage};return{tableRole:et(St(e,`tableRole`,t))}}});S.create({name:`tableKit`,addExtensions(){let e=[];return this.options.table!==!1&&e.push(vf.configure(this.options.table)),this.options.tableCell!==!1&&e.push(ef.configure(this.options.tableCell)),this.options.tableHeader!==!1&&e.push(tf.configure(this.options.tableHeader)),this.options.tableRow!==!1&&e.push(nf.configure(this.options.tableRow)),e}});var yf=nf;function bf(e){let t=typeof e.assetUid==`string`?e.assetUid:``;if(!H(t))return null;let n=[`asset`,`custom`,`decorative`,`missing`].includes(String(e.altMode))?e.altMode:`asset`,r=[`default`,`small`,`medium`,`large`,`full`].includes(String(e.size))?e.size:`default`,i=null;if(e.link&&typeof e.link==`object`){let t=e.link;i=Vi(t)}return{assetUid:t,siteMode:e.siteMode===`fixed`?`fixed`:`current`,siteUid:typeof e.siteUid==`string`?e.siteUid:null,altMode:n,alt:typeof e.alt==`string`?e.alt:null,title:typeof e.title==`string`?e.title:null,size:r,link:i,imageUid:typeof e.imageUid==`string`?e.imageUid:null}}function xf(){return D.create({name:`image`,group:`block`,atom:!0,draggable:!0,selectable:!0,addAttributes(){return{assetUid:{default:null},siteMode:{default:`current`},siteUid:{default:null},altMode:{default:`asset`},alt:{default:null},title:{default:null},size:{default:`default`},link:{default:null},imageUid:{default:null,rendered:!1}}},parseHTML(){return[{tag:`img[data-asset-uid]`,getAttrs:e=>{let t=e.getAttribute(`data-asset-uid`);return!t||!H(t)?!1:bf({assetUid:t})}}]},renderHTML({node:e}){let t=bf(e.attrs);if(!t)return[`span`,{class:`vizy-image-invalid`,"data-vizy-image":`invalid`,contenteditable:`false`},`Image requires asset`];let n=Oa(t.assetUid),r=t.altMode===`decorative`?``:t.alt??`Asset ${t.assetUid.slice(0,8)}`;return n?.url?[`figure`,{class:`vizy-image`,"data-asset-uid":t.assetUid,"data-size":t.size,contenteditable:`false`},[`img`,w({src:n.url,alt:r,title:t.title??void 0,draggable:`false`})]]:[`figure`,{class:`vizy-image vizy-image--pending`,"data-asset-uid":t.assetUid,"data-size":t.size,contenteditable:`false`},[`span`,w({class:`vizy-image-placeholder`,role:`img`,"aria-label":r||`Image`}),r||`Image`]]},addNodeView(){return({node:e})=>{let t=bf(e.attrs),n=document.createElement(`figure`);n.className=`vizy-image`,n.contentEditable=`false`,t&&(n.dataset.assetUid=t.assetUid,n.dataset.size=t.size);let r=``,i=e=>{let t=bf(e.attrs),i=n.classList.contains(`ProseMirror-selectednode`);if(!t){r=``,n.replaceChildren(),n.className=`vizy-image vizy-image-invalid`,n.textContent=`Image requires asset`;return}let a=Oa(t.assetUid),o=t.altMode===`decorative`?``:t.alt??`Asset ${t.assetUid.slice(0,8)}`,s=[t.assetUid,t.size,t.altMode,t.alt??``,t.title??``,a?.url??``].join(`\0`);if(s===r){n.className=i?`vizy-image ProseMirror-selectednode`:`vizy-image`;return}if(r=s,n.replaceChildren(),n.className=i?`vizy-image ProseMirror-selectednode`:`vizy-image`,n.dataset.assetUid=t.assetUid,n.dataset.size=t.size,a?.url){let e=document.createElement(`img`);e.src=a.url,e.alt=o,t.title&&(e.title=t.title),e.draggable=!1,n.append(e)}else{n.classList.add(`vizy-image--pending`);let e=document.createElement(`span`);e.className=`vizy-image-placeholder`,e.setAttribute(`role`,`img`),e.setAttribute(`aria-label`,o||`Image`),e.textContent=o||`Image`,n.append(e)}},a=e,o=t?.assetUid??``,s=Ea(o,()=>i(a));return i(e),{dom:n,ignoreMutation:e=>e.type!==`selection`,destroy:()=>s(),update:e=>{if(e.type.name!==`image`)return!1;a=e;let t=String(e.attrs.assetUid??``);return t!==o&&(s(),o=t,s=Ea(t,()=>i(a))),i(e),!0},selectNode:()=>{n.classList.add(`ProseMirror-selectednode`)},deselectNode:()=>{n.classList.remove(`ProseMirror-selectednode`)}}}},addCommands(){return{setSemanticImage:e=>({chain:t,state:n})=>{let r=bf(e);if(!r)return!1;let{$from:i}=n.selection,a=i.parent;return a.type.name===`paragraph`&&a.content.size===0?t().insertContentAt({from:i.before(),to:i.after()},{type:this.name,attrs:r}).run():t().insertContent({type:this.name,attrs:r}).run()}}}})}var Sf=new Set([`entry`,`asset`,`category`,`url`,`email`,`tel`,`sms`,`unknown`]);function Cf(e){return typeof e==`string`&&e!==``?e:null}function wf(e){return Array.isArray(e)?e.filter(e=>typeof e==`string`):typeof e==`string`&&e.trim()!==``?e.split(/\s+/):[]}function Tf(e){return Bi({type:Sf.has(e.type)?e.type:`url`,targetUid:Cf(e.targetUid),siteMode:e.siteMode===`fixed`?`fixed`:`current`,siteUid:Cf(e.siteUid),value:Cf(e.value),suffix:Cf(e.suffix),newWindow:e.newWindow===!0,title:Cf(e.title),ariaLabel:Cf(e.ariaLabel),rel:wf(e.rel),class:Cf(e.class),id:Cf(e.id),download:e.download===!0||typeof e.download==`string`?e.download:null,linkUid:Cf(e.linkUid)})}function Ef(){return Ee.create({name:`link`,priority:1e3,inclusive:!0,keepOnSplit:!1,addAttributes(){return{type:{default:`url`},targetUid:{default:null},siteMode:{default:`current`},siteUid:{default:null},value:{default:null},suffix:{default:null},newWindow:{default:!1},title:{default:null},ariaLabel:{default:null},rel:{default:[]},class:{default:null},id:{default:null},download:{default:null},linkUid:{default:null,rendered:!1}}},parseHTML(){return[{tag:`a[href]`,getAttrs:e=>{let t=e.getAttribute(`href`);return!t||t.startsWith(`#vizy-link:`)?!1:Tf({type:`url`,value:t})}}]},renderHTML({mark:e}){let t=Tf(e.attrs),n=Ui(t),r={href:Fi(n)?n:`#`,"data-vizy-link-type":t.type};if(t.newWindow&&(r.target=`_blank`,r.rel=`noopener noreferrer`),t.title&&(r.title=t.title),t.ariaLabel&&(r[`aria-label`]=t.ariaLabel),t.class&&(r.class=t.class),t.id&&(r.id=t.id),t.rel.length){let e=t.rel.filter(e=>!t.newWindow||e.toLowerCase()!==`opener`);t.newWindow&&e.push(`noopener`,`noreferrer`),r.rel=[...new Set(e)].join(` `)}return[`a`,w(r),0]},addCommands(){return{setSemanticLink:e=>({chain:t})=>t().setMark(this.name,Tf(e)).setMeta(`preventAutolink`,!0).run(),toggleSemanticLink:e=>({editor:t,chain:n})=>t.isActive(this.name)?n().unsetMark(this.name).run():e?n().setMark(this.name,Tf(e)).setMeta(`preventAutolink`,!0).run():!1,unsetSemanticLink:()=>({chain:e})=>e().unsetMark(this.name).run()}}})}var Df=ef,Of=tf;function kf(e,t){if(!Array.isArray(e)||e.length!==t)return Wi(t);let n=e.map(e=>Number.parseInt(String(e),10));return n.some(e=>!Number.isInteger(e)||e<1)||n.reduce((e,t)=>e+t,0)!==1e3?Wi(t):n}function Af(e,t){let n=kf(e.attrs.columnWidths,t);return e.type.create({...e.attrs,columnWidths:n},e.content,e.marks)}function jf(){return vf.extend({addAttributes(){return{...this.parent?.(),columnWidths:{default:null,parseHTML:e=>{let t=e.getAttribute(`data-column-widths`);if(!t)return null;try{let e=JSON.parse(t);return Array.isArray(e)?e:null}catch{return null}},renderHTML:e=>e.columnWidths?{"data-column-widths":JSON.stringify(e.columnWidths)}:{}}}},addCommands(){return{...this.parent?.()??{},insertTable:({rows:e=3,cols:t=3,withHeaderRow:n=!0}={})=>({tr:r,dispatch:i,editor:a})=>{let o=Af(uf(a.schema,e,t,n),t);if(i){let e=r.selection.from+1;r.replaceSelectionWith(o).scrollIntoView().setSelection(E.near(r.doc.resolve(e)))}return!0}}},addProseMirrorPlugins(){return[...this.parent?.()??[],new C({appendTransaction:(e,t,n)=>{let r=n.tr,i=!1;return n.doc.descendants((e,t)=>{if(e.type.name!==`table`)return;let n=Ki(e);if(n<1)return;let a=kf(e.attrs.columnWidths,n),o=e.attrs.columnWidths,s=Array.isArray(o)?o.reduce((e,t)=>e+t,0):0;(!o||o.length!==n||s!==1e3)&&(r=r.setNodeMarkup(t,void 0,{...e.attrs,columnWidths:a}),i=!0)}),i?r:null}})]}})}function Mf(){return Df}function Nf(){return Of}function Pf(e){return typeof e!=`string`||!/^https?:\/\//i.test(e.trim())?null:Xa(e)}function Ff(){return D.create({name:`iframe`,group:`block`,atom:!0,draggable:!0,selectable:!0,addAttributes(){return{url:{default:null},frameborder:{default:0},allowfullscreen:{default:!0}}},parseHTML(){return[{tag:`iframe[src]`,getAttrs:e=>{let t=Xa(e.getAttribute(`src`)||``);return t?{url:t,frameborder:0,allowfullscreen:!0}:!1}}]},renderHTML({node:e}){let t=Pf(e.attrs.url);return t?[`iframe`,{src:t,frameborder:`0`,allowfullscreen:`true`,class:`vizy-iframe`}]:[`span`,{class:`vizy-iframe__empty`},`Iframe requires a valid URL`]},addNodeView(){return({node:e})=>{let t=document.createElement(`div`);t.className=`vizy-iframe`,t.contentEditable=`false`;let n,r=e=>{let r=t.classList.contains(`ProseMirror-selectednode`),i=Pf(e.attrs.url);if(t.className=r?`vizy-iframe ProseMirror-selectednode`:`vizy-iframe`,n===i)return;if(n=i,t.replaceChildren(),!i){let e=document.createElement(`p`);e.className=`vizy-iframe__empty`,e.textContent=`Iframe requires a URL`,t.append(e);return}let a=document.createElement(`iframe`);a.setAttribute(`sandbox`,`allow-scripts`),a.src=i,a.title=`Embedded content`,a.setAttribute(`frameborder`,`0`),a.allowFullscreen=!0,a.loading=`lazy`,a.referrerPolicy=`strict-origin-when-cross-origin`,a.style.pointerEvents=`none`,t.append(a)};return r(e),{dom:t,update:e=>e.type.name===`iframe`&&(r(e),!0),selectNode:()=>{t.classList.add(`ProseMirror-selectednode`)},deselectNode:()=>{t.classList.remove(`ProseMirror-selectednode`)}}}},addCommands(){return{setVizyIframe:e=>({chain:t,state:n})=>{let r=Xa(e.url);if(!r)return!1;let i={url:r,frameborder:0,allowfullscreen:!0},{$from:a}=n.selection,o=a.parent;return o.type.name===`paragraph`&&o.content.size===0?t().insertContentAt({from:a.before(),to:a.after()},{type:this.name,attrs:i}).run():t().insertContent({type:this.name,attrs:i}).run()}}}})}function If(){return D.create({name:`mediaEmbed`,group:`block`,atom:!0,draggable:!0,selectable:!0,addAttributes(){return{url:{default:null},data:{default:null}}},parseHTML(){return[{tag:`div[data-vizy-media-embed]`,getAttrs:e=>{let t=Za(e.getAttribute(`data-url`)||``);return t?{url:t.url,data:t.html?{html:t.html}:null}:!1}}]},renderHTML({node:e}){return[`div`,{"data-vizy-media-embed":``,"data-url":typeof e.attrs.url==`string`?e.attrs.url:``,class:`vizy-media-embed`}]},addNodeView(){return({node:e})=>{let t=document.createElement(`div`);t.className=`vizy-media-embed`,t.contentEditable=`false`;let n=``,r=e=>{let r=t.classList.contains(`ProseMirror-selectednode`),i=typeof e.attrs.url==`string`?e.attrs.url:``,a=Za(i)?.html??null,o=`${i}\0${a??``}`;if(o===n){t.className=r?`vizy-media-embed ProseMirror-selectednode`:`vizy-media-embed`;return}if(n=o,t.className=r?`vizy-media-embed ProseMirror-selectednode`:`vizy-media-embed`,t.replaceChildren(),a){let e=document.createElement(`div`);e.className=`vizy-media-embed__preview`,e.innerHTML=a,e.querySelectorAll(`iframe`).forEach(e=>{e.setAttribute(`sandbox`,`allow-scripts`),e.style.pointerEvents=`none`}),t.append(e);return}let s=document.createElement(`div`);s.className=`vizy-media-embed__card`,s.textContent=i||`Media embed requires a URL`,t.append(s)};return r(e),{dom:t,update:e=>e.type.name===`mediaEmbed`&&(r(e),!0),selectNode:()=>{t.classList.add(`ProseMirror-selectednode`)},deselectNode:()=>{t.classList.remove(`ProseMirror-selectednode`)}}}},addCommands(){return{setVizyMediaEmbed:e=>({chain:t,state:n})=>{let r=Za(e.url);if(!r)return!1;let i={url:r.url,data:r.html?{html:r.html}:null},{$from:a}=n.selection,o=a.parent;return o.type.name===`paragraph`&&o.content.size===0?t().insertContentAt({from:a.before(),to:a.after()},{type:this.name,attrs:i}).run():t().insertContent({type:this.name,attrs:i}).run()}}}})}var Lf=20,Rf=(e,t=0)=>{let n=[];return!e.children.length||t>Lf||Array.from(e.children).forEach(e=>{e.tagName===`SPAN`?n.push(e):e.children.length&&n.push(...Rf(e,t+1))}),n},zf=e=>{if(!e.children.length)return;let t=Rf(e);t&&t.forEach(e=>{var t;let n=e.getAttribute(`style`),r=(t=e.parentElement)==null||(t=t.closest(`span`))==null?void 0:t.getAttribute(`style`);e.setAttribute(`style`,`${r};${n}`)})},Bf=Ee.create({name:`textStyle`,priority:101,addOptions(){return{HTMLAttributes:{},mergeNestedSpanStyles:!0}},parseHTML(){return[{tag:`span`,consuming:!1,getAttrs:e=>e.hasAttribute(`style`)?(this.options.mergeNestedSpanStyles&&zf(e),{}):!1}]},renderHTML({HTMLAttributes:e}){return[`span`,w(this.options.HTMLAttributes,e),0]},addCommands(){return{toggleTextStyle:e=>({commands:t})=>t.toggleMark(this.name,e),removeEmptyTextStyle:()=>({tr:e})=>{let{selection:t}=e;return e.doc.nodesBetween(t.from,t.to,(t,n)=>{if(!t.isInline)return!0;t.marks.filter(e=>e.type===this.type).some(e=>Object.values(e.attrs).some(e=>!!e))||e.removeMark(n,n+t.nodeSize,this.type)}),!0}}}}),Vf=S.create({name:`backgroundColor`,addOptions(){return{types:[`textStyle`]}},addGlobalAttributes(){return[{types:this.options.types,attributes:{backgroundColor:{default:null,parseHTML:e=>(Se(e,`background-color`)??e.style.backgroundColor)?.replace(/['"]+/g,``),renderHTML:e=>e.backgroundColor?{style:`background-color: ${e.backgroundColor}`}:{}}}}]},addCommands(){return{setBackgroundColor:e=>({chain:t})=>t().setMark(`textStyle`,{backgroundColor:e}).run(),unsetBackgroundColor:()=>({chain:e})=>e().setMark(`textStyle`,{backgroundColor:null}).removeEmptyTextStyle().run()}}}),Hf=S.create({name:`color`,addOptions(){return{types:[`textStyle`]}},addGlobalAttributes(){return[{types:this.options.types,attributes:{color:{default:null,parseHTML:e=>(Se(e,`color`)??e.style.color)?.replace(/['"]+/g,``),renderHTML:e=>e.color?{style:`color: ${e.color}`}:{}}}}]},addCommands(){return{setColor:e=>({chain:t})=>t().setMark(`textStyle`,{color:e}).run(),unsetColor:()=>({chain:e})=>e().setMark(`textStyle`,{color:null}).removeEmptyTextStyle().run()}}}),Uf=S.create({name:`fontFamily`,addOptions(){return{types:[`textStyle`]}},addGlobalAttributes(){return[{types:this.options.types,attributes:{fontFamily:{default:null,parseHTML:e=>Se(e,`font-family`)??e.style.fontFamily,renderHTML:e=>e.fontFamily?{style:`font-family: ${e.fontFamily}`}:{}}}}]},addCommands(){return{setFontFamily:e=>({chain:t})=>t().setMark(`textStyle`,{fontFamily:e}).run(),unsetFontFamily:()=>({chain:e})=>e().setMark(`textStyle`,{fontFamily:null}).removeEmptyTextStyle().run()}}}),Wf=S.create({name:`fontSize`,addOptions(){return{types:[`textStyle`]}},addGlobalAttributes(){return[{types:this.options.types,attributes:{fontSize:{default:null,parseHTML:e=>Se(e,`font-size`)??e.style.fontSize,renderHTML:e=>e.fontSize?{style:`font-size: ${e.fontSize}`}:{}}}}]},addCommands(){return{setFontSize:e=>({chain:t})=>t().setMark(`textStyle`,{fontSize:e}).run(),unsetFontSize:()=>({chain:e})=>e().setMark(`textStyle`,{fontSize:null}).removeEmptyTextStyle().run()}}}),Gf=S.create({name:`lineHeight`,addOptions(){return{types:[`textStyle`]}},addGlobalAttributes(){return[{types:this.options.types,attributes:{lineHeight:{default:null,parseHTML:e=>Se(e,`line-height`)??e.style.lineHeight,renderHTML:e=>e.lineHeight?{style:`line-height: ${e.lineHeight}`}:{}}}}]},addCommands(){return{setLineHeight:e=>({chain:t})=>t().setMark(`textStyle`,{lineHeight:e}).run(),unsetLineHeight:()=>({chain:e})=>e().setMark(`textStyle`,{lineHeight:null}).removeEmptyTextStyle().run()}}});S.create({name:`textStyleKit`,addExtensions(){let e=[];return this.options.backgroundColor!==!1&&e.push(Vf.configure(this.options.backgroundColor)),this.options.color!==!1&&e.push(Hf.configure(this.options.color)),this.options.fontFamily!==!1&&e.push(Uf.configure(this.options.fontFamily)),this.options.fontSize!==!1&&e.push(Wf.configure(this.options.fontSize)),this.options.lineHeight!==!1&&e.push(Gf.configure(this.options.lineHeight)),this.options.textStyle!==!1&&e.push(Bf.configure(this.options.textStyle)),e}});var Kf=120,qf=160,Jf=`Missing Block Type`;function Yf(e,t){if(e==null)return null;let n=String(e).replace(/\s+/g,` `).trim();return n?n.length<=t?n:`${n.slice(0,t-1)}…`:null}function Xf(e,t){let n=e[t];return n==null?null:typeof n==`string`?n:typeof n==`number`||typeof n==`boolean`?String(n):null}function Zf(e,t){let n=e[t];return Array.isArray(n)&&n.length?n[0]:typeof n==`number`||typeof n==`string`?n:null}function Qf(e,t,n,r,i){let a=t?[t,...n.filter(e=>e!==t)]:[...n];for(let t of a){let n=Yf(Xf(e,t),i);if(n)return n}return Yf(r,i)??r}function $f(e){let t=!!e.type,n=e.type?.name??Jf,r=e.inference??{titlePlacementUids:[],subtitlePlacementUids:[],mediaPlacementUids:[]},i=t?Qf(e.fieldSlots,e.explicitTitlePlacementUid,r.titlePlacementUids,n,Kf):Jf,a=t?Yf(Qf(e.fieldSlots,e.explicitSubtitlePlacementUid,r.subtitlePlacementUids,``,qf)||null,qf):null,o=e.explicitMediaPlacementUid??r.mediaPlacementUids[0]??null,s=o?Zf(e.fieldSlots,o):null;return{blockUid:e.blockUid,blockTypeUid:e.blockTypeUid,typeName:n,title:i,subtitle:a||null,media:s==null?null:{kind:`asset`,reference:s,alt:null,thumbnailUrl:null},enabled:e.enabled,resolved:t,errorCount:e.validation?.errorCount??0,descendantErrorCount:e.validation?.descendantErrorCount??0,revision:e.revision}}function ep(e,t){let n=null;return e.state.doc.descendants((e,r)=>e.type.name===`vizyBlock`&&String(e.attrs.blockUid)===t?(n=r,!1):n===null),n}function tp(e,t){let n=ep(e,t);if(n==null)return null;let r=e.state.doc.nodeAt(n);return!r||r.type.name!==`vizyBlock`?null:{node:r,pos:n}}function np(e,t){return tp(e,t)?{kind:`root`}:null}function rp(e,t,n){let r=[],i=(e,t)=>{if(e.type!==`vizyBlock`){let n=e.content;if(Array.isArray(n))for(let e of n)e&&typeof e==`object`&&i(e,t);return}let a=e.attrs??{},o=String(a.blockUid??``),s=String(a.blockTypeUid??``),c=n.blockTypes[s];o&&c?.fieldLayoutUid&&r.push({blockUid:o,blockTypeUid:s,block:e,destination:t})};return i(e,t),r}async function ip(e,t,n){n?.flushMountedFields?.();let r=tp(e,t);if(!r)return!1;let i=zs(r.node.toJSON(),void 0,n?.manifest.blockTypes),a=String(i.attrs?.blockUid??``);if(!a)return!1;if(n){let r=np(e,t)??{kind:`root`},a=n.documentRevision(),o=rp(i,r,n.manifest).map(e=>({...e,documentRevision:a}));if(o.length)try{await n.prefetchNewBlocks(o)}catch{}}let o=tp(e,t);if(!o)return!1;let s=e.schema.nodeFromJSON(i),c=o.pos+o.node.nodeSize;return e.view.dispatch(e.state.tr.insert(c,s).scrollIntoView()),(n?.animateInsert??qt)(a),!0}function ap(e,t){let n=tp(e,t);return n?(e.view.dispatch(e.state.tr.delete(n.pos,n.pos+n.node.nodeSize).scrollIntoView()),!0):!1}function op(e,t){let n=tp(e,t);if(!n)return!1;let r=!n.node.attrs.enabled;return e.view.dispatch(e.state.tr.setNodeMarkup(n.pos,void 0,{...n.node.attrs,enabled:r}).scrollIntoView()),!0}function sp(e,t,n){let r=tp(e,t);if(!r)return!1;let i=e.state.doc.resolve(r.pos),a=i.parent,o=i.index(),s=o+n;if(s<0||s>=a.childCount)return!1;let c=n<0?r.pos-a.child(o-1).nodeSize:r.pos+r.node.nodeSize+a.child(o+1).nodeSize,l=new j(M.from(r.node),0,0),u=e.state.tr.delete(r.pos,r.pos+r.node.nodeSize),d=u.mapping.map(c);return u=u.replaceRange(d,d,l),e.view.dispatch(u.scrollIntoView()),!0}function cp(e,t,n){let r=tp(e,n);if(!r)return[];let i=t.buildContext(`inline`,r.pos);return i?t.query({context:i,kinds:[`block`]}).filter(e=>!e.item.requiresInput):[]}function lp(e,t,n){let r=cp(e,t,n);return r.length===1?`Add ${r[0].item.label} above`:`Add Block above`}var up=new WeakSet;function dp(e){up.add(e),e.draggable=!0}function fp(e){up.delete(e),e.draggable=!1,e.removeAttribute(`draggable`)}function pp(e){return up.has(e)}var mp=null,hp=0;function gp(e){let t=new Map,n=e.parentElement;if(n)for(let e of Array.from(n.children)){if(!(e instanceof HTMLElement)||e.localName!==`vizy-block`)continue;let n=e.getAttribute(`data-block-uid`);if(!n)continue;let r=e.getBoundingClientRect();t.set(n,{top:r.top,left:r.left})}let r=e.getAttribute(`data-block-uid`);if(r&&!t.has(r)){let n=e.getBoundingClientRect();t.set(r,{top:n.top,left:n.left})}mp=t,hp+=1}function _p(){mp=null}function vp(){let e=mp,t=hp;if(!e?.size||Kt()){mp=null;return}if(typeof document>`u`){mp=null;return}mp=null;let n=()=>{if(t===hp)for(let[t,n]of e){let e=document.querySelector(`vizy-block[data-block-uid="${CSS.escape(t)}"]`);if(!e||typeof e.animate!=`function`)continue;let r=e.getBoundingClientRect(),i=n.left-r.left,a=n.top-r.top;Math.abs(i)<1&&Math.abs(a)<1||e.animate([{transform:`translate(${i}px, ${a}px)`},{transform:`translate(0px, 0px)`}],{duration:Gt.duration,easing:Gt.easing,fill:`backwards`})}};requestAnimationFrame(()=>{requestAnimationFrame(n)})}function yp(e){if(e.type.name!==`vizyBlock`)return null;let t=e.attrs.blockUid;return t==null?null:String(t)}function bp(e,t){let n=null;return e.descendants((e,r)=>e.type.name===`vizyBlock`&&String(e.attrs.blockUid)===t?(n={node:e,from:r},!1):!n),n}var xp=null;function Sp(e){xp=e}function Cp(){xp=null}function wp(e){if(!xp)return null;let t=bp(e.state.doc,xp.uid);return t?{...xp,from:t.from,to:t.from+t.node.nodeSize,node:t.node}:null}function Tp(e){let t=e.dragging;if(t?.move){let n=t.node;if(n instanceof A){let e=n.node,t=yp(e);return t?{uid:t,blockTypeUid:String(e.attrs.blockTypeUid),from:n.from,to:n.from+e.nodeSize,node:e}:null}let r=t.slice?.content.firstChild,i=r?yp(r):null;if(!i||!r)return null;let a=bp(e.state.doc,i);return a?{uid:i,blockTypeUid:String(r.attrs.blockTypeUid),from:a.from,to:a.from+a.node.nodeSize,node:r}:null}return wp(e)}function Ep(e,t,n){let r=t;if(n){let t=vt(e,r,n);t!=null&&(r=t)}return r}function Dp(e,t){let n=e.resolve(t.from),r=n.depth;if(n.parent.type.name!==`doc`&&n.parent.type.name!==`column`){r=0;for(let e=n.depth;e>0;--e)if(n.node(e).type.name===`column`){r=e;break}}let i=n.node(r),a=n.start(r),o=[];return i.forEach((e,t)=>{let n=a+t;o.push({from:n,to:n+e.nodeSize})}),o}function Op(e,t,n){let r=Dp(e.state.doc,n);if(r.length===0)return null;let i=[];for(let t of r){let n=e.nodeDOM(t.from);if(!(n instanceof HTMLElement))continue;let r=n.getBoundingClientRect(),a=r.bottom-r.top;i.push({from:t.from,to:t.to,midY:(r.top+r.bottom)/2,height:a})}if(i.length===0||i.every(e=>e.height<=0))return null;for(let e of i)if(t<e.midY)return e.from;return i[i.length-1].to}function kp(e,t,n,r){let i=Op(e,n,r);if(i!=null)return i;let a=e.posAtCoords({left:t,top:n});return a?Ep(e.state.doc,a.pos,e.dragging?.slice??null):null}function Ap(e,t,n){if(n===t.from||n===t.to)return!1;let r=t.to-t.from,i=e.state.tr;i.delete(t.from,t.to);let a=n<=t.from?n:n-r;i.insert(a,t.node);try{i.setSelection(A.create(i.doc,a))}catch{}return e.dispatch(i.scrollIntoView()),!0}function jp(e,t){let n=e.resolve(t);if(n.parent.type.name===`doc`)return`root`;if(n.parent.type.name===`column`)return`column:${String(n.parent.attrs.columnUid??n.depth)}`;for(let e=n.depth;e>0;--e){let t=n.node(e);if(t.type.name===`column`)return`column:${String(t.attrs.columnUid??e)}`}return`root`}function Mp(e,t,n){let r=jp(e,t.from),i=jp(e,n);return r!=null&&i!=null&&r===i}function Np(e,t,n){if(n>t.from&&n<t.to)return!0;let r=e.resolve(n);for(let e=r.depth;e>0;--e){let n=r.node(e);if(n.type.name===`vizyBlock`&&String(n.attrs.blockUid)===t.uid)return!0}return!1}function Pp(e,t){let n=e.resolve(t).parent;return n.type.name===`doc`||n.type.name===`column`}function Fp(e,t,n,r){return Pp(t,n)?e.field.rootContentType===`blocks`?e.field.allowedBlockTypeUids.includes(r):e.field.allowedBlockTypeUids.includes(r)||e.field.insertableBlockTypeUids.includes(r):!1}function Ip(e,t,n){let r=Tp(e);return!r||!(Np(e.state.doc,r,t)||!Mp(e.state.doc,r,t)||!Fp(n,e.state.doc,t,r.blockTypeUid)||!xt(e.state.doc,t,r.blockTypeUid,Ue(n)))}function Lp(e){let t=document.createElement(`div`);return t.className=`vizy-block-drag-ghost`,t.textContent=e,t.setAttribute(`aria-hidden`,`true`),Object.assign(t.style,{position:`fixed`,top:`-1000px`,left:`-1000px`,pointerEvents:`none`}),document.body.append(t),t}function Rp(e,t){let n=Lp(t);return e.dataTransfer?.setDragImage(n,16,14),()=>n.remove()}function zp(e,t){let n=A.create(e.state.doc,t);e.state.selection.eq(n)||e.dispatch(e.state.tr.setSelection(n))}function Bp(e){return e.composedPath().some(e=>e instanceof HTMLElement&&(e.matches(`[data-vizy-drag-handle]`)||e.closest?.(`[data-vizy-drag-handle]`)!=null))}function Vp(e,t){let n=null,r=null,i=!1,a=r=>{let a=t.getView(),o=t.getPos();if(o==null||!r.dataTransfer){r.preventDefault(),i=!1,fp(e);return}zp(a,o);let s=A.create(a.state.doc,o),c=s.content(),{dom:l,text:u,slice:d}=a.serializeForClipboard(c);r.dataTransfer.clearData(),r.dataTransfer.setData(`text/html`,l.innerHTML),r.dataTransfer.setData(`text/plain`,u),r.dataTransfer.effectAllowed=`copyMove`,a.dragging={slice:d,move:!0,node:s},Sp({uid:String(s.node.attrs.blockUid),blockTypeUid:String(s.node.attrs.blockTypeUid),from:s.from,to:s.from+s.node.nodeSize,node:s.node}),n?.(),n=Rp(r,t.getLabel()),gp(e),t.onDragChange(!0),r.stopPropagation()},o=n=>{if(n.button!==0)return;let r=t.getPos();r!=null&&(i=!0,dp(e),zp(t.getView(),r))},s=t=>{if(t.target===e){if(!(i||Bp(t))){t.preventDefault(),t.stopPropagation();return}a(t)}},c=()=>{i=!1,fp(e),n?.(),n=null,t.onDragChange(!1);try{t.getView().dragging=null}catch{}window.setTimeout(()=>{_p(),Cp()},100)},l=()=>{if(i){try{if(t.getView().dragging)return}catch{}i=!1,fp(e)}},u=()=>{let t=e.shadowRoot?.querySelector(`[data-vizy-drag-handle]`)??null;t!==r&&(r?.removeEventListener(`mousedown`,o),r=t,r?.addEventListener(`mousedown`,o))};e.addEventListener(`dragstart`,s,{capture:!0}),e.addEventListener(`dragend`,c),window.addEventListener(`pointerup`,l,!0),fp(e),u();let d=e.shadowRoot?new MutationObserver(()=>u()):null;return d?.observe(e.shadowRoot,{childList:!0,subtree:!0}),()=>{d?.disconnect(),r?.removeEventListener(`mousedown`,o),e.removeEventListener(`dragstart`,s,{capture:!0}),e.removeEventListener(`dragend`,c),window.removeEventListener(`pointerup`,l,!0),c()}}function Hp(e,t){return e.composedPath().includes(t)}var Up=class{dom;#e;#t;#n;#r;#i;#a;#o=!1;#s=null;#c=null;constructor(e,t){this.#a=e.node,this.#t=t,this.#n=e.editor,this.#i=e.getPos,this.#r=String(e.node.attrs.blockUid);let n=String(e.node.attrs.blockTypeUid),r=t.manifest.blockTypes[n],i=t.hosts.acquire(this.#r,n,r?.fieldLayoutUid??null,r?.fieldLayoutHash??null),a=t.ui.get(this.#r);this.dom=document.createElement(`vizy-block`),this.dom.blockUid=this.#r,this.dom.setAttribute(`data-block-uid`,this.#r),r?.color&&(this.dom.style.setProperty(`--vizy-block-accent-color`,r.color),this.dom.accentColor=r.color),r?.iconSvg&&(this.dom.typeIconSvg=r.iconSvg);let o=!!e.node.attrs.enabled;this.dom.enabled=o,this.dom.disabled=!o,this.dom.collapsed=!o||a.collapsed,!o&&!a.collapsed&&t.ui.update(this.#r,{collapsed:!0});let s=a.summary??$f({blockUid:this.#r,blockTypeUid:n,enabled:!!e.node.attrs.enabled,fieldSlots:e.node.attrs.fieldSlots??{},type:r,inference:r?.summaryInference,revision:t.blockRevision(this.#r),explicitTitlePlacementUid:r?.summary?.titlePlacementUid,explicitSubtitlePlacementUid:r?.summary?.subtitlePlacementUid,explicitMediaPlacementUid:r?.summary?.mediaPlacementUid});a.summary||t.ui.update(this.#r,{summary:s}),this.dom.applySummary(s),this.#d(),this.dom.expectsFieldLayout=!!r?.fieldLayoutUid,r?.layoutTabLabels?.length&&(this.dom.layoutTabLabels=r.layoutTabLabels),this.#e=document.createElement(`div`),this.#e.dataset.vizyBlockContent=``,this.#e.slot=`layout`,this.#e.append(i.root),this.dom.append(this.#e),this.dom.addEventListener(`vizy-collapse-change`,this.#f),this.dom.addEventListener(`vizy-edit-fields`,this.#p),this.dom.addEventListener(`vizy-block-action`,this.#h),this.dom.addEventListener(`vizy-block-header-activate`,this.#m),queueMicrotask(()=>{this.#o||this.#g()}),r?.fieldLayoutUid&&(this.#s=t.observeFieldViewport(this.dom)),this.dom.draggable=!1,queueMicrotask(()=>{this.#o||(this.#c=Vp(this.dom,{getPos:()=>this.#i(),getLabel:()=>this.dom.typeName||`Block`,getView:()=>this.#n.view,onDragChange:e=>{this.dom.dragging=e,this.#t.ui.update(this.#r,{view:{dragging:e}})}}))})}#l=!1;#u(){pp(this.dom)||(this.dom.draggable=!1,this.dom.removeAttribute(`draggable`),!this.#l&&(this.#l=!0,queueMicrotask(()=>{this.#l=!1,!this.#o&&(pp(this.dom)||(this.dom.draggable=!1,this.dom.removeAttribute(`draggable`)))})))}#d(){let e=this.#t.hosts.get(this.#r),t=e?.status,n=t===`mounted`?`mounted`:t===`loading`?`loading`:t===`failed`?`error`:`unmounted`;this.#t.ui.get(this.#r).view.fieldLayout=n,this.dom.fieldLayoutState=n,this.dom.fieldLayoutError=t===`failed`?e?.errorMessage??null:null,(t===`mounted`||t===`failed`)&&(this.dom.fieldLayoutRetrying=!1)}#f=e=>{if(e.target!==this.dom)return;e.stopPropagation();let t=e.detail.collapsed;this.#t.ui.update(this.#r,{collapsed:t}),e.detail.persist!==!1&&(t?Ro(this.#r):zo(this.#r))};#p=e=>{e.target===this.dom&&(e.stopPropagation(),this.#t.ui.update(this.#r,{editingFields:!0}),this.#t.openFields(this.#r))};#m=e=>{if(e.target!==this.dom)return;e.stopPropagation();let t=this.#i();if(t!=null)try{zp(this.#n.view,t),Wt(Pt(this.#n.view.dom),()=>{Ut(this.#n,{force:!0})})}catch{}};#h=e=>{if(e.target!==this.dom)return;e.stopPropagation();let{action:t,invoker:n}=e.detail,r=this.#n;switch(t){case`duplicate`:this.#t.suspendInsertionSideEffects?.(),this.#t.duplicateBlock(this.#r).finally(()=>{this.#t.resumeInsertionSideEffects?.(),this.#t.refreshSummaries()});return;case`delete`:if(this.#t.manifest.field.confirmBlockDeletion===!0){let e=window.Craft?.t?.(`vizy`,`Delete this block?`)??`Delete this block?`;if(!window.confirm(e))break}zo(this.#r),ap(r,this.#r);break;case`toggleEnabled`:op(r,this.#r);break;case`moveUp`:sp(r,this.#r,-1);break;case`moveDown`:sp(r,this.#r,1);break;case`addAbove`:{let e=n??this.dom.shadowRoot?.querySelector(`[part="menu-trigger"]`)??null;e&&this.#t.openAddBlockAbove?.(this.#r,e);break}}this.#t.refreshSummaries()};update(e){if(e.type!==this.#a.type||String(e.attrs.blockUid)!==this.#r||String(e.attrs.blockTypeUid)!==String(this.#a.attrs.blockTypeUid))return!1;this.#a=e;let t=this.#t.ui.get(this.#r);return this.dom.enabled=!!e.attrs.enabled,this.dom.disabled=!e.attrs.enabled,this.dom.applySummary(t.summary),this.#d(),this.#g(),this.#u(),!0}#g(){let e=this.#t.insertion;if(!e?.buildContext){this.dom.canAddAbove=!1,this.dom.addAboveLabel=`Add Block above`;return}let t=cp(this.#n,e,this.#r);this.dom.canAddAbove=t.length>0,this.dom.addAboveLabel=lp(this.#n,e,this.#r)}selectNode(){this.dom.selected=!0,this.#t.ui.update(this.#r,{view:{selected:!0}}),this.#u()}deselectNode(){this.dom.selected=!1,this.#t.ui.update(this.#r,{view:{selected:!1}}),this.#u()}stopEvent(e){let t=this.dom.shadowRoot?.querySelector(`[data-vizy-drag-handle]`);return t&&Hp(e,t)?!1:this.#t.hosts.roots(this.#r).some(t=>Hp(e,t))||(this.dom.shadowRoot?e.composedPath().includes(this.dom.shadowRoot):!1)}ignoreMutation(e){return e.type!==`selection`}destroy(){this.#o||(this.#o=!0,this.#s?.(),this.#s=null,this.#c?.(),this.#c=null,this.dom.removeEventListener(`vizy-collapse-change`,this.#f),this.dom.removeEventListener(`vizy-edit-fields`,this.#p),this.dom.removeEventListener(`vizy-block-action`,this.#h),this.dom.removeEventListener(`vizy-block-header-activate`,this.#m),this.#t.hosts.releaseView(this.#r))}};function Wp(e){return D.create({name:`vizyBlock`,group:`block`,content:``,defining:!0,isolating:!0,selectable:!0,draggable:!0,addAttributes:()=>({blockUid:{default:null,rendered:!1},blockTypeUid:{default:null,rendered:!1},enabled:{default:!0,rendered:!1},fieldSlots:{default:{},rendered:!1},matrixAnchorUid:{default:null,rendered:!1}}),parseHTML:()=>[],renderHTML:({HTMLAttributes:e})=>[`vizy-block`,w(e)],addNodeView:()=>t=>new Up(t,e())})}function Gp(e,t,n){if(e.type===`selection`)return!1;let r=e.target;return!(r instanceof globalThis.Node)||r===t||t.shadowRoot?.contains(r)?!0:!n.contains(r)}var Kp=class{dom;contentDOM;#e;#t;constructor(e,t){this.#e=e.getPos,this.#t=t,this.dom=document.createElement(`vizy-layout`),this.dom.layoutUid=String(e.node.attrs.layoutUid),this.dom.stack=String(e.node.attrs.stack??`small`),this.contentDOM=document.createElement(`div`),this.contentDOM.className=`vizy-layout-columns`,this.contentDOM.slot=`columns`,this.contentDOM.style.display=`grid`,this.contentDOM.style.gridTemplateColumns=`repeat(12, minmax(0, 1fr))`,this.contentDOM.style.gap=`0.75rem`,this.contentDOM.style.width=`100%`,this.contentDOM.style.minHeight=`0`,this.contentDOM.style.alignItems=`start`,this.contentDOM.style.boxSizing=`border-box`,this.dom.append(this.contentDOM),this.#n(e.node)}#n(e){this.dom.layoutUid=String(e.attrs.layoutUid),this.dom.stack=String(e.attrs.stack??`small`);let t=[],n=[];for(let r=0;r<e.childCount;r++){let i=e.child(r);t.push(Number(i.attrs.span??12)),n.push(String(i.attrs.columnUid??``))}this.dom.columnSpans=t,this.dom.columnUids=n;let r=this.#t().editor;r&&(this.dom.editor=r,this.dom.layoutPos=this.#e()??null)}update(e){return e.type.name===`layout`&&(this.#n(e),!0)}ignoreMutation(e){return Gp(e,this.dom,this.contentDOM)}},qp=class{dom;contentDOM;constructor(e){this.dom=document.createElement(`vizy-column`),this.contentDOM=document.createElement(`div`),this.contentDOM.slot=`content`,this.dom.append(this.contentDOM),this.#e(e.node)}#e(e){this.dom.columnUid=String(e.attrs.columnUid),this.dom.span=Number(e.attrs.span??12),this.dom.style.gridColumn=`span ${Math.min(12,Math.max(1,this.dom.span))}`;let t=this.dom.closest(`vizy-layout`);if(t){let e=t.columnUids??[];this.dom.columnIndex=e.indexOf(this.dom.columnUid),this.dom.columnCount=e.length}}update(e){return e.type.name===`column`&&(this.#e(e),!0)}ignoreMutation(e){return Gp(e,this.dom,this.contentDOM)}};function Jp(e){return D.create({name:`layout`,group:`block`,content:`column+`,defining:!0,isolating:!0,addAttributes:()=>({layoutUid:{default:null,rendered:!1},stack:{default:`small`}}),parseHTML:()=>[{tag:`vizy-layout`}],renderHTML:({HTMLAttributes:e})=>[`vizy-layout`,w(e),0],addNodeView:()=>t=>new Kp(t,e)})}function Yp(){return D.create({name:`column`,content:`block*`,defining:!0,isolating:!0,addAttributes:()=>({columnUid:{default:null,rendered:!1},span:{default:12}}),parseHTML:()=>[{tag:`vizy-column`}],renderHTML:({HTMLAttributes:e})=>[`vizy-column`,w(e),0],addNodeView:()=>e=>new qp(e)})}var Xp=D.create({name:`doc`,topNode:!0,content:`block*`,addAttributes:()=>({schemaVersion:{default:2,rendered:!1}})}),Zp=[1,2,3,4,5,6];function Qp(e){let t=(e?.headingLevels??[]).filter(e=>Zp.includes(e));return t.length?t:Zp}var $p=Object.freeze({"vizy/core/node/doc":()=>Xp,"vizy/core/node/text":()=>ru,"vizy/core/node/vizyBlock":e=>Wp(e?.services??(()=>{throw Error(`vizyNodeViewServicesMissing`)})),"vizy/core/node/layout":e=>Jp(()=>({editor:e?.services?.().editor})),"vizy/core/node/column":()=>Yp(),"vizy/core/node/paragraph":()=>$l,"vizy/core/node/heading":e=>Bc.configure({levels:Qp(e?.manifest)}),"vizy/core/node/blockquote":()=>Ec,"vizy/core/node/codeBlock":()=>Rc,"vizy/core/node/horizontalRule":()=>Vc,"vizy/core/node/hardBreak":()=>zc,"vizy/core/node/bulletList":()=>Xc,"vizy/core/node/orderedList":()=>Gl,"vizy/core/node/listItem":()=>yl,"vizy/core/node/image":()=>xf(),"vizy/core/node/iframe":()=>Ff(),"vizy/core/node/mediaEmbed":()=>If(),"vizy/core/node/table":()=>jf(),"vizy/core/node/tableRow":()=>yf,"vizy/core/node/tableCell":()=>Mf(),"vizy/core/node/tableHeader":()=>Nf(),"vizy/core/mark/bold":()=>jc,"vizy/core/mark/code":()=>Pc,"vizy/core/mark/highlight":()=>su,"vizy/core/mark/italic":()=>Kc,"vizy/core/mark/link":()=>Ef(),"vizy/core/mark/strike":()=>nu,"vizy/core/mark/subscript":()=>cu,"vizy/core/mark/superscript":()=>lu,"vizy/core/mark/textStyle":()=>Bf,"vizy/core/mark/underline":()=>iu});function em(e,t){let n=e.flatMap(e=>{let n=$p[e]??me(e);if(!n)throw Error(`untrustedEditorModule:${e}`);let r=n(t);return Array.isArray(r)?r:[r]});return Ae(n,t)}function tm(e){let t=[];return e.forEach(e=>{e.type.name===`vizyBlock`&&t.push(e)}),t}function nm(e,t){e.set(t,(e.get(t)??0)+1)}function rm(e){for(let t of[`blockUid`,`layoutUid`,`columnUid`,`nodeUid`]){let n=e.attrs?.[t];if(typeof n==`string`&&n)return`${t}:${n}`}return`shape:${JSON.stringify(e.toJSON(),(e,t)=>!t||typeof t!=`object`||Array.isArray(t)?t:Object.fromEntries(Object.entries(t).sort(([e],[t])=>e.localeCompare(t))))}`}function im(e,t){let n=new Map,r=tm(e);t.field.rootContentType===`blocks`&&e.forEach(e=>{e.type.name!==`vizyBlock`&&nm(n,`root:prose:${rm(e)}`)}),r.forEach(e=>{t.field.allowedBlockTypeUids.includes(String(e.attrs.blockTypeUid))||nm(n,`root:type:${String(e.attrs.blockUid)}:${String(e.attrs.blockTypeUid)}`)}),t.field.minBlocks!==null&&r.length<t.field.minBlocks&&nm(n,`root:min`),t.field.maxBlocks!==null&&r.length>t.field.maxBlocks&&nm(n,`root:max`);let i=Ue(t);return e.descendants((t,r)=>{if(t.type.name!==`vizyBlock`)return;let a=String(t.attrs.blockTypeUid);bt(e,r,a)>i&&nm(n,`depth:${String(t.attrs.blockUid)}:${a}`)}),n}var am=S.create({name:`vizyContentPolicy`,addOptions:()=>({manifest:null}),addProseMirrorPlugins(){let e=this.options.manifest;return[new C({filterTransaction(t,n){if(!t.docChanged||t.getMeta(`vizyAcceptedCanonical`)===!0)return!0;let r=im(n.doc,e);return[...im(t.doc,e)].every(([e,t])=>t<=(r.get(e)??0))}})]}});function om(e){return new C({view(t){return new sm(t,e)}})}var sm=class{editorView;#e;cursorPos=null;element=null;timeout=-1;lastDragEvent=null;width;color;className;handlers;constructor(e,t){this.editorView=e,this.#e=t.manifest,this.width=t.width??1,this.color=t.color===!1?void 0:t.color||`black`,this.className=t.class,this.handlers=[`dragover`,`dragend`,`drop`,`dragleave`].map(t=>{let n=e=>{this[t](e)};return e.dom.addEventListener(t,n,!0),{name:t,handler:n}})}destroy(){this.handlers.forEach(({name:e,handler:t})=>{this.editorView.dom.removeEventListener(e,t,!0)})}update(e,t){if(this.cursorPos!=null&&t.doc!==e.state.doc){if(this.lastDragEvent){let e=this.computeTarget(this.lastDragEvent);e===this.cursorPos?this.updateOverlay():this.setCursor(e)}else this.updateOverlay()}}setCursor(e){e!==this.cursorPos&&(this.cursorPos=e,e==null?(this.element?.parentNode?.removeChild(this.element),this.element=null):this.updateOverlay())}updateOverlay(){let e=this.editorView.state.doc.resolve(this.cursorPos),t=!e.parent.inlineContent,n,r=this.editorView.dom,i=r.getBoundingClientRect(),a=i.width/r.offsetWidth,o=i.height/r.offsetHeight;if(t){let t=e.nodeBefore,r=e.nodeAfter;if(t||r){let e=this.editorView.nodeDOM(this.cursorPos-(t?t.nodeSize:0));if(e instanceof HTMLElement){let i=e.getBoundingClientRect(),a=t?i.bottom:i.top;if(t&&r){let e=this.editorView.nodeDOM(this.cursorPos);e instanceof HTMLElement&&(a=(a+e.getBoundingClientRect().top)/2)}let s=this.width/2*o;n={left:i.left,right:i.right,top:a-s,bottom:a+s}}}}if(!n){let e=this.editorView.coordsAtPos(this.cursorPos),t=this.width/2*a;n={left:e.left-t,right:e.left+t,top:e.top,bottom:e.bottom}}let s=this.editorView.dom.offsetParent;this.element||(this.element=s.appendChild(document.createElement(`div`)),this.className&&(this.element.className=this.className),this.element.style.cssText=`position: absolute; z-index: 50; pointer-events: none;`,this.color&&(this.element.style.backgroundColor=this.color)),this.element.classList.toggle(`prosemirror-dropcursor-block`,t),this.element.classList.toggle(`prosemirror-dropcursor-inline`,!t);let c,l;if(!s||s===document.body&&getComputedStyle(s).position===`static`)c=-window.pageXOffset,l=-window.pageYOffset;else{let e=s.getBoundingClientRect(),t=e.width/s.offsetWidth,n=e.height/s.offsetHeight;c=e.left-s.scrollLeft*t,l=e.top-s.scrollTop*n}this.element.style.left=`${(n.left-c)/a}px`,this.element.style.top=`${(n.top-l)/o}px`,this.element.style.width=`${(n.right-n.left)/a}px`,this.element.style.height=`${(n.bottom-n.top)/o}px`}scheduleRemoval(e){window.clearTimeout(this.timeout),this.timeout=window.setTimeout(()=>this.setCursor(null),e)}computeTarget(e){let t=Tp(this.editorView);if(!t)return null;let n=kp(this.editorView,e.clientX,e.clientY,t);return n==null||!Ip(this.editorView,n,this.#e)?null:n}dragover(e){if(!this.editorView.editable)return;this.lastDragEvent=e;let t=this.computeTarget(e);t==null?this.setCursor(null):(this.setCursor(t),this.scheduleRemoval(150))}dragend(){this.scheduleRemoval(20)}drop(){this.scheduleRemoval(20)}dragleave(e){let t=e.relatedTarget;(!(t instanceof Node)||!this.editorView.dom.contains(t))&&this.setCursor(null)}};function cm(e,t,n){let r=Tp(e);if(!r)return!1;let i=kp(e,t.clientX,t.clientY,r);return i==null||!Ip(e,i,n)?(Cp(),!0):(Ap(e,r,i)?(Cp(),vp()):Cp(),!0)}function lm(e){return S.create({name:`vizyBlockMoveDrop`,addProseMirrorPlugins(){return[om({color:`#0284c7`,width:2,class:`vizy-block-dropcursor`,manifest:e}),new C({view(t){let n=n=>{if(Tp(t)&&cm(t,n,e)){n.preventDefault(),n.stopPropagation();try{t.dragging=null}catch{}}},r=e=>{Tp(t)&&(e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect=`move`))};return t.dom.addEventListener(`drop`,n,!0),t.dom.addEventListener(`dragover`,r,!0),{destroy(){t.dom.removeEventListener(`drop`,n,!0),t.dom.removeEventListener(`dragover`,r,!0)}}},props:{handleDrop(t,n,r,i){let a=Tp(t);return!i||!a?!1:cm(t,n,e)}}})]}})}function um(e){let{char:t,allowSpaces:n,allowToIncludeChar:r,allowedPrefixes:i,startOfLine:a,$position:o}=e,s=n&&!r,c=De(t),l=RegExp(`\\s${c}$`),u=a?`^`:``,d=r?``:c,f=RegExp(s?`${u}${c}.*?(?=\\s${d}|$)`:`${u}(?:^)?${c}[^\\s${d}]*`,`gm`),p=o.nodeBefore?.isText&&o.nodeBefore.text;if(!p)return null;let m=o.pos-p.length,h=Array.from(p.matchAll(f)).pop();if(!h||h.input===void 0||h.index===void 0)return null;let g=h.input.slice(Math.max(0,h.index-1),h.index),_=RegExp(`^[${i?.join(``)}\0]?$`).test(g);if(i!==null&&!_)return null;let ee=m+h.index,v=ee+h[0].length;return s&&l.test(p.slice(v-1,v+1))&&(h[0]+=` `,v+=1),ee<o.pos&&v>=o.pos?{range:{from:ee,to:v},query:h[0].slice(t.length),text:h[0]}:null}function dm(e){return e.docChanged?e.steps.some(e=>{let t=e.slice;if(!t?.content)return!1;let n=t.content.textBetween(0,t.content.size,`
`);return/\s/.test(n)}):!1}function fm(e){return()=>{let t=e.state.selection.$anchor.pos,{top:n,right:r,bottom:i,left:a}=e.view.coordsAtPos(t);try{return new DOMRect(a,n,r-a,i-n)}catch{return null}}}function pm(e,t,n,r){return n?()=>{let n=r.getState(e.state)?.decorationId;return t.dom.querySelector(`[data-decoration-id="${n}"]`)?.getBoundingClientRect()||null}:fm(e)}function mm({match:e,dismissedRange:t,state:n,transaction:r,editor:i,shouldResetDismissed:a,effectiveAllowSpaces:o}){return a?.({editor:i,state:n,range:t,match:e,transaction:r,allowSpaces:o})?!1:o?e.range.from===t.from:e.range.from===t.from&&!dm(r)}function hm({view:e,pluginKeyRef:t}){let n=e.state.tr.setMeta(t,{exit:!0});e.dispatch(n)}function gm({pluginKey:e,decorationTag:t,decorationClass:n,decorationContent:r,decorationEmptyClass:i,renderer:a,dispatchExit:o}){return{handleKeyDown(t,n){var r;let i=e.getState(t.state);if(!i.active)return!1;if(n.key===`Escape`||n.key===`Esc`){var s;return a==null||(s=a.onKeyDown)==null||s.call(a,{view:t,event:n,range:i.range}),o(t),!0}return(a==null||(r=a.onKeyDown)==null?void 0:r.call(a,{view:t,event:n,range:i.range}))||!1},decorations(a){let{active:o,range:s,decorationId:c,query:l}=e.getState(a);if(!o)return null;let u=!l?.length,d=[n];return u&&d.push(i),O.create(a.doc,[Ke.inline(s.from,s.to,{nodeName:t,class:d.join(` `),"data-decoration-id":c||void 0,"data-decoration-content":r})])}}}function _m({editor:e,char:t,effectiveAllowSpaces:n,allowToIncludeChar:r,allowedPrefixes:i,startOfLine:a,findSuggestionMatch:o,allow:s,shouldShow:c,shouldKeepDismissed:l,pluginKey:u}){return{init(){return{active:!1,range:{from:0,to:0},query:null,text:null,composing:!1,dismissedRange:null}},apply(d,f,p,m){let{isEditable:h}=e,{composing:g}=e.view,{selection:_}=d,{empty:ee,from:v}=_,y={...f},b=d.getMeta(u);if(b&&b.exit)return y.active=!1,y.decorationId=null,y.range={from:0,to:0},y.query=null,y.text=null,y.dismissedRange=f.active?{...f.range}:f.dismissedRange,y;if(y.composing=g,d.docChanged&&y.dismissedRange!==null&&(y.dismissedRange={from:d.mapping.map(y.dismissedRange.from),to:d.mapping.map(y.dismissedRange.to)}),h&&(ee||e.view.composing)){(v<f.range.from||v>f.range.to)&&!g&&!f.composing&&(y.active=!1);let u=o({char:t,allowSpaces:n,allowToIncludeChar:r,allowedPrefixes:i,startOfLine:a,$position:_.$from}),p=`id_${Math.floor(Math.random()*4294967295)}`;u&&s({editor:e,state:m,range:u.range,isActive:f.active})&&(!c||c({editor:e,range:u.range,query:u.query,text:u.text,transaction:d}))?(y.dismissedRange!==null&&!l({match:u,dismissedRange:y.dismissedRange,state:m,transaction:d})&&(y.dismissedRange=null),y.dismissedRange===null?(y.active=!0,y.decorationId=f.decorationId||p,y.range=u.range,y.query=u.query,y.text=u.text):y.active=!1):(u||(y.dismissedRange=null),y.active=!1)}else y.active=!1;return y.active||(y.decorationId=null,y.range={from:0,to:0},y.query=null,y.text=null),y}}}function vm({editor:e,items:t}){let n=null,r=null,i=null,a=()=>{r!==null&&(clearTimeout(r),r=null),i?.(),i=null},o=e=>new Promise(t=>{i=t,r=setTimeout(()=>{r=null;let e=i;i=null,e?.()},e)}),s=()=>{n?.abort(),a(),n=null};return{abort:s,fetch:async(r,i)=>{s(),n=new AbortController;let a=n;if(i>0&&await o(i),n!==a||a.signal.aborted)return{status:`aborted`};try{let i=await t({editor:e,query:r,signal:a.signal});return n!==a||a.signal.aborted?{status:`aborted`}:{status:`resolved`,items:i}}catch{return n!==a||a.signal.aborted?{status:`aborted`}:{status:`error`}}}}}function ym({placement:e,offset:t,flip:n,floatingUi:r}){var i;let a=[g({mainAxis:t.mainAxis??4,crossAxis:t.crossAxis??0})];return n&&a.push(_()),r!=null&&(i=r.middleware)!=null&&i.length&&a.push(...r.middleware),{placement:e,strategy:r?.strategy??`absolute`,middleware:a}}function bm(e){if(e instanceof HTMLElement)return e;if(typeof e==`string`)try{let t=document.querySelector(e);if(t)return t}catch{return document.body}return document.body}function xm({getReferenceRect:e,contextElement:t,config:n,container:r,dismissOnOutsideClick:i,dismiss:a}){return(o,s={})=>{let c={getBoundingClientRect:()=>e()??new DOMRect,contextElement:t},l=!1,u=!o.isConnected;u&&bm(r).appendChild(o),s.onPosition||(o.style.visibility=`hidden`,o.style.width=`max-content`);let d=v(c,o,()=>{y(c,o,{placement:n.placement,strategy:n.strategy,middleware:n.middleware}).then(({x:e,y:t,placement:n,strategy:r})=>{if(s.onPosition){s.onPosition({x:e,y:t,placement:n,strategy:r});return}Object.assign(o.style,{position:r,left:`${e}px`,top:`${t}px`}),l||(l=!0,o.style.visibility=``)})},s.autoUpdate),f;return i&&(f=e=>{let n=e.target;!(n instanceof Node)||o.contains(n)||t.contains(n)||a()},document.addEventListener(`pointerdown`,f,!0)),()=>{d(),f&&document.removeEventListener(`pointerdown`,f,!0),u&&o.remove()}}}function Sm({editor:e,pluginKey:t,items:n,renderer:r,minQueryLength:i,debounce:a,initialItems:o,placement:s,offset:c,container:l,flip:u,floatingUi:d,dismissOnOutsideClick:f,command:p,clientRectFor:m,dispatchExit:h}){let g,_=vm({editor:e,items:n}),ee=ym({placement:s,offset:c,flip:u,floatingUi:d});function v(e,t){switch(e){case`started`:var n;r==null||(n=r.onStart)==null||n.call(r,t);break;case`updated`:var i;r==null||(i=r.onUpdate)==null||i.call(r,t);break;case`stopped`:var a;r==null||(a=r.onExit)==null||a.call(r,t)}}return{update:async(n,d)=>{let y=t.getState(d),b=t.getState(n.state);if(!y||!b)return;let x=null,te=y.query!==b.query,ne=y.text!==b.text,re=y.range.from!==b.range.from||y.range.to!==b.range.to,ie=te||ne||re;if(!y.active&&b.active)x=`started`;else if(y.active&&!b.active)x=`stopped`;else if(b.active&&ie)x=`updated`;else return;let ae=x===`stopped`?y:b,oe=n.dom.querySelector(`[data-decoration-id="${ae.decorationId}"]`),se=m(n,oe),ce=i===0||(ae.query?ae.query.length>=i:!1),le=(x===`started`||x===`updated`)&&ce;if(g={editor:e,range:ae.range,query:ae.query||``,text:ae.text||``,items:o??[],command:t=>p({editor:e,range:ae.range,props:t}),decorationNode:oe,clientRect:se,loading:le,placement:s,offset:{mainAxis:c.mainAxis??4,crossAxis:c.crossAxis??0},container:l,flip:u,floatingUi:ee,mount:xm({getReferenceRect:se,contextElement:n.dom,config:ee,container:l,dismissOnOutsideClick:f,dismiss:()=>h(e.view)})},x===`started`){var ue;r==null||(ue=r.onBeforeStart)==null||ue.call(r,g)}if(x===`updated`){var de;r==null||(de=r.onBeforeUpdate)==null||de.call(r,g)}if(x===`started`&&v(x,g),x===`started`||x===`updated`){if(!le)_.abort(),g={...g,items:o??[],loading:!1};else{g={...g,items:o??[],loading:!0},x=`updated`,v(x,g);let e=await _.fetch(ae.query||``,a);if(e.status===`aborted`)return;if(!t.getState(n.state)?.active){_.abort();return}g=e.status===`resolved`?{...g,items:e.items,loading:!1}:{...g,loading:!1}}}if(x===`stopped`){_.abort(),v(x,g),g=void 0;return}x===`updated`&&v(x,g)},destroy:()=>{var e;_.abort(),g&&(r==null||(e=r.onExit)==null||e.call(r,g))}}}var Cm=new T(`suggestion`);function wm({pluginKey:e=Cm,editor:t,char:n=`@`,allowSpaces:r=!1,allowToIncludeChar:i=!1,allowedPrefixes:a=[` `],startOfLine:o=!1,decorationTag:s=`span`,decorationClass:c=`suggestion`,decorationContent:l=``,decorationEmptyClass:u=`is-empty`,command:d=()=>null,items:f=()=>[],minQueryLength:p=0,debounce:m=0,initialItems:h,placement:g=`bottom-start`,offset:_={},container:ee,flip:v=!0,floatingUi:y,dismissOnOutsideClick:b=!0,render:x=()=>({}),allow:te=()=>!0,findSuggestionMatch:ne=um,shouldShow:re,shouldResetDismissed:ie}){let ae=x?.(),oe=r&&!i,se=(n,r)=>pm(t,n,r,e);function ce(e){return mm({...e,editor:t,shouldResetDismissed:ie,effectiveAllowSpaces:oe})}let le=t=>hm({view:t,pluginKeyRef:e});return new C({key:e,view:()=>Sm({editor:t,pluginKey:e,items:f,renderer:ae,minQueryLength:p,debounce:m,initialItems:h,placement:g,offset:_,container:ee,flip:v,floatingUi:y,dismissOnOutsideClick:b,command:d,clientRectFor:se,dispatchExit:le}),state:_m({editor:t,char:n,effectiveAllowSpaces:oe,allowToIncludeChar:i,allowedPrefixes:a,startOfLine:o,findSuggestionMatch:ne,allow:te,shouldShow:re,shouldKeepDismissed:ce,pluginKey:e}),props:gm({pluginKey:e,decorationTag:s,decorationClass:c,decorationContent:l,decorationEmptyClass:u,renderer:ae,dispatchExit:le})})}function Tm(e,t=Cm){let n=e.state.tr.setMeta(t,{exit:!0});e.dispatch(n)}var Em=wm,Dm=[`block`];function Om(e,t){return e&&t.some(t=>t.item.id===e)?e:null}function km(e,t,n){if(!t.length)return null;let r=e?t.findIndex(t=>t.item.id===e):-1;return r<0?n===1?t[0]?.item.id??null:t[t.length-1]?.item.id??null:t[(r+n+t.length)%t.length]?.item.id??null}var Am=new gn;function jm(e,t){return t?e.schemaRevision===t.schemaRevision&&JSON.stringify(e.container)===JSON.stringify(t.container):!1}function Mm(e){return(e.field.insertableBlockTypeUids??[]).length===0}function Nm(e){let t=e.filter(e=>!e.item.requiresInput);return t.length===1?t[0]:null}async function Pm(e,t,n,r){let i=e.insertion.buildContext(t.surface,t.from);if(!i||!jm(t,i))return!1;let a=await e.insertion.execute({id:n,context:i});return a.status===`inserted`?!0:a.status===`opened`&&n===`transform:vizy:layout`?Fm(e,i,r):a.status===`opened`}function Fm(e,t,n){let r=Ze(e.manifest),i=e.editor.view.dom.closest(`.vizy-editor-surface`)?.parentElement??e.editor.view.dom.parentElement;if(!i||!r.length)return Promise.resolve(!1);let a=n??e.editor.view.coordsAtPos(t.from),o=n??new DOMRect(a.left,a.top,1,a.bottom-a.top);return new Promise(n=>{Am.open(o,r,i,{returnFocus:e.editor.view.dom,onSelect:r=>{e.insertion.execute({id:ut,context:t,input:{presetId:r}}).then(e=>n(e.status===`inserted`))},onClose:()=>n(!1)})})}var Im=null;function Lm(){Im=null}function Rm(e,t=`inline`){let{editor:n}=e,r=n.state.doc.content.size;if(Im?.docSize===r)return Im.anchors;let i=[];return Mm(e.manifest)||((n,r,a)=>{let o=n.type.name===`doc`?r:r+1,s=[],c=o;n.forEach(e=>{let t=c;c+=e.nodeSize,(a!==`blocks`||e.type.name===`vizyBlock`)&&(s.length===0&&s.push({position:o,measurePos:t,measureSide:`top`}),s.push({position:c,measurePos:t,measureSide:`bottom`}))}),s.length===0&&s.push({position:o,measurePos:o,measureSide:`top`});for(let n of s){let r=e.insertion.buildContext(t,n.position);r&&e.insertion.query({context:r,limit:1}).length&&i.push({...n,context:r})}})(n.state.doc,0,e.manifest.field.rootContentType),Im={docSize:r,anchors:i},i}function zm(e,t,n={}){let r=n.distance??4,i=n.pad??10,a=n.capPx??320,o=n.minPx??120,s=n.viewportHeight??window.innerHeight,c=t.split(`-`)[0]||`bottom`,l;switch(c){case`top`:l=e.top-r-i;break;case`bottom`:l=s-e.bottom-r-i;break;default:l=s-i*2}return Math.max(o,Math.min(a,Math.floor(l)))}var Bm=class{#e=null;#t=null;#n=0;#r=null;open(e,t,n,r={}){this.close({restoreFocus:!1,animate:!1});let i=r.search??``,a=r.kinds,o=r.list?[...r.list.items]:[...e.insertion.query({context:t,search:i||void 0,kinds:a})];if(!o.length&&!r.list)return;let s=r.list??new un;s.listId=s.listId||`vizy-popover-${t.surface}-${t.from}`,s.items=o.length?o:s.items,s.query=i,s.filterable=!0,s.view=`list`,s.showViewToggle=!0,s.activeId=null,s.revealActive=!1;let c=r.getClientRect??(()=>n),l=r.skipEnterMotion===!0,u=r.autofocusFilter!==!1,d=r.holdFieldFocus!==!1;this.#o(e,{context:t,list:s,getClientRect:c,returnFocus:r.returnFocus??null,onRestoreFocus:r.onRestoreFocus??null,invokerKey:r.invokerKey??null,onClose:r.onClose??(()=>void 0),onSelect:r.onSelect,onViewChange:r.onViewChange,search:i,filterMode:`panel`,autofocusFilter:u,holdFieldFocus:d,skipEnterMotion:l,kinds:a})}stepActive(e){return this.#e?(this.#e.activeId=km(this.#e.activeId,this.#e.list.items,e),this.#e.list.activeId=this.#e.activeId,this.#e.list.revealActive=!0,this.#e.activeId):null}stepSlash(e){return this.stepActive(e)}get activeId(){return this.#e?.activeId??null}selectActive(){return this.#e&&this.#e.list.revealActive&&this.#e.activeId?this.#e.activeId:null}refresh(e){if(!this.#e)return;let t=e.insertion.buildContext(this.#e.context.surface,this.#e.context.from);if(!jm(this.#e.context,t)){this.close();return}this.#e.context=t;let n=[...e.insertion.query({context:t,search:this.#e.search||void 0,kinds:this.#e.kinds})];this.#e.list.items=n,this.#e.activeId=Om(this.#e.activeId,n),this.#e.list.activeId=this.#e.activeId,this.#e.activeId||(this.#e.list.revealActive=!1)}close(e={}){this.#t?.(),this.#t=null;let t=this.#e;if(this.#e=null,!t){e.animate===!1&&this.#i();return}this.#i();let n=++this.#n;e.restoreFocus!==!1&&this.#a(t);let r=!1,i=()=>{r||n!==this.#n||(r=!0,this.#r===t&&(this.#r=null),Ft(t.fieldBody,!1),t.popup.active=!1,t.popup.remove(),t.list.remove(),t.onClose())};if(!(e.animate===!0&&t.list.hasAttribute(`data-open`))){t.list.classList.remove(`closing`),t.list.removeAttribute(`data-open`),t.list.removeAttribute(`data-instant`),i();return}this.#r=t,t.list.removeAttribute(`data-instant`),t.list.classList.add(`closing`);let a=e=>{e.target===t.list&&e.animationName===`vizy-insertion-menu-hide`&&(t.list.removeEventListener(`animationend`,a),i())};t.list.addEventListener(`animationend`,a),window.setTimeout(i,140)}#i(){let e=this.#r;this.#r=null,++this.#n,e&&(e.list.classList.remove(`closing`),e.list.removeAttribute(`data-open`),e.list.removeAttribute(`data-instant`),Ft(e.fieldBody,!1),e.popup.active=!1,e.popup.remove(),e.list.remove(),e.onClose())}#a(e){if(e.onRestoreFocus){e.onRestoreFocus();return}e.returnFocus?.classList.contains(`vizy-inline-add`)||e.returnFocus?.focus()}get isOpen(){return this.#e!==null}get isClosing(){return this.#r!==null}isClosingInvoker(e){return!e||!this.#r?!1:this.#r.invokerKey===e}isInvoker(e){return!e||!this.#e||!(e instanceof HTMLElement)||!this.#e.invokerKey?!1:e.dataset.vizyInvokerKey===this.#e.invokerKey}get invokerKey(){return this.#e?.invokerKey??null}#o(e,t){let n=document.createElement(`pk-popup`);n.className=`vizy-insertion-popup`,n.placement=`bottom-start`,n.distance=4,n.flip=!0,n.flipPadding=10,n.shift=!0,n.shiftPadding=10,n.anchorTracking=!0,n.positionMethod=`fixed`;let r={getClientRect:t.getClientRect};n.anchor={getBoundingClientRect:()=>r.getClientRect?.()??new DOMRect},n.append(t.list),document.body.append(n);let i=t.holdFieldFocus?Pt(e.editor.view.dom):null;i&&Ft(i,!0);let a={kind:`list`,popup:n,list:t.list,context:t.context,activeId:t.list.activeId,returnFocus:t.returnFocus,onRestoreFocus:t.onRestoreFocus,invokerKey:t.invokerKey,onClose:t.onClose,search:t.search,rectSource:r,fieldBody:i,filterMode:t.filterMode,kinds:t.kinds};this.#e=a,n.active=!0;let o=()=>{if(this.#e!==a)return;let e=zm(a.rectSource.getClientRect?.()??new DOMRect,a.popup.getAttribute(`data-current-placement`)??a.popup.placement,{distance:a.popup.distance});a.list.style.maxHeight=`${e}px`};n.addEventListener(`pk-reposition`,o),o(),this.#s(a,{instant:t.skipEnterMotion});let s=n=>{let r=t.onSelect??(t=>Pm(e,a.context,t));e.suspendInsertionSideEffects?.();let i=r(n);this.close({restoreFocus:!1,animate:!1}),Promise.resolve(i).finally(()=>{e.resumeInsertionSideEffects?.()})};t.list.addEventListener(`vizy-insertion-select`,(e=>{s(e.detail.id)})),t.list.addEventListener(`vizy-insertion-view`,(e=>{t.onViewChange?.(e.detail.view)})),t.list.addEventListener(`vizy-insertion-filter`,(t=>{if(!this.#e)return;this.#e.search=t.detail.query;let n=[...e.insertion.query({context:this.#e.context,search:this.#e.search,kinds:this.#e.kinds})];this.#e.list.items=n,this.#e.list.query=this.#e.search,this.#e.activeId=null,this.#e.list.activeId=null,this.#e.list.revealActive=!1}));let c=e=>{if(this.#e){if(e.key===`Escape`){e.preventDefault(),this.close({restoreFocus:!0,animate:!0});return}if(e.key===`ArrowDown`||e.key===`ArrowUp`){e.preventDefault(),this.stepActive(e.key===`ArrowDown`?1:-1);return}if(e.key===`Enter`){let t=this.#e.list.revealActive?this.#e.activeId:null;if(!t)return;e.preventDefault(),s(t)}}},l=e=>{if(!this.#e)return;let t=e.composedPath();t.includes(this.#e.popup)||t.includes(this.#e.list)||t.some(e=>e instanceof HTMLElement&&(e.classList.contains(`vizy-inline-add`)||e.hasAttribute(`data-vizy-toolbar-add-block`)))||this.close({restoreFocus:!1,animate:!0})};document.addEventListener(`keydown`,c,!0),document.addEventListener(`pointerdown`,l,!0),this.#t=()=>{n.removeEventListener(`pk-reposition`,o),document.removeEventListener(`keydown`,c,!0),document.removeEventListener(`pointerdown`,l,!0)},t.autofocusFilter&&t.list.focusFilterWhenReady?.()}async#s(e,t={}){let n=await this.#c(e.popup);if(this.#e!==e)return;let r=n.split(`-`)[0]||`bottom`;e.list.dataset.side=r,t.instant?e.list.dataset.instant=``:delete e.list.dataset.instant;let i=e.popup.shadowRoot?.querySelector(`.popup`),a=i instanceof HTMLElement?getComputedStyle(i).getPropertyValue(`--pk-transform-origin`).trim():``;a&&e.list.style.setProperty(`--pk-transform-origin`,a),e.list.dataset.open=``}#c(e){let t=e.placement||`bottom-start`,n=()=>e.getAttribute(`data-current-placement`)??t;return new Promise(t=>{let r=!1,i=()=>{r||(r=!0,t(n()))};e.addEventListener(`pk-reposition`,i,{once:!0}),window.setTimeout(i,300)})}},Vm=o`
    @layer pk-component {
        :host {
            display: block;
            max-width: 100%;
            font-family: var(--pk-font-family);
            font-size: var(--pk-font-size-base);
            line-height: var(--pk-line-height);
            /* Frame chrome on the host (matches v1 PaneTabs root) so consumer
             * overflow utilities on the host do not clip the pane shadow. */
            border-radius: var(--pk-tabs-root-radius);
            box-shadow: var(--pk-tabs-root-shadow);
            overflow: var(--pk-tabs-root-overflow);

            /* Root */
            --pk-tabs-root-gap: 0.75rem;
            --pk-tabs-root-height: auto;
            --pk-tabs-root-radius: 0;
            --pk-tabs-root-shadow: none;
            --pk-tabs-root-overflow: visible;

            /* List */
            --pk-tabs-list-display: inline-flex;
            --pk-tabs-list-width: fit-content;
            --pk-tabs-list-align-self: flex-start;
            --pk-tabs-list-align-items: center;
            --pk-tabs-list-padding: 2px;
            --pk-tabs-list-border-width: 1px;
            --pk-tabs-list-border-color: var(--pk-color-gray-150);
            --pk-tabs-list-border-bottom: var(--pk-tabs-list-border-width) solid var(--pk-tabs-list-border-color);
            --pk-tabs-list-radius: var(--pk-radius-md);
            --pk-tabs-list-bg: color-mix(in oklab, var(--pk-color-gray-100) 90%, transparent);
            --pk-tabs-list-shadow: 0 1px 2px rgba(31, 41, 51, 0.06);
            /* Transparent no-op — keyword none in a multi-shadow list invalidates the whole property. */
            --pk-tabs-list-inset-shadow: 0 0 #0000;
            --pk-tabs-list-color: var(--pk-color-gray-500);
            --pk-tabs-list-overflow-x: auto;
            --pk-tabs-list-overflow-y: visible;

            /* Trigger (inherited by pk-tab) */
            --pk-tabs-trigger-display: inline-flex;
            --pk-tabs-trigger-justify: center;
            --pk-tabs-trigger-width: auto;
            --pk-tabs-trigger-gap: 0.5rem;
            --pk-tabs-trigger-min-height: 2rem;
            --pk-tabs-trigger-padding-block: 0.375rem;
            --pk-tabs-trigger-padding-inline: 0.75rem;
            --pk-tabs-trigger-radius: var(--pk-radius-sm);
            --pk-tabs-trigger-color: inherit;
            --pk-tabs-trigger-font-size: 13px;
            --pk-tabs-trigger-font-weight: 400;
            --pk-tabs-trigger-text-align: center;
            --pk-tabs-trigger-text-transform: none;
            --pk-tabs-trigger-border-top: 0 solid transparent;
            --pk-tabs-trigger-hover-bg: rgb(255 255 255 / 0.7);
            --pk-tabs-trigger-hover-color: var(--pk-color-gray-700);
            --pk-tabs-trigger-selected-hover-bg: var(--pk-tabs-trigger-selected-bg, var(--pk-color-white));
            --pk-tabs-trigger-selected-hover-color: var(--pk-tabs-trigger-selected-color, var(--pk-color-gray-800));
            --pk-tabs-trigger-selected-bg: var(--pk-color-white);
            --pk-tabs-trigger-selected-color: var(--pk-color-gray-800);
            --pk-tabs-trigger-selected-shadow: 0 1px 2px rgba(31, 41, 51, 0.12);
            --pk-tabs-trigger-selected-radius: var(--pk-radius-sm);
            --pk-tabs-trigger-selected-border-top: 0 solid transparent;
            --pk-tabs-trigger-underline-height: 0;
            --pk-tabs-trigger-underline-inset: 15px;
            --pk-tabs-trigger-label-flex: 0 1 auto;
            --pk-tabs-trigger-icon-size: 1.125rem;
            --pk-tabs-trigger-icon-color: inherit;
            --pk-tabs-trigger-status-margin: 0;
            --pk-tabs-trigger-status-color: inherit;

            /* Group headings (pk-tab-heading) */
            --pk-tabs-heading-padding: 0.75rem 0.5rem 0.375rem;
            --pk-tabs-heading-color: var(--pk-color-gray-400);
            --pk-tabs-heading-font-size: 11px;
            --pk-tabs-heading-font-weight: 600;
            --pk-tabs-heading-letter-spacing: 0.04em;
            --pk-tabs-heading-text-transform: uppercase;

            /* Panel (inherited by pk-tab-panel) */
            --pk-tabs-panel-flex: none;
            --pk-tabs-panel-min-height: 0;
            --pk-tabs-panel-padding: 0;
            --pk-tabs-panel-bg: transparent;
            --pk-tabs-panel-radius: 0;
            --pk-tabs-panel-font-size: var(--pk-font-size-base);
        }

        :host([variant='pane']),
        :host([variant='modal']),
        :host([variant='sidebar']) {
            height: 100%;
            min-height: 0;
            --pk-tabs-root-height: 100%;
        }

        .tabs {
            display: flex;
            flex-direction: column;
            gap: var(--pk-tabs-root-gap);
            height: var(--pk-tabs-root-height);
            min-height: 0;
            /* Radius/shadow/overflow live on :host — keep the layout shell fill-only. */
        }

        .tabs[data-placement='bottom'] {
            flex-direction: column-reverse;
        }

        .tabs[data-placement='start'],
        .tabs[data-placement='end'] {
            flex-direction: row;
            align-items: flex-start;
            gap: 1rem;
        }

        .tabs[data-placement='end'] {
            flex-direction: row-reverse;
        }

        .tabs[data-placement='start'] .list,
        .tabs[data-placement='end'] .list {
            flex-direction: column;
            align-self: stretch;
        }

        .list {
            display: var(--pk-tabs-list-display);
            width: var(--pk-tabs-list-width);
            max-width: 100%;
            align-self: var(--pk-tabs-list-align-self);
            align-items: var(--pk-tabs-list-align-items);
            justify-content: flex-start;
            /* Tab strip must not shrink when panels flex-fill the column — otherwise
             * overflow-y clips trigger padding and the modal active underline. */
            flex-shrink: 0;
            position: relative;
            z-index: var(--pk-tabs-list-z-index, auto);
            isolation: isolate;
            padding: var(--pk-tabs-list-padding);
            border: var(--pk-tabs-list-border-width) solid var(--pk-tabs-list-border-color);
            border-bottom: var(--pk-tabs-list-border-bottom, var(--pk-tabs-list-border-width) solid var(--pk-tabs-list-border-color));
            border-radius: var(--pk-tabs-list-radius);
            background: var(--pk-tabs-list-bg);
            box-shadow: var(--pk-tabs-list-shadow), var(--pk-tabs-list-inset-shadow);
            color: var(--pk-tabs-list-color);
            overflow-x: var(--pk-tabs-list-overflow-x, auto);
            overflow-y: var(--pk-tabs-list-overflow-y, visible);
        }

        /* Pane — matches plugin-kit-react PaneTabs */
        :host([variant='pane']) {
            --pk-tabs-root-gap: 0;
            --pk-tabs-root-radius: var(--pk-radius-lg);
            --pk-tabs-root-shadow:
                0 0 0 1px var(--pk-color-gray-200),
                0 2px 12px rgb(205 216 228 / 50%);
            --pk-tabs-root-overflow: visible;

            --pk-tabs-list-display: flex;
            --pk-tabs-list-width: auto;
            --pk-tabs-list-align-self: stretch;
            --pk-tabs-list-align-items: flex-end;
            --pk-tabs-list-padding: 0;
            --pk-tabs-list-border-width: 0;
            --pk-tabs-list-radius: var(--pk-radius-lg) var(--pk-radius-lg) 0 0;
            --pk-tabs-list-bg: var(--pk-color-gray-50);
            /* Must not use keyword none — box-shadow: none, inset … is invalid and drops the hairline. */
            --pk-tabs-list-shadow: inset 0 -1px 0 0 rgb(154 165 177 / 25%);
            --pk-tabs-list-inset-shadow: 0 0 #0000;
            --pk-tabs-list-overflow-x: auto;
            --pk-tabs-list-overflow-y: visible;

            --pk-tabs-trigger-display: flex;
            --pk-tabs-trigger-justify: flex-start;
            --pk-tabs-trigger-min-height: 45px;
            --pk-tabs-trigger-padding-block: 0;
            --pk-tabs-trigger-padding-inline: 24px;
            --pk-tabs-trigger-radius: 0;
            --pk-tabs-trigger-border-top: 0 solid transparent;
            --pk-tabs-trigger-color: var(--pk-color-gray-550);
            --pk-tabs-trigger-font-size: var(--pk-font-size-base);
            --pk-tabs-trigger-font-weight: 400;
            --pk-tabs-trigger-hover-bg: var(--pk-color-slate-100);
            --pk-tabs-trigger-hover-color: var(--pk-color-gray-550);
            --pk-tabs-trigger-selected-bg: var(--pk-color-white);
            --pk-tabs-trigger-selected-color: var(--pk-color-gray-700);
            --pk-tabs-trigger-selected-border-top: 0 solid transparent;
            /* Match Craft .pane-tabs [role=tab].sel — inset top accent + elevation. */
            --pk-tabs-trigger-selected-shadow:
                inset 0 2px 0 var(--pk-color-gray-500),
                0 0 0 1px rgb(51 64 77 / 10%),
                0 2px 12px rgb(205 216 228 / 90%);
            --pk-tabs-trigger-selected-radius: 2px 2px 0 0;

            /* 0% basis — panel fills leftover height and scrolls; auto basis grew with
             * content and clipped under dialog overflow:hidden (Edit Buttons Appearance). */
            --pk-tabs-panel-flex: 1 1 0%;
            --pk-tabs-panel-min-height: 0;
            /*
             * No built-in panel inset — matches v1 PaneTabsContent (padding came from
             * the consumer: ReportTabPanel / FormBuilderTabContent / DefaultsPanel p-6).
             * A non-zero value here double-pads those surfaces.
             */
            --pk-tabs-panel-padding: 0;
            --pk-tabs-panel-bg: var(--pk-color-white);
            --pk-tabs-panel-radius: 0 0 var(--pk-radius-lg) var(--pk-radius-lg);
            --pk-tabs-panel-font-size: var(--pk-font-size-sm, 14px);
        }

        /* Craft bumps the first tab start corner to --radius-lg so the inset
         * accent follows the pane radius instead of reading as clipped at 2px.
         */
        :host([variant='pane']) ::slotted(pk-tab:first-child) {
            --pk-tabs-trigger-selected-radius: var(--pk-radius-lg) 2px 0 0;
        }

        /* Modal — matches plugin-kit-react ModalTabs */
        :host([variant='modal']) {
            --pk-tabs-root-gap: 0;
            --pk-tabs-root-height: 100%;
            /* Dialog already rounds the panel — host radius + overflow clips the
             * first tab’s focus ring into a one-corner “rounded border”. */
            --pk-tabs-root-radius: 0;
            /* Clip to the height chain so panels scroll inside, not through the footer. */
            --pk-tabs-root-overflow: hidden;

            --pk-tabs-list-display: flex;
            --pk-tabs-list-width: 100%;
            --pk-tabs-list-align-self: stretch;
            --pk-tabs-list-align-items: stretch;
            --pk-tabs-list-padding: 0;
            --pk-tabs-list-border-width: 0;
            --pk-tabs-list-border-bottom: 1px solid var(--pk-color-gray-100);
            --pk-tabs-list-radius: 0;
            --pk-tabs-list-bg: var(--pk-color-white);
            --pk-tabs-list-shadow: 0 1px 5px #cdd8e440;
            /* Transparent no-op — keyword none in a multi-shadow list invalidates the whole property. */
            --pk-tabs-list-inset-shadow: 0 0 #0000;
            --pk-tabs-list-color: inherit;
            --pk-tabs-list-overflow-x: auto;
            /* auto (not hidden): overflow-x:auto + overflow-y:hidden clips ~1 device
             * pixel of the bottom active underline, so the 2px sky bar reads as 1px. */
            --pk-tabs-list-overflow-y: auto;
            /* v1 ModalTabsList z-11 — keep the strip above scrolling panel content
             * (editable-table action columns, etc.) when body/panel scrolls. */
            --pk-tabs-list-z-index: 11;

            --pk-tabs-trigger-display: inline-flex;
            --pk-tabs-trigger-justify: center;
            --pk-tabs-trigger-min-height: auto;
            --pk-tabs-trigger-padding-block: 15px;
            --pk-tabs-trigger-padding-inline: 15px;
            --pk-tabs-trigger-radius: 0;
            --pk-tabs-trigger-color: #64788d;
            --pk-tabs-trigger-font-size: 12px;
            --pk-tabs-trigger-font-weight: 500;
            --pk-tabs-trigger-text-transform: uppercase;
            --pk-tabs-trigger-hover-bg: transparent;
            --pk-tabs-trigger-hover-color: var(--pk-color-sky-600);
            --pk-tabs-trigger-selected-bg: transparent;
            --pk-tabs-trigger-selected-color: #64788d;
            --pk-tabs-trigger-selected-hover-bg: transparent;
            --pk-tabs-trigger-selected-hover-color: var(--pk-color-sky-600);
            /* Active (mouse) = 15px-inset underline. Active + :focus-visible = screen3 box. */
            --pk-tabs-trigger-selected-shadow: none;
            --pk-tabs-trigger-selected-radius: 0;
            --pk-tabs-trigger-underline-height: 2px;
            --pk-tabs-trigger-underline-inset: 15px;
            --pk-tabs-trigger-focus-selected-shadow: inset 0 0 0 2px var(--pk-color-sky-600);
            --pk-tabs-trigger-focus-selected-underline-height: 0;

            /* 0% basis — panel fills leftover height and scrolls; auto basis grew with
             * content and clipped under dialog overflow:hidden (Edit Buttons Appearance). */
            --pk-tabs-panel-flex: 1 1 0%;
            --pk-tabs-panel-min-height: 0;
            --pk-tabs-panel-padding: 1rem;
            --pk-tabs-panel-bg: transparent;
            --pk-tabs-panel-radius: 0;
            --pk-tabs-panel-font-size: var(--pk-font-size-sm, 14px);
        }

        /* Sidebar — vertical nav list with optional icons, status, and headings */
        :host([variant='sidebar']) {
            --pk-tabs-root-gap: 0;
            --pk-tabs-root-radius: 0;
            --pk-tabs-root-shadow: none;
            --pk-tabs-root-overflow: visible;

            --pk-tabs-list-display: flex;
            --pk-tabs-list-width: var(--pk-tabs-sidebar-width, 14rem);
            --pk-tabs-list-align-self: stretch;
            --pk-tabs-list-align-items: stretch;
            --pk-tabs-list-padding: 0.5rem;
            --pk-tabs-list-border-width: 0;
            --pk-tabs-list-border-bottom: 0 solid transparent;
            --pk-tabs-list-radius: 0;
            --pk-tabs-list-bg: var(--pk-color-gray-100);
            --pk-tabs-list-shadow: 0 0 #0000;
            --pk-tabs-list-inset-shadow: 0 0 #0000;
            --pk-tabs-list-color: var(--pk-color-gray-600);
            --pk-tabs-list-overflow-x: hidden;
            --pk-tabs-list-overflow-y: auto;

            --pk-tabs-trigger-display: flex;
            --pk-tabs-trigger-justify: flex-start;
            --pk-tabs-trigger-width: 100%;
            /* Match Craft/Formie integrations nav: padding 7px 10px, 16px icons, content-sized height. */
            --pk-tabs-trigger-gap: 10px;
            --pk-tabs-trigger-min-height: 0;
            --pk-tabs-trigger-padding-block: 7px;
            --pk-tabs-trigger-padding-inline: 10px;
            --pk-tabs-trigger-radius: var(--pk-radius-md);
            --pk-tabs-trigger-color: var(--pk-color-gray-700);
            --pk-tabs-trigger-font-size: 13px;
            --pk-tabs-trigger-font-weight: 400;
            --pk-tabs-trigger-line-height: 1.2;
            --pk-tabs-trigger-text-align: start;
            --pk-tabs-trigger-text-transform: none;
            --pk-tabs-trigger-border-top: 0 solid transparent;
            --pk-tabs-trigger-hover-bg: color-mix(in oklab, var(--pk-color-gray-200) 70%, transparent);
            --pk-tabs-trigger-hover-color: var(--pk-color-gray-800);
            --pk-tabs-trigger-selected-bg: var(--pk-color-gray-500);
            --pk-tabs-trigger-selected-color: var(--pk-color-white);
            --pk-tabs-trigger-selected-hover-bg: var(--pk-color-gray-500);
            --pk-tabs-trigger-selected-hover-color: var(--pk-color-white);
            --pk-tabs-trigger-selected-shadow: none;
            --pk-tabs-trigger-selected-radius: var(--pk-radius-md);
            --pk-tabs-trigger-selected-border-top: 0 solid transparent;
            --pk-tabs-trigger-underline-height: 0;
            --pk-tabs-trigger-label-flex: 1 1 auto;
            --pk-tabs-trigger-icon-size: 16px;
            --pk-tabs-trigger-status-margin: auto;
            --pk-tabs-trigger-status-color: var(--pk-color-gray-400);

            --pk-tabs-heading-padding: 14px 10px 5px;
            --pk-tabs-heading-color: var(--pk-color-gray-400);
            --pk-tabs-heading-font-size: 11px;
            --pk-tabs-heading-font-weight: 600;
            --pk-tabs-heading-letter-spacing: 0.04em;
            --pk-tabs-heading-text-transform: uppercase;

            /* 0% basis — panel fills leftover height and scrolls; auto basis grew with
             * content and clipped under dialog overflow:hidden (Edit Buttons Appearance). */
            --pk-tabs-panel-flex: 1 1 0%;
            --pk-tabs-panel-min-height: 0;
            --pk-tabs-panel-padding: 1.25rem;
            --pk-tabs-panel-bg: var(--pk-color-white);
            --pk-tabs-panel-radius: 0;
            --pk-tabs-panel-font-size: var(--pk-font-size-base);
        }

        :host([variant='sidebar']) .tabs {
            flex-direction: row;
            align-items: stretch;
            gap: 0;
        }

        :host([variant='sidebar']) .tabs[data-placement='end'] {
            flex-direction: row-reverse;
        }

        :host([variant='sidebar']) .list {
            flex-direction: column;
            gap: 0.125rem;
            flex: none;
        }

        :host([variant='sidebar']) ::slotted(pk-tab) {
            display: block;
            width: 100%;
        }

        :host([variant='sidebar']) ::slotted(pk-tab-heading) {
            display: block;
            width: 100%;
        }

        /* First group heading sits closer to the list top edge */
        :host([variant='sidebar']) ::slotted(pk-tab-heading:first-child) {
            --pk-tabs-heading-padding: 10px 10px 5px;
        }

        /* Hollow inactive dots read better on the selected dark pill */
        :host([variant='sidebar']) ::slotted(pk-tab[selected]) {
            --pk-tabs-trigger-status-color: var(--pk-color-gray-300);
        }
    }
`,X=class extends l{constructor(...e){super(...e),this.value=``,this.variant=`default`,this.orientation=`horizontal`,this.placement=`top`,this.activation=`manual`,this.disabled=!1,this.ariaLabel=null,this.baseId=ee(`pk-tabs`),this.tabs=[],this.panels=[],this.focusedValue=``,this.syncTabs=()=>{let e=this.shadowRoot?.querySelector(`slot[name="nav"]`);e&&(this.tabs=e.assignedElements({flatten:!0}).filter(e=>e.tagName===`PK-TAB`),this.ensureDefaultValue(),this.applySelection())},this.syncPanels=()=>{let e=this.shadowRoot?.querySelector(`slot:not([name])`);e&&(this.panels=e.assignedElements({flatten:!0}).filter(e=>e.tagName===`PK-TAB-PANEL`),this.applySelection())},this.handleTabSelect=e=>{if(!this.isOwnTabEvent(e)||this.disabled)return;e.stopPropagation();let{value:t}=e.detail;if(t===this.value&&this.activation===`manual`){this.focusedValue=t,this.applySelection();return}t!==this.value&&this.selectTab(t)},this.handleTabKeyDown=e=>{if(!this.isOwnTabEvent(e))return;e.stopPropagation();let t=e.detail.event,n=this.getEnabledTabs();if(n.length===0)return;let r=n.findIndex(t=>t.value===e.detail.value);if(r<0)return;let i=r,a=this.getEffectiveOrientation()===`horizontal`;switch(t.key){case`ArrowDown`:if(a)return;t.preventDefault(),i=r>=n.length-1?0:r+1;break;case`ArrowUp`:if(a)return;t.preventDefault(),i=r<=0?n.length-1:r-1;break;case`ArrowRight`:if(!a)return;t.preventDefault(),i=r>=n.length-1?0:r+1;break;case`ArrowLeft`:if(!a)return;t.preventDefault(),i=r<=0?n.length-1:r-1;break;case`Home`:t.preventDefault(),i=0;break;case`End`:t.preventDefault(),i=n.length-1;break;default:return}let o=n[i];o&&(this.activation===`auto`?o.value===this.value?o.focusControl():this.selectTab(o.value):(this.focusedValue=o.value,this.applySelection(),o.focusControl()))}}static{this.styles=Vm}connectedCallback(){super.connectedCallback(),this.addEventListener(`pk-tab-select`,this.handleTabSelect),this.addEventListener(`pk-tab-keydown`,this.handleTabKeyDown)}disconnectedCallback(){this.removeEventListener(`pk-tab-select`,this.handleTabSelect),this.removeEventListener(`pk-tab-keydown`,this.handleTabKeyDown),super.disconnectedCallback()}updated(e){(e.has(`value`)||e.has(`disabled`)||e.has(`activation`))&&(e.has(`value`)&&(this.focusedValue=this.value),this.applySelection())}ensureDefaultValue(){if(this.value||this.tabs.length===0)return;let e=this.tabs.find(e=>!e.disabled&&!this.disabled);e&&(this.value=e.value,this.focusedValue=this.value)}getEnabledTabs(){return this.tabs.filter(e=>!e.disabled&&!this.disabled)}getEffectiveOrientation(){return this.variant===`sidebar`?`vertical`:this.orientation}getEffectivePlacement(){return this.variant===`sidebar`&&(this.placement===`top`||this.placement===`bottom`)?`start`:this.placement}applySelection(){let e=this.getAttribute(`data-current-value`)??``,t=this.activation===`manual`?this.focusedValue:this.value;for(let e of this.tabs){let n=e.value===this.value,r=`${this.baseId}-tab-${e.value}`,i=`${this.baseId}-panel-${e.value}`;e.selected=n,e.disabled=this.disabled||e.hasAttribute(`disabled`),e.focusIndex=e.value===t?0:-1,e.panelId=i,e.id=r}for(let t of this.panels){let n=t.value===this.value,r=`${this.baseId}-tab-${t.value}`,i=`${this.baseId}-panel-${t.value}`;t.hidden!==!n&&(n?this.dispatchEvent(new CustomEvent(`pk-tab-show`,{detail:{value:t.value},bubbles:!0,composed:!0})):e===t.value&&this.dispatchEvent(new CustomEvent(`pk-tab-hide`,{detail:{value:t.value},bubbles:!0,composed:!0}))),t.hidden=!n,t.tabId=r,t.id=i}this.setAttribute(`data-current-value`,this.value)}isOwnTabEvent(e){let t=e.target;return t instanceof HTMLElement&&t.tagName===`PK-TAB`&&this.tabs.includes(t)}selectTab(e){this.value=e,this.focusedValue=e,this.applySelection(),this.dispatchEvent(new CustomEvent(`pk-change`,{detail:{value:this.value},bubbles:!0,composed:!0}))}render(){let e=this.getEffectiveOrientation();return n`
            <div part="base" class="tabs pk-tabs" data-placement=${this.getEffectivePlacement()}>
                <div
                    part="list"
                    class="list pk-tabs__list"
                    role="tablist"
                    aria-orientation=${e}
                    aria-label=${this.ariaLabel??r}
                    @slotchange=${this.syncTabs}
                >
                    <slot name="nav"></slot>
                </div>
                <slot @slotchange=${this.syncPanels}></slot>
            </div>
        `}};i([c()],X.prototype,`value`,void 0),i([c({reflect:!0})],X.prototype,`variant`,void 0),i([c({reflect:!0})],X.prototype,`orientation`,void 0),i([c({reflect:!0})],X.prototype,`placement`,void 0),i([c({reflect:!0})],X.prototype,`activation`,void 0),i([c({type:Boolean,reflect:!0})],X.prototype,`disabled`,void 0),i([c({attribute:`aria-label`})],X.prototype,`ariaLabel`,void 0),i([a()],X.prototype,`tabs`,void 0),i([a()],X.prototype,`panels`,void 0),i([a()],X.prototype,`focusedValue`,void 0),X=i([s(`pk-tabs`)],X);var Hm=class extends l{constructor(...e){super(...e),this.value=``,this.disabled=!1,this.selected=!1,this.focusIndex=-1}focusControl(){this.shadowRoot?.querySelector(`.trigger`)?.focus()}handleClick(){this.disabled||this.dispatchEvent(new CustomEvent(`pk-tab-select`,{detail:{value:this.value},bubbles:!0,composed:!0}))}handleKeyDown(e){this.dispatchEvent(new CustomEvent(`pk-tab-keydown`,{detail:{event:e,value:this.value},bubbles:!0,composed:!0}))}renderTrigger(e){return n`
            <button
                part="trigger"
                type="button"
                class=${e}
                role="tab"
                ?disabled=${this.disabled}
                aria-disabled=${this.disabled?`true`:r}
                aria-selected=${this.selected?`true`:`false`}
                tabindex=${this.focusIndex}
                aria-controls=${this.panelId??r}
                @click=${this.handleClick}
                @keydown=${this.handleKeyDown}
            >
                <span part="icon" class="icon">
                    <slot name="icon"></slot>
                </span>
                <span part="label" class="label">
                    <slot></slot>
                </span>
                <span part="status" class="status">
                    <slot name="status"></slot>
                </span>
            </button>
        `}};i([c()],Hm.prototype,`value`,void 0),i([c({type:Boolean,reflect:!0})],Hm.prototype,`disabled`,void 0),i([c({type:Boolean,reflect:!0})],Hm.prototype,`selected`,void 0),i([c({type:Number,attribute:`focus-index`})],Hm.prototype,`focusIndex`,void 0),i([c()],Hm.prototype,`panelId`,void 0);var Um=o`
    @layer pk-component {
        :host {
            /* Size to the shadow trigger. Prefer flex-start so a short list line
             * (or host utilities like Tailwind items-center) cannot stretch the
             * host shorter than the trigger and clip the modal active underline. */
            display: inline-flex;
            flex-shrink: 0;
            align-self: flex-start;
            height: auto;
            min-height: auto;
            align-items: stretch;
            /* Pin type metrics for slotted labels — vars cascade from pk-tabs. */
            font-family: var(--pk-font-family);
            font-size: var(--pk-tabs-trigger-font-size, 13px);
            font-weight: var(--pk-tabs-trigger-font-weight, 400);
            line-height: var(--pk-tabs-trigger-line-height, 1.4);
            color: var(--pk-tabs-trigger-color, inherit);
        }

        .trigger {
            position: relative;
            display: var(--pk-tabs-trigger-display, inline-flex);
            align-items: center;
            justify-content: var(--pk-tabs-trigger-justify, center);
            gap: var(--pk-tabs-trigger-gap, 0.5rem);
            width: var(--pk-tabs-trigger-width, auto);
            min-height: var(--pk-tabs-trigger-min-height, 2rem);
            padding: var(--pk-tabs-trigger-padding-block, 0.375rem)
                var(--pk-tabs-trigger-padding-inline, 0.75rem);
            border: 0;
            border-top: var(--pk-tabs-trigger-border-top, 0 solid transparent);
            border-radius: var(--pk-tabs-trigger-radius, var(--pk-radius-sm));
            background: transparent;
            color: inherit;
            font: inherit;
            font-family: var(--pk-font-family);
            font-size: var(--pk-tabs-trigger-font-size, 13px);
            font-weight: var(--pk-tabs-trigger-font-weight, 400);
            line-height: var(--pk-tabs-trigger-line-height, 1.4);
            text-align: var(--pk-tabs-trigger-text-align, center);
            text-transform: var(--pk-tabs-trigger-text-transform, none);
            white-space: nowrap;
            cursor: pointer;
            outline: none;
            box-shadow: none;
            box-sizing: border-box;
            transition: background-color 0.12s ease, color 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease;
        }

        /* Collapse optional icon/status lanes when nothing is slotted. */
        .icon,
        .status {
            display: none;
            flex: none;
            align-items: center;
            justify-content: center;
            line-height: 0;
        }

        .icon:has(::slotted(*)),
        .status:has(::slotted(*)) {
            display: inline-flex;
        }

        .icon {
            width: var(--pk-tabs-trigger-icon-size, 1.125rem);
            height: var(--pk-tabs-trigger-icon-size, 1.125rem);
            font-size: var(--pk-tabs-trigger-icon-size, 1.125rem);
            color: var(--pk-tabs-trigger-icon-color, inherit);
        }

        .icon ::slotted(*) {
            display: block;
            max-width: 100%;
            max-height: 100%;
            /* Kill pk-icon text-baseline nudge so logos/icons sit on the flex midline. */
            vertical-align: 0;
        }

        .label {
            display: inline-flex;
            flex: var(--pk-tabs-trigger-label-flex, 0 1 auto);
            align-items: center;
            min-width: 0;
            line-height: inherit;
        }

        .status {
            margin-inline-start: var(--pk-tabs-trigger-status-margin, 0);
            color: var(--pk-tabs-trigger-status-color, inherit);
        }

        .trigger:hover:not(:disabled):not([aria-disabled='true']):not([aria-selected='true']) {
            border-top-color: transparent;
            background: var(--pk-tabs-trigger-hover-bg, rgb(255 255 255 / 0.7));
            color: var(--pk-tabs-trigger-hover-color, var(--pk-color-gray-700));
        }

        /*
         * Focus ring is only for :focus-visible on a non-selected tab (manual
         * activation). Selected + focus-visible must NOT draw a ring — active
         * chrome is the underline (mouse) or is replaced by the modal focus box
         * via --pk-tabs-trigger-focus-selected-shadow when set.
         */
        .trigger:focus-visible:not([aria-selected='true']) {
            box-shadow: inset 0 0 0 2px var(--pk-color-sky-600);
        }

        .trigger:disabled,
        .trigger[aria-disabled='true'] {
            cursor: not-allowed;
            opacity: 0.5;
        }

        .trigger[aria-selected='true'],
        :host([selected]) .trigger {
            border-top: var(--pk-tabs-trigger-selected-border-top, var(--pk-tabs-trigger-border-top, 0 solid transparent));
            border-radius: var(--pk-tabs-trigger-selected-radius, var(--pk-radius-sm));
            background: var(--pk-tabs-trigger-selected-bg, var(--pk-color-white));
            color: var(--pk-tabs-trigger-selected-color, var(--pk-color-gray-800));
            box-shadow: var(--pk-tabs-trigger-selected-shadow, 0 1px 2px rgba(31, 41, 51, 0.12));
        }

        .trigger[aria-selected='true']:hover,
        :host([selected]) .trigger:hover {
            background: var(--pk-tabs-trigger-selected-hover-bg, var(--pk-tabs-trigger-selected-bg, var(--pk-color-white)));
            color: var(--pk-tabs-trigger-selected-hover-color, var(--pk-tabs-trigger-selected-color, var(--pk-color-gray-800)));
        }

        /* screen3: keyboard focus on the active tab → full inset box, no underline. */
        .trigger[aria-selected='true']:focus-visible,
        :host([selected]) .trigger:focus-visible {
            box-shadow: var(
                --pk-tabs-trigger-focus-selected-shadow,
                var(--pk-tabs-trigger-selected-shadow, 0 0 #0000)
            );
        }

        .trigger[aria-selected='true']:focus-visible::after,
        :host([selected]) .trigger:focus-visible::after {
            height: var(--pk-tabs-trigger-focus-selected-underline-height, var(--pk-tabs-trigger-underline-height, 0));
        }

        .trigger[aria-selected='true']::after,
        :host([selected]) .trigger::after {
            content: '';
            position: absolute;
            right: var(--pk-tabs-trigger-underline-inset, 15px);
            bottom: 0;
            left: var(--pk-tabs-trigger-underline-inset, 15px);
            height: var(--pk-tabs-trigger-underline-height, 0);
            /* Keep the bar above the list hairline when both meet at the clip edge. */
            z-index: 1;
            background: var(--pk-color-sky-600);
            pointer-events: none;
        }

        /*
         * Validation error chrome (v1 ModalTabs / PaneTabs text-error).
         * Host sets data-has-errors; light-DOM text-* cannot pierce the trigger.
         */
        :host([data-has-errors]) {
            --pk-tabs-trigger-color: var(--pk-color-error, #d81f23);
            --pk-tabs-trigger-hover-color: var(--pk-color-rose-700, #be123c);
            --pk-tabs-trigger-selected-color: var(--pk-color-error, #d81f23);
            --pk-tabs-trigger-selected-hover-color: var(--pk-color-rose-700, #be123c);
            --pk-tabs-trigger-icon-color: inherit;
            --pk-tabs-trigger-status-color: inherit;
        }
    }
`,Wm=class extends Hm{static{this.styles=Um}render(){return this.renderTrigger(`trigger pk-tabs__trigger`)}};Wm=i([s(`pk-tab`)],Wm);var Gm=class extends l{constructor(...e){super(...e),this.value=``,this.hidden=!0}renderPanel(e){return n`
            <div
                part="content"
                class=${e}
                role="tabpanel"
                id=${this.tabId??r}
                aria-labelledby=${this.tabId??r}
                aria-hidden=${this.hidden?`true`:`false`}
                tabindex=${this.hidden?r:`0`}
            >
                <slot></slot>
            </div>
        `}};i([c()],Gm.prototype,`value`,void 0),i([c({type:Boolean,reflect:!0})],Gm.prototype,`hidden`,void 0),i([c()],Gm.prototype,`tabId`,void 0);var Km=o`
    @layer pk-component {
        :host {
            /* Flex column so .content can own overflow when the host is height-capped
             * by a modal/pane parent (flex: 1 1 0% + min-height: 0). */
            display: flex;
            flex-direction: column;
            flex: var(--pk-tabs-panel-flex, none);
            min-height: var(--pk-tabs-panel-min-height, 0);
            min-width: 0;
            overflow: hidden;
        }

        :host([hidden]) {
            display: none !important;
        }

        .content {
            flex: 1 1 auto;
            min-height: 0;
            padding: var(--pk-tabs-panel-padding, 0);
            overflow-y: auto;
            border-radius: var(--pk-tabs-panel-radius, 0);
            background: var(--pk-tabs-panel-bg, transparent);
            outline: none;
            font-family: var(--pk-font-family);
            font-size: var(--pk-tabs-panel-font-size, var(--pk-font-size-base));
            line-height: var(--pk-line-height);
        }

        .content:focus-visible {
            box-shadow: inset 0 0 0 2px var(--pk-color-sky-600);
            border-radius: var(--pk-radius-sm);
        }
    }
`,qm=class extends Gm{static{this.styles=Km}render(){return this.renderPanel(`content pk-tabs__content`)}};qm=i([s(`pk-tab-panel`)],qm);var Jm=class extends t{#e=[];get items(){return this.#e}set items(e){this.#e=e}#t=``;get query(){return this.#t}set query(e){this.#t=e}#n=`grid`;get view(){return this.#n}set view(e){this.#n=e}#r=`all`;get activeTab(){return this.#r}set activeTab(e){this.#r=e}#i=null;get activeId(){return this.#i}set activeId(e){this.#i=e}static styles=o`
        :host {
            display: contents;
            font: inherit;
            color: var(--pk-color-gray-700, #3f4d5a);
        }
        /* Own insets: dialog uses without-body-padding so tabs can go edge-flush. */
        .dialog-bar {
            display: flex;
            flex-direction: column;
            gap: 0;
            min-height: 0;
        }
        .toolbar {
            display: flex;
            flex-shrink: 0;
            gap: 0.5rem;
            align-items: stretch;
            padding: 0.75rem 1rem 0.2rem;
        }
        .toolbar pk-input {
            flex: 1 1 auto;
            min-width: 0;
        }
        .toolbar pk-input::part(start) {
            color: var(--pk-color-gray-400, #9aa5b1);
        }
        .view-toggle {
            flex: 0 0 auto;
            align-self: stretch;
            display: inline-flex;
            align-items: stretch;
        }
        /* Match stock pk-input height (sm toggles sit shorter than the field). */
        .view-toggle pk-toggle::part(base) {
            box-sizing: border-box;
            height: var(--pk-btn-height-default, 2.125rem);
            min-height: var(--pk-btn-height-default, 2.125rem);
            min-width: var(--pk-btn-height-default, 2.125rem);
        }
        .view-toggle pk-icon {
            width: 0.9rem;
            height: 0.9rem;
            font-size: 0.9rem;
        }
        /*
         * Modal tabs flush under the search strip: no root gap, no panel inset,
         * full-bleed list. Grid scrolls; toolbar + tab list stay put.
         */
        pk-tabs.browse-tabs {
            flex: 1 1 auto;
            min-height: 0;
            height: auto;
            --pk-tabs-root-height: auto;
            --pk-tabs-root-gap: 0;
            --pk-tabs-root-overflow: visible;
            --pk-tabs-panel-flex: none;
            --pk-tabs-panel-min-height: 0;
            --pk-tabs-panel-padding: 0;
            --pk-tabs-panel-bg: transparent;
            --pk-tabs-panel-radius: 0;
            --pk-tabs-list-shadow: 0 0 #0000;
        }
        /* Four-up cards — large enough for preview images, equal column share. */
        .grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 0.5rem;
            max-height: min(28rem, 55vh);
            overflow: auto;
            padding: 0.75rem 0.75rem 1rem;
            box-sizing: border-box;
        }
        .card {
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
            align-items: stretch;
            min-width: 0;
            border: 0;
            border-radius: 4px;
            background: transparent;
            padding: 0.5rem;
            cursor: pointer;
            font: inherit;
            text-align: center;
            color: inherit;
        }
        .card:hover,
        .card:focus-visible,
        .card[data-active='true'] {
            background: var(--pk-color-slate-100, rgba(96, 125, 159, 0.1));
            outline: none;
        }
        /* Shared preview well — icons and images share the same footprint. */
        .card .thumb {
            display: flex;
            align-items: center;
            justify-content: center;
            aspect-ratio: 4 / 3;
            width: 100%;
            border-radius: 3px;
            background: transparent;
            border: 0;
            overflow: hidden;
            color: var(--vizy-block-accent-color, var(--pk-color-gray-550, #596673));
        }
        .card .thumb img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .card .thumb pk-icon,
        .card .thumb svg {
            width: 2rem;
            height: 2rem;
            font-size: 2rem;
            fill: currentColor;
        }
        .card .label {
            font-size: 0.8125rem;
            font-weight: 500;
            line-height: 1.3;
            text-align: center;
            overflow-wrap: anywhere;
        }
        .empty {
            padding: 1.5rem 1rem;
            color: var(--pk-color-gray-550, #596673);
            font-size: 0.875rem;
            text-align: center;
        }
    `;#a=null;#o=null;#s=null;#c=null;open(e){this.items=e.items,this.query=e.query??``,this.view=`grid`,this.activeTab=`all`,this.activeId=null,this.#o=e.onSelect,this.#s=e.onView,this.#c=e.onClose??null,this.#l()}async#l(){await ua(),this.setAttribute(`autofocus`,``),this.#u(),await this.updateComplete,this.#a&&(this.#a.open=!0),await this.updateComplete,await new Promise(e=>requestAnimationFrame(()=>e())),this.focusFilter()}focusFilter(){let e=this.shadowRoot?.querySelector(`pk-input`),t=e?.shadowRoot?.querySelector(`input`)??this.shadowRoot?.querySelector(`input[type="search"]`);return t?(t.focus({preventScroll:!0}),e?.shadowRoot?.activeElement===t||this.shadowRoot?.activeElement===e||document.activeElement===e||document.activeElement===this):!1}close(){this.#a&&(this.#a.open=!1)}get isOpen(){return!!this.#a?.open}disconnectedCallback(){super.disconnectedCallback(),this.#a?.remove(),this.#a=null}#u(){if(this.#a)return;let e=document.createElement(`pk-dialog`);e.label=`Add Block`,e.size=`wide`,e.withoutBodyPadding=!0,e.append(this),e.addEventListener(`pk-open-change`,(e=>{e.detail?.open===!1&&(this.#c?.(),this.#c=null,this.#o=null,this.#s=null)})),document.body.append(e),this.#a=e}render(){let e=this.#f(),t=e.length>1;return n`
            <div class="dialog-bar">
                <div class="toolbar">
                    <pk-input
                        type="search"
                        placeholder="Search Blocks…"
                        .value=${this.query}
                        aria-label="Search Blocks"
                        @input=${this.#g}
                    >
                        <pk-icon slot="start" icon="magnifying-glass" label=""></pk-icon>
                    </pk-input>
                    <pk-toggle-group
                        class="view-toggle"
                        variant="outline"
                        spacing="0"
                        aria-label="View"
                        .value=${[this.view]}
                        @pk-value-change=${this.#v}
                    >
                        <pk-toggle data-value="list" aria-label="List view">
                            <pk-icon icon="list" label=""></pk-icon>
                        </pk-toggle>
                        <pk-toggle data-value="grid" aria-label="Grid view">
                            <pk-icon icon="grid-2" label=""></pk-icon>
                        </pk-toggle>
                    </pk-toggle-group>
                </div>
                ${t?n`
                    <pk-tabs
                        class="browse-tabs"
                        variant="modal"
                        .value=${this.activeTab}
                        aria-label="Block groups"
                        @pk-change=${this.#_}
                    >
                        ${e.map(e=>n`
                            <pk-tab slot="nav" value=${e.id}>${e.label}</pk-tab>
                        `)}
                        ${e.map(e=>n`
                            <pk-tab-panel value=${e.id}>
                                ${this.#d(e.id)}
                            </pk-tab-panel>
                        `)}
                    </pk-tabs>
                `:this.#d(`all`)}
            </div>
        `}#d(e){let t=this.#p(e);return t.length?n`
            <div
                class="grid"
                role="listbox"
                aria-label="Blocks"
                @mouseleave=${()=>{this.activeId=null}}
            >
                ${t.map(e=>this.#m(e))}
            </div>
        `:n`<div class="empty">${this.query?`No matching Blocks.`:`No Blocks available.`}</div>`}#f(){let e=new Set;for(let t of this.items)t.item.group&&e.add(t.item.group);let t=[{id:`all`,label:`All`}];for(let n of[...e].sort((e,t)=>e.localeCompare(t)))t.push({id:n,label:n});return t}#p(e=this.activeTab){let t=this.query.trim().toLowerCase();return this.items.filter(n=>e!==`all`&&n.item.group!==e?!1:!t||[n.item.label,n.item.group,...n.item.keywords,...n.item.aliases].join(` `).toLowerCase().includes(t))}#m(e){let t=e.item.id,r=e.item.previewImageUrl?.trim();return n`
            <button
                type="button"
                class="card"
                role="option"
                data-active=${this.activeId===t?`true`:`false`}
                aria-selected=${String(this.activeId===t)}
                @mouseenter=${()=>{this.activeId=t}}
                @focus=${()=>{this.activeId=t}}
                @blur=${()=>{this.activeId===t&&(this.activeId=null)}}
                @click=${()=>this.#b(t)}
            >
                <div
                    class="thumb"
                    style=${e.item.icon?.color?`--vizy-block-accent-color: ${e.item.icon.color}`:``}
                >${r?n`<img src=${r} alt="" />`:this.#h(e)}</div>
                <span class="label">${e.item.label}</span>
            </button>
        `}#h(e){let t=e.item.icon?.svg?.trim(),r=e.item.icon?.name?.trim();return t&&r!==`vizy-block-fallback`?te(t):n`<pk-icon icon=${h} label=""></pk-icon>`}#g=e=>{let t=e.currentTarget;this.query=t.value??``};#_=e=>{let t=e.detail?.value?.trim();t&&(this.activeTab=t)};#v=e=>{let t=e.detail?.value?.[0];if(t===`list`||t===`grid`){this.#y(t);return}let n=e.currentTarget;n.value=[this.view]};#y(e){this.view=e,this.#s?.(e)}#b(e){this.#o?.(e)}};P([c({attribute:!1})],Jm.prototype,`items`,null),P([c()],Jm.prototype,`query`,null),P([c()],Jm.prototype,`view`,null),P([c({attribute:`active-tab`})],Jm.prototype,`activeTab`,null),P([a()],Jm.prototype,`activeId`,null),Jm=P([N(`vizy-block-browse-dialog`)],Jm);var Ym=class{#e=null;get isOpen(){return!!this.#e?.isOpen}open(e,t,n,r){this.close();let i=document.createElement(`vizy-block-browse-dialog`);this.#e=i,i.open({items:n,query:r.query,onSelect:n=>{let i=r.onSelect??(n=>Pm(e,t,n));e.suspendInsertionSideEffects?.();let a=i(n);this.close(),Promise.resolve(a).finally(()=>{e.resumeInsertionSideEffects?.()})},onView:e=>{r.onView(e)},onClose:()=>{this.#e===i&&(this.#e=null),r.onClose?.()}})}close(){this.#e?.close(),this.#e=null}},Xm=`Vizy.blockInsertView`;function Zm(e){let t=window.Craft?.systemUid;return`${typeof t==`string`&&t!==``?`Craft-${t}`:`Craft`}.${Xm}.${e}`}function Qm(e){if(!e||typeof localStorage>`u`)return`list`;try{return localStorage.getItem(Zm(e))===`grid`?`grid`:`list`}catch{return`list`}}function $m(e,t){if(!(!e||typeof localStorage>`u`))try{localStorage.setItem(Zm(e),t)}catch{}}var eh=new T(`vizySlash`),th=new Bm,nh=new Ym,rh=!1;function ih(e,t){if(e.manifest.slashInsert===!1)return null;let n=e.insertion.buildContext(`slash`,t);return!n||n.contentType===`blocks`||!e.editor.state.doc.resolve(t).parent.isTextblock||!e.insertion.query({context:n,kinds:Dm,limit:1}).length?null:n}function ah(e,t){if(e.doc.textBetween(t.from,t.to,``,``)!==`/`)return!1;let n=e.doc.resolve(t.from);if(!n.parent.isTextblock)return!1;let r=n.start(),i=n.end(),a=e.doc.textBetween(r,t.from,``,``),o=e.doc.textBetween(t.to,i,``,``);return a.length===0&&o.length===0}function oh(e,t){try{let n=e.view.coordsAtPos(t);return new DOMRect(n.left,n.top,0,n.bottom-n.top)}catch{return new DOMRect}}function sh(e,t,n){let r=Dm,i=[...e.insertion.query({context:t,kinds:r})];if(!i.length)return;let a=()=>oh(e.editor,n),o=a()??new DOMRect,s=e.manifest.field.fieldHandle?.trim()||``,c=Qm(s),l=r=>{let i=e.insertion.buildContext(`slash`,n);return!i||!jm(t,i)?Promise.resolve(!1):Pm(e,i,r)},u=i=>{$m(s,i);let a=[...e.insertion.query({context:t,kinds:r})];if(i===`grid`){th.close({restoreFocus:!1,animate:!1}),nh.open(e,t,a,{onView:r=>{$m(s,r),r===`list`&&(nh.close(),sh(e,t,n))},onSelect:l});return}nh.close(),sh(e,t,n)};if(c===`grid`){nh.open(e,t,i,{onView:u,onSelect:l});return}th.open(e,t,o,{kinds:r,getClientRect:a,filterMode:`panel`,autofocusFilter:!0,holdFieldFocus:!0,onRestoreFocus:()=>{e.editor.commands.focus(void 0,{scrollIntoView:!1})},onViewChange:u,onSelect:l})}function ch(e){return S.create({name:`vizySlash`,addProseMirrorPlugins(){return[Em({pluginKey:eh,editor:this.editor,char:`/`,startOfLine:!0,allowedPrefixes:null,allow:({range:t,state:n})=>ah(n,t)?ih(e(),t.from)!==null:!1,items:()=>[{}],render:()=>({onStart:t=>{let n=e(),r=t.range;if(!ah(n.editor.state,r))return;let i=ih(n,r.from);if(!i)return;rh=!0;let a=r.from;n.editor.chain().focus().deleteRange(r).run(),Tm(n.editor.view,eh);let o=n.insertion.buildContext(`slash`,a)??i;if(o.contentType===`blocks`){rh=!1;return}sh(n,o,a),rh=!1},onExit:()=>{rh||(th.close({restoreFocus:!1,animate:!1}),nh.close())}}),command:()=>void 0})]}})}function lh(e,t){let n=t.action;return n?.command===`toggleMark`?e.enabledMarks.includes(n.markName):n?.command===`setLink`?e.enabledMarks.includes(`link`):n?.command===`toggleNode`||n?.command===`insertNode`?e.enabledNodes.includes(n.nodeName):n?.command!==`setHeading`||e.enabledNodes.includes(`heading`)}function uh(e,t){let n=[];for(let r of t){if(r.kind===`group`){let t=uh(e,r.items??[]);t.length&&n.push({...r,items:t});continue}lh(e,r)&&n.push(r)}return n}function dh(e){let t=uh(e,e.toolbar?.controls??[]);return S.create({name:`vizyToolbar`,addStorage:()=>({controls:t})})}function fh(e){let t=uh(e,e.bubble?.controls??[]);return S.create({name:`vizyBubble`,addStorage:()=>({controls:t})})}function ph(e){return S.create({name:`vizyLayoutCommands`,addCommands(){return{wrapInLayout:()=>({editor:t,state:n})=>{let r=e();if(!r.manifest.enabledNodes.includes(`layout`))return!1;let i=ct(Ze(r.manifest)),{from:a,to:o}=n.selection;return!(n.selection instanceof A)&&!ft(t,a,o)?!1:qe(t,a,o,i,()=>crypto.randomUUID(),`small`,n)},unwrapLayout:()=>({editor:e,state:t,dispatch:n})=>{let r=dn(e,t.selection.from);if(!r)return!1;let i=String(r.node.attrs.layoutUid);return!n||gt(e,i)}}}})}function mh(e){if(e.type!==`paragraph`)return!1;let t=e.content;return!t?.length||t.every(e=>e.type===`text`&&!(e.text??``).length)}function hh(e,t){return t.field.rootContentType!==`rich`||e.type!==`doc`||(e.content??[]).length>0?e:{...e,content:[{type:`paragraph`}]}}function gh(e,t){if(t.field.rootContentType!==`rich`||e.type!==`doc`)return e;let n=e.content??[];return n.length!==1||!mh(n[0])?e:{type:`doc`,attrs:e.attrs,content:[]}}function _h(e){return S.create({name:`vizyRootTypingSurface`,addProseMirrorPlugins(){if(e.field.rootContentType!==`rich`)return[];let{paragraph:t}=this.editor.schema.nodes;return t?[new C({appendTransaction(e,n,r){if(r.doc.content.size>0)return null;let i=r.tr.insert(0,t.create());return i.setSelection(E.create(i.doc,1)),i}})]:[]}})}var vh=new Set([`doc`,`column`]);function yh(e){for(let t=e.depth;t>=0;--t)if(vh.has(e.node(t).type.name))return t;return 0}function bh(e){let{doc:t,selection:n}=e.state;if(n instanceof A&&n.node.type.name===`vizyBlock`)return!0;let r=yh(n.$from),i=n.$from.node(r);if(i.childCount===0)return!0;let a=Math.min(n.$from.index(r),i.childCount-1);if(i.child(a).type.name===`vizyBlock`)return!0;let o=a;for(;o>0&&i.child(o-1).type.name!==`vizyBlock`;)--o;let s=a;for(;s+1<i.childCount&&i.child(s+1).type.name!==`vizyBlock`;)s+=1;let c=n.$from.start(r);for(let e=0;e<o;e+=1)c+=i.child(e).nodeSize;let l=c;for(let e=o;e<=s;e+=1)l+=i.child(e).nodeSize;let u=Math.min(c+1,l),d=Math.max(u,l-1),f=E.between(t.resolve(u),t.resolve(d));return e.view.dispatch(e.state.tr.setSelection(f).scrollIntoView()),!0}function xh(e){let{doc:t,selection:n}=e.state;if(n instanceof A)return n.node.type.name===`vizyBlock`;if(n.empty)return!1;let r=!1;return t.descendants((e,t)=>{if(r)return!1;if(e.type.name===`vizyBlock`&&n.from<=t&&n.to>=t+e.nodeSize)return r=!0,!1}),r}var Sh=S.create({name:`vizySelectionBoundaries`,priority:1100,addKeyboardShortcuts(){let e=()=>xh(this.editor);return{"Mod-a":()=>bh(this.editor),Backspace:e,Delete:e,"Mod-Backspace":e,"Mod-Delete":e}}}),Ch=200,Z=function(){};Z.prototype.append=function(e){return e.length?(e=Z.from(e),!this.length&&e||e.length<Ch&&this.leafAppend(e)||this.length<Ch&&e.leafPrepend(this)||this.appendInner(e)):this},Z.prototype.prepend=function(e){return e.length?Z.from(e).append(this):this},Z.prototype.appendInner=function(e){return new Th(this,e)},Z.prototype.slice=function(e,t){return e===void 0&&(e=0),t===void 0&&(t=this.length),e>=t?Z.empty:this.sliceInner(Math.max(0,e),Math.min(this.length,t))},Z.prototype.get=function(e){if(!(e<0||e>=this.length))return this.getInner(e)},Z.prototype.forEach=function(e,t,n){t===void 0&&(t=0),n===void 0&&(n=this.length),t<=n?this.forEachInner(e,t,n,0):this.forEachInvertedInner(e,t,n,0)},Z.prototype.map=function(e,t,n){t===void 0&&(t=0),n===void 0&&(n=this.length);var r=[];return this.forEach(function(t,n){return r.push(e(t,n))},t,n),r},Z.from=function(e){return e instanceof Z?e:e&&e.length?new wh(e):Z.empty};var wh=function(e){function t(t){e.call(this),this.values=t}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={length:{configurable:!0},depth:{configurable:!0}};return t.prototype.flatten=function(){return this.values},t.prototype.sliceInner=function(e,n){return e==0&&n==this.length?this:new t(this.values.slice(e,n))},t.prototype.getInner=function(e){return this.values[e]},t.prototype.forEachInner=function(e,t,n,r){for(var i=t;i<n;i++)if(e(this.values[i],r+i)===!1)return!1},t.prototype.forEachInvertedInner=function(e,t,n,r){for(var i=t-1;i>=n;i--)if(e(this.values[i],r+i)===!1)return!1},t.prototype.leafAppend=function(e){if(this.length+e.length<=Ch)return new t(this.values.concat(e.flatten()))},t.prototype.leafPrepend=function(e){if(this.length+e.length<=Ch)return new t(e.flatten().concat(this.values))},n.length.get=function(){return this.values.length},n.depth.get=function(){return 0},Object.defineProperties(t.prototype,n),t}(Z);Z.empty=new wh([]);var Th=function(e){function t(t,n){e.call(this),this.left=t,this.right=n,this.length=t.length+n.length,this.depth=Math.max(t.depth,n.depth)+1}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype.flatten=function(){return this.left.flatten().concat(this.right.flatten())},t.prototype.getInner=function(e){return e<this.left.length?this.left.get(e):this.right.get(e-this.left.length)},t.prototype.forEachInner=function(e,t,n,r){var i=this.left.length;if(t<i&&this.left.forEachInner(e,t,Math.min(n,i),r)===!1||n>i&&this.right.forEachInner(e,Math.max(t-i,0),Math.min(this.length,n)-i,r+i)===!1)return!1},t.prototype.forEachInvertedInner=function(e,t,n,r){var i=this.left.length;if(t>i&&this.right.forEachInvertedInner(e,t-i,Math.max(n,i)-i,r+i)===!1||n<i&&this.left.forEachInvertedInner(e,Math.min(t,i),n,r)===!1)return!1},t.prototype.sliceInner=function(e,t){if(e==0&&t==this.length)return this;var n=this.left.length;return t<=n?this.left.slice(e,t):e>=n?this.right.slice(e-n,t-n):this.left.slice(e,n).append(this.right.slice(0,t-n))},t.prototype.leafAppend=function(e){var n=this.right.leafAppend(e);if(n)return new t(this.left,n)},t.prototype.leafPrepend=function(e){var n=this.left.leafPrepend(e);if(n)return new t(n,this.right)},t.prototype.appendInner=function(e){return this.left.depth>=Math.max(this.right.depth,e.depth)+1?new t(this.left,new t(this.right,e)):new t(this,e)},t}(Z),Eh=500,Dh=class e{constructor(e,t){this.items=e,this.eventCount=t}popEvent(t,n){if(this.eventCount==0)return null;let r=this.items.length;for(;;r--)if(this.items.get(r-1).selection){--r;break}let i,a;n&&(i=this.remapping(r,this.items.length),a=i.maps.length);let o=t.tr,s,c,l=[],u=[];return this.items.forEach((t,n)=>{if(!t.step){i||(i=this.remapping(r,n+1),a=i.maps.length),a--,u.push(t);return}if(i){u.push(new kh(t.map));let e=t.step.map(i.slice(a)),n;e&&o.maybeStep(e).doc&&(n=o.mapping.maps[o.mapping.maps.length-1],l.push(new kh(n,void 0,void 0,l.length+u.length))),a--,n&&i.appendMap(n,a)}else o.maybeStep(t.step);if(t.selection)return s=i?t.selection.map(i.slice(a)):t.selection,c=new e(this.items.slice(0,r).append(u.reverse().concat(l)),this.eventCount-1),!1},this.items.length,0),{remaining:c,transform:o,selection:s}}addTransform(t,n,r,i){let a=[],o=this.eventCount,s=this.items,c=!i&&s.length?s.get(s.length-1):null;for(let e=0;e<t.steps.length;e++){let r=t.steps[e].invert(t.docs[e]),l=new kh(t.mapping.maps[e],r,n),u;(u=c&&c.merge(l))&&(l=u,e?a.pop():s=s.slice(0,s.length-1)),a.push(l),n&&=(o++,void 0),i||(c=l)}let l=o-r.depth;return l>jh&&(s=Oh(s,l),o-=l),new e(s.append(a),o)}remapping(e,t){let n=new Xe;return this.items.forEach((t,r)=>{let i=t.mirrorOffset!=null&&r-t.mirrorOffset>=e?n.maps.length-t.mirrorOffset:void 0;n.appendMap(t.map,i)},e,t),n}addMaps(t){return this.eventCount==0?this:new e(this.items.append(t.map(e=>new kh(e))),this.eventCount)}rebased(t,n){if(!this.eventCount)return this;let r=[],i=Math.max(0,this.items.length-n),a=t.mapping,o=t.steps.length,s=this.eventCount;this.items.forEach(e=>{e.selection&&s--},i);let c=n;this.items.forEach(e=>{let n=a.getMirror(--c);if(n==null)return;o=Math.min(o,n);let i=a.maps[n];if(e.step){let o=t.steps[n].invert(t.docs[n]),l=e.selection&&e.selection.map(a.slice(c+1,n));l&&s++,r.push(new kh(i,o,l))}else r.push(new kh(i))},i);let l=[];for(let e=n;e<o;e++)l.push(new kh(a.maps[e]));let u=this.items.slice(0,i).append(l).append(r),d=new e(u,s);return d.emptyItemCount()>Eh&&(d=d.compress(this.items.length-r.length)),d}emptyItemCount(){let e=0;return this.items.forEach(t=>{t.step||e++}),e}compress(t=this.items.length){let n=this.remapping(0,t),r=n.maps.length,i=[],a=0;return this.items.forEach((e,o)=>{if(o>=t)i.push(e),e.selection&&a++;else if(e.step){let t=e.step.map(n.slice(r)),o=t&&t.getMap();if(r--,o&&n.appendMap(o,r),t){let s=e.selection&&e.selection.map(n.slice(r));s&&a++;let c=new kh(o.invert(),t,s),l,u=i.length-1;(l=i.length&&i[u].merge(c))?i[u]=l:i.push(c)}}else e.map&&r--},this.items.length,0),new e(Z.from(i.reverse()),a)}};Dh.empty=new Dh(Z.empty,0);function Oh(e,t){let n;return e.forEach((e,r)=>{if(e.selection&&t--==0)return n=r,!1}),e.slice(n)}var kh=class e{constructor(e,t,n,r){this.map=e,this.step=t,this.selection=n,this.mirrorOffset=r}merge(t){if(this.step&&t.step&&!t.selection){let n=t.step.merge(this.step);if(n)return new e(n.getMap().invert(),n,this.selection)}}},Ah=class{constructor(e,t,n,r,i){this.done=e,this.undone=t,this.prevRanges=n,this.prevTime=r,this.prevComposition=i}},jh=20;function Mh(e,t,n,r){let i=n.getMeta(Bh),a;if(i)return i.historyState;n.getMeta(Vh)&&(e=new Ah(e.done,e.undone,null,0,-1));let o=n.getMeta(`appendedTransaction`);if(n.steps.length==0)return e;if(o&&o.getMeta(Bh))return o.getMeta(Bh).redo?new Ah(e.done.addTransform(n,void 0,r,zh(t)),e.undone,Ph(n.mapping.maps),e.prevTime,e.prevComposition):new Ah(e.done,e.undone.addTransform(n,void 0,r,zh(t)),null,e.prevTime,e.prevComposition);if(n.getMeta(`addToHistory`)!==!1&&!(o&&o.getMeta(`addToHistory`)===!1)){let i=n.getMeta(`composition`),a=e.prevTime==0||!o&&e.prevComposition!=i&&(e.prevTime<(n.time||0)-r.newGroupDelay||!Nh(n,e.prevRanges)),s=o?Fh(e.prevRanges,n.mapping):Ph(n.mapping.maps);return new Ah(e.done.addTransform(n,a?t.selection.getBookmark():void 0,r,zh(t)),Dh.empty,s,n.time,i??e.prevComposition)}return(a=n.getMeta(`rebased`))?new Ah(e.done.rebased(n,a),e.undone.rebased(n,a),Fh(e.prevRanges,n.mapping),e.prevTime,e.prevComposition):new Ah(e.done.addMaps(n.mapping.maps),e.undone.addMaps(n.mapping.maps),Fh(e.prevRanges,n.mapping),e.prevTime,e.prevComposition)}function Nh(e,t){if(!t)return!1;if(!e.docChanged)return!0;let n=!1;return e.mapping.maps[0].forEach((e,r)=>{for(let i=0;i<t.length;i+=2)e<=t[i+1]&&r>=t[i]&&(n=!0)}),n}function Ph(e){let t=[];for(let n=e.length-1;n>=0&&t.length==0;n--)e[n].forEach((e,n,r,i)=>t.push(r,i));return t}function Fh(e,t){if(!e)return null;let n=[];for(let r=0;r<e.length;r+=2){let i=t.map(e[r],1),a=t.map(e[r+1],-1);i<=a&&n.push(i,a)}return n}function Ih(e,t,n){let r=zh(t),i=Bh.get(t).spec.config,a=(n?e.undone:e.done).popEvent(t,r);if(!a)return null;let o=a.selection.resolve(a.transform.doc),s=(n?e.done:e.undone).addTransform(a.transform,t.selection.getBookmark(),i,r),c=new Ah(n?s:a.remaining,n?a.remaining:s,null,0,-1);return a.transform.setSelection(o).setMeta(Bh,{redo:n,historyState:c})}var Lh=!1,Rh=null;function zh(e){let t=e.plugins;if(Rh!=t){Lh=!1,Rh=t;for(let e=0;e<t.length;e++)if(t[e].spec.historyPreserveItems){Lh=!0;break}}return Lh}var Bh=new T(`history`),Vh=new T(`closeHistory`);function Hh(e={}){return e={depth:e.depth||100,newGroupDelay:e.newGroupDelay||500},new C({key:Bh,state:{init(){return new Ah(Dh.empty,Dh.empty,null,0,-1)},apply(t,n,r){return Mh(n,r,t,e)}},config:e,props:{handleDOMEvents:{beforeinput(e,t){let n=t.inputType,r=n==`historyUndo`?Wh:n==`historyRedo`?Gh:null;return!r||!e.editable?!1:(t.preventDefault(),r(e.state,e.dispatch))}}}})}function Uh(e,t){return(n,r)=>{let i=Bh.getState(n);if(!i||(e?i.undone:i.done).eventCount==0)return!1;if(r){let a=Ih(i,n,e);a&&r(t?a.scrollIntoView():a)}return!0}}var Wh=Uh(!1,!0),Gh=Uh(!0,!0);function Kh(e){return e.getMeta(Bh)!=null}function qh(){return new C({appendTransaction(e,t,n){if(!e.some(Kh))return null;let r=new Map;t.doc.descendants(e=>{e.type.name===`vizyBlock`&&r.set(String(e.attrs.blockUid),e)});let i=n.tr.setMeta(`addToHistory`,!1);return n.doc.descendants((e,t)=>{if(e.type.name!==`vizyBlock`)return;let n=r.get(String(e.attrs.blockUid));if(!(!n||n.attrs.blockTypeUid!==e.attrs.blockTypeUid))for(let r of[`fieldSlots`,`matrixAnchorUid`])JSON.stringify(e.attrs[r])!==JSON.stringify(n.attrs[r])&&i.setNodeAttribute(t,r,n.attrs[r])}),i.docChanged?i:null}})}function Jh(e,t){let n=(t,r,i)=>{if(t.eq(r))return;if(t.type!==r.type){e.replaceWith(i,i+t.nodeSize,r);return}if(t.isText){let n=t.text,a=r.text,o=0,s=n.length,c=a.length;for(;o<s&&o<c&&n[o]===a[o];)o++;for(;s>o&&c>o&&n[s-1]===a[c-1];)s--,c--;if(o<s||o<c){let t=a.slice(o,c);e.replaceWith(i+o,i+s,t?r.type.schema.text(t,r.marks):[])}if(!We.sameSet(t.marks,r.marks)){e.removeMark(i,i+a.length);for(let t of r.marks)e.addMark(i,i+a.length,t)}return}for(let n of Object.keys(r.attrs))JSON.stringify(t.attrs[n])!==JSON.stringify(r.attrs[n])&&(i<0?e.setDocAttribute(n,r.attrs[n]):e.setNodeAttribute(i,n,r.attrs[n]));i>=0&&!We.sameSet(t.marks,r.marks)&&e.setNodeMarkup(i,void 0,r.attrs,r.marks);let a=i+1,o=[];if(t.childCount===r.childCount&&t.forEach((e,t,n)=>{o.push({before:e,after:r.child(n),pos:a+t})}),t.childCount===r.childCount&&o.every(e=>e.before.type===e.after.type)){for(let e of o.reverse())n(e.before,e.after,e.pos);return}let s=t.content.findDiffStart(r.content),c=t.content.findDiffEnd(r.content);if(s===null||c===null)return;let l=Math.max(0,s-Math.min(c.a,c.b));e.replace(a+s,a+c.a+l,r.slice(s,c.b+l))};return n(e.doc,t,-1),e}function Yh(e={}){return new C({view(t){return new Xh(t,e)}})}var Xh=class{constructor(e,t){this.editorView=e,this.cursorPos=null,this.element=null,this.timeout=-1,this.lastDragEvent=null,this.width=t.width??1,this.color=t.color===!1?void 0:t.color||`black`,this.class=t.class,this.handlers=[`dragover`,`dragend`,`drop`,`dragleave`].map(t=>{let n=e=>{this[t](e)};return e.dom.addEventListener(t,n),{name:t,handler:n}})}destroy(){this.handlers.forEach(({name:e,handler:t})=>this.editorView.dom.removeEventListener(e,t))}update(e,t){if(this.cursorPos!=null&&t.doc!=e.state.doc){if(this.lastDragEvent){let e=this.computeTarget(this.lastDragEvent);e==this.cursorPos?this.updateOverlay():this.setCursor(e)}else this.updateOverlay()}}setCursor(e){e!=this.cursorPos&&(this.cursorPos=e,e==null?(this.element.parentNode.removeChild(this.element),this.element=null):this.updateOverlay())}updateOverlay(){let e=this.editorView.state.doc.resolve(this.cursorPos),t=!e.parent.inlineContent,n,r=this.editorView.dom,i=r.getBoundingClientRect(),a=i.width/r.offsetWidth,o=i.height/r.offsetHeight;if(t){let t=e.nodeBefore,r=e.nodeAfter;if(t||r){let e=this.editorView.nodeDOM(this.cursorPos-(t?t.nodeSize:0));if(e){let i=e.getBoundingClientRect(),a=t?i.bottom:i.top;t&&r&&(a=(a+this.editorView.nodeDOM(this.cursorPos).getBoundingClientRect().top)/2);let s=this.width/2*o;n={left:i.left,right:i.right,top:a-s,bottom:a+s}}}}if(!n){let e=this.editorView.coordsAtPos(this.cursorPos),t=this.width/2*a;n={left:e.left-t,right:e.left+t,top:e.top,bottom:e.bottom}}let s=this.editorView.dom.offsetParent;this.element||(this.element=s.appendChild(document.createElement(`div`)),this.class&&(this.element.className=this.class),this.element.style.cssText=`position: absolute; z-index: 50; pointer-events: none;`,this.color&&(this.element.style.backgroundColor=this.color)),this.element.classList.toggle(`prosemirror-dropcursor-block`,t),this.element.classList.toggle(`prosemirror-dropcursor-inline`,!t);let c,l;if(!s||s==document.body&&getComputedStyle(s).position==`static`)c=-pageXOffset,l=-pageYOffset;else{let e=s.getBoundingClientRect(),t=e.width/s.offsetWidth,n=e.height/s.offsetHeight;c=e.left-s.scrollLeft*t,l=e.top-s.scrollTop*n}this.element.style.left=(n.left-c)/a+`px`,this.element.style.top=(n.top-l)/o+`px`,this.element.style.width=(n.right-n.left)/a+`px`,this.element.style.height=(n.bottom-n.top)/o+`px`}scheduleRemoval(e){clearTimeout(this.timeout),this.timeout=setTimeout(()=>this.setCursor(null),e)}computeTarget(e){let t=this.editorView.posAtCoords({left:e.clientX,top:e.clientY}),n=t&&t.inside>=0&&this.editorView.state.doc.nodeAt(t.inside),r=n&&n.type.spec.disableDropCursor,i=typeof r==`function`?r(this.editorView,t,e):r;if(!t||i)return null;let a=t.pos;if(this.editorView.dragging&&this.editorView.dragging.slice){let e=vt(this.editorView.state.doc,a,this.editorView.dragging.slice);e!=null&&(a=e)}return a}dragover(e){if(!this.editorView.editable)return;this.lastDragEvent=e;let t=this.computeTarget(e);t!=null&&(this.setCursor(t),this.scheduleRemoval(5e3))}dragend(){this.scheduleRemoval(20)}drop(){this.scheduleRemoval(20)}dragleave(e){this.editorView.dom.contains(e.relatedTarget)||this.setCursor(null)}},Q=class e extends k{constructor(e){super(e,e)}map(t,n){let r=t.resolve(n.map(this.head));return e.valid(r)?new e(r):k.near(r)}content(){return j.empty}eq(t){return t instanceof e&&t.head==this.head}toJSON(){return{type:`gapcursor`,pos:this.head}}static fromJSON(t,n){if(typeof n.pos!=`number`)throw RangeError(`Invalid input for GapCursor.fromJSON`);return new e(t.resolve(n.pos))}getBookmark(){return new Zh(this.anchor)}static valid(e){let t=e.parent;if(t.inlineContent||!$h(e)||!eg(e))return!1;let n=t.type.spec.allowGapCursor;if(n!=null)return n;let r=t.contentMatchAt(e.index()).defaultType;return r&&r.isTextblock}static findGapCursorFrom(t,n,r=!1){search:for(;;){if(!r&&e.valid(t))return t;let i=t.pos,a=null;for(let r=t.depth;;r--){let o=t.node(r);if(n>0?t.indexAfter(r)<o.childCount:t.index(r)>0){a=o.child(n>0?t.indexAfter(r):t.index(r)-1);break}if(r==0)return null;i+=n;let s=t.doc.resolve(i);if(e.valid(s))return s}for(;;){let o=n>0?a.firstChild:a.lastChild;if(!o){if(a.isAtom&&!a.isText&&!A.isSelectable(a)){t=t.doc.resolve(i+a.nodeSize*n),r=!1;continue search}break}a=o,i+=n;let s=t.doc.resolve(i);if(e.valid(s))return s}return null}}};Q.prototype.visible=!1,Q.findFrom=Q.findGapCursorFrom,k.jsonID(`gapcursor`,Q);var Zh=class e{constructor(e){this.pos=e}map(t){return new e(t.map(this.pos))}resolve(e){let t=e.resolve(this.pos);return Q.valid(t)?new Q(t):k.near(t)}};function Qh(e){return e.isAtom||e.spec.isolating||e.spec.createGapCursor}function $h(e){for(let t=e.depth;t>=0;t--){let n=e.index(t),r=e.node(t);if(n==0){if(r.type.spec.isolating)return!0;continue}for(let e=r.child(n-1);;e=e.lastChild){if(e.childCount==0&&!e.inlineContent||Qh(e.type))return!0;if(e.inlineContent)return!1}}return!0}function eg(e){for(let t=e.depth;t>=0;t--){let n=e.indexAfter(t),r=e.node(t);if(n==r.childCount){if(r.type.spec.isolating)return!0;continue}for(let e=r.child(n);;e=e.firstChild){if(e.childCount==0&&!e.inlineContent||Qh(e.type))return!0;if(e.inlineContent)return!1}}return!0}function tg(){return new C({props:{decorations:og,createSelectionBetween(e,t,n){return t.pos==n.pos&&Q.valid(n)?new Q(n):null},handleClick:ig,handleKeyDown:ng,handleDOMEvents:{beforeinput:ag}}})}var ng=pt({ArrowLeft:rg(`horiz`,-1),ArrowRight:rg(`horiz`,1),ArrowUp:rg(`vert`,-1),ArrowDown:rg(`vert`,1)});function rg(e,t){let n=e==`vert`?t>0?`down`:`up`:t>0?`right`:`left`;return function(e,r,i){let a=e.selection,o=t>0?a.$to:a.$from,s=a.empty;if(a instanceof E){if(!i.endOfTextblock(n)||o.depth==0)return!1;s=!1,o=e.doc.resolve(t>0?o.after():o.before())}let c=Q.findGapCursorFrom(o,t,s);return c?(r&&r(e.tr.setSelection(new Q(c))),!0):!1}}function ig(e,t,n){if(!e||!e.editable)return!1;let r=e.state.doc.resolve(t);if(!Q.valid(r))return!1;let i=e.posAtCoords({left:n.clientX,top:n.clientY});return i&&i.inside>-1&&A.isSelectable(e.state.doc.nodeAt(i.inside))?!1:(e.dispatch(e.state.tr.setSelection(new Q(r))),!0)}function ag(e,t){if(t.inputType!=`insertCompositionText`||!(e.state.selection instanceof Q))return!1;let{$from:n}=e.state.selection,r=n.parent.contentMatchAt(n.index()).findWrapping(e.state.schema.nodes.text);if(!r)return!1;let i=M.empty;for(let e=r.length-1;e>=0;e--)i=M.from(r[e].createAndFill(null,i));let a=e.state.tr.replace(n.pos,n.pos,new j(i,0,0));return a.setSelection(E.near(a.doc.resolve(n.pos+1))),e.dispatch(a),!1}function og(e){if(!(e.selection instanceof Q))return null;let t=document.createElement(`div`);return t.className=`ProseMirror-gapcursor`,O.create(e.doc,[Ke.widget(e.selection.head,t,{key:`gapcursor`})])}S.create({name:`characterCount`,addOptions(){return{limit:null,autoTrim:!0,mode:`textSize`,textCounter:e=>e.length,wordCounter:e=>e.split(` `).filter(e=>e!==``).length}},addStorage(){return{characters:()=>0,words:()=>0}},onBeforeCreate(){this.storage.characters=e=>{let t=e?.node||this.editor.state.doc;if((e?.mode||this.options.mode)===`textSize`){let e=t.textBetween(0,t.content.size,void 0,` `);return this.options.textCounter(e)}return t.nodeSize},this.storage.words=e=>{let t=e?.node||this.editor.state.doc,n=t.textBetween(0,t.content.size,` `,` `);return this.options.wordCounter(n)}},addProseMirrorPlugins(){let e=!1;return[new C({key:new T(`characterCount`),appendTransaction:(t,n,r)=>{if(e)return;let i=this.options.limit,a=this.options.autoTrim;if(i==null||i===0||a===!1){e=!0;return}let o=this.storage.characters({node:r.doc});if(o>i){let t=o-i;console.warn(`[CharacterCount] Initial content exceeded limit of ${i} characters. Content was automatically trimmed.`);let n=r.tr.deleteRange(0,t);return e=!0,n}e=!0},filterTransaction:(e,t)=>{let n=this.options.limit;if(!e.docChanged||n===0||n==null)return!0;let r=this.storage.characters({node:t.doc}),i=this.storage.characters({node:e.doc});if(i<=n||r>n&&i>n&&i<=r)return!0;if(r>n&&i>n&&i>r||!e.getMeta(`paste`))return!1;let a=e.selection.$head.pos,o=a-(i-n),s=a;return e.deleteRange(o,s),!(this.storage.characters({node:e.doc})>n)}})]}}),S.create({name:`dropCursor`,addOptions(){return{color:`currentColor`,width:1,class:void 0}},addProseMirrorPlugins(){return[Yh(this.options)]}}),S.create({name:`focus`,addOptions(){return{className:`has-focus`,mode:`all`}},addProseMirrorPlugins(){return[new C({key:new T(`focus`),props:{decorations:({doc:e,selection:t})=>{let{isEditable:n,isFocused:r}=this.editor,{anchor:i}=t,a=[];if(!n||!r)return O.create(e,[]);let o=0;this.options.mode===`deepest`&&e.descendants((e,t)=>{if(!e.isText){if(!(i>=t&&i<=t+e.nodeSize-1))return!1;o+=1}});let s=0;return e.descendants((e,t)=>{if(e.isText||!(i>=t&&i<=t+e.nodeSize-1))return!1;if(s+=1,this.options.mode===`deepest`&&o-s>0||this.options.mode===`shallowest`&&s>1)return this.options.mode===`deepest`;a.push(Ke.node(t,t+e.nodeSize,{class:this.options.className}))}),O.create(e,a)}}})]}});var sg=S.create({name:`gapCursor`,addProseMirrorPlugins(){return[tg()]},extendNodeSchema(e){let t={name:e.name,options:e.options,storage:e.storage};return{allowGapCursor:et(St(e,`allowGapCursor`,t))??null}}}),cg=`placeholder`,lg=new T(`tiptap__placeholder`);function ug(e){let{editor:t,placeholder:n,dataAttribute:r,pos:i,node:a,isEmptyDoc:o,hasAnchor:s,classes:{emptyNode:c,emptyEditor:l}}=e,u=[c];return o&&u.push(l),Ke.node(i,i+a.nodeSize,{class:u.join(` `),[r]:typeof n==`function`?n({editor:t,node:a,pos:i,hasAnchor:s}):n})}function dg(e,t){return typeof e==`function`?e(t):e}function fg({editor:e,options:t,dataAttribute:n,doc:r,selection:i,from:a,to:o}){let{anchor:s}=i,c=[],l=e.isEmpty;return r.nodesBetween(a,o,(r,i)=>{let a=s>=i&&s<=i+r.nodeSize,o=!r.isLeaf&&Ie(r);return r.type.isTextblock&&(a||!t.showOnlyCurrent)&&o&&c.push(ug({editor:e,isEmptyDoc:l,dataAttribute:n,hasAnchor:a,placeholder:t.placeholder,classes:{emptyEditor:t.emptyEditorClass,emptyNode:dg(t.emptyNodeClass,{editor:e,node:r,pos:i,hasAnchor:a})},node:r,pos:i})),t.includeChildren}),c}function pg({editor:e,options:t,dataAttribute:n,doc:r,selection:i}){if(!(e.isEditable||!t.showOnlyWhenEditable))return null;let{anchor:a}=i,o=[],s=e.isEmpty;if(t.showOnlyCurrent&&!t.includeChildren){let i=r.resolve(a),c=i.depth>0?i.node(1):i.nodeAfter,l=i.depth>0?i.before(1):a;if(c&&c.type.isTextblock&&Ie(c)){let r=a>=l&&a<=l+c.nodeSize;o.push(ug({editor:e,isEmptyDoc:s,dataAttribute:n,hasAnchor:r,placeholder:t.placeholder,classes:{emptyEditor:t.emptyEditorClass,emptyNode:dg(t.emptyNodeClass,{editor:e,node:c,pos:l,hasAnchor:r})},node:c,pos:l}))}}else o.push(...fg({editor:e,options:t,dataAttribute:n,doc:r,selection:i,from:0,to:r.content.size}));return O.create(r,o)}function mg(e,t){let n=e.resolve(t);if(n.depth===0){let e=n.nodeAfter??n.nodeBefore;if(!e)return{from:t,to:t};let r=n.nodeAfter?t:t-e.nodeSize;return{from:r,to:r+e.nodeSize}}let r=n.before(1);return{from:r,to:r+n.node(1).nodeSize}}function hg(e,t){return{from:Math.max(0,t.from-1),to:Math.min(e.content.size,t.to-1)}}function gg(e,t,n){let r=[];return e.forEach((e,i)=>{let a=i,o=a+e.nodeSize,s=a+1,c=o+1;s<n&&c>t&&r.push({from:a,to:o})}),r}function _g(e){if(e.length===0)return[];let t=[...e].sort((e,t)=>e.from-t.from),n=[{...t[0]}];for(let e=1;e<t.length;e+=1){let r=n[n.length-1],i=t[e];i.from<=r.to?r.to=Math.max(r.to,i.to):n.push({...i})}return n}function vg(e,t){let n=gg(e,t.from,t.to);return n.push(hg(e,mg(e,t.from))),t.to>t.from?n.push(hg(e,mg(e,Math.min(t.to,e.content.size+1)-1))):t.from<e.content.size+1&&n.push(hg(e,mg(e,Math.min(t.from+1,e.content.size)))),n}function yg(e,t,n){let r=[];if(e.docChanged){let t=ke(e);for(let e of t)r.push(...vg(n.doc,e.newRange))}return e.selectionSet&&(r.push(hg(n.doc,mg(n.doc,e.mapping.map(t.selection.anchor)))),r.push(hg(n.doc,mg(n.doc,n.selection.anchor)))),_g(r)}function bg(e,t,n){let r=Math.max(0,Math.min(e,n.content.size));return{from:r,to:Math.max(r,Math.min(t,n.content.size))}}function xg({decorations:e,ranges:t,editor:n,options:r,dataAttribute:i,doc:a,selection:o}){let s=e;for(let e of t){let{from:t,to:c}=bg(e.from,e.to,a),l=s.find(t,c).filter(e=>e.from>=t&&e.to<=c);l.length&&(s=s.remove(l));let u=fg({editor:n,options:r,dataAttribute:i,doc:a,selection:o,from:t,to:c});u.length&&(s=s.add(a,u))}return s}function Sg({editor:e,options:t,dataAttribute:n}){return{init(r,i){return pg({editor:e,options:t,dataAttribute:n,doc:i.doc,selection:i.selection})??O.empty},apply(r,i,a,o){return!r.docChanged&&!r.selectionSet?i:xg({decorations:i.map(r.mapping,r.doc),ranges:yg(r,a,o),editor:e,options:t,dataAttribute:n,doc:o.doc,selection:o.selection})}}}function Cg(e){return e.replace(/\s+/g,`-`).replace(/[^a-zA-Z0-9-]/g,``).replace(/^[0-9-]+/,``).replace(/^-+/,``).toLowerCase()}function wg({editor:e,options:t}){let n=t.dataAttribute?`data-${Cg(t.dataAttribute)}`:`data-${cg}`,r=t.showOnlyCurrent&&!t.includeChildren;return new C({key:lg,...r?{}:{state:Sg({editor:e,options:t,dataAttribute:n})},props:{decorations:r?({doc:r,selection:i})=>pg({editor:e,options:t,dataAttribute:n,doc:r,selection:i}):n=>t.showOnlyWhenEditable&&!e.isEditable?O.empty:lg.getState(n)??O.empty}})}S.create({name:`placeholder`,addOptions(){return{emptyEditorClass:`is-editor-empty`,emptyNodeClass:`is-empty`,dataAttribute:cg,placeholder:`Write something …`,showOnlyWhenEditable:!0,showOnlyCurrent:!0,includeChildren:!1}},addProseMirrorPlugins(){return[wg({editor:this.editor,options:this.options})]}});function Tg(e,t){return!e.selection.empty&&!Re(e.selection)&&t.isEditable}function Eg(e,t){return Tg(e,t)&&!t.isFocused&&!t.view.dragging}function Dg(){var e;(e=window.getSelection())==null||e.removeAllRanges()}function Og(e){e.focus()}S.create({name:`selection`,addOptions(){return{className:`selection`}},addProseMirrorPlugins(){let{editor:e,options:t}=this;return[new C({key:new T(`selection`),props:{decorations(n){return Eg(n,e)?O.create(n.doc,[Ke.inline(n.selection.from,n.selection.to,{class:t.className})]):null},handleDOMEvents:{blur(t){return Tg(t.state,e)&&Dg(),!1},focus(t){return Tg(t.state,e)&&requestAnimationFrame(()=>{!e.isDestroyed&&t.hasFocus()&&Og(t)}),!1}}}})]}});function kg({types:e,node:t}){return t&&Array.isArray(e)&&e.includes(t.type)||t?.type===e}S.create({name:`trailingNode`,addOptions(){return{node:void 0,notAfter:[]}},addProseMirrorPlugins(){let e=new T(this.name),t=this.options.node||this.editor.schema.topNodeType.contentMatch.defaultType?.name||`paragraph`,n=Object.entries(this.editor.schema.nodes).map(([,e])=>e).filter(e=>(this.options.notAfter||[]).concat(t).includes(e.name));return[new C({key:e,appendTransaction:(n,r,i)=>{let{doc:a,tr:o,schema:s}=i,c=e.getState(i),l=a.content.size,u=s.nodes[t];if(!n.some(e=>e.getMeta(`skipTrailingNode`))&&c)return o.insert(l,u.create())},state:{init:(e,t)=>{let r=t.tr.doc.lastChild;return!kg({node:r,types:n})},apply:(e,t)=>{if(!e.docChanged||e.getMeta(`__uniqueIDTransaction`))return t;let r=e.doc.lastChild;return!kg({node:r,types:n})}}})]}});var Ag=S.create({name:`undoRedo`,addOptions(){return{depth:100,newGroupDelay:500}},addCommands(){return{undo:()=>({state:e,dispatch:t})=>Wh(e,t),redo:()=>({state:e,dispatch:t})=>Gh(e,t)}},addProseMirrorPlugins(){return[Hh(this.options)]},addKeyboardShortcuts(){return{"Mod-z":()=>this.editor.commands.undo(),"Shift-Mod-z":()=>this.editor.commands.redo(),"Mod-y":()=>this.editor.commands.redo(),"Mod-я":()=>this.editor.commands.undo(),"Shift-Mod-я":()=>this.editor.commands.redo()}}}),jg=S.create({name:`textAlign`,addOptions(){return{types:[],alignments:[`left`,`center`,`right`,`justify`],defaultAlignment:null}},addGlobalAttributes(){return[{types:this.options.types,attributes:{textAlign:{default:this.options.defaultAlignment,parseHTML:e=>{let t=e.style.textAlign;return this.options.alignments.includes(t)?t:this.options.defaultAlignment},renderHTML:e=>e.textAlign?{style:`text-align: ${e.textAlign}`}:{}}}}]},addCommands(){return{setTextAlign:e=>({commands:t})=>this.options.alignments.includes(e)?this.options.types.map(n=>t.updateAttributes(n,{textAlign:e})).some(e=>e):!1,unsetTextAlign:()=>({commands:e})=>this.options.types.map(t=>e.resetAttributes(t,`textAlign`)).some(e=>e),toggleTextAlign:e=>({editor:t,commands:n})=>this.options.alignments.includes(e)?t.isActive({textAlign:e})?n.unsetTextAlign():n.setTextAlign(e):!1}},addKeyboardShortcuts(){return{"Mod-Shift-l":()=>this.editor.commands.setTextAlign(`left`),"Mod-Shift-e":()=>this.editor.commands.setTextAlign(`center`),"Mod-Shift-r":()=>this.editor.commands.setTextAlign(`right`),"Mod-Shift-j":()=>this.editor.commands.setTextAlign(`justify`)}}});function Mg(e,t){let n=Ls(e.toJSON(),void 0,t),r=e.content.firstChild?.type.schema;return r?j.fromJSON(r,n):e}var Ng=S.create({name:`vizyCopyIdentity`,addOptions:()=>({schemaIdentity:{}}),addProseMirrorPlugins(){let e=this.options.schemaIdentity;return[new C({props:{transformPasted(t,n){return n.dragging?.move?t:Mg(t,e)},handleDrop(t,n,r,i){if(i||!r)return!1;let a=t.posAtCoords({left:n.clientX,top:n.clientY});if(!a)return!0;let o=Mg(r,e);return t.dispatch(t.state.tr.replaceRange(a.pos,a.pos,o).scrollIntoView()),!0}}})]}});function Pg(e,t){let n=em(e.modules,{manifest:e,services:t}),r=new Map;for(let e of n){if(r.has(e.name))throw Error(`duplicateEditorExtension:${e.name}`);r.set(e.name,e)}let i=new Set([...e.enabledNodes,...e.enabledMarks,...e.internalNodes]);for(let e of i)if(!r.has(e))throw Error(`missingProductionExtension:${e}`);let a=[`paragraph`,`heading`].filter(e=>r.has(e));return[...r.values(),Ag,S.create({name:`vizyFieldHistory`,addProseMirrorPlugins:()=>[qh()]}),sg,_h(e),Sh,jg.configure({types:a}),mc,hc,gc.configure({schemaIdentity:e.blockTypes,beforeCopy:()=>t().flushMountedFields?.()}),Ng.configure({schemaIdentity:e.blockTypes}),lm(e),am.configure({manifest:e}),dh(e),fh(e),ch(t),...e.enabledNodes.includes(`layout`)?[ph(t)]:[]]}function Fg(e){let t=[];return e.forEach(e=>{e.type.name===`vizyBlock`&&t.push(e)}),t}function Ig(e,t,n){return{kind:`root`,node:e,contentType:n.field.rootContentType,allowedBlockTypeUids:n.field.allowedBlockTypeUids,minBlocks:n.field.minBlocks,maxBlocks:n.field.maxBlocks}}function Lg(e,t){let n=e.resolve(Math.max(0,Math.min(t,e.content.size))),r=0;for(let e=n.depth;e>=0;--e)n.node(e).type.name===`vizyBlock`&&(r+=1);return r}function Rg(e,t,n,r){let{editor:i,manifest:a,documentRevision:o}=e,{state:s}=i,c=r??s.selection.from,l=r??s.selection.to,u=Ig(s.doc,c,a),d=`text`;s.selection instanceof A?d=`node`:s.selection.empty&&(d=`gap`);let f=Fg(u.node).length;return{editorId:n,surface:t,from:c,to:l,selectionKind:d,container:{kind:`root`},contentType:u.contentType,directBlockCount:f,minBlocks:u.minBlocks,maxBlocks:u.maxBlocks,depth:Lg(s.doc,c),schemaRevision:a.schemaRevision,documentRevision:String(o())}}function zg(e,t){return e.schemaRevision===t.schemaRevision&&e.documentRevision===t.documentRevision&&e.from===t.from&&e.to===t.to&&e.surface===t.surface&&JSON.stringify(e.container)===JSON.stringify(t.container)}function Bg(e){return e.normalize(`NFD`).replace(/\p{M}/gu,``).toLowerCase().trim()}function Vg(e){return Bg(e).split(/[\s/_-]+/).filter(Boolean)}function Hg(e,t){let n=Bg(t);if(n===``)return 1;let r=[e.label,...e.keywords??[],...e.aliases??[],e.group,e.description??``,e.kind===`node`?e.nodeName??``:``,e.kind===`block`?e.blockTypeUid??``:``].map(Bg);for(let e of r)if(e.startsWith(n))return 100;let i=Vg(n),a=0;for(let e of i)r.some(t=>t.includes(e))&&(a+=1);return a===0?0:10+a}function Ug(e,t){if(t.score!==e.score)return t.score-e.score;let n=e.item.group.localeCompare(t.item.group);return n===0?e.item.order===t.item.order?e.item.id.localeCompare(t.item.id):e.item.order-t.item.order:n}function Wg(e){return{item:e,isAvailable:(t,n)=>e.kind===`transform`&&e.id===`transform:vizy:layout`?Ve(t,n):it(e,t,n),execute(t,n,r){if(e.kind===`block`){let r=e.blockTypeUid??e.id.replace(/^block:/,``);return ze(r,t,n)}if(e.kind===`node`){let r=e.nodeName??e.id.replace(/^node:vizy:/,``);return _t(r,t,n)}return e.kind===`transform`&&e.id===`transform:vizy:layout`?Qe(t,n,r):{status:`cancelled`}}}}function Gg(e,t,n){let r=new Map;for(let e of n){if(r.has(e.id))throw Error(`duplicateInsertionItem:${e.id}`);r.set(e.id,Wg(e))}for(let e of mt())r.set(e.item.id,e);return{register:e=>{if(r.has(e.item.id))throw Error(`duplicateInsertionItem:${e.item.id}`);return r.set(e.item.id,e),()=>{r.delete(e.item.id)}},query:t=>{let n=[];for(let i of r.values()){if(t.kinds&&!t.kinds.includes(i.item.kind)||!i.isAvailable(t.context,e))continue;let r=t.search?Hg(i.item,t.search):1;t.search&&r<=0||n.push({item:i.item,context:t.context,score:r})}return n.sort(Ug),t.limit===void 0?n:n.slice(0,t.limit)},execute:async t=>{let n=r.get(t.id);if(!n)return{status:`cancelled`};if(n.item.requiresInput&&t.input===void 0)return{status:`opened`};let i=Rg(e,t.context.surface,t.context.editorId,t.context.from);return!i||!zg(t.context,i)||!n.isAvailable(i,e)?{status:`cancelled`}:n.execute(i,e,t.input)},buildContext:(n,r)=>Rg(e,n,t,r)}}var Kg=class{#e;#t;#n;#r=new Ym;#i;#a;#o=new Map;#s=0;#c=0;#l=null;#u=!1;#d=!1;#f=null;#p=null;constructor(e,t,n={}){this.#e=e,this.#i=t,this.#a=n.onToolbarAddBlockOpenChange,this.#t=document.createElement(`div`),this.#t.className=`vizy-insertion-overlay`,this.#t.dataset.vizyInsertionOverlay=``,e.append(this.#t),this.#n=new Bm,e.addEventListener(`pointermove`,this.#m),e.addEventListener(`pointerleave`,this.#h),e.addEventListener(`keydown`,this.#g,!0)}sync(){this.#i().insertionSideEffectsSuspended?.()||(Lm(),this.#n.isOpen&&this.#n.refresh(this.#i()),this.#_())}destroy(){this.#e.removeEventListener(`pointermove`,this.#m),this.#e.removeEventListener(`pointerleave`,this.#h),this.#e.removeEventListener(`keydown`,this.#g,!0),this.#Z(),this.#n.close({animate:!1,restoreFocus:!1}),this.#r.close(),this.#p=null,this.#t.remove();for(let e of this.#o.values())e.remove();this.#o.clear()}#m=e=>{this.#s=e.clientX,this.#c=e.clientY,this.#u=!0,this.#d=!1,this.#_()};#h=()=>{this.#u=!1,this.#l=null,this.#F()};#g=()=>{try{if(!this.#i().editor.view.hasFocus())return}catch{return}this.#d||(this.#d=!0,this.#l=null,this.#F())};#_(){if(this.#d||this.#v()||!this.#u){this.#F();return}if(Mm(this.#i().manifest)||this.#i().manifest.gutterInsert===!1){this.#F();return}this.#x()}openToolbarInsert(e,t={}){let n=this.#i(),{editor:r}=n,i;i=r.view.hasFocus()?r.state.selection.from:r.state.doc.content.size===0?0:1;let a=n.insertion.buildContext(`inline`,i);if(!a)return;let o=t.hadEditorFocus??r.view.hasFocus();this.#U(a,e,`inline`,Dm,`toolbar-plus`,{autofocusFilter:!0,claimEditorFocus:o})}#v(){if(this.#e.querySelector(`vizy-block[menu-open]`))return!0;let e=this.#B();return e?this.#y(e)?!0:this.#b(e):!1}#y(e){let t=this.#e.closest(`vizy-editor`),n=e;for(;n;){if(n===this.#e)return!1;if(n instanceof HTMLElement&&n.matches(`vizy-editor`))return n!==t;if(n instanceof ShadowRoot){n=n.host;continue}n=n.parentNode}return!1}#b(e){let t=e;for(;t;){if(t instanceof HTMLElement){if(t.classList.contains(`vizy-insertion-overlay`)||t.classList.contains(`vizy-inline-add`))return!1;if(t.matches(`vizy-toolbar, vizy-bubble`)||t.matches(`header[part="header"], header[role="group"], .menu[role="menu"], .actions, .header-end`))return!0;if(t.matches(`section[part="body"], [part="preview"]`))return!1}if(t instanceof ShadowRoot){t=t.host;continue}t=t.parentNode}return!1}#x(){let e=this.#i(),t=Rm(e);if(!t.length){this.#l=null,this.#F();return}let n=this.#e.getBoundingClientRect(),r=this.#z(),i=this.#C(e,r,n,t);if(!i){this.#l=null,this.#F();return}this.#l=i.position,this.#j([{key:this.#S(r,i.position),position:i.position,top:i.edge,left:this.#A(r,n),mode:`gutter`,container:r}])}#S(e,t){return`gutter-root-${t}`}#C(e,t,n,r=Rm(e)){if(!r.length)return null;let i=this.#D(e,t);if(!i.length)return null;let a=this.#L(r,t),o=i[i.length-1],s=this.#O(e,t,i);if(s){let n=this.#T(e,t,s.pos,s.nodeSize,r);return r.some(e=>this.#R(e.context.container,t)&&e.position===n)?{position:n,edge:this.#w(s)}:null}return a&&this.#c>o.rect.bottom-4&&this.#c<=n.bottom+8?{position:a.position,edge:this.#w(o)}:this.#E(e,t,i,48,r)}#w(e){return(e.rect.top+e.rect.bottom)/2}#T(e,t,n,r,i=Rm(e)){let a=n+r;for(let e of i)if(this.#R(e.context.container,t)&&e.position===a)return e.position;return a}#E(e,t,n,r,i=Rm(e)){let a=null;for(let o of n){let n=this.#w(o),s=Math.abs(n-this.#c);if(s>r)continue;let c=this.#T(e,t,o.pos,o.nodeSize,i);i.some(e=>this.#R(e.context.container,t)&&e.position===c)&&(!a||s<a.dist)&&(a={position:c,edge:n,dist:s})}return a?{position:a.position,edge:a.edge}:null}#D(e,t){let{editor:n}=e,r=n.view,i=[];return((e,t)=>{let n=e.type.name===`doc`?t:t+1;e.forEach(e=>{let t=n,a=r.nodeDOM(t);a instanceof HTMLElement&&i.push({pos:t,nodeSize:e.nodeSize,rect:a.getBoundingClientRect()}),n+=e.nodeSize})})(n.state.doc,0),i}#O(e,t,n){if(!n.length)return null;let r=n[n.length-1].pos,i=null;for(let a=0;a<n.length;a++){let o=n[a],s=a===0?this.#k(e,t,o):(n[a-1].rect.bottom+o.rect.top)/2,c=a===n.length-1?o.rect.bottom+4:(o.rect.bottom+n[a+1].rect.top)/2;if(this.#c<s||this.#c>c)continue;let l=Math.abs(this.#w(o)-this.#c);(!i||l<i.dist)&&(i={...o,isLast:o.pos===r,dist:l})}if(!i)return null;let{dist:a,...o}=i;return o}#k(e,t,n){let r=e.editor.view.nodeDOM(n.pos);if(r instanceof HTMLElement){let e=Number.parseFloat(getComputedStyle(r).marginTop)||0;return n.rect.top-Math.max(e,4)}return n.rect.top-4}#A(e,t){return null}#j(e){let t=this.#e.getBoundingClientRect(),n=new Set;for(let r of e){n.add(r.key);let e=this.#o.get(r.key);e||(e=this.#N(r.key,r.position),this.#t.append(e),this.#o.set(r.key,e)),this.#P(e,r,t),this.#M(e,r.container??{kind:`root`})}for(let[e,t]of this.#o)n.has(e)||(t.remove(),this.#o.delete(e))}#M(e,t){e.dataset.vizyContainer=`root`}#N(e,t){let n=document.createElement(`button`);n.type=`button`,n.className=`vizy-inline-add`,n.dataset.vizyInvokerKey=e;let r=document.createElement(`pk-icon`);return r.setAttribute(`icon`,`plus`),r.setAttribute(`label`,``),n.append(r),n.setAttribute(`aria-label`,`Add content`),n.addEventListener(`pointerdown`,this.#Y),n.addEventListener(`click`,()=>this.#H(t,n,e)),n}#P(e,t,n){e.dataset.mode=t.mode;let r=t.top-n.top;e.style.top=`${r}px`,e.style.width=``,e.style.right=``,typeof t.left==`number`?(e.style.left=`${t.left}px`,e.dataset.vizyNestedAdd=``):(e.style.left=``,delete e.dataset.vizyNestedAdd)}#F(){for(let e of this.#o.values())e.remove();this.#o.clear()}#I(e,t,n){e.suspendInsertionSideEffects?.(),this.#n.close({restoreFocus:!1,animate:!1}),Pm(e,t,n).finally(()=>{e.resumeInsertionSideEffects?.()})}#L(e,t){let n=null;for(let r of e)this.#R(r.context.container,t)&&(!n||r.position>n.position)&&(n=r);return n}#R(e,t){return e.kind===t.kind}#z(){return{kind:`root`}}#B(){let e=typeof document.elementsFromPoint==`function`?document.elementsFromPoint(this.#s,this.#c):[document.elementFromPoint(this.#s,this.#c)].filter(e=>e instanceof Element);for(let t of e)if(t instanceof Element&&!this.#V(t))return t;return null}#V(e){let t=e;for(;t;){if(t instanceof HTMLElement&&(t.classList.contains(`vizy-insertion-overlay`)||t.classList.contains(`vizy-inline-add`)||t.classList.contains(`vizy-insertion-popup`)||t.localName===`pk-popup`||t.localName===`vizy-insertion-list`))return!0;if(t instanceof ShadowRoot){t=t.host;continue}t=t.parentNode}return!1}#H(e,t,n){let r=this.#i().insertion.buildContext(`inline`,e);r&&this.#U(r,t,`inline`,Dm,n)}openAddBlockAbove(e,t){let n=this.#i(),r=tp(n.editor,e);if(!r)return;let i=n.insertion.buildContext(`inline`,r.pos);i&&this.#U(i,t,`inline`,[`block`],`add-above:${e}`)}#U(e,t,n,r,i,a={}){let o=i??t.dataset.vizyInvokerKey??null,s=a.claimEditorFocus!==!1,c=a.autofocusFilter??s;if(o&&this.#n.isClosingInvoker(o)){this.#Z();return}if(this.#n.isOpen&&(this.#n.isInvoker(t)||o&&this.#n.invokerKey===o)||this.#r.isOpen&&o&&this.#p?.invokerKey===o){let e=s&&o!==`toolbar-plus`;this.#n.close({restoreFocus:e,animate:!0}),this.#r.close(),this.#J(t,o,!1),this.#Z();return}let l=this.#n.isOpen||this.#n.isClosing||this.#r.isOpen,u=this.#i(),d=u.insertion.buildContext(n,e.from);if(!d)return;let f=u.insertion.query({context:d,kinds:r}),p=Nm(f);if(p){this.#I(u,d,p.item.id),this.#Z();return}if(f.length===0){this.#Z();return}let m=t.getBoundingClientRect();if(this.#p={context:d,invoker:t,surface:n,kinds:r,invokerKey:o,claimEditorFocus:s,autofocusFilter:c,rect:m},this.#G()===`grid`){this.#n.close({restoreFocus:!1,animate:!1}),this.#q(u,d,f,{invoker:t,key:o,claimEditorFocus:s}),this.#Z();return}this.#r.close(),this.#n.open(u,d,m,{invokerKey:o,invoker:t,kinds:r,autofocusFilter:c,holdFieldFocus:s,onRestoreFocus:s?()=>{u.editor.commands.focus(void 0,{scrollIntoView:!1})}:null,onClose:()=>{this.#J(t,o,!1)},onViewChange:e=>this.#K(e),skipEnterMotion:l}),this.#J(t,o,!0),this.#Z()}#W(){return this.#i().manifest.field.fieldHandle?.trim()||``}#G(){return Qm(this.#W())}#K(e){$m(this.#W(),e);let t=this.#p;if(!t)return;let n=this.#i();if(e===`grid`){let e=n.insertion.query({context:t.context,kinds:t.kinds});this.#n.close({restoreFocus:!1,animate:!1}),this.#q(n,t.context,e,{invoker:t.invoker,key:t.invokerKey,claimEditorFocus:t.claimEditorFocus});return}this.#r.close(),this.#n.open(n,t.context,t.rect,{invokerKey:t.invokerKey,invoker:t.invoker,kinds:t.kinds,autofocusFilter:t.autofocusFilter,holdFieldFocus:t.claimEditorFocus,onRestoreFocus:t.claimEditorFocus?()=>{n.editor.commands.focus(void 0,{scrollIntoView:!1})}:null,onClose:()=>{this.#J(t.invoker,t.invokerKey,!1)},onViewChange:e=>this.#K(e)}),this.#J(t.invoker,t.invokerKey,!0)}#q(e,t,n,r){this.#r.open(e,t,n,{onView:e=>this.#K(e),onClose:()=>{this.#J(r.invoker,r.key,!1)}}),this.#J(r.invoker,r.key,!0)}#J(e,t,n){if(t===`toolbar-plus`){this.#a?.(n);return}n?e.setAttribute(`aria-expanded`,`true`):e.removeAttribute(`aria-expanded`)}#Y=e=>{if(e.button!==0)return;e.preventDefault(),this.#X();let t=()=>{window.removeEventListener(`pointerup`,t,!0),window.removeEventListener(`pointercancel`,t,!0),window.setTimeout(()=>this.#Z(),0)};window.addEventListener(`pointerup`,t,!0),window.addEventListener(`pointercancel`,t,!0)};#X(){if(this.#f)return;let e=Pt(this.#e);e&&(this.#f=e,Ft(e,!0))}#Z(){this.#f&&=(Ft(this.#f,!1),null)}};function qg(e,t,n,r){e.state.doc.descendants((i,a)=>{if(i.type.name!==`vizyBlock`)return;let o=String(i.attrs.blockUid),s=String(i.attrs.blockTypeUid),c=t.blockTypes[s],l=i.attrs.fieldSlots??{},u=$f({blockUid:o,blockTypeUid:s,enabled:!!i.attrs.enabled,fieldSlots:l,type:c,inference:c?.summaryInference,revision:r.get(o)??0,explicitTitlePlacementUid:c?.summary?.titlePlacementUid,explicitSubtitlePlacementUid:c?.summary?.subtitlePlacementUid,explicitMediaPlacementUid:c?.summary?.mediaPlacementUid});n.update(o,{summary:u});let d=e.view.nodeDOM(a);d instanceof F&&d.applySummary(u)})}var Jg=10,Yg=8,Xg=class extends t{#e=null;get editor(){return this.#e}set editor(e){this.#e=e}#t=!1;get visible(){return this.#t}set visible(e){this.#t=e}#n=``;get preview(){return this.#n}set preview(e){this.#n=e}#r=``;get previewTitle(){return this.#r}set previewTitle(e){this.#r=e}#i=!1;get previewIsUrl(){return this.#i}set previewIsUrl(e){this.#i=e}#a=null;#o={getClientRect:null,contextElement:void 0};static styles=o`
        :host {
            display: none;
        }
        :host([visible]) {
            display: block;
        }
        .panel {
            display: flex;
            align-items: center;
            gap: 0;
            width: max-content;
            max-width: min(320px, calc(100vw - 2rem));
            padding: 0;
            /* Vizy 3 / Formie: soft ring, not opaque white stroke. */
            border: 0;
            border-radius: var(--pk-radius-md, 4px);
            background: #1c2e36;
            color: #fff;
            font-size: 12px;
            line-height: 1.5;
            white-space: nowrap;
            box-shadow:
                0 0 0 1px rgb(255 255 255 / 0.2),
                0 4px 16px rgb(0 0 0 / 18%);
        }
        .url,
        .action {
            box-sizing: border-box;
            padding: 6px 8px;
            font-size: 12px;
            line-height: 1.5;
            color: inherit;
            font-family: inherit;
        }
        .url {
            display: inline-flex;
            align-items: center;
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-decoration: none;
            color: #fff;
        }
        .url[href]:hover {
            text-decoration: underline;
        }
        .divider {
            flex-shrink: 0;
            align-self: center;
            width: 1px;
            height: 12px;
            background: #616d73;
        }
        .action {
            margin: 0;
            border: 0;
            border-radius: var(--pk-radius-sm, 3px);
            background: transparent;
            color: #fff;
            cursor: pointer;
            outline: none;
            transition: color 0.15s ease;
        }
        /* Match pk-tiptap-editor link-bubble__action — fade text, not fill bg. */
        .action:hover {
            color: rgb(255 255 255 / 0.7);
        }
    `;syncToLink(e,t){let n=Zg(t);this.preview=n.text,this.previewTitle=n.title,this.previewIsUrl=n.openable,this.#o.getClientRect=e.getClientRect,this.#o.contextElement=e.contextElement,this.#l(),this.visible=!0,this.#a&&(this.#a.active=!0,this.#a.reposition())}hide(){this.visible=!1,this.#a&&(this.#a.active=!1)}disconnectedCallback(){let e=this.#a;this.#a=null,e?.isConnected&&(e.active=!1,e.remove()),super.disconnectedCallback()}render(){return this.visible?n`
            <div class="panel" role="toolbar" aria-label="Link actions">
                ${this.previewIsUrl?n`<a
                        class="url"
                        href=${this.previewTitle||this.preview}
                        target="_blank"
                        rel="noopener noreferrer"
                        title=${this.previewTitle||this.preview}
                        @mousedown=${e=>e.preventDefault()}
                    >${this.preview}</a>`:n`<span class="url" title=${this.previewTitle||this.preview}>${this.preview}</span>`}
                <span class="divider" aria-hidden="true"></span>
                <button
                    type="button"
                    class="action"
                    @mousedown=${e=>e.preventDefault()}
                    @click=${this.#s}
                >Edit</button>
                <span class="divider" aria-hidden="true"></span>
                <button
                    type="button"
                    class="action"
                    @mousedown=${e=>e.preventDefault()}
                    @click=${this.#c}
                >Unlink</button>
            </div>
        `:r}#s=()=>{let e=this.editor;if(!e)return;let t=Ji(e);this.hide(),pa(e,t,{focus:!0})};#c=()=>{let e=this.editor;e&&(Zi(e,{focus:!0}),this.hide())};#l(){if(this.#a)return;let e=document.createElement(`pk-popup`);e.className=`vizy-link-bubble-popup`,e.placement=`top`,e.distance=Yg,e.flip=!0,e.flipPadding=this.#u(),e.shift=!0,e.shiftPadding=Jg,e.arrow=!0,e.arrowPlacement=`center`,e.anchorTracking=!0,e.positionMethod=`fixed`;let t=this.#o;e.anchor={getBoundingClientRect:()=>t.getClientRect?.()??new DOMRect,get contextElement(){return t.contextElement}},e.append(this),document.body.append(e),this.#a=e}#u(){let e=getComputedStyle(document.documentElement).getPropertyValue(`--header-height`).trim(),t=Number.parseFloat(e);return!Number.isFinite(t)||t<=0?Jg:Math.max(Jg,Math.round(t)+8)}};P([c({attribute:!1})],Xg.prototype,`editor`,null),P([c({type:Boolean,reflect:!0})],Xg.prototype,`visible`,null),P([c()],Xg.prototype,`preview`,null),P([c()],Xg.prototype,`previewTitle`,null),P([c({type:Boolean})],Xg.prototype,`previewIsUrl`,null),Xg=P([N(`vizy-link-bubble`)],Xg);function Zg(e){switch(e.type){case`entry`:return{text:`Entry`,title:`Linked entry`,openable:!1};case`asset`:return{text:`Asset`,title:`Linked asset`,openable:!1};case`category`:return{text:`Category`,title:`Linked category`,openable:!1};case`email`:case`tel`:case`sms`:{let t=Ui(e);return{text:Qg(t),title:t,openable:!0}}default:{let t=Ui(e);return{text:Qg(t),title:t,openable:t.startsWith(`http`)}}}}function Qg(e,t=30){return e.length<=t?e:`${e.slice(0,t-1)}…`}function $g(e){if(!e.isFocused||!e.isActive(`link`))return null;let t=e.state.schema.marks.link;if(!t||!pe(e.state.selection.$from,t))return null;let n=e.getAttributes(`link`);return Bi({type:n.type??`url`,targetUid:typeof n.targetUid==`string`?n.targetUid:null,siteMode:n.siteMode===`fixed`?`fixed`:`current`,siteUid:typeof n.siteUid==`string`?n.siteUid:null,value:typeof n.value==`string`?n.value:null,suffix:typeof n.suffix==`string`?n.suffix:null,newWindow:n.newWindow===!0,title:typeof n.title==`string`?n.title:null,ariaLabel:typeof n.ariaLabel==`string`?n.ariaLabel:null,rel:Array.isArray(n.rel)?n.rel.filter(e=>typeof e==`string`):[],class:typeof n.class==`string`?n.class:null,id:typeof n.id==`string`?n.id:null,download:n.download===!0||typeof n.download==`string`?n.download:null,linkUid:typeof n.linkUid==`string`?n.linkUid:null})}var e_=10,t_=8,n_=500,r_=class extends t{#e=null;get editor(){return this.#e}set editor(e){this.#e=e}#t={};get imageAuthoring(){return this.#t}set imageAuthoring(e){this.#t=e}#n=!1;get visible(){return this.#n}set visible(e){this.#n=e}#r=null;#i=null;#a=null;#o=null;#s=null;#c=0;#l={getClientRect:()=>this.#_(),contextElement:void 0};static styles=o`
        :host { display: none; }
        :host([visible]) { display: block; }
        .panel {
            display: flex;
            align-items: center;
            gap: 0;
            width: max-content;
            padding: 0;
            /* Vizy 3 / Formie: soft ring, not opaque white stroke. */
            border: 0;
            border-radius: var(--pk-radius-md, 4px);
            background: #1c2e36;
            color: #fff;
            font-size: 12px;
            line-height: 1.5;
            white-space: nowrap;
            box-shadow:
                0 0 0 1px rgb(255 255 255 / 0.2),
                0 4px 16px rgb(0 0 0 / 18%);
        }
        .action {
            box-sizing: border-box;
            margin: 0;
            padding: 6px 8px;
            border: 0;
            border-radius: var(--pk-radius-sm, 3px);
            background: transparent;
            color: #fff;
            font: inherit;
            font-size: 12px;
            cursor: pointer;
            outline: none;
            transition: color 0.15s ease;
        }
        /* Match pk-tiptap-editor link-bubble__action — fade text, not fill bg. */
        .action:hover { color: rgb(255 255 255 / 0.7); }
        .action:disabled { opacity: 0.45; cursor: default; }
        .action:disabled:hover { color: #fff; }
        .divider {
            flex-shrink: 0;
            align-self: center;
            width: 1px;
            height: 12px;
            background: #616d73;
        }
    `;updated(e){e.has(`editor`)&&this.#m()}syncToImage(){let e=this.editor;if(!e)return;this.#m();let t=a_(e);if(t!==this.#a){let e=this.#a;this.#a=t,e!==null&&Date.now()-this.#c>n_&&(this.#o=null)}this.#l.contextElement=e.view.dom,this.#v();let n=!!this.#r?.active,r=this.#o!==null||this.#s!==null;this.visible=!0,this.updateComplete.then(()=>{!this.#r||!this.visible||(this.#r.active=!0,(n||r)&&this.#r.reposition())})}hide(e){this.visible=!1,this.#a=null,e?.clearAnchor&&(this.#o=null,this.#s=null,this.#c=0),this.#r&&(this.#r.active=!1)}disconnectedCallback(){this.#h();let e=this.#r;this.#r=null,e?.isConnected&&(e.active=!1,e.remove()),super.disconnectedCallback()}render(){if(!this.visible)return r;let e=this.#u();return n`
            <div class="panel" role="toolbar" aria-label="Image actions">
                <button
                    type="button"
                    class="action"
                    ?disabled=${!e?.assetId}
                    @mousedown=${e=>e.preventDefault()}
                    @click=${this.#p}
                >Image Editor</button>
                <span class="divider" aria-hidden="true"></span>
                <button
                    type="button"
                    class="action"
                    @mousedown=${e=>e.preventDefault()}
                    @click=${this.#d}
                >Edit</button>
                <span class="divider" aria-hidden="true"></span>
                <button
                    type="button"
                    class="action"
                    @mousedown=${e=>e.preventDefault()}
                    @click=${this.#f}
                >Delete</button>
            </div>
        `}#u(){let e=this.editor;if(!e?.isActive(`image`))return null;let t=String(e.getAttributes(`image`).assetUid??``);return t?Oa(t):null}#d=()=>{let e=this.editor;if(!e)return;let t=Na(e);t&&(this.hide({clearAnchor:!0}),Va(e,t,{focus:!0,transforms:this.imageAuthoring.transforms??[]}))};#f=()=>{let e=this.editor;e&&(Fa(e,{focus:!0}),this.hide({clearAnchor:!0}))};#p=()=>{let e=this.editor,t=this.#u();if(!e||!t?.assetId)return;let n=window.Craft;if(typeof n?.AssetImageEditor!=`function`)return;let r=String(e.getAttributes(`image`).assetUid??``);new n.AssetImageEditor(t.assetId,{allowSavingAsNew:!1,allowDegreeFractions:n.isImagick,onSave:async()=>{r&&await za(r)}}),this.hide({clearAnchor:!0})};#m(){let e=this.editor?.view.dom??null;e!==this.#i&&(this.#h(),e&&(this.#i=e,e.addEventListener(`pointerdown`,this.#g,!0)))}#h(){this.#i?.removeEventListener(`pointerdown`,this.#g,!0),this.#i=null}#g=e=>{let t=e.target;if(!(t instanceof Element))return;let n=t.closest(`.vizy-image`);if(!n||!this.#i?.contains(n))return;let r=(n.querySelector(`img`)??n).getBoundingClientRect();if(r.width<=0||r.height<=0)return;this.#o={x:i_((e.clientX-r.left)/r.width),y:i_((e.clientY-r.top)/r.height)},this.#s={x:e.clientX,y:e.clientY},this.#c=Date.now();let i=this.editor;Wt(Pt(i?.view.dom??null),()=>{i&&!i.isDestroyed&&Ut(i)}),requestAnimationFrame(()=>{!i||i.isDestroyed||s_(i)&&this.syncToImage()})};#_(){if(this.#s&&Date.now()-this.#c<=n_)return new DOMRect(this.#s.x-12,this.#s.y-12,24,24);let e=o_(this.editor);if(!e)return new DOMRect;if(this.#o){let t=e.left+this.#o.x*e.width,n=e.top+this.#o.y*e.height;return new DOMRect(t-12,n-12,24,24)}return new DOMRect(e.left+e.width/2-12,e.top,24,24)}#v(){if(this.#r)return;let e=document.createElement(`pk-popup`);e.className=`vizy-image-bubble-popup`,e.placement=`top`,e.distance=t_,e.flip=!0,e.flipPadding=e_,e.shift=!0,e.shiftPadding=e_,e.arrow=!0,e.arrowPlacement=`center`,e.anchorTracking=!0,e.positionMethod=`fixed`;let t=this.#l;e.anchor={getBoundingClientRect:()=>t.getClientRect(),get contextElement(){return t.contextElement}},e.append(this),document.body.append(e),this.#r=e}};P([c({attribute:!1})],r_.prototype,`editor`,null),P([c({attribute:!1})],r_.prototype,`imageAuthoring`,null),P([c({type:Boolean,reflect:!0})],r_.prototype,`visible`,null),r_=P([N(`vizy-image-bubble`)],r_);function i_(e){return Math.min(1,Math.max(0,e))}function a_(e){if(!e)return null;let{selection:t}=e.state;if(t instanceof A&&t.node.type.name===`image`)return t.from;if(!e.isActive(`image`))return null;let n=t.$from;for(let e=n.depth;e>=0;e--)if(n.node(e).type.name===`image`)return e===0?0:n.before(e);return null}function o_(e){let t=a_(e);if(t==null||!e)return null;let n=e.view.nodeDOM(t);return n instanceof HTMLElement?(n.matches(`img`)?n:n.querySelector(`img`)??n).getBoundingClientRect():null}function s_(e){let{selection:t}=e.state;return t instanceof A&&t.node.type.name===`image`||e.isActive(`image`)}var c_=10,l_=8,u_=500,d_=`.vizy-iframe, .vizy-media-embed`,f_=class extends t{#e=null;get editor(){return this.#e}set editor(e){this.#e=e}#t=!1;get visible(){return this.#t}set visible(e){this.#t=e}#n=null;#r=`mediaEmbed`;#i=null;#a=null;#o=null;#s=null;#c=0;#l={getClientRect:()=>this.#h(),contextElement:void 0};static styles=o`
        :host { display: none; }
        :host([visible]) { display: block; }
        .panel {
            display: flex;
            align-items: center;
            gap: 0;
            width: max-content;
            padding: 0;
            /* Vizy 3 / Formie: soft ring, not opaque white stroke. */
            border: 0;
            border-radius: var(--pk-radius-md, 4px);
            background: #1c2e36;
            color: #fff;
            font-size: 12px;
            line-height: 1.5;
            white-space: nowrap;
            box-shadow:
                0 0 0 1px rgb(255 255 255 / 0.2),
                0 4px 16px rgb(0 0 0 / 18%);
        }
        .action {
            box-sizing: border-box;
            margin: 0;
            padding: 6px 8px;
            border: 0;
            border-radius: var(--pk-radius-sm, 3px);
            background: transparent;
            color: #fff;
            font: inherit;
            font-size: 12px;
            cursor: pointer;
            outline: none;
            transition: color 0.15s ease;
        }
        .action:hover { color: rgb(255 255 255 / 0.7); }
        .divider {
            flex-shrink: 0;
            align-self: center;
            width: 1px;
            height: 12px;
            background: #616d73;
        }
    `;updated(e){e.has(`editor`)&&this.#f()}syncToEmbed(e){let t=this.editor;if(!t)return;this.#r=e,this.#f();let n=m_(t);if(n!==this.#a){let e=this.#a;this.#a=n,e!==null&&Date.now()-this.#c>u_&&(this.#o=null)}this.#l.contextElement=t.view.dom,this.#g();let r=!!this.#n?.active,i=this.#o!==null||this.#s!==null;this.visible=!0,this.updateComplete.then(()=>{!this.#n||!this.visible||(this.#n.active=!0,(r||i)&&this.#n.reposition())})}hide(e){this.visible=!1,this.#a=null,e?.clearAnchor&&(this.#o=null,this.#s=null,this.#c=0),this.#n&&(this.#n.active=!1)}disconnectedCallback(){this.#p();let e=this.#n;this.#n=null,e?.isConnected&&(e.active=!1,e.remove()),super.disconnectedCallback()}render(){return this.visible?n`
            <div class="panel" role="toolbar" aria-label="Embed actions">
                <button
                    type="button"
                    class="action"
                    @mousedown=${e=>e.preventDefault()}
                    @click=${this.#u}
                >Edit</button>
                <span class="divider" aria-hidden="true"></span>
                <button
                    type="button"
                    class="action"
                    @mousedown=${e=>e.preventDefault()}
                    @click=${this.#d}
                >Delete</button>
            </div>
        `:r}#u=()=>{let e=this.editor;if(!e)return;let t=ro(e,this.#r);t&&(this.hide({clearAnchor:!0}),no(e,t,{focus:!0}))};#d=()=>{let e=this.editor;e&&(io(e,this.#r,{focus:!0}),this.hide({clearAnchor:!0}))};#f(){let e=this.editor?.view.dom??null;e!==this.#i&&(this.#p(),e&&(this.#i=e,e.addEventListener(`pointerdown`,this.#m,!0)))}#p(){this.#i?.removeEventListener(`pointerdown`,this.#m,!0),this.#i=null}#m=e=>{let t=e.target;if(!(t instanceof Element))return;let n=t.closest(d_);if(!n||!this.#i?.contains(n))return;let r=n.getBoundingClientRect();if(r.width<=0||r.height<=0)return;this.#o={x:p_((e.clientX-r.left)/r.width),y:p_((e.clientY-r.top)/r.height)},this.#s={x:e.clientX,y:e.clientY},this.#c=Date.now();let i=this.editor;Wt(Pt(i?.view.dom??null),()=>{i&&!i.isDestroyed&&Ut(i)}),requestAnimationFrame(()=>{if(!i||i.isDestroyed)return;let e=g_(i);e&&this.syncToEmbed(e)})};#h(){if(this.#s&&Date.now()-this.#c<=u_)return new DOMRect(this.#s.x-12,this.#s.y-12,24,24);let e=h_(this.editor);if(!e)return new DOMRect;if(this.#o){let t=e.left+this.#o.x*e.width,n=e.top+this.#o.y*e.height;return new DOMRect(t-12,n-12,24,24)}return new DOMRect(e.left+e.width/2-12,e.top,24,24)}#g(){if(this.#n)return;let e=document.createElement(`pk-popup`);e.className=`vizy-embed-bubble-popup`,e.placement=`top`,e.distance=l_,e.flip=!0,e.flipPadding=c_,e.shift=!0,e.shiftPadding=c_,e.arrow=!0,e.arrowPlacement=`center`,e.anchorTracking=!0,e.positionMethod=`fixed`;let t=this.#l;e.anchor={getBoundingClientRect:()=>t.getClientRect(),get contextElement(){return t.contextElement}},e.append(this),document.body.append(e),this.#n=e}};P([c({attribute:!1})],f_.prototype,`editor`,null),P([c({type:Boolean,reflect:!0})],f_.prototype,`visible`,null),f_=P([N(`vizy-embed-bubble`)],f_);function p_(e){return Math.min(1,Math.max(0,e))}function m_(e){if(!e)return null;let{selection:t}=e.state;if(t instanceof A){let e=t.node.type.name;if(e===`iframe`||e===`mediaEmbed`)return t.from}let n=g_(e);if(!n)return null;let r=t.$from;for(let e=r.depth;e>=0;e--)if(r.node(e).type.name===n)return e===0?0:r.before(e);return null}function h_(e){let t=m_(e);if(t==null||!e)return null;let n=e.view.nodeDOM(t);return n instanceof HTMLElement?(n.matches(d_)?n:n.querySelector(d_)??n).getBoundingClientRect():null}function g_(e){let{selection:t}=e.state;if(t instanceof A){let e=t.node.type.name;if(e===`iframe`||e===`mediaEmbed`)return e}return e.isActive(`iframe`)?`iframe`:e.isActive(`mediaEmbed`)?`mediaEmbed`:null}function __(e,t){return`${encodeURIComponent(e)}=${encodeURIComponent(t)}`}function v_(e){try{return decodeURIComponent(e.replace(/\+/g,` `))}catch{return e}}function y_(e,t){let{fieldName:n,canonical:r,editorId:i,metadata:a}=t,o=i?`vizyTransport[${i}]`:null,s=e===``?[]:e.split(`&`).filter(e=>e!==``),c=[];for(let e of s){let t=e.indexOf(`=`),r=v_(t===-1?e:e.slice(0,t));r!==n&&(r.startsWith(`vizyHost[`)||r.includes(`[vizyHost]`)||o&&(r===o||r.startsWith(`${o}[`))||c.push(e))}if(c.push(__(n,r)),i&&a){let e=`vizyTransport[${i}]`;for(let[t,n]of Object.entries(a))c.push(__(`${e}[${t}]`,n))}return c.join(`&`)}function $(e){return JSON.stringify(e,(e,t)=>!t||typeof t!=`object`||Array.isArray(t)?t:Object.fromEntries(Object.entries(t).sort(([e],[t])=>e.localeCompare(t))))}var b_=1e4,x_=class extends HTMLElement{#e=null;#t=null;#n=null;#r=null;#i=new Bo;#a=new Vo;#o=null;#s=null;#c=new Set;#l=null;#u=null;#d=null;#f=null;#p=null;#m=null;#h=null;#g=[];#_=0;#v=new Map;#y=!1;#b=!1;#x=``;#S=null;#C=`complete`;#w=[];#T=null;#E=0;#D=new Map;#O=!1;#k=!1;#A=null;#j=!1;set bootstrap(e){if(this.#t)throw Error(`editorAlreadyBootstrapped`);this.#e=structuredClone(e),this.isConnected&&queueMicrotask(()=>this.#M())}connectedCallback(){this.#A!==null&&(window.clearTimeout(this.#A),this.#A=null),queueMicrotask(()=>this.#M())}disconnectedCallback(){this.#A!==null&&window.clearTimeout(this.#A),this.#A=window.setTimeout(()=>{this.#A=null,this.isConnected||this.#F()},0)}#M(){if(!this.#e){let e=this.#N();if(e)this.#e=structuredClone(e);else if(this.id){let e=he(this.id);if(e){this.bootstrap=e;return}}}if(!this.#e){this.hasAttribute(`data-vizy-hosted`)&&this.#P(Error(`hostedBootstrapMissing`));return}try{this.#U()}catch(e){this.#P(e)}}#N(){let e=this.querySelector(`:scope > template[data-vizy-bootstrap]`),t=(e instanceof HTMLTemplateElement?e.content.textContent:e?.textContent)?.trim();if(!t)return null;try{let n=JSON.parse(t);return e?.remove(),n}catch{return null}}#P(e){console.error(`[Vizy] Editor failed to initialize`,e);try{this.#F()}catch{}je(this,e)}get editor(){return this.#t}get insertionRegistry(){return this.#l}get isDirty(){return!this.#t||!this.#b?!1:$(this.#te())!==this.#x}get fullySaved(){return!this.isDirty&&this.#C===`complete`}get finalizationState(){return{status:this.#C,errors:this.#w,retryToken:this.#T}}flush(e){if(!this.#t||!this.#r){if(this.#e?.hosted&&this.#r?.value)return this.#r.value;throw Error(`editorNotReady`)}this.#$();let t=$(this.#te());return this.#r.value=t,t}acceptServerResult(e,t){let n=this.#D.get(t);if(!(t!==this.#E||!n||e.submittedClientRevision!==n.revision)&&e.requestKind!==`livePreview`&&e.success){if(this.#C=e.finalizationStatus,this.#w=e.finalizationErrors??[],this.#T=e.retryToken??null,e.submittedClientRevision===this.#_){this.#ae(e.canonicalDocument),this.#ee(),this.#x=$(this.#te()),this.#b=!1;return}this.#x=$(this.#ne(e.canonicalDocument)),this.#b=$(this.#te())!==this.#x}}beginSubmission(){let e=++this.#E;return this.#D.clear(),this.#D.set(e,{revision:this.#_,canonical:$(this.#te())}),{generation:e,clientRevision:this.#_}}destroy(){this.#k||(this.#k=!0,this.#A!==null&&(window.clearTimeout(this.#A),this.#A=null),this.#F())}#F(){for(let e of this.#g.splice(0))e();this.#a.destroy(),this.#i.clear(),this.#l=null,this.#u?.destroy(),this.#u=null,this.#t?.destroy(),this.#t=null,this.#o?.destroy(),this.#o=null,this.#s=null,this.#c.clear(),this.#n=null,this.#d=null,this.#f=null,this.#p=null,this.#m=null,this.#h=null,this.querySelector(`.vizy-editor-shell`)?.remove()}#I(e){let t=this.#o?.open(e);this.#V(e),t?.catch(()=>this.#K()).finally(()=>this.#V(e))}#L(e){let t=this.#o?.retry(e);this.#V(e),t?.catch(()=>this.#K()).finally(()=>this.#V(e))}#R(){if(!this.#t||!this.#e)return this.#c;let e=this.#t.state.doc;return this.#s!==e&&(this.#s=e,this.#c=new Set(gs(e,this.#e.manifest.blockTypes))),this.#c}#z(){if(!this.#t||!this.#e)return;let e=this.#R();this.#t.state.doc.descendants(t=>{if(t.type.name!==`vizyBlock`)return;let n=String(t.attrs.blockUid);if(!e.has(n))return;let r=this.#e.manifest.blockTypes[String(t.attrs.blockTypeUid)];if(!r?.fieldLayoutUid)return;this.#a.acquire(n,String(t.attrs.blockTypeUid),r.fieldLayoutUid,r.fieldLayoutHash??null);let i=this.#a.get(n)?.status;i!==`mounted`&&i!==`loading`&&i!==`failed`&&this.#I(n)})}#B(){this.#z()}#V(e){let t=this.querySelector(`vizy-block[data-block-uid="${CSS.escape(e)}"]`);if(!t)return;let n=this.#a.get(e),r=n?.status;t.fieldLayoutState=r===`mounted`?`mounted`:r===`loading`?`loading`:r===`failed`?`error`:`unmounted`,t.fieldLayoutError=r===`failed`?n?.errorMessage??null:null,(r===`mounted`||r===`failed`)&&(t.fieldLayoutRetrying=!1)}#H(e){let t=e.dataset.blockUid,n=!1;return t&&this.#y&&queueMicrotask(()=>{!n&&e.isConnected&&this.#y&&this.#I(t)}),()=>{n=!0}}#U(){if(!this.#e||this.#t||this.#k||!this.isConnected)return;if(this.querySelector(`.vizy-editor-shell`)?.remove(),this.#r=this.querySelector(`input[data-vizy-document]`),!this.#r)throw Error(`canonicalInputMissing`);let e=this.#e.manifest;this.#n=document.createElement(`div`),this.#n.className=`vizy-editor-body`,this.#g.push(Bt(this.#n)),this.#d=document.createElement(`vizy-toolbar`),this.#d.controls=e.toolbar?.controls??[];let t=e.field.insertableBlockTypeUids??[];if(this.#d.canAddBlock=t.length>0,this.#d.addBlockNeedsMenu=t.length>1,t.length===1){let n=e.blockTypes[t[0]];this.#d.addBlockDirectLabel=n?.name?`Add ${n.name}`:null}else this.#d.addBlockDirectLabel=null;this.#d.linkAuthoring={linkOptions:this.#e.linkOptions,elementSiteId:this.#e.elementSiteId,linkSelectorStorageKeyPrefix:`VizyInput.LinkTo.${e.field.fieldUid||`field`}`},this.#d.imageAuthoring={volumes:this.#e.imageAuthoring?.volumes??[],transforms:this.#e.imageAuthoring?.transforms??[],defaultTransform:this.#e.imageAuthoring?.defaultTransform??``,defaultSource:this.#e.imageAuthoring?.defaultSource??null,elementSiteId:this.#e.elementSiteId,linkSelectorStorageKeyPrefix:`VizyInput.${e.field.fieldUid||`field`}`},this.#d.layoutPresets=Ze(e),this.#f=document.createElement(`vizy-bubble`),this.#f.controls=e.bubble?.enabled===!1?[]:e.bubble?.controls??[],this.#p=document.createElement(`vizy-link-bubble`),this.#m=document.createElement(`vizy-image-bubble`),this.#m.imageAuthoring=this.#d.imageAuthoring,this.#h=document.createElement(`vizy-embed-bubble`);let n=document.createElement(`div`);n.className=`vizy-editor-surface`,this.#n.append(this.#d,n);let r=document.createElement(`div`);r.className=`vizy-editor-shell`,r.append(this.#n),this.prepend(r);let i,a,o=this.id||`vizy-editor-${e.field.fieldUid}`,s=()=>({editor:i,manifest:e,ui:this.#i,hosts:this.#a,insertion:a,openFields:e=>this.#I(e),observeFieldViewport:e=>this.#H(e),refreshSummaries:()=>this.#K(),blockRevision:e=>this.#v.get(e)??0,flushMountedFields:()=>this.#$(),duplicateBlock:async t=>this.#t?ip(this.#t,t,{manifest:e,documentRevision:()=>this.#_,flushMountedFields:()=>this.#$(),prefetchNewBlocks:async e=>{this.#o&&await this.#o.prefetchNewBlocks(e)},animateInsert:qt}):!1,openAddBlockAbove:(e,t)=>{this.#u?.openAddBlockAbove(e,t)},suspendInsertionSideEffects:()=>{this.#j=!0},resumeInsertionSideEffects:()=>{this.#j=!1,this.#u?.sync(),this.#K()},insertionSideEffectsSuspended:()=>this.#j});i=new Me({element:n,extensions:Pg(e,s),content:{type:`doc`,attrs:{schemaVersion:2},content:[]},onTransaction:({transaction:e})=>{e.docChanged&&(this.#O||(this.#_+=1),this.#y&&(this.#b=!0,this.#re()),this.#se(e.before,e.doc),this.#X())}}),this.#t=i,this.#d&&(this.#d.editor=i),this.#f&&(this.#f.editor=i),this.#p&&(this.#p.editor=i),this.#m&&(this.#m.editor=i),this.#h&&(this.#h.editor=i);let c=(e=>{let t=e.target;if(!(t instanceof HTMLElement)||t.localName!==`vizy-block`)return;let n=t.getAttribute(`data-block-uid`);if(!n)return;let r=this.#a.get(n);!r||r.status!==`mounted`||Wo(r,e.detail.index,t)});this.addEventListener(`vizy-layout-tab-change`,c),this.#g.push(()=>this.removeEventListener(`vizy-layout-tab-change`,c));let l=(e=>{let t=e.detail?.blockUid?.trim(),n=e.target instanceof HTMLElement?e.target.getAttribute(`data-block-uid`):null,r=t||n;r&&(e.stopPropagation(),this.#L(r))});this.addEventListener(`vizy-retry-field-layout`,l),this.#g.push(()=>this.removeEventListener(`vizy-retry-field-layout`,l)),a=Gg({editor:i,manifest:e,documentRevision:()=>this.#_,createUid:()=>crypto.randomUUID(),prefetchBlockFieldLayout:async e=>{this.#o&&await this.#o.prefetchNewBlock({...e,documentRevision:this.#_})},animateBlockInsert:e=>qt(e)},o,e.insertionItems??[]),this.#l=a,this.#g.push(ot(a,e)),this.#u=new Kg(n,s,{onToolbarAddBlockOpenChange:e=>{this.#d&&(this.#d.addBlockOpen=e)}});let u=(e=>{let{action:t,invoker:n,hadEditorFocus:r}=e.detail??{};!n||!this.#u||t===`insert-block`&&this.#u.openToolbarInsert(n,{hadEditorFocus:!!r})});this.#d?.addEventListener(`vizy-toolbar-ui`,u),this.#g.push(()=>this.#d?.removeEventListener(`vizy-toolbar-ui`,u)),i.on(`selectionUpdate`,()=>{this.#j||(this.#u?.sync(),this.#q())}),i.on(`blur`,()=>{requestAnimationFrame(()=>{if(!(!this.#t||this.#t.isDestroyed)){try{if(this.#t.view.hasFocus())return}catch{return}Pt(this.#t.view.dom)?.hasAttribute(`data-has-focus`)||(this.#f?.hide(),this.#p?.hide(),this.#m?.hide(),this.#h?.hide())}})}),i.on(`transaction`,({transaction:e})=>{e.docChanged&&queueMicrotask(()=>{!this.#t||this.#t.isDestroyed||this.#j||(this.#u?.sync(),this.#K())})}),this.#g.push(()=>{this.#u?.destroy(),this.#u=null,this.#d?.remove(),this.#d=null,this.#f?.remove(),this.#f=null,this.#p?.remove(),this.#p=null,this.#m?.remove(),this.#m=null,this.#h?.remove(),this.#h=null}),this.#o=new hs(this.#a,e,this.#e.editorContextToken,e=>this.#Y(e),e=>this.#Q(e)),ka(this.#e.imagePreviews),this.#oe(this.#ie(this.#e.document,e)),this.#W();let d=$(this.#te());this.#x=d,this.#r.value=d,this.#e.hosted||this.#ce(),this.#y=!0,this.#X(),this.#B(),this.#K(),this.#u?.sync()}#W(){if(!(!this.#e||!this.#o))for(let e of this.#e.initialFieldLayouts??[]){if(e&&typeof e==`object`&&`ok`in e&&e.ok===!1){let t=this.#o.adoptInitialFailure(e);t&&this.#V(t.blockUid);continue}let t=this.#o.adoptInitial(e);t&&this.#V(t.blockUid)}}#G(e,t){let n=0,r=performance.now()+b_,i=!1;this.#g.push(()=>{i=!0,n&&cancelAnimationFrame(n)});let a=()=>{if(i||this.#k)return;let o=window.$?.(e),s=o?.data(`elementEditor`);if(!s?.on){performance.now()<r&&(n=requestAnimationFrame(a));return}s.on(`serializeForm`,t),this.#g.push(()=>s.off?.(`serializeForm`,t)),s.lastSerializedValue==null&&typeof s.serializeForm==`function`&&o?.data(`initialSerializedValue`,s.serializeForm(!0))};a()}#K(){!this.#t||!this.#e||qg(this.#t,this.#e.manifest,this.#i,this.#v)}#q(){if(!this.#t)return;let e=this.#t;if(s_(e)&&this.#m&&C_(this.#e?.manifest)){this.#f?.hide(),this.#p?.hide(),this.#h?.hide({clearAnchor:!0}),this.#m.syncToImage();return}this.#m?.hide({clearAnchor:!0});let t=g_(e);if(t&&this.#h&&w_(this.#e?.manifest,t)){this.#f?.hide(),this.#p?.hide(),this.#h.syncToEmbed(t);return}this.#h?.hide({clearAnchor:!0});let n=$g(e);if(n&&this.#p&&S_(this.#e?.manifest)){this.#f?.hide();let t=e.state.schema.marks.link;if(!(t&&pe(e.state.selection.$from,t))){this.#p.hide();return}this.#p.syncToLink({getClientRect:()=>{let t=e.state.schema.marks.link,n=t?pe(e.state.selection.$from,t):null;return n?dt(e.view,n.from,n.to):new DOMRect},contextElement:e.view.dom},n);return}this.#p?.hide(),this.#J()}#J(){if(!this.#f||!this.#t)return;let{selection:e}=this.#t.state;if(e.empty||e instanceof A){this.#f.hide();return}let t=this.#t;this.#f.syncToSelection({getClientRect:()=>{let{selection:e}=t.state;return e.empty?new DOMRect:dt(t.view,e.from,e.to)},contextElement:t.view.dom})}#Y(e){let t=null,n=null;return this.#t?.state.doc.descendants((r,i)=>r.type.name===`vizyBlock`&&r.attrs.blockUid===e?(t=r,n=i,!1):t===null),!t||n===null||!this.#t?null:{node:t,revision:this.#v.get(e)??0,destination:{kind:`root`}}}#X(){queueMicrotask(()=>{if(!this.#t||this.#t.isDestroyed)return;let e=new Set;this.#t.state.doc.descendants(t=>{t.type.name===`vizyBlock`&&e.add(String(t.attrs.blockUid))}),this.#a.reconcile(e),this.#i.reconcile(e),this.#B()})}#Z(e,t){let n=`#${CSS.escape(t)}`;for(let t of this.#a.roots(e.blockUid)){let e=t.querySelector(n);if(e)return e}return null}#Q(e){for(let t of e.disposals.splice(0))t();e.capturedValues.clear();for(let t of e.response?.fields??[]){let n=this.#Z(e,t.wrapperId);if(!n)continue;let r=Ms(t.adapterId);e.capturedValues.set(t.fieldLayoutElementUid,r.read(n)),e.disposals.push(r.bind(n,()=>{this.#y&&(this.#b=!0,this.#_+=1,this.#$(e.blockUid),this.#re())}))}}#$(e){if(!this.#t)return;let t=new Map,n=[];if(this.#t.state.doc.descendants((r,i)=>{if(r.type.name!==`vizyBlock`||e&&r.attrs.blockUid!==e)return;let a=this.#a.get(String(r.attrs.blockUid));if(a?.status!==`mounted`||!a.response)return;let o=structuredClone({...r.attrs.fieldSlots??{}}),s=!1,c=r.attrs.matrixAnchorUid??null;for(let e of a.response.fields){let t=this.#Z(a,e.wrapperId);if(!t)continue;let r=e.fieldLayoutElementUid,i=Ms(e.adapterId).read(t),l=e.matrixAnchorUid;typeof l==`string`&&l!==``&&l!==c&&(c=l,s=!0),$(a.capturedValues.get(r))!==$(i)&&(n.push({record:a,uid:r,value:i}),$(o[r])!==$(i)&&(o[r]=i,s=!0))}s&&t.set(i,{fieldSlots:o,matrixAnchorUid:c})}),t.size){let e=this.#t.state.tr.setMeta(`addToHistory`,!1);for(let[n,r]of t)e.doc.nodeAt(n)&&(e=e.setNodeAttribute(n,`fieldSlots`,r.fieldSlots).setNodeAttribute(n,`matrixAnchorUid`,r.matrixAnchorUid));this.#t.view.dispatch(e)}for(let{record:e,uid:t,value:r}of n)e.capturedValues.set(t,r)}#ee(){this.#t?.state.doc.descendants(e=>{if(e.type.name!==`vizyBlock`)return;let t=this.#a.get(String(e.attrs.blockUid));for(let n of t?.response?.fields??[])n.adapterId===`craft.matrix`&&(n.matrixAnchorUid=e.attrs.matrixAnchorUid||void 0)})}#te(){if(!this.#t||!this.#e)throw Error(`editorNotReady`);return this.#ne(this.#t.getJSON())}#ne(e){if(!this.#e)throw Error(`editorNotReady`);return gh(uc(e),this.#e.manifest)}#re(){if(!(!this.#r||!this.#t||!this.#y))try{let e=$(this.#te());if(this.#r.value===e)return;this.#r.value=e,this.#r.dispatchEvent(new Event(`input`,{bubbles:!0})),this.#r.dispatchEvent(new Event(`change`,{bubbles:!0}))}catch{}}#ie(e,t){if(!this.#t)throw Error(`editorNotReady`);return hh(cc(e,this.#t.schema,{nodes:[...t.enabledNodes,...t.internalNodes],marks:t.enabledMarks}),t)}#ae(e){if(!this.#t||!this.#e)return;let t=this.#ie(e,this.#e.manifest);if($(this.#t.getJSON())!==$(t)){this.#O=!0;try{this.#oe(t)}finally{this.#O=!1}}}#oe(e){if(!this.#t)return;let t=this.#t.schema.nodeFromJSON(e),n=Jh(this.#t.state.tr,t).setMeta(`vizyAcceptedCanonical`,!0).setMeta(`addToHistory`,!1);n.docChanged&&this.#t.view.dispatch(n)}#se(e,t){let n=e=>{let t=new Map;return e.descendants(e=>{e.type.name===`vizyBlock`&&t.set(String(e.attrs.blockUid),$(e.toJSON()))}),t},r=n(e),i=n(t);for(let[e,t]of i)r.get(e)!==t&&this.#v.set(e,(this.#v.get(e)??0)+1);for(let e of this.#v.keys())i.has(e)||this.#v.delete(e)}#ce(){let e=this.closest(`form`);if(!e||!this.#r)return;let t=this.#r.name,n=()=>{let t=this.#le(`save`,this.flush(`submit`));this.#ue(e,t)},r=e=>{let n=this.flush(`serialize`);for(let t of[...e.formData.keys()])(t.startsWith(`vizyHost[`)||t.includes(`[vizyHost]`))&&e.formData.delete(t);e.formData.delete(t),e.formData.append(t,n)};e.addEventListener(`submit`,n,!0),e.addEventListener(`formdata`,r),this.#g.push(()=>e.removeEventListener(`submit`,n,!0)),this.#g.push(()=>e.removeEventListener(`formdata`,r)),this.#G(e,e=>{let n=this.flush(`autosave`),r=this.#le(`autosave`,n);e.data.serialized=y_(e.data.serialized,{fieldName:t,canonical:n,editorId:this.id,metadata:Object.fromEntries(Object.entries(r).map(([e,t])=>[e,String(t)]))})});let i=e=>{let t=e.detail;if(!t||typeof t!=`object`)return;let n=t.vizy?.results;if(Array.isArray(n)){for(let e of n)if(e&&typeof e==`object`&&e.editorId===this.id){let t=Number(e.generation);this.acceptServerResult(e,t)}}};document.addEventListener(`vizy:server-response`,i),this.#g.push(()=>document.removeEventListener(`vizy:server-response`,i))}#le(e,t){if(!this.#e)throw Error(`editorNotReady`);let n=`${e}:${this.#_}:${t??$(this.#te())}`;if(e!==`save`&&this.#S?.key===n)return this.#S.metadata;let r=this.beginSubmission(),i={editorId:this.id,fieldUid:this.#e.manifest.field.fieldUid,editorContextToken:this.#e.editorContextToken,generation:r.generation,clientRevision:r.clientRevision,requestKind:e};return this.#S={key:n,metadata:i},i}#ue(e,t){e.querySelectorAll(`[data-vizy-transport="${CSS.escape(this.id)}"]`).forEach(e=>e.remove());let n=`vizyTransport[${this.id}]`;for(let[r,i]of Object.entries(t)){let t=document.createElement(`input`);t.type=`hidden`,t.name=`${n}[${r}]`,t.value=String(i),t.dataset.vizyTransport=this.id,e.append(t)}}};function S_(e){return!!e?.enabledMarks?.includes(`link`)}function C_(e){return!!e?.enabledNodes?.includes(`image`)}function w_(e,t){return!!e?.enabledNodes?.includes(t)}customElements.define(`vizy-editor`,x_);
//# sourceMappingURL=editor-runtime-CjYlIt26.js.map