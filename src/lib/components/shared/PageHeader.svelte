<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    title,
    subtitle,
    children,
  }: { title: string; subtitle?: string; children?: Snippet } = $props();
</script>

<header
  class="mx-auto flex max-w-300 items-start justify-between gap-4 px-4 pt-4 sm:pt-8 md:px-6"
>
  <div>
    <h1 class="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
    {#if subtitle}
      <p class="mt-1 text-sm text-gray-500">{subtitle}</p>
    {/if}
  </div>
  {#if children}
    <div>{@render children()}</div>
  {/if}
</header>
