import Vue from '../../vue.js'

import Select from '../shared/select.js'

import Term from '../../data/terms/term.js'
import { litTerm } from '../../data/terms/literal.js'
import Predicate from '../../data/predicates/predicate.js'
import { lit } from '../../data/predicates/literal.js'

export class NewExistentialTermInputProps {
  readonly existentialBank: Term[] = [];
}

const bold = ["𝗮","𝗯","𝗰","𝗱","𝗲","𝗳","𝗴","𝗵","𝗶","𝗷","𝗸","𝗹","𝗺","𝗻","𝗼","𝗽","𝗾","𝗿","𝘀","𝘁","𝘂","𝘃","𝘄","𝘅","𝘆","𝘇","𝗔","𝗕","𝗖","𝗗","𝗘","𝗙","𝗚","𝗛","𝗜","𝗝","𝗞","𝗟","𝗠","𝗡","𝗢","𝗣","𝗤","𝗥","𝗦","𝗧","𝗨","𝗩","𝗪","𝗫","𝗬","𝗭"];
const boldTerms = bold.map(s => litTerm(s));
const normal = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

enum InputType {
  RECOMMENDED = 0,
  FREE = 1,
}

const INPUT_TYPES = [
  InputType.RECOMMENDED,
  InputType.FREE,
]

function inputTypeToString(t: InputType): string {
  switch(t) {
    case InputType.RECOMMENDED:
      return 'Recommended Terms:'
    case InputType.FREE:
      return 'Free Choice:'
  }
}

interface NewTermInputData {
  inputType: InputType,
  errorMessage: null|string,
}

const NewTermInputComponent = {
  props: Object.keys(new NewExistentialTermInputProps()),
  emits: [ 'change' ],

  setup(props: NewExistentialTermInputProps, {emit}: any) {
    const initialData: NewTermInputData = {
      inputType: InputType.RECOMMENDED,
      errorMessage: null,
    };
    const data: NewTermInputData = Vue.reactive(initialData);

    const recommendations: Term[] = boldTerms.filter(r => {
        for (const t of props.existentialBank) {
          if (t.equals(r)) {
            return false;
          }
        }
        return true;
    })

    let length = 1;
    while (recommendations.length == 0) {
      length += 1;
      let counter = [];
      for (let i = 0; i < length; ++i) {
        counter.push(0);
      }
      let exaustedCounter = false;
      while (!exaustedCounter) {
        let t = litTerm(counter.map(i => bold[i]).join(""));
        let isNew = true;
        for (const alreadyThere of props.existentialBank) {
          if (alreadyThere.equals(t)) {
            isNew = false;
            break;
          }
        }
        if (isNew) {
          recommendations.push(t);
          if (recommendations.length > 5) {
            break;
          }
        }
        let index = length - 1;
        counter[index] += 1;
        while (counter[index] >= bold.length) {
          counter[index] = 0;
          index -= 1;
          if (index < 0) {
            exaustedCounter = true;
            break;
          } else {
            counter[index] += 1;
          }
        }
      }
    }

    emit('change', recommendations[0]);

    return () => {
      const items = [];

      items.push(Vue.h(Select, {
        options: INPUT_TYPES.map(inputTypeToString),
        onChange: (i: number) => {
          data.inputType = INPUT_TYPES[i];
          if (data.inputType == InputType.RECOMMENDED) {
            emit('change', recommendations[0]);
          }
        },
      }));
      if (data.inputType == InputType.RECOMMENDED) {
        items.push(Vue.h(Select, {
          options: recommendations.map(t => t.toString()),
          onChange: (i: number) => {
            emit('change', recommendations[i])
          },
        }));
      } else {
        // TODO
        items.push(Vue.h('span', {}, "TODO"))
      }

      return Vue.h('div', {}, items);
    }
  }
}

export function makeNewExistentialTermInput(p: NewExistentialTermInputProps, extra: any = {}) {
  return Vue.h(NewTermInputComponent, Object.assign(p, extra));
}
