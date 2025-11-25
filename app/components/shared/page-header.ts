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
