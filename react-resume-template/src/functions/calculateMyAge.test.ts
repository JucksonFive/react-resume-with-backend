import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import getAge from './calculateMyAge';

describe('getAge', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Fixed "today" so age calculations are deterministic.
    vi.setSystemTime(new Date('2026-06-09T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the full number of years for a birthday earlier in the year', () => {
    expect(getAge('1990-01-01')).toBe(36);
  });

  it('does not count the current year before the birthday has occurred', () => {
    // Birthday is later in 2026 than the mocked "today" (June 9).
    expect(getAge('1990-12-31')).toBe(35);
  });

  it('counts the year exactly on the birthday', () => {
    expect(getAge('2000-06-09')).toBe(26);
  });

  it('does not yet count the year the day before the birthday', () => {
    expect(getAge('2000-06-10')).toBe(25);
  });

  it('returns 0 for someone born earlier this year', () => {
    expect(getAge('2026-01-01')).toBe(0);
  });
});
