import { useState as l, useRef as p, useCallback as d, useEffect as f } from "react";
const h = typeof window < "u";
function M(r, c = 3e3) {
  const [a, o] = l(null), [t, e] = l(h ? "connecting" : "closed"), n = p(null), s = p(), i = d(() => {
    if (!h) return;
    if (!/^wss?:\/\//i.test(r)) throw new Error("[useWebSocket] Only ws:// or wss:// URLs are allowed");
    const u = new WebSocket(r);
    n.current = u, u.onopen = () => e("open"), u.onmessage = (w) => {
      try {
        o(JSON.parse(String(w.data)));
      } catch {
        o(w.data);
      }
    }, u.onclose = () => {
      e("closed"), s.current = setTimeout(i, c);
    }, u.onerror = () => u.close();
  }, [r, c]);
  f(() => (i(), () => {
    var u;
    clearTimeout(s.current), (u = n.current) == null || u.close();
  }), [i]);
  const g = d((u) => {
    var w;
    ((w = n.current) == null ? void 0 : w.readyState) === WebSocket.OPEN && n.current.send(JSON.stringify(u));
  }, []), y = d(() => {
    var u;
    clearTimeout(s.current), (u = n.current) == null || u.close(), e("closed");
  }, []);
  return { lastMessage: a, status: t, send: g, disconnect: y };
}
const C = typeof window < "u";
function b(r) {
  if (r && !/^https?:\/\//i.test(r)) throw new Error("[useSSE] Only http/https URLs allowed");
  const [c, a] = l(null), [o, t] = l(null), [e, n] = l(!1);
  return f(() => {
    if (!C) return;
    const s = new EventSource(r);
    return s.onopen = () => n(!0), s.onmessage = (i) => {
      try {
        a(JSON.parse(String(i.data)));
      } catch {
        a(i.data);
      }
    }, s.onerror = (i) => {
      t(i), n(!1);
    }, () => {
      s.close(), n(!1);
    };
  }, [r]), { data: c, error: o, connected: e };
}
const E = typeof window < "u";
function m(r) {
  const [c, a] = l(null), o = p(null);
  f(() => {
    if (!E || !("BroadcastChannel" in window)) return;
    const e = new BroadcastChannel(r);
    return o.current = e, e.onmessage = (n) => a(n.data), () => e.close();
  }, [r]);
  const t = d((e) => {
    var n;
    return (n = o.current) == null ? void 0 : n.postMessage(e);
  }, []);
  return { lastMessage: c, postMessage: t };
}
const L = typeof window < "u";
function O(r) {
  const [c, a] = l(!1);
  return f(() => {
    if (!L || !("BroadcastChannel" in window)) {
      a(!0);
      return;
    }
    const o = Math.random().toString(36), t = new BroadcastChannel(r);
    let e = !1;
    const n = setInterval(() => {
      e && t.postMessage({ type: "heartbeat", id: o });
    }, 500);
    return t.onmessage = (s) => {
      s.data.type === "heartbeat" && s.data.id !== o && e && (e = !1, a(!1));
    }, setTimeout(() => {
      e = !0, a(!0), t.postMessage({ type: "heartbeat", id: o });
    }, 200), () => {
      clearInterval(n), t.close();
    };
  }, [r]), { isLeader: c };
}
function R(r, c) {
  const [a, o] = l([]), { lastMessage: t, postMessage: e } = m(r);
  f(() => {
    e({ type: "join", user: c });
  }, []), f(() => {
    t && (t.type === "join" || t.type === "update" ? o((s) => [...s.filter((g) => g.id !== t.user.id), t.user]) : t.type === "leave" && o((s) => s.filter((i) => i.id !== t.user.id)));
  }, [t]);
  const n = d((s) => e({ type: "update", user: s }), [e]);
  return { peers: a, setSelf: n };
}
const S = typeof window < "u";
function k(r) {
  const [c, a] = l([]), [o, t] = l(S ? navigator.onLine : !0), e = p(r);
  e.current = r, f(() => {
    if (!S) return;
    const s = () => {
      t(!0);
    }, i = () => t(!1);
    return window.addEventListener("online", s), window.addEventListener("offline", i), () => {
      window.removeEventListener("online", s), window.removeEventListener("offline", i);
    };
  }, []), f(() => {
    o && c.length > 0 && e.current(c).then(() => a([])).catch(() => {
    });
  }, [o, c]);
  const n = d((s) => {
    o ? e.current([s]).catch(() => a((i) => [...i, s])) : a((i) => [...i, s]);
  }, [o]);
  return { queue: c, enqueue: n, isOnline: o };
}
function B() {
  const [r, c] = l(/* @__PURE__ */ new Set()), a = d((e) => c((n) => /* @__PURE__ */ new Set([...n, e])), []), o = d((e) => c((n) => /* @__PURE__ */ new Set([...n, ...e])), []), t = d(() => [...r], [r]);
  return { items: r, add: a, merge: o, toArray: t };
}
export {
  m as useBroadcastChannel,
  B as useCRDT,
  O as useLeaderElection,
  k as useNetworkReplay,
  R as usePresence,
  b as useSSE,
  M as useWebSocket
};
