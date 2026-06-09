import {act, renderHook, waitFor} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import useProfileImage from './useProfileImage';

const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return {promise, resolve, reject};
};

const fetchMock = vi.fn();
vi.mock('../client', () => ({
  client: {
    fetch: (...args: unknown[]) => fetchMock(...args),
  },
}));

const sanityImage = (id: string) => ({_type: 'image', asset: {_ref: id}}) as never;

describe('useProfileImage', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('starts loading with no image and no error', () => {
    fetchMock.mockReturnValue(new Promise(() => {}));
    const {result} = renderHook(() => useProfileImage());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.image).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('returns the first image from the result set', async () => {
    fetchMock.mockResolvedValue([sanityImage('a'), sanityImage('b')]);

    const {result} = renderHook(() => useProfileImage());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.image).toEqual(sanityImage('a'));
    expect(result.current.error).toBeNull();
  });

  it('falls back to null when the result set is empty', async () => {
    fetchMock.mockResolvedValue([]);

    const {result} = renderHook(() => useProfileImage());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.image).toBeNull();
  });

  it('falls back to null when the result is undefined', async () => {
    fetchMock.mockResolvedValue(undefined);

    const {result} = renderHook(() => useProfileImage());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.image).toBeNull();
  });

  it('captures an Error thrown by the fetch', async () => {
    fetchMock.mockRejectedValue(new Error('boom'));

    const {result} = renderHook(() => useProfileImage());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('boom');
    expect(result.current.image).toBeNull();
  });

  it('wraps a non-Error rejection in a generic Error', async () => {
    fetchMock.mockRejectedValue({weird: true});

    const {result} = renderHook(() => useProfileImage());

    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.error?.message).toBe('Failed to load profile image');
  });

  it('ignores a resolution that arrives after unmount', async () => {
    const {promise, resolve} = deferred<unknown[]>();
    fetchMock.mockReturnValue(promise);

    const {result, unmount} = renderHook(() => useProfileImage());
    unmount();

    await act(async () => {
      resolve([sanityImage('late')]);
      await promise;
    });

    expect(result.current.image).toBeNull();
    expect(result.current.isLoading).toBe(true);
  });

  it('ignores a rejection that arrives after unmount', async () => {
    const {promise, reject} = deferred<unknown[]>();
    fetchMock.mockReturnValue(promise);

    const {result, unmount} = renderHook(() => useProfileImage());
    unmount();

    await act(async () => {
      reject(new Error('late failure'));
      await promise.catch(() => undefined);
    });

    expect(result.current.error).toBeNull();
  });
});
