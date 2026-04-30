<script lang="ts">
  import '../app.css';
  import NavigationBar from '$components/nav/NavigationBar.svelte';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<svelte:head>
  <title>Bluecoats Scores</title>
</svelte:head>

<div class="min-h-full">
  <NavigationBar />
  {@render children()}
</div>
