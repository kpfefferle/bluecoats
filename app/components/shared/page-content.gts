import { type TOC } from '@ember/component/template-only';

interface PageContentSignature {
  Blocks: {
    default: [];
  };
}

<template>
  <main>
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 overflow-auto">
      {{yield}}
    </div>
  </main>
</template> satisfies TOC<PageContentSignature>;
