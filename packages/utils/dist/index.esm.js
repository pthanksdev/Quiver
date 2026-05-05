import { useState as a, useEffect as s, useRef as u, useCallback as i } from "react";
function I(t, e) {
  const [r, o] = a(t);
  return s(() => {
    const n = setTimeout(() => o(t), e);
    return () => clearTimeout(n);
  }, [t, e]), r;
}
function w(t, e) {
  const [r, o] = a(t), n = u(Date.now());
  return s(() => {
    const c = Date.now() - n.current;
    if (c >= e)
      o(t), n.current = Date.now();
    else {
      const l = setTimeout(() => {
        o(t), n.current = Date.now();
      }, e - c);
      return () => clearTimeout(l);
    }
  }, [t, e]), r;
}
function v(t, e) {
  const r = u(t);
  r.current = t, s(() => {
    if (e === null) return;
    const o = setInterval(() => r.current(), e);
    return () => clearInterval(o);
  }, [e]);
}
function y(t, e) {
  const r = u(t);
  r.current = t;
  const o = u(void 0), n = i(() => clearTimeout(o.current), []), c = i(() => {
    n(), o.current = setTimeout(() => r.current(), e);
  }, [e, n]);
  return s(() => (c(), n), [c, n]), { reset: c, clear: n };
}
function D(t) {
  const e = u(t);
  return e.current = t, e;
}
function T(t, e) {
  const r = u(t);
  r.current = t, s(() => {
    if (typeof window > "u") return;
    if (!("requestIdleCallback" in window)) {
      r.current({ didTimeout: !0, timeRemaining: () => 0 });
      return;
    }
    const o = requestIdleCallback((n) => r.current(n), e);
    return () => cancelIdleCallback(o);
  }, []);
}
function b(t, e = 50) {
  const [r, o] = a("");
  return s(() => {
    o("");
    let n = 0;
    const c = setInterval(() => {
      o(t.slice(0, ++n)), n >= t.length && clearInterval(c);
    }, e);
    return () => clearInterval(c);
  }, [t, e]), r;
}
function k(t) {
  const e = i(() => Math.max(0, t.getTime() - Date.now()), [t]), [r, o] = a(e);
  s(() => {
    const c = setInterval(() => o(e()), 1e3);
    return () => clearInterval(c);
  }, [e]);
  const n = Math.floor(r / 1e3);
  return {
    days: Math.floor(n / 86400),
    hours: Math.floor(n % 86400 / 3600),
    minutes: Math.floor(n % 3600 / 60),
    seconds: n % 60,
    isFinished: r === 0
  };
}
function M() {
  const [t, e] = a(0), [r, o] = a(!1), n = u(0), c = u(0), l = u(0);
  l.current = t;
  const f = i(() => {
    e(performance.now() - n.current), c.current = requestAnimationFrame(f);
  }, []), m = i(() => {
    n.current = performance.now() - l.current, o(!0), c.current = requestAnimationFrame(f);
  }, [f]), h = i(() => {
    cancelAnimationFrame(c.current), o(!1);
  }, []), p = i(() => {
    cancelAnimationFrame(c.current), o(!1), e(0);
  }, []);
  return { elapsedMs: t, isRunning: r, start: m, stop: h, reset: p };
}
function R(t) {
  const e = i(() => {
    const n = Math.floor((Date.now() - new Date(t).getTime()) / 1e3);
    return n < 60 ? "just now" : n < 3600 ? `${Math.floor(n / 60)}m ago` : n < 86400 ? `${Math.floor(n / 3600)}h ago` : `${Math.floor(n / 86400)}d ago`;
  }, [t]), [r, o] = a(e);
  return s(() => {
    const n = setInterval(() => o(e()), 6e4);
    return () => clearInterval(n);
  }, [t, e]), r;
}
function d(t, e) {
  if (t === e) return !0;
  if (typeof t != typeof e || t === null || e === null) return !1;
  if (typeof t == "object") {
    const r = Object.keys(t), o = Object.keys(e);
    return r.length !== o.length ? !1 : r.every((n) => d(t[n], e[n]));
  }
  return !1;
}
function C(t, e) {
  const r = u([]);
  d(r.current, e) || (r.current = e), s(t, r.current);
}
function j(t = "quiver") {
  return u(
    `${t}-${typeof crypto < "u" && crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : Math.random().toString(36).slice(2, 9)}`
  ).current;
}
function q(t, e) {
  const r = u({});
  s(() => {
    if (process.env.NODE_ENV !== "development") return;
    const o = {};
    for (const n of Object.keys(e))
      r.current[n] !== e[n] && (o[n] = { from: r.current[n], to: e[n] });
    Object.keys(o).length && console.log(`[useWhyDidYouUpdate] ${t}:`, o), r.current = e;
  });
}
function E(t) {
  const e = u(void 0);
  return e.current || (e.current = { value: t() }), e.current.value;
}
export {
  E as useConstant,
  k as useCountdown,
  I as useDebounce,
  C as useDeepCompareEffect,
  T as useIdleCallback,
  v as useInterval,
  D as useLatest,
  j as useRandomId,
  M as useStopwatch,
  w as useThrottle,
  R as useTimeAgo,
  y as useTimeout,
  b as useTypewriter,
  q as useWhyDidYouUpdate
};
