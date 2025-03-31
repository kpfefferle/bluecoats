import templateOnlyComponent from '@ember/component/template-only';

interface PageContentSignature {
  Blocks: {
    default: [];
  };
}

const PageContentComponent = templateOnlyComponent<PageContentSignature>();

export default PageContentComponent;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    PageContent: typeof PageContentComponent;
    'page-content': typeof PageContentComponent;
  }
}
