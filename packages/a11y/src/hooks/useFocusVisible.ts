import { useState, useEffect, useRef } from 'react';


// ─── useFocusVisible ──────────────────────────────────────────────────────────
/** Show a focus ring only when navigating by keyboard (not mouse/touch). */
export function useFocusVisible(): { focusVisible: boolean; props: { onFocus: () => void; onBlur: () => void } } {
  const [focusVisible, setFocusVisible] = useState(false);
  const keyboardRef = useRef(false);
  useEffect(() => {
    const onKeyDown = () => { keyboardRef.current = true; };
    const onMouseDown = () => { keyboardRef.current = false; };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('mousedown', onMouseDown);
    return () => { window.removeEventListener('keydown', onKeyDown); window.removeEventListener('mousedown', onMouseDown); };
  }, []);
  const props = { onFocus: () => setFocusVisible(keyboardRef.current), onBlur: () => setFocusVisible(false) };
  return { focusVisible, props };
}
