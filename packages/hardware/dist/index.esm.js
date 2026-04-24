import { useState as s, useEffect as u, useRef as w, useCallback as a } from "react";
const p = typeof window < "u";
function S(t) {
  const [i, n] = s({ coords: null, error: null, loading: !0 });
  return u(() => {
    if (!p || !navigator.geolocation) {
      n((o) => ({ ...o, loading: !1, error: { code: 2, message: "Geolocation not supported", PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 } }));
      return;
    }
    const e = navigator.geolocation.watchPosition(
      (o) => n({ coords: o.coords, error: null, loading: !1 }),
      (o) => n((r) => ({ ...r, error: o, loading: !1 })),
      t
    );
    return () => navigator.geolocation.clearWatch(e);
  }, []), i;
}
const f = typeof window < "u";
function T() {
  const [t, i] = s({ alpha: null, beta: null, gamma: null }), n = f && "DeviceOrientationEvent" in window;
  return u(() => {
    if (!n) return;
    const e = (o) => i({ alpha: o.alpha, beta: o.beta, gamma: o.gamma });
    return window.addEventListener("deviceorientation", e), () => window.removeEventListener("deviceorientation", e);
  }, [n]), { ...t, supported: n };
}
const v = typeof window < "u";
function I() {
  const [t, i] = s({ acceleration: null, rotationRate: null }), n = v && "DeviceMotionEvent" in window;
  return u(() => {
    if (!n) return;
    const e = (o) => i({ acceleration: o.acceleration, rotationRate: o.rotationRate });
    return window.addEventListener("devicemotion", e), () => window.removeEventListener("devicemotion", e);
  }, [n]), { ...t, supported: n };
}
const g = typeof window < "u";
function $() {
  const [t, i] = s(null);
  return u(() => {
    !g || !("getBattery" in navigator) || navigator.getBattery().then((n) => {
      const e = () => i({ level: n.level, charging: n.charging, chargingTime: n.chargingTime, dischargingTime: n.dischargingTime });
      e(), n.addEventListener("chargingchange", e), n.addEventListener("levelchange", e);
    });
  }, []), t;
}
const l = typeof window < "u";
function F() {
  const t = () => {
    const e = navigator.connection;
    return { type: (e == null ? void 0 : e.type) ?? "unknown", effectiveType: (e == null ? void 0 : e.effectiveType) ?? "unknown", downlink: (e == null ? void 0 : e.downlink) ?? 0, rtt: (e == null ? void 0 : e.rtt) ?? 0, online: navigator.onLine };
  }, [i, n] = s(l ? t() : { type: "unknown", effectiveType: "unknown", downlink: 0, rtt: 0, online: !0 });
  return u(() => {
    if (!l) return;
    const e = () => n(t());
    return window.addEventListener("online", e), window.addEventListener("offline", e), () => {
      window.removeEventListener("online", e), window.removeEventListener("offline", e);
    };
  }, []), i;
}
const h = typeof window < "u";
function A() {
  const [t, i] = s(!1), n = w(null), e = h && "wakeLock" in navigator, o = a(async () => {
    e && (n.current = await navigator.wakeLock.request("screen"), i(!0), n.current.onrelease = () => i(!1));
  }, [e]), r = a(async () => {
    var c;
    await ((c = n.current) == null ? void 0 : c.release()), i(!1);
  }, []);
  return { request: o, release: r, active: t, supported: e };
}
const m = typeof window < "u";
function O() {
  const t = m && "vibrate" in navigator;
  return { vibrate: a((n) => {
    t && navigator.vibrate(n);
  }, [t]), supported: t };
}
const y = typeof window < "u";
function q(t = 0) {
  const [i, n] = s(null), e = y && "getGamepads" in navigator;
  return u(() => {
    if (!e) return;
    let o;
    const r = () => {
      n(navigator.getGamepads()[t] ?? null), o = requestAnimationFrame(r);
    };
    return o = requestAnimationFrame(r), () => cancelAnimationFrame(o);
  }, [t, e]), { gamepad: i, supported: e };
}
const E = typeof window < "u";
function B() {
  const [t, i] = s(null), n = E && "bluetooth" in navigator;
  return { request: a(async (o) => {
    if (!n) throw new Error("[useWebBluetooth] Bluetooth not supported");
    const r = await navigator.bluetooth.requestDevice(o);
    return i(r), r;
  }, [n]), device: t, supported: n };
}
const k = typeof window < "u";
function G() {
  const t = k && "share" in navigator;
  return { share: a(async (n) => {
    if (!t) throw new Error("[useShare] Web Share API not supported");
    if (n.url && !/^https?:\/\//i.test(n.url)) throw new Error("[useShare] Share URL must be http/https");
    await navigator.share(n);
  }, [t]), supported: t };
}
function M() {
  const [t, i] = s(!1), n = a(async (o) => {
    await navigator.clipboard.writeText(o), i(!0), setTimeout(() => i(!1), 2e3);
  }, []), e = a(async () => {
    if ((await navigator.permissions.query({ name: "clipboard-read" })).state === "denied") throw new Error("[useClipboard] Clipboard read permission denied");
    return navigator.clipboard.readText();
  }, []);
  return { copy: n, paste: e, copied: t };
}
const b = typeof window < "u";
function P() {
  const t = b && "EyeDropper" in window;
  return { pick: a(async () => {
    if (!t) return null;
    const n = new window.EyeDropper(), { sRGBHex: e } = await n.open();
    return e;
  }, [t]), supported: t };
}
const C = typeof window < "u";
function R() {
  const t = C && "showOpenFilePicker" in window, i = a(async () => {
    if (!t) return null;
    const e = await window.showOpenFilePicker();
    if (!e || e.length === 0) return null;
    const o = await e[0].getFile();
    return { name: o.name, content: await o.text() };
  }, [t]), n = a(async (e, o) => {
    if (!t) throw new Error("[useFileSystemAccess] Not supported");
    const r = o ? { suggestedName: o } : void 0, d = await (await window.showSaveFilePicker(r)).createWritable();
    await d.write(e), await d.close();
  }, [t]);
  return { openFile: i, saveFile: n, supported: t };
}
const L = typeof window < "u";
function W() {
  var r;
  const [t, i] = s(null), n = L && !!((r = navigator.mediaDevices) != null && r.getDisplayMedia), e = a(async () => {
    var d;
    const c = await navigator.mediaDevices.getDisplayMedia({ video: !0 });
    i(c), (d = c.getTracks()[0]) == null || d.addEventListener("ended", () => i(null));
  }, []), o = a(() => {
    t == null || t.getTracks().forEach((c) => c.stop()), i(null);
  }, [t]);
  return { start: e, stop: o, stream: t, supported: n };
}
export {
  $ as useBattery,
  M as useClipboard,
  I as useDeviceMotion,
  T as useDeviceOrientation,
  P as useEyeDropper,
  R as useFileSystemAccess,
  q as useGamepad,
  S as useGeolocation,
  F as useNetworkInfo,
  W as useScreenCapture,
  G as useShare,
  O as useVibration,
  A as useWakeLock,
  B as useWebBluetooth
};
