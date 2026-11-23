import{E as e,O as t,T as n,_ as r,d as i,f as a,h as o,n as s,p as c,u as l,y as u}from"./class-map-BJSU2ntM.js";var d=class extends i{constructor(...e){super(...e),this.icon=``,this.name=``,this.unsubscribeRegistry=null}static{this.styles=u`
        :host {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex: none;
            /* Square em box + slight baseline nudge for inline text. Flex
             * parents (e.g. button slots) should zero vertical-align. */
            width: 1em;
            height: 1em;
            line-height: 1;
            vertical-align: -0.125em;
        }

        svg {
            display: block;
            width: 100%;
            height: 100%;
            fill: currentColor;
            /* Allow intentional path overhang past the icon canvas. */
            overflow: visible;
        }
    `}connectedCallback(){super.connectedCallback(),this.unsubscribeRegistry=t(()=>{this.requestUpdate()})}disconnectedCallback(){this.unsubscribeRegistry?.(),this.unsubscribeRegistry=null,super.disconnectedCallback()}render(){let t=e(this.icon||this.name);return t?r`${s(n(t,{title:this.label}))}`:o}};a([l()],d.prototype,`icon`,void 0),a([l()],d.prototype,`name`,void 0),a([l()],d.prototype,`label`,void 0),d=a([c(`pk-icon`)],d);
//# sourceMappingURL=pk-icon-UyRZEEaP.js.map