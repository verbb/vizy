const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./code-editor-CG4bHcJB.js","./floating-ui.dom-C6Mj1-30.js","./tooltip-BJzvveoH.js","./tooltip-ekR-Z1gs.css","./w3c-keyname-BOAvb0qz.js"])))=>i.map(i=>d[i]);
import{S as e,b as t,g as n,h as r,m as i,v as a}from"./floating-ui.dom-C6Mj1-30.js";import{J as o,S as s,_ as c,b as l,f as u,g as d,h as f,m as p,n as m,y as h}from"./tooltip-BJzvveoH.js";function g(){return t`
        <svg xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" viewBox="0 0 640 640">
            <path
                fill="currentColor"
                d="M557.5 192L534.9 214.6L278.9 470.6C266.4 483.1 246.1 483.1 233.6 470.6L105.6 342.6L83 320L128.3 274.7C129.6 276 172.3 318.7 256.3 402.7L489.7 169.3L512.3 146.7L557.6 192z"
            />
        </svg>
    `}function _(){return t`
        <svg xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" viewBox="0 0 640 640">
            <path fill="currentColor" d="M96 352V288H544V352H96z" />
        </svg>
    `}var v=[e`
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
`,e`
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
`],y=class extends p{constructor(...e){super(...e),this.assumeInteractionOn=[`change`],this.hasSlotController=new u(this,`hint`),this.checked=!1,this.indeterminate=!1,this.disabled=!1,this.invalid=!1,this.checkboxValue=`on`,this.defaultChecked=!1,this.ariaLabel=null,this.hint=``,this.withHint=!1,this.hasDefaultSlotContent=!1}static{this.shadowRootOptions={mode:`open`,delegatesFocus:!0}}static{this.styles=v}static get validators(){return[...super.validators,m({validationProperty:`checked`})]}get validationTarget(){return this.input}syncFormValue(){this.setFormValue(this.checked?this.checkboxValue:null,this.checked?`on`:`off`)}resetToDefaultValue(){this.checked=this.defaultChecked,this.indeterminate=!1}restoreFormState(e){this.checked=e===`on`||e===this.checkboxValue}updated(e){if(!this.input){super.updated(e);return}(e.has(`indeterminate`)||e.has(`checked`))&&(this.input.indeterminate=this.indeterminate,this.input.checked=this.checked),super.updated(e)}defaultSlotChanged(e){let t=e.target;this.hasDefaultSlotContent=t.assignedNodes({flatten:!0}).some(e=>e.nodeType===Node.TEXT_NODE?e.textContent?.trim():e.nodeType===Node.ELEMENT_NODE)}handleChange(e){let t=e.target;this.checked=t.checked,this.indeterminate=!1,this.dispatchEvent(new CustomEvent(`pk-change`,{detail:{checked:this.checked},bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`input`,{bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0}))}render(){let e=this.hasDefaultSlotContent,n=!!this.hint||this.hasSlotController.test(`hint`,this.withHint);return t`
            <label
                part="base"
                class=${f({root:!0,"root--with-hint":n})}
            >
                <input
                    part="input"
                    class="input"
                    type="checkbox"
                    .checked=${this.checked}
                    ?disabled=${this.disabled}
                    ?required=${this.required}
                    name=${this.name??a}
                    value=${this.checkboxValue}
                    aria-labelledby=${e?`label`:a}
                    aria-describedby=${n?`hint`:a}
                    aria-label=${e?a:this.ariaLabel??a}
                    aria-invalid=${this.invalid?`true`:a}
                    @change=${this.handleChange}
                />
                <span part="control" class="control">
                    <span part="checked-icon" class="icon-check">${g()}</span>
                    <span part="indeterminate-icon" class="icon-indeterminate">${_()}</span>
                </span>
                ${e||n?t`
                        <span class="text">
                            ${e?t`
                                    <span part="label" class="label" id="label">
                                        <slot @slotchange=${this.defaultSlotChanged}></slot>
                                    </span>
                                `:t`<slot @slotchange=${this.defaultSlotChanged} hidden></slot>`}
                            ${n?t`
                                    <span part="hint" class="hint" id="hint">
                                        <slot name="hint">${this.hint}</slot>
                                    </span>
                                `:a}
                        </span>
                    `:t`<slot @slotchange=${this.defaultSlotChanged} hidden></slot>`}
            </label>
        `}};c([r({type:Boolean,reflect:!0})],y.prototype,`checked`,void 0),c([r({type:Boolean,reflect:!0})],y.prototype,`indeterminate`,void 0),c([r({type:Boolean,reflect:!0})],y.prototype,`disabled`,void 0),c([r({type:Boolean,reflect:!0})],y.prototype,`invalid`,void 0),c([r()],y.prototype,`checkboxValue`,void 0),c([r({attribute:`default-checked`,type:Boolean})],y.prototype,`defaultChecked`,void 0),c([r({attribute:`aria-label`})],y.prototype,`ariaLabel`,void 0),c([r()],y.prototype,`hint`,void 0),c([r({type:Boolean,attribute:`with-hint`})],y.prototype,`withHint`,void 0),c([o(`.input`)],y.prototype,`input`,void 0),c([i()],y.prototype,`hasDefaultSlotContent`,void 0),y=c([n(`pk-checkbox`)],y);var b=e`
    @layer pk-component {
        :host {
            display: block;
            font-family: var(--pk-font-family);
            font-size: var(--pk-font-size-sm);
            line-height: var(--pk-line-height);
        }

        :host([disabled]) {
            cursor: not-allowed;
            opacity: 0.5;
        }

        .options {
            display: flex;
            flex-direction: column;
            gap: var(--pk-checkbox-select-gap, 0);
        }

        .options--horizontal {
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
            gap: var(--pk-checkbox-select-gap, 0);
        }

        ::slotted(pk-checkbox),
        pk-checkbox {
            display: block;
        }

        .options--horizontal pk-checkbox.all-option {
            width: 100%;
        }
    }
`,x={fromAttribute(e){if(!e)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t.filter(e=>!!(e&&typeof e==`object`&&`value`in e)).map(e=>({label:String(e.label??e.value),value:String(e.value)})):[]}catch{return[]}},toAttribute(e){return JSON.stringify(e??[])}},S={fromAttribute(e){if(e==null||e===``)return[];if(e===`*`)return`*`;try{let t=JSON.parse(e);return t===`*`?`*`:Array.isArray(t)?t.map(String):[]}catch{return[]}},toAttribute(e){return e===`*`?`*`:JSON.stringify(e??[])}},C=class extends d{constructor(...e){super(...e),this.options=[],this.value=[],this.showAllOption=!1,this.allLabel=`All`,this.disabled=!1,this.orientation=`vertical`,this.ariaLabel=null,this.optionElements=[],this.allOptionElement=null,this.handleAllChange=e=>{e.stopPropagation(),this.value=e.detail.checked?`*`:[],this.dispatchValueChange()},this.handleItemChange=(e,t)=>{if(t.stopPropagation(),this.isAllSelected)return;let n=t.detail.checked,r=this.selectedValues;this.value=n?[...r,e]:r.filter(t=>t!==e),this.dispatchValueChange()}}static{this.styles=b}connectedCallback(){this.hasAttribute(`role`)||this.setAttribute(`role`,`group`),super.connectedCallback()}updated(e){if(e.has(`options`)||e.has(`showAllOption`)){this.rebuildOptionElements();return}(e.has(`value`)||e.has(`disabled`))&&this.updateOptionStates()}firstUpdated(){this.rebuildOptionElements()}focus(e){this.optionElements.find(e=>!e.disabled)?.focus(e)}get isAllSelected(){return this.value===`*`}get selectedValues(){return this.isAllSelected?this.options.map(e=>e.value):Array.isArray(this.value)?this.value:[]}dispatchValueChange(){let e=this.isAllSelected?`*`:[...this.selectedValues];this.dispatchEvent(new CustomEvent(`pk-change`,{detail:{value:e},bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0}))}rebuildOptionElements(){let e=this.shadowRoot?.querySelector(`.options`);if(e){for(let e of this.optionElements)e.remove();if(this.optionElements=[],this.allOptionElement=null,this.showAllOption){let t=document.createElement(`pk-checkbox`);t.classList.add(`all-option`),t.append(this.allLabel),t.addEventListener(`pk-change`,this.handleAllChange),e.append(t),this.allOptionElement=t,this.optionElements.push(t)}for(let t of this.options){let n=document.createElement(`pk-checkbox`);n.checkboxValue=t.value,n.append(t.label),n.addEventListener(`pk-change`,e=>{this.handleItemChange(t.value,e)}),e.append(n),this.optionElements.push(n)}this.updateOptionStates()}}updateOptionStates(){this.allOptionElement&&(this.allOptionElement.checked=this.isAllSelected,this.allOptionElement.disabled=this.disabled);for(let e of this.options){let t=this.optionElements.find(t=>t!==this.allOptionElement&&t.checkboxValue===e.value);t&&(t.checked=this.isAllSelected||this.selectedValues.includes(e.value),t.disabled=this.disabled||this.isAllSelected)}}render(){return t`
            <div
                part="base"
                class=${f({options:!0,"options--horizontal":this.orientation===`horizontal`})}
            ></div>
        `}};c([r({attribute:`options`,converter:x})],C.prototype,`options`,void 0),c([r({attribute:`value`,converter:S})],C.prototype,`value`,void 0),c([r({type:Boolean,attribute:`show-all-option`})],C.prototype,`showAllOption`,void 0),c([r({attribute:`all-label`})],C.prototype,`allLabel`,void 0),c([r({type:Boolean,reflect:!0})],C.prototype,`disabled`,void 0),c([r({reflect:!0})],C.prototype,`orientation`,void 0),c([r({attribute:`aria-label`})],C.prototype,`ariaLabel`,void 0),c([i()],C.prototype,`optionElements`,void 0),C=c([n(`pk-checkbox-select`)],C);var w=class e{#e;#t=[];#n=[];#r;#i={x:0,y:0};#a=null;#o=null;#s=null;#c=null;#l=0;#u=null;#d=!1;#f={x:0,y:0};static#p=10;constructor(e){this.#r=e,this.#e=new h({plugins:e=>[...e,s.configure({dropAnimation:null})]}),this.#L()}refresh(){this.#H(),this.#m(this.#r.availableList(),`available`),this.#m(this.#r.activeList(),`active`)}destroy(){this.#n.forEach(e=>e()),this.#n=[],this.#I(),this.#H(),this.#e.destroy()}#m(e,t){e&&this.#h(e).forEach((e,n)=>{let r=e.dataset.toolbarItem;r&&this.#t.push(new l({id:`${this.#r.type}-${t}-${n}-${r}`,element:e,type:this.#r.type,data:{itemId:r,list:t,index:n,repeatable:e.hasAttribute(`data-toolbar-repeatable`)}},this.#e))})}#h(e){return[...e.querySelectorAll(`[data-toolbar-item]`)]}#g=[];#_=[];#v(){let e=this.#r.activeList(),t=this.#o;if(!e)return;let n=e.getBoundingClientRect();this.#_=[],this.#g=this.#h(e).map((e,t)=>({peer:e,index:t})).filter(({peer:e})=>e!==t).map(({peer:e,index:t})=>{let r=e.getBoundingClientRect(),i=r.top-n.top,a=r.bottom-n.top,o=this.#_.at(-1);return!o||Math.abs(o.top-i)>1?this.#_.push({top:i,bottom:a}):o.bottom=Math.max(o.bottom,a),{row:this.#_.length-1,middle:r.left+r.width/2-n.left,left:r.left-n.left,right:r.right-n.left,index:t,combinable:e.hasAttribute(`data-toolbar-combinable`),element:e}})}#y(e){let t=0,n=1/0;return this.#_.forEach((r,i)=>{let a=e<r.top?r.top-e:Math.max(0,e-r.bottom);a<n&&(n=a,t=i)}),t}#b(){let e=this.#r.activeList();if(!e)return 0;let t=e.getBoundingClientRect(),n=this.#i.x-t.left,r=this.#y(this.#i.y-t.top),i=0;for(let e of this.#g){if(!(e.row<r||!(e.row>r)&&n>e.middle))break;i+=1}return i}static#x=.5;#S(){if(!this.#C())return null;let t=this.#r.activeList();if(!t)return null;let n=t.getBoundingClientRect(),r=this.#i.x-n.left,i=this.#y(this.#i.y-n.top);for(let t of this.#g){if(!t.combinable||t.row!==i)continue;let n=(t.right-t.left)*(1-e.#x)/2;if(r>=t.left+n&&r<=t.right-n)return{index:t.index,element:t.element}}return null}#C(){return!!this.#o?.hasAttribute(`data-toolbar-groupable`)}#w(){if(this.#c)return this.#c;let e=this.#o.cloneNode(!0);return e.removeAttribute(`id`),e.removeAttribute(`data-toolbar-item`),e.removeAttribute(`aria-label`),e.removeAttribute(`aria-describedby`),e.setAttribute(`aria-hidden`,`true`),e.classList.add(`is-slot`),this.#c=e,e}#T(){let e=this.#r.activeList();if(!e||!this.#o)return;let t=this.#b();this.#l=t;let n=this.#h(e).filter(e=>e!==this.#o)[t]??e.querySelector(`[data-builder-tail]`),r=this.#w();(r.parentElement!==e||r.nextElementSibling!==n)&&e.insertBefore(r,n??null)}#E(){this.#c?.remove()}#D(){if(!this.#o)return;if(!this.#N(this.#i.x,this.#i.y)){this.#E(),this.#k();return}let e=this.#S();if(e){this.#E(),this.#O(e);return}this.#k(),this.#T()}#O(e){this.#u?.element!==e.element&&(this.#k(),e.element.classList.add(`is-combine-target`),this.#u=e)}#k(){this.#u?.element.classList.remove(`is-combine-target`),this.#u=null}#A(){return!!this.#c?.isConnected}#j(){let e=this.#o;if(!e||this.#M())return;e.classList.add(`is-lifted`);let t=e.parentElement,n=t&&parseFloat(getComputedStyle(t).columnGap)||0;e.style.marginInlineEnd=`-${e.getBoundingClientRect().width+n}px`}#M(){return!!this.#s?.repeatable&&this.#s.list===`available`}#N(e,t){let n=this.#r.activeList();if(!n)return!1;let r=n.getBoundingClientRect();return e>=r.left&&e<=r.right&&t>=r.top&&t<=r.bottom}#P(t){let n=this.#F();if(!n)return;let r=t.cloneNode(!0);r.removeAttribute(`id`),r.removeAttribute(`aria-describedby`),r.removeAttribute(`aria-roledescription`),r.setAttribute(`aria-hidden`,`true`),r.classList.add(`is-drag-helper`);let i=t.getBoundingClientRect(),a=this.#f.x-i.left+e.#p,o=this.#f.y-i.top+e.#p;r.style.setProperty(`transform`,`translate(${a}px, ${o}px)`,`important`),document.body.appendChild(r),this.#a=r,n.overlay=r}#F(){return this.#e.plugins.find(e=>e instanceof s)}#I(){let e=this.#F();e&&(e.overlay=void 0),this.#a?.remove(),this.#a=null}#L(){let e=e=>{this.#i={x:e.clientX,y:e.clientY},this.#D()},t=e=>{this.#f={x:e.clientX,y:e.clientY},this.#i={x:e.clientX,y:e.clientY},this.#d=!1},n=e=>{this.#d&&(this.#d=!1,e.preventDefault(),e.stopPropagation())};document.addEventListener(`pointerdown`,t,!0),document.addEventListener(`pointermove`,e,!0),document.addEventListener(`click`,n,!0),this.#n.push(()=>{document.removeEventListener(`pointerdown`,t,!0),document.removeEventListener(`pointermove`,e,!0),document.removeEventListener(`click`,n,!0)}),this.#n.push(this.#e.monitor.addEventListener(`beforedragstart`,e=>{let{source:t}=e.operation;t?.element instanceof HTMLElement&&this.#P(t.element)}),this.#e.monitor.addEventListener(`dragstart`,e=>{this.#r.container()?.classList.add(`is-sorting`);let{source:t}=e.operation;t?.element instanceof HTMLElement&&(this.#o=t.element,this.#s=t.data,this.#d=!0,this.#B(),this.#j(),this.#v(),this.#D())}),this.#e.monitor.addEventListener(`dragend`,e=>{let t=this.#s,n=this.#A(),r=this.#l,i=this.#u?.index??null;if(this.#R(),!t?.itemId||e.canceled){this.#z(this.#r.onRevert);return}if(i!==null){this.#z(()=>this.#r.onDrop({itemId:t.itemId,from:t.list,to:`combine`,fromIndex:t.index,index:i}));return}if(!n){if(t.list!==`active`){this.#z(this.#r.onRevert);return}this.#z(()=>this.#r.onDrop({itemId:t.itemId,from:`active`,to:`available`,fromIndex:t.index,index:t.index}));return}if(t.list===`active`&&r===t.index){this.#z(this.#r.onRevert);return}this.#z(()=>this.#r.onDrop({itemId:t.itemId,from:t.list,to:`active`,fromIndex:t.index,index:r}))}))}#R(){let e=this.#r.container();e?.classList.remove(`is-sorting`),e?.querySelectorAll(`.is-lifted`).forEach(e=>{e.classList.remove(`is-lifted`),e.style.marginInlineEnd=``}),this.#E(),this.#k(),e?.querySelectorAll(`.is-combine-target`).forEach(e=>e.classList.remove(`is-combine-target`)),this.#c=null,this.#o=null,this.#s=null,this.#g=[],this.#_=[],this.#V(),this.#I()}#z(e){requestAnimationFrame(()=>e())}#B(){let e=this.#r.availableList();e&&(e.style.minHeight=`${e.getBoundingClientRect().height}px`)}#V(){let e=this.#r.availableList();e&&(e.style.minHeight=``)}#H(){this.#t.forEach(e=>{e.unregister(),e.destroy()}),this.#t=[]}},T=`group:`,E=`group:group:`;function D(e){return typeof e==`string`?e:e.preset?`${T}${e.preset}`:`${E}${(e.items??[]).join(`-`)}`}function O(e){return e.startsWith(E)}function k(e,t,n){return n!==void 0&&n>=0&&n<e.length&&D(e[n])===t?n:e.findIndex(e=>D(e)===t)}function A(e){return e!==`separator`&&!e.startsWith(T)}function j(e,t){let n=e[t.index];if(n===void 0||!A(t.itemId))return null;let r;if(typeof n==`string`){if(n===t.itemId||!A(n))return null;r={items:[n,t.itemId]}}else{if(n.preset)return null;let e=n.items??[];if(e.includes(t.itemId))return null;r={...n,items:[...e,t.itemId]}}let i=[...e];if(i[t.index]=r,t.from===`active`){let e=k(i,t.itemId,t.fromIndex);e!==-1&&e!==t.index&&i.splice(e,1)}return i}var M=`modulepreload`,N=function(e,t){return new URL(e,t).href},P={},F=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}function s(e){return import.meta.resolve?import.meta.resolve(e):new URL(e,import.meta.url).href}r=o(t.map(t=>{if(t=N(t,n),t=s(t),t in P)return;P[t]=!0;let r=t.endsWith(`.css`);for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}let i=document.createElement(`link`);if(i.rel=r?`stylesheet`:M,r||(i.as=`script`),i.crossOrigin=``,i.href=t,a&&i.setAttribute(`nonce`,a),document.head.appendChild(i),r)return new Promise((e,n)=>{i.addEventListener(`load`,e),i.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})};function I(e){return e.kind===`mark`||e.kind===`node`}function L(e){return I(e)||O(e.id)}var R=[1,2,3,4,5,6],z=[2,3,4];function B(e,t){return window.Craft?.t(e,t)??t}function V(e){return e.replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e])}var H=class extends HTMLElement{#e={vocabulary:{nodes:[],marks:[]},headings:{levels:[...z],defaultLevel:z[0]},toolbar:[],bubble:{enabled:!0,items:[]}};#t=[];#n=[];#r={nodes:[],marks:[],headingAvailable:!1};#i=`visual`;#a=!1;#o=``;#s=``;#c=null;#l=new Map;#u;#d=0;connectedCallback(){this.#c=this.querySelector(`[data-vizy-config-sync]`),this.#K();let e=this.getAttribute(`data-initial`);if(e){let t=JSON.parse(e);this.#e=t.config,this.#w(),this.#t=t.toolbarCatalog,this.#n=t.bubbleCatalog,this.#r=t.contentCatalog}this.#o=this.#f();let t=this.closest(`form`);t&&!t.dataset.vizyConfigBound&&(t.dataset.vizyConfigBound=`1`,t.addEventListener(`submit`,()=>{this.#i===`advanced`&&this.#p(),this.#B()})),this.render()}disconnectedCallback(){this.#l.forEach(e=>e.destroy()),this.#l.clear()}#f(){return JSON.stringify({vocabulary:this.#e.vocabulary,headings:this.#e.headings,toolbar:this.#e.toolbar,bubble:this.#e.bubble},null,2)}#p(){try{let e=JSON.parse(this.#o);return this.#e={vocabulary:{nodes:[...e.vocabulary?.nodes??[]],marks:[...e.vocabulary?.marks??[]]},headings:{levels:[...e.headings?.levels??z],defaultLevel:e.headings?.defaultLevel??2},toolbar:[...e.toolbar??[]],bubble:{enabled:e.bubble?.enabled??!0,items:[...e.bubble?.items??[]]}},this.#w(),this.#s=``,!0}catch{return this.#s=B(`vizy`,`Invalid JSON`),!1}}#m(e,t){return t.find(t=>t.id===e)}#h(e){if(typeof e==`string`)return this.#m(e,this.#t);let t=D(e);if(e.preset){let n=this.#m(e.preset,this.#t);return n?{...n,id:t,label:e.label??n.label}:void 0}let n=(e.items??[]).map(e=>this.#m(e,this.#t));return{id:t,label:e.label??n.map((t,n)=>t?.label??(e.items??[])[n]).join(`, `),kind:`group`,group:`Dropdowns`,icon:n[0]?.icon??null}}#g(){let e=new Set(this.#e.toolbar.map(e=>D(e)));return this.#t.filter(t=>{let n=D(this.#N(t));if(e.has(n)&&!this.#D(t.id))return!1;if(t.kind===`presentation`)return!0;if(t.kind===`group`){let e=t.requires??[];return e.length===0||e.some(e=>this.#e.vocabulary.nodes.includes(e))}return t.kind===`mark`?this.#e.vocabulary.marks.includes(t.id):t.kind===`node`&&this.#e.vocabulary.nodes.includes(t.id)}).sort((e,t)=>Number(this.#D(e.id))-Number(this.#D(t.id)))}#_(){let e=new Set(this.#e.bubble.items);return this.#n.filter(t=>!e.has(t.id)&&this.#e.vocabulary.marks.includes(t.id))}#v(e){if(e===`visual`&&this.#i===`advanced`&&!this.#p()){this.render();return}e===`advanced`&&(this.#o=this.#f(),this.#s=``,this.#y()),this.#i=e,this.render()}async#y(){this.#a||(await F(()=>import(`./code-editor-CG4bHcJB.js`),__vite__mapDeps([0,1,2,3,4]),import.meta.url),this.#a=!0,this.#i===`advanced`&&this.render())}#b(e,t,n){let r=new Set(this.#e.vocabulary[e]);n?r.add(t):r.delete(t),this.#e.vocabulary[e]=[...r],this.#S()}#x(e,t,n){let r=this.#e.vocabulary[e].filter(e=>!n.includes(e));this.#e.vocabulary[e]=[...new Set([...r,...t])],this.#S()}#S(){this.#e.toolbar=this.#e.toolbar.flatMap(e=>{if(typeof e!=`string`)return this.#j(e);let t=this.#m(e,this.#t);return!t||t.kind===`presentation`?[e]:t.kind===`mark`?this.#k(e)?[e]:[]:t.kind===`node`&&this.#A(e)?[e]:[]}),this.#e.bubble.items=this.#e.bubble.items.filter(e=>this.#e.vocabulary.marks.includes(e)),this.render()}#C(e,t,n){let r=t.length>0&&t.every(e=>n.includes(e.value))?`*`:JSON.stringify(n);return`
            <pk-checkbox-select
                data-vocab-group="${V(e)}"
                show-all-option
                all-label="${V(B(`vizy`,`All`))}"
                orientation="horizontal"
                options="${V(JSON.stringify(t))}"
                value="${V(r)}"
            ></pk-checkbox-select>
        `}#w(){this.#e.vocabulary.nodes.includes(`heading`)||(this.#e.headings.levels=[])}#T(){return this.#e.headings.levels.length>0}#E(e){this.#e.headings.levels=[...e].sort((e,t)=>e-t),this.#e.headings.levels.includes(this.#e.headings.defaultLevel)||(this.#e.headings.defaultLevel=this.#e.headings.levels[0]??2),this.#b(`nodes`,`heading`,this.#T())}#D(e){return e===`separator`}#O(e,t){return k(this.#e.toolbar,e,t)}#k(e){return this.#e.vocabulary.marks.includes(e)}#A(e){return this.#e.vocabulary.nodes.includes(e)}#j(e){if(e.preset){let t=this.#m(e.preset,this.#t)?.requires??[];return t.length===0||t.some(e=>this.#A(e))?[e]:[]}let t=(e.items??[]).filter(e=>this.#k(e)||this.#A(e));return t.length?[{...e,items:t}]:[]}#M(e){let t=j(this.#e.toolbar,{itemId:e.itemId,from:e.from,fromIndex:e.fromIndex,index:e.index});t&&(this.#e.toolbar=t),this.render()}#N(e){return e.preset?{preset:e.preset}:e.id}#P(e,t){let n=this.#m(e,this.#t),r=n?this.#N(n):e,i=D(r);!this.#D(e)&&this.#O(i)!==-1||(t===void 0?this.#e.toolbar.push(r):this.#e.toolbar.splice(t,0,r),this.render())}#F(e,t){let n=this.#O(e,t);n!==-1&&(this.#e.toolbar.splice(n,1),this.render())}#I(e,t){this.#e.bubble.items.includes(e)||(t===void 0?this.#e.bubble.items.push(e):this.#e.bubble.items.splice(t,0,e),this.render())}#L(e){this.#e.bubble.items=this.#e.bubble.items.filter(t=>t!==e),this.render()}#R(e,t,n){let r=e===`toolbar`?this.#e.toolbar:this.#e.bubble.items;if(t<0||n<0||t>=r.length||n>=r.length)return;let[i]=r.splice(t,1);r.splice(n,0,i),this.render()}#z(e,t){if(t.to===`combine`){e===`toolbar`?this.#M(t):this.render();return}if(t.to===`available`){if(t.from!==`active`)return;e===`toolbar`?this.#F(t.itemId,t.fromIndex):this.#L(t.itemId);return}if(t.from===`available`){e===`toolbar`?this.#P(t.itemId,t.index):this.#I(t.itemId,t.index);return}this.#R(e,t.fromIndex,t.index)}#B(){if(!this.#c)return;this.#c.replaceChildren();let e=(e,t)=>{let n=document.createElement(`input`);n.type=`hidden`,n.name=e,n.value=t,this.#c?.append(n)};this.#e.vocabulary.nodes.forEach(t=>e(`vocabularyNodes[]`,t)),this.#e.vocabulary.marks.forEach(t=>e(`vocabularyMarks[]`,t)),this.#e.headings.levels.forEach(t=>e(`headingLevels[]`,String(t))),e(`defaultHeadingLevel`,String(this.#e.headings.defaultLevel)),e(`toolbarJson`,JSON.stringify(this.#e.toolbar)),e(`bubbleJson`,JSON.stringify(this.#e.bubble)),e(`advancedConfig`,this.#f())}#V(e){return e.icon?e.icon:`<span class="vizy-control-text">${V(e.label)}</span>`}#H(e,t,n){return`
            <button
                type="button"
                class="${[`vizy-control`,e.id===`separator`?`is-separator`:``,e.icon||e.id===`separator`?``:`is-text`,e.kind===`group`?`has-menu`:``,n===`available`?`is-available`:``].filter(Boolean).join(` `)}"
                aria-label="${V(e.label)}"
                data-toolbar-item="${V(e.id)}"
                data-toolbar-list="${t}"
                data-toolbar-variant="${n}"
                ${this.#D(e.id)?`data-toolbar-repeatable`:``}
                ${t===`toolbar`&&I(e)?`data-toolbar-groupable`:``}
                ${t===`toolbar`&&n===`active`&&L(e)?`data-toolbar-combinable`:``}
            >${e.id===`separator`?``:this.#V(e)}${e.kind===`group`?`<span class="vizy-control-chevron" aria-hidden="true"></span>`:``}</button>
        `}#U(e){return`
            <span class="vizy-editor-config-empty" data-empty-placeholder>
                ${V(e)}
            </span>
        `}#W(){return`<span class="vizy-editor-config-tail" data-builder-tail></span>`}#G(e,t,n=!0){let r=e||this.#U(t);return n?r+this.#W():r}#K(){let e=document.createElement(`pk-tooltip`);e.setAttribute(`trigger`,`manual`),e.setAttribute(`placement`,`top`),this.appendChild(e),this.#u=e;let t=e=>e instanceof Element?e.closest(`.vizy-control`):null,n=n=>{let r=t(n.target),i=r?.getAttribute(`aria-label`);if(!r||!i||r.closest(`.is-sorting`)||r.hasAttribute(`data-dnd-placeholder`)){e.hide();return}r.id||=`vizy-control-${++this.#d}`,e.for=r.id,e.content=i,e.show()},r=()=>{e.hide()};this.addEventListener(`pointerover`,n),this.addEventListener(`focusin`,n),this.addEventListener(`pointerout`,r),this.addEventListener(`focusout`,r),this.addEventListener(`pointerdown`,r)}#q(e){e.querySelectorAll(`[data-toolbar-item]`).forEach((e,t)=>{e.onclick=()=>{let n=e.dataset.toolbarItem,r=e.dataset.toolbarList;if(!n||!r)return;if(e.dataset.toolbarVariant===`available`){r===`toolbar`?this.#P(n):this.#I(n);return}let i=[...e.parentElement?.children??[]].indexOf(e);r===`toolbar`?this.#F(n,i===-1?t:i):this.#L(n)}})}#J(e){[`toolbar`,`bubble`].forEach(t=>{let n=()=>e.querySelector(`[data-builder="${t}"]`);if(!n()){this.#l.get(t)?.destroy(),this.#l.delete(t);return}let r=this.#l.get(t);r||(r=new w({container:n,type:`vizy-${t}-control`,availableList:()=>e.querySelector(`[data-builder-list="${t}-available"]`),activeList:()=>e.querySelector(`[data-builder-list="${t}-active"]`),onDrop:e=>this.#z(t,e),onRevert:()=>this.render()}),this.#l.set(t,r)),r.refresh()})}render(){let e=this.querySelector(`[data-vizy-config-host]`);if(!e)return;let t=this.#e.toolbar.map(e=>{let t=this.#h(e);return t?this.#H(t,`toolbar`,`active`):``}).join(``),n=this.#e.bubble.items.map(e=>{let t=this.#m(e,this.#n);return t?this.#H(t,`bubble`,`active`):``}).join(``);e.innerHTML=`
            <div class="vizy-editor-config">
                <div class="vizy-editor-config-tabs">
                    <button type="button" class="${this.#i===`visual`?`active`:``}" data-mode="visual">${B(`vizy`,`Visual`)}</button>
                    <button type="button" class="${this.#i===`advanced`?`active`:``}" data-mode="advanced">${B(`vizy`,`Advanced`)}</button>
                </div>

                ${this.#i===`visual`?`
                    <div class="vizy-editor-config-panel">
                        <section class="vizy-editor-config-section">
                            <h3>${B(`vizy`,`Allowed Content`)}</h3>
                            <p class="instructions">${B(`vizy`,`What this editor is allowed to understand. This governs pasted and imported content as well as the toolbar, so a capability can be allowed without being given a button.`)}</p>

                            <div class="vizy-editor-config-subhead">${B(`vizy`,`Blocks and objects`)}</div>
                            ${this.#C(`nodes`,this.#r.nodes,this.#e.vocabulary.nodes)}

                            <div class="vizy-editor-config-subhead">${B(`vizy`,`Inline formatting`)}</div>
                            ${this.#C(`marks`,this.#r.marks,this.#e.vocabulary.marks)}
                        </section>

                        ${this.#r.headingAvailable?`
                            <section class="vizy-editor-config-section">
                                <h3>${B(`vizy`,`Headings`)}</h3>
                                <!--
                                    No separate "Allow headings" switch. The levels are
                                    the setting: choosing none is how you disallow
                                    headings, which the checkbox select already says
                                    plainly. Two controls for one decision meant the
                                    switch could be on with no levels ticked, a state
                                    that had to be papered over by seeding defaults.
                                -->
                                ${this.#C(`headings`,R.map(e=>({label:`H${e}`,value:String(e)})),this.#e.headings.levels.map(String))}
                                ${this.#T()?`
                                    <label class="vizy-editor-config-default-heading">
                                        ${B(`vizy`,`Default level`)}
                                        <select data-default-heading>
                                            ${this.#e.headings.levels.map(e=>`
                                                <option value="${e}" ${this.#e.headings.defaultLevel===e?`selected`:``}>H${e}</option>
                                            `).join(``)}
                                        </select>
                                    </label>
                                `:``}
                            </section>
                        `:``}

                        <section class="vizy-editor-config-section">
                            <h3>${B(`vizy`,`Toolbar`)}</h3>
                            <p class="instructions">${B(`vizy`,`Drag items into the toolbar below. Drag an item out of the toolbar to remove it.`)}</p>
                            <div class="vizy-editor-config-builder" data-builder="toolbar">
                                <div class="vizy-editor-config-group">
                                    <h4 class="vizy-editor-config-subhead">${B(`vizy`,`Available buttons`)}</h4>
                                    <div class="vizy-editor-config-available" data-builder-list="toolbar-available">
                                        ${this.#G(this.#g().map(e=>this.#H(e,`toolbar`,`available`)).join(``),B(`vizy`,`Everything is in the toolbar.`),!1)}
                                    </div>
                                </div>
                                <div class="vizy-editor-config-group is-preview">
                                    <h4 class="vizy-editor-config-subhead">${B(`vizy`,`Toolbar preview`)}</h4>
                                    <!--
                                        Toolbar plus a stub of editor body, so the
                                        strip reads as the top of an editor rather
                                        than a row of chips. The stub is decoration
                                        only: it reads as the editor's content, so it
                                        is deliberately outside the drop zone and
                                        offers no landing place.
                                    -->
                                    <div class="vizy-editor-config-editor">
                                        <div class="vizy-editor-config-active" data-builder-list="toolbar-active">
                                            ${this.#G(t,B(`vizy`,`Drag items here.`))}
                                        </div>
                                        <div class="vizy-editor-config-canvas" aria-hidden="true"></div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section class="vizy-editor-config-section">
                            <h3>${B(`vizy`,`Bubble Menu`)}</h3>
                            <!--
                                A lightswitch rather than a checkbox, because this
                                switches a whole feature on and off rather than ticking
                                one of a set — the same distinction Craft draws in its
                                own settings screens.

                                The label goes in the attribute, not the default slot.
                                The component decides whether to render a label by
                                looking for that slot in its own shadow root, which it
                                only puts there once it has decided to — so slotted text
                                never resolves and the switch comes out unlabelled.
                            -->
                            <pk-lightswitch
                                class="vizy-editor-config-toggle"
                                data-bubble-enabled
                                label="${V(B(`vizy`,`Show a Bubble Menu on selection`))}"
                                ${this.#e.bubble.enabled?`checked`:``}
                            ></pk-lightswitch>
                            ${this.#e.bubble.enabled?`
                                <div class="vizy-editor-config-builder" data-builder="bubble">
                                    <div class="vizy-editor-config-group">
                                        <h4 class="vizy-editor-config-subhead">${B(`vizy`,`Available buttons`)}</h4>
                                        <div class="vizy-editor-config-available" data-builder-list="bubble-available">
                                            ${this.#G(this.#_().map(e=>this.#H(e,`bubble`,`available`)).join(``),B(`vizy`,`Everything is in the Bubble Menu.`),!1)}
                                        </div>
                                    </div>
                                    <div class="vizy-editor-config-group">
                                        <h4 class="vizy-editor-config-subhead">${B(`vizy`,`Bubble Menu preview`)}</h4>
                                        <div class="vizy-editor-config-active is-bubble" data-builder-list="bubble-active">
                                            ${this.#G(n,B(`vizy`,`Drag items here.`))}
                                        </div>
                                    </div>
                                </div>
                            `:``}
                        </section>
                    </div>
                `:`
                    <div class="vizy-editor-config-advanced">
                        <span class="vizy-editor-config-strip-label">${B(`vizy`,`Advanced configuration JSON`)}</span>
                        <!--
                            The content is not set here. The value attribute maps to the
                            component's defaultValue, which is the reset target rather
                            than what is shown, so the JSON is assigned as a property once
                            the element exists — see below. That also spares us escaping a
                            multi-line JSON document into an attribute.

                            Not wrapped in a label either: the editor is a CodeMirror
                            surface, and a label's click-to-focus fights its own cursor
                            placement.
                        -->
                        <pk-code-editor
                            data-advanced-json
                            language="json"
                            rows="20"
                            ${this.#s?`invalid`:``}
                        ></pk-code-editor>
                        ${this.#s?`<p class="vizy-editor-config-error">${this.#s}</p>`:``}
                    </div>
                `}
            </div>
        `,e.querySelectorAll(`[data-mode]`).forEach(e=>{e.onclick=()=>this.#v(e.dataset.mode)}),e.querySelectorAll(`[data-vocab-group]`).forEach(e=>{e.addEventListener(`pk-change`,t=>{let{value:n}=t.detail,r=n===`*`?e.options.map(e=>e.value):n,i=e.dataset.vocabGroup;i===`headings`?this.#E(r.map(Number)):this.#x(i,r,e.options.map(e=>e.value))})});let r=e.querySelector(`[data-default-heading]`);r&&(r.onchange=()=>{this.#e.headings.defaultLevel=Number(r.value),this.render()});let i=e.querySelector(`[data-bubble-enabled]`);i&&i.addEventListener(`pk-change`,()=>{this.#e.bubble.enabled=i.checked,this.render()});let a=e.querySelector(`[data-advanced-json]`);a&&(a.value=this.#o,a.addEventListener(`pk-change`,e=>{this.#o=e.detail.value})),this.#q(e),this.#J(e),this.#B()}};customElements.get(`vizy-editor-config-settings`)||customElements.define(`vizy-editor-config-settings`,H);
//# sourceMappingURL=editor-config-settings-CZayUlKC.js.map