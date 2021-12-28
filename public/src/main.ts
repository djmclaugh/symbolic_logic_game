import Vue from './vue.js'

import LevelComponent from './components/level.js'

import { LEVELS } from './data/level.js'
import NDS from './data/worlds/natural_deduction_system.js'

interface AppData {
  currentLevel: number;
  unlockedLevels: number;
}

const App = {
  setup(): any {
    const initialData: AppData = {
      currentLevel: 0,
      unlockedLevels: NDS.length,
    };
    const data: AppData = Vue.reactive(initialData);

    return () => {
      let items = [];
      items.push(Vue.h('span', {}, 'Level selection: '));
      const options = [];
      for (let i = 0; i < NDS.length; ++i) {
        options.push(Vue.h('option', {
          value: i,
          selected: data.currentLevel == i,
          disabled: data.unlockedLevels < i,
        }, NDS[i].name));
      }
      items.push(Vue.h('select', {
          onChange: (e: InputEvent) => {
            const t: HTMLSelectElement = e.target as HTMLSelectElement;
            data.currentLevel = parseInt(t.value);
          },
      }, options));

      items.push(Vue.h(LevelComponent, {
        key: data.currentLevel,
        level: NDS[data.currentLevel],
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
