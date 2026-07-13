import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useOptimisticUpdate } from './useOptimisticUpdate';

describe('useOptimisticUpdate', () => {
  it('should be defined', () => {
    expect(useOptimisticUpdate).toBeDefined();
  });

  it('should initialize with committed value', () => {
    const mutate = vi.fn();
    const { result } = renderHook(() => useOptimisticUpdate<string>('initial', mutate));
    
    expect(result.current.value).toBe('initial');
    expect(result.current.isPending).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should optimistically update and then confirm', async () => {
    const mutate = vi.fn().mockResolvedValue('confirmed');
    const { result } = renderHook(() => useOptimisticUpdate<string>('initial', mutate));
    
    act(() => {
      void result.current.update('optimistic value');
    });
    
    // Immediately after calling update, it should have the optimistic value
    expect(result.current.value).toBe('optimistic value');
    expect(result.current.isPending).toBe(true);
    
    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });
    
    // After mutation resolves, it should be updated to the confirmed value
    expect(result.current.value).toBe('confirmed');
    expect(result.current.error).toBeNull();
    expect(mutate).toHaveBeenCalledWith('optimistic value');
  });

  it('should roll back to committed value on error', async () => {
    const error = new Error('mutation failed');
    const mutate = vi.fn().mockRejectedValue(error);
    
    const { result } = renderHook(
      ({ committed }) => useOptimisticUpdate<string>(committed, mutate),
      { initialProps: { committed: 'initial' as string } }
    );
    
    act(() => {
      void result.current.update('optimistic value');
    });
    
    // Optimistically updated
    expect(result.current.value).toBe('optimistic value');
    expect(result.current.isPending).toBe(true);
    
    await waitFor(() => {
      expect(result.current.isPending).toBe(false);
    });
    
    // Rolled back to committed value
    expect(result.current.value).toBe('initial');
    expect(result.current.error).toBe(error);
  });
});
