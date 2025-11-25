import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import DesktopMenu from 'bluecoats/components/navigation-bar/desktop-menu';
import Logo from 'bluecoats/components/navigation-bar/logo';
import MobileMenu from 'bluecoats/components/navigation-bar/mobile-menu';
import MobileMenuToggle from 'bluecoats/components/navigation-bar/mobile-menu-toggle';

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

export default class NavigationBar extends Component {
  navItems = NAV_ITEMS;

  @tracked isMobileMenuOpen = false;

  setIsMobileMenuOpen = (value: boolean) => {
    this.isMobileMenuOpen = value;
  };

  <template>
    <nav class="bg-blue-600">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center">
            <Logo />
            <DesktopMenu @navItems={{this.navItems}} />
          </div>
          <MobileMenuToggle
            @isMobileMenuOpen={{this.isMobileMenuOpen}}
            @setIsMobileMenuOpen={{this.setIsMobileMenuOpen}}
          />
        </div>
      </div>

      {{#if this.isMobileMenuOpen}}
        <MobileMenu @navItems={{this.navItems}} />
      {{/if}}
    </nav>
  </template>
}
