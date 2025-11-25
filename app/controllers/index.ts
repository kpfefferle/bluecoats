import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

import { type SeasonScores } from 'bluecoats/data/base';

export default class IndexController extends Controller {
  queryParams = ['fitAll', 'years'];

  @tracked fitAll: boolean = false;
  @tracked years: string = '2025';

  get selectedYears(): Array<SeasonScores['year']> {
    return this.years.split(',').sort().reverse();
  }
  set selectedYears(value: Array<SeasonScores['year']>) {
    this.years = value.join(',');
  }

  onFitAllChange = (fitAll: boolean): void => {
    this.fitAll = fitAll;
  };

  onSelectedYearsChange = (
    selectedYears: Array<SeasonScores['year']>,
  ): void => {
    this.selectedYears = selectedYears;
  };
}
