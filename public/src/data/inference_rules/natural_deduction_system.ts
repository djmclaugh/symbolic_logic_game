import InferenceRule, {InputType, Input} from './inference_rule.js'
import Predicate from '../predicates/predicate.js'
import Negation, {not} from '../predicates/negation.js'
import Conjunction, {and} from '../predicates/conjunction.js'
import Disjunction, {or} from '../predicates/disjunction.js'
import Conditional, {then} from '../predicates/conditional.js'

export const NegationIntroduction: InferenceRule = {
  name: "Negation (¬) Introduction",
  inputDescriptions: [
    "Conditional: An assumed/known proposition of the form (𝑃) → (𝑄)",
    "Contradiction: An assumed/known proposition of the form (𝑃) → (¬(𝑄))"
  ],
  outputDescription: "¬(𝑃)",
  inputTypes: [InputType.BankProposition, InputType.BankProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 2) {
      return "Can only be applied to two propositions at a time."
    }
    let a = inputs[0] as Predicate;
    let b = inputs[1] as Predicate;
    if (!(a instanceof Conditional)) {
      return "Chosen conditional must have a \"→\" that isn't inside parentheses."
    }
    if (!(b instanceof Conditional)) {
      return "Chosen contradiction must have a \"→\" that isn't inside parentheses."
    }
    if (!a.left.equals(b.left)) {
      return "Chosen conditional and contradiction must have the same left side."
    }
    if (!not(a.right).equals(b.right)) {
      return "Rigth side of chosen contradiction must be the negation of the right side of chosen conditional."
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    let a = inputs[0] as Conditional;
    return not(a.left);
  },
};

export const NegationElimination: InferenceRule = {
  name: "Negation (¬) Elimination",
  inputDescriptions: [
    "Negation: An assumed/deduced proposition of the form ¬(𝑃)",
    "Consequent: Any proposition whatsoever",
  ],
  outputDescription: "(𝑃) → (𝑄)",
  inputTypes: [InputType.BankProposition, InputType.AnyProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 2) {
      return "Can only be applied to two propositions at a time."
    }
    let a = inputs[0] as Predicate;
    if (!(a instanceof Negation)) {
      return "Chosen negation must start with \"¬(\"."
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    let a = inputs[0] as Negation;
    let b = inputs[1] as Predicate;
    return then(a.subPredicate, b);
  },
};

export const DoubleNegationElimination: InferenceRule = {
  name: "Double Negation (¬) Elimination",
  inputDescriptions: [
    "Double Negation: An assumed/deduced proposition of the form ¬(¬(𝑃))"
  ],
  outputDescription: "𝑃",
  inputTypes: [InputType.BankProposition],
  doesApply: (propositions: Input[]) => {
    if (propositions.length != 1) {
      return "Can only be applied to a single proposition at a time."
    }
    const p = propositions[0];
    if (!(p instanceof Negation) || !(p.subPredicate instanceof Negation)) {
      return "Can only be applied to propositions that start with ¬(¬(."
    }
    return "";
  },
  apply: (propositions: Input[]) => {
    const prop = propositions[0] as Negation;
    const sub = prop.subPredicate as Negation;
    return sub.subPredicate;
  },
}

export const ConjunctionIntroduction: InferenceRule = {
  name: "Conjunction (∧) Introduction",
  inputDescriptions: [
    "Left Proposition: Any assumed/deduced proposition",
    "Right Proposition: Any assumed/deduced proposition"
  ],
  outputDescription: "(𝐿) ∧ (𝑅)",
  inputTypes: [InputType.BankProposition, InputType.BankProposition],
  doesApply: (propositions: Input[]) => {
    if (propositions.length != 2) {
      return "Can only be applied to two propositions at a time.";
    }
    return "";
  },
  apply: (propositions: Input[]) => {
    return and(propositions[0] as Predicate, propositions[1] as Predicate);
  },
}

export const ConjunctionElimination: InferenceRule = {
  name: "Conjunction (∧) Elimination",
  inputDescriptions: [
    "Conjunction: An assumed/deduced proposition of the form (𝐿) ∧ (𝑅)",
    "Side to Keep: Left or Right.",
  ],
  outputDescription: "𝐿 if \"Left\" was chosen. 𝑅 if \"Right\" was chosen.",
  inputTypes: [InputType.BankProposition, InputType.LeftRight],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 2) {
      return "Can only be applied to one proposition and one side at a time.";
    }
    const p = inputs[0] as Predicate;
    if (!(p instanceof Conjunction)) {
      return "Chosen conjunction must have a \"∧\" that isn't inside parentheses.";
    }
    const d = inputs[1];
    if (d != "Left" && d != "Right") {
      return "Chosen side must be \"Left\" or \"Right\".";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    const p = inputs[0] as Conjunction;
    const d = inputs[1];
    if (d == "Left") {
      return p.left;
    } else if (d == "Right") {
      return p.right;
    }
    throw new Error(`This should never happen: ${JSON.stringify(inputs)}`);
  },
}

export const DisjunctionIntroduction: InferenceRule = {
  name: "Disjunction (∨) Introduction",
  inputDescriptions: [
    "Known Proposition: Any assumed/deduced proposition",
    "Other Proposition: Any proposition whatsoever",
    "Side of known proposition: Left or Right",
  ],
  outputDescription: "(𝐾) ∨ (𝑂) if \"Left\" was chosen. (𝑂) ∨ (𝐾) if \"Right\" was chosen.",
  inputTypes: [InputType.BankProposition, InputType.AnyProposition, InputType.LeftRight],
  doesApply: (propositions: Input[]) => {
    if (propositions.length != 3) {
      return "Can only be applied to two propositions and a direction at a time.";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    const d = inputs[2] as "Left"|"Right";
    if (d == "Left") {
      return or(inputs[0] as Predicate, inputs[1] as Predicate);
    } else if (d == "Right"){
      return or(inputs[1] as Predicate, inputs[0] as Predicate);
    }
    throw new Error(`This should never happen: ${JSON.stringify(inputs)}`);
  },
}

export const DisjunctionElimination: InferenceRule = {
  name: "Disjunction (∨) Elimination",
  inputDescriptions: [
    "Disjunction: An assumed/deduced proposition of the form (𝐿) ∨ (𝑅)",
    "Left Conditional: An assumed/deduced proposition of the form (𝐿) → (𝑄)",
    "Right Conditional: An assumed/deduced proposition of the form (𝑅) → (𝑄)",
  ],
  outputDescription: "𝑄",
  inputTypes: [InputType.BankProposition, InputType.BankProposition, InputType.BankProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 3) {
      return "Can only be applied to three propositions at a time.";
    }
    const d = inputs[0] as Predicate;
    if (!(d instanceof Disjunction)) {
      return "Chosen disjunction must have a \"∨\" that isn't inside parentheses.";
    }
    const l = inputs[1] as Predicate;
    if (!(l instanceof Conditional)) {
      return "Chosen left conditional must have a \"→\" that isn't inside parentheses.";
    }
    if (!d.left.equals(l.left)) {
      return "Left side of disjunction must be identical to antecedent of left conditional.";
    }
    const r = inputs[2] as Predicate;
    if (!(r instanceof Conditional)) {
      return "Chosen right conditional must have a \"→\" that isn't inside parentheses.";
    }
    if (!d.right.equals(r.left)) {
      return "Right side of disjunction must be identical to antecedent of right conditional.";
    }
    if (!l.right.equals(r.right)) {
      return "Consequent of both chosen conditionals must be identical.";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    const p = inputs[1] as Conditional;
    return p.right;
  },
}

export const ConditionalIntroduction: InferenceRule = {
  name: "Conditional (→) Introduction",
  inputDescriptions: [
    "Antecedent: Any proposition whatsoever",
    "Consequent: Any proposition whatsoever",
    "Proof: Win the level with the antecedent added as an assumption and the consequent as the target"
  ],
  outputDescription: "(𝑃) → (𝑄)",
  inputTypes: [InputType.AnyProposition, InputType.AnyProposition, InputType.Proof],
  proofInfo: (inputs: (Input|null)[]) => {
    if (inputs[0] === null || inputs[1] === null) {
      return "Antecedent and consequent must be chosen before working on proof.";
    } else {
      return [[inputs[0] as Predicate], [], inputs[1] as Predicate];
    }
  },
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 3) {
      return "Can only be applied to two propositions and a proof at a time.";
    }
    if (inputs[2] != "done") {
      return "Proof not completed. Chosen consequent must be deduced in sublevel.";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    const p = inputs[0] as Predicate;
    const q = inputs[1] as Predicate;
    return then(p, q);
  },
}

export const ConditionalElimination: InferenceRule = {
  name: "Conditional (→) Elimination",
  inputDescriptions: [
    "Conditional: An assumed/deduced proposition of the form (𝑃) → (𝑄)",
    "Antecedent: An assumed/deduced proposition of the form 𝑃",
  ],
  outputDescription: "𝑄",
  inputTypes: [InputType.BankProposition, InputType.BankProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 2) {
      return "Can only be applied to one conditional and one antecedent at a time.";
    }
    const a = inputs[1] as Predicate;
    const p = inputs[0] as Predicate;
    if (!(p instanceof Conditional)) {
      return "Chosen conditional must have a \"→\" that isn't inside parentheses.";
    }
    if (!a.equals(p.left)) {
      return "Chosen antecedent must match left side of chosen conditional.";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    const p = inputs[0] as Conditional;
    return p.right;
  },
}
