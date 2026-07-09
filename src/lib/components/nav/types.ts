export type NavIconKind = 'today' | 'history' | 'daily' | 'tour';

export interface NavItem {
  label: string;
  shortLabel: string;
  href: '/' | '/score-history' | '/daily-ranking' | '/tour';
  icon: NavIconKind;
}

export const NAV_ITEMS: ReadonlyArray<NavItem> = [
  { label: 'Today', shortLabel: 'Today', href: '/', icon: 'today' },
  {
    label: 'Score history',
    shortLabel: 'History',
    href: '/score-history',
    icon: 'history',
  },
  {
    label: 'Daily ranking',
    shortLabel: 'Daily',
    href: '/daily-ranking',
    icon: 'daily',
  },
  { label: 'Tour', shortLabel: 'Tour', href: '/tour', icon: 'tour' },
];
