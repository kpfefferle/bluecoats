<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    title,
    subtitle,
    children,
  }: { title: string; subtitle?: string; children?: Snippet } = $props();
</script>

<header class="bg-white shadow-xs">
  <div
    class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center"
  >
    <div>
      <h1 class="text-lg/6 font-semibold text-gray-900">{title}</h1>
      {#if subtitle}
        <div class="mt-2 flex items-center text-sm text-gray-500">
          {subtitle}
        </div>
      {/if}
    </div>
    <div>
      {@render children?.()}
    </div>
  </div>
</header>
