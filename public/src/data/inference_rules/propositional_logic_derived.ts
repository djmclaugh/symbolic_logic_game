import InferenceRule, {InputType, Input} from './inference_rule.js'
import Predicate from '../predicates/predicate.js'
import Negation, {not} from '../predicates/negation.js'
import Conjunction, {and} from '../predicates/conjunction.js'
import Disjunction, {or} from '../predicates/disjunction.js'
import Conditional, {then} from '../predicates/conditional.js'
import {lit} from '../predicates/literal.js'


export const DoubleNegationIntroduction: InferenceRule = {
  name: "Double Negation Introduction",
  inputDescriptions: ["Any proposition already in the bank, ๐."],
  outputDescription: "ยฌ(ยฌ(๐))",
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

export const ConjunctionCommutation: InferenceRule = {
  name: "Conjunction (โง) Commutation",
  inputDescriptions: [
    "A proposition from the bank of the form (๐ฟ) โง (๐)",
  ],
  outputDescription: "(๐) โง (๐ฟ)",
  inputTypes: [InputType.BankProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 1) {
      return "Can only be applied to one proposition at a time.";
    }
    const d = inputs[0] as Predicate;
    if (!(d instanceof Conjunction)) {
      return "Chosen conjunction must have a \"โง\" that isn't inside parentheses.";
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
    "Conjunction: A proposition from the bank of the form (๐ฟ) โง (๐)",
    "Nested Conjunction Side: The side of the chosen conjunction that happens to also be a conjunction.",
  ],
  outputDescription: "(๐ฟโ) โง ((๐ฟแตฃ) โง (๐)) or ((๐ฟ) โง (๐โ)) โง (๐แตฃ) depending on which side is the nested conjunction.",
  inputTypes: [InputType.BankProposition, InputType.LeftRight],
  doesApply: (inputs: Input[]) => {
    const c = inputs[0] as Predicate;
    const s = inputs[1] as "Left"|"Right";
    if (!(c instanceof Conjunction)) {
      return "Chosen conjunction must have a \"โง\" that isn't inside parentheses.";
    }
    if ((s == "Left" && !(c.left instanceof Conjunction)) || (s == "Right" && !(c.right instanceof Conjunction))) {
      return "Chosen side of chosen conjunction must also have a \"โง\" that's in only one pair of parentheses.";
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
    "A proposition from the bank of the form (๐ฟ) โจ (๐)",
  ],
  outputDescription: "(๐) โจ (๐ฟ)",
  inputTypes: [InputType.BankProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 1) {
      return "Can only be applied to one proposition at a time.";
    }
    const d = inputs[0] as Predicate;
    if (!(d instanceof Disjunction)) {
      return "Chosen disjunction must have a \"โจ\" that isn't inside parentheses.";
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
    "First Conditional: A proposition in the bank of the form  (๐) โ (๐)",
    "Second Conditional: A proposition from the bank of the form (๐) โ (๐)",
  ],
  outputDescription: "(๐) โ (๐)",
  inputTypes: [InputType.BankProposition, InputType.BankProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 2) {
      return "Can only be applied to one proposition and one side at a time.";
    }
    const p1 = inputs[0] as Predicate;
    const p2 = inputs[1] as Predicate;
    if (!(p1 instanceof Conditional)) {
      return "Chosen first conditional must have a \"โ\" that isn't inside parentheses.";
    }
    if (!(p2 instanceof Conditional)) {
      return "Chosen second conditional must have a \"โ\" that isn't inside parentheses.";
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
  inputDescriptions: [ "Any proposition, ๐"],
  outputDescription: "(๐) โ (๐)",
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
    "Antecedent: Any proposition, ๐",
    "Consequent: Any proposition already in the bank, ๐"
  ],
  outputDescription: "(๐) โ (๐)",
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
    "Conditional: A proposition from the bank of the form (๐) โ (๐).",
    "Consequent Negation: Any proposition already in the bank of the form ยฌ(๐).",
  ],
  outputDescription: "ยฌ(๐)",
  inputTypes: [InputType.BankProposition, InputType.BankProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 2) {
      return "Can only be applied to one proposition and one side at a time.";
    }
    const c = inputs[0] as Predicate;
    const q = inputs[1] as Predicate;
    if (!(c instanceof Conditional)) {
      return "Chosen conditional must have a \"โ\" that isn't inside parentheses.";
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
    "Disjunction: A proposition from the bank of the form (๐ฟ) โจ (๐).",
    "Left Conditional: A proposition from the bank of the form (๐ฟ) โ (๐).",
    "Right Conditional: A proposition from the bank of the form (๐) โ (๐).",
  ],
  outputDescription: "(๐) โจ (๐)",
  inputTypes: [InputType.BankProposition, InputType.BankProposition, InputType.BankProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 3) {
      return "Can only be applied to three propositions at a time.";
    }
    const d = inputs[0] as Predicate;
    if (!(d instanceof Disjunction)) {
      return "Chosen disjunction must have a \"โจ\" that isn't inside parentheses.";
    }
    const l = inputs[1] as Predicate;
    if (!(l instanceof Conditional)) {
      return "Chosen left conditional must have a \"โ\" that isn't inside parentheses.";
    }
    if (!d.left.equals(l.left)) {
      return "Left side of disjunction must be identical to antecedent of left conditional.";
    }
    const r = inputs[2] as Predicate;
    if (!(r instanceof Conditional)) {
      return "Chosen right conditional must have a \"โ\" that isn't inside parentheses.";
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

export const LawOfExcludedMiddle: InferenceRule = {
  name: "Law Of Excluded Middle",
  inputDescriptions: [ "Any proposition, ๐."],
  outputDescription: "(๐) โจ ยฌ(๐)",
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

export const Contradiction: InferenceRule = {
  name: "Contradiction",
  inputDescriptions: [
    "Proposition: A proposition from the bank, ๐.",
    "Negation: A proposition from the bank of the form ยฌ(๐).",
  ],
  outputDescription: "โฅ",
  inputTypes: [InputType.BankProposition, InputType.BankProposition],
  doesApply: (inputs: Input[]) => {
    const a = inputs[0] as Predicate;
    const b = inputs[1] as Negation;
    if (!b.subPredicate.equals(a)) {
      return "Chosen negation must be negation of chosen proposition.";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    return lit("โฅ");
  },
}

export const ProofOfNegation: InferenceRule = {
  name: "Proof Of Negation",
  inputDescriptions: [
    "Proposition: A proposition from the bank, ๐.",
    "Proof: Win a modified version of this level where ๐ is added to the bank and where the target is โฅ",
  ],
  outputDescription: "ยฌ(๐)",
  inputTypes: [InputType.AnyProposition, InputType.Proof],
  proofInfo: (inputs: (Input|null)[]) => {
    if (inputs[0] === null) {
      return "Proposition must be chosen before working on proof.";
    } else {
      return [[inputs[0] as Predicate], [], lit("โฅ")];
    }
  },
  doesApply: (inputs: Input[]) => { return ""; },
  apply: (inputs: Input[]) => {
    return not(inputs[0] as Predicate);
  },
}

export const ProofByContradiction: InferenceRule = {
  name: "Proof By Contradiction",
  inputDescriptions: [
    "Proposition: A proposition from the bank, ๐.",
    "Proof: Win a modified version of this level where ยฌ(๐) is added to the bank and where the target is โฅ",
  ],
  outputDescription: "๐",
  inputTypes: [InputType.AnyProposition, InputType.Proof],
  proofInfo: (inputs: (Input|null)[]) => {
    if (inputs[0] === null) {
      return "Proposition must be chosen before working on proof.";
    } else {
      return [[not(inputs[0] as Predicate)], [], lit("โฅ")];
    }
  },
  doesApply: (inputs: Input[]) => { return ""; },
  apply: (inputs: Input[]) => {
    return inputs[0] as Predicate;
  },
}

export const DisjunctiveSyllogism: InferenceRule = {
  name: "Disjunctive Syllogism",
  inputDescriptions: [
    "Disjunction: A proposition from the bank of the form (๐ฟ) โจ (๐).",
    "Negation: Any proposition already in the bank of the form ยฌ(๐ฟ) or ยฌ(๐).",
  ],
  outputDescription: "๐ if the chosen negation was ยฌ(๐ฟ). ๐ฟ if the chosen negation was ยฌ(๐)",
  inputTypes: [InputType.BankProposition, InputType.BankProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 2) {
      return "Can only be applied to one proposition and one side at a time.";
    }
    const d = inputs[0] as Predicate;
    const n = inputs[1] as Predicate;
    if (!(d  instanceof Disjunction)) {
      return "Chosen disjunction must have a \"โจ\" that isn't inside parentheses.";
    }
    if (!(n  instanceof Negation)) {
      return "Chosen negation must start with \"ยฌ(\".";
    }
    if (!d.left.equals(n.subPredicate) && !d.right.equals(n.subPredicate)) {
      return "Consequent negation must be the negation either left or right side of the disjunction.";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    const d = inputs[0] as Disjunction;
    const n = inputs[1] as Negation;
    return d.left.equals(n.subPredicate) ? d.right : d.left;
  },
}
