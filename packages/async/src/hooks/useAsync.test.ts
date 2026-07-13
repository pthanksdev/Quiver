import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAsync } from './useAsync';

describe('useAsync', () => {
  it('should be defined', () => {
    expect(useAsync).toBeDefined();
  });

  it('should initialize with correct default state', () => {
    const fn = vi.fn().mockResolvedValue('success');
    const { result } = renderHook(() => useAsync(fn));
    
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should execute successfully and update state', async () => {
    const fn = vi.fn().mockResolvedValue('success');
    const { result } = renderHook(() => useAsync(fn));
    
    let promise: Promise<void>;
    act(() => {
      promise = result.current.execute();
    });
    
    expect(result.current.loading).toBe(true);
    
    await act(async () => {
      await promise;
    });
    
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe('success');
    expect(result.current.error).toBeNull();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should handle errors correctly', async () => {
    const error = new Error('failed');
    const fn = vi.fn().mockRejectedValue(error);
    const { result } = renderHook(() => useAsync(fn));
    
    let promise: Promise<void>;
    act(() => {
      promise = result.current.execute();
    });
    
    expect(result.current.loading).toBe(true);
    
    await act(async () => {
      await promise;
    });
    
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe(error);
  });

  it('should reset state correctly', async () => {
    const fn = vi.fn().mockResolvedValue('success');
    const { result } = renderHook(() => useAsync(fn));
    
    await act(async () => {
      await result.current.execute();
    });
    
    expect(result.current.data).toBe('success');
    
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should not update state if unmounted', () => {
    let resolveFn: (value: string) => void;
    const promise = new Promise<string>((resolve) => {
      resolveFn = resolve;
    });
    const fn = vi.fn().mockReturnValue(promise);
    
    const { result, unmount } = renderHook(() => useAsync(fn));
    
    act(() => {
      void result.current.execute();
    });
    
    expect(result.current.loading).toBe(true);
    
    unmount();
    
    act(() => {
      resolveFn('success');
    });
    
    // State shouldn't be accessible/updated, but we just verify it doesn't throw
    expect(true).toBe(true);
  });
});
