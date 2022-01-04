import Vue from '../../vue.js'

import Select from '../shared/select.js'

const SIDES = ["Left", "Right"];

export default {
  emits: [ 'change' ],

  setup(props: any, {attrs, slots, emit}: any) {
    return () => {
      return Vue.h(Select, {
        objectType: "a side",
        options: SIDES,
        onChange: (i: number|null) => {
          if (i === null) {
            emit('change', null);
          } else {
            emit('change', SIDES[i]);
          }
        },
      });
    }
  }
}
