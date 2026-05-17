<script lang="ts">
  import DesktopMenu from './DesktopMenu.svelte';
  import FinalsPill from './FinalsPill.svelte';
  import Logo from './Logo.svelte';
  import { nextFinalsSeason } from '$lib/utils/days-to-finals';

  const seasonYear = nextFinalsSeason()?.year;
</script>

<header
  class="bg-navy-900 border-b border-white/5 pt-[env(safe-area-inset-top,0)] text-white"
>
  <div
    class="mx-auto flex max-w-300 items-center gap-4 px-4 py-3 md:gap-7 md:px-6 md:py-3.5"
  >
    <Logo />
    <DesktopMenu />
    <div class="flex-1"></div>
    <div
      class="hidden items-center gap-4 text-[0.78125rem] text-white/60 lg:flex"
    >
      {#if seasonYear}
        <span>{seasonYear} season</span>
      {/if}
      <FinalsPill />
    </div>
  </div>
</header>
