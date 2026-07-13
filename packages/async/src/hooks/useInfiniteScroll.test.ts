import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useInfiniteScroll } from './useInfiniteScroll';

describe('useInfiniteScroll', () => {
  let intersectionCallback: IntersectionObserverCallback;
  let observeSpy: any;
  let disconnectSpy: any;

  beforeEach(() => {
    observeSpy = vi.fn();
    disconnectSpy = vi.fn();
    
    global.IntersectionObserver = class {
      constructor(callback: IntersectionObserverCallback) {
        intersectionCallback = callback;
      }
      root: Document | Element | null = null;
      rootMargin: string = '';
      thresholds: ReadonlyArray<number> = [];
      observe = observeSpy;
      unobserve = vi.fn();
      disconnect = disconnectSpy;
      takeRecords = vi.fn().mockReturnValue([]);
    } as any;
  });

  afterEach(() => {
    vi.clearAllMocks();
    delete (global as any).IntersectionObserver;
  });

  it('should be defined', () => {
    expect(useInfiniteScroll).toBeDefined();
  });

  it('should fetch first page on mount', async () => {
    const fetchPage = vi.fn().mockResolvedValue(['item1', 'item2']);
    const { result } = renderHook(() => useInfiniteScroll(fetchPage));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetchPage).toHaveBeenCalledWith(1);
    expect(result.current.items).toEqual(['item1', 'item2']);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch error', async () => {
    const error = new Error('fetch error');
    const fetchPage = vi.fn().mockRejectedValue(error);
    const { result } = renderHook(() => useInfiniteScroll(fetchPage));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(error);
  });

  it('should fetch next page when intersecting', async () => {
    const fetchPage = vi.fn()
      .mockResolvedValueOnce(['item1'])
      .mockResolvedValueOnce(['item2']);
      
    const { result } = renderHook(() => {
      const hookResult = useInfiniteScroll(fetchPage);
      if (!hookResult.sentinelRef.current) {
        (hookResult.sentinelRef as any).current = document.createElement('div');
      }
      return hookResult;
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(intersectionCallback).toBeDefined();

    act(() => {
      intersectionCallback([{ isIntersecting: true } as any], {} as any);
    });

    await waitFor(() => {
      expect(fetchPage).toHaveBeenCalledWith(2);
    });

    expect(result.current.items).toEqual(['item1', 'item2']);
  });

  it('should stop fetching when no more items', async () => {
    const fetchPage = vi.fn().mockResolvedValue([]);
    const { result } = renderHook(() => {
      const hookResult = useInfiniteScroll(fetchPage);
      if (!hookResult.sentinelRef.current) {
        (hookResult.sentinelRef as any).current = document.createElement('div');
      }
      return hookResult;
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.hasMore).toBe(false);

    if (intersectionCallback) {
      act(() => {
        intersectionCallback([{ isIntersecting: true } as any], {} as any);
      });
    }

    expect(fetchPage).toHaveBeenCalledTimes(1); // Only initial fetch
  });
});
