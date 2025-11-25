import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export interface NavItem {
  label: string;
  route: string;
}
const NAV_ITEMS: ReadonlyArray<NavItem> = [
  {
    label: 'Score History',
    route: 'index',
  },
  {
    label: 'Daily Rankings',
    route: 'daily-rankings',
  },
];

export default class NavigationBarComponent extends Component {
  navItems = NAV_ITEMS;

  @tracked isMobileMenuOpen = false;

  @action setIsMobileMenuOpen(value: boolean) {
    this.isMobileMenuOpen = value;
  }
}
