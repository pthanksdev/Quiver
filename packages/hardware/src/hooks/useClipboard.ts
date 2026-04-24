import { useState, useCallback } from 'react';


// ─── useClipboard (hardware-level) ───────────────────────────────────────────
/** Clipboard API with permission check before read. */
export function useClipboard(): { copy: (text: string) => Promise<void>; paste: () => Promise<string>; copied: boolean } {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);
  const paste = useCallback(async (): Promise<string> => {
    const permission = await navigator.permissions.query({ name: 'clipboard-read' as PermissionName });
    if (permission.state === 'denied') throw new Error('[useClipboard] Clipboard read permission denied');
    return navigator.clipboard.readText();
  }, []);
  return { copy, paste, copied };
}
