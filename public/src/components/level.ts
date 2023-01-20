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
  deductions: Predicate[];
  terms: Term[];
  existentialTerms: Term[];
  universalTerms: Term[];
  uuid: number;
}

export default {
  props: Object.keys(new LevelProps()),
  setup(props: LevelProps, {emit}: any): any {
    const initialData: LevelData = {
      deductions: [],
      terms: props.level.terms ? props.level.terms.concat() : [],
      existentialTerms: props.existentialTerms ? props.existentialTerms.concat() : [],
      universalTerms: props.universalTerms ? props.universalTerms.concat() : [],
      uuid: 0,
    };
    const data: LevelData = Vue.reactive(initialData);

    function didFindTarget(): boolean {
      for (let p of data.deductions.concat(props.level.propositions)) {
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
      let description = [];

      description.push(Vue.h('h2', {}, props.level.name));

      if (props.level.description) {
        for (const d of props.level.description) {
            description.push(Vue.h('p', {}, d));
        }
      }

      if (props.level.hints) {
        let count = 1;
        for (const d of props.level.hints) {
          description.push(Vue.h('details', {
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
          description.push(Vue.h('br'));
          count += 1;
        }
        description.push(Vue.h('br'));
      }

      if (!props.isSublevel) {
	items.push(Vue.h('div', {class: 'level-description'}, description));
      }

      items.push(Vue.h('p', {class: 'target-p'}, [
        Vue.h('h3', {style: {display: 'inline'}}, 'Target: '),
	Vue.h('span', {innerHTML: props.level.target.toHTMLString()}),
      ]));
      if (didFindTarget()) {
        if (props.isSublevel) {
          items.push(Vue.h('em', {}, 'Target proposition deduced - Ready to apply inference rule.'));
        } else {
          items.push(Vue.h('em', {}, [
            'Target proposition deduced - Next level unlocked - ',
            Vue.h('button', {
              onClick: () => { emit("nextLevel"); }
            }, 'Go to next level')
          ]));
        }
      } else {
        if (props.isSublevel) {
          items.push(Vue.h('em', {}, 'Create target proposition to complete this sublevel.'))
	} else {
          items.push(Vue.h('em', {}, 'Create target proposition to complete this level.'))
	}
      }

      const banks = [];

      banks.push(makePropositionBank({
        assumptions: props.level.propositions,
        deductions: data.deductions,
        terms: data.terms,
        existentialTerms: data.existentialTerms,
        universalTerms: data.universalTerms,
        universalIntroductionPresent: props.level.rules.includes(UniversalIntroduction),
      }));

      if (props.level.rules.length > 0) {
        banks.push(Vue.h(RuleBankComponent, {
          key: data.uuid,
          rules: props.level.rules,
          propositions: props.level.propositions.concat(data.deductions),
          termBank: data.terms,
          existentialBank: data.existentialTerms,
          universalBank: data.universalTerms,
          target: props.level.target,
          allowedTypes: props.level.allowedPropositionTypes || props.allowedTypes,
          onNewProposition: (p: Predicate) => {
            data.deductions.push(p);
            if (p.equals(props.level.target)) {
              emit("levelClear");
            }
          },
        }));
      }

      items.push(Vue.h('div', { class: 'banks' }, banks));

      return Vue.h('div', {
        class: {
          'level': true,
          'sublevel': props.isSublevel,
        },
      }, items);
    }
  }
}
