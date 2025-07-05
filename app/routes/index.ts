import Route from '@ember/routing/route';
import type IndexController from 'bluecoats/controllers/index';
import { ALL_SEASONS, type SeasonScores } from 'bluecoats/data';

export type IndexRouteModel = SeasonScores[];

export default class IndexRoute extends Route {
  model(): IndexRouteModel {
    return ALL_SEASONS.filter((season) => Boolean(season.scores.length));
  }

  setupController(controller: IndexController, model: IndexRouteModel) {
    super.setupController(controller, model);
    let lastSeason = model.slice(-1)[0]!;
    controller.years = lastSeason.year;
  }
}
