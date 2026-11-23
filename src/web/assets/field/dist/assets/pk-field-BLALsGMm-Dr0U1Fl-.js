const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./markdown-Dnjuc-ox.js","./class-map-BJSU2ntM.js"])))=>i.map(i=>d[i]);
import{C as e,S as t,_ as n,a as r,c as i,d as a,f as o,g as s,h as c,i as l,o as u,p as d,r as f,t as p,u as m,v as h,x as g,y as _}from"./class-map-BJSU2ntM.js";import{t as v}from"./unsafe-html-DoRu2wHD.js";import{h as y}from"./dismissible-stack-D_0W3Azi-CtJhWusr.js";import{t as b}from"./preload-helper-CRzLMJPS.js";import{t as x}from"./form-control.styles-CQ93gnVf-C8bgzgLt.js";var{I:S}=h,C=e=>e===null||typeof e!=`object`&&typeof e!=`function`,w=e=>e.strings===void 0,T={},E=(e,t=T)=>e._$AH=t,D=(e,t)=>{let n=e._$AN;if(n===void 0)return!1;for(let e of n)e._$AO?.(t,!1),D(e,t);return!0},O=e=>{let t,n;do{if((t=e._$AM)===void 0)break;n=t._$AN,n.delete(e),e=t}while(n?.size===0)},k=e=>{for(let t;t=e._$AM;e=t){let n=t._$AN;if(n===void 0)t._$AN=n=new Set;else if(n.has(e))break;n.add(e),M(t)}};function A(e){this._$AN===void 0?this._$AM=e:(O(this),this._$AM=e,k(this))}function j(e,t=!1,n=0){let r=this._$AH,i=this._$AN;if(i!==void 0&&i.size!==0){if(t){if(Array.isArray(r))for(let e=n;e<r.length;e++)D(r[e],!1),O(r[e]);else r!=null&&(D(r,!1),O(r))}else D(this,e)}}var M=e=>{e.type==u.CHILD&&(e._$AP??=j,e._$AQ??=A)},N=class extends r{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,t,n){super._$AT(e,t,n),k(this),this.isConnected=e._$AU}_$AO(e,t=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),t&&(D(this,e),O(this))}setValue(e){if(w(this._$Ct))this._$Ct._$AI(e,this);else{let t=[...this._$Ct._$AH];t[this._$Ci]=e,this._$Ct._$AI(t,this,0)}}disconnected(){}reconnected(){}},P=class{constructor(e){this.G=e}disconnect(){this.G=void 0}reconnect(e){this.G=e}deref(){return this.G}},F=class{constructor(){this.Y=void 0,this.Z=void 0}get(){return this.Y}pause(){this.Y??=new Promise(e=>this.Z=e)}resume(){this.Z?.(),this.Y=this.Z=void 0}},I=e=>!C(e)&&typeof e.then==`function`,L=1073741823,R=l(class extends N{constructor(){super(...arguments),this._$Cwt=L,this._$Cbt=[],this._$CK=new P(this),this._$CX=new F}render(...e){return e.find(e=>!I(e))??s}update(e,t){let n=this._$Cbt,r=n.length;this._$Cbt=t;let i=this._$CK,a=this._$CX;this.isConnected||this.disconnected();for(let e=0;e<t.length&&!(e>this._$Cwt);e++){let o=t[e];if(!I(o))return this._$Cwt=e,o;e<r&&o===n[e]||(this._$Cwt=L,r=0,Promise.resolve(o).then(async e=>{for(;a.get();)await a.get();let t=i.deref();if(t!==void 0){let n=t._$Cbt.indexOf(o);n>-1&&n<t._$Cwt&&(t._$Cwt=n,t.setValue(e))}}))}return s}disconnected(){this._$CK.disconnect(),this._$CX.pause()}reconnected(){this._$CK.reconnect(this),this._$CX.resume()}}),z=_`
    @layer pk-component {
        .pk-inline-markdown a {
            color: var(--pk-color-blue-500);
            text-decoration: none;
        }

        .pk-inline-markdown a:hover {
            text-decoration: underline;
        }

        /* Craft p code — gray chip; tip/warning/error override bg/border on pk-field. */
        .pk-inline-markdown code {
            /* Craft --border-hairline ≈ gray-800 @ 10%. */
            border: 1px solid color-mix(in srgb, var(--pk-color-gray-800) 10%, transparent);
            border-radius: var(--pk-radius-sm);
            background: var(--pk-color-gray-100);
            padding-block: 0.0625em;
            padding-inline: 0.25em;
            font-family: var(--pk-font-family-mono, ui-monospace, monospace);
            /* v1 field help/errors used [&_code]:text-[0.85em] — tighter than --pk-font-size-mono (0.9em). */
            font-size: var(--pk-inline-markdown-code-font-size, 0.85em);
            line-height: var(--pk-line-height-mono, 1.5);
            /* Inherit tip/warning/error/instructions text color (Craft parity). */
            color: inherit;
        }
    }
`;function B({control:e,labelId:t,instructionsId:n,errorsId:r,warningId:i,tipId:a,controlId:o,hasLabel:s,hasInstructions:c,hasErrors:l,hasWarning:u,hasTip:d,hasRequired:f=!1,invalid:p=!1}){e.id||=o,s?e.setAttribute(`aria-labelledby`,t):e.removeAttribute(`aria-labelledby`);let m=[c?n:``,l?r:``,u?i:``,d?a:``].filter(Boolean);m.length>0?e.setAttribute(`aria-describedby`,m.join(` `)):e.removeAttribute(`aria-describedby`),f?e.setAttribute(`aria-required`,`true`):e.removeAttribute(`aria-required`);let h=!!(p||l);h?(e.setAttribute(`aria-invalid`,`true`),e.setAttribute(`aria-errormessage`,r)):(e.removeAttribute(`aria-invalid`),e.removeAttribute(`aria-errormessage`)),V(e,h)}function V(e,t){`invalid`in e?e.invalid=t:e.toggleAttribute(`invalid`,t)}var H,U,W=()=>U??=b(()=>import(`./markdown-Dnjuc-ox.js`).then(e=>H=e.renderInlineMarkdown),__vite__mapDeps([0,1]),import.meta.url),G=e=>e?f(e):c;function K(e){return e?H?G(H(e)):R(W().then(t=>G(t(e))),e):c}var q=_`
    @layer pk-component {
        :host {
            display: block;
            width: 100%;
        }

        .form-control__control {
            display: block;
            position: relative;
            width: 100%;
        }

        .form-control__header--with-end {
            flex-direction: row;
            align-items: flex-start;
            justify-content: space-between;
            gap: 0.75rem;
        }

        .form-control__header-main {
            display: flex;
            flex-direction: column;
            gap: 0.125rem;
            min-width: 0;
            flex: 1 1 auto;
        }

        .form-control__header-end {
            flex-shrink: 0;
        }

        .form-control__required {
            display: inline-flex;
            align-items: center;
            color: var(--pk-color-rose-600);
            line-height: 0;
        }

        .form-control__required svg {
            display: block;
            width: 10px;
            height: 10px;
        }

        .form-control__translatable {
            display: inline-flex;
            align-items: center;
            color: var(--pk-color-gray-550);
            line-height: 0;
        }

        .form-control__translatable svg {
            display: block;
            width: 1rem;
            height: 1rem;
            fill: currentColor;
        }

        .form-control__errors {
            margin: 0;
            padding-inline-start: 20px;
            color: var(--pk-color-error);
            font-family: var(--pk-font-family);
            font-size: var(--pk-font-size-base);
            line-height: var(--pk-line-height);
            list-style: square;
        }

        .form-control__errors:empty {
            display: none;
        }

        .form-control__warning {
            display: flex;
            align-items: flex-start;
            gap: 0.25rem;
            min-width: 0;
            margin: 0;
            color: var(--pk-color-warning);
            font-family: var(--pk-font-family);
            font-size: var(--pk-font-size-base);
            line-height: var(--pk-line-height);
        }

        .form-control__warning:empty {
            display: none;
        }

        .form-control__warning-icon {
            display: inline-flex;
            flex-shrink: 0;
            margin-top: 0.3em;
            width: 0.75rem;
            height: 0.75rem;
            line-height: 0;
        }

        .form-control__warning-text {
            min-width: 0;
            margin: 0;
        }

        .form-control__warning-icon svg {
            display: block;
            width: 100%;
            height: 100%;
        }

        /* Craft .warning code — amber chip matching warning text. */
        .form-control__warning .pk-inline-markdown code {
            background-color: var(--pk-color-amber-100);
            border-color: var(--pk-color-amber-300);
        }

        .form-control__tip {
            display: flex;
            align-items: flex-start;
            gap: 0.25rem;
            min-width: 0;
            margin: 0;
            color: var(--pk-color-sky-700);
            font-family: var(--pk-font-family);
            font-size: var(--pk-font-size-base);
            line-height: var(--pk-line-height);
        }

        .form-control__tip:empty {
            display: none;
        }

        .form-control__tip-icon {
            display: inline-flex;
            flex-shrink: 0;
            margin-top: 0.3em;
            width: 0.75rem;
            height: 0.75rem;
            line-height: 0;
        }

        .form-control__tip-text {
            min-width: 0;
            margin: 0;
        }

        .form-control__tip-icon svg {
            display: block;
            width: 100%;
            height: 100%;
        }

        .form-control__tip-text a {
            text-decoration: underline;
        }

        /* Craft .tip code — sky/notice chip matching tip text. */
        .form-control__tip .pk-inline-markdown code {
            background-color: var(--pk-color-sky-100);
            border-color: var(--pk-color-sky-300);
        }

        /* Craft --bg-error / --border-error pattern for field errors. */
        .form-control__errors.pk-inline-markdown code {
            background-color: var(--pk-color-red-100);
            border-color: var(--pk-color-red-300);
        }
    }
`,J=class extends a{constructor(...e){super(...e),this.hasSlotController=new v(this,`label`,`instructions`,`hint`,`header-end`,`warning`,`tip`,`errors`),this.baseId=y(`pk-field`),this.label=``,this.instructions=``,this.required=!1,this.translatable=!1,this.warning=``,this.tip=``,this.errors=[],this.for=``,this.onLabelClick=e=>{let t=e.target;t instanceof Element&&(t.closest(`button, a, input, select, textarea, [role="button"], [role="link"]`)||this.focusControl())},this.onControlSlotChange=()=>{this.syncControlAria(),this.requestUpdate()}}static{this.styles=[x,z,q]}connectedCallback(){super.connectedCallback();let e=this.getAttribute(`hint`);e&&!this.instructions&&(this.instructions=e)}updated(e){super.updated(e),(e.has(`label`)||e.has(`instructions`)||e.has(`errors`)||e.has(`warning`)||e.has(`tip`)||e.has(`required`)||e.has(`for`))&&this.syncControlAria()}get labelId(){return`${this.baseId}-label`}get instructionsId(){return`${this.baseId}-instructions`}get errorsId(){return`${this.baseId}-errors`}get warningId(){return`${this.baseId}-warning`}get tipId(){return`${this.baseId}-tip`}get controlId(){return this.for||`${this.baseId}-control`}hasLabel(){return!!this.label||this.hasSlotController.test(`label`)}hasInstructions(){return!!this.instructions||this.hasSlotController.test(`instructions`)||this.hasSlotController.test(`hint`)}hasHeaderEnd(){return this.hasSlotController.test(`header-end`)}hasErrors(){return this.errors.length>0||this.hasSlotController.test(`errors`)}hasWarning(){return!!this.warning||this.hasSlotController.test(`warning`)}hasTip(){return!!this.tip||this.hasSlotController.test(`tip`)}getControlElement(){let[e]=this.controlSlot?.assignedElements({flatten:!0})??[];return e instanceof HTMLElement?e:this.for?this.getRootNode().getElementById(this.for):null}focusControl(){let e=this.getControlElement();e&&typeof e.focus==`function`&&e.focus()}syncControlAria(){let e=this.getControlElement();e&&B({control:e,labelId:this.labelId,instructionsId:this.instructionsId,errorsId:this.errorsId,warningId:this.warningId,tipId:this.tipId,controlId:this.controlId,hasLabel:this.hasLabel(),hasInstructions:this.hasInstructions(),hasErrors:this.hasErrors(),hasWarning:this.hasWarning(),hasTip:this.hasTip(),hasRequired:this.required,invalid:this.hasErrors()})}render(){let r=this.hasLabel(),i=this.hasInstructions(),a=this.hasHeaderEnd(),o=this.hasErrors(),s=this.hasWarning(),l=this.hasTip(),u=this.for||(r?this.controlId:c);return n`
            <div part="form-control" class="form-control">
                ${r||i||a?n`
                        <div
                            part="header"
                            class=${p({"form-control__header":!0,"form-control__header--with-end":a})}
                        >
                            <div class="form-control__header-main">
                                ${r?n`
                                        <label
                                            part="label"
                                            class="form-control__label"
                                            id=${this.labelId}
                                            for=${u}
                                            data-error=${o?`true`:c}
                                            @click=${this.onLabelClick}
                                        >
                                            <slot name="label">${this.label}</slot>
                                            ${this.required?n`
                                                    <span class="sr-only">Required</span>
                                                    <span class="form-control__required" aria-hidden="true">
                                                        ${e(t.asterisk)}
                                                    </span>
                                                `:c}
                                            ${this.translatable?n`
                                                    <span class="form-control__translatable">
                                                        ${g()}
                                                        <span class="sr-only">Translatable</span>
                                                    </span>
                                                `:c}
                                        </label>
                                    `:c}

                                ${i?n`
                                        <p
                                            part="instructions"
                                            class="form-control__instructions pk-inline-markdown"
                                            id=${this.instructionsId}
                                        >
                                            <slot name="instructions">${K(this.instructions)}</slot>
                                            <slot name="hint"></slot>
                                        </p>
                                    `:c}
                            </div>

                            ${a?n`
                                    <div part="header-end" class="form-control__header-end">
                                        <slot name="header-end"></slot>
                                    </div>
                                `:n`<slot name="header-end" hidden></slot>`}
                        </div>
                    `:c}

                <div part="control" class="form-control__control">
                    <slot @slotchange=${this.onControlSlotChange}></slot>
                </div>

                ${o?n`
                        <ul part="errors" class="form-control__errors pk-inline-markdown" id=${this.errorsId}>
                            ${this.errors.map(e=>n`<li>${K(e)}</li>`)}
                            <slot name="errors"></slot>
                        </ul>
                    `:c}

                ${s?n`
                        <div part="warning" class="form-control__warning" id=${this.warningId}>
                            <span class="form-control__warning-icon" aria-hidden="true">
                                ${e(t.triangleExclamation)}
                            </span>
                            <p class="form-control__warning-text pk-inline-markdown">
                                <slot name="warning">${K(this.warning)}</slot>
                            </p>
                        </div>
                    `:c}

                ${l?n`
                        <div part="tip" class="form-control__tip" id=${this.tipId}>
                            <span class="form-control__tip-icon" aria-hidden="true">
                                ${e(t.lightbulb)}
                            </span>
                            <p class="form-control__tip-text pk-inline-markdown">
                                <span class="sr-only">Tip: </span>
                                <slot name="tip">${K(this.tip)}</slot>
                            </p>
                        </div>
                    `:c}
            </div>
        `}};o([m()],J.prototype,`label`,void 0),o([m()],J.prototype,`instructions`,void 0),o([m({type:Boolean,reflect:!0})],J.prototype,`required`,void 0),o([m({type:Boolean,reflect:!0})],J.prototype,`translatable`,void 0),o([m()],J.prototype,`warning`,void 0),o([m()],J.prototype,`tip`,void 0),o([m({attribute:!1})],J.prototype,`errors`,void 0),o([m({reflect:!0})],J.prototype,`for`,void 0),o([i(`slot:not([name])`)],J.prototype,`controlSlot`,void 0),J=o([d(`pk-field`)],J);export{w as n,E as t};
//# sourceMappingURL=pk-field-BLALsGMm-Dr0U1Fl-.js.map