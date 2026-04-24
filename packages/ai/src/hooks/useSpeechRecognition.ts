import { useState, useEffect, useCallback, useRef } from 'react';

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}


const isClient = typeof window !== 'undefined';

// ─── useSpeechRecognition ─────────────────────────────────────────────────────
export interface UseSpeechRecognitionReturn {
  transcript: string;
  listening: boolean;
  supported: boolean;
  start: () => void;
  stop: () => void;
  error: string | null;
}
/**
 * Live speech-to-text using the Web Speech API.
 */
export function useSpeechRecognition(lang = 'en-US'): UseSpeechRecognitionReturn {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supported = isClient && !!(window.webkitSpeechRecognition || window.SpeechRecognition);
  const recognitionRef = useRef<any>(null);

  const start = useCallback(() => {
    if (!supported) { setError('[useSpeechRecognition] Not supported'); return; }
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (e: any) => setTranscript(Array.from(e.results).map((r: any) => r[0]?.transcript ?? '').join(''));
    recognition.onerror = (e: any) => setError(e.error);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, [lang, supported]);

  const stop = useCallback(() => { recognitionRef.current?.stop(); setListening(false); }, []);
  useEffect(() => () => recognitionRef.current?.stop(), []);
  return { transcript, listening, supported, start, stop, error };
}
