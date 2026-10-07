const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./code-editor-yZwOYIOt.js","./icon.styles-pNyUmVtP-DPahFGDP.js","./required-validator-CaRnQk1V-CzUuerCh.js","./form-control.styles-BHwSsx_y-fFZ3Cbqn.js"])))=>i.map(i=>d[i]);
import{L as e,M as t,N as n,P as r,R as i,U as a,V as o,y as s}from"./icon.styles-pNyUmVtP-DPahFGDP.js";import"./icons-z5rM1kSG.js";import{t as c}from"./menu-chevron-nu6QC8YA.js";import{t as l}from"./preload-helper-HclGiUj8.js";import{a as u,n as d,o as f,r as p,s as m}from"./lightswitch-CM83AxOw.js";/* empty css               */import"./pk-field-BJA2fZ6s-DMfY5VPT.js";import"./field-Cocqhglf.js";import{t as h}from"./VizyImageBrowserElement-CA5Lm7l-.js";var g=a`
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
`,_={fromAttribute(e){if(!e)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t.filter(e=>!!(e&&typeof e==`object`&&`value`in e)).map(e=>({label:String(e.label??e.value),value:String(e.value)})):[]}catch{return[]}},toAttribute(e){return JSON.stringify(e??[])}},v={fromAttribute(e){if(e==null||e===``)return[];if(e===`*`)return`*`;try{let t=JSON.parse(e);return t===`*`?`*`:Array.isArray(t)?t.map(String):[]}catch{return[]}},toAttribute(e){return e===`*`?`*`:JSON.stringify(e??[])}},y=class extends t{constructor(...e){super(...e),this.options=[],this.value=[],this.showAllOption=!1,this.allLabel=`All`,this.disabled=!1,this.orientation=`vertical`,this.ariaLabel=null,this.optionElements=[],this.allOptionElement=null,this.handleAllChange=e=>{e.stopPropagation(),this.value=e.detail.checked?`*`:[],this.dispatchValueChange()},this.handleItemChange=(e,t)=>{if(t.stopPropagation(),this.isAllSelected)return;let n=t.detail.checked,r=this.selectedValues;this.value=n?[...r,e]:r.filter(t=>t!==e),this.dispatchValueChange()}}static{this.styles=g}connectedCallback(){this.hasAttribute(`role`)||this.setAttribute(`role`,`group`),super.connectedCallback()}updated(e){if(e.has(`options`)||e.has(`showAllOption`)){this.rebuildOptionElements();return}(e.has(`value`)||e.has(`disabled`))&&this.updateOptionStates()}firstUpdated(){this.rebuildOptionElements()}focus(e){this.optionElements.find(e=>!e.disabled)?.focus(e)}get isAllSelected(){return this.value===`*`}get selectedValues(){return this.isAllSelected?this.options.map(e=>e.value):Array.isArray(this.value)?this.value:[]}dispatchValueChange(){let e=this.isAllSelected?`*`:[...this.selectedValues];this.dispatchEvent(new CustomEvent(`pk-change`,{detail:{value:e},bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0}))}rebuildOptionElements(){let e=this.shadowRoot?.querySelector(`.options`);if(e){for(let e of this.optionElements)e.remove();if(this.optionElements=[],this.allOptionElement=null,this.showAllOption){let t=document.createElement(`pk-checkbox`);t.classList.add(`all-option`),t.append(this.allLabel),t.addEventListener(`pk-change`,this.handleAllChange),e.append(t),this.allOptionElement=t,this.optionElements.push(t)}for(let t of this.options){let n=document.createElement(`pk-checkbox`);n.checkboxValue=t.value,n.append(t.label),n.addEventListener(`pk-change`,e=>{this.handleItemChange(t.value,e)}),e.append(n),this.optionElements.push(n)}this.updateOptionStates()}}updateOptionStates(){this.allOptionElement&&(this.allOptionElement.checked=this.isAllSelected,this.allOptionElement.disabled=this.disabled);for(let e of this.options){let t=this.optionElements.find(t=>t!==this.allOptionElement&&t.checkboxValue===e.value);t&&(t.checked=this.isAllSelected||this.selectedValues.includes(e.value),t.disabled=this.disabled||this.isAllSelected)}}render(){return o`
            <div
                part="base"
                class=${s({options:!0,"options--horizontal":this.orientation===`horizontal`})}
            ></div>
        `}};n([i({attribute:`options`,converter:_})],y.prototype,`options`,void 0),n([i({attribute:`value`,converter:v})],y.prototype,`value`,void 0),n([i({type:Boolean,attribute:`show-all-option`})],y.prototype,`showAllOption`,void 0),n([i({attribute:`all-label`})],y.prototype,`allLabel`,void 0),n([i({type:Boolean,reflect:!0})],y.prototype,`disabled`,void 0),n([i({reflect:!0})],y.prototype,`orientation`,void 0),n([i({attribute:`aria-label`})],y.prototype,`ariaLabel`,void 0),n([e()],y.prototype,`optionElements`,void 0),y=n([r(`pk-checkbox-select`)],y);function b(e){return e===`available`}var x=class e{#e;#t=[];#n=[];#r;#i={x:0,y:0};#a=null;#o=null;#s=null;#c=null;#l=0;#u=`active`;#d=!1;#f={x:0,y:0};static#p=10;static#m=5;constructor(t){this.#r=t,this.#e=new d({plugins:e=>[...e,u.configure({dropAnimation:null})],sensors:[m.configure({activationConstraints:[new f.Distance({value:e.#m})]})]}),this.#L()}refresh(){this.#H(),this.#v(this.#r.availableList(),`available`),this.#v(this.#r.activeList(),`active`),this.#v(this.#h(),`members`)}#h(){return this.#r.memberList?.()??null}#g(){return[this.#r.availableList()].filter(e=>!!e)}#_(){let e=[],t=this.#h();if(this.#s?.list===`members`)return t&&e.push({name:`members`,element:t}),e;let n=this.#r.activeList();return n&&e.push({name:`active`,element:n}),e}destroy(){this.#n.forEach(e=>e()),this.#n=[],this.#I(),this.#H(),this.#e.destroy()}#v(e,t){e&&this.#y(e).forEach((e,n)=>{let r=e.dataset.toolbarItem;r&&this.#t.push(new p({id:`${this.#r.type}-${t}-${n}-${r}`,element:e,type:this.#r.type,data:{itemId:r,list:t,index:n,repeatable:e.hasAttribute(`data-toolbar-repeatable`)}},this.#e))})}#y(e){return[...e.querySelectorAll(`[data-toolbar-item]`)]}#b=new Map;#x(){this.#b.clear();for(let t of this.#_())this.#b.set(t.name,this.#C(t.element,e.#S(t.name)))}static#S(e){return e===`members`?`block`:`inline`}#C(e,t){let n=this.#o,r=e.getBoundingClientRect(),i=[];return{element:e,axis:t,peers:this.#y(e).map((e,t)=>({peer:e,index:t})).filter(({peer:e})=>e!==n).map(({peer:e,index:n})=>{let a=e.getBoundingClientRect(),o=t===`inline`?a.top-r.top:a.left-r.left,s=t===`inline`?a.bottom-r.top:a.right-r.left,c=t===`inline`?a.left+a.width/2-r.left:a.top+a.height/2-r.top,l=i.at(-1);return!l||Math.abs(l.start-o)>1?i.push({start:o,end:s}):l.end=Math.max(l.end,s),{band:i.length-1,middle:c,index:n}}),bands:i}}#w(e,t){let n=0,r=1/0;return e.bands.forEach((e,i)=>{let a=t<e.start?e.start-t:Math.max(0,t-e.end);a<r&&(r=a,n=i)}),n}#T(e){let t=e.element.getBoundingClientRect(),n={x:this.#i.x-t.left,y:this.#i.y-t.top},r=e.axis===`inline`?n.x:n.y,i=this.#w(e,e.axis===`inline`?n.y:n.x),a=0;for(let t of e.peers){if(!(t.band<i||!(t.band>i)&&r>t.middle))break;a+=1}return a}#E(){if(this.#c)return this.#c;let e=this.#o.cloneNode(!0);return e.removeAttribute(`id`),e.removeAttribute(`data-toolbar-item`),e.removeAttribute(`aria-label`),e.removeAttribute(`aria-describedby`),e.setAttribute(`aria-hidden`,`true`),e.classList.remove(`is-lifted`),e.style.marginInlineEnd=``,e.classList.add(`is-slot`),this.#c=e,e}#D(e,t){if(!this.#o)return;let n=t.element,r=this.#T(t);this.#u=e,this.#l=r;let i=this.#y(n).filter(e=>e!==this.#o)[r]??n.querySelector(`[data-builder-tail]`),a=this.#E();(a.parentElement!==n||a.nextElementSibling!==i)&&n.insertBefore(a,i??null)}#O(){this.#c?.isConnected&&this.#c.remove()}#k(){if(!this.#o)return;let e=this.#A();if(!e){this.#O();return}this.#D(e.name,e.zone)}#A(){for(let{name:e,element:t}of this.#_()){let n=t.getBoundingClientRect();if(!(this.#i.x>=n.left&&this.#i.x<=n.right&&this.#i.y>=n.top&&this.#i.y<=n.bottom))continue;let r=this.#b.get(e);return r?{name:e,zone:r}:null}return null}#j(){return!!this.#c?.isConnected}#M(){let t=this.#o;if(!t||this.#N())return;t.classList.add(`is-lifted`);let n=t.parentElement,r=e.#S(this.#s?.list??`active`),i=n?getComputedStyle(n):null,a=parseFloat((r===`inline`?i?.columnGap:i?.rowGap)||``)||0,o=t.getBoundingClientRect(),s=r===`inline`?o.width:o.height;t.style[r===`inline`?`marginInlineEnd`:`marginBlockEnd`]=`-${s+a}px`}#N(){return!!this.#s?.repeatable&&b(this.#s.list)}#P(t){let n=this.#F();if(!n)return;let r=t.cloneNode(!0);r.removeAttribute(`id`),r.removeAttribute(`aria-describedby`),r.removeAttribute(`aria-roledescription`),r.setAttribute(`aria-hidden`,`true`),r.classList.add(`is-drag-helper`);let i=t.getBoundingClientRect(),a=this.#f.x-i.left+e.#p,o=this.#f.y-i.top+e.#p;r.style.setProperty(`transform`,`translate(${a}px, ${o}px)`,`important`),document.body.appendChild(r),this.#a=r,n.overlay=r}#F(){return this.#e.plugins.find(e=>e instanceof u)}#I(){let e=this.#F();e&&(e.overlay=void 0),this.#a?.remove(),this.#a=null}#L(){let e=e=>{this.#i={x:e.clientX,y:e.clientY},this.#k()},t=e=>{this.#f={x:e.clientX,y:e.clientY},this.#i={x:e.clientX,y:e.clientY}},n=e=>{let t=e.target instanceof Element&&e.target.closest(`[data-toolbar-item]`)!==null;this.#d&&t&&(e.preventDefault(),e.stopPropagation()),this.#d=!1};document.addEventListener(`pointerdown`,t,!0),document.addEventListener(`pointermove`,e,!0),document.addEventListener(`click`,n,!0),this.#n.push(()=>{document.removeEventListener(`pointerdown`,t,!0),document.removeEventListener(`pointermove`,e,!0),document.removeEventListener(`click`,n,!0)}),this.#n.push(this.#e.monitor.addEventListener(`beforedragstart`,e=>{let{source:t}=e.operation;t?.element instanceof HTMLElement&&this.#P(t.element)}),this.#e.monitor.addEventListener(`dragstart`,e=>{this.#r.container()?.classList.add(`is-sorting`);let{source:t}=e.operation;t?.element instanceof HTMLElement&&(this.#o=t.element,this.#s=t.data,this.#B(),this.#x(),this.#M(),this.#k())}),this.#e.monitor.addEventListener(`dragend`,e=>{let t=this.#s,n=this.#j(),r=this.#l,i=this.#u;if(this.#R(),this.#d=!0,!t?.itemId||e.canceled){this.#z(this.#r.onRevert);return}if(!n){if(b(t.list)){this.#z(this.#r.onRevert);return}this.#z(()=>this.#r.onDrop({itemId:t.itemId,from:t.list,to:`available`,fromIndex:t.index,index:t.index}));return}if(t.list===i&&r===t.index){this.#z(this.#r.onRevert);return}this.#z(()=>this.#r.onDrop({itemId:t.itemId,from:t.list,to:i,fromIndex:t.index,index:r}))}))}#R(){let e=this.#r.container();e?.classList.remove(`is-sorting`),e?.querySelectorAll(`.is-lifted`).forEach(e=>{e.classList.remove(`is-lifted`),e.style.marginInlineEnd=``,e.style.marginBlockEnd=``}),this.#O(),this.#c=null,this.#o=null,this.#s=null,this.#u=`active`,this.#b.clear(),this.#V(),this.#I()}#z(e){requestAnimationFrame(()=>e())}#B(){this.#g().forEach(e=>{e.style.minHeight=`${e.getBoundingClientRect().height}px`})}#V(){this.#g().forEach(e=>{e.style.minHeight=``})}#H(){this.#t.forEach(e=>{e.unregister(),e.destroy()}),this.#t=[]}},S=`dropdown:`;function C(e){return e.startsWith(S)}function w(e){return C(e)?e.slice(9):e}function T(e,t){let n=t.filter(t=>e.includes(t)),r=[...n];for(let t of e){if(n.includes(t))continue;let i=e.indexOf(t),a=r.findIndex(t=>n.includes(t)&&e.indexOf(t)>i);r.splice(a===-1?r.length:a,0,t)}return r}function E(e,t,n){return n!==void 0&&n>=0&&n<e.length&&e[n]===t?n:e.indexOf(t)}function D(e){return new Set(e)}var O=[1,2,3,4,5,6],k=[2,3,4];function A(e,t,n={}){return window.Craft?.t(e,t,n)??t.replace(/\{(\w+)\}/g,(e,t)=>n[t]??e)}function j(e){return e.replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e])}var M=class e extends HTMLElement{#e={capabilities:{nodes:[],marks:[],extensions:[]},extensionOptions:{characterCount:{limit:null},placeholder:{text:`Write something …`}},headings:{levels:[...k]},toolbar:[],dropdowns:{},bubble:{enabled:!0,items:[]},icons:{},gutterInsert:!0,slashInsert:!0};#t=[];#n=[];#r=[];#i={nodes:[],marks:[],extensions:[],headingAvailable:!1};#a={};#o=``;#s=``;#c=`visual`;#l=!1;#u=!1;#d=null;#f=e=>{if(!this.#d)return;let t=e.target;t instanceof Element&&(t.closest(`[data-builder-menu]`)||t.closest(`[data-toolbar-item]`)||this.#m())};#p=e=>{if(e.key!==`Escape`||!this.#d)return;let{list:t,index:n}=this.#d;this.#m();let r=this.querySelector(`[data-builder-list="${t}-active"]`)?.children[n];r instanceof HTMLElement&&r.focus({preventScroll:!0})};#m(){this.#d&&(this.#d=null,this.render())}#h=!1;#g=``;#_=``;#v=null;#y=new Map;#b;#x=0;#S=null;static#C=200;connectedCallback(){this.#v=this.querySelector(`[data-vizy-config-sync]`),this.#_e();let e=this.getAttribute(`data-initial`);if(e){let t=JSON.parse(e);this.#e={...t.config,dropdowns:t.config.dropdowns??{},capabilities:{nodes:[...t.config.capabilities?.nodes??[]],marks:[...t.config.capabilities?.marks??[]],extensions:[...t.config.capabilities?.extensions??[]]},extensionOptions:{characterCount:{limit:t.config.extensionOptions?.characterCount?.limit??null},placeholder:{text:t.config.extensionOptions?.placeholder?.text??`Write something …`}},gutterInsert:t.config.gutterInsert??!0,slashInsert:t.config.slashInsert??!0,bubble:{enabled:t.config.bubble?.enabled??!0,items:[...t.config.bubble?.items??[]]},icons:{...t.config.icons??{}}},this.#L(),this.#t=t.toolbarCatalog,this.#n=t.dropdownCatalog??[],this.#r=t.bubbleCatalog,this.#i={nodes:t.capabilityCatalog.nodes??[],marks:t.capabilityCatalog.marks??[],extensions:t.capabilityCatalog.extensions??[],headingAvailable:t.capabilityCatalog.headingAvailable??!1},this.#a=Object.fromEntries(Object.entries(t.iconSvgs??{}).filter(e=>typeof e[1]==`string`&&e[1]!==``)),this.#o=t.iconCatalogUrl??``,this.#s=Object.keys(this.#e.icons)[0]??this.#de()[0]?.id??``}this.#g=this.#w();let t=this.closest(`form`);t&&!t.dataset.vizyConfigBound&&(t.dataset.vizyConfigBound=`1`,t.addEventListener(`submit`,e=>{if(this.#c===`advanced`&&!this.#T()){e.preventDefault(),this.render();return}this.#ne()})),document.addEventListener(`click`,this.#f),document.addEventListener(`keydown`,this.#p),this.render()}disconnectedCallback(){this.#y.forEach(e=>e.destroy()),this.#y.clear(),document.removeEventListener(`click`,this.#f),document.removeEventListener(`keydown`,this.#p)}#w(){return JSON.stringify({capabilities:this.#e.capabilities,extensionOptions:this.#e.extensionOptions,headings:this.#e.headings,toolbar:this.#e.toolbar,dropdowns:this.#e.dropdowns,bubble:this.#e.bubble,icons:this.#e.icons,gutterInsert:this.#e.gutterInsert,slashInsert:this.#e.slashInsert},null,2)}#T(){try{let e=JSON.parse(this.#g),t=e.icons??{};if(typeof t!=`object`||!t||Array.isArray(t))throw Error(`Invalid icons map`);return this.#e={capabilities:{nodes:[...e.capabilities?.nodes??[]],marks:[...e.capabilities?.marks??[]],extensions:[...e.capabilities?.extensions??[]]},extensionOptions:{characterCount:{limit:e.extensionOptions?.characterCount?.limit??null},placeholder:{text:e.extensionOptions?.placeholder?.text??`Write something …`}},headings:{levels:[...e.headings?.levels??k]},toolbar:[...e.toolbar??[]],dropdowns:{...e.dropdowns??{}},bubble:{enabled:e.bubble?.enabled??!0,items:[...e.bubble?.items??[]]},icons:{...t},gutterInsert:e.gutterInsert??!0,slashInsert:e.slashInsert??!0},this.#L(),this.#_=``,!0}catch{return this.#_=A(`vizy`,`Invalid JSON`),!1}}#E(e,t){return t.find(t=>t.id===e)}#D(e){if(!C(e))return this.#E(e,this.#t);let t=this.#E(e,this.#n);return t?{...t,kind:`group`}:void 0}#O(e){return e.pending||e.kind===`presentation`||e.kind===`dropdown`?!0:e.kind===`action`?e.capabilityName===void 0||this.#e.capabilities.nodes.includes(e.capabilityName):e.kind===`mark`?this.#e.capabilities.marks.includes(e.capabilityName??e.id):e.kind===`extension`?this.#e.capabilities.extensions.includes(e.capabilityName??e.id):e.headingLevel===void 0?e.kind===`node`?e.id===`paragraph`||e.id===`hardBreak`||this.#e.capabilities.nodes.includes(e.capabilityName??e.id):!1:this.#e.headings.levels.includes(e.headingLevel)}#k(e){if(C(e))return!0;let t=this.#E(e,this.#t);return!t||t.kind===`presentation`||this.#O(t)}#A(){let e=D(this.#e.toolbar);return[...this.#t,...this.#n].filter(t=>t.memberOnly||e.has(t.id)&&!this.#B(t.id)?!1:this.#O(t)).sort((e,t)=>(e.paletteRank??0)-(t.paletteRank??0)).sort((e,t)=>Number(this.#B(e.id))-Number(this.#B(t.id)))}#j(){let e=new Set(this.#e.bubble.items);return this.#r.filter(t=>!e.has(t.id)&&this.#O(t))}#M(e){if(e===`visual`&&this.#c===`advanced`&&!this.#T()){this.render();return}e===`advanced`&&(this.#g=this.#w(),this.#_=``,this.#N()),this.#c=e,this.render()}async#N(){this.#h||(await l(()=>import(`./code-editor-yZwOYIOt.js`),__vite__mapDeps([0,1,2,3]),import.meta.url),this.#h=!0,this.#c===`advanced`&&this.render())}#P(e,t,n){let r=new Set(this.#e.capabilities[e]);n?r.add(t):r.delete(t),this.#e.capabilities[e]=[...r],this.render()}#F(e,t,n){let r=this.#e.capabilities[e].filter(e=>!n.includes(e));this.#e.capabilities[e]=[...new Set([...r,...t])],this.render()}#I(e,t,n){let r=t.length>0&&t.every(e=>n.includes(e.value))?`*`:JSON.stringify(n);return`
            <pk-checkbox-select
                data-capability-group="${j(e)}"
                show-all-option
                all-label="${j(A(`vizy`,`All`))}"
                options="${j(JSON.stringify(t))}"
                value="${j(r)}"
            ></pk-checkbox-select>
        `}#L(){this.#e.capabilities.nodes.includes(`heading`)||(this.#e.headings.levels=[])}#R(){return this.#e.headings.levels.length>0}#z(e){this.#e.headings.levels=[...e].sort((e,t)=>e-t),this.#P(`nodes`,`heading`,this.#R())}#B(e){return e===`separator`}#V(e,t){return E(this.#e.toolbar,e,t)}#H(e,t){!this.#B(e)&&this.#V(e)!==-1||(t===void 0?this.#e.toolbar.push(e):this.#e.toolbar.splice(t,0,e),this.render())}#U(){return this.#d?.list===`toolbar`?this.#e.toolbar[this.#d.index]??null:null}#W(){let e=this.#U();return e!==null&&C(e)?w(e):null}#G(e){return this.#E(`dropdown:${e}`,this.#n)?.members??[]}#K(e){return this.#e.dropdowns[e]??this.#G(e)}#q(e,t){let n=this.#G(e);t.length===n.length&&t.every((e,t)=>e===n[t])?delete this.#e.dropdowns[e]:this.#e.dropdowns[e]=t,this.render()}#J(e,t){let n=this.#G(e);if(!n.includes(t))return;let r=this.#K(e);if(r.includes(t)){if(r.length<=1)return;this.#q(e,r.filter(e=>e!==t));return}let i=n.indexOf(t),a=r.findIndex(e=>n.indexOf(e)>i),o=[...r];o.splice(a===-1?o.length:a,0,t),this.#q(e,o)}#Y(e,t,n){let r=[...this.#K(e)];if(t<0||n<0||t>=r.length||n>=r.length)return;let[i]=r.splice(t,1);r.splice(n,0,i),this.#q(e,r)}#X(e,t){let n=e===`toolbar`?this.#e.toolbar[t]:void 0;if(n===void 0||!C(n)){this.#m();return}let r=this.#d?.list===e&&this.#d.index===t;this.#d=r?null:{list:e,index:t},this.render()}#Z(e,t){let n=this.#V(e,t);n!==-1&&(this.#e.toolbar.splice(n,1),C(e)&&delete this.#e.dropdowns[w(e)],this.#d=null,this.render())}#Q(e,t){this.#e.bubble.items.includes(e)||(t===void 0?this.#e.bubble.items.push(e):this.#e.bubble.items.splice(t,0,e),this.render())}#$(e){this.#e.bubble.items=this.#e.bubble.items.filter(t=>t!==e),this.render()}#ee(e,t,n){let r=e===`toolbar`?this.#e.toolbar:this.#e.bubble.items;if(t<0||n<0||t>=r.length||n>=r.length)return;let[i]=r.splice(t,1);r.splice(n,0,i),this.render()}#te(e,t){if(e===`bubble`){b(t.to)?this.#$(t.itemId):b(t.from)?this.#Q(t.itemId,t.index):this.#ee(`bubble`,t.fromIndex,t.index);return}if(t.from===`members`){let e=this.#W();e!==null&&t.to===`members`?this.#Y(e,t.fromIndex,t.index):this.render();return}if(b(t.to)){this.#Z(t.itemId,t.fromIndex);return}if(b(t.from)){this.#d=null,this.#H(t.itemId,t.index);return}this.#d?.list===`toolbar`&&(this.#d=this.#d.index===t.fromIndex?{list:`toolbar`,index:t.index}:null),this.#ee(`toolbar`,t.fromIndex,t.index)}#ne(){if(!this.#v)return;this.#v.replaceChildren();let e=(e,t)=>{let n=document.createElement(`input`);n.type=`hidden`,n.name=e,n.value=t,this.#v?.append(n)};this.#e.capabilities.nodes.forEach(t=>e(`capabilityNodes[]`,t)),this.#e.capabilities.marks.forEach(t=>e(`capabilityMarks[]`,t)),this.#e.capabilities.extensions.forEach(t=>e(`capabilityExtensions[]`,t)),e(`extensionOptionsJson`,JSON.stringify(this.#e.extensionOptions)),this.#e.headings.levels.forEach(t=>e(`headingLevels[]`,String(t))),e(`toolbarJson`,JSON.stringify(this.#e.toolbar)),e(`dropdownsJson`,JSON.stringify(this.#e.dropdowns)),e(`bubbleJson`,JSON.stringify(this.#e.bubble)),e(`iconsJson`,JSON.stringify(this.#e.icons)),e(`gutterInsert`,this.#e.gutterInsert?`1`:`0`),e(`slashInsert`,this.#e.slashInsert?`1`:`0`),e(`advancedConfig`,this.#w())}#re(e){return this.#a[e.id]??e.icon??null}#ie(e){return this.#re(e)||(e.abbr?`<span class="vizy-control-abbr">${j(e.abbr)}</span>`:`<span class="vizy-control-text">${j(e.label)}</span>`)}#ae(e,t,n,r={}){let i=e.kind===`group`||e.kind===`dropdown`,a=e.valuePreview,o=a!==void 0,s=i||e.id===`addBlock`||o,l=this.#re(e);return`
            <button
                type="button"
                class="${[`vizy-control`,e.id===`separator`?`is-separator`:``,l||e.abbr||e.id===`separator`?``:`is-text`,s?`has-menu`:``,o?`text-style-control`:``,o&&e.valuePreviewKind===`color`?`text-style-control--color`:``,n===`available`?`is-available`:``,r.selected?`is-selected`:``,r.unavailable?`is-unavailable`:``,e.pending?`is-pending`:``].filter(Boolean).join(` `)}"
                aria-label="${j(e.pending?A(`vizy`,`{label} (not available yet)`,{label:e.label}):r.unavailable?A(`vizy`,`{label} (not allowed by this config)`,{label:e.label}):e.label)}"
                ${n===`active`&&i?`aria-expanded="${r.selected?`true`:`false`}"`:``}
                data-toolbar-item="${j(e.id)}"
                data-toolbar-list="${t}"
                data-toolbar-variant="${n}"
                ${this.#B(e.id)?`data-toolbar-repeatable`:``}
            >${e.id===`separator`?``:o?`<span class="text-style-control__value">${j(A(`vizy`,a))}</span>`:this.#ie(e)}${s?`<span class="vizy-control-chevron" aria-hidden="true">${c}</span>`:``}</button>
        `}#oe(){let e=[...this.#i.nodes,...this.#i.marks,...this.#i.extensions],t=e.filter(e=>this.#e.capabilities.nodes.includes(e.value)||this.#e.capabilities.marks.includes(e.value)||this.#e.capabilities.extensions.includes(e.value));return`
            <details class="vizy-editor-config-section vizy-editor-config-disclosure" data-schema-details ${this.#l?`open`:``}>
                <summary>
                    <span class="vizy-editor-config-disclosure-title">${A(`vizy`,`Content Schema`)}</span>
                    <span class="vizy-editor-config-disclosure-count">${A(`vizy`,`{allowed} of {total} content types allowed`,{allowed:String(t.length),total:String(e.length)})}</span>
                </summary>
                <p class="instructions">${A(`vizy`,`The nodes, marks, and behaviour extensions this editor understands. It governs pasted and imported content as well as the toolbar, so a content type can be allowed without being given a button — which is how existing formatting is preserved without authors being offered more of it.`)}</p>

                <div class="vizy-editor-config-subhead">${A(`vizy`,`Blocks and objects`)}</div>
                ${this.#I(`nodes`,this.#i.nodes,this.#e.capabilities.nodes)}

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
                    <div class="vizy-editor-config-subhead">${A(`vizy`,`Heading levels`)}</div>
                    <!--
                        No separate "Allow headings" switch. The levels are the setting: choosing
                        none is how headings are disallowed. Two controls for one decision meant
                        the switch could be on with no levels ticked, a state that had to be
                        papered over by seeding defaults.
                    -->
                    ${this.#I(`headings`,O.map(e=>({label:`H${e}`,value:String(e)})),this.#e.headings.levels.map(String))}
                `:``}

                <div class="vizy-editor-config-subhead">${A(`vizy`,`Inline formatting`)}</div>
                ${this.#I(`marks`,this.#i.marks,this.#e.capabilities.marks)}

                ${this.#i.extensions.length>0?`
                    <div class="vizy-editor-config-subhead">${A(`vizy`,`Behaviour extensions`)}</div>
                    <p class="instructions">${A(`vizy`,`TipTap modules that change editing behaviour without adding a document type. Enable them here so their JavaScript loads with this config.`)}</p>
                    ${this.#I(`extensions`,this.#i.extensions,this.#e.capabilities.extensions)}
                    ${this.#se()}
                `:``}
            </details>
        `}#se(){let e=this.#e.capabilities.extensions,t=[];return e.includes(`characterCount`)&&t.push(`
                <pk-field
                    label="${j(A(`vizy`,`Character limit`))}"
                    instructions="${j(A(`vizy`,`Leave blank to show the character and word counts without setting a limit.`))}"
                >
                    <input
                        type="number"
                        class="text fullwidth"
                        min="1"
                        max="2000000"
                        value="${this.#e.extensionOptions.characterCount.limit??``}"
                        data-character-count-limit
                    >
                </pk-field>
            `),e.includes(`placeholder`)&&t.push(`
                <pk-field
                    label="${j(A(`vizy`,`Placeholder text`))}"
                    instructions="${j(A(`vizy`,`Shown in an empty editor to prompt content authors.`))}"
                >
                    <input
                        type="text"
                        class="text fullwidth"
                        maxlength="250"
                        value="${j(this.#e.extensionOptions.placeholder.text)}"
                        data-placeholder-text
                    >
                </pk-field>
            `),t.length>0?`<div class="vizy-editor-config-extension-options">${t.join(``)}</div>`:``}#ce(e){let t=this.#G(e),n=this.#K(e);return`
            <div
                class="vizy-editor-config-menu"
                role="menu"
                data-size="sm"
                data-builder-list="toolbar-members"
                data-builder-menu
            >
                ${T(t,n).filter(e=>this.#le(e)).map(e=>this.#ue(e,!n.includes(e))).join(``)||`<p class="vizy-editor-config-menu-empty">${A(`vizy`,`Nothing in this dropdown can render, so it won’t appear.`)}</p>`}
            </div>
        `}#le(e){let t=this.#E(e,this.#t);return t!==void 0&&!t.pending&&this.#O(t)}#ue(e,t){let n=this.#E(e,this.#t);if(!n)return``;let r=t?A(`vizy`,`{label} (switched off)`,{label:n.label}):n.label;return`
            <button
                type="button"
                role="menuitem"
                class="vizy-editor-config-menu-item${t?` is-off`:``}"
                aria-label="${j(r)}"
                aria-pressed="${t?`false`:`true`}"
                data-toolbar-item="${j(n.id)}"
                data-toolbar-list="toolbar"
                data-toolbar-variant="member"
            >${this.#re(n)?`<span class="vizy-editor-config-menu-icon" aria-hidden="true">${this.#re(n)}</span>`:``}<span class="preview-label"${n.preview?` data-preview="${j(n.preview)}"`:``}>${j(n.label)}</span></button>
        `}#de(){let e=new Map;for(let t of[...this.#t,...this.#n,...this.#r])t.kind===`presentation`||t.iconCustomizable===!1||e.has(t.id)||e.set(t.id,t);let t=new Map,n=n=>{let r=e.get(n);r&&!t.has(n)&&t.set(n,r)};for(let e of this.#e.toolbar)n(e),C(e)&&this.#K(w(e)).forEach(n);return this.#e.bubble.items.forEach(n),Object.keys(this.#e.icons).forEach(n),[...t.values()]}#fe(){let e=this.#de();e.some(e=>e.id===this.#s)||(this.#s=Object.keys(this.#e.icons).find(t=>e.some(e=>e.id===t))??e[0]?.id??``);let t=this.#e.icons[this.#s]??``,n=this.#a[this.#s]??``,r=e.find(e=>e.id===this.#s),i=Object.keys(this.#e.icons).length,a=i===1?A(`vizy`,`{count} custom icon`,{count:String(i)}):A(`vizy`,`{count} custom icons`,{count:String(i)});return`
            <details class="vizy-editor-config-section vizy-editor-config-disclosure" data-icon-details ${this.#u?`open`:``}>
                <summary>
                    <span class="vizy-editor-config-disclosure-title">${A(`vizy`,`Icons`)}</span>
                    <span class="vizy-editor-config-disclosure-count">${j(a)}</span>
                </summary>
                <p class="instructions">${A(`vizy`,`Choose a control to replace its icon everywhere this config uses it. Clear the icon to restore Vizy’s default.`)}</p>
                ${e.length>0?`
                    <div class="vizy-editor-config-icon-designer">
                        <div class="vizy-editor-config-icon-grid" role="group" aria-label="${j(A(`vizy`,`Controls`))}">
                            ${e.map(e=>{let t=e.id===this.#s,n=Object.hasOwn(this.#e.icons,e.id);return`
                                    <button
                                        type="button"
                                        class="vizy-editor-config-icon-option${t?` is-selected`:``}${n?` is-custom`:``}"
                                        aria-pressed="${t?`true`:`false`}"
                                        data-icon-control="${j(e.id)}"
                                    >
                                        <span class="vizy-editor-config-icon-preview" aria-hidden="true">${this.#ie(e)}</span>
                                        <span class="vizy-editor-config-icon-name">${j(e.label)}</span>
                                        ${n?`<span class="vizy-editor-config-icon-custom">${A(`vizy`,`Custom`)}</span>`:``}
                                    </button>
                                `}).join(``)}
                        </div>
                        <div class="vizy-editor-config-icon-editor">
                            <pk-field
                                label="${j(A(`vizy`,`Icon for {label}`,{label:r?.label??``}))}"
                                instructions="${j(A(`vizy`,`Uses Vizy’s icon catalogue and SVG files from the configured icons path.`))}"
                            >
                                <vizy-image-browser
                                    name=""
                                    value="${j(t)}"
                                    mode="icon"
                                    label-mode="tooltip"
                                    placeholder="${j(A(`vizy`,`Use default icon`))}"
                                    search-placeholder="${j(A(`vizy`,`Search icons`))}"
                                    empty-message="${j(A(`vizy`,`No icons match your query.`))}"
                                    aria-label="${j(A(`vizy`,`Choose an icon for {label}`,{label:r?.label??``}))}"
                                    data-icon-picker
                                    data-catalog-url="${j(this.#o)}"
                                    data-selected-label="${j(t)}"
                                    data-selected-preview="${j(n)}"
                                ></vizy-image-browser>
                            </pk-field>
                        </div>
                    </div>
                `:`<p class="vizy-editor-config-icon-empty">${A(`vizy`,`Add controls to the Toolbar or Bubble Menu to customise their icons.`)}</p>`}
            </details>
        `}#pe(e){return`
            <span class="vizy-editor-config-empty" data-empty-placeholder>
                ${j(e)}
            </span>
        `}#me(){return`<span class="vizy-editor-config-tail" data-builder-tail></span>`}#he(e,t,n=!0){let r=e||this.#pe(t);return n?r+this.#me():r}async#ge(e){await e.updateComplete;let t=e.shadowRoot?.querySelector(`pk-popup`);if(!t||(await customElements.whenDefined(`pk-popup`),await t.updateComplete,!t.shadowRoot))return;let n=document.createElement(`style`);n.textContent=`:host, .hover-bridge, [part="content"] { pointer-events: none; }`,t.shadowRoot.appendChild(n)}#_e(){let t=document.createElement(`pk-tooltip`);t.setAttribute(`trigger`,`manual`),t.setAttribute(`placement`,`top`),this.appendChild(t),this.#b=t,this.#ge(t);let n=e=>e instanceof Element?e.closest(`.vizy-control`):null,r=e=>e instanceof Node&&t.contains(e),i=()=>{this.#S!==null&&(window.clearTimeout(this.#S),this.#S=null)},a=a=>{if(r(a.target))return;let o=n(a.target),s=o?.getAttribute(`aria-label`);if(i(),!o||!s||o.closest(`.is-sorting`)||o.hasAttribute(`data-dnd-placeholder`)){t.hide();return}this.#S=window.setTimeout(()=>{this.#S=null,!(!o.isConnected||o.closest(`.is-sorting`))&&(o.id||=`vizy-control-${++this.#x}`,t.for=o.id,t.content=s,t.show())},e.#C)},o=e=>{r(e.target)||(i(),t.hide())};this.addEventListener(`pointerover`,a),this.addEventListener(`focusin`,a),this.addEventListener(`pointerout`,o),this.addEventListener(`focusout`,o),this.addEventListener(`pointerdown`,o)}#ve(e){let t=e=>{let t=[...e.parentElement?.children??[]].indexOf(e);return t===-1?void 0:t};e.querySelectorAll(`[data-toolbar-item]`).forEach(e=>{let n=e.dataset.toolbarItem,r=e.dataset.toolbarList,i=e.dataset.toolbarVariant;if(!n||!r)return;let a=()=>{if(i===`available`){r===`toolbar`?this.#H(n):this.#Q(n);return}if(i===`member`){let e=this.#W();e!==null&&this.#J(e,n);return}this.#X(r,t(e)??-1)};e.onclick=a,e.onkeydown=o=>{if(o.key===`Delete`||o.key===`Backspace`){if(i!==`active`)return;o.preventDefault(),r===`toolbar`?this.#Z(n,t(e)):this.#$(n);return}(o.key===`Enter`||o.key===` `)&&(o.preventDefault(),a())}})}#ye(e){[`toolbar`,`bubble`].forEach(t=>{let n=()=>e.querySelector(`[data-builder="${t}"]`);if(!n()){this.#y.get(t)?.destroy(),this.#y.delete(t);return}let r=this.#y.get(t);r||(r=new x({container:n,type:`vizy-${t}-control`,availableList:()=>e.querySelector(`[data-builder-list="${t}-available"]`),activeList:()=>e.querySelector(`[data-builder-list="${t}-active"]`),memberList:()=>e.querySelector(`[data-builder-list="${t}-members"]`),onDrop:e=>this.#te(t,e),onRevert:()=>this.render()}),this.#y.set(t,r)),r.refresh()})}render(){let e=this.querySelector(`[data-vizy-config-host]`);if(!e)return;let t=e.querySelector(`[data-builder-menu]`)?.scrollTop??0,n=document.scrollingElement,r=n?.scrollTop??0,i=this.#be(e),a=this.#W(),o=this.#e.toolbar.map((e,t)=>{let n=this.#D(e);return n?this.#ae(n,`toolbar`,`active`,{unavailable:!this.#k(e),selected:this.#d?.list===`toolbar`&&this.#d.index===t}):``}).join(``),s=this.#e.bubble.items.map((e,t)=>{let n=this.#E(e,this.#r);return n?this.#ae(n,`bubble`,`active`,{selected:this.#d?.list===`bubble`&&this.#d.index===t}):``}).join(``);e.innerHTML=`
            <div class="vizy-editor-config">
                <div class="vizy-editor-config-tabs">
                    <button type="button" class="${this.#c===`visual`?`active`:``}" data-mode="visual">${A(`vizy`,`Visual`)}</button>
                    <button type="button" class="${this.#c===`advanced`?`active`:``}" data-mode="advanced">${A(`vizy`,`Advanced`)}</button>
                </div>

                ${this.#c===`visual`?`
                    <div class="vizy-editor-config-panel">
                        <!--
                            The toolbar leads, because it is what these configs are opened to
                            change. What the editor is *able* to represent used to come first,
                            which put an advanced decision — and one most configs want left
                            alone — in front of the routine one, and made buttons look missing
                            when they were only unticked. It is last now, and folded away.
                        -->
                        <section class="vizy-editor-config-section">
                            <h3>${A(`vizy`,`Toolbar`)}</h3>
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
                            <p class="instructions">${A(`vizy`,`Drag toolbar items into the editor.`)}</p>
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
                                    <h4 class="vizy-editor-config-subhead">${A(`vizy`,`Available items`)}</h4>
                                    <div class="vizy-editor-config-available" data-builder-list="toolbar-available">
                                        ${this.#he(this.#A().map(e=>this.#ae(e,`toolbar`,`available`)).join(``),A(`vizy`,`Everything is in the toolbar.`),!1)}
                                    </div>
                                </div>
                                <div class="vizy-editor-config-group is-preview">
                                    <h4 class="vizy-editor-config-subhead">${A(`vizy`,`Toolbar preview`)}</h4>
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
                                            ${this.#he(o,A(`vizy`,`Drag items here.`))}
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
                                        ${a===null?``:this.#ce(a)}
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
                            <h3>${A(`vizy`,`Block Insertion`)}</h3>
                            <pk-field
                                class="vizy-editor-config-toggle"
                                label="${j(A(`vizy`,`Show Gutter Button`))}"
                                instructions="${j(A(`vizy`,`Whether to show a + button in the gutter (to the side) of each block to open the Add Block palette.`))}"
                            >
                                <pk-lightswitch
                                    data-gutter-insert
                                    ${this.#e.gutterInsert?`checked`:``}
                                ></pk-lightswitch>
                            </pk-field>
                            <pk-field
                                class="vizy-editor-config-toggle"
                                label="${j(A(`vizy`,`Enable Slash Command`))}"
                                instructions="${j(A(`vizy`,`Whether to enable the / shortcut on a blank line to open the Add Block palette.`))}"
                            >
                                <pk-lightswitch
                                    data-slash-insert
                                    ${this.#e.slashInsert?`checked`:``}
                                ></pk-lightswitch>
                            </pk-field>
                        </section>

                        <section class="vizy-editor-config-section">
                            <h3>${A(`vizy`,`Bubble Menu`)}</h3>
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
                                label="${j(A(`vizy`,`Show Bubble Menu`))}"
                                instructions="${j(A(`vizy`,`A small toolbar that appears over selected text, for formatting without reaching for the toolbar.`))}"
                            >
                                <pk-lightswitch
                                    data-bubble-enabled
                                    ${this.#e.bubble.enabled?`checked`:``}
                                ></pk-lightswitch>
                            </pk-field>
                            ${this.#e.bubble.enabled?`
                                <div class="vizy-editor-config-builder" data-builder="bubble">
                                    <div class="vizy-editor-config-group">
                                        <h4 class="vizy-editor-config-subhead">${A(`vizy`,`Available buttons`)}</h4>
                                        <div class="vizy-editor-config-available" data-builder-list="bubble-available">
                                            ${this.#he(this.#j().map(e=>this.#ae(e,`bubble`,`available`)).join(``),A(`vizy`,`Everything is in the Bubble Menu.`),!1)}
                                        </div>
                                    </div>
                                    <div class="vizy-editor-config-group">
                                        <h4 class="vizy-editor-config-subhead">${A(`vizy`,`Bubble Menu preview`)}</h4>
                                        <div class="vizy-editor-config-active is-bubble" data-builder-list="bubble-active">
                                            ${this.#he(s,A(`vizy`,`Drag items here.`))}
                                        </div>
                                    </div>
                                </div>
                            `:``}
                        </section>

                        ${this.#oe()}
                        ${this.#fe()}
                    </div>
                `:`
                    <div class="vizy-editor-config-advanced">
                        <span class="vizy-editor-config-strip-label">${A(`vizy`,`Advanced configuration JSON`)}</span>
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
                            ${this.#_?`invalid`:``}
                        ></pk-code-editor>
                        ${this.#_?`<p class="vizy-editor-config-error">${this.#_}</p>`:``}
                    </div>
                `}
            </div>
        `,n&&n.scrollTop!==r&&(n.scrollTop=r),e.querySelectorAll(`[data-mode]`).forEach(e=>{e.onclick=()=>this.#M(e.dataset.mode)});let c=e.querySelector(`[data-schema-details]`);c&&c.addEventListener(`toggle`,()=>{this.#l=c.open});let l=e.querySelector(`[data-icon-details]`);l&&l.addEventListener(`toggle`,()=>{this.#u=l.open}),e.querySelectorAll(`[data-icon-control]`).forEach(e=>{e.addEventListener(`click`,()=>{this.#s=e.dataset.iconControl??``,this.render(),[...this.querySelectorAll(`[data-icon-control]`)].find(e=>e.dataset.iconControl===this.#s)?.focus({preventScroll:!0})})});let u=e.querySelector(`[data-icon-picker]`);u&&u.addEventListener(`pk-change`,e=>{let t=this.#s,n=e.detail.value;if(n===``){delete this.#e.icons[t],delete this.#a[t],this.render();return}if(this.#e.icons[t]=n,this.#ne(),this.#o===``){this.render();return}h(this.#o,n).then(e=>{this.#e.icons[t]===n&&(e?this.#a[t]=e:delete this.#a[t],this.render())})}),e.querySelectorAll(`[data-capability-group]`).forEach(e=>{e.addEventListener(`pk-change`,t=>{let{value:n}=t.detail,r=n===`*`?e.options.map(e=>e.value):n,i=e.dataset.capabilityGroup;i===`headings`?this.#z(r.map(Number)):this.#F(i,r,e.options.map(e=>e.value))})});let d=e.querySelector(`[data-character-count-limit]`);d&&d.addEventListener(`input`,()=>{let e=d.valueAsNumber;this.#e.extensionOptions.characterCount.limit=Number.isFinite(e)?e:null,this.#ne()});let f=e.querySelector(`[data-placeholder-text]`);f&&f.addEventListener(`input`,()=>{this.#e.extensionOptions.placeholder.text=f.value,this.#ne()});let p=e.querySelector(`[data-bubble-enabled]`);p&&p.addEventListener(`pk-change`,()=>{this.#e.bubble.enabled=p.checked,this.render()});let m=e.querySelector(`[data-gutter-insert]`);m&&m.addEventListener(`pk-change`,()=>{this.#e.gutterInsert=m.checked,this.render()});let g=e.querySelector(`[data-slash-insert]`);g&&g.addEventListener(`pk-change`,()=>{this.#e.slashInsert=g.checked,this.render()});let _=e.querySelector(`[data-advanced-json]`);_&&(_.value=this.#g,_.addEventListener(`pk-change`,e=>{this.#g=e.detail.value,this.#T()&&this.#ne()})),this.#ve(e),this.#Se(e,t),this.#xe(e,i),this.#ye(e),this.#ne()}#be(e){let t=document.activeElement;if(!(t instanceof HTMLElement)||!e.contains(t))return null;let n=t.closest(`[data-toolbar-item]`),r=n?.parentElement?.dataset.builderList;return!n||!r?null:{list:r,index:[...n.parentElement.children].indexOf(n)}}#xe(e,t){if(!t)return;let n=e.querySelector(`[data-builder-list="${t.list}"]`)?.children[t.index];n instanceof HTMLElement&&n.matches(`[data-toolbar-item]`)&&n.focus({preventScroll:!0})}#Se(e,t=0){let n=e.querySelector(`[data-builder-menu]`),r=e.querySelector(`[data-builder-list="toolbar-active"]`);if(!n||!r)return;n.scrollTop=t;let i=r.querySelector(`.vizy-control.is-selected`);if(!i)return;let a=n.closest(`.vizy-editor-config-editor`);if(!a)return;let o=i.getBoundingClientRect(),s=r.getBoundingClientRect(),c=o.bottom-a.getBoundingClientRect().top-1,l=o.left-s.left,u=Math.max(0,r.clientWidth-n.offsetWidth);n.style.insetBlockStart=`${c}px`,n.style.insetInlineStart=`${Math.max(0,Math.min(l,u))}px`}};customElements.get(`vizy-editor-config-settings`)||customElements.define(`vizy-editor-config-settings`,M);
//# sourceMappingURL=editor-config-settings-ukNq4SK1.js.map