export interface DaySliderChip {
  day: number;
  label: string;
}

const BASE_CHIPS = [45, 28, 14, 7, 0];

/**
 * Build the chronological-countdown chip list for the day slider.
 *
 * Rules:
 * - Chips are ordered by descending day count (counting down to Finals).
 * - Only chips with `day <= maximum` are included.
 * - When `currentDay` falls inside the range and is > 0, a Today chip is
 *   inserted at that position. If it matches an existing base chip, that
 *   chip is relabeled "Today" rather than duplicated.
 * - The 0-day chip always reads "Finals" — even when `currentDay === 0`.
 */
export function buildDaySliderChips(
  maximum: number,
  currentDay: number,
): DaySliderChip[] {
  const days = BASE_CHIPS.filter((d) => d <= maximum);
  const showToday = currentDay > 0 && currentDay <= maximum;
  if (showToday && !days.includes(currentDay)) days.push(currentDay);
  return days
    .sort((a, b) => b - a)
    .map((day) => ({
      day,
      label: day === 0 ? 'Finals' : day === currentDay ? 'Today' : `${day}d`,
    }));
}

/**
 * Human-readable descriptor for a given days-before-Finals count, anchored
 * to the modern DCI calendar (Finals night, last week, championship
 * stretch, the heart of the tour, opening weekends).
 */
export function daySliderDescriptor(days: number): string {
  if (days === 0) return 'Finals night';
  if (days < 7) return 'last week';
  if (days < 14) return 'late tour';
  if (days < 28) return 'mid tour';
  return 'early tour';
}
