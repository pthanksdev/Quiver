import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUndoable } from './useUndoable';

describe('useUndoable', () => {
  it('should initialize correctly', () => {
    const { result } = renderHook(() => useUndoable('a'));
    
    expect(result.current.state).toBe('a');
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it('should set new state and enable undo', () => {
    const { result } = renderHook(() => useUndoable('a'));
    
    act(() => {
      result.current.set('b');
    });
    
    expect(result.current.state).toBe('b');
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
    expect(result.current.history).toEqual(['a', 'b']);
  });

  it('should undo and redo', () => {
    const { result } = renderHook(() => useUndoable('a'));
    
    act(() => {
      result.current.set('b');
    });
    
    act(() => {
      result.current.undo();
    });
    expect(result.current.state).toBe('a');
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(true);
    
    act(() => {
      result.current.redo();
    });
    expect(result.current.state).toBe('b');
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
  });

  it('should discard future history when setting new value from past', () => {
    const { result } = renderHook(() => useUndoable('a'));
    
    act(() => {
      result.current.set('b');
    });
    act(() => {
      result.current.set('c');
    });
    
    act(() => {
      result.current.undo(); // back to b
    });
    
    act(() => {
      result.current.set('x');
    });
    
    expect(result.current.state).toBe('x');
    expect(result.current.history).toEqual(['a', 'b', 'x']);
  });

  it('should respect maxHistory', () => {
    const { result } = renderHook(() => useUndoable('a', 2)); // max 2
    
    act(() => {
      result.current.set('b');
    });
    act(() => {
      result.current.set('c');
    });
    
    // history should only keep last 2 -> ['b', 'c']
    expect(result.current.history).toEqual(['b', 'c']);
    
    act(() => {
      result.current.undo();
    });
    expect(result.current.state).toBe('b');
    expect(result.current.canUndo).toBe(false);
  });
});
