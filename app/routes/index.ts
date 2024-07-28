import Route from '@ember/routing/route';
import { ALL_SEASONS, type SeasonScores } from 'bluecoats/data';

export type IndexRouteModel = SeasonScores[];

export default class IndexRoute extends Route {
  model(): IndexRouteModel {
    return ALL_SEASONS;
  }
}
