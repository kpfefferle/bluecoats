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
    let { day, defaultDay } = this;
    return day ? Number(day) : defaultDay;
  }
  set selectedDay(value: number) {
    let { defaultDay } = this;
    this.day = value === defaultDay ? undefined : `${value}`;
  }

  get defaultDay(): number {
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

  @action onSelectedDayChange(selectedDay: number) {
    this.selectedDay = selectedDay;
  }
}
