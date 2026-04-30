<script lang="ts">
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import type { NavItem } from './types';

  let {
    navItems,
    onNavigate,
  }: { navItems: ReadonlyArray<NavItem>; onNavigate: () => void } = $props();
</script>

<div class="md:hidden" id="mobile-menu">
  <div class="space-y-1 px-2 pt-2 pb-3 sm:px-3">
    {#each navItems as item (item.href)}
      <a
        href={resolve(item.href)}
        onclick={onNavigate}
        class="block rounded-md px-3 py-2 text-base font-medium text-white {page
          .route.id === item.href
          ? 'bg-blue-700 hover:!bg-blue-700'
          : 'hover:bg-blue-500/75'}"
      >
        {item.label}
      </a>
    {/each}
  </div>
</div>
