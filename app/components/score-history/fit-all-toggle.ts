import Component from '@glimmer/component';
import { action } from '@ember/object';

interface FitAllToggleSignature {
  Args: {
    fitAllSeasons: boolean;
    onFitAllSeasonsChange: (fitAll: boolean) => void;
  };
}

export default class FitAllToggleComponent extends Component<FitAllToggleSignature> {
  @action onChangeFitAllSeasons(event: Event) {
    let { checked } = event.target as HTMLInputElement;
    this.args.onFitAllSeasonsChange(checked);
  }
}
