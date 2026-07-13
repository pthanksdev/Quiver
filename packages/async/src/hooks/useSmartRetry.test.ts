import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useSmartRetry } from './useSmartRetry';

describe('useSmartRetry', () => {
  beforeEach(() => {
    // Math.random will return 0.5 for predictable jitter
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useSmartRetry).toBeDefined();
  });

  it('should execute successfully on first try', async () => {
    const fn = vi.fn().mockResolvedValue('success');
    const { result } = renderHook(() => useSmartRetry(fn));
    
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
    expect(result.current.attempt).toBe(0);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should retry and succeed', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('fail 1'))
      .mockResolvedValueOnce('success');
      
    const { result } = renderHook(() => useSmartRetry(fn, 3, 10)); // baseDelay: 10ms
    
    let promise: Promise<void>;
    act(() => {
      promise = result.current.execute();
    });
    
    await act(async () => {
      await promise;
    });
    
    expect(result.current.data).toBe('success');
    expect(result.current.attempt).toBe(1);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should fail after max retries', async () => {
    const error = new Error('always fail');
    const fn = vi.fn().mockRejectedValue(error);
      
    const { result } = renderHook(() => useSmartRetry(fn, 2, 10));
    
    let promise: Promise<void>;
    act(() => {
      promise = result.current.execute();
    });
    
    await act(async () => {
      await promise;
    });
    
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe(error);
    expect(result.current.attempt).toBe(2);
    expect(fn).toHaveBeenCalledTimes(3); // Initial + 2 retries
  });
});
