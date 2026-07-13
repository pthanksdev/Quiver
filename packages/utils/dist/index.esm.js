import { useCallback as e, useEffect as t, useRef as n, useState as r } from "react";
//#region src/hooks/useDebounce.ts
function i(e, n) {
	let [i, a] = r(e);
	return t(() => {
		let t = setTimeout(() => a(e), n);
		return () => clearTimeout(t);
	}, [e, n]), i;
}
//#endregion
//#region src/hooks/useThrottle.ts
function a(e, i) {
	let [a, o] = r(e), s = n(Date.now());
	return t(() => {
		let t = Date.now() - s.current;
		if (t >= i) o(e), s.current = Date.now();
		else {
			let n = setTimeout(() => {
				o(e), s.current = Date.now();
			}, i - t);
			return () => clearTimeout(n);
		}
	}, [e, i]), a;
}
//#endregion
//#region src/hooks/useInterval.ts
function o(e, r) {
	let i = n(e);
	i.current = e, t(() => {
		if (r === null) return;
		let e = setInterval(() => i.current(), r);
		return () => clearInterval(e);
	}, [r]);
}
//#endregion
//#region src/hooks/useTimeout.ts
function s(r, i) {
	let a = n(r);
	a.current = r;
	let o = n(void 0), s = e(() => clearTimeout(o.current), []), c = e(() => {
		s(), o.current = setTimeout(() => a.current(), i);
	}, [i, s]);
	return t(() => (c(), s), [c, s]), {
		reset: c,
		clear: s
	};
}
//#endregion
//#region src/hooks/useLatest.ts
function c(e) {
	let t = n(e);
	return t.current = e, t;
}
//#endregion
//#region src/hooks/useIdleCallback.ts
function l(e, r) {
	let i = n(e);
	i.current = e, t(() => {
		if (typeof window > "u") return;
		if (!("requestIdleCallback" in window)) {
			i.current({
				didTimeout: !0,
				timeRemaining: () => 0
			});
			return;
		}
		let e = requestIdleCallback((e) => i.current(e), r);
		return () => cancelIdleCallback(e);
	}, []);
}
//#endregion
//#region src/hooks/useTypewriter.ts
function u(e, n = 50) {
	let [i, a] = r("");
	return t(() => {
		a("");
		let t = 0, r = setInterval(() => {
			a(e.slice(0, ++t)), t >= e.length && clearInterval(r);
		}, n);
		return () => clearInterval(r);
	}, [e, n]), i;
}
//#endregion
//#region src/hooks/useCountdown.ts
function d(n) {
	let i = e(() => Math.max(0, n.getTime() - Date.now()), [n]), [a, o] = r(i);
	t(() => {
		let e = setInterval(() => o(i()), 1e3);
		return () => clearInterval(e);
	}, [i]);
	let s = Math.floor(a / 1e3);
	return {
		days: Math.floor(s / 86400),
		hours: Math.floor(s % 86400 / 3600),
		minutes: Math.floor(s % 3600 / 60),
		seconds: s % 60,
		isFinished: a === 0
	};
}
//#endregion
//#region src/hooks/useStopwatch.ts
function f() {
	let [t, i] = r(0), [a, o] = r(!1), s = n(0), c = n(0), l = n(0);
	l.current = t;
	let u = e(() => {
		i(performance.now() - s.current), c.current = requestAnimationFrame(u);
	}, []);
	return {
		elapsedMs: t,
		isRunning: a,
		start: e(() => {
			s.current = performance.now() - l.current, o(!0), c.current = requestAnimationFrame(u);
		}, [u]),
		stop: e(() => {
			cancelAnimationFrame(c.current), o(!1);
		}, []),
		reset: e(() => {
			cancelAnimationFrame(c.current), o(!1), i(0);
		}, [])
	};
}
//#endregion
//#region src/hooks/useTimeAgo.ts
function p(n) {
	let i = e(() => {
		let e = Math.floor((Date.now() - new Date(n).getTime()) / 1e3);
		return e < 60 ? "just now" : e < 3600 ? `${Math.floor(e / 60)}m ago` : e < 86400 ? `${Math.floor(e / 3600)}h ago` : `${Math.floor(e / 86400)}d ago`;
	}, [n]), [a, o] = r(i);
	return t(() => {
		let e = setInterval(() => o(i()), 6e4);
		return () => clearInterval(e);
	}, [n, i]), a;
}
//#endregion
//#region src/hooks/useDeepCompareEffect.ts
function m(e, t) {
	if (e === t) return !0;
	if (typeof e != typeof t || e === null || t === null) return !1;
	if (typeof e == "object") {
		let n = Object.keys(e), r = Object.keys(t);
		return n.length === r.length && n.every((n) => m(e[n], t[n]));
	}
	return !1;
}
function h(e, r) {
	let i = n([]);
	m(i.current, r) || (i.current = r), t(e, i.current);
}
//#endregion
//#region src/hooks/useRandomId.ts
function g(e = "quiver") {
	return n(`${e}-${typeof crypto < "u" && crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : Math.random().toString(36).slice(2, 9)}`).current;
}
//#endregion
//#region src/hooks/useWhyDidYouUpdate.ts
function _(e, r) {
	let i = n({});
	t(() => {
		if (process.env.NODE_ENV !== "development") return;
		let t = {};
		for (let e of Object.keys(r)) i.current[e] !== r[e] && (t[e] = {
			from: i.current[e],
			to: r[e]
		});
		Object.keys(t).length && console.log(`[useWhyDidYouUpdate] ${e}:`, t), i.current = r;
	});
}
//#endregion
//#region src/hooks/useConstant.ts
function v(e) {
	let t = n(void 0);
	return t.current ||= { value: e() }, t.current.value;
}
//#endregion
export { v as useConstant, d as useCountdown, i as useDebounce, h as useDeepCompareEffect, l as useIdleCallback, o as useInterval, c as useLatest, g as useRandomId, f as useStopwatch, a as useThrottle, p as useTimeAgo, s as useTimeout, u as useTypewriter, _ as useWhyDidYouUpdate };
