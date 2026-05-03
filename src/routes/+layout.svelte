<script lang="ts">
  import '$src/app.css';
  import NavigationBar from '$components/nav/NavigationBar.svelte';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
  <title>Bluecoats Scores</title>
</svelte:head>

<div class="min-h-full pb-[calc(4rem+env(safe-area-inset-bottom,0))] md:pb-0">
  <NavigationBar />
  {@render children()}
</div>
