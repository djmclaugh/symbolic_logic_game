import Vue from './vue.js'

import LevelComponent from './components/level.js'

import SelectCompoenent from './components/shared/select.js'

import NDS from './data/worlds/natural_deduction_system.js'
import FOL from './data/worlds/first_order_logic.js'
import { PROPOSITION_TYPES, FOL_PROPOSITION_TYPES } from './data/propositions/propositions.js'

const worlds = [
  NDS,
  FOL,
]

interface AppData {
  currentWorld: number;
  currentLevel: number;
  unlockedLevels: number;
}

const App = {
  setup(): any {
    const initialData: AppData = {
      currentWorld: 0,
      currentLevel: 0,
      unlockedLevels: NDS.length,
    };
    const data: AppData = Vue.reactive(initialData);

    return () => {
      let items = [];
      items.push(Vue.h('label', {}, 'World selection: '));
      items.push(Vue.h(SelectCompoenent, {
          selected: data.currentWorld,
          options: ["Propositional Logic: Natural Deductive System", "First-Order Logic"],
          onChange: (index: number|null) => {
            data.currentWorld = index || 0;
            data.currentLevel = 0;
          },
      }));
      items.push(Vue.h('br'));
      items.push(Vue.h('label', {}, 'Level selection: '));
      items.push(Vue.h(SelectCompoenent, {
          selected: data.currentLevel,
          options: worlds[data.currentWorld].map(l => l.name),
          onChange: (index: number|null) => {
            data.currentLevel = index || 0;
          },
      }));

      items.push(Vue.h(LevelComponent, {
        key: data.currentWorld + "_" + data.currentLevel,
        level: worlds[data.currentWorld][data.currentLevel],
        allowedTypes: data.currentWorld == 0 ? PROPOSITION_TYPES : FOL_PROPOSITION_TYPES,
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
