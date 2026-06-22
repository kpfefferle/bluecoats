<script lang="ts">
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import { NAV_ITEMS, type NavIconKind } from './types';

  function iconPath(kind: NavIconKind): string {
    if (kind === 'history')
      return 'M3 19h18 M5 17V9 M10 17V5 M15 17v-6 M20 17v-9';
    if (kind === 'tour')
      return 'M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10z M12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z';
    return 'M3 5h18v14H3z M3 9h18 M8 5v4 M16 5v4';
  }
</script>

<nav
  class="absolute inset-x-0 bottom-0 z-20 grid grid-cols-3 border-t border-gray-200 bg-white/90 px-1 pt-1.5 pb-[calc(0.625rem+env(safe-area-inset-bottom,0))] backdrop-blur-lg backdrop-saturate-150 md:hidden"
  aria-label="Primary"
>
  {#each NAV_ITEMS as item (item.href)}
    {@const active = page.route.id === item.href}
    <a
      href={resolve(item.href)}
      class="flex flex-col items-center gap-0.5 rounded-[0.625rem] px-0.5 py-1.5 text-[0.625rem] font-semibold whitespace-nowrap {active
        ? 'text-brand-600'
        : 'text-gray-500'}"
      aria-current={active ? 'page' : undefined}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="size-5"
        aria-hidden="true"
      >
        <path d={iconPath(item.icon)} />
      </svg>
      {item.shortLabel}
    </a>
  {/each}
</nav>
