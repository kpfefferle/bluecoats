import templateOnlyComponent from '@ember/component/template-only';

interface CardSignature {
  Blocks: {
    default: [];
  };
}

const CardComponent = templateOnlyComponent<CardSignature>();

export default CardComponent;

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Shared::Card': typeof CardComponent;
    'shared/card': typeof CardComponent;
  }
}
