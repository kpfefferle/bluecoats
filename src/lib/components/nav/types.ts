export type NavIconKind = 'history' | 'daily' | 'tour';

export interface NavItem {
  label: string;
  shortLabel: string;
  href: '/' | '/daily-ranking' | '/tour';
  icon: NavIconKind;
}

export const NAV_ITEMS: ReadonlyArray<NavItem> = [
  { label: 'Score history', shortLabel: 'History', href: '/', icon: 'history' },
  {
    label: 'Daily ranking',
    shortLabel: 'Daily',
    href: '/daily-ranking',
    icon: 'daily',
  },
  { label: 'Tour', shortLabel: 'Tour', href: '/tour', icon: 'tour' },
];
