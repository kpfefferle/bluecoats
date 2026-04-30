<script lang="ts">
  import { NAV_ITEMS } from './types.js';
  import DesktopMenu from './DesktopMenu.svelte';
  import Logo from './Logo.svelte';
  import MobileMenu from './MobileMenu.svelte';
  import MobileMenuToggle from './MobileMenuToggle.svelte';

  let isMobileMenuOpen = $state(false);

  function setIsMobileMenuOpen(value: boolean) {
    isMobileMenuOpen = value;
  }
</script>

<nav class="bg-blue-600">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex h-16 items-center justify-between">
      <div class="flex items-center">
        <Logo />
        <DesktopMenu navItems={NAV_ITEMS} />
      </div>
      <MobileMenuToggle {isMobileMenuOpen} {setIsMobileMenuOpen} />
    </div>
  </div>

  {#if isMobileMenuOpen}
    <MobileMenu
      navItems={NAV_ITEMS}
      onNavigate={() => setIsMobileMenuOpen(false)}
    />
  {/if}
</nav>
