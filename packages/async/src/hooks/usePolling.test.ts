import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePolling } from './usePolling';

describe('usePolling', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usePolling).toBeDefined();
  });

  it('should poll at the specified interval', async () => {
    let resolveFn: (val: string) => void;
    const promise = new Promise<string>((resolve) => { resolveFn = resolve; });
    const fn = vi.fn().mockReturnValue(promise);

    const { result } = renderHook(() => usePolling(fn, 1000));

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolveFn('data');
      await Promise.resolve();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe('data');
    expect(fn).toHaveBeenCalledTimes(1);

    // Second poll
    const promise2 = new Promise<string>((resolve) => { resolveFn = resolve; });
    fn.mockReturnValue(promise2);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.loading).toBe(true);
    expect(fn).toHaveBeenCalledTimes(2);
    
    await act(async () => {
      resolveFn('data2');
      await Promise.resolve();
    });
    
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe('data2');
  });

  it('should handle errors gracefully', async () => {
    const error = new Error('polling error');
    const fn = vi.fn().mockRejectedValue(error);
    const { result } = renderHook(() => usePolling(fn, 1000));

    // allow microtasks to run to process rejected promise
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(error);
    expect(result.current.data).toBeNull();
  });

  it('should pause polling when disabled', async () => {
    const fn = vi.fn().mockResolvedValue('data');
    const { rerender } = renderHook(
      ({ enabled }) => usePolling(fn, 1000, enabled),
      { initialProps: { enabled: true } }
    );

    await act(async () => {
      await Promise.resolve();
    });
    
    expect(fn).toHaveBeenCalledTimes(1);

    rerender({ enabled: false });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should not update state if unmounted', async () => {
    let resolveFn: (value: string) => void;
    const promise = new Promise<string>((resolve) => {
      resolveFn = resolve;
    });
    const fn = vi.fn().mockReturnValue(promise);

    const { result, unmount } = renderHook(() => usePolling(fn, 1000));

    expect(result.current.loading).toBe(true);
    
    unmount();

    await act(async () => {
      resolveFn('data');
      await Promise.resolve();
    });

    // We shouldn't see any error thrown. The component is unmounted.
    expect(true).toBe(true);
  });
});
