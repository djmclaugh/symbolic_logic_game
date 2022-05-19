import InferenceRule, {InputType, Input} from './inference_rule.js'
import Equality, {eq} from '../predicates/equality.js'
import Universal, {forAll} from '../predicates/universal.js'
import Existential, {exists} from '../predicates/existential.js'
import Predicate, {isSameSlot} from '../predicates/predicate.js'
import Term from '../terms/term.js'

export const Reflexivity: InferenceRule = {
  name: "Equality (=) Reflexivity",
  inputDescriptions: [
    "Any term, 𝑎",
  ],
  outputDescription: "𝑎 = 𝑎",
  inputTypes: [ InputType.FreeTerm ],
  doesApply: (inputs: Input[]) => { return "" },
  apply: (inputs: Input[]) => {
    const x = inputs[0] as Term;
    return eq(x, x);
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
      let p = inputs[0] as Predicate;
      let e = inputs[1] as Equality;
      if (!(e instanceof Equality)) {
        return "Chosen equality must have a \"=\" that isn't inside parentheses.";
      }
      if (!p.occures(e.left!)) {
        return "Left term of chosen equality does not appear in chosen proposition."
      }
      return [inputs[0] as Predicate, e.left as Term, e.right as Term];
    }
  },
  doesApply: (inputs: Input[]) => { return "" },
  apply: (inputs: Input[]) => {
    let p = inputs[0] as Predicate;
    const e = inputs[1] as Equality;
    const indices  = inputs[2] as number[];
    const occurances = p.occuranceIndices(e.left!);
    const slotIndices = indices.map(i => occurances[i]);
    for (const index of slotIndices) {
      p = p.setTerm(e.right!, index);
    }
    return p;
  },
}

export const UniversalIntroduction: InferenceRule = {
  name: "Universal (∀) Introduction",
  inputDescriptions: [
    "Proposition: Any proposition already in the bank, 𝑃",
    "Universal Term: Any universal term, 𝔲",
    "Variable: A variable that's not already in 𝑃, 𝑣",
  ],
  outputDescription: "∀𝑣 (𝑃'), where 𝑃' is 𝑃 but with all instances of 𝔲 replaced with 𝑣",
  inputTypes: [InputType.BankProposition, InputType.UniversalTerm, InputType.Variable],
  variableInfo: (inputs: (Input|null)[]) => {
    if (inputs[0] === null) {
      return "Proposition must be chosen before choosing variable.";
    }
    return inputs[0] as Predicate;
  },
  doesApply: () => { return ""; },
  apply: (inputs: Input[]) => {
    let p = inputs[0] as Predicate;
    let u = inputs[1] as Term;
    let v = inputs[2] as Term;
    return forAll(v, p.replaceAll(u, v));
  },
}

export const UniversalElimination: InferenceRule = {
  name: "Universal (∀) Elimination",
  inputDescriptions: [
    "Universal: A proposition from the bank of the form, ∀𝑣 (𝑃)",
    "Term: Any term, t.",
  ],
  outputDescription: "𝑃, but with all \"𝑣\"s replaced with \"t\"s",
  inputTypes: [InputType.BankProposition, InputType.FreeTerm],
  doesApply: (inputs: Input[]) => {
    let p = inputs[0] as Predicate;
    if (!(p instanceof Universal)) {
      return "Chosen universal must start with \"∀\"."
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    let u = inputs[0] as Universal;
    let e = inputs[1] as Term;
    return u.subPredicate.replaceAll(u.variable, e);
  },
}

export const ExistentialIntroduction: InferenceRule = {
  name: "Existential (∃) Introduction",
  inputDescriptions: [
    "Proposition: Any proposition from the bank, 𝑃",
    "Term To Replace: Any term, t.",
    "Variable: A variable that's not already in 𝑃, 𝑣",
    "Replacements: Which instances of t within 𝑃 should be replaced by 𝑣."
  ],
  outputDescription: "∃𝑣 (𝑃'), where 𝑃' is 𝑃 but with the chosen instances of t replaced with 𝑣",
  inputTypes: [InputType.BankProposition, InputType.FreeTerm, InputType.Variable, InputType.Replacement],
  variableInfo: (inputs: (Input|null)[]) => {
    if (inputs[0] === null) {
      return "Proposition must be chosen before choosing variable.";
    }
    return inputs[0] as Predicate;
  },
  replacementInfo: (inputs: (Input|null)[]) => {
    if (inputs[0] === null || inputs[2] === null) {
      return "Proposition and variable must be chosen before chosing replacements.";
    } else {
      return [inputs[0] as Predicate, inputs[1] as Term, inputs[2] as Term];
    }
  },
  doesApply: () => { return ""; },
  apply: (inputs: Input[]) => {
    let v = inputs[2] as Term;
    let p = inputs[0] as Predicate;
    let t  = inputs[1] as Term;
    let indices  = inputs[3] as number[];
    const occurances = p.occuranceIndices(t);
    const slotIndices = indices.map(i => occurances[i]);
    for (const index of slotIndices) {
      p = p.setTerm(v, index);
    }
    return exists(v, p);
  },
}

export const ExistentialElimination: InferenceRule = {
  name: "Existential (∃) Elimination",
  inputDescriptions: [
    "Existential: A proposition from the bank of the form, ∃𝑣 (𝑃)",
  ],
  outputDescription: "𝑃 but with all \"𝑣\"s replaced with a new term.",
  inputTypes: [InputType.BankProposition, InputType.NewExistentialTerm],
  doesApply: (inputs: Input[]) => {
    if (!(inputs[0] instanceof Existential)) {
      return "Chosen existential must start with ∃.";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    const e = inputs[0] as Existential;
    const t = inputs[1] as Term;
    return [e.subPredicate.replaceAll(e.variable, t), t] as [Predicate, Term];
  },
}
