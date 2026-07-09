import { describe, expect, it } from 'vitest';
import {
  MIN_PEER_SEASONS,
  PROJECTION_CEILING,
  PROJECTION_ERA_START,
  projectFinals,
} from '../../src/lib/utils/projection';
import type { SeasonScores } from '../../src/lib/data/base';

// A completed peer season: one early score exactly 30 days before finals
// (Jul 11 → Aug 10) and a finals-night score.
function peer(year: string, early: number, finals: number): SeasonScores {
  return {
    year,
    endDate: `${year}-08-10`,
    scores: [
      { date: `${year}-07-11`, location: 'Akron, OH', score: early },
      { date: `${year}-08-10`, location: 'Indianapolis, IN', score: finals },
    ],
  };
}

// An in-progress featured season whose latest score is exactly 30 days
// before finals (Jul 9 → Aug 8), with finals still unscored.
function inProgress(latest: number): SeasonScores {
  return {
    year: '2026',
    endDate: '2026-08-08',
    scores: [
      { date: '2026-07-09', location: 'Stanford, CA', score: latest },
      { date: '2026-08-08', location: 'Indianapolis, IN' },
    ],
  };
}

// Eight modern-era peers: early score 80, finals 90..97 → climbs 10..17,
// median climb (13 + 14) / 2 = 13.5.
const EIGHT_PEERS = Array.from({ length: MIN_PEER_SEASONS }, (_, i) =>
  peer(String(PROJECTION_ERA_START + i), 80, 90 + i),
);

describe('projectFinals', () => {
  it('adds the median peer climb (even peer count) and ranks all-time', () => {
    const featured = inProgress(82);
    const result = projectFinals([...EIGHT_PEERS, featured], featured);
    // 82 + 13.5 = 95.5; finals scores ≥ 95.5 are 96 and 97 → rank 3.
    expect(result).toEqual({ score: 95.5, allTimeRank: 3 });
  });

  it('takes the middle climb for an odd peer count and shares rank on ties', () => {
    const featured = inProgress(82);
    const nine = [...EIGHT_PEERS, peer('2018', 80, 98)]; // climbs 10..18, median 14
    const result = projectFinals([...nine, featured], featured);
    // 82 + 14 = 96 ties the 2016 peer's finals score; >= counting puts the
    // projection behind the tie → 96, 97, 98 ahead → rank 4.
    expect(result).toEqual({ score: 96, allTimeRank: 4 });
  });

  it('returns null with fewer than MIN_PEER_SEASONS qualifying peers', () => {
    const featured = inProgress(82);
    const seven = EIGHT_PEERS.slice(0, MIN_PEER_SEASONS - 1);
    expect(projectFinals([...seven, featured], featured)).toBeNull();
  });

  it('excludes pre-era seasons from the climb pool', () => {
    const featured = inProgress(82);
    const seven = EIGHT_PEERS.slice(0, MIN_PEER_SEASONS - 1);
    const old = peer(String(PROJECTION_ERA_START - 1), 80, 90);
    expect(projectFinals([...seven, old, featured], featured)).toBeNull();
  });

  it('excludes peers with no score as of the featured day', () => {
    const featured = inProgress(82);
    const seven = EIGHT_PEERS.slice(0, MIN_PEER_SEASONS - 1);
    // First score only 20 days out (Jul 21 → Aug 10): nothing as of day 30.
    const lateStarter: SeasonScores = {
      year: '2017',
      endDate: '2017-08-10',
      scores: [
        { date: '2017-07-21', location: 'Atlanta, GA', score: 85 },
        { date: '2017-08-10', location: 'Indianapolis, IN', score: 95 },
      ],
    };
    expect(
      projectFinals([...seven, lateStarter, featured], featured),
    ).toBeNull();
  });

  it('counts pre-era finals scores in the all-time rank', () => {
    const featured = inProgress(82);
    const legacy = peer('1989', 80, 98); // excluded from climbs, counted in rank
    const result = projectFinals([...EIGHT_PEERS, legacy, featured], featured);
    // Projection stays 95.5 (climbs unchanged); ≥ 95.5 now 96, 97, 98 → rank 4.
    expect(result).toEqual({ score: 95.5, allTimeRank: 4 });
  });

  it('clamps a record-pace projection to PROJECTION_CEILING', () => {
    const featured = inProgress(90);
    const result = projectFinals([...EIGHT_PEERS, featured], featured);
    // 90 + 13.5 = 103.5 → clamped; nothing has ever scored higher → rank 1.
    expect(result).toEqual({ score: PROJECTION_CEILING, allTimeRank: 1 });
  });

  it('returns null when the featured season has no numeric score', () => {
    const scheduled: SeasonScores = {
      year: '2026',
      endDate: '2026-08-08',
      scores: [
        { date: '2026-06-27', location: 'Alliance, OH', score: null },
        { date: '2026-08-08', location: 'Indianapolis, IN' },
      ],
    };
    expect(projectFinals([...EIGHT_PEERS, scheduled], scheduled)).toBeNull();
  });
});
