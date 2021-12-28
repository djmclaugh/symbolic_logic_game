import PropositionHelpers, {
  Negation,
  Proposition,
  Conjunction,
  Disjunction,
  Conditional,
  lit,
  not,
  and,
  or,
  then,
} from './proposition.js'

// Returns a user-visible error message if the restriction is not satisfied.
// Returns the empty string if the restriction is satisfied.
export type Restriction = (inputs: Input[]) => string;
export type Transformation = (inputs: Input[]) => Proposition;

export type Input = Proposition|"left"|"right"|"done"|"not done";

export enum InputType {
  AnyProposition,
  BankProposition,
  LeftRight,
  Proof,
}

export default interface InferenceRule {
    readonly name: string,
    readonly inputDescriptions: string[],
    readonly outputDescription: string,
    readonly inputTypes: InputType[],
    readonly doesApply: Restriction,
    readonly apply: Transformation,
}

export const Blank: InferenceRule = {
  name: "",
  inputDescriptions: [],
  outputDescription: "",
  inputTypes: [],
  doesApply: () => "",
  apply: () => {
    return lit("");
  },
};

export const NegationIntroduction: InferenceRule = {
  name: "Negation Introduction",
  inputDescriptions: [
    "Conditional: A proposition from the bank of the form (𝑃) → (𝑄)",
    "Contradiction: A proposition from the bank of the form (𝑃) → (¬(𝑄))"
  ],
  outputDescription: "¬(𝑃)",
  inputTypes: [InputType.BankProposition, InputType.BankProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 2) {
      return "Can only be applied to two propositions at a time."
    }
    let a = inputs[0] as Proposition;
    let b = inputs[1] as Proposition;
    if (!PropositionHelpers.isConditional(a)) {
      return "Chosen conditional must have a \"→\" that isn't inside parentheses."
    }
    if (!PropositionHelpers.isConditional(b)) {
      return "Chosen contradiction must have a \"→\" that isn't inside parentheses."
    }
    if (!PropositionHelpers.areTheSame(a.left, b.left)) {
      return "Chosen conditional and contradiction must have the same left side."
    }
    if (!PropositionHelpers.areTheSame(not(a.right), b.right)) {
      return "Rigth side of contradiction must be the negation of the right side of the chosen conditional."
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    let a = inputs[0] as Conditional;
    return not(a.left);
  },
};

export const NegationElimination: InferenceRule = {
  name: "Negation Elimination",
  inputDescriptions: [
    "Negation: A proposition from the bank of the form ¬(𝑃)",
    "Consequent: Any proposition, 𝑄.",
  ],
  outputDescription: "(𝑃) → (𝑄)",
  inputTypes: [InputType.BankProposition, InputType.AnyProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 2) {
      return "Can only be applied to two propositions at a time."
    }
    let a = inputs[0] as Proposition;
    if (!PropositionHelpers.isNegation(a)) {
      return "Chosen negation must start with \"¬(\"."
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    let a = inputs[0] as Negation;
    let b = inputs[1] as Proposition;
    return then(a.proposition, b);
  },
};

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

export const DoubleNegationElimination: InferenceRule = {
  name: "Double Negation Elimination",
  inputDescriptions: ["A proposition from the bank of the form ¬(¬(𝑃))."],
  outputDescription: "𝑃",
  inputTypes: [InputType.BankProposition],
  doesApply: (propositions: Input[]) => {
    if (propositions.length != 1) {
      return "Can only be applied to a single proposition at a time."
    }
    const s = PropositionHelpers.toString(propositions[0] as Proposition);
    if (!s.startsWith("¬(¬(")) {
      return "Can only be applied to propositions that start with ¬(¬(."
    }
    if (!s.endsWith("))")) {
      return "Can only be applied to propositions that end with ))."
    }
    return "";
  },
  apply: (propositions: Input[]) => {
    const prop = propositions[0] as Proposition;
    if (PropositionHelpers.isNegation(prop)) {
      const neg = prop.proposition;
      if (PropositionHelpers.isNegation(neg)) {
        return neg.proposition;
      }
    }
    throw new Error("Expected negation of negation but got: " + JSON.stringify(prop));
  },
}

export const ConjunctionIntroduction: InferenceRule = {
  name: "Conjunction Introduction",
  inputDescriptions: [
    "Left Proposition: Any proposition already in the bank, 𝐿.",
    "Right Proposition: Any proposition already in the bank, 𝑅."
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
    return and(propositions[0] as Proposition, propositions[1] as Proposition);
  },
}

export const ConjunctionElimination: InferenceRule = {
  name: "Conjunction Elimination (Simplification)",
  inputDescriptions: [
    "Conjunction: A proposition from the bank of the form (𝐿) ∧ (𝑅)",
    "Side: A choice between \"Left\" and \"Right\".",
  ],
  outputDescription: "𝐿 if \"Left\" was chosen. 𝑅 if \"Right\" was chosen.",
  inputTypes: [InputType.BankProposition, InputType.LeftRight],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 2) {
      return "Can only be applied to one proposition and one side at a time.";
    }
    const p = inputs[0] as Proposition;
    if (!PropositionHelpers.isConjunction(p)) {
      return "Chosen conjunction must have a \"∧\" that isn't inside parentheses.";
    }
    const d = inputs[1];
    if (d != "left" && d != "right") {
      return "Chosen side must be \"Left\" or \"Right\".";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    const p = inputs[0] as Conjunction;
    const d = inputs[1];
    if (d == "left") {
      return p.left;
    } else if (d == "right") {
      return p.right;
    }
    throw new Error(`This should never happen: ${JSON.stringify(inputs)}`);
  },
}

export const DisjunctionIntroduction: InferenceRule = {
  name: "Disjunction Introduction (Addition)",
  inputDescriptions: [
    "Known Proposition: Any proposition already in the bank,  𝐾",
    "Other Proposition: Any proposition, 𝑂.",
    "Side of known proposition: A choice between \"Left\" and \"Right\"."
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
    const d = inputs[2] as "left"|"right";
    if (d == "left") {
      return or(inputs[0] as Proposition, inputs[1] as Proposition);
    } else if (d == "right"){
      return or(inputs[1] as Proposition, inputs[0] as Proposition);
    }
    throw new Error(`This should never happen: ${JSON.stringify(inputs)}`);
  },
}

export const DisjunctionElimination: InferenceRule = {
  name: "Disjunction Elimination (Case Analysis)",
  inputDescriptions: [
    "Disjunction: A proposition from the bank of the form (𝐿) ∨ (𝑅).",
    "Left Conditional: A proposition from the bank of the form (𝐿) → (𝑄).",
    "Right Conditional: A proposition from the bank of the form (𝑅) → (𝑄).",
  ],
  outputDescription: "𝑄",
  inputTypes: [InputType.BankProposition, InputType.BankProposition, InputType.BankProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 3) {
      return "Can only be applied to three propositions at a time.";
    }
    const d = inputs[0] as Proposition;
    if (!PropositionHelpers.isDisjunction(d)) {
      return "Chosen disjunction must have a \"∨\" that isn't inside parentheses.";
    }
    const l = inputs[1] as Proposition;
    if (!PropositionHelpers.isConditional(l)) {
      return "Chosen left conditional must have a \"→\" that isn't inside parentheses.";
    }
    if (!PropositionHelpers.areTheSame(d.left, l.left)) {
      return "Left side of disjunction must be identical to antecedent of left conditional.";
    }
    const r = inputs[2] as Proposition;
    if (!PropositionHelpers.isConditional(r)) {
      return "Chosen right conditional must have a \"→\" that isn't inside parentheses.";
    }
    if (!PropositionHelpers.areTheSame(d.left, l.left)) {
      return "Right side of disjunction must be identical to antecedent of right conditional.";
    }
    if (!PropositionHelpers.areTheSame(l.right, r.right)) {
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
  name: "Conditional Introduction (Conditional Proof)",
  inputDescriptions: [
    "Antecedent: Any proposition, 𝑃.",
    "Consequent: Any proposition, 𝑄.",
    "Proof: Win a modified version of this level where 𝑃 is added to the bank and where the target is 𝑄."],
  outputDescription: "(𝑃) → (𝑄)",
  inputTypes: [InputType.AnyProposition, InputType.AnyProposition, InputType.Proof],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 3) {
      return "Can only be applied to two propositions and a proof at a time.";
    }
    if (inputs[2] != "done") {
      return "Proof not yet completed. Chosen consequent must appear in the word bank.";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    const p = inputs[0] as Proposition;
    const q = inputs[1] as Proposition;
    return then(p, q);
  },
}

export const ConditionalElimination: InferenceRule = {
  name: "Conditional Elimination (Modus Ponens)",
  inputDescriptions: [
    "Antecedent: Any proposition already in the bank, 𝑃.",
    "Conditional: A proposition from the bank of the form (𝑃) → (𝑄).",
  ],
  outputDescription: "𝑄",
  inputTypes: [InputType.BankProposition, InputType.BankProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 2) {
      return "Can only be applied to one proposition and one side at a time.";
    }
    const a = inputs[0] as Proposition;
    const p = inputs[1] as Proposition;
    if (!PropositionHelpers.isConditional(p)) {
      return "Chosen conditional must have a \"→\" that isn't inside parentheses.";
    }
    if (!PropositionHelpers.areTheSame(a, p.left)) {
      return "Left side of chosen conditional must match chosen antecedent.";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    const p = inputs[1] as Conditional;
    return p.right;
  },
}

export const HypotheticalSyllogism: InferenceRule = {
  name: "Hypothetical Syllogism",
  inputDescriptions: [
    "First Conditional: A proposition in the bank of the form  (𝑃) → (𝑄).",
    "Second Conditional: A proposition from the bank of the form (𝑄) → (𝑅).",
  ],
  outputDescription: "(𝑃) → (𝑅)",
  inputTypes: [InputType.BankProposition, InputType.BankProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 2) {
      return "Can only be applied to one proposition and one side at a time.";
    }
    const p1 = inputs[0] as Proposition;
    const p2 = inputs[1] as Proposition;
    if (!PropositionHelpers.isConditional(p1)) {
      return "Chosen first conditional must have a \"→\" that isn't inside parentheses.";
    }
    if (!PropositionHelpers.isConditional(p2)) {
      return "Chosen second conditional must have a \"→\" that isn't inside parentheses.";
    }
    if (!PropositionHelpers.areTheSame(p1.right, p2.left)) {
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

export const SelfConditional: InferenceRule = {
  name: "Self Conditional",
  inputDescriptions: [ "Any proposition, 𝑃."],
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
    "Antecedent: Any proposition, 𝑃.",
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

export const ModusTolens: InferenceRule = {
  name: "Modus Tolens",
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
    if (!PropositionHelpers.isConditional(c)) {
      return "Chosen conditional must have a \"→\" that isn't inside parentheses.";
    }
    if (!PropositionHelpers.areTheSame(not(c.right), q)) {
      return "Consequen negation must be the negation of chosen conditional's right side.";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    const p = inputs[0] as Conditional;
    return not(p.right);
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
    if (!PropositionHelpers.isDisjunction(d)) {
      return "Chosen disjunction must have a \"∨\" that isn't inside parentheses.";
    }
    const l = inputs[1] as Proposition;
    if (!PropositionHelpers.isConditional(l)) {
      return "Chosen left conditional must have a \"→\" that isn't inside parentheses.";
    }
    if (!PropositionHelpers.areTheSame(d.left, l.left)) {
      return "Left side of disjunction must be identical to antecedent of left conditional.";
    }
    const r = inputs[2] as Proposition;
    if (!PropositionHelpers.isConditional(r)) {
      return "Chosen right conditional must have a \"→\" that isn't inside parentheses.";
    }
    if (!PropositionHelpers.areTheSame(d.left, l.left)) {
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
