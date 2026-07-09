<script lang="ts">
  import { resolve } from '$app/paths';
  import Card from '$components/shared/Card.svelte';
  import PageContent from '$components/shared/PageContent.svelte';
  import SeasonScoresChart from '$components/score-history/SeasonScoresChart.svelte';
  import ClosestSeasons from '$components/today/ClosestSeasons.svelte';
  import TodayHero from '$components/today/TodayHero.svelte';
  import { ALL_SEASONS_INCLUDING_SCHEDULED, POPULATED_SEASONS } from '$data';
  import {
    currentDayUntilFinals,
    maxDayBeforeFinals,
  } from '$lib/utils/daily-ranking';
  import { getFeaturedSeason } from '$lib/utils/featured-season';
  import { buildTodayPage, closestSeasons } from '$lib/utils/today';

  const featured = getFeaturedSeason(POPULATED_SEASONS);
  const maxDay = maxDayBeforeFinals(POPULATED_SEASONS);
  const currentDay = currentDayUntilFinals(
    ALL_SEASONS_INCLUDING_SCHEDULED,
    maxDay,
  );
  // A completed featured season ranks on finals night; a live one ranks today.
  const day = featured?.inProgress ? currentDay : 0;
  const today = featured
    ? buildTodayPage(POPULATED_SEASONS, featured, day)
    : undefined;
  const closest =
    featured && today
      ? closestSeasons(today.rankings, featured.season.year)
      : [];
  const dayLabel =
    day === 0
      ? 'at Finals night'
      : `at ${day} ${day === 1 ? 'day' : 'days'} before Finals`;
</script>

<svelte:head>
  <title>Today | Bluecoats Scores</title>
</svelte:head>

{#if featured && today}
  <PageContent>
    <div class="grid grid-cols-1 gap-4">
      <TodayHero hero={today.hero} />

      <Card disablePadding>
        <div
          class="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-4 sm:px-6"
        >
          <div>
            <div class="text-sm font-semibold text-gray-900">
              {today.hero.year} in context
            </div>
            <div class="text-xs text-gray-500">
              Each thin line is one past season's tour · gold marks championship
              seasons
            </div>
          </div>
          <a
            href={resolve('/score-history')}
            class="rounded-md px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100"
          >
            Open full chart →
          </a>
        </div>
        <div class="flex h-100 flex-col overflow-x-auto px-2 py-2">
          <SeasonScoresChart
            seasonScores={POPULATED_SEASONS}
            selectedYears={[]}
            featuredYear={featured.season.year}
            featuredInProgress={featured.inProgress}
          />
        </div>
      </Card>

      <Card disablePadding>
        <div
          class="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-4 sm:px-6"
        >
          <div>
            <div class="text-sm font-semibold text-gray-900">
              {today.hero.inProgress
                ? `Closest to ${today.hero.year} right now`
                : 'All-time finals leaderboard'}
            </div>
            <div class="text-xs text-gray-500">
              {#if closest.length > 0 && closest[0] !== today.rankings[0]}
                Seasons ranked #{closest[0].rank}–#{closest[closest.length - 1]
                  .rank}
                {dayLabel}
              {:else}
                Top {closest.length} seasons {dayLabel}
              {/if}
            </div>
          </div>
          <a
            href={resolve('/daily-ranking')}
            class="rounded-md px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100"
          >
            View full ranking →
          </a>
        </div>
        <ClosestSeasons
          items={closest}
          featuredYear={featured.season.year}
          featuredScore={today.hero.latest.score}
        />
      </Card>
    </div>
  </PageContent>
{/if}
