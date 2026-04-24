import { useState, useCallback, useRef } from 'react';

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}



// ─── useImageClassifier (stub with on-device model placeholder) ───────────────
/**
 * Classify an image element using a pluggable inference function.
 * Use your own model (ONNX, TF.js, etc.) by passing a classify fn.
 */
export function useImageClassifier(
  classify: (imageData: ImageData) => Promise<{ label: string; confidence: number }[]>
): {
  classify: (canvas: HTMLCanvasElement) => Promise<void>;
  results: { label: string; confidence: number }[];
  loading: boolean;
  error: Error | null;
} {
  const [results, setResults] = useState<{ label: string; confidence: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const classifyFnRef = useRef(classify);
  classifyFnRef.current = classify;

  const run = useCallback(async (canvas: HTMLCanvasElement) => {
    setLoading(true); setError(null);
    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('[useImageClassifier] Canvas context unavailable');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setResults(await classifyFnRef.current(imageData));
    } catch (e) { setError(e as Error); }
    finally { setLoading(false); }
  }, []);

  return { classify: run, results, loading, error };
}
