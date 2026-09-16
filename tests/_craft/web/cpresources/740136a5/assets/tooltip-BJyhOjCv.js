import{S as e,T as t,_ as n,a as r,b as i,c as a,d as o,g as s,h as c,i as l,l as u,m as d,n as f,o as p,p as m,r as h,s as g,t as _,u as v,v as y,w as b,x as ee,y as te}from"./floating-ui.dom-BGxPGImR.js";var ne=Object.defineProperty,re=(e,t)=>{let n={};for(var r in e)ne(n,r,{get:e[r],enumerable:!0});return t||ne(n,Symbol.toStringTag,{value:`Module`}),n},ie=(e,t,n)=>(n.configurable=!0,n.enumerable=!0,Reflect.decorate&&typeof t!=`object`&&Object.defineProperty(e,t,n),n);function ae(e,t){return(n,r,i)=>{let a=t=>t.renderRoot?.querySelector(e)??null;if(t){let{get:e,set:t}=typeof r==`object`?n:i??(()=>{let e=Symbol();return{get(){return this[e]},set(t){this[e]=t}}})();return ie(n,r,{get(){let n=e.call(this);return n===void 0&&(n=a(this),(n!==null||this.hasUpdated)&&t.call(this,n)),n}})}return ie(n,r,{get(){return a(this)}})}}var oe=Symbol.for(`preact-signals`);function se(){if(de>1)de--;else{var e,t=!1;for((function(){var e=he;for(he=void 0;e!==void 0;){var t=e.S;if(t.v===e.v)for(var n=t.t;n!==void 0;n=n.x)n.i===e.i&&(n.i=t.i);e=e.o}})();ue!==void 0;){var n=ue;for(ue=void 0,fe++;n!==void 0;){var r=n.u;if(n.u=void 0,n.f&=-3,!(8&n.f)&&w(n))try{n.c()}catch(n){t||=(e=n,!0)}n=r}}if(fe=0,de--,t)throw e}}function ce(e){if(de>0)return e();me=++pe,de++;try{return e()}finally{se()}}var le,x=void 0;function S(e){var t=x,n=le;x=void 0,le=void 0;try{return e()}finally{x=t,le=n}}var ue=void 0,de=0,fe=0,pe=0,me=0,he=void 0,ge=0;function _e(e){if(x!==void 0){var t=e.n;if(t===void 0||t.t!==x)return t={i:0,S:e,p:x.s,n:void 0,t:x,e:void 0,x:void 0,r:t},x.s!==void 0&&(x.s.n=t),x.s=t,e.n=t,32&x.f&&e.S(t),t;if(t.i===-1)return t.i=0,t.n!==void 0&&(t.n.p=t.p,t.p!==void 0&&(t.p.n=t.n),t.p=x.s,t.n=void 0,x.s.n=t,x.s=t),t}}function C(e,t){this.v=e,this.i=0,this.n=void 0,this.t=void 0,this.l=0,this.W=t?.watched,this.Z=t?.unwatched,this.name=t?.name}C.prototype.brand=oe,C.prototype.h=function(){return!0},C.prototype.S=function(e){var t=this,n=this.t;n!==e&&e.e===void 0&&(e.x=n,this.t=e,n===void 0?S(function(){var e;(e=t.W)==null||e.call(t)}):n.e=e)},C.prototype.U=function(e){var t=this;if(this.t!==void 0){var n=e.e,r=e.x;n!==void 0&&(n.x=r,e.e=void 0),r!==void 0&&(r.e=n,e.x=void 0),e===this.t&&(this.t=r,r===void 0&&S(function(){var e;(e=t.Z)==null||e.call(t)}))}},C.prototype.subscribe=function(e){var t=this;return T(function(){var n=t.value;S(function(){return e(n)})},{name:`sub`})},C.prototype.valueOf=function(){return this.value},C.prototype.toString=function(){return this.value+``},C.prototype.toJSON=function(){return this.value},C.prototype.peek=function(){var e=this;return S(function(){return e.value})},Object.defineProperty(C.prototype,"value",{get:function(){var e=_e(this);return e!==void 0&&(e.i=this.i),this.v},set:function(e){if(e!==this.v){if(fe>100)throw Error(`Cycle detected`);(function(e){de!==0&&fe===0&&e.l!==me&&(e.l=me,he={S:e,v:e.v,i:e.i,o:he})})(this),this.v=e,this.i++,ge++,de++;try{for(var t=this.t;t!==void 0;t=t.x)t.t.N()}finally{se()}}}});function ve(e,t){return new C(e,t)}function w(e){for(var t=e.s;t!==void 0;t=t.n)if(t.S.i!==t.i||!t.S.h()||t.S.i!==t.i)return!0;return!1}function ye(e){for(var t=e.s;t!==void 0;t=t.n){var n=t.S.n;if(n!==void 0&&(t.r=n),t.S.n=t,t.i=-1,t.n===void 0){e.s=t;break}}}function be(e){for(var t=e.s,n=void 0;t!==void 0;){var r=t.p;t.i===-1?(t.S.U(t),r!==void 0&&(r.n=t.n),t.n!==void 0&&(t.n.p=r)):n=t,t.S.n=t.r,t.r!==void 0&&(t.r=void 0),t=r}e.s=n}function xe(e,t){C.call(this,void 0,t),this.x=e,this.s=void 0,this.g=ge-1,this.f=4}xe.prototype=new C,xe.prototype.h=function(){if(this.f&=-3,1&this.f)return!1;if((36&this.f)==32||(this.f&=-5,this.g===ge))return!0;if(this.g=ge,this.f|=1,this.i>0&&!w(this))return this.f&=-2,!0;var e=x;try{ye(this),x=this;var t=this.x();(16&this.f||this.v!==t||this.i===0)&&(this.v=t,this.f&=-17,this.i++)}catch(e){this.v=e,this.f|=16,this.i++}return x=e,be(this),this.f&=-2,!0},xe.prototype.S=function(e){if(this.t===void 0){this.f|=36;for(var t=this.s;t!==void 0;t=t.n)t.S.S(t)}C.prototype.S.call(this,e)},xe.prototype.U=function(e){if(this.t!==void 0&&(C.prototype.U.call(this,e),this.t===void 0)){this.f&=-33;for(var t=this.s;t!==void 0;t=t.n)t.S.U(t)}},xe.prototype.N=function(){if(!(2&this.f)){this.f|=6;for(var e=this.t;e!==void 0;e=e.x)e.t.N()}},Object.defineProperty(xe.prototype,"value",{get:function(){if(1&this.f)throw Error(`Cycle detected`);var e=_e(this);if(this.h(),e!==void 0&&(e.i=this.i),16&this.f)throw this.v;return this.v}});function Se(e,t){return new xe(e,t)}function Ce(e){var t=e.m;if(e.m=void 0,typeof t==`function`){de++;var n=x;x=void 0;try{t()}catch(t){throw e.f&=-2,e.f|=8,we(e),t}finally{x=n,se()}}}function we(e){for(var t=e.s;t!==void 0;t=t.n)t.S.U(t);e.x=void 0,e.s=void 0,Ce(e)}function Te(e){if(x!==this)throw Error(`Out-of-order effect`);be(this),x=e,this.f&=-2,8&this.f&&we(this),se()}function Ee(e,t){this.x=e,this.m=void 0,this.s=void 0,this.u=void 0,this.f=32,this.name=t?.name,le&&le.push(this)}Ee.prototype.c=function(){var e=this.S();try{if(8&this.f||this.x===void 0)return;var t=this.x();typeof t==`function`&&(this.m=t)}finally{e()}},Ee.prototype.S=function(){if(1&this.f)throw Error(`Cycle detected`);this.f|=1,this.f&=-9,Ce(this),ye(this),de++;var e=x;return x=this,Te.bind(this,e)},Ee.prototype.N=function(){2&this.f||(this.f|=2,this.u=ue,ue=this)},Ee.prototype.d=function(){this.f|=8,1&this.f||we(this)},Ee.prototype.dispose=function(){this.d()};function T(e,t){var n=new Ee(e,t);try{n.c()}catch(e){throw n.d(),e}var r=n.d.bind(n);return r[Symbol.dispose]=r,r}var De=Object.create,Oe=Object.defineProperty,ke=Object.defineProperties,Ae=Object.getOwnPropertyDescriptor,je=Object.getOwnPropertyDescriptors,Me=Object.getOwnPropertySymbols,Ne=Object.prototype.hasOwnProperty,Pe=Object.prototype.propertyIsEnumerable,Fe=(e,t)=>(t=Symbol[e])?t:Symbol.for(`Symbol.`+e),Ie=e=>{throw TypeError(e)},Le=(e,t,n)=>t in e?Oe(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,Re=(e,t)=>{for(var n in t||={})Ne.call(t,n)&&Le(e,n,t[n]);if(Me)for(var n of Me(t))Pe.call(t,n)&&Le(e,n,t[n]);return e},ze=(e,t)=>ke(e,je(t)),Be=(e,t)=>Oe(e,`name`,{value:t,configurable:!0}),Ve=e=>[,,,De(e?.[Fe(`metadata`)]??null)],He=[`class`,`method`,`getter`,`setter`,`accessor`,`field`,`value`,`get`,`set`],Ue=e=>e!==void 0&&typeof e!=`function`?Ie(`Function expected`):e,We=(e,t,n,r,i)=>({kind:He[e],name:t,metadata:r,addInitializer:e=>n._?Ie(`Already initialized`):i.push(Ue(e||null))}),Ge=(e,t)=>Le(t,Fe(`metadata`),e[3]),Ke=(e,t,n,r)=>{for(var i=0,a=e[t>>1],o=a&&a.length;i<o;i++)t&1?a[i].call(n):r=a[i].call(n,r);return r},qe=(e,t,n,r,i,a)=>{var o,s,c,l,u,d=t&7,f=!!(t&8),p=!!(t&16),m=d>3?e.length+1:d?f?1:2:0,h=He[d+5],g=d>3&&(e[m-1]=[]),_=e[m]||(e[m]=[]),v=d&&(!p&&!f&&(i=i.prototype),d<5&&(d>3||!p)&&Ae(d<4?i:{get[n](){return Xe(this,a)},set[n](e){return Qe(this,a,e)}},n));d?p&&d<4&&Be(a,(d>2?`set `:d>1?`get `:``)+n):Be(i,n);for(var y=r.length-1;y>=0;y--)l=We(d,n,c={},e[3],_),d&&(l.static=f,l.private=p,u=l.access={has:p?e=>Ye(i,e):e=>n in e},d^3&&(u.get=p?e=>(d^1?Xe:$e)(e,i,d^4?a:v.get):e=>e[n]),d>2&&(u.set=p?(e,t)=>Qe(e,i,t,d^4?a:v.set):(e,t)=>e[n]=t)),s=(0,r[y])(d?d<4?p?a:v[h]:d>4?void 0:{get:v.get,set:v.set}:i,l),c._=1,d^4||s===void 0?Ue(s)&&(d>4?g.unshift(s):d?p?a=s:v[h]=s:i=s):typeof s!=`object`||!s?Ie(`Object expected`):(Ue(o=s.get)&&(v.get=o),Ue(o=s.set)&&(v.set=o),Ue(o=s.init)&&g.unshift(o));return d||Ge(e,i),v&&Oe(i,n,v),p?d^4?a:v:i},Je=(e,t,n)=>t.has(e)||Ie(`Cannot `+n),Ye=(e,t)=>Object(t)===t?e.has(t):Ie(`Cannot use the "in" operator on this value`),Xe=(e,t,n)=>(Je(e,t,`read from private field`),n?n.call(e):t.get(e)),Ze=(e,t,n)=>t.has(e)?Ie(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),Qe=(e,t,n,r)=>(Je(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),$e=(e,t,n)=>(Je(e,t,`access private method`),n);function et(e,t){if(t){let n;return Se(()=>{let r=e();return r&&n&&t(n,r)?n:(n=r,r)})}return Se(e)}function tt(e,t){if(Object.is(e,t))return!0;if(e===null||t===null)return!1;if(typeof e==`function`&&typeof t==`function`)return e===t;if(e instanceof Set&&t instanceof Set){if(e.size!==t.size)return!1;for(let n of e)if(!t.has(n))return!1;return!0}if(Array.isArray(e))return!Array.isArray(t)||e.length!==t.length?!1:!e.some((e,n)=>!tt(e,t[n]));if(typeof e==`object`&&typeof t==`object`){let n=Object.keys(e),r=Object.keys(t);return n.length===r.length&&!n.some(n=>!tt(e[n],t[n]))}return!1}function E({get:e},t){return{init(e){return ve(e)},get(){return e.call(this).value},set(t){let n=e.call(this);n.peek()!==t&&(n.value=t)}}}function D(e,t){let n=new WeakMap;return function(){let t=n.get(this);return t||(t=et(e.bind(this)),n.set(this,t)),t.value}}function nt(e=!0){return function(t,n){n.addInitializer(function(){let t=n.kind===`field`||n.static?this:Object.getPrototypeOf(this),r=Object.getOwnPropertyDescriptor(t,n.name);r&&Object.defineProperty(t,n.name,ze(Re({},r),{enumerable:e}))})}}function rt(...e){let t=e.map(e=>T(e));return()=>t.forEach(e=>e())}var it,at,ot,st,ct,lt=[E],O,ut,dt,ft,pt,k,mt,ht,gt,_t,vt,yt,bt,xt;ct=[E],st=[E],ot=[nt()],at=[nt()],it=[nt()];var St=class{constructor(e,t=Object.is){this.defaultValue=e,this.equals=t,Ke(O,5,this),Ze(this,k),Ze(this,ut,Ke(O,8,this)),Ke(O,11,this),Ze(this,mt,Ke(O,12,this)),Ke(O,15,this),Ze(this,vt,Ke(O,16,this)),Ke(O,19,this),this.reset=this.reset.bind(this),this.reset()}get current(){return Xe(this,k,bt)}get initial(){return Xe(this,k,ft)}get previous(){return Xe(this,k,gt)}set current(e){let t=S(()=>Xe(this,k,bt));e&&t&&this.equals(t,e)||ce(()=>{Xe(this,k,ft)||Qe(this,k,e,pt),Qe(this,k,t,_t),Qe(this,k,e,xt)})}reset(e=this.defaultValue){ce(()=>{Qe(this,k,void 0,_t),Qe(this,k,e,pt),Qe(this,k,e,xt)})}};O=Ve(null),ut=new WeakMap,k=new WeakSet,mt=new WeakMap,vt=new WeakMap,dt=qe(O,20,`#initial`,lt,k,ut),ft=dt.get,pt=dt.set,ht=qe(O,20,`#previous`,ct,k,mt),gt=ht.get,_t=ht.set,yt=qe(O,20,`#current`,st,k,vt),bt=yt.get,xt=yt.set,qe(O,2,`current`,ot,St),qe(O,2,`initial`,at,St),qe(O,2,`previous`,it,St),Ge(O,St);function Ct(e){return S(()=>{let t={};for(let n in e)t[n]=e[n];return t})}var wt,Tt=class{constructor(){Ze(this,wt,new WeakMap)}get(e,t){return e?Xe(this,wt).get(e)?.get(t):void 0}set(e,t,n){if(e)return Xe(this,wt).has(e)||Xe(this,wt).set(e,new Map),Xe(this,wt).get(e)?.set(t,n)}clear(e){return e?Xe(this,wt).get(e)?.clear():void 0}};wt=new WeakMap;var Et=Object.create,Dt=Object.defineProperty,Ot=Object.getOwnPropertyDescriptor,kt=Object.getOwnPropertySymbols,At=Object.prototype.hasOwnProperty,jt=Object.prototype.propertyIsEnumerable,Mt=(e,t)=>(t=Symbol[e])?t:Symbol.for(`Symbol.`+e),Nt=e=>{throw TypeError(e)},Pt=Math.pow,Ft=(e,t,n)=>t in e?Dt(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,It=(e,t)=>{for(var n in t||={})At.call(t,n)&&Ft(e,n,t[n]);if(kt)for(var n of kt(t))jt.call(t,n)&&Ft(e,n,t[n]);return e},Lt=(e,t)=>Dt(e,`name`,{value:t,configurable:!0}),Rt=e=>[,,,Et(e?.[Mt(`metadata`)]??null)],zt=[`class`,`method`,`getter`,`setter`,`accessor`,`field`,`value`,`get`,`set`],Bt=e=>e!==void 0&&typeof e!=`function`?Nt(`Function expected`):e,Vt=(e,t,n,r,i)=>({kind:zt[e],name:t,metadata:r,addInitializer:e=>n._?Nt(`Already initialized`):i.push(Bt(e||null))}),Ht=(e,t)=>Ft(t,Mt(`metadata`),e[3]),Ut=(e,t,n,r)=>{for(var i=0,a=e[t>>1],o=a&&a.length;i<o;i++)t&1?a[i].call(n):r=a[i].call(n,r);return r},Wt=(e,t,n,r,i,a)=>{var o,s,c,l,u,d=t&7,f=!!(t&8),p=!!(t&16),m=d>3?e.length+1:d?f?1:2:0,h=zt[d+5],g=d>3&&(e[m-1]=[]),_=e[m]||(e[m]=[]),v=d&&(!p&&!f&&(i=i.prototype),d<5&&(d>3||!p)&&Ot(d<4?i:{get[n](){return qt(this,a)},set[n](e){return Yt(this,a,e)}},n));d?p&&d<4&&Lt(a,(d>2?`set `:d>1?`get `:``)+n):Lt(i,n);for(var y=r.length-1;y>=0;y--)l=Vt(d,n,c={},e[3],_),d&&(l.static=f,l.private=p,u=l.access={has:p?e=>Kt(i,e):e=>n in e},d^3&&(u.get=p?e=>(d^1?qt:Xt)(e,i,d^4?a:v.get):e=>e[n]),d>2&&(u.set=p?(e,t)=>Yt(e,i,t,d^4?a:v.set):(e,t)=>e[n]=t)),s=(0,r[y])(d?d<4?p?a:v[h]:d>4?void 0:{get:v.get,set:v.set}:i,l),c._=1,d^4||s===void 0?Bt(s)&&(d>4?g.unshift(s):d?p?a=s:v[h]=s:i=s):typeof s!=`object`||!s?Nt(`Object expected`):(Bt(o=s.get)&&(v.get=o),Bt(o=s.set)&&(v.set=o),Bt(o=s.init)&&g.unshift(o));return d||Ht(e,i),v&&Dt(i,n,v),p?d^4?a:v:i},Gt=(e,t,n)=>t.has(e)||Nt(`Cannot `+n),Kt=(e,t)=>Object(t)===t?e.has(t):Nt(`Cannot use the "in" operator on this value`),qt=(e,t,n)=>(Gt(e,t,`read from private field`),n?n.call(e):t.get(e)),Jt=(e,t,n)=>t.has(e)?Nt(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),Yt=(e,t,n,r)=>(Gt(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),Xt=(e,t,n)=>(Gt(e,t,`access private method`),n),A=class e{constructor(e,t){this.x=e,this.y=t}static delta(t,n){return new e(t.x-n.x,t.y-n.y)}static distance(e,t){return Math.hypot(e.x-t.x,e.y-t.y)}static equals(e,t){return e.x===t.x&&e.y===t.y}static from({x:t,y:n}){return new e(t,n)}},Zt=class e{constructor(e,t,n,r){this.left=e,this.top=t,this.width=n,this.height=r,this.scale={x:1,y:1}}get inverseScale(){return{x:1/this.scale.x,y:1/this.scale.y}}translate(t,n){let{top:r,left:i,width:a,height:o,scale:s}=this,c=new e(i+t,r+n,a,o);return c.scale=It({},s),c}get boundingRectangle(){let{width:e,height:t,left:n,top:r,right:i,bottom:a}=this;return{width:e,height:t,left:n,top:r,right:i,bottom:a}}get center(){let{left:e,top:t,right:n,bottom:r}=this;return new A((e+n)/2,(t+r)/2)}get area(){let{width:e,height:t}=this;return e*t}equals(t){if(!(t instanceof e))return!1;let{left:n,top:r,width:i,height:a}=this;return n===t.left&&r===t.top&&i===t.width&&a===t.height}containsPoint(e){let{top:t,left:n,bottom:r,right:i}=this;return t<=e.y&&e.y<=r&&n<=e.x&&e.x<=i}intersectionArea(t){return t instanceof e?Qt(this,t):0}intersectionRatio(e){let{area:t}=this,n=this.intersectionArea(e);return n/(e.area+t-n)}get bottom(){let{top:e,height:t}=this;return e+t}get right(){let{left:e,width:t}=this;return e+t}get aspectRatio(){let{width:e,height:t}=this;return e/t}get corners(){return[{x:this.left,y:this.top},{x:this.right,y:this.top},{x:this.left,y:this.bottom},{x:this.right,y:this.bottom}]}static from({top:t,left:n,width:r,height:i}){return new e(n,t,r,i)}static delta(e,t,n={x:`center`,y:`center`}){let r=(e,t)=>{let r=n[t],i=t===`x`?e.left:e.top,a=t===`x`?e.width:e.height;return r==`start`?i:r==`end`?i+a:i+a/2};return A.delta({x:r(e,`x`),y:r(e,`y`)},{x:r(t,`x`),y:r(t,`y`)})}static intersectionRatio(t,n){return e.from(t).intersectionRatio(e.from(n))}};function Qt(e,t){let n=Math.max(t.top,e.top),r=Math.max(t.left,e.left),i=Math.min(t.left+t.width,e.left+e.width),a=Math.min(t.top+t.height,e.top+e.height),o=i-r,s=a-n;return r<i&&n<a?o*s:0}var $t,en,tn,nn,rn,an=class extends (tn=St,en=[D],$t=[D],tn){constructor(e){let t=A.from(e);super(t,(e,t)=>A.equals(e,t)),Ut(rn,5,this),Jt(this,nn,0),this.velocity={x:0,y:0}}get delta(){return A.delta(this.current,this.initial)}get direction(){let{current:e,previous:t}=this;if(!t)return null;let n={x:e.x-t.x,y:e.y-t.y};return!n.x&&!n.y?null:Math.abs(n.x)>Math.abs(n.y)?n.x>0?`right`:`left`:n.y>0?`down`:`up`}get current(){return super.current}set current(e){let{current:t}=this,n=A.from(e),r={x:n.x-t.x,y:n.y-t.y},i=Date.now(),a=i-qt(this,nn),o=e=>Math.round(e/a*100);ce(()=>{Yt(this,nn,i),this.velocity={x:o(r.x),y:o(r.y)},super.current=n})}reset(e=this.defaultValue){super.reset(A.from(e)),this.velocity={x:0,y:0}}};rn=Rt(tn),nn=new WeakMap,Wt(rn,2,`delta`,en,an),Wt(rn,2,`direction`,$t,an),Ht(rn,an);function on({x:e,y:t},n){let r=Math.abs(e),i=Math.abs(t);return typeof n==`number`?Math.sqrt(Pt(r,2)+Pt(i,2))>n:`x`in n&&`y`in n?r>n.x&&i>n.y:`x`in n?r>n.x:`y`in n&&i>n.y}var sn=(e=>(e.Horizontal=`x`,e.Vertical=`y`,e))(sn||{}),cn=Object.values(sn),ln=Object.create,un=Object.defineProperty,dn=Object.defineProperties,fn=Object.getOwnPropertyDescriptor,pn=Object.getOwnPropertyDescriptors,mn=Object.getOwnPropertySymbols,hn=Object.prototype.hasOwnProperty,gn=Object.prototype.propertyIsEnumerable,_n=(e,t)=>(t=Symbol[e])?t:Symbol.for(`Symbol.`+e),vn=e=>{throw TypeError(e)},yn=(e,t,n)=>t in e?un(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,bn=(e,t)=>{for(var n in t||={})hn.call(t,n)&&yn(e,n,t[n]);if(mn)for(var n of mn(t))gn.call(t,n)&&yn(e,n,t[n]);return e},xn=(e,t)=>dn(e,pn(t)),Sn=(e,t)=>un(e,`name`,{value:t,configurable:!0}),Cn=(e,t)=>{var n={};for(var r in e)hn.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&mn)for(var r of mn(e))t.indexOf(r)<0&&gn.call(e,r)&&(n[r]=e[r]);return n},wn=e=>[,,,ln(e?.[_n(`metadata`)]??null)],Tn=[`class`,`method`,`getter`,`setter`,`accessor`,`field`,`value`,`get`,`set`],En=e=>e!==void 0&&typeof e!=`function`?vn(`Function expected`):e,Dn=(e,t,n,r,i)=>({kind:Tn[e],name:t,metadata:r,addInitializer:e=>n._?vn(`Already initialized`):i.push(En(e||null))}),On=(e,t)=>yn(t,_n(`metadata`),e[3]),j=(e,t,n,r)=>{for(var i=0,a=e[t>>1],o=a&&a.length;i<o;i++)t&1?a[i].call(n):r=a[i].call(n,r);return r},M=(e,t,n,r,i,a)=>{var o,s,c,l,u,d=t&7,f=!!(t&8),p=!!(t&16),m=d>3?e.length+1:d?f?1:2:0,h=Tn[d+5],g=d>3&&(e[m-1]=[]),_=e[m]||(e[m]=[]),v=d&&(!p&&!f&&(i=i.prototype),d<5&&(d>3||!p)&&fn(d<4?i:{get[n](){return N(this,a)},set[n](e){return F(this,a,e)}},n));d?p&&d<4&&Sn(a,(d>2?`set `:d>1?`get `:``)+n):Sn(i,n);for(var y=r.length-1;y>=0;y--)l=Dn(d,n,c={},e[3],_),d&&(l.static=f,l.private=p,u=l.access={has:p?e=>An(i,e):e=>n in e},d^3&&(u.get=p?e=>(d^1?N:jn)(e,i,d^4?a:v.get):e=>e[n]),d>2&&(u.set=p?(e,t)=>F(e,i,t,d^4?a:v.set):(e,t)=>e[n]=t)),s=(0,r[y])(d?d<4?p?a:v[h]:d>4?void 0:{get:v.get,set:v.set}:i,l),c._=1,d^4||s===void 0?En(s)&&(d>4?g.unshift(s):d?p?a=s:v[h]=s:i=s):typeof s!=`object`||!s?vn(`Object expected`):(En(o=s.get)&&(v.get=o),En(o=s.set)&&(v.set=o),En(o=s.init)&&g.unshift(o));return d||On(e,i),v&&un(i,n,v),p?d^4?a:v:i},kn=(e,t,n)=>t.has(e)||vn(`Cannot `+n),An=(e,t)=>Object(t)===t?e.has(t):vn(`Cannot use the "in" operator on this value`),N=(e,t,n)=>(kn(e,t,`read from private field`),n?n.call(e):t.get(e)),P=(e,t,n)=>t.has(e)?vn(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),F=(e,t,n,r)=>(kn(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),jn=(e,t,n)=>(kn(e,t,`access private method`),n);function Mn(e,t){return{plugin:e,options:t}}function Nn(e){return t=>Mn(e,t)}function Pn(e){return typeof e==`function`?{plugin:e,options:void 0}:e}var Fn=[E],In,Ln,Rn,I=class{constructor(e,t){this.manager=e,this.options=t,P(this,Ln,j(In,8,this,!1)),j(In,11,this),P(this,Rn,new Set)}enable(){this.disabled=!1}disable(){this.disabled=!0}isDisabled(){return S(()=>this.disabled)}configure(e){this.options=e}registerEffect(e){let t=T(e.bind(this));return N(this,Rn).add(t),t}destroy(){N(this,Rn).forEach(e=>e())}static configure(e){return Mn(this,e)}};In=wn(null),Ln=new WeakMap,Rn=new WeakMap,M(In,4,`disabled`,Fn,I,Ln),On(In,I);var zn=class extends I{},Bn,Vn=class{constructor(e){this.manager=e,this.instances=new Map,P(this,Bn,[])}get values(){return Array.from(this.instances.values())}set values(e){let t=e.map(Pn).reduce((e,t)=>{let n=e.find(({plugin:e})=>e===t.plugin);return n?(n.options=t.options,e):[...e,t]},[]),n=t.map(({plugin:e})=>e);for(let e of N(this,Bn))if(!n.includes(e)){if(e.prototype instanceof zn)continue;this.unregister(e)}for(let{plugin:e,options:n}of t)this.register(e,n);F(this,Bn,n)}get(e){return this.instances.get(e)}register(e,t){let n=this.instances.get(e);if(n)return n.options!==t&&(n.options=t),n;let r=new e(this.manager,t);return this.instances.set(e,r),r}unregister(e){let t=this.instances.get(e);t&&(t.destroy(),this.instances.delete(e))}destroy(){for(let e of this.instances.values())e.destroy();this.instances.clear()}};Bn=new WeakMap;function Hn(e,t){return e.priority===t.priority?e.type===t.type?t.value-e.value:t.type-e.type:t.priority-e.priority}var Un=[],Wn,Gn,Kn=class extends I{constructor(e){super(e),P(this,Wn),P(this,Gn),this.computeCollisions=this.computeCollisions.bind(this),F(this,Gn,ve(Un)),this.destroy=rt(()=>{let e=this.computeCollisions(),t=S(()=>this.manager.dragOperation.position.current);if(e!==Un){let e=N(this,Wn);if(F(this,Wn,t),e&&t.x==e.x&&t.y==e.y)return}else F(this,Wn,void 0);N(this,Gn).value=e},()=>{let{dragOperation:e}=this.manager;e.status.initialized&&this.forceUpdate()})}forceUpdate(e=!0){S(()=>{e?N(this,Gn).value=this.computeCollisions():F(this,Wn,void 0)})}computeCollisions(e,t){let{registry:n,dragOperation:r}=this.manager,{source:i,shape:a,status:o}=r;if(!o.initialized||!a)return Un;let s=[],c=[];for(let a of e??n.droppables){if(a.disabled||i&&!a.accepts(i))continue;let e=t??a.collisionDetector;if(!e)continue;c.push(a),a.shape;let n=S(()=>e({droppable:a,dragOperation:r}));n&&(a.collisionPriority!=null&&(n.priority=a.collisionPriority),s.push(n))}return c.length===0?Un:(s.sort(Hn),s)}get collisions(){return N(this,Gn).value}};Wn=new WeakMap,Gn=new WeakMap;var qn,Jn,Yn=[E],Xn,Zn,Qn,$n,er,tr,nr;Jn=[E],qn=[E];var rr=class e{constructor(e,t){P(this,$n,j(Qn,8,this)),j(Qn,11,this),P(this,er),P(this,tr,j(Qn,12,this)),j(Qn,15,this),P(this,nr,j(Qn,16,this)),j(Qn,19,this);let{effects:n,id:r,data:i={},disabled:a=!1,register:o=!0}=e,s=r;F(this,er,ve(r)),this.manager=t,this.data=i,this.disabled=a,this.effects=()=>[()=>{let{id:e,manager:t}=this;if(e!==s)return s=e,t?.registry.register(this),()=>t?.registry.unregister(this)},...n?.()??[]],this.register=this.register.bind(this),this.unregister=this.unregister.bind(this),this.destroy=this.destroy.bind(this),t&&o&&queueMicrotask(this.register)}get id(){let t=N(this,er).value;return e.pendingIdChanges?.get(this)??t}set id(t){t!==(e.pendingIdChanges?.get(this)??N(this,er).peek())&&(e.pendingIdChanges||(e.pendingIdChanges=new Map,queueMicrotask(()=>{var t;return jn(t=e,Xn,Zn).call(t)})),e.pendingIdChanges.set(this,t))}register(){return this.manager?.registry.register(this)}unregister(){var e;(e=this.manager)==null||e.registry.unregister(this)}destroy(){var e;(e=this.manager)==null||e.registry.unregister(this)}};Qn=wn(null),Xn=new WeakSet,Zn=function(){let e=rr.pendingIdChanges;rr.pendingIdChanges=null,e&&ce(()=>{for(let[t,n]of e)N(t,er).value=n})},$n=new WeakMap,er=new WeakMap,tr=new WeakMap,nr=new WeakMap,M(Qn,4,`manager`,Yn,rr,$n),M(Qn,4,`data`,Jn,rr,tr),M(Qn,4,`disabled`,qn,rr,nr),P(rr,Xn),On(Qn,rr),rr.pendingIdChanges=null;var ir=rr,ar=class{constructor(){this.map=ve(new Map),this.cleanupFunctions=new WeakMap,this.register=(e,t)=>{let n=this.map.peek(),r=n.get(e),i=()=>this.unregister(e,t);if(r===t)return i;r&&r.id===e&&(this.cleanupFunctions.get(r)?.(),this.cleanupFunctions.delete(r));let a=new Map(n);for(let[r,i]of n)if(i===t&&r!==e){a.delete(r);break}a.set(e,t),this.map.value=a;let o=rt(...t.effects());return this.cleanupFunctions.set(t,o),i},this.unregister=(e,t)=>{let n=this.map.peek();if(n.get(e)!==t)return;this.cleanupFunctions.get(t)?.(),this.cleanupFunctions.delete(t);let r=new Map(n);r.delete(e),this.map.value=r}}[Symbol.iterator](){return this.map.peek().values()}get value(){return this.map.value.values()}has(e){return this.map.value.has(e)}get(e){return this.map.value.get(e)}destroy(){for(let e of this)this.cleanupFunctions.get(e)?.(),e.destroy();this.map.value=new Map}},or,sr,cr,lr,ur,dr,fr,L,pr,mr,hr,gr=class extends (fr=ir,dr=[E],ur=[E],lr=[E],cr=[D],sr=[D],or=[D],fr){constructor(e,t){var n=e,{modifiers:r,type:i,sensors:a,plugins:o,effects:s}=n,c=Cn(n,[`modifiers`,`type`,`sensors`,`plugins`,`effects`]);super(xn(bn({},c),{effects:()=>[...s?.()??[],()=>{let{manager:e,plugins:t}=this;if(!(!e||!t))for(let n of t){let{plugin:t}=Pn(n);e.registry.plugins.register(t)}}]}),t),j(L,5,this),P(this,pr,j(L,8,this)),j(L,11,this),P(this,mr,j(L,12,this)),j(L,15,this),P(this,hr,j(L,16,this,this.isDragSource?`dragging`:`idle`)),j(L,19,this),this.type=i,this.sensors=a,this.modifiers=r,this.alignment=c.alignment,this.plugins=o}pluginConfig(e){if(this.plugins)for(let t of this.plugins){let n=Pn(t);if(n.plugin===e)return n.options}}get isDropping(){return this.status===`dropping`&&this.isDragSource}get isDragging(){return this.status===`dragging`&&this.isDragSource}get isDragSource(){return this.manager?.dragOperation.source?.id===this.id}};L=wn(fr),pr=new WeakMap,mr=new WeakMap,hr=new WeakMap,M(L,4,`type`,dr,gr,pr),M(L,4,`modifiers`,ur,gr,mr),M(L,4,`status`,lr,gr,hr),M(L,2,`isDropping`,cr,gr),M(L,2,`isDragging`,sr,gr),M(L,2,`isDragSource`,or,gr),On(L,gr);var _r,vr,yr,br,xr,Sr,Cr,R,wr,Tr,Er,Dr,Or,kr=class extends (Cr=ir,Sr=[E],xr=[E],br=[E],yr=[E],vr=[E],_r=[D],Cr){constructor(e,t){var n=e,{accept:r,collisionDetector:i,collisionPriority:a,type:o}=n,s=Cn(n,[`accept`,`collisionDetector`,`collisionPriority`,`type`]);super(s,t),j(R,5,this),P(this,wr,j(R,8,this)),j(R,11,this),P(this,Tr,j(R,12,this)),j(R,15,this),P(this,Er,j(R,16,this)),j(R,19,this),P(this,Dr,j(R,20,this)),j(R,23,this),P(this,Or,j(R,24,this)),j(R,27,this),this.accept=r,this.collisionDetector=i,this.collisionPriority=a,this.type=o}accepts(e){let{accept:t}=this;return t?typeof t==`function`?t(e):e.type?Array.isArray(t)?t.includes(e.type):e.type===t:!1:!0}get isDropTarget(){return this.manager?.dragOperation.target?.id===this.id}};R=wn(Cr),wr=new WeakMap,Tr=new WeakMap,Er=new WeakMap,Dr=new WeakMap,Or=new WeakMap,M(R,4,`accept`,Sr,kr,wr),M(R,4,`type`,xr,kr,Tr),M(R,4,`collisionDetector`,br,kr,Er),M(R,4,`collisionPriority`,yr,kr,Dr),M(R,4,`shape`,vr,kr,Or),M(R,2,`isDropTarget`,_r,kr),On(R,kr);var Ar=class{constructor(){this.registry=new Map}addEventListener(e,t){let{registry:n}=this,r=new Set(n.get(e));return r.add(t),n.set(e,r),()=>this.removeEventListener(e,t)}removeEventListener(e,t){let{registry:n}=this,r=new Set(n.get(e));r.delete(t),n.set(e,r)}dispatch(e,...t){let{registry:n}=this,r=n.get(e);if(r)for(let e of r)e(...t)}},jr=class extends Ar{constructor(e){super(),this.manager=e}dispatch(e,t){let n=[t,this.manager];super.dispatch(e,...n)}};function Mr(e,t=!0){let n=!1;return xn(bn({},e),{cancelable:t,get defaultPrevented(){return n},preventDefault(){t&&(n=!0)}})}var Nr=class extends zn{constructor(e){super(e);let t=(e,t)=>e.map(({id:e})=>e).join(``)===t.map(({id:e})=>e).join(``),n=[];this.destroy=rt(()=>{let{dragOperation:t,collisionObserver:r}=e;t.status.initializing&&(n=[],r.enable())},()=>{let{collisionObserver:r,monitor:i}=e,{collisions:a}=r;if(r.isDisabled()||ir.pendingIdChanges)return;let o=Mr({collisions:a});if(i.dispatch(`collision`,o),o.defaultPrevented||t(a,n))return;n=a;let[s]=a;S(()=>{s?.id!==e.dragOperation.target?.id&&(r.disable(),e.actions.setDropTarget(s?.id).then(()=>{r.enable()}))})})}},Pr=(e=>(e[e.Lowest=0]=`Lowest`,e[e.Low=1]=`Low`,e[e.Normal=2]=`Normal`,e[e.High=3]=`High`,e[e.Highest=4]=`Highest`,e))(Pr||{}),Fr=(e=>(e[e.Collision=0]=`Collision`,e[e.ShapeIntersection=1]=`ShapeIntersection`,e[e.PointerIntersection=2]=`PointerIntersection`,e))(Fr||{}),Ir,Lr,Rr,zr,Br,Vr,Hr=[E],Ur,Wr;Vr=[D],Br=[D],zr=[D],Rr=[D],Lr=[D],Ir=[D];var Gr=class{constructor(){j(Ur,5,this),P(this,Wr,j(Ur,8,this,`idle`)),j(Ur,11,this)}get current(){return this.value}get idle(){return this.value===`idle`}get initializing(){return this.value===`initializing`}get initialized(){let{value:e}=this;return e!==`idle`&&e!==`initialization-pending`}get dragging(){return this.value===`dragging`}get dropped(){return this.value===`dropped`}set(e){this.value=e}};Ur=wn(null),Wr=new WeakMap,M(Ur,4,`value`,Hr,Gr,Wr),M(Ur,2,`current`,Vr,Gr),M(Ur,2,`idle`,Br,Gr),M(Ur,2,`initializing`,zr,Gr),M(Ur,2,`initialized`,Rr,Gr),M(Ur,2,`dragging`,Lr,Gr),M(Ur,2,`dropped`,Ir,Gr),On(Ur,Gr);var Kr=class{constructor(e){this.manager=e}setDragSource(e){let{dragOperation:t}=this.manager;t.sourceIdentifier=typeof e==`string`||typeof e==`number`?e:e.id}setDropTarget(e){return S(()=>{let{dragOperation:t}=this.manager,n=e??null;if(t.targetIdentifier===n)return Promise.resolve(!1);t.targetIdentifier=n;let r=Mr({operation:t.snapshot()});return t.status.dragging&&this.manager.monitor.dispatch(`dragover`,r),this.manager.renderer.rendering.then(()=>r.defaultPrevented)})}start(e){return S(()=>{let{dragOperation:t}=this.manager;if(e.source!=null&&this.setDragSource(e.source),!t.source)throw Error(`Cannot start a drag operation without a drag source`);if(!t.status.idle)throw Error(`Cannot start a drag operation while another is active`);let n=new AbortController,{event:r,coordinates:i}=e;ce(()=>{t.status.set(`initialization-pending`),t.shape=null,t.canceled=!1,t.activatorEvent=r??null,t.position.reset(i)});let a=Mr({operation:t.snapshot()});return this.manager.monitor.dispatch(`beforedragstart`,a),a.defaultPrevented?(t.reset(),n.abort(),n):(t.status.set(`initializing`),t.controller=n,this.manager.renderer.rendering.then(()=>{if(n.signal.aborted)return;let{status:e}=t;e.current===`initializing`&&ce(()=>{t.status.set(`dragging`),this.manager.monitor.dispatch(`dragstart`,{nativeEvent:r,operation:t.snapshot(),cancelable:!1})})}),n)})}move(e){return S(()=>{let{dragOperation:t}=this.manager,{status:n,controller:r}=t;if(!n.dragging||!r||r.signal.aborted)return;let i=Mr({nativeEvent:e.event,operation:t.snapshot(),by:e.by,to:e.to},e.cancelable??!0);(e.propagate??!0)&&this.manager.monitor.dispatch(`dragmove`,i),queueMicrotask(()=>{if(i.defaultPrevented)return;let n=e.to??{x:t.position.current.x+(e.by?.x??0),y:t.position.current.y+(e.by?.y??0)};t.position.current=n})})}stop(e={}){return S(()=>{let{dragOperation:t}=this.manager,{controller:n}=t;if(!n||n.signal.aborted)return;let r,i=()=>{let e={resume:()=>{},abort:()=>{}};return r=new Promise((t,n)=>{e.resume=t,e.abort=n}),e};n.abort();let a=()=>{this.manager.renderer.rendering.then(()=>{t.status.set(`dropped`);let e=S(()=>t.source?.status===`dropping`),r=()=>{t.controller===n&&(t.controller=void 0),t.reset()};if(e){let{source:e}=t,n=T(()=>{e?.status===`idle`&&(n(),r())})}else this.manager.renderer.rendering.then(r)})};t.canceled=e.canceled??!1,this.manager.monitor.dispatch(`dragend`,{nativeEvent:e.event,operation:t.snapshot(),canceled:e.canceled??!1,suspend:i}),r?r.then(a).catch(()=>t.reset()):a()})}},qr=class extends I{constructor(e,t){super(e,t),this.manager=e,this.options=t}},Jr=class extends AbortController{constructor(e,t){super(),this.constraints=e,this.onActivate=t,this.activated=!1;for(let t of e??[])t.controller=this}onEvent(e){if(!this.activated){if(this.constraints?.length)for(let t of this.constraints)t.onEvent(e);else this.activate(e)}}activate(e){this.activated||(this.activated=!0,this.onActivate(e))}abort(e){this.activated=!1,super.abort(e)}},Yr,Xr=class{constructor(e){this.options=e,P(this,Yr)}set controller(e){F(this,Yr,e),e.signal.addEventListener(`abort`,()=>this.abort())}activate(e){var t;(t=N(this,Yr))==null||t.activate(e)}};Yr=new WeakMap;var Zr=class extends I{constructor(e,t){super(e,t),this.manager=e,this.options=t}apply(e){return e.transform}},Qr=class{constructor(e){this.draggables=new ar,this.droppables=new ar,this.plugins=new Vn(e),this.sensors=new Vn(e),this.modifiers=new Vn(e)}register(e,t){if(e instanceof gr)return this.draggables.register(e.id,e);if(e instanceof kr)return this.droppables.register(e.id,e);if(e.prototype instanceof Zr)return this.modifiers.register(e,t);if(e.prototype instanceof qr)return this.sensors.register(e,t);if(e.prototype instanceof I)return this.plugins.register(e,t);throw Error(`Invalid instance type`)}unregister(e){if(e instanceof ir)return e instanceof gr?this.draggables.unregister(e.id,e):e instanceof kr?this.droppables.unregister(e.id,e):()=>{};if(e.prototype instanceof Zr)return this.modifiers.unregister(e);if(e.prototype instanceof qr)return this.sensors.unregister(e);if(e.prototype instanceof I)return this.plugins.unregister(e);throw Error(`Invalid instance type`)}destroy(){this.draggables.destroy(),this.droppables.destroy(),this.plugins.destroy(),this.sensors.destroy(),this.modifiers.destroy()}},$r,ei,ti,ni,ri,ii,ai,oi,si=[D],ci,li,ui,z,di,fi,pi,mi,hi,gi;oi=[E],ai=[E],ii=[E],ri=[E],ni=[E],ti=[D],ei=[D],$r=[D];var _i=class{constructor(e){j(z,5,this),P(this,ci),P(this,li),P(this,ui,new St(void 0,(e,t)=>e&&t?e.equals(t):e===t)),this.status=new Gr,P(this,di,j(z,8,this,!1)),j(z,11,this),P(this,fi,j(z,12,this,null)),j(z,15,this),P(this,pi,j(z,16,this,null)),j(z,19,this),P(this,mi,j(z,20,this,null)),j(z,23,this),P(this,hi,j(z,24,this,[])),j(z,27,this),this.position=new an({x:0,y:0}),P(this,gi,{x:0,y:0}),F(this,ci,e)}get shape(){let{current:e,initial:t,previous:n}=N(this,ui);return!e||!t?null:{current:e,initial:t,previous:n}}set shape(e){e?N(this,ui).current=e:N(this,ui).reset()}get source(){let e=this.sourceIdentifier;if(e==null)return null;let t=N(this,ci).registry.draggables.get(e);return t&&F(this,li,t),t??N(this,li)??null}get target(){let e=this.targetIdentifier;return e==null?null:N(this,ci).registry.droppables.get(e)??null}get transform(){let{x:e,y:t}=this.position.delta,n={x:e,y:t};for(let e of this.modifiers)n=e.apply(xn(bn({},this.snapshot()),{transform:n}));return F(this,gi,n),n}snapshot(){return S(()=>({source:this.source,target:this.target,activatorEvent:this.activatorEvent,transform:N(this,gi),shape:this.shape?Ct(this.shape):null,position:Ct(this.position),status:Ct(this.status),canceled:this.canceled}))}reset(){ce(()=>{this.status.set(`idle`),this.sourceIdentifier=null,this.targetIdentifier=null,N(this,ui).reset(),this.position.reset({x:0,y:0}),F(this,gi,{x:0,y:0}),this.modifiers=[]})}};z=wn(null),ci=new WeakMap,li=new WeakMap,ui=new WeakMap,di=new WeakMap,fi=new WeakMap,pi=new WeakMap,mi=new WeakMap,hi=new WeakMap,gi=new WeakMap,M(z,2,`shape`,si,_i),M(z,4,`canceled`,oi,_i,di),M(z,4,`activatorEvent`,ai,_i,fi),M(z,4,`sourceIdentifier`,ii,_i,pi),M(z,4,`targetIdentifier`,ri,_i,mi),M(z,4,`modifiers`,ni,_i,hi),M(z,2,`source`,ti,_i),M(z,2,`target`,ei,_i),M(z,2,`transform`,$r,_i),On(z,_i);var vi={get rendering(){return Promise.resolve()}};function yi(e,t){return typeof e==`function`?e(t):e??t}var bi=class{constructor(e){this.destroy=()=>{this.dragOperation.status.idle||this.actions.stop({canceled:!0}),this.dragOperation.modifiers.forEach(e=>e.destroy()),this.registry.destroy(),this.collisionObserver.destroy()};let t=e??{},n=yi(t.plugins,[]),r=yi(t.sensors,[]),i=yi(t.modifiers,[]),a=t.renderer??vi,o=new jr(this),s=new Qr(this);this.registry=s,this.monitor=o,this.renderer=a,this.actions=new Kr(this),this.dragOperation=new _i(this),this.collisionObserver=new Kn(this),this.plugins=[Nr,...n],this.modifiers=i,this.sensors=r;let{destroy:c}=this,l=rt(()=>{let e=S(()=>this.dragOperation.modifiers),t=this.modifiers;for(let n of e)t.includes(n)||n.destroy();this.dragOperation.modifiers=(this.dragOperation.source?.modifiers)?.map(e=>{let{plugin:t,options:n}=Pn(e);return new t(this,n)})??t});this.destroy=()=>{l(),c()}}get plugins(){return this.registry.plugins.values}set plugins(e){this.registry.plugins.values=e}get modifiers(){return this.registry.modifiers.values}set modifiers(e){this.registry.modifiers.values=e}get sensors(){return this.registry.sensors.values}set sensors(e){this.registry.sensors.values=e}},xi=e=>{throw TypeError(e)},Si=(e,t,n)=>t.has(e)||xi(`Cannot `+n),B=(e,t,n)=>(Si(e,t,`read from private field`),t.get(e)),V=(e,t,n)=>t.has(e)?xi(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),H=(e,t,n,r)=>(Si(e,t,`write to private field`),t.set(e,n),n),Ci=(e,t,n)=>(Si(e,t,`access private method`),n);function wi(e){return e?e instanceof KeyframeEffect||`getKeyframes`in e&&typeof e.getKeyframes==`function`:!1}function Ti(e,t){let n=e.getAnimations(),r=null;for(let e of n){if(e.playState!==`running`)continue;let{effect:n}=e,i=(wi(n)?n.getKeyframes():[]).filter(t);i.length>0&&(r=[i[i.length-1],e])}return r}function Ei(e){let{width:t,height:n,top:r,left:i,bottom:a,right:o}=e.getBoundingClientRect();return{width:t,height:n,top:r,left:i,bottom:a,right:o}}function Di(e){let t=Object.prototype.toString.call(e);return t===`[object Window]`||t===`[object global]`}function Oi(e){return`nodeType`in e}function U(e){return e?Di(e)?e:Oi(e)?`defaultView`in e?e.defaultView??window:e.ownerDocument?.defaultView??window:window:window}function ki(e){let{Document:t}=U(e);return e instanceof t||`nodeType`in e&&e.nodeType===Node.DOCUMENT_NODE}function Ai(e){return!e||Di(e)?!1:e instanceof U(e).HTMLElement||`namespaceURI`in e&&typeof e.namespaceURI==`string`&&e.namespaceURI.endsWith(`html`)}function ji(e){return e instanceof U(e).SVGElement||`namespaceURI`in e&&typeof e.namespaceURI==`string`&&e.namespaceURI.endsWith(`svg`)}function Mi(e){return e?Di(e)?e.document:Oi(e)?ki(e)?e:Ai(e)||ji(e)?e.ownerDocument:document:document:document}function Ni(e){let{documentElement:t}=Mi(e),n=U(e).visualViewport,r=n?.width??t.clientWidth,i=n?.height??t.clientHeight,a=n?.offsetTop??0,o=n?.offsetLeft??0;return{top:a,left:o,right:o+r,bottom:a+i,width:r,height:i}}function Pi(e,t){if(Fi(e)&&e.open===!1)return!1;let{overflow:n,overflowX:r,overflowY:i}=getComputedStyle(e);return n===`visible`&&r===`visible`&&i===`visible`}function Fi(e){return e.tagName===`DETAILS`}function Ii(e,t=e.getBoundingClientRect(),n=0){let r=t,{ownerDocument:i}=e,a=i.defaultView??window,o=e.parentElement;for(;o&&o!==i.documentElement;){if(!Pi(o)){let e=o.getBoundingClientRect(),t=n*(e.bottom-e.top),i=n*(e.right-e.left),a=n*(e.bottom-e.top),s=n*(e.right-e.left);r={top:Math.max(r.top,e.top-t),right:Math.min(r.right,e.right+i),bottom:Math.min(r.bottom,e.bottom+a),left:Math.max(r.left,e.left-s),width:0,height:0},r.width=r.right-r.left,r.height=r.bottom-r.top}o=o.parentElement}let s=a.visualViewport,c=s?.offsetTop??0,l=s?.offsetLeft??0,u=s?.width??a.innerWidth,d=s?.height??a.innerHeight,f=n*d,p=n*u;return r={top:Math.max(r.top,c-f),right:Math.min(r.right,l+u+p),bottom:Math.min(r.bottom,c+d+f),left:Math.max(r.left,l-p),width:0,height:0},r.width=r.right-r.left,r.height=r.bottom-r.top,r.width<0&&(r.width=0),r.height<0&&(r.height=0),r}function Li(e){return{x:e.clientX,y:e.clientY}}var Ri=typeof window<`u`&&window.document!==void 0&&window.document.createElement!==void 0;function zi(e=document,t=new Set){if(t.has(e))return[];t.add(e);let n=[e];for(let r of Array.from(e.querySelectorAll(`iframe, frame`)))try{let e=r.contentDocument;e&&!t.has(e)&&n.push(...zi(e,t))}catch{}try{let r=e.defaultView;if(r&&r!==window.top){let i=r.parent;i&&i.document&&i.document!==e&&n.push(...zi(i.document,t))}}catch{}return n}function Bi(){return/^((?!chrome|android).)*safari/i.test(navigator.userAgent)}function Vi(){let e=Bi()?window.visualViewport:null;return{x:e?.offsetLeft??0,y:e?.offsetTop??0}}function Hi(e){return!e||!Oi(e)?!1:e instanceof U(e).ShadowRoot}function Ui(e){if(e&&Oi(e)){let t=e.getRootNode();if(Hi(t)||t instanceof Document)return t}return Mi(e)}function Wi(e){return e.matchMedia(`(prefers-reduced-motion: reduce)`).matches}function Gi(e){let t=`input, textarea, select, canvas, [contenteditable]`,n=e.cloneNode(!0),r=Array.from(e.querySelectorAll(t));return Array.from(n.querySelectorAll(t)).forEach((e,t)=>{let n=r[t];Ki(e)&&Ki(n)&&(e.type!==`file`&&(e.value=n.value),e.type===`radio`&&e.name&&(e.name=`Cloned__${e.name}`)),qi(e)&&qi(n)&&n.width>0&&n.height>0&&e.getContext(`2d`)?.drawImage(n,0,0)}),n}function Ki(e){return`value`in e}function qi(e){return e.tagName===`CANVAS`}function Ji(e,{x:t,y:n}){let r=e.elementFromPoint(t,n);if(Yi(r)){let{contentDocument:e}=r;if(e){let{left:i,top:a}=r.getBoundingClientRect();return Ji(e,{x:t-i,y:n-a})}}return r}function Yi(e){return e?.tagName===`IFRAME`}var Xi=new WeakMap;function Zi(e){return!!e.closest(`
      input:not([disabled]),
      select:not([disabled]),
      textarea:not([disabled]),
      button:not([disabled]),
      a[href],
      [contenteditable]:not([contenteditable="false"])
    `)}var Qi=class{constructor(){this.entries=new Set,this.clear=()=>{for(let e of this.entries){let[t,{type:n,listener:r,options:i}]=e;t.removeEventListener(n,r,i)}this.entries.clear()}}bind(e,t){let n=Array.isArray(e)?e:[e],r=Array.isArray(t)?t:[t],i=[];for(let e of n)for(let t of r){let{type:n,listener:r,options:a}=t,o=[e,t];e.addEventListener(n,r,a),this.entries.add(o),i.push(o)}let a=this.entries;return function(){for(let e of i){let[t,{type:n,listener:r,options:i}]=e;t.removeEventListener(n,r,i),a.delete(e)}}}};function $i(e){let t=e?.ownerDocument.defaultView;if(t&&t.self!==t.parent)return t.frameElement}function ea(e){let t=new Set,n=$i(e);for(;n;)t.add(n),n=$i(n);return t}function ta(e,t){let n=setTimeout(e,t);return()=>clearTimeout(n)}function na(e,t){let n=()=>performance.now(),r,i;return function(...a){let o=this;i?(r?.(),r=ta(()=>{e.apply(o,a),i=n()},t-(n()-i))):(e.apply(o,a),i=n())}}function ra(e,t){return e===t?!0:!e||!t?!1:e.top==t.top&&e.left==t.left&&e.right==t.right&&e.bottom==t.bottom}function ia(e,t=e.getBoundingClientRect()){let{width:n,height:r}=Ii(e,t);return n>0&&r>0}var aa=Ri?ResizeObserver:class{observe(){}unobserve(){}disconnect(){}},oa,sa=class extends aa{constructor(e){super(t=>{if(!B(this,oa)){H(this,oa,!0);return}e(t,this)}),V(this,oa,!1)}};oa=new WeakMap;var ca=Array.from({length:100},(e,t)=>t/100),la=75,ua,da,fa,pa,ma,W,ha,ga,_a,va,ya,ba=class{constructor(e,t,n={debug:!1,skipInitial:!1}){this.element=e,this.callback=t,V(this,_a),this.disconnect=()=>{var e,t,n;H(this,ha,!0),(e=B(this,fa))==null||e.disconnect(),(t=B(this,pa))==null||t.disconnect(),B(this,ma).disconnect(),(n=B(this,W))==null||n.remove()},V(this,ua,!0),V(this,da),V(this,fa),V(this,pa),V(this,ma),V(this,W),V(this,ha,!1),V(this,ga,na(()=>{var e;let{element:t}=this;if((e=B(this,pa))==null||e.disconnect(),B(this,ha)||!B(this,ua)||!t.isConnected)return;let n=t.ownerDocument??document,{innerHeight:r,innerWidth:i}=n.defaultView??window,a=t.getBoundingClientRect(),{top:o,left:s,bottom:c,right:l}=Ii(t,a),u=-Math.floor(o),d=-Math.floor(s),f=`${u}px ${-Math.floor(i-l)}px ${-Math.floor(r-c)}px ${d}px`;this.boundingClientRect=a,H(this,pa,new IntersectionObserver(e=>{let[n]=e,{intersectionRect:r}=n;(n.intersectionRatio===1?Zt.intersectionRatio(r,Ii(t)):n.intersectionRatio)!==1&&B(this,ga).call(this)},{threshold:ca,rootMargin:f,root:n})),B(this,pa).observe(t),Ci(this,_a,va).call(this)},la)),this.boundingClientRect=e.getBoundingClientRect(),H(this,ua,ia(e,this.boundingClientRect));let r=!0;this.callback=e=>{r&&(r=!1,n.skipInitial)||t(e)};let i=e.ownerDocument;n?.debug&&(H(this,W,document.createElement(`div`)),B(this,W).style.background=`rgba(0,0,0,0.15)`,B(this,W).style.position=`fixed`,B(this,W).style.pointerEvents=`none`,i.body.appendChild(B(this,W))),H(this,ma,new IntersectionObserver(t=>{var n,r;let{boundingClientRect:i,isIntersecting:a}=t[t.length-1],{width:o,height:s}=i,c=B(this,ua);H(this,ua,a),!(!o&&!s)&&(c&&!a?((n=B(this,pa))==null||n.disconnect(),this.callback(null),(r=B(this,fa))==null||r.disconnect(),H(this,fa,void 0),B(this,W)&&(B(this,W).style.visibility=`hidden`)):B(this,ga).call(this),a&&!B(this,fa)&&(H(this,fa,new sa(B(this,ga))),B(this,fa).observe(e)))},{threshold:ca,root:i})),B(this,ua)&&!n.skipInitial&&this.callback(this.boundingClientRect),B(this,ma).observe(e)}};ua=new WeakMap,da=new WeakMap,fa=new WeakMap,pa=new WeakMap,ma=new WeakMap,W=new WeakMap,ha=new WeakMap,ga=new WeakMap,_a=new WeakSet,va=function(){B(this,ha)||(Ci(this,_a,ya).call(this),!ra(this.boundingClientRect,B(this,da))&&(this.callback(this.boundingClientRect),H(this,da,this.boundingClientRect)))},ya=function(){if(B(this,W)){let{top:e,left:t,width:n,height:r}=Ii(this.element);B(this,W).style.overflow=`hidden`,B(this,W).style.visibility=`visible`,B(this,W).style.top=`${Math.floor(e)}px`,B(this,W).style.left=`${Math.floor(t)}px`,B(this,W).style.width=`${Math.floor(n)}px`,B(this,W).style.height=`${Math.floor(r)}px`}};var xa=new WeakMap,Sa=new WeakMap;function Ca(e,t){let n=xa.get(e);return n||={disconnect:new ba(e,t=>{let n=xa.get(e);n&&n.callbacks.forEach(e=>e(t))},{skipInitial:!0}).disconnect,callbacks:new Set},n.callbacks.add(t),xa.set(e,n),()=>{n.callbacks.delete(t),n.callbacks.size===0&&(xa.delete(e),n.disconnect())}}function wa(e,t){let n=new Set;for(let r of e){let e=Ca(r,t);n.add(e)}return()=>n.forEach(e=>e())}function Ta(e,t){let n=e.ownerDocument;if(!Sa.has(n)){let e=new AbortController,t=new Set;document.addEventListener(`scroll`,e=>t.forEach(t=>t(e)),{capture:!0,passive:!0,signal:e.signal}),Sa.set(n,{disconnect:()=>e.abort(),listeners:t})}let{listeners:r,disconnect:i}=Sa.get(n)??{};return!r||!i?()=>{}:(r.add(t),()=>{r.delete(t),r.size===0&&(i(),Sa.delete(n))})}var Ea,Da,Oa,ka,Aa=class{constructor(e,t,n){this.callback=t,V(this,Ea),V(this,Da,!1),V(this,Oa),V(this,ka,na(e=>{if(!B(this,Da)&&e.target&&`contains`in e.target&&typeof e.target.contains==`function`){for(let t of B(this,Oa))if(e.target.contains(t)){this.callback(B(this,Ea).boundingClientRect);break}}},la));let r=ea(e),i=wa(r,t),a=Ta(e,B(this,ka));H(this,Oa,r),H(this,Ea,new ba(e,t,n)),this.disconnect=()=>{B(this,Da)||(H(this,Da,!0),i(),a(),B(this,Ea).disconnect())}}};Ea=new WeakMap,Da=new WeakMap,Oa=new WeakMap,ka=new WeakMap;function ja(e){return`showPopover`in e&&`hidePopover`in e&&typeof e.showPopover==`function`&&typeof e.hidePopover==`function`}function Ma(e){try{ja(e)&&e.isConnected&&e.hasAttribute(`popover`)&&!e.matches(`:popover-open`)&&e.showPopover()}catch{}}function Na(e){return!Ri||!e?!1:e===Mi(e).scrollingElement}function Pa(e){let t=U(e),n=Na(e)?Ni(e):Ei(e),r=t.visualViewport,i=Na(e)?{height:r?.height??t.innerHeight,width:r?.width??t.innerWidth}:{height:e.clientHeight,width:e.clientWidth},a={current:{x:e.scrollLeft,y:e.scrollTop},max:{x:e.scrollWidth-i.width,y:e.scrollHeight-i.height}};return{rect:n,position:a,isTop:a.current.y<=0,isLeft:a.current.x<=0,isBottom:a.current.y>=a.max.y,isRight:a.current.x>=a.max.x}}function Fa(e,t){let{isTop:n,isBottom:r,isLeft:i,isRight:a,position:o}=Pa(e),{x:s,y:c}=t??{x:0,y:0},l=!n&&o.current.y+c>0,u=!r&&o.current.y+c<o.max.y,d=!i&&o.current.x+s>0,f=!a&&o.current.x+s<o.max.x;return{top:l,bottom:u,left:d,right:f,x:d||f,y:l||u}}var Ia=class{constructor(e){this.scheduler=e,this.pending=!1,this.tasks=new Set,this.resolvers=new Set,this.flush=()=>{let{tasks:e,resolvers:t}=this;this.pending=!1,this.tasks=new Set,this.resolvers=new Set;for(let t of e)t();for(let e of t)e()}}schedule(e){return this.tasks.add(e),this.pending||(this.pending=!0,this.scheduler(this.flush)),new Promise(e=>this.resolvers.add(e))}},La=new Ia(e=>{typeof requestAnimationFrame==`function`?requestAnimationFrame(e):e()}),Ra=new Ia(e=>setTimeout(e,50)),za=new Map,Ba=za.clear.bind(za);function Va(e,t=!1){if(!t)return Ha(e);let n=za.get(e);return n||(n=Ha(e),za.set(e,n),Ra.schedule(Ba),n)}function Ha(e){return U(e).getComputedStyle(e)}function Ua(e,t=Va(e,!0)){return t.position===`fixed`||t.position===`sticky`}function Wa(e,t=Va(e,!0)){let n=/(auto|scroll|overlay)/;return[`overflow`,`overflowX`,`overflowY`].some(e=>{let r=t[e];return typeof r==`string`&&n.test(r)})}var Ga={excludeElement:!0,escapeShadowDOM:!0};function Ka(e,t=Ga){let{limit:n,excludeElement:r,escapeShadowDOM:i}=t,a=new Set;function o(t){if(n!=null&&a.size>=n||!t)return a;if(ki(t)&&t.scrollingElement!=null&&!a.has(t.scrollingElement))return a.add(t.scrollingElement),a;if(i&&Hi(t))return o(t.host);if(!Ai(t))return ji(t)?o(t.parentElement):a;if(a.has(t))return a;let s=Va(t,!0);if(r&&t===e||Wa(t,s)&&a.add(t),Ua(t,s)){let{scrollingElement:e}=t.ownerDocument;return e&&a.add(e),a}return o(t.parentNode)}return e?o(e):a}function qa(e,t=window.frameElement){let n={x:0,y:0,scaleX:1,scaleY:1};if(!e)return n;let r=$i(e);for(;r;){if(r===t)return n;let e=Ei(r),{x:i,y:a}=Ja(r,e);n.x+=e.left,n.y+=e.top,n.scaleX*=i,n.scaleY*=a,r=$i(r)}return n}function Ja(e,t=Ei(e)){let n=Math.round(t.width),r=Math.round(t.height);if(Ai(e))return{x:n/e.offsetWidth,y:r/e.offsetHeight};let i=Va(e,!0);return{x:(parseFloat(i.width)||n)/n,y:(parseFloat(i.height)||r)/r}}function Ya(e){if(e===`none`)return null;let t=e.split(` `),n=parseFloat(t[0]),r=parseFloat(t[1]);return isNaN(n)&&isNaN(r)?null:{x:isNaN(n)?r:n,y:isNaN(r)?n:r}}function Xa(e){if(e===`none`)return null;let[t,n,r=`0`]=e.split(` `),i={x:parseFloat(t),y:parseFloat(n),z:parseInt(r,10)};return isNaN(i.x)&&isNaN(i.y)?null:{x:isNaN(i.x)?0:i.x,y:isNaN(i.y)?0:i.y,z:isNaN(i.z)?0:i.z}}function Za(e){let{scale:t,transform:n,translate:r}=e,i=Ya(t),a=Xa(r),o=Qa(n);if(!o&&!i&&!a)return null;let s={x:i?.x??1,y:i?.y??1},c={x:a?.x??0,y:a?.y??0},l={x:o?.x??0,y:o?.y??0,scaleX:o?.scaleX??1,scaleY:o?.scaleY??1};return{x:c.x+l.x,y:c.y+l.y,z:a?.z??0,scaleX:s.x*l.scaleX,scaleY:s.y*l.scaleY}}function Qa(e){if(e.startsWith(`matrix3d(`)){let t=e.slice(9,-1).split(/, /);return{x:+t[12],y:+t[13],scaleX:+t[0],scaleY:+t[5]}}if(e.startsWith(`matrix(`)){let t=e.slice(7,-1).split(/, /);return{x:+t[4],y:+t[5],scaleX:+t[0],scaleY:+t[3]}}return null}var $a=(e=>(e[e.Idle=0]=`Idle`,e[e.Forward=1]=`Forward`,e[e.Reverse=-1]=`Reverse`,e))($a||{}),eo={x:.2,y:.2},to={x:10,y:10};function no(e,t,n,r=25,i=eo,a=to){let{x:o,y:s}=t,{rect:c,isTop:l,isBottom:u,isLeft:d,isRight:f}=Pa(e),p=qa(e),m=Za(Va(e,!0)),h=m!==null&&m?.scaleX<0,g=m!==null&&m?.scaleY<0,_=new Zt(c.left*p.scaleX+p.x,c.top*p.scaleY+p.y,c.width*p.scaleX,c.height*p.scaleY),v={x:0,y:0},y={x:0,y:0},b={height:_.height*i.y,width:_.width*i.x};return b.height>0&&(!l||g&&!u)&&s<=_.top+b.height&&n?.y!==1&&o>=_.left-a.x&&o<=_.right+a.x?(v.y=g?1:-1,y.y=r*Math.abs((_.top+b.height-s)/b.height)):b.height>0&&(!u||g&&!l)&&s>=_.bottom-b.height&&n?.y!==-1&&o>=_.left-a.x&&o<=_.right+a.x&&(v.y=g?-1:1,y.y=r*Math.abs((_.bottom-b.height-s)/b.height)),b.width>0&&(!f||h&&!d)&&o>=_.right-b.width&&n?.x!==-1&&s>=_.top-a.y&&s<=_.bottom+a.y?(v.x=h?-1:1,y.x=r*Math.abs((_.right-b.width-o)/b.width)):b.width>0&&(!d||h&&!f)&&o<=_.left+b.width&&n?.x!==1&&s>=_.top-a.y&&s<=_.bottom+a.y&&(v.x=h?1:-1,y.x=r*Math.abs((_.left+b.width-o)/b.width)),{direction:v,speed:y}}function ro(e,{block:t=`nearest`,inline:n=`nearest`}={}){if(!Ai(e))return;let r=Ka(e),i=[];for(let a of r){if(!Ai(a))continue;let{top:r,left:o}=ao(e,a),s=r,c=o;for(let e of i)s-=e.scrollTop,c-=e.scrollLeft;if(t!==`none`){let n=s<a.scrollTop;n!==s+e.offsetHeight>a.scrollTop+a.clientHeight&&(a.scrollTop=t===`center`?s-a.clientHeight/2+e.offsetHeight/2:n?s:s+e.offsetHeight-a.clientHeight)}if(n!==`none`){let t=c<a.scrollLeft;t!==c+e.offsetWidth>a.scrollLeft+a.clientWidth&&(a.scrollLeft=n===`center`?c-a.clientWidth/2+e.offsetWidth/2:t?c:c+e.offsetWidth-a.clientWidth)}i.push(a)}}function io(e){let t=0,n=0,r=e;for(;r;){t+=r.offsetTop,n+=r.offsetLeft;let e=r.offsetParent;if(!Ai(e))break;t+=e.clientTop,n+=e.clientLeft,r=e}return{top:t,left:n}}function ao(e,t){let n=io(e),r=io(t);return{top:n.top-r.top-t.clientTop,left:n.left-r.left-t.clientLeft}}function oo(e,t,n){let{scaleX:r,scaleY:i,x:a,y:o}=t,s=e.left+a+(1-r)*parseFloat(n),c=e.top+o+(1-i)*parseFloat(n.slice(n.indexOf(` `)+1)),l=r?e.width*r:e.width,u=i?e.height*i:e.height;return{width:l,height:u,top:c,right:s+l,bottom:c+u,left:s}}function so(e,t,n){let{scaleX:r,scaleY:i,x:a,y:o}=t,s=e.left-a-(1-r)*parseFloat(n),c=e.top-o-(1-i)*parseFloat(n.slice(n.indexOf(` `)+1)),l=r?e.width/r:e.width,u=i?e.height/i:e.height;return{width:l,height:u,top:c,right:s+l,bottom:c+u,left:s}}function co({element:e,keyframes:t,options:n}){return e.animate(t,n).finished}function lo(e,t=Va(e).translate,n=!0){if(n){let t=Ti(e,e=>`translate`in e);if(t){let{translate:e=``}=t[0];if(typeof e==`string`){let t=Xa(e);if(t)return t}}}if(t){let e=Xa(t);if(e)return e}return{x:0,y:0,z:0}}var uo=new Ia(e=>setTimeout(e,0)),fo=new Map,po=fo.clear.bind(fo);function mo(e){let t=e.ownerDocument,n=fo.get(t);if(n)return n;n=t.getAnimations(),fo.set(t,n),uo.schedule(po);let r=n.filter(t=>wi(t.effect)&&t.effect.target===e);return fo.set(e,r),n}function ho(e,t){let n=mo(e).filter(e=>{if(wi(e.effect)){let{target:n}=e.effect;if((n&&t.isValidTarget?.call(t,n))??!0)return e.effect.getKeyframes().some(e=>{for(let n of t.properties)if(e[n])return!0})}}).map(e=>{let{effect:t,currentTime:n}=e,r=t?.getComputedTiming().duration;if(!(e.pending||e.playState===`finished`)&&typeof r==`number`&&typeof n==`number`&&n<r)return e.currentTime=r,()=>{e.currentTime=n}});if(n.length>0)return()=>n.forEach(e=>e?.())}var go=class extends Zt{constructor(e,t={}){let{frameTransform:n=qa(e),ignoreTransforms:r,getBoundingClientRect:i=Ei}=t,a=ho(e,{properties:[`transform`,`translate`,`scale`,`width`,`height`],isValidTarget:t=>(t!==e||Bi())&&t.contains(e)}),o=i(e),{top:s,left:c,width:l,height:u}=o,d,f=Va(e),p=Za(f),m={x:p?.scaleX??1,y:p?.scaleY??1},h=_o(e,f);a?.(),p&&(d=so(o,p,f.transformOrigin),(r||h)&&(s=d.top,c=d.left,l=d.width,u=d.height));let g={width:d?.width??l,height:d?.height??u};if(h&&!r&&d){let e=oo(d,h,f.transformOrigin);s=e.top,c=e.left,l=e.width,u=e.height,m.x=h.scaleX,m.y=h.scaleY}n&&(r||(c*=n.scaleX,l*=n.scaleX,s*=n.scaleY,u*=n.scaleY),c+=n.x,s+=n.y),super(c,s,l,u),this.scale=m,this.intrinsicWidth=g.width,this.intrinsicHeight=g.height}};function _o(e,t){let n=e.getAnimations();if(!n.length)return null;let r,i,a,o=!1;for(let e of n){if(e.playState!==`running`)continue;let t=wi(e.effect)?e.effect.getKeyframes():[],n=t[t.length-1];if(!n)continue;let{transform:s,translate:c,scale:l}=n;typeof s==`string`&&s&&(r=s,o=!0),typeof c==`string`&&c&&(i=c,o=!0),typeof l==`string`&&l&&(a=l,o=!0)}return o?Za({transform:r??t.transform,translate:i??t.translate,scale:a??t.scale}):null}function vo(e){return`style`in e&&typeof e.style==`object`&&e.style!==null&&`setProperty`in e.style&&`removeProperty`in e.style&&typeof e.style.setProperty==`function`&&typeof e.style.removeProperty==`function`}var yo=class{constructor(e){this.element=e,this.initial=new Map}set(e,t=``){let{element:n}=this;if(vo(n))for(let[r,i]of Object.entries(e)){let e=`${t}${r}`;this.initial.has(e)||this.initial.set(e,n.style.getPropertyValue(e)),n.style.setProperty(e,typeof i==`string`?i:`${i}px`)}}remove(e,t=``){let{element:n}=this;if(vo(n))for(let r of e){let e=`${t}${r}`;n.style.removeProperty(e)}}reset(){let{element:e}=this;if(vo(e)){for(let[t,n]of this.initial)e.style.setProperty(t,n);e.getAttribute(`style`)===``&&e.removeAttribute(`style`)}}};function bo(e){return e?e instanceof U(e).Element||Oi(e)&&e.nodeType===Node.ELEMENT_NODE:!1}function xo(e){if(!e)return!1;let{KeyboardEvent:t}=U(e.target);return e instanceof t}function So(e){if(!e)return!1;let{PointerEvent:t}=U(e.target);return e instanceof t}function Co(e){if(!bo(e))return!1;let{tagName:t}=e;return t===`INPUT`||t===`TEXTAREA`||wo(e)}function wo(e){return e.hasAttribute(`contenteditable`)&&e.getAttribute(`contenteditable`)!==`false`}var To={};function Eo(e){let t=To[e]==null?0:To[e]+1;return To[e]=t,`${e}-${t}`}var Do=({dragOperation:e,droppable:t})=>{let n=e.position.current;if(!n)return null;let{id:r}=t;return t.shape&&t.shape.containsPoint(n)?{id:r,value:1/A.distance(t.shape.center,n),type:Fr.PointerIntersection,priority:Pr.High}:null},Oo=({dragOperation:e,droppable:t})=>{let{shape:n}=e;if(!t.shape||!n?.current)return null;let r=n.current.intersectionArea(t.shape);if(r){let{position:i}=e,a=A.distance(t.shape.center,i.current),o=r/(n.current.area+t.shape.area-r)/a;return{id:t.id,value:o,type:Fr.ShapeIntersection,priority:Pr.Normal}}return null},ko=e=>Do(e)??Oo(e),Ao=e=>{let{dragOperation:t,droppable:n}=e,{shape:r,position:i}=t;if(!n.shape)return null;let a=r?Zt.from(r.current.boundingRectangle).corners:void 0,o=Zt.from(n.shape.boundingRectangle).corners.reduce((e,t,n)=>e+A.distance(A.from(t),a?.[n]??i.current),0)/4;return{id:n.id,value:1/o,type:Fr.Collision,priority:Pr.Normal}},jo=Object.create,Mo=Object.defineProperty,No=Object.defineProperties,Po=Object.getOwnPropertyDescriptor,Fo=Object.getOwnPropertyDescriptors,Io=Object.getOwnPropertySymbols,Lo=Object.prototype.hasOwnProperty,Ro=Object.prototype.propertyIsEnumerable,zo=(e,t)=>(t=Symbol[e])?t:Symbol.for(`Symbol.`+e),Bo=e=>{throw TypeError(e)},Vo=(e,t,n)=>t in e?Mo(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,Ho=(e,t)=>{for(var n in t||={})Lo.call(t,n)&&Vo(e,n,t[n]);if(Io)for(var n of Io(t))Ro.call(t,n)&&Vo(e,n,t[n]);return e},Uo=(e,t)=>No(e,Fo(t)),Wo=(e,t)=>Mo(e,`name`,{value:t,configurable:!0}),Go=(e,t)=>{var n={};for(var r in e)Lo.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&Io)for(var r of Io(e))t.indexOf(r)<0&&Ro.call(e,r)&&(n[r]=e[r]);return n},Ko=e=>[,,,jo(e?.[zo(`metadata`)]??null)],qo=[`class`,`method`,`getter`,`setter`,`accessor`,`field`,`value`,`get`,`set`],Jo=e=>e!==void 0&&typeof e!=`function`?Bo(`Function expected`):e,Yo=(e,t,n,r,i)=>({kind:qo[e],name:t,metadata:r,addInitializer:e=>n._?Bo(`Already initialized`):i.push(Jo(e||null))}),Xo=(e,t)=>Vo(t,zo(`metadata`),e[3]),G=(e,t,n,r)=>{for(var i=0,a=e[t>>1],o=a&&a.length;i<o;i++)t&1?a[i].call(n):r=a[i].call(n,r);return r},Zo=(e,t,n,r,i,a)=>{var o,s,c,l,u,d=t&7,f=!!(t&8),p=!!(t&16),m=d>3?e.length+1:d?f?1:2:0,h=qo[d+5],g=d>3&&(e[m-1]=[]),_=e[m]||(e[m]=[]),v=d&&(!p&&!f&&(i=i.prototype),d<5&&(d>3||!p)&&Po(d<4?i:{get[n](){return K(this,a)},set[n](e){return J(this,a,e)}},n));d?p&&d<4&&Wo(a,(d>2?`set `:d>1?`get `:``)+n):Wo(i,n);for(var y=r.length-1;y>=0;y--)l=Yo(d,n,c={},e[3],_),d&&(l.static=f,l.private=p,u=l.access={has:p?e=>$o(i,e):e=>n in e},d^3&&(u.get=p?e=>(d^1?K:es)(e,i,d^4?a:v.get):e=>e[n]),d>2&&(u.set=p?(e,t)=>J(e,i,t,d^4?a:v.set):(e,t)=>e[n]=t)),s=(0,r[y])(d?d<4?p?a:v[h]:d>4?void 0:{get:v.get,set:v.set}:i,l),c._=1,d^4||s===void 0?Jo(s)&&(d>4?g.unshift(s):d?p?a=s:v[h]=s:i=s):typeof s!=`object`||!s?Bo(`Object expected`):(Jo(o=s.get)&&(v.get=o),Jo(o=s.set)&&(v.set=o),Jo(o=s.init)&&g.unshift(o));return d||Xo(e,i),v&&Mo(i,n,v),p?d^4?a:v:i},Qo=(e,t,n)=>t.has(e)||Bo(`Cannot `+n),$o=(e,t)=>Object(t)===t?e.has(t):Bo(`Cannot use the "in" operator on this value`),K=(e,t,n)=>(Qo(e,t,`read from private field`),n?n.call(e):t.get(e)),q=(e,t,n)=>t.has(e)?Bo(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),J=(e,t,n,r)=>(Qo(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),es=(e,t,n)=>(Qo(e,t,`access private method`),n),ts={role:`button`,roleDescription:`draggable`},ns=`dnd-kit-description`,rs=`dnd-kit-announcement`,is={draggable:`To pick up a draggable item, press the space bar. While dragging, use the arrow keys to move the item in a given direction. Press space again to drop the item in its new position, or press escape to cancel.`},as={dragstart({operation:{source:e}}){if(e)return`Picked up draggable item ${e.id}.`},dragover({operation:{source:e,target:t}}){if(!(!e||e.id===t?.id))return t?`Draggable item ${e.id} was moved over droppable target ${t.id}.`:`Draggable item ${e.id} is no longer over a droppable target.`},dragend({operation:{source:e,target:t},canceled:n}){if(e)return n?`Dragging was cancelled. Draggable item ${e.id} was dropped.`:t?`Draggable item ${e.id} was dropped over droppable target ${t.id}`:`Draggable item ${e.id} was dropped.`}};function os(e){let t=e.tagName.toLowerCase();return[`input`,`select`,`textarea`,`a`,`button`].includes(t)}function ss(e,t){let n=document.createElement(`div`);return n.id=e,n.style.setProperty(`display`,`none`),n.textContent=t,n}function cs(e){let t=document.createElement(`div`);return t.id=e,t.setAttribute(`role`,`status`),t.setAttribute(`aria-live`,`polite`),t.setAttribute(`aria-atomic`,`true`),t.style.setProperty(`position`,`fixed`),t.style.setProperty(`width`,`1px`),t.style.setProperty(`height`,`1px`),t.style.setProperty(`margin`,`-1px`),t.style.setProperty(`border`,`0`),t.style.setProperty(`padding`,`0`),t.style.setProperty(`overflow`,`hidden`),t.style.setProperty(`clip`,`rect(0 0 0 0)`),t.style.setProperty(`clip-path`,`inset(100%)`),t.style.setProperty(`white-space`,`nowrap`),t}var ls=[`dragover`,`dragmove`],us=class extends I{constructor(e,t){super(e);let{id:n,idPrefix:{description:r=ns,announcement:i=rs}={},announcements:a=as,screenReaderInstructions:o=is,debounce:s=500}=t??{},c=n?`${r}-${n}`:Eo(r),l=n?`${i}-${n}`:Eo(i),u,d,f,p,m=(e=p)=>{!f||!e||f?.nodeValue!==e&&(f.nodeValue=e)},h=()=>La.schedule(m),g=ds(h,s),_=Object.entries(a).map(([e,t])=>this.manager.monitor.addEventListener(e,(n,r)=>{let i=f;if(!i)return;let a=t?.(n,r);a&&i.nodeValue!==a&&(p=a,ls.includes(e)?g():(h(),g.cancel()))})),v=()=>{let e=[];u?.isConnected||(u=ss(c,o.draggable),e.push(u)),d?.isConnected||(d=cs(l),f=document.createTextNode(``),d.appendChild(f),e.push(d)),e.length>0&&document.body.append(...e)},y=new Set;function b(){for(let e of y)e()}this.registerEffect(()=>{y.clear();for(let e of this.manager.registry.draggables.value){let t=e.handle??e.element;if(t){(!u||!d)&&y.add(v),(!os(t)||Bi())&&!t.hasAttribute(`tabindex`)&&y.add(()=>t.setAttribute(`tabindex`,`0`)),!t.hasAttribute(`role`)&&t.tagName.toLowerCase()!==`button`&&y.add(()=>t.setAttribute(`role`,ts.role)),t.hasAttribute(`aria-roledescription`)||y.add(()=>t.setAttribute(`aria-roledescription`,ts.roleDescription)),t.hasAttribute(`aria-describedby`)||y.add(()=>t.setAttribute(`aria-describedby`,c));for(let n of[`aria-pressed`,`aria-grabbed`]){let r=String(e.isDragging);t.getAttribute(n)!==r&&y.add(()=>t.setAttribute(n,r))}let n=String(e.disabled);t.getAttribute(`aria-disabled`)!==n&&y.add(()=>t.setAttribute(`aria-disabled`,n))}}y.size>0&&La.schedule(b)}),this.destroy=()=>{super.destroy(),u?.remove(),d?.remove(),_.forEach(e=>e())}}};function ds(e,t){let n,r=()=>{clearTimeout(n),n=setTimeout(e,t)};return r.cancel=()=>clearTimeout(n),r}var fs=new Map,ps,ms,hs,gs,_s,vs,ys,bs,xs,Ss,Cs,ws,Ts,Es=class extends (_s=zn,gs=[E],hs=[D],ms=[D],ps=[D],_s){constructor(e,t){super(e,t),G(ys,5,this),q(this,xs),q(this,vs,new Set),q(this,bs,G(ys,8,this,new Set)),G(ys,11,this),this.registerEffect(es(this,xs,Ss))}register(e){return K(this,vs).add(e),()=>{K(this,vs).delete(e)}}addRoot(e){return S(()=>{let t=new Set(this.additionalRoots);t.add(e),this.additionalRoots=t}),()=>{S(()=>{let t=new Set(this.additionalRoots);t.delete(e),this.additionalRoots=t})}}get sourceRoot(){let{source:e}=this.manager.dragOperation;return Ui(e?.element??null)}get targetRoot(){let{target:e}=this.manager.dragOperation;return Ui(e?.element??null)}get roots(){let{status:e}=this.manager.dragOperation;if(e.initializing||e.initialized){let e=[this.sourceRoot,this.targetRoot].filter(e=>e!=null);return new Set([...e,...this.additionalRoots])}return new Set}};ys=Ko(_s),vs=new WeakMap,bs=new WeakMap,xs=new WeakSet,Ss=function(){let{roots:e}=this,t=[];for(let n of e)for(let e of K(this,vs))t.push(es(this,xs,Cs).call(this,n,e));return()=>{for(let e of t)e()}},Cs=function(e,t){let n=fs.get(e);n||(n=new Map,fs.set(e,n));let r=n.get(t);if(!r){let i=ki(e)?es(this,xs,ws).call(this,e,n,t):es(this,xs,Ts).call(this,e,n,t);if(!i)return()=>{};r=i,n.set(t,r)}r.refCount++;let i=!1;return()=>{i||(i=!0,r.refCount--,r.refCount===0&&r.cleanup())}},ws=function(e,t,n){let r=e.createElement(`style`),{nonce:i}=this.options??{};i&&r.setAttribute(`nonce`,i),r.textContent=n,e.head.prepend(r);let a=new MutationObserver(t=>{for(let n of t)for(let t of Array.from(n.removedNodes))if(t===r){e.head.prepend(r);return}});return a.observe(e.head,{childList:!0}),{refCount:0,cleanup:()=>{a.disconnect(),r.remove(),t.delete(n),t.size===0&&fs.delete(e)}}},Ts=function(e,t,n){`adoptedStyleSheets`in e&&Array.isArray(e.adoptedStyleSheets);let{CSSStyleSheet:r}=e.ownerDocument.defaultView??{};if(!r)return null;let i=new r;return i.replaceSync(n),e.adoptedStyleSheets.push(i),{refCount:0,cleanup:()=>{if(Hi(e)&&e.host?.isConnected){let t=e.adoptedStyleSheets.indexOf(i);t!==-1&&e.adoptedStyleSheets.splice(t,1)}t.delete(n),t.size===0&&fs.delete(e)}}},Zo(ys,4,`additionalRoots`,gs,Es,bs),Zo(ys,2,`sourceRoot`,hs,Es),Zo(ys,2,`targetRoot`,ms,Es),Zo(ys,2,`roots`,ps,Es),Xo(ys,Es),Es.configure=Nn(Es);var Ds=Es,Os=class extends I{constructor(e,t){super(e,t),this.manager=e;let{cursor:n=`grabbing`}=t??{},r=e.registry.plugins.get(Ds)?.register(`* { cursor: ${n} !important; }`);if(r){let e=this.destroy.bind(this);this.destroy=()=>{r(),e()}}}},ks=`data-dnd-`,As=`${ks}dropping`,Y=`--dnd-`,js=`${ks}dragging`,Ms=`${ks}placeholder`,Ns=[js,Ms,`popover`,`aria-pressed`,`aria-grabbing`],Ps=[`view-transition-name`],Fs=`
  :is(:root,:host) [${js}] {
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

  :is(:root,:host) [${Ms}] {
    transition: none;
  }

  :is(:root,:host) [${Ms}='hidden'] {
    visibility: hidden;
  }

  [${js}] * {
    pointer-events: none !important;
  }

  [${js}]:not([${As}]) {
    translate: var(${Y}translate) !important;
  }

  [${js}][style*='${Y}scale'] {
    scale: var(${Y}scale) !important;
    transform-origin: var(${Y}transform-origin) !important;
  }

  @layer dnd-kit {
    :where([${js}][popover]) {
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
  [${js}]::backdrop, [${ks}overlay]:not([${js}]) {
    display: none;
    visibility: hidden;
  }
`.replace(/\n+/g,` `).replace(/\s+/g,` `).trim();function Is(e,t=`hidden`){return S(()=>{let{element:n,manager:r}=e;if(!n||!r)return;let i=Ls(n,r.registry.droppables),a=[],o=Gi(n),{remove:s}=o;return Rs(i,o,a),zs(o,t),o.remove=()=>{a.forEach(e=>e()),s.call(o)},o})}function Ls(e,t){let n=new Map;for(let r of t)if(r.element&&(e===r.element||e.contains(r.element))){let e=`${ks}${Eo(`dom-id`)}`;r.element.setAttribute(e,``),n.set(r,e)}return n}function Rs(e,t,n){for(let[r,i]of e){if(!r.element)continue;let e=`[${i}]`,a=t.matches(e)?t:t.querySelector(e);if(r.element.removeAttribute(i),!a)continue;let o=r.element;r.proxy=a,a.removeAttribute(i),Xi.set(o,a),n.push(()=>{Xi.delete(o),r.proxy=void 0})}}function zs(e,t=`hidden`){e.setAttribute(`inert`,`true`),e.setAttribute(`tab-index`,`-1`),e.setAttribute(`aria-hidden`,`true`),e.setAttribute(Ms,t)}function Bs(e,t){return e===t||$i(e)===$i(t)}function Vs(e){let{target:t}=e;`newState`in e&&e.newState===`closed`&&bo(t)&&t.hasAttribute(`popover`)&&requestAnimationFrame(()=>Ma(t))}function Hs(e){return e.tagName===`TR`}function Us(e,t,n){let r=new MutationObserver(r=>{let i=!1;for(let n of r){if(n.target!==e){i=!0;continue}if(n.type!==`attributes`)continue;let r=n.attributeName;if(r.startsWith(`aria-`)||Ns.includes(r))continue;let a=e.getAttribute(r);if(r===`style`){if(vo(e)&&vo(t)){let n=e.style;for(let e of Array.from(t.style))n.getPropertyValue(e)===``&&t.style.removeProperty(e);for(let e of Array.from(n)){if(Ps.includes(e)||e.startsWith(Y))continue;let r=n.getPropertyValue(e);t.style.setProperty(e,r)}}}else a===null?t.removeAttribute(r):t.setAttribute(r,a)}i&&n&&t.replaceChildren(...e.cloneNode(!0).childNodes)});return r.observe(e,{attributes:!0,subtree:!0,childList:!0}),r}function Ws(e,t,n){let r=new MutationObserver(r=>{for(let i of r)if(i.addedNodes.length!==0)for(let r of Array.from(i.addedNodes)){if(r.contains(e)&&e.nextElementSibling!==t){e.insertAdjacentElement(`afterend`,t),Ma(n);return}if(r.contains(t)&&t.previousElementSibling!==e){t.insertAdjacentElement(`beforebegin`,e),Ma(n);return}}e.isConnected&&t.isConnected&&e.nextElementSibling!==t&&(e.insertAdjacentElement(`afterend`,t),Ma(n))});return r.observe(e.ownerDocument.body,{childList:!0,subtree:!0}),r}function Gs(e){return new ResizeObserver(()=>{var t;let n=new go(e.placeholder,{frameTransform:e.frameTransform,ignoreTransforms:!0}),r=e.transformOrigin??{x:1,y:1},i=(e.width-n.width)*r.x+e.delta.x,a=(e.height-n.height)*r.y+e.delta.y,o=Vi();if(e.styles.set({width:n.width-e.widthOffset,height:n.height-e.heightOffset,top:e.top+a+o.y,left:e.left+i+o.x},Y),(t=e.getElementMutationObserver())==null||t.takeRecords(),Hs(e.element)&&Hs(e.placeholder)){let t=Array.from(e.element.cells),n=Array.from(e.placeholder.cells);e.getSavedCellWidths()||e.setSavedCellWidths(t.map(e=>e.style.width));for(let[e,r]of t.entries()){let t=n[e];r.style.width=`${t.getBoundingClientRect().width}px`}}let s=e.getTranslate()??{x:0,y:0},c=e.left+i+o.x+s.x,l=e.top+a+o.y+s.y,u=n.width-e.widthOffset,d=n.height-e.heightOffset,f=e.frameTransform;e.dragOperation.shape=new Zt(c*f.scaleX+f.x,l*f.scaleY+f.y,u*f.scaleX,d*f.scaleY)})}var Ks=250,qs=`ease`;function Js(e){var t;let{animation:n}=e;if(typeof n==`function`){let t=n({source:e.source,element:e.element,feedbackElement:e.feedbackElement,placeholder:e.placeholder,translate:e.translate,moved:e.moved});Promise.resolve(t).then(()=>{e.cleanup(),requestAnimationFrame(e.restoreFocus)});return}let{duration:r=Ks,easing:i=qs}=n??{};Ma(e.feedbackElement);let[,a]=Ti(e.feedbackElement,e=>`translate`in e)??[];a?.pause();let o=e.placeholder??e.element,s={frameTransform:Bs(e.feedbackElement,o)?null:void 0},c=new go(e.feedbackElement,s),l=Xa(Va(e.feedbackElement).translate)??e.translate,u=new go(o,s),d=Zt.delta(c,u,e.alignment),f={x:l.x-d.x,y:l.y-d.y},p=Math.round(c.intrinsicHeight)===Math.round(u.intrinsicHeight)?{}:{minHeight:[`${c.intrinsicHeight}px`,`${u.intrinsicHeight}px`],maxHeight:[`${c.intrinsicHeight}px`,`${u.intrinsicHeight}px`]},m=Math.round(c.intrinsicWidth)===Math.round(u.intrinsicWidth)?{}:{minWidth:[`${c.intrinsicWidth}px`,`${u.intrinsicWidth}px`],maxWidth:[`${c.intrinsicWidth}px`,`${u.intrinsicWidth}px`]};e.styles.set({transition:e.transition},Y),e.feedbackElement.setAttribute(As,``),(t=e.getElementMutationObserver())==null||t.takeRecords(),co({element:e.feedbackElement,keyframes:Uo(Ho(Ho({},p),m),{translate:[`${l.x}px ${l.y}px 0`,`${f.x}px ${f.y}px 0`]}),options:{duration:Wi(U(e.feedbackElement))?0:e.moved||e.feedbackElement!==e.element?r:0,easing:i}}).then(()=>{e.feedbackElement.removeAttribute(As),a?.finish(),e.cleanup(),requestAnimationFrame(e.restoreFocus)})}var Ys,Xs,Zs,Qs,$s,ec,tc,nc=class extends (Xs=I,Ys=[E],Xs){constructor(e,t){super(e,t),q(this,$s),q(this,Qs,G(Zs,8,this)),G(Zs,11,this),this.state={initial:{},current:{}};let n=e.registry.plugins.get(Ds),r=n?.register(Fs);if(r){let e=this.destroy.bind(this);this.destroy=()=>{r(),e()}}this.registerEffect(es(this,$s,ec).bind(this,n)),this.registerEffect(es(this,$s,tc))}};Zs=Ko(Xs),Qs=new WeakMap,$s=new WeakSet,ec=function(e){let{overlay:t}=this;if(!t||!e)return;let n=Ui(t);if(n)return e.addRoot(n)},tc=function(){let{state:e,manager:t,options:n}=this,{dragOperation:r}=t,{position:i,source:a,status:o}=r;if(o.idle){e.current={},e.initial={};return}if(!a)return;let{element:s}=a,c=a.pluginConfig(nc),l=c?.feedback??n?.feedback??`default`,u=typeof l==`function`?l(a,t):l;if(!s||u===`none`||!o.initialized||o.initializing)return;let{initial:d}=e,f=this.overlay??s,p=qa(f),m=qa(s),h=!Bs(s,f),g=new go(s,{frameTransform:h?m:null,ignoreTransforms:!h}),_={x:m.scaleX/p.scaleX,y:m.scaleY/p.scaleY},{width:v,height:y,top:b,left:ee}=g;h&&(v/=_.x,y/=_.y);let te=new yo(f),ne=Va(s),{transition:re,translate:ie,boxSizing:ae,paddingBlockStart:oe,paddingBlockEnd:se,paddingInlineStart:ce,paddingInlineEnd:le,borderInlineStartWidth:x,borderInlineEndWidth:ue,borderBlockStartWidth:de,borderBlockEndWidth:fe}=ne,pe=re.split(`,`).filter(e=>!/^\s*(transform|translate|scale)\b/.test(e)).join(`,`),me=Za(ne),he=ne.transform,ge=u===`clone`,_e=ae===`content-box`,C=_e?parseInt(ce)+parseInt(le)+parseInt(x)+parseInt(ue):0,ve=_e?parseInt(oe)+parseInt(se)+parseInt(de)+parseInt(fe):0,w=u!==`move`&&!this.overlay?Is(a,ge?`clone`:`hidden`):null,ye=S(()=>xo(t.dragOperation.activatorEvent));if(!d.translate){if(this.overlay&&me)d.translate={x:me.x,y:me.y};else if(ie!==`none`){let e=Xa(ie);e&&(d.translate=e)}}if(!d.transformOrigin){let e=S(()=>i.current),t=ee+(me?.x??0),n=b+(me?.y??0);d.transformOrigin={x:(e.x-t*p.scaleX-p.x)/(v*p.scaleX),y:(e.y-n*p.scaleY-p.y)/(y*p.scaleY)}}let{transformOrigin:be}=d,xe=b*p.scaleY+p.y,Se=ee*p.scaleX+p.x;if(!d.coordinates&&(d.coordinates={x:Se,y:xe},_.x!==1||_.y!==1)){let{scaleX:e,scaleY:t}=m,{x:n,y:r}=be;d.coordinates.x+=(v*e-v)*n,d.coordinates.y+=(y*t-y)*r}d.dimensions||={width:v,height:y},d.frameTransform||=p;let Ce={x:d.coordinates.x-Se,y:d.coordinates.y-xe},we={width:(d.dimensions.width*d.frameTransform.scaleX-v*p.scaleX)*be.x,height:(d.dimensions.height*d.frameTransform.scaleY-y*p.scaleY)*be.y},Te={x:Ce.x/p.scaleX+we.width,y:Ce.y/p.scaleY+we.height},Ee={left:ee+Te.x,top:b+Te.y};f.setAttribute(js,`true`);let T=S(()=>r.transform),De=d.translate??{x:0,y:0},Oe=T.x*p.scaleX+De.x,ke=T.y*p.scaleY+De.y,Ae=Vi();te.set({width:v-C,height:y-ve,top:Ee.top+Ae.y,left:Ee.left+Ae.x,translate:`${Oe}px ${ke}px 0`,transform:this.overlay?`none`:he,transition:pe?`${pe}, translate 0ms linear`:`translate 0ms linear`,scale:h?`${_.x} ${_.y}`:``,"transform-origin":`${be.x*100}% ${be.y*100}%`},Y),w&&(s.insertAdjacentElement(`afterend`,w),n?.rootElement&&(typeof n.rootElement==`function`?n.rootElement(a):n.rootElement).appendChild(s)),ja(f)&&(f.hasAttribute(`popover`)||f.setAttribute(`popover`,`manual`),Ma(f),f.addEventListener(`beforetoggle`,Vs));let je,Me,Ne,Pe=Gs({placeholder:w,element:s,feedbackElement:f,frameTransform:p,transformOrigin:be,width:v,height:y,top:b,left:ee,widthOffset:C,heightOffset:ve,delta:Te,styles:te,dragOperation:r,getTranslate:()=>e.current.translate,getElementMutationObserver:()=>je,getSavedCellWidths:()=>Ne,setSavedCellWidths:e=>{Ne=e}}),Fe=new go(f);S(()=>r.shape=Fe);let Ie=U(f),Le=e=>{this.manager.actions.stop({event:e})},Re=Wi(Ie);ye&&Ie.addEventListener(`resize`,Le),S(()=>a.status)===`idle`&&requestAnimationFrame(()=>a.status=`dragging`),w&&(Pe.observe(w),je=Us(s,w,ge),Me=Ws(s,w,f));let ze=t.dragOperation.source?.id,Be=()=>{if(!ye||ze==null)return;let e=t.registry.draggables.get(ze),n=e?.handle??e?.element;Ai(n)&&n.focus()},Ve=()=>{if(je?.disconnect(),Me?.disconnect(),Pe.disconnect(),Ie.removeEventListener(`resize`,Le),ja(f)&&(f.removeEventListener(`beforetoggle`,Vs),f.removeAttribute(`popover`)),f.removeAttribute(js),te.reset(),Ne&&Hs(s)){let e=Array.from(s.cells);for(let[t,n]of e.entries())n.style.width=Ne[t]??``}a.status=`idle`;let t=e.current.translate!=null,n=r.status.dragging;w&&(!n&&t||w.parentElement!==f.parentElement)&&f.isConnected&&w.replaceWith(f),w?.remove()},He=n?.dropAnimation,Ue=this,We=rt(()=>{let{transform:t,status:i}=r;if(!(!t.x&&!t.y&&!e.current.translate)&&i.dragging){let i=d.translate??{x:0,y:0},a={x:t.x/p.scaleX+i.x,y:t.y/p.scaleY+i.y},o=e.current.translate,s=S(()=>r.modifiers),c=S(()=>r.shape?.current),l=n?.keyboardTransition,u=ye&&!Re&&l!==null?`${l?.duration??250}ms ${l?.easing??`cubic-bezier(0.25, 1, 0.5, 1)`}`:`0ms linear`;if(te.set({transition:pe?`${pe}, translate ${u}`:`translate ${u}`,translate:`${a.x}px ${a.y}px 0`},Y),je?.takeRecords(),c&&c!==Fe&&o&&!s.length){let e=A.delta(a,o);r.shape=Zt.from(c.boundingRectangle).translate(e.x*p.scaleX,e.y*p.scaleY)}else r.shape=new go(f);e.current.translate=a}},function(){if(r.status.dropped){this.dispose(),a.status=`dropping`;let n=c?.dropAnimation===void 0?Ue.dropAnimation===void 0?He:Ue.dropAnimation:c.dropAnimation,r=e.current.translate,i=r!=null;if(!r&&s!==f&&(r={x:0,y:0}),!r||n===null){Ve();return}t.renderer.rendering.then(()=>{Js({source:a,element:s,feedbackElement:f,placeholder:w,translate:r,moved:i,transition:re,alignment:a.alignment,styles:te,animation:n??void 0,getElementMutationObserver:()=>je,cleanup:Ve,restoreFocus:Be})})}});return()=>{Ve(),We()}},Zo(Zs,4,`overlay`,Ys,nc,Qs),Xo(Zs,nc),nc.configure=Nn(nc);var rc=nc,ic=!0,ac=!1,oc,sc,cc,lc=(cc=[E],$a.Forward),uc,dc,fc;sc=(oc=[E],$a.Reverse);var pc=class{constructor(){q(this,dc,G(uc,8,this,ic)),G(uc,11,this),q(this,fc,G(uc,12,this,ic)),G(uc,15,this)}isLocked(e){return e===$a.Idle?!1:e==null?this[$a.Forward]===ic&&this[$a.Reverse]===ic:this[e]===ic}unlock(e){e!==$a.Idle&&(this[e]=ac)}};uc=Ko(null),dc=new WeakMap,fc=new WeakMap,Zo(uc,4,lc,cc,pc,dc),Zo(uc,4,sc,oc,pc,fc),Xo(uc,pc);var mc=[$a.Forward,$a.Reverse],hc=class{constructor(){this.x=new pc,this.y=new pc}isLocked(){return this.x.isLocked()&&this.y.isLocked()}},gc=class extends I{constructor(e){super(e);let t=ve(new hc),n=null;this.signal=t,T(()=>{let{status:r}=e.dragOperation;if(!r.initialized){n=null,t.value=new hc;return}let{delta:i}=e.dragOperation.position;if(n){let e={x:_c(i.x,n.x),y:_c(i.y,n.y)},r=t.peek();ce(()=>{for(let t of cn)for(let n of mc)e[t]===n&&r[t].unlock(n);t.value=r})}n=i})}get current(){return this.signal.peek()}};function _c(e,t){return Math.sign(e-t)}var vc,yc,bc,xc,Sc,Cc,wc=class extends (yc=zn,vc=[E],yc){constructor(e){super(e),q(this,xc,G(bc,8,this,!1)),G(bc,11,this),q(this,Sc),q(this,Cc,()=>{if(!K(this,Sc))return;let{element:e,by:t}=K(this,Sc);t.y&&(e.scrollTop+=t.y),t.x&&(e.scrollLeft+=t.x)}),this.scroll=(e,t)=>{if(this.disabled)return!1;let n=this.getScrollableElements();if(!n)return J(this,Sc,void 0),!1;let{position:r}=this.manager.dragOperation,i=r?.current;if(i){let{by:r}=e??{},a=r?{x:Tc(r.x),y:Tc(r.y)}:void 0,o=a?void 0:this.scrollIntentTracker.current;if(o?.isLocked())return!1;for(let e of n){let n=Fa(e,r);if(n.x||n.y){let{speed:n,direction:s}=no(e,i,a,t?.acceleration,t?.threshold);if(o)for(let e of cn)o[e].isLocked(s[e])&&(n[e]=0,s[e]=0);if(s.x||s.y){let{x:t,y:i}=r??s,a=t*n.x,o=i*n.y;if(a||o){let t=K(this,Sc)?.by;if(this.autoScrolling&&t&&(t.x&&!a||t.y&&!o))continue;return J(this,Sc,{element:e,by:{x:a,y:o}}),La.schedule(K(this,Cc)),!0}}}}}return J(this,Sc,void 0),!1};let t=null,n=null,r=et(()=>{let{position:n,source:r}=e.dragOperation;if(!n)return null;let i=Ji(Ui(r?.element),n.current);return i&&(t=i),i??t}),i=et(()=>{let t=r.value,{documentElement:i}=Mi(t);if(!t||t===i){let{target:t}=e.dragOperation,r=t?.element;if(r){let e=Ka(r,{excludeElement:!1});return n=e,e}}if(t){let e=Ka(t,{excludeElement:!1});return this.autoScrolling&&n&&e.size<n?.size?n:(n=e,e)}return n=null,null},tt);this.getScrollableElements=()=>i.value,this.scrollIntentTracker=new gc(e),this.destroy=e.monitor.addEventListener(`dragmove`,t=>{this.disabled||t.defaultPrevented||!xo(e.dragOperation.activatorEvent)||!t.by||this.scroll({by:t.by})&&t.preventDefault()})}};bc=Ko(yc),xc=new WeakMap,Sc=new WeakMap,Cc=new WeakMap,Zo(bc,4,`autoScrolling`,vc,wc,xc),Xo(bc,wc);function Tc(e){return e>0?$a.Forward:e<0?$a.Reverse:$a.Idle}var Ec=new class{constructor(e){this.scheduler=e,this.pending=!1,this.tasks=new Set,this.resolvers=new Set,this.flush=()=>{let{tasks:e,resolvers:t}=this;this.pending=!1,this.tasks=new Set,this.resolvers=new Set;for(let t of e)t();for(let e of t)e()}}schedule(e){return this.tasks.add(e),this.pending||(this.pending=!0,this.scheduler(this.flush)),new Promise(e=>this.resolvers.add(e))}}(e=>{typeof requestAnimationFrame==`function`?requestAnimationFrame(e):e()}),Dc=10,Oc=class extends I{constructor(e,t){super(e,t);let n=e.registry.plugins.get(wc);if(!n)throw Error(`AutoScroller plugin depends on Scroller plugin`);this.destroy=T(()=>{if(this.disabled)return;let{position:t,status:r}=e.dragOperation;if(r.dragging){let e={acceleration:this.options?.acceleration,threshold:typeof this.options?.threshold==`number`?{x:this.options.threshold,y:this.options.threshold}:this.options?.threshold};if(n.scroll(void 0,e)){n.autoScrolling=!0;let t=setInterval(()=>Ec.schedule(()=>n.scroll(void 0,e)),Dc);return()=>{clearInterval(t)}}n.autoScrolling=!1}})}};Oc.configure=Nn(Oc);var kc=Oc,Ac={capture:!0,passive:!0},jc,Mc=class extends zn{constructor(e){super(e),q(this,jc),this.handleScroll=()=>{K(this,jc)??J(this,jc,setTimeout(()=>{this.manager.collisionObserver.forceUpdate(!1),J(this,jc,void 0)},50))};let{dragOperation:t}=this.manager;this.destroy=T(()=>{if(t.status.dragging){let e=t.source?.element?.ownerDocument??document;return e.addEventListener(`scroll`,this.handleScroll,Ac),()=>{e.removeEventListener(`scroll`,this.handleScroll,Ac)}}})}};jc=new WeakMap;var Nc=`* { user-select: none !important; -webkit-user-select: none !important; }`,Pc=class extends I{constructor(e){super(e),this.manager=e;let t=e.registry.plugins.get(Ds)?.register(Nc);if(this.destroy=T(()=>{let{dragOperation:e}=this.manager;if(e.status.initialized)return Fc(),document.addEventListener(`selectionchange`,Fc,{capture:!0}),()=>{document.removeEventListener(`selectionchange`,Fc,{capture:!0})}}),t){let e=this.destroy.bind(this);this.destroy=()=>{t(),e()}}}};function Fc(){var e;(e=document.getSelection())==null||e.removeAllRanges()}var Ic=Object.freeze({offset:10,keyboardCodes:{start:[`Space`,`Enter`],cancel:[`Escape`],end:[`Space`,`Enter`,`Tab`],up:[`ArrowUp`],down:[`ArrowDown`],left:[`ArrowLeft`],right:[`ArrowRight`]},preventActivation(e,t){let n=t.handle??t.element;return e.target!==n}}),Lc,Rc=class extends qr{constructor(e,t){super(e),this.manager=e,this.options=t,q(this,Lc,[]),this.listeners=new Qi,this.handleSourceKeyDown=(e,t,n)=>{if(this.disabled||e.defaultPrevented||!bo(e.target)||t.disabled)return;let{keyboardCodes:r=Ic.keyboardCodes,preventActivation:i=Ic.preventActivation}=n??{};r.start.includes(e.code)&&this.manager.dragOperation.status.idle&&(i?.(e,t)||this.handleStart(e,t,n))}}bind(e,t=this.options){return T(()=>{let n=e.handle??e.element,r=n=>{xo(n)&&this.handleSourceKeyDown(n,e,t)};if(n)return n.addEventListener(`keydown`,r),()=>{n.removeEventListener(`keydown`,r)}})}handleStart(e,t,n){let{element:r}=t;if(!r)throw Error(`Source draggable does not have an associated element`);e.preventDefault(),e.stopImmediatePropagation(),ro(r);let{center:i}=new go(r);if(this.manager.actions.start({event:e,coordinates:{x:i.x,y:i.y},source:t}).signal.aborted)return this.cleanup();this.sideEffects();let a=Mi(r),o=[this.listeners.bind(a,[{type:`keydown`,listener:e=>this.handleKeyDown(e,t,n),options:{capture:!0}}])];K(this,Lc).push(...o)}handleKeyDown(e,t,n){let{keyboardCodes:r=Ic.keyboardCodes}=n??{};if(Bc(e,[...r.end,...r.cancel])){e.preventDefault();let t=Bc(e,r.cancel);this.handleEnd(e,t);return}Bc(e,r.up)?this.handleMove(`up`,e):Bc(e,r.down)&&this.handleMove(`down`,e),Bc(e,r.left)?this.handleMove(`left`,e):Bc(e,r.right)&&this.handleMove(`right`,e)}handleEnd(e,t){this.manager.actions.stop({event:e,canceled:t}),this.cleanup()}handleMove(e,t){let{shape:n}=this.manager.dragOperation,r=t.shiftKey?5:1,i={x:0,y:0},a=this.options?.offset??Ic.offset;if(typeof a==`number`&&(a={x:a,y:a}),n){switch(e){case`up`:i={x:0,y:-a.y*r};break;case`down`:i={x:0,y:a.y*r};break;case`left`:i={x:-a.x*r,y:0};break;case`right`:i={x:a.x*r,y:0}}(i.x||i.y)&&(t.preventDefault(),this.manager.actions.move({event:t,by:i}))}}sideEffects(){let e=this.manager.registry.plugins.get(kc);e?.disabled===!1&&(e.disable(),K(this,Lc).push(()=>{e.enable()}))}cleanup(){K(this,Lc).forEach(e=>e()),J(this,Lc,[])}destroy(){this.cleanup(),this.listeners.clear()}};Lc=new WeakMap,Rc.configure=Nn(Rc),Rc.defaults=Ic;var zc=Rc;function Bc(e,t){return t.includes(e.code)}var Vc,Hc=class extends Xr{constructor(){super(...arguments),q(this,Vc)}onEvent(e){switch(e.type){case`pointerdown`:J(this,Vc,Li(e));break;case`pointermove`:if(!K(this,Vc))return;let{x:t,y:n}=Li(e),r={x:t-K(this,Vc).x,y:n-K(this,Vc).y},{tolerance:i}=this.options;if(i&&on(r,i)){this.abort();return}on(r,this.options.value)&&this.activate(e);break;case`pointerup`:this.abort()}}abort(){J(this,Vc,void 0)}};Vc=new WeakMap;var Uc,Wc,Gc=class extends Xr{constructor(){super(...arguments),q(this,Uc),q(this,Wc)}onEvent(e){switch(e.type){case`pointerdown`:J(this,Wc,Li(e)),J(this,Uc,setTimeout(()=>this.activate(e),this.options.value));break;case`pointermove`:if(!K(this,Wc))return;let{x:t,y:n}=Li(e);on({x:t-K(this,Wc).x,y:n-K(this,Wc).y},this.options.tolerance)&&this.abort();break;case`pointerup`:this.abort()}}abort(){K(this,Uc)&&(clearTimeout(K(this,Uc)),J(this,Wc,void 0),J(this,Uc,void 0))}};Uc=new WeakMap,Wc=new WeakMap;var Kc=class{};Kc.Delay=Gc,Kc.Distance=Hc;var qc=Object.freeze({activationConstraints(e,t){let{pointerType:n,target:r}=e;if(!(n===`mouse`&&bo(r)&&(t.handle===r||t.handle?.contains(r))))return n===`touch`?[new Kc.Delay({value:250,tolerance:5})]:Co(r)&&!e.defaultPrevented?[new Kc.Delay({value:200,tolerance:0})]:[new Kc.Delay({value:200,tolerance:10}),new Kc.Distance({value:5})]},preventActivation(e,t){let{target:n}=e;return n===t.element||n===t.handle||!bo(n)||t.handle?.contains(n)?!1:Zi(n)}}),Jc,Yc=class extends qr{constructor(e,t){super(e),this.manager=e,this.options=t,q(this,Jc,new Set),this.listeners=new Qi,this.latest={event:void 0,coordinates:void 0},this.handleMove=()=>{let{event:e,coordinates:t}=this.latest;!e||!t||this.manager.actions.move({event:e,to:t})},this.handleCancel=this.handleCancel.bind(this),this.handlePointerUp=this.handlePointerUp.bind(this),this.handleKeyDown=this.handleKeyDown.bind(this)}activationConstraints(e,t,n=this.options){let{activationConstraints:r=qc.activationConstraints}=n??{};return typeof r==`function`?r(e,t):r}bind(e,t=this.options){return T(()=>{let n=new AbortController,{signal:r}=n,i=n=>{So(n)&&this.handlePointerDown(n,e,t)},a=[e.handle??e.element];t?.activatorElements&&(a=Array.isArray(t.activatorElements)?t.activatorElements:t.activatorElements(e));for(let e of a)e&&(tl(e.ownerDocument.defaultView),e.addEventListener(`pointerdown`,i,{signal:r}));return()=>n.abort()})}handlePointerDown(e,t,n){if(this.disabled||!e.isPrimary||e.button!==0||!bo(e.target)||t.disabled||Zc(e)||!this.manager.dragOperation.status.idle)return;let{preventActivation:r=qc.preventActivation}=n??{};if(r?.(e,t))return;let{target:i}=e,a=Ai(i)&&i.draggable&&i.getAttribute(`draggable`)===`true`,o=qa(t.element),{x:s,y:c}=Li(e);this.initialCoordinates={x:s*o.scaleX+o.x,y:c*o.scaleY+o.y};let l=this.activationConstraints(e,t,n);e.sensor=this;let u=new Jr(l,e=>this.handleStart(t,e));u.signal.onabort=()=>this.handleCancel(e),u.onEvent(e),this.controller=u;let d=zi(),f=this.listeners.bind(d,[{type:`pointermove`,listener:e=>this.handlePointerMove(e,t)},{type:`pointerup`,listener:this.handlePointerUp,options:{capture:!0}},{type:`pointercancel`,listener:this.handleCancel},{type:`dragstart`,listener:a?this.handleCancel:Qc,options:{capture:!0}}]);K(this,Jc).add(()=>{f(),this.initialCoordinates=void 0})}handlePointerMove(e,t){var n;if(this.controller?.activated===!1){(n=this.controller)==null||n.onEvent(e);return}if(this.manager.dragOperation.status.dragging){let n=Li(e),r=qa(t.element);n.x=n.x*r.scaleX+r.x,n.y=n.y*r.scaleY+r.y,e.preventDefault(),e.stopPropagation(),this.latest.event=e,this.latest.coordinates=n,La.schedule(this.handleMove)}}handlePointerUp(e){let{status:t}=this.manager.dragOperation;if(!t.idle){e.preventDefault(),e.stopPropagation();let n=!t.initialized;this.manager.actions.stop({event:e,canceled:n})}this.cleanup()}handleKeyDown(e){e.key===`Escape`&&(e.preventDefault(),this.handleCancel(e))}handleStart(e,t){let{manager:n,initialCoordinates:r}=this;if(!r||!n.dragOperation.status.idle||t.defaultPrevented)return;if(n.actions.start({coordinates:r,event:t,source:e}).signal.aborted)return this.cleanup();t.preventDefault();let i=Mi(t.target).body;try{i.setPointerCapture(t.pointerId)}catch{this.handleCancel(t);return}let a=bo(t.target)?[t.target,i]:i,o=this.listeners.bind(a,[{type:`touchmove`,listener:Qc,options:{passive:!1}},{type:`click`,listener:Qc},{type:`contextmenu`,listener:Qc},{type:`keydown`,listener:this.handleKeyDown}]);K(this,Jc).add(o)}handleCancel(e){let{dragOperation:t}=this.manager;t.status.initialized&&this.manager.actions.stop({event:e,canceled:!0}),this.cleanup()}cleanup(){let{controller:e}=this;this.controller=void 0,e&&!e.signal.aborted&&e.abort(),this.latest={event:void 0,coordinates:void 0},K(this,Jc).forEach(e=>e()),K(this,Jc).clear()}destroy(){this.cleanup(),this.listeners.clear()}};Jc=new WeakMap,Yc.configure=Nn(Yc),Yc.defaults=qc;var Xc=Yc;function Zc(e){return`sensor`in e}function Qc(e){e.preventDefault()}function $c(){}var el=new WeakSet;function tl(e){!e||el.has(e)||(e.addEventListener(`touchmove`,$c,{capture:!1,passive:!1}),el.add(e))}var nl={modifiers:[],plugins:[us,kc,Os,rc,Pc],sensors:[Xc,zc]},rl=class extends bi{constructor(e={}){let t=yi(e.plugins,nl.plugins),n=yi(e.sensors,nl.sensors),r=yi(e.modifiers,nl.modifiers);super(Uo(Ho({},e),{plugins:[Mc,wc,Ds,...t],sensors:n,modifiers:r}))}},il,al,ol,sl,cl,ll,ul=class extends (ol=gr,al=[E],il=[E],ol){constructor(e,t){var n=e,{element:r,effects:i=()=>[],handle:a}=n,o=Go(n,[`element`,`effects`,`handle`]);super(Ho({effects:()=>[...i(),()=>{let{manager:e}=this;if(!e)return;let t=(this.sensors?.map(Pn)??[...e.sensors]).map(t=>{let n=t instanceof qr?t:e.registry.register(t.plugin),r=t instanceof qr?void 0:t.options;return n.bind(this,r)});return function(){t.forEach(e=>e())}}]},o),t),q(this,cl,G(sl,8,this)),G(sl,11,this),q(this,ll,G(sl,12,this)),G(sl,15,this),this.element=r,this.handle=a}};sl=Ko(ol),cl=new WeakMap,ll=new WeakMap,Zo(sl,4,`handle`,al,ul,cl),Zo(sl,4,`element`,il,ul,ll),Xo(sl,ul);var dl,fl,pl,ml,hl,gl,_l,vl,yl,bl,xl=class extends (pl=kr,fl=[E],dl=[E],pl){constructor(e,t){var n=e,{element:r,effects:i=()=>[]}=n,a=Go(n,[`element`,`effects`]);let{collisionDetector:o=ko}=a,s=e=>{let{manager:t,element:n}=this;if(!n||e===null){this.shape=void 0;return}if(!t)return;let r=new go(n),i=S(()=>this.shape);return r&&i?.equals(r)?i:(this.shape=r,r)},c=ve(!1);super(Uo(Ho({},a),{collisionDetector:o,effects:()=>[...i(),()=>{let{element:e,manager:t}=this;if(!t)return;let{dragOperation:n}=t,{source:r}=n;c.value=!!(r&&n.status.initialized&&e&&!this.disabled&&this.accepts(r))},()=>{let{element:e}=this;if(c.value&&e){let t=new Aa(e,s);return()=>{t.disconnect(),this.shape=void 0}}},()=>{if(this.manager?.dragOperation.status.initialized)return()=>{this.shape=void 0}}]}),t),q(this,yl),q(this,hl,G(ml,8,this)),G(ml,11,this),q(this,bl,G(ml,12,this)),G(ml,15,this),this.element=r,this.refreshShape=()=>s()}set element(e){J(this,yl,e,vl)}get element(){return this.proxy??K(this,yl,_l)}};ml=Ko(pl),hl=new WeakMap,yl=new WeakSet,bl=new WeakMap,gl=Zo(ml,20,`#element`,fl,yl,hl),_l=gl.get,vl=gl.set,Zo(ml,4,`proxy`,dl,xl,bl),Xo(ml,xl);var Sl=new Map;function Cl(e,n,r){let i=n.flatMap(e=>Array.isArray(e)?e:[e]).map(e=>`cssText`in e&&typeof e.cssText==`string`?e.cssText:t(e).cssText).join(`
`);if(!(`adoptedStyleSheets`in Document.prototype)||typeof CSSStyleSheet>`u`){let t=r??String(n.length);if(!e.querySelector(`style[data-pk-adopted-styles="${t}"]`)){let n=document.createElement(`style`);n.dataset.pkAdoptedStyles=t,n.textContent=i,e.prepend(n)}return}let a=r??i,o=Sl.get(a);o||(o=new CSSStyleSheet,o.replaceSync(i),Sl.set(a,o)),e.adoptedStyleSheets=[...e.adoptedStyleSheets,o]}var wl=b`
    @layer pk-component {
        :host {
            display: inline-block;
            vertical-align: middle;
        }
    }
`;b`
    .pk-focus-ring:focus {
        outline: none;
    }

    .pk-focus-ring:focus-visible {
        box-shadow: var(--pk-shadow-focus);
    }
`;var Tl=b`
    @layer pk-reset {
        :host {
            box-sizing: border-box;
        }

        :host *,
        :host *::before,
        :host *::after {
            box-sizing: border-box;
        }

        :host(:not([hidden])) {
            /* Prevent UA / CP margin on unstyled custom element hosts in light DOM. */
            margin: 0;
        }
    }
`,El=class extends te{constructor(...e){super(...e),this.pkRenderFailed=!1}static{this.shadowRootOptions={mode:`open`,delegatesFocus:!0}}connectedCallback(){super.connectedCallback(),this.hasAttribute(`data-pk`)||this.setAttribute(`data-pk`,``)}createRenderRoot(){let e=super.createRenderRoot();return Cl(e,[Tl],`pk-shadow-reset`),e}performUpdate(){if(!this.pkRenderFailed)try{let e=super.performUpdate();e instanceof Promise&&e.catch(e=>{this.handleRenderFailure(e)})}catch(e){this.handleRenderFailure(e)}}handleRenderFailure(e){let t=e instanceof Error?e:Error(String(e));this.pkRenderFailed=!0,this.dispatchEvent(new CustomEvent(`pk-error`,{detail:{tagName:this.localName||this.tagName.toLowerCase(),message:t.message,stack:t.stack},bubbles:!0,composed:!0}));try{let e=this.renderRoot;if(e){e.textContent=``;let t=document.createElement(`div`);t.setAttribute(`part`,`error`),t.setAttribute(`role`,`alert`),t.textContent=`This control failed to load.`,e.appendChild(t)}}catch{}}};function X(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var Dl=b`
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
`,Ol=m(class extends d{constructor(e){if(super(e),e.type!==c.ATTRIBUTE||e.name!==`class`||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return` `+Object.keys(e).filter(t=>e[t]).join(` `)+` `}update(e,[t]){if(this.st===void 0){this.st=new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(` `).split(/\s/).filter(e=>e!==``)));for(let e in t)t[e]&&!this.nt?.has(e)&&this.st.add(e);return this.render(t)}let n=e.element.classList;for(let e of this.st)e in t||(n.remove(e),this.st.delete(e));for(let e in t){let r=!!t[e];r===this.st.has(e)||this.nt?.has(e)||(r?(n.add(e),this.st.add(e)):(n.remove(e),this.st.delete(e)))}return ee}}),kl=class extends o{};kl.directiveName=`unsafeSVG`,kl.resultType=2;var Al=m(kl),jl={width:448,height:512,path:`M352 64c0-17.7-14.3-32-32-32L128 32c-17.7 0-32 14.3-32 32s14.3 32 32 32l192 0c17.7 0 32-14.3 32-32zm96 128c0-17.7-14.3-32-32-32L32 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32zM0 448c0 17.7 14.3 32 32 32l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 416c-17.7 0-32 14.3-32 32zM352 320c0-17.7-14.3-32-32-32l-192 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l192 0c17.7 0 32-14.3 32-32z`},Ml={width:448,height:512,path:`M448 64c0-17.7-14.3-32-32-32L32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32zm0 256c0-17.7-14.3-32-32-32L32 288c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32zM0 192c0 17.7 14.3 32 32 32l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 160c-17.7 0-32 14.3-32 32zM448 448c0-17.7-14.3-32-32-32L32 416c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32z`},Nl={width:448,height:512,path:`M288 64c0 17.7-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l224 0c17.7 0 32 14.3 32 32zm0 256c0 17.7-14.3 32-32 32L32 352c-17.7 0-32-14.3-32-32s14.3-32 32-32l224 0c17.7 0 32 14.3 32 32zM0 192c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 224c-17.7 0-32-14.3-32-32zM448 448c0 17.7-14.3 32-32 32L32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z`},Pl={width:448,height:512,path:`M448 64c0 17.7-14.3 32-32 32L192 96c-17.7 0-32-14.3-32-32s14.3-32 32-32l224 0c17.7 0 32 14.3 32 32zm0 256c0 17.7-14.3 32-32 32l-224 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l224 0c17.7 0 32 14.3 32 32zM0 192c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 224c-17.7 0-32-14.3-32-32zM448 448c0 17.7-14.3 32-32 32L32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z`},Fl={width:384,height:512,path:`M169.4 502.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 402.7 224 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 370.7-105.4-105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z`},Il={width:512,height:512,path:`M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 105.4-105.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z`},Ll={width:512,height:512,path:`M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l370.7 0-105.4 105.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z`},Rl={width:512,height:512,path:`M256 64c-56.8 0-107.9 24.7-143.1 64l47.1 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 192c-17.7 0-32-14.3-32-32L0 32C0 14.3 14.3 0 32 0S64 14.3 64 32l0 54.7C110.9 33.6 179.5 0 256 0 397.4 0 512 114.6 512 256S397.4 512 256 512c-87 0-163.9-43.4-210.1-109.7-10.1-14.5-6.6-34.4 7.9-44.6s34.4-6.6 44.6 7.9c34.8 49.8 92.4 82.3 157.6 82.3 106 0 192-86 192-192S362 64 256 64z`},zl={width:512,height:512,path:`M436.7 74.7L448 85.4 448 32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 128c0 17.7-14.3 32-32 32l-128 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l47.9 0-7.6-7.2c-.2-.2-.4-.4-.6-.6-75-75-196.5-75-271.5 0s-75 196.5 0 271.5 196.5 75 271.5 0c8.2-8.2 15.5-16.9 21.9-26.1 10.1-14.5 30.1-18 44.6-7.9s18 30.1 7.9 44.6c-8.5 12.2-18.2 23.8-29.1 34.7-100 100-262.1 100-362 0S-25 175 75 75c99.9-99.9 261.7-100 361.7-.3z`},Bl={width:384,height:512,path:`M214.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 109.3 160 480c0 17.7 14.3 32 32 32s32-14.3 32-32l0-370.7 105.4 105.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z`},Vl={width:512,height:512,path:`M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0-201.4 201.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3 448 192c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 96C35.8 96 0 131.8 0 176L0 432c0 44.2 35.8 80 80 80l256 0c44.2 0 80-35.8 80-80l0-80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 80c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l80 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 96z`},Hl={width:448,height:512,path:`M224 0c17.7 0 32 14.3 32 32l0 168.6 144-83.1c15.3-8.8 34.9-3.6 43.7 11.7s3.6 34.9-11.7 43.7L288 256 432 339.1c15.3 8.8 20.6 28.4 11.7 43.7s-28.4 20.6-43.7 11.7L256 311.4 256 480c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-168.6-144 83.1c-15.3 8.8-34.9 3.6-43.7-11.7S.7 348 16 339.1L160 256 16 172.9C.7 164-4.5 144.5 4.3 129.1S32.7 108.6 48 117.4L192 200.6 192 32c0-17.7 14.3-32 32-32z`},Ul={width:384,height:512,path:`M32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l32 0 0 320-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l224 0c70.7 0 128-57.3 128-128 0-46.5-24.8-87.3-62-109.7 18.7-22.3 30-51 30-82.3 0-70.7-57.3-128-128-128L32 32zM288 160c0 35.3-28.7 64-64 64l-96 0 0-128 96 0c35.3 0 64 28.7 64 64zM128 416l0-128 128 0c35.3 0 64 28.7 64 64s-28.7 64-64 64l-128 0z`},Wl={width:576,height:512,path:`M416 32l-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l32 0c17.7 0 32 14.3 32 32l0 37.5c0 25.5 10.1 49.9 28.1 67.9l22.6 22.6-22.6 22.6c-18 18-28.1 42.4-28.1 67.9l0 37.5c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l32 0c53 0 96-43 96-96l0-37.5c0-8.5 3.4-16.6 9.4-22.6l45.3-45.3c12.5-12.5 12.5-32.8 0-45.3l-45.3-45.3c-6-6-9.4-14.1-9.4-22.6l0-37.5c0-53-43-96-96-96zM160 32c-53 0-96 43-96 96l0 37.5c0 8.5-3.4 16.6-9.4 22.6L9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l45.3 45.3c6 6 9.4 14.1 9.4 22.6L64 384c0 53 43 96 96 96l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0c-17.7 0-32-14.3-32-32l0-37.5c0-25.5-10.1-49.9-28.1-67.9L77.3 256 99.9 233.4c18-18 28.1-42.4 28.1-67.9l0-37.5c0-17.7 14.3-32 32-32l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0z`},Gl={width:448,height:512,path:`M128 0C110.3 0 96 14.3 96 32l0 32-32 0C28.7 64 0 92.7 0 128l0 48 448 0 0-48c0-35.3-28.7-64-64-64l-32 0 0-32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 32-128 0 0-32c0-17.7-14.3-32-32-32zM0 224L0 416c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-192-448 0z`},Kl={width:320,height:512,path:`M140.3 376.8c12.6 10.2 31.1 9.5 42.8-2.2l128-128c9.2-9.2 11.9-22.9 6.9-34.9S301.4 192 288.5 192l-256 0c-12.9 0-24.6 7.8-29.6 19.8S.7 237.5 9.9 246.6l128 128 2.4 2.2z`},ql={width:320,height:512,path:`M140.3 135.2c12.6-10.3 31.1-9.5 42.8 2.2l128 128c9.2 9.2 11.9 22.9 6.9 34.9S301.4 320 288.5 320l-256 0c-12.9 0-24.6-7.8-29.6-19.8S.7 274.5 9.9 265.4l128-128 2.4-2.2z`},Jl={width:448,height:512,path:`M434.8 70.1c14.3 10.4 17.5 30.4 7.1 44.7l-256 352c-5.5 7.6-14 12.3-23.4 13.1s-18.5-2.7-25.1-9.3l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l101.5 101.5 234-321.7c10.4-14.3 30.4-17.5 44.7-7.1z`},Yl={width:448,height:512,path:`M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z`},Xl={width:320,height:512,path:`M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z`},Zl={width:320,height:512,path:`M311.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L243.2 256 73.9 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z`},Ql={width:448,height:512,path:`M201.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 173.3 54.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z`},$l={width:512,height:512,path:`M0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0z`},eu={width:512,height:512,path:`M256 512a256 256 0 1 1 0-512 256 256 0 1 1 0 512zM374 145.7c-10.7-7.8-25.7-5.4-33.5 5.3L221.1 315.2 169 263.1c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l72 72c5 5 11.8 7.5 18.8 7s13.4-4.1 17.5-9.8L379.3 179.2c7.8-10.7 5.4-25.7-5.3-33.5z`},tu={width:512,height:512,path:`M256 512a256 256 0 1 1 0-512 256 256 0 1 1 0 512zm0-192a32 32 0 1 0 0 64 32 32 0 1 0 0-64zm0-192c-18.2 0-32.7 15.5-31.4 33.7l7.4 104c.9 12.6 11.4 22.3 23.9 22.3 12.6 0 23-9.7 23.9-22.3l7.4-104c1.3-18.2-13.1-33.7-31.4-33.7z`},nu={width:512,height:512,path:`M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zM224 160a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm-8 64l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z`},ru={width:384,height:512,path:`M320 32l-8.6 0C300.4 12.9 279.7 0 256 0L128 0C104.3 0 83.6 12.9 72.6 32L64 32C28.7 32 0 60.7 0 96L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-352c0-35.3-28.7-64-64-64zM136 112c-13.3 0-24-10.7-24-24s10.7-24 24-24l112 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-112 0z`},iu={width:512,height:512,path:`M256 0a256 256 0 1 1 0 512 256 256 0 1 1 0-512zM232 120l0 136c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2 280 120c0-13.3-10.7-24-24-24s-24 10.7-24 24z`},au={width:512,height:512,path:`M288 448l-224 0 0-224 48 0 0-64-48 0c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l224 0c35.3 0 64-28.7 64-64l0-48-64 0 0 48zm-64-96l224 0c35.3 0 64-28.7 64-64l0-224c0-35.3-28.7-64-64-64L224 0c-35.3 0-64 28.7-64 64l0 224c0 35.3 28.7 64 64 64z`},ou={width:576,height:512,path:`M360.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm64.6 136.1c-12.5 12.5-12.5 32.8 0 45.3l73.4 73.4-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l96-96c12.5-12.5 12.5-32.8 0-45.3l-96-96c-12.5-12.5-32.8-12.5-45.3 0zm-274.7 0c-12.5-12.5-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 150.6 182.6c12.5-12.5 12.5-32.8 0-45.3z`},su={width:448,height:512,path:`M192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-200.6c0-17.4-7.1-34.1-19.7-46.2L370.6 17.8C358.7 6.4 342.8 0 326.3 0L192 0zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-16-64 0 0 16-192 0 0-256 16 0 0-64-16 0z`},cu={width:448,height:512,path:`M256 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 210.7-41.4-41.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0l96-96c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 242.7 256 32zM64 320c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-46.9 0-56.6 56.6c-31.2 31.2-81.9 31.2-113.1 0L110.9 320 64 320zm304 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z`},lu={width:448,height:512,path:`M0 256a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm168 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm224-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z`},uu={width:576,height:512,path:`M288 32c-80.8 0-145.5 36.8-192.6 80.6-46.8 43.5-78.1 95.4-93 131.1-3.3 7.9-3.3 16.7 0 24.6 14.9 35.7 46.2 87.7 93 131.1 47.1 43.7 111.8 80.6 192.6 80.6s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1 3.3-7.9 3.3-16.7 0-24.6-14.9-35.7-46.2-87.7-93-131.1-47.1-43.7-111.8-80.6-192.6-80.6zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64-11.5 0-22.3-3-31.7-8.4-1 10.9-.1 22.1 2.9 33.2 13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-12.2-45.7-55.5-74.8-101.1-70.8 5.3 9.3 8.4 20.1 8.4 31.7z`},du={width:576,height:512,path:`M272 48L160 48c-8.8 0-16 7.2-16 16l0 176-48 0 0-176c0-35.3 28.7-64 64-64L293.5 0c17 0 33.3 6.7 45.3 18.7L461.3 141.3c12 12 18.7 28.3 18.7 45.3l0 53.5-48 0 0-32-88 0c-39.8 0-72-32.2-72-72l0-88zM96 384l48 0 0 64c0 8.8 7.2 16 16 16l256 0c8.8 0 16-7.2 16-16l0-64 48 0 0 64c0 35.3-28.7 64-64 64l-256 0c-35.3 0-64-28.7-64-64l0-64zM412.1 160L320 67.9 320 136c0 13.3 10.7 24 24 24l68.1 0zM24 288l112 0c13.3 0 24 10.7 24 24s-10.7 24-24 24L24 336c-13.3 0-24-10.7-24-24s10.7-24 24-24zm208 0l112 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-112 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm208 0l112 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-112 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z`},fu={width:448,height:512,path:`M32 0C49.7 0 64 14.3 64 32l0 16 69-17.2c38.1-9.5 78.3-5.1 113.5 12.5 46.3 23.2 100.8 23.2 147.1 0l9.6-4.8C423.8 28.1 448 43.1 448 66.1l0 279.7c0 13.3-8.3 25.3-20.8 30l-34.7 13c-46.2 17.3-97.6 14.6-141.7-7.4-37.9-19-81.4-23.7-122.5-13.4L64 384 64 480c0 17.7-14.3 32-32 32S0 497.7 0 480L0 32C0 14.3 14.3 0 32 0zM64 187.1l64-13.9 0 65.5-64 13.9 0 65.5 48.8-12.2c5.1-1.3 10.1-2.4 15.2-3.3l0-63.9 38.9-8.4c8.3-1.8 16.7-2.5 25.1-2.1l0-64c13.6 .4 27.2 2.6 40.4 6.4l23.6 6.9 0 66.7-41.7-12.3c-7.3-2.1-14.8-3.4-22.3-3.8l0 71.4c21.8 1.9 43.3 6.7 64 14.4l0-69.8 22.7 6.7c13.5 4 27.3 6.4 41.3 7.4l0-64.2c-7.8-.8-15.6-2.3-23.2-4.5l-40.8-12 0-62c-13-3.8-25.8-8.8-38.2-15-8.2-4.1-16.9-7-25.8-8.8l0 72.4c-13-.4-26 .8-38.7 3.6l-25.3 5.5 0-75.2-64 16 0 73.1zM320 335.7c16.8 1.5 33.9-.7 50-6.8l14-5.2 0-71.7-7.9 1.8c-18.4 4.3-37.3 5.7-56.1 4.5l0 77.4zm64-149.4l0-70.8c-20.9 6.1-42.4 9.1-64 9.1l0 69.4c13.9 1.4 28 .5 41.7-2.6l22.3-5.2z`},pu={width:448,height:512,path:`M71.3 295.6c-21.9-21.9-21.9-57.3 0-79.2s57.3-21.9 79.2 0 21.9 57.3 0 79.2s-57.4 21.9-79.2 0zM184.4 182.5c-21.9-21.9-21.9-57.3 0-79.2s57.3-21.9 79.2 0 21.9 57.3 0 79.2-57.3 21.8-79.2 0zm0 147c21.9-21.9 57.3-21.9 79.2 0s21.9 57.3 0 79.2s-57.3 21.9-79.2 0c-21.9-21.8-21.9-57.3 0-79.2zM297.5 216.4c21.9-21.9 57.3-21.9 79.2 0s21.9 57.3 0 79.2s-57.3 21.9-79.2 0c-21.8-21.9-21.8-57.3 0-79.2z`},mu={width:512,height:512,path:`M64 224a64 64 0 1 1 0-128 64 64 0 1 1 0 128zM256 96a64 64 0 1 1 0 128 64 64 0 1 1 0-128zm192 0a64 64 0 1 1 0 128 64 64 0 1 1 0-128zm0 192a64 64 0 1 1 0 128 64 64 0 1 1 0-128zM256 416a64 64 0 1 1 0-128 64 64 0 1 1 0 128zM64 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z`},hu={width:320,height:512,path:`M128 64A64 64 0 1 0 0 64 64 64 0 1 0 128 64zm0 192a64 64 0 1 0 -128 0 64 64 0 1 0 128 0zM0 448c0 35.3 28.7 64 64 64s64-28.7 64-64-28.7-64-64-64-64 28.7-64 64zM320 64a64 64 0 1 0 -128 0 64 64 0 1 0 128 0zM192 256a64 64 0 1 0 128 0 64 64 0 1 0 -128 0zM320 448c0-35.3-28.7-64-64-64s-64 28.7-64 64 28.7 64 64 64 64-28.7 64-64z`},gu={width:512,height:512,path:`M448 96c0-11.1-5.7-21.4-15.2-27.2s-21.2-6.4-31.1-1.4l-64 32c-15.8 7.9-22.2 27.1-14.3 42.9s27.1 22.2 42.9 14.3l17.7-8.8 0 236.2-32 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0 0-288zM64 96c0-17.7-14.3-32-32-32S0 78.3 0 96L0 416c0 17.7 14.3 32 32 32s32-14.3 32-32l0-128 128 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-320c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 128-128 0 0-128z`},_u={width:576,height:512,path:`M96 96c0-17.7-14.3-32-32-32S32 78.3 32 96l0 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-128 96 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-320c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 128-96 0 0-128zM368 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l81.1 0c21.5 0 38.9 17.4 38.9 38.9 0 13.9-7.5 26.8-19.6 33.8l-76.3 43.6C347.5 269.7 320 317.1 320 368.5l0 47.5c0 17.7 14.3 32 32 32l160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-128 0 0-15.5c0-28.4 15.2-54.6 39.9-68.7l76.3-43.6C532.2 237.9 552 203.8 552 166.9 552 110.1 505.9 64 449.1 64L368 64z`},vu={width:576,height:512,path:`M96 96c0-17.7-14.3-32-32-32S32 78.3 32 96l0 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-128 96 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-320c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 128-96 0 0-128zM352 256c0 17.7 14.3 32 32 32l56 0c26.5 0 48 21.5 48 48s-21.5 48-48 48l-88 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l88 0c61.9 0 112-50.1 112-112 0-31.3-12.9-59.7-33.6-80 20.7-20.3 33.6-48.7 33.6-80 0-61.9-50.1-112-112-112l-88 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l88 0c26.5 0 48 21.5 48 48s-21.5 48-48 48l-56 0c-17.7 0-32 14.3-32 32z`},yu={width:512,height:512,path:`M64 96c0-17.7-14.3-32-32-32S0 78.3 0 96L0 416c0 17.7 14.3 32 32 32s32-14.3 32-32l0-128 96 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-320c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 128-96 0 0-128zm288 0c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 44.2 35.8 80 80 80l80 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-320c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 128-80 0c-8.8 0-16-7.2-16-16l0-112z`},bu={width:576,height:512,path:`M96 96c0-17.7-14.3-32-32-32S32 78.3 32 96l0 320c0 17.7 14.3 32 32 32s32-14.3 32-32l0-128 96 0 0 128c0 17.7 14.3 32 32 32s32-14.3 32-32l0-320c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 128-96 0 0-128zM352 64c-17.7 0-32 14.3-32 32l0 144c0 17.7 14.3 32 32 32l80 0c30.9 0 56 25.1 56 56s-25.1 56-56 56l-80 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l80 0c66.3 0 120-53.7 120-120S498.3 208 432 208l-48 0 0-80 120 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L352 64z`},xu={width:512,height:512,path:`M32 64c17.7 0 32 14.3 32 32l0 128 96 0 0-128c0-17.7 14.3-32 32-32s32 14.3 32 32l0 320c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-128-96 0 0 128c0 17.7-14.3 32-32 32S0 433.7 0 416L0 96C0 78.3 14.3 64 32 64zm352 64c-17.7 0-32 14.3-32 32l0 53.5c10-3.5 20.8-5.5 32-5.5l32 0c53 0 96 43 96 96l0 48c0 53-43 96-96 96l-32 0c-53 0-96-43-96-96l0-192c0-53 43-96 96-96l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0zM352 304l0 48c0 17.7 14.3 32 32 32l32 0c17.7 0 32-14.3 32-32l0-48c0-17.7-14.3-32-32-32l-32 0c-17.7 0-32 14.3-32 32z`},Su={width:576,height:512,path:`M315 315L473.4 99.9 444.1 70.6 229 229 315 315zm-187 5l0 0 0-71.7c0-15.3 7.2-29.6 19.5-38.6L420.6 8.4C428 2.9 437 0 446.2 0 457.6 0 468.5 4.5 476.6 12.6l54.8 54.8c8.1 8.1 12.6 19 12.6 30.5 0 9.2-2.9 18.2-8.4 25.6L334.4 396.5c-9 12.3-23.4 19.5-38.6 19.5l-71.7 0-25.4 25.4c-12.5 12.5-32.8 12.5-45.3 0l-50.7-50.7c-12.5-12.5-12.5-32.8 0-45.3L128 320zM7 466.3l51.7-51.7 70.6 70.6-19.7 19.7c-4.5 4.5-10.6 7-17 7L24 512c-13.3 0-24-10.7-24-24l0-4.7c0-6.4 2.5-12.5 7-17z`},Cu={width:512,height:512,path:`M277.8 8.6c-12.3-11.4-31.3-11.4-43.5 0l-224 208c-9.6 9-12.8 22.9-8 35.1S18.8 272 32 272l16 0 0 176c0 35.3 28.7 64 64 64l288 0c35.3 0 64-28.7 64-64l0-176 16 0c13.2 0 25-8.1 29.8-20.3s1.6-26.2-8-35.1l-224-208zM240 320l32 0c26.5 0 48 21.5 48 48l0 96-128 0 0-96c0-26.5 21.5-48 48-48z`},wu={width:384,height:512,path:`M128 64c0-17.7 14.3-32 32-32l192 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-58.7 0-133.3 320 64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32l58.7 0 133.3-320-64 0c-17.7 0-32-14.3-32-32z`},Tu={width:384,height:512,path:`M292.9 384c7.3-22.3 21.9-42.5 38.4-59.9 32.7-34.4 52.7-80.9 52.7-132.1 0-106-86-192-192-192S0 86 0 192c0 51.2 20 97.7 52.7 132.1 16.5 17.4 31.2 37.6 38.4 59.9l201.7 0zM288 432l-192 0 0 16c0 44.2 35.8 80 80 80l32 0c44.2 0 80-35.8 80-80l0-16zM184 112c-39.8 0-72 32.2-72 72 0 13.3-10.7 24-24 24s-24-10.7-24-24c0-66.3 53.7-120 120-120 13.3 0 24 10.7 24 24s-10.7 24-24 24z`},Eu={width:576,height:512,path:`M419.5 96c-16.6 0-32.7 4.5-46.8 12.7-15.8-16-34.2-29.4-54.5-39.5 28.2-24 64.1-37.2 101.3-37.2 86.4 0 156.5 70 156.5 156.5 0 41.5-16.5 81.3-45.8 110.6l-71.1 71.1c-29.3 29.3-69.1 45.8-110.6 45.8-86.4 0-156.5-70-156.5-156.5 0-1.5 0-3 .1-4.5 .5-17.7 15.2-31.6 32.9-31.1s31.6 15.2 31.1 32.9c0 .9 0 1.8 0 2.6 0 51.1 41.4 92.5 92.5 92.5 24.5 0 48-9.7 65.4-27.1l71.1-71.1c17.3-17.3 27.1-40.9 27.1-65.4 0-51.1-41.4-92.5-92.5-92.5zM275.2 173.3c-1.9-.8-3.8-1.9-5.5-3.1-12.6-6.5-27-10.2-42.1-10.2-24.5 0-48 9.7-65.4 27.1L91.1 258.2c-17.3 17.3-27.1 40.9-27.1 65.4 0 51.1 41.4 92.5 92.5 92.5 16.5 0 32.6-4.4 46.7-12.6 15.8 16 34.2 29.4 54.6 39.5-28.2 23.9-64 37.2-101.3 37.2-86.4 0-156.5-70-156.5-156.5 0-41.5 16.5-81.3 45.8-110.6l71.1-71.1c29.3-29.3 69.1-45.8 110.6-45.8 86.6 0 156.5 70.6 156.5 156.9 0 1.3 0 2.6 0 3.9-.4 17.7-15.1 31.6-32.8 31.2s-31.6-15.1-31.2-32.8c0-.8 0-1.5 0-2.3 0-33.7-18-63.3-44.8-79.6z`},Du={width:384,height:512,path:`M128 96l0 64 128 0 0-64c0-35.3-28.7-64-64-64s-64 28.7-64 64zM64 160l0-64C64 25.3 121.3-32 192-32S320 25.3 320 96l0 64c35.3 0 64 28.7 64 64l0 224c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 224c0-35.3 28.7-64 64-64z`},Ou={width:512,height:512,path:`M40 48C26.7 48 16 58.7 16 72l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24L40 48zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM16 232l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0z`},ku={width:512,height:512,path:`M0 72C0 58.8 10.7 48 24 48l48 0c13.3 0 24 10.7 24 24l0 104 24 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-96 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l24 0 0-80-24 0C10.7 96 0 85.3 0 72zM30.4 301.2C41.8 292.6 55.7 288 70 288l4.9 0c33.7 0 61.1 27.4 61.1 61.1 0 19.6-9.4 37.9-25.2 49.4l-24 17.5 33.2 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-90.7 0C13.1 464 0 450.9 0 434.7 0 425.3 4.5 416.5 12.1 411l70.5-51.3c3.4-2.5 5.4-6.4 5.4-10.6 0-7.2-5.9-13.1-13.1-13.1L70 336c-3.9 0-7.7 1.3-10.8 3.6L38.4 355.2c-10.6 8-25.6 5.8-33.6-4.8S-1 324.8 9.6 316.8l20.8-15.6zM224 64l256 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 160l256 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 160l256 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-256 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z`},Au={width:512,height:512,path:`M48 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM48 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM96 256a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z`},ju={width:448,height:512,path:`M0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32z`},Mu={width:448,height:512,path:`M0 64C0 46.3 14.3 32 32 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-16 0 0 112 224 0 0-112-16 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-16 0 0 320 16 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-96 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l16 0 0-144-224 0 0 144 16 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-96 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l16 0 0-320-16 0C14.3 96 0 81.7 0 64z`},Nu={width:448,height:512,path:`M160 0L416 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-32 0 0 416c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-416-48 0 0 416c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-160-48 0C71.6 320 0 248.4 0 160S71.6 0 160 0z`},Pu={width:512,height:512,path:`M352.9 21.2L308 66.1 445.9 204 490.8 159.1C504.4 145.6 512 127.2 512 108s-7.6-37.6-21.2-51.1L455.1 21.2C441.6 7.6 423.2 0 404 0s-37.6 7.6-51.1 21.2zM274.1 100L58.9 315.1c-10.7 10.7-18.5 24.1-22.6 38.7L.9 481.6c-2.3 8.3 0 17.3 6.2 23.4s15.1 8.5 23.4 6.2l127.8-35.5c14.6-4.1 27.9-11.8 38.7-22.6L412 237.9 274.1 100z`},Fu={width:448,height:512,path:`M256 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 160-160 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0 0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160 160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-160 0 0-160z`},Iu={width:512,height:512,path:`M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z`},Lu={width:448,height:512,path:`M448 296c0 66.3-53.7 120-120 120l-8 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l8 0c30.9 0 56-25.1 56-56l0-8-64 0c-35.3 0-64-28.7-64-64l0-64c0-35.3 28.7-64 64-64l64 0c35.3 0 64 28.7 64 64l0 136zm-256 0c0 66.3-53.7 120-120 120l-8 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l8 0c30.9 0 56-25.1 56-56l0-8-64 0c-35.3 0-64-28.7-64-64l0-64c0-35.3 28.7-64 64-64l64 0c35.3 0 64 28.7 64 64l0 136z`},Ru={width:512,height:512,path:`M65.9 228.5c13.3-93 93.4-164.5 190.1-164.5 53 0 101 21.5 135.8 56.2 .2 .2 .4 .4 .6 .6l7.6 7.2-47.9 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 53.4-11.3-10.7C390.5 28.6 326.5 0 256 0 127 0 20.3 95.4 2.6 219.5 .1 237 12.2 253.2 29.7 255.7s33.7-9.7 36.2-27.1zm443.5 64c2.5-17.5-9.7-33.7-27.1-36.2s-33.7 9.7-36.2 27.1c-13.3 93-93.4 164.5-190.1 164.5-53 0-101-21.5-135.8-56.2-.2-.2-.4-.4-.6-.6l-7.6-7.2 47.9 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 320c-8.5 0-16.7 3.4-22.7 9.5S-.1 343.7 0 352.3l1 127c.1 17.7 14.6 31.9 32.3 31.7S65.2 496.4 65 478.7l-.4-51.5 10.7 10.1c46.3 46.1 110.2 74.7 180.7 74.7 129 0 235.7-95.4 253.4-219.5z`},zu={width:512,height:512,path:`M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376C296.3 401.1 253.9 416 208 416 93.1 416 0 322.9 0 208S93.1 0 208 0 416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z`},Bu={width:512,height:512,path:`M307.8 18.4c-12 5-19.8 16.6-19.8 29.6l0 80-112 0c-97.2 0-176 78.8-176 176 0 113.3 81.5 163.9 100.2 174.1 2.5 1.4 5.3 1.9 8.1 1.9 10.9 0 19.7-8.9 19.7-19.7 0-7.5-4.3-14.4-9.8-19.5-9.4-8.8-22.2-26.4-22.2-56.7 0-53 43-96 96-96l96 0 0 80c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l160-160c12.5-12.5 12.5-32.8 0-45.3l-160-160c-9.2-9.2-22.9-11.9-34.9-6.9z`},Vu={width:512,height:512,path:`M32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 224zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384z`},Hu={width:512,height:512,path:`M96 157.5C96 88.2 152.2 32 221.5 32L368 32c17.7 0 32 14.3 32 32s-14.3 32-32 32L221.5 96c-34 0-61.5 27.5-61.5 61.5 0 31 23.1 57.2 53.9 61l44.1 5.5 222 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l83.1 0C103 204.6 96 181.8 96 157.5zM349.2 336l65.5 0c.9 6.1 1.4 12.2 1.4 18.5 0 69.3-56.2 125.5-125.5 125.5L144 480c-17.7 0-32-14.3-32-32s14.3-32 32-32l146.5 0c34 0 61.5-27.5 61.5-61.5 0-6.4-1-12.7-2.8-18.5z`},Uu={width:576,height:512,path:`M96 64C78.3 64 64 78.3 64 96s14.3 32 32 32l15.3 0 89.6 128-89.6 128-15.3 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l32 0c10.4 0 20.2-5.1 26.2-13.6L240 311.8 325.8 434.4c6 8.6 15.8 13.6 26.2 13.6l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-15.3 0-89.6-128 89.6-128 15.3 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0c-10.4 0-20.2 5.1-26.2 13.6L240 200.2 154.2 77.6C148.2 69.1 138.4 64 128 64L96 64zM544 320c0-11.1-5.7-21.4-15.2-27.2s-21.2-6.4-31.1-1.4l-32 16c-15.8 7.9-22.2 27.1-14.3 42.9 5.6 11.2 16.9 17.7 28.6 17.7l0 80c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-128z`},Wu={width:576,height:512,path:`M544 32c0-11.1-5.7-21.4-15.2-27.2s-21.2-6.4-31.1-1.4l-32 16C449.9 27.3 443.5 46.5 451.4 62.3 457 73.5 468.3 80 480 80l0 80c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-128zM96 64C78.3 64 64 78.3 64 96s14.3 32 32 32l15.3 0 89.6 128-89.6 128-15.3 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l32 0c10.4 0 20.2-5.1 26.2-13.6L240 311.8 325.8 434.4c6 8.6 15.8 13.6 26.2 13.6l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-15.3 0-89.6-128 89.6-128 15.3 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-32 0c-10.4 0-20.2 5.1-26.2 13.6L240 200.2 154.2 77.6C148.2 69.1 138.4 64 128 64L96 64z`},Gu={width:448,height:512,path:`M384 32c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64l-320 0-6.5-.3C25.2 476.4 0 449.1 0 416L0 96C0 60.7 28.7 32 64 32l320 0zM64 320l0 96 128 0 0-96-128 0zm192 0l0 96 128 0 0-96-128 0zM64 256l128 0 0-96-128 0 0 96zm192 0l128 0 0-96-128 0 0 96z`},Ku={width:576,height:512,path:`M41-24.9c-9.4-9.4-24.6-9.4-33.9 0S-2.3-.3 7 9.1l528 528c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9L322.7 256.9 368.2 96 471 96 465 120.2c-4.3 17.1 6.1 34.5 23.3 38.8s34.5-6.1 38.8-23.3l11-44.1C545.6 61.3 522.7 32 491.5 32l-319 0c-19.8 0-37.3 12.1-44.5 30.1l-87-87zM180.4 114.5l4.6-18.5 116.7 0-30.8 109-90.5-90.5zM241 310.8L211.3 416 160 416c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-42.2 0 15.1-53.3-51.9-51.9z`},qu={width:512,height:512,path:`M256 0c14.7 0 28.2 8.1 35.2 21l216 400c6.7 12.4 6.4 27.4-.8 39.5S486.1 480 472 480L40 480c-14.1 0-27.2-7.4-34.4-19.5s-7.5-27.1-.8-39.5l216-400c7-12.9 20.5-21 35.2-21zm0 352a32 32 0 1 0 0 64 32 32 0 1 0 0-64zm0-192c-18.2 0-32.7 15.5-31.4 33.7l7.4 104c.9 12.5 11.4 22.3 23.9 22.3 12.6 0 23-9.7 23.9-22.3l7.4-104c1.3-18.2-13.1-33.7-31.4-33.7z`},Ju={width:384,height:512,path:`M0 32C0 14.3 14.3 0 32 0L96 0c17.7 0 32 14.3 32 32S113.7 64 96 64l0 160c0 53 43 96 96 96s96-43 96-96l0-160c-17.7 0-32-14.3-32-32S270.3 0 288 0l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l0 160c0 88.4-71.6 160-160 160S32 312.4 32 224L32 64C14.3 64 0 49.7 0 32zM0 480c0-17.7 14.3-32 32-32l320 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 512c-17.7 0-32-14.3-32-32z`},Yu={width:384,height:512,path:`M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z`},Xu={width:128,height:512,path:`M64 144a56 56 0 1 1 0-112 56 56 0 1 1 0 112zm0 224c30.9 0 56 25.1 56 56s-25.1 56-56 56-56-25.1-56-56 25.1-56 56-56zm56-112c0 30.9-25.1 56-56 56s-56-25.1-56-56 25.1-56 56-56 56 25.1 56 56z`},Zu={width:512,height:512,path:`M195.1 9.5C198.1-5.3 211.2-16 226.4-16l59.8 0c15.2 0 28.3 10.7 31.3 25.5L332 79.5c14.1 6 27.3 13.7 39.3 22.8l67.8-22.5c14.4-4.8 30.2 1.2 37.8 14.4l29.9 51.8c7.6 13.2 4.9 29.8-6.5 39.9L447 233.3c.9 7.4 1.3 15 1.3 22.7s-.5 15.3-1.3 22.7l53.4 47.5c11.4 10.1 14 26.8 6.5 39.9l-29.9 51.8c-7.6 13.1-23.4 19.2-37.8 14.4l-67.8-22.5c-12.1 9.1-25.3 16.7-39.3 22.8l-14.4 69.9c-3.1 14.9-16.2 25.5-31.3 25.5l-59.8 0c-15.2 0-28.3-10.7-31.3-25.5l-14.4-69.9c-14.1-6-27.2-13.7-39.3-22.8L73.5 432.3c-14.4 4.8-30.2-1.2-37.8-14.4L5.8 366.1c-7.6-13.2-4.9-29.8 6.5-39.9l53.4-47.5c-.9-7.4-1.3-15-1.3-22.7s.5-15.3 1.3-22.7L12.3 185.8c-11.4-10.1-14-26.8-6.5-39.9L35.7 94.1c7.6-13.2 23.4-19.2 37.8-14.4l67.8 22.5c12.1-9.1 25.3-16.7 39.3-22.8L195.1 9.5zM256.3 336a80 80 0 1 0 -.6-160 80 80 0 1 0 .6 160z`},Qu={width:512,height:512,path:`M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L368 46.1 465.9 144 490.3 119.6c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L432 177.9 334.1 80 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z`},$u={width:448,height:512,path:`M136.7 5.9L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-8.7-26.1C306.9-7.2 294.7-16 280.9-16L167.1-16c-13.8 0-26 8.8-30.4 21.9zM416 144L32 144 53.1 467.1C54.7 492.4 75.7 512 101 512L347 512c25.3 0 46.3-19.6 47.9-44.9L416 144z`},ed={alignCenter:jl,alignJustify:Ml,alignLeft:Nl,alignRight:Pl,arrowDown:Fl,arrowLeft:Il,arrowRight:Ll,arrowRotateLeft:Rl,arrowRotateRight:zl,arrowUp:Bl,arrowUpRightFromSquare:Vl,asterisk:Hl,bold:Ul,bracketsCurly:Wl,calendar:Gl,caretDown:Kl,caretUp:ql,check:Jl,chevronDown:Yl,chevronLeft:Xl,chevronRight:Zl,chevronUp:Ql,circle:$l,circleCheck:eu,circleExclamation:tu,circleInfo:nu,clipboard:ru,clock:iu,clone:au,code:ou,copy:su,download:cu,ellipsis:lu,ellipsisVertical:Xu,eye:uu,fileDashedLine:du,flagCheckered:fu,gear:Zu,gripDots:mu,gripDotsVertical:hu,gripMove:pu,h1:gu,h2:_u,h3:vu,h4:yu,h5:bu,h6:xu,heading:Mu,highlighter:Su,house:Cu,italic:wu,lightbulb:Tu,link:Eu,lock:Du,list:Ou,listOl:ku,listUl:Au,minus:ju,paragraph:Nu,pen:Pu,penToSquare:Qu,plus:Fu,circlePlus:Iu,quoteRight:Lu,arrowsRotate:Ru,magnifyingGlass:zu,share:Bu,sliders:Vu,strikethrough:Hu,subscript:Uu,superscript:Wu,table:Gu,textSlash:Ku,trash:$u,triangleExclamation:qu,underline:Ju,xmark:Yu},td=e=>e.replace(/([a-z0-9])([A-Z])/g,`$1-$2`).toLowerCase(),nd=e=>{let t=e.trim();return t&&(/[A-Z]/.test(t)?td(t):t.toLowerCase())},rd=`__PK_ICON_REGISTRY__`,id=`__PK_ICON_REGISTRY_LISTENERS__`,ad=()=>{let e=globalThis;return e[rd]||(e[rd]={}),e[rd]},od=()=>{let e=globalThis;return e[id]||(e[id]=new Set),e[id]},sd=()=>{for(let e of od())try{e()}catch{}},cd=e=>{let t=od();return t.add(e),()=>{t.delete(e)}},ld=()=>Object.keys(ad()).sort(),ud=e=>{if(!e)return;let t=ad();return t[nd(e)]??t[e]},dd=(e,t)=>{let n=nd(e);if(!n)throw Error(`registerIcon: name must be a non-empty string`);if(!t?.path||!t.width||!t.height)throw Error(`registerIcon: icon "${n}" must include width, height, and path`);ad()[n]=t,sd()},fd=e=>{let t=!1;for(let[n,r]of Object.entries(e)){let e=nd(n);if(!e)throw Error(`registerIcon: name must be a non-empty string`);if(!r?.path||!r.width||!r.height)throw Error(`registerIcon: icon "${e}" must include width, height, and path`);ad()[e]=r,t=!0}t&&sd()},pd=e=>e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`),md=e=>{let{width:t,height:n}=e;if(t===n)return`0 0 ${t} ${n}`;let r=Math.max(t,n);return`${(t-r)/2} ${(n-r)/2} ${r} ${r}`},hd=(e,t={})=>{let{title:n,className:r,attributes:i={}}=t,a={xmlns:`http://www.w3.org/2000/svg`,viewBox:md(e),overflow:`visible`,...i};return r&&(a.class=r),n?a.role=`img`:(a[`aria-hidden`]=`true`,a.focusable=`false`),`<svg ${Object.entries(a).map(([e,t])=>`${e}="${pd(t)}"`).join(` `)}>${n?`<title>${pd(n)}</title>`:``}<path fill="currentColor" d="${pd(e.path)}"/></svg>`},gd=re({alignCenter:()=>jl,alignJustify:()=>Ml,alignLeft:()=>Nl,alignRight:()=>Pl,arrowDown:()=>Fl,arrowLeft:()=>Il,arrowRight:()=>Ll,arrowRotateLeft:()=>Rl,arrowRotateRight:()=>zl,arrowUp:()=>Bl,arrowUpRightFromSquare:()=>Vl,arrowsRotate:()=>Ru,asterisk:()=>Hl,bold:()=>Ul,bracketsCurly:()=>Wl,calendar:()=>Gl,caretDown:()=>Kl,caretUp:()=>ql,check:()=>Jl,chevronDown:()=>Yl,chevronLeft:()=>Xl,chevronRight:()=>Zl,chevronUp:()=>Ql,circle:()=>$l,circleCheck:()=>eu,circleExclamation:()=>tu,circleInfo:()=>nu,circlePlus:()=>Iu,clipboard:()=>ru,clock:()=>iu,clone:()=>au,code:()=>ou,copy:()=>su,download:()=>cu,ellipsis:()=>lu,ellipsisVertical:()=>Xu,eye:()=>uu,fileDashedLine:()=>du,flagCheckered:()=>fu,gear:()=>Zu,getIcon:()=>ud,getIconNames:()=>ld,gripDots:()=>mu,gripDotsVertical:()=>hu,gripMove:()=>pu,h1:()=>gu,h2:()=>_u,h3:()=>vu,h4:()=>yu,h5:()=>bu,h6:()=>xu,heading:()=>Mu,highlighter:()=>Su,house:()=>Cu,iconToSvg:()=>hd,iconViewBox:()=>md,icons:()=>ed,italic:()=>wu,lightbulb:()=>Tu,link:()=>Eu,list:()=>Ou,listOl:()=>ku,listUl:()=>Au,lock:()=>Du,magnifyingGlass:()=>zu,minus:()=>ju,normalizeIconName:()=>nd,paragraph:()=>Nu,pen:()=>Pu,penToSquare:()=>Qu,plus:()=>Fu,quoteRight:()=>Lu,registerIcon:()=>dd,registerIcons:()=>fd,share:()=>Bu,sliders:()=>Vu,strikethrough:()=>Hu,subscribeIconRegistry:()=>cd,subscript:()=>Uu,superscript:()=>Wu,table:()=>Gu,textSlash:()=>Ku,trash:()=>$u,triangleExclamation:()=>qu,underline:()=>Ju,xmark:()=>Yu}),_d=(e,t={})=>hd(e,{title:t.title}),vd=(e,t={})=>{let n=document.createElement(`template`);n.innerHTML=_d(e,t);let r=n.content.firstElementChild;if(!(r instanceof SVGSVGElement))throw Error(`Icon render did not produce an SVG element.`);return r},yd=Object.defineProperty,bd=Object.getOwnPropertyDescriptor,xd=Object.getOwnPropertyNames,Sd=Object.prototype.hasOwnProperty,Cd=(e,t)=>{let n={};for(var r in e)yd(n,r,{get:e[r],enumerable:!0});return t||yd(n,Symbol.toStringTag,{value:`Module`}),n},wd=(e,t,n,r)=>{if(t&&typeof t==`object`||typeof t==`function`)for(var i=xd(t),a=0,o=i.length,s;a<o;a++)s=i[a],!Sd.call(e,s)&&s!==n&&yd(e,s,{get:(e=>t[e]).bind(null,s),enumerable:!(r=bd(t,s))||r.enumerable});return e},Td=(e,t,n)=>(wd(e,t,`default`),n&&wd(n,t,`default`)),Ed=`M64 64C28.7 64 0 92.7 0 128L0 384c0 35.3 28.7 64 64 64l208 0 32 0 16 0 256 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64L320 64l-16 0-32 0L64 64zm512 48c8.8 0 16 7.2 16 16l0 256c0 8.8-7.2 16-16 16l-256 0 0-288 256 0zM178.3 175.9l64 144c4.5 10.1-.1 21.9-10.2 26.4s-21.9-.1-26.4-10.2L196.8 316l-73.6 0-8.9 20.1c-4.5 10.1-16.3 14.6-26.4 10.2s-14.6-16.3-10.2-26.4l64-144c3.2-7.2 10.4-11.9 18.3-11.9s15.1 4.7 18.3 11.9zM179 276l-19-42.8L141 276l38 0zM456 164c-11 0-20 9-20 20l0 4-52 0c-11 0-20 9-20 20s9 20 20 20l72 0 35.1 0c-7.3 16.7-17.4 31.9-29.8 45l-.5-.5-14.6-14.6c-7.8-7.8-20.5-7.8-28.3 0s-7.8 20.5 0 28.3L430 298.3c-5.9 3.6-12.1 6.9-18.5 9.8l-3.6 1.6c-10.1 4.5-14.6 16.3-10.2 26.4s16.3 14.6 26.4 10.2l3.6-1.6c12-5.3 23.4-11.8 34-19.4c4.3 3 8.6 5.8 13.1 8.5l18.9 11.3c9.5 5.7 21.8 2.6 27.4-6.9s2.6-21.8-6.9-27.4l-18.9-11.3c-.9-.5-1.8-1.1-2.7-1.6c17.2-18.8 30.7-40.9 39.6-65.4L534 228l2 0c11 0 20-9 20-20s-9-20-20-20l-16 0-44 0 0-4c0-11-9-20-20-20z`,Dd=()=>{let e=document.createElementNS(`http://www.w3.org/2000/svg`,`svg`);e.setAttribute(`aria-hidden`,`true`),e.setAttribute(`xmlns`,`http://www.w3.org/2000/svg`),e.setAttribute(`viewBox`,`0 0 640 512`);let t=document.createElementNS(`http://www.w3.org/2000/svg`,`path`);return t.setAttribute(`d`,Ed),e.append(t),e},Od=Cd({createIconElement:()=>vd,createTranslationIconElement:()=>Dd,renderIconHtml:()=>_d});Td(Od,gd);var kd=[`aria-labelledby`,`aria-describedby`,`aria-invalid`,`aria-errormessage`,`aria-required`,`aria-label`];function Ad(e){return e.hasAttribute(`aria-labelledby`)||e.hasAttribute(`aria-describedby`)||e.hasAttribute(`aria-errormessage`)}function jd(e,t){for(let n of kd){let r=e.getAttribute(n);r===null?t.removeAttribute(n):t.setAttribute(n,r)}}var Md=class{constructor(e,t,n){this.host=e,this.getTarget=t,this.onSync=n}connect(){this.sync(),this.observer=new MutationObserver(()=>{this.sync()}),this.observer.observe(this.host,{attributes:!0,attributeFilter:[...kd]})}disconnect(){this.observer?.disconnect(),this.observer=void 0}sync(){if(!Ad(this.host)){this.onSync?.();return}let e=this.getTarget();e&&jd(this.host,e)}},Nd=class extends Event{constructor(){super(`pk-invalid`,{bubbles:!0,cancelable:!1,composed:!0})}};function Pd(){return{observedAttributes:[`custom-error`],checkValidity(e){let t={message:``,isValid:!0,invalidKeys:[]};return e.customError&&(t.message=e.customError,t.isValid=!1,t.invalidKeys.push(`customError`)),t}}}var Fd=class extends El{static{this.formAssociated=!0}static get validators(){return[Pd()]}static get observedAttributes(){let e=new Set(super.observedAttributes??[]);for(let t of this.validators)for(let n of t.observedAttributes??[])e.add(n);return[...e]}constructor(){super(),this.internals=this.attachInternals(),this.assumeInteractionOn=[`input`],this.validators=[],this.name=null,this.disabled=!1,this.required=!1,this.customError=null,this.valueHasChanged=!1,this.hasInteracted=!1,this.emittedEvents=[],this.emitInvalid=e=>{e.target===this&&(this.hasInteracted=!0,this.dispatchEvent(new Nd))},this.handleInteraction=e=>{this.emittedEvents.includes(e.type)||this.emittedEvents.push(e.type),this.emittedEvents.length>=this.assumeInteractionOn.length&&(this.hasInteracted=!0,this.updateValidity())},this.addEventListener(`invalid`,this.emitInvalid)}connectedCallback(){super.connectedCallback();for(let e of this.assumeInteractionOn)this.addEventListener(e,this.handleInteraction);this.updateValidity()}disconnectedCallback(){this.hostAriaMirror?.disconnect(),this.hostAriaMirror=void 0;for(let e of this.assumeInteractionOn)this.removeEventListener(e,this.handleInteraction);this.removeEventListener(`invalid`,this.emitInvalid),super.disconnectedCallback()}updated(e){e.has(`customError`)&&this.setCustomValidity(this.customError??``),e.has(`disabled`)&&this.setState(`disabled`,!!this.disabled),(e.has(`value`)||e.has(`disabled`)||e.has(`required`)||e.has(`name`))&&this.syncFormValue(),this.updateValidity(),super.updated(e),this.syncHostAriaMirror()}firstUpdated(e){super.firstUpdated(e),this.connectHostAriaMirror()}getAriaMirrorTarget(){return this.input??null}syncStandaloneAria(){}connectHostAriaMirror(){this.hostAriaMirror?.disconnect(),this.hostAriaMirror=new Md(this,()=>this.getAriaMirrorTarget(),()=>this.syncStandaloneAria()),this.hostAriaMirror.connect()}syncHostAriaMirror(){this.hostAriaMirror?.sync()}formResetCallback(){this.resetValidity(),this.hasInteracted=!1,this.valueHasChanged=!1,this.emittedEvents=[],this.resetToDefaultValue(),this.syncFormValue(),this.updateValidity()}formDisabledCallback(e){this.disabled=e,this.updateValidity()}formStateRestoreCallback(e,t){this.restoreFormState(e),this.syncFormValue(),this.updateValidity()}set form(e){e?this.setAttribute(`form`,e):this.removeAttribute(`form`)}get form(){return this.internals.form}get labels(){return this.internals.labels}get validity(){return this.internals.validity}get willValidate(){return this.internals.willValidate}get validationMessage(){return this.internals.validationMessage}getForm(){return this.internals.form}checkValidity(){return this.updateValidity(),this.internals.checkValidity()}reportValidity(){return this.updateValidity(),this.hasInteracted=!0,this.internals.reportValidity()}resetValidity(){this.setCustomValidity(``),this.internals.setValidity({}),this.syncCustomStates()}setCustomValidity(e){if(!e){this.customError=null,this.internals.setValidity({}),this.syncCustomStates();return}this.customError=e;let t=this.validationTarget;t instanceof HTMLElement?this.internals.setValidity({customError:!0},e,t):this.internals.setValidity({customError:!0},e),this.syncCustomStates()}get validationTarget(){return this.input}get allValidators(){return[...this.constructor.validators??[],...this.validators??[]]}setFormValue(e,t){this.internals.setFormValue(e,t??e)}setValue(e,t){this.setFormValue(e,t??e)}updateValidity(){if(this.disabled||this.hasAttribute(`disabled`)||!this.willValidate){this.internals.setValidity({}),this.syncCustomStates();return}let e=this.allValidators;if(!e.length)return;let t={customError:!!this.customError},n=``,r=this.validationTarget;for(let r of e){let{isValid:e,message:i,invalidKeys:a}=r.checkValidity(this);if(!e){n||=i;for(let e of a)t[e]=!0}}n||=this.validationMessage,r instanceof HTMLElement?this.internals.setValidity(t,n,r):this.internals.setValidity(t,n),this.syncCustomStates()}syncCustomStates(){let e=this.internals.validity.valid;this.setState(`required`,this.required),this.setState(`optional`,!this.required),this.setState(`invalid`,!e),this.setState(`valid`,e),this.setState(`user-invalid`,!e&&this.hasInteracted),this.setState(`user-valid`,e&&this.hasInteracted)}setState(e,t){let n=this.internals.states;n&&(t?n.add(e):n.delete(e))}syncFormValue(){}resetToDefaultValue(){}restoreFormState(e){}};X([n({reflect:!0})],Fd.prototype,`name`,void 0),X([n({type:Boolean,reflect:!0})],Fd.prototype,`disabled`,void 0),X([n({type:Boolean,reflect:!0})],Fd.prototype,`required`,void 0),X([n({attribute:`custom-error`,reflect:!0})],Fd.prototype,`customError`,void 0),X([n({attribute:!1,state:!0})],Fd.prototype,`valueHasChanged`,void 0),X([n({attribute:!1,state:!0})],Fd.prototype,`hasInteracted`,void 0);function Id(){return{checkValidity(e){let t=e.input,n={message:``,isValid:!0,invalidKeys:[]};if(!t)return n;let r=!0;if(`checkValidity`in t&&typeof t.checkValidity==`function`&&(r=t.checkValidity()),r)return n;if(n.isValid=!1,`validationMessage`in t&&typeof t.validationMessage==`string`&&(n.message=t.validationMessage),!(`validity`in t)||!t.validity)return n.invalidKeys.push(`customError`),n;for(let e of Object.keys(t.validity)){if(e===`valid`)continue;let r=e;t.validity[r]&&n.invalidKeys.push(r)}return n}}}var Ld=class{constructor(e,...t){this.host=e,this.boundSlots=new Set,this.lastHasContent=new Map,this.handleSlotChange=()=>{let e=!1;for(let t of this.slotNames){let n=this.test(t);this.lastHasContent.get(t)!==n&&(this.lastHasContent.set(t,n),e=!0)}e&&this.host.requestUpdate()},this.slotNames=t,e.addController(this)}hostConnected(){this.bindSlotListeners()}hostUpdated(){this.bindSlotListeners()}hostDisconnected(){for(let e of this.boundSlots)e.removeEventListener(`slotchange`,this.handleSlotChange);this.boundSlots.clear()}bindSlotListeners(){for(let e of this.slotNames){let t=this.findSlot(e);!t||this.boundSlots.has(t)||(this.boundSlots.add(t),t.addEventListener(`slotchange`,this.handleSlotChange),this.lastHasContent.has(e)||this.lastHasContent.set(e,this.test(e)))}}findSlot(e){return this.host.shadowRoot?e?this.host.shadowRoot.querySelector(`slot[name="${e}"]`):this.host.shadowRoot.querySelector(`slot:not([name])`):null}test(e,t=!1){if(t||this.hasLightDomSlotContent(e))return!0;let n=this.findSlot(e);return n?n.assignedNodes({flatten:!0}).some(e=>e.nodeType===Node.TEXT_NODE?!!e.textContent?.trim():e.nodeType===Node.ELEMENT_NODE):!1}hasLightDomSlotContent(e){return[...this.host.children].some(t=>t.getAttribute(`slot`)===e)}},Rd=0;function zd(e=`pk`){return Rd+=1,`${e}-${Rd}`}[`a[href]`,`button:not([disabled])`,`input:not([disabled])`,`select:not([disabled])`,`textarea:not([disabled])`,`[tabindex]:not([tabindex="-1"])`].join(`,`),[`a[href]`,`button`,`input`,`select`,`textarea`,`[tabindex]:not([tabindex="-1"])`].join(`,`);var Bd=class{constructor(e=`polite`){this.element=document.createElement(`div`),this.element.setAttribute(`aria-live`,e),this.element.setAttribute(`aria-atomic`,`true`),this.element.className=`pk-visually-hidden`,this.element.style.cssText=`position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;`,document.body.append(this.element)}announce(e){this.element.textContent=``,requestAnimationFrame(()=>{this.element.textContent=e})}destroy(){this.element.remove()}},Vd=[];function Hd(e){Vd.push(e)}function Ud(e){for(let t=Vd.length-1;t>=0;--t)if(Vd[t]===e){Vd.splice(t,1);break}}function Wd(e){return Vd.length>0&&Vd[Vd.length-1]===e}function Gd(e,t){return{top:Math.round(e.getBoundingClientRect().top-t.getBoundingClientRect().top),left:Math.round(e.getBoundingClientRect().left-t.getBoundingClientRect().left)}}var Kd=new Set,qd=null,Jd=new Set([` `,`ArrowUp`,`ArrowDown`,`ArrowLeft`,`ArrowRight`,`PageUp`,`PageDown`,`Home`,`End`]);function Yd(e){for(let t of e.composedPath())if(t instanceof HTMLElement&&Kd.has(t))return!0;return!1}function Xd(e){if(!(e instanceof HTMLElement))return!1;if(e.isContentEditable)return!0;let t=e.tagName;return t===`INPUT`||t===`TEXTAREA`||t===`SELECT`}function Zd(){let e=document.body,t=e.style.overflow;e.style.setProperty(`overflow`,`hidden`,`important`);let n=e=>{Yd(e)||e.preventDefault()},r=e=>{Yd(e)||e.preventDefault()},i=e=>{Jd.has(e.key)&&(Yd(e)||Xd(e.target)||e.preventDefault())};return window.addEventListener(`wheel`,n,{passive:!1,capture:!0}),window.addEventListener(`touchmove`,r,{passive:!1,capture:!0}),window.addEventListener(`keydown`,i,{capture:!0}),()=>{window.removeEventListener(`wheel`,n,{capture:!0}),window.removeEventListener(`touchmove`,r,{capture:!0}),window.removeEventListener(`keydown`,i,{capture:!0}),e.style.removeProperty(`overflow`),t&&(e.style.overflow=t)}}function Qd(e){Kd.add(e),Kd.size===1&&(document.documentElement.classList.add(`pk-scroll-lock`),document.documentElement.style.setProperty(`--pk-scroll-lock-size`,`0px`),qd=Zd())}function $d(e){Kd.delete(e),Kd.size===0&&(qd?.(),qd=null,document.documentElement.classList.remove(`pk-scroll-lock`),document.documentElement.style.removeProperty(`--pk-scroll-lock-size`),document.documentElement.style.removeProperty(`--pk-scroll-lock-gutter`))}function ef(e,t,n=`vertical`,r=`smooth`){let i=Gd(e,t),a=i.top+t.scrollTop,o=i.left+t.scrollLeft,s=t.scrollLeft,c=t.scrollLeft+t.offsetWidth,l=t.scrollTop,u=t.scrollTop+t.offsetHeight;(n===`horizontal`||n===`both`)&&(o<s?t.scrollTo({left:o,behavior:r}):o+e.clientWidth>c&&t.scrollTo({left:o-t.offsetWidth+e.clientWidth,behavior:r})),(n===`vertical`||n===`both`)&&(a<l?t.scrollTo({top:a,behavior:r}):a+e.clientHeight>u&&t.scrollTo({top:a-t.offsetHeight+e.clientHeight,behavior:r}))}var tf=class extends Event{constructor(){super(`pk-clear`,{bubbles:!0,cancelable:!1,composed:!0})}},nf=class extends Event{constructor(){super(`pk-show`,{bubbles:!0,cancelable:!1,composed:!0})}},rf=class extends Event{constructor(){super(`pk-after-show`,{bubbles:!0,cancelable:!1,composed:!0})}},af=class extends Event{constructor(e=`unknown`){super(`pk-hide`,{bubbles:!0,cancelable:!0,composed:!0}),this.detail={source:e}}},of=class extends Event{constructor(){super(`pk-after-hide`,{bubbles:!0,cancelable:!1,composed:!0})}};function sf(e){let t=e.split(`-`)[0];return t===`inline-start`?`left`:t===`inline-end`?`right`:t===`top`||t===`bottom`||t===`left`||t===`right`?t:`bottom`}function cf(e,t,n,r,i){let a=sf(e),o=t.x+t.width/2-n.x,s=t.y+t.height/2-n.y;return Math.abs(i?.y??0)>r&&(a===`top`||a===`bottom`)?`${o}px ${t.y+t.height/2-n.y}px`:{top:`${o}px calc(100% + ${r}px)`,bottom:`${o}px ${-r}px`,left:`calc(100% + ${r}px) ${s}px`,right:`${-r}px ${s}px`}[a]}function lf(e,t){if(!t){e.removeAttribute(`data-side`);return}e.setAttribute(`data-side`,sf(t))}function uf(e,t,n=100,r){let i=()=>e.getAttribute(`data-current-placement`)??t;return!r?.requireEvent&&e.hasAttribute(`data-current-placement`)?Promise.resolve(i()):new Promise(t=>{let a=!1,o=()=>{a||(a=!0,t(i()))};e.addEventListener(`pk-reposition`,o,{once:!0}),r?.requireEvent||requestAnimationFrame(()=>{requestAnimationFrame(()=>{e.hasAttribute(`data-current-placement`)&&o()})}),window.setTimeout(o,n)})}var df=globalThis.HTMLElement!==void 0&&Object.prototype.hasOwnProperty.call(globalThis.HTMLElement.prototype,`popover`);function ff(e){return mf(e)}function pf(e){return e.assignedSlot?e.assignedSlot:e.parentNode instanceof ShadowRoot?e.parentNode.host:e.parentNode}function mf(e){for(let t=e;t;t=pf(t))if(t instanceof Element&&getComputedStyle(t).display===`none`)return null;for(let t=pf(e);t;t=pf(t)){if(!(t instanceof Element))continue;let e=getComputedStyle(t);if(e.display!==`contents`&&(e.position!==`static`||v(e)||t.tagName===`BODY`))return t}return null}function hf(e,t){if(!t)return null;let n=e.getRootNode();if(n instanceof Document||n instanceof ShadowRoot){let e=n.getElementById(t);if(e)return e}return e.ownerDocument.getElementById(t)}var gf=class extends Event{constructor(){super(`pk-reposition`,{bubbles:!0,cancelable:!1,composed:!0})}},_f=b`
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
`;function vf(e){return typeof e==`object`&&!!e&&`getBoundingClientRect`in e}function yf(e){return e||(df?`absolute`:`fixed`)}function bf(e,t){if(!(!df||vf(e)||t!==`scroll`))return u(e).filter(e=>e instanceof Element)}var Z=class extends El{constructor(...e){super(...e),this.anchor=``,this.active=!1,this.boundary=`viewport`,this.placement=`bottom-start`,this.distance=4,this.skidding=0,this.flip=!0,this.flipFallbackPlacements=``,this.flipFallbackStrategy=`best-fit`,this.flipPadding=8,this.shift=!0,this.shiftPadding=8,this.arrow=!1,this.arrowPlacement=`anchor`,this.arrowPadding=10,this.anchorTracking=!0,this.hoverBridge=!1,this.anchorElement=null,this.settlingInitialPosition=!1,this.settleGeneration=0}static{this.styles=_f}disconnectedCallback(){this.stop(),super.disconnectedCallback()}updated(e){super.updated(e),e.has(`active`)&&(this.active?(this.resolveAnchor(),this.start()):this.stop()),e.has(`anchor`)&&this.handleAnchorChange(),this.active&&!e.has(`active`)&&this.reposition()}reposition(){this.settlingInitialPosition||this.repositionAsync()}async repositionAsync(e=!0){let t=this.popupElement,n=this.arrow?this.arrowElement:null;if(!this.active||!this.anchorElement||!t)return!1;let i=bf(this.anchorElement,this.boundary),o=[r({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?o.push(a({apply:({rects:e})=>{let n=this.sync===`width`||this.sync===`both`,r=this.sync===`height`||this.sync===`both`;t.style.width=n?`${e.reference.width}px`:``,t.style.height=r?`${e.reference.height}px`:``}})):(t.style.width=``,t.style.height=``),this.flip&&o.push(l({boundary:i,fallbackPlacements:this.flipFallbackPlacements?this.flipFallbackPlacements.split(` `).map(e=>e.trim()).filter(Boolean):void 0,fallbackStrategy:this.flipFallbackStrategy===`best-fit`?`bestFit`:`initialPlacement`,padding:this.flipPadding})),this.shift&&o.push(g({boundary:i,padding:this.shiftPadding})),this.arrow&&n&&o.push(_({element:n,padding:this.arrowPadding}));let s=yf(this.positionMethod),c=s===`fixed`;t.classList.toggle(`popup-fixed`,c);let u=df?e=>p.getOffsetParent(e,ff):p.getOffsetParent,{x:d,y:f,middlewareData:m,placement:v}=await h(this.anchorElement,t,{placement:this.placement,middleware:o,strategy:s,platform:{...p,getOffsetParent:u}});if(!this.active||!t.isConnected)return!1;let y={top:`bottom`,right:`left`,bottom:`top`,left:`right`}[v.split(`-`)[0]];if(this.setAttribute(`data-current-placement`,v),Object.assign(t.style,{left:`${d}px`,top:`${f}px`,...c?{position:`fixed`}:{position:``}}),this.anchorElement){let e=this.anchorElement.getBoundingClientRect(),n=t.getBoundingClientRect();t.style.setProperty(`--pk-anchor-width`,`${e.width}px`),t.style.setProperty(`--pk-anchor-height`,`${e.height}px`);let r=cf(v,e,n,this.distance,m.shift);t.style.setProperty(`--pk-transform-origin`,r)}if(this.arrow&&n){let e=m.arrow?.x,t=m.arrow?.y,r=``,i=``,a=``,o=``;if(this.arrowPlacement===`start`){let n=typeof e==`number`?`${this.arrowPadding}px`:``;r=typeof t==`number`?`${this.arrowPadding}px`:``,o=n}else this.arrowPlacement===`end`?(i=typeof e==`number`?`${this.arrowPadding}px`:``,a=typeof t==`number`?`${this.arrowPadding}px`:``):this.arrowPlacement===`center`?(o=typeof e==`number`?`50%`:``,r=typeof t==`number`?`50%`:``):(o=typeof e==`number`?`${e}px`:``,r=typeof t==`number`?`${t}px`:``);Object.assign(n.style,{top:r,right:i,bottom:a,left:o,transform:``,[y]:`calc(-1 * var(--pk-popup-arrow-size, 6px) / 2)`})}return requestAnimationFrame(()=>this.updateHoverBridge()),e&&this.dispatchEvent(new gf),!0}frames(e){return new Promise(t=>{let n=e=>{if(e<=0){t();return}requestAnimationFrame(()=>n(e-1))};n(e)})}async settleInitialPosition(){let e=++this.settleGeneration,t=this.popupElement;if(!t){this.settlingInitialPosition=!1;return}await this.frames(2),!(!this.active||e!==this.settleGeneration)&&(await this.repositionAsync(!1),t.offsetHeight,await this.frames(1),!(!this.active||e!==this.settleGeneration)&&(await this.repositionAsync(!1),!(!this.active||e!==this.settleGeneration)&&(t.classList.add(`positioned`),this.settlingInitialPosition=!1,requestAnimationFrame(()=>this.updateHoverBridge()),this.dispatchEvent(new gf))))}resolveAnchor(){if(typeof this.anchor==`string`&&this.anchor){this.anchorElement=hf(this,this.anchor);return}if(this.anchor instanceof Element||vf(this.anchor)){this.anchorElement=this.anchor;return}let e=this.querySelector(`[slot="anchor"]`);e instanceof HTMLSlotElement&&(e=e.assignedElements({flatten:!0})[0]??null),this.anchorElement=e}async handleAnchorChange(){await this.stop(),this.resolveAnchor(),this.anchorElement&&this.active&&this.start()}usesPopoverTopLayer(){return df&&this.positionMethod!==`fixed`}stop(){return new Promise(e=>{let t=this.popupElement;this.settleGeneration+=1,this.settlingInitialPosition=!1,t?.classList.remove(`positioned`),this.usesPopoverTopLayer()&&t?.hidePopover?.(),this.cleanup?(this.cleanup(),this.cleanup=void 0,t?.style.removeProperty(`--pk-transform-origin`),requestAnimationFrame(()=>e())):e(),this.removeAttribute(`data-current-placement`)})}releasePositioning(){this.cleanup&&=(this.cleanup(),void 0)}async awaitHidden(){await this.stop()}start(){!this.anchorElement||!this.active||!this.isConnected||!this.popupElement||(this.popupElement.classList.remove(`positioned`),this.settlingInitialPosition=!0,this.usesPopoverTopLayer()&&this.popupElement.showPopover?.(),this.anchorTracking&&(this.cleanup=f(this.anchorElement,this.popupElement,()=>{this.settlingInitialPosition||this.reposition()})),this.settleInitialPosition())}getContentElement(){let e=((this.shadowRoot?.querySelector(`slot:not([name])`))?.assignedElements({flatten:!0})??[]).find(e=>e instanceof HTMLElement);if(e)return e;for(let e of this.childNodes)if(e instanceof HTMLElement&&e.getAttribute(`slot`)!==`anchor`)return e;return null}updateHoverBridge(){let e=this.popupElement;if(!this.hoverBridge||!this.anchorElement||!e)return;let t=this.anchorElement.getBoundingClientRect(),n=e.getBoundingClientRect(),r=this.placement.includes(`top`)||this.placement.includes(`bottom`),i=0,a=0,o=0,s=0,c=0,l=0,u=0,d=0;r?t.top<n.top?(i=t.left,a=t.bottom,o=t.right,s=t.bottom,c=n.left,l=n.top,u=n.right,d=n.top):(i=n.left,a=n.bottom,o=n.right,s=n.bottom,c=t.left,l=t.top,u=t.right,d=t.top):t.left<n.left?(i=t.right,a=t.top,o=n.left,s=n.top,c=t.right,l=t.bottom,u=n.left,d=n.bottom):(i=n.right,a=n.top,o=t.left,s=t.top,c=n.right,l=n.bottom,u=t.left,d=t.bottom),this.style.setProperty(`--pk-hover-bridge-top-left-x`,`${i}px`),this.style.setProperty(`--pk-hover-bridge-top-left-y`,`${a}px`),this.style.setProperty(`--pk-hover-bridge-top-right-x`,`${o}px`),this.style.setProperty(`--pk-hover-bridge-top-right-y`,`${s}px`),this.style.setProperty(`--pk-hover-bridge-bottom-left-x`,`${c}px`),this.style.setProperty(`--pk-hover-bridge-bottom-left-y`,`${l}px`),this.style.setProperty(`--pk-hover-bridge-bottom-right-x`,`${u}px`),this.style.setProperty(`--pk-hover-bridge-bottom-right-y`,`${d}px`)}render(){let t=!df||this.positionMethod===`fixed`,n=this.usesPopoverTopLayer();return e`
            <slot name="anchor" @slotchange=${()=>{this.handleAnchorChange()}}></slot>
            ${this.hoverBridge?e`
                <div
                    part="hover-bridge"
                    class=${Ol({"hover-bridge":!0,"hover-bridge-visible":this.active})}
                    aria-hidden="true"
                ></div>
            `:i}
            <div
                popover=${n?`manual`:i}
                part="popup"
                class=${Ol({popup:!0,active:this.active,"popup-fixed":t})}
            >
                ${this.arrow?e`<div part="arrow" class="arrow"></div>`:i}
                <slot></slot>
            </div>
        `}};X([n()],Z.prototype,`anchor`,void 0),X([n({type:Boolean,reflect:!0})],Z.prototype,`active`,void 0),X([n({attribute:`position-method`})],Z.prototype,`positionMethod`,void 0),X([n({reflect:!0})],Z.prototype,`boundary`,void 0),X([n({reflect:!0})],Z.prototype,`placement`,void 0),X([n({type:Number})],Z.prototype,`distance`,void 0),X([n({type:Number})],Z.prototype,`skidding`,void 0),X([n({type:Boolean})],Z.prototype,`flip`,void 0),X([n({attribute:`flip-fallback-placements`})],Z.prototype,`flipFallbackPlacements`,void 0),X([n({attribute:`flip-fallback-strategy`})],Z.prototype,`flipFallbackStrategy`,void 0),X([n({attribute:`flip-padding`,type:Number})],Z.prototype,`flipPadding`,void 0),X([n({type:Boolean})],Z.prototype,`shift`,void 0),X([n({attribute:`shift-padding`,type:Number})],Z.prototype,`shiftPadding`,void 0),X([n({type:Boolean})],Z.prototype,`arrow`,void 0),X([n({attribute:`arrow-placement`})],Z.prototype,`arrowPlacement`,void 0),X([n({attribute:`arrow-padding`,type:Number})],Z.prototype,`arrowPadding`,void 0),X([n()],Z.prototype,`sync`,void 0),X([n({attribute:`anchor-tracking`,type:Boolean})],Z.prototype,`anchorTracking`,void 0),X([n({attribute:`hover-bridge`,type:Boolean})],Z.prototype,`hoverBridge`,void 0),X([ae(`.popup`)],Z.prototype,`popupElement`,void 0),X([ae(`.arrow`)],Z.prototype,`arrowElement`,void 0),Z=X([y(`pk-popup`)],Z);var xf=new Set([`ArrowDown`,`ArrowUp`,`ArrowLeft`,`ArrowRight`,`Home`,`End`,`Enter`,` `,`Escape`]);function Sf(e){return e.key.length===1&&!e.ctrlKey&&!e.metaKey&&!e.altKey}function Cf(e){return e.filter(e=>!e.hasAttribute(`disabled`)&&!e.hasAttribute(`hidden`)&&e.getAttribute(`aria-disabled`)!==`true`&&e.getAttribute(`aria-hidden`)!==`true`)}function wf(e,t,n){if(n){n(t);return}let r=e[t];if(r instanceof HTMLElement&&`focusControl`in r&&typeof r.focusControl==`function`){r.focusControl();return}r?.focus()}function Tf(e){if(!e)return;let t=e.shadowRoot?.querySelector(`.option`);if(t instanceof HTMLButtonElement){t.click();return}e.click()}function Ef(e,t){let n=Cf(t.items),r=t.loop===!0;if(n.length===0)return t.currentIndex;let i=Math.max(0,t.currentIndex),a=n[i]??n[0];switch(i=n.indexOf(a),i<0&&(i=0),e.key){case`ArrowDown`:case`ArrowRight`:return e.preventDefault(),i=r&&i>=n.length-1?0:Math.min(i+1,n.length-1),wf(n,i,t.focusItem),t.onSelect(i),i;case`ArrowUp`:case`ArrowLeft`:return e.preventDefault(),i=r&&i<=0?n.length-1:Math.max(i-1,0),wf(n,i,t.focusItem),t.onSelect(i),i;case`Home`:return e.preventDefault(),i=0,wf(n,i,t.focusItem),t.onSelect(i),i;case`End`:return e.preventDefault(),i=n.length-1,wf(n,i,t.focusItem),t.onSelect(i),i;case`Enter`:case` `:return t.multiselect||(e.preventDefault(),Tf(n[i])),i;case`Escape`:return e.preventDefault(),t.onClose?.(),i;default:return i}}function Df(e,t){let n=``,r=0,i=()=>{n=``,window.clearTimeout(r)};return{handleKey:a=>{if(a.key.length!==1||a.ctrlKey||a.metaKey||a.altKey)return;n+=a.key.toLowerCase(),window.clearTimeout(r),r=window.setTimeout(i,750);let o=Cf(e);for(let e=0;e<o.length;e+=1)if((o[e]?.textContent??``).trim().toLowerCase().startsWith(n)){t(e),a.preventDefault();return}},reset:i}}var Of=e=>e.hidden||e.hasAttribute(`data-pk-filter-empty`),kf=e=>{let t=[...e.querySelectorAll(`:scope > pk-option, :scope > pk-option-group, :scope > pk-separator`)],n=(e,n)=>{for(let r=e+n;n<0?r>=0:r<t.length;r+=n){let e=t[r];if(!(!e||e.localName===`pk-separator`))return e}return null};for(let e=0;e<t.length;e+=1){let r=t[e];if(!r||r.localName!==`pk-separator`)continue;let i=n(e,-1),a=n(e,1);r.hidden=!i||!a||Of(i)||Of(a)}};function Af(e){if(e.panel instanceof Element){let t=e.panel.closest(`pk-popup`);if(t)return t;let n=e.panel.getRootNode();if(n instanceof ShadowRoot&&n.host.localName===`pk-popup`)return n.host}return e.host instanceof HTMLElement?e.host.shadowRoot?.querySelector(`pk-popup`)??e.host.querySelector(`:scope > pk-popup`)??e.host.querySelector(`pk-popup`):null}function jf(e,t={}){let n=e.composedPath();if(t.host&&n.includes(t.host)||t.anchor&&n.includes(t.anchor)||t.panel&&n.includes(t.panel))return!0;let r=Af(t);return r&&n.includes(r)?!0:n.some(e=>e instanceof HTMLElement?r&&e.classList.contains(`popup`)&&(e===r||r.contains(e))?!0:t.extraMatches?.(e)??!1:!1)}function Mf(e,t={}){return jf(e,t)}var Nf=b`
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
`;function Pf(e,t,n=500){return new Promise(r=>{let i=new AbortController,{signal:a}=i;if(e.classList.contains(t)){r();return}e.classList.add(t);let o=!1,s=()=>{o||(o=!0,e.classList.remove(t),window.clearTimeout(c),r(),i.abort())};e.addEventListener(`animationend`,s,{once:!0,signal:a}),e.addEventListener(`animationcancel`,s,{once:!0,signal:a});let c=window.setTimeout(s,n);requestAnimationFrame(()=>{!o&&e.getAnimations().length===0&&s()})})}function Ff(e={}){let{validationElement:t,validationProperty:n}=e;!t&&typeof document<`u`&&(t=Object.assign(document.createElement(`input`),{required:!0})),n||=`value`;let r={observedAttributes:[`required`],message:t?.validationMessage??`Please fill out this field.`,checkValidity(e){let t={message:``,isValid:!0,invalidKeys:[]};if(!e.required)return t;let i=e[n];return i!=null&&i!==!1&&i!==``?t:(t.isValid=!1,t.message=typeof r.message==`function`?r.message(e):r.message??``,t.invalidKeys.push(`valueMissing`),t)}};return r}var If=b`
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
`;function Lf(e,t){return t||(e.getAttribute(`hint`)??``)}function Rf(e,t,n=!1){return!!t||e(`instructions`,n)||e(`hint`)}var zf=b`
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
`,Bf=e`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" aria-hidden="true">
        <path fill="currentColor" d="M557.5 192L534.9 214.6L278.9 470.6C266.4 483.1 246.1 483.1 233.6 470.6L105.6 342.6L83 320L128.3 274.7C129.6 276 172.3 318.7 256.3 402.7L489.7 169.3L512.3 146.7L557.6 192z" />
    </svg>
`,Vf=class extends Fd{constructor(...e){super(...e),this.assumeInteractionOn=[`change`],this.hasSlotController=new Ld(this,`instructions`,`hint`),this.checked=!1,this.defaultChecked=!1,this.invalid=!1,this.size=`default`,this.value=`on`,this.label=``,this.instructions=``}static{this.shadowRootOptions={mode:`open`,delegatesFocus:!0}}static{this.styles=[If,zf]}static get validators(){return[...super.validators,Id(),Ff({validationProperty:`checked`})]}connectedCallback(){this.instructions=Lf(this,this.instructions),super.connectedCallback()}get validationTarget(){return this.input}syncFormValue(){this.setFormValue(this.checked?this.value:null,this.checked?`on`:`off`)}resetToDefaultValue(){this.checked=this.defaultChecked}restoreFormState(e){this.checked=e===`on`||e===this.value}updated(e){this.input&&e.has(`checked`)&&(this.input.checked=this.checked),super.updated(e)}click(){this.switchElement?.click()}focus(e){this.switchElement?.focus(e)}blur(){this.switchElement?.blur()}toggle(){this.disabled||(this.checked=!this.checked,this.emitCheckedChange())}handleKeyDown(e){let t=this.matches(`:dir(rtl)`);if(e.key===` `||e.key===`Enter`){e.preventDefault(),this.toggle();return}if(e.key===`ArrowLeft`){e.preventDefault(),this.checked=t,this.emitCheckedChange();return}e.key===`ArrowRight`&&(e.preventDefault(),this.checked=!t,this.emitCheckedChange())}emitCheckedChange(){this.hasInteracted=!0,this.dispatchEvent(new CustomEvent(`pk-change`,{detail:{checked:this.checked},bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`input`,{bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0}))}handleLabelClick(e){this.disabled||e.target===this.switchElement||this.toggle()}hasLabelContent(){if(this.label)return!0;let e=this.shadowRoot?.querySelector(`slot:not([name])`);return e?e.assignedNodes({flatten:!0}).some(e=>e.nodeType===Node.TEXT_NODE?!!e.textContent?.trim():e.nodeType===Node.ELEMENT_NODE):!1}render(){let t=Rf((e,t)=>this.hasSlotController.test(e,t),this.instructions),n=this.hasLabelContent();return e`
            <div part="base" class="base">
                <button
                    part="switch"
                    class="switch"
                    type="button"
                    role="switch"
                    ?disabled=${this.disabled}
                    aria-checked=${this.checked?`true`:`false`}
                    aria-invalid=${this.invalid?`true`:i}
                    aria-describedby=${t?`instructions`:i}
                    aria-labelledby=${n?`label`:i}
                    @click=${this.toggle}
                    @keydown=${this.handleKeyDown}
                >
                    <span part="thumb" class="thumb">${Bf}</span>
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
                    aria-invalid=${this.invalid?`true`:i}
                    @change=${e=>e.stopPropagation()}
                />
                ${n||t?e`
                        <div class="content" @click=${this.handleLabelClick}>
                            ${n?e`
                                    <span part="label" class="label" id="label">
                                        <slot></slot>${this.label}
                                    </span>
                                `:i}
                            ${t?e`
                                    <span part="instructions" class="instructions form-control__instructions" id="instructions">
                                        <slot name="instructions">${this.instructions}</slot>
                                        <slot name="hint"></slot>
                                    </span>
                                `:i}
                        </div>
                    `:i}
            </div>
        `}};X([n({type:Boolean,reflect:!0})],Vf.prototype,`checked`,void 0),X([n({attribute:`default-checked`,type:Boolean})],Vf.prototype,`defaultChecked`,void 0),X([n({type:Boolean,reflect:!0})],Vf.prototype,`invalid`,void 0),X([n({reflect:!0})],Vf.prototype,`size`,void 0),X([n()],Vf.prototype,`value`,void 0),X([n()],Vf.prototype,`label`,void 0),X([n()],Vf.prototype,`instructions`,void 0),X([ae(`.input`)],Vf.prototype,`input`,void 0),X([ae(`[part="switch"]`)],Vf.prototype,`switchElement`,void 0),Vf=X([y(`pk-lightswitch`)],Vf);function Hf(e,t){let n=String(e??``),r=String(t??``).trim();if(!r)return[{text:n,match:!1}];let i=n.toLowerCase(),a=r.toLowerCase(),o=[],s=0,c=i.indexOf(a);for(;c!==-1;)c>s&&o.push({text:n.slice(s,c),match:!1}),o.push({text:n.slice(c,c+r.length),match:!0}),s=c+r.length,c=i.indexOf(a,s);return s<n.length&&o.push({text:n.slice(s),match:!1}),o.length>0?o:[{text:n,match:!1}]}var Uf=b`
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
`,Wf=_d(Od.check),Gf=class extends El{constructor(...e){super(...e),this.value=``,this.label=``,this.disabled=!1,this.selected=!1,this.highlighted=!1,this.hidden=!1,this.focusIndex=-1,this.optionId=``,this.matchQuery=``}static{this.styles=Uf}focusControl(e=!0){this.shadowRoot?.querySelector(`.option`)?.focus({preventScroll:e})}getLabel(){if(this.label.trim())return this.label.trim();let e=this.shadowRoot?.querySelector(`slot:not([name])`);return e?e.assignedNodes().map(e=>(e.textContent??``).trim()).filter(Boolean).join(` `).trim():this.textContent?.trim()??this.value}getSearchText(){let e=this.shadowRoot?.querySelector(`slot:not([name])`);return e&&e.assignedNodes().map(e=>(e.textContent??``).trim()).filter(Boolean).join(` `).trim()||this.getLabel()}hasRichLabelContent(){return[...this.children].some(e=>e instanceof HTMLElement?!e.slot||e.slot===``:!1)}getStartElements(){return[...this.querySelectorAll(`:scope > [slot="start"]`)].filter(e=>e instanceof HTMLElement)}firstUpdated(){(this.shadowRoot?.querySelector(`slot[name="start"]`))?.addEventListener(`slotchange`,()=>this.syncStartDecoration()),this.syncStartDecoration()}syncStartDecoration(){this.toggleAttribute(`data-has-start`,this.getStartElements().length>0)}handleClick(){this.disabled||this.dispatchEvent(new CustomEvent(`pk-option-select`,{detail:{value:this.value},bubbles:!0,composed:!0}))}handleMouseEnter(){this.disabled||this.hidden||this.dispatchEvent(new CustomEvent(`pk-option-highlight`,{detail:{value:this.value},bubbles:!0,composed:!0}))}handleKeyDown(e){if(!new Set([`ArrowDown`,`ArrowUp`,`ArrowLeft`,`ArrowRight`,`Home`,`End`,`Enter`,` `,`Escape`]).has(e.key))return;let t=this.closest(`pk-select, pk-combobox`),n=t?null:this.closest(`[role="listbox"]`);if(!t&&!n)return;e.preventDefault(),e.stopPropagation();let r=new CustomEvent(`pk-listbox-keydown`,{detail:{keyboardEvent:e},bubbles:!0});if(t){t.dispatchEvent(r);return}n.dispatchEvent(r)}renderLabel(){let t=this.matchQuery.trim();return!t||this.hasRichLabelContent()?e`
                <span part="label" class="label">
                    <slot></slot>
                </span>
            `:e`
            <span part="label" class="label">
                ${Hf(this.getLabel(),t).map(t=>t.match?e`<mark class="match">${t.text}</mark>`:e`<span>${t.text}</span>`)}
            </span>
        `}render(){return e`
            <button
                part="option"
                type="button"
                class="option"
                role="option"
                id=${this.optionId||i}
                ?disabled=${this.disabled}
                aria-disabled=${this.disabled?`true`:i}
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
                <span part="check" class="check" aria-hidden="true">${Al(Wf)}</span>
            </button>
        `}};X([n()],Gf.prototype,`value`,void 0),X([n()],Gf.prototype,`label`,void 0),X([n({type:Boolean,reflect:!0})],Gf.prototype,`disabled`,void 0),X([n({type:Boolean,reflect:!0})],Gf.prototype,`selected`,void 0),X([n({type:Boolean,reflect:!0})],Gf.prototype,`highlighted`,void 0),X([n({type:Boolean,reflect:!0})],Gf.prototype,`hidden`,void 0),X([n({type:Number,attribute:`focus-index`})],Gf.prototype,`focusIndex`,void 0),X([n()],Gf.prototype,`optionId`,void 0),X([n({attribute:!1})],Gf.prototype,`matchQuery`,void 0),Gf=X([y(`pk-option`)],Gf);var Kf=[Nf,b`
    ${Dl}
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
`],qf=_d(Od.chevronDown),Q=class extends Fd{constructor(...e){super(...e),this.assumeInteractionOn=[`blur`,`input`],this.open=!1,this.multiple=!1,this.placement=`bottom-start`,this.sideOffset=4,this.clearable=!1,this.withClear=!1,this.invalid=!1,this.size=`default`,this.placeholder=``,this.value=``,this.defaultValue=``,this.values=[],this.defaultValues=[],this.ariaLabel=null,this.loopFocus=!1,this.hasSlotController=new Ld(this,`start`,`end`),this.listboxId=zd(`pk-select-listbox`),this.triggerId=zd(`pk-select-trigger`),this.options=[],this.highlightedIndex=0,this.dismissRegistered=!1,this.panelEventTarget=null,this.typeToSelect=Df([],()=>{}),this.closing=!1,this.panelAnimated=!1,this.handleOptionsMutation=(e={})=>{let t=this.getOptionElements(),n=t.length!==this.options.length||t.some((e,t)=>e!==this.options[t]);this.options=t,this.applySelection(),this.updateTypeToSelect(),e.render!==!1&&n&&this.requestUpdate()},this.syncOptions=()=>{this.handleOptionsMutation({render:!0})},this.togglePanel=e=>{e?.preventDefault(),e?.stopPropagation(),!(this.disabled||this.closing)&&(this.open?this.closePanel(`api`):this.openPanel())},this.onDocumentPointerDown=e=>{this.isPointerInside(e)||this.closePanel(`light-dismiss`)},this.onDocumentKeyDown=e=>{if(this.open){if(e.key===`Escape`){if(!Wd(this))return;e.preventDefault(),e.stopPropagation(),this.closePanel(`escape`);return}(xf.has(e.key)||Sf(e))&&jf(e,{anchor:this.getPopupAnchor(),panel:this.panelElement})&&(e.preventDefault(),e.stopPropagation(),this.onListboxKeyDown(e))}},this.handleOptionSelect=e=>{let{value:t}=e.detail;this.multiple?this.values=this.values.includes(t)?this.values.filter(e=>e!==t):[...this.values,t]:(this.value=t,this.closePanel(`api`)),this.applySelection(),this.emitValueChange()},this.handleOptionHighlight=e=>{if(!this.open)return;let t=this.getEnabledVisibleOptions().findIndex(t=>t.value===e.detail.value);t!==-1&&t!==this.highlightedIndex&&(this.highlightedIndex=t,this.syncHighlight())},this.onKeyDown=e=>{if(!this.open){(e.key===`ArrowDown`||e.key===`Enter`||e.key===` `)&&(e.preventDefault(),this.openPanel());return}this.onListboxKeyDown(e)},this.handleListboxKeyDownEvent=e=>{this.open&&this.onListboxKeyDown(e.detail.keyboardEvent)}}static{this.styles=Kf}static get validators(){return[...super.validators,Id(),{observedAttributes:[`required`],checkValidity:e=>{let t=e,n={message:`Please select an item in the list.`,isValid:!0,invalidKeys:[]};return!t.required||!(t.multiple?t.values.length===0:!t.value)?n:(n.isValid=!1,n.invalidKeys.push(`valueMissing`),n)}}]}get panelElement(){return this.popupElement?.getContentElement()??null}connectedCallback(){this.refreshOptions(),super.connectedCallback(),this.addEventListener(`pk-listbox-keydown`,this.handleListboxKeyDownEvent),this.addEventListener(`keydown`,this.onKeyDown),this.optionsObserver=new MutationObserver(()=>{this.handleOptionsMutation({render:!0})}),this.optionsObserver.observe(this,{childList:!0,subtree:!0})}disconnectedCallback(){this.unbindPanelEvents(),this.removeEventListener(`pk-listbox-keydown`,this.handleListboxKeyDownEvent),this.removeEventListener(`keydown`,this.onKeyDown),this.optionsObserver?.disconnect(),this.closePanel(`api`),super.disconnectedCallback()}updated(e){(e.has(`value`)||e.has(`values`)||e.has(`multiple`))&&this.applySelection(),super.updated(e)}getOptionElements(){let e=this.popupElement?.getContentElement()?.querySelectorAll(`pk-option`);return e&&e.length>0?[...e]:[...this.querySelectorAll(`pk-option`)]}refreshOptions(){this.handleOptionsMutation({render:!1})}bindPanelEvents(){let e=this.panelElement;!e||e===this.panelEventTarget||(this.unbindPanelEvents(),this.panelEventTarget=e,e.addEventListener(`pk-option-select`,this.handleOptionSelect),e.addEventListener(`pk-option-highlight`,this.handleOptionHighlight),e.addEventListener(`pk-listbox-keydown`,this.handleListboxKeyDownEvent))}unbindPanelEvents(){this.panelEventTarget&&=(this.panelEventTarget.removeEventListener(`pk-option-select`,this.handleOptionSelect),this.panelEventTarget.removeEventListener(`pk-option-highlight`,this.handleOptionHighlight),this.panelEventTarget.removeEventListener(`pk-listbox-keydown`,this.handleListboxKeyDownEvent),null)}get validationTarget(){return this.input??this.triggerButton??this.controlElement}getAriaMirrorTarget(){return this.triggerButton??this.controlElement??null}syncFormValue(){if(!this.name){this.setFormValue(null);return}if(this.multiple){let e=new FormData;for(let t of this.values)e.append(this.name,t);this.setFormValue(e);return}this.setFormValue(this.value||``)}resetToDefaultValue(){this.multiple?this.values=[...this.defaultValues]:this.value=this.defaultValue,this.applySelection()}restoreFormState(e){if(e instanceof FormData&&this.name){this.values=e.getAll(this.name).map(String);return}typeof e==`string`&&(this.value=e)}isOptionInHiddenGroup(e){return!!e.closest(`pk-option-group`)?.hidden}getVisibleOptions(){return this.options.filter(e=>!this.isOptionInHiddenGroup(e))}getEnabledVisibleOptions(){return this.getVisibleOptions().filter(e=>!e.disabled)}isSelected(e){return this.multiple?this.values.includes(e):this.value===e}applySelection(){let e=this.getVisibleOptions();for(let t of this.options)t.selected=this.isSelected(t.value),t.hidden=!e.includes(t),t.optionId=`${this.listboxId}-option-${t.value}`;for(let e of this.querySelectorAll(`pk-option-group`)){let t=[...e.querySelectorAll(`pk-option`)];e.hidden=t.length>0&&t.every(e=>e.hidden)}kf(this),this.syncValueInput(),this.syncTriggerDecorations(),this.open&&this.syncHighlight()}syncValueInput(){if(this.input){if(this.multiple){this.input.value=this.values.join(`,`),this.input.required=this.required;return}this.input.value=this.value,this.input.required=this.required}}getDisplayValue(){if(this.multiple){let e=this.getSelectedOptions().map(e=>e.getLabel());return e.length>0?e.join(`, `):this.placeholder}return this.options.find(e=>e.value===this.value)?.getLabel()||this.placeholder}getSelectedOptions(){return this.options.filter(e=>this.isSelected(e.value))}syncTriggerDecorations(){let e=this.triggerStartElement;if(!e||this.multiple)return;e.replaceChildren(),e.classList.remove(`has-decoration`);let t=this.options.find(e=>e.value===this.value);if(t){for(let n of t.getStartElements())e.append(n.cloneNode(!0));e.classList.toggle(`has-decoration`,e.childElementCount>0)}}hasSelection(){return this.multiple?this.values.length>0:this.options.some(e=>e.value===this.value)||!!this.value}syncHighlightedIndexToSelection(){if(this.multiple)return;let e=this.getEnabledVisibleOptions();if(e.length===0)return;let t=e.findIndex(e=>e.value===this.value);t>=0&&(this.highlightedIndex=t)}syncHighlight(){let e=this.getEnabledVisibleOptions();for(let e of this.options)e.highlighted=!1,e.focusIndex=-1;if(e.length===0){this.highlightedIndex=0;return}this.highlightedIndex>=e.length&&(this.highlightedIndex=0);let t=e[this.highlightedIndex];t&&this.panelElement&&(t.highlighted=!0,t.focusIndex=0,ef(t,this.panelElement,`vertical`,`auto`))}updateTypeToSelect(){this.typeToSelect=Df(this.getEnabledVisibleOptions(),e=>{this.highlightedIndex=e,this.syncHighlight(),this.getEnabledVisibleOptions()[e]?.focusControl()})}getPopupAnchor(){return this.controlElement??null}getActiveDescendantId(){return this.getEnabledVisibleOptions()[this.highlightedIndex]?.optionId||null}async show(){this.open||this.closing||this.disabled||await this.openPanel()}async hide(e=`api`){!this.open||this.closing||await this.closePanel(e)}openPanel(){let e=this.getPopupAnchor();if(!e||this.closing)return Promise.resolve();this.dispatchEvent(new nf),this.closing=!1,this.panelAnimated=!1,this.open=!0,this.popupElement.active=!0,this.applySelection(),this.syncHighlightedIndexToSelection(),this.panelElement&&(this.panelElement.hidden=!1,lf(this.panelElement,this.placement));let t=e.getBoundingClientRect().width;return this.style.setProperty(`--pk-select-anchor-width`,`${t}px`),this.registerDismissHandlers(),this.syncHighlight(),this.updateTypeToSelect(),this.updateComplete.then(async()=>{let e=await uf(this.popupElement,this.placement,300,{requireEvent:!0});this.panelElement&&lf(this.panelElement,e),this.panelAnimated=!0,this.bindPanelEvents(),this.refreshOptions(),this.getEnabledVisibleOptions()[this.highlightedIndex]?.focusControl(),this.dispatchEvent(new rf),this.dispatchEvent(new CustomEvent(`pk-open-change`,{detail:{open:!0},bubbles:!0,composed:!0}))})}async closePanel(e=`unknown`){if(!this.open||this.closing)return;let t=new af(e);this.dispatchEvent(t)&&(this.typeToSelect.reset(),this.unbindPanelEvents(),this.unregisterDismissHandlers(),this.closing=!0,this.panelAnimated=!1,await this.waitForExitAnimation(),this.open=!1,this.closing=!1,this.panelAnimated=!1,this.panelElement&&(this.panelElement.hidden=!0,this.panelElement.removeAttribute(`data-side`)),this.popupElement.active=!1,this.dispatchEvent(new of),this.dispatchEvent(new CustomEvent(`pk-open-change`,{detail:{open:!1},bubbles:!0,composed:!0})),this.shouldReturnFocusToTrigger(e)?this.triggerButton?.focus({preventScroll:!0}):this.triggerButton?.blur())}waitForExitAnimation(){let e=this.panelElement;return e?new Promise(t=>{let n=!1,r=()=>{n||(n=!0,e.removeEventListener(`animationend`,i),window.clearTimeout(a),e.classList.remove(`closing`),t())},i=t=>{t.target===e&&t.animationName.startsWith(`pk-popup-content-out`)&&r()};e.classList.add(`closing`),e.addEventListener(`animationend`,i);let a=window.setTimeout(r,150)}):Promise.resolve()}shouldReturnFocusToTrigger(e){return e!==`light-dismiss`&&e!==`pointer-dismiss`}registerDismissHandlers(){Hd(this),this.dismissRegistered=!0,document.addEventListener(`pointerdown`,this.onDocumentPointerDown,!0),document.addEventListener(`keydown`,this.onDocumentKeyDown,!0)}unregisterDismissHandlers(){this.dismissRegistered&&=(Ud(this),!1),document.removeEventListener(`pointerdown`,this.onDocumentPointerDown,!0),document.removeEventListener(`keydown`,this.onDocumentKeyDown,!0)}isPointerInside(e){return Mf(e,{anchor:this.getPopupAnchor(),panel:this.panelElement})}removeTag(e,t){t.preventDefault(),t.stopPropagation(),this.values=this.values.filter(t=>t!==e),this.applySelection(),this.emitValueChange()}handleClear(e){e.preventDefault(),e.stopPropagation(),this.multiple?this.values=[]:this.value=``,this.applySelection(),this.dispatchEvent(new tf),this.emitValueChange(),this.triggerButton?.focus()}emitValueChange(){this.dispatchEvent(new CustomEvent(`pk-change`,{detail:{value:this.multiple?[...this.values]:this.value},bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`input`,{bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0}))}onListboxKeyDown(e){let t=this.getEnabledVisibleOptions();this.highlightedIndex=Ef(e,{items:t,currentIndex:this.highlightedIndex,multiselect:this.multiple,loop:this.loopFocus,onSelect:e=>{this.highlightedIndex=e,this.syncHighlight()},focusItem:e=>{t[e]?.focusControl()},onClose:()=>{this.closePanel(`escape`)}}),e.key.length===1&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&this.typeToSelect.handleKey(e)}renderTags(){return this.getSelectedOptions().map(t=>e`
            <span class="tag" part="tag">
                <span class="tag-label">${t.getLabel()}</span>
                <button
                    type="button"
                    class="tag-remove"
                    part="tag-remove"
                    aria-label=${`Remove ${t.getLabel()}`}
                    @click=${e=>this.removeTag(t.value,e)}
                >
                    ×
                </button>
            </span>
        `)}renderChevronIcon(){return e`
            <span class="icon" aria-hidden="true">${Al(qf)}</span>
        `}renderHostDecorationSlot(t){return this.hasSlotController.test(t)?e`
            <span part=${t} class=${t===`start`?`control-start`:`control-end`}>
                <slot name=${t}></slot>
            </span>
        `:e`<slot name=${t} hidden></slot>`}render(){let t=this.getDisplayValue(),n=!this.hasSelection(),r=(this.clearable||this.withClear)&&this.hasSelection()&&!this.disabled;return e`
            <input
                class="value-input"
                part="value-input"
                tabindex="-1"
                aria-hidden="true"
                .value=${this.multiple?this.values.join(`,`):this.value}
                ?required=${this.required}
                @input=${()=>this.updateValidity()}
            />
            ${this.multiple?e`
                    <div
                        part="control"
                        class=${Ol({control:!0,"is-disabled":this.disabled})}
                    >
                        ${this.renderHostDecorationSlot(`start`)}
                        ${this.hasSelection()?e`
                                <div class="tags" part="tags">${this.renderTags()}</div>
                                ${r?e`
                                        <button
                                            type="button"
                                            class="clear-button"
                                            part="clear-button"
                                            aria-label="Clear selection"
                                            @click=${this.handleClear}
                                        >
                                            ×
                                        </button>
                                    `:i}
                            `:e`
                                <button
                                    part="trigger"
                                    type="button"
                                    class="trigger"
                                    id=${this.triggerId}
                                    ?disabled=${this.disabled}
                                    aria-label=${this.ariaLabel??i}
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
                `:e`
                    <button
                        part="control"
                        type="button"
                        class=${Ol({control:!0,"is-disabled":this.disabled})}
                        id=${this.triggerId}
                        ?disabled=${this.disabled}
                        aria-label=${this.ariaLabel??i}
                        aria-haspopup="listbox"
                        aria-expanded=${this.open?`true`:`false`}
                        aria-controls=${this.listboxId}
                        @click=${this.togglePanel}
                    >
                        ${this.renderHostDecorationSlot(`start`)}
                        <span part="trigger-start" class="trigger-start"></span>
                        <span
                            class=${Ol({value:!0,"is-placeholder":n})}
                        >${t}</span>
                        ${r?e`
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
                            `:i}
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
                    class=${Ol({panel:!0,"pk-popup-content":!0,closing:this.closing})}
                    id=${this.listboxId}
                    role="listbox"
                    aria-multiselectable=${this.multiple?`true`:`false`}
                    tabindex="-1"
                    ?hidden=${!this.open&&!this.closing}
                    data-open=${this.panelAnimated&&!this.closing?``:i}
                    @slotchange=${this.syncOptions}
                >
                    <slot></slot>
                </div>
            </pk-popup>
        `}};X([n({type:Boolean,reflect:!0})],Q.prototype,`open`,void 0),X([n({type:Boolean,reflect:!0})],Q.prototype,`multiple`,void 0),X([n({reflect:!0})],Q.prototype,`placement`,void 0),X([n({attribute:`side-offset`,type:Number})],Q.prototype,`sideOffset`,void 0),X([n({type:Boolean,reflect:!0})],Q.prototype,`clearable`,void 0),X([n({attribute:`with-clear`,type:Boolean})],Q.prototype,`withClear`,void 0),X([n({type:Boolean,reflect:!0})],Q.prototype,`invalid`,void 0),X([n({reflect:!0})],Q.prototype,`size`,void 0),X([n({reflect:!0})],Q.prototype,`width`,void 0),X([n()],Q.prototype,`placeholder`,void 0),X([n()],Q.prototype,`value`,void 0),X([n({attribute:`default-value`})],Q.prototype,`defaultValue`,void 0),X([n({type:Array,attribute:!1})],Q.prototype,`values`,void 0),X([n({attribute:!1})],Q.prototype,`defaultValues`,void 0),X([n({attribute:`aria-label`})],Q.prototype,`ariaLabel`,void 0),X([n({attribute:`loop-focus`,type:Boolean})],Q.prototype,`loopFocus`,void 0),X([ae(`.trigger-start`)],Q.prototype,`triggerStartElement`,void 0),X([ae(`pk-popup`)],Q.prototype,`popupElement`,void 0),X([ae(`.control`)],Q.prototype,`controlElement`,void 0),X([ae(`button.control, .control > button.trigger`)],Q.prototype,`triggerButton`,void 0),X([ae(`.value-input`)],Q.prototype,`input`,void 0),X([s()],Q.prototype,`highlightedIndex`,void 0),X([s()],Q.prototype,`closing`,void 0),X([s()],Q.prototype,`panelAnimated`,void 0),Q=X([y(`pk-select`)],Q);var Jf=b`
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
`,Yf=class extends El{constructor(...e){super(...e),this.label=``,this.hidden=!1,this.labelId=zd(`pk-option-group-label`)}static{this.styles=Jf}connectedCallback(){super.connectedCallback(),this.setAttribute(`role`,`group`),this.setAttribute(`aria-labelledby`,this.labelId)}render(){return e`
            <div part="label" class="label" id=${this.labelId}>${this.label}</div>
            <div role="presentation">
                <slot></slot>
            </div>
        `}};X([n({reflect:!0})],Yf.prototype,`label`,void 0),X([n({type:Boolean,reflect:!0})],Yf.prototype,`hidden`,void 0),Yf=X([y(`pk-option-group`)],Yf);var Xf=[b`
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
`,b`
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
    `],$=class extends El{constructor(...e){super(...e),this.placement=`top`,this.trigger=`hover focus`,this.disabled=!1,this.openDelay=0,this.closeDelay=0,this.content=``,this.for=``,this.open=!1,this.triggerElement=null,this.contentAnimated=!1,this.closing=!1,this.contentSide=null,this.hasSlottedBody=!1,this.triggerId=zd(`pk-tooltip-trigger`),this.tooltipId=zd(`pk-tooltip`),this.showGeneration=0,this.exitGeneration=0,this.syncPlacementAnimation=()=>{let e=this.popupElement?.getAttribute(`data-current-placement`)??this.placement,t=this.popupElement?.getContentElement();this.contentSide=e?sf(e):null,lf(this.popupElement,e),t&&lf(t,e)},this.onBodySlotChange=e=>{let t=e.target;this.hasSlottedBody=t.assignedNodes({flatten:!0}).some(e=>e.nodeType===Node.ELEMENT_NODE||e.nodeType===Node.TEXT_NODE&&!!e.textContent?.trim())},this.scheduleShow=()=>{this.usesPointerTrigger()&&(window.clearTimeout(this.closeTimer),window.clearTimeout(this.openTimer),this.openTimer=window.setTimeout(()=>this.showTooltip(),this.openDelay))},this.scheduleHide=()=>{this.usesPointerTrigger()&&(window.clearTimeout(this.openTimer),window.clearTimeout(this.closeTimer),this.closeTimer=window.setTimeout(()=>this.hideTooltip(),this.closeDelay))}}static{this.styles=Xf}disconnectedCallback(){this.popupElement?.removeEventListener(`pk-reposition`,this.syncPlacementAnimation),this.clearTimers(),this.hideTooltip(!0),super.disconnectedCallback()}updated(e){super.updated(e),(e.has(`trigger`)||e.has(`disabled`)||e.has(`for`))&&this.rebindTrigger(),this.disabled&&this.open&&this.hideTooltip(!0)}firstUpdated(){this.popupElement.addEventListener(`pk-reposition`,this.syncPlacementAnimation),this.for&&queueMicrotask(()=>{this.resolveExternalTrigger()})}async show(){this.disabled||(this.clearTimers(),this.showTooltip(!0),await this.updateComplete)}async hide(){this.clearTimers(),this.hideTooltip(!0),await this.updateComplete}clearTimers(){window.clearTimeout(this.openTimer),window.clearTimeout(this.closeTimer)}resolveExternalTrigger(){this.triggerElement=hf(this,this.for),this.rebindTrigger()}onTriggerSlotChange(e){let[t]=e.target.assignedElements({flatten:!0});this.unbindTrigger(this.triggerElement),this.triggerElement=t??null,this.rebindTrigger(),this.requestUpdate()}rebindTrigger(){this.unbindTrigger(this.triggerElement),this.for&&(this.triggerElement=hf(this,this.for)),this.bindTrigger(this.triggerElement)}usesPointerTrigger(){return!this.disabled&&this.trigger!==`manual`}bindTrigger(e){!e||!this.usesPointerTrigger()||(e.id||=this.triggerId,e.setAttribute(`aria-describedby`,this.tooltipId),e.addEventListener(`mouseenter`,this.scheduleShow),e.addEventListener(`mouseleave`,this.scheduleHide),e.addEventListener(`focus`,this.scheduleShow),e.addEventListener(`blur`,this.scheduleHide))}unbindTrigger(e){e&&(e.removeAttribute(`aria-describedby`),e.removeEventListener(`mouseenter`,this.scheduleShow),e.removeEventListener(`mouseleave`,this.scheduleHide),e.removeEventListener(`focus`,this.scheduleShow),e.removeEventListener(`blur`,this.scheduleHide))}getAnchor(){return this.for?hf(this,this.for):this.triggerElement?this.triggerElement:null}prepareContentForEnter(e){e&&(e.classList.remove(`closing`),e.style.animation=`none`,e.getBoundingClientRect(),e.style.removeProperty(`animation`),e.style.removeProperty(`opacity`),e.style.removeProperty(`transform`))}showTooltip(e=!1){if(!this.getAnchor()||this.open&&this.contentAnimated&&!this.closing&&!e)return;this.open||this.dispatchEvent(new nf);let t=++this.showGeneration;this.exitGeneration+=1,this.closing=!1,this.open=!0,this.contentAnimated=!1,this.prepareContentForEnter(this.popupElement?.getContentElement()),this.updateComplete.then(async()=>{t===this.showGeneration&&(await uf(this.popupElement,this.placement),t===this.showGeneration&&(this.syncPlacementAnimation(),this.prepareContentForEnter(this.popupElement?.getContentElement()),this.contentAnimated=!0,this.dispatchEvent(new rf),this.dispatchEvent(new CustomEvent(`pk-open-change`,{detail:{open:!0},bubbles:!0,composed:!0}))))})}hideTooltip(e=!1,t=!1){if(!(!this.open&&!this.closing&&!e)&&!(this.closing&&!e)){if(t){let e=new af(`api`);if(!this.dispatchEvent(e))return}if(this.showGeneration+=1,e){this.finishHide();return}if(!this.contentAnimated){this.finishHide();return}this.playExitAnimation()}}async playExitAnimation(){if(!this.open)return;let e=this.exitGeneration+1;this.exitGeneration=e;let t=this.popupElement?.getContentElement();this.closing=!0,this.contentAnimated=!1,t&&await this.waitForExitAnimation(t),e===this.exitGeneration&&this.finishHide()}waitForExitAnimation(e){return new Promise(t=>{let n=!1,r=()=>{n||(n=!0,e.removeEventListener(`animationend`,i),window.clearTimeout(a),e.classList.remove(`closing`),t())},i=t=>{t.target===e&&t.animationName.startsWith(`pk-tooltip-out`)&&r()};e.classList.add(`closing`),e.addEventListener(`animationend`,i);let a=window.setTimeout(r,200)})}finishHide(){let e=this.popupElement?.getContentElement();this.closing=!1,this.contentAnimated=!1,this.contentSide=null,this.open=!1,this.popupElement?.removeAttribute(`data-side`),this.prepareContentForEnter(e),this.dispatchEvent(new of),this.dispatchEvent(new CustomEvent(`pk-open-change`,{detail:{open:!1},bubbles:!0,composed:!0}))}render(){let t=this.getAnchor();return e`
            <slot name="trigger" @slotchange=${this.onTriggerSlotChange}></slot>
            <pk-popup
                .active=${this.open||this.closing}
                .anchor=${t??``}
                .placement=${this.placement}
                .distance=${4}
                hover-bridge
                flip
                shift
            >
                <div
                    part="content"
                    class=${Ol({content:!0,"pk-popup-content":!0,closing:this.closing})}
                    id=${this.tooltipId}
                    role="tooltip"
                    ?hidden=${!this.open&&!this.closing}
                    data-open=${this.contentAnimated&&!this.closing?``:i}
                    data-side=${this.contentSide??i}
                >
                    <slot @slotchange=${this.onBodySlotChange}></slot>
                    ${this.hasSlottedBody?i:this.content||i}
                </div>
            </pk-popup>
        `}};X([n({reflect:!0})],$.prototype,`placement`,void 0),X([n({reflect:!0})],$.prototype,`trigger`,void 0),X([n({type:Boolean,reflect:!0})],$.prototype,`disabled`,void 0),X([n({type:Number,attribute:`open-delay`})],$.prototype,`openDelay`,void 0),X([n({type:Number,attribute:`close-delay`})],$.prototype,`closeDelay`,void 0),X([n()],$.prototype,`content`,void 0),X([n({reflect:!0})],$.prototype,`for`,void 0),X([ae(`pk-popup`)],$.prototype,`popupElement`,void 0),X([s()],$.prototype,`open`,void 0),X([s()],$.prototype,`contentAnimated`,void 0),X([s()],$.prototype,`closing`,void 0),X([s()],$.prototype,`contentSide`,void 0),X([s()],$.prototype,`hasSlottedBody`,void 0),$=X([y(`pk-tooltip`)],$);export{wl as $,Dd as A,re as At,Jl as B,Hd as C,Tt as Ct,Ld as D,ce as Dt,zd as E,T as Et,ud as F,Qu as G,Zl as H,fd as I,Al as J,Fu as K,cd as L,vd as M,_d as N,Id as O,ve as Ot,hd as P,X as Q,Fl as R,Wd as S,Zt as St,Bd as T,S as Tt,lu as U,Yl as V,pu as W,Dl as X,Ol as Y,El as Z,nf as _,ro as _t,jf as a,Ao as at,ef as b,Nn as bt,Ef as c,Xi as ct,hf as d,Ei as dt,rl as et,lf as f,Va as ft,af as g,Wi as gt,rf as h,xo as ht,Nf as i,wc as it,Od as j,Fd as k,ae as kt,Sf as l,co as lt,of as m,U as mt,Ff as n,xl as nt,Mf as o,ko as ot,uf as p,Ii as pt,Yu as q,Pf as r,rc as rt,xf as s,go as st,If as t,ul as tt,kf as u,lo as ut,tf as v,Zr as vt,Ud as w,E as wt,$d as x,yi as xt,Qd as y,I as yt,Bl as z};
//# sourceMappingURL=tooltip-BJyhOjCv.js.map