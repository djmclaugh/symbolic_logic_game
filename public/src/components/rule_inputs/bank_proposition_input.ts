import Vue from '../../vue.js'

import Select from '../shared/select.js'

import Proposition from '../../data/propositions/proposition.js'

export class BankPropositionInputProps {
  readonly bank: Proposition[] = [];
}

interface BankPropositionInputData {}

export default {
  props: Object.keys(new BankPropositionInputProps()),
  emits: [ 'change' ],

  setup(props: BankPropositionInputProps, {attrs, slots, emit}: any) {
    const initialData: BankPropositionInputData = {};
    const data: BankPropositionInputData = Vue.reactive(initialData);

    return () => {
      return Vue.h(Select, {
        objectType: "a proposition",
        options: props.bank.map(p =>  p.toString()),
        onChange: (i: number|null) => {
          if (i === null) {
            emit('change', null);
          } else {
            emit('change', props.bank[i]);
          }
        },
      });
    }
  }
}
