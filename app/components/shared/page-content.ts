import templateOnlyComponent from '@ember/component/template-only';

interface PageContentSignature {
  Blocks: {
    default: [];
  };
}

const PageContentComponent = templateOnlyComponent<PageContentSignature>();

export default PageContentComponent;
