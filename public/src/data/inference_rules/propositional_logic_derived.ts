import InferenceRule, { InputType, Input } from './inference_rule.js'
import Predicate from '../predicates/predicate.js'
import Negation, { not } from '../predicates/negation.js'
import Conjunction, { and } from '../predicates/conjunction.js'
import Disjunction, { or } from '../predicates/disjunction.js'
import Conditional, { then } from '../predicates/conditional.js'
import { iff } from '../predicates/biconditional.js'

export const DoubleNegationIntroduction: InferenceRule = {
  name: "Double Negation (¬) Introduction",
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
    return not(not(inputs[0] as Predicate));
  },
}

export const DoubleNegationEquivalence: InferenceRule = {
  name: "Double Negation Equivalence",
  inputDescriptions: ["Any proposition whatsoever."],
  outputDescription: "𝑃 ↔ ¬(¬(𝑃))",
  inputTypes: [InputType.AnyProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 1) {
      return "Can only be applied to a single proposition at a time."
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    const p = inputs[0] as Predicate;
    return iff(p, not(not(p)));
  },
}

export const ConjunctionCommutation: InferenceRule = {
  name: "Conjunction (∧) Commutation",
  inputDescriptions: [
    "A proposition from the bank of the form (𝐿) ∧ (𝑅)",
  ],
  outputDescription: "(𝑅) ∧ (𝐿)",
  inputTypes: [InputType.BankProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 1) {
      return "Can only be applied to one proposition at a time.";
    }
    const d = inputs[0] as Predicate;
    if (!(d instanceof Conjunction)) {
      return "Chosen conjunction must have a \"∧\" that isn't inside parentheses.";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    const p = inputs[0] as Conjunction;
    return and(p.right, p.left);
  },
}

export const ConjunctionAssociation: InferenceRule = {
  name: "Conjunction Association",
  inputDescriptions: [
    "Conjunction: A proposition from the bank of the form (𝐿) ∧ (𝑅)",
    "Nested Conjunction Side: The side of the chosen conjunction that happens to also be a conjunction.",
  ],
  outputDescription: "(𝐿ₗ) ∧ ((𝐿ᵣ) ∧ (𝑅)) or ((𝐿) ∧ (𝑅ₗ)) ∧ (𝑅ᵣ) depending on which side is the nested conjunction.",
  inputTypes: [InputType.BankProposition, InputType.LeftRight],
  doesApply: (inputs: Input[]) => {
    const c = inputs[0] as Predicate;
    const s = inputs[1] as "Left"|"Right";
    if (!(c instanceof Conjunction)) {
      return "Chosen conjunction must have a \"∧\" that isn't inside parentheses.";
    }
    if ((s == "Left" && !(c.left instanceof Conjunction)) || (s == "Right" && !(c.right instanceof Conjunction))) {
      return "Chosen side of chosen conjunction must also have a \"∧\" that's in only one pair of parentheses.";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    const c = inputs[0] as Conjunction;
    const s = inputs[1] as "Left"|"Right";
    const n = (s == "Left" ? c.left : c.right) as Conjunction;
    return s == "Left" ? and(n.left, and(n.right, c.right)) : and(and(c.left, n.left), n.right);
  },
}

export const DisjunctionCommutation: InferenceRule = {
  name: "Disjunction Commutation",
  inputDescriptions: [
    "An assumed/deduced proposition of the form (𝐿) ∨ (𝑅)",
  ],
  outputDescription: "(𝑅) ∨ (𝐿)",
  inputTypes: [InputType.BankProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 1) {
      return "Can only be applied to one proposition at a time.";
    }
    const d = inputs[0] as Predicate;
    if (!(d instanceof Disjunction)) {
      return "Chosen disjunction must have a \"∨\" that isn't inside parentheses.";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    const p = inputs[0] as Disjunction;
    return or(p.right, p.left);
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
    const p1 = inputs[0] as Predicate;
    const p2 = inputs[1] as Predicate;
    if (!(p1 instanceof Conditional)) {
      return "Chosen first conditional must have a \"→\" that isn't inside parentheses.";
    }
    if (!(p2 instanceof Conditional)) {
      return "Chosen second conditional must have a \"→\" that isn't inside parentheses.";
    }
    if (!p1.right.equals(p2.left)) {
      return "Right side of first conditional must match left side of second conditional.";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    const p1 = inputs[0] as Conditional;
    const p2 = inputs[1] as Conditional;
    return then(p1.left, p2.right);
  },
}

export const ConditionalTautology: InferenceRule = {
  name: "Conditional Tautology",
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
    const p = inputs[0] as Predicate;
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
    const p = inputs[0] as Predicate;
    const q = inputs[1] as Predicate;
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
    const c = inputs[0] as Predicate;
    const q = inputs[1] as Predicate;
    if (!(c instanceof Conditional)) {
      return "Chosen conditional must have a \"→\" that isn't inside parentheses.";
    }
    if (!not(c.right).equals(q)) {
      return "Consequent negation must be the negation of chosen conditional's right side.";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    const p = inputs[0] as Conditional;
    return not(p.left);
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
    return "";
  },
  apply: (inputs: Input[]) => {
    const p = inputs[1] as Conditional;
    const q = inputs[2] as Conditional;
    return or(p.right, q.right);
  },
}

export const LawOfNoncontradiction: InferenceRule = {
  name: "Law Of Noncontradiction",
  inputDescriptions: [ "Any proposition whatsoever"],
  outputDescription: "¬((𝑃) ∧ ¬(𝑃))",
  inputTypes: [InputType.AnyProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 1) {
      return "Can only be applied to one proposition and one side at a time.";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    const p = inputs[0] as Predicate;
    return not(and(p, not(p)));
  },
}

export const LawOfExcludedMiddle: InferenceRule = {
  name: "Law Of Excluded Middle",
  inputDescriptions: [ "Any proposition whatsoever"],
  outputDescription: "(𝑃) ∨ ¬(𝑃)",
  inputTypes: [InputType.AnyProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 1) {
      return "Can only be applied to one proposition and one side at a time.";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    const p = inputs[0] as Predicate;
    return or(p, not(p));
  },
}

export const DisjunctiveSyllogism: InferenceRule = {
  name: "Disjunctive Syllogism",
  inputDescriptions: [
    "Disjunction: An assumed/deduced proposition of the form (𝐿) ∨ (𝑅).",
    "Negation: An assumed/deduced proposition of the form ¬(𝐿) or ¬(𝑅).",
  ],
  outputDescription: "𝑅 if the chosen negation was ¬(𝐿). 𝐿 if the chosen negation was ¬(𝑅)",
  inputTypes: [InputType.BankProposition, InputType.BankProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 2) {
      return "Can only be applied to one proposition and one side at a time.";
    }
    const d = inputs[0] as Predicate;
    const n = inputs[1] as Predicate;
    if (!(d  instanceof Disjunction)) {
      return "Chosen disjunction must have a \"∨\" that isn't inside parentheses.";
    }
    if (!(n  instanceof Negation)) {
      return "Chosen negation must start with \"¬(\".";
    }
    if (!d.left.equals(n.sub) && !d.right.equals(n.sub)) {
      return "Consequent negation must be the negation either left or right side of the disjunction.";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    const d = inputs[0] as Disjunction;
    const n = inputs[1] as Negation;
    return d.left.equals(n.sub) ? d.right : d.left;
  },
}
