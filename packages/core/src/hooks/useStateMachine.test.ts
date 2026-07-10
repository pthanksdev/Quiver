import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStateMachine } from './useStateMachine';

describe('useStateMachine', () => {
  it('should initialize with initial state', () => {
    const { result } = renderHook(() => useStateMachine('idle', {
      idle: { start: 'running' },
      running: { stop: 'idle' }
    }));
    
    expect(result.current.state).toBe('idle');
    expect(result.current.can('start')).toBe(true);
    expect(result.current.can('stop')).toBe(false);
  });

  it('should transition to next state on valid event', () => {
    const { result } = renderHook(() => useStateMachine('idle', {
      idle: { start: 'running' },
      running: { stop: 'idle' }
    }));
    
    act(() => {
      result.current.send('start');
    });
    
    expect(result.current.state).toBe('running');
    expect(result.current.can('stop')).toBe(true);
  });

  it('should ignore invalid events', () => {
    const { result } = renderHook(() => useStateMachine('idle', {
      idle: { start: 'running' },
      running: { stop: 'idle' }
    }));
    
    act(() => {
      result.current.send('stop' as any);
    });
    
    expect(result.current.state).toBe('idle');
  });
});
