<script lang="ts">
  import '$src/app.css';
  import NavigationBar from '$components/nav/NavigationBar.svelte';
  import MobileTabBar from '$components/nav/MobileTabBar.svelte';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
  <title>Bluecoats Scores</title>
</svelte:head>

<div class="relative flex h-full flex-col">
  <NavigationBar />
  <main
    class="flex-1 overflow-y-auto overscroll-contain pb-[calc(4rem+env(safe-area-inset-bottom,0))] md:pb-0"
  >
    {@render children()}
  </main>
  <MobileTabBar />
</div>
