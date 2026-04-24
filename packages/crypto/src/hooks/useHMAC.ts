import { useCallback } from 'react';


// ─── useHMAC ─────────────────────────────────────────────────────────────────
/** Sign and verify data with HMAC-SHA-256. */
export function useHMAC(): {
  sign: (data: string, key: CryptoKey) => Promise<string>;
  verify: (data: string, signature: string, key: CryptoKey) => Promise<boolean>;
  importKey: (secret: string) => Promise<CryptoKey>;
} {
  const importKey = useCallback(async (secret: string): Promise<CryptoKey> => {
    const encoded = new TextEncoder().encode(secret);
    return crypto.subtle.importKey('raw', encoded, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
  }, []);

  const sign = useCallback(async (data: string, key: CryptoKey): Promise<string> => {
    const encoded = new TextEncoder().encode(data);
    const sig = await crypto.subtle.sign('HMAC', key, encoded);
    return btoa(String.fromCharCode(...new Uint8Array(sig)));
  }, []);

  const verify = useCallback(async (data: string, signatureB64: string, key: CryptoKey): Promise<boolean> => {
    const sig = Uint8Array.from(atob(signatureB64), c => c.charCodeAt(0));
    const encoded = new TextEncoder().encode(data);
    return crypto.subtle.verify('HMAC', key, sig, encoded);
  }, []);

  return { sign, verify, importKey };
}
