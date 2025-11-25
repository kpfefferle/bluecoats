import Component from '@glimmer/component';
import { action } from '@ember/object';
import { type SeasonScores } from 'bluecoats/data/base';

interface SeasonSelectSignature {
  Args: {
    seasonScores: SeasonScores[];
    selectedYears: Array<SeasonScores['year']>;
    onSelectedYearsChange: (selectedYears: Array<SeasonScores['year']>) => void;
  };
}

export default class SeasonSelectComponent extends Component<SeasonSelectSignature> {
  isSelectedYear = (year: SeasonScores['year']) => {
    let { selectedYears } = this.args;
    return selectedYears.includes(year);
  };

  @action onSelectYear(event: Event) {
    let { value } = event.target as HTMLSelectElement;
    this.args.onSelectedYearsChange([value]);
  }
}
