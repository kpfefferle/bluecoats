import Component from '@glimmer/component';
import { action } from '@ember/object';
import { type SeasonScores } from 'bluecoats/data';

interface SeasonSelectSignature {
  Args: {
    seasonScores: SeasonScores[];
    selectedYears: Array<number>;
    onSelectedYearsChange: (selectedYears: Array<number>) => void;
  };
}

export default class SeasonSelectComponent extends Component<SeasonSelectSignature> {
  isSelectedYear = (year: number) => {
    let { selectedYears } = this.args;
    return selectedYears.includes(year);
  };

  @action onSelectYear(event: Event) {
    let { value } = event.target as HTMLSelectElement;
    this.args.onSelectedYearsChange([parseInt(value)]);
  }
}
