import templateOnlyComponent from '@ember/component/template-only';

interface PageHeaderSignature {
  Args: {
    title: string;
    subtitle?: string;
  };
  Blocks: {
    default: [];
  };
}

const PageHeaderComponent = templateOnlyComponent<PageHeaderSignature>();

export default PageHeaderComponent;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    PageHeader: typeof PageHeaderComponent;
    'page-header': typeof PageHeaderComponent;
  }
}
