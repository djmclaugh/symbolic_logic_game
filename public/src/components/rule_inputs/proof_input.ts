import Vue from '../../vue.js'

import LevelComponent from '../level.js'

import Term from '../../data/terms/term.js'
import Predicate from '../../data/predicates/predicate.js'
import { lit } from '../../data/predicates/literal.js'
import { PropositionType } from '../../data/propositions/propositions.js'
import InferenceRule from '../../data/inference_rules/inference_rule.js'
import Level from '../../data/level.js'

export class ProofInputProps {
  readonly rules: InferenceRule[] = [];
  readonly termBank: Term[] = [];
  readonly existentialBank: Term[] = [];
  readonly universalBank: Term[] = [];
  readonly propositions: Predicate[] = [];
  readonly target: Predicate = lit("");
  readonly allowedTypes: PropositionType[] = [];
}

const ProofInputComponent = {
  props: Object.keys(new ProofInputProps()),
  emits: [ 'change' ],

  setup(props: ProofInputProps, {emit}: any) {
    const sublevel: Level = {
      name: `Sublevel`,
      rules: props.rules,
      propositions: props.propositions,
      terms: props.termBank,
      target: props.target,
    };

    return () => {
      return Vue.h(LevelComponent, {
        level: sublevel,
        isSublevel: true,
        allowedTypes: props.allowedTypes,
        existentialTerms: props.existentialBank,
        universalTerms: props.universalBank,
        onLevelClear: () => { emit('change', 'done'); },
        onRestart: () => { emit('change', 'done'); },
      })
    }
  }
}

export function makeProofInput(p: ProofInputProps, extra: any = {}) {
  return Vue.h(ProofInputComponent, Object.assign(p, extra));
}
