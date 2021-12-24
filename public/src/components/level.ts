import Vue from '../vue.js'

import RuleBankComponent from '../components/rule_bank.js'
import PropositionBankComponent from '../components/proposition_bank.js'
import Level, { LEVELS } from '../data/level.js'

import PropositionHelpers, { Proposition } from '../data/proposition.js'

class LevelProps {
  readonly level: number = 0;
}

interface LevelData {
  readonly level: Level;
  propositions: Proposition[];
  foundTarget: boolean;
  // Used to force sub-components to re-render from scratch.
  uuid: number;
}

export default {
  props: Object.keys(new LevelProps()),
  setup(props: LevelProps, {attrs, slots, emit}: any): any {
    const initialData: LevelData = {
      level: LEVELS[props.level],
      propositions: LEVELS[props.level].propositions.concat(),
      foundTarget: false,
      uuid: 0,
    };
    const data: LevelData = Vue.reactive(initialData);

    return () => {
      let items = [];

      items.push(Vue.h('h2', {}, [
        'Level ' + (props.level + 1),
        ' - ',
        Vue.h('button', {
          onClick: () => {
            data.propositions = LEVELS[props.level].propositions.concat();
            data.uuid += 1;
          },
        }, 'Restart'),
      ]));

      items.push(Vue.h(RuleBankComponent, {
        key: data.uuid,
        rules: data.level.rules,
        propositions: data.propositions,
        onNewProposition: (p: Proposition) => {
          data.propositions.push(p);
          if (PropositionHelpers.areTheSame(p, data.level.target)) {
            data.foundTarget = true;
            emit("levelClear");
          }
        },
      }));
      items.push(Vue.h(PropositionBankComponent, {propositions: data.propositions}));
      items.push(Vue.h('h3', {}, 'Target: ' + PropositionHelpers.toString(data.level.target)));

      if (data.foundTarget) {
        items.push(Vue.h('p', {}, 'Target proposition created - Level Complete!'));
        items.push(Vue.h('p', {}, [
          'Next level unlocked.',
          ' ',
          Vue.h('button', {
            onClick: () => { emit("nextLevel"); }
          }, 'Go to next level')
        ]));
      }

      // items.push(Vue.h('h2', {}, 'New Symbols: ( (left parenthesis)'));
      // items.push(Vue.h('h2', {}, 'New Symbols: ) (right parenthesis)'));
      // items.push(Vue.h('h2', {}, 'New Logical Symbol: ¬ (not/negation)'));
      // items.push(Vue.h('h2', {}, 'New Inference Rule: Double Negation Introduction'));
      // items.push(Vue.h('ul', {}, [
      //   Vue.h('li', {}, 'Given any proposition, you can create that same proposition but with ¬¬( in front and ) after.'),
      // ]));
      // items.push(Vue.h('h2', {}, 'Level 1:'));
      // items.push(Vue.h('ul', {}, [
      //   Vue.h('li', {}, 'start: David likes bananas, ¬(David likes apples), David likes apples, ¬(¬(¬(¬(David likes apples))))'),
      //   Vue.h('li', {}, 'target: ¬(¬(David likes apples))'),
      // ]));
      //
      // items.push(Vue.h('h2', {}, 'New Inference Rule: Double Negation Elimination'));
      // items.push(Vue.h('ul', {}, [
      //   Vue.h('li', {}, 'Given any proposition that starts with ¬(¬( in front and ends with )), you can re-create that same proposition but those parts removed.'),
      // ]));
      // items.push(Vue.h('h2', {}, 'Level 2:'));
      // items.push(Vue.h('ul', {}, [
      //   Vue.h('li', {}, 'start: ¬(¬(Anna likes red)), ¬(¬(¬(George likes red)))", "Anna likes red", ¬(¬(¬(Anna likes red)))'),
      //   Vue.h('li', {}, 'target: ¬(Anna likes red)'),
      // ]));
      // items.push(Vue.h('h2', {}, 'New Symbol: ∧ (and/conjunction)'));
      // items.push(Vue.h('h2', {}, 'New Inference Rule: Conjunction Introduction'));
      // items.push(Vue.h('ul', {}, [
      //   Vue.h('li', {}, 'Given any two propositions, you can create the proposition that consists of both those propositions, each wraped in a pair of parentheses, seperated by a ∧.'),
      // ]));
      // items.push(Vue.h('h2', {}, 'Level 3:'));
      // items.push(Vue.h('ul', {}, [
      //   Vue.h('li', {}, "start: ¬(¬(It's sunny)), ¬(It's windy), ¬(It's cloudy), It's hot"),
      //   Vue.h('li', {}, "target: (It's sunny) ∧ (¬(It's windy))"),
      // ]));
      // items.push(Vue.h('h2', {}, 'New Inference Rule: Conjunction Elimination'));
      // items.push(Vue.h('ul', {}, [
      //   Vue.h('li', {}, 'Given a proposition that consists of a ∧ , you can create the proposition that consists of both those propositions, each wraped in a pair of parentheses, seperated by a ∧.'),
      // ]));
      // items.push(Vue.h('h2', {}, 'Level 4:'));
      // items.push(Vue.h('ul', {}, [
      //   Vue.h('li', {}, "start: (¬(I'm having pasta for dinner)) ∧ (I'm having soup for dinner)"),
      //   Vue.h('li', {}, "target: I'm having soup for dinner"),
      // ]));
      // items.push(Vue.h('h2', {}, 'Level 5:'));
      // items.push(Vue.h('ul', {}, [
      //   Vue.h('li', {}, "start: (I have a left hand) ∧ (I have a right hand), (I have a left foot) ∧ (I have a right foot)"),
      //   Vue.h('li', {}, "target: (I have a left hand) ∧ (I have a right foot)"),
      // ]));
      // items.push(Vue.h('h2', {}, 'Level 6:'));
      // items.push(Vue.h('ul', {}, [
      //   Vue.h('li', {}, "start: ¬(¬((I put milk in my tea) ∧ (I put sugar in my tea))), ¬((¬(I put milk in my tea)) ∧ (¬(I put sugar in my tea)))"),
      //   Vue.h('li', {}, "target: I put sugar in my tea"),
      // ]));
      return Vue.h('div', {}, items);
    }
  }
}
