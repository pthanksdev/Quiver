import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStateWithHistory } from './useStateWithHistory';

describe('useStateWithHistory', () => {
  it('should initialize correctly', () => {
    const { result } = renderHook(() => useStateWithHistory('initial'));
    
    expect(result.current.value).toBe('initial');
    expect(result.current.history).toEqual(['initial']);
    expect(result.current.pointer).toBe(0);
  });

  it('should set new value and update history', () => {
    const { result } = renderHook(() => useStateWithHistory('a'));
    
    act(() => {
      result.current.setValue('b');
    });
    
    expect(result.current.value).toBe('b');
    expect(result.current.history).toEqual(['a', 'b']);
    expect(result.current.pointer).toBe(1);
  });

  it('should travel back and forward', () => {
    const { result } = renderHook(() => useStateWithHistory('a'));
    
    act(() => {
      result.current.setValue('b');
    });
    act(() => {
      result.current.setValue('c');
    });
    
    expect(result.current.value).toBe('c');
    
    act(() => {
      result.current.back();
    });
    expect(result.current.value).toBe('b');
    
    act(() => {
      result.current.forward();
    });
    expect(result.current.value).toBe('c');
  });

  it('should discard future history when setting new value from past', () => {
    const { result } = renderHook(() => useStateWithHistory('a'));
    
    act(() => {
      result.current.setValue('b');
    });
    act(() => {
      result.current.setValue('c');
    });
    
    act(() => {
      result.current.back();
    });
    act(() => {
      result.current.setValue('x');
    });
    
    expect(result.current.value).toBe('x');
    expect(result.current.history).toEqual(['a', 'b', 'x']);
  });
});
