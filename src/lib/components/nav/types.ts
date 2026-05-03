export type NavIconKind = 'history' | 'daily';

export interface NavItem {
  label: string;
  shortLabel: string;
  href: '/' | '/daily-rankings';
  icon: NavIconKind;
}

export const NAV_ITEMS: ReadonlyArray<NavItem> = [
  { label: 'Score history', shortLabel: 'History', href: '/', icon: 'history' },
  {
    label: 'Daily ranking',
    shortLabel: 'Daily',
    href: '/daily-rankings',
    icon: 'daily',
  },
];
