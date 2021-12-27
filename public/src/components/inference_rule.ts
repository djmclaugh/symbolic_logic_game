import Vue from '../vue.js'

import FreePropositionPicker from './free_proposition_picker.js'

import LevelComponent from './level.js'
import Level from '../data/level.js'
import InferenceRule, { Blank, Input, InputType } from '../data/inference_rule.js'
import PropositionHelpers, { Proposition, then } from '../data/proposition.js'

class InferenceRuleProps {
  readonly rule: InferenceRule = Blank;
  readonly allRules: InferenceRule[] = [];
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
    let lastProofKey = "";
    const data: InferenceRuleData = Vue.reactive(initialData);

    function inputFromType(t: InputType, i: number): any {
      if (t == InputType.AnyProposition) {
        return Vue.h(FreePropositionPicker, {
          onChange: onFreeChange(i),
          style: { 'margin': '8px' },
        });
      } else if (t == InputType.BankProposition) {
        const options = [];
        for (let i = 0; i < props.propositions.length; ++i) {
          const p = props.propositions[i];
          options.push(Vue.h('option', { value: i }, PropositionHelpers.toString(p)));
        }
        return Vue.h('select', {
          onChange: onBankChange(i),
          style: { 'margin': '8px' },
        }, [
          Vue.h('option', { value: -1 }, "Select a proposition"),
        ].concat(options));
      } else if (t ==  InputType.LeftRight) {
        return Vue.h('select', {
          style: { 'margin': '8px' },
          onChange: onDirectionChange(i),
        }, [
          Vue.h('option', { value: "" }, "Select a side"),
          Vue.h('option', { value: "left" }, "Left"),
          Vue.h('option', { value: "right" }, "Right"),
        ]);
      } else if (t == InputType.Proof) {
        if (data.selectedPropositions[0] == null || data.selectedPropositions[1] == null) {
          return Vue.h('em', {
            style: {
              'display': 'inline-block',
              'margin-top': '8px',
            }
          }, 'Antecedent and consequent must be chosen before working on proof.');
        } else {
          const p = data.selectedPropositions[0] as Proposition;
          const q = data.selectedPropositions[1] as Proposition;
          if (lastProofKey != PropositionHelpers.toString(then(p, q))) {
            data.selectedPropositions[2] = 'not done';
          }
          lastProofKey = PropositionHelpers.toString(then(p, q))
          const sublevel: Level = {
            name: `Sublevel: ${lastProofKey}`,
            rules: props.allRules,
            propositions: props.propositions.concat([data.selectedPropositions[0] as Proposition]),
            target: data.selectedPropositions[1] as Proposition,
          };
          return Vue.h(LevelComponent, {
            id: lastProofKey,
            level: sublevel,
            isSublevel: true,
            onLevelClear: () => { data.selectedPropositions[2] = 'done'; },
            onRestart: () => { data.selectedPropositions[2] = 'not done'; },
          })
        }
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

    function onFreeChange(i: number) {
      return (p: Proposition|null) => {
        data.selectedPropositions[i] = p;
      };
    }

    function onBankChange(i: number) {
      return (e: InputEvent) => {
        e.stopPropagation();
        const target: HTMLSelectElement = e.target as HTMLSelectElement;
        const v : number = parseInt(target.value);
        if (v == -1) {
          data.selectedPropositions[i] = null;
        } else {
          data.selectedPropositions[i] = props.propositions[v];
        }
      };
    }

    function onDirectionChange(i: number) {
      return (e: InputEvent) => {
        e.stopPropagation();
        const target: HTMLSelectElement = e.target as HTMLSelectElement;
        if (target.value == "") {
          data.selectedPropositions[i] = null;
        } else {
          data.selectedPropositions[i] = target.value as "left"|"right";
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
