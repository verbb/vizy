import{a as e,d as t,l as n,n as r,o as i,p as a,r as o,s}from"./decorate-R0X811qp-DTGsgM1e.js";import{c,l,s as u,t as d,u as f}from"./pk-spinner-DweuYJ_Z-BdFJpkCK.js";import{Gt as p,Jt as m,Kt as h,Vt as g,i as _,n as v,qt as y,r as b,s as x,t as S}from"./dismissible-stack-XQUMfKO3-Dki4_55y.js";import{c as C,f as w,i as T,l as E,o as D,p as O,r as k,t as A}from"./required-validator-CEg8dvjS-BedQRcpX.js";var j=[d,a`
    ${O}
    @layer pk-component {
        :host {
            display: inline-block;
            position: relative;
            width: fit-content;
            max-width: 100%;
            vertical-align: top;
            color: var(--pk-color-gray-700);
            font-family: var(--pk-font-family);
            font-size: var(--pk-font-size-base);
            line-height: var(--pk-line-height);
            --pk-image-browser-trigger-min-height: var(--pk-btn-height-default);
            --pk-image-browser-padding-block: 6px;
            --pk-image-browser-padding-inline: 10px;
            --pk-image-browser-font-size: var(--pk-font-size-base);
            --pk-image-browser-line-height: var(--pk-input-control-line-height, 1.25rem);
            --pk-image-browser-glyph-size: 1rem;
            --pk-image-browser-panel-width: 26.25rem;
            /* Hit target larger than the glyph so the select ring has breathing room. */
            --pk-image-browser-cell-min: 2.25rem;
            --pk-image-browser-glyph-tile: 1.375rem;
            --pk-image-browser-fill: var(--pk-color-slate-250);
            --pk-image-browser-fill-hover: var(--pk-color-slate-300);
        }

        /* Caption under each cell — wider tracks; glyph size stays put. */
        :host([label-mode='inline']) {
            --pk-image-browser-cell-min: 3.75rem;
        }

        :host([size='xs']) {
            --pk-image-browser-trigger-min-height: var(--pk-btn-height-xs);
            --pk-image-browser-padding-block: 2px;
            --pk-image-browser-padding-inline: 6px;
            --pk-image-browser-font-size: var(--pk-font-size-xs, 0.75rem);
            --pk-image-browser-glyph-size: 0.875rem;
        }

        :host([size='sm']) {
            --pk-image-browser-trigger-min-height: var(--pk-btn-height-sm);
            --pk-image-browser-padding-block: 4px;
            --pk-image-browser-padding-inline: 8px;
            --pk-image-browser-font-size: var(--pk-font-size-sm, 0.8125rem);
            --pk-image-browser-glyph-size: 0.875rem;
        }

        :host([size='lg']),
        :host([size='xl']) {
            --pk-image-browser-trigger-min-height: var(--pk-btn-height-lg);
            --pk-image-browser-padding-block: 8px;
            --pk-image-browser-padding-inline: 12px;
            --pk-image-browser-font-size: var(--pk-font-size-lg, 1rem);
            --pk-image-browser-glyph-size: 1.125rem;
        }

        /* Image mode — roomier photo tiles; captions still opt-in via label-mode="inline". */
        :host([mode='image']) {
            --pk-image-browser-panel-width: 34rem;
            --pk-image-browser-cell-min: 7.5rem;
        }

        :host([mode='image'][label-mode='inline']) {
            /* Captions reclaim a little width; preview stays the hero. */
            --pk-image-browser-cell-min: 6.5rem;
        }

        :host([width='full']) {
            display: block;
            width: 100%;
        }

        :host([width='full']) .control {
            width: 100%;
        }

        .value-input {
            position: absolute;
            width: 1px;
            height: 1px;
            margin: -1px;
            padding: 0;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
            opacity: 0;
            pointer-events: none;
        }

        /* Combobox-style chrome: label + clear + chevron share one filled control.
         * 0.5rem gap keeps ellipsized filenames from kissing the clear glyph. */
        .control {
            display: inline-flex;
            align-items: stretch;
            gap: 0.5rem;
            min-width: 12.5rem;
            max-width: 100%;
            height: var(--pk-image-browser-trigger-min-height);
            min-height: var(--pk-image-browser-trigger-min-height);
            margin: 0;
            padding: 0 0 0 var(--pk-image-browser-padding-inline);
            border: 1px solid transparent;
            border-radius: var(--pk-input-border-radius, var(--pk-radius-lg));
            background: var(--pk-image-browser-fill);
            color: inherit;
            box-sizing: border-box;
            overflow: hidden;
            transition: border-color 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
        }

        .control:hover:not(.is-disabled) {
            background: var(--pk-image-browser-fill-hover);
        }

        .control.is-open:not(.is-disabled) {
            background: var(--pk-image-browser-fill-hover);
        }

        .control:focus-within:not(.is-disabled) {
            border-color: var(--pk-color-sky-600);
            box-shadow: var(--pk-input-focus-shadow);
            background: var(--pk-color-white);
        }

        :host([invalid]) .control,
        :host(:state(user-invalid)) .control {
            border-color: var(--pk-color-rose-500, #f43f5e);
        }

        .control.is-disabled {
            cursor: not-allowed;
            opacity: 0.5;
        }

        .trigger {
            display: inline-flex;
            align-items: center;
            flex: 1 1 auto;
            min-width: 0;
            margin: 0;
            padding: var(--pk-image-browser-padding-block) 0;
            border: 0;
            border-radius: 0;
            background: transparent;
            color: inherit;
            font: inherit;
            font-size: var(--pk-image-browser-font-size);
            font-weight: 400;
            line-height: var(--pk-image-browser-line-height);
            text-align: left;
            white-space: nowrap;
            cursor: pointer;
            outline: none;
            box-sizing: border-box;
        }

        .trigger:disabled {
            cursor: not-allowed;
        }

        .trigger-main {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            flex: 1 1 auto;
            min-width: 0;
            overflow: hidden;
        }

        .trigger-preview {
            display: inline-flex;
            flex-shrink: 0;
            align-items: center;
            justify-content: center;
            width: var(--pk-image-browser-glyph-size);
            height: var(--pk-image-browser-glyph-size);
            overflow: hidden;
        }

        .trigger-preview svg,
        .trigger-preview img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        .trigger-preview svg {
            fill: currentColor;
        }

        .trigger-label {
            flex: 1 1 auto;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .trigger-label.is-placeholder {
            color: var(--pk-color-gray-500);
        }

        .clear-button,
        .expand-button {
            display: inline-flex;
            flex-shrink: 0;
            align-items: center;
            justify-content: center;
            align-self: stretch;
            box-sizing: border-box;
            width: calc(0.75rem + 0.5rem);
            margin: 0;
            padding: 0;
            border: 0;
            border-radius: 0;
            background: transparent;
            color: var(--pk-color-gray-600);
            cursor: pointer;
            outline: none;
        }

        .expand-button {
            width: calc(0.75rem + 0.5rem + var(--pk-image-browser-padding-inline));
            padding-inline-end: var(--pk-image-browser-padding-inline);
        }

        .clear-button:hover:not(:disabled),
        .expand-button:hover:not(:disabled) {
            color: var(--pk-color-gray-800);
        }

        .clear-button:disabled,
        .expand-button:disabled {
            cursor: not-allowed;
        }

        .clear-button-icon,
        .expand-button-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            line-height: 0;
            pointer-events: none;
        }

        .clear-button-icon svg,
        .expand-button-icon svg {
            display: block;
            width: 0.75rem;
            height: 0.75rem;
        }

        .panel {
            position: relative;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            width: var(--pk-image-browser-panel-width);
            max-width: min(100vw - 1.5rem, var(--pk-image-browser-panel-width));
            max-height: min(28.75rem, 60vh);
            border-radius: var(--pk-radius-lg);
            background: var(--pk-color-white);
            box-shadow:
                0 0 0 1px rgba(31, 41, 51, 0.1),
                0 5px 20px rgba(31, 41, 51, 0.25);
            overflow: hidden;
        }

        .panel[hidden] {
            display: none !important;
        }

        .panel-search {
            flex: none;
            /* Same inline inset as panel-body so search + grid share one vertical edge. */
            padding: 0.625rem 0.625rem 0.5rem;
            border-bottom: 1px solid var(--pk-color-gray-150, rgba(51, 64, 77, 0.1));
        }

        .panel-input {
            display: block;
            width: 100%;
            box-sizing: border-box;
            margin: 0;
            padding: 0.375rem 0.625rem;
            border: 1px solid var(--pk-color-gray-200, #d4dce4);
            border-radius: var(--pk-input-border-radius, var(--pk-radius-md));
            background: var(--pk-color-white);
            color: var(--pk-color-gray-700);
            font: inherit;
            font-size: var(--pk-font-size-sm, 0.8125rem);
            line-height: 1.25rem;
            outline: none;
        }

        .panel-input:focus {
            border-color: var(--pk-color-sky-600);
            box-shadow: var(--pk-input-focus-shadow);
        }

        .panel-body {
            flex: 1 1 auto;
            min-height: 0;
            overflow-y: auto;
            /* Match search field inset so the grid lines up with the input. */
            padding: 0.5rem 0.625rem 0.625rem;
        }

        :host([mode='image']) .panel-body {
            padding: 0.5rem 0.625rem 0.625rem;
        }

        .group + .group {
            margin-top: 0.875rem;
        }

        .group-heading {
            display: flex;
            justify-content: space-between;
            gap: 0.5rem;
            margin: 0 0 0.375rem;
            color: var(--pk-color-gray-500);
            font-size: 0.6875rem;
            font-weight: 600;
            letter-spacing: 0.04em;
            line-height: 1.25;
            text-transform: uppercase;
        }

        .group-heading-count {
            font-weight: 400;
            letter-spacing: 0;
            text-transform: none;
        }

        /* Fixed column width (not 1fr) so sparse catalogs stay dense instead of stretching. */
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, var(--pk-image-browser-cell-min));
            gap: 0.375rem;
            justify-content: start;
            /* Don’t stretch short single-line cells to match taller wrapped neighbors in the row. */
            align-items: start;
        }

        :host([mode='image']) .grid {
            grid-template-columns: repeat(auto-fill, minmax(var(--pk-image-browser-cell-min), 1fr));
            gap: 0.375rem;
        }

        .option {
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 0;
            width: var(--pk-image-browser-cell-min);
            height: var(--pk-image-browser-cell-min);
            margin: 0;
            /* Square hit target; glyph is smaller so the ring doesn’t clip tips. */
            padding: 0;
            border: 1px solid transparent;
            border-radius: var(--pk-radius-sm);
            background: none;
            color: inherit;
            cursor: pointer;
            outline: none;
            overflow: hidden;
        }

        /* With captions, height hugs glyph + label instead of a fixed square. */
        :host([label-mode='inline']) .option {
            justify-content: flex-start;
            gap: 0.125rem;
            height: auto;
            /* Keep glyph + caption inside the inset highlight ring. */
            padding: 0.25rem 0.125rem 0.3125rem;
        }

        :host([mode='image']) .option {
            position: relative;
            width: auto;
            height: auto;
            min-height: 0;
            gap: 0;
            padding: 0;
            overflow: hidden;
            border-radius: var(--pk-radius-md);
        }

        :host([mode='image'][label-mode='inline']) .option {
            gap: 0.375rem;
            padding: 0.375rem 0.375rem 0.5rem;
            overflow: visible;
        }

        .option:hover,
        .option:focus-visible,
        .option.is-highlighted {
            background: var(--pk-color-gray-050, #f3f7fc);
        }

        /* Selected is the durable chrome; highlight/hover share the same ring for keyboard parity. */
        .option.is-selected,
        .option.is-highlighted,
        .option:hover {
            box-shadow: inset 0 0 0 2px var(--pk-color-sky-600);
        }

        /*
         * Flush photo tiles paint over inset box-shadow (descendants sit above it).
         * Overlay the same ring so tooltip/none match inline chrome.
         */
        :host([mode='image']) .option.is-selected,
        :host([mode='image']) .option.is-highlighted,
        :host([mode='image']) .option:hover {
            box-shadow: none;
        }

        :host([mode='image']) .option.is-selected::after,
        :host([mode='image']) .option.is-highlighted::after,
        :host([mode='image']) .option:hover::after {
            content: '';
            position: absolute;
            inset: 0;
            z-index: 1;
            border-radius: inherit;
            box-shadow: inset 0 0 0 2px var(--pk-color-sky-600);
            pointer-events: none;
        }

        .option:focus-visible {
            outline: none;
        }

        .option-preview {
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 0 0 auto;
            width: var(--pk-image-browser-glyph-tile);
            height: var(--pk-image-browser-glyph-tile);
            margin: 0;
            overflow: hidden;
        }

        :host([mode='image']) .option-preview {
            width: 100%;
            height: auto;
            aspect-ratio: 4 / 3;
            margin: 0;
            border-radius: inherit;
        }

        .option-preview svg,
        .option-preview img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        /* Photo tiles crop to fill — previews, not faithful aspect viewers. */
        :host([mode='image']) .option-preview svg,
        :host([mode='image']) .option-preview img {
            object-fit: cover;
        }

        .option-preview svg {
            fill: currentColor;
        }

        .option-label {
            display: -webkit-box;
            box-sizing: border-box;
            width: 100%;
            max-width: 100%;
            padding-inline: 2px;
            overflow: hidden;
            color: var(--pk-color-gray-700);
            font-size: 0.625rem;
            line-height: 0.75rem;
            text-align: center;
            overflow-wrap: anywhere;
            word-break: break-word;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            line-clamp: 3;
        }

        :host([mode='image']) .option-label {
            display: block;
            color: var(--pk-color-gray-600);
            font-size: 0.6875rem;
            line-height: 1.2;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow-wrap: normal;
            word-break: normal;
            -webkit-line-clamp: unset;
            line-clamp: unset;
        }

        .notice {
            margin: 0.375rem 0;
            color: var(--pk-color-gray-500);
            font-size: var(--pk-font-size-sm, 0.8125rem);
        }

        .notice.is-error {
            color: var(--pk-color-rose-600, #e11d48);
        }

        /* Host-driven catalog warm — spinner only (no loading copy). */
        .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            min-height: 6rem;
            padding: 1.25rem 0.75rem;
            color: var(--pk-color-gray-500);
        }

        .panel-input:disabled {
            cursor: not-allowed;
            opacity: 0.6;
        }

        /* Host is inert layout chrome; the floating tip lives in pk-popup. */
        .option-tooltip {
            position: absolute;
            width: 0;
            height: 0;
            margin: 0;
            padding: 0;
            overflow: hidden;
            pointer-events: none;
        }
    }
    `],M=x(w.chevronDown),N=x(w.xmark),P=96;function F(e){return/^\s*<svg[\s>]/i.test(e)}var I=class extends E{constructor(...e){super(...e),this.assumeInteractionOn=[`pk-change`],this.size=`default`,this.mode=`icon`,this.width=`auto`,this.labelMode=`tooltip`,this.invalid=!1,this.readonly=!1,this.value=``,this.defaultValue=``,this.placeholder=`Choose…`,this.searchPlaceholder=`Search…`,this.emptyMessage=`No items match your query.`,this.ariaLabel=null,this.loading=!1,this.withClear=!0,this.items=[],this.groups=[],this.selectedLabel=``,this.selectedPreview=``,this.placement=`bottom-start`,this.sideOffset=4,this.pageSize=P,this.open=!1,this.query=``,this.limit=P,this.closing=!1,this.panelAnimated=!1,this.highlightedIndex=-1,this.tooltipFor=``,this.tooltipContent=``,this.listboxId=f(`pk-image-browser-listbox`),this.searchId=f(`pk-image-browser-search`),this.closeTimer=null,this.tooltipOpenTimer=null,this.liveRegion=null,this.handleClear=e=>{e.preventDefault(),e.stopPropagation(),!(this.disabled||this.readonly||this.value===``)&&(this.emitChange(``),this.dispatchEvent(new T),this.triggerElement?.focus({preventScroll:!0}))},this.togglePanel=e=>{e?.preventDefault(),e?.stopPropagation(),!(this.disabled||this.readonly)&&(this.open||this.closing?this.closePanel(`api`):this.openPanel())},this.handleTriggerKeyDown=e=>{this.disabled||this.readonly||(e.key===`ArrowDown`||e.key===`ArrowUp`||e.key===`Enter`||e.key===` `)&&(e.preventDefault(),!this.open&&!this.closing&&this.openPanel())},this.onDocumentPointerDown=e=>{!this.open||this.closing||!S(this)||k(e,{host:this,anchor:this.controlElement??this.triggerElement,panel:this.panelElement})||this.closePanel(`pointer-dismiss`)},this.onDocumentKeyDown=e=>{!this.open||this.closing||!S(this)||e.key===`Escape`&&(e.preventDefault(),e.stopPropagation(),this.closePanel(`escape`))},this.handleSearchInput=e=>{this.loading||(this.query=e.target.value,this.limit=this.normalizedPageSize(),this.resetHighlightForOpenCatalog(),this.announceResults())},this.handleSearchKeyDown=e=>{if(!(!this.open||this.closing||this.loading))switch(e.key){case`ArrowDown`:case`ArrowUp`:case`ArrowLeft`:case`ArrowRight`:case`Home`:case`End`:e.preventDefault(),e.stopPropagation(),this.moveHighlight(e.key);return;case`Enter`:{e.preventDefault(),e.stopPropagation();let t=this.flatVisibleItems()[this.highlightedIndex];t&&this.selectValue(t.value);return}}},this.handleResultsScroll=()=>{this.clearOptionTooltip();let e=this.panelBody;if(!e||!this.isTruncated()||e.scrollTop+e.clientHeight<e.scrollHeight-200)return;let t=e.scrollTop;this.limit+=this.normalizedPageSize(),this.updateComplete.then(()=>{this.panelBody&&(this.panelBody.scrollTop=t)})},this.handleOptionPointerLeave=e=>{let t=e.relatedTarget;t instanceof Node&&this.panelBody?.contains(t)&&(t instanceof Element?t.closest(`.option`):t.parentElement?.closest(`.option`))||(this.resetHighlightToSelected(),this.clearOptionTooltip())}}static{this.styles=j}static get validators(){return[...super.validators,C(),A()]}connectedCallback(){super.connectedCallback(),this.limit=this.normalizedPageSize()}disconnectedCallback(){this.teardownDismissListeners(),this.clearCloseTimer(),this.clearTooltipOpenTimer(),this.liveRegion?.destroy(),this.liveRegion=null,super.disconnectedCallback()}willUpdate(e){e.has(`pageSize`)&&!this.open&&(this.limit=this.normalizedPageSize()),super.willUpdate(e)}updated(e){super.updated(e),e.has(`open`)&&(this.open?this.attachDismissListeners():this.closing||this.teardownDismissListeners()),(e.has(`open`)||e.has(`closing`))&&(this.open||this.closing)&&this.syncPanelPlacement(),this.open&&(e.has(`highlightedIndex`)||e.has(`query`)||e.has(`limit`))&&this.scrollHighlightedIntoView(),this.open&&e.has(`loading`)&&!this.loading&&this.resetHighlightForOpenCatalog()}get validationTarget(){return this.triggerElement??this}syncFormValue(){this.setFormValue(this.value,this.value)}resetToDefaultValue(){this.value=this.defaultValue}restoreFormState(e){typeof e==`string`&&(this.value=e)}async show(){this.open||this.closing||this.disabled||this.readonly||await this.openPanel()}async hide(e=`api`){!this.open||this.closing||await this.closePanel(e)}optionId(e){return`${this.listboxId}-opt-${e}`}groupHeadingId(e){return`${this.listboxId}-group-${e}`}normalizedPageSize(){return this.pageSize>0?this.pageSize:P}resolveGroups(){return this.groups.length>0?this.groups:this.items.length>0?[{name:``,items:this.items}]:[]}findItem(e){if(e===``)return null;for(let t of this.resolveGroups()){let n=t.items.find(t=>t.value===e);if(n)return n}return null}selectedItem(){return this.findItem(this.value)}triggerDisplay(){let e=this.selectedItem();return e?{label:e.label,preview:e.preview,isPlaceholder:!1}:this.value===``?{label:this.placeholder,isPlaceholder:!0}:{label:this.selectedLabel||this.value,preview:this.selectedPreview||void 0,isPlaceholder:!1}}visibleGroups(){let e=this.query.trim().toLowerCase();return this.resolveGroups().reduce((t,n)=>{let r=e===``?n.items:n.items.filter(t=>t.label.toLowerCase().includes(e)||t.value.toLowerCase().includes(e));return r.length===0||t.push({name:n.name,total:r.length,items:r.slice(0,this.limit)}),t},[])}flatVisibleItems(){return this.visibleGroups().flatMap(e=>e.items)}isTruncated(){return this.visibleGroups().some(e=>e.items.length<e.total)}activeDescendantId(){return!this.open||this.highlightedIndex<0?null:this.optionId(this.highlightedIndex)}triggerAccessibleName(){if(this.ariaLabel){let e=this.triggerDisplay();return e.isPlaceholder?this.ariaLabel:`${this.ariaLabel}, ${e.label}`}return this.triggerDisplay().label}announceResults(){if(this.loading)return;let e=this.flatVisibleItems();this.query.trim()&&(this.liveRegion||=new l(`polite`),this.liveRegion.announce(e.length===0?this.emptyMessage:`${e.length} ${e.length===1?`result`:`results`} available`))}resetHighlightForOpenCatalog(){let e=this.flatVisibleItems();if(e.length===0){this.highlightedIndex=-1;return}this.highlightedIndex=e.findIndex(e=>e.value===this.value)}setHighlightedIndex(e){let t=this.flatVisibleItems();if(t.length===0){this.highlightedIndex=-1;return}let n=Math.max(0,Math.min(e,t.length-1));this.highlightedIndex=n,n>=t.length-4&&this.isTruncated()&&(this.limit+=this.normalizedPageSize())}scrollHighlightedIntoView(){if(this.highlightedIndex<0||!this.panelBody)return;let e=this.renderRoot.querySelector(`#${CSS.escape(this.optionId(this.highlightedIndex))}`);e&&D(e,this.panelBody,`vertical`,`auto`)}columnCountNear(e){let t=this.renderRoot.querySelector(`#${CSS.escape(this.optionId(e))}`)?.closest(`.grid`);if(!t)return 1;let n=[...t.querySelectorAll(`.option`)];if(n.length===0)return 1;let r=n[0].offsetTop,i=0;for(let e of n){if(e.offsetTop!==r)break;i+=1}return Math.max(1,i)}moveHighlight(e){let t=this.flatVisibleItems();if(t.length===0){this.highlightedIndex=-1;return}let n=this.highlightedIndex;if(n<0){n=e===`ArrowUp`||e===`ArrowLeft`||e===`End`?t.length-1:0,this.setHighlightedIndex(n);return}let r=this.columnCountNear(n);switch(e){case`ArrowRight`:n=Math.min(n+1,t.length-1);break;case`ArrowLeft`:n=Math.max(n-1,0);break;case`ArrowDown`:n=Math.min(n+r,t.length-1);break;case`ArrowUp`:n=Math.max(n-r,0);break;case`Home`:n=0;break;case`End`:n=t.length-1;break;default:return}this.setHighlightedIndex(n)}emitChange(e){this.value=e,this.syncFormValue(),this.updateValidity(),this.dispatchEvent(new CustomEvent(`pk-change`,{detail:{value:e},bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`input`,{bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0}))}selectValue(e){if(this.disabled||this.readonly)return;let t=this.value;if(this.closePanel(`api`),this.query=``,this.limit=this.normalizedPageSize(),this.highlightedIndex=-1,t===e){this.withClear&&t!==``&&(this.emitChange(``),this.dispatchEvent(new T));return}this.emitChange(e)}async openPanel(){this.open||this.closing||this.disabled||this.readonly||(this.dispatchEvent(new m),this.closing=!1,this.panelAnimated=!1,this.query=``,this.limit=this.normalizedPageSize(),this.open=!0,this.resetHighlightForOpenCatalog(),await this.updateComplete,await this.syncPanelPlacement(),this.panelAnimated=!0,this.dispatchEvent(new h),await this.focusSearchWhenReady(),this.scrollHighlightedIntoView())}async closePanel(e){if(!this.open||this.closing)return;let t=new y(e);this.dispatchEvent(t),!t.defaultPrevented&&(this.closing=!0,this.open=!1,this.highlightedIndex=-1,this.clearOptionTooltip(),this.teardownDismissListeners(),this.triggerElement?.focus({preventScroll:!0}),this.clearCloseTimer(),this.closeTimer=window.setTimeout(()=>{this.closing=!1,this.panelAnimated=!1,this.query=``,this.limit=this.normalizedPageSize(),this.closeTimer=null,this.dispatchEvent(new p)},100))}clearCloseTimer(){this.closeTimer!=null&&(window.clearTimeout(this.closeTimer),this.closeTimer=null)}async syncPanelPlacement(){if(!this.popupElement||!this.panelElement)return;u(this.panelElement,this.placement);let e=await c(this.popupElement,this.placement,300,{requireEvent:!0});u(this.panelElement,e)}attachDismissListeners(){v(this),document.addEventListener(`pointerdown`,this.onDocumentPointerDown,!0),document.addEventListener(`keydown`,this.onDocumentKeyDown,!0)}teardownDismissListeners(){b(this),document.removeEventListener(`pointerdown`,this.onDocumentPointerDown,!0),document.removeEventListener(`keydown`,this.onDocumentKeyDown,!0)}async focusSearchWhenReady(){let e=performance.now();for(;this.open&&performance.now()-e<2e3;){let e=this.searchInput;if(e&&getComputedStyle(e).visibility!==`hidden`&&(e.focus({preventScroll:!0}),document.activeElement===e))return;await new Promise(e=>requestAnimationFrame(()=>e()))}}renderPreview(e,r){return e?F(e)?t`<span class=${r} aria-hidden="true">${_(e)}</span>`:t`<img class=${r} src=${e} alt="" />`:n}usesInlineLabels(){return this.labelMode===`inline`}usesTooltipLabels(){return this.labelMode===`tooltip`}showOptionTooltip(e,t){if(!this.usesTooltipLabels())return;let n=this.tooltipFor!==``;this.tooltipFor=e,this.tooltipContent=t,this.clearTooltipOpenTimer();let r=()=>{this.tooltipOpenTimer=null,this.updateComplete.then(()=>{this.optionTooltip?.show()})};if(n){r();return}this.tooltipOpenTimer=window.setTimeout(r,280)}clearOptionTooltip(){this.clearTooltipOpenTimer(),this.tooltipFor=``,this.tooltipContent=``,this.optionTooltip?.hide()}clearTooltipOpenTimer(){this.tooltipOpenTimer!=null&&(window.clearTimeout(this.tooltipOpenTimer),this.tooltipOpenTimer=null)}handleOptionPointerEnter(e,t){this.highlightedIndex=e,this.showOptionTooltip(this.optionId(e),t)}resetHighlightToSelected(){let e=this.flatVisibleItems();if(e.length===0){this.highlightedIndex=-1;return}let t=e.findIndex(e=>e.value===this.value);this.highlightedIndex=t}renderTriggerContents(){let e=this.triggerDisplay();return t`
            <span class="trigger-main">
                ${this.renderPreview(e.preview,`trigger-preview`)}
                <span
                    class=${g({"trigger-label":!0,"is-placeholder":e.isPlaceholder})}
                    aria-hidden="true"
                >${e.label}</span>
            </span>
        `}renderResults(){if(this.loading)return t`
                <div
                    id=${this.listboxId}
                    role="listbox"
                    aria-label=${this.ariaLabel||`Options`}
                    aria-busy="true"
                >
                    <div part="loading" class="loading" role="status" aria-label="Loading">
                        <pk-spinner size="sm" centered></pk-spinner>
                    </div>
                </div>
            `;let e=this.visibleGroups();if(e.length===0)return t`
                <div
                    id=${this.listboxId}
                    role="listbox"
                    aria-label=${this.ariaLabel||`Options`}
                >
                    <p class="notice" part="empty" role="status">${this.emptyMessage}</p>
                </div>
            `;let r=0;return t`
            <div
                id=${this.listboxId}
                role="listbox"
                aria-label=${this.ariaLabel||`Options`}
            >
                ${e.map((e,i)=>{let a=this.groupHeadingId(i),o=r,s=e.items.map((e,i)=>{let a=o+i;r=a+1;let s=e.value===this.value,c=a===this.highlightedIndex;return t`
                            <button
                                type="button"
                                part="option"
                                id=${this.optionId(a)}
                                class=${g({option:!0,"is-highlighted":c,"is-selected":s})}
                                role="option"
                                tabindex="-1"
                                aria-label=${e.label}
                                aria-selected=${s?`true`:`false`}
                                @click=${()=>this.selectValue(e.value)}
                                @mouseenter=${()=>this.handleOptionPointerEnter(a,e.label)}
                                @mouseleave=${this.handleOptionPointerLeave}
                            >
                                ${this.renderPreview(e.preview,`option-preview`)}
                                ${this.usesInlineLabels()?t`<span class="option-label" aria-hidden="true">${e.label}</span>`:n}
                            </button>
                        `});return t`
                        <div
                            class="group"
                            role=${e.name?`group`:n}
                            aria-labelledby=${e.name?a:n}
                        >
                            ${e.name?t`
                                    <h6 class="group-heading" id=${a}>
                                        <span>${e.name}</span>
                                        ${e.items.length<e.total?t`
                                                <span class="group-heading-count">
                                                    Showing ${e.items.length} of ${e.total}
                                                </span>
                                            `:n}
                                    </h6>
                                `:n}
                            <div class="grid">
                                ${s}
                            </div>
                        </div>
                    `})}
            </div>
        `}render(){let e=this.withClear&&this.value!==``&&!this.disabled&&!this.readonly,r=this.open||this.closing,i=this.activeDescendantId();return t`
            <input
                class="value-input"
                part="value-input"
                tabindex="-1"
                aria-hidden="true"
                .value=${this.value}
                ?required=${this.required}
                @input=${()=>this.updateValidity()}
            />
            <div
                part="root"
                class=${g({control:!0,"is-disabled":this.disabled||this.readonly,"is-open":this.open})}
            >
                <button
                    type="button"
                    part="trigger"
                    class="trigger"
                    ?disabled=${this.disabled||this.readonly}
                    aria-label=${this.triggerAccessibleName()}
                    aria-haspopup="listbox"
                    aria-expanded=${this.open?`true`:`false`}
                    aria-controls=${this.listboxId}
                    @click=${this.togglePanel}
                    @keydown=${this.handleTriggerKeyDown}
                >
                    ${this.renderTriggerContents()}
                </button>
                ${e?t`
                        <button
                            type="button"
                            part="clear-button"
                            class="clear-button"
                            aria-label="Clear selection"
                            ?disabled=${this.disabled}
                            @click=${this.handleClear}
                        >
                            <span class="clear-button-icon" aria-hidden="true">${_(N)}</span>
                        </button>
                    `:n}
                <button
                    type="button"
                    class="expand-button"
                    tabindex="-1"
                    aria-hidden="true"
                    ?disabled=${this.disabled||this.readonly}
                    @click=${this.togglePanel}
                >
                    <span class="expand-button-icon">${_(M)}</span>
                </button>
            </div>
            <pk-popup
                .active=${r}
                .anchor=${this.controlElement??this.triggerElement??``}
                .placement=${this.placement}
                .distance=${this.sideOffset}
                flip
                shift
            >
                <div
                    part="panel"
                    class=${g({panel:!0,"pk-popup-content":!0,closing:this.closing})}
                    tabindex="-1"
                    ?hidden=${!r}
                    data-open=${this.panelAnimated&&!this.closing?``:n}
                >
                    <div part="panel-search" class="panel-search">
                        <input
                            part="panel-input"
                            class="panel-input"
                            id=${this.searchId}
                            type="text"
                            role="combobox"
                            .value=${this.query}
                            placeholder=${this.searchPlaceholder}
                            aria-label=${this.searchPlaceholder}
                            aria-autocomplete="list"
                            aria-expanded=${this.open?`true`:`false`}
                            aria-controls=${this.listboxId}
                            aria-activedescendant=${i??n}
                            ?disabled=${this.loading}
                            @input=${this.handleSearchInput}
                            @keydown=${this.handleSearchKeyDown}
                        />
                    </div>
                    <div
                        part="panel-body"
                        class="panel-body"
                        @scroll=${this.handleResultsScroll}
                    >
                        ${this.renderResults()}
                    </div>
                    ${this.usesTooltipLabels()&&r?t`
                            <pk-tooltip
                                class="option-tooltip"
                                for=${this.tooltipFor}
                                content=${this.tooltipContent}
                                placement="top"
                                trigger="manual"
                            ></pk-tooltip>
                        `:n}
                </div>
            </pk-popup>
        `}};r([s({reflect:!0})],I.prototype,`size`,void 0),r([s({reflect:!0})],I.prototype,`mode`,void 0),r([s({reflect:!0})],I.prototype,`width`,void 0),r([s({reflect:!0,attribute:`label-mode`})],I.prototype,`labelMode`,void 0),r([s({type:Boolean,reflect:!0})],I.prototype,`invalid`,void 0),r([s({type:Boolean,reflect:!0})],I.prototype,`readonly`,void 0),r([s()],I.prototype,`value`,void 0),r([s({attribute:`default-value`})],I.prototype,`defaultValue`,void 0),r([s()],I.prototype,`placeholder`,void 0),r([s({attribute:`search-placeholder`})],I.prototype,`searchPlaceholder`,void 0),r([s({attribute:`empty-message`})],I.prototype,`emptyMessage`,void 0),r([s({attribute:`aria-label`})],I.prototype,`ariaLabel`,void 0),r([s({type:Boolean,reflect:!0})],I.prototype,`loading`,void 0),r([s({type:Boolean,reflect:!0,attribute:`with-clear`})],I.prototype,`withClear`,void 0),r([s({attribute:!1})],I.prototype,`items`,void 0),r([s({attribute:!1})],I.prototype,`groups`,void 0),r([s({attribute:`selected-label`})],I.prototype,`selectedLabel`,void 0),r([s({attribute:`selected-preview`})],I.prototype,`selectedPreview`,void 0),r([s({reflect:!0})],I.prototype,`placement`,void 0),r([s({type:Number,attribute:`side-offset`})],I.prototype,`sideOffset`,void 0),r([s({type:Number,attribute:`page-size`})],I.prototype,`pageSize`,void 0),r([s({type:Boolean,reflect:!0})],I.prototype,`open`,void 0),r([i()],I.prototype,`query`,void 0),r([i()],I.prototype,`limit`,void 0),r([i()],I.prototype,`closing`,void 0),r([i()],I.prototype,`panelAnimated`,void 0),r([i()],I.prototype,`highlightedIndex`,void 0),r([i()],I.prototype,`tooltipFor`,void 0),r([i()],I.prototype,`tooltipContent`,void 0),r([e(`.value-input`)],I.prototype,`input`,void 0),r([e(`.trigger`)],I.prototype,`triggerElement`,void 0),r([e(`.control`)],I.prototype,`controlElement`,void 0),r([e(`pk-popup`)],I.prototype,`popupElement`,void 0),r([e(`.panel`)],I.prototype,`panelElement`,void 0),r([e(`.panel-input`)],I.prototype,`searchInput`,void 0),r([e(`.panel-body`)],I.prototype,`panelBody`,void 0),r([e(`.option-tooltip`)],I.prototype,`optionTooltip`,void 0),I=r([o(`pk-image-browser`)],I);var L=new Map;function R(e,t={}){let n=window.Craft?.t(`vizy`,e,t);return n===void 0?Object.entries(t).reduce((e,[t,n])=>e.replaceAll(`{${t}}`,String(n)),e):n}function z(e){if(!Array.isArray(e)||e.length===0)return!1;let t=e[0];return Array.isArray(t?.icons)}function B(e){if(!Array.isArray(e)||e.length===0)return!1;let t=e[0];return Array.isArray(t?.items)&&typeof t?.name==`string`}function V(e){return e.map(e=>({name:e.name,items:e.icons.map(e=>({label:e.label,value:e.value,preview:e.svg}))}))}function H(e){return e.map(e=>({label:e.label,value:e.value,preview:e.url}))}function U(e){return!Array.isArray(e)||e.length===0?[]:z(e)?V(e):B(e)?e:[{name:``,items:H(e)}]}function W(e){let t=L.get(e)??fetch(e,{headers:{Accept:`application/json`}}).then(e=>{if(!e.ok)throw Error(`Catalog request failed: ${e.status}`);return e.json()}).then(U).catch(t=>{throw L.delete(e),t});return L.set(e,t),t}async function G(e,t){if(t===``)return null;for(let n of await W(e)){let e=n.items.find(e=>e.value===t);if(e?.preview&&/^\s*<svg[\s>]/i.test(e.preview))return e.preview}return null}var K=class extends HTMLElement{#e=!1;connectedCallback(){if(this.#e)return;this.#e=!0;let e=this.getAttribute(`name`)??`value`,t=this.getAttribute(`value`)??``,n=this.id||`image-browser`,r=this.getAttribute(`mode`)??`icon`,i=this.getAttribute(`label-mode`)??`tooltip`,a=this.getAttribute(`aria-label`)??R(r===`image`?`Preview Image`:`Icon`),o=this.getAttribute(`placeholder`)??R(r===`image`?`Choose a preview image`:`Choose an icon`),s=this.getAttribute(`search-placeholder`)??R(r===`image`?`Search images`:`Search icons`),c=this.getAttribute(`empty-message`)??R(r===`image`?`No images match your query.`:`No icons match your query.`),l=this.getAttribute(`data-selected-label`)??``,u=this.getAttribute(`data-selected-preview`)??``,d=this.getAttribute(`data-catalog-url`)??``,f=this.getAttribute(`data-catalog`);this.removeAttribute(`name`);let p=document.createElement(`input`);p.type=`hidden`,p.name=e,p.value=t,p.id=`${n}-value`;let m=document.createElement(`pk-image-browser`);m.id=n,m.mode=r,m.labelMode=i,m.value=t,m.placeholder=o,m.searchPlaceholder=s,m.emptyMessage=c,m.ariaLabel=a,m.withClear=!0,l!==``&&(m.selectedLabel=l),u!==``&&(m.selectedPreview=u);let h=()=>{p.value=m.value??``};if(m.addEventListener(`pk-change`,h),m.addEventListener(`change`,h),m.addEventListener(`input`,h),this.append(p,m),f){try{m.groups=U(JSON.parse(f))}catch{m.emptyMessage=R(`Couldn’t load catalog.`)}return}d!==``&&(m.loading=!0,W(d).then(e=>{m.groups=e,m.loading=!1}).catch(()=>{m.loading=!1,m.emptyMessage=R(r===`image`?`Couldn’t load images.`:`Couldn’t load icons.`)}))}};customElements.get(`vizy-image-browser`)||customElements.define(`vizy-image-browser`,K);export{G as t};
//# sourceMappingURL=VizyImageBrowserElement-CAbVaT90.js.map