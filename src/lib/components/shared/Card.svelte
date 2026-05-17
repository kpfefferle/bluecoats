<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    disablePadding = false,
    subtle = false,
    children,
  }: {
    disablePadding?: boolean;
    /** Use a soft gray surface instead of white (no shadow). */
    subtle?: boolean;
    children: Snippet;
  } = $props();
</script>

<div
  class="overflow-hidden rounded-xl border border-gray-200 {subtle
    ? 'bg-gray-50'
    : 'bg-white shadow-xs'}"
>
  <div class={disablePadding ? '' : 'px-4 py-5 sm:p-6'}>
    {@render children()}
  </div>
</div>
