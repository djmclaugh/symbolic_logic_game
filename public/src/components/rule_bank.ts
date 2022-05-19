import Vue from '../vue.js'

import InferenceRule from '../data/inference_rules/inference_rule.js'
import Term from '../data/terms/term.js'
import Predicate from '../data/predicates/predicate.js'
import {lit} from '../data/predicates/literal.js'
import { PropositionType } from '../data/propositions/propositions.js'

import { makeInferenceRule } from './inference_rule.js'

class RuleBankProps {
  readonly propositions: Predicate[] = [];
  readonly termBank: Term[] = [];
  readonly existentialBank: Term[] = [];
  readonly universalBank: Term[] = [];
  readonly rules: InferenceRule[] = [];
  readonly target: Predicate = lit("");
  readonly allowedTypes: PropositionType[] =[];
}

export default {
  props: Object.keys(new RuleBankProps()),

  setup(props: RuleBankProps,{emit}: any) {
    return () => {
      let items = [];

      for (const rule of props.rules) {
        items.push(makeInferenceRule({
          rule: rule,
          allRules: props.rules,
          propositions: props.propositions,
          termBank: props.termBank,
          existentialBank: props.existentialBank,
          universalBank: props.universalBank,
          target: props.target,
          allowedTypes: props.allowedTypes,
        }, {
          onNewProposition: (p: Predicate) => { emit('newProposition', p); }
        }));
      }

      return Vue.h('div', { class: 'rule-bank' }, items);
    }
  }
}
