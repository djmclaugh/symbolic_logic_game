import Vue from '../vue.js'

import Proposition from '../data/propositions/proposition.js'
import {lit} from '../data/propositions/propositions.js'

class PropositionBankProps {
  readonly target: Proposition = lit("");
  readonly propositions: Proposition[] = [];
}

export default {
  props: Object.keys(new PropositionBankProps()),
  setup(props: PropositionBankProps) {
    return () => {
      let items = [];

      items.push(Vue.h('h3', { style: { 'display': 'inline' }}, 'Target: '));
      items.push(Vue.h('span', {}, props.target.toString()));

      items.push(Vue.h('h3', {}, 'Proposition Bank'));
      let propositions = [];
      for (const p of props.propositions) {
        propositions.push(Vue.h('li', {}, p.toString()));
      }
      items.push(Vue.h('ul', {}, propositions))

      return Vue.h('div', { class: 'proposition-bank' }, items);
    }
  }
}
