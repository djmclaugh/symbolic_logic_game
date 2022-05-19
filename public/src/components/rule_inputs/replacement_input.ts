import Vue from '../../vue.js'

import Select from '../shared/select.js'

export class ReplacementInputProps {
  readonly original: string = "";
  readonly toReplace: string = "";
  readonly with: string = "";
}

interface ReplacementInputData {
  switches: boolean[]
}

const ReplacementInputComponent = {
  props: Object.keys(new ReplacementInputProps()),
  emits: [ 'change' ],

  setup(props: ReplacementInputProps, {emit}: any) {
    const parts: string[] = props.original.split(props.toReplace);
    const initialData: ReplacementInputData = {
      switches: new Array<boolean>(parts.length).fill(false),
    };
    const data: ReplacementInputData = Vue.reactive(initialData);

    function emitUpdate() {
      const l = [];
      for (let i = 0; i < data.switches.length; ++i) {
        if (data.switches[i]) {
          l.push(i);
        }
      }
      emit('change', l);
    }

    emitUpdate();

    return () => {
      const items = [];

      for (let i = 0; i < parts.length; ++i) {
        const part = parts[i];
        items.push(Vue.h('span', {}, part));
        items.push(Vue.h(Select, {
          key: props.toReplace + '-' + props.with + '-' + i,
          options: [props.toReplace, props.with],
          onChange: (choice: number) => {
            data.switches[i] = (choice == 1);
            emitUpdate();
          },
        }))
      }

      items.pop();

      return Vue.h('div', {}, items);
    }
  }
}

export function makeReplacementInput(p: ReplacementInputProps, extra: any = {}) {
  return Vue.h(ReplacementInputComponent, Object.assign(p, extra));
}
