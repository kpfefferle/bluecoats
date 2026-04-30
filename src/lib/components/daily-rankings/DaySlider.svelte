<script lang="ts">
  let {
    value,
    maximum,
    onChange,
  }: {
    value: number;
    maximum: number;
    onChange: (day: number) => void;
  } = $props();

  function handleInput(event: Event) {
    const target = event.currentTarget as HTMLInputElement;
    onChange(Math.abs(Number(target.value)));
  }
</script>

<div>
  <label
    class="mb-2 block text-sm/6 font-medium text-gray-900"
    for="day-slider"
  >
    Days before Finals
  </label>
  <input
    oninput={handleInput}
    class="w-full"
    id="day-slider"
    max="0"
    min={-maximum}
    step="1"
    type="range"
    value={-value}
  />
  <div class="flex justify-between">
    <span class="text-sm text-gray-500">{maximum} days</span>
    <span class="text-sm text-gray-500">Finals</span>
  </div>
</div>
