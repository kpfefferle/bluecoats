import Component from '@glimmer/component';
import { concat } from '@ember/helper';
import { on } from '@ember/modifier';

import { type DailyRankingsModel } from 'bluecoats/routes/daily-rankings';
import DailyRankingsController from 'bluecoats/controllers/daily-rankings';

import DaySlider from 'bluecoats/components/daily-rankings/day-slider';
import Table from 'bluecoats/components/daily-rankings/table';
import Card from 'bluecoats/components/shared/card';
import PageContent from 'bluecoats/components/shared/page-content';
import PageHeader from 'bluecoats/components/shared/page-header';
import { type Score, type SeasonScores } from 'bluecoats/data/base';

import { pageTitle } from 'ember-page-title';
import { eq, gt, notEq } from 'ember-truth-helpers';
import { DateTime } from 'luxon';

export interface DailyRankingsItem {
  daysOld: number;
  location: Score['location'];
  rank: number;
  score: Score['score'];
  year: SeasonScores['year'];
}

interface DailyRankingsSignature {
  Args: {
    controller: DailyRankingsController;
    model: DailyRankingsModel;
  };
}

export default class extends Component<DailyRankingsSignature> {
  get dailyRankings(): Array<DailyRankingsItem> {
    let {
      model,
      controller: { selectedDay },
    } = this.args;
    let sortedRankings = model
      .map((season) => {
        return this.rankingsItemForSelectedDay(season, selectedDay);
      })
      .filter((item) => item !== undefined)
      .sort((itemA, itemB) => itemB.score - itemA.score);
    return sortedRankings.map((rankingItem) => {
      let firstMatchingScoreIndex = sortedRankings.findIndex((item) => {
        return item.score === rankingItem.score;
      });
      return {
        rank: firstMatchingScoreIndex + 1,
        ...rankingItem,
      };
    });
  }

  private rankingsItemForSelectedDay(
    season: SeasonScores,
    selectedDay: number,
  ): Omit<DailyRankingsItem, 'rank'> | undefined {
    let finalsDateTime = DateTime.fromISO(season.endDate);
    let scores = season.scores.filter((score) => {
      let scoreDateTime = DateTime.fromISO(score.date);
      let daysToFinals = Math.ceil(
        finalsDateTime.diff(scoreDateTime, 'days').days,
      );
      return daysToFinals >= selectedDay;
    });
    let latestScore = scores.at(-1);
    if (latestScore === undefined) {
      return;
    }
    return {
      daysOld:
        Math.ceil(
          finalsDateTime.diff(DateTime.fromISO(latestScore.date), 'days').days,
        ) - selectedDay,
      location: latestScore.location,
      score: latestScore.score,
      year: season.year,
    };
  }

  get maxDay(): number {
    let { model } = this.args;
    let seasonDays = model
      .map((season) => {
        let firstScore = season.scores[0];
        if (!firstScore) {
          return;
        }
        let firstScoreDate = DateTime.fromISO(firstScore.date);
        let finalsDate = DateTime.fromISO(season.endDate);
        return finalsDate.diff(firstScoreDate, 'days').days;
      })
      .filter((days) => days !== undefined);
    return Math.max(...seasonDays);
  }

  <template>
    {{pageTitle "Daily Rankings"}}

    <PageHeader
      @title="Daily Rankings"
      @subtitle={{if
        (eq @controller.selectedDay 0)
        "Finals Day"
        (concat
          @controller.selectedDay
          (if (gt @controller.selectedDay 1) " days" " day")
          " before DCI Finals"
        )
      }}
    >
      {{#if (notEq @controller.selectedDay @controller.currentDay)}}
        <button
          {{on "click" @controller.resetToToday}}
          class="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          type="button"
        >
          Reset to Today
        </button>
      {{/if}}
    </PageHeader>
    <PageContent>
      <div class="grid grid-cols-1 gap-4">
        <Card>
          <DaySlider
            @maximum={{this.maxDay}}
            @onChange={{@controller.onSelectedDayChange}}
            @value={{@controller.selectedDay}}
          />
        </Card>
        <Card @disablePadding={{true}}>
          <Table @rankings={{this.dailyRankings}} />
        </Card>
      </div>
    </PageContent>
  </template>
}
