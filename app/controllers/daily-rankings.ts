import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { type Score, type SeasonScores } from 'bluecoats/data/base';
import { type DailyRankingsModel } from 'bluecoats/routes/daily-rankings';
import { DateTime } from 'luxon';

export interface DailyRankingsItem {
  daysOld: number;
  location: Score['location'];
  rank: number;
  score: Score['score'];
  year: SeasonScores['year'];
}

export default class DailyRankingsController extends Controller {
  queryParams = ['day'];

  declare model: DailyRankingsModel;

  @tracked day?: string;

  get currentDay(): number {
    let { model } = this;
    let latestSeason = model.at(-1)!;
    let latestFinalsDate = DateTime.fromISO(latestSeason.endDate);
    let currentDate = DateTime.now();
    if (currentDate > latestFinalsDate) {
      return 0;
    } else {
      return Math.ceil(latestFinalsDate.diff(currentDate, 'days').days);
    }
  }

  get dailyRankings(): Array<DailyRankingsItem> {
    let { model, selectedDay } = this;
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

  get selectedDay(): number {
    let { day, currentDay } = this;
    let selectedDay = day ? Number(day) : currentDay;
    return selectedDay >= 0 ? selectedDay : 0;
  }
  set selectedDay(value: number) {
    let { currentDay } = this;
    this.day = value === currentDay ? undefined : `${value}`;
  }

  get maxDay(): number {
    let { model } = this;
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

  @action onSelectedDayChange(selectedDay: number): void {
    this.selectedDay = selectedDay;
  }

  @action resetToToday(): void {
    this.selectedDay = this.currentDay;
  }
}
