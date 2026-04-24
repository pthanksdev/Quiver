import { useState, useEffect } from 'react';

const isClient = typeof window !== 'undefined';

// ─── useGeolocation ───────────────────────────────────────────────────────────
export interface GeoState {
  coords: GeolocationCoordinates | null;
  error: GeolocationPositionError | null;
  loading: boolean;
}
/** Watch GPS coords with accuracy and live updates. */
export function useGeolocation(options?: PositionOptions): GeoState {
  const [state, setState] = useState<GeoState>({ coords: null, error: null, loading: true });
  useEffect(() => {
    if (!isClient || !navigator.geolocation) {
      setState(s => ({ ...s, loading: false, error: { code: 2, message: 'Geolocation not supported', PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 } as GeolocationPositionError }));
      return;
    }
    const id = navigator.geolocation.watchPosition(
      pos => setState({ coords: pos.coords, error: null, loading: false }),
      err => setState(s => ({ ...s, error: err, loading: false })),
      options
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);
  return state;
}
