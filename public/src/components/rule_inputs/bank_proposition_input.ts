import Vue from '../../vue.js'

import Select from '../shared/select.js'

import Predicate from '../../data/predicates/predicate.js'

export class BankPropositionInputProps {
  readonly bank: Predicate[] = [];
}


const BankPropositionInputComponent = {
  props: Object.keys(new BankPropositionInputProps()),
  emits: [ 'change' ],

  setup(props: BankPropositionInputProps, {emit}: any) {
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

export function makeBankPropositionInput(p: BankPropositionInputProps, extra: any = {}) {
  return Vue.h(BankPropositionInputComponent, Object.assign(p, extra));
}
