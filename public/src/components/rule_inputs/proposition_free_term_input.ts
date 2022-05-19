import Vue from '../../vue.js'

import Select from '../shared/select.js'

import Term from '../../data/terms/term.js'

import Predicate, { allTerms } from '../../data/predicates/predicate.js'
import { lit } from '../../data/predicates/literal.js'

export class PropositionFreeTermInputProps {
  readonly proposition: Predicate = lit("");
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

const PropositionFreeTermInputComponent = {
  props: Object.keys(new PropositionFreeTermInputProps()),
  emits: [ 'change' ],

  setup(props: PropositionFreeTermInputProps, {emit}: any) {

    const initialData: PropositionFreeTermInputData = {
      inputType: InputType.RECOMMENDED,
      errorMessage: null,
    };
    const data: PropositionFreeTermInputData = Vue.reactive(initialData);

    const recommendations: Term[] = [];
    for (const t of allTerms([props.proposition])) {
      if (recommendations.some(r => r.equals(t))) {
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

export function makePropositionFreeTermInput(p: PropositionFreeTermInputProps, extra: any = {}) {
  return Vue.h(PropositionFreeTermInputComponent, Object.assign(p, extra));
}
