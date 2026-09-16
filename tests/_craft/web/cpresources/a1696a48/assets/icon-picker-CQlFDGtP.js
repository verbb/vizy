import{_ as e,d as t,h as n,l as r,o as i,p as a,s as o,t as s,u as c}from"./class-map-Ba3saTy9.js";import"./popup-BDKhqexm.js";/* empty css               */import{n as l,r as u,t as d}from"./required-validator-CEg8dvjS-BVlj-MQ-.js";var f=e`
    @layer pk-component {
        :host {
            display: inline-block;
            position: relative;
            /* Former lg min-width — default now matches input default chrome. */
            min-width: 6.75rem;
            font-family: var(--pk-font-family);
            vertical-align: middle;
        }

        :host([size='xs']) {
            min-width: 5.5rem;
        }

        :host([size='sm']) {
            min-width: 6.125rem;
        }

        :host([size='lg']),
        :host([size='xl']) {
            min-width: 7.375rem;
        }

        :host([fit-cell]) {
            display: block;
            width: 100%;
            min-width: 0;
            max-width: 100%;
            height: 100%;
        }

        :host([fit-cell]) .root {
            display: block;
            width: 100%;
            height: 100%;
        }

        .root {
            position: relative;
            display: inline-block;
            width: 100%;
        }

        .swatch {
            position: absolute;
            top: 50%;
            left: 0.5rem;
            z-index: 2;
            width: 1.25rem;
            height: 1.25rem;
            transform: translateY(-50%);
            border-radius: var(--pk-radius-sm);
        }

        :host([size='xs']) .swatch {
            left: 0.375rem;
            width: 1rem;
            height: 1rem;
        }

        :host([size='sm']) .swatch {
            left: 0.375rem;
            width: 1.25rem;
            height: 1.25rem;
        }

        :host([size='lg']) .swatch,
        :host([size='xl']) .swatch {
            left: 0.5rem;
            width: 1.5rem;
            height: 1.5rem;
        }

        :host([fit-cell]) .swatch {
            left: 0.5rem;
            width: 1rem;
            height: 1rem;
        }

        .swatch-preview {
            position: absolute;
            inset: 0;
            border-radius: inherit;
            box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.15);
        }

        .swatch-preview.is-transparent {
            background-color: #fff;
            background-image:
                linear-gradient(45deg, #d1d5db 25%, transparent 25%),
                linear-gradient(-45deg, #d1d5db 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #d1d5db 75%),
                linear-gradient(-45deg, transparent 75%, #d1d5db 75%);
            background-size: 8px 8px;
            background-position: 0 0, 0 4px, 4px -4px, -4px 0;
        }

        .swatch-picker {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            border: 0;
            opacity: 0;
            cursor: pointer;
            appearance: none;
        }

        .swatch-picker:disabled {
            cursor: not-allowed;
        }

        .hash {
            position: absolute;
            top: 50%;
            left: 2.125rem;
            z-index: 1;
            transform: translateY(-50%);
            color: var(--pk-color-gray-300);
            font-family: var(--pk-font-family-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace);
            font-size: var(--pk-font-size-mono, 0.9em);
            line-height: var(--pk-line-height-mono, 1.5);
            pointer-events: none;
            user-select: none;
        }

        :host([size='xs']) .hash {
            left: 1.625rem;
        }

        :host([size='sm']) .hash {
            left: 2rem;
        }

        :host([size='lg']) .hash,
        :host([size='xl']) .hash {
            left: 2.5rem;
        }

        :host([fit-cell]) .hash {
            left: 1.75rem;
        }

        .hex-input {
            display: block;
            width: 100%;
            /* Former lg — matches pk-input default chrome (~34px). */
            height: 2.125rem;
            margin: 0;
            padding-inline: 3rem 0.75rem;
            border: var(--pk-input-border);
            border-radius: var(--pk-input-border-radius);
            background: var(--pk-input-bg);
            color: var(--pk-color-gray-700);
            font-family: var(--pk-font-family-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace);
            font-size: var(--pk-font-size-mono, 0.9em);
            line-height: var(--pk-line-height-mono, 1.5);
            outline: none;
            box-sizing: border-box;
            transition: border-color 0.12s ease, box-shadow 0.12s ease;
        }

        :host([size='xs']) .hex-input {
            height: 1.625rem;
            padding-inline: 2.25rem 0.625rem;
        }

        :host([size='sm']) .hex-input {
            height: 1.875rem;
            padding-inline: 2.75rem 0.75rem;
        }

        :host([size='lg']) .hex-input,
        :host([size='xl']) .hex-input {
            height: 2.375rem;
            padding-inline: 3.25rem 0.875rem;
        }

        :host([fit-cell]) .hex-input {
            width: 100%;
            max-width: 100%;
            height: 100%;
            padding-inline: 2.25rem 0.5rem;
            border: 0;
            border-radius: 0;
            background: transparent;
        }

        .hex-input:focus,
        .hex-input:focus-visible {
            border-color: var(--pk-color-sky-600);
            box-shadow: var(--pk-input-focus-shadow);
        }

        :host([invalid]) .hex-input:focus,
        :host([invalid]) .hex-input:focus-visible {
            border-color: var(--pk-color-rose-600);
            box-shadow: var(--pk-input-invalid-focus-shadow);
        }

        :host([fit-cell]:not([invalid])) .hex-input:focus,
        :host([fit-cell]:not([invalid])) .hex-input:focus-visible {
            box-shadow: inset 0 0 0 1px var(--pk-color-gray-200);
        }

        :host([fit-cell][invalid]) .hex-input,
        :host([fit-cell][invalid]) .hex-input:focus,
        :host([fit-cell][invalid]) .hex-input:focus-visible {
            box-shadow: inset 0 0 0 1px var(--pk-color-rose-600);
        }

        .hex-input:disabled {
            cursor: not-allowed;
            opacity: 0.5;
        }

        :host([invalid]) .hex-input {
            border-color: var(--pk-color-rose-600);
        }

        :host([disabled]) .swatch {
            opacity: 0.5;
        }
    }
`,p=`#000000`;function m(e){return String(e||``).replace(/^#/,``).replace(/[^0-9a-fA-F]/g,``).slice(0,6).toLowerCase()}function h(e){return e.length===3||e.length===6}function g(e){return e.length===3?e.split(``).map(e=>`${e}${e}`).join(``):e}function _(e){return e.length===6?`#${e}`:e.length===3?`#${g(e)}`:p}var v=class extends u{constructor(...e){super(...e),this.assumeInteractionOn=[`blur`,`input`],this.size=`default`,this.fitCell=!1,this.readonly=!1,this.invalid=!1,this.value=``,this.defaultValue=``,this.ariaLabel=null,this.hexValue=``}static{this.styles=f}static get validators(){return[...super.validators,l(),d()]}connectedCallback(){super.connectedCallback(),this.syncHexFromValue()}willUpdate(e){e.has(`value`)&&this.syncHexFromValue(),super.willUpdate(e)}syncHexFromValue(){this.hexValue=m(this.value)}get validationTarget(){return this.input}syncFormValue(){let e=this.hexValue?`#${this.hexValue}`:``;this.setFormValue(e,e)}resetToDefaultValue(){this.value=this.defaultValue,this.hexValue=m(this.defaultValue)}restoreFormState(e){typeof e==`string`&&(this.value=e,this.hexValue=m(e))}emitChange(){let e=this.hexValue?`#${this.hexValue}`:``;this.value=e,this.dispatchEvent(new CustomEvent(`pk-change`,{detail:{value:e},bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`input`,{bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0}))}handleHexInput(e){if(this.disabled||this.readonly)return;let t=m(e.target.value);this.hexValue=t,this.emitChange()}handlePickerChange(e){if(this.disabled||this.readonly)return;let t=m(e.target.value);this.hexValue=t,this.emitChange()}render(){let e=_(this.hexValue),t=!h(this.hexValue);return n`
            <div class="root">
                <div part="swatch" class="swatch">
                    <div
                        class=${s({"swatch-preview":!0,"is-transparent":t})}
                        style=${t?a:`background-color: ${e}`}
                    ></div>
                    <input
                        part="picker"
                        class="swatch-picker"
                        type="color"
                        .value=${e}
                        ?disabled=${this.disabled||this.readonly}
                        aria-label="Color picker"
                        @input=${this.handlePickerChange}
                    />
                </div>
                <span class="hash" aria-hidden="true">#</span>
                <input
                    part="input"
                    class="hex-input"
                    type="text"
                    inputmode="text"
                    autocomplete="off"
                    maxlength="6"
                    .value=${this.hexValue}
                    ?disabled=${this.disabled}
                    ?readonly=${this.readonly}
                    ?required=${this.required}
                    aria-label=${this.ariaLabel??a}
                    aria-invalid=${this.invalid?`true`:a}
                    @input=${this.handleHexInput}
                />
            </div>
        `}};i([t({reflect:!0})],v.prototype,`size`,void 0),i([t({type:Boolean,reflect:!0,attribute:`fit-cell`})],v.prototype,`fitCell`,void 0),i([t({type:Boolean,reflect:!0})],v.prototype,`readonly`,void 0),i([t({type:Boolean,reflect:!0})],v.prototype,`invalid`,void 0),i([t()],v.prototype,`value`,void 0),i([t({attribute:`default-value`})],v.prototype,`defaultValue`,void 0),i([t({attribute:`aria-label`})],v.prototype,`ariaLabel`,void 0),i([r(`.hex-input`)],v.prototype,`input`,void 0),i([c()],v.prototype,`hexValue`,void 0),v=i([o(`pk-color-input`)],v);var y=new Map,b=96,x=0;function S(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`)}function C(e,t={}){let n=window.Craft?.t(`vizy`,e,t);return n===void 0?Object.entries(t).reduce((e,[t,n])=>e.replaceAll(`{${t}}`,String(n)),e):n}function w(e){let t=y.get(e)??fetch(e,{headers:{Accept:`application/json`}}).then(e=>{if(!e.ok)throw Error(`Icon request failed: ${e.status}`);return e.json()}).catch(t=>{throw y.delete(e),t});return y.set(e,t),t}var T=class extends HTMLElement{#e=[];#t=``;#n=b;#r=!1;#i=`idle`;#a=``;#o=`icon`;#s=``;#c=null;#l=null;#u=``;#d=`vizy-icon-picker-${++x}`;#f=null;connectedCallback(){this.#a=this.getAttribute(`value`)??``,this.#o=this.getAttribute(`name`)??this.#o,this.#s=this.getAttribute(`data-icons-url`)??``,this.#c=this.getAttribute(`data-initial-svg`),this.#l=this.getAttribute(`data-initial-label`),this.#u=this.getAttribute(`data-labelled-by`)??``,this.render(),this.#a!==``&&this.#c===null&&this.#s!==``&&w(this.#s).then(e=>{this.#e=e,this.#r||this.render()}).catch(()=>{}),document.addEventListener(`click`,this.#h,!0),this.addEventListener(`keydown`,this.#g)}disconnectedCallback(){document.removeEventListener(`click`,this.#h,!0),this.#p()}#p(){this.#f&&=(this.#f.active=!1,this.#f.remove(),null)}#m(){let e=this.querySelector(`[data-icon-trigger]`),t=this.querySelector(`.vizy-icon-picker-panel`);if(!this.#r||!e||!t){this.#p();return}if(!this.#f){let e=document.createElement(`pk-popup`);e.placement=`bottom-start`,e.distance=4,e.positionMethod=`fixed`,document.body.append(e),this.#f=e}this.#f.anchor=e,t.parentElement!==this.#f&&this.#f.replaceChildren(t),this.#f.active=!0}#h=e=>{this.#r&&(e.composedPath().some(e=>e instanceof Element&&(e.closest(`[data-icon-trigger], [data-icon-clear], .vizy-icon-picker-panel`)||e===this.#f||this.#f!=null&&this.#f.contains(e)))||(this.#r=!1,this.render()))};#g=e=>{e.key===`Escape`&&this.#r&&(e.stopPropagation(),this.#r=!1,this.render())};async#_(){if(this.#r=!this.#r,this.#r&&(this.#n=b),this.#r&&this.#e.length===0&&this.#i!==`loading`){this.#i=`loading`,this.render();try{this.#e=await w(this.#s),this.#i=`idle`}catch{this.#i=`error`}}this.render(),this.#r&&this.#y()}#v(){if(!this.#r)return!1;let e=this.#k().querySelector(`[data-icon-search]`);return!e||getComputedStyle(e).visibility===`hidden`?!1:(e.focus({preventScroll:!0}),document.activeElement===e)}async#y(){await this.#b(2e3),!this.#v()&&(await new Promise(e=>requestAnimationFrame(()=>e())),this.#v())}#b(e){return new Promise(t=>{let n=performance.now(),r=()=>{if(!this.#r){t();return}let i=this.#k().querySelector(`[data-icon-search]`);if(i&&getComputedStyle(i).visibility!==`hidden`){t();return}if(performance.now()-n>=e){t();return}requestAnimationFrame(r)};r()})}#x(e){this.#a=e,this.#r=!1,this.#t=``,this.render(),this.dispatchEvent(new CustomEvent(`vizy-icon-change`,{bubbles:!0,detail:{value:e}}))}#S(){if(this.#a===``)return null;for(let e of this.#e){let t=e.icons.find(e=>e.value===this.#a);if(t)return t}return null}#C(){let e=this.#t.trim().toLowerCase();return this.#e.reduce((t,n)=>{let r=e===``?n.icons:n.icons.filter(t=>t.label.toLowerCase().includes(e)||t.value.toLowerCase().includes(e));return r.length===0||t.push({name:n.name,total:r.length,icons:r.slice(0,this.#n)}),t},[])}#w(){return this.#C().some(e=>e.icons.length<e.total)}#T(e){if(!this.#w()||e.scrollTop+e.clientHeight<e.scrollHeight-200)return;let t=e.scrollTop;this.#n+=b,this.#E(),e.scrollTop=t}#E(){let e=this.#k().querySelector(`.vizy-icon-picker-results`);e&&(e.innerHTML=this.#O(),this.#A())}#D(){let e=this.#S();if(e)return`<span class="vizy-icon-picker-glyph">${e.svg}</span><span class="vizy-icon-picker-label">${S(e.label)}</span>`;if(this.#a!==``&&this.#c){let e=this.#l||this.#a,t=this.#l?`vizy-icon-picker-label`:`vizy-icon-picker-label code`;return`<span class="vizy-icon-picker-glyph">${this.#c}</span><span class="${t}">${S(e)}</span>`}return`<span class="vizy-icon-picker-label light">${C(`Choose an icon`)}</span>`}#O(){if(this.#i===`loading`)return`<p class="vizy-icon-picker-notice light">${C(`Loading icons…`)}</p>`;if(this.#i===`error`)return`<p class="vizy-icon-picker-notice error">${C(`Couldn’t load icons.`)}</p>`;let e=this.#C();return e.length===0?`<p class="vizy-icon-picker-notice light">${C(`No icons match your query.`)}</p>`:e.map(e=>`
            <div class="vizy-icon-picker-group">
                <h6 class="vizy-icon-picker-group-heading">
                    ${S(e.name)}
                    ${e.icons.length<e.total?`<span class="light">${C(`Showing {count} of {total}`,{count:e.icons.length,total:e.total})}</span>`:``}
                </h6>
                <div class="vizy-icon-picker-grid">
                    ${e.icons.map(e=>`
                        <button
                            type="button"
                            class="vizy-icon-picker-option"
                            title="${S(e.label)}"
                            aria-label="${S(e.label)}"
                            aria-pressed="${e.value===this.#a?`true`:`false`}"
                            data-icon-value="${S(e.value)}"
                        >${e.svg}</button>
                    `).join(``)}
                </div>
            </div>
        `).join(``)}render(){this.#p(),this.innerHTML=`
            <input type="hidden" name="${S(this.#o)}" value="${S(this.#a)}">
            <div class="vizy-icon-picker">
                <button
                    type="button"
                    class="btn menubtn vizy-icon-picker-trigger"
                    aria-expanded="${this.#r?`true`:`false`}"
                    ${this.#u===``?``:`id="${this.#d}" aria-labelledby="${S(this.#u)} ${this.#d}"`}
                    data-icon-trigger
                >${this.#D()}</button>
                ${this.#a===``?``:`<button type="button" class="delete icon vizy-icon-picker-clear" title="${C(`Clear`)}" aria-label="${C(`Clear`)}" data-icon-clear></button>`}
                ${this.#r?`
                    <div class="vizy-icon-picker-panel">
                        <div class="vizy-icon-picker-search">
                            <input
                                type="text"
                                class="text fullwidth"
                                placeholder="${C(`Search icons`)}"
                                value="${S(this.#t)}"
                                data-icon-search
                            >
                        </div>
                        <div class="vizy-icon-picker-results">${this.#O()}</div>
                    </div>
                `:``}
            </div>
        `,this.querySelector(`[data-icon-trigger]`)?.addEventListener(`click`,()=>{this.#_()}),this.querySelector(`[data-icon-clear]`)?.addEventListener(`click`,()=>{this.#x(``)}),this.#m();let e=this.#k().querySelector(`[data-icon-search]`);e&&e.addEventListener(`input`,()=>{this.#t=e.value,this.#n=b,this.#E()});let t=this.#k().querySelector(`.vizy-icon-picker-results`);t?.addEventListener(`scroll`,()=>this.#T(t)),this.#A()}#k(){return this.#f??this}#A(){this.#k().querySelectorAll(`[data-icon-value]`).forEach(e=>{e.addEventListener(`click`,()=>{this.#x(e.dataset.iconValue??``)})})}};customElements.get(`vizy-icon-picker`)||customElements.define(`vizy-icon-picker`,T);var E=class extends HTMLElement{#e=!1;connectedCallback(){if(this.#e)return;this.#e=!0;let e=this.getAttribute(`name`)??`color`,t=this.getAttribute(`value`)??``,n=this.id||`color`,r=this.getAttribute(`aria-label`)??`Color`;this.removeAttribute(`name`);let i=document.createElement(`input`);i.type=`hidden`,i.name=e,i.value=t,i.id=`${n}-value`;let a=document.createElement(`pk-color-input`);a.setAttribute(`value`,t),a.id=n,a.setAttribute(`aria-label`,r);let o=()=>{i.value=a.value??``};a.addEventListener(`pk-change`,o),a.addEventListener(`change`,o),a.addEventListener(`input`,o),this.append(i,a)}};customElements.get(`vizy-color-input`)||customElements.define(`vizy-color-input`,E);
//# sourceMappingURL=icon-picker-CQlFDGtP.js.map