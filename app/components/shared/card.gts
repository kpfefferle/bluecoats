import { type TOC } from '@ember/component/template-only';

interface CardSignature {
  Args: {
    disablePadding?: boolean;
  };
  Blocks: {
    default: [];
  };
}

<template>
  <div class="overflow-hidden rounded-lg bg-white shadow-sm">
    <div class={{unless @disablePadding "px-4 py-5 sm:p-6"}}>
      {{yield}}
    </div>
  </div>
</template> satisfies TOC<CardSignature>;
