import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToggle } from './useToggle';

describe('useToggle', () => {
  it('should initialize with default false', () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current.value).toBe(false);
  });

  it('should initialize with provided value', () => {
    const { result } = renderHook(() => useToggle(true));
    expect(result.current.value).toBe(true);
  });

  it('should toggle value', () => {
    const { result } = renderHook(() => useToggle());
    
    act(() => {
      result.current.toggle();
    });
    expect(result.current.value).toBe(true);
    
    act(() => {
      result.current.toggle();
    });
    expect(result.current.value).toBe(false);
  });

  it('should explicitly set true and false', () => {
    const { result } = renderHook(() => useToggle());
    
    act(() => {
      result.current.setTrue();
    });
    expect(result.current.value).toBe(true);
    
    act(() => {
      result.current.setFalse();
    });
    expect(result.current.value).toBe(false);
  });
});
