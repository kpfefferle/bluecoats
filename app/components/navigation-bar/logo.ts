import templateOnlyComponent from '@ember/component/template-only';

const LogoComponent = templateOnlyComponent();

export default LogoComponent;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'NavigationBar::Logo': typeof LogoComponent;
    'navigation-bar/logo': typeof LogoComponent;
  }
}
