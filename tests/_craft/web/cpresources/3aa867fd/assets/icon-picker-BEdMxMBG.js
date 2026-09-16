var e=new Map,t=96,n=0;function r(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`)}function i(e,t={}){let n=window.Craft?.t(`vizy`,e,t);return n===void 0?Object.entries(t).reduce((e,[t,n])=>e.replaceAll(`{${t}}`,String(n)),e):n}function a(t){let n=e.get(t)??fetch(t,{headers:{Accept:`application/json`}}).then(e=>{if(!e.ok)throw Error(`Icon request failed: ${e.status}`);return e.json()}).catch(n=>{throw e.delete(t),n});return e.set(t,n),n}var o=class extends HTMLElement{#e=[];#t=``;#n=t;#r=!1;#i=`idle`;#a=``;#o=`icon`;#s=``;#c=null;#l=``;#u=`vizy-icon-picker-${++n}`;connectedCallback(){this.#a=this.getAttribute(`value`)??``,this.#o=this.getAttribute(`name`)??this.#o,this.#s=this.getAttribute(`data-icons-url`)??``,this.#c=this.getAttribute(`data-initial-svg`),this.#l=this.getAttribute(`data-labelled-by`)??``,this.render(),this.#a!==``&&this.#c===null&&this.#s!==``&&a(this.#s).then(e=>{this.#e=e,this.#r||this.render()}).catch(()=>{}),document.addEventListener(`click`,this.#d,!0),this.addEventListener(`keydown`,this.#f)}disconnectedCallback(){document.removeEventListener(`click`,this.#d,!0)}#d=e=>{this.#r&&(e.composedPath().some(e=>e instanceof Element&&e.closest(`[data-icon-trigger], [data-icon-clear], .vizy-icon-picker-panel`))||(this.#r=!1,this.render()))};#f=e=>{e.key===`Escape`&&this.#r&&(e.stopPropagation(),this.#r=!1,this.render())};async#p(){if(this.#r=!this.#r,this.#r&&(this.#n=t),this.#r&&this.#e.length===0&&this.#i!==`loading`){this.#i=`loading`,this.render();try{this.#e=await a(this.#s),this.#i=`idle`}catch{this.#i=`error`}}this.render(),this.#r&&this.querySelector(`[data-icon-search]`)?.focus()}#m(e){this.#a=e,this.#r=!1,this.#t=``,this.render(),this.dispatchEvent(new CustomEvent(`vizy-icon-change`,{bubbles:!0,detail:{value:e}}))}#h(){if(this.#a===``)return null;for(let e of this.#e){let t=e.icons.find(e=>e.value===this.#a);if(t)return t}return null}#g(){let e=this.#t.trim().toLowerCase();return this.#e.reduce((t,n)=>{let r=e===``?n.icons:n.icons.filter(t=>t.label.toLowerCase().includes(e)||t.value.toLowerCase().includes(e));return r.length===0||t.push({name:n.name,total:r.length,icons:r.slice(0,this.#n)}),t},[])}#_(){return this.#g().some(e=>e.icons.length<e.total)}#v(e){if(!this.#_()||e.scrollTop+e.clientHeight<e.scrollHeight-200)return;let n=e.scrollTop;this.#n+=t,this.#y(),e.scrollTop=n}#y(){let e=this.querySelector(`.vizy-icon-picker-results`);e&&(e.innerHTML=this.#x(),this.#S())}#b(){let e=this.#h();return e?`<span class="vizy-icon-picker-glyph">${e.svg}</span><span class="vizy-icon-picker-label">${r(e.label)}</span>`:this.#a!==``&&this.#c?`<span class="vizy-icon-picker-glyph">${this.#c}</span><span class="vizy-icon-picker-label code">${r(this.#a)}</span>`:`<span class="vizy-icon-picker-label light">${i(`Choose an icon`)}</span>`}#x(){if(this.#i===`loading`)return`<p class="vizy-icon-picker-notice light">${i(`Loading icons…`)}</p>`;if(this.#i===`error`)return`<p class="vizy-icon-picker-notice error">${i(`Couldn’t load icons.`)}</p>`;let e=this.#g();return e.length===0?`<p class="vizy-icon-picker-notice light">${i(`No icons match your query.`)}</p>`:e.map(e=>`
            <div class="vizy-icon-picker-group">
                <h6 class="vizy-icon-picker-group-heading">
                    ${r(e.name)}
                    ${e.icons.length<e.total?`<span class="light">${i(`Showing {count} of {total}`,{count:e.icons.length,total:e.total})}</span>`:``}
                </h6>
                <div class="vizy-icon-picker-grid">
                    ${e.icons.map(e=>`
                        <button
                            type="button"
                            class="vizy-icon-picker-option"
                            title="${r(e.label)}"
                            aria-label="${r(e.label)}"
                            aria-pressed="${e.value===this.#a?`true`:`false`}"
                            data-icon-value="${r(e.value)}"
                        >${e.svg}</button>
                    `).join(``)}
                </div>
            </div>
        `).join(``)}render(){this.innerHTML=`
            <input type="hidden" name="${r(this.#o)}" value="${r(this.#a)}">
            <div class="vizy-icon-picker">
                <button
                    type="button"
                    class="btn menubtn vizy-icon-picker-trigger"
                    aria-expanded="${this.#r?`true`:`false`}"
                    ${this.#l===``?``:`id="${this.#u}" aria-labelledby="${r(this.#l)} ${this.#u}"`}
                    data-icon-trigger
                >${this.#b()}</button>
                ${this.#a===``?``:`<button type="button" class="delete icon vizy-icon-picker-clear" title="${i(`Clear`)}" aria-label="${i(`Clear`)}" data-icon-clear></button>`}
                ${this.#r?`
                    <div class="vizy-icon-picker-panel">
                        <div class="vizy-icon-picker-search">
                            <input
                                type="text"
                                class="text fullwidth"
                                placeholder="${i(`Search icons`)}"
                                value="${r(this.#t)}"
                                data-icon-search
                            >
                        </div>
                        <div class="vizy-icon-picker-results">${this.#x()}</div>
                    </div>
                `:``}
            </div>
        `,this.querySelector(`[data-icon-trigger]`)?.addEventListener(`click`,()=>{this.#p()}),this.querySelector(`[data-icon-clear]`)?.addEventListener(`click`,()=>{this.#m(``)});let e=this.querySelector(`[data-icon-search]`);e&&e.addEventListener(`input`,()=>{this.#t=e.value,this.#n=t,this.#y()});let n=this.querySelector(`.vizy-icon-picker-results`);n?.addEventListener(`scroll`,()=>this.#v(n)),this.#S()}#S(){this.querySelectorAll(`[data-icon-value]`).forEach(e=>{e.addEventListener(`click`,()=>{this.#m(e.dataset.iconValue??``)})})}};customElements.get(`vizy-icon-picker`)||customElements.define(`vizy-icon-picker`,o);
//# sourceMappingURL=icon-picker-BEdMxMBG.js.map