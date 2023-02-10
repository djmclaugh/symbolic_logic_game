import Vue from './vue.js'

import LevelComponent from './components/level.js'

import SelectCompoenent from './components/shared/select.js'

import { WORLDS } from './data/worlds/worlds.js'

interface AppData {
  currentWorld: number;
  currentLevel: number;
}

const App = {
  setup(): any {
    const initialData: AppData = {
      currentWorld: 0,
      currentLevel: 0,
    };
    const data: AppData = Vue.reactive(initialData);

    return () => {
      let items = [];
      items.push(Vue.h('label', {}, 'World selection: '));
      items.push(Vue.h(SelectCompoenent, {
          selected: data.currentWorld,
          options: WORLDS.map(w => w.name),
          onChange: (index: number|null) => {
            data.currentWorld = index || 0;
            data.currentLevel = 0;
          },
      }));
      items.push(Vue.h('br'));
      items.push(Vue.h('label', {}, 'Level selection: '));
      items.push(Vue.h(SelectCompoenent, {
          selected: data.currentLevel,
          options: WORLDS[data.currentWorld].levels.map(l => l.name),
          onChange: (index: number|null) => {
            data.currentLevel = index || 0;
          },
      }));

      items.push(Vue.h(LevelComponent, {
        key: data.currentWorld + "_" + data.currentLevel,
        level: WORLDS[data.currentWorld].levels[data.currentLevel],
        onLevelClear: () => {},
        onNextLevel: () => {
          data.currentLevel += 1;
        },
      }));

      return Vue.h('div', {}, items);
    }
  }
};

Vue.createApp(App).mount('app');
