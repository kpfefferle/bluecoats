import Route from '@ember/routing/route';
import { ALL_SEASONS, type SeasonScores } from 'bluecoats/data';

export type DailyRankingsModel = SeasonScores[];

export default class DailyRankingsRoute extends Route {
  model(): DailyRankingsModel {
    return ALL_SEASONS;
  }
}
