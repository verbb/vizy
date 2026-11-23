import{_ as e,c as t,d as n,f as r,h as i,p as a,t as o,u as s,y as c}from"./class-map-BJSU2ntM.js";var l=0;function u(e=`pk`){return l+=1,`${e}-${l}`}var d=class{constructor(e=`polite`){this.element=document.createElement(`div`),this.element.setAttribute(`aria-live`,e),this.element.setAttribute(`aria-atomic`,`true`),this.element.className=`pk-visually-hidden`,this.element.style.cssText=`position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;`,document.body.append(this.element)}announce(e){this.element.textContent=``,requestAnimationFrame(()=>{this.element.textContent=e})}destroy(){this.element.remove()}};function f(e){let t=e.split(`-`)[0];return t===`inline-start`?`left`:t===`inline-end`?`right`:t===`top`||t===`bottom`||t===`left`||t===`right`?t:`bottom`}function p(e,t,n,r,i){let a=f(e),o=t.x+t.width/2-n.x,s=t.y+t.height/2-n.y;return Math.abs(i?.y??0)>r&&(a===`top`||a===`bottom`)?`${o}px ${t.y+t.height/2-n.y}px`:{top:`${o}px calc(100% + ${r}px)`,bottom:`${o}px ${-r}px`,left:`calc(100% + ${r}px) ${s}px`,right:`${-r}px ${s}px`}[a]}function m(e,t){t?e.setAttribute(`data-side`,f(t)):e.removeAttribute(`data-side`)}function h(e,t,n=100,r){let i=()=>e.getAttribute(`data-current-placement`)??t;return!r?.requireEvent&&e.hasAttribute(`data-current-placement`)?Promise.resolve(i()):new Promise(t=>{let a=!1,o=()=>{a||(a=!0,t(i()))};e.addEventListener(`pk-reposition`,o,{once:!0}),r?.requireEvent||requestAnimationFrame(()=>{requestAnimationFrame(()=>{e.hasAttribute(`data-current-placement`)&&o()})}),window.setTimeout(o,n)})}var g=globalThis.HTMLElement!==void 0&&Object.prototype.hasOwnProperty.call(globalThis.HTMLElement.prototype,`popover`),_=Math.min,v=Math.max,y=Math.round,b=Math.floor,x=e=>({x:e,y:e}),S={left:`right`,right:`left`,bottom:`top`,top:`bottom`};function C(e,t,n){return v(e,_(t,n))}function w(e,t){return typeof e==`function`?e(t):e}function T(e){return e.split(`-`)[0]}function E(e){return e.split(`-`)[1]}function D(e){return e===`x`?`y`:`x`}function O(e){return e===`y`?`height`:`width`}function k(e){let t=e[0];return t===`t`||t===`b`?`y`:`x`}function A(e){return D(k(e))}function j(e,t,n){n===void 0&&(n=!1);let r=E(e),i=A(e),a=O(i),o=i===`x`?r===(n?`end`:`start`)?`right`:`left`:r===`start`?`bottom`:`top`;return t.reference[a]>t.floating[a]&&(o=I(o)),[o,I(o)]}function ee(e){let t=I(e);return[M(e),t,M(t)]}function M(e){return e.includes(`start`)?e.replace(`start`,`end`):e.replace(`end`,`start`)}var N=[`left`,`right`],te=[`right`,`left`],P=[`top`,`bottom`],ne=[`bottom`,`top`];function re(e,t,n){switch(e){case`top`:case`bottom`:return n?t?te:N:t?N:te;case`left`:case`right`:return t?P:ne;default:return[]}}function F(e,t,n,r){let i=E(e),a=re(T(e),n===`start`,r);return i&&(a=a.map(e=>e+`-`+i),t&&(a=a.concat(a.map(M)))),a}function I(e){let t=T(e);return S[t]+e.slice(t.length)}function ie(e){return{top:0,right:0,bottom:0,left:0,...e}}function ae(e){return typeof e==`number`?{top:e,right:e,bottom:e,left:e}:ie(e)}function L(e){let{x:t,y:n,width:r,height:i}=e;return{width:r,height:i,top:n,left:t,right:t+r,bottom:n+i,x:t,y:n}}function oe(e,t,n){let{reference:r,floating:i}=e,a=k(t),o=A(t),s=O(o),c=T(t),l=a===`y`,u=r.x+r.width/2-i.width/2,d=r.y+r.height/2-i.height/2,f=r[s]/2-i[s]/2,p;switch(c){case`top`:p={x:u,y:r.y-i.height};break;case`bottom`:p={x:u,y:r.y+r.height};break;case`right`:p={x:r.x+r.width,y:d};break;case`left`:p={x:r.x-i.width,y:d};break;default:p={x:r.x,y:r.y}}switch(E(t)){case`start`:p[o]-=f*(n&&l?-1:1);break;case`end`:p[o]+=f*(n&&l?-1:1)}return p}async function se(e,t){t===void 0&&(t={});let{x:n,y:r,platform:i,rects:a,elements:o,strategy:s}=e,{boundary:c=`clippingAncestors`,rootBoundary:l=`viewport`,elementContext:u=`floating`,altBoundary:d=!1,padding:f=0}=w(t,e),p=ae(f),m=o[d?u===`floating`?`reference`:`floating`:u],h=L(await i.getClippingRect({element:await(i.isElement==null?void 0:i.isElement(m))??!0?m:m.contextElement||await(i.getDocumentElement==null?void 0:i.getDocumentElement(o.floating)),boundary:c,rootBoundary:l,strategy:s})),g=u===`floating`?{x:n,y:r,width:a.floating.width,height:a.floating.height}:a.reference,_=await(i.getOffsetParent==null?void 0:i.getOffsetParent(o.floating)),v=await(i.isElement==null?void 0:i.isElement(_))&&await(i.getScale==null?void 0:i.getScale(_))||{x:1,y:1},y=L(i.convertOffsetParentRelativeRectToViewportRelativeRect?await i.convertOffsetParentRelativeRectToViewportRelativeRect({elements:o,rect:g,offsetParent:_,strategy:s}):g);return{top:(h.top-y.top+p.top)/v.y,bottom:(y.bottom-h.bottom+p.bottom)/v.y,left:(h.left-y.left+p.left)/v.x,right:(y.right-h.right+p.right)/v.x}}var ce=50,le=async(e,t,n)=>{let{placement:r=`bottom`,strategy:i=`absolute`,middleware:a=[],platform:o}=n,s=o.detectOverflow?o:{...o,detectOverflow:se},c=await(o.isRTL==null?void 0:o.isRTL(t)),l=await o.getElementRects({reference:e,floating:t,strategy:i}),{x:u,y:d}=oe(l,r,c),f=r,p=0,m={};for(let n=0;n<a.length;n++){let h=a[n];if(!h)continue;let{name:g,fn:_}=h,{x:v,y,data:b,reset:x}=await _({x:u,y:d,initialPlacement:r,placement:f,strategy:i,middlewareData:m,rects:l,platform:s,elements:{reference:e,floating:t}});u=v??u,d=y??d,m[g]={...m[g],...b},x&&p<ce&&(p++,typeof x==`object`&&(x.placement&&(f=x.placement),x.rects&&(l=x.rects===!0?await o.getElementRects({reference:e,floating:t,strategy:i}):x.rects),{x:u,y:d}=oe(l,f,c)),n=-1)}return{x:u,y:d,placement:f,strategy:i,middlewareData:m}},ue=e=>({name:`arrow`,options:e,async fn(t){let{x:n,y:r,placement:i,rects:a,platform:o,elements:s,middlewareData:c}=t,{element:l,padding:u=0}=w(e,t)||{};if(l==null)return{};let d=ae(u),f={x:n,y:r},p=A(i),m=O(p),h=await o.getDimensions(l),g=p===`y`,v=g?`top`:`left`,y=g?`bottom`:`right`,b=g?`clientHeight`:`clientWidth`,x=a.reference[m]+a.reference[p]-f[p]-a.floating[m],S=f[p]-a.reference[p],T=await(o.getOffsetParent==null?void 0:o.getOffsetParent(l)),D=T?T[b]:0;D&&await(o.isElement==null?void 0:o.isElement(T))||(D=s.floating[b]||a.floating[m]);let k=x/2-S/2,j=D/2-h[m]/2-1,ee=_(d[v],j),M=_(d[y],j),N=ee,te=D-h[m]-M,P=D/2-h[m]/2+k,ne=C(N,P,te),re=!c.arrow&&E(i)!=null&&P!==ne&&a.reference[m]/2-(P<N?ee:M)-h[m]/2<0,F=re?P<N?P-N:P-te:0;return{[p]:f[p]+F,data:{[p]:ne,centerOffset:P-ne-F,...re&&{alignmentOffset:F}},reset:re}}}),de=function(e){return e===void 0&&(e={}),{name:`flip`,options:e,async fn(t){var n;let{placement:r,middlewareData:i,rects:a,initialPlacement:o,platform:s,elements:c}=t,{mainAxis:l=!0,crossAxis:u=!0,fallbackPlacements:d,fallbackStrategy:f=`bestFit`,fallbackAxisSideDirection:p=`none`,flipAlignment:m=!0,...h}=w(e,t);if((n=i.arrow)!=null&&n.alignmentOffset)return{};let g=T(r),_=k(o),v=T(o)===o,y=await(s.isRTL==null?void 0:s.isRTL(c.floating)),b=d||(v||!m?[I(o)]:ee(o)),x=p!==`none`;!d&&x&&b.push(...F(o,m,p,y));let S=[o,...b],C=await s.detectOverflow(t,h),E=[],D=i.flip?.overflows||[];if(l&&E.push(C[g]),u){let e=j(r,a,y);E.push(C[e[0]],C[e[1]])}if(D=[...D,{placement:r,overflows:E}],!E.every(e=>e<=0)){let e=(i.flip?.index||0)+1,t=S[e];if(t&&(u!==`alignment`||_===k(t)||D.every(e=>k(e.placement)!==_||e.overflows[0]>0)))return{data:{index:e,overflows:D},reset:{placement:t}};let n=D.filter(e=>e.overflows[0]<=0).sort((e,t)=>e.overflows[1]-t.overflows[1])[0]?.placement;if(!n)switch(f){case`bestFit`:{let e=D.filter(e=>{if(x){let t=k(e.placement);return t===_||t===`y`}return!0}).map(e=>[e.placement,e.overflows.filter(e=>e>0).reduce((e,t)=>e+t,0)]).sort((e,t)=>e[1]-t[1])[0]?.[0];e&&(n=e);break}case`initialPlacement`:n=o}if(r!==n)return{reset:{placement:n}}}return{}}}},fe=new Set([`left`,`top`]);async function pe(e,t){let{placement:n,platform:r,elements:i}=e,a=await(r.isRTL==null?void 0:r.isRTL(i.floating)),o=T(n),s=E(n),c=k(n)===`y`,l=fe.has(o)?-1:1,u=a&&c?-1:1,d=w(t,e),{mainAxis:f,crossAxis:p,alignmentAxis:m}=typeof d==`number`?{mainAxis:d,crossAxis:0,alignmentAxis:null}:{mainAxis:d.mainAxis||0,crossAxis:d.crossAxis||0,alignmentAxis:d.alignmentAxis};return s&&typeof m==`number`&&(p=s===`end`?m*-1:m),c?{x:p*u,y:f*l}:{x:f*l,y:p*u}}var me=function(e){return e===void 0&&(e=0),{name:`offset`,options:e,async fn(t){var n;let{x:r,y:i,placement:a,middlewareData:o}=t,s=await pe(t,e);return a===o.offset?.placement&&(n=o.arrow)!=null&&n.alignmentOffset?{}:{x:r+s.x,y:i+s.y,data:{...s,placement:a}}}}},he=function(e){return e===void 0&&(e={}),{name:`shift`,options:e,async fn(t){let{x:n,y:r,placement:i,platform:a}=t,{mainAxis:o=!0,crossAxis:s=!1,limiter:c={fn:e=>{let{x:t,y:n}=e;return{x:t,y:n}}},...l}=w(e,t),u={x:n,y:r},d=await a.detectOverflow(t,l),f=k(T(i)),p=D(f),m=u[p],h=u[f];if(o){let e=p===`y`?`top`:`left`,t=p===`y`?`bottom`:`right`,n=m+d[e],r=m-d[t];m=C(n,m,r)}if(s){let e=f===`y`?`top`:`left`,t=f===`y`?`bottom`:`right`,n=h+d[e],r=h-d[t];h=C(n,h,r)}let g=c.fn({...t,[p]:m,[f]:h});return{...g,data:{x:g.x-n,y:g.y-r,enabled:{[p]:o,[f]:s}}}}}},ge=function(e){return e===void 0&&(e={}),{name:`size`,options:e,async fn(t){var n,r;let{placement:i,rects:a,platform:o,elements:s}=t,{apply:c=()=>{},...l}=w(e,t),u=await o.detectOverflow(t,l),d=T(i),f=E(i),p=k(i)===`y`,{width:m,height:h}=a.floating,g,y;d===`top`||d===`bottom`?(g=d,y=f===(await(o.isRTL==null?void 0:o.isRTL(s.floating))?`start`:`end`)?`left`:`right`):(y=d,g=f===`end`?`top`:`bottom`);let b=h-u.top-u.bottom,x=m-u.left-u.right,S=_(h-u[g],b),C=_(m-u[y],x),D=!t.middlewareData.shift,O=S,A=C;if((n=t.middlewareData.shift)!=null&&n.enabled.x&&(A=x),(r=t.middlewareData.shift)!=null&&r.enabled.y&&(O=b),D&&!f){let e=v(u.left,0),t=v(u.right,0),n=v(u.top,0),r=v(u.bottom,0);p?A=m-2*(e!==0||t!==0?e+t:v(u.left,u.right)):O=h-2*(n!==0||r!==0?n+r:v(u.top,u.bottom))}await c({...t,availableWidth:A,availableHeight:O});let j=await o.getDimensions(s.floating);return m!==j.width||h!==j.height?{reset:{rects:!0}}:{}}}};function R(){return typeof window<`u`}function z(e){return _e(e)?(e.nodeName||``).toLowerCase():`#document`}function B(e){var t;return(e==null||(t=e.ownerDocument)==null?void 0:t.defaultView)||window}function V(e){return((_e(e)?e.ownerDocument:e.document)||window.document)?.documentElement}function _e(e){return R()?e instanceof Node||e instanceof B(e).Node:!1}function H(e){return R()?e instanceof Element||e instanceof B(e).Element:!1}function U(e){return R()?e instanceof HTMLElement||e instanceof B(e).HTMLElement:!1}function ve(e){return!R()||typeof ShadowRoot>`u`?!1:e instanceof ShadowRoot||e instanceof B(e).ShadowRoot}function W(e){let{overflow:t,overflowX:n,overflowY:r,display:i}=q(e);return/auto|scroll|overlay|hidden|clip/.test(t+r+n)&&i!==`inline`&&i!==`contents`}function ye(e){return/^(table|td|th)$/.test(z(e))}function be(e){try{if(e.matches(`:popover-open`))return!0}catch{}try{return e.matches(`:modal`)}catch{return!1}}var xe=/transform|translate|scale|rotate|perspective|filter/,Se=/paint|layout|strict|content/,G=e=>!!e&&e!==`none`,Ce;function we(e){let t=H(e)?q(e):e;return G(t.transform)||G(t.translate)||G(t.scale)||G(t.rotate)||G(t.perspective)||!Ee()&&(G(t.backdropFilter)||G(t.filter))||xe.test(t.willChange||``)||Se.test(t.contain||``)}function Te(e){let t=J(e);for(;U(t)&&!K(t);){if(we(t))return t;if(be(t))return null;t=J(t)}return null}function Ee(){return Ce??=typeof CSS<`u`&&CSS.supports&&CSS.supports(`-webkit-backdrop-filter`,`none`),Ce}function K(e){return/^(html|body|#document)$/.test(z(e))}function q(e){return B(e).getComputedStyle(e)}function De(e){return H(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function J(e){if(z(e)===`html`)return e;let t=e.assignedSlot||e.parentNode||ve(e)&&e.host||V(e);return ve(t)?t.host:t}function Oe(e){let t=J(e);return K(t)?e.ownerDocument?e.ownerDocument.body:e.body:U(t)&&W(t)?t:Oe(t)}function Y(e,t,n){t===void 0&&(t=[]),n===void 0&&(n=!0);let r=Oe(e),i=r===e.ownerDocument?.body,a=B(r);if(i){let e=ke(a);return t.concat(a,a.visualViewport||[],W(r)?r:[],e&&n?Y(e):[])}return t.concat(r,Y(r,[],n))}function ke(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function Ae(e){let t=q(e),n=parseFloat(t.width)||0,r=parseFloat(t.height)||0,i=U(e),a=i?e.offsetWidth:n,o=i?e.offsetHeight:r,s=y(n)!==a||y(r)!==o;return s&&(n=a,r=o),{width:n,height:r,$:s}}function je(e){return H(e)?e:e.contextElement}function X(e){let t=je(e);if(!U(t))return x(1);let n=t.getBoundingClientRect(),{width:r,height:i,$:a}=Ae(t),o=(a?y(n.width):n.width)/r,s=(a?y(n.height):n.height)/i;return o&&Number.isFinite(o)||(o=1),s&&Number.isFinite(s)||(s=1),{x:o,y:s}}var Me=x(0);function Ne(e){let t=B(e);return!Ee()||!t.visualViewport?Me:{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}}function Pe(e,t,n){return t===void 0&&(t=!1),!n||t&&n!==B(e)?!1:t}function Z(e,t,n,r){t===void 0&&(t=!1),n===void 0&&(n=!1);let i=e.getBoundingClientRect(),a=je(e),o=x(1);t&&(r?H(r)&&(o=X(r)):o=X(e));let s=Pe(a,n,r)?Ne(a):x(0),c=(i.left+s.x)/o.x,l=(i.top+s.y)/o.y,u=i.width/o.x,d=i.height/o.y;if(a){let e=B(a),t=r&&H(r)?B(r):r,n=e,i=ke(n);for(;i&&r&&t!==n;){let e=X(i),t=i.getBoundingClientRect(),r=q(i),a=t.left+(i.clientLeft+parseFloat(r.paddingLeft))*e.x,o=t.top+(i.clientTop+parseFloat(r.paddingTop))*e.y;c*=e.x,l*=e.y,u*=e.x,d*=e.y,c+=a,l+=o,n=B(i),i=ke(n)}}return L({width:u,height:d,x:c,y:l})}function Fe(e,t){let n=De(e).scrollLeft;return t?t.left+n:Z(V(e)).left+n}function Ie(e,t){let n=e.getBoundingClientRect();return{x:n.left+t.scrollLeft-Fe(e,n),y:n.top+t.scrollTop}}function Le(e){let{elements:t,rect:n,offsetParent:r,strategy:i}=e,a=i===`fixed`,o=V(r),s=t?be(t.floating):!1;if(r===o||s&&a)return n;let c={scrollLeft:0,scrollTop:0},l=x(1),u=x(0),d=U(r);if((d||!d&&!a)&&((z(r)!==`body`||W(o))&&(c=De(r)),d)){let e=Z(r);l=X(r),u.x=e.x+r.clientLeft,u.y=e.y+r.clientTop}let f=o&&!d&&!a?Ie(o,c):x(0);return{width:n.width*l.x,height:n.height*l.y,x:n.x*l.x-c.scrollLeft*l.x+u.x+f.x,y:n.y*l.y-c.scrollTop*l.y+u.y+f.y}}function Re(e){return Array.from(e.getClientRects())}function ze(e){let t=V(e),n=De(e),r=e.ownerDocument.body,i=v(t.scrollWidth,t.clientWidth,r.scrollWidth,r.clientWidth),a=v(t.scrollHeight,t.clientHeight,r.scrollHeight,r.clientHeight),o=-n.scrollLeft+Fe(e),s=-n.scrollTop;return q(r).direction===`rtl`&&(o+=v(t.clientWidth,r.clientWidth)-i),{width:i,height:a,x:o,y:s}}var Be=25;function Ve(e,t){let n=B(e),r=V(e),i=n.visualViewport,a=r.clientWidth,o=r.clientHeight,s=0,c=0;if(i){a=i.width,o=i.height;let e=Ee();(!e||e&&t===`fixed`)&&(s=i.offsetLeft,c=i.offsetTop)}let l=Fe(r);if(l<=0){let e=r.ownerDocument,t=e.body,n=getComputedStyle(t),i=e.compatMode===`CSS1Compat`&&parseFloat(n.marginLeft)+parseFloat(n.marginRight)||0,o=Math.abs(r.clientWidth-t.clientWidth-i);o<=Be&&(a-=o)}else l<=Be&&(a+=l);return{width:a,height:o,x:s,y:c}}function He(e,t){let n=Z(e,!0,t===`fixed`),r=n.top+e.clientTop,i=n.left+e.clientLeft,a=U(e)?X(e):x(1);return{width:e.clientWidth*a.x,height:e.clientHeight*a.y,x:i*a.x,y:r*a.y}}function Ue(e,t,n){let r;if(t===`viewport`)r=Ve(e,n);else if(t===`document`)r=ze(V(e));else if(H(t))r=He(t,n);else{let n=Ne(e);r={x:t.x-n.x,y:t.y-n.y,width:t.width,height:t.height}}return L(r)}function We(e,t){let n=J(e);return n===t||!H(n)||K(n)?!1:q(n).position===`fixed`||We(n,t)}function Ge(e,t){let n=t.get(e);if(n)return n;let r=Y(e,[],!1).filter(e=>H(e)&&z(e)!==`body`),i=null,a=q(e).position===`fixed`,o=a?J(e):e;for(;H(o)&&!K(o);){let t=q(o),n=we(o);!n&&t.position===`fixed`&&(i=null),(a?!n&&!i:!n&&t.position===`static`&&i&&(i.position===`absolute`||i.position===`fixed`)||W(o)&&!n&&We(e,o))?r=r.filter(e=>e!==o):i=t,o=J(o)}return t.set(e,r),r}function Ke(e){let{element:t,boundary:n,rootBoundary:r,strategy:i}=e,a=[...n===`clippingAncestors`?be(t)?[]:Ge(t,this._c):[].concat(n),r],o=Ue(t,a[0],i),s=o.top,c=o.right,l=o.bottom,u=o.left;for(let e=1;e<a.length;e++){let n=Ue(t,a[e],i);s=v(n.top,s),c=_(n.right,c),l=_(n.bottom,l),u=v(n.left,u)}return{width:c-u,height:l-s,x:u,y:s}}function qe(e){let{width:t,height:n}=Ae(e);return{width:t,height:n}}function Je(e,t,n){let r=U(t),i=V(t),a=n===`fixed`,o=Z(e,!0,a,t),s={scrollLeft:0,scrollTop:0},c=x(0);function l(){c.x=Fe(i)}if(r||!r&&!a){if((z(t)!==`body`||W(i))&&(s=De(t)),r){let e=Z(t,!0,a,t);c.x=e.x+t.clientLeft,c.y=e.y+t.clientTop}else i&&l()}a&&!r&&i&&l();let u=i&&!r&&!a?Ie(i,s):x(0);return{x:o.left+s.scrollLeft-c.x-u.x,y:o.top+s.scrollTop-c.y-u.y,width:o.width,height:o.height}}function Ye(e){return q(e).position===`static`}function Xe(e,t){if(!U(e)||q(e).position===`fixed`)return null;if(t)return t(e);let n=e.offsetParent;return V(e)===n&&(n=n.ownerDocument.body),n}function Ze(e,t){let n=B(e);if(be(e))return n;if(!U(e)){let t=J(e);for(;t&&!K(t);){if(H(t)&&!Ye(t))return t;t=J(t)}return n}let r=Xe(e,t);for(;r&&ye(r)&&Ye(r);)r=Xe(r,t);return r&&K(r)&&Ye(r)&&!we(r)?n:r||Te(e)||n}var Qe=async function(e){let t=this.getOffsetParent||Ze,n=this.getDimensions,r=await n(e.floating);return{reference:Je(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:r.width,height:r.height}}};function $e(e){return q(e).direction===`rtl`}var et={convertOffsetParentRelativeRectToViewportRelativeRect:Le,getDocumentElement:V,getClippingRect:Ke,getOffsetParent:Ze,getElementRects:Qe,getClientRects:Re,getDimensions:qe,getScale:X,isElement:H,isRTL:$e};function tt(e,t){return e.x===t.x&&e.y===t.y&&e.width===t.width&&e.height===t.height}function nt(e,t){let n=null,r,i=V(e);function a(){var e;clearTimeout(r),(e=n)==null||e.disconnect(),n=null}function o(s,c){s===void 0&&(s=!1),c===void 0&&(c=1),a();let l=e.getBoundingClientRect(),{left:u,top:d,width:f,height:p}=l;if(s||t(),!f||!p)return;let m=b(d),h=b(i.clientWidth-(u+f)),g=b(i.clientHeight-(d+p)),y=b(u),x={rootMargin:-m+`px `+-h+`px `+-g+`px `+-y+`px`,threshold:v(0,_(1,c))||1},S=!0;function C(t){let n=t[0].intersectionRatio;if(n!==c){if(!S)return o();n?o(!1,n):r=setTimeout(()=>{o(!1,1e-7)},1e3)}n===1&&!tt(l,e.getBoundingClientRect())&&o(),S=!1}try{n=new IntersectionObserver(C,{...x,root:i.ownerDocument})}catch{n=new IntersectionObserver(C,x)}n.observe(e)}return o(!0),a}function rt(e,t,n,r){r===void 0&&(r={});let{ancestorScroll:i=!0,ancestorResize:a=!0,elementResize:o=typeof ResizeObserver==`function`,layoutShift:s=typeof IntersectionObserver==`function`,animationFrame:c=!1}=r,l=je(e),u=i||a?[...l?Y(l):[],...t?Y(t):[]]:[];u.forEach(e=>{i&&e.addEventListener(`scroll`,n,{passive:!0}),a&&e.addEventListener(`resize`,n)});let d=l&&s?nt(l,n):null,f=-1,p=null;o&&(p=new ResizeObserver(e=>{let[r]=e;r&&r.target===l&&p&&t&&(p.unobserve(t),cancelAnimationFrame(f),f=requestAnimationFrame(()=>{var e;(e=p)==null||e.observe(t)})),n()}),l&&!c&&p.observe(l),t&&p.observe(t));let m,h=c?Z(e):null;c&&g();function g(){let t=Z(e);h&&!tt(h,t)&&n(),h=t,m=requestAnimationFrame(g)}return n(),()=>{var e;u.forEach(e=>{i&&e.removeEventListener(`scroll`,n),a&&e.removeEventListener(`resize`,n)}),d?.(),(e=p)==null||e.disconnect(),p=null,c&&cancelAnimationFrame(m)}}var it=me,at=he,ot=de,st=ge,ct=ue,lt=(e,t,n)=>{let r=new Map,i={platform:et,...n},a={...i.platform,_c:r};return le(e,t,{...i,platform:a})};function ut(e){return ft(e)}function dt(e){return e.assignedSlot?e.assignedSlot:e.parentNode instanceof ShadowRoot?e.parentNode.host:e.parentNode}function ft(e){for(let t=e;t;t=dt(t))if(t instanceof Element&&getComputedStyle(t).display===`none`)return null;for(let t=dt(e);t;t=dt(t)){if(!(t instanceof Element))continue;let e=getComputedStyle(t);if(e.display!==`contents`&&(e.position!==`static`||we(e)||t.tagName===`BODY`))return t}return null}function pt(e,t){if(!t)return null;let n=e.getRootNode();if(n instanceof Document||n instanceof ShadowRoot){let e=n.getElementById(t);if(e)return e}return e.ownerDocument.getElementById(t)}var mt=class extends Event{constructor(){super(`pk-reposition`,{bubbles:!0,cancelable:!1,composed:!0})}},ht=c`
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
`;function gt(e){return typeof e==`object`&&!!e&&`getBoundingClientRect`in e}function _t(e){return e||(g?`absolute`:`fixed`)}function vt(e,t){if(g&&!gt(e)&&t===`scroll`)return Y(e).filter(e=>e instanceof Element)}var Q=class extends n{constructor(...e){super(...e),this.anchor=``,this.active=!1,this.boundary=`viewport`,this.placement=`bottom-start`,this.distance=4,this.skidding=0,this.flip=!0,this.flipFallbackPlacements=``,this.flipFallbackStrategy=`best-fit`,this.flipPadding=8,this.shift=!0,this.shiftPadding=8,this.arrow=!1,this.arrowPlacement=`anchor`,this.arrowPadding=10,this.autoSizePadding=8,this.anchorTracking=!0,this.hoverBridge=!1,this.anchorElement=null,this.settlingInitialPosition=!1,this.settleGeneration=0}static{this.styles=ht}disconnectedCallback(){this.stop(),super.disconnectedCallback()}updated(e){super.updated(e),e.has(`active`)&&(this.active?(this.resolveAnchor(),this.start()):this.stop()),e.has(`anchor`)&&this.handleAnchorChange(),this.active&&!e.has(`active`)&&this.reposition()}reposition(){this.settlingInitialPosition||this.repositionAsync()}async repositionAsync(e=!0){let t=this.popupElement,n=this.arrow?this.arrowElement:null;if(!this.active||!this.anchorElement||!t)return!1;let r=vt(this.anchorElement,this.boundary),i=[it({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?i.push(st({apply:({rects:e})=>{let n=this.sync===`width`||this.sync===`both`,r=this.sync===`height`||this.sync===`both`;t.style.width=n?`${e.reference.width}px`:``,t.style.height=r?`${e.reference.height}px`:``}})):(t.style.width=``,t.style.height=``),this.flip&&i.push(ot({boundary:r,fallbackPlacements:this.flipFallbackPlacements?this.flipFallbackPlacements.split(` `).map(e=>e.trim()).filter(Boolean):void 0,fallbackStrategy:this.flipFallbackStrategy===`best-fit`?`bestFit`:`initialPlacement`,padding:this.flipPadding})),this.shift&&i.push(at({boundary:r,padding:this.shiftPadding})),this.autoSize?i.push(st({boundary:r,padding:this.autoSizePadding,apply:({availableHeight:e,availableWidth:n})=>{let r=this.autoSize===`horizontal`||this.autoSize===`both`,i=this.autoSize===`vertical`||this.autoSize===`both`;r?t.style.setProperty(`--pk-popup-available-width`,`${Math.max(0,Math.floor(n))}px`):t.style.removeProperty(`--pk-popup-available-width`),i?t.style.setProperty(`--pk-popup-available-height`,`${Math.max(0,Math.floor(e))}px`):t.style.removeProperty(`--pk-popup-available-height`)}})):(t.style.removeProperty(`--pk-popup-available-width`),t.style.removeProperty(`--pk-popup-available-height`)),this.arrow&&n&&i.push(ct({element:n,padding:this.arrowPadding}));let a=_t(this.positionMethod),o=a===`fixed`;t.classList.toggle(`popup-fixed`,o);let s=g?e=>et.getOffsetParent(e,ut):et.getOffsetParent,{x:c,y:l,middlewareData:u,placement:d}=await lt(this.anchorElement,t,{placement:this.placement,middleware:i,strategy:a,platform:{...et,getOffsetParent:s}});if(!this.active||!t.isConnected)return!1;let f={top:`bottom`,right:`left`,bottom:`top`,left:`right`}[d.split(`-`)[0]];if(this.setAttribute(`data-current-placement`,d),Object.assign(t.style,{left:`${c}px`,top:`${l}px`,...o?{position:`fixed`}:{position:``}}),this.anchorElement){let e=this.anchorElement.getBoundingClientRect(),n=t.getBoundingClientRect();t.style.setProperty(`--pk-anchor-width`,`${e.width}px`),t.style.setProperty(`--pk-anchor-height`,`${e.height}px`);let r=p(d,e,n,this.distance,u.shift);t.style.setProperty(`--pk-transform-origin`,r)}if(this.arrow&&n){let e=u.arrow?.x,t=u.arrow?.y,r=``,i=``,a=``,o=``;if(this.arrowPlacement===`start`){let n=typeof e==`number`?`${this.arrowPadding}px`:``;r=typeof t==`number`?`${this.arrowPadding}px`:``,o=n}else this.arrowPlacement===`end`?(i=typeof e==`number`?`${this.arrowPadding}px`:``,a=typeof t==`number`?`${this.arrowPadding}px`:``):this.arrowPlacement===`center`?(o=typeof e==`number`?`50%`:``,r=typeof t==`number`?`50%`:``):(o=typeof e==`number`?`${e}px`:``,r=typeof t==`number`?`${t}px`:``);Object.assign(n.style,{top:r,right:i,bottom:a,left:o,transform:``,[f]:`calc(-1 * var(--pk-popup-arrow-size, 6px) / 2)`})}return requestAnimationFrame(()=>this.updateHoverBridge()),e&&this.dispatchEvent(new mt),!0}frames(e){return new Promise(t=>{let n=e=>{e<=0?t():requestAnimationFrame(()=>n(e-1))};n(e)})}async settleInitialPosition(){let e=++this.settleGeneration,t=this.popupElement;t?(await this.frames(2),this.active&&e===this.settleGeneration&&(await this.repositionAsync(!1),t.offsetHeight,await this.frames(1),this.active&&e===this.settleGeneration&&(await this.repositionAsync(!1),this.active&&e===this.settleGeneration&&(t.classList.add(`positioned`),this.settlingInitialPosition=!1,requestAnimationFrame(()=>this.updateHoverBridge()),this.dispatchEvent(new mt))))):this.settlingInitialPosition=!1}resolveAnchor(){if(typeof this.anchor==`string`&&this.anchor){this.anchorElement=pt(this,this.anchor);return}if(this.anchor instanceof Element||gt(this.anchor)){this.anchorElement=this.anchor;return}let e=this.querySelector(`[slot="anchor"]`);e instanceof HTMLSlotElement&&(e=e.assignedElements({flatten:!0})[0]??null),this.anchorElement=e}async handleAnchorChange(){await this.stop(),this.resolveAnchor(),this.anchorElement&&this.active&&this.start()}usesPopoverTopLayer(){return g&&this.positionMethod!==`fixed`}stop(){return new Promise(e=>{let t=this.popupElement;this.trackingFrame!==void 0&&cancelAnimationFrame(this.trackingFrame),this.trackingFrame=void 0,this.settleGeneration+=1,this.settlingInitialPosition=!1,t?.classList.remove(`positioned`),this.usesPopoverTopLayer()&&t?.hidePopover?.(),this.cleanup?(this.cleanup(),this.cleanup=void 0,t?.style.removeProperty(`--pk-transform-origin`),requestAnimationFrame(()=>e())):e(),this.removeAttribute(`data-current-placement`)})}releasePositioning(){this.cleanup&&=(this.cleanup(),void 0)}async awaitHidden(){await this.stop()}start(){this.anchorElement&&this.active&&this.isConnected&&this.popupElement&&(this.popupElement.classList.remove(`positioned`),this.settlingInitialPosition=!0,this.usesPopoverTopLayer()&&this.popupElement.showPopover?.(),this.anchorTracking&&(this.cleanup=rt(this.anchorElement,this.popupElement,()=>{this.settlingInitialPosition||(this.trackingFrame!==void 0&&cancelAnimationFrame(this.trackingFrame),this.trackingFrame=requestAnimationFrame(()=>{this.trackingFrame=void 0,this.reposition()}))})),this.settleInitialPosition())}getContentElement(){let e=((this.shadowRoot?.querySelector(`slot:not([name])`))?.assignedElements({flatten:!0})??[]).find(e=>e instanceof HTMLElement);if(e)return e;for(let e of this.childNodes)if(e instanceof HTMLElement&&e.getAttribute(`slot`)!==`anchor`)return e;return null}updateHoverBridge(){let e=this.popupElement;if(!this.hoverBridge||!this.anchorElement||!e)return;let t=this.anchorElement.getBoundingClientRect(),n=e.getBoundingClientRect(),r=this.placement.includes(`top`)||this.placement.includes(`bottom`),i=0,a=0,o=0,s=0,c=0,l=0,u=0,d=0;r?t.top<n.top?(i=t.left,a=t.bottom,o=t.right,s=t.bottom,c=n.left,l=n.top,u=n.right,d=n.top):(i=n.left,a=n.bottom,o=n.right,s=n.bottom,c=t.left,l=t.top,u=t.right,d=t.top):t.left<n.left?(i=t.right,a=t.top,o=n.left,s=n.top,c=t.right,l=t.bottom,u=n.left,d=n.bottom):(i=n.right,a=n.top,o=t.left,s=t.top,c=n.right,l=n.bottom,u=t.left,d=t.bottom),this.style.setProperty(`--pk-hover-bridge-top-left-x`,`${i}px`),this.style.setProperty(`--pk-hover-bridge-top-left-y`,`${a}px`),this.style.setProperty(`--pk-hover-bridge-top-right-x`,`${o}px`),this.style.setProperty(`--pk-hover-bridge-top-right-y`,`${s}px`),this.style.setProperty(`--pk-hover-bridge-bottom-left-x`,`${c}px`),this.style.setProperty(`--pk-hover-bridge-bottom-left-y`,`${l}px`),this.style.setProperty(`--pk-hover-bridge-bottom-right-x`,`${u}px`),this.style.setProperty(`--pk-hover-bridge-bottom-right-y`,`${d}px`)}render(){let t=!g||this.positionMethod===`fixed`,n=this.usesPopoverTopLayer();return e`
            <slot name="anchor" @slotchange=${()=>{this.handleAnchorChange()}}></slot>
            ${this.hoverBridge?e`
                <div
                    part="hover-bridge"
                    class=${o({"hover-bridge":!0,"hover-bridge-visible":this.active})}
                    aria-hidden="true"
                ></div>
            `:i}
            <div
                popover=${n?`manual`:i}
                part="popup"
                class=${o({popup:!0,active:this.active,"popup-fixed":t})}
            >
                ${this.arrow?e`<div part="arrow" class="arrow"></div>`:i}
                <slot></slot>
            </div>
        `}};r([s()],Q.prototype,`anchor`,void 0),r([s({type:Boolean,reflect:!0})],Q.prototype,`active`,void 0),r([s({attribute:`position-method`})],Q.prototype,`positionMethod`,void 0),r([s({reflect:!0})],Q.prototype,`boundary`,void 0),r([s({reflect:!0})],Q.prototype,`placement`,void 0),r([s({type:Number})],Q.prototype,`distance`,void 0),r([s({type:Number})],Q.prototype,`skidding`,void 0),r([s({type:Boolean})],Q.prototype,`flip`,void 0),r([s({attribute:`flip-fallback-placements`})],Q.prototype,`flipFallbackPlacements`,void 0),r([s({attribute:`flip-fallback-strategy`})],Q.prototype,`flipFallbackStrategy`,void 0),r([s({attribute:`flip-padding`,type:Number})],Q.prototype,`flipPadding`,void 0),r([s({type:Boolean})],Q.prototype,`shift`,void 0),r([s({attribute:`shift-padding`,type:Number})],Q.prototype,`shiftPadding`,void 0),r([s({type:Boolean})],Q.prototype,`arrow`,void 0),r([s({attribute:`arrow-placement`})],Q.prototype,`arrowPlacement`,void 0),r([s({attribute:`arrow-padding`,type:Number})],Q.prototype,`arrowPadding`,void 0),r([s()],Q.prototype,`sync`,void 0),r([s({attribute:`auto-size`})],Q.prototype,`autoSize`,void 0),r([s({attribute:`auto-size-padding`,type:Number})],Q.prototype,`autoSizePadding`,void 0),r([s({attribute:`anchor-tracking`,type:Boolean})],Q.prototype,`anchorTracking`,void 0),r([s({attribute:`hover-bridge`,type:Boolean})],Q.prototype,`hoverBridge`,void 0),r([t(`.popup`)],Q.prototype,`popupElement`,void 0),r([t(`.arrow`)],Q.prototype,`arrowElement`,void 0),Q=r([a(`pk-popup`)],Q);var yt=class extends Event{constructor(){super(`pk-show`,{bubbles:!0,cancelable:!1,composed:!0})}},bt=class extends Event{constructor(){super(`pk-after-show`,{bubbles:!0,cancelable:!1,composed:!0})}},xt=class extends Event{constructor(e=`unknown`){super(`pk-hide`,{bubbles:!0,cancelable:!0,composed:!0}),this.detail={source:e}}},St=class extends Event{constructor(){super(`pk-after-hide`,{bubbles:!0,cancelable:!1,composed:!0})}},Ct=c`
    @layer pk-component {
        .pk-popup-content {
            transform-origin: var(--pk-transform-origin, top);
        }

        .pk-popup-content[data-open] {
            animation: pk-popup-content-in 100ms ease-out;
        }

        .pk-popup-content[data-open][data-side='bottom'] {
            animation-name: pk-popup-content-in-bottom;
        }

        .pk-popup-content[data-open][data-side='top'] {
            animation-name: pk-popup-content-in-top;
        }

        .pk-popup-content[data-open][data-side='left'] {
            animation-name: pk-popup-content-in-left;
        }

        .pk-popup-content[data-open][data-side='right'] {
            animation-name: pk-popup-content-in-right;
        }

        /* Exit: fade + zoom only — matches tw-animate animate-out / tooltip motion. */
        .pk-popup-content.closing {
            animation: pk-popup-content-out 100ms ease-in forwards;
        }
    }

    @keyframes pk-popup-content-in {
        from {
            opacity: 0;
            transform: scale(0.95);
        }

        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    @keyframes pk-popup-content-out {
        from {
            opacity: 1;
            transform: scale(1);
        }

        to {
            opacity: 0;
            transform: scale(0.95);
        }
    }

    @keyframes pk-popup-content-in-bottom {
        from {
            opacity: 0;
            transform: scale(0.95) translateY(-0.5rem);
        }

        to {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }

    @keyframes pk-popup-content-in-top {
        from {
            opacity: 0;
            transform: scale(0.95) translateY(0.5rem);
        }

        to {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }

    @keyframes pk-popup-content-in-left {
        from {
            opacity: 0;
            transform: scale(0.95) translateX(0.5rem);
        }

        to {
            opacity: 1;
            transform: scale(1) translateX(0);
        }
    }

    @keyframes pk-popup-content-in-right {
        from {
            opacity: 0;
            transform: scale(0.95) translateX(-0.5rem);
        }

        to {
            opacity: 1;
            transform: scale(1) translateX(0);
        }
    }
`,$=[];function wt(e){$.push(e)}function Tt(e){for(let t=$.length-1;t>=0;--t)if($[t]===e){$.splice(t,1);break}}function Et(e){return $.length>0&&$[$.length-1]===e}function Dt(e){let t=$.lastIndexOf(e);return t===-1?[]:$.slice(t+1)}export{Ct as a,xt as c,f as d,m as f,u as h,Tt as i,yt as l,d as m,Et as n,St as o,h as p,wt as r,bt as s,Dt as t,pt as u};
//# sourceMappingURL=dismissible-stack-D_0W3Azi-CtJhWusr.js.map