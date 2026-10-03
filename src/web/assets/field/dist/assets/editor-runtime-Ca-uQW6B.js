const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./pk-dialog-CkG87TP9.js","./decorate-R0X811qp-DTGsgM1e.js","./block-type-icon-DsNXIxot.js","./pk-spinner-DweuYJ_Z-BdFJpkCK.js","./dismissible-stack-XQUMfKO3-Dki4_55y.js","./has-slot-8BvCt_qo-CQuFne2U.js","./required-validator-CEg8dvjS-y5IDZAyr.js","./rolldown-runtime-DK3Fl9T5.js"])))=>i.map(i=>d[i]);
import{a as e,c as t,d as n,l as r,n as i,o as a,p as o,r as s,s as c,t as l,u}from"./decorate-R0X811qp-DTGsgM1e.js";import{a as d,i as f,o as p,s as m,t as h}from"./block-type-icon-DsNXIxot.js";import{a as g,i as _,o as ee,r as v,u as y}from"./pk-spinner-DweuYJ_Z-BdFJpkCK.js";import{Ht as b,Ut as x,Wt as S,a as C}from"./dismissible-stack-XQUMfKO3-Dki4_55y.js";import{t as te}from"./has-slot-8BvCt_qo-CQuFne2U.js";import{c as ne,i as re,l as ie,t as ae,u as oe}from"./required-validator-CEg8dvjS-y5IDZAyr.js";import"./popup-B3ICU9nV.js";import{c as se,s as ce}from"./select-BX62DXHU.js";import{t as le}from"./preload-helper-HclGiUj8.js";import{$ as ue,$t as de,A as fe,At as pe,B as me,Bt as he,C as ge,Ct as _e,D as ve,Dt as ye,E as w,Et as be,F as xe,Ft as T,G as Se,Gt as Ce,H as we,Ht as Te,I as Ee,It as E,J as De,Jt as Oe,K as ke,Kt as Ae,L as je,Lt as D,M as Me,Mt as Ne,N as Pe,Nt as Fe,O as Ie,Ot as Le,P as Re,Pt as O,Q as ze,Qt as k,R as Be,Rt as Ve,S as He,St as Ue,T as We,Tt as Ge,U as Ke,Ut as qe,V as Je,Vt as Ye,W as Xe,Wt as Ze,X as Qe,Xt as $e,Y as et,Yt as tt,Z as nt,_ as rt,_t as it,a as at,at as ot,b as st,bt as ct,c as lt,d as ut,dt,en as ft,et as A,f as pt,ft as mt,g as ht,gt,h as _t,ht as vt,i as yt,in as bt,it as xt,j as St,jt as Ct,k as j,kt as wt,l as Tt,lt as Et,m as Dt,mt as Ot,n as kt,nn as M,nt as At,o as jt,ot as Mt,p as Nt,pt as Pt,q as Ft,qt as It,r as Lt,rn as Rt,rt as zt,s as Bt,st as Vt,t as Ht,tn as Ut,tt as Wt,u as Gt,ut as Kt,v as qt,vt as Jt,w as Yt,wt as Xt,x as Zt,xt as Qt,y as $t,yt as en,z as tn,zt as N}from"./vizy-LFI155ZM.js";import{n as nn,r as rn,t as an}from"./field-labels-CmuAW8Cl-Dn227Qfy.js";import{t as on}from"./menu-chevron-BMGo7hL2.js";var P=e=>(t,n)=>{n===void 0?customElements.define(e,t):n.addInitializer(()=>{customElements.define(e,t)})},sn=o`
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
`,cn=class extends l{constructor(...e){super(...e),this.status=`on`,this.ariaLabel=null}static{this.styles=sn}render(){return n`
            <span
                part="base"
                class="status"
                role="status"
                aria-label=${this.ariaLabel??r}
            ></span>
        `}};i([c({reflect:!0})],cn.prototype,`status`,void 0),i([c({attribute:`aria-label`})],cn.prototype,`ariaLabel`,void 0),cn=i([s(`pk-status`)],cn);var ln=o`
    [contenteditable='false'] {
        white-space: normal;
    }
`,un=`.vizy-editor-body`,dn=`data-has-focus`,fn=new WeakMap;function pn(e){let t=e?.closest(un);return t instanceof HTMLElement?t:null}function mn(e,t){if(!e)return;let n=fn.get(e)??0,r=Math.max(0,n+(t?1:-1));if(r===0){fn.delete(e),e.removeAttribute(dn);return}fn.set(e,r),e.setAttribute(dn,``)}function hn(e){return e instanceof PointerEvent||e instanceof MouseEvent?e.button===0:!1}function gn(e){return e.composedPath().filter(e=>e instanceof HTMLElement)}function _n(e){if(!hn(e))return!1;let t=gn(e);if(!t.some(e=>e.matches(`.vizy-editor-body`)))return!1;for(let e of t)if(e.matches(`[data-vizy-drag-handle]`)||e.matches(`input, textarea, select, option`)||e.getAttribute(`contenteditable`)===`true`)return!1;return t.some(e=>e.getAttribute(`contenteditable`)===`false`||e.hasAttribute(`data-vizy-ui`)||e.matches(`vizy-toolbar, vizy-bubble-menu, [data-vizy-ui], [data-vizy-insertion-overlay], .vizy-insertion-overlay`))?!0:!t.some(e=>e.classList.contains(`ProseMirror`))}function vn(e){e.preventDefault()}function yn(e){let t=e=>{_n(e)&&e.preventDefault()};return e.addEventListener(`pointerdown`,t,!0),()=>e.removeEventListener(`pointerdown`,t,!0)}function bn(e){if(!e||e.isDestroyed)return!1;try{return e.view.hasFocus()}catch{return!1}}function xn(e){let t=document.activeElement;return!!(!(t instanceof HTMLElement)||t===document.body||t===e.view.dom||e.view.dom.contains(t)||pn(e.view.dom)?.contains(t)||t.closest(`pk-popup, pk-dropdown-menu, pk-dropdown-item, vizy-insertion-list`))}function Sn(e,t){!e||e.isDestroyed||queueMicrotask(()=>{if(!e.isDestroyed&&!(!t?.force&&!xn(e)))try{e.view.focus()}catch{}})}function Cn(e,t){if(!e){t?.();return}mn(e,!0);let n=()=>{window.removeEventListener(`pointerup`,n,!0),window.removeEventListener(`pointercancel`,n,!0),t?.(),queueMicrotask(()=>mn(e,!1))};window.addEventListener(`pointerup`,n,!0),window.addEventListener(`pointercancel`,n,!0)}var wn={duration:220,easing:`cubic-bezier(0.2, 0.85, 0.25, 1)`};function Tn(){if(typeof window>`u`)return!1;let e=window.Garnish;return typeof e?.prefersReducedMotion==`function`?e.prefersReducedMotion():window.matchMedia(`(prefers-reduced-motion: reduce)`).matches}function En(e){if(typeof document>`u`||Tn())return;let t=document.querySelector(`vizy-block[data-block-uid="${CSS.escape(e)}"]`);!t||typeof t.animate!=`function`||requestAnimationFrame(()=>{requestAnimationFrame(()=>{let e=t.getBoundingClientRect().height;e<=0||(t.style.overflow=`hidden`,t.animate([{height:`0px`,opacity:.4,marginBlockStart:`0px`,marginBlockEnd:`0px`},{height:`${e}px`,opacity:1}],{duration:wn.duration,easing:wn.easing}).finished.finally(()=>{t.style.overflow=``}))})})}function Dn(){let e=window.$;return typeof e==`function`?e:null}function On(){let e=Dn();if(!e)return!1;try{return typeof e(document.createElement(`div`)).velocity==`function`}catch{return!1}}function kn(e){let t=Dn();if(!(!t||!On()))try{t(e).velocity(`stop`)}catch{}}function An(e,t,n={}){let r=Dn();return!r||!On()?(n.complete?.(),Promise.resolve()):new Promise(i=>{let a={...n,complete:()=>{n.complete?.(),i()}};try{r(e).velocity(t,a)}catch{a.complete?.()}})}var jn=`fast`;function F(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var I=class extends t{#e=``;get blockUid(){return this.#e}set blockUid(e){this.#e=e}#t=!1;get selected(){return this.#t}set selected(e){this.#t=e}#n=!0;get enabled(){return this.#n}set enabled(e){this.#n=e}#r=null;get accentColor(){return this.#r}set accentColor(e){this.#r=e}#i=null;get typeIconSvg(){return this.#i}set typeIconSvg(e){this.#i=e}#a=!1;get unresolved(){return this.#a}set unresolved(e){this.#a=e}#o=!1;get disabled(){return this.#o}set disabled(e){this.#o=e}#s=!1;get dragging(){return this.#s}set dragging(e){this.#s=e}#c=0;get errorCount(){return this.#c}set errorCount(e){this.#c=e}#l=0;get descendantErrorCount(){return this.#l}set descendantErrorCount(e){this.#l=e}#u=``;get title(){return this.#u}set title(e){this.#u=e}#d=null;get subtitle(){return this.#d}set subtitle(e){this.#d=e}#f=``;get typeName(){return this.#f}set typeName(e){this.#f=e}#p=`Add Block above`;get addAboveLabel(){return this.#p}set addAboveLabel(e){this.#p=e}#m=!0;get canAddAbove(){return this.#m}set canAddAbove(e){this.#m=e}#h=!0;get canDuplicate(){return this.#h}set canDuplicate(e){this.#h=e}#g=!0;get canDelete(){return this.#g}set canDelete(e){this.#g=e}#_=!0;get canMoveUp(){return this.#_}set canMoveUp(e){this.#_=e}#v=!0;get canMoveDown(){return this.#v}set canMoveDown(e){this.#v=e}#y=!1;get expectsFieldLayout(){return this.#y}set expectsFieldLayout(e){this.#y=e}#b=`unmounted`;get fieldLayoutState(){return this.#b}set fieldLayoutState(e){this.#b=e}#x=null;get fieldLayoutError(){return this.#x}set fieldLayoutError(e){this.#x=e}#S=!1;get fieldLayoutRetrying(){return this.#S}set fieldLayoutRetrying(e){this.#S=e}#C=[];get layoutTabLabels(){return this.#C}set layoutTabLabels(e){this.#C=e}#w=!1;get collapsed(){return this.#w}set collapsed(e){this.#w=e}#T=!1;get menuOpen(){return this.#T}set menuOpen(e){this.#T=e}#E=!1;get menuClosing(){return this.#E}set menuClosing(e){this.#E=e}#D=0;get activeLayoutTab(){return this.#D}set activeLayoutTab(e){this.#D=e}#O=null;updated(e){if(e.has(`menuOpen`)&&this.toggleAttribute(`menu-open`,this.menuOpen),e.has(`collapsed`)&&this.toggleAttribute(`collapsed`,this.collapsed),e.has(`layoutTabLabels`)&&this.activeLayoutTab!==0&&(this.activeLayoutTab=0),e.has(`enabled`)){let t=!!e.get(`enabled`);t&&!this.enabled?this.#R(!0,{animate:!0,persist:!0}):!t&&this.enabled&&this.#R(!1,{animate:!0,persist:!0})}if(e.has(`accentColor`)){if(this.accentColor)this.style.setProperty(`--vizy-block-accent-color`,this.accentColor);else{this.style.removeProperty(`--vizy-block-accent-color`);for(let e of[`--custom-bg-color`,`--custom-titlebar-bg-color`,`--custom-border-color`,`--custom-text-color`,`--vizy-block-label-color`])this.style.removeProperty(e)}}}static styles=[ln,o`
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
    `];applySummary(e){e&&(this.typeName=e.typeName,this.title=e.title,this.subtitle=e.subtitle,this.enabled=e.enabled,this.unresolved=!e.resolved,this.errorCount=e.errorCount,this.descendantErrorCount=e.descendantErrorCount)}#k(){let e=this.typeName||`Block`;return this.title&&this.title!==e?this.title:this.subtitle?this.subtitle:null}#A(){let e=this.typeName||`Block`;if(!this.collapsed)return e;let t=this.#k();return t?`${e}, ${t}`:e}#j(){return this.expectsFieldLayout&&this.fieldLayoutState!==`mounted`&&this.fieldLayoutState!==`error`}render(){let e=this.#k();return n`
            <header
                part="header"
                contenteditable="false"
                role="group"
                aria-label=${this.#A()}
                @pointerdown=${this.#U}
                @dblclick=${this.#W}
            >
                <div class="type" part="summary">
                    ${this.enabled?r:n`<pk-status status="off" aria-label="Disabled"></pk-status>`}
                    ${this.typeIconSvg?n`<span class="type-icon" part="type-icon" aria-hidden="true">${C(this.typeIconSvg)}</span>`:r}
                    <span class="type-label" part="type">${this.typeName||`Block`}</span>
                    ${e?n`<span class="summary-preview" part="summary-preview">${e}</span>`:r}
                </div>
                <div class="badges" part="badges">
                    ${this.errorCount?n`<span class="badge error" aria-label="${this.errorCount} errors">${this.errorCount}</span>`:r}
                    ${this.descendantErrorCount?n`<span class="badge error" aria-label="${this.descendantErrorCount} nested errors">+${this.descendantErrorCount}</span>`:r}
                    ${this.unresolved?n`<span class="badge" aria-label="Unresolved block type">?</span>`:r}
                </div>
                <div class="header-end">
                    ${this.#P()}
                    ${this.#F()}
                    <div class="actions">
                        <pk-dropdown-menu
                            size="sm"
                            placement="bottom-end"
                            @pk-open-change=${this.#q}
                            @pk-hide=${this.#G}
                            @pk-after-hide=${this.#K}
                            @pk-select=${this.#J}
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
                            ${this.canDuplicate?n`
                                <pk-dropdown-item value="duplicate">
                                    <pk-icon slot="start" icon="clone" label=""></pk-icon>
                                    Duplicate
                                </pk-dropdown-item>
                            `:r}
                            ${this.canMoveUp||this.canMoveDown?n`
                                <pk-dropdown-separator></pk-dropdown-separator>
                                ${this.canMoveUp?n`
                                    <pk-dropdown-item value="moveUp">
                                        <pk-icon slot="start" icon="arrow-up" label=""></pk-icon>
                                        Move up
                                    </pk-dropdown-item>
                                `:r}
                                ${this.canMoveDown?n`
                                    <pk-dropdown-item value="moveDown">
                                        <pk-icon slot="start" icon="arrow-down" label=""></pk-icon>
                                        Move down
                                    </pk-dropdown-item>
                                `:r}
                            `:r}
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
                            ${this.canDelete?n`
                                <pk-dropdown-separator></pk-dropdown-separator>
                                <pk-dropdown-item value="delete" destructive>
                                    <pk-icon slot="start" icon="xmark" label=""></pk-icon>
                                    Delete
                                </pk-dropdown-item>
                            `:r}
                        </pk-dropdown-menu>
                        <button
                            type="button"
                            part="drag-handle"
                            data-vizy-drag-handle
                            aria-hidden="true"
                            tabindex="-1"
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
                aria-busy=${this.#j()?`true`:r}
            >
                ${this.#M()}
                <div class="block-contents" ?hidden=${this.fieldLayoutState===`error`||this.fieldLayoutRetrying}>
                    <slot name="layout"></slot>
                </div>
            </section>
        `}#M(){return this.fieldLayoutRetrying&&this.fieldLayoutState===`loading`?n`
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
                    @click=${this.#N}
                    @pointerdown=${vn}
                >Retry</button>
            </div>
        `:r}#N=e=>{e.preventDefault(),e.stopPropagation(),this.fieldLayoutRetrying=!0,this.fieldLayoutState=`loading`,this.fieldLayoutError=null,this.dispatchEvent(new CustomEvent(`vizy-retry-field-layout`,{bubbles:!0,composed:!0,detail:{blockUid:this.blockUid}}))};#P(){return this.layoutTabLabels.length<2?r:n`
            <div class="layout-tabs" role="tablist" part="layout-tabs" aria-label="Layout tabs">
                ${this.layoutTabLabels.map((e,t)=>n`
                    <button
                        type="button"
                        class="layout-tab ${t===this.activeLayoutTab?`is-active`:``}"
                        role="tab"
                        aria-selected=${String(t===this.activeLayoutTab)}
                        data-vizy-layout-tab-index=${t}
                        @click=${()=>this.#I(t)}
                    >${e}</button>
                `)}
            </div>
            <select
                class="layout-tab-select"
                part="layout-tab-select"
                aria-label="Layout tab"
                .value=${String(this.activeLayoutTab)}
                @change=${e=>{let t=Number(e.target.value);this.#I(Number.isFinite(t)?t:0)}}
            >
                ${this.layoutTabLabels.map((e,t)=>n`
                    <option value=${t}>${e}</option>
                `)}
            </select>
        `}#F(){return r}#I(e){e!==this.activeLayoutTab&&(this.activeLayoutTab=e,this.dispatchEvent(new CustomEvent(`vizy-layout-tab-change`,{bubbles:!0,composed:!0,detail:{index:e}})))}#L(){!this.enabled&&this.collapsed||this.#R(!this.collapsed,{animate:!0,persist:!0})}#R(e,t){if(e===this.collapsed)return;let n=t.persist!==!1;if(this.#O?.abort(),this.#O=null,this.#B(),this.#V(),!t.animate||Tn()||!On()){this.setAttribute(`data-collapse-instant`,``),this.collapsed=e,this.toggleAttribute(`collapsed`,e),this.removeAttribute(`data-collapse-animating`),this.#H(e,n),requestAnimationFrame(()=>{this.removeAttribute(`data-collapse-instant`)});return}let r=new AbortController;this.#O=r,r.signal.addEventListener(`abort`,()=>this.#B(),{once:!0}),this.#z(e,r.signal,n)}async#z(e,t,n){let r=this.renderRoot.querySelector(`[part=body]`),i=this.renderRoot.querySelector(`header`);if(!r||!i){this.collapsed=e,this.toggleAttribute(`collapsed`,e),this.#H(e,n);return}if(e){let e=this.getBoundingClientRect().height;if(this.style.height=`${e}px`,this.style.overflow=`hidden`,this.setAttribute(`data-collapse-animating`,``),this.collapsed=!0,this.toggleAttribute(`collapsed`,!0),this.#H(!0,n),await this.updateComplete,t.aborted)return;let a=i.getBoundingClientRect().height;await Promise.all([An(this,{height:a},{duration:jn}),An(r,{opacity:0},{duration:jn})])}else{let e=this.getBoundingClientRect().height;if(this.style.height=`${e}px`,this.style.overflow=`hidden`,this.setAttribute(`data-collapse-animating`,``),this.collapsed=!1,this.toggleAttribute(`collapsed`,!1),this.#H(!1,n),await this.updateComplete,t.aborted)return;r.style.opacity=`0`,this.style.height=`auto`;let i=this.getBoundingClientRect().height;this.style.height=`${e}px`,this.offsetHeight,await Promise.all([An(this,{height:i},{duration:jn}),An(r,{opacity:1},{duration:jn})])}t.aborted||(this.#V(),this.removeAttribute(`data-collapse-animating`),this.#O?.signal===t&&(this.#O=null))}#B(){kn(this);let e=this.renderRoot.querySelector(`[part=body]`);e&&kn(e)}#V(){this.style.height=``,this.style.overflow=``;let e=this.renderRoot.querySelector(`[part=body]`);e&&(e.style.height=``,e.style.overflow=``,e.style.opacity=``,e.style.display=``)}#H(e,t){this.dispatchEvent(new CustomEvent(`vizy-collapse-change`,{bubbles:!0,composed:!0,detail:{collapsed:e,persist:t}}))}#U(e){if(e.button!==0)return;let t=e.composedPath();t.some(e=>e instanceof HTMLElement&&(e.matches(`[data-vizy-drag-handle]`)||e.closest(`[data-vizy-drag-handle]`)!=null))||t.some(e=>e instanceof HTMLElement&&e.matches(`button, select, a, input, textarea, pk-dropdown-menu, pk-dropdown-item, pk-button`))||(vn(e),this.dispatchEvent(new CustomEvent(`vizy-block-header-activate`,{bubbles:!0,composed:!0})))}#W(e){let t=e.target;t instanceof Element&&(t.closest(`button, select, a, input, textarea, pk-dropdown-menu, pk-dropdown-item`)||(e.preventDefault(),this.#L()))}#G=e=>{e.target===e.currentTarget&&(this.menuClosing=!0)};#K=e=>{e.target===e.currentTarget&&(this.menuClosing=!1)};#q=e=>{let t=!!e.detail?.open;t!==this.menuOpen&&(this.menuOpen=t,this.dispatchEvent(new CustomEvent(`vizy-menu-change`,{bubbles:!0,composed:!0,detail:{open:t}})))};#J=e=>{let t=e.detail?.value;if(!t)return;if(t===`toggleCollapse`){this.#L();return}let n=this.shadowRoot?.querySelector(`[part="menu-trigger"]`)??void 0;this.dispatchEvent(new CustomEvent(`vizy-block-action`,{bubbles:!0,composed:!0,detail:{action:t,invoker:n}}))}};F([c({attribute:`data-block-uid`,reflect:!0})],I.prototype,`blockUid`,null),F([c({type:Boolean,reflect:!0})],I.prototype,`selected`,null),F([c({type:Boolean,reflect:!0})],I.prototype,`enabled`,null),F([c({attribute:`accent-color`,reflect:!0})],I.prototype,`accentColor`,null),F([c({attribute:!1})],I.prototype,`typeIconSvg`,null),F([c({type:Boolean,reflect:!0})],I.prototype,`unresolved`,null),F([c({type:Boolean,reflect:!0})],I.prototype,`disabled`,null),F([c({type:Boolean,reflect:!0})],I.prototype,`dragging`,null),F([c({type:Number})],I.prototype,`errorCount`,null),F([c({type:Number})],I.prototype,`descendantErrorCount`,null),F([c({type:String})],I.prototype,`title`,null),F([c({type:String})],I.prototype,`subtitle`,null),F([c({type:String})],I.prototype,`typeName`,null),F([c({type:String})],I.prototype,`addAboveLabel`,null),F([c({type:Boolean})],I.prototype,`canAddAbove`,null),F([c({type:Boolean})],I.prototype,`canDuplicate`,null),F([c({type:Boolean})],I.prototype,`canDelete`,null),F([c({type:Boolean})],I.prototype,`canMoveUp`,null),F([c({type:Boolean})],I.prototype,`canMoveDown`,null),F([c({type:Boolean,reflect:!0,attribute:`expects-field-layout`})],I.prototype,`expectsFieldLayout`,null),F([c({attribute:`field-layout`,reflect:!0})],I.prototype,`fieldLayoutState`,null),F([c({attribute:!1})],I.prototype,`fieldLayoutError`,null),F([a()],I.prototype,`fieldLayoutRetrying`,null),F([c({attribute:!1})],I.prototype,`layoutTabLabels`,null),F([a()],I.prototype,`collapsed`,null),F([a()],I.prototype,`menuOpen`,null),F([a()],I.prototype,`menuClosing`,null),F([a()],I.prototype,`activeLayoutTab`,null),I=F([P(`vizy-block`)],I);var Mn=[p(),d(`.button`),m(),f(`.button`),o`
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
    `],Nn=class extends l{constructor(...e){super(...e),this.pressed=!1,this.disabled=!1,this.variant=`default`,this.size=`default`,this.value=``,this.ariaLabel=null}static{this.shadowRootOptions={mode:`open`,delegatesFocus:!0}}static{this.styles=Mn}handleClick(){this.disabled||this.closest(`pk-toggle-group`)||(this.pressed=!this.pressed,this.dispatchEvent(new CustomEvent(`pk-pressed-change`,{detail:{pressed:this.pressed},bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0})))}render(){return n`
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
        `}};i([c({type:Boolean,reflect:!0})],Nn.prototype,`pressed`,void 0),i([c({type:Boolean,reflect:!0})],Nn.prototype,`disabled`,void 0),i([c({reflect:!0})],Nn.prototype,`variant`,void 0),i([c({reflect:!0})],Nn.prototype,`size`,void 0),i([c({attribute:`data-value`})],Nn.prototype,`value`,void 0),i([c({attribute:`aria-label`})],Nn.prototype,`ariaLabel`,void 0),Nn=i([s(`pk-toggle`)],Nn);var Pn=o`
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
`,Fn=`data-pk-group-join`,In=`data-pk-group-item-first`,Ln=`data-pk-group-item-last`,Rn=`data-pk-group-orientation`,zn=`data-tg-orientation`,Bn=class extends l{constructor(...e){super(...e),this.orientation=`horizontal`,this.variant=`default`,this.size=`default`,this.spacing=0,this.joined=!0,this.multiple=!1,this.value=[],this.items=[],this.syncItems=()=>{let e=this.shadowRoot?.querySelector(`slot`);e&&(this.items=e.assignedElements({flatten:!0}),this.applyGroupProps(),this.syncGroupLayout(),this.applySelection())},this.handleClick=e=>{let t=e.target.closest(`[data-value]`);if(!t||!this.items.includes(t)||this.isItemDisabled(t))return;e.preventDefault();let n=this.getItemValue(t);n&&(this.value=this.multiple?this.value.includes(n)?this.value.filter(e=>e!==n):[...this.value,n]:this.value.includes(n)?[]:[n],this.applySelection(),this.dispatchEvent(new CustomEvent(`pk-value-change`,{detail:{value:[...this.value]},bubbles:!0,composed:!0})))}}static{this.styles=Pn}connectedCallback(){super.connectedCallback(),this.syncJoinedFromSpacing(),this.addEventListener(`click`,this.handleClick),this.addEventListener(`slotchange`,this.syncItems)}disconnectedCallback(){this.removeEventListener(`click`,this.handleClick),this.removeEventListener(`slotchange`,this.syncItems),super.disconnectedCallback()}updated(e){e.has(`spacing`)&&this.syncJoinedFromSpacing(),e.has(`joined`)&&!e.has(`spacing`)&&(this.spacing=this.joined?0:2),(e.has(`variant`)||e.has(`size`)||e.has(`spacing`)||e.has(`orientation`))&&this.syncGroupLayout(),e.has(`value`)&&this.items.length&&this.applySelection()}clearLayoutAttrs(e){e.removeAttribute(Fn),e.removeAttribute(In),e.removeAttribute(Ln),e.removeAttribute(Rn),e.removeAttribute(zn)}syncGroupLayout(){for(let e of this.items)this.clearLayoutAttrs(e);for(let e of this.items)this.orientation!==`horizontal`&&e.setAttribute(zn,this.orientation);if(this.spacing===0)for(let e=0;e<this.items.length;e++){let t=this.items[e];t.setAttribute(Rn,this.orientation),t.setAttribute(Fn,``),e===0&&t.setAttribute(In,``),e===this.items.length-1&&t.setAttribute(Ln,``)}}syncJoinedFromSpacing(){this.joined=this.spacing===0}applyGroupProps(){for(let e of this.items)e.tagName===`PK-TOGGLE`&&(e.setAttribute(`variant`,this.variant),e.setAttribute(`size`,this.size))}getItemValue(e){return e.getAttribute(`data-value`)??e.dataset.value??null}isItemDisabled(e){return e.hasAttribute(`disabled`)||e.matches(`:disabled`)}applySelection(){for(let e of this.items){let t=this.getItemValue(e);if(!t)continue;let n=this.value.includes(t);e.setAttribute(`aria-pressed`,n?`true`:`false`),e.tagName===`PK-TOGGLE`&&(n?e.setAttribute(`pressed`,``):e.removeAttribute(`pressed`))}}render(){return n`
            <div
                part="base"
                class="group"
                role="group"
                style=${`--pk-toggle-group-spacing: ${this.spacing}`}
                @slotchange=${this.syncItems}
            >
                <slot></slot>
            </div>
        `}};i([c({reflect:!0})],Bn.prototype,`orientation`,void 0),i([c({reflect:!0})],Bn.prototype,`variant`,void 0),i([c({reflect:!0})],Bn.prototype,`size`,void 0),i([c({type:Number,reflect:!0})],Bn.prototype,`spacing`,void 0),i([c({type:Boolean,reflect:!0})],Bn.prototype,`joined`,void 0),i([c({type:Boolean})],Bn.prototype,`multiple`,void 0),i([c({type:Array,attribute:!1})],Bn.prototype,`value`,void 0),i([a()],Bn.prototype,`items`,void 0),Bn=i([s(`pk-toggle-group`)],Bn);var Vn={paragraph:`paragraph`,heading:`heading`,bulletList:`list-ul`,orderedList:`list-ol`,blockquote:`quote-right`,codeBlock:`code`,hardBreak:`file-dashed-line`,horizontalRule:`minus`,image:`eye`,table:`table`},Hn=class extends t{#e=[];get items(){return this.#e}set items(e){this.#e=e}#t=null;get activeId(){return this.#t}set activeId(e){this.#t=e}#n=``;get query(){return this.#n}set query(e){this.#n=e}#r=`vizy-insertion-list`;get listId(){return this.#r}set listId(e){this.#r=e}#i=!0;get filterable(){return this.#i}set filterable(e){this.#i=e}#a=!1;get revealActive(){return this.#a}set revealActive(e){this.#a=e}#o=!0;get showViewToggle(){return this.#o}set showViewToggle(e){this.#o=e}#s=`list`;get view(){return this.#s}set view(e){this.#s=e}#c=null;get previewUrl(){return this.#c}set previewUrl(e){this.#c=e}static styles=o`
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
        `}#u(){let e=new Map;for(let t of this.items){let n=t.item.group||`Other`,r=e.get(n)??[];r.push(t),e.set(n,r)}return[...e.entries()]}#d(e){if(e.item.kind===`block`)return this.#f(e);let t=e.item.icon?.svg?.trim();if(t)return C(t);let r=this.#p(e);if(r)return n`<pk-icon icon=${r} label=""></pk-icon>`;let i=e.item.label.trim();return i?e.item.nodeName===`heading`?`H`:e.item.nodeName===`bulletList`?`•`:e.item.nodeName===`orderedList`?`1`:i.slice(0,1).toUpperCase():`?`}#f(e){let t=e.item.icon?.svg?.trim(),r=e.item.icon?.name?.trim();return t&&r!==`vizy-block-fallback`?C(t):n`<pk-icon icon=${h} label=""></pk-icon>`}#p(e){return e.item.nodeName&&Vn[e.item.nodeName]?Vn[e.item.nodeName]:e.item.icon?.name?.trim()||null}#m(e){let t=e.item.previewImageUrl?.trim();this.previewUrl=t||null}#h(){let e=this.getBoundingClientRect(),t=Math.min(e.right+8,window.innerWidth-16-256),n=Math.max(8,Math.min(e.top,window.innerHeight-200));return`left:${Math.max(8,t)}px;top:${n}px;`}#g(e){(e!==this.view||e!==`list`)&&(this.view=e,this.dispatchEvent(new CustomEvent(`vizy-insertion-view`,{bubbles:!0,composed:!0,detail:{view:e}})))}#_=e=>{let t=e.detail?.value?.[0];if(t===`list`||t===`grid`){this.#g(t);return}let n=e.currentTarget;n.value=[this.view]};#v=e=>{let t=e.target.value;this.query=t,this.dispatchEvent(new CustomEvent(`vizy-insertion-filter`,{bubbles:!0,composed:!0,detail:{query:t}}))};#y=e=>{(e.key===`ArrowDown`||e.key===`ArrowUp`||e.key===`Enter`)&&e.stopPropagation()};#b(e){this.dispatchEvent(new CustomEvent(`vizy-insertion-select`,{bubbles:!0,composed:!0,detail:{id:e}}))}};F([c({attribute:!1})],Hn.prototype,`items`,null),F([c({attribute:`active-id`})],Hn.prototype,`activeId`,null),F([c()],Hn.prototype,`query`,null),F([c({attribute:`list-id`})],Hn.prototype,`listId`,null),F([c({type:Boolean})],Hn.prototype,`filterable`,null),F([c({type:Boolean,attribute:`reveal-active`})],Hn.prototype,`revealActive`,null),F([c({type:Boolean,attribute:`show-view-toggle`})],Hn.prototype,`showViewToggle`,null),F([c()],Hn.prototype,`view`,null),F([a()],Hn.prototype,`previewUrl`,null),Hn=F([P(`vizy-insertion-list`)],Hn);function Un(e,t){let n=e.state.doc.resolve(t);for(let e=n.depth;e>=1;e--){let t=n.node(e);if(t.type.name===`layout`)return{layoutPos:n.before(e),node:t}}return null}function Wn(e,t,n,r){let i=e.state.doc.nodeAt(t);if(!i||i.type.name!==`layout`)return!1;let a=i.child(n);return a?Tt(e,String(a.attrs.columnUid),r):!1}var Gn=class extends t{#e=``;get layoutUid(){return this.#e}set layoutUid(e){this.#e=e}#t=`small`;get stack(){return this.#t}set stack(e){this.#t=e}#n=null;get layoutPos(){return this.#n}set layoutPos(e){this.#n=e}#r=null;get editor(){return this.#r}set editor(e){this.#r=e}#i=[];get columnSpans(){return this.#i}set columnSpans(e){this.#i=e}#a=[];get columnUids(){return this.#a}set columnUids(e){this.#a=e}static styles=[ln,o`
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
    `];render(){return n`<div class="grid-shell" part="grid-shell"><div class="grid" part="grid"><slot name="columns"></slot></div></div>`}moveColumn(e,t){this.editor!=null&&this.layoutPos!=null&&Wn(this.editor,this.layoutPos,e,t)}};F([c({type:String,reflect:!0})],Gn.prototype,`layoutUid`,null),F([c({type:String,reflect:!0})],Gn.prototype,`stack`,null),F([c({attribute:!1})],Gn.prototype,`layoutPos`,null),F([c({attribute:!1})],Gn.prototype,`editor`,null),F([c({attribute:!1})],Gn.prototype,`columnSpans`,null),F([c({attribute:!1})],Gn.prototype,`columnUids`,null),Gn=F([P(`vizy-layout`)],Gn);var Kn=class extends t{#e=``;get columnUid(){return this.#e}set columnUid(e){this.#e=e}#t=12;get span(){return this.#t}set span(e){this.#t=e}#n=0;get columnIndex(){return this.#n}set columnIndex(e){this.#n=e}#r=1;get columnCount(){return this.#r}set columnCount(e){this.#r=e}static styles=[ln,o`
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
    `];render(){return n`<div part="column"><slot name="content"></slot></div>`}};F([c({type:String,reflect:!0})],Kn.prototype,`columnUid`,null),F([c({type:Number,reflect:!0})],Kn.prototype,`span`,null),F([c({type:Number,reflect:!0})],Kn.prototype,`columnIndex`,null),F([c({type:Number,reflect:!0})],Kn.prototype,`columnCount`,null),Kn=F([P(`vizy-column`)],Kn);var qn=class extends t{#e=[];get presets(){return this.#e}set presets(e){this.#e=e}static styles=o`
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
        `}#t(e){this.dispatchEvent(new CustomEvent(`vizy-layout-preset-select`,{bubbles:!0,composed:!0,detail:{presetId:e}}))}};F([c({attribute:!1})],qn.prototype,`presets`,null),qn=F([P(`vizy-layout-preset-chooser`)],qn);var Jn=class{#e=null;#t=null;open(e,t,n,r){this.close();let i=document.createElement(`vizy-layout-preset-chooser`);i.presets=t;let a=document.createElement(`pk-popup`);a.className=`vizy-layout-preset-popup`,a.placement=`bottom-start`,a.distance=4,a.flip=!0,a.shift=!0,a.positionMethod=`fixed`,a.anchor=this.#n(e),a.append(i),document.body.append(a);let o={popup:a,chooser:i,returnFocus:r.returnFocus??null,onClose:r.onClose??(()=>void 0)};this.#e=o,a.active=!0;let s=!1,c=e=>{s=!0,r.onSelect(e),this.close()};i.addEventListener(`vizy-layout-preset-select`,(e=>{c(e.detail.presetId)}));let l=e=>{e.key===`Escape`&&(e.preventDefault(),this.close())},u=e=>{let t=e.composedPath();t.includes(a)||t.includes(i)||this.close()};document.addEventListener(`keydown`,l,!0),document.addEventListener(`pointerdown`,u,!0),this.#t=()=>{document.removeEventListener(`keydown`,l,!0),document.removeEventListener(`pointerdown`,u,!0)},o.onClose=()=>{s||r.onClose?.()}}close(){this.#t?.(),this.#t=null;let e=this.#e;this.#e=null,e&&(e.popup.active=!1,e.popup.remove(),e.returnFocus?.focus(),e.onClose())}get isOpen(){return this.#e!==null}#n(e){return{getBoundingClientRect:()=>e}}},Yn=Object.defineProperty,Xn=(e,t)=>{for(var n in t)Yn(e,n,{get:t[n],enumerable:!0})};function Zn(e){let{state:t,transaction:n}=e,{selection:r}=n,{doc:i}=n,{storedMarks:a}=n;return{...t,apply:t.apply.bind(t),applyTransaction:t.applyTransaction.bind(t),plugins:t.plugins,schema:t.schema,reconfigure:t.reconfigure.bind(t),toJSON:t.toJSON.bind(t),get storedMarks(){return a},get selection(){return r},get doc(){return i},get tr(){return r=n.selection,i=n.doc,a=n.storedMarks,n}}}var Qn=class{constructor(e){this.editor=e.editor,this.rawCommands=this.editor.extensionManager.commands,this.customState=e.state}get hasCustomState(){return!!this.customState}get state(){return this.customState||this.editor.state}get commands(){let{rawCommands:e,editor:t,state:n}=this,{view:r}=t,{tr:i}=n,a=this.buildProps(i);return Object.fromEntries(Object.entries(e).map(([e,t])=>[e,(...e)=>{let n=t(...e)(a);return!i.getMeta(`preventDispatch`)&&!this.hasCustomState&&r.dispatch(i),n}]))}get chain(){return()=>this.createChain()}get can(){return()=>this.createCan()}createChain(e,t=!0){let{rawCommands:n,editor:r,state:i}=this,{view:a}=r,o=[],s=!!e,c=e||i.tr,l=()=>(!s&&t&&!c.getMeta(`preventDispatch`)&&!this.hasCustomState&&a.dispatch(c),o.every(e=>e===!0)),u={...Object.fromEntries(Object.entries(n).map(([e,n])=>[e,(...e)=>{let r=this.buildProps(c,t),i=n(...e)(r);return o.push(i),u}])),run:l};return u}createCan(e){let{rawCommands:t,state:n}=this,r=e||n.tr,i=this.buildProps(r,!1);return{...Object.fromEntries(Object.entries(t).map(([e,t])=>[e,(...e)=>t(...e)({...i,dispatch:void 0})])),chain:()=>this.createChain(r,!1)}}buildProps(e,t=!0){let{rawCommands:n,editor:r,state:i}=this,{view:a}=r,o={tr:e,editor:r,view:a,state:Zn({state:i,transaction:e}),dispatch:t?()=>void 0:void 0,chain:()=>this.createChain(e,t),can:()=>this.createCan(e),get commands(){return Object.fromEntries(Object.entries(n).map(([e,t])=>[e,(...e)=>t(...e)(o)]))}};return o}},$n={};Xn($n,{blur:()=>er,clearContent:()=>tr,clearNodes:()=>nr,command:()=>rr,createParagraphNear:()=>ir,cut:()=>ar,deleteCurrentNode:()=>or,deleteNode:()=>sr,deleteRange:()=>cr,deleteSelection:()=>lr,enter:()=>ur,exitCode:()=>dr,extendMarkRange:()=>vr,first:()=>yr,focus:()=>Er,forEach:()=>Dr,insertContent:()=>Or,insertContentAt:()=>Pr,joinBackward:()=>Lr,joinDown:()=>Ir,joinForward:()=>Rr,joinItemBackward:()=>zr,joinItemForward:()=>Br,joinTextblockBackward:()=>Vr,joinTextblockForward:()=>Hr,joinUp:()=>Fr,keyboardShortcut:()=>Gr,lift:()=>qr,liftEmptyBlock:()=>Jr,liftListItem:()=>Yr,newlineInCode:()=>Xr,resetAttributes:()=>$r,scrollIntoView:()=>ei,selectAll:()=>ti,selectNodeBackward:()=>ni,selectNodeForward:()=>ri,selectParentNode:()=>ii,selectTextblockEnd:()=>ai,selectTextblockStart:()=>oi,setContent:()=>ci,setMark:()=>Fi,setMeta:()=>Ii,setNode:()=>Li,setNodeSelection:()=>Ri,setTextDirection:()=>zi,setTextSelection:()=>Bi,sinkListItem:()=>Vi,splitBlock:()=>Ui,splitListItem:()=>Wi,toggleList:()=>Ji,toggleMark:()=>Yi,toggleNode:()=>Xi,toggleWrap:()=>Zi,undoInputRule:()=>Qi,unsetAllMarks:()=>$i,unsetMark:()=>ea,unsetTextDirection:()=>ta,updateAttributes:()=>na,wrapIn:()=>ra,wrapInList:()=>ia});var er=()=>({editor:e,view:t})=>(requestAnimationFrame(()=>{var n;e.isDestroyed||(t.dom.blur(),(n=window==null?void 0:window.getSelection())==null||n.removeAllRanges())}),!0),tr=(e=!0)=>({commands:t})=>t.setContent(``,{emitUpdate:e}),nr=()=>({state:e,tr:t,dispatch:n})=>{let{selection:r}=t,{ranges:i}=r;return n&&i.forEach(({$from:n,$to:r})=>{e.doc.nodesBetween(n.pos,r.pos,(e,n)=>{if(e.type.isText)return;let{doc:r,mapping:i}=t,a=r.resolve(i.map(n)),o=r.resolve(i.map(n+e.nodeSize)),s=a.blockRange(o);if(!s)return;let c=tt(s);if(e.type.isTextblock){let{defaultType:e}=a.parent.contentMatchAt(a.index());t.setNodeMarkup(s.start,e)}(c||c===0)&&t.lift(s,c)})}),!0},rr=e=>t=>e(t),ir=()=>({state:e,dispatch:t})=>Ot(e,t),ar=(e,t)=>({editor:n,tr:r})=>{let{state:i}=n,a=i.doc.slice(e.from,e.to);r.deleteRange(e.from,e.to);let o=r.mapping.map(t);return r.insert(o,a.content),r.setSelection(new N(r.doc.resolve(Math.max(o-1,0)))),!0},or=()=>({tr:e,dispatch:t})=>{let{selection:n}=e,r=n.$anchor.node();if(r.content.size>0)return!1;let i=e.selection.$anchor;for(let n=i.depth;n>0;--n)if(i.node(n).type===r.type){if(t){let t=i.before(n),r=i.after(n);e.delete(t,r).scrollIntoView()}return!0}return!1};function L(e,t){if(typeof e==`string`){if(!t.nodes[e])throw Error(`There is no node type named '${e}'. Maybe you forgot to add the extension?`);return t.nodes[e]}return e}var sr=e=>({tr:t,state:n,dispatch:r})=>{let i=L(e,n.schema),a=t.selection.$anchor;for(let e=a.depth;e>0;--e)if(a.node(e).type===i){if(r){let n=a.before(e),r=a.after(e);t.delete(n,r).scrollIntoView()}return!0}return!1},cr=e=>({tr:t,dispatch:n})=>{let{from:r,to:i}=e;return n&&t.delete(r,i),!0},lr=()=>({state:e,dispatch:t})=>vt(e,t),ur=()=>({commands:e})=>e.keyboardShortcut(`Enter`),dr=()=>({state:e,dispatch:t})=>gt(e,t);function fr(e){return Object.prototype.toString.call(e)===`[object RegExp]`}function pr(e,t,n={strict:!0}){let r=Object.keys(t);return!r.length||r.every(r=>n.strict?t[r]===e[r]:fr(t[r])?t[r].test(e[r]):t[r]===e[r])}function mr(e,t,n={}){return e.find(e=>e.type===t&&pr(Object.fromEntries(Object.keys(n).map(t=>[t,e.attrs[t]])),n))}function hr(e,t,n={}){return!!mr(e,t,n)}function gr(e,t,n){if(!e||!t)return;let r=e.parent.childAfter(e.parentOffset);if((!r.node||!r.node.marks.some(e=>e.type===t))&&(r=e.parent.childBefore(e.parentOffset)),!r.node||!r.node.marks.some(e=>e.type===t))return;if(!n){let e=r.node.marks.find(e=>e.type===t);e&&(n=e.attrs)}if(!mr([...r.node.marks],t,n))return;let i=r.index,a=e.start()+r.offset,o=i+1,s=a+r.node.nodeSize;for(;i>0&&hr([...e.parent.child(i-1).marks],t,n);)--i,a-=e.parent.child(i).nodeSize;for(;o<e.parent.childCount&&hr([...e.parent.child(o).marks],t,n);)s+=e.parent.child(o).nodeSize,o+=1;return{from:a,to:s}}function _r(e,t){if(typeof e==`string`){if(!t.marks[e])throw Error(`There is no mark type named '${e}'. Maybe you forgot to add the extension?`);return t.marks[e]}return e}var vr=(e,t)=>({tr:n,state:r,dispatch:i})=>{let a=_r(e,r.schema),{doc:o,selection:s}=n,{$from:c,from:l,to:u}=s;if(i){let e=gr(c,a,t);if(e&&e.from<=l&&e.to>=u){let t=N.create(o,e.from,e.to);n.setSelection(t)}}return!0},yr=e=>t=>{let n=typeof e==`function`?e(t):e;for(let e=0;e<n.length;e+=1)if(n[e](t))return!0;return!1};function br(e){return e instanceof N}function xr(e=0,t=0,n=0){return Math.min(Math.max(e,t),n)}function Sr(e,t=null){if(!t)return null;let n=D.atStart(e),r=D.atEnd(e);if(t===`start`||t===!0)return n;if(t===`end`)return r;let i=n.from,a=r.to;return t===`all`?N.create(e,xr(0,i,a),xr(e.content.size,i,a)):N.create(e,xr(t,i,a),xr(t,i,a))}function Cr(){return navigator.platform===`Android`||/android/i.test(navigator.userAgent)}function wr(){return[`iPad Simulator`,`iPhone Simulator`,`iPod Simulator`,`iPad`,`iPhone`,`iPod`].includes(navigator.platform)||navigator.userAgent.includes(`Mac`)&&`ontouchend`in document}function Tr(){return typeof navigator<`u`&&/^((?!chrome|android).)*safari/i.test(navigator.userAgent)}var Er=(e=null,t={})=>({editor:n,view:r,tr:i,dispatch:a})=>{t={scrollIntoView:!0,...t};let o=()=>{(wr()||Cr())&&r.dom.focus(),Tr()&&!wr()&&!Cr()&&r.dom.focus({preventScroll:!0}),requestAnimationFrame(()=>{n.isDestroyed||(r.focus(),t?.scrollIntoView&&n.commands.scrollIntoView())})};try{if(r.hasFocus()&&e===null||e===!1)return!0}catch{return!1}if(a&&e===null&&!br(n.state.selection))return o(),!0;let s=Sr(i.doc,e)||n.state.selection,c=n.state.selection.eq(s);return a&&(c||i.setSelection(s),c&&i.storedMarks&&i.setStoredMarks(i.storedMarks),o()),!0},Dr=(e,t)=>n=>e.every((e,r)=>t(e,{...n,index:r})),Or=(e,t)=>({tr:n,commands:r})=>r.insertContentAt({from:n.selection.from,to:n.selection.to},e,t),kr=e=>{let t=e.childNodes;for(let n=t.length-1;n>=0;--n){let r=t[n];r.nodeType===3&&r.nodeValue&&/^(\n\s\s|\n)$/.test(r.nodeValue)?e.removeChild(r):r.nodeType===1&&kr(r)}return e};function Ar(e){if(typeof window>`u`)throw Error(`[tiptap error]: there is no window object available, so this function cannot be used`);let t=`<body>${e}</body>`,n=new window.DOMParser().parseFromString(t,`text/html`).body;return kr(n)}function jr(e,t,n){if(e instanceof ft||e instanceof k)return e;n={slice:!0,parseOptions:{},...n};let r=typeof e==`object`&&!!e,i=typeof e==`string`;if(r)try{if(Array.isArray(e)&&e.length>0)return k.fromArray(e.map(e=>t.nodeFromJSON(e)));let r=t.nodeFromJSON(e);return n.errorOnInvalidContent&&r.check(),r}catch(r){if(n.errorOnInvalidContent)throw Error(`[tiptap error]: Invalid JSON content`,{cause:r});return console.warn(`[tiptap warn]: Invalid content.`,`Passed value:`,e,`Error:`,r),jr(``,t,n)}if(i){if(n.errorOnInvalidContent){let r=!1,i=``,a=new Ut({topNode:t.spec.topNode,marks:t.spec.marks,nodes:t.spec.nodes.append({__tiptap__private__unknown__catch__all__node:{content:`inline*`,group:`block`,parseDOM:[{tag:`*`,getAttrs:e=>(r=!0,i=typeof e==`string`?e:e.outerHTML,null)}]}})});if(n.slice?$e.fromSchema(a).parseSlice(Ar(e),n.parseOptions):$e.fromSchema(a).parse(Ar(e),n.parseOptions),n.errorOnInvalidContent&&r)throw Error(`[tiptap error]: Invalid HTML content`,{cause:Error(`Invalid element found: ${i}`)})}let r=$e.fromSchema(t);return n.slice?r.parseSlice(Ar(e),n.parseOptions).content:r.parse(Ar(e),n.parseOptions)}return jr(``,t,n)}function Mr(e,t,n){let r=e.steps.length-1;if(r<t)return;let i=e.steps[r];if(!(i instanceof qe||i instanceof Te))return;let a=e.mapping.maps[r],o=0;a.forEach((e,t,n,r)=>{o===0&&(o=r)}),e.setSelection(D.near(e.doc.resolve(o),n))}var Nr=e=>!(`type`in e),Pr=(e,t,n)=>({tr:r,dispatch:i,editor:a})=>{if(i){n={parseOptions:a.options.parseOptions,updateSelection:!0,applyInputRules:!1,applyPasteRules:!1,...n};let i,o=e=>{a.emit(`contentError`,{editor:a,error:e,disableCollaboration:()=>{`collaboration`in a.storage&&typeof a.storage.collaboration==`object`&&a.storage.collaboration&&(a.storage.collaboration.isDisabled=!0)}})},s={preserveWhitespace:`full`,...n.parseOptions};if(!n.errorOnInvalidContent&&!a.options.enableContentCheck&&a.options.emitContentError)try{jr(t,a.schema,{parseOptions:s,errorOnInvalidContent:!0})}catch(e){o(e)}try{i=jr(t,a.schema,{parseOptions:s,errorOnInvalidContent:n.errorOnInvalidContent??a.options.enableContentCheck})}catch(e){return o(e),!1}let{from:c,to:l}=typeof e==`number`?{from:e,to:e}:{from:e.from,to:e.to},u=!0,d=!0;if((Nr(i)?i:[i]).forEach(e=>{e.check(),u=u?e.isText&&e.marks.length===0:!1,d=d?e.isBlock:!1}),c===l&&d){let{parent:e}=r.doc.resolve(c);e.isTextblock&&!e.type.spec.code&&!e.childCount&&(--c,l+=1)}let f;if(u){if(Array.isArray(t))f=t.map(e=>e.text||``).join(``);else if(t instanceof k){let e=``;t.forEach(t=>{t.text&&(e+=t.text)}),f=e}else f=typeof t==`object`&&t&&t.text?t.text:t;r.insertText(f,c,l)}else{f=i;let e=r.doc.resolve(c),t=e.node(),n=e.parentOffset===0,a=t.isText||t.isTextblock,o=t.content.size>0;n&&a&&o&&d&&(c=Math.max(0,c-1)),r.replaceWith(c,l,f)}n.updateSelection&&Mr(r,r.steps.length-1,-1),n.applyInputRules&&r.setMeta(`applyInputRules`,{from:c,text:f}),n.applyPasteRules&&r.setMeta(`applyPasteRules`,{from:c,text:f})}return!0},Fr=()=>({state:e,dispatch:t})=>Ue(e,t),Ir=()=>({state:e,dispatch:t})=>Jt(e,t),Lr=()=>({state:e,dispatch:t})=>it(e,t),Rr=()=>({state:e,dispatch:t})=>en(e,t),zr=()=>({state:e,dispatch:t,tr:n})=>{try{let r=Oe(e.doc,e.selection.$from.pos,-1);return r!=null&&(n.join(r,2),t&&t(n),!0)}catch{return!1}},Br=()=>({state:e,dispatch:t,tr:n})=>{try{let r=Oe(e.doc,e.selection.$from.pos,1);return r!=null&&(n.join(r,2),t&&t(n),!0)}catch{return!1}},Vr=()=>({state:e,dispatch:t})=>ct(e,t),Hr=()=>({state:e,dispatch:t})=>Qt(e,t);function Ur(){return typeof navigator<`u`&&/Mac/.test(navigator.platform)}function Wr(e){let t=e.split(/-(?!$)/),n=t[t.length-1];n===`Space`&&(n=` `);let r,i,a,o;for(let e=0;e<t.length-1;e+=1){let n=t[e];if(/^(cmd|meta|m)$/i.test(n))o=!0;else if(/^a(lt)?$/i.test(n))r=!0;else if(/^(c|ctrl|control)$/i.test(n))i=!0;else if(/^s(hift)?$/i.test(n))a=!0;else if(/^mod$/i.test(n))wr()||Ur()?o=!0:i=!0;else throw Error(`Unrecognized modifier name: ${n}`)}return r&&(n=`Alt-${n}`),i&&(n=`Ctrl-${n}`),o&&(n=`Meta-${n}`),a&&(n=`Shift-${n}`),n}var Gr=e=>({editor:t,view:n,tr:r,dispatch:i})=>{let a=Wr(e).split(/-(?!$)/),o=a.find(e=>![`Alt`,`Ctrl`,`Meta`,`Shift`].includes(e)),s=new KeyboardEvent(`keydown`,{key:o===`Space`?` `:o,altKey:a.includes(`Alt`),ctrlKey:a.includes(`Ctrl`),metaKey:a.includes(`Meta`),shiftKey:a.includes(`Shift`),bubbles:!0,cancelable:!0});return t.captureTransaction(()=>{n.someProp(`handleKeyDown`,e=>e(n,s))})?.steps.forEach(e=>{let t=e.map(r.mapping);t&&i&&r.maybeStep(t)}),!0};function Kr(e,t,n={}){let{from:r,to:i,empty:a}=e.selection,o=t?L(t,e.schema):null,s=[];e.doc.nodesBetween(r,i,(e,t)=>{if(e.isText)return;let n=Math.max(r,t),a=Math.min(i,t+e.nodeSize);s.push({node:e,from:n,to:a})});let c=i-r,l=s.filter(e=>!o||o.name===e.node.type.name).filter(e=>pr(e.node.attrs,n,{strict:!1}));return a?!!l.length:l.reduce((e,t)=>e+t.to-t.from,0)>=c}var qr=(e,t={})=>({state:n,dispatch:r})=>Kr(n,L(e,n.schema),t)?_e(n,r):!1,Jr=()=>({state:e,dispatch:t})=>Xt(e,t),Yr=e=>({state:t,dispatch:n})=>{let r=L(e,t.schema);return dt(r)(t,n)},Xr=()=>({state:e,dispatch:t})=>Ge(e,t);function Zr(e,t){return t.nodes[e]?`node`:t.marks[e]?`mark`:null}function Qr(e,t){let n=typeof t==`string`?[t]:t;return Object.keys(e).reduce((t,r)=>(n.includes(r)||(t[r]=e[r]),t),{})}var $r=(e,t)=>({tr:n,state:r,dispatch:i})=>{let a=null,o=null,s=Zr(typeof e==`string`?e:e.name,r.schema);if(!s)return!1;s===`node`&&(a=L(e,r.schema)),s===`mark`&&(o=_r(e,r.schema));let c=!1;return n.selection.ranges.forEach(e=>{r.doc.nodesBetween(e.$from.pos,e.$to.pos,(e,r)=>{a&&a===e.type&&(c=!0,i&&n.setNodeMarkup(r,void 0,Qr(e.attrs,t))),o&&e.marks.length&&e.marks.forEach(a=>{o===a.type&&(c=!0,i&&n.addMark(r,r+e.nodeSize,o.create(Qr(a.attrs,t))))})})}),c},ei=()=>({tr:e,dispatch:t})=>(t&&e.scrollIntoView(),!0),ti=()=>({tr:e,dispatch:t})=>{if(t){let t=new Fe(e.doc);e.setSelection(t)}return!0},ni=()=>({state:e,dispatch:t})=>be(e,t),ri=()=>({state:e,dispatch:t})=>ye(e,t),ii=()=>({state:e,dispatch:t})=>Le(e,t),ai=()=>({state:e,dispatch:t})=>wt(e,t),oi=()=>({state:e,dispatch:t})=>pe(e,t);function si(e,t,n={},r={}){return jr(e,t,{slice:!1,parseOptions:n,errorOnInvalidContent:r.errorOnInvalidContent})}var ci=(e,{errorOnInvalidContent:t,emitUpdate:n=!0,parseOptions:r={}}={})=>({editor:i,tr:a,dispatch:o,commands:s})=>{let{doc:c}=a;if(r.preserveWhitespace!==`full`){let s=si(e,i.schema,r,{errorOnInvalidContent:t??i.options.enableContentCheck});return o&&a.replaceWith(0,c.content.size,s).setMeta(`preventUpdate`,!n),!0}return o&&a.setMeta(`preventUpdate`,!n),s.insertContentAt({from:0,to:c.content.size},e,{parseOptions:r,errorOnInvalidContent:t??i.options.enableContentCheck})};function li(e,t){let n=_r(t,e.schema),{from:r,to:i,empty:a}=e.selection,o=[];a?(e.storedMarks&&o.push(...e.storedMarks),o.push(...e.selection.$head.marks())):e.doc.nodesBetween(r,i,e=>{o.push(...e.marks)});let s=o.find(e=>e.type.name===n.name);return s?{...s.attrs}:{}}function ui(e,t){let n=new Ze(e);return t.forEach(e=>{e.steps.forEach(e=>{n.step(e)})}),n}function di(e){for(let t=0;t<e.edgeCount;t+=1){let{type:n}=e.edge(t);if(n.isTextblock&&!n.hasRequiredAttrs())return n}return null}function fi(e,t,n){let r=[];return e.nodesBetween(t.from,t.to,(e,t)=>{n(e)&&r.push({node:e,pos:t})}),r}function pi(e,t){for(let n=e.depth;n>0;--n){let r=e.node(n);if(t(r))return{pos:n>0?e.before(n):0,start:e.start(n),depth:n,node:r}}}function mi(e){return t=>pi(t.$from,e)}function hi(e,t,n){return e.config[t]===void 0&&e.parent?hi(e.parent,t,n):typeof e.config[t]==`function`?e.config[t].bind({...n,parent:e.parent?hi(e.parent,t,n):null}):e.config[t]}function gi(e){return typeof e==`function`}function _i(e,t=void 0,...n){return gi(e)?t?e.bind(t)(...n):e(...n):e}function vi(e){return{baseExtensions:e.filter(e=>e.type===`extension`),nodeExtensions:e.filter(e=>e.type===`node`),markExtensions:e.filter(e=>e.type===`mark`)}}function yi(e){let t=[],n=``,r=!1,i=!1,a=0,o=e.length;for(let s=0;s<o;s+=1){let o=e[s];if(o===`'`&&!i){r=!r,n+=o;continue}if(o===`"`&&!r){i=!i,n+=o;continue}if(!r&&!i){if(o===`(`){a+=1,n+=o;continue}if(o===`)`&&a>0){--a,n+=o;continue}if(o===`;`&&a===0){t.push(n),n=``;continue}}n+=o}return n&&t.push(n),t}function bi(e){let t=[],n=yi(e||``),r=n.length;for(let e=0;e<r;e+=1){let r=n[e],i=r.indexOf(`:`);if(i===-1)continue;let a=r.slice(0,i).trim(),o=r.slice(i+1).trim();a&&o&&t.push([a,o])}return t}function xi(...e){return e.filter(e=>!!e).reduce((e,t)=>{let n={...e};return Object.entries(t).forEach(([e,t])=>{if(!n[e]){n[e]=t;return}if(e===`class`){let r=t?String(t).split(` `):[],i=n[e]?n[e].split(` `):[],a=r.filter(e=>!i.includes(e));n[e]=[...i,...a].join(` `)}else if(e===`style`){let r=new Map([...bi(n[e]),...bi(t)]);n[e]=Array.from(r.entries()).map(([e,t])=>`${e}: ${t}`).join(`; `)}else n[e]=t}),n},{})}function Si(e,t,n){let{from:r,to:i}=t,{blockSeparator:a=`

`,textSerializers:o={}}=n||{},s=``;return e.nodesBetween(r,i,(e,n,c,l)=>{e.isBlock&&n>r&&(s+=a);let u=o?.[e.type.name];if(u)return c&&(s+=u({node:e,pos:n,parent:c,index:l,range:t})),!1;e.isText&&(s+=(e?.text)?.slice(Math.max(r,n)-n,i-n))}),s}function Ci(e){return Object.fromEntries(Object.entries(e.nodes).filter(([,e])=>e.spec.toText).map(([e,t])=>[e,t.spec.toText]))}function wi(e,t){let n=L(t,e.schema),{from:r,to:i}=e.selection,a=[];e.doc.nodesBetween(r,i,e=>{a.push(e)});let o=a.reverse().find(e=>e.type.name===n.name);return o?{...o.attrs}:{}}function Ti(e,t){let n=Zr(typeof t==`string`?t:t.name,e.schema);return n===`node`?wi(e,t):n===`mark`?li(e,t):{}}function Ei(e,t=JSON.stringify){let n={};return e.filter(e=>{let r=t(e);return Object.prototype.hasOwnProperty.call(n,r)?!1:n[r]=!0})}function Di(e){let t=Ei(e);return t.length===1?t:t.filter((e,n)=>!t.filter((e,t)=>t!==n).some(t=>e.oldRange.from>=t.oldRange.from&&e.oldRange.to<=t.oldRange.to&&e.newRange.from>=t.newRange.from&&e.newRange.to<=t.newRange.to))}function Oi(e){let{mapping:t,steps:n}=e,r=[];return t.maps.forEach((e,i)=>{let a=[];if(e.ranges.length)e.forEach((e,t)=>{a.push({from:e,to:t})});else{let{from:e,to:t}=n[i];if(e===void 0||t===void 0)return;a.push({from:e,to:t})}a.forEach(({from:e,to:n})=>{let a=t.slice(i).map(e,-1),o=t.slice(i).map(n),s=t.invert().map(a,-1),c=t.invert().map(o);r.push({oldRange:{from:s,to:c},newRange:{from:a,to:o}})})}),Di(r)}function ki(e,t,n){let r=[];return e===t?n.resolve(e).marks().forEach(t=>{let i=gr(n.resolve(e),t.type);i&&r.push({mark:t,...i})}):n.nodesBetween(e,t,(e,t)=>{!e||e?.nodeSize===void 0||r.push(...e.marks.map(n=>({from:t,to:t+e.nodeSize,mark:n})))}),r}function Ai(e,t,n){return Object.fromEntries(Object.entries(n).filter(([n])=>{let r=e.find(e=>e.type===t&&e.name===n);return r?r.attribute.keepOnSplit:!1}))}function ji(e,t,n={}){let{empty:r,ranges:i}=e.selection,a=t?_r(t,e.schema):null;if(r)return!!(e.storedMarks||e.selection.$from.marks()).filter(e=>!a||a.name===e.type.name).find(e=>pr(e.attrs,n,{strict:!1}));let o=0,s=[];if(i.forEach(({$from:t,$to:n})=>{let r=t.pos,i=n.pos;e.doc.nodesBetween(r,i,(e,t)=>{if(a&&e.inlineContent&&!e.type.allowsMarkType(a))return!1;if(!e.isText&&!e.marks.length)return;let n=Math.max(r,t),c=Math.min(i,t+e.nodeSize),l=c-n;o+=l,s.push(...e.marks.map(e=>({mark:e,from:n,to:c})))})}),o===0)return!1;let c=s.filter(e=>!a||a.name===e.mark.type.name).filter(e=>pr(e.mark.attrs,n,{strict:!1})).reduce((e,t)=>e+t.to-t.from,0),l=s.filter(e=>!a||e.mark.type!==a&&e.mark.type.excludes(a)).reduce((e,t)=>e+t.to-t.from,0);return(c>0?c+l:c)>=o}function Mi(e,t){let{nodeExtensions:n}=vi(t),r=n.find(t=>t.name===e);if(!r)return!1;let i=_i(hi(r,`group`,{name:r.name,options:r.options,storage:r.storage}));return typeof i==`string`&&i.split(` `).includes(`list`)}function Ni(e,{checkChildren:t=!0,ignoreWhitespace:n=!1}={}){if(n){if(e.type.name===`hardBreak`)return!0;if(e.isText)return!/\S/.test(e.text??``)}if(e.isText)return!e.text;if(e.isAtom||e.isLeaf)return!1;if(e.content.childCount===0)return!0;if(t){let r=!0;return e.content.forEach(e=>{r!==!1&&(Ni(e,{ignoreWhitespace:n,checkChildren:t})||(r=!1))}),r}return!1}function Pi(e,t,n){let{selection:r}=t,i=null;if(br(r)&&(i=r.$cursor),i){let t=e.storedMarks??i.marks();return i.parent.type.allowsMarkType(n)&&(!!n.isInSet(t)||!t.some(e=>e.type.excludes(n)))}let{ranges:a}=r;return a.some(({$from:t,$to:r})=>{let i=t.depth===0&&e.doc.inlineContent&&e.doc.type.allowsMarkType(n);return e.doc.nodesBetween(t.pos,r.pos,(e,t,r)=>{if(i)return!1;if(e.isInline){let t=!r||r.type.allowsMarkType(n),a=!!n.isInSet(e.marks)||!e.marks.some(e=>e.type.excludes(n));i=t&&a}return!i}),i})}var Fi=(e,t={})=>({tr:n,state:r,dispatch:i})=>{let{selection:a}=n,{empty:o,ranges:s}=a,c=_r(e,r.schema);if(i){if(o){let e=li(r,c);n.addStoredMark(c.create({...e,...t}))}else s.forEach(e=>{let i=e.$from.pos,a=e.$to.pos;r.doc.nodesBetween(i,a,(e,r)=>{let o=Math.max(r,i),s=Math.min(r+e.nodeSize,a);e.marks.find(e=>e.type===c)?e.marks.forEach(e=>{c===e.type&&n.addMark(o,s,c.create({...e.attrs,...t}))}):n.addMark(o,s,c.create(t))})})}return Pi(r,n,c)},Ii=(e,t)=>({tr:n})=>(n.setMeta(e,t),!0),Li=(e,t={})=>({state:n,dispatch:r,chain:i})=>{let a=L(e,n.schema),o;return n.selection.$anchor.sameParent(n.selection.$head)&&(o=n.selection.$anchor.parent.attrs),a.isTextblock?i().command(({commands:e})=>Ct(a,{...o,...t})(n)?!0:e.clearNodes()).command(({state:e})=>Ct(a,{...o,...t})(e,r)).run():(console.warn(`[tiptap warn]: Currently "setNode()" only supports text block nodes.`),!1)},Ri=e=>({tr:t,dispatch:n})=>{if(n){let{doc:n}=t,r=xr(e,0,n.content.size),i=O.create(n,r);t.setSelection(i)}return!0},zi=(e,t)=>({tr:n,state:r,dispatch:i})=>{let{selection:a}=r,o,s;return typeof t==`number`?(o=t,s=t):t&&`from`in t&&`to`in t?(o=t.from,s=t.to):(o=a.from,s=a.to),i&&n.doc.nodesBetween(o,s,(t,r)=>{t.isText||n.setNodeMarkup(r,void 0,{...t.attrs,dir:e})}),!0},Bi=e=>({tr:t,dispatch:n})=>{if(n){let{doc:n}=t,{from:r,to:i}=typeof e==`number`?{from:e,to:e}:e,a=N.atStart(n).from,o=N.atEnd(n).to,s=xr(r,a,o),c=xr(i,a,o),l=N.create(n,s,c);t.setSelection(l)}return!0},Vi=e=>({state:t,dispatch:n})=>{let r=L(e,t.schema);return mt(r)(t,n)};function Hi(e,t){let n=e.storedMarks||e.selection.$to.parentOffset&&e.selection.$from.marks();if(n){let r=n.filter(e=>t?.includes(e.type.name));e.tr.ensureMarks(r)}}var Ui=({keepMarks:e=!0}={})=>({tr:t,state:n,dispatch:r,editor:i})=>{let{selection:a,doc:o}=t,{$from:s,$to:c}=a,l=i.extensionManager.attributes,u=Ai(l,s.node().type.name,s.node().attrs);if(a instanceof O&&a.node.isBlock)return!s.parentOffset||!Ae(o,s.pos)?!1:(r&&(e&&Hi(n,i.extensionManager.splittableMarks),t.split(s.pos).scrollIntoView()),!0);if(!s.parent.isBlock)return!1;let d=c.parentOffset===c.parent.content.size,f=s.depth===0?void 0:di(s.node(-1).contentMatchAt(s.indexAfter(-1))),p=d&&f?[{type:f,attrs:u}]:void 0,m=Ae(t.doc,t.mapping.map(s.pos),1,p);if(!p&&!m&&Ae(t.doc,t.mapping.map(s.pos),1,f?[{type:f}]:void 0)&&(m=!0,p=f?[{type:f,attrs:u}]:void 0),r){if(m&&(a instanceof N&&t.deleteSelection(),t.split(t.mapping.map(s.pos),1,p),f&&!d&&!s.parentOffset&&s.parent.type!==f)){let e=t.mapping.map(s.before()),n=t.doc.resolve(e);s.node(-1).canReplaceWith(n.index(),n.index()+1,f)&&t.setNodeMarkup(t.mapping.map(s.before()),f)}e&&Hi(n,i.extensionManager.splittableMarks),t.scrollIntoView()}return m},Wi=(e,t={})=>({tr:n,state:r,dispatch:i,editor:a})=>{let o=L(e,r.schema),{$from:s,$to:c}=r.selection,l=r.selection.node;if(l&&l.isBlock||s.depth<2||!s.sameParent(c))return!1;let u=s.node(-1);if(u.type!==o)return!1;let d=a.extensionManager.attributes;if(s.parent.content.size===0&&s.node(-1).childCount===s.indexAfter(-1)){if(s.depth===2||s.node(-3).type!==o||s.index(-2)!==s.node(-2).childCount-1)return!1;if(i){let e=k.empty,r=s.index(-1)?1:s.index(-2)?2:3;for(let t=s.depth-r;t>=s.depth-3;--t)e=k.from(s.node(t).copy(e));let i=s.indexAfter(-1)<s.node(-2).childCount?1:s.indexAfter(-2)<s.node(-3).childCount?2:3,a={...Ai(d,s.node().type.name,s.node().attrs),...t},c=o.contentMatch.defaultType?.createAndFill(a)||void 0;e=e.append(k.from(o.createAndFill(null,c)||void 0));let l=s.before(s.depth-(r-1));n.replace(l,s.after(-i),new M(e,4-r,0));let u=-1;n.doc.nodesBetween(l,n.doc.content.size,(e,t)=>{if(u>-1)return!1;e.isTextblock&&e.content.size===0&&(u=t+1)}),u>-1&&n.setSelection(N.near(n.doc.resolve(u))),n.scrollIntoView()}return!0}let f=c.pos===s.end()?u.contentMatchAt(0).defaultType:null,p={...Ai(d,u.type.name,u.attrs),...t},m={...Ai(d,s.node().type.name,s.node().attrs),...t};n.delete(s.pos,c.pos);let h=f?[{type:o,attrs:p},{type:f,attrs:m}]:[{type:o,attrs:p}];if(!Ae(n.doc,s.pos,2))return!1;if(i){let{selection:e,storedMarks:t}=r,{splittableMarks:o}=a.extensionManager,c=t||e.$to.parentOffset&&e.$from.marks();if(n.split(s.pos,2,h).scrollIntoView(),!c||!i)return!0;let l=c.filter(e=>o.includes(e.type.name));n.ensureMarks(l)}return!0},Gi=(e,t)=>{let n=mi(e=>e.type===t)(e.selection);if(!n)return!0;let r=e.doc.resolve(Math.max(0,n.pos-1)).before(n.depth);if(r===void 0)return!0;let i=e.doc.nodeAt(r);return n.node.type===i?.type&&Ce(e.doc,n.pos)&&e.join(n.pos),!0},Ki=(e,t)=>{let n=mi(e=>e.type===t)(e.selection);if(!n)return!0;let r=e.doc.resolve(n.start).after(n.depth);if(r===void 0)return!0;let i=e.doc.nodeAt(r);return n.node.type===i?.type&&Ce(e.doc,r)&&e.join(r),!0};function qi(e){let t=e.doc,n=t.firstChild;if(!n)return null;let r=t.resolve(1),i=t.resolve(n.nodeSize-1);return N.between(r,i)}var Ji=(e,t,n,r={})=>({editor:i,tr:a,state:o,dispatch:s,chain:c,commands:l,can:u})=>{let{extensions:d,splittableMarks:f}=i.extensionManager,p=L(e,o.schema),m=L(t,o.schema),{selection:h,storedMarks:g}=o,{$from:_,$to:ee}=h,v=_.blockRange(ee),y=g||h.$to.parentOffset&&h.$from.marks();if(!v)return!1;let b=mi(e=>Mi(e.type.name,d))(h),x=h.from===0&&h.to===o.doc.content.size,S=o.doc.content.content,C=S.length===1?S[0]:null,te=x&&C&&Mi(C.type.name,d)?{node:C,pos:0,depth:0}:null,ne=b??te,re=!!b&&v.depth>=1&&v.depth-b.depth<=1,ie=!!te;if((re||ie)&&ne){if(ne.node.type===p)return x&&ie?c().command(({tr:e,dispatch:t})=>{let n=qi(e);return n?(e.setSelection(n),t&&t(e),!0):!1}).liftListItem(m).run():l.liftListItem(m);if(Mi(ne.node.type.name,d)&&p.validContent(ne.node.content))return c().command(()=>(a.setNodeMarkup(ne.pos,p),!0)).command(()=>Gi(a,p)).command(()=>Ki(a,p)).run()}return!n||!y||!s?c().command(()=>u().wrapInList(p,r)?!0:l.clearNodes()).wrapInList(p,r).command(()=>Gi(a,p)).command(()=>Ki(a,p)).run():c().command(()=>{let e=u().wrapInList(p,r),t=y.filter(e=>f.includes(e.type.name));return a.ensureMarks(t),e?!0:l.clearNodes()}).wrapInList(p,r).command(()=>Gi(a,p)).command(()=>Ki(a,p)).run()},Yi=(e,t={},n={})=>({state:r,commands:i})=>{let{extendEmptyMarkRange:a=!1}=n,o=_r(e,r.schema);return ji(r,o,t)?i.unsetMark(o,{extendEmptyMarkRange:a}):i.setMark(o,t)},Xi=(e,t,n={})=>({state:r,commands:i})=>{let a=L(e,r.schema),o=L(t,r.schema),s=Kr(r,a,n),c;return r.selection.$anchor.sameParent(r.selection.$head)&&(c=r.selection.$anchor.parent.attrs),s?i.setNode(o,c):i.setNode(a,{...c,...n})},Zi=(e,t={})=>({state:n,commands:r})=>{let i=L(e,n.schema);return Kr(n,i,t)?r.lift(i):r.wrapIn(i,t)},Qi=()=>({state:e,dispatch:t})=>{let n=e.plugins;for(let r=0;r<n.length;r+=1){let i=n[r],a;if(i.spec.isInputRules&&(a=i.getState(e))){if(t){let t=e.tr,n=a.transform;for(let e=n.steps.length-1;e>=0;--e)t.step(n.steps[e].invert(n.docs[e]));if(a.text){let n=t.doc.resolve(a.from).marks();t.replaceWith(a.from,a.to,e.schema.text(a.text,n))}else t.delete(a.from,a.to)}return!0}}return!1},$i=()=>({tr:e,dispatch:t})=>{let{selection:n}=e,{empty:r,ranges:i}=n;return r||t&&i.forEach(t=>{e.removeMark(t.$from.pos,t.$to.pos)}),!0},ea=(e,t={})=>({tr:n,state:r,dispatch:i})=>{let{extendEmptyMarkRange:a=!1}=t,{selection:o}=n,s=_r(e,r.schema),{$from:c,empty:l,ranges:u}=o;if(!i)return!0;if(l&&a){let{from:e,to:t}=o,r=gr(c,s,c.marks().find(e=>e.type===s)?.attrs);r&&(e=r.from,t=r.to),n.removeMark(e,t,s)}else u.forEach(e=>{n.removeMark(e.$from.pos,e.$to.pos,s)});return n.removeStoredMark(s),!0},ta=e=>({tr:t,state:n,dispatch:r})=>{let{selection:i}=n,a,o;return typeof e==`number`?(a=e,o=e):e&&`from`in e&&`to`in e?(a=e.from,o=e.to):(a=i.from,o=i.to),r&&t.doc.nodesBetween(a,o,(e,n)=>{if(e.isText)return;let r={...e.attrs};delete r.dir,t.setNodeMarkup(n,void 0,r)}),!0},na=(e,t={})=>({tr:n,state:r,dispatch:i})=>{let a=null,o=null,s=Zr(typeof e==`string`?e:e.name,r.schema);if(!s)return!1;s===`node`&&(a=L(e,r.schema)),s===`mark`&&(o=_r(e,r.schema));let c=!1;return n.selection.ranges.forEach(e=>{let s=e.$from.pos,l=e.$to.pos,u,d,f,p;n.selection.empty?r.doc.nodesBetween(s,l,(e,t)=>{a&&a===e.type&&(c=!0,f=Math.max(t,s),p=Math.min(t+e.nodeSize,l),u=t,d=e)}):r.doc.nodesBetween(s,l,(e,r)=>{r<s&&a&&a===e.type&&(c=!0,f=Math.max(r,s),p=Math.min(r+e.nodeSize,l),u=r,d=e),r>=s&&r<=l&&(a&&a===e.type&&(c=!0,i&&n.setNodeMarkup(r,void 0,{...e.attrs,...t})),o&&e.marks.length&&e.marks.forEach(a=>{if(o===a.type&&(c=!0,i)){let i=Math.max(r,s),c=Math.min(r+e.nodeSize,l);n.addMark(i,c,o.create({...a.attrs,...t}))}}))}),d&&(u!==void 0&&i&&n.setNodeMarkup(u,void 0,{...d.attrs,...t}),o&&d.marks.length&&d.marks.forEach(e=>{o===e.type&&i&&n.addMark(f,p,o.create({...e.attrs,...t}))}))}),c},ra=(e,t={})=>({state:n,dispatch:r})=>{let i=L(e,n.schema);return Ne(i,t)(n,r)},ia=(e,t={})=>({state:n,dispatch:r})=>{let i=L(e,n.schema);return Pt(i,t)(n,r)};function aa(e){return Object.prototype.toString.call(e).slice(8,-1)}function oa(e){return aa(e)===`Object`&&e.constructor===Object&&Object.getPrototypeOf(e)===Object.prototype}function sa(e,t){let n={...e};return oa(e)&&oa(t)&&Object.keys(t).forEach(r=>{oa(t[r])&&oa(e[r])?n[r]=sa(e[r],t[r]):n[r]=t[r]}),n}var ca=class{constructor(e={}){this.type=`extendable`,this.parent=null,this.child=null,this.name=``,this.config={name:this.name},this.config={...this.config,...e},this.name=this.config.name}get options(){return{..._i(hi(this,`addOptions`,{name:this.name}))||{}}}get storage(){return{..._i(hi(this,`addStorage`,{name:this.name,options:this.options}))||{}}}configure(e={}){let t=this.extend({...this.config,addOptions:()=>sa(this.options,e)});return t.name=this.name,t.parent=this.parent,t}extend(e={}){let t=new this.constructor({...this.config,...e});return t.parent=this,this.child=t,t.name=`name`in e?e.name:t.parent.name,t}},la=class e extends ca{constructor(){super(...arguments),this.type=`mark`}static create(t={}){let n=typeof t==`function`?t():t;return new e(n)}static handleExit({editor:e,mark:t}){let{tr:n}=e.state,r=e.state.selection.$from;if(r.pos===r.end()){let i=r.marks();if(!i.find(e=>e?.type.name===t.name))return!1;let a=i.find(e=>e?.type.name===t.name);return a&&n.removeStoredMark(a),n.insertText(` `,r.pos),e.view.dispatch(n),!0}return!1}configure(e){return super.configure(e)}extend(e){let t=typeof e==`function`?e():e;return super.extend(t)}},ua=class{constructor(e){this.find=e.find,this.handler=e.handler}};Xn({},{ClipboardTextSerializer:()=>fa,Commands:()=>pa,Delete:()=>ma,Drop:()=>ha,Editable:()=>ga,FocusEvents:()=>va,Keymap:()=>ya,Paste:()=>ba,Tabindex:()=>xa,TextDirection:()=>Sa,focusEventsPluginKey:()=>_a});var da=class e extends ca{constructor(){super(...arguments),this.type=`extension`}static create(t={}){let n=typeof t==`function`?t():t;return new e(n)}configure(e){return super.configure(e)}extend(e){let t=typeof e==`function`?e():e;return super.extend(t)}},fa=da.create({name:`clipboardTextSerializer`,addOptions(){return{blockSeparator:void 0}},addProseMirrorPlugins(){return[new T({key:new E(`clipboardTextSerializer`),props:{clipboardTextSerializer:()=>{let{editor:e}=this,{state:t,schema:n}=e,{doc:r,selection:i}=t,{ranges:a}=i,o=Math.min(...a.map(e=>e.$from.pos)),s=Math.max(...a.map(e=>e.$to.pos)),c=Ci(n);return Si(r,{from:o,to:s},{...this.options.blockSeparator===void 0?{}:{blockSeparator:this.options.blockSeparator},textSerializers:c})}}})]}}),pa=da.create({name:`commands`,addCommands(){return{...$n}}}),ma=da.create({name:`delete`,onUpdate({transaction:e,appendedTransactions:t}){let n=()=>{var n;if(((n=this.editor.options.coreExtensionOptions?.delete)?.filterTransaction)?.call(n,e)??e.getMeta(`y-sync$`))return;let r=ui(e.before,[e,...t]);Oi(r).forEach(t=>{r.mapping.mapResult(t.oldRange.from).deletedAfter&&r.mapping.mapResult(t.oldRange.to).deletedBefore&&r.before.nodesBetween(t.oldRange.from,t.oldRange.to,(n,i)=>{let a=i+n.nodeSize-2,o=t.oldRange.from<=i&&a<=t.oldRange.to;this.editor.emit(`delete`,{type:`node`,node:n,from:i,to:a,newFrom:r.mapping.map(i),newTo:r.mapping.map(a),deletedRange:t.oldRange,newRange:t.newRange,partial:!o,editor:this.editor,transaction:e,combinedTransform:r})})});let i=r.mapping;r.steps.forEach((t,n)=>{if(t instanceof Ye){let a=i.slice(n).map(t.from,-1),o=i.slice(n).map(t.to),s=i.invert().map(a,-1),c=i.invert().map(o),l=a>0&&r.doc.nodeAt(a-1)?.marks.some(e=>e.eq(t.mark)),u=r.doc.nodeAt(o)?.marks.some(e=>e.eq(t.mark));this.editor.emit(`delete`,{type:`mark`,mark:t.mark,from:t.from,to:t.to,deletedRange:{from:s,to:c},newRange:{from:a,to:o},partial:!!(u||l),editor:this.editor,transaction:e,combinedTransform:r})}})};this.editor.options.coreExtensionOptions?.delete?.async??!0?setTimeout(n,0):n()}}),ha=da.create({name:`drop`,addProseMirrorPlugins(){return[new T({key:new E(`tiptapDrop`),props:{handleDrop:(e,t,n,r)=>{this.editor.emit(`drop`,{editor:this.editor,event:t,slice:n,moved:r})}}})]}}),ga=da.create({name:`editable`,addProseMirrorPlugins(){return[new T({key:new E(`editable`),props:{editable:()=>this.editor.options.editable}})]}}),_a=new E(`focusEvents`),va=da.create({name:`focusEvents`,addProseMirrorPlugins(){let{editor:e}=this;return[new T({key:_a,props:{handleDOMEvents:{focus:(t,n)=>{e.isFocused=!0;let r=e.state.tr.setMeta(`focus`,{event:n}).setMeta(`addToHistory`,!1);return t.dispatch(r),!1},blur:(t,n)=>{e.isFocused=!1;let r=e.state.tr.setMeta(`blur`,{event:n}).setMeta(`addToHistory`,!1);return t.dispatch(r),!1}}}})]}}),ya=da.create({name:`keymap`,addKeyboardShortcuts(){let e=()=>this.editor.commands.first(({commands:e})=>[()=>e.undoInputRule(),()=>e.command(({tr:t})=>{let{selection:n,doc:r}=t,{empty:i,$anchor:a}=n,{pos:o,parent:s}=a,c=a.parent.isTextblock&&o>0?t.doc.resolve(o-1):a,l=c.parent.type.spec.isolating,u=a.pos-a.parentOffset,d=l&&c.parent.childCount===1?u===a.pos:D.atStart(r).from===o;return!i||!s.type.isTextblock||s.textContent.length||!d||d&&a.parent.type.name===`paragraph`?!1:e.clearNodes()}),()=>e.deleteSelection(),()=>e.joinBackward(),()=>e.selectNodeBackward()]),t=()=>this.editor.commands.first(({commands:e})=>[()=>e.deleteSelection(),()=>e.deleteCurrentNode(),()=>e.joinForward(),()=>e.selectNodeForward()]),n={Enter:()=>this.editor.commands.first(({commands:e})=>[()=>e.newlineInCode(),()=>e.createParagraphNear(),()=>e.liftEmptyBlock(),()=>e.splitBlock()]),"Mod-Enter":()=>this.editor.commands.exitCode(),Backspace:e,"Mod-Backspace":e,"Shift-Backspace":e,Delete:t,"Mod-Delete":t,"Mod-a":()=>this.editor.commands.selectAll()},r={...n},i={...n,"Ctrl-h":e,"Alt-Backspace":e,"Ctrl-d":t,"Ctrl-Alt-Backspace":t,"Alt-Delete":t,"Alt-d":t,"Ctrl-a":()=>this.editor.commands.selectTextblockStart(),"Ctrl-e":()=>this.editor.commands.selectTextblockEnd()};return wr()||Ur()?i:r},addProseMirrorPlugins(){return[new T({key:new E(`clearDocument`),appendTransaction:(e,t,n)=>{if(e.some(e=>e.getMeta(`composition`)))return;let r=e.some(e=>e.docChanged)&&!t.doc.eq(n.doc),i=e.some(e=>e.getMeta(`preventClearDocument`));if(!r||i)return;let{empty:a,from:o,to:s}=t.selection,c=D.atStart(t.doc).from,l=D.atEnd(t.doc).to;if(a||o!==c||s!==l||!Ni(n.doc))return;let u=n.tr,d=Zn({state:n,transaction:u}),{commands:f}=new Qn({editor:this.editor,state:d});if(f.clearNodes(),u.steps.length)return u}})]}}),ba=da.create({name:`paste`,addProseMirrorPlugins(){return[new T({key:new E(`tiptapPaste`),props:{handlePaste:(e,t,n)=>{this.editor.emit(`paste`,{editor:this.editor,event:t,slice:n})}}})]}}),xa=da.create({name:`tabindex`,addProseMirrorPlugins(){return[new T({key:new E(`tabindex`),props:{attributes:()=>this.editor.isEditable?{tabindex:`0`}:{}}})]}}),Sa=da.create({name:`textDirection`,addOptions(){return{direction:void 0}},addGlobalAttributes(){if(!this.options.direction)return[];let{nodeExtensions:e}=vi(this.extensions);return[{types:e.filter(e=>e.name!==`text`).map(e=>e.name),attributes:{dir:{default:this.options.direction,parseHTML:e=>{let t=e.getAttribute(`dir`);return t&&(t===`ltr`||t===`rtl`||t===`auto`)?t:this.options.direction},renderHTML:e=>e.dir?{dir:e.dir}:{}}}}]},addProseMirrorPlugins(){return[new T({key:new E(`textDirection`),props:{attributes:()=>{let e=this.options.direction;return e?{dir:e}:{}}}})]}});Xn({},{createAtomBlockMarkdownSpec:()=>Ta,createBlockMarkdownSpec:()=>Ea,createInlineMarkdownSpec:()=>ka,parseAttributes:()=>Ca,parseIndentedBlocks:()=>Aa,renderNestedMarkdownContent:()=>ja,serializeAttributes:()=>wa});function Ca(e){if(!e?.trim())return{};let t={},n=[],r=e.replace(/["']([^"']*)["']/g,e=>(n.push(e),`__QUOTED_${n.length-1}__`)),i=r.match(/(?:^|\s)\.([a-zA-Z][\w-]*)/g);i&&(t.class=i.map(e=>e.trim().slice(1)).join(` `));let a=r.match(/(?:^|\s)#([a-zA-Z][\w-]*)/);a&&(t.id=a[1]),Array.from(r.matchAll(/([a-zA-Z][\w-]*)\s*=\s*(__QUOTED_\d+__)/g)).forEach(([,e,r])=>{let i=parseInt(r.match(/__QUOTED_(\d+)__/)?.[1]||`0`,10),a=n[i];a&&(t[e]=a.slice(1,-1))});let o=r.replace(/(?:^|\s)\.([a-zA-Z][\w-]*)/g,``).replace(/(?:^|\s)#([a-zA-Z][\w-]*)/g,``).replace(/([a-zA-Z][\w-]*)\s*=\s*__QUOTED_\d+__/g,``).trim();return o&&o.split(/\s+/).filter(Boolean).forEach(e=>{e.match(/^[a-zA-Z][\w-]*$/)&&(t[e]=!0)}),t}function wa(e){if(!e||Object.keys(e).length===0)return``;let t=[];return e.class&&String(e.class).split(/\s+/).filter(Boolean).forEach(e=>t.push(`.${e}`)),e.id&&t.push(`#${e.id}`),Object.entries(e).forEach(([e,n])=>{e!==`class`&&e!==`id`&&(n===!0?t.push(e):n!==!1&&n!=null&&t.push(`${e}="${String(n)}"`))}),t.join(` `)}function Ta(e){let{nodeName:t,name:n,parseAttributes:r=Ca,serializeAttributes:i=wa,defaultAttributes:a={},requiredAttributes:o=[],allowedAttributes:s}=e,c=n||t,l=e=>{if(!s)return e;let t={};return s.forEach(n=>{n in e&&(t[n]=e[n])}),t};return{parseMarkdown:(e,n)=>{let r={...a,...e.attributes};return n.createNode(t,r,[])},markdownTokenizer:{name:t,level:`block`,start(e){let t=RegExp(`^:::${c}(?:\\s|$)`,`m`),n=e.match(t)?.index;return n===void 0?-1:n},tokenize(e,n,i){let a=RegExp(`^:::${c}(?:\\s+\\{([^}]*)\\})?\\s*:::(?:\\n|$)`),s=e.match(a);if(!s)return;let l=s[1]||``,u=r(l);if(!o.find(e=>!(e in u)))return{type:t,raw:s[0],attributes:u}}},renderMarkdown:e=>{let t=l(e.attrs||{}),n=i(t),r=n?` {${n}}`:``;return`:::${c}${r} :::`}}}function Ea(e){let{nodeName:t,name:n,getContent:r,parseAttributes:i=Ca,serializeAttributes:a=wa,defaultAttributes:o={},content:s=`block`,allowedAttributes:c}=e,l=n||t,u=e=>{if(!c)return e;let t={};return c.forEach(n=>{n in e&&(t[n]=e[n])}),t};return{parseMarkdown:(e,n)=>{let i;if(r){let t=r(e);i=typeof t==`string`?[{type:`text`,text:t}]:t}else i=s===`block`?n.parseChildren(e.tokens||[]):n.parseInline(e.tokens||[]);let a={...o,...e.attributes};return n.createNode(t,a,i)},markdownTokenizer:{name:t,level:`block`,start(e){let t=RegExp(`^:::${l}`,`m`),n=e.match(t)?.index;return n===void 0?-1:n},tokenize(e,n,r){let a=RegExp(`^:::${l}(?:\\s+\\{([^}]*)\\})?\\s*\\n`),o=e.match(a);if(!o)return;let[c,u=``]=o,d=i(u),f=1,p=c.length,m=``,h=/^:::([\w-]*)(\s.*)?/gm,g=e.slice(p);for(h.lastIndex=0;;){let n=h.exec(g);if(n===null)break;let i=n.index,a=n[1];if(!n[2]?.endsWith(`:::`)){if(a)f+=1;else if(--f,f===0){let a=g.slice(0,i);m=a.trim();let o=e.slice(0,p+i+n[0].length),c=[];if(m){if(s===`block`)for(c=r.blockTokens(a),c.forEach(e=>{e.text&&(!e.tokens||e.tokens.length===0)&&(e.tokens=r.inlineTokens(e.text))});c.length>0;){let e=c[c.length-1];if(e.type===`paragraph`&&(!e.text||e.text.trim()===``))c.pop();else break}else c=r.inlineTokens(m)}return{type:t,raw:o,attributes:d,content:m,tokens:c}}}}}},renderMarkdown:(e,t)=>{let n=u(e.attrs||{}),r=a(n),i=r?` {${r}}`:``,o=t.renderChildren(e.content||[],`

`);return`:::${l}${i}

${o}

:::`}}}function Da(e){if(!e.trim())return{};let t={},n=/(\w+)=(?:"([^"]*)"|'([^']*)')/g,r=n.exec(e);for(;r!==null;){let[,i,a,o]=r;t[i]=a||o,r=n.exec(e)}return t}function Oa(e){return Object.entries(e).filter(([,e])=>e!=null).map(([e,t])=>`${e}="${t}"`).join(` `)}function ka(e){let{nodeName:t,name:n,getContent:r,parseAttributes:i=Da,serializeAttributes:a=Oa,defaultAttributes:o={},selfClosing:s=!1,allowedAttributes:c}=e,l=n||t,u=e=>{if(!c)return e;let t={};return c.forEach(n=>{let r=typeof n==`string`?n:n.name,i=typeof n==`string`?void 0:n.skipIfDefault;if(r in e){let n=e[r];if(i!==void 0&&n===i)return;t[r]=n}}),t},d=l.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`);return{parseMarkdown:(e,n)=>{let i={...o,...e.attributes};if(s)return n.createNode(t,i);let a=r?r(e):e.content||``;return a?n.createNode(t,i,[n.createTextNode(a)]):n.createNode(t,i,[])},markdownTokenizer:{name:t,level:`inline`,start(e){let t=RegExp(s?`\\[${d}\\s*[^\\]]*\\]`:`\\[${d}\\s*[^\\]]*\\][\\s\\S]*?\\[\\/${d}\\]`),n=e.match(t)?.index;return n===void 0?-1:n},tokenize(e,n,r){let a=RegExp(s?`^\\[${d}\\s*([^\\]]*)\\]`:`^\\[${d}\\s*([^\\]]*)\\]([\\s\\S]*?)\\[\\/${d}\\]`),o=e.match(a);if(!o)return;let c=``,l=``;if(s){let[,e]=o;l=e}else{let[,e,t]=o;l=e,c=t||``}let u=i(l.trim());return{type:t,raw:o[0],content:c.trim(),attributes:u}}},renderMarkdown:e=>{let t=``;r?t=r(e):e.content&&e.content.length>0&&(t=e.content.filter(e=>e.type===`text`).map(e=>e.text).join(``));let n=u(e.attrs||{}),i=a(n),o=i?` ${i}`:``;return s?`[${l}${o}]`:`[${l}${o}]${t}[/${l}]`}}}function Aa(e,t,n){let r=e.split(`
`),i=[],a=``,o=0,s=t.baseIndentSize||2;for(;o<r.length;){let e=r[o],c=e.match(t.itemPattern);if(!c){if(i.length>0)break;if(e.trim()===``){o+=1,a=`${a}${e}
`;continue}return}let l=t.extractItemData(c),{indentLevel:u,mainContent:d}=l;a=`${a}${e}
`;let f=[d];for(o+=1;o<r.length;){let e=r[o];if(e.trim()===``){let t=r.slice(o+1).findIndex(e=>e.trim()!==``);if(t===-1)break;if((r[o+1+t].match(/^(\s*)/)?.[1]?.length||0)>u){f.push(e),a=`${a}${e}
`,o+=1;continue}break}if((e.match(/^(\s*)/)?.[1]?.length||0)>u)f.push(e),a=`${a}${e}
`,o+=1;else break}let p,m=f.slice(1);if(m.length>0){let e=m.map(e=>e.slice(u+s)).join(`
`);e.trim()&&(p=t.customNestedParser?t.customNestedParser(e):n.blockTokens(e))}let h=t.createToken(l,p);i.push(h)}if(i.length!==0)return{items:i,raw:a}}function ja(e,t,n,r){if(!e||!Array.isArray(e.content))return``;let i=typeof n==`function`?n(r):n,[a,...o]=e.content,s=`${i}${t.renderChildren([a])}`;return o&&o.length>0&&o.forEach((e,n)=>{let r=t.renderChild?.call(t,e,n+1)??t.renderChildren([e]);if(r!=null){let n=r.split(`
`).map(e=>e?t.indent(e):t.indent(``)).join(`
`);s+=e.type===`paragraph`?`

${n}`:`
${n}`}}),s}function Ma(e){return new ua({find:e.find,handler:({state:t,range:n,match:r,pasteEvent:i})=>{let a=_i(e.getAttributes,void 0,r,i);if(a===!1||a===null)return null;let{tr:o}=t,s=r[r.length-1],c=r[0],l=n.to;if(s){let i=c.search(/\S/),u=n.from+c.indexOf(s),d=u+s.length;if(ki(n.from,n.to,t.doc).filter(t=>t.mark.type.excluded.find(n=>n===e.type&&n!==t.mark.type)).filter(e=>e.to>u).length)return null;d<n.to&&o.delete(d,n.to),u>n.from&&o.delete(n.from+i,u),l=n.from+i+s.length,o.addMark(n.from+i,l,e.type.create(a||{})),r.index!==void 0&&r.input!==void 0&&r.index+r[0].length>=r.input.length||o.removeStoredMark(e.type)}}})}var Na=`aaa1rp3bb0ott3vie4c1le2ogado5udhabi7c0ademy5centure6ountant0s9o1tor4d0s1ult4e0g1ro2tna4f0l1rica5g0akhan5ency5i0g1rbus3force5tel5kdn3l0ibaba4pay4lfinanz6state5y2sace3tom5m0azon4ericanexpress7family11x2fam3ica3sterdam8nalytics7droid5quan4z2o0l2partments8p0le4q0uarelle8r0ab1mco4chi3my2pa2t0e3s0da2ia2sociates9t0hleta5torney7u0ction5di0ble3o3spost5thor3o0s4w0s2x0a2z0ure5ba0by2idu3namex4d1k2r0celona5laycard4s5efoot5gains6seball5ketball8uhaus5yern5b0c1t1va3cg1n2d1e0ats2uty4er2rlin4st0buy5t2f1g1h0arti5i0ble3d1ke2ng0o3o1z2j1lack0friday9ockbuster8g1omberg7ue3m0s1w2n0pparibas9o0ats3ehringer8fa2m1nd2o0k0ing5sch2tik2on4t1utique6x2r0adesco6idgestone9oadway5ker3ther5ussels7s1t1uild0ers6siness6y1zz3v1w1y1z0h3ca0b1fe2l0l1vinklein9m0era3p2non3petown5ital0one8r0avan4ds2e0er0s4s2sa1e1h1ino4t0ering5holic7ba1n1re3c1d1enter4o1rn3f0a1d2g1h0anel2nel4rity4se2t2eap3intai5ristmas6ome4urch5i0priani6rcle4sco3tadel4i0c2y3k1l0aims4eaning6ick2nic1que6othing5ud3ub0med6m1n1o0ach3des3ffee4llege4ogne5m0mbank4unity6pany2re3uter5sec4ndos3struction8ulting7tact3ractors9oking4l1p2rsica5untry4pon0s4rses6pa2r0edit0card4union9icket5own3s1uise0s6u0isinella9v1w1x1y0mru3ou3z2dad1nce3ta1e1ing3sun4y2clk3ds2e0al0er2s3gree4livery5l1oitte5ta3mocrat6ntal2ist5si0gn4v2hl2iamonds6et2gital5rect0ory7scount3ver5h2y2j1k1m1np2o0cs1tor4g1mains5t1wnload7rive4tv2ubai3pont4rban5vag2r2z2earth3t2c0o2deka3u0cation8e1g1mail3erck5nergy4gineer0ing9terprises10pson4quipment8r0icsson6ni3s0q1tate5t1u0rovision8s2vents5xchange6pert3osed4ress5traspace10fage2il1rwinds6th3mily4n0s2rm0ers5shion4t3edex3edback6rrari3ero6i0delity5o2lm2nal1nce1ial7re0stone6mdale6sh0ing5t0ness6j1k1lickr3ghts4r2orist4wers5y2m1o0o0d1tball6rd1ex2sale4um3undation8x2r0ee1senius7l1ogans4ntier7tr2ujitsu5n0d2rniture7tbol5yi3ga0l0lery3o1up4me0s3p1rden4y2b0iz3d0n2e0a1nt0ing5orge5f1g0ee3h1i0ft0s3ves2ing5l0ass3e1obal2o4m0ail3bh2o1x2n1odaddy5ld0point6f2odyear5g0le4p1t1v2p1q1r0ainger5phics5tis4een3ipe3ocery4up4s1t1u0cci3ge2ide2tars5ru3w1y2hair2mburg5ngout5us3bo2dfc0bank7ealth0care8lp1sinki6re1mes5iphop4samitsu7tachi5v2k0t2m1n1ockey4ldings5iday5medepot5goods5s0ense7nda3rse3spital5t0ing5t0els3mail5use3w2r1sbc3t1u0ghes5yatt3undai7ibm2cbc2e1u2d1e0ee3fm2kano4l1m0amat4db2mo0bilien9n0c1dustries8finiti5o2g1k1stitute6urance4e4t0ernational10uit4vestments10o1piranga7q1r0ish4s0maili5t0anbul7t0au2v3jaguar4va3cb2e0ep2tzt3welry6io2ll2m0p2nj2o0bs1urg4t1y2p0morgan6rs3uegos4niper7kaufen5ddi3e0rryhotels6properties14fh2g1h1i0a1ds2m1ndle4tchen5wi3m1n1oeln3matsu5sher5p0mg2n2r0d1ed3uokgroup8w1y0oto4z2la0caixa5mborghini8er3nd0rover6xess5salle5t0ino3robe5w0yer5b1c1ds2ease3clerc5frak4gal2o2xus4gbt3i0dl2fe0insurance9style7ghting6ke2lly3mited4o2ncoln4k2ve1ing5k1lc1p2oan0s3cker3us3l1ndon4tte1o3ve3pl0financial11r1s1t0d0a3u0ndbeck6xe1ury5v1y2ma0drid4if1son4keup4n0agement7go3p1rket0ing3s4riott5shalls7ttel5ba2c0kinsey7d1e0d0ia3et2lbourne7me1orial6n0u2rck0msd7g1h1iami3crosoft7l1ni1t2t0subishi9k1l0b1s2m0a2n1o0bi0le4da2e1i1m1nash3ey2ster5rmon3tgage6scow4to0rcycles9v0ie4p1q1r1s0d2t0n1r2u0seum3ic4v1w1x1y1z2na0b1goya4me2vy3ba2c1e0c1t0bank4flix4work5ustar5w0s2xt0direct7us4f0l2g0o2hk2i0co2ke1on3nja3ssan1y5l1o0kia3rton4w0ruz3tv4p1r0a1w2tt2u1yc2z2obi1server7ffice5kinawa6layan0group9lo3m0ega4ne1g1l0ine5oo2pen3racle3nge4g0anic5igins6saka4tsuka4t2vh3pa0ge2nasonic7ris2s1tners4s1y3y2ccw3e0t2f0izer5g1h0armacy6d1ilips5one2to0graphy6s4ysio5ics1tet2ures6d1n0g1k2oneer5zza4k1l0ace2y0station9umbing5s3m1n0c2ohl2ker3litie5rn2st3r0axi3ess3ime3o0d0uctions8f1gressive8mo2perties3y5tection8u0dential9s1t1ub2w0c2y2qa1pon3uebec3st5racing4dio4e0ad1lestate6tor2y4cipes5d0umbrella9hab3ise0n3t2liance6n0t0als5pair3ort3ublican8st0aurant8view0s5xroth6ich0ardli6oh3l1o1p2o0cks3deo3gers4om3s0vp3u0gby3hr2n2w0e2yukyu6sa0arland6fe0ty4kura4le1on3msclub4ung5ndvik0coromant12ofi4p1rl2s1ve2xo3b0i1s2c0b1haeffler7midt4olarships8ol3ule3warz5ience5ot3d1e0arch3t2cure1ity6ek2lect4ner3rvices6ven3w1x0y3fr2g1h0angrila6rp3ell3ia1ksha5oes2p0ping5uji3w3i0lk2na1gles5te3j1k0i0n2y0pe4l0ing4m0art3ile4n0cf3o0ccer3ial4ftbank4ware6hu2lar2utions7ng1y2y2pa0ce3ort2t3r0l2s1t0ada2ples4r1tebank4farm7c0group6ockholm6rage3e3ream4udio2y3yle4u0cks3pplies3y2ort5rf1gery5zuki5v1watch4iss4x1y0dney4stems6z2tab1ipei4lk2obao4rget4tamotors6r2too4x0i3c0i2d0k2eam2ch0nology8l1masek5nnis4va3f1g1h0d1eater2re6iaa2ckets5enda4ps2res2ol4j0maxx4x2k0maxx5l1m0all4n1o0day3kyo3ols3p1ray3shiba5tal3urs3wn2yota3s3r0ade1ing4ining5vel0ers0insurance16ust3v2t1ube2i1nes3shu4v0s2w1z2ua1bank3s2g1k1nicom3versity8o2ol2ps2s1y1z2va0cations7na1guard7c1e0gas3ntures6risign5mögensberater2ung14sicherung10t2g1i0ajes4deo3g1king4llas4n1p1rgin4sa1ion4va1o3laanderen9n1odka3lvo3te1ing3o2yage5u2wales2mart4ter4ng0gou5tch0es6eather0channel12bcam3er2site5d0ding5ibo2r3f1hoswho6ien2ki2lliamhill9n0dows4e1ners6me2oodside6rk0s2ld3w2s1tc1f3xbox3erox4ihuan4n2xx2yz3yachts4hoo3maxun5ndex5e1odobashi7ga2kohama6u0tube6t1un3za0ppos4ra3ero3ip2m1one3uerich6w2`,Pa=`ελ1υ2бг1ел3дети4ею2католик6ом3мкд2он1сква6онлайн5рг3рус2ф2сайт3рб3укр3қаз3հայ3ישראל5קום3ابوظبي5رامكو5لاردن4بحرين5جزائر5سعودية6عليان5مغرب5مارات5یران5بارت2زار4يتك3ھارت5تونس4سودان3رية5شبكة4عراق2ب2مان4فلسطين6قطر3كاثوليك6وم3مصر2ليسيا5وريتانيا7قع4همراه5پاکستان7ڀارت4कॉम3नेट3भारत0म्3ोत5संगठन5বাংলা5ভারত2ৰত4ਭਾਰਤ4ભારત4ଭାରତ4இந்தியா6லங்கை6சிங்கப்பூர்11భారత్5ಭಾರತ4ഭാരതം5ලංකා4คอม3ไทย3ລາວ3გე2みんな3アマゾン4クラウド4グーグル4コム2ストア3セール3ファッション6ポイント4世界2中信1国1國1文网3亚马逊3企业2佛山2信息2健康2八卦2公司1益2台湾1灣2商城1店1标2嘉里0大酒店5在线2大拿2天主教3娱乐2家電2广东2微博2慈善2我爱你3手机2招聘2政务1府2新加坡2闻2时尚2書籍2机构2淡马锡3游戏2澳門2点看2移动2组织机构4网址1店1站1络2联通2谷歌2购物2通販2集团2電訊盈科4飞利浦3食品2餐厅2香格里拉3港2닷넷1컴2삼성2한국2`,Fa=`numeric`,Ia=`ascii`,La=`alpha`,Ra=`asciinumeric`,za=`alphanumeric`,Ba=`domain`,Va=`emoji`,Ha=`scheme`,Ua=`slashscheme`,Wa=`whitespace`;function Ga(e,t){return e in t||(t[e]=[]),t[e]}function Ka(e,t,n){t[Fa]&&(t[Ra]=!0,t[za]=!0),t[Ia]&&(t[Ra]=!0,t[La]=!0),t[Ra]&&(t[za]=!0),t[La]&&(t[za]=!0),t[za]&&(t[Ba]=!0),t[Va]&&(t[Ba]=!0);for(let r in t){let t=Ga(r,n);t.indexOf(e)<0&&t.push(e)}}function qa(e,t){let n={};for(let r in t)t[r].indexOf(e)>=0&&(n[r]=!0);return n}function R(e=null){this.j={},this.jr=[],this.jd=null,this.t=e}R.groups={},R.prototype={accepts(){return!!this.t},go(e){let t=this,n=t.j[e];if(n)return n;for(let n=0;n<t.jr.length;n++){let r=t.jr[n][0],i=t.jr[n][1];if(i&&r.test(e))return i}return t.jd},has(e,t=!1){return t?e in this.j:!!this.go(e)},ta(e,t,n,r){for(let i=0;i<e.length;i++)this.tt(e[i],t,n,r)},tr(e,t,n,r){r||=R.groups;let i;return t&&t.j?i=t:(i=new R(t),n&&r&&Ka(t,n,r)),this.jr.push([e,i]),i},ts(e,t,n,r){let i=this,a=e.length;if(!a)return i;for(let t=0;t<a-1;t++)i=i.tt(e[t]);return i.tt(e[a-1],t,n,r)},tt(e,t,n,r){r||=R.groups;let i=this;if(t&&t.j)return i.j[e]=t,t;let a=t,o,s=i.go(e);return s?(o=new R,Object.assign(o.j,s.j),o.jr.push.apply(o.jr,s.jr),o.jd=s.jd,o.t=s.t):o=new R,a&&(r&&(o.t&&typeof o.t==`string`?Ka(a,Object.assign(qa(o.t,r),n),r):n&&Ka(a,n,r)),o.t=a),i.j[e]=o,o}};var z=(e,t,n,r,i)=>e.ta(t,n,r,i),B=(e,t,n,r,i)=>e.tr(t,n,r,i),Ja=(e,t,n,r,i)=>e.ts(t,n,r,i),V=(e,t,n,r,i)=>e.tt(t,n,r,i),Ya=`WORD`,Xa=`UWORD`,Za=`ASCIINUMERICAL`,Qa=`ALPHANUMERICAL`,$a=`LOCALHOST`,eo=`TLD`,to=`UTLD`,no=`SCHEME`,ro=`SLASH_SCHEME`,io=`NUM`,ao=`WS`,oo=`NL`,so=`OPENBRACE`,co=`CLOSEBRACE`,lo=`OPENBRACKET`,uo=`CLOSEBRACKET`,fo=`OPENPAREN`,po=`CLOSEPAREN`,mo=`OPENANGLEBRACKET`,ho=`CLOSEANGLEBRACKET`,go=`FULLWIDTHLEFTPAREN`,_o=`FULLWIDTHRIGHTPAREN`,vo=`LEFTCORNERBRACKET`,yo=`RIGHTCORNERBRACKET`,bo=`LEFTWHITECORNERBRACKET`,xo=`RIGHTWHITECORNERBRACKET`,So=`FULLWIDTHLESSTHAN`,Co=`FULLWIDTHGREATERTHAN`,wo=`AMPERSAND`,To=`APOSTROPHE`,Eo=`ASTERISK`,Do=`AT`,Oo=`BACKSLASH`,ko=`BACKTICK`,Ao=`CARET`,jo=`COLON`,Mo=`COMMA`,No=`DOLLAR`,Po=`DOT`,Fo=`EQUALS`,Io=`EXCLAMATION`,Lo=`HYPHEN`,Ro=`PERCENT`,zo=`PIPE`,Bo=`PLUS`,Vo=`POUND`,Ho=`QUERY`,Uo=`QUOTE`,Wo=`FULLWIDTHMIDDLEDOT`,Go=`SEMI`,Ko=`SLASH`,qo=`TILDE`,Jo=`UNDERSCORE`,Yo=`EMOJI`,Xo=`SYM`,Zo=Object.freeze({__proto__:null,ALPHANUMERICAL:Qa,AMPERSAND:wo,APOSTROPHE:To,ASCIINUMERICAL:Za,ASTERISK:Eo,AT:Do,BACKSLASH:Oo,BACKTICK:ko,CARET:Ao,CLOSEANGLEBRACKET:ho,CLOSEBRACE:co,CLOSEBRACKET:uo,CLOSEPAREN:po,COLON:jo,COMMA:Mo,DOLLAR:No,DOT:Po,EMOJI:Yo,EQUALS:Fo,EXCLAMATION:Io,FULLWIDTHGREATERTHAN:Co,FULLWIDTHLEFTPAREN:go,FULLWIDTHLESSTHAN:So,FULLWIDTHMIDDLEDOT:Wo,FULLWIDTHRIGHTPAREN:_o,HYPHEN:Lo,LEFTCORNERBRACKET:vo,LEFTWHITECORNERBRACKET:bo,LOCALHOST:$a,NL:oo,NUM:io,OPENANGLEBRACKET:mo,OPENBRACE:so,OPENBRACKET:lo,OPENPAREN:fo,PERCENT:Ro,PIPE:zo,PLUS:Bo,POUND:Vo,QUERY:Ho,QUOTE:Uo,RIGHTCORNERBRACKET:yo,RIGHTWHITECORNERBRACKET:xo,SCHEME:no,SEMI:Go,SLASH:Ko,SLASH_SCHEME:ro,SYM:Xo,TILDE:qo,TLD:eo,UNDERSCORE:Jo,UTLD:to,UWORD:Xa,WORD:Ya,WS:ao}),Qo=/[a-z]/,$o=/\p{L}/u,es=/\p{Emoji}/u,ts=/\d/,ns=/\s/,rs=`\r`,is=`
`,as=`️`,os=`‍`,ss=`￼`,cs=null,ls=null;function us(e=[]){let t={};R.groups=t;let n=new R;cs??=ms(Na),ls??=ms(Pa),V(n,`'`,To),V(n,`{`,so),V(n,`}`,co),V(n,`[`,lo),V(n,`]`,uo),V(n,`(`,fo),V(n,`)`,po),V(n,`<`,mo),V(n,`>`,ho),V(n,`（`,go),V(n,`）`,_o),V(n,`「`,vo),V(n,`」`,yo),V(n,`『`,bo),V(n,`』`,xo),V(n,`＜`,So),V(n,`＞`,Co),V(n,`&`,wo),V(n,`*`,Eo),V(n,`@`,Do),V(n,"`",ko),V(n,`^`,Ao),V(n,`:`,jo),V(n,`,`,Mo),V(n,`$`,No),V(n,`.`,Po),V(n,`=`,Fo),V(n,`!`,Io),V(n,`-`,Lo),V(n,`%`,Ro),V(n,`|`,zo),V(n,`+`,Bo),V(n,`#`,Vo),V(n,`?`,Ho),V(n,`"`,Uo),V(n,`/`,Ko),V(n,`;`,Go),V(n,`~`,qo),V(n,`_`,Jo),V(n,`\\`,Oo),V(n,`・`,Wo);let r=B(n,ts,io,{[Fa]:!0});B(r,ts,r);let i=B(r,Qo,Za,{[Ra]:!0}),a=B(r,$o,Qa,{[za]:!0}),o=B(n,Qo,Ya,{[Ia]:!0});B(o,ts,i),B(o,Qo,o),B(i,ts,i),B(i,Qo,i);let s=B(n,$o,Xa,{[La]:!0});B(s,Qo),B(s,ts,a),B(s,$o,s),B(a,ts,a),B(a,Qo),B(a,$o,a);let c=V(n,is,oo,{[Wa]:!0}),l=V(n,rs,ao,{[Wa]:!0}),u=B(n,ns,ao,{[Wa]:!0});V(n,ss,u),V(l,is,c),V(l,ss,u),B(l,ns,u),V(u,rs),V(u,is),B(u,ns,u),V(u,ss,u);let d=B(n,es,Yo,{[Va]:!0});V(d,`#`),B(d,es,d),V(d,as,d);let f=V(d,os);V(f,`#`),B(f,es,d);let p=[[Qo,o],[ts,i]],m=[[Qo,null],[$o,s],[ts,a]];for(let e=0;e<cs.length;e++)ps(n,cs[e],eo,Ya,p);for(let e=0;e<ls.length;e++)ps(n,ls[e],to,Xa,m);Ka(eo,{tld:!0,ascii:!0},t),Ka(to,{utld:!0,alpha:!0},t),ps(n,`file`,no,Ya,p),ps(n,`mailto`,no,Ya,p),ps(n,`http`,ro,Ya,p),ps(n,`https`,ro,Ya,p),ps(n,`ftp`,ro,Ya,p),ps(n,`ftps`,ro,Ya,p),Ka(no,{scheme:!0,ascii:!0},t),Ka(ro,{slashscheme:!0,ascii:!0},t),e=e.sort((e,t)=>e[0]>t[0]?1:-1);for(let t=0;t<e.length;t++){let r=e[t][0],i=e[t][1]?{[Ha]:!0}:{[Ua]:!0};r.indexOf(`-`)>=0?i[Ba]=!0:Qo.test(r)?ts.test(r)?i[Ra]=!0:i[Ia]=!0:i[Fa]=!0,Ja(n,r,r,i)}return Ja(n,`localhost`,$a,{ascii:!0}),n.jd=new R(Xo),{start:n,tokens:Object.assign({groups:t},Zo)}}function ds(e,t){let n=fs(t.replace(/[A-Z]/g,e=>e.toLowerCase())),r=n.length,i=[],a=0,o=0;for(;o<r;){let s=e,c=null,l=0,u=null,d=-1,f=-1;for(;o<r&&(c=s.go(n[o]));)s=c,s.accepts()?(d=0,f=0,u=s):d>=0&&(d+=n[o].length,f++),l+=n[o].length,a+=n[o].length,o++;a-=d,o-=f,l-=d,i.push({t:u.t,v:t.slice(a-l,a),s:a-l,e:a})}return i}function fs(e){let t=[],n=e.length,r=0;for(;r<n;){let i=e.charCodeAt(r),a,o=i<55296||i>56319||r+1===n||(a=e.charCodeAt(r+1))<56320||a>57343?e[r]:e.slice(r,r+2);t.push(o),r+=o.length}return t}function ps(e,t,n,r,i){let a,o=t.length;for(let n=0;n<o-1;n++){let o=t[n];e.j[o]?a=e.j[o]:(a=new R(r),a.jr=i.slice(),e.j[o]=a),e=a}return a=new R(n),a.jr=i.slice(),e.j[t[o-1]]=a,a}function ms(e){let t=[],n=[],r=0;for(;r<e.length;){let i=0;for(;`0123456789`.indexOf(e[r+i])>=0;)i++;if(i>0){t.push(n.join(``));for(let t=parseInt(e.substring(r,r+i),10);t>0;t--)n.pop();r+=i}else n.push(e[r]),r++}return t}var hs={defaultProtocol:`http`,events:null,format:_s,formatHref:_s,nl2br:!1,tagName:`a`,target:null,rel:null,validate:!0,truncate:1/0,className:null,attributes:null,ignoreTags:[],render:null};function gs(e,t=null){let n=Object.assign({},hs);e&&(n=Object.assign(n,e instanceof gs?e.o:e));let r=n.ignoreTags,i=[];for(let e=0;e<r.length;e++)i.push(r[e].toUpperCase());this.o=n,t&&(this.defaultRender=t),this.ignoreTags=i}gs.prototype={o:hs,ignoreTags:[],defaultRender(e){return e},check(e){return this.get(`validate`,e.toString(),e)},get(e,t,n){let r=t!=null,i=this.o[e];return i&&(typeof i==`object`?(i=n.t in i?i[n.t]:hs[e],typeof i==`function`&&r&&(i=i(t,n))):typeof i==`function`&&r&&(i=i(t,n.t,n)),i)},getObj(e,t,n){let r=this.o[e];return typeof r==`function`&&t!=null&&(r=r(t,n.t,n)),r},render(e){let t=e.render(this);return(this.get(`render`,null,e)||this.defaultRender)(t,e.t,e)}};function _s(e){return e}function vs(e,t){this.t=`token`,this.v=e,this.tk=t}vs.prototype={isLink:!1,toString(){return this.v},toHref(e){return this.toString()},toFormattedString(e){let t=this.toString(),n=e.get(`truncate`,t,this),r=e.get(`format`,t,this);return n&&r.length>n?r.substring(0,n)+`…`:r},toFormattedHref(e){return e.get(`formatHref`,this.toHref(e.get(`defaultProtocol`)),this)},startIndex(){return this.tk[0].s},endIndex(){return this.tk[this.tk.length-1].e},toObject(e=hs.defaultProtocol){return{type:this.t,value:this.toString(),isLink:this.isLink,href:this.toHref(e),start:this.startIndex(),end:this.endIndex()}},toFormattedObject(e){return{type:this.t,value:this.toFormattedString(e),isLink:this.isLink,href:this.toFormattedHref(e),start:this.startIndex(),end:this.endIndex()}},validate(e){return e.get(`validate`,this.toString(),this)},render(e){let t=this,n=this.toHref(e.get(`defaultProtocol`)),r=e.get(`formatHref`,n,this),i=e.get(`tagName`,n,t),a=this.toFormattedString(e),o={},s=e.get(`className`,n,t),c=e.get(`target`,n,t),l=e.get(`rel`,n,t),u=e.getObj(`attributes`,n,t),d=e.getObj(`events`,n,t);return o.href=r,s&&(o.class=s),c&&(o.target=c),l&&(o.rel=l),u&&Object.assign(o,u),{tagName:i,attributes:o,content:a,eventListeners:d}}};function ys(e,t){class n extends vs{constructor(t,n){super(t,n),this.t=e}}for(let e in t)n.prototype[e]=t[e];return n.t=e,n}var bs=ys(`email`,{isLink:!0,toHref(){return`mailto:`+this.toString()}}),xs=ys(`text`),Ss=ys(`nl`),Cs=ys(`url`,{isLink:!0,toHref(e=hs.defaultProtocol){return this.hasProtocol()?this.v:`${e}://${this.v}`},hasProtocol(){let e=this.tk;return e.length>=2&&e[0].t!==$a&&e[1].t===jo}}),ws=e=>new R(e);function Ts({groups:e}){let t=e.domain.concat([wo,Eo,Do,Oo,ko,Ao,No,Fo,Lo,io,Ro,zo,Bo,Vo,Ko,Xo,qo,Jo]),n=[To,jo,Mo,Po,Io,Ro,Ho,Uo,Go,mo,ho,so,co,uo,lo,fo,po,go,_o,vo,yo,bo,xo,So,Co],r=[wo,To,Eo,Oo,ko,Ao,No,Fo,Lo,so,co,Ro,zo,Bo,Vo,Ho,Ko,Xo,qo,Jo],i=ws(),a=V(i,qo);z(a,r,a),z(a,e.domain,a);let o=ws(),s=ws(),c=ws();z(i,e.domain,o),z(i,e.scheme,s),z(i,e.slashscheme,c),z(o,r,a),z(o,e.domain,o);let l=V(o,Do);V(a,Do,l),V(s,Do,l),V(c,Do,l);let u=V(a,Po);z(u,r,a),z(u,e.domain,a);let d=ws();z(l,e.domain,d),z(d,e.domain,d);let f=V(d,Po);z(f,e.domain,d);let p=ws(bs);z(f,e.tld,p),z(f,e.utld,p),V(l,$a,p);let m=V(d,Lo);V(m,Lo,m),z(m,e.domain,d),z(p,e.domain,d),V(p,Po,f),V(p,Lo,m);let h=V(o,Lo),g=V(o,Po);V(h,Lo,h),z(h,e.domain,o),z(g,r,a),z(g,e.domain,o);let _=ws(Cs);z(g,e.tld,_),z(g,e.utld,_),z(_,e.domain,o),z(_,r,a),V(_,Po,g),V(_,Lo,h),V(_,Do,l);let ee=V(_,jo),v=ws(Cs);z(ee,e.numeric,v);let y=ws(Cs),b=ws();z(y,t,y),z(y,n,b),z(b,t,y),z(b,n,b),V(_,Ko,y),V(v,Ko,y);let x=V(s,jo),S=V(V(V(c,jo),Ko),Ko);z(s,e.domain,o),V(s,Po,g),V(s,Lo,h),z(c,e.domain,o),V(c,Po,g),V(c,Lo,h),z(x,e.domain,y),V(x,Ko,y),V(x,Ho,y),z(S,e.domain,y),z(S,t,y),V(S,Ko,y);let C=[[so,co],[lo,uo],[fo,po],[mo,ho],[go,_o],[vo,yo],[bo,xo],[So,Co]];for(let e=0;e<C.length;e++){let[r,i]=C[e],a=V(y,r);V(b,r,a);let o=ws(Cs);z(a,t,o);let s=ws();z(a,n,s),V(a,i,y),z(o,t,o),z(o,n,s),z(s,t,o),z(s,n,s),V(o,i,y),V(s,i,y)}return V(i,$a,_),V(i,oo,Ss),{start:i,tokens:Zo}}function Es(e,t,n){let r=n.length,i=0,a=[],o=[];for(;i<r;){let s=e,c=null,l=null,u=0,d=null,f=-1;for(;i<r&&!(c=s.go(n[i].t));)o.push(n[i++]);for(;i<r&&(l=c||s.go(n[i].t));)c=null,s=l,s.accepts()?(f=0,d=s):f>=0&&f++,i++,u++;if(f<0)i-=u,i<r&&(o.push(n[i]),i++);else{o.length>0&&(a.push(Ds(xs,t,o)),o=[]),i-=f,u-=f;let e=d.t,r=n.slice(i-u,i);a.push(Ds(e,t,r))}}return o.length>0&&a.push(Ds(xs,t,o)),a}function Ds(e,t,n){let r=n[0].s,i=n[n.length-1].e;return new e(t.slice(r,i),n)}var Os=typeof console<`u`&&console&&console.warn||(()=>{}),ks=`until manual call of linkify.init(). Register all schemes and plugins before invoking linkify the first time.`,H={scanner:null,parser:null,tokenQueue:[],pluginQueue:[],customSchemes:[],initialized:!1};function As(){return R.groups={},H.scanner=null,H.parser=null,H.tokenQueue=[],H.pluginQueue=[],H.customSchemes=[],H.initialized=!1,H}function js(e,t=!1){if(H.initialized&&Os(`linkifyjs: already initialized - will not register custom scheme "${e}" ${ks}`),!/^[0-9a-z]+(-[0-9a-z]+)*$/.test(e))throw Error(`linkifyjs: incorrect scheme format.
1. Must only contain digits, lowercase ASCII letters or "-"
2. Cannot start or end with "-"
3. "-" cannot repeat`);H.customSchemes.push([e,t])}function Ms(){H.scanner=us(H.customSchemes);for(let e=0;e<H.tokenQueue.length;e++)H.tokenQueue[e][1]({scanner:H.scanner});H.parser=Ts(H.scanner.tokens);for(let e=0;e<H.pluginQueue.length;e++)H.pluginQueue[e][1]({scanner:H.scanner,parser:H.parser});return H.initialized=!0,H}function Ns(e){return H.initialized||Ms(),Es(H.parser.start,e,ds(H.scanner.start,e))}Ns.scan=ds;function Ps(e,t=null,n=null){if(t&&typeof t==`object`){if(n)throw Error(`linkifyjs: Invalid link type ${t}; must be a string`);n=t,t=null}let r=new gs(n),i=Ns(e),a=[];for(let e=0;e<i.length;e++){let n=i[e];n.isLink&&(!t||n.t===t)&&r.check(n)&&a.push(n.toFormattedObject(r))}return a}var Fs=`[\0- \xA0 ᠎ -\u2029 　]`,Is=new RegExp(Fs),Ls=RegExp(`${Fs}$`),Rs=new RegExp(Fs,`g`);function zs(e){return e.length===1?e[0].isLink:e.length===3&&e[1].isLink?[`()`,`[]`].includes(e[0].value+e[2].value):!1}function Bs(e){return new T({key:new E(`autolink`),appendTransaction:(t,n,r)=>{let i=t.some(e=>e.docChanged)&&!n.doc.eq(r.doc),a=t.some(e=>e.getMeta(`preventAutolink`));if(!i||a)return;let{tr:o}=r;if(Oi(ui(n.doc,[...t])).forEach(({newRange:t})=>{let n=fi(r.doc,t,e=>e.isTextblock),i,a;if(n.length>1)i=n[0],a=r.doc.textBetween(i.pos,i.pos+i.node.nodeSize,void 0,` `);else if(n.length){let e=r.doc.textBetween(t.from,t.to,` `,` `);if(!Ls.test(e))return;i=n[0],a=r.doc.textBetween(i.pos,t.to,void 0,` `)}if(i&&a){let t=a.split(Is).filter(Boolean);if(t.length<=0)return!1;let n=t[t.length-1],s=i.pos+a.lastIndexOf(n);if(!n)return!1;let c=Ns(n).map(t=>t.toObject(e.defaultProtocol));if(!zs(c))return!1;c.filter(e=>e.isLink).map(e=>({...e,from:s+e.start+1,to:s+e.end+1})).filter(e=>!r.schema.marks.code||!r.doc.rangeHasMark(e.from,e.to,r.schema.marks.code)).filter(t=>e.validate(t.value)).filter(t=>e.shouldAutoLink(t.value)).forEach(t=>{ki(t.from,t.to,r.doc).some(t=>t.mark.type===e.type)||o.addMark(t.from,t.to,e.type.create({href:t.href}))})}}),o.steps.length)return o}})}function Vs(e){return new T({key:new E(`handleClickLink`),props:{handleClick:(t,n,r)=>{if(r.button!==0||!t.editable)return!1;let i=null;if(r.target instanceof HTMLAnchorElement)i=r.target;else{let t=r.target;if(!t)return!1;let n=e.editor.view.dom;i=t.closest(`a`),i&&!n.contains(i)&&(i=null)}if(!i)return!1;let a=!1;if(e.enableClickSelection&&(a=e.editor.commands.extendMarkRange(e.type.name)),e.openOnClick){let n=Ti(t.state,e.type.name),r=i.href??n.href,o=i.target??n.target;r&&(window.open(r,o),a=!0)}return a}}})}function Hs(e){return new T({key:new E(`handlePasteLink`),props:{handlePaste:(t,n,r)=>{let{shouldAutoLink:i}=e,{state:a}=t,{selection:o}=a,{empty:s}=o;if(s)return!1;let c=``;r.content.forEach(e=>{c+=e.textContent});let l=Ps(c,{defaultProtocol:e.defaultProtocol}).find(e=>e.isLink&&e.value===c);return!c||!l||i!==void 0&&!i(l.value)?!1:e.editor.commands.setMark(e.type,{href:l.href})}}})}function Us(e,t){let n=[`http`,`https`,`ftp`,`ftps`,`mailto`,`tel`,`callto`,`sms`,`cid`,`xmpp`];return t&&t.forEach(e=>{let t=typeof e==`string`?e:e.scheme;t&&n.push(t)}),!e||e.replace(Rs,``).match(RegExp(`^(?:(?:${n.join(`|`)}):|[^a-z]|[a-z0-9+.-]+(?:[^a-z+.-:]|$))`,`i`))}la.create({name:`link`,priority:1e3,keepOnSplit:!1,exitable:!0,onCreate(){this.options.validate&&!this.options.shouldAutoLink&&(this.options.shouldAutoLink=this.options.validate,console.warn("The `validate` option is deprecated. Rename to the `shouldAutoLink` option instead.")),this.options.protocols.forEach(e=>{if(typeof e==`string`){js(e);return}js(e.scheme,e.optionalSlashes)})},onDestroy(){As()},inclusive(){return this.options.autolink},addOptions(){return{openOnClick:!0,enableClickSelection:!1,linkOnPaste:!0,autolink:!0,protocols:[],defaultProtocol:`http`,HTMLAttributes:{target:`_blank`,rel:`noopener noreferrer nofollow`,class:null},isAllowedUri:(e,t)=>!!Us(e,t.protocols),validate:e=>!!e,shouldAutoLink:e=>{let t=/^[a-z][a-z0-9+.-]*:\/\//i.test(e),n=/^[a-z][a-z0-9+.-]*:/i.test(e);if(t||n&&!e.includes(`@`))return!0;let r=(e.includes(`@`)?e.split(`@`).pop():e).split(/[/?#:]/)[0];return!(/^\d{1,3}(\.\d{1,3}){3}$/.test(r)||!/\./.test(r))}}},addAttributes(){return{href:{default:null,parseHTML(e){return e.getAttribute(`href`)}},target:{default:this.options.HTMLAttributes.target},rel:{default:this.options.HTMLAttributes.rel},class:{default:this.options.HTMLAttributes.class},title:{default:null}}},parseHTML(){return[{tag:`a[href]`,getAttrs:e=>{let t=e.getAttribute(`href`);return!t||!this.options.isAllowedUri(t,{defaultValidate:e=>!!Us(e,this.options.protocols),protocols:this.options.protocols,defaultProtocol:this.options.defaultProtocol})?!1:null}}]},renderHTML({HTMLAttributes:e}){return this.options.isAllowedUri(e.href,{defaultValidate:e=>!!Us(e,this.options.protocols),protocols:this.options.protocols,defaultProtocol:this.options.defaultProtocol})?[`a`,xi(this.options.HTMLAttributes,e),0]:[`a`,xi(this.options.HTMLAttributes,{...e,href:``}),0]},markdownTokenName:`link`,parseMarkdown:(e,t)=>t.applyMark(`link`,t.parseInline(e.tokens||[]),{href:e.href,title:e.title||null}),renderMarkdown:(e,t)=>{let n=e.attrs?.href??``,r=e.attrs?.title??``,i=t.renderChildren(e);return r?`[${i}](${n} "${r}")`:`[${i}](${n})`},addCommands(){return{setLink:e=>({chain:t})=>{let{href:n}=e;return this.options.isAllowedUri(n,{defaultValidate:e=>!!Us(e,this.options.protocols),protocols:this.options.protocols,defaultProtocol:this.options.defaultProtocol})?t().setMark(this.name,e).setMeta(`preventAutolink`,!0).run():!1},toggleLink:e=>({chain:t})=>{let{href:n}=e||{};return n&&!this.options.isAllowedUri(n,{defaultValidate:e=>!!Us(e,this.options.protocols),protocols:this.options.protocols,defaultProtocol:this.options.defaultProtocol})?!1:t().toggleMark(this.name,e,{extendEmptyMarkRange:!0}).setMeta(`preventAutolink`,!0).run()},unsetLink:()=>({chain:e})=>e().unsetMark(this.name,{extendEmptyMarkRange:!0}).setMeta(`preventAutolink`,!0).run()}},addPasteRules(){return[Ma({find:e=>{let t=[];if(e){let{protocols:n,defaultProtocol:r}=this.options,i=Ps(e).filter(e=>e.isLink&&this.options.isAllowedUri(e.value,{defaultValidate:e=>!!Us(e,n),protocols:n,defaultProtocol:r}));i.length&&i.forEach(e=>{this.options.shouldAutoLink(e.value)&&t.push({text:e.value,data:{href:e.href},index:e.start})})}return t},type:this.type,getAttributes:e=>({href:e.data?.href})})]},addProseMirrorPlugins(){let e=[],{protocols:t,defaultProtocol:n}=this.options;return this.options.autolink&&e.push(Bs({type:this.type,defaultProtocol:this.options.defaultProtocol,validate:e=>this.options.isAllowedUri(e,{defaultValidate:e=>!!Us(e,t),protocols:t,defaultProtocol:n}),shouldAutoLink:this.options.shouldAutoLink})),e.push(Vs({type:this.type,editor:this.editor,openOnClick:this.options.openOnClick===`whenNotEditable`||this.options.openOnClick,enableClickSelection:this.options.enableClickSelection})),this.options.linkOnPaste&&e.push(Hs({editor:this.editor,defaultProtocol:this.options.defaultProtocol,type:this.type,shouldAutoLink:this.options.shouldAutoLink})),e}});function Ws(e){return Array.isArray(e)&&e.length>0}function Gs(e){if(!e)return[];if(Ws(e))return e;let t=[];return e.linkToEntry&&t.push({...e.linkToEntry,optionTitle:`Link to an entry`}),e.linkToAsset&&t.push({...e.linkToAsset,optionTitle:`Link to an asset`}),e.linkToCategory&&t.push({...e.linkToCategory,optionTitle:`Link to a category`}),t}function Ks(e,t){return`${e.url||``}#${t}:${e.id}@${e.siteId}`}var qs=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;function U(e){return qs.test(e)}function Js(e={}){return{type:`url`,targetUid:null,siteMode:`current`,siteUid:null,value:null,suffix:null,newWindow:!1,title:null,ariaLabel:null,rel:[],class:null,id:null,download:null,...e}}function Ys(e){return Js({...Object.fromEntries(Object.entries(e).filter(([e,t])=>!Xs.has(e)&&typeof t==`boolean`)),type:e.type??`url`,targetUid:typeof e.targetUid==`string`?e.targetUid:null,siteMode:e.siteMode===`fixed`?`fixed`:`current`,siteUid:typeof e.siteUid==`string`?e.siteUid:null,value:typeof e.value==`string`?e.value:null,suffix:typeof e.suffix==`string`?e.suffix:null,newWindow:e.newWindow===!0,title:typeof e.title==`string`?e.title:null,ariaLabel:typeof e.ariaLabel==`string`?e.ariaLabel:null,rel:Array.isArray(e.rel)?e.rel.filter(e=>typeof e==`string`):[],class:typeof e.class==`string`?e.class:null,id:typeof e.id==`string`?e.id:null,download:e.download===!0||typeof e.download==`string`?e.download:null,linkUid:typeof e.linkUid==`string`?e.linkUid:null})}var Xs=new Set([`type`,`targetUid`,`siteMode`,`siteUid`,`value`,`suffix`,`newWindow`,`title`,`ariaLabel`,`rel`,`class`,`id`,`download`,`linkUid`,`href`,`target`,`url`,`linkClass`]);function Zs(e,t=!1){return Js({type:`url`,value:e,newWindow:t})}function Qs(e){switch(e.type){case`url`:return e.value??`#`;case`email`:return e.value?`mailto:${e.value}`:`#`;case`tel`:return e.value?`tel:${e.value}`:`#`;case`sms`:return e.value?`sms:${e.value}`:`#`;case`entry`:case`asset`:case`category`:return e.targetUid?`#vizy-link:${e.type}:${e.targetUid}`:`#`;default:return`#`}}function $s(e){if(e<1)return[];let t=Math.floor(1e3/e),n=1e3-t*e;return Array.from({length:e},(e,r)=>t+ +(r<n))}function ec(e){return e.reduce((e,t)=>e+t,0)}function tc(e){if(e.childCount===0)return 0;let t=e.child(0),n=0;for(let e=0;e<t.childCount;e++){let r=Number(t.child(e).attrs.colspan??1);n+=Number.isFinite(r)&&r>0?r:1}return n}var nc=`[\0- \xA0 ᠎ -\u2029 　]`,rc=new RegExp(nc),ic=RegExp(`${nc}$`),ac=new RegExp(nc,`g`);function oc(e){return e.length===1?e[0].isLink:e.length===3&&e[1].isLink?[`()`,`[]`].includes(e[0].value+e[2].value):!1}function sc(e){return new T({key:new E(`autolink`),appendTransaction:(t,n,r)=>{let i=t.some(e=>e.docChanged)&&!n.doc.eq(r.doc),a=t.some(e=>e.getMeta(`preventAutolink`));if(!i||a)return;let{tr:o}=r,s=Pe(n.doc,[...t]);if(Be(s).forEach(({newRange:t})=>{let n=xe(r.doc,t,e=>e.isTextblock),i,a;if(n.length>1)i=n[0],a=r.doc.textBetween(i.pos,i.pos+i.node.nodeSize,void 0,` `);else if(n.length){let e=r.doc.textBetween(t.from,t.to,` `,` `);if(!ic.test(e))return;i=n[0],a=r.doc.textBetween(i.pos,t.to,void 0,` `)}if(i&&a){let t=a.split(rc).filter(Boolean);if(t.length<=0)return!1;let n=t[t.length-1],s=i.pos+a.lastIndexOf(n);if(!n)return!1;let c=Ns(n).map(t=>t.toObject(e.defaultProtocol));if(!oc(c))return!1;c.filter(e=>e.isLink).map(e=>({...e,from:s+e.start+1,to:s+e.end+1})).filter(e=>!r.schema.marks.code||!r.doc.rangeHasMark(e.from,e.to,r.schema.marks.code)).filter(t=>e.validate(t.value)).filter(t=>e.shouldAutoLink(t.value)).forEach(t=>{Je(t.from,t.to,r.doc).some(t=>t.mark.type===e.type)||o.addMark(t.from,t.to,e.type.create({href:t.href}))})}}),o.steps.length)return o}})}function cc(e){return new T({key:new E(`handleClickLink`),props:{handleClick:(t,n,r)=>{if(r.button!==0||!t.editable)return!1;let i=null;if(r.target instanceof HTMLAnchorElement)i=r.target;else{let t=r.target;if(!t)return!1;let n=e.editor.view.dom;i=t.closest(`a`),i&&!n.contains(i)&&(i=null)}if(!i)return!1;let a=!1;if(e.enableClickSelection&&(a=e.editor.commands.extendMarkRange(e.type.name)),e.openOnClick){let n=je(t.state,e.type.name),r=i.href??n.href,o=i.target??n.target;r&&(window.open(r,o),a=!0)}return a}}})}var lc=/\[([^[\]]+)\]\(((?:[^\s()]|\([^\s()]*\))+)(?:\s+(?:(["'])(.*?)\3|“(.*?)”|‘(.*?)’))?\)$/,uc=/\[([^[\]]+)\]\(((?:[^\s()]|\([^\s()]*\))+)(?:\s+(?:(["'])(.*?)\3|“(.*?)”|‘(.*?)’))?\)/g;function dc(e,t){let n=0;for(let r=t-1;r>=0&&e[r]===`\\`;--r)n+=1;return n%2==1}function fc(e,t){let n=0,r=0;for(;r<t;){if(e[r]!=="`"){r+=1;continue}if(n===0&&dc(e,r)){r+=1;continue}let i=0;for(;r<t&&e[r]==="`";)i+=1,r+=1;n===0?n=i:i===n&&(n=0)}return n>0}function pc(e,t,n){let[,r,i]=t;return(t.index?e[t.index-1]:void 0)===`!`||dc(e,t.index??0)||fc(e,t.index??0)?!1:!!r.trim()&&n(i)}function mc(e){let[t,n,r,,i,a,o]=e,s=i??a??o;return{index:e.index??0,text:t,replaceWith:n,data:{href:r,title:s||null,markdown:!0}}}function hc(e,t){return e.index<t.index+t.text.length&&t.index<e.index+e.text.length}function gc(e){return{href:e.data?.href,title:e.data?.title??null}}function _c(e){let t=ze({find:t=>{let n=lc.exec(t);return!n||!pc(t,n,e.isAllowedHref)?null:mc(n)},type:e.type,getAttributes:gc});return new ve({find:t.find,handler:e=>{let n=t.handler(e);return n!==null&&e.state.tr.steps.length&&e.state.tr.setMeta(`preventAutolink`,!0),n}})}function vc(e){let t=ue({find:t=>{let n=[];for(let r of t.matchAll(uc))pc(t,r,e.isAllowedHref)&&n.push(mc(r));let r=(e.findPlainUrls?.call(e,t)??[]).filter(e=>!n.some(t=>hc(t,e)));return[...n,...r]},type:e.type,getAttributes:gc});return new fe({find:t.find,handler:e=>{let n=t.handler(e);return n!==null&&e.state.tr.steps.length&&e.match.data?.markdown&&e.state.tr.setMeta(`preventAutolink`,!0),n}})}function yc(e){return new T({key:new E(`handlePasteLink`),props:{handlePaste:(t,n,r)=>{let{shouldAutoLink:i}=e,{state:a}=t,{selection:o}=a,{empty:s}=o;if(s)return!1;let c=``;r.content.forEach(e=>{c+=e.textContent});let l=Ps(c,{defaultProtocol:e.defaultProtocol}).find(e=>e.isLink&&e.value===c);return!c||!l||i!==void 0&&!i(l.value)?!1:e.editor.commands.setMark(e.type,{href:l.href})}}})}function bc(e,t){let n=[`http`,`https`,`ftp`,`ftps`,`mailto`,`tel`,`callto`,`sms`,`cid`,`xmpp`];return t&&t.forEach(e=>{let t=typeof e==`string`?e:e.scheme;t&&n.push(t)}),!e||e.replace(ac,``).match(RegExp(`^(?:(?:${n.map(e=>e.replace(/[-/\\^$*+?.()|[\]{}]/g,`\\$&`)).join(`|`)}):|[^a-z]|[a-z0-9+.\\-]+(?:[^a-z+.\\-:]|$))`,`i`))}Ie.create({name:`link`,priority:1e3,keepOnSplit:!1,exitable:!0,onCreate(){this.options.validate&&!this.options.shouldAutoLink&&(this.options.shouldAutoLink=this.options.validate,console.warn("The `validate` option is deprecated. Rename to the `shouldAutoLink` option instead.")),this.options.protocols.forEach(e=>{if(typeof e==`string`){js(e);return}js(e.scheme,e.optionalSlashes)})},onDestroy(){As()},inclusive(){return this.options.autolink},addOptions(){return{openOnClick:!0,enableClickSelection:!1,linkOnPaste:!0,markdownLinks:!1,autolink:!0,protocols:[],defaultProtocol:`http`,HTMLAttributes:{target:`_blank`,rel:`noopener noreferrer nofollow`,class:null},isAllowedUri:(e,t)=>!!bc(e,t.protocols),validate:e=>!!e,shouldAutoLink:e=>{let t=/^[a-z][a-z0-9+.-]*:\/\//i.test(e),n=/^[a-z][a-z0-9+.-]*:/i.test(e);if(t||n&&!e.includes(`@`))return!0;let r=(e.includes(`@`)?e.split(`@`).pop():e).split(/[/?#:]/)[0];return!(/^\d{1,3}(\.\d{1,3}){3}$/.test(r)||!/\./.test(r))}}},addAttributes(){return{href:{default:null,parseHTML(e){return e.getAttribute(`href`)}},target:{default:this.options.HTMLAttributes.target??null},rel:{default:this.options.HTMLAttributes.rel??null},class:{default:this.options.HTMLAttributes.class??null},title:{default:null}}},parseHTML(){return[{tag:`a[href]`,getAttrs:e=>{let t=e.getAttribute(`href`);return!t||!this.options.isAllowedUri(t,{defaultValidate:e=>!!bc(e,this.options.protocols),protocols:this.options.protocols,defaultProtocol:this.options.defaultProtocol})?!1:null}}]},renderHTML({HTMLAttributes:e}){return this.options.isAllowedUri(e.href,{defaultValidate:e=>!!bc(e,this.options.protocols),protocols:this.options.protocols,defaultProtocol:this.options.defaultProtocol})?[`a`,A(this.options.HTMLAttributes,e),0]:[`a`,A(this.options.HTMLAttributes,{...e,href:``}),0]},markdownTokenName:`link`,parseMarkdown:(e,t)=>t.applyMark(`link`,t.parseInline(e.tokens||[]),{href:e.href,title:e.title||null}),renderMarkdown:(e,t)=>{let n=e.attrs?.href??``,r=e.attrs?.title??``,i=t.renderChildren(e);return r?`[${i}](${n} "${r}")`:`[${i}](${n})`},addCommands(){return{setLink:e=>({chain:t})=>{let{href:n}=e;return this.options.isAllowedUri(n,{defaultValidate:e=>!!bc(e,this.options.protocols),protocols:this.options.protocols,defaultProtocol:this.options.defaultProtocol})?t().setMark(this.name,e).setMeta(`preventAutolink`,!0).run():!1},toggleLink:e=>({chain:t})=>{let{href:n}=e||{};return n&&!this.options.isAllowedUri(n,{defaultValidate:e=>!!bc(e,this.options.protocols),protocols:this.options.protocols,defaultProtocol:this.options.defaultProtocol})?!1:t().toggleMark(this.name,e,{extendEmptyMarkRange:!0}).setMeta(`preventAutolink`,!0).run()},unsetLink:()=>({chain:e})=>e().unsetMark(this.name,{extendEmptyMarkRange:!0}).setMeta(`preventAutolink`,!0).run()}},addInputRules(){return this.options.markdownLinks?[_c({type:this.type,isAllowedHref:e=>this.options.isAllowedUri(e,{defaultValidate:e=>!!bc(e,this.options.protocols),protocols:this.options.protocols,defaultProtocol:this.options.defaultProtocol})})]:[]},addPasteRules(){let e=e=>{let t=[];if(e){let{protocols:n,defaultProtocol:r}=this.options;Ps(e).filter(e=>e.isLink&&this.options.isAllowedUri(e.value,{defaultValidate:e=>!!bc(e,n),protocols:n,defaultProtocol:r})).forEach(e=>{this.options.shouldAutoLink(e.value)&&t.push({text:e.value,data:{href:e.href},index:e.start})})}return t};return this.options.markdownLinks?[vc({type:this.type,isAllowedHref:e=>this.options.isAllowedUri(e,{defaultValidate:e=>!!bc(e,this.options.protocols),protocols:this.options.protocols,defaultProtocol:this.options.defaultProtocol}),findPlainUrls:e})]:[ue({find:e,type:this.type,getAttributes:e=>({href:e.data?.href})})]},addProseMirrorPlugins(){let e=[],{protocols:t,defaultProtocol:n}=this.options;return this.options.autolink&&e.push(sc({type:this.type,defaultProtocol:this.options.defaultProtocol,validate:e=>this.options.isAllowedUri(e,{defaultValidate:e=>!!bc(e,t),protocols:t,defaultProtocol:n}),shouldAutoLink:this.options.shouldAutoLink})),e.push(cc({type:this.type,editor:this.editor,openOnClick:this.options.openOnClick===`whenNotEditable`||this.options.openOnClick,enableClickSelection:this.options.enableClickSelection})),this.options.linkOnPaste&&e.push(yc({editor:this.editor,defaultProtocol:this.options.defaultProtocol,type:this.type,shouldAutoLink:this.options.shouldAutoLink})),e}});function xc(e){let{from:t,to:n}=e.state.selection;return e.state.doc.textBetween(t,n,` `)}function Sc(e){let t=Ac(e),{state:n}=e,r=n.schema.marks.link,i=r?me(n.selection.$from,r):null,a=i?.from??n.selection.from,o=i?.to??n.selection.to;return{from:a,to:o,text:e.state.doc.textBetween(a,o,` `),openInNewTab:t.newWindow,url:Qs(t),semantic:t}}function Cc(e){let{from:t,to:n}=e.state.selection;return{url:``,text:xc(e),openInNewTab:!1,from:t,to:n}}function wc(e,t){let n=t.focus??!0,r=()=>n?e.chain().focus():e.chain(),i=typeof t.from==`number`&&typeof t.to==`number`,a=i?t.from:e.state.selection.from,o=i?t.to:e.state.selection.to,s=e.state.doc.textBetween(a,o,` `),c=a!==o&&t.text===s?t.text:t.text.trim()||jc(t.attrs),l={type:`link`,attrs:t.attrs};if(a!==o){c===s?r().setTextSelection({from:a,to:o}).setSemanticLink(t.attrs).run():r().insertContentAt({from:a,to:o},[{type:`text`,text:c,marks:[l]}]).run();return}r().insertContentAt(a,{type:`text`,text:c,marks:[l]}).run()}function Tc(e,t){(t?.focus??!0?e.chain().focus():e.chain()).extendMarkRange(`link`).unsetSemanticLink().run()}var Ec=/^[^\s@]+@[^\s@]+\.[^\s@]+$/u;function Dc(e){let t=e.trim();return/^www\./i.test(t)?`https://${t}`:/^[a-z][a-z\d+.-]*:/i.test(t)?t:Ec.test(t)?`mailto:${t}`:t}function Oc(e){let t=Dc(e);if(!t)return null;let n=t.match(/^([a-z][a-z\d+.-]*):/i)?.[1]?.toLowerCase();return n&&![`http`,`https`,`mailto`,`tel`,`sms`].includes(n)?`Enter a safe URL or email address.`:bc(t)?null:`Enter a safe URL or email address.`}function kc(e,t){let n=Dc(e);return n.toLowerCase().startsWith(`mailto:`)?Js({type:`email`,value:n.slice(7),newWindow:t}):n.toLowerCase().startsWith(`tel:`)?Js({type:`tel`,value:n.slice(4),newWindow:t}):n.toLowerCase().startsWith(`sms:`)?Js({type:`sms`,value:n.slice(4),newWindow:t}):Zs(n,t)}function Ac(e){return Ys(e.getAttributes(`link`))}function jc(e){return e.type===`url`||e.type===`email`||e.type===`tel`||e.type===`sms`?e.value??Qs(e):Qs(e)}var Mc=e=>e??r,Nc=b(class extends x{constructor(e){if(super(e),e.type!==S.PROPERTY&&e.type!==S.ATTRIBUTE&&e.type!==S.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!se(e))throw Error("`live` bindings can only contain a single expression")}render(e){return e}update(e,[t]){if(t===u||t===r)return t;let n=e.element,i=e.name;if(e.type===S.PROPERTY){if(t===n[i])return u}else if(e.type===S.BOOLEAN_ATTRIBUTE){if(!!t===n.hasAttribute(i))return u}else if(e.type===S.ATTRIBUTE&&n.getAttribute(i)===t+``)return u;return ce(e),t}}),Pc=new Set([`button`,`submit`,`reset`,`checkbox`,`radio`,`file`,`image`,`hidden`]),Fc=`pk-implicit-submit`,Ic=(e,t)=>{if(e.key!==`Enter`||e.defaultPrevented||e.isComposing||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey)return!1;let n=(t||`text`).toLowerCase();return!Pc.has(n)},Lc=e=>{let t=e.closest?.(`pk-dialog`);if(t){let e=t.querySelector(`form`);if(e)return e}let n=e.form;return n&&n.id===`main`?e.closest?.(`form`)===n?null:e.closest(`form`):n},Rc=(e,t,n)=>{if(e.disabled||e.readonly||!Ic(t,n))return!1;let r=Lc(e);return!r||r.id===`main`?!1:(t.preventDefault(),t.stopPropagation(),r.dispatchEvent(new CustomEvent(Fc,{bubbles:!1,cancelable:!0})),!0)},zc=o`
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
`,W=class extends ie{constructor(...e){super(...e),this.assumeInteractionOn=[`blur`,`input`],this.hasSlotController=new te(this,`instructions`,`hint`,`label`,`start`,`end`),this.inputId=y(`pk-input`),this.type=`text`,this._value=null,this.defaultValue=null,this.size=`default`,this.label=``,this.instructions=``,this.withClear=!1,this.placeholder=``,this.readonly=!1,this.invalid=!1,this.fitCell=!1,this.mono=!1,this.autofocus=!1,this.withLabel=!1,this.withInstructions=!1}static{this.styles=[rn,p(),d(`.input`,`var(--pk-input-border-radius, var(--pk-radius-sm))`),f(`.input`),zc]}static get validators(){return[...super.validators,ne(),ae()]}get value(){return this.valueHasChanged?this._value??``:this._value??this.defaultValue??``}set value(e){let t=e??``;this._value!==t&&(this.valueHasChanged=!0,this._value=t)}connectedCallback(){this.instructions=nn(this,this.instructions),this.hasAttribute(`with-hint`)&&(this.withInstructions=!0),super.connectedCallback()}syncFormValue(){this.setValue(this.value||``)}resetToDefaultValue(){this.valueHasChanged=!1,this._value=null}restoreFormState(e){typeof e==`string`&&(this.value=e)}formResetCallback(){this.valueHasChanged=!1,this._value=null,this.input&&(this.input.value=this.defaultValue??``),super.formResetCallback()}updated(e){(e.has(`value`)||e.has(`defaultValue`))&&this.setState(`blank`,!this.value),super.updated(e)}syncStandaloneAria(){if(!this.input)return;let e=!!this.label||this.hasSlotController.test(`label`,this.withLabel),t=an((e,t)=>this.hasSlotController.test(e,t),this.instructions,this.withInstructions);oe({control:this.input,labelId:`${this.inputId}-label`,instructionsId:`${this.inputId}-instructions`,hasLabel:e,hasInstructions:t,required:this.required,invalid:this.invalid||!this.internals.validity.valid})}hasLabelContent(){return!!this.label||this.hasSlotController.test(`label`,this.withLabel)}hasInstructionsContent(){return an((e,t)=>this.hasSlotController.test(e,t),this.instructions,this.withInstructions)}focus(e){this.input?.focus(e)}blur(){this.input?.blur()}select(){this.input?.select()}handleInput(){this.value=this.input.value,this.dispatchEvent(new Event(`input`,{bubbles:!0,composed:!0}))}handleChange(e){this.value=this.input.value,e.stopPropagation(),this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0}))}handleKeyDown(e){Rc(this,e,this.type)}handleClearClick(e){e.preventDefault(),this.value!==``&&(this.value=``,this.dispatchEvent(new re),this.dispatchEvent(new Event(`input`,{bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0})),this.input.focus())}render(){let e=this.hasLabelContent(),t=this.hasInstructionsContent(),i=this.withClear&&!this.disabled&&!this.readonly&&this.value.length>0,a=this.hasSlotController.test(`start`),o=this.hasSlotController.test(`end`);return n`
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
                        .value=${Nc(this.value)}
                        placeholder=${this.placeholder||r}
                        pattern=${Mc(this.pattern)}
                        minlength=${Mc(this.minlength)}
                        maxlength=${Mc(this.maxlength)}
                        min=${Mc(this.min)}
                        max=${Mc(this.max)}
                        step=${Mc(this.step)}
                        autocomplete=${Mc(this.autocomplete)}
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
        `}};i([e(`input`)],W.prototype,`input`,void 0),i([c({reflect:!0})],W.prototype,`type`,void 0),i([a()],W.prototype,`value`,null),i([c({attribute:`value`,reflect:!0})],W.prototype,`defaultValue`,void 0),i([c({reflect:!0})],W.prototype,`size`,void 0),i([c()],W.prototype,`label`,void 0),i([c()],W.prototype,`instructions`,void 0),i([c({attribute:`with-clear`,type:Boolean})],W.prototype,`withClear`,void 0),i([c()],W.prototype,`placeholder`,void 0),i([c({type:Boolean,reflect:!0})],W.prototype,`readonly`,void 0),i([c({type:Boolean,reflect:!0})],W.prototype,`invalid`,void 0),i([c({type:Boolean,reflect:!0,attribute:`fit-cell`})],W.prototype,`fitCell`,void 0),i([c({type:Boolean,reflect:!0})],W.prototype,`mono`,void 0),i([c()],W.prototype,`pattern`,void 0),i([c({type:Number})],W.prototype,`minlength`,void 0),i([c({type:Number})],W.prototype,`maxlength`,void 0),i([c()],W.prototype,`min`,void 0),i([c()],W.prototype,`max`,void 0),i([c()],W.prototype,`step`,void 0),i([c()],W.prototype,`autocomplete`,void 0),i([c({type:Boolean,reflect:!0})],W.prototype,`autofocus`,void 0),i([c({attribute:`with-label`,type:Boolean})],W.prototype,`withLabel`,void 0),i([c({attribute:`with-instructions`,type:Boolean})],W.prototype,`withInstructions`,void 0),W=i([s(`pk-input`)],W);var Bc=null;async function Vc(){typeof customElements<`u`&&customElements.get(`pk-dialog`)||(Bc||=le(()=>import(`./pk-dialog-CkG87TP9.js`).then(()=>void 0),__vite__mapDeps([0,1,2,3,4,5,6,7]),import.meta.url).catch(e=>{if(!customElements.get(`pk-dialog`))throw e}).finally(()=>{Bc=null}),await Bc)}var Hc=null,Uc=[`text`,`newWindow`,`site`,`title`,`classes`],Wc=new WeakMap,Gc=new WeakMap;function Kc(e,t,n){Wc.set(e,t??Uc),Gc.set(e,n??[])}var qc=class extends t{#e=`Insert Link`;get dialogTitle(){return this.#e}set dialogTitle(e){this.#e=e}#t=`Insert`;get submitLabel(){return this.#t}set submitLabel(e){this.#t=e}#n=null;get urlError(){return this.#n}set urlError(e){this.#n=e}#r=null;#i={url:``,text:``,openInNewTab:!1};#a=!0;#o=Uc;#s=[];#c=!1;#l=``;#u=`vizy-link-url-${Math.random().toString(36).slice(2,9)}`;#d=`vizy-link-text-${Math.random().toString(36).slice(2,9)}`;#f=null;get dialog(){return this.#f}set dialog(e){this.#f=e}#p=null;get urlInput(){return this.#p}set urlInput(e){this.#p=e}#m=null;get textInput(){return this.#m}set textInput(e){this.#m=e}#h=null;get titleInput(){return this.#h}set titleInput(e){this.#h=e}#g=null;get classesInput(){return this.#g}set classesInput(e){this.#g=e}#_=null;get newTabCheckbox(){return this.#_}set newTabCheckbox(e){this.#_=e}#v=null;get submitButton(){return this.#v}set submitButton(e){this.#v=e}static styles=o`
        :host {
            display: contents;
        }
        .link-dialog__fields {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
    `;async openForEditor(e,t,n){await Vc(),this.#r=e,this.#i={...t},this.#a=n?.focus??!0,this.#o=Wc.get(e)??Uc,this.#s=Gc.get(e)??[],this.#c=!1;let r=this.#E(t.url)?.[3];this.#l=t.semantic?.siteMode===`fixed`?t.semantic.siteUid??``:this.#T().find(e=>String(e.id)===r)?.uid??``;let i=!!(t.url.trim()||t.semantic);this.dialogTitle=i?`Update Link`:`Insert Link`,this.submitLabel=i?`Update`:`Insert`,this.requestUpdate(),await this.updateComplete,this.#y(),await this.dialog?.updateComplete,await this.dialog?.show()}render(){return n`
            <pk-dialog
                class="link-dialog"
                size="wide"
                label=${this.dialogTitle}
                @pk-after-hide=${this.#w}
                @keydown=${this.#S}
            >
                <div class="link-dialog__fields">
                    <pk-field
                        class="link-dialog__url-field"
                        label="URL or email address"
                        required
                        .for=${this.#u}
                        .errors=${this.urlError?[this.urlError]:[]}
                    >
                        <pk-input
                            id=${this.#u}
                            class="link-dialog__url-input"
                            type="text"
                            placeholder="https:// or name@example.com"
                            autofocus
                            @input=${this.#x}
                        ></pk-input>
                    </pk-field>
                    ${this.#o.includes(`text`)?n`<pk-field label="Text" .for=${this.#d}>
                        <pk-input
                            id=${this.#d}
                            class="link-dialog__text-input"
                            type="text"
                        ></pk-input>
                    </pk-field>`:null}
                    ${this.#o.includes(`newWindow`)?n`<pk-checkbox class="link-dialog__new-window">Open link in new tab</pk-checkbox>`:null}
                    ${this.#s.map(e=>n`
                        <pk-checkbox
                            data-link-attribute=${e.name}
                            .checked=${!!(this.#i.semantic?.[e.name]??e.default)}
                        >${e.label}</pk-checkbox>
                    `)}
                    ${this.#o.includes(`title`)?n`
                        <pk-field label="Title" .for=${`${this.#d}-title`}>
                            <pk-input id=${`${this.#d}-title`} class="link-dialog__title-input"></pk-input>
                        </pk-field>`:null}
                    ${this.#o.includes(`classes`)?n`
                        <pk-field label="Classes" .for=${`${this.#d}-classes`}>
                            <pk-input id=${`${this.#d}-classes`} class="link-dialog__classes-input"></pk-input>
                        </pk-field>`:null}
                    ${this.#D()?n`
                        <pk-field label="Site" .for=${`${this.#d}-site`}>
                            <pk-select id=${`${this.#d}-site`} class="link-dialog__site" width="full"
                                .value=${this.#l}
                                @pk-change=${e=>{this.#l=e.target.value}}>
                                <pk-option value="" label="Link to the current site">Link to the current site</pk-option>
                                ${this.#T().map(e=>n`<pk-option value=${e.uid} label=${e.name??``}>${e.name}</pk-option>`)}
                            </pk-select>
                        </pk-field>`:null}
                </div>
                <pk-button slot="footer" data-dialog-close>Cancel</pk-button>
                <pk-button
                    slot="footer"
                    class="link-dialog__submit"
                    variant="primary"
                    disabled
                    @click=${this.#C}
                >${this.submitLabel}</pk-button>
            </pk-dialog>
        `}#y(){this.urlInput&&(this.urlInput.value=this.#i.url??``),this.textInput&&(this.textInput.value=this.#i.text??``),this.newTabCheckbox&&(this.newTabCheckbox.checked=!!this.#i.openInNewTab),this.titleInput&&(this.titleInput.value=this.#i.semantic?.title??``),this.classesInput&&(this.classesInput.value=this.#i.semantic?.class??``),this.urlError=null,this.urlInput&&(this.urlInput.invalid=!1),this.#b()}#b(){let e=!!(!this.#c&&this.#i.semantic),t=this.urlInput?.value.trim()??``;this.urlError=e||!t?null:Oc(t),this.urlInput&&(this.urlInput.invalid=this.urlError!==null);let n=e||!!(t&&!this.urlError);this.submitButton&&(this.submitButton.disabled=!n)}#x=()=>{this.#c=!0;let e=this.#E(this.urlInput?.value??``)?.[3];this.#l=this.#T().find(t=>String(t.id)===e)?.uid??``,this.requestUpdate(),this.#b()};#S=e=>{if(e.key!==`Enter`)return;let t=e.composedPath();t.some(e=>e instanceof HTMLElement&&[`pk-checkbox`,`pk-select`].includes(e.localName))||t.some(e=>e instanceof HTMLElement&&(e.localName===`pk-button`||e instanceof HTMLButtonElement))||(e.preventDefault(),e.stopPropagation(),this.#C())};#C=()=>{let e=this.#r,t=this.urlInput?.value.trim()??``;if(!e||!t&&(this.#c||!this.#i.semantic))return;if(this.#c||!this.#i.semantic){if(this.urlError=Oc(t),this.urlInput&&(this.urlInput.invalid=this.urlError!==null),this.urlError){this.urlInput?.focus();return}t=Dc(t),this.urlInput&&(this.urlInput.value=t)}let n=this.newTabCheckbox?.checked??this.#i.openInNewTab,r=this.textInput?.value??this.#i.text,i=this.#i.semantic&&!this.#c?{...this.#i.semantic,newWindow:n}:kc(t,n);if(this.#c&&this.#i.semantic){let{title:e,class:t,ariaLabel:n,rel:r,id:a,download:o,linkUid:s}=this.#i.semantic;Object.assign(i,{title:e,class:t,ariaLabel:n,rel:r,id:a,download:o,linkUid:s})}for(let e of this.#s){let t=this.shadowRoot?.querySelector(`[data-link-attribute="${e.name}"]`);i[e.name]=t?.checked??!!(this.#i.semantic?.[e.name]??e.default)}this.titleInput&&(i.title=this.titleInput.value.trim()||null),this.classesInput&&(i.class=this.classesInput.value.trim()||null),this.#D()&&(i.siteMode=this.#l?`fixed`:`current`,i.siteUid=this.#l||null,i.type===`url`&&i.value&&(i.value=i.value.replace(/((?:#|%23)(?:entry|asset|category):\d+)(?:@\d+)?$/,`$1`))),wc(e,{attrs:i,text:r,from:this.#i.from,to:this.#i.to,focus:this.#a}),this.dialog?.hide(`submit`)};#w=e=>{e.target===this.dialog&&(this.#r=null)};#T(){return(window.Craft?.sites??[]).filter(e=>typeof e.id==`number`&&typeof e.uid==`string`&&U(e.uid))}#E(e){return e.match(/(?:#|%23)(entry|asset|category):(\d+)(?:@(\d+))?$/)}#D(){let e=this.#c?null:this.#i.semantic?.type,t=this.#c?this.urlInput?.value??``:this.#i.url;return this.#o.includes(`site`)&&this.#T().length>1&&(!!(e&&[`entry`,`asset`,`category`].includes(e))||this.#E(t)!==null)}};F([c()],qc.prototype,`dialogTitle`,null),F([c()],qc.prototype,`submitLabel`,null),F([a()],qc.prototype,`urlError`,null),F([e(`pk-dialog`)],qc.prototype,`dialog`,null),F([e(`.link-dialog__url-input`)],qc.prototype,`urlInput`,null),F([e(`.link-dialog__text-input`)],qc.prototype,`textInput`,null),F([e(`.link-dialog__title-input`)],qc.prototype,`titleInput`,null),F([e(`.link-dialog__classes-input`)],qc.prototype,`classesInput`,null),F([e(`.link-dialog__new-window`)],qc.prototype,`newTabCheckbox`,null),F([e(`.link-dialog__submit`)],qc.prototype,`submitButton`,null),qc=F([P(`vizy-link-dialog`)],qc);async function Jc(e,t,n){await Vc(),(!Hc||!Hc.isConnected)&&(Hc=document.createElement(`vizy-link-dialog`),document.body.append(Hc),await Hc.updateComplete),await Hc.openForEditor(e,t,n)}function Yc(){return{openElementSelector:(e,t)=>{let n=window.Craft;if(!n?.createElementSelectorModal)throw Error(`Craft element selector is not available in this environment.`);n.createElementSelectorModal(e,t)}}}function Xc(e){let{from:t,to:n}=e.state.selection;return e.state.doc.textBetween(t,n,` `)}function Zc(e,t,n){if(t!==`link`){(n?.focus??e.view.hasFocus()?e.chain().focus():e.chain()).toggleMark(t).run();return}Qc(e,n)}async function Qc(e,t){await Jc(e,e.isActive(`link`)?Sc(e):Cc(e),t)}function $c(e,t){Tc(e,t)}function el(e){return Gs(e?.linkOptions)}function tl(e,t,n,r){let i=n.linkSelectorStorageKeyPrefix||`VizyInput.LinkTo.${n.elementSiteId??`site`}`,a=Yc(),{from:o,to:s}=e.state.selection;a.openElementSelector(t.elementType,{storageKey:`${i}.${t.elementType}`,sources:t.sources,criteria:t.criteria,defaultSiteId:n.elementSiteId,autoFocusSearchBox:!1,closeOtherModals:!1,onSelect:i=>{if(!i?.length)return;let[a]=i,c=Xc(e)||a.label||``,l=nl(a),u=rl(t.refHandle),d=il(n.elementSiteId,a.siteId);if(l&&u){Jc(e,{url:a.url||``,text:c,openInNewTab:!1,from:o,to:s,semantic:Js({type:u,targetUid:l,siteMode:d.siteMode,siteUid:d.siteUid,newWindow:!1})},r);return}Jc(e,{url:Ks(a,t.refHandle),text:c,openInNewTab:!1,from:o,to:s},r)}})}function nl(e){if(typeof e.uid==`string`&&U(e.uid))return e.uid;let t=e.$element?.data?.(`uid`);if(typeof t==`string`&&U(t))return t;let n=e.$element?.attr?.(`data-uid`);return typeof n==`string`&&U(n)?n:null}function rl(e){switch(e){case`entry`:return`entry`;case`asset`:return`asset`;case`category`:return`category`;default:return null}}function il(e,t){if(!t||!e||t===e)return{siteMode:`current`,siteUid:null};let n=window.Craft?.sites?.find(e=>e.id===t);return{siteMode:`fixed`,siteUid:typeof n?.uid==`string`&&U(n.uid)?n.uid:null}}var al=new Map,ol=new Map;function sl(e,t){let n=ol.get(e)??new Set;return n.add(t),ol.set(e,n),()=>{n.delete(t),n.size===0&&ol.delete(e)}}function cl(e,t){al.set(e,t);for(let t of[...ol.get(e)??[]])t()}function ll(e){return al.get(e)??null}function ul(e){if(e)for(let[t,n]of Object.entries(e))!t||!n?.url||cl(t,{assetId:Number(n.assetId)||0,url:n.url,label:n.label||`Image`,transform:n.transform??``})}function dl(e){let t=al.get(e);if(!t)return null;let n=t.url.indexOf(`#`),r=n<0?t.url:t.url.slice(0,n),i=n<0?``:t.url.slice(n),a=r.includes(`?`)?t.url:`${r}?v=${Date.now()}${i}`;return cl(e,{...t,url:a}),a}var fl=[{value:`default`,label:`Default`},{value:`small`,label:`Small`},{value:`medium`,label:`Medium`},{value:`large`,label:`Large`},{value:`full`,label:`Full`}];function pl(e){return e.isActive(`image`)?vl(e.getAttributes(`image`)):null}function ml(e){let t=pl(e);if(!t)return null;let n=ll(t.assetUid),r=t.link;return{assetUid:t.assetUid,assetId:n?.assetId??0,previewUrl:n?.url??``,alt:t.alt??``,title:t.title??``,linkUrl:r?Qs(r):``,openInNewTab:r?.newWindow??!1,size:t.size,transform:n?.transform??``,updating:!0,originalAttrs:t}}function hl(e,t){cl(t.attrs.assetUid,{assetId:t.preview.assetId,url:t.preview.url,label:t.preview.label,transform:t.preview.transform});let n=t.focus??!0?e.chain().focus():e.chain();return t.replaceSelection&&e.isActive(`image`)?n.updateAttributes(`image`,t.attrs).run():n.setSemanticImage(t.attrs).run()}function gl(e,t){let n=t?.focus??!0?e.chain().focus():e.chain();if(e.state.selection instanceof O&&e.state.selection.node.type.name===`image`){n.deleteSelection().run();return}if(e.isActive(`image`)){let t=e.state.selection.$from.before(e.state.selection.$from.depth);e.state.doc.nodeAt(t)?.type.name===`image`&&n.setNodeSelection(t).deleteSelection().run()}}function _l(e){let t=e.alt.trim(),n=e.title.trim(),r=e.linkUrl.trim(),i=e.originalAttrs,a=i?.link,o=a?Qs(a):``,s=a&&r===o?{...a,newWindow:e.openInNewTab}:r?kc(r,e.openInNewTab):null,c=i&&e.alt===(i.alt??``);return{assetUid:e.assetUid,siteMode:i?.siteMode??`current`,siteUid:i?.siteUid??null,altMode:c?i.altMode:t?`custom`:`asset`,alt:c?i.alt:t||null,title:n||null,size:e.size,link:s,imageUid:i?.imageUid??null}}function vl(e){let t=typeof e.assetUid==`string`?e.assetUid:``;if(!t)return null;let n=[`default`,`small`,`medium`,`large`,`full`].includes(String(e.size))?e.size:`default`,r=[`asset`,`custom`,`decorative`,`missing`].includes(String(e.altMode))?e.altMode:`asset`,i=null;if(e.link&&typeof e.link==`object`){let t=e.link;i=Ys(t)}return{assetUid:t,siteMode:e.siteMode===`fixed`?`fixed`:`current`,siteUid:typeof e.siteUid==`string`?e.siteUid:null,altMode:r,alt:typeof e.alt==`string`?e.alt:null,title:typeof e.title==`string`?e.title:null,size:n,link:i,imageUid:typeof e.imageUid==`string`?e.imageUid:null}}function yl(e,t){if(!e)return Promise.resolve(null);let n=window.Craft;return typeof n?.sendActionRequest==`function`?n.sendActionRequest(`POST`,t?`assets/generate-transform`:`vizy/assets/info`,{data:{assetId:e,handle:t}}).then(e=>e.data.url??null).catch(()=>null):Promise.resolve(null)}async function bl(e){let t=ll(e);if(!t)return null;let n=await yl(t.assetId,t.transform);return!n||ll(e)!==t?null:(cl(e,{...t,url:n}),dl(e))}var xl=null,G=class extends t{#e=`Insert Image`;get dialogTitle(){return this.#e}set dialogTitle(e){this.#e=e}#t=`Insert`;get submitLabel(){return this.#t}set submitLabel(e){this.#t=e}#n=null;get urlError(){return this.#n}set urlError(e){this.#n=e}#r=null;#i=null;#a=0;#o=!0;#s=Math.random().toString(36).slice(2,9);#c=null;get dialog(){return this.#c}set dialog(e){this.#c=e}#l=null;get altInput(){return this.#l}set altInput(e){this.#l=e}#u=null;get titleInput(){return this.#u}set titleInput(e){this.#u=e}#d=null;get urlInput(){return this.#d}set urlInput(e){this.#d=e}#f=null;get newTabCheckbox(){return this.#f}set newTabCheckbox(e){this.#f=e}#p=null;get sizeSelect(){return this.#p}set sizeSelect(e){this.#p=e}#m=null;get transformSelect(){return this.#m}set transformSelect(e){this.#m=e}#h=null;get previewImg(){return this.#h}set previewImg(e){this.#h=e}#g=[];get transforms(){return this.#g}set transforms(e){this.#g=e}static styles=o`
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
    `;async openForEditor(e,t,n){await Vc(),this.#r=e,this.#i={...t},this.#o=n?.focus??!0,n?.transforms&&(this.transforms=n.transforms),this.dialogTitle=t.updating?`Edit Image`:`Insert Image`,this.submitLabel=t.updating?`Update`:`Insert`,await this.updateComplete,this.#_(),await this.dialog?.updateComplete,await this.dialog?.show()}render(){return n`
            <pk-dialog
                class="image-dialog"
                size="wide"
                label=${this.dialogTitle}
                without-body-padding
                @pk-after-hide=${this.#x}
            >
                <div class="body">
                    <div class="preview">
                        ${this.#i?.previewUrl?n`<img class="image-dialog__preview-img" src=${this.#i.previewUrl} alt="">`:n`<p class="preview-empty">No preview</p>`}
                    </div>
                    <div class="fields">
                        <pk-field label="Alt Text" .for=${`vizy-img-alt-${this.#s}`}>
                            <pk-input id=${`vizy-img-alt-${this.#s}`} class="image-dialog__alt" type="text" autofocus></pk-input>
                        </pk-field>
                        <pk-field label="Title" .for=${`vizy-img-title-${this.#s}`}>
                            <pk-input id=${`vizy-img-title-${this.#s}`} class="image-dialog__title" type="text"></pk-input>
                        </pk-field>
                        <pk-field
                            label="URL"
                            .for=${`vizy-img-url-${this.#s}`}
                            .errors=${this.urlError?[this.urlError]:[]}
                        >
                            <pk-input
                                id=${`vizy-img-url-${this.#s}`}
                                class="image-dialog__url"
                                type="text"
                                placeholder="https://"
                                @input=${this.#y}
                            ></pk-input>
                        </pk-field>
                        <pk-checkbox>Open link in new tab</pk-checkbox>
                        <pk-field label="Size" .for=${`vizy-img-size-${this.#s}`}>
                            <pk-select
                                id=${`vizy-img-size-${this.#s}`}
                                class="image-dialog__size"
                                width="full"
                            >
                                ${fl.map(e=>n`
                                    <pk-option value=${e.value} label=${e.label}>${e.label}</pk-option>
                                `)}
                            </pk-select>
                        </pk-field>
                        ${this.transforms.length>0?n`
                            <pk-field label="Transform" .for=${`vizy-img-transform-${this.#s}`}>
                                <pk-select
                                    id=${`vizy-img-transform-${this.#s}`}
                                    class="image-dialog__transform"
                                    width="full"
                                    @pk-change=${this.#v}
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
                    @click=${this.#b}
                >${this.submitLabel}</pk-button>
            </pk-dialog>
        `}#_(){let e=this.#i;e&&(this.altInput&&(this.altInput.value=e.alt),this.titleInput&&(this.titleInput.value=e.title),this.urlInput&&(this.urlInput.value=e.linkUrl),this.urlError=null,this.urlInput&&(this.urlInput.invalid=!1),this.newTabCheckbox&&(this.newTabCheckbox.checked=e.openInNewTab),this.sizeSelect&&(this.sizeSelect.value=e.size),this.transformSelect&&(this.transformSelect.value=e.transform),this.previewImg&&e.previewUrl&&(this.previewImg.src=e.previewUrl))}#v=()=>{let e=this.#i;if(!e||!this.transformSelect)return;let t=this.transformSelect.value,n=++this.#a;e.transform=t,yl(e.assetId,t).then(t=>{!t||!this.isConnected||this.#i!==e||n!==this.#a||(e.previewUrl=t,this.previewImg&&(this.previewImg.src=t),this.requestUpdate())})};#y=()=>{let e=this.urlInput?.value??``;this.urlError=Oc(e),this.urlInput&&(this.urlInput.invalid=this.urlError!==null)};#b=()=>{let e=this.#r,t=this.#i;if(!e||!t)return;let n=this.urlInput?.value??``;if(this.urlError=Oc(n),this.urlInput&&(this.urlInput.invalid=this.urlError!==null),this.urlError){this.urlInput?.focus();return}let r={...t,alt:this.altInput?.value??``,title:this.titleInput?.value??``,linkUrl:n,openInNewTab:!!this.newTabCheckbox?.checked,size:this.sizeSelect?.value||`default`,transform:this.transformSelect?.value??t.transform};hl(e,{attrs:_l(r),preview:{assetId:r.assetId,url:r.previewUrl,label:r.alt||r.title||`Image`,transform:r.transform},focus:this.#o,replaceSelection:r.updating}),this.dialog?.hide(`submit`)};#x=e=>{e.target===this.dialog&&(this.#r=null,this.#i=null)}};F([c()],G.prototype,`dialogTitle`,null),F([c()],G.prototype,`submitLabel`,null),F([a()],G.prototype,`urlError`,null),F([e(`pk-dialog`)],G.prototype,`dialog`,null),F([e(`.image-dialog__alt`)],G.prototype,`altInput`,null),F([e(`.image-dialog__title`)],G.prototype,`titleInput`,null),F([e(`.image-dialog__url`)],G.prototype,`urlInput`,null),F([e(`pk-checkbox`)],G.prototype,`newTabCheckbox`,null),F([e(`.image-dialog__size`)],G.prototype,`sizeSelect`,null),F([e(`.image-dialog__transform`)],G.prototype,`transformSelect`,null),F([e(`.image-dialog__preview-img`)],G.prototype,`previewImg`,null),F([c({attribute:!1})],G.prototype,`transforms`,null),G=F([P(`vizy-image-dialog`)],G);async function Sl(e,t,n){await Vc(),(!xl||!xl.isConnected)&&(xl=document.createElement(`vizy-image-dialog`),document.body.append(xl),await xl.updateComplete),await xl.openForEditor(e,t,n)}function Cl(e,t,n){if(e.isActive(`image`)){let r=ml(e);if(r){Sl(e,r,{focus:n?.focus,transforms:t.transforms??[]});return}}wl(e,t,n)}function wl(e,t,n){let r=window.Craft;if(!r?.createElementSelectorModal)throw Error(`Craft element selector is not available in this environment.`);let i=(t.transforms??[]).filter(e=>e.handle&&e.name);t.defaultTransform,r.createElementSelectorModal(`craft\\elements\\Asset`,{storageKey:`${t.linkSelectorStorageKeyPrefix??`VizyInput`}.ChooseImage`,multiSelect:!1,sources:t.volumes,defaultSource:t.defaultSource??void 0,criteria:{siteId:t.elementSiteId,kind:`image`},transforms:i,closeOtherModals:!1,onSelect:(r,i)=>{Tl(e,t,r,i,n)}})}async function Tl(e,t,n,r,i){if(!n?.length)return;let[a]=n;if(!a.id){console.warn(`[vizy] Image select: asset has no id`);return}let o=El(a),s=a.url||``,c=a.label||``,l=a.label||``;if(!o||!U(o)){let e=await Dl(a.id,a.siteId??t.elementSiteId);if(!e?.uid||!U(e.uid)){console.warn(`[vizy] Image select: could not resolve asset uid`,a.id);return}o=e.uid,s=s||e.url||``,c=c||e.alt||e.title||``,l=l||e.title||``}let u=typeof r==`string`&&r?r:t.defaultTransform??``;if(u&&(!r||typeof r!=`string`)){let e=await Ol(a.id,u);e&&(s=e)}cl(o,{assetId:a.id,url:s,label:l||c||`Image`,transform:u}),await Sl(e,{assetUid:o,assetId:a.id,previewUrl:s,alt:c,title:l,linkUrl:``,openInNewTab:!1,size:`default`,transform:u,updating:!1},{focus:i?.focus,transforms:t.transforms??[]})}function El(e){if(typeof e.uid==`string`&&U(e.uid))return e.uid;let t=e.$element?.data?.(`uid`);if(typeof t==`string`&&U(t))return t;let n=e.$element?.attr?.(`data-uid`);return typeof n==`string`&&U(n)?n:null}async function Dl(e,t){let n=window.Craft;if(typeof n?.sendActionRequest!=`function`)return null;try{let r=await n.sendActionRequest(`POST`,`vizy/assets/info`,{data:{assetId:e,siteId:t}});return r.data?.uid?{uid:r.data.uid,url:r.data.url??null,title:r.data.title??``,alt:r.data.alt??``}:null}catch(e){return console.warn(`[vizy] Image select: asset info request failed`,e),null}}async function Ol(e,t){let n=window.Craft;if(!t||typeof n?.sendActionRequest!=`function`)return null;try{return(await n.sendActionRequest(`POST`,`assets/generate-transform`,{data:{assetId:e,handle:t}})).data.url??null}catch{return null}}var kl=/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i,Al=/(?:vimeo\.com\/(?:video\/)?)(\d+)/i;function jl(e){let t=e.trim();if(!t)return null;try{let e=/^https?:\/\//i.test(t)?t:`https://${t}`,n=new URL(e);return n.protocol!==`https:`&&n.protocol!==`http:`?null:(n.protocol===`http:`&&(n.protocol=`https:`),n.toString())}catch{return null}}function Ml(e){let t=jl(e);if(!t)return null;let n=t.match(kl);if(n?.[1]){let e=n[1];return{provider:`youtube`,url:t,resourceId:e,html:Nl(`https://www.youtube.com/embed/${encodeURIComponent(e)}`,`YouTube video`)}}let r=t.match(Al);if(r?.[1]){let e=r[1];return{provider:`vimeo`,url:t,resourceId:e,html:Nl(`https://player.vimeo.com/video/${encodeURIComponent(e)}`,`Vimeo video`)}}return{provider:`unknown`,url:t,resourceId:null,html:null}}function Nl(e,t){return`<div class="vizy-media-embed__frame" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;"><iframe src="${e}" title="${Pl(t)}" style="position:absolute;inset:0;width:100%;height:100%;border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`}function Pl(e){return e.replace(/&/g,`&amp;`).replace(/"/g,`&quot;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`)}var Fl=null,Il=class extends t{#e=`Insert Media Embed`;get dialogTitle(){return this.#e}set dialogTitle(e){this.#e=e}#t=`Insert`;get submitLabel(){return this.#t}set submitLabel(e){this.#t=e}#n=null;#r={kind:`mediaEmbed`,url:``,updating:!1};#i=!0;#a=`vizy-url-node-${Math.random().toString(36).slice(2,9)}`;#o=null;get dialog(){return this.#o}set dialog(e){this.#o=e}#s=null;get urlInput(){return this.#s}set urlInput(e){this.#s=e}#c=null;get submitButton(){return this.#c}set submitButton(e){this.#c=e}static styles=o`
        :host { display: contents; }
        .fields {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
    `;async openForEditor(e,t,n){await Vc(),this.#n=e,this.#r={...t},this.#i=n?.focus??!0;let r=t.kind===`iframe`?`iFrame`:`Media Embed`;this.dialogTitle=t.updating?`Edit ${r}`:`Insert ${r}`,this.submitLabel=t.updating?`Update`:`Insert`,await this.updateComplete,this.#l(),await this.dialog?.updateComplete,await this.dialog?.show()}render(){return n`
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
        `}#l(){this.urlInput&&(this.urlInput.value=this.#r.url??``),this.#u()}#u(){let e=!!jl(this.urlInput?.value??``);this.submitButton&&(this.submitButton.disabled=!e)}#d=()=>{this.#u()};#f=e=>{e.key===`Enter`&&(e.preventDefault(),e.stopPropagation(),this.#p())};#p=()=>{let e=this.#n,t=jl(this.urlInput?.value??``);if(!e||!t)return;let n=this.#i?e.chain().focus():e.chain(),r=this.#r.updating&&e.isActive(this.#r.kind);if(this.#r.kind===`iframe`)r?n.updateAttributes(`iframe`,{url:t,frameborder:0,allowfullscreen:!0}).run():n.setVizyIframe({url:t}).run();else{let e=Ml(t);if(!e)return;let i={url:e.url,data:e.html?{html:e.html}:null};r?n.updateAttributes(`mediaEmbed`,i).run():n.setVizyMediaEmbed({url:e.url}).run()}this.dialog?.hide(`submit`)};#m=()=>{this.#n=null}};F([c()],Il.prototype,`dialogTitle`,null),F([c()],Il.prototype,`submitLabel`,null),F([e(`pk-dialog`)],Il.prototype,`dialog`,null),F([e(`.url-node-dialog__url`)],Il.prototype,`urlInput`,null),F([e(`.url-node-dialog__submit`)],Il.prototype,`submitButton`,null),Il=F([P(`vizy-url-node-dialog`)],Il);async function Ll(e,t,n){await Vc(),(!Fl||!Fl.isConnected)&&(Fl=document.createElement(`vizy-url-node-dialog`),document.body.append(Fl),await Fl.updateComplete),await Fl.openForEditor(e,t,n)}function Rl(e,t){if(!e.isActive(t))return null;let n=e.getAttributes(t);return{kind:t,url:typeof n.url==`string`?n.url:``,updating:!0}}function zl(e,t,n){let r=n?.focus??!0?e.chain().focus():e.chain(),{selection:i}=e.state;if(i instanceof O&&i.node.type.name===t){r.deleteSelection().run();return}if(e.isActive(t)){let n=i.$from.before(i.$from.depth);e.state.doc.nodeAt(n)?.type.name===t&&r.setNodeSelection(n).deleteSelection().run()}}function Bl(e,t,n){if(e.isActive(t)){let r=Rl(e,t);if(r){Ll(e,r,{focus:n?.focus});return}}Ll(e,{kind:t,url:``,updating:!1},{focus:n?.focus})}var Vl=new Jn;function Hl(e,t={}){if(!e.schema.nodes.layout||!e.schema.nodes.column)return!1;if(e.isActive(`layout`)){let n=t.focus?e.chain().focus():e.chain();return typeof n.unwrapLayout==`function`&&n.unwrapLayout().run()}let{from:n}=e.state.selection;if(ht(e.state.doc,n))return!1;let r=t.presets?.length?t.presets:pt;if(r.length===1)return Ul(e,r[0],t.focus);let i=e.view.dom.closest(`.vizy-editor-surface`)?.parentElement??e.view.dom.parentElement;if(!i)return!1;let a=t.invoker?.getBoundingClientRect()??(()=>{let t=e.view.coordsAtPos(n);return new DOMRect(t.left,t.top,1,t.bottom-t.top)})();return Vl.open(a,r,i,{returnFocus:t.invoker??e.view.dom,onSelect:t=>{let n=Dt(r,t);n&&Ul(e,n,!0)}}),!0}function Ul(e,t,n){n&&e.view.focus();let r=()=>crypto.randomUUID(),{from:i,to:a}=e.state.selection;return e.state.selection instanceof O||Bt(e,i,a)?ut(e,i,a,t,r):lt(e,t,i,r)}var Wl={rows:3,cols:3,withHeaderRow:!0};function Gl(e,t,n){let r=n?.focus??e.view.hasFocus(),i=n?.controlId?Yt(n.controlId):void 0;if(i)return r&&e.chain().focus().run(),i.run(e)!==!1;if(t.command===`registeredControl`)return!1;if(t.command===`setLink`)return Zc(e,`link`,{focus:r}),!0;if(t.command===`insertNode`&&t.nodeName===`image`)return Cl(e,n?.imageAuthoring??{},{focus:r}),!0;if(t.command===`insertNode`&&(t.nodeName===`iframe`||t.nodeName===`mediaEmbed`))return Bl(e,t.nodeName,{focus:r}),!0;if(t.command===`wrapInLayout`)return Hl(e,{focus:r,presets:n?.layoutPresets,invoker:n?.invoker});let a=r?e.chain().focus():e.chain();switch(t.command){case`toggleMark`:return a.toggleMark(t.markName).run(),!0;case`setParagraph`:return a.setParagraph().run(),!0;case`setHeading`:return $l(t.level)?(a.toggleHeading({level:t.level}).run(),!0):!1;case`toggleNode`:return ql(a,t.nodeName);case`insertNode`:return Jl(e,t.nodeName,r);case`setTextAlign`:return e.isActive({textAlign:t.align})?(a.unsetTextAlign().run(),!0):(a.setTextAlign(t.align).run(),!0);case`clearFormatting`:return a.unsetAllMarks().clearNodes().run(),!0;case`openAddBlock`:return!1;case`undo`:return a.undo().run(),!0;case`redo`:return a.redo().run(),!0;case`tableOperation`:return Kl(a,t.operation);default:return!1}}function Kl(e,t){let n=e[t];return typeof n==`function`&&n.call(e).run()}function ql(e,t){switch(t){case`heading`:return e.toggleHeading({level:2}).run(),!0;case`bulletList`:return e.toggleBulletList().run(),!0;case`orderedList`:return e.toggleOrderedList().run(),!0;case`blockquote`:return e.toggleBlockquote().run(),!0;case`codeBlock`:return e.toggleCodeBlock().run(),!0;default:return!1}}function Jl(e,t,n){let r=n?e.chain().focus():e.chain();if(t===`horizontalRule`)return r.setHorizontalRule().run();if(t===`table`)return r.insertTable(Wl).run();if(t===`hardBreak`)return r.setHardBreak().run();let i=e.schema.nodes[t];if(!i)return!1;try{let e=i.createAndFill();return e?r.insertContent(e.toJSON()).run():!1}catch{return!1}}function Yl(e){if(Yt(e.id))return!0;let t=e.action;return t?t.command===`toggleNode`?Zl.includes(t.nodeName):t.command===`setHeading`?$l(t.level):Ql.includes(t.command):!1}function Xl(e,t,n){let r=n?Yt(n):void 0;if(r?.isActive)return!!r.isActive(e);if(!t)return!1;switch(t.command){case`toggleMark`:return e.isActive(t.markName);case`setLink`:return e.isActive(`link`);case`insertNode`:return t.nodeName===`image`?e.isActive(`image`):t.nodeName===`iframe`?e.isActive(`iframe`):t.nodeName===`mediaEmbed`&&e.isActive(`mediaEmbed`);case`toggleNode`:return e.isActive(t.nodeName);case`setParagraph`:return e.isActive(`paragraph`);case`setHeading`:return e.isActive(`heading`,{level:t.level});case`setTextAlign`:return e.isActive({textAlign:t.align});case`wrapInLayout`:return e.isActive(`layout`);default:return!1}}var Zl=[`heading`,`bulletList`,`orderedList`,`blockquote`,`codeBlock`],Ql=[`toggleNode`,`insertNode`,`toggleMark`,`setParagraph`,`setHeading`,`setLink`,`setTextAlign`,`clearFormatting`,`undo`,`redo`,`wrapInLayout`,`openAddBlock`,`tableOperation`];function $l(e){return Number.isInteger(e)&&e>=1&&e<=6}var eu=o`
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
`;function tu(e){return e.icon?n`${C(e.icon)}`:e.abbr?n`<span class="abbr">${e.abbr}</span>`:e.label}function nu(){return n`<span class="chevron" aria-hidden="true">${C(on)}</span>`}function ru(e,t=``){return[`vizy-control`,!e.icon&&!e.abbr?`is-text`:``,t].filter(Boolean).join(` `)}var iu=200,au=0;function ou(e,t){typeof e[t]==`function`&&e[t]()}function su(e){let t=e.shadowRoot;if(!t)return()=>{};let n=document.createElement(`pk-tooltip`);n.setAttribute(`trigger`,`manual`),n.setAttribute(`placement`,`top`),t.append(n);let r=null,i=()=>{r!==null&&(window.clearTimeout(r),r=null)},a=e=>e instanceof Element?e.closest(`.vizy-control`):null,o=e=>{let t=a(e.target);if(!t)return;let o=t.getAttribute(`aria-label`)?.trim();o&&(i(),r=window.setTimeout(()=>{r=null,t.isConnected&&(t.id||=`vizy-tb-${++au}`,n.for=t.id,n.content=o,ou(n,`show`))},iu))},s=e=>{a(e.target)&&(a(e.relatedTarget)||(i(),ou(n,`hide`)))},c=()=>{i(),ou(n,`hide`)};return t.addEventListener(`pointerover`,o),t.addEventListener(`pointerout`,s),t.addEventListener(`pointerdown`,c),()=>{i(),t.removeEventListener(`pointerover`,o),t.removeEventListener(`pointerout`,s),t.removeEventListener(`pointerdown`,c),ou(n,`hide`),n.remove()}}var cu=class extends t{#e=[];get controls(){return this.#e}set controls(e){this.#e=e}#t=null;get editor(){return this.#t}set editor(e){this.#t=e}#n=!1;get canAddBlock(){return this.#n}set canAddBlock(e){this.#n=e}#r=!0;get addBlockNeedsMenu(){return this.#r}set addBlockNeedsMenu(e){this.#r=e}#i=null;get addBlockDirectLabel(){return this.#i}set addBlockDirectLabel(e){this.#i=e}#a=!1;get addBlockOpen(){return this.#a}set addBlockOpen(e){this.#a=e}#o={};get linkAuthoring(){return this.#o}set linkAuthoring(e){this.#o=e}#s={};get imageAuthoring(){return this.#s}set imageAuthoring(e){this.#s=e}#c=[];get layoutPresets(){return this.#c}set layoutPresets(e){this.#c=e}#l=null;#u=null;#d=!1;#f=new Set;#p=!1;#m=!1;#h=!1;static styles=[eu,o`
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
        `];connectedCallback(){super.connectedCallback(),document.addEventListener(`keydown`,this.#P),document.addEventListener(`pointerdown`,this.#j,!0)}firstUpdated(){this.#l=su(this)}updated(e){e.has(`editor`)&&this.#T()}disconnectedCallback(){document.removeEventListener(`keydown`,this.#P),document.removeEventListener(`pointerdown`,this.#j,!0),this.#l?.(),this.#l=null,this.#u?.(),this.#u=null,this.#f.clear(),this.#p=!1,this.#N(),super.disconnectedCallback()}render(){let e=this.#_();return e.length?n`
            <div role="toolbar" aria-label="Formatting">
                ${e.map(e=>this.#y(e))}
            </div>
        `:null}#g(e,t){let n=t.currentTarget;n instanceof HTMLElement&&this.dispatchEvent(new CustomEvent(`vizy-toolbar-ui`,{detail:{action:e,invoker:n,hadEditorFocus:this.#m||bn(this.editor)},bubbles:!0,composed:!0}))}#_(){let e=this.controls.filter(e=>this.#v(e)),t=[];for(let n of e){if(n.presentation===`separator`){if(!t.length||t[t.length-1]?.presentation===`separator`)continue;t.push(n);continue}t.push(n)}return t.at(-1)?.presentation===`separator`&&t.pop(),t}#v(e){return e.presentation===`separator`?!0:e.action?.command===`openAddBlock`?this.canAddBlock:e.kind===`group`?(e.items??[]).some(e=>this.#v(e)):Yl(e)}#y(e){if(e.presentation===`separator`)return n`<span class="vizy-separator" role="separator"></span>`;if(e.kind===`group`){let t=(e.items??[]).filter(e=>this.#v(e));return t.length?this.#x(e,t):r}if(!this.#v(e))return r;if(e.action?.command===`setLink`)return this.#b(e);let t=e.action?.command===`openAddBlock`,i=t&&this.addBlockNeedsMenu,a=t&&this.addBlockDirectLabel?this.addBlockDirectLabel:e.label;return n`
            <button
                type="button"
                class=${ru(e,i?`has-menu`:``)}
                aria-label=${a}
                aria-pressed=${t?r:String(this.#D(e))}
                aria-expanded=${i?String(this.addBlockOpen):r}
                data-vizy-toolbar-add-block=${t?``:r}
                data-vizy-invoker-key=${t?`toolbar-plus`:r}
                @mousedown=${this.#O}
                @click=${t=>this.#k(e,t)}
                >${t?n`<pk-icon icon="plus" label=""></pk-icon>`:tu(e)}${i?nu():r}</button>
        `}#b(e){let t=el(this.linkAuthoring),i=this.#D(e),a=()=>this.#m||this.#h,o=async(e,t)=>{let n=e.currentTarget;await(n instanceof HTMLElement?n.closest(`pk-dropdown-menu`):null)?.whenClosed?.(),t()};return n`
            <pk-dropdown-menu
                size="sm"
                placement="bottom-start"
                @pk-open-change=${this.#A}
            >
                <button
                    type="button"
                    slot="trigger"
                    class=${ru(e,`has-menu`)}
                    aria-label=${e.label}
                    aria-pressed=${String(i)}
                    @mousedown=${this.#O}
                >${tu(e)}${nu()}</button>
                ${t.map((e,t)=>n`
                    <pk-dropdown-item
                        value=${`craft-link:${t}`}
                        @click=${t=>{o(t,()=>{this.editor&&tl(this.editor,e,this.linkAuthoring,{focus:a()})})}}
                    >${e.optionTitle}</pk-dropdown-item>
                `)}
                ${t.length>0?n`<pk-dropdown-separator></pk-dropdown-separator>`:r}
                <pk-dropdown-item
                    value="insert-link"
                    @click=${e=>{o(e,()=>{this.editor&&Qc(this.editor,{focus:a()})})}}
                >${i?`Edit Link`:`Insert Link`}</pk-dropdown-item>
                <pk-dropdown-item
                    value="unlink"
                    ?disabled=${!i}
                    @click=${()=>{!this.editor||!i||($c(this.editor,{focus:a()}),this.requestUpdate())}}
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
                    class=${ru(e,`has-menu`)}
                    aria-label=${e.label}
                    @mousedown=${this.#O}
                >${tu(e)}${nu()}</button>
                ${a.map(t=>n`
                    <pk-dropdown-item
                        value=${t.id}
                        type=${i?`radio`:`normal`}
                        radio-group=${i?e.id:r}
                        ?checked=${i&&this.#D(t)}
                        ?disabled=${this.#C(e,t)}
                    >
                        ${t.icon?n`<span slot="start" class="menu-icon">${tu(t)}</span>`:r}
                        <span class="preview-label" data-preview=${t.preview??r}>${t.label}</span>
                    </pk-dropdown-item>
                `)}
            </pk-dropdown-menu>
        `}#S(e,t){if(!this.#w(e))return t;let n=t.filter(e=>e.id===`table`),r=t.filter(e=>e.id!==`table`);return this.editor?.isActive(`table`)?r.length>0?r:t:n.length>0?n:r}#C(e,t){return!this.#w(e)||t.id===`table`?!1:!this.editor?.isActive(`table`)}#w(e){return e.id===`dropdown:table`||e.id.endsWith(`:table`)}#T(){this.#u?.(),this.#u=null;let e=this.editor;if(!e)return;let t=()=>{this.requestUpdate()};e.on(`selectionUpdate`,t),this.#u=()=>{e.off(`selectionUpdate`,t)}}#E(e){let t=e.id.toLowerCase();return t.includes(`formatting`)||t.includes(`alignment`)||t.includes(`align`)}#D(e){return this.editor?Xl(this.editor,e.action,e.id):!1}#O=e=>{this.#m=bn(this.editor),vn(e)};#k(e,t){if(!e.action)return;if(e.action.command===`openAddBlock`){t?.currentTarget instanceof HTMLElement&&this.#g(`insert-block`,t);return}if(!this.editor)return;let n=this.#f.size>0?this.#h:this.#m,r=t?.currentTarget instanceof HTMLElement?t.currentTarget:null;Gl(this.editor,e.action,{focus:n,imageAuthoring:this.imageAuthoring,layoutPresets:this.layoutPresets,invoker:r,controlId:e.id}),this.requestUpdate()}#A=e=>{let t=e.currentTarget;if(!(t instanceof HTMLElement))return;if(e.detail?.open){this.#f.add(t),this.#p=!1,this.#h=this.#m||bn(this.editor),this.#h&&this.#M();return}if(!this.#f.delete(t)||this.#f.size>0)return;let n=!this.#p&&this.#h;this.#p=!1,this.#h=!1,this.#N(),n&&Sn(this.editor)};#j=e=>{if(this.#f.size===0)return;let t=e.composedPath();if([...this.#f].some(e=>t.includes(e))){t.some(e=>e instanceof HTMLElement&&e.getAttribute(`slot`)===`trigger`)&&(this.#p=!0);return}this.#p=!0};#M(){if(this.#d||!this.editor)return;let e=pn(this.editor.view.dom);e&&(mn(e,!0),this.#d=!0)}#N(){if(!this.#d||!this.editor){this.#d=!1;return}mn(pn(this.editor.view.dom),!1),this.#d=!1}#P=e=>{e.key===`Escape`&&(!this.shadowRoot?.querySelector(`pk-dropdown-menu[open], pk-dropdown-menu[aria-expanded="true"]`)||!this.#h||Sn(this.editor))}};F([c({attribute:!1})],cu.prototype,`controls`,null),F([c({attribute:!1})],cu.prototype,`editor`,null),F([c({type:Boolean,attribute:!1})],cu.prototype,`canAddBlock`,null),F([c({type:Boolean,attribute:!1})],cu.prototype,`addBlockNeedsMenu`,null),F([c({type:String,attribute:!1})],cu.prototype,`addBlockDirectLabel`,null),F([c({type:Boolean,attribute:!1})],cu.prototype,`addBlockOpen`,null),F([c({attribute:!1})],cu.prototype,`linkAuthoring`,null),F([c({attribute:!1})],cu.prototype,`imageAuthoring`,null),F([c({attribute:!1})],cu.prototype,`layoutPresets`,null),cu=F([P(`vizy-toolbar`)],cu);var lu=10,uu=8,du=class extends t{#e=[];get controls(){return this.#e}set controls(e){this.#e=e}#t=null;get editor(){return this.#t}set editor(e){this.#t=e}#n=!1;get visible(){return this.#n}set visible(e){this.#n=e}#r=null;#i=null;#a={getClientRect:null,contextElement:void 0};static styles=[eu,o`
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
        `];syncToSelection(e){if(!this.controls.length){this.hide();return}this.#a.getClientRect=e.getClientRect,this.#a.contextElement=e.contextElement,this.#o(),this.visible=!0,this.#i&&(this.#i.active=!0,this.#i.reposition())}hide(){this.visible=!1,this.#i&&(this.#i.active=!1)}firstUpdated(){this.#r=su(this)}disconnectedCallback(){this.#r?.(),this.#r=null;let e=this.#i;this.#i=null,e?.isConnected&&(e.active=!1,e.remove()),super.disconnectedCallback()}render(){return!this.visible||!this.controls.length?null:n`
            <div
                class="panel"
                role="toolbar"
                aria-label="Selection formatting"
            >
                ${this.controls.map(e=>n`
                    <button
                        type="button"
                        class=${ru(e)}
                        aria-label=${e.label}
                        aria-pressed=${String(this.#c(e))}
                        @mousedown=${e=>e.preventDefault()}
                        @click=${()=>this.#l(e)}
                    >${tu(e)}</button>
                `)}
            </div>
        `}#o(){if(this.#i)return;let e=document.createElement(`pk-popup`);e.className=`vizy-bubble-popup`,e.placement=`top`,e.distance=uu,e.flip=!0,e.flipPadding=this.#s(),e.shift=!0,e.shiftPadding=lu,e.anchorTracking=!0,e.positionMethod=`fixed`;let t=this.#a;e.anchor={getBoundingClientRect:()=>t.getClientRect?.()??new DOMRect,get contextElement(){return t.contextElement}},e.append(this),document.body.append(e),this.#i=e}#s(){let e=getComputedStyle(document.documentElement).getPropertyValue(`--header-height`).trim(),t=Number.parseFloat(e);return!Number.isFinite(t)||t<=0?lu:Math.max(lu,Math.round(t)+8)}#c(e){return this.editor?Xl(this.editor,e.action,e.id):!1}#l(e){!this.editor||!e.action||(Gl(this.editor,e.action,{controlId:e.id}),this.requestUpdate())}};F([c({attribute:!1})],du.prototype,`controls`,null),F([c({attribute:!1})],du.prototype,`editor`,null),F([c({type:Boolean,reflect:!0})],du.prototype,`visible`,null),du=F([P(`vizy-bubble`)],du);var fu={selected:!1,editing:!1,expanded:!0,dragging:!1,dropTarget:`none`,menuOpen:!1,fieldLayout:`unmounted`},pu=`Vizy.collapsedBlocks`;function mu(){let e=window.Craft?.systemUid;return`${typeof e==`string`&&e!==``?`Craft-${e}`:`Craft`}.${pu}`}function hu(){if(typeof localStorage>`u`)return[];try{let e=localStorage.getItem(mu());return e?e.split(`,`).map(e=>e.trim()).filter(Boolean):[]}catch{return[]}}function gu(e){if(!(typeof localStorage>`u`))try{localStorage.setItem(mu(),e.join(`,`))}catch{}}function _u(e){return e?hu().includes(e):!1}function vu(e){if(!e)return;let t=hu();t.includes(e)||(t.push(e),gu(t))}function yu(e){if(!e)return;let t=hu(),n=t.filter(t=>t!==e);n.length!==t.length&&gu(n)}var bu=class{#e=new Map;get(e){let t=this.#e.get(e);if(!t){let n=_u(e);t={collapsed:n,editingFields:!1,activeTabUid:null,view:{...fu,expanded:!n},summary:null},this.#e.set(e,t)}return t}update(e,t){let n=this.get(e);return t.view&&Object.assign(n.view,t.view),t.summary!==void 0&&(n.summary=t.summary),t.collapsed!==void 0&&(n.collapsed=t.collapsed,n.view.expanded=!t.collapsed),t.editingFields!==void 0&&(n.editingFields=t.editingFields,n.view.editing=t.editingFields),t.activeTabUid!==void 0&&(n.activeTabUid=t.activeTabUid),n}reconcile(e){for(let t of this.#e.keys())e.has(t)||this.#e.delete(t)}clear(){this.#e.clear()}},xu=class{#e=new Map;ensure(e,t=``,n=null,r=null){let i=this.#e.get(e);if(i&&(i.blockTypeUid!==t||i.fieldLayoutUid!==n||i.fieldLayoutHash!==r)&&(this.dispose(e),i=void 0),!i){let a=document.createElement(`div`);a.dataset.vizyFieldHost=``,a.contentEditable=`false`,i={blockUid:e,blockTypeUid:t,fieldLayoutUid:n,fieldLayoutHash:r,status:`idle`,root:a,abortController:null,requestId:null,requestKey:null,response:null,errorMessage:null,capturedValues:new Map,pending:null,disposals:[],attachedViewCount:0,removed:!1},this.#e.set(e,i)}return i.removed=!1,i}acquire(e,t=``,n=null,r=null){let i=this.ensure(e,t,n,r);return i.attachedViewCount+=1,i}roots(e){let t=this.#e.get(e);return t?[t.root]:[]}releaseView(e){let t=this.#e.get(e);t&&(t.attachedViewCount=Math.max(0,t.attachedViewCount-1))}get(e){return this.#e.get(e)}reconcile(e){for(let[t,n]of this.#e)e.has(t)||(n.removed=!0,this.dispose(t))}dispose(e){let t=this.#e.get(e);if(t&&(this.#e.delete(e),t.status!==`disposed`)){t.status=`disposed`,t.abortController?.abort();for(let e of t.disposals.splice(0))e();t.root.remove()}}destroy(){for(let e of[...this.#e.keys()])this.dispose(e)}},Su=`:scope > .flex-fields`;function Cu(e){let t=[...e.querySelectorAll(Su)];return t.forEach((e,t)=>{e instanceof HTMLElement&&(e.dataset.vizyLayoutTabIndex=String(t))}),t.length}function wu(e,t,n){for(let n of e.root.querySelectorAll(Su)){if(!(n instanceof HTMLElement))continue;let e=Number(n.dataset.vizyLayoutTabIndex??`0`);n.classList.toggle(`hidden`,e!==t)}}var Tu=new Set,Eu=new Set;function Du(e){return e.replace(/&/g,`&amp;`)}function Ou(){if(Tu.size)return Tu;for(let e of document.querySelectorAll(`link[href]`))Tu.add(Du(e.href));return Tu}function ku(){if(Eu.size)return Eu;for(let e of document.querySelectorAll(`script[src]`))Eu.add(Du(e.src));return Eu}function Au(e){let t=e.trim();if(!t)return[];let n=window.jQuery;if(typeof n?.parseHTML==`function`)return n.parseHTML(t,document,!0)??[];let r=document.createElement(`template`);return r.innerHTML=t,[...r.content.childNodes]}function ju(e){let t=e.href;if(!t)return;let n=Du(t),r=Ou();r.has(n)||(r.add(n),document.head.appendChild(e))}function Mu(e,t){let n=e.getAttribute(`src`);if(n){let r=Du(e.src||n),i=ku();if(i.has(r))return;i.add(r);let a=document.createElement(`script`);for(let t of Array.from(e.attributes))a.setAttribute(t.name,t.value);t.appendChild(a);return}let r=document.createElement(`script`);for(let t of Array.from(e.attributes))r.setAttribute(t.name,t.value);r.textContent=e.textContent,t.appendChild(r)}function Nu(e,t=document.body){if(!e?.trim())return;let n=Au(e);for(let e of n){if(!(e instanceof Element)){t.appendChild(e);continue}if(e.nodeName===`LINK`&&e.rel===`stylesheet`){ju(e);continue}if(e.nodeName===`SCRIPT`){Mu(e,t);continue}if(e.nodeName===`STYLE`||e.nodeName===`LINK`){document.head.appendChild(e);continue}t.appendChild(e)}}var Pu=`dismissedTips`,Fu=`data-vizy-tip-uid`;function Iu(){let e=window.Craft;if(typeof e?.getLocalStorage==`function`){let t=e.getLocalStorage(Pu,[]);return Array.isArray(t)?t.filter(e=>typeof e==`string`):[]}try{let e=window.Craft?.systemUid??``,t=localStorage.getItem(`Craft-${e}.${Pu}`);if(!t)return[];let n=JSON.parse(t);return Array.isArray(n)?n.filter(e=>typeof e==`string`):[]}catch{return[]}}function Lu(e){let t=window.Craft,n=Iu();if(n.includes(e))return;let r=[...n,e];if(typeof t?.setLocalStorage==`function`){t.setLocalStorage(Pu,r);return}try{let e=window.Craft?.systemUid??``;localStorage.setItem(`Craft-${e}.${Pu}`,JSON.stringify(r))}catch{}}function Ru(e){let t=e.getAttribute(Fu);if(t)return t;let n=e.getAttribute(`data-layout-element`);if(n&&n!==`true`&&n!==`1`)return n;for(let t of e.querySelectorAll(`script`)){let e=t.textContent?.match(/\.includes\('([^']+)'\)/);if(e?.[1])return e[1]}return null}function zu(e){return!!e.querySelector(`.pane.dismissible`)}function Bu(e){let t=new Set(Iu());for(let n of[...e.querySelectorAll(`[data-layout-element]`)]){if(!zu(n))continue;let e=Ru(n);e&&n.setAttribute(Fu,e);for(let e of[...n.querySelectorAll(`script`)])e.textContent?.includes(`dismissedTips`)&&e.remove();e&&t.has(e)&&n.remove()}}function Vu(e){Bu(e);let t=t=>{let n=t.target;if(!(n instanceof Element))return;let r=n.closest(`.tip-dismiss-btn`);if(!r||!e.contains(r))return;t.preventDefault(),t.stopPropagation();let i=r.closest(`[data-layout-element]`);if(!i||!e.contains(i)||!zu(i))return;let a=Ru(i);i.remove(),a&&Lu(a)};return e.addEventListener(`click`,t),()=>e.removeEventListener(`click`,t)}var Hu=class extends Error{code;authorMessage;constructor(e,t){let n=(t??``).trim()||Uu(e);super(n),this.name=`FieldLayoutMountError`,this.code=e,this.authorMessage=n}};function Uu(e){switch(e){case`unsupportedFieldCapability`:return`This Block includes a field type Vizy cannot render inside Blocks yet.`;case`fieldLayoutRenderFailed`:return`This Block’s fields failed to render.`;case`unknownBlockType`:return`This Block’s type is missing or no longer allowed on this field.`;case`staleLayout`:return`This Block’s field layout is missing. Re-save the Block Type.`;case`staleFieldLayoutResponse`:return`This Block’s fields went out of date while loading. Try Retry.`;case`fieldLayoutRejected`:case`missingBatchResult`:case`invalidBlock`:case`invalidDestination`:case`staleBlockHash`:return`This Block could not load its fields. Reload the page and try again.`;case`fieldHostDisconnected`:return`This Block’s fields could not initialize. Reload the page and try again.`;case`loaderDestroyed`:case`blockRemoved`:return`This Block was removed before its fields finished loading.`;default:return e.startsWith(`fieldLayoutRequest:`)?`This Block could not load its fields (HTTP ${e.slice(19)}).`:`This Block could not load its fields (${e}).`}}function Wu(e){if(e instanceof Hu)return e.authorMessage;if(e instanceof Error){let t=e.message.trim();return t?/^[a-zA-Z][a-zA-Z0-9]+$/.test(t)||t.startsWith(`fieldLayoutRequest:`)?Uu(t):t:Uu(`fieldLayoutRejected`)}return String(e)}var Gu=new Set,Ku=new TextEncoder,qu=25,Ju=180;async function Yu(e){let t=(e,t)=>{let n=Ku.encode(e),r=Ku.encode(t);for(let e=0;e<Math.min(n.length,r.length);e++)if(n[e]!==r[e])return n[e]-r[e];return n.length-r.length},n=e=>Array.isArray(e)?`[${e.map(n).join(`,`)}]`:e&&typeof e==`object`?`{${Object.entries(e).filter(([,e])=>e!==void 0).sort(([e],[n])=>t(e,n)).map(([e,t])=>`${JSON.stringify(e)}:${n(t)}`).join(`,`)}}`:JSON.stringify(e)??`null`,r=n(e),i=await crypto.subtle.digest(`SHA-256`,Ku.encode(r));return[...new Uint8Array(i)].map(e=>e.toString(16).padStart(2,`0`)).join(``)}var Xu=class{hosts;manifest;contextToken;findBlock;onMounted;constructor(e,t,n,r,i){this.hosts=e,this.manifest=t,this.contextToken=n,this.findBlock=r,this.onMounted=i}#e=[];#t=null;#n=new Set;#r=new Map;#i=new Set;#a=new Map;#o=new Map;#s=new Map;#c=!1;destroy(){this.#c=!0,this.#t!==null&&window.clearTimeout(this.#t),this.#t=null,this.#r.clear(),this.#a.clear();for(let e of this.#o.values())window.clearTimeout(e);this.#o.clear();for(let e of this.#s.values())e.abort();this.#s.clear();for(let e of this.#n)e.abort();this.#n.clear();for(let e of this.#e.splice(0))e.reject(Error(`loaderDestroyed`))}async prefetchNewBlock(e){await this.prefetchNewBlocks([e])}async prefetchNewBlocks(e){if(this.#c)throw Error(`loaderDestroyed`);let t=e.filter(e=>!!this.manifest.blockTypes[e.blockTypeUid]?.fieldLayoutUid);if(!t.length)return;let n=await Promise.all(t.map(async e=>({item:e,blockHash:await Yu(e.block),requestId:crypto.randomUUID()})));for(let e=0;e<n.length;e+=qu){let t=n.slice(e,e+qu),r=new AbortController;this.#n.add(r);try{let e=await this.#p({editorContextToken:this.contextToken,items:t.map(({item:e,blockHash:t,requestId:n})=>({requestId:n,documentRevision:e.documentRevision,blockHash:t,block:e.block,destination:e.destination}))},r.signal),n=new Map(e.results.map(e=>[e.requestId,e]));for(let{item:e,requestId:r}of t){let t=n.get(r);if(!t||t.ok===!1)throw new Hu((t&&t.ok===!1?t.error:null)??`fieldLayoutRejected`,t&&t.ok===!1?t.message:null);this.#a.set(e.blockUid,t)}}finally{this.#n.delete(r)}}}discardPrefetchedBlocks(e){for(let t of e)this.#a.delete(t)}open(e){let t=this.hosts.get(e);if(!t||t.status===`disposed`)return Promise.reject(Error(`blockRemoved`));if(t.status===`mounted`)return Promise.resolve(t);if(t.status===`loading`&&t.pending){let n=this.findBlock(e);if(!n)return Promise.reject(Error(`blockRemoved`));let r=`${e}:${n.revision}`,i=this.#r.get(r);if(i?.record===t)return i.promise;if(t.requestKey?.startsWith(`${n.revision}:`))return t.pending}let n=this.#a.get(e);if(n){this.#a.delete(e);let r=this.#g(t,n);return t.pending=r.finally(()=>{t.pending===r&&(t.pending=null)}),t.pending}let r=this.findBlock(e);if(!r)return Promise.reject(Error(`blockRemoved`));let i=`${e}:${r.revision}`,a=this.#r.get(i);if(a?.record===t)return a.promise;t.status=`loading`,t.errorMessage=null;let o=this.#l(e).finally(()=>{this.#r.get(i)?.promise===o&&this.#r.delete(i)});return this.#r.set(i,{record:t,promise:o}),o}retry(e){let t=this.hosts.get(e);if(!t||t.status===`disposed`)return Promise.reject(Error(`blockRemoved`));if(t.status===`mounted`)return Promise.resolve(t);t.abortController?.abort(),t.abortController=null,t.pending=null,t.requestId=null,t.requestKey=null,t.errorMessage=null,t.status=`idle`;let n=this.findBlock(e);return n&&this.#r.delete(`${e}:${n.revision}`),this.open(e)}scheduleRefresh(e){if(this.#c)return;let t=this.hosts.get(e);if(t?.status!==`mounted`||!t.response?.refreshable)return;let n=this.#o.get(e);n!==void 0&&window.clearTimeout(n),this.#s.get(e)?.abort(),this.#o.set(e,window.setTimeout(()=>{this.#o.delete(e),this.#h(e)},Ju))}async#l(e){let t=this.hosts.get(e),n=this.findBlock(e);if(!t||!n||t.status===`disposed`)throw Error(`blockRemoved`);if(t.status===`mounted`)return t;let r=n.node.toJSON(),i=Yu(r);this.#i.add(i);let a;try{a=await i}finally{this.#i.delete(i)}if(this.#c||this.hosts.get(e)!==t)throw Error(`blockRemoved`);let o=this.manifest.blockTypes[String(n.node.attrs.blockTypeUid)];if(!o?.fieldLayoutUid)return t;let s=`${n.revision}:${a}:${o.fieldLayoutUid}:${o.fieldLayoutHash??``}`;if(t.status===`loading`&&t.requestKey===s&&t.pending)return t.pending;t.abortController?.abort();let c=new AbortController,l=crypto.randomUUID();return t.status=`loading`,t.abortController=c,t.requestId=l,t.requestKey=s,t.pending=this.#u({blockUid:e,requestId:l,blockHash:a,record:t,payload:{requestId:l,documentRevision:n.revision,blockHash:a,block:r,destination:n.destination}}).then(n=>{let r=this.findBlock(e),i=this.manifest.blockTypes[String(r?.node.attrs.blockTypeUid)];if(t.status===`disposed`||t.requestId!==n.requestId||!r||n.blockUid!==e||n.blockTypeUid!==String(r.node.attrs.blockTypeUid)||n.documentRevision!==r.revision||n.blockHash!==a||n.fieldLayoutUid!==i?.fieldLayoutUid||n.fieldLayoutHash!==i?.fieldLayoutHash)throw Error(`staleFieldLayoutResponse`);return this.#g(t,n)}).catch(n=>{throw t.status!==`disposed`&&t.requestId===l&&!c.signal.aborted&&(t.status=`failed`,t.errorMessage=Wu(n),console.error(`[Vizy] FieldLayout failed for block ${e}`,n)),n}).finally(()=>{t.requestId===l&&(t.pending=null)}),t.pending}#u(e){return new Promise((t,n)=>{if(this.#c){n(Error(`loaderDestroyed`));return}this.#e.push({...e,resolve:t,reject:n}),this.#t===null&&(this.#t=window.setTimeout(async()=>{await Promise.allSettled([...this.#i]),this.#t=null,this.#c||this.#d()},0))})}#d(){let e=this.#e.splice(0);for(let t=0;t<e.length;t+=qu)this.#f(e.slice(t,t+qu))}async#f(e){let t=new AbortController;this.#n.add(t);try{let n=await this.#p({editorContextToken:this.contextToken,items:e.map(e=>e.payload)},t.signal),r=new Map(n.results.map(e=>[e.requestId,e]));for(let t of e){let e=r.get(t.requestId);e?e.ok===!1?t.reject(new Hu(e.error??`fieldLayoutRejected`,e.message)):t.resolve(e):t.reject(new Hu(`missingBatchResult`))}}catch(t){for(let n of e)n.reject(t)}finally{this.#n.delete(t)}}async#p(e,t){if(window.Craft?.sendActionRequest){let n=await window.Craft.sendActionRequest(`POST`,`vizy/field-layout/render-batch`,{data:e,headers:{"Content-Type":`application/json`},signal:t});if(t.aborted)throw new DOMException(`Aborted`,`AbortError`);return n.data}let n=await fetch(`/actions/vizy/field-layout/render-batch`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(e),signal:t});if(!n.ok)throw Error(`fieldLayoutRequest:${n.status}`);return n.json()}async#m(e,t){if(window.Craft?.sendActionRequest){let n=await window.Craft.sendActionRequest(`POST`,`vizy/field-layout/refresh`,{data:e,headers:{"Content-Type":`application/json`},signal:t});if(t.aborted)throw new DOMException(`Aborted`,`AbortError`);return n.data}let n=await fetch(`/actions/vizy/field-layout/refresh`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify(e),signal:t});if(!n.ok)throw Error(`fieldLayoutRefresh:${n.status}`);return n.json()}async#h(e){let t=this.hosts.get(e),n=this.findBlock(e),r=t?.response;if(!t||!n||t.status!==`mounted`||!r?.refreshable||this.#c)return;let i=n.node.toJSON(),a=await Yu(i);if(this.#c||this.hosts.get(e)!==t)return;this.#s.get(e)?.abort();let o=new AbortController;this.#s.set(e,o);let s=crypto.randomUUID();try{let c=await this.#m({editorContextToken:this.contextToken,requestId:s,documentRevision:n.revision,blockHash:a,block:i,destination:n.destination,visibleElements:r.visibleElements??{},staticElements:r.staticElements??{}},o.signal),l=this.findBlock(e),u=this.manifest.blockTypes[String(l?.node.attrs.blockTypeUid)];if(o.signal.aborted||this.#c||this.hosts.get(e)!==t||t.status!==`mounted`||t.response!==r||!l||c.requestId!==s||c.blockUid!==e||c.blockTypeUid!==String(l.node.attrs.blockTypeUid)||c.documentRevision!==n.revision||c.blockHash!==a||c.fieldLayoutUid!==u?.fieldLayoutUid||c.fieldLayoutHash!==u?.fieldLayoutHash)return;this.#v(t,c)}catch(t){o.signal.aborted||console.error(`[Vizy] FieldLayout condition refresh failed for block ${e}`,t)}finally{this.#s.get(e)===o&&this.#s.delete(e)}}adoptInitial(e){let t=this.hosts.get(e.blockUid),n=this.findBlock(e.blockUid),r=n?this.manifest.blockTypes[String(n.node.attrs.blockTypeUid)]:void 0;return!t||!n||t.status===`disposed`||e.blockTypeUid!==String(n.node.attrs.blockTypeUid)||e.fieldLayoutUid!==r?.fieldLayoutUid||e.fieldLayoutHash!==r?.fieldLayoutHash?null:t.status===`mounted`?t:(t.abortController?.abort(),t.requestId=null,t.requestKey=null,this.#g(t,e),t)}adoptInitialFailure(e){let t=e.blockUid;if(!t)return null;let n=this.hosts.get(t),r=this.findBlock(t);return!n||!r||n.status===`disposed`||n.status===`mounted`?null:(n.abortController?.abort(),n.requestId=null,n.requestKey=null,n.status=`failed`,n.errorMessage=Wu(new Hu(e.error,e.message)),n.root.innerHTML=``,console.error(`[Vizy] Initial FieldLayout failed for block ${t}`,e),this.#x(n),n)}#g(e,t){return e.root.isConnected?(this.#_(e,t),Promise.resolve(e)):(e.status=`loading`,e.errorMessage=null,new Promise(n=>{let r=r=>{if(e.status===`disposed`){n(e);return}r&&e.root.isConnected?this.#_(e,t):this.#y(e,new Hu(`fieldHostDisconnected`,`Block fields could not initialize because the field host was not in the document.`)),n(e)};queueMicrotask(()=>{if(e.status===`disposed`){n(e);return}if(e.root.isConnected){r(!0);return}requestAnimationFrame(()=>r(e.root.isConnected))})}))}#_(e,t){try{if(e.root.innerHTML=t.html,Cu(e.root),!e.root.isConnected)throw new Hu(`fieldHostDisconnected`,`Block fields could not initialize because the field host was not in the document.`);let n=`${t.fieldLayoutHash}:${t.headHtml}`;t.headHtml&&!Gu.has(n)&&(Nu(t.headHtml,document.head),Gu.add(n)),Nu(t.bodyHtml,document.body),window.Craft?.initUiElements?.(e.root),e.response=t,e.errorMessage=null,e.status=`mounted`,this.#b(e,t),this.onMounted(e),e.disposals.push(Vu(e.root))}catch(t){this.#y(e,t)}}#v(e,t){try{let n=e.root.querySelector(`:scope > .flex-fields:not(.hidden)`)?.dataset.layoutTab??null,r=new Set(t.missingElements.map(e=>e.uid));for(let t of e.root.querySelectorAll(`:scope > .flex-fields`)){let e=t.dataset.layoutTab;e&&!r.has(e)&&t.remove()}for(let n of t.missingElements){let t=e.root.querySelector(`:scope > .flex-fields[data-layout-tab="${CSS.escape(n.uid)}"]`);t||(t=document.createElement(`div`),t.id=n.id,t.className=`flex-fields hidden`,t.dataset.id=n.id,t.dataset.layoutTab=n.uid,e.root.append(t));for(let e of n.elements){let n=`[data-layout-element="${CSS.escape(e.uid)}"]`,r=t.querySelector(n);if(e.html===!0)continue;let i;if(typeof e.html==`string`&&e.html.trim()){let t=document.createElement(`template`);t.innerHTML=e.html.trim();let n=t.content.firstElementChild;if(!(n instanceof HTMLElement))throw Error(`invalidFieldLayoutElement:${e.uid}`);i=n}else i=document.createElement(`div`),i.className=`hidden`,i.dataset.layoutElement=e.uid,i.dataset.layoutElementPlaceholder=``;r?r.replaceWith(i):t.append(i)}e.root.append(t)}if(!e.root.isConnected)throw Error(`fieldHostDisconnected`);let i=`${t.fieldLayoutHash}:${t.headHtml}`;t.headHtml&&!Gu.has(i)&&(Nu(t.headHtml,document.head),Gu.add(i)),Nu(t.bodyHtml,document.body),window.Craft?.initUiElements?.(e.root),e.response={...t,html:e.response?.html??``},e.errorMessage=null,e.status=`mounted`,Cu(e.root),this.#b(e,e.response,n),this.onMounted(e),e.disposals.push(Vu(e.root))}catch(t){console.error(`[Vizy] FieldLayout condition delta failed for block ${e.blockUid}`,t)}}#y(e,t){e.status=`failed`,e.response=null,e.errorMessage=Wu(t),e.root.innerHTML=``,console.error(`[Vizy] FieldLayout mount crashed for block ${e.blockUid}`,t),this.#x(e)}#b(e,t,n=null){let r=e.root.closest(`vizy-block`),i=t.tabLabels??[];r&&(JSON.stringify(r.layoutTabLabels)!==JSON.stringify(i)&&(r.layoutTabLabels=i),r.fieldLayoutError=null,r.fieldLayoutState=`mounted`);let a=[...e.root.querySelectorAll(`:scope > .flex-fields`)],o=n?a.findIndex(e=>e.dataset.layoutTab===n):-1;wu(e,o>=0?o:0)}#x(e){let t=e.root.closest(`vizy-block`);t&&(t.fieldLayoutState=`error`,t.fieldLayoutError=e.errorMessage,t.fieldLayoutRetrying=!1)}};function Zu(e,t){let n=[];return e.descendants(e=>{e.type.name===`vizyBlock`&&t[String(e.attrs.blockTypeUid)]?.fieldLayoutUid&&n.push(String(e.attrs.blockUid))}),n}var Qu=(e,t)=>{let n=()=>t();return e.addEventListener(`input`,n),e.addEventListener(`change`,n),()=>{e.removeEventListener(`input`,n),e.removeEventListener(`change`,n)}},$u=(e,t)=>{let n=window.jQuery;if(!n)return Qu(e,t);let r=()=>t(),i=n(e);return i.on(`input change`,r),()=>i.off(`input change`,r)},ed=(e,t)=>{let n=!1,r=()=>{n||(n=!0,queueMicrotask(()=>{n=!1,t()}))},i=$u(e,r),a=e.querySelector(`.lightswitch`);return a?.addEventListener(`click`,r),()=>{i(),a?.removeEventListener(`click`,r)}},td=e=>{let t=e.querySelector(`input:not([type=hidden]), textarea, select`);if(!t)throw Error(`adapterControlMissing`);return t},nd={read:e=>td(e).value,bind:Qu},rd={read(e){let t=e.querySelector(`input[type=hidden]`);if(!t)throw Error(`adapterControlMissing`);return t.value===`1`},bind:ed},id={read(e){let t=e.querySelector(`textarea`);if(!t)throw Error(`adapterControlMissing`);t.CodeMirror?.save?.();let n=t.value;if(n.trim()===``)return null;try{return JSON.parse(n)}catch(e){return{__ERROR__:e instanceof Error?e.message:`Invalid JSON`,__VALUE__:n}}},bind:Qu},ad={read(e){return[...e.querySelectorAll(`input[type=hidden][name]`)].filter(e=>!e.disabled&&e.value!==``&&cd(e.name)).map(e=>e.value)},bind:Qu},od={read(e){let t=(e.querySelector(`select[name*="[type]"], input[type="hidden"][name*="[type]"]`)?.value||``).trim()||`url`,n=(((e.querySelector(`[data-link-type="${CSS.escape(t)}"]`)??e.querySelector(`[data-link-type]:not(.hidden)`))?.querySelector(`input[name*="[value]"]`)??e.querySelector(`input[name*="[${CSS.escape(t)}][value]"]`))?.value||``).trim();if(!n)return null;let r={type:t,value:n};for(let t of[`label`,`urlSuffix`,`target`,`title`,`class`,`id`,`rel`,`ariaLabel`,`filename`]){let n=e.querySelector(`input[name*="[${t}]"], textarea[name*="[${t}]"]`);if(!n||n.disabled||!cd(n.name)||(n.type===`checkbox`||n.type===`radio`)&&!n.checked)continue;let i=n.value.trim();i!==``&&i!==`0`&&(r[t]=i)}let i=e.querySelector(`input[name*="[download]"]`);return i&&!i.disabled&&(i.checked||i.value===`1`)&&(r.download=!0),r},bind:Qu},sd={read:e=>ld(e),bind:Qu};function cd(e){return e!==``&&e!==`null`}function ld(e){let t=[];for(let n of e.querySelectorAll(`input[name], textarea[name], select[name]`)){if(n.disabled||!cd(n.name))continue;let r=n.closest(`[data-hyper-input]`);if(!(r&&e.contains(r))){if(n instanceof HTMLInputElement){let e=n.type;if(e===`button`||e===`submit`||e===`reset`||e===`image`||e===`file`||(e===`checkbox`||e===`radio`)&&!n.checked)continue}if(n instanceof HTMLSelectElement&&n.multiple){for(let e of n.selectedOptions)t.push({name:n.name,value:e.value});continue}t.push({name:n.name,value:n.value})}}return t.length?pd(ud(t),t[0].name):null}function ud(e){let t={};for(let{name:n,value:r}of e){let e=dd(n);e.length&&fd(t,e,r)}return t}function dd(e){let t=[],n=/([^[\]]+)|\[([^\]]*)\]/g,r;for(;(r=n.exec(e))!==null;)t.push(r[1]??r[2]??``);return t}function fd(e,t,n){let r=e;for(let e=0;e<t.length;e++){let i=t[e],a=e===t.length-1,o=t[e+1],s=i===``||/^\d+$/.test(i);if(a){if(Array.isArray(r)){i===``?r.push(n):r[Number(i)]=n;return}if(!r||typeof r!=`object`)return;let e=r;e[i]=n;return}if(Array.isArray(r)){let e=i===``?r.length:Number(i);r[e]??(r[e]=o===``||o!==void 0&&/^\d+$/.test(o)?[]:{}),r=r[e];continue}if(!r||typeof r!=`object`)return;let c=r;c[i]??(c[i]=o===``||o!==void 0&&/^\d+$/.test(o)?[]:{}),(typeof c[i]!=`object`||c[i]===null)&&(c[i]=s?[]:{}),r=c[i]}}function pd(e,t){let n=dd(t),r=n[0]===`vizyHost`&&n[3]===`fields`&&n[4]===`fields`?6:n[0]===`fields`?2:1,i=e;for(let e of n.slice(0,r)){if(!i||typeof i!=`object`)return null;i=i[e]}return i??null}var md=new Map([[`craft.plainText`,nd],[`craft.lightswitch`,rd],[`craft.json`,id],[`craft.link`,od],[`craft.entries`,ad],[`craft.categories`,ad],[`craft.tags`,ad],[`craft.users`,ad],[`craft.assets`,ad],[`craft.generic`,sd],[`craft.matrix`,sd],[`vizy.hosted`,{read(e){let t=e.querySelector(`input[data-vizy-document]`),n={type:`doc`,attrs:{schemaVersion:2},content:[]},r=()=>{if(!t?.value)return n;try{return JSON.parse(t.value)}catch{throw Error(`hostedVizyDocumentInvalid`)}},i=e.querySelector(`vizy-editor`);if(!i?.editor||typeof i.flush!=`function`)return r();try{return JSON.parse(i.flush(`serialize`))}catch{return r()}},bind(e,t){let n=e.querySelector(`vizy-editor`);if(!n)return()=>{};let r=()=>t();return n.addEventListener(`input`,r),n.addEventListener(`change`,r),()=>{n.removeEventListener(`input`,r),n.removeEventListener(`change`,r)}}}]]);function hd(e){let t=md.get(e)??md.get(`craft.generic`);if(!t)throw Error(`unsupportedFieldAdapter:${e}`);return t}var gd=new Set([`blockUid`,`layoutUid`,`columnUid`,`linkUid`,`imageUid`,`tableUid`,`rowUid`,`cellUid`]);function _d(e){if(!e||typeof e!=`object`||Array.isArray(e))return!1;let t=e;return t.type===`doc`&&!!t.attrs&&typeof t.attrs==`object`&&Array.isArray(t.content)}function vd(e){return!!e&&typeof e==`object`&&!Array.isArray(e)&&`entries`in e&&typeof e.entries==`object`&&e.entries!==null&&!Array.isArray(e.entries)}function yd(e,t){let n=new Map,r={};for(let[i,a]of Object.entries(e.entries)){if(!a||typeof a!=`object`||Array.isArray(a))continue;let e=t();n.set(i,e),i.startsWith(`uid:`)&&n.set(i.slice(4),e);let o={...a,uid:e};delete o.id,delete o.ownerId,delete o.canonicalId,r[e]=o}let i=[];for(let r of Array.isArray(e.sortOrder)?e.sortOrder:[]){let e=String(r);i.push(n.get(e)??n.get(`uid:${e}`)??t())}return i.length||i.push(...Object.keys(r)),{entries:r,sortOrder:i}}function bd(e,t=xd,n={}){let r=new Map,i=e=>{let n=r.get(e);return n||(n=t(),r.set(e,n)),n},a=e=>{let r={...e.attrs??{}};for(let e of gd)typeof r[e]==`string`&&r[e]!==``&&(r[e]=i(r[e]));if(e.type===`vizyBlock`){`matrixAnchorUid`in r&&(r.matrixAnchorUid=null);let e=r.fieldSlots;if(e&&typeof e==`object`&&!Array.isArray(e)){let i={};for(let[a,s]of Object.entries(e)){let e=n[String(r.blockTypeUid)]?.fieldSlotKinds?.[a];i[a]=e===`hosted`&&_d(s)?o(s):e===`matrix`&&vd(s)?yd(s,t):s}r.fieldSlots=i}}let s=Array.isArray(e.content)?e.content.map(e=>e&&typeof e==`object`?a(e):e):e.content;return{...e,...e.attrs||Object.keys(r).length?{attrs:r}:{},...s===void 0?{}:{content:s}}},o=e=>({...e,content:Array.isArray(e.content)?e.content.map(e=>e&&typeof e==`object`?a(e):e):e.content});if(e&&typeof e==`object`&&!Array.isArray(e)){let t=e;return t.type===`doc`?o(t):a(t)}return e}function xd(){if(typeof crypto.randomUUID==`function`)return crypto.randomUUID();let e=crypto.getRandomValues(new Uint8Array(16));e[6]=e[6]&15|64,e[8]=e[8]&63|128;let t=[...e].map(e=>e.toString(16).padStart(2,`0`));return`${t.slice(0,4).join(``)}-${t.slice(4,6).join(``)}-${t.slice(6,8).join(``)}-${t.slice(8,10).join(``)}-${t.slice(10).join(``)}`}function Sd(e,t,n){return bd(e,t,n)}var Cd=new Set([`href`,`target`]),wd=new Set([`src`,`width`,`height`]),Td=new Set([`colwidth`]);function Ed(e,t){let n={};for(let[r,i]of Object.entries(e))t.has(r)||(n[r]=i);return n}function Dd(e){return e&&e.map(e=>e.type!==`link`||!e.attrs?e:{...e,attrs:Ed(e.attrs,Cd)})}function Od(e,t){let n={...e};if(n.marks&&=Dd(n.marks),n.type===`image`){let e=Ed(n.attrs??{},wd),r=e.assetUid;if(typeof r!=`string`||!U(r))throw Error(`semanticImageMissingAssetUid at ${t}`);n.attrs=e}if(n.type===`table`){let e=n.attrs??{},r=e.columnWidths;if(r!=null){if(!Array.isArray(r))throw Error(`semanticTableInvalidColumnWidths at ${t}`);let i=r.map(e=>Number.parseInt(String(e),10));if(i.some(e=>!Number.isInteger(e)||e<1))throw Error(`semanticTableInvalidColumnWidths at ${t}`);if(ec(i)!==1e3)throw Error(`semanticTableColumnWidthTotal at ${t}`);n.attrs={...e,columnWidths:i}}}return(n.type===`tableCell`||n.type===`tableHeader`)&&(n.attrs&&=Ed(n.attrs,Td)),n.content&&=n.content.map((e,n)=>Od(e,`${t}.content[${n}]`)),n}function kd(e){return Od(structuredClone(e),`$`)}var Ad=`application/x-vizy-opaque-slice+json`,jd=new Set([`unsupportedNode`,`unsupportedInlineNode`]),Md=Object.freeze({maxDocumentBytes:256e3,maxRawBytes:64e3,maxNodes:2e3,maxDepth:32,maxObjectDepth:128,maxObjectWidth:1024,maxPlaceholders:256,maxPlacementAttempts:2048}),Nd=Object.freeze({...Md,maxDocumentBytes:1/0,maxRawBytes:1/0,maxNodes:1/0,maxPlaceholders:1/0,maxPlacementAttempts:1/0,maxObjectWidth:1/0,maxObjectDepth:512}),K=class extends Error{code;path;constructor(e,t){super(`${e} at ${t}`),this.code=e,this.path=t}},Pd=e=>structuredClone(e),Fd=e=>new TextEncoder().encode(JSON.stringify(e)).length,Id=e=>typeof e==`object`&&!!e&&!Array.isArray(e);function Ld(e,t,n,r=0){if(r>n.maxObjectDepth)throw new K(`objectDepthExceeded`,t);if(Array.isArray(e)){if(e.length>n.maxObjectWidth)throw new K(`objectWidthExceeded`,t);e.forEach((e,i)=>Ld(e,`${t}[${i}]`,n,r+1))}else if(Id(e)){if(Object.keys(e).length>n.maxObjectWidth)throw new K(`objectWidthExceeded`,t);Object.entries(e).forEach(([e,i])=>Ld(i,`${t}.${e}`,n,r+1))}else if(e!==null&&![`string`,`number`,`boolean`].includes(typeof e))throw new K(`nonJsonValue`,t);else if(typeof e==`number`&&!Number.isFinite(e))throw new K(`nonJsonValue`,t)}function Rd(e,t,n,r,i=0,a=!1){if(!Id(e)||typeof e.type!=`string`||!e.type)throw new K(`invalidNode`,t);if(!a&&jd.has(e.type))throw new K(`reservedCanonicalType`,t);if(++r.nodes>n.maxNodes)throw new K(`nodeCountExceeded`,t);if(i>n.maxDepth)throw new K(`nodeDepthExceeded`,t);if(`attrs`in e&&!Id(e.attrs))throw new K(`invalidNodeAttrs`,`${t}.attrs`);if(`marks`in e){if(!Array.isArray(e.marks))throw new K(`invalidMarks`,`${t}.marks`);e.marks.forEach((e,n)=>{let r=`${t}.marks[${n}]`;if(!Id(e)||typeof e.type!=`string`||!e.type)throw new K(`invalidMark`,r);if(`attrs`in e&&!Id(e.attrs))throw new K(`invalidMarkAttrs`,`${r}.attrs`)})}if(e.type===`text`&&(typeof e.text!=`string`||!e.text))throw new K(`missingText`,t);if(e.type!==`text`&&`text`in e)throw new K(`nonTextNodeText`,t);if(`content`in e){if(!Array.isArray(e.content))throw new K(`invalidContent`,`${t}.content`);e.content.forEach((e,o)=>Rd(e,`${t}.content[${o}]`,n,r,i+1,a))}}function zd(e,t,n){if(Number.isFinite(t.maxDocumentBytes)&&Fd(e)>t.maxDocumentBytes)throw new K(`documentBytesExceeded`,`$`);if(Ld(e,`$`,t),Rd(e,`$`,t,{nodes:0},0,n),e.type!==`doc`)throw new K(`invalidDocumentRoot`,`$`)}var Bd=(e,t)=>({opaque:!0,rawNode:Pd(e),reason:t}),Vd=e=>`opaque`in e,Hd=(e,t)=>({type:e,attrs:{transportVersion:1,reason:t.reason,originalType:t.rawNode.type,rawNode:Pd(t.rawNode)}}),Ud=(e,t)=>{try{return e.nodeFromJSON(t).check(),!0}catch{return!1}};function Wd(e,t,n,r){let i=e.nodes[t.type];if(!i)return null;let a=new Map([[i.contentMatch,[]]]),o=0;for(let t of n){let n=Vd(t)?[`unsupportedInlineNode`,`unsupportedNode`].map(e=>Hd(e,t)):[t],i=new Map;for(let[t,s]of a)for(let a of n){if(++o>r.maxPlacementAttempts)throw new K(`placementAttemptsExceeded`,`$`);let n=e.nodes[a.type],c=n?t.matchType(n):null;!c||i.has(c)||!Ud(e,a)||i.set(c,[...s,a])}if(!i.size)return null;a=i}for(let[n,r]of a)if(n.validEnd&&Ud(e,{...t,content:r}))return r;return null}function Gd(e,t,n,r={}){let i={...Nd,...r};zd(e,i,!1);let a=new Set(n.nodes),o=new Set(n.marks);if([...jd].some(e=>a.has(e)))throw new K(`reservedManifestType`,`$`);let s=0,c=e=>{if(!a.has(e.type))return Bd(e,`unknownNode`);if(e.marks?.some(e=>!o.has(e.type)))return Bd(e,`unknownMark`);if(!e.content)return Pd(e);let n=e.content.map(c),r=Wd(t,e,n,i);if(!r)return Bd(e,n.find(Vd)?.reason??`unknownNode`);if(s+=n.filter(Vd).length,s>i.maxPlaceholders)throw new K(`placeholderCountExceeded`,`$`);let{content:l,...u}=e;return{...Pd(u),content:r}},l=c(e);if(Vd(l))throw new K(`noSafePlaceholderPlacement`,`$`);if(!Ud(t,l))throw new K(`transportSchemaMismatch`,`$`);return l}function Kd(e,t,n){if(Object.keys(e).sort().join(`,`)!==`attrs,type`||!Id(e.attrs))throw new K(`invalidPlaceholderShape`,t);let r=e.attrs;if(Object.keys(r).sort().join(`,`)!==`originalType,rawNode,reason,transportVersion`)throw new K(`invalidPlaceholderAttrs`,`${t}.attrs`);if(r.transportVersion!==1)throw new K(`unsupportedTransportVersion`,t);if(![`unknownNode`,`unknownMark`].includes(String(r.reason)))throw new K(`invalidPlaceholderReason`,t);if(!Id(r.rawNode)||r.originalType!==r.rawNode.type)throw new K(`placeholderTypeMismatch`,t);if(Fd(r.rawNode)>n.maxRawBytes)throw new K(`rawBytesExceeded`,t);return Ld(r.rawNode,`${t}.attrs.rawNode`,n),Rd(r.rawNode,`${t}.attrs.rawNode`,n,{nodes:0}),Pd(r.rawNode)}function qd(e,t={}){let n={...Nd,...t};zd(e,n,!0);let r=0,i=(e,t)=>{if(jd.has(e.type)){if(++r>n.maxPlaceholders)throw new K(`placeholderCountExceeded`,t);return Kd(e,t,n)}let{content:a,...o}=e,s=Pd(o);return a&&(s.content=a.map((e,n)=>i(e,`${t}.content[${n}]`))),s},a=i(e,`$`);(!(`content`in a)||a.content===void 0)&&(a.content=[]),zd(a,n,!1);try{return Jd(kd(a))}catch(e){throw new K(e instanceof Error?e.message.split(` `)[0]:`semanticSanitizeFailed`,`$`)}}function Jd(e){let t=e;if(Id(t.attrs)){let e=Object.entries(t.attrs).filter(([,e])=>e!==null);e.length!==Object.keys(t.attrs).length&&(e.length===0?delete t.attrs:t.attrs=Object.fromEntries(e))}return t.marks?.forEach(e=>Jd(e)),t.content?.forEach(e=>Jd(e)),t}function Yd(e,t={}){let n={...Md,...t};if(!Id(e)||Object.keys(e).some(e=>![`content`,`openStart`,`openEnd`].includes(e))||!Array.isArray(e.content)||`openStart`in e&&!Number.isInteger(e.openStart)||`openEnd`in e&&!Number.isInteger(e.openEnd)||Number(e.openStart??0)<0||Number(e.openEnd??0)<0)throw new K(`invalidSliceShape`,`$clipboard`);if(Fd(e)>n.maxDocumentBytes)throw new K(`documentBytesExceeded`,`$clipboard`);let r={nodes:0},i=0;e.content.forEach((e,t)=>{Ld(e,`$clipboard.content[${t}]`,n),Rd(e,`$clipboard.content[${t}]`,n,r,0,!0)});let a=(e,t)=>{let r=e;if(jd.has(r.type)){if(++i>n.maxPlaceholders)throw new K(`placeholderCountExceeded`,t);Kd(r,t,n);return}r.content?.forEach((e,n)=>a(e,`${t}.content[${n}]`))};return e.content.forEach((e,t)=>a(e,`$clipboard.content[${t}]`)),{...Pd(e),content:Pd(e.content),openStart:Number(e.openStart??0),openEnd:Number(e.openEnd??0)}}function Xd(e,t){let n=t?`Unsupported formatting — preserved but not editable`:`Unsupported content — preserved but not editable`;return j.create({name:e,inline:t,group:t?`inline`:`block`,atom:!0,selectable:!0,draggable:!t,addAttributes:()=>({transportVersion:{default:null,rendered:!1},reason:{default:null,rendered:!1},originalType:{default:null,rendered:!1},rawNode:{default:null,rendered:!1}}),parseHTML:()=>[],renderHTML:()=>[t?`span`:`div`,{class:t?`vizy-unsupported-inline`:`vizy-unsupported-block`,contenteditable:`false`,"aria-label":n},n]})}var Zd=Xd(`unsupportedNode`,!1),Qd=Xd(`unsupportedInlineNode`,!0);function $d(e){let t=!1,n=!1,r=e=>{if(!e||typeof e!=`object`)return;let i=e;typeof i.type==`string`&&(jd.has(i.type)?(t=!0,n=!0):i.type===`vizyBlock`&&(t=!0)),Array.isArray(i.content)&&i.content.forEach(r)};if(typeof e==`object`&&e){let t=e.content;Array.isArray(t)&&t.forEach(r)}return{containsPrivate:t,containsOpaque:n}}function ef(e,t){let n=(e,r)=>{if(e.type===`vizyBlock`){let n=String(e.attrs?.blockTypeUid??``);if(!t.has(n))throw new K(`blockTypeNotInsertable`,r)}e.content?.forEach((e,t)=>n(e,`${r}.content[${t}]`))};e.content.forEach((e,t)=>n(e,`$clipboard.content[${t}]`))}var tf=w.create({name:`opaqueClipboard`,addOptions:()=>({schemaIdentity:{},insertableBlockTypeUids:[]}),addProseMirrorPlugins(){let e=this.options.schemaIdentity,t=new Set(this.options.insertableBlockTypeUids),n=this.options.beforeCopy,r=(e,r,i)=>{let a=r.clipboardData,o=e.state.selection.content().toJSON(),s=$d(o);if(!a||!s.containsPrivate)return!1;let c=()=>(r.preventDefault(),e.dom.dispatchEvent(new CustomEvent(`vizy-clipboard-rejected`,{bubbles:!0,detail:{code:`opaqueClipboardUnsupported`,operation:i?`cut`:`copy`}})),!0);if(s.containsOpaque)return c();try{if(n?.(),o=e.state.selection.content().toJSON(),s=$d(o),!s.containsPrivate)return!1;if(s.containsOpaque)return c();let r=JSON.stringify(o);i&&ef(Yd(JSON.parse(r)),t)}catch(t){return r.preventDefault(),e.dom.dispatchEvent(new CustomEvent(`vizy-clipboard-rejected`,{bubbles:!0,detail:{code:t instanceof K?t.code:`fieldCaptureFailed`,operation:i?`cut`:`copy`}})),!0}let l=JSON.stringify(o),u=`Vizy content`;if(a.setData(Ad,l),a.setData(`text/plain`,u),a.setData(`text/html`,`<span class="vizy-private-clipboard">${u}</span>`),r.preventDefault(),i&&e.editable){let t=e.state.doc;e.dispatch(e.state.tr.deleteSelection().setMeta(`uiEvent`,`cut`).scrollIntoView()),e.state.doc.eq(t)&&e.dom.dispatchEvent(new CustomEvent(`vizy-clipboard-rejected`,{bubbles:!0,detail:{code:`policyRejected`,operation:`cut`}}))}return!0};return[new T({props:{handleDOMEvents:{copy:(e,t)=>r(e,t,!1),cut:(e,t)=>r(e,t,!0),paste(n,r){let i=r.clipboardData?.getData(Ad);if(!i)return!1;r.preventDefault();try{let r=JSON.parse(i);if($d(r).containsOpaque)throw new K(`opaqueClipboardUnsupported`,`$clipboard`);let a=Yd(r);ef(a,t);let o=bd(a,void 0,e),s=M.fromJSON(n.state.schema,o),c=n.state.doc;if(n.dispatch(n.state.tr.replaceSelection(s).scrollIntoView()),n.state.doc.eq(c))throw new K(`policyRejected`,`$clipboard`)}catch(e){n.dom.dispatchEvent(new CustomEvent(`vizy-clipboard-rejected`,{bubbles:!0,detail:{code:e instanceof K?e.code:`invalidPrivateSlice`,operation:`paste`}}))}return!0}}}})]}}),nf=new WeakSet,rf=new WeakSet;function af(e){let t=e;return nf.add(t),t}function of(e){return Array.isArray(e)&&nf.has(e)}function sf(e){return e.flatMap(e=>e==null?[]:Array.isArray(e)&&rf.has(e)&&!of(e)?sf(e):[e])}function cf(e,t){if(e===`slot`)return 0;if(e instanceof Function){let n=e(t);return Array.isArray(n)&&!of(n)&&!rf.has(n)?af(n):n}let{children:n,...r}=t??{};if(e===`svg`)throw Error(`SVG elements are not supported in the JSX syntax, use the array syntax instead`);if(Array.isArray(n)){if(of(n))return af([e,r,n]);if(n.length===0)return af([e,r]);let t=sf(n);return t.length===0?af([e,r]):af([e,r,...t])}return af(n==null?[e,r]:[e,r,n])}var lf=(e,t)=>cf(e,t),uf=(e,t)=>{let{state:n}=e,{selection:r}=n;if(!r.empty)return!1;let{$from:i}=r;if(i.parentOffset!==0)return!1;let a=i.depth-1;if(a<0)return!1;let o=i.node(a),s=i.index(a);if(s===0)return!1;if(o.type===t)return e.commands.lift(t.name);let c=o.child(s-1);if(c.type!==t||!c.lastChild?.isTextblock)return!1;let l=i.before()-1-1;return e.commands.command(({tr:e,dispatch:t})=>{if(!t)return!0;let n=i.parent.content,r=new M(n,0,0);return e.replace(l,i.after(),r),e.setSelection(N.create(e.doc,l+n.size)),e.scrollIntoView(),t(e),!0})},df=/^\s*>\s$/,ff=j.create({name:`blockquote`,addOptions(){return{HTMLAttributes:{}}},content:`block+`,group:`block`,defining:!0,parseHTML(){return[{tag:`blockquote`}]},renderHTML({HTMLAttributes:e}){return lf(`blockquote`,{...A(this.options.HTMLAttributes,e),children:lf(`slot`,{})})},parseMarkdown:(e,t)=>{let n=t.parseBlockChildren??t.parseChildren;return t.createNode(`blockquote`,void 0,n(e.tokens||[]))},renderMarkdown:(e,t)=>{if(!e.content)return``;let n=[];return e.content.forEach((e,r)=>{let i=(t.renderChild?.call(t,e,r)??t.renderChildren([e])).split(`
`).map(e=>e.trim()===``?`>`:`> ${e}`);n.push(i.join(`
`))}),n.join(`
>
`)},addCommands(){return{setBlockquote:()=>({commands:e})=>e.wrapIn(this.name),toggleBlockquote:()=>({commands:e})=>e.toggleWrap(this.name),unsetBlockquote:()=>({commands:e})=>e.lift(this.name)}},addKeyboardShortcuts(){return{"Mod-Shift-b":()=>this.editor.commands.toggleBlockquote(),Backspace:()=>uf(this.editor,this.type)}},addInputRules(){return[Mt({find:df,type:this.type})]}}),pf=/(?:^|\s)(\*\*(?!\s+\*\*)((?:[^*]+))\*\*(?!\s+\*\*))$/,mf=/(?:^|\s)(\*\*(?!\s+\*\*)((?:[^*]+))\*\*(?!\s+\*\*))/g,hf=/(?:^|\s)(__(?!\s+__)((?:[^_]+))__(?!\s+__))$/,gf=/(?:^|\s)(__(?!\s+__)((?:[^_]+))__(?!\s+__))/g,_f=Ie.create({name:`bold`,addOptions(){return{HTMLAttributes:{}}},parseHTML(){return[{tag:`strong`},{tag:`b`,getAttrs:e=>e.style.fontWeight!==`normal`&&null},{style:`font-weight=400`,clearMark:e=>e.type.name===this.name},{style:`font-weight`,getAttrs:e=>/^(bold(er)?|[5-9]\d{2,})$/.test(e)&&null}]},renderHTML({HTMLAttributes:e}){return lf(`strong`,{...A(this.options.HTMLAttributes,e),children:lf(`slot`,{})})},markdownTokenName:`strong`,parseMarkdown:(e,t)=>t.applyMark(`bold`,t.parseInline(e.tokens||[])),markdownOptions:{htmlReopen:{open:`<strong>`,close:`</strong>`}},renderMarkdown:(e,t)=>`**${t.renderChildren(e)}**`,addCommands(){return{setBold:()=>({commands:e})=>e.setMark(this.name),toggleBold:()=>({commands:e})=>e.toggleMark(this.name),unsetBold:()=>({commands:e})=>e.unsetMark(this.name)}},addKeyboardShortcuts(){return{"Mod-b":()=>this.editor.commands.toggleBold(),"Mod-B":()=>this.editor.commands.toggleBold()}},addInputRules(){return[ze({find:pf,type:this.type}),ze({find:hf,type:this.type})]},addPasteRules(){return[ue({find:mf,type:this.type}),ue({find:gf,type:this.type})]}}),vf=e=>{let t=/`([^`]+)`(?!`)$/.exec(e);return!t||t.index>0&&e[t.index-1]==="`"?null:{index:t.index,text:t[0],replaceWith:t[1]}},yf=e=>{let t=/`([^`]+)`(?!`)/g,n=[],r;for(;(r=t.exec(e))!==null;)r.index>0&&e[r.index-1]==="`"||n.push({index:r.index,text:r[0],replaceWith:r[1]});return n},bf=Ie.create({name:`code`,addOptions(){return{HTMLAttributes:{}}},excludes:`_`,code:!0,exitable:!0,parseHTML(){return[{tag:`code`}]},renderHTML({HTMLAttributes:e}){return[`code`,A(this.options.HTMLAttributes,e),0]},markdownTokenName:`codespan`,parseMarkdown:(e,t)=>t.applyMark(`code`,[{type:`text`,text:e.text||``}]),renderMarkdown:(e,t)=>e.content?`\`${t.renderChildren(e.content)}\``:``,addCommands(){return{setCode:()=>({commands:e})=>e.setMark(this.name),toggleCode:()=>({commands:e})=>e.toggleMark(this.name),unsetCode:()=>({commands:e})=>e.unsetMark(this.name)}},addKeyboardShortcuts(){return{"Mod-e":()=>this.editor.commands.toggleCode()}},addInputRules(){return[ze({find:vf,type:this.type})]},addPasteRules(){return[ue({find:yf,type:this.type})]}}),xf=4,Sf=/^```([a-z]+)?[\s\n]$/,Cf=/^~~~([a-z]+)?[\s\n]$/,wf=j.create({name:`codeBlock`,addOptions(){return{languageClassPrefix:`language-`,exitOnTripleEnter:!0,exitOnArrowDown:!0,exitOnArrowUp:!0,defaultLanguage:null,enableTabIndentation:!1,tabSize:xf,HTMLAttributes:{}}},content:`text*`,marks:``,group:`block`,code:!0,defining:!0,addAttributes(){return{language:{default:this.options.defaultLanguage,parseHTML:e=>{let{languageClassPrefix:t}=this.options;return t&&[...e.firstElementChild?.classList||[]].filter(e=>e.startsWith(t)).map(e=>e.replace(t,``))[0]||null},rendered:!1}}},parseHTML(){return[{tag:`pre`,preserveWhitespace:`full`}]},renderHTML({node:e,HTMLAttributes:t}){return[`pre`,A(this.options.HTMLAttributes,t),[`code`,{class:e.attrs.language?this.options.languageClassPrefix+e.attrs.language:null},0]]},markdownTokenName:`code`,parseMarkdown:(e,t)=>e.raw?.startsWith("```")===!1&&e.raw?.startsWith(`~~~`)===!1&&e.codeBlockStyle!==`indented`?[]:t.createNode(`codeBlock`,{language:e.lang||null},e.text?[t.createTextNode(e.text)]:[]),renderMarkdown:(e,t)=>{let n=``,r=e.attrs?.language||``;return n=e.content?[`\`\`\`${r}`,t.renderChildren(e.content),"```"].join(`
`):`\`\`\`${r}\n\n\`\`\``,n},addCommands(){return{setCodeBlock:e=>({commands:t})=>t.setNode(this.name,e),toggleCodeBlock:e=>({commands:t})=>t.toggleNode(this.name,`paragraph`,e)}},addKeyboardShortcuts(){return{"Mod-Alt-c":()=>this.editor.commands.toggleCodeBlock(),Backspace:()=>{let{empty:e,$anchor:t}=this.editor.state.selection,n=t.pos===1;return!e||t.parent.type.name!==this.name?!1:n||!t.parent.textContent.length?this.editor.commands.clearNodes():!1},Tab:({editor:e})=>{if(!this.options.enableTabIndentation)return!1;let t=this.options.tabSize??xf,{state:n}=e,{selection:r}=n,{$from:i,empty:a}=r;if(i.parent.type!==this.type)return!1;let o=` `.repeat(t);return a?e.commands.insertContent(o):e.commands.command(({tr:e})=>{let{from:t,to:i}=r,a=n.doc.textBetween(t,i,`
`,`
`).split(`
`).map(e=>o+e).join(`
`);return e.replaceWith(t,i,n.schema.text(a)),!0})},"Shift-Tab":({editor:e})=>{if(!this.options.enableTabIndentation)return!1;let t=this.options.tabSize??xf,{state:n}=e,{selection:r}=n,{$from:i,empty:a}=r;return i.parent.type===this.type?a?e.commands.command(({tr:e})=>{let{pos:r}=i,a=i.start(),o=i.end(),s=n.doc.textBetween(a,o,`
`,`
`).split(`
`),c=0,l=0,u=r-a;for(let e=0;e<s.length;e+=1){if(l+s[e].length>=u){c=e;break}l+=s[e].length+1}let d=s[c].match(/^ */)?.[0]||``,f=Math.min(d.length,t);if(f===0)return!0;let p=a;for(let e=0;e<c;e+=1)p+=s[e].length+1;return e.delete(p,p+f),r-p<=f&&e.setSelection(N.create(e.doc,p)),!0}):e.commands.command(({tr:e})=>{let{from:i,to:a}=r,o=n.doc.textBetween(i,a,`
`,`
`).split(`
`).map(e=>{let n=e.match(/^ */)?.[0]||``,r=Math.min(n.length,t);return e.slice(r)}).join(`
`);return e.replaceWith(i,a,n.schema.text(o)),!0}):!1},Enter:({editor:e})=>{if(!this.options.exitOnTripleEnter)return!1;let{state:t}=e,{selection:n}=t,{$from:r,empty:i}=n;if(!i||r.parent.type!==this.type)return!1;let a=r.parentOffset===r.parent.nodeSize-2,o=r.parent.textContent.endsWith(`

`);return!a||!o?!1:e.chain().command(({tr:e})=>(e.delete(r.pos-2,r.pos),!0)).exitCode().run()},ArrowUp:({editor:e})=>{if(!this.options.exitOnArrowUp)return!1;let{state:t}=e,{selection:n}=t,{$from:r,empty:i}=n;if(!i||r.parent.type!==this.type||r.parentOffset!==0)return!1;let a=r.before();return a>0?!1:e.commands.insertDefaultBlock({pos:a})},ArrowDown:({editor:e})=>{if(!this.options.exitOnArrowDown)return!1;let{state:t}=e,{selection:n,doc:r}=t,{$from:i,empty:a}=n;if(!a||i.parent.type!==this.type||i.parentOffset!==i.parent.nodeSize-2)return!1;let o=i.after();return o===void 0?!1:r.nodeAt(o)?e.commands.command(({tr:e})=>(e.setSelection(D.near(r.resolve(o))),!0)):e.commands.exitCode()}}},addInputRules(){return[ot({find:Sf,type:this.type,getAttributes:e=>({language:e[1]})}),ot({find:Cf,type:this.type,getAttributes:e=>({language:e[1]})})]},addProseMirrorPlugins(){return[new T({key:new E(`codeBlockVSCodeHandler`),props:{handlePaste:(e,t)=>{if(!t.clipboardData||this.editor.isActive(this.type.name))return!1;let n=t.clipboardData.getData(`text/plain`),r=t.clipboardData.getData(`vscode-editor-data`),i=(r?JSON.parse(r):void 0)?.mode;if(!n||!i)return!1;let{tr:a,schema:o}=e.state,s=o.text(n.replace(/\r\n?/g,`
`));return a.replaceSelectionWith(this.type.create({language:i},s)),a.selection.$from.parent.type!==this.type&&a.setSelection(N.near(a.doc.resolve(Math.max(0,a.selection.from-2)))),a.setMeta(`paste`,!0),e.dispatch(a),!0}}})]}}),Tf=j.create({name:`hardBreak`,markdownTokenName:`br`,addOptions(){return{keepMarks:!0,HTMLAttributes:{}}},inline:!0,group:`inline`,selectable:!1,linebreakReplacement:!0,parseHTML(){return[{tag:`br`}]},renderHTML({HTMLAttributes:e}){return[`br`,A(this.options.HTMLAttributes,e)]},renderText(){return`
`},renderMarkdown:()=>`  
`,parseMarkdown:()=>({type:`hardBreak`}),addCommands(){return{setHardBreak:()=>({commands:e,chain:t,state:n,editor:r})=>e.first([()=>e.exitCode(),()=>e.command(()=>{let{selection:e,storedMarks:i}=n;if(e.$from.parent.type.spec.isolating)return!1;let{keepMarks:a}=this.options,{splittableMarks:o}=r.extensionManager,s=i||e.$to.parentOffset&&e.$from.marks();return t().insertContent({type:this.name}).command(({tr:e,dispatch:t})=>{if(t&&s&&a){let t=s.filter(e=>o.includes(e.type.name));e.ensureMarks(t)}return!0}).scrollIntoView().run()})])}},addKeyboardShortcuts(){return{"Mod-Enter":()=>this.editor.commands.setHardBreak(),"Shift-Enter":()=>this.editor.commands.setHardBreak()}}}),Ef=j.create({name:`heading`,addOptions(){return{levels:[1,2,3,4,5,6],HTMLAttributes:{}}},content:`inline*`,group:`block`,defining:!0,addAttributes(){return{level:{default:1,rendered:!1}}},parseHTML(){return this.options.levels.map(e=>({tag:`h${e}`,attrs:{level:e}}))},renderHTML({node:e,HTMLAttributes:t}){return[`h${this.options.levels.includes(e.attrs.level)?e.attrs.level:this.options.levels[0]}`,A(this.options.HTMLAttributes,t),0]},parseMarkdown:(e,t)=>t.createNode(`heading`,{level:e.depth||1},t.parseInline(e.tokens||[])),renderMarkdown:(e,t)=>{let n=e.attrs?.level?parseInt(e.attrs.level,10):1,r=`#`.repeat(n);return e.content?`${r} ${t.renderChildren(e.content)}`:``},addCommands(){return{setHeading:e=>({commands:t})=>this.options.levels.includes(e.level)?t.setNode(this.name,e):!1,toggleHeading:e=>({commands:t})=>this.options.levels.includes(e.level)?t.toggleNode(this.name,`paragraph`,e):!1}},addKeyboardShortcuts(){return this.options.levels.reduce((e,t)=>({...e,[`Mod-Alt-${t}`]:()=>this.editor.commands.toggleHeading({level:t})}),{})},addInputRules(){return this.options.levels.map(e=>ot({find:RegExp(`^(#{${Math.min(...this.options.levels)},${e}})\\s$`),type:this.type,getAttributes:{level:e}}))}}),Df=j.create({name:`horizontalRule`,addOptions(){return{HTMLAttributes:{},nextNodeType:`paragraph`}},group:`block`,parseHTML(){return[{tag:`hr`}]},renderHTML({HTMLAttributes:e}){return[`hr`,A(this.options.HTMLAttributes,e)]},markdownTokenName:`hr`,parseMarkdown:(e,t)=>t.createNode(`horizontalRule`),renderMarkdown:()=>`---`,addCommands(){return{setHorizontalRule:()=>({chain:e,state:t})=>{if(!Me(t,t.schema.nodes[this.name]))return!1;let{selection:n}=t,{$to:r}=n,i=e();return nt(n)?i.insertContentAt(r.pos,{type:this.name}):i.insertContent({type:this.name}),i.command(({state:e,tr:t,dispatch:n})=>{if(n){let{$to:n}=t.selection,r=n.end();if(n.nodeAfter)n.nodeAfter.isTextblock?t.setSelection(N.create(t.doc,n.pos+1)):n.nodeAfter.isBlock?t.setSelection(O.create(t.doc,n.pos)):t.setSelection(N.create(t.doc,n.pos));else{let i=(e.schema.nodes[this.options.nextNodeType]||n.parent.type.contentMatch.defaultType)?.create();i&&(t.insert(r,i),t.setSelection(N.create(t.doc,r+1)))}t.scrollIntoView()}return!0}).run()}}},addInputRules(){return[Wt({find:/^(?:---|—-|___\s|\*\*\*\s)$/,type:this.type})]}}),Of=/(?:^|\s)(\*(?!\s+\*)((?:[^*]+))\*(?!\s+\*))$/,kf=/(?:^|\s)(\*(?!\s+\*)((?:[^*]+))\*(?!\s+\*))/g,Af=/(?:^|\s)(_(?!\s+_)((?:[^_]+))_(?!\s+_))$/,jf=/(?:^|\s)(_(?!\s+_)((?:[^_]+))_(?!\s+_))/g,Mf=Ie.create({name:`italic`,addOptions(){return{HTMLAttributes:{}}},parseHTML(){return[{tag:`em`},{tag:`i`,getAttrs:e=>e.style.fontStyle!==`normal`&&null},{style:`font-style=normal`,clearMark:e=>e.type.name===this.name},{style:`font-style=italic`}]},renderHTML({HTMLAttributes:e}){return[`em`,A(this.options.HTMLAttributes,e),0]},addCommands(){return{setItalic:()=>({commands:e})=>e.setMark(this.name),toggleItalic:()=>({commands:e})=>e.toggleMark(this.name),unsetItalic:()=>({commands:e})=>e.unsetMark(this.name)}},markdownTokenName:`em`,parseMarkdown:(e,t)=>t.applyMark(`italic`,t.parseInline(e.tokens||[])),markdownOptions:{htmlReopen:{open:`<em>`,close:`</em>`}},renderMarkdown:(e,t)=>`*${t.renderChildren(e)}*`,addKeyboardShortcuts(){return{"Mod-i":()=>this.editor.commands.toggleItalic(),"Mod-I":()=>this.editor.commands.toggleItalic()}},addInputRules(){return[ze({find:Of,type:this.type}),ze({find:Af,type:this.type})]},addPasteRules(){return[ue({find:kf,type:this.type}),ue({find:jf,type:this.type})]}}),Nf=`listItem`,Pf=`textStyle`,Ff=/^\s*([-+*])\s$/,If=j.create({name:`bulletList`,addOptions(){return{itemTypeName:`listItem`,HTMLAttributes:{},keepMarks:!1,keepAttributes:!1}},group:`block list`,content(){return`${this.options.itemTypeName}+`},parseHTML(){return[{tag:`ul`}]},renderHTML({HTMLAttributes:e}){return[`ul`,A(this.options.HTMLAttributes,e),0]},markdownTokenName:`list`,parseMarkdown:(e,t)=>e.type!==`list`||e.ordered?[]:{type:`bulletList`,content:e.items?t.parseChildren(e.items):[]},renderMarkdown:(e,t)=>e.content?t.renderChildren(e.content,`
`):``,markdownOptions:{indentsContent:!0},addCommands(){return{toggleBulletList:()=>({commands:e,chain:t})=>this.options.keepAttributes?t().toggleList(this.name,this.options.itemTypeName,this.options.keepMarks).updateAttributes(Nf,this.editor.getAttributes(Pf)).run():e.toggleList(this.name,this.options.itemTypeName,this.options.keepMarks)}},addKeyboardShortcuts(){return{"Mod-Shift-8":()=>this.editor.commands.toggleBulletList()}},addInputRules(){let e=Mt({find:Ff,type:this.type});return(this.options.keepMarks||this.options.keepAttributes)&&(e=Mt({find:Ff,type:this.type,keepMarks:this.options.keepMarks,keepAttributes:this.options.keepAttributes,getAttributes:()=>this.editor.getAttributes(Pf),editor:this.editor})),[e]}}),Lf=(e,t,n)=>{let{selection:r}=e;if(!r.empty)return null;let{$from:i}=r;if(!i.parent.isTextblock||i.parentOffset!==i.parent.content.size)return null;let a=-1;for(let e=i.depth;e>0;--e)if(i.node(e).type.name===t){a=e;break}if(a<0)return null;let o=i.node(a),s=i.index(a);if(s+1>=o.childCount)return null;let c=o.child(s+1);if(!n.includes(c.type.name))return null;let l=e.schema.nodes[t],u=!1;if(c.forEach(e=>{e.type===l&&e.childCount>1&&(u=!0)}),!u)return null;let d=e.doc.resolve(i.after()).nodeAfter;if(!d||!n.includes(d.type.name))return null;let f=[];return d.forEach(e=>{f.push(e)}),f.length===0?null:{listItemDepth:a,nestedList:d,nestedListPos:i.after(),insertPos:i.after(a),items:f}},Rf=(e,t,n,r)=>{let i=Lf(e,n,r);if(!i)return!1;let{selection:a}=e,{nestedList:o,nestedListPos:s,insertPos:c,items:l}=i,u=e.tr;u.delete(s,s+o.nodeSize);let d=u.mapping.map(c);return u.insert(d,k.from(l)),u.setSelection(a.map(u.doc,u.mapping)),t&&t(u),!0},zf=(e,t,n)=>Rf(e.state,e.view.dispatch,t,n),Bf=(e,t)=>w.create({name:`${e}BranchingDeleteKeymap`,priority:101,addKeyboardShortcuts(){let n=()=>zf(this.editor,e,t);return{Delete:n,"Mod-Delete":n}}}),Vf=[[1e3,`m`],[900,`cm`],[500,`d`],[400,`cd`],[100,`c`],[90,`xc`],[50,`l`],[40,`xl`],[10,`x`],[9,`ix`],[5,`v`],[4,`iv`],[1,`i`]],Hf=`abcdefghijklmnopqrstuvwxyz`,Uf=String.raw`\d+|[ivxlcdmIVXLCDM]+|${`[a-zA-Z]{1,2}`}`;function Wf(e){let t=e,n=``;for(let[e,r]of Vf)for(;t>=e;)n+=r,t-=e;return n}function Gf(e){return Wf(e).toUpperCase()}function Kf(e){let t=e.toLowerCase(),n=0,r=0;for(;n<t.length;){let e=!1;for(let[i,a]of Vf)if(t.startsWith(a,n)){r+=i,n+=a.length,e=!0;break}if(!e)return 0}return r}function qf(e){if(!/^[ivxlcdmIVXLCDM]+$/.test(e))return!1;let t=Kf(e);return t<=0?!1:(e===e.toLowerCase()?Wf(t):Gf(t))===e}function Jf(e){let t=e.toLowerCase();if(t.length===1)return t.charCodeAt(0)-97+1;if(t.length===2){let e=t.charCodeAt(0)-97,n=t.charCodeAt(1)-97;return(e+1)*26+n+1}return 0}function Yf(e){if(e<=26)return Hf[e-1];let t=Math.floor((e-1)/26)-1,n=(e-1)%26;return t<0?Hf[n]:Hf[t]+Hf[n]}function Xf(e){if(!(!e||/^\d+$/.test(e))){if(qf(e))return e===e.toLowerCase()?`i`:`I`;if(/^[a-z]{1,2}$/.test(e))return`a`;if(/^[A-Z]{1,2}$/.test(e))return`A`}}function Zf(e){if(/^\d+$/.test(e))return parseInt(e,10);let t=Xf(e);if(t===`i`||t===`I`)return Kf(e);if(t===`a`||t===`A`){let t=Jf(e);return t>0?t:1}let n=parseInt(e,10);return Number.isNaN(n)?1:n}function Qf(e,t){if(e===`numeric`)return String(t);switch(e){case`a`:return Yf(t);case`A`:return Yf(t).toUpperCase();case`i`:return Wf(t);case`I`:return Gf(t);default:return String(t)}}function $f(e){if(e.length===0)return!1;let t=Xf(e[0])??`numeric`,n=Zf(e[0]);if(n<1)return!1;for(let r=0;r<e.length;r++){let i=Qf(t,n+r);if(e[r]!==i)return!1}return!0}function ep(e){return{type:Xf(e),start:Zf(e)}}function tp(e){let{type:t,start:n}=ep(e),r={};return t&&(r.type=t),n!==1&&(r.start=n),r}function np(e,t,n=`. `){let r=t+1;if(!e||e===`1`)return`${r}${n}`;switch(e){case`a`:return`${Yf(r)}${n}`;case`A`:return`${Yf(r).toUpperCase()}${n}`;case`i`:return`${Wf(r)}${n}`;case`I`:return`${Gf(r)}${n}`;default:return`${r}${n}`}}function rp(e){let t=e.tokens?.[0];return!!(e.text&&e.tokens?.length===1&&t?.type===`list`&&t.ordered&&t.raw===e.text)}function ip(e,t){return t.tokenizeInline?t.parseInline(t.tokenizeInline(e)):t.parseInline([{type:`text`,raw:e,text:e}])}var ap=j.create({name:`listItem`,addOptions(){return{HTMLAttributes:{},bulletListTypeName:`bulletList`,orderedListTypeName:`orderedList`}},content:`paragraph block*`,defining:!0,parseHTML(){return[{tag:`li`}]},renderHTML({HTMLAttributes:e}){return[`li`,A(this.options.HTMLAttributes,e),0]},markdownTokenName:`list_item`,parseMarkdown:(e,t)=>{if(e.type!==`list_item`)return[];let n=t.parseBlockChildren??t.parseChildren,r=[];if(e.tokens&&e.tokens.length>0){if(rp(e))return{type:`listItem`,content:[{type:`paragraph`,content:ip(e.text||``,t)}]};if(e.tokens.some(e=>e.type===`paragraph`))r=n(e.tokens);else{let i=e.tokens[0];if(i&&i.type===`text`&&i.tokens&&i.tokens.length>0){if(r=[{type:`paragraph`,content:t.parseInline(i.tokens)}],e.tokens.length>1){let t=n(e.tokens.slice(1));r.push(...t)}}else r=n(e.tokens)}}return r.length===0&&(r=[{type:`paragraph`,content:[]}]),{type:`listItem`,content:r}},renderMarkdown:(e,t,n)=>xt(e,t,e=>{if(e.parentType===`bulletList`)return`- `;if(e.parentType===`orderedList`){var t,n;let r=((t=e.meta)==null||(t=t.parentAttrs)==null?void 0:t.start)||1;return np((n=e.meta)==null||(n=n.parentAttrs)==null?void 0:n.type,r-1+(e.index||0),`. `)}return`- `},n),addExtensions(){return[Bf(this.name,[this.options.bulletListTypeName,this.options.orderedListTypeName])]},addKeyboardShortcuts(){return{Enter:()=>this.editor.commands.splitListItem(this.name),Tab:()=>this.editor.commands.sinkListItem(this.name),"Shift-Tab":()=>this.editor.commands.liftListItem(this.name)}}}),op=(e,t)=>{let{$from:n}=t.selection,r=Ke(e,t.schema),i=null,a=n.depth,o=n.pos,s=null;for(;a>0&&s===null;)i=n.node(a),i.type===r?s=a:(--a,--o);return s===null?null:{$pos:t.doc.resolve(o),depth:s}},sp=(e,t)=>{let n=op(e,t);if(!n)return!1;let[,r]=we(t,e,n.$pos.pos+4);return r},cp=(e,t,n)=>{let{$anchor:r}=e.selection,i=Math.max(0,r.pos-2),a=e.doc.resolve(i).node();return!(!a||!n.includes(a.type.name))},lp=(e,t,n)=>{if(e.commands.undoInputRule())return!0;if(e.state.selection.from!==e.state.selection.to)return!1;if(!et(e.state,t)&&cp(e.state,t,n)){let{$anchor:n}=e.state.selection,r=e.state.doc.resolve(n.before()-1),i=[];r.node().descendants((e,n)=>{e.type.name===t&&i.push({node:e,pos:n})});let a=i.at(-1);if(!a)return!1;let o=e.state.doc.resolve(r.start()+a.pos+1);return e.chain().cut({from:n.start()-1,to:n.end()+1},o.end()).joinForward().run()}if(!et(e.state,t)||!De(e.state))return!1;let{$from:r}=e.state.selection,i=r.depth-1;return r.node(i).type!==e.schema.nodes[t]||r.index(i)!==0?!1:e.chain().liftListItem(t).run()},up=(e,t)=>{let n=sp(e,t),r=op(e,t);return!r||!n?!1:n>r.depth},dp=(e,t)=>{let n=sp(e,t),r=op(e,t);return!r||!n?!1:n<r.depth},fp=(e,t)=>{if(!et(e.state,t)||!Ft(e.state,t))return!1;let{selection:n}=e.state,{$from:r,$to:i}=n;return!n.empty&&r.sameParent(i)?!1:up(t,e.state)?e.chain().focus(e.state.selection.from+4).lift(t).joinBackward().run():dp(t,e.state)?e.chain().joinForward().joinBackward().run():e.commands.joinItemForward()},pp=(e,t,n)=>{let{state:r}=e,{selection:i}=r;if(!i.empty)return!1;let{$from:a}=i;if(a.parentOffset!==0||!a.parent.isTextblock||et(r,t))return!1;let o=Xe(a);if(!o||!n.includes(o.type.name))return!1;let s=o.lastChild;if(!s||s.type.name!==t)return!1;let c=a.parent;if(!s.canReplace(s.childCount,s.childCount,k.from(c)))return!1;let l=a.before(),u=a.after(),d=l-2;return e.commands.command(({tr:e,dispatch:t})=>(t&&(e.delete(l,u).insert(d,k.from(c)),e.setSelection(N.create(e.doc,d+1)),e.scrollIntoView()),!0))},mp=w.create({name:`listKeymap`,addOptions(){return{listTypes:[{itemName:`listItem`,wrapperNames:[`bulletList`,`orderedList`]},{itemName:`taskItem`,wrapperNames:[`taskList`]}]}},addKeyboardShortcuts(){return{Delete:({editor:e})=>{let t=!1;return this.options.listTypes.forEach(({itemName:n})=>{e.state.schema.nodes[n]!==void 0&&fp(e,n)&&(t=!0)}),t},"Mod-Delete":({editor:e})=>{let t=!1;return this.options.listTypes.forEach(({itemName:n})=>{e.state.schema.nodes[n]!==void 0&&fp(e,n)&&(t=!0)}),t},Backspace:({editor:e})=>{let t=!1;return this.options.listTypes.forEach(({itemName:n,wrapperNames:r})=>{e.state.schema.nodes[n]!==void 0&&lp(e,n,r)&&(t=!0)}),t},"Mod-Backspace":({editor:e})=>{let t=!1;return this.options.listTypes.forEach(({itemName:n,wrapperNames:r})=>{e.state.schema.nodes[n]!==void 0&&lp(e,n,r)&&(t=!0)}),t},Tab:({editor:e})=>{for(let{itemName:t,wrapperNames:n}of this.options.listTypes)if(e.state.schema.nodes[t]!==void 0&&pp(e,t,n))return!0;return!1}}}}),hp=RegExp(`^(\\s*)(${Uf})([.)])\\s+(.*)$`),gp=/^\s/,_p={heading:/^#{1,6}(?:\s|$)/,bulletItem:/^[-+*]\s+/,codeFence:/^(?:```|~~~)/,blockMath:/^\$\$/,thematicBreak:/^(?:(?:-[ \t]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})$/};function vp(e){return hp.test(e.trimStart())}function yp(e){let t=e.trimStart();return _p.bulletItem.test(t)||vp(t)||_p.heading.test(t)||_p.thematicBreak.test(t)&&!t.startsWith(`-`)||/^>\s?/.test(t)||_p.codeFence.test(t)||_p.blockMath.test(t)}function bp(e){return Object.values(_p).some(t=>t.test(e))}function xp(e){let t=[],n=[],r=!1;return e.forEach(e=>{if(r){n.push(e);return}if(e.trim()===``){r=!0,n.push(e);return}if(t.length>0&&yp(e)){r=!0,n.push(e);return}t.push(e)}),{paragraphLines:t,blockLines:n}}function Sp(e){let t=[],n=0,r=0;for(;n<e.length;){let i=e[n],a=i.match(hp);if(!a)break;let[,o,s,c,l]=a,u=o.length,d=parseInt(s,10),f=isNaN(d)?Xf(s):void 0,p=isNaN(d)?Zf(s):d,m=[l],h=n+1,g=[i],_=!1;for(;h<e.length;){let t=e[h];if(t.match(hp))break;if(t.trim()===``)g.push(t),m.push(``),_=!0,h+=1;else if(t.match(gp)){let e=t.length-t.trimStart().length,n=u+s.length+1;g.push(t),m.push(t.slice(Math.min(e,n))),h+=1}else{if(_||bp(t))break;g.push(t),m.push(t),h+=1}}t.push({indent:u,number:p,type:f,content:m.join(`
`).trim(),contentLines:m,raw:g.join(`
`)}),r=h,n=h}return[t,r]}var Cp=RegExp(`^(${Uf})([.)])\\s+(.+)$`);function wp(e){let t=e.split(`
`).filter(e=>e.trim().length>0);if(t.length===0)return null;let n=[];for(let e of t){let t=e.trim().match(Cp);if(!t)return null;n.push({marker:t[1],content:t[3]})}return $f(n.map(e=>e.marker))?{type:`orderedList`,attrs:tp(n[0].marker),content:n.map(e=>({type:`listItem`,content:[{type:`paragraph`,content:[{type:`text`,text:e.content}]}]}))}:null}function Tp(e,t,n){let r=[],i=0;for(;i<e.length;){let a=e[i];if(a.indent===t){let{paragraphLines:o,blockLines:s}=xp(a.contentLines),c=o.join(`
`).trim(),l=[];c&&l.push({type:`paragraph`,raw:c,tokens:n.inlineTokens(c)});let u=s.join(`
`).trim();if(u){let e=n.blockTokens(u);l.push(...e)}let d=i+1,f=[];for(;d<e.length&&e[d].indent>t;)f.push(e[d]),d+=1;if(f.length>0){let e=Tp(f,Math.min(...f.map(e=>e.indent)),n);l.push({type:`list`,ordered:!0,start:f[0].number,typeMarker:f[0].type,items:e,raw:f.map(e=>e.raw).join(`
`)})}r.push({type:`list_item`,raw:a.raw,tokens:l}),i=d}else i+=1}return r}function Ep(e,t){return e.map(e=>{if(e.type!==`list_item`)return t.parseChildren([e])[0];let n=[];return e.tokens&&e.tokens.length>0&&e.tokens.forEach(e=>{if(e.type===`paragraph`||e.type===`list`||e.type===`blockquote`||e.type===`code`)n.push(...t.parseChildren([e]));else if(e.type===`text`&&e.tokens){let r=t.parseChildren([e]);n.push({type:`paragraph`,content:r})}else{let r=t.parseChildren([e]);r.length>0&&n.push(...r)}}),{type:`listItem`,content:n}})}var Dp=`listItem`,Op=`textStyle`,kp=/^(\d+)\.\s$/;function Ap(e){let t=e.match(/list-style-type\s*:\s*([^;]+)/i);if(!t)return null;switch(t[1].trim().toLowerCase()){case`upper-roman`:return`I`;case`lower-roman`:return`i`;case`upper-alpha`:case`upper-latin`:return`A`;case`lower-alpha`:case`lower-latin`:return`a`;default:return null}}var jp=j.create({name:`orderedList`,addOptions(){return{itemTypeName:`listItem`,HTMLAttributes:{},keepMarks:!1,keepAttributes:!1}},group:`block list`,content(){return`${this.options.itemTypeName}+`},addAttributes(){return{start:{default:1,parseHTML:e=>e.hasAttribute(`start`)?parseInt(e.getAttribute(`start`)||``,10):1},type:{default:null,parseHTML:e=>{let t=e.getAttribute(`type`);if(t)return t;let n=e.getAttribute(`style`);if(n){let e=Ap(n);if(e)return e}let r=e.querySelector(`li`);if(r){let e=r.getAttribute(`style`);if(e){let t=Ap(e);if(t)return t}}return null}}}},parseHTML(){return[{tag:`ol`}]},renderHTML({HTMLAttributes:e}){let{start:t,type:n,...r}=e,i=A(this.options.HTMLAttributes,r);return t!==1&&(i.start=t),n&&n!==`1`&&(i.type=n),[`ol`,i,0]},markdownTokenName:`list`,parseMarkdown:(e,t)=>{if(e.type!==`list`||!e.ordered)return[];let n=e.start||1,r=e.typeMarker,i=e.items?Ep(e.items,t):[],a={};return n!==1&&(a.start=n),r&&(a.type=r),Object.keys(a).length>0?{type:`orderedList`,attrs:a,content:i}:{type:`orderedList`,content:i}},renderMarkdown:(e,t)=>e.content?t.renderChildren(e.content,`
`):``,markdownTokenizer:{name:`orderedList`,level:`block`,start:()=>-1,tokenize:(e,t,n)=>{let r=e.split(`
`),[i,a]=Sp(r);if(i.length===0)return;let o=Tp(i,i[0].indent,n);if(o.length!==0)return{type:`list`,ordered:!0,start:i[0]?.number||1,typeMarker:i[0]?.type,items:o,raw:r.slice(0,a).join(`
`)}}},markdownOptions:{indentsContent:!0},addCommands(){return{toggleOrderedList:()=>({commands:e,chain:t})=>this.options.keepAttributes?t().toggleList(this.name,this.options.itemTypeName,this.options.keepMarks).updateAttributes(Dp,this.editor.getAttributes(Op)).run():e.toggleList(this.name,this.options.itemTypeName,this.options.keepMarks)}},addKeyboardShortcuts(){return{"Mod-Shift-7":()=>this.editor.commands.toggleOrderedList()}},addProseMirrorPlugins(){return[new T({props:{handlePaste:(e,t)=>{if((t.clipboardData?.getData(`text/html`))?.trim())return!1;let n=t.clipboardData?.getData(`text/plain`);if(!n)return!1;let r=wp(n);if(!r)return!1;try{let t=e.state.schema.nodeFromJSON(r),n=e.state.tr.replaceSelectionWith(t);return e.dispatch(n),!0}catch{return!1}}}})]},addInputRules(){let e=(e,t)=>(!t.attrs.type||t.attrs.type===`1`)&&t.childCount+t.attrs.start===+e[1],t=Mt({find:kp,type:this.type,getAttributes:e=>({start:+e[1]}),joinPredicate:e});return(this.options.keepMarks||this.options.keepAttributes)&&(t=Mt({find:kp,type:this.type,keepMarks:this.options.keepMarks,keepAttributes:this.options.keepAttributes,getAttributes:e=>({start:+e[1],...this.editor.getAttributes(Op)}),joinPredicate:e,editor:this.editor})),[t]}}),Mp=/^\s*(\[([( |x])?\])\s$/,Np=`position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0`,Pp=(e,t,n)=>{var r;return(n==null||(r=n.checkboxLabel)==null?void 0:r.call(n,e,t))||`Task item checkbox for ${e.textContent||`empty task item`}`},Fp=j.create({name:`taskItem`,addOptions(){return{nested:!1,HTMLAttributes:{},taskListTypeName:`taskList`,a11y:void 0}},content(){return this.options.nested?`paragraph block*`:`paragraph+`},defining:!0,addAttributes(){return{checked:{default:!1,keepOnSplit:!1,parseHTML:e=>{let t=e.getAttribute(`data-checked`);return t===``||t===`true`},renderHTML:e=>({"data-checked":e.checked})}}},parseHTML(){return[{tag:`li[data-type="${this.name}"]`,priority:51,contentElement:e=>e.querySelector(`div`)??e}]},renderHTML({node:e,HTMLAttributes:t}){return[`li`,A(this.options.HTMLAttributes,t,{"data-type":this.name}),[`label`,[`input`,{type:`checkbox`,checked:e.attrs.checked?`checked`:null}],[`span`]],[`div`,0]]},parseMarkdown:(e,t)=>{let n=[];if(e.tokens&&e.tokens.length>0?n.push(t.createNode(`paragraph`,{},t.parseInline(e.tokens))):e.text?n.push(t.createNode(`paragraph`,{},[t.createNode(`text`,{text:e.text})])):n.push(t.createNode(`paragraph`,{},[])),e.nestedTokens&&e.nestedTokens.length>0){let r=t.parseChildren(e.nestedTokens);n.push(...r)}return t.createNode(`taskItem`,{checked:e.checked||!1},n)},renderMarkdown:(e,t)=>{let n=`- [${e.attrs?.checked?`x`:` `}] `;return xt(e,t,n)},addExtensions(){return this.options.nested?[Bf(this.name,[this.options.taskListTypeName])]:[]},addKeyboardShortcuts(){let e={Enter:()=>this.editor.commands.splitListItem(this.name),"Shift-Tab":()=>this.editor.commands.liftListItem(this.name)};return this.options.nested?{...e,Tab:()=>this.editor.commands.sinkListItem(this.name)}:e},addNodeView(){return({node:e,HTMLAttributes:t,getPos:n,editor:r})=>{let i=document.createElement(`li`),a=document.createElement(`label`),o=document.createElement(`span`),s=document.createElement(`input`),c=document.createElement(`div`);o.style.cssText=Np;let l=e=>{let t=Pp(e,e.attrs.checked,this.options.a11y);s.setAttribute(`aria-label`,t),o.textContent=t};l(e),a.contentEditable=`false`,s.type=`checkbox`,s.addEventListener(`mousedown`,e=>e.preventDefault()),s.addEventListener(`change`,t=>{if(!r.isEditable&&!this.options.onReadOnlyChecked){s.checked=!s.checked;return}let{checked:i}=t.target;r.isEditable&&typeof n==`function`&&r.chain().focus(void 0,{scrollIntoView:!1}).command(({tr:e})=>{let t=n();if(typeof t!=`number`)return!1;let r=e.doc.nodeAt(t);return e.setNodeMarkup(t,void 0,{...r?.attrs,checked:i}),!0}).run(),!r.isEditable&&this.options.onReadOnlyChecked&&(this.options.onReadOnlyChecked(e,i)||(s.checked=!s.checked))}),Object.entries(this.options.HTMLAttributes).forEach(([e,t])=>{i.setAttribute(e,t)}),i.dataset.checked=e.attrs.checked,s.checked=e.attrs.checked,a.append(s,o),i.append(a,c),Object.entries(t).forEach(([e,t])=>{i.setAttribute(e,t)});let u=new Set(Object.keys(t));return{dom:i,contentDOM:c,update:e=>{if(e.type!==this.type)return!1;i.dataset.checked=e.attrs.checked,s.checked=e.attrs.checked,l(e);let t=r.extensionManager.attributes,n=Se(e,t),a=new Set(Object.keys(n)),o=this.options.HTMLAttributes;return u.forEach(e=>{a.has(e)||(e in o?i.setAttribute(e,o[e]):i.removeAttribute(e))}),Object.entries(n).forEach(([e,t])=>{t==null?e in o?i.setAttribute(e,o[e]):i.removeAttribute(e):i.setAttribute(e,t)}),u=a,!0}}}},addInputRules(){return[Mt({find:Mp,type:this.type,getAttributes:e=>({checked:e[e.length-1]===`x`})})]}}),Ip=j.create({name:`taskList`,addOptions(){return{itemTypeName:`taskItem`,HTMLAttributes:{}}},group:`block list`,content(){return`${this.options.itemTypeName}+`},parseHTML(){return[{tag:`ul[data-type="${this.name}"]`,priority:51}]},renderHTML({HTMLAttributes:e}){return[`ul`,A(this.options.HTMLAttributes,e,{"data-type":this.name}),0]},parseMarkdown:(e,t)=>t.createNode(`taskList`,{},t.parseChildren(e.items||[])),renderMarkdown:(e,t)=>e.content?t.renderChildren(e.content,`
`):``,markdownTokenizer:{name:`taskList`,level:`block`,start(e){let t=e.match(/^\s*[-+*]\s+\[([ xX])\]\s+/)?.index;return t===void 0?-1:t},tokenize(e,t,n){let r=e=>{let t=At(e,{itemPattern:/^(\s*)([-+*])\s+\[([ xX])\]\s+(.*)$/,extractItemData:e=>({indentLevel:e[1].length,mainContent:e[4],checked:e[3].toLowerCase()===`x`}),createToken:(e,t)=>({type:`taskItem`,raw:``,mainContent:e.mainContent,indentLevel:e.indentLevel,checked:e.checked,text:e.mainContent,tokens:n.inlineTokens(e.mainContent),nestedTokens:t}),customNestedParser:r},n);if(t){let r={type:`taskList`,raw:t.raw,items:t.items},i=e.slice(t.raw.length);return i.trim()?[r,...n.blockTokens(i)]:[r]}return n.blockTokens(e)},i=At(e,{itemPattern:/^(\s*)([-+*])\s+\[([ xX])\]\s+(.*)$/,extractItemData:e=>({indentLevel:e[1].length,mainContent:e[4],checked:e[3].toLowerCase()===`x`}),createToken:(e,t)=>({type:`taskItem`,raw:``,mainContent:e.mainContent,indentLevel:e.indentLevel,checked:e.checked,text:e.mainContent,tokens:n.inlineTokens(e.mainContent),nestedTokens:t}),customNestedParser:r},n);if(i)return{type:`taskList`,raw:i.raw,items:i.items}}},markdownOptions:{indentsContent:!0},addCommands(){return{toggleTaskList:()=>({commands:e})=>e.toggleList(this.name,this.options.itemTypeName)}},addKeyboardShortcuts(){return{"Mod-Shift-9":()=>this.editor.commands.toggleTaskList()}}});w.create({name:`listKit`,addExtensions(){let e=[];return this.options.bulletList!==!1&&e.push(If.configure(this.options.bulletList)),this.options.listItem!==!1&&e.push(ap.configure(this.options.listItem)),this.options.listKeymap!==!1&&e.push(mp.configure(this.options.listKeymap)),this.options.orderedList!==!1&&e.push(jp.configure(this.options.orderedList)),this.options.taskItem!==!1&&e.push(Fp.configure(this.options.taskItem)),this.options.taskList!==!1&&e.push(Ip.configure(this.options.taskList)),e}});var Lp=`&nbsp;`,Rp=`\xA0`,zp=j.create({name:`paragraph`,priority:1e3,addOptions(){return{HTMLAttributes:{}}},group:`block`,content:`inline*`,parseHTML(){return[{tag:`p`}]},renderHTML({HTMLAttributes:e}){return[`p`,A(this.options.HTMLAttributes,e),0]},parseMarkdown:(e,t)=>{let n=e.tokens||[];if(n.length===1&&n[0].type===`image`)return t.parseChildren([n[0]]);let r=t.parseInline(n);return n.length===1&&n[0].type===`text`&&(n[0].raw===Lp||n[0].text===Lp||n[0].raw===Rp||n[0].text===Rp)&&r.length===1&&r[0].type===`text`&&(r[0].text===Lp||r[0].text===Rp)?t.createNode(`paragraph`,void 0,[]):t.createNode(`paragraph`,void 0,r)},renderMarkdown:(e,t,n)=>{if(!e)return``;let r=Array.isArray(e.content)?e.content:[];if(r.length===0){var i,a;let e=Array.isArray(n==null||(i=n.previousNode)==null?void 0:i.content)?n.previousNode.content:[];return(n==null||(a=n.previousNode)==null?void 0:a.type)===`paragraph`&&e.length===0?Lp:``}return t.renderChildren(r)},addCommands(){return{setParagraph:()=>({commands:e})=>e.setNode(this.name)}},addKeyboardShortcuts(){return{"Mod-Alt-0":()=>this.editor.commands.setParagraph()}}}),Bp=/(?:^|\s)(~~(?!\s+~~)((?:[^~]+))~~(?!\s+~~))$/,Vp=/(?:^|\s)(~~(?!\s+~~)((?:[^~]+))~~(?!\s+~~))/g,Hp=Ie.create({name:`strike`,addOptions(){return{HTMLAttributes:{}}},parseHTML(){return[{tag:`s`},{tag:`del`},{tag:`strike`},{style:`text-decoration`,consuming:!1,getAttrs:e=>e.includes(`line-through`)?{}:!1}]},renderHTML({HTMLAttributes:e}){return[`s`,A(this.options.HTMLAttributes,e),0]},markdownTokenName:`del`,parseMarkdown:(e,t)=>t.applyMark(`strike`,t.parseInline(e.tokens||[])),renderMarkdown:(e,t)=>`~~${t.renderChildren(e)}~~`,addCommands(){return{setStrike:()=>({commands:e})=>e.setMark(this.name),toggleStrike:()=>({commands:e})=>e.toggleMark(this.name),unsetStrike:()=>({commands:e})=>e.unsetMark(this.name)}},addKeyboardShortcuts(){return{"Mod-Shift-s":()=>this.editor.commands.toggleStrike()}},addInputRules(){return[ze({find:Bp,type:this.type})]},addPasteRules(){return[ue({find:Vp,type:this.type})]}}),Up=j.create({name:`text`,group:`inline`,parseMarkdown:e=>({type:`text`,text:e.text||``}),renderMarkdown:e=>e.text||``}),Wp=Ie.create({name:`underline`,addOptions(){return{HTMLAttributes:{}}},parseHTML(){return[{tag:`u`},{style:`text-decoration`,consuming:!1,getAttrs:e=>e.includes(`underline`)?{}:!1}]},renderHTML({HTMLAttributes:e}){return[`u`,A(this.options.HTMLAttributes,e),0]},parseMarkdown(e,t){return t.applyMark(this.name||`underline`,t.parseInline(e.tokens||[]))},renderMarkdown(e,t){return`++${t.renderChildren(e)}++`},markdownTokenizer:{name:`underline`,level:`inline`,start(e){return e.indexOf(`++`)},tokenize(e,t,n){let r=/^(\+\+)([\s\S]+?)(\+\+)/.exec(e);if(!r)return;let i=r[2].trim();return{type:`underline`,raw:r[0],text:i,tokens:n.inlineTokens(i)}}},addCommands(){return{setUnderline:()=>({commands:e})=>e.setMark(this.name),toggleUnderline:()=>({commands:e})=>e.toggleMark(this.name),unsetUnderline:()=>({commands:e})=>e.unsetMark(this.name)}},addKeyboardShortcuts(){return{"Mod-u":()=>this.editor.commands.toggleUnderline(),"Mod-U":()=>this.editor.commands.toggleUnderline()}}}),Gp=/(?:^|\s)(==(?!\s+==)((?:[^=]+))==(?!\s+==))$/,Kp=/(?:^|\s)(==(?!\s+==)((?:[^=]+))==(?!\s+==))/g,qp=Ie.create({name:`highlight`,addOptions(){return{multicolor:!1,HTMLAttributes:{}}},addAttributes(){return this.options.multicolor?{color:{default:null,parseHTML:e=>e.getAttribute(`data-color`)||ke(e,`background-color`)||e.style.backgroundColor,renderHTML:e=>e.color?{"data-color":e.color,style:`background-color: ${e.color}; color: inherit`}:{}}}:{}},parseHTML(){return[{tag:`mark`}]},renderHTML({HTMLAttributes:e}){return[`mark`,A(this.options.HTMLAttributes,e),0]},renderMarkdown:(e,t)=>`==${t.renderChildren(e)}==`,parseMarkdown:(e,t)=>t.applyMark(`highlight`,t.parseInline(e.tokens||[])),markdownTokenizer:{name:`highlight`,level:`inline`,start:e=>e.indexOf(`==`),tokenize(e,t,n){let r=/^(==)([^=]+)(==)/.exec(e);if(r){let e=r[2].trim(),t=n.inlineTokens(e);return{type:`highlight`,raw:r[0],text:e,tokens:t}}}},addCommands(){return{setHighlight:e=>({commands:t})=>t.setMark(this.name,e),toggleHighlight:e=>({commands:t})=>t.toggleMark(this.name,e),unsetHighlight:()=>({commands:e})=>e.unsetMark(this.name)}},addKeyboardShortcuts(){return{"Mod-Shift-h":()=>this.editor.commands.toggleHighlight()}},addInputRules(){return[ze({find:Gp,type:this.type})]},addPasteRules(){return[ue({find:Kp,type:this.type})]}}),Jp=Ie.create({name:`subscript`,addOptions(){return{HTMLAttributes:{}}},parseHTML(){return[{tag:`sub`},{style:`vertical-align`,getAttrs(e){return e===`sub`&&null}}]},renderHTML({HTMLAttributes:e}){return[`sub`,A(this.options.HTMLAttributes,e),0]},addCommands(){return{setSubscript:()=>({commands:e})=>e.setMark(this.name),toggleSubscript:()=>({commands:e})=>e.toggleMark(this.name),unsetSubscript:()=>({commands:e})=>e.unsetMark(this.name)}},addKeyboardShortcuts(){return{"Mod-,":()=>this.editor.commands.toggleSubscript()}}}),Yp=Ie.create({name:`superscript`,addOptions(){return{HTMLAttributes:{}}},parseHTML(){return[{tag:`sup`},{style:`vertical-align`,getAttrs(e){return e===`super`&&null}}]},renderHTML({HTMLAttributes:e}){return[`sup`,A(this.options.HTMLAttributes,e),0]},addCommands(){return{setSuperscript:()=>({commands:e})=>e.setMark(this.name),toggleSuperscript:()=>({commands:e})=>e.toggleMark(this.name),unsetSuperscript:()=>({commands:e})=>e.unsetMark(this.name)}},addKeyboardShortcuts(){return{"Mod-.":()=>this.editor.commands.toggleSuperscript()}}}),Xp,Zp;if(typeof WeakMap<`u`){let e=new WeakMap;Xp=t=>e.get(t),Zp=(t,n)=>(e.set(t,n),n)}else{let e=[],t=0;Xp=t=>{for(let n=0;n<e.length;n+=2)if(e[n]==t)return e[n+1]},Zp=(n,r)=>(t==10&&(t=0),e[t++]=n,e[t++]=r)}var q=class{constructor(e,t,n,r){this.width=e,this.height=t,this.map=n,this.problems=r}findCell(e){for(let t=0;t<this.map.length;t++){let n=this.map[t];if(n!=e)continue;let r=t%this.width,i=t/this.width|0,a=r+1,o=i+1;for(let e=1;a<this.width&&this.map[t+e]==n;e++)a++;for(let e=1;o<this.height&&this.map[t+this.width*e]==n;e++)o++;return{left:r,top:i,right:a,bottom:o}}throw RangeError(`No cell with offset ${e} found`)}colCount(e){for(let t=0;t<this.map.length;t++)if(this.map[t]==e)return t%this.width;throw RangeError(`No cell with offset ${e} found`)}nextCell(e,t,n){let{left:r,right:i,top:a,bottom:o}=this.findCell(e);return t==`horiz`?(n<0?r==0:i==this.width)?null:this.map[a*this.width+(n<0?r-1:i)]:(n<0?a==0:o==this.height)?null:this.map[r+this.width*(n<0?a-1:o)]}rectBetween(e,t){let{left:n,right:r,top:i,bottom:a}=this.findCell(e),{left:o,right:s,top:c,bottom:l}=this.findCell(t);return{left:Math.min(n,o),top:Math.min(i,c),right:Math.max(r,s),bottom:Math.max(a,l)}}cellsInRect(e){let t=[],n={};for(let r=e.top;r<e.bottom;r++)for(let i=e.left;i<e.right;i++){let a=r*this.width+i,o=this.map[a];n[o]||(n[o]=!0,!(i==e.left&&i&&this.map[a-1]==o||r==e.top&&r&&this.map[a-this.width]==o)&&t.push(o))}return t}positionAt(e,t,n){for(let r=0,i=0;;r++){let a=i+n.child(r).nodeSize;if(r==e){let n=t+e*this.width,r=(e+1)*this.width;for(;n<r&&this.map[n]<i;)n++;return n==r?a-1:this.map[n]}i=a}}static get(e){return Xp(e)||Zp(e,Qp(e))}};function Qp(e){if(e.type.spec.tableRole!=`table`)throw RangeError(`Not a table node: `+e.type.name);let t=$p(e),n=e.childCount,r=[],i=0,a=null,o=[];for(let e=0,i=t*n;e<i;e++)r[e]=0;for(let s=0,c=0;s<n;s++){let l=e.child(s);c++;for(let e=0;;e++){for(;i<r.length&&r[i]!=0;)i++;if(e==l.childCount)break;let u=l.child(e),{colspan:d,rowspan:f,colwidth:p}=u.attrs;for(let e=0;e<f;e++){if(e+s>=n){(a||=[]).push({type:`overlong_rowspan`,pos:c,n:f-e});break}let l=i+e*t;for(let e=0;e<d;e++){r[l+e]==0?r[l+e]=c:(a||=[]).push({type:`collision`,row:s,pos:c,n:d-e});let n=p&&p[e];if(n){let r=(l+e)%t*2,i=o[r];i==null||i!=n&&o[r+1]==1?(o[r]=n,o[r+1]=1):i==n&&o[r+1]++}}}i+=d,c+=u.nodeSize}let u=(s+1)*t,d=0;for(;i<u;)r[i++]==0&&d++;d&&(a||=[]).push({type:`missing`,row:s,n:d}),c++}(t===0||n===0)&&(a||=[]).push({type:`zero_sized`});let s=new q(t,n,r,a),c=!1;for(let e=0;!c&&e<o.length;e+=2)o[e]!=null&&o[e+1]<n&&(c=!0);return c&&em(s,o,e),s}function $p(e){let t=-1,n=!1;for(let r=0;r<e.childCount;r++){let i=e.child(r),a=0;if(n)for(let t=0;t<r;t++){let n=e.child(t);for(let e=0;e<n.childCount;e++){let i=n.child(e);t+i.attrs.rowspan>r&&(a+=i.attrs.colspan)}}for(let e=0;e<i.childCount;e++){let t=i.child(e);a+=t.attrs.colspan,t.attrs.rowspan>1&&(n=!0)}t==-1?t=a:t!=a&&(t=Math.max(t,a))}return t}function em(e,t,n){e.problems||=[];let r={};for(let i=0;i<e.map.length;i++){let a=e.map[i];if(r[a])continue;r[a]=!0;let o=n.nodeAt(a);if(!o)throw RangeError(`No cell with offset ${a} found`);let s=null,c=o.attrs;for(let n=0;n<c.colspan;n++){let r=t[(i+n)%e.width*2];r!=null&&(!c.colwidth||c.colwidth[n]!=r)&&((s||=tm(c))[n]=r)}s&&e.problems.unshift({type:`colwidth mismatch`,pos:a,colwidth:s})}}function tm(e){if(e.colwidth)return e.colwidth.slice();let t=[];for(let n=0;n<e.colspan;n++)t.push(0);return t}function J(e){let t=e.cached.tableNodeTypes;if(!t){t=e.cached.tableNodeTypes={};for(let n in e.nodes){let r=e.nodes[n],i=r.spec.tableRole;i&&(t[i]=r)}}return t}var nm=new E(`selectingCells`);function rm(e){for(let t=e.depth-1;t>0;t--)if(e.node(t).type.spec.tableRole==`row`)return e.node(0).resolve(e.before(t+1));return null}function im(e){for(let t=e.depth;t>0;t--){let n=e.node(t).type.spec.tableRole;if(n===`cell`||n===`header_cell`)return e.node(t)}return null}function am(e){let t=e.selection.$head;for(let e=t.depth;e>0;e--)if(t.node(e).type.spec.tableRole==`row`)return!0;return!1}function om(e){let t=e.selection;if(`$anchorCell`in t&&t.$anchorCell)return t.$anchorCell.pos>t.$headCell.pos?t.$anchorCell:t.$headCell;if(`node`in t&&t.node&&t.node.type.spec.tableRole==`cell`)return t.$anchor;let n=rm(t.$head)||sm(t.$head);if(n)return n;throw RangeError(`No cell found around position ${t.head}`)}function sm(e){for(let t=e.nodeAfter,n=e.pos;t;t=t.firstChild,n++){let r=t.type.spec.tableRole;if(r==`cell`||r==`header_cell`)return e.doc.resolve(n)}for(let t=e.nodeBefore,n=e.pos;t;t=t.lastChild,n--){let r=t.type.spec.tableRole;if(r==`cell`||r==`header_cell`)return e.doc.resolve(n-t.nodeSize)}}function cm(e){return e.parent.type.spec.tableRole==`row`&&!!e.nodeAfter}function lm(e){return e.node(0).resolve(e.pos+e.nodeAfter.nodeSize)}function um(e,t){return e.depth==t.depth&&e.pos>=t.start(-1)&&e.pos<=t.end(-1)}function dm(e,t,n){let r=e.node(-1),i=q.get(r),a=e.start(-1),o=i.nextCell(e.pos-a,t,n);return o==null?null:e.node(0).resolve(a+o)}function fm(e,t,n=1){let r={...e,colspan:e.colspan-n};return r.colwidth&&(r.colwidth=r.colwidth.slice(),r.colwidth.splice(t,n),r.colwidth.some(e=>e>0)||(r.colwidth=null)),r}function pm(e,t,n=1){let r={...e,colspan:e.colspan+n};if(r.colwidth){r.colwidth=r.colwidth.slice();for(let e=0;e<n;e++)r.colwidth.splice(t,0,0)}return r}function mm(e,t,n){let r=J(t.type.schema).header_cell;for(let i=0;i<e.height;i++)if(t.nodeAt(e.map[n+i*e.width]).type!=r)return!1;return!0}var Y=class e extends D{constructor(e,t=e){let n=e.node(-1),r=q.get(n),i=e.start(-1),a=r.rectBetween(e.pos-i,t.pos-i),o=e.node(0),s=r.cellsInRect(a).filter(e=>e!=t.pos-i);s.unshift(t.pos-i);let c=s.map(e=>{let t=n.nodeAt(e);if(!t)throw RangeError(`No cell with offset ${e} found`);let r=i+e+1;return new Ve(o.resolve(r),o.resolve(r+t.content.size))});super(c[0].$from,c[0].$to,c),this.$anchorCell=e,this.$headCell=t}map(t,n){let r=t.resolve(n.map(this.$anchorCell.pos)),i=t.resolve(n.map(this.$headCell.pos));if(cm(r)&&cm(i)&&um(r,i)){let t=this.$anchorCell.node(-1)!=r.node(-1);return t&&this.isRowSelection()?e.rowSelection(r,i):t&&this.isColSelection()?e.colSelection(r,i):new e(r,i)}return N.between(r,i)}content(){let e=this.$anchorCell.node(-1),t=q.get(e),n=this.$anchorCell.start(-1),r=t.rectBetween(this.$anchorCell.pos-n,this.$headCell.pos-n),i={},a=[];for(let n=r.top;n<r.bottom;n++){let o=[];for(let a=n*t.width+r.left,s=r.left;s<r.right;s++,a++){let n=t.map[a];if(i[n])continue;i[n]=!0;let s=t.findCell(n),c=e.nodeAt(n);if(!c)throw RangeError(`No cell with offset ${n} found`);let l=r.left-s.left,u=s.right-r.right;if(l>0||u>0){let e=c.attrs;if(l>0&&(e=fm(e,0,l)),u>0&&(e=fm(e,e.colspan-u,u)),s.left<r.left){if(c=c.type.createAndFill(e),!c)throw RangeError(`Could not create cell with attrs ${JSON.stringify(e)}`)}else c=c.type.create(e,c.content)}if(s.top<r.top||s.bottom>r.bottom){let e={...c.attrs,rowspan:Math.min(s.bottom,r.bottom)-Math.max(s.top,r.top)};c=s.top<r.top?c.type.createAndFill(e):c.type.create(e,c.content)}o.push(c)}a.push(e.child(n).copy(k.from(o)))}let o=this.isColSelection()&&this.isRowSelection()?e:a;return new M(k.from(o),1,1)}replace(e,t=M.empty){let n=e.steps.length,r=this.ranges;for(let i=0;i<r.length;i++){let{$from:a,$to:o}=r[i],s=e.mapping.slice(n);e.replace(s.map(a.pos),s.map(o.pos),i?M.empty:t)}let i=D.findFrom(e.doc.resolve(e.mapping.slice(n).map(this.to)),-1);i&&e.setSelection(i)}replaceWith(e,t){this.replace(e,new M(k.from(t),0,0))}forEachCell(e){let t=this.$anchorCell.node(-1),n=q.get(t),r=this.$anchorCell.start(-1),i=n.cellsInRect(n.rectBetween(this.$anchorCell.pos-r,this.$headCell.pos-r));for(let n=0;n<i.length;n++)e(t.nodeAt(i[n]),r+i[n])}isColSelection(){let e=this.$anchorCell.index(-1),t=this.$headCell.index(-1);if(Math.min(e,t)>0)return!1;let n=e+this.$anchorCell.nodeAfter.attrs.rowspan,r=t+this.$headCell.nodeAfter.attrs.rowspan;return Math.max(n,r)==this.$headCell.node(-1).childCount}static colSelection(t,n=t){let r=t.node(-1),i=q.get(r),a=t.start(-1),o=i.findCell(t.pos-a),s=i.findCell(n.pos-a),c=t.node(0);return o.top<=s.top?(o.top>0&&(t=c.resolve(a+i.map[o.left])),s.bottom<i.height&&(n=c.resolve(a+i.map[i.width*(i.height-1)+s.right-1]))):(s.top>0&&(n=c.resolve(a+i.map[s.left])),o.bottom<i.height&&(t=c.resolve(a+i.map[i.width*(i.height-1)+o.right-1]))),new e(t,n)}isRowSelection(){let e=this.$anchorCell.node(-1),t=q.get(e),n=this.$anchorCell.start(-1),r=t.colCount(this.$anchorCell.pos-n),i=t.colCount(this.$headCell.pos-n);if(Math.min(r,i)>0)return!1;let a=r+this.$anchorCell.nodeAfter.attrs.colspan,o=i+this.$headCell.nodeAfter.attrs.colspan;return Math.max(a,o)==t.width}eq(t){return t instanceof e&&t.$anchorCell.pos==this.$anchorCell.pos&&t.$headCell.pos==this.$headCell.pos}static rowSelection(t,n=t){let r=t.node(-1),i=q.get(r),a=t.start(-1),o=i.findCell(t.pos-a),s=i.findCell(n.pos-a),c=t.node(0);return o.left<=s.left?(o.left>0&&(t=c.resolve(a+i.map[o.top*i.width])),s.right<i.width&&(n=c.resolve(a+i.map[i.width*(s.top+1)-1]))):(s.left>0&&(n=c.resolve(a+i.map[s.top*i.width])),o.right<i.width&&(t=c.resolve(a+i.map[i.width*(o.top+1)-1]))),new e(t,n)}toJSON(){return{type:`cell`,anchor:this.$anchorCell.pos,head:this.$headCell.pos}}static fromJSON(t,n){return new e(t.resolve(n.anchor),t.resolve(n.head))}static create(t,n,r=n){return new e(t.resolve(n),t.resolve(r))}getBookmark(){return new hm(this.$anchorCell.pos,this.$headCell.pos)}};Y.prototype.visible=!1,D.jsonID(`cell`,Y);var hm=class e{constructor(e,t){this.anchor=e,this.head=t}map(t){return new e(t.map(this.anchor),t.map(this.head))}resolve(e){let t=e.resolve(this.anchor),n=e.resolve(this.head);return t.parent.type.spec.tableRole==`row`&&n.parent.type.spec.tableRole==`row`&&t.index()<t.parent.childCount&&n.index()<n.parent.childCount&&um(t,n)?new Y(t,n):D.near(n,1)}};function gm(e){if(!(e.selection instanceof Y))return null;let t=[];return e.selection.forEachCell((e,n)=>{t.push(Et.node(n,n+e.nodeSize,{class:`selectedCell`}))}),Kt.create(e.doc,t)}function _m({$from:e,$to:t}){if(e.pos==t.pos||e.pos<t.pos-6)return!1;let n=e.pos,r=t.pos,i=e.depth;for(;i>=0&&!(e.after(i+1)<e.end(i));i--,n++);for(let e=t.depth;e>=0&&!(t.before(e+1)>t.start(e));e--,r--);return n==r&&/row|table/.test(e.node(i).type.spec.tableRole)}function vm({$from:e,$to:t}){let n,r;for(let t=e.depth;t>0;t--){let r=e.node(t);if(r.type.spec.tableRole===`cell`||r.type.spec.tableRole===`header_cell`){n=r;break}}for(let e=t.depth;e>0;e--){let n=t.node(e);if(n.type.spec.tableRole===`cell`||n.type.spec.tableRole===`header_cell`){r=n;break}}return n!==r&&t.parentOffset===0}function ym(e,t,n){let r=(t||e).selection,i=(t||e).doc,a,o;if(r instanceof O&&(o=r.node.type.spec.tableRole)){if(o==`cell`||o==`header_cell`)a=Y.create(i,r.from);else if(o==`row`){let e=i.resolve(r.from+1);a=Y.rowSelection(e,e)}else if(!n){let e=q.get(r.node),t=r.from+1,n=t+e.map[e.width*e.height-1];a=Y.create(i,t+1,n)}}else r instanceof N&&_m(r)?a=N.create(i,r.from):r instanceof N&&vm(r)&&(a=N.create(i,r.$from.start(),r.$from.end()));return a&&(t||=e.tr).setSelection(a),t}var bm=new E(`fix-tables`);function xm(e,t,n,r){let i=e.childCount,a=t.childCount;outer:for(let o=0,s=0;o<a;o++){let a=t.child(o);for(let t=s,r=Math.min(i,o+3);t<r;t++)if(e.child(t)==a){s=t+1,n+=a.nodeSize;continue outer}r(a,n),s<i&&e.child(s).sameMarkup(a)?xm(e.child(s),a,n+1,r):a.nodesBetween(0,a.content.size,r,n+1),n+=a.nodeSize}}function Sm(e,t){let n,r=(t,r)=>{t.type.spec.tableRole==`table`&&(n=Cm(e,t,r,n))};return t?t.doc!=e.doc&&xm(t.doc,e.doc,0,r):e.doc.descendants(r),n}function Cm(e,t,n,r){let i=q.get(t);if(!i.problems)return r;r||=e.tr;let a=[];for(let e=0;e<i.height;e++)a.push(0);for(let e=0;e<i.problems.length;e++){let o=i.problems[e];if(o.type==`collision`){let e=t.nodeAt(o.pos);if(!e)continue;let i=e.attrs;for(let e=0;e<i.rowspan;e++)a[o.row+e]+=o.n;r.setNodeMarkup(r.mapping.map(n+1+o.pos),null,fm(i,i.colspan-o.n,o.n))}else if(o.type==`missing`)a[o.row]+=o.n;else if(o.type==`overlong_rowspan`){let e=t.nodeAt(o.pos);if(!e)continue;r.setNodeMarkup(r.mapping.map(n+1+o.pos),null,{...e.attrs,rowspan:e.attrs.rowspan-o.n})}else if(o.type==`colwidth mismatch`){let e=t.nodeAt(o.pos);if(!e)continue;r.setNodeMarkup(r.mapping.map(n+1+o.pos),null,{...e.attrs,colwidth:o.colwidth})}else if(o.type==`zero_sized`){let e=r.mapping.map(n);r.delete(e,e+t.nodeSize)}}let o,s;for(let e=0;e<a.length;e++)a[e]&&(o??=e,s=e);for(let c=0,l=n+1;c<i.height;c++){let n=t.child(c),i=l+n.nodeSize,u=a[c];if(u>0){let t=`cell`;n.firstChild&&(t=n.firstChild.type.spec.tableRole);let a=[];for(let n=0;n<u;n++){let n=J(e.schema)[t].createAndFill();n&&a.push(n)}let d=(c==0||o==c-1)&&s==c?l+1:i-1;r.insert(r.mapping.map(d),a)}l=i}return r.setMeta(bm,{fixTables:!0})}function wm(e){let t=e.selection,n=om(e),r=n.node(-1),i=n.start(-1),a=q.get(r);return{...t instanceof Y?a.rectBetween(t.$anchorCell.pos-i,t.$headCell.pos-i):a.findCell(n.pos-i),tableStart:i,map:a,table:r}}function Tm(e,{map:t,tableStart:n,table:r},i){let a=i>0?-1:0;mm(t,r,i+a)&&(a=i==0||i==t.width?null:0);for(let o=0;o<t.height;o++){let s=o*t.width+i;if(i>0&&i<t.width&&t.map[s-1]==t.map[s]){let a=t.map[s],c=r.nodeAt(a);e.setNodeMarkup(e.mapping.map(n+a),null,pm(c.attrs,i-t.colCount(a))),o+=c.attrs.rowspan-1}else{let c=a==null?J(r.type.schema).cell:r.nodeAt(t.map[s+a]).type,l=t.positionAt(o,i,r);e.insert(e.mapping.map(n+l),c.createAndFill())}}return e}function Em(e,t){if(!am(e))return!1;if(t){let n=wm(e);t(Tm(e.tr,n,n.left))}return!0}function Dm(e,t){if(!am(e))return!1;if(t){let n=wm(e);t(Tm(e.tr,n,n.right))}return!0}function Om(e,{map:t,table:n,tableStart:r},i){let a=e.mapping.maps.length;for(let o=0;o<t.height;){let s=o*t.width+i,c=t.map[s],l=n.nodeAt(c),u=l.attrs;if(i>0&&t.map[s-1]==c||i<t.width-1&&t.map[s+1]==c)e.setNodeMarkup(e.mapping.slice(a).map(r+c),null,fm(u,i-t.colCount(c)));else{let t=e.mapping.slice(a).map(r+c);e.delete(t,t+l.nodeSize)}o+=u.rowspan}}function km(e,t){if(!am(e))return!1;if(t){let n=wm(e),r=e.tr;if(n.left==0&&n.right==n.map.width)return!1;for(let e=n.right-1;Om(r,n,e),e!=n.left;e--){let e=n.tableStart?r.doc.nodeAt(n.tableStart-1):r.doc;if(!e)throw RangeError(`No table found`);n.table=e,n.map=q.get(e)}t(r)}return!0}function Am(e,t,n){let r=J(t.type.schema).header_cell;for(let i=0;i<e.width;i++)if(t.nodeAt(e.map[i+n*e.width])?.type!=r)return!1;return!0}function jm(e,{map:t,tableStart:n,table:r},i){let a=n;for(let e=0;e<i;e++)a+=r.child(e).nodeSize;let o=[],s=i>0?-1:0;Am(t,r,i+s)&&(s=i==0||i==t.height?null:0);for(let a=0,c=t.width*i;a<t.width;a++,c++)if(i>0&&i<t.height&&t.map[c]==t.map[c-t.width]){let i=t.map[c],o=r.nodeAt(i).attrs;e.setNodeMarkup(n+i,null,{...o,rowspan:o.rowspan+1}),a+=o.colspan-1}else{let e=(s==null?J(r.type.schema).cell:r.nodeAt(t.map[c+s*t.width])?.type)?.createAndFill();e&&o.push(e)}return e.insert(a,J(r.type.schema).row.create(null,o)),e}function Mm(e,t){if(!am(e))return!1;if(t){let n=wm(e);t(jm(e.tr,n,n.top))}return!0}function Nm(e,t){if(!am(e))return!1;if(t){let n=wm(e);t(jm(e.tr,n,n.bottom))}return!0}function Pm(e,{map:t,table:n,tableStart:r},i){let a=0;for(let e=0;e<i;e++)a+=n.child(e).nodeSize;let o=a+n.child(i).nodeSize,s=e.mapping.maps.length;e.delete(a+r,o+r);let c=new Set;for(let a=0,o=i*t.width;a<t.width;a++,o++){let l=t.map[o];if(!c.has(l)){if(c.add(l),i>0&&l==t.map[o-t.width]){let t=n.nodeAt(l).attrs;e.setNodeMarkup(e.mapping.slice(s).map(l+r),null,{...t,rowspan:t.rowspan-1}),a+=t.colspan-1}else if(i<t.height&&l==t.map[o+t.width]){let o=n.nodeAt(l),c=o.attrs,u=o.type.create({...c,rowspan:o.attrs.rowspan-1},o.content),d=t.positionAt(i+1,a,n);e.insert(e.mapping.slice(s).map(r+d),u),a+=c.colspan-1}}}}function Fm(e,t){if(!am(e))return!1;if(t){let n=wm(e),r=e.tr;if(n.top==0&&n.bottom==n.map.height)return!1;for(let e=n.bottom-1;Pm(r,n,e),e!=n.top;e--){let e=n.tableStart?r.doc.nodeAt(n.tableStart-1):r.doc;if(!e)throw RangeError(`No table found`);n.table=e,n.map=q.get(n.table)}t(r)}return!0}function Im(e){let t=e.content;return t.childCount==1&&t.child(0).isTextblock&&t.child(0).childCount==0}function Lm({width:e,height:t,map:n},r){let i=r.top*e+r.left,a=i,o=(r.bottom-1)*e+r.left,s=i+(r.right-r.left-1);for(let t=r.top;t<r.bottom;t++){if(r.left>0&&n[a]==n[a-1]||r.right<e&&n[s]==n[s+1])return!0;a+=e,s+=e}for(let a=r.left;a<r.right;a++){if(r.top>0&&n[i]==n[i-e]||r.bottom<t&&n[o]==n[o+e])return!0;i++,o++}return!1}function Rm(e,t){let n=e.selection;if(!(n instanceof Y)||n.$anchorCell.pos==n.$headCell.pos)return!1;let r=wm(e),{map:i}=r;if(Lm(i,r))return!1;if(t){let n=e.tr,a={},o=k.empty,s,c;for(let e=r.top;e<r.bottom;e++)for(let t=r.left;t<r.right;t++){let l=i.map[e*i.width+t],u=r.table.nodeAt(l);if(!(a[l]||!u)){if(a[l]=!0,s==null)s=l,c=u;else{Im(u)||(o=o.append(u.content));let e=n.mapping.map(l+r.tableStart);n.delete(e,e+u.nodeSize)}}}if(s==null||c==null)return!0;if(n.setNodeMarkup(s+r.tableStart,null,{...pm(c.attrs,c.attrs.colspan,r.right-r.left-c.attrs.colspan),rowspan:r.bottom-r.top}),o.size>0){let e=s+1+c.content.size,t=Im(c)?s+1:e;n.replaceWith(t+r.tableStart,e+r.tableStart,o)}n.setSelection(new Y(n.doc.resolve(s+r.tableStart))),t(n)}return!0}function zm(e,t){let n=J(e.schema);return Bm(({node:e})=>n[e.type.spec.tableRole])(e,t)}function Bm(e){return(t,n)=>{let r=t.selection,i,a;if(r instanceof Y){if(r.$anchorCell.pos!=r.$headCell.pos)return!1;i=r.$anchorCell.nodeAfter,a=r.$anchorCell.pos}else{if(i=im(r.$from),!i)return!1;a=rm(r.$from)?.pos}if(i==null||a==null||i.attrs.colspan==1&&i.attrs.rowspan==1)return!1;if(n){let o=i.attrs,s=[],c=o.colwidth;o.rowspan>1&&(o={...o,rowspan:1}),o.colspan>1&&(o={...o,colspan:1});let l=wm(t),u=t.tr;for(let e=0;e<l.right-l.left;e++)s.push(c?{...o,colwidth:c&&c[e]?[c[e]]:null}:o);let d;for(let t=l.top;t<l.bottom;t++){let n=l.map.positionAt(t,l.left,l.table);t==l.top&&(n+=i.nodeSize);for(let r=l.left,a=0;r<l.right;r++,a++)(r!=l.left||t!=l.top)&&u.insert(d=u.mapping.map(n+l.tableStart,1),e({node:i,row:t,col:r}).createAndFill(s[a]))}u.setNodeMarkup(a,e({node:i,row:l.top,col:l.left}),s[0]),r instanceof Y&&u.setSelection(new Y(u.doc.resolve(r.$anchorCell.pos),d?u.doc.resolve(d):void 0)),n(u)}return!0}}function Vm(e,t){return function(n,r){if(!am(n))return!1;let i=om(n);if(i.nodeAfter.attrs[e]===t)return!1;if(r){let a=n.tr;n.selection instanceof Y?n.selection.forEachCell((n,r)=>{n.attrs[e]!==t&&a.setNodeMarkup(r,null,{...n.attrs,[e]:t})}):a.setNodeMarkup(i.pos,null,{...i.nodeAfter.attrs,[e]:t}),r(a)}return!0}}function Hm(e){return function(t,n){if(!am(t))return!1;if(n){let r=J(t.schema),i=wm(t),a=t.tr,o=i.map.cellsInRect(e==`column`?{left:i.left,top:0,right:i.right,bottom:i.map.height}:e==`row`?{left:0,top:i.top,right:i.map.width,bottom:i.bottom}:i),s=o.map(e=>i.table.nodeAt(e));for(let e=0;e<o.length;e++)s[e].type==r.header_cell&&a.setNodeMarkup(i.tableStart+o[e],r.cell,s[e].attrs);if(a.steps.length===0)for(let e=0;e<o.length;e++)a.setNodeMarkup(i.tableStart+o[e],r.header_cell,s[e].attrs);n(a)}return!0}}function Um(e,t,n){let r=t.map.cellsInRect({left:0,top:0,right:e==`row`?t.map.width:1,bottom:e==`column`?t.map.height:1});for(let e=0;e<r.length;e++){let i=t.table.nodeAt(r[e]);if(i&&i.type!==n.header_cell)return!1}return!0}function Wm(e,t){return t||={useDeprecatedLogic:!1},t.useDeprecatedLogic?Hm(e):function(t,n){if(!am(t))return!1;if(n){let r=J(t.schema),i=wm(t),a=t.tr,o=Um(`row`,i,r),s=Um(`column`,i,r),c=(e===`column`?o:e===`row`&&s)?1:0,l=e==`column`?{left:0,top:c,right:1,bottom:i.map.height}:e==`row`?{left:c,top:0,right:i.map.width,bottom:1}:i,u=e==`column`?s?r.cell:r.header_cell:e==`row`?o?r.cell:r.header_cell:r.cell;i.map.cellsInRect(l).forEach(e=>{let t=e+i.tableStart,n=a.doc.nodeAt(t);n&&a.setNodeMarkup(t,u,n.attrs)}),n(a)}return!0}}Wm(`row`,{useDeprecatedLogic:!0}),Wm(`column`,{useDeprecatedLogic:!0});var Gm=Wm(`cell`,{useDeprecatedLogic:!0});function Km(e,t){if(t<0){let t=e.nodeBefore;if(t)return e.pos-t.nodeSize;for(let t=e.index(-1)-1,n=e.before();t>=0;t--){let r=e.node(-1).child(t),i=r.lastChild;if(i)return n-1-i.nodeSize;n-=r.nodeSize}}else{if(e.index()<e.parent.childCount-1)return e.pos+e.nodeAfter.nodeSize;let t=e.node(-1);for(let n=e.indexAfter(-1),r=e.after();n<t.childCount;n++){let e=t.child(n);if(e.childCount)return r+1;r+=e.nodeSize}}return null}function qm(e){return function(t,n){if(!am(t))return!1;let r=Km(om(t),e);if(r==null)return!1;if(n){let e=t.doc.resolve(r);n(t.tr.setSelection(N.between(e,lm(e))).scrollIntoView())}return!0}}function Jm(e,t){let n=e.selection.$anchor;for(let r=n.depth;r>0;r--)if(n.node(r).type.spec.tableRole==`table`)return t&&t(e.tr.delete(n.before(r),n.after(r)).scrollIntoView()),!0;return!1}function Ym(e,t){let n=e.selection;if(!(n instanceof Y))return!1;if(t){let r=e.tr,i=J(e.schema).cell.createAndFill().content;n.forEachCell((e,t)=>{e.content.eq(i)||r.replace(r.mapping.map(t+1),r.mapping.map(t+e.nodeSize-1),new M(i,0,0))}),r.docChanged&&t(r)}return!0}function Xm(e){if(e.size===0)return null;let{content:t,openStart:n,openEnd:r}=e;for(;t.childCount==1&&(n>0&&r>0||t.child(0).type.spec.tableRole==`table`);)n--,r--,t=t.child(0).content;let i=t.child(0),a=i.type.spec.tableRole,o=i.type.schema,s=[];if(a==`row`)for(let e=0;e<t.childCount;e++){let i=t.child(e).content,a=e?0:Math.max(0,n-1),c=e<t.childCount-1?0:Math.max(0,r-1);(a||c)&&(i=Qm(J(o).row,new M(i,a,c)).content),s.push(i)}else if(a==`cell`||a==`header_cell`)s.push(n||r?Qm(J(o).row,new M(t,n,r)).content:t);else return null;return Zm(o,s)}function Zm(e,t){let n=[];for(let e=0;e<t.length;e++){let r=t[e];for(let t=r.childCount-1;t>=0;t--){let{rowspan:i,colspan:a}=r.child(t).attrs;for(let t=e;t<e+i;t++)n[t]=(n[t]||0)+a}}let r=0;for(let e=0;e<n.length;e++)r=Math.max(r,n[e]);for(let i=0;i<n.length;i++)if(i>=t.length&&t.push(k.empty),n[i]<r){let a=J(e).cell.createAndFill(),o=[];for(let e=n[i];e<r;e++)o.push(a);t[i]=t[i].append(k.from(o))}return{height:t.length,width:r,rows:t}}function Qm(e,t){let n=e.createAndFill();return new Ze(n).replace(0,n.content.size,t).doc}function $m({width:e,height:t,rows:n},r,i){if(e!=r){let t=[],i=[];for(let e=0;e<n.length;e++){let a=n[e],o=[];for(let n=t[e]||0,i=0;n<r;i++){let s=a.child(i%a.childCount);n+s.attrs.colspan>r&&(s=s.type.createChecked(fm(s.attrs,s.attrs.colspan,n+s.attrs.colspan-r),s.content)),o.push(s),n+=s.attrs.colspan;for(let n=1;n<s.attrs.rowspan;n++)t[e+n]=(t[e+n]||0)+s.attrs.colspan}i.push(k.from(o))}n=i,e=r}if(t!=i){let e=[];for(let r=0,a=0;r<i;r++,a++){let o=[],s=n[a%t];for(let e=0;e<s.childCount;e++){let t=s.child(e);r+t.attrs.rowspan>i&&(t=t.type.create({...t.attrs,rowspan:Math.max(1,i-t.attrs.rowspan)},t.content)),o.push(t)}e.push(k.from(o))}n=e,t=i}return{width:e,height:t,rows:n}}function eh(e,t,n,r,i,a,o){let s=e.doc.type.schema,c=J(s),l,u;if(i>t.width)for(let a=0,s=0;a<t.height;a++){let d=n.child(a);s+=d.nodeSize;let f=[],p;p=d.lastChild==null||d.lastChild.type==c.cell?l||=c.cell.createAndFill():u||=c.header_cell.createAndFill();for(let e=t.width;e<i;e++)f.push(p);e.insert(e.mapping.slice(o).map(s-1+r),f)}if(a>t.height){let s=[];for(let e=0,r=(t.height-1)*t.width;e<Math.max(t.width,i);e++){let i=e>=t.width?!1:n.nodeAt(t.map[r+e]).type==c.header_cell;s.push(i?u||=c.header_cell.createAndFill():l||=c.cell.createAndFill())}let d=c.row.create(null,k.from(s)),f=[];for(let e=t.height;e<a;e++)f.push(d);e.insert(e.mapping.slice(o).map(r+n.nodeSize-2),f)}return!!(l||u)}function th(e,t,n,r,i,a,o,s){if(o==0||o==t.height)return!1;let c=!1;for(let l=i;l<a;l++){let i=o*t.width+l,a=t.map[i];if(t.map[i-t.width]==a){c=!0;let i=n.nodeAt(a),{top:u,left:d}=t.findCell(a);e.setNodeMarkup(e.mapping.slice(s).map(a+r),null,{...i.attrs,rowspan:o-u}),e.insert(e.mapping.slice(s).map(t.positionAt(o,d,n)),i.type.createAndFill({...i.attrs,rowspan:u+i.attrs.rowspan-o})),l+=i.attrs.colspan-1}}return c}function nh(e,t,n,r,i,a,o,s){if(o==0||o==t.width)return!1;let c=!1;for(let l=i;l<a;l++){let i=l*t.width+o,a=t.map[i];if(t.map[i-1]==a){c=!0;let i=n.nodeAt(a),u=t.colCount(a),d=e.mapping.slice(s).map(a+r);e.setNodeMarkup(d,null,fm(i.attrs,o-u,i.attrs.colspan-(o-u))),e.insert(d+i.nodeSize,i.type.createAndFill(fm(i.attrs,0,o-u))),l+=i.attrs.rowspan-1}}return c}function rh(e,t,n,r,i){let a=n?e.doc.nodeAt(n-1):e.doc;if(!a)throw Error(`No table found`);let o=q.get(a),{top:s,left:c}=r,l=c+i.width,u=s+i.height,d=e.tr,f=0;function p(){if(a=n?d.doc.nodeAt(n-1):d.doc,!a)throw Error(`No table found`);o=q.get(a),f=d.mapping.maps.length}eh(d,o,a,n,l,u,f)&&p(),th(d,o,a,n,c,l,s,f)&&p(),th(d,o,a,n,c,l,u,f)&&p(),nh(d,o,a,n,s,u,c,f)&&p(),nh(d,o,a,n,s,u,l,f)&&p();for(let e=s;e<u;e++){let t=o.positionAt(e,c,a),r=o.positionAt(e,l,a);d.replace(d.mapping.slice(f).map(t+n),d.mapping.slice(f).map(r+n),new M(i.rows[e-s],0,0))}p(),d.setSelection(new Y(d.doc.resolve(n+o.positionAt(s,c,a)),d.doc.resolve(n+o.positionAt(u-1,l-1,a)))),t(d)}var ih=Vt({ArrowLeft:oh(`horiz`,-1),ArrowRight:oh(`horiz`,1),ArrowUp:oh(`vert`,-1),ArrowDown:oh(`vert`,1),"Shift-ArrowLeft":sh(`horiz`,-1),"Shift-ArrowRight":sh(`horiz`,1),"Shift-ArrowUp":sh(`vert`,-1),"Shift-ArrowDown":sh(`vert`,1),Backspace:Ym,"Mod-Backspace":Ym,Delete:Ym,"Mod-Delete":Ym});function ah(e,t,n){return!n.eq(e.selection)&&(t&&t(e.tr.setSelection(n).scrollIntoView()),!0)}function oh(e,t){return(n,r,i)=>{if(!i)return!1;let a=n.selection;if(a instanceof Y)return ah(n,r,D.near(a.$headCell,t));if(e!=`horiz`&&!a.empty)return!1;let o=dh(i,e,t);if(o==null)return!1;if(e==`horiz`)return ah(n,r,D.near(n.doc.resolve(a.head+t),t));{let i=n.doc.resolve(o),a=dm(i,e,t),s;return s=a?D.near(a,1):t<0?D.near(n.doc.resolve(i.before(-1)),-1):D.near(n.doc.resolve(i.after(-1)),1),ah(n,r,s)}}}function sh(e,t){return(n,r,i)=>{if(!i)return!1;let a=n.selection,o;if(a instanceof Y)o=a;else{let r=dh(i,e,t);if(r==null)return!1;o=new Y(n.doc.resolve(r))}let s=dm(o.$headCell,e,t);return s?ah(n,r,new Y(o.$anchorCell,s)):!1}}function ch(e,t){let n=e.state.doc,r=rm(n.resolve(t));return r?(e.dispatch(e.state.tr.setSelection(new Y(r))),!0):!1}function lh(e,t,n){if(!am(e.state))return!1;let r=Xm(n),i=e.state.selection;if(i instanceof Y){r||={width:1,height:1,rows:[k.from(Qm(J(e.state.schema).cell,n))]};let t=i.$anchorCell.node(-1),a=i.$anchorCell.start(-1),o=q.get(t).rectBetween(i.$anchorCell.pos-a,i.$headCell.pos-a);return r=$m(r,o.right-o.left,o.bottom-o.top),rh(e.state,e.dispatch,a,o,r),!0}if(r){let t=om(e.state),n=t.start(-1);return rh(e.state,e.dispatch,n,q.get(t.node(-1)).findCell(t.pos-n),r),!0}return!1}function uh(e,t){if(t.button!=0||t.ctrlKey||t.metaKey)return;let n=fh(e,t.target),r;if(t.shiftKey&&e.state.selection instanceof Y)i(e.state.selection.$anchorCell,t),t.preventDefault();else if(t.shiftKey&&n&&(r=rm(e.state.selection.$anchor))!=null&&ph(e,t)?.pos!=r.pos)i(r,t),t.preventDefault();else if(!n)return;function i(t,n){let r=ph(e,n),i=nm.getState(e.state)==null;if(!r||!um(t,r)){if(i)r=t;else return}let a=new Y(t,r);if(i||!e.state.selection.eq(a)){let n=e.state.tr.setSelection(a);i&&n.setMeta(nm,t.pos),e.dispatch(n)}}function a(){e.root.removeEventListener(`mouseup`,a),e.root.removeEventListener(`dragstart`,a),e.root.removeEventListener(`mousemove`,o),nm.getState(e.state)!=null&&e.dispatch(e.state.tr.setMeta(nm,-1))}function o(r){let o=r,s=nm.getState(e.state),c;if(s!=null)c=e.state.doc.resolve(s);else if(fh(e,o.target)!=n&&(c=ph(e,t),!c))return a();c&&i(c,o)}e.root.addEventListener(`mouseup`,a),e.root.addEventListener(`dragstart`,a),e.root.addEventListener(`mousemove`,o)}function dh(e,t,n){if(!(e.state.selection instanceof N))return null;let{$head:r}=e.state.selection;for(let i=r.depth-1;i>=0;i--){let a=r.node(i);if((n<0?r.index(i):r.indexAfter(i))!=(n<0?0:a.childCount))return null;if(a.type.spec.tableRole==`cell`||a.type.spec.tableRole==`header_cell`){let a=r.before(i),o=t==`vert`?n>0?`down`:`up`:n>0?`right`:`left`;return e.endOfTextblock(o)?a:null}}return null}function fh(e,t){for(;t&&t!=e.dom;t=t.parentNode)if(t.nodeName==`TD`||t.nodeName==`TH`)return t;return null}function ph(e,t){let n=e.posAtCoords({left:t.clientX,top:t.clientY});if(!n)return null;let{inside:r,pos:i}=n;return r>=0&&rm(e.state.doc.resolve(r))||rm(e.state.doc.resolve(i))}var mh=class{constructor(e,t){this.node=e,this.defaultCellMinWidth=t,this.dom=document.createElement(`div`),this.dom.className=`tableWrapper`,this.table=this.dom.appendChild(document.createElement(`table`)),this.table.style.setProperty(`--default-cell-min-width`,`${t}px`),this.colgroup=this.table.appendChild(document.createElement(`colgroup`)),hh(e,this.colgroup,this.table,t),this.contentDOM=this.table.appendChild(document.createElement(`tbody`))}update(e){return e.type==this.node.type&&(this.node=e,hh(e,this.colgroup,this.table,this.defaultCellMinWidth),!0)}ignoreMutation(e){return e.type==`attributes`&&(e.target==this.table||this.colgroup.contains(e.target))}};function hh(e,t,n,r,i,a){let o=0,s=!0,c=t.firstChild,l=e.firstChild;if(l){for(let e=0,n=0;e<l.childCount;e++){let{colspan:u,colwidth:d}=l.child(e).attrs;for(let e=0;e<u;e++,n++){let l=i==n?a:d&&d[e],u=l?l+`px`:``;if(o+=l||r,l||(s=!1),c)c.style.width!=u&&(c.style.width=u),c=c.nextSibling;else{let e=document.createElement(`col`);e.style.width=u,t.appendChild(e)}}}for(;c;){var u;let e=c.nextSibling;(u=c.parentNode)==null||u.removeChild(c),c=e}s?(n.style.width=o+`px`,n.style.minWidth=``):(n.style.width=``,n.style.minWidth=o+`px`)}}var X=new E(`tableColumnResizing`);function gh({handleWidth:e=5,cellMinWidth:t=25,defaultCellMinWidth:n=100,View:r=mh,lastColumnResizable:i=!0}={}){let a=new T({key:X,state:{init(e,t){var i;let o=(i=a.spec)==null||(i=i.props)==null?void 0:i.nodeViews,s=J(t.schema).table.name;return r&&o&&(o[s]=(e,t)=>new r(e,n,t)),new _h(-1,!1)},apply(e,t){return t.apply(e)}},props:{attributes:e=>{let t=X.getState(e);return t&&t.activeHandle>-1?{class:`resize-cursor`}:{}},handleDOMEvents:{mousemove:(t,n)=>{vh(t,n,e,i)},mouseleave:e=>{yh(e)},mousedown:(e,r)=>{bh(e,r,t,n)}},decorations:e=>{let t=X.getState(e);if(t&&t.activeHandle>-1)return kh(e,t.activeHandle)},nodeViews:{}}});return a}var _h=class e{constructor(e,t){this.activeHandle=e,this.dragging=t}apply(t){let n=this,r=t.getMeta(X);if(r&&r.setHandle!=null)return new e(r.setHandle,!1);if(r&&r.setDragging!==void 0)return new e(n.activeHandle,r.setDragging);if(n.activeHandle>-1&&t.docChanged){let r=t.mapping.map(n.activeHandle,-1);return cm(t.doc.resolve(r))||(r=-1),new e(r,n.dragging)}return n}};function vh(e,t,n,r){if(!e.editable)return;let i=X.getState(e.state);if(i&&!i.dragging){let a=Sh(t.target),o=-1;if(a){let{left:r,right:i}=a.getBoundingClientRect();t.clientX-r<=n?o=Ch(e,t,`left`,n):i-t.clientX<=n&&(o=Ch(e,t,`right`,n))}if(o!=i.activeHandle){if(!r&&o!==-1){let t=e.state.doc.resolve(o),n=t.node(-1),r=q.get(n),i=t.start(-1);if(r.colCount(t.pos-i)+t.nodeAfter.attrs.colspan-1==r.width-1)return}Th(e,o)}}}function yh(e){if(!e.editable)return;let t=X.getState(e.state);t&&t.activeHandle>-1&&!t.dragging&&Th(e,-1)}function bh(e,t,n,r){if(!e.editable)return!1;let i=e.dom.ownerDocument.defaultView??window,a=X.getState(e.state);if(!a||a.activeHandle==-1||a.dragging)return!1;let o=e.state.doc.nodeAt(a.activeHandle),s=xh(e,a.activeHandle,o.attrs);e.dispatch(e.state.tr.setMeta(X,{setDragging:{startX:t.clientX,startWidth:s}}));function c(t){i.removeEventListener(`mouseup`,c),i.removeEventListener(`mousemove`,l);let r=X.getState(e.state);r?.dragging&&(Eh(e,r.activeHandle,wh(r.dragging,t,n)),e.dispatch(e.state.tr.setMeta(X,{setDragging:null})))}function l(t){if(!t.which)return c(t);let i=X.getState(e.state);if(i&&i.dragging){let a=wh(i.dragging,t,n);Dh(e,i.activeHandle,a,r)}}return Dh(e,a.activeHandle,s,r),i.addEventListener(`mouseup`,c),i.addEventListener(`mousemove`,l),t.preventDefault(),!0}function xh(e,t,{colspan:n,colwidth:r}){let i=r&&r[r.length-1];if(i)return i;let a=e.domAtPos(t),o=a.node.childNodes[a.offset].offsetWidth,s=n;if(r)for(let e=0;e<n;e++)r[e]&&(o-=r[e],s--);return o/s}function Sh(e){for(;e&&e.nodeName!=`TD`&&e.nodeName!=`TH`;)e=e.classList&&e.classList.contains(`ProseMirror`)?null:e.parentNode;return e}function Ch(e,t,n,r){let i=n==`right`?-r:r,a=e.posAtCoords({left:t.clientX+i,top:t.clientY});if(!a)return-1;let{pos:o}=a,s=rm(e.state.doc.resolve(o));if(!s)return-1;if(n==`right`)return s.pos;let c=q.get(s.node(-1)),l=s.start(-1),u=c.map.indexOf(s.pos-l);return u%c.width==0?-1:l+c.map[u-1]}function wh(e,t,n){let r=t.clientX-e.startX;return Math.max(n,e.startWidth+r)}function Th(e,t){e.dispatch(e.state.tr.setMeta(X,{setHandle:t}))}function Eh(e,t,n){let r=e.state.doc.resolve(t),i=r.node(-1),a=q.get(i),o=r.start(-1),s=a.colCount(r.pos-o)+r.nodeAfter.attrs.colspan-1,c=e.state.tr;for(let e=0;e<a.height;e++){let t=e*a.width+s;if(e&&a.map[t]==a.map[t-a.width])continue;let r=a.map[t],l=i.nodeAt(r).attrs,u=l.colspan==1?0:s-a.colCount(r);if(l.colwidth&&l.colwidth[u]==n)continue;let d=l.colwidth?l.colwidth.slice():Oh(l.colspan);d[u]=n,c.setNodeMarkup(o+r,null,{...l,colwidth:d})}c.docChanged&&e.dispatch(c)}function Dh(e,t,n,r){let i=e.state.doc.resolve(t),a=i.node(-1),o=i.start(-1),s=q.get(a).colCount(i.pos-o)+i.nodeAfter.attrs.colspan-1,c=e.domAtPos(i.start(-1)).node;for(;c&&c.nodeName!=`TABLE`;)c=c.parentNode;c&&hh(a,c.firstChild,c,r,s,n)}function Oh(e){return Array(e).fill(0)}function kh(e,t){let n=[],r=e.doc.resolve(t),i=r.node(-1);if(!i)return Kt.empty;let a=q.get(i),o=r.start(-1),s=a.colCount(r.pos-o)+r.nodeAfter.attrs.colspan-1;for(let t=0;t<a.height;t++){let r=s+t*a.width;if((s==a.width-1||a.map[r]!=a.map[r+1])&&(t==0||a.map[r]!=a.map[r-a.width])){let t=a.map[r],s=o+t+i.nodeAt(t).nodeSize-1,c=document.createElement(`div`);c.className=`column-resize-handle`,X.getState(e)?.dragging&&n.push(Et.node(o+t,o+t+i.nodeAt(t).nodeSize,{class:`column-resize-dragging`})),n.push(Et.widget(s,c))}}return Kt.create(e.doc,n)}function Ah({allowTableNodeSelection:e=!1}={}){return new T({key:nm,state:{init(){return null},apply(e,t){let n=e.getMeta(nm);if(n!=null)return n==-1?null:n;if(t==null||!e.docChanged)return t;let{deleted:r,pos:i}=e.mapping.mapResult(t);return r?null:i}},props:{decorations:gm,handleDOMEvents:{mousedown:uh},createSelectionBetween(e){return nm.getState(e.state)==null?null:e.state.selection},handleTripleClick:ch,handleKeyDown:ih,handlePaste:lh},appendTransaction(t,n,r){return ym(r,Sm(r,n),e)}})}function jh(e){return e===`left`||e===`right`||e===`center`?e:null}function Mh(e){let t=(e.style.textAlign||``).trim().toLowerCase(),n=(e.getAttribute(`align`)||``).trim().toLowerCase();return jh(t||n)}function Nh(e){return jh(e?.align)}function Ph(){return{default:null,parseHTML:e=>Mh(e),renderHTML:e=>e.align?{style:`text-align: ${e.align}`}:{}}}function Fh(e){let t=e.parentElement,n=e.closest(`table`);if(!t||!n)return null;let r=Array.from(t.children).indexOf(e),i=n.querySelectorAll(`colgroup > col`)[r]?.getAttribute(`width`);return i?[parseInt(i,10)]:null}function Ih(e){let t=e.getAttribute(`colwidth`);return t?t.split(`,`).map(e=>parseInt(e,10)):Fh(e)}var Lh=/[ \t\r\n\f]+/g;function Rh(e){return e.children.length>0?!1:(e.textContent??``).replace(Lh,``)===``}function zh(e){let t=e.createAndFill();if(!t)throw Error(`[tiptap error]: "${e.name}" has no default content to backfill.`);return t.content}var Bh=j.create({name:`tableCell`,addOptions(){return{HTMLAttributes:{}}},content:`block+`,addAttributes(){return{colspan:{default:1},rowspan:{default:1},colwidth:{default:null,parseHTML:Ih},align:Ph()}},tableRole:`cell`,isolating:!0,parseHTML(){return[{tag:`td`,getAttrs:e=>Rh(e)?{}:!1,getContent:(e,t)=>zh(t.nodes[this.name])},{tag:`td`}]},renderHTML({HTMLAttributes:e}){return[`td`,A(this.options.HTMLAttributes,e),0]}}),Vh=j.create({name:`tableHeader`,addOptions(){return{HTMLAttributes:{}}},content:`block+`,addAttributes(){return{colspan:{default:1},rowspan:{default:1},colwidth:{default:null,parseHTML:Ih},align:Ph()}},tableRole:`header_cell`,isolating:!0,parseHTML(){return[{tag:`th`,getAttrs:e=>Rh(e)?{}:!1,getContent:(e,t)=>zh(t.nodes[this.name])},{tag:`th`}]},renderHTML({HTMLAttributes:e}){return[`th`,A(this.options.HTMLAttributes,e),0]}}),Hh=j.create({name:`tableRow`,addOptions(){return{HTMLAttributes:{}}},content:`(tableCell | tableHeader)*`,tableRole:`row`,parseHTML(){return[{tag:`tr`}]},renderHTML({HTMLAttributes:e}){return[`tr`,A(this.options.HTMLAttributes,e),0]}});function Uh(e,t){return t?[`width`,`${Math.max(t,e)}px`]:[`min-width`,`${e}px`]}function Wh(e,t,n,r,i,a){let o=0,s=!0,c=t.firstChild,l=e.firstChild;if(l!==null)for(let e=0,n=0;e<l.childCount;e+=1){let{colspan:u,colwidth:d}=l.child(e).attrs;for(let e=0;e<u;e+=1,n+=1){let l=i===n?a:d&&d[e],u=l?`${l}px`:``;if(o+=l||r,l||(s=!1),c){if(c.style.width!==u){let[e,t]=Uh(r,l);c.style.setProperty(e,t)}c=c.nextSibling}else{let e=document.createElement(`col`),[n,i]=Uh(r,l);e.style.setProperty(n,i),t.appendChild(e)}}}for(;c;){var u;let e=c.nextSibling;(u=c.parentNode)==null||u.removeChild(c),c=e}let d=e.attrs.style&&typeof e.attrs.style==`string`&&/\bwidth\s*:/i.test(e.attrs.style);s&&!d?(n.style.width=`${o}px`,n.style.minWidth=``):(n.style.width=``,n.style.minWidth=`${o}px`)}var Gh=class{constructor(e,t,n,r={}){this.node=e,this.cellMinWidth=t,this.dom=document.createElement(`div`),this.dom.className=`tableWrapper`,this.table=this.dom.appendChild(document.createElement(`table`));for(let[e,t]of Object.entries(r))t!=null&&(e===`style`?this.table.style.cssText=String(t):this.table.setAttribute(e,String(t)));e.attrs.style&&(this.table.style.cssText=e.attrs.style),this.colgroup=this.table.appendChild(document.createElement(`colgroup`)),Wh(e,this.colgroup,this.table,t),this.contentDOM=this.table.appendChild(document.createElement(`tbody`))}update(e){return e.type===this.node.type&&(this.node=e,Wh(e,this.colgroup,this.table,this.cellMinWidth),!0)}ignoreMutation(e){let t=e.target,n=this.dom.contains(t),r=this.contentDOM.contains(t);return!!(n&&!r&&(e.type===`attributes`||e.type===`childList`||e.type===`characterData`))}};function Kh(e,t,n,r){let i=0,a=!0,o=[],s=e.firstChild;if(!s)return{};for(let e=0,c=0;e<s.childCount;e+=1){let{colspan:l,colwidth:u}=s.child(e).attrs;for(let e=0;e<l;e+=1,c+=1){let s=n===c?r:u&&u[e];i+=s||t,s||(a=!1);let[l,d]=Uh(t,s);o.push([`col`,{style:`${l}: ${d}`}])}}let c=a?`${i}px`:``,l=a?``:`${i}px`;return{colgroup:[`colgroup`,{},...o],tableWidth:c,tableMinWidth:l}}function qh(e,t){return t?e.createChecked(null,t):e.createAndFill()}function Jh(e){if(e.cached.tableNodeTypes)return e.cached.tableNodeTypes;let t={};return Object.keys(e.nodes).forEach(n=>{let r=e.nodes[n];r.spec.tableRole&&(t[r.spec.tableRole]=r)}),e.cached.tableNodeTypes=t,t}function Yh(e,t,n,r,i){let a=Jh(e),o=[],s=[];for(let e=0;e<n;e+=1){let e=qh(a.cell,i);if(e&&s.push(e),r){let e=qh(a.header_cell,i);e&&o.push(e)}}let c=[];for(let e=0;e<t;e+=1)c.push(a.row.createChecked(null,r&&e===0?o:s));return a.table.createChecked(null,c)}function Xh(e){return e instanceof Y}var Zh=({editor:e})=>{let{selection:t}=e.state;if(!Xh(t))return!1;let n=0;return Ee(t.ranges[0].$from,e=>e.type.name===`table`)?.node.descendants(e=>{if(e.type.name===`table`)return!1;[`tableCell`,`tableHeader`].includes(e.type.name)&&(n+=1)}),n===t.ranges.length&&(e.commands.deleteTable(),!0)};function Qh(e,t){let n=e.mapping.map(t);if(Ee(e.selection.$from,e=>e.type.name===`table`)?.pos===n)return;let r=e.doc.nodeAt(n);if(!r)return;let i=n+r.nodeSize-1;e.setSelection(N.near(e.doc.resolve(i),-1))}function $h(e){let t=``,n=0;for(;n<e.length;){if(e[n]===`\\`&&n+1<e.length){t+=e[n]+e[n+1],n+=2;continue}if(e[n]!=="`"){t+=e[n++];continue}let r=0;for(;n+r<e.length&&e[n+r]==="`";)r+=1;let i=n+r,a=!1;for(;i<e.length;){if(e[i]!=="`"){i+=1;continue}let o=0;for(;i+o<e.length&&e[i+o]==="`";)o+=1;if(o===r){let o=e.slice(n+r,i);t+=e.slice(n,n+r)+o.replace(/\\\||\|/g,e=>e===`|`?`\\|`:e)+e.slice(i,i+r),n=i+r,a=!0;break}i+=o}a||(t+=e.slice(n,n+r),n+=r)}return t}function eg(e){return e.split(`
`).map(e=>!e.includes(`|`)||!e.includes("`")?e:$h(e)).join(`
`)}function tg(e){return(e||``).replace(/\s+/g,` `).trim()}function ng(e,t,n={}){let r=n.cellLineSeparator??``;if(!e||!e.content||e.content.length===0)return``;let i=[];e.content.forEach(e=>{let n=[];e.content&&e.content.forEach(e=>{let i=``;i=e.content&&Array.isArray(e.content)&&e.content.length>1?e.content.map(e=>t.renderChildren(e)).join(r):e.content?t.renderChildren(e.content):``;let a=tg(i.split(r).join(`
`).replace(/[ \t]*\r?\n[ \t]*/g,`<br>`)),o=e.type===`tableHeader`,s=Nh(e.attrs);n.push({text:a,isHeader:o,align:s})}),i.push(n)});let a=i.reduce((e,t)=>Math.max(e,t.length),0);if(a===0)return``;let o=Array.from({length:a}).fill(0);i.forEach(e=>{for(let t=0;t<a;t+=1){let n=(e[t]?.text||``).length;n>o[t]&&(o[t]=n),o[t]<3&&(o[t]=3)}});let s=(e,t)=>e+` `.repeat(Math.max(0,t-e.length)),c=i[0],l=c.some(e=>e.isHeader),u=Array.from({length:a}).fill(null);i.forEach(e=>{for(let t=0;t<a;t+=1)!u[t]&&e[t]?.align&&(u[t]=e[t].align)});let d=`
`,f=Array.from({length:a}).map((e,t)=>l&&c[t]&&c[t].text||``);return d+=`| ${f.map((e,t)=>s(e,o[t])).join(` | `)} |\n`,d+=`| ${o.map((e,t)=>{let n=Math.max(3,e),r=u[t];return r===`left`?`:${`-`.repeat(n)}`:r===`right`?`${`-`.repeat(n)}:`:r===`center`?`:${`-`.repeat(n)}:`:`-`.repeat(n)}).join(` | `)} |\n`,(l?i.slice(1):i).forEach(e=>{d+=`| ${Array.from({length:a}).fill(0).map((t,n)=>s(e[n]&&e[n].text||``,o[n])).join(` | `)} |\n`}),d}var rg=j.create({name:`table`,addOptions(){return{HTMLAttributes:{},resizable:!1,renderWrapper:!1,handleWidth:5,cellMinWidth:25,View:Gh,lastColumnResizable:!0,allowTableNodeSelection:!1}},content:`tableRow+`,tableRole:`table`,isolating:!0,group:`block`,parseHTML(){return[{tag:`table`}]},renderHTML({node:e,HTMLAttributes:t}){let{colgroup:n,tableWidth:r,tableMinWidth:i}=Kh(e,this.options.cellMinWidth),a=t.style;function o(){return a||(r?`width: ${r}`:`min-width: ${i}`)}let s=[`table`,A(this.options.HTMLAttributes,t,{style:o()}),n,[`tbody`,0]];return this.options.renderWrapper?[`div`,{class:`tableWrapper`},s]:s},parseMarkdown:(e,t)=>{let n=[],r=Array.isArray(e.align)?e.align:[];if(e.header){let i=[];e.header.forEach((e,n)=>{let a=jh(r[n]??e.align),o=a?{align:a}:{};i.push(t.createNode(`tableHeader`,o,[{type:`paragraph`,content:t.parseInline(e.tokens)}]))}),n.push(t.createNode(`tableRow`,{},i))}return e.rows&&e.rows.forEach(e=>{let i=[];e.forEach((e,n)=>{let a=jh(r[n]??e.align),o=a?{align:a}:{};i.push(t.createNode(`tableCell`,o,[{type:`paragraph`,content:t.parseInline(e.tokens)}]))}),n.push(t.createNode(`tableRow`,{},i))}),t.createNode(`table`,void 0,n)},renderMarkdown:(e,t)=>ng(e,t),markdownTokenizer:{name:`table`,level:`block`,start:e=>{let t=e.split(`
`);if(t.length<2)return-1;let n=t[1];return!/^[ \t|:]*-[ \t|:-]*$/.test(n)||!n.includes(`|`)?-1:t[0].includes(`|`)?0:-1},tokenize(e,t,n){let r=e.indexOf(`

`),i=r>=0?e.slice(0,r):e,a=i.split(`
`);if(a.length<2)return;let o=a[1];if(!/^[ \t|:]*-[ \t|:-]*$/.test(o)||!o.includes(`|`))return;let s=eg(i);if(s===i)return;let c=n.blockTokens(s)[0];if(c?.type!==`table`||!c.raw)return;let l=c.raw.split(`
`).length,u=e.split(`
`).slice(0,l).join(`
`);return{...c,raw:u}}},addCommands(){return{insertTable:({rows:e=3,cols:t=3,withHeaderRow:n=!0}={})=>({tr:r,dispatch:i,editor:a})=>{let o=Yh(a.schema,e,t,n);if(i){let e=r.selection.from+1;r.replaceSelectionWith(o).scrollIntoView().setSelection(N.near(r.doc.resolve(e)))}return!0},addColumnBefore:()=>({state:e,dispatch:t})=>Em(e,t),addColumnAfter:()=>({state:e,dispatch:t})=>Dm(e,t),deleteColumn:()=>({state:e,dispatch:t})=>{let n=Ee(e.selection.$from,e=>e.type.name===`table`);return km(e,t&&(e=>{n&&Qh(e,n.pos),t(e)}))},addRowBefore:()=>({state:e,dispatch:t})=>Mm(e,t),addRowAfter:()=>({state:e,dispatch:t})=>Nm(e,t),deleteRow:()=>({state:e,dispatch:t})=>{let n=Ee(e.selection.$from,e=>e.type.name===`table`);return Fm(e,t&&(e=>{n&&Qh(e,n.pos),t(e)}))},deleteTable:()=>({state:e,dispatch:t})=>Jm(e,t),mergeCells:()=>({state:e,dispatch:t})=>Rm(e,t),splitCell:()=>({state:e,dispatch:t})=>zm(e,t),toggleHeaderColumn:()=>({state:e,dispatch:t})=>Wm(`column`)(e,t),toggleHeaderRow:()=>({state:e,dispatch:t})=>Wm(`row`)(e,t),toggleHeaderCell:()=>({state:e,dispatch:t})=>Gm(e,t),mergeOrSplit:()=>({state:e,dispatch:t})=>Rm(e,t)?!0:zm(e,t),setCellAttribute:(e,t)=>({state:n,dispatch:r})=>Vm(e,t)(n,r),goToNextCell:()=>({state:e,dispatch:t})=>qm(1)(e,t),goToPreviousCell:()=>({state:e,dispatch:t})=>qm(-1)(e,t),fixTables:()=>({state:e,dispatch:t})=>(t&&Sm(e),!0),setCellSelection:e=>({tr:t,dispatch:n})=>{if(n){let n=Y.create(t.doc,e.anchorCell,e.headCell);t.setSelection(n)}return!0}}},addKeyboardShortcuts(){return{Tab:()=>this.editor.commands.goToNextCell()?!0:this.editor.can().addRowAfter()?this.editor.chain().addRowAfter().goToNextCell().run():!1,"Shift-Tab":()=>this.editor.commands.goToPreviousCell(),Backspace:Zh,"Mod-Backspace":Zh,Delete:Zh,"Mod-Delete":Zh}},addProseMirrorPlugins(){return[...this.options.resizable&&this.editor.isEditable?[gh({handleWidth:this.options.handleWidth,cellMinWidth:this.options.cellMinWidth,defaultCellMinWidth:this.options.cellMinWidth,View:this.options.View,lastColumnResizable:this.options.lastColumnResizable})]:[],Ah({allowTableNodeSelection:this.options.allowTableNodeSelection})]},addNodeView(){let e=this.options.resizable&&this.editor.isEditable,t=this.options.View;return e||!t?null:({node:e,view:n,HTMLAttributes:r})=>{let i=A(this.options.HTMLAttributes,r);return new t(e,this.options.cellMinWidth,n,i)}},extendNodeSchema(e){let t={name:e.name,options:e.options,storage:e.storage};return{tableRole:St(tn(e,`tableRole`,t))}}});w.create({name:`tableKit`,addExtensions(){let e=[];return this.options.table!==!1&&e.push(rg.configure(this.options.table)),this.options.tableCell!==!1&&e.push(Bh.configure(this.options.tableCell)),this.options.tableHeader!==!1&&e.push(Vh.configure(this.options.tableHeader)),this.options.tableRow!==!1&&e.push(Hh.configure(this.options.tableRow)),e}});var ig=Hh;function ag(e){let t=typeof e.assetUid==`string`?e.assetUid:``;if(!U(t))return null;let n=[`asset`,`custom`,`decorative`,`missing`].includes(String(e.altMode))?e.altMode:`asset`,r=[`default`,`small`,`medium`,`large`,`full`].includes(String(e.size))?e.size:`default`,i=null;if(e.link&&typeof e.link==`object`){let t=e.link;i=Ys(t)}return{assetUid:t,siteMode:e.siteMode===`fixed`?`fixed`:`current`,siteUid:typeof e.siteUid==`string`?e.siteUid:null,altMode:n,alt:typeof e.alt==`string`?e.alt:null,title:typeof e.title==`string`?e.title:null,size:r,link:i,imageUid:typeof e.imageUid==`string`?e.imageUid:null}}function og(){return j.create({name:`image`,group:`block`,atom:!0,draggable:!0,selectable:!0,addAttributes(){return{assetUid:{default:null},siteMode:{default:`current`},siteUid:{default:null},altMode:{default:`asset`},alt:{default:null},title:{default:null},size:{default:`default`},link:{default:null},imageUid:{default:null,rendered:!1}}},parseHTML(){return[{tag:`img[data-asset-uid]`,getAttrs:e=>{let t=e.getAttribute(`data-asset-uid`);return!t||!U(t)?!1:ag({assetUid:t})}}]},renderHTML({node:e}){let t=ag(e.attrs);if(!t)return[`span`,{class:`vizy-image-invalid`,"data-vizy-image":`invalid`,contenteditable:`false`},`Image requires asset`];let n=ll(t.assetUid),r=t.altMode===`decorative`?``:t.alt??`Asset ${t.assetUid.slice(0,8)}`;return n?.url?[`figure`,{class:`vizy-image`,"data-asset-uid":t.assetUid,"data-size":t.size,contenteditable:`false`},[`img`,A({src:n.url,alt:r,title:t.title??void 0,draggable:`false`})]]:[`figure`,{class:`vizy-image vizy-image--pending`,"data-asset-uid":t.assetUid,"data-size":t.size,contenteditable:`false`},[`span`,A({class:`vizy-image-placeholder`,role:`img`,"aria-label":r||`Image`}),r||`Image`]]},addNodeView(){return({node:e})=>{let t=ag(e.attrs),n=document.createElement(`figure`);n.className=`vizy-image`,n.contentEditable=`false`,t&&(n.dataset.assetUid=t.assetUid,n.dataset.size=t.size);let r=``,i=e=>{let t=ag(e.attrs),i=n.classList.contains(`ProseMirror-selectednode`);if(!t){r=``,n.replaceChildren(),n.className=`vizy-image vizy-image-invalid`,n.textContent=`Image requires asset`;return}let a=ll(t.assetUid),o=t.altMode===`decorative`?``:t.alt??`Asset ${t.assetUid.slice(0,8)}`,s=[t.assetUid,t.size,t.altMode,t.alt??``,t.title??``,a?.url??``].join(`\0`);if(s===r){n.className=i?`vizy-image ProseMirror-selectednode`:`vizy-image`;return}if(r=s,n.replaceChildren(),n.className=i?`vizy-image ProseMirror-selectednode`:`vizy-image`,n.dataset.assetUid=t.assetUid,n.dataset.size=t.size,a?.url){let e=document.createElement(`img`);e.src=a.url,e.alt=o,t.title&&(e.title=t.title),e.draggable=!1,n.append(e)}else{n.classList.add(`vizy-image--pending`);let e=document.createElement(`span`);e.className=`vizy-image-placeholder`,e.setAttribute(`role`,`img`),e.setAttribute(`aria-label`,o||`Image`),e.textContent=o||`Image`,n.append(e)}},a=e,o=t?.assetUid??``,s=sl(o,()=>i(a));return i(e),{dom:n,ignoreMutation:e=>e.type!==`selection`,destroy:()=>s(),update:e=>{if(e.type.name!==`image`)return!1;a=e;let t=String(e.attrs.assetUid??``);return t!==o&&(s(),o=t,s=sl(t,()=>i(a))),i(e),!0},selectNode:()=>{n.classList.add(`ProseMirror-selectednode`)},deselectNode:()=>{n.classList.remove(`ProseMirror-selectednode`)}}}},addCommands(){return{setSemanticImage:e=>({chain:t,state:n})=>{let r=ag(e);if(!r)return!1;let{$from:i}=n.selection,a=i.parent;return a.type.name===`paragraph`&&a.content.size===0?t().insertContentAt({from:i.before(),to:i.after()},{type:this.name,attrs:r}).run():t().insertContent({type:this.name,attrs:r}).run()}}}})}var sg=new Set([`entry`,`asset`,`category`,`url`,`email`,`tel`,`sms`,`unknown`]);function cg(e){return typeof e==`string`&&e!==``?e:null}function lg(e){return Array.isArray(e)?e.filter(e=>typeof e==`string`):typeof e==`string`&&e.trim()!==``?e.split(/\s+/):[]}function ug(e,t){let n=sg.has(e.type)?e.type:`url`;return Js({...Object.fromEntries(t.map(t=>[t.name,typeof e[t.name]==`boolean`?e[t.name]:t.default])),type:n,targetUid:cg(e.targetUid),siteMode:e.siteMode===`fixed`?`fixed`:`current`,siteUid:cg(e.siteUid),value:cg(e.value),suffix:cg(e.suffix),newWindow:e.newWindow===!0,title:cg(e.title),ariaLabel:cg(e.ariaLabel),rel:lg(e.rel),class:cg(e.class),id:cg(e.id),download:e.download===!0||typeof e.download==`string`?e.download:null,linkUid:cg(e.linkUid)})}function dg(e=[]){return Ie.create({name:`link`,priority:1e3,inclusive:!0,keepOnSplit:!1,addAttributes(){return{type:{default:`url`},targetUid:{default:null},siteMode:{default:`current`},siteUid:{default:null},value:{default:null},suffix:{default:null},newWindow:{default:!1},title:{default:null},ariaLabel:{default:null},rel:{default:[]},class:{default:null},id:{default:null},download:{default:null},linkUid:{default:null,rendered:!1},...Object.fromEntries(e.map(e=>[e.name,{default:e.default,rendered:!1}]))}},parseHTML(){return[{tag:`a[href]`,getAttrs:t=>{let n=t.getAttribute(`href`);return!n||n.startsWith(`#vizy-link:`)?!1:ug({...kc(n,!1),...fg(t,e)},e)}}]},renderHTML({mark:t}){let n=ug(t.attrs,e),r=Qs(n),i={href:bc(r)?r:`#`,"data-vizy-link-type":n.type};if(n.title&&(i.title=n.title),n.ariaLabel&&(i[`aria-label`]=n.ariaLabel),n.class&&(i.class=n.class),n.id&&(i.id=n.id),n.rel.length&&(i.rel=[...new Set(n.rel)].join(` `)),pg(i,n,e),n.newWindow){i.target=`_blank`;let e=(i.rel??``).split(/\s+/).filter(e=>e&&e.toLowerCase()!==`opener`);e.push(`noopener`,`noreferrer`),i.rel=[...new Set(e)].join(` `)}return[`a`,A(i),0]},addCommands(){return{setSemanticLink:t=>({chain:n})=>n().setMark(this.name,ug(t,e)).setMeta(`preventAutolink`,!0).run(),toggleSemanticLink:t=>({editor:n,chain:r})=>n.isActive(this.name)?r().unsetMark(this.name).run():t?r().setMark(this.name,ug(t,e)).setMeta(`preventAutolink`,!0).run():!1,unsetSemanticLink:()=>({chain:e})=>e().unsetMark(this.name).run()}}})}function fg(e,t){return Object.fromEntries(t.map(t=>{let n=t.htmlAttribute,r=t.htmlValue;if(!n||!r)return[t.name,t.default];let i=e.getAttribute(n)??``,a=r.split(/\s+/).filter(Boolean),o=n===`class`||n===`rel`?a.every(e=>i.split(/\s+/).includes(e)):i===r;return[t.name,o]}))}function pg(e,t,n){for(let r of n)if(!(t[r.name]!==!0||!r.htmlAttribute||!r.htmlValue)){if(r.htmlAttribute===`class`||r.htmlAttribute===`rel`){let t=(e[r.htmlAttribute]??``).split(/\s+/).filter(Boolean),n=r.htmlValue.split(/\s+/).filter(Boolean);e[r.htmlAttribute]=[...new Set([...t,...n])].join(` `)}else e[r.htmlAttribute]=r.htmlValue}}var mg=Bh,hg=Vh;function gg(e,t){if(!Array.isArray(e)||e.length!==t)return $s(t);let n=e.map(e=>Number.parseInt(String(e),10));return n.some(e=>!Number.isInteger(e)||e<1)||n.reduce((e,t)=>e+t,0)!==1e3?$s(t):n}function _g(e,t){let n=gg(e.attrs.columnWidths,t);return e.type.create({...e.attrs,columnWidths:n},e.content,e.marks)}function vg(){return rg.extend({addAttributes(){return{...this.parent?.(),columnWidths:{default:null,parseHTML:e=>{let t=e.getAttribute(`data-column-widths`);if(!t)return null;try{let e=JSON.parse(t);return Array.isArray(e)?e:null}catch{return null}},renderHTML:e=>e.columnWidths?{"data-column-widths":JSON.stringify(e.columnWidths)}:{}}}},addCommands(){return{...this.parent?.()??{},insertTable:({rows:e=3,cols:t=3,withHeaderRow:n=!0}={})=>({tr:r,dispatch:i,editor:a})=>{let o=_g(Yh(a.schema,e,t,n),t);if(i){let e=r.selection.from+1;r.replaceSelectionWith(o).scrollIntoView().setSelection(N.near(r.doc.resolve(e)))}return!0}}},addProseMirrorPlugins(){return[...this.parent?.()??[],new T({appendTransaction:(e,t,n)=>{let r=n.tr,i=!1;return n.doc.descendants((e,t)=>{if(e.type.name!==`table`)return;let n=tc(e);if(n<1)return;let a=gg(e.attrs.columnWidths,n),o=e.attrs.columnWidths,s=Array.isArray(o)?o.reduce((e,t)=>e+t,0):0;(!o||o.length!==n||s!==1e3)&&(r=r.setNodeMarkup(t,void 0,{...e.attrs,columnWidths:a}),i=!0)}),i?r:null}})]}})}function yg(){return mg}function bg(){return hg}function xg(e){return typeof e!=`string`||!/^https?:\/\//i.test(e.trim())?null:jl(e)}function Sg(){return j.create({name:`iframe`,group:`block`,atom:!0,draggable:!0,selectable:!0,addAttributes(){return{url:{default:null},frameborder:{default:0},allowfullscreen:{default:!0}}},parseHTML(){return[{tag:`iframe[src]`,getAttrs:e=>{let t=jl(e.getAttribute(`src`)||``);return t?{url:t,frameborder:0,allowfullscreen:!0}:!1}}]},renderHTML({node:e}){let t=xg(e.attrs.url);return t?[`iframe`,{src:t,frameborder:`0`,allowfullscreen:`true`,class:`vizy-iframe`}]:[`span`,{class:`vizy-iframe__empty`},`Iframe requires a valid URL`]},addNodeView(){return({node:e})=>{let t=document.createElement(`div`);t.className=`vizy-iframe`,t.contentEditable=`false`;let n,r=e=>{let r=t.classList.contains(`ProseMirror-selectednode`),i=xg(e.attrs.url);if(t.className=r?`vizy-iframe ProseMirror-selectednode`:`vizy-iframe`,n===i)return;if(n=i,t.replaceChildren(),!i){let e=document.createElement(`p`);e.className=`vizy-iframe__empty`,e.textContent=`Iframe requires a URL`,t.append(e);return}let a=document.createElement(`iframe`);a.setAttribute(`sandbox`,`allow-scripts`),a.src=i,a.title=`Embedded content`,a.setAttribute(`frameborder`,`0`),a.allowFullscreen=!0,a.loading=`lazy`,a.referrerPolicy=`strict-origin-when-cross-origin`,a.style.pointerEvents=`none`,t.append(a)};return r(e),{dom:t,update:e=>e.type.name===`iframe`&&(r(e),!0),selectNode:()=>{t.classList.add(`ProseMirror-selectednode`)},deselectNode:()=>{t.classList.remove(`ProseMirror-selectednode`)}}}},addCommands(){return{setVizyIframe:e=>({chain:t,state:n})=>{let r=jl(e.url);if(!r)return!1;let i={url:r,frameborder:0,allowfullscreen:!0},{$from:a}=n.selection,o=a.parent;return o.type.name===`paragraph`&&o.content.size===0?t().insertContentAt({from:a.before(),to:a.after()},{type:this.name,attrs:i}).run():t().insertContent({type:this.name,attrs:i}).run()}}}})}function Cg(){return j.create({name:`mediaEmbed`,group:`block`,atom:!0,draggable:!0,selectable:!0,addAttributes(){return{url:{default:null},data:{default:null}}},parseHTML(){return[{tag:`div[data-vizy-media-embed]`,getAttrs:e=>{let t=Ml(e.getAttribute(`data-url`)||``);return t?{url:t.url,data:t.html?{html:t.html}:null}:!1}}]},renderHTML({node:e}){return[`div`,{"data-vizy-media-embed":``,"data-url":typeof e.attrs.url==`string`?e.attrs.url:``,class:`vizy-media-embed`}]},addNodeView(){return({node:e})=>{let t=document.createElement(`div`);t.className=`vizy-media-embed`,t.contentEditable=`false`;let n=``,r=e=>{let r=t.classList.contains(`ProseMirror-selectednode`),i=typeof e.attrs.url==`string`?e.attrs.url:``,a=Ml(i)?.html??null,o=`${i}\0${a??``}`;if(o===n){t.className=r?`vizy-media-embed ProseMirror-selectednode`:`vizy-media-embed`;return}if(n=o,t.className=r?`vizy-media-embed ProseMirror-selectednode`:`vizy-media-embed`,t.replaceChildren(),a){let e=document.createElement(`div`);e.className=`vizy-media-embed__preview`,e.innerHTML=a,e.querySelectorAll(`iframe`).forEach(e=>{e.setAttribute(`sandbox`,`allow-scripts`),e.style.pointerEvents=`none`}),t.append(e);return}let s=document.createElement(`div`);s.className=`vizy-media-embed__card`,s.textContent=i||`Media embed requires a URL`,t.append(s)};return r(e),{dom:t,update:e=>e.type.name===`mediaEmbed`&&(r(e),!0),selectNode:()=>{t.classList.add(`ProseMirror-selectednode`)},deselectNode:()=>{t.classList.remove(`ProseMirror-selectednode`)}}}},addCommands(){return{setVizyMediaEmbed:e=>({chain:t,state:n})=>{let r=Ml(e.url);if(!r)return!1;let i={url:r.url,data:r.html?{html:r.html}:null},{$from:a}=n.selection,o=a.parent;return o.type.name===`paragraph`&&o.content.size===0?t().insertContentAt({from:a.before(),to:a.after()},{type:this.name,attrs:i}).run():t().insertContent({type:this.name,attrs:i}).run()}}}})}var wg=20,Tg=(e,t=0)=>{let n=[];return!e.children.length||t>wg||Array.from(e.children).forEach(e=>{e.tagName===`SPAN`?n.push(e):e.children.length&&n.push(...Tg(e,t+1))}),n},Eg=e=>{if(!e.children.length)return;let t=Tg(e);t&&t.forEach(e=>{var t;let n=e.getAttribute(`style`),r=(t=e.parentElement)==null||(t=t.closest(`span`))==null?void 0:t.getAttribute(`style`);e.setAttribute(`style`,`${r};${n}`)})},Dg=Ie.create({name:`textStyle`,priority:101,addOptions(){return{HTMLAttributes:{},mergeNestedSpanStyles:!0}},parseHTML(){return[{tag:`span`,consuming:!1,getAttrs:e=>e.hasAttribute(`style`)?(this.options.mergeNestedSpanStyles&&Eg(e),{}):!1}]},renderHTML({HTMLAttributes:e}){return[`span`,A(this.options.HTMLAttributes,e),0]},addCommands(){return{toggleTextStyle:e=>({commands:t})=>t.toggleMark(this.name,e),removeEmptyTextStyle:()=>({tr:e})=>{let{selection:t}=e;return e.doc.nodesBetween(t.from,t.to,(t,n)=>{if(!t.isInline)return!0;t.marks.filter(e=>e.type===this.type).some(e=>Object.values(e.attrs).some(e=>!!e))||e.removeMark(n,n+t.nodeSize,this.type)}),!0}}}}),Og=w.create({name:`backgroundColor`,addOptions(){return{types:[`textStyle`]}},addGlobalAttributes(){return[{types:this.options.types,attributes:{backgroundColor:{default:null,parseHTML:e=>(ke(e,`background-color`)??e.style.backgroundColor)?.replace(/['"]+/g,``),renderHTML:e=>e.backgroundColor?{style:`background-color: ${e.backgroundColor}`}:{}}}}]},addCommands(){return{setBackgroundColor:e=>({chain:t})=>t().setMark(`textStyle`,{backgroundColor:e}).run(),unsetBackgroundColor:()=>({chain:e})=>e().setMark(`textStyle`,{backgroundColor:null}).removeEmptyTextStyle().run()}}}),kg=w.create({name:`color`,addOptions(){return{types:[`textStyle`]}},addGlobalAttributes(){return[{types:this.options.types,attributes:{color:{default:null,parseHTML:e=>(ke(e,`color`)??e.style.color)?.replace(/['"]+/g,``),renderHTML:e=>e.color?{style:`color: ${e.color}`}:{}}}}]},addCommands(){return{setColor:e=>({chain:t})=>t().setMark(`textStyle`,{color:e}).run(),unsetColor:()=>({chain:e})=>e().setMark(`textStyle`,{color:null}).removeEmptyTextStyle().run()}}}),Ag=w.create({name:`fontFamily`,addOptions(){return{types:[`textStyle`]}},addGlobalAttributes(){return[{types:this.options.types,attributes:{fontFamily:{default:null,parseHTML:e=>ke(e,`font-family`)??e.style.fontFamily,renderHTML:e=>e.fontFamily?{style:`font-family: ${e.fontFamily}`}:{}}}}]},addCommands(){return{setFontFamily:e=>({chain:t})=>t().setMark(`textStyle`,{fontFamily:e}).run(),unsetFontFamily:()=>({chain:e})=>e().setMark(`textStyle`,{fontFamily:null}).removeEmptyTextStyle().run()}}}),jg=w.create({name:`fontSize`,addOptions(){return{types:[`textStyle`]}},addGlobalAttributes(){return[{types:this.options.types,attributes:{fontSize:{default:null,parseHTML:e=>ke(e,`font-size`)??e.style.fontSize,renderHTML:e=>e.fontSize?{style:`font-size: ${e.fontSize}`}:{}}}}]},addCommands(){return{setFontSize:e=>({chain:t})=>t().setMark(`textStyle`,{fontSize:e}).run(),unsetFontSize:()=>({chain:e})=>e().setMark(`textStyle`,{fontSize:null}).removeEmptyTextStyle().run()}}}),Mg=w.create({name:`lineHeight`,addOptions(){return{types:[`textStyle`]}},addGlobalAttributes(){return[{types:this.options.types,attributes:{lineHeight:{default:null,parseHTML:e=>ke(e,`line-height`)??e.style.lineHeight,renderHTML:e=>e.lineHeight?{style:`line-height: ${e.lineHeight}`}:{}}}}]},addCommands(){return{setLineHeight:e=>({chain:t})=>t().setMark(`textStyle`,{lineHeight:e}).run(),unsetLineHeight:()=>({chain:e})=>e().setMark(`textStyle`,{lineHeight:null}).removeEmptyTextStyle().run()}}});w.create({name:`textStyleKit`,addExtensions(){let e=[];return this.options.backgroundColor!==!1&&e.push(Og.configure(this.options.backgroundColor)),this.options.color!==!1&&e.push(kg.configure(this.options.color)),this.options.fontFamily!==!1&&e.push(Ag.configure(this.options.fontFamily)),this.options.fontSize!==!1&&e.push(jg.configure(this.options.fontSize)),this.options.lineHeight!==!1&&e.push(Mg.configure(this.options.lineHeight)),this.options.textStyle!==!1&&e.push(Dg.configure(this.options.textStyle)),e}});var Ng=120,Pg=160,Fg=8,Ig=`Missing Block Type`;function Lg(e,t){if(e==null)return null;let n=String(e).replace(/\s+/g,` `).trim();return n?n.length<=t?n:`${n.slice(0,t-1)}…`:null}function Rg(e,t){let n=e[t];return n==null?null:typeof n==`string`?n:typeof n==`number`||typeof n==`boolean`?String(n):!Array.isArray(n)&&typeof n==`object`?zg(n,0):null}function zg(e,t){if(t>Fg)return null;if(e.type===`text`&&typeof e.text==`string`)return e.text;if(!Array.isArray(e.content))return null;let n=[];for(let r of e.content){if(r==null||Array.isArray(r)||typeof r!=`object`||r.type===`vizyBlock`)continue;let e=zg(r,t+1);e&&n.push(e)}return n.length?n.join(` `):null}function Bg(e,t){let n=e[t];return Array.isArray(n)&&n.length?n[0]:typeof n==`number`||typeof n==`string`?n:null}function Vg(e,t,n,r,i){let a=t?[t,...n.filter(e=>e!==t)]:[...n];for(let t of a){let n=Lg(Rg(e,t),i);if(n)return n}return Lg(r,i)??r}function Hg(e){let t=!!e.type,n=e.type?.name??Ig,r=e.inference??{titlePlacementUids:[],subtitlePlacementUids:[],mediaPlacementUids:[]},i=t?Vg(e.fieldSlots,e.explicitTitlePlacementUid,r.titlePlacementUids,n,Ng):Ig,a=t?Lg(Vg(e.fieldSlots,e.explicitSubtitlePlacementUid,r.subtitlePlacementUids,``,Pg)||null,Pg):null,o=e.explicitMediaPlacementUid??r.mediaPlacementUids[0]??null,s=o?Bg(e.fieldSlots,o):null;return{blockUid:e.blockUid,blockTypeUid:e.blockTypeUid,typeName:n,title:i,subtitle:a||null,media:s==null?null:{kind:`asset`,reference:s,alt:null,thumbnailUrl:null},enabled:e.enabled,resolved:t,errorCount:e.validation?.errorCount??0,descendantErrorCount:e.validation?.descendantErrorCount??0,revision:e.revision}}function Ug(e,t){let n=null;return e.state.doc.descendants((e,r)=>e.type.name===`vizyBlock`&&String(e.attrs.blockUid)===t?(n=r,!1):n===null),n}function Wg(e,t){let n=Ug(e,t);if(n==null)return null;let r=e.state.doc.nodeAt(n);return!r||r.type.name!==`vizyBlock`?null:{node:r,pos:n}}function Gg(e,t){return e.state.doc.resolve(t).parent===e.state.doc}function Kg(e){let t=0;return e.state.doc.forEach(e=>{e.type.name===`vizyBlock`&&(t+=1)}),t}function qg(e,t){return Wg(e,t)?{kind:`root`}:null}function Jg(e,t,n){let r=[],i=(e,t)=>{if(e.type!==`vizyBlock`){let n=e.content;if(Array.isArray(n))for(let e of n)e&&typeof e==`object`&&i(e,t);return}let a=e.attrs??{},o=String(a.blockUid??``),s=String(a.blockTypeUid??``),c=n.blockTypes[s];o&&c?.fieldLayoutUid&&r.push({blockUid:o,blockTypeUid:s,block:e,destination:t})};return i(e,t),r}async function Yg(e,t,n){n?.flushMountedFields?.();let r=Wg(e,t);if(!r)return!1;let i=String(r.node.attrs.blockTypeUid??``);if(n&&!n.manifest.field.insertableBlockTypeUids.includes(i))return!1;if(n&&Gg(e,r.pos)){let t=n.manifest.field.maxBlocks;if(t!==null&&Kg(e)>=t)return!1}let a=Sd(r.node.toJSON(),void 0,n?.manifest.blockTypes),o=String(a.attrs?.blockUid??``);if(!o)return!1;let s=[];if(n){let r=qg(e,t)??{kind:`root`},i=n.documentRevision(),o=Jg(a,r,n.manifest).map(e=>({...e,documentRevision:i}));if(s=o.map(e=>e.blockUid),o.length)try{await n.prefetchNewBlocks(o)}catch{}}let c=Wg(e,t);if(!c)return n?.discardPrefetchedBlocks?.(s),!1;if(n&&Gg(e,c.pos)){let t=n.manifest.field.maxBlocks;if(t!==null&&Kg(e)>=t)return n.discardPrefetchedBlocks?.(s),!1}let l=e.schema.nodeFromJSON(a),u=c.pos+c.node.nodeSize,d=e.state.doc;return e.view.dispatch(e.state.tr.insert(u,l).scrollIntoView()),e.state.doc.eq(d)?(n?.discardPrefetchedBlocks?.(s),!1):((n?.animateInsert??En)(o),!0)}function Xg(e,t,n=null){let r=Wg(e,t);if(!r||n!==null&&Gg(e,r.pos)&&Kg(e)<=n)return!1;let i=e.state.doc;return e.view.dispatch(e.state.tr.delete(r.pos,r.pos+r.node.nodeSize).scrollIntoView()),!e.state.doc.eq(i)}function Zg(e,t){let n=Wg(e,t);if(!n)return!1;let r=!n.node.attrs.enabled;return e.view.dispatch(e.state.tr.setNodeMarkup(n.pos,void 0,{...n.node.attrs,enabled:r}).scrollIntoView()),!0}function Qg(e,t,n){let r=Wg(e,t);if(!r)return!1;let i=e.state.doc.resolve(r.pos),a=i.parent,o=i.index(),s=o+n;if(s<0||s>=a.childCount)return!1;let c=n<0?r.pos-a.child(o-1).nodeSize:r.pos+r.node.nodeSize+a.child(o+1).nodeSize,l=new M(k.from(r.node),0,0),u=e.state.tr.delete(r.pos,r.pos+r.node.nodeSize),d=u.mapping.map(c);u=u.replaceRange(d,d,l);let f=e.state.doc;return e.view.dispatch(u.scrollIntoView()),!e.state.doc.eq(f)}function $g(e,t,n){let r=Wg(e,n);if(!r)return[];let i=t.buildContext(`inline`,r.pos);return i?t.query({context:i,kinds:[`block`]}).filter(e=>!e.item.requiresInput):[]}function e_(e,t,n){let r=$g(e,t,n);return r.length===1?`Add ${r[0].item.label} above`:`Add Block above`}var t_=new WeakSet;function n_(e){t_.add(e),e.draggable=!0}function r_(e){t_.delete(e),e.draggable=!1,e.removeAttribute(`draggable`)}function i_(e){return t_.has(e)}var a_=null,o_=0;function s_(e){let t=new Map,n=e.parentElement;if(n)for(let e of Array.from(n.children)){if(!(e instanceof HTMLElement)||e.localName!==`vizy-block`)continue;let n=e.getAttribute(`data-block-uid`);if(!n)continue;let r=e.getBoundingClientRect();t.set(n,{top:r.top,left:r.left})}let r=e.getAttribute(`data-block-uid`);if(r&&!t.has(r)){let n=e.getBoundingClientRect();t.set(r,{top:n.top,left:n.left})}a_=t,o_+=1}function c_(){a_=null}function l_(){let e=a_,t=o_;if(!e?.size||Tn()){a_=null;return}if(typeof document>`u`){a_=null;return}a_=null;let n=()=>{if(t===o_)for(let[t,n]of e){let e=document.querySelector(`vizy-block[data-block-uid="${CSS.escape(t)}"]`);if(!e||typeof e.animate!=`function`)continue;let r=e.getBoundingClientRect(),i=n.left-r.left,a=n.top-r.top;Math.abs(i)<1&&Math.abs(a)<1||e.animate([{transform:`translate(${i}px, ${a}px)`},{transform:`translate(0px, 0px)`}],{duration:wn.duration,easing:wn.easing,fill:`backwards`})}};requestAnimationFrame(()=>{requestAnimationFrame(n)})}function u_(e){if(e.type.name!==`vizyBlock`)return null;let t=e.attrs.blockUid;return t==null?null:String(t)}function d_(e,t){let n=null;return e.descendants((e,r)=>e.type.name===`vizyBlock`&&String(e.attrs.blockUid)===t?(n={node:e,from:r},!1):!n),n}var f_=null;function p_(e,t){f_={sourceView:e,dragged:t}}function m_(){f_=null}function h_(e){if(!f_||f_.sourceView!==e)return null;let t=f_.dragged,n=d_(e.state.doc,t.uid);return n?{...t,from:n.from,to:n.from+n.node.nodeSize,node:n.node}:null}function g_(e){let t=e.dragging;if(t?.move){let n=t.node;if(n instanceof O){let e=n.node,t=u_(e);return t?{uid:t,blockTypeUid:String(e.attrs.blockTypeUid),from:n.from,to:n.from+e.nodeSize,node:e}:null}let r=t.slice?.content.firstChild,i=r?u_(r):null;if(!i||!r)return null;let a=d_(e.state.doc,i);return a?{uid:i,blockTypeUid:String(r.attrs.blockTypeUid),from:a.from,to:a.from+a.node.nodeSize,node:r}:null}return h_(e)}function __(e,t,n){let r=t;if(n){let t=It(e,r,n);t!=null&&(r=t)}return r}function v_(e,t){let n=e.resolve(t.from),r=n.depth;if(n.parent.type.name!==`doc`&&n.parent.type.name!==`column`){r=0;for(let e=n.depth;e>0;--e)if(n.node(e).type.name===`column`){r=e;break}}let i=n.node(r),a=n.start(r),o=[];return i.forEach((e,t)=>{let n=a+t;o.push({from:n,to:n+e.nodeSize})}),o}function y_(e,t,n){let r=v_(e.state.doc,n);if(r.length===0)return null;let i=[];for(let t of r){let n=e.nodeDOM(t.from);if(!(n instanceof HTMLElement))continue;let r=n.getBoundingClientRect(),a=r.bottom-r.top;i.push({from:t.from,to:t.to,midY:(r.top+r.bottom)/2,height:a})}if(i.length===0||i.every(e=>e.height<=0))return null;for(let e of i)if(t<e.midY)return e.from;return i[i.length-1].to}function b_(e,t,n,r){let i=y_(e,n,r);if(i!=null)return i;let a=e.posAtCoords({left:t,top:n});return a?__(e.state.doc,a.pos,e.dragging?.slice??null):null}function x_(e,t,n){if(n===t.from||n===t.to)return!1;let r=t.to-t.from,i=e.state.tr;i.delete(t.from,t.to);let a=n<=t.from?n:n-r;i.insert(a,t.node);try{i.setSelection(O.create(i.doc,a))}catch{}return e.dispatch(i.scrollIntoView()),!0}function S_(e,t){let n=e.resolve(t);if(n.parent.type.name===`doc`)return`root`;if(n.parent.type.name===`column`)return`column:${String(n.parent.attrs.columnUid??n.depth)}`;for(let e=n.depth;e>0;--e){let t=n.node(e);if(t.type.name===`column`)return`column:${String(t.attrs.columnUid??e)}`}return`root`}function C_(e,t,n){let r=S_(e,t.from),i=S_(e,n);return r!=null&&i!=null&&r===i}function w_(e,t,n){if(n>t.from&&n<t.to)return!0;let r=e.resolve(n);for(let e=r.depth;e>0;--e){let n=r.node(e);if(n.type.name===`vizyBlock`&&String(n.attrs.blockUid)===t.uid)return!0}return!1}function T_(e,t){let n=e.resolve(t).parent;return n.type.name===`doc`||n.type.name===`column`}function E_(e,t,n,r){return T_(t,n)?e.field.rootContentType===`blocks`?e.field.allowedBlockTypeUids.includes(r):e.field.allowedBlockTypeUids.includes(r)||e.field.insertableBlockTypeUids.includes(r):!1}function D_(e,t,n){let r=g_(e);return!r||!(w_(e.state.doc,r,t)||!C_(e.state.doc,r,t)||!E_(n,e.state.doc,t,r.blockTypeUid)||!$t(e.state.doc,t,r.blockTypeUid,st(n)))}function O_(e){let t=document.createElement(`div`);return t.className=`vizy-block-drag-ghost`,t.textContent=e,t.setAttribute(`aria-hidden`,`true`),Object.assign(t.style,{position:`fixed`,top:`-1000px`,left:`-1000px`,pointerEvents:`none`}),document.body.append(t),t}function k_(e,t){let n=O_(t);return e.dataTransfer?.setDragImage(n,16,14),()=>n.remove()}function A_(e,t){let n=O.create(e.state.doc,t);e.state.selection.eq(n)||e.dispatch(e.state.tr.setSelection(n))}function j_(e){return e.composedPath().some(e=>e instanceof HTMLElement&&(e.matches(`[data-vizy-drag-handle]`)||e.closest?.(`[data-vizy-drag-handle]`)!=null))}function M_(e,t){let n=null,r=null,i=!1,a=r=>{let a=t.getView(),o=t.getPos();if(o==null||!r.dataTransfer){r.preventDefault(),i=!1,r_(e);return}A_(a,o);let s=O.create(a.state.doc,o),c=s.content(),{dom:l,text:u,slice:d}=a.serializeForClipboard(c);r.dataTransfer.clearData(),r.dataTransfer.setData(`text/html`,l.innerHTML),r.dataTransfer.setData(`text/plain`,u),r.dataTransfer.effectAllowed=`copyMove`,a.dragging={slice:d,move:!0,node:s},p_(a,{uid:String(s.node.attrs.blockUid),blockTypeUid:String(s.node.attrs.blockTypeUid),from:s.from,to:s.from+s.node.nodeSize,node:s.node}),n?.(),n=k_(r,t.getLabel()),s_(e),t.onDragChange(!0),r.stopPropagation()},o=n=>{if(n.button!==0)return;let r=t.getPos();r!=null&&(i=!0,n_(e),A_(t.getView(),r))},s=t=>{if(t.target===e){if(!(i||j_(t))){t.preventDefault(),t.stopPropagation();return}a(t)}},c=()=>{i=!1,r_(e),n?.(),n=null,t.onDragChange(!1);try{t.getView().dragging=null}catch{}window.setTimeout(()=>{c_(),m_()},100)},l=()=>{if(i){try{if(t.getView().dragging)return}catch{}i=!1,r_(e)}},u=()=>{let t=e.shadowRoot?.querySelector(`[data-vizy-drag-handle]`)??null;t!==r&&(r?.removeEventListener(`mousedown`,o),r=t,r?.addEventListener(`mousedown`,o))};e.addEventListener(`dragstart`,s,{capture:!0}),e.addEventListener(`dragend`,c),window.addEventListener(`pointerup`,l,!0),r_(e),u();let d=e.shadowRoot?new MutationObserver(()=>u()):null;return d?.observe(e.shadowRoot,{childList:!0,subtree:!0}),()=>{d?.disconnect(),r?.removeEventListener(`mousedown`,o),e.removeEventListener(`dragstart`,s,{capture:!0}),e.removeEventListener(`dragend`,c),window.removeEventListener(`pointerup`,l,!0),c()}}function N_(e){return e.steps.some((t,n)=>{let r=t.toJSON();if(r.stepType===`addMark`||r.stepType===`removeMark`)return!1;if(r.stepType!==`replace`||typeof r.from!=`number`||typeof r.to!=`number`)return!0;let i=e.docs[n];if(!i)return!0;let a=i.resolve(r.from),o=i.resolve(r.to);return a.parent!==o.parent||!a.parent.isTextblock||(r.slice?.content??[]).some(e=>!(e.type?i.type.schema.nodes[e.type]:void 0)?.isInline)})}function P_(e,t,n){let{minBlocks:r,maxBlocks:i,insertableBlockTypeUids:a}=t.field,o=new Map,s=new Map;e.state.doc.descendants((t,c,l,u)=>{if(t.type.name!==`vizyBlock`)return;let d=e.view.nodeDOM(c);if(!(d instanceof I))return;let f=l?s.get(l):void 0;if(f===void 0){let e=0;l?.forEach(t=>{t.type.name===`vizyBlock`&&(e+=1)}),f=e,l&&s.set(l,f)}let p=l===e.state.doc,m=String(t.attrs.blockTypeUid??``);if(d.canDuplicate=a.includes(m)&&(!p||i===null||f<i),d.canDelete=!p||r===null||f>r,d.canMoveUp=u>0,d.canMoveDown=u<(l?.childCount??0)-1,n&&l){let e=o.get(l);e||(e=n.buildContext(`inline`,c)??void 0,e&&o.set(l,e));let t=e?{...e,from:c,to:c}:null,r=t?n.query({context:t,kinds:[`block`]}).filter(e=>!e.item.requiresInput):[];d.canAddAbove=r.length>0,d.addAboveLabel=r.length===1?`Add ${r[0].item.label} above`:`Add Block above`}})}function F_(e,t){return e.composedPath().includes(t)}var I_=class{dom;#e;#t;#n;#r;#i;#a;#o=!1;#s=null;#c=null;constructor(e,t){this.#a=e.node,this.#t=t,this.#n=e.editor,this.#i=e.getPos,this.#r=String(e.node.attrs.blockUid);let n=String(e.node.attrs.blockTypeUid),r=t.manifest.blockTypes[n],i=t.hosts.acquire(this.#r,n,r?.fieldLayoutUid??null,r?.fieldLayoutHash??null),a=t.ui.get(this.#r);this.dom=document.createElement(`vizy-block`),this.dom.blockUid=this.#r,this.dom.canDuplicate=t.manifest.field.insertableBlockTypeUids.includes(n),this.dom.setAttribute(`data-block-uid`,this.#r),r?.color&&(this.dom.style.setProperty(`--vizy-block-accent-color`,r.color),this.dom.accentColor=r.color),r?.iconSvg&&(this.dom.typeIconSvg=r.iconSvg);let o=!!e.node.attrs.enabled;this.dom.enabled=o,this.dom.disabled=!o,this.dom.collapsed=!o||a.collapsed,!o&&!a.collapsed&&t.ui.update(this.#r,{collapsed:!0});let s=a.summary??Hg({blockUid:this.#r,blockTypeUid:n,enabled:!!e.node.attrs.enabled,fieldSlots:e.node.attrs.fieldSlots??{},type:r,inference:r?.summaryInference,revision:t.blockRevision(this.#r),explicitTitlePlacementUid:r?.summary?.titlePlacementUid,explicitSubtitlePlacementUid:r?.summary?.subtitlePlacementUid,explicitMediaPlacementUid:r?.summary?.mediaPlacementUid});a.summary||t.ui.update(this.#r,{summary:s}),this.dom.applySummary(s),this.#d(),this.dom.expectsFieldLayout=!!r?.fieldLayoutUid,r?.layoutTabLabels?.length&&(this.dom.layoutTabLabels=r.layoutTabLabels),this.#e=document.createElement(`div`),this.#e.dataset.vizyBlockContent=``,this.#e.slot=`layout`,this.#e.append(i.root),this.dom.append(this.#e),this.dom.addEventListener(`vizy-collapse-change`,this.#f),this.dom.addEventListener(`vizy-edit-fields`,this.#p),this.dom.addEventListener(`vizy-block-action`,this.#h),this.dom.addEventListener(`vizy-block-header-activate`,this.#m),queueMicrotask(()=>{this.#o||(this.#_(),this.#g())}),r?.fieldLayoutUid&&(this.#s=t.observeFieldViewport(this.dom)),this.dom.draggable=!1,queueMicrotask(()=>{this.#o||(this.#c=M_(this.dom,{getPos:()=>this.#i(),getLabel:()=>this.dom.typeName||`Block`,getView:()=>this.#n.view,onDragChange:e=>{this.dom.dragging=e,this.#t.ui.update(this.#r,{view:{dragging:e}})}}))})}#l=!1;#u(){i_(this.dom)||(this.dom.draggable=!1,this.dom.removeAttribute(`draggable`),!this.#l&&(this.#l=!0,queueMicrotask(()=>{this.#l=!1,!this.#o&&(i_(this.dom)||(this.dom.draggable=!1,this.dom.removeAttribute(`draggable`)))})))}#d(){let e=this.#t.hosts.get(this.#r),t=e?.status,n=t===`mounted`?`mounted`:t===`loading`?`loading`:t===`failed`?`error`:`unmounted`;this.#t.ui.get(this.#r).view.fieldLayout=n,this.dom.fieldLayoutState=n,this.dom.fieldLayoutError=t===`failed`?e?.errorMessage??null:null,(t===`mounted`||t===`failed`)&&(this.dom.fieldLayoutRetrying=!1)}#f=e=>{if(e.target!==this.dom)return;e.stopPropagation();let t=e.detail.collapsed;this.#t.ui.update(this.#r,{collapsed:t}),e.detail.persist!==!1&&(t?vu(this.#r):yu(this.#r))};#p=e=>{e.target===this.dom&&(e.stopPropagation(),this.#t.ui.update(this.#r,{editingFields:!0}),this.#t.openFields(this.#r))};#m=e=>{if(e.target!==this.dom)return;e.stopPropagation();let t=this.#i();if(t!=null)try{A_(this.#n.view,t),Cn(pn(this.#n.view.dom),()=>{Sn(this.#n,{force:!0})})}catch{}};#h=e=>{if(e.target!==this.dom)return;e.stopPropagation();let{action:t,invoker:n}=e.detail,r=this.#n;switch(t){case`duplicate`:this.#t.suspendInsertionSideEffects?.(),this.#t.duplicateBlock(this.#r).finally(()=>{this.#t.resumeInsertionSideEffects?.(),this.#t.refreshSummaries()});return;case`delete`:if(this.#t.manifest.field.confirmBlockDeletion===!0){let e=window.Craft?.t?.(`vizy`,`Delete this block?`)??`Delete this block?`;if(!window.confirm(e))break}Xg(r,this.#r,this.#t.manifest.field.minBlocks)&&yu(this.#r);break;case`toggleEnabled`:Zg(r,this.#r);break;case`moveUp`:Qg(r,this.#r,-1);break;case`moveDown`:Qg(r,this.#r,1);break;case`addAbove`:{let e=n??this.dom.shadowRoot?.querySelector(`[part="menu-trigger"]`)??null;e&&this.#t.openAddBlockAbove?.(this.#r,e);break}}this.#t.refreshSummaries()};update(e){if(e.type!==this.#a.type||String(e.attrs.blockUid)!==this.#r||String(e.attrs.blockTypeUid)!==String(this.#a.attrs.blockTypeUid))return!1;this.#a=e;let t=this.#t.ui.get(this.#r);return this.dom.enabled=!!e.attrs.enabled,this.dom.disabled=!e.attrs.enabled,this.dom.applySummary(t.summary),this.#d(),this.#_(),this.#g(),this.#u(),!0}#g(){let e=this.#t.insertion;if(!e?.buildContext){this.dom.canAddAbove=!1,this.dom.addAboveLabel=`Add Block above`;return}let t=$g(this.#n,e,this.#r);this.dom.canAddAbove=t.length>0,this.dom.addAboveLabel=e_(this.#n,e,this.#r)}#_(){let e=this.#i();if(e==null)return;let t=this.#n.state.doc.resolve(e),n=t.parent,r=t.index(),i=n===this.#n.state.doc,a=0;n.forEach(e=>{e.type.name===`vizyBlock`&&(a+=1)});let{minBlocks:o,maxBlocks:s,insertableBlockTypeUids:c}=this.#t.manifest.field,l=String(this.#a.attrs.blockTypeUid??``);this.dom.canDuplicate=c.includes(l)&&(!i||s===null||a<s),this.dom.canDelete=!i||o===null||a>o,this.dom.canMoveUp=r>0,this.dom.canMoveDown=r<n.childCount-1}selectNode(){this.dom.selected=!0,this.#t.ui.update(this.#r,{view:{selected:!0}}),this.#u()}deselectNode(){this.dom.selected=!1,this.#t.ui.update(this.#r,{view:{selected:!1}}),this.#u()}stopEvent(e){let t=this.dom.shadowRoot?.querySelector(`[data-vizy-drag-handle]`);return t&&F_(e,t)?!1:this.#t.hosts.roots(this.#r).some(t=>F_(e,t))||(this.dom.shadowRoot?e.composedPath().includes(this.dom.shadowRoot):!1)}ignoreMutation(e){return e.type!==`selection`}destroy(){this.#o||(this.#o=!0,this.#s?.(),this.#s=null,this.#c?.(),this.#c=null,this.dom.removeEventListener(`vizy-collapse-change`,this.#f),this.dom.removeEventListener(`vizy-edit-fields`,this.#p),this.dom.removeEventListener(`vizy-block-action`,this.#h),this.dom.removeEventListener(`vizy-block-header-activate`,this.#m),this.#t.hosts.releaseView(this.#r))}};function L_(e){return j.create({name:`vizyBlock`,group:`block`,content:``,defining:!0,isolating:!0,selectable:!0,draggable:!0,addAttributes:()=>({blockUid:{default:null,rendered:!1},blockTypeUid:{default:null,rendered:!1},enabled:{default:!0,rendered:!1},fieldSlots:{default:{},rendered:!1},matrixAnchorUid:{default:null,rendered:!1}}),parseHTML:()=>[],renderHTML:({HTMLAttributes:e})=>[`vizy-block`,A(e)],addNodeView:()=>t=>new I_(t,e())})}function R_(e,t,n){if(e.type===`selection`)return!1;let r=e.target;return!(r instanceof globalThis.Node)||r===t||t.shadowRoot?.contains(r)?!0:!n.contains(r)}var z_=class{dom;contentDOM;#e;#t;constructor(e,t){this.#e=e.getPos,this.#t=t,this.dom=document.createElement(`vizy-layout`),this.dom.layoutUid=String(e.node.attrs.layoutUid),this.dom.stack=String(e.node.attrs.stack??`small`),this.contentDOM=document.createElement(`div`),this.contentDOM.className=`vizy-layout-columns`,this.contentDOM.slot=`columns`,this.contentDOM.style.display=`grid`,this.contentDOM.style.gridTemplateColumns=`repeat(12, minmax(0, 1fr))`,this.contentDOM.style.gap=`0.75rem`,this.contentDOM.style.width=`100%`,this.contentDOM.style.minHeight=`0`,this.contentDOM.style.alignItems=`start`,this.contentDOM.style.boxSizing=`border-box`,this.dom.append(this.contentDOM),this.#n(e.node)}#n(e){this.dom.layoutUid=String(e.attrs.layoutUid),this.dom.stack=String(e.attrs.stack??`small`);let t=[],n=[];for(let r=0;r<e.childCount;r++){let i=e.child(r);t.push(Number(i.attrs.span??12)),n.push(String(i.attrs.columnUid??``))}this.dom.columnSpans=t,this.dom.columnUids=n;let r=this.#t().editor;r&&(this.dom.editor=r,this.dom.layoutPos=this.#e()??null)}update(e){return e.type.name===`layout`&&(this.#n(e),!0)}ignoreMutation(e){return R_(e,this.dom,this.contentDOM)}},B_=class{dom;contentDOM;constructor(e){this.dom=document.createElement(`vizy-column`),this.contentDOM=document.createElement(`div`),this.contentDOM.slot=`content`,this.dom.append(this.contentDOM),this.#e(e.node)}#e(e){this.dom.columnUid=String(e.attrs.columnUid),this.dom.span=Number(e.attrs.span??12),this.dom.style.gridColumn=`span ${Math.min(12,Math.max(1,this.dom.span))}`;let t=this.dom.closest(`vizy-layout`);if(t){let e=t.columnUids??[];this.dom.columnIndex=e.indexOf(this.dom.columnUid),this.dom.columnCount=e.length}}update(e){return e.type.name===`column`&&(this.#e(e),!0)}ignoreMutation(e){return R_(e,this.dom,this.contentDOM)}};function V_(e){return j.create({name:`layout`,group:`block`,content:`column+`,defining:!0,isolating:!0,addAttributes:()=>({layoutUid:{default:null,rendered:!1},stack:{default:`small`}}),parseHTML:()=>[{tag:`vizy-layout`}],renderHTML:({HTMLAttributes:e})=>[`vizy-layout`,A(e),0],addNodeView:()=>t=>new z_(t,e)})}function H_(){return j.create({name:`column`,content:`block*`,defining:!0,isolating:!0,addAttributes:()=>({columnUid:{default:null,rendered:!1},span:{default:12}}),parseHTML:()=>[{tag:`vizy-column`}],renderHTML:({HTMLAttributes:e})=>[`vizy-column`,A(e),0],addNodeView:()=>e=>new B_(e)})}var U_=j.create({name:`doc`,topNode:!0,content:`block*`,addAttributes:()=>({schemaVersion:{default:2,rendered:!1}})}),W_=[1,2,3,4,5,6];function G_(e){let t=(e?.headingLevels??[]).filter(e=>W_.includes(e));return t.length?t:W_}var K_=Object.freeze({"vizy/core/node/doc":()=>U_,"vizy/core/node/text":()=>Up,"vizy/core/node/vizyBlock":e=>L_(e?.services??(()=>{throw Error(`vizyNodeViewServicesMissing`)})),"vizy/core/node/layout":e=>V_(()=>({editor:e?.services?.().editor})),"vizy/core/node/column":()=>H_(),"vizy/core/node/paragraph":()=>zp,"vizy/core/node/heading":e=>Ef.configure({levels:G_(e?.manifest)}),"vizy/core/node/blockquote":()=>ff,"vizy/core/node/codeBlock":()=>wf,"vizy/core/node/horizontalRule":()=>Df,"vizy/core/node/hardBreak":()=>Tf,"vizy/core/node/bulletList":()=>If,"vizy/core/node/orderedList":()=>jp,"vizy/core/node/listItem":()=>ap,"vizy/core/node/image":()=>og(),"vizy/core/node/iframe":()=>Sg(),"vizy/core/node/mediaEmbed":()=>Cg(),"vizy/core/node/table":()=>vg(),"vizy/core/node/tableRow":()=>ig,"vizy/core/node/tableCell":()=>yg(),"vizy/core/node/tableHeader":()=>bg(),"vizy/core/mark/bold":()=>_f,"vizy/core/mark/code":()=>bf,"vizy/core/mark/highlight":()=>qp,"vizy/core/mark/italic":()=>Mf,"vizy/core/mark/link":e=>dg(e?.manifest.field.linkAttributes),"vizy/core/mark/strike":()=>Hp,"vizy/core/mark/subscript":()=>Jp,"vizy/core/mark/superscript":()=>Yp,"vizy/core/mark/textStyle":()=>Dg,"vizy/core/mark/underline":()=>Wp});function q_(e,t){let n=e.flatMap(e=>{let n=K_[e]??ge(e);if(!n)throw Error(`untrustedEditorModule:${e}`);let r=n(t);return Array.isArray(r)?r:[r]});return He(n,t)}function J_(e){let t=[];return e.forEach(e=>{e.type.name===`vizyBlock`&&t.push(e)}),t}function Y_(e,t){e.set(t,(e.get(t)??0)+1)}function X_(e){for(let t of[`blockUid`,`layoutUid`,`columnUid`,`nodeUid`]){let n=e.attrs?.[t];if(typeof n==`string`&&n)return`${t}:${n}`}return`shape:${JSON.stringify(e.toJSON(),(e,t)=>!t||typeof t!=`object`||Array.isArray(t)?t:Object.fromEntries(Object.entries(t).sort(([e],[t])=>e.localeCompare(t))))}`}function Z_(e,t){let n=new Map,r=J_(e);t.field.rootContentType===`blocks`&&e.forEach(e=>{e.type.name!==`vizyBlock`&&Y_(n,`root:prose:${X_(e)}`)}),r.forEach(e=>{t.field.allowedBlockTypeUids.includes(String(e.attrs.blockTypeUid))||Y_(n,`root:type:${String(e.attrs.blockUid)}:${String(e.attrs.blockTypeUid)}`)}),t.field.minBlocks!==null&&r.length<t.field.minBlocks&&n.set(`root:min`,t.field.minBlocks-r.length),t.field.maxBlocks!==null&&r.length>t.field.maxBlocks&&n.set(`root:max`,r.length-t.field.maxBlocks);let i=st(t);return e.descendants((t,r)=>{if(t.type.name!==`vizyBlock`)return;let a=String(t.attrs.blockTypeUid);Zt(e,r,a)>i&&Y_(n,`depth:${String(t.attrs.blockUid)}:${a}`)}),n}var Q_=w.create({name:`vizyContentPolicy`,addOptions:()=>({manifest:null}),addProseMirrorPlugins(){let e=this.options.manifest;return[new T({filterTransaction(t,n){if(!t.docChanged||t.getMeta(`vizyAcceptedCanonical`)===!0)return!0;let r=Z_(n.doc,e);return[...Z_(t.doc,e)].every(([e,t])=>t<=(r.get(e)??0))}})]}});function $_(e){return new T({view(t){return new ev(t,e)}})}var ev=class{editorView;#e;cursorPos=null;element=null;timeout=-1;lastDragEvent=null;width;color;className;handlers;constructor(e,t){this.editorView=e,this.#e=t.manifest,this.width=t.width??1,this.color=t.color===!1?void 0:t.color||`black`,this.className=t.class,this.handlers=[`dragover`,`dragend`,`drop`,`dragleave`].map(t=>{let n=e=>{this[t](e)};return e.dom.addEventListener(t,n,!0),{name:t,handler:n}})}destroy(){this.handlers.forEach(({name:e,handler:t})=>{this.editorView.dom.removeEventListener(e,t,!0)})}update(e,t){if(this.cursorPos!=null&&t.doc!==e.state.doc){if(this.lastDragEvent){let e=this.computeTarget(this.lastDragEvent);e===this.cursorPos?this.updateOverlay():this.setCursor(e)}else this.updateOverlay()}}setCursor(e){e!==this.cursorPos&&(this.cursorPos=e,e==null?(this.element?.parentNode?.removeChild(this.element),this.element=null):this.updateOverlay())}updateOverlay(){let e=this.editorView.state.doc.resolve(this.cursorPos),t=!e.parent.inlineContent,n,r=this.editorView.dom,i=r.getBoundingClientRect(),a=i.width/r.offsetWidth,o=i.height/r.offsetHeight;if(t){let t=e.nodeBefore,r=e.nodeAfter;if(t||r){let e=this.editorView.nodeDOM(this.cursorPos-(t?t.nodeSize:0));if(e instanceof HTMLElement){let i=e.getBoundingClientRect(),a=t?i.bottom:i.top;if(t&&r){let e=this.editorView.nodeDOM(this.cursorPos);e instanceof HTMLElement&&(a=(a+e.getBoundingClientRect().top)/2)}let s=this.width/2*o;n={left:i.left,right:i.right,top:a-s,bottom:a+s}}}}if(!n){let e=this.editorView.coordsAtPos(this.cursorPos),t=this.width/2*a;n={left:e.left-t,right:e.left+t,top:e.top,bottom:e.bottom}}let s=this.editorView.dom.offsetParent;this.element||(this.element=s.appendChild(document.createElement(`div`)),this.className&&(this.element.className=this.className),this.element.style.cssText=`position: absolute; z-index: 50; pointer-events: none;`,this.color&&(this.element.style.backgroundColor=this.color)),this.element.classList.toggle(`prosemirror-dropcursor-block`,t),this.element.classList.toggle(`prosemirror-dropcursor-inline`,!t);let c,l;if(!s||s===document.body&&getComputedStyle(s).position===`static`)c=-window.pageXOffset,l=-window.pageYOffset;else{let e=s.getBoundingClientRect(),t=e.width/s.offsetWidth,n=e.height/s.offsetHeight;c=e.left-s.scrollLeft*t,l=e.top-s.scrollTop*n}this.element.style.left=`${(n.left-c)/a}px`,this.element.style.top=`${(n.top-l)/o}px`,this.element.style.width=`${(n.right-n.left)/a}px`,this.element.style.height=`${(n.bottom-n.top)/o}px`}scheduleRemoval(e){window.clearTimeout(this.timeout),this.timeout=window.setTimeout(()=>this.setCursor(null),e)}computeTarget(e){let t=g_(this.editorView);if(!t)return null;let n=b_(this.editorView,e.clientX,e.clientY,t);return n==null||!D_(this.editorView,n,this.#e)?null:n}dragover(e){if(!this.editorView.editable)return;this.lastDragEvent=e;let t=this.computeTarget(e);t==null?this.setCursor(null):(this.setCursor(t),this.scheduleRemoval(150))}dragend(){this.scheduleRemoval(20)}drop(){this.scheduleRemoval(20)}dragleave(e){let t=e.relatedTarget;(!(t instanceof Node)||!this.editorView.dom.contains(t))&&this.setCursor(null)}};function tv(e,t,n){let r=g_(e);if(!r)return!1;let i=b_(e,t.clientX,t.clientY,r);return i==null||!D_(e,i,n)?(m_(),!0):(x_(e,r,i)?(m_(),l_()):m_(),!0)}function nv(e){return w.create({name:`vizyBlockMoveDrop`,addProseMirrorPlugins(){return[$_({color:`#0284c7`,width:2,class:`vizy-block-dropcursor`,manifest:e}),new T({view(t){let n=n=>{if(g_(t)&&tv(t,n,e)){n.preventDefault(),n.stopPropagation();try{t.dragging=null}catch{}}},r=e=>{g_(t)&&(e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect=`move`))};return t.dom.addEventListener(`drop`,n,!0),t.dom.addEventListener(`dragover`,r,!0),{destroy(){t.dom.removeEventListener(`drop`,n,!0),t.dom.removeEventListener(`dragover`,r,!0)}}},props:{handleDrop(t,n,r,i){let a=g_(t);return!i||!a?!1:tv(t,n,e)}}})]}})}function rv(e){let{char:t,allowSpaces:n,allowToIncludeChar:r,allowedPrefixes:i,startOfLine:a,$position:o}=e,s=n&&!r,c=Re(t),l=RegExp(`\\s${c}$`),u=a?`^`:``,d=r?``:c,f=RegExp(s?`${u}${c}.*?(?=\\s${d}|$)`:`${u}(?:^)?${c}[^\\s${d}]*`,`gm`),p=o.nodeBefore?.isText&&o.nodeBefore.text;if(!p)return null;let m=o.pos-p.length,h=Array.from(p.matchAll(f)).pop();if(!h||h.input===void 0||h.index===void 0)return null;let g=h.input.slice(Math.max(0,h.index-1),h.index),_=RegExp(`^[${i?.join(``)}\0]?$`).test(g);if(i!==null&&!_)return null;let ee=m+h.index,v=ee+h[0].length;return s&&l.test(p.slice(v-1,v+1))&&(h[0]+=` `,v+=1),ee<o.pos&&v>=o.pos?{range:{from:ee,to:v},query:h[0].slice(t.length),text:h[0]}:null}function iv(e){return e.docChanged?e.steps.some(e=>{let t=e.slice;if(!t?.content)return!1;let n=t.content.textBetween(0,t.content.size,`
`);return/\s/.test(n)}):!1}function av(e){return()=>{let t=e.state.selection.$anchor.pos,{top:n,right:r,bottom:i,left:a}=e.view.coordsAtPos(t);try{return new DOMRect(a,n,r-a,i-n)}catch{return null}}}function ov(e,t,n,r){return n?()=>{let n=r.getState(e.state)?.decorationId;return t.dom.querySelector(`[data-decoration-id="${n}"]`)?.getBoundingClientRect()||null}:av(e)}function sv({match:e,dismissedRange:t,state:n,transaction:r,editor:i,shouldResetDismissed:a,effectiveAllowSpaces:o}){return a?.({editor:i,state:n,range:t,match:e,transaction:r,allowSpaces:o})?!1:o?e.range.from===t.from:e.range.from===t.from&&!iv(r)}function cv({view:e,pluginKeyRef:t}){let n=e.state.tr.setMeta(t,{exit:!0});e.dispatch(n)}function lv({pluginKey:e,decorationTag:t,decorationClass:n,decorationContent:r,decorationEmptyClass:i,renderer:a,dispatchExit:o}){return{handleKeyDown(t,n){var r;let i=e.getState(t.state);if(!i.active)return!1;if(n.key===`Escape`||n.key===`Esc`){var s;return a==null||(s=a.onKeyDown)==null||s.call(a,{view:t,event:n,range:i.range}),o(t),!0}return(a==null||(r=a.onKeyDown)==null?void 0:r.call(a,{view:t,event:n,range:i.range}))||!1},decorations(a){let{active:o,range:s,decorationId:c,query:l}=e.getState(a);if(!o)return null;let u=!l?.length,d=[n];return u&&d.push(i),Kt.create(a.doc,[Et.inline(s.from,s.to,{nodeName:t,class:d.join(` `),"data-decoration-id":c||void 0,"data-decoration-content":r})])}}}function uv({editor:e,char:t,effectiveAllowSpaces:n,allowToIncludeChar:r,allowedPrefixes:i,startOfLine:a,findSuggestionMatch:o,allow:s,shouldShow:c,shouldKeepDismissed:l,pluginKey:u}){return{init(){return{active:!1,range:{from:0,to:0},query:null,text:null,composing:!1,dismissedRange:null}},apply(d,f,p,m){let{isEditable:h}=e,{composing:g}=e.view,{selection:_}=d,{empty:ee,from:v}=_,y={...f},b=d.getMeta(u);if(b&&b.exit)return y.active=!1,y.decorationId=null,y.range={from:0,to:0},y.query=null,y.text=null,y.dismissedRange=f.active?{...f.range}:f.dismissedRange,y;if(y.composing=g,d.docChanged&&y.dismissedRange!==null&&(y.dismissedRange={from:d.mapping.map(y.dismissedRange.from),to:d.mapping.map(y.dismissedRange.to)}),h&&(ee||e.view.composing)){(v<f.range.from||v>f.range.to)&&!g&&!f.composing&&(y.active=!1);let u=o({char:t,allowSpaces:n,allowToIncludeChar:r,allowedPrefixes:i,startOfLine:a,$position:_.$from}),p=`id_${Math.floor(Math.random()*4294967295)}`;u&&s({editor:e,state:m,range:u.range,isActive:f.active})&&(!c||c({editor:e,range:u.range,query:u.query,text:u.text,transaction:d}))?(y.dismissedRange!==null&&!l({match:u,dismissedRange:y.dismissedRange,state:m,transaction:d})&&(y.dismissedRange=null),y.dismissedRange===null?(y.active=!0,y.decorationId=f.decorationId||p,y.range=u.range,y.query=u.query,y.text=u.text):y.active=!1):(u||(y.dismissedRange=null),y.active=!1)}else y.active=!1;return y.active||(y.decorationId=null,y.range={from:0,to:0},y.query=null,y.text=null),y}}}function dv({editor:e,items:t}){let n=null,r=null,i=null,a=()=>{r!==null&&(clearTimeout(r),r=null),i?.(),i=null},o=e=>new Promise(t=>{i=t,r=setTimeout(()=>{r=null;let e=i;i=null,e?.()},e)}),s=()=>{n?.abort(),a(),n=null};return{abort:s,fetch:async(r,i)=>{s(),n=new AbortController;let a=n;if(i>0&&await o(i),n!==a||a.signal.aborted)return{status:`aborted`};try{let i=await t({editor:e,query:r,signal:a.signal});return n!==a||a.signal.aborted?{status:`aborted`}:{status:`resolved`,items:i}}catch{return n!==a||a.signal.aborted?{status:`aborted`}:{status:`error`}}}}}function fv({placement:e,offset:t,flip:n,floatingUi:r}){var i;let a=[ee({mainAxis:t.mainAxis??4,crossAxis:t.crossAxis??0})];return n&&a.push(g()),r!=null&&(i=r.middleware)!=null&&i.length&&a.push(...r.middleware),{placement:e,strategy:r?.strategy??`absolute`,middleware:a}}function pv(e){if(e instanceof HTMLElement)return e;if(typeof e==`string`)try{let t=document.querySelector(e);if(t)return t}catch{return document.body}return document.body}function mv({getReferenceRect:e,contextElement:t,config:n,container:r,dismissOnOutsideClick:i,dismiss:a}){return(o,s={})=>{let c={getBoundingClientRect:()=>e()??new DOMRect,contextElement:t},l=!1,u=!o.isConnected;u&&pv(r).appendChild(o),s.onPosition||(o.style.visibility=`hidden`,o.style.width=`max-content`);let d=v(c,o,()=>{_(c,o,{placement:n.placement,strategy:n.strategy,middleware:n.middleware}).then(({x:e,y:t,placement:n,strategy:r})=>{if(s.onPosition){s.onPosition({x:e,y:t,placement:n,strategy:r});return}Object.assign(o.style,{position:r,left:`${e}px`,top:`${t}px`}),l||(l=!0,o.style.visibility=``)})},s.autoUpdate),f;return i&&(f=e=>{let n=e.target;!(n instanceof Node)||o.contains(n)||t.contains(n)||a()},document.addEventListener(`pointerdown`,f,!0)),()=>{d(),f&&document.removeEventListener(`pointerdown`,f,!0),u&&o.remove()}}}function hv({editor:e,pluginKey:t,items:n,renderer:r,minQueryLength:i,debounce:a,initialItems:o,placement:s,offset:c,container:l,flip:u,floatingUi:d,dismissOnOutsideClick:f,command:p,clientRectFor:m,dispatchExit:h}){let g,_=dv({editor:e,items:n}),ee=fv({placement:s,offset:c,flip:u,floatingUi:d});function v(e,t){switch(e){case`started`:var n;r==null||(n=r.onStart)==null||n.call(r,t);break;case`updated`:var i;r==null||(i=r.onUpdate)==null||i.call(r,t);break;case`stopped`:var a;r==null||(a=r.onExit)==null||a.call(r,t)}}return{update:async(n,d)=>{let y=t.getState(d),b=t.getState(n.state);if(!y||!b)return;let x=null,S=y.query!==b.query,C=y.text!==b.text,te=y.range.from!==b.range.from||y.range.to!==b.range.to,ne=S||C||te;if(!y.active&&b.active)x=`started`;else if(y.active&&!b.active)x=`stopped`;else if(b.active&&ne)x=`updated`;else return;let re=x===`stopped`?y:b,ie=n.dom.querySelector(`[data-decoration-id="${re.decorationId}"]`),ae=m(n,ie),oe=i===0||(re.query?re.query.length>=i:!1),se=(x===`started`||x===`updated`)&&oe;if(g={editor:e,range:re.range,query:re.query||``,text:re.text||``,items:o??[],command:t=>p({editor:e,range:re.range,props:t}),decorationNode:ie,clientRect:ae,loading:se,placement:s,offset:{mainAxis:c.mainAxis??4,crossAxis:c.crossAxis??0},container:l,flip:u,floatingUi:ee,mount:mv({getReferenceRect:ae,contextElement:n.dom,config:ee,container:l,dismissOnOutsideClick:f,dismiss:()=>h(e.view)})},x===`started`){var ce;r==null||(ce=r.onBeforeStart)==null||ce.call(r,g)}if(x===`updated`){var le;r==null||(le=r.onBeforeUpdate)==null||le.call(r,g)}if(x===`started`&&v(x,g),x===`started`||x===`updated`){if(!se)_.abort(),g={...g,items:o??[],loading:!1};else{g={...g,items:o??[],loading:!0},x=`updated`,v(x,g);let e=await _.fetch(re.query||``,a);if(e.status===`aborted`)return;if(!t.getState(n.state)?.active){_.abort();return}g=e.status===`resolved`?{...g,items:e.items,loading:!1}:{...g,loading:!1}}}if(x===`stopped`){_.abort(),v(x,g),g=void 0;return}x===`updated`&&v(x,g)},destroy:()=>{var e;_.abort(),g&&(r==null||(e=r.onExit)==null||e.call(r,g))}}}var gv=new E(`suggestion`);function _v({pluginKey:e=gv,editor:t,char:n=`@`,allowSpaces:r=!1,allowToIncludeChar:i=!1,allowedPrefixes:a=[` `],startOfLine:o=!1,decorationTag:s=`span`,decorationClass:c=`suggestion`,decorationContent:l=``,decorationEmptyClass:u=`is-empty`,command:d=()=>null,items:f=()=>[],minQueryLength:p=0,debounce:m=0,initialItems:h,placement:g=`bottom-start`,offset:_={},container:ee,flip:v=!0,floatingUi:y,dismissOnOutsideClick:b=!0,render:x=()=>({}),allow:S=()=>!0,findSuggestionMatch:C=rv,shouldShow:te,shouldResetDismissed:ne}){let re=x?.(),ie=r&&!i,ae=(n,r)=>ov(t,n,r,e);function oe(e){return sv({...e,editor:t,shouldResetDismissed:ne,effectiveAllowSpaces:ie})}let se=t=>cv({view:t,pluginKeyRef:e});return new T({key:e,view:()=>hv({editor:t,pluginKey:e,items:f,renderer:re,minQueryLength:p,debounce:m,initialItems:h,placement:g,offset:_,container:ee,flip:v,floatingUi:y,dismissOnOutsideClick:b,command:d,clientRectFor:ae,dispatchExit:se}),state:uv({editor:t,char:n,effectiveAllowSpaces:ie,allowToIncludeChar:i,allowedPrefixes:a,startOfLine:o,findSuggestionMatch:C,allow:S,shouldShow:te,shouldKeepDismissed:oe,pluginKey:e}),props:lv({pluginKey:e,decorationTag:s,decorationClass:c,decorationContent:l,decorationEmptyClass:u,renderer:re,dispatchExit:se})})}function vv(e,t=gv){let n=e.state.tr.setMeta(t,{exit:!0});e.dispatch(n)}var yv=_v,bv=[`block`];function xv(e,t){return e&&t.some(t=>t.item.id===e)?e:null}function Sv(e,t,n){if(!t.length)return null;let r=e?t.findIndex(t=>t.item.id===e):-1;return r<0?n===1?t[0]?.item.id??null:t[t.length-1]?.item.id??null:t[(r+n+t.length)%t.length]?.item.id??null}var Cv=new Jn;function wv(e,t){return t?e.schemaRevision===t.schemaRevision&&JSON.stringify(e.container)===JSON.stringify(t.container):!1}function Tv(e){return(e.field.insertableBlockTypeUids??[]).length===0}function Ev(e){let t=e.filter(e=>!e.item.requiresInput);return t.length===1?t[0]:null}async function Dv(e,t,n,r){let i=e.insertion.buildContext(t.surface,t.from);if(!i||!wv(t,i))return!1;let a=await e.insertion.execute({id:n,context:i});return a.status===`inserted`?!0:a.status===`opened`&&n===`transform:vizy:layout`?Ov(e,i,r):a.status===`opened`}function Ov(e,t,n){let r=_t(e.manifest),i=e.editor.view.dom.closest(`.vizy-editor-surface`)?.parentElement??e.editor.view.dom.parentElement;if(!i||!r.length)return Promise.resolve(!1);let a=n??e.editor.view.coordsAtPos(t.from),o=n??new DOMRect(a.left,a.top,1,a.bottom-a.top);return new Promise(n=>{Cv.open(o,r,i,{returnFocus:e.editor.view.dom,onSelect:r=>{e.insertion.execute({id:Lt,context:t,input:{presetId:r}}).then(e=>n(e.status===`inserted`))},onClose:()=>n(!1)})})}var kv=new WeakMap;function Av(e){kv.delete(e)}function jv(e,t=`inline`){let{editor:n}=e,r=n.state.doc,i=kv.get(n)?.get(t);if(i?.doc===r)return i.anchors;let a=[];Tv(e.manifest)||((n,r,i)=>{let o=n.type.name===`doc`?r:r+1,s=[],c=o;n.forEach(e=>{let t=c;c+=e.nodeSize,(i!==`blocks`||e.type.name===`vizyBlock`)&&(s.length===0&&s.push({position:o,measurePos:t,measureSide:`top`}),s.push({position:c,measurePos:t,measureSide:`bottom`}))}),s.length===0&&s.push({position:o,measurePos:o,measureSide:`top`});for(let n of s){let r=e.insertion.buildContext(t,n.position);r&&e.insertion.query({context:r,limit:1}).length&&a.push({...n,context:r})}})(n.state.doc,0,e.manifest.field.rootContentType);let o=kv.get(n)??new Map;return o.set(t,{doc:r,anchors:a}),kv.set(n,o),a}function Mv(e,t,n={}){let r=n.distance??4,i=n.pad??10,a=n.capPx??320,o=n.minPx??120,s=n.viewportHeight??window.innerHeight,c=t.split(`-`)[0]||`bottom`,l;switch(c){case`top`:l=e.top-r-i;break;case`bottom`:l=s-e.bottom-r-i;break;default:l=s-i*2}return Math.max(o,Math.min(a,Math.floor(l)))}var Nv=class{#e=null;#t=null;#n=0;#r=null;open(e,t,n,r={}){this.close({restoreFocus:!1,animate:!1});let i=r.search??``,a=r.kinds,o=r.list?[...r.list.items]:[...e.insertion.query({context:t,search:i||void 0,kinds:a})];if(!o.length&&!r.list)return;let s=r.list??new Hn;s.listId=s.listId||`vizy-popover-${t.surface}-${t.from}`,s.items=o.length?o:s.items,s.query=i;let c=r.filterable!==!1;s.filterable=c,s.view=`list`,s.showViewToggle=r.showViewToggle!==!1,s.activeId=null,s.revealActive=!1;let l=r.getClientRect??(()=>n),u=r.skipEnterMotion===!0,d=c&&r.autofocusFilter!==!1,f=r.holdFieldFocus!==!1;this.#o(e,{context:t,list:s,getClientRect:l,returnFocus:r.returnFocus??null,onRestoreFocus:r.onRestoreFocus??null,invokerKey:r.invokerKey??null,onClose:r.onClose??(()=>void 0),onSelect:r.onSelect,onViewChange:r.onViewChange,search:i,filterMode:`panel`,autofocusFilter:d,holdFieldFocus:f,skipEnterMotion:u,kinds:a})}stepActive(e){return this.#e?(this.#e.activeId=Sv(this.#e.activeId,this.#e.list.items,e),this.#e.list.activeId=this.#e.activeId,this.#e.list.revealActive=!0,this.#e.activeId):null}stepSlash(e){return this.stepActive(e)}get activeId(){return this.#e?.activeId??null}selectActive(){return this.#e&&this.#e.list.revealActive&&this.#e.activeId?this.#e.activeId:null}refresh(e){if(!this.#e)return;let t=e.insertion.buildContext(this.#e.context.surface,this.#e.context.from);if(!wv(this.#e.context,t)){this.close();return}this.#e.context=t;let n=[...e.insertion.query({context:t,search:this.#e.search||void 0,kinds:this.#e.kinds})];this.#e.list.items=n,this.#e.activeId=xv(this.#e.activeId,n),this.#e.list.activeId=this.#e.activeId,this.#e.activeId||(this.#e.list.revealActive=!1)}close(e={}){this.#t?.(),this.#t=null;let t=this.#e;if(this.#e=null,!t){e.animate===!1&&this.#i();return}this.#i();let n=++this.#n;e.restoreFocus!==!1&&this.#a(t);let r=!1,i=()=>{r||n!==this.#n||(r=!0,this.#r===t&&(this.#r=null),mn(t.fieldBody,!1),t.popup.active=!1,t.popup.remove(),t.list.remove(),t.onClose())};if(!(e.animate===!0&&t.list.hasAttribute(`data-open`))){t.list.classList.remove(`closing`),t.list.removeAttribute(`data-open`),t.list.removeAttribute(`data-instant`),i();return}this.#r=t,t.list.removeAttribute(`data-instant`),t.list.classList.add(`closing`);let a=e=>{e.target===t.list&&e.animationName===`vizy-insertion-menu-hide`&&(t.list.removeEventListener(`animationend`,a),i())};t.list.addEventListener(`animationend`,a),window.setTimeout(i,140)}#i(){let e=this.#r;this.#r=null,++this.#n,e&&(e.list.classList.remove(`closing`),e.list.removeAttribute(`data-open`),e.list.removeAttribute(`data-instant`),mn(e.fieldBody,!1),e.popup.active=!1,e.popup.remove(),e.list.remove(),e.onClose())}#a(e){if(e.onRestoreFocus){e.onRestoreFocus();return}e.returnFocus?.classList.contains(`vizy-inline-add`)||e.returnFocus?.focus()}get isOpen(){return this.#e!==null}get isClosing(){return this.#r!==null}isClosingInvoker(e){return!e||!this.#r?!1:this.#r.invokerKey===e}isInvoker(e){return!e||!this.#e||!(e instanceof HTMLElement)||!this.#e.invokerKey?!1:e.dataset.vizyInvokerKey===this.#e.invokerKey}get invokerKey(){return this.#e?.invokerKey??null}#o(e,t){let n=document.createElement(`pk-popup`);n.className=`vizy-insertion-popup`,n.placement=`bottom-start`,n.distance=4,n.flip=!0,n.flipPadding=10,n.shift=!0,n.shiftPadding=10,n.anchorTracking=!0,n.positionMethod=`fixed`;let r={getClientRect:t.getClientRect};n.anchor={getBoundingClientRect:()=>r.getClientRect?.()??new DOMRect},n.append(t.list),document.body.append(n);let i=t.holdFieldFocus?pn(e.editor.view.dom):null;i&&mn(i,!0);let a={kind:`list`,popup:n,list:t.list,context:t.context,activeId:t.list.activeId,returnFocus:t.returnFocus,onRestoreFocus:t.onRestoreFocus,invokerKey:t.invokerKey,onClose:t.onClose,search:t.search,rectSource:r,fieldBody:i,filterMode:t.filterMode,kinds:t.kinds};this.#e=a,n.active=!0;let o=()=>{if(this.#e!==a)return;let e=Mv(a.rectSource.getClientRect?.()??new DOMRect,a.popup.getAttribute(`data-current-placement`)??a.popup.placement,{distance:a.popup.distance});a.list.style.maxHeight=`${e}px`};n.addEventListener(`pk-reposition`,o),o(),this.#s(a,{instant:t.skipEnterMotion});let s=n=>{let r=t.onSelect??(t=>Dv(e,a.context,t));e.suspendInsertionSideEffects?.();let i=r(n);this.close({restoreFocus:!1,animate:!1}),Promise.resolve(i).finally(()=>{e.resumeInsertionSideEffects?.()})};t.list.addEventListener(`vizy-insertion-select`,(e=>{s(e.detail.id)})),t.list.addEventListener(`vizy-insertion-view`,(e=>{t.onViewChange?.(e.detail.view)})),t.list.addEventListener(`vizy-insertion-filter`,(t=>{if(!this.#e)return;this.#e.search=t.detail.query;let n=[...e.insertion.query({context:this.#e.context,search:this.#e.search,kinds:this.#e.kinds})];this.#e.list.items=n,this.#e.list.query=this.#e.search,this.#e.activeId=null,this.#e.list.activeId=null,this.#e.list.revealActive=!1}));let c=e=>{if(this.#e){if(e.key===`Escape`){e.preventDefault(),this.close({restoreFocus:!0,animate:!0});return}if(e.key===`ArrowDown`||e.key===`ArrowUp`){e.preventDefault(),this.stepActive(e.key===`ArrowDown`?1:-1);return}if(e.key===`Enter`){let t=this.#e.list.revealActive?this.#e.activeId:null;if(!t)return;e.preventDefault(),s(t)}}},l=e=>{if(!this.#e)return;let t=e.composedPath();t.includes(this.#e.popup)||t.includes(this.#e.list)||t.some(e=>e instanceof HTMLElement&&(e.classList.contains(`vizy-inline-add`)||e.hasAttribute(`data-vizy-toolbar-add-block`)))||this.close({restoreFocus:!1,animate:!0})};document.addEventListener(`keydown`,c,!0),document.addEventListener(`pointerdown`,l,!0),this.#t=()=>{n.removeEventListener(`pk-reposition`,o),document.removeEventListener(`keydown`,c,!0),document.removeEventListener(`pointerdown`,l,!0)},t.autofocusFilter&&t.list.focusFilterWhenReady?.()}async#s(e,t={}){let n=await this.#c(e.popup);if(this.#e!==e)return;let r=n.split(`-`)[0]||`bottom`;e.list.dataset.side=r,t.instant?e.list.dataset.instant=``:delete e.list.dataset.instant;let i=e.popup.shadowRoot?.querySelector(`.popup`),a=i instanceof HTMLElement?getComputedStyle(i).getPropertyValue(`--pk-transform-origin`).trim():``;a&&e.list.style.setProperty(`--pk-transform-origin`,a),e.list.dataset.open=``}#c(e){let t=e.placement||`bottom-start`,n=()=>e.getAttribute(`data-current-placement`)??t;return new Promise(t=>{let r=!1,i=()=>{r||(r=!0,t(n()))};e.addEventListener(`pk-reposition`,i,{once:!0}),window.setTimeout(i,300)})}},Pv=o`
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
`,Fv=class extends l{constructor(...e){super(...e),this.value=``,this.variant=`default`,this.orientation=`horizontal`,this.placement=`top`,this.activation=`manual`,this.disabled=!1,this.ariaLabel=null,this.baseId=y(`pk-tabs`),this.tabs=[],this.panels=[],this.focusedValue=``,this.syncTabs=()=>{let e=this.shadowRoot?.querySelector(`slot[name="nav"]`);e&&(this.tabs=e.assignedElements({flatten:!0}).filter(e=>e.tagName===`PK-TAB`),this.ensureDefaultValue(),this.applySelection())},this.syncPanels=()=>{let e=this.shadowRoot?.querySelector(`slot:not([name])`);e&&(this.panels=e.assignedElements({flatten:!0}).filter(e=>e.tagName===`PK-TAB-PANEL`),this.applySelection())},this.handleTabSelect=e=>{if(!this.isOwnTabEvent(e)||this.disabled)return;e.stopPropagation();let{value:t}=e.detail;if(t===this.value&&this.activation===`manual`){this.focusedValue=t,this.applySelection();return}t!==this.value&&this.selectTab(t)},this.handleTabKeyDown=e=>{if(!this.isOwnTabEvent(e))return;e.stopPropagation();let t=e.detail.event,n=this.getEnabledTabs();if(n.length===0)return;let r=n.findIndex(t=>t.value===e.detail.value);if(r<0)return;let i=r,a=this.getEffectiveOrientation()===`horizontal`;switch(t.key){case`ArrowDown`:if(a)return;t.preventDefault(),i=r>=n.length-1?0:r+1;break;case`ArrowUp`:if(a)return;t.preventDefault(),i=r<=0?n.length-1:r-1;break;case`ArrowRight`:if(!a)return;t.preventDefault(),i=r>=n.length-1?0:r+1;break;case`ArrowLeft`:if(!a)return;t.preventDefault(),i=r<=0?n.length-1:r-1;break;case`Home`:t.preventDefault(),i=0;break;case`End`:t.preventDefault(),i=n.length-1;break;default:return}let o=n[i];o&&(this.activation===`auto`?o.value===this.value?o.focusControl():this.selectTab(o.value):(this.focusedValue=o.value,this.applySelection(),o.focusControl()))}}static{this.styles=Pv}connectedCallback(){super.connectedCallback(),this.addEventListener(`pk-tab-select`,this.handleTabSelect),this.addEventListener(`pk-tab-keydown`,this.handleTabKeyDown)}disconnectedCallback(){this.removeEventListener(`pk-tab-select`,this.handleTabSelect),this.removeEventListener(`pk-tab-keydown`,this.handleTabKeyDown),super.disconnectedCallback()}updated(e){(e.has(`value`)||e.has(`disabled`)||e.has(`activation`))&&(e.has(`value`)&&(this.focusedValue=this.value),this.applySelection())}ensureDefaultValue(){if(this.value||this.tabs.length===0)return;let e=this.tabs.find(e=>!e.disabled&&!this.disabled);e&&(this.value=e.value,this.focusedValue=this.value)}getEnabledTabs(){return this.tabs.filter(e=>!e.disabled&&!this.disabled)}getEffectiveOrientation(){return this.variant===`sidebar`?`vertical`:this.orientation}getEffectivePlacement(){return this.variant===`sidebar`&&(this.placement===`top`||this.placement===`bottom`)?`start`:this.placement}applySelection(){let e=this.getAttribute(`data-current-value`)??``,t=this.activation===`manual`?this.focusedValue:this.value;for(let e of this.tabs){let n=e.value===this.value,r=`${this.baseId}-tab-${e.value}`,i=`${this.baseId}-panel-${e.value}`;e.selected=n,e.disabled=this.disabled||e.hasAttribute(`disabled`),e.focusIndex=e.value===t?0:-1,e.panelId=i,e.id=r}for(let t of this.panels){let n=t.value===this.value,r=`${this.baseId}-tab-${t.value}`,i=`${this.baseId}-panel-${t.value}`;t.hidden!==!n&&(n?this.dispatchEvent(new CustomEvent(`pk-tab-show`,{detail:{value:t.value},bubbles:!0,composed:!0})):e===t.value&&this.dispatchEvent(new CustomEvent(`pk-tab-hide`,{detail:{value:t.value},bubbles:!0,composed:!0}))),t.hidden=!n,t.tabId=r,t.id=i}this.setAttribute(`data-current-value`,this.value)}isOwnTabEvent(e){let t=e.target;return t instanceof HTMLElement&&t.tagName===`PK-TAB`&&this.tabs.includes(t)}selectTab(e){this.value=e,this.focusedValue=e,this.applySelection(),this.dispatchEvent(new CustomEvent(`pk-change`,{detail:{value:this.value},bubbles:!0,composed:!0}))}render(){let e=this.getEffectiveOrientation();return n`
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
        `}};i([c()],Fv.prototype,`value`,void 0),i([c({reflect:!0})],Fv.prototype,`variant`,void 0),i([c({reflect:!0})],Fv.prototype,`orientation`,void 0),i([c({reflect:!0})],Fv.prototype,`placement`,void 0),i([c({reflect:!0})],Fv.prototype,`activation`,void 0),i([c({type:Boolean,reflect:!0})],Fv.prototype,`disabled`,void 0),i([c({attribute:`aria-label`})],Fv.prototype,`ariaLabel`,void 0),i([a()],Fv.prototype,`tabs`,void 0),i([a()],Fv.prototype,`panels`,void 0),i([a()],Fv.prototype,`focusedValue`,void 0),Fv=i([s(`pk-tabs`)],Fv);var Iv=class extends l{constructor(...e){super(...e),this.value=``,this.disabled=!1,this.selected=!1,this.focusIndex=-1}focusControl(){this.shadowRoot?.querySelector(`.trigger`)?.focus()}handleClick(){this.disabled||this.dispatchEvent(new CustomEvent(`pk-tab-select`,{detail:{value:this.value},bubbles:!0,composed:!0}))}handleKeyDown(e){this.dispatchEvent(new CustomEvent(`pk-tab-keydown`,{detail:{event:e,value:this.value},bubbles:!0,composed:!0}))}renderTrigger(e){return n`
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
        `}};i([c()],Iv.prototype,`value`,void 0),i([c({type:Boolean,reflect:!0})],Iv.prototype,`disabled`,void 0),i([c({type:Boolean,reflect:!0})],Iv.prototype,`selected`,void 0),i([c({type:Number,attribute:`focus-index`})],Iv.prototype,`focusIndex`,void 0),i([c()],Iv.prototype,`panelId`,void 0);var Lv=o`
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
`,Rv=class extends Iv{static{this.styles=Lv}render(){return this.renderTrigger(`trigger pk-tabs__trigger`)}};Rv=i([s(`pk-tab`)],Rv);var zv=class extends l{constructor(...e){super(...e),this.value=``,this.hidden=!0}renderPanel(e){return n`
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
        `}};i([c()],zv.prototype,`value`,void 0),i([c({type:Boolean,reflect:!0})],zv.prototype,`hidden`,void 0),i([c()],zv.prototype,`tabId`,void 0);var Bv=o`
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
`,Vv=class extends zv{static{this.styles=Bv}render(){return this.renderPanel(`content pk-tabs__content`)}};Vv=i([s(`pk-tab-panel`)],Vv);var Hv=class extends t{#e=[];get items(){return this.#e}set items(e){this.#e=e}#t=``;get query(){return this.#t}set query(e){this.#t=e}#n=`grid`;get view(){return this.#n}set view(e){this.#n=e}#r=!0;get filterable(){return this.#r}set filterable(e){this.#r=e}#i=!0;get showViewToggle(){return this.#i}set showViewToggle(e){this.#i=e}#a=`all`;get activeTab(){return this.#a}set activeTab(e){this.#a=e}#o=null;get activeId(){return this.#o}set activeId(e){this.#o=e}static styles=o`
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
    `;#s=null;#c=null;#l=null;#u=null;#d=0;#f=!1;open(e){this.items=e.items,this.filterable=e.filterable!==!1,this.showViewToggle=e.showViewToggle!==!1,this.query=this.filterable?e.query??``:``,this.view=`grid`,this.activeTab=`all`,this.activeId=null,this.#c=e.onSelect,this.#l=e.onView??null,this.#u=e.onClose??null,this.#f=!0;let t=++this.#d;this.#p(t)}async#p(e){await Vc(),e===this.#d&&(this.setAttribute(`autofocus`,``),this.#m(),await this.updateComplete,e===this.#d&&(this.#s&&(this.#s.open=!0),this.#f=!1,await this.updateComplete,await new Promise(e=>requestAnimationFrame(()=>e())),e===this.#d&&(this.focusFilter()||this.focusFirstBlock())))}focusFilter(){if(!this.filterable)return!1;let e=this.shadowRoot?.querySelector(`pk-input`),t=e?.shadowRoot?.querySelector(`input`)??this.shadowRoot?.querySelector(`input[type="search"]`);return t?(t.focus({preventScroll:!0}),e?.shadowRoot?.activeElement===t||this.shadowRoot?.activeElement===e||document.activeElement===e||document.activeElement===this):!1}focusFirstBlock(){let e=this.shadowRoot?.querySelector(`button.card`);return e?(e.focus({preventScroll:!0}),this.shadowRoot?.activeElement===e):!1}close(e={}){let t=e.notify!==!1;if(++this.#d,this.#f=!1,t||(this.#u=null),this.#s)this.#s.open?this.#s.open=!1:this.#h(this.#s,t);else{let e=t?this.#u:null;this.#g(),this.remove(),e?.()}}get isOpen(){return this.#f||!!this.#s?.open}disconnectedCallback(){super.disconnectedCallback(),this.#s?.remove(),this.#s=null}#m(){if(this.#s)return;let e=document.createElement(`pk-dialog`);e.label=`Add Block`,e.size=`wide`,e.withoutBodyPadding=!0,e.append(this),e.addEventListener(`pk-open-change`,(t=>{t.detail?.open===!1&&this.#h(e,!0)})),document.body.append(e),this.#s=e}#h(e,t){let n=t?this.#u:null;this.#g(),this.#s===e&&(this.#s=null),e.remove(),n?.()}#g(){this.#u=null,this.#c=null,this.#l=null}render(){let e=this.#v(),t=e.length>1,r=this.filterable||this.showViewToggle;return n`
            <div class="dialog-bar">
                ${r?n`<div class="toolbar">
                    ${this.filterable?n`
                    <pk-input
                        type="search"
                        placeholder="Search Blocks…"
                        .value=${this.query}
                        aria-label="Search Blocks"
                        @input=${this.#S}
                    >
                        <pk-icon slot="start" icon="magnifying-glass" label=""></pk-icon>
                    </pk-input>
                    `:null}
                    ${this.showViewToggle?n`
                    <pk-toggle-group
                        class="view-toggle"
                        variant="outline"
                        spacing="0"
                        aria-label="View"
                        .value=${[this.view]}
                        @pk-value-change=${this.#T}
                    >
                        <pk-toggle data-value="list" aria-label="List view">
                            <pk-icon icon="list" label=""></pk-icon>
                        </pk-toggle>
                        <pk-toggle data-value="grid" aria-label="Grid view">
                            <pk-icon icon="grid-2" label=""></pk-icon>
                        </pk-toggle>
                    </pk-toggle-group>
                    `:null}
                </div>`:null}
                ${t?n`
                    <pk-tabs
                        class="browse-tabs"
                        variant="modal"
                        .value=${this.activeTab}
                        aria-label="Block groups"
                        @pk-change=${this.#C}
                    >
                        ${e.map(e=>n`
                            <pk-tab slot="nav" value=${e.id}>${e.label}</pk-tab>
                        `)}
                        ${e.map(e=>n`
                            <pk-tab-panel value=${e.id}>
                                ${this.#_(e.id)}
                            </pk-tab-panel>
                        `)}
                    </pk-tabs>
                `:this.#_(`all`)}
            </div>
        `}#_(e){let t=this.#y(e);if(!t.length)return n`<div class="empty">${this.query?`No matching Blocks.`:`No Blocks available.`}</div>`;let r=t.some(e=>e.item.id===this.activeId)?this.activeId:t[0].item.id;return n`
            <div
                class="grid"
                role="listbox"
                aria-label="Blocks"
                @keydown=${this.#w}
                @mouseleave=${()=>{this.activeId=null}}
            >
                ${t.map(e=>this.#b(e,e.item.id===r))}
            </div>
        `}#v(){let e=new Set;for(let t of this.items)t.item.group&&e.add(t.item.group);let t=[{id:`all`,label:`All`}];for(let n of[...e].sort((e,t)=>e.localeCompare(t)))t.push({id:n,label:n});return t}#y(e=this.activeTab){let t=this.query.trim().toLowerCase();return this.items.filter(n=>e!==`all`&&n.item.group!==e?!1:!t||[n.item.label,n.item.group,...n.item.keywords,...n.item.aliases].join(` `).toLowerCase().includes(t))}#b(e,t){let r=e.item.id,i=e.item.previewImageUrl?.trim();return n`
            <button
                type="button"
                class="card"
                role="option"
                data-active=${this.activeId===r?`true`:`false`}
                aria-selected=${String(this.activeId===r)}
                tabindex=${t?0:-1}
                @mouseenter=${()=>{this.activeId=r}}
                @focus=${()=>{this.activeId=r}}
                @blur=${()=>{this.activeId===r&&(this.activeId=null)}}
                @click=${()=>this.#D(r)}
            >
                <div
                    class="thumb"
                    style=${e.item.icon?.color?`--vizy-block-accent-color: ${e.item.icon.color}`:``}
                >${i?n`<img src=${i} alt="" />`:this.#x(e)}</div>
                <span class="label">${e.item.label}</span>
            </button>
        `}#x(e){let t=e.item.icon?.svg?.trim(),r=e.item.icon?.name?.trim();return t&&r!==`vizy-block-fallback`?C(t):n`<pk-icon icon=${h} label=""></pk-icon>`}#S=e=>{let t=e.currentTarget;this.query=t.value??``,this.activeId=null};#C=e=>{let t=e.detail?.value?.trim();t&&(this.activeTab=t,this.activeId=null)};#w=e=>{if(![`ArrowLeft`,`ArrowRight`,`ArrowUp`,`ArrowDown`,`Home`,`End`].includes(e.key))return;let t=[...e.currentTarget.querySelectorAll(`button.card`)];if(!t.length)return;let n=e.composedPath().find(e=>e instanceof HTMLButtonElement),r=Math.max(0,n?t.indexOf(n):0);e.key===`Home`&&(r=0),e.key===`End`&&(r=t.length-1),e.key===`ArrowLeft`&&(r=Math.max(0,r-1)),e.key===`ArrowRight`&&(r=Math.min(t.length-1,r+1)),e.key===`ArrowUp`&&(r=Math.max(0,r-4)),e.key===`ArrowDown`&&(r=Math.min(t.length-1,r+4)),e.preventDefault(),e.stopPropagation(),t[r]?.focus({preventScroll:!0})};#T=e=>{let t=e.detail?.value?.[0];if(t===`list`||t===`grid`){this.#E(t);return}let n=e.currentTarget;n.value=[this.view]};#E(e){this.view=e,this.#l?.(e)}#D(e){this.#c?.(e)}};F([c({attribute:!1})],Hv.prototype,`items`,null),F([c()],Hv.prototype,`query`,null),F([c()],Hv.prototype,`view`,null),F([c({type:Boolean})],Hv.prototype,`filterable`,null),F([c({type:Boolean,attribute:`show-view-toggle`})],Hv.prototype,`showViewToggle`,null),F([c({attribute:`active-tab`})],Hv.prototype,`activeTab`,null),F([a()],Hv.prototype,`activeId`,null),Hv=F([P(`vizy-block-browse-dialog`)],Hv);var Uv=class{#e=null;get isOpen(){return!!this.#e?.isOpen}open(e,t,n,r){this.close({notify:!1});let i=document.createElement(`vizy-block-browse-dialog`);this.#e=i,i.open({items:n,query:r.query,filterable:r.filterable,showViewToggle:r.showViewToggle,onSelect:n=>{let i=r.onSelect??(n=>Dv(e,t,n));e.suspendInsertionSideEffects?.();let a=i(n);this.close(),Promise.resolve(a).finally(()=>{e.resumeInsertionSideEffects?.()})},onView:e=>{r.onView?.(e)},onClose:()=>{this.#e===i&&(this.#e=null),r.onClose?.()}})}close(e={}){this.#e?.close(e),this.#e=null}},Wv=`Vizy.blockInsertView`;function Gv(e){let t=window.Craft?.systemUid;return`${typeof t==`string`&&t!==``?`Craft-${t}`:`Craft`}.${Wv}.${e}`}function Kv(e,t=`list`){if(!e||typeof localStorage>`u`)return t;try{let n=localStorage.getItem(Gv(e));return n===`list`||n===`grid`?n:t}catch{return t}}function qv(e,t=`both`,n=`list`){return t===`list`||t===`grid`?t:Kv(e,n)}function Jv(e,t){if(!(!e||typeof localStorage>`u`))try{localStorage.setItem(Gv(e),t)}catch{}}var Yv=new E(`vizySlash`),Xv=new Nv,Zv=new Uv,Qv=!1;function $v(e,t){if(e.manifest.slashInsert===!1)return null;let n=e.insertion.buildContext(`slash`,t);return!n||n.contentType===`blocks`||!e.editor.state.doc.resolve(t).parent.isTextblock||!e.insertion.query({context:n,kinds:bv,limit:1}).length?null:n}function ey(e,t){if(e.doc.textBetween(t.from,t.to,``,``)!==`/`)return!1;let n=e.doc.resolve(t.from);if(!n.parent.isTextblock)return!1;let r=n.start(),i=n.end(),a=e.doc.textBetween(r,t.from,``,``),o=e.doc.textBetween(t.to,i,``,``);return a.length===0&&o.length===0}function ty(e,t){try{let n=e.view.coordsAtPos(t);return new DOMRect(n.left,n.top,0,n.bottom-n.top)}catch{return new DOMRect}}function ny(e,t,n){let r=bv,i=[...e.insertion.query({context:t,kinds:r})];if(!i.length)return;let a=()=>ty(e.editor,n),o=a()??new DOMRect,s=e.manifest.field.fieldHandle?.trim()||``,c=e.manifest.field.blockPickerDisplay,l=c===`list`||c===`grid`?c:`both`,u=qv(s,l,e.manifest.field.defaultBlockPickerView===`grid`?`grid`:`list`),d=e.manifest.field.showBlockSearch!==!1,f=l===`both`,p=r=>{let i=e.insertion.buildContext(`slash`,n);return!i||!wv(t,i)?Promise.resolve(!1):Dv(e,i,r)},m=i=>{if(!f)return;Jv(s,i);let a=[...e.insertion.query({context:t,kinds:r})];if(i===`grid`){Xv.close({restoreFocus:!1,animate:!1}),Zv.open(e,t,a,{filterable:d,showViewToggle:f,onView:r=>{Jv(s,r),r===`list`&&(Zv.close(),ny(e,t,n))},onSelect:p});return}Zv.close(),ny(e,t,n)};if(u===`grid`){Zv.open(e,t,i,{filterable:d,showViewToggle:f,onView:f?m:void 0,onSelect:p});return}Xv.open(e,t,o,{kinds:r,getClientRect:a,filterMode:`panel`,filterable:d,showViewToggle:f,autofocusFilter:d,holdFieldFocus:!0,onRestoreFocus:()=>{e.editor.commands.focus(void 0,{scrollIntoView:!1})},onViewChange:f?m:void 0,onSelect:p})}function ry(e){return w.create({name:`vizySlash`,addProseMirrorPlugins(){return[yv({pluginKey:Yv,editor:this.editor,char:`/`,startOfLine:!0,allowedPrefixes:null,allow:({range:t,state:n})=>ey(n,t)?$v(e(),t.from)!==null:!1,items:()=>[{}],render:()=>({onStart:t=>{let n=e(),r=t.range;if(!ey(n.editor.state,r))return;let i=$v(n,r.from);if(!i)return;Qv=!0;let a=r.from;n.editor.chain().focus().deleteRange(r).run(),vv(n.editor.view,Yv);let o=n.insertion.buildContext(`slash`,a)??i;if(o.contentType===`blocks`){Qv=!1;return}ny(n,o,a),Qv=!1},onExit:()=>{Qv||(Xv.close({restoreFocus:!1,animate:!1}),Zv.close())}}),command:()=>void 0})]}})}function iy(e,t){let n=t.action;return n?.command===`toggleMark`?e.enabledMarks.includes(n.markName):n?.command===`setLink`?e.enabledMarks.includes(`link`):n?.command===`toggleNode`||n?.command===`insertNode`?e.enabledNodes.includes(n.nodeName):n?.command!==`setHeading`||e.enabledNodes.includes(`heading`)}function ay(e,t){let n=[];for(let r of t){if(r.kind===`group`){let t=ay(e,r.items??[]);t.length&&n.push({...r,items:t});continue}iy(e,r)&&n.push(r)}return n}function oy(e){let t=ay(e,e.toolbar?.controls??[]);return w.create({name:`vizyToolbar`,addStorage:()=>({controls:t})})}function sy(e){let t=ay(e,e.bubble?.controls??[]);return w.create({name:`vizyBubble`,addStorage:()=>({controls:t})})}function cy(e){return w.create({name:`vizyLayoutCommands`,addCommands(){return{wrapInLayout:()=>({editor:t,state:n})=>{let r=e();if(!r.manifest.enabledNodes.includes(`layout`))return!1;let i=Nt(_t(r.manifest)),{from:a,to:o}=n.selection;return!(n.selection instanceof O)&&!Bt(t,a,o)?!1:ut(t,a,o,i,()=>crypto.randomUUID(),`small`,n)},unwrapLayout:()=>({editor:e,state:t,dispatch:n})=>{let r=Un(e,t.selection.from);if(!r)return!1;let i=String(r.node.attrs.layoutUid);return!n||Gt(e,i)}}}})}function ly(e){if(e.type!==`paragraph`)return!1;let t=e.content;return!t?.length||t.every(e=>e.type===`text`&&!(e.text??``).length)}function uy(e,t){return t.field.rootContentType!==`rich`||e.type!==`doc`||(e.content??[]).length>0?e:{...e,content:[{type:`paragraph`}]}}function dy(e,t){if(t.field.rootContentType!==`rich`||e.type!==`doc`)return e;let n=e.content??[];return n.length!==1||!ly(n[0])?e:{type:`doc`,attrs:e.attrs,content:[]}}function fy(e){return w.create({name:`vizyRootTypingSurface`,addProseMirrorPlugins(){if(e.field.rootContentType!==`rich`)return[];let{paragraph:t}=this.editor.schema.nodes;return t?[new T({appendTransaction(e,n,r){if(r.doc.content.size>0)return null;let i=r.tr.insert(0,t.create());return i.setSelection(N.create(i.doc,1)),i}})]:[]}})}var py=new Set([`link`,`meta`,`noscript`,`script`,`style`]);function my(e){for(let t of[...e.childNodes]){if(t.nodeType===Node.COMMENT_NODE){t.remove();continue}my(t)}}function hy(e){e.replaceWith(...e.childNodes)}function gy(e){my(e);for(let t of[...e.querySelectorAll(`*`)]){let e=t.tagName.toLowerCase();if(py.has(e)){t.remove();continue}if(e.includes(`:`)){(t.textContent??``).replace(/[\s\u00a0]+/g,``)?hy(t):t.remove();continue}for(let e of[...t.attributes])e.name.toLowerCase().startsWith(`on`)&&t.removeAttribute(e.name);t.id.startsWith(`docs-internal-guid-`)&&t.removeAttribute(`id`),e===`a`&&!t.hasAttribute(`href`)&&/^_/.test(t.getAttribute(`name`)??``)&&hy(t)}}function _y(e){for(let t of[...e.querySelectorAll(`[role="heading"][aria-level]`)]){let e=Number(t.getAttribute(`aria-level`));if(!Number.isInteger(e)||e<1||e>6)continue;let n=document.createElement(`h${e}`);n.append(...t.childNodes),t.replaceWith(n)}}function vy(e){let t=e.getAttribute(`style`)??``;if(!/\bmso-list\s*:/i.test(t)&&!/\bMsoListParagraph\b/i.test(e.className))return null;let n=/\bmso-list\s*:\s*([^\s;]+)[^;]*?\blevel(\d+)/i.exec(t),r=([...e.querySelectorAll(`span`)].find(e=>/\bmso-list\s*:\s*Ignore\b/i.test(e.getAttribute(`style`)??``))?.textContent??``).replace(/\u00a0/g,` `).trim(),i=/^(?:\(?\d+|\(?[A-Za-z]+)[.)]/.test(r),a=/^\(?(\d+)[.)]/.exec(r);return{kind:i?`ol`:`ul`,level:Math.max(1,Number(n?.[2]??1)),listId:n?.[1]??null,start:a?Number(a[1]):null}}function yy(e){let t=vy(e);if(!t)return null;let n=e.cloneNode(!0);for(let e of[...n.querySelectorAll(`span`)])/\bmso-list\s*:\s*Ignore\b/i.test(e.getAttribute(`style`)??``)&&e.remove();let r=n.firstChild;return r?.nodeType===Node.TEXT_NODE&&(r.textContent=(r.textContent??``).replace(/^[\s\u00a0]+/,``),r.textContent||r.remove()),{...t,contents:[...n.childNodes]}}function by(e){let t=document.createElement(e.kind);return e.kind===`ol`&&e.start!==null&&e.start>1&&t.setAttribute(`start`,String(e.start)),{kind:e.kind,list:t,listId:e.listId,lastItem:null}}function xy(e){let t=document.createDocumentFragment(),n=[];for(let r of e){let e=Math.min(r.level,n.length+1);e>1&&!n[e-2]?.lastItem&&(e=1),n.length=Math.min(n.length,e);let i=e===1?t:n[e-2].lastItem,a=n[e-1];if(!a||a.kind!==r.kind||a.listId!==r.listId){let t=by(r);i.append(t.list),n.length=e-1,n.push(t)}let o=n[e-1],s=document.createElement(`li`);s.append(...r.contents),o.list.append(s),o.lastItem=s}return t}function Sy(e){let t=[...e.querySelectorAll(`p`)];for(let e of t){if(!e.parentNode||!vy(e))continue;let t=e.previousElementSibling;if(t instanceof HTMLParagraphElement&&vy(t))continue;let n=[],r=e;for(;r instanceof HTMLParagraphElement&&vy(r);)n.push(r),r=r.nextElementSibling;let i=n.map(yy).filter(e=>e!==null);if(!i.length)continue;let a=n.at(-1)?.nextSibling??null;e.before(xy(i));let o=e;for(;o&&o!==a;){let e=o.nextSibling;o.remove(),o=e}}}function Cy(e){return(e.textContent??``).replace(/\u00a0/g,` `).replace(/\s+/g,` `).trim()}function wy(e){let t=[...e.querySelectorAll(`table`)].reverse();for(let e of t){let t=document.createDocumentFragment(),n=[...e.querySelectorAll(`tr`)].filter(t=>t.closest(`table`)===e);for(let e of n){let n=[...e.children].filter(e=>[`TD`,`TH`].includes(e.tagName)).map(Cy).filter(Boolean);if(!n.length)continue;let r=document.createElement(`p`);r.textContent=n.join(` — `),t.append(r)}e.replaceWith(t)}}function Ty(e,t){let n=document.createElement(`template`);return n.innerHTML=e,gy(n.content),_y(n.content),Sy(n.content),t.enabledNodes.includes(`table`)||wy(n.content),n.innerHTML}function Ey(e){let t=!1;return e.forEach(e=>{t||=e.isText?!!e.text?.trim():e.isLeaf?!0:Ey(e.content)}),t}function Dy(e){return w.create({name:`vizyPasteNormalizer`,priority:200,transformPastedHTML(t){try{return Ty(t,e)}catch{return t}},addProseMirrorPlugins(){return[new T({props:{handlePaste(e,t,n){if(Ey(n.content))return!1;let r=t.clipboardData?.getData(`text/plain`)??``;return r.trim()?(t.preventDefault(),e.pasteText(r,t),!0):!1}}})]}})}var Oy=new Set([`doc`,`column`]);function ky(e){for(let t=e.depth;t>=0;--t)if(Oy.has(e.node(t).type.name))return t;return 0}function Ay(e){let{doc:t,selection:n}=e.state;if(n instanceof O&&n.node.type.name===`vizyBlock`)return!0;let r=ky(n.$from),i=n.$from.node(r);if(i.childCount===0)return!0;let a=Math.min(n.$from.index(r),i.childCount-1);if(i.child(a).type.name===`vizyBlock`)return!0;let o=a;for(;o>0&&i.child(o-1).type.name!==`vizyBlock`;)--o;let s=a;for(;s+1<i.childCount&&i.child(s+1).type.name!==`vizyBlock`;)s+=1;let c=n.$from.start(r);for(let e=0;e<o;e+=1)c+=i.child(e).nodeSize;let l=c;for(let e=o;e<=s;e+=1)l+=i.child(e).nodeSize;let u=Math.min(c+1,l),d=Math.max(u,l-1),f=N.between(t.resolve(u),t.resolve(d));return e.view.dispatch(e.state.tr.setSelection(f).scrollIntoView()),!0}function jy(e){let{doc:t,selection:n}=e.state;if(n instanceof O)return n.node.type.name===`vizyBlock`;if(n.empty)return!1;let r=!1;return t.descendants((e,t)=>{if(r)return!1;if(e.type.name===`vizyBlock`&&n.from<=t&&n.to>=t+e.nodeSize)return r=!0,!1}),r}var My=w.create({name:`vizySelectionBoundaries`,priority:1100,addKeyboardShortcuts(){let e=()=>jy(this.editor);return{"Mod-a":()=>Ay(this.editor),Backspace:e,Delete:e,"Mod-Backspace":e,"Mod-Delete":e}}}),Ny=200,Z=function(){};Z.prototype.append=function(e){return e.length?(e=Z.from(e),!this.length&&e||e.length<Ny&&this.leafAppend(e)||this.length<Ny&&e.leafPrepend(this)||this.appendInner(e)):this},Z.prototype.prepend=function(e){return e.length?Z.from(e).append(this):this},Z.prototype.appendInner=function(e){return new Fy(this,e)},Z.prototype.slice=function(e,t){return e===void 0&&(e=0),t===void 0&&(t=this.length),e>=t?Z.empty:this.sliceInner(Math.max(0,e),Math.min(this.length,t))},Z.prototype.get=function(e){if(!(e<0||e>=this.length))return this.getInner(e)},Z.prototype.forEach=function(e,t,n){t===void 0&&(t=0),n===void 0&&(n=this.length),t<=n?this.forEachInner(e,t,n,0):this.forEachInvertedInner(e,t,n,0)},Z.prototype.map=function(e,t,n){t===void 0&&(t=0),n===void 0&&(n=this.length);var r=[];return this.forEach(function(t,n){return r.push(e(t,n))},t,n),r},Z.from=function(e){return e instanceof Z?e:e&&e.length?new Py(e):Z.empty};var Py=function(e){function t(t){e.call(this),this.values=t}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={length:{configurable:!0},depth:{configurable:!0}};return t.prototype.flatten=function(){return this.values},t.prototype.sliceInner=function(e,n){return e==0&&n==this.length?this:new t(this.values.slice(e,n))},t.prototype.getInner=function(e){return this.values[e]},t.prototype.forEachInner=function(e,t,n,r){for(var i=t;i<n;i++)if(e(this.values[i],r+i)===!1)return!1},t.prototype.forEachInvertedInner=function(e,t,n,r){for(var i=t-1;i>=n;i--)if(e(this.values[i],r+i)===!1)return!1},t.prototype.leafAppend=function(e){if(this.length+e.length<=Ny)return new t(this.values.concat(e.flatten()))},t.prototype.leafPrepend=function(e){if(this.length+e.length<=Ny)return new t(e.flatten().concat(this.values))},n.length.get=function(){return this.values.length},n.depth.get=function(){return 0},Object.defineProperties(t.prototype,n),t}(Z);Z.empty=new Py([]);var Fy=function(e){function t(t,n){e.call(this),this.left=t,this.right=n,this.length=t.length+n.length,this.depth=Math.max(t.depth,n.depth)+1}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype.flatten=function(){return this.left.flatten().concat(this.right.flatten())},t.prototype.getInner=function(e){return e<this.left.length?this.left.get(e):this.right.get(e-this.left.length)},t.prototype.forEachInner=function(e,t,n,r){var i=this.left.length;if(t<i&&this.left.forEachInner(e,t,Math.min(n,i),r)===!1||n>i&&this.right.forEachInner(e,Math.max(t-i,0),Math.min(this.length,n)-i,r+i)===!1)return!1},t.prototype.forEachInvertedInner=function(e,t,n,r){var i=this.left.length;if(t>i&&this.right.forEachInvertedInner(e,t-i,Math.max(n,i)-i,r+i)===!1||n<i&&this.left.forEachInvertedInner(e,Math.min(t,i),n,r)===!1)return!1},t.prototype.sliceInner=function(e,t){if(e==0&&t==this.length)return this;var n=this.left.length;return t<=n?this.left.slice(e,t):e>=n?this.right.slice(e-n,t-n):this.left.slice(e,n).append(this.right.slice(0,t-n))},t.prototype.leafAppend=function(e){var n=this.right.leafAppend(e);if(n)return new t(this.left,n)},t.prototype.leafPrepend=function(e){var n=this.left.leafPrepend(e);if(n)return new t(n,this.right)},t.prototype.appendInner=function(e){return this.left.depth>=Math.max(this.right.depth,e.depth)+1?new t(this.left,new t(this.right,e)):new t(this,e)},t}(Z),Iy=500,Ly=class e{constructor(e,t){this.items=e,this.eventCount=t}popEvent(t,n){if(this.eventCount==0)return null;let r=this.items.length;for(;;r--)if(this.items.get(r-1).selection){--r;break}let i,a;n&&(i=this.remapping(r,this.items.length),a=i.maps.length);let o=t.tr,s,c,l=[],u=[];return this.items.forEach((t,n)=>{if(!t.step){i||(i=this.remapping(r,n+1),a=i.maps.length),a--,u.push(t);return}if(i){u.push(new zy(t.map));let e=t.step.map(i.slice(a)),n;e&&o.maybeStep(e).doc&&(n=o.mapping.maps[o.mapping.maps.length-1],l.push(new zy(n,void 0,void 0,l.length+u.length))),a--,n&&i.appendMap(n,a)}else o.maybeStep(t.step);if(t.selection)return s=i?t.selection.map(i.slice(a)):t.selection,c=new e(this.items.slice(0,r).append(u.reverse().concat(l)),this.eventCount-1),!1},this.items.length,0),{remaining:c,transform:o,selection:s}}addTransform(t,n,r,i){let a=[],o=this.eventCount,s=this.items,c=!i&&s.length?s.get(s.length-1):null;for(let e=0;e<t.steps.length;e++){let r=t.steps[e].invert(t.docs[e]),l=new zy(t.mapping.maps[e],r,n),u;(u=c&&c.merge(l))&&(l=u,e?a.pop():s=s.slice(0,s.length-1)),a.push(l),n&&=(o++,void 0),i||(c=l)}let l=o-r.depth;return l>Vy&&(s=Ry(s,l),o-=l),new e(s.append(a),o)}remapping(e,t){let n=new he;return this.items.forEach((t,r)=>{let i=t.mirrorOffset!=null&&r-t.mirrorOffset>=e?n.maps.length-t.mirrorOffset:void 0;n.appendMap(t.map,i)},e,t),n}addMaps(t){return this.eventCount==0?this:new e(this.items.append(t.map(e=>new zy(e))),this.eventCount)}rebased(t,n){if(!this.eventCount)return this;let r=[],i=Math.max(0,this.items.length-n),a=t.mapping,o=t.steps.length,s=this.eventCount;this.items.forEach(e=>{e.selection&&s--},i);let c=n;this.items.forEach(e=>{let n=a.getMirror(--c);if(n==null)return;o=Math.min(o,n);let i=a.maps[n];if(e.step){let o=t.steps[n].invert(t.docs[n]),l=e.selection&&e.selection.map(a.slice(c+1,n));l&&s++,r.push(new zy(i,o,l))}else r.push(new zy(i))},i);let l=[];for(let e=n;e<o;e++)l.push(new zy(a.maps[e]));let u=this.items.slice(0,i).append(l).append(r),d=new e(u,s);return d.emptyItemCount()>Iy&&(d=d.compress(this.items.length-r.length)),d}emptyItemCount(){let e=0;return this.items.forEach(t=>{t.step||e++}),e}compress(t=this.items.length){let n=this.remapping(0,t),r=n.maps.length,i=[],a=0;return this.items.forEach((e,o)=>{if(o>=t)i.push(e),e.selection&&a++;else if(e.step){let t=e.step.map(n.slice(r)),o=t&&t.getMap();if(r--,o&&n.appendMap(o,r),t){let s=e.selection&&e.selection.map(n.slice(r));s&&a++;let c=new zy(o.invert(),t,s),l,u=i.length-1;(l=i.length&&i[u].merge(c))?i[u]=l:i.push(c)}}else e.map&&r--},this.items.length,0),new e(Z.from(i.reverse()),a)}};Ly.empty=new Ly(Z.empty,0);function Ry(e,t){let n;return e.forEach((e,r)=>{if(e.selection&&t--==0)return n=r,!1}),e.slice(n)}var zy=class e{constructor(e,t,n,r){this.map=e,this.step=t,this.selection=n,this.mirrorOffset=r}merge(t){if(this.step&&t.step&&!t.selection){let n=t.step.merge(this.step);if(n)return new e(n.getMap().invert(),n,this.selection)}}},By=class{constructor(e,t,n,r,i){this.done=e,this.undone=t,this.prevRanges=n,this.prevTime=r,this.prevComposition=i}},Vy=20;function Hy(e,t,n,r){let i=n.getMeta(Xy),a;if(i)return i.historyState;n.getMeta(Zy)&&(e=new By(e.done,e.undone,null,0,-1));let o=n.getMeta(`appendedTransaction`);if(n.steps.length==0)return e;if(o&&o.getMeta(Xy))return o.getMeta(Xy).redo?new By(e.done.addTransform(n,void 0,r,Yy(t)),e.undone,Wy(n.mapping.maps),e.prevTime,e.prevComposition):new By(e.done,e.undone.addTransform(n,void 0,r,Yy(t)),null,e.prevTime,e.prevComposition);if(n.getMeta(`addToHistory`)!==!1&&!(o&&o.getMeta(`addToHistory`)===!1)){let i=n.getMeta(`composition`),a=e.prevTime==0||!o&&e.prevComposition!=i&&(e.prevTime<(n.time||0)-r.newGroupDelay||!Uy(n,e.prevRanges)),s=o?Gy(e.prevRanges,n.mapping):Wy(n.mapping.maps);return new By(e.done.addTransform(n,a?t.selection.getBookmark():void 0,r,Yy(t)),Ly.empty,s,n.time,i??e.prevComposition)}return(a=n.getMeta(`rebased`))?new By(e.done.rebased(n,a),e.undone.rebased(n,a),Gy(e.prevRanges,n.mapping),e.prevTime,e.prevComposition):new By(e.done.addMaps(n.mapping.maps),e.undone.addMaps(n.mapping.maps),Gy(e.prevRanges,n.mapping),e.prevTime,e.prevComposition)}function Uy(e,t){if(!t)return!1;if(!e.docChanged)return!0;let n=!1;return e.mapping.maps[0].forEach((e,r)=>{for(let i=0;i<t.length;i+=2)e<=t[i+1]&&r>=t[i]&&(n=!0)}),n}function Wy(e){let t=[];for(let n=e.length-1;n>=0&&t.length==0;n--)e[n].forEach((e,n,r,i)=>t.push(r,i));return t}function Gy(e,t){if(!e)return null;let n=[];for(let r=0;r<e.length;r+=2){let i=t.map(e[r],1),a=t.map(e[r+1],-1);i<=a&&n.push(i,a)}return n}function Ky(e,t,n){let r=Yy(t),i=Xy.get(t).spec.config,a=(n?e.undone:e.done).popEvent(t,r);if(!a)return null;let o=a.selection.resolve(a.transform.doc),s=(n?e.done:e.undone).addTransform(a.transform,t.selection.getBookmark(),i,r),c=new By(n?s:a.remaining,n?a.remaining:s,null,0,-1);return a.transform.setSelection(o).setMeta(Xy,{redo:n,historyState:c})}var qy=!1,Jy=null;function Yy(e){let t=e.plugins;if(Jy!=t){qy=!1,Jy=t;for(let e=0;e<t.length;e++)if(t[e].spec.historyPreserveItems){qy=!0;break}}return qy}var Xy=new E(`history`),Zy=new E(`closeHistory`);function Qy(e={}){return e={depth:e.depth||100,newGroupDelay:e.newGroupDelay||500},new T({key:Xy,state:{init(){return new By(Ly.empty,Ly.empty,null,0,-1)},apply(t,n,r){return Hy(n,r,t,e)}},config:e,props:{handleDOMEvents:{beforeinput(e,t){let n=t.inputType,r=n==`historyUndo`?eb:n==`historyRedo`?tb:null;return!r||!e.editable?!1:(t.preventDefault(),r(e.state,e.dispatch))}}}})}function $y(e,t){return(n,r)=>{let i=Xy.getState(n);if(!i||(e?i.undone:i.done).eventCount==0)return!1;if(r){let a=Ky(i,n,e);a&&r(t?a.scrollIntoView():a)}return!0}}var eb=$y(!1,!0),tb=$y(!0,!0);function nb(e){return e.getMeta(Xy)!=null}function rb(){return new T({appendTransaction(e,t,n){if(!e.some(nb))return null;let r=new Map;t.doc.descendants(e=>{e.type.name===`vizyBlock`&&r.set(String(e.attrs.blockUid),e)});let i=n.tr.setMeta(`addToHistory`,!1);return n.doc.descendants((e,t)=>{if(e.type.name!==`vizyBlock`)return;let n=r.get(String(e.attrs.blockUid));if(!(!n||n.attrs.blockTypeUid!==e.attrs.blockTypeUid))for(let r of[`fieldSlots`,`matrixAnchorUid`])JSON.stringify(e.attrs[r])!==JSON.stringify(n.attrs[r])&&i.setNodeAttribute(t,r,n.attrs[r])}),i.docChanged?i:null}})}function ib(e,t){let n=(t,r,i)=>{if(t.eq(r))return;if(t.type!==r.type){e.replaceWith(i,i+t.nodeSize,r);return}if(t.isText){let n=t.text,a=r.text,o=0,s=n.length,c=a.length;for(;o<s&&o<c&&n[o]===a[o];)o++;for(;s>o&&c>o&&n[s-1]===a[c-1];)s--,c--;if(o<s||o<c){let t=a.slice(o,c);e.replaceWith(i+o,i+s,t?r.type.schema.text(t,r.marks):[])}if(!de.sameSet(t.marks,r.marks)){e.removeMark(i,i+a.length);for(let t of r.marks)e.addMark(i,i+a.length,t)}return}for(let n of Object.keys(r.attrs))JSON.stringify(t.attrs[n])!==JSON.stringify(r.attrs[n])&&(i<0?e.setDocAttribute(n,r.attrs[n]):e.setNodeAttribute(i,n,r.attrs[n]));i>=0&&!de.sameSet(t.marks,r.marks)&&e.setNodeMarkup(i,void 0,r.attrs,r.marks);let a=i+1,o=[];if(t.childCount===r.childCount&&t.forEach((e,t,n)=>{o.push({before:e,after:r.child(n),pos:a+t})}),t.childCount===r.childCount&&o.every(e=>e.before.type===e.after.type)){for(let e of o.reverse())n(e.before,e.after,e.pos);return}let s=t.content.findDiffStart(r.content),c=t.content.findDiffEnd(r.content);if(s===null||c===null)return;let l=Math.max(0,s-Math.min(c.a,c.b));e.replace(a+s,a+c.a+l,r.slice(s,c.b+l))};return n(e.doc,t,-1),e}function ab(e={}){return new T({view(t){return new ob(t,e)}})}var ob=class{constructor(e,t){this.editorView=e,this.cursorPos=null,this.element=null,this.timeout=-1,this.lastDragEvent=null,this.width=t.width??1,this.color=t.color===!1?void 0:t.color||`black`,this.class=t.class,this.handlers=[`dragover`,`dragend`,`drop`,`dragleave`].map(t=>{let n=e=>{this[t](e)};return e.dom.addEventListener(t,n),{name:t,handler:n}})}destroy(){this.handlers.forEach(({name:e,handler:t})=>this.editorView.dom.removeEventListener(e,t))}update(e,t){if(this.cursorPos!=null&&t.doc!=e.state.doc){if(this.lastDragEvent){let e=this.computeTarget(this.lastDragEvent);e==this.cursorPos?this.updateOverlay():this.setCursor(e)}else this.updateOverlay()}}setCursor(e){e!=this.cursorPos&&(this.cursorPos=e,e==null?(this.element.parentNode.removeChild(this.element),this.element=null):this.updateOverlay())}updateOverlay(){let e=this.editorView.state.doc.resolve(this.cursorPos),t=!e.parent.inlineContent,n,r=this.editorView.dom,i=r.getBoundingClientRect(),a=i.width/r.offsetWidth,o=i.height/r.offsetHeight;if(t){let t=e.nodeBefore,r=e.nodeAfter;if(t||r){let e=this.editorView.nodeDOM(this.cursorPos-(t?t.nodeSize:0));if(e){let i=e.getBoundingClientRect(),a=t?i.bottom:i.top;t&&r&&(a=(a+this.editorView.nodeDOM(this.cursorPos).getBoundingClientRect().top)/2);let s=this.width/2*o;n={left:i.left,right:i.right,top:a-s,bottom:a+s}}}}if(!n){let e=this.editorView.coordsAtPos(this.cursorPos),t=this.width/2*a;n={left:e.left-t,right:e.left+t,top:e.top,bottom:e.bottom}}let s=this.editorView.dom.offsetParent;this.element||(this.element=s.appendChild(document.createElement(`div`)),this.class&&(this.element.className=this.class),this.element.style.cssText=`position: absolute; z-index: 50; pointer-events: none;`,this.color&&(this.element.style.backgroundColor=this.color)),this.element.classList.toggle(`prosemirror-dropcursor-block`,t),this.element.classList.toggle(`prosemirror-dropcursor-inline`,!t);let c,l;if(!s||s==document.body&&getComputedStyle(s).position==`static`)c=-pageXOffset,l=-pageYOffset;else{let e=s.getBoundingClientRect(),t=e.width/s.offsetWidth,n=e.height/s.offsetHeight;c=e.left-s.scrollLeft*t,l=e.top-s.scrollTop*n}this.element.style.left=(n.left-c)/a+`px`,this.element.style.top=(n.top-l)/o+`px`,this.element.style.width=(n.right-n.left)/a+`px`,this.element.style.height=(n.bottom-n.top)/o+`px`}scheduleRemoval(e){clearTimeout(this.timeout),this.timeout=setTimeout(()=>this.setCursor(null),e)}computeTarget(e){let t=this.editorView.posAtCoords({left:e.clientX,top:e.clientY}),n=t&&t.inside>=0&&this.editorView.state.doc.nodeAt(t.inside),r=n&&n.type.spec.disableDropCursor,i=typeof r==`function`?r(this.editorView,t,e):r;if(!t||i)return null;let a=t.pos;if(this.editorView.dragging&&this.editorView.dragging.slice){let e=It(this.editorView.state.doc,a,this.editorView.dragging.slice);e!=null&&(a=e)}return a}dragover(e){if(!this.editorView.editable)return;this.lastDragEvent=e;let t=this.computeTarget(e);t!=null&&(this.setCursor(t),this.scheduleRemoval(5e3))}dragend(){this.scheduleRemoval(20)}drop(){this.scheduleRemoval(20)}dragleave(e){this.editorView.dom.contains(e.relatedTarget)||this.setCursor(null)}},Q=class e extends D{constructor(e){super(e,e)}map(t,n){let r=t.resolve(n.map(this.head));return e.valid(r)?new e(r):D.near(r)}content(){return M.empty}eq(t){return t instanceof e&&t.head==this.head}toJSON(){return{type:`gapcursor`,pos:this.head}}static fromJSON(t,n){if(typeof n.pos!=`number`)throw RangeError(`Invalid input for GapCursor.fromJSON`);return new e(t.resolve(n.pos))}getBookmark(){return new sb(this.anchor)}static valid(e){let t=e.parent;if(t.inlineContent||!lb(e)||!ub(e))return!1;let n=t.type.spec.allowGapCursor;if(n!=null)return n;let r=t.contentMatchAt(e.index()).defaultType;return r&&r.isTextblock}static findGapCursorFrom(t,n,r=!1){search:for(;;){if(!r&&e.valid(t))return t;let i=t.pos,a=null;for(let r=t.depth;;r--){let o=t.node(r);if(n>0?t.indexAfter(r)<o.childCount:t.index(r)>0){a=o.child(n>0?t.indexAfter(r):t.index(r)-1);break}if(r==0)return null;i+=n;let s=t.doc.resolve(i);if(e.valid(s))return s}for(;;){let o=n>0?a.firstChild:a.lastChild;if(!o){if(a.isAtom&&!a.isText&&!O.isSelectable(a)){t=t.doc.resolve(i+a.nodeSize*n),r=!1;continue search}break}a=o,i+=n;let s=t.doc.resolve(i);if(e.valid(s))return s}return null}}};Q.prototype.visible=!1,Q.findFrom=Q.findGapCursorFrom,D.jsonID(`gapcursor`,Q);var sb=class e{constructor(e){this.pos=e}map(t){return new e(t.map(this.pos))}resolve(e){let t=e.resolve(this.pos);return Q.valid(t)?new Q(t):D.near(t)}};function cb(e){return e.isAtom||e.spec.isolating||e.spec.createGapCursor}function lb(e){for(let t=e.depth;t>=0;t--){let n=e.index(t),r=e.node(t);if(n==0){if(r.type.spec.isolating)return!0;continue}for(let e=r.child(n-1);;e=e.lastChild){if(e.childCount==0&&!e.inlineContent||cb(e.type))return!0;if(e.inlineContent)return!1}}return!0}function ub(e){for(let t=e.depth;t>=0;t--){let n=e.indexAfter(t),r=e.node(t);if(n==r.childCount){if(r.type.spec.isolating)return!0;continue}for(let e=r.child(n);;e=e.firstChild){if(e.childCount==0&&!e.inlineContent||cb(e.type))return!0;if(e.inlineContent)return!1}}return!0}function db(){return new T({props:{decorations:gb,createSelectionBetween(e,t,n){return t.pos==n.pos&&Q.valid(n)?new Q(n):null},handleClick:mb,handleKeyDown:fb,handleDOMEvents:{beforeinput:hb}}})}var fb=Vt({ArrowLeft:pb(`horiz`,-1),ArrowRight:pb(`horiz`,1),ArrowUp:pb(`vert`,-1),ArrowDown:pb(`vert`,1)});function pb(e,t){let n=e==`vert`?t>0?`down`:`up`:t>0?`right`:`left`;return function(e,r,i){let a=e.selection,o=t>0?a.$to:a.$from,s=a.empty;if(a instanceof N){if(!i.endOfTextblock(n)||o.depth==0)return!1;s=!1,o=e.doc.resolve(t>0?o.after():o.before())}let c=Q.findGapCursorFrom(o,t,s);return c?(r&&r(e.tr.setSelection(new Q(c))),!0):!1}}function mb(e,t,n){if(!e||!e.editable)return!1;let r=e.state.doc.resolve(t);if(!Q.valid(r))return!1;let i=e.posAtCoords({left:n.clientX,top:n.clientY});return i&&i.inside>-1&&O.isSelectable(e.state.doc.nodeAt(i.inside))?!1:(e.dispatch(e.state.tr.setSelection(new Q(r))),!0)}function hb(e,t){if(t.inputType!=`insertCompositionText`||!(e.state.selection instanceof Q))return!1;let{$from:n}=e.state.selection,r=n.parent.contentMatchAt(n.index()).findWrapping(e.state.schema.nodes.text);if(!r)return!1;let i=k.empty;for(let e=r.length-1;e>=0;e--)i=k.from(r[e].createAndFill(null,i));let a=e.state.tr.replace(n.pos,n.pos,new M(i,0,0));return a.setSelection(N.near(a.doc.resolve(n.pos+1))),e.dispatch(a),!1}function gb(e){if(!(e.selection instanceof Q))return null;let t=document.createElement(`div`);return t.className=`ProseMirror-gapcursor`,Kt.create(e.doc,[Et.widget(e.selection.head,t,{key:`gapcursor`})])}w.create({name:`characterCount`,addOptions(){return{limit:null,autoTrim:!0,mode:`textSize`,textCounter:e=>e.length,wordCounter:e=>e.split(` `).filter(e=>e!==``).length}},addStorage(){return{characters:()=>0,words:()=>0}},onBeforeCreate(){this.storage.characters=e=>{let t=e?.node||this.editor.state.doc;if((e?.mode||this.options.mode)===`textSize`){let e=t.textBetween(0,t.content.size,void 0,` `);return this.options.textCounter(e)}return t.nodeSize},this.storage.words=e=>{let t=e?.node||this.editor.state.doc,n=t.textBetween(0,t.content.size,` `,` `);return this.options.wordCounter(n)}},addProseMirrorPlugins(){let e=!1;return[new T({key:new E(`characterCount`),appendTransaction:(t,n,r)=>{if(e)return;let i=this.options.limit,a=this.options.autoTrim;if(i==null||i===0||a===!1){e=!0;return}let o=this.storage.characters({node:r.doc});if(o>i){let t=o-i;console.warn(`[CharacterCount] Initial content exceeded limit of ${i} characters. Content was automatically trimmed.`);let n=r.tr.deleteRange(0,t);return e=!0,n}e=!0},filterTransaction:(e,t)=>{let n=this.options.limit;if(!e.docChanged||n===0||n==null)return!0;let r=this.storage.characters({node:t.doc}),i=this.storage.characters({node:e.doc});if(i<=n||r>n&&i>n&&i<=r)return!0;if(r>n&&i>n&&i>r||!e.getMeta(`paste`))return!1;let a=e.selection.$head.pos,o=a-(i-n),s=a;return e.deleteRange(o,s),!(this.storage.characters({node:e.doc})>n)}})]}}),w.create({name:`dropCursor`,addOptions(){return{color:`currentColor`,width:1,class:void 0}},addProseMirrorPlugins(){return[ab(this.options)]}}),w.create({name:`focus`,addOptions(){return{className:`has-focus`,mode:`all`}},addProseMirrorPlugins(){return[new T({key:new E(`focus`),props:{decorations:({doc:e,selection:t})=>{let{isEditable:n,isFocused:r}=this.editor,{anchor:i}=t,a=[];if(!n||!r)return Kt.create(e,[]);let o=0;this.options.mode===`deepest`&&e.descendants((e,t)=>{if(!e.isText){if(!(i>=t&&i<=t+e.nodeSize-1))return!1;o+=1}});let s=0;return e.descendants((e,t)=>{if(e.isText||!(i>=t&&i<=t+e.nodeSize-1))return!1;if(s+=1,this.options.mode===`deepest`&&o-s>0||this.options.mode===`shallowest`&&s>1)return this.options.mode===`deepest`;a.push(Et.node(t,t+e.nodeSize,{class:this.options.className}))}),Kt.create(e,a)}}})]}});var _b=w.create({name:`gapCursor`,addProseMirrorPlugins(){return[db()]},extendNodeSchema(e){let t={name:e.name,options:e.options,storage:e.storage};return{allowGapCursor:St(tn(e,`allowGapCursor`,t))??null}}}),vb=`placeholder`,yb=new E(`tiptap__placeholder`);function bb(e){let{editor:t,placeholder:n,dataAttribute:r,pos:i,node:a,isEmptyDoc:o,hasAnchor:s,classes:{emptyNode:c,emptyEditor:l}}=e,u=[c];return o&&u.push(l),Et.node(i,i+a.nodeSize,{class:u.join(` `),[r]:typeof n==`function`?n({editor:t,node:a,pos:i,hasAnchor:s}):n})}function xb(e,t){return typeof e==`function`?e(t):e}function Sb({editor:e,options:t,dataAttribute:n,doc:r,selection:i,from:a,to:o}){let{anchor:s}=i,c=[],l=e.isEmpty;return r.nodesBetween(a,o,(r,i)=>{let a=s>=i&&s<=i+r.nodeSize,o=!r.isLeaf&&Qe(r);return r.type.isTextblock&&(a||!t.showOnlyCurrent)&&o&&c.push(bb({editor:e,isEmptyDoc:l,dataAttribute:n,hasAnchor:a,placeholder:t.placeholder,classes:{emptyEditor:t.emptyEditorClass,emptyNode:xb(t.emptyNodeClass,{editor:e,node:r,pos:i,hasAnchor:a})},node:r,pos:i})),t.includeChildren}),c}function Cb({editor:e,options:t,dataAttribute:n,doc:r,selection:i}){if(!(e.isEditable||!t.showOnlyWhenEditable))return null;let{anchor:a}=i,o=[],s=e.isEmpty;if(t.showOnlyCurrent&&!t.includeChildren){let i=r.resolve(a),c=i.depth>0?i.node(1):i.nodeAfter,l=i.depth>0?i.before(1):a;if(c&&c.type.isTextblock&&Qe(c)){let r=a>=l&&a<=l+c.nodeSize;o.push(bb({editor:e,isEmptyDoc:s,dataAttribute:n,hasAnchor:r,placeholder:t.placeholder,classes:{emptyEditor:t.emptyEditorClass,emptyNode:xb(t.emptyNodeClass,{editor:e,node:c,pos:l,hasAnchor:r})},node:c,pos:l}))}}else o.push(...Sb({editor:e,options:t,dataAttribute:n,doc:r,selection:i,from:0,to:r.content.size}));return Kt.create(r,o)}function wb(e,t){let n=e.resolve(t);if(n.depth===0){let e=n.nodeAfter??n.nodeBefore;if(!e)return{from:t,to:t};let r=n.nodeAfter?t:t-e.nodeSize;return{from:r,to:r+e.nodeSize}}let r=n.before(1);return{from:r,to:r+n.node(1).nodeSize}}function Tb(e,t){return{from:Math.max(0,t.from-1),to:Math.min(e.content.size,t.to-1)}}function Eb(e,t,n){let r=[];return e.forEach((e,i)=>{let a=i,o=a+e.nodeSize,s=a+1,c=o+1;s<n&&c>t&&r.push({from:a,to:o})}),r}function Db(e){if(e.length===0)return[];let t=[...e].sort((e,t)=>e.from-t.from),n=[{...t[0]}];for(let e=1;e<t.length;e+=1){let r=n[n.length-1],i=t[e];i.from<=r.to?r.to=Math.max(r.to,i.to):n.push({...i})}return n}function Ob(e,t){let n=Eb(e,t.from,t.to);return n.push(Tb(e,wb(e,t.from))),t.to>t.from?n.push(Tb(e,wb(e,Math.min(t.to,e.content.size+1)-1))):t.from<e.content.size+1&&n.push(Tb(e,wb(e,Math.min(t.from+1,e.content.size)))),n}function kb(e,t,n){let r=[];if(e.docChanged){let t=Be(e);for(let e of t)r.push(...Ob(n.doc,e.newRange))}return e.selectionSet&&(r.push(Tb(n.doc,wb(n.doc,e.mapping.map(t.selection.anchor)))),r.push(Tb(n.doc,wb(n.doc,n.selection.anchor)))),Db(r)}function Ab(e,t,n){let r=Math.max(0,Math.min(e,n.content.size));return{from:r,to:Math.max(r,Math.min(t,n.content.size))}}function jb({decorations:e,ranges:t,editor:n,options:r,dataAttribute:i,doc:a,selection:o}){let s=e;for(let e of t){let{from:t,to:c}=Ab(e.from,e.to,a),l=s.find(t,c).filter(e=>e.from>=t&&e.to<=c);l.length&&(s=s.remove(l));let u=Sb({editor:n,options:r,dataAttribute:i,doc:a,selection:o,from:t,to:c});u.length&&(s=s.add(a,u))}return s}function Mb({editor:e,options:t,dataAttribute:n}){return{init(r,i){return Cb({editor:e,options:t,dataAttribute:n,doc:i.doc,selection:i.selection})??Kt.empty},apply(r,i,a,o){return!r.docChanged&&!r.selectionSet?i:jb({decorations:i.map(r.mapping,r.doc),ranges:kb(r,a,o),editor:e,options:t,dataAttribute:n,doc:o.doc,selection:o.selection})}}}function Nb(e){return e.replace(/\s+/g,`-`).replace(/[^a-zA-Z0-9-]/g,``).replace(/^[0-9-]+/,``).replace(/^-+/,``).toLowerCase()}function Pb({editor:e,options:t}){let n=t.dataAttribute?`data-${Nb(t.dataAttribute)}`:`data-${vb}`,r=t.showOnlyCurrent&&!t.includeChildren;return new T({key:yb,...r?{}:{state:Mb({editor:e,options:t,dataAttribute:n})},props:{decorations:r?({doc:r,selection:i})=>Cb({editor:e,options:t,dataAttribute:n,doc:r,selection:i}):n=>t.showOnlyWhenEditable&&!e.isEditable?Kt.empty:yb.getState(n)??Kt.empty}})}w.create({name:`placeholder`,addOptions(){return{emptyEditorClass:`is-editor-empty`,emptyNodeClass:`is-empty`,dataAttribute:vb,placeholder:`Write something …`,showOnlyWhenEditable:!0,showOnlyCurrent:!0,includeChildren:!1}},addProseMirrorPlugins(){return[Pb({editor:this.editor,options:this.options})]}});function Fb(e,t){return!e.selection.empty&&!nt(e.selection)&&t.isEditable}function Ib(e,t){return Fb(e,t)&&!t.isFocused&&!t.view.dragging}function Lb(){var e;(e=window.getSelection())==null||e.removeAllRanges()}function Rb(e){e.focus()}w.create({name:`selection`,addOptions(){return{className:`selection`}},addProseMirrorPlugins(){let{editor:e,options:t}=this;return[new T({key:new E(`selection`),props:{decorations(n){return Ib(n,e)?Kt.create(n.doc,[Et.inline(n.selection.from,n.selection.to,{class:t.className})]):null},handleDOMEvents:{blur(t){return Fb(t.state,e)&&Lb(),!1},focus(t){return Fb(t.state,e)&&requestAnimationFrame(()=>{!e.isDestroyed&&t.hasFocus()&&Rb(t)}),!1}}}})]}});function zb({types:e,node:t}){return t&&Array.isArray(e)&&e.includes(t.type)||t?.type===e}w.create({name:`trailingNode`,addOptions(){return{node:void 0,notAfter:[]}},addProseMirrorPlugins(){let e=new E(this.name),t=this.options.node||this.editor.schema.topNodeType.contentMatch.defaultType?.name||`paragraph`,n=Object.entries(this.editor.schema.nodes).map(([,e])=>e).filter(e=>(this.options.notAfter||[]).concat(t).includes(e.name));return[new T({key:e,appendTransaction:(n,r,i)=>{let{doc:a,tr:o,schema:s}=i,c=e.getState(i),l=a.content.size,u=s.nodes[t];if(!n.some(e=>e.getMeta(`skipTrailingNode`))&&c)return o.insert(l,u.create())},state:{init:(e,t)=>{let r=t.tr.doc.lastChild;return!zb({node:r,types:n})},apply:(e,t)=>{if(!e.docChanged||e.getMeta(`__uniqueIDTransaction`))return t;let r=e.doc.lastChild;return!zb({node:r,types:n})}}})]}});var Bb=w.create({name:`undoRedo`,addOptions(){return{depth:100,newGroupDelay:500}},addCommands(){return{undo:()=>({state:e,dispatch:t})=>eb(e,t),redo:()=>({state:e,dispatch:t})=>tb(e,t)}},addProseMirrorPlugins(){return[Qy(this.options)]},addKeyboardShortcuts(){return{"Mod-z":()=>this.editor.commands.undo(),"Shift-Mod-z":()=>this.editor.commands.redo(),"Mod-y":()=>this.editor.commands.redo(),"Mod-я":()=>this.editor.commands.undo(),"Shift-Mod-я":()=>this.editor.commands.redo()}}}),Vb=w.create({name:`textAlign`,addOptions(){return{types:[],alignments:[`left`,`center`,`right`,`justify`],defaultAlignment:null}},addGlobalAttributes(){return[{types:this.options.types,attributes:{textAlign:{default:this.options.defaultAlignment,parseHTML:e=>{let t=e.style.textAlign;return this.options.alignments.includes(t)?t:this.options.defaultAlignment},renderHTML:e=>e.textAlign?{style:`text-align: ${e.textAlign}`}:{}}}}]},addCommands(){return{setTextAlign:e=>({commands:t})=>this.options.alignments.includes(e)?this.options.types.map(n=>t.updateAttributes(n,{textAlign:e})).some(e=>e):!1,unsetTextAlign:()=>({commands:e})=>this.options.types.map(t=>e.resetAttributes(t,`textAlign`)).some(e=>e),toggleTextAlign:e=>({editor:t,commands:n})=>this.options.alignments.includes(e)?t.isActive({textAlign:e})?n.unsetTextAlign():n.setTextAlign(e):!1}},addKeyboardShortcuts(){return{"Mod-Shift-l":()=>this.editor.commands.setTextAlign(`left`),"Mod-Shift-e":()=>this.editor.commands.setTextAlign(`center`),"Mod-Shift-r":()=>this.editor.commands.setTextAlign(`right`),"Mod-Shift-j":()=>this.editor.commands.setTextAlign(`justify`)}}});function Hb(e,t){let n=bd(e.toJSON(),void 0,t),r=e.content.firstChild?.type.schema;return r?M.fromJSON(r,n):e}var Ub=w.create({name:`vizyCopyIdentity`,addOptions:()=>({schemaIdentity:{}}),addProseMirrorPlugins(){let e=this.options.schemaIdentity;return[new T({props:{transformPasted(t,n){return n.dragging?.move?t:Hb(t,e)},handleDrop(t,n,r,i){if(i||!r)return!1;let a=t.posAtCoords({left:n.clientX,top:n.clientY});if(!a)return!0;let o=Hb(r,e);return t.dispatch(t.state.tr.replaceRange(a.pos,a.pos,o).scrollIntoView()),!0}}})]}});function Wb(e,t){let n=q_(e.modules,{manifest:e,services:t}),r=new Map;for(let e of n){if(r.has(e.name))throw Error(`duplicateEditorExtension:${e.name}`);r.set(e.name,e)}let i=new Set([...e.enabledNodes,...e.enabledMarks,...e.internalNodes]);for(let e of i)if(!r.has(e))throw Error(`missingProductionExtension:${e}`);let a=[`paragraph`,`heading`].filter(e=>r.has(e));return[...r.values(),Bb,w.create({name:`vizyFieldHistory`,addProseMirrorPlugins:()=>[rb()]}),_b,fy(e),Dy(e),My,Vb.configure({types:a}),Zd,Qd,tf.configure({schemaIdentity:e.blockTypes,insertableBlockTypeUids:e.field.insertableBlockTypeUids,beforeCopy:()=>t().flushMountedFields?.()}),Ub.configure({schemaIdentity:e.blockTypes}),nv(e),Q_.configure({manifest:e}),oy(e),sy(e),ry(t),...e.enabledNodes.includes(`layout`)?[cy(t)]:[]]}function Gb(e){let t=[];return e.forEach(e=>{e.type.name===`vizyBlock`&&t.push(e)}),t}function Kb(e,t,n){let r=e.resolve(Math.max(0,Math.min(t,e.content.size))),i=r.parent.isTextblock?Math.max(0,r.depth-1):r.depth,a=r.node(i),o=a===e;return{kind:o?`root`:`nested`,node:a,contentType:o?n.field.rootContentType:`rich`,allowedBlockTypeUids:n.field.allowedBlockTypeUids,minBlocks:o?n.field.minBlocks:null,maxBlocks:o?n.field.maxBlocks:null}}function qb(e,t){let n=e.resolve(Math.max(0,Math.min(t,e.content.size))),r=0;for(let e=n.depth;e>=0;--e)n.node(e).type.name===`vizyBlock`&&(r+=1);return r}function Jb(e,t,n,r){let{editor:i,manifest:a,documentRevision:o}=e,{state:s}=i,c=r??s.selection.from,l=r??s.selection.to,u=Kb(s.doc,c,a),d=`text`;s.selection instanceof O?d=`node`:s.selection.empty&&(d=`gap`);let f=Gb(u.node).length;return{editorId:n,surface:t,from:c,to:l,selectionKind:d,container:{kind:u.kind},contentType:u.contentType,directBlockCount:f,minBlocks:u.minBlocks,maxBlocks:u.maxBlocks,depth:qb(s.doc,c),schemaRevision:a.schemaRevision,documentRevision:String(o())}}function Yb(e,t){return e.schemaRevision===t.schemaRevision&&e.documentRevision===t.documentRevision&&e.from===t.from&&e.to===t.to&&e.surface===t.surface&&JSON.stringify(e.container)===JSON.stringify(t.container)}function Xb(e){return e.normalize(`NFD`).replace(/\p{M}/gu,``).toLowerCase().trim()}function Zb(e){return Xb(e).split(/[\s/_-]+/).filter(Boolean)}function Qb(e,t){let n=Xb(t);if(n===``)return 1;let r=[e.label,...e.keywords??[],...e.aliases??[],e.group,e.description??``,e.kind===`node`?e.nodeName??``:``,e.kind===`block`?e.blockTypeUid??``:``].map(Xb);for(let e of r)if(e.startsWith(n))return 100;let i=Zb(n),a=0;for(let e of i)r.some(t=>t.includes(e))&&(a+=1);return a===0?0:10+a}function $b(e,t){if(t.score!==e.score)return t.score-e.score;let n=e.item.group.localeCompare(t.item.group);return n===0?e.item.order===t.item.order?e.item.id.localeCompare(t.item.id):e.item.order-t.item.order:n}function ex(e){return{item:e,isAvailable:(t,n)=>e.kind===`transform`&&e.id===`transform:vizy:layout`?at(t,n):kt(e,t,n),execute(t,n,r){if(e.kind===`block`){let r=e.blockTypeUid??e.id.replace(/^block:/,``);return rt(r,t,n)}if(e.kind===`node`){let r=e.nodeName??e.id.replace(/^node:vizy:/,``);return qt(r,t,n)}return e.kind===`transform`&&e.id===`transform:vizy:layout`?yt(t,n,r):{status:`cancelled`}}}}function tx(e,t,n){let r=new Map;for(let e of n){if(r.has(e.id))throw Error(`duplicateInsertionItem:${e.id}`);r.set(e.id,ex(e))}for(let e of Ht())r.set(e.item.id,e);return{register:e=>{if(r.has(e.item.id))throw Error(`duplicateInsertionItem:${e.item.id}`);return r.set(e.item.id,e),()=>{r.delete(e.item.id)}},query:t=>{let n=[];for(let i of r.values()){if(t.kinds&&!t.kinds.includes(i.item.kind)||!i.isAvailable(t.context,e))continue;let r=t.search?Qb(i.item,t.search):1;t.search&&r<=0||n.push({item:i.item,context:t.context,score:r})}return n.sort($b),t.limit===void 0?n:n.slice(0,t.limit)},execute:async t=>{let n=r.get(t.id);if(!n)return{status:`cancelled`};if(n.item.requiresInput&&t.input===void 0)return{status:`opened`};let i=Jb(e,t.context.surface,t.context.editorId,t.context.from);return!i||!Yb(t.context,i)||!n.isAvailable(i,e)?{status:`cancelled`}:n.execute(i,e,t.input)},buildContext:(n,r)=>Jb(e,n,t,r)}}var nx=class{#e;#t;#n;#r=new Uv;#i;#a;#o=new Map;#s=0;#c=0;#l=null;#u=!1;#d=!1;#f=null;#p=null;constructor(e,t,n={}){this.#e=e,this.#i=t,this.#a=n.onToolbarAddBlockOpenChange,this.#t=document.createElement(`div`),this.#t.className=`vizy-insertion-overlay`,this.#t.dataset.vizyInsertionOverlay=``,e.append(this.#t),this.#n=new Nv,e.addEventListener(`pointermove`,this.#m),e.addEventListener(`pointerleave`,this.#h),e.addEventListener(`keydown`,this.#g,!0)}sync(){this.#i().insertionSideEffectsSuspended?.()||(Av(this.#i().editor),this.#n.isOpen&&this.#n.refresh(this.#i()),this.#_())}destroy(){this.#e.removeEventListener(`pointermove`,this.#m),this.#e.removeEventListener(`pointerleave`,this.#h),this.#e.removeEventListener(`keydown`,this.#g,!0),this.#te(),this.#n.close({animate:!1,restoreFocus:!1}),this.#r.close(),this.#p=null,this.#t.remove();for(let e of this.#o.values())e.remove();this.#o.clear()}#m=e=>{this.#s=e.clientX,this.#c=e.clientY,this.#u=!0,this.#d=!1,this.#_()};#h=()=>{this.#u=!1,this.#l=null,this.#F()};#g=()=>{try{if(!this.#i().editor.view.hasFocus())return}catch{return}this.#d||(this.#d=!0,this.#l=null,this.#F())};#_(){if(this.#d||this.#v()||!this.#u){this.#F();return}if(Tv(this.#i().manifest)||this.#i().manifest.gutterInsert===!1){this.#F();return}this.#x()}openToolbarInsert(e,t={}){let n=this.#i(),{editor:r}=n,i;i=r.view.hasFocus()||t.useCurrentSelection?r.state.selection.from:0;let a=n.insertion.buildContext(`inline`,i);if(!a)return;let o=t.hadEditorFocus??r.view.hasFocus();this.#U(a,e,`inline`,bv,`toolbar-plus`,{autofocusFilter:!0,claimEditorFocus:o})}#v(){if(this.#e.querySelector(`vizy-block[menu-open]`))return!0;let e=this.#B();return e?this.#y(e)?!0:this.#b(e):!1}#y(e){let t=this.#e.closest(`vizy-editor`),n=e;for(;n;){if(n===this.#e)return!1;if(n instanceof HTMLElement&&n.matches(`vizy-editor`))return n!==t;if(n instanceof ShadowRoot){n=n.host;continue}n=n.parentNode}return!1}#b(e){let t=e;for(;t;){if(t instanceof HTMLElement){if(t.classList.contains(`vizy-insertion-overlay`)||t.classList.contains(`vizy-inline-add`))return!1;if(t.matches(`vizy-toolbar, vizy-bubble`)||t.matches(`header[part="header"], header[role="group"], .menu[role="menu"], .actions, .header-end`))return!0;if(t.matches(`section[part="body"], [part="preview"]`))return!1}if(t instanceof ShadowRoot){t=t.host;continue}t=t.parentNode}return!1}#x(){let e=this.#i(),t=jv(e);if(!t.length){this.#l=null,this.#F();return}let n=this.#e.getBoundingClientRect(),r=this.#z(),i=this.#C(e,r,n,t);if(!i){this.#l=null,this.#F();return}this.#l=i.position,this.#j([{key:this.#S(r,i.position),position:i.position,top:i.edge,left:this.#A(r,n),mode:`gutter`,container:r}])}#S(e,t){return`gutter-root-${t}`}#C(e,t,n,r=jv(e)){if(!r.length)return null;let i=this.#D(e,t);if(!i.length)return null;let a=this.#L(r,t),o=i[i.length-1],s=this.#O(e,t,i);if(s){let n=this.#T(e,t,s.pos,s.nodeSize,r);return r.some(e=>this.#R(e.context.container,t)&&e.position===n)?{position:n,edge:this.#w(s)}:null}return a&&this.#c>o.rect.bottom-4&&this.#c<=n.bottom+8?{position:a.position,edge:this.#w(o)}:this.#E(e,t,i,48,r)}#w(e){return(e.rect.top+e.rect.bottom)/2}#T(e,t,n,r,i=jv(e)){let a=n+r;for(let e of i)if(this.#R(e.context.container,t)&&e.position===a)return e.position;return a}#E(e,t,n,r,i=jv(e)){let a=null;for(let o of n){let n=this.#w(o),s=Math.abs(n-this.#c);if(s>r)continue;let c=this.#T(e,t,o.pos,o.nodeSize,i);i.some(e=>this.#R(e.context.container,t)&&e.position===c)&&(!a||s<a.dist)&&(a={position:c,edge:n,dist:s})}return a?{position:a.position,edge:a.edge}:null}#D(e,t){let{editor:n}=e,r=n.view,i=[];return((e,t)=>{let n=e.type.name===`doc`?t:t+1;e.forEach(e=>{let t=n,a=r.nodeDOM(t);a instanceof HTMLElement&&i.push({pos:t,nodeSize:e.nodeSize,rect:a.getBoundingClientRect()}),n+=e.nodeSize})})(n.state.doc,0),i}#O(e,t,n){if(!n.length)return null;let r=n[n.length-1].pos,i=null;for(let a=0;a<n.length;a++){let o=n[a],s=a===0?this.#k(e,t,o):(n[a-1].rect.bottom+o.rect.top)/2,c=a===n.length-1?o.rect.bottom+4:(o.rect.bottom+n[a+1].rect.top)/2;if(this.#c<s||this.#c>c)continue;let l=Math.abs(this.#w(o)-this.#c);(!i||l<i.dist)&&(i={...o,isLast:o.pos===r,dist:l})}if(!i)return null;let{dist:a,...o}=i;return o}#k(e,t,n){let r=e.editor.view.nodeDOM(n.pos);if(r instanceof HTMLElement){let e=Number.parseFloat(getComputedStyle(r).marginTop)||0;return n.rect.top-Math.max(e,4)}return n.rect.top-4}#A(e,t){return null}#j(e){let t=this.#e.getBoundingClientRect(),n=new Set;for(let r of e){n.add(r.key);let e=this.#o.get(r.key);e||(e=this.#N(r.key,r.position),this.#t.append(e),this.#o.set(r.key,e)),this.#P(e,r,t),this.#M(e,r.container??{kind:`root`})}for(let[e,t]of this.#o)n.has(e)||(t.remove(),this.#o.delete(e))}#M(e,t){e.dataset.vizyContainer=`root`}#N(e,t){let n=document.createElement(`button`);n.type=`button`,n.className=`vizy-inline-add`,n.dataset.vizyInvokerKey=e;let r=document.createElement(`pk-icon`);return r.setAttribute(`icon`,`plus`),r.setAttribute(`label`,``),n.append(r),n.setAttribute(`aria-label`,`Add content`),n.addEventListener(`pointerdown`,this.#$),n.addEventListener(`click`,()=>this.#H(t,n,e)),n}#P(e,t,n){e.dataset.mode=t.mode;let r=t.top-n.top;e.style.top=`${r}px`,e.style.width=``,e.style.right=``,typeof t.left==`number`?(e.style.left=`${t.left}px`,e.dataset.vizyNestedAdd=``):(e.style.left=``,delete e.dataset.vizyNestedAdd)}#F(){for(let e of this.#o.values())e.remove();this.#o.clear()}#I(e,t,n){e.suspendInsertionSideEffects?.(),this.#n.close({restoreFocus:!1,animate:!1}),Dv(e,t,n).finally(()=>{e.resumeInsertionSideEffects?.()})}#L(e,t){let n=null;for(let r of e)this.#R(r.context.container,t)&&(!n||r.position>n.position)&&(n=r);return n}#R(e,t){return e.kind===t.kind}#z(){return{kind:`root`}}#B(){let e=typeof document.elementsFromPoint==`function`?document.elementsFromPoint(this.#s,this.#c):[document.elementFromPoint(this.#s,this.#c)].filter(e=>e instanceof Element);for(let t of e)if(t instanceof Element&&!this.#V(t))return t;return null}#V(e){let t=e;for(;t;){if(t instanceof HTMLElement&&(t.classList.contains(`vizy-insertion-overlay`)||t.classList.contains(`vizy-inline-add`)||t.classList.contains(`vizy-insertion-popup`)||t.localName===`pk-popup`||t.localName===`vizy-insertion-list`))return!0;if(t instanceof ShadowRoot){t=t.host;continue}t=t.parentNode}return!1}#H(e,t,n){let r=this.#i().insertion.buildContext(`inline`,e);r&&this.#U(r,t,`inline`,bv,n)}openAddBlockAbove(e,t){let n=this.#i(),r=Wg(n.editor,e);if(!r)return;let i=n.insertion.buildContext(`inline`,r.pos);i&&this.#U(i,t,`inline`,[`block`],`add-above:${e}`)}#U(e,t,n,r,i,a={}){let o=i??t.dataset.vizyInvokerKey??null,s=a.claimEditorFocus!==!1,c=a.autofocusFilter??s;if(o&&this.#n.isClosingInvoker(o)){this.#te();return}if(this.#n.isOpen&&(this.#n.isInvoker(t)||o&&this.#n.invokerKey===o)||this.#r.isOpen&&o&&this.#p?.invokerKey===o){let e=s&&o!==`toolbar-plus`;this.#n.close({restoreFocus:e,animate:!0}),this.#r.close(),this.#Q(t,o,!1),this.#te();return}let l=this.#n.isOpen||this.#n.isClosing||this.#r.isOpen,u=this.#i(),d=u.insertion.buildContext(n,e.from);if(!d)return;let f=u.insertion.query({context:d,kinds:r}),p=Ev(f);if(p){this.#I(u,d,p.item.id),this.#te();return}if(f.length===0){this.#te();return}let m=t.getBoundingClientRect();if(this.#p={context:d,invoker:t,surface:n,kinds:r,invokerKey:o,claimEditorFocus:s,autofocusFilter:c,rect:m},this.#G()===`grid`){this.#n.close({restoreFocus:!1,animate:!1}),this.#Z(u,d,f,{invoker:t,key:o,claimEditorFocus:s}),this.#te();return}this.#r.close(),this.#n.open(u,d,m,{invokerKey:o,invoker:t,kinds:r,filterable:this.#Y(),showViewToggle:this.#J(),autofocusFilter:c,holdFieldFocus:s,onRestoreFocus:s?()=>{u.editor.commands.focus(void 0,{scrollIntoView:!1})}:null,onClose:()=>{this.#Q(t,o,!1)},onViewChange:e=>this.#X(e),skipEnterMotion:l}),this.#Q(t,o,!0),this.#te()}#W(){return this.#i().manifest.field.fieldHandle?.trim()||``}#G(){return qv(this.#W(),this.#K(),this.#q())}#K(){let e=this.#i().manifest.field.blockPickerDisplay;return e===`list`||e===`grid`?e:`both`}#q(){return this.#i().manifest.field.defaultBlockPickerView===`grid`?`grid`:`list`}#J(){return this.#K()===`both`}#Y(){return this.#i().manifest.field.showBlockSearch!==!1}#X(e){if(!this.#J())return;Jv(this.#W(),e);let t=this.#p;if(!t)return;let n=this.#i();if(e===`grid`){let e=n.insertion.query({context:t.context,kinds:t.kinds});this.#n.close({restoreFocus:!1,animate:!1}),this.#Z(n,t.context,e,{invoker:t.invoker,key:t.invokerKey,claimEditorFocus:t.claimEditorFocus});return}this.#r.close({notify:!1}),this.#n.open(n,t.context,t.rect,{invokerKey:t.invokerKey,invoker:t.invoker,kinds:t.kinds,filterable:this.#Y(),showViewToggle:!0,autofocusFilter:this.#Y()&&t.autofocusFilter,holdFieldFocus:t.claimEditorFocus,onRestoreFocus:t.claimEditorFocus?()=>{n.editor.commands.focus(void 0,{scrollIntoView:!1})}:null,onClose:()=>{this.#Q(t.invoker,t.invokerKey,!1)},onViewChange:e=>this.#X(e)}),this.#Q(t.invoker,t.invokerKey,!0)}#Z(e,t,n,r){this.#r.open(e,t,n,{filterable:this.#Y(),showViewToggle:this.#J(),onView:this.#J()?e=>this.#X(e):void 0,onClose:()=>{this.#Q(r.invoker,r.key,!1)}}),this.#Q(r.invoker,r.key,!0)}#Q(e,t,n){if(t===`toolbar-plus`){this.#a?.(n);return}n?e.setAttribute(`aria-expanded`,`true`):e.removeAttribute(`aria-expanded`)}#$=e=>{if(e.button!==0)return;e.preventDefault(),this.#ee();let t=()=>{window.removeEventListener(`pointerup`,t,!0),window.removeEventListener(`pointercancel`,t,!0),window.setTimeout(()=>this.#te(),0)};window.addEventListener(`pointerup`,t,!0),window.addEventListener(`pointercancel`,t,!0)};#ee(){if(this.#f)return;let e=pn(this.#e);e&&(this.#f=e,mn(e,!0))}#te(){this.#f&&=(mn(this.#f,!1),null)}};function rx(e,t,n,r){e.state.doc.descendants((i,a)=>{if(i.type.name!==`vizyBlock`)return;let o=String(i.attrs.blockUid),s=String(i.attrs.blockTypeUid),c=t.blockTypes[s],l=i.attrs.fieldSlots??{},u=Hg({blockUid:o,blockTypeUid:s,enabled:!!i.attrs.enabled,fieldSlots:l,type:c,inference:c?.summaryInference,revision:r.get(o)??0,explicitTitlePlacementUid:c?.summary?.titlePlacementUid,explicitSubtitlePlacementUid:c?.summary?.subtitlePlacementUid,explicitMediaPlacementUid:c?.summary?.mediaPlacementUid});n.update(o,{summary:u});let d=e.view.nodeDOM(a);d instanceof I&&d.applySummary(u)})}var ix=10,ax=8,ox=class extends t{#e=null;get editor(){return this.#e}set editor(e){this.#e=e}#t=!1;get visible(){return this.#t}set visible(e){this.#t=e}#n=``;get preview(){return this.#n}set preview(e){this.#n=e}#r=``;get previewTitle(){return this.#r}set previewTitle(e){this.#r=e}#i=!1;get previewIsUrl(){return this.#i}set previewIsUrl(e){this.#i=e}#a=null;#o={getClientRect:null,contextElement:void 0};static styles=o`
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
    `;syncToLink(e,t){let n=sx(t);this.preview=n.text,this.previewTitle=n.title,this.previewIsUrl=n.openable,this.#o.getClientRect=e.getClientRect,this.#o.contextElement=e.contextElement,this.#l(),this.visible=!0,this.#a&&(this.#a.active=!0,this.#a.reposition())}hide(){this.visible=!1,this.#a&&(this.#a.active=!1)}disconnectedCallback(){let e=this.#a;this.#a=null,e?.isConnected&&(e.active=!1,e.remove()),super.disconnectedCallback()}render(){return this.visible?n`
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
        `:r}#s=()=>{let e=this.editor;if(!e)return;let t=Sc(e);this.hide(),Jc(e,t,{focus:!0})};#c=()=>{let e=this.editor;e&&(Tc(e,{focus:!0}),this.hide())};#l(){if(this.#a)return;let e=document.createElement(`pk-popup`);e.className=`vizy-link-bubble-popup`,e.placement=`top`,e.distance=ax,e.flip=!0,e.flipPadding=this.#u(),e.shift=!0,e.shiftPadding=ix,e.arrow=!0,e.arrowPlacement=`center`,e.anchorTracking=!0,e.positionMethod=`fixed`;let t=this.#o;e.anchor={getBoundingClientRect:()=>t.getClientRect?.()??new DOMRect,get contextElement(){return t.contextElement}},e.append(this),document.body.append(e),this.#a=e}#u(){let e=getComputedStyle(document.documentElement).getPropertyValue(`--header-height`).trim(),t=Number.parseFloat(e);return!Number.isFinite(t)||t<=0?ix:Math.max(ix,Math.round(t)+8)}};F([c({attribute:!1})],ox.prototype,`editor`,null),F([c({type:Boolean,reflect:!0})],ox.prototype,`visible`,null),F([c()],ox.prototype,`preview`,null),F([c()],ox.prototype,`previewTitle`,null),F([c({type:Boolean})],ox.prototype,`previewIsUrl`,null),ox=F([P(`vizy-link-bubble`)],ox);function sx(e){switch(e.type){case`entry`:return{text:`Entry`,title:`Linked entry`,openable:!1};case`asset`:return{text:`Asset`,title:`Linked asset`,openable:!1};case`category`:return{text:`Category`,title:`Linked category`,openable:!1};case`email`:case`tel`:case`sms`:{let t=Qs(e);return{text:cx(t),title:t,openable:!0}}default:{let t=Qs(e);return{text:cx(t),title:t,openable:t.startsWith(`http`)}}}}function cx(e,t=30){return e.length<=t?e:`${e.slice(0,t-1)}…`}function lx(e){if(!e.isFocused||!e.isActive(`link`))return null;let t=e.state.schema.marks.link;return!t||!me(e.state.selection.$from,t)?null:Ys(e.getAttributes(`link`))}var ux=10,dx=8,fx=500,px=class extends t{#e=null;get editor(){return this.#e}set editor(e){this.#e=e}#t={};get imageAuthoring(){return this.#t}set imageAuthoring(e){this.#t=e}#n=!1;get visible(){return this.#n}set visible(e){this.#n=e}#r=null;#i=null;#a=null;#o=null;#s=null;#c=0;#l={getClientRect:()=>this.#_(),contextElement:void 0};static styles=o`
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
    `;updated(e){e.has(`editor`)&&this.#m()}syncToImage(){let e=this.editor;if(!e)return;this.#m();let t=hx(e);if(t!==this.#a){let e=this.#a;this.#a=t,e!==null&&Date.now()-this.#c>fx&&(this.#o=null)}this.#l.contextElement=e.view.dom,this.#v();let n=!!this.#r?.active,r=this.#o!==null||this.#s!==null;this.visible=!0,this.updateComplete.then(()=>{!this.#r||!this.visible||(this.#r.active=!0,(n||r)&&this.#r.reposition())})}hide(e){this.visible=!1,this.#a=null,e?.clearAnchor&&(this.#o=null,this.#s=null,this.#c=0),this.#r&&(this.#r.active=!1)}disconnectedCallback(){this.#h();let e=this.#r;this.#r=null,e?.isConnected&&(e.active=!1,e.remove()),super.disconnectedCallback()}render(){if(!this.visible)return r;let e=this.#u();return n`
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
        `}#u(){let e=this.editor;if(!e?.isActive(`image`))return null;let t=String(e.getAttributes(`image`).assetUid??``);return t?ll(t):null}#d=()=>{let e=this.editor;if(!e)return;let t=ml(e);t&&(this.hide({clearAnchor:!0}),Sl(e,t,{focus:!0,transforms:this.imageAuthoring.transforms??[]}))};#f=()=>{let e=this.editor;e&&(gl(e,{focus:!0}),this.hide({clearAnchor:!0}))};#p=()=>{let e=this.editor,t=this.#u();if(!e||!t?.assetId)return;let n=window.Craft;if(typeof n?.AssetImageEditor!=`function`)return;let r=String(e.getAttributes(`image`).assetUid??``);new n.AssetImageEditor(t.assetId,{allowSavingAsNew:!1,allowDegreeFractions:n.isImagick,onSave:async()=>{r&&await bl(r)}}),this.hide({clearAnchor:!0})};#m(){let e=this.editor?.view.dom??null;e!==this.#i&&(this.#h(),e&&(this.#i=e,e.addEventListener(`pointerdown`,this.#g,!0)))}#h(){this.#i?.removeEventListener(`pointerdown`,this.#g,!0),this.#i=null}#g=e=>{let t=e.target;if(!(t instanceof Element))return;let n=t.closest(`.vizy-image`);if(!n||!this.#i?.contains(n))return;let r=(n.querySelector(`img`)??n).getBoundingClientRect();if(r.width<=0||r.height<=0)return;this.#o={x:mx((e.clientX-r.left)/r.width),y:mx((e.clientY-r.top)/r.height)},this.#s={x:e.clientX,y:e.clientY},this.#c=Date.now();let i=this.editor;Cn(pn(i?.view.dom??null),()=>{i&&!i.isDestroyed&&Sn(i)}),requestAnimationFrame(()=>{!i||i.isDestroyed||_x(i)&&this.syncToImage()})};#_(){if(this.#s&&Date.now()-this.#c<=fx)return new DOMRect(this.#s.x-12,this.#s.y-12,24,24);let e=gx(this.editor);if(!e)return new DOMRect;if(this.#o){let t=e.left+this.#o.x*e.width,n=e.top+this.#o.y*e.height;return new DOMRect(t-12,n-12,24,24)}return new DOMRect(e.left+e.width/2-12,e.top,24,24)}#v(){if(this.#r)return;let e=document.createElement(`pk-popup`);e.className=`vizy-image-bubble-popup`,e.placement=`top`,e.distance=dx,e.flip=!0,e.flipPadding=ux,e.shift=!0,e.shiftPadding=ux,e.arrow=!0,e.arrowPlacement=`center`,e.anchorTracking=!0,e.positionMethod=`fixed`;let t=this.#l;e.anchor={getBoundingClientRect:()=>t.getClientRect(),get contextElement(){return t.contextElement}},e.append(this),document.body.append(e),this.#r=e}};F([c({attribute:!1})],px.prototype,`editor`,null),F([c({attribute:!1})],px.prototype,`imageAuthoring`,null),F([c({type:Boolean,reflect:!0})],px.prototype,`visible`,null),px=F([P(`vizy-image-bubble`)],px);function mx(e){return Math.min(1,Math.max(0,e))}function hx(e){if(!e)return null;let{selection:t}=e.state;if(t instanceof O&&t.node.type.name===`image`)return t.from;if(!e.isActive(`image`))return null;let n=t.$from;for(let e=n.depth;e>=0;e--)if(n.node(e).type.name===`image`)return e===0?0:n.before(e);return null}function gx(e){let t=hx(e);if(t==null||!e)return null;let n=e.view.nodeDOM(t);return n instanceof HTMLElement?(n.matches(`img`)?n:n.querySelector(`img`)??n).getBoundingClientRect():null}function _x(e){let{selection:t}=e.state;return t instanceof O&&t.node.type.name===`image`||e.isActive(`image`)}var vx=10,yx=8,bx=500,xx=`.vizy-iframe, .vizy-media-embed`,Sx=class extends t{#e=null;get editor(){return this.#e}set editor(e){this.#e=e}#t=!1;get visible(){return this.#t}set visible(e){this.#t=e}#n=null;#r=`mediaEmbed`;#i=null;#a=null;#o=null;#s=null;#c=0;#l={getClientRect:()=>this.#h(),contextElement:void 0};static styles=o`
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
    `;updated(e){e.has(`editor`)&&this.#f()}syncToEmbed(e){let t=this.editor;if(!t)return;this.#r=e,this.#f();let n=wx(t);if(n!==this.#a){let e=this.#a;this.#a=n,e!==null&&Date.now()-this.#c>bx&&(this.#o=null)}this.#l.contextElement=t.view.dom,this.#g();let r=!!this.#n?.active,i=this.#o!==null||this.#s!==null;this.visible=!0,this.updateComplete.then(()=>{!this.#n||!this.visible||(this.#n.active=!0,(r||i)&&this.#n.reposition())})}hide(e){this.visible=!1,this.#a=null,e?.clearAnchor&&(this.#o=null,this.#s=null,this.#c=0),this.#n&&(this.#n.active=!1)}disconnectedCallback(){this.#p();let e=this.#n;this.#n=null,e?.isConnected&&(e.active=!1,e.remove()),super.disconnectedCallback()}render(){return this.visible?n`
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
        `:r}#u=()=>{let e=this.editor;if(!e)return;let t=Rl(e,this.#r);t&&(this.hide({clearAnchor:!0}),Ll(e,t,{focus:!0}))};#d=()=>{let e=this.editor;e&&(zl(e,this.#r,{focus:!0}),this.hide({clearAnchor:!0}))};#f(){let e=this.editor?.view.dom??null;e!==this.#i&&(this.#p(),e&&(this.#i=e,e.addEventListener(`pointerdown`,this.#m,!0)))}#p(){this.#i?.removeEventListener(`pointerdown`,this.#m,!0),this.#i=null}#m=e=>{let t=e.target;if(!(t instanceof Element))return;let n=t.closest(xx);if(!n||!this.#i?.contains(n))return;let r=n.getBoundingClientRect();if(r.width<=0||r.height<=0)return;this.#o={x:Cx((e.clientX-r.left)/r.width),y:Cx((e.clientY-r.top)/r.height)},this.#s={x:e.clientX,y:e.clientY},this.#c=Date.now();let i=this.editor;Cn(pn(i?.view.dom??null),()=>{i&&!i.isDestroyed&&Sn(i)}),requestAnimationFrame(()=>{if(!i||i.isDestroyed)return;let e=Ex(i);e&&this.syncToEmbed(e)})};#h(){if(this.#s&&Date.now()-this.#c<=bx)return new DOMRect(this.#s.x-12,this.#s.y-12,24,24);let e=Tx(this.editor);if(!e)return new DOMRect;if(this.#o){let t=e.left+this.#o.x*e.width,n=e.top+this.#o.y*e.height;return new DOMRect(t-12,n-12,24,24)}return new DOMRect(e.left+e.width/2-12,e.top,24,24)}#g(){if(this.#n)return;let e=document.createElement(`pk-popup`);e.className=`vizy-embed-bubble-popup`,e.placement=`top`,e.distance=yx,e.flip=!0,e.flipPadding=vx,e.shift=!0,e.shiftPadding=vx,e.arrow=!0,e.arrowPlacement=`center`,e.anchorTracking=!0,e.positionMethod=`fixed`;let t=this.#l;e.anchor={getBoundingClientRect:()=>t.getClientRect(),get contextElement(){return t.contextElement}},e.append(this),document.body.append(e),this.#n=e}};F([c({attribute:!1})],Sx.prototype,`editor`,null),F([c({type:Boolean,reflect:!0})],Sx.prototype,`visible`,null),Sx=F([P(`vizy-embed-bubble`)],Sx);function Cx(e){return Math.min(1,Math.max(0,e))}function wx(e){if(!e)return null;let{selection:t}=e.state;if(t instanceof O){let e=t.node.type.name;if(e===`iframe`||e===`mediaEmbed`)return t.from}let n=Ex(e);if(!n)return null;let r=t.$from;for(let e=r.depth;e>=0;e--)if(r.node(e).type.name===n)return e===0?0:r.before(e);return null}function Tx(e){let t=wx(e);if(t==null||!e)return null;let n=e.view.nodeDOM(t);return n instanceof HTMLElement?(n.matches(xx)?n:n.querySelector(xx)??n).getBoundingClientRect():null}function Ex(e){let{selection:t}=e.state;if(t instanceof O){let e=t.node.type.name;if(e===`iframe`||e===`mediaEmbed`)return e}return e.isActive(`iframe`)?`iframe`:e.isActive(`mediaEmbed`)?`mediaEmbed`:null}function Dx(e,t){return`${encodeURIComponent(e)}=${encodeURIComponent(t)}`}function Ox(e){try{return decodeURIComponent(e.replace(/\+/g,` `))}catch{return e}}function kx(e,t){let{fieldName:n,canonical:r,editorId:i,metadata:a}=t,o=i?`vizyTransport[${i}]`:null,s=e===``?[]:e.split(`&`).filter(e=>e!==``),c=[];for(let e of s){let t=e.indexOf(`=`),r=Ox(t===-1?e:e.slice(0,t));r!==n&&(r.startsWith(`vizyHost[`)||r.includes(`[vizyHost]`)||o&&(r===o||r.startsWith(`${o}[`))||c.push(e))}if(c.push(Dx(n,r)),i&&a){let e=`vizyTransport[${i}]`;for(let[t,n]of Object.entries(a))c.push(Dx(`${e}[${t}]`,n))}return c.join(`&`)}function $(e){return JSON.stringify(e,(e,t)=>!t||typeof t!=`object`||Array.isArray(t)?t:Object.fromEntries(Object.entries(t).sort(([e],[t])=>e.localeCompare(t))))}var Ax=1e4,jx=class extends HTMLElement{#e=null;#t=null;#n=null;#r=null;#i=new bu;#a=new xu;#o=null;#s=null;#c=new Set;#l=null;#u=null;#d=null;#f=null;#p=null;#m=null;#h=null;#g=[];#_=0;#v=new Map;#y=!1;#b=!1;#x=``;#S=null;#C=`complete`;#w=[];#T=null;#E=null;#D=0;#O=null;#k=null;#A=null;#j=null;#M=!1;#N=!1;#P=0;#F=new Map;#I=!1;#L=!1;#R=null;#z=!1;#B=!1;#V(){return this.#t?this.#t.view.hasFocus()?!0:this.#B&&!!this.#d?.matches(`:focus-within`):!1}#H(){if(!this.#d||!this.#t||!this.#e)return;if(!this.#l){this.#d.canAddBlock=this.#e.manifest.field.insertableBlockTypeUids.length>0;return}let e=this.#V()?this.#t.state.selection.from:0,t=this.#l.buildContext(`inline`,e);this.#d.canAddBlock=t!==null&&this.#l.query({context:t,kinds:bv,limit:1}).length>0}set bootstrap(e){if(this.#t)throw Error(`editorAlreadyBootstrapped`);this.#e=structuredClone(e),this.isConnected&&queueMicrotask(()=>this.#U())}connectedCallback(){this.#R!==null&&(window.clearTimeout(this.#R),this.#R=null),queueMicrotask(()=>this.#U())}disconnectedCallback(){this.#R!==null&&window.clearTimeout(this.#R),this.#R=window.setTimeout(()=>{this.#R=null,this.isConnected||this.#K()},0)}#U(){if(!this.#e){let e=this.#W();if(e)this.#e=structuredClone(e);else if(this.id){let e=bt(this.id);if(e){this.bootstrap=e;return}}}if(!this.#e){this.hasAttribute(`data-vizy-hosted`)&&this.#G(Error(`hostedBootstrapMissing`));return}try{this.#re()}catch(e){this.#G(e)}}#W(){let e=this.querySelector(`:scope > template[data-vizy-bootstrap]`),t=(e instanceof HTMLTemplateElement?e.content.textContent:e?.textContent)?.trim();if(!t)return null;try{let n=JSON.parse(t);return e?.remove(),n}catch{return null}}#G(e){console.error(`[Vizy] Editor failed to initialize`,e);try{this.#K()}catch{}Rt(this,e)}get editor(){return this.#t}get insertionRegistry(){return this.#l}get isDirty(){return!this.#t||!this.#b?!1:$(this.#he())!==this.#x}get fullySaved(){return!this.isDirty&&this.#C===`complete`}get finalizationState(){return{status:this.#C,errors:this.#w,retryToken:this.#T}}flush(e){if(!this.#t||!this.#r){if(this.#e?.hosted&&this.#r?.value)return this.#r.value;throw Error(`editorNotReady`)}this.#pe();let t=this.#he(),n=this.#ge(t);return this.#r.value=n,n}acceptServerResult(e,t){let n=this.#F.get(t);if(!(t!==this.#P||!n||e.submittedClientRevision!==n.revision)&&e.requestKind!==`livePreview`&&e.success){if(this.#e&&e.storageToken&&(this.#e.storageToken=e.storageToken),this.#q(e),e.submittedClientRevision===this.#_){this.#be(e.canonicalDocument),this.#me(),this.#x=$(this.#he()),this.#b=!1;return}this.#x=$(this.#_e(e.canonicalDocument)),this.#b=$(this.#he())!==this.#x}}beginSubmission(){let e=++this.#P;return this.#F.clear(),this.#F.set(e,{revision:this.#_,canonical:$(this.#he())}),{generation:e,clientRevision:this.#_}}destroy(){this.#L||(this.#L=!0,this.#R!==null&&(window.clearTimeout(this.#R),this.#R=null),this.#K())}#K(){this.#D++,this.#O=null,this.#k=null,this.#A=null,this.#j=null,this.#M=!1,this.#B=!1;for(let e of this.#g.splice(0))e();this.#a.destroy(),this.#i.clear(),this.#l=null,this.#u?.destroy(),this.#u=null,this.#t?.destroy(),this.#t=null,this.#o?.destroy(),this.#o=null,this.#s=null,this.#c.clear(),this.#n=null,this.#d=null,this.#f=null,this.#p=null,this.#m=null,this.#h=null,this.querySelector(`.vizy-editor-shell`)?.remove()}#q(e){this.#N=this.#C!==`complete`&&e.finalizationStatus===`complete`,this.#D++,this.#M=!1,this.#C=e.finalizationStatus,this.#w=e.finalizationErrors??[],this.#E=e.finalizationDeferredReason??null,this.#T=e.retryToken??null,this.#e&&(this.#e.finalization={finalizationStatus:this.#C,finalizationErrors:this.#w,finalizationDeferredReason:this.#E,retryToken:this.#T}),this.#J()}#J(){let e=this.#O;if(!e)return;e.hidden=this.#C===`complete`&&!this.#N;let t=e=>window.Craft?.t?.(`vizy`,e)??e,n=document.createElement(`span`);if(n.textContent=this.#C===`complete`?t(`Uploads completed.`):this.#C===`failed`?t(`Some files could not be uploaded. Your content is saved. Retry the uploads or contact your administrator.`):this.#E===`draftDeferredUntilCanonicalPublish`?t(`Files will finish uploading when you publish this draft.`):t(`Your content is saved, but file uploads are still pending.`),e.replaceChildren(n),this.#T&&this.#C!==`complete`){let n=document.createElement(`pk-button`);n.type=`button`,n.size=`sm`,n.textContent=t(`Retry uploads`),n.ariaLabel=t(`Retry uploads`),n.loading=this.#M,n.disabled=this.#M,n.addEventListener(`click`,()=>{this.#Y()}),e.append(n)}}async#Y(){let e=this.#T;if(!e||this.#M)return;let t=this.#D;this.#M=!0,this.#J();try{let n=await window.Craft?.sendActionRequest?.(`POST`,`vizy/finalization/retry`,{data:{retryToken:e}});if(!n?.data.success||![`complete`,`pending`,`failed`].includes(n.data.finalizationStatus))throw Error(`uploadRetryFailed`);if(t!==this.#D||this.#L)return;this.#q(n.data)}catch{if(t!==this.#D||this.#L)return;this.#M=!1,this.#C=`failed`,this.#J()}this.#O?.focus({preventScroll:!0})}#X(e){let t=this.#o?.open(e);this.#te(e),t?.catch(()=>this.#oe()).finally(()=>this.#te(e))}#Z(e){let t=this.#o?.retry(e);this.#te(e),t?.catch(()=>this.#oe()).finally(()=>this.#te(e))}#Q(){if(!this.#t||!this.#e)return this.#c;let e=this.#t.state.doc;return this.#s!==e&&(this.#s=e,this.#c=new Set(Zu(e,this.#e.manifest.blockTypes))),this.#c}#$(){if(!this.#t||!this.#e)return;let e=this.#Q();this.#t.state.doc.descendants(t=>{if(t.type.name!==`vizyBlock`)return;let n=String(t.attrs.blockUid);if(!e.has(n))return;let r=this.#e.manifest.blockTypes[String(t.attrs.blockTypeUid)];if(!r?.fieldLayoutUid)return;this.#a.acquire(n,String(t.attrs.blockTypeUid),r.fieldLayoutUid,r.fieldLayoutHash??null);let i=this.#a.get(n)?.status;i!==`mounted`&&i!==`loading`&&i!==`failed`&&this.#X(n)})}#ee(){this.#$()}#te(e){let t=this.#a.get(e),n=t?.root.closest(`vizy-block`);if(!n)return;let r=t?.status;n.fieldLayoutState=r===`mounted`?`mounted`:r===`loading`?`loading`:r===`failed`?`error`:`unmounted`,n.fieldLayoutError=r===`failed`?t?.errorMessage??null:null,(r===`mounted`||r===`failed`)&&(n.fieldLayoutRetrying=!1)}#ne(e){let t=e.dataset.blockUid,n=!1;return t&&this.#y&&queueMicrotask(()=>{!n&&e.isConnected&&this.#y&&this.#X(t)}),()=>{n=!0}}#re(){if(!this.#e||this.#t||this.#L||!this.isConnected)return;if(this.querySelector(`.vizy-editor-shell`)?.remove(),this.#r=this.querySelector(`input[data-vizy-document]`),!this.#r)throw Error(`canonicalInputMissing`);let e=this.#e.manifest;this.#n=document.createElement(`div`),this.#n.className=`vizy-editor-body`,this.#g.push(yn(this.#n)),this.#d=document.createElement(`vizy-toolbar`),this.#d.controls=e.toolbar?.controls??[];let t=e.field.insertableBlockTypeUids??[];if(this.#d.canAddBlock=t.length>0,this.#d.addBlockNeedsMenu=t.length>1,t.length===1){let n=e.blockTypes[t[0]];this.#d.addBlockDirectLabel=n?.name?`Add ${n.name}`:null}else this.#d.addBlockDirectLabel=null;this.#d.linkAuthoring={linkOptions:this.#e.linkOptions,elementSiteId:this.#e.elementSiteId,linkSelectorStorageKeyPrefix:`VizyInput.LinkTo.${e.field.fieldUid||`field`}`},this.#d.imageAuthoring={volumes:this.#e.imageAuthoring?.volumes??[],transforms:this.#e.imageAuthoring?.transforms??[],defaultTransform:this.#e.imageAuthoring?.defaultTransform??``,defaultSource:this.#e.imageAuthoring?.defaultSource??null,elementSiteId:this.#e.elementSiteId,linkSelectorStorageKeyPrefix:`VizyInput.${e.field.fieldUid||`field`}`},this.#d.layoutPresets=_t(e),this.#f=document.createElement(`vizy-bubble`),this.#f.controls=e.bubble?.enabled===!1?[]:e.bubble?.controls??[],this.#p=document.createElement(`vizy-link-bubble`),this.#m=document.createElement(`vizy-image-bubble`),this.#m.imageAuthoring=this.#d.imageAuthoring,this.#h=document.createElement(`vizy-embed-bubble`);let n=document.createElement(`div`);n.className=`vizy-editor-surface`;let r=e.field.initialRows;n.style.setProperty(`--vizy-initial-rows`,String(typeof r==`number`&&Number.isFinite(r)?Math.max(0,Math.floor(r)):7)),this.#n.append(this.#d,n);let i=document.createElement(`div`);i.className=`vizy-editor-shell`,this.#O=document.createElement(`div`),this.#O.className=`vizy-upload-status`,this.#O.dataset.vizyUploadStatus=``,this.#O.setAttribute(`role`,`status`),this.#O.tabIndex=-1,this.#k=document.createElement(`div`),this.#k.className=`vizy-unsupported-status`,this.#k.dataset.vizyUnsupportedStatus=``,this.#k.setAttribute(`role`,`status`),this.#k.hidden=!0;let a=document.createElement(`strong`);a.textContent=window.Craft?.t?.(`vizy`,`Some content can’t be edited here.`)??`Some content can’t be edited here.`;let o=document.createElement(`span`);o.textContent=window.Craft?.t?.(`vizy`,`Vizy has preserved it and will keep it unchanged when you save.`)??`Vizy has preserved it and will keep it unchanged when you save.`,this.#k.append(a,o),this.#A=document.createElement(`div`),this.#A.className=`vizy-clipboard-status`,this.#A.dataset.vizyClipboardStatus=``,this.#A.setAttribute(`role`,`alert`),this.#A.hidden=!0,this.#j=document.createElement(`div`),this.#j.className=`vizy-capture-status`,this.#j.dataset.vizyCaptureStatus=``,this.#j.setAttribute(`role`,`alert`),this.#j.hidden=!0,i.append(this.#O,this.#k,this.#A,this.#j,this.#n),this.prepend(i);let s=()=>{this.#A&&(this.#A.hidden=!0,this.#A.textContent=``)},c=(e=>{if(!this.#A)return;e.stopPropagation();let t=e.detail?.code??`invalidPrivateSlice`,n=e.detail?.operation??`paste`,r={documentBytesExceeded:`This Vizy content is too large to copy or paste safely. Split it into a smaller selection and try again.`,nodeCountExceeded:`This Vizy content contains too many nodes to copy or paste safely. Split it into a smaller selection and try again.`,placeholderCountExceeded:`This selection contains too many preserved items to copy or paste safely. Split it into a smaller selection and try again.`,objectWidthExceeded:`This Vizy content is too large to copy or paste safely. Split it into a smaller selection and try again.`,placementAttemptsExceeded:`This selection is too complex to copy or paste safely. Split it into a smaller selection and try again.`,blockTypeNotInsertable:`This content contains a Block type that is not available in this field.`,fieldCaptureFailed:`Vizy could not read every Block field, so the content was not copied or cut.`,opaqueClipboardUnsupported:`This preserved content cannot be copied or cut because this editor does not understand its original type. It will remain unchanged when you save.`,policyRejected:`This content cannot be inserted or removed because it would break this field’s Block limits.`,invalidPrivateSlice:`Vizy could not paste this content because its private clipboard data is invalid or incompatible.`},i=n===`paste`?`Vizy could not paste this content.`:`Vizy could not ${n} this content.`;this.#A.textContent=window.Craft?.t?.(`vizy`,r[t]??i)??r[t]??i,this.#A.hidden=!1});this.addEventListener(`copy`,s,!0),this.addEventListener(`cut`,s,!0),this.addEventListener(`paste`,s,!0),this.addEventListener(`vizy-clipboard-rejected`,c),this.#g.push(()=>{this.removeEventListener(`copy`,s,!0),this.removeEventListener(`cut`,s,!0),this.removeEventListener(`paste`,s,!0),this.removeEventListener(`vizy-clipboard-rejected`,c)}),this.#q(this.#e.finalization??{finalizationStatus:`complete`});let l,u,d=this.id||`vizy-editor-${e.field.fieldUid}`,f=()=>({editor:l,manifest:e,ui:this.#i,hosts:this.#a,insertion:u,openFields:e=>this.#X(e),observeFieldViewport:e=>this.#ne(e),refreshSummaries:()=>this.#oe(),blockRevision:e=>this.#v.get(e)??0,flushMountedFields:()=>this.#pe(),duplicateBlock:async t=>this.#t?Yg(this.#t,t,{manifest:e,documentRevision:()=>this.#_,flushMountedFields:()=>this.#pe(),prefetchNewBlocks:async e=>{this.#o&&await this.#o.prefetchNewBlocks(e)},discardPrefetchedBlocks:e=>this.#o?.discardPrefetchedBlocks(e),animateInsert:En}):!1,openAddBlockAbove:(e,t)=>{this.#u?.openAddBlockAbove(e,t)},suspendInsertionSideEffects:()=>{this.#z=!0},resumeInsertionSideEffects:()=>{this.#z=!1,this.#B=!1,this.#u?.sync(),this.#oe()},insertionSideEffectsSuspended:()=>this.#z});l=new We({element:n,extensions:Wb(e,f),content:{type:`doc`,attrs:{schemaVersion:2},content:[]},editorProps:{handleDOMEvents:{paste(t,n){if(!e.field.pasteAsPlainText||!n.clipboardData||n.clipboardData.getData(`application/x-vizy-opaque-slice+json`))return!1;let r=n.clipboardData.getData(`text/plain`),i=n.clipboardData.getData(`text/html`);if(!r&&!i)return!1;if(!r){let e=new DOMParser().parseFromString(i,`text/html`).body,n=$e.fromSchema(t.state.schema).parseSlice(e);r=n.content.textBetween(0,n.content.size,`

`,`
`)}return n.preventDefault(),t.pasteText(r,n),!0}}},onTransaction:({transaction:t})=>{t.docChanged&&(this.#I||(this.#_+=1),this.#y&&(this.#b=!0,this.#ve()),this.#Ce(t.before,t.doc),this.#ue(),this.#Se(),this.#H(),N_(t)&&P_(l,e,u))}}),this.#t=l,Kc(l,e.field.linkSettings,e.field.linkAttributes),this.#d&&(this.#d.editor=l),this.#f&&(this.#f.editor=l),this.#p&&(this.#p.editor=l),this.#m&&(this.#m.editor=l),this.#h&&(this.#h.editor=l);let p=(e=>{let t=e.target;if(!(t instanceof HTMLElement)||t.localName!==`vizy-block`)return;let n=t.getAttribute(`data-block-uid`);if(!n)return;let r=this.#a.get(n);!r||r.status!==`mounted`||wu(r,e.detail.index,t)});this.addEventListener(`vizy-layout-tab-change`,p),this.#g.push(()=>this.removeEventListener(`vizy-layout-tab-change`,p));let m=(e=>{let t=e.detail?.blockUid?.trim(),n=e.target instanceof HTMLElement?e.target.getAttribute(`data-block-uid`):null,r=t||n;r&&(e.stopPropagation(),this.#Z(r))});this.addEventListener(`vizy-retry-field-layout`,m),this.#g.push(()=>this.removeEventListener(`vizy-retry-field-layout`,m)),u=tx({editor:l,manifest:e,documentRevision:()=>this.#_,createUid:()=>crypto.randomUUID(),prefetchBlockFieldLayout:async e=>{this.#o&&await this.#o.prefetchNewBlock({...e,documentRevision:this.#_})},discardPrefetchedBlock:e=>this.#o?.discardPrefetchedBlocks([e]),animateBlockInsert:e=>En(e)},d,e.insertionItems??[]),this.#l=u,this.#g.push(jt(u,e)),this.#u=new nx(n,f,{onToolbarAddBlockOpenChange:e=>{this.#d&&(this.#d.addBlockOpen=e)}});let h=(e=>{let{action:t,invoker:n,hadEditorFocus:r}=e.detail??{};if(!(!n||!this.#u)&&t===`insert-block`){let e=!!r||this.#V();this.#u.openToolbarInsert(n,{hadEditorFocus:e,useCurrentSelection:e})}});this.#d?.addEventListener(`vizy-toolbar-ui`,h),this.#g.push(()=>this.#d?.removeEventListener(`vizy-toolbar-ui`,h)),l.on(`selectionUpdate`,()=>{this.#z||(this.#u?.sync(),this.#H(),this.#se())}),l.on(`focus`,()=>{this.#B=!0,this.#H()}),l.on(`blur`,()=>{requestAnimationFrame(()=>{if(!(!this.#t||this.#t.isDestroyed)){try{if(this.#t.view.hasFocus())return}catch{return}pn(this.#t.view.dom)?.hasAttribute(`data-has-focus`)||(this.#d?.matches(`:focus-within`)||(this.#B=!1),this.#H(),this.#f?.hide(),this.#p?.hide(),this.#m?.hide(),this.#h?.hide())}})}),l.on(`transaction`,({transaction:e})=>{e.docChanged&&queueMicrotask(()=>{!this.#t||this.#t.isDestroyed||this.#z||(this.#u?.sync(),this.#oe())})}),this.#g.push(()=>{this.#u?.destroy(),this.#u=null,this.#d?.remove(),this.#d=null,this.#f?.remove(),this.#f=null,this.#p?.remove(),this.#p=null,this.#m?.remove(),this.#m=null,this.#h?.remove(),this.#h=null}),this.#o=new Xu(this.#a,e,this.#e.editorContextToken,e=>this.#le(e),e=>this.#fe(e)),ul(this.#e.imagePreviews),this.#xe(this.#ye(this.#e.document,e)),this.#H(),this.#Se(),this.#ie();let g=$(this.#he());this.#x=g,this.#r.value=this.#ge(this.#he()),this.#e.hosted||this.#we(),this.#y=!0,this.#ue(),this.#ee(),this.#oe(),this.#u?.sync()}#ie(){if(!(!this.#e||!this.#o))for(let e of this.#e.initialFieldLayouts??[]){if(e&&typeof e==`object`&&`ok`in e&&e.ok===!1){let t=this.#o.adoptInitialFailure(e);t&&this.#te(t.blockUid);continue}let t=this.#o.adoptInitial(e);t&&this.#te(t.blockUid)}}#ae(e,t){let n=0,r=performance.now()+Ax,i=!1;this.#g.push(()=>{i=!0,n&&cancelAnimationFrame(n)});let a=()=>{if(i||this.#L)return;let o=window.$?.(e),s=o?.data(`elementEditor`);if(!s?.on){performance.now()<r&&(n=requestAnimationFrame(a));return}s.on(`serializeForm`,t),this.#g.push(()=>s.off?.(`serializeForm`,t)),s.lastSerializedValue==null&&typeof s.serializeForm==`function`&&o?.data(`initialSerializedValue`,s.serializeForm(!0))};a()}#oe(){!this.#t||!this.#e||rx(this.#t,this.#e.manifest,this.#i,this.#v)}#se(){if(!this.#t)return;let e=this.#t;if(_x(e)&&this.#m&&Nx(this.#e?.manifest)){this.#f?.hide(),this.#p?.hide(),this.#h?.hide({clearAnchor:!0}),this.#m.syncToImage();return}this.#m?.hide({clearAnchor:!0});let t=Ex(e);if(t&&this.#h&&Px(this.#e?.manifest,t)){this.#f?.hide(),this.#p?.hide(),this.#h.syncToEmbed(t);return}this.#h?.hide({clearAnchor:!0});let n=lx(e);if(n&&this.#p&&Mx(this.#e?.manifest)){this.#f?.hide();let t=e.state.schema.marks.link;if(!(t&&me(e.state.selection.$from,t))){this.#p.hide();return}this.#p.syncToLink({getClientRect:()=>{let t=e.state.schema.marks.link,n=t?me(e.state.selection.$from,t):null;return n?zt(e.view,n.from,n.to):new DOMRect},contextElement:e.view.dom},n);return}this.#p?.hide(),this.#ce()}#ce(){if(!this.#f||!this.#t)return;let{selection:e}=this.#t.state;if(e.empty||e instanceof O){this.#f.hide();return}let t=this.#t;this.#f.syncToSelection({getClientRect:()=>{let{selection:e}=t.state;return e.empty?new DOMRect:zt(t.view,e.from,e.to)},contextElement:t.view.dom})}#le(e){let t=null,n=null;return this.#t?.state.doc.descendants((r,i)=>r.type.name===`vizyBlock`&&r.attrs.blockUid===e?(t=r,n=i,!1):t===null),!t||n===null||!this.#t?null:{node:t,revision:this.#v.get(e)??0,destination:{kind:`root`}}}#ue(){queueMicrotask(()=>{if(!this.#t||this.#t.isDestroyed)return;let e=new Set;this.#t.state.doc.descendants(t=>{t.type.name===`vizyBlock`&&e.add(String(t.attrs.blockUid))}),this.#a.reconcile(e),this.#i.reconcile(e),this.#ee()})}#de(e,t){let n=`#${CSS.escape(t)}`;for(let t of this.#a.roots(e.blockUid)){let e=t.querySelector(n);if(e)return e}return null}#fe(e){for(let t of e.disposals.splice(0))t();e.capturedValues.clear();for(let t of e.response?.fields??[]){let n=this.#de(e,t.wrapperId);if(!n)continue;let r=hd(t.adapterId);e.capturedValues.set(t.fieldLayoutElementUid,r.read(n)),e.disposals.push(r.bind(n,()=>{this.#y&&$(e.capturedValues.get(t.fieldLayoutElementUid))!==$(r.read(n))&&(this.#b=!0,this.#_+=1,this.#pe(e.blockUid),this.#ve(),this.#o?.scheduleRefresh(e.blockUid))}))}}#pe(e){if(!this.#t)return;let t=new Map,n=[];if(this.#t.state.doc.descendants((r,i)=>{if(r.type.name!==`vizyBlock`||e&&r.attrs.blockUid!==e)return;let a=this.#a.get(String(r.attrs.blockUid));if(a?.status!==`mounted`||!a.response)return;let o=structuredClone({...r.attrs.fieldSlots??{}}),s=!1,c=r.attrs.matrixAnchorUid??null;for(let e of a.response.fields){let t=this.#de(a,e.wrapperId);if(!t)continue;let r=e.fieldLayoutElementUid,i=hd(e.adapterId).read(t),l=e.matrixAnchorUid;typeof l==`string`&&l!==``&&l!==c&&(c=l,s=!0),$(a.capturedValues.get(r))!==$(i)&&(n.push({record:a,uid:r,value:i}),$(o[r])!==$(i)&&(o[r]=i,s=!0))}s&&t.set(i,{fieldSlots:o,matrixAnchorUid:c})}),t.size){let e=this.#t.state.tr.setMeta(`addToHistory`,!1);for(let[n,r]of t)e.doc.nodeAt(n)&&(e=e.setNodeAttribute(n,`fieldSlots`,r.fieldSlots).setNodeAttribute(n,`matrixAnchorUid`,r.matrixAnchorUid));this.#t.view.dispatch(e)}for(let{record:e,uid:t,value:r}of n)e.capturedValues.set(t,r)}#me(){this.#t?.state.doc.descendants(e=>{if(e.type.name!==`vizyBlock`)return;let t=this.#a.get(String(e.attrs.blockUid));for(let n of t?.response?.fields??[])n.adapterId===`craft.matrix`&&(n.matrixAnchorUid=e.attrs.matrixAnchorUid||void 0)})}#he(){if(!this.#t||!this.#e)throw Error(`editorNotReady`);return this.#_e(this.#t.getJSON())}#ge(e){let t=this.#e?.storageToken;return $(t?{...e,attrs:{...e.attrs,_storageToken:t}}:e)}#_e(e){if(!this.#e)throw Error(`editorNotReady`);return dy(qd(e),this.#e.manifest)}#ve(){if(!(!this.#r||!this.#t||!this.#y))try{let e=this.#ge(this.#he());if(this.#r.value===e)return;this.#r.value=e,this.#r.dispatchEvent(new Event(`input`,{bubbles:!0})),this.#r.dispatchEvent(new Event(`change`,{bubbles:!0}))}catch{}}#ye(e,t){if(!this.#t)throw Error(`editorNotReady`);return uy(Gd(e,this.#t.schema,{nodes:[...t.enabledNodes,...t.internalNodes],marks:t.enabledMarks}),t)}#be(e){if(!this.#t||!this.#e)return;let t=this.#ye(e,this.#e.manifest);if($(this.#t.getJSON())!==$(t)){this.#I=!0;try{this.#xe(t)}finally{this.#I=!1}}}#xe(e){if(!this.#t)return;let t=this.#t.schema.nodeFromJSON(e),n=ib(this.#t.state.tr,t).setMeta(`vizyAcceptedCanonical`,!0).setMeta(`addToHistory`,!1);n.docChanged&&this.#t.view.dispatch(n)}#Se(){if(!this.#k||!this.#t)return;let e=!1;this.#t.state.doc.descendants(t=>{if(t.type.name===`unsupportedNode`||t.type.name===`unsupportedInlineNode`)return e=!0,!1}),this.#k.hidden=!e}#Ce(e,t){let n=e=>{let t=new Map;return e.descendants(e=>{e.type.name===`vizyBlock`&&t.set(String(e.attrs.blockUid),$(e.toJSON()))}),t},r=n(e),i=n(t);for(let[e,t]of i)r.get(e)!==t&&this.#v.set(e,(this.#v.get(e)??0)+1);for(let e of this.#v.keys())i.has(e)||this.#v.delete(e)}#we(){let e=this.closest(`form`);if(!e||!this.#r)return;let t=this.#r.name,n=t=>{try{let t=this.#De(`save`,this.flush(`submit`));this.#Oe(e,t),this.#Ee()}catch(e){t.preventDefault(),t.stopImmediatePropagation(),this.#Te(e)}},r=e=>{for(let t of[...e.formData.keys()])(t.startsWith(`vizyHost[`)||t.includes(`[vizyHost]`))&&e.formData.delete(t);try{let n=this.flush(`serialize`);e.formData.delete(t),e.formData.append(t,n),this.#Ee()}catch(n){e.formData.delete(t),this.#Te(n)}};e.addEventListener(`submit`,n,!0),e.addEventListener(`formdata`,r),this.#g.push(()=>e.removeEventListener(`submit`,n,!0)),this.#g.push(()=>e.removeEventListener(`formdata`,r)),this.#ae(e,e=>{let n;try{n=this.flush(`autosave`),this.#Ee()}catch(e){throw this.#Te(e),e}let r=this.#De(`autosave`,n);e.data.serialized=kx(e.data.serialized,{fieldName:t,canonical:n,editorId:this.id,metadata:Object.fromEntries(Object.entries(r).map(([e,t])=>[e,String(t)]))})});let i=e=>{let t=e.detail;if(!t||typeof t!=`object`)return;let n=t.vizy?.results;if(Array.isArray(n)){for(let e of n)if(e&&typeof e==`object`&&e.editorId===this.id){let t=Number(e.generation);this.acceptServerResult(e,t)}}};document.addEventListener(`vizy:server-response`,i),this.#g.push(()=>document.removeEventListener(`vizy:server-response`,i))}#Te(e){if(!this.#j)return;let t=`Vizy could not read every Block field, so this entry was not saved. Check the Block errors and try again.`;this.#j.textContent=window.Craft?.t?.(`vizy`,t)??t,this.#j.hidden=!1,this.#j.focus({preventScroll:!0}),console.error(`[Vizy] Submission cancelled because Block fields could not be captured`,e)}#Ee(){this.#j&&(this.#j.hidden=!0,this.#j.textContent=``)}#De(e,t){if(!this.#e)throw Error(`editorNotReady`);let n=`${e}:${this.#_}:${t??$(this.#he())}`;if(e!==`save`&&this.#S?.key===n)return this.#S.metadata;let r=this.beginSubmission(),i={editorId:this.id,fieldUid:this.#e.manifest.field.fieldUid,editorContextToken:this.#e.editorContextToken,generation:r.generation,clientRevision:r.clientRevision,requestKind:e};return this.#S={key:n,metadata:i},i}#Oe(e,t){e.querySelectorAll(`[data-vizy-transport="${CSS.escape(this.id)}"]`).forEach(e=>e.remove());let n=`vizyTransport[${this.id}]`;for(let[r,i]of Object.entries(t)){let t=document.createElement(`input`);t.type=`hidden`,t.name=`${n}[${r}]`,t.value=String(i),t.dataset.vizyTransport=this.id,e.append(t)}}};function Mx(e){return!!e?.enabledMarks?.includes(`link`)}function Nx(e){return!!e?.enabledNodes?.includes(`image`)}function Px(e,t){return!!e?.enabledNodes?.includes(t)}customElements.define(`vizy-editor`,jx);
//# sourceMappingURL=editor-runtime-Ca-uQW6B.js.map