import Vue from '../../vue.js'
import Select from '../shared/select.js'
import Term from '../../data/terms/term.js'

import { emptySlot } from '../../data/predicates/util.js'
import FunctionTerm from '../../data/terms/function.js'

export class FreeTermInputProps {
  readonly termBank: Term[] = [];
  readonly functionBank: FunctionTerm[] = [];
}

interface FreeTermInputData {
  chosenTerm: Term,
  subTerms: Term[],
}

const FreeTermInputComponent = {
  props: Object.keys(new FreeTermInputProps()),
  emits: [ 'change' ],

  setup(props: FreeTermInputProps, {emit}: any) {

    const initialData: FreeTermInputData = {
      chosenTerm: props.termBank[0],
      subTerms: [],
    };
    const data: FreeTermInputData = Vue.reactive(initialData);

    function emitChange() {
      if (data.chosenTerm instanceof FunctionTerm) {
        emit('change', data.chosenTerm.withSlots(data.subTerms));
      } else {
        emit('change', data.chosenTerm);
      }
    }

    emitChange();

    return () => {
      let main = null;
      if (props.termBank.length > 0) {
        main = Vue.h(Select, {
          options: props.termBank.concat(props.functionBank).map(t => t.toString()),
          onChange: (i: number) => {
            if (i < props.termBank.length) {
              data.chosenTerm = props.termBank[i];
              data.subTerms = [];
            } else {
              const f = props.functionBank[i - props.termBank.length];
              data.chosenTerm = f;
              data.subTerms = [];
              for (let index = 0; index < f.numSlots; ++index) {
                data.subTerms.push(props.termBank[0]);
              }
            }
            emitChange();
          },
        });
      } else {
        return Vue.h('em', {}, "No terms to chose from...");
      }
      const items = [];
      for (let i = 0; i < data.subTerms.length; ++i) {
        items.push(Vue.h('div', {
          style: {
            display: 'flex',
            'margin-top': '2px',
          }}, [
          Vue.h('span', {style: {'margin-top': '2px'}}, `${emptySlot(i + 1)}: `),
          makeFreeTermInput({
            termBank: props.termBank,
            functionBank: props.functionBank,
          }, {
            onChange: (t: Term) => {
              data.subTerms[i] = t;
              emitChange();
            },
          }),
        ]))
      }
      return Vue.h('div', { class: "free-term-picker" }, [main].concat(items));
    }
  }
}

export function makeFreeTermInput(p: FreeTermInputProps, extra: any = {}) {
  return Vue.h(FreeTermInputComponent, Object.assign(p, extra));
}
