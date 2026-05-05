import { useEffect, useRef } from 'react';

// ─── useWhyDidYouUpdate ──────────────────────────────────────────────────────
/**
 * Dev-mode hook that logs which props caused a re-render.
 */
export function useWhyDidYouUpdate(name: string, props: Record<string, unknown>): void {
  const prev = useRef<Record<string, unknown>>({});
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    const changed: Record<string, { from: unknown; to: unknown }> = {};
    for (const key of Object.keys(props)) {
      if (prev.current[key] !== props[key]) changed[key] = { from: prev.current[key], to: props[key] };
    }
    if (Object.keys(changed).length) console.log(`[useWhyDidYouUpdate] ${name}:`, changed);
    prev.current = props;
  });
}
