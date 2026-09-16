import{C as e,S as t,_ as n,a as r,b as i,c as a,d as o,f as s,g as c,h as l,i as u,l as d,m as f,n as p,o as m,p as h,r as g,s as _,t as v,u as y,v as b,y as ee}from"./floating-ui.dom-C6Mj1-30.js";var te=(e,t,n)=>(n.configurable=!0,n.enumerable=!0,Reflect.decorate&&typeof t!=`object`&&Object.defineProperty(e,t,n),n);function ne(e,t){return(n,r,i)=>{let a=t=>t.renderRoot?.querySelector(e)??null;if(t){let{get:e,set:t}=typeof r==`object`?n:i??(()=>{let e=Symbol();return{get(){return this[e]},set(t){this[e]=t}}})();return te(n,r,{get(){let n=e.call(this);return n===void 0&&(n=a(this),(n!==null||this.hasUpdated)&&t.call(this,n)),n}})}return te(n,r,{get(){return a(this)}})}}var re=Symbol.for(`preact-signals`);function ie(){if(ce>1)ce--;else{var e,t=!1;for((function(){var e=fe;for(fe=void 0;e!==void 0;){var t=e.S;if(t.v===e.v)for(var n=t.t;n!==void 0;n=n.x)n.i===e.i&&(n.i=t.i);e=e.o}})();se!==void 0;){var n=se;for(se=void 0,le++;n!==void 0;){var r=n.u;if(n.u=void 0,n.f&=-3,!(8&n.f)&&ge(n))try{n.c()}catch(n){t||=(e=n,!0)}n=r}}if(le=0,ce--,t)throw e}}function ae(e){if(ce>0)return e();de=++ue,ce++;try{return e()}finally{ie()}}var oe,x=void 0;function S(e){var t=x,n=oe;x=void 0,oe=void 0;try{return e()}finally{x=t,oe=n}}var se=void 0,ce=0,le=0,ue=0,de=0,fe=void 0,pe=0;function me(e){if(x!==void 0){var t=e.n;if(t===void 0||t.t!==x)return t={i:0,S:e,p:x.s,n:void 0,t:x,e:void 0,x:void 0,r:t},x.s!==void 0&&(x.s.n=t),x.s=t,e.n=t,32&x.f&&e.S(t),t;if(t.i===-1)return t.i=0,t.n!==void 0&&(t.n.p=t.p,t.p!==void 0&&(t.p.n=t.n),t.p=x.s,t.n=void 0,x.s.n=t,x.s=t),t}}function C(e,t){this.v=e,this.i=0,this.n=void 0,this.t=void 0,this.l=0,this.W=t?.watched,this.Z=t?.unwatched,this.name=t?.name}C.prototype.brand=re,C.prototype.h=function(){return!0},C.prototype.S=function(e){var t=this,n=this.t;n!==e&&e.e===void 0&&(e.x=n,this.t=e,n===void 0?S(function(){var e;(e=t.W)==null||e.call(t)}):n.e=e)},C.prototype.U=function(e){var t=this;if(this.t!==void 0){var n=e.e,r=e.x;n!==void 0&&(n.x=r,e.e=void 0),r!==void 0&&(r.e=n,e.x=void 0),e===this.t&&(this.t=r,r===void 0&&S(function(){var e;(e=t.Z)==null||e.call(t)}))}},C.prototype.subscribe=function(e){var t=this;return T(function(){var n=t.value;S(function(){return e(n)})},{name:`sub`})},C.prototype.valueOf=function(){return this.value},C.prototype.toString=function(){return this.value+``},C.prototype.toJSON=function(){return this.value},C.prototype.peek=function(){var e=this;return S(function(){return e.value})},Object.defineProperty(C.prototype,"value",{get:function(){var e=me(this);return e!==void 0&&(e.i=this.i),this.v},set:function(e){if(e!==this.v){if(le>100)throw Error(`Cycle detected`);(function(e){ce!==0&&le===0&&e.l!==de&&(e.l=de,fe={S:e,v:e.v,i:e.i,o:fe})})(this),this.v=e,this.i++,pe++,ce++;try{for(var t=this.t;t!==void 0;t=t.x)t.t.N()}finally{ie()}}}});function he(e,t){return new C(e,t)}function ge(e){for(var t=e.s;t!==void 0;t=t.n)if(t.S.i!==t.i||!t.S.h()||t.S.i!==t.i)return!0;return!1}function _e(e){for(var t=e.s;t!==void 0;t=t.n){var n=t.S.n;if(n!==void 0&&(t.r=n),t.S.n=t,t.i=-1,t.n===void 0){e.s=t;break}}}function ve(e){for(var t=e.s,n=void 0;t!==void 0;){var r=t.p;t.i===-1?(t.S.U(t),r!==void 0&&(r.n=t.n),t.n!==void 0&&(t.n.p=r)):n=t,t.S.n=t.r,t.r!==void 0&&(t.r=void 0),t=r}e.s=n}function w(e,t){C.call(this,void 0,t),this.x=e,this.s=void 0,this.g=pe-1,this.f=4}w.prototype=new C,w.prototype.h=function(){if(this.f&=-3,1&this.f)return!1;if((36&this.f)==32||(this.f&=-5,this.g===pe))return!0;if(this.g=pe,this.f|=1,this.i>0&&!ge(this))return this.f&=-2,!0;var e=x;try{_e(this),x=this;var t=this.x();(16&this.f||this.v!==t||this.i===0)&&(this.v=t,this.f&=-17,this.i++)}catch(e){this.v=e,this.f|=16,this.i++}return x=e,ve(this),this.f&=-2,!0},w.prototype.S=function(e){if(this.t===void 0){this.f|=36;for(var t=this.s;t!==void 0;t=t.n)t.S.S(t)}C.prototype.S.call(this,e)},w.prototype.U=function(e){if(this.t!==void 0&&(C.prototype.U.call(this,e),this.t===void 0)){this.f&=-33;for(var t=this.s;t!==void 0;t=t.n)t.S.U(t)}},w.prototype.N=function(){if(!(2&this.f)){this.f|=6;for(var e=this.t;e!==void 0;e=e.x)e.t.N()}},Object.defineProperty(w.prototype,"value",{get:function(){if(1&this.f)throw Error(`Cycle detected`);var e=me(this);if(this.h(),e!==void 0&&(e.i=this.i),16&this.f)throw this.v;return this.v}});function ye(e,t){return new w(e,t)}function be(e){var t=e.m;if(e.m=void 0,typeof t==`function`){ce++;var n=x;x=void 0;try{t()}catch(t){throw e.f&=-2,e.f|=8,xe(e),t}finally{x=n,ie()}}}function xe(e){for(var t=e.s;t!==void 0;t=t.n)t.S.U(t);e.x=void 0,e.s=void 0,be(e)}function Se(e){if(x!==this)throw Error(`Out-of-order effect`);ve(this),x=e,this.f&=-2,8&this.f&&xe(this),ie()}function Ce(e,t){this.x=e,this.m=void 0,this.s=void 0,this.u=void 0,this.f=32,this.name=t?.name,oe&&oe.push(this)}Ce.prototype.c=function(){var e=this.S();try{if(8&this.f||this.x===void 0)return;var t=this.x();typeof t==`function`&&(this.m=t)}finally{e()}},Ce.prototype.S=function(){if(1&this.f)throw Error(`Cycle detected`);this.f|=1,this.f&=-9,be(this),_e(this),ce++;var e=x;return x=this,Se.bind(this,e)},Ce.prototype.N=function(){2&this.f||(this.f|=2,this.u=se,se=this)},Ce.prototype.d=function(){this.f|=8,1&this.f||xe(this)},Ce.prototype.dispose=function(){this.d()};function T(e,t){var n=new Ce(e,t);try{n.c()}catch(e){throw n.d(),e}var r=n.d.bind(n);return r[Symbol.dispose]=r,r}var we=Object.create,Te=Object.defineProperty,Ee=Object.defineProperties,De=Object.getOwnPropertyDescriptor,Oe=Object.getOwnPropertyDescriptors,ke=Object.getOwnPropertySymbols,Ae=Object.prototype.hasOwnProperty,je=Object.prototype.propertyIsEnumerable,Me=(e,t)=>(t=Symbol[e])?t:Symbol.for(`Symbol.`+e),Ne=e=>{throw TypeError(e)},Pe=(e,t,n)=>t in e?Te(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,Fe=(e,t)=>{for(var n in t||={})Ae.call(t,n)&&Pe(e,n,t[n]);if(ke)for(var n of ke(t))je.call(t,n)&&Pe(e,n,t[n]);return e},Ie=(e,t)=>Ee(e,Oe(t)),Le=(e,t)=>Te(e,`name`,{value:t,configurable:!0}),Re=e=>[,,,we(e?.[Me(`metadata`)]??null)],ze=[`class`,`method`,`getter`,`setter`,`accessor`,`field`,`value`,`get`,`set`],Be=e=>e!==void 0&&typeof e!=`function`?Ne(`Function expected`):e,Ve=(e,t,n,r,i)=>({kind:ze[e],name:t,metadata:r,addInitializer:e=>n._?Ne(`Already initialized`):i.push(Be(e||null))}),He=(e,t)=>Pe(t,Me(`metadata`),e[3]),Ue=(e,t,n,r)=>{for(var i=0,a=e[t>>1],o=a&&a.length;i<o;i++)t&1?a[i].call(n):r=a[i].call(n,r);return r},We=(e,t,n,r,i,a)=>{var o,s,c,l,u,d=t&7,f=!!(t&8),p=!!(t&16),m=d>3?e.length+1:d?f?1:2:0,h=ze[d+5],g=d>3&&(e[m-1]=[]),_=e[m]||(e[m]=[]),v=d&&(!p&&!f&&(i=i.prototype),d<5&&(d>3||!p)&&De(d<4?i:{get[n](){return qe(this,a)},set[n](e){return Ye(this,a,e)}},n));d?p&&d<4&&Le(a,(d>2?`set `:d>1?`get `:``)+n):Le(i,n);for(var y=r.length-1;y>=0;y--)l=Ve(d,n,c={},e[3],_),d&&(l.static=f,l.private=p,u=l.access={has:p?e=>Ke(i,e):e=>n in e},d^3&&(u.get=p?e=>(d^1?qe:Xe)(e,i,d^4?a:v.get):e=>e[n]),d>2&&(u.set=p?(e,t)=>Ye(e,i,t,d^4?a:v.set):(e,t)=>e[n]=t)),s=(0,r[y])(d?d<4?p?a:v[h]:d>4?void 0:{get:v.get,set:v.set}:i,l),c._=1,d^4||s===void 0?Be(s)&&(d>4?g.unshift(s):d?p?a=s:v[h]=s:i=s):typeof s!=`object`||!s?Ne(`Object expected`):(Be(o=s.get)&&(v.get=o),Be(o=s.set)&&(v.set=o),Be(o=s.init)&&g.unshift(o));return d||He(e,i),v&&Te(i,n,v),p?d^4?a:v:i},Ge=(e,t,n)=>t.has(e)||Ne(`Cannot `+n),Ke=(e,t)=>Object(t)===t?e.has(t):Ne(`Cannot use the "in" operator on this value`),qe=(e,t,n)=>(Ge(e,t,`read from private field`),n?n.call(e):t.get(e)),Je=(e,t,n)=>t.has(e)?Ne(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),Ye=(e,t,n,r)=>(Ge(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),Xe=(e,t,n)=>(Ge(e,t,`access private method`),n);function Ze(e,t){if(t){let n;return ye(()=>{let r=e();return r&&n&&t(n,r)?n:(n=r,r)})}return ye(e)}function Qe(e,t){if(Object.is(e,t))return!0;if(e===null||t===null)return!1;if(typeof e==`function`&&typeof t==`function`)return e===t;if(e instanceof Set&&t instanceof Set){if(e.size!==t.size)return!1;for(let n of e)if(!t.has(n))return!1;return!0}if(Array.isArray(e))return!Array.isArray(t)||e.length!==t.length?!1:!e.some((e,n)=>!Qe(e,t[n]));if(typeof e==`object`&&typeof t==`object`){let n=Object.keys(e),r=Object.keys(t);return n.length===r.length&&!n.some(n=>!Qe(e[n],t[n]))}return!1}function E({get:e},t){return{init(e){return he(e)},get(){return e.call(this).value},set(t){let n=e.call(this);n.peek()!==t&&(n.value=t)}}}function D(e,t){let n=new WeakMap;return function(){let t=n.get(this);return t||(t=Ze(e.bind(this)),n.set(this,t)),t.value}}function $e(e=!0){return function(t,n){n.addInitializer(function(){let t=n.kind===`field`||n.static?this:Object.getPrototypeOf(this),r=Object.getOwnPropertyDescriptor(t,n.name);r&&Object.defineProperty(t,n.name,Ie(Fe({},r),{enumerable:e}))})}}function et(...e){let t=e.map(e=>T(e));return()=>t.forEach(e=>e())}var tt,nt,rt,it,at,ot=[E],O,st,ct,lt,ut,k,dt,ft,pt,mt,ht,gt,_t,vt;at=[E],it=[E],rt=[$e()],nt=[$e()],tt=[$e()];var yt=class{constructor(e,t=Object.is){this.defaultValue=e,this.equals=t,Ue(O,5,this),Je(this,k),Je(this,st,Ue(O,8,this)),Ue(O,11,this),Je(this,dt,Ue(O,12,this)),Ue(O,15,this),Je(this,ht,Ue(O,16,this)),Ue(O,19,this),this.reset=this.reset.bind(this),this.reset()}get current(){return qe(this,k,_t)}get initial(){return qe(this,k,lt)}get previous(){return qe(this,k,pt)}set current(e){let t=S(()=>qe(this,k,_t));e&&t&&this.equals(t,e)||ae(()=>{qe(this,k,lt)||Ye(this,k,e,ut),Ye(this,k,t,mt),Ye(this,k,e,vt)})}reset(e=this.defaultValue){ae(()=>{Ye(this,k,void 0,mt),Ye(this,k,e,ut),Ye(this,k,e,vt)})}};O=Re(null),st=new WeakMap,k=new WeakSet,dt=new WeakMap,ht=new WeakMap,ct=We(O,20,`#initial`,ot,k,st),lt=ct.get,ut=ct.set,ft=We(O,20,`#previous`,at,k,dt),pt=ft.get,mt=ft.set,gt=We(O,20,`#current`,it,k,ht),_t=gt.get,vt=gt.set,We(O,2,`current`,rt,yt),We(O,2,`initial`,nt,yt),We(O,2,`previous`,tt,yt),He(O,yt);function bt(e){return S(()=>{let t={};for(let n in e)t[n]=e[n];return t})}var xt,St=class{constructor(){Je(this,xt,new WeakMap)}get(e,t){return e?qe(this,xt).get(e)?.get(t):void 0}set(e,t,n){if(e)return qe(this,xt).has(e)||qe(this,xt).set(e,new Map),qe(this,xt).get(e)?.set(t,n)}clear(e){return e?qe(this,xt).get(e)?.clear():void 0}};xt=new WeakMap;var Ct=Object.create,wt=Object.defineProperty,Tt=Object.getOwnPropertyDescriptor,Et=Object.getOwnPropertySymbols,Dt=Object.prototype.hasOwnProperty,Ot=Object.prototype.propertyIsEnumerable,kt=(e,t)=>(t=Symbol[e])?t:Symbol.for(`Symbol.`+e),At=e=>{throw TypeError(e)},jt=Math.pow,Mt=(e,t,n)=>t in e?wt(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,Nt=(e,t)=>{for(var n in t||={})Dt.call(t,n)&&Mt(e,n,t[n]);if(Et)for(var n of Et(t))Ot.call(t,n)&&Mt(e,n,t[n]);return e},Pt=(e,t)=>wt(e,`name`,{value:t,configurable:!0}),Ft=e=>[,,,Ct(e?.[kt(`metadata`)]??null)],It=[`class`,`method`,`getter`,`setter`,`accessor`,`field`,`value`,`get`,`set`],Lt=e=>e!==void 0&&typeof e!=`function`?At(`Function expected`):e,Rt=(e,t,n,r,i)=>({kind:It[e],name:t,metadata:r,addInitializer:e=>n._?At(`Already initialized`):i.push(Lt(e||null))}),zt=(e,t)=>Mt(t,kt(`metadata`),e[3]),Bt=(e,t,n,r)=>{for(var i=0,a=e[t>>1],o=a&&a.length;i<o;i++)t&1?a[i].call(n):r=a[i].call(n,r);return r},Vt=(e,t,n,r,i,a)=>{var o,s,c,l,u,d=t&7,f=!!(t&8),p=!!(t&16),m=d>3?e.length+1:d?f?1:2:0,h=It[d+5],g=d>3&&(e[m-1]=[]),_=e[m]||(e[m]=[]),v=d&&(!p&&!f&&(i=i.prototype),d<5&&(d>3||!p)&&Tt(d<4?i:{get[n](){return Wt(this,a)},set[n](e){return Kt(this,a,e)}},n));d?p&&d<4&&Pt(a,(d>2?`set `:d>1?`get `:``)+n):Pt(i,n);for(var y=r.length-1;y>=0;y--)l=Rt(d,n,c={},e[3],_),d&&(l.static=f,l.private=p,u=l.access={has:p?e=>Ut(i,e):e=>n in e},d^3&&(u.get=p?e=>(d^1?Wt:qt)(e,i,d^4?a:v.get):e=>e[n]),d>2&&(u.set=p?(e,t)=>Kt(e,i,t,d^4?a:v.set):(e,t)=>e[n]=t)),s=(0,r[y])(d?d<4?p?a:v[h]:d>4?void 0:{get:v.get,set:v.set}:i,l),c._=1,d^4||s===void 0?Lt(s)&&(d>4?g.unshift(s):d?p?a=s:v[h]=s:i=s):typeof s!=`object`||!s?At(`Object expected`):(Lt(o=s.get)&&(v.get=o),Lt(o=s.set)&&(v.set=o),Lt(o=s.init)&&g.unshift(o));return d||zt(e,i),v&&wt(i,n,v),p?d^4?a:v:i},Ht=(e,t,n)=>t.has(e)||At(`Cannot `+n),Ut=(e,t)=>Object(t)===t?e.has(t):At(`Cannot use the "in" operator on this value`),Wt=(e,t,n)=>(Ht(e,t,`read from private field`),n?n.call(e):t.get(e)),Gt=(e,t,n)=>t.has(e)?At(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),Kt=(e,t,n,r)=>(Ht(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),qt=(e,t,n)=>(Ht(e,t,`access private method`),n),A=class e{constructor(e,t){this.x=e,this.y=t}static delta(t,n){return new e(t.x-n.x,t.y-n.y)}static distance(e,t){return Math.hypot(e.x-t.x,e.y-t.y)}static equals(e,t){return e.x===t.x&&e.y===t.y}static from({x:t,y:n}){return new e(t,n)}},Jt=class e{constructor(e,t,n,r){this.left=e,this.top=t,this.width=n,this.height=r,this.scale={x:1,y:1}}get inverseScale(){return{x:1/this.scale.x,y:1/this.scale.y}}translate(t,n){let{top:r,left:i,width:a,height:o,scale:s}=this,c=new e(i+t,r+n,a,o);return c.scale=Nt({},s),c}get boundingRectangle(){let{width:e,height:t,left:n,top:r,right:i,bottom:a}=this;return{width:e,height:t,left:n,top:r,right:i,bottom:a}}get center(){let{left:e,top:t,right:n,bottom:r}=this;return new A((e+n)/2,(t+r)/2)}get area(){let{width:e,height:t}=this;return e*t}equals(t){if(!(t instanceof e))return!1;let{left:n,top:r,width:i,height:a}=this;return n===t.left&&r===t.top&&i===t.width&&a===t.height}containsPoint(e){let{top:t,left:n,bottom:r,right:i}=this;return t<=e.y&&e.y<=r&&n<=e.x&&e.x<=i}intersectionArea(t){return t instanceof e?Yt(this,t):0}intersectionRatio(e){let{area:t}=this,n=this.intersectionArea(e);return n/(e.area+t-n)}get bottom(){let{top:e,height:t}=this;return e+t}get right(){let{left:e,width:t}=this;return e+t}get aspectRatio(){let{width:e,height:t}=this;return e/t}get corners(){return[{x:this.left,y:this.top},{x:this.right,y:this.top},{x:this.left,y:this.bottom},{x:this.right,y:this.bottom}]}static from({top:t,left:n,width:r,height:i}){return new e(n,t,r,i)}static delta(e,t,n={x:`center`,y:`center`}){let r=(e,t)=>{let r=n[t],i=t===`x`?e.left:e.top,a=t===`x`?e.width:e.height;return r==`start`?i:r==`end`?i+a:i+a/2};return A.delta({x:r(e,`x`),y:r(e,`y`)},{x:r(t,`x`),y:r(t,`y`)})}static intersectionRatio(t,n){return e.from(t).intersectionRatio(e.from(n))}};function Yt(e,t){let n=Math.max(t.top,e.top),r=Math.max(t.left,e.left),i=Math.min(t.left+t.width,e.left+e.width),a=Math.min(t.top+t.height,e.top+e.height),o=i-r,s=a-n;return r<i&&n<a?o*s:0}var Xt,Zt,Qt,$t,en,tn=class extends (Qt=yt,Zt=[D],Xt=[D],Qt){constructor(e){let t=A.from(e);super(t,(e,t)=>A.equals(e,t)),Bt(en,5,this),Gt(this,$t,0),this.velocity={x:0,y:0}}get delta(){return A.delta(this.current,this.initial)}get direction(){let{current:e,previous:t}=this;if(!t)return null;let n={x:e.x-t.x,y:e.y-t.y};return!n.x&&!n.y?null:Math.abs(n.x)>Math.abs(n.y)?n.x>0?`right`:`left`:n.y>0?`down`:`up`}get current(){return super.current}set current(e){let{current:t}=this,n=A.from(e),r={x:n.x-t.x,y:n.y-t.y},i=Date.now(),a=i-Wt(this,$t),o=e=>Math.round(e/a*100);ae(()=>{Kt(this,$t,i),this.velocity={x:o(r.x),y:o(r.y)},super.current=n})}reset(e=this.defaultValue){super.reset(A.from(e)),this.velocity={x:0,y:0}}};en=Ft(Qt),$t=new WeakMap,Vt(en,2,`delta`,Zt,tn),Vt(en,2,`direction`,Xt,tn),zt(en,tn);function nn({x:e,y:t},n){let r=Math.abs(e),i=Math.abs(t);return typeof n==`number`?Math.sqrt(jt(r,2)+jt(i,2))>n:`x`in n&&`y`in n?r>n.x&&i>n.y:`x`in n?r>n.x:`y`in n&&i>n.y}var rn=(e=>(e.Horizontal=`x`,e.Vertical=`y`,e))(rn||{}),an=Object.values(rn),on=Object.create,sn=Object.defineProperty,cn=Object.defineProperties,ln=Object.getOwnPropertyDescriptor,un=Object.getOwnPropertyDescriptors,dn=Object.getOwnPropertySymbols,fn=Object.prototype.hasOwnProperty,pn=Object.prototype.propertyIsEnumerable,mn=(e,t)=>(t=Symbol[e])?t:Symbol.for(`Symbol.`+e),hn=e=>{throw TypeError(e)},gn=(e,t,n)=>t in e?sn(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,_n=(e,t)=>{for(var n in t||={})fn.call(t,n)&&gn(e,n,t[n]);if(dn)for(var n of dn(t))pn.call(t,n)&&gn(e,n,t[n]);return e},vn=(e,t)=>cn(e,un(t)),yn=(e,t)=>sn(e,`name`,{value:t,configurable:!0}),bn=(e,t)=>{var n={};for(var r in e)fn.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&dn)for(var r of dn(e))t.indexOf(r)<0&&pn.call(e,r)&&(n[r]=e[r]);return n},xn=e=>[,,,on(e?.[mn(`metadata`)]??null)],Sn=[`class`,`method`,`getter`,`setter`,`accessor`,`field`,`value`,`get`,`set`],Cn=e=>e!==void 0&&typeof e!=`function`?hn(`Function expected`):e,wn=(e,t,n,r,i)=>({kind:Sn[e],name:t,metadata:r,addInitializer:e=>n._?hn(`Already initialized`):i.push(Cn(e||null))}),Tn=(e,t)=>gn(t,mn(`metadata`),e[3]),j=(e,t,n,r)=>{for(var i=0,a=e[t>>1],o=a&&a.length;i<o;i++)t&1?a[i].call(n):r=a[i].call(n,r);return r},M=(e,t,n,r,i,a)=>{var o,s,c,l,u,d=t&7,f=!!(t&8),p=!!(t&16),m=d>3?e.length+1:d?f?1:2:0,h=Sn[d+5],g=d>3&&(e[m-1]=[]),_=e[m]||(e[m]=[]),v=d&&(!p&&!f&&(i=i.prototype),d<5&&(d>3||!p)&&ln(d<4?i:{get[n](){return N(this,a)},set[n](e){return F(this,a,e)}},n));d?p&&d<4&&yn(a,(d>2?`set `:d>1?`get `:``)+n):yn(i,n);for(var y=r.length-1;y>=0;y--)l=wn(d,n,c={},e[3],_),d&&(l.static=f,l.private=p,u=l.access={has:p?e=>Dn(i,e):e=>n in e},d^3&&(u.get=p?e=>(d^1?N:On)(e,i,d^4?a:v.get):e=>e[n]),d>2&&(u.set=p?(e,t)=>F(e,i,t,d^4?a:v.set):(e,t)=>e[n]=t)),s=(0,r[y])(d?d<4?p?a:v[h]:d>4?void 0:{get:v.get,set:v.set}:i,l),c._=1,d^4||s===void 0?Cn(s)&&(d>4?g.unshift(s):d?p?a=s:v[h]=s:i=s):typeof s!=`object`||!s?hn(`Object expected`):(Cn(o=s.get)&&(v.get=o),Cn(o=s.set)&&(v.set=o),Cn(o=s.init)&&g.unshift(o));return d||Tn(e,i),v&&sn(i,n,v),p?d^4?a:v:i},En=(e,t,n)=>t.has(e)||hn(`Cannot `+n),Dn=(e,t)=>Object(t)===t?e.has(t):hn(`Cannot use the "in" operator on this value`),N=(e,t,n)=>(En(e,t,`read from private field`),n?n.call(e):t.get(e)),P=(e,t,n)=>t.has(e)?hn(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),F=(e,t,n,r)=>(En(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),On=(e,t,n)=>(En(e,t,`access private method`),n);function kn(e,t){return{plugin:e,options:t}}function An(e){return t=>kn(e,t)}function jn(e){return typeof e==`function`?{plugin:e,options:void 0}:e}var Mn=[E],Nn,Pn,Fn,I=class{constructor(e,t){this.manager=e,this.options=t,P(this,Pn,j(Nn,8,this,!1)),j(Nn,11,this),P(this,Fn,new Set)}enable(){this.disabled=!1}disable(){this.disabled=!0}isDisabled(){return S(()=>this.disabled)}configure(e){this.options=e}registerEffect(e){let t=T(e.bind(this));return N(this,Fn).add(t),t}destroy(){N(this,Fn).forEach(e=>e())}static configure(e){return kn(this,e)}};Nn=xn(null),Pn=new WeakMap,Fn=new WeakMap,M(Nn,4,`disabled`,Mn,I,Pn),Tn(Nn,I);var In=class extends I{},Ln,Rn=class{constructor(e){this.manager=e,this.instances=new Map,P(this,Ln,[])}get values(){return Array.from(this.instances.values())}set values(e){let t=e.map(jn).reduce((e,t)=>{let n=e.find(({plugin:e})=>e===t.plugin);return n?(n.options=t.options,e):[...e,t]},[]),n=t.map(({plugin:e})=>e);for(let e of N(this,Ln))if(!n.includes(e)){if(e.prototype instanceof In)continue;this.unregister(e)}for(let{plugin:e,options:n}of t)this.register(e,n);F(this,Ln,n)}get(e){return this.instances.get(e)}register(e,t){let n=this.instances.get(e);if(n)return n.options!==t&&(n.options=t),n;let r=new e(this.manager,t);return this.instances.set(e,r),r}unregister(e){let t=this.instances.get(e);t&&(t.destroy(),this.instances.delete(e))}destroy(){for(let e of this.instances.values())e.destroy();this.instances.clear()}};Ln=new WeakMap;function zn(e,t){return e.priority===t.priority?e.type===t.type?t.value-e.value:t.type-e.type:t.priority-e.priority}var Bn=[],Vn,Hn,Un=class extends I{constructor(e){super(e),P(this,Vn),P(this,Hn),this.computeCollisions=this.computeCollisions.bind(this),F(this,Hn,he(Bn)),this.destroy=et(()=>{let e=this.computeCollisions(),t=S(()=>this.manager.dragOperation.position.current);if(e!==Bn){let e=N(this,Vn);if(F(this,Vn,t),e&&t.x==e.x&&t.y==e.y)return}else F(this,Vn,void 0);N(this,Hn).value=e},()=>{let{dragOperation:e}=this.manager;e.status.initialized&&this.forceUpdate()})}forceUpdate(e=!0){S(()=>{e?N(this,Hn).value=this.computeCollisions():F(this,Vn,void 0)})}computeCollisions(e,t){let{registry:n,dragOperation:r}=this.manager,{source:i,shape:a,status:o}=r;if(!o.initialized||!a)return Bn;let s=[],c=[];for(let a of e??n.droppables){if(a.disabled||i&&!a.accepts(i))continue;let e=t??a.collisionDetector;if(!e)continue;c.push(a),a.shape;let n=S(()=>e({droppable:a,dragOperation:r}));n&&(a.collisionPriority!=null&&(n.priority=a.collisionPriority),s.push(n))}return c.length===0?Bn:(s.sort(zn),s)}get collisions(){return N(this,Hn).value}};Vn=new WeakMap,Hn=new WeakMap;var Wn,Gn,Kn=[E],qn,Jn,Yn,Xn,Zn,Qn,$n;Gn=[E],Wn=[E];var er=class e{constructor(e,t){P(this,Xn,j(Yn,8,this)),j(Yn,11,this),P(this,Zn),P(this,Qn,j(Yn,12,this)),j(Yn,15,this),P(this,$n,j(Yn,16,this)),j(Yn,19,this);let{effects:n,id:r,data:i={},disabled:a=!1,register:o=!0}=e,s=r;F(this,Zn,he(r)),this.manager=t,this.data=i,this.disabled=a,this.effects=()=>[()=>{let{id:e,manager:t}=this;if(e!==s)return s=e,t?.registry.register(this),()=>t?.registry.unregister(this)},...n?.()??[]],this.register=this.register.bind(this),this.unregister=this.unregister.bind(this),this.destroy=this.destroy.bind(this),t&&o&&queueMicrotask(this.register)}get id(){let t=N(this,Zn).value;return e.pendingIdChanges?.get(this)??t}set id(t){t!==(e.pendingIdChanges?.get(this)??N(this,Zn).peek())&&(e.pendingIdChanges||(e.pendingIdChanges=new Map,queueMicrotask(()=>{var t;return On(t=e,qn,Jn).call(t)})),e.pendingIdChanges.set(this,t))}register(){return this.manager?.registry.register(this)}unregister(){var e;(e=this.manager)==null||e.registry.unregister(this)}destroy(){var e;(e=this.manager)==null||e.registry.unregister(this)}};Yn=xn(null),qn=new WeakSet,Jn=function(){let e=er.pendingIdChanges;er.pendingIdChanges=null,e&&ae(()=>{for(let[t,n]of e)N(t,Zn).value=n})},Xn=new WeakMap,Zn=new WeakMap,Qn=new WeakMap,$n=new WeakMap,M(Yn,4,`manager`,Kn,er,Xn),M(Yn,4,`data`,Gn,er,Qn),M(Yn,4,`disabled`,Wn,er,$n),P(er,qn),Tn(Yn,er),er.pendingIdChanges=null;var tr=er,nr=class{constructor(){this.map=he(new Map),this.cleanupFunctions=new WeakMap,this.register=(e,t)=>{let n=this.map.peek(),r=n.get(e),i=()=>this.unregister(e,t);if(r===t)return i;r&&r.id===e&&(this.cleanupFunctions.get(r)?.(),this.cleanupFunctions.delete(r));let a=new Map(n);for(let[r,i]of n)if(i===t&&r!==e){a.delete(r);break}a.set(e,t),this.map.value=a;let o=et(...t.effects());return this.cleanupFunctions.set(t,o),i},this.unregister=(e,t)=>{let n=this.map.peek();if(n.get(e)!==t)return;this.cleanupFunctions.get(t)?.(),this.cleanupFunctions.delete(t);let r=new Map(n);r.delete(e),this.map.value=r}}[Symbol.iterator](){return this.map.peek().values()}get value(){return this.map.value.values()}has(e){return this.map.value.has(e)}get(e){return this.map.value.get(e)}destroy(){for(let e of this)this.cleanupFunctions.get(e)?.(),e.destroy();this.map.value=new Map}},rr,ir,ar,or,sr,cr,lr,L,ur,dr,fr,pr=class extends (lr=tr,cr=[E],sr=[E],or=[E],ar=[D],ir=[D],rr=[D],lr){constructor(e,t){var n=e,{modifiers:r,type:i,sensors:a,plugins:o,effects:s}=n,c=bn(n,[`modifiers`,`type`,`sensors`,`plugins`,`effects`]);super(vn(_n({},c),{effects:()=>[...s?.()??[],()=>{let{manager:e,plugins:t}=this;if(!(!e||!t))for(let n of t){let{plugin:t}=jn(n);e.registry.plugins.register(t)}}]}),t),j(L,5,this),P(this,ur,j(L,8,this)),j(L,11,this),P(this,dr,j(L,12,this)),j(L,15,this),P(this,fr,j(L,16,this,this.isDragSource?`dragging`:`idle`)),j(L,19,this),this.type=i,this.sensors=a,this.modifiers=r,this.alignment=c.alignment,this.plugins=o}pluginConfig(e){if(this.plugins)for(let t of this.plugins){let n=jn(t);if(n.plugin===e)return n.options}}get isDropping(){return this.status===`dropping`&&this.isDragSource}get isDragging(){return this.status===`dragging`&&this.isDragSource}get isDragSource(){return this.manager?.dragOperation.source?.id===this.id}};L=xn(lr),ur=new WeakMap,dr=new WeakMap,fr=new WeakMap,M(L,4,`type`,cr,pr,ur),M(L,4,`modifiers`,sr,pr,dr),M(L,4,`status`,or,pr,fr),M(L,2,`isDropping`,ar,pr),M(L,2,`isDragging`,ir,pr),M(L,2,`isDragSource`,rr,pr),Tn(L,pr);var mr,hr,gr,_r,vr,yr,br,R,xr,Sr,Cr,wr,Tr,Er=class extends (br=tr,yr=[E],vr=[E],_r=[E],gr=[E],hr=[E],mr=[D],br){constructor(e,t){var n=e,{accept:r,collisionDetector:i,collisionPriority:a,type:o}=n,s=bn(n,[`accept`,`collisionDetector`,`collisionPriority`,`type`]);super(s,t),j(R,5,this),P(this,xr,j(R,8,this)),j(R,11,this),P(this,Sr,j(R,12,this)),j(R,15,this),P(this,Cr,j(R,16,this)),j(R,19,this),P(this,wr,j(R,20,this)),j(R,23,this),P(this,Tr,j(R,24,this)),j(R,27,this),this.accept=r,this.collisionDetector=i,this.collisionPriority=a,this.type=o}accepts(e){let{accept:t}=this;return t?typeof t==`function`?t(e):e.type?Array.isArray(t)?t.includes(e.type):e.type===t:!1:!0}get isDropTarget(){return this.manager?.dragOperation.target?.id===this.id}};R=xn(br),xr=new WeakMap,Sr=new WeakMap,Cr=new WeakMap,wr=new WeakMap,Tr=new WeakMap,M(R,4,`accept`,yr,Er,xr),M(R,4,`type`,vr,Er,Sr),M(R,4,`collisionDetector`,_r,Er,Cr),M(R,4,`collisionPriority`,gr,Er,wr),M(R,4,`shape`,hr,Er,Tr),M(R,2,`isDropTarget`,mr,Er),Tn(R,Er);var Dr=class{constructor(){this.registry=new Map}addEventListener(e,t){let{registry:n}=this,r=new Set(n.get(e));return r.add(t),n.set(e,r),()=>this.removeEventListener(e,t)}removeEventListener(e,t){let{registry:n}=this,r=new Set(n.get(e));r.delete(t),n.set(e,r)}dispatch(e,...t){let{registry:n}=this,r=n.get(e);if(r)for(let e of r)e(...t)}},Or=class extends Dr{constructor(e){super(),this.manager=e}dispatch(e,t){let n=[t,this.manager];super.dispatch(e,...n)}};function kr(e,t=!0){let n=!1;return vn(_n({},e),{cancelable:t,get defaultPrevented(){return n},preventDefault(){t&&(n=!0)}})}var Ar=class extends In{constructor(e){super(e);let t=(e,t)=>e.map(({id:e})=>e).join(``)===t.map(({id:e})=>e).join(``),n=[];this.destroy=et(()=>{let{dragOperation:t,collisionObserver:r}=e;t.status.initializing&&(n=[],r.enable())},()=>{let{collisionObserver:r,monitor:i}=e,{collisions:a}=r;if(r.isDisabled()||tr.pendingIdChanges)return;let o=kr({collisions:a});if(i.dispatch(`collision`,o),o.defaultPrevented||t(a,n))return;n=a;let[s]=a;S(()=>{s?.id!==e.dragOperation.target?.id&&(r.disable(),e.actions.setDropTarget(s?.id).then(()=>{r.enable()}))})})}},jr=(e=>(e[e.Lowest=0]=`Lowest`,e[e.Low=1]=`Low`,e[e.Normal=2]=`Normal`,e[e.High=3]=`High`,e[e.Highest=4]=`Highest`,e))(jr||{}),Mr=(e=>(e[e.Collision=0]=`Collision`,e[e.ShapeIntersection=1]=`ShapeIntersection`,e[e.PointerIntersection=2]=`PointerIntersection`,e))(Mr||{}),Nr,Pr,Fr,Ir,Lr,Rr,zr=[E],z,Br;Rr=[D],Lr=[D],Ir=[D],Fr=[D],Pr=[D],Nr=[D];var Vr=class{constructor(){j(z,5,this),P(this,Br,j(z,8,this,`idle`)),j(z,11,this)}get current(){return this.value}get idle(){return this.value===`idle`}get initializing(){return this.value===`initializing`}get initialized(){let{value:e}=this;return e!==`idle`&&e!==`initialization-pending`}get dragging(){return this.value===`dragging`}get dropped(){return this.value===`dropped`}set(e){this.value=e}};z=xn(null),Br=new WeakMap,M(z,4,`value`,zr,Vr,Br),M(z,2,`current`,Rr,Vr),M(z,2,`idle`,Lr,Vr),M(z,2,`initializing`,Ir,Vr),M(z,2,`initialized`,Fr,Vr),M(z,2,`dragging`,Pr,Vr),M(z,2,`dropped`,Nr,Vr),Tn(z,Vr);var Hr=class{constructor(e){this.manager=e}setDragSource(e){let{dragOperation:t}=this.manager;t.sourceIdentifier=typeof e==`string`||typeof e==`number`?e:e.id}setDropTarget(e){return S(()=>{let{dragOperation:t}=this.manager,n=e??null;if(t.targetIdentifier===n)return Promise.resolve(!1);t.targetIdentifier=n;let r=kr({operation:t.snapshot()});return t.status.dragging&&this.manager.monitor.dispatch(`dragover`,r),this.manager.renderer.rendering.then(()=>r.defaultPrevented)})}start(e){return S(()=>{let{dragOperation:t}=this.manager;if(e.source!=null&&this.setDragSource(e.source),!t.source)throw Error(`Cannot start a drag operation without a drag source`);if(!t.status.idle)throw Error(`Cannot start a drag operation while another is active`);let n=new AbortController,{event:r,coordinates:i}=e;ae(()=>{t.status.set(`initialization-pending`),t.shape=null,t.canceled=!1,t.activatorEvent=r??null,t.position.reset(i)});let a=kr({operation:t.snapshot()});return this.manager.monitor.dispatch(`beforedragstart`,a),a.defaultPrevented?(t.reset(),n.abort(),n):(t.status.set(`initializing`),t.controller=n,this.manager.renderer.rendering.then(()=>{if(n.signal.aborted)return;let{status:e}=t;e.current===`initializing`&&ae(()=>{t.status.set(`dragging`),this.manager.monitor.dispatch(`dragstart`,{nativeEvent:r,operation:t.snapshot(),cancelable:!1})})}),n)})}move(e){return S(()=>{let{dragOperation:t}=this.manager,{status:n,controller:r}=t;if(!n.dragging||!r||r.signal.aborted)return;let i=kr({nativeEvent:e.event,operation:t.snapshot(),by:e.by,to:e.to},e.cancelable??!0);(e.propagate??!0)&&this.manager.monitor.dispatch(`dragmove`,i),queueMicrotask(()=>{if(i.defaultPrevented)return;let n=e.to??{x:t.position.current.x+(e.by?.x??0),y:t.position.current.y+(e.by?.y??0)};t.position.current=n})})}stop(e={}){return S(()=>{let{dragOperation:t}=this.manager,{controller:n}=t;if(!n||n.signal.aborted)return;let r,i=()=>{let e={resume:()=>{},abort:()=>{}};return r=new Promise((t,n)=>{e.resume=t,e.abort=n}),e};n.abort();let a=()=>{this.manager.renderer.rendering.then(()=>{t.status.set(`dropped`);let e=S(()=>t.source?.status===`dropping`),r=()=>{t.controller===n&&(t.controller=void 0),t.reset()};if(e){let{source:e}=t,n=T(()=>{e?.status===`idle`&&(n(),r())})}else this.manager.renderer.rendering.then(r)})};t.canceled=e.canceled??!1,this.manager.monitor.dispatch(`dragend`,{nativeEvent:e.event,operation:t.snapshot(),canceled:e.canceled??!1,suspend:i}),r?r.then(a).catch(()=>t.reset()):a()})}},Ur=class extends I{constructor(e,t){super(e,t),this.manager=e,this.options=t}},Wr=class extends AbortController{constructor(e,t){super(),this.constraints=e,this.onActivate=t,this.activated=!1;for(let t of e??[])t.controller=this}onEvent(e){if(!this.activated){if(this.constraints?.length)for(let t of this.constraints)t.onEvent(e);else this.activate(e)}}activate(e){this.activated||(this.activated=!0,this.onActivate(e))}abort(e){this.activated=!1,super.abort(e)}},Gr,Kr=class{constructor(e){this.options=e,P(this,Gr)}set controller(e){F(this,Gr,e),e.signal.addEventListener(`abort`,()=>this.abort())}activate(e){var t;(t=N(this,Gr))==null||t.activate(e)}};Gr=new WeakMap;var qr=class extends I{constructor(e,t){super(e,t),this.manager=e,this.options=t}apply(e){return e.transform}},Jr=class{constructor(e){this.draggables=new nr,this.droppables=new nr,this.plugins=new Rn(e),this.sensors=new Rn(e),this.modifiers=new Rn(e)}register(e,t){if(e instanceof pr)return this.draggables.register(e.id,e);if(e instanceof Er)return this.droppables.register(e.id,e);if(e.prototype instanceof qr)return this.modifiers.register(e,t);if(e.prototype instanceof Ur)return this.sensors.register(e,t);if(e.prototype instanceof I)return this.plugins.register(e,t);throw Error(`Invalid instance type`)}unregister(e){if(e instanceof tr)return e instanceof pr?this.draggables.unregister(e.id,e):e instanceof Er?this.droppables.unregister(e.id,e):()=>{};if(e.prototype instanceof qr)return this.modifiers.unregister(e);if(e.prototype instanceof Ur)return this.sensors.unregister(e);if(e.prototype instanceof I)return this.plugins.unregister(e);throw Error(`Invalid instance type`)}destroy(){this.draggables.destroy(),this.droppables.destroy(),this.plugins.destroy(),this.sensors.destroy(),this.modifiers.destroy()}},Yr,Xr,Zr,Qr,$r,ei,ti,ni,ri=[D],ii,ai,oi,B,si,ci,li,ui,di,fi;ni=[E],ti=[E],ei=[E],$r=[E],Qr=[E],Zr=[D],Xr=[D],Yr=[D];var pi=class{constructor(e){j(B,5,this),P(this,ii),P(this,ai),P(this,oi,new yt(void 0,(e,t)=>e&&t?e.equals(t):e===t)),this.status=new Vr,P(this,si,j(B,8,this,!1)),j(B,11,this),P(this,ci,j(B,12,this,null)),j(B,15,this),P(this,li,j(B,16,this,null)),j(B,19,this),P(this,ui,j(B,20,this,null)),j(B,23,this),P(this,di,j(B,24,this,[])),j(B,27,this),this.position=new tn({x:0,y:0}),P(this,fi,{x:0,y:0}),F(this,ii,e)}get shape(){let{current:e,initial:t,previous:n}=N(this,oi);return!e||!t?null:{current:e,initial:t,previous:n}}set shape(e){e?N(this,oi).current=e:N(this,oi).reset()}get source(){let e=this.sourceIdentifier;if(e==null)return null;let t=N(this,ii).registry.draggables.get(e);return t&&F(this,ai,t),t??N(this,ai)??null}get target(){let e=this.targetIdentifier;return e==null?null:N(this,ii).registry.droppables.get(e)??null}get transform(){let{x:e,y:t}=this.position.delta,n={x:e,y:t};for(let e of this.modifiers)n=e.apply(vn(_n({},this.snapshot()),{transform:n}));return F(this,fi,n),n}snapshot(){return S(()=>({source:this.source,target:this.target,activatorEvent:this.activatorEvent,transform:N(this,fi),shape:this.shape?bt(this.shape):null,position:bt(this.position),status:bt(this.status),canceled:this.canceled}))}reset(){ae(()=>{this.status.set(`idle`),this.sourceIdentifier=null,this.targetIdentifier=null,N(this,oi).reset(),this.position.reset({x:0,y:0}),F(this,fi,{x:0,y:0}),this.modifiers=[]})}};B=xn(null),ii=new WeakMap,ai=new WeakMap,oi=new WeakMap,si=new WeakMap,ci=new WeakMap,li=new WeakMap,ui=new WeakMap,di=new WeakMap,fi=new WeakMap,M(B,2,`shape`,ri,pi),M(B,4,`canceled`,ni,pi,si),M(B,4,`activatorEvent`,ti,pi,ci),M(B,4,`sourceIdentifier`,ei,pi,li),M(B,4,`targetIdentifier`,$r,pi,ui),M(B,4,`modifiers`,Qr,pi,di),M(B,2,`source`,Zr,pi),M(B,2,`target`,Xr,pi),M(B,2,`transform`,Yr,pi),Tn(B,pi);var mi={get rendering(){return Promise.resolve()}};function hi(e,t){return typeof e==`function`?e(t):e??t}var gi=class{constructor(e){this.destroy=()=>{this.dragOperation.status.idle||this.actions.stop({canceled:!0}),this.dragOperation.modifiers.forEach(e=>e.destroy()),this.registry.destroy(),this.collisionObserver.destroy()};let t=e??{},n=hi(t.plugins,[]),r=hi(t.sensors,[]),i=hi(t.modifiers,[]),a=t.renderer??mi,o=new Or(this),s=new Jr(this);this.registry=s,this.monitor=o,this.renderer=a,this.actions=new Hr(this),this.dragOperation=new pi(this),this.collisionObserver=new Un(this),this.plugins=[Ar,...n],this.modifiers=i,this.sensors=r;let{destroy:c}=this,l=et(()=>{let e=S(()=>this.dragOperation.modifiers),t=this.modifiers;for(let n of e)t.includes(n)||n.destroy();this.dragOperation.modifiers=(this.dragOperation.source?.modifiers)?.map(e=>{let{plugin:t,options:n}=jn(e);return new t(this,n)})??t});this.destroy=()=>{l(),c()}}get plugins(){return this.registry.plugins.values}set plugins(e){this.registry.plugins.values=e}get modifiers(){return this.registry.modifiers.values}set modifiers(e){this.registry.modifiers.values=e}get sensors(){return this.registry.sensors.values}set sensors(e){this.registry.sensors.values=e}},_i=e=>{throw TypeError(e)},vi=(e,t,n)=>t.has(e)||_i(`Cannot `+n),V=(e,t,n)=>(vi(e,t,`read from private field`),t.get(e)),H=(e,t,n)=>t.has(e)?_i(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),U=(e,t,n,r)=>(vi(e,t,`write to private field`),t.set(e,n),n),yi=(e,t,n)=>(vi(e,t,`access private method`),n);function bi(e){return e?e instanceof KeyframeEffect||`getKeyframes`in e&&typeof e.getKeyframes==`function`:!1}function xi(e,t){let n=e.getAnimations(),r=null;for(let e of n){if(e.playState!==`running`)continue;let{effect:n}=e,i=(bi(n)?n.getKeyframes():[]).filter(t);i.length>0&&(r=[i[i.length-1],e])}return r}function Si(e){let{width:t,height:n,top:r,left:i,bottom:a,right:o}=e.getBoundingClientRect();return{width:t,height:n,top:r,left:i,bottom:a,right:o}}function Ci(e){let t=Object.prototype.toString.call(e);return t===`[object Window]`||t===`[object global]`}function wi(e){return`nodeType`in e}function W(e){return e?Ci(e)?e:wi(e)?`defaultView`in e?e.defaultView??window:e.ownerDocument?.defaultView??window:window:window}function Ti(e){let{Document:t}=W(e);return e instanceof t||`nodeType`in e&&e.nodeType===Node.DOCUMENT_NODE}function Ei(e){return!e||Ci(e)?!1:e instanceof W(e).HTMLElement||`namespaceURI`in e&&typeof e.namespaceURI==`string`&&e.namespaceURI.endsWith(`html`)}function Di(e){return e instanceof W(e).SVGElement||`namespaceURI`in e&&typeof e.namespaceURI==`string`&&e.namespaceURI.endsWith(`svg`)}function Oi(e){return e?Ci(e)?e.document:wi(e)?Ti(e)?e:Ei(e)||Di(e)?e.ownerDocument:document:document:document}function ki(e){let{documentElement:t}=Oi(e),n=W(e).visualViewport,r=n?.width??t.clientWidth,i=n?.height??t.clientHeight,a=n?.offsetTop??0,o=n?.offsetLeft??0;return{top:a,left:o,right:o+r,bottom:a+i,width:r,height:i}}function Ai(e,t){if(ji(e)&&e.open===!1)return!1;let{overflow:n,overflowX:r,overflowY:i}=getComputedStyle(e);return n===`visible`&&r===`visible`&&i===`visible`}function ji(e){return e.tagName===`DETAILS`}function Mi(e,t=e.getBoundingClientRect(),n=0){let r=t,{ownerDocument:i}=e,a=i.defaultView??window,o=e.parentElement;for(;o&&o!==i.documentElement;){if(!Ai(o)){let e=o.getBoundingClientRect(),t=n*(e.bottom-e.top),i=n*(e.right-e.left),a=n*(e.bottom-e.top),s=n*(e.right-e.left);r={top:Math.max(r.top,e.top-t),right:Math.min(r.right,e.right+i),bottom:Math.min(r.bottom,e.bottom+a),left:Math.max(r.left,e.left-s),width:0,height:0},r.width=r.right-r.left,r.height=r.bottom-r.top}o=o.parentElement}let s=a.visualViewport,c=s?.offsetTop??0,l=s?.offsetLeft??0,u=s?.width??a.innerWidth,d=s?.height??a.innerHeight,f=n*d,p=n*u;return r={top:Math.max(r.top,c-f),right:Math.min(r.right,l+u+p),bottom:Math.min(r.bottom,c+d+f),left:Math.max(r.left,l-p),width:0,height:0},r.width=r.right-r.left,r.height=r.bottom-r.top,r.width<0&&(r.width=0),r.height<0&&(r.height=0),r}function Ni(e){return{x:e.clientX,y:e.clientY}}var Pi=typeof window<`u`&&window.document!==void 0&&window.document.createElement!==void 0;function Fi(e=document,t=new Set){if(t.has(e))return[];t.add(e);let n=[e];for(let r of Array.from(e.querySelectorAll(`iframe, frame`)))try{let e=r.contentDocument;e&&!t.has(e)&&n.push(...Fi(e,t))}catch{}try{let r=e.defaultView;if(r&&r!==window.top){let i=r.parent;i&&i.document&&i.document!==e&&n.push(...Fi(i.document,t))}}catch{}return n}function Ii(){return/^((?!chrome|android).)*safari/i.test(navigator.userAgent)}function Li(){let e=Ii()?window.visualViewport:null;return{x:e?.offsetLeft??0,y:e?.offsetTop??0}}function Ri(e){return!e||!wi(e)?!1:e instanceof W(e).ShadowRoot}function zi(e){if(e&&wi(e)){let t=e.getRootNode();if(Ri(t)||t instanceof Document)return t}return Oi(e)}function Bi(e){return e.matchMedia(`(prefers-reduced-motion: reduce)`).matches}function Vi(e){let t=`input, textarea, select, canvas, [contenteditable]`,n=e.cloneNode(!0),r=Array.from(e.querySelectorAll(t));return Array.from(n.querySelectorAll(t)).forEach((e,t)=>{let n=r[t];Hi(e)&&Hi(n)&&(e.type!==`file`&&(e.value=n.value),e.type===`radio`&&e.name&&(e.name=`Cloned__${e.name}`)),Ui(e)&&Ui(n)&&n.width>0&&n.height>0&&e.getContext(`2d`)?.drawImage(n,0,0)}),n}function Hi(e){return`value`in e}function Ui(e){return e.tagName===`CANVAS`}function Wi(e,{x:t,y:n}){let r=e.elementFromPoint(t,n);if(Gi(r)){let{contentDocument:e}=r;if(e){let{left:i,top:a}=r.getBoundingClientRect();return Wi(e,{x:t-i,y:n-a})}}return r}function Gi(e){return e?.tagName===`IFRAME`}var Ki=new WeakMap;function qi(e){return!!e.closest(`
      input:not([disabled]),
      select:not([disabled]),
      textarea:not([disabled]),
      button:not([disabled]),
      a[href],
      [contenteditable]:not([contenteditable="false"])
    `)}var Ji=class{constructor(){this.entries=new Set,this.clear=()=>{for(let e of this.entries){let[t,{type:n,listener:r,options:i}]=e;t.removeEventListener(n,r,i)}this.entries.clear()}}bind(e,t){let n=Array.isArray(e)?e:[e],r=Array.isArray(t)?t:[t],i=[];for(let e of n)for(let t of r){let{type:n,listener:r,options:a}=t,o=[e,t];e.addEventListener(n,r,a),this.entries.add(o),i.push(o)}let a=this.entries;return function(){for(let e of i){let[t,{type:n,listener:r,options:i}]=e;t.removeEventListener(n,r,i),a.delete(e)}}}};function Yi(e){let t=e?.ownerDocument.defaultView;if(t&&t.self!==t.parent)return t.frameElement}function Xi(e){let t=new Set,n=Yi(e);for(;n;)t.add(n),n=Yi(n);return t}function Zi(e,t){let n=setTimeout(e,t);return()=>clearTimeout(n)}function Qi(e,t){let n=()=>performance.now(),r,i;return function(...a){let o=this;i?(r?.(),r=Zi(()=>{e.apply(o,a),i=n()},t-(n()-i))):(e.apply(o,a),i=n())}}function $i(e,t){return e===t?!0:!e||!t?!1:e.top==t.top&&e.left==t.left&&e.right==t.right&&e.bottom==t.bottom}function ea(e,t=e.getBoundingClientRect()){let{width:n,height:r}=Mi(e,t);return n>0&&r>0}var ta=Pi?ResizeObserver:class{observe(){}unobserve(){}disconnect(){}},na,ra=class extends ta{constructor(e){super(t=>{if(!V(this,na)){U(this,na,!0);return}e(t,this)}),H(this,na,!1)}};na=new WeakMap;var ia=Array.from({length:100},(e,t)=>t/100),aa=75,oa,sa,ca,la,ua,G,da,fa,pa,ma,ha,ga=class{constructor(e,t,n={debug:!1,skipInitial:!1}){this.element=e,this.callback=t,H(this,pa),this.disconnect=()=>{var e,t,n;U(this,da,!0),(e=V(this,ca))==null||e.disconnect(),(t=V(this,la))==null||t.disconnect(),V(this,ua).disconnect(),(n=V(this,G))==null||n.remove()},H(this,oa,!0),H(this,sa),H(this,ca),H(this,la),H(this,ua),H(this,G),H(this,da,!1),H(this,fa,Qi(()=>{var e;let{element:t}=this;if((e=V(this,la))==null||e.disconnect(),V(this,da)||!V(this,oa)||!t.isConnected)return;let n=t.ownerDocument??document,{innerHeight:r,innerWidth:i}=n.defaultView??window,a=t.getBoundingClientRect(),{top:o,left:s,bottom:c,right:l}=Mi(t,a),u=-Math.floor(o),d=-Math.floor(s),f=`${u}px ${-Math.floor(i-l)}px ${-Math.floor(r-c)}px ${d}px`;this.boundingClientRect=a,U(this,la,new IntersectionObserver(e=>{let[n]=e,{intersectionRect:r}=n;(n.intersectionRatio===1?Jt.intersectionRatio(r,Mi(t)):n.intersectionRatio)!==1&&V(this,fa).call(this)},{threshold:ia,rootMargin:f,root:n})),V(this,la).observe(t),yi(this,pa,ma).call(this)},aa)),this.boundingClientRect=e.getBoundingClientRect(),U(this,oa,ea(e,this.boundingClientRect));let r=!0;this.callback=e=>{r&&(r=!1,n.skipInitial)||t(e)};let i=e.ownerDocument;n?.debug&&(U(this,G,document.createElement(`div`)),V(this,G).style.background=`rgba(0,0,0,0.15)`,V(this,G).style.position=`fixed`,V(this,G).style.pointerEvents=`none`,i.body.appendChild(V(this,G))),U(this,ua,new IntersectionObserver(t=>{var n,r;let{boundingClientRect:i,isIntersecting:a}=t[t.length-1],{width:o,height:s}=i,c=V(this,oa);U(this,oa,a),!(!o&&!s)&&(c&&!a?((n=V(this,la))==null||n.disconnect(),this.callback(null),(r=V(this,ca))==null||r.disconnect(),U(this,ca,void 0),V(this,G)&&(V(this,G).style.visibility=`hidden`)):V(this,fa).call(this),a&&!V(this,ca)&&(U(this,ca,new ra(V(this,fa))),V(this,ca).observe(e)))},{threshold:ia,root:i})),V(this,oa)&&!n.skipInitial&&this.callback(this.boundingClientRect),V(this,ua).observe(e)}};oa=new WeakMap,sa=new WeakMap,ca=new WeakMap,la=new WeakMap,ua=new WeakMap,G=new WeakMap,da=new WeakMap,fa=new WeakMap,pa=new WeakSet,ma=function(){V(this,da)||(yi(this,pa,ha).call(this),!$i(this.boundingClientRect,V(this,sa))&&(this.callback(this.boundingClientRect),U(this,sa,this.boundingClientRect)))},ha=function(){if(V(this,G)){let{top:e,left:t,width:n,height:r}=Mi(this.element);V(this,G).style.overflow=`hidden`,V(this,G).style.visibility=`visible`,V(this,G).style.top=`${Math.floor(e)}px`,V(this,G).style.left=`${Math.floor(t)}px`,V(this,G).style.width=`${Math.floor(n)}px`,V(this,G).style.height=`${Math.floor(r)}px`}};var _a=new WeakMap,va=new WeakMap;function ya(e,t){let n=_a.get(e);return n||={disconnect:new ga(e,t=>{let n=_a.get(e);n&&n.callbacks.forEach(e=>e(t))},{skipInitial:!0}).disconnect,callbacks:new Set},n.callbacks.add(t),_a.set(e,n),()=>{n.callbacks.delete(t),n.callbacks.size===0&&(_a.delete(e),n.disconnect())}}function ba(e,t){let n=new Set;for(let r of e){let e=ya(r,t);n.add(e)}return()=>n.forEach(e=>e())}function xa(e,t){let n=e.ownerDocument;if(!va.has(n)){let e=new AbortController,t=new Set;document.addEventListener(`scroll`,e=>t.forEach(t=>t(e)),{capture:!0,passive:!0,signal:e.signal}),va.set(n,{disconnect:()=>e.abort(),listeners:t})}let{listeners:r,disconnect:i}=va.get(n)??{};return!r||!i?()=>{}:(r.add(t),()=>{r.delete(t),r.size===0&&(i(),va.delete(n))})}var Sa,Ca,wa,Ta,Ea=class{constructor(e,t,n){this.callback=t,H(this,Sa),H(this,Ca,!1),H(this,wa),H(this,Ta,Qi(e=>{if(!V(this,Ca)&&e.target&&`contains`in e.target&&typeof e.target.contains==`function`){for(let t of V(this,wa))if(e.target.contains(t)){this.callback(V(this,Sa).boundingClientRect);break}}},aa));let r=Xi(e),i=ba(r,t),a=xa(e,V(this,Ta));U(this,wa,r),U(this,Sa,new ga(e,t,n)),this.disconnect=()=>{V(this,Ca)||(U(this,Ca,!0),i(),a(),V(this,Sa).disconnect())}}};Sa=new WeakMap,Ca=new WeakMap,wa=new WeakMap,Ta=new WeakMap;function Da(e){return`showPopover`in e&&`hidePopover`in e&&typeof e.showPopover==`function`&&typeof e.hidePopover==`function`}function Oa(e){try{Da(e)&&e.isConnected&&e.hasAttribute(`popover`)&&!e.matches(`:popover-open`)&&e.showPopover()}catch{}}function ka(e){return!Pi||!e?!1:e===Oi(e).scrollingElement}function Aa(e){let t=W(e),n=ka(e)?ki(e):Si(e),r=t.visualViewport,i=ka(e)?{height:r?.height??t.innerHeight,width:r?.width??t.innerWidth}:{height:e.clientHeight,width:e.clientWidth},a={current:{x:e.scrollLeft,y:e.scrollTop},max:{x:e.scrollWidth-i.width,y:e.scrollHeight-i.height}};return{rect:n,position:a,isTop:a.current.y<=0,isLeft:a.current.x<=0,isBottom:a.current.y>=a.max.y,isRight:a.current.x>=a.max.x}}function ja(e,t){let{isTop:n,isBottom:r,isLeft:i,isRight:a,position:o}=Aa(e),{x:s,y:c}=t??{x:0,y:0},l=!n&&o.current.y+c>0,u=!r&&o.current.y+c<o.max.y,d=!i&&o.current.x+s>0,f=!a&&o.current.x+s<o.max.x;return{top:l,bottom:u,left:d,right:f,x:d||f,y:l||u}}var Ma=class{constructor(e){this.scheduler=e,this.pending=!1,this.tasks=new Set,this.resolvers=new Set,this.flush=()=>{let{tasks:e,resolvers:t}=this;this.pending=!1,this.tasks=new Set,this.resolvers=new Set;for(let t of e)t();for(let e of t)e()}}schedule(e){return this.tasks.add(e),this.pending||(this.pending=!0,this.scheduler(this.flush)),new Promise(e=>this.resolvers.add(e))}},Na=new Ma(e=>{typeof requestAnimationFrame==`function`?requestAnimationFrame(e):e()}),Pa=new Ma(e=>setTimeout(e,50)),Fa=new Map,Ia=Fa.clear.bind(Fa);function La(e,t=!1){if(!t)return Ra(e);let n=Fa.get(e);return n||(n=Ra(e),Fa.set(e,n),Pa.schedule(Ia),n)}function Ra(e){return W(e).getComputedStyle(e)}function za(e,t=La(e,!0)){return t.position===`fixed`||t.position===`sticky`}function Ba(e,t=La(e,!0)){let n=/(auto|scroll|overlay)/;return[`overflow`,`overflowX`,`overflowY`].some(e=>{let r=t[e];return typeof r==`string`&&n.test(r)})}var Va={excludeElement:!0,escapeShadowDOM:!0};function Ha(e,t=Va){let{limit:n,excludeElement:r,escapeShadowDOM:i}=t,a=new Set;function o(t){if(n!=null&&a.size>=n||!t)return a;if(Ti(t)&&t.scrollingElement!=null&&!a.has(t.scrollingElement))return a.add(t.scrollingElement),a;if(i&&Ri(t))return o(t.host);if(!Ei(t))return Di(t)?o(t.parentElement):a;if(a.has(t))return a;let s=La(t,!0);if(r&&t===e||Ba(t,s)&&a.add(t),za(t,s)){let{scrollingElement:e}=t.ownerDocument;return e&&a.add(e),a}return o(t.parentNode)}return e?o(e):a}function Ua(e,t=window.frameElement){let n={x:0,y:0,scaleX:1,scaleY:1};if(!e)return n;let r=Yi(e);for(;r;){if(r===t)return n;let e=Si(r),{x:i,y:a}=Wa(r,e);n.x+=e.left,n.y+=e.top,n.scaleX*=i,n.scaleY*=a,r=Yi(r)}return n}function Wa(e,t=Si(e)){let n=Math.round(t.width),r=Math.round(t.height);if(Ei(e))return{x:n/e.offsetWidth,y:r/e.offsetHeight};let i=La(e,!0);return{x:(parseFloat(i.width)||n)/n,y:(parseFloat(i.height)||r)/r}}function Ga(e){if(e===`none`)return null;let t=e.split(` `),n=parseFloat(t[0]),r=parseFloat(t[1]);return isNaN(n)&&isNaN(r)?null:{x:isNaN(n)?r:n,y:isNaN(r)?n:r}}function Ka(e){if(e===`none`)return null;let[t,n,r=`0`]=e.split(` `),i={x:parseFloat(t),y:parseFloat(n),z:parseInt(r,10)};return isNaN(i.x)&&isNaN(i.y)?null:{x:isNaN(i.x)?0:i.x,y:isNaN(i.y)?0:i.y,z:isNaN(i.z)?0:i.z}}function qa(e){let{scale:t,transform:n,translate:r}=e,i=Ga(t),a=Ka(r),o=Ja(n);if(!o&&!i&&!a)return null;let s={x:i?.x??1,y:i?.y??1},c={x:a?.x??0,y:a?.y??0},l={x:o?.x??0,y:o?.y??0,scaleX:o?.scaleX??1,scaleY:o?.scaleY??1};return{x:c.x+l.x,y:c.y+l.y,z:a?.z??0,scaleX:s.x*l.scaleX,scaleY:s.y*l.scaleY}}function Ja(e){if(e.startsWith(`matrix3d(`)){let t=e.slice(9,-1).split(/, /);return{x:+t[12],y:+t[13],scaleX:+t[0],scaleY:+t[5]}}if(e.startsWith(`matrix(`)){let t=e.slice(7,-1).split(/, /);return{x:+t[4],y:+t[5],scaleX:+t[0],scaleY:+t[3]}}return null}var Ya=(e=>(e[e.Idle=0]=`Idle`,e[e.Forward=1]=`Forward`,e[e.Reverse=-1]=`Reverse`,e))(Ya||{}),Xa={x:.2,y:.2},Za={x:10,y:10};function Qa(e,t,n,r=25,i=Xa,a=Za){let{x:o,y:s}=t,{rect:c,isTop:l,isBottom:u,isLeft:d,isRight:f}=Aa(e),p=Ua(e),m=qa(La(e,!0)),h=m!==null&&m?.scaleX<0,g=m!==null&&m?.scaleY<0,_=new Jt(c.left*p.scaleX+p.x,c.top*p.scaleY+p.y,c.width*p.scaleX,c.height*p.scaleY),v={x:0,y:0},y={x:0,y:0},b={height:_.height*i.y,width:_.width*i.x};return b.height>0&&(!l||g&&!u)&&s<=_.top+b.height&&n?.y!==1&&o>=_.left-a.x&&o<=_.right+a.x?(v.y=g?1:-1,y.y=r*Math.abs((_.top+b.height-s)/b.height)):b.height>0&&(!u||g&&!l)&&s>=_.bottom-b.height&&n?.y!==-1&&o>=_.left-a.x&&o<=_.right+a.x&&(v.y=g?-1:1,y.y=r*Math.abs((_.bottom-b.height-s)/b.height)),b.width>0&&(!f||h&&!d)&&o>=_.right-b.width&&n?.x!==-1&&s>=_.top-a.y&&s<=_.bottom+a.y?(v.x=h?-1:1,y.x=r*Math.abs((_.right-b.width-o)/b.width)):b.width>0&&(!d||h&&!f)&&o<=_.left+b.width&&n?.x!==1&&s>=_.top-a.y&&s<=_.bottom+a.y&&(v.x=h?1:-1,y.x=r*Math.abs((_.left+b.width-o)/b.width)),{direction:v,speed:y}}function $a(e,{block:t=`nearest`,inline:n=`nearest`}={}){if(!Ei(e))return;let r=Ha(e),i=[];for(let a of r){if(!Ei(a))continue;let{top:r,left:o}=to(e,a),s=r,c=o;for(let e of i)s-=e.scrollTop,c-=e.scrollLeft;if(t!==`none`){let n=s<a.scrollTop;n!==s+e.offsetHeight>a.scrollTop+a.clientHeight&&(a.scrollTop=t===`center`?s-a.clientHeight/2+e.offsetHeight/2:n?s:s+e.offsetHeight-a.clientHeight)}if(n!==`none`){let t=c<a.scrollLeft;t!==c+e.offsetWidth>a.scrollLeft+a.clientWidth&&(a.scrollLeft=n===`center`?c-a.clientWidth/2+e.offsetWidth/2:t?c:c+e.offsetWidth-a.clientWidth)}i.push(a)}}function eo(e){let t=0,n=0,r=e;for(;r;){t+=r.offsetTop,n+=r.offsetLeft;let e=r.offsetParent;if(!Ei(e))break;t+=e.clientTop,n+=e.clientLeft,r=e}return{top:t,left:n}}function to(e,t){let n=eo(e),r=eo(t);return{top:n.top-r.top-t.clientTop,left:n.left-r.left-t.clientLeft}}function no(e,t,n){let{scaleX:r,scaleY:i,x:a,y:o}=t,s=e.left+a+(1-r)*parseFloat(n),c=e.top+o+(1-i)*parseFloat(n.slice(n.indexOf(` `)+1)),l=r?e.width*r:e.width,u=i?e.height*i:e.height;return{width:l,height:u,top:c,right:s+l,bottom:c+u,left:s}}function ro(e,t,n){let{scaleX:r,scaleY:i,x:a,y:o}=t,s=e.left-a-(1-r)*parseFloat(n),c=e.top-o-(1-i)*parseFloat(n.slice(n.indexOf(` `)+1)),l=r?e.width/r:e.width,u=i?e.height/i:e.height;return{width:l,height:u,top:c,right:s+l,bottom:c+u,left:s}}function io({element:e,keyframes:t,options:n}){return e.animate(t,n).finished}function ao(e,t=La(e).translate,n=!0){if(n){let t=xi(e,e=>`translate`in e);if(t){let{translate:e=``}=t[0];if(typeof e==`string`){let t=Ka(e);if(t)return t}}}if(t){let e=Ka(t);if(e)return e}return{x:0,y:0,z:0}}var oo=new Ma(e=>setTimeout(e,0)),so=new Map,co=so.clear.bind(so);function lo(e){let t=e.ownerDocument,n=so.get(t);if(n)return n;n=t.getAnimations(),so.set(t,n),oo.schedule(co);let r=n.filter(t=>bi(t.effect)&&t.effect.target===e);return so.set(e,r),n}function uo(e,t){let n=lo(e).filter(e=>{if(bi(e.effect)){let{target:n}=e.effect;if((n&&t.isValidTarget?.call(t,n))??!0)return e.effect.getKeyframes().some(e=>{for(let n of t.properties)if(e[n])return!0})}}).map(e=>{let{effect:t,currentTime:n}=e,r=t?.getComputedTiming().duration;if(!(e.pending||e.playState===`finished`)&&typeof r==`number`&&typeof n==`number`&&n<r)return e.currentTime=r,()=>{e.currentTime=n}});if(n.length>0)return()=>n.forEach(e=>e?.())}var fo=class extends Jt{constructor(e,t={}){let{frameTransform:n=Ua(e),ignoreTransforms:r,getBoundingClientRect:i=Si}=t,a=uo(e,{properties:[`transform`,`translate`,`scale`,`width`,`height`],isValidTarget:t=>(t!==e||Ii())&&t.contains(e)}),o=i(e),{top:s,left:c,width:l,height:u}=o,d,f=La(e),p=qa(f),m={x:p?.scaleX??1,y:p?.scaleY??1},h=po(e,f);a?.(),p&&(d=ro(o,p,f.transformOrigin),(r||h)&&(s=d.top,c=d.left,l=d.width,u=d.height));let g={width:d?.width??l,height:d?.height??u};if(h&&!r&&d){let e=no(d,h,f.transformOrigin);s=e.top,c=e.left,l=e.width,u=e.height,m.x=h.scaleX,m.y=h.scaleY}n&&(r||(c*=n.scaleX,l*=n.scaleX,s*=n.scaleY,u*=n.scaleY),c+=n.x,s+=n.y),super(c,s,l,u),this.scale=m,this.intrinsicWidth=g.width,this.intrinsicHeight=g.height}};function po(e,t){let n=e.getAnimations();if(!n.length)return null;let r,i,a,o=!1;for(let e of n){if(e.playState!==`running`)continue;let t=bi(e.effect)?e.effect.getKeyframes():[],n=t[t.length-1];if(!n)continue;let{transform:s,translate:c,scale:l}=n;typeof s==`string`&&s&&(r=s,o=!0),typeof c==`string`&&c&&(i=c,o=!0),typeof l==`string`&&l&&(a=l,o=!0)}return o?qa({transform:r??t.transform,translate:i??t.translate,scale:a??t.scale}):null}function mo(e){return`style`in e&&typeof e.style==`object`&&e.style!==null&&`setProperty`in e.style&&`removeProperty`in e.style&&typeof e.style.setProperty==`function`&&typeof e.style.removeProperty==`function`}var ho=class{constructor(e){this.element=e,this.initial=new Map}set(e,t=``){let{element:n}=this;if(mo(n))for(let[r,i]of Object.entries(e)){let e=`${t}${r}`;this.initial.has(e)||this.initial.set(e,n.style.getPropertyValue(e)),n.style.setProperty(e,typeof i==`string`?i:`${i}px`)}}remove(e,t=``){let{element:n}=this;if(mo(n))for(let r of e){let e=`${t}${r}`;n.style.removeProperty(e)}}reset(){let{element:e}=this;if(mo(e)){for(let[t,n]of this.initial)e.style.setProperty(t,n);e.getAttribute(`style`)===``&&e.removeAttribute(`style`)}}};function go(e){return e?e instanceof W(e).Element||wi(e)&&e.nodeType===Node.ELEMENT_NODE:!1}function _o(e){if(!e)return!1;let{KeyboardEvent:t}=W(e.target);return e instanceof t}function vo(e){if(!e)return!1;let{PointerEvent:t}=W(e.target);return e instanceof t}function yo(e){if(!go(e))return!1;let{tagName:t}=e;return t===`INPUT`||t===`TEXTAREA`||bo(e)}function bo(e){return e.hasAttribute(`contenteditable`)&&e.getAttribute(`contenteditable`)!==`false`}var xo={};function So(e){let t=xo[e]==null?0:xo[e]+1;return xo[e]=t,`${e}-${t}`}var Co=({dragOperation:e,droppable:t})=>{let n=e.position.current;if(!n)return null;let{id:r}=t;return t.shape&&t.shape.containsPoint(n)?{id:r,value:1/A.distance(t.shape.center,n),type:Mr.PointerIntersection,priority:jr.High}:null},wo=({dragOperation:e,droppable:t})=>{let{shape:n}=e;if(!t.shape||!n?.current)return null;let r=n.current.intersectionArea(t.shape);if(r){let{position:i}=e,a=A.distance(t.shape.center,i.current),o=r/(n.current.area+t.shape.area-r)/a;return{id:t.id,value:o,type:Mr.ShapeIntersection,priority:jr.Normal}}return null},To=e=>Co(e)??wo(e),Eo=e=>{let{dragOperation:t,droppable:n}=e,{shape:r,position:i}=t;if(!n.shape)return null;let a=r?Jt.from(r.current.boundingRectangle).corners:void 0,o=Jt.from(n.shape.boundingRectangle).corners.reduce((e,t,n)=>e+A.distance(A.from(t),a?.[n]??i.current),0)/4;return{id:n.id,value:1/o,type:Mr.Collision,priority:jr.Normal}},Do=Object.create,Oo=Object.defineProperty,ko=Object.defineProperties,Ao=Object.getOwnPropertyDescriptor,jo=Object.getOwnPropertyDescriptors,Mo=Object.getOwnPropertySymbols,No=Object.prototype.hasOwnProperty,Po=Object.prototype.propertyIsEnumerable,Fo=(e,t)=>(t=Symbol[e])?t:Symbol.for(`Symbol.`+e),Io=e=>{throw TypeError(e)},Lo=(e,t,n)=>t in e?Oo(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,Ro=(e,t)=>{for(var n in t||={})No.call(t,n)&&Lo(e,n,t[n]);if(Mo)for(var n of Mo(t))Po.call(t,n)&&Lo(e,n,t[n]);return e},zo=(e,t)=>ko(e,jo(t)),Bo=(e,t)=>Oo(e,`name`,{value:t,configurable:!0}),Vo=(e,t)=>{var n={};for(var r in e)No.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&Mo)for(var r of Mo(e))t.indexOf(r)<0&&Po.call(e,r)&&(n[r]=e[r]);return n},Ho=e=>[,,,Do(e?.[Fo(`metadata`)]??null)],Uo=[`class`,`method`,`getter`,`setter`,`accessor`,`field`,`value`,`get`,`set`],Wo=e=>e!==void 0&&typeof e!=`function`?Io(`Function expected`):e,Go=(e,t,n,r,i)=>({kind:Uo[e],name:t,metadata:r,addInitializer:e=>n._?Io(`Already initialized`):i.push(Wo(e||null))}),Ko=(e,t)=>Lo(t,Fo(`metadata`),e[3]),K=(e,t,n,r)=>{for(var i=0,a=e[t>>1],o=a&&a.length;i<o;i++)t&1?a[i].call(n):r=a[i].call(n,r);return r},qo=(e,t,n,r,i,a)=>{var o,s,c,l,u,d=t&7,f=!!(t&8),p=!!(t&16),m=d>3?e.length+1:d?f?1:2:0,h=Uo[d+5],g=d>3&&(e[m-1]=[]),_=e[m]||(e[m]=[]),v=d&&(!p&&!f&&(i=i.prototype),d<5&&(d>3||!p)&&Ao(d<4?i:{get[n](){return q(this,a)},set[n](e){return Y(this,a,e)}},n));d?p&&d<4&&Bo(a,(d>2?`set `:d>1?`get `:``)+n):Bo(i,n);for(var y=r.length-1;y>=0;y--)l=Go(d,n,c={},e[3],_),d&&(l.static=f,l.private=p,u=l.access={has:p?e=>Yo(i,e):e=>n in e},d^3&&(u.get=p?e=>(d^1?q:Xo)(e,i,d^4?a:v.get):e=>e[n]),d>2&&(u.set=p?(e,t)=>Y(e,i,t,d^4?a:v.set):(e,t)=>e[n]=t)),s=(0,r[y])(d?d<4?p?a:v[h]:d>4?void 0:{get:v.get,set:v.set}:i,l),c._=1,d^4||s===void 0?Wo(s)&&(d>4?g.unshift(s):d?p?a=s:v[h]=s:i=s):typeof s!=`object`||!s?Io(`Object expected`):(Wo(o=s.get)&&(v.get=o),Wo(o=s.set)&&(v.set=o),Wo(o=s.init)&&g.unshift(o));return d||Ko(e,i),v&&Oo(i,n,v),p?d^4?a:v:i},Jo=(e,t,n)=>t.has(e)||Io(`Cannot `+n),Yo=(e,t)=>Object(t)===t?e.has(t):Io(`Cannot use the "in" operator on this value`),q=(e,t,n)=>(Jo(e,t,`read from private field`),n?n.call(e):t.get(e)),J=(e,t,n)=>t.has(e)?Io(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),Y=(e,t,n,r)=>(Jo(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),Xo=(e,t,n)=>(Jo(e,t,`access private method`),n),Zo={role:`button`,roleDescription:`draggable`},Qo=`dnd-kit-description`,$o=`dnd-kit-announcement`,es={draggable:`To pick up a draggable item, press the space bar. While dragging, use the arrow keys to move the item in a given direction. Press space again to drop the item in its new position, or press escape to cancel.`},ts={dragstart({operation:{source:e}}){if(e)return`Picked up draggable item ${e.id}.`},dragover({operation:{source:e,target:t}}){if(!(!e||e.id===t?.id))return t?`Draggable item ${e.id} was moved over droppable target ${t.id}.`:`Draggable item ${e.id} is no longer over a droppable target.`},dragend({operation:{source:e,target:t},canceled:n}){if(e)return n?`Dragging was cancelled. Draggable item ${e.id} was dropped.`:t?`Draggable item ${e.id} was dropped over droppable target ${t.id}`:`Draggable item ${e.id} was dropped.`}};function ns(e){let t=e.tagName.toLowerCase();return[`input`,`select`,`textarea`,`a`,`button`].includes(t)}function rs(e,t){let n=document.createElement(`div`);return n.id=e,n.style.setProperty(`display`,`none`),n.textContent=t,n}function is(e){let t=document.createElement(`div`);return t.id=e,t.setAttribute(`role`,`status`),t.setAttribute(`aria-live`,`polite`),t.setAttribute(`aria-atomic`,`true`),t.style.setProperty(`position`,`fixed`),t.style.setProperty(`width`,`1px`),t.style.setProperty(`height`,`1px`),t.style.setProperty(`margin`,`-1px`),t.style.setProperty(`border`,`0`),t.style.setProperty(`padding`,`0`),t.style.setProperty(`overflow`,`hidden`),t.style.setProperty(`clip`,`rect(0 0 0 0)`),t.style.setProperty(`clip-path`,`inset(100%)`),t.style.setProperty(`white-space`,`nowrap`),t}var as=[`dragover`,`dragmove`],os=class extends I{constructor(e,t){super(e);let{id:n,idPrefix:{description:r=Qo,announcement:i=$o}={},announcements:a=ts,screenReaderInstructions:o=es,debounce:s=500}=t??{},c=n?`${r}-${n}`:So(r),l=n?`${i}-${n}`:So(i),u,d,f,p,m=(e=p)=>{!f||!e||f?.nodeValue!==e&&(f.nodeValue=e)},h=()=>Na.schedule(m),g=ss(h,s),_=Object.entries(a).map(([e,t])=>this.manager.monitor.addEventListener(e,(n,r)=>{let i=f;if(!i)return;let a=t?.(n,r);a&&i.nodeValue!==a&&(p=a,as.includes(e)?g():(h(),g.cancel()))})),v=()=>{let e=[];u?.isConnected||(u=rs(c,o.draggable),e.push(u)),d?.isConnected||(d=is(l),f=document.createTextNode(``),d.appendChild(f),e.push(d)),e.length>0&&document.body.append(...e)},y=new Set;function b(){for(let e of y)e()}this.registerEffect(()=>{y.clear();for(let e of this.manager.registry.draggables.value){let t=e.handle??e.element;if(t){(!u||!d)&&y.add(v),(!ns(t)||Ii())&&!t.hasAttribute(`tabindex`)&&y.add(()=>t.setAttribute(`tabindex`,`0`)),!t.hasAttribute(`role`)&&t.tagName.toLowerCase()!==`button`&&y.add(()=>t.setAttribute(`role`,Zo.role)),t.hasAttribute(`aria-roledescription`)||y.add(()=>t.setAttribute(`aria-roledescription`,Zo.roleDescription)),t.hasAttribute(`aria-describedby`)||y.add(()=>t.setAttribute(`aria-describedby`,c));for(let n of[`aria-pressed`,`aria-grabbed`]){let r=String(e.isDragging);t.getAttribute(n)!==r&&y.add(()=>t.setAttribute(n,r))}let n=String(e.disabled);t.getAttribute(`aria-disabled`)!==n&&y.add(()=>t.setAttribute(`aria-disabled`,n))}}y.size>0&&Na.schedule(b)}),this.destroy=()=>{super.destroy(),u?.remove(),d?.remove(),_.forEach(e=>e())}}};function ss(e,t){let n,r=()=>{clearTimeout(n),n=setTimeout(e,t)};return r.cancel=()=>clearTimeout(n),r}var cs=new Map,ls,us,ds,fs,ps,ms,hs,gs,_s,vs,ys,bs,xs,Ss=class extends (ps=In,fs=[E],ds=[D],us=[D],ls=[D],ps){constructor(e,t){super(e,t),K(hs,5,this),J(this,_s),J(this,ms,new Set),J(this,gs,K(hs,8,this,new Set)),K(hs,11,this),this.registerEffect(Xo(this,_s,vs))}register(e){return q(this,ms).add(e),()=>{q(this,ms).delete(e)}}addRoot(e){return S(()=>{let t=new Set(this.additionalRoots);t.add(e),this.additionalRoots=t}),()=>{S(()=>{let t=new Set(this.additionalRoots);t.delete(e),this.additionalRoots=t})}}get sourceRoot(){let{source:e}=this.manager.dragOperation;return zi(e?.element??null)}get targetRoot(){let{target:e}=this.manager.dragOperation;return zi(e?.element??null)}get roots(){let{status:e}=this.manager.dragOperation;if(e.initializing||e.initialized){let e=[this.sourceRoot,this.targetRoot].filter(e=>e!=null);return new Set([...e,...this.additionalRoots])}return new Set}};hs=Ho(ps),ms=new WeakMap,gs=new WeakMap,_s=new WeakSet,vs=function(){let{roots:e}=this,t=[];for(let n of e)for(let e of q(this,ms))t.push(Xo(this,_s,ys).call(this,n,e));return()=>{for(let e of t)e()}},ys=function(e,t){let n=cs.get(e);n||(n=new Map,cs.set(e,n));let r=n.get(t);if(!r){let i=Ti(e)?Xo(this,_s,bs).call(this,e,n,t):Xo(this,_s,xs).call(this,e,n,t);if(!i)return()=>{};r=i,n.set(t,r)}r.refCount++;let i=!1;return()=>{i||(i=!0,r.refCount--,r.refCount===0&&r.cleanup())}},bs=function(e,t,n){let r=e.createElement(`style`),{nonce:i}=this.options??{};i&&r.setAttribute(`nonce`,i),r.textContent=n,e.head.prepend(r);let a=new MutationObserver(t=>{for(let n of t)for(let t of Array.from(n.removedNodes))if(t===r){e.head.prepend(r);return}});return a.observe(e.head,{childList:!0}),{refCount:0,cleanup:()=>{a.disconnect(),r.remove(),t.delete(n),t.size===0&&cs.delete(e)}}},xs=function(e,t,n){`adoptedStyleSheets`in e&&Array.isArray(e.adoptedStyleSheets);let{CSSStyleSheet:r}=e.ownerDocument.defaultView??{};if(!r)return null;let i=new r;return i.replaceSync(n),e.adoptedStyleSheets.push(i),{refCount:0,cleanup:()=>{if(Ri(e)&&e.host?.isConnected){let t=e.adoptedStyleSheets.indexOf(i);t!==-1&&e.adoptedStyleSheets.splice(t,1)}t.delete(n),t.size===0&&cs.delete(e)}}},qo(hs,4,`additionalRoots`,fs,Ss,gs),qo(hs,2,`sourceRoot`,ds,Ss),qo(hs,2,`targetRoot`,us,Ss),qo(hs,2,`roots`,ls,Ss),Ko(hs,Ss),Ss.configure=An(Ss);var Cs=Ss,ws=class extends I{constructor(e,t){super(e,t),this.manager=e;let{cursor:n=`grabbing`}=t??{},r=e.registry.plugins.get(Cs)?.register(`* { cursor: ${n} !important; }`);if(r){let e=this.destroy.bind(this);this.destroy=()=>{r(),e()}}}},Ts=`data-dnd-`,Es=`${Ts}dropping`,X=`--dnd-`,Ds=`${Ts}dragging`,Os=`${Ts}placeholder`,ks=[Ds,Os,`popover`,`aria-pressed`,`aria-grabbing`],As=[`view-transition-name`],js=`
  :is(:root,:host) [${Ds}] {
    position: fixed !important;
    pointer-events: none !important;
    touch-action: none;
    z-index: calc(infinity);
    will-change: translate;
    top: var(${X}top, 0px) !important;
    left: var(${X}left, 0px) !important;
    right: unset !important;
    bottom: unset !important;
    width: var(${X}width, auto);
    max-width: var(${X}width, auto);
    height: var(${X}height, auto);
    max-height: var(${X}height, auto);
    transform: var(${X}transform, none) !important;
    transition: var(${X}transition) !important;
  }

  :is(:root,:host) [${Os}] {
    transition: none;
  }

  :is(:root,:host) [${Os}='hidden'] {
    visibility: hidden;
  }

  [${Ds}] * {
    pointer-events: none !important;
  }

  [${Ds}]:not([${Es}]) {
    translate: var(${X}translate) !important;
  }

  [${Ds}][style*='${X}scale'] {
    scale: var(${X}scale) !important;
    transform-origin: var(${X}transform-origin) !important;
  }

  @layer dnd-kit {
    :where([${Ds}][popover]) {
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
  [${Ds}]::backdrop, [${Ts}overlay]:not([${Ds}]) {
    display: none;
    visibility: hidden;
  }
`.replace(/\n+/g,` `).replace(/\s+/g,` `).trim();function Ms(e,t=`hidden`){return S(()=>{let{element:n,manager:r}=e;if(!n||!r)return;let i=Ns(n,r.registry.droppables),a=[],o=Vi(n),{remove:s}=o;return Ps(i,o,a),Fs(o,t),o.remove=()=>{a.forEach(e=>e()),s.call(o)},o})}function Ns(e,t){let n=new Map;for(let r of t)if(r.element&&(e===r.element||e.contains(r.element))){let e=`${Ts}${So(`dom-id`)}`;r.element.setAttribute(e,``),n.set(r,e)}return n}function Ps(e,t,n){for(let[r,i]of e){if(!r.element)continue;let e=`[${i}]`,a=t.matches(e)?t:t.querySelector(e);if(r.element.removeAttribute(i),!a)continue;let o=r.element;r.proxy=a,a.removeAttribute(i),Ki.set(o,a),n.push(()=>{Ki.delete(o),r.proxy=void 0})}}function Fs(e,t=`hidden`){e.setAttribute(`inert`,`true`),e.setAttribute(`tab-index`,`-1`),e.setAttribute(`aria-hidden`,`true`),e.setAttribute(Os,t)}function Is(e,t){return e===t||Yi(e)===Yi(t)}function Ls(e){let{target:t}=e;`newState`in e&&e.newState===`closed`&&go(t)&&t.hasAttribute(`popover`)&&requestAnimationFrame(()=>Oa(t))}function Rs(e){return e.tagName===`TR`}function zs(e,t,n){let r=new MutationObserver(r=>{let i=!1;for(let n of r){if(n.target!==e){i=!0;continue}if(n.type!==`attributes`)continue;let r=n.attributeName;if(r.startsWith(`aria-`)||ks.includes(r))continue;let a=e.getAttribute(r);if(r===`style`){if(mo(e)&&mo(t)){let n=e.style;for(let e of Array.from(t.style))n.getPropertyValue(e)===``&&t.style.removeProperty(e);for(let e of Array.from(n)){if(As.includes(e)||e.startsWith(X))continue;let r=n.getPropertyValue(e);t.style.setProperty(e,r)}}}else a===null?t.removeAttribute(r):t.setAttribute(r,a)}i&&n&&t.replaceChildren(...e.cloneNode(!0).childNodes)});return r.observe(e,{attributes:!0,subtree:!0,childList:!0}),r}function Bs(e,t,n){let r=new MutationObserver(r=>{for(let i of r)if(i.addedNodes.length!==0)for(let r of Array.from(i.addedNodes)){if(r.contains(e)&&e.nextElementSibling!==t){e.insertAdjacentElement(`afterend`,t),Oa(n);return}if(r.contains(t)&&t.previousElementSibling!==e){t.insertAdjacentElement(`beforebegin`,e),Oa(n);return}}e.isConnected&&t.isConnected&&e.nextElementSibling!==t&&(e.insertAdjacentElement(`afterend`,t),Oa(n))});return r.observe(e.ownerDocument.body,{childList:!0,subtree:!0}),r}function Vs(e){return new ResizeObserver(()=>{var t;let n=new fo(e.placeholder,{frameTransform:e.frameTransform,ignoreTransforms:!0}),r=e.transformOrigin??{x:1,y:1},i=(e.width-n.width)*r.x+e.delta.x,a=(e.height-n.height)*r.y+e.delta.y,o=Li();if(e.styles.set({width:n.width-e.widthOffset,height:n.height-e.heightOffset,top:e.top+a+o.y,left:e.left+i+o.x},X),(t=e.getElementMutationObserver())==null||t.takeRecords(),Rs(e.element)&&Rs(e.placeholder)){let t=Array.from(e.element.cells),n=Array.from(e.placeholder.cells);e.getSavedCellWidths()||e.setSavedCellWidths(t.map(e=>e.style.width));for(let[e,r]of t.entries()){let t=n[e];r.style.width=`${t.getBoundingClientRect().width}px`}}let s=e.getTranslate()??{x:0,y:0},c=e.left+i+o.x+s.x,l=e.top+a+o.y+s.y,u=n.width-e.widthOffset,d=n.height-e.heightOffset,f=e.frameTransform;e.dragOperation.shape=new Jt(c*f.scaleX+f.x,l*f.scaleY+f.y,u*f.scaleX,d*f.scaleY)})}var Hs=250,Us=`ease`;function Ws(e){var t;let{animation:n}=e;if(typeof n==`function`){let t=n({source:e.source,element:e.element,feedbackElement:e.feedbackElement,placeholder:e.placeholder,translate:e.translate,moved:e.moved});Promise.resolve(t).then(()=>{e.cleanup(),requestAnimationFrame(e.restoreFocus)});return}let{duration:r=Hs,easing:i=Us}=n??{};Oa(e.feedbackElement);let[,a]=xi(e.feedbackElement,e=>`translate`in e)??[];a?.pause();let o=e.placeholder??e.element,s={frameTransform:Is(e.feedbackElement,o)?null:void 0},c=new fo(e.feedbackElement,s),l=Ka(La(e.feedbackElement).translate)??e.translate,u=new fo(o,s),d=Jt.delta(c,u,e.alignment),f={x:l.x-d.x,y:l.y-d.y},p=Math.round(c.intrinsicHeight)===Math.round(u.intrinsicHeight)?{}:{minHeight:[`${c.intrinsicHeight}px`,`${u.intrinsicHeight}px`],maxHeight:[`${c.intrinsicHeight}px`,`${u.intrinsicHeight}px`]},m=Math.round(c.intrinsicWidth)===Math.round(u.intrinsicWidth)?{}:{minWidth:[`${c.intrinsicWidth}px`,`${u.intrinsicWidth}px`],maxWidth:[`${c.intrinsicWidth}px`,`${u.intrinsicWidth}px`]};e.styles.set({transition:e.transition},X),e.feedbackElement.setAttribute(Es,``),(t=e.getElementMutationObserver())==null||t.takeRecords(),io({element:e.feedbackElement,keyframes:zo(Ro(Ro({},p),m),{translate:[`${l.x}px ${l.y}px 0`,`${f.x}px ${f.y}px 0`]}),options:{duration:Bi(W(e.feedbackElement))?0:e.moved||e.feedbackElement!==e.element?r:0,easing:i}}).then(()=>{e.feedbackElement.removeAttribute(Es),a?.finish(),e.cleanup(),requestAnimationFrame(e.restoreFocus)})}var Gs,Ks,qs,Js,Ys,Xs,Zs,Qs=class extends (Ks=I,Gs=[E],Ks){constructor(e,t){super(e,t),J(this,Ys),J(this,Js,K(qs,8,this)),K(qs,11,this),this.state={initial:{},current:{}};let n=e.registry.plugins.get(Cs),r=n?.register(js);if(r){let e=this.destroy.bind(this);this.destroy=()=>{r(),e()}}this.registerEffect(Xo(this,Ys,Xs).bind(this,n)),this.registerEffect(Xo(this,Ys,Zs))}};qs=Ho(Ks),Js=new WeakMap,Ys=new WeakSet,Xs=function(e){let{overlay:t}=this;if(!t||!e)return;let n=zi(t);if(n)return e.addRoot(n)},Zs=function(){let{state:e,manager:t,options:n}=this,{dragOperation:r}=t,{position:i,source:a,status:o}=r;if(o.idle){e.current={},e.initial={};return}if(!a)return;let{element:s}=a,c=a.pluginConfig(Qs),l=c?.feedback??n?.feedback??`default`,u=typeof l==`function`?l(a,t):l;if(!s||u===`none`||!o.initialized||o.initializing)return;let{initial:d}=e,f=this.overlay??s,p=Ua(f),m=Ua(s),h=!Is(s,f),g=new fo(s,{frameTransform:h?m:null,ignoreTransforms:!h}),_={x:m.scaleX/p.scaleX,y:m.scaleY/p.scaleY},{width:v,height:y,top:b,left:ee}=g;h&&(v/=_.x,y/=_.y);let te=new ho(f),ne=La(s),{transition:re,translate:ie,boxSizing:ae,paddingBlockStart:oe,paddingBlockEnd:x,paddingInlineStart:se,paddingInlineEnd:ce,borderInlineStartWidth:le,borderInlineEndWidth:ue,borderBlockStartWidth:de,borderBlockEndWidth:fe}=ne,pe=re.split(`,`).filter(e=>!/^\s*(transform|translate|scale)\b/.test(e)).join(`,`),me=qa(ne),C=ne.transform,he=u===`clone`,ge=ae===`content-box`,_e=ge?parseInt(se)+parseInt(ce)+parseInt(le)+parseInt(ue):0,ve=ge?parseInt(oe)+parseInt(x)+parseInt(de)+parseInt(fe):0,w=u!==`move`&&!this.overlay?Ms(a,he?`clone`:`hidden`):null,ye=S(()=>_o(t.dragOperation.activatorEvent));if(!d.translate){if(this.overlay&&me)d.translate={x:me.x,y:me.y};else if(ie!==`none`){let e=Ka(ie);e&&(d.translate=e)}}if(!d.transformOrigin){let e=S(()=>i.current),t=ee+(me?.x??0),n=b+(me?.y??0);d.transformOrigin={x:(e.x-t*p.scaleX-p.x)/(v*p.scaleX),y:(e.y-n*p.scaleY-p.y)/(y*p.scaleY)}}let{transformOrigin:be}=d,xe=b*p.scaleY+p.y,Se=ee*p.scaleX+p.x;if(!d.coordinates&&(d.coordinates={x:Se,y:xe},_.x!==1||_.y!==1)){let{scaleX:e,scaleY:t}=m,{x:n,y:r}=be;d.coordinates.x+=(v*e-v)*n,d.coordinates.y+=(y*t-y)*r}d.dimensions||={width:v,height:y},d.frameTransform||=p;let Ce={x:d.coordinates.x-Se,y:d.coordinates.y-xe},T={width:(d.dimensions.width*d.frameTransform.scaleX-v*p.scaleX)*be.x,height:(d.dimensions.height*d.frameTransform.scaleY-y*p.scaleY)*be.y},we={x:Ce.x/p.scaleX+T.width,y:Ce.y/p.scaleY+T.height},Te={left:ee+we.x,top:b+we.y};f.setAttribute(Ds,`true`);let Ee=S(()=>r.transform),De=d.translate??{x:0,y:0},Oe=Ee.x*p.scaleX+De.x,ke=Ee.y*p.scaleY+De.y,Ae=Li();te.set({width:v-_e,height:y-ve,top:Te.top+Ae.y,left:Te.left+Ae.x,translate:`${Oe}px ${ke}px 0`,transform:this.overlay?`none`:C,transition:pe?`${pe}, translate 0ms linear`:`translate 0ms linear`,scale:h?`${_.x} ${_.y}`:``,"transform-origin":`${be.x*100}% ${be.y*100}%`},X),w&&(s.insertAdjacentElement(`afterend`,w),n?.rootElement&&(typeof n.rootElement==`function`?n.rootElement(a):n.rootElement).appendChild(s)),Da(f)&&(f.hasAttribute(`popover`)||f.setAttribute(`popover`,`manual`),Oa(f),f.addEventListener(`beforetoggle`,Ls));let je,Me,Ne,Pe=Vs({placeholder:w,element:s,feedbackElement:f,frameTransform:p,transformOrigin:be,width:v,height:y,top:b,left:ee,widthOffset:_e,heightOffset:ve,delta:we,styles:te,dragOperation:r,getTranslate:()=>e.current.translate,getElementMutationObserver:()=>je,getSavedCellWidths:()=>Ne,setSavedCellWidths:e=>{Ne=e}}),Fe=new fo(f);S(()=>r.shape=Fe);let Ie=W(f),Le=e=>{this.manager.actions.stop({event:e})},Re=Bi(Ie);ye&&Ie.addEventListener(`resize`,Le),S(()=>a.status)===`idle`&&requestAnimationFrame(()=>a.status=`dragging`),w&&(Pe.observe(w),je=zs(s,w,he),Me=Bs(s,w,f));let ze=t.dragOperation.source?.id,Be=()=>{if(!ye||ze==null)return;let e=t.registry.draggables.get(ze),n=e?.handle??e?.element;Ei(n)&&n.focus()},Ve=()=>{if(je?.disconnect(),Me?.disconnect(),Pe.disconnect(),Ie.removeEventListener(`resize`,Le),Da(f)&&(f.removeEventListener(`beforetoggle`,Ls),f.removeAttribute(`popover`)),f.removeAttribute(Ds),te.reset(),Ne&&Rs(s)){let e=Array.from(s.cells);for(let[t,n]of e.entries())n.style.width=Ne[t]??``}a.status=`idle`;let t=e.current.translate!=null,n=r.status.dragging;w&&(!n&&t||w.parentElement!==f.parentElement)&&f.isConnected&&w.replaceWith(f),w?.remove()},He=n?.dropAnimation,Ue=this,We=et(()=>{let{transform:t,status:i}=r;if(!(!t.x&&!t.y&&!e.current.translate)&&i.dragging){let i=d.translate??{x:0,y:0},a={x:t.x/p.scaleX+i.x,y:t.y/p.scaleY+i.y},o=e.current.translate,s=S(()=>r.modifiers),c=S(()=>r.shape?.current),l=n?.keyboardTransition,u=ye&&!Re&&l!==null?`${l?.duration??250}ms ${l?.easing??`cubic-bezier(0.25, 1, 0.5, 1)`}`:`0ms linear`;if(te.set({transition:pe?`${pe}, translate ${u}`:`translate ${u}`,translate:`${a.x}px ${a.y}px 0`},X),je?.takeRecords(),c&&c!==Fe&&o&&!s.length){let e=A.delta(a,o);r.shape=Jt.from(c.boundingRectangle).translate(e.x*p.scaleX,e.y*p.scaleY)}else r.shape=new fo(f);e.current.translate=a}},function(){if(r.status.dropped){this.dispose(),a.status=`dropping`;let n=c?.dropAnimation===void 0?Ue.dropAnimation===void 0?He:Ue.dropAnimation:c.dropAnimation,r=e.current.translate,i=r!=null;if(!r&&s!==f&&(r={x:0,y:0}),!r||n===null){Ve();return}t.renderer.rendering.then(()=>{Ws({source:a,element:s,feedbackElement:f,placeholder:w,translate:r,moved:i,transition:re,alignment:a.alignment,styles:te,animation:n??void 0,getElementMutationObserver:()=>je,cleanup:Ve,restoreFocus:Be})})}});return()=>{Ve(),We()}},qo(qs,4,`overlay`,Gs,Qs,Js),Ko(qs,Qs),Qs.configure=An(Qs);var $s=Qs,ec=!0,tc=!1,nc,rc,ic,ac=(ic=[E],Ya.Forward),oc,sc,cc;rc=(nc=[E],Ya.Reverse);var lc=class{constructor(){J(this,sc,K(oc,8,this,ec)),K(oc,11,this),J(this,cc,K(oc,12,this,ec)),K(oc,15,this)}isLocked(e){return e===Ya.Idle?!1:e==null?this[Ya.Forward]===ec&&this[Ya.Reverse]===ec:this[e]===ec}unlock(e){e!==Ya.Idle&&(this[e]=tc)}};oc=Ho(null),sc=new WeakMap,cc=new WeakMap,qo(oc,4,ac,ic,lc,sc),qo(oc,4,rc,nc,lc,cc),Ko(oc,lc);var uc=[Ya.Forward,Ya.Reverse],dc=class{constructor(){this.x=new lc,this.y=new lc}isLocked(){return this.x.isLocked()&&this.y.isLocked()}},fc=class extends I{constructor(e){super(e);let t=he(new dc),n=null;this.signal=t,T(()=>{let{status:r}=e.dragOperation;if(!r.initialized){n=null,t.value=new dc;return}let{delta:i}=e.dragOperation.position;if(n){let e={x:pc(i.x,n.x),y:pc(i.y,n.y)},r=t.peek();ae(()=>{for(let t of an)for(let n of uc)e[t]===n&&r[t].unlock(n);t.value=r})}n=i})}get current(){return this.signal.peek()}};function pc(e,t){return Math.sign(e-t)}var mc,hc,gc,_c,vc,yc,bc=class extends (hc=In,mc=[E],hc){constructor(e){super(e),J(this,_c,K(gc,8,this,!1)),K(gc,11,this),J(this,vc),J(this,yc,()=>{if(!q(this,vc))return;let{element:e,by:t}=q(this,vc);t.y&&(e.scrollTop+=t.y),t.x&&(e.scrollLeft+=t.x)}),this.scroll=(e,t)=>{if(this.disabled)return!1;let n=this.getScrollableElements();if(!n)return Y(this,vc,void 0),!1;let{position:r}=this.manager.dragOperation,i=r?.current;if(i){let{by:r}=e??{},a=r?{x:xc(r.x),y:xc(r.y)}:void 0,o=a?void 0:this.scrollIntentTracker.current;if(o?.isLocked())return!1;for(let e of n){let n=ja(e,r);if(n.x||n.y){let{speed:n,direction:s}=Qa(e,i,a,t?.acceleration,t?.threshold);if(o)for(let e of an)o[e].isLocked(s[e])&&(n[e]=0,s[e]=0);if(s.x||s.y){let{x:t,y:i}=r??s,a=t*n.x,o=i*n.y;if(a||o){let t=q(this,vc)?.by;if(this.autoScrolling&&t&&(t.x&&!a||t.y&&!o))continue;return Y(this,vc,{element:e,by:{x:a,y:o}}),Na.schedule(q(this,yc)),!0}}}}}return Y(this,vc,void 0),!1};let t=null,n=null,r=Ze(()=>{let{position:n,source:r}=e.dragOperation;if(!n)return null;let i=Wi(zi(r?.element),n.current);return i&&(t=i),i??t}),i=Ze(()=>{let t=r.value,{documentElement:i}=Oi(t);if(!t||t===i){let{target:t}=e.dragOperation,r=t?.element;if(r){let e=Ha(r,{excludeElement:!1});return n=e,e}}if(t){let e=Ha(t,{excludeElement:!1});return this.autoScrolling&&n&&e.size<n?.size?n:(n=e,e)}return n=null,null},Qe);this.getScrollableElements=()=>i.value,this.scrollIntentTracker=new fc(e),this.destroy=e.monitor.addEventListener(`dragmove`,t=>{this.disabled||t.defaultPrevented||!_o(e.dragOperation.activatorEvent)||!t.by||this.scroll({by:t.by})&&t.preventDefault()})}};gc=Ho(hc),_c=new WeakMap,vc=new WeakMap,yc=new WeakMap,qo(gc,4,`autoScrolling`,mc,bc,_c),Ko(gc,bc);function xc(e){return e>0?Ya.Forward:e<0?Ya.Reverse:Ya.Idle}var Sc=new class{constructor(e){this.scheduler=e,this.pending=!1,this.tasks=new Set,this.resolvers=new Set,this.flush=()=>{let{tasks:e,resolvers:t}=this;this.pending=!1,this.tasks=new Set,this.resolvers=new Set;for(let t of e)t();for(let e of t)e()}}schedule(e){return this.tasks.add(e),this.pending||(this.pending=!0,this.scheduler(this.flush)),new Promise(e=>this.resolvers.add(e))}}(e=>{typeof requestAnimationFrame==`function`?requestAnimationFrame(e):e()}),Cc=10,wc=class extends I{constructor(e,t){super(e,t);let n=e.registry.plugins.get(bc);if(!n)throw Error(`AutoScroller plugin depends on Scroller plugin`);this.destroy=T(()=>{if(this.disabled)return;let{position:t,status:r}=e.dragOperation;if(r.dragging){let e={acceleration:this.options?.acceleration,threshold:typeof this.options?.threshold==`number`?{x:this.options.threshold,y:this.options.threshold}:this.options?.threshold};if(n.scroll(void 0,e)){n.autoScrolling=!0;let t=setInterval(()=>Sc.schedule(()=>n.scroll(void 0,e)),Cc);return()=>{clearInterval(t)}}n.autoScrolling=!1}})}};wc.configure=An(wc);var Tc=wc,Ec={capture:!0,passive:!0},Dc,Oc=class extends In{constructor(e){super(e),J(this,Dc),this.handleScroll=()=>{q(this,Dc)??Y(this,Dc,setTimeout(()=>{this.manager.collisionObserver.forceUpdate(!1),Y(this,Dc,void 0)},50))};let{dragOperation:t}=this.manager;this.destroy=T(()=>{if(t.status.dragging){let e=t.source?.element?.ownerDocument??document;return e.addEventListener(`scroll`,this.handleScroll,Ec),()=>{e.removeEventListener(`scroll`,this.handleScroll,Ec)}}})}};Dc=new WeakMap;var kc=`* { user-select: none !important; -webkit-user-select: none !important; }`,Ac=class extends I{constructor(e){super(e),this.manager=e;let t=e.registry.plugins.get(Cs)?.register(kc);if(this.destroy=T(()=>{let{dragOperation:e}=this.manager;if(e.status.initialized)return jc(),document.addEventListener(`selectionchange`,jc,{capture:!0}),()=>{document.removeEventListener(`selectionchange`,jc,{capture:!0})}}),t){let e=this.destroy.bind(this);this.destroy=()=>{t(),e()}}}};function jc(){var e;(e=document.getSelection())==null||e.removeAllRanges()}var Mc=Object.freeze({offset:10,keyboardCodes:{start:[`Space`,`Enter`],cancel:[`Escape`],end:[`Space`,`Enter`,`Tab`],up:[`ArrowUp`],down:[`ArrowDown`],left:[`ArrowLeft`],right:[`ArrowRight`]},preventActivation(e,t){let n=t.handle??t.element;return e.target!==n}}),Nc,Pc=class extends Ur{constructor(e,t){super(e),this.manager=e,this.options=t,J(this,Nc,[]),this.listeners=new Ji,this.handleSourceKeyDown=(e,t,n)=>{if(this.disabled||e.defaultPrevented||!go(e.target)||t.disabled)return;let{keyboardCodes:r=Mc.keyboardCodes,preventActivation:i=Mc.preventActivation}=n??{};r.start.includes(e.code)&&this.manager.dragOperation.status.idle&&(i?.(e,t)||this.handleStart(e,t,n))}}bind(e,t=this.options){return T(()=>{let n=e.handle??e.element,r=n=>{_o(n)&&this.handleSourceKeyDown(n,e,t)};if(n)return n.addEventListener(`keydown`,r),()=>{n.removeEventListener(`keydown`,r)}})}handleStart(e,t,n){let{element:r}=t;if(!r)throw Error(`Source draggable does not have an associated element`);e.preventDefault(),e.stopImmediatePropagation(),$a(r);let{center:i}=new fo(r);if(this.manager.actions.start({event:e,coordinates:{x:i.x,y:i.y},source:t}).signal.aborted)return this.cleanup();this.sideEffects();let a=Oi(r),o=[this.listeners.bind(a,[{type:`keydown`,listener:e=>this.handleKeyDown(e,t,n),options:{capture:!0}}])];q(this,Nc).push(...o)}handleKeyDown(e,t,n){let{keyboardCodes:r=Mc.keyboardCodes}=n??{};if(Ic(e,[...r.end,...r.cancel])){e.preventDefault();let t=Ic(e,r.cancel);this.handleEnd(e,t);return}Ic(e,r.up)?this.handleMove(`up`,e):Ic(e,r.down)&&this.handleMove(`down`,e),Ic(e,r.left)?this.handleMove(`left`,e):Ic(e,r.right)&&this.handleMove(`right`,e)}handleEnd(e,t){this.manager.actions.stop({event:e,canceled:t}),this.cleanup()}handleMove(e,t){let{shape:n}=this.manager.dragOperation,r=t.shiftKey?5:1,i={x:0,y:0},a=this.options?.offset??Mc.offset;if(typeof a==`number`&&(a={x:a,y:a}),n){switch(e){case`up`:i={x:0,y:-a.y*r};break;case`down`:i={x:0,y:a.y*r};break;case`left`:i={x:-a.x*r,y:0};break;case`right`:i={x:a.x*r,y:0}}(i.x||i.y)&&(t.preventDefault(),this.manager.actions.move({event:t,by:i}))}}sideEffects(){let e=this.manager.registry.plugins.get(Tc);e?.disabled===!1&&(e.disable(),q(this,Nc).push(()=>{e.enable()}))}cleanup(){q(this,Nc).forEach(e=>e()),Y(this,Nc,[])}destroy(){this.cleanup(),this.listeners.clear()}};Nc=new WeakMap,Pc.configure=An(Pc),Pc.defaults=Mc;var Fc=Pc;function Ic(e,t){return t.includes(e.code)}var Lc,Rc=class extends Kr{constructor(){super(...arguments),J(this,Lc)}onEvent(e){switch(e.type){case`pointerdown`:Y(this,Lc,Ni(e));break;case`pointermove`:if(!q(this,Lc))return;let{x:t,y:n}=Ni(e),r={x:t-q(this,Lc).x,y:n-q(this,Lc).y},{tolerance:i}=this.options;if(i&&nn(r,i)){this.abort();return}nn(r,this.options.value)&&this.activate(e);break;case`pointerup`:this.abort()}}abort(){Y(this,Lc,void 0)}};Lc=new WeakMap;var zc,Bc,Vc=class extends Kr{constructor(){super(...arguments),J(this,zc),J(this,Bc)}onEvent(e){switch(e.type){case`pointerdown`:Y(this,Bc,Ni(e)),Y(this,zc,setTimeout(()=>this.activate(e),this.options.value));break;case`pointermove`:if(!q(this,Bc))return;let{x:t,y:n}=Ni(e);nn({x:t-q(this,Bc).x,y:n-q(this,Bc).y},this.options.tolerance)&&this.abort();break;case`pointerup`:this.abort()}}abort(){q(this,zc)&&(clearTimeout(q(this,zc)),Y(this,Bc,void 0),Y(this,zc,void 0))}};zc=new WeakMap,Bc=new WeakMap;var Hc=class{};Hc.Delay=Vc,Hc.Distance=Rc;var Uc=Object.freeze({activationConstraints(e,t){let{pointerType:n,target:r}=e;if(!(n===`mouse`&&go(r)&&(t.handle===r||t.handle?.contains(r))))return n===`touch`?[new Hc.Delay({value:250,tolerance:5})]:yo(r)&&!e.defaultPrevented?[new Hc.Delay({value:200,tolerance:0})]:[new Hc.Delay({value:200,tolerance:10}),new Hc.Distance({value:5})]},preventActivation(e,t){let{target:n}=e;return n===t.element||n===t.handle||!go(n)||t.handle?.contains(n)?!1:qi(n)}}),Wc,Gc=class extends Ur{constructor(e,t){super(e),this.manager=e,this.options=t,J(this,Wc,new Set),this.listeners=new Ji,this.latest={event:void 0,coordinates:void 0},this.handleMove=()=>{let{event:e,coordinates:t}=this.latest;!e||!t||this.manager.actions.move({event:e,to:t})},this.handleCancel=this.handleCancel.bind(this),this.handlePointerUp=this.handlePointerUp.bind(this),this.handleKeyDown=this.handleKeyDown.bind(this)}activationConstraints(e,t,n=this.options){let{activationConstraints:r=Uc.activationConstraints}=n??{};return typeof r==`function`?r(e,t):r}bind(e,t=this.options){return T(()=>{let n=new AbortController,{signal:r}=n,i=n=>{vo(n)&&this.handlePointerDown(n,e,t)},a=[e.handle??e.element];t?.activatorElements&&(a=Array.isArray(t.activatorElements)?t.activatorElements:t.activatorElements(e));for(let e of a)e&&(Zc(e.ownerDocument.defaultView),e.addEventListener(`pointerdown`,i,{signal:r}));return()=>n.abort()})}handlePointerDown(e,t,n){if(this.disabled||!e.isPrimary||e.button!==0||!go(e.target)||t.disabled||qc(e)||!this.manager.dragOperation.status.idle)return;let{preventActivation:r=Uc.preventActivation}=n??{};if(r?.(e,t))return;let{target:i}=e,a=Ei(i)&&i.draggable&&i.getAttribute(`draggable`)===`true`,o=Ua(t.element),{x:s,y:c}=Ni(e);this.initialCoordinates={x:s*o.scaleX+o.x,y:c*o.scaleY+o.y};let l=this.activationConstraints(e,t,n);e.sensor=this;let u=new Wr(l,e=>this.handleStart(t,e));u.signal.onabort=()=>this.handleCancel(e),u.onEvent(e),this.controller=u;let d=Fi(),f=this.listeners.bind(d,[{type:`pointermove`,listener:e=>this.handlePointerMove(e,t)},{type:`pointerup`,listener:this.handlePointerUp,options:{capture:!0}},{type:`pointercancel`,listener:this.handleCancel},{type:`dragstart`,listener:a?this.handleCancel:Jc,options:{capture:!0}}]);q(this,Wc).add(()=>{f(),this.initialCoordinates=void 0})}handlePointerMove(e,t){var n;if(this.controller?.activated===!1){(n=this.controller)==null||n.onEvent(e);return}if(this.manager.dragOperation.status.dragging){let n=Ni(e),r=Ua(t.element);n.x=n.x*r.scaleX+r.x,n.y=n.y*r.scaleY+r.y,e.preventDefault(),e.stopPropagation(),this.latest.event=e,this.latest.coordinates=n,Na.schedule(this.handleMove)}}handlePointerUp(e){let{status:t}=this.manager.dragOperation;if(!t.idle){e.preventDefault(),e.stopPropagation();let n=!t.initialized;this.manager.actions.stop({event:e,canceled:n})}this.cleanup()}handleKeyDown(e){e.key===`Escape`&&(e.preventDefault(),this.handleCancel(e))}handleStart(e,t){let{manager:n,initialCoordinates:r}=this;if(!r||!n.dragOperation.status.idle||t.defaultPrevented)return;if(n.actions.start({coordinates:r,event:t,source:e}).signal.aborted)return this.cleanup();t.preventDefault();let i=Oi(t.target).body;try{i.setPointerCapture(t.pointerId)}catch{this.handleCancel(t);return}let a=go(t.target)?[t.target,i]:i,o=this.listeners.bind(a,[{type:`touchmove`,listener:Jc,options:{passive:!1}},{type:`click`,listener:Jc},{type:`contextmenu`,listener:Jc},{type:`keydown`,listener:this.handleKeyDown}]);q(this,Wc).add(o)}handleCancel(e){let{dragOperation:t}=this.manager;t.status.initialized&&this.manager.actions.stop({event:e,canceled:!0}),this.cleanup()}cleanup(){let{controller:e}=this;this.controller=void 0,e&&!e.signal.aborted&&e.abort(),this.latest={event:void 0,coordinates:void 0},q(this,Wc).forEach(e=>e()),q(this,Wc).clear()}destroy(){this.cleanup(),this.listeners.clear()}};Wc=new WeakMap,Gc.configure=An(Gc),Gc.defaults=Uc;var Kc=Gc;function qc(e){return`sensor`in e}function Jc(e){e.preventDefault()}function Yc(){}var Xc=new WeakSet;function Zc(e){!e||Xc.has(e)||(e.addEventListener(`touchmove`,Yc,{capture:!1,passive:!1}),Xc.add(e))}var Qc={modifiers:[],plugins:[os,Tc,ws,$s,Ac],sensors:[Kc,Fc]},$c=class extends gi{constructor(e={}){let t=hi(e.plugins,Qc.plugins),n=hi(e.sensors,Qc.sensors),r=hi(e.modifiers,Qc.modifiers);super(zo(Ro({},e),{plugins:[Oc,bc,Cs,...t],sensors:n,modifiers:r}))}},el,tl,nl,rl,il,al,ol=class extends (nl=pr,tl=[E],el=[E],nl){constructor(e,t){var n=e,{element:r,effects:i=()=>[],handle:a}=n,o=Vo(n,[`element`,`effects`,`handle`]);super(Ro({effects:()=>[...i(),()=>{let{manager:e}=this;if(!e)return;let t=(this.sensors?.map(jn)??[...e.sensors]).map(t=>{let n=t instanceof Ur?t:e.registry.register(t.plugin),r=t instanceof Ur?void 0:t.options;return n.bind(this,r)});return function(){t.forEach(e=>e())}}]},o),t),J(this,il,K(rl,8,this)),K(rl,11,this),J(this,al,K(rl,12,this)),K(rl,15,this),this.element=r,this.handle=a}};rl=Ho(nl),il=new WeakMap,al=new WeakMap,qo(rl,4,`handle`,tl,ol,il),qo(rl,4,`element`,el,ol,al),Ko(rl,ol);var sl,cl,ll,ul,dl,fl,pl,ml,hl,gl,_l=class extends (ll=Er,cl=[E],sl=[E],ll){constructor(e,t){var n=e,{element:r,effects:i=()=>[]}=n,a=Vo(n,[`element`,`effects`]);let{collisionDetector:o=To}=a,s=e=>{let{manager:t,element:n}=this;if(!n||e===null){this.shape=void 0;return}if(!t)return;let r=new fo(n),i=S(()=>this.shape);return r&&i?.equals(r)?i:(this.shape=r,r)},c=he(!1);super(zo(Ro({},a),{collisionDetector:o,effects:()=>[...i(),()=>{let{element:e,manager:t}=this;if(!t)return;let{dragOperation:n}=t,{source:r}=n;c.value=!!(r&&n.status.initialized&&e&&!this.disabled&&this.accepts(r))},()=>{let{element:e}=this;if(c.value&&e){let t=new Ea(e,s);return()=>{t.disconnect(),this.shape=void 0}}},()=>{if(this.manager?.dragOperation.status.initialized)return()=>{this.shape=void 0}}]}),t),J(this,hl),J(this,dl,K(ul,8,this)),K(ul,11,this),J(this,gl,K(ul,12,this)),K(ul,15,this),this.element=r,this.refreshShape=()=>s()}set element(e){Y(this,hl,e,ml)}get element(){return this.proxy??q(this,hl,pl)}};ul=Ho(ll),dl=new WeakMap,hl=new WeakSet,gl=new WeakMap,fl=qo(ul,20,`#element`,cl,hl,dl),pl=fl.get,ml=fl.set,qo(ul,4,`proxy`,sl,_l,gl),Ko(ul,_l);var vl=new Map;function yl(t,n,r){let i=n.flatMap(e=>Array.isArray(e)?e:[e]).map(t=>`cssText`in t&&typeof t.cssText==`string`?t.cssText:e(t).cssText).join(`
`);if(!(`adoptedStyleSheets`in Document.prototype)||typeof CSSStyleSheet>`u`){let e=r??String(n.length);if(!t.querySelector(`style[data-pk-adopted-styles="${e}"]`)){let n=document.createElement(`style`);n.dataset.pkAdoptedStyles=e,n.textContent=i,t.prepend(n)}return}let a=r??i,o=vl.get(a);o||(o=new CSSStyleSheet,o.replaceSync(i),vl.set(a,o)),t.adoptedStyleSheets=[...t.adoptedStyleSheets,o]}var bl=t`
    @layer pk-component {
        :host {
            display: inline-block;
            vertical-align: middle;
        }
    }
`;t`
    .pk-focus-ring:focus {
        outline: none;
    }

    .pk-focus-ring:focus-visible {
        box-shadow: var(--pk-shadow-focus);
    }
`;var xl=t`
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
`,Sl=class extends n{constructor(...e){super(...e),this.pkRenderFailed=!1}static{this.shadowRootOptions={mode:`open`,delegatesFocus:!0}}connectedCallback(){super.connectedCallback(),this.hasAttribute(`data-pk`)||this.setAttribute(`data-pk`,``)}createRenderRoot(){let e=super.createRenderRoot();return yl(e,[xl],`pk-shadow-reset`),e}performUpdate(){if(!this.pkRenderFailed)try{let e=super.performUpdate();e instanceof Promise&&e.catch(e=>{this.handleRenderFailure(e)})}catch(e){this.handleRenderFailure(e)}}handleRenderFailure(e){let t=e instanceof Error?e:Error(String(e));this.pkRenderFailed=!0,this.dispatchEvent(new CustomEvent(`pk-error`,{detail:{tagName:this.localName||this.tagName.toLowerCase(),message:t.message,stack:t.stack},bubbles:!0,composed:!0}));try{let e=this.renderRoot;if(e){e.textContent=``;let t=document.createElement(`div`);t.setAttribute(`part`,`error`),t.setAttribute(`role`,`alert`),t.textContent=`This control failed to load.`,e.appendChild(t)}}catch{}}};function Z(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var Cl=o(class extends s{constructor(e){if(super(e),e.type!==h.ATTRIBUTE||e.name!==`class`||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return` `+Object.keys(e).filter(t=>e[t]).join(` `)+` `}update(e,[t]){if(this.st===void 0){this.st=new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(` `).split(/\s/).filter(e=>e!==``)));for(let e in t)t[e]&&!this.nt?.has(e)&&this.st.add(e);return this.render(t)}let n=e.element.classList;for(let e of this.st)e in t||(n.remove(e),this.st.delete(e));for(let e in t){let r=!!t[e];r===this.st.has(e)||this.nt?.has(e)||(r?(n.add(e),this.st.add(e)):(n.remove(e),this.st.delete(e)))}return ee}}),wl=[`aria-labelledby`,`aria-describedby`,`aria-invalid`,`aria-errormessage`,`aria-required`,`aria-label`];function Tl(e){return e.hasAttribute(`aria-labelledby`)||e.hasAttribute(`aria-describedby`)||e.hasAttribute(`aria-errormessage`)}function El(e,t){for(let n of wl){let r=e.getAttribute(n);r===null?t.removeAttribute(n):t.setAttribute(n,r)}}var Dl=class{constructor(e,t,n){this.host=e,this.getTarget=t,this.onSync=n}connect(){this.sync(),this.observer=new MutationObserver(()=>{this.sync()}),this.observer.observe(this.host,{attributes:!0,attributeFilter:[...wl]})}disconnect(){this.observer?.disconnect(),this.observer=void 0}sync(){if(!Tl(this.host)){this.onSync?.();return}let e=this.getTarget();e&&El(this.host,e)}},Ol=class extends Event{constructor(){super(`pk-invalid`,{bubbles:!0,cancelable:!1,composed:!0})}};function kl(){return{observedAttributes:[`custom-error`],checkValidity(e){let t={message:``,isValid:!0,invalidKeys:[]};return e.customError&&(t.message=e.customError,t.isValid=!1,t.invalidKeys.push(`customError`)),t}}}var Al=class extends Sl{static{this.formAssociated=!0}static get validators(){return[kl()]}static get observedAttributes(){let e=new Set(super.observedAttributes??[]);for(let t of this.validators)for(let n of t.observedAttributes??[])e.add(n);return[...e]}constructor(){super(),this.internals=this.attachInternals(),this.assumeInteractionOn=[`input`],this.validators=[],this.name=null,this.disabled=!1,this.required=!1,this.customError=null,this.valueHasChanged=!1,this.hasInteracted=!1,this.emittedEvents=[],this.emitInvalid=e=>{e.target===this&&(this.hasInteracted=!0,this.dispatchEvent(new Ol))},this.handleInteraction=e=>{this.emittedEvents.includes(e.type)||this.emittedEvents.push(e.type),this.emittedEvents.length>=this.assumeInteractionOn.length&&(this.hasInteracted=!0,this.updateValidity())},this.addEventListener(`invalid`,this.emitInvalid)}connectedCallback(){super.connectedCallback();for(let e of this.assumeInteractionOn)this.addEventListener(e,this.handleInteraction);this.updateValidity()}disconnectedCallback(){this.hostAriaMirror?.disconnect(),this.hostAriaMirror=void 0;for(let e of this.assumeInteractionOn)this.removeEventListener(e,this.handleInteraction);this.removeEventListener(`invalid`,this.emitInvalid),super.disconnectedCallback()}updated(e){e.has(`customError`)&&this.setCustomValidity(this.customError??``),e.has(`disabled`)&&this.setState(`disabled`,!!this.disabled),(e.has(`value`)||e.has(`disabled`)||e.has(`required`)||e.has(`name`))&&this.syncFormValue(),this.updateValidity(),super.updated(e),this.syncHostAriaMirror()}firstUpdated(e){super.firstUpdated(e),this.connectHostAriaMirror()}getAriaMirrorTarget(){return this.input??null}syncStandaloneAria(){}connectHostAriaMirror(){this.hostAriaMirror?.disconnect(),this.hostAriaMirror=new Dl(this,()=>this.getAriaMirrorTarget(),()=>this.syncStandaloneAria()),this.hostAriaMirror.connect()}syncHostAriaMirror(){this.hostAriaMirror?.sync()}formResetCallback(){this.resetValidity(),this.hasInteracted=!1,this.valueHasChanged=!1,this.emittedEvents=[],this.resetToDefaultValue(),this.syncFormValue(),this.updateValidity()}formDisabledCallback(e){this.disabled=e,this.updateValidity()}formStateRestoreCallback(e,t){this.restoreFormState(e),this.syncFormValue(),this.updateValidity()}set form(e){e?this.setAttribute(`form`,e):this.removeAttribute(`form`)}get form(){return this.internals.form}get labels(){return this.internals.labels}get validity(){return this.internals.validity}get willValidate(){return this.internals.willValidate}get validationMessage(){return this.internals.validationMessage}getForm(){return this.internals.form}checkValidity(){return this.updateValidity(),this.internals.checkValidity()}reportValidity(){return this.updateValidity(),this.hasInteracted=!0,this.internals.reportValidity()}resetValidity(){this.setCustomValidity(``),this.internals.setValidity({}),this.syncCustomStates()}setCustomValidity(e){if(!e){this.customError=null,this.internals.setValidity({}),this.syncCustomStates();return}this.customError=e;let t=this.validationTarget;t instanceof HTMLElement?this.internals.setValidity({customError:!0},e,t):this.internals.setValidity({customError:!0},e),this.syncCustomStates()}get validationTarget(){return this.input}get allValidators(){return[...this.constructor.validators??[],...this.validators??[]]}setFormValue(e,t){this.internals.setFormValue(e,t??e)}setValue(e,t){this.setFormValue(e,t??e)}updateValidity(){if(this.disabled||this.hasAttribute(`disabled`)||!this.willValidate){this.internals.setValidity({}),this.syncCustomStates();return}let e=this.allValidators;if(!e.length)return;let t={customError:!!this.customError},n=``,r=this.validationTarget;for(let r of e){let{isValid:e,message:i,invalidKeys:a}=r.checkValidity(this);if(!e){n||=i;for(let e of a)t[e]=!0}}n||=this.validationMessage,r instanceof HTMLElement?this.internals.setValidity(t,n,r):this.internals.setValidity(t,n),this.syncCustomStates()}syncCustomStates(){let e=this.internals.validity.valid;this.setState(`required`,this.required),this.setState(`optional`,!this.required),this.setState(`invalid`,!e),this.setState(`valid`,e),this.setState(`user-invalid`,!e&&this.hasInteracted),this.setState(`user-valid`,e&&this.hasInteracted)}setState(e,t){let n=this.internals.states;n&&(t?n.add(e):n.delete(e))}syncFormValue(){}resetToDefaultValue(){}restoreFormState(e){}};Z([l({reflect:!0})],Al.prototype,`name`,void 0),Z([l({type:Boolean,reflect:!0})],Al.prototype,`disabled`,void 0),Z([l({type:Boolean,reflect:!0})],Al.prototype,`required`,void 0),Z([l({attribute:`custom-error`,reflect:!0})],Al.prototype,`customError`,void 0),Z([l({attribute:!1,state:!0})],Al.prototype,`valueHasChanged`,void 0),Z([l({attribute:!1,state:!0})],Al.prototype,`hasInteracted`,void 0);function jl(){return{checkValidity(e){let t=e.input,n={message:``,isValid:!0,invalidKeys:[]};if(!t)return n;let r=!0;if(`checkValidity`in t&&typeof t.checkValidity==`function`&&(r=t.checkValidity()),r)return n;if(n.isValid=!1,`validationMessage`in t&&typeof t.validationMessage==`string`&&(n.message=t.validationMessage),!(`validity`in t)||!t.validity)return n.invalidKeys.push(`customError`),n;for(let e of Object.keys(t.validity)){if(e===`valid`)continue;let r=e;t.validity[r]&&n.invalidKeys.push(r)}return n}}}var Ml=class{constructor(e,...t){this.host=e,this.boundSlots=new Set,this.lastHasContent=new Map,this.handleSlotChange=()=>{let e=!1;for(let t of this.slotNames){let n=this.test(t);this.lastHasContent.get(t)!==n&&(this.lastHasContent.set(t,n),e=!0)}e&&this.host.requestUpdate()},this.slotNames=t,e.addController(this)}hostConnected(){this.bindSlotListeners()}hostUpdated(){this.bindSlotListeners()}hostDisconnected(){for(let e of this.boundSlots)e.removeEventListener(`slotchange`,this.handleSlotChange);this.boundSlots.clear()}bindSlotListeners(){for(let e of this.slotNames){let t=this.findSlot(e);!t||this.boundSlots.has(t)||(this.boundSlots.add(t),t.addEventListener(`slotchange`,this.handleSlotChange),this.lastHasContent.has(e)||this.lastHasContent.set(e,this.test(e)))}}findSlot(e){return this.host.shadowRoot?e?this.host.shadowRoot.querySelector(`slot[name="${e}"]`):this.host.shadowRoot.querySelector(`slot:not([name])`):null}test(e,t=!1){if(t||this.hasLightDomSlotContent(e))return!0;let n=this.findSlot(e);return n?n.assignedNodes({flatten:!0}).some(e=>e.nodeType===Node.TEXT_NODE?!!e.textContent?.trim():e.nodeType===Node.ELEMENT_NODE):!1}hasLightDomSlotContent(e){return[...this.host.children].some(t=>t.getAttribute(`slot`)===e)}},Nl=0;function Pl(e=`pk`){return Nl+=1,`${e}-${Nl}`}[`a[href]`,`button:not([disabled])`,`input:not([disabled])`,`select:not([disabled])`,`textarea:not([disabled])`,`[tabindex]:not([tabindex="-1"])`].join(`,`),[`a[href]`,`button`,`input`,`select`,`textarea`,`[tabindex]:not([tabindex="-1"])`].join(`,`);var Fl=class{constructor(e=`polite`){this.element=document.createElement(`div`),this.element.setAttribute(`aria-live`,e),this.element.setAttribute(`aria-atomic`,`true`),this.element.className=`pk-visually-hidden`,this.element.style.cssText=`position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;`,document.body.append(this.element)}announce(e){this.element.textContent=``,requestAnimationFrame(()=>{this.element.textContent=e})}destroy(){this.element.remove()}},Il=class extends Event{constructor(){super(`pk-show`,{bubbles:!0,cancelable:!1,composed:!0})}},Ll=class extends Event{constructor(){super(`pk-after-show`,{bubbles:!0,cancelable:!1,composed:!0})}},Rl=class extends Event{constructor(e=`unknown`){super(`pk-hide`,{bubbles:!0,cancelable:!0,composed:!0}),this.detail={source:e}}},zl=class extends Event{constructor(){super(`pk-after-hide`,{bubbles:!0,cancelable:!1,composed:!0})}};function Bl(e){let t=e.split(`-`)[0];return t===`inline-start`?`left`:t===`inline-end`?`right`:t===`top`||t===`bottom`||t===`left`||t===`right`?t:`bottom`}function Vl(e,t,n,r,i){let a=Bl(e),o=t.x+t.width/2-n.x,s=t.y+t.height/2-n.y;return Math.abs(i?.y??0)>r&&(a===`top`||a===`bottom`)?`${o}px ${t.y+t.height/2-n.y}px`:{top:`${o}px calc(100% + ${r}px)`,bottom:`${o}px ${-r}px`,left:`calc(100% + ${r}px) ${s}px`,right:`${-r}px ${s}px`}[a]}function Hl(e,t){if(!t){e.removeAttribute(`data-side`);return}e.setAttribute(`data-side`,Bl(t))}function Ul(e,t,n=100,r){let i=()=>e.getAttribute(`data-current-placement`)??t;return!r?.requireEvent&&e.hasAttribute(`data-current-placement`)?Promise.resolve(i()):new Promise(t=>{let a=!1,o=()=>{a||(a=!0,t(i()))};e.addEventListener(`pk-reposition`,o,{once:!0}),r?.requireEvent||requestAnimationFrame(()=>{requestAnimationFrame(()=>{e.hasAttribute(`data-current-placement`)&&o()})}),window.setTimeout(o,n)})}var Wl=globalThis.HTMLElement!==void 0&&Object.prototype.hasOwnProperty.call(globalThis.HTMLElement.prototype,`popover`);function Gl(e){return ql(e)}function Kl(e){return e.assignedSlot?e.assignedSlot:e.parentNode instanceof ShadowRoot?e.parentNode.host:e.parentNode}function ql(e){for(let t=e;t;t=Kl(t))if(t instanceof Element&&getComputedStyle(t).display===`none`)return null;for(let t=Kl(e);t;t=Kl(t)){if(!(t instanceof Element))continue;let e=getComputedStyle(t);if(e.display!==`contents`&&(e.position!==`static`||y(e)||t.tagName===`BODY`))return t}return null}function Jl(e,t){if(!t)return null;let n=e.getRootNode();if(n instanceof Document||n instanceof ShadowRoot){let e=n.getElementById(t);if(e)return e}return e.ownerDocument.getElementById(t)}var Yl=class extends Event{constructor(){super(`pk-reposition`,{bubbles:!0,cancelable:!1,composed:!0})}},Xl=t`
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
`;function Zl(e){return typeof e==`object`&&!!e&&`getBoundingClientRect`in e}function Ql(e){return e||(Wl?`absolute`:`fixed`)}function $l(e,t){if(!(!Wl||Zl(e)||t!==`scroll`))return d(e).filter(e=>e instanceof Element)}var Q=class extends Sl{constructor(...e){super(...e),this.anchor=``,this.active=!1,this.boundary=`viewport`,this.placement=`bottom-start`,this.distance=4,this.skidding=0,this.flip=!0,this.flipFallbackPlacements=``,this.flipFallbackStrategy=`best-fit`,this.flipPadding=8,this.shift=!0,this.shiftPadding=8,this.arrow=!1,this.arrowPlacement=`anchor`,this.arrowPadding=10,this.anchorTracking=!0,this.hoverBridge=!1,this.anchorElement=null,this.settlingInitialPosition=!1,this.settleGeneration=0}static{this.styles=Xl}disconnectedCallback(){this.stop(),super.disconnectedCallback()}updated(e){super.updated(e),e.has(`active`)&&(this.active?(this.resolveAnchor(),this.start()):this.stop()),e.has(`anchor`)&&this.handleAnchorChange(),this.active&&!e.has(`active`)&&this.reposition()}reposition(){this.settlingInitialPosition||this.repositionAsync()}async repositionAsync(e=!0){let t=this.popupElement,n=this.arrow?this.arrowElement:null;if(!this.active||!this.anchorElement||!t)return!1;let i=$l(this.anchorElement,this.boundary),o=[r({mainAxis:this.distance,crossAxis:this.skidding})];this.sync?o.push(a({apply:({rects:e})=>{let n=this.sync===`width`||this.sync===`both`,r=this.sync===`height`||this.sync===`both`;t.style.width=n?`${e.reference.width}px`:``,t.style.height=r?`${e.reference.height}px`:``}})):(t.style.width=``,t.style.height=``),this.flip&&o.push(u({boundary:i,fallbackPlacements:this.flipFallbackPlacements?this.flipFallbackPlacements.split(` `).map(e=>e.trim()).filter(Boolean):void 0,fallbackStrategy:this.flipFallbackStrategy===`best-fit`?`bestFit`:`initialPlacement`,padding:this.flipPadding})),this.shift&&o.push(_({boundary:i,padding:this.shiftPadding})),this.arrow&&n&&o.push(v({element:n,padding:this.arrowPadding}));let s=Ql(this.positionMethod),c=s===`fixed`;t.classList.toggle(`popup-fixed`,c);let l=Wl?e=>m.getOffsetParent(e,Gl):m.getOffsetParent,{x:d,y:f,middlewareData:p,placement:h}=await g(this.anchorElement,t,{placement:this.placement,middleware:o,strategy:s,platform:{...m,getOffsetParent:l}});if(!this.active||!t.isConnected)return!1;let y={top:`bottom`,right:`left`,bottom:`top`,left:`right`}[h.split(`-`)[0]];if(this.setAttribute(`data-current-placement`,h),Object.assign(t.style,{left:`${d}px`,top:`${f}px`,...c?{position:`fixed`}:{position:``}}),this.anchorElement){let e=this.anchorElement.getBoundingClientRect(),n=t.getBoundingClientRect();t.style.setProperty(`--pk-anchor-width`,`${e.width}px`),t.style.setProperty(`--pk-anchor-height`,`${e.height}px`);let r=Vl(h,e,n,this.distance,p.shift);t.style.setProperty(`--pk-transform-origin`,r)}if(this.arrow&&n){let e=p.arrow?.x,t=p.arrow?.y,r=``,i=``,a=``,o=``;if(this.arrowPlacement===`start`){let n=typeof e==`number`?`${this.arrowPadding}px`:``;r=typeof t==`number`?`${this.arrowPadding}px`:``,o=n}else this.arrowPlacement===`end`?(i=typeof e==`number`?`${this.arrowPadding}px`:``,a=typeof t==`number`?`${this.arrowPadding}px`:``):this.arrowPlacement===`center`?(o=typeof e==`number`?`50%`:``,r=typeof t==`number`?`50%`:``):(o=typeof e==`number`?`${e}px`:``,r=typeof t==`number`?`${t}px`:``);Object.assign(n.style,{top:r,right:i,bottom:a,left:o,transform:``,[y]:`calc(-1 * var(--pk-popup-arrow-size, 6px) / 2)`})}return requestAnimationFrame(()=>this.updateHoverBridge()),e&&this.dispatchEvent(new Yl),!0}frames(e){return new Promise(t=>{let n=e=>{if(e<=0){t();return}requestAnimationFrame(()=>n(e-1))};n(e)})}async settleInitialPosition(){let e=++this.settleGeneration,t=this.popupElement;if(!t){this.settlingInitialPosition=!1;return}await this.frames(2),!(!this.active||e!==this.settleGeneration)&&(await this.repositionAsync(!1),t.offsetHeight,await this.frames(1),!(!this.active||e!==this.settleGeneration)&&(await this.repositionAsync(!1),!(!this.active||e!==this.settleGeneration)&&(t.classList.add(`positioned`),this.settlingInitialPosition=!1,requestAnimationFrame(()=>this.updateHoverBridge()),this.dispatchEvent(new Yl))))}resolveAnchor(){if(typeof this.anchor==`string`&&this.anchor){this.anchorElement=Jl(this,this.anchor);return}if(this.anchor instanceof Element||Zl(this.anchor)){this.anchorElement=this.anchor;return}let e=this.querySelector(`[slot="anchor"]`);e instanceof HTMLSlotElement&&(e=e.assignedElements({flatten:!0})[0]??null),this.anchorElement=e}async handleAnchorChange(){await this.stop(),this.resolveAnchor(),this.anchorElement&&this.active&&this.start()}usesPopoverTopLayer(){return Wl&&this.positionMethod!==`fixed`}stop(){return new Promise(e=>{let t=this.popupElement;this.settleGeneration+=1,this.settlingInitialPosition=!1,t?.classList.remove(`positioned`),this.usesPopoverTopLayer()&&t?.hidePopover?.(),this.cleanup?(this.cleanup(),this.cleanup=void 0,t?.style.removeProperty(`--pk-transform-origin`),requestAnimationFrame(()=>e())):e(),this.removeAttribute(`data-current-placement`)})}releasePositioning(){this.cleanup&&=(this.cleanup(),void 0)}async awaitHidden(){await this.stop()}start(){!this.anchorElement||!this.active||!this.isConnected||!this.popupElement||(this.popupElement.classList.remove(`positioned`),this.settlingInitialPosition=!0,this.usesPopoverTopLayer()&&this.popupElement.showPopover?.(),this.anchorTracking&&(this.cleanup=p(this.anchorElement,this.popupElement,()=>{this.settlingInitialPosition||this.reposition()})),this.settleInitialPosition())}getContentElement(){let e=((this.shadowRoot?.querySelector(`slot:not([name])`))?.assignedElements({flatten:!0})??[]).find(e=>e instanceof HTMLElement);if(e)return e;for(let e of this.childNodes)if(e instanceof HTMLElement&&e.getAttribute(`slot`)!==`anchor`)return e;return null}updateHoverBridge(){let e=this.popupElement;if(!this.hoverBridge||!this.anchorElement||!e)return;let t=this.anchorElement.getBoundingClientRect(),n=e.getBoundingClientRect(),r=this.placement.includes(`top`)||this.placement.includes(`bottom`),i=0,a=0,o=0,s=0,c=0,l=0,u=0,d=0;r?t.top<n.top?(i=t.left,a=t.bottom,o=t.right,s=t.bottom,c=n.left,l=n.top,u=n.right,d=n.top):(i=n.left,a=n.bottom,o=n.right,s=n.bottom,c=t.left,l=t.top,u=t.right,d=t.top):t.left<n.left?(i=t.right,a=t.top,o=n.left,s=n.top,c=t.right,l=t.bottom,u=n.left,d=n.bottom):(i=n.right,a=n.top,o=t.left,s=t.top,c=n.right,l=n.bottom,u=t.left,d=t.bottom),this.style.setProperty(`--pk-hover-bridge-top-left-x`,`${i}px`),this.style.setProperty(`--pk-hover-bridge-top-left-y`,`${a}px`),this.style.setProperty(`--pk-hover-bridge-top-right-x`,`${o}px`),this.style.setProperty(`--pk-hover-bridge-top-right-y`,`${s}px`),this.style.setProperty(`--pk-hover-bridge-bottom-left-x`,`${c}px`),this.style.setProperty(`--pk-hover-bridge-bottom-left-y`,`${l}px`),this.style.setProperty(`--pk-hover-bridge-bottom-right-x`,`${u}px`),this.style.setProperty(`--pk-hover-bridge-bottom-right-y`,`${d}px`)}render(){let e=!Wl||this.positionMethod===`fixed`,t=this.usesPopoverTopLayer();return i`
            <slot name="anchor" @slotchange=${()=>{this.handleAnchorChange()}}></slot>
            ${this.hoverBridge?i`
                <div
                    part="hover-bridge"
                    class=${Cl({"hover-bridge":!0,"hover-bridge-visible":this.active})}
                    aria-hidden="true"
                ></div>
            `:b}
            <div
                popover=${t?`manual`:b}
                part="popup"
                class=${Cl({popup:!0,active:this.active,"popup-fixed":e})}
            >
                ${this.arrow?i`<div part="arrow" class="arrow"></div>`:b}
                <slot></slot>
            </div>
        `}};Z([l()],Q.prototype,`anchor`,void 0),Z([l({type:Boolean,reflect:!0})],Q.prototype,`active`,void 0),Z([l({attribute:`position-method`})],Q.prototype,`positionMethod`,void 0),Z([l({reflect:!0})],Q.prototype,`boundary`,void 0),Z([l({reflect:!0})],Q.prototype,`placement`,void 0),Z([l({type:Number})],Q.prototype,`distance`,void 0),Z([l({type:Number})],Q.prototype,`skidding`,void 0),Z([l({type:Boolean})],Q.prototype,`flip`,void 0),Z([l({attribute:`flip-fallback-placements`})],Q.prototype,`flipFallbackPlacements`,void 0),Z([l({attribute:`flip-fallback-strategy`})],Q.prototype,`flipFallbackStrategy`,void 0),Z([l({attribute:`flip-padding`,type:Number})],Q.prototype,`flipPadding`,void 0),Z([l({type:Boolean})],Q.prototype,`shift`,void 0),Z([l({attribute:`shift-padding`,type:Number})],Q.prototype,`shiftPadding`,void 0),Z([l({type:Boolean})],Q.prototype,`arrow`,void 0),Z([l({attribute:`arrow-placement`})],Q.prototype,`arrowPlacement`,void 0),Z([l({attribute:`arrow-padding`,type:Number})],Q.prototype,`arrowPadding`,void 0),Z([l()],Q.prototype,`sync`,void 0),Z([l({attribute:`anchor-tracking`,type:Boolean})],Q.prototype,`anchorTracking`,void 0),Z([l({attribute:`hover-bridge`,type:Boolean})],Q.prototype,`hoverBridge`,void 0),Z([ne(`.popup`)],Q.prototype,`popupElement`,void 0),Z([ne(`.arrow`)],Q.prototype,`arrowElement`,void 0),Q=Z([c(`pk-popup`)],Q);function eu(e={}){let{validationElement:t,validationProperty:n}=e;!t&&typeof document<`u`&&(t=Object.assign(document.createElement(`input`),{required:!0})),n||=`value`;let r={observedAttributes:[`required`],message:t?.validationMessage??`Please fill out this field.`,checkValidity(e){let t={message:``,isValid:!0,invalidKeys:[]};if(!e.required)return t;let i=e[n];return i!=null&&i!==!1&&i!==``?t:(t.isValid=!1,t.message=typeof r.message==`function`?r.message(e):r.message??``,t.invalidKeys.push(`valueMissing`),t)}};return r}var tu=t`
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
`;function nu(e,t){return t||(e.getAttribute(`hint`)??``)}function ru(e,t,n=!1){return!!t||e(`instructions`,n)||e(`hint`)}var iu=t`
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
`,au=i`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" aria-hidden="true">
        <path fill="currentColor" d="M557.5 192L534.9 214.6L278.9 470.6C266.4 483.1 246.1 483.1 233.6 470.6L105.6 342.6L83 320L128.3 274.7C129.6 276 172.3 318.7 256.3 402.7L489.7 169.3L512.3 146.7L557.6 192z" />
    </svg>
`,ou=class extends Al{constructor(...e){super(...e),this.assumeInteractionOn=[`change`],this.hasSlotController=new Ml(this,`instructions`,`hint`),this.checked=!1,this.defaultChecked=!1,this.invalid=!1,this.size=`default`,this.value=`on`,this.label=``,this.instructions=``}static{this.shadowRootOptions={mode:`open`,delegatesFocus:!0}}static{this.styles=[tu,iu]}static get validators(){return[...super.validators,jl(),eu({validationProperty:`checked`})]}connectedCallback(){this.instructions=nu(this,this.instructions),super.connectedCallback()}get validationTarget(){return this.input}syncFormValue(){this.setFormValue(this.checked?this.value:null,this.checked?`on`:`off`)}resetToDefaultValue(){this.checked=this.defaultChecked}restoreFormState(e){this.checked=e===`on`||e===this.value}updated(e){this.input&&e.has(`checked`)&&(this.input.checked=this.checked),super.updated(e)}click(){this.switchElement?.click()}focus(e){this.switchElement?.focus(e)}blur(){this.switchElement?.blur()}toggle(){this.disabled||(this.checked=!this.checked,this.emitCheckedChange())}handleKeyDown(e){let t=this.matches(`:dir(rtl)`);if(e.key===` `||e.key===`Enter`){e.preventDefault(),this.toggle();return}if(e.key===`ArrowLeft`){e.preventDefault(),this.checked=t,this.emitCheckedChange();return}e.key===`ArrowRight`&&(e.preventDefault(),this.checked=!t,this.emitCheckedChange())}emitCheckedChange(){this.hasInteracted=!0,this.dispatchEvent(new CustomEvent(`pk-change`,{detail:{checked:this.checked},bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`input`,{bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0}))}handleLabelClick(e){this.disabled||e.target===this.switchElement||this.toggle()}hasLabelContent(){if(this.label)return!0;let e=this.shadowRoot?.querySelector(`slot:not([name])`);return e?e.assignedNodes({flatten:!0}).some(e=>e.nodeType===Node.TEXT_NODE?!!e.textContent?.trim():e.nodeType===Node.ELEMENT_NODE):!1}render(){let e=ru((e,t)=>this.hasSlotController.test(e,t),this.instructions),t=this.hasLabelContent();return i`
            <div part="base" class="base">
                <button
                    part="switch"
                    class="switch"
                    type="button"
                    role="switch"
                    ?disabled=${this.disabled}
                    aria-checked=${this.checked?`true`:`false`}
                    aria-invalid=${this.invalid?`true`:b}
                    aria-describedby=${e?`instructions`:b}
                    aria-labelledby=${t?`label`:b}
                    @click=${this.toggle}
                    @keydown=${this.handleKeyDown}
                >
                    <span part="thumb" class="thumb">${au}</span>
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
                    aria-invalid=${this.invalid?`true`:b}
                    @change=${e=>e.stopPropagation()}
                />
                ${t||e?i`
                        <div class="content" @click=${this.handleLabelClick}>
                            ${t?i`
                                    <span part="label" class="label" id="label">
                                        <slot></slot>${this.label}
                                    </span>
                                `:b}
                            ${e?i`
                                    <span part="instructions" class="instructions form-control__instructions" id="instructions">
                                        <slot name="instructions">${this.instructions}</slot>
                                        <slot name="hint"></slot>
                                    </span>
                                `:b}
                        </div>
                    `:b}
            </div>
        `}};Z([l({type:Boolean,reflect:!0})],ou.prototype,`checked`,void 0),Z([l({attribute:`default-checked`,type:Boolean})],ou.prototype,`defaultChecked`,void 0),Z([l({type:Boolean,reflect:!0})],ou.prototype,`invalid`,void 0),Z([l({reflect:!0})],ou.prototype,`size`,void 0),Z([l()],ou.prototype,`value`,void 0),Z([l()],ou.prototype,`label`,void 0),Z([l()],ou.prototype,`instructions`,void 0),Z([ne(`.input`)],ou.prototype,`input`,void 0),Z([ne(`[part="switch"]`)],ou.prototype,`switchElement`,void 0),ou=Z([c(`pk-lightswitch`)],ou);var su=[t`
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
`,t`
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
    `],$=class extends Sl{constructor(...e){super(...e),this.placement=`top`,this.trigger=`hover focus`,this.disabled=!1,this.openDelay=0,this.closeDelay=0,this.content=``,this.for=``,this.open=!1,this.triggerElement=null,this.contentAnimated=!1,this.closing=!1,this.contentSide=null,this.hasSlottedBody=!1,this.triggerId=Pl(`pk-tooltip-trigger`),this.tooltipId=Pl(`pk-tooltip`),this.showGeneration=0,this.exitGeneration=0,this.syncPlacementAnimation=()=>{let e=this.popupElement?.getAttribute(`data-current-placement`)??this.placement,t=this.popupElement?.getContentElement();this.contentSide=e?Bl(e):null,Hl(this.popupElement,e),t&&Hl(t,e)},this.onBodySlotChange=e=>{let t=e.target;this.hasSlottedBody=t.assignedNodes({flatten:!0}).some(e=>e.nodeType===Node.ELEMENT_NODE||e.nodeType===Node.TEXT_NODE&&!!e.textContent?.trim())},this.scheduleShow=()=>{this.usesPointerTrigger()&&(window.clearTimeout(this.closeTimer),window.clearTimeout(this.openTimer),this.openTimer=window.setTimeout(()=>this.showTooltip(),this.openDelay))},this.scheduleHide=()=>{this.usesPointerTrigger()&&(window.clearTimeout(this.openTimer),window.clearTimeout(this.closeTimer),this.closeTimer=window.setTimeout(()=>this.hideTooltip(),this.closeDelay))}}static{this.styles=su}disconnectedCallback(){this.popupElement?.removeEventListener(`pk-reposition`,this.syncPlacementAnimation),this.clearTimers(),this.hideTooltip(!0),super.disconnectedCallback()}updated(e){super.updated(e),(e.has(`trigger`)||e.has(`disabled`)||e.has(`for`))&&this.rebindTrigger(),this.disabled&&this.open&&this.hideTooltip(!0)}firstUpdated(){this.popupElement.addEventListener(`pk-reposition`,this.syncPlacementAnimation),this.for&&queueMicrotask(()=>{this.resolveExternalTrigger()})}async show(){this.disabled||(this.clearTimers(),this.showTooltip(!0),await this.updateComplete)}async hide(){this.clearTimers(),this.hideTooltip(!0),await this.updateComplete}clearTimers(){window.clearTimeout(this.openTimer),window.clearTimeout(this.closeTimer)}resolveExternalTrigger(){this.triggerElement=Jl(this,this.for),this.rebindTrigger()}onTriggerSlotChange(e){let[t]=e.target.assignedElements({flatten:!0});this.unbindTrigger(this.triggerElement),this.triggerElement=t??null,this.rebindTrigger(),this.requestUpdate()}rebindTrigger(){this.unbindTrigger(this.triggerElement),this.for&&(this.triggerElement=Jl(this,this.for)),this.bindTrigger(this.triggerElement)}usesPointerTrigger(){return!this.disabled&&this.trigger!==`manual`}bindTrigger(e){!e||!this.usesPointerTrigger()||(e.id||=this.triggerId,e.setAttribute(`aria-describedby`,this.tooltipId),e.addEventListener(`mouseenter`,this.scheduleShow),e.addEventListener(`mouseleave`,this.scheduleHide),e.addEventListener(`focus`,this.scheduleShow),e.addEventListener(`blur`,this.scheduleHide))}unbindTrigger(e){e&&(e.removeAttribute(`aria-describedby`),e.removeEventListener(`mouseenter`,this.scheduleShow),e.removeEventListener(`mouseleave`,this.scheduleHide),e.removeEventListener(`focus`,this.scheduleShow),e.removeEventListener(`blur`,this.scheduleHide))}getAnchor(){return this.for?Jl(this,this.for):this.triggerElement?this.triggerElement:null}prepareContentForEnter(e){e&&(e.classList.remove(`closing`),e.style.animation=`none`,e.getBoundingClientRect(),e.style.removeProperty(`animation`),e.style.removeProperty(`opacity`),e.style.removeProperty(`transform`))}showTooltip(e=!1){if(!this.getAnchor()||this.open&&this.contentAnimated&&!this.closing&&!e)return;this.open||this.dispatchEvent(new Il);let t=++this.showGeneration;this.exitGeneration+=1,this.closing=!1,this.open=!0,this.contentAnimated=!1,this.prepareContentForEnter(this.popupElement?.getContentElement()),this.updateComplete.then(async()=>{t===this.showGeneration&&(await Ul(this.popupElement,this.placement),t===this.showGeneration&&(this.syncPlacementAnimation(),this.prepareContentForEnter(this.popupElement?.getContentElement()),this.contentAnimated=!0,this.dispatchEvent(new Ll),this.dispatchEvent(new CustomEvent(`pk-open-change`,{detail:{open:!0},bubbles:!0,composed:!0}))))})}hideTooltip(e=!1,t=!1){if(!(!this.open&&!this.closing&&!e)&&!(this.closing&&!e)){if(t){let e=new Rl(`api`);if(!this.dispatchEvent(e))return}if(this.showGeneration+=1,e){this.finishHide();return}if(!this.contentAnimated){this.finishHide();return}this.playExitAnimation()}}async playExitAnimation(){if(!this.open)return;let e=this.exitGeneration+1;this.exitGeneration=e;let t=this.popupElement?.getContentElement();this.closing=!0,this.contentAnimated=!1,t&&await this.waitForExitAnimation(t),e===this.exitGeneration&&this.finishHide()}waitForExitAnimation(e){return new Promise(t=>{let n=!1,r=()=>{n||(n=!0,e.removeEventListener(`animationend`,i),window.clearTimeout(a),e.classList.remove(`closing`),t())},i=t=>{t.target===e&&t.animationName.startsWith(`pk-tooltip-out`)&&r()};e.classList.add(`closing`),e.addEventListener(`animationend`,i);let a=window.setTimeout(r,200)})}finishHide(){let e=this.popupElement?.getContentElement();this.closing=!1,this.contentAnimated=!1,this.contentSide=null,this.open=!1,this.popupElement?.removeAttribute(`data-side`),this.prepareContentForEnter(e),this.dispatchEvent(new zl),this.dispatchEvent(new CustomEvent(`pk-open-change`,{detail:{open:!1},bubbles:!0,composed:!0}))}render(){let e=this.getAnchor();return i`
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
                    class=${Cl({content:!0,"pk-popup-content":!0,closing:this.closing})}
                    id=${this.tooltipId}
                    role="tooltip"
                    ?hidden=${!this.open&&!this.closing}
                    data-open=${this.contentAnimated&&!this.closing?``:b}
                    data-side=${this.contentSide??b}
                >
                    <slot @slotchange=${this.onBodySlotChange}></slot>
                    ${this.hasSlottedBody?b:this.content||b}
                </div>
            </pk-popup>
        `}};Z([l({reflect:!0})],$.prototype,`placement`,void 0),Z([l({reflect:!0})],$.prototype,`trigger`,void 0),Z([l({type:Boolean,reflect:!0})],$.prototype,`disabled`,void 0),Z([l({type:Number,attribute:`open-delay`})],$.prototype,`openDelay`,void 0),Z([l({type:Number,attribute:`close-delay`})],$.prototype,`closeDelay`,void 0),Z([l()],$.prototype,`content`,void 0),Z([l({reflect:!0})],$.prototype,`for`,void 0),Z([ne(`pk-popup`)],$.prototype,`popupElement`,void 0),Z([f()],$.prototype,`open`,void 0),Z([f()],$.prototype,`contentAnimated`,void 0),Z([f()],$.prototype,`closing`,void 0),Z([f()],$.prototype,`contentSide`,void 0),Z([f()],$.prototype,`hasSlottedBody`,void 0),$=Z([c(`pk-tooltip`)],$);export{Si as A,hi as B,bc as C,Ki as D,fo as E,Bi as F,T as G,St as H,$a as I,ne as J,ae as K,qr as L,Mi as M,W as N,io as O,_o as P,I as R,$s as S,To as T,E as U,Jt as V,S as W,Z as _,Ul as a,ol as b,Rl as c,Pl as d,Ml as f,Sl as g,Cl as h,Hl as i,La as j,ao as k,Il as l,Al as m,eu as n,zl as o,jl as p,he as q,Jl as r,Ll as s,tu as t,Fl as u,bl as v,Eo as w,_l as x,$c as y,An as z};
//# sourceMappingURL=tooltip-BJzvveoH.js.map