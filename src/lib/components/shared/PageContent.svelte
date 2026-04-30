<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<main>
  <div class="mx-auto max-w-7xl overflow-auto px-4 py-6 sm:px-6 lg:px-8">
    {@render children()}
  </div>
</main>
