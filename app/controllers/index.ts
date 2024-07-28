import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { type IndexRouteModel } from 'bluecoats/routes/index';

export default class IndexController extends Controller {
  queryParams = ['year'];

  declare model: IndexRouteModel;

  @tracked year: number = 2024;
}
