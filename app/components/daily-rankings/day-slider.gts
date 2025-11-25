import Component from '@glimmer/component';
import { on } from '@ember/modifier';

interface DaySliderSignature {
  Args: {
    maximum: number;
    onChange: (day: number) => void;
    value: number;
  };
}

export default class DaySlider extends Component<DaySliderSignature> {
  onChange = (event: Event): void => {
    let { target } = event;
    if (target instanceof EventTarget) {
      let { value } = target as HTMLInputElement;
      let newValue = Math.abs(Number(value));
      this.args.onChange(newValue);
    }
  };

  <template>
    <div>
      <label
        class="block text-sm/6 font-medium text-gray-900 mb-2"
        for="day-slider"
      >
        Days before Finals
      </label>
      <input
        {{on "input" this.onChange}}
        class="w-full"
        id="day-slider"
        max="0"
        min="-{{@maximum}}"
        step="1"
        type="range"
        value="-{{@value}}"
      />
      <div class="flex justify-between">
        <span class="text-sm text-gray-500">
          {{@maximum}}
          days
        </span>
        <span class="text-sm text-gray-500">
          Finals
        </span>
      </div>
    </div>
  </template>
}
