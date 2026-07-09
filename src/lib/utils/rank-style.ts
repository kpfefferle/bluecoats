/** Accessible labels for podium placements. Shared by the daily-ranking and today tables. */
export const MEDAL_LABEL: Record<number, string> = {
  1: 'DCI World Champion',
  2: 'DCI Silver Medalist',
  3: 'DCI Bronze Medalist',
};

/** Medal emoji for podium placements. Shared by the daily-ranking and today tables. */
export const MEDAL_EMOJI: Record<number, string> = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

/**
 * Badge classes for a leaderboard rank chip — podium tints for the top three,
 * neutral gray otherwise. Shared by the daily-ranking and today tables.
 */
export function rankBadgeClass(rank: number): string {
  if (rank === 1)
    return 'bg-amber-100 text-amber-900 ring-1 ring-inset ring-amber-300';
  if (rank === 2)
    return 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-300';
  if (rank === 3)
    return 'bg-orange-50 text-orange-800 ring-1 ring-inset ring-orange-200';
  return 'bg-gray-100 text-gray-600';
}
