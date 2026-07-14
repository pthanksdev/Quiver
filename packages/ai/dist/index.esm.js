import { useCallback as e, useEffect as t, useRef as n, useState as r } from "react";
//#region src/hooks/useAIStream.ts
var i = /^https?:\/\//i;
function a(t) {
	let { apiKey: a, model: o = "gpt-4o", baseUrl: s = "https://api.openai.com", systemPrompt: c } = t;
	if (!i.test(s)) throw Error("[useAIStream] Only http/https baseUrl allowed");
	let [l, u] = r(""), [d, f] = r(!1), [p, m] = r(null), h = n(null), g = e(() => {
		h.current?.abort(), f(!1);
	}, []), _ = e(() => {
		u(""), m(null);
	}, []);
	return {
		stream: e(async (e) => {
			h.current?.abort();
			let t = new AbortController();
			h.current = t, u(""), f(!0), m(null);
			try {
				let n = [...c ? [{
					role: "system",
					content: c
				}] : [], {
					role: "user",
					content: e
				}], r = await fetch(`${s}/v1/chat/completions`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${a}`
					},
					body: JSON.stringify({
						model: o,
						messages: n,
						stream: !0
					}),
					signal: t.signal
				});
				if (!r.ok || !r.body) throw Error(`[useAIStream] HTTP ${r.status}`);
				let i = r.body.getReader(), l = new TextDecoder();
				for (;;) {
					let { done: e, value: t } = await i.read();
					if (e) break;
					let n = l.decode(t).split("\n").filter((e) => e.startsWith("data: "));
					for (let e of n) {
						let t = e.slice(6);
						if (t === "[DONE]") break;
						try {
							let e = JSON.parse(t).choices[0]?.delta.content ?? "";
							u((t) => t + e);
						} catch {}
					}
				}
			} catch (e) {
				e.name !== "AbortError" && m(e);
			} finally {
				f(!1);
			}
		}, [
			a,
			s,
			o,
			c
		]),
		text: l,
		loading: d,
		error: p,
		abort: g,
		reset: _
	};
}
//#endregion
//#region src/hooks/useSpeechRecognition.ts
var o = typeof window < "u";
function s(i = "en-US") {
	let [a, s] = r(""), [c, l] = r(!1), [u, d] = r(null), f = o && !!(window.webkitSpeechRecognition || window.SpeechRecognition), p = n(null), m = e(() => {
		if (!f) {
			d("[useSpeechRecognition] Not supported");
			return;
		}
		let e = window.SpeechRecognition ?? window.webkitSpeechRecognition;
		if (!e) return;
		let t = new e();
		t.lang = i, t.continuous = !0, t.interimResults = !0, t.onresult = (e) => s(Array.from(e.results).map((e) => e[0]?.transcript ?? "").join("")), t.onerror = (e) => d(e.error), t.onend = () => l(!1), p.current = t, t.start(), l(!0);
	}, [i, f]), h = e(() => {
		p.current?.stop(), l(!1);
	}, []);
	return t(() => () => p.current?.stop(), []), {
		transcript: a,
		listening: c,
		supported: f,
		start: m,
		stop: h,
		error: u
	};
}
//#endregion
//#region src/hooks/useSpeechSynthesis.ts
var c = typeof window < "u";
function l() {
	let n = c && "speechSynthesis" in window, [i, a] = r(!1), [o, s] = r([]);
	return t(() => {
		if (!n) return;
		let e = () => s(speechSynthesis.getVoices());
		e(), speechSynthesis.onvoiceschanged = e;
	}, [n]), {
		speak: e((e, t = {}) => {
			if (!n) return;
			let r = new SpeechSynthesisUtterance(e);
			t.voice && (r.voice = t.voice), r.rate = t.rate ?? 1, r.pitch = t.pitch ?? 1, r.onstart = () => a(!0), r.onend = () => a(!1), speechSynthesis.speak(r);
		}, [n]),
		cancel: e(() => {
			speechSynthesis.cancel(), a(!1);
		}, []),
		isSpeaking: i,
		voices: o,
		supported: n
	};
}
//#endregion
//#region src/hooks/useAutocomplete.ts
function u(e, i = 300) {
	let [a, o] = r(""), [s, c] = r([]), [l, u] = r(!1), d = n(), f = n(e);
	return f.current = e, t(() => {
		if (clearTimeout(d.current), !a.trim()) {
			c([]);
			return;
		}
		u(!0), d.current = setTimeout(() => {
			(async () => {
				try {
					c(await f.current(a));
				} catch {
					c([]);
				} finally {
					u(!1);
				}
			})();
		}, i);
	}, [a, i]), {
		query: a,
		setQuery: o,
		suggestions: s,
		loading: l
	};
}
//#endregion
//#region src/hooks/useSmartSearch.ts
function d(e, t) {
	let [n, i] = r(""), a = (e, t) => {
		let n = e.toLowerCase(), r = t.toLowerCase();
		if (n.includes(r)) return 1;
		let i = 0;
		for (let e = 0; e < r.length; e++) n.includes(r[e] ?? "") && i++;
		return i / r.length;
	};
	return {
		query: n,
		setQuery: i,
		results: n.trim() ? e.map((e) => ({
			item: e,
			score: Math.max(...t.map((t) => a(String(e[t] ?? ""), n)))
		})).filter((e) => e.score > .5).sort((e, t) => t.score - e.score).map((e) => e.item) : e
	};
}
//#endregion
//#region src/hooks/useImageClassifier.ts
function f(t) {
	let [i, a] = r([]), [o, s] = r(!1), [c, l] = r(null), u = n(t);
	return u.current = t, {
		classify: e(async (e) => {
			s(!0), l(null);
			try {
				let t = e.getContext("2d");
				if (!t) throw Error("[useImageClassifier] Canvas context unavailable");
				let n = t.getImageData(0, 0, e.width, e.height);
				a(await u.current(n));
			} catch (e) {
				l(e);
			} finally {
				s(!1);
			}
		}, []),
		results: i,
		loading: o,
		error: c
	};
}
//#endregion
export { a as useAIStream, u as useAutocomplete, f as useImageClassifier, d as useSmartSearch, s as useSpeechRecognition, l as useSpeechSynthesis };
