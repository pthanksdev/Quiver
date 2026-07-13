import { useCallback as e, useEffect as t, useRef as n, useState as r } from "react";
//#region src/hooks/useMediaQuery.ts
var i = typeof window < "u";
function a(e) {
	let [n, a] = r(() => i ? window.matchMedia(e).matches : !1);
	return t(() => {
		if (!i) return;
		let t = window.matchMedia(e);
		a(t.matches);
		let n = (e) => a(e.matches);
		return t.addEventListener("change", n), () => t.removeEventListener("change", n);
	}, [e]), n;
}
//#endregion
//#region src/hooks/useIntersectionObserver.ts
function o(e) {
	let i = n(null), [a, o] = r(null);
	return t(() => {
		if (!i.current) return;
		let t = new IntersectionObserver(([e]) => o(e ?? null), e);
		return t.observe(i.current), () => t.disconnect();
	}, [e]), {
		ref: i,
		isVisible: a?.isIntersecting ?? !1,
		entry: a
	};
}
//#endregion
//#region src/hooks/useResizeObserver.ts
function s() {
	let e = n(null), [i, a] = r({
		width: 0,
		height: 0
	});
	return t(() => {
		if (!e.current) return;
		let t = new ResizeObserver(([e]) => {
			e && a({
				width: e.contentRect.width,
				height: e.contentRect.height
			});
		});
		return t.observe(e.current), () => t.disconnect();
	}, []), {
		ref: e,
		...i
	};
}
//#endregion
//#region src/hooks/useEventListener.ts
var c = typeof window < "u";
function l(e, r, i = c ? window : null) {
	let a = n(r);
	a.current = r, t(() => {
		if (!i) return;
		let t = (e) => a.current(e);
		return i.addEventListener(e, t), () => i.removeEventListener(e, t);
	}, [e, i]);
}
//#endregion
//#region src/hooks/useOnClickOutside.ts
function u(e) {
	let r = n(null), i = n(e);
	return i.current = e, t(() => {
		let e = (e) => {
			!r.current || r.current.contains(e.target) || i.current(e);
		};
		return document.addEventListener("mousedown", e), document.addEventListener("touchstart", e), () => {
			document.removeEventListener("mousedown", e), document.removeEventListener("touchstart", e);
		};
	}, []), r;
}
//#endregion
//#region src/hooks/useKeyPress.ts
function d(e) {
	let [n, i] = r(!1);
	return t(() => {
		let t = (t) => {
			t.key === e && i(!0);
		}, n = (t) => {
			t.key === e && i(!1);
		};
		return window.addEventListener("keydown", t), window.addEventListener("keyup", n), () => {
			window.removeEventListener("keydown", t), window.removeEventListener("keyup", n);
		};
	}, [e]), n;
}
//#endregion
//#region src/hooks/useHotkey.ts
function f(e, r) {
	let i = n(r);
	i.current = r, t(() => {
		let t = e.toLowerCase().split("+").map((e) => e.trim()), n = t.find((e) => ![
			"ctrl",
			"shift",
			"alt",
			"meta"
		].includes(e)) ?? "", r = (e) => {
			let r = !t.includes("ctrl") || e.ctrlKey || e.metaKey, a = !t.includes("shift") || e.shiftKey, o = !t.includes("alt") || e.altKey;
			e.key.toLowerCase() === n && r && a && o && (e.preventDefault(), i.current());
		};
		return window.addEventListener("keydown", r), () => window.removeEventListener("keydown", r);
	}, [e]);
}
//#endregion
//#region src/hooks/useScrollPosition.ts
function p() {
	let [e, n] = r({
		x: 0,
		y: 0
	});
	return t(() => {
		let e = () => n({
			x: window.scrollX,
			y: window.scrollY
		});
		return window.addEventListener("scroll", e, { passive: !0 }), () => window.removeEventListener("scroll", e);
	}, []), e;
}
//#endregion
//#region src/hooks/useScrollProgress.ts
function m() {
	let [e, n] = r(0);
	return t(() => {
		let e = () => {
			let { scrollTop: e, scrollHeight: t, clientHeight: r } = document.documentElement;
			n(t - r > 0 ? e / (t - r) * 100 : 0);
		};
		return window.addEventListener("scroll", e, { passive: !0 }), () => window.removeEventListener("scroll", e);
	}, []), e;
}
//#endregion
//#region src/hooks/useTextSelection.ts
function h() {
	let [e, n] = r("");
	return t(() => {
		let e = () => n(window.getSelection()?.toString() ?? "");
		return document.addEventListener("selectionchange", e), () => document.removeEventListener("selectionchange", e);
	}, []), e;
}
//#endregion
//#region src/hooks/useMutationObserver.ts
function g(e, r) {
	let i = n(null), a = n(e);
	return a.current = e, t(() => {
		if (!i.current) return;
		let e = new MutationObserver((...e) => a.current(...e));
		return e.observe(i.current, r), () => e.disconnect();
	}, [r]), i;
}
//#endregion
//#region src/hooks/useParallax.ts
function _(e = .5) {
	let i = n(null), [a, o] = r(0);
	return t(() => {
		let t = () => {
			if (!i.current) return;
			let t = i.current.getBoundingClientRect();
			o((window.scrollY - t.top) * e);
		};
		return window.addEventListener("scroll", t, { passive: !0 }), () => window.removeEventListener("scroll", t);
	}, [e]), {
		ref: i,
		offsetY: a
	};
}
//#endregion
//#region src/hooks/useLongPress.ts
function v(t, r = 500) {
	let i = n(), a = n(t);
	a.current = t;
	let o = e(() => {
		i.current = setTimeout(() => a.current(), r);
	}, [r]), s = e(() => clearTimeout(i.current), []);
	return {
		onMouseDown: o,
		onMouseUp: s,
		onTouchStart: o,
		onTouchEnd: s
	};
}
//#endregion
//#region src/hooks/usePointer.ts
function y() {
	let [e, n] = r({
		x: 0,
		y: 0,
		pressure: 0,
		pointerType: ""
	});
	return t(() => {
		let e = (e) => n({
			x: e.clientX,
			y: e.clientY,
			pressure: e.pressure,
			pointerType: e.pointerType
		});
		return window.addEventListener("pointermove", e), () => window.removeEventListener("pointermove", e);
	}, []), e;
}
//#endregion
//#region src/hooks/useFullscreen.ts
var b = typeof window < "u";
function x() {
	let [n, i] = r(!1), a = b && !!document.documentElement.requestFullscreen;
	return t(() => {
		let e = () => i(!!document.fullscreenElement);
		return document.addEventListener("fullscreenchange", e), () => document.removeEventListener("fullscreenchange", e);
	}, []), {
		isFullscreen: n,
		request: e(async (e) => {
			await (e ?? document.documentElement).requestFullscreen();
		}, []),
		exit: e(async () => {
			document.fullscreenElement && await document.exitFullscreen();
		}, []),
		supported: a
	};
}
//#endregion
//#region src/hooks/useSticky.ts
function S() {
	let e = n(null), [i, a] = r(!1);
	return t(() => {
		if (!e.current) return;
		let t = new IntersectionObserver(([e]) => a((e?.intersectionRatio ?? 1) < 1), {
			threshold: [1],
			rootMargin: "-1px 0px 0px 0px"
		});
		return t.observe(e.current), () => t.disconnect();
	}, []), {
		ref: e,
		isSticky: i
	};
}
//#endregion
//#region src/hooks/useContextMenu.ts
function C() {
	let [e, i] = r({
		show: !1,
		x: 0,
		y: 0
	}), a = n(null);
	return t(() => {
		let e = a.current;
		if (!e) return;
		let t = (e) => {
			e.preventDefault(), i({
				show: !0,
				x: e.clientX,
				y: e.clientY
			});
		}, n = () => i((e) => ({
			...e,
			show: !1
		}));
		return e.addEventListener("contextmenu", t), document.addEventListener("click", n), () => {
			e.removeEventListener("contextmenu", t), document.removeEventListener("click", n);
		};
	}, []), {
		...e,
		ref: a,
		close: () => i((e) => ({
			...e,
			show: !1
		}))
	};
}
//#endregion
export { C as useContextMenu, l as useEventListener, x as useFullscreen, f as useHotkey, o as useIntersectionObserver, d as useKeyPress, v as useLongPress, a as useMediaQuery, g as useMutationObserver, u as useOnClickOutside, _ as useParallax, y as usePointer, s as useResizeObserver, p as useScrollPosition, m as useScrollProgress, S as useSticky, h as useTextSelection };
