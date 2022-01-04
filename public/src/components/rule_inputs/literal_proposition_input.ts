import Vue from '../../vue.js'

import Select from '../shared/select.js'

import { Term } from '../../data/term.js'
import Proposition, { Predicate } from '../../data/propositions/proposition.js'
import { lit } from '../../data/propositions/propositions.js'

class LiteralPropositionInputProps {
  readonly allLiterals: string[] = [];
  readonly allPredicates: Predicate[] = [];
  readonly allTerms: Term[] = []
}

interface LiteralPropositionInputData {
  choice: number|null,
  termChoices: number[],
}

export default {
  props: Object.keys(new LiteralPropositionInputProps()),
  emits: ['change'],

  setup(props: LiteralPropositionInputProps, {attrs, slots, emit}: any) {
    const numLit = props.allLiterals.length;
    const initialData: LiteralPropositionInputData = {
      choice: null,
      termChoices: [],
    };
    const data: LiteralPropositionInputData = Vue.reactive(initialData);

    function chosenProposition(): Proposition|null {
      if (data.choice === null) {
        return null;
      }
      if (data.choice < props.allLiterals.length) {
        return lit(props.allLiterals[data.choice]);
      } else {
        const pred = props.allPredicates[data.choice - props.allLiterals.length];
        return pred.apply(data.termChoices.map(i => props.allTerms[i]));
      }
    }

    emit('change', chosenProposition());

    return () => {
      const items = [];
      items.push(Vue.h(Select, {
        objectType: 'a proposition',
        options: props.allLiterals.concat(props.allPredicates.map(p => p.toString())),
        onChange: (index: number|null) => {
          data.choice = index;
          if (index === null) {
            // Do nothing
          } else if (index < numLit) {
            data.termChoices = []
          } else {
            data.termChoices = Array<number>(props.allPredicates[index - numLit].v.length).fill(0);
          }
          emit('change', chosenProposition());
        },
      }));

      if (data.choice !== null && data.choice >= numLit) {
        for (let i = 0; i < props.allPredicates[data.choice - numLit].v.length; ++i) {
          items.push(Vue.h(Select, {
            options: props.allTerms,
            onChange: (index: number) => {
              data.termChoices[i] = index;
              emit('change', chosenProposition());
            },
          }));
        }
      }

      return Vue.h('div', { style: { 'display': 'inline-block'}}, items);
    }
  }
}
