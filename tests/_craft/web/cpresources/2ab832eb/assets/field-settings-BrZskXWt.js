function e(e,t){return window.Craft?.t(e,t)??t}function t(){return crypto.randomUUID()}var n=class extends HTMLElement{#e={groups:[],blockTypes:{},availableBlockTypes:[]};#t=null;#n=null;#r=null;#i=``;#a=`blockTypePickerGroups`;#o=``;connectedCallback(){this.#n=this.querySelector(`[data-vizy-picker-sync]`),this.#r=this.querySelector(`[data-vizy-block-editors]`),this.#i=this.getAttribute(`data-panel-url`)??``,this.#a=this.getAttribute(`data-picker-groups-name`)??this.#a,this.#o=this.getAttribute(`data-settings-namespace`)??``;let e=this.getAttribute(`data-initial`);e&&(this.#e=JSON.parse(e)),Object.keys(this.#e.blockTypes).forEach(e=>this.#d(e));let t=this.#e.groups.flatMap(e=>e.blockTypeUids)[0]??null;t&&(this.#t=t,this.#u(t)),this.render();let n=this.closest(`form`);n&&!n.dataset.vizyPickerSyncBound&&(n.dataset.vizyPickerSyncBound=`1`,n.addEventListener(`submit`,()=>this.#f()))}get selectedUid(){return this.#t}selectBlock(e){this.#t=e,this.#u(e),this.render()}addGroup(){this.#e.groups.push({id:t(),name:e(`vizy`,`Blocks`),blockTypeUids:[]}),this.#t=null,this.render(),this.#f()}deleteGroup(e){this.#e.groups=this.#e.groups.filter(t=>t.id!==e),this.#t=null,this.render(),this.#f()}async addBlock(t){let n=crypto.randomUUID(),r=this.#e.groups.find(e=>e.id===t);r&&(await this.#s(n),this.#e.blockTypes[n]={uid:n,name:e(`vizy`,`New Block`),handle:``,icon:null},r.blockTypeUids.push(n),this.#t=n,this.render(),this.#f(),this.#u(n),this.#d(n))}async addExistingBlock(e,t){let n=this.#e.groups.find(t=>t.id===e),r=this.#e.availableBlockTypes.find(e=>e.uid===t);!n||!r||this.#c().has(t)||(await this.#s(t),this.#e.blockTypes[t]={...r},n.blockTypeUids.push(t),this.#t=t,this.render(),this.#f(),this.#u(t),this.#d(t))}async#s(e){if(!this.#i||!this.#r||this.#r.querySelector(`[data-vizy-block-editor="${e}"]`))return;let t=new URL(this.#i,window.location.origin);t.searchParams.set(`uid`,e),this.#o&&t.searchParams.set(`namespace`,this.#o);let n=await fetch(t.toString(),{headers:{"X-Requested-With":`XMLHttpRequest`}});if(!n.ok)return;let r=await n.text(),i=document.createElement(`div`);i.innerHTML=r;let a=i.firstElementChild;a instanceof HTMLElement&&this.#r.append(a)}#c(){return new Set(this.#e.groups.flatMap(e=>e.blockTypeUids))}#l(e){let t=this.#c();return this.#e.availableBlockTypes.filter(e=>!t.has(e.uid))}removeBlock(e,t){let n=this.#e.groups.find(t=>t.id===e);n&&(n.blockTypeUids=n.blockTypeUids.filter(e=>e!==t),this.#t===t&&(this.#t=null,this.#u(null)),this.render(),this.#f())}renameGroup(e,t){let n=this.#e.groups.find(t=>t.id===e);n&&(n.name=t,this.#f())}#u(e){if(!this.#r)return;this.#r.querySelectorAll(`[data-vizy-block-editor]`).forEach(t=>{t.hidden=e===null||t.dataset.vizyBlockEditor!==e});let t=this.querySelector(`[data-vizy-editor-empty]`);t&&(t.hidden=e!==null)}#d(t){let n=this.#r?.querySelector(`[data-vizy-block-editor="${t}"]`);if(!n)return;let r=n.querySelector(`input[data-vizy-block-name]`),i=n.querySelector(`input[data-vizy-block-handle]`),a=n.querySelector(`[data-vizy-block-title]`),o=this.#e.blockTypes[t];!r||!o||(r.addEventListener(`input`,()=>{o.name=r.value||e(`vizy`,`New Block`),a&&(a.textContent=o.name),i&&!i.dataset.touched&&(i.value=o.name.toLowerCase().replace(/[^a-z0-9]+/g,``).slice(0,64)),this.render()}),i?.addEventListener(`input`,()=>{i&&(i.dataset.touched=`1`)}))}#f(){this.#n&&(this.#n.replaceChildren(),this.#e.groups.forEach((e,t)=>{let n=document.createElement(`input`);n.type=`hidden`,n.name=`${this.#a}[${t}][name]`,n.value=e.name,this.#n?.append(n),e.blockTypeUids.forEach(e=>{let n=document.createElement(`input`);n.type=`hidden`,n.name=`${this.#a}[${t}][blockTypeUids][]`,n.value=e,this.#n?.append(n)})}))}#p(e){return this.#e.blockTypes[e]?.name||e}#m(e){let t=this.#e.blockTypes[e]?.icon;return t?t.length<=2?t:`◆`:`▢`}render(){let t=this.querySelector(`[data-vizy-workspace]`);if(!t)return;let n=this.#e.groups.map(t=>`
            <div class="vui-block-group" data-group-id="${t.id}">
                <div class="vui-block-items-header">
                    <span class="vui-block-items-header-text" contenteditable="true" data-group-name="${t.id}">${t.name}</span>
                    <button type="button" class="vui-block-items-header-delete" data-delete-group="${t.id}">${e(`app`,`Delete`)}</button>
                </div>
                <div class="vui-block-items">
                    ${t.blockTypeUids.map(e=>`
                        <button type="button" class="vui-block-item ${this.#t===e?`active`:``}" data-select-block="${e}">
                            <span class="vui-block-item-icon">${this.#m(e)}</span>
                            <span class="vui-block-item-heading">${this.#p(e)}</span>
                        </button>
                    `).join(``)}
                    <button type="button" class="vui-block-item vui-block-new-item" data-add-block="${t.id}">
                        <span class="vui-block-item-icon">+</span>
                        <span class="vui-block-item-heading">${e(`vizy`,`New Block`)}</span>
                    </button>
                </div>
                ${this.#l(t.id).length?`
                    <label class="vui-block-existing-picker">
                        <span class="vui-block-existing-picker-label">${e(`vizy`,`Add existing block type`)}</span>
                        <select data-pick-existing="${t.id}">
                            <option value="">${e(`vizy`,`Choose a global Block Type…`)}</option>
                            ${this.#l(t.id).map(e=>`
                                <option value="${e.uid}">${e.name} (${e.handle})</option>
                            `).join(``)}
                        </select>
                    </label>
                `:``}
            </div>
        `).join(``),r=t.querySelector(`[data-vizy-popover-inner]`);r&&(r.innerHTML=`
                ${n}
                ${this.#e.groups.length?`<hr>`:``}
                <button type="button" class="vui-block-item vui-block-new-item vui-block-new-group" data-add-group>
                    <span class="vui-block-item-icon">+</span>
                    <span class="vui-block-item-heading">${e(`vizy`,`Add Group`)}</span>
                </button>
            `),this.#h(),this.#f()}#h(){this.querySelectorAll(`[data-add-group]`).forEach(e=>{e.onclick=()=>this.addGroup()}),this.querySelectorAll(`[data-add-block]`).forEach(e=>{e.onclick=()=>{let t=e.getAttribute(`data-add-block`);t&&this.addBlock(t)}}),this.querySelectorAll(`[data-pick-existing]`).forEach(e=>{e.onchange=()=>{let t=e.getAttribute(`data-pick-existing`),n=e.value;!t||!n||(this.addExistingBlock(t,n),e.value=``)}}),this.querySelectorAll(`[data-select-block]`).forEach(e=>{e.onclick=()=>{let t=e.getAttribute(`data-select-block`);t&&this.selectBlock(t)}}),this.querySelectorAll(`[data-delete-group]`).forEach(e=>{e.onclick=()=>{let t=e.getAttribute(`data-delete-group`);t&&this.deleteGroup(t)}}),this.querySelectorAll(`[data-group-name]`).forEach(t=>{t.onblur=()=>{let n=t.getAttribute(`data-group-name`);n&&this.renameGroup(n,t.textContent?.trim()||e(`vizy`,`Blocks`))}}),this.querySelectorAll(`[data-vizy-block-delete]`).forEach(e=>{e.onclick=()=>{let t=e.getAttribute(`data-vizy-block-delete`);if(!t)return;let n=this.#e.groups.find(e=>e.blockTypeUids.includes(t));n&&this.removeBlock(n.id,t)}})}};customElements.get(`vizy-field-settings`)||customElements.define(`vizy-field-settings`,n);
//# sourceMappingURL=field-settings-BrZskXWt.js.map