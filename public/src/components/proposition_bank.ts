import Vue from '../vue.js'

import PropositionHelpers, { Proposition } from '../data/proposition.js'

class PropositionBankProps {
  readonly propositions: Proposition[] = [];
}

export default {
  props: Object.keys(new PropositionBankProps()),
  setup(props: PropositionBankProps) {
    return () => {
      let items = [];

      items.push(Vue.h('h3', {}, 'Proposition Bank:'));
      let listItems = [];
      for (const p of props.propositions) {
          listItems.push(Vue.h('li', {}, PropositionHelpers.toString(p)));
      }
      items.push(Vue.h('ul', {}, listItems));

      return Vue.h('div', {}, items);
    }
  }
}
