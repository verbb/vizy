import{D as e,E as t,b as n,d as r,f as i,g as a,k as o,n as s,p as c,u as l,v as u}from"./class-map-DgBgrTyk.js";var d=class extends r{constructor(...e){super(...e),this.icon=``,this.name=``,this.unsubscribeRegistry=null}static{this.styles=n`
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
    `}connectedCallback(){super.connectedCallback(),this.unsubscribeRegistry=o(()=>{this.requestUpdate()})}disconnectedCallback(){this.unsubscribeRegistry?.(),this.unsubscribeRegistry=null,super.disconnectedCallback()}render(){let n=e(this.icon||this.name);return n?u`${s(t(n,{title:this.label}))}`:a}};i([l()],d.prototype,`icon`,void 0),i([l()],d.prototype,`name`,void 0),i([l()],d.prototype,`label`,void 0),d=i([c(`pk-icon`)],d);
//# sourceMappingURL=pk-icon-CnHAmJjz.js.map