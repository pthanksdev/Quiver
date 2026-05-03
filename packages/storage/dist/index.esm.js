import { useState as w, useCallback as l, useEffect as S, useRef as v } from "react";
const $ = typeof window < "u", O = /^[a-zA-Z0-9_-]+$/, L = 5 * 1024 * 1024;
function b(e, t) {
  if (!e || typeof e != "string") throw new TypeError(`[${t}] key must be a non-empty string`);
  if (!O.test(e)) throw new Error(`[${t}] Invalid storage key. Only [a-zA-Z0-9_-] (1-128 chars) allowed.`);
}
function I(e, t) {
  try {
    const r = JSON.stringify(e);
    if (new Blob([r]).size > L)
      throw new Error(`[${t}] Value exceeds maximum storage size of 5MB`);
    return r;
  } catch (r) {
    throw new Error(`[${t}] Failed to serialize value: ${String(r)}`);
  }
}
function y(e, t, r) {
  if (e === null) return t;
  try {
    return JSON.parse(e);
  } catch {
    return console.error(`[${r}] Failed to parse stored value, returning fallback.`), t;
  }
}
function _(e, t) {
  b(e, "useLocalStorage");
  const [r, o] = w(() => $ ? y(localStorage.getItem(e), t, "useLocalStorage") : t), s = l((n) => {
    o((a) => {
      const u = n instanceof Function ? n(a) : n;
      if ($)
        try {
          localStorage.setItem(e, I(u, "useLocalStorage"));
        } catch (f) {
          console.error("[useLocalStorage] Write failed:", f);
        }
      return u;
    });
  }, [e]), i = l(() => {
    $ && localStorage.removeItem(e), o(t);
  }, [e, t]);
  return S(() => {
    if (!$) return;
    const n = (a) => {
      a.key === e && o(y(a.newValue, t, "useLocalStorage"));
    };
    return window.addEventListener("storage", n), () => window.removeEventListener("storage", n);
  }, [e, t]), [r, s, i];
}
const m = typeof window < "u", R = /^[a-zA-Z0-9_-]+$/, B = 5 * 1024 * 1024;
function D(e, t) {
  if (!e || typeof e != "string") throw new TypeError(`[${t}] key must be a non-empty string`);
  if (!R.test(e)) throw new Error(`[${t}] Invalid storage key. Only [a-zA-Z0-9_-] (1-128 chars) allowed.`);
}
function T(e, t) {
  try {
    const r = JSON.stringify(e);
    if (new Blob([r]).size > B)
      throw new Error(`[${t}] Value exceeds maximum storage size of 5MB`);
    return r;
  } catch (r) {
    throw new Error(`[${t}] Failed to serialize value: ${String(r)}`);
  }
}
function C(e, t, r) {
  if (e === null) return t;
  try {
    return JSON.parse(e);
  } catch {
    return console.error(`[${r}] Failed to parse stored value, returning fallback.`), t;
  }
}
function Q(e, t) {
  D(e, "useSessionStorage");
  const [r, o] = w(() => m ? C(sessionStorage.getItem(e), t, "useSessionStorage") : t), s = l((n) => {
    o((a) => {
      const u = n instanceof Function ? n(a) : n;
      return m && sessionStorage.setItem(e, T(u, "useSessionStorage")), u;
    });
  }, [e]), i = l(() => {
    m && sessionStorage.removeItem(e), o(t);
  }, [e, t]);
  return [r, s, i];
}
const z = typeof window < "u", K = /^[a-zA-Z0-9_-]+$/, Z = 5 * 1024 * 1024;
function F(e, t) {
  if (!e || typeof e != "string") throw new TypeError(`[${t}] key must be a non-empty string`);
  if (!K.test(e)) throw new Error(`[${t}] Invalid storage key. Only [a-zA-Z0-9_-] (1-128 chars) allowed.`);
}
function J(e, t) {
  try {
    const r = JSON.stringify(e);
    if (new Blob([r]).size > Z)
      throw new Error(`[${t}] Value exceeds maximum storage size of 5MB`);
    return r;
  } catch (r) {
    throw new Error(`[${t}] Failed to serialize value: ${String(r)}`);
  }
}
function Y(e, t, r) {
  if (e === null) return t;
  try {
    return JSON.parse(e);
  } catch {
    return console.error(`[${r}] Failed to parse stored value, returning fallback.`), t;
  }
}
function H(e, t) {
  F(e, "useExpirableStorage");
  const [r, o] = w(() => {
    if (!z) return null;
    const i = localStorage.getItem(e);
    if (!i) return null;
    const n = Y(i, null, "useExpirableStorage");
    return !n || Date.now() > n.expiresAt ? (localStorage.removeItem(e), null) : n.value;
  }), s = l((i) => {
    const n = { value: i, expiresAt: Date.now() + t };
    z && localStorage.setItem(e, J(n, "useExpirableStorage")), o(i);
  }, [e, t]);
  return [r ?? null, s];
}
const M = typeof window < "u";
function N(e, t) {
  const r = v(t);
  r.current = t, S(() => {
    if (!M) return;
    const o = (s) => {
      s.key === e && r.current(s.newValue);
    };
    return window.addEventListener("storage", o), () => window.removeEventListener("storage", o);
  }, [e]);
}
const W = /^[a-zA-Z0-9_-]+$/;
function j(e, t) {
  if (!e || typeof e != "string") throw new TypeError(`[${t}] key must be a non-empty string`);
  if (!W.test(e)) throw new Error(`[${t}] Invalid storage key. Only [a-zA-Z0-9_-] (1-128 chars) allowed.`);
}
function k(e, t = 10) {
  j(e, "useRecentlyUsed");
  const [r, o] = _(e, []), s = l((n) => {
    o((a) => {
      const u = (a ?? []).filter((f) => JSON.stringify(f) !== JSON.stringify(n));
      return [n, ...u].slice(0, t);
    });
  }, [o, t]), i = l(() => o([]), [o]);
  return [r ?? [], s, i];
}
const P = /^[a-zA-Z0-9_-]+$/;
function G(e, t) {
  if (!e || typeof e != "string") throw new TypeError(`[${t}] key must be a non-empty string`);
  if (!P.test(e)) throw new Error(`[${t}] Invalid storage key. Only [a-zA-Z0-9_-] (1-128 chars) allowed.`);
}
function ee(e, t, r) {
  G(e, "usePersistentReducer");
  const [o, s] = _(e, r), i = v(t);
  i.current = t;
  const n = l((a) => {
    s((u) => i.current(u, a));
  }, [s]);
  return [o, n];
}
const X = typeof window < "u";
function te(e, t) {
  const [r, o] = w(t), s = v(null);
  S(() => {
    if (!X || !("BroadcastChannel" in window)) return;
    const n = new BroadcastChannel(e);
    return s.current = n, n.onmessage = (a) => o(a.data), () => n.close();
  }, [e]);
  const i = l((n) => {
    var a;
    o(n), (a = s.current) == null || a.postMessage(n);
  }, []);
  return [r, i];
}
const q = typeof window < "u";
function re() {
  const [e, t] = w(null);
  return S(() => {
    var r;
    !q || !((r = navigator.storage) != null && r.estimate) || navigator.storage.estimate().then(({ usage: o = 0, quota: s = 0 }) => {
      t({ usage: o, quota: s, percent: s > 0 ? o / s * 100 : 0 });
    });
  }, []), e;
}
const U = typeof window < "u";
function ne(e, t, r) {
  const [o, s] = w(null), [i, n] = w(!0), [a, u] = w(null), f = l(() => new Promise((d, g) => {
    const c = indexedDB.open(e, 1);
    c.onupgradeneeded = () => {
      c.result.objectStoreNames.contains(t) || c.result.createObjectStore(t);
    }, c.onsuccess = () => d(c.result), c.onerror = () => g(c.error);
  }), [e, t]);
  S(() => {
    if (!U) {
      n(!1);
      return;
    }
    f().then((d) => {
      const c = d.transaction(t, "readonly").objectStore(t).get(r);
      c.onsuccess = () => {
        s(c.result ?? null), n(!1);
      }, c.onerror = () => {
        u(c.error), n(!1);
      };
    }).catch((d) => {
      u(d), n(!1);
    });
  }, [r, f, t]);
  const A = l(async (d) => {
    const g = await f();
    return new Promise((c, h) => {
      const p = g.transaction(t, "readwrite").objectStore(t).put(d, r);
      p.onsuccess = () => {
        s(d), c();
      }, p.onerror = () => h(p.error);
    });
  }, [r, f, t]), x = l(async () => {
    const d = await f();
    return new Promise((g, c) => {
      const E = d.transaction(t, "readwrite").objectStore(t).delete(r);
      E.onsuccess = () => {
        s(null), g();
      }, E.onerror = () => c(E.error);
    });
  }, [r, f, t]);
  return { value: o, set: A, remove: x, loading: i, error: a };
}
export {
  H as useExpirableStorage,
  ne as useIndexedDB,
  _ as useLocalStorage,
  ee as usePersistentReducer,
  k as useRecentlyUsed,
  Q as useSessionStorage,
  N as useStorageEvent,
  re as useStorageQuota,
  te as useSyncedState
};
