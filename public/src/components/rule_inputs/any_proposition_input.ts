import Vue from '../../vue.js'

import Term from '../../data/terms/term.js'
import { litTerm } from '../../data/terms/literal.js'

import Predicate, {allFunctions} from '../../data/predicates/predicate.js'
import { PropositionType, propositionTypeToString } from '../../data/propositions/propositions.js'
import { lit } from '../../data/predicates/literal.js'
import { not } from '../../data/predicates/negation.js'
import { must } from '../../data/predicates/box.js'
import { can } from '../../data/predicates/diamond.js'
import { and } from '../../data/predicates/conjunction.js'
import { or } from '../../data/predicates/disjunction.js'
import { then } from '../../data/predicates/conditional.js'
import { iff } from '../../data/predicates/biconditional.js'
import { eq } from '../../data/predicates/equality.js'
import { forAll } from '../../data/predicates/universal.js'
import { exists } from '../../data/predicates/existential.js'

import { makeFreeTermInput } from './free_term_input.js'
import { makeVariableInput } from './variable_input.js'
import { makeLiteralPropositionInput } from './literal_proposition_input.js'

export class AnyPropositionInputProps {
  readonly bank: Predicate[] = [];
  readonly termBank: Term[] = [];
  readonly target: Predicate = lit("");
  readonly extraTerms: Term[] = [];
  readonly allowedTypes: PropositionType[] = [];
}

interface AnyPropositionInputData {
  chosenType: PropositionType,
  prop1: Predicate|null,
  prop2: Predicate|null,
  term1: Term|null,
  term2: Term|null,
  variable: Term,
}

const AnyPropositionInput = {
  props: Object.keys(new AnyPropositionInputProps()),
  emits: [ 'change' ],

  setup(props: AnyPropositionInputProps, {emit}: any) {

    const functions = allFunctions(props.bank.concat([props.target]));

    const initialData: AnyPropositionInputData = {
      chosenType: props.allowedTypes[0],
      prop1: null,
      prop2: null,
      term1: null,
      term2: null,
      variable: litTerm(""),
    };
    const data: AnyPropositionInputData = Vue.reactive(initialData);

    function onPropositionChange(p: Predicate|null) {
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
	case PropositionType.NECESSITY:
	  emit('change', must(p));
	  break;
	case PropositionType.POSSIBILITY:
	  emit('change', can(p));
	  break;
        case PropositionType.UNIVERSAL:
          emit('change', forAll(data.variable, p));
          break;
        case PropositionType.EXISTENTIAL:
          emit('change', exists(data.variable, p));
          break;
        default:
          throw new Error("This should never happen.");
      }
    }

    function onPropositionChange1(p: Predicate|null) {
      data.prop1 = p;
      onEitherPropositionChange();
    }

    function onPropositionChange2(p: Predicate|null) {
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
	case PropositionType.BICONDITIONAL:
          emit('change', iff(data.prop1, data.prop2));
          break;
        default:
          throw new Error("This should never happen.");
      }
    }

    function onEqChange1(p: Term|null) {
      data.term1 = p;
      onEitherEqChange();
    }

    function onEqChange2(p: Term|null) {
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

    function onVariableChange(v: Term) {
      data.variable = v;
      onPropositionChange(data.prop1);
    }

    return () => {
      let allTerms: Term[] = props.extraTerms.concat(props.termBank);

      let allPredicates: Predicate[] = [];
      for (const proposition of props.bank.concat([props.target])) {
        for (const literal of proposition.getLiteralPredicates()) {
          let emptyLiteral = literal.emptySlots();
          let alreadyIn = false;
          for (let p of allPredicates) {
            if (emptyLiteral.equals(p)) {
              alreadyIn = true;
              break;
            }
          }
          if (!alreadyIn) {
            allPredicates.push(emptyLiteral);
          }
        }
      }

      let items: any = [];

      const options = [];

      for (const propositionType of props.allowedTypes) {
        if (propositionType == PropositionType.LITERAL) {
          if (allPredicates.length == 0) {
            continue
          }
        }
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
          items.push(makeLiteralPropositionInput({
            allPredicates: allPredicates,
            allTerms: allTerms,
            allFunctions: functions,
          }, {
            onChange: onPropositionChange
          }));
          break;
        case PropositionType.NEGATION:
	case PropositionType.NECESSITY:
	case PropositionType.POSSIBILITY:
          items.push(Vue.h(AnyPropositionInput, {
            bank: props.bank,
            termBank: props.termBank,
            target: props.target,
            allowedTypes: props.allowedTypes,
            extraTerms: props.extraTerms,
            onChange: onPropositionChange
          }));
          break;
        case PropositionType.CONJUNCTION:
        case PropositionType.DISJUNCTION:
        case PropositionType.CONDITIONAL:
	case PropositionType.BICONDITIONAL: {
          let word: string;
          if (data.chosenType == PropositionType.CONJUNCTION) {
            word = "and";
          } else if (data.chosenType == PropositionType.DISJUNCTION) {
            word = "or";
          } else if (data.chosenType == PropositionType.CONDITIONAL) {
            word = "then";
          } else if (data.chosenType == PropositionType.BICONDITIONAL) {
	    word = "if and only if";
	  } else {
            throw new Error("This should never happen");
          }
          const inner = [];
          inner.push(Vue.h(AnyPropositionInput, {
            bank: props.bank,
            termBank: props.termBank,
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
            termBank: props.termBank,
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
          inner.push(makeFreeTermInput(
            {
              termBank: allTerms,
              functionBank: functions,
            },
            {onChange: onEqChange1}
          ));
          inner.push(Vue.h('div', {}, " = "));
          inner.push(makeFreeTermInput(
            {
              termBank: allTerms,
              functionBank: functions,
            },
            {onChange: onEqChange2}
          ));
          items.push(Vue.h('div', { style: {
            'display': 'inline-flex',
            'align-items': 'center',
          }}, inner));
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
          inner.push(makeVariableInput({
            bank: props.bank.concat(props.extraTerms.map(t => eq(t, t))),
            target: props.target,
            forProposition: lit(""),
            simplified: true,
          }, {
            onChange: onVariableChange,
            style: {
              'display': 'inline-block',
            }
          }));
          items.push(Vue.h('div', {style: {'display': 'inline-block'}}, inner));
          items.push(Vue.h(AnyPropositionInput, {
            onChange: onPropositionChange,
            bank: props.bank,
            termBank: props.termBank,
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
