import Vue from '../../vue.js'

import Select from '../shared/select.js'

import Term from '../../data/terms/term.js'
import { litTerm } from '../../data/terms/literal.js'

import Predicate from '../../data/predicates/predicate.js'
import { lit } from '../../data/predicates/literal.js'

export class VariableInputProps {
  readonly bank: Predicate[] = [];
  readonly target: Predicate = lit("");
  readonly forProposition: Predicate = lit("");
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
  litTerm("𝑥"),
  litTerm("𝑦"),
  litTerm("𝑧"),
  litTerm("𝑖"),
  litTerm("𝑗"),
  litTerm("𝑘"),
  litTerm("𝑚"),
  litTerm("𝑛"),
  litTerm("𝑢"),
  litTerm("𝑣"),
  litTerm("𝑤"),
]

const VariableInputComponent = {
  props: Object.keys(new VariableInputProps()),
  emits: [ 'change' ],

  setup(props: VariableInputProps, {emit}: any) {

    const initialData: VariableInputData = {
      inputType: InputType.RECOMMENDED,
      errorMessage: null,
    };
    const data: VariableInputData = Vue.reactive(initialData);

    function calculateRecommendations(): Term[] {
      return DEFAULT_RECOMMENDATIONS.filter(r => {
        for (const p of props.bank) {
          if (!p.isBound(r) && p.occures(r)) {
            return false;
          }
        }
        if (!props.target.isBound(r) && props.target.occures(r)) {
          return false;
        }
        if (props.forProposition.occures(r) || props.forProposition.isBound(r)) {
          return false;
        }
        return true;
      });
    }

    emit('change', calculateRecommendations()[0]);

    return () => {
      const recommendations = calculateRecommendations();

      const items = [];

      // if (!props.simplified) {
      //   items.push(Vue.h(Select, {
      //     options: INPUT_TYPES.map(inputTypeToString),
      //     onChange: (i: number) => {
      //       data.inputType = INPUT_TYPES[i];
      //       if (data.inputType == InputType.RECOMMENDED) {
      //         emit('change', recommendations[0]);
      //       }
      //     },
      //   }));
      // }
      if (data.inputType == InputType.RECOMMENDED) {
        items.push(Vue.h(Select, {
          options: recommendations.map(v => v.toString()),
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

export function makeVariableInput(p: VariableInputProps, extra: any = {}) {
  return Vue.h(VariableInputComponent, Object.assign(p, extra));
}
