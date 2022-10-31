import { openBlock as c, createElementBlock as n, createElementVNode as _, renderSlot as l, createTextVNode as a, toDisplayString as u, Fragment as g, renderList as v, normalizeStyle as m, createBlock as h, withCtx as i, createVNode as p } from "vue";
const y = {
  class: "card-item",
  role: "listitem"
}, f = ["href"], $ = { class: "img-wrapper" }, k = /* @__PURE__ */ a("image slot"), b = { class: "info-wrapper" }, x = { class: "title" }, S = /* @__PURE__ */ a("title slot"), w = /* @__PURE__ */ a("under title slot"), B = { class: "price-wrapper" }, I = /* @__PURE__ */ a("price slot"), N = {
  __name: "card",
  props: {
    link: String
  },
  setup(e) {
    const t = e;
    return (s, r) => (c(), n("div", y, [
      _("a", {
        href: t.link,
        target: "_blank",
        class: "item-link"
      }, [
        _("div", $, [
          l(s.$slots, "image", {}, () => [
            k
          ])
        ]),
        _("div", b, [
          _("div", x, [
            l(s.$slots, "title", {}, () => [
              S
            ])
          ]),
          _("div", null, [
            l(s.$slots, "under-title", {}, () => [
              w
            ])
          ])
        ]),
        _("div", B, [
          l(s.$slots, "price", {}, () => [
            I
          ])
        ])
      ], 8, f)
    ]));
  }
};
const d = (e, t) => {
  const s = e.__vccOpts || e;
  for (const [r, o] of t)
    s[r] = o;
  return s;
}, T = { class: "img-container" }, V = ["src"], C = {
  __name: "rect-pic",
  props: {
    value: String
  },
  setup(e) {
    const t = e;
    return (s, r) => (c(), n("div", T, [
      _("img", {
        src: t.value
      }, null, 8, V)
    ]));
  }
}, E = /* @__PURE__ */ d(C, [["__scopeId", "data-v-88e43097"]]);
const O = {
  __name: "title",
  props: {
    msg: String
  },
  setup(e) {
    const t = e;
    return (s, r) => (c(), n("p", null, u(t.msg), 1));
  }
}, P = /* @__PURE__ */ d(O, [["__scopeId", "data-v-c657ab2c"]]);
const j = { class: "tag-list" }, z = {
  __name: "tags",
  props: {
    tags: {
      type: Array,
      default: () => []
    }
  },
  setup(e) {
    const t = e;
    return (s, r) => (c(), n("div", j, [
      (c(!0), n(g, null, v(t.tags, (o) => (c(), n("div", {
        class: "tag-item",
        key: o,
        style: m({ color: o.font_color, borderColor: o.border_color, background: o.bg_color })
      }, u(o.text), 5))), 128))
    ]));
  }
}, A = /* @__PURE__ */ d(z, [["__scopeId", "data-v-8b89c5a6"]]);
const D = { class: "price-value" }, F = /* @__PURE__ */ _("em", null, "\xA5", -1), L = {
  __name: "price",
  props: {
    value: String
  },
  setup(e) {
    const t = e;
    return (s, r) => (c(), n("span", D, [
      F,
      a(u(t.value), 1)
    ]));
  }
}, R = {
  data: (e) => (console.log("data === ", e.$attrs), e.$attrs)
}, G = /* @__PURE__ */ Object.assign(R, {
  setup(e) {
    return (t, s) => (c(), h(N, { link: t.click_url }, {
      image: i(() => [
        p(E, { value: t.pict_url }, null, 8, ["value"])
      ]),
      title: i(() => [
        p(P, { msg: t.title }, null, 8, ["msg"])
      ]),
      "under-title": i(() => [
        p(A, { tags: t.icons }, null, 8, ["tags"])
      ]),
      price: i(() => [
        p(L, { value: t.real_wap_price }, null, 8, ["value"])
      ]),
      _: 1
    }, 8, ["link"]));
  }
});
export {
  G as default
};
