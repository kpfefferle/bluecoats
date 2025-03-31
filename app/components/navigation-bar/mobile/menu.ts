import templateOnlyComponent from '@ember/component/template-only';
import { type NavItem } from 'bluecoats/components/navigation-bar';

interface MenuSignature {
  Args: {
    navItems: ReadonlyArray<NavItem>;
  };
}

const MenuComponent = templateOnlyComponent<MenuSignature>();

export default MenuComponent;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'NavigationBar::Mobile::Menu': typeof MenuComponent;
    'navigation-bar/mobile/menu': typeof MenuComponent;
  }
}
