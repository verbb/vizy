import{$ as e,A as t,At as n,B as r,Bt as i,C as a,Ct as o,D as s,Dt as c,E as l,Et as u,F as d,Ft as f,G as p,Gt as m,H as h,Ht as g,I as _,It as v,J as y,Jt as b,K as ee,Kt as te,L as ne,Lt as re,M as ie,Mt as ae,N as oe,Nt as se,O as ce,Ot as le,P as ue,Pt as de,Q as fe,Qt as pe,R as me,Rt as he,S as ge,St as _e,T as ve,Tt as ye,U as be,Ut as xe,V as Se,Vt as Ce,W as we,Wt as Te,X as Ee,Xt as De,Y as Oe,Yt as ke,Z as Ae,Zt as x,_ as je,_t as Me,a as Ne,an as Pe,at as Fe,b as Ie,bt as Le,c as Re,ct as ze,d as Be,dt as Ve,en as S,et as He,f as Ue,ft as We,g as C,gt as Ge,h as Ke,ht as qe,i as Je,in as w,it as Ye,j as Xe,jt as Ze,k as Qe,kt as $e,l as et,lt as tt,m as nt,mt as rt,n as it,nn as T,nt as at,o as ot,ot as st,p as ct,pt as lt,q as ut,qt as dt,r as ft,rn as pt,rt as mt,s as ht,st as gt,t as _t,tn as vt,tt as yt,u as bt,ut as xt,v as St,vt as Ct,w as wt,wt as Tt,x as Et,xt as Dt,y as Ot,yt as kt,z as At,zt as jt}from"./floating-ui.dom-BEayZKUV.js";var Mt=Object.defineProperty,Nt=(e,t)=>{let n={};for(var r in e)Mt(n,r,{get:e[r],enumerable:!0});return t||Mt(n,Symbol.toStringTag,{value:`Module`}),n},Pt=(e,t,n)=>(n.configurable=!0,n.enumerable=!0,Reflect.decorate&&typeof t!=`object`&&Object.defineProperty(e,t,n),n);function Ft(e,t){return(n,r,i)=>{let a=t=>t.renderRoot?.querySelector(e)??null;if(t){let{get:e,set:t}=typeof r==`object`?n:i??(()=>{let e=Symbol();return{get(){return this[e]},set(t){this[e]=t}}})();return Pt(n,r,{get(){let n=e.call(this);return n===void 0&&(n=a(this),(n!==null||this.hasUpdated)&&t.call(this,n)),n}})}return Pt(n,r,{get(){return a(this)}})}}var It=Nt({alignCenter:()=>l,alignJustify:()=>s,alignLeft:()=>ce,alignRight:()=>Qe,arrowDown:()=>t,arrowLeft:()=>Xe,arrowRight:()=>ie,arrowRotateLeft:()=>oe,arrowRotateRight:()=>ue,arrowUp:()=>d,arrowUpRightFromSquare:()=>_,arrowsRotate:()=>ne,asterisk:()=>me,bold:()=>At,bracketsCurly:()=>r,calendar:()=>Se,caretDown:()=>h,caretUp:()=>be,check:()=>we,chevronDown:()=>p,chevronLeft:()=>ee,chevronRight:()=>ut,chevronUp:()=>y,circle:()=>Oe,circleCheck:()=>Ee,circleExclamation:()=>Ae,circleInfo:()=>fe,circlePlus:()=>e,clipboard:()=>He,clock:()=>yt,clone:()=>at,code:()=>mt,copy:()=>Ye,download:()=>Fe,ellipsis:()=>st,ellipsisVertical:()=>gt,eye:()=>ze,fileDashedLine:()=>tt,flagCheckered:()=>xt,gear:()=>Ve,getIcon:()=>Ie,getIconNames:()=>Et,gripDots:()=>We,gripDotsVertical:()=>lt,gripMove:()=>rt,h1:()=>qe,h2:()=>Ge,h3:()=>Me,h4:()=>Ct,h5:()=>kt,h6:()=>Le,heading:()=>Dt,highlighter:()=>_e,house:()=>o,iconToSvg:()=>St,iconViewBox:()=>Ot,icons:()=>Tt,italic:()=>ye,lightbulb:()=>u,link:()=>c,list:()=>le,listOl:()=>$e,listUl:()=>n,lock:()=>Ze,magnifyingGlass:()=>ae,minus:()=>se,normalizeIconName:()=>ge,paragraph:()=>de,pen:()=>f,penToSquare:()=>v,plus:()=>re,quoteRight:()=>he,registerIcon:()=>a,registerIcons:()=>wt,share:()=>jt,sliders:()=>i,strikethrough:()=>Ce,subscribeIconRegistry:()=>ve,subscript:()=>g,superscript:()=>xe,table:()=>Te,textSlash:()=>m,trash:()=>te,triangleExclamation:()=>dt,underline:()=>b,xmark:()=>ke}),{I:Lt}=pt,Rt=e=>e,zt=()=>document.createComment(``),Bt=(e,t,n)=>{let r=e._$AA.parentNode,i=t===void 0?e._$AB:t._$AA;if(n===void 0)n=new Lt(r.insertBefore(zt(),i),r.insertBefore(zt(),i),e,e.options);else{let t=n._$AB.nextSibling,a=n._$AM,o=a!==e;if(o){let t;n._$AQ?.(e),n._$AM=e,n._$AP!==void 0&&(t=e._$AU)!==a._$AU&&n._$AP(t)}if(t!==i||o){let e=n._$AA;for(;e!==t;){let t=Rt(e).nextSibling;Rt(r).insertBefore(e,i),e=t}}}return n},Vt=(e,t,n=e)=>(e._$AI(t,n),e),Ht={},Ut=(e,t=Ht)=>e._$AH=t,Wt=e=>e._$AH,Gt=e=>{e._$AR(),e._$AA.remove()},Kt=Ue(class extends ct{constructor(){super(...arguments),this.key=S}render(e,t){return this.key=e,t}update(e,[t,n]){return t!==this.key&&(Ut(e),this.key=t),n}}),qt=(e,t,n)=>{let r=new Map;for(let i=t;i<=n;i++)r.set(e[i],i);return r},Jt=Ue(class extends ct{constructor(e){if(super(e),e.type!==nt.CHILD)throw Error(`repeat() can only be used in text expressions`)}dt(e,t,n){let r;n===void 0?n=t:t!==void 0&&(r=t);let i=[],a=[],o=0;for(let t of e)i[o]=r?r(t,o):o,a[o]=n(t,o),o++;return{values:a,keys:i}}render(e,t,n){return this.dt(e,t,n).values}update(e,[t,n,r]){let i=Wt(e),{values:a,keys:o}=this.dt(t,n,r);if(!Array.isArray(i))return this.ut=o,a;let s=this.ut??=[],c=[],l,u,d=0,f=i.length-1,p=0,m=a.length-1;for(;d<=f&&p<=m;)if(i[d]===null)d++;else if(i[f]===null)f--;else if(s[d]===o[p])c[p]=Vt(i[d],a[p]),d++,p++;else if(s[f]===o[m])c[m]=Vt(i[f],a[m]),f--,m--;else if(s[d]===o[m])c[m]=Vt(i[d],a[m]),Bt(e,c[m+1],i[d]),d++,m--;else if(s[f]===o[p])c[p]=Vt(i[f],a[p]),Bt(e,i[d],i[f]),f--,p++;else if(l===void 0&&(l=qt(o,p,m),u=qt(s,d,f)),l.has(s[d])){if(l.has(s[f])){let t=u.get(o[p]),n=t===void 0?null:i[t];if(n===null){let t=Bt(e,i[d]);Vt(t,a[p]),c[p]=t}else c[p]=Vt(n,a[p]),Bt(e,i[d],n),i[t]=null;p++}else Gt(i[f]),f--}else Gt(i[d]),d++;for(;p<=m;){let t=Bt(e,c[m+1]);Vt(t,a[p]),c[p++]=t}for(;d<=f;){let e=i[d++];e!==null&&Gt(e)}return this.ut=o,Ut(e,c),vt}}),Yt=Symbol.for(`preact-signals`);function Xt(){if($t>1)$t--;else{var e,t=!1;for((function(){var e=rn;for(rn=void 0;e!==void 0;){var t=e.S;if(t.v===e.v)for(var n=t.t;n!==void 0;n=n.x)n.i===e.i&&(n.i=t.i);e=e.o}})();Qt!==void 0;){var n=Qt;for(Qt=void 0,en++;n!==void 0;){var r=n.u;if(n.u=void 0,n.f&=-3,!(8&n.f)&&cn(n))try{n.c()}catch(n){t||=(e=n,!0)}n=r}}if(en=0,$t--,t)throw e}}function E(e){if($t>0)return e();nn=++tn,$t++;try{return e()}finally{Xt()}}var Zt,D=void 0;function O(e){var t=D,n=Zt;D=void 0,Zt=void 0;try{return e()}finally{D=t,Zt=n}}var Qt=void 0,$t=0,en=0,tn=0,nn=0,rn=void 0,an=0;function on(e){if(D!==void 0){var t=e.n;if(t===void 0||t.t!==D)return t={i:0,S:e,p:D.s,n:void 0,t:D,e:void 0,x:void 0,r:t},D.s!==void 0&&(D.s.n=t),D.s=t,e.n=t,32&D.f&&e.S(t),t;if(t.i===-1)return t.i=0,t.n!==void 0&&(t.n.p=t.p,t.p!==void 0&&(t.p.n=t.n),t.p=D.s,t.n=void 0,D.s.n=t,D.s=t),t}}function k(e,t){this.v=e,this.i=0,this.n=void 0,this.t=void 0,this.l=0,this.W=t?.watched,this.Z=t?.unwatched,this.name=t?.name}k.prototype.brand=Yt,k.prototype.h=function(){return!0},k.prototype.S=function(e){var t=this,n=this.t;n!==e&&e.e===void 0&&(e.x=n,this.t=e,n===void 0?O(function(){var e;(e=t.W)==null||e.call(t)}):n.e=e)},k.prototype.U=function(e){var t=this;if(this.t!==void 0){var n=e.e,r=e.x;n!==void 0&&(n.x=r,e.e=void 0),r!==void 0&&(r.e=n,e.x=void 0),e===this.t&&(this.t=r,r===void 0&&O(function(){var e;(e=t.Z)==null||e.call(t)}))}},k.prototype.subscribe=function(e){var t=this;return _n(function(){var n=t.value;O(function(){return e(n)})},{name:`sub`})},k.prototype.valueOf=function(){return this.value},k.prototype.toString=function(){return this.value+``},k.prototype.toJSON=function(){return this.value},k.prototype.peek=function(){var e=this;return O(function(){return e.value})},Object.defineProperty(k.prototype,"value",{get:function(){var e=on(this);return e!==void 0&&(e.i=this.i),this.v},set:function(e){if(e!==this.v){if(en>100)throw Error(`Cycle detected`);(function(e){$t!==0&&en===0&&e.l!==nn&&(e.l=nn,rn={S:e,v:e.v,i:e.i,o:rn})})(this),this.v=e,this.i++,an++,$t++;try{for(var t=this.t;t!==void 0;t=t.x)t.t.N()}finally{Xt()}}}});function sn(e,t){return new k(e,t)}function cn(e){for(var t=e.s;t!==void 0;t=t.n)if(t.S.i!==t.i||!t.S.h()||t.S.i!==t.i)return!0;return!1}function ln(e){for(var t=e.s;t!==void 0;t=t.n){var n=t.S.n;if(n!==void 0&&(t.r=n),t.S.n=t,t.i=-1,t.n===void 0){e.s=t;break}}}function un(e){for(var t=e.s,n=void 0;t!==void 0;){var r=t.p;t.i===-1?(t.S.U(t),r!==void 0&&(r.n=t.n),t.n!==void 0&&(t.n.p=r)):n=t,t.S.n=t.r,t.r!==void 0&&(t.r=void 0),t=r}e.s=n}function dn(e,t){k.call(this,void 0,t),this.x=e,this.s=void 0,this.g=an-1,this.f=4}dn.prototype=new k,dn.prototype.h=function(){if(this.f&=-3,1&this.f)return!1;if((36&this.f)==32||(this.f&=-5,this.g===an))return!0;if(this.g=an,this.f|=1,this.i>0&&!cn(this))return this.f&=-2,!0;var e=D;try{ln(this),D=this;var t=this.x();(16&this.f||this.v!==t||this.i===0)&&(this.v=t,this.f&=-17,this.i++)}catch(e){this.v=e,this.f|=16,this.i++}return D=e,un(this),this.f&=-2,!0},dn.prototype.S=function(e){if(this.t===void 0){this.f|=36;for(var t=this.s;t!==void 0;t=t.n)t.S.S(t)}k.prototype.S.call(this,e)},dn.prototype.U=function(e){if(this.t!==void 0&&(k.prototype.U.call(this,e),this.t===void 0)){this.f&=-33;for(var t=this.s;t!==void 0;t=t.n)t.S.U(t)}},dn.prototype.N=function(){if(!(2&this.f)){this.f|=6;for(var e=this.t;e!==void 0;e=e.x)e.t.N()}},Object.defineProperty(dn.prototype,"value",{get:function(){if(1&this.f)throw Error(`Cycle detected`);var e=on(this);if(this.h(),e!==void 0&&(e.i=this.i),16&this.f)throw this.v;return this.v}});function fn(e,t){return new dn(e,t)}function pn(e){var t=e.m;if(e.m=void 0,typeof t==`function`){$t++;var n=D;D=void 0;try{t()}catch(t){throw e.f&=-2,e.f|=8,mn(e),t}finally{D=n,Xt()}}}function mn(e){for(var t=e.s;t!==void 0;t=t.n)t.S.U(t);e.x=void 0,e.s=void 0,pn(e)}function hn(e){if(D!==this)throw Error(`Out-of-order effect`);un(this),D=e,this.f&=-2,8&this.f&&mn(this),Xt()}function gn(e,t){this.x=e,this.m=void 0,this.s=void 0,this.u=void 0,this.f=32,this.name=t?.name,Zt&&Zt.push(this)}gn.prototype.c=function(){var e=this.S();try{if(8&this.f||this.x===void 0)return;var t=this.x();typeof t==`function`&&(this.m=t)}finally{e()}},gn.prototype.S=function(){if(1&this.f)throw Error(`Cycle detected`);this.f|=1,this.f&=-9,pn(this),ln(this),$t++;var e=D;return D=this,hn.bind(this,e)},gn.prototype.N=function(){2&this.f||(this.f|=2,this.u=Qt,Qt=this)},gn.prototype.d=function(){this.f|=8,1&this.f||mn(this)},gn.prototype.dispose=function(){this.d()};function _n(e,t){var n=new gn(e,t);try{n.c()}catch(e){throw n.d(),e}var r=n.d.bind(n);return r[Symbol.dispose]=r,r}var vn=Object.create,yn=Object.defineProperty,bn=Object.defineProperties,xn=Object.getOwnPropertyDescriptor,Sn=Object.getOwnPropertyDescriptors,Cn=Object.getOwnPropertySymbols,wn=Object.prototype.hasOwnProperty,Tn=Object.prototype.propertyIsEnumerable,En=(e,t)=>(t=Symbol[e])?t:Symbol.for(`Symbol.`+e),Dn=e=>{throw TypeError(e)},On=(e,t,n)=>t in e?yn(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,kn=(e,t)=>{for(var n in t||={})wn.call(t,n)&&On(e,n,t[n]);if(Cn)for(var n of Cn(t))Tn.call(t,n)&&On(e,n,t[n]);return e},An=(e,t)=>bn(e,Sn(t)),jn=(e,t)=>yn(e,`name`,{value:t,configurable:!0}),Mn=e=>[,,,vn(e?.[En(`metadata`)]??null)],Nn=[`class`,`method`,`getter`,`setter`,`accessor`,`field`,`value`,`get`,`set`],Pn=e=>e!==void 0&&typeof e!=`function`?Dn(`Function expected`):e,Fn=(e,t,n,r,i)=>({kind:Nn[e],name:t,metadata:r,addInitializer:e=>n._?Dn(`Already initialized`):i.push(Pn(e||null))}),In=(e,t)=>On(t,En(`metadata`),e[3]),Ln=(e,t,n,r)=>{for(var i=0,a=e[t>>1],o=a&&a.length;i<o;i++)t&1?a[i].call(n):r=a[i].call(n,r);return r},Rn=(e,t,n,r,i,a)=>{var o,s,c,l,u,d=t&7,f=!!(t&8),p=!!(t&16),m=d>3?e.length+1:d?f?1:2:0,h=Nn[d+5],g=d>3&&(e[m-1]=[]),_=e[m]||(e[m]=[]),v=d&&(!p&&!f&&(i=i.prototype),d<5&&(d>3||!p)&&xn(d<4?i:{get[n](){return Vn(this,a)},set[n](e){return Un(this,a,e)}},n));d?p&&d<4&&jn(a,(d>2?`set `:d>1?`get `:``)+n):jn(i,n);for(var y=r.length-1;y>=0;y--)l=Fn(d,n,c={},e[3],_),d&&(l.static=f,l.private=p,u=l.access={has:p?e=>Bn(i,e):e=>n in e},d^3&&(u.get=p?e=>(d^1?Vn:Wn)(e,i,d^4?a:v.get):e=>e[n]),d>2&&(u.set=p?(e,t)=>Un(e,i,t,d^4?a:v.set):(e,t)=>e[n]=t)),s=(0,r[y])(d?d<4?p?a:v[h]:d>4?void 0:{get:v.get,set:v.set}:i,l),c._=1,d^4||s===void 0?Pn(s)&&(d>4?g.unshift(s):d?p?a=s:v[h]=s:i=s):typeof s!=`object`||!s?Dn(`Object expected`):(Pn(o=s.get)&&(v.get=o),Pn(o=s.set)&&(v.set=o),Pn(o=s.init)&&g.unshift(o));return d||In(e,i),v&&yn(i,n,v),p?d^4?a:v:i},zn=(e,t,n)=>t.has(e)||Dn(`Cannot `+n),Bn=(e,t)=>Object(t)===t?e.has(t):Dn(`Cannot use the "in" operator on this value`),Vn=(e,t,n)=>(zn(e,t,`read from private field`),n?n.call(e):t.get(e)),Hn=(e,t,n)=>t.has(e)?Dn(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),Un=(e,t,n,r)=>(zn(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),Wn=(e,t,n)=>(zn(e,t,`access private method`),n);function Gn(e,t){if(t){let n;return fn(()=>{let r=e();return r&&n&&t(n,r)?n:(n=r,r)})}return fn(e)}function Kn(e,t){if(Object.is(e,t))return!0;if(e===null||t===null)return!1;if(typeof e==`function`&&typeof t==`function`)return e===t;if(e instanceof Set&&t instanceof Set){if(e.size!==t.size)return!1;for(let n of e)if(!t.has(n))return!1;return!0}if(Array.isArray(e))return!Array.isArray(t)||e.length!==t.length?!1:!e.some((e,n)=>!Kn(e,t[n]));if(typeof e==`object`&&typeof t==`object`){let n=Object.keys(e),r=Object.keys(t);return n.length===r.length&&!n.some(n=>!Kn(e[n],t[n]))}return!1}function A({get:e},t){return{init(e){return sn(e)},get(){return e.call(this).value},set(t){let n=e.call(this);n.peek()!==t&&(n.value=t)}}}function j(e,t){let n=new WeakMap;return function(){let t=n.get(this);return t||(t=Gn(e.bind(this)),n.set(this,t)),t.value}}function qn(e=!0){return function(t,n){n.addInitializer(function(){let t=n.kind===`field`||n.static?this:Object.getPrototypeOf(this),r=Object.getOwnPropertyDescriptor(t,n.name);r&&Object.defineProperty(t,n.name,An(kn({},r),{enumerable:e}))})}}function Jn(...e){let t=e.map(e=>_n(e));return()=>t.forEach(e=>e())}var Yn,Xn,Zn,Qn,$n,er=[A],M,tr,nr,rr,ir,N,ar,or,sr,cr,lr,ur,dr,fr;$n=[A],Qn=[A],Zn=[qn()],Xn=[qn()],Yn=[qn()];var pr=class{constructor(e,t=Object.is){this.defaultValue=e,this.equals=t,Ln(M,5,this),Hn(this,N),Hn(this,tr,Ln(M,8,this)),Ln(M,11,this),Hn(this,ar,Ln(M,12,this)),Ln(M,15,this),Hn(this,lr,Ln(M,16,this)),Ln(M,19,this),this.reset=this.reset.bind(this),this.reset()}get current(){return Vn(this,N,dr)}get initial(){return Vn(this,N,rr)}get previous(){return Vn(this,N,sr)}set current(e){let t=O(()=>Vn(this,N,dr));e&&t&&this.equals(t,e)||E(()=>{Vn(this,N,rr)||Un(this,N,e,ir),Un(this,N,t,cr),Un(this,N,e,fr)})}reset(e=this.defaultValue){E(()=>{Un(this,N,void 0,cr),Un(this,N,e,ir),Un(this,N,e,fr)})}};M=Mn(null),tr=new WeakMap,N=new WeakSet,ar=new WeakMap,lr=new WeakMap,nr=Rn(M,20,`#initial`,er,N,tr),rr=nr.get,ir=nr.set,or=Rn(M,20,`#previous`,$n,N,ar),sr=or.get,cr=or.set,ur=Rn(M,20,`#current`,Qn,N,lr),dr=ur.get,fr=ur.set,Rn(M,2,`current`,Zn,pr),Rn(M,2,`initial`,Xn,pr),Rn(M,2,`previous`,Yn,pr),In(M,pr);function mr(e){return O(()=>{let t={};for(let n in e)t[n]=e[n];return t})}var hr,gr=class{constructor(){Hn(this,hr,new WeakMap)}get(e,t){return e?Vn(this,hr).get(e)?.get(t):void 0}set(e,t,n){if(e)return Vn(this,hr).has(e)||Vn(this,hr).set(e,new Map),Vn(this,hr).get(e)?.set(t,n)}clear(e){return e?Vn(this,hr).get(e)?.clear():void 0}};hr=new WeakMap;var _r=Object.create,vr=Object.defineProperty,yr=Object.getOwnPropertyDescriptor,br=Object.getOwnPropertySymbols,xr=Object.prototype.hasOwnProperty,Sr=Object.prototype.propertyIsEnumerable,Cr=(e,t)=>(t=Symbol[e])?t:Symbol.for(`Symbol.`+e),wr=e=>{throw TypeError(e)},Tr=Math.pow,Er=(e,t,n)=>t in e?vr(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,Dr=(e,t)=>{for(var n in t||={})xr.call(t,n)&&Er(e,n,t[n]);if(br)for(var n of br(t))Sr.call(t,n)&&Er(e,n,t[n]);return e},Or=(e,t)=>vr(e,`name`,{value:t,configurable:!0}),kr=e=>[,,,_r(e?.[Cr(`metadata`)]??null)],Ar=[`class`,`method`,`getter`,`setter`,`accessor`,`field`,`value`,`get`,`set`],jr=e=>e!==void 0&&typeof e!=`function`?wr(`Function expected`):e,Mr=(e,t,n,r,i)=>({kind:Ar[e],name:t,metadata:r,addInitializer:e=>n._?wr(`Already initialized`):i.push(jr(e||null))}),Nr=(e,t)=>Er(t,Cr(`metadata`),e[3]),Pr=(e,t,n,r)=>{for(var i=0,a=e[t>>1],o=a&&a.length;i<o;i++)t&1?a[i].call(n):r=a[i].call(n,r);return r},Fr=(e,t,n,r,i,a)=>{var o,s,c,l,u,d=t&7,f=!!(t&8),p=!!(t&16),m=d>3?e.length+1:d?f?1:2:0,h=Ar[d+5],g=d>3&&(e[m-1]=[]),_=e[m]||(e[m]=[]),v=d&&(!p&&!f&&(i=i.prototype),d<5&&(d>3||!p)&&yr(d<4?i:{get[n](){return Rr(this,a)},set[n](e){return Br(this,a,e)}},n));d?p&&d<4&&Or(a,(d>2?`set `:d>1?`get `:``)+n):Or(i,n);for(var y=r.length-1;y>=0;y--)l=Mr(d,n,c={},e[3],_),d&&(l.static=f,l.private=p,u=l.access={has:p?e=>Lr(i,e):e=>n in e},d^3&&(u.get=p?e=>(d^1?Rr:Vr)(e,i,d^4?a:v.get):e=>e[n]),d>2&&(u.set=p?(e,t)=>Br(e,i,t,d^4?a:v.set):(e,t)=>e[n]=t)),s=(0,r[y])(d?d<4?p?a:v[h]:d>4?void 0:{get:v.get,set:v.set}:i,l),c._=1,d^4||s===void 0?jr(s)&&(d>4?g.unshift(s):d?p?a=s:v[h]=s:i=s):typeof s!=`object`||!s?wr(`Object expected`):(jr(o=s.get)&&(v.get=o),jr(o=s.set)&&(v.set=o),jr(o=s.init)&&g.unshift(o));return d||Nr(e,i),v&&vr(i,n,v),p?d^4?a:v:i},Ir=(e,t,n)=>t.has(e)||wr(`Cannot `+n),Lr=(e,t)=>Object(t)===t?e.has(t):wr(`Cannot use the "in" operator on this value`),Rr=(e,t,n)=>(Ir(e,t,`read from private field`),n?n.call(e):t.get(e)),zr=(e,t,n)=>t.has(e)?wr(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),Br=(e,t,n,r)=>(Ir(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),Vr=(e,t,n)=>(Ir(e,t,`access private method`),n),Hr=class e{constructor(e,t){this.x=e,this.y=t}static delta(t,n){return new e(t.x-n.x,t.y-n.y)}static distance(e,t){return Math.hypot(e.x-t.x,e.y-t.y)}static equals(e,t){return e.x===t.x&&e.y===t.y}static from({x:t,y:n}){return new e(t,n)}},Ur=class e{constructor(e,t,n,r){this.left=e,this.top=t,this.width=n,this.height=r,this.scale={x:1,y:1}}get inverseScale(){return{x:1/this.scale.x,y:1/this.scale.y}}translate(t,n){let{top:r,left:i,width:a,height:o,scale:s}=this,c=new e(i+t,r+n,a,o);return c.scale=Dr({},s),c}get boundingRectangle(){let{width:e,height:t,left:n,top:r,right:i,bottom:a}=this;return{width:e,height:t,left:n,top:r,right:i,bottom:a}}get center(){let{left:e,top:t,right:n,bottom:r}=this;return new Hr((e+n)/2,(t+r)/2)}get area(){let{width:e,height:t}=this;return e*t}equals(t){if(!(t instanceof e))return!1;let{left:n,top:r,width:i,height:a}=this;return n===t.left&&r===t.top&&i===t.width&&a===t.height}containsPoint(e){let{top:t,left:n,bottom:r,right:i}=this;return t<=e.y&&e.y<=r&&n<=e.x&&e.x<=i}intersectionArea(t){return t instanceof e?Wr(this,t):0}intersectionRatio(e){let{area:t}=this,n=this.intersectionArea(e);return n/(e.area+t-n)}get bottom(){let{top:e,height:t}=this;return e+t}get right(){let{left:e,width:t}=this;return e+t}get aspectRatio(){let{width:e,height:t}=this;return e/t}get corners(){return[{x:this.left,y:this.top},{x:this.right,y:this.top},{x:this.left,y:this.bottom},{x:this.right,y:this.bottom}]}static from({top:t,left:n,width:r,height:i}){return new e(n,t,r,i)}static delta(e,t,n={x:`center`,y:`center`}){let r=(e,t)=>{let r=n[t],i=t===`x`?e.left:e.top,a=t===`x`?e.width:e.height;return r==`start`?i:r==`end`?i+a:i+a/2};return Hr.delta({x:r(e,`x`),y:r(e,`y`)},{x:r(t,`x`),y:r(t,`y`)})}static intersectionRatio(t,n){return e.from(t).intersectionRatio(e.from(n))}};function Wr(e,t){let n=Math.max(t.top,e.top),r=Math.max(t.left,e.left),i=Math.min(t.left+t.width,e.left+e.width),a=Math.min(t.top+t.height,e.top+e.height),o=i-r,s=a-n;return r<i&&n<a?o*s:0}var Gr,Kr,qr,Jr,Yr,Xr=class extends (qr=pr,Kr=[j],Gr=[j],qr){constructor(e){let t=Hr.from(e);super(t,(e,t)=>Hr.equals(e,t)),Pr(Yr,5,this),zr(this,Jr,0),this.velocity={x:0,y:0}}get delta(){return Hr.delta(this.current,this.initial)}get direction(){let{current:e,previous:t}=this;if(!t)return null;let n={x:e.x-t.x,y:e.y-t.y};return!n.x&&!n.y?null:Math.abs(n.x)>Math.abs(n.y)?n.x>0?`right`:`left`:n.y>0?`down`:`up`}get current(){return super.current}set current(e){let{current:t}=this,n=Hr.from(e),r={x:n.x-t.x,y:n.y-t.y},i=Date.now(),a=i-Rr(this,Jr),o=e=>Math.round(e/a*100);E(()=>{Br(this,Jr,i),this.velocity={x:o(r.x),y:o(r.y)},super.current=n})}reset(e=this.defaultValue){super.reset(Hr.from(e)),this.velocity={x:0,y:0}}};Yr=kr(qr),Jr=new WeakMap,Fr(Yr,2,`delta`,Kr,Xr),Fr(Yr,2,`direction`,Gr,Xr),Nr(Yr,Xr);function Zr({x:e,y:t},n){let r=Math.abs(e),i=Math.abs(t);return typeof n==`number`?Math.sqrt(Tr(r,2)+Tr(i,2))>n:`x`in n&&`y`in n?r>n.x&&i>n.y:`x`in n?r>n.x:`y`in n&&i>n.y}var Qr=(e=>(e.Horizontal=`x`,e.Vertical=`y`,e))(Qr||{}),$r=Object.values(Qr),ei=Object.create,ti=Object.defineProperty,ni=Object.defineProperties,ri=Object.getOwnPropertyDescriptor,ii=Object.getOwnPropertyDescriptors,ai=Object.getOwnPropertySymbols,oi=Object.prototype.hasOwnProperty,si=Object.prototype.propertyIsEnumerable,ci=(e,t)=>(t=Symbol[e])?t:Symbol.for(`Symbol.`+e),li=e=>{throw TypeError(e)},ui=(e,t,n)=>t in e?ti(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,di=(e,t)=>{for(var n in t||={})oi.call(t,n)&&ui(e,n,t[n]);if(ai)for(var n of ai(t))si.call(t,n)&&ui(e,n,t[n]);return e},fi=(e,t)=>ni(e,ii(t)),pi=(e,t)=>ti(e,`name`,{value:t,configurable:!0}),mi=(e,t)=>{var n={};for(var r in e)oi.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&ai)for(var r of ai(e))t.indexOf(r)<0&&si.call(e,r)&&(n[r]=e[r]);return n},hi=e=>[,,,ei(e?.[ci(`metadata`)]??null)],gi=[`class`,`method`,`getter`,`setter`,`accessor`,`field`,`value`,`get`,`set`],_i=e=>e!==void 0&&typeof e!=`function`?li(`Function expected`):e,vi=(e,t,n,r,i)=>({kind:gi[e],name:t,metadata:r,addInitializer:e=>n._?li(`Already initialized`):i.push(_i(e||null))}),yi=(e,t)=>ui(t,ci(`metadata`),e[3]),P=(e,t,n,r)=>{for(var i=0,a=e[t>>1],o=a&&a.length;i<o;i++)t&1?a[i].call(n):r=a[i].call(n,r);return r},F=(e,t,n,r,i,a)=>{var o,s,c,l,u,d=t&7,f=!!(t&8),p=!!(t&16),m=d>3?e.length+1:d?f?1:2:0,h=gi[d+5],g=d>3&&(e[m-1]=[]),_=e[m]||(e[m]=[]),v=d&&(!p&&!f&&(i=i.prototype),d<5&&(d>3||!p)&&ri(d<4?i:{get[n](){return I(this,a)},set[n](e){return Si(this,a,e)}},n));d?p&&d<4&&pi(a,(d>2?`set `:d>1?`get `:``)+n):pi(i,n);for(var y=r.length-1;y>=0;y--)l=vi(d,n,c={},e[3],_),d&&(l.static=f,l.private=p,u=l.access={has:p?e=>xi(i,e):e=>n in e},d^3&&(u.get=p?e=>(d^1?I:Ci)(e,i,d^4?a:v.get):e=>e[n]),d>2&&(u.set=p?(e,t)=>Si(e,i,t,d^4?a:v.set):(e,t)=>e[n]=t)),s=(0,r[y])(d?d<4?p?a:v[h]:d>4?void 0:{get:v.get,set:v.set}:i,l),c._=1,d^4||s===void 0?_i(s)&&(d>4?g.unshift(s):d?p?a=s:v[h]=s:i=s):typeof s!=`object`||!s?li(`Object expected`):(_i(o=s.get)&&(v.get=o),_i(o=s.set)&&(v.set=o),_i(o=s.init)&&g.unshift(o));return d||yi(e,i),v&&ti(i,n,v),p?d^4?a:v:i},bi=(e,t,n)=>t.has(e)||li(`Cannot `+n),xi=(e,t)=>Object(t)===t?e.has(t):li(`Cannot use the "in" operator on this value`),I=(e,t,n)=>(bi(e,t,`read from private field`),n?n.call(e):t.get(e)),L=(e,t,n)=>t.has(e)?li(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),Si=(e,t,n,r)=>(bi(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),Ci=(e,t,n)=>(bi(e,t,`access private method`),n);function wi(e,t){return{plugin:e,options:t}}function Ti(e){return t=>wi(e,t)}function Ei(e){return typeof e==`function`?{plugin:e,options:void 0}:e}var Di=[A],Oi,ki,Ai,R=class{constructor(e,t){this.manager=e,this.options=t,L(this,ki,P(Oi,8,this,!1)),P(Oi,11,this),L(this,Ai,new Set)}enable(){this.disabled=!1}disable(){this.disabled=!0}isDisabled(){return O(()=>this.disabled)}configure(e){this.options=e}registerEffect(e){let t=_n(e.bind(this));return I(this,Ai).add(t),t}destroy(){I(this,Ai).forEach(e=>e())}static configure(e){return wi(this,e)}};Oi=hi(null),ki=new WeakMap,Ai=new WeakMap,F(Oi,4,`disabled`,Di,R,ki),yi(Oi,R);var ji=class extends R{},Mi,Ni=class{constructor(e){this.manager=e,this.instances=new Map,L(this,Mi,[])}get values(){return Array.from(this.instances.values())}set values(e){let t=e.map(Ei).reduce((e,t)=>{let n=e.find(({plugin:e})=>e===t.plugin);return n?(n.options=t.options,e):[...e,t]},[]),n=t.map(({plugin:e})=>e);for(let e of I(this,Mi))if(!n.includes(e)){if(e.prototype instanceof ji)continue;this.unregister(e)}for(let{plugin:e,options:n}of t)this.register(e,n);Si(this,Mi,n)}get(e){return this.instances.get(e)}register(e,t){let n=this.instances.get(e);if(n)return n.options!==t&&(n.options=t),n;let r=new e(this.manager,t);return this.instances.set(e,r),r}unregister(e){let t=this.instances.get(e);t&&(t.destroy(),this.instances.delete(e))}destroy(){for(let e of this.instances.values())e.destroy();this.instances.clear()}};Mi=new WeakMap;function Pi(e,t){return e.priority===t.priority?e.type===t.type?t.value-e.value:t.type-e.type:t.priority-e.priority}var Fi=[],Ii,Li,Ri=class extends R{constructor(e){super(e),L(this,Ii),L(this,Li),this.computeCollisions=this.computeCollisions.bind(this),Si(this,Li,sn(Fi)),this.destroy=Jn(()=>{let e=this.computeCollisions(),t=O(()=>this.manager.dragOperation.position.current);if(e!==Fi){let e=I(this,Ii);if(Si(this,Ii,t),e&&t.x==e.x&&t.y==e.y)return}else Si(this,Ii,void 0);I(this,Li).value=e},()=>{let{dragOperation:e}=this.manager;e.status.initialized&&this.forceUpdate()})}forceUpdate(e=!0){O(()=>{e?I(this,Li).value=this.computeCollisions():Si(this,Ii,void 0)})}computeCollisions(e,t){let{registry:n,dragOperation:r}=this.manager,{source:i,shape:a,status:o}=r;if(!o.initialized||!a)return Fi;let s=[],c=[];for(let a of e??n.droppables){if(a.disabled||i&&!a.accepts(i))continue;let e=t??a.collisionDetector;if(!e)continue;c.push(a),a.shape;let n=O(()=>e({droppable:a,dragOperation:r}));n&&(a.collisionPriority!=null&&(n.priority=a.collisionPriority),s.push(n))}return c.length===0?Fi:(s.sort(Pi),s)}get collisions(){return I(this,Li).value}};Ii=new WeakMap,Li=new WeakMap;var zi,Bi,Vi=[A],Hi,Ui,Wi,Gi,Ki,qi,Ji;Bi=[A],zi=[A];var Yi=class e{constructor(e,t){L(this,Gi,P(Wi,8,this)),P(Wi,11,this),L(this,Ki),L(this,qi,P(Wi,12,this)),P(Wi,15,this),L(this,Ji,P(Wi,16,this)),P(Wi,19,this);let{effects:n,id:r,data:i={},disabled:a=!1,register:o=!0}=e,s=r;Si(this,Ki,sn(r)),this.manager=t,this.data=i,this.disabled=a,this.effects=()=>[()=>{let{id:e,manager:t}=this;if(e!==s)return s=e,t?.registry.register(this),()=>t?.registry.unregister(this)},...n?.()??[]],this.register=this.register.bind(this),this.unregister=this.unregister.bind(this),this.destroy=this.destroy.bind(this),t&&o&&queueMicrotask(this.register)}get id(){let t=I(this,Ki).value;return e.pendingIdChanges?.get(this)??t}set id(t){t!==(e.pendingIdChanges?.get(this)??I(this,Ki).peek())&&(e.pendingIdChanges||(e.pendingIdChanges=new Map,queueMicrotask(()=>{var t;return Ci(t=e,Hi,Ui).call(t)})),e.pendingIdChanges.set(this,t))}register(){return this.manager?.registry.register(this)}unregister(){var e;(e=this.manager)==null||e.registry.unregister(this)}destroy(){var e;(e=this.manager)==null||e.registry.unregister(this)}};Wi=hi(null),Hi=new WeakSet,Ui=function(){let e=Yi.pendingIdChanges;Yi.pendingIdChanges=null,e&&E(()=>{for(let[t,n]of e)I(t,Ki).value=n})},Gi=new WeakMap,Ki=new WeakMap,qi=new WeakMap,Ji=new WeakMap,F(Wi,4,`manager`,Vi,Yi,Gi),F(Wi,4,`data`,Bi,Yi,qi),F(Wi,4,`disabled`,zi,Yi,Ji),L(Yi,Hi),yi(Wi,Yi),Yi.pendingIdChanges=null;var Xi=Yi,Zi=class{constructor(){this.map=sn(new Map),this.cleanupFunctions=new WeakMap,this.register=(e,t)=>{let n=this.map.peek(),r=n.get(e),i=()=>this.unregister(e,t);if(r===t)return i;r&&r.id===e&&(this.cleanupFunctions.get(r)?.(),this.cleanupFunctions.delete(r));let a=new Map(n);for(let[r,i]of n)if(i===t&&r!==e){a.delete(r);break}a.set(e,t),this.map.value=a;let o=Jn(...t.effects());return this.cleanupFunctions.set(t,o),i},this.unregister=(e,t)=>{let n=this.map.peek();if(n.get(e)!==t)return;this.cleanupFunctions.get(t)?.(),this.cleanupFunctions.delete(t);let r=new Map(n);r.delete(e),this.map.value=r}}[Symbol.iterator](){return this.map.peek().values()}get value(){return this.map.value.values()}has(e){return this.map.value.has(e)}get(e){return this.map.value.get(e)}destroy(){for(let e of this)this.cleanupFunctions.get(e)?.(),e.destroy();this.map.value=new Map}},Qi,$i,ea,ta,na,ra,ia,z,aa,oa,sa,ca=class extends (ia=Xi,ra=[A],na=[A],ta=[A],ea=[j],$i=[j],Qi=[j],ia){constructor(e,t){var n=e,{modifiers:r,type:i,sensors:a,plugins:o,effects:s}=n,c=mi(n,[`modifiers`,`type`,`sensors`,`plugins`,`effects`]);super(fi(di({},c),{effects:()=>[...s?.()??[],()=>{let{manager:e,plugins:t}=this;if(!(!e||!t))for(let n of t){let{plugin:t}=Ei(n);e.registry.plugins.register(t)}}]}),t),P(z,5,this),L(this,aa,P(z,8,this)),P(z,11,this),L(this,oa,P(z,12,this)),P(z,15,this),L(this,sa,P(z,16,this,this.isDragSource?`dragging`:`idle`)),P(z,19,this),this.type=i,this.sensors=a,this.modifiers=r,this.alignment=c.alignment,this.plugins=o}pluginConfig(e){if(this.plugins)for(let t of this.plugins){let n=Ei(t);if(n.plugin===e)return n.options}}get isDropping(){return this.status===`dropping`&&this.isDragSource}get isDragging(){return this.status===`dragging`&&this.isDragSource}get isDragSource(){return this.manager?.dragOperation.source?.id===this.id}};z=hi(ia),aa=new WeakMap,oa=new WeakMap,sa=new WeakMap,F(z,4,`type`,ra,ca,aa),F(z,4,`modifiers`,na,ca,oa),F(z,4,`status`,ta,ca,sa),F(z,2,`isDropping`,ea,ca),F(z,2,`isDragging`,$i,ca),F(z,2,`isDragSource`,Qi,ca),yi(z,ca);var la,ua,da,fa,pa,ma,ha,B,ga,_a,va,ya,ba,xa=class extends (ha=Xi,ma=[A],pa=[A],fa=[A],da=[A],ua=[A],la=[j],ha){constructor(e,t){var n=e,{accept:r,collisionDetector:i,collisionPriority:a,type:o}=n,s=mi(n,[`accept`,`collisionDetector`,`collisionPriority`,`type`]);super(s,t),P(B,5,this),L(this,ga,P(B,8,this)),P(B,11,this),L(this,_a,P(B,12,this)),P(B,15,this),L(this,va,P(B,16,this)),P(B,19,this),L(this,ya,P(B,20,this)),P(B,23,this),L(this,ba,P(B,24,this)),P(B,27,this),this.accept=r,this.collisionDetector=i,this.collisionPriority=a,this.type=o}accepts(e){let{accept:t}=this;return t?typeof t==`function`?t(e):e.type?Array.isArray(t)?t.includes(e.type):e.type===t:!1:!0}get isDropTarget(){return this.manager?.dragOperation.target?.id===this.id}};B=hi(ha),ga=new WeakMap,_a=new WeakMap,va=new WeakMap,ya=new WeakMap,ba=new WeakMap,F(B,4,`accept`,ma,xa,ga),F(B,4,`type`,pa,xa,_a),F(B,4,`collisionDetector`,fa,xa,va),F(B,4,`collisionPriority`,da,xa,ya),F(B,4,`shape`,ua,xa,ba),F(B,2,`isDropTarget`,la,xa),yi(B,xa);var Sa=class{constructor(){this.registry=new Map}addEventListener(e,t){let{registry:n}=this,r=new Set(n.get(e));return r.add(t),n.set(e,r),()=>this.removeEventListener(e,t)}removeEventListener(e,t){let{registry:n}=this,r=new Set(n.get(e));r.delete(t),n.set(e,r)}dispatch(e,...t){let{registry:n}=this,r=n.get(e);if(r)for(let e of r)e(...t)}},Ca=class extends Sa{constructor(e){super(),this.manager=e}dispatch(e,t){let n=[t,this.manager];super.dispatch(e,...n)}};function wa(e,t=!0){let n=!1;return fi(di({},e),{cancelable:t,get defaultPrevented(){return n},preventDefault(){t&&(n=!0)}})}var Ta=class extends ji{constructor(e){super(e);let t=(e,t)=>e.map(({id:e})=>e).join(``)===t.map(({id:e})=>e).join(``),n=[];this.destroy=Jn(()=>{let{dragOperation:t,collisionObserver:r}=e;t.status.initializing&&(n=[],r.enable())},()=>{let{collisionObserver:r,monitor:i}=e,{collisions:a}=r;if(r.isDisabled()||Xi.pendingIdChanges)return;let o=wa({collisions:a});if(i.dispatch(`collision`,o),o.defaultPrevented||t(a,n))return;n=a;let[s]=a;O(()=>{s?.id!==e.dragOperation.target?.id&&(r.disable(),e.actions.setDropTarget(s?.id).then(()=>{r.enable()}))})})}},Ea=(e=>(e[e.Lowest=0]=`Lowest`,e[e.Low=1]=`Low`,e[e.Normal=2]=`Normal`,e[e.High=3]=`High`,e[e.Highest=4]=`Highest`,e))(Ea||{}),Da=(e=>(e[e.Collision=0]=`Collision`,e[e.ShapeIntersection=1]=`ShapeIntersection`,e[e.PointerIntersection=2]=`PointerIntersection`,e))(Da||{}),Oa,ka,Aa,ja,Ma,Na,Pa=[A],Fa,Ia;Na=[j],Ma=[j],ja=[j],Aa=[j],ka=[j],Oa=[j];var La=class{constructor(){P(Fa,5,this),L(this,Ia,P(Fa,8,this,`idle`)),P(Fa,11,this)}get current(){return this.value}get idle(){return this.value===`idle`}get initializing(){return this.value===`initializing`}get initialized(){let{value:e}=this;return e!==`idle`&&e!==`initialization-pending`}get dragging(){return this.value===`dragging`}get dropped(){return this.value===`dropped`}set(e){this.value=e}};Fa=hi(null),Ia=new WeakMap,F(Fa,4,`value`,Pa,La,Ia),F(Fa,2,`current`,Na,La),F(Fa,2,`idle`,Ma,La),F(Fa,2,`initializing`,ja,La),F(Fa,2,`initialized`,Aa,La),F(Fa,2,`dragging`,ka,La),F(Fa,2,`dropped`,Oa,La),yi(Fa,La);var Ra=class{constructor(e){this.manager=e}setDragSource(e){let{dragOperation:t}=this.manager;t.sourceIdentifier=typeof e==`string`||typeof e==`number`?e:e.id}setDropTarget(e){return O(()=>{let{dragOperation:t}=this.manager,n=e??null;if(t.targetIdentifier===n)return Promise.resolve(!1);t.targetIdentifier=n;let r=wa({operation:t.snapshot()});return t.status.dragging&&this.manager.monitor.dispatch(`dragover`,r),this.manager.renderer.rendering.then(()=>r.defaultPrevented)})}start(e){return O(()=>{let{dragOperation:t}=this.manager;if(e.source!=null&&this.setDragSource(e.source),!t.source)throw Error(`Cannot start a drag operation without a drag source`);if(!t.status.idle)throw Error(`Cannot start a drag operation while another is active`);let n=new AbortController,{event:r,coordinates:i}=e;E(()=>{t.status.set(`initialization-pending`),t.shape=null,t.canceled=!1,t.activatorEvent=r??null,t.position.reset(i)});let a=wa({operation:t.snapshot()});return this.manager.monitor.dispatch(`beforedragstart`,a),a.defaultPrevented?(t.reset(),n.abort(),n):(t.status.set(`initializing`),t.controller=n,this.manager.renderer.rendering.then(()=>{if(n.signal.aborted)return;let{status:e}=t;e.current===`initializing`&&E(()=>{t.status.set(`dragging`),this.manager.monitor.dispatch(`dragstart`,{nativeEvent:r,operation:t.snapshot(),cancelable:!1})})}),n)})}move(e){return O(()=>{let{dragOperation:t}=this.manager,{status:n,controller:r}=t;if(!n.dragging||!r||r.signal.aborted)return;let i=wa({nativeEvent:e.event,operation:t.snapshot(),by:e.by,to:e.to},e.cancelable??!0);(e.propagate??!0)&&this.manager.monitor.dispatch(`dragmove`,i),queueMicrotask(()=>{if(i.defaultPrevented)return;let n=e.to??{x:t.position.current.x+(e.by?.x??0),y:t.position.current.y+(e.by?.y??0)};t.position.current=n})})}stop(e={}){return O(()=>{let{dragOperation:t}=this.manager,{controller:n}=t;if(!n||n.signal.aborted)return;let r,i=()=>{let e={resume:()=>{},abort:()=>{}};return r=new Promise((t,n)=>{e.resume=t,e.abort=n}),e};n.abort();let a=()=>{this.manager.renderer.rendering.then(()=>{t.status.set(`dropped`);let e=O(()=>t.source?.status===`dropping`),r=()=>{t.controller===n&&(t.controller=void 0),t.reset()};if(e){let{source:e}=t,n=_n(()=>{e?.status===`idle`&&(n(),r())})}else this.manager.renderer.rendering.then(r)})};t.canceled=e.canceled??!1,this.manager.monitor.dispatch(`dragend`,{nativeEvent:e.event,operation:t.snapshot(),canceled:e.canceled??!1,suspend:i}),r?r.then(a).catch(()=>t.reset()):a()})}},za=class extends R{constructor(e,t){super(e,t),this.manager=e,this.options=t}},Ba=class extends AbortController{constructor(e,t){super(),this.constraints=e,this.onActivate=t,this.activated=!1;for(let t of e??[])t.controller=this}onEvent(e){if(!this.activated){if(this.constraints?.length)for(let t of this.constraints)t.onEvent(e);else this.activate(e)}}activate(e){this.activated||(this.activated=!0,this.onActivate(e))}abort(e){this.activated=!1,super.abort(e)}},Va,Ha=class{constructor(e){this.options=e,L(this,Va)}set controller(e){Si(this,Va,e),e.signal.addEventListener(`abort`,()=>this.abort())}activate(e){var t;(t=I(this,Va))==null||t.activate(e)}};Va=new WeakMap;var Ua=class extends R{constructor(e,t){super(e,t),this.manager=e,this.options=t}apply(e){return e.transform}},Wa=class{constructor(e){this.draggables=new Zi,this.droppables=new Zi,this.plugins=new Ni(e),this.sensors=new Ni(e),this.modifiers=new Ni(e)}register(e,t){if(e instanceof ca)return this.draggables.register(e.id,e);if(e instanceof xa)return this.droppables.register(e.id,e);if(e.prototype instanceof Ua)return this.modifiers.register(e,t);if(e.prototype instanceof za)return this.sensors.register(e,t);if(e.prototype instanceof R)return this.plugins.register(e,t);throw Error(`Invalid instance type`)}unregister(e){if(e instanceof Xi)return e instanceof ca?this.draggables.unregister(e.id,e):e instanceof xa?this.droppables.unregister(e.id,e):()=>{};if(e.prototype instanceof Ua)return this.modifiers.unregister(e);if(e.prototype instanceof za)return this.sensors.unregister(e);if(e.prototype instanceof R)return this.plugins.unregister(e);throw Error(`Invalid instance type`)}destroy(){this.draggables.destroy(),this.droppables.destroy(),this.plugins.destroy(),this.sensors.destroy(),this.modifiers.destroy()}},Ga,Ka,qa,Ja,Ya,Xa,Za,Qa,$a=[j],eo,to,no,V,ro,io,ao,oo,so,co;Qa=[A],Za=[A],Xa=[A],Ya=[A],Ja=[A],qa=[j],Ka=[j],Ga=[j];var lo=class{constructor(e){P(V,5,this),L(this,eo),L(this,to),L(this,no,new pr(void 0,(e,t)=>e&&t?e.equals(t):e===t)),this.status=new La,L(this,ro,P(V,8,this,!1)),P(V,11,this),L(this,io,P(V,12,this,null)),P(V,15,this),L(this,ao,P(V,16,this,null)),P(V,19,this),L(this,oo,P(V,20,this,null)),P(V,23,this),L(this,so,P(V,24,this,[])),P(V,27,this),this.position=new Xr({x:0,y:0}),L(this,co,{x:0,y:0}),Si(this,eo,e)}get shape(){let{current:e,initial:t,previous:n}=I(this,no);return!e||!t?null:{current:e,initial:t,previous:n}}set shape(e){e?I(this,no).current=e:I(this,no).reset()}get source(){let e=this.sourceIdentifier;if(e==null)return null;let t=I(this,eo).registry.draggables.get(e);return t&&Si(this,to,t),t??I(this,to)??null}get target(){let e=this.targetIdentifier;return e==null?null:I(this,eo).registry.droppables.get(e)??null}get transform(){let{x:e,y:t}=this.position.delta,n={x:e,y:t};for(let e of this.modifiers)n=e.apply(fi(di({},this.snapshot()),{transform:n}));return Si(this,co,n),n}snapshot(){return O(()=>({source:this.source,target:this.target,activatorEvent:this.activatorEvent,transform:I(this,co),shape:this.shape?mr(this.shape):null,position:mr(this.position),status:mr(this.status),canceled:this.canceled}))}reset(){E(()=>{this.status.set(`idle`),this.sourceIdentifier=null,this.targetIdentifier=null,I(this,no).reset(),this.position.reset({x:0,y:0}),Si(this,co,{x:0,y:0}),this.modifiers=[]})}};V=hi(null),eo=new WeakMap,to=new WeakMap,no=new WeakMap,ro=new WeakMap,io=new WeakMap,ao=new WeakMap,oo=new WeakMap,so=new WeakMap,co=new WeakMap,F(V,2,`shape`,$a,lo),F(V,4,`canceled`,Qa,lo,ro),F(V,4,`activatorEvent`,Za,lo,io),F(V,4,`sourceIdentifier`,Xa,lo,ao),F(V,4,`targetIdentifier`,Ya,lo,oo),F(V,4,`modifiers`,Ja,lo,so),F(V,2,`source`,qa,lo),F(V,2,`target`,Ka,lo),F(V,2,`transform`,Ga,lo),yi(V,lo);var uo={get rendering(){return Promise.resolve()}};function fo(e,t){return typeof e==`function`?e(t):e??t}var po=class{constructor(e){this.destroy=()=>{this.dragOperation.status.idle||this.actions.stop({canceled:!0}),this.dragOperation.modifiers.forEach(e=>e.destroy()),this.registry.destroy(),this.collisionObserver.destroy()};let t=e??{},n=fo(t.plugins,[]),r=fo(t.sensors,[]),i=fo(t.modifiers,[]),a=t.renderer??uo,o=new Ca(this),s=new Wa(this);this.registry=s,this.monitor=o,this.renderer=a,this.actions=new Ra(this),this.dragOperation=new lo(this),this.collisionObserver=new Ri(this),this.plugins=[Ta,...n],this.modifiers=i,this.sensors=r;let{destroy:c}=this,l=Jn(()=>{let e=O(()=>this.dragOperation.modifiers),t=this.modifiers;for(let n of e)t.includes(n)||n.destroy();this.dragOperation.modifiers=(this.dragOperation.source?.modifiers)?.map(e=>{let{plugin:t,options:n}=Ei(e);return new t(this,n)})??t});this.destroy=()=>{l(),c()}}get plugins(){return this.registry.plugins.values}set plugins(e){this.registry.plugins.values=e}get modifiers(){return this.registry.modifiers.values}set modifiers(e){this.registry.modifiers.values=e}get sensors(){return this.registry.sensors.values}set sensors(e){this.registry.sensors.values=e}},mo=Object.defineProperty,ho=Object.defineProperties,go=Object.getOwnPropertyDescriptors,_o=Object.getOwnPropertySymbols,vo=Object.prototype.hasOwnProperty,yo=Object.prototype.propertyIsEnumerable,bo=(e,t,n)=>t in e?mo(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,xo=(e,t)=>{for(var n in t||={})vo.call(t,n)&&bo(e,n,t[n]);if(_o)for(var n of _o(t))yo.call(t,n)&&bo(e,n,t[n]);return e},So=(e,t)=>ho(e,go(t)),Co=class extends Ua{apply({transform:e}){if(!this.options)return e;let{axis:t,value:n}=this.options;return So(xo({},e),{[t]:n})}};Co.configure=Ti(Co);var wo=Co,To=wo.configure({axis:`x`,value:0});wo.configure({axis:`y`,value:0});function Eo(e,t,n){let r=xo({},t);return e.boundingRectangle.top+t.y<=n.top?r.y=n.top-e.boundingRectangle.top:e.boundingRectangle.bottom+t.y>=n.top+n.height&&(r.y=n.top+n.height-e.boundingRectangle.bottom),e.boundingRectangle.left+t.x<=n.left?r.x=n.left-e.boundingRectangle.left:e.boundingRectangle.right+t.x>=n.left+n.width&&(r.x=n.left+n.width-e.boundingRectangle.right),r}var Do=class extends Ua{apply({transform:e}){let{size:t=20}=this.options??{},n=typeof t==`number`?t:t.x,r=typeof t==`number`?t:t.y;return So(xo({},e),{x:Math.ceil(e.x/n)*n,y:Math.ceil(e.y/r)*r})}};Do.configure=Ti(Do);var Oo=e=>{throw TypeError(e)},ko=(e,t,n)=>t.has(e)||Oo(`Cannot `+n),H=(e,t,n)=>(ko(e,t,`read from private field`),t.get(e)),U=(e,t,n)=>t.has(e)?Oo(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),Ao=(e,t,n,r)=>(ko(e,t,`write to private field`),t.set(e,n),n),jo=(e,t,n)=>(ko(e,t,`access private method`),n);function Mo(e){return e?e instanceof KeyframeEffect||`getKeyframes`in e&&typeof e.getKeyframes==`function`:!1}function No(e,t){let n=e.getAnimations(),r=null;for(let e of n){if(e.playState!==`running`)continue;let{effect:n}=e,i=(Mo(n)?n.getKeyframes():[]).filter(t);i.length>0&&(r=[i[i.length-1],e])}return r}function Po(e){let{width:t,height:n,top:r,left:i,bottom:a,right:o}=e.getBoundingClientRect();return{width:t,height:n,top:r,left:i,bottom:a,right:o}}function Fo(e){let t=Object.prototype.toString.call(e);return t===`[object Window]`||t===`[object global]`}function Io(e){return`nodeType`in e}function Lo(e){return e?Fo(e)?e:Io(e)?`defaultView`in e?e.defaultView??window:e.ownerDocument?.defaultView??window:window:window}function Ro(e){let{Document:t}=Lo(e);return e instanceof t||`nodeType`in e&&e.nodeType===Node.DOCUMENT_NODE}function zo(e){return!e||Fo(e)?!1:e instanceof Lo(e).HTMLElement||`namespaceURI`in e&&typeof e.namespaceURI==`string`&&e.namespaceURI.endsWith(`html`)}function Bo(e){return e instanceof Lo(e).SVGElement||`namespaceURI`in e&&typeof e.namespaceURI==`string`&&e.namespaceURI.endsWith(`svg`)}function Vo(e){return e?Fo(e)?e.document:Io(e)?Ro(e)?e:zo(e)||Bo(e)?e.ownerDocument:document:document:document}function Ho(e){let{documentElement:t}=Vo(e),n=Lo(e).visualViewport,r=n?.width??t.clientWidth,i=n?.height??t.clientHeight,a=n?.offsetTop??0,o=n?.offsetLeft??0;return{top:a,left:o,right:o+r,bottom:a+i,width:r,height:i}}function Uo(e,t){if(Wo(e)&&e.open===!1)return!1;let{overflow:n,overflowX:r,overflowY:i}=getComputedStyle(e);return n===`visible`&&r===`visible`&&i===`visible`}function Wo(e){return e.tagName===`DETAILS`}function Go(e,t=e.getBoundingClientRect(),n=0){let r=t,{ownerDocument:i}=e,a=i.defaultView??window,o=e.parentElement;for(;o&&o!==i.documentElement;){if(!Uo(o)){let e=o.getBoundingClientRect(),t=n*(e.bottom-e.top),i=n*(e.right-e.left),a=n*(e.bottom-e.top),s=n*(e.right-e.left);r={top:Math.max(r.top,e.top-t),right:Math.min(r.right,e.right+i),bottom:Math.min(r.bottom,e.bottom+a),left:Math.max(r.left,e.left-s),width:0,height:0},r.width=r.right-r.left,r.height=r.bottom-r.top}o=o.parentElement}let s=a.visualViewport,c=s?.offsetTop??0,l=s?.offsetLeft??0,u=s?.width??a.innerWidth,d=s?.height??a.innerHeight,f=n*d,p=n*u;return r={top:Math.max(r.top,c-f),right:Math.min(r.right,l+u+p),bottom:Math.min(r.bottom,c+d+f),left:Math.max(r.left,l-p),width:0,height:0},r.width=r.right-r.left,r.height=r.bottom-r.top,r.width<0&&(r.width=0),r.height<0&&(r.height=0),r}function Ko(e){return{x:e.clientX,y:e.clientY}}var qo=typeof window<`u`&&window.document!==void 0&&window.document.createElement!==void 0;function Jo(e=document,t=new Set){if(t.has(e))return[];t.add(e);let n=[e];for(let r of Array.from(e.querySelectorAll(`iframe, frame`)))try{let e=r.contentDocument;e&&!t.has(e)&&n.push(...Jo(e,t))}catch{}try{let r=e.defaultView;if(r&&r!==window.top){let i=r.parent;i&&i.document&&i.document!==e&&n.push(...Jo(i.document,t))}}catch{}return n}function Yo(){return/^((?!chrome|android).)*safari/i.test(navigator.userAgent)}function Xo(){let e=Yo()?window.visualViewport:null;return{x:e?.offsetLeft??0,y:e?.offsetTop??0}}function Zo(e){return!e||!Io(e)?!1:e instanceof Lo(e).ShadowRoot}function Qo(e){if(e&&Io(e)){let t=e.getRootNode();if(Zo(t)||t instanceof Document)return t}return Vo(e)}function $o(e){return e.matchMedia(`(prefers-reduced-motion: reduce)`).matches}function es(e){let t=`input, textarea, select, canvas, [contenteditable]`,n=e.cloneNode(!0),r=Array.from(e.querySelectorAll(t));return Array.from(n.querySelectorAll(t)).forEach((e,t)=>{let n=r[t];ts(e)&&ts(n)&&(e.type!==`file`&&(e.value=n.value),e.type===`radio`&&e.name&&(e.name=`Cloned__${e.name}`)),ns(e)&&ns(n)&&n.width>0&&n.height>0&&e.getContext(`2d`)?.drawImage(n,0,0)}),n}function ts(e){return`value`in e}function ns(e){return e.tagName===`CANVAS`}function rs(e,{x:t,y:n}){let r=e.elementFromPoint(t,n);if(is(r)){let{contentDocument:e}=r;if(e){let{left:i,top:a}=r.getBoundingClientRect();return rs(e,{x:t-i,y:n-a})}}return r}function is(e){return e?.tagName===`IFRAME`}var as=new WeakMap;function os(e){return!!e.closest(`
      input:not([disabled]),
      select:not([disabled]),
      textarea:not([disabled]),
      button:not([disabled]),
      a[href],
      [contenteditable]:not([contenteditable="false"])
    `)}var ss=class{constructor(){this.entries=new Set,this.clear=()=>{for(let e of this.entries){let[t,{type:n,listener:r,options:i}]=e;t.removeEventListener(n,r,i)}this.entries.clear()}}bind(e,t){let n=Array.isArray(e)?e:[e],r=Array.isArray(t)?t:[t],i=[];for(let e of n)for(let t of r){let{type:n,listener:r,options:a}=t,o=[e,t];e.addEventListener(n,r,a),this.entries.add(o),i.push(o)}let a=this.entries;return function(){for(let e of i){let[t,{type:n,listener:r,options:i}]=e;t.removeEventListener(n,r,i),a.delete(e)}}}};function cs(e){let t=e?.ownerDocument.defaultView;if(t&&t.self!==t.parent)return t.frameElement}function ls(e){let t=new Set,n=cs(e);for(;n;)t.add(n),n=cs(n);return t}function us(e,t){let n=setTimeout(e,t);return()=>clearTimeout(n)}function ds(e,t){let n=()=>performance.now(),r,i;return function(...a){let o=this;i?(r?.(),r=us(()=>{e.apply(o,a),i=n()},t-(n()-i))):(e.apply(o,a),i=n())}}function fs(e,t){return e===t?!0:!e||!t?!1:e.top==t.top&&e.left==t.left&&e.right==t.right&&e.bottom==t.bottom}function ps(e,t=e.getBoundingClientRect()){let{width:n,height:r}=Go(e,t);return n>0&&r>0}var ms=qo?ResizeObserver:class{observe(){}unobserve(){}disconnect(){}},hs,gs=class extends ms{constructor(e){super(t=>{if(!H(this,hs)){Ao(this,hs,!0);return}e(t,this)}),U(this,hs,!1)}};hs=new WeakMap;var _s=Array.from({length:100},(e,t)=>t/100),vs=75,ys,bs,xs,Ss,Cs,W,ws,Ts,Es,Ds,Os,ks=class{constructor(e,t,n={debug:!1,skipInitial:!1}){this.element=e,this.callback=t,U(this,Es),this.disconnect=()=>{var e,t,n;Ao(this,ws,!0),(e=H(this,xs))==null||e.disconnect(),(t=H(this,Ss))==null||t.disconnect(),H(this,Cs).disconnect(),(n=H(this,W))==null||n.remove()},U(this,ys,!0),U(this,bs),U(this,xs),U(this,Ss),U(this,Cs),U(this,W),U(this,ws,!1),U(this,Ts,ds(()=>{var e;let{element:t}=this;if((e=H(this,Ss))==null||e.disconnect(),H(this,ws)||!H(this,ys)||!t.isConnected)return;let n=t.ownerDocument??document,{innerHeight:r,innerWidth:i}=n.defaultView??window,a=t.getBoundingClientRect(),{top:o,left:s,bottom:c,right:l}=Go(t,a),u=-Math.floor(o),d=-Math.floor(s),f=`${u}px ${-Math.floor(i-l)}px ${-Math.floor(r-c)}px ${d}px`;this.boundingClientRect=a,Ao(this,Ss,new IntersectionObserver(e=>{let[n]=e,{intersectionRect:r}=n;(n.intersectionRatio===1?Ur.intersectionRatio(r,Go(t)):n.intersectionRatio)!==1&&H(this,Ts).call(this)},{threshold:_s,rootMargin:f,root:n})),H(this,Ss).observe(t),jo(this,Es,Ds).call(this)},vs)),this.boundingClientRect=e.getBoundingClientRect(),Ao(this,ys,ps(e,this.boundingClientRect));let r=!0;this.callback=e=>{r&&(r=!1,n.skipInitial)||t(e)};let i=e.ownerDocument;n?.debug&&(Ao(this,W,document.createElement(`div`)),H(this,W).style.background=`rgba(0,0,0,0.15)`,H(this,W).style.position=`fixed`,H(this,W).style.pointerEvents=`none`,i.body.appendChild(H(this,W))),Ao(this,Cs,new IntersectionObserver(t=>{var n,r;let{boundingClientRect:i,isIntersecting:a}=t[t.length-1],{width:o,height:s}=i,c=H(this,ys);Ao(this,ys,a),!(!o&&!s)&&(c&&!a?((n=H(this,Ss))==null||n.disconnect(),this.callback(null),(r=H(this,xs))==null||r.disconnect(),Ao(this,xs,void 0),H(this,W)&&(H(this,W).style.visibility=`hidden`)):H(this,Ts).call(this),a&&!H(this,xs)&&(Ao(this,xs,new gs(H(this,Ts))),H(this,xs).observe(e)))},{threshold:_s,root:i})),H(this,ys)&&!n.skipInitial&&this.callback(this.boundingClientRect),H(this,Cs).observe(e)}};ys=new WeakMap,bs=new WeakMap,xs=new WeakMap,Ss=new WeakMap,Cs=new WeakMap,W=new WeakMap,ws=new WeakMap,Ts=new WeakMap,Es=new WeakSet,Ds=function(){H(this,ws)||(jo(this,Es,Os).call(this),!fs(this.boundingClientRect,H(this,bs))&&(this.callback(this.boundingClientRect),Ao(this,bs,this.boundingClientRect)))},Os=function(){if(H(this,W)){let{top:e,left:t,width:n,height:r}=Go(this.element);H(this,W).style.overflow=`hidden`,H(this,W).style.visibility=`visible`,H(this,W).style.top=`${Math.floor(e)}px`,H(this,W).style.left=`${Math.floor(t)}px`,H(this,W).style.width=`${Math.floor(n)}px`,H(this,W).style.height=`${Math.floor(r)}px`}};var As=new WeakMap,js=new WeakMap;function Ms(e,t){let n=As.get(e);return n||={disconnect:new ks(e,t=>{let n=As.get(e);n&&n.callbacks.forEach(e=>e(t))},{skipInitial:!0}).disconnect,callbacks:new Set},n.callbacks.add(t),As.set(e,n),()=>{n.callbacks.delete(t),n.callbacks.size===0&&(As.delete(e),n.disconnect())}}function Ns(e,t){let n=new Set;for(let r of e){let e=Ms(r,t);n.add(e)}return()=>n.forEach(e=>e())}function Ps(e,t){let n=e.ownerDocument;if(!js.has(n)){let e=new AbortController,t=new Set;document.addEventListener(`scroll`,e=>t.forEach(t=>t(e)),{capture:!0,passive:!0,signal:e.signal}),js.set(n,{disconnect:()=>e.abort(),listeners:t})}let{listeners:r,disconnect:i}=js.get(n)??{};return!r||!i?()=>{}:(r.add(t),()=>{r.delete(t),r.size===0&&(i(),js.delete(n))})}var Fs,Is,Ls,Rs,zs=class{constructor(e,t,n){this.callback=t,U(this,Fs),U(this,Is,!1),U(this,Ls),U(this,Rs,ds(e=>{if(!H(this,Is)&&e.target&&`contains`in e.target&&typeof e.target.contains==`function`){for(let t of H(this,Ls))if(e.target.contains(t)){this.callback(H(this,Fs).boundingClientRect);break}}},vs));let r=ls(e),i=Ns(r,t),a=Ps(e,H(this,Rs));Ao(this,Ls,r),Ao(this,Fs,new ks(e,t,n)),this.disconnect=()=>{H(this,Is)||(Ao(this,Is,!0),i(),a(),H(this,Fs).disconnect())}}};Fs=new WeakMap,Is=new WeakMap,Ls=new WeakMap,Rs=new WeakMap;function Bs(e){return`showPopover`in e&&`hidePopover`in e&&typeof e.showPopover==`function`&&typeof e.hidePopover==`function`}function Vs(e){try{Bs(e)&&e.isConnected&&e.hasAttribute(`popover`)&&!e.matches(`:popover-open`)&&e.showPopover()}catch{}}function Hs(e){return!qo||!e?!1:e===Vo(e).scrollingElement}function Us(e){let t=Lo(e),n=Hs(e)?Ho(e):Po(e),r=t.visualViewport,i=Hs(e)?{height:r?.height??t.innerHeight,width:r?.width??t.innerWidth}:{height:e.clientHeight,width:e.clientWidth},a={current:{x:e.scrollLeft,y:e.scrollTop},max:{x:e.scrollWidth-i.width,y:e.scrollHeight-i.height}};return{rect:n,position:a,isTop:a.current.y<=0,isLeft:a.current.x<=0,isBottom:a.current.y>=a.max.y,isRight:a.current.x>=a.max.x}}function Ws(e,t){let{isTop:n,isBottom:r,isLeft:i,isRight:a,position:o}=Us(e),{x:s,y:c}=t??{x:0,y:0},l=!n&&o.current.y+c>0,u=!r&&o.current.y+c<o.max.y,d=!i&&o.current.x+s>0,f=!a&&o.current.x+s<o.max.x;return{top:l,bottom:u,left:d,right:f,x:d||f,y:l||u}}var Gs=class{constructor(e){this.scheduler=e,this.pending=!1,this.tasks=new Set,this.resolvers=new Set,this.flush=()=>{let{tasks:e,resolvers:t}=this;this.pending=!1,this.tasks=new Set,this.resolvers=new Set;for(let t of e)t();for(let e of t)e()}}schedule(e){return this.tasks.add(e),this.pending||(this.pending=!0,this.scheduler(this.flush)),new Promise(e=>this.resolvers.add(e))}},Ks=new Gs(e=>{typeof requestAnimationFrame==`function`?requestAnimationFrame(e):e()}),qs=new Gs(e=>setTimeout(e,50)),Js=new Map,Ys=Js.clear.bind(Js);function Xs(e,t=!1){if(!t)return Zs(e);let n=Js.get(e);return n||(n=Zs(e),Js.set(e,n),qs.schedule(Ys),n)}function Zs(e){return Lo(e).getComputedStyle(e)}function Qs(e,t=Xs(e,!0)){return t.position===`fixed`||t.position===`sticky`}function $s(e,t=Xs(e,!0)){let n=/(auto|scroll|overlay)/;return[`overflow`,`overflowX`,`overflowY`].some(e=>{let r=t[e];return typeof r==`string`&&n.test(r)})}var ec={excludeElement:!0,escapeShadowDOM:!0};function tc(e,t=ec){let{limit:n,excludeElement:r,escapeShadowDOM:i}=t,a=new Set;function o(t){if(n!=null&&a.size>=n||!t)return a;if(Ro(t)&&t.scrollingElement!=null&&!a.has(t.scrollingElement))return a.add(t.scrollingElement),a;if(i&&Zo(t))return o(t.host);if(!zo(t))return Bo(t)?o(t.parentElement):a;if(a.has(t))return a;let s=Xs(t,!0);if(r&&t===e||$s(t,s)&&a.add(t),Qs(t,s)){let{scrollingElement:e}=t.ownerDocument;return e&&a.add(e),a}return o(t.parentNode)}return e?o(e):a}function nc(e,t=window.frameElement){let n={x:0,y:0,scaleX:1,scaleY:1};if(!e)return n;let r=cs(e);for(;r;){if(r===t)return n;let e=Po(r),{x:i,y:a}=rc(r,e);n.x+=e.left,n.y+=e.top,n.scaleX*=i,n.scaleY*=a,r=cs(r)}return n}function rc(e,t=Po(e)){let n=Math.round(t.width),r=Math.round(t.height);if(zo(e))return{x:n/e.offsetWidth,y:r/e.offsetHeight};let i=Xs(e,!0);return{x:(parseFloat(i.width)||n)/n,y:(parseFloat(i.height)||r)/r}}function ic(e){if(e===`none`)return null;let t=e.split(` `),n=parseFloat(t[0]),r=parseFloat(t[1]);return isNaN(n)&&isNaN(r)?null:{x:isNaN(n)?r:n,y:isNaN(r)?n:r}}function ac(e){if(e===`none`)return null;let[t,n,r=`0`]=e.split(` `),i={x:parseFloat(t),y:parseFloat(n),z:parseInt(r,10)};return isNaN(i.x)&&isNaN(i.y)?null:{x:isNaN(i.x)?0:i.x,y:isNaN(i.y)?0:i.y,z:isNaN(i.z)?0:i.z}}function oc(e){let{scale:t,transform:n,translate:r}=e,i=ic(t),a=ac(r),o=sc(n);if(!o&&!i&&!a)return null;let s={x:i?.x??1,y:i?.y??1},c={x:a?.x??0,y:a?.y??0},l={x:o?.x??0,y:o?.y??0,scaleX:o?.scaleX??1,scaleY:o?.scaleY??1};return{x:c.x+l.x,y:c.y+l.y,z:a?.z??0,scaleX:s.x*l.scaleX,scaleY:s.y*l.scaleY}}function sc(e){if(e.startsWith(`matrix3d(`)){let t=e.slice(9,-1).split(/, /);return{x:+t[12],y:+t[13],scaleX:+t[0],scaleY:+t[5]}}if(e.startsWith(`matrix(`)){let t=e.slice(7,-1).split(/, /);return{x:+t[4],y:+t[5],scaleX:+t[0],scaleY:+t[3]}}return null}var cc=(e=>(e[e.Idle=0]=`Idle`,e[e.Forward=1]=`Forward`,e[e.Reverse=-1]=`Reverse`,e))(cc||{}),lc={x:.2,y:.2},uc={x:10,y:10};function dc(e,t,n,r=25,i=lc,a=uc){let{x:o,y:s}=t,{rect:c,isTop:l,isBottom:u,isLeft:d,isRight:f}=Us(e),p=nc(e),m=oc(Xs(e,!0)),h=m!==null&&m?.scaleX<0,g=m!==null&&m?.scaleY<0,_=new Ur(c.left*p.scaleX+p.x,c.top*p.scaleY+p.y,c.width*p.scaleX,c.height*p.scaleY),v={x:0,y:0},y={x:0,y:0},b={height:_.height*i.y,width:_.width*i.x};return b.height>0&&(!l||g&&!u)&&s<=_.top+b.height&&n?.y!==1&&o>=_.left-a.x&&o<=_.right+a.x?(v.y=g?1:-1,y.y=r*Math.abs((_.top+b.height-s)/b.height)):b.height>0&&(!u||g&&!l)&&s>=_.bottom-b.height&&n?.y!==-1&&o>=_.left-a.x&&o<=_.right+a.x&&(v.y=g?-1:1,y.y=r*Math.abs((_.bottom-b.height-s)/b.height)),b.width>0&&(!f||h&&!d)&&o>=_.right-b.width&&n?.x!==-1&&s>=_.top-a.y&&s<=_.bottom+a.y?(v.x=h?-1:1,y.x=r*Math.abs((_.right-b.width-o)/b.width)):b.width>0&&(!d||h&&!f)&&o<=_.left+b.width&&n?.x!==1&&s>=_.top-a.y&&s<=_.bottom+a.y&&(v.x=h?1:-1,y.x=r*Math.abs((_.left+b.width-o)/b.width)),{direction:v,speed:y}}function fc(e,{block:t=`nearest`,inline:n=`nearest`}={}){if(!zo(e))return;let r=tc(e),i=[];for(let a of r){if(!zo(a))continue;let{top:r,left:o}=mc(e,a),s=r,c=o;for(let e of i)s-=e.scrollTop,c-=e.scrollLeft;if(t!==`none`){let n=s<a.scrollTop;n!==s+e.offsetHeight>a.scrollTop+a.clientHeight&&(a.scrollTop=t===`center`?s-a.clientHeight/2+e.offsetHeight/2:n?s:s+e.offsetHeight-a.clientHeight)}if(n!==`none`){let t=c<a.scrollLeft;t!==c+e.offsetWidth>a.scrollLeft+a.clientWidth&&(a.scrollLeft=n===`center`?c-a.clientWidth/2+e.offsetWidth/2:t?c:c+e.offsetWidth-a.clientWidth)}i.push(a)}}function pc(e){let t=0,n=0,r=e;for(;r;){t+=r.offsetTop,n+=r.offsetLeft;let e=r.offsetParent;if(!zo(e))break;t+=e.clientTop,n+=e.clientLeft,r=e}return{top:t,left:n}}function mc(e,t){let n=pc(e),r=pc(t);return{top:n.top-r.top-t.clientTop,left:n.left-r.left-t.clientLeft}}function hc(e,t,n){let{scaleX:r,scaleY:i,x:a,y:o}=t,s=e.left+a+(1-r)*parseFloat(n),c=e.top+o+(1-i)*parseFloat(n.slice(n.indexOf(` `)+1)),l=r?e.width*r:e.width,u=i?e.height*i:e.height;return{width:l,height:u,top:c,right:s+l,bottom:c+u,left:s}}function gc(e,t,n){let{scaleX:r,scaleY:i,x:a,y:o}=t,s=e.left-a-(1-r)*parseFloat(n),c=e.top-o-(1-i)*parseFloat(n.slice(n.indexOf(` `)+1)),l=r?e.width/r:e.width,u=i?e.height/i:e.height;return{width:l,height:u,top:c,right:s+l,bottom:c+u,left:s}}function _c({element:e,keyframes:t,options:n}){return e.animate(t,n).finished}function vc(e,t=Xs(e).translate,n=!0){if(n){let t=No(e,e=>`translate`in e);if(t){let{translate:e=``}=t[0];if(typeof e==`string`){let t=ac(e);if(t)return t}}}if(t){let e=ac(t);if(e)return e}return{x:0,y:0,z:0}}var yc=new Gs(e=>setTimeout(e,0)),bc=new Map,xc=bc.clear.bind(bc);function Sc(e){let t=e.ownerDocument,n=bc.get(t);if(n)return n;n=t.getAnimations(),bc.set(t,n),yc.schedule(xc);let r=n.filter(t=>Mo(t.effect)&&t.effect.target===e);return bc.set(e,r),n}function Cc(e,t){let n=Sc(e).filter(e=>{if(Mo(e.effect)){let{target:n}=e.effect;if((n&&t.isValidTarget?.call(t,n))??!0)return e.effect.getKeyframes().some(e=>{for(let n of t.properties)if(e[n])return!0})}}).map(e=>{let{effect:t,currentTime:n}=e,r=t?.getComputedTiming().duration;if(!(e.pending||e.playState===`finished`)&&typeof r==`number`&&typeof n==`number`&&n<r)return e.currentTime=r,()=>{e.currentTime=n}});if(n.length>0)return()=>n.forEach(e=>e?.())}var wc=class extends Ur{constructor(e,t={}){let{frameTransform:n=nc(e),ignoreTransforms:r,getBoundingClientRect:i=Po}=t,a=Cc(e,{properties:[`transform`,`translate`,`scale`,`width`,`height`],isValidTarget:t=>(t!==e||Yo())&&t.contains(e)}),o=i(e),{top:s,left:c,width:l,height:u}=o,d,f=Xs(e),p=oc(f),m={x:p?.scaleX??1,y:p?.scaleY??1},h=Tc(e,f);a?.(),p&&(d=gc(o,p,f.transformOrigin),(r||h)&&(s=d.top,c=d.left,l=d.width,u=d.height));let g={width:d?.width??l,height:d?.height??u};if(h&&!r&&d){let e=hc(d,h,f.transformOrigin);s=e.top,c=e.left,l=e.width,u=e.height,m.x=h.scaleX,m.y=h.scaleY}n&&(r||(c*=n.scaleX,l*=n.scaleX,s*=n.scaleY,u*=n.scaleY),c+=n.x,s+=n.y),super(c,s,l,u),this.scale=m,this.intrinsicWidth=g.width,this.intrinsicHeight=g.height}};function Tc(e,t){let n=e.getAnimations();if(!n.length)return null;let r,i,a,o=!1;for(let e of n){if(e.playState!==`running`)continue;let t=Mo(e.effect)?e.effect.getKeyframes():[],n=t[t.length-1];if(!n)continue;let{transform:s,translate:c,scale:l}=n;typeof s==`string`&&s&&(r=s,o=!0),typeof c==`string`&&c&&(i=c,o=!0),typeof l==`string`&&l&&(a=l,o=!0)}return o?oc({transform:r??t.transform,translate:i??t.translate,scale:a??t.scale}):null}function Ec(e){return`style`in e&&typeof e.style==`object`&&e.style!==null&&`setProperty`in e.style&&`removeProperty`in e.style&&typeof e.style.setProperty==`function`&&typeof e.style.removeProperty==`function`}var Dc=class{constructor(e){this.element=e,this.initial=new Map}set(e,t=``){let{element:n}=this;if(Ec(n))for(let[r,i]of Object.entries(e)){let e=`${t}${r}`;this.initial.has(e)||this.initial.set(e,n.style.getPropertyValue(e)),n.style.setProperty(e,typeof i==`string`?i:`${i}px`)}}remove(e,t=``){let{element:n}=this;if(Ec(n))for(let r of e){let e=`${t}${r}`;n.style.removeProperty(e)}}reset(){let{element:e}=this;if(Ec(e)){for(let[t,n]of this.initial)e.style.setProperty(t,n);e.getAttribute(`style`)===``&&e.removeAttribute(`style`)}}};function Oc(e){return e?e instanceof Lo(e).Element||Io(e)&&e.nodeType===Node.ELEMENT_NODE:!1}function kc(e){if(!e)return!1;let{KeyboardEvent:t}=Lo(e.target);return e instanceof t}function Ac(e){if(!e)return!1;let{PointerEvent:t}=Lo(e.target);return e instanceof t}function jc(e){if(!Oc(e))return!1;let{tagName:t}=e;return t===`INPUT`||t===`TEXTAREA`||Mc(e)}function Mc(e){return e.hasAttribute(`contenteditable`)&&e.getAttribute(`contenteditable`)!==`false`}var Nc={};function Pc(e){let t=Nc[e]==null?0:Nc[e]+1;return Nc[e]=t,`${e}-${t}`}var Fc=({dragOperation:e,droppable:t})=>{let n=e.position.current;if(!n)return null;let{id:r}=t;return t.shape&&t.shape.containsPoint(n)?{id:r,value:1/Hr.distance(t.shape.center,n),type:Da.PointerIntersection,priority:Ea.High}:null},Ic=({dragOperation:e,droppable:t})=>{let{shape:n}=e;if(!t.shape||!n?.current)return null;let r=n.current.intersectionArea(t.shape);if(r){let{position:i}=e,a=Hr.distance(t.shape.center,i.current),o=r/(n.current.area+t.shape.area-r)/a;return{id:t.id,value:o,type:Da.ShapeIntersection,priority:Ea.Normal}}return null},Lc=e=>Fc(e)??Ic(e),Rc=e=>{let{dragOperation:t,droppable:n}=e,{shape:r,position:i}=t;if(!n.shape)return null;let a=r?Ur.from(r.current.boundingRectangle).corners:void 0,o=Ur.from(n.shape.boundingRectangle).corners.reduce((e,t,n)=>e+Hr.distance(Hr.from(t),a?.[n]??i.current),0)/4;return{id:n.id,value:1/o,type:Da.Collision,priority:Ea.Normal}},zc=Object.create,Bc=Object.defineProperty,Vc=Object.defineProperties,Hc=Object.getOwnPropertyDescriptor,Uc=Object.getOwnPropertyDescriptors,Wc=Object.getOwnPropertySymbols,Gc=Object.prototype.hasOwnProperty,Kc=Object.prototype.propertyIsEnumerable,qc=(e,t)=>(t=Symbol[e])?t:Symbol.for(`Symbol.`+e),Jc=e=>{throw TypeError(e)},Yc=(e,t,n)=>t in e?Bc(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,Xc=(e,t)=>{for(var n in t||={})Gc.call(t,n)&&Yc(e,n,t[n]);if(Wc)for(var n of Wc(t))Kc.call(t,n)&&Yc(e,n,t[n]);return e},Zc=(e,t)=>Vc(e,Uc(t)),Qc=(e,t)=>Bc(e,`name`,{value:t,configurable:!0}),$c=(e,t)=>{var n={};for(var r in e)Gc.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&Wc)for(var r of Wc(e))t.indexOf(r)<0&&Kc.call(e,r)&&(n[r]=e[r]);return n},el=e=>[,,,zc(e?.[qc(`metadata`)]??null)],tl=[`class`,`method`,`getter`,`setter`,`accessor`,`field`,`value`,`get`,`set`],nl=e=>e!==void 0&&typeof e!=`function`?Jc(`Function expected`):e,rl=(e,t,n,r,i)=>({kind:tl[e],name:t,metadata:r,addInitializer:e=>n._?Jc(`Already initialized`):i.push(nl(e||null))}),il=(e,t)=>Yc(t,qc(`metadata`),e[3]),G=(e,t,n,r)=>{for(var i=0,a=e[t>>1],o=a&&a.length;i<o;i++)t&1?a[i].call(n):r=a[i].call(n,r);return r},al=(e,t,n,r,i,a)=>{var o,s,c,l,u,d=t&7,f=!!(t&8),p=!!(t&16),m=d>3?e.length+1:d?f?1:2:0,h=tl[d+5],g=d>3&&(e[m-1]=[]),_=e[m]||(e[m]=[]),v=d&&(!p&&!f&&(i=i.prototype),d<5&&(d>3||!p)&&Hc(d<4?i:{get[n](){return K(this,a)},set[n](e){return J(this,a,e)}},n));d?p&&d<4&&Qc(a,(d>2?`set `:d>1?`get `:``)+n):Qc(i,n);for(var y=r.length-1;y>=0;y--)l=rl(d,n,c={},e[3],_),d&&(l.static=f,l.private=p,u=l.access={has:p?e=>sl(i,e):e=>n in e},d^3&&(u.get=p?e=>(d^1?K:cl)(e,i,d^4?a:v.get):e=>e[n]),d>2&&(u.set=p?(e,t)=>J(e,i,t,d^4?a:v.set):(e,t)=>e[n]=t)),s=(0,r[y])(d?d<4?p?a:v[h]:d>4?void 0:{get:v.get,set:v.set}:i,l),c._=1,d^4||s===void 0?nl(s)&&(d>4?g.unshift(s):d?p?a=s:v[h]=s:i=s):typeof s!=`object`||!s?Jc(`Object expected`):(nl(o=s.get)&&(v.get=o),nl(o=s.set)&&(v.set=o),nl(o=s.init)&&g.unshift(o));return d||il(e,i),v&&Bc(i,n,v),p?d^4?a:v:i},ol=(e,t,n)=>t.has(e)||Jc(`Cannot `+n),sl=(e,t)=>Object(t)===t?e.has(t):Jc(`Cannot use the "in" operator on this value`),K=(e,t,n)=>(ol(e,t,`read from private field`),n?n.call(e):t.get(e)),q=(e,t,n)=>t.has(e)?Jc(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),J=(e,t,n,r)=>(ol(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),cl=(e,t,n)=>(ol(e,t,`access private method`),n),ll={role:`button`,roleDescription:`draggable`},ul=`dnd-kit-description`,dl=`dnd-kit-announcement`,fl={draggable:`To pick up a draggable item, press the space bar. While dragging, use the arrow keys to move the item in a given direction. Press space again to drop the item in its new position, or press escape to cancel.`},pl={dragstart({operation:{source:e}}){if(e)return`Picked up draggable item ${e.id}.`},dragover({operation:{source:e,target:t}}){if(!(!e||e.id===t?.id))return t?`Draggable item ${e.id} was moved over droppable target ${t.id}.`:`Draggable item ${e.id} is no longer over a droppable target.`},dragend({operation:{source:e,target:t},canceled:n}){if(e)return n?`Dragging was cancelled. Draggable item ${e.id} was dropped.`:t?`Draggable item ${e.id} was dropped over droppable target ${t.id}`:`Draggable item ${e.id} was dropped.`}};function ml(e){let t=e.tagName.toLowerCase();return[`input`,`select`,`textarea`,`a`,`button`].includes(t)}function hl(e,t){let n=document.createElement(`div`);return n.id=e,n.style.setProperty(`display`,`none`),n.textContent=t,n}function gl(e){let t=document.createElement(`div`);return t.id=e,t.setAttribute(`role`,`status`),t.setAttribute(`aria-live`,`polite`),t.setAttribute(`aria-atomic`,`true`),t.style.setProperty(`position`,`fixed`),t.style.setProperty(`width`,`1px`),t.style.setProperty(`height`,`1px`),t.style.setProperty(`margin`,`-1px`),t.style.setProperty(`border`,`0`),t.style.setProperty(`padding`,`0`),t.style.setProperty(`overflow`,`hidden`),t.style.setProperty(`clip`,`rect(0 0 0 0)`),t.style.setProperty(`clip-path`,`inset(100%)`),t.style.setProperty(`white-space`,`nowrap`),t}var _l=[`dragover`,`dragmove`],vl=class extends R{constructor(e,t){super(e);let{id:n,idPrefix:{description:r=ul,announcement:i=dl}={},announcements:a=pl,screenReaderInstructions:o=fl,debounce:s=500}=t??{},c=n?`${r}-${n}`:Pc(r),l=n?`${i}-${n}`:Pc(i),u,d,f,p,m=(e=p)=>{!f||!e||f?.nodeValue!==e&&(f.nodeValue=e)},h=()=>Ks.schedule(m),g=yl(h,s),_=Object.entries(a).map(([e,t])=>this.manager.monitor.addEventListener(e,(n,r)=>{let i=f;if(!i)return;let a=t?.(n,r);a&&i.nodeValue!==a&&(p=a,_l.includes(e)?g():(h(),g.cancel()))})),v=()=>{let e=[];u?.isConnected||(u=hl(c,o.draggable),e.push(u)),d?.isConnected||(d=gl(l),f=document.createTextNode(``),d.appendChild(f),e.push(d)),e.length>0&&document.body.append(...e)},y=new Set;function b(){for(let e of y)e()}this.registerEffect(()=>{y.clear();for(let e of this.manager.registry.draggables.value){let t=e.handle??e.element;if(t){(!u||!d)&&y.add(v),(!ml(t)||Yo())&&!t.hasAttribute(`tabindex`)&&y.add(()=>t.setAttribute(`tabindex`,`0`)),!t.hasAttribute(`role`)&&t.tagName.toLowerCase()!==`button`&&y.add(()=>t.setAttribute(`role`,ll.role)),t.hasAttribute(`aria-roledescription`)||y.add(()=>t.setAttribute(`aria-roledescription`,ll.roleDescription)),t.hasAttribute(`aria-describedby`)||y.add(()=>t.setAttribute(`aria-describedby`,c));for(let n of[`aria-pressed`,`aria-grabbed`]){let r=String(e.isDragging);t.getAttribute(n)!==r&&y.add(()=>t.setAttribute(n,r))}let n=String(e.disabled);t.getAttribute(`aria-disabled`)!==n&&y.add(()=>t.setAttribute(`aria-disabled`,n))}}y.size>0&&Ks.schedule(b)}),this.destroy=()=>{super.destroy(),u?.remove(),d?.remove(),_.forEach(e=>e())}}};function yl(e,t){let n,r=()=>{clearTimeout(n),n=setTimeout(e,t)};return r.cancel=()=>clearTimeout(n),r}var bl=new Map,xl,Sl,Cl,wl,Tl,El,Dl,Ol,kl,Al,jl,Ml,Nl,Pl=class extends (Tl=ji,wl=[A],Cl=[j],Sl=[j],xl=[j],Tl){constructor(e,t){super(e,t),G(Dl,5,this),q(this,kl),q(this,El,new Set),q(this,Ol,G(Dl,8,this,new Set)),G(Dl,11,this),this.registerEffect(cl(this,kl,Al))}register(e){return K(this,El).add(e),()=>{K(this,El).delete(e)}}addRoot(e){return O(()=>{let t=new Set(this.additionalRoots);t.add(e),this.additionalRoots=t}),()=>{O(()=>{let t=new Set(this.additionalRoots);t.delete(e),this.additionalRoots=t})}}get sourceRoot(){let{source:e}=this.manager.dragOperation;return Qo(e?.element??null)}get targetRoot(){let{target:e}=this.manager.dragOperation;return Qo(e?.element??null)}get roots(){let{status:e}=this.manager.dragOperation;if(e.initializing||e.initialized){let e=[this.sourceRoot,this.targetRoot].filter(e=>e!=null);return new Set([...e,...this.additionalRoots])}return new Set}};Dl=el(Tl),El=new WeakMap,Ol=new WeakMap,kl=new WeakSet,Al=function(){let{roots:e}=this,t=[];for(let n of e)for(let e of K(this,El))t.push(cl(this,kl,jl).call(this,n,e));return()=>{for(let e of t)e()}},jl=function(e,t){let n=bl.get(e);n||(n=new Map,bl.set(e,n));let r=n.get(t);if(!r){let i=Ro(e)?cl(this,kl,Ml).call(this,e,n,t):cl(this,kl,Nl).call(this,e,n,t);if(!i)return()=>{};r=i,n.set(t,r)}r.refCount++;let i=!1;return()=>{i||(i=!0,r.refCount--,r.refCount===0&&r.cleanup())}},Ml=function(e,t,n){let r=e.createElement(`style`),{nonce:i}=this.options??{};i&&r.setAttribute(`nonce`,i),r.textContent=n,e.head.prepend(r);let a=new MutationObserver(t=>{for(let n of t)for(let t of Array.from(n.removedNodes))if(t===r){e.head.prepend(r);return}});return a.observe(e.head,{childList:!0}),{refCount:0,cleanup:()=>{a.disconnect(),r.remove(),t.delete(n),t.size===0&&bl.delete(e)}}},Nl=function(e,t,n){`adoptedStyleSheets`in e&&Array.isArray(e.adoptedStyleSheets);let{CSSStyleSheet:r}=e.ownerDocument.defaultView??{};if(!r)return null;let i=new r;return i.replaceSync(n),e.adoptedStyleSheets.push(i),{refCount:0,cleanup:()=>{if(Zo(e)&&e.host?.isConnected){let t=e.adoptedStyleSheets.indexOf(i);t!==-1&&e.adoptedStyleSheets.splice(t,1)}t.delete(n),t.size===0&&bl.delete(e)}}},al(Dl,4,`additionalRoots`,wl,Pl,Ol),al(Dl,2,`sourceRoot`,Cl,Pl),al(Dl,2,`targetRoot`,Sl,Pl),al(Dl,2,`roots`,xl,Pl),il(Dl,Pl),Pl.configure=Ti(Pl);var Fl=Pl,Il=class extends R{constructor(e,t){super(e,t),this.manager=e;let{cursor:n=`grabbing`}=t??{},r=e.registry.plugins.get(Fl)?.register(`* { cursor: ${n} !important; }`);if(r){let e=this.destroy.bind(this);this.destroy=()=>{r(),e()}}}},Ll=`data-dnd-`,Rl=`${Ll}dropping`,Y=`--dnd-`,zl=`${Ll}dragging`,Bl=`${Ll}placeholder`,Vl=[zl,Bl,`popover`,`aria-pressed`,`aria-grabbing`],Hl=[`view-transition-name`],Ul=`
  :is(:root,:host) [${zl}] {
    position: fixed !important;
    pointer-events: none !important;
    touch-action: none;
    z-index: calc(infinity);
    will-change: translate;
    top: var(${Y}top, 0px) !important;
    left: var(${Y}left, 0px) !important;
    right: unset !important;
    bottom: unset !important;
    width: var(${Y}width, auto);
    max-width: var(${Y}width, auto);
    height: var(${Y}height, auto);
    max-height: var(${Y}height, auto);
    transform: var(${Y}transform, none) !important;
    transition: var(${Y}transition) !important;
  }

  :is(:root,:host) [${Bl}] {
    transition: none;
  }

  :is(:root,:host) [${Bl}='hidden'] {
    visibility: hidden;
  }

  [${zl}] * {
    pointer-events: none !important;
  }

  [${zl}]:not([${Rl}]) {
    translate: var(${Y}translate) !important;
  }

  [${zl}][style*='${Y}scale'] {
    scale: var(${Y}scale) !important;
    transform-origin: var(${Y}transform-origin) !important;
  }

  @layer dnd-kit {
    :where([${zl}][popover]) {
      overflow: visible;
      background: unset;
      border: unset;
      margin: unset;
      padding: unset;
      color: inherit;

      &:is(input, button) {
        border: revert;
        background: revert;
      }
    }
  }
  [${zl}]::backdrop, [${Ll}overlay]:not([${zl}]) {
    display: none;
    visibility: hidden;
  }
`.replace(/\n+/g,` `).replace(/\s+/g,` `).trim();function Wl(e,t=`hidden`){return O(()=>{let{element:n,manager:r}=e;if(!n||!r)return;let i=Gl(n,r.registry.droppables),a=[],o=es(n),{remove:s}=o;return Kl(i,o,a),ql(o,t),o.remove=()=>{a.forEach(e=>e()),s.call(o)},o})}function Gl(e,t){let n=new Map;for(let r of t)if(r.element&&(e===r.element||e.contains(r.element))){let e=`${Ll}${Pc(`dom-id`)}`;r.element.setAttribute(e,``),n.set(r,e)}return n}function Kl(e,t,n){for(let[r,i]of e){if(!r.element)continue;let e=`[${i}]`,a=t.matches(e)?t:t.querySelector(e);if(r.element.removeAttribute(i),!a)continue;let o=r.element;r.proxy=a,a.removeAttribute(i),as.set(o,a),n.push(()=>{as.delete(o),r.proxy=void 0})}}function ql(e,t=`hidden`){e.setAttribute(`inert`,`true`),e.setAttribute(`tab-index`,`-1`),e.setAttribute(`aria-hidden`,`true`),e.setAttribute(Bl,t)}function Jl(e,t){return e===t||cs(e)===cs(t)}function Yl(e){let{target:t}=e;`newState`in e&&e.newState===`closed`&&Oc(t)&&t.hasAttribute(`popover`)&&requestAnimationFrame(()=>Vs(t))}function Xl(e){return e.tagName===`TR`}function Zl(e,t,n){let r=new MutationObserver(r=>{let i=!1;for(let n of r){if(n.target!==e){i=!0;continue}if(n.type!==`attributes`)continue;let r=n.attributeName;if(r.startsWith(`aria-`)||Vl.includes(r))continue;let a=e.getAttribute(r);if(r===`style`){if(Ec(e)&&Ec(t)){let n=e.style;for(let e of Array.from(t.style))n.getPropertyValue(e)===``&&t.style.removeProperty(e);for(let e of Array.from(n)){if(Hl.includes(e)||e.startsWith(Y))continue;let r=n.getPropertyValue(e);t.style.setProperty(e,r)}}}else a===null?t.removeAttribute(r):t.setAttribute(r,a)}i&&n&&t.replaceChildren(...e.cloneNode(!0).childNodes)});return r.observe(e,{attributes:!0,subtree:!0,childList:!0}),r}function Ql(e,t,n){let r=new MutationObserver(r=>{for(let i of r)if(i.addedNodes.length!==0)for(let r of Array.from(i.addedNodes)){if(r.contains(e)&&e.nextElementSibling!==t){e.insertAdjacentElement(`afterend`,t),Vs(n);return}if(r.contains(t)&&t.previousElementSibling!==e){t.insertAdjacentElement(`beforebegin`,e),Vs(n);return}}e.isConnected&&t.isConnected&&e.nextElementSibling!==t&&(e.insertAdjacentElement(`afterend`,t),Vs(n))});return r.observe(e.ownerDocument.body,{childList:!0,subtree:!0}),r}function $l(e){return new ResizeObserver(()=>{var t;let n=new wc(e.placeholder,{frameTransform:e.frameTransform,ignoreTransforms:!0}),r=e.transformOrigin??{x:1,y:1},i=(e.width-n.width)*r.x+e.delta.x,a=(e.height-n.height)*r.y+e.delta.y,o=Xo();if(e.styles.set({width:n.width-e.widthOffset,height:n.height-e.heightOffset,top:e.top+a+o.y,left:e.left+i+o.x},Y),(t=e.getElementMutationObserver())==null||t.takeRecords(),Xl(e.element)&&Xl(e.placeholder)){let t=Array.from(e.element.cells),n=Array.from(e.placeholder.cells);e.getSavedCellWidths()||e.setSavedCellWidths(t.map(e=>e.style.width));for(let[e,r]of t.entries()){let t=n[e];r.style.width=`${t.getBoundingClientRect().width}px`}}let s=e.getTranslate()??{x:0,y:0},c=e.left+i+o.x+s.x,l=e.top+a+o.y+s.y,u=n.width-e.widthOffset,d=n.height-e.heightOffset,f=e.frameTransform;e.dragOperation.shape=new Ur(c*f.scaleX+f.x,l*f.scaleY+f.y,u*f.scaleX,d*f.scaleY)})}var eu=250,tu=`ease`;function nu(e){var t;let{animation:n}=e;if(typeof n==`function`){let t=n({source:e.source,element:e.element,feedbackElement:e.feedbackElement,placeholder:e.placeholder,translate:e.translate,moved:e.moved});Promise.resolve(t).then(()=>{e.cleanup(),requestAnimationFrame(e.restoreFocus)});return}let{duration:r=eu,easing:i=tu}=n??{};Vs(e.feedbackElement);let[,a]=No(e.feedbackElement,e=>`translate`in e)??[];a?.pause();let o=e.placeholder??e.element,s={frameTransform:Jl(e.feedbackElement,o)?null:void 0},c=new wc(e.feedbackElement,s),l=ac(Xs(e.feedbackElement).translate)??e.translate,u=new wc(o,s),d=Ur.delta(c,u,e.alignment),f={x:l.x-d.x,y:l.y-d.y},p=Math.round(c.intrinsicHeight)===Math.round(u.intrinsicHeight)?{}:{minHeight:[`${c.intrinsicHeight}px`,`${u.intrinsicHeight}px`],maxHeight:[`${c.intrinsicHeight}px`,`${u.intrinsicHeight}px`]},m=Math.round(c.intrinsicWidth)===Math.round(u.intrinsicWidth)?{}:{minWidth:[`${c.intrinsicWidth}px`,`${u.intrinsicWidth}px`],maxWidth:[`${c.intrinsicWidth}px`,`${u.intrinsicWidth}px`]};e.styles.set({transition:e.transition},Y),e.feedbackElement.setAttribute(Rl,``),(t=e.getElementMutationObserver())==null||t.takeRecords(),_c({element:e.feedbackElement,keyframes:Zc(Xc(Xc({},p),m),{translate:[`${l.x}px ${l.y}px 0`,`${f.x}px ${f.y}px 0`]}),options:{duration:$o(Lo(e.feedbackElement))?0:e.moved||e.feedbackElement!==e.element?r:0,easing:i}}).then(()=>{e.feedbackElement.removeAttribute(Rl),a?.finish(),e.cleanup(),requestAnimationFrame(e.restoreFocus)})}var ru,iu,au,ou,su,cu,lu,uu=class extends (iu=R,ru=[A],iu){constructor(e,t){super(e,t),q(this,su),q(this,ou,G(au,8,this)),G(au,11,this),this.state={initial:{},current:{}};let n=e.registry.plugins.get(Fl),r=n?.register(Ul);if(r){let e=this.destroy.bind(this);this.destroy=()=>{r(),e()}}this.registerEffect(cl(this,su,cu).bind(this,n)),this.registerEffect(cl(this,su,lu))}};au=el(iu),ou=new WeakMap,su=new WeakSet,cu=function(e){let{overlay:t}=this;if(!t||!e)return;let n=Qo(t);if(n)return e.addRoot(n)},lu=function(){let{state:e,manager:t,options:n}=this,{dragOperation:r}=t,{position:i,source:a,status:o}=r;if(o.idle){e.current={},e.initial={};return}if(!a)return;let{element:s}=a,c=a.pluginConfig(uu),l=c?.feedback??n?.feedback??`default`,u=typeof l==`function`?l(a,t):l;if(!s||u===`none`||!o.initialized||o.initializing)return;let{initial:d}=e,f=this.overlay??s,p=nc(f),m=nc(s),h=!Jl(s,f),g=new wc(s,{frameTransform:h?m:null,ignoreTransforms:!h}),_={x:m.scaleX/p.scaleX,y:m.scaleY/p.scaleY},{width:v,height:y,top:b,left:ee}=g;h&&(v/=_.x,y/=_.y);let te=new Dc(f),ne=Xs(s),{transition:re,translate:ie,boxSizing:ae,paddingBlockStart:oe,paddingBlockEnd:se,paddingInlineStart:ce,paddingInlineEnd:le,borderInlineStartWidth:ue,borderInlineEndWidth:de,borderBlockStartWidth:fe,borderBlockEndWidth:pe}=ne,me=re.split(`,`).filter(e=>!/^\s*(transform|translate|scale)\b/.test(e)).join(`,`),he=oc(ne),ge=ne.transform,_e=u===`clone`,ve=ae===`content-box`,ye=ve?parseInt(ce)+parseInt(le)+parseInt(ue)+parseInt(de):0,be=ve?parseInt(oe)+parseInt(se)+parseInt(fe)+parseInt(pe):0,xe=u!==`move`&&!this.overlay?Wl(a,_e?`clone`:`hidden`):null,Se=O(()=>kc(t.dragOperation.activatorEvent));if(!d.translate){if(this.overlay&&he)d.translate={x:he.x,y:he.y};else if(ie!==`none`){let e=ac(ie);e&&(d.translate=e)}}if(!d.transformOrigin){let e=O(()=>i.current),t=ee+(he?.x??0),n=b+(he?.y??0);d.transformOrigin={x:(e.x-t*p.scaleX-p.x)/(v*p.scaleX),y:(e.y-n*p.scaleY-p.y)/(y*p.scaleY)}}let{transformOrigin:Ce}=d,we=b*p.scaleY+p.y,Te=ee*p.scaleX+p.x;if(!d.coordinates&&(d.coordinates={x:Te,y:we},_.x!==1||_.y!==1)){let{scaleX:e,scaleY:t}=m,{x:n,y:r}=Ce;d.coordinates.x+=(v*e-v)*n,d.coordinates.y+=(y*t-y)*r}d.dimensions||={width:v,height:y},d.frameTransform||=p;let Ee={x:d.coordinates.x-Te,y:d.coordinates.y-we},De={width:(d.dimensions.width*d.frameTransform.scaleX-v*p.scaleX)*Ce.x,height:(d.dimensions.height*d.frameTransform.scaleY-y*p.scaleY)*Ce.y},Oe={x:Ee.x/p.scaleX+De.width,y:Ee.y/p.scaleY+De.height},ke={left:ee+Oe.x,top:b+Oe.y};f.setAttribute(zl,`true`);let Ae=O(()=>r.transform),x=d.translate??{x:0,y:0},je=Ae.x*p.scaleX+x.x,Me=Ae.y*p.scaleY+x.y,Ne=Xo();te.set({width:v-ye,height:y-be,top:ke.top+Ne.y,left:ke.left+Ne.x,translate:`${je}px ${Me}px 0`,transform:this.overlay?`none`:ge,transition:me?`${me}, translate 0ms linear`:`translate 0ms linear`,scale:h?`${_.x} ${_.y}`:``,"transform-origin":`${Ce.x*100}% ${Ce.y*100}%`},Y),xe&&(s.insertAdjacentElement(`afterend`,xe),n?.rootElement&&(typeof n.rootElement==`function`?n.rootElement(a):n.rootElement).appendChild(s)),Bs(f)&&(f.hasAttribute(`popover`)||f.setAttribute(`popover`,`manual`),Vs(f),f.addEventListener(`beforetoggle`,Yl));let Pe,Fe,Ie,Le=$l({placeholder:xe,element:s,feedbackElement:f,frameTransform:p,transformOrigin:Ce,width:v,height:y,top:b,left:ee,widthOffset:ye,heightOffset:be,delta:Oe,styles:te,dragOperation:r,getTranslate:()=>e.current.translate,getElementMutationObserver:()=>Pe,getSavedCellWidths:()=>Ie,setSavedCellWidths:e=>{Ie=e}}),Re=new wc(f);O(()=>r.shape=Re);let ze=Lo(f),Be=e=>{this.manager.actions.stop({event:e})},Ve=$o(ze);Se&&ze.addEventListener(`resize`,Be),O(()=>a.status)===`idle`&&requestAnimationFrame(()=>a.status=`dragging`),xe&&(Le.observe(xe),Pe=Zl(s,xe,_e),Fe=Ql(s,xe,f));let S=t.dragOperation.source?.id,He=()=>{if(!Se||S==null)return;let e=t.registry.draggables.get(S),n=e?.handle??e?.element;zo(n)&&n.focus()},Ue=()=>{if(Pe?.disconnect(),Fe?.disconnect(),Le.disconnect(),ze.removeEventListener(`resize`,Be),Bs(f)&&(f.removeEventListener(`beforetoggle`,Yl),f.removeAttribute(`popover`)),f.removeAttribute(zl),te.reset(),Ie&&Xl(s)){let e=Array.from(s.cells);for(let[t,n]of e.entries())n.style.width=Ie[t]??``}a.status=`idle`;let t=e.current.translate!=null,n=r.status.dragging;xe&&(!n&&t||xe.parentElement!==f.parentElement)&&f.isConnected&&xe.replaceWith(f),xe?.remove()},We=n?.dropAnimation,C=this,Ge=Jn(()=>{let{transform:t,status:i}=r;if(!(!t.x&&!t.y&&!e.current.translate)&&i.dragging){let i=d.translate??{x:0,y:0},a={x:t.x/p.scaleX+i.x,y:t.y/p.scaleY+i.y},o=e.current.translate,s=O(()=>r.modifiers),c=O(()=>r.shape?.current),l=n?.keyboardTransition,u=Se&&!Ve&&l!==null?`${l?.duration??250}ms ${l?.easing??`cubic-bezier(0.25, 1, 0.5, 1)`}`:`0ms linear`;if(te.set({transition:me?`${me}, translate ${u}`:`translate ${u}`,translate:`${a.x}px ${a.y}px 0`},Y),Pe?.takeRecords(),c&&c!==Re&&o&&!s.length){let e=Hr.delta(a,o);r.shape=Ur.from(c.boundingRectangle).translate(e.x*p.scaleX,e.y*p.scaleY)}else r.shape=new wc(f);e.current.translate=a}},function(){if(r.status.dropped){this.dispose(),a.status=`dropping`;let n=c?.dropAnimation===void 0?C.dropAnimation===void 0?We:C.dropAnimation:c.dropAnimation,r=e.current.translate,i=r!=null;if(!r&&s!==f&&(r={x:0,y:0}),!r||n===null){Ue();return}t.renderer.rendering.then(()=>{nu({source:a,element:s,feedbackElement:f,placeholder:xe,translate:r,moved:i,transition:re,alignment:a.alignment,styles:te,animation:n??void 0,getElementMutationObserver:()=>Pe,cleanup:Ue,restoreFocus:He})})}});return()=>{Ue(),Ge()}},al(au,4,`overlay`,ru,uu,ou),il(au,uu),uu.configure=Ti(uu);var du=uu,fu=!0,pu=!1,mu,hu,gu,_u=(gu=[A],cc.Forward),vu,yu,bu;hu=(mu=[A],cc.Reverse);var xu=class{constructor(){q(this,yu,G(vu,8,this,fu)),G(vu,11,this),q(this,bu,G(vu,12,this,fu)),G(vu,15,this)}isLocked(e){return e===cc.Idle?!1:e==null?this[cc.Forward]===fu&&this[cc.Reverse]===fu:this[e]===fu}unlock(e){e!==cc.Idle&&(this[e]=pu)}};vu=el(null),yu=new WeakMap,bu=new WeakMap,al(vu,4,_u,gu,xu,yu),al(vu,4,hu,mu,xu,bu),il(vu,xu);var Su=[cc.Forward,cc.Reverse],Cu=class{constructor(){this.x=new xu,this.y=new xu}isLocked(){return this.x.isLocked()&&this.y.isLocked()}},wu=class extends R{constructor(e){super(e);let t=sn(new Cu),n=null;this.signal=t,_n(()=>{let{status:r}=e.dragOperation;if(!r.initialized){n=null,t.value=new Cu;return}let{delta:i}=e.dragOperation.position;if(n){let e={x:Tu(i.x,n.x),y:Tu(i.y,n.y)},r=t.peek();E(()=>{for(let t of $r)for(let n of Su)e[t]===n&&r[t].unlock(n);t.value=r})}n=i})}get current(){return this.signal.peek()}};function Tu(e,t){return Math.sign(e-t)}var Eu,Du,Ou,ku,Au,ju,Mu=class extends (Du=ji,Eu=[A],Du){constructor(e){super(e),q(this,ku,G(Ou,8,this,!1)),G(Ou,11,this),q(this,Au),q(this,ju,()=>{if(!K(this,Au))return;let{element:e,by:t}=K(this,Au);t.y&&(e.scrollTop+=t.y),t.x&&(e.scrollLeft+=t.x)}),this.scroll=(e,t)=>{if(this.disabled)return!1;let n=this.getScrollableElements();if(!n)return J(this,Au,void 0),!1;let{position:r}=this.manager.dragOperation,i=r?.current;if(i){let{by:r}=e??{},a=r?{x:Nu(r.x),y:Nu(r.y)}:void 0,o=a?void 0:this.scrollIntentTracker.current;if(o?.isLocked())return!1;for(let e of n){let n=Ws(e,r);if(n.x||n.y){let{speed:n,direction:s}=dc(e,i,a,t?.acceleration,t?.threshold);if(o)for(let e of $r)o[e].isLocked(s[e])&&(n[e]=0,s[e]=0);if(s.x||s.y){let{x:t,y:i}=r??s,a=t*n.x,o=i*n.y;if(a||o){let t=K(this,Au)?.by;if(this.autoScrolling&&t&&(t.x&&!a||t.y&&!o))continue;return J(this,Au,{element:e,by:{x:a,y:o}}),Ks.schedule(K(this,ju)),!0}}}}}return J(this,Au,void 0),!1};let t=null,n=null,r=Gn(()=>{let{position:n,source:r}=e.dragOperation;if(!n)return null;let i=rs(Qo(r?.element),n.current);return i&&(t=i),i??t}),i=Gn(()=>{let t=r.value,{documentElement:i}=Vo(t);if(!t||t===i){let{target:t}=e.dragOperation,r=t?.element;if(r){let e=tc(r,{excludeElement:!1});return n=e,e}}if(t){let e=tc(t,{excludeElement:!1});return this.autoScrolling&&n&&e.size<n?.size?n:(n=e,e)}return n=null,null},Kn);this.getScrollableElements=()=>i.value,this.scrollIntentTracker=new wu(e),this.destroy=e.monitor.addEventListener(`dragmove`,t=>{this.disabled||t.defaultPrevented||!kc(e.dragOperation.activatorEvent)||!t.by||this.scroll({by:t.by})&&t.preventDefault()})}};Ou=el(Du),ku=new WeakMap,Au=new WeakMap,ju=new WeakMap,al(Ou,4,`autoScrolling`,Eu,Mu,ku),il(Ou,Mu);function Nu(e){return e>0?cc.Forward:e<0?cc.Reverse:cc.Idle}var Pu=new class{constructor(e){this.scheduler=e,this.pending=!1,this.tasks=new Set,this.resolvers=new Set,this.flush=()=>{let{tasks:e,resolvers:t}=this;this.pending=!1,this.tasks=new Set,this.resolvers=new Set;for(let t of e)t();for(let e of t)e()}}schedule(e){return this.tasks.add(e),this.pending||(this.pending=!0,this.scheduler(this.flush)),new Promise(e=>this.resolvers.add(e))}}(e=>{typeof requestAnimationFrame==`function`?requestAnimationFrame(e):e()}),Fu=10,Iu=class extends R{constructor(e,t){super(e,t);let n=e.registry.plugins.get(Mu);if(!n)throw Error(`AutoScroller plugin depends on Scroller plugin`);this.destroy=_n(()=>{if(this.disabled)return;let{position:t,status:r}=e.dragOperation;if(r.dragging){let e={acceleration:this.options?.acceleration,threshold:typeof this.options?.threshold==`number`?{x:this.options.threshold,y:this.options.threshold}:this.options?.threshold};if(n.scroll(void 0,e)){n.autoScrolling=!0;let t=setInterval(()=>Pu.schedule(()=>n.scroll(void 0,e)),Fu);return()=>{clearInterval(t)}}n.autoScrolling=!1}})}};Iu.configure=Ti(Iu);var Lu=Iu,Ru={capture:!0,passive:!0},zu,Bu=class extends ji{constructor(e){super(e),q(this,zu),this.handleScroll=()=>{K(this,zu)??J(this,zu,setTimeout(()=>{this.manager.collisionObserver.forceUpdate(!1),J(this,zu,void 0)},50))};let{dragOperation:t}=this.manager;this.destroy=_n(()=>{if(t.status.dragging){let e=t.source?.element?.ownerDocument??document;return e.addEventListener(`scroll`,this.handleScroll,Ru),()=>{e.removeEventListener(`scroll`,this.handleScroll,Ru)}}})}};zu=new WeakMap;var Vu=`* { user-select: none !important; -webkit-user-select: none !important; }`,Hu=class extends R{constructor(e){super(e),this.manager=e;let t=e.registry.plugins.get(Fl)?.register(Vu);if(this.destroy=_n(()=>{let{dragOperation:e}=this.manager;if(e.status.initialized)return Uu(),document.addEventListener(`selectionchange`,Uu,{capture:!0}),()=>{document.removeEventListener(`selectionchange`,Uu,{capture:!0})}}),t){let e=this.destroy.bind(this);this.destroy=()=>{t(),e()}}}};function Uu(){var e;(e=document.getSelection())==null||e.removeAllRanges()}var Wu=Object.freeze({offset:10,keyboardCodes:{start:[`Space`,`Enter`],cancel:[`Escape`],end:[`Space`,`Enter`,`Tab`],up:[`ArrowUp`],down:[`ArrowDown`],left:[`ArrowLeft`],right:[`ArrowRight`]},preventActivation(e,t){let n=t.handle??t.element;return e.target!==n}}),Gu,Ku=class extends za{constructor(e,t){super(e),this.manager=e,this.options=t,q(this,Gu,[]),this.listeners=new ss,this.handleSourceKeyDown=(e,t,n)=>{if(this.disabled||e.defaultPrevented||!Oc(e.target)||t.disabled)return;let{keyboardCodes:r=Wu.keyboardCodes,preventActivation:i=Wu.preventActivation}=n??{};r.start.includes(e.code)&&this.manager.dragOperation.status.idle&&(i?.(e,t)||this.handleStart(e,t,n))}}bind(e,t=this.options){return _n(()=>{let n=e.handle??e.element,r=n=>{kc(n)&&this.handleSourceKeyDown(n,e,t)};if(n)return n.addEventListener(`keydown`,r),()=>{n.removeEventListener(`keydown`,r)}})}handleStart(e,t,n){let{element:r}=t;if(!r)throw Error(`Source draggable does not have an associated element`);e.preventDefault(),e.stopImmediatePropagation(),fc(r);let{center:i}=new wc(r);if(this.manager.actions.start({event:e,coordinates:{x:i.x,y:i.y},source:t}).signal.aborted)return this.cleanup();this.sideEffects();let a=Vo(r),o=[this.listeners.bind(a,[{type:`keydown`,listener:e=>this.handleKeyDown(e,t,n),options:{capture:!0}}])];K(this,Gu).push(...o)}handleKeyDown(e,t,n){let{keyboardCodes:r=Wu.keyboardCodes}=n??{};if(Ju(e,[...r.end,...r.cancel])){e.preventDefault();let t=Ju(e,r.cancel);this.handleEnd(e,t);return}Ju(e,r.up)?this.handleMove(`up`,e):Ju(e,r.down)&&this.handleMove(`down`,e),Ju(e,r.left)?this.handleMove(`left`,e):Ju(e,r.right)&&this.handleMove(`right`,e)}handleEnd(e,t){this.manager.actions.stop({event:e,canceled:t}),this.cleanup()}handleMove(e,t){let{shape:n}=this.manager.dragOperation,r=t.shiftKey?5:1,i={x:0,y:0},a=this.options?.offset??Wu.offset;if(typeof a==`number`&&(a={x:a,y:a}),n){switch(e){case`up`:i={x:0,y:-a.y*r};break;case`down`:i={x:0,y:a.y*r};break;case`left`:i={x:-a.x*r,y:0};break;case`right`:i={x:a.x*r,y:0}}(i.x||i.y)&&(t.preventDefault(),this.manager.actions.move({event:t,by:i}))}}sideEffects(){let e=this.manager.registry.plugins.get(Lu);e?.disabled===!1&&(e.disable(),K(this,Gu).push(()=>{e.enable()}))}cleanup(){K(this,Gu).forEach(e=>e()),J(this,Gu,[])}destroy(){this.cleanup(),this.listeners.clear()}};Gu=new WeakMap,Ku.configure=Ti(Ku),Ku.defaults=Wu;var qu=Ku;function Ju(e,t){return t.includes(e.code)}var Yu,Xu=class extends Ha{constructor(){super(...arguments),q(this,Yu)}onEvent(e){switch(e.type){case`pointerdown`:J(this,Yu,Ko(e));break;case`pointermove`:if(!K(this,Yu))return;let{x:t,y:n}=Ko(e),r={x:t-K(this,Yu).x,y:n-K(this,Yu).y},{tolerance:i}=this.options;if(i&&Zr(r,i)){this.abort();return}Zr(r,this.options.value)&&this.activate(e);break;case`pointerup`:this.abort()}}abort(){J(this,Yu,void 0)}};Yu=new WeakMap;var Zu,Qu,$u=class extends Ha{constructor(){super(...arguments),q(this,Zu),q(this,Qu)}onEvent(e){switch(e.type){case`pointerdown`:J(this,Qu,Ko(e)),J(this,Zu,setTimeout(()=>this.activate(e),this.options.value));break;case`pointermove`:if(!K(this,Qu))return;let{x:t,y:n}=Ko(e);Zr({x:t-K(this,Qu).x,y:n-K(this,Qu).y},this.options.tolerance)&&this.abort();break;case`pointerup`:this.abort()}}abort(){K(this,Zu)&&(clearTimeout(K(this,Zu)),J(this,Qu,void 0),J(this,Zu,void 0))}};Zu=new WeakMap,Qu=new WeakMap;var ed=class{};ed.Delay=$u,ed.Distance=Xu;var td=Object.freeze({activationConstraints(e,t){let{pointerType:n,target:r}=e;if(!(n===`mouse`&&Oc(r)&&(t.handle===r||t.handle?.contains(r))))return n===`touch`?[new ed.Delay({value:250,tolerance:5})]:jc(r)&&!e.defaultPrevented?[new ed.Delay({value:200,tolerance:0})]:[new ed.Delay({value:200,tolerance:10}),new ed.Distance({value:5})]},preventActivation(e,t){let{target:n}=e;return n===t.element||n===t.handle||!Oc(n)||t.handle?.contains(n)?!1:os(n)}}),nd,rd=class extends za{constructor(e,t){super(e),this.manager=e,this.options=t,q(this,nd,new Set),this.listeners=new ss,this.latest={event:void 0,coordinates:void 0},this.handleMove=()=>{let{event:e,coordinates:t}=this.latest;!e||!t||this.manager.actions.move({event:e,to:t})},this.handleCancel=this.handleCancel.bind(this),this.handlePointerUp=this.handlePointerUp.bind(this),this.handleKeyDown=this.handleKeyDown.bind(this)}activationConstraints(e,t,n=this.options){let{activationConstraints:r=td.activationConstraints}=n??{};return typeof r==`function`?r(e,t):r}bind(e,t=this.options){return _n(()=>{let n=new AbortController,{signal:r}=n,i=n=>{Ac(n)&&this.handlePointerDown(n,e,t)},a=[e.handle??e.element];t?.activatorElements&&(a=Array.isArray(t.activatorElements)?t.activatorElements:t.activatorElements(e));for(let e of a)e&&(ld(e.ownerDocument.defaultView),e.addEventListener(`pointerdown`,i,{signal:r}));return()=>n.abort()})}handlePointerDown(e,t,n){if(this.disabled||!e.isPrimary||e.button!==0||!Oc(e.target)||t.disabled||ad(e)||!this.manager.dragOperation.status.idle)return;let{preventActivation:r=td.preventActivation}=n??{};if(r?.(e,t))return;let{target:i}=e,a=zo(i)&&i.draggable&&i.getAttribute(`draggable`)===`true`,o=nc(t.element),{x:s,y:c}=Ko(e);this.initialCoordinates={x:s*o.scaleX+o.x,y:c*o.scaleY+o.y};let l=this.activationConstraints(e,t,n);e.sensor=this;let u=new Ba(l,e=>this.handleStart(t,e));u.signal.onabort=()=>this.handleCancel(e),u.onEvent(e),this.controller=u;let d=Jo(),f=this.listeners.bind(d,[{type:`pointermove`,listener:e=>this.handlePointerMove(e,t)},{type:`pointerup`,listener:this.handlePointerUp,options:{capture:!0}},{type:`pointercancel`,listener:this.handleCancel},{type:`dragstart`,listener:a?this.handleCancel:od,options:{capture:!0}}]);K(this,nd).add(()=>{f(),this.initialCoordinates=void 0})}handlePointerMove(e,t){var n;if(this.controller?.activated===!1){(n=this.controller)==null||n.onEvent(e);return}if(this.manager.dragOperation.status.dragging){let n=Ko(e),r=nc(t.element);n.x=n.x*r.scaleX+r.x,n.y=n.y*r.scaleY+r.y,e.preventDefault(),e.stopPropagation(),this.latest.event=e,this.latest.coordinates=n,Ks.schedule(this.handleMove)}}handlePointerUp(e){let{status:t}=this.manager.dragOperation;if(!t.idle){e.preventDefault(),e.stopPropagation();let n=!t.initialized;this.manager.actions.stop({event:e,canceled:n})}this.cleanup()}handleKeyDown(e){e.key===`Escape`&&(e.preventDefault(),this.handleCancel(e))}handleStart(e,t){let{manager:n,initialCoordinates:r}=this;if(!r||!n.dragOperation.status.idle||t.defaultPrevented)return;if(n.actions.start({coordinates:r,event:t,source:e}).signal.aborted)return this.cleanup();t.preventDefault();let i=Vo(t.target).body;try{i.setPointerCapture(t.pointerId)}catch{this.handleCancel(t);return}let a=Oc(t.target)?[t.target,i]:i,o=this.listeners.bind(a,[{type:`touchmove`,listener:od,options:{passive:!1}},{type:`click`,listener:od},{type:`contextmenu`,listener:od},{type:`keydown`,listener:this.handleKeyDown}]);K(this,nd).add(o)}handleCancel(e){let{dragOperation:t}=this.manager;t.status.initialized&&this.manager.actions.stop({event:e,canceled:!0}),this.cleanup()}cleanup(){let{controller:e}=this;this.controller=void 0,e&&!e.signal.aborted&&e.abort(),this.latest={event:void 0,coordinates:void 0},K(this,nd).forEach(e=>e()),K(this,nd).clear()}destroy(){this.cleanup(),this.listeners.clear()}};nd=new WeakMap,rd.configure=Ti(rd),rd.defaults=td;var id=rd;function ad(e){return`sensor`in e}function od(e){e.preventDefault()}function sd(){}var cd=new WeakSet;function ld(e){!e||cd.has(e)||(e.addEventListener(`touchmove`,sd,{capture:!1,passive:!1}),cd.add(e))}var ud={modifiers:[],plugins:[vl,Lu,Il,du,Hu],sensors:[id,qu]},dd=class extends po{constructor(e={}){let t=fo(e.plugins,ud.plugins),n=fo(e.sensors,ud.sensors),r=fo(e.modifiers,ud.modifiers);super(Zc(Xc({},e),{plugins:[Bu,Mu,Fl,...t],sensors:n,modifiers:r}))}},fd,pd,md,hd,gd,_d,vd=class extends (md=ca,pd=[A],fd=[A],md){constructor(e,t){var n=e,{element:r,effects:i=()=>[],handle:a}=n,o=$c(n,[`element`,`effects`,`handle`]);super(Xc({effects:()=>[...i(),()=>{let{manager:e}=this;if(!e)return;let t=(this.sensors?.map(Ei)??[...e.sensors]).map(t=>{let n=t instanceof za?t:e.registry.register(t.plugin),r=t instanceof za?void 0:t.options;return n.bind(this,r)});return function(){t.forEach(e=>e())}}]},o),t),q(this,gd,G(hd,8,this)),G(hd,11,this),q(this,_d,G(hd,12,this)),G(hd,15,this),this.element=r,this.handle=a}};hd=el(md),gd=new WeakMap,_d=new WeakMap,al(hd,4,`handle`,pd,vd,gd),al(hd,4,`element`,fd,vd,_d),il(hd,vd);var yd,bd,xd,Sd,Cd,wd,Td,Ed,Dd,Od,kd=class extends (xd=xa,bd=[A],yd=[A],xd){constructor(e,t){var n=e,{element:r,effects:i=()=>[]}=n,a=$c(n,[`element`,`effects`]);let{collisionDetector:o=Lc}=a,s=e=>{let{manager:t,element:n}=this;if(!n||e===null){this.shape=void 0;return}if(!t)return;let r=new wc(n),i=O(()=>this.shape);return r&&i?.equals(r)?i:(this.shape=r,r)},c=sn(!1);super(Zc(Xc({},a),{collisionDetector:o,effects:()=>[...i(),()=>{let{element:e,manager:t}=this;if(!t)return;let{dragOperation:n}=t,{source:r}=n;c.value=!!(r&&n.status.initialized&&e&&!this.disabled&&this.accepts(r))},()=>{let{element:e}=this;if(c.value&&e){let t=new zs(e,s);return()=>{t.disconnect(),this.shape=void 0}}},()=>{if(this.manager?.dragOperation.status.initialized)return()=>{this.shape=void 0}}]}),t),q(this,Dd),q(this,Cd,G(Sd,8,this)),G(Sd,11,this),q(this,Od,G(Sd,12,this)),G(Sd,15,this),this.element=r,this.refreshShape=()=>s()}set element(e){J(this,Dd,e,Ed)}get element(){return this.proxy??K(this,Dd,Td)}};Sd=el(xd),Cd=new WeakMap,Dd=new WeakSet,Od=new WeakMap,wd=al(Sd,20,`#element`,bd,Dd,Cd),Td=wd.get,Ed=wd.set,al(Sd,4,`proxy`,yd,kd,Od),il(Sd,kd);var Ad=class extends Ua{constructor(e,t){super(e,t),this.boundingRectangle=sn(null),this.destroy=_n(()=>{if(!this.options)return;let{dragOperation:t}=e,{status:n}=t;if(n.initialized){let{element:e}=this.options,n=typeof e==`function`?e(t):e;if(!n)return;let r,i=()=>{this.boundingRectangle.value=Po(n)},a=()=>{r||=setTimeout(()=>{i(),r=void 0},25)},o=new ResizeObserver(i);return o.observe(n),document.addEventListener(`scroll`,a,{passive:!0,capture:!0}),()=>{document.removeEventListener(`scroll`,a,{capture:!0}),o.disconnect(),this.boundingRectangle.value=null}}})}apply(e){let{shape:t,transform:n}=e;if(!t)return n;let r=this.boundingRectangle.value;if(!r)return n;let{initial:i,current:a}=t,{height:o,width:s}=a.boundingRectangle;return Eo(new Ur(i.center.x-s/2,i.center.y-o/2,s,o),n,r)}};Ad.configure=Ti(Ad);var jd=Ad,Md=Object.create,Nd=Object.defineProperty,Pd=Object.defineProperties,Fd=Object.getOwnPropertyDescriptor,Id=Object.getOwnPropertyDescriptors,Ld=Object.getOwnPropertySymbols,Rd=Object.prototype.hasOwnProperty,zd=Object.prototype.propertyIsEnumerable,Bd=(e,t)=>(t=Symbol[e])?t:Symbol.for(`Symbol.`+e),Vd=e=>{throw TypeError(e)},Hd=(e,t,n)=>t in e?Nd(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,Ud=(e,t)=>{for(var n in t||={})Rd.call(t,n)&&Hd(e,n,t[n]);if(Ld)for(var n of Ld(t))zd.call(t,n)&&Hd(e,n,t[n]);return e},Wd=(e,t)=>Pd(e,Id(t)),Gd=(e,t)=>{var n={};for(var r in e)Rd.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&Ld)for(var r of Ld(e))t.indexOf(r)<0&&zd.call(e,r)&&(n[r]=e[r]);return n},Kd=e=>[,,,Md(null)],qd=[`class`,`method`,`getter`,`setter`,`accessor`,`field`,`value`,`get`,`set`],Jd=e=>e!==void 0&&typeof e!=`function`?Vd(`Function expected`):e,Yd=(e,t,n,r,i)=>({kind:qd[e],name:t,metadata:r,addInitializer:e=>n._?Vd(`Already initialized`):i.push(Jd(e||null))}),Xd=(e,t)=>Hd(t,Bd(`metadata`),e[3]),Zd=(e,t,n,r)=>{for(var i=0,a=e[t>>1],o=a&&a.length;i<o;i++)t&1?a[i].call(n):r=a[i].call(n,r);return r},Qd=(e,t,n,r,i,a)=>{for(var o,s,c,l,u,d=t&7,f=!1,p=!1,m=e.length+1,h=qd[d+5],g=e[m-1]=[],_=e[m]||(e[m]=[]),v=(i=i.prototype,Fd({get[n](){return ef(this,a)},set[n](e){return nf(this,a,e)}},n)),y=r.length-1;y>=0;y--)l=Yd(d,n,c={},e[3],_),l.static=f,l.private=p,u=l.access={has:e=>n in e},u.get=e=>e[n],u.set=(e,t)=>e[n]=t,s=(0,r[y])({get:v.get,set:v.set},l),c._=1,s===void 0?Jd(s)&&(v[h]=s):typeof s!=`object`||!s?Vd(`Object expected`):(Jd(o=s.get)&&(v.get=o),Jd(o=s.set)&&(v.set=o),Jd(o=s.init)&&g.unshift(o));return v&&Nd(i,n,v),i},$d=(e,t,n)=>t.has(e)||Vd(`Cannot `+n),ef=(e,t,n)=>($d(e,t,`read from private field`),t.get(e)),tf=(e,t,n)=>t.has(e)?Vd(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),nf=(e,t,n,r)=>($d(e,t,`write to private field`),t.set(e,n),n);function rf(e){return e instanceof zf||e instanceof Rf}var af=10,of=class extends R{constructor(e){super(e);let t=_n(()=>{let{dragOperation:t}=e;if(kc(t.activatorEvent)&&rf(t.source)&&t.status.initialized){let t=e.registry.plugins.get(Mu);if(t)return t.disable(),()=>t.enable()}}),n=e.monitor.addEventListener(`dragmove`,(e,t)=>{queueMicrotask(()=>{if(this.disabled||e.defaultPrevented||!e.nativeEvent)return;let{dragOperation:n}=t;if(!kc(e.nativeEvent)||!rf(n.source)||!n.shape)return;let{actions:r,collisionObserver:i,registry:a}=t,{by:o}=e;if(!o)return;let s=sf(o),{source:c,target:l}=n,{center:u}=n.shape.current,d=[],f=[];E(()=>{for(let e of a.droppables){let{id:t}=e;if(!e.accepts(c)||t===l?.id&&rf(e)||!e.element)continue;let n=e.shape,r=new wc(e.element,{getBoundingClientRect:e=>Go(e,void 0,.2)});!r.height||!r.width||(s==`down`&&u.y+af<r.center.y||s==`up`&&u.y-af>r.center.y||s==`left`&&u.x-af>r.center.x||s==`right`&&u.x+af<r.center.x)&&(d.push(e),e.shape=r,f.push(()=>e.shape=n))}}),e.preventDefault(),i.disable();let p=i.computeCollisions(d,Rc);E(()=>f.forEach(e=>e()));let[m]=p;if(!m)return;let{id:h}=m,{index:g,group:_}=c.sortable;r.setDropTarget(h).then(()=>{let{source:e,target:t,shape:a}=n;if(!e||!rf(e)||!a)return;let{index:o,group:s,target:c}=e.sortable,l=g!==o||_!==s,u=l?c:t?.element;if(!u)return;fc(u);let d=new wc(u);if(!d)return;let f=Ur.delta(d,Ur.from(a.current.boundingRectangle),e.alignment);r.move({by:f}),l?r.setDropTarget(e.id).then(()=>i.enable()):i.enable()})})});this.destroy=()=>{n(),t()}}};function sf(e){let{x:t,y:n}=e;if(t>0)return`right`;if(t<0)return`left`;if(n>0)return`down`;if(n<0)return`up`}var cf=Object.defineProperty,lf=Object.defineProperties,uf=Object.getOwnPropertyDescriptors,df=Object.getOwnPropertySymbols,ff=Object.prototype.hasOwnProperty,pf=Object.prototype.propertyIsEnumerable,mf=(e,t,n)=>t in e?cf(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,hf=(e,t)=>{for(var n in t||={})ff.call(t,n)&&mf(e,n,t[n]);if(df)for(var n of df(t))pf.call(t,n)&&mf(e,n,t[n]);return e},gf=(e,t)=>lf(e,uf(t));function _f(e,t,n){if(t===n)return e;let r=e.slice();return r.splice(n,0,r.splice(t,1)[0]),r}function vf(e){return`initialIndex`in e&&typeof e.initialIndex==`number`&&`index`in e&&typeof e.index==`number`}function yf(e,t,n){let{source:r,target:i,canceled:a}=t.operation;if(!r||!i||a)return`preventDefault`in t&&t.preventDefault(),e;let o=(e,t)=>e===t||typeof e==`object`&&`id`in e&&e.id===t;if(Array.isArray(e)){let s=e.findIndex(e=>o(e,r.id)),c=e.findIndex(e=>o(e,i.id));if(s===-1||c===-1){if(vf(r)){let i=r.initialIndex,a=r.index;return i===a||i<0||i>=e.length?(`preventDefault`in t&&t.preventDefault(),e):n(e,i,a)}return e}if(!a&&`index`in r&&typeof r.index==`number`){let t=r.index;if(t!==s)return n(e,s,t)}return n(e,s,c)}let s=Object.entries(e),c=-1,l,u=-1,d;for(let[e,t]of s)if(c===-1&&(c=t.findIndex(e=>o(e,r.id)),c!==-1&&(l=e)),u===-1&&(u=t.findIndex(e=>o(e,i.id)),u!==-1&&(d=e)),c!==-1&&u!==-1)break;if(c===-1&&vf(r)){let i=r.initialGroup,a=r.initialIndex,o=r.group,s=r.index;if(i==null||o==null||!(i in e)||!(o in e)||i===o&&a===s)return`preventDefault`in t&&t.preventDefault(),e;if(i===o)return gf(hf({},e),{[i]:n(e[i],a,s)});let c=e[i][a];return gf(hf({},e),{[i]:[...e[i].slice(0,a),...e[i].slice(a+1)],[o]:[...e[o].slice(0,s),c,...e[o].slice(s)]})}if(!r.manager)return e;let{dragOperation:f}=r.manager,p=f.shape?.current.center??f.position.current;if(d==null&&i.id in e){let t=i.shape&&p.y>i.shape.center.y?e[i.id].length:0;d=i.id,u=t}if(l==null||d==null||l===d&&c===u){if(l!=null&&l===d&&c===u&&vf(r)){let t=r.group!=null&&r.group!==l,i=r.index!==c;if(t||i){let t=r.group??l;if(t in e){if(l===t)return gf(hf({},e),{[l]:n(e[l],c,r.index)});let i=e[l][c];return gf(hf({},e),{[l]:[...e[l].slice(0,c),...e[l].slice(c+1)],[t]:[...e[t].slice(0,r.index),i,...e[t].slice(r.index)]})}}}return`preventDefault`in t&&t.preventDefault(),e}if(l===d)return gf(hf({},e),{[l]:n(e[l],c,u)});let m=i.shape&&Math.round(p.y)>Math.round(i.shape.center.y)?1:0,h=e[l][c];return gf(hf({},e),{[l]:[...e[l].slice(0,c),...e[l].slice(c+1)],[d]:[...e[d].slice(0,u+m),h,...e[d].slice(u+m)]})}function bf(e,t){return yf(e,t,_f)}var xf=`__default__`,Sf=class extends R{constructor(e){super(e);let t=()=>{let t=new Map;for(let n of e.registry.droppables)if(n instanceof zf){let{sortable:e}=n,{group:r}=e,i=t.get(r);i||(i=new Set,t.set(r,i)),i.add(e)}for(let[e,n]of t)t.set(e,new Set(Tf(n)));return t},n=[e.monitor.addEventListener(`dragover`,(e,n)=>{if(this.disabled)return;let{dragOperation:r}=n,{source:i,target:a}=r;if(!rf(i)||!rf(a)||i.sortable===a.sortable)return;let o=t(),s=i.sortable.group===a.sortable.group,c=o.get(i.sortable.group),l=s?c:o.get(a.sortable.group);!c||!l||queueMicrotask(()=>{e.defaultPrevented||n.renderer.rendering.then(()=>{let r=t();for(let[e,t]of o.entries()){let n=Array.from(t).entries();for(let[t,i]of n)if(i.index!==t||i.group!==e||!r.get(e)?.has(i))return}let u=i.sortable.element,d=a.sortable.element;if(!d||!u||!s&&a.id===i.sortable.group)return;let f=Tf(c),p=s?f:Tf(l),m=i.sortable.group??xf,h=a.sortable.group??xf,g={[m]:f,[h]:p},_=bf(g,e);if(g===_)return;let v=_[h].indexOf(i.sortable),y=_[h].indexOf(a.sortable);n.collisionObserver.disable(),Cf(u,v,d,y),E(()=>{for(let[e,t]of _[m].entries())t.index=e;if(!s)for(let[e,t]of _[h].entries())t.group=a.sortable.group,t.index=e}),n.actions.setDropTarget(i.id).then(()=>n.collisionObserver.enable())})})}),e.monitor.addEventListener(`dragend`,(e,n)=>{if(!e.canceled)return;let{dragOperation:r}=n,{source:i}=r;rf(i)&&(i.sortable.initialIndex!==i.sortable.index||i.sortable.initialGroup!==i.sortable.group)&&queueMicrotask(()=>{let e=t(),r=e.get(i.sortable.initialGroup);r&&n.renderer.rendering.then(()=>{for(let[t,n]of e.entries()){let e=Array.from(n).entries();for(let[n,r]of e)if(r.index!==n||r.group!==t)return}let t=Tf(r),n=i.sortable.element,a=t[i.sortable.initialIndex],o=a?.element;!a||!o||!n||(Cf(n,a.index,o,i.index),E(()=>{for(let[t,n]of e.entries()){let e=Array.from(n).values();for(let t of e)t.index=t.initialIndex,t.group=t.initialGroup}}))})})})];this.destroy=()=>{for(let e of n)e()}}};function Cf(e,t,n,r){let i=r<t?`afterend`:`beforebegin`;n.insertAdjacentElement(i,e)}function wf(e,t){return e.index-t.index}function Tf(e){return Array.from(e).sort(wf)}var Ef=[of,Sf],Df={duration:250,easing:`cubic-bezier(0.25, 1, 0.5, 1)`,idle:!1},Of=new gr,kf,Af=[A],jf,Mf,Nf,Pf,Ff,If;kf=[A];var Lf=class{constructor(e,t){tf(this,Mf,Zd(jf,8,this)),Zd(jf,11,this),tf(this,Nf),tf(this,Pf),tf(this,Ff,Zd(jf,12,this)),Zd(jf,15,this),tf(this,If),this.register=()=>(E(()=>{var e,t;(e=this.manager)==null||e.registry.register(this.droppable),(t=this.manager)==null||t.registry.register(this.draggable)}),()=>this.unregister()),this.unregister=()=>{E(()=>{var e,t;(e=this.manager)==null||e.registry.unregister(this.droppable),(t=this.manager)==null||t.registry.unregister(this.draggable)})},this.destroy=()=>{E(()=>{this.droppable.destroy(),this.draggable.destroy()})};var n=e,{effects:r=()=>[],group:i,index:a,sensors:o,type:s,transition:c=Df,plugins:l}=n,u=Gd(n,[`effects`,`group`,`index`,`sensors`,`type`,`transition`,`plugins`]);let d=fo(l,Ef);this.droppable=new zf(u,t,this),this.draggable=new Rf(Wd(Ud({},u),{plugins:d,effects:()=>[()=>{let e=this.manager?.dragOperation.status;e?.initializing&&this.id===this.manager?.dragOperation.source?.id&&Of.clear(this.manager),e?.dragging&&Of.set(this.manager,this.id,O(()=>({initialIndex:this.index,initialGroup:this.group})))},()=>{let{index:e,group:t,manager:n}=this,r=ef(this,Pf),i=ef(this,Nf);(e!==r||t!==i)&&(nf(this,Pf,e),nf(this,Nf,t),this.animate())},()=>{let{target:e}=this,{isDragSource:t}=this.draggable;(this.draggable.pluginConfig(du)?.feedback??`default`)===`move`&&t&&(this.droppable.disabled=!e)},...r()],type:s,sensors:o}),t,this),nf(this,If,u.element),this.manager=t,this.index=a,nf(this,Pf,a),this.group=i,nf(this,Nf,i),this.type=s,this.transition=c}get initialIndex(){return Of.get(this.manager,this.id)?.initialIndex??this.index}get initialGroup(){return Of.get(this.manager,this.id)?.initialGroup??this.group}animate(){O(()=>{let{manager:e,transition:t}=this,{shape:n}=this.droppable;if(!e)return;let{idle:r}=e.dragOperation.status;!n||!t||r&&!t.idle||e.renderer.rendering.then(()=>{let{element:r}=this;if(!r)return;for(let e of r.getAnimations())`transitionProperty`in e&&(e.transitionProperty===`transform`||e.transitionProperty===`translate`||e.transitionProperty===`scale`)&&e.cancel();let i=this.refreshShape();if(!i)return;let a={x:n.boundingRectangle.left-i.boundingRectangle.left,y:n.boundingRectangle.top-i.boundingRectangle.top},{translate:o}=Xs(r),s=vc(r,o,!1),c=vc(r,o);if(a.x||a.y){let n=$o(Lo(r))?Wd(Ud({},t),{duration:0}):t;_c({element:r,keyframes:{translate:[`${s.x+a.x}px ${s.y+a.y}px ${s.z}`,`${c.x}px ${c.y}px ${c.z}`]},options:n}).then(()=>{e.dragOperation.status.dragging||(this.droppable.shape=void 0)})}})})}get manager(){return this.draggable.manager}set manager(e){E(()=>{this.draggable.manager=e,this.droppable.manager=e})}set element(e){E(()=>{let t=ef(this,If),n=this.droppable.element,r=this.draggable.element;(!n||n===t)&&(this.droppable.element=e),(!r||r===t)&&(this.draggable.element=e),nf(this,If,e)})}get element(){let e=ef(this,If);if(e)return as.get(e)??e??this.droppable.element}set target(e){this.droppable.element=e}get target(){return this.droppable.element}set source(e){this.draggable.element=e}get source(){return this.draggable.element}get disabled(){return this.draggable.disabled&&this.droppable.disabled}set plugins(e){this.draggable.plugins=fo(e,Ef)}set disabled(e){E(()=>{this.droppable.disabled=e,this.draggable.disabled=e})}set data(e){E(()=>{this.droppable.data=e,this.draggable.data=e})}set handle(e){this.draggable.handle=e}set id(e){this.droppable.id=e,this.draggable.id=e}get id(){return this.droppable.id}set sensors(e){this.draggable.sensors=e}set modifiers(e){this.draggable.modifiers=e}set collisionPriority(e){this.droppable.collisionPriority=e}set collisionDetector(e){this.droppable.collisionDetector=e??Lc}set alignment(e){this.draggable.alignment=e}get alignment(){return this.draggable.alignment}set type(e){E(()=>{this.droppable.type=e,this.draggable.type=e})}get type(){return this.draggable.type}set accept(e){this.droppable.accept=e}get accept(){return this.droppable.accept}get isDropTarget(){return this.droppable.isDropTarget}get isDragSource(){return this.draggable.isDragSource}get isDragging(){return this.draggable.isDragging}get isDropping(){return this.draggable.isDropping}get status(){return this.draggable.status}refreshShape(){return this.droppable.refreshShape()}accepts(e){return this.droppable.accepts(e)}};jf=Kd(),Mf=new WeakMap,Nf=new WeakMap,Pf=new WeakMap,Ff=new WeakMap,If=new WeakMap,Qd(jf,4,`index`,Af,Lf,Mf),Qd(jf,4,`group`,kf,Lf,Ff),Xd(jf,Lf);var Rf=class extends vd{constructor(e,t,n){super(e,t),this.sortable=n}get index(){return this.sortable.index}get initialIndex(){return this.sortable.initialIndex}get group(){return this.sortable.group}get initialGroup(){return this.sortable.initialGroup}},zf=class extends kd{constructor(e,t,n){super(e,t),this.sortable=n}get index(){return this.sortable.index}get group(){return this.sortable.group}};function Bf(e=`default`){return e===`xxs`||e===`xs`?`xxs`:e===`lg`||e===`xl`?`sm`:`xs`}function Vf(e=`default`,t){return t||(e===`primary`||e===`secondary`||e===`dashed`||e===`outline`||e===`transparent`?e:`default`)}var Hf=[je,w`
        @layer pk-component {
            :host {
                display: block;
                box-sizing: border-box;
            }

            :host([centered]) {
                position: absolute;
                top: 50%;
                left: 50%;
                display: block;
                width: fit-content;
                height: fit-content;
                margin: 0;
                transform: translate(-50%, -50%);
            }

            .spinner {
                display: block;
                box-sizing: border-box;
                margin-inline: auto;
                border-style: solid;
                border-bottom-color: transparent;
                border-left-color: transparent;
                border-radius: 50%;
                animation: pk-spinner-spin 0.5s linear infinite;
            }

            /* Sizes */
            :host([size='xxs']) .spinner {
                width: 0.75rem;
                height: 0.75rem;
                border-width: 1px;
            }

            :host([size='xs']) .spinner {
                width: 1rem;
                height: 1rem;
                border-width: 2px;
            }

            :host([size='sm']) .spinner,
            :host(:not([size])) .spinner {
                width: 1.5rem;
                height: 1.5rem;
                border-width: 2px;
            }

            :host([size='md']) .spinner {
                width: 2rem;
                height: 2rem;
                border-width: 2px;
            }

            :host([size='lg']) .spinner {
                width: 3rem;
                height: 3rem;
                border-width: 2px;
            }

            :host([size='xl']) .spinner {
                width: 4rem;
                height: 4rem;
                border-width: 2px;
            }

            /* Variants — matched to button loading contrast */
            :host([variant='default']:not([tone])) .spinner {
                border-top-color: var(--pk-color-red-500);
                border-right-color: var(--pk-color-red-500);
            }

            :host([variant='primary']:not([tone])) .spinner,
            :host([variant='secondary']:not([tone])) .spinner {
                border-top-color: var(--pk-color-white);
                border-right-color: var(--pk-color-white);
            }

            :host([variant='dashed']:not([tone])) .spinner,
            :host([variant='outline']:not([tone])) .spinner,
            :host([variant='transparent']:not([tone])) .spinner {
                border-top-color: var(--pk-color-gray-700);
                border-right-color: var(--pk-color-gray-700);
            }

            /* Standalone tone overrides */
            :host([tone='sky']) .spinner {
                border-top-color: var(--pk-color-sky-600);
                border-right-color: var(--pk-color-sky-600);
            }

            :host([tone='emerald']) .spinner {
                border-top-color: var(--pk-color-emerald-600);
                border-right-color: var(--pk-color-emerald-600);
            }

            :host([tone='violet']) .spinner {
                border-top-color: var(--pk-color-violet-600);
                border-right-color: var(--pk-color-violet-600);
            }

            :host([tone='amber']) .spinner {
                border-top-color: var(--pk-color-amber-500);
                border-right-color: var(--pk-color-amber-500);
            }

            @keyframes pk-spinner-spin {
                to {
                    transform: rotate(360deg);
                }
            }
        }
    `],Uf=class extends Ke{constructor(...e){super(...e),this.variant=`default`,this.size=`sm`,this.centered=!1}static{this.styles=Hf}render(){return T`
            <div part="base" class="spinner" aria-hidden="true"></div>
        `}};C([x({reflect:!0})],Uf.prototype,`variant`,void 0),C([x({reflect:!0})],Uf.prototype,`size`,void 0),C([x({reflect:!0})],Uf.prototype,`tone`,void 0),C([x({type:Boolean,reflect:!0})],Uf.prototype,`centered`,void 0),Uf=C([pe(`pk-spinner`)],Uf);var Wf=w`
    @layer pk-component {
        slot[name='start']::slotted(svg),
        slot[name='end']::slotted(svg) {
            display: block;
            width: 1em;
            height: 1em;
            flex-shrink: 0;
            pointer-events: none;
            vertical-align: middle;
            overflow: visible;
        }
    }
`;function Gf(e,t=`var(--pk-btn-radius, var(--pk-radius-lg))`){let n=Pe(e),r=Pe(t);return w`
        ${n} {
            border-top-left-radius: var(--pk-bg-start-start-radius, ${r});
            border-top-right-radius: var(--pk-bg-start-end-radius, ${r});
            border-bottom-left-radius: var(--pk-bg-end-start-radius, ${r});
            border-bottom-right-radius: var(--pk-bg-end-end-radius, ${r});
        }
    `}function Kf(){return w`
        :host([data-pk-group-orientation='horizontal']:not([data-pk-group-item-first]):not([data-pk-group-item-last])) {
            --pk-bg-start-start-radius: 0;
            --pk-bg-start-end-radius: 0;
            --pk-bg-end-start-radius: 0;
            --pk-bg-end-end-radius: 0;
        }

        :host([data-pk-group-orientation='horizontal'][data-pk-group-item-first]:not([data-pk-group-item-last])) {
            --pk-bg-start-end-radius: 0;
            --pk-bg-end-end-radius: 0;
        }

        :host([data-pk-group-orientation='horizontal'][data-pk-group-item-last]:not([data-pk-group-item-first])) {
            --pk-bg-start-start-radius: 0;
            --pk-bg-end-start-radius: 0;
        }

        :host([data-pk-group-orientation='vertical']:not([data-pk-group-item-first]):not([data-pk-group-item-last])) {
            --pk-bg-start-start-radius: 0;
            --pk-bg-start-end-radius: 0;
            --pk-bg-end-start-radius: 0;
            --pk-bg-end-end-radius: 0;
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-item-first]:not([data-pk-group-item-last])) {
            --pk-bg-end-start-radius: 0;
            --pk-bg-end-end-radius: 0;
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-item-last]:not([data-pk-group-item-first])) {
            --pk-bg-start-start-radius: 0;
            --pk-bg-start-end-radius: 0;
        }
    `}function qf(){return w`
        :host([data-pk-group-orientation='horizontal'][data-pk-group-join][variant='outline']),
        :host([data-pk-group-orientation='horizontal'][data-pk-group-join][variant='dashed']) {
            margin-inline-start: var(--pk-bg-horizontal-indent-outlined, 0);
            margin-block-start: 0;
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-join][variant='outline']),
        :host([data-pk-group-orientation='vertical'][data-pk-group-join][variant='dashed']) {
            margin-block-start: var(--pk-bg-vertical-indent-outlined, 0);
            margin-inline-start: 0;
        }

        :host([data-pk-group-orientation='horizontal'][data-pk-group-join]:not([variant='outline']):not([variant='dashed']):not([variant='link']):not([variant='none'])) {
            margin-inline-start: var(--pk-bg-horizontal-indent, 0);
            margin-block-start: 0;
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-join]:not([variant='outline']):not([variant='dashed']):not([variant='link']):not([variant='none'])) {
            margin-block-start: var(--pk-bg-vertical-indent, 0);
            margin-inline-start: 0;
        }

        :host([data-pk-group-orientation='horizontal'][data-pk-group-divider][data-pk-group-join][variant='primary']),
        :host([data-pk-group-orientation='horizontal'][data-pk-group-divider][data-pk-group-join][variant='secondary']),
        :host([data-pk-group-orientation='horizontal'][data-pk-group-divider][data-pk-group-join][variant='default']) {
            margin-inline-start: 0;
            margin-block-start: 0;
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-divider][data-pk-group-join][variant='primary']),
        :host([data-pk-group-orientation='vertical'][data-pk-group-divider][data-pk-group-join][variant='secondary']),
        :host([data-pk-group-orientation='vertical'][data-pk-group-divider][data-pk-group-join][variant='default']) {
            margin-block-start: 0;
            margin-inline-start: 0;
        }

        /* Filled variants — Craft margin gap; parent background shows through.
         * !important: outer preflight/utilities beat non-important :host margin
         * (revert-layer cannot restore shadow host values — it still specifies outer 0).
         */
        :host([data-pk-group-orientation='horizontal'][data-pk-group-internal-trail][variant='primary']),
        :host([data-pk-group-orientation='horizontal'][data-pk-group-internal-trail][variant='secondary']),
        :host([data-pk-group-orientation='horizontal'][data-pk-group-internal-trail][variant='default']) {
            margin-inline-end: var(--pk-btn-group-gap, 1px) !important;
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-internal-trail][variant='primary']),
        :host([data-pk-group-orientation='vertical'][data-pk-group-internal-trail][variant='secondary']),
        :host([data-pk-group-orientation='vertical'][data-pk-group-internal-trail][variant='default']) {
            margin-block-end: var(--pk-btn-group-gap, 1px) !important;
        }
    `}function Jf(e){let t=Pe(e);return w`
        :host([data-pk-group-orientation='horizontal'][data-pk-group-join]:not([data-pk-group-divider])) ${t} {
            border-left-width: 0;
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-join]:not([data-pk-group-divider])) ${t} {
            border-top-width: 0;
        }

        :host([data-pk-group-orientation='horizontal'][data-pk-group-divider]:not([variant='outline']):not([variant='dashed'])) ${t} {
            border-left-width: 0;
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-divider]:not([variant='outline']):not([variant='dashed'])) ${t} {
            border-top-width: 0;
        }

        :host([data-pk-group-orientation='horizontal'][data-pk-group-internal-trail][variant='outline']) ${t},
        :host([data-pk-group-orientation='horizontal'][data-pk-group-internal-trail][variant='dashed']) ${t} {
            border-right-width: 0;
        }

        :host([data-pk-group-orientation='vertical'][data-pk-group-internal-trail][variant='outline']) ${t},
        :host([data-pk-group-orientation='vertical'][data-pk-group-internal-trail][variant='dashed']) ${t} {
            border-bottom-width: 0;
        }
    `}var Yf=Ue(class extends ct{constructor(e){if(super(e),e.type!==nt.ATTRIBUTE||e.name!==`class`||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return` `+Object.keys(e).filter(t=>e[t]).join(` `)+` `}update(e,[t]){if(this.st===void 0){this.st=new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(` `).split(/\s/).filter(e=>e!==``)));for(let e in t)t[e]&&!this.nt?.has(e)&&this.st.add(e);return this.render(t)}let n=e.element.classList;for(let e of this.st)e in t||(n.remove(e),this.st.delete(e));for(let e in t){let r=!!t[e];r===this.st.has(e)||this.nt?.has(e)||(r?(n.add(e),this.st.add(e)):(n.remove(e),this.st.delete(e)))}return vt}}),Xf=[je,Wf,Kf(),Gf(`.button`),qf(),Jf(`.button`),w`
        @layer pk-component {
            :host {
                font-family: var(--pk-font-family);
                cursor: pointer;
                --pk-btn-height: var(--pk-btn-height-default);
                --pk-btn-font: var(--pk-btn-font-default);
                --pk-btn-padding-inline: var(--pk-btn-padding-inline-default);
                --pk-btn-icon-size: var(--pk-btn-icon-size-default);
                --pk-btn-icon-gap: var(--pk-btn-icon-gap-default);
                --pk-btn-caret-size: var(--pk-btn-caret-size-default);
                --pk-btn-radius: var(--pk-btn-radius-default);
                /*
                 * Slotted labels inherit from the host — pin the size-token font
                 * (and button line-height) so Craft CP / Tailwind hosts match.
                 */
                font-size: var(--pk-btn-font);
                line-height: 1.2;
            }

            :host([disabled]) {
                cursor: not-allowed;
                pointer-events: none;
            }

            :host([loading]):not([disabled]) {
                pointer-events: none;
            }

            .button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: var(--pk-btn-icon-gap);
                box-sizing: border-box;
                width: auto;
                margin: 0;
                /* Every button carries a 1px border (transparent for fill/plain variants) so the box
                 * model is identical across variants and states. Prevents width shift when swapping a
                 * button between filled and outline/dashed, or toggling states. Matches Bootstrap
                 * (transparent baseline) and  (border always present, only color changes).
                 */
                border: 1px solid transparent;
                border-radius: var(--pk-btn-radius);
                font: inherit;
                font-size: var(--pk-btn-font);
                font-weight: 400;
                line-height: 1.2;
                text-decoration: none;
                white-space: nowrap;
                /* Inherit host cursor so className/style (e.g. cursor-move) pierce shadow. */
                cursor: inherit;
                user-select: none;
                vertical-align: middle;
                appearance: none;
                background: var(--pk-btn-fill, var(--pk-action-fill));
                color: var(--pk-btn-on, var(--pk-action-on));
                height: var(--pk-btn-height);
                min-height: var(--pk-btn-height);
                /* Block padding defaults to 0 (height tokens center content). Override for nav rows. */
                padding-block: var(--pk-btn-padding-block, 0);
                padding-inline: var(--pk-btn-padding-inline);
                transition: background-color 0.12s ease, box-shadow 0.12s ease, color 0.12s ease;
            }

            .button:disabled {
                opacity: 0.5;
            }

            .icon-slot {
                display: none;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                line-height: 0;
            }

            .icon-slot--has-content {
                display: inline-flex;
            }

            /* Fixed token sizes for all icons (labeled or icon-only) — matches plugin-kit-react Button. */
            .icon-slot slot::slotted(svg),
            slot[name='start']::slotted(svg),
            slot[name='end']::slotted(svg) {
                display: block;
                width: var(--pk-btn-icon-size);
                height: var(--pk-btn-icon-size);
                flex-shrink: 0;
                pointer-events: none;
            }

            .icon-slot slot::slotted(img),
            slot[name='start']::slotted(img),
            slot[name='end']::slotted(img) {
                display: block;
                width: var(--pk-btn-icon-size);
                height: var(--pk-btn-icon-size);
                object-fit: contain;
                flex-shrink: 0;
                pointer-events: none;
            }

            /* pk-icon sizes itself from font-size (1em), so scale it to the
             * icon token. This keeps the idiomatic slotted pk-icon usage in
             * sync with raw slotted svg. Set width/height explicitly — %/size-full
             * collapses when the icon-slot has no definite box.
             */
            .icon-slot slot::slotted(pk-icon),
            slot[name='start']::slotted(pk-icon),
            slot[name='end']::slotted(pk-icon) {
                font-size: var(--pk-btn-icon-size);
                width: var(--pk-btn-icon-size);
                height: var(--pk-btn-icon-size);
                /* Kill pk-icon's text-baseline nudge (-0.125em) — flex slots center optically. */
                vertical-align: 0;
                flex-shrink: 0;
                pointer-events: none;
            }

            .label {
                display: inline-flex;
                align-items: center;
                min-width: 0;
                line-height: 1.2;
            }

            /* Trailing slot (status): grow + clip the label so end sits at the far edge
             * and long titles truncate instead of colliding with the indicator.
             */
            .button:has(.icon-slot--end.icon-slot--has-content) .label:not(.is-empty) {
                flex: 1 1 auto;
                overflow: hidden;
            }

            .label.is-empty {
                display: none;
            }

            /* Icon-only (no label): square hit box = size height. Button owns the target;
             * glyph size comes from --pk-btn-icon-size. Do not Tailwind-size the Icon.
             * Opt out with icon (compact), size=none, or group-trigger (narrow disclosure cap).
             */
            :host(:not([icon]):not([size='none']):not([group-trigger])) .button:not(.has-label) {
                width: var(--pk-btn-height);
                min-width: var(--pk-btn-height);
                padding-inline: 0;
            }

            /* Compact density (icon attr): padless box that hugs the glyph.
             * size still drives --pk-btn-icon-size; height/width tiers do not apply.
             * Use for dense x / ellipsis in cells — not for table action rows (prefer square above).
             * line-height: 0 collapses whitespace flex-struts so the glyph sits dead-center.
             */
            :host([icon]) {
                display: inline-flex;
                line-height: 0;
                vertical-align: middle;
            }

            :host([icon]) .button {
                display: flex;
                width: auto;
                min-width: 0;
                height: auto;
                min-height: 0;
                padding-inline: 0.25rem;
                padding-block: 0;
                line-height: 0;
                align-items: center;
                justify-content: center;
            }

            /* Keep label space while loading even before slotchange runs. */
            .button.loading .label.is-empty {
                display: inline-flex;
                visibility: hidden;
            }

            /* Sizes — token-driven scale (see tokens.css) */
            :host([size='xxs']) {
                --pk-btn-height: var(--pk-btn-height-xxs);
                --pk-btn-font: var(--pk-btn-font-xxs);
                --pk-btn-padding-inline: var(--pk-btn-padding-inline-xxs);
                --pk-btn-icon-size: var(--pk-btn-icon-size-xxs);
                --pk-btn-icon-gap: var(--pk-btn-icon-gap-xxs);
                --pk-btn-caret-size: var(--pk-btn-caret-size-xxs);
                --pk-btn-radius: var(--pk-btn-radius-xxs);
            }

            :host([size='xs']) {
                --pk-btn-height: var(--pk-btn-height-xs);
                --pk-btn-font: var(--pk-btn-font-xs);
                --pk-btn-padding-inline: var(--pk-btn-padding-inline-xs);
                --pk-btn-icon-size: var(--pk-btn-icon-size-xs);
                --pk-btn-icon-gap: var(--pk-btn-icon-gap-xs);
                --pk-btn-caret-size: var(--pk-btn-caret-size-xs);
                --pk-btn-radius: var(--pk-btn-radius-xs);
            }

            :host([size='sm']) {
                --pk-btn-height: var(--pk-btn-height-sm);
                --pk-btn-font: var(--pk-btn-font-sm);
                --pk-btn-padding-inline: var(--pk-btn-padding-inline-sm);
                --pk-btn-icon-size: var(--pk-btn-icon-size-sm);
                --pk-btn-icon-gap: var(--pk-btn-icon-gap-sm);
                --pk-btn-caret-size: var(--pk-btn-caret-size-sm);
                --pk-btn-radius: var(--pk-btn-radius-sm);
            }

            :host([size='default']) {
                --pk-btn-height: var(--pk-btn-height-default);
                --pk-btn-font: var(--pk-btn-font-default);
                --pk-btn-padding-inline: var(--pk-btn-padding-inline-default);
                --pk-btn-icon-size: var(--pk-btn-icon-size-default);
                --pk-btn-icon-gap: var(--pk-btn-icon-gap-default);
                --pk-btn-caret-size: var(--pk-btn-caret-size-default);
                --pk-btn-radius: var(--pk-btn-radius-default);
            }

            :host([size='lg']) {
                --pk-btn-height: var(--pk-btn-height-lg);
                --pk-btn-font: var(--pk-btn-font-lg);
                --pk-btn-padding-inline: var(--pk-btn-padding-inline-lg);
                --pk-btn-icon-size: var(--pk-btn-icon-size-lg);
                --pk-btn-icon-gap: var(--pk-btn-icon-gap-lg);
                --pk-btn-caret-size: var(--pk-btn-caret-size-lg);
                --pk-btn-radius: var(--pk-btn-radius-lg);
            }

            :host([size='xl']) {
                --pk-btn-height: var(--pk-btn-height-xl);
                --pk-btn-font: var(--pk-btn-font-xl);
                --pk-btn-padding-inline: var(--pk-btn-padding-inline-xl);
                --pk-btn-icon-size: var(--pk-btn-icon-size-xl);
                --pk-btn-icon-gap: var(--pk-btn-icon-gap-xl);
                --pk-btn-caret-size: var(--pk-btn-caret-size-xl);
                --pk-btn-radius: var(--pk-btn-radius-xl);
            }

            /* No preset scale — size to content or set --pk-btn-* on the host for one-off dimensions
             * (height, padding, font, icon, radius) without fighting a named size tier.
             * Pair with icon for a padless glyph host, or set --pk-btn-padding-inline / --pk-btn-height yourself.
             */
            :host([size='none']) {
                --pk-btn-height: auto;
                --pk-btn-font: inherit;
                --pk-btn-padding-inline: 0px;
                --pk-btn-padding-block: 0px;
                --pk-btn-icon-size: 1em;
                --pk-btn-icon-gap: 0px;
                --pk-btn-caret-size: 1em;
                --pk-btn-radius: 0px;
            }

            :host([size='none']) .button {
                height: auto;
                min-height: auto;
                width: 100%;
            }

            /* Variants */
            :host([variant='default']) {
                --pk-btn-fill: var(--pk-action-fill);
                --pk-btn-fill-hover: var(--pk-action-fill-hover);
                --pk-btn-fill-active: var(--pk-action-fill-active);
                --pk-btn-on: var(--pk-action-on);
            }

            :host([variant='primary']) {
                --pk-btn-fill: var(--pk-action-primary-fill);
                --pk-btn-fill-hover: var(--pk-action-primary-fill-hover);
                --pk-btn-fill-active: var(--pk-action-primary-fill-active);
                --pk-btn-on: var(--pk-action-primary-on);
            }

            :host([variant='primary']) .button,
            :host([variant='secondary']) .button {
                -moz-osx-font-smoothing: grayscale;
                -webkit-font-smoothing: antialiased;
            }

            :host([variant='secondary']) {
                --pk-btn-fill: var(--pk-color-gray-500);
                --pk-btn-fill-hover: var(--pk-color-gray-550);
                --pk-btn-fill-active: var(--pk-color-gray-600);
                --pk-btn-on: var(--pk-color-white);
            }

            :host([variant='outline']) .button {
                background: transparent;
                border-color: var(--pk-color-slate-400);
                color: var(--pk-color-gray-700);
            }

            :host([variant='transparent']) .button {
                background: transparent;
                color: var(--pk-color-gray-700);
            }

            /* link/none opt out of the shared transparent 1px border: they never render a border, so
             * carrying one only pads the box by 2px inline (and 2px block at size='none', where height
             * is auto). These are the "inline text" / "no chrome" variants — content-sized is the point,
             * and neither participates in button-group border joins. Other variants keep the stable box.
             */
            /*
             * Craft CP sets --link-color on :root (inherits into shadow). Prefer that,
             * then kit --pk-color-link — not sky-700 (reads as a different “CP blue”).
             * Color on :host so consumer utilities (e.g. text-[var(--link-color)]) can override.
             * Height must be content-sized — default --pk-btn-height (34px) bloated table rows.
             */
            :host([variant='link']) {
                color: var(--link-color, var(--pk-color-link));
                --pk-btn-height: auto;
                --pk-btn-padding-inline: 0;
                --pk-btn-padding-block: 0;
            }

            :host([variant='link']) .button {
                background: transparent;
                border-width: 0;
                border-radius: 0;
                color: inherit;
                width: auto;
                height: auto;
                min-height: 0;
                padding: 0;
                text-underline-offset: 2px;
            }

            :host([variant='dashed']) .button {
                background: transparent;
                border-style: dashed;
                border-color: var(--pk-color-slate-500);
                color: var(--pk-color-gray-700);
            }

            :host([variant='none']) .button {
                border-width: 0;
                border-radius: 0;
                background: transparent;
                color: inherit;
            }

            /* Interaction — pseudo-classes only; playground matrices use dev/pk-button-demo-states.css */
            .button:hover:not(:disabled) {
                background: var(--pk-btn-fill-hover, var(--pk-btn-fill));
            }

            :host([variant='outline']) .button:hover:not(:disabled),
            :host([variant='transparent']) .button:hover:not(:disabled),
            :host([variant='dashed']) .button:hover:not(:disabled) {
                background: var(--pk-color-slate-150);
            }

            :host([variant='link']) .button:hover:not(:disabled) {
                background: transparent;
                text-decoration: underline;
            }

            :host([variant='none']) .button:hover:not(:disabled) {
                background: transparent;
            }

            .button:active:not(:disabled) {
                background: var(--pk-btn-fill-active, var(--pk-btn-fill-hover, var(--pk-btn-fill)));
            }

            :host([variant='outline']) .button:active:not(:disabled),
            :host([variant='transparent']) .button:active:not(:disabled),
            :host([variant='dashed']) .button:active:not(:disabled) {
                background: var(--pk-color-slate-200);
            }

            :host([variant='link']) .button:active:not(:disabled),
            :host([variant='none']) .button:active:not(:disabled) {
                background: transparent;
            }

            .button:focus {
                outline: none;
            }

            .button:focus-visible {
                box-shadow: var(--pk-shadow-focus);
            }

            /* Bordered variants: fold the button's own border into the focus ring by recoloring it to
             * the accent (and solidifying dashed) so focus reads as one cohesive ring instead of a
             * doubled border. The ring is thinned to 1px here because the recolored 1px border already
             * supplies the other half — total 2px, matching the filled variants' ring weight.
             */
            :host([variant='outline']) .button:focus-visible,
            :host([variant='dashed']) .button:focus-visible {
                border-color: var(--pk-color-sky-600);
                box-shadow: 0 0 0 1px var(--pk-color-sky-600), 0 0 5px 1px hsl(from var(--pk-color-sky-600) h s l / 0.7);
            }

            :host([variant='dashed']) .button:focus-visible {
                border-style: solid;
            }

            :host(.pk-dialog__close) .button:focus-visible {
                box-shadow: 0 0 0 2px var(--pk-color-gray-600);
            }

            :host-context(pk-button-group) {
                position: relative;
            }

            :host-context(pk-button-group[orientation='vertical']) {
                display: block;
                width: 100%;
                max-width: 100%;
                box-sizing: border-box;
            }

            :host-context(pk-button-group[orientation='vertical']) .button {
                width: 100%;
                box-sizing: border-box;
            }

            :host-context(pk-button-group:focus-visible) {
                z-index: 2;
            }

            /* Bordered variants — matching border divider (filled uses margin gap via buttonGroupIndentStyles) */

            :host([variant='primary']) .button:focus-visible,
            :host([variant='secondary']) .button:focus-visible {
                box-shadow: var(--pk-shadow-focus-inset);
            }

            :host-context(pk-button-group[exclusive]):host([aria-pressed='true']) .button {
                background: var(--pk-color-gray-500);
                color: var(--pk-color-white);
            }

            :host-context(pk-button-group[exclusive]):host([aria-pressed='true']) .button:hover:not(:disabled) {
                background: var(--pk-color-gray-550);
            }

            :host-context(pk-button-group[exclusive]):host([aria-pressed='true']) .button:active:not(:disabled) {
                background: var(--pk-color-gray-600);
            }

            :host-context(pk-button-group[exclusive]):host([aria-pressed='true']) .button:focus-visible {
                box-shadow: var(--pk-shadow-focus);
            }

            :host([variant='link']) .button:focus-visible {
                box-shadow: none;
                text-decoration: underline;
            }

            .button.loading {
                position: relative;
                cursor: default;
                pointer-events: none;
            }

            .label.loading {
                visibility: hidden;
            }

            .button.loading .icon-slot,
            .button.loading slot[name='start']::slotted(*),
            .button.loading slot[name='end']::slotted(*) {
                visibility: hidden;
            }

            .button.caret .icon-slot--end.icon-slot--has-content {
                display: none;
            }

            /* Scope to the caret span — the button host also gets class caret when
               with-caret is set; an unscoped .caret rule was adding 2px margin
               to the whole button and shifting dropdown anchors left. */
            .button > .caret {
                display: inline-flex;
                align-self: center;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                line-height: 0;
                /* Sits slightly further from the label than the flex gap alone. */
                margin-inline-start: 2px;
            }

            /* Caret has its own per-size token (--pk-btn-caret-size), kept deliberately smaller than
             * --pk-btn-icon-size so it reads as a subordinate dropdown affordance next to real icons.
             */
            .button > .caret svg {
                display: block;
                width: var(--pk-btn-caret-size);
                height: var(--pk-btn-caret-size);
            }

            :host([group-trigger]) .button {
                padding-inline: 6px;
            }

            /* Compact disclosure cap — hide content, keep only the shared SVG caret (centered). */
            :host([group-trigger]) .label,
            :host([group-trigger]) .icon-slot {
                display: none;
            }

            :host([group-trigger]) .button > .caret {
                margin-inline-start: 0;
            }

            :host([size='sm'][group-trigger]) .button,
            :host([size='xs'][group-trigger]) .button,
            :host([size='xxs'][group-trigger]) .button {
                padding-inline: 6px;
            }

            :host([size='lg'][group-trigger]) .button {
                padding-inline: 10px;
            }

            :host([size='xl'][group-trigger]) .button {
                padding-inline: 12px;
            }

            :host-context(pk-button-group[orientation='horizontal']):host([data-pk-group-join]:not([data-pk-group-divider])[variant='outline']) .button,
            :host-context(pk-button-group[orientation='horizontal']):host([data-pk-group-join]:not([data-pk-group-divider])[variant='dashed']) .button,
            :host-context(pk-button-group[orientation='horizontal']):host([data-pk-group-join]:not([data-pk-group-divider])[variant='transparent']) .button {
                border-left-width: 0;
            }

            :host-context(pk-button-group[orientation='vertical']):host([data-pk-group-join]:not([data-pk-group-divider])[variant='outline']) .button,
            :host-context(pk-button-group[orientation='vertical']):host([data-pk-group-join]:not([data-pk-group-divider])[variant='dashed']) .button,
            :host-context(pk-button-group[orientation='vertical']):host([data-pk-group-join]:not([data-pk-group-divider])[variant='transparent']) .button {
                border-top-width: 0;
            }

            :host([data-pk-group-orientation='horizontal'][data-pk-group-join]:not([data-pk-group-divider])[variant='outline']) .button,
            :host([data-pk-group-orientation='horizontal'][data-pk-group-join]:not([data-pk-group-divider])[variant='dashed']) .button,
            :host([data-pk-group-orientation='horizontal'][data-pk-group-join]:not([data-pk-group-divider])[variant='transparent']) .button {
                border-left-width: 0;
            }

            :host([data-pk-group-orientation='vertical'][data-pk-group-join]:not([data-pk-group-divider])[variant='outline']) .button,
            :host([data-pk-group-orientation='vertical'][data-pk-group-join]:not([data-pk-group-divider])[variant='dashed']) .button,
            :host([data-pk-group-orientation='vertical'][data-pk-group-join]:not([data-pk-group-divider])[variant='transparent']) .button {
                border-top-width: 0;
            }

            :host([data-pk-group-orientation='horizontal'][data-pk-group-divider][variant='outline']) .button {
                box-shadow: none;
                border-left-width: 1px;
                border-left-style: solid;
                border-left-color: var(--pk-btn-group-divider-color-outline, var(--pk-color-slate-400));
            }

            :host([data-pk-group-orientation='vertical'][data-pk-group-divider][variant='outline']) .button {
                box-shadow: none;
                border-top-width: 1px;
                border-top-style: solid;
                border-top-color: var(--pk-btn-group-divider-color-outline, var(--pk-color-slate-400));
            }

            :host([data-pk-group-orientation='horizontal'][data-pk-group-divider][variant='dashed']) .button {
                box-shadow: none;
                border-left-width: 1px;
                border-left-style: dashed;
                border-left-color: var(--pk-btn-group-divider-color-dashed, var(--pk-color-slate-500));
            }

            :host([data-pk-group-orientation='vertical'][data-pk-group-divider][variant='dashed']) .button {
                box-shadow: none;
                border-top-width: 1px;
                border-top-style: dashed;
                border-top-color: var(--pk-btn-group-divider-color-dashed, var(--pk-color-slate-500));
            }

            :host([data-pk-group-orientation='horizontal'][data-pk-group-divider][variant='outline']) .button:focus-visible,
            :host([data-pk-group-orientation='horizontal'][data-pk-group-divider][variant='dashed']) .button:focus-visible {
                box-shadow: var(--pk-shadow-focus);
            }

            :host([data-pk-group-orientation='vertical'][data-pk-group-divider][variant='outline']) .button:focus-visible,
            :host([data-pk-group-orientation='vertical'][data-pk-group-divider][variant='dashed']) .button:focus-visible {
                box-shadow: var(--pk-shadow-focus);
            }

            :host([data-pk-group-orientation='horizontal'][data-pk-group-internal-trail][variant='outline']) .button,
            :host([data-pk-group-orientation='horizontal'][data-pk-group-internal-trail][variant='dashed']) .button {
                border-right-width: 0;
            }

            :host([data-pk-group-orientation='vertical'][data-pk-group-internal-trail][variant='outline']) .button,
            :host([data-pk-group-orientation='vertical'][data-pk-group-internal-trail][variant='dashed']) .button {
                border-bottom-width: 0;
            }
        }
    `],Zf=St(p),X=class extends Ke{constructor(...e){super(...e),this.variant=`default`,this.size=`default`,this.disabled=!1,this.loading=!1,this.withCaret=!1,this.groupTrigger=!1,this.icon=!1,this.title=``,this.type=`button`,this.hasDefaultSlotContent=!1,this.hasStartSlotContent=!1,this.hasEndSlotContent=!1,this.startSlotChanged=e=>{this.iconSlotChanged(e,`start`)},this.endSlotChanged=e=>{this.iconSlotChanged(e,`end`)},this.handleHostClick=e=>{if(this.disabled||this.loading||this.href||this.type!==`submit`&&this.type!==`reset`)return;let t=this.resolveAssociatedForm();if(t){if(e.preventDefault(),e.stopPropagation(),this.type===`reset`){t.reset();return}if(typeof t.requestSubmit==`function`){t.requestSubmit();return}t.dispatchEvent(new Event(`submit`,{bubbles:!0,cancelable:!0}))}}}static{this.shadowRootOptions={mode:`open`,delegatesFocus:!0}}static{this.styles=Xf}defaultSlotChanged(e){let t=e.target;this.hasDefaultSlotContent=t.assignedNodes({flatten:!0}).some(e=>e.nodeType===Node.TEXT_NODE?e.textContent?.trim():e.nodeType===Node.ELEMENT_NODE)}iconSlotChanged(e,t){let n=e.target.assignedNodes({flatten:!0}).some(e=>e.nodeType===Node.TEXT_NODE?e.textContent?.trim():e.nodeType===Node.ELEMENT_NODE);t===`start`?this.hasStartSlotContent=n:this.hasEndSlotContent=n}buttonClasses(){return Yf({button:!0,"has-label":this.hasDefaultSlotContent,loading:this.loading,caret:this.withCaret,"group-trigger":this.groupTrigger})}connectedCallback(){super.connectedCallback(),this.setAttribute(`data-slot`,`button`),this.addEventListener(`click`,this.handleHostClick)}disconnectedCallback(){this.removeEventListener(`click`,this.handleHostClick),super.disconnectedCallback()}resolveAssociatedForm(){let e=(this.form||this.getAttribute(`form`)||``).trim();if(e){let t=this.ownerDocument?.getElementById(e);if(t instanceof HTMLFormElement&&t.id!==`main`)return t}let t=this.closest(`form`);return t&&t.id!==`main`?t:null}render(){let e=this.spinnerSize||Bf(this.size),t=Vf(this.variant,this.spinnerVariant);return T`
            ${this.href?T`
                    <a
                        part="base"
                        class=${this.buttonClasses()}
                        href=${this.href}
                        target=${this.target??S}
                        rel=${this.rel??S}
                        title=${this.title||S}
                    >
                        ${this.renderInner(e,t)}
                    </a>
                `:T`
                    <button
                        part="base"
                        class=${this.buttonClasses()}
                        type=${this.type}
                        ?disabled=${this.disabled}
                        aria-disabled=${this.disabled?`true`:S}
                        aria-busy=${this.loading?`true`:S}
                        name=${this.name??S}
                        value=${this.value??S}
                        title=${this.title||S}
                    >
                        ${this.renderInner(e,t)}
                    </button>
                `}
        `}renderInner(e,t){return T`
            <span
                class=${Yf({"icon-slot":!0,"icon-slot--start":!0,"icon-slot--has-content":this.hasStartSlotContent})}
            >
                <slot name="start" @slotchange=${this.startSlotChanged}></slot>
            </span>
            ${this.loading?T`
                    <pk-spinner
                        variant=${t}
                        size=${e}
                        tone=${this.spinnerTone??S}
                        centered
                    ></pk-spinner>
                `:S}
            <span
                class=${Yf({label:!0,"is-empty":!this.hasDefaultSlotContent,loading:this.loading})}
            >
                <slot @slotchange=${this.defaultSlotChanged}></slot>
            </span>
            <span
                class=${Yf({"icon-slot":!0,"icon-slot--end":!0,"icon-slot--has-content":this.hasEndSlotContent})}
            >
                <slot name="end" @slotchange=${this.endSlotChanged}></slot>
            </span>
            ${this.withCaret||this.groupTrigger?T`<span part="caret" class="caret">${Be(Zf)}</span>`:S}
        `}};C([x({reflect:!0})],X.prototype,`variant`,void 0),C([x({reflect:!0})],X.prototype,`size`,void 0),C([x({type:Boolean,reflect:!0})],X.prototype,`disabled`,void 0),C([x({type:Boolean,reflect:!0})],X.prototype,`loading`,void 0),C([x({reflect:!0,attribute:`spinner-size`})],X.prototype,`spinnerSize`,void 0),C([x({reflect:!0,attribute:`spinner-variant`})],X.prototype,`spinnerVariant`,void 0),C([x({reflect:!0,attribute:`spinner-tone`})],X.prototype,`spinnerTone`,void 0),C([x({type:Boolean,reflect:!0,attribute:`with-caret`})],X.prototype,`withCaret`,void 0),C([x({type:Boolean,reflect:!0,attribute:`group-trigger`})],X.prototype,`groupTrigger`,void 0),C([x({type:Boolean,reflect:!0})],X.prototype,`icon`,void 0),C([x()],X.prototype,`href`,void 0),C([x()],X.prototype,`target`,void 0),C([x()],X.prototype,`rel`,void 0),C([x()],X.prototype,`name`,void 0),C([x()],X.prototype,`value`,void 0),C([x()],X.prototype,`title`,void 0),C([x()],X.prototype,`type`,void 0),C([x({reflect:!0})],X.prototype,`form`,void 0),C([De()],X.prototype,`hasDefaultSlotContent`,void 0),C([De()],X.prototype,`hasStartSlotContent`,void 0),C([De()],X.prototype,`hasEndSlotContent`,void 0),X=C([pe(`pk-button`)],X);var Qf=(e,t={})=>St(e,{title:t.title}),$f=(e,t={})=>{let n=document.createElement(`template`);n.innerHTML=Qf(e,t);let r=n.content.firstElementChild;if(!(r instanceof SVGSVGElement))throw Error(`Icon render did not produce an SVG element.`);return r},ep=Object.defineProperty,tp=Object.getOwnPropertyDescriptor,np=Object.getOwnPropertyNames,rp=Object.prototype.hasOwnProperty,ip=(e,t)=>{let n={};for(var r in e)ep(n,r,{get:e[r],enumerable:!0});return t||ep(n,Symbol.toStringTag,{value:`Module`}),n},ap=(e,t,n,r)=>{if(t&&typeof t==`object`||typeof t==`function`)for(var i=np(t),a=0,o=i.length,s;a<o;a++)s=i[a],!rp.call(e,s)&&s!==n&&ep(e,s,{get:(e=>t[e]).bind(null,s),enumerable:!(r=tp(t,s))||r.enumerable});return e},op=(e,t,n)=>(ap(e,t,`default`),n&&ap(n,t,`default`)),sp=`M64 64C28.7 64 0 92.7 0 128L0 384c0 35.3 28.7 64 64 64l208 0 32 0 16 0 256 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64L320 64l-16 0-32 0L64 64zm512 48c8.8 0 16 7.2 16 16l0 256c0 8.8-7.2 16-16 16l-256 0 0-288 256 0zM178.3 175.9l64 144c4.5 10.1-.1 21.9-10.2 26.4s-21.9-.1-26.4-10.2L196.8 316l-73.6 0-8.9 20.1c-4.5 10.1-16.3 14.6-26.4 10.2s-14.6-16.3-10.2-26.4l64-144c3.2-7.2 10.4-11.9 18.3-11.9s15.1 4.7 18.3 11.9zM179 276l-19-42.8L141 276l38 0zM456 164c-11 0-20 9-20 20l0 4-52 0c-11 0-20 9-20 20s9 20 20 20l72 0 35.1 0c-7.3 16.7-17.4 31.9-29.8 45l-.5-.5-14.6-14.6c-7.8-7.8-20.5-7.8-28.3 0s-7.8 20.5 0 28.3L430 298.3c-5.9 3.6-12.1 6.9-18.5 9.8l-3.6 1.6c-10.1 4.5-14.6 16.3-10.2 26.4s16.3 14.6 26.4 10.2l3.6-1.6c12-5.3 23.4-11.8 34-19.4c4.3 3 8.6 5.8 13.1 8.5l18.9 11.3c9.5 5.7 21.8 2.6 27.4-6.9s2.6-21.8-6.9-27.4l-18.9-11.3c-.9-.5-1.8-1.1-2.7-1.6c17.2-18.8 30.7-40.9 39.6-65.4L534 228l2 0c11 0 20-9 20-20s-9-20-20-20l-16 0-44 0 0-4c0-11-9-20-20-20z`,cp=()=>{let e=document.createElementNS(`http://www.w3.org/2000/svg`,`svg`);e.setAttribute(`aria-hidden`,`true`),e.setAttribute(`xmlns`,`http://www.w3.org/2000/svg`),e.setAttribute(`viewBox`,`0 0 640 512`);let t=document.createElementNS(`http://www.w3.org/2000/svg`,`path`);return t.setAttribute(`d`,sp),e.append(t),e},lp=ip({createIconElement:()=>$f,createTranslationIconElement:()=>cp,renderIconHtml:()=>Qf});op(lp,It);var up=[`aria-labelledby`,`aria-describedby`,`aria-invalid`,`aria-errormessage`,`aria-required`,`aria-label`];function dp(e){return e.hasAttribute(`aria-labelledby`)||e.hasAttribute(`aria-describedby`)||e.hasAttribute(`aria-errormessage`)}function fp(e,t){for(let n of up){let r=e.getAttribute(n);r===null?t.removeAttribute(n):t.setAttribute(n,r)}}var pp=class{constructor(e,t,n){this.host=e,this.getTarget=t,this.onSync=n}connect(){this.sync(),this.observer=new MutationObserver(()=>{this.sync()}),this.observer.observe(this.host,{attributes:!0,attributeFilter:[...up]})}disconnect(){this.observer?.disconnect(),this.observer=void 0}sync(){if(!dp(this.host)){this.onSync?.();return}let e=this.getTarget();e&&fp(this.host,e)}},mp=class extends Event{constructor(){super(`pk-invalid`,{bubbles:!0,cancelable:!1,composed:!0})}};function hp(){return{observedAttributes:[`custom-error`],checkValidity(e){let t={message:``,isValid:!0,invalidKeys:[]};return e.customError&&(t.message=e.customError,t.isValid=!1,t.invalidKeys.push(`customError`)),t}}}var gp=class extends Ke{static{this.formAssociated=!0}static get validators(){return[hp()]}static get observedAttributes(){let e=new Set(super.observedAttributes??[]);for(let t of this.validators)for(let n of t.observedAttributes??[])e.add(n);return[...e]}constructor(){super(),this.internals=this.attachInternals(),this.assumeInteractionOn=[`input`],this.validators=[],this.name=null,this.disabled=!1,this.required=!1,this.customError=null,this.valueHasChanged=!1,this.hasInteracted=!1,this.emittedEvents=[],this.emitInvalid=e=>{e.target===this&&(this.hasInteracted=!0,this.dispatchEvent(new mp))},this.handleInteraction=e=>{this.emittedEvents.includes(e.type)||this.emittedEvents.push(e.type),this.emittedEvents.length>=this.assumeInteractionOn.length&&(this.hasInteracted=!0,this.updateValidity())},this.addEventListener(`invalid`,this.emitInvalid)}connectedCallback(){super.connectedCallback();for(let e of this.assumeInteractionOn)this.addEventListener(e,this.handleInteraction);this.updateValidity()}disconnectedCallback(){this.hostAriaMirror?.disconnect(),this.hostAriaMirror=void 0;for(let e of this.assumeInteractionOn)this.removeEventListener(e,this.handleInteraction);this.removeEventListener(`invalid`,this.emitInvalid),super.disconnectedCallback()}updated(e){e.has(`customError`)&&this.setCustomValidity(this.customError??``),e.has(`disabled`)&&this.setState(`disabled`,!!this.disabled),(e.has(`value`)||e.has(`disabled`)||e.has(`required`)||e.has(`name`))&&this.syncFormValue(),this.updateValidity(),super.updated(e),this.syncHostAriaMirror()}firstUpdated(e){super.firstUpdated(e),this.connectHostAriaMirror()}getAriaMirrorTarget(){return this.input??null}syncStandaloneAria(){}connectHostAriaMirror(){this.hostAriaMirror?.disconnect(),this.hostAriaMirror=new pp(this,()=>this.getAriaMirrorTarget(),()=>this.syncStandaloneAria()),this.hostAriaMirror.connect()}syncHostAriaMirror(){this.hostAriaMirror?.sync()}formResetCallback(){this.resetValidity(),this.hasInteracted=!1,this.valueHasChanged=!1,this.emittedEvents=[],this.resetToDefaultValue(),this.syncFormValue(),this.updateValidity()}formDisabledCallback(e){this.disabled=e,this.updateValidity()}formStateRestoreCallback(e,t){this.restoreFormState(e),this.syncFormValue(),this.updateValidity()}set form(e){e?this.setAttribute(`form`,e):this.removeAttribute(`form`)}get form(){return this.internals.form}get labels(){return this.internals.labels}get validity(){return this.internals.validity}get willValidate(){return this.internals.willValidate}get validationMessage(){return this.internals.validationMessage}getForm(){return this.internals.form}checkValidity(){return this.updateValidity(),this.internals.checkValidity()}reportValidity(){return this.updateValidity(),this.hasInteracted=!0,this.internals.reportValidity()}resetValidity(){this.setCustomValidity(``),this.internals.setValidity({}),this.syncCustomStates()}setCustomValidity(e){if(!e){this.customError=null,this.internals.setValidity({}),this.syncCustomStates();return}this.customError=e;let t=this.validationTarget;t instanceof HTMLElement?this.internals.setValidity({customError:!0},e,t):this.internals.setValidity({customError:!0},e),this.syncCustomStates()}get validationTarget(){return this.input}get allValidators(){return[...this.constructor.validators??[],...this.validators??[]]}setFormValue(e,t){this.internals.setFormValue(e,t??e)}setValue(e,t){this.setFormValue(e,t??e)}updateValidity(){if(this.disabled||this.hasAttribute(`disabled`)||!this.willValidate){this.internals.setValidity({}),this.syncCustomStates();return}let e=this.allValidators;if(!e.length)return;let t={customError:!!this.customError},n=``,r=this.validationTarget;for(let r of e){let{isValid:e,message:i,invalidKeys:a}=r.checkValidity(this);if(!e){n||=i;for(let e of a)t[e]=!0}}n||=this.validationMessage,r instanceof HTMLElement?this.internals.setValidity(t,n,r):this.internals.setValidity(t,n),this.syncCustomStates()}syncCustomStates(){let e=this.internals.validity.valid;this.setState(`required`,this.required),this.setState(`optional`,!this.required),this.setState(`invalid`,!e),this.setState(`valid`,e),this.setState(`user-invalid`,!e&&this.hasInteracted),this.setState(`user-valid`,e&&this.hasInteracted)}setState(e,t){let n=this.internals.states;n&&(t?n.add(e):n.delete(e))}syncFormValue(){}resetToDefaultValue(){}restoreFormState(e){}};C([x({reflect:!0})],gp.prototype,`name`,void 0),C([x({type:Boolean,reflect:!0})],gp.prototype,`disabled`,void 0),C([x({type:Boolean,reflect:!0})],gp.prototype,`required`,void 0),C([x({attribute:`custom-error`,reflect:!0})],gp.prototype,`customError`,void 0),C([x({attribute:!1,state:!0})],gp.prototype,`valueHasChanged`,void 0),C([x({attribute:!1,state:!0})],gp.prototype,`hasInteracted`,void 0);function _p(){return{checkValidity(e){let t=e.input,n={message:``,isValid:!0,invalidKeys:[]};if(!t)return n;let r=!0;if(`checkValidity`in t&&typeof t.checkValidity==`function`&&(r=t.checkValidity()),r)return n;if(n.isValid=!1,`validationMessage`in t&&typeof t.validationMessage==`string`&&(n.message=t.validationMessage),!(`validity`in t)||!t.validity)return n.invalidKeys.push(`customError`),n;for(let e of Object.keys(t.validity)){if(e===`valid`)continue;let r=e;t.validity[r]&&n.invalidKeys.push(r)}return n}}}var vp=class{constructor(e,...t){this.host=e,this.boundSlots=new Set,this.lastHasContent=new Map,this.handleSlotChange=()=>{let e=!1;for(let t of this.slotNames){let n=this.test(t);this.lastHasContent.get(t)!==n&&(this.lastHasContent.set(t,n),e=!0)}e&&this.host.requestUpdate()},this.slotNames=t,e.addController(this)}hostConnected(){this.bindSlotListeners()}hostUpdated(){this.bindSlotListeners()}hostDisconnected(){for(let e of this.boundSlots)e.removeEventListener(`slotchange`,this.handleSlotChange);this.boundSlots.clear()}bindSlotListeners(){for(let e of this.slotNames){let t=this.findSlot(e);!t||this.boundSlots.has(t)||(this.boundSlots.add(t),t.addEventListener(`slotchange`,this.handleSlotChange),this.lastHasContent.has(e)||this.lastHasContent.set(e,this.test(e)))}}findSlot(e){return this.host.shadowRoot?e?this.host.shadowRoot.querySelector(`slot[name="${e}"]`):this.host.shadowRoot.querySelector(`slot:not([name])`):null}test(e,t=!1){if(t||this.hasLightDomSlotContent(e))return!0;let n=this.findSlot(e);return n?n.assignedNodes({flatten:!0}).some(e=>e.nodeType===Node.TEXT_NODE?!!e.textContent?.trim():e.nodeType===Node.ELEMENT_NODE):!1}hasLightDomSlotContent(e){return[...this.host.children].some(t=>t.getAttribute(`slot`)===e)}},yp=0;function bp(e=`pk`){return yp+=1,`${e}-${yp}`}[`a[href]`,`button:not([disabled])`,`input:not([disabled])`,`select:not([disabled])`,`textarea:not([disabled])`,`[tabindex]:not([tabindex="-1"])`].join(`,`),[`a[href]`,`button`,`input`,`select`,`textarea`,`[tabindex]:not([tabindex="-1"])`].join(`,`);var xp=class{constructor(e=`polite`){this.element=document.createElement(`div`),this.element.setAttribute(`aria-live`,e),this.element.setAttribute(`aria-atomic`,`true`),this.element.className=`pk-visually-hidden`,this.element.style.cssText=`position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;`,document.body.append(this.element)}announce(e){this.element.textContent=``,requestAnimationFrame(()=>{this.element.textContent=e})}destroy(){this.element.remove()}},Sp=[];function Cp(e){Sp.push(e)}function wp(e){for(let t=Sp.length-1;t>=0;--t)if(Sp[t]===e){Sp.splice(t,1);break}}function Tp(e){return Sp.length>0&&Sp[Sp.length-1]===e}function Ep(e,t){return{top:Math.round(e.getBoundingClientRect().top-t.getBoundingClientRect().top),left:Math.round(e.getBoundingClientRect().left-t.getBoundingClientRect().left)}}function Dp(e,t,n=`vertical`,r=`smooth`){let i=Ep(e,t),a=i.top+t.scrollTop,o=i.left+t.scrollLeft,s=t.scrollLeft,c=t.scrollLeft+t.offsetWidth,l=t.scrollTop,u=t.scrollTop+t.offsetHeight;(n===`horizontal`||n===`both`)&&(o<s?t.scrollTo({left:o,behavior:r}):o+e.clientWidth>c&&t.scrollTo({left:o-t.offsetWidth+e.clientWidth,behavior:r})),(n===`vertical`||n===`both`)&&(a<l?t.scrollTo({top:a,behavior:r}):a+e.clientHeight>u&&t.scrollTo({top:a-t.offsetHeight+e.clientHeight,behavior:r}))}var Op=class extends Event{constructor(){super(`pk-clear`,{bubbles:!0,cancelable:!1,composed:!0})}},kp=class extends Event{constructor(){super(`pk-show`,{bubbles:!0,cancelable:!1,composed:!0})}},Ap=class extends Event{constructor(){super(`pk-after-show`,{bubbles:!0,cancelable:!1,composed:!0})}},jp=class extends Event{constructor(e=`unknown`){super(`pk-hide`,{bubbles:!0,cancelable:!0,composed:!0}),this.detail={source:e}}},Mp=class extends Event{constructor(){super(`pk-after-hide`,{bubbles:!0,cancelable:!1,composed:!0})}};function Np(e){let t=e.split(`-`)[0];return t===`inline-start`?`left`:t===`inline-end`?`right`:t===`top`||t===`bottom`||t===`left`||t===`right`?t:`bottom`}function Pp(e,t,n,r,i){let a=Np(e),o=t.x+t.width/2-n.x,s=t.y+t.height/2-n.y;return Math.abs(i?.y??0)>r&&(a===`top`||a===`bottom`)?`${o}px ${t.y+t.height/2-n.y}px`:{top:`${o}px calc(100% + ${r}px)`,bottom:`${o}px ${-r}px`,left:`calc(100% + ${r}px) ${s}px`,right:`${-r}px ${s}px`}[a]}function Fp(e,t){if(!t){e.removeAttribute(`data-side`);return}e.setAttribute(`data-side`,Np(t))}function Ip(e,t,n=100,r){let i=()=>e.getAttribute(`data-current-placement`)??t;return!r?.requireEvent&&e.hasAttribute(`data-current-placement`)?Promise.resolve(i()):new Promise(t=>{let a=!1,o=()=>{a||(a=!0,t(i()))};e.addEventListener(`pk-reposition`,o,{once:!0}),r?.requireEvent||requestAnimationFrame(()=>{requestAnimationFrame(()=>{e.hasAttribute(`data-current-placement`)&&o()})}),window.setTimeout(o,n)})}var Lp=globalThis.HTMLElement!==void 0&&Object.prototype.hasOwnProperty.call(globalThis.HTMLElement.prototype,`popover`);function Rp(e){return Bp(e)}function zp(e){return e.assignedSlot?e.assignedSlot:e.parentNode instanceof ShadowRoot?e.parentNode.host:e.parentNode}function Bp(e){for(let t=e;t;t=zp(t))if(t instanceof Element&&getComputedStyle(t).display===`none`)return null;for(let t=zp(e);t;t=zp(t)){if(!(t instanceof Element))continue;let e=getComputedStyle(t);if(e.display!==`contents`&&(e.position!==`static`||bt(e)||t.tagName===`BODY`))return t}return null}function Vp(e,t){if(!t)return null;let n=e.getRootNode();if(n instanceof Document||n instanceof ShadowRoot){let e=n.getElementById(t);if(e)return e}return e.ownerDocument.getElementById(t)}var Hp=class extends Event{constructor(){super(`pk-reposition`,{bubbles:!0,cancelable:!1,composed:!0})}},Up=w`
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
`;function Wp(e){return typeof e==`object`&&!!e&&`getBoundingClientRect`in e}function Gp(e){return e||(Lp?`absolute`:`fixed`)}function Kp(e,t){if(!(!Lp||Wp(e)||t!==`scroll`))return et(e).filter(e=>e instanceof Element)}var Z=class extends Ke{constructor(...e){super(...e),this.anchor=``,this.active=!1,this.boundary=`viewport`,this.placement=`bottom-start`,this.distance=4,this.skidding=0,this.flip=!0,this.flipFallbackPlacements=``,this.flipFallbackStrategy=`best-fit`,this.flipPadding=8,this.shift=!0,this.shiftPadding=8,this.arrow=!1,this.arrowPlacement=`anchor`,this.arrowPadding=10,this.anchorTracking=!0,this.hoverBridge=!1,this.anchorElement=null,this.settlingInitialPosition=!1,this.settleGeneration=0}static{this.styles=Up}disconnectedCallback(){this.stop(),super.disconnectedCallback()}updated(e){super.updated(e),e.has(`active`)&&(this.active?(this.resolveAnchor(),this.start()):this.stop()),e.has(`anchor`)&&this.handleAnchorChange(),this.active&&!e.has(`active`)&&this.reposition()}reposition(){this.settlingInitialPosition||this.repositionAsync()}async repositionAsync(e=!0){let t=this.popupElement,n=this.arrow?this.arrowElement:null;if(!this.active||!this.anchorElement||!t)return!1;let r=Kp(this.anchorElement,this.boundary),i=[Ne({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?i.push(Re({apply:({rects:e})=>{let n=this.sync===`width`||this.sync===`both`,r=this.sync===`height`||this.sync===`both`;t.style.width=n?`${e.reference.width}px`:``,t.style.height=r?`${e.reference.height}px`:``}})):(t.style.width=``,t.style.height=``),this.flip&&i.push(Je({boundary:r,fallbackPlacements:this.flipFallbackPlacements?this.flipFallbackPlacements.split(` `).map(e=>e.trim()).filter(Boolean):void 0,fallbackStrategy:this.flipFallbackStrategy===`best-fit`?`bestFit`:`initialPlacement`,padding:this.flipPadding})),this.shift&&i.push(ht({boundary:r,padding:this.shiftPadding})),this.arrow&&n&&i.push(_t({element:n,padding:this.arrowPadding}));let a=Gp(this.positionMethod),o=a===`fixed`;t.classList.toggle(`popup-fixed`,o);let s=Lp?e=>ot.getOffsetParent(e,Rp):ot.getOffsetParent,{x:c,y:l,middlewareData:u,placement:d}=await ft(this.anchorElement,t,{placement:this.placement,middleware:i,strategy:a,platform:{...ot,getOffsetParent:s}});if(!this.active||!t.isConnected)return!1;let f={top:`bottom`,right:`left`,bottom:`top`,left:`right`}[d.split(`-`)[0]];if(this.setAttribute(`data-current-placement`,d),Object.assign(t.style,{left:`${c}px`,top:`${l}px`,...o?{position:`fixed`}:{position:``}}),this.anchorElement){let e=this.anchorElement.getBoundingClientRect(),n=t.getBoundingClientRect();t.style.setProperty(`--pk-anchor-width`,`${e.width}px`),t.style.setProperty(`--pk-anchor-height`,`${e.height}px`);let r=Pp(d,e,n,this.distance,u.shift);t.style.setProperty(`--pk-transform-origin`,r)}if(this.arrow&&n){let e=u.arrow?.x,t=u.arrow?.y,r=``,i=``,a=``,o=``;if(this.arrowPlacement===`start`){let n=typeof e==`number`?`${this.arrowPadding}px`:``;r=typeof t==`number`?`${this.arrowPadding}px`:``,o=n}else this.arrowPlacement===`end`?(i=typeof e==`number`?`${this.arrowPadding}px`:``,a=typeof t==`number`?`${this.arrowPadding}px`:``):this.arrowPlacement===`center`?(o=typeof e==`number`?`50%`:``,r=typeof t==`number`?`50%`:``):(o=typeof e==`number`?`${e}px`:``,r=typeof t==`number`?`${t}px`:``);Object.assign(n.style,{top:r,right:i,bottom:a,left:o,transform:``,[f]:`calc(-1 * var(--pk-popup-arrow-size, 6px) / 2)`})}return requestAnimationFrame(()=>this.updateHoverBridge()),e&&this.dispatchEvent(new Hp),!0}frames(e){return new Promise(t=>{let n=e=>{if(e<=0){t();return}requestAnimationFrame(()=>n(e-1))};n(e)})}async settleInitialPosition(){let e=++this.settleGeneration,t=this.popupElement;if(!t){this.settlingInitialPosition=!1;return}await this.frames(2),!(!this.active||e!==this.settleGeneration)&&(await this.repositionAsync(!1),t.offsetHeight,await this.frames(1),!(!this.active||e!==this.settleGeneration)&&(await this.repositionAsync(!1),!(!this.active||e!==this.settleGeneration)&&(t.classList.add(`positioned`),this.settlingInitialPosition=!1,requestAnimationFrame(()=>this.updateHoverBridge()),this.dispatchEvent(new Hp))))}resolveAnchor(){if(typeof this.anchor==`string`&&this.anchor){this.anchorElement=Vp(this,this.anchor);return}if(this.anchor instanceof Element||Wp(this.anchor)){this.anchorElement=this.anchor;return}let e=this.querySelector(`[slot="anchor"]`);e instanceof HTMLSlotElement&&(e=e.assignedElements({flatten:!0})[0]??null),this.anchorElement=e}async handleAnchorChange(){await this.stop(),this.resolveAnchor(),this.anchorElement&&this.active&&this.start()}usesPopoverTopLayer(){return Lp&&this.positionMethod!==`fixed`}stop(){return new Promise(e=>{let t=this.popupElement;this.settleGeneration+=1,this.settlingInitialPosition=!1,t?.classList.remove(`positioned`),this.usesPopoverTopLayer()&&t?.hidePopover?.(),this.cleanup?(this.cleanup(),this.cleanup=void 0,t?.style.removeProperty(`--pk-transform-origin`),requestAnimationFrame(()=>e())):e(),this.removeAttribute(`data-current-placement`)})}releasePositioning(){this.cleanup&&=(this.cleanup(),void 0)}async awaitHidden(){await this.stop()}start(){!this.anchorElement||!this.active||!this.isConnected||!this.popupElement||(this.popupElement.classList.remove(`positioned`),this.settlingInitialPosition=!0,this.usesPopoverTopLayer()&&this.popupElement.showPopover?.(),this.anchorTracking&&(this.cleanup=it(this.anchorElement,this.popupElement,()=>{this.settlingInitialPosition||this.reposition()})),this.settleInitialPosition())}getContentElement(){let e=((this.shadowRoot?.querySelector(`slot:not([name])`))?.assignedElements({flatten:!0})??[]).find(e=>e instanceof HTMLElement);if(e)return e;for(let e of this.childNodes)if(e instanceof HTMLElement&&e.getAttribute(`slot`)!==`anchor`)return e;return null}updateHoverBridge(){let e=this.popupElement;if(!this.hoverBridge||!this.anchorElement||!e)return;let t=this.anchorElement.getBoundingClientRect(),n=e.getBoundingClientRect(),r=this.placement.includes(`top`)||this.placement.includes(`bottom`),i=0,a=0,o=0,s=0,c=0,l=0,u=0,d=0;r?t.top<n.top?(i=t.left,a=t.bottom,o=t.right,s=t.bottom,c=n.left,l=n.top,u=n.right,d=n.top):(i=n.left,a=n.bottom,o=n.right,s=n.bottom,c=t.left,l=t.top,u=t.right,d=t.top):t.left<n.left?(i=t.right,a=t.top,o=n.left,s=n.top,c=t.right,l=t.bottom,u=n.left,d=n.bottom):(i=n.right,a=n.top,o=t.left,s=t.top,c=n.right,l=n.bottom,u=t.left,d=t.bottom),this.style.setProperty(`--pk-hover-bridge-top-left-x`,`${i}px`),this.style.setProperty(`--pk-hover-bridge-top-left-y`,`${a}px`),this.style.setProperty(`--pk-hover-bridge-top-right-x`,`${o}px`),this.style.setProperty(`--pk-hover-bridge-top-right-y`,`${s}px`),this.style.setProperty(`--pk-hover-bridge-bottom-left-x`,`${c}px`),this.style.setProperty(`--pk-hover-bridge-bottom-left-y`,`${l}px`),this.style.setProperty(`--pk-hover-bridge-bottom-right-x`,`${u}px`),this.style.setProperty(`--pk-hover-bridge-bottom-right-y`,`${d}px`)}render(){let e=!Lp||this.positionMethod===`fixed`,t=this.usesPopoverTopLayer();return T`
            <slot name="anchor" @slotchange=${()=>{this.handleAnchorChange()}}></slot>
            ${this.hoverBridge?T`
                <div
                    part="hover-bridge"
                    class=${Yf({"hover-bridge":!0,"hover-bridge-visible":this.active})}
                    aria-hidden="true"
                ></div>
            `:S}
            <div
                popover=${t?`manual`:S}
                part="popup"
                class=${Yf({popup:!0,active:this.active,"popup-fixed":e})}
            >
                ${this.arrow?T`<div part="arrow" class="arrow"></div>`:S}
                <slot></slot>
            </div>
        `}};C([x()],Z.prototype,`anchor`,void 0),C([x({type:Boolean,reflect:!0})],Z.prototype,`active`,void 0),C([x({attribute:`position-method`})],Z.prototype,`positionMethod`,void 0),C([x({reflect:!0})],Z.prototype,`boundary`,void 0),C([x({reflect:!0})],Z.prototype,`placement`,void 0),C([x({type:Number})],Z.prototype,`distance`,void 0),C([x({type:Number})],Z.prototype,`skidding`,void 0),C([x({type:Boolean})],Z.prototype,`flip`,void 0),C([x({attribute:`flip-fallback-placements`})],Z.prototype,`flipFallbackPlacements`,void 0),C([x({attribute:`flip-fallback-strategy`})],Z.prototype,`flipFallbackStrategy`,void 0),C([x({attribute:`flip-padding`,type:Number})],Z.prototype,`flipPadding`,void 0),C([x({type:Boolean})],Z.prototype,`shift`,void 0),C([x({attribute:`shift-padding`,type:Number})],Z.prototype,`shiftPadding`,void 0),C([x({type:Boolean})],Z.prototype,`arrow`,void 0),C([x({attribute:`arrow-placement`})],Z.prototype,`arrowPlacement`,void 0),C([x({attribute:`arrow-padding`,type:Number})],Z.prototype,`arrowPadding`,void 0),C([x()],Z.prototype,`sync`,void 0),C([x({attribute:`anchor-tracking`,type:Boolean})],Z.prototype,`anchorTracking`,void 0),C([x({attribute:`hover-bridge`,type:Boolean})],Z.prototype,`hoverBridge`,void 0),C([Ft(`.popup`)],Z.prototype,`popupElement`,void 0),C([Ft(`.arrow`)],Z.prototype,`arrowElement`,void 0),Z=C([pe(`pk-popup`)],Z);var qp=new Set([`ArrowDown`,`ArrowUp`,`ArrowLeft`,`ArrowRight`,`Home`,`End`,`Enter`,` `,`Escape`]);function Jp(e){return e.key.length===1&&!e.ctrlKey&&!e.metaKey&&!e.altKey}function Yp(e){return e.filter(e=>!e.hasAttribute(`disabled`)&&!e.hasAttribute(`hidden`)&&e.getAttribute(`aria-disabled`)!==`true`&&e.getAttribute(`aria-hidden`)!==`true`)}function Xp(e,t,n){if(n){n(t);return}let r=e[t];if(r instanceof HTMLElement&&`focusControl`in r&&typeof r.focusControl==`function`){r.focusControl();return}r?.focus()}function Zp(e){if(!e)return;let t=e.shadowRoot?.querySelector(`.option`);if(t instanceof HTMLButtonElement){t.click();return}e.click()}function Qp(e,t){let n=Yp(t.items),r=t.loop===!0;if(n.length===0)return t.currentIndex;let i=Math.max(0,t.currentIndex),a=n[i]??n[0];switch(i=n.indexOf(a),i<0&&(i=0),e.key){case`ArrowDown`:case`ArrowRight`:return e.preventDefault(),i=r&&i>=n.length-1?0:Math.min(i+1,n.length-1),Xp(n,i,t.focusItem),t.onSelect(i),i;case`ArrowUp`:case`ArrowLeft`:return e.preventDefault(),i=r&&i<=0?n.length-1:Math.max(i-1,0),Xp(n,i,t.focusItem),t.onSelect(i),i;case`Home`:return e.preventDefault(),i=0,Xp(n,i,t.focusItem),t.onSelect(i),i;case`End`:return e.preventDefault(),i=n.length-1,Xp(n,i,t.focusItem),t.onSelect(i),i;case`Enter`:case` `:return t.multiselect||(e.preventDefault(),Zp(n[i])),i;case`Escape`:return e.preventDefault(),t.onClose?.(),i;default:return i}}function $p(e,t){let n=``,r=0,i=()=>{n=``,window.clearTimeout(r)};return{handleKey:a=>{if(a.key.length!==1||a.ctrlKey||a.metaKey||a.altKey)return;n+=a.key.toLowerCase(),window.clearTimeout(r),r=window.setTimeout(i,750);let o=Yp(e);for(let e=0;e<o.length;e+=1)if((o[e]?.textContent??``).trim().toLowerCase().startsWith(n)){t(e),a.preventDefault();return}},reset:i}}var em=e=>e.hidden||e.hasAttribute(`data-pk-filter-empty`),tm=e=>{let t=[...e.querySelectorAll(`:scope > pk-option, :scope > pk-option-group, :scope > pk-separator`)],n=(e,n)=>{for(let r=e+n;n<0?r>=0:r<t.length;r+=n){let e=t[r];if(!(!e||e.localName===`pk-separator`))return e}return null};for(let e=0;e<t.length;e+=1){let r=t[e];if(!r||r.localName!==`pk-separator`)continue;let i=n(e,-1),a=n(e,1);r.hidden=!i||!a||em(i)||em(a)}};function nm(e){if(e.panel instanceof Element){let t=e.panel.closest(`pk-popup`);if(t)return t;let n=e.panel.getRootNode();if(n instanceof ShadowRoot&&n.host.localName===`pk-popup`)return n.host}return e.host instanceof HTMLElement?e.host.shadowRoot?.querySelector(`pk-popup`)??e.host.querySelector(`:scope > pk-popup`)??e.host.querySelector(`pk-popup`):null}function rm(e,t={}){let n=e.composedPath();if(t.host&&n.includes(t.host)||t.anchor&&n.includes(t.anchor)||t.panel&&n.includes(t.panel))return!0;let r=nm(t);return r&&n.includes(r)?!0:n.some(e=>e instanceof HTMLElement?r&&e.classList.contains(`popup`)&&(e===r||r.contains(e))?!0:t.extraMatches?.(e)??!1:!1)}function im(e,t={}){return rm(e,t)}var am=w`
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
`;function om(e={}){let{validationElement:t,validationProperty:n}=e;!t&&typeof document<`u`&&(t=Object.assign(document.createElement(`input`),{required:!0})),n||=`value`;let r={observedAttributes:[`required`],message:t?.validationMessage??`Please fill out this field.`,checkValidity(e){let t={message:``,isValid:!0,invalidKeys:[]};if(!e.required)return t;let i=e[n];return i!=null&&i!==!1&&i!==``?t:(t.isValid=!1,t.message=typeof r.message==`function`?r.message(e):r.message??``,t.invalidKeys.push(`valueMissing`),t)}};return r}var sm=w`
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
`;function cm(e,t){return t||(e.getAttribute(`hint`)??``)}function lm(e,t,n=!1){return!!t||e(`instructions`,n)||e(`hint`)}var um=w`
    @layer pk-component {
        :host {
            display: inline-flex;
            vertical-align: middle;
            font-family: var(--pk-font-family);
            font-size: var(--pk-font-size-sm);
            line-height: var(--pk-line-height);
            --pk-lightswitch-border-color: var(--pk-color-slate-800);
            --pk-lightswitch-track-off: var(--pk-color-gray-200);
            --pk-lightswitch-track-on: var(--pk-color-teal-550);
            --pk-lightswitch-track-on-border: var(--pk-color-teal-550-border);
            --pk-lightswitch-focus-shadow: 0 0 0 1px #fff, 0 0 0 3px var(--pk-color-sky-600),
                0 0 6px 1px hsl(from var(--pk-color-sky-600) h s l / 0.8);
            --pk-lightswitch-invalid-shadow: 0 0 0 1px #fff, 0 0 0 2.5px var(--pk-color-rose-600);
            --pk-lightswitch-invalid-focus-shadow: 0 0 0 1px #fff, 0 0 0 3px var(--pk-color-rose-600),
                0 0 6px 1px hsl(from var(--pk-color-rose-600) h s l / 0.8);
        }

        :host([disabled]) {
            cursor: not-allowed;
        }

        .base {
            display: inline-flex;
            align-items: flex-start;
            gap: 0.5rem;
        }

        :host([disabled]) .base {
            opacity: 0.5;
        }

        .content {
            min-width: 0;
            cursor: pointer;
            user-select: none;
        }

        :host([disabled]) .content {
            cursor: not-allowed;
        }

        .label {
            display: block;
            /* Match checkbox / radio option labels (gray-700), not gray-900. */
            color: var(--pk-color-gray-700);
            line-height: 1rem;
        }

        .label:empty {
            display: none;
        }

        .instructions:empty,
        .hint:empty {
            display: none;
        }

        .switch {
            display: inline-flex;
            flex-shrink: 0;
            align-items: center;
            margin: 0;
            padding: 0;
            border: 0;
            border-radius: 11px;
            background: var(--pk-lightswitch-track-off, #d8dee7);
            box-shadow: inset 0 0 0 1px var(--pk-lightswitch-border-color, #667c92);
            cursor: pointer;
            user-select: none;
            appearance: none;
            transition: background-color 0.15s ease, box-shadow 0.15s ease;
        }

        .switch:focus {
            outline: none;
        }

        .switch:focus-visible {
            box-shadow: var(--pk-lightswitch-focus-shadow);
        }

        .switch[aria-checked='true'] {
            background: var(--pk-lightswitch-track-on, #0f9d8a);
            box-shadow: inset 0 0 0 1px var(--pk-lightswitch-track-on-border, #007d6f);
        }

        .switch[aria-checked='true']:focus-visible {
            box-shadow: var(--pk-lightswitch-focus-shadow);
        }

        :host([invalid]) .switch,
        :host(:state(user-invalid)) .switch,
        .switch[aria-invalid='true'] {
            box-shadow: var(--pk-lightswitch-invalid-shadow);
        }

        :host([invalid]) .switch[aria-checked='true'],
        :host(:state(user-invalid)) .switch[aria-checked='true'],
        .switch[aria-invalid='true'][aria-checked='true'] {
            background: var(--pk-lightswitch-track-on);
        }

        :host([invalid]) .switch:focus-visible,
        :host(:state(user-invalid)) .switch:focus-visible,
        .switch[aria-invalid='true']:focus-visible {
            box-shadow: var(--pk-lightswitch-invalid-focus-shadow);
        }

        .switch:disabled {
            cursor: not-allowed;
        }

        :host([size='default']) .switch {
            width: 34px;
            height: 22px;
        }

        :host([size='sm']) .switch {
            width: 28px;
            height: 18px;
            border-radius: 9px;
        }

        :host([size='xs']) .switch {
            width: 24px;
            height: 16px;
            border-radius: 8px;
        }

        :host([size='xxs']) .switch {
            width: 24px;
            height: 14px;
            border-radius: 7px;
        }

        .thumb {
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: var(--pk-color-white, #fff);
            box-shadow: inset 0 0 0 1px var(--pk-lightswitch-border-color, #667c92);
            pointer-events: none;
            transition: transform 0.15s ease, box-shadow 0.15s ease;
        }

        :host([size='default']) .thumb {
            width: 18px;
            height: 18px;
            transform: translateX(2px);
        }

        :host([size='default']) .switch[aria-checked='true'] .thumb {
            transform: translateX(calc(100% - 4px));
            box-shadow: inset 0 0 0 1px var(--pk-lightswitch-track-on-border);
        }

        :host([size='sm']) .thumb {
            width: 14px;
            height: 14px;
            transform: translateX(2px);
        }

        :host([size='sm']) .switch[aria-checked='true'] .thumb {
            transform: translateX(calc(100% - 2px));
            box-shadow: inset 0 0 0 1px var(--pk-lightswitch-track-on-border);
        }

        :host([size='xs']) .thumb {
            width: 12px;
            height: 12px;
            transform: translateX(2px);
        }

        :host([size='xs']) .switch[aria-checked='true'] .thumb {
            transform: translateX(calc(100% - 2px));
            box-shadow: inset 0 0 0 1px var(--pk-lightswitch-track-on-border);
        }

        :host([size='xxs']) .thumb {
            width: 10px;
            height: 10px;
            transform: translateX(2px);
        }

        :host([size='xxs']) .switch[aria-checked='true'] .thumb {
            transform: translateX(12px);
            box-shadow: inset 0 0 0 1px var(--pk-lightswitch-track-on-border, #007d6f);
        }

        .thumb svg {
            width: 14px;
            height: 14px;
            color: var(--pk-lightswitch-track-on);
            opacity: 0;
            transform: translateY(1px);
            transition: opacity 0.15s ease;
        }

        .switch[aria-checked='true'] .thumb svg {
            opacity: 1;
        }

        :host([size='sm']) .thumb svg {
            width: 10px;
            height: 10px;
        }

        :host([size='xs']) .thumb svg,
        :host([size='xxs']) .thumb svg {
            display: none;
        }

        .input {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
            opacity: 0;
        }
    }
`,dm=T`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" aria-hidden="true">
        <path fill="currentColor" d="M557.5 192L534.9 214.6L278.9 470.6C266.4 483.1 246.1 483.1 233.6 470.6L105.6 342.6L83 320L128.3 274.7C129.6 276 172.3 318.7 256.3 402.7L489.7 169.3L512.3 146.7L557.6 192z" />
    </svg>
`,fm=class extends gp{constructor(...e){super(...e),this.assumeInteractionOn=[`change`],this.hasSlotController=new vp(this,`instructions`,`hint`),this.checked=!1,this.defaultChecked=!1,this.invalid=!1,this.size=`default`,this.value=`on`,this.label=``,this.instructions=``}static{this.shadowRootOptions={mode:`open`,delegatesFocus:!0}}static{this.styles=[sm,um]}static get validators(){return[...super.validators,_p(),om({validationProperty:`checked`})]}connectedCallback(){this.instructions=cm(this,this.instructions),super.connectedCallback()}get validationTarget(){return this.input}syncFormValue(){this.setFormValue(this.checked?this.value:null,this.checked?`on`:`off`)}resetToDefaultValue(){this.checked=this.defaultChecked}restoreFormState(e){this.checked=e===`on`||e===this.value}updated(e){this.input&&e.has(`checked`)&&(this.input.checked=this.checked),super.updated(e)}click(){this.switchElement?.click()}focus(e){this.switchElement?.focus(e)}blur(){this.switchElement?.blur()}toggle(){this.disabled||(this.checked=!this.checked,this.emitCheckedChange())}handleKeyDown(e){let t=this.matches(`:dir(rtl)`);if(e.key===` `||e.key===`Enter`){e.preventDefault(),this.toggle();return}if(e.key===`ArrowLeft`){e.preventDefault(),this.checked=t,this.emitCheckedChange();return}e.key===`ArrowRight`&&(e.preventDefault(),this.checked=!t,this.emitCheckedChange())}emitCheckedChange(){this.hasInteracted=!0,this.dispatchEvent(new CustomEvent(`pk-change`,{detail:{checked:this.checked},bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`input`,{bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0}))}handleLabelClick(e){this.disabled||e.target===this.switchElement||this.toggle()}hasLabelContent(){if(this.label)return!0;let e=this.shadowRoot?.querySelector(`slot:not([name])`);return e?e.assignedNodes({flatten:!0}).some(e=>e.nodeType===Node.TEXT_NODE?!!e.textContent?.trim():e.nodeType===Node.ELEMENT_NODE):!1}render(){let e=lm((e,t)=>this.hasSlotController.test(e,t),this.instructions),t=this.hasLabelContent();return T`
            <div part="base" class="base">
                <button
                    part="switch"
                    class="switch"
                    type="button"
                    role="switch"
                    ?disabled=${this.disabled}
                    aria-checked=${this.checked?`true`:`false`}
                    aria-invalid=${this.invalid?`true`:S}
                    aria-describedby=${e?`instructions`:S}
                    aria-labelledby=${t?`label`:S}
                    @click=${this.toggle}
                    @keydown=${this.handleKeyDown}
                >
                    <span part="thumb" class="thumb">${dm}</span>
                </button>
                <input
                    part="input"
                    class="input"
                    type="checkbox"
                    tabindex="-1"
                    .checked=${this.checked}
                    ?disabled=${this.disabled}
                    ?required=${this.required}
                    value=${this.value}
                    aria-invalid=${this.invalid?`true`:S}
                    @change=${e=>e.stopPropagation()}
                />
                ${t||e?T`
                        <div class="content" @click=${this.handleLabelClick}>
                            ${t?T`
                                    <span part="label" class="label" id="label">
                                        <slot></slot>${this.label}
                                    </span>
                                `:S}
                            ${e?T`
                                    <span part="instructions" class="instructions form-control__instructions" id="instructions">
                                        <slot name="instructions">${this.instructions}</slot>
                                        <slot name="hint"></slot>
                                    </span>
                                `:S}
                        </div>
                    `:S}
            </div>
        `}};C([x({type:Boolean,reflect:!0})],fm.prototype,`checked`,void 0),C([x({attribute:`default-checked`,type:Boolean})],fm.prototype,`defaultChecked`,void 0),C([x({type:Boolean,reflect:!0})],fm.prototype,`invalid`,void 0),C([x({reflect:!0})],fm.prototype,`size`,void 0),C([x()],fm.prototype,`value`,void 0),C([x()],fm.prototype,`label`,void 0),C([x()],fm.prototype,`instructions`,void 0),C([Ft(`.input`)],fm.prototype,`input`,void 0),C([Ft(`[part="switch"]`)],fm.prototype,`switchElement`,void 0),fm=C([pe(`pk-lightswitch`)],fm);function pm(e,t){let n=String(e??``),r=String(t??``).trim();if(!r)return[{text:n,match:!1}];let i=n.toLowerCase(),a=r.toLowerCase(),o=[],s=0,c=i.indexOf(a);for(;c!==-1;)c>s&&o.push({text:n.slice(s,c),match:!1}),o.push({text:n.slice(c,c+r.length),match:!0}),s=c+r.length,c=i.indexOf(a,s);return s<n.length&&o.push({text:n.slice(s),match:!1}),o.length>0?o:[{text:n,match:!1}]}var mm=w`
    @layer pk-component {
        :host {
            display: block;
            /*
             * Slotted option labels inherit type metrics from this host (same
             * Craft-vs-Tailwind trap as pk-dropdown-item). Size tokens arrive via
             * pk-select ::slotted(pk-option) custom properties.
             */
            font-family: var(--pk-font-family);
            font-size: var(--pk-select-item-font-size, var(--pk-font-size-base));
            line-height: var(--pk-select-item-line-height, 1.4);
            color: var(--pk-color-gray-700);
        }

        .option {
            position: relative;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            width: 100%;
            margin: 0;
            min-height: var(--pk-select-item-min-height, var(--pk-input-height));
            padding-block: var(--pk-select-item-padding-block, 6px);
            padding-inline-start: var(--pk-select-item-padding-inline, 10px);
            padding-inline-end: var(--pk-select-item-padding-inline-end, 2rem);
            border: var(--pk-select-trigger-border-width, 1px) solid transparent;
            background: transparent;
            color: inherit;
            font: inherit;
            font-family: var(--pk-font-family);
            font-size: var(--pk-select-item-font-size, var(--pk-font-size-base));
            line-height: var(--pk-select-item-line-height, 1.4);
            text-align: left;
            white-space: nowrap;
            cursor: default;
            user-select: none;
            outline: none;
            box-sizing: border-box;
        }

        .start {
            display: none;
            flex: 0 0 auto;
            align-items: center;
        }

        :host([data-has-start]) .start {
            display: inline-flex;
        }

        :host([hidden]) {
            display: none !important;
        }

        .option:focus-visible,
        :host([highlighted]) .option {
            background: var(--pk-color-slate-100);
        }

        :host([disabled]) .option,
        .option[aria-disabled='true'] {
            pointer-events: none;
            opacity: 0.5;
        }

        .check {
            position: absolute;
            inset-inline-end: var(--pk-select-item-indicator-inset, 0.5rem);
            top: 50%;
            display: none;
            align-items: center;
            justify-content: center;
            width: var(--pk-select-item-indicator-size, 0.75rem);
            height: var(--pk-select-item-indicator-size, 0.75rem);
            color: var(--pk-color-gray-700);
            pointer-events: none;
            transform: translateY(-50%);
            line-height: 0;
        }

        :host([selected]) .check {
            display: inline-flex;
        }

        .check svg {
            display: block;
            width: var(--pk-select-item-indicator-size, 0.75rem);
            height: var(--pk-select-item-indicator-size, 0.75rem);
            flex-shrink: 0;
            pointer-events: none;
        }

        .label {
            flex: 1;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            /* Allow custom multi-line option layouts (title + subtitle) to stack. */
            white-space: normal;
        }

        .match {
            padding: 0;
            border-radius: 2px;
            background: var(--pk-color-blue-100);
            color: inherit;
        }
    }
`,hm=Qf(lp.check),gm=class extends Ke{constructor(...e){super(...e),this.value=``,this.label=``,this.disabled=!1,this.selected=!1,this.highlighted=!1,this.hidden=!1,this.focusIndex=-1,this.optionId=``,this.matchQuery=``}static{this.styles=mm}focusControl(e=!0){this.shadowRoot?.querySelector(`.option`)?.focus({preventScroll:e})}getLabel(){if(this.label.trim())return this.label.trim();let e=this.shadowRoot?.querySelector(`slot:not([name])`);return e?e.assignedNodes().map(e=>(e.textContent??``).trim()).filter(Boolean).join(` `).trim():this.textContent?.trim()??this.value}getSearchText(){let e=this.shadowRoot?.querySelector(`slot:not([name])`);return e&&e.assignedNodes().map(e=>(e.textContent??``).trim()).filter(Boolean).join(` `).trim()||this.getLabel()}hasRichLabelContent(){return[...this.children].some(e=>e instanceof HTMLElement?!e.slot||e.slot===``:!1)}getStartElements(){return[...this.querySelectorAll(`:scope > [slot="start"]`)].filter(e=>e instanceof HTMLElement)}firstUpdated(){(this.shadowRoot?.querySelector(`slot[name="start"]`))?.addEventListener(`slotchange`,()=>this.syncStartDecoration()),this.syncStartDecoration()}syncStartDecoration(){this.toggleAttribute(`data-has-start`,this.getStartElements().length>0)}handleClick(){this.disabled||this.dispatchEvent(new CustomEvent(`pk-option-select`,{detail:{value:this.value},bubbles:!0,composed:!0}))}handleMouseEnter(){this.disabled||this.hidden||this.dispatchEvent(new CustomEvent(`pk-option-highlight`,{detail:{value:this.value},bubbles:!0,composed:!0}))}handleKeyDown(e){if(!new Set([`ArrowDown`,`ArrowUp`,`ArrowLeft`,`ArrowRight`,`Home`,`End`,`Enter`,` `,`Escape`]).has(e.key))return;let t=this.closest(`pk-select, pk-combobox`),n=t?null:this.closest(`[role="listbox"]`);if(!t&&!n)return;e.preventDefault(),e.stopPropagation();let r=new CustomEvent(`pk-listbox-keydown`,{detail:{keyboardEvent:e},bubbles:!0});if(t){t.dispatchEvent(r);return}n.dispatchEvent(r)}renderLabel(){let e=this.matchQuery.trim();return!e||this.hasRichLabelContent()?T`
                <span part="label" class="label">
                    <slot></slot>
                </span>
            `:T`
            <span part="label" class="label">
                ${pm(this.getLabel(),e).map(e=>e.match?T`<mark class="match">${e.text}</mark>`:T`<span>${e.text}</span>`)}
            </span>
        `}render(){return T`
            <button
                part="option"
                type="button"
                class="option"
                role="option"
                id=${this.optionId||S}
                ?disabled=${this.disabled}
                aria-disabled=${this.disabled?`true`:S}
                aria-selected=${this.selected?`true`:`false`}
                tabindex=${this.focusIndex}
                @click=${this.handleClick}
                @mouseenter=${this.handleMouseEnter}
                @keydown=${this.handleKeyDown}
            >
                <span part="start" class="start">
                    <slot name="start"></slot>
                </span>
                ${this.renderLabel()}
                <span part="check" class="check" aria-hidden="true">${Be(hm)}</span>
            </button>
        `}};C([x()],gm.prototype,`value`,void 0),C([x()],gm.prototype,`label`,void 0),C([x({type:Boolean,reflect:!0})],gm.prototype,`disabled`,void 0),C([x({type:Boolean,reflect:!0})],gm.prototype,`selected`,void 0),C([x({type:Boolean,reflect:!0})],gm.prototype,`highlighted`,void 0),C([x({type:Boolean,reflect:!0})],gm.prototype,`hidden`,void 0),C([x({type:Number,attribute:`focus-index`})],gm.prototype,`focusIndex`,void 0),C([x()],gm.prototype,`optionId`,void 0),C([x({attribute:!1})],gm.prototype,`matchQuery`,void 0),gm=C([pe(`pk-option`)],gm);var _m=[am,w`
    ${Wf}
    @layer pk-component {
        :host {
            display: inline-block;
            position: relative;
            width: fit-content;
            max-width: 100%;
            align-self: flex-start;
            flex: none;
            color: var(--pk-color-gray-700);
            font-family: var(--pk-font-family);
            font-size: var(--pk-font-size-base);
            line-height: var(--pk-line-height);
            --pk-select-trigger-border-width: 1px;
            --pk-select-item-min-height: var(--pk-input-height);
            --pk-select-item-padding-block: 6px;
            --pk-select-item-padding-inline: 10px;
            --pk-select-item-padding-inline-end: 2rem;
            --pk-select-item-font-size: var(--pk-font-size-base);
            --pk-select-item-line-height: var(--pk-input-control-line-height, 1.25rem);
            --pk-select-item-indicator-size: 0.75rem;
            --pk-select-item-indicator-inset: 0.5rem;
            /* v1 SelectLabel default: text-xs → 12px */
            --pk-select-group-label-font-size: 12px;
            --pk-select-decoration-size: 0.875rem;
        }

        :host([width='full']) {
            display: block;
            width: 100%;
        }

        :host([width='full']) .control {
            width: 100%;
        }

        :host([width='full']) button.control .icon {
            margin-inline-start: auto;
        }

        .control {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            /* Fill the host when consumers set min-width/width on :host. */
            width: 100%;
            max-width: 100%;
            min-width: 0;
            margin: 0;
            padding: var(--pk-select-item-padding-block) var(--pk-select-item-padding-inline);
            border: var(--pk-select-trigger-border-width) solid transparent;
            border-radius: var(--pk-radius-lg);
            --pk-select-fill: var(--pk-color-slate-250);
            --pk-select-fill-hover: var(--pk-color-slate-300);
            background: var(--pk-select-fill);
            color: var(--pk-color-gray-700);
            font: inherit;
            font-size: var(--pk-select-item-font-size);
            line-height: var(--pk-input-control-line-height, 1.25rem);
            white-space: nowrap;
            cursor: pointer;
            outline: none;
            box-sizing: border-box;
            transition: border-color 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
        }

        button.control {
            appearance: none;
            -webkit-appearance: none;
            text-align: left;
            background-color: var(--pk-select-fill);
            border: var(--pk-select-trigger-border-width) solid transparent;
        }

        :host(:not([disabled])) .control:hover:not(.is-disabled):not(:disabled),
        :host(:not([disabled])) button.control:hover:not(.is-disabled):not(:disabled) {
            background: var(--pk-select-fill-hover);
        }

        :host(:not([disabled])) button.control:hover:not(.is-disabled):not(:disabled) {
            background-color: var(--pk-select-fill-hover);
        }

        :host(:not([invalid]):not(:state(user-invalid))) button.control:focus-visible,
        :host(:not([invalid]):not(:state(user-invalid))[data-state='focus-visible']) button.control {
            border-color: var(--pk-color-sky-600);
            box-shadow: var(--pk-input-focus-shadow);
        }

        .control.is-disabled {
            cursor: not-allowed;
            opacity: 0.5;
        }

        .trigger {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex: 0 0 auto;
            min-width: 0;
            padding: 0;
            border: 0;
            background: transparent;
            color: inherit;
            font: inherit;
            cursor: inherit;
            outline: none;
        }

        .control > .trigger:not(.trigger--icon) {
            flex: 0 1 auto;
            justify-content: flex-start;
        }

        .trigger--icon {
            width: 1.25rem;
        }

        .trigger-start {
            display: none;
            flex: 0 0 auto;
            align-items: center;
        }

        .trigger-start.has-decoration {
            display: inline-flex;
        }

        .control-start,
        .control-end {
            display: inline-flex;
            align-items: center;
            flex-shrink: 0;
            line-height: 0;
            color: var(--pk-color-gray-600);
        }

        slot[name='start']::slotted(svg),
        slot[name='end']::slotted(svg) {
            width: var(--pk-select-decoration-size);
            height: var(--pk-select-decoration-size);
        }

        .value {
            flex: 1 1 auto;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: left;
        }

        .icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            line-height: 0;
            pointer-events: none;
            color: var(--pk-color-gray-600);
        }

        /* Extra space before the expand chevron (control gap stays for start icon ↔ label). */
        .control > .icon,
        .control > .trigger--icon {
            margin-inline-start: 0.25rem;
        }

        .icon svg {
            display: block;
            width: 0.75rem;
            height: 0.75rem;
        }

        .tags {
            display: flex;
            flex: 0 1 auto;
            flex-wrap: wrap;
            gap: 0.25rem;
            min-width: 0;
        }

        .tag {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            max-width: 10ch;
            padding: 0.125rem 0.375rem;
            border-radius: var(--pk-radius-sm);
            background: var(--pk-color-gray-200);
            color: var(--pk-color-gray-800);
            font-size: 12px;
            line-height: 1.3;
        }

        .tag-label {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .tag-remove {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 0.875rem;
            height: 0.875rem;
            padding: 0;
            border: 0;
            border-radius: var(--pk-radius-sm);
            background: transparent;
            color: var(--pk-color-gray-600);
            cursor: pointer;
        }

        .tag-remove:hover {
            background: rgb(0 0 0 / 8%);
        }

        .clear-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 1.25rem;
            height: 1.25rem;
            padding: 0;
            border: 0;
            border-radius: var(--pk-radius-sm);
            background: transparent;
            color: var(--pk-color-gray-600);
            cursor: pointer;
            flex-shrink: 0;
        }

        .clear-button:hover {
            background: rgb(0 0 0 / 6%);
            color: var(--pk-color-gray-800);
        }

        .value-input {
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

        .panel ::slotted(pk-separator) {
            margin: 4px 0;
        }

        .panel {
            width: max-content;
            min-width: var(--pk-select-anchor-width, 8rem);
            max-height: 16rem;
            overflow: auto;
            padding: 0;
            border: 0;
            border-radius: var(--pk-radius-md);
            background: var(--pk-color-white);
            box-shadow: var(--pk-shadow-popup);
            color: var(--pk-color-gray-700);
            outline: none;
        }

        .panel[hidden] {
            display: none !important;
        }

        :host([invalid]) .control,
        :host(:state(user-invalid)) .control {
            border-color: var(--pk-color-rose-600);
        }

        :host([invalid]) button.control:focus-visible,
        :host([invalid][data-state='focus-visible']) button.control,
        :host(:state(user-invalid)) button.control:focus-visible,
        :host(:state(user-invalid)[data-state='focus-visible']) button.control {
            border-color: var(--pk-color-rose-600);
            box-shadow: var(--pk-input-invalid-focus-shadow);
        }

        :host([size='xs']) {
            --pk-select-item-min-height: 0;
            --pk-select-item-padding-block: 4px;
            --pk-select-item-padding-inline: 8px;
            --pk-select-item-padding-inline-end: 1.75rem;
            --pk-select-item-font-size: 11px;
            --pk-select-item-line-height: 1.25;
            /* v1 SelectLabel xs: text-[11px] */
            --pk-select-group-label-font-size: 11px;
            --pk-select-decoration-size: 0.625rem;
        }

        :host([size='xs']) .control {
            border-radius: var(--pk-radius-sm);
            /* Match trigger line-height to the compact item token (default is 1.25rem). */
            line-height: var(--pk-select-item-line-height, 1.25);
        }

        :host([size='xs']) .icon svg {
            width: 0.625rem;
            height: 0.625rem;
        }

        /* Options live in light DOM; ::slotted pushes size tokens onto each pk-option
         * host so the open listbox matches the trigger (inheritance alone is flaky when
         * the panel is promoted to the popover top layer). */
        :host([size='xs']) ::slotted(pk-option) {
            --pk-select-item-min-height: 0;
            --pk-select-item-padding-block: 4px;
            --pk-select-item-padding-inline: 8px;
            --pk-select-item-padding-inline-end: 1.75rem;
            --pk-select-item-font-size: 11px;
            --pk-select-item-line-height: 1.25;
            --pk-select-item-indicator-size: 0.625rem;
        }

        :host([size='xs']) .panel {
            max-height: 12rem;
        }

        /* Editable-table cells only (class set by pk-editable-table) — compact chip + menu. */
        :host(.cell-pk-control) {
            --pk-select-item-min-height: 0;
            --pk-select-item-padding-block: 5px;
            --pk-select-item-padding-inline: 8px;
            --pk-select-item-padding-inline-end: 1.5rem;
            --pk-select-item-font-size: 11px;
            --pk-select-item-line-height: 1.2;
            /* Compact table chip — match xs label size. */
            --pk-select-group-label-font-size: 11px;
            --pk-select-decoration-size: 0.625rem;
            --pk-select-item-indicator-size: 0.625rem;
        }

        :host(.cell-pk-control) .control {
            border-radius: var(--pk-radius-sm);
            line-height: var(--pk-select-item-line-height, 1.2);
        }

        :host(.cell-pk-control) ::slotted(pk-option) {
            --pk-select-item-min-height: 0;
            --pk-select-item-padding-block: 5px;
            --pk-select-item-padding-inline: 8px;
            --pk-select-item-padding-inline-end: 1.5rem;
            --pk-select-item-font-size: 11px;
            --pk-select-item-line-height: 1.2;
            --pk-select-item-indicator-size: 0.625rem;
        }

        :host(.cell-pk-control) .panel {
            max-height: 11rem;
        }

        :host([size='sm']) {
            --pk-select-item-min-height: 0;
            --pk-select-item-padding-block: 6px;
            --pk-select-item-padding-inline: 10px;
            --pk-select-item-padding-inline-end: 1.75rem;
            --pk-select-item-font-size: 12px;
            --pk-select-item-indicator-inset: 0.625rem;
            /* v1 SelectLabel sm: text-[12px] */
            --pk-select-group-label-font-size: 12px;
            --pk-select-decoration-size: 0.6875rem;
        }

        :host([size='sm']) .control {
            border-radius: var(--pk-radius-md);
        }

        :host([size='sm']) .icon svg {
            width: 0.6875rem;
            height: 0.6875rem;
        }

        :host([size='lg']) {
            --pk-select-item-padding-block: 8px;
            --pk-select-item-padding-inline: 12px;
            --pk-select-item-font-size: var(--pk-font-size-base);
            --pk-select-item-indicator-inset: 0.75rem;
            /* v1 SelectLabel lg: text-sm → 14px */
            --pk-select-group-label-font-size: 14px;
            --pk-select-decoration-size: 1rem;
        }

        :host([size='xl']) {
            --pk-select-item-padding-block: 10px;
            --pk-select-item-padding-inline: 14px;
            --pk-select-item-padding-inline-end: 2.25rem;
            --pk-select-item-font-size: var(--pk-font-size-base);
            --pk-select-item-indicator-inset: 0.875rem;
            /* v1 SelectLabel xl: text-base → 16px */
            --pk-select-group-label-font-size: 16px;
            --pk-select-decoration-size: 1.125rem;
        }

        :host([size='xl']) .icon svg {
            width: 0.875rem;
            height: 0.875rem;
        }
    }
`],vm=Qf(lp.chevronDown),Q=class extends gp{constructor(...e){super(...e),this.assumeInteractionOn=[`blur`,`input`],this.open=!1,this.multiple=!1,this.placement=`bottom-start`,this.sideOffset=4,this.clearable=!1,this.withClear=!1,this.invalid=!1,this.size=`default`,this.placeholder=``,this.value=``,this.defaultValue=``,this.values=[],this.defaultValues=[],this.ariaLabel=null,this.loopFocus=!1,this.hasSlotController=new vp(this,`start`,`end`),this.listboxId=bp(`pk-select-listbox`),this.triggerId=bp(`pk-select-trigger`),this.options=[],this.highlightedIndex=0,this.dismissRegistered=!1,this.panelEventTarget=null,this.typeToSelect=$p([],()=>{}),this.closing=!1,this.panelAnimated=!1,this.handleOptionsMutation=(e={})=>{let t=this.getOptionElements(),n=t.length!==this.options.length||t.some((e,t)=>e!==this.options[t]);this.options=t,this.applySelection(),this.updateTypeToSelect(),e.render!==!1&&n&&this.requestUpdate()},this.syncOptions=()=>{this.handleOptionsMutation({render:!0})},this.togglePanel=e=>{e?.preventDefault(),e?.stopPropagation(),!(this.disabled||this.closing)&&(this.open?this.closePanel(`api`):this.openPanel())},this.onDocumentPointerDown=e=>{this.isPointerInside(e)||this.closePanel(`light-dismiss`)},this.onDocumentKeyDown=e=>{if(this.open){if(e.key===`Escape`){if(!Tp(this))return;e.preventDefault(),e.stopPropagation(),this.closePanel(`escape`);return}(qp.has(e.key)||Jp(e))&&rm(e,{anchor:this.getPopupAnchor(),panel:this.panelElement})&&(e.preventDefault(),e.stopPropagation(),this.onListboxKeyDown(e))}},this.handleOptionSelect=e=>{let{value:t}=e.detail;this.multiple?this.values=this.values.includes(t)?this.values.filter(e=>e!==t):[...this.values,t]:(this.value=t,this.closePanel(`api`)),this.applySelection(),this.emitValueChange()},this.handleOptionHighlight=e=>{if(!this.open)return;let t=this.getEnabledVisibleOptions().findIndex(t=>t.value===e.detail.value);t!==-1&&t!==this.highlightedIndex&&(this.highlightedIndex=t,this.syncHighlight())},this.onKeyDown=e=>{if(!this.open){(e.key===`ArrowDown`||e.key===`Enter`||e.key===` `)&&(e.preventDefault(),this.openPanel());return}this.onListboxKeyDown(e)},this.handleListboxKeyDownEvent=e=>{this.open&&this.onListboxKeyDown(e.detail.keyboardEvent)}}static{this.styles=_m}static get validators(){return[...super.validators,_p(),{observedAttributes:[`required`],checkValidity:e=>{let t=e,n={message:`Please select an item in the list.`,isValid:!0,invalidKeys:[]};return!t.required||!(t.multiple?t.values.length===0:!t.value)?n:(n.isValid=!1,n.invalidKeys.push(`valueMissing`),n)}}]}get panelElement(){return this.popupElement?.getContentElement()??null}connectedCallback(){this.refreshOptions(),super.connectedCallback(),this.addEventListener(`pk-listbox-keydown`,this.handleListboxKeyDownEvent),this.addEventListener(`keydown`,this.onKeyDown),this.optionsObserver=new MutationObserver(()=>{this.handleOptionsMutation({render:!0})}),this.optionsObserver.observe(this,{childList:!0,subtree:!0})}disconnectedCallback(){this.unbindPanelEvents(),this.removeEventListener(`pk-listbox-keydown`,this.handleListboxKeyDownEvent),this.removeEventListener(`keydown`,this.onKeyDown),this.optionsObserver?.disconnect(),this.closePanel(`api`),super.disconnectedCallback()}updated(e){(e.has(`value`)||e.has(`values`)||e.has(`multiple`))&&this.applySelection(),super.updated(e)}getOptionElements(){let e=this.popupElement?.getContentElement()?.querySelectorAll(`pk-option`);return e&&e.length>0?[...e]:[...this.querySelectorAll(`pk-option`)]}refreshOptions(){this.handleOptionsMutation({render:!1})}bindPanelEvents(){let e=this.panelElement;!e||e===this.panelEventTarget||(this.unbindPanelEvents(),this.panelEventTarget=e,e.addEventListener(`pk-option-select`,this.handleOptionSelect),e.addEventListener(`pk-option-highlight`,this.handleOptionHighlight),e.addEventListener(`pk-listbox-keydown`,this.handleListboxKeyDownEvent))}unbindPanelEvents(){this.panelEventTarget&&=(this.panelEventTarget.removeEventListener(`pk-option-select`,this.handleOptionSelect),this.panelEventTarget.removeEventListener(`pk-option-highlight`,this.handleOptionHighlight),this.panelEventTarget.removeEventListener(`pk-listbox-keydown`,this.handleListboxKeyDownEvent),null)}get validationTarget(){return this.input??this.triggerButton??this.controlElement}getAriaMirrorTarget(){return this.triggerButton??this.controlElement??null}syncFormValue(){if(!this.name){this.setFormValue(null);return}if(this.multiple){let e=new FormData;for(let t of this.values)e.append(this.name,t);this.setFormValue(e);return}this.setFormValue(this.value||``)}resetToDefaultValue(){this.multiple?this.values=[...this.defaultValues]:this.value=this.defaultValue,this.applySelection()}restoreFormState(e){if(e instanceof FormData&&this.name){this.values=e.getAll(this.name).map(String);return}typeof e==`string`&&(this.value=e)}isOptionInHiddenGroup(e){return!!e.closest(`pk-option-group`)?.hidden}getVisibleOptions(){return this.options.filter(e=>!this.isOptionInHiddenGroup(e))}getEnabledVisibleOptions(){return this.getVisibleOptions().filter(e=>!e.disabled)}isSelected(e){return this.multiple?this.values.includes(e):this.value===e}applySelection(){let e=this.getVisibleOptions();for(let t of this.options)t.selected=this.isSelected(t.value),t.hidden=!e.includes(t),t.optionId=`${this.listboxId}-option-${t.value}`;for(let e of this.querySelectorAll(`pk-option-group`)){let t=[...e.querySelectorAll(`pk-option`)];e.hidden=t.length>0&&t.every(e=>e.hidden)}tm(this),this.syncValueInput(),this.syncTriggerDecorations(),this.open&&this.syncHighlight()}syncValueInput(){if(this.input){if(this.multiple){this.input.value=this.values.join(`,`),this.input.required=this.required;return}this.input.value=this.value,this.input.required=this.required}}getDisplayValue(){if(this.multiple){let e=this.getSelectedOptions().map(e=>e.getLabel());return e.length>0?e.join(`, `):this.placeholder}return this.options.find(e=>e.value===this.value)?.getLabel()||this.placeholder}getSelectedOptions(){return this.options.filter(e=>this.isSelected(e.value))}syncTriggerDecorations(){let e=this.triggerStartElement;if(!e||this.multiple)return;e.replaceChildren(),e.classList.remove(`has-decoration`);let t=this.options.find(e=>e.value===this.value);if(t){for(let n of t.getStartElements())e.append(n.cloneNode(!0));e.classList.toggle(`has-decoration`,e.childElementCount>0)}}hasSelection(){return this.multiple?this.values.length>0:this.options.some(e=>e.value===this.value)||!!this.value}syncHighlightedIndexToSelection(){if(this.multiple)return;let e=this.getEnabledVisibleOptions();if(e.length===0)return;let t=e.findIndex(e=>e.value===this.value);t>=0&&(this.highlightedIndex=t)}syncHighlight(){let e=this.getEnabledVisibleOptions();for(let e of this.options)e.highlighted=!1,e.focusIndex=-1;if(e.length===0){this.highlightedIndex=0;return}this.highlightedIndex>=e.length&&(this.highlightedIndex=0);let t=e[this.highlightedIndex];t&&this.panelElement&&(t.highlighted=!0,t.focusIndex=0,Dp(t,this.panelElement,`vertical`,`auto`))}updateTypeToSelect(){this.typeToSelect=$p(this.getEnabledVisibleOptions(),e=>{this.highlightedIndex=e,this.syncHighlight(),this.getEnabledVisibleOptions()[e]?.focusControl()})}getPopupAnchor(){return this.controlElement??null}getActiveDescendantId(){return this.getEnabledVisibleOptions()[this.highlightedIndex]?.optionId||null}async show(){this.open||this.closing||this.disabled||await this.openPanel()}async hide(e=`api`){!this.open||this.closing||await this.closePanel(e)}openPanel(){let e=this.getPopupAnchor();if(!e||this.closing)return Promise.resolve();this.dispatchEvent(new kp),this.closing=!1,this.panelAnimated=!1,this.open=!0,this.popupElement.active=!0,this.applySelection(),this.syncHighlightedIndexToSelection(),this.panelElement&&(this.panelElement.hidden=!1,Fp(this.panelElement,this.placement));let t=e.getBoundingClientRect().width;return this.style.setProperty(`--pk-select-anchor-width`,`${t}px`),this.registerDismissHandlers(),this.syncHighlight(),this.updateTypeToSelect(),this.updateComplete.then(async()=>{let e=await Ip(this.popupElement,this.placement,300,{requireEvent:!0});this.panelElement&&Fp(this.panelElement,e),this.panelAnimated=!0,this.bindPanelEvents(),this.refreshOptions(),this.getEnabledVisibleOptions()[this.highlightedIndex]?.focusControl(),this.dispatchEvent(new Ap),this.dispatchEvent(new CustomEvent(`pk-open-change`,{detail:{open:!0},bubbles:!0,composed:!0}))})}async closePanel(e=`unknown`){if(!this.open||this.closing)return;let t=new jp(e);this.dispatchEvent(t)&&(this.typeToSelect.reset(),this.unbindPanelEvents(),this.unregisterDismissHandlers(),this.closing=!0,this.panelAnimated=!1,await this.waitForExitAnimation(),this.open=!1,this.closing=!1,this.panelAnimated=!1,this.panelElement&&(this.panelElement.hidden=!0,this.panelElement.removeAttribute(`data-side`)),this.popupElement.active=!1,this.dispatchEvent(new Mp),this.dispatchEvent(new CustomEvent(`pk-open-change`,{detail:{open:!1},bubbles:!0,composed:!0})),this.shouldReturnFocusToTrigger(e)?this.triggerButton?.focus({preventScroll:!0}):this.triggerButton?.blur())}waitForExitAnimation(){let e=this.panelElement;return e?new Promise(t=>{let n=!1,r=()=>{n||(n=!0,e.removeEventListener(`animationend`,i),window.clearTimeout(a),e.classList.remove(`closing`),t())},i=t=>{t.target===e&&t.animationName.startsWith(`pk-popup-content-out`)&&r()};e.classList.add(`closing`),e.addEventListener(`animationend`,i);let a=window.setTimeout(r,150)}):Promise.resolve()}shouldReturnFocusToTrigger(e){return e!==`light-dismiss`&&e!==`pointer-dismiss`}registerDismissHandlers(){Cp(this),this.dismissRegistered=!0,document.addEventListener(`pointerdown`,this.onDocumentPointerDown,!0),document.addEventListener(`keydown`,this.onDocumentKeyDown,!0)}unregisterDismissHandlers(){this.dismissRegistered&&=(wp(this),!1),document.removeEventListener(`pointerdown`,this.onDocumentPointerDown,!0),document.removeEventListener(`keydown`,this.onDocumentKeyDown,!0)}isPointerInside(e){return im(e,{anchor:this.getPopupAnchor(),panel:this.panelElement})}removeTag(e,t){t.preventDefault(),t.stopPropagation(),this.values=this.values.filter(t=>t!==e),this.applySelection(),this.emitValueChange()}handleClear(e){e.preventDefault(),e.stopPropagation(),this.multiple?this.values=[]:this.value=``,this.applySelection(),this.dispatchEvent(new Op),this.emitValueChange(),this.triggerButton?.focus()}emitValueChange(){this.dispatchEvent(new CustomEvent(`pk-change`,{detail:{value:this.multiple?[...this.values]:this.value},bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`input`,{bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0}))}onListboxKeyDown(e){let t=this.getEnabledVisibleOptions();this.highlightedIndex=Qp(e,{items:t,currentIndex:this.highlightedIndex,multiselect:this.multiple,loop:this.loopFocus,onSelect:e=>{this.highlightedIndex=e,this.syncHighlight()},focusItem:e=>{t[e]?.focusControl()},onClose:()=>{this.closePanel(`escape`)}}),e.key.length===1&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&this.typeToSelect.handleKey(e)}renderTags(){return this.getSelectedOptions().map(e=>T`
            <span class="tag" part="tag">
                <span class="tag-label">${e.getLabel()}</span>
                <button
                    type="button"
                    class="tag-remove"
                    part="tag-remove"
                    aria-label=${`Remove ${e.getLabel()}`}
                    @click=${t=>this.removeTag(e.value,t)}
                >
                    ×
                </button>
            </span>
        `)}renderChevronIcon(){return T`
            <span class="icon" aria-hidden="true">${Be(vm)}</span>
        `}renderHostDecorationSlot(e){return this.hasSlotController.test(e)?T`
            <span part=${e} class=${e===`start`?`control-start`:`control-end`}>
                <slot name=${e}></slot>
            </span>
        `:T`<slot name=${e} hidden></slot>`}render(){let e=this.getDisplayValue(),t=!this.hasSelection(),n=(this.clearable||this.withClear)&&this.hasSelection()&&!this.disabled;return T`
            <input
                class="value-input"
                part="value-input"
                tabindex="-1"
                aria-hidden="true"
                .value=${this.multiple?this.values.join(`,`):this.value}
                ?required=${this.required}
                @input=${()=>this.updateValidity()}
            />
            ${this.multiple?T`
                    <div
                        part="control"
                        class=${Yf({control:!0,"is-disabled":this.disabled})}
                    >
                        ${this.renderHostDecorationSlot(`start`)}
                        ${this.hasSelection()?T`
                                <div class="tags" part="tags">${this.renderTags()}</div>
                                ${n?T`
                                        <button
                                            type="button"
                                            class="clear-button"
                                            part="clear-button"
                                            aria-label="Clear selection"
                                            @click=${this.handleClear}
                                        >
                                            ×
                                        </button>
                                    `:S}
                            `:T`
                                <button
                                    part="trigger"
                                    type="button"
                                    class="trigger"
                                    id=${this.triggerId}
                                    ?disabled=${this.disabled}
                                    aria-label=${this.ariaLabel??S}
                                    aria-haspopup="listbox"
                                    aria-expanded=${this.open?`true`:`false`}
                                    aria-controls=${this.listboxId}
                                    @click=${this.togglePanel}
                                >
                                    <span class="value is-placeholder">${this.placeholder}</span>
                                </button>
                            `}
                        ${this.renderHostDecorationSlot(`end`)}
                        <button
                            type="button"
                            class="trigger trigger--icon"
                            part="trigger expand-button"
                            aria-label="Toggle options"
                            ?disabled=${this.disabled}
                            @click=${this.togglePanel}
                        >
                            ${this.renderChevronIcon()}
                        </button>
                    </div>
                `:T`
                    <button
                        part="control"
                        type="button"
                        class=${Yf({control:!0,"is-disabled":this.disabled})}
                        id=${this.triggerId}
                        ?disabled=${this.disabled}
                        aria-label=${this.ariaLabel??S}
                        aria-haspopup="listbox"
                        aria-expanded=${this.open?`true`:`false`}
                        aria-controls=${this.listboxId}
                        @click=${this.togglePanel}
                    >
                        ${this.renderHostDecorationSlot(`start`)}
                        <span part="trigger-start" class="trigger-start"></span>
                        <span
                            class=${Yf({value:!0,"is-placeholder":t})}
                        >${e}</span>
                        ${n?T`
                                <span
                                    class="clear-button"
                                    part="clear-button"
                                    role="button"
                                    tabindex="-1"
                                    aria-label="Clear selection"
                                    @click=${this.handleClear}
                                >
                                    ×
                                </span>
                            `:S}
                        ${this.renderHostDecorationSlot(`end`)}
                        ${this.renderChevronIcon()}
                    </button>
                `}
            <pk-popup
                .anchor=${this.getPopupAnchor()??``}
                .placement=${this.placement}
                .distance=${this.sideOffset}
                .sync=${`width`}
                flip
                shift
            >
                <div
                    part="panel"
                    class=${Yf({panel:!0,"pk-popup-content":!0,closing:this.closing})}
                    id=${this.listboxId}
                    role="listbox"
                    aria-multiselectable=${this.multiple?`true`:`false`}
                    tabindex="-1"
                    ?hidden=${!this.open&&!this.closing}
                    data-open=${this.panelAnimated&&!this.closing?``:S}
                    @slotchange=${this.syncOptions}
                >
                    <slot></slot>
                </div>
            </pk-popup>
        `}};C([x({type:Boolean,reflect:!0})],Q.prototype,`open`,void 0),C([x({type:Boolean,reflect:!0})],Q.prototype,`multiple`,void 0),C([x({reflect:!0})],Q.prototype,`placement`,void 0),C([x({attribute:`side-offset`,type:Number})],Q.prototype,`sideOffset`,void 0),C([x({type:Boolean,reflect:!0})],Q.prototype,`clearable`,void 0),C([x({attribute:`with-clear`,type:Boolean})],Q.prototype,`withClear`,void 0),C([x({type:Boolean,reflect:!0})],Q.prototype,`invalid`,void 0),C([x({reflect:!0})],Q.prototype,`size`,void 0),C([x({reflect:!0})],Q.prototype,`width`,void 0),C([x()],Q.prototype,`placeholder`,void 0),C([x()],Q.prototype,`value`,void 0),C([x({attribute:`default-value`})],Q.prototype,`defaultValue`,void 0),C([x({type:Array,attribute:!1})],Q.prototype,`values`,void 0),C([x({attribute:!1})],Q.prototype,`defaultValues`,void 0),C([x({attribute:`aria-label`})],Q.prototype,`ariaLabel`,void 0),C([x({attribute:`loop-focus`,type:Boolean})],Q.prototype,`loopFocus`,void 0),C([Ft(`.trigger-start`)],Q.prototype,`triggerStartElement`,void 0),C([Ft(`pk-popup`)],Q.prototype,`popupElement`,void 0),C([Ft(`.control`)],Q.prototype,`controlElement`,void 0),C([Ft(`button.control, .control > button.trigger`)],Q.prototype,`triggerButton`,void 0),C([Ft(`.value-input`)],Q.prototype,`input`,void 0),C([De()],Q.prototype,`highlightedIndex`,void 0),C([De()],Q.prototype,`closing`,void 0),C([De()],Q.prototype,`panelAnimated`,void 0),Q=C([pe(`pk-select`)],Q);var ym=w`
    @layer pk-component {
        :host {
            display: block;
        }

        /* Hard hex fallbacks: when groups portal outside pk-select, size-token
         * vars / theme tokens may be absent and invalid color inherits option black.
         * Weight/color match v1 ComboboxLabel / SelectLabel (text-slate-700, no font-medium). */
        .label {
            padding-block-start: var(--pk-select-group-label-padding-block-start, 8px);
            padding-block-end: var(--pk-select-group-label-padding-block-end, 2px);
            padding-inline: var(--pk-select-item-padding-inline, 10px);
            color: var(--pk-select-group-label-color, var(--pk-color-slate-700, rgba(96, 125, 159, 0.7)));
            font-family: var(--pk-font-family);
            /* Default matches v1 ComboboxLabel/SelectLabel text-xs (12px). */
            font-size: var(--pk-select-group-label-font-size, 12px);
            font-weight: 400;
            line-height: 1.3;
            /* Light-DOM ancestors (e.g. Formie empty dropzone text-center) must not center labels. */
            text-align: left;
            user-select: none;
            pointer-events: none;
        }

        :host([hidden]),
        :host([data-pk-filter-empty]) {
            display: none !important;
        }
    }
`,bm=class extends Ke{constructor(...e){super(...e),this.label=``,this.hidden=!1,this.labelId=bp(`pk-option-group-label`)}static{this.styles=ym}connectedCallback(){super.connectedCallback(),this.setAttribute(`role`,`group`),this.setAttribute(`aria-labelledby`,this.labelId)}render(){return T`
            <div part="label" class="label" id=${this.labelId}>${this.label}</div>
            <div role="presentation">
                <slot></slot>
            </div>
        `}};C([x({reflect:!0})],bm.prototype,`label`,void 0),C([x({type:Boolean,reflect:!0})],bm.prototype,`hidden`,void 0),bm=C([pe(`pk-option-group`)],bm);var xm=[w`
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
`,w`
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
    `],$=class extends Ke{constructor(...e){super(...e),this.placement=`top`,this.trigger=`hover focus`,this.disabled=!1,this.openDelay=0,this.closeDelay=0,this.content=``,this.for=``,this.open=!1,this.triggerElement=null,this.contentAnimated=!1,this.closing=!1,this.contentSide=null,this.hasSlottedBody=!1,this.triggerId=bp(`pk-tooltip-trigger`),this.tooltipId=bp(`pk-tooltip`),this.showGeneration=0,this.exitGeneration=0,this.syncPlacementAnimation=()=>{let e=this.popupElement?.getAttribute(`data-current-placement`)??this.placement,t=this.popupElement?.getContentElement();this.contentSide=e?Np(e):null,Fp(this.popupElement,e),t&&Fp(t,e)},this.onBodySlotChange=e=>{let t=e.target;this.hasSlottedBody=t.assignedNodes({flatten:!0}).some(e=>e.nodeType===Node.ELEMENT_NODE||e.nodeType===Node.TEXT_NODE&&!!e.textContent?.trim())},this.scheduleShow=()=>{this.usesPointerTrigger()&&(window.clearTimeout(this.closeTimer),window.clearTimeout(this.openTimer),this.openTimer=window.setTimeout(()=>this.showTooltip(),this.openDelay))},this.scheduleHide=()=>{this.usesPointerTrigger()&&(window.clearTimeout(this.openTimer),window.clearTimeout(this.closeTimer),this.closeTimer=window.setTimeout(()=>this.hideTooltip(),this.closeDelay))}}static{this.styles=xm}disconnectedCallback(){this.popupElement?.removeEventListener(`pk-reposition`,this.syncPlacementAnimation),this.clearTimers(),this.hideTooltip(!0),super.disconnectedCallback()}updated(e){super.updated(e),(e.has(`trigger`)||e.has(`disabled`)||e.has(`for`))&&this.rebindTrigger(),this.disabled&&this.open&&this.hideTooltip(!0)}firstUpdated(){this.popupElement.addEventListener(`pk-reposition`,this.syncPlacementAnimation),this.for&&queueMicrotask(()=>{this.resolveExternalTrigger()})}async show(){this.disabled||(this.clearTimers(),this.showTooltip(!0),await this.updateComplete)}async hide(){this.clearTimers(),this.hideTooltip(!0),await this.updateComplete}clearTimers(){window.clearTimeout(this.openTimer),window.clearTimeout(this.closeTimer)}resolveExternalTrigger(){this.triggerElement=Vp(this,this.for),this.rebindTrigger()}onTriggerSlotChange(e){let[t]=e.target.assignedElements({flatten:!0});this.unbindTrigger(this.triggerElement),this.triggerElement=t??null,this.rebindTrigger(),this.requestUpdate()}rebindTrigger(){this.unbindTrigger(this.triggerElement),this.for&&(this.triggerElement=Vp(this,this.for)),this.bindTrigger(this.triggerElement)}usesPointerTrigger(){return!this.disabled&&this.trigger!==`manual`}bindTrigger(e){!e||!this.usesPointerTrigger()||(e.id||=this.triggerId,e.setAttribute(`aria-describedby`,this.tooltipId),e.addEventListener(`mouseenter`,this.scheduleShow),e.addEventListener(`mouseleave`,this.scheduleHide),e.addEventListener(`focus`,this.scheduleShow),e.addEventListener(`blur`,this.scheduleHide))}unbindTrigger(e){e&&(e.removeAttribute(`aria-describedby`),e.removeEventListener(`mouseenter`,this.scheduleShow),e.removeEventListener(`mouseleave`,this.scheduleHide),e.removeEventListener(`focus`,this.scheduleShow),e.removeEventListener(`blur`,this.scheduleHide))}getAnchor(){return this.for?Vp(this,this.for):this.triggerElement?this.triggerElement:null}prepareContentForEnter(e){e&&(e.classList.remove(`closing`),e.style.animation=`none`,e.getBoundingClientRect(),e.style.removeProperty(`animation`),e.style.removeProperty(`opacity`),e.style.removeProperty(`transform`))}showTooltip(e=!1){if(!this.getAnchor()||this.open&&this.contentAnimated&&!this.closing&&!e)return;this.open||this.dispatchEvent(new kp);let t=++this.showGeneration;this.exitGeneration+=1,this.closing=!1,this.open=!0,this.contentAnimated=!1,this.prepareContentForEnter(this.popupElement?.getContentElement()),this.updateComplete.then(async()=>{t===this.showGeneration&&(await Ip(this.popupElement,this.placement),t===this.showGeneration&&(this.syncPlacementAnimation(),this.prepareContentForEnter(this.popupElement?.getContentElement()),this.contentAnimated=!0,this.dispatchEvent(new Ap),this.dispatchEvent(new CustomEvent(`pk-open-change`,{detail:{open:!0},bubbles:!0,composed:!0}))))})}hideTooltip(e=!1,t=!1){if(!(!this.open&&!this.closing&&!e)&&!(this.closing&&!e)){if(t){let e=new jp(`api`);if(!this.dispatchEvent(e))return}if(this.showGeneration+=1,e){this.finishHide();return}if(!this.contentAnimated){this.finishHide();return}this.playExitAnimation()}}async playExitAnimation(){if(!this.open)return;let e=this.exitGeneration+1;this.exitGeneration=e;let t=this.popupElement?.getContentElement();this.closing=!0,this.contentAnimated=!1,t&&await this.waitForExitAnimation(t),e===this.exitGeneration&&this.finishHide()}waitForExitAnimation(e){return new Promise(t=>{let n=!1,r=()=>{n||(n=!0,e.removeEventListener(`animationend`,i),window.clearTimeout(a),e.classList.remove(`closing`),t())},i=t=>{t.target===e&&t.animationName.startsWith(`pk-tooltip-out`)&&r()};e.classList.add(`closing`),e.addEventListener(`animationend`,i);let a=window.setTimeout(r,200)})}finishHide(){let e=this.popupElement?.getContentElement();this.closing=!1,this.contentAnimated=!1,this.contentSide=null,this.open=!1,this.popupElement?.removeAttribute(`data-side`),this.prepareContentForEnter(e),this.dispatchEvent(new Mp),this.dispatchEvent(new CustomEvent(`pk-open-change`,{detail:{open:!1},bubbles:!0,composed:!0}))}render(){let e=this.getAnchor();return T`
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
                    class=${Yf({content:!0,"pk-popup-content":!0,closing:this.closing})}
                    id=${this.tooltipId}
                    role="tooltip"
                    ?hidden=${!this.open&&!this.closing}
                    data-open=${this.contentAnimated&&!this.closing?``:S}
                    data-side=${this.contentSide??S}
                >
                    <slot @slotchange=${this.onBodySlotChange}></slot>
                    ${this.hasSlottedBody?S:this.content||S}
                </div>
            </pk-popup>
        `}};C([x({reflect:!0})],$.prototype,`placement`,void 0),C([x({reflect:!0})],$.prototype,`trigger`,void 0),C([x({type:Boolean,reflect:!0})],$.prototype,`disabled`,void 0),C([x({type:Number,attribute:`open-delay`})],$.prototype,`openDelay`,void 0),C([x({type:Number,attribute:`close-delay`})],$.prototype,`closeDelay`,void 0),C([x()],$.prototype,`content`,void 0),C([x({reflect:!0})],$.prototype,`for`,void 0),C([Ft(`pk-popup`)],$.prototype,`popupElement`,void 0),C([De()],$.prototype,`open`,void 0),C([De()],$.prototype,`contentAnimated`,void 0),C([De()],$.prototype,`closing`,void 0),C([De()],$.prototype,`contentSide`,void 0),C([De()],$.prototype,`hasSlottedBody`,void 0),$=C([pe(`pk-tooltip`)],$);export{Wf as A,vp as C,Qf as D,lp as E,du as F,To as I,Jt as L,rf as M,jd as N,Yf as O,dd as P,Kt as R,bp as S,gp as T,Dp as _,qp as a,wp as b,tm as c,Ip as d,Mp as f,Op as g,kp as h,im as i,Lf as j,Kf as k,Vp as l,jp as m,am as n,Qp as o,Ap as p,rm as r,Jp as s,om as t,Fp as u,Tp as v,_p as w,xp as x,Cp as y,Ft as z};
//# sourceMappingURL=tooltip-BRQU7O4B.js.map