import { useCallback as e, useEffect as t, useRef as n, useState as r } from "react";
//#region src/hooks/useFocusTrap.ts
function i(e = !0) {
	let r = n(null);
	return t(() => {
		if (!e || !r.current) return;
		let t = r.current, n = () => Array.from(t.querySelectorAll("button,a[href],input,select,textarea,[tabindex]:not([tabindex=\"-1\"])")).filter((e) => !e.hasAttribute("disabled")), i = (e) => {
			if (e.key !== "Tab") return;
			let t = n();
			if (!t.length) {
				e.preventDefault();
				return;
			}
			let r = t[0], i = t[t.length - 1];
			e.shiftKey ? document.activeElement === r && (i.focus(), e.preventDefault()) : document.activeElement === i && (r.focus(), e.preventDefault());
		};
		return t.addEventListener("keydown", i), n()[0]?.focus(), () => t.removeEventListener("keydown", i);
	}, [e]), r;
}
//#endregion
//#region src/hooks/useAnnounce.ts
var a = typeof window < "u";
function o() {
	let r = n(null);
	return t(() => {
		if (!a) return;
		let e = document.createElement("div");
		return e.setAttribute("aria-live", "polite"), e.setAttribute("aria-atomic", "true"), Object.assign(e.style, {
			position: "absolute",
			left: "-9999px",
			width: "1px",
			height: "1px",
			overflow: "hidden"
		}), document.body.appendChild(e), r.current = e, () => {
			document.body.removeChild(e);
		};
	}, []), { announce: e((e, t = "polite") => {
		r.current && (r.current.setAttribute("aria-live", t), r.current.textContent = "", requestAnimationFrame(() => {
			r.current && (r.current.textContent = e);
		}));
	}, []) };
}
//#endregion
//#region src/hooks/useReducedMotion.ts
var s = typeof window < "u";
function c() {
	let [e, n] = r(() => s ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : !1);
	return t(() => {
		if (!s) return;
		let e = window.matchMedia("(prefers-reduced-motion: reduce)"), t = (e) => n(e.matches);
		return e.addEventListener("change", t), () => e.removeEventListener("change", t);
	}, []), e;
}
//#endregion
//#region src/hooks/useForcedColors.ts
var l = typeof window < "u";
function u() {
	let [e, n] = r(() => l ? window.matchMedia("(forced-colors: active)").matches : !1);
	return t(() => {
		if (!l) return;
		let e = window.matchMedia("(forced-colors: active)"), t = (e) => n(e.matches);
		return e.addEventListener("change", t), () => e.removeEventListener("change", t);
	}, []), e;
}
//#endregion
//#region src/hooks/useRovingTabIndex.ts
function d(t) {
	let [n, i] = r(0);
	return {
		activeIndex: n,
		getItemProps: e((e) => ({
			tabIndex: e === n ? 0 : -1,
			onKeyDown: (e) => {
				(e.key === "ArrowRight" || e.key === "ArrowDown") && (e.preventDefault(), i((e) => (e + 1) % t)), (e.key === "ArrowLeft" || e.key === "ArrowUp") && (e.preventDefault(), i((e) => (e - 1 + t) % t)), e.key === "Home" && (e.preventDefault(), i(0)), e.key === "End" && (e.preventDefault(), i(t - 1));
			}
		}), [n, t])
	};
}
//#endregion
//#region src/hooks/useFocusVisible.ts
function f() {
	let [e, i] = r(!1), a = n(!1);
	return t(() => {
		let e = () => {
			a.current = !0;
		}, t = () => {
			a.current = !1;
		};
		return window.addEventListener("keydown", e), window.addEventListener("mousedown", t), () => {
			window.removeEventListener("keydown", e), window.removeEventListener("mousedown", t);
		};
	}, []), {
		focusVisible: e,
		props: {
			onFocus: () => i(a.current),
			onBlur: () => i(!1)
		}
	};
}
//#endregion
//#region src/hooks/useColorContrast.ts
function p(e, t) {
	let n = (e) => {
		let t = e.replace("#", "").match(/.{2}/g).map((e) => parseInt(e, 16) / 255).map((e) => e <= .03928 ? e / 12.92 : ((e + .055) / 1.055) ** 2.4);
		return .2126 * (t[0] ?? 0) + .7152 * (t[1] ?? 0) + .0722 * (t[2] ?? 0);
	}, r = n(e), i = n(t), a = (Math.max(r, i) + .05) / (Math.min(r, i) + .05);
	return {
		ratio: a,
		passesAA: a >= 4.5,
		passesAAA: a >= 7
	};
}
//#endregion
//#region src/hooks/useAriaExpanded.ts
function m(t = !1) {
	let [n, i] = r(t), a = e(() => i((e) => !e), []);
	return {
		expanded: n,
		toggle: a,
		buttonProps: {
			"aria-expanded": n,
			onClick: a
		}
	};
}
//#endregion
//#region src/hooks/useARIALive.ts
function h(r = "polite") {
	let i = n(null), a = e((e) => {
		i.current && (i.current.textContent = "", requestAnimationFrame(() => {
			i.current && (i.current.textContent = e);
		}));
	}, []);
	return t(() => {
		i.current && i.current.setAttribute("aria-live", r);
	}, [r]), {
		ref: i,
		update: a
	};
}
//#endregion
export { h as useARIALive, o as useAnnounce, m as useAriaExpanded, p as useColorContrast, i as useFocusTrap, f as useFocusVisible, u as useForcedColors, c as useReducedMotion, d as useRovingTabIndex };
