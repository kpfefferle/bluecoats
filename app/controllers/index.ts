import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import { type SeasonScores } from 'bluecoats/data/base';
import { type IndexRouteModel } from 'bluecoats/routes/index';

export default class IndexController extends Controller {
  queryParams = ['fitAll', 'years'];

  declare model: IndexRouteModel;

  @tracked fitAll: boolean = false;
  @tracked years: string = '2025';

  get selectedYears(): Array<SeasonScores['year']> {
    return this.years.split(',').sort().reverse();
  }
  set selectedYears(value: Array<SeasonScores['year']>) {
    this.years = value.join(',');
  }

  @action onFitAllChange(fitAll: boolean) {
    this.fitAll = fitAll;
  }

  @action onSelectedYearsChange(selectedYears: Array<SeasonScores['year']>) {
    this.selectedYears = selectedYears;
  }
}
