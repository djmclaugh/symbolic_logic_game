import InferenceRule, {InputType, Input} from './inference_rule.js'
import { not } from '../predicates/negation.js'
import { or } from '../predicates/disjunction.js'
import { then } from '../predicates/conditional.js'
import {eq} from '../predicates/equality.js'
import {forAll} from '../predicates/universal.js'
import {exists} from '../predicates/existential.js'
import Predicate from '../predicates/predicate.js'
import Term from '../terms/term.js'
import { litTerm } from '../terms/literal.js'
import { func } from '../terms/function.js'

const x = litTerm("𝑥");
const y = litTerm("𝑦");
const zero = litTerm("0");
const S = func(["S(", ")"], [x]);
const plus = func(["(", ") + (", ")"], [x, y]);
const times = func(["(", ") × (", ")"], [x, y]);

export const RobinsonAxioms: InferenceRule = {
  name: "Robinson Arithmetic Axioms",
  inputDescriptions: [
    "Axiom Choice",
  ],
  outputDescription: "The chosen axiom.",
  inputTypes: [ InputType.Axiom ],
  doesApply: (inputs: Input[]) => { return "" },
  axiomInfo: () => {
    return [
      forAll(x, not(eq(S.withSlots([x]), zero))),
      forAll(x, forAll(y, then(eq(S.withSlots([x]), S.withSlots([y])), eq(x, y)))),
      forAll(x, or(eq(x, zero), exists(y, eq(S.withSlots([y]), x)))),
      forAll(x, eq(plus.withSlots([x, zero]), x)),
      forAll(x, forAll(y, eq(plus.withSlots([x, S.withSlots([y])]), S.withSlots([plus.withSlots([x, y])])))),
      forAll(x, eq(times.withSlots([x, zero]), zero)),
      forAll(x, forAll(y, eq(times.withSlots([x, S.withSlots([y])]), plus.withSlots([times.withSlots([x, y]), x])))),
    ];
  },
  apply: (inputs: Input[]) => {
    const x = inputs[0] as Predicate;
    return x;
  },
}
