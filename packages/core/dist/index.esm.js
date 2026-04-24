import { useState as h, useEffect as p, useRef as M, useCallback as o } from "react";
function R() {
  const [t, e] = h(!1);
  return p(() => (e(!0), () => e(!1)), []), t;
}
function S() {
  const t = M(!1);
  return p(() => (t.current = !0, () => {
    t.current = !1;
  }), []), o(() => t.current, []);
}
function v(t) {
  const e = M(void 0);
  return p(() => {
    e.current = t;
  }, [t]), e.current;
}
function I(t = !1) {
  const [e, n] = h(t), c = o(() => n((a) => !a), []), s = o(() => n(!0), []), r = o(() => n(!1), []);
  return { value: e, toggle: c, setTrue: s, setFalse: r };
}
function C(t = 0, e = {}) {
  const { min: n = -1 / 0, max: c = 1 / 0, step: s = 1 } = e, r = (u) => Math.min(c, Math.max(n, u)), [a, i] = h(() => r(t)), d = o(() => i((u) => r(u + s)), [c, n, s]), m = o(() => i((u) => r(u - s)), [c, n, s]), f = o(() => i(r(t)), [t]), l = o((u) => i(r(u)), [n, c]);
  return { count: a, increment: d, decrement: m, reset: f, set: l };
}
function b() {
  const t = M(0);
  return t.current += 1, t.current;
}
function w(t, e = 100) {
  const [n, c] = h([t]), [s, r] = h(0), a = M(s);
  a.current = s;
  const i = n[s], d = o((l) => {
    const u = a.current;
    c((g) => [...g.slice(0, u + 1), l].slice(-e)), r((g) => Math.min(g + 1, e - 1));
  }, [e]), m = o(() => r((l) => Math.max(0, l - 1)), []), f = o(() => r((l) => Math.min(n.length - 1, l + 1)), [n.length]);
  return { state: i, set: d, undo: m, redo: f, canUndo: s > 0, canRedo: s < n.length - 1, history: n };
}
function H(t, e) {
  const [n, c] = h(t), s = M(e);
  s.current = e;
  const r = o((i) => {
    c((d) => {
      var f;
      const m = (f = s.current[d]) == null ? void 0 : f[i];
      return m !== void 0 ? m : d;
    });
  }, []), a = o((i) => {
    var d;
    return ((d = s.current[n]) == null ? void 0 : d[i]) !== void 0;
  }, [n]);
  return { state: n, send: r, can: a };
}
function k(t) {
  const [e, n] = h(t), c = o((r) => n((a) => ({ ...a, ...r })), []), s = o(() => n(t), [t]);
  return [e, c, s];
}
function P(t) {
  const [e, n] = h([t]), [c, s] = h(0), r = M(c);
  r.current = c;
  const a = e[c], i = o((f) => {
    const l = r.current;
    n((u) => [...u.slice(0, l + 1), f]), s((u) => u + 1);
  }, []), d = o(() => s((f) => Math.max(0, f - 1)), []), m = o(() => s((f) => Math.min(e.length - 1, f + 1)), [e.length]);
  return { value: a, setValue: i, history: e, pointer: c, back: d, forward: m };
}
export {
  C as useCounter,
  S as useIsMounted,
  R as useMounted,
  k as useMultiState,
  v as usePrevious,
  b as useRenderCount,
  H as useStateMachine,
  P as useStateWithHistory,
  I as useToggle,
  w as useUndoable
};
