import { useState, useCallback } from 'react';


// ─── useKeyPair ───────────────────────────────────────────────────────────────
/** Generate RSA-OAEP key pairs for asymmetric encryption. */
export function useKeyPair(): {
  keyPair: CryptoKeyPair | null;
  generate: () => Promise<void>;
  encrypt: (plaintext: string) => Promise<string>;
  decrypt: (ciphertextB64: string) => Promise<string>;
} {
  const [keyPair, setKeyPair] = useState<CryptoKeyPair | null>(null);

  const generate = useCallback(async () => {
    const pair = await crypto.subtle.generateKey(
      { name: 'RSA-OAEP', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
      false, ['encrypt', 'decrypt']
    );
    setKeyPair(pair);
  }, []);

  const encrypt = useCallback(async (plaintext: string): Promise<string> => {
    if (!keyPair) throw new Error('[useKeyPair] Key pair not generated');
    const encoded = new TextEncoder().encode(plaintext);
    const ciphertext = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, keyPair.publicKey, encoded);
    return btoa(String.fromCharCode(...new Uint8Array(ciphertext)));
  }, [keyPair]);

  const decrypt = useCallback(async (ciphertextB64: string): Promise<string> => {
    if (!keyPair) throw new Error('[useKeyPair] Key pair not generated');
    const ciphertext = Uint8Array.from(atob(ciphertextB64), c => c.charCodeAt(0));
    const decrypted = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, keyPair.privateKey, ciphertext);
    return new TextDecoder().decode(decrypted);
  }, [keyPair]);

  return { keyPair, generate, encrypt, decrypt };
}
