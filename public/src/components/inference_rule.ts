import Vue from '../vue.js'

import AnyPropositionInput, { AnyPropositionInputProps } from './rule_inputs/any_proposition_input.js'
import BankPropositionInput, { BankPropositionInputProps } from './rule_inputs/bank_proposition_input.js'
import VariableInput, { VariableInputProps } from './rule_inputs/variable_input.js'
import NewTermInput, { NewTermInputProps } from './rule_inputs/new_term_input.js'
import FreeTermInput, { FreeTermInputProps } from './rule_inputs/free_term_input.js'
import PropositionFreeTermInput, { PropositionFreeTermInputProps } from './rule_inputs/proposition_free_term_input.js'
import ReplacementInput, { ReplacementInputProps } from './rule_inputs/replacement_input.js'
import ProofInput, { ProofInputProps } from './rule_inputs/proof_input.js'
import LeftRightInput from './rule_inputs/left_right_input.js'

import LevelComponent from './level.js'
import Level from '../data/level.js'
import InferenceRule, { Blank, Input, InputType } from '../data/inference_rules/inference_rule.js'

import Proposition from '../data/propositions/proposition.js'
import { PropositionType, lit } from '../data/propositions/propositions.js'

class InferenceRuleProps {
  readonly rule: InferenceRule = Blank;
  readonly allRules: InferenceRule[] = [];
  readonly allowedTypes: PropositionType[] =[];
  readonly propositions: Proposition[] = [];
  readonly target: Proposition = lit("");
}

interface InferenceRuleData {
  selectedInputs: (Input|null)[],
  errorMessage: string|null,
  producedProposition: Proposition|null,
  alreadyFound: boolean,
  lastProofKey: string,
}

export default {
  props: Object.keys(new InferenceRuleProps()),

  setup(props: InferenceRuleProps, {attrs, slots, emit}: any) {
    const initialData: InferenceRuleData = {
      selectedInputs: new Array<Input|null>(props.rule.inputTypes.length).fill(null),
      errorMessage: null,
      producedProposition: null,
      alreadyFound: false,
      lastProofKey: "",
    };

    const data: InferenceRuleData = Vue.reactive(initialData);

    function inputElement(r: InferenceRule, i: number): any {
      const t = r.inputTypes[i];
      const params = {
        onChange: onInputChange(i),
        style: {
          'display': 'inline-block',
          'margin': '8px'
        },
      }
      switch(t) {
        case InputType.AnyProposition: {
          let p: AnyPropositionInputProps = {
            bank: props.propositions,
            target: props.target,
            allowedTypes: props.allowedTypes,
            extraTerms: r.anyPropositionInfo ? r.anyPropositionInfo(data.selectedInputs) : [],
          }
          return Vue.h(AnyPropositionInput, Object.assign(p, params));
        }

        case InputType.BankProposition: {
          const p: BankPropositionInputProps = {
            bank: props.propositions,
          }
          return Vue.h(BankPropositionInput, Object.assign(p, params));
        }

        case InputType.LeftRight: {
          return Vue.h(LeftRightInput, params);
        }

        case InputType.Variable: {
          if (!r.variableInfo) {
            throw new Error("Rules with inputs of type Variable must populate the variableInfo field.");
          }
          const forProposition = r.variableInfo(data.selectedInputs);
          if (typeof forProposition === 'string') {
            return Vue.h('em', params, forProposition);
          }
          const p: VariableInputProps = {
            bank: props.propositions,
            target: props.target,
            forProposition: forProposition,
          }
          return Vue.h(VariableInput, Object.assign(p, params));
        }

        case InputType.NewTerm: {
          const p: NewTermInputProps = {
            bank: props.propositions,
            target: props.target,
          }
          return Vue.h(NewTermInput, Object.assign(p, params));
        }

        case InputType.FreeTerm: {
          const p: FreeTermInputProps = {
            bank: props.propositions,
            target: props.target,
            extraTerms: [],
          }
          return Vue.h(FreeTermInput, Object.assign(p, params));
        }

        case InputType.PropositionFreeTerm: {
          if (!r.propositionFreeTermInfo) {
            throw new Error("Rules with inputs of type PropositionFreeTerm must populate the propositionFreeTermInfo field.");
          }
          const proposition = r.propositionFreeTermInfo(data.selectedInputs);
          if (typeof proposition === 'string') {
            return Vue.h('em', params, proposition);
          }
          const p: PropositionFreeTermInputProps = {
            proposition: proposition
          }
          return Vue.h(PropositionFreeTermInput, Object.assign(p, params));
        }

        case InputType.Replacement: {
          if (!r.replacementInfo) {
            throw new Error("Rules with inputs of type Replacement must populate the replacementInfo field.");
          }
          const info = r.replacementInfo(data.selectedInputs);
          if (typeof info === 'string') {
            return Vue.h('em', params, info);
          }
          const o = info[0].toString();
          const toR = info[1];
          const w = info[2];
          const p: ReplacementInputProps = {
            original: o,
            toReplace: toR,
            with: w,
          }
          return Vue.h(ReplacementInput, Object.assign(p, params, {key: o + toR + w},));
        }

        case InputType.Proof: {
          if (!r.proofInfo) {
            throw new Error("Rules with inputs of type Proof must populate the proofInfo field.");
          }
          const info = r.proofInfo(data.selectedInputs);
          if (typeof info === 'string') {
            return Vue.h('em', params, info);
          }

          const p: ProofInputProps = {
            rules: props.allRules,
            propositions: props.propositions.concat(info[0]),
            target: info[1],
            allowedTypes: props.allowedTypes,
          }
          return Vue.h(ProofInput, Object.assign(p, params, {key: data.lastProofKey}));
        }
      }
    }

    function onApplyClick() {
      data.errorMessage = null;
      data.producedProposition = null;
      const actualInput: Input[] = [];
      for (const p of data.selectedInputs) {
        if (p === null) {
          data.errorMessage = "Not all inputs have been selected.";
          return;
        } else {
          actualInput.push(p);
        }
      }
      const error = props.rule.doesApply(actualInput);
      if (error.length > 0) {
        data.errorMessage = error;
      } else {
        const newProposition = props.rule.apply(actualInput);
        data.producedProposition = newProposition;
        data.alreadyFound = false;
        for (const p of props.propositions) {
          if (p.equals(newProposition)) {
            data.alreadyFound = true;
            break;
          }
        }
        if (!data.alreadyFound) {
          emit('newProposition', data.producedProposition);
        }
      }
    }

    function onInputChange(i: number) {
      return (input: Input|null) => {
        data.selectedInputs[i] = input;
        if (props.rule.proofInfo) {
          const info = props.rule.proofInfo(data.selectedInputs);
          if (typeof info === 'string') {
            data.lastProofKey = '';
          } else {
            data.lastProofKey = info[0].concat(info[1]).map(p => p.toString()).join("-");
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
        details.push(Vue.h('br'));
        details.push(inputElement(props.rule, 0));
        details.push(Vue.h('br'));
      } else {
        const list = [];
        for (let i = 0; i < props.rule.inputTypes.length; ++i) {
          list.push(Vue.h('li', {}, [
            props.rule.inputDescriptions[i],
            Vue.h('br'),
            inputElement(props.rule, i),
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
        onClick: onApplyClick,
        style: { 'margin': '8px' },
      }, "Apply!"));
      if (data.errorMessage != null) {
        details.push(Vue.h('br'));
        details.push(Vue.h('br'));
        details.push(Vue.h('span', { class: 'error' }, data.errorMessage));
      }
      if (data.producedProposition != null) {
        const p = data.producedProposition.toString();
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

      return Vue.h('details', { class: 'inference-rule' }, [
        Vue.h('summary', {}, props.rule.name),
        Vue.h('div', {}, details),
      ]);
    }
  }
}
