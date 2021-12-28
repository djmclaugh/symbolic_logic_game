import Vue from '../vue.js'

import RuleBankComponent from '../components/rule_bank.js'
import PropositionBankComponent from '../components/proposition_bank.js'
import Level, { LEVELS } from '../data/level.js'

import PropositionHelpers, { Proposition } from '../data/proposition.js'

class LevelProps {
  readonly level: Level = LEVELS[0];
  readonly isSublevel: boolean|undefined = false;
}

interface LevelData {
  propositions: Proposition[];
  uuid: number;
}

export default {
  props: Object.keys(new LevelProps()),
  setup(props: LevelProps, {attrs, slots, emit}: any): any {
    const initialData: LevelData = {
      propositions: props.level.propositions.concat(),
      uuid: 0,
    };
    const data: LevelData = Vue.reactive(initialData);

    function didFindTarget(): boolean {
      for (let p of data.propositions) {
        if (PropositionHelpers.areTheSame(p, props.level.target)) {
          return true;
        }
      }
      return false;
    }

    if (didFindTarget()) {
      emit("levelClear");
    }

    return () => {
      let items = [];

      items.push(Vue.h('h2', {}, [
        props.level.name,
        ' - ',
        Vue.h('button', {
          onClick: () => {
            data.propositions = props.level.propositions.concat();
            data.uuid += 1;
            emit("restart");
            if (didFindTarget()) {
              emit("levelClear");
            }
          },
        }, 'Restart'),
      ]));

      if (props.level.description) {
        for (const d of props.level.description) {
            items.push(Vue.h('p', {}, d));
        }
      }

      items.push(Vue.h(PropositionBankComponent, {propositions: data.propositions}));
      items.push(Vue.h(RuleBankComponent, {
        key: data.uuid,
        rules: props.level.rules,
        propositions: data.propositions,
        target: props.level.target,
        onNewProposition: (p: Proposition) => {
          data.propositions.push(p);
          if (PropositionHelpers.areTheSame(p, props.level.target)) {
            emit("levelClear");
          }
        },
      }));
      items.push(Vue.h('h3', {}, 'Target: ' + PropositionHelpers.toString(props.level.target)));

      if (didFindTarget()) {
        items.push(Vue.h('p', {}, 'Target proposition in bank - Level complete!'));
        if (props.isSublevel) {
          items.push(Vue.h('p', {}, 'Proof completed - Ready to apply conditional introduction.'));
        } else {
          items.push(Vue.h('p', {}, [
            'Next level unlocked.',
            ' ',
            Vue.h('button', {
              onClick: () => { emit("nextLevel"); }
            }, 'Go to next level')
          ]));
        }
      }
      return Vue.h('div', {}, items);
    }
  }
}
