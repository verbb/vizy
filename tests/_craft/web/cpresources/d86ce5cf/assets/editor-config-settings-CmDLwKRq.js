function e(e,t){return window.Craft?.t(e,t)??t}var t=class extends HTMLElement{#e={vocabulary:{nodes:[],marks:[]},headings:{levels:[2,3,4],defaultLevel:2},toolbar:[],bubble:{enabled:!0,items:[]}};#t=[];#n=[];#r=[];#i=[];#a=`visual`;#o=``;#s=``;#c=null;#l=null;#u=null;connectedCallback(){this.#u=this.querySelector(`[data-vizy-config-sync]`);let e=this.getAttribute(`data-initial`);if(e){let t=JSON.parse(e);this.#e=t.config,this.#t=t.toolbarCatalog,this.#n=t.bubbleCatalog,this.#r=t.selectableNodes,this.#i=t.selectableMarks}this.#o=this.#d();let t=this.closest(`form`);t&&!t.dataset.vizyConfigBound&&(t.dataset.vizyConfigBound=`1`,t.addEventListener(`submit`,()=>{this.#a===`advanced`&&this.#f(),this.#C()})),this.render()}#d(){return JSON.stringify({vocabulary:this.#e.vocabulary,headings:this.#e.headings,toolbar:this.#e.toolbar,bubble:this.#e.bubble},null,2)}#f(){try{let e=JSON.parse(this.#o);return this.#e={vocabulary:{nodes:[...e.vocabulary?.nodes??[]],marks:[...e.vocabulary?.marks??[]]},headings:{levels:[...e.headings?.levels??[2,3,4]],defaultLevel:e.headings?.defaultLevel??2},toolbar:[...e.toolbar??[]],bubble:{enabled:e.bubble?.enabled??!0,items:[...e.bubble?.items??[]]}},this.#s=``,!0}catch{return this.#s=e(`vizy`,`Invalid JSON`),!1}}#p(e,t){return t.find(t=>t.id===e)}#m(){let e=new Set(this.#e.toolbar);return this.#t.filter(t=>e.has(t.id)?!1:t.kind===`presentation`?!0:t.kind===`mark`?this.#e.vocabulary.marks.includes(t.id):t.kind===`node`&&this.#e.vocabulary.nodes.includes(t.id))}#h(){let e=new Set(this.#e.bubble.items);return this.#n.filter(t=>!e.has(t.id)&&this.#e.vocabulary.marks.includes(t.id))}#g(e){e===`visual`&&this.#a===`advanced`&&!this.#f()||(e===`advanced`&&(this.#o=this.#d(),this.#s=``),this.#a=e,this.render())}#_(e,t,n){let r=new Set(this.#e.vocabulary[e]);n?r.add(t):r.delete(t),this.#e.vocabulary[e]=[...r],this.#e.toolbar=this.#e.toolbar.filter(e=>{let t=this.#p(e,this.#t);return!t||t.kind===`presentation`?!0:t.kind===`mark`?this.#e.vocabulary.marks.includes(e):t.kind===`node`&&this.#e.vocabulary.nodes.includes(e)}),this.#e.bubble.items=this.#e.bubble.items.filter(e=>this.#e.vocabulary.marks.includes(e)),this.render()}#v(e,t){let n=new Set(this.#e.headings.levels);t?n.add(e):n.delete(e),this.#e.headings.levels=[...n].sort((e,t)=>e-t),this.#e.headings.levels.includes(this.#e.headings.defaultLevel)||(this.#e.headings.defaultLevel=this.#e.headings.levels[0]??2),this.render()}#y(e){this.#e.toolbar.includes(e)||(this.#e.toolbar.push(e),this.render())}#b(e){this.#e.toolbar=this.#e.toolbar.filter(t=>t!==e),this.render()}#x(e){this.#e.bubble.items.includes(e)||(this.#e.bubble.items.push(e),this.render())}#S(e){this.#e.bubble.items=this.#e.bubble.items.filter(t=>t!==e),this.render()}#C(){if(!this.#u)return;this.#u.replaceChildren();let e=(e,t)=>{let n=document.createElement(`input`);n.type=`hidden`,n.name=e,n.value=t,this.#u?.append(n)};this.#e.vocabulary.nodes.forEach(t=>e(`vocabularyNodes[]`,t)),this.#e.vocabulary.marks.forEach(t=>e(`vocabularyMarks[]`,t)),this.#e.headings.levels.forEach(t=>e(`headingLevels[]`,String(t))),e(`defaultHeadingLevel`,String(this.#e.headings.defaultLevel)),e(`toolbarJson`,JSON.stringify(this.#e.toolbar)),e(`bubbleJson`,JSON.stringify(this.#e.bubble)),e(`advancedConfig`,this.#d())}#w(t,n,r){return`
            <span
                class="vizy-editor-config-chip${t.kind===`presentation`?` presentation`:``}"
                draggable="true"
                data-chip-id="${t.id}"
                data-chip-list="${n}"
                data-chip-index="${r}"
            >
                ${t.label}
                <button type="button" data-remove-chip="${n}" data-remove-id="${t.id}" aria-label="${e(`app`,`Remove`)}">×</button>
            </span>
        `}#T(e){e.querySelectorAll(`[data-chip-id]`).forEach(e=>{e.addEventListener(`dragstart`,t=>{this.#c=e.dataset.chipId??null,e.classList.add(`dragging`),t.dataTransfer&&(t.dataTransfer.effectAllowed=`move`,t.dataTransfer.setData(`text/plain`,e.dataset.chipId??``))}),e.addEventListener(`dragend`,()=>{e.classList.remove(`dragging`),this.#c=null,this.#l=null})}),e.querySelectorAll(`[data-drop-zone]`).forEach(e=>{e.addEventListener(`dragover`,t=>{t.preventDefault(),this.#l=e.dataset.dropZone??null}),e.addEventListener(`drop`,t=>{t.preventDefault();let n=this.#c??t.dataTransfer?.getData(`text/plain`)??``,r=e.dataset.dropZone;if(!(!n||!r)){if(r===`toolbar-pool`){this.#b(n);return}if(r===`bubble-pool`){this.#S(n);return}r===`toolbar`&&this.#y(n),r===`bubble`&&this.#x(n)}})}),e.querySelectorAll(`[data-remove-chip]`).forEach(e=>{e.onclick=()=>{let t=e.getAttribute(`data-remove-chip`),n=e.getAttribute(`data-remove-id`);n&&(t===`toolbar`&&this.#b(n),t===`bubble`&&this.#S(n))}}),e.querySelectorAll(`[data-pool-add]`).forEach(e=>{e.onclick=()=>{let t=e.getAttribute(`data-pool-add`),n=e.getAttribute(`data-pool-id`);n&&(t===`toolbar`&&this.#y(n),t===`bubble`&&this.#x(n))}})}render(){let t=this.querySelector(`[data-vizy-config-host]`);if(!t)return;let n=this.#e.toolbar.map((e,t)=>{let n=this.#p(e,this.#t);return n?this.#w(n,`toolbar`,t):``}).join(``),r=this.#e.bubble.items.map((e,t)=>{let n=this.#p(e,this.#n);return n?this.#w(n,`bubble`,t):``}).join(``);t.innerHTML=`
            <div class="vizy-editor-config">
                <div class="vizy-editor-config-tabs">
                    <button type="button" class="${this.#a===`visual`?`active`:``}" data-mode="visual">${e(`vizy`,`Visual`)}</button>
                    <button type="button" class="${this.#a===`advanced`?`active`:``}" data-mode="advanced">${e(`vizy`,`Advanced`)}</button>
                </div>

                ${this.#a===`visual`?`
                    <div class="vizy-editor-config-panel">
                        <section class="vizy-editor-config-section">
                            <h3>${e(`vizy`,`Vocabulary`)}</h3>
                            <div class="vizy-editor-config-checkboxes">
                                ${this.#r.map(e=>`
                                    <label>
                                        <input type="checkbox" data-vocab-kind="nodes" value="${e.value}" ${this.#e.vocabulary.nodes.includes(e.value)?`checked`:``}>
                                        ${e.label}
                                    </label>
                                `).join(``)}
                            </div>
                            <div class="vizy-editor-config-checkboxes" style="margin-top:12px;">
                                ${this.#i.map(e=>`
                                    <label>
                                        <input type="checkbox" data-vocab-kind="marks" value="${e.value}" ${this.#e.vocabulary.marks.includes(e.value)?`checked`:``}>
                                        ${e.label}
                                    </label>
                                `).join(``)}
                            </div>
                        </section>

                        <section class="vizy-editor-config-section">
                            <h3>${e(`vizy`,`Headings`)}</h3>
                            <div class="vizy-editor-config-checkboxes">
                                ${[1,2,3,4,5,6].map(e=>`
                                    <label>
                                        <input type="checkbox" data-heading-level="${e}" ${this.#e.headings.levels.includes(e)?`checked`:``}>
                                        H${e}
                                    </label>
                                `).join(``)}
                            </div>
                            <label style="display:block;margin-top:12px;">
                                Default level
                                <select data-default-heading>
                                    ${this.#e.headings.levels.map(e=>`
                                        <option value="${e}" ${this.#e.headings.defaultLevel===e?`selected`:``}>H${e}</option>
                                    `).join(``)}
                                </select>
                            </label>
                        </section>

                        <section class="vizy-editor-config-section vizy-editor-config-toolbar-builder">
                            <h3>${e(`vizy`,`Toolbar`)}</h3>
                            <p class="instructions">${e(`vizy`,`Drag toolbar items into the editor.`)}</p>
                            <div class="vizy-editor-config-pool-label">${e(`vizy`,`Available items`)}</div>
                            <div class="vizy-editor-config-pool" data-drop-zone="toolbar-pool">
                                ${this.#m().map(e=>`
                                    <button type="button" class="vizy-editor-config-chip ${e.kind===`presentation`?`presentation`:``}" data-pool-add="toolbar" data-pool-id="${e.id}">+ ${e.label}</button>
                                `).join(``)}
                            </div>
                            <div class="vizy-editor-config-strip-label">${e(`vizy`,`Active toolbar`)}</div>
                            <div class="vizy-editor-config-strip" data-drop-zone="toolbar">${n}</div>
                        </section>

                        <section class="vizy-editor-config-section vizy-editor-config-toolbar-builder">
                            <h3>${e(`vizy`,`Bubble Menu`)}</h3>
                            <label class="vizy-editor-config-bubble-toggle">
                                <input type="checkbox" data-bubble-enabled ${this.#e.bubble.enabled?`checked`:``}>
                                ${e(`vizy`,`Enabled`)}
                            </label>
                            <div class="vizy-editor-config-pool-label">${e(`vizy`,`Available items`)}</div>
                            <div class="vizy-editor-config-pool" data-drop-zone="bubble-pool">
                                ${this.#h().map(e=>`
                                    <button type="button" class="vizy-editor-config-chip" data-pool-add="bubble" data-pool-id="${e.id}">+ ${e.label}</button>
                                `).join(``)}
                            </div>
                            <div class="vizy-editor-config-strip-label">${e(`vizy`,`Active bubble items`)}</div>
                            <div class="vizy-editor-config-strip" data-drop-zone="bubble">${r}</div>
                        </section>
                    </div>
                `:`
                    <div class="vizy-editor-config-advanced">
                        <label>
                            <span class="vizy-editor-config-strip-label">${e(`vizy`,`Advanced configuration JSON`)}</span>
                            <textarea data-advanced-json>${this.#o}</textarea>
                        </label>
                        ${this.#s?`<p class="vizy-editor-config-error">${this.#s}</p>`:``}
                    </div>
                `}
            </div>
        `,t.querySelectorAll(`[data-mode]`).forEach(e=>{e.onclick=()=>this.#g(e.dataset.mode)}),t.querySelectorAll(`[data-vocab-kind]`).forEach(e=>{e.onchange=()=>this.#_(e.dataset.vocabKind,e.value,e.checked)}),t.querySelectorAll(`[data-heading-level]`).forEach(e=>{e.onchange=()=>this.#v(Number(e.dataset.headingLevel),e.checked)});let i=t.querySelector(`[data-default-heading]`);i&&(i.onchange=()=>{this.#e.headings.defaultLevel=Number(i.value),this.render()});let a=t.querySelector(`[data-bubble-enabled]`);a&&(a.onchange=()=>{this.#e.bubble.enabled=a.checked,this.render()});let o=t.querySelector(`[data-advanced-json]`);o&&(o.oninput=()=>{this.#o=o.value}),this.#T(t),this.#C()}};customElements.get(`vizy-editor-config-settings`)||customElements.define(`vizy-editor-config-settings`,t);
//# sourceMappingURL=editor-config-settings-CmDLwKRq.js.map