import { useState as l, useCallback as o, useRef as x, useEffect as A } from "react";
function N(n) {
  const { initialValues: t, validators: e = {}, onSubmit: s } = n, [i, a] = l(t), [d, c] = l({}), [m, r] = l({}), [u, p] = l(!1), [h, b] = l(null), v = JSON.stringify(i) !== JSON.stringify(t), y = o((f) => {
    const g = {};
    for (const [S, k] of Object.entries(e)) {
      const O = k(f[S]);
      O && (g[S] = O);
    }
    return g;
  }, [e]), C = o((f, g) => {
    a((S) => {
      const k = { ...S, [f]: g };
      return c(y(k)), k;
    });
  }, [y]), w = o((f) => r((g) => ({ ...g, [f]: !0 })), []), F = o(async (f) => {
    f == null || f.preventDefault();
    const g = y(i);
    if (c(g), r(Object.fromEntries(Object.keys(i).map((S) => [S, !0]))), !(Object.keys(g).length > 0)) {
      p(!0), b(null);
      try {
        await s(i);
      } catch (S) {
        b(S);
      } finally {
        p(!1);
      }
    }
  }, [i, y, s]), T = o(() => {
    a(t), c({}), r({});
  }, [t]);
  return { values: i, errors: d, touched: m, dirty: v, submitting: u, submitError: h, setValue: C, setTouched: w, handleSubmit: F, reset: T };
}
function j(n) {
  const [t, e] = l(n), s = o((r) => e((u) => [...u, r]), []), i = o((r) => e((u) => [r, ...u]), []), a = o((r) => e((u) => u.filter((p, h) => h !== r)), []), d = o((r, u) => e((p) => {
    const h = [...p], [b] = h.splice(r, 1);
    return h.splice(u, 0, b), h;
  }), []), c = o((r, u) => e((p) => p.map((h, b) => b === r ? u : h)), []), m = o((r) => e(r), []);
  return { fields: t, append: s, prepend: i, remove: a, move: d, update: c, replace: m };
}
function M(n, t, e = 1e3) {
  const [s, i] = l(!1), a = x();
  A(() => (clearTimeout(a.current), a.current = setTimeout(() => {
    localStorage.setItem(t, JSON.stringify(n)), i(!0);
  }, e), () => clearTimeout(a.current)), [n, t, e]);
  const d = o(() => {
    try {
      const c = localStorage.getItem(t);
      return c ? JSON.parse(c) : null;
    } catch {
      return null;
    }
  }, [t]);
  return { hasSaved: s, restore: d };
}
function D(n) {
  const [t, e] = l(1);
  return {
    step: t,
    isFirst: t === 1,
    isLast: t === n,
    next: () => e((s) => Math.min(s + 1, n)),
    back: () => e((s) => Math.max(s - 1, 1)),
    goTo: (s) => e(Math.min(Math.max(1, s), n))
  };
}
function I(n, t) {
  const e = n.length, s = n.trim() ? n.trim().split(/\s+/).length : 0, i = new TextEncoder().encode(n).length, a = t !== void 0 ? t - e : null;
  return { chars: e, words: s, bytesUTF8: i, remaining: a, isOverLimit: t !== void 0 && e > t };
}
const E = {
  phone: "(###) ###-####",
  date: "##/##/####",
  creditCard: "#### #### #### ####"
};
function V(n) {
  const [t, e] = l(""), s = E[n] ?? n, i = o((d) => {
    const c = d.target.value.replace(/\D/g, "");
    let m = "", r = 0;
    for (let u = 0; u < s.length && r < c.length; u++)
      m += s[u] === "#" ? c[r++] : s[u];
    e(m);
  }, [s]), a = t.replace(/\D/g, "");
  return { value: t, onChange: i, raw: a };
}
function z(n, t) {
  const e = Object.keys(n).filter((s) => JSON.stringify(n[s]) !== JSON.stringify(t[s]));
  return { changedFields: e, hasChanges: e.length > 0 };
}
function L(n) {
  const [t, e] = l(/* @__PURE__ */ new Set()), s = o((c) => e((m) => {
    const r = new Set(m);
    return r.has(c) ? r.delete(c) : r.add(c), r;
  }), []), i = o(() => e(new Set(n)), [n]), a = o(() => e(/* @__PURE__ */ new Set()), []), d = o((c) => t.has(c), [t]);
  return { checked: t, toggle: s, checkAll: i, uncheckAll: a, isChecked: d, isAllChecked: t.size === n.length, isIndeterminate: t.size > 0 && t.size < n.length };
}
export {
  I as useCharacterCount,
  L as useCheckboxGroup,
  j as useFieldArray,
  N as useForm,
  M as useFormAutosave,
  z as useFormDiff,
  D as useFormStep,
  V as useMaskedInput
};
