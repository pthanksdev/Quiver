import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAbortController } from './useAbortController';

describe('useAbortController', () => {
  it('should be defined', () => {
    expect(useAbortController).toBeDefined();
  });

  it('should return an AbortController instance', () => {
    const { result } = renderHook(() => useAbortController());
    expect(result.current).toBeInstanceOf(AbortController);
    expect(result.current.signal).toBeInstanceOf(AbortSignal);
  });

  it('should return the same instance on re-renders', () => {
    const { result, rerender } = renderHook(() => useAbortController());
    const initialController = result.current;
    
    rerender();
    
    expect(result.current).toBe(initialController);
  });

  it('should abort the controller on unmount', () => {
    const { result, unmount } = renderHook(() => useAbortController());
    const controller = result.current;
    
    const abortSpy = vi.spyOn(controller, 'abort');
    
    unmount();
    
    expect(abortSpy).toHaveBeenCalled();
    expect(controller.signal.aborted).toBe(true);
  });
});
