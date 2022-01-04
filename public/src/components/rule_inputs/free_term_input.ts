import Vue from '../../vue.js'

import Select from '../shared/select.js'

import Proposition from '../../data/propositions/proposition.js'
import { lit } from '../../data/propositions/propositions.js'

export class FreeTermInputProps {
  readonly bank: Proposition[] = [];
  readonly target: Proposition = lit("");
  readonly extraTerms: string[] = [];
}

interface FreeTermInputData {
  errorMessage: null|string,
}

export default {
  props: Object.keys(new FreeTermInputProps()),
  emits: [ 'change' ],

  setup(props: FreeTermInputProps, {attrs, slots, emit}: any) {

    const initialData: FreeTermInputData = {
      errorMessage: null,
    };
    const data: FreeTermInputData = Vue.reactive(initialData);

    const recommendations: string[] = [];
    for (const t of props.extraTerms) {
      recommendations.push(t);
    }
    for (const p of props.bank) {
      for (const t of p.allTerms()) {
        if (recommendations.indexOf(t) == -1) {
          recommendations.push(t);
        }
      }
    }
    for (const t of props.target.allTerms()) {
      if (recommendations.indexOf(t) == -1) {
        recommendations.push(t);
      }
    }

    emit('change', recommendations[0]);

    return () => {
      return Vue.h(Select, {
        options: recommendations,
        onChange: (i: number) => {
          emit('change', recommendations[i])
        },
      });
    }
  }
}
