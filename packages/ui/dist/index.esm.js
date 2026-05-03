import { useState as l, useEffect as u, useRef as i, useCallback as d } from "react";
const f = typeof window < "u";
function E(t) {
  const [r, n] = l(() => f ? window.matchMedia(t).matches : !1);
  return u(() => {
    if (!f) return;
    const e = window.matchMedia(t);
    n(e.matches);
    const s = (o) => n(o.matches);
    return e.addEventListener("change", s), () => e.removeEventListener("change", s);
  }, [t]), r;
}
function L(t) {
  const r = i(null), [n, e] = l(null);
  return u(() => {
    if (!r.current) return;
    const s = new IntersectionObserver(([o]) => e(o ?? null), t);
    return s.observe(r.current), () => s.disconnect();
  }, [t]), { ref: r, isVisible: (n == null ? void 0 : n.isIntersecting) ?? !1, entry: n };
}
function y() {
  const t = i(null), [r, n] = l({ width: 0, height: 0 });
  return u(() => {
    if (!t.current) return;
    const e = new ResizeObserver(([s]) => {
      s && n({ width: s.contentRect.width, height: s.contentRect.height });
    });
    return e.observe(t.current), () => e.disconnect();
  }, []), { ref: t, ...r };
}
const m = typeof window < "u";
function x(t, r, n = m ? window : null) {
  const e = i(r);
  e.current = r, u(() => {
    if (!n) return;
    const s = (o) => e.current(o);
    return n.addEventListener(t, s), () => n.removeEventListener(t, s);
  }, [t, n]);
}
function g(t) {
  const r = i(null), n = i(t);
  return n.current = t, u(() => {
    const e = (s) => {
      !r.current || r.current.contains(s.target) || n.current(s);
    };
    return document.addEventListener("mousedown", e), document.addEventListener("touchstart", e), () => {
      document.removeEventListener("mousedown", e), document.removeEventListener("touchstart", e);
    };
  }, []), r;
}
function b(t) {
  const [r, n] = l(!1);
  return u(() => {
    const e = (o) => {
      o.key === t && n(!0);
    }, s = (o) => {
      o.key === t && n(!1);
    };
    return window.addEventListener("keydown", e), window.addEventListener("keyup", s), () => {
      window.removeEventListener("keydown", e), window.removeEventListener("keyup", s);
    };
  }, [t]), r;
}
function k(t, r) {
  const n = i(r);
  n.current = r, u(() => {
    const e = t.toLowerCase().split("+").map((c) => c.trim()), s = e.find((c) => !["ctrl", "shift", "alt", "meta"].includes(c)) ?? "", o = (c) => {
      const a = e.includes("ctrl") ? c.ctrlKey || c.metaKey : !0, w = e.includes("shift") ? c.shiftKey : !0, v = e.includes("alt") ? c.altKey : !0;
      c.key.toLowerCase() === s && a && w && v && (c.preventDefault(), n.current());
    };
    return window.addEventListener("keydown", o), () => window.removeEventListener("keydown", o);
  }, [t]);
}
function R() {
  const [t, r] = l({ x: 0, y: 0 });
  return u(() => {
    const n = () => r({ x: window.scrollX, y: window.scrollY });
    return window.addEventListener("scroll", n, { passive: !0 }), () => window.removeEventListener("scroll", n);
  }, []), t;
}
function S() {
  const [t, r] = l(0);
  return u(() => {
    const n = () => {
      const { scrollTop: e, scrollHeight: s, clientHeight: o } = document.documentElement;
      r(s - o > 0 ? e / (s - o) * 100 : 0);
    };
    return window.addEventListener("scroll", n, { passive: !0 }), () => window.removeEventListener("scroll", n);
  }, []), t;
}
function M() {
  const [t, r] = l("");
  return u(() => {
    const n = () => {
      var e;
      return r(((e = window.getSelection()) == null ? void 0 : e.toString()) ?? "");
    };
    return document.addEventListener("selectionchange", n), () => document.removeEventListener("selectionchange", n);
  }, []), t;
}
function O(t, r) {
  const n = i(null), e = i(t);
  return e.current = t, u(() => {
    if (!n.current) return;
    const s = new MutationObserver((...o) => e.current(...o));
    return s.observe(n.current, r), () => s.disconnect();
  }, [r]), n;
}
function P(t = 0.5) {
  const r = i(null), [n, e] = l(0);
  return u(() => {
    const s = () => {
      if (!r.current) return;
      const o = r.current.getBoundingClientRect();
      e((window.scrollY - o.top) * t);
    };
    return window.addEventListener("scroll", s, { passive: !0 }), () => window.removeEventListener("scroll", s);
  }, [t]), { ref: r, offsetY: n };
}
function C(t, r = 500) {
  const n = i(), e = i(t);
  e.current = t;
  const s = d(() => {
    n.current = setTimeout(() => e.current(), r);
  }, [r]), o = d(() => clearTimeout(n.current), []);
  return { onMouseDown: s, onMouseUp: o, onTouchStart: s, onTouchEnd: o };
}
function T() {
  const [t, r] = l({ x: 0, y: 0, pressure: 0, pointerType: "" });
  return u(() => {
    const n = (e) => r({ x: e.clientX, y: e.clientY, pressure: e.pressure, pointerType: e.pointerType });
    return window.addEventListener("pointermove", n), () => window.removeEventListener("pointermove", n);
  }, []), t;
}
const h = typeof window < "u";
function F() {
  const [t, r] = l(!1), n = h && !!document.documentElement.requestFullscreen;
  u(() => {
    const o = () => r(!!document.fullscreenElement);
    return document.addEventListener("fullscreenchange", o), () => document.removeEventListener("fullscreenchange", o);
  }, []);
  const e = d(async (o) => {
    await (o ?? document.documentElement).requestFullscreen();
  }, []), s = d(async () => {
    document.fullscreenElement && await document.exitFullscreen();
  }, []);
  return { isFullscreen: t, request: e, exit: s, supported: n };
}
function I() {
  const t = i(null), [r, n] = l(!1);
  return u(() => {
    if (!t.current) return;
    const e = new IntersectionObserver(
      ([s]) => n(((s == null ? void 0 : s.intersectionRatio) ?? 1) < 1),
      { threshold: [1], rootMargin: "-1px 0px 0px 0px" }
    );
    return e.observe(t.current), () => e.disconnect();
  }, []), { ref: t, isSticky: r };
}
function Y() {
  const [t, r] = l({ show: !1, x: 0, y: 0 }), n = i(null);
  return u(() => {
    const e = n.current;
    if (!e) return;
    const s = (c) => {
      c.preventDefault(), r({ show: !0, x: c.clientX, y: c.clientY });
    }, o = () => r((c) => ({ ...c, show: !1 }));
    return e.addEventListener("contextmenu", s), document.addEventListener("click", o), () => {
      e.removeEventListener("contextmenu", s), document.removeEventListener("click", o);
    };
  }, []), { ...t, ref: n, close: () => r((e) => ({ ...e, show: !1 })) };
}
export {
  Y as useContextMenu,
  x as useEventListener,
  F as useFullscreen,
  k as useHotkey,
  L as useIntersectionObserver,
  b as useKeyPress,
  C as useLongPress,
  E as useMediaQuery,
  O as useMutationObserver,
  g as useOnClickOutside,
  P as useParallax,
  T as usePointer,
  y as useResizeObserver,
  R as useScrollPosition,
  S as useScrollProgress,
  I as useSticky,
  M as useTextSelection
};
