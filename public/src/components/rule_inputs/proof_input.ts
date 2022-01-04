import Vue from '../../vue.js'

import LevelComponent from '../level.js'

import Proposition from '../../data/propositions/proposition.js'
import { PropositionType, lit } from '../../data/propositions/propositions.js'
import InferenceRule from '../../data/inference_rules/inference_rule.js'
import Level from '../../data/level.js'

export class ProofInputProps {
  readonly rules: InferenceRule[] = [];
  readonly propositions: Proposition[] = [];
  readonly target: Proposition = lit("");
  readonly allowedTypes: PropositionType[] =[];
}

export default {
  props: Object.keys(new ProofInputProps()),
  emits: [ 'change' ],

  setup(props: ProofInputProps, {attrs, slots, emit}: any) {

    const sublevel: Level = {
      name: `Sublevel`,
      rules: props.rules,
      propositions: props.propositions,
      target: props.target,
    };

    return () => {
      return Vue.h(LevelComponent, {
        style: {
          'border': '1px solid',
          'border-radius': '4px',
          'padding-left': '16px',
          'padding-right': '16px',
        },
        level: sublevel,
        isSublevel: true,
        allowedTypes: props.allowedTypes,
        onLevelClear: () => { emit('change', 'done'); },
        onRestart: () => { emit('change', 'done'); },
      })
    }
  }
}
