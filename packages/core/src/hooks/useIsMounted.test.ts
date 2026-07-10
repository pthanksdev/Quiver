import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useIsMounted } from './useIsMounted';

describe('useIsMounted', () => {
  it('should return true when mounted and false when unmounted', () => {
    const { result, unmount } = renderHook(() => useIsMounted());
    
    expect(result.current()).toBe(true);
    
    unmount();
    
    expect(result.current()).toBe(false);
  });
});
