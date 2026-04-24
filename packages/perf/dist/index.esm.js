import { useState as u, useEffect as f, useRef as m, useCallback as p } from "react";
const y = typeof window < "u";
function E() {
  const [r, o] = u(null), [t, e] = u(null), [n, c] = u(null);
  return f(() => {
    if (!y || !("PerformanceObserver" in window)) return;
    const s = [], l = (i, a) => {
      try {
        const d = new PerformanceObserver(a);
        d.observe({ type: i[0], buffered: !0 }), s.push(d);
      } catch {
      }
    };
    return l(["largest-contentful-paint"], (i) => {
      const a = i.getEntries().pop();
      a && o(a.startTime);
    }), l(["layout-shift"], (i) => {
      e((a) => (a ?? 0) + i.getEntries().reduce((d, v) => d + (v.value ?? 0), 0));
    }), l(["event"], (i) => {
      i.getEntries().forEach((a) => {
        a.duration > 0 && c(a.duration);
      });
    }), () => s.forEach((i) => i.disconnect());
  }, []), { lcp: r, cls: t, inp: n };
}
const g = typeof window < "u";
function k() {
  const [r, o] = u(0), [t, e] = u(null);
  return f(() => {
    if (!g || !("PerformanceObserver" in window)) return;
    let n;
    try {
      n = new PerformanceObserver((c) => {
        c.getEntries().forEach((s) => {
          o((l) => l + 1), e(s.duration);
        });
      }), n.observe({ type: "longtask", buffered: !0 });
    } catch {
    }
    return () => n == null ? void 0 : n.disconnect();
  }, []), { longTaskCount: r, lastDuration: t };
}
function S() {
  const [r, o] = u(null);
  return f(() => {
    const t = performance.memory;
    if (!t) return;
    const e = () => {
      const c = t.usedJSHeapSize / 1e6, s = t.totalJSHeapSize / 1e6;
      o({ usedJSHeapSize: c, totalJSHeapSize: s, pressurePercent: s > 0 ? c / s * 100 : 0 });
    };
    e();
    const n = setInterval(e, 2e3);
    return () => clearInterval(n);
  }, []), r;
}
function C() {
  const [r, o] = u(0), t = m(performance.now()), e = m(0);
  return f(() => {
    let n;
    const c = () => {
      e.current++;
      const s = performance.now();
      s - t.current >= 1e3 && (o(Math.round(e.current * 1e3 / (s - t.current))), e.current = 0, t.current = s), n = requestAnimationFrame(c);
    };
    return n = requestAnimationFrame(c), () => cancelAnimationFrame(n);
  }, []), r;
}
function I() {
  const r = m(performance.now()), [o, t] = u(0);
  return f(() => {
    const e = performance.now();
    t(e - r.current), r.current = e;
  }, []), o;
}
const w = typeof window < "u";
function D() {
  const r = () => {
    var e;
    return ((e = navigator.connection) == null ? void 0 : e.effectiveType) ?? "unknown";
  }, [o, t] = u(w ? r() : "unknown");
  return f(() => {
    if (!w) return;
    const e = navigator.connection;
    if (!e) return;
    const n = () => t(r());
    return e.addEventListener("change", n), () => e.removeEventListener("change", n);
  }, []), o;
}
function P() {
  const r = p((t) => performance.mark(t), []), o = p((t, e, n) => {
    try {
      return performance.measure(t, e, n);
    } catch {
      return null;
    }
  }, []);
  return { mark: r, measure: o };
}
const b = typeof window < "u";
function T(r = 6e4) {
  const [o, t] = u(!1), e = b && "IdleDetector" in window;
  return f(() => {
    if (!e) return;
    let n;
    (async () => {
      const s = window;
      s.IdleDetector && (n = new s.IdleDetector(), n.addEventListener("change", () => t(!0)), await n.start({ threshold: r }));
    })();
  }, [e, r]), { idle: o, supported: e };
}
export {
  C as useFPS,
  T as useIdleDetection,
  k as useLongTask,
  S as useMemoryPressure,
  D as useNetworkQuality,
  I as useRenderTime,
  P as useUserTiming,
  E as useWebVitals
};
