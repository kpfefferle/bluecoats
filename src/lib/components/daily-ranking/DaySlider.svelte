<script lang="ts">
  let {
    value,
    maximum,
    currentDay,
    onChange,
  }: {
    value: number;
    maximum: number;
    currentDay: number;
    onChange: (day: number) => void;
  } = $props();

  const BASE_CHIPS = [45, 28, 14, 7, 0];

  const chips = $derived.by(() => {
    const days = BASE_CHIPS.filter((d) => d <= maximum);
    const showToday = currentDay > 0 && currentDay <= maximum;
    if (showToday && !days.includes(currentDay)) days.push(currentDay);
    return days
      .sort((a, b) => b - a)
      .map((day) => ({
        day,
        label: day === 0 ? 'Finals' : day === currentDay ? 'Today' : `${day}d`,
      }));
  });

  const descriptor = $derived(
    value === 0
      ? 'Finals night'
      : value < 7
        ? 'last week'
        : value < 14
          ? 'late tour'
          : value < 28
            ? 'mid tour'
            : 'early tour',
  );

  const fillPct = $derived(
    maximum === 0 ? 0 : ((maximum - value) / maximum) * 100,
  );
</script>

<div>
  <div class="mb-3 flex flex-wrap items-end justify-between gap-3">
    <div>
      <div
        class="text-xs font-medium tracking-wide text-gray-500 uppercase"
        id="day-slider-label"
      >
        Days before Finals
      </div>
      <div class="mt-1 flex items-baseline gap-2.5">
        <span
          class="text-3xl font-semibold tracking-tight text-gray-900 tabular-nums"
        >
          {value}
        </span>
        <span class="text-sm text-gray-500">{descriptor}</span>
      </div>
    </div>
    <div class="flex flex-wrap gap-1.5">
      {#each chips as chip (chip.day)}
        {@const active = value === chip.day}
        <button
          type="button"
          onclick={() => onChange(chip.day)}
          class="rounded-full border px-2.5 py-1 text-xs font-medium tabular-nums {active
            ? 'border-transparent bg-blue-50 text-blue-700'
            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900'}"
          aria-pressed={active}
        >
          {chip.label}
        </button>
      {/each}
    </div>
  </div>
  <input
    oninput={(e) => onChange(Math.abs(Number(e.currentTarget.value)))}
    class="day-range w-full"
    id="day-slider"
    aria-labelledby="day-slider-label"
    aria-label="Days before Finals"
    max="0"
    min={-maximum}
    step="1"
    type="range"
    value={-value}
    style="--fill: {fillPct}%"
  />
  <div class="mt-1 flex justify-between text-xs text-gray-500 tabular-nums">
    <span>{maximum} days</span>
    <span>Finals</span>
  </div>
</div>

<style>
  .day-range {
    appearance: none;
    -webkit-appearance: none;
    height: 0.375rem;
    border-radius: 9999px;
    background: linear-gradient(
      to right,
      var(--color-brand-600) 0%,
      var(--color-brand-600) var(--fill, 0%),
      #e5e7eb var(--fill, 0%),
      #e5e7eb 100%
    );
    outline: none;
    margin: 0.5rem 0;
  }
  .day-range::-webkit-slider-runnable-track {
    height: 0.375rem;
    background: transparent;
    border-radius: 9999px;
  }
  .day-range::-webkit-slider-thumb {
    appearance: none;
    -webkit-appearance: none;
    width: 1.125rem;
    height: 1.125rem;
    margin-top: -0.375rem;
    border-radius: 9999px;
    background: #ffffff;
    border: 2px solid var(--color-brand-600);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
    cursor: pointer;
  }
  .day-range::-moz-range-track {
    height: 0.375rem;
    background: transparent;
    border-radius: 9999px;
  }
  .day-range::-moz-range-thumb {
    width: 1.125rem;
    height: 1.125rem;
    border-radius: 9999px;
    background: #ffffff;
    border: 2px solid var(--color-brand-600);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
    cursor: pointer;
  }
</style>
