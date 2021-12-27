import Vue from '../vue.js'

import { lit, Literal } from '../data/proposition.js'


interface LiteralPropositionInputData {
  text: string,
  errorMessage: string|null,
}

let uuid = 0;

const logicalSymbols = ["(", ")", "¬", "∧", "∨", "→"];

export default {
  setup(props: any, {attrs, slots, emit}: any) {
    const id = uuid += 1;
    const initialData: LiteralPropositionInputData = {
      text: "",
      errorMessage: null,
    };
    const data: LiteralPropositionInputData = Vue.reactive(initialData);

    function onChange(e: InputEvent) {
      e.stopPropagation();
      e.preventDefault();
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
      let items: any = [];
      items.push(Vue.h('input', {
        id: `literal-proposition-input-${id}`,
        onInput: onChange,
        onChange: onChange,
      }));
      if (data.errorMessage) {
        items.push(Vue.h('br'));
        items.push(Vue.h('span', {
          class: 'error',
          style: { 'margin-top': '4px' },
        }, data.errorMessage));
      }

      return Vue.h('div', { class: 'literal-proposition-input' }, items);
    }
  }
}
