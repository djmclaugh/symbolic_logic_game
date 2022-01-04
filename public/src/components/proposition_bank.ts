import Vue from '../vue.js'

import Proposition from '../data/propositions/proposition.js'

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
          listItems.push(Vue.h('li', {}, p.toString()));
      }
      items.push(Vue.h('ul', {}, listItems));

      return Vue.h('div', {}, items);
    }
  }
}
