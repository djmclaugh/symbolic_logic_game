import Vue from '../../vue.js'

import Select from '../shared/select.js'
import { makeFreeTermInput } from './free_term_input.js'

import FunctionTerm from '../../data/terms/function.js'
import Term from '../../data/terms/term.js'
import { emptySlot } from '../../data/predicates/util.js'
import Predicate from '../../data/predicates/predicate.js'

class LiteralPropositionInputProps {
  readonly allPredicates: Predicate[] = [];
  readonly allTerms: Term[] = []
  readonly allFunctions: FunctionTerm[] = []
}

interface LiteralPropositionInputData {
  choice: number|null,
  termChoices: Term[],
}

const LiteralPropositionsInputComponent = {
  props: Object.keys(new LiteralPropositionInputProps()),
  emits: ['change'],

  setup(props: LiteralPropositionInputProps, {emit}: any) {
    const initialData: LiteralPropositionInputData = {
      choice: null,
      termChoices: [],
    };
    const data: LiteralPropositionInputData = Vue.reactive(initialData);

    function chosenProposition(): Predicate|null {
      if (data.choice === null) {
        return null;
      }
      const pred = props.allPredicates[data.choice];
      return pred.withSlots(data.termChoices);
    }

    emit('change', chosenProposition());

    return () => {
      const items = [];
      items.push(Vue.h(Select, {
        objectType: 'a proposition',
        options: props.allPredicates.map(p => p.toString()),
        onChange: (index: number|null) => {
          data.choice = index;
          if (index === null) {
            // Do nothing
          } else {
            data.termChoices = Array<Term>(props.allPredicates[index].slots.length).fill(props.allTerms[0]);
          }
          emit('change', chosenProposition());
        },
      }));

      if (data.choice !== null) {
        for (let i = 0; i < props.allPredicates[data.choice].slots.length; ++i) {
          const termInput = makeFreeTermInput({
            termBank: props.allTerms,
            functionBank: props.allFunctions,
          }, {
            onChange: (t: Term) => {
              data.termChoices[i] = t;
              emit('change', chosenProposition());
            },
          });
          items.push(Vue.h('div', { style: {
            'display': 'inline',
            'margin-left': '8px',
          }}, [emptySlot(i + 1) + ": ", termInput]))
        }
      }

      return Vue.h('div', { style: { 'display': 'inline-block'}}, items);
    }
  }
}

export function makeLiteralPropositionInput(p: LiteralPropositionInputProps, extra: any = {}) {
  return Vue.h(LiteralPropositionsInputComponent, Object.assign(p, extra));
}
