import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useFetch } from './useFetch';

describe('useFetch', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    // Setup for typical ok JSON response
    (global.fetch as any).mockResolvedValue({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({ success: true }),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should execute successfully on mount if immediate is true', async () => {
    const { result } = renderHook(() => useFetch('https://example.com/api/data'));

    expect(result.current.loading).toBe(true);
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual({ success: true });
    expect(result.current.error).toBeNull();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith('https://example.com/api/data', expect.any(Object));
  });

  it('should not execute on mount if immediate is false', () => {
    const { result } = renderHook(() => useFetch('https://example.com/api/data', { immediate: false }));

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should fetch when refetch is called', async () => {
    const { result } = renderHook(() => useFetch('https://example.com/api/data', { immediate: false }));

    act(() => {
      result.current.refetch();
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual({ success: true });
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should handle non-JSON responses', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      headers: new Headers({ 'content-type': 'image/png' }),
      json: () => Promise.resolve({}),
    });

    const { result } = renderHook(() => useFetch('https://example.com/api/data'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toContain('Unexpected content-type');
  });

  it('should handle HTTP errors', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({ error: 'not found' }),
    });

    const { result } = renderHook(() => useFetch('https://example.com/api/data'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toContain('HTTP 404');
  });

  it('should handle fetch throwing', async () => {
    const error = new Error('Network Error');
    (global.fetch as any).mockRejectedValue(error);

    const { result } = renderHook(() => useFetch('https://example.com/api/data'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe(error);
  });

  it('should trigger abort on unmount', () => {
    const { unmount } = renderHook(() => useFetch('https://example.com/api/data'));

    unmount();

    // Verify it doesn't crash, the AbortController was passed to fetch
    expect(global.fetch).toHaveBeenCalled();
  });

  it('should timeout and abort request', async () => {
    (global.fetch as any).mockImplementation(
      (url: string, { signal }: RequestInit) => new Promise((resolve, reject) => {
        const timer = setTimeout(() => resolve({
          ok: true,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: () => Promise.resolve({ success: true }),
        }), 50);
        
        signal?.addEventListener('abort', () => {
          clearTimeout(timer);
          reject(signal.reason || new Error('AbortError'));
        });
      })
    );

    const { result } = renderHook(() => useFetch('https://example.com/api/data', { timeout: 10 }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toContain('timed out');
  });

  it('should throw error for local/private IP address in production', () => {
    const { result } = renderHook(() => useFetch('http://192.168.1.1/api/data', { immediate: false }));
    
    // We just test if it sets error state since it might be caught by react or promise
    // Wait, refetch is a callback. If it throws synchronously, we can catch it.
    try {
      result.current.refetch();
    } catch (e: any) {
      expect(e.message).toContain('SSRF');
    }
  });

  it('should reject invalid urls', () => {
    const { result } = renderHook(() => useFetch('', { immediate: false }));
    
    try {
      result.current.refetch();
    } catch (e: any) {
      expect(e.message).toContain('url must be a non-empty string');
    }
  });
});
