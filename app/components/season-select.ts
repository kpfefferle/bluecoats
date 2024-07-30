import Component from '@glimmer/component';
import { action } from '@ember/object';
import { type SeasonScores } from 'bluecoats/data';

interface SeasonSelectSignature {
  Args: {
    seasonScores: SeasonScores[];
    selectedYear: number;
    onYearChange: (year: number) => void;
  };
}

export default class SeasonSelectComponent extends Component<SeasonSelectSignature> {
  isSelectedYear = (year: number) => {
    return year === this.args.selectedYear;
  };

  @action onSelectYear(event: Event) {
    let { value } = event.target as HTMLSelectElement;
    this.args.onYearChange(parseInt(value));
  }
}
