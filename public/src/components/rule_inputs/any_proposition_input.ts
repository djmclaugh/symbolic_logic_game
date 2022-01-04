import Vue from '../../vue.js'

import { Term, Variable } from '../../data/term.js'

import Proposition, { Predicate } from '../../data/propositions/proposition.js'
import {
  lit, not, and, or, then, eq, forall, exists,
  PropositionType, propositionTypeToString
} from '../../data/propositions/propositions.js'

import FreeTermInput from './free_term_input.js'
import VariableInput from './variable_input.js'
import LiteralPropositionInput from './literal_proposition_input.js'
import Select from '../shared/select.js'

export class AnyPropositionInputProps {
  readonly bank: Proposition[] = [];
  readonly target: Proposition = lit("");
  readonly extraTerms: string[] = [];
  readonly allowedTypes: PropositionType[] = [];
}

interface AnyPropositionInputData {
  chosenType: PropositionType,
  prop1: Proposition|null,
  prop2: Proposition|null,
  term1: Term|null,
  term2: Term|null,
  variable: Variable,
}

const AnyPropositionInput = {
  props: Object.keys(new AnyPropositionInputProps()),
  emits: [ 'change' ],

  setup(props: AnyPropositionInputProps, {attrs, slots, emit}: any) {
    const initialData: AnyPropositionInputData = {
      chosenType: PropositionType.LITERAL,
      prop1: null,
      prop2: null,
      term1: null,
      term2: null,
      variable: "",
    };
    const data: AnyPropositionInputData = Vue.reactive(initialData);

    function onPropositionChange(p: Proposition|null) {
      data.prop1 = p;
      if (p == null) {
        emit('change', null);
        return;
      }
      switch (data.chosenType) {
        case PropositionType.LITERAL:
          emit('change', p);
          break;
        case PropositionType.NEGATION:
          emit('change', not(p));
          break;
        case PropositionType.UNIVERSAL:
          emit('change', forall(data.variable, p));
          break;
        case PropositionType.EXISTENTIAL:
          emit('change', exists(data.variable, p));
          break;
        default:
          throw new Error("This should never happen.");
      }
    }

    function onPropositionChange1(p: Proposition|null) {
      data.prop1 = p;
      onEitherPropositionChange();
    }

    function onPropositionChange2(p: Proposition|null) {
      data.prop2 = p;
      onEitherPropositionChange();
    }

    function onEitherPropositionChange() {
      if (data.prop1 == null || data.prop2 == null) {
        emit('change', null);
        return;
      }
      switch (data.chosenType) {
        case PropositionType.CONJUNCTION:
          emit('change', and(data.prop1, data.prop2));
          break;
        case PropositionType.DISJUNCTION:
          emit('change', or(data.prop1, data.prop2));
          break;
        case PropositionType.CONDITIONAL:
          emit('change', then(data.prop1, data.prop2));
          break;
        default:
          throw new Error("This should never happen.");
      }
    }

    function onEqChange1(p: string|null) {
      data.term1 = p;
      onEitherEqChange();
    }

    function onEqChange2(p: string|null) {
      data.term2 = p;
      onEitherEqChange();
    }

    function onEitherEqChange() {
      if (data.term1 == null || data.term2 == null) {
        emit('change', null);
        return;
      }
      emit('change', eq(data.term1, data.term2));
    }

    function onVariableChange(v: Variable) {
      data.variable = v;
      onPropositionChange(data.prop1);
    }

    return () => {
      const allLiterals: string[] = [];
      for (let p of props.bank) {
        for (let l of p.allLiterals()) {
          if (allLiterals.indexOf(l) == -1) {
            allLiterals.push(l);
          }
        }
      }
      for (let l of props.target.allLiterals()) {
        if (allLiterals.indexOf(l) == -1) {
          allLiterals.push(l);
        }
      }

      const allPredicates: Predicate[] = [];
      for (let p of props.bank) {
        for (let pred of p.allPredicates()) {
          let alreadyIn = false;
          for (let existingPred of allPredicates) {
            if (pred.equals(existingPred)) {
              alreadyIn = true;
              break;
            }
          }
          if (!alreadyIn) {
            allPredicates.push(pred);
          }
        }
      }

      for (let pred of props.target.allPredicates()) {
        let alreadyIn = false;
        for (let existingPred of allPredicates) {
          if (pred.equals(existingPred)) {
            alreadyIn = true;
            break;
          }
        }
        if (!alreadyIn) {
          allPredicates.push(pred);
        }
      }

      let allTerms: Term[] = [];
      allTerms = allTerms.concat(props.extraTerms);
      for (let p of props.bank) {
        for (let term of p.allTerms()) {
          let alreadyIn = false;
          for (let existingTerm of allTerms) {
            if (term == existingTerm) {
              alreadyIn = true;
              break;
            }
          }
          if (!alreadyIn) {
            allTerms.push(term);
          }
        }
      }
      for (let term of props.target.allTerms()) {
        let alreadyIn = false;
        for (let existingTerm of allTerms) {
          if (term == existingTerm) {
            alreadyIn = true;
            break;
          }
        }
        if (!alreadyIn) {
          allTerms.push(term);
        }
      }

      let items: any = [];

      const options = [];
      for (const propositionType of props.allowedTypes) {
        options.push(Vue.h('option', {
          value: propositionType,
          selected: data.chosenType == propositionType,
        }, propositionTypeToString(propositionType)));
      }
      items.push(Vue.h('select', {
          onChange: (e: InputEvent) => {
            e.stopPropagation();
            const t: HTMLSelectElement = e.target as HTMLSelectElement;
            data.chosenType = parseInt(t.value);
            data.prop1 = null;
            data.prop2 = null;
            emit('change', null);
          },
          style: {
            'margin-right': '8px',
          }
      }, options));

      switch (data.chosenType) {
        case PropositionType.LITERAL:
          items.push(Vue.h(LiteralPropositionInput, {
            allLiterals: allLiterals,
            allPredicates: allPredicates,
            allTerms: allTerms,
            onChange: onPropositionChange
          }));
          break;
        case PropositionType.NEGATION:
          items.push(Vue.h(AnyPropositionInput, {
            bank: props.bank,
            target: props.target,
            allowedTypes: props.allowedTypes,
            extraTerms: props.extraTerms,
            onChange: onPropositionChange
          }));
          break;
        case PropositionType.CONJUNCTION:
        case PropositionType.DISJUNCTION:
        case PropositionType.CONDITIONAL: {
          let word: string;
          if (data.chosenType == PropositionType.CONJUNCTION) {
            word = "and";
          } else if (data.chosenType == PropositionType.DISJUNCTION) {
            word = "or";
          } else if (data.chosenType == PropositionType.CONDITIONAL) {
            word = "then";
          } else {
            throw new Error("This should never happen");
          }
          const inner = [];
          inner.push(Vue.h(AnyPropositionInput, {
            bank: props.bank,
            target: props.target,
            allowedTypes: props.allowedTypes,
            extraTerms: props.extraTerms,
            onChange: onPropositionChange1
          }));
          inner.push(Vue.h('span', {
            style: {
              'margin-left': '50px',
            }
          }, word));
          inner.push(Vue.h(AnyPropositionInput, {
            bank: props.bank,
            target: props.target,
            allowedTypes: props.allowedTypes,
            extraTerms: props.extraTerms,
            onChange: onPropositionChange2
          }));
          items.push(Vue.h('div', {}, inner));
          break;
        }
        case PropositionType.EQUALITY: {
          const inner = [];

          inner.push(Vue.h(FreeTermInput, Object.assign({
            onChange: onEqChange1,
          }, props)));
          inner.push(Vue.h('span', {}, " = "));
          inner.push(Vue.h(FreeTermInput, Object.assign({
            onChange: onEqChange2,
          }, props)));
          items.push(Vue.h('div', { style: {'display': 'inline-block'}}, inner));
          break;
        }
        case PropositionType.UNIVERSAL:
        case PropositionType.EXISTENTIAL: {
          const inner = [];

          if (data.chosenType == PropositionType.UNIVERSAL) {
            inner.push(Vue.h('span', {}, "∀"));
          } else if (data.chosenType == PropositionType.EXISTENTIAL) {
            inner.push(Vue.h('span', {}, "∃"));
          }
          inner.push(Vue.h(VariableInput, {
            onChange: onVariableChange,
            bank: props.bank.concat(props.extraTerms.map(t => eq(t, t))),
            target: props.target,
            forProposition: lit(""),
            simplified: true,
            style: {
              'display': 'inline-block',
            },
          }));
          items.push(Vue.h('div', {style: {'display': 'inline-block'}}, inner));
          items.push(Vue.h(AnyPropositionInput, {
            onChange: onPropositionChange,
            bank: props.bank,
            target: props.target,
            allowedTypes: props.allowedTypes,
            extraTerms: [data.variable].concat(props.extraTerms),
          }));
          break;
        }
        default:

      }

      return Vue.h('div', { class: "free-proposition-picker" }, items);
    }
  }
}

export default AnyPropositionInput;
