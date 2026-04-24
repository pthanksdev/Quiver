import { useState as d, useCallback as S, useMemo as g } from "react";
function h(n, e = 10) {
  const [t, i] = d(1), [a, u] = d(e), r = Math.max(1, Math.ceil(n / a)), c = S((o) => i(Math.min(Math.max(1, o), r)), [r]), l = [(t - 1) * a, Math.min(t * a, n)];
  return { page: t, pageSize: a, totalPages: r, nextPage: () => c(t + 1), prevPage: () => c(t - 1), goToPage: c, setPageSize: u, range: l };
}
function p(n) {
  const [e, t] = d(null), [i, a] = d("asc"), u = S((l) => {
    t((o) => (a(o === l ? (s) => s === "asc" ? "desc" : "asc" : "asc"), l));
  }, []), r = g(() => e ? [...n].sort((l, o) => {
    const s = l[e], w = o[e], f = String(s).localeCompare(String(w), void 0, { numeric: !0 });
    return i === "asc" ? f : -f;
  }) : n, [n, e, i]), c = S(() => t(null), []);
  return { sortKey: e, direction: i, sorted: r, setSort: u, clearSort: c };
}
function b(n) {
  const [e, t] = d({}), i = S((c, l) => t((o) => ({ ...o, [c]: l })), []), a = S((c) => t((l) => {
    const o = { ...l };
    return delete o[c], o;
  }), []), u = S(() => t({}), []), r = g(
    () => n.filter((c) => Object.entries(e).every(([l, o]) => o === void 0 || o === "" || String(c[l]).toLowerCase().includes(String(o).toLowerCase()))),
    [n, e]
  );
  return { filters: e, filtered: r, setFilter: i, clearFilter: a, clearAll: u };
}
function x(n, e) {
  const [t, i] = d(""), a = g(() => {
    if (!t.trim()) return n;
    const r = t.toLowerCase();
    return n.filter((c) => e.some((l) => String(c[l] ?? "").toLowerCase().includes(r)));
  }, [n, t, e]), u = S((r) => {
    if (!t) return [];
    const c = [], l = r.toLowerCase(), o = t.toLowerCase();
    let s = l.indexOf(o);
    for (; s !== -1; )
      c.push([s, s + o.length]), s = l.indexOf(o, s + 1);
    return c;
  }, [t]);
  return { query: t, setQuery: i, results: a, getHighlightRanges: u };
}
function v(n, e) {
  const [t, i] = d(/* @__PURE__ */ new Set()), a = S((o) => {
    const s = e(o);
    i((w) => {
      const f = new Set(w);
      return f.has(s) ? f.delete(s) : f.add(s), f;
    });
  }, [e]), u = S(() => i(new Set(n.map(e))), [n, e]), r = S(() => i(/* @__PURE__ */ new Set()), []), c = S((o) => t.has(e(o)), [t, e]), l = g(() => n.filter((o) => t.has(e(o))), [n, t, e]);
  return { selectedKeys: t, isSelected: c, toggle: a, selectAll: u, clearAll: r, selectedItems: l };
}
function L(n, e, t) {
  const [i, a] = d(0), u = n.length * t, r = Math.max(0, Math.floor(i / t) - 3), c = Math.min(n.length, Math.ceil((i + e) / t) + 3);
  return { visibleItems: n.slice(r, c).map((s, w) => ({
    item: s,
    index: r + w,
    offsetTop: (r + w) * t
  })), totalHeight: u, containerProps: {
    style: { height: e, overflowY: "auto", position: "relative" },
    onScroll: (s) => a(s.currentTarget.scrollTop)
  } };
}
function C(n, e, t = [], i = 20) {
  const a = x(n, t), u = b(a.results), r = p(u.filtered), c = h(r.sorted.length, i), l = r.sorted.slice(c.range[0], c.range[1]), o = v(l, e);
  return { rows: l, pagination: c, sort: r, filter: u, search: a, selection: o };
}
function M(n, e = "export.csv") {
  return { download: S(() => {
    const i = Object.keys(n[0] ?? {}), a = [i.join(","), ...n.map((c) => i.map((l) => JSON.stringify(c[l] ?? "")).join(","))].join(`
`), u = new Blob([a], { type: "text/csv" }), r = document.createElement("a");
    r.href = URL.createObjectURL(u), r.download = e, r.click(), URL.revokeObjectURL(r.href);
  }, [n, e]) };
}
function O(n, e) {
  const t = () => {
    if (!e) return new Set(n);
    try {
      const s = localStorage.getItem(e);
      return s ? new Set(JSON.parse(s)) : new Set(n);
    } catch {
      return new Set(n);
    }
  }, [i, a] = d(t), u = (s) => {
    e && localStorage.setItem(e, JSON.stringify([...s]));
  }, r = S((s) => a((w) => {
    const f = new Set(w);
    return f.has(s) ? f.delete(s) : f.add(s), u(f), f;
  }), []), c = S(() => {
    const s = new Set(n);
    u(s), a(s);
  }, [n]), l = S(() => {
    const s = /* @__PURE__ */ new Set();
    u(s), a(s);
  }, []), o = S((s) => i.has(s), [i]);
  return { visible: i, toggle: r, showAll: c, hideAll: l, isVisible: o };
}
export {
  M as useCSVExport,
  O as useColumnVisibility,
  b as useFilter,
  h as usePagination,
  v as useRowSelection,
  x as useSearch,
  p as useSorting,
  C as useTable,
  L as useVirtualList
};
