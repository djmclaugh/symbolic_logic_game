import PropositionHelpers, {
  Proposition,
  Conjunction,
  lit,
  not,
  and,
  or
} from './proposition.js'

// Returns a user-visible error message if the restriction is not satisfied.
// Returns the empty string if the restriction is satisfied.
export type Restriction = (inputs: Input[]) => string;
export type Transformation = (inputs: Input[]) => Proposition;

export type Input = Proposition|"left"|"right";

export enum InputType {
  BankProposition,
  LeftRight,
}

export default interface InferenceRule {
    readonly name: string,
    readonly inputDescription: string,
    readonly outputDescription: string,
    readonly inputTypes: InputType[],
    readonly doesApply: Restriction,
    readonly apply: Transformation,
}

export const Blank: InferenceRule = {
  name: "",
  inputDescription: "",
  outputDescription: "",
  inputTypes: [],
  doesApply: () => "",
  apply: () => {
    return lit("");
  },
}

export const DoubleNegationIntroduction: InferenceRule = {
  name: "Double Negation Introduction",
  inputDescription: "Any proposition already in the bank.",
  outputDescription: "The chosen proposition, but with \"¬(¬(\" prefixed and \"))\" suffixed.",
  inputTypes: [InputType.BankProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 1) {
      return "Can only be applied to a signle proposition at a time."
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    return not(not(inputs[0] as Proposition));
  },
}

export const DoubleNegationElimination: InferenceRule = {
  name: "Double Negation Elimination",
  inputDescription: "A proposition from the bank that starts with \"¬(¬(\" and ends with \"))\"",
  outputDescription: "The chosen proposition, but with the \"¬(¬(\" prefix and the \"))\" suffix removed",
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
  inputDescription: "Any two propositions already in the bank.",
  outputDescription: "The two chosen propositions, each wrapped in parentheses, seperated by a \"∧\".",
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
  name: "Conjunction Elimination",
  inputDescription: "A proposition from the bank that has a \"∧\" that isn't inside parentheses and a choice between \"left\" and \"right\".",
  outputDescription: "The chosen side of the chosen proposition.",
  inputTypes: [InputType.BankProposition, InputType.LeftRight],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 2) {
      return "Can only be applied to one proposition and one side at a time.";
    }
    const p = inputs[0] as Proposition;
    if (!PropositionHelpers.isConjunction(p)) {
      return "Chosen proposition must have a \"∧\" that isn't inside parentheses.";
    }
    const d = inputs[1];
    if (d != "left" && d != "right") {
      return "Chosen direction must be \"Left\" or \"Right\".";
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
