import Vue from '../vue.js'

import InferenceRule from '../data/inference_rules/inference_rule.js'
import Term from '../data/terms/term.js'
import Predicate from '../data/predicates/predicate.js'
import {lit} from '../data/predicates/literal.js'
import { PropositionType } from '../data/propositions/propositions.js'

import { makeInferenceRule } from './inference_rule.js'
import SelectComponent from './shared/select.js'

class RuleBankProps {
  readonly propositions: Predicate[] = [];
  readonly termBank: Term[] = [];
  readonly existentialBank: Term[] = [];
  readonly universalBank: Term[] = [];
  readonly rules: InferenceRule[] = [];
  readonly target: Predicate = lit("");
  readonly allowedTypes: PropositionType[] =[];
}

interface RuleBankData {
  selectedRule: number;
}

export default {
  props: Object.keys(new RuleBankProps()),

  setup(props: RuleBankProps,{emit}: any) {
    const initialData: RuleBankData = {
      selectedRule: 0,
    };
    const data: RuleBankData = Vue.reactive(initialData);

    return () => {
      let items = [];

      items.push(Vue.h('p', {class: 'inference-rules-p'}, [
      	Vue.h('h3', {style: {display: 'inline'}}, 'Inference Rules: '),
        Vue.h(SelectComponent, {
          options: ["--- Chose the inference rule you would like to use ---"].concat(props.rules.map((r: InferenceRule) => r.name)),
	  onChange: (selected: number) => { data.selectedRule = selected; },
        }),
      ]));
      if (data.selectedRule > 0) {
        items.push(makeInferenceRule({
          rule: props.rules[data.selectedRule - 1],
          allRules: props.rules,
          propositions: props.propositions,
          termBank: props.termBank,
          existentialBank: props.existentialBank,
          universalBank: props.universalBank,
          target: props.target,
          allowedTypes: props.allowedTypes,
        }, {
          key: data.selectedRule,
          onNewProposition: (p: Predicate) => { emit('newProposition', p); }
        }));
      }

      return Vue.h('div', { class: 'rule-bank' }, items);
    }
  }
}
