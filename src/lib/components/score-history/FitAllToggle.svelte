<script lang="ts">
  let {
    fitAllSeasons,
    onChange,
  }: {
    fitAllSeasons: boolean;
    onChange: (fitAll: boolean) => void;
  } = $props();
</script>

<div class="flex items-center gap-3">
  <div
    class="group relative inline-flex w-11 shrink-0 rounded-full bg-gray-200 p-0.5 inset-ring inset-ring-gray-900/5 outline-offset-2 outline-blue-600 transition-colors duration-200 ease-in-out has-checked:bg-blue-600 has-focus-visible:outline-2"
  >
    <span
      class="size-5 rounded-full bg-white shadow-xs ring-1 ring-gray-900/5 transition-transform duration-200 ease-in-out group-has-checked:translate-x-5"
    ></span>
    <input
      onchange={(e) => onChange(e.currentTarget.checked)}
      aria-labelledby="fit-all-seasons-label"
      checked={fitAllSeasons}
      class="absolute inset-0 appearance-none focus:outline-hidden"
      id="fit-all-seasons"
      name="fit-all-seasons"
      type="checkbox"
    />
  </div>
  <div class="text-sm">
    <label
      id="fit-all-seasons-label"
      for="fit-all-seasons"
      class="font-medium text-gray-900"
    >
      Fit all seasons
    </label>
  </div>
</div>
