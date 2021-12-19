import Vue from './vue.js'

interface AppData {}

const App = {
  setup(): any {
    const data: AppData = Vue.reactive({});

    return () => {
      let items = [];
      items.push(Vue.h('h3', {}, 'Hello world!'));
      return Vue.h('div', {}, items);
    }
  }
};

Vue.createApp(App).mount('app');
