import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useSuspenseQuery } from './useSuspenseQuery';
import React, { Suspense } from 'react';

describe('useSuspenseQuery', () => {
  it('should be defined', () => {
    expect(useSuspenseQuery).toBeDefined();
  });

  it('should suspend and resolve', async () => {
    let resolveFn: (value: string) => void;
    const promise = new Promise<string>((resolve) => {
      resolveFn = resolve;
    });
    const fn = vi.fn().mockReturnValue(promise);

    // renderHook will throw the promise when suspended if not wrapped in Suspense
    // But testing-library supports Suspense if we wrap it
    const wrapper = ({ children }: { children: React.ReactNode }) => 
      React.createElement(Suspense, { fallback: "loading" }, children);

    const { result } = renderHook(() => useSuspenseQuery('test-key-1', fn), { wrapper });

    // Initially, it suspends, so result.current is null/undefined in the context of renderHook sometimes
    // Wait for the next tick to let React render the fallback
    await Promise.resolve();

    // Resolve the promise
    resolveFn!('resolved data');

    // Wait for the suspended component to resolve and render
    await waitFor(() => {
      expect(result.current).toBe('resolved data');
    });
    
    expect(fn).toHaveBeenCalledTimes(1);
    
    // Test cache by fetching again with same key
    const { result: result2 } = renderHook(() => useSuspenseQuery('test-key-1', fn), { wrapper });
    expect(result2.current).toBe('resolved data');
    // Function shouldn't be called again
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should handle errors', async () => {
    let rejectFn: (reason?: any) => void;
    const promise = new Promise<string>((_, reject) => {
      rejectFn = reject;
    });
    const fn = vi.fn().mockReturnValue(promise);

    // Error Boundaries are needed to catch the error, but for tests we can just expect renderHook to throw
    // Actually renderHook might just throw the error asynchronously. Let's just catch it.
    
    // We can also test the throw directly without renderHook
    const testFn = () => useSuspenseQuery('test-key-error', fn);
    
    // 1. Initial call throws the promise
    try {
      testFn();
    } catch (e) {
      expect(e).toBeInstanceOf(Promise);
    }
    
    // 2. Reject the promise
    rejectFn!(new Error('suspense error'));
    
    // 3. Wait for rejection to settle
    try {
      await promise;
    } catch (e) {}
    
    // flush the event loop to ensure `.catch()` has mutated `entry2`
    await new Promise(r => setTimeout(r, 10)); 
    
    // 4. Next call should throw the error
    try {
      testFn();
      expect.fail('Should have thrown');
    } catch (e: any) {
      expect(e).toBeInstanceOf(Error);
      expect(e.message).toBe('suspense error');
    }
  });
});
