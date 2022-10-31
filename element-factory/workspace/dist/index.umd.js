(function(e,r){typeof exports=="object"&&typeof module<"u"?module.exports=r(require("vue")):typeof define=="function"&&define.amd?define(["vue"],r):(e=typeof globalThis<"u"?globalThis:e||self,e.MyLib=r(e.Vue))})(this,function(e){"use strict";const r="",_={class:"card-item",role:"listitem"},a=["href"],i={class:"img-wrapper"},d=e.createTextVNode("image slot"),p={class:"info-wrapper"},m={class:"title"},g=e.createTextVNode("title slot"),h=e.createTextVNode("under title slot"),f={class:"price-wrapper"},u=e.createTextVNode("price slot"),k={__name:"card",props:{link:String},setup(o){const t=o;return(s,n)=>(e.openBlock(),e.createElementBlock("div",_,[e.createElementVNode("a",{href:t.link,target:"_blank",class:"item-link"},[e.createElementVNode("div",i,[e.renderSlot(s.$slots,"image",{},()=>[d])]),e.createElementVNode("div",p,[e.createElementVNode("div",m,[e.renderSlot(s.$slots,"title",{},()=>[g])]),e.createElementVNode("div",null,[e.renderSlot(s.$slots,"under-title",{},()=>[h])])]),e.createElementVNode("div",f,[e.renderSlot(s.$slots,"price",{},()=>[u])])],8,a)]))}},T="",l=(o,t)=>{const s=o.__vccOpts||o;for(const[n,c]of t)s[n]=c;return s},y={class:"img-container"},V=["src"],$=l({__name:"rect-pic",props:{value:String},setup(o){const t=o;return(s,n)=>(e.openBlock(),e.createElementBlock("div",y,[e.createElementVNode("img",{src:t.value},null,8,V)]))}},[["__scopeId","data-v-88e43097"]]),C="",N=l({__name:"title",props:{msg:String},setup(o){const t=o;return(s,n)=>(e.openBlock(),e.createElementBlock("p",null,e.toDisplayString(t.msg),1))}},[["__scopeId","data-v-c657ab2c"]]),I="",B={class:"tag-list"},x=l({__name:"tags",props:{tags:{type:Array,default:()=>[]}},setup(o){const t=o;return(s,n)=>(e.openBlock(),e.createElementBlock("div",B,[(e.openBlock(!0),e.createElementBlock(e.Fragment,null,e.renderList(t.tags,c=>(e.openBlock(),e.createElementBlock("div",{class:"tag-item",key:c,style:e.normalizeStyle({color:c.font_color,borderColor:c.border_color,background:c.bg_color})},e.toDisplayString(c.text),5))),128))]))}},[["__scopeId","data-v-8b89c5a6"]]),L="",E={class:"price-value"},S=e.createElementVNode("em",null,"\xA5",-1),b={__name:"price",props:{value:String},setup(o){const t=o;return(s,n)=>(e.openBlock(),e.createElementBlock("span",E,[S,e.createTextVNode(e.toDisplayString(t.value),1)]))}};return Object.assign({data:o=>(console.log("data === ",o.$attrs),o.$attrs)},{setup(o){return(t,s)=>(e.openBlock(),e.createBlock(k,{link:t.click_url},{image:e.withCtx(()=>[e.createVNode($,{value:t.pict_url},null,8,["value"])]),title:e.withCtx(()=>[e.createVNode(N,{msg:t.title},null,8,["msg"])]),"under-title":e.withCtx(()=>[e.createVNode(x,{tags:t.icons},null,8,["tags"])]),price:e.withCtx(()=>[e.createVNode(b,{value:t.real_wap_price},null,8,["value"])]),_:1},8,["link"]))}})});