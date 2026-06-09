import {renderHook} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import useInterval from './useInterval';

describe('useInterval', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('invokes the callback once per delay period', () => {
    const callback = vi.fn();
    renderHook(() => useInterval(callback, 1000));

    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(3000);
    expect(callback).toHaveBeenCalledTimes(3);
  });

  it('does not start a timer when delay is null', () => {
    const callback = vi.fn();
    renderHook(() => useInterval(callback, null));

    vi.advanceTimersByTime(5000);
    expect(callback).not.toHaveBeenCalled();
  });

  it('sets up an interval when delay is 0 (not treated as disabled)', () => {
    const callback = vi.fn();
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval');
    renderHook(() => useInterval(callback, 0));

    // delay === 0 must NOT short-circuit. We assert the interval is registered
    // rather than advancing the clock: a 0ms interval reschedules at the same
    // timestamp, so advancing it never terminates.
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 0);
    setIntervalSpy.mockRestore();
  });

  it('always calls the latest callback', () => {
    const first = vi.fn();
    const second = vi.fn();
    const {rerender} = renderHook(({cb}) => useInterval(cb, 1000), {
      initialProps: {cb: first},
    });

    vi.advanceTimersByTime(1000);
    expect(first).toHaveBeenCalledTimes(1);

    rerender({cb: second});
    vi.advanceTimersByTime(1000);
    expect(second).toHaveBeenCalledTimes(1);
    // The stale callback is not invoked again after the swap.
    expect(first).toHaveBeenCalledTimes(1);
  });

  it('clears the interval on unmount', () => {
    const callback = vi.fn();
    const {unmount} = renderHook(() => useInterval(callback, 1000));

    unmount();
    vi.advanceTimersByTime(5000);
    expect(callback).not.toHaveBeenCalled();
  });
});
