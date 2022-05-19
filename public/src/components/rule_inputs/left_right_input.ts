import Vue from '../../vue.js'

import Select from '../shared/select.js'

const SIDES = ["Left", "Right"];

const LeftRightInputComponent = {
  emits: [ 'change' ],

  setup(props: any, {emit}: any) {
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

export function makeLeftRightInput(extra: any = {}) {
  return Vue.h(LeftRightInputComponent, extra);
}
