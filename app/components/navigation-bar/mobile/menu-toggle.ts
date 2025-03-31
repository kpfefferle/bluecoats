import templateOnlyComponent from '@ember/component/template-only';

interface MenuToggleSignature {
  Args: {
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (value: boolean) => void;
  };
}

const MenuToggleComponent = templateOnlyComponent<MenuToggleSignature>();

export default MenuToggleComponent;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'NavigationBar::Mobile::MenuToggle': typeof MenuToggleComponent;
    'navigation-bar/mobile/menu-toggle': typeof MenuToggleComponent;
  }
}
