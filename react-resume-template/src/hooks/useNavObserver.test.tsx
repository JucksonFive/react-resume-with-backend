import {renderHook} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {useNavObserver} from './useNavObserver';

// Avoid pulling the real Header (framer-motion, next/link, ...) into the test;
// the hook only needs the headerID constant from it.
vi.mock('../components/Sections/Header', () => ({headerID: 'headerNav'}));

type IOCallback = (entries: Array<Partial<IntersectionObserverEntry>>) => void;

// Capture the observer callback so tests can drive intersection events by hand.
let lastCallback: IOCallback | null = null;
const observe = vi.fn();
const disconnect = vi.fn();

class MockIntersectionObserver {
  constructor(cb: IOCallback) {
    lastCallback = cb;
  }
  observe = observe;
  unobserve = vi.fn();
  disconnect = disconnect;
  takeRecords = vi.fn();
  root = null;
  rootMargin = '';
  thresholds = [];
}

const SELECTOR = 'section[id]';

const makeSection = (id: string) => {
  const el = document.createElement('section');
  el.setAttribute('id', id);
  document.body.appendChild(el);
  return el;
};

const entryFor = (
  el: Element,
  {isIntersecting, ratio, y}: {isIntersecting: boolean; ratio: number; y: number},
): Partial<IntersectionObserverEntry> => ({
  target: el,
  isIntersecting,
  intersectionRatio: ratio,
  boundingClientRect: {y} as DOMRectReadOnly,
});

describe('useNavObserver', () => {
  beforeEach(() => {
    lastCallback = null;
    observe.mockClear();
    disconnect.mockClear();
    document.body.innerHTML = '';
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver as unknown as typeof IntersectionObserver);

    // Header wrapper sits at y = 100; sections above it are "aboveToc".
    const header = document.createElement('div');
    header.setAttribute('id', 'headerNav');
    vi.spyOn(header, 'getBoundingClientRect').mockReturnValue({y: 100} as DOMRect);
    document.body.appendChild(header);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('observes every matched section', () => {
    makeSection('about');
    makeSection('projects');
    renderHook(() => useNavObserver(SELECTOR, vi.fn()));

    expect(observe).toHaveBeenCalledTimes(2);
  });

  it('reports the id of an intersecting section', () => {
    const about = makeSection('about');
    const handler = vi.fn();
    renderHook(() => useNavObserver(SELECTOR, handler));

    lastCallback?.([entryFor(about, {isIntersecting: true, ratio: 0.5, y: 50})]);
    expect(handler).toHaveBeenCalledWith('about');
  });

  it('reports the previous section when a partially-visible section scrolls below the header', () => {
    makeSection('about');
    const projects = makeSection('projects');
    const handler = vi.fn();
    renderHook(() => useNavObserver(SELECTOR, handler));

    // projects is index 1, not intersecting, partially visible, below the TOC
    // (y = 200 > header y = 100) -> hook reports the prior section ("about").
    lastCallback?.([entryFor(projects, {isIntersecting: false, ratio: 0.5, y: 200})]);
    expect(handler).toHaveBeenCalledWith('about');
  });

  it('does nothing for a section that is fully out of view above the header', () => {
    makeSection('about');
    const projects = makeSection('projects');
    const handler = vi.fn();
    renderHook(() => useNavObserver(SELECTOR, handler));

    // Not intersecting, ratio 0, above the TOC -> no branch matches.
    lastCallback?.([entryFor(projects, {isIntersecting: false, ratio: 0, y: 50})]);
    expect(handler).not.toHaveBeenCalled();
  });

  it('disconnects the observer on unmount', () => {
    makeSection('about');
    const {unmount} = renderHook(() => useNavObserver(SELECTOR, vi.fn()));

    unmount();
    expect(disconnect).toHaveBeenCalledTimes(1);
  });
});
