define(["vue"],function(t){"use strict";var $="",c=(e,s)=>{const r=e.__vccOpts||e;for(const[n,o]of s)r[n]=o;return r};const a={},_={class:"card-item",role:"listitem"},l={href:"javascript:void(0);",target:"_blank",class:"item-link"},i={class:"img-wrapper"},d=t.createTextVNode("image slot"),p={class:"info-wrapper"},m={class:"title"},g=t.createTextVNode("title slot"),h=t.createTextVNode("under title slot"),k={class:"price-wrapper"},f=t.createTextVNode("price slot");function y(e,s){return t.openBlock(),t.createElementBlock("div",_,[t.createElementVNode("a",l,[t.createElementVNode("div",i,[t.renderSlot(e.$slots,"image",{},()=>[d])]),t.createElementVNode("div",p,[t.createElementVNode("div",m,[t.renderSlot(e.$slots,"title",{},()=>[g])]),t.createElementVNode("div",null,[t.renderSlot(e.$slots,"under-title",{},()=>[h])])]),t.createElementVNode("div",k,[t.renderSlot(e.$slots,"price",{},()=>[f])])])])}var B=c(a,[["render",y]]),b="",N=c({__name:"title",props:{msg:String},setup(e){const s=e;return(r,n)=>(t.openBlock(),t.createElementBlock("p",null,t.toDisplayString(s.msg),1))}},[["__scopeId","data-v-c9d794a6"]]),T="";const V={class:"tag-list"};var E=c({__name:"tags",props:{tags:{type:Array,default:()=>[]}},setup(e){const s=e;return(r,n)=>(t.openBlock(),t.createElementBlock("div",V,[(t.openBlock(!0),t.createElementBlock(t.Fragment,null,t.renderList(s.tags,o=>(t.openBlock(),t.createElementBlock("div",{class:"tag-item",key:o},t.toDisplayString(o),1))),128))]))}},[["__scopeId","data-v-2d1bbb86"]]),x={setup(e){return(s,r)=>(t.openBlock(),t.createBlock(B,null,{title:t.withCtx(()=>[t.createVNode(N,{msg:"\u7F6E\u7269\u67B6\u4E0D\u9508\u94A2\u8272\u50A8\u7269\u67B6\u53A8\u623F\u4E94\u5C42\u843D\u5730\u53EF\u8C03\u8282\u6536\u7EB3\u67B6\u8D27\u67B6\u9633\u53F0\u591A\u5C42\u67B6\u5B50"})]),"under-title":t.withCtx(()=>[t.createVNode(E,{tags:["123","321"]})]),_:1}))}};return x});