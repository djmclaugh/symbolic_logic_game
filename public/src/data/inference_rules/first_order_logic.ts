import { Term, Variable } from '../term.js'
import Equality from '../propositions/equality.js'
import { UniversalProposition, ExistentialProposition } from '../propositions/quantifier.js'
import Proposition from '../propositions/proposition.js'
import { eq, forall, exists } from '../propositions/propositions.js'
import InferenceRule, {InputType, Input} from './inference_rule.js'

export const Reflexivity: InferenceRule = {
  name: "Reflexivity",
  inputDescriptions: [
    "Any expression that hasn't been bound, 𝑎",
  ],
  outputDescription: "𝑎 = 𝑎",
  inputTypes: [ InputType.FreeTerm ],
  doesApply: (inputs: Input[]) => { return "" },
  apply: (inputs: Input[]) => {
    const x = inputs[0] as Term;
    return eq(x, x)
  },
}

export const Substitution: InferenceRule = {
  name: "Substitution",
  inputDescriptions: [
    "Proposition: Any proposition already in the bank, 𝑃.",
    "Equality: A proposition already in the bank of the form 𝑎 = 𝑏.",
    "Replacements: Which instances of 𝑎 within 𝑃 should be replaced by 𝑏."
  ],
  outputDescription: "𝑃, but with the chosen instances of 𝑎 replaced with 𝑏.",
  inputTypes: [InputType.BankProposition, InputType.BankProposition, InputType.Replacement],
  replacementInfo: (inputs: (Input|null)[]) => {
    if (inputs[0] === null || inputs[1] === null) {
      return "Proposition and equality must be chosen before replacements can be chosen.";
    } else {
      let p = inputs[0] as Proposition;
      let e = inputs[1] as Equality;
      if (!(e instanceof Equality)) {
        return "Chosen equality must have a \"=\" that isn't inside parentheses.";
      }
      if (p.numOccurances(e.l) == 0) {
        return "Left side of chosen equality does not appear in chosen proposition."
      }
      return [inputs[0] as Proposition, e.l, e.r];
    }
  },
  doesApply: (inputs: Input[]) => { return "" },
  apply: (inputs: Input[]) => {
    let p = inputs[0] as Proposition;
    let e = inputs[1] as Equality;
    let i  = inputs[2] as number[];
    return p.replace(e.l, e.r, i);
  },
}

export const UniversalIntroduction: InferenceRule = {
  name: "Universal Introduction (Universal Generalization)",
  inputDescriptions: [
    "New Expression: An expression that has neither been mentioned nor bound, 𝑎",
    "Consequent: Any proposition in which 𝑎 is not bound, 𝑄",
    "Proof: Win a modified version of this level where the target is 𝑄.",
    "Variable: An expression that hasn't been mentioned and that is neither mentioned nor bound in 𝑄, 𝑥.",
  ],
  outputDescription: "∀𝑥(𝑄'), where all instances of 𝑎 are replaced with 𝑥.",
  inputTypes: [InputType.NewTerm, InputType.AnyProposition, InputType.Proof, InputType.Variable],
  anyPropositionInfo: (inputs: (Input|null)[]) => {
    const e = inputs[0] as Term;
    if (e == null) {
      return [];
    } else {
      return [e];
    }
  },
  variableInfo: (inputs: (Input|null)[]) => {
    if (inputs[1] === null) {
      return "Consequent must be chosen before choosing variable.";
    }
    return inputs[1] as Proposition;
  },
  proofInfo: (inputs: (Input|null)[]) => {
    if (!inputs[1]) {
      return "Consequent must be chosen before working on proof.";
    } else {
      return [[], inputs[1] as Proposition];
    }
  },
  doesApply: (inputs: Input[]) => {
    if (inputs[2] != "done") {
      return "Proof not yet completed. Chosen consequent must appear in the word bank.";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    let e = inputs[0] as Term;
    let c = inputs[1] as Proposition;
    let v = inputs[3] as Variable;
    return forall(v, c.replaceAll(e, v));
  },
}

export const UniversalElimination: InferenceRule = {
  name: "Universal Elimination (Universal Instantiation)",
  inputDescriptions: [
    "Universal: A proposition from the bank of the form, ∀𝑥(𝑃)",
    "Expression: An expression that hasn't been bound, 𝑎.",
  ],
  outputDescription: "𝑃, but with all 𝑥s replaced with 𝑎s.",
  inputTypes: [InputType.BankProposition, InputType.FreeTerm],
  doesApply: (inputs: Input[]) => {
    let p = inputs[0] as Proposition;
    if (!(p instanceof UniversalProposition)) {
      return "Chosen universal must start with \"∀\"."
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    let u = inputs[0] as UniversalProposition;
    let e = inputs[1] as Term;
    return u.p.replaceAll(u.v, e);
  },
}

export const ExistentialIntroduction: InferenceRule = {
  name: "Existential Introduction (Existential Generalization)",
  inputDescriptions: [
    "Proposition: Any proposition from the bank, 𝑃",
    "Expression: Any mentioned expression of 𝑃, 𝑎.",
    "Variable: An expression that hasn't been mentioned and that is neither mentioned nor bound in 𝑃, 𝑥.",
    "Replacements: Which instances of 𝑎 within 𝑃 should be replaced by 𝑥."
  ],
  outputDescription: "∃𝑥(𝑃'), where 𝑃' is 𝑃 but with the chosen instance of 𝑎 replaced with 𝑥.",
  inputTypes: [InputType.BankProposition, InputType.PropositionFreeTerm, InputType.Variable, InputType.Replacement],
  variableInfo: (inputs: (Input|null)[]) => {
    if (inputs[0] === null) {
      return "Proposition must be chosen before choosing variable.";
    }
    return inputs[0] as Proposition;
  },
  propositionFreeTermInfo: (inputs: (Input|null)[]) => {
    if (inputs[0] === null) {
      return "Proposition must be chosen before chosing an expression within that proposition.";
    } else {
      return inputs[0] as Proposition;
    }
  },
  replacementInfo: (inputs: (Input|null)[]) => {
    if (inputs[0] === null || inputs[1] === null || inputs[2] === null) {
      return "Variable, proposition, and expression, must all be chosen before chosing which instance of the expression to replace.";
    } else {
      return [inputs[0] as Proposition, inputs[1] as Term, inputs[2] as Variable];
    }
  },
  doesApply: (inputs: Input[]) => { return ""; },
  apply: (inputs: Input[]) => {
    let v = inputs[2] as Variable;
    let p = inputs[0] as Proposition;
    let e  = inputs[1] as Term;
    let i  = inputs[3] as number[];
    return exists(v, p.replace(e, v, i));
  },
}

export const ExistentialElimination: InferenceRule = {
  name: "Existential Elimination (Existential Instantiation)",
  inputDescriptions: [
    "Existential: A proposition from the bank of the form, ∃𝑥(𝑃)",
    "New Expression: An expression that has neither been mentioned nor bound, 𝑎",
    "Consequent: Any proposition that doesn't mention nor bounds 𝑎, 𝑄",
    "Proof: Win a the level where 𝑃' has been added to the bank and the target is 𝑄 (where 𝑃' is just 𝑃 with with all the 𝑥s replaced with 𝑎s).",
  ],
  outputDescription: "𝑄",
  inputTypes: [InputType.BankProposition, InputType.NewTerm, InputType.AnyProposition, InputType.Proof],
  proofInfo: (inputs: (Input|null)[]) => {
    if (!inputs[0] || !inputs[1] || !inputs[2]) {
      return "Existential, variable, and consequent must all be chosen before working on proof.";
    } else {
      let e = inputs[0] as Proposition;
      let v = inputs[1] as Variable;
      let c = inputs[2] as Proposition;
      if (!(e instanceof ExistentialProposition)) {
        return "Chosen existential must start with \"∃\".";
      }
      if (c.numOccurances(v) != 0) {
        return "Chosen consequent must not mention chosen variable."
      }
      return [[e.p.replaceAll(e.v, v)], c];
    }
  },
  doesApply: (inputs: Input[]) => {
    if (inputs[3] != "done") {
      return "Proof not yet completed. Chosen consequent must appear in the word bank.";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    return inputs[2] as Proposition;
  },
}
