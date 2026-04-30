<script lang="ts">
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import type { NavItem } from './types';

  let { navItems }: { navItems: ReadonlyArray<NavItem> } = $props();
</script>

<div class="hidden md:block">
  <div class="ml-10 flex items-baseline space-x-4">
    {#each navItems as item (item.href)}
      <a
        href={resolve(item.href)}
        class="rounded-md px-3 py-2 text-sm font-medium text-white {page.route
          .id === item.href
          ? 'bg-blue-700 hover:!bg-blue-700'
          : 'hover:bg-blue-500/75'}"
      >
        {item.label}
      </a>
    {/each}
  </div>
</div>
