import Route from '@ember/routing/route';
import { ALL_SEASONS } from 'bluecoats/data';
import { type SeasonScores } from 'bluecoats/data/base';

export type IndexRouteModel = SeasonScores[];

export default class IndexRoute extends Route {
  model(): IndexRouteModel {
    return ALL_SEASONS.filter((season) => Boolean(season.scores.length));
  }
}
