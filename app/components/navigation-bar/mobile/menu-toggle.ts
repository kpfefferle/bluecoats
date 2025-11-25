import templateOnlyComponent from '@ember/component/template-only';

interface MenuToggleSignature {
  Args: {
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (value: boolean) => void;
  };
}

const MenuToggleComponent = templateOnlyComponent<MenuToggleSignature>();

export default MenuToggleComponent;
