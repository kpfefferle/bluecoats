import Component from '@glimmer/component';
import { action } from '@ember/object';

interface DaySliderSignature {
  Args: {
    maximum: number;
    onChange: (day: number) => void;
    value: number;
  };
}

export default class DaySliderComponent extends Component<DaySliderSignature> {
  @action onChange(event: Event): void {
    let { target } = event;
    if (target instanceof EventTarget) {
      let { value } = target as HTMLInputElement;
      let newValue = Math.abs(Number(value));
      this.args.onChange(newValue);
    }
  }
}
