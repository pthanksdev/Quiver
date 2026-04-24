import { useState as r, useRef as m, useCallback as b, useEffect as E } from "react";
const S = 1e4, F = /^(127\\.|10\\.|192\\.168\\.|169\\.254\\.|172\\.(1[6-9]|2[0-9]|3[01])\\.)/;
function L(t, n) {
  if (!t || typeof t != "string") throw new TypeError(`[${n}] url must be a non-empty string`);
  try {
    const { hostname: e } = new URL(t);
    if (F.test(e))
      if (process.env.NODE_ENV === "development")
        console.warn(`[${n}] Warning: Request targeting private/local address ${e}`);
      else throw new Error(`[${n}] SSRF protection: private/local URLs are blocked in production`);
  } catch (e) {
    if (e instanceof Error && e.message.includes("SSRF")) throw e;
  }
}
function P(t, n = {}) {
  const { immediate: e = !0, timeout: l = S, ...u } = n, [c, d] = r(null), [s, p] = r(e), [g, a] = r(null), f = m(null), i = m(!0), o = b(() => {
    var A;
    L(t, "useFetch"), (A = f.current) == null || A.abort();
    const h = new AbortController();
    f.current = h;
    const v = setTimeout(() => h.abort(new Error("[useFetch] Request timed out")), l);
    p(!0), a(null), fetch(t, { ...u, signal: h.signal }).then(async (w) => {
      clearTimeout(v);
      const T = w.headers.get("content-type") ?? "";
      if (!T.includes("application/json") && !T.includes("text/"))
        throw new Error(`[useFetch] Unexpected content-type: ${T}`);
      if (!w.ok) throw new Error(`[useFetch] HTTP ${w.status}: ${w.statusText}`);
      const I = await w.json();
      i.current && d(I);
    }).catch((w) => {
      clearTimeout(v), i.current && w.name !== "AbortError" && a(w);
    }).finally(() => {
      i.current && p(!1);
    });
  }, [t, l]);
  E(() => (i.current = !0, e && o(), () => {
    var h;
    i.current = !1, (h = f.current) == null || h.abort();
  }), [o, e]);
  const y = b(() => {
    var h;
    return (h = f.current) == null ? void 0 : h.abort();
  }, []);
  return { data: c, loading: s, error: g, refetch: o, abort: y };
}
function U(t) {
  const [n, e] = r(null), [l, u] = r(!1), [c, d] = r(null), s = m(!0);
  E(() => () => {
    s.current = !1;
  }, []);
  const p = b(async (...a) => {
    u(!0), d(null);
    try {
      const f = await t(...a);
      s.current && e(f);
    } catch (f) {
      s.current && d(f);
    } finally {
      s.current && u(!1);
    }
  }, [t]), g = b(() => {
    e(null), d(null), u(!1);
  }, []);
  return { execute: p, data: n, loading: l, error: c, reset: g };
}
function $(t, n, e = !0) {
  const [l, u] = r(null), [c, d] = r(null), [s, p] = r(!1), g = m(t);
  return g.current = t, E(() => {
    if (!e) return;
    let a = !1;
    const f = async () => {
      p(!0);
      try {
        const o = await g.current();
        a || u(o);
      } catch (o) {
        a || d(o);
      } finally {
        a || p(!1);
      }
    };
    f();
    const i = setInterval(() => void f(), n);
    return () => {
      a = !0, clearInterval(i);
    };
  }, [n, e]), { data: l, error: c, loading: s };
}
function j(t, n = 3, e = 500) {
  const [l, u] = r(null), [c, d] = r(null), [s, p] = r(!1), [g, a] = r(0);
  return { execute: b(async () => {
    p(!0), d(null);
    for (let i = 0; i <= n; i++)
      try {
        const o = await t();
        u(o), a(i);
        break;
      } catch (o) {
        if (a(i), i === n) {
          d(o);
          break;
        }
        const y = Math.random() * e;
        await new Promise((h) => setTimeout(h, e * 2 ** i + y));
      }
    p(!1);
  }, [t, n, e]), data: l, error: c, loading: s, attempt: g };
}
function x(t, n) {
  const [e, l] = r(t), [u, c] = r(!1), [d, s] = r(null), p = b(async (g) => {
    l(g), c(!0), s(null);
    try {
      const a = await n(g);
      l(a);
    } catch (a) {
      l(t), s(a);
    } finally {
      c(!1);
    }
  }, [t, n]);
  return { value: e, update: p, isPending: u, error: d };
}
function C() {
  const t = m(new AbortController());
  return E(() => {
    const n = new AbortController();
    return t.current = n, () => n.abort();
  }, []), t.current;
}
const R = /* @__PURE__ */ new Map();
function M(t, n) {
  if (!R.has(t)) {
    const u = { ...{ status: "pending" }, promise: n().then((c) => {
      Object.assign(u, { status: "success", value: c });
    }).catch((c) => {
      Object.assign(u, { status: "error", error: c });
    }) };
    R.set(t, u);
  }
  const e = R.get(t);
  if (e.status === "pending") throw e.promise;
  if (e.status === "error") throw e.error;
  return e.value;
}
function D(t) {
  const [n, e] = r([]), [l, u] = r(1), [c, d] = r(!1), [s, p] = r(!0), [g, a] = r(null), f = m(null), i = m(t);
  return i.current = t, E(() => {
    s && (d(!0), i.current(l).then((o) => {
      e((y) => [...y, ...o]), o.length === 0 && p(!1);
    }).catch((o) => a(o)).finally(() => d(!1)));
  }, [l, s]), E(() => {
    if (!f.current || !s) return;
    const o = new IntersectionObserver((y) => {
      var h;
      (h = y[0]) != null && h.isIntersecting && !c && u((v) => v + 1);
    });
    return o.observe(f.current), () => o.disconnect();
  }, [c, s]), { items: n, sentinelRef: f, loading: c, hasMore: s, error: g };
}
export {
  C as useAbortController,
  U as useAsync,
  P as useFetch,
  D as useInfiniteScroll,
  x as useOptimisticUpdate,
  $ as usePolling,
  j as useSmartRetry,
  M as useSuspenseQuery
};
