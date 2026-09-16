import{a as e,i as t,n,r,t as i}from"./sortable-3xJ8ydF2.js";var a=class{#e;#t=[];#n=[];#r;constructor(n){this.#r=n,this.#e=new t({plugins:t=>[...t,e.configure({feedback:`clone`,dropAnimation:null})],modifiers:e=>[...e,r.configure({element:()=>this.#r.container()??null})]}),this.#a()}refresh(){this.#o(),this.#i(this.#r.availableList(),`available`),this.#i(this.#r.activeList(),`active`)}destroy(){this.#n.forEach(e=>e()),this.#n=[],this.#o(),this.#e.destroy()}#i(e,t){if(!e)return;let n=e.querySelector(`[data-empty-placeholder]`);n&&this.#t.push(new i({id:`${this.#r.type}-empty-${t}`,element:n,index:0,group:t,type:this.#r.type,accept:this.#r.type,handle:n.querySelector(`[data-no-drag]`)??void 0,data:{itemId:``,list:t,placeholder:!0}},this.#e)),e.querySelectorAll(`[data-toolbar-item]`).forEach((e,n)=>{let r=e.dataset.toolbarItem;r&&this.#t.push(new i({id:`${this.#r.type}-${t}-${n}-${r}`,element:e,index:n,group:t,type:this.#r.type,accept:this.#r.type,data:{itemId:r,list:t}},this.#e))})}#a(){this.#n.push(this.#e.monitor.addEventListener(`dragstart`,e=>{this.#r.container()?.classList.add(`is-sorting`);let{source:t}=e.operation;n(t)&&t.element instanceof HTMLElement&&t.element.classList.add(`is-dragging`)}),this.#e.monitor.addEventListener(`dragend`,e=>{let t=this.#r.container();t?.classList.remove(`is-sorting`),t?.querySelectorAll(`.is-dragging`).forEach(e=>e.classList.remove(`is-dragging`));let{source:r}=e.operation;if(e.canceled||!n(r))return;let i=r.data;if(i.placeholder||!i.itemId)return;let{initialIndex:a,index:o,initialGroup:s,group:c}=r.sortable;(a!==o||s!==c)&&(c===`available`||c===`active`)&&this.#r.onDrop({itemId:i.itemId,from:s===`active`?`active`:`available`,to:c,fromIndex:a,index:o})}))}#o(){this.#t.forEach(e=>{e.unregister(),e.destroy()}),this.#t=[]}},o=[2,3,4];function s(e,t){return window.Craft?.t(e,t)??t}function c(e){return e.replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e])}var l=class extends HTMLElement{#e={vocabulary:{nodes:[],marks:[]},headings:{levels:[2,3,4],defaultLevel:2},toolbar:[],bubble:{enabled:!0,items:[]}};#t=[];#n=[];#r={nodes:[],marks:[],headingAvailable:!1};#i=`visual`;#a=``;#o=``;#s=null;#c=new Map;connectedCallback(){this.#s=this.querySelector(`[data-vizy-config-sync]`);let e=this.getAttribute(`data-initial`);if(e){let t=JSON.parse(e);this.#e=t.config,this.#t=t.toolbarCatalog,this.#n=t.bubbleCatalog,this.#r=t.contentCatalog}this.#a=this.#l();let t=this.closest(`form`);t&&!t.dataset.vizyConfigBound&&(t.dataset.vizyConfigBound=`1`,t.addEventListener(`submit`,()=>{this.#i===`advanced`&&this.#u(),this.#E()})),this.render()}disconnectedCallback(){this.#c.forEach(e=>e.destroy()),this.#c.clear()}#l(){return JSON.stringify({vocabulary:this.#e.vocabulary,headings:this.#e.headings,toolbar:this.#e.toolbar,bubble:this.#e.bubble},null,2)}#u(){try{let e=JSON.parse(this.#a);return this.#e={vocabulary:{nodes:[...e.vocabulary?.nodes??[]],marks:[...e.vocabulary?.marks??[]]},headings:{levels:[...e.headings?.levels??[2,3,4]],defaultLevel:e.headings?.defaultLevel??2},toolbar:[...e.toolbar??[]],bubble:{enabled:e.bubble?.enabled??!0,items:[...e.bubble?.items??[]]}},this.#o=``,!0}catch{return this.#o=s(`vizy`,`Invalid JSON`),!1}}#d(e,t){return t.find(t=>t.id===e)}#f(){let e=new Set(this.#e.toolbar);return this.#t.filter(t=>e.has(t.id)&&!this.#y(t.id)?!1:t.kind===`presentation`?!0:t.kind===`mark`?this.#e.vocabulary.marks.includes(t.id):t.kind===`node`&&this.#e.vocabulary.nodes.includes(t.id))}#p(){let e=new Set(this.#e.bubble.items);return this.#n.filter(t=>!e.has(t.id)&&this.#e.vocabulary.marks.includes(t.id))}#m(e){e===`visual`&&this.#i===`advanced`&&!this.#u()||(e===`advanced`&&(this.#a=this.#l(),this.#o=``),this.#i=e,this.render())}#h(e,t,n){let r=new Set(this.#e.vocabulary[e]);n?r.add(t):r.delete(t),this.#e.vocabulary[e]=[...r],this.#e.toolbar=this.#e.toolbar.filter(e=>{let t=this.#d(e,this.#t);return!t||t.kind===`presentation`?!0:t.kind===`mark`?this.#e.vocabulary.marks.includes(e):t.kind===`node`&&this.#e.vocabulary.nodes.includes(e)}),this.#e.bubble.items=this.#e.bubble.items.filter(e=>this.#e.vocabulary.marks.includes(e)),this.render()}#g(){return this.#e.vocabulary.nodes.includes(`heading`)}#_(e){e&&this.#e.headings.levels.length===0&&(this.#e.headings.levels=[...o],this.#e.headings.defaultLevel=o[0]),this.#h(`nodes`,`heading`,e)}#v(e,t){let n=new Set(this.#e.headings.levels);t?n.add(e):(!this.#g()||n.size>1)&&n.delete(e),this.#e.headings.levels=[...n].sort((e,t)=>e-t),this.#e.headings.levels.includes(this.#e.headings.defaultLevel)||(this.#e.headings.defaultLevel=this.#e.headings.levels[0]??2),this.render()}#y(e){return e===`separator`}#b(e,t){!this.#y(e)&&this.#e.toolbar.includes(e)||(t===void 0?this.#e.toolbar.push(e):this.#e.toolbar.splice(t,0,e),this.render())}#x(e,t){let n=t!==void 0&&this.#e.toolbar[t]===e?t:this.#e.toolbar.indexOf(e);n!==-1&&(this.#e.toolbar.splice(n,1),this.render())}#S(e,t){this.#e.bubble.items.includes(e)||(t===void 0?this.#e.bubble.items.push(e):this.#e.bubble.items.splice(t,0,e),this.render())}#C(e){this.#e.bubble.items=this.#e.bubble.items.filter(t=>t!==e),this.render()}#w(e,t,n){let r=e===`toolbar`?this.#e.toolbar:this.#e.bubble.items;if(t<0||n<0||t>=r.length||n>=r.length)return;let[i]=r.splice(t,1);r.splice(n,0,i),this.render()}#T(e,t){if(t.to===`available`){if(t.from!==`active`)return;e===`toolbar`?this.#x(t.itemId,t.fromIndex):this.#C(t.itemId);return}if(t.from===`available`){e===`toolbar`?this.#b(t.itemId,t.index):this.#S(t.itemId,t.index);return}this.#w(e,t.fromIndex,t.index)}#E(){if(!this.#s)return;this.#s.replaceChildren();let e=(e,t)=>{let n=document.createElement(`input`);n.type=`hidden`,n.name=e,n.value=t,this.#s?.append(n)};this.#e.vocabulary.nodes.forEach(t=>e(`vocabularyNodes[]`,t)),this.#e.vocabulary.marks.forEach(t=>e(`vocabularyMarks[]`,t)),this.#e.headings.levels.forEach(t=>e(`headingLevels[]`,String(t))),e(`defaultHeadingLevel`,String(this.#e.headings.defaultLevel)),e(`toolbarJson`,JSON.stringify(this.#e.toolbar)),e(`bubbleJson`,JSON.stringify(this.#e.bubble)),e(`advancedConfig`,this.#l())}#D(e){return e.icon?e.icon:`<span class="vizy-control-text">${c(e.label)}</span>`}#O(e,t,n){let r=[`vizy-control`,e.id===`separator`?`is-separator`:``,e.icon||e.id===`separator`?``:`is-text`,n===`available`?`is-available`:``].filter(Boolean).join(` `),i=n===`available`?s(`vizy`,`Click or drag to add`):s(`vizy`,`Click or drag out to remove`);return`
            <button
                type="button"
                class="${r}"
                title="${c(e.label)} — ${i}"
                aria-label="${c(e.label)}"
                data-toolbar-item="${c(e.id)}"
                data-toolbar-list="${t}"
                data-toolbar-variant="${n}"
            >${e.id===`separator`?``:this.#D(e)}</button>
        `}#k(e){return`
            <span class="vizy-editor-config-empty" data-empty-placeholder>
                <span data-no-drag hidden></span>
                ${c(e)}
            </span>
        `}#A(e){e.querySelectorAll(`[data-toolbar-item]`).forEach((e,t)=>{e.onclick=()=>{let n=e.dataset.toolbarItem,r=e.dataset.toolbarList;if(!n||!r)return;if(e.dataset.toolbarVariant===`available`){r===`toolbar`?this.#b(n):this.#S(n);return}let i=[...e.parentElement?.children??[]].indexOf(e);r===`toolbar`?this.#x(n,i===-1?t:i):this.#C(n)}})}#j(e){[`toolbar`,`bubble`].forEach(t=>{let n=()=>e.querySelector(`[data-builder="${t}"]`);if(!n()){this.#c.get(t)?.destroy(),this.#c.delete(t);return}let r=this.#c.get(t);r||(r=new a({container:n,type:`vizy-${t}-control`,availableList:()=>e.querySelector(`[data-builder-list="${t}-available"]`),activeList:()=>e.querySelector(`[data-builder-list="${t}-active"]`),onDrop:e=>this.#T(t,e)}),this.#c.set(t,r)),r.refresh()})}render(){let e=this.querySelector(`[data-vizy-config-host]`);if(!e)return;let t=this.#e.toolbar.map(e=>{let t=this.#d(e,this.#t);return t?this.#O(t,`toolbar`,`active`):``}).join(``),n=this.#e.bubble.items.map(e=>{let t=this.#d(e,this.#n);return t?this.#O(t,`bubble`,`active`):``}).join(``);e.innerHTML=`
            <div class="vizy-editor-config">
                <div class="vizy-editor-config-tabs">
                    <button type="button" class="${this.#i===`visual`?`active`:``}" data-mode="visual">${s(`vizy`,`Visual`)}</button>
                    <button type="button" class="${this.#i===`advanced`?`active`:``}" data-mode="advanced">${s(`vizy`,`Advanced`)}</button>
                </div>

                ${this.#i===`visual`?`
                    <div class="vizy-editor-config-panel">
                        <section class="vizy-editor-config-section">
                            <h3>${s(`vizy`,`Allowed content`)}</h3>
                            <p class="instructions">${s(`vizy`,`What this editor is allowed to understand. This governs pasted and imported content as well as the toolbar, so a capability can be allowed without being given a button.`)}</p>

                            <div class="vizy-editor-config-subhead">${s(`vizy`,`Blocks and objects`)}</div>
                            <div class="vizy-editor-config-checkboxes">
                                ${this.#r.nodes.map(e=>`
                                    <label>
                                        <input type="checkbox" data-vocab-kind="nodes" value="${c(e.value)}" ${this.#e.vocabulary.nodes.includes(e.value)?`checked`:``}>
                                        ${c(e.label)}
                                    </label>
                                `).join(``)}
                            </div>

                            <div class="vizy-editor-config-subhead">${s(`vizy`,`Inline formatting`)}</div>
                            <div class="vizy-editor-config-checkboxes">
                                ${this.#r.marks.map(e=>`
                                    <label>
                                        <input type="checkbox" data-vocab-kind="marks" value="${c(e.value)}" ${this.#e.vocabulary.marks.includes(e.value)?`checked`:``}>
                                        ${c(e.label)}
                                    </label>
                                `).join(``)}
                            </div>
                        </section>

                        ${this.#r.headingAvailable?`
                            <section class="vizy-editor-config-section">
                                <h3>${s(`vizy`,`Headings`)}</h3>
                                <label class="vizy-editor-config-toggle">
                                    <input type="checkbox" data-headings-enabled ${this.#g()?`checked`:``}>
                                    ${s(`vizy`,`Allow headings`)}
                                </label>

                                <div class="vizy-editor-config-checkboxes"${this.#g()?``:` hidden`}>
                                    ${[1,2,3,4,5,6].map(e=>`
                                        <label>
                                            <input type="checkbox" data-heading-level="${e}" ${this.#e.headings.levels.includes(e)?`checked`:``}>
                                            H${e}
                                        </label>
                                    `).join(``)}
                                </div>
                                <label class="vizy-editor-config-default-heading"${this.#g()?``:` hidden`}>
                                    ${s(`vizy`,`Default level`)}
                                    <select data-default-heading>
                                        ${this.#e.headings.levels.map(e=>`
                                            <option value="${e}" ${this.#e.headings.defaultLevel===e?`selected`:``}>H${e}</option>
                                        `).join(``)}
                                    </select>
                                </label>
                            </section>
                        `:``}

                        <section class="vizy-editor-config-section">
                            <h3>${s(`vizy`,`Toolbar`)}</h3>
                            <p class="instructions">${s(`vizy`,`Drag items into the toolbar below. Drag them back out to remove them.`)}</p>
                            <div class="vizy-editor-config-builder" data-builder="toolbar">
                                <div class="vizy-editor-config-available" data-builder-list="toolbar-available">
                                    ${this.#f().map(e=>this.#O(e,`toolbar`,`available`)).join(``)||this.#k(s(`vizy`,`Everything is in the toolbar.`))}
                                </div>
                                <div class="vizy-editor-config-active" data-builder-list="toolbar-active">
                                    ${t||this.#k(s(`vizy`,`Drag items here.`))}
                                </div>
                            </div>
                        </section>

                        <section class="vizy-editor-config-section">
                            <h3>${s(`vizy`,`Bubble Menu`)}</h3>
                            <label class="vizy-editor-config-toggle">
                                <input type="checkbox" data-bubble-enabled ${this.#e.bubble.enabled?`checked`:``}>
                                ${s(`vizy`,`Show a Bubble Menu on selection`)}
                            </label>
                            ${this.#e.bubble.enabled?`
                                <div class="vizy-editor-config-builder" data-builder="bubble">
                                    <div class="vizy-editor-config-available" data-builder-list="bubble-available">
                                        ${this.#p().map(e=>this.#O(e,`bubble`,`available`)).join(``)||this.#k(s(`vizy`,`Everything is in the Bubble Menu.`))}
                                    </div>
                                    <div class="vizy-editor-config-active is-bubble" data-builder-list="bubble-active">
                                        ${n||this.#k(s(`vizy`,`Drag items here.`))}
                                    </div>
                                </div>
                            `:``}
                        </section>
                    </div>
                `:`
                    <div class="vizy-editor-config-advanced">
                        <label>
                            <span class="vizy-editor-config-strip-label">${s(`vizy`,`Advanced configuration JSON`)}</span>
                            <textarea data-advanced-json>${c(this.#a)}</textarea>
                        </label>
                        ${this.#o?`<p class="vizy-editor-config-error">${this.#o}</p>`:``}
                    </div>
                `}
            </div>
        `,e.querySelectorAll(`[data-mode]`).forEach(e=>{e.onclick=()=>this.#m(e.dataset.mode)}),e.querySelectorAll(`[data-vocab-kind]`).forEach(e=>{e.onchange=()=>this.#h(e.dataset.vocabKind,e.value,e.checked)});let r=e.querySelector(`[data-headings-enabled]`);r&&(r.onchange=()=>this.#_(r.checked)),e.querySelectorAll(`[data-heading-level]`).forEach(e=>{e.onchange=()=>this.#v(Number(e.dataset.headingLevel),e.checked)});let i=e.querySelector(`[data-default-heading]`);i&&(i.onchange=()=>{this.#e.headings.defaultLevel=Number(i.value),this.render()});let a=e.querySelector(`[data-bubble-enabled]`);a&&(a.onchange=()=>{this.#e.bubble.enabled=a.checked,this.render()});let o=e.querySelector(`[data-advanced-json]`);o&&(o.oninput=()=>{this.#a=o.value}),this.#A(e),this.#j(e),this.#E()}};customElements.get(`vizy-editor-config-settings`)||customElements.define(`vizy-editor-config-settings`,l);
//# sourceMappingURL=editor-config-settings-BdxO5iFb.js.map