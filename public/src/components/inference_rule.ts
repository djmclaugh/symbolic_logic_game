import Vue from '../vue.js'

import AnyPropositionInput, { AnyPropositionInputProps } from './rule_inputs/any_proposition_input.js'
import { BankPropositionInputProps, makeBankPropositionInput } from './rule_inputs/bank_proposition_input.js'
import { VariableInputProps, makeVariableInput } from './rule_inputs/variable_input.js'
import { FreeTermInputProps, makeFreeTermInput } from './rule_inputs/free_term_input.js'
import { PropositionFreeTermInputProps, makePropositionFreeTermInput } from './rule_inputs/proposition_free_term_input.js'
import { ReplacementInputProps, makeReplacementInput } from './rule_inputs/replacement_input.js'
import { ProofInputProps, makeProofInput } from './rule_inputs/proof_input.js'
import { makeLeftRightInput } from './rule_inputs/left_right_input.js'

import SelectComponent from './shared/select.js'

import InferenceRule, { Blank, Input, InputType } from '../data/inference_rules/inference_rule.js'

import Term from '../data/terms/term.js'
import { litTerm } from '../data/terms/literal.js'
import Predicate, {allFunctions} from '../data/predicates/predicate.js'
import {lit} from '../data/predicates/literal.js'
import { PropositionType } from '../data/propositions/propositions.js'

class InferenceRuleProps {
  readonly rule: InferenceRule = Blank;
  readonly allRules: InferenceRule[] = [];
  readonly allowedTypes: PropositionType[] =[];
  readonly propositions: Predicate[] = [];
  readonly termBank: Term[] = [];
  readonly existentialBank: Term[] = [];
  readonly universalBank: Term[] = [];
  readonly target: Predicate = lit("");
}

interface InferenceRuleData {
  selectedInputs: (Input|null)[],
  errorMessage: string|null,
  producedProposition: Predicate|null,
  producedTerm: Term|null,
  alreadyFound: boolean,
  lastProofKey: string,
  open: boolean,
}

const InferenceRuleComponent = {
  props: Object.keys(new InferenceRuleProps()),

  setup(props: InferenceRuleProps, {emit}: any) {
      const initialData: InferenceRuleData = {
      selectedInputs: new Array<Input|null>(props.rule.inputTypes.length).fill(null),
      errorMessage: null,
      producedProposition: null,
      producedTerm: null,
      alreadyFound: false,
      lastProofKey: "",
      open: false,
    };

    const data: InferenceRuleData = Vue.reactive(initialData);
    onInputChange(0)(data.selectedInputs[0]);

    const functions = allFunctions(props.propositions.concat([props.target]));

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
            termBank: props.termBank.concat(props.existentialBank).concat(props.universalBank),
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
          return makeBankPropositionInput(p, params);
        }

        case InputType.LeftRight: {
          return makeLeftRightInput(params);
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
          return makeVariableInput(p, params);
        }

        case InputType.NewExistentialTerm: {
          const bold = ["𝗮","𝗯","𝗰","𝗱","𝗲","𝗳","𝗴","𝗵","𝗶","𝗷","𝗸","𝗹","𝗺","𝗻","𝗼","𝗽","𝗾","𝗿","𝘀","𝘁","𝘂","𝘃","𝘄","𝘅","𝘆","𝘇","𝗔","𝗕","𝗖","𝗗","𝗘","𝗙","𝗚","𝗛","𝗜","𝗝","𝗞","𝗟","𝗠","𝗡","𝗢","𝗣","𝗤","𝗥","𝗦","𝗧","𝗨","𝗩","𝗪","𝗫","𝗬","𝗭"];
          let length = 0;
          let foundTerm = false;
          while (!foundTerm) {
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
                params.onChange(t);
                foundTerm = true;
                break;
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
          return null;
        }

        case InputType.UniversalTerm: {
          const p: FreeTermInputProps = {
            termBank: props.universalBank,
            functionBank: []
          }
          return makeFreeTermInput(p, params);
        }

        case InputType.FreeTerm: {
          const p: FreeTermInputProps = {
            termBank: props.termBank.concat(props.existentialBank).concat(props.universalBank),
            functionBank: functions
          }
          return makeFreeTermInput(p, params);
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
          return makePropositionFreeTermInput(p, params);
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
          const toR = info[1].toString();
          const w = info[2].toString();
          const p: ReplacementInputProps = {
            original: o,
            toReplace: toR,
            with: w,
          }
          return makeReplacementInput(p, Object.assign(params, {key: o + toR + w}));
        }

        case InputType.Axiom: {
          if (!r.axiomInfo) {
            throw new Error("Rules with inputs of type Axiom must populate the axiomInfo field.");
          }
          const info = r.axiomInfo(data.selectedInputs);
          if (typeof info === 'string') {
            return Vue.h('em', params, info);
          }
          return Vue.h(SelectComponent, {
            selected: 0,
            options: info.map(p => p.toString()),
            onChange: (i: number) => { params.onChange(info[i]) },
            style: params.style,
          });
        }

        case InputType.Proof: {
          if (!r.proofInfo) {
            throw new Error("Rules with inputs of type Proof must populate the proofInfo field.");
          }
          const info = r.proofInfo(data.selectedInputs);
          if (typeof info === 'string') {
            return Vue.h('em', params, info);
          }

          let newProps = props.propositions.concat();
          for (const p of info[0]) {
            if (!newProps.some(existingProp => p.equals(existingProp))) {
              newProps.unshift(p);
            }
          }

          const p: ProofInputProps = {
            rules: props.allRules,
            propositions: newProps,
            termBank: props.termBank,
            existentialBank: props.existentialBank,
            universalBank: props.universalBank,
            target: info[2],
            allowedTypes: props.allowedTypes,
          }
          return makeProofInput(p, Object.assign(params, {key: data.lastProofKey}));
        }
      }
    }

    function onApplyClick() {
      if (!data.alreadyFound) {
        emit('newProposition', data.producedProposition);
	data.alreadyFound = true;
      }
      if (data.producedTerm && !props.existentialBank.some(term => term.equals(data.producedTerm!))) {
        props.existentialBank.push(data.producedTerm);
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
            data.lastProofKey = info[0].map(p => p.toString()).join() + info[1].map(t => t.toString()).join() + info[2].toString();
          }
        }
        data.errorMessage = null;
        data.producedProposition = null;
	data.alreadyFound = false;
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
	  return;
	}
        const result = props.rule.apply(actualInput);
        data.producedProposition = Array.isArray(result) ? result[0] : result;
        if (Array.isArray(result)) {
          data.producedTerm = result[1];
        }
        data.alreadyFound = false;
        for (const p of props.propositions) {
          if (p.equals(data.producedProposition)) {
            data.alreadyFound = true;
            break;
          }
        }
      };
    }

    function makeDetails() {
      let details = [];
      if (props.rule.inputDescriptions.length == 1) {
        details.push(Vue.h('span', {}, props.rule.inputDescriptions[0]));
        details.push(Vue.h('br'));
        details.push(inputElement(props.rule, 0));
        details.push(Vue.h('br'));
        if (props.rule.inputTypes.length > 1) {
          inputElement(props.rule, 1);
        }
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

      details.push(Vue.h('span', {
        style: {
          "font-weight": "bold",
        },
      }, "Result: "));
      if (data.errorMessage) {
	details.push(Vue.h('em', {}, data.errorMessage));
      } else {
	details.push(Vue.h('span', {}, data.producedProposition?.toString()));
      }
      details.push(Vue.h('br'));
      details.push(Vue.h('button', {
        onClick: onApplyClick,
	disabled: data.producedProposition === null || data.alreadyFound,
        style: {},
      }, "Add To Deductions"));
      if (data.alreadyFound) {
        details.push(Vue.h('br'));
        details.push(Vue.h('em', {}, `Proposition already added.`));
      }

      return details;
    }

    return () => {
      return Vue.h('div', {}, makeDetails());
    }
  }
}

export function makeInferenceRule(p: InferenceRuleProps, extra: any = {}) {
  return Vue.h(InferenceRuleComponent, Object.assign(p, extra));
}
