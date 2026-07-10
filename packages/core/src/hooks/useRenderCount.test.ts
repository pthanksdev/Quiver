import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useRenderCount } from './useRenderCount';

describe('useRenderCount', () => {
  it('should return 1 on initial render', () => {
    const { result } = renderHook(() => useRenderCount());
    expect(result.current).toBe(1);
  });

  it('should increment on re-renders', () => {
    const { result, rerender } = renderHook(() => useRenderCount());
    
    expect(result.current).toBe(1);
    
    rerender();
    expect(result.current).toBe(2);
    
    rerender();
    expect(result.current).toBe(3);
  });
});
