/**
 * Editorial groupings of Bluecoats competitive history, surfaced as summary
 * cards beneath the Score History chart. Boundaries and copy are authored from
 * the corps' real placement record (see the `placement` field on each season).
 */
export interface Era {
  /** First season year of the era (inclusive). */
  from: number;
  /** Last season year of the era (inclusive). Omit for the ongoing era. */
  to?: number;
  /** Short era name. */
  name: string;
  /** One-line description of what defined the era. */
  description: string;
}

export const ERAS: ReadonlyArray<Era> = [
  {
    from: 1977,
    to: 1986,
    name: 'Founding years',
    description:
      'Open Class roots - building the corps toward a Finals presence.',
  },
  {
    from: 1987,
    to: 2000,
    name: 'Finals breakthrough',
    description: 'First ever World Championship Finals appearance in 1987.',
  },
  {
    from: 2001,
    to: 2013,
    name: 'Climb to contention',
    description: 'First top-six finish in 2004. First medal in 2010 (bronze).',
  },
  {
    // No `to` year: this era is ongoing, which is what makes
    // buildEraSummaries() derive and append the championship and best-score
    // sentences from season data. Closing this era (adding a `to` year) will
    // silently drop those sentences — restore them as hand-written prose here
    // before doing so.
    from: 2014,
    name: 'Modern medalist',
    description: 'Perennial top three.',
  },
];
