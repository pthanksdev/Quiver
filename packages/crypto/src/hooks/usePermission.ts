import { useState, useEffect, useCallback } from 'react';


// ─── usePermissions ────────────────────────────────────────────────────────────
/**
 * Query and request browser permissions (camera, microphone, notifications, geolocation).
 */
export function usePermission(name: PermissionName): {
  state: PermissionState | null;
  query: () => Promise<void>;
} {
  const [state, setState] = useState<PermissionState | null>(null);
  const query = useCallback(async () => {
    if (!navigator.permissions) return;
    const result = await navigator.permissions.query({ name });
    setState(result.state);
    result.onchange = () => setState(result.state);
  }, [name]);
  useEffect(() => { void query(); }, [query]);
  return { state, query };
}
