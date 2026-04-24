import { useState as a, useRef as w, useCallback as d, useEffect as R } from "react";
const P = /^https?:\/\//i;
function q(s) {
  const { apiKey: u, model: r = "gpt-4o", baseUrl: l = "https://api.openai.com", systemPrompt: i } = s;
  if (!P.test(l)) throw new Error("[useAIStream] Only http/https baseUrl allowed");
  const [f, e] = a(""), [t, o] = a(!1), [n, p] = a(null), c = w(null), h = d(() => {
    var g;
    (g = c.current) == null || g.abort(), o(!1);
  }, []), m = d(() => {
    e(""), p(null);
  }, []);
  return { stream: d(async (g) => {
    var E, T;
    (E = c.current) == null || E.abort();
    const k = new AbortController();
    c.current = k, e(""), o(!0), p(null);
    try {
      const y = [
        ...i ? [{ role: "system", content: i }] : [],
        { role: "user", content: g }
      ], S = await fetch(`${l}/v1/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${u}` },
        body: JSON.stringify({ model: r, messages: y, stream: !0 }),
        signal: k.signal
      });
      if (!S.ok || !S.body) throw new Error(`[useAIStream] HTTP ${S.status}`);
      const L = S.body.getReader(), O = new TextDecoder();
      for (; ; ) {
        const { done: v, value: x } = await L.read();
        if (v) break;
        const I = O.decode(x).split(`
`).filter((b) => b.startsWith("data: "));
        for (const b of I) {
          const A = b.slice(6);
          if (A === "[DONE]") break;
          try {
            const D = ((T = JSON.parse(A).choices[0]) == null ? void 0 : T.delta.content) ?? "";
            e((N) => N + D);
          } catch {
          }
        }
      }
    } catch (y) {
      y.name !== "AbortError" && p(y);
    } finally {
      o(!1);
    }
  }, [u, l, r, i]), text: f, loading: t, error: n, abort: h, reset: m };
}
const U = typeof window < "u";
function J(s = "en-US") {
  const [u, r] = a(""), [l, i] = a(!1), [f, e] = a(null), t = U && !!(window.webkitSpeechRecognition || window.SpeechRecognition), o = w(null), n = d(() => {
    if (!t) {
      e("[useSpeechRecognition] Not supported");
      return;
    }
    const c = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!c) return;
    const h = new c();
    h.lang = s, h.continuous = !0, h.interimResults = !0, h.onresult = (m) => r(Array.from(m.results).map((C) => {
      var g;
      return ((g = C[0]) == null ? void 0 : g.transcript) ?? "";
    }).join("")), h.onerror = (m) => e(m.error), h.onend = () => i(!1), o.current = h, h.start(), i(!0);
  }, [s, t]), p = d(() => {
    var c;
    (c = o.current) == null || c.stop(), i(!1);
  }, []);
  return R(() => () => {
    var c;
    return (c = o.current) == null ? void 0 : c.stop();
  }, []), { transcript: u, listening: l, supported: t, start: n, stop: p, error: f };
}
const $ = typeof window < "u";
function Q() {
  const s = $ && "speechSynthesis" in window, [u, r] = a(!1), [l, i] = a([]);
  R(() => {
    if (!s) return;
    const t = () => i(speechSynthesis.getVoices());
    t(), speechSynthesis.onvoiceschanged = t;
  }, [s]);
  const f = d((t, o = {}) => {
    if (!s) return;
    const n = new SpeechSynthesisUtterance(t);
    o.voice && (n.voice = o.voice), n.rate = o.rate ?? 1, n.pitch = o.pitch ?? 1, n.onstart = () => r(!0), n.onend = () => r(!1), speechSynthesis.speak(n);
  }, [s]), e = d(() => {
    speechSynthesis.cancel(), r(!1);
  }, []);
  return { speak: f, cancel: e, isSpeaking: u, voices: l, supported: s };
}
function V(s, u = 300) {
  const [r, l] = a(""), [i, f] = a([]), [e, t] = a(!1), o = w(), n = w(s);
  return n.current = s, R(() => {
    if (clearTimeout(o.current), !r.trim()) {
      f([]);
      return;
    }
    t(!0), o.current = setTimeout(() => {
      (async () => {
        try {
          f(await n.current(r));
        } catch {
          f([]);
        } finally {
          t(!1);
        }
      })();
    }, u);
  }, [r, u]), { query: r, setQuery: l, suggestions: i, loading: e };
}
function W(s, u) {
  const [r, l] = a(""), i = (e, t) => {
    const o = e.toLowerCase(), n = t.toLowerCase();
    if (o.includes(n)) return 1;
    let p = 0;
    for (let c = 0; c < n.length; c++) o.includes(n[c] ?? "") && p++;
    return p / n.length;
  }, f = r.trim() ? s.map((e) => ({ item: e, score: Math.max(...u.map((t) => i(String(e[t] ?? ""), r))) })).filter((e) => e.score > 0.5).sort((e, t) => t.score - e.score).map((e) => e.item) : s;
  return { query: r, setQuery: l, results: f };
}
function z(s) {
  const [u, r] = a([]), [l, i] = a(!1), [f, e] = a(null), t = w(s);
  return t.current = s, { classify: d(async (n) => {
    i(!0), e(null);
    try {
      const p = n.getContext("2d");
      if (!p) throw new Error("[useImageClassifier] Canvas context unavailable");
      const c = p.getImageData(0, 0, n.width, n.height);
      r(await t.current(c));
    } catch (p) {
      e(p);
    } finally {
      i(!1);
    }
  }, []), results: u, loading: l, error: f };
}
export {
  q as useAIStream,
  V as useAutocomplete,
  z as useImageClassifier,
  W as useSmartSearch,
  J as useSpeechRecognition,
  Q as useSpeechSynthesis
};
