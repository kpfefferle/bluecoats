import { describe, expect, it } from 'vitest';
import { buildEraSummaries } from '../../src/lib/utils/eras';
import type { Era } from '../../src/lib/data/eras';
import type { SeasonScores } from '../../src/lib/data/base';

/** A finished season: one score, logged on finals night. */
function season(year: string, score: number, placement?: number): SeasonScores {
  const endDate = `${year}-08-08`;
  return {
    year,
    endDate,
    placement,
    scores: [{ date: endDate, location: 'Indianapolis, IN', score }],
  };
}

const CLOSED_ERA: Era = {
  from: 1977,
  to: 1986,
  name: 'Founding years',
  description: 'Open Class roots.',
};

const ONGOING_ERA: Era = {
  from: 2014,
  name: 'Modern medalist',
  description: 'Perennial top three.',
};

describe('buildEraSummaries', () => {
  it('passes a closed era through with a from-to range label', () => {
    const [summary] = buildEraSummaries([CLOSED_ERA], [season('1980', 60)]);

    expect(summary.rangeLabel).toBe('1977–1986');
    expect(summary.to).toBe(1986);
    expect(summary.description).toBe('Open Class roots.');
  });

  it('labels an ongoing era as ending in the present', () => {
    const [summary] = buildEraSummaries([ONGOING_ERA], [season('2016', 97, 1)]);

    expect(summary.rangeLabel).toBe('2014–present');
    expect(summary.to).toBeUndefined();
  });

  it('omits the championship sentence when the era has no titles', () => {
    const [summary] = buildEraSummaries([ONGOING_ERA], [season('2015', 96, 3)]);

    expect(summary.description).toBe(
      'Perennial top three. Best ever score of 96 (2015).',
    );
  });

  it('uses the singular for a single championship', () => {
    const [summary] = buildEraSummaries([ONGOING_ERA], [season('2016', 97, 1)]);

    expect(summary.description).toContain('Champion in 2016.');
    expect(summary.description).not.toContain('Champions');
  });

  it('joins two championships with an ampersand', () => {
    const [summary] = buildEraSummaries(
      [ONGOING_ERA],
      [season('2016', 97, 1), season('2024', 98.75, 1)],
    );

    expect(summary.description).toContain('Champions in 2016 & 2024.');
  });

  it('joins three championships with commas and a final ampersand', () => {
    const [summary] = buildEraSummaries(
      [ONGOING_ERA],
      [
        season('2016', 97, 1),
        season('2024', 98.75, 1),
        season('2026', 99.1, 1),
      ],
    );

    expect(summary.description).toBe(
      'Perennial top three. Champions in 2016, 2024 & 2026. ' +
        'Best ever score of 99.1 (2026).',
    );
  });

  it('excludes championships won before the era started', () => {
    const [summary] = buildEraSummaries(
      [ONGOING_ERA],
      [season('2010', 90, 1), season('2016', 97, 1)],
    );

    expect(summary.description).toContain('Champion in 2016.');
    expect(summary.description).not.toContain('2010');
  });

  it('reports the best finals score even when a later season scored lower', () => {
    const [summary] = buildEraSummaries(
      [ONGOING_ERA],
      [season('2024', 98.75, 1), season('2025', 98.25, 2)],
    );

    expect(summary.description).toContain('Best ever score of 98.75 (2024).');
  });

  it('omits the best-score sentence when no season has a finals score', () => {
    const inProgress: SeasonScores = {
      year: '2026',
      endDate: '2026-08-08',
      scores: [{ date: '2026-06-27', location: 'Alliance, OH', score: 74.5 }],
    };

    const [summary] = buildEraSummaries([ONGOING_ERA], [inProgress]);

    expect(summary.description).toBe('Perennial top three.');
  });

  it('keeps era order and name', () => {
    const summaries = buildEraSummaries(
      [CLOSED_ERA, ONGOING_ERA],
      [season('2016', 97, 1)],
    );

    expect(summaries.map((s) => s.name)).toEqual([
      'Founding years',
      'Modern medalist',
    ]);
    expect(summaries.map((s) => s.from)).toEqual([1977, 2014]);
  });
});
