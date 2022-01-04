import Vue from '../../vue.js'

import Select from '../shared/select.js'

import Proposition from '../../data/propositions/proposition.js'
import {lit} from '../../data/propositions/propositions.js'

export class NewTermInputProps {
  readonly bank: Proposition[] = [];
  readonly target: Proposition = lit("");
}

enum InputType {
  RECOMMENDED = 0,
  FREE = 1,
}

const INPUT_TYPES = [
  InputType.RECOMMENDED,
  InputType.FREE,
]

function inputTypeToString(t: InputType): string {
  switch(t) {
    case InputType.RECOMMENDED:
      return 'Recommended Expressions:'
    case InputType.FREE:
      return 'Free Choice:'
  }
}

interface NewTermInputData {
  inputType: InputType,
  errorMessage: null|string,
}

const DEFAULT_RECOMMENDATIONS = [
  "𝑎", "𝑏", "𝑐", "𝑑", "𝑒",
]

export default {
  props: Object.keys(new NewTermInputProps()),
  emits: [ 'change' ],

  setup(props: NewTermInputProps, {attrs, slots, emit}: any) {

    const initialData: NewTermInputData = {
      inputType: InputType.RECOMMENDED,
      errorMessage: null,
    };
    const data: NewTermInputData = Vue.reactive(initialData);

    const recommendations: string[] = DEFAULT_RECOMMENDATIONS.filter(r => {
        for (const p of props.bank) {
          if (p.numOccurances(r) > 0 || p.allBoundVariables().indexOf(r) != -1) {
            return false;
          }
        }
        if (props.target.numOccurances(r) > 0 || props.target.allBoundVariables().indexOf(r) != -1) {
          return false;
        }
        return true;
    })

    emit('change', recommendations[0]);

    return () => {
      const items = [];

      items.push(Vue.h(Select, {
        options: INPUT_TYPES.map(inputTypeToString),
        onChange: (i: number) => {
          data.inputType = INPUT_TYPES[i];
          if (data.inputType == InputType.RECOMMENDED) {
            emit('change', recommendations[0]);
          }
        },
      }));
      if (data.inputType == InputType.RECOMMENDED) {
        items.push(Vue.h(Select, {
          options: recommendations,
          onChange: (i: number) => {
            emit('change', recommendations[i])
          },
        }));
      } else {
        // TODO
        items.push(Vue.h('span', {}, "TODO"))
      }

      return Vue.h('div', {}, items);
    }
  }
}
