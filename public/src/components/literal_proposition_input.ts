import Vue from '../vue.js'

import SelectComponent from './shared/select.js'
import { lit, Literal } from '../data/proposition.js'

class LiteralPropositionInputProps {
  readonly allLiterals: string[] = [];
}

interface LiteralPropositionInputData {
  text: string,
  errorMessage: string|null,
}

const logicalSymbols = ["(", ")", "¬", "∧", "∨", "→"];

export default {
  props: Object.keys(new LiteralPropositionInputProps()),
  emits: ['change'],

  setup(props: LiteralPropositionInputProps, {attrs, slots, emit}: any) {
    const initialData: LiteralPropositionInputData = {
      text: "",
      errorMessage: null,
    };
    const data: LiteralPropositionInputData = Vue.reactive(initialData);

    function onChange(e: InputEvent) {
      e.stopPropagation();
      let p: Literal|null = null;
      const t = e.target as HTMLInputElement;
      data.text = t.value;

      if (data.text.length == 0) {
        data.errorMessage = "Literal propositions must consist of at least one symbol.";
        p = null;
      } else {
        let foundLogicalSymbol = false;
        for (const s of logicalSymbols) {
          if (data.text.indexOf(s) != -1) {
            data.errorMessage = `Literal propositions can't use the \"${s}\" symbol or any other logical symbols.`;
            p = null;
            foundLogicalSymbol = true;
            break;
          }
        }
        if (!foundLogicalSymbol) {
          data.errorMessage = null;
          p = lit(data.text);
        }
      }
      emit('change', p);
    }

    return () => {
      // let items: any = [];
      // items.push(Vue.h('input', {
      //   onInput: onChange,
      //   onChange: onChange,
      // }));
      // if (data.errorMessage) {
      //   items.push(Vue.h('br'));
      //   items.push(Vue.h('span', {
      //     class: 'error',
      //     style: { 'margin-top': '4px' },
      //   }, data.errorMessage));
      // }
      //
      // return Vue.h('div', { class: 'literal-proposition-input' }, items);
      return Vue.h(SelectComponent, {
        options: props.allLiterals,
        objectType: "a literal proposition",
        onChange: (index: number|null, a: any, b: any, c:any) => {
          if (index === null) {
            emit('change', null);
          } else {
            emit('change', lit(props.allLiterals[index]));
          }
          return false;
        }
      });
    }
  }
}
