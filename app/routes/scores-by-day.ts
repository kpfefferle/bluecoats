import Route from '@ember/routing/route';
import { ALL_SEASONS, type SeasonScores } from 'bluecoats/data';

export type ScoresByDayModel = SeasonScores[];

export default class ScoresByDayRoute extends Route {
  model(): ScoresByDayModel {
    return ALL_SEASONS;
  }
}
