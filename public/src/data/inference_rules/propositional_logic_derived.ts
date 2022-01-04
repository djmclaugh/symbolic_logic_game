import InferenceRule, {InputType, Input} from './inference_rule.js'
import Proposition from '../propositions/proposition.js'
import Negation from '../propositions/negation.js'
import {
  DisjunctionProposition as Disjunction,
  ConditionalProposition as Conditional,
} from '../propositions/binary.js'
import { not, or, then } from '../propositions/propositions.js'

export const DoubleNegationIntroduction: InferenceRule = {
  name: "Double Negation Introduction",
  inputDescriptions: ["Any proposition already in the bank, 𝑃."],
  outputDescription: "¬(¬(𝑃))",
  inputTypes: [InputType.BankProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 1) {
      return "Can only be applied to a single proposition at a time."
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    return not(not(inputs[0] as Proposition));
  },
}

export const DisjunctionCommutation: InferenceRule = {
  name: "Disjunction Commutation",
  inputDescriptions: [
    "Disjunction: A proposition from the bank of the form (𝐿) ∨ (𝑅)",
  ],
  outputDescription: "(𝑅) ∨ (𝐿)",
  inputTypes: [InputType.BankProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 1) {
      return "Can only be applied to one proposition at a time.";
    }
    const d = inputs[0] as Proposition;
    if (!(d instanceof Disjunction)) {
      return "Chosen disjunction must have a \"∨\" that isn't inside parentheses.";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    const p = inputs[0] as Disjunction;
    return or(p.r, p.l);
  },
}

export const HypotheticalSyllogism: InferenceRule = {
  name: "Hypothetical Syllogism",
  inputDescriptions: [
    "First Conditional: A proposition in the bank of the form  (𝑃) → (𝑄)",
    "Second Conditional: A proposition from the bank of the form (𝑄) → (𝑅)",
  ],
  outputDescription: "(𝑃) → (𝑅)",
  inputTypes: [InputType.BankProposition, InputType.BankProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 2) {
      return "Can only be applied to one proposition and one side at a time.";
    }
    const p1 = inputs[0] as Proposition;
    const p2 = inputs[1] as Proposition;
    if (!(p1 instanceof Conditional)) {
      return "Chosen first conditional must have a \"→\" that isn't inside parentheses.";
    }
    if (!(p2 instanceof Conditional)) {
      return "Chosen second conditional must have a \"→\" that isn't inside parentheses.";
    }
    if (!p1.r.equals(p2.l)) {
      return "Right side of first conditional must match left side of second conditional.";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    const p1 = inputs[0] as Conditional;
    const p2 = inputs[1] as Conditional;
    return then(p1.l, p2.r);
  },
}

export const SelfConditional: InferenceRule = {
  name: "Self Conditional",
  inputDescriptions: [ "Any proposition, 𝑃"],
  outputDescription: "(𝑃) → (𝑃)",
  inputTypes: [InputType.AnyProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 1) {
      return "Can only be applied to one proposition and one side at a time.";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    const p = inputs[0] as Proposition;
    return then(p, p);
  },
}

export const ConditionalFromConsequent: InferenceRule = {
  name: "Conditional From Consequent",
  inputDescriptions: [
    "Antecedent: Any proposition, 𝑃",
    "Consequent: Any proposition already in the bank, 𝑄"
  ],
  outputDescription: "(𝑃) → (𝑄)",
  inputTypes: [InputType.AnyProposition, InputType.BankProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 2) {
      return "Can only be applied to two propositions at a time.";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    const p = inputs[0] as Proposition;
    const q = inputs[1] as Proposition;
    return then(p, q);
  },
}

export const ModusTollens: InferenceRule = {
  name: "Modus Tollens",
  inputDescriptions: [
    "Conditional: A proposition from the bank of the form (𝑃) → (𝑄).",
    "Consequent Negation: Any proposition already in the bank of the form ¬(𝑄).",
  ],
  outputDescription: "¬(𝑃)",
  inputTypes: [InputType.BankProposition, InputType.BankProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 2) {
      return "Can only be applied to one proposition and one side at a time.";
    }
    const c = inputs[0] as Proposition;
    const q = inputs[1] as Proposition;
    if (!(c instanceof Conditional)) {
      return "Chosen conditional must have a \"→\" that isn't inside parentheses.";
    }
    if (!not(c.r).equals(q)) {
      return "Consequent negation must be the negation of chosen conditional's right side.";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    const p = inputs[0] as Conditional;
    return not(p.l);
  },
}

export const ConstructiveDelimma: InferenceRule = {
  name: "Constructive Delimma",
  inputDescriptions: [
    "Disjunction: A proposition from the bank of the form (𝐿) ∨ (𝑅).",
    "Left Conditional: A proposition from the bank of the form (𝐿) → (𝑃).",
    "Right Conditional: A proposition from the bank of the form (𝑅) → (𝑄).",
  ],
  outputDescription: "(𝑃) ∨ (𝑄)",
  inputTypes: [InputType.BankProposition, InputType.BankProposition, InputType.BankProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 3) {
      return "Can only be applied to three propositions at a time.";
    }
    const d = inputs[0] as Proposition;
    if (!(d instanceof Disjunction)) {
      return "Chosen disjunction must have a \"∨\" that isn't inside parentheses.";
    }
    const l = inputs[1] as Proposition;
    if (!(l instanceof Conditional)) {
      return "Chosen left conditional must have a \"→\" that isn't inside parentheses.";
    }
    if (!d.l.equals(l.l)) {
      return "Left side of disjunction must be identical to antecedent of left conditional.";
    }
    const r = inputs[2] as Proposition;
    if (!(r instanceof Conditional)) {
      return "Chosen right conditional must have a \"→\" that isn't inside parentheses.";
    }
    if (!d.r.equals(r.l)) {
      return "Right side of disjunction must be identical to antecedent of right conditional.";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    const p = inputs[1] as Conditional;
    const q = inputs[2] as Conditional;
    return or(p.r, q.r);
  },
}

export const LawOfExcludedMiddle: InferenceRule = {
  name: "Law Of Excluded Middle",
  inputDescriptions: [ "Any proposition, 𝑃."],
  outputDescription: "(𝑃) ∨ ¬(𝑃)",
  inputTypes: [InputType.AnyProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 1) {
      return "Can only be applied to one proposition and one side at a time.";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    const p = inputs[0] as Proposition;
    return or(p, not(p));
  },
}

export const DisjunctiveSyllogism: InferenceRule = {
  name: "Disjunctive Syllogism",
  inputDescriptions: [
    "Disjunction: A proposition from the bank of the form (𝐿) ∨ (𝑅).",
    "Negation: Any proposition already in the bank of the form ¬(𝐿) or ¬(𝑅).",
  ],
  outputDescription: "𝑅 if the chosen negation was ¬(𝐿). 𝐿 if the chosen negation was ¬(𝑅)",
  inputTypes: [InputType.BankProposition, InputType.BankProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 2) {
      return "Can only be applied to one proposition and one side at a time.";
    }
    const d = inputs[0] as Proposition;
    const n = inputs[1] as Proposition;
    if (!(d  instanceof Disjunction)) {
      return "Chosen disjunction must have a \"∨\" that isn't inside parentheses.";
    }
    if (!(n  instanceof Negation)) {
      return "Chosen negation must start with \"¬(\".";
    }
    if (!d.l.equals(n.subProp) && !d.r.equals(n.subProp)) {
      return "Consequent negation must be the negation either left or right side of the disjunction.";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    const d = inputs[0] as Disjunction;
    const n = inputs[1] as Negation;
    return d.l.equals(n.subProp) ? d.r : d.l;
  },
}
