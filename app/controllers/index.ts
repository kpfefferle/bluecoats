import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { type IndexRouteModel } from 'bluecoats/routes/index';

export default class IndexController extends Controller {
  queryParams = ['fitAll', 'years'];

  declare model: IndexRouteModel;

  @tracked fitAll: boolean = false;
  @tracked years: string = '2024';

  get selectedYears(): Array<number> {
    return this.years.split(',').map(Number).sort().reverse();
  }
  set selectedYears(value: Array<number>) {
    this.years = value.join(',');
  }

  @action onFitAllChange(fitAll: boolean) {
    this.fitAll = fitAll;
  }

  @action onSelectedYearsChange(selectedYears: Array<number>) {
    this.selectedYears = selectedYears;
  }
}
