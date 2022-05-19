import Vue from '../vue.js'

import RuleBankComponent from '../components/rule_bank.js'
import { makePropositionBank } from '../components/proposition_bank.js'
import Level from '../data/level.js'
import {UniversalIntroduction} from '../data/inference_rules/first_order_logic.js'

import Term from '../data/terms/term.js'
import Predicate from '../data/predicates/predicate.js'
import {lit} from '../data/predicates/literal.js'
import { PropositionType } from '../data/propositions/propositions.js'

class LevelProps {
  readonly level: Level = {
    name: "Placeholder",
    rules: [],
    propositions: [],
    target: lit(""),
  };
  readonly isSublevel: boolean|undefined = false;
  readonly allowedTypes: PropositionType[] = [];
  readonly existentialTerms?: Term[] = [];
  readonly universalTerms?: Term[] = [];
}

interface LevelData {
  propositions: Predicate[];
  terms: Term[];
  existentialTerms: Term[];
  universalTerms: Term[];
  uuid: number;
}

export default {
  props: Object.keys(new LevelProps()),
  setup(props: LevelProps, {emit}: any): any {
    const initialData: LevelData = {
      propositions: props.level.propositions.concat(),
      terms: props.level.terms ? props.level.terms.concat() : [],
      existentialTerms: props.existentialTerms ? props.existentialTerms.concat() : [],
      universalTerms: props.universalTerms ? props.universalTerms.concat() : [],
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
            data.terms = props.level.terms ? props.level.terms.concat() : [];
            data.existentialTerms = [];
            data.universalTerms = [];
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

      if (props.level.hints) {
        let count = 1;
        for (const d of props.level.hints) {
          items.push(Vue.h('details', {
            style: {display: 'inline-block'},
          }, [
            Vue.h('summary', {}, 'Hint ' + count),
            Vue.h('span', {
              style: {
                'display': 'inline-block',
                'margin-left': '12px',
                'padding-bottom': '8px',
              },
            }, d),
          ]));
          items.push(Vue.h('br'));
          count += 1;
        }
        items.push(Vue.h('br'));
      }

      const banks = [];

      banks.push(makePropositionBank({
        target: props.level.target,
        propositions: data.propositions,
        terms: data.terms,
        existentialTerms: data.existentialTerms,
        universalTerms: data.universalTerms,
        universalIntroductionPresent: props.level.rules.includes(UniversalIntroduction),
      }));

      banks.push(Vue.h(RuleBankComponent, {
        key: data.uuid,
        rules: props.level.rules,
        propositions: data.propositions,
        termBank: data.terms,
        existentialBank: data.existentialTerms,
        universalBank: data.universalTerms,
        target: props.level.target,
        allowedTypes: props.level.allowedPropositionTypes || props.allowedTypes,
        onNewProposition: (p: Predicate) => {
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
