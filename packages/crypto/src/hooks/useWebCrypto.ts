import { useCallback } from 'react';


// ─── useWebCrypto ─────────────────────────────────────────────────────────────
/**
 * Encrypt / decrypt data using AES-256-GCM via SubtleCrypto.
 * Keys are non-exportable. No eval, no base64 eval tricks.
 */
export function useWebCrypto(): {
  encrypt: (plaintext: string, key: CryptoKey) => Promise<{ iv: string; ciphertext: string }>;
  decrypt: (iv: string, ciphertext: string, key: CryptoKey) => Promise<string>;
  generateKey: () => Promise<CryptoKey>;
} {
  const generateKey = useCallback(async (): Promise<CryptoKey> => {
    return crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  }, []);

  const encrypt = useCallback(async (plaintext: string, key: CryptoKey) => {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(plaintext);
    const cipherbuffer = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
    return {
      iv: btoa(String.fromCharCode(...iv)),
      ciphertext: btoa(String.fromCharCode(...new Uint8Array(cipherbuffer))),
    };
  }, []);

  const decrypt = useCallback(async (ivB64: string, ciphertextB64: string, key: CryptoKey): Promise<string> => {
    const iv = Uint8Array.from(atob(ivB64), c => c.charCodeAt(0));
    const ciphertext = Uint8Array.from(atob(ciphertextB64), c => c.charCodeAt(0));
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
    return new TextDecoder().decode(decrypted);
  }, []);

  return { generateKey, encrypt, decrypt };
}
