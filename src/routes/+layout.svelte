<script lang="ts">
  import '../app.css';
  import NavigationBar from '$components/nav/NavigationBar.svelte';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
  <title>Bluecoats Scores</title>
</svelte:head>

<div class="min-h-full pb-[calc(64px+env(safe-area-inset-bottom,0px))] md:pb-0">
  <NavigationBar />
  {@render children()}
</div>
