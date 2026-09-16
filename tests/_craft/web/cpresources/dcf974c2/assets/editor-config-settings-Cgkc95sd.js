import{C as e,F as t,L as n,M as r,N as i,O as a,P as o,R as s,T as c,j as l,t as u,z as d}from"./tooltip-BRQU7O4B.js";import{$t as f,Qt as p,Xt as m,Zt as h,en as g,g as _,in as v,nn as y}from"./floating-ui.dom-BEayZKUV.js";import{t as b}from"./capability-icons-JIPpyATQ.js";var x=`vizy-toolbar-control`,S=class{#e;#t=[];#n=[];#r;constructor(e){this.#r=e,this.#e=new o({plugins:e=>[...e,t.configure({dropAnimation:null})],modifiers:e=>[...e,i.configure({element:()=>this.#r.container})]}),this.#i()}refresh(){this.#a(),this.#r.lists().forEach(e=>{let t=e.dataset.controlList;if(!t)return;let n=e.querySelector(`[data-empty-placeholder]`);n&&this.#t.push(new l({id:`vizy-empty-${t}`,element:n,index:0,group:t,type:x,accept:x,handle:n.querySelector(`[data-no-drag]`)??void 0,data:{listId:t,placeholder:!0}},this.#e)),[...e.querySelectorAll(`[data-control-key]`)].forEach((e,n)=>{let r=e.dataset.controlKey;r&&this.#t.push(new l({id:r,element:e,index:n,group:t,type:x,accept:x,data:{key:r,listId:t}},this.#e))})})}destroy(){this.#n.forEach(e=>e()),this.#n=[],this.#a(),this.#e.destroy()}#i(){this.#n.push(this.#e.monitor.addEventListener(`dragstart`,()=>{this.#r.container.classList.add(`is-sorting`)}),this.#e.monitor.addEventListener(`dragend`,e=>{this.#r.container.classList.remove(`is-sorting`);let{source:t}=e.operation;if(e.canceled||!r(t))return;let{initialIndex:n,index:i,initialGroup:a,group:o}=t.sortable;(n!==i||a!==o)&&typeof o==`string`&&this.#r.onReorder(String(t.id),o,i)}))}#a(){this.#t.forEach(e=>{e.unregister(),e.destroy()}),this.#t=[]}};function C(){return y`
        <svg xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" viewBox="0 0 640 640">
            <path
                fill="currentColor"
                d="M557.5 192L534.9 214.6L278.9 470.6C266.4 483.1 246.1 483.1 233.6 470.6L105.6 342.6L83 320L128.3 274.7C129.6 276 172.3 318.7 256.3 402.7L489.7 169.3L512.3 146.7L557.6 192z"
            />
        </svg>
    `}function w(){return y`
        <svg xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" viewBox="0 0 640 640">
            <path fill="currentColor" d="M96 352V288H544V352H96z" />
        </svg>
    `}var T=[v`
    @layer pk-component {
        .control {
            display: inline-flex;
            flex-shrink: 0;
            align-items: center;
            justify-content: center;
            position: relative;
            box-sizing: border-box;
            width: var(--pk-checkbox-size);
            height: var(--pk-checkbox-size);
            border: 1px solid var(--pk-checkbox-border-color, #c0cbd9);
            border-radius: var(--pk-radius-sm);
            background: var(--pk-color-white);
            cursor: pointer;
            transition: border-color 0.12s ease, box-shadow 0.12s ease;
        }

        :host([disabled]) .control {
            cursor: not-allowed;
        }

        .input:focus-visible + .control {
            border-color: var(--pk-color-sky-600);
            box-shadow: 0 0 0 1px var(--pk-color-sky-600), 0 0 4px 0 hsl(from var(--pk-color-sky-600) h s l / 0.7);
        }

        :host([invalid]) .control,
        .input[aria-invalid='true'] + .control {
            border-color: var(--pk-color-rose-600);
        }

        :host([invalid]) .input:focus-visible + .control,
        .input[aria-invalid='true']:focus-visible + .control {
            border-color: var(--pk-color-rose-600);
            box-shadow: 0 0 0 1px var(--pk-color-rose-600), 0 0 4px 0 hsl(from var(--pk-color-rose-600) h s l / 0.7);
        }

        .indicator {
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--pk-color-gray-900);
        }

        .icon-check,
        .icon-indeterminate {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
        }

        .icon-check svg {
            width: 14px;
            height: 14px;
            transform: translateY(1px) scale(1.2);
        }

        .icon-indeterminate svg {
            width: 12px;
            height: 12px;
        }

        :host([checked]) .icon-check,
        .input:checked + .control .icon-check {
            opacity: 1;
        }

        :host([indeterminate]) .icon-check,
        .input:indeterminate + .control .icon-check {
            opacity: 0;
        }

        :host([indeterminate]) .icon-indeterminate,
        .input:indeterminate + .control .icon-indeterminate {
            opacity: 1;
        }
    }
`,v`
    @layer pk-component {
        :host {
            display: inline-flex;
            vertical-align: middle;
            /* Hit target is the content-sized .root label (Craft checkbox-select), not the host. */
            cursor: default;
            font-family: var(--pk-font-family);
            font-size: var(--pk-font-size-base);
            line-height: var(--pk-line-height);
        }

        :host([disabled]) {
            cursor: not-allowed;
            opacity: 0.5;
        }

        .root {
            display: inline-flex;
            flex-shrink: 0;
            align-items: center;
            justify-content: flex-start;
            gap: var(--pk-control-label-gap);
            /* Content-sized like Craft's <label> beside the checkbox — not full-row. */
            width: fit-content;
            max-width: 100%;
            margin: 0;
            min-height: 0;
            cursor: pointer;
            user-select: none;
            position: relative;
        }

        :host([disabled]) .root {
            cursor: not-allowed;
        }

        .root--with-hint {
            align-items: flex-start;
        }

        .input {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
            opacity: 0;
            appearance: none;
        }

        .text {
            display: flex;
            flex-direction: column;
            gap: 0.125rem;
            min-width: 0;
        }

        .label {
            line-height: max(1rem, var(--pk-checkbox-size));
            /* Match form-control / Craft body labels (gray-700), not gray-900. */
            color: var(--pk-color-gray-700);
            cursor: pointer;
        }

        :host([disabled]) .label {
            cursor: not-allowed;
        }

        :host(.all-option) .label {
            font-weight: 700;
        }

        .hint {
            margin: 0;
            color: var(--pk-color-gray-500);
            font-size: var(--pk-font-size-sm);
            line-height: var(--pk-line-height);
        }

        .hint:empty {
            display: none;
        }
    }
`],E=class extends c{constructor(...t){super(...t),this.assumeInteractionOn=[`change`],this.hasSlotController=new e(this,`hint`),this.checked=!1,this.indeterminate=!1,this.disabled=!1,this.invalid=!1,this.checkboxValue=`on`,this.defaultChecked=!1,this.ariaLabel=null,this.hint=``,this.withHint=!1,this.hasDefaultSlotContent=!1}static{this.shadowRootOptions={mode:`open`,delegatesFocus:!0}}static{this.styles=T}static get validators(){return[...super.validators,u({validationProperty:`checked`})]}get validationTarget(){return this.input}syncFormValue(){this.setFormValue(this.checked?this.checkboxValue:null,this.checked?`on`:`off`)}resetToDefaultValue(){this.checked=this.defaultChecked,this.indeterminate=!1}restoreFormState(e){this.checked=e===`on`||e===this.checkboxValue}updated(e){if(!this.input){super.updated(e);return}(e.has(`indeterminate`)||e.has(`checked`))&&(this.input.indeterminate=this.indeterminate,this.input.checked=this.checked),super.updated(e)}defaultSlotChanged(e){let t=e.target;this.hasDefaultSlotContent=t.assignedNodes({flatten:!0}).some(e=>e.nodeType===Node.TEXT_NODE?e.textContent?.trim():e.nodeType===Node.ELEMENT_NODE)}handleChange(e){let t=e.target;this.checked=t.checked,this.indeterminate=!1,this.dispatchEvent(new CustomEvent(`pk-change`,{detail:{checked:this.checked},bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`input`,{bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0}))}render(){let e=this.hasDefaultSlotContent,t=!!this.hint||this.hasSlotController.test(`hint`,this.withHint);return y`
            <label
                part="base"
                class=${a({root:!0,"root--with-hint":t})}
            >
                <input
                    part="input"
                    class="input"
                    type="checkbox"
                    .checked=${this.checked}
                    ?disabled=${this.disabled}
                    ?required=${this.required}
                    name=${this.name??g}
                    value=${this.checkboxValue}
                    aria-labelledby=${e?`label`:g}
                    aria-describedby=${t?`hint`:g}
                    aria-label=${e?g:this.ariaLabel??g}
                    aria-invalid=${this.invalid?`true`:g}
                    @change=${this.handleChange}
                />
                <span part="control" class="control">
                    <span part="checked-icon" class="icon-check">${C()}</span>
                    <span part="indeterminate-icon" class="icon-indeterminate">${w()}</span>
                </span>
                ${e||t?y`
                        <span class="text">
                            ${e?y`
                                    <span part="label" class="label" id="label">
                                        <slot @slotchange=${this.defaultSlotChanged}></slot>
                                    </span>
                                `:y`<slot @slotchange=${this.defaultSlotChanged} hidden></slot>`}
                            ${t?y`
                                    <span part="hint" class="hint" id="hint">
                                        <slot name="hint">${this.hint}</slot>
                                    </span>
                                `:g}
                        </span>
                    `:y`<slot @slotchange=${this.defaultSlotChanged} hidden></slot>`}
            </label>
        `}};_([h({type:Boolean,reflect:!0})],E.prototype,`checked`,void 0),_([h({type:Boolean,reflect:!0})],E.prototype,`indeterminate`,void 0),_([h({type:Boolean,reflect:!0})],E.prototype,`disabled`,void 0),_([h({type:Boolean,reflect:!0})],E.prototype,`invalid`,void 0),_([h()],E.prototype,`checkboxValue`,void 0),_([h({attribute:`default-checked`,type:Boolean})],E.prototype,`defaultChecked`,void 0),_([h({attribute:`aria-label`})],E.prototype,`ariaLabel`,void 0),_([h()],E.prototype,`hint`,void 0),_([h({type:Boolean,attribute:`with-hint`})],E.prototype,`withHint`,void 0),_([d(`.input`)],E.prototype,`input`,void 0),_([m()],E.prototype,`hasDefaultSlotContent`,void 0),E=_([p(`pk-checkbox`)],E),b();function D(e){return window.Craft?.t(`vizy`,e)??e}function O(e,t){return e===`separator`?`separator@${t}`:e}var k=class extends f{createRenderRoot(){return this}#e={headings:{levels:[2,3,4],defaultLevel:2},toolbar:[],bubble:{enabled:!0,items:[]},allowedExtra:{nodes:[],marks:[]}};#t=[];#n=[];#r=[];#i=`visual`;#a=``;#o=``;#s=!1;connectedCallback(){super.connectedCallback();let e=this.getAttribute(`data-initial`);if(e){let t=JSON.parse(e);this.#e=t.config,this.#t=t.toolbarCatalog,this.#n=t.bubbleCatalog,this.#r=t.allowanceCatalog}this.#s=this.#e.allowedExtra.nodes.length>0||this.#e.allowedExtra.marks.length>0,this.#a=this.#c()}disconnectedCallback(){super.disconnectedCallback(),this.#v?.destroy(),this.#v=null}firstUpdated(){this.#C()}updated(){this.#v?.refresh()}#c(){return JSON.stringify({headings:this.#e.headings,toolbar:this.#e.toolbar,bubble:this.#e.bubble,allowedExtra:this.#e.allowedExtra},null,2)}#l(){try{let e=JSON.parse(this.#a);return this.#e={headings:{levels:[...e.headings?.levels??[2,3,4]],defaultLevel:e.headings?.defaultLevel??2},toolbar:[...e.toolbar??[]],bubble:{enabled:e.bubble?.enabled??!0,items:[...e.bubble?.items??[]]},allowedExtra:{nodes:[...e.allowedExtra?.nodes??[]],marks:[...e.allowedExtra?.marks??[]]}},this.#o=``,!0}catch{return this.#o=D(`Invalid JSON`),!1}}#u(e){e===`visual`&&this.#i===`advanced`&&!this.#l()||(e===`advanced`&&(this.#a=this.#c(),this.#o=``),this.#i=e,this.requestUpdate())}#d(e){return e===`toolbar`||e===`toolbar-tray`?this.#t:this.#n}#f(e){return e===`toolbar`?this.#e.toolbar:this.#e.bubble.items}#p(e,t){return this.#d(t).find(t=>t.id===e)}#m(e){let t=new Set(this.#f(e));return this.#d(e).filter(e=>e.id===`separator`||!t.has(e.id))}#h(){let e=new Set,t=(t,n)=>{let r=this.#p(t,n);if(r){if(r.kind===`presentation`){(r.provides??[]).forEach(t=>e.add(t));return}e.add(`${r.kind}:${r.id}`)}};return this.#e.toolbar.forEach(e=>t(e,`toolbar`)),this.#e.bubble.items.forEach(e=>t(e,`bubble`)),e}#g(){return this.#h().has(`node:heading`)}#_=0;#v=null;applySortResult(e,t,n){if(this.#_+=1,t===`toolbar`||t===`bubble`){this.#y(t,e,n);return}t===`toolbar-tray`&&this.#b(`toolbar`,e),t===`bubble-tray`&&this.#b(`bubble`,e)}#y(e,t,n){let r=[...this.#f(e)],i=r.findIndex((e,n)=>O(e,n)===t),a=i===-1?this.#S(t):r[i];if(!a)return;let o=n;i!==-1&&(r.splice(i,1),i<n&&--o),r.splice(Math.max(0,Math.min(o,r.length)),0,a),this.#x(e,r)}#b(e,t){let n=this.#f(e).filter((e,n)=>O(e,n)!==t);this.#x(e,n)}#x(e,t){e===`toolbar`?this.#e.toolbar=t:this.#e.bubble.items=t,this.requestUpdate()}#S(e){return e.startsWith(`separator@`)?`separator`:e}addItem(e,t){this.#y(e,t,this.#f(e).length)}removeAt(e,t){this.#_+=1;let n=[...this.#f(e)];n.splice(t,1),this.#x(e,n)}toggleHeading(e,t){let n=new Set(this.#e.headings.levels);t?n.add(e):n.delete(e),this.#e.headings.levels=[...n].sort((e,t)=>e-t),this.#e.headings.levels.includes(this.#e.headings.defaultLevel)||(this.#e.headings.defaultLevel=this.#e.headings.levels[0]??2),this.requestUpdate()}toggleAllowance(e,t){let n=e.kind===`mark`?`marks`:`nodes`,r=new Set(this.#e.allowedExtra[n]);t?r.add(e.id):r.delete(e.id),this.#e.allowedExtra[n]=[...r],this.requestUpdate()}#C(){let e=this.querySelector(`.vizy-editor-config`);e&&(this.#v=new S({container:e,lists:()=>[...this.querySelectorAll(`[data-control-list]`)],onReorder:(e,t,n)=>this.applySortResult(e,t,n)}),this.#v.refresh())}#w(e,t,n){let r=O(t,n),i=this.#p(t,e);if(!i)return y`
                <span class="vizy-control is-missing" data-control-key=${r} title=${D(`This item is no longer available.`)}>
                    <span class="vizy-control-label">${t}</span>
                    ${this.#E(e,n,t)}
                </span>
            `;if(i.control===`separator`)return y`
                <span class="vizy-control is-separator" data-control-key=${r} aria-label=${D(`Separator`)}>
                    <span class="vizy-control-divider" aria-hidden="true"></span>
                    ${this.#E(e,n,i.label)}
                </span>
            `;let a=i.control===`dropdown`||i.control===`overflow`,o=[`vizy-control`,a?`is-dropdown`:`is-button`].join(` `);return y`
            <span class=${o} data-control-key=${r}>
                ${i.control===`dropdown`?y`<span class="vizy-control-text">${this.#T(i)}</span>`:i.icon?y`<pk-icon icon=${i.icon} label=${i.label}></pk-icon>`:y`<span class="vizy-control-label">${i.label}</span>`}

                ${a?y`<pk-icon class="vizy-control-caret" icon="chevron-down"></pk-icon>`:g}
                ${this.#E(e,n,i.label)}
            </span>
        `}#T(e){return e.id===`formatting`?D(`Paragraph`):e.label}#E(e,t,n){return y`
            <button
                type="button"
                class="vizy-control-remove"
                aria-label=${`${D(`Remove`)} ${n}`}
                @click=${()=>this.removeAt(e,t)}
            >
                <pk-icon icon="xmark"></pk-icon>
            </button>
        `}#D(e,t){return y`
            <button
                type="button"
                class="vizy-tray-item"
                data-control-key=${t.id}
                @click=${()=>this.addItem(e,t.id)}
            >
                ${t.icon?y`<pk-icon icon=${t.icon}></pk-icon>`:y`<pk-icon icon="plus"></pk-icon>`}
                <span>${t.label}</span>
            </button>
        `}#O(e){let t=this.#m(e),r=new Map;return t.forEach(e=>{let t=r.get(e.group)??[];t.push(e),r.set(e.group,t)}),y`
            <div class="vizy-tray" data-control-list=${`${e}-tray`}>
                ${t.length===0?y`
                        <p class="vizy-tray-empty light" data-empty-placeholder=${`${e}-tray`}>
                            ${D(`Everything available is already in use. Drag an item here to remove it.`)}
                            <span data-no-drag hidden></span>
                        </p>
                    `:n([...r],([e])=>e,([t,r])=>y`
                            <div class="vizy-tray-group">
                                <span class="vizy-tray-group-name">${D(t)}</span>
                                <div class="vizy-tray-items">
                                    ${n(r,e=>e.id,t=>this.#D(e,t))}
                                </div>
                            </div>
                        `)}
            </div>
        `}#k(e){let t=this.#f(e);return s(`${e}:${this.#_}`,y`
            <div class=${`vizy-preview is-${e}`}>
                <div class="vizy-preview-bar" data-control-list=${e} role="toolbar" aria-label=${D(`Preview`)}>
                    ${n(t,(e,t)=>O(e,t),(t,n)=>this.#w(e,t,n))}

                    ${t.length===0?y`
                                <span class="vizy-preview-empty light" data-empty-placeholder=${e}>
                                    ${D(`No items yet.`)}
                                    <span data-no-drag hidden></span>
                                </span>
                            `:g}
                </div>

                ${e===`toolbar`?y`<div class="vizy-preview-canvas" aria-hidden="true">${D(`Content goes here…`)}</div>`:g}
            </div>
        `)}#A(){return y`
            <section class="vizy-section">
                <h3>${D(`Headings`)}</h3>
                <p class="instructions">${D(`Which heading levels the Formatting menu offers.`)}</p>

                <div class="vizy-checkboxes">
                    ${[1,2,3,4,5,6].map(e=>y`
                        <pk-checkbox
                            ?checked=${this.#e.headings.levels.includes(e)}
                            label=${`H${e}`}
                            @pk-change=${t=>{let n=t.target;this.toggleHeading(e,n.checked)}}
                        ></pk-checkbox>
                    `)}
                </div>

                <div class="vizy-default-level">
                    <label for="vizy-default-heading">${D(`Default level`)}</label>
                    <pk-select
                        id="vizy-default-heading"
                        size="sm"
                        .value=${String(this.#e.headings.defaultLevel)}
                        @pk-change=${e=>{let t=e.target;this.#e.headings.defaultLevel=Number(t.value),this.requestUpdate()}}
                    >
                        ${this.#e.headings.levels.map(e=>y`
                            <pk-option value=${String(e)} label=${`H${e}`}>H${e}</pk-option>
                        `)}
                    </pk-select>
                </div>
            </section>
        `}#j(){let e=this.#h(),t=this.#r.filter(t=>!e.has(`${t.kind}:${t.id}`));return y`
            <section class="vizy-section">
                <button
                    type="button"
                    class="vizy-disclosure"
                    aria-expanded=${String(this.#s)}
                    @click=${()=>{this.#s=!this.#s,this.requestUpdate()}}
                >
                    <pk-icon icon=${this.#s?`chevron-down`:`chevron-right`}></pk-icon>
                    <h3>${D(`Allowed without a toolbar button`)}</h3>
                </button>

                ${this.#s?y`
                        <p class="instructions">
                            ${D(`Anything in the toolbar or bubble menu is already permitted in content. Use this only to allow content that has no control — a mark that should survive a paste, for example.`)}
                        </p>

                        ${t.length===0?y`<p class="light">${D(`Every available capability is already in the toolbar or bubble menu.`)}</p>`:y`
                                <div class="vizy-checkboxes">
                                    ${n(t,e=>`${e.kind}:${e.id}`,e=>y`
                                        <pk-checkbox
                                            ?checked=${this.#M(e)}
                                            label=${e.label}
                                            @pk-change=${t=>{let n=t.target;this.toggleAllowance(e,n.checked)}}
                                        ></pk-checkbox>
                                    `)}
                                </div>
                            `}
                    `:g}
            </section>
        `}#M(e){let t=e.kind===`mark`?`marks`:`nodes`;return this.#e.allowedExtra[t].includes(e.id)}render(){return y`
            <div class="vizy-editor-config">
                <div class="vizy-tabs" role="tablist">
                    ${[`visual`,`advanced`].map(e=>y`
                        <button
                            type="button"
                            role="tab"
                            class=${this.#i===e?`active`:``}
                            aria-selected=${String(this.#i===e)}
                            @click=${()=>this.#u(e)}
                        >${D(e===`visual`?`Visual`:`Advanced`)}</button>
                    `)}
                </div>

                ${this.#i===`visual`?this.#N():this.#P()}
            </div>

            ${this.#F()}
        `}#N(){return y`
            <div class="vizy-panel">
                <section class="vizy-section">
                    <h3>${D(`Toolbar`)}</h3>
                    <p class="instructions">
                        ${D(`Drag items into the toolbar, or click to append. Anything you add here is also permitted in content.`)}
                    </p>

                    ${this.#k(`toolbar`)}
                    ${this.#O(`toolbar`)}
                </section>

                ${this.#g()?this.#A():g}

                <section class="vizy-section">
                    <div class="vizy-section-header">
                        <h3>${D(`Bubble Menu`)}</h3>
                        <pk-lightswitch
                            size="sm"
                            ?checked=${this.#e.bubble.enabled}
                            label=${D(`Show a bubble menu over the selection`)}
                            @pk-change=${e=>{let t=e.target;this.#e.bubble.enabled=t.checked,this.requestUpdate()}}
                        ></pk-lightswitch>
                    </div>
                    <p class="instructions">${D(`Shown over a text selection.`)}</p>

                    ${this.#e.bubble.enabled?y`
                            ${this.#k(`bubble`)}
                            ${this.#O(`bubble`)}
                        `:g}
                </section>

                ${this.#j()}
            </div>
        `}#P(){return y`
            <div class="vizy-advanced">
                <label class="vizy-advanced-label" for="vizy-advanced-json">
                    ${D(`Advanced configuration JSON`)}
                </label>
                <textarea
                    id="vizy-advanced-json"
                    class="text code"
                    .value=${this.#a}
                    @input=${e=>{this.#a=e.target.value}}
                ></textarea>
                ${this.#o?y`<p class="error">${this.#o}</p>`:g}
            </div>
        `}#F(){let e=this.#i===`advanced`?this.#a:``;return y`
            <div class="vizy-config-sync" hidden>
                ${this.#e.headings.levels.map(e=>y`
                    <input type="hidden" name="headingLevels[]" value=${String(e)}>
                `)}
                <input type="hidden" name="defaultHeadingLevel" value=${String(this.#e.headings.defaultLevel)}>
                <input type="hidden" name="toolbarJson" .value=${JSON.stringify(this.#e.toolbar)}>
                <input type="hidden" name="bubbleJson" .value=${JSON.stringify(this.#e.bubble)}>
                ${this.#e.allowedExtra.nodes.map(e=>y`
                    <input type="hidden" name="allowedExtraNodes[]" value=${e}>
                `)}
                ${this.#e.allowedExtra.marks.map(e=>y`
                    <input type="hidden" name="allowedExtraMarks[]" value=${e}>
                `)}
                <input type="hidden" name="advancedConfig" .value=${e}>
            </div>
        `}};customElements.get(`vizy-editor-config-settings`)||customElements.define(`vizy-editor-config-settings`,k);
//# sourceMappingURL=editor-config-settings-Cgkc95sd.js.map