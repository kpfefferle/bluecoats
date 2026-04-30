<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    disablePadding = false,
    children,
  }: { disablePadding?: boolean; children: Snippet } = $props();
</script>

<div class="overflow-hidden rounded-lg bg-white shadow-sm">
  <div class={disablePadding ? '' : 'px-4 py-5 sm:p-6'}>
    {@render children()}
  </div>
</div>
