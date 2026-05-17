import { describe, expect, it } from 'vitest';
import {
  buildDaySliderChips,
  daySliderDescriptor,
} from '../../src/lib/utils/day-slider';

describe('buildDaySliderChips', () => {
  it('returns base chips in chronological countdown order', () => {
    expect(buildDaySliderChips(64, 0)).toEqual([
      { day: 45, label: '45d' },
      { day: 28, label: '28d' },
      { day: 14, label: '14d' },
      { day: 7, label: '7d' },
      { day: 0, label: 'Finals' },
    ]);
  });

  it('omits base chips whose day exceeds the maximum', () => {
    expect(buildDaySliderChips(20, 0).map((c) => c.day)).toEqual([14, 7, 0]);
  });

  it('inserts a Today chip at the current day when it is in range', () => {
    expect(buildDaySliderChips(64, 30)).toEqual([
      { day: 45, label: '45d' },
      { day: 30, label: 'Today' },
      { day: 28, label: '28d' },
      { day: 14, label: '14d' },
      { day: 7, label: '7d' },
      { day: 0, label: 'Finals' },
    ]);
  });

  it('relabels a matching base chip as Today rather than duplicating', () => {
    const chips = buildDaySliderChips(64, 7);
    expect(chips.map((c) => c.day)).toEqual([45, 28, 14, 7, 0]);
    expect(chips.find((c) => c.day === 7)?.label).toBe('Today');
  });

  it('keeps the 0-day chip labeled "Finals" even when currentDay is 0', () => {
    const chips = buildDaySliderChips(64, 0);
    expect(chips.find((c) => c.day === 0)?.label).toBe('Finals');
    expect(chips.some((c) => c.label === 'Today')).toBe(false);
  });

  it('does not insert a Today chip when currentDay exceeds the maximum', () => {
    const chips = buildDaySliderChips(20, 83);
    expect(chips.some((c) => c.label === 'Today')).toBe(false);
    expect(chips.map((c) => c.day)).toEqual([14, 7, 0]);
  });
});

describe('daySliderDescriptor', () => {
  it('reads "Finals night" on day 0', () => {
    expect(daySliderDescriptor(0)).toBe('Finals night');
  });

  it('reads "last week" for 1-6 days out', () => {
    expect(daySliderDescriptor(1)).toBe('last week');
    expect(daySliderDescriptor(6)).toBe('last week');
  });

  it('reads "late tour" for 7-13 days out', () => {
    expect(daySliderDescriptor(7)).toBe('late tour');
    expect(daySliderDescriptor(13)).toBe('late tour');
  });

  it('reads "mid tour" for 14-27 days out', () => {
    expect(daySliderDescriptor(14)).toBe('mid tour');
    expect(daySliderDescriptor(27)).toBe('mid tour');
  });

  it('reads "early tour" from 28 days out', () => {
    expect(daySliderDescriptor(28)).toBe('early tour');
    expect(daySliderDescriptor(60)).toBe('early tour');
  });
});
