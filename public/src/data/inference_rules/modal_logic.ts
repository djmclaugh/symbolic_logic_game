import InferenceRule, {InputType, Input} from './inference_rule.js'
import Predicate from '../predicates/predicate.js'
import Negation, {not} from '../predicates/negation.js'
import Conjunction, {and} from '../predicates/conjunction.js'
import Disjunction, {or} from '../predicates/disjunction.js'
import Conditional, {then} from '../predicates/conditional.js'
import Necessity, {must} from '../predicates/box.js'
import Possibility, {can} from '../predicates/diamond.js'
import {lit} from '../predicates/literal.js'


export const Necessitation: InferenceRule = {
  name: "Necessitation (N)",
  inputDescriptions: [
    "Tautology: Any proposition whatsoever",
    "Proof: Win the level with no assumptions and the chosen tautology as the target",
  ],
  outputDescription: "□(𝑃)",
  inputTypes: [InputType.AnyProposition, InputType.Proof],
  proofInfo: (inputs: (Input|null)[]) => {
    if (inputs[0] === null) {
      return "Proposition must be chosen before working on proof.";
    } else {
      return [[], false, inputs[0] as Predicate];
    }
  },
  doesApply: (inputs: Input[]) => {
    if (inputs[1] != "done") {
      return "Proof not completed."
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    return must(inputs[0] as Predicate);
  },
}

export const Distribution: InferenceRule = {
  name: "Distribution (K)",
  inputDescriptions: [
    "Necessary Conditional: An assumed/deduced proposition of the form □((𝑃) → (𝑄))",
  ],
  outputDescription: "(□(𝑃)) → (□(𝑄))",
  inputTypes: [InputType.BankProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 1) {
      return "Can only be applied to one proposition at a time.";
    }
    const p = inputs[0] as Predicate;
    if (!(p instanceof Necessity)) {
      return "Chosen necessary conditional must start with \"□\".";
    }
    if (!(p.sub instanceof Conditional)) {
      return "Chosen necessary conditional must have a \"→\" that is inside exactly one pair of parentheses.";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    const p = inputs[0] as Necessity;
    const c = p.sub as Conditional;
    return then(must(c.left), must(c.right));
  },
}

export const NecessityDuality: InferenceRule = {
  name: "Necessity Duality (□ into ◊)",
  inputDescriptions: [
    "Necessity: An assumed/deduced proposition of the form □(𝑃))",
  ],
  outputDescription: "¬(◊(¬(𝑃)))",
  inputTypes: [InputType.BankProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 1) {
      return "Can only be applied to one proposition at a time.";
    }
    const p = inputs[0] as Predicate;
    if (!(p instanceof Necessity)) {
      return "Chosen necessity must start with \"□\".";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    const p = inputs[0] as Necessity;
    return not(can(not(p.sub)));
  },
}

export const PossibilityDuality: InferenceRule = {
  name: "Possibility Duality (◊ into □)",
  inputDescriptions: [
    "Possibility: An assumed/deduced proposition of the form ◊(𝑃))",
  ],
  outputDescription: "¬(□(¬(𝑃)))",
  inputTypes: [InputType.BankProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 1) {
      return "Can only be applied to one proposition at a time.";
    }
    const p = inputs[0] as Predicate;
    if (!(p instanceof Necessity)) {
      return "Chosen possibility must start with \"◊\".";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    const p = inputs[0] as Possibility;
    return not(must(not(p.sub)));
  },
}

export const SerialAxiom: InferenceRule = {
  name: "Seriality (D)",
  inputDescriptions: [
    "Necessity: Any assumed/deduced proposition of the form □(𝑃)",
  ],
  outputDescription: "◊(𝑃)",
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 1) {
      return "Can only be applied to one proposition at a time.";
    }
    const p = inputs[0] as Predicate;
    if (!(p instanceof Necessity)) {
      return "Chosen necessity must start with \"□\".";
    }
    return "";
  },
  inputTypes: [InputType.BankProposition],
  apply: (inputs: Input[]) => {
    const p = inputs[0] as Necessity;
    return can(p.sub);
  },
};

export const ReflexiveAxiom: InferenceRule = {
  name: "Relfexivity (T)",
  inputDescriptions: [
    "Necessity: Any assumed/deduced proposition of the form □(𝑃)",
  ],
  outputDescription: "𝑃",
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 1) {
      return "Can only be applied to one proposition at a time.";
    }
    const p = inputs[0] as Predicate;
    if (!(p instanceof Necessity)) {
      return "Chosen necessity must start with \"□\".";
    }
    return "";
  },
  inputTypes: [InputType.BankProposition],
  apply: (inputs: Input[]) => {
    const p = inputs[0] as Necessity;
    return p.sub;
  },
};

export const SymmetryAxiom: InferenceRule = {
  name: "Symmetry (B)",
  inputDescriptions: [
    "Proposition: Any assumed/deduced proposition",
  ],
  outputDescription: "□(◊(𝑃))",
  inputTypes: [InputType.BankProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 1) {
      return "Can only be applied to one proposition at a time.";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    const p = inputs[0] as Necessity;
    return must(can(p));
  },
};

export const TransitivityAxiom: InferenceRule = {
  name: "Transitivity (4)",
  inputDescriptions: [
    "Necessity: An assumed/deduced proposition of the form □(𝑃)",
  ],
  outputDescription: "□(□(𝑃))",
  inputTypes: [InputType.BankProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 1) {
      return "Can only be applied to one proposition at a time.";
    }
    const p = inputs[0] as Predicate;
    if (!(p instanceof Necessity)) {
      return "Chosen necessity must start with \"□\".";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    const p = inputs[0] as Necessity;
    return must(p);
  },
};

export const EuclideanAxiom: InferenceRule = {
  name: "Euclideanity (5)",
  inputDescriptions: [
    "Possibility: An assumed/deduced proposition of the form ◊(𝑃)",
  ],
  outputDescription: "□(◊(𝑃))",
  inputTypes: [InputType.BankProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 1) {
      return "Can only be applied to one proposition at a time.";
    }
    const p = inputs[0] as Predicate;
    if (!(p instanceof Necessity)) {
      return "Chosen possibility must start with \"◊\".";
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    const p = inputs[0] as Necessity;
    return must(p);
  },
};
