import type { SeasonScores } from '../data/base';
import type { Era } from '../data/eras';
import { bestFinals } from './today';

export interface EraSummary {
  /** First season year of the era (inclusive). */
  from: number;
  /** Last season year (inclusive). Omitted for the ongoing era. */
  to?: number;
  /** Display range: `"1977–1986"` or `"2014–present"`. */
  rangeLabel: string;
  name: string;
  /** Lead prose, plus derived sentences for the ongoing era. */
  description: string;
}

/** `["2016", "2024", "2026"]` → `"2016, 2024 & 2026"`. */
function joinYears(years: string[]): string {
  if (years.length <= 1) return years.join('');
  return `${years.slice(0, -1).join(', ')} & ${years.at(-1)}`;
}

/** Championship years within the era, earliest first. */
function championshipYears(era: Era, seasons: SeasonScores[]): string[] {
  return seasons
    .filter((season) => {
      const year = Number(season.year);
      return (
        season.placement === 1 &&
        year >= era.from &&
        (era.to === undefined || year <= era.to)
      );
    })
    .map((season) => season.year)
    .sort();
}

/**
 * Sentences appended to the ongoing era's lead prose. Championships are scoped
 * to the era because they describe it; the best score is measured across every
 * season, because that is what "ever" claims.
 */
function derivedSentences(era: Era, seasons: SeasonScores[]): string[] {
  const sentences: string[] = [];

  const titles = championshipYears(era, seasons);
  if (titles.length === 1) {
    sentences.push(`Champion in ${titles[0]}.`);
  } else if (titles.length > 1) {
    sentences.push(`Champions in ${joinYears(titles)}.`);
  }

  const best = bestFinals(seasons);
  if (best) {
    sentences.push(`Best ever score of ${best.score} (${best.year}).`);
  }

  return sentences;
}

/**
 * Era records rendered for display. Eras with a `to` year are settled history
 * and pass through untouched; the ongoing era (no `to`) gets a `"–present"`
 * range label and has its championship and best-score sentences derived from
 * season data, so the copy can never fall out of date.
 */
export function buildEraSummaries(
  eras: ReadonlyArray<Era>,
  seasons: SeasonScores[],
): EraSummary[] {
  return eras.map((era) => ({
    from: era.from,
    to: era.to,
    rangeLabel: `${era.from}–${era.to ?? 'present'}`,
    name: era.name,
    description:
      era.to === undefined
        ? [era.description, ...derivedSentences(era, seasons)].join(' ')
        : era.description,
  }));
}
