import Vue from '../vue.js'

import FreePropositionPicker from './free_proposition_picker.js'

import InferenceRule, { Blank, Input, InputType } from '../data/inference_rule.js'
import PropositionHelpers, {Proposition} from '../data/proposition.js'

class InferenceRuleProps {
  readonly rule: InferenceRule = Blank;
  readonly propositions: Proposition[] = [];
}

interface InferenceRuleData {
  selectedPropositions: (Input|null)[],
  errorMessage: string|null,
  producedProposition: Proposition|null,
  alreadyFound: boolean,
}

export default {
  props: Object.keys(new InferenceRuleProps()),

  setup(props: InferenceRuleProps, {attrs, slots, emit}: any) {

    const initialData: InferenceRuleData = {
      selectedPropositions: new Array<Proposition|null>(props.rule.inputTypes.length).fill(null),
      errorMessage: null,
      producedProposition: null,
      alreadyFound: false,
    };
    const data: InferenceRuleData = Vue.reactive(initialData);

    function inputFromType(t: InputType, i: number): any {
      if (t == InputType.AnyProposition) {
        return Vue.h(FreePropositionPicker, {
          onChange: () => {},
          style: { 'margin': '8px' },
        });
      } else if (t == InputType.BankProposition) {
        const options = [];
        for (let i = 0; i < props.propositions.length; ++i) {
          const p = props.propositions[i];
          options.push(Vue.h('option', { value: i }, PropositionHelpers.toString(p)));
        }
        return Vue.h('select', {
          onChange: onChange(i),
          style: { 'margin': '8px' },
        }, [
          Vue.h('option', { value: -1 }, "Select a proposition"),
        ].concat(options));
      } else if (t ==  InputType.LeftRight) {
        return Vue.h('select', {
          style: { 'margin': '8px' },
          onChange: onChange(i),
        }, [
          Vue.h('option', { value: "" }, "Select a side"),
          Vue.h('option', { value: "left" }, "Left"),
          Vue.h('option', { value: "right" }, "Right"),
        ]);
      } else {
        return Vue.h('span', {}, `Unknown input type: ${t}`);
      }
    }

    function onClick(e: MouseEvent) {
      data.errorMessage = null;
      data.producedProposition = null;
      const actualInput: Input[] = [];
      for (const p of data.selectedPropositions) {
        if (p === null) {
          data.errorMessage = "Not all input has been selected.";
          return;
        } else {
          actualInput.push(p);
        }
      }
      const error = props.rule.doesApply(actualInput);
      if (error.length > 0) {
        data.errorMessage = error;
      } else {
        data.producedProposition = props.rule.apply(actualInput);
        data.alreadyFound = false;
        for (const p of props.propositions) {
          if (PropositionHelpers.areTheSame(p, data.producedProposition)) {
            data.alreadyFound = true;
            break;
          }
        }
        if (!data.alreadyFound) {
          emit('newProposition', data.producedProposition);
        }
      }
    }

    function onChange(i: number) {
      return (e: InputEvent) => {
        const target: HTMLSelectElement = e.target as HTMLSelectElement;
        const type = props.rule.inputTypes[i];
        if (type == InputType.BankProposition) {
          const v : number = parseInt(target.value);
          if (v == -1) {
            data.selectedPropositions[i] = null;
          } else {
            data.selectedPropositions[i] = props.propositions[v];
          }
        } else if (type == InputType.LeftRight) {
          if (target.value == "") {
            data.selectedPropositions[i] = null;
          } else {
            data.selectedPropositions[i] = target.value as "left"|"right";
          }
        }
      };
    }

    return () => {
      let details = [];
      details.push(Vue.h('span', {
        style: {
          "font-weight": "bold",
        },
      }, 'Needs: '));
      if (props.rule.inputDescriptions.length == 1) {
        details.push(Vue.h('span', {}, props.rule.inputDescriptions[0]));
        const t = props.rule.inputTypes[0];
        details.push(Vue.h('br'));
        details.push(inputFromType(props.rule.inputTypes[0], 0));
        details.push(Vue.h('br'));
      } else {
        const list = [];
        for (let i = 0; i < props.rule.inputTypes.length; ++i) {
          list.push(Vue.h('li', {}, [
            props.rule.inputDescriptions[i],
            Vue.h('br'),
            inputFromType(props.rule.inputTypes[i], i)
          ]));
        }
        details.push(Vue.h('ul', {}, list));
      }

      details.push(Vue.h('br'));

      details.push(Vue.h('span', {
        style: {
          "font-weight": "bold",
        },
      }, "Gives: "));
      details.push(Vue.h('span', {}, props.rule.outputDescription));
      details.push(Vue.h('br'));

      details.push(Vue.h('button', {
        onClick: onClick,
        style: { 'margin': '8px' },
      }, "Apply!"));
      if (data.errorMessage != null) {
        details.push(Vue.h('br'));
        details.push(Vue.h('br'));
        details.push(Vue.h('span', { class: 'error' }, data.errorMessage));
      }
      if (data.producedProposition != null) {
        const p = PropositionHelpers.toString(data.producedProposition);
        details.push(Vue.h('br'));
        details.push(Vue.h('br'));
        details.push(Vue.h('span', {}, `Proposition created: ${p}`));
        if (data.alreadyFound) {
          details.push(Vue.h('br'));
          details.push(Vue.h('span', {}, `Proposition already in proposition bank.`));
        } else {
          details.push(Vue.h('br'));
          details.push(Vue.h('span', {}, `Proposition added to proposition bank.`));
        }
      }

      return Vue.h('details', {}, [
        Vue.h('summary', {}, props.rule.name),
        Vue.h('div', {}, details),
      ]);
    }
  }
}
