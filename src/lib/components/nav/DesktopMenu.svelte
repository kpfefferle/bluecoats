<script lang="ts">
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import { NAV_ITEMS } from './types';
</script>

<nav aria-label="Primary" class="ml-4 hidden items-center gap-1 md:flex">
  {#each NAV_ITEMS as item (item.href)}
    {@const active = page.route.id === item.href}
    <a
      href={resolve(item.href)}
      class="rounded-md px-3 py-1.5 text-[0.84375rem] font-medium transition-colors {active
        ? 'bg-white/10 text-white'
        : 'text-white/70 hover:bg-white/5 hover:text-white'}"
      aria-current={active ? 'page' : undefined}
    >
      {item.label}
    </a>
  {/each}
</nav>
