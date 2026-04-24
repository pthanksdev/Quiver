import { useCallback as s, useState as y, useEffect as p, useRef as l } from "react";
function f() {
  const e = s(async () => crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, !1, ["encrypt", "decrypt"]), []), r = s(async (t, c) => {
    const o = crypto.getRandomValues(new Uint8Array(12)), i = new TextEncoder().encode(t), a = await crypto.subtle.encrypt({ name: "AES-GCM", iv: o }, c, i);
    return {
      iv: btoa(String.fromCharCode(...o)),
      ciphertext: btoa(String.fromCharCode(...new Uint8Array(a)))
    };
  }, []), n = s(async (t, c, o) => {
    const i = Uint8Array.from(atob(t), (d) => d.charCodeAt(0)), a = Uint8Array.from(atob(c), (d) => d.charCodeAt(0)), u = await crypto.subtle.decrypt({ name: "AES-GCM", iv: i }, o, a);
    return new TextDecoder().decode(u);
  }, []);
  return { generateKey: e, encrypt: r, decrypt: n };
}
function A() {
  const e = s(async (t) => {
    const c = new TextEncoder().encode(t);
    return crypto.subtle.importKey("raw", c, { name: "HMAC", hash: "SHA-256" }, !1, ["sign", "verify"]);
  }, []), r = s(async (t, c) => {
    const o = new TextEncoder().encode(t), i = await crypto.subtle.sign("HMAC", c, o);
    return btoa(String.fromCharCode(...new Uint8Array(i)));
  }, []), n = s(async (t, c, o) => {
    const i = Uint8Array.from(atob(c), (u) => u.charCodeAt(0)), a = new TextEncoder().encode(t);
    return crypto.subtle.verify("HMAC", o, i, a);
  }, []);
  return { sign: r, verify: n, importKey: e };
}
function b() {
  const [e, r] = y(null), n = s(async () => {
    const o = await crypto.subtle.generateKey(
      { name: "RSA-OAEP", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
      !1,
      ["encrypt", "decrypt"]
    );
    r(o);
  }, []), t = s(async (o) => {
    if (!e) throw new Error("[useKeyPair] Key pair not generated");
    const i = new TextEncoder().encode(o), a = await crypto.subtle.encrypt({ name: "RSA-OAEP" }, e.publicKey, i);
    return btoa(String.fromCharCode(...new Uint8Array(a)));
  }, [e]), c = s(async (o) => {
    if (!e) throw new Error("[useKeyPair] Key pair not generated");
    const i = Uint8Array.from(atob(o), (u) => u.charCodeAt(0)), a = await crypto.subtle.decrypt({ name: "RSA-OAEP" }, e.privateKey, i);
    return new TextDecoder().decode(a);
  }, [e]);
  return { keyPair: e, generate: n, encrypt: t, decrypt: c };
}
const g = typeof window < "u";
function C() {
  const e = g && !!window.PublicKeyCredential, r = s(async (t) => {
    if (!e) throw new Error("[useWebAuthn] WebAuthn not supported");
    return navigator.credentials.create({ publicKey: t });
  }, [e]), n = s(async (t) => {
    if (!e) throw new Error("[useWebAuthn] WebAuthn not supported");
    return navigator.credentials.get({ publicKey: t });
  }, [e]);
  return { register: r, authenticate: n, isSupported: e };
}
function S(e) {
  const { encrypt: r, decrypt: n } = f(), t = s(async (o, i) => {
    const { iv: a, ciphertext: u } = await r(o, i);
    localStorage.setItem(e, JSON.stringify({ iv: a, ciphertext: u }));
  }, [r, e]);
  return { secureGet: s(async (o) => {
    const i = localStorage.getItem(e);
    if (!i) return null;
    const { iv: a, ciphertext: u } = JSON.parse(i);
    return n(a, u, o);
  }, [n, e]), secureSet: t };
}
function v(e) {
  const [r, n] = y(null), t = s(async () => {
    if (!navigator.permissions) return;
    const c = await navigator.permissions.query({ name: e });
    n(c.state), c.onchange = () => n(c.state);
  }, [e]);
  return p(() => {
    t();
  }, [t]), { state: r, query: t };
}
function E() {
  const e = () => btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))), [r, n] = y(e), t = s(() => n(e()), []);
  return { token: r, rotate: t };
}
function x(e, r, n) {
  const t = l([]), [c, o] = y(!1);
  return { limited: s((...a) => {
    const u = performance.now();
    if (t.current = t.current.filter((d) => u - d < n), t.current.length >= r) {
      o(!0);
      return;
    }
    t.current.push(u), o(!1), e(...a);
  }, [e, r, n]), isBlocked: c };
}
const w = typeof window < "u";
function K() {
  const [e, r] = y(null);
  return p(() => {
    if (!w) return;
    const n = [
      navigator.language,
      `${screen.width}x${screen.height}`,
      String(navigator.hardwareConcurrency),
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      String(navigator.deviceMemory ?? "unknown"),
      navigator.platform
    ].join("|");
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(n)).then((t) => {
      r(Array.from(new Uint8Array(t)).map((c) => c.toString(16).padStart(2, "0")).join(""));
    });
  }, []), e;
}
const h = typeof window < "u";
function P(e) {
  const r = l(e);
  r.current = e, p(() => {
    if (!h) return;
    const n = (t) => r.current(t);
    return document.addEventListener("securitypolicyviolation", n), () => document.removeEventListener("securitypolicyviolation", n);
  }, []);
}
export {
  P as useCSPViolation,
  E as useCSRFToken,
  K as useFingerprint,
  A as useHMAC,
  b as useKeyPair,
  v as usePermission,
  x as useRateLimit,
  S as useSecureStorage,
  C as useWebAuthn,
  f as useWebCrypto
};
