import Vue from '../vue.js'

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
      }, "Needs: "));
      details.push(Vue.h('span', {}, props.rule.inputDescription));
      details.push(Vue.h('br'));

      const options = [];
      for (let i = 0; i < props.propositions.length; ++i) {
        const p = props.propositions[i];
        options.push(Vue.h('option', { value: i }, PropositionHelpers.toString(p)));
      }
      for (let i = 0; i < props.rule.inputTypes.length; ++i) {
        const t = props.rule.inputTypes[i];
        if (t == InputType.BankProposition) {
          details.push(Vue.h('select', {
            onChange: onChange(i),
          }, [
            Vue.h('option', { value: -1 }, "Select a proposition"),
          ].concat(options)));
        } else if (t ==  InputType.LeftRight) {
          details.push(Vue.h('select', {
            onChange: onChange(i),
          }, [
            Vue.h('option', { value: "" }, "Select a side"),
            Vue.h('option', { value: "left" }, "Left"),
            Vue.h('option', { value: "right" }, "Right"),
          ]));
        } else {
          details.push(Vue.h('span', {}, `Unknown input type: ${t}`));
        }

      }

      details.push(Vue.h('br'));
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
      }, "Apply!"));
      if (data.errorMessage != null) {
        details.push(Vue.h('br'));
        details.push(Vue.h('br'));
        details.push(Vue.h('span', {}, data.errorMessage));
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
