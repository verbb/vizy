const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./code-editor-llGvQ0_R.js","./class-map-Ba3saTy9.js","./field-labels-CoU9dnNq-BuplxFCK.js","./rolldown-runtime-DK3Fl9T5.js","./unsafe-html-CokSp8NY.js","./pk-popup-B9AgBC2V-CAICLNc5.js","./w3c-keyname-BOAvb0qz.js","./required-validator-CEg8dvjS-BVlj-MQ-.js"])))=>i.map(i=>d[i]);
import{_ as e,a as t,d as n,h as r,o as i,s as a,t as o,u as s}from"./class-map-Ba3saTy9.js";import"./unsafe-html-CokSp8NY.js";import{t as c}from"./preload-helper-HclGiUj8.js";import{a as l,n as u,o as d,r as f,s as p}from"./lightswitch-dgx--ucV.js";/* empty css               */import{t as m}from"./menu-chevron-CXoiJ-wX.js";var h=e`
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
`,g={fromAttribute(e){if(!e)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t.filter(e=>!!(e&&typeof e==`object`&&`value`in e)).map(e=>({label:String(e.label??e.value),value:String(e.value)})):[]}catch{return[]}},toAttribute(e){return JSON.stringify(e??[])}},_={fromAttribute(e){if(e==null||e===``)return[];if(e===`*`)return`*`;try{let t=JSON.parse(e);return t===`*`?`*`:Array.isArray(t)?t.map(String):[]}catch{return[]}},toAttribute(e){return e===`*`?`*`:JSON.stringify(e??[])}},v=class extends t{constructor(...e){super(...e),this.options=[],this.value=[],this.showAllOption=!1,this.allLabel=`All`,this.disabled=!1,this.orientation=`vertical`,this.ariaLabel=null,this.optionElements=[],this.allOptionElement=null,this.handleAllChange=e=>{e.stopPropagation(),this.value=e.detail.checked?`*`:[],this.dispatchValueChange()},this.handleItemChange=(e,t)=>{if(t.stopPropagation(),this.isAllSelected)return;let n=t.detail.checked,r=this.selectedValues;this.value=n?[...r,e]:r.filter(t=>t!==e),this.dispatchValueChange()}}static{this.styles=h}connectedCallback(){this.hasAttribute(`role`)||this.setAttribute(`role`,`group`),super.connectedCallback()}updated(e){if(e.has(`options`)||e.has(`showAllOption`)){this.rebuildOptionElements();return}(e.has(`value`)||e.has(`disabled`))&&this.updateOptionStates()}firstUpdated(){this.rebuildOptionElements()}focus(e){this.optionElements.find(e=>!e.disabled)?.focus(e)}get isAllSelected(){return this.value===`*`}get selectedValues(){return this.isAllSelected?this.options.map(e=>e.value):Array.isArray(this.value)?this.value:[]}dispatchValueChange(){let e=this.isAllSelected?`*`:[...this.selectedValues];this.dispatchEvent(new CustomEvent(`pk-change`,{detail:{value:e},bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0}))}rebuildOptionElements(){let e=this.shadowRoot?.querySelector(`.options`);if(e){for(let e of this.optionElements)e.remove();if(this.optionElements=[],this.allOptionElement=null,this.showAllOption){let t=document.createElement(`pk-checkbox`);t.classList.add(`all-option`),t.append(this.allLabel),t.addEventListener(`pk-change`,this.handleAllChange),e.append(t),this.allOptionElement=t,this.optionElements.push(t)}for(let t of this.options){let n=document.createElement(`pk-checkbox`);n.checkboxValue=t.value,n.append(t.label),n.addEventListener(`pk-change`,e=>{this.handleItemChange(t.value,e)}),e.append(n),this.optionElements.push(n)}this.updateOptionStates()}}updateOptionStates(){this.allOptionElement&&(this.allOptionElement.checked=this.isAllSelected,this.allOptionElement.disabled=this.disabled);for(let e of this.options){let t=this.optionElements.find(t=>t!==this.allOptionElement&&t.checkboxValue===e.value);t&&(t.checked=this.isAllSelected||this.selectedValues.includes(e.value),t.disabled=this.disabled||this.isAllSelected)}}render(){return r`
            <div
                part="base"
                class=${o({options:!0,"options--horizontal":this.orientation===`horizontal`})}
            ></div>
        `}};i([n({attribute:`options`,converter:g})],v.prototype,`options`,void 0),i([n({attribute:`value`,converter:_})],v.prototype,`value`,void 0),i([n({type:Boolean,attribute:`show-all-option`})],v.prototype,`showAllOption`,void 0),i([n({attribute:`all-label`})],v.prototype,`allLabel`,void 0),i([n({type:Boolean,reflect:!0})],v.prototype,`disabled`,void 0),i([n({reflect:!0})],v.prototype,`orientation`,void 0),i([n({attribute:`aria-label`})],v.prototype,`ariaLabel`,void 0),i([s()],v.prototype,`optionElements`,void 0),v=i([a(`pk-checkbox-select`)],v);function y(e){return e===`available`}var b=class e{#e;#t=[];#n=[];#r;#i={x:0,y:0};#a=null;#o=null;#s=null;#c=null;#l=0;#u=`active`;#d=!1;#f={x:0,y:0};static#p=10;static#m=5;constructor(t){this.#r=t,this.#e=new u({plugins:e=>[...e,l.configure({dropAnimation:null})],sensors:[p.configure({activationConstraints:[new d.Distance({value:e.#m})]})]}),this.#L()}refresh(){this.#H(),this.#v(this.#r.availableList(),`available`),this.#v(this.#r.activeList(),`active`),this.#v(this.#h(),`members`)}#h(){return this.#r.memberList?.()??null}#g(){return[this.#r.availableList()].filter(e=>!!e)}#_(){let e=[],t=this.#h();if(this.#s?.list===`members`)return t&&e.push({name:`members`,element:t}),e;let n=this.#r.activeList();return n&&e.push({name:`active`,element:n}),e}destroy(){this.#n.forEach(e=>e()),this.#n=[],this.#I(),this.#H(),this.#e.destroy()}#v(e,t){e&&this.#y(e).forEach((e,n)=>{let r=e.dataset.toolbarItem;r&&this.#t.push(new f({id:`${this.#r.type}-${t}-${n}-${r}`,element:e,type:this.#r.type,data:{itemId:r,list:t,index:n,repeatable:e.hasAttribute(`data-toolbar-repeatable`)}},this.#e))})}#y(e){return[...e.querySelectorAll(`[data-toolbar-item]`)]}#b=new Map;#x(){this.#b.clear();for(let t of this.#_())this.#b.set(t.name,this.#C(t.element,e.#S(t.name)))}static#S(e){return e===`members`?`block`:`inline`}#C(e,t){let n=this.#o,r=e.getBoundingClientRect(),i=[];return{element:e,axis:t,peers:this.#y(e).map((e,t)=>({peer:e,index:t})).filter(({peer:e})=>e!==n).map(({peer:e,index:n})=>{let a=e.getBoundingClientRect(),o=t===`inline`?a.top-r.top:a.left-r.left,s=t===`inline`?a.bottom-r.top:a.right-r.left,c=t===`inline`?a.left+a.width/2-r.left:a.top+a.height/2-r.top,l=i.at(-1);return!l||Math.abs(l.start-o)>1?i.push({start:o,end:s}):l.end=Math.max(l.end,s),{band:i.length-1,middle:c,index:n}}),bands:i}}#w(e,t){let n=0,r=1/0;return e.bands.forEach((e,i)=>{let a=t<e.start?e.start-t:Math.max(0,t-e.end);a<r&&(r=a,n=i)}),n}#T(e){let t=e.element.getBoundingClientRect(),n={x:this.#i.x-t.left,y:this.#i.y-t.top},r=e.axis===`inline`?n.x:n.y,i=this.#w(e,e.axis===`inline`?n.y:n.x),a=0;for(let t of e.peers){if(!(t.band<i||!(t.band>i)&&r>t.middle))break;a+=1}return a}#E(){if(this.#c)return this.#c;let e=this.#o.cloneNode(!0);return e.removeAttribute(`id`),e.removeAttribute(`data-toolbar-item`),e.removeAttribute(`aria-label`),e.removeAttribute(`aria-describedby`),e.setAttribute(`aria-hidden`,`true`),e.classList.remove(`is-lifted`),e.style.marginInlineEnd=``,e.classList.add(`is-slot`),this.#c=e,e}#D(e,t){if(!this.#o)return;let n=t.element,r=this.#T(t);this.#u=e,this.#l=r;let i=this.#y(n).filter(e=>e!==this.#o)[r]??n.querySelector(`[data-builder-tail]`),a=this.#E();(a.parentElement!==n||a.nextElementSibling!==i)&&n.insertBefore(a,i??null)}#O(){this.#c?.isConnected&&this.#c.remove()}#k(){if(!this.#o)return;let e=this.#A();if(!e){this.#O();return}this.#D(e.name,e.zone)}#A(){for(let{name:e,element:t}of this.#_()){let n=t.getBoundingClientRect();if(!(this.#i.x>=n.left&&this.#i.x<=n.right&&this.#i.y>=n.top&&this.#i.y<=n.bottom))continue;let r=this.#b.get(e);return r?{name:e,zone:r}:null}return null}#j(){return!!this.#c?.isConnected}#M(){let t=this.#o;if(!t||this.#N())return;t.classList.add(`is-lifted`);let n=t.parentElement,r=e.#S(this.#s?.list??`active`),i=n?getComputedStyle(n):null,a=parseFloat((r===`inline`?i?.columnGap:i?.rowGap)||``)||0,o=t.getBoundingClientRect(),s=r===`inline`?o.width:o.height;t.style[r===`inline`?`marginInlineEnd`:`marginBlockEnd`]=`-${s+a}px`}#N(){return!!this.#s?.repeatable&&y(this.#s.list)}#P(t){let n=this.#F();if(!n)return;let r=t.cloneNode(!0);r.removeAttribute(`id`),r.removeAttribute(`aria-describedby`),r.removeAttribute(`aria-roledescription`),r.setAttribute(`aria-hidden`,`true`),r.classList.add(`is-drag-helper`);let i=t.getBoundingClientRect(),a=this.#f.x-i.left+e.#p,o=this.#f.y-i.top+e.#p;r.style.setProperty(`transform`,`translate(${a}px, ${o}px)`,`important`),document.body.appendChild(r),this.#a=r,n.overlay=r}#F(){return this.#e.plugins.find(e=>e instanceof l)}#I(){let e=this.#F();e&&(e.overlay=void 0),this.#a?.remove(),this.#a=null}#L(){let e=e=>{this.#i={x:e.clientX,y:e.clientY},this.#k()},t=e=>{this.#f={x:e.clientX,y:e.clientY},this.#i={x:e.clientX,y:e.clientY}},n=e=>{let t=e.target instanceof Element&&e.target.closest(`[data-toolbar-item]`)!==null;this.#d&&t&&(e.preventDefault(),e.stopPropagation()),this.#d=!1};document.addEventListener(`pointerdown`,t,!0),document.addEventListener(`pointermove`,e,!0),document.addEventListener(`click`,n,!0),this.#n.push(()=>{document.removeEventListener(`pointerdown`,t,!0),document.removeEventListener(`pointermove`,e,!0),document.removeEventListener(`click`,n,!0)}),this.#n.push(this.#e.monitor.addEventListener(`beforedragstart`,e=>{let{source:t}=e.operation;t?.element instanceof HTMLElement&&this.#P(t.element)}),this.#e.monitor.addEventListener(`dragstart`,e=>{this.#r.container()?.classList.add(`is-sorting`);let{source:t}=e.operation;t?.element instanceof HTMLElement&&(this.#o=t.element,this.#s=t.data,this.#B(),this.#x(),this.#M(),this.#k())}),this.#e.monitor.addEventListener(`dragend`,e=>{let t=this.#s,n=this.#j(),r=this.#l,i=this.#u;if(this.#R(),this.#d=!0,!t?.itemId||e.canceled){this.#z(this.#r.onRevert);return}if(!n){if(y(t.list)){this.#z(this.#r.onRevert);return}this.#z(()=>this.#r.onDrop({itemId:t.itemId,from:t.list,to:`available`,fromIndex:t.index,index:t.index}));return}if(t.list===i&&r===t.index){this.#z(this.#r.onRevert);return}this.#z(()=>this.#r.onDrop({itemId:t.itemId,from:t.list,to:i,fromIndex:t.index,index:r}))}))}#R(){let e=this.#r.container();e?.classList.remove(`is-sorting`),e?.querySelectorAll(`.is-lifted`).forEach(e=>{e.classList.remove(`is-lifted`),e.style.marginInlineEnd=``,e.style.marginBlockEnd=``}),this.#O(),this.#c=null,this.#o=null,this.#s=null,this.#u=`active`,this.#b.clear(),this.#V(),this.#I()}#z(e){requestAnimationFrame(()=>e())}#B(){this.#g().forEach(e=>{e.style.minHeight=`${e.getBoundingClientRect().height}px`})}#V(){this.#g().forEach(e=>{e.style.minHeight=``})}#H(){this.#t.forEach(e=>{e.unregister(),e.destroy()}),this.#t=[]}},x=`dropdown:`;function S(e){return e.startsWith(x)}function C(e){return S(e)?e.slice(9):e}function w(e,t){let n=t.filter(t=>e.includes(t)),r=[...n];for(let t of e){if(n.includes(t))continue;let i=e.indexOf(t),a=r.findIndex(t=>n.includes(t)&&e.indexOf(t)>i);r.splice(a===-1?r.length:a,0,t)}return r}function T(e,t,n){return n!==void 0&&n>=0&&n<e.length&&e[n]===t?n:e.indexOf(t)}function E(e){return new Set(e)}var D=[1,2,3,4,5,6],O=[2,3,4];function k(e,t,n={}){return window.Craft?.t(e,t,n)??t.replace(/\{(\w+)\}/g,(e,t)=>n[t]??e)}function A(e){return e.replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e])}var j=class e extends HTMLElement{#e={capabilities:{nodes:[],marks:[]},headings:{levels:[...O]},toolbar:[],dropdowns:{},bubble:{enabled:!0,items:[]}};#t=[];#n=[];#r=[];#i={nodes:[],marks:[],headingAvailable:!1};#a=`visual`;#o=!1;#s=null;#c=e=>{if(!this.#s)return;let t=e.target;t instanceof Element&&(t.closest(`[data-builder-menu]`)||t.closest(`[data-toolbar-item]`)||this.#u())};#l=e=>{if(e.key!==`Escape`||!this.#s)return;let{list:t,index:n}=this.#s;this.#u();let r=this.querySelector(`[data-builder-list="${t}-active"]`)?.children[n];r instanceof HTMLElement&&r.focus({preventScroll:!0})};#u(){this.#s&&(this.#s=null,this.render())}#d=!1;#f=``;#p=``;#m=null;#h=new Map;#g;#_=0;#v=null;static#y=200;connectedCallback(){this.#m=this.querySelector(`[data-vizy-config-sync]`),this.#le();let e=this.getAttribute(`data-initial`);if(e){let t=JSON.parse(e);this.#e={...t.config,dropdowns:t.config.dropdowns??{}},this.#N(),this.#t=t.toolbarCatalog,this.#n=t.dropdownCatalog??[],this.#r=t.bubbleCatalog,this.#i=t.capabilityCatalog}this.#f=this.#b();let t=this.closest(`form`);t&&!t.dataset.vizyConfigBound&&(t.dataset.vizyConfigBound=`1`,t.addEventListener(`submit`,e=>{if(this.#a===`advanced`&&!this.#x()){e.preventDefault(),this.render();return}this.#Q()})),document.addEventListener(`click`,this.#c),document.addEventListener(`keydown`,this.#l),this.render()}disconnectedCallback(){this.#h.forEach(e=>e.destroy()),this.#h.clear(),document.removeEventListener(`click`,this.#c),document.removeEventListener(`keydown`,this.#l)}#b(){return JSON.stringify({capabilities:this.#e.capabilities,headings:this.#e.headings,toolbar:this.#e.toolbar,dropdowns:this.#e.dropdowns,bubble:this.#e.bubble},null,2)}#x(){try{let e=JSON.parse(this.#f);return this.#e={capabilities:{nodes:[...e.capabilities?.nodes??[]],marks:[...e.capabilities?.marks??[]]},headings:{levels:[...e.headings?.levels??O]},toolbar:[...e.toolbar??[]],dropdowns:{...e.dropdowns??{}},bubble:{enabled:e.bubble?.enabled??!0,items:[...e.bubble?.items??[]]}},this.#N(),this.#p=``,!0}catch{return this.#p=k(`vizy`,`Invalid JSON`),!1}}#S(e,t){return t.find(t=>t.id===e)}#C(e){if(!S(e))return this.#S(e,this.#t);let t=this.#S(e,this.#n);return t?{...t,kind:`group`}:void 0}#w(e){return e.pending||e.kind===`presentation`||e.kind===`dropdown`?!0:e.kind===`action`?e.capabilityName===void 0||this.#e.capabilities.nodes.includes(e.capabilityName):e.kind===`mark`?this.#e.capabilities.marks.includes(e.id):e.headingLevel===void 0?e.kind===`node`?e.id===`paragraph`||e.id===`hardBreak`||this.#e.capabilities.nodes.includes(e.capabilityName??e.id):!1:this.#e.headings.levels.includes(e.headingLevel)}#T(e){if(S(e))return!0;let t=this.#S(e,this.#t);return!t||t.kind===`presentation`||this.#w(t)}#E(){let e=E(this.#e.toolbar);return[...this.#t,...this.#n].filter(t=>t.memberOnly||e.has(t.id)&&!this.#I(t.id)?!1:this.#w(t)).sort((e,t)=>(e.paletteRank??0)-(t.paletteRank??0)).sort((e,t)=>Number(this.#I(e.id))-Number(this.#I(t.id)))}#D(){let e=new Set(this.#e.bubble.items);return this.#r.filter(t=>!e.has(t.id)&&this.#e.capabilities.marks.includes(t.id))}#O(e){if(e===`visual`&&this.#a===`advanced`&&!this.#x()){this.render();return}e===`advanced`&&(this.#f=this.#b(),this.#p=``,this.#k()),this.#a=e,this.render()}async#k(){this.#d||(await c(()=>import(`./code-editor-llGvQ0_R.js`),__vite__mapDeps([0,1,2,3,4,5,6,7]),import.meta.url),this.#d=!0,this.#a===`advanced`&&this.render())}#A(e,t,n){let r=new Set(this.#e.capabilities[e]);n?r.add(t):r.delete(t),this.#e.capabilities[e]=[...r],this.render()}#j(e,t,n){let r=this.#e.capabilities[e].filter(e=>!n.includes(e));this.#e.capabilities[e]=[...new Set([...r,...t])],this.render()}#M(e,t,n){let r=t.length>0&&t.every(e=>n.includes(e.value))?`*`:JSON.stringify(n);return`
            <pk-checkbox-select
                data-capability-group="${A(e)}"
                show-all-option
                all-label="${A(k(`vizy`,`All`))}"
                options="${A(JSON.stringify(t))}"
                value="${A(r)}"
            ></pk-checkbox-select>
        `}#N(){this.#e.capabilities.nodes.includes(`heading`)||(this.#e.headings.levels=[])}#P(){return this.#e.headings.levels.length>0}#F(e){this.#e.headings.levels=[...e].sort((e,t)=>e-t),this.#A(`nodes`,`heading`,this.#P())}#I(e){return e===`separator`}#L(e,t){return T(this.#e.toolbar,e,t)}#R(e,t){!this.#I(e)&&this.#L(e)!==-1||(t===void 0?this.#e.toolbar.push(e):this.#e.toolbar.splice(t,0,e),this.render())}#z(){return this.#s?.list===`toolbar`?this.#e.toolbar[this.#s.index]??null:null}#B(){let e=this.#z();return e!==null&&S(e)?C(e):null}#V(e){return this.#S(`dropdown:${e}`,this.#n)?.members??[]}#H(e){return this.#e.dropdowns[e]??this.#V(e)}#U(e,t){let n=this.#V(e);t.length===n.length&&t.every((e,t)=>e===n[t])?delete this.#e.dropdowns[e]:this.#e.dropdowns[e]=t,this.render()}#W(e,t){let n=this.#V(e);if(!n.includes(t))return;let r=this.#H(e);if(r.includes(t)){if(r.length<=1)return;this.#U(e,r.filter(e=>e!==t));return}let i=n.indexOf(t),a=r.findIndex(e=>n.indexOf(e)>i),o=[...r];o.splice(a===-1?o.length:a,0,t),this.#U(e,o)}#G(e,t,n){let r=[...this.#H(e)];if(t<0||n<0||t>=r.length||n>=r.length)return;let[i]=r.splice(t,1);r.splice(n,0,i),this.#U(e,r)}#K(e,t){let n=e===`toolbar`?this.#e.toolbar[t]:void 0;if(n===void 0||!S(n)){this.#u();return}let r=this.#s?.list===e&&this.#s.index===t;this.#s=r?null:{list:e,index:t},this.render()}#q(e,t){let n=this.#L(e,t);n!==-1&&(this.#e.toolbar.splice(n,1),S(e)&&delete this.#e.dropdowns[C(e)],this.#s=null,this.render())}#J(e,t){this.#e.bubble.items.includes(e)||(t===void 0?this.#e.bubble.items.push(e):this.#e.bubble.items.splice(t,0,e),this.render())}#Y(e){this.#e.bubble.items=this.#e.bubble.items.filter(t=>t!==e),this.render()}#X(e,t,n){let r=e===`toolbar`?this.#e.toolbar:this.#e.bubble.items;if(t<0||n<0||t>=r.length||n>=r.length)return;let[i]=r.splice(t,1);r.splice(n,0,i),this.render()}#Z(e,t){if(e===`bubble`){y(t.to)?this.#Y(t.itemId):y(t.from)?this.#J(t.itemId,t.index):this.#X(`bubble`,t.fromIndex,t.index);return}if(t.from===`members`){let e=this.#B();e!==null&&t.to===`members`?this.#G(e,t.fromIndex,t.index):this.render();return}if(y(t.to)){this.#q(t.itemId,t.fromIndex);return}if(y(t.from)){this.#s=null,this.#R(t.itemId,t.index);return}this.#s?.list===`toolbar`&&(this.#s=this.#s.index===t.fromIndex?{list:`toolbar`,index:t.index}:null),this.#X(`toolbar`,t.fromIndex,t.index)}#Q(){if(!this.#m)return;this.#m.replaceChildren();let e=(e,t)=>{let n=document.createElement(`input`);n.type=`hidden`,n.name=e,n.value=t,this.#m?.append(n)};this.#e.capabilities.nodes.forEach(t=>e(`capabilityNodes[]`,t)),this.#e.capabilities.marks.forEach(t=>e(`capabilityMarks[]`,t)),this.#e.headings.levels.forEach(t=>e(`headingLevels[]`,String(t))),e(`toolbarJson`,JSON.stringify(this.#e.toolbar)),e(`dropdownsJson`,JSON.stringify(this.#e.dropdowns)),e(`bubbleJson`,JSON.stringify(this.#e.bubble)),e(`advancedConfig`,this.#b())}#$(e){return e.icon?e.icon:e.abbr?`<span class="vizy-control-abbr">${A(e.abbr)}</span>`:`<span class="vizy-control-text">${A(e.label)}</span>`}#ee(e,t,n,r={}){let i=e.kind===`group`||e.kind===`dropdown`,a=i||e.id===`addBlock`;return`
            <button
                type="button"
                class="${[`vizy-control`,e.id===`separator`?`is-separator`:``,e.icon||e.abbr||e.id===`separator`?``:`is-text`,a?`has-menu`:``,n===`available`?`is-available`:``,r.selected?`is-selected`:``,r.unavailable?`is-unavailable`:``,e.pending?`is-pending`:``].filter(Boolean).join(` `)}"
                aria-label="${A(e.pending?k(`vizy`,`{label} (not available yet)`,{label:e.label}):r.unavailable?k(`vizy`,`{label} (not allowed by this config)`,{label:e.label}):e.label)}"
                ${n===`active`&&i?`aria-expanded="${r.selected?`true`:`false`}"`:``}
                data-toolbar-item="${A(e.id)}"
                data-toolbar-list="${t}"
                data-toolbar-variant="${n}"
                ${this.#I(e.id)?`data-toolbar-repeatable`:``}
            >${e.id===`separator`?``:this.#$(e)}${a?`<span class="vizy-control-chevron" aria-hidden="true">${m}</span>`:``}</button>
        `}#te(){let e=[...this.#i.nodes,...this.#i.marks],t=e.filter(e=>this.#e.capabilities.nodes.includes(e.value)||this.#e.capabilities.marks.includes(e.value));return`
            <details class="vizy-editor-config-section vizy-editor-config-schema" data-schema-details ${this.#o?`open`:``}>
                <summary>
                    <span class="vizy-editor-config-schema-title">${k(`vizy`,`Content schema`)}</span>
                    <span class="vizy-editor-config-schema-count">${k(`vizy`,`{allowed} of {total} content types allowed`,{allowed:String(t.length),total:String(e.length)})}</span>
                </summary>
                <p class="instructions">${k(`vizy`,`The nodes and marks this editor understands. It governs pasted and imported content as well as the toolbar, so a content type can be allowed without being given a button — which is how existing formatting is preserved without authors being offered more of it.`)}</p>

                <div class="vizy-editor-config-subhead">${k(`vizy`,`Blocks and objects`)}</div>
                ${this.#M(`nodes`,this.#i.nodes,this.#e.capabilities.nodes)}

                <!--
                    Here rather than in a section of its own, which is where it was and which
                    made the one content decision with a bespoke control read as an unrelated
                    setting that happened to be nearby. Six levels are six content types: they
                    govern pasted and imported content exactly as Quote and Code block do — an
                    H1 pasted into a config that disallows level 1 becomes a paragraph — so they
                    belong with every other answer to "what may this editor contain".

                    Kept as their own select under a subhead rather than folded into the blocks
                    grid above, because "Heading 1" through "Heading 6" sorted alphabetically in
                    among Code block, Horizontal rule and Image reads as six unrelated types, and
                    its All box would then mean all-blocks-and-all-levels.
                -->
                ${this.#i.headingAvailable?`
                    <div class="vizy-editor-config-subhead">${k(`vizy`,`Heading levels`)}</div>
                    <!--
                        No separate "Allow headings" switch. The levels are the setting: choosing
                        none is how headings are disallowed. Two controls for one decision meant
                        the switch could be on with no levels ticked, a state that had to be
                        papered over by seeding defaults.
                    -->
                    ${this.#M(`headings`,D.map(e=>({label:`H${e}`,value:String(e)})),this.#e.headings.levels.map(String))}
                `:``}

                <div class="vizy-editor-config-subhead">${k(`vizy`,`Inline formatting`)}</div>
                ${this.#M(`marks`,this.#i.marks,this.#e.capabilities.marks)}
            </details>
        `}#ne(e){let t=this.#V(e),n=this.#H(e);return`
            <div
                class="vizy-editor-config-menu"
                role="menu"
                data-size="sm"
                data-builder-list="toolbar-members"
                data-builder-menu
            >
                ${w(t,n).filter(e=>this.#re(e)).map(e=>this.#ie(e,!n.includes(e))).join(``)||`<p class="vizy-editor-config-menu-empty">${k(`vizy`,`Nothing in this dropdown can render, so it won’t appear.`)}</p>`}
            </div>
        `}#re(e){let t=this.#S(e,this.#t);return t!==void 0&&!t.pending&&this.#w(t)}#ie(e,t){let n=this.#S(e,this.#t);if(!n)return``;let r=t?k(`vizy`,`{label} (switched off)`,{label:n.label}):n.label;return`
            <button
                type="button"
                role="menuitem"
                class="vizy-editor-config-menu-item${t?` is-off`:``}"
                aria-label="${A(r)}"
                aria-pressed="${t?`false`:`true`}"
                data-toolbar-item="${A(n.id)}"
                data-toolbar-list="toolbar"
                data-toolbar-variant="member"
            >${n.icon?`<span class="vizy-editor-config-menu-icon" aria-hidden="true">${n.icon}</span>`:``}<span class="preview-label"${n.preview?` data-preview="${A(n.preview)}"`:``}>${A(n.label)}</span></button>
        `}#ae(e){return`
            <span class="vizy-editor-config-empty" data-empty-placeholder>
                ${A(e)}
            </span>
        `}#oe(){return`<span class="vizy-editor-config-tail" data-builder-tail></span>`}#se(e,t,n=!0){let r=e||this.#ae(t);return n?r+this.#oe():r}async#ce(e){await e.updateComplete;let t=e.shadowRoot?.querySelector(`pk-popup`);if(!t||(await customElements.whenDefined(`pk-popup`),await t.updateComplete,!t.shadowRoot))return;let n=document.createElement(`style`);n.textContent=`:host, .hover-bridge, [part="content"] { pointer-events: none; }`,t.shadowRoot.appendChild(n)}#le(){let t=document.createElement(`pk-tooltip`);t.setAttribute(`trigger`,`manual`),t.setAttribute(`placement`,`top`),this.appendChild(t),this.#g=t,this.#ce(t);let n=e=>e instanceof Element?e.closest(`.vizy-control`):null,r=e=>e instanceof Node&&t.contains(e),i=()=>{this.#v!==null&&(window.clearTimeout(this.#v),this.#v=null)},a=a=>{if(r(a.target))return;let o=n(a.target),s=o?.getAttribute(`aria-label`);if(i(),!o||!s||o.closest(`.is-sorting`)||o.hasAttribute(`data-dnd-placeholder`)){t.hide();return}this.#v=window.setTimeout(()=>{this.#v=null,!(!o.isConnected||o.closest(`.is-sorting`))&&(o.id||=`vizy-control-${++this.#_}`,t.for=o.id,t.content=s,t.show())},e.#y)},o=e=>{r(e.target)||(i(),t.hide())};this.addEventListener(`pointerover`,a),this.addEventListener(`focusin`,a),this.addEventListener(`pointerout`,o),this.addEventListener(`focusout`,o),this.addEventListener(`pointerdown`,o)}#ue(e){let t=e=>{let t=[...e.parentElement?.children??[]].indexOf(e);return t===-1?void 0:t};e.querySelectorAll(`[data-toolbar-item]`).forEach(e=>{let n=e.dataset.toolbarItem,r=e.dataset.toolbarList,i=e.dataset.toolbarVariant;if(!n||!r)return;let a=()=>{if(i===`available`){r===`toolbar`?this.#R(n):this.#J(n);return}if(i===`member`){let e=this.#B();e!==null&&this.#W(e,n);return}this.#K(r,t(e)??-1)};e.onclick=a,e.onkeydown=o=>{if(o.key===`Delete`||o.key===`Backspace`){if(i!==`active`)return;o.preventDefault(),r===`toolbar`?this.#q(n,t(e)):this.#Y(n);return}(o.key===`Enter`||o.key===` `)&&(o.preventDefault(),a())}})}#de(e){[`toolbar`,`bubble`].forEach(t=>{let n=()=>e.querySelector(`[data-builder="${t}"]`);if(!n()){this.#h.get(t)?.destroy(),this.#h.delete(t);return}let r=this.#h.get(t);r||(r=new b({container:n,type:`vizy-${t}-control`,availableList:()=>e.querySelector(`[data-builder-list="${t}-available"]`),activeList:()=>e.querySelector(`[data-builder-list="${t}-active"]`),memberList:()=>e.querySelector(`[data-builder-list="${t}-members"]`),onDrop:e=>this.#Z(t,e),onRevert:()=>this.render()}),this.#h.set(t,r)),r.refresh()})}render(){let e=this.querySelector(`[data-vizy-config-host]`);if(!e)return;let t=e.querySelector(`[data-builder-menu]`)?.scrollTop??0,n=document.scrollingElement,r=n?.scrollTop??0,i=this.#fe(e),a=this.#B(),o=this.#e.toolbar.map((e,t)=>{let n=this.#C(e);return n?this.#ee(n,`toolbar`,`active`,{unavailable:!this.#T(e),selected:this.#s?.list===`toolbar`&&this.#s.index===t}):``}).join(``),s=this.#e.bubble.items.map((e,t)=>{let n=this.#S(e,this.#r);return n?this.#ee(n,`bubble`,`active`,{selected:this.#s?.list===`bubble`&&this.#s.index===t}):``}).join(``);e.innerHTML=`
            <div class="vizy-editor-config">
                <div class="vizy-editor-config-tabs">
                    <button type="button" class="${this.#a===`visual`?`active`:``}" data-mode="visual">${k(`vizy`,`Visual`)}</button>
                    <button type="button" class="${this.#a===`advanced`?`active`:``}" data-mode="advanced">${k(`vizy`,`Advanced`)}</button>
                </div>

                ${this.#a===`visual`?`
                    <div class="vizy-editor-config-panel">
                        <!--
                            The toolbar leads, because it is what these configs are opened to
                            change. What the editor is *able* to represent used to come first,
                            which put an advanced decision — and one most configs want left
                            alone — in front of the routine one, and made buttons look missing
                            when they were only unticked. It is last now, and folded away.
                        -->
                        <section class="vizy-editor-config-section">
                            <h3>${k(`vizy`,`Toolbar`)}</h3>
                            <!--
                                One sentence, naming the gesture that gets someone started. It grew
                                to five as each behaviour was added — remove, open a dropdown, edit
                                its contents, and why its contents are fixed — until it was a
                                paragraph of rules above a panel whose whole argument is that it can
                                be experimented with. Everything dropped from it is either something
                                the interface shows on contact or something only reached by trying:
                                clicking a dropdown opens it, and the rows say what they do.

                                'Delete' is the one loss worth naming, being the only affordance with
                                nothing on screen to hint at it. It is a second route to a removal
                                that dragging already does, so the sentence is not the place; the
                                docs are.
                            -->
                            <p class="instructions">${k(`vizy`,`Drag toolbar items into the editor.`)}</p>
                            <div class="vizy-editor-config-builder" data-builder="toolbar">
                                <!--
                                    Buttons and dropdowns in one row. A dropdown draws with a
                                    chevron and a wider box, here as in the strip, which is what
                                    tells the two apart — they had a shelf each while they wore the
                                    same square and could not be told apart at all, and a heading
                                    was doing work the item can do itself. Splitting them also cost
                                    the sequence: three of the steps 'PALETTE_ORDER' arranges are
                                    dropdowns, so a buttons-only row could state only part of it.

                                    Nothing a dropdown owns is offered here as well. A dropdown
                                    owns its members outright, so a toolbar cannot name them and
                                    the palette does not list them. See 'MEMBER_ONLY_IDS'.

                                    The set is registered rather than authored: a plugin adds to
                                    it through 'Extensions::EVENT_REGISTER_TOOLBAR_DROPDOWNS'.
                                    So is what each one may hold — a config can trim and reorder
                                    that roster, in the menu a selected dropdown opens, but not
                                    add to it.
                                -->
                                <div class="vizy-editor-config-group">
                                    <h4 class="vizy-editor-config-subhead">${k(`vizy`,`Available items`)}</h4>
                                    <div class="vizy-editor-config-available" data-builder-list="toolbar-available">
                                        ${this.#se(this.#E().map(e=>this.#ee(e,`toolbar`,`available`)).join(``),k(`vizy`,`Everything is in the toolbar.`),!1)}
                                    </div>
                                </div>
                                <div class="vizy-editor-config-group is-preview">
                                    <h4 class="vizy-editor-config-subhead">${k(`vizy`,`Toolbar preview`)}</h4>
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
                                            ${this.#se(o,k(`vizy`,`Drag items here.`))}
                                        </div>
                                        <!--
                                            The selected dropdown, open: a menu belongs under the
                                            trigger it hangs off, and '#alignMenu' puts it there.

                                            Overlaid rather than in the flow, so opening one does
                                            not grow the tinted panel and shove the rest of the
                                            page down. It covers the body stub below, which is
                                            decoration with no text in it, and hangs past the
                                            panel's bottom edge when it is taller than the stub.
                                        -->
                                        ${a===null?``:this.#ne(a)}
                                        <!--
                                            A stub of the editor's body. Decoration only: it
                                            reads as the editor's content rather than its
                                            UI, so it is outside the drop zone.
                                        -->
                                        <div class="vizy-editor-config-canvas"></div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section class="vizy-editor-config-section">
                            <h3>${k(`vizy`,`Bubble Menu`)}</h3>
                            <!--
                                A lightswitch rather than a checkbox, because this
                                switches a whole feature on and off rather than ticking
                                one of a set — the same distinction Craft draws in its
                                own settings screens.

                                The label and instructions belong to the 'pk-field' shell,
                                not to the switch: the shell owns the header, associates it
                                with whatever control it wraps, and gives the instructions
                                somewhere to live. Setting 'label' on the switch as well
                                would name the control twice.
                            -->
                            <pk-field
                                class="vizy-editor-config-toggle"
                                label="${A(k(`vizy`,`Show a Bubble Menu on selection`))}"
                                instructions="${A(k(`vizy`,`A small toolbar that appears over selected text, for formatting without reaching for the toolbar.`))}"
                            >
                                <pk-lightswitch
                                    data-bubble-enabled
                                    ${this.#e.bubble.enabled?`checked`:``}
                                ></pk-lightswitch>
                            </pk-field>
                            ${this.#e.bubble.enabled?`
                                <div class="vizy-editor-config-builder" data-builder="bubble">
                                    <div class="vizy-editor-config-group">
                                        <h4 class="vizy-editor-config-subhead">${k(`vizy`,`Available buttons`)}</h4>
                                        <div class="vizy-editor-config-available" data-builder-list="bubble-available">
                                            ${this.#se(this.#D().map(e=>this.#ee(e,`bubble`,`available`)).join(``),k(`vizy`,`Everything is in the Bubble Menu.`),!1)}
                                        </div>
                                    </div>
                                    <div class="vizy-editor-config-group">
                                        <h4 class="vizy-editor-config-subhead">${k(`vizy`,`Bubble Menu preview`)}</h4>
                                        <div class="vizy-editor-config-active is-bubble" data-builder-list="bubble-active">
                                            ${this.#se(s,k(`vizy`,`Drag items here.`))}
                                        </div>
                                    </div>
                                </div>
                            `:``}
                        </section>

                        ${this.#te()}
                    </div>
                `:`
                    <div class="vizy-editor-config-advanced">
                        <span class="vizy-editor-config-strip-label">${k(`vizy`,`Advanced configuration JSON`)}</span>
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
                            ${this.#p?`invalid`:``}
                        ></pk-code-editor>
                        ${this.#p?`<p class="vizy-editor-config-error">${this.#p}</p>`:``}
                    </div>
                `}
            </div>
        `,n&&n.scrollTop!==r&&(n.scrollTop=r),e.querySelectorAll(`[data-mode]`).forEach(e=>{e.onclick=()=>this.#O(e.dataset.mode)});let c=e.querySelector(`[data-schema-details]`);c&&c.addEventListener(`toggle`,()=>{this.#o=c.open}),e.querySelectorAll(`[data-capability-group]`).forEach(e=>{e.addEventListener(`pk-change`,t=>{let{value:n}=t.detail,r=n===`*`?e.options.map(e=>e.value):n,i=e.dataset.capabilityGroup;i===`headings`?this.#F(r.map(Number)):this.#j(i,r,e.options.map(e=>e.value))})});let l=e.querySelector(`[data-bubble-enabled]`);l&&l.addEventListener(`pk-change`,()=>{this.#e.bubble.enabled=l.checked,this.render()});let u=e.querySelector(`[data-advanced-json]`);u&&(u.value=this.#f,u.addEventListener(`pk-change`,e=>{this.#f=e.detail.value,this.#x()&&this.#Q()})),this.#ue(e),this.#me(e,t),this.#pe(e,i),this.#de(e),this.#Q()}#fe(e){let t=document.activeElement;if(!(t instanceof HTMLElement)||!e.contains(t))return null;let n=t.closest(`[data-toolbar-item]`),r=n?.parentElement?.dataset.builderList;return!n||!r?null:{list:r,index:[...n.parentElement.children].indexOf(n)}}#pe(e,t){if(!t)return;let n=e.querySelector(`[data-builder-list="${t.list}"]`)?.children[t.index];n instanceof HTMLElement&&n.matches(`[data-toolbar-item]`)&&n.focus({preventScroll:!0})}#me(e,t=0){let n=e.querySelector(`[data-builder-menu]`),r=e.querySelector(`[data-builder-list="toolbar-active"]`);if(!n||!r)return;n.scrollTop=t;let i=r.querySelector(`.vizy-control.is-selected`);if(!i)return;let a=n.closest(`.vizy-editor-config-editor`);if(!a)return;let o=i.getBoundingClientRect(),s=r.getBoundingClientRect(),c=o.bottom-a.getBoundingClientRect().top-1,l=o.left-s.left,u=Math.max(0,r.clientWidth-n.offsetWidth);n.style.insetBlockStart=`${c}px`,n.style.insetInlineStart=`${Math.max(0,Math.min(l,u))}px`}};customElements.get(`vizy-editor-config-settings`)||customElements.define(`vizy-editor-config-settings`,j);
//# sourceMappingURL=editor-config-settings-zuKdxos3.js.map