import InferenceRule, {InputType, Input} from './inference_rule.js'
import Negation, {not} from '../predicates/negation.js'
import Equality, {eq} from '../predicates/equality.js'

export const Symmetry: InferenceRule = {
  name: "Equality Symmetry",
  inputDescriptions: [
    "Equality: A proposition already in the bank of the form 𝑎 = 𝑏.",
  ],
  outputDescription: "𝑏 = 𝑎",
  inputTypes: [ InputType.BankProposition ],
  doesApply: (inputs: Input[]) => {
    let e = inputs[0] as Equality;
    if (!(e instanceof Equality)) {
      return "Chosen equality must have a \"=\" that isn't inside parentheses.";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    const x = inputs[0] as Equality;
    return eq(x.right, x.left);
  },
}

export const EqualityNegationSymmetry: InferenceRule = {
  name: "Inequation Symmetry",
  inputDescriptions: [
    "A proposition already in the bank of the form ¬(𝑎 = 𝑏).",
  ],
  outputDescription: "¬(𝑏 = 𝑎)",
  inputTypes: [ InputType.BankProposition ],
  doesApply: (inputs: Input[]) => {
    let p = inputs[0] as Negation;
    if (!(p instanceof Negation) || !(p.sub instanceof Equality)) {
      return "Chosen proposition must be the negation of an equality.";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    const p = inputs[0] as Negation;
    const e = p.sub as Equality;
    return not(eq(e.right, e.left));
  },
}
