import{b as e,y as t}from"./class-map-DgBgrTyk.js";var{I:n}=t,r=e=>e,i=e=>e===null||typeof e!=`object`&&typeof e!=`function`,a=e=>e.strings===void 0,o=()=>document.createComment(``),s=(e,t,i)=>{let a=e._$AA.parentNode,s=t===void 0?e._$AB:t._$AA;if(i===void 0)i=new n(a.insertBefore(o(),s),a.insertBefore(o(),s),e,e.options);else{let t=i._$AB.nextSibling,n=i._$AM,o=n!==e;if(o){let t;i._$AQ?.(e),i._$AM=e,i._$AP!==void 0&&(t=e._$AU)!==n._$AU&&i._$AP(t)}if(t!==s||o){let e=i._$AA;for(;e!==t;){let t=r(e).nextSibling;r(a).insertBefore(e,s),e=t}}}return i},c=(e,t,n=e)=>(e._$AI(t,n),e),l={},u=(e,t=l)=>e._$AH=t,d=e=>e._$AH,f=e=>{e._$AR(),e._$AA.remove()},p=e`
    @layer pk-component {
        .form-control {
            display: flex;
            flex-direction: column;
            gap: 0.375rem;
            width: 100%;
        }

        .form-control__header {
            display: flex;
            flex-direction: column;
            gap: 0.125rem;
            min-width: 0;
        }

        .form-control__label {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            margin: 0;
            color: var(--pk-color-gray-700);
            font-family: var(--pk-font-family);
            font-size: var(--pk-font-size-base);
            font-weight: 700;
            line-height: var(--pk-line-height);
        }

        .form-control__instructions,
        .form-control__hint {
            margin: 0;
            color: var(--pk-color-gray-500);
            font-family: var(--pk-font-family);
            font-size: var(--pk-font-size-base);
            line-height: var(--pk-line-height);
        }

        .form-control__instructions:empty,
        .form-control__hint:empty {
            display: none;
        }

        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }

        .form-control__input {
            display: flex;
            align-items: stretch;
            position: relative;
            width: 100%;
        }

        .form-control__start,
        .form-control__end {
            display: inline-flex;
            align-items: center;
            flex-shrink: 0;
        }

        .form-control__start {
            margin-inline-end: 6px;
        }

        .form-control__end {
            margin-inline-start: 6px;
        }

        .icon-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            padding: 0;
            border: 0;
            background: transparent;
            color: var(--pk-color-gray-500);
            cursor: pointer;
            line-height: 0;
        }

        .icon-button:focus-visible {
            outline: none;
            box-shadow: var(--pk-shadow-focus);
            border-radius: var(--pk-radius-sm);
        }

        .icon-button:disabled {
            cursor: not-allowed;
            opacity: 0.5;
        }
    }
`;export{u as a,s as c,i,d as n,a as o,f as r,c as s,p as t};
//# sourceMappingURL=form-control.styles-CQ93gnVf-DZx4ft0g.js.map