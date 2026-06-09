import {act, renderHook} from '@testing-library/react';
import {describe, expect, it} from 'vitest';

import useWindow from './useWindow';

const resizeTo = (width: number, height: number) => {
  window.innerWidth = width;
  window.innerHeight = height;
  window.dispatchEvent(new Event('resize'));
};

describe('useWindow', () => {
  it('reports the current window size after mount', () => {
    act(() => resizeTo(1024, 768));
    const {result} = renderHook(() => useWindow());

    expect(result.current).toEqual({width: 1024, height: 768});
  });

  it('updates on window resize', () => {
    const {result} = renderHook(() => useWindow());

    act(() => resizeTo(640, 480));
    expect(result.current).toEqual({width: 640, height: 480});

    act(() => resizeTo(1920, 1080));
    expect(result.current).toEqual({width: 1920, height: 1080});
  });
});
