function e(e,t={}){return window.Craft?.t(`vizy`,e,t)??e}function t(e){let t=document.createElement(`div`);return t.textContent=e,t.innerHTML}var n=class extends HTMLElement{#e={groups:[],blockTypes:{},availableBlockTypes:[]};#t=null;#n=null;#r=null;#i=null;#a=`blockTypePickerGroups`;#o=null;connectedCallback(){this.#n=this.querySelector(`[data-vizy-picker-sync]`),this.#r=this.querySelector(`[data-vizy-block-detail]`),this.#i=this.querySelector(`[data-vizy-block-list]`),this.#a=this.getAttribute(`data-picker-groups-name`)??this.#a;let e=this.getAttribute(`data-initial`);e&&(this.#e=JSON.parse(e)),this.#t=this.#e.groups.flatMap(e=>e.blockTypeUids)[0]??null,this.render()}#s(e){return this.#e.groups.find(t=>t.id===e)}addGroup(){this.#e.groups.push({id:crypto.randomUUID(),name:e(`Blocks`),blockTypeUids:[],disabledBlockTypeUids:[]}),this.render()}deleteGroup(t){let n=this.#s(t);n&&(n.blockTypeUids.length>0&&!confirm(e(`Remove the “{name}” group? Its block types will no longer be available in this field, but the global block types are not deleted.`,{name:n.name}))||(this.#e.groups=this.#e.groups.filter(e=>e.id!==t),this.#t&&!this.#l().has(this.#t)&&(this.#t=null),this.render()))}renameGroup(t,n){let r=this.#s(t);r&&(r.name=n.trim()===``?e(`Blocks`):n.trim(),this.render())}moveGroup(e,t){let n=this.#e.groups.findIndex(t=>t.id===e),r=n+t;if(n===-1||r<0||r>=this.#e.groups.length)return;let[i]=this.#e.groups.splice(n,1);this.#e.groups.splice(r,0,i),this.render()}addExistingBlock(e,t){let n=this.#s(e),r=this.#e.availableBlockTypes.find(e=>e.uid===t);!n||!r||this.#l().has(t)||(this.#e.blockTypes[t]={...r},n.blockTypeUids.push(t),this.#t=t,this.render())}removeBlock(e){let t=this.#e.groups.find(t=>t.blockTypeUids.includes(e));t&&(t.blockTypeUids=t.blockTypeUids.filter(t=>t!==e),t.disabledBlockTypeUids=t.disabledBlockTypeUids.filter(t=>t!==e),this.#t===e&&(this.#t=null),this.render())}setBlockAvailability(e,t){let n=this.#e.groups.find(t=>t.blockTypeUids.includes(e));if(!n)return;let r=new Set(n.disabledBlockTypeUids);t?r.delete(e):r.add(e),n.disabledBlockTypeUids=[...r],this.render()}moveBlock(e,t,n){let r=this.#e.groups.find(t=>t.blockTypeUids.includes(e)),i=this.#s(t);if(!r||!i)return;let a=r.blockTypeUids.indexOf(e);r.blockTypeUids.splice(a,1);let o=n;r===i&&a<n&&--o,i.blockTypeUids.splice(Math.max(0,Math.min(o,i.blockTypeUids.length)),0,e),r!==i&&r.disabledBlockTypeUids.includes(e)&&(r.disabledBlockTypeUids=r.disabledBlockTypeUids.filter(t=>t!==e),i.disabledBlockTypeUids.push(e)),this.#t=e,this.render()}selectBlock(e){this.#t=e,this.render()}#c(e,t){let n=window.Craft;n?.CpScreenSlideout&&new n.CpScreenSlideout(`vizy/block-types/edit`,{params:e?{uid:e}:{}}).on(`submit`,e=>{let n=e.data?.blockType;if(!n?.uid)return;this.#e.blockTypes[n.uid]=n;let r=this.#e.availableBlockTypes.findIndex(e=>e.uid===n.uid);r===-1?this.#e.availableBlockTypes.push(n):this.#e.availableBlockTypes[r]=n;let i=t?this.#s(t):null;i&&!this.#l().has(n.uid)&&i.blockTypeUids.push(n.uid),this.#t=n.uid,this.render()})}#l(){return new Set(this.#e.groups.flatMap(e=>e.blockTypeUids))}#u(){let e=this.#l();return this.#e.availableBlockTypes.filter(t=>!e.has(t.uid))}#d(e){return this.#e.groups.some(t=>t.disabledBlockTypeUids.includes(e))}#f(n,r,i){let a=this.#e.blockTypes[r],o=a?.name??r,s=a?.handle??``,c=this.#d(r),l=a?.missing===!0;return`
            <li
                class="vizy-block-row${this.#t===r?` is-selected`:``}${c?` is-disabled`:``}${l?` is-missing`:``}"
                data-block-row="${r}"
                data-group-id="${n.id}"
                data-index="${i}"
                draggable="true"
            >
                <span class="vizy-block-row-handle" aria-hidden="true" data-drag-handle></span>

                <button type="button" class="vizy-block-row-main" data-select-block="${r}">
                    <span class="vizy-block-row-icon">${a?.iconSvg??``}</span>
                    <span class="vizy-block-row-text">
                        <span class="vizy-block-row-name">${t(o)}</span>
                        <span class="vizy-block-row-meta code">${t(s)}</span>
                    </span>
                    ${l?`<span class="vizy-block-row-warning">${e(`Missing`)}</span>`:``}
                </button>

                <div class="vizy-block-row-actions">
                    <div
                        class="lightswitch${c?``:` on`} small"
                        role="switch"
                        tabindex="0"
                        aria-checked="${c?`false`:`true`}"
                        aria-label="${e(`Available in this field`)}"
                        title="${e(`Available in this field`)}"
                        data-toggle-block="${r}"
                    >
                        <div class="lightswitch-container">
                            <div class="handle"></div>
                        </div>
                    </div>
                    <button
                        type="button"
                        class="delete icon"
                        title="${e(`Remove from field`)}"
                        aria-label="${e(`Remove from field`)}"
                        data-remove-block="${r}"
                    ></button>
                </div>
            </li>
        `}#p(n,r){let i=this.#u();return`
            <section class="vizy-block-group" data-group-section="${n.id}">
                <header class="vizy-block-group-header">
                    <span
                        class="vizy-block-group-name"
                        contenteditable="true"
                        role="textbox"
                        aria-label="${e(`Group name`)}"
                        data-group-name="${n.id}"
                    >${t(n.name)}</span>

                    <div class="vizy-block-group-actions">
                        <button type="button" class="btn small" title="${e(`Move group up`)}" aria-label="${e(`Move group up`)}" data-move-group-up="${n.id}" ${r===0?`disabled`:``}>&uarr;</button>
                        <button type="button" class="btn small" title="${e(`Move group down`)}" aria-label="${e(`Move group down`)}" data-move-group-down="${n.id}" ${r===this.#e.groups.length-1?`disabled`:``}>&darr;</button>
                        <button type="button" class="delete icon" title="${e(`Delete group`)}" aria-label="${e(`Delete group`)}" data-delete-group="${n.id}"></button>
                    </div>
                </header>

                <ul class="vizy-block-rows" data-group-drop="${n.id}">
                    ${n.blockTypeUids.map((e,t)=>this.#f(n,e,t)).join(``)}
                    <li class="vizy-block-rows-end" data-group-drop-end="${n.id}"></li>
                </ul>

                <div class="vizy-block-group-footer">
                    <button type="button" class="btn add icon" data-new-block="${n.id}">${e(`New block type`)}</button>
                    ${i.length>0?`
                        <select data-pick-existing="${n.id}">
                            <option value="">${e(`Add an existing block type…`)}</option>
                            ${i.map(e=>`
                                <option value="${e.uid}">${t(e.name)} (${t(e.handle)})</option>
                            `).join(``)}
                        </select>
                    `:``}
                </div>
            </section>
        `}#m(){if(!this.#t)return`<p class="light">${e(`Select a block type to see its details.`)}</p>`;let n=this.#e.blockTypes[this.#t];if(!n)return`<p class="error">${e(`This block type is no longer available. It may have been deleted.`)}</p>`;let r=this.#d(n.uid);return`
            <div class="vizy-block-detail-header">
                <span class="vizy-block-detail-icon">${n.iconSvg??``}</span>
                <div>
                    <h2>${t(n.name)}</h2>
                    <p class="light code">${t(n.handle)}</p>
                </div>
            </div>

            <p class="warning with-icon">${e(`This is a global block type. Editing it affects every Vizy field that uses it.`)}</p>

            <dl class="vizy-block-detail-meta">
                <dt>${e(`Template`)}</dt>
                <dd>${n.template?`<code>${t(n.template)}</code>`:`<span class="light">${e(`None`)}</span>`}</dd>
                <dt>${e(`Content areas`)}</dt>
                <dd>${n.contentAreaCount}</dd>
                <dt>${e(`Available in this field`)}</dt>
                <dd>${e(r?`No`:`Yes`)}</dd>
            </dl>

            <div class="vizy-block-detail-actions">
                <button type="button" class="btn submit" data-edit-block="${n.uid}">${e(`Edit block type`)}</button>
            </div>
        `}render(){this.#i&&(this.#i.innerHTML=`
                ${this.#e.groups.map((e,t)=>this.#p(e,t)).join(``)}
                <button type="button" class="btn add icon vizy-add-group" data-add-group>${e(`Add a group`)}</button>
                ${this.#e.groups.length===0?`<p class="light">${e(`Add a new group to begin.`)}</p>`:``}
            `),this.#r&&(this.#r.innerHTML=this.#m()),this.#h(),this.#v()}#h(){let e=(e,t)=>{this.querySelectorAll(e).forEach(t)};e(`[data-add-group]`,e=>{e.onclick=()=>this.addGroup()}),e(`[data-delete-group]`,e=>{e.onclick=()=>this.deleteGroup(e.dataset.deleteGroup??``)}),e(`[data-move-group-up]`,e=>{e.onclick=()=>this.moveGroup(e.dataset.moveGroupUp??``,-1)}),e(`[data-move-group-down]`,e=>{e.onclick=()=>this.moveGroup(e.dataset.moveGroupDown??``,1)}),e(`[data-group-name]`,e=>{e.onblur=()=>this.renameGroup(e.dataset.groupName??``,e.textContent??``),e.onkeydown=t=>{t.key===`Enter`&&(t.preventDefault(),e.blur())}}),e(`[data-select-block]`,e=>{e.onclick=()=>this.selectBlock(e.dataset.selectBlock??``)}),e(`[data-remove-block]`,e=>{e.onclick=()=>this.removeBlock(e.dataset.removeBlock??``)}),e(`[data-edit-block]`,e=>{e.onclick=()=>this.#c(e.dataset.editBlock??``,null)}),e(`[data-new-block]`,e=>{e.onclick=()=>this.#c(null,e.dataset.newBlock??``)}),e(`[data-pick-existing]`,e=>{e.onchange=()=>{e.value!==``&&this.addExistingBlock(e.dataset.pickExisting??``,e.value)}}),e(`[data-toggle-block]`,e=>{let t=e.dataset.toggleBlock??``,n=()=>this.setBlockAvailability(t,this.#d(t));e.onclick=n,e.onkeydown=e=>{let t=e.key;(t===` `||t===`Enter`)&&(e.preventDefault(),n())}}),this.#g()}#g(){this.querySelectorAll(`[data-block-row]`).forEach(e=>{e.ondragstart=t=>{this.#o={kind:`block`,groupId:e.dataset.groupId??``,uid:e.dataset.blockRow??``},e.classList.add(`is-dragging`),t.dataTransfer?.setData(`text/plain`,e.dataset.blockRow??``),t.dataTransfer&&(t.dataTransfer.effectAllowed=`move`)},e.ondragend=()=>{e.classList.remove(`is-dragging`),this.#_(),this.#o=null},e.ondragover=t=>{if(this.#o?.kind!==`block`)return;t.preventDefault(),this.#_();let n=e.getBoundingClientRect(),r=t.clientY>n.top+n.height/2;e.classList.add(r?`is-drop-after`:`is-drop-before`)},e.ondrop=t=>{if(this.#o?.kind!==`block`)return;t.preventDefault(),t.stopPropagation();let n=e.getBoundingClientRect(),r=t.clientY>n.top+n.height/2,i=Number(e.dataset.index??`0`)+ +!!r,a=this.#o.uid;this.#o=null,this.moveBlock(a,e.dataset.groupId??``,i)}}),this.querySelectorAll(`[data-group-drop-end]`).forEach(e=>{e.ondragover=t=>{this.#o?.kind===`block`&&(t.preventDefault(),this.#_(),e.classList.add(`is-drop-before`))},e.ondrop=t=>{if(this.#o?.kind!==`block`)return;t.preventDefault();let n=e.dataset.groupDropEnd??``,r=this.#o.uid;this.#o=null,this.moveBlock(r,n,this.#s(n)?.blockTypeUids.length??0)}})}#_(){this.querySelectorAll(`.is-drop-before, .is-drop-after`).forEach(e=>{e.classList.remove(`is-drop-before`,`is-drop-after`)})}#v(){this.#n&&(this.#n.replaceChildren(),this.#e.groups.forEach((e,t)=>{let n=(e,n)=>{let r=document.createElement(`input`);r.type=`hidden`,r.name=`${this.#a}[${t}]${e}`,r.value=n,this.#n?.append(r)};n(`[name]`,e.name),e.blockTypeUids.forEach(e=>n(`[blockTypeUids][]`,e)),e.disabledBlockTypeUids.forEach(e=>n(`[disabledBlockTypeUids][]`,e))}))}};customElements.get(`vizy-field-settings`)||customElements.define(`vizy-field-settings`,n);function r(e,t){let n=window.Craft;n?.CpScreenSlideout&&new n.CpScreenSlideout(`vizy/editor-configs/edit`,{params:t?{id:t}:{id:`new`}}).on(`submit`,t=>{let n=t.data?.editorConfig;if(!n?.id)return;let r=Array.from(e.options).find(e=>e.value===n.id);if(r)r.textContent=n.label;else{let t=document.createElement(`option`);t.value=n.id,t.textContent=n.label,e.append(t)}e.value=n.id,e.dispatchEvent(new Event(`change`,{bubbles:!0}))})}function i(e){e.querySelectorAll(`[data-vizy-new-editor-config]`).forEach(e=>{e.dataset.vizyBound||(e.dataset.vizyBound=`1`,e.addEventListener(`click`,()=>{let t=e.closest(`.flex`)?.querySelector(`select`);t&&r(t,null)}))}),e.querySelectorAll(`[data-vizy-edit-editor-config]`).forEach(e=>{e.dataset.vizyBound||(e.dataset.vizyBound=`1`,e.addEventListener(`click`,()=>{let t=e.closest(`.flex`)?.querySelector(`select`);t&&t.value!==``&&r(t,t.value)}))})}document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,()=>i(document)):i(document),new MutationObserver(e=>{for(let t of e)for(let e of t.addedNodes)e instanceof HTMLElement&&e.querySelector(`[data-vizy-new-editor-config]`)&&i(e)}).observe(document.body,{childList:!0,subtree:!0});
//# sourceMappingURL=field-settings-QoqswwTQ.js.map