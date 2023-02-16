import Level from '../level.js'
import {
  DoubleNegationElimination,
  NegationIntroduction,
  NegationElimination,
  ConjunctionIntroduction,
  ConjunctionElimination,
  DisjunctionIntroduction,
  DisjunctionElimination,
  ConditionalIntroduction,
  ConditionalElimination,
  BiconditionalIntroduction,
  BiconditionalElimination,
} from '../inference_rules/natural_deduction_system.js'

import {
  HypotheticalSyllogism
} from '../inference_rules/propositional_logic_derived.js'

import { lit } from '../predicates/literal.js'
import { not } from '../predicates/negation.js'
import { and } from '../predicates/conjunction.js'
import { then } from '../predicates/conditional.js'
import { iff } from '../predicates/biconditional.js'
import { or } from '../predicates/disjunction.js'
import { PropositionType } from '../propositions/propositions.js'

const BASE_TYPES = [
  PropositionType.LITERAL,
  PropositionType.CONJUNCTION,
  PropositionType.CONDITIONAL,
  PropositionType.DISJUNCTION,
  PropositionType.NEGATION,
]

const PROPOSITIONAL_LOGIC_BICONDITIONAL: Level[] = [
  {
    name: 'New Rule: Biconditional Introduction',
    description: [
      "New logical symbol: ↔ (Biconditional)",
      "It's very common in logic and math that we need to show that two propositions are equivalent.\nIn other words, it's very common that we need to show that one proposition implies another AND vice versa.",
      "Instead of writting (𝑃 → 𝑄) ∧ (𝑄 → 𝑃) we'll simply use the shorthand notation 𝑃 ↔ 𝑄.",
      "Since a biconditional is just the conjunction of a conditional and its converse, that's all you need to use biconditional introduction.\nYou can think of biconditional introduction as being conjunction introduction but with extra requirements on the two propositions you're conjuncting.",
    ],
    rules: [
      BiconditionalIntroduction,
    ],
    propositions: [
      then("Alice is taller than Bob", "Bob is shorter than Alice"),
      then("Bob is shorter than Alice", "Alice is taller than Bob"),
    ],
    target: iff("Alice is taller than Bob", "Bob is shorter than Alice"),
    allowedPropositionTypes: BASE_TYPES,
  },

  {
    name: 'New Rule: Biconditional Elimination',
    description: [
      "Since 𝑃 ↔ 𝑄 is just shorthand notation for (𝑃 → 𝑄) ∧ (𝑄 → 𝑃), we can use conjunction elimination to get either conditional statement.",
      "That's exactly what biconditional elimination is.\nIf you have a biconditional, it lets you deduce either \"uni\"-conditional verison of it.\nYou just have to specify which of the two you want.",
    ],
    rules: [
      BiconditionalElimination,
    ],
    propositions: [
      iff("Alice is taller than Bob", "Bob is shorter than Alice"),
    ],
    target: then("Alice is taller than Bob", "Bob is shorter than Alice"),
    allowedPropositionTypes: BASE_TYPES,
  },

  {
    name: 'Biconditional Commutation',
    description: [
      "Unlike normal conditonals, biconditionals are commutative.\nThat is, we can swap the left and right sides as we please."
    ],
    rules: [
      BiconditionalIntroduction,
      BiconditionalElimination,
    ],
    propositions: [
      iff("Alice is Bob's mother", "Bob is Alice's son"),
    ],
    target: iff("Bob is Alice's son", "Alice is Bob's mother"),
    allowedPropositionTypes: BASE_TYPES,
  },

  {
    name: 'Biconditional Hypothetical Syllogism',
    description: [
      "If 𝑃 is equivalent to 𝑄 and 𝑄 is equivalent to 𝑅, then you can prove that 𝑃 is equivalent to 𝑅."
    ],
    hints: [
      "If your target is a biconditional, it's generally a good idea to try to prove each direction one at a time.\nFirst deduce (Alice is the tallest) → (everyone is shorter than Alice), then deduce (everyone is shorter than Alice) → (Alice is the tallest), then combine them with biconditional introduction.",
    ],
    rules: [
      ConditionalIntroduction,
      ConditionalElimination,
      BiconditionalIntroduction,
      BiconditionalElimination,
      HypotheticalSyllogism,
    ],
    propositions: [
      iff("Alice is the tallest", "Alice is taller than everyone"),
      iff("Alice is taller than everyone", "everyone is shorter than Alice")
    ],
    target: iff("Alice is the tallest", "everyone is shorter than Alice"),
    allowedPropositionTypes: BASE_TYPES,
  },

  {
    name: 'Biconditional Practice',
    description: [
      "Biconditional statements are useful to express definitions.\nYou can think of the first assumption in this level as a definition for \"weekend\".",
    ],
    rules: [
      ConditionalElimination,
      DisjunctionIntroduction,
      BiconditionalElimination,
    ],
    propositions: [
      iff(or("it's Saturday", "it's Sunday"), "it's the weekend"),
      then("it's the weekend", "I relax"),
      lit("it's Sunday"),
    ],
    target: lit("I relax"),
    allowedPropositionTypes: BASE_TYPES,
  },

  {
    name: 'Conjunction Idempotency',
    description: [
      "There are many tautologies that can be expressed as a biconditional proposition.",
      "Here we show that conjuncting something with itself doesn't change it.",
    ],
    hints: [
      "To prove a biconditional, you need to prove both directions.\nFirst deduce (I like tea) → ((I like tea) ∧ (I like tea)) and ((I like tea) ∧ (I like tea)) → (I like tea).\nThen you'll be able to finish the level with biconditional introduction.",
    ],
    rules: [
      ConjunctionIntroduction,
      ConjunctionElimination,
      ConditionalIntroduction,
      BiconditionalIntroduction,
    ],
    propositions: [],
    target: iff("I like tea", and("I like tea", "I like tea")),
    allowedPropositionTypes: [
      PropositionType.LITERAL,
      PropositionType.CONJUNCTION,
    ],
  },

  {
    name: 'Disjunction Idempotency',
    description: [
      "Here we show that disjuncting something with itself doesn't change it.",
    ],
    rules: [
      DisjunctionIntroduction,
      DisjunctionElimination,
      ConditionalIntroduction,
      BiconditionalIntroduction,
    ],
    propositions: [],
    target: iff("I like tea", or("I like tea", "I like tea")),
    allowedPropositionTypes: [
      PropositionType.LITERAL,
      PropositionType.DISJUNCTION,
    ],
  },

  {
    name: 'Negation Involution',
    description: [
      "Here we show that negating something twice doesn't change it.",
    ],
    rules: [
      NegationIntroduction,
      DoubleNegationElimination,
      ConditionalIntroduction,
      BiconditionalIntroduction,
    ],
    propositions: [],
    target: iff("I like tea", not(not("I like tea"))),
    allowedPropositionTypes: [
      PropositionType.LITERAL,
      PropositionType.NEGATION,
    ],
  },

  {
    name: 'World Complete!',
    description: [
      "That's it for biconditionals!",
      "If you'd like to learn about another shortcut in propositional logic, try out \"Propositional Logic: Contradictions\".",
      "If you'd like to learn about terms, functions, and quantifiers, try out first-order logic.",
    ],
    rules: [
      BiconditionalIntroduction,
      BiconditionalElimination,
    ],
    propositions: [],
    target: lit("⊥"),
    allowedPropositionTypes: BASE_TYPES,
  },

];
export default PROPOSITIONAL_LOGIC_BICONDITIONAL;
