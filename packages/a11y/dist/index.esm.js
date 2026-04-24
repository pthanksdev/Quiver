import { useRef as f, useEffect as a, useCallback as l, useState as d } from "react";
function b(t = !0) {
  const n = f(null);
  return a(() => {
    var o;
    if (!t || !n.current) return;
    const e = n.current, r = () => Array.from(e.querySelectorAll(
      'button,a[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
    )).filter((i) => !i.hasAttribute("disabled")), s = (i) => {
      if (i.key !== "Tab") return;
      const u = r();
      if (!u.length) {
        i.preventDefault();
        return;
      }
      const c = u[0], m = u[u.length - 1];
      i.shiftKey ? document.activeElement === c && (m.focus(), i.preventDefault()) : document.activeElement === m && (c.focus(), i.preventDefault());
    };
    return e.addEventListener("keydown", s), (o = r()[0]) == null || o.focus(), () => e.removeEventListener("keydown", s);
  }, [t]), n;
}
const v = typeof window < "u";
function y() {
  const t = f(null);
  return a(() => {
    if (!v) return;
    const e = document.createElement("div");
    return e.setAttribute("aria-live", "polite"), e.setAttribute("aria-atomic", "true"), Object.assign(e.style, { position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }), document.body.appendChild(e), t.current = e, () => {
      document.body.removeChild(e);
    };
  }, []), { announce: l((e, r = "polite") => {
    t.current && (t.current.setAttribute("aria-live", r), t.current.textContent = "", requestAnimationFrame(() => {
      t.current && (t.current.textContent = e);
    }));
  }, []) };
}
const p = typeof window < "u";
function A() {
  const [t, n] = d(
    () => p ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : !1
  );
  return a(() => {
    if (!p) return;
    const e = window.matchMedia("(prefers-reduced-motion: reduce)"), r = (s) => n(s.matches);
    return e.addEventListener("change", r), () => e.removeEventListener("change", r);
  }, []), t;
}
const w = typeof window < "u";
function x() {
  const [t, n] = d(
    () => w ? window.matchMedia("(forced-colors: active)").matches : !1
  );
  return a(() => {
    if (!w) return;
    const e = window.matchMedia("(forced-colors: active)"), r = (s) => n(s.matches);
    return e.addEventListener("change", r), () => e.removeEventListener("change", r);
  }, []), t;
}
function E(t) {
  const [n, e] = d(0), r = l((s) => ({
    tabIndex: s === n ? 0 : -1,
    onKeyDown: (o) => {
      (o.key === "ArrowRight" || o.key === "ArrowDown") && (o.preventDefault(), e((i) => (i + 1) % t)), (o.key === "ArrowLeft" || o.key === "ArrowUp") && (o.preventDefault(), e((i) => (i - 1 + t) % t)), o.key === "Home" && (o.preventDefault(), e(0)), o.key === "End" && (o.preventDefault(), e(t - 1));
    }
  }), [n, t]);
  return { activeIndex: n, getItemProps: r };
}
function g() {
  const [t, n] = d(!1), e = f(!1);
  return a(() => {
    const s = () => {
      e.current = !0;
    }, o = () => {
      e.current = !1;
    };
    return window.addEventListener("keydown", s), window.addEventListener("mousedown", o), () => {
      window.removeEventListener("keydown", s), window.removeEventListener("mousedown", o);
    };
  }, []), { focusVisible: t, props: { onFocus: () => n(e.current), onBlur: () => n(!1) } };
}
function k(t, n) {
  const e = (i) => {
    const u = i.replace("#", "").match(/.{2}/g).map((c) => parseInt(c, 16) / 255).map((c) => c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    return 0.2126 * (u[0] ?? 0) + 0.7152 * (u[1] ?? 0) + 0.0722 * (u[2] ?? 0);
  }, r = e(t), s = e(n), o = (Math.max(r, s) + 0.05) / (Math.min(r, s) + 0.05);
  return { ratio: o, passesAA: o >= 4.5, passesAAA: o >= 7 };
}
function C(t = !1) {
  const [n, e] = d(t), r = l(() => e((s) => !s), []);
  return { expanded: n, toggle: r, buttonProps: { "aria-expanded": n, onClick: r } };
}
function L(t = "polite") {
  const n = f(null), e = l((r) => {
    n.current && (n.current.textContent = "", requestAnimationFrame(() => {
      n.current && (n.current.textContent = r);
    }));
  }, []);
  return a(() => {
    n.current && n.current.setAttribute("aria-live", t);
  }, [t]), { ref: n, update: e };
}
export {
  L as useARIALive,
  y as useAnnounce,
  C as useAriaExpanded,
  k as useColorContrast,
  b as useFocusTrap,
  g as useFocusVisible,
  x as useForcedColors,
  A as useReducedMotion,
  E as useRovingTabIndex
};
