import{_ as e,h as t,m as n}from"./tooltip-BHhRUPiD.js";var r=class r{#e;#t=[];#n=[];#r;#i={x:0,y:0};#a=null;#o=null;#s=null;#c=!0;#l=0;#u={x:0,y:0};static#d=10;constructor(t){this.#r=t,this.#e=new n({plugins:t=>[...t,e.configure({dropAnimation:null})]}),this.#w()}refresh(){this.#k(),this.#f(this.#r.availableList(),`available`),this.#f(this.#r.activeList(),`active`)}destroy(){this.#n.forEach(e=>e()),this.#n=[],this.#C(),this.#k(),this.#e.destroy()}#f(e,n){e&&this.#p(e).forEach((e,r)=>{let i=e.dataset.toolbarItem;i&&this.#t.push(new t({id:`${this.#r.type}-${n}-${r}-${i}`,element:e,type:this.#r.type,data:{itemId:i,list:n,index:r}},this.#e))})}#p(e){return[...e.querySelectorAll(`[data-toolbar-item]`)]}#m=[];#h(){let e=this.#r.activeList(),t=this.#o;if(!e)return;let n=e.getBoundingClientRect();this.#m=this.#p(e).filter(e=>e!==t).map(e=>{let t=e.getBoundingClientRect();return{top:t.top-n.top,bottom:t.bottom-n.top,middle:t.left+t.width/2-n.left}})}#g(){let e=this.#r.activeList();if(!e)return 0;let t=e.getBoundingClientRect(),n=this.#i.x-t.left,r=this.#i.y-t.top,i=0;for(let e of this.#m){if(!(r>e.bottom||!(r<e.top)&&n>e.middle))break;i+=1}return i}#_(){let e=this.#r.activeList(),t=this.#o;if(!e||!t)return;let n=this.#p(e),r=n.filter(e=>e!==t),i=this.#g();if(this.#l=i,n.indexOf(t)===i)return;let a=r[i]??e.querySelector(`[data-builder-tail]`);e.insertBefore(t,a??null)}#v(){if(!this.#o)return;let e=this.#b(this.#i.x,this.#i.y);e&&this.#_(),this.#y(!e)}#y(e){let t=this.#o;if(!t||e===this.#c)return;if(this.#c=e,t.classList.toggle(`is-outside-drop-zone`,e),!e){t.style.marginInlineEnd=``;return}let n=t.parentElement,r=n&&parseFloat(getComputedStyle(n).columnGap)||0;t.style.marginInlineEnd=`-${t.getBoundingClientRect().width+r}px`}#b(e,t){let n=this.#r.activeList();if(!n)return!1;let r=n.getBoundingClientRect();return e>=r.left&&e<=r.right&&t>=r.top&&t<=r.bottom}#x(e){let t=this.#S();if(!t)return;let n=e.cloneNode(!0);n.removeAttribute(`id`),n.removeAttribute(`aria-describedby`),n.removeAttribute(`aria-roledescription`),n.setAttribute(`aria-hidden`,`true`),n.classList.add(`is-drag-helper`);let i=e.getBoundingClientRect(),a=this.#u.x-i.left+r.#d,o=this.#u.y-i.top+r.#d;n.style.setProperty(`transform`,`translate(${a}px, ${o}px)`,`important`),document.body.appendChild(n),this.#a=n,t.overlay=n}#S(){return this.#e.plugins.find(t=>t instanceof e)}#C(){let e=this.#S();e&&(e.overlay=void 0),this.#a?.remove(),this.#a=null}#w(){let e=e=>{this.#i={x:e.clientX,y:e.clientY},this.#v()},t=e=>{this.#u={x:e.clientX,y:e.clientY},this.#i={x:e.clientX,y:e.clientY}};document.addEventListener(`pointerdown`,t,!0),document.addEventListener(`pointermove`,e,!0),this.#n.push(()=>{document.removeEventListener(`pointerdown`,t,!0),document.removeEventListener(`pointermove`,e,!0)}),this.#n.push(this.#e.monitor.addEventListener(`beforedragstart`,e=>{let{source:t}=e.operation;t?.element instanceof HTMLElement&&this.#x(t.element)}),this.#e.monitor.addEventListener(`dragstart`,e=>{this.#r.container()?.classList.add(`is-sorting`);let{source:t}=e.operation;t?.element instanceof HTMLElement&&(this.#o=t.element,this.#s=t.data,this.#o.classList.add(`is-dragging`),this.#D(),this.#c=!1,this.#y(!0),this.#h(),this.#v())}),this.#e.monitor.addEventListener(`dragend`,e=>{let t=this.#s,n=!this.#c,r=this.#l;if(this.#T(),!t?.itemId||e.canceled){this.#E(this.#r.onRevert);return}if(!n){if(t.list!==`active`){this.#E(this.#r.onRevert);return}this.#E(()=>this.#r.onDrop({itemId:t.itemId,from:`active`,to:`available`,fromIndex:t.index,index:t.index}));return}if(t.list===`active`&&r===t.index){this.#E(this.#r.onRevert);return}this.#E(()=>this.#r.onDrop({itemId:t.itemId,from:t.list,to:`active`,fromIndex:t.index,index:r}))}))}#T(){let e=this.#r.container();e?.classList.remove(`is-sorting`),e?.querySelectorAll(`.is-dragging`).forEach(e=>{e.classList.remove(`is-dragging`,`is-outside-drop-zone`),e.style.marginInlineEnd=``}),this.#o=null,this.#s=null,this.#c=!0,this.#O(),this.#C()}#E(e){requestAnimationFrame(()=>e())}#D(){let e=this.#r.availableList();e&&(e.style.minHeight=`${e.getBoundingClientRect().height}px`)}#O(){let e=this.#r.availableList();e&&(e.style.minHeight=``)}#k(){this.#t.forEach(e=>{e.unregister(),e.destroy()}),this.#t=[]}},i=[2,3,4];function a(e,t){return window.Craft?.t(e,t)??t}function o(e){return e.replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e])}var s=class extends HTMLElement{#e={vocabulary:{nodes:[],marks:[]},headings:{levels:[2,3,4],defaultLevel:2},toolbar:[],bubble:{enabled:!0,items:[]}};#t=[];#n=[];#r={nodes:[],marks:[],headingAvailable:!1};#i=`visual`;#a=``;#o=``;#s=null;#c=new Map;#l;#u=0;connectedCallback(){this.#s=this.querySelector(`[data-vizy-config-sync]`),this.#P();let e=this.getAttribute(`data-initial`);if(e){let t=JSON.parse(e);this.#e=t.config,this.#t=t.toolbarCatalog,this.#n=t.bubbleCatalog,this.#r=t.contentCatalog}this.#a=this.#d();let t=this.closest(`form`);t&&!t.dataset.vizyConfigBound&&(t.dataset.vizyConfigBound=`1`,t.addEventListener(`submit`,()=>{this.#i===`advanced`&&this.#f(),this.#O()})),this.render()}disconnectedCallback(){this.#c.forEach(e=>e.destroy()),this.#c.clear()}#d(){return JSON.stringify({vocabulary:this.#e.vocabulary,headings:this.#e.headings,toolbar:this.#e.toolbar,bubble:this.#e.bubble},null,2)}#f(){try{let e=JSON.parse(this.#a);return this.#e={vocabulary:{nodes:[...e.vocabulary?.nodes??[]],marks:[...e.vocabulary?.marks??[]]},headings:{levels:[...e.headings?.levels??[2,3,4]],defaultLevel:e.headings?.defaultLevel??2},toolbar:[...e.toolbar??[]],bubble:{enabled:e.bubble?.enabled??!0,items:[...e.bubble?.items??[]]}},this.#o=``,!0}catch{return this.#o=a(`vizy`,`Invalid JSON`),!1}}#p(e,t){return t.find(t=>t.id===e)}#m(){let e=new Set(this.#e.toolbar);return this.#t.filter(t=>e.has(t.id)&&!this.#x(t.id)?!1:t.kind===`presentation`?!0:t.kind===`mark`?this.#e.vocabulary.marks.includes(t.id):t.kind===`node`&&this.#e.vocabulary.nodes.includes(t.id))}#h(){let e=new Set(this.#e.bubble.items);return this.#n.filter(t=>!e.has(t.id)&&this.#e.vocabulary.marks.includes(t.id))}#g(e){e===`visual`&&this.#i===`advanced`&&!this.#f()||(e===`advanced`&&(this.#a=this.#d(),this.#o=``),this.#i=e,this.render())}#_(e,t,n){let r=new Set(this.#e.vocabulary[e]);n?r.add(t):r.delete(t),this.#e.vocabulary[e]=[...r],this.#e.toolbar=this.#e.toolbar.filter(e=>{let t=this.#p(e,this.#t);return!t||t.kind===`presentation`?!0:t.kind===`mark`?this.#e.vocabulary.marks.includes(e):t.kind===`node`&&this.#e.vocabulary.nodes.includes(e)}),this.#e.bubble.items=this.#e.bubble.items.filter(e=>this.#e.vocabulary.marks.includes(e)),this.render()}#v(){return this.#e.vocabulary.nodes.includes(`heading`)}#y(e){e&&this.#e.headings.levels.length===0&&(this.#e.headings.levels=[...i],this.#e.headings.defaultLevel=i[0]),this.#_(`nodes`,`heading`,e)}#b(e,t){let n=new Set(this.#e.headings.levels);t?n.add(e):(!this.#v()||n.size>1)&&n.delete(e),this.#e.headings.levels=[...n].sort((e,t)=>e-t),this.#e.headings.levels.includes(this.#e.headings.defaultLevel)||(this.#e.headings.defaultLevel=this.#e.headings.levels[0]??2),this.render()}#x(e){return e===`separator`}#S(e,t){!this.#x(e)&&this.#e.toolbar.includes(e)||(t===void 0?this.#e.toolbar.push(e):this.#e.toolbar.splice(t,0,e),this.render())}#C(e,t){let n=t!==void 0&&this.#e.toolbar[t]===e?t:this.#e.toolbar.indexOf(e);n!==-1&&(this.#e.toolbar.splice(n,1),this.render())}#w(e,t){this.#e.bubble.items.includes(e)||(t===void 0?this.#e.bubble.items.push(e):this.#e.bubble.items.splice(t,0,e),this.render())}#T(e){this.#e.bubble.items=this.#e.bubble.items.filter(t=>t!==e),this.render()}#E(e,t,n){let r=e===`toolbar`?this.#e.toolbar:this.#e.bubble.items;if(t<0||n<0||t>=r.length||n>=r.length)return;let[i]=r.splice(t,1);r.splice(n,0,i),this.render()}#D(e,t){if(t.to===`available`){if(t.from!==`active`)return;e===`toolbar`?this.#C(t.itemId,t.fromIndex):this.#T(t.itemId);return}if(t.from===`available`){e===`toolbar`?this.#S(t.itemId,t.index):this.#w(t.itemId,t.index);return}this.#E(e,t.fromIndex,t.index)}#O(){if(!this.#s)return;this.#s.replaceChildren();let e=(e,t)=>{let n=document.createElement(`input`);n.type=`hidden`,n.name=e,n.value=t,this.#s?.append(n)};this.#e.vocabulary.nodes.forEach(t=>e(`vocabularyNodes[]`,t)),this.#e.vocabulary.marks.forEach(t=>e(`vocabularyMarks[]`,t)),this.#e.headings.levels.forEach(t=>e(`headingLevels[]`,String(t))),e(`defaultHeadingLevel`,String(this.#e.headings.defaultLevel)),e(`toolbarJson`,JSON.stringify(this.#e.toolbar)),e(`bubbleJson`,JSON.stringify(this.#e.bubble)),e(`advancedConfig`,this.#d())}#k(e){return e.icon?e.icon:`<span class="vizy-control-text">${o(e.label)}</span>`}#A(e,t,n){return`
            <button
                type="button"
                class="${[`vizy-control`,e.id===`separator`?`is-separator`:``,e.icon||e.id===`separator`?``:`is-text`,n===`available`?`is-available`:``].filter(Boolean).join(` `)}"
                aria-label="${o(e.label)}"
                data-toolbar-item="${o(e.id)}"
                data-toolbar-list="${t}"
                data-toolbar-variant="${n}"
            >${e.id===`separator`?``:this.#k(e)}</button>
        `}#j(e){return`
            <span class="vizy-editor-config-empty" data-empty-placeholder>
                ${o(e)}
            </span>
        `}#M(){return`<span class="vizy-editor-config-tail" data-builder-tail></span>`}#N(e,t,n=!0){let r=e||this.#j(t);return n?r+this.#M():r}#P(){let e=document.createElement(`pk-tooltip`);e.setAttribute(`trigger`,`manual`),e.setAttribute(`placement`,`top`),this.appendChild(e),this.#l=e;let t=e=>e instanceof Element?e.closest(`.vizy-control`):null,n=n=>{let r=t(n.target),i=r?.getAttribute(`aria-label`);if(!r||!i||r.closest(`.is-sorting`)||r.hasAttribute(`data-dnd-placeholder`)){e.hide();return}r.id||=`vizy-control-${++this.#u}`,e.for=r.id,e.content=i,e.show()},r=()=>{e.hide()};this.addEventListener(`pointerover`,n),this.addEventListener(`focusin`,n),this.addEventListener(`pointerout`,r),this.addEventListener(`focusout`,r),this.addEventListener(`pointerdown`,r)}#F(e){e.querySelectorAll(`[data-toolbar-item]`).forEach((e,t)=>{e.onclick=()=>{let n=e.dataset.toolbarItem,r=e.dataset.toolbarList;if(!n||!r)return;if(e.dataset.toolbarVariant===`available`){r===`toolbar`?this.#S(n):this.#w(n);return}let i=[...e.parentElement?.children??[]].indexOf(e);r===`toolbar`?this.#C(n,i===-1?t:i):this.#T(n)}})}#I(e){[`toolbar`,`bubble`].forEach(t=>{let n=()=>e.querySelector(`[data-builder="${t}"]`);if(!n()){this.#c.get(t)?.destroy(),this.#c.delete(t);return}let i=this.#c.get(t);i||(i=new r({container:n,type:`vizy-${t}-control`,availableList:()=>e.querySelector(`[data-builder-list="${t}-available"]`),activeList:()=>e.querySelector(`[data-builder-list="${t}-active"]`),onDrop:e=>this.#D(t,e),onRevert:()=>this.render()}),this.#c.set(t,i)),i.refresh()})}render(){let e=this.querySelector(`[data-vizy-config-host]`);if(!e)return;let t=this.#e.toolbar.map(e=>{let t=this.#p(e,this.#t);return t?this.#A(t,`toolbar`,`active`):``}).join(``),n=this.#e.bubble.items.map(e=>{let t=this.#p(e,this.#n);return t?this.#A(t,`bubble`,`active`):``}).join(``);e.innerHTML=`
            <div class="vizy-editor-config">
                <div class="vizy-editor-config-tabs">
                    <button type="button" class="${this.#i===`visual`?`active`:``}" data-mode="visual">${a(`vizy`,`Visual`)}</button>
                    <button type="button" class="${this.#i===`advanced`?`active`:``}" data-mode="advanced">${a(`vizy`,`Advanced`)}</button>
                </div>

                ${this.#i===`visual`?`
                    <div class="vizy-editor-config-panel">
                        <section class="vizy-editor-config-section">
                            <h3>${a(`vizy`,`Allowed content`)}</h3>
                            <p class="instructions">${a(`vizy`,`What this editor is allowed to understand. This governs pasted and imported content as well as the toolbar, so a capability can be allowed without being given a button.`)}</p>

                            <div class="vizy-editor-config-subhead">${a(`vizy`,`Blocks and objects`)}</div>
                            <div class="vizy-editor-config-checkboxes">
                                ${this.#r.nodes.map(e=>`
                                    <label>
                                        <input type="checkbox" data-vocab-kind="nodes" value="${o(e.value)}" ${this.#e.vocabulary.nodes.includes(e.value)?`checked`:``}>
                                        ${o(e.label)}
                                    </label>
                                `).join(``)}
                            </div>

                            <div class="vizy-editor-config-subhead">${a(`vizy`,`Inline formatting`)}</div>
                            <div class="vizy-editor-config-checkboxes">
                                ${this.#r.marks.map(e=>`
                                    <label>
                                        <input type="checkbox" data-vocab-kind="marks" value="${o(e.value)}" ${this.#e.vocabulary.marks.includes(e.value)?`checked`:``}>
                                        ${o(e.label)}
                                    </label>
                                `).join(``)}
                            </div>
                        </section>

                        ${this.#r.headingAvailable?`
                            <section class="vizy-editor-config-section">
                                <h3>${a(`vizy`,`Headings`)}</h3>
                                <label class="vizy-editor-config-toggle">
                                    <input type="checkbox" data-headings-enabled ${this.#v()?`checked`:``}>
                                    ${a(`vizy`,`Allow headings`)}
                                </label>

                                <div class="vizy-editor-config-checkboxes"${this.#v()?``:` hidden`}>
                                    ${[1,2,3,4,5,6].map(e=>`
                                        <label>
                                            <input type="checkbox" data-heading-level="${e}" ${this.#e.headings.levels.includes(e)?`checked`:``}>
                                            H${e}
                                        </label>
                                    `).join(``)}
                                </div>
                                <label class="vizy-editor-config-default-heading"${this.#v()?``:` hidden`}>
                                    ${a(`vizy`,`Default level`)}
                                    <select data-default-heading>
                                        ${this.#e.headings.levels.map(e=>`
                                            <option value="${e}" ${this.#e.headings.defaultLevel===e?`selected`:``}>H${e}</option>
                                        `).join(``)}
                                    </select>
                                </label>
                            </section>
                        `:``}

                        <section class="vizy-editor-config-section">
                            <h3>${a(`vizy`,`Toolbar`)}</h3>
                            <p class="instructions">${a(`vizy`,`Drag items into the toolbar below. Drag an item out of the toolbar to remove it.`)}</p>
                            <div class="vizy-editor-config-builder" data-builder="toolbar">
                                <div class="vizy-editor-config-group">
                                    <h4 class="vizy-editor-config-subhead">${a(`vizy`,`Available buttons`)}</h4>
                                    <div class="vizy-editor-config-available" data-builder-list="toolbar-available">
                                        ${this.#N(this.#m().map(e=>this.#A(e,`toolbar`,`available`)).join(``),a(`vizy`,`Everything is in the toolbar.`),!1)}
                                    </div>
                                </div>
                                <div class="vizy-editor-config-group is-preview">
                                    <h4 class="vizy-editor-config-subhead">${a(`vizy`,`Toolbar preview`)}</h4>
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
                                            ${this.#N(t,a(`vizy`,`Drag items here.`))}
                                        </div>
                                        <div class="vizy-editor-config-canvas" aria-hidden="true"></div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section class="vizy-editor-config-section">
                            <h3>${a(`vizy`,`Bubble Menu`)}</h3>
                            <label class="vizy-editor-config-toggle">
                                <input type="checkbox" data-bubble-enabled ${this.#e.bubble.enabled?`checked`:``}>
                                ${a(`vizy`,`Show a Bubble Menu on selection`)}
                            </label>
                            ${this.#e.bubble.enabled?`
                                <div class="vizy-editor-config-builder" data-builder="bubble">
                                    <div class="vizy-editor-config-group">
                                        <h4 class="vizy-editor-config-subhead">${a(`vizy`,`Available buttons`)}</h4>
                                        <div class="vizy-editor-config-available" data-builder-list="bubble-available">
                                            ${this.#N(this.#h().map(e=>this.#A(e,`bubble`,`available`)).join(``),a(`vizy`,`Everything is in the Bubble Menu.`),!1)}
                                        </div>
                                    </div>
                                    <div class="vizy-editor-config-group">
                                        <h4 class="vizy-editor-config-subhead">${a(`vizy`,`Bubble Menu preview`)}</h4>
                                        <div class="vizy-editor-config-active is-bubble" data-builder-list="bubble-active">
                                            ${this.#N(n,a(`vizy`,`Drag items here.`))}
                                        </div>
                                    </div>
                                </div>
                            `:``}
                        </section>
                    </div>
                `:`
                    <div class="vizy-editor-config-advanced">
                        <label>
                            <span class="vizy-editor-config-strip-label">${a(`vizy`,`Advanced configuration JSON`)}</span>
                            <textarea data-advanced-json>${o(this.#a)}</textarea>
                        </label>
                        ${this.#o?`<p class="vizy-editor-config-error">${this.#o}</p>`:``}
                    </div>
                `}
            </div>
        `,e.querySelectorAll(`[data-mode]`).forEach(e=>{e.onclick=()=>this.#g(e.dataset.mode)}),e.querySelectorAll(`[data-vocab-kind]`).forEach(e=>{e.onchange=()=>this.#_(e.dataset.vocabKind,e.value,e.checked)});let r=e.querySelector(`[data-headings-enabled]`);r&&(r.onchange=()=>this.#y(r.checked)),e.querySelectorAll(`[data-heading-level]`).forEach(e=>{e.onchange=()=>this.#b(Number(e.dataset.headingLevel),e.checked)});let i=e.querySelector(`[data-default-heading]`);i&&(i.onchange=()=>{this.#e.headings.defaultLevel=Number(i.value),this.render()});let s=e.querySelector(`[data-bubble-enabled]`);s&&(s.onchange=()=>{this.#e.bubble.enabled=s.checked,this.render()});let c=e.querySelector(`[data-advanced-json]`);c&&(c.oninput=()=>{this.#a=c.value}),this.#F(e),this.#I(e),this.#O()}};customElements.get(`vizy-editor-config-settings`)||customElements.define(`vizy-editor-config-settings`,s);
//# sourceMappingURL=editor-config-settings-rOmi-7JP.js.map