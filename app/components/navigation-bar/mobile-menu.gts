import { type TOC } from '@ember/component/template-only';
import { LinkTo } from '@ember/routing';

import { type NavItem } from 'bluecoats/components/navigation-bar';

interface MobileMenuSignature {
  Args: {
    navItems: ReadonlyArray<NavItem>;
  };
}

<template>
  <div class="md:hidden" id="mobile-menu">
    <div class="space-y-1 px-2 pt-2 pb-3 sm:px-3">
      {{#each @navItems as |item|}}
        <LinkTo
          class="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-blue-500/75"
          @activeClass="bg-blue-700 hover:!bg-blue-700"
          @route={{item.route}}
        >
          {{item.label}}
        </LinkTo>
      {{/each}}
    </div>
  </div>
</template> satisfies TOC<MobileMenuSignature>;
