import {act, renderHook, waitFor} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import usePortfolioItems from './usePortfolioItems';

// A promise whose resolve/reject we trigger by hand, to control timing
// relative to unmount.
const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return {promise, resolve, reject};
};

// Mock the Sanity client module; each test controls what `fetch` resolves to.
const fetchMock = vi.fn();
vi.mock('../client', () => ({
  client: {
    fetch: (...args: unknown[]) => fetchMock(...args),
  },
}));

const item = (title: string, updatedAt: string) =>
  ({
    title,
    description: '',
    imgUrl: '',
    modalTitle: title,
    _updatedAt: updatedAt,
  }) as unknown as Parameters<typeof Array.prototype.push>[0];

describe('usePortfolioItems', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('starts in a loading state with no data or error', () => {
    fetchMock.mockReturnValue(new Promise(() => {})); // never resolves
    const {result} = renderHook(() => usePortfolioItems());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('loads items and sorts them by _updatedAt descending', async () => {
    fetchMock.mockResolvedValue([
      item('older', '2024-01-01T00:00:00Z'),
      item('newest', '2026-01-01T00:00:00Z'),
      item('middle', '2025-01-01T00:00:00Z'),
    ]);

    const {result} = renderHook(() => usePortfolioItems());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data.map(i => i.title)).toEqual(['newest', 'middle', 'older']);
    expect(result.current.error).toBeNull();
  });

  it('captures an Error thrown by the fetch', async () => {
    fetchMock.mockRejectedValue(new Error('network down'));

    const {result} = renderHook(() => usePortfolioItems());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('network down');
    expect(result.current.data).toEqual([]);
  });

  it('wraps a non-Error rejection in a generic Error', async () => {
    fetchMock.mockRejectedValue('just a string');

    const {result} = renderHook(() => usePortfolioItems());

    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Failed to load portfolio items');
  });

  it('refetch triggers another request and clears a prior error', async () => {
    fetchMock.mockRejectedValueOnce(new Error('temporary')).mockResolvedValueOnce([item('ok', '2026-01-01T00:00:00Z')]);

    const {result} = renderHook(() => usePortfolioItems());
    await waitFor(() => expect(result.current.error).not.toBeNull());

    act(() => result.current.refetch());

    await waitFor(() => expect(result.current.data.map(i => i.title)).toEqual(['ok']));
    expect(result.current.error).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('ignores a resolution that arrives after unmount', async () => {
    const {promise, resolve} = deferred<ReturnType<typeof item>[]>();
    fetchMock.mockReturnValue(promise);

    const {result, unmount} = renderHook(() => usePortfolioItems());
    unmount();

    // Resolve only after the hook is gone: the `cancelled` guard must keep it
    // from touching state. We await the same promise to flush microtasks.
    await act(async () => {
      resolve([item('late', '2026-01-01T00:00:00Z')]);
      await promise;
    });

    expect(result.current.data).toEqual([]);
    expect(result.current.isLoading).toBe(true);
  });

  it('ignores a rejection that arrives after unmount', async () => {
    const {promise, reject} = deferred<ReturnType<typeof item>[]>();
    fetchMock.mockReturnValue(promise);

    const {result, unmount} = renderHook(() => usePortfolioItems());
    unmount();

    await act(async () => {
      reject(new Error('late failure'));
      await promise.catch(() => undefined);
    });

    expect(result.current.error).toBeNull();
  });
});
