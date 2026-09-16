import{_ as e,d as t,f as n,h as r,i,l as a,m as o,n as s,o as c,p as l,r as u,s as d,t as f,u as p}from"./class-map-Ba3saTy9.js";import{a as m,d as h,f as g,i as _,n as v,o as y,t as ee}from"./block-type-icon-BtGCYu3D.js";import{Bt as te,Ct as ne,Ht as re,It as ie,Lt as ae,Rt as oe,S as se,Ut as b,Vt as ce,_ as le,d as ue,i as de,q as fe,tt as pe,wt as me,zt as he}from"./unsafe-html-CokSp8NY.js";import{c as ge,s as _e}from"./pk-popup-B9AgBC2V-CAICLNc5.js";import{a as ve}from"./field-labels-CoU9dnNq-BuplxFCK.js";import{_ as x,a as ye,d as be,f as xe,g as S,i as Se,l as Ce,m as we,n as Te,o as Ee,p as C,r as De,s as Oe,t as ke}from"./select-Dy43DN8U.js";import{A as Ae,C as je,D as Me,E as w,M as Ne,O as Pe,S as T,T as Fe,_ as Ie,a as Le,b as Re,c as ze,d as Be,f as Ve,g as He,h as Ue,i as We,j as E,k as Ge,l as Ke,m as qe,n as Je,p as Ye,r as Xe,t as Ze,u as Qe,v as $e,w as D,x as et,y as tt}from"./lightswitch-dgx--ucV.js";/* empty css               */import{n as nt,r as rt}from"./required-validator-CEg8dvjS-BVlj-MQ-.js";var it=s(class extends u{constructor(){super(...arguments),this.key=l}render(e,t){return this.key=e,t}update(e,[t,n]){return t!==this.key&&(we(e),this.key=t),n}}),at=(e,t,n)=>{let r=new Map;for(let i=t;i<=n;i++)r.set(e[i],i);return r},O=s(class extends u{constructor(e){if(super(e),e.type!==i.CHILD)throw Error(`repeat() can only be used in text expressions`)}dt(e,t,n){let r;n===void 0?n=t:t!==void 0&&(r=t);let i=[],a=[],o=0;for(let t of e)i[o]=r?r(t,o):o,a[o]=n(t,o),o++;return{values:a,keys:i}}render(e,t,n){return this.dt(e,t,n).values}update(e,[t,n,r]){let i=xe(e),{values:a,keys:s}=this.dt(t,n,r);if(!Array.isArray(i))return this.ut=s,a;let c=this.ut??=[],l=[],u,d,f=0,p=i.length-1,m=0,h=a.length-1;for(;f<=p&&m<=h;)if(i[f]===null)f++;else if(i[p]===null)p--;else if(c[f]===s[m])l[m]=S(i[f],a[m]),f++,m++;else if(c[p]===s[h])l[h]=S(i[p],a[h]),p--,h--;else if(c[f]===s[h])l[h]=S(i[f],a[h]),x(e,l[h+1],i[f]),f++,h--;else if(c[p]===s[m])l[m]=S(i[p],a[m]),x(e,i[f],i[p]),p--,m++;else if(u===void 0&&(u=at(s,m,h),d=at(c,f,p)),u.has(c[f])){if(u.has(c[p])){let t=d.get(s[m]),n=t===void 0?null:i[t];if(n===null){let t=x(e,i[f]);S(t,a[m]),l[m]=t}else l[m]=S(n,a[m]),x(e,i[f],n),i[t]=null;m++}else C(i[p]),p--}else C(i[f]),f++;for(;m<=h;){let t=x(e,l[h+1]);S(t,a[m]),l[m++]=t}for(;f<=p;){let e=i[f++];e!==null&&C(e)}return this.ut=s,we(e,l),o}}),ot=Object.defineProperty,st=Object.defineProperties,ct=Object.getOwnPropertyDescriptors,lt=Object.getOwnPropertySymbols,ut=Object.prototype.hasOwnProperty,dt=Object.prototype.propertyIsEnumerable,ft=(e,t,n)=>t in e?ot(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,k=(e,t)=>{for(var n in t||={})ut.call(t,n)&&ft(e,n,t[n]);if(lt)for(var n of lt(t))dt.call(t,n)&&ft(e,n,t[n]);return e},pt=(e,t)=>st(e,ct(t)),A=class extends T{apply({transform:e}){if(!this.options)return e;let{axis:t,value:n}=this.options;return pt(k({},e),{[t]:n})}};A.configure=D(A);var mt=A,ht=mt.configure({axis:`x`,value:0});mt.configure({axis:`y`,value:0});function gt(e,t,n){let r=k({},t);return e.boundingRectangle.top+t.y<=n.top?r.y=n.top-e.boundingRectangle.top:e.boundingRectangle.bottom+t.y>=n.top+n.height&&(r.y=n.top+n.height-e.boundingRectangle.bottom),e.boundingRectangle.left+t.x<=n.left?r.x=n.left-e.boundingRectangle.left:e.boundingRectangle.right+t.x>=n.left+n.width&&(r.x=n.left+n.width-e.boundingRectangle.right),r}var _t=class extends T{apply({transform:e}){let{size:t=20}=this.options??{},n=typeof t==`number`?t:t.x,r=typeof t==`number`?t:t.y;return pt(k({},e),{x:Math.ceil(e.x/n)*n,y:Math.ceil(e.y/r)*r})}};_t.configure=D(_t);var j=class extends T{constructor(e,t){super(e,t),this.boundingRectangle=Ne(null),this.destroy=Ae(()=>{if(!this.options)return;let{dragOperation:t}=e,{status:n}=t;if(n.initialized){let{element:e}=this.options,n=typeof e==`function`?e(t):e;if(!n)return;let r,i=()=>{this.boundingRectangle.value=Ue(n)},a=()=>{r||=setTimeout(()=>{i(),r=void 0},25)},o=new ResizeObserver(i);return o.observe(n),document.addEventListener(`scroll`,a,{passive:!0,capture:!0}),()=>{document.removeEventListener(`scroll`,a,{capture:!0}),o.disconnect(),this.boundingRectangle.value=null}}})}apply(e){let{shape:t,transform:n}=e;if(!t)return n;let r=this.boundingRectangle.value;if(!r)return n;let{initial:i,current:a}=t,{height:o,width:s}=a.boundingRectangle,c=i.center.x-s/2,l=i.center.y-o/2;return gt(new w(c,l,s,o),n,r)}};j.configure=D(j);var vt=j,yt=Object.create,bt=Object.defineProperty,xt=Object.defineProperties,St=Object.getOwnPropertyDescriptor,Ct=Object.getOwnPropertyDescriptors,M=Object.getOwnPropertySymbols,wt=Object.prototype.hasOwnProperty,Tt=Object.prototype.propertyIsEnumerable,Et=(e,t)=>(t=Symbol[e])?t:Symbol.for(`Symbol.`+e),N=e=>{throw TypeError(e)},P=(e,t,n)=>t in e?bt(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,Dt=(e,t)=>{for(var n in t||={})wt.call(t,n)&&P(e,n,t[n]);if(M)for(var n of M(t))Tt.call(t,n)&&P(e,n,t[n]);return e},Ot=(e,t)=>xt(e,Ct(t)),kt=(e,t)=>{var n={};for(var r in e)wt.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&M)for(var r of M(e))t.indexOf(r)<0&&Tt.call(e,r)&&(n[r]=e[r]);return n},At=e=>[,,,yt(null)],jt=[`class`,`method`,`getter`,`setter`,`accessor`,`field`,`value`,`get`,`set`],F=e=>e!==void 0&&typeof e!=`function`?N(`Function expected`):e,Mt=(e,t,n,r,i)=>({kind:jt[e],name:t,metadata:r,addInitializer:e=>n._?N(`Already initialized`):i.push(F(e||null))}),Nt=(e,t)=>P(t,Et(`metadata`),e[3]),I=(e,t,n,r)=>{for(var i=0,a=e[t>>1],o=a&&a.length;i<o;i++)t&1?a[i].call(n):r=a[i].call(n,r);return r},Pt=(e,t,n,r,i,a)=>{for(var o,s,c,l,u,d=t&7,f=!1,p=!1,m=e.length+1,h=jt[d+5],g=e[m-1]=[],_=e[m]||(e[m]=[]),v=(i=i.prototype,St({get[n](){return L(this,a)},set[n](e){return z(this,a,e)}},n)),y=r.length-1;y>=0;y--)l=Mt(d,n,c={},e[3],_),l.static=f,l.private=p,u=l.access={has:e=>n in e},u.get=e=>e[n],u.set=(e,t)=>e[n]=t,s=(0,r[y])({get:v.get,set:v.set},l),c._=1,s===void 0?F(s)&&(v[h]=s):typeof s!=`object`||!s?N(`Object expected`):(F(o=s.get)&&(v.get=o),F(o=s.set)&&(v.set=o),F(o=s.init)&&g.unshift(o));return v&&bt(i,n,v),i},Ft=(e,t,n)=>t.has(e)||N(`Cannot `+n),L=(e,t,n)=>(Ft(e,t,`read from private field`),t.get(e)),R=(e,t,n)=>t.has(e)?N(`Cannot add the same private member more than once`):t instanceof WeakSet?t.add(e):t.set(e,n),z=(e,t,n,r)=>(Ft(e,t,`write to private field`),t.set(e,n),n);function B(e){return e instanceof sn||e instanceof on}var V=10,It=class extends je{constructor(e){super(e);let t=Ae(()=>{let{dragOperation:t}=e;if(tt(t.activatorEvent)&&B(t.source)&&t.status.initialized){let t=e.registry.plugins.get(ze);if(t)return t.disable(),()=>t.enable()}}),n=e.monitor.addEventListener(`dragmove`,(e,t)=>{queueMicrotask(()=>{if(this.disabled||e.defaultPrevented||!e.nativeEvent)return;let{dragOperation:n}=t;if(!tt(e.nativeEvent)||!B(n.source)||!n.shape)return;let{actions:r,collisionObserver:i,registry:a}=t,{by:o}=e;if(!o)return;let s=Lt(o),{source:c,target:l}=n,{center:u}=n.shape.current,d=[],f=[];E(()=>{for(let e of a.droppables){let{id:t}=e;if(!e.accepts(c)||t===l?.id&&B(e)||!e.element)continue;let n=e.shape,r=new Be(e.element,{getBoundingClientRect:e=>Ie(e,void 0,.2)});!r.height||!r.width||(s==`down`&&u.y+V<r.center.y||s==`up`&&u.y-V>r.center.y||s==`left`&&u.x-V>r.center.x||s==`right`&&u.x+V<r.center.x)&&(d.push(e),e.shape=r,f.push(()=>e.shape=n))}}),e.preventDefault(),i.disable();let p=i.computeCollisions(d,Ke);E(()=>f.forEach(e=>e()));let[m]=p;if(!m)return;let{id:h}=m,{index:g,group:_}=c.sortable;r.setDropTarget(h).then(()=>{let{source:e,target:t,shape:a}=n;if(!e||!B(e)||!a)return;let{index:o,group:s,target:c}=e.sortable,l=g!==o||_!==s,u=l?c:t?.element;if(!u)return;et(u);let d=new Be(u);if(!d)return;let f=w.delta(d,w.from(a.current.boundingRectangle),e.alignment);r.move({by:f}),l?r.setDropTarget(e.id).then(()=>i.enable()):i.enable()})})});this.destroy=()=>{n(),t()}}};function Lt(e){let{x:t,y:n}=e;if(t>0)return`right`;if(t<0)return`left`;if(n>0)return`down`;if(n<0)return`up`}var Rt=Object.defineProperty,zt=Object.defineProperties,Bt=Object.getOwnPropertyDescriptors,Vt=Object.getOwnPropertySymbols,Ht=Object.prototype.hasOwnProperty,Ut=Object.prototype.propertyIsEnumerable,Wt=(e,t,n)=>t in e?Rt(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,H=(e,t)=>{for(var n in t||={})Ht.call(t,n)&&Wt(e,n,t[n]);if(Vt)for(var n of Vt(t))Ut.call(t,n)&&Wt(e,n,t[n]);return e},U=(e,t)=>zt(e,Bt(t));function Gt(e,t,n){if(t===n)return e;let r=e.slice();return r.splice(n,0,r.splice(t,1)[0]),r}function Kt(e){return`initialIndex`in e&&typeof e.initialIndex==`number`&&`index`in e&&typeof e.index==`number`}function qt(e,t,n){let{source:r,target:i,canceled:a}=t.operation;if(!r||!i||a)return`preventDefault`in t&&t.preventDefault(),e;let o=(e,t)=>e===t||typeof e==`object`&&`id`in e&&e.id===t;if(Array.isArray(e)){let s=e.findIndex(e=>o(e,r.id)),c=e.findIndex(e=>o(e,i.id));if(s===-1||c===-1){if(Kt(r)){let i=r.initialIndex,a=r.index;return i===a||i<0||i>=e.length?(`preventDefault`in t&&t.preventDefault(),e):n(e,i,a)}return e}if(!a&&`index`in r&&typeof r.index==`number`){let t=r.index;if(t!==s)return n(e,s,t)}return n(e,s,c)}let s=Object.entries(e),c=-1,l,u=-1,d;for(let[e,t]of s)if(c===-1&&(c=t.findIndex(e=>o(e,r.id)),c!==-1&&(l=e)),u===-1&&(u=t.findIndex(e=>o(e,i.id)),u!==-1&&(d=e)),c!==-1&&u!==-1)break;if(c===-1&&Kt(r)){let i=r.initialGroup,a=r.initialIndex,o=r.group,s=r.index;if(i==null||o==null||!(i in e)||!(o in e)||i===o&&a===s)return`preventDefault`in t&&t.preventDefault(),e;if(i===o)return U(H({},e),{[i]:n(e[i],a,s)});let c=e[i][a];return U(H({},e),{[i]:[...e[i].slice(0,a),...e[i].slice(a+1)],[o]:[...e[o].slice(0,s),c,...e[o].slice(s)]})}if(!r.manager)return e;let{dragOperation:f}=r.manager,p=f.shape?.current.center??f.position.current;if(d==null&&i.id in e){let t=i.shape&&p.y>i.shape.center.y?e[i.id].length:0;d=i.id,u=t}if(l==null||d==null||l===d&&c===u){if(l!=null&&l===d&&c===u&&Kt(r)){let t=r.group!=null&&r.group!==l,i=r.index!==c;if(t||i){let t=r.group??l;if(t in e){if(l===t)return U(H({},e),{[l]:n(e[l],c,r.index)});let i=e[l][c];return U(H({},e),{[l]:[...e[l].slice(0,c),...e[l].slice(c+1)],[t]:[...e[t].slice(0,r.index),i,...e[t].slice(r.index)]})}}}return`preventDefault`in t&&t.preventDefault(),e}if(l===d)return U(H({},e),{[l]:n(e[l],c,u)});let m=i.shape&&Math.round(p.y)>Math.round(i.shape.center.y)?1:0,h=e[l][c];return U(H({},e),{[l]:[...e[l].slice(0,c),...e[l].slice(c+1)],[d]:[...e[d].slice(0,u+m),h,...e[d].slice(u+m)]})}function Jt(e,t){return qt(e,t,Gt)}var Yt=`__default__`,Xt=class extends je{constructor(e){super(e);let t=()=>{let t=new Map;for(let n of e.registry.droppables)if(n instanceof sn){let{sortable:e}=n,{group:r}=e,i=t.get(r);i||(i=new Set,t.set(r,i)),i.add(e)}for(let[e,n]of t)t.set(e,new Set(W(n)));return t},n=[e.monitor.addEventListener(`dragover`,(e,n)=>{if(this.disabled)return;let{dragOperation:r}=n,{source:i,target:a}=r;if(!B(i)||!B(a)||i.sortable===a.sortable)return;let o=t(),s=i.sortable.group===a.sortable.group,c=o.get(i.sortable.group),l=s?c:o.get(a.sortable.group);!c||!l||queueMicrotask(()=>{e.defaultPrevented||n.renderer.rendering.then(()=>{let r=t();for(let[e,t]of o.entries()){let n=Array.from(t).entries();for(let[t,i]of n)if(i.index!==t||i.group!==e||!r.get(e)?.has(i))return}let u=i.sortable.element,d=a.sortable.element;if(!d||!u||!s&&a.id===i.sortable.group)return;let f=W(c),p=s?f:W(l),m=i.sortable.group??Yt,h=a.sortable.group??Yt,g={[m]:f,[h]:p},_=Jt(g,e);if(g===_)return;let v=_[h].indexOf(i.sortable),y=_[h].indexOf(a.sortable);n.collisionObserver.disable(),Zt(u,v,d,y),E(()=>{for(let[e,t]of _[m].entries())t.index=e;if(!s)for(let[e,t]of _[h].entries())t.group=a.sortable.group,t.index=e}),n.actions.setDropTarget(i.id).then(()=>n.collisionObserver.enable())})})}),e.monitor.addEventListener(`dragend`,(e,n)=>{if(!e.canceled)return;let{dragOperation:r}=n,{source:i}=r;B(i)&&(i.sortable.initialIndex!==i.sortable.index||i.sortable.initialGroup!==i.sortable.group)&&queueMicrotask(()=>{let e=t(),r=e.get(i.sortable.initialGroup);r&&n.renderer.rendering.then(()=>{for(let[t,n]of e.entries()){let e=Array.from(n).entries();for(let[n,r]of e)if(r.index!==n||r.group!==t)return}let t=W(r),n=i.sortable.element,a=t[i.sortable.initialIndex],o=a?.element;!a||!o||!n||(Zt(n,a.index,o,i.index),E(()=>{for(let[t,n]of e.entries()){let e=Array.from(n).values();for(let t of e)t.index=t.initialIndex,t.group=t.initialGroup}}))})})})];this.destroy=()=>{for(let e of n)e()}}};function Zt(e,t,n,r){let i=r<t?`afterend`:`beforebegin`;n.insertAdjacentElement(i,e)}function Qt(e,t){return e.index-t.index}function W(e){return Array.from(e).sort(Qt)}var $t=[It,Xt],en={duration:250,easing:`cubic-bezier(0.25, 1, 0.5, 1)`,idle:!1},G=new Me,tn,nn=[Pe],K,rn,q,J,an,Y;tn=[Pe];var X=class{constructor(e,t){R(this,rn,I(K,8,this)),I(K,11,this),R(this,q),R(this,J),R(this,an,I(K,12,this)),I(K,15,this),R(this,Y),this.register=()=>(E(()=>{var e,t;(e=this.manager)==null||e.registry.register(this.droppable),(t=this.manager)==null||t.registry.register(this.draggable)}),()=>this.unregister()),this.unregister=()=>{E(()=>{var e,t;(e=this.manager)==null||e.registry.unregister(this.droppable),(t=this.manager)==null||t.registry.unregister(this.draggable)})},this.destroy=()=>{E(()=>{this.droppable.destroy(),this.draggable.destroy()})};var n=e,{effects:r=()=>[],group:i,index:a,sensors:o,type:s,transition:c=en,plugins:l}=n,u=kt(n,[`effects`,`group`,`index`,`sensors`,`type`,`transition`,`plugins`]);let d=Fe(l,$t);this.droppable=new sn(u,t,this),this.draggable=new on(Ot(Dt({},u),{plugins:d,effects:()=>[()=>{let e=this.manager?.dragOperation.status;e?.initializing&&this.id===this.manager?.dragOperation.source?.id&&G.clear(this.manager),e?.dragging&&G.set(this.manager,this.id,Ge(()=>({initialIndex:this.index,initialGroup:this.group})))},()=>{let{index:e,group:t,manager:n}=this,r=L(this,J),i=L(this,q);(e!==r||t!==i)&&(z(this,J,e),z(this,q,t),this.animate())},()=>{let{target:e}=this,{isDragSource:t}=this.draggable;(this.draggable.pluginConfig(Le)?.feedback??`default`)===`move`&&t&&(this.droppable.disabled=!e)},...r()],type:s,sensors:o}),t,this),z(this,Y,u.element),this.manager=t,this.index=a,z(this,J,a),this.group=i,z(this,q,i),this.type=s,this.transition=c}get initialIndex(){return G.get(this.manager,this.id)?.initialIndex??this.index}get initialGroup(){return G.get(this.manager,this.id)?.initialGroup??this.group}animate(){Ge(()=>{let{manager:e,transition:t}=this,{shape:n}=this.droppable;if(!e)return;let{idle:r}=e.dragOperation.status;!n||!t||r&&!t.idle||e.renderer.rendering.then(()=>{let{element:r}=this;if(!r)return;for(let e of r.getAnimations())`transitionProperty`in e&&(e.transitionProperty===`transform`||e.transitionProperty===`translate`||e.transitionProperty===`scale`)&&e.cancel();let i=this.refreshShape();if(!i)return;let a={x:n.boundingRectangle.left-i.boundingRectangle.left,y:n.boundingRectangle.top-i.boundingRectangle.top},{translate:o}=He(r),s=qe(r,o,!1),c=qe(r,o);if(a.x||a.y){let n=Re($e(r))?Ot(Dt({},t),{duration:0}):t;Ye({element:r,keyframes:{translate:[`${s.x+a.x}px ${s.y+a.y}px ${s.z}`,`${c.x}px ${c.y}px ${c.z}`]},options:n}).then(()=>{e.dragOperation.status.dragging||(this.droppable.shape=void 0)})}})})}get manager(){return this.draggable.manager}set manager(e){E(()=>{this.draggable.manager=e,this.droppable.manager=e})}set element(e){E(()=>{let t=L(this,Y),n=this.droppable.element,r=this.draggable.element;(!n||n===t)&&(this.droppable.element=e),(!r||r===t)&&(this.draggable.element=e),z(this,Y,e)})}get element(){let e=L(this,Y);if(e)return Ve.get(e)??e??this.droppable.element}set target(e){this.droppable.element=e}get target(){return this.droppable.element}set source(e){this.draggable.element=e}get source(){return this.draggable.element}get disabled(){return this.draggable.disabled&&this.droppable.disabled}set plugins(e){this.draggable.plugins=Fe(e,$t)}set disabled(e){E(()=>{this.droppable.disabled=e,this.draggable.disabled=e})}set data(e){E(()=>{this.droppable.data=e,this.draggable.data=e})}set handle(e){this.draggable.handle=e}set id(e){this.droppable.id=e,this.draggable.id=e}get id(){return this.droppable.id}set sensors(e){this.draggable.sensors=e}set modifiers(e){this.draggable.modifiers=e}set collisionPriority(e){this.droppable.collisionPriority=e}set collisionDetector(e){this.droppable.collisionDetector=e??Qe}set alignment(e){this.draggable.alignment=e}get alignment(){return this.draggable.alignment}set type(e){E(()=>{this.droppable.type=e,this.draggable.type=e})}get type(){return this.draggable.type}set accept(e){this.droppable.accept=e}get accept(){return this.droppable.accept}get isDropTarget(){return this.droppable.isDropTarget}get isDragSource(){return this.draggable.isDragSource}get isDragging(){return this.draggable.isDragging}get isDropping(){return this.draggable.isDropping}get status(){return this.draggable.status}refreshShape(){return this.droppable.refreshShape()}accepts(e){return this.droppable.accepts(e)}};K=At(),rn=new WeakMap,q=new WeakMap,J=new WeakMap,an=new WeakMap,Y=new WeakMap,Pt(K,4,`index`,nn,X,rn),Pt(K,4,`group`,tn,X,an),Nt(K,X);var on=class extends Xe{constructor(e,t,n){super(e,t),this.sortable=n}get index(){return this.sortable.index}get initialIndex(){return this.sortable.initialIndex}get group(){return this.sortable.group}get initialGroup(){return this.sortable.initialGroup}},sn=class extends We{constructor(e,t,n){super(e,t),this.sortable=n}get index(){return this.sortable.index}get group(){return this.sortable.group}},cn=`vizy-block-type`,ln=class{#e;#t=[];#n=[];#r;#i=null;#a=!1;#o=new Set;#s={x:0,y:0};#c=null;constructor(e){this.#r=e,this.#e=new Je({plugins:e=>[...e.filter(e=>e!==Ze),Le.configure({dropAnimation:null})],modifiers:e=>[...e,ht,vt.configure({element:()=>this.#r.container})]}),this.#g()}isDragging(){return this.#a}__testSyncReservedDropzones(){this.#f()}__testTrackSingleRowGroup(e){this.#o.add(e)}__testSetEmptyGroupDrop(e){this.#c={groupId:e}}__testHitTestEmptyGroup(e,t){return this.#s={x:e,y:t},this.#m()?.groupId??null}refresh(){this.#a||(this.#v(),this.#r.groupLists().forEach(e=>{let t=e.dataset.groupList;t&&this.#l(e).forEach((e,n)=>{let r=e.dataset.blockRow;if(!r)return;let i=e.querySelector(this.#r.handleSelector);this.#t.push(new X({id:r,element:e,index:n,group:t,type:cn,accept:cn,handle:i instanceof HTMLElement?i:void 0,data:{uid:r,groupId:t}},this.#e))})}))}destroy(){this.#n.forEach(e=>e()),this.#n=[],this.#p(),this.#v(),this.#e.destroy()}#l(e){return[...e.querySelectorAll(this.#r.rowSelector)].filter(e=>!e.hasAttribute(`data-dnd-placeholder`))}#u(e){return this.#r.container.querySelector(`[data-group-list="${e}"]`)}#d(e,t){let n=this.#u(e);if(!n||n.querySelector(`[data-empty-placeholder]:not([data-drag-reserved])`))return;let r=n.querySelector(`[data-drag-reserved]`);r||(r=document.createElement(`li`),r.className=`vizy-block-group-dropzone is-reserved`,r.dataset.emptyPlaceholder=e,r.dataset.dragReserved=`true`,r.innerHTML=`
                <span class="vizy-block-group-dropzone-label"></span>
            `,r.querySelector(`.vizy-block-group-dropzone-label`).textContent=this.#r.emptyGroupLabel,n.appendChild(r)),r.classList.toggle(`is-pending`,t)}#f(){for(let e of this.#o){let t=this.#u(e),n=!t||this.#l(t).length>0;this.#d(e,n)}}#p(){this.#r.container.querySelectorAll(`[data-drag-reserved]`).forEach(e=>e.remove())}#m(){for(let e of this.#r.groupLists()){let t=e.dataset.groupList;if(!t)continue;let n=e.querySelector(`[data-empty-placeholder]:not(.is-pending)`);if(!n)continue;let r=(e.closest(`.vizy-block-group`)??e).getBoundingClientRect();if(this.#s.x>=r.left&&this.#s.x<=r.right&&this.#s.y>=r.top&&this.#s.y<=r.bottom)return{groupId:t,dropzone:n}}return null}#h(e){this.#c=e?{groupId:e.groupId}:null;let t=e?.dropzone??null;this.#i!==t&&(this.#i?.classList.remove(`is-drop-target`),t?.classList.add(`is-drop-target`),this.#i=t)}#g(){let e=this.#r.containerDraggingClass??`is-sorting`,t=this.#r.rowDraggingClass??`is-dragging`,n=e=>{this.#s={x:e.clientX,y:e.clientY},this.#a&&(this.#f(),this.#h(this.#m()))};document.addEventListener(`pointermove`,n,!0),document.addEventListener(`mousemove`,n,!0),this.#n.push(()=>{document.removeEventListener(`pointermove`,n,!0),document.removeEventListener(`mousemove`,n,!0)}),this.#n.push(this.#e.monitor.addEventListener(`dragstart`,n=>{this.#a=!0,this.#c=null,this.#r.container.classList.add(e);let r=n.nativeEvent;r&&`clientX`in r&&(this.#s={x:r.clientX,y:r.clientY});let{source:i}=n.operation;if(B(i)&&i.element instanceof HTMLElement){i.element.classList.add(t);let e=i.data?.groupId;if(typeof e==`string`){let t=this.#u(e),n=t?this.#l(t):[];n.length===1&&n[0]===i.element&&this.#o.add(e)}}queueMicrotask(()=>{this.#a&&this.#f()})}),this.#e.monitor.addEventListener(`dragend`,n=>{let r=this.#c??this.#m();this.#c=null,this.#a=!1,this.#o.clear(),this.#p(),this.#r.container.classList.remove(e),this.#_(),this.#r.container.querySelectorAll(this.#r.rowSelector).forEach(e=>e.classList.remove(t));let{source:i}=n.operation;if(n.canceled||!B(i))return;if(r){this.#r.onReorder(String(i.id),r.groupId,0);return}let{initialIndex:a,index:o,initialGroup:s,group:c}=i.sortable;if(a===o&&s===c)return;let l=String(i.id);typeof c==`string`&&this.#r.onReorder(l,c,o)}))}#_(){this.#i?.classList.remove(`is-drop-target`),this.#i=null,this.#r.container.querySelectorAll(`[data-empty-placeholder].is-drop-target`).forEach(e=>e.classList.remove(`is-drop-target`))}#v(){this.#t.forEach(e=>{e.unregister(),e.destroy()}),this.#t=[]}},un=class extends Event{constructor(e){super(`pk-create`,{bubbles:!0,cancelable:!0,composed:!0}),this.inputValue=e}},dn=[g,e`
    ${be}
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
            --pk-combobox-min-height: 0;
            --pk-combobox-trigger-min-height: var(--pk-btn-height-default);
            --pk-combobox-padding-block: 6px;
            --pk-combobox-padding-inline: 10px;
            --pk-combobox-font-size: var(--pk-font-size-base);
            --pk-combobox-line-height: var(--pk-input-control-line-height, 1.25rem);
            --pk-combobox-decoration-size: 0.875rem;
            --pk-select-item-min-height: 0;
            --pk-select-item-padding-block: 6px;
            --pk-select-item-padding-inline: 10px;
            --pk-select-item-padding-inline-end: 2rem;
            --pk-select-item-font-size: 14px;
            --pk-select-item-line-height: 1.4;
            --pk-select-item-indicator-size: 0.75rem;
            --pk-select-item-indicator-inset: 0.5rem;
            /* v1 ComboboxLabel default: text-xs → 12px (was 11px). */
            --pk-select-group-label-font-size: 12px;
        }

        :host([width='full']) {
            display: block;
            width: 100%;
        }

        :host([width='full']) .control {
            width: 100%;
        }

        .control {
            display: inline-flex;
            align-items: center;
            --pk-combobox-control-gap: 0.5rem;
            gap: var(--pk-combobox-control-gap);
            /* Fill the host — consumers set min-width/width on :host; fit-content here
               left a dead hit strip beside the painted field (same class of bug as dropdown). */
            width: 100%;
            max-width: 100%;
            min-width: 0;
            min-height: var(--pk-combobox-min-height);
            margin: 0;
            padding: var(--pk-combobox-padding-block) var(--pk-combobox-padding-inline);
            border: 1px solid transparent;
            border-radius: var(--pk-radius-lg);
            --pk-combobox-fill: var(--pk-color-slate-250);
            --pk-combobox-fill-hover: var(--pk-color-slate-300);
            background: var(--pk-combobox-fill);
            color: var(--pk-color-gray-700);
            font: inherit;
            font-size: var(--pk-combobox-font-size);
            line-height: var(--pk-input-control-line-height, 1.25rem);
            white-space: nowrap;
            cursor: text;
            outline: none;
            box-sizing: border-box;
            transition: border-color 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
        }

        .control[data-popup-open] {
            border-color: var(--pk-color-sky-600);
            box-shadow: var(--pk-input-focus-shadow);
            background: var(--pk-color-white);
        }

        :host(:not([disabled])) .control:hover:not(.is-disabled) {
            background: var(--pk-combobox-fill-hover);
        }

        :host(:not([disabled])) .control[data-popup-open]:hover:not(.is-disabled),
        :host(:not([disabled])) .control[data-popup-open]:focus-within:not(.is-disabled) {
            border-color: var(--pk-color-sky-600);
            box-shadow: var(--pk-input-focus-shadow);
            background: var(--pk-color-white);
        }

        :host(:not([invalid]):not(:state(user-invalid))) .control:focus-within,
        :host(:not([invalid]):not(:state(user-invalid))[data-state='focus-visible']) .control {
            border-color: var(--pk-color-sky-600);
            box-shadow: var(--pk-input-focus-shadow);
            background: var(--pk-color-white);
        }

        .control.is-disabled {
            cursor: not-allowed;
            opacity: 0.5;
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
            width: var(--pk-combobox-decoration-size);
            height: var(--pk-combobox-decoration-size);
        }

        .combobox-input {
            flex: 1 1 auto;
            width: 100%;
            min-width: 0;
            margin: 0;
            padding: 0;
            border: 0;
            background: transparent;
            color: inherit;
            font: inherit;
            line-height: var(--pk-input-control-line-height, 1.25rem);
            outline: none;
        }

        .combobox-input::placeholder {
            color: currentColor;
        }

        :host([data-has-value]) .combobox-input::placeholder,
        .control[data-popup-open] .combobox-input::placeholder,
        .control:focus-within .combobox-input::placeholder {
            color: var(--pk-color-gray-400);
        }

        /* Expand/clear: the button box IS the hit target. Negative margins cancel the
           control padding / half-gap in layout, while matching extra width/height keeps
           the painted (and clickable) box flush to the field edge — so flex centering
           places the glyph in the middle of the real hit area. */
        .icon-button,
        .clear-button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            align-self: stretch;
            box-sizing: border-box;
            width: calc(var(--pk-combobox-decoration-size) + var(--pk-combobox-control-gap));
            height: auto;
            min-height: var(--pk-combobox-decoration-size);
            margin-block: calc(-1 * var(--pk-combobox-padding-block));
            margin-inline: calc(-0.5 * var(--pk-combobox-control-gap));
            padding: 0;
            border: 0;
            border-radius: 0;
            background: transparent;
            color: var(--pk-color-gray-600);
            cursor: pointer;
            outline: none;
        }

        /* Trailing control absorbs the control's inline-end padding into its hit box. */
        .control > .expand-button,
        .control > .clear-button:last-child {
            width: calc(
                var(--pk-combobox-decoration-size) + (0.5 * var(--pk-combobox-control-gap)) +
                    var(--pk-combobox-padding-inline)
            );
            margin-inline-start: calc(-0.5 * var(--pk-combobox-control-gap));
            margin-inline-end: calc(-1 * var(--pk-combobox-padding-inline));
        }

        .icon-button:disabled,
        .clear-button:disabled {
            cursor: not-allowed;
            opacity: 0.5;
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

        .icon svg {
            display: block;
            width: 0.75rem;
            height: 0.75rem;
        }

        .clear-button-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            line-height: 0;
            pointer-events: none;
        }

        .clear-button-icon svg {
            display: block;
            width: 0.75rem;
            height: 0.75rem;
        }

        .control--multiple {
            --pk-combobox-control-gap: 0.25rem;
            flex-wrap: wrap;
            align-items: center;
            align-content: center;
            width: 100%;
            max-width: 100%;
            height: auto;
            min-height: 0;
            padding: var(--pk-combobox-padding-block) var(--pk-combobox-padding-inline);
            gap: var(--pk-combobox-control-gap);
            border: var(--pk-input-border);
            border-radius: var(--pk-input-border-radius);
            background: var(--pk-input-bg);
            cursor: text;
        }

        :host([multiple][width='full']) .control--multiple {
            width: 100%;
        }

        :host([multiple]) .control:hover:not(.is-disabled) {
            background: var(--pk-input-bg);
        }

        :host([multiple]:not([invalid]):not(:state(user-invalid))) .control[data-popup-open],
        :host([multiple]:not([invalid]):not(:state(user-invalid))) .control:focus-within,
        :host([multiple]:not([invalid]):not(:state(user-invalid))[data-state='focus-visible']) .control {
            border-color: var(--pk-color-sky-600);
            box-shadow: var(--pk-input-focus-shadow);
            background: var(--pk-input-bg);
        }

        .chips {
            display: flex;
            flex: 0 1 auto;
            flex-wrap: wrap;
            gap: 0.25rem;
            align-items: center;
            min-width: 0;
        }

        .tag {
            /* v1 ComboboxChip: text-xs + py-[2px] → 20px; face color gray-700. */
            --pk-combobox-tag-height: 20px;
            --pk-combobox-tag-padding-inline-start: 6px;
            --pk-combobox-tag-remove-width: 1.25rem;
            display: inline-flex;
            box-sizing: border-box;
            align-items: center;
            justify-content: center;
            gap: 0.125rem;
            max-width: 100%;
            height: var(--pk-combobox-tag-height);
            padding-block: 0;
            padding-inline: var(--pk-combobox-tag-padding-inline-start) 0;
            border-radius: var(--pk-radius-sm);
            background: var(--pk-color-slate-200);
            color: var(--pk-color-gray-700);
            font-size: 12px;
            font-weight: 500;
            line-height: 1rem;
            white-space: nowrap;
        }

        .tag-label {
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* Chip remove: fill the chip end so the glyph centers in the real target. */
        .tag-remove {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            align-self: stretch;
            box-sizing: border-box;
            width: var(--pk-combobox-tag-remove-width);
            height: auto;
            min-height: 0;
            margin: 0;
            padding: 0;
            border: 0;
            border-radius: 0;
            background: transparent;
            color: inherit;
            cursor: pointer;
            opacity: 0.5;
            outline: none;
        }

        .tag-remove:hover {
            opacity: 1;
        }

        .tag-remove-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            line-height: 0;
            pointer-events: none;
        }

        .tag-remove-icon svg {
            display: block;
            width: 0.625rem;
            height: 0.625rem;
        }

        .combobox-input--inline {
            flex: 1 1 4rem;
            width: auto;
            min-width: 4rem;
            padding: 0;
        }

        :host([multiple]) .control:not([data-popup-open]):not(:focus-within) {
            background: var(--pk-input-bg);
        }

        :host([multiple]) .combobox-input::placeholder {
            color: var(--pk-color-gray-400);
        }

        .create-option {
            display: flex;
            align-items: center;
            width: 100%;
            margin: 0;
            min-height: var(--pk-select-item-min-height);
            padding-block: var(--pk-select-item-padding-block);
            padding-inline: var(--pk-select-item-padding-inline);
            border: 0;
            background: transparent;
            color: var(--pk-color-gray-700);
            font: inherit;
            font-size: var(--pk-select-item-font-size);
            line-height: var(--pk-select-item-line-height);
            text-align: left;
            cursor: pointer;
            outline: none;
            box-sizing: border-box;
        }

        .create-option:hover,
        .create-option.is-highlighted {
            background: var(--pk-color-slate-100);
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
            min-width: var(--pk-combobox-anchor-width, 8rem);
            padding: 0;
            border: 0;
            border-radius: var(--pk-radius-md);
            background: var(--pk-color-white);
            box-shadow: var(--pk-shadow-popup);
            color: var(--pk-color-gray-700);
            outline: none;
        }

        .panel-body {
            max-height: 16rem;
            overflow: auto;
        }

        .panel--popup {
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .panel--popup .panel-body {
            flex: 1 1 auto;
            min-height: 0;
        }

        :host([popup-mode]) .control--popup {
            display: inline-flex;
            width: 100%;
            max-width: 100%;
            min-height: 0;
            padding: 0;
            border: 0;
            border-radius: 0;
            background: transparent;
            gap: 0;
            cursor: default;
        }

        :host([popup-mode]) .control--popup:hover:not(.is-disabled) {
            background: transparent;
        }

        /* Popup mode paints chrome on the trigger / panel input — do not keep the
           shared .control[data-popup-open] focus ring around the closed-state button. */
        :host([popup-mode]) .control--popup[data-popup-open],
        :host([popup-mode]) .control--popup[data-popup-open]:hover:not(.is-disabled),
        :host([popup-mode]) .control--popup[data-popup-open]:focus-within:not(.is-disabled),
        :host([popup-mode]:not([invalid]):not(:state(user-invalid))) .control--popup:focus-within,
        :host([popup-mode]:not([invalid]):not(:state(user-invalid))[data-state='focus-visible']) .control--popup {
            border: 0;
            box-shadow: none;
            background: transparent;
        }

        .popup-trigger {
            display: inline-flex;
            align-items: center;
            justify-content: space-between;
            gap: 0.75rem;
            width: 100%;
            min-width: 12rem;
            max-width: 100%;
            min-height: var(--pk-combobox-trigger-min-height);
            margin: 0;
            padding: var(--pk-combobox-padding-block) var(--pk-combobox-padding-inline);
            border: 1px solid transparent;
            border-radius: var(--pk-input-border-radius);
            /* Match input-mode fill / v1 default Button — not a white outlined field. */
            background: var(--pk-combobox-fill, var(--pk-color-slate-250));
            color: var(--pk-color-gray-700);
            font: inherit;
            font-size: var(--pk-combobox-font-size);
            font-weight: 400;
            line-height: var(--pk-combobox-line-height);
            text-align: left;
            white-space: nowrap;
            cursor: pointer;
            outline: none;
            box-sizing: border-box;
            transition: border-color 0.12s ease, box-shadow 0.12s ease, background 0.12s ease;
        }

        .popup-trigger:hover:not(:disabled) {
            background: var(--pk-combobox-fill-hover, var(--pk-color-slate-300));
        }

        .popup-trigger:active:not(:disabled),
        .control--popup[data-popup-open] .popup-trigger:not(:disabled) {
            background: var(--pk-combobox-fill-hover, var(--pk-color-slate-300));
        }

        .control--popup[data-popup-open] .popup-trigger:not(:disabled) {
            border-color: transparent;
            box-shadow: none;
        }

        .control--popup:not([data-popup-open]) .popup-trigger:focus-visible,
        :host([data-state='focus-visible']) .control--popup:not([data-popup-open]) .popup-trigger {
            border-color: var(--pk-color-sky-600);
            box-shadow: var(--pk-input-focus-shadow);
            background: var(--pk-color-white);
        }

        .popup-trigger:disabled {
            cursor: not-allowed;
            opacity: 0.5;
        }

        .popup-trigger-value {
            flex: 1 1 auto;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .popup-trigger-value.is-placeholder {
            /* Trigger label is button text, not an input placeholder — keep it readable. */
            color: var(--pk-color-gray-700);
        }

        .popup-trigger-icon {
            flex-shrink: 0;
            display: inline-flex;
            align-items: center;
            line-height: 0;
        }

        .popup-trigger-icon svg {
            display: block;
            width: 0.75rem;
            height: 0.75rem;
        }

        .panel-search {
            flex: none;
            padding: 0.25rem;
        }

        .panel-input {
            display: block;
            width: 100%;
            min-width: 0;
            margin: 0;
            padding: 6px 8px;
            border: var(--pk-input-border);
            border-radius: var(--pk-input-border-radius);
            background: color-mix(in srgb, var(--pk-input-bg) 30%, transparent);
            color: var(--pk-color-gray-700);
            font: inherit;
            font-size: var(--pk-combobox-font-size);
            line-height: 1.4;
            outline: none;
            box-sizing: border-box;
        }

        .panel-input::placeholder {
            color: var(--pk-color-gray-400);
        }

        .panel-input:focus {
            border-color: var(--pk-color-sky-600);
            box-shadow: var(--pk-input-focus-shadow);
            background: var(--pk-color-white);
        }

        :host([popup-mode][size='xs']) .popup-trigger-icon svg {
            width: 0.625rem;
            height: 0.625rem;
        }

        :host([popup-mode][size='xs']) .panel-input {
            padding: 4px 8px;
            font-size: 11px;
        }

        :host([popup-mode][size='sm']) .panel-input {
            font-size: 12px;
        }

        :host([popup-mode][size='lg']) .panel-input {
            padding-block: 8px;
            padding-inline: 12px;
        }

        :host([popup-mode][width='full']) .popup-trigger {
            width: 100%;
        }

        .panel:not([data-open]):not(.closing) {
            opacity: 0;
            pointer-events: none;
        }

        .panel[data-open]:not(.closing) {
            opacity: 1;
            pointer-events: auto;
        }

        .panel[hidden] {
            display: none !important;
        }

        .empty {
            display: flex;
            align-items: center;
            margin: 0;
            min-height: var(--pk-select-item-min-height, var(--pk-input-height));
            padding-block: var(--pk-select-item-padding-block);
            padding-inline: var(--pk-select-item-padding-inline);
            border: var(--pk-select-trigger-border-width, 1px) solid transparent;
            box-sizing: border-box;
            color: var(--pk-color-gray-500);
            font-size: var(--pk-select-item-font-size);
            line-height: var(--pk-select-item-line-height);
        }

        .async-status {
            display: flex;
            align-items: center;
            margin: 0;
            min-height: var(--pk-select-item-min-height, var(--pk-input-height));
            padding-block: var(--pk-select-item-padding-block);
            padding-inline: var(--pk-select-item-padding-inline);
            border: var(--pk-select-trigger-border-width, 1px) solid transparent;
            box-sizing: border-box;
            color: var(--pk-color-gray-500);
            font-size: var(--pk-select-item-font-size);
            line-height: var(--pk-select-item-line-height);
        }

        :host([invalid]) .control,
        :host(:state(user-invalid)) .control {
            border-color: var(--pk-color-rose-600);
        }

        :host([multiple][invalid]) .control,
        :host([multiple]:state(user-invalid)) .control {
            border-color: var(--pk-color-rose-600);
        }

        :host([invalid]) .control:focus-within,
        :host([invalid][data-state='focus-visible']) .control,
        :host(:state(user-invalid)) .control:focus-within,
        :host(:state(user-invalid)[data-state='focus-visible']) .control {
            border-color: var(--pk-color-rose-600);
            box-shadow: var(--pk-input-invalid-focus-shadow);
        }

        :host([size='xs']) {
            --pk-combobox-min-height: 0;
            --pk-combobox-trigger-min-height: var(--pk-btn-height-xs);
            --pk-combobox-padding-block: 4px;
            --pk-combobox-padding-inline: 8px;
            --pk-combobox-font-size: 11px;
            --pk-combobox-decoration-size: 0.625rem;
            --pk-select-item-min-height: 0;
            --pk-select-item-padding-block: 4px;
            --pk-select-item-padding-inline: 8px;
            --pk-select-item-padding-inline-end: 1.75rem;
            --pk-select-item-font-size: 11px;
            --pk-select-item-indicator-size: 0.75rem;
            --pk-select-item-indicator-inset: 0.5rem;
            /* v1 ComboboxLabel xs: text-[11px] */
            --pk-select-group-label-font-size: 11px;
        }

        :host([size='xs']) .control {
            border-radius: var(--pk-radius-sm);
        }

        :host([size='xs']) .icon svg,
        :host([size='xs']) .clear-button-icon svg {
            width: 0.625rem;
            height: 0.625rem;
        }

        :host([size='sm']) {
            --pk-combobox-min-height: 0;
            --pk-combobox-trigger-min-height: var(--pk-btn-height-sm);
            --pk-combobox-padding-block: 6px;
            --pk-combobox-padding-inline: 10px;
            --pk-combobox-font-size: 12px;
            --pk-combobox-decoration-size: 0.6875rem;
            --pk-select-item-min-height: 0;
            --pk-select-item-padding-block: 6px;
            --pk-select-item-padding-inline: 10px;
            --pk-select-item-padding-inline-end: 1.75rem;
            --pk-select-item-font-size: 12px;
            --pk-select-item-indicator-inset: 0.625rem;
            /* v1 ComboboxLabel sm: text-[12px] — empty dropzone field picker uses sm. */
            --pk-select-group-label-font-size: 12px;
        }

        :host([size='sm']) .control {
            border-radius: var(--pk-radius-md);
        }

        :host([size='sm']) .popup-trigger {
            border-radius: var(--pk-radius-md);
        }

        :host([size='sm']) .icon svg,
        :host([size='sm']) .clear-button-icon svg {
            width: 0.6875rem;
            height: 0.6875rem;
        }

        :host([size='lg']) {
            --pk-combobox-trigger-min-height: var(--pk-btn-height-lg);
            --pk-combobox-padding-block: 8px;
            --pk-combobox-padding-inline: 12px;
            --pk-combobox-font-size: var(--pk-font-size-base);
            --pk-combobox-decoration-size: 1rem;
            --pk-select-item-padding-block: 8px;
            --pk-select-item-padding-inline: 12px;
            --pk-select-item-font-size: 14px;
            --pk-select-item-indicator-inset: 0.75rem;
            /* v1 ComboboxLabel lg: text-sm → 14px */
            --pk-select-group-label-font-size: 14px;
        }

        :host([size='xl']) {
            --pk-combobox-trigger-min-height: var(--pk-btn-height-xl);
            --pk-combobox-padding-block: 10px;
            --pk-combobox-padding-inline: 14px;
            --pk-combobox-font-size: var(--pk-font-size-base);
            --pk-combobox-decoration-size: 1.125rem;
            --pk-select-item-padding-block: 10px;
            --pk-select-item-padding-inline: 14px;
            --pk-select-item-padding-inline-end: 2.25rem;
            --pk-select-item-font-size: 14px;
            --pk-select-item-indicator-inset: 0.875rem;
            /* v1 ComboboxLabel xl: text-base → 16px */
            --pk-select-group-label-font-size: 16px;
        }

        :host([size='xl']) .icon svg,
        :host([size='xl']) .clear-button-icon svg {
            width: 0.875rem;
            height: 0.875rem;
        }
    }
`],fn=de(ve.chevronDown),pn=de(ve.xmark),Z=class extends rt{constructor(...e){super(...e),this.assumeInteractionOn=[`blur`,`input`],this.open=!1,this.multiple=!1,this.placement=`bottom-start`,this.sideOffset=6,this.clearable=!1,this.withClear=!1,this.allowCreate=!1,this.allowCustomValue=!1,this.autoHighlight=!1,this.popupMode=!1,this.searchPlaceholder=`Search`,this.invalid=!1,this.size=`default`,this.placeholder=``,this.emptyMessage=`No options found.`,this.value=``,this.defaultValue=``,this.values=[],this.defaultValues=[],this.label=``,this.instructions=``,this.ariaLabel=null,this.loopFocus=!0,this.filter=null,this.async=!1,this.loadingMessage=`Searching…`,this.startTypingMessage=`Start typing to search…`,this.fetchOptions=null,this.hasSlotController=new ae(this,`start`,`end`),this.listboxId=b(`pk-combobox-listbox`),this.inputId=b(`pk-combobox-input`),this.createOptionId=b(`pk-combobox-create`),this.options=[],this.inputValue=``,this.hasInputSinceOpening=!1,this.highlightedIndex=-1,this.createOptionHighlighted=!1,this.closing=!1,this.panelAnimated=!1,this.dismissRegistered=!1,this.panelEventTarget=null,this.asyncFetchRequestId=0,this.selectedOptionMeta=null,this.asyncLoading=!1,this.asyncError=null,this.handleOptionsMutation=(e={})=>{let t=this.getOptionElements(),n=t.length!==this.options.length||t.some((e,t)=>e!==this.options[t]);this.options=t,this.applySelection(),e.render!==!1&&n&&this.requestUpdate()},this.syncOptions=()=>{this.handleOptionsMutation({render:!0})},this.togglePanel=e=>{e?.preventDefault(),e?.stopPropagation(),!this.disabled&&(this.open||this.closing?this.closePanel(`api`):this.openPanel())},this.onDocumentPointerDown=e=>{this.isPointerInside(e)||this.closePanel(`light-dismiss`)},this.onDocumentKeyDown=e=>{if(!this.open)return;if(e.key===`Escape`){if(!_(this))return;e.preventDefault(),e.stopPropagation(),this.closePanel(`escape`);return}let t=this.panelInput;if(t&&e.composedPath().includes(t)||!(De.has(e.key)||ye(e)))return;let n=this.panelElement,r=e.composedPath();n&&r.includes(n)&&ke(e,{anchor:this.controlElement,panel:n})&&(e.preventDefault(),e.stopPropagation(),this.onListboxKeyDown(e))},this.handleOptionSelect=e=>{let{value:t}=e.detail;if(this.multiple){this.values=this.values.includes(t)?this.values.filter(e=>e!==t):[...this.values,t],this.inputValue=``,this.applySelection(),this.emitValueChange(),this.activeInput?.focus({preventScroll:!0});return}this.value=t,this.syncSelectedOptionMeta(),this.applySelection(),this.closePanel(`api`),this.emitValueChange()},this.handleOptionHighlight=e=>{if(!this.open)return;let t=this.getEnabledVisibleOptions().findIndex(t=>t.value===e.detail.value);t!==-1&&t!==this.highlightedIndex&&(this.highlightedIndex=t,this.syncHighlight())},this.handleControlMouseDown=e=>{if(this.disabled||this.usesPopupMode||e.composedPath().some(e=>e instanceof HTMLElement?e.classList.contains(`icon-button`)||e.classList.contains(`clear-button`)||e.classList.contains(`tag-remove`):!1))return;let t=e.target===this.activeInput;if(!this.open&&!this.closing){t||e.preventDefault(),this.activeInput?.focus({preventScroll:!0}),this.openPanel();return}t||(e.preventDefault(),this.activeInput?.focus({preventScroll:!0}))},this.handleTriggerKeyDown=e=>{if(!this.disabled){if(e.key===`Enter`||e.key===` `){e.preventDefault(),this.togglePanel(e);return}e.key===`ArrowDown`&&!this.open&&(e.preventDefault(),this.openPanel())}},this.handleListboxKeyDownEvent=e=>{this.open&&this.onListboxKeyDown(e.detail.keyboardEvent)},this.handleCreateMouseEnter=()=>{if(!this.open)return;let e=this.getEnabledVisibleOptions();this.highlightedIndex=e.length,this.syncHighlight()},this.handleCreateKeyDown=e=>{e.preventDefault(),e.stopPropagation(),this.onListboxKeyDown(e)}}static{this.styles=dn}static get validators(){return[...super.validators,nt(),{observedAttributes:[`required`],checkValidity:e=>{let t=e,n={message:`Please select an item in the list.`,isValid:!0,invalidKeys:[]};return!t.required||!(t.multiple?t.values.length===0:!t.value)?n:(n.isValid=!1,n.invalidKeys.push(`valueMissing`),n)}}]}get panelElement(){return this.popupElement?.getContentElement()??null}get panelInput(){return this.panelElement?.querySelector(`.panel-input`)}get panelBodyElement(){return this.panelElement?.querySelector(`.panel-body`)}get usesPopupMode(){return this.popupMode&&!this.multiple}get activeInput(){return this.usesPopupMode?this.panelInput:this.controlInput}keepsFocusOnInput(){return!!this.activeInput}maintainInputFocus(){this.activeInput?.focus({preventScroll:!0})}get listScrollContainer(){return this.panelBodyElement??this.panelElement??this}connectedCallback(){this.instructions=this.getAttribute(`hint`)??this.instructions,this.refreshOptions(),super.connectedCallback(),this.syncHasValueAttribute(),this.addEventListener(`pk-listbox-keydown`,this.handleListboxKeyDownEvent),this.optionsObserver=new MutationObserver(()=>{this.handleOptionsMutation({render:!0})}),this.optionsObserver.observe(this,{childList:!0,subtree:!0})}disconnectedCallback(){this.unbindPanelEvents(),this.removeEventListener(`pk-listbox-keydown`,this.handleListboxKeyDownEvent),this.optionsObserver?.disconnect(),this.liveRegion?.destroy(),this.liveRegion=void 0,window.clearTimeout(this.asyncFetchTimer),this.fetchAbortController?.abort(),this.closePanel(`api`),super.disconnectedCallback()}updated(e){(e.has(`value`)||e.has(`values`)||e.has(`multiple`))&&(this.syncHasValueAttribute(),this.syncSelectedOptionMeta(),this.applySelection()),super.updated(e)}get validationTarget(){return this.activeInput??this.popupTrigger??this.controlElement}getAriaMirrorTarget(){return this.activeInput??this.popupTrigger??this.controlElement??null}syncFormValue(){if(!this.name){this.setFormValue(null);return}if(this.multiple){let e=new FormData;for(let t of this.values)e.append(this.name,t);this.setFormValue(e);return}this.setFormValue(this.value||``)}resetToDefaultValue(){this.multiple?this.values=[...this.defaultValues]:this.value=this.defaultValue,this.inputValue=``,this.applySelection()}restoreFormState(e){if(e instanceof FormData&&this.name){this.values=e.getAll(this.name).map(String);return}typeof e==`string`&&(this.value=e)}syncHasValueAttribute(){this.toggleAttribute(`data-has-value`,this.hasSelection())}getOptionElements(){let e=this.popupElement?.getContentElement()?.querySelectorAll(`pk-option`);return e&&e.length>0?[...e]:[...this.querySelectorAll(`pk-option`)]}refreshOptions(){this.handleOptionsMutation({render:!1})}bindPanelEvents(){let e=this.panelElement;!e||e===this.panelEventTarget||(this.unbindPanelEvents(),this.panelEventTarget=e,e.addEventListener(`pk-option-select`,this.handleOptionSelect),e.addEventListener(`pk-option-highlight`,this.handleOptionHighlight),e.addEventListener(`pk-listbox-keydown`,this.handleListboxKeyDownEvent))}unbindPanelEvents(){this.panelEventTarget&&=(this.panelEventTarget.removeEventListener(`pk-option-select`,this.handleOptionSelect),this.panelEventTarget.removeEventListener(`pk-option-highlight`,this.handleOptionHighlight),this.panelEventTarget.removeEventListener(`pk-listbox-keydown`,this.handleListboxKeyDownEvent),null)}isOptionInHiddenGroup(e){return!!e.closest(`pk-option-group`)?.hidden}defaultFilter(e,t){let n=e.getLabel().toLowerCase(),r=e.value.toLowerCase(),i=(e.getSearchText?.()??n).toLowerCase();return n.includes(t)||r.includes(t)||i.includes(t)}matchesFilter(e,t){return this.filter?this.filter(e,t):this.defaultFilter(e,t)}getFilterQuery(){return!this.open||!this.multiple&&!this.hasInputSinceOpening&&!this.usesPopupMode?``:this.inputValue.trim().toLowerCase()}getVisibleOptions(){if(this.usesAsyncSearch)return this.options.filter(e=>!this.isOptionInHiddenGroup(e));let e=this.getFilterQuery();return this.options.filter(t=>this.isOptionInHiddenGroup(t)?!1:!e||this.matchesFilter(t,e))}getEnabledVisibleOptions(){return this.getVisibleOptions().filter(e=>!e.disabled)}getSelectedOptions(){if(this.multiple){let e=new Map(this.options.map(e=>[e.value,e]));return this.values.map(t=>e.get(t)).filter(e=>e!==void 0)}let e=this.options.find(e=>e.value===this.value);return e?[e]:[]}getSelectedOption(){return this.options.find(e=>e.value===this.value)}get usesAsyncSearch(){return this.async&&!!this.fetchOptions&&!this.multiple&&!this.usesPopupMode}getSelectedLabel(){return this.getSelectedOption()?.getLabel()??this.selectedOptionMeta?.label??this.value}clearAsyncOptionNodes(){this.querySelectorAll(`:scope > pk-option, :scope > pk-option-group, :scope > pk-separator`).forEach(e=>e.remove())}renderAsyncOptionNodes(e){let t=this.mergeAsyncItems(e);this.clearAsyncOptionNodes();for(let e of t){let t=document.createElement(`pk-option`);t.value=e.value,t.textContent=e.label,this.append(t)}this.handleOptionsMutation({render:!0})}mergeAsyncItems(e){if(!this.value)return e;let t=this.selectedOptionMeta??{value:this.value,label:this.getSelectedOption()?.getLabel()??this.value};return e.some(e=>e.value===t.value)?e:[...e,t]}syncSelectedOptionMeta(){if(!this.value){this.selectedOptionMeta=null;return}let e=this.getSelectedOption();e&&(this.selectedOptionMeta={value:e.value,label:e.getLabel()})}scheduleAsyncFetch(e){window.clearTimeout(this.asyncFetchTimer),this.asyncFetchTimer=window.setTimeout(()=>{this.runAsyncFetch(e)},200)}async runAsyncFetch(e){if(!this.fetchOptions)return;let t=++this.asyncFetchRequestId;if(this.fetchAbortController?.abort(),this.fetchAbortController=new AbortController,!e){this.asyncLoading=!1,this.asyncError=null,this.renderAsyncOptionNodes(this.value&&this.selectedOptionMeta?[this.selectedOptionMeta]:[]);return}this.asyncLoading=!0,this.asyncError=null;try{let n=await this.fetchOptions(e,this.fetchAbortController.signal);if(t!==this.asyncFetchRequestId)return;this.renderAsyncOptionNodes(n)}catch(e){if(this.fetchAbortController?.signal.aborted||t!==this.asyncFetchRequestId||e instanceof DOMException&&e.name===`AbortError`)return;console.error(`Failed to load combobox options:`,e),this.asyncError=`Failed to load options. Please try again.`,this.renderAsyncOptionNodes([])}finally{t===this.asyncFetchRequestId&&(this.asyncLoading=!1)}}getAsyncStatusMessage(){if(!this.usesAsyncSearch||!this.open)return null;if(this.asyncLoading)return this.loadingMessage;if(this.asyncError)return this.asyncError;let e=this.inputValue.trim();return e?this.getEnabledVisibleOptions().length===0&&!this.shouldShowCreateOption()?`No matches for "${e}".`:null:this.value?null:this.startTypingMessage}shouldShowAsyncEmpty(){return!this.usesAsyncSearch||!this.open||!this.inputValue.trim()||this.asyncLoading||this.asyncError?!1:this.getEnabledVisibleOptions().length===0&&!this.shouldShowCreateOption()}isSelected(e){return this.multiple?this.values.includes(e):this.value===e}getDisplayInputValue(){return this.usesPopupMode||this.multiple||this.open?this.inputValue:this.hasSelection()?this.getSelectedLabel():``}getTriggerDisplayValue(){return this.hasSelection()?this.getSelectedLabel():this.placeholder}isTriggerPlaceholder(){return!this.hasSelection()}hasSelection(){return this.multiple?this.values.length>0:!!(this.getSelectedOption()||this.selectedOptionMeta||this.value)}shouldShowCreateOption(){if(!this.allowCreate||!this.open||!this.multiple&&!this.hasInputSinceOpening)return!1;let e=this.inputValue.trim();if(!e)return!1;let t=e.toLowerCase();return!this.options.some(e=>e.getLabel().toLowerCase()===t||e.value.toLowerCase()===t)}getListboxNavItems(){let e=this.getEnabledVisibleOptions();return this.shouldShowCreateOption()&&this.createOptionElement?[...e,this.createOptionElement]:e}applySelection(){let e=this.getVisibleOptions(),t=this.open?this.getFilterQuery():``;for(let n of this.options)n.selected=this.isSelected(n.value),n.hidden=!e.includes(n),n.optionId=`${this.listboxId}-option-${n.value}`,n.matchQuery=t;for(let e of this.querySelectorAll(`pk-option-group`)){let t=[...e.querySelectorAll(`pk-option`)],n=t.length>0&&t.every(e=>e.hidden);e.toggleAttribute(`data-pk-filter-empty`,n)}Ee(this),this.syncValueInput(),this.open&&(this.syncHighlight(),this.announceFilterResults())}syncValueInput(){this.input&&(this.input.value=this.multiple?this.values.join(`,`):this.value,this.input.required=this.required)}syncHighlightedIndexToSelection(){if(this.multiple)return;let e=this.getEnabledVisibleOptions();if(!this.value||e.length===0)return;let t=e.findIndex(e=>e.value===this.value);t>=0&&(this.highlightedIndex=t)}resetHighlightedIndexOnOpen(){if(this.autoHighlight){if(this.value){this.syncHighlightedIndexToSelection();return}this.highlightedIndex=0;return}this.highlightedIndex=-1}syncHighlight(){let e=this.getEnabledVisibleOptions(),t=this.shouldShowCreateOption(),n=e.length+ +!!t;for(let e of this.options)e.highlighted=!1,e.focusIndex=-1;if(this.createOptionHighlighted=!1,n===0||this.highlightedIndex<0)return;if(this.highlightedIndex>=n&&(this.highlightedIndex=n-1),t&&this.highlightedIndex===e.length){this.createOptionHighlighted=!0,this.keepsFocusOnInput()||this.createOptionElement?.focus({preventScroll:!0}),Ce(this.createOptionElement,this.listScrollContainer,`vertical`,`auto`),this.keepsFocusOnInput()&&this.maintainInputFocus();return}let r=e[this.highlightedIndex];r&&(r.highlighted=!0,r.focusIndex=this.keepsFocusOnInput()?-1:0,Ce(r,this.listScrollContainer,`vertical`,`auto`),this.keepsFocusOnInput()&&this.maintainInputFocus())}getActiveDescendantId(){let e=this.getEnabledVisibleOptions();return this.shouldShowCreateOption()&&this.highlightedIndex===e.length?this.createOptionId:e[this.highlightedIndex]?.optionId||null}announceFilterResults(){this.liveRegion||=new re(`polite`);let e=this.getEnabledVisibleOptions().length,t=this.getFilterQuery();if(t){if(this.shouldShowCreateOption()){this.liveRegion.announce(`Create ${t}`);return}this.liveRegion.announce(e===0?`${this.emptyMessage}`:`${e} ${e===1?`result`:`results`} available`)}}async show(){this.open||this.closing||this.disabled||await this.openPanel()}async hide(e=`api`){!this.open||this.closing||await this.closePanel(e)}openPanel(){let e=this.controlElement;if(!e)return Promise.resolve();if(this.open)return this.activeInput?.focus({preventScroll:!0}),Promise.resolve();if(this.closing)return Promise.resolve();this.dispatchEvent(new ce),this.closing=!1,this.panelAnimated=!1,this.open=!0,this.hasInputSinceOpening=!1,this.inputValue=this.usesPopupMode?``:!this.multiple&&this.hasSelection()?this.getSelectedLabel():``,this.applySelection(),this.resetHighlightedIndexOnOpen(),this.usesAsyncSearch&&(this.syncSelectedOptionMeta(),this.asyncError=null,this.asyncLoading=!1,this.renderAsyncOptionNodes(this.selectedOptionMeta?[this.selectedOptionMeta]:[]));let t=e.getBoundingClientRect().width;return this.style.setProperty(`--pk-combobox-anchor-width`,`${t}px`),this.popupElement.active=!0,this.panelElement&&(this.panelElement.hidden=!1,_e(this.panelElement,this.placement)),this.registerDismissHandlers(),this.syncHighlight(),this.usesPopupMode?this.popupTrigger?.blur():this.activeInput?.focus({preventScroll:!0}),this.updateComplete.then(async()=>{let e=await ge(this.popupElement,this.placement,300,{requireEvent:!0});if(this.panelElement&&_e(this.panelElement,e),this.panelAnimated=!0,this.bindPanelEvents(),this.refreshOptions(),this.activeInput?.focus({preventScroll:!0}),this.highlightedIndex>=0&&!this.keepsFocusOnInput()){let e=this.getEnabledVisibleOptions(),t=this.highlightedIndex;this.shouldShowCreateOption()&&t===e.length?this.createOptionElement?.focus({preventScroll:!0}):e[t]?.focusControl()}this.dispatchEvent(new he),this.dispatchEvent(new CustomEvent(`pk-open-change`,{detail:{open:!0},bubbles:!0,composed:!0}))})}commitCustomValueIfAllowed(){if(this.multiple||!this.allowCustomValue)return!1;let e=this.inputValue.trim();if(!e)return!1;let t=this.options.find(t=>t.getLabel().toLowerCase()===e.toLowerCase()||t.value.toLowerCase()===e.toLowerCase())?.value??e;return this.value!==t&&(this.value=t,!0)}commitInputOnClose(e){return this.multiple||this.usesPopupMode?!1:this.hasInputSinceOpening?this.inputValue.trim()?this.shouldCommitCustomValueOnClose(e)?this.commitCustomValueIfAllowed():!1:this.value?(this.value=``,!0):!1:this.shouldCommitCustomValueOnClose(e)?this.commitCustomValueIfAllowed():!1}shouldCommitCustomValueOnClose(e){return e===`light-dismiss`||e===`pointer-dismiss`}async closePanel(e=`unknown`){if(!this.open||this.closing)return;let t=new te(e);if(!this.dispatchEvent(t))return;let n=this.commitInputOnClose(e);this.unbindPanelEvents(),this.closing=!0,this.panelAnimated=!1,await this.waitForExitAnimation(),this.open=!1,this.closing=!1,this.panelAnimated=!1,this.hasInputSinceOpening=!1,this.inputValue=``,this.panelElement&&(this.panelElement.hidden=!0,this.panelElement.removeAttribute(`data-side`)),this.popupElement.active=!1,this.unregisterDismissHandlers(),this.applySelection(),this.usesAsyncSearch&&(window.clearTimeout(this.asyncFetchTimer),this.fetchAbortController?.abort(),this.asyncLoading=!1,this.asyncError=null,this.renderAsyncOptionNodes(this.selectedOptionMeta?[this.selectedOptionMeta]:[])),n&&(this.syncHasValueAttribute(),this.emitValueChange()),this.shouldReturnFocusToInput(e)?this.usesPopupMode?this.popupTrigger?.focus({preventScroll:!0}):this.activeInput?.focus({preventScroll:!0}):(this.activeInput?.blur(),this.popupTrigger?.blur()),this.dispatchEvent(new oe),this.dispatchEvent(new CustomEvent(`pk-open-change`,{detail:{open:!1},bubbles:!0,composed:!0}))}waitForExitAnimation(){let e=this.panelElement;return e?new Promise(t=>{let n=!1,r=()=>{n||(n=!0,e.removeEventListener(`animationend`,i),window.clearTimeout(a),e.classList.remove(`closing`),t())},i=t=>{t.target===e&&t.animationName.startsWith(`pk-popup-content-out`)&&r()};e.classList.add(`closing`),e.addEventListener(`animationend`,i);let a=window.setTimeout(r,150)}):Promise.resolve()}shouldReturnFocusToInput(e){return e!==`light-dismiss`&&e!==`pointer-dismiss`}registerDismissHandlers(){m(this),this.dismissRegistered=!0,document.addEventListener(`pointerdown`,this.onDocumentPointerDown,!0),document.addEventListener(`keydown`,this.onDocumentKeyDown,!0)}unregisterDismissHandlers(){this.dismissRegistered&&=(y(this),!1),document.removeEventListener(`pointerdown`,this.onDocumentPointerDown,!0),document.removeEventListener(`keydown`,this.onDocumentKeyDown,!0)}isPointerInside(e){return Te(e,{anchor:this.controlElement,panel:this.panelElement})}handleCreateOption(){let e=this.inputValue.trim();if(!e)return;let t=new un(e);if(!this.dispatchEvent(t))return;let n=document.createElement(`pk-option`);if(n.value=e,n.textContent=e,this.append(n),this.multiple){this.values.includes(e)||(this.values=[...this.values,e]),this.inputValue=``,this.applySelection(),this.emitValueChange(),this.activeInput?.focus({preventScroll:!0});return}this.value=e,this.applySelection(),this.closePanel(`api`),this.emitValueChange()}removeTag(e,t){t.preventDefault(),t.stopPropagation(),this.values=this.values.filter(t=>t!==e),this.applySelection(),this.emitValueChange(),this.activeInput?.focus({preventScroll:!0})}handleClear(e){e.preventDefault(),e.stopPropagation(),this.multiple?this.values=[]:this.value=``,this.inputValue=``,this.selectedOptionMeta=null,this.usesAsyncSearch&&this.renderAsyncOptionNodes([]),this.applySelection(),this.dispatchEvent(new Oe),this.emitValueChange(),this.activeInput?.focus()}emitValueChange(){this.dispatchEvent(new CustomEvent(`pk-change`,{detail:{value:this.multiple?[...this.values]:this.value},bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`input`,{bubbles:!0,composed:!0})),this.dispatchEvent(new Event(`change`,{bubbles:!0,composed:!0}))}handleInput(e){this.hasInputSinceOpening=!0,this.inputValue=e.target.value,this.highlightedIndex=this.autoHighlight?0:-1,this.applySelection(),this.usesAsyncSearch&&(this.asyncError=null,this.scheduleAsyncFetch(this.inputValue.trim())),this.open||this.openPanel()}handleInputKeyDown(e){if(e.key===`Backspace`&&this.multiple&&!this.inputValue&&this.values.length>0){e.preventDefault(),this.values=this.values.slice(0,-1),this.applySelection(),this.emitValueChange();return}if(e.key===`Escape`&&this.open){if(e.preventDefault(),this.hasInputSinceOpening&&this.inputValue){this.hasInputSinceOpening=!1,this.inputValue=this.usesPopupMode?``:!this.multiple&&this.hasSelection()?this.getSelectedLabel():``,this.highlightedIndex=this.autoHighlight?0:-1,this.applySelection();return}this.closePanel(`escape`);return}if(e.key===`ArrowDown`&&!this.open){e.preventDefault(),this.openPanel();return}if(e.key===`Tab`&&this.open){let e=!1;this.multiple||(e=this.commitCustomValueIfAllowed()),this.closePanel(`api`),e&&(this.syncHasValueAttribute(),this.emitValueChange());return}if(this.open&&e.key===`Enter`&&!this.multiple&&this.getEnabledVisibleOptions().length===0&&this.allowCustomValue&&this.inputValue.trim()&&!this.shouldShowCreateOption()){e.preventDefault();let t=this.commitCustomValueIfAllowed();this.closePanel(`api`),t&&(this.syncHasValueAttribute(),this.emitValueChange());return}this.open&&this.onListboxKeyDown(e)}onListboxKeyDown(e){let t=this.getListboxNavItems(),n=this.getEnabledVisibleOptions();if(this.highlightedIndex<0){if(e.key===`ArrowDown`||e.key===`ArrowRight`){(n.length>0||this.shouldShowCreateOption())&&(e.preventDefault(),this.highlightedIndex=0,this.syncHighlight());return}if(e.key===`ArrowUp`||e.key===`ArrowLeft`){(n.length>0||this.shouldShowCreateOption())&&(e.preventDefault(),this.highlightedIndex=this.shouldShowCreateOption()?n.length:Math.max(n.length-1,0),this.syncHighlight());return}if(e.key===`Enter`||e.key===` `)return}if(e.key===`Enter`&&this.shouldShowCreateOption()&&this.highlightedIndex===n.length){e.preventDefault(),this.handleCreateOption();return}if(this.multiple&&(e.key===`Enter`||e.key===` `)){let t=n[this.highlightedIndex];t&&(e.preventDefault(),t.dispatchEvent(new CustomEvent(`pk-option-select`,{detail:{value:t.value},bubbles:!0,composed:!0})));return}this.highlightedIndex=Se(e,{items:t,currentIndex:this.highlightedIndex,multiselect:this.multiple,loop:this.loopFocus,onSelect:e=>{this.highlightedIndex=e,this.syncHighlight()},focusItem:e=>{if(!this.keepsFocusOnInput()){if(this.shouldShowCreateOption()&&e===n.length){this.createOptionElement?.focus({preventScroll:!0});return}n[e]?.focusControl()}},onClose:()=>{this.closePanel(`escape`)}})}renderHostDecorationSlot(e){return this.hasSlotController.test(e)?r`
            <span part=${e} class=${e===`start`?`control-start`:`control-end`}>
                <slot name=${e}></slot>
            </span>
        `:r`<slot name=${e} hidden></slot>`}renderChevronButton(){return r`
            <button
                type="button"
                class="icon-button expand-button"
                part="expand-button"
                aria-label="Toggle options"
                ?disabled=${this.disabled}
                @click=${this.togglePanel}
            >
                <span class="icon" aria-hidden="true">${h(fn)}</span>
            </button>
        `}renderTags(){return this.getSelectedOptions().map(e=>r`
            <span class="tag" part="tag">
                <span class="tag-label">${e.getLabel()}</span>
                <button
                    type="button"
                    class="tag-remove"
                    part="tag-remove"
                    aria-label=${`Remove ${e.getLabel()}`}
                    ?disabled=${this.disabled}
                    @click=${t=>this.removeTag(e.value,t)}
                >
                    <span class="tag-remove-icon" aria-hidden="true">${h(pn)}</span>
                </button>
            </span>
        `)}shouldShowPlaceholder(){return!this.inputValue.trim()&&!this.hasSelection()}renderInput(){let e=this.open?this.getActiveDescendantId():null,t=this.shouldShowPlaceholder();return r`
            <input
                part="input"
                class=${f({"combobox-input":!0,"control-input":!0,"combobox-input--inline":this.multiple})}
                type="text"
                role="combobox"
                id=${this.inputId}
                .value=${this.getDisplayInputValue()}
                placeholder=${t?this.placeholder:l}
                ?disabled=${this.disabled}
                aria-label=${this.ariaLabel??l}
                aria-expanded=${this.open?`true`:`false`}
                aria-controls=${this.listboxId}
                aria-autocomplete="list"
                aria-activedescendant=${e??l}
                @input=${this.handleInput}
                @keydown=${this.handleInputKeyDown}
            />
        `}renderPanelInput(){let e=this.open?this.getActiveDescendantId():null;return r`
            <div part="panel-search" class="panel-search">
                <input
                    part="panel-input"
                    class="combobox-input panel-input"
                    type="text"
                    role="combobox"
                    id=${this.inputId}
                    .value=${this.inputValue}
                    placeholder=${this.searchPlaceholder}
                    ?disabled=${this.disabled}
                    aria-label=${this.ariaLabel??this.searchPlaceholder}
                    aria-expanded="true"
                    aria-controls=${this.listboxId}
                    aria-autocomplete="list"
                    aria-activedescendant=${e??l}
                    @input=${this.handleInput}
                    @keydown=${this.handleInputKeyDown}
                />
            </div>
        `}renderPopupTrigger(){return r`
            <button
                type="button"
                part="trigger"
                class="popup-trigger"
                ?disabled=${this.disabled}
                aria-label=${this.ariaLabel??l}
                aria-haspopup="listbox"
                aria-expanded=${this.open?`true`:`false`}
                aria-controls=${this.listboxId}
                @click=${this.togglePanel}
                @keydown=${this.handleTriggerKeyDown}
            >
                <span
                    class=${f({"popup-trigger-value":!0,"is-placeholder":this.isTriggerPlaceholder()})}
                >
                    ${this.getTriggerDisplayValue()}
                </span>
                <span class="icon popup-trigger-icon" aria-hidden="true">${h(fn)}</span>
            </button>
        `}renderControlContent(){if(this.usesPopupMode)return this.renderPopupTrigger();let e=(this.clearable||this.withClear)&&this.hasSelection()&&!this.disabled;return this.multiple?r`
                ${this.renderHostDecorationSlot(`start`)}
                <div class="chips" part="tags">
                    ${this.renderTags()}
                    ${this.renderInput()}
                </div>
                ${this.renderHostDecorationSlot(`end`)}
                ${e?r`
                        <button
                            type="button"
                            class="clear-button"
                            part="clear-button"
                            aria-label="Clear selection"
                            ?disabled=${this.disabled}
                            @click=${this.handleClear}
                        >
                            <span class="clear-button-icon" aria-hidden="true">${h(pn)}</span>
                        </button>
                    `:l}
            `:r`
            ${this.renderHostDecorationSlot(`start`)}
            ${this.renderInput()}
            ${this.renderHostDecorationSlot(`end`)}
            ${e?r`
                    <button
                        type="button"
                        class="clear-button"
                        part="clear-button"
                        aria-label="Clear selection"
                        ?disabled=${this.disabled}
                        @click=${this.handleClear}
                    >
                        <span class="clear-button-icon" aria-hidden="true">${h(pn)}</span>
                    </button>
                `:l}
            ${this.renderChevronButton()}
        `}render(){let e=this.getEnabledVisibleOptions(),t=this.shouldShowCreateOption(),n=this.open&&(this.usesAsyncSearch?this.shouldShowAsyncEmpty():e.length===0&&!t),i=this.getAsyncStatusMessage(),a=this.inputValue.trim();return r`
            <input
                class="value-input"
                part="value-input"
                tabindex="-1"
                aria-hidden="true"
                .value=${this.multiple?this.values.join(`,`):this.value}
                ?required=${this.required}
                @input=${()=>this.updateValidity()}
            />
            <div
                part="control"
                class=${f({control:!0,"is-disabled":this.disabled,"control--multiple":this.multiple,"control--popup":this.usesPopupMode})}
                data-popup-open=${this.open?``:l}
                @mousedown=${this.handleControlMouseDown}
            >
                ${this.renderControlContent()}
            </div>
            <pk-popup
                .active=${this.open||this.closing}
                .anchor=${this.controlElement??``}
                .placement=${this.placement}
                .distance=${this.sideOffset}
                .sync=${`width`}
                flip
                shift
            >
                <div
                    part="panel"
                    class=${f({panel:!0,"pk-popup-content":!0,closing:this.closing,"panel--popup":this.usesPopupMode})}
                    tabindex="-1"
                    ?hidden=${!this.open&&!this.closing}
                    data-open=${this.panelAnimated&&!this.closing?``:l}
                >
                    ${this.usesPopupMode?this.renderPanelInput():l}
                    <div
                        part="panel-body"
                        class="panel-body"
                        id=${this.listboxId}
                        role="listbox"
                        aria-multiselectable=${this.multiple?`true`:`false`}
                        aria-busy=${this.usesAsyncSearch&&this.asyncLoading?`true`:l}
                        @slotchange=${this.syncOptions}
                    >
                        <slot></slot>
                        ${i?r`
                                <div part="async-status" class="async-status" role="status">${i}</div>
                            `:l}
                        ${t?r`
                                <button
                                    type="button"
                                    part="create-option"
                                    class=${f({"create-option":!0,"is-highlighted":this.createOptionHighlighted})}
                                    id=${this.createOptionId}
                                    role="option"
                                    aria-selected="false"
                                    tabindex="-1"
                                    @click=${this.handleCreateOption}
                                    @mouseenter=${this.handleCreateMouseEnter}
                                    @keydown=${this.handleCreateKeyDown}
                                >
                                    Create "${a}"
                                </button>
                            `:l}
                        ${n?r`
                                <div part="empty" class="empty">${this.emptyMessage}</div>
                            `:l}
                    </div>
                </div>
            </pk-popup>
        `}};c([t({type:Boolean,reflect:!0})],Z.prototype,`open`,void 0),c([t({type:Boolean,reflect:!0})],Z.prototype,`multiple`,void 0),c([t({reflect:!0})],Z.prototype,`placement`,void 0),c([t({attribute:`side-offset`,type:Number})],Z.prototype,`sideOffset`,void 0),c([t({type:Boolean,reflect:!0})],Z.prototype,`clearable`,void 0),c([t({attribute:`with-clear`,type:Boolean})],Z.prototype,`withClear`,void 0),c([t({attribute:`allow-create`,type:Boolean})],Z.prototype,`allowCreate`,void 0),c([t({attribute:`allow-custom-value`,type:Boolean})],Z.prototype,`allowCustomValue`,void 0),c([t({attribute:`auto-highlight`,type:Boolean})],Z.prototype,`autoHighlight`,void 0),c([t({attribute:`popup-mode`,type:Boolean,reflect:!0})],Z.prototype,`popupMode`,void 0),c([t({attribute:`search-placeholder`})],Z.prototype,`searchPlaceholder`,void 0),c([t({type:Boolean,reflect:!0})],Z.prototype,`invalid`,void 0),c([t({reflect:!0})],Z.prototype,`size`,void 0),c([t({reflect:!0})],Z.prototype,`width`,void 0),c([t()],Z.prototype,`placeholder`,void 0),c([t({attribute:`empty-message`})],Z.prototype,`emptyMessage`,void 0),c([t()],Z.prototype,`value`,void 0),c([t({attribute:`default-value`})],Z.prototype,`defaultValue`,void 0),c([t({type:Array,attribute:!1})],Z.prototype,`values`,void 0),c([t({attribute:!1})],Z.prototype,`defaultValues`,void 0),c([t()],Z.prototype,`label`,void 0),c([t()],Z.prototype,`instructions`,void 0),c([t({attribute:`aria-label`})],Z.prototype,`ariaLabel`,void 0),c([t({attribute:`loop-focus`,type:Boolean})],Z.prototype,`loopFocus`,void 0),c([t({attribute:!1})],Z.prototype,`filter`,void 0),c([t({type:Boolean,reflect:!0})],Z.prototype,`async`,void 0),c([t({attribute:`loading-message`})],Z.prototype,`loadingMessage`,void 0),c([t({attribute:`start-typing-message`})],Z.prototype,`startTypingMessage`,void 0),c([t({attribute:!1})],Z.prototype,`fetchOptions`,void 0),c([a(`pk-popup`)],Z.prototype,`popupElement`,void 0),c([a(`.control`)],Z.prototype,`controlElement`,void 0),c([a(`.control-input`)],Z.prototype,`controlInput`,void 0),c([a(`.popup-trigger`)],Z.prototype,`popupTrigger`,void 0),c([a(`.create-option`)],Z.prototype,`createOptionElement`,void 0),c([a(`.value-input`)],Z.prototype,`input`,void 0),c([p()],Z.prototype,`inputValue`,void 0),c([p()],Z.prototype,`highlightedIndex`,void 0),c([p()],Z.prototype,`createOptionHighlighted`,void 0),c([p()],Z.prototype,`closing`,void 0),c([p()],Z.prototype,`panelAnimated`,void 0),c([p()],Z.prototype,`asyncLoading`,void 0),c([p()],Z.prototype,`asyncError`,void 0),Z=c([d(`pk-combobox`)],Z),v(),ue({"arrow-down":le,"arrow-up":se,ellipsis:fe,"grip-move":pe,"pen-to-square":ne,plus:me,xmark:ie});var mn=`__vizy_new__`;function Q(e,t={}){return window.Craft?.t(`vizy`,e,t)??e}var hn=class extends n{createRenderRoot(){return this}#e={groups:[],blockTypes:{},availableBlockTypes:[]};#t=`blockTypePickerGroups`;connectedCallback(){super.connectedCallback(),this.#t=this.getAttribute(`data-picker-groups-name`)??this.#t;let e=this.getAttribute(`data-initial`);e&&(this.#e=JSON.parse(e))}disconnectedCallback(){super.disconnectedCallback(),this.#d?.destroy(),this.#d=null}firstUpdated(){this.#f()}updated(){this.#d?.isDragging()||this.#d?.refresh()}#n(e){return this.#e.groups.find(t=>t.id===e)}#r(){this.requestUpdate()}addGroup(){let e=window.prompt(Q(`Group name`),``);if(e===null)return;let t=crypto.randomUUID();this.#e.groups.push({id:t,name:Q(`Blocks`),blockTypeUids:[],disabledBlockTypeUids:[]}),this.renameGroup(t,e)}deleteGroup(e){let t=this.#n(e);t&&(t.blockTypeUids.length>0&&!confirm(Q(`Remove the “{name}” group? Its block types will no longer be available in this field, but the global block types are not deleted.`,{name:t.name}))||(this.#e.groups=this.#e.groups.filter(t=>t.id!==e),this.#r()))}renameGroup(e,t){let n=this.#n(e);n&&(n.name=t.trim()===``?Q(`Blocks`):t.trim(),this.#r())}moveGroup(e,t){let n=this.#e.groups.findIndex(t=>t.id===e),r=n+t;if(n===-1||r<0||r>=this.#e.groups.length)return;let[i]=this.#e.groups.splice(n,1);this.#e.groups.splice(r,0,i),this.#r()}addExistingBlock(e,t){let n=this.#n(e);if(!n||this.#s().has(t))return;let r=this.#e.availableBlockTypes.find(e=>e.uid===t)??this.#e.blockTypes[t];r&&(this.#e.blockTypes[t]={...r},n.blockTypeUids.includes(t)||n.blockTypeUids.push(t),this.#r())}removeBlock(e){let t=this.#e.groups.find(t=>t.blockTypeUids.includes(e));t&&(t.blockTypeUids=t.blockTypeUids.filter(t=>t!==e),t.disabledBlockTypeUids=t.disabledBlockTypeUids.filter(t=>t!==e),this.#r())}setBlockAvailability(e,t){let n=this.#e.groups.find(t=>t.blockTypeUids.includes(e));if(!n)return;let r=new Set(n.disabledBlockTypeUids);t?r.delete(e):r.add(e),n.disabledBlockTypeUids=[...r],this.#r()}nudgeBlock(e,t){let n=this.#e.groups.find(t=>t.blockTypeUids.includes(e));if(!n)return;let r=n.blockTypeUids.indexOf(e),i=r+t;if(i<0||i>=n.blockTypeUids.length)return;let[a]=n.blockTypeUids.splice(r,1);n.blockTypeUids.splice(i,0,a),this.#r()}moveBlock(e,t,n){let r=this.#e.groups.find(t=>t.blockTypeUids.includes(e)),i=this.#n(t);if(!r||!i)return;let a=r.blockTypeUids.indexOf(e);r.blockTypeUids.splice(a,1);let o=n;r===i&&a<n&&--o,i.blockTypeUids.splice(Math.max(0,Math.min(o,i.blockTypeUids.length)),0,e),r!==i&&r.disabledBlockTypeUids.includes(e)&&(r.disabledBlockTypeUids=r.disabledBlockTypeUids.filter(t=>t!==e),i.disabledBlockTypeUids.push(e)),this.#r()}#i(e,t,n){let r=window.Craft;if(!r?.CpScreenSlideout)return;let i={};e?i.uid=e:n&&(i.name=n);let a=e?null:t;new r.CpScreenSlideout(`vizy/block-types/edit`,{params:i}).on(`submit`,e=>{let t=this.#o(e);t?.uid&&(this.#a(t),a?this.addExistingBlock(a,t.uid):this.#r())})}#a(e){this.#e.blockTypes[e.uid]=e;let t=this.#e.availableBlockTypes.findIndex(t=>t.uid===e.uid);t===-1?this.#e.availableBlockTypes.push(e):this.#e.availableBlockTypes[t]=e}#o(e){let t=[e.data,e.response?.data?.blockType,e.data?.blockType];for(let e of t){if(!e||typeof e!=`object`)continue;let t=e,n=t.uid;if(typeof n==`string`&&n!==``)return{uid:n,name:typeof t.name==`string`?t.name:n,handle:typeof t.handle==`string`?t.handle:``,icon:typeof t.icon==`string`?t.icon:null,iconSvg:typeof t.iconSvg==`string`?t.iconSvg:null,color:typeof t.color==`string`?t.color:null,template:typeof t.template==`string`?t.template:null,missing:t.missing===!0||void 0}}}#s(){return new Set(this.#e.groups.flatMap(e=>e.blockTypeUids))}#c(){let e=this.#s();return this.#e.availableBlockTypes.filter(t=>!e.has(t.uid))}#l(e){return this.#e.groups.some(t=>t.disabledBlockTypeUids.includes(e))}#u=0;#d=null;applySortResult(e,t,n){this.#u+=1,this.moveBlock(e,t,n)}#f(){let e=this.querySelector(`.vizy-configurator`);e&&(this.#d=new ln({container:e,groupLists:()=>[...this.querySelectorAll(`[data-group-list]`)],rowSelector:`[data-block-row]`,handleSelector:`[data-drag-handle]`,emptyGroupLabel:Q(`No block types yet.`),onReorder:(e,t,n)=>this.applySortResult(e,t,n)}),this.#d.refresh())}#p(e,t,n){let i=this.#e.blockTypes[t],a=i?.name??t,o=this.#l(t),s=i?.missing===!0,c=[`vizy-block-row`,o?`is-disabled`:``,s?`is-missing`:``,i?.color?`has-color`:``].filter(Boolean).join(` `),u=i?.color?`--vizy-block-accent-color: ${i.color}`:``;return r`
            <li
                class=${c}
                data-block-row=${t}
                style=${u}
            >
                <pk-lightswitch
                    class="vizy-block-row-switch"
                    size="sm"
                    ?checked=${!o}
                    label=${Q(`Available in this field`)}
                    @pk-change=${e=>{let n=e.target;this.setBlockAvailability(t,n.checked)}}
                ></pk-lightswitch>

                <button
                    type="button"
                    class="vizy-block-row-main"
                    aria-label=${Q(`Edit block type`)}
                    @click=${()=>this.#i(t,null)}
                >
                    ${i?.iconSvg?r`<span class="vizy-block-row-icon" .innerHTML=${i.iconSvg}></span>`:r`<span class="vizy-block-row-icon"><pk-icon icon=${ee} label=""></pk-icon></span>`}

                    <span class="vizy-block-row-text">
                        <span class="vizy-block-row-name">${a}</span>
                        <span class="vizy-block-row-meta code">${i?.handle??``}</span>
                    </span>

                    ${s?r`<span class="vizy-block-row-warning">${Q(`Missing`)}</span>`:l}
                </button>

                <span class="vizy-block-row-grip" data-drag-handle>
                    <pk-icon icon="grip-move" label=${Q(`Drag to reorder`)}></pk-icon>
                </span>

                <pk-dropdown-menu
                    size="sm"
                    @pk-select=${e=>{this.#m(t,e.detail?.value)}}
                >
                    <pk-button
                        slot="trigger"
                        type="button"
                        variant="transparent"
                        size="sm"
                    >
                        <pk-icon slot="start" icon="ellipsis" label=${Q(`Block type actions`)}></pk-icon>
                    </pk-button>

                    <pk-dropdown-item value="edit">
                        <pk-icon slot="start" icon="pen-to-square"></pk-icon>
                        ${Q(`Edit`)}
                    </pk-dropdown-item>
                    <pk-dropdown-separator></pk-dropdown-separator>
                    <pk-dropdown-item value="move-up" ?disabled=${n===0}>
                        <pk-icon slot="start" icon="arrow-up"></pk-icon>
                        ${Q(`Move up`)}
                    </pk-dropdown-item>
                    <pk-dropdown-item value="move-down" ?disabled=${n===e.blockTypeUids.length-1}>
                        <pk-icon slot="start" icon="arrow-down"></pk-icon>
                        ${Q(`Move down`)}
                    </pk-dropdown-item>
                    <pk-dropdown-separator></pk-dropdown-separator>
                    <pk-dropdown-item value="delete" destructive>
                        <pk-icon slot="start" icon="xmark"></pk-icon>
                        ${Q(`Delete`)}
                    </pk-dropdown-item>
                </pk-dropdown-menu>
            </li>
        `}#m(e,t){t===`edit`&&this.#i(e,null),t===`move-up`&&this.nudgeBlock(e,-1),t===`move-down`&&this.nudgeBlock(e,1),t===`delete`&&this.removeBlock(e)}#h(e,t){let n=t===0,i=t===this.#e.groups.length-1;return r`
            <section class="vizy-block-group">
                <header class="vizy-block-group-header">
                    <h3 class="vizy-block-group-name">${e.name}</h3>

                    <pk-dropdown-menu
                        size="sm"
                        @pk-select=${t=>{this.#g(e.id,t.detail?.value)}}
                    >
                        <pk-button
                            slot="trigger"
                            type="button"
                            variant="transparent"
                            size="sm"
                        >
                            <pk-icon slot="start" icon="ellipsis" label=${Q(`Group actions`)}></pk-icon>
                        </pk-button>

                        <pk-dropdown-item value="rename">
                            <pk-icon slot="start" icon="pen-to-square"></pk-icon>
                            ${Q(`Rename`)}
                        </pk-dropdown-item>
                        <pk-dropdown-separator></pk-dropdown-separator>
                        <pk-dropdown-item value="move-up" ?disabled=${n}>
                            <pk-icon slot="start" icon="arrow-up"></pk-icon>
                            ${Q(`Move up`)}
                        </pk-dropdown-item>
                        <pk-dropdown-item value="move-down" ?disabled=${i}>
                            <pk-icon slot="start" icon="arrow-down"></pk-icon>
                            ${Q(`Move down`)}
                        </pk-dropdown-item>
                        <pk-dropdown-separator></pk-dropdown-separator>
                        <pk-dropdown-item value="delete" destructive>
                            <pk-icon slot="start" icon="xmark"></pk-icon>
                            ${Q(`Delete`)}
                        </pk-dropdown-item>
                    </pk-dropdown-menu>
                </header>

                ${it(`${e.id}:${this.#u}`,r`
                    <ul class="vizy-block-rows" data-group-list=${e.id}>
                        ${O(e.blockTypeUids,e=>e,(t,n)=>this.#p(e,t,n))}

                        ${e.blockTypeUids.length===0?r`
                                <li
                                    class="vizy-block-group-dropzone"
                                    data-empty-placeholder=${e.id}
                                >
                                    <span class="vizy-block-group-dropzone-label">
                                        ${Q(`No block types yet.`)}
                                    </span>
                                    <span data-no-drag hidden></span>
                                </li>
                            `:l}
                    </ul>
                `)}

                <div class="vizy-block-group-footer">
                    ${this.#v(e)}
                </div>
            </section>
        `}#g(e,t){t===`rename`&&this.#_(e),t===`move-up`&&this.moveGroup(e,-1),t===`move-down`&&this.moveGroup(e,1),t===`delete`&&this.deleteGroup(e)}#_(e){let t=this.#n(e);if(!t)return;let n=window.prompt(Q(`Group name`),t.name);n!==null&&this.renameGroup(e,n)}#v(e){let t=this.#c();return r`
            <pk-combobox
                class="vizy-block-picker"
                popup-mode
                allow-create
                search-placeholder=${Q(`Search block types…`)}
                placeholder=${Q(`Add a block type`)}
                empty-message=${Q(`No other block types available.`)}
                .value=${``}
                @pk-change=${t=>{let n=t.target,r=n.value;r!==``&&(n.value=``,r===mn?this.#i(null,e.id):this.addExistingBlock(e.id,r))}}
                @pk-create=${t=>{t.preventDefault();let n=t.inputValue??``;t.target.value=``,this.#i(null,e.id,n.trim()||void 0)}}
            >
                <pk-option value=${mn} label=${Q(`New block type`)}>
                    ${Q(`+ New block type`)}
                </pk-option>

                ${O(t,e=>e.uid,e=>r`
                        <pk-option value=${e.uid} label=${e.name}>
                            ${e.name}
                        </pk-option>
                    `)}
            </pk-combobox>
        `}render(){return r`
            <div class="vizy-configurator">
                ${O(this.#e.groups,e=>e.id,(e,t)=>this.#h(e,t))}

                <pk-button
                    type="button"
                    variant="dashed"
                    class="vizy-add-group"
                    @click=${()=>this.addGroup()}
                >
                    <pk-icon slot="start" icon="plus"></pk-icon>
                    ${Q(`Add Group`)}
                </pk-button>
            </div>

            ${this.#y()}
        `}#y(){let e=this.#t;return r`
            <div class="vizy-picker-sync" hidden>
                ${this.#e.groups.map((t,n)=>r`
                    <input type="hidden" name="${e}[${n}][name]" .value=${t.name}>
                    ${t.blockTypeUids.map(t=>r`
                        <input type="hidden" name="${e}[${n}][blockTypeUids][]" value=${t}>
                    `)}
                    ${t.disabledBlockTypeUids.map(t=>r`
                        <input type="hidden" name="${e}[${n}][disabledBlockTypeUids][]" value=${t}>
                    `)}
                `)}
            </div>
        `}};customElements.get(`vizy-field-settings`)||customElements.define(`vizy-field-settings`,hn);function gn(e,t){let n=window.Craft;n?.CpScreenSlideout&&new n.CpScreenSlideout(`vizy/editor-configs/edit`,{params:t?{id:t}:{id:`new`}}).on(`submit`,t=>{let n=t.response?.data?.editorConfig??t.data;if(!n?.id)return;let r=Array.from(e.options).find(e=>e.value===n.id);if(r)r.textContent=n.label;else{let t=document.createElement(`option`);t.value=n.id,t.textContent=n.label,e.append(t)}e.value=n.id,e.dispatchEvent(new Event(`change`,{bubbles:!0}))})}function $(e){e.querySelectorAll(`[data-vizy-new-editor-config]`).forEach(e=>{e.dataset.vizyBound||(e.dataset.vizyBound=`1`,e.addEventListener(`click`,()=>{let t=e.closest(`.flex`)?.querySelector(`select`);t&&gn(t,null)}))}),e.querySelectorAll(`[data-vizy-edit-editor-config]`).forEach(e=>{e.dataset.vizyBound||(e.dataset.vizyBound=`1`,e.addEventListener(`click`,()=>{let t=e.closest(`.flex`)?.querySelector(`select`);t&&t.value!==``&&gn(t,t.value)}))})}document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,()=>$(document)):$(document),new MutationObserver(e=>{for(let t of e)for(let e of t.addedNodes)e instanceof HTMLElement&&e.querySelector(`[data-vizy-new-editor-config]`)&&$(e)}).observe(document.body,{childList:!0,subtree:!0}),v();
//# sourceMappingURL=field-settings-DI6e6-4F.js.map