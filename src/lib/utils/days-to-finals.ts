import { DateTime } from 'luxon';

const FINALS_DATE = DateTime.fromISO('2026-08-08', {
  zone: 'America/New_York',
});

export function daysToFinals(now: DateTime = DateTime.now()): number {
  return Math.max(
    0,
    Math.ceil(FINALS_DATE.diff(now.startOf('day'), 'days').days),
  );
}
