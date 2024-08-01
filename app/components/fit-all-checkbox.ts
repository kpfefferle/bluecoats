import Component from '@glimmer/component';
import { action } from '@ember/object';

interface FitAllCheckboxSignature {
  Args: {
    fitAllSeasons: boolean;
    onFitAllSeasonsChange: (fitAll: boolean) => void;
  };
}

export default class FitAllCheckboxComponent extends Component<FitAllCheckboxSignature> {
  @action onChangeFitAllSeasons(event: Event) {
    let { checked } = event.target as HTMLInputElement;
    this.args.onFitAllSeasonsChange(checked);
  }
}
