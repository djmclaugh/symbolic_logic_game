import Level from '../level.js'

import {
  ConjunctionIntroduction,
  ConditionalIntroduction,
  ConditionalElimination,
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

import { litTerm } from '../terms/literal.js'

import { lit, litWithTerms } from '../predicates/literal.js'
import { not } from '../predicates/negation.js'
import { and } from '../predicates/conjunction.js'
import { or } from '../predicates/disjunction.js'
import { then } from '../predicates/conditional.js'
import { eq } from '../predicates/equality.js'
import { forAll } from '../predicates/universal.js'
import { exists } from '../predicates/existential.js'
import { PropositionType } from '../propositions/propositions.js'

const x = litTerm("𝑥");
const y = litTerm("𝑦");
const alice = litTerm("Alice");
const bob = litTerm("Bob");
const carol = litTerm("Carol");
const tallest = litTerm("tallest person");
const shortest = litTerm("shortest person");
const paws = litTerm("Mr. Paws");
const myDog = litTerm("my dog");
const clark = litTerm("Clark Kent");
const superman = litTerm("Superman");
const myFavDrink = litTerm("my favourite drink");
const water = litTerm("water");
const h2o = litTerm("H₂O");

const FIRST_ORDER_LOGIC: Level[] = [];

FIRST_ORDER_LOGIC.push({
  name: "Rule #1: Reflexivity",
  description: [
    "New logical symbol: = (Equality)",
    "Almost all theories built on top of first-order logic uses the same concept of equality.\nSo many people prefer considering equality as part of the logic itself instead of an addition from the theory.\nThis upgraded logic is creatively called \"first-order logic with equality\".\nBut some people just call it \"first-order logic\" anyway.",
    "The \"=\" symbol is inspired by the word \"equals\". The idea is for \"𝑥 = 𝘺\" to mean that 𝑥 and 𝘺 both refer to the same thing.",
    "This first rule is called reflexivity.\nGiven any term, it let's you put the \"=\" in between two copies of that term and add that proposition to your bank.",
    "The idea behind reflexivity is that a term should always refer to the same \"thing\"."
  ],
  rules: [
    ConjunctionIntroduction,
    Reflexivity,
  ],
  terms: [alice, bob],
  propositions: [],
  target: and(eq(alice, alice), eq(bob, bob)),
});

FIRST_ORDER_LOGIC.push({
  name: "Rule #2: Substitution",
  description: [
    "A term always refers to the same thing, but a thing might not always be refered to by the same term.\nWe can have multiple terms refer to the same thing.",
    "This second rule is called substitution.\nIf a term is equal to another term, then you can replace the first term by the second term in any proposition and add the modified proposition to your bank.",
    "The idea behind substitution is that if two terms refer to same thing, then it shouldn't matter which of the two is used."
  ],
  rules: [
    Substitution,
  ],
  terms: [myDog, paws],
  propositions: [
    eq(myDog, paws),
    litWithTerms(["I love ", ""], [myDog]),
  ],
  target: litWithTerms(["I love ", ""], [paws]),
});

FIRST_ORDER_LOGIC.push({
  name: "Prove Derived Rule: Symmetry",
  description: [
    "That's it! These are the only two rules that we'll take for granted about \"=\".",
    "\"=\" has many other properties that we are familiar with, but we can actually prove them from the first two rules.",
    "Here we prove that \"=\" is symmetric. In other words, we show that it doesn't mater if we write 𝑎 = 𝑏 or 𝑏 = 𝑎."
  ],
  terms: [clark, superman],
  rules: [
    Reflexivity,
    Substitution,
  ],
  propositions: [
    eq(clark, superman),
  ],
  target: eq(superman, clark),
});

FIRST_ORDER_LOGIC.push({
  name: "Prove Derived Rule: Transitivity",
  description: [
    "Here we prove that \"=\" is transitive. In other words, that we can chain equalities.",
    "Note: Because of transitivity, in real life, if ever three things are equal to each other, people will write just \"𝑎 = 𝑏 = 𝑐\" instead of the three propositions \"𝑎 = 𝑏\", \"𝑎 = 𝑐\", and \"𝑏 = 𝑐\".",
  ],
  rules: [
    Reflexivity,
    Substitution,
  ],
  terms: [myFavDrink, water, h2o],
  propositions: [
    eq(myFavDrink, water),
    eq(water, h2o),
  ],
  target: eq(myFavDrink, h2o),
});

FIRST_ORDER_LOGIC.push({
  name: "Prove Derived Rule: Equality Negation Symmetry",
  description: [
    "Here we prove that ¬(𝑎 = 𝑏) is symmetric.",
    "Intuitively this makes sense, but it's a bit tricker to prove than just normal equality symmetry."
  ],
  rules: [
    ConditionalIntroduction,
    ModusTollens,
    Symmetry,
  ],
  terms: [bob, tallest],
  propositions: [
    not(eq(bob, tallest)),
  ],
  target: not(eq(tallest, bob)),
  allowedPropositionTypes: [
    PropositionType.EQUALITY,
  ]
});

FIRST_ORDER_LOGIC.push({
  name: "Equality Practice",
  description: [],
  rules: [
    DisjunctiveSyllogism,
    Symmetry,
    EqualityNegationSymmetry,
    Substitution,
  ],
  terms: [alice, bob, tallest, shortest],
  propositions: [
    not(eq(tallest, shortest)),
    or(eq(alice, tallest), eq(bob, tallest)),
    eq(shortest, bob),
  ],
  target: eq(tallest, alice),
  allowedPropositionTypes: [
    PropositionType.EQUALITY,
    PropositionType.NEGATION,
  ]
});

export default FIRST_ORDER_LOGIC;
