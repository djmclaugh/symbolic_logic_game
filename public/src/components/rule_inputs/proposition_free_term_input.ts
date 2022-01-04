import Vue from '../../vue.js'

import Select from '../shared/select.js'

import Proposition from '../../data/propositions/proposition.js'
import { lit } from '../../data/propositions/propositions.js'

export class PropositionFreeTermInputProps {
  readonly proposition: Proposition = lit("");
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
      return 'Expressions Already In Use:'
    case InputType.FREE:
      return 'Free Choice:'
  }
}

interface PropositionFreeTermInputData {
  inputType: InputType,
  errorMessage: null|string,
}

export default {
  props: Object.keys(new PropositionFreeTermInputProps()),
  emits: [ 'change' ],

  setup(props: PropositionFreeTermInputProps, {attrs, slots, emit}: any) {

    const initialData: PropositionFreeTermInputData = {
      inputType: InputType.RECOMMENDED,
      errorMessage: null,
    };
    const data: PropositionFreeTermInputData = Vue.reactive(initialData);

    const recommendations: string[] = [];
    for (const t of props.proposition.allTerms()) {
      if (recommendations.indexOf(t) == -1) {
        recommendations.push(t);
      }
    }

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
