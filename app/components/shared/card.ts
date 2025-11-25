import templateOnlyComponent from '@ember/component/template-only';

interface CardSignature {
  Args: {
    disablePadding?: boolean;
  };
  Blocks: {
    default: [];
  };
}

const CardComponent = templateOnlyComponent<CardSignature>();

export default CardComponent;
