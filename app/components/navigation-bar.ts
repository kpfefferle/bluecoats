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
    label: 'Scores by Day',
    route: 'scores-by-day',
  },
];

export default class NavigationBarComponent extends Component {
  navItems = NAV_ITEMS;

  @tracked isMobileMenuOpen = false;

  @action setIsMobileMenuOpen(value: boolean) {
    this.isMobileMenuOpen = value;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    NavigationBar: typeof NavigationBarComponent;
    'navigation-bar': typeof NavigationBarComponent;
  }
}
