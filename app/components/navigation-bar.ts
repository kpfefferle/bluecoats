import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

const NAV_ITEMS: ReadonlyArray<{
  label: string;
  route: string;
}> = [
  {
    label: 'Overview',
    route: 'index',
  },
];

export default class NavigationBarComponent extends Component {
  navItems = NAV_ITEMS;

  @tracked isMobileMenuOpen = false;

  @action setIsMobileMenuOpen(value: boolean) {
    this.isMobileMenuOpen = value;
  }
}
