var e=null;function t(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`)}function n(e,t={}){return window.Craft?.t(`vizy`,e,t)??e}function r(t){return e??=fetch(t,{headers:{Accept:`application/json`}}).then(e=>{if(!e.ok)throw Error(`Icon request failed: ${e.status}`);return e.json()}).catch(t=>{throw e=null,t}),e}var i=class extends HTMLElement{#e=[];#t=``;#n=!1;#r=`idle`;#i=``;#a=`icon`;#o=``;#s=null;connectedCallback(){this.#i=this.getAttribute(`value`)??``,this.#a=this.getAttribute(`name`)??this.#a,this.#o=this.getAttribute(`data-icons-url`)??``,this.#s=this.getAttribute(`data-initial-svg`),this.render(),document.addEventListener(`click`,this.#c,!0),this.addEventListener(`keydown`,this.#l)}disconnectedCallback(){document.removeEventListener(`click`,this.#c,!0)}#c=e=>{this.#n&&e.target instanceof Node&&!this.contains(e.target)&&(this.#n=!1,this.render())};#l=e=>{e.key===`Escape`&&this.#n&&(e.stopPropagation(),this.#n=!1,this.render())};async#u(){if(this.#n=!this.#n,this.#n&&this.#e.length===0&&this.#r!==`loading`){this.#r=`loading`,this.render();try{this.#e=await r(this.#o),this.#r=`idle`}catch{this.#r=`error`}}this.render(),this.#n&&this.querySelector(`[data-icon-search]`)?.focus()}#d(e){this.#i=e,this.#n=!1,this.#t=``,this.render(),this.dispatchEvent(new CustomEvent(`vizy-icon-change`,{bubbles:!0,detail:{value:e}}))}#f(){if(this.#i===``)return null;for(let e of this.#e){let t=e.icons.find(e=>e.value===this.#i);if(t)return t}return null}#p(){let e=this.#t.trim().toLowerCase();return this.#e.reduce((t,n)=>{let r=e===``?n.icons:n.icons.filter(t=>t.label.toLowerCase().includes(e)||t.value.toLowerCase().includes(e));return r.length===0||t.push({name:n.name,total:r.length,icons:e===``?r.slice(0,48):r}),t},[])}#m(){let e=this.#f();return e?`<span class="vizy-icon-picker-glyph">${e.svg}</span><span class="vizy-icon-picker-label">${t(e.label)}</span>`:this.#i!==``&&this.#s?`<span class="vizy-icon-picker-glyph">${this.#s}</span><span class="vizy-icon-picker-label code">${t(this.#i)}</span>`:`<span class="vizy-icon-picker-label light">${n(`Choose an icon`)}</span>`}#h(){if(this.#r===`loading`)return`<p class="vizy-icon-picker-notice light">${n(`Loading icons…`)}</p>`;if(this.#r===`error`)return`<p class="vizy-icon-picker-notice error">${n(`Couldn’t load icons.`)}</p>`;let e=this.#p();return e.length===0?`<p class="vizy-icon-picker-notice light">${n(`No icons match your query.`)}</p>`:e.map(e=>`
            <div class="vizy-icon-picker-group">
                <h6 class="vizy-icon-picker-group-heading">
                    ${t(e.name)}
                    ${e.icons.length<e.total?`<span class="light">${n(`Showing {count} of {total}`,{count:e.icons.length,total:e.total})}</span>`:``}
                </h6>
                <div class="vizy-icon-picker-grid">
                    ${e.icons.map(e=>`
                        <button
                            type="button"
                            class="vizy-icon-picker-option${e.value===this.#i?` is-selected`:``}"
                            aria-label="${t(e.label)}"
                            data-icon-value="${t(e.value)}"
                        >${e.svg}</button>
                    `).join(``)}
                </div>
            </div>
        `).join(``)}render(){this.innerHTML=`
            <input type="hidden" name="${t(this.#a)}" value="${t(this.#i)}">
            <div class="vizy-icon-picker">
                <button
                    type="button"
                    class="btn menubtn vizy-icon-picker-trigger"
                    aria-expanded="${this.#n?`true`:`false`}"
                    data-icon-trigger
                >${this.#m()}</button>
                ${this.#i===``?``:`<button type="button" class="delete icon vizy-icon-picker-clear" aria-label="${n(`Clear`)}" data-icon-clear></button>`}
                ${this.#n?`
                    <div class="vizy-icon-picker-panel">
                        <div class="vizy-icon-picker-search">
                            <input
                                type="text"
                                class="text fullwidth"
                                placeholder="${n(`Search icons`)}"
                                value="${t(this.#t)}"
                                data-icon-search
                            >
                        </div>
                        <div class="vizy-icon-picker-results">${this.#h()}</div>
                    </div>
                `:``}
            </div>
        `,this.querySelector(`[data-icon-trigger]`)?.addEventListener(`click`,()=>{this.#u()}),this.querySelector(`[data-icon-clear]`)?.addEventListener(`click`,()=>{this.#d(``)});let e=this.querySelector(`[data-icon-search]`);e&&e.addEventListener(`input`,()=>{this.#t=e.value;let t=this.querySelector(`.vizy-icon-picker-results`);t&&(t.innerHTML=this.#h(),this.#g())}),this.#g()}#g(){this.querySelectorAll(`[data-icon-value]`).forEach(e=>{e.addEventListener(`click`,()=>{this.#d(e.dataset.iconValue??``)})})}};customElements.get(`vizy-icon-picker`)||customElements.define(`vizy-icon-picker`,i);
//# sourceMappingURL=icon-picker-IQx4XZ5D.js.map