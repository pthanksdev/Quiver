import { useCallback } from 'react';

const isClient = typeof window !== 'undefined';

// ─── useWebAuthn ─────────────────────────────────────────────────────────────
/** Passkey/WebAuthn registration and authentication (FIDO2). */
export function useWebAuthn(): {
  register: (options: PublicKeyCredentialCreationOptions) => Promise<PublicKeyCredential | null>;
  authenticate: (options: PublicKeyCredentialRequestOptions) => Promise<PublicKeyCredential | null>;
  isSupported: boolean;
} {
  const isSupported = isClient && !!window.PublicKeyCredential;
  const register = useCallback(async (options: PublicKeyCredentialCreationOptions) => {
    if (!isSupported) throw new Error('[useWebAuthn] WebAuthn not supported');
    return navigator.credentials.create({ publicKey: options }) as Promise<PublicKeyCredential | null>;
  }, [isSupported]);
  const authenticate = useCallback(async (options: PublicKeyCredentialRequestOptions) => {
    if (!isSupported) throw new Error('[useWebAuthn] WebAuthn not supported');
    return navigator.credentials.get({ publicKey: options }) as Promise<PublicKeyCredential | null>;
  }, [isSupported]);
  return { register, authenticate, isSupported };
}
