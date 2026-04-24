import { useCallback } from 'react';
import { useWebCrypto } from './useWebCrypto';


// ─── useSecureStorage ─────────────────────────────────────────────────────────
/**
 * localStorage backed by AES-256-GCM encryption. Values are never stored as plaintext.
 */
export function useSecureStorage(storageKey: string): {
  secureGet: (key: CryptoKey) => Promise<string | null>;
  secureSet: (value: string, key: CryptoKey) => Promise<void>;
} {
  const { encrypt, decrypt } = useWebCrypto();
  const secureSet = useCallback(async (value: string, key: CryptoKey) => {
    const { iv, ciphertext } = await encrypt(value, key);
    localStorage.setItem(storageKey, JSON.stringify({ iv, ciphertext }));
  }, [encrypt, storageKey]);
  const secureGet = useCallback(async (key: CryptoKey): Promise<string | null> => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    const { iv, ciphertext } = JSON.parse(raw) as { iv: string; ciphertext: string };
    return decrypt(iv, ciphertext, key);
  }, [decrypt, storageKey]);
  return { secureGet, secureSet };
}
