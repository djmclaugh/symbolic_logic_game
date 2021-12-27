import Vue from '../vue.js'

import InferenceRule from '../data/inference_rule.js'
import Proposition from '../data/proposition.js'

import InferenceRuleComponent from './inference_rule.js'

class RuleBankProps {
  propositions: Proposition[] = [];
  rules: InferenceRule[] = [];
}

export default {
  props: Object.keys(new RuleBankProps()),

  setup(props: RuleBankProps,{attrs, slots, emit}: any) {
    return () => {
      let items = [];

      items.push(Vue.h('h3', {}, 'Inference Rule Bank:'));
      for (const rule of props.rules) {
        items.push(Vue.h(InferenceRuleComponent, {
          rule: rule,
          allRules: props.rules,
          propositions: props.propositions,
          onNewProposition: (p: Proposition) => { emit('newProposition', p); },
        }));
      }

      return Vue.h('div', { class: 'rule-bank' }, items);
    }
  }
}
