import {renderHook} from '@testing-library/react';
import {createRef, RefObject} from 'react';
import {describe, expect, it, vi} from 'vitest';

import useDetectOutsideClick from './useDetectOutsideClick';

describe('useDetectOutsideClick', () => {
  const setup = () => {
    const inside = document.createElement('div');
    const child = document.createElement('span');
    inside.appendChild(child);
    const outside = document.createElement('div');
    document.body.append(inside, outside);

    const ref = createRef<HTMLDivElement>() as RefObject<HTMLDivElement>;
    ref.current = inside;
    const handler = vi.fn();
    const {unmount} = renderHook(() => useDetectOutsideClick(ref, handler));

    return {inside, child, outside, handler, unmount};
  };

  it('fires the handler when clicking outside the ref element', () => {
    const {outside, handler} = setup();

    outside.dispatchEvent(new Event('mousedown', {bubbles: true}));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('ignores clicks on the ref element itself', () => {
    const {inside, handler} = setup();

    inside.dispatchEvent(new Event('mousedown', {bubbles: true}));
    expect(handler).not.toHaveBeenCalled();
  });

  it('ignores clicks on descendant elements', () => {
    const {child, handler} = setup();

    child.dispatchEvent(new Event('mousedown', {bubbles: true}));
    expect(handler).not.toHaveBeenCalled();
  });

  it('also reacts to touchstart events', () => {
    const {outside, handler} = setup();

    outside.dispatchEvent(new Event('touchstart', {bubbles: true}));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('removes its listeners on unmount', () => {
    const {outside, handler, unmount} = setup();

    unmount();
    outside.dispatchEvent(new Event('mousedown', {bubbles: true}));
    expect(handler).not.toHaveBeenCalled();
  });
});
