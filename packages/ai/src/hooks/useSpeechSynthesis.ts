import { useState, useEffect, useCallback } from 'react';

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}


const isClient = typeof window !== 'undefined';

// ─── useSpeechSynthesis ───────────────────────────────────────────────────────
/**
 * Text-to-speech with voice, rate, and pitch controls.
 */
export function useSpeechSynthesis(): {
  speak: (text: string, options?: { voice?: SpeechSynthesisVoice; rate?: number; pitch?: number }) => void;
  cancel: () => void;
  isSpeaking: boolean;
  voices: SpeechSynthesisVoice[];
  supported: boolean;
} {
  const supported = isClient && 'speechSynthesis' in window;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (!supported) return;
    const load = () => setVoices(speechSynthesis.getVoices());
    load();
    speechSynthesis.onvoiceschanged = load;
  }, [supported]);

  const speak = useCallback((text: string, options: { voice?: SpeechSynthesisVoice; rate?: number; pitch?: number } = {}) => {
    if (!supported) return;
    const utterance = new SpeechSynthesisUtterance(text);
    if (options.voice) utterance.voice = options.voice;
    utterance.rate = options.rate ?? 1;
    utterance.pitch = options.pitch ?? 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    speechSynthesis.speak(utterance);
  }, [supported]);

  const cancel = useCallback(() => { speechSynthesis.cancel(); setIsSpeaking(false); }, []);
  return { speak, cancel, isSpeaking, voices, supported };
}
