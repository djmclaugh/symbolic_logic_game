import Vue from '../vue.js'

import InferenceRule from '../data/inference_rules/inference_rule.js'
import Proposition from '../data/propositions/proposition.js'
import { PropositionType, lit } from '../data/propositions/propositions.js'

import InferenceRuleComponent from './inference_rule.js'

class RuleBankProps {
  readonly propositions: Proposition[] = [];
  readonly rules: InferenceRule[] = [];
  readonly target: Proposition = lit("");
  readonly allowedTypes: PropositionType[] =[];
}

export default {
  props: Object.keys(new RuleBankProps()),

  setup(props: RuleBankProps,{attrs, slots, emit}: any) {
    return () => {
      let items = [];

      items.push(Vue.h('h3', {}, 'Inference Rules:'));
      for (const rule of props.rules) {
        items.push(Vue.h(InferenceRuleComponent, {
          rule: rule,
          allRules: props.rules,
          propositions: props.propositions,
          target: props.target,
          allowedTypes: props.allowedTypes,
          onNewProposition: (p: Proposition) => { emit('newProposition', p); },
        }));
      }

      return Vue.h('div', { class: 'rule-bank' }, items);
    }
  }
}
