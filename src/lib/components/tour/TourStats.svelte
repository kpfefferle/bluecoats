<script lang="ts">
  import Card from '$components/shared/Card.svelte';
  import type { TourSummary } from '$lib/utils/tour';

  let { summary, inProgress }: { summary: TourSummary; inProgress: boolean } =
    $props();
</script>

<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
  <Card>
    <div class="text-xs font-medium tracking-wide text-gray-500 uppercase">
      Season high
    </div>
    <div class="mt-1 text-2xl font-semibold tabular-nums text-gray-900">
      {summary.seasonHigh !== null ? summary.seasonHigh.toFixed(3) : '—'}
    </div>
    <div class="mt-0.5 text-xs text-gray-500">
      {inProgress
        ? 'so far'
        : summary.finalsRank !== null
          ? `Finals · #${summary.finalsRank} all-time`
          : 'best of tour'}
    </div>
  </Card>
  <Card>
    <div class="text-xs font-medium tracking-wide text-gray-500 uppercase">
      Climb across tour
    </div>
    <div class="mt-1 text-2xl font-semibold tabular-nums text-gray-900">
      {summary.climb !== null
        ? `${summary.climb >= 0 ? '+' : ''}${summary.climb.toFixed(2)}`
        : '—'}
    </div>
    <div class="mt-0.5 text-xs text-gray-500">first to latest score</div>
  </Card>
  <Card>
    <div class="text-xs font-medium tracking-wide text-gray-500 uppercase">
      Top-5 days
    </div>
    <div class="mt-1 text-2xl font-semibold tabular-nums text-gray-900">
      {summary.topFiveDays}
    </div>
    <div class="mt-0.5 text-xs text-gray-500">shows ranked top 5 all-time</div>
  </Card>
  <Card>
    <div class="text-xs font-medium tracking-wide text-gray-500 uppercase">
      All-time #1 days
    </div>
    <div class="mt-1 text-2xl font-semibold tabular-nums text-gray-900">
      {summary.allTimeBestDays}
    </div>
    <div class="mt-0.5 text-xs text-gray-500">scores still #1 today</div>
  </Card>
</div>
