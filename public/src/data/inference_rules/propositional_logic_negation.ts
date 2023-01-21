import InferenceRule, {InputType, Input} from './inference_rule.js'
import Predicate from '../predicates/predicate.js'
import Negation, {not} from '../predicates/negation.js'
import {lit} from '../predicates/literal.js'


export const DetectContradiction: InferenceRule = {
  name: "Formal Contradiction",
  inputDescriptions: [
    "Proposition: An assumed/deduced proposition of the form 𝑃",
    "Negation: An assumed/deduced proposition of the form ¬(𝑃)",
  ],
  outputDescription: "⊥",
  inputTypes: [InputType.BankProposition, InputType.BankProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 2) {
      return "Needs two propositions to be applied.";
    }
    const p = inputs[0] as Predicate;
    const n = inputs[1] as Predicate;
    if (!(n instanceof Negation)) {
      return "Chosen negation must start with \"¬(\"";
    } else if (!n.subPredicate.equals(p)) {
      return "Chosen negation must be negation of chosen proposition.";
    }
    return "";
  },
  apply: () => {
    return lit("⊥");
  },
}

export const ProofOfNegation: InferenceRule = {
  name: "Proof of Negation",
  inputDescriptions: [
    "Proposition: Any proposition whatsoever",
    "Proof: Win the level with the chosen proposition added as an assumption and with ⊥ as the target",
  ],
  outputDescription: "¬(𝑃)",
  inputTypes: [InputType.AnyProposition, InputType.Proof],
  proofInfo: (inputs: (Input|null)[]) => {
    if (inputs[0] === null) {
      return "Proposition must be chosen before working on proof.";
    } else {
      return [[inputs[0] as Predicate], [], lit("⊥")];
    }
  },
  doesApply: (inputs: Input[]) => {
    if (inputs[1] != "done") {
      return "Proof not completed. A contradiction must be deduced in the sublevel.";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    return not(inputs[0] as Predicate);
  },
}

export const ProofByContradiction: InferenceRule = {
  name: "Proof By Contradiction",
  inputDescriptions: [
    "Proposition: Any proposition whatsoever.",
    "Proof: Win the level with the negation of the chosen proposition added as an assumption and with ⊥ as the target",
  ],
  outputDescription: "𝑃",
  inputTypes: [InputType.AnyProposition, InputType.Proof],
  proofInfo: (inputs: (Input|null)[]) => {
    if (inputs[0] === null) {
      return "Proposition must be chosen before working on proof.";
    } else {
      return [[not(inputs[0] as Predicate)], [], lit("⊥")];
    }
  },
  doesApply: (inputs: Input[]) => {
    if (inputs[1] != "done") {
      return "Proof not completed. A contradiction must be deduced in the sublevel.";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    return inputs[0] as Predicate;
  },
}

