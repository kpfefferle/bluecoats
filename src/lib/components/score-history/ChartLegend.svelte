<script lang="ts">
  let { featuredYear }: { featuredYear?: string } = $props();
</script>

<div class="flex items-center gap-3.5 text-xs text-gray-500">
  <span class="inline-flex items-center gap-1.5">
    <span class="bg-brand-600 inline-block h-0.5 w-3.5"></span>
    {featuredYear ?? 'Latest'}
  </span>
  <span class="inline-flex items-center gap-1.5">
    <span class="bg-gold-500 inline-block h-0.5 w-3.5"></span>
    Champion
  </span>
  <span class="inline-flex items-center gap-1.5">
    <span class="bg-navy-900 inline-block h-0.5 w-3.5"></span>
    Compare
  </span>
</div>
