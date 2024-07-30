import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { type IndexRouteModel } from 'bluecoats/routes/index';

export default class IndexController extends Controller {
  queryParams = ['year'];

  declare model: IndexRouteModel;

  @tracked year: number = 2024;

  @action onYearChange(year: number) {
    this.year = year;
  }
}
