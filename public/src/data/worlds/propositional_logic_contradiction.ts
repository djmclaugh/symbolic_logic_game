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
} from '../inference_rules/natural_deduction_system.js'

import {
  DetectContradiction,
  ProofOfNegation,
  ProofByContradiction,
} from '../inference_rules/propositional_logic_negation.js'

import { lit } from '../predicates/literal.js'
import { not } from '../predicates/negation.js'
import { and } from '../predicates/conjunction.js'
import { then } from '../predicates/conditional.js'
import { or } from '../predicates/disjunction.js'
import { PropositionType } from '../propositions/propositions.js'

const ALL_BASE_RULES = [
  ConjunctionIntroduction,
  ConjunctionElimination,
  ConditionalIntroduction,
  ConditionalElimination,
  DisjunctionIntroduction,
  DisjunctionElimination,
  NegationIntroduction,
  NegationElimination,
  DoubleNegationElimination,
]

const BASE_TYPES = [
  PropositionType.LITERAL,
  PropositionType.CONJUNCTION,
  PropositionType.CONDITIONAL,
  PropositionType.DISJUNCTION,
  PropositionType.NEGATION,
]

const PROPOSITIONAL_LOGIC_CONTRADICTION: Level[] = [
  {
    name: 'New Rule: Formal Contradiction',
    description: [
      "Setting up negation introduction arguments can be a bit complicated and tedious.\nYou first need to figure out which contradiciton you're going to expose and then set up two conditional propositions using conditional introduction.",
      "That's why in practice we instead use the concept of formal contradictions (as opposed to contradicting conditionals).",
      "New logical symbol: ⊥ (Formal Contradiction).",
      "To create the proposition that consists of only ⊥, all you have to do is find two propositions in your assumptions/deductions such that one is the negation of the other.",
    ],
    rules: [
      DetectContradiction
    ],
    propositions: [
      lit("I like tea"),
      not(lit("I like tea")),
    ],
    target: lit("⊥"),
    allowedPropositionTypes: BASE_TYPES,
  },

  {
    name: 'Formal Contradiction Practice',
    description: [
      "Most of the time you'll have to work at least a little bit to expose the formal contradiction.\nA formal contradiction has to be a proposition and the EXACT same proposition but surrounded by \"¬(\" and \")\"",
      "If we have \"I like tea\" and \"I dislike tea\", that's a contradiction, but it's a semantic contradiction, not a formal one.\nWe really need \"I like tea\" and \"¬(I like tea)\" if we want a formal contradiction."
    ],
    rules: [
      ConditionalElimination,
      DetectContradiction
    ],
    propositions: [
      lit("I like tea"),
      lit("I dislike tea"),
      then(lit("I dislike tea"), not(lit("I like tea"))),
    ],
    target: lit("⊥"),
    allowedPropositionTypes: BASE_TYPES,
  },
  
  {
    name: 'New Rule: Proof of Negation',
    description: [
      "Usually, to deduce the negation of a proposition, we need two contradictory conditional statments with that proposition as the antecedent.\nThis usually involves using conditional introduction twice, which involves clearing two sublevels.",
      "Instead we can use the proof of negation rule of inference.\nTo deduce the negation of a proposition, you just have to prove that the proposition leads to a formal contradiction. You just need to clear one sublevel.",
      "The idea behind proof of negation is that if you're able to deduce a formal contradiction, then you would have been able to deduce contradictory conditionals and then use negation introduction.",
      "Try beating this level (modus tollens) with and without using the proof of negation rule.",
    ],
    rules: [
      ConditionalElimination,
      ConditionalIntroduction,
      NegationIntroduction,
      DetectContradiction,
      ProofOfNegation,
    ],
    propositions: [
      not(lit("the ground is wet")),
      then(lit("it's raining"), lit("the ground is wet")),
    ],
    target: not(lit("it's raining")),
    allowedPropositionTypes: [PropositionType.LITERAL],
  },

  {
    name: 'Double Negation Introduction',
    description: [
      "Again, try beating this level with and without using the proof of negation rule.",
    ],
    rules: [
      ConditionalIntroduction,
      NegationIntroduction,
      DetectContradiction,
      ProofOfNegation,
    ],
    propositions: [
      lit("I like apples"),
    ],
    target: not(not(lit("I like apples"))),
    allowedPropositionTypes: [PropositionType.LITERAL, PropositionType.NEGATION],
  },

  {
    name: 'Law Of Noncontradiction',
    description: [
      "Law of noncontradiction: A thing cannot be true and not true at the same time."
    ],
    rules: [
      ConjunctionElimination,
      ConditionalIntroduction,
      NegationIntroduction,
      DetectContradiction,
      ProofOfNegation,
    ],
    propositions: [],
    target: not(and(lit("I like tea"), not(lit("I like tea")))),
    allowedPropositionTypes: [
      PropositionType.LITERAL,
      PropositionType.NEGATION,
      PropositionType.CONJUNCTION
    ]
  },

  {
    name: 'New Rule: Proof by Contradiction',
    description: [
      "Proof of Negation: If by assuming 𝑃 we get a contradiction, then we can deduce ¬(𝑃)",
      "Proof by Contradiction: If by assuming ¬(𝑃) we get a contradiction, then we can deduce 𝑃",
      "As you can see, proof by contradiction is very similar to proof of negation.\nYou can think of a proof by contradiction as a proof of negation on ¬(𝑃) to get ¬(¬(𝑃)) followed by a double negation elimination on ¬(¬(𝑃)) to get 𝑃.",
      "Try clearing this level once by using proof by contradiction, once by using proof of negation, and once without using either.",
    ],
    rules: [
      ConditionalElimination,
      ConditionalIntroduction,
      NegationIntroduction,
      DoubleNegationElimination,
      DetectContradiction,
      ProofOfNegation,
      ProofByContradiction,
    ],
    propositions: [
      lit("I wake up on time"),
      then(not(lit("I go to bed early")), not(lit("I wake up on time")))
    ],
    target: lit("I go to bed early"),
    allowedPropositionTypes: [PropositionType.LITERAL, PropositionType.NEGATION],
  },
  
  {
    name: 'Law Of Excluded Middle',
    description: [
      "Law of exclude middle: A thing HAS to be either true or not true.",
    ],
    hints: [
      "Use proof by contradiction with the proposition \"(I like tea) ∨ (¬(I like tea)).\"",
      "Within your proof by contradiction, prove \"I like tea\" using proof by contradiction and prove \"¬(I like tea)\" using proof of negation.",
    ],
    rules: [
      ConditionalIntroduction,
      DisjunctionIntroduction,
      NegationIntroduction,
      DoubleNegationElimination,
      DetectContradiction,
      ProofOfNegation,
      ProofByContradiction,
    ],
    propositions: [],
    target: or(lit("I like tea"), not(lit("I like tea"))),
    allowedPropositionTypes: [
      PropositionType.LITERAL,
      PropositionType.NEGATION,
      PropositionType.DISJUNCTION
    ]
  },
  
  {
    name: 'World Complete!',
    description: [
      "That's it for formal contradictions!",
      "If you want a challenge, try out De Morgan's laws.",
      "If you want to learn about terms, functions, and quantifiers, try out first-order logic.",
    ],
    rules: [
      DetectContradiction,
      ProofOfNegation,
      ProofByContradiction,
    ],
    propositions: [],
    target: lit("⊥"),
    allowedPropositionTypes: BASE_TYPES,
  },

];
export default PROPOSITIONAL_LOGIC_CONTRADICTION;
