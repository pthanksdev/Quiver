import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('should initialize with 0', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('should initialize with provided value', () => {
    const { result } = renderHook(() => useCounter(5));
    expect(result.current.count).toBe(5);
  });

  it('should increment', () => {
    const { result } = renderHook(() => useCounter(0));
    act(() => {
      result.current.increment();
    });
    expect(result.current.count).toBe(1);
  });

  it('should decrement', () => {
    const { result } = renderHook(() => useCounter(0));
    act(() => {
      result.current.decrement();
    });
    expect(result.current.count).toBe(-1);
  });

  it('should reset', () => {
    const { result } = renderHook(() => useCounter(5));
    act(() => {
      result.current.increment();
      result.current.reset();
    });
    expect(result.current.count).toBe(5);
  });

  it('should set value', () => {
    const { result } = renderHook(() => useCounter(0));
    act(() => {
      result.current.set(10);
    });
    expect(result.current.count).toBe(10);
  });

  it('should respect min and max', () => {
    const { result } = renderHook(() => useCounter(5, { min: 0, max: 10 }));
    act(() => {
      result.current.set(15);
    });
    expect(result.current.count).toBe(10);

    act(() => {
      result.current.set(-5);
    });
    expect(result.current.count).toBe(0);
  });

  it('should step correctly', () => {
    const { result } = renderHook(() => useCounter(0, { step: 5 }));
    act(() => {
      result.current.increment();
    });
    expect(result.current.count).toBe(5);
    act(() => {
      result.current.decrement();
    });
    expect(result.current.count).toBe(0);
  });
});
