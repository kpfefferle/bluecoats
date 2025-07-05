import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { type DailyRankingsModel } from 'bluecoats/routes/daily-rankings';
import { DateTime } from 'luxon';

export default class DailyRankingsController extends Controller {
  queryParams = ['day'];

  declare model: DailyRankingsModel;

  @tracked day?: string;

  get selectedDay(): number {
    let { day, currentDay } = this;
    return day ? Number(day) : currentDay;
  }
  set selectedDay(value: number) {
    let { currentDay } = this;
    this.day = value === currentDay ? undefined : `${value}`;
  }

  get currentDay(): number {
    let { model } = this;
    let latestSeason = model.slice(-1)[0]!;
    let latestFinalsDate = DateTime.fromISO(latestSeason.endDate);
    let currentDate = DateTime.now();
    if (currentDate > latestFinalsDate) {
      return 0;
    } else {
      return Math.ceil(latestFinalsDate.diff(currentDate, 'days').days);
    }
  }

  get maxDay(): number {
    let { model } = this;
    let seasonDays = model.map((season) => {
      let firstScore = season.scores[0];
      if (!firstScore) {
        return;
      }
      let firstScoreDate = DateTime.fromISO(firstScore.date);
      let finalsDate = DateTime.fromISO(season.endDate);
      return finalsDate.diff(firstScoreDate, 'days').days;
    }).filter((days) => days !== undefined);
    return Math.max(...seasonDays);
  }

  @action onSelectedDayChange(selectedDay: number) {
    this.selectedDay = selectedDay;
  }
}
