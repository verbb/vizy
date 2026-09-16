import{a as e,d as t,l as n,n as r,o as i,p as a,r as o,s,t as c}from"./decorate-R0X811qp-DTGsgM1e.js";import{Ht as l,Lt as u,Ut as d,Vt as f,Wt as p}from"./unsafe-html-DhD_KFJk.js";var m=0;function h(e=`pk`){return m+=1,`${e}-${m}`}[`a[href]`,`button:not([disabled])`,`input:not([disabled])`,`select:not([disabled])`,`textarea:not([disabled])`,`[tabindex]:not([tabindex="-1"])`].join(`,`),[`a[href]`,`button`,`input`,`select`,`textarea`,`[tabindex]:not([tabindex="-1"])`].join(`,`);var g=class{constructor(e=`polite`){this.element=document.createElement(`div`),this.element.setAttribute(`aria-live`,e),this.element.setAttribute(`aria-atomic`,`true`),this.element.className=`pk-visually-hidden`,this.element.style.cssText=`position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;`,document.body.append(this.element)}announce(e){this.element.textContent=``,requestAnimationFrame(()=>{this.element.textContent=e})}destroy(){this.element.remove()}};function _(e){let t=e.split(`-`)[0];return t===`inline-start`?`left`:t===`inline-end`?`right`:t===`top`||t===`bottom`||t===`left`||t===`right`?t:`bottom`}function v(e,t,n,r,i){let a=_(e),o=t.x+t.width/2-n.x,s=t.y+t.height/2-n.y;return Math.abs(i?.y??0)>r&&(a===`top`||a===`bottom`)?`${o}px ${t.y+t.height/2-n.y}px`:{top:`${o}px calc(100% + ${r}px)`,bottom:`${o}px ${-r}px`,left:`calc(100% + ${r}px) ${s}px`,right:`${-r}px ${s}px`}[a]}function y(e,t){if(!t){e.removeAttribute(`data-side`);return}e.setAttribute(`data-side`,_(t))}function b(e,t,n=100,r){let i=()=>e.getAttribute(`data-current-placement`)??t;return!r?.requireEvent&&e.hasAttribute(`data-current-placement`)?Promise.resolve(i()):new Promise(t=>{let a=!1,o=()=>{a||(a=!0,t(i()))};e.addEventListener(`pk-reposition`,o,{once:!0}),r?.requireEvent||requestAnimationFrame(()=>{requestAnimationFrame(()=>{e.hasAttribute(`data-current-placement`)&&o()})}),window.setTimeout(o,n)})}var x=globalThis.HTMLElement!==void 0&&Object.prototype.hasOwnProperty.call(globalThis.HTMLElement.prototype,`popover`),S=Math.min,C=Math.max,w=Math.round,T=Math.floor,E=e=>({x:e,y:e}),D={left:`right`,right:`left`,bottom:`top`,top:`bottom`};function ee(e,t,n){return C(e,S(t,n))}function O(e,t){return typeof e==`function`?e(t):e}function k(e){return e.split(`-`)[0]}function A(e){return e.split(`-`)[1]}function j(e){return e===`x`?`y`:`x`}function te(e){return e===`y`?`height`:`width`}function M(e){let t=e[0];return t===`t`||t===`b`?`y`:`x`}function ne(e){return j(M(e))}function N(e,t,n){n===void 0&&(n=!1);let r=A(e),i=ne(e),a=te(i),o=i===`x`?r===(n?`end`:`start`)?`right`:`left`:r===`start`?`bottom`:`top`;return t.reference[a]>t.floating[a]&&(o=le(o)),[o,le(o)]}function P(e){let t=le(e);return[F(e),t,F(t)]}function F(e){return e.includes(`start`)?e.replace(`start`,`end`):e.replace(`end`,`start`)}var re=[`left`,`right`],ie=[`right`,`left`],ae=[`top`,`bottom`],oe=[`bottom`,`top`];function se(e,t,n){switch(e){case`top`:case`bottom`:return n?t?ie:re:t?re:ie;case`left`:case`right`:return t?ae:oe;default:return[]}}function ce(e,t,n,r){let i=A(e),a=se(k(e),n===`start`,r);return i&&(a=a.map(e=>e+`-`+i),t&&(a=a.concat(a.map(F)))),a}function le(e){let t=k(e);return D[t]+e.slice(t.length)}function ue(e){return{top:e.top??0,right:e.right??0,bottom:e.bottom??0,left:e.left??0}}function de(e){return typeof e==`number`?{top:e,right:e,bottom:e,left:e}:ue(e)}function fe(e){let{x:t,y:n,width:r,height:i}=e;return{width:r,height:i,top:n,left:t,right:t+r,bottom:n+i,x:t,y:n}}function pe(e,t,n){let{reference:r,floating:i}=e,a=M(t),o=ne(t),s=te(o),c=k(t),l=a===`y`,u=r.x+r.width/2-i.width/2,d=r.y+r.height/2-i.height/2,f=r[s]/2-i[s]/2,p;switch(c){case`top`:p={x:u,y:r.y-i.height};break;case`bottom`:p={x:u,y:r.y+r.height};break;case`right`:p={x:r.x+r.width,y:d};break;case`left`:p={x:r.x-i.width,y:d};break;default:p={x:r.x,y:r.y}}let m=A(t);return m&&(p[o]+=f*(m===`end`?1:-1)*(n&&l?-1:1)),p}async function me(e,t){t===void 0&&(t={});let{x:n,y:r,platform:i,rects:a,elements:o,strategy:s}=e,{boundary:c=`clippingAncestors`,rootBoundary:l=`viewport`,elementContext:u=`floating`,altBoundary:d=!1,padding:f=0}=O(t,e),p=de(f),m=o[d?u===`floating`?`reference`:`floating`:u],h=fe(await i.getClippingRect({element:await(i.isElement==null?void 0:i.isElement(m))??!0?m:m.contextElement||await(i.getDocumentElement==null?void 0:i.getDocumentElement(o.floating)),boundary:c,rootBoundary:l,strategy:s})),g=u===`floating`?{x:n,y:r,width:a.floating.width,height:a.floating.height}:a.reference,_=await(i.getOffsetParent==null?void 0:i.getOffsetParent(o.floating)),v=await(i.isElement==null?void 0:i.isElement(_))&&await(i.getScale==null?void 0:i.getScale(_))||{x:1,y:1},y=fe(i.convertOffsetParentRelativeRectToViewportRelativeRect?await i.convertOffsetParentRelativeRectToViewportRelativeRect({elements:o,rect:g,offsetParent:_,strategy:s}):g);return{top:(h.top-y.top+p.top)/v.y,bottom:(y.bottom-h.bottom+p.bottom)/v.y,left:(h.left-y.left+p.left)/v.x,right:(y.right-h.right+p.right)/v.x}}var he=50,ge=async(e,t,n)=>{let{placement:r=`bottom`,strategy:i=`absolute`,middleware:a=[],platform:o}=n,s=o.detectOverflow?o:{...o,detectOverflow:me},c=await(o.isRTL==null?void 0:o.isRTL(t)),l=await o.getElementRects({reference:e,floating:t,strategy:i}),{x:u,y:d}=pe(l,r,c),f=r,p=0,m={};for(let n=0;n<a.length;n++){let h=a[n];if(!h)continue;let{name:g,fn:_}=h,{x:v,y,data:b,reset:x}=await _({x:u,y:d,initialPlacement:r,placement:f,strategy:i,middlewareData:m,rects:l,platform:s,elements:{reference:e,floating:t}});u=v??u,d=y??d,m[g]={...m[g],...b},x&&p<he&&(p++,typeof x==`object`&&(x.placement&&(f=x.placement),x.rects&&(l=x.rects===!0?await o.getElementRects({reference:e,floating:t,strategy:i}):x.rects),{x:u,y:d}=pe(l,f,c)),n=-1)}return{x:u,y:d,placement:f,strategy:i,middlewareData:m}},_e=e=>({name:`arrow`,options:e,async fn(t){let{x:n,y:r,placement:i,rects:a,platform:o,elements:s,middlewareData:c}=t,{element:l,padding:u=0}=O(e,t)||{};if(l==null)return{};let d=de(u),f={x:n,y:r},p=ne(i),m=te(p),h=await o.getDimensions(l),g=p===`y`,_=g?`top`:`left`,v=g?`bottom`:`right`,y=g?`clientHeight`:`clientWidth`,b=a.reference[m]+a.reference[p]-f[p]-a.floating[m],x=f[p]-a.reference[p],C=await(o.getOffsetParent==null?void 0:o.getOffsetParent(l)),w=C?C[y]:0;(!w||!await(o.isElement==null?void 0:o.isElement(C)))&&(w=s.floating[y]||a.floating[m]);let T=b/2-x/2,E=w/2-h[m]/2-1,D=S(d[_],E),k=S(d[v],E),j=w-h[m]-k,M=w/2-h[m]/2+T,N=ee(D,M,j),P=!c.arrow&&A(i)!=null&&M!==N&&a.reference[m]/2-(M<D?D:k)-h[m]/2<0,F=P?M<D?M-D:M-j:0;return{[p]:f[p]+F,data:{[p]:N,centerOffset:M-N-F,...P&&{alignmentOffset:F}},reset:P}}}),ve=function(e){return e===void 0&&(e={}),{name:`flip`,options:e,async fn(t){var n;let{placement:r,middlewareData:i,rects:a,initialPlacement:o,platform:s,elements:c}=t,{mainAxis:l=!0,crossAxis:u=!0,fallbackPlacements:d,fallbackStrategy:f=`bestFit`,fallbackAxisSideDirection:p=`none`,flipAlignment:m=!0,...h}=O(e,t);if((n=i.arrow)!=null&&n.alignmentOffset)return{};let g=k(r),_=M(o),v=k(o)===o,y=await(s.isRTL==null?void 0:s.isRTL(c.floating)),b=d||(v||!m?[le(o)]:P(o)),x=p!==`none`;!d&&x&&b.push(...ce(o,m,p,y));let S=[o,...b],C=await s.detectOverflow(t,h),w=[],T=i.flip?.overflows||[];if(l&&w.push(C[g]),u){let e=N(r,a,y);w.push(C[e[0]],C[e[1]])}if(T=[...T,{placement:r,overflows:w}],!w.every(e=>e<=0)){let e=(i.flip?.index||0)+1,t=S[e];if(t&&(u!==`alignment`||_===M(t)||T.every(e=>M(e.placement)!==_||e.overflows[0]>0)))return{data:{index:e,overflows:T},reset:{placement:t}};let n=T.filter(e=>e.overflows[0]<=0).sort((e,t)=>e.overflows[1]-t.overflows[1])[0]?.placement;if(!n)switch(f){case`bestFit`:{let e=T.filter(e=>{if(x){let t=M(e.placement);return t===_||t===`y`}return!0}).map(e=>[e.placement,e.overflows.filter(e=>e>0).reduce((e,t)=>e+t,0)]).sort((e,t)=>e[1]-t[1])[0]?.[0];e&&(n=e);break}case`initialPlacement`:n=o}if(r!==n)return{reset:{placement:n}}}return{}}}},ye=new Set([`left`,`top`]);async function be(e,t){let{placement:n,platform:r,elements:i}=e,a=await(r.isRTL==null?void 0:r.isRTL(i.floating)),o=k(n),s=A(n),c=M(n)===`y`,l=ye.has(o)?-1:1,u=a&&c?-1:1,d=O(t,e),{mainAxis:f,crossAxis:p,alignmentAxis:m}=typeof d==`number`?{mainAxis:d,crossAxis:0,alignmentAxis:null}:{mainAxis:d.mainAxis||0,crossAxis:d.crossAxis||0,alignmentAxis:d.alignmentAxis};return s&&typeof m==`number`&&(p=s===`end`?m*-1:m),c?{x:p*u,y:f*l}:{x:f*l,y:p*u}}var xe=function(e){return e===void 0&&(e=0),{name:`offset`,options:e,async fn(t){var n;let{x:r,y:i,placement:a,middlewareData:o}=t,s=await be(t,e);return a===o.offset?.placement&&(n=o.arrow)!=null&&n.alignmentOffset?{}:{x:r+s.x,y:i+s.y,data:{...s,placement:a}}}}},Se=function(e){return e===void 0&&(e={}),{name:`shift`,options:e,async fn(t){let{x:n,y:r,placement:i,platform:a}=t,{mainAxis:o=!0,crossAxis:s=!1,limiter:c={fn:e=>{let{x:t,y:n}=e;return{x:t,y:n}}},...l}=O(e,t),u={x:n,y:r},d=await a.detectOverflow(t,l),f=M(i),p=j(f),m=u[p],h=u[f],g=(e,t)=>ee(t+d[e===`y`?`top`:`left`],t,t-d[e===`y`?`bottom`:`right`]);o&&(m=g(p,m)),s&&(h=g(f,h));let _=c.fn({...t,[p]:m,[f]:h});return{..._,data:{x:_.x-n,y:_.y-r,enabled:{[p]:o,[f]:s}}}}}},Ce=function(e){return e===void 0&&(e={}),{name:`size`,options:e,async fn(t){let{placement:n,rects:r,platform:i,elements:a}=t,{apply:o=()=>{},...s}=O(e,t),c=await i.detectOverflow(t,s),l=k(n),u=A(n),d=M(n)===`y`,{width:f,height:p}=r.floating,m,h;l===`top`||l===`bottom`?(m=l,h=u===(await(i.isRTL==null?void 0:i.isRTL(a.floating))?`start`:`end`)?`left`:`right`):(h=l,m=u===`end`?`top`:`bottom`);let g=p-c.top-c.bottom,_=f-c.left-c.right,v=S(p-c[m],g),y=S(f-c[h],_),b=t.middlewareData.shift,x=!b,w=v,T=y;b!=null&&b.enabled.x&&(T=_),b!=null&&b.enabled.y&&(w=g),x&&!u&&(d?T=f-2*C(c.left,c.right):w=p-2*C(c.top,c.bottom)),await o({...t,availableWidth:T,availableHeight:w});let E=await i.getDimensions(a.floating);return f!==E.width||p!==E.height?{reset:{rects:!0}}:{}}}};function we(){return typeof window<`u`}function I(e){return Te(e)?(e.nodeName||``).toLowerCase():`#document`}function L(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function R(e){return((Te(e)?e.ownerDocument:e.document)||window.document)?.documentElement}function Te(e){return we()?e instanceof Node||e instanceof L(e).Node:!1}function z(e){return we()?e instanceof Element||e instanceof L(e).Element:!1}function B(e){return we()?e instanceof HTMLElement||e instanceof L(e).HTMLElement:!1}function Ee(e){return!we()||typeof ShadowRoot>`u`?!1:e instanceof ShadowRoot||e instanceof L(e).ShadowRoot}function V(e){let{overflow:t,overflowX:n,overflowY:r,display:i}=K(e);return/auto|scroll|overlay|hidden|clip/.test(t+r+n)&&i!==`inline`&&i!==`contents`}function De(e){return/^(table|td|th)$/.test(I(e))}function H(e){try{if(e.matches(`:popover-open`))return!0}catch{}try{return e.matches(`:modal`)}catch{return!1}}var Oe=/transform|translate|scale|rotate|perspective|filter/,ke=/paint|layout|strict|content/,U=e=>!!e&&e!==`none`,Ae;function W(e){let t=z(e)?K(e):e;return U(t.transform)||U(t.translate)||U(t.scale)||U(t.rotate)||U(t.perspective)||!Me()&&(U(t.backdropFilter)||U(t.filter))||Oe.test(t.willChange||``)||ke.test(t.contain||``)}function je(e){let t=q(e);for(;B(t)&&!G(t);){if(W(t))return t;if(H(t))return null;t=q(t)}return null}function Me(){return Ae??=typeof CSS<`u`&&CSS.supports&&CSS.supports(`-webkit-backdrop-filter`,`none`),Ae}function G(e){return/^(html|body|#document)$/.test(I(e))}function K(e){return L(e).getComputedStyle(e)}function Ne(e){return z(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function q(e){if(I(e)===`html`)return e;let t=e.assignedSlot||e.parentNode||Ee(e)&&e.host||R(e);return Ee(t)?t.host:t}function Pe(e){let t=q(e);return G(t)?(e.ownerDocument||e).body:B(t)&&V(t)?t:Pe(t)}function J(e,t,n){t===void 0&&(t=[]),n===void 0&&(n=!0);let r=Pe(e),i=r===e.ownerDocument?.body,a=L(r);if(i){let e=Fe(a);return t.concat(a,a.visualViewport||[],V(r)?r:[],e&&n?J(e):[])}return t.concat(r,J(r,[],n))}function Fe(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function Ie(e){let t=K(e),n=parseFloat(t.width)||0,r=parseFloat(t.height)||0,i=B(e),a=i?e.offsetWidth:n,o=i?e.offsetHeight:r,s=w(n)!==a||w(r)!==o;return s&&(n=a,r=o),{width:n,height:r,$:s}}function Le(e){return z(e)?e:e.contextElement}function Y(e){let t=Le(e);if(!B(t))return E(1);let n=t.getBoundingClientRect(),{width:r,height:i,$:a}=Ie(t),o=(a?w(n.width):n.width)/r,s=(a?w(n.height):n.height)/i;return(!o||!Number.isFinite(o))&&(o=1),(!s||!Number.isFinite(s))&&(s=1),{x:o,y:s}}var Re=E(0);function ze(e){let t=L(e);return!Me()||!t.visualViewport?Re:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function Be(e,t,n){return t===void 0&&(t=!1),!!n&&t&&n===L(e)}function X(e,t,n,r){t===void 0&&(t=!1),n===void 0&&(n=!1);let i=e.getBoundingClientRect(),a=Le(e),o=E(1);t&&(r?z(r)&&(o=Y(r)):o=Y(e));let s=Be(a,n,r)?ze(a):E(0),c=(i.left+s.x)/o.x,l=(i.top+s.y)/o.y,u=i.width/o.x,d=i.height/o.y;if(a&&r){let e=L(a),t=z(r)?L(r):r,n=e,i=Fe(n);for(;i&&t!==n;){let e=Y(i),t=i.getBoundingClientRect(),r=K(i),a=t.left+(i.clientLeft+parseFloat(r.paddingLeft))*e.x,o=t.top+(i.clientTop+parseFloat(r.paddingTop))*e.y;c*=e.x,l*=e.y,u*=e.x,d*=e.y,c+=a,l+=o,n=L(i),i=Fe(n)}}return fe({width:u,height:d,x:c,y:l})}function Ve(e,t){let n=Ne(e).scrollLeft;return t?t.left+n:X(R(e)).left+n}function He(e,t){let n=e.getBoundingClientRect();return{x:n.left+t.scrollLeft-Ve(e,n),y:n.top+t.scrollTop}}function Ue(e){let{elements:t,rect:n,offsetParent:r,strategy:i}=e,a=i===`fixed`,o=R(r),s=t?H(t.floating):!1;if(r===o||s&&a)return n;let c={scrollLeft:0,scrollTop:0},l=E(1),u=E(0),d=B(r);if((d||!a)&&((I(r)!==`body`||V(o))&&(c=Ne(r)),d)){let e=X(r);l=Y(r),u.x=e.x+r.clientLeft,u.y=e.y+r.clientTop}let f=o&&!d&&!a?He(o,c):E(0);return{width:n.width*l.x,height:n.height*l.y,x:n.x*l.x-c.scrollLeft*l.x+u.x+f.x,y:n.y*l.y-c.scrollTop*l.y+u.y+f.y}}function We(e){return e.getClientRects?Array.from(e.getClientRects()):[]}function Ge(e){let t=Ne(e),n=e.ownerDocument.body,r=C(e.scrollWidth,e.clientWidth,n.scrollWidth,n.clientWidth),i=C(e.scrollHeight,e.clientHeight,n.scrollHeight,n.clientHeight),a=-t.scrollLeft+Ve(e),o=-t.scrollTop;return K(n).direction===`rtl`&&(a+=C(e.clientWidth,n.clientWidth)-r),{width:r,height:i,x:a,y:o}}var Ke=25;function qe(e,t,n){n===void 0&&(n=`viewport`);let r=n===`layoutViewport`,i=L(e),a=R(e),o=i.visualViewport,s=a.clientWidth,c=a.clientHeight,l=0,u=0;if(o){let e=!Me()||t===`fixed`;r?e||(l=-o.offsetLeft,u=-o.offsetTop):(s=o.width,c=o.height,e&&(l=o.offsetLeft,u=o.offsetTop))}if(Ve(a)<=0){let e=a.ownerDocument,t=e.body,n=getComputedStyle(t),r=e.compatMode===`CSS1Compat`&&parseFloat(n.marginLeft)+parseFloat(n.marginRight)||0,i=Math.abs(a.clientWidth-t.clientWidth-r),o=getComputedStyle(a).scrollbarGutter===`stable both-edges`?i/2:i;o<=Ke&&(s-=o)}return{width:s,height:c,x:l,y:u}}function Je(e,t){let n=X(e,!0,t===`fixed`),r=n.top+e.clientTop,i=n.left+e.clientLeft,a=Y(e);return{width:e.clientWidth*a.x,height:e.clientHeight*a.y,x:i*a.x,y:r*a.y}}function Ye(e,t,n){let r;if(t===`viewport`||t===`layoutViewport`)r=qe(e,n,t);else if(t===`document`)r=Ge(R(e));else if(z(t))r=Je(t,n);else{let n=ze(e);r={x:t.x-n.x,y:t.y-n.y,width:t.width,height:t.height}}return fe(r)}function Xe(e,t){let n=t.get(e);if(n)return n;let r=J(e,[],!1).filter(e=>z(e)&&I(e)!==`body`),i=null,a=K(e).position===`fixed`,o=a?q(e):e;for(;z(o)&&!G(o);){let e=K(o),t=W(o),n=i?i.position:a?`fixed`:``;!t&&(n===`fixed`||n===`absolute`&&e.position===`static`)?r=r.filter(e=>e!==o):i=e,o=q(o)}return t.set(e,r),r}function Ze(e){let{element:t,boundary:n,rootBoundary:r,strategy:i}=e,a=[...n===`clippingAncestors`?H(t)?[]:Xe(t,this._c):[].concat(n),r],o=Ye(t,a[0],i),s=o.top,c=o.right,l=o.bottom,u=o.left;for(let e=1;e<a.length;e++){let n=Ye(t,a[e],i);s=C(n.top,s),c=S(n.right,c),l=S(n.bottom,l),u=C(n.left,u)}return{width:c-u,height:l-s,x:u,y:s}}function Qe(e){let{width:t,height:n}=Ie(e);return{width:t,height:n}}function $e(e,t,n){let r=B(t),i=R(t),a=n===`fixed`,o=X(e,!0,a,t),s={scrollLeft:0,scrollTop:0},c=E(0);if((r||!a)&&((I(t)!==`body`||V(i))&&(s=Ne(t)),r)){let e=X(t,!0,a,t);c.x=e.x+t.clientLeft,c.y=e.y+t.clientTop}!r&&i&&(c.x=Ve(i));let l=i&&!r&&!a?He(i,s):E(0);return{x:o.left+s.scrollLeft-c.x-l.x,y:o.top+s.scrollTop-c.y-l.y,width:o.width,height:o.height}}function et(e){return K(e).position===`static`}function tt(e,t){if(!B(e)||K(e).position===`fixed`)return null;if(t)return t(e);let n=e.offsetParent;return R(e)===n&&(n=n.ownerDocument.body),n}function nt(e,t){let n=L(e);if(H(e))return n;if(!B(e)){let t=q(e);for(;t&&!G(t);){if(z(t)&&!et(t))return t;t=q(t)}return n}let r=tt(e,t);for(;r&&De(r)&&et(r);)r=tt(r,t);return r&&G(r)&&et(r)&&!W(r)?n:r||je(e)||n}var rt=async function(e){let t=this.getOffsetParent||nt,n=this.getDimensions,r=await n(e.floating);return{reference:$e(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:r.width,height:r.height}}};function it(e){return K(e).direction===`rtl`}var at={convertOffsetParentRelativeRectToViewportRelativeRect:Ue,getDocumentElement:R,getClippingRect:Ze,getOffsetParent:nt,getElementRects:rt,getClientRects:We,getDimensions:Qe,getScale:Y,isElement:z,isRTL:it};function ot(e,t){return e.x===t.x&&e.y===t.y&&e.width===t.width&&e.height===t.height}function st(e,t,n){let r=null,i,a=R(e);function o(){var e;clearTimeout(i),(e=r)==null||e.disconnect(),r=null}function s(n,c){n===void 0&&(n=!1),c===void 0&&(c=1),o();let l=e.getBoundingClientRect(),{left:u,top:d,width:f,height:p}=l;if(n||t(),!f||!p)return;let m=T(d),h=T(a.clientWidth-(u+f)),g=T(a.clientHeight-(d+p)),_=T(u),v={rootMargin:-m+`px `+-h+`px `+-g+`px `+-_+`px`,threshold:C(0,S(1,c))||1},y=!0;function b(t){let n=t[0].intersectionRatio;if(!ot(l,e.getBoundingClientRect()))return s();if(n!==c){if(!y)return s();n?s(!1,n):i=setTimeout(()=>{s(!1,1e-7)},1e3)}y=!1}try{r=new IntersectionObserver(b,{...v,root:a.ownerDocument})}catch{r=new IntersectionObserver(b,v)}r.observe(e)}let c=L(e),l=()=>s(n);return c.addEventListener(`resize`,l),s(!0),()=>{c.removeEventListener(`resize`,l),o()}}function ct(e,t,n,r){r===void 0&&(r={});let{ancestorScroll:i=!0,ancestorResize:a=!0,elementResize:o=typeof ResizeObserver==`function`,layoutShift:s=typeof IntersectionObserver==`function`,animationFrame:c=!1}=r,l=Le(e),u=i||a?[...l?J(l):[],...t?J(t):[]]:[];u.forEach(e=>{i&&e.addEventListener(`scroll`,n),a&&e.addEventListener(`resize`,n)});let d=l&&s?st(l,n,a):null,f=-1,p=null;o&&(p=new ResizeObserver(e=>{let[r]=e;r&&r.target===l&&p&&t&&(p.unobserve(t),cancelAnimationFrame(f),f=requestAnimationFrame(()=>{var e;(e=p)==null||e.observe(t)})),n()}),l&&!c&&p.observe(l),t&&p.observe(t));let m,h=c?X(e):null;c&&g();function g(){let t=X(e);h&&!ot(h,t)&&n(),h=t,m=requestAnimationFrame(g)}return n(),()=>{var e;u.forEach(e=>{i&&e.removeEventListener(`scroll`,n),a&&e.removeEventListener(`resize`,n)}),d?.(),(e=p)==null||e.disconnect(),p=null,c&&cancelAnimationFrame(m)}}var lt=xe,ut=Se,dt=ve,ft=Ce,pt=_e,mt=(e,t,n)=>{let r=new Map,i=n??{},a={...at,...i.platform,_c:r};return ge(e,t,{...i,platform:a})};function ht(e){return _t(e)}function gt(e){return e.assignedSlot?e.assignedSlot:e.parentNode instanceof ShadowRoot?e.parentNode.host:e.parentNode}function _t(e){for(let t=e;t;t=gt(t))if(t instanceof Element&&getComputedStyle(t).display===`none`)return null;for(let t=gt(e);t;t=gt(t)){if(!(t instanceof Element))continue;let e=getComputedStyle(t);if(e.display!==`contents`&&(e.position!==`static`||W(e)||t.tagName===`BODY`))return t}return null}function Z(e,t){if(!t)return null;let n=e.getRootNode();if(n instanceof Document||n instanceof ShadowRoot){let e=n.getElementById(t);if(e)return e}return e.ownerDocument.getElementById(t)}var vt=class extends Event{constructor(){super(`pk-reposition`,{bubbles:!0,cancelable:!1,composed:!0})}},yt=a`
    @layer pk-component {
        :host {
            display: contents;
        }

        .popup {
            position: absolute;
            isolation: isolate;
            width: max-content;
            z-index: var(--pk-popup-z-index, 1000);
            /* Never transition coordinates — flip would animate the jump. */
            transition: none;

            /* Reset UA styles for [popover] — see  pk-popup. */
            inset: unset;
            padding: unset;
            margin: unset;
            height: unset;
            color: unset;
            background: unset;
            border: unset;
            overflow: unset;
        }

        .popup-fixed {
            position: fixed;
        }

        .popup:not(.active) {
            display: none;
        }

        /* Prefer visibility over opacity so enter animations are not fighting a
         * 0→1 fade. Matches base-ui isPositioned / hide-until-placed.
         */
        .popup.active:not(.positioned) {
            visibility: hidden;
            pointer-events: none;
        }

        .popup.show {
            animation: pk-popup-surface-in 100ms ease-out;
        }

        .popup.hide {
            animation: pk-popup-surface-out 100ms ease-in forwards;
        }

        @keyframes pk-popup-surface-in {
            from {
                opacity: 0;
                transform: scale(0.95);
            }

            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        @keyframes pk-popup-surface-out {
            from {
                opacity: 1;
                transform: scale(1);
            }

            to {
                opacity: 0;
                transform: scale(0.95);
            }
        }

        .arrow {
            position: absolute;
            width: var(--pk-popup-arrow-size, 6px);
            height: var(--pk-popup-arrow-size, 6px);
            rotate: 45deg;
            background: var(--pk-popup-arrow-color, var(--pk-color-white));
            z-index: 1;
        }

        .hover-bridge {
            position: fixed;
            z-index: calc(var(--pk-popup-z-index, 1000) - 1);
            inset: 0;
            clip-path: polygon(
                var(--pk-hover-bridge-top-left-x, 0) var(--pk-hover-bridge-top-left-y, 0),
                var(--pk-hover-bridge-top-right-x, 0) var(--pk-hover-bridge-top-right-y, 0),
                var(--pk-hover-bridge-bottom-right-x, 0) var(--pk-hover-bridge-bottom-right-y, 0),
                var(--pk-hover-bridge-bottom-left-x, 0) var(--pk-hover-bridge-bottom-left-y, 0)
            );
            pointer-events: auto;
        }

        .hover-bridge:not(.hover-bridge-visible) {
            display: none;
        }
    }
`;function bt(e){return typeof e==`object`&&!!e&&`getBoundingClientRect`in e}function xt(e){return e||(x?`absolute`:`fixed`)}function St(e,t){if(!(!x||bt(e)||t!==`scroll`))return J(e).filter(e=>e instanceof Element)}var Q=class extends c{constructor(...e){super(...e),this.anchor=``,this.active=!1,this.boundary=`viewport`,this.placement=`bottom-start`,this.distance=4,this.skidding=0,this.flip=!0,this.flipFallbackPlacements=``,this.flipFallbackStrategy=`best-fit`,this.flipPadding=8,this.shift=!0,this.shiftPadding=8,this.arrow=!1,this.arrowPlacement=`anchor`,this.arrowPadding=10,this.anchorTracking=!0,this.hoverBridge=!1,this.anchorElement=null,this.settlingInitialPosition=!1,this.settleGeneration=0}static{this.styles=yt}disconnectedCallback(){this.stop(),super.disconnectedCallback()}updated(e){super.updated(e),e.has(`active`)&&(this.active?(this.resolveAnchor(),this.start()):this.stop()),e.has(`anchor`)&&this.handleAnchorChange(),this.active&&!e.has(`active`)&&this.reposition()}reposition(){this.settlingInitialPosition||this.repositionAsync()}async repositionAsync(e=!0){let t=this.popupElement,n=this.arrow?this.arrowElement:null;if(!this.active||!this.anchorElement||!t)return!1;let r=St(this.anchorElement,this.boundary),i=[lt({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?i.push(ft({apply:({rects:e})=>{let n=this.sync===`width`||this.sync===`both`,r=this.sync===`height`||this.sync===`both`;t.style.width=n?`${e.reference.width}px`:``,t.style.height=r?`${e.reference.height}px`:``}})):(t.style.width=``,t.style.height=``),this.flip&&i.push(dt({boundary:r,fallbackPlacements:this.flipFallbackPlacements?this.flipFallbackPlacements.split(` `).map(e=>e.trim()).filter(Boolean):void 0,fallbackStrategy:this.flipFallbackStrategy===`best-fit`?`bestFit`:`initialPlacement`,padding:this.flipPadding})),this.shift&&i.push(ut({boundary:r,padding:this.shiftPadding})),this.arrow&&n&&i.push(pt({element:n,padding:this.arrowPadding}));let a=xt(this.positionMethod),o=a===`fixed`;t.classList.toggle(`popup-fixed`,o);let s=x?e=>at.getOffsetParent(e,ht):at.getOffsetParent,{x:c,y:l,middlewareData:u,placement:d}=await mt(this.anchorElement,t,{placement:this.placement,middleware:i,strategy:a,platform:{...at,getOffsetParent:s}});if(!this.active||!t.isConnected)return!1;let f={top:`bottom`,right:`left`,bottom:`top`,left:`right`}[d.split(`-`)[0]];if(this.setAttribute(`data-current-placement`,d),Object.assign(t.style,{left:`${c}px`,top:`${l}px`,...o?{position:`fixed`}:{position:``}}),this.anchorElement){let e=this.anchorElement.getBoundingClientRect(),n=t.getBoundingClientRect();t.style.setProperty(`--pk-anchor-width`,`${e.width}px`),t.style.setProperty(`--pk-anchor-height`,`${e.height}px`);let r=v(d,e,n,this.distance,u.shift);t.style.setProperty(`--pk-transform-origin`,r)}if(this.arrow&&n){let e=u.arrow?.x,t=u.arrow?.y,r=``,i=``,a=``,o=``;if(this.arrowPlacement===`start`){let n=typeof e==`number`?`${this.arrowPadding}px`:``;r=typeof t==`number`?`${this.arrowPadding}px`:``,o=n}else this.arrowPlacement===`end`?(i=typeof e==`number`?`${this.arrowPadding}px`:``,a=typeof t==`number`?`${this.arrowPadding}px`:``):this.arrowPlacement===`center`?(o=typeof e==`number`?`50%`:``,r=typeof t==`number`?`50%`:``):(o=typeof e==`number`?`${e}px`:``,r=typeof t==`number`?`${t}px`:``);Object.assign(n.style,{top:r,right:i,bottom:a,left:o,transform:``,[f]:`calc(-1 * var(--pk-popup-arrow-size, 6px) / 2)`})}return requestAnimationFrame(()=>this.updateHoverBridge()),e&&this.dispatchEvent(new vt),!0}frames(e){return new Promise(t=>{let n=e=>{if(e<=0){t();return}requestAnimationFrame(()=>n(e-1))};n(e)})}async settleInitialPosition(){let e=++this.settleGeneration,t=this.popupElement;if(!t){this.settlingInitialPosition=!1;return}await this.frames(2),!(!this.active||e!==this.settleGeneration)&&(await this.repositionAsync(!1),t.offsetHeight,await this.frames(1),!(!this.active||e!==this.settleGeneration)&&(await this.repositionAsync(!1),!(!this.active||e!==this.settleGeneration)&&(t.classList.add(`positioned`),this.settlingInitialPosition=!1,requestAnimationFrame(()=>this.updateHoverBridge()),this.dispatchEvent(new vt))))}resolveAnchor(){if(typeof this.anchor==`string`&&this.anchor){this.anchorElement=Z(this,this.anchor);return}if(this.anchor instanceof Element||bt(this.anchor)){this.anchorElement=this.anchor;return}let e=this.querySelector(`[slot="anchor"]`);e instanceof HTMLSlotElement&&(e=e.assignedElements({flatten:!0})[0]??null),this.anchorElement=e}async handleAnchorChange(){await this.stop(),this.resolveAnchor(),this.anchorElement&&this.active&&this.start()}usesPopoverTopLayer(){return x&&this.positionMethod!==`fixed`}stop(){return new Promise(e=>{let t=this.popupElement;this.settleGeneration+=1,this.settlingInitialPosition=!1,t?.classList.remove(`positioned`),this.usesPopoverTopLayer()&&t?.hidePopover?.(),this.cleanup?(this.cleanup(),this.cleanup=void 0,t?.style.removeProperty(`--pk-transform-origin`),requestAnimationFrame(()=>e())):e(),this.removeAttribute(`data-current-placement`)})}releasePositioning(){this.cleanup&&=(this.cleanup(),void 0)}async awaitHidden(){await this.stop()}start(){!this.anchorElement||!this.active||!this.isConnected||!this.popupElement||(this.popupElement.classList.remove(`positioned`),this.settlingInitialPosition=!0,this.usesPopoverTopLayer()&&this.popupElement.showPopover?.(),this.anchorTracking&&(this.cleanup=ct(this.anchorElement,this.popupElement,()=>{this.settlingInitialPosition||this.reposition()})),this.settleInitialPosition())}getContentElement(){let e=((this.shadowRoot?.querySelector(`slot:not([name])`))?.assignedElements({flatten:!0})??[]).find(e=>e instanceof HTMLElement);if(e)return e;for(let e of this.childNodes)if(e instanceof HTMLElement&&e.getAttribute(`slot`)!==`anchor`)return e;return null}updateHoverBridge(){let e=this.popupElement;if(!this.hoverBridge||!this.anchorElement||!e)return;let t=this.anchorElement.getBoundingClientRect(),n=e.getBoundingClientRect(),r=this.placement.includes(`top`)||this.placement.includes(`bottom`),i=0,a=0,o=0,s=0,c=0,l=0,u=0,d=0;r?t.top<n.top?(i=t.left,a=t.bottom,o=t.right,s=t.bottom,c=n.left,l=n.top,u=n.right,d=n.top):(i=n.left,a=n.bottom,o=n.right,s=n.bottom,c=t.left,l=t.top,u=t.right,d=t.top):t.left<n.left?(i=t.right,a=t.top,o=n.left,s=n.top,c=t.right,l=t.bottom,u=n.left,d=n.bottom):(i=n.right,a=n.top,o=t.left,s=t.top,c=n.right,l=n.bottom,u=t.left,d=t.bottom),this.style.setProperty(`--pk-hover-bridge-top-left-x`,`${i}px`),this.style.setProperty(`--pk-hover-bridge-top-left-y`,`${a}px`),this.style.setProperty(`--pk-hover-bridge-top-right-x`,`${o}px`),this.style.setProperty(`--pk-hover-bridge-top-right-y`,`${s}px`),this.style.setProperty(`--pk-hover-bridge-bottom-left-x`,`${c}px`),this.style.setProperty(`--pk-hover-bridge-bottom-left-y`,`${l}px`),this.style.setProperty(`--pk-hover-bridge-bottom-right-x`,`${u}px`),this.style.setProperty(`--pk-hover-bridge-bottom-right-y`,`${d}px`)}render(){let e=!x||this.positionMethod===`fixed`,r=this.usesPopoverTopLayer();return t`
            <slot name="anchor" @slotchange=${()=>{this.handleAnchorChange()}}></slot>
            ${this.hoverBridge?t`
                <div
                    part="hover-bridge"
                    class=${u({"hover-bridge":!0,"hover-bridge-visible":this.active})}
                    aria-hidden="true"
                ></div>
            `:n}
            <div
                popover=${r?`manual`:n}
                part="popup"
                class=${u({popup:!0,active:this.active,"popup-fixed":e})}
            >
                ${this.arrow?t`<div part="arrow" class="arrow"></div>`:n}
                <slot></slot>
            </div>
        `}};r([s()],Q.prototype,`anchor`,void 0),r([s({type:Boolean,reflect:!0})],Q.prototype,`active`,void 0),r([s({attribute:`position-method`})],Q.prototype,`positionMethod`,void 0),r([s({reflect:!0})],Q.prototype,`boundary`,void 0),r([s({reflect:!0})],Q.prototype,`placement`,void 0),r([s({type:Number})],Q.prototype,`distance`,void 0),r([s({type:Number})],Q.prototype,`skidding`,void 0),r([s({type:Boolean})],Q.prototype,`flip`,void 0),r([s({attribute:`flip-fallback-placements`})],Q.prototype,`flipFallbackPlacements`,void 0),r([s({attribute:`flip-fallback-strategy`})],Q.prototype,`flipFallbackStrategy`,void 0),r([s({attribute:`flip-padding`,type:Number})],Q.prototype,`flipPadding`,void 0),r([s({type:Boolean})],Q.prototype,`shift`,void 0),r([s({attribute:`shift-padding`,type:Number})],Q.prototype,`shiftPadding`,void 0),r([s({type:Boolean})],Q.prototype,`arrow`,void 0),r([s({attribute:`arrow-placement`})],Q.prototype,`arrowPlacement`,void 0),r([s({attribute:`arrow-padding`,type:Number})],Q.prototype,`arrowPadding`,void 0),r([s()],Q.prototype,`sync`,void 0),r([s({attribute:`anchor-tracking`,type:Boolean})],Q.prototype,`anchorTracking`,void 0),r([s({attribute:`hover-bridge`,type:Boolean})],Q.prototype,`hoverBridge`,void 0),r([e(`.popup`)],Q.prototype,`popupElement`,void 0),r([e(`.arrow`)],Q.prototype,`arrowElement`,void 0),Q=r([o(`pk-popup`)],Q);var Ct=[a`
    @layer pk-component {
        .content.pk-popup-content {
            transform-origin: var(--pk-transform-origin, top);
        }

        .content.pk-popup-content[data-open] {
            animation: pk-tooltip-in 150ms ease forwards;
        }

        .content.pk-popup-content[data-open][data-side='top'] {
            animation-name: pk-tooltip-in-top;
        }

        .content.pk-popup-content[data-open][data-side='bottom'] {
            animation-name: pk-tooltip-in-bottom;
        }

        .content.pk-popup-content[data-open][data-side='left'] {
            animation-name: pk-tooltip-in-left;
        }

        .content.pk-popup-content[data-open][data-side='right'] {
            animation-name: pk-tooltip-in-right;
        }

        .content.pk-popup-content.closing {
            animation: pk-tooltip-out 150ms ease;
        }

        @keyframes pk-tooltip-in {
            from {
                opacity: 0;
                transform: scale(0.95);
            }

            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        @keyframes pk-tooltip-out {
            from {
                opacity: 1;
                transform: scale(1);
            }

            to {
                opacity: 0;
                transform: scale(0.95);
            }
        }

        @keyframes pk-tooltip-in-top {
            from {
                opacity: 0;
                transform: scale(0.95) translateY(0.5rem);
            }

            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }

        @keyframes pk-tooltip-in-bottom {
            from {
                opacity: 0;
                transform: scale(0.95) translateY(-0.5rem);
            }

            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }

        @keyframes pk-tooltip-in-left {
            from {
                opacity: 0;
                transform: scale(0.95) translateX(0.5rem);
            }

            to {
                opacity: 1;
                transform: scale(1) translateX(0);
            }
        }

        @keyframes pk-tooltip-in-right {
            from {
                opacity: 0;
                transform: scale(0.95) translateX(-0.5rem);
            }

            to {
                opacity: 1;
                transform: scale(1) translateX(0);
            }
        }
    }
`,a`
    @layer pk-component {
        :host {
            display: inline-block;
            max-width: 100%;
            align-self: flex-start;
            flex: none;
            vertical-align: middle;
            --pk-popup-z-index: 250;
            --pk-tooltip-arrow-size: 9px;
            --pk-tooltip-arrow-inset: 1px;
        }

        .content:not([data-open]):not(.closing) {
            opacity: 0;
            pointer-events: none;
        }

        .content[data-open]:not(.closing) {
            opacity: 1;
        }

        .content {
            position: relative;
            isolation: isolate;
            overflow: visible;
            width: fit-content;
            max-width: 20rem;
            padding: 4px 8px;
            border-radius: var(--pk-radius-sm);
            background: #1c2e36;
            color: var(--pk-color-white);
            font-family: var(--pk-font-family);
            font-size: 12px;
            line-height: 1.4;
            pointer-events: none;
        }

        .content::after {
            content: '';
            position: absolute;
            z-index: -1;
            width: var(--pk-tooltip-arrow-size);
            height: var(--pk-tooltip-arrow-size);
            background: #1c2e36;
            border-radius: 2px;
            rotate: 45deg;
            pointer-events: none;
        }

        .content[data-side='top']::after {
            left: calc(50% - var(--pk-tooltip-arrow-size) / 2);
            bottom: calc(var(--pk-tooltip-arrow-size) * -0.5 + var(--pk-tooltip-arrow-inset));
        }

        .content[data-side='bottom']::after {
            left: calc(50% - var(--pk-tooltip-arrow-size) / 2);
            top: calc(var(--pk-tooltip-arrow-size) * -0.5 + var(--pk-tooltip-arrow-inset));
        }

        .content[data-side='left']::after {
            top: calc(50% - var(--pk-tooltip-arrow-size) / 2);
            right: calc(var(--pk-tooltip-arrow-size) * -0.5 + var(--pk-tooltip-arrow-inset));
        }

        .content[data-side='right']::after {
            top: calc(50% - var(--pk-tooltip-arrow-size) / 2);
            left: calc(var(--pk-tooltip-arrow-size) * -0.5 + var(--pk-tooltip-arrow-inset));
        }

        .content[hidden] {
            display: none !important;
        }
    }
    `],$=class extends c{constructor(...e){super(...e),this.placement=`top`,this.trigger=`hover focus`,this.disabled=!1,this.openDelay=0,this.closeDelay=0,this.content=``,this.for=``,this.open=!1,this.triggerElement=null,this.contentAnimated=!1,this.closing=!1,this.contentSide=null,this.hasSlottedBody=!1,this.triggerId=h(`pk-tooltip-trigger`),this.tooltipId=h(`pk-tooltip`),this.showGeneration=0,this.exitGeneration=0,this.syncPlacementAnimation=()=>{let e=this.popupElement?.getAttribute(`data-current-placement`)??this.placement,t=this.popupElement?.getContentElement();this.contentSide=e?_(e):null,y(this.popupElement,e),t&&y(t,e)},this.onBodySlotChange=e=>{let t=e.target;this.hasSlottedBody=t.assignedNodes({flatten:!0}).some(e=>e.nodeType===Node.ELEMENT_NODE||e.nodeType===Node.TEXT_NODE&&!!e.textContent?.trim())},this.scheduleShow=()=>{this.usesPointerTrigger()&&(window.clearTimeout(this.closeTimer),window.clearTimeout(this.openTimer),this.openTimer=window.setTimeout(()=>this.showTooltip(),this.openDelay))},this.scheduleHide=()=>{this.usesPointerTrigger()&&(window.clearTimeout(this.openTimer),window.clearTimeout(this.closeTimer),this.closeTimer=window.setTimeout(()=>this.hideTooltip(),this.closeDelay))}}static{this.styles=Ct}disconnectedCallback(){this.popupElement?.removeEventListener(`pk-reposition`,this.syncPlacementAnimation),this.clearTimers(),this.hideTooltip(!0),super.disconnectedCallback()}updated(e){super.updated(e),(e.has(`trigger`)||e.has(`disabled`)||e.has(`for`))&&this.rebindTrigger(),this.disabled&&this.open&&this.hideTooltip(!0)}firstUpdated(){this.popupElement.addEventListener(`pk-reposition`,this.syncPlacementAnimation),this.for&&queueMicrotask(()=>{this.resolveExternalTrigger()})}async show(){this.disabled||(this.clearTimers(),this.showTooltip(!0),await this.updateComplete)}async hide(){this.clearTimers(),this.hideTooltip(!0),await this.updateComplete}clearTimers(){window.clearTimeout(this.openTimer),window.clearTimeout(this.closeTimer)}resolveExternalTrigger(){this.triggerElement=Z(this,this.for),this.rebindTrigger()}onTriggerSlotChange(e){let[t]=e.target.assignedElements({flatten:!0});this.unbindTrigger(this.triggerElement),this.triggerElement=t??null,this.rebindTrigger(),this.requestUpdate()}rebindTrigger(){this.unbindTrigger(this.triggerElement),this.for&&(this.triggerElement=Z(this,this.for)),this.bindTrigger(this.triggerElement)}usesPointerTrigger(){return!this.disabled&&this.trigger!==`manual`}bindTrigger(e){!e||!this.usesPointerTrigger()||(e.id||=this.triggerId,e.setAttribute(`aria-describedby`,this.tooltipId),e.addEventListener(`mouseenter`,this.scheduleShow),e.addEventListener(`mouseleave`,this.scheduleHide),e.addEventListener(`focus`,this.scheduleShow),e.addEventListener(`blur`,this.scheduleHide))}unbindTrigger(e){e&&(e.removeAttribute(`aria-describedby`),e.removeEventListener(`mouseenter`,this.scheduleShow),e.removeEventListener(`mouseleave`,this.scheduleHide),e.removeEventListener(`focus`,this.scheduleShow),e.removeEventListener(`blur`,this.scheduleHide))}getAnchor(){return this.for?Z(this,this.for):this.triggerElement?this.triggerElement:null}prepareContentForEnter(e){e&&(e.classList.remove(`closing`),e.style.animation=`none`,e.getBoundingClientRect(),e.style.removeProperty(`animation`),e.style.removeProperty(`opacity`),e.style.removeProperty(`transform`))}showTooltip(e=!1){if(!this.getAnchor()||this.open&&this.contentAnimated&&!this.closing&&!e)return;this.open||this.dispatchEvent(new p);let t=++this.showGeneration;this.exitGeneration+=1,this.closing=!1,this.open=!0,this.contentAnimated=!1,this.prepareContentForEnter(this.popupElement?.getContentElement()),this.updateComplete.then(async()=>{t===this.showGeneration&&(await b(this.popupElement,this.placement),t===this.showGeneration&&(this.syncPlacementAnimation(),this.prepareContentForEnter(this.popupElement?.getContentElement()),this.contentAnimated=!0,this.dispatchEvent(new l),this.dispatchEvent(new CustomEvent(`pk-open-change`,{detail:{open:!0},bubbles:!0,composed:!0}))))})}hideTooltip(e=!1,t=!1){if(!(!this.open&&!this.closing&&!e)&&!(this.closing&&!e)){if(t){let e=new d(`api`);if(!this.dispatchEvent(e))return}if(this.showGeneration+=1,e){this.finishHide();return}if(!this.contentAnimated){this.finishHide();return}this.playExitAnimation()}}async playExitAnimation(){if(!this.open)return;let e=this.exitGeneration+1;this.exitGeneration=e;let t=this.popupElement?.getContentElement();this.closing=!0,this.contentAnimated=!1,t&&await this.waitForExitAnimation(t),e===this.exitGeneration&&this.finishHide()}waitForExitAnimation(e){return new Promise(t=>{let n=!1,r=()=>{n||(n=!0,e.removeEventListener(`animationend`,i),window.clearTimeout(a),e.classList.remove(`closing`),t())},i=t=>{t.target===e&&t.animationName.startsWith(`pk-tooltip-out`)&&r()};e.classList.add(`closing`),e.addEventListener(`animationend`,i);let a=window.setTimeout(r,200)})}finishHide(){let e=this.popupElement?.getContentElement();this.closing=!1,this.contentAnimated=!1,this.contentSide=null,this.open=!1,this.popupElement?.removeAttribute(`data-side`),this.prepareContentForEnter(e),this.dispatchEvent(new f),this.dispatchEvent(new CustomEvent(`pk-open-change`,{detail:{open:!1},bubbles:!0,composed:!0}))}render(){let e=this.getAnchor();return t`
            <slot name="trigger" @slotchange=${this.onTriggerSlotChange}></slot>
            <pk-popup
                .active=${this.open||this.closing}
                .anchor=${e??``}
                .placement=${this.placement}
                .distance=${4}
                hover-bridge
                flip
                shift
            >
                <div
                    part="content"
                    class=${u({content:!0,"pk-popup-content":!0,closing:this.closing})}
                    id=${this.tooltipId}
                    role="tooltip"
                    ?hidden=${!this.open&&!this.closing}
                    data-open=${this.contentAnimated&&!this.closing?``:n}
                    data-side=${this.contentSide??n}
                >
                    <slot @slotchange=${this.onBodySlotChange}></slot>
                    ${this.hasSlottedBody?n:this.content||n}
                </div>
            </pk-popup>
        `}};r([s({reflect:!0})],$.prototype,`placement`,void 0),r([s({reflect:!0})],$.prototype,`trigger`,void 0),r([s({type:Boolean,reflect:!0})],$.prototype,`disabled`,void 0),r([s({type:Number,attribute:`open-delay`})],$.prototype,`openDelay`,void 0),r([s({type:Number,attribute:`close-delay`})],$.prototype,`closeDelay`,void 0),r([s()],$.prototype,`content`,void 0),r([s({reflect:!0})],$.prototype,`for`,void 0),r([e(`pk-popup`)],$.prototype,`popupElement`,void 0),r([i()],$.prototype,`open`,void 0),r([i()],$.prototype,`contentAnimated`,void 0),r([i()],$.prototype,`closing`,void 0),r([i()],$.prototype,`contentSide`,void 0),r([i()],$.prototype,`hasSlottedBody`,void 0),$=r([o(`pk-tooltip`)],$);export{lt as a,g as c,dt as i,h as l,ct as n,y as o,mt as r,b as s,Z as t};
//# sourceMappingURL=pk-tooltip-Cmmc0916-DiAah6v3.js.map