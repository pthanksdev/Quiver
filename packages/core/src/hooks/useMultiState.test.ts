import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMultiState } from './useMultiState';

describe('useMultiState', () => {
  it('should initialize with initial state', () => {
    const { result } = renderHook(() => useMultiState({ a: 1, b: 2 }));
    
    expect(result.current[0]).toEqual({ a: 1, b: 2 });
  });

  it('should update partial state', () => {
    const { result } = renderHook(() => useMultiState({ a: 1, b: 2 }));
    
    act(() => {
      result.current[1]({ a: 5 });
    });
    
    expect(result.current[0]).toEqual({ a: 5, b: 2 });
  });

  it('should reset state', () => {
    const { result } = renderHook(() => useMultiState({ a: 1, b: 2 }));
    
    act(() => {
      result.current[1]({ a: 5 });
      result.current[2]();
    });
    
    expect(result.current[0]).toEqual({ a: 1, b: 2 });
  });
});
