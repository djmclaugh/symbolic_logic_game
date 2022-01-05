import Vue from '../vue.js'

import RuleBankComponent from '../components/rule_bank.js'
import PropositionBankComponent from '../components/proposition_bank.js'
import Level from '../data/level.js'

import Proposition from '../data/propositions/proposition.js'
import { PropositionType, lit } from '../data/propositions/propositions.js'

class LevelProps {
  readonly level: Level = {
    name: "Placeholder",
    rules: [],
    propositions: [],
    target: lit(""),
  };
  readonly isSublevel: boolean|undefined = false;
  readonly allowedTypes: PropositionType[] =[];
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
        if (p.equals(props.level.target)) {
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

      const banks = [];

      banks.push(Vue.h('div', { class: 'target-bank' }, [
        Vue.h('h3', {}, 'Target'),
        Vue.h('p', {}, props.level.target.toString()),
      ]));
      banks.push(Vue.h(PropositionBankComponent, {propositions: data.propositions}));

      banks.push(Vue.h(RuleBankComponent, {
        key: data.uuid,
        rules: props.level.rules,
        propositions: data.propositions,
        target: props.level.target,
        allowedTypes: props.level.allowedPropositionTypes || props.allowedTypes,
        onNewProposition: (p: Proposition) => {
          data.propositions.push(p);
          if (p.equals(props.level.target)) {
            emit("levelClear");
          }
        },
      }));

      items.push(Vue.h('div', { class: 'banks' }, banks));

      if (didFindTarget()) {
        items.push(Vue.h('p', {}, 'Target proposition in bank - Level complete!'));
        if (props.isSublevel) {
          items.push(Vue.h('p', {}, 'Proof completed - Ready to apply inference rule.'));
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
      return Vue.h('div', {
        class: {
          'level': true,
          'sublevel': props.isSublevel,
        },
      }, items);
    }
  }
}
