import Component from '@glimmer/component';
import { type DailyRankingsItem } from 'bluecoats/controllers/daily-rankings'

interface TableSignature {
  Args: {
    rankings: Array<DailyRankingsItem>;
  };
}

export default class TableComponent extends Component<TableSignature> {
  ordinalFor = function(rank: number): string {
    if (Math.floor(rank / 10) === 1) {
      return 'th';
    } else if (rank % 10 === 1) {
      return 'st';
    } else if (rank % 10 === 2) {
      return 'nd';
    } else if (rank % 10 === 3) {
      return 'rd';
    } else {
      return 'th';
    }
  }

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
