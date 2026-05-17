<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<main>
  <div class="mx-auto max-w-300 overflow-auto px-4 py-6 md:px-6">
    {@render children()}
  </div>
</main>
