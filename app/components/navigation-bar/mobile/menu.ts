import templateOnlyComponent from '@ember/component/template-only';
import { type NavItem } from 'bluecoats/components/navigation-bar';

interface MenuSignature {
  Args: {
    navItems: ReadonlyArray<NavItem>;
  };
}

const MenuComponent = templateOnlyComponent<MenuSignature>();

export default MenuComponent;
