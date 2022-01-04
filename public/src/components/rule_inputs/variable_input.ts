import Vue from '../../vue.js'

import Select from '../shared/select.js'

import Proposition from '../../data/propositions/proposition.js'
import { lit } from '../../data/propositions/propositions.js'

export class VariableInputProps {
  readonly bank: Proposition[] = [];
  readonly target: Proposition = lit("");
  readonly forProposition: Proposition = lit("");
  readonly simplified?: boolean = false;
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
      return 'Recommended Variables:'
    case InputType.FREE:
      return 'Free Choice:'
  }
}

interface VariableInputData {
  inputType: InputType,
  errorMessage: null|string,
}

const DEFAULT_RECOMMENDATIONS = [
  "𝑥", "𝑦", "𝑧", "𝑖", "𝑗", "𝑘", "𝑚", "𝑛", "𝑢", "𝑣", "𝑤",
]

export default {
  props: Object.keys(new VariableInputProps()),
  emits: [ 'change' ],

  setup(props: VariableInputProps, {attrs, slots, emit}: any) {

    const initialData: VariableInputData = {
      inputType: InputType.RECOMMENDED,
      errorMessage: null,
    };
    const data: VariableInputData = Vue.reactive(initialData);

    function calculateRecommendations(): string[] {
      return DEFAULT_RECOMMENDATIONS.filter(r => {
        for (const p of props.bank) {
          if (p.numOccurances(r) > 0) {
            return false;
          }
        }
        if (props.target.numOccurances(r) > 0) {
          return false;
        }
        if (props.forProposition.numOccurances(r) > 0) {
          return false;
        }
        if (props.forProposition.allBoundVariables().indexOf(r) != -1) {
          return false;
        }
        return true;
      });
    }

    emit('change', calculateRecommendations()[0]);

    return () => {
      const recommendations = calculateRecommendations();

      const items = [];

      if (!props.simplified) {
        items.push(Vue.h(Select, {
          options: INPUT_TYPES.map(inputTypeToString),
          onChange: (i: number) => {
            data.inputType = INPUT_TYPES[i];
            if (data.inputType == InputType.RECOMMENDED) {
              emit('change', recommendations[0]);
            }
          },
        }));
      }
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
