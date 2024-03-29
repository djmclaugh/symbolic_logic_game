import Level from '../level.js'

import {
  ConjunctionIntroduction,
  ConjunctionElimination,
  ConditionalIntroduction,
  ConditionalElimination,
  DisjunctionIntroduction,
  DisjunctionElimination,
  NegationIntroduction,
  NegationElimination,
  DoubleNegationElimination,
} from '../inference_rules/natural_deduction_system.js'

import {
  ModusTollens,
  DoubleNegationIntroduction,
  HypotheticalSyllogism,
  LawOfExcludedMiddle,
  DisjunctiveSyllogism,
  // Explosion,
} from '../inference_rules/propositional_logic_derived.js'

import {
  DetectContradiction,
  ProofOfNegation,
  ProofByContradiction,
} from '../inference_rules/propositional_logic_negation.js'

import {
  Reflexivity,
  Substitution,
  UniversalIntroduction,
  UniversalElimination,
  ExistentialIntroduction,
  ExistentialElimination,
} from '../inference_rules/first_order_logic.js'

import {
  Symmetry,
  EqualityNegationSymmetry,
} from '../inference_rules/fol_derived.js'

import {
  RobinsonAxioms,
} from '../inference_rules/robinson.js'

import { litTerm } from '../terms/literal.js'
import { func } from '../terms/function.js'

import { lit, litWithTerms } from '../predicates/literal.js'
import { not } from '../predicates/negation.js'
import { and } from '../predicates/conjunction.js'
import { or } from '../predicates/disjunction.js'
import { then } from '../predicates/conditional.js'
import { eq } from '../predicates/equality.js'
import { forAll } from '../predicates/universal.js'
import { exists } from '../predicates/existential.js'
import { PropositionType, FOL_PROPOSITION_TYPES } from '../propositions/propositions.js'

const x = litTerm("𝑥");
const y = litTerm("𝑦");
const zero = litTerm("0");
const one = litTerm("1");
const two = litTerm("2");
const three = litTerm("3");
const four = litTerm("4");
const S = func(["S(", ")"], [x]);
const plus = func(["(", ") + (", ")"], [x, y]);
const times = func(["(", ") × (", ")"], [x, y]);

const ROB: Level[] = [];

ROB.push({
  name: "Axiom #1",
  description: [
    "In mathematics, a formal theory is the combination of a symbolic logic, a collection of terms/functions/predicates, and a collection of starting propositions called axioms.",
    "In these levels, we'll explore the formal theory called Robinson arithmetic.",
    "Robinson arithmetic uses first-order logic with equality as its symbolic logic, so I highly recommend you complete those levels first.",
    "It has one term: 0.\nIt has three functions: S(_), (_) + (_), and (_) × (_).\nIt has no predicates.\nIt has seven axioms (we'll see them one at a time).",
    "The idea behind the term 0 is to represent the number zero.\nThe idea behind the function S(_) is to represent the successor of a number, number that comes after.\nFor example, the idea behind S(0) would be the nubmer that comes after 0.\nThe idea behind Robinson arithmetic as a whole is to formalize the natural numbers (so no negative numbers nor fractions).",
    "The first axiom we'll see is ∀𝑥 ¬(S(𝑥) = 0).\nThe idea behind this axiom is to say that 0 doesn't come after any number.",
    "Usually, axioms are treated as assumptions. But to avoid clutter, instead of adding the axioms as assumptions, I've added an inference rule that allows you to deduce any of the seven axioms.",
    "For this first level, use the first axiom to prove that the number that comes after the number that comes after 0 is not 0."
  ],
  rules: [
    RobinsonAxioms,
    UniversalElimination,
  ],
  terms: [zero],
  propositions: [],
  target: not(eq(S.withSlots([S.withSlots([zero])]), zero)),
});

ROB.push({
  name: "Definitions",
  description: [
    "Robinson arithmetic technically only has one term, \"0\".\nBut nothing is stopping us from giving names to the terms we build using functions.",
    "Instead of writting S(0) for the number that comes after 0, we could just call that number 1.\nInstead of writting S(S(0)) for the number that comes after the number that comes after 0, we could just call that number 2.\nAnd so on...",
    "This level is the same as the previous, but with definitions added."
  ],
  rules: [
    RobinsonAxioms,
    UniversalElimination,
    Substitution,
  ],
  terms: [zero, one, two],
  propositions: [
    eq(S.withSlots([zero]), one),
    eq(S.withSlots([one]), two)
  ],
  target: not(eq(two, zero)),
});

ROB.push({
  name: "Axiom #2",
  description: [
    "The second axiom is ∀𝑥 (∀𝑦 ((S(𝑥) = S(𝑦)) → (𝑥 = 𝑦))).\nThe idea behind this axiom is to say if the number that comes after 𝑥 is the same as the number that comes after 𝑦, then 𝑥 and 𝑦 must be the same number.",
    "Use the first and second axioms to prove that 2 is not the same number as 1."
  ],
  rules: [
    RobinsonAxioms,
    ModusTollens,
    UniversalElimination,
    Substitution,
  ],
  terms: [zero, one, two],
  propositions: [
    eq(S.withSlots([zero]), one),
    eq(S.withSlots([one]), two)
  ],
  target: not(eq(two, one)),
});

ROB.push({
  name: "Axiom #3",
  description: [
    "The third axiom is ∀𝑥 ((𝑥 = 0) ∨ (∃𝑦 (S𝑦 = 𝑥))).\nThe idea behind this axiom is to say that either a number is 0 or it comes after some number.",
    "Use it to prove that if a number is not 0, then it comes after some number.",
  ],
  rules: [
    RobinsonAxioms,
    ConditionalIntroduction,
    DisjunctiveSyllogism,
    UniversalElimination,
    UniversalIntroduction,
  ],
  terms: [zero],
  propositions: [],
  target: forAll(x, then(not(eq(x, zero)), exists(y, eq(S.withSlots([y]), x)))),
  allowedPropositionTypes: [
    PropositionType.EQUALITY,
    PropositionType.NEGATION,
    PropositionType.EXISTENTIAL,
  ]
});

ROB.push({
  name: "Axiom #4",
  description: [
    "New function: (_) + (_)",
    "The idea behind the (_) + (_) function is to represent addition.",
    "The forth axiom is ∀𝑥 ((𝑥) + (0) = 𝑥).\nThe idea behind this axiom is to say that adding 0 to any number doesn't change it.",
    "Use it to prove that 1 + 0 = 1.",
  ],
  rules: [
    RobinsonAxioms,
    UniversalElimination,
  ],
  terms: [zero, one],
  propositions: [
    eq(S.withSlots([zero]), one)
  ],
  target: eq(plus.withSlots([one, zero]), one),
});

ROB.push({
  name: "Axiom #5",
  description: [
    "The fifth axiom is ∀𝑥 (∀𝑦 ((𝑥) + (S(𝑦)) = S((𝑥) + (𝑦)))).\nThe idea behind this axiom is to say that 𝑥 plus the number that comes after 𝑦 should be the same as the number that comes after 𝑥 plus 𝑦.",
    "Use the two addition axioms to prove that (1) + (1) = 2.",
  ],
  rules: [
    RobinsonAxioms,
    UniversalElimination,
    Substitution,
  ],
  terms: [zero, one, two],
  propositions: [
    eq(S.withSlots([zero]), one),
    eq(S.withSlots([one]), two)
  ],
  target: eq(plus.withSlots([one, one]), two),
});

ROB.push({
  name: "𝑥 + 1 = S(𝑥)",
  description: [
    "In this level you'll show that adding 1 to a number is the same as taking the number that comes after."
  ],
  rules: [
    RobinsonAxioms,
    UniversalIntroduction,
    UniversalElimination,
    Substitution,
  ],
  terms: [zero, one],
  propositions: [
    eq(S.withSlots([zero]), one),
  ],
  target: forAll(x, eq(plus.withSlots([x, one]), S.withSlots([x]))),
});

ROB.push({
  name: "2 + 1 = 3",
  description: [],
  rules: [
    RobinsonAxioms,
    UniversalElimination,
    Substitution,
  ],
  terms: [zero, one, two, three],
  propositions: [
    eq(S.withSlots([zero]), one),
    eq(S.withSlots([one]), two),
    eq(S.withSlots([two]), three),
  ],
  target: eq(plus.withSlots([two, one]), three),
});

ROB.push({
  name: "1 + 2 = 3",
  description: [],
  rules: [
    RobinsonAxioms,
    UniversalElimination,
    Substitution,
  ],
  terms: [zero, one, two, three],
  propositions: [
    eq(S.withSlots([zero]), one),
    eq(S.withSlots([one]), two),
    eq(S.withSlots([two]), three),
  ],
  target: eq(plus.withSlots([one, two]), three),
});

ROB.push({
  name: "Axiom #6",
  description: [
    "New function: (_) × (_)",
    "The idea behind the (_) × (_) function is to represent multiplication.",
    "The sixth axiom is ∀𝑥 ((𝑥) × (0) = 0).\nThe idea behind this axiom is to say that multiplying any number by 0 gives us 0.",
    "Use it to prove that 1 × 0 = 0.",
  ],
  rules: [
    RobinsonAxioms,
    UniversalElimination,
  ],
  terms: [zero, one],
  propositions: [
    eq(S.withSlots([zero]), one)
  ],
  target: eq(times.withSlots([one, zero]), zero),
});

ROB.push({
  name: "Axiom #7",
  description: [
    "The seventh and final axiom is ∀𝑥 (∀𝑦 ((𝑥) × (S(𝑦)) = ((𝑥) × (𝑦)) + (𝑥))).\nThe idea behind this axiom is to say that 𝑥 times the number that comes after 𝑦 should be the same as 𝑥 times 𝑦 plus an extra copy of 𝑥.",
    "Use all the addition and multiplication axioms to prove that (2) × (2) = 4.",
    "Warning: This level is more tedious than it is hard.",
  ],
  rules: [
    RobinsonAxioms,
    UniversalElimination,
    Substitution,
  ],
  terms: [zero, one, two, three, four],
  propositions: [
    eq(S.withSlots([zero]), one),
    eq(S.withSlots([one]), two),
    eq(S.withSlots([two]), three),
    eq(S.withSlots([three]), four),
  ],
  target: eq(times.withSlots([two, two]), four),
});

ROB.push({
  name: "𝑥 × 1 = 𝑥",
  description: [
    "In this level you'll show that multiplying a number by 1 doesn't change it."
  ],
  rules: [
    RobinsonAxioms,
    UniversalIntroduction,
    UniversalElimination,
    Substitution,
  ],
  terms: [zero, one],
  propositions: [
    eq(S.withSlots([zero]), one),
  ],
  target: forAll(x, eq(times.withSlots([x, one]), x)),
});

ROB.push({
  name: "𝑥 × 2 = 𝑥 + 𝑥",
  description: [
    "In this level you'll show that multiplying a number by 2 is the same as adding it to itself.",
    "You can re-use the result you've proven in the previous level."
  ],
  rules: [
    RobinsonAxioms,
    UniversalIntroduction,
    UniversalElimination,
    Substitution,
  ],
  terms: [zero, one, two],
  propositions: [
    eq(S.withSlots([zero]), one),
    eq(S.withSlots([one]), two),
    forAll(x, eq(times.withSlots([x, one]), x))
  ],
  target: forAll(x, eq(times.withSlots([x, two]), plus.withSlots([x, x]))),
});

ROB.push({
  name: "World Complete!",
  description: [
    "That's it for Robinson arithmetic!",
    "This is the last world implemented so far. Congratulations on completing everything!",
    "Let me know if there are any other level, logic, or theory you would me to add: https://github.com/djmclaugh/symbolic_logic_game/issues",
  ],
  rules: [
    RobinsonAxioms,
    ConjunctionIntroduction,
    ConjunctionElimination,
    ConditionalIntroduction,
    ConditionalElimination,
    DisjunctionIntroduction,
    DisjunctionElimination,
    NegationIntroduction,
    NegationElimination,
    DoubleNegationElimination,
    ExistentialIntroduction,
    ExistentialElimination,
    UniversalIntroduction,
    UniversalElimination,
    Reflexivity,
    Substitution,
    DetectContradiction,
    ProofOfNegation,
    ProofByContradiction,
  ],
  allowedPropositionTypes: FOL_PROPOSITION_TYPES,
  propositions: [],
  terms: [zero],
  target: lit("⊥"),
});

export default ROB;
