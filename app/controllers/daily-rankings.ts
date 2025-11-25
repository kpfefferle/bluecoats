import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

import { type DailyRankingsModel } from 'bluecoats/routes/daily-rankings';

import { DateTime } from 'luxon';

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

  get selectedDay(): number {
    let { day, currentDay } = this;
    let selectedDay = day ? Number(day) : currentDay;
    return selectedDay >= 0 ? selectedDay : 0;
  }
  set selectedDay(value: number) {
    let { currentDay } = this;
    this.day = value === currentDay ? undefined : `${value}`;
  }

  onSelectedDayChange = (selectedDay: number): void => {
    this.selectedDay = selectedDay;
  };

  resetToToday = (): void => {
    this.selectedDay = this.currentDay;
  };
}
