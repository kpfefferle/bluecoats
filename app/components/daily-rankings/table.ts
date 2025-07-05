import Component from '@glimmer/component';
import { type DailyRankingsItem } from 'bluecoats/controllers/daily-rankings'

interface TableSignature {
  Args: {
    rankings: Array<DailyRankingsItem>;
  };
}

export default class TableComponent extends Component<TableSignature> {
  rankFromIndex = function(index: number): number {
    return index + 1;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'DailyRankings::Table': typeof TableComponent;
    'daily-rankings/table': typeof TableComponent;
  }
}
