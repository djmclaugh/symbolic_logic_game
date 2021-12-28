import Vue from '../vue.js'

import InferenceRule, { Blank, Input, InputType } from '../data/inference_rule.js'
import PropositionHelpers, {
  lit,
  not,
  and,
  or,
  then,
  Proposition,
  PropositionType,
  PROPOSITION_TYPES,
  propositionTypeToString,
} from '../data/proposition.js'

import LiteralPropositionInput from './literal_proposition_input.js'

class FreePropositionPickerProps {
  readonly bank: Proposition[] = [];
  readonly target: Proposition = lit("");
}

interface FreePropositionPickerData {
  chosenType: PropositionType,
  prop1: Proposition|null,
  prop2: Proposition|null,
}

const FreePropositionPicker = {
  props: Object.keys(new FreePropositionPickerProps()),

  setup(props: FreePropositionPickerProps, {attrs, slots, emit}: any) {

    const allLiterals: string[] = [];
    for (let p of props.bank) {
      for (let l of PropositionHelpers.allLiterals(p)) {
        if (allLiterals.indexOf(l) == -1) {
          allLiterals.push(l);
        }
      }
    }
    for (let l of PropositionHelpers.allLiterals(props.target)) {
      if (allLiterals.indexOf(l) == -1) {
        allLiterals.push(l);
      }
    }

    const initialData: FreePropositionPickerData = {
      chosenType: PropositionType.LITERAL,
      prop1: null,
      prop2: null,
    };
    const data: FreePropositionPickerData = Vue.reactive(initialData);

    function onPropositionChange(p: Proposition|null) {
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

    return () => {
      let items: any = [];

      const options = [];
      for (const propositionType of PROPOSITION_TYPES) {
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
            onChange: onPropositionChange
          }));
          break;
        case PropositionType.NEGATION:
          items.push(Vue.h(FreePropositionPicker, {
            bank: props.bank,
            target: props.target,
            onChange: onPropositionChange
          }));
          break;
        default:
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
          inner.push(Vue.h(FreePropositionPicker, {
            bank: props.bank,
            target: props.target,
            onChange: onPropositionChange1
          }));
          inner.push(Vue.h('span', {
            style: {
              'margin-left': '50px',
            }
          }, word));
          inner.push(Vue.h(FreePropositionPicker, {
            bank: props.bank,
            target: props.target,
            onChange: onPropositionChange2
          }));
          items.push(Vue.h('div', {}, inner));
          break;
      }

      return Vue.h('div', { class: "free-proposition-picker" }, items);
    }
  }
}

export default FreePropositionPicker;
