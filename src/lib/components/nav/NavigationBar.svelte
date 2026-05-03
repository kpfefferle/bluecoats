<script lang="ts">
  import { NAV_ITEMS } from './types';
  import DesktopMenu from './DesktopMenu.svelte';
  import FinalsPill from './FinalsPill.svelte';
  import Logo from './Logo.svelte';
  import MobileTabBar from './MobileTabBar.svelte';
</script>

<header class="bg-navy-900 border-b border-white/5 text-white">
  <div
    class="mx-auto flex max-w-300 items-center gap-4 px-4 py-3 md:gap-7 md:px-6 md:py-3.5"
  >
    <Logo />
    <DesktopMenu navItems={NAV_ITEMS} />
    <div class="flex-1"></div>
    <div
      class="hidden items-center gap-4 text-[0.78125rem] text-white/60 md:flex"
    >
      <span>2026 season</span>
      <FinalsPill />
    </div>
    <div class="md:hidden">
      <FinalsPill />
    </div>
  </div>
</header>

<MobileTabBar />
