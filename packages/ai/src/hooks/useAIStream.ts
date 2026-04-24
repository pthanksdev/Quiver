import { useState, useCallback, useRef } from 'react';

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}


const ALLOWED_PROTOCOLS = /^https?:\/\//i;

// ─── useAIStream ──────────────────────────────────────────────────────────────
export interface UseAIStreamOptions {
  model?: string;
  apiKey: string;
  baseUrl?: string;
  systemPrompt?: string;
}
export interface UseAIStreamReturn {
  stream: (userMessage: string) => Promise<void>;
  text: string;
  loading: boolean;
  error: Error | null;
  abort: () => void;
  reset: () => void;
}
/**
 * Stream text from any OpenAI-compatible /chat/completions SSE endpoint.
 * @throws If baseUrl is not http/https (SSRF protection)
 */
export function useAIStream(options: UseAIStreamOptions): UseAIStreamReturn {
  const { apiKey, model = 'gpt-4o', baseUrl = 'https://api.openai.com', systemPrompt } = options;
  if (!ALLOWED_PROTOCOLS.test(baseUrl)) throw new Error('[useAIStream] Only http/https baseUrl allowed');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const abort = useCallback(() => { abortRef.current?.abort(); setLoading(false); }, []);
  const reset = useCallback(() => { setText(''); setError(null); }, []);

  const stream = useCallback(async (userMessage: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setText('');
    setLoading(true);
    setError(null);
    try {
      const messages = [
        ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
        { role: 'user', content: userMessage },
      ];
      const res = await fetch(`${baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({ model, messages, stream: true }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) throw new Error(`[useAIStream] HTTP ${res.status}`);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      /* eslint-disable-next-line no-constant-condition */
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value).split('\n').filter(l => l.startsWith('data: '));
        for (const line of lines) {
          const json = line.slice(6);
          if (json === '[DONE]') break;
          try {
            const delta = (JSON.parse(json) as { choices: [{ delta: { content?: string } }] }).choices[0]?.delta.content ?? '';
            setText(prev => prev + delta);
          } catch { /* partial chunk, skip */ }
        }
      }
    } catch (e) {
      if ((e as Error).name !== 'AbortError') setError(e as Error);
    } finally { setLoading(false); }
  }, [apiKey, baseUrl, model, systemPrompt]);

  return { stream, text, loading, error, abort, reset };
}
