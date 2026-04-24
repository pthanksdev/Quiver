import { useCallback } from 'react';

const isClient = typeof window !== 'undefined';

// ─── useFileSystemAccess ──────────────────────────────────────────────────────
/** Read/write files via the File System Access API. */
export function useFileSystemAccess(): {
  openFile: () => Promise<{ name: string; content: string } | null>;
  saveFile: (content: string, suggestedName?: string) => Promise<void>;
  supported: boolean;
} {
  const supported = isClient && 'showOpenFilePicker' in window;
  const openFile = useCallback(async () => {
    if (!supported) return null;
    const handles = await (window as any).showOpenFilePicker();
    if (!handles || handles.length === 0) return null;
    const file = await handles[0].getFile();
    return { name: file.name, content: await file.text() };
  }, [supported]);
  const saveFile = useCallback(async (content: string, suggestedName?: string) => {
    if (!supported) throw new Error('[useFileSystemAccess] Not supported');
    const opts = suggestedName ? { suggestedName } : undefined;
    const handle = await (window as any).showSaveFilePicker(opts);
    const writable = await handle.createWritable();
    await writable.write(content);
    await writable.close();
  }, [supported]);
  return { openFile, saveFile, supported };
}
