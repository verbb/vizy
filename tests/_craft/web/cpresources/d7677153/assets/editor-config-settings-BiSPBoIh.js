var e=[2,3,4];function t(e,t){return window.Craft?.t(e,t)??t}function n(e){return e.replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e])}var r=class extends HTMLElement{#e={vocabulary:{nodes:[],marks:[]},headings:{levels:[2,3,4],defaultLevel:2},toolbar:[],bubble:{enabled:!0,items:[]}};#t=[];#n=[];#r={nodes:[],marks:[],headingAvailable:!1};#i=`visual`;#a=``;#o=``;#s=null;#c=null;#l=null;connectedCallback(){this.#l=this.querySelector(`[data-vizy-config-sync]`);let e=this.getAttribute(`data-initial`);if(e){let t=JSON.parse(e);this.#e=t.config,this.#t=t.toolbarCatalog,this.#n=t.bubbleCatalog,this.#r=t.contentCatalog}this.#a=this.#u();let t=this.closest(`form`);t&&!t.dataset.vizyConfigBound&&(t.dataset.vizyConfigBound=`1`,t.addEventListener(`submit`,()=>{this.#i===`advanced`&&this.#d(),this.#w()})),this.render()}#u(){return JSON.stringify({vocabulary:this.#e.vocabulary,headings:this.#e.headings,toolbar:this.#e.toolbar,bubble:this.#e.bubble},null,2)}#d(){try{let e=JSON.parse(this.#a);return this.#e={vocabulary:{nodes:[...e.vocabulary?.nodes??[]],marks:[...e.vocabulary?.marks??[]]},headings:{levels:[...e.headings?.levels??[2,3,4]],defaultLevel:e.headings?.defaultLevel??2},toolbar:[...e.toolbar??[]],bubble:{enabled:e.bubble?.enabled??!0,items:[...e.bubble?.items??[]]}},this.#o=``,!0}catch{return this.#o=t(`vizy`,`Invalid JSON`),!1}}#f(e,t){return t.find(t=>t.id===e)}#p(){let e=new Set(this.#e.toolbar);return this.#t.filter(t=>e.has(t.id)?!1:t.kind===`presentation`?!0:t.kind===`mark`?this.#e.vocabulary.marks.includes(t.id):t.kind===`node`&&this.#e.vocabulary.nodes.includes(t.id))}#m(){let e=new Set(this.#e.bubble.items);return this.#n.filter(t=>!e.has(t.id)&&this.#e.vocabulary.marks.includes(t.id))}#h(e){e===`visual`&&this.#i===`advanced`&&!this.#d()||(e===`advanced`&&(this.#a=this.#u(),this.#o=``),this.#i=e,this.render())}#g(e,t,n){let r=new Set(this.#e.vocabulary[e]);n?r.add(t):r.delete(t),this.#e.vocabulary[e]=[...r],this.#e.toolbar=this.#e.toolbar.filter(e=>{let t=this.#f(e,this.#t);return!t||t.kind===`presentation`?!0:t.kind===`mark`?this.#e.vocabulary.marks.includes(e):t.kind===`node`&&this.#e.vocabulary.nodes.includes(e)}),this.#e.bubble.items=this.#e.bubble.items.filter(e=>this.#e.vocabulary.marks.includes(e)),this.render()}#_(){return this.#e.vocabulary.nodes.includes(`heading`)}#v(t){t&&this.#e.headings.levels.length===0&&(this.#e.headings.levels=[...e],this.#e.headings.defaultLevel=e[0]),this.#g(`nodes`,`heading`,t)}#y(e,t){let n=new Set(this.#e.headings.levels);t?n.add(e):(!this.#_()||n.size>1)&&n.delete(e),this.#e.headings.levels=[...n].sort((e,t)=>e-t),this.#e.headings.levels.includes(this.#e.headings.defaultLevel)||(this.#e.headings.defaultLevel=this.#e.headings.levels[0]??2),this.render()}#b(e){this.#e.toolbar.includes(e)||(this.#e.toolbar.push(e),this.render())}#x(e){this.#e.toolbar=this.#e.toolbar.filter(t=>t!==e),this.render()}#S(e){this.#e.bubble.items.includes(e)||(this.#e.bubble.items.push(e),this.render())}#C(e){this.#e.bubble.items=this.#e.bubble.items.filter(t=>t!==e),this.render()}#w(){if(!this.#l)return;this.#l.replaceChildren();let e=(e,t)=>{let n=document.createElement(`input`);n.type=`hidden`,n.name=e,n.value=t,this.#l?.append(n)};this.#e.vocabulary.nodes.forEach(t=>e(`vocabularyNodes[]`,t)),this.#e.vocabulary.marks.forEach(t=>e(`vocabularyMarks[]`,t)),this.#e.headings.levels.forEach(t=>e(`headingLevels[]`,String(t))),e(`defaultHeadingLevel`,String(this.#e.headings.defaultLevel)),e(`toolbarJson`,JSON.stringify(this.#e.toolbar)),e(`bubbleJson`,JSON.stringify(this.#e.bubble)),e(`advancedConfig`,this.#u())}#T(e,r,i){return`
            <span
                class="vizy-editor-config-chip${e.kind===`presentation`?` presentation`:``}"
                draggable="true"
                data-chip-id="${e.id}"
                data-chip-list="${r}"
                data-chip-index="${i}"
            >
                ${n(e.label)}
                <button type="button" data-remove-chip="${r}" data-remove-id="${n(e.id)}" aria-label="${t(`app`,`Remove`)}">×</button>
            </span>
        `}#E(e){e.querySelectorAll(`[data-chip-id]`).forEach(e=>{e.addEventListener(`dragstart`,t=>{this.#s=e.dataset.chipId??null,e.classList.add(`dragging`),t.dataTransfer&&(t.dataTransfer.effectAllowed=`move`,t.dataTransfer.setData(`text/plain`,e.dataset.chipId??``))}),e.addEventListener(`dragend`,()=>{e.classList.remove(`dragging`),this.#s=null,this.#c=null})}),e.querySelectorAll(`[data-drop-zone]`).forEach(e=>{e.addEventListener(`dragover`,t=>{t.preventDefault(),this.#c=e.dataset.dropZone??null}),e.addEventListener(`drop`,t=>{t.preventDefault();let n=this.#s??t.dataTransfer?.getData(`text/plain`)??``,r=e.dataset.dropZone;if(!(!n||!r)){if(r===`toolbar-pool`){this.#x(n);return}if(r===`bubble-pool`){this.#C(n);return}r===`toolbar`&&this.#b(n),r===`bubble`&&this.#S(n)}})}),e.querySelectorAll(`[data-remove-chip]`).forEach(e=>{e.onclick=()=>{let t=e.getAttribute(`data-remove-chip`),n=e.getAttribute(`data-remove-id`);n&&(t===`toolbar`&&this.#x(n),t===`bubble`&&this.#C(n))}}),e.querySelectorAll(`[data-pool-add]`).forEach(e=>{e.onclick=()=>{let t=e.getAttribute(`data-pool-add`),n=e.getAttribute(`data-pool-id`);n&&(t===`toolbar`&&this.#b(n),t===`bubble`&&this.#S(n))}})}render(){let e=this.querySelector(`[data-vizy-config-host]`);if(!e)return;let r=this.#e.toolbar.map((e,t)=>{let n=this.#f(e,this.#t);return n?this.#T(n,`toolbar`,t):``}).join(``),i=this.#e.bubble.items.map((e,t)=>{let n=this.#f(e,this.#n);return n?this.#T(n,`bubble`,t):``}).join(``);e.innerHTML=`
            <div class="vizy-editor-config">
                <div class="vizy-editor-config-tabs">
                    <button type="button" class="${this.#i===`visual`?`active`:``}" data-mode="visual">${t(`vizy`,`Visual`)}</button>
                    <button type="button" class="${this.#i===`advanced`?`active`:``}" data-mode="advanced">${t(`vizy`,`Advanced`)}</button>
                </div>

                ${this.#i===`visual`?`
                    <div class="vizy-editor-config-panel">
                        <section class="vizy-editor-config-section">
                            <h3>${t(`vizy`,`Allowed content`)}</h3>
                            <p class="instructions">${t(`vizy`,`What this editor is allowed to understand. This governs pasted and imported content as well as the toolbar, so a capability can be allowed without being given a button.`)}</p>

                            <div class="vizy-editor-config-subhead">${t(`vizy`,`Blocks and objects`)}</div>
                            <div class="vizy-editor-config-checkboxes">
                                ${this.#r.nodes.map(e=>`
                                    <label>
                                        <input type="checkbox" data-vocab-kind="nodes" value="${n(e.value)}" ${this.#e.vocabulary.nodes.includes(e.value)?`checked`:``}>
                                        ${n(e.label)}
                                    </label>
                                `).join(``)}
                            </div>

                            <div class="vizy-editor-config-subhead">${t(`vizy`,`Inline formatting`)}</div>
                            <div class="vizy-editor-config-checkboxes">
                                ${this.#r.marks.map(e=>`
                                    <label>
                                        <input type="checkbox" data-vocab-kind="marks" value="${n(e.value)}" ${this.#e.vocabulary.marks.includes(e.value)?`checked`:``}>
                                        ${n(e.label)}
                                    </label>
                                `).join(``)}
                            </div>
                        </section>

                        ${this.#r.headingAvailable?`
                            <section class="vizy-editor-config-section">
                                <h3>${t(`vizy`,`Headings`)}</h3>
                                <label class="vizy-editor-config-toggle">
                                    <input type="checkbox" data-headings-enabled ${this.#_()?`checked`:``}>
                                    ${t(`vizy`,`Allow headings`)}
                                </label>

                                <div class="vizy-editor-config-checkboxes"${this.#_()?``:` hidden`}>
                                    ${[1,2,3,4,5,6].map(e=>`
                                        <label>
                                            <input type="checkbox" data-heading-level="${e}" ${this.#e.headings.levels.includes(e)?`checked`:``}>
                                            H${e}
                                        </label>
                                    `).join(``)}
                                </div>
                                <label class="vizy-editor-config-default-heading"${this.#_()?``:` hidden`}>
                                    ${t(`vizy`,`Default level`)}
                                    <select data-default-heading>
                                        ${this.#e.headings.levels.map(e=>`
                                            <option value="${e}" ${this.#e.headings.defaultLevel===e?`selected`:``}>H${e}</option>
                                        `).join(``)}
                                    </select>
                                </label>
                            </section>
                        `:``}

                        <section class="vizy-editor-config-section vizy-editor-config-toolbar-builder">
                            <h3>${t(`vizy`,`Toolbar`)}</h3>
                            <p class="instructions">${t(`vizy`,`Drag toolbar items into the editor.`)}</p>
                            <div class="vizy-editor-config-pool-label">${t(`vizy`,`Available items`)}</div>
                            <div class="vizy-editor-config-pool" data-drop-zone="toolbar-pool">
                                ${this.#p().map(e=>`
                                    <button type="button" class="vizy-editor-config-chip ${e.kind===`presentation`?`presentation`:``}" data-pool-add="toolbar" data-pool-id="${n(e.id)}">+ ${n(e.label)}</button>
                                `).join(``)}
                            </div>
                            <div class="vizy-editor-config-strip-label">${t(`vizy`,`Active toolbar`)}</div>
                            <div class="vizy-editor-config-strip" data-drop-zone="toolbar">${r}</div>
                        </section>

                        <section class="vizy-editor-config-section vizy-editor-config-toolbar-builder">
                            <h3>${t(`vizy`,`Bubble Menu`)}</h3>
                            <label class="vizy-editor-config-bubble-toggle">
                                <input type="checkbox" data-bubble-enabled ${this.#e.bubble.enabled?`checked`:``}>
                                ${t(`vizy`,`Enabled`)}
                            </label>
                            <div class="vizy-editor-config-pool-label">${t(`vizy`,`Available items`)}</div>
                            <div class="vizy-editor-config-pool" data-drop-zone="bubble-pool">
                                ${this.#m().map(e=>`
                                    <button type="button" class="vizy-editor-config-chip" data-pool-add="bubble" data-pool-id="${n(e.id)}">+ ${n(e.label)}</button>
                                `).join(``)}
                            </div>
                            <div class="vizy-editor-config-strip-label">${t(`vizy`,`Active bubble items`)}</div>
                            <div class="vizy-editor-config-strip" data-drop-zone="bubble">${i}</div>
                        </section>
                    </div>
                `:`
                    <div class="vizy-editor-config-advanced">
                        <label>
                            <span class="vizy-editor-config-strip-label">${t(`vizy`,`Advanced configuration JSON`)}</span>
                            <textarea data-advanced-json>${n(this.#a)}</textarea>
                        </label>
                        ${this.#o?`<p class="vizy-editor-config-error">${this.#o}</p>`:``}
                    </div>
                `}
            </div>
        `,e.querySelectorAll(`[data-mode]`).forEach(e=>{e.onclick=()=>this.#h(e.dataset.mode)}),e.querySelectorAll(`[data-vocab-kind]`).forEach(e=>{e.onchange=()=>this.#g(e.dataset.vocabKind,e.value,e.checked)});let a=e.querySelector(`[data-headings-enabled]`);a&&(a.onchange=()=>this.#v(a.checked)),e.querySelectorAll(`[data-heading-level]`).forEach(e=>{e.onchange=()=>this.#y(Number(e.dataset.headingLevel),e.checked)});let o=e.querySelector(`[data-default-heading]`);o&&(o.onchange=()=>{this.#e.headings.defaultLevel=Number(o.value),this.render()});let s=e.querySelector(`[data-bubble-enabled]`);s&&(s.onchange=()=>{this.#e.bubble.enabled=s.checked,this.render()});let c=e.querySelector(`[data-advanced-json]`);c&&(c.oninput=()=>{this.#a=c.value}),this.#E(e),this.#w()}};customElements.get(`vizy-editor-config-settings`)||customElements.define(`vizy-editor-config-settings`,r);
//# sourceMappingURL=editor-config-settings-BiSPBoIh.js.map