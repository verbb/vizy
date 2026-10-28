const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./code-editor-DKoZyTzW.js","./dismissible-stack-CwhtwAyo-hcp-3Qpk.js","./rolldown-runtime-XKyaHtl9.js","./w3c-keyname-BOAvb0qz.js","./required-validator-I58oJGZ3-4YNEUxSQ.js","./form-control.styles-CQ93gnVf-BUSJaXkf.js"])))=>i.map(i=>d[i]);
import{A as e,D as t,I as n,O as r,R as i,j as a,k as o,y as s}from"./dismissible-stack-CwhtwAyo-hcp-3Qpk.js";import"./tooltip-C-EpDcfE.js";import{t as c}from"./preload-helper-CRzLMJPS.js";import{a as l,n as u,o as d,r as f,s as p}from"./lightswitch-s8khPK6K.js";/* empty css               */import"./pk-field-6OVCzjr7-Dk9gR31X.js";import"./field-D7D8ybOX.js";import{t as m}from"./menu-chevron-CVwg1Hpy.js";import{t as h}from"./VizyImageBrowserElement-BfgaZEHy.js";var g=i`
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
`,_={fromAttribute(e){if(!e)return[];try{let t=JSON.parse(e);return Array.isArray(t)?t.filter(e=>!!(e&&typeof e==`object`&&`value`in e)).map(e=>({label:String(e.label??e.value),value:String(e.value)})):[]}catch{return[]}},toAttribute(e){return JSON.stringify(e??[])}},v={fromAttribute(e){if(e==null||e===``)return[];if(e===`*`)return`*`;try{let t=JSON.parse(e);return t===`*`?`*`:Array.isArray(t)?t.map(String):[]}catch{return[]}},toAttribute(e){return e===`*`?`*`:JSON.stringify(e??[])}},y=class extends o{constructor(...e){super(...e),this.options=[],this.value=[],this.showAllOption=!1,this.allLabel=`All`,this.disabled=!1,this.orientation=`vertical`,this.ariaLabel=null,this.optionElements=[],this.allOptionElement=null,this.handleAllChange=e=>{e.stopPropagation(),this.value=e.detail.checked?`*`:[],this.dispatchValueChange()},this.handleItemChange=(e,t)=>{if(t.stopPropagation(),this.isAllSelected)return;let n=t.detail.checked,r=this.selectedValues;this.value=n?[...r,e]:r.filter(t=>t!==e),this.dispatchValueChange()}}static{this.styles=g}connectedCallback(){this.hasAttribute(`role`)||this.setAttribute(`role`,`group`),super.connectedCallback()}updated(e){e.has(`options`)||e.has(`showAllOption`)?this.rebuildOptionElements():(e.has(`value`)||e.has(`disabled`))&&this.updateOptionStates()}firstUpdated(){this.rebuildOptionElements()}focus(e){this.optionElements.find(e=>!e.disabled)?.focus(e)}get isAllSelected(){return this.value===`*`}get selectedValues(){return this.isAllSelected?this.options.map(e=>e.value):Array.isArray(this.value)?this.value:[]}dispatchValueChange(){let e=this.isAllSelected?`*`:[...this.selectedValues];this.dispatchEvent(new CustomEvent(`pk-change`,{detail:{value:e},bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0}))}rebuildOptionElements(){let e=this.shadowRoot?.querySelector(`.options`);if(e){for(let e of this.optionElements)e.remove();if(this.optionElements=[],this.allOptionElement=null,this.showAllOption){let t=document.createElement(`pk-checkbox`);t.classList.add(`all-option`),t.append(this.allLabel),t.addEventListener(`pk-change`,this.handleAllChange),e.append(t),this.allOptionElement=t,this.optionElements.push(t)}for(let t of this.options){let n=document.createElement(`pk-checkbox`);n.checkboxValue=t.value,n.append(t.label),n.addEventListener(`pk-change`,e=>{this.handleItemChange(t.value,e)}),e.append(n),this.optionElements.push(n)}this.updateOptionStates()}}updateOptionStates(){this.allOptionElement&&(this.allOptionElement.checked=this.isAllSelected,this.allOptionElement.disabled=this.disabled);for(let e of this.options){let t=this.optionElements.find(t=>t!==this.allOptionElement&&t.checkboxValue===e.value);t&&(t.checked=this.isAllSelected||this.selectedValues.includes(e.value),t.disabled=this.disabled||this.isAllSelected)}}render(){return n`
            <div
                part="base"
                class=${s({options:!0,"options--horizontal":this.orientation===`horizontal`})}
            ></div>
        `}};e([r({attribute:`options`,converter:_})],y.prototype,`options`,void 0),e([r({attribute:`value`,converter:v})],y.prototype,`value`,void 0),e([r({type:Boolean,attribute:`show-all-option`})],y.prototype,`showAllOption`,void 0),e([r({attribute:`all-label`})],y.prototype,`allLabel`,void 0),e([r({type:Boolean,reflect:!0})],y.prototype,`disabled`,void 0),e([r({reflect:!0})],y.prototype,`orientation`,void 0),e([r({attribute:`aria-label`})],y.prototype,`ariaLabel`,void 0),e([t()],y.prototype,`optionElements`,void 0),y=e([a(`pk-checkbox-select`)],y);function b(e){return e===`available`}var x=class e{#e;#t=[];#n=[];#r;#i={x:0,y:0};#a=null;#o=null;#s=null;#c=null;#l=0;#u=`active`;#d=!1;#f={x:0,y:0};static#p=10;static#m=5;constructor(t){this.#r=t,this.#e=new u({plugins:e=>[...e,l.configure({dropAnimation:null})],sensors:[p.configure({activationConstraints:[new d.Distance({value:e.#m})]})]}),this.#L()}refresh(){this.#H(),this.#v(this.#r.availableList(),`available`),this.#v(this.#r.activeList(),`active`),this.#v(this.#h(),`members`)}#h(){return this.#r.memberList?.()??null}#g(){return[this.#r.availableList()].filter(e=>!!e)}#_(){let e=[],t=this.#h();if(this.#s?.list===`members`)return t&&e.push({name:`members`,element:t}),e;let n=this.#r.activeList();return n&&e.push({name:`active`,element:n}),e}destroy(){this.#n.forEach(e=>e()),this.#n=[],this.#I(),this.#H(),this.#e.destroy()}#v(e,t){e&&this.#y(e).forEach((e,n)=>{let r=e.dataset.toolbarItem;r&&this.#t.push(new f({id:`${this.#r.type}-${t}-${n}-${r}`,element:e,type:this.#r.type,data:{itemId:r,list:t,index:n,repeatable:e.hasAttribute(`data-toolbar-repeatable`)}},this.#e))})}#y(e){return[...e.querySelectorAll(`[data-toolbar-item]`)]}#b=new Map;#x(){this.#b.clear();for(let t of this.#_())this.#b.set(t.name,this.#C(t.element,e.#S(t.name)))}static#S(e){return e===`members`?`block`:`inline`}#C(e,t){let n=this.#o,r=e.getBoundingClientRect(),i=[];return{element:e,axis:t,peers:this.#y(e).map((e,t)=>({peer:e,index:t})).filter(({peer:e})=>e!==n).map(({peer:e,index:n})=>{let a=e.getBoundingClientRect(),o=t===`inline`?a.top-r.top:a.left-r.left,s=t===`inline`?a.bottom-r.top:a.right-r.left,c=t===`inline`?a.left+a.width/2-r.left:a.top+a.height/2-r.top,l=i.at(-1);return!l||Math.abs(l.start-o)>1?i.push({start:o,end:s}):l.end=Math.max(l.end,s),{band:i.length-1,middle:c,index:n}}),bands:i}}#w(e,t){let n=0,r=1/0;return e.bands.forEach((e,i)=>{let a=t<e.start?e.start-t:Math.max(0,t-e.end);a<r&&(r=a,n=i)}),n}#T(e){let t=e.element.getBoundingClientRect(),n={x:this.#i.x-t.left,y:this.#i.y-t.top},r=e.axis===`inline`?n.x:n.y,i=this.#w(e,e.axis===`inline`?n.y:n.x),a=0;for(let t of e.peers){if(!(t.band<i||!(t.band>i)&&r>t.middle))break;a+=1}return a}#E(){if(this.#c)return this.#c;let e=this.#o.cloneNode(!0);return e.removeAttribute(`id`),e.removeAttribute(`data-toolbar-item`),e.removeAttribute(`aria-label`),e.removeAttribute(`aria-describedby`),e.setAttribute(`aria-hidden`,`true`),e.classList.remove(`is-lifted`),e.style.marginInlineEnd=``,e.classList.add(`is-slot`),this.#c=e,e}#D(e,t){if(!this.#o)return;let n=t.element,r=this.#T(t);this.#u=e,this.#l=r;let i=this.#y(n).filter(e=>e!==this.#o)[r]??n.querySelector(`[data-builder-tail]`),a=this.#E();(a.parentElement!==n||a.nextElementSibling!==i)&&n.insertBefore(a,i??null)}#O(){this.#c?.isConnected&&this.#c.remove()}#k(){if(!this.#o)return;let e=this.#A();e?this.#D(e.name,e.zone):this.#O()}#A(){for(let{name:e,element:t}of this.#_()){let n=t.getBoundingClientRect();if(!(this.#i.x>=n.left&&this.#i.x<=n.right&&this.#i.y>=n.top&&this.#i.y<=n.bottom))continue;let r=this.#b.get(e);return r?{name:e,zone:r}:null}return null}#j(){return!!this.#c?.isConnected}#M(){let t=this.#o;if(!t||this.#N())return;t.classList.add(`is-lifted`);let n=t.parentElement,r=e.#S(this.#s?.list??`active`),i=n?getComputedStyle(n):null,a=parseFloat((r===`inline`?i?.columnGap:i?.rowGap)||``)||0,o=t.getBoundingClientRect(),s=r===`inline`?o.width:o.height;t.style[r===`inline`?`marginInlineEnd`:`marginBlockEnd`]=`-${s+a}px`}#N(){return!!this.#s?.repeatable&&b(this.#s.list)}#P(t){let n=this.#F();if(!n)return;let r=t.cloneNode(!0);r.removeAttribute(`id`),r.removeAttribute(`aria-describedby`),r.removeAttribute(`aria-roledescription`),r.setAttribute(`aria-hidden`,`true`),r.classList.add(`is-drag-helper`);let i=t.getBoundingClientRect(),a=this.#f.x-i.left+e.#p,o=this.#f.y-i.top+e.#p;r.style.setProperty(`transform`,`translate(${a}px, ${o}px)`,`important`),document.body.appendChild(r),this.#a=r,n.overlay=r}#F(){return this.#e.plugins.find(e=>e instanceof l)}#I(){let e=this.#F();e&&(e.overlay=void 0),this.#a?.remove(),this.#a=null}#L(){let e=e=>{this.#i={x:e.clientX,y:e.clientY},this.#k()},t=e=>{this.#f={x:e.clientX,y:e.clientY},this.#i={x:e.clientX,y:e.clientY}},n=e=>{let t=e.target instanceof Element&&e.target.closest(`[data-toolbar-item]`)!==null;this.#d&&t&&(e.preventDefault(),e.stopPropagation()),this.#d=!1};document.addEventListener(`pointerdown`,t,!0),document.addEventListener(`pointermove`,e,!0),document.addEventListener(`click`,n,!0),this.#n.push(()=>{document.removeEventListener(`pointerdown`,t,!0),document.removeEventListener(`pointermove`,e,!0),document.removeEventListener(`click`,n,!0)}),this.#n.push(this.#e.monitor.addEventListener(`beforedragstart`,e=>{let{source:t}=e.operation;t?.element instanceof HTMLElement&&this.#P(t.element)}),this.#e.monitor.addEventListener(`dragstart`,e=>{this.#r.container()?.classList.add(`is-sorting`);let{source:t}=e.operation;t?.element instanceof HTMLElement&&(this.#o=t.element,this.#s=t.data,this.#B(),this.#x(),this.#M(),this.#k())}),this.#e.monitor.addEventListener(`dragend`,e=>{let t=this.#s,n=this.#j(),r=this.#l,i=this.#u;if(this.#R(),this.#d=!0,!t?.itemId||e.canceled)this.#z(this.#r.onRevert);else if(n)t.list===i&&r===t.index?this.#z(this.#r.onRevert):this.#z(()=>this.#r.onDrop({itemId:t.itemId,from:t.list,to:i,fromIndex:t.index,index:r}));else{if(b(t.list)){this.#z(this.#r.onRevert);return}this.#z(()=>this.#r.onDrop({itemId:t.itemId,from:t.list,to:`available`,fromIndex:t.index,index:t.index}))}}))}#R(){let e=this.#r.container();e?.classList.remove(`is-sorting`),e?.querySelectorAll(`.is-lifted`).forEach(e=>{e.classList.remove(`is-lifted`),e.style.marginInlineEnd=``,e.style.marginBlockEnd=``}),this.#O(),this.#c=null,this.#o=null,this.#s=null,this.#u=`active`,this.#b.clear(),this.#V(),this.#I()}#z(e){requestAnimationFrame(()=>e())}#B(){this.#g().forEach(e=>{e.style.minHeight=`${e.getBoundingClientRect().height}px`})}#V(){this.#g().forEach(e=>{e.style.minHeight=``})}#H(){this.#t.forEach(e=>{e.unregister(),e.destroy()}),this.#t=[]}},S=`dropdown:`;function C(e){return e.startsWith(S)}function w(e){return C(e)?e.slice(9):e}function T(e,t){let n=t.filter(t=>e.includes(t)),r=[...n];for(let t of e){if(n.includes(t))continue;let i=e.indexOf(t),a=r.findIndex(t=>n.includes(t)&&e.indexOf(t)>i);r.splice(a===-1?r.length:a,0,t)}return r}function E(e,t,n){return n!==void 0&&n>=0&&n<e.length&&e[n]===t?n:e.indexOf(t)}function D(e){return new Set(e)}var O=[1,2,3,4,5,6],k=[2,3,4],A=new Set([`characterCount`,`placeholder`,`typography`]);function j(e,t,n={}){return window.Craft?.t(e,t,n)??t.replace(/\{(\w+)\}/g,(e,t)=>n[t]??e)}function M(e){return e.replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e])}var N=class e extends HTMLElement{#e={capabilities:{nodes:[],marks:[],extensions:[]},extensionOptions:{characterCount:{limit:null},placeholder:{text:`Write something …`}},headings:{levels:[...k]},toolbar:[],dropdowns:{},bubble:{enabled:!0,items:[]},icons:{},gutterInsert:!0,slashInsert:!0};#t=[];#n=[];#r=[];#i={nodes:[],marks:[],extensions:[],headingAvailable:!1};#a={};#o=``;#s=``;#c=`visual`;#l=!1;#u=!1;#d=null;#f=e=>{if(!this.#d)return;let t=e.target;t instanceof Element&&(t.closest(`[data-builder-menu]`)||t.closest(`[data-toolbar-item]`)||this.#m())};#p=e=>{if(e.key!==`Escape`||!this.#d)return;let{list:t,index:n}=this.#d;this.#m();let r=this.querySelector(`[data-builder-list="${t}-active"]`)?.children[n];r instanceof HTMLElement&&r.focus({preventScroll:!0})};#m(){this.#d&&(this.#d=null,this.render())}#h=!1;#g=``;#_=``;#v=null;#y=new Map;#b;#x=0;#S=null;static#C=200;connectedCallback(){this.#v=this.querySelector(`[data-vizy-config-sync]`),this.#Se();let e=this.getAttribute(`data-initial`);if(e){let t=JSON.parse(e);this.#e={...t.config,dropdowns:t.config.dropdowns??{},capabilities:{nodes:[...t.config.capabilities?.nodes??[]],marks:[...t.config.capabilities?.marks??[]],extensions:[...t.config.capabilities?.extensions??[]]},extensionOptions:{characterCount:{limit:t.config.extensionOptions?.characterCount?.limit??null},placeholder:{text:t.config.extensionOptions?.placeholder?.text??`Write something …`}},gutterInsert:t.config.gutterInsert??!0,slashInsert:t.config.slashInsert??!0,bubble:{enabled:t.config.bubble?.enabled??!0,items:[...t.config.bubble?.items??[]]},icons:{...t.config.icons??{}}},this.#V(),this.#t=t.toolbarCatalog,this.#n=t.dropdownCatalog??[],this.#r=t.bubbleCatalog,this.#i={nodes:t.capabilityCatalog.nodes??[],marks:t.capabilityCatalog.marks??[],extensions:t.capabilityCatalog.extensions??[],headingAvailable:t.capabilityCatalog.headingAvailable??!1},this.#a=Object.fromEntries(Object.entries(t.iconSvgs??{}).filter(e=>typeof e[1]==`string`&&e[1]!==``)),this.#o=t.iconCatalogUrl??``,this.#s=Object.keys(this.#e.icons)[0]??this.#ge()[0]?.id??``}this.#g=this.#w();let t=this.closest(`form`);t&&!t.dataset.vizyConfigBound&&(t.dataset.vizyConfigBound=`1`,t.addEventListener(`submit`,e=>{this.#c===`advanced`&&!this.#T()?(e.preventDefault(),this.render()):this.#oe()})),document.addEventListener(`click`,this.#f),document.addEventListener(`keydown`,this.#p),this.render()}disconnectedCallback(){this.#y.forEach(e=>e.destroy()),this.#y.clear(),document.removeEventListener(`click`,this.#f),document.removeEventListener(`keydown`,this.#p)}#w(){return JSON.stringify({capabilities:this.#e.capabilities,extensionOptions:this.#e.extensionOptions,headings:this.#e.headings,toolbar:this.#e.toolbar,dropdowns:this.#e.dropdowns,bubble:this.#e.bubble,icons:this.#e.icons,gutterInsert:this.#e.gutterInsert,slashInsert:this.#e.slashInsert},null,2)}#T(){try{let e=JSON.parse(this.#g),t=e.icons??{};if(typeof t!=`object`||!t||Array.isArray(t))throw Error(`Invalid icons map`);return this.#e={capabilities:{nodes:[...e.capabilities?.nodes??[]],marks:[...e.capabilities?.marks??[]],extensions:[...e.capabilities?.extensions??[]]},extensionOptions:{characterCount:{limit:e.extensionOptions?.characterCount?.limit??null},placeholder:{text:e.extensionOptions?.placeholder?.text??`Write something …`}},headings:{levels:[...e.headings?.levels??k]},toolbar:[...e.toolbar??[]],dropdowns:{...e.dropdowns??{}},bubble:{enabled:e.bubble?.enabled??!0,items:[...e.bubble?.items??[]]},icons:{...t},gutterInsert:e.gutterInsert??!0,slashInsert:e.slashInsert??!0},this.#V(),this.#_=``,!0}catch{return this.#_=j(`vizy`,`Invalid JSON`),!1}}#E(e,t){return t.find(t=>t.id===e)}#D(e){if(!C(e))return this.#E(e,this.#t);let t=this.#E(e,this.#n);return t?{...t,kind:`group`}:void 0}#O(e){return e.pending||e.kind===`presentation`||e.kind===`dropdown`?!0:e.kind===`action`?e.capabilityName===void 0||this.#e.capabilities.nodes.includes(e.capabilityName):e.kind===`mark`?this.#e.capabilities.marks.includes(e.capabilityName??e.id):e.kind===`extension`?this.#e.capabilities.extensions.includes(e.capabilityName??e.id):e.headingLevel===void 0?e.kind===`node`?e.id===`paragraph`||e.id===`hardBreak`||this.#e.capabilities.nodes.includes(e.capabilityName??e.id):!1:this.#e.headings.levels.includes(e.headingLevel)}#k(e){if(e.pending||e.id===`paragraph`||e.id===`hardBreak`)return null;let t=e.capabilityKind??(e.kind===`node`||e.kind===`mark`||e.kind===`extension`?e.kind:void 0);return t===void 0?null:{kind:t===`node`?`nodes`:t===`mark`?`marks`:`extensions`,name:e.capabilityName??e.id,...e.headingLevel===void 0?{}:{headingLevel:e.headingLevel}}}#A(e){let t=this.#k(e);if(t!==null)return[t];if(e.kind!==`dropdown`||!e.members?.length)return[];let n=e.members.map(e=>{let t=this.#E(e,this.#t);return t===void 0?null:this.#k(t)});if(n.some(e=>e===null))return[];let r=new Map;return n.forEach(e=>{e!==null&&r.set(`${e.kind}:${e.name}:${e.headingLevel??``}`,e)}),r.size===1?[...r.values()]:[]}#j(e){this.#A(e).forEach(e=>{this.#e.capabilities[e.kind].includes(e.name)||this.#e.capabilities[e.kind].push(e.name),e.headingLevel!==void 0&&!this.#e.headings.levels.includes(e.headingLevel)&&(this.#e.headings.levels.push(e.headingLevel),this.#e.headings.levels.sort((e,t)=>e-t))})}#M(e){return this.#e.capabilities[e.kind].includes(e.name)&&(e.headingLevel===void 0||this.#e.headings.levels.includes(e.headingLevel))}#N(e){if(C(e)){let t=this.#E(e,this.#n),n=t===void 0?[]:this.#A(t);return n.length===0||n.every(e=>this.#M(e))}let t=this.#E(e,this.#t);return!t||t.kind===`presentation`||this.#O(t)}#P(){let e=D(this.#e.toolbar);return[...this.#t,...this.#n].filter(t=>!(t.memberOnly||e.has(t.id)&&!this.#W(t.id))).sort((e,t)=>(e.paletteRank??0)-(t.paletteRank??0)).sort((e,t)=>Number(this.#W(e.id))-Number(this.#W(t.id)))}#F(){let e=new Set(this.#e.bubble.items);return this.#r.filter(t=>!e.has(t.id))}#I(e){e===`visual`&&this.#c===`advanced`&&!this.#T()||(e===`advanced`&&(this.#g=this.#w(),this.#_=``,this.#L()),this.#c=e),this.render()}async#L(){this.#h||(await c(()=>import(`./code-editor-DKoZyTzW.js`),__vite__mapDeps([0,1,2,3,4,5]),import.meta.url),this.#h=!0,this.#c===`advanced`&&this.render())}#R(e,t,n){let r=new Set(this.#e.capabilities[e]);n?r.add(t):r.delete(t),this.#e.capabilities[e]=[...r],this.render()}#z(e,t,n){let r=this.#e.capabilities[e].filter(e=>!n.includes(e));this.#e.capabilities[e]=[...new Set([...r,...t])],this.render()}#B(e,t,n){let r=t.length>0&&t.every(e=>n.includes(e.value))?`*`:JSON.stringify(n);return`
            <pk-checkbox-select
                data-capability-group="${M(e)}"
                show-all-option
                all-label="${M(j(`vizy`,`All`))}"
                options="${M(JSON.stringify(t))}"
                value="${M(r)}"
            ></pk-checkbox-select>
        `}#V(){this.#e.capabilities.nodes.includes(`heading`)||(this.#e.headings.levels=[])}#H(){return this.#e.headings.levels.length>0}#U(e){this.#e.headings.levels=[...e].sort((e,t)=>e-t),this.#R(`nodes`,`heading`,this.#H())}#W(e){return e===`separator`}#G(e,t){return E(this.#e.toolbar,e,t)}#K(e,t){if(!this.#W(e)&&this.#G(e)!==-1)return;let n=this.#E(e,C(e)?this.#n:this.#t);n!==void 0&&this.#j(n),t===void 0?this.#e.toolbar.push(e):this.#e.toolbar.splice(t,0,e),this.render()}#q(){return this.#d?.list===`toolbar`?this.#e.toolbar[this.#d.index]??null:null}#J(){let e=this.#q();return e!==null&&C(e)?w(e):null}#Y(e){return this.#E(`dropdown:${e}`,this.#n)?.members??[]}#X(e){return this.#e.dropdowns[e]??this.#Y(e)}#Z(e,t){let n=this.#Y(e);t.length===n.length&&t.every((e,t)=>e===n[t])?delete this.#e.dropdowns[e]:this.#e.dropdowns[e]=t,this.render()}#Q(e,t){let n=this.#Y(e);if(!n.includes(t))return;let r=this.#X(e);if(r.includes(t)){if(r.length<=1)return;this.#Z(e,r.filter(e=>e!==t));return}let i=n.indexOf(t),a=r.findIndex(e=>n.indexOf(e)>i),o=[...r];o.splice(a===-1?o.length:a,0,t),this.#Z(e,o)}#$(e,t,n){let r=[...this.#X(e)];if(t<0||n<0||t>=r.length||n>=r.length)return;let[i]=r.splice(t,1);r.splice(n,0,i),this.#Z(e,r)}#ee(e,t){let n=e===`toolbar`?this.#e.toolbar[t]:void 0;if(n===void 0||!C(n)){this.#m();return}let r=this.#d?.list===e&&this.#d.index===t;this.#d=r?null:{list:e,index:t},this.render()}#te(e,t){let n=this.#G(e,t);n!==-1&&(this.#e.toolbar.splice(n,1),C(e)&&delete this.#e.dropdowns[w(e)],this.#d=null,this.render())}#ne(e,t){if(this.#e.bubble.items.includes(e))return;let n=this.#E(e,this.#r);n!==void 0&&this.#j(n),t===void 0?this.#e.bubble.items.push(e):this.#e.bubble.items.splice(t,0,e),this.render()}#re(e){this.#e.bubble.items=this.#e.bubble.items.filter(t=>t!==e),this.render()}#ie(e,t,n){let r=e===`toolbar`?this.#e.toolbar:this.#e.bubble.items;if(t<0||n<0||t>=r.length||n>=r.length)return;let[i]=r.splice(t,1);r.splice(n,0,i),this.render()}#ae(e,t){if(e===`bubble`)b(t.to)?this.#re(t.itemId):b(t.from)?this.#ne(t.itemId,t.index):this.#ie(`bubble`,t.fromIndex,t.index);else if(t.from===`members`){let e=this.#J();e!==null&&t.to===`members`?this.#$(e,t.fromIndex,t.index):this.render()}else b(t.to)?this.#te(t.itemId,t.fromIndex):b(t.from)?(this.#d=null,this.#K(t.itemId,t.index)):(this.#d?.list===`toolbar`&&(this.#d=this.#d.index===t.fromIndex?{list:`toolbar`,index:t.index}:null),this.#ie(`toolbar`,t.fromIndex,t.index))}#oe(){if(!this.#v)return;this.#v.replaceChildren();let e=(e,t)=>{let n=document.createElement(`input`);n.type=`hidden`,n.name=e,n.value=t,this.#v?.append(n)};this.#e.capabilities.nodes.forEach(t=>e(`capabilityNodes[]`,t)),this.#e.capabilities.marks.forEach(t=>e(`capabilityMarks[]`,t)),this.#e.capabilities.extensions.forEach(t=>e(`capabilityExtensions[]`,t)),e(`extensionOptionsJson`,JSON.stringify(this.#e.extensionOptions)),this.#e.headings.levels.forEach(t=>e(`headingLevels[]`,String(t))),e(`toolbarJson`,JSON.stringify(this.#e.toolbar)),e(`dropdownsJson`,JSON.stringify(this.#e.dropdowns)),e(`bubbleJson`,JSON.stringify(this.#e.bubble)),e(`iconsJson`,JSON.stringify(this.#e.icons)),e(`gutterInsert`,this.#e.gutterInsert?`1`:`0`),e(`slashInsert`,this.#e.slashInsert?`1`:`0`),e(`advancedConfig`,this.#w())}#se(e){return this.#a[e.id]??e.icon??null}#ce(e){return this.#se(e)||(e.abbr?`<span class="vizy-control-abbr">${M(e.abbr)}</span>`:`<span class="vizy-control-text">${M(e.label)}</span>`)}#le(e,t,n,r={}){let i=e.kind===`group`||e.kind===`dropdown`,a=e.valuePreview,o=a!==void 0,s=i||e.id===`addBlock`||o,c=this.#se(e);return`
            <button
                type="button"
                class="${[`vizy-control`,e.id===`separator`?`is-separator`:``,c||e.abbr||e.id===`separator`?``:`is-text`,s?`has-menu`:``,o?`text-style-control`:``,o&&e.valuePreviewKind===`color`?`text-style-control--color`:``,n===`available`?`is-available`:``,r.selected?`is-selected`:``,r.unavailable?`is-unavailable`:``,e.pending?`is-pending`:``].filter(Boolean).join(` `)}"
                aria-label="${M(e.pending?j(`vizy`,`{label} (not available yet)`,{label:e.label}):r.unavailable?j(`vizy`,`{label} (not allowed by this config)`,{label:e.label}):e.label)}"
                ${n===`active`&&i?`aria-expanded="${r.selected?`true`:`false`}"`:``}
                data-toolbar-item="${M(e.id)}"
                data-toolbar-list="${t}"
                data-toolbar-variant="${n}"
                ${this.#W(e.id)?`data-toolbar-repeatable`:``}
            >${e.id===`separator`?``:o?`<span class="text-style-control__value">${M(j(`vizy`,a))}</span>`:this.#ce(e)}${s?`<span class="vizy-control-chevron" aria-hidden="true">${m}</span>`:``}</button>
        `}#ue(){let e=[...this.#i.nodes,...this.#i.marks],t=e.filter(e=>this.#e.capabilities.nodes.includes(e.value)||this.#e.capabilities.marks.includes(e.value));return`
            <details class="vizy-editor-config-section vizy-editor-config-disclosure" data-schema-details ${this.#l?`open`:``}>
                <summary>
                    <span class="vizy-editor-config-disclosure-title">${j(`vizy`,`Content Schema`)}</span>
                    <span class="vizy-editor-config-disclosure-count">${j(`vizy`,`{allowed} of {total} content types allowed`,{allowed:String(t.length),total:String(e.length)})}</span>
                </summary>
                <p class="instructions">${j(`vizy`,`The nodes and marks this editor understands. It governs pasted and imported content as well as the toolbar, so a content type can be allowed without being given a button — which is how existing formatting is preserved without authors being offered more of it.`)}</p>

                <div class="vizy-editor-config-subhead">${j(`vizy`,`Blocks and objects`)}</div>
                ${this.#B(`nodes`,this.#i.nodes,this.#e.capabilities.nodes)}

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
                    <div class="vizy-editor-config-subhead">${j(`vizy`,`Heading levels`)}</div>
                    <!--
                        No separate "Allow headings" switch. The levels are the setting: choosing
                        none is how headings are disallowed. Two controls for one decision meant
                        the switch could be on with no levels ticked, a state that had to be
                        papered over by seeding defaults.
                    -->
                    ${this.#B(`headings`,O.map(e=>({label:`H${e}`,value:String(e)})),this.#e.headings.levels.map(String))}
                `:``}

                <div class="vizy-editor-config-subhead">${j(`vizy`,`Inline formatting`)}</div>
                ${this.#B(`marks`,this.#i.marks,this.#e.capabilities.marks)}
            </details>
        `}#de(e){return[...this.#t,...this.#r].some(t=>t.capabilityKind===`extension`&&t.capabilityName===e)}#fe(){let e=new Set(this.#i.extensions.map(e=>e.value)),t=this.#e.capabilities.extensions,n=this.#i.extensions.filter(e=>!A.has(e.value)&&!this.#de(e.value)),r=[];return e.has(`characterCount`)&&r.push(`
                <div class="vizy-editor-config-experience-setting">
                    <pk-field
                        class="vizy-editor-config-toggle"
                        label="${M(j(`vizy`,`Show Character Count`))}"
                        instructions="${M(j(`vizy`,`Show live character and word totals below the editor.`))}"
                    >
                        <pk-lightswitch
                            data-editor-extension="characterCount"
                            ${t.includes(`characterCount`)?`checked`:``}
                        ></pk-lightswitch>
                    </pk-field>
                    ${t.includes(`characterCount`)?`
                        <div class="vizy-editor-config-experience-options">
                            <pk-field
                                label="${M(j(`vizy`,`Character limit`))}"
                                instructions="${M(j(`vizy`,`Leave blank to show the character and word counts without setting a limit.`))}"
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
                        </div>
                    `:``}
                </div>
            `),e.has(`placeholder`)&&r.push(`
                <div class="vizy-editor-config-experience-setting">
                    <pk-field
                        class="vizy-editor-config-toggle"
                        label="${M(j(`vizy`,`Show Placeholder`))}"
                        instructions="${M(j(`vizy`,`Show prompt text while the editor is empty.`))}"
                    >
                        <pk-lightswitch
                            data-editor-extension="placeholder"
                            ${t.includes(`placeholder`)?`checked`:``}
                        ></pk-lightswitch>
                    </pk-field>
                    ${t.includes(`placeholder`)?`
                        <div class="vizy-editor-config-experience-options">
                            <pk-field label="${M(j(`vizy`,`Placeholder text`))}">
                                <input
                                    type="text"
                                    class="text fullwidth"
                                    maxlength="250"
                                    value="${M(this.#e.extensionOptions.placeholder.text)}"
                                    data-placeholder-text
                                >
                            </pk-field>
                        </div>
                    `:``}
                </div>
            `),e.has(`typography`)&&r.push(`
                <div class="vizy-editor-config-experience-setting">
                    <pk-field
                        class="vizy-editor-config-toggle"
                        label="${M(j(`vizy`,`Smart Typography`))}"
                        instructions="${M(j(`vizy`,`Replace straight quotes, three dots, and double hyphens with typographic characters as authors type.`))}"
                    >
                        <pk-lightswitch
                            data-editor-extension="typography"
                            ${t.includes(`typography`)?`checked`:``}
                        ></pk-lightswitch>
                    </pk-field>
                </div>
            `),n.length>0&&r.push(`
                <div class="vizy-editor-config-experience-setting">
                    <div class="vizy-editor-config-subhead">${j(`vizy`,`Additional Behaviours`)}</div>
                    <p class="instructions">${j(`vizy`,`Extensions that change editing behaviour without adding content or a toolbar control.`)}</p>
                    ${this.#B(`extensions`,n,t)}
                </div>
            `),r.length>0?`
            <section class="vizy-editor-config-section" data-editor-experience>
                <h3>${j(`vizy`,`Editor Experience`)}</h3>
                <div class="vizy-editor-config-experience">${r.join(``)}</div>
            </section>
        `:``}#pe(e){let t=this.#Y(e),n=this.#X(e);return`
            <div
                class="vizy-editor-config-menu"
                role="menu"
                data-size="sm"
                data-builder-list="toolbar-members"
                data-builder-menu
            >
                ${T(t,n).filter(e=>this.#me(e)).map(e=>this.#he(e,!n.includes(e))).join(``)||`<p class="vizy-editor-config-menu-empty">${j(`vizy`,`Nothing in this dropdown can render, so it won’t appear.`)}</p>`}
            </div>
        `}#me(e){let t=this.#E(e,this.#t);return t!==void 0&&!t.pending&&this.#O(t)}#he(e,t){let n=this.#E(e,this.#t);if(!n)return``;let r=t?j(`vizy`,`{label} (switched off)`,{label:n.label}):n.label;return`
            <button
                type="button"
                role="menuitem"
                class="vizy-editor-config-menu-item${t?` is-off`:``}"
                aria-label="${M(r)}"
                aria-pressed="${t?`false`:`true`}"
                data-toolbar-item="${M(n.id)}"
                data-toolbar-list="toolbar"
                data-toolbar-variant="member"
            >${this.#se(n)?`<span class="vizy-editor-config-menu-icon" aria-hidden="true">${this.#se(n)}</span>`:``}<span class="preview-label"${n.preview?` data-preview="${M(n.preview)}"`:``}>${M(n.label)}</span></button>
        `}#ge(){let e=new Map;for(let t of[...this.#t,...this.#n,...this.#r])t.kind===`presentation`||t.iconCustomizable===!1||e.has(t.id)||e.set(t.id,t);let t=new Map,n=n=>{let r=e.get(n);r&&!t.has(n)&&t.set(n,r)};for(let e of this.#e.toolbar)n(e),C(e)&&this.#X(w(e)).forEach(n);return this.#e.bubble.items.forEach(n),Object.keys(this.#e.icons).forEach(n),[...t.values()]}#_e(){let e=this.#ge();e.some(e=>e.id===this.#s)||(this.#s=Object.keys(this.#e.icons).find(t=>e.some(e=>e.id===t))??e[0]?.id??``);let t=this.#e.icons[this.#s]??``,n=this.#a[this.#s]??``,r=e.find(e=>e.id===this.#s),i=Object.keys(this.#e.icons).length,a=i===1?j(`vizy`,`{count} custom icon`,{count:String(i)}):j(`vizy`,`{count} custom icons`,{count:String(i)});return`
            <details class="vizy-editor-config-section vizy-editor-config-disclosure" data-icon-details ${this.#u?`open`:``}>
                <summary>
                    <span class="vizy-editor-config-disclosure-title">${j(`vizy`,`Icons`)}</span>
                    <span class="vizy-editor-config-disclosure-count">${M(a)}</span>
                </summary>
                <p class="instructions">${j(`vizy`,`Choose a control to replace its icon. Clear the icon to restore Vizy’s default.`)}</p>
                ${e.length>0?`
                    <div class="vizy-editor-config-icon-designer">
                        <div class="vizy-editor-config-icon-grid" role="group" aria-label="${M(j(`vizy`,`Controls`))}">
                            ${e.map(e=>{let t=e.id===this.#s,n=Object.hasOwn(this.#e.icons,e.id);return`
                                    <button
                                        type="button"
                                        class="vizy-editor-config-icon-option${t?` is-selected`:``}${n?` is-custom`:``}"
                                        aria-pressed="${t?`true`:`false`}"
                                        data-icon-control="${M(e.id)}"
                                    >
                                        <span class="vizy-editor-config-icon-preview" aria-hidden="true">${this.#ce(e)}</span>
                                        <span class="vizy-editor-config-icon-name">${M(e.label)}</span>
                                        ${n?`<span class="vizy-editor-config-icon-custom">${j(`vizy`,`Custom`)}</span>`:``}
                                    </button>
                                `}).join(``)}
                        </div>
                        <div class="vizy-editor-config-icon-editor">
                            <pk-field
                                label="${M(j(`vizy`,`Icon for {label}`,{label:r?.label??``}))}"
                                instructions="${M(j(`vizy`,`Uses Vizy’s icon catalogue and SVG files from the configured icons path.`))}"
                            >
                                <vizy-image-browser
                                    name=""
                                    value="${M(t)}"
                                    mode="icon"
                                    label-mode="tooltip"
                                    placeholder="${M(j(`vizy`,`Use default icon`))}"
                                    search-placeholder="${M(j(`vizy`,`Search icons`))}"
                                    empty-message="${M(j(`vizy`,`No icons match your query.`))}"
                                    aria-label="${M(j(`vizy`,`Choose an icon for {label}`,{label:r?.label??``}))}"
                                    data-icon-picker
                                    data-catalog-url="${M(this.#o)}"
                                    data-selected-label="${M(t)}"
                                    data-selected-preview="${M(n)}"
                                ></vizy-image-browser>
                            </pk-field>
                        </div>
                    </div>
                `:`<p class="vizy-editor-config-icon-empty">${j(`vizy`,`Add controls to the Toolbar or Bubble Menu to customise their icons.`)}</p>`}
            </details>
        `}#ve(e){return`
            <span class="vizy-editor-config-empty" data-empty-placeholder>
                ${M(e)}
            </span>
        `}#ye(){return`<span class="vizy-editor-config-tail" data-builder-tail></span>`}#be(e,t,n=!0){let r=e||this.#ve(t);return n?r+this.#ye():r}async#xe(e){await e.updateComplete;let t=e.shadowRoot?.querySelector(`pk-popup`);if(!t||(await customElements.whenDefined(`pk-popup`),await t.updateComplete,!t.shadowRoot))return;let n=document.createElement(`style`);n.textContent=`:host, .hover-bridge, [part="content"] { pointer-events: none; }`,t.shadowRoot.appendChild(n)}#Se(){let t=document.createElement(`pk-tooltip`);t.setAttribute(`trigger`,`manual`),t.setAttribute(`placement`,`top`),this.appendChild(t),this.#b=t,this.#xe(t);let n=e=>e instanceof Element?e.closest(`.vizy-control`):null,r=e=>e instanceof Node&&t.contains(e),i=()=>{this.#S!==null&&(window.clearTimeout(this.#S),this.#S=null)},a=a=>{if(r(a.target))return;let o=n(a.target),s=o?.getAttribute(`aria-label`);i(),!o||!s||o.closest(`.is-sorting`)||o.hasAttribute(`data-dnd-placeholder`)?t.hide():this.#S=window.setTimeout(()=>{this.#S=null,o.isConnected&&!o.closest(`.is-sorting`)&&(o.id||=`vizy-control-${++this.#x}`,t.for=o.id,t.content=s,t.show())},e.#C)},o=e=>{r(e.target)||(i(),t.hide())};this.addEventListener(`pointerover`,a),this.addEventListener(`focusin`,a),this.addEventListener(`pointerout`,o),this.addEventListener(`focusout`,o),this.addEventListener(`pointerdown`,o)}#Ce(e){let t=e=>{let t=[...e.parentElement?.children??[]].indexOf(e);return t===-1?void 0:t};e.querySelectorAll(`[data-toolbar-item]`).forEach(e=>{let n=e.dataset.toolbarItem,r=e.dataset.toolbarList,i=e.dataset.toolbarVariant;if(!n||!r)return;let a=()=>{if(i===`available`)r===`toolbar`?this.#K(n):this.#ne(n);else if(i===`member`){let e=this.#J();e!==null&&this.#Q(e,n)}else this.#ee(r,t(e)??-1)};e.onclick=a,e.onkeydown=o=>{if(o.key===`Delete`||o.key===`Backspace`){if(i!==`active`)return;o.preventDefault(),r===`toolbar`?this.#te(n,t(e)):this.#re(n)}else(o.key===`Enter`||o.key===` `)&&(o.preventDefault(),a())}})}#we(e){[`toolbar`,`bubble`].forEach(t=>{let n=()=>e.querySelector(`[data-builder="${t}"]`);if(!n()){this.#y.get(t)?.destroy(),this.#y.delete(t);return}let r=this.#y.get(t);r||(r=new x({container:n,type:`vizy-${t}-control`,availableList:()=>e.querySelector(`[data-builder-list="${t}-available"]`),activeList:()=>e.querySelector(`[data-builder-list="${t}-active"]`),memberList:()=>e.querySelector(`[data-builder-list="${t}-members"]`),onDrop:e=>this.#ae(t,e),onRevert:()=>this.render()}),this.#y.set(t,r)),r.refresh()})}render(){let e=this.querySelector(`[data-vizy-config-host]`);if(!e)return;let t=e.querySelector(`[data-builder-menu]`)?.scrollTop??0,n=document.scrollingElement,r=n?.scrollTop??0,i=this.#Te(e),a=this.#J(),o=this.#e.toolbar.map((e,t)=>{let n=this.#D(e);return n?this.#le(n,`toolbar`,`active`,{unavailable:!this.#N(e),selected:this.#d?.list===`toolbar`&&this.#d.index===t}):``}).join(``),s=this.#e.bubble.items.map((e,t)=>{let n=this.#E(e,this.#r);return n?this.#le(n,`bubble`,`active`,{selected:this.#d?.list===`bubble`&&this.#d.index===t}):``}).join(``);e.innerHTML=`
            <div class="vizy-editor-config">
                <div class="vizy-editor-config-tabs">
                    <button type="button" class="${this.#c===`visual`?`active`:``}" data-mode="visual">${j(`vizy`,`Visual`)}</button>
                    <button type="button" class="${this.#c===`advanced`?`active`:``}" data-mode="advanced">${j(`vizy`,`Advanced`)}</button>
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
                            <h3>${j(`vizy`,`Toolbar`)}</h3>
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
                            <p class="instructions">${j(`vizy`,`Drag or click toolbar items to add them to the editor.`)}</p>
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
                                    <h4 class="vizy-editor-config-subhead">${j(`vizy`,`Available items`)}</h4>
                                    <div class="vizy-editor-config-available" data-builder-list="toolbar-available">
                                        ${this.#be(this.#P().map(e=>this.#le(e,`toolbar`,`available`)).join(``),j(`vizy`,`Everything is in the toolbar.`),!1)}
                                    </div>
                                </div>
                                <div class="vizy-editor-config-group is-preview">
                                    <h4 class="vizy-editor-config-subhead">${j(`vizy`,`Toolbar preview`)}</h4>
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
                                            ${this.#be(o,j(`vizy`,`Drag items here.`))}
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
                                        ${a===null?``:this.#pe(a)}
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
                            <h3>${j(`vizy`,`Block Insertion`)}</h3>
                            <pk-field
                                class="vizy-editor-config-toggle"
                                label="${M(j(`vizy`,`Show Gutter Button`))}"
                                instructions="${M(j(`vizy`,`Whether to show a + button in the gutter (to the side) of each block to open the Add Block palette.`))}"
                            >
                                <pk-lightswitch
                                    data-gutter-insert
                                    ${this.#e.gutterInsert?`checked`:``}
                                ></pk-lightswitch>
                            </pk-field>
                            <pk-field
                                class="vizy-editor-config-toggle"
                                label="${M(j(`vizy`,`Enable Slash Command`))}"
                                instructions="${M(j(`vizy`,`Whether to enable the / shortcut on a blank line to open the Add Block palette.`))}"
                            >
                                <pk-lightswitch
                                    data-slash-insert
                                    ${this.#e.slashInsert?`checked`:``}
                                ></pk-lightswitch>
                            </pk-field>
                        </section>

                        <section class="vizy-editor-config-section">
                            <h3>${j(`vizy`,`Bubble Menu`)}</h3>
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
                                label="${M(j(`vizy`,`Show Bubble Menu`))}"
                                instructions="${M(j(`vizy`,`A small toolbar that appears over selected text, for formatting without reaching for the toolbar.`))}"
                            >
                                <pk-lightswitch
                                    data-bubble-enabled
                                    ${this.#e.bubble.enabled?`checked`:``}
                                ></pk-lightswitch>
                            </pk-field>
                            ${this.#e.bubble.enabled?`
                                <div class="vizy-editor-config-builder" data-builder="bubble">
                                    <div class="vizy-editor-config-group">
                                        <h4 class="vizy-editor-config-subhead">${j(`vizy`,`Available buttons`)}</h4>
                                        <div class="vizy-editor-config-available" data-builder-list="bubble-available">
                                            ${this.#be(this.#F().map(e=>this.#le(e,`bubble`,`available`)).join(``),j(`vizy`,`Everything is in the Bubble Menu.`),!1)}
                                        </div>
                                    </div>
                                    <div class="vizy-editor-config-group">
                                        <h4 class="vizy-editor-config-subhead">${j(`vizy`,`Bubble Menu preview`)}</h4>
                                        <div class="vizy-editor-config-active is-bubble" data-builder-list="bubble-active">
                                            ${this.#be(s,j(`vizy`,`Drag items here.`))}
                                        </div>
                                    </div>
                                </div>
                            `:``}
                        </section>

                        ${this.#fe()}
                        ${this.#ue()}
                        ${this.#_e()}
                    </div>
                `:`
                    <div class="vizy-editor-config-advanced">
                        <pk-field
                            label="${M(j(`vizy`,`Configuration JSON`))}"
                            instructions="${M(j(`vizy`,`Edit the Editor Config directly as JSON, or copy it into config/vizy/{id}.json to create a file-based config.`))}"
                        >
                            <!--
                                The content is not set here. The value attribute maps to the
                                component's defaultValue, which is the reset target rather
                                than what is shown, so the JSON is assigned as a property once
                                the element exists — see below. That also spares us escaping a
                                multi-line JSON document into an attribute.

                                The field shell supplies the normal label and instructions
                                without wrapping the CodeMirror surface in a literal label.
                            -->
                            <pk-code-editor
                                data-advanced-json
                                language="json"
                                rows="20"
                                ${this.#_?`invalid`:``}
                            ></pk-code-editor>
                            ${this.#_?`<p class="vizy-editor-config-error">${this.#_}</p>`:``}
                        </pk-field>
                    </div>
                `}
            </div>
        `,n&&n.scrollTop!==r&&(n.scrollTop=r),e.querySelectorAll(`[data-mode]`).forEach(e=>{e.onclick=()=>this.#I(e.dataset.mode)});let c=e.querySelector(`[data-schema-details]`);c&&c.addEventListener(`toggle`,()=>{this.#l=c.open});let l=e.querySelector(`[data-icon-details]`);l&&l.addEventListener(`toggle`,()=>{this.#u=l.open}),e.querySelectorAll(`[data-icon-control]`).forEach(e=>{e.addEventListener(`click`,()=>{this.#s=e.dataset.iconControl??``,this.render(),[...this.querySelectorAll(`[data-icon-control]`)].find(e=>e.dataset.iconControl===this.#s)?.focus({preventScroll:!0})})});let u=e.querySelector(`[data-icon-picker]`);u&&u.addEventListener(`pk-change`,e=>{let t=this.#s,n=e.detail.value;n===``?(delete this.#e.icons[t],delete this.#a[t],this.render()):(this.#e.icons[t]=n,this.#oe(),this.#o===``?this.render():h(this.#o,n).then(e=>{this.#e.icons[t]===n&&(e?this.#a[t]=e:delete this.#a[t],this.render())}))}),e.querySelectorAll(`[data-capability-group]`).forEach(e=>{e.addEventListener(`pk-change`,t=>{let{value:n}=t.detail,r=n===`*`?e.options.map(e=>e.value):n,i=e.dataset.capabilityGroup;i===`headings`?this.#U(r.map(Number)):this.#z(i,r,e.options.map(e=>e.value))})}),e.querySelectorAll(`[data-editor-extension]`).forEach(e=>{e.addEventListener(`pk-change`,()=>{let t=e.dataset.editorExtension;t&&this.#R(`extensions`,t,e.checked)})});let d=e.querySelector(`[data-character-count-limit]`);d&&d.addEventListener(`input`,()=>{let e=d.valueAsNumber;this.#e.extensionOptions.characterCount.limit=Number.isFinite(e)?e:null,this.#oe()});let f=e.querySelector(`[data-placeholder-text]`);f&&f.addEventListener(`input`,()=>{this.#e.extensionOptions.placeholder.text=f.value,this.#oe()});let p=e.querySelector(`[data-bubble-enabled]`);p&&p.addEventListener(`pk-change`,()=>{this.#e.bubble.enabled=p.checked,this.render()});let m=e.querySelector(`[data-gutter-insert]`);m&&m.addEventListener(`pk-change`,()=>{this.#e.gutterInsert=m.checked,this.render()});let g=e.querySelector(`[data-slash-insert]`);g&&g.addEventListener(`pk-change`,()=>{this.#e.slashInsert=g.checked,this.render()});let _=e.querySelector(`[data-advanced-json]`);_&&(_.value=this.#g,_.addEventListener(`pk-change`,e=>{this.#g=e.detail.value,this.#T()&&this.#oe()})),this.#Ce(e),this.#De(e,t),this.#Ee(e,i),this.#we(e),this.#oe()}#Te(e){let t=document.activeElement;if(!(t instanceof HTMLElement)||!e.contains(t))return null;let n=t.closest(`[data-toolbar-item]`),r=n?.parentElement?.dataset.builderList;return!n||!r?null:{list:r,index:[...n.parentElement.children].indexOf(n)}}#Ee(e,t){if(!t)return;let n=e.querySelector(`[data-builder-list="${t.list}"]`)?.children[t.index];n instanceof HTMLElement&&n.matches(`[data-toolbar-item]`)&&n.focus({preventScroll:!0})}#De(e,t=0){let n=e.querySelector(`[data-builder-menu]`),r=e.querySelector(`[data-builder-list="toolbar-active"]`);if(!n||!r)return;n.scrollTop=t;let i=r.querySelector(`.vizy-control.is-selected`);if(!i)return;let a=n.closest(`.vizy-editor-config-editor`);if(!a)return;let o=i.getBoundingClientRect(),s=r.getBoundingClientRect(),c=o.bottom-a.getBoundingClientRect().top-1,l=o.left-s.left,u=Math.max(0,r.clientWidth-n.offsetWidth);n.style.insetBlockStart=`${c}px`,n.style.insetInlineStart=`${Math.max(0,Math.min(l,u))}px`}};customElements.get(`vizy-editor-config-settings`)||customElements.define(`vizy-editor-config-settings`,N);
//# sourceMappingURL=editor-config-settings-DIyeZ-jF.js.map