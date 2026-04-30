export interface NavItem {
  label: string;
  href: '/' | '/daily-rankings';
}

export const NAV_ITEMS: ReadonlyArray<NavItem> = [
  { label: 'Score History', href: '/' },
  { label: 'Daily Rankings', href: '/daily-rankings' },
];
