import Vue from './vue.js'

import LevelComponent from './components/level.js'
import RuleBankComponent from './components/rule_bank.js'
import PropositionBankComponent from './components/proposition_bank.js'

import PropositionHelpers, {
  Proposition,
  PropositionType,
} from './data/proposition.js'

import { LEVELS } from './data/level.js'

interface AppData {
  currentLevel: number;
  unlockedLevels: number;
}

const initialPropositions: Proposition[] = [
  {type: PropositionType.LITERAL, content: "I like apples"},
  {type: PropositionType.NEGATION, proposition:
    {type: PropositionType.LITERAL, content: "I like bananas"}
  },
];

const App = {
  setup(): any {
    const initialData: AppData = {
      currentLevel: 0,
      unlockedLevels: LEVELS.length,
    };
    const data: AppData = Vue.reactive(initialData);

    return () => {
      let items = [];
      items.push(Vue.h('h2', {}, 'Rules'));
      items.push(Vue.h('ul', {}, [
        Vue.h('li', {}, 'Each level, you start with a specific collection of propositions'),
        Vue.h('li', {}, 'You can create more propositions by using the provided inference rules'),
        Vue.h('li', {}, 'Your goal is to create the target proposition'),
      ]));

      items.push(Vue.h('span', {}, 'Level selection: '));
      const options = [];
      for (let i = 0; i < LEVELS.length; ++i) {
        options.push(Vue.h('option', {
          value: i,
          selected: data.currentLevel == i,
          disabled: data.unlockedLevels < i,
        }, LEVELS[i].name));
      }
      items.push(Vue.h('select', {
          onChange: (e: InputEvent) => {
            const t: HTMLSelectElement = e.target as HTMLSelectElement;
            data.currentLevel = parseInt(t.value);
          },
      }, options));

      items.push(Vue.h(LevelComponent, {
        key: data.currentLevel,
        level: LEVELS[data.currentLevel],
        onLevelClear: () => {
          data.unlockedLevels = Math.max(data.currentLevel + 1, data.unlockedLevels);
        },
        onNextLevel: () => {
          data.currentLevel += 1;
        },
      }));

      return Vue.h('div', {}, items);
    }
  }
};

Vue.createApp(App).mount('app');
