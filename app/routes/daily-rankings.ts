import Route from '@ember/routing/route';
import { ALL_SEASONS } from 'bluecoats/data';
import { type SeasonScores } from 'bluecoats/data/base';

export type DailyRankingsModel = SeasonScores[];

export default class DailyRankingsRoute extends Route {
  model(): DailyRankingsModel {
    return ALL_SEASONS;
  }
}
