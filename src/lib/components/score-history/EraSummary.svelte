<script lang="ts">
  import { ERAS } from '$data/eras';
</script>

<div
  class="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-gray-200 pt-4 sm:grid-cols-4 sm:gap-x-0"
>
  {#each ERAS as era (era.from)}
    <div class="sm:border-r sm:border-gray-200 sm:pr-3.5 sm:last:border-r-0">
      <div
        class="text-[0.6875rem] font-semibold tracking-wide text-gray-500 uppercase"
      >
        {era.from}&ndash;{era.to}
      </div>
      <div class="mt-0.5 text-sm font-semibold text-gray-900">{era.name}</div>
      <div class="mt-0.5 text-xs leading-snug text-gray-500">
        {era.description}
      </div>
    </div>
  {/each}
</div>
