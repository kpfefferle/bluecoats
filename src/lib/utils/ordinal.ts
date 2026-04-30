export function ordinalSuffix(rank: number): string {
  if (Math.floor(rank / 10) === 1) return 'th';
  if (rank % 10 === 1) return 'st';
  if (rank % 10 === 2) return 'nd';
  if (rank % 10 === 3) return 'rd';
  return 'th';
}
