import InferenceRule, { InputType, Input } from './inference_rule.js'
import Predicate from '../predicates/predicate.js'
import Negation, { not } from '../predicates/negation.js'
import Conjunction, { and } from '../predicates/conjunction.js'
import Disjunction, { or } from '../predicates/disjunction.js'
import Conditional, { then } from '../predicates/conditional.js'
import { iff } from '../predicates/biconditional.js'
import Necessity, { must } from '../predicates/box.js'
import Possibility, { can } from '../predicates/diamond.js'

export const NecessityEquivalence: InferenceRule = {
  name: "Necessity Equivalence",
  inputDescriptions: [
    "Proposition 𝐴: Any proposition whatsoever",
    "Proposition 𝐵: Any proposition whatsoever",
    "Proof: Win the level with no assumptions and with (𝐴) ↔ (𝐵) as the target",
  ],
  outputDescription: "□(𝐴) ↔ □(𝐵)",
  inputTypes: [InputType.AnyProposition, InputType.AnyProposition, InputType.Proof],
  proofInfo: (inputs: (Input|null)[]) => {
    if (inputs[0] === null || inputs[1] === null) {
      return "Both propositions must be chosen before working on proof.";
    } else {
      return [[], false, iff(inputs[0] as Predicate, inputs[1] as Predicate)];
    }
  },
  doesApply: (inputs: Input[]) => {
    if (inputs[2] != "done") {
      return "Proof not completed."
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    return iff(must(inputs[0] as Predicate), must(inputs[1] as Predicate));
  },
}

export const PossibilityEquivalence: InferenceRule = {
  name: "Possibility Equivalence",
  inputDescriptions: [
    "Proposition 𝐴: Any proposition whatsoever",
    "Proposition 𝐵: Any proposition whatsoever",
    "Proof: Win the level with no assumptions and with (𝐴) ↔ (𝐵) as the target",
  ],
  outputDescription: "◊(𝐴) ↔ ◊(𝐵)",
  inputTypes: [InputType.AnyProposition, InputType.AnyProposition, InputType.Proof],
  proofInfo: (inputs: (Input|null)[]) => {
    if (inputs[0] === null || inputs[1] === null) {
      return "Both propositions must be chosen before working on proof.";
    } else {
      return [[], false, iff(inputs[0] as Predicate, inputs[1] as Predicate)];
    }
  },
  doesApply: (inputs: Input[]) => {
    if (inputs[2] != "done") {
      return "Proof not completed."
    }
    return "";
  },
  apply: (inputs: Input[]) => {
    return iff(can(inputs[0] as Predicate), can(inputs[1] as Predicate));
  },
}



export const Necessitation: InferenceRule = {
  name: "Necessitation (N)",
  inputDescriptions: [
    "Tautology: Any proposition whatsoever",
    "Proof: Win the level with no assumptions and with the chosen tautology as the target",
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

export const Duality: InferenceRule = {
  name: "Duality",
  inputDescriptions: [
    "An assumed/deduced proposition of the form ¬(□(𝑃)), ◇(¬(𝑃)), ¬(◇(𝑃)), or □(¬(𝑃))",
  ],
  outputDescription: "The dual of the chosen proposition.",
  inputTypes: [InputType.BankProposition],
  doesApply: (inputs: Input[]) => {
    if (inputs.length != 1) {
      return "Can only be applied to one proposition at a time.";
    }
    const p = inputs[0] as Predicate;
    if ((p instanceof Necessity) || (p instanceof Possibility)) {
      if (p.sub instanceof Negation) {
        return "";
      }
    }
    if (p instanceof Negation) {
      if ((p.sub instanceof Necessity) || (p.sub instanceof Possibility)) {
        return "";
      }
    }
    return "Chosen proposition must be of the form, ¬(□(𝑃)), ◇(¬(𝑃)), ¬(◇(𝑃)), or □(¬(𝑃))";
  },
  apply: (inputs: Input[]) => {
    const p = inputs[0] as Necessity|Possibility|Negation;
    if (p instanceof Necessity) {
      const n = p.sub as Negation;
      return not(can(n.sub));
    }
    if (p instanceof Possibility) {
      const n = p.sub as Negation;
      return not(must(n.sub));
    }
    const modal = p.sub;
    if (modal instanceof Necessity) {
      return can(not(modal.sub));
    }
    if (modal instanceof Possibility) {
      return must(not(modal.sub));
    }
    throw new Error("This should never happen");
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

export const DeonticAxiom: InferenceRule = {
  name: "Deontic Axiom (D)",
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
  name: "T",
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
