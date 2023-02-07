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
    name: 'Rule #1: Formal Contradiction',
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
    name: 'Rule #2: Proof of Negation',
    description: [
      "Usually, to deduce the negation of a proposition, we need two contradictory conditional statments with that proposition as the antecedent.\nThis usually involves using conditional introduction twice, which involves clearing two sublevels.",
      "Instead we can use the proof of negation rule of inference.\nTo deduce the negation of a proposition, you just have to prove that the proposition leads to a formal contradiction, you just need to clear one sublevel.",
      "The idea behing proof of negation is that if you're able to deduce a formal contradiction, then you would have been able to deduce contradictory conditionals and then use negation introduction.",
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
    name: 'Proof of Negation Practice (Double Negation Introduction)',
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
    name: 'Proof of Negation Practice (Law Of Noncontradiction)',
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
    name: 'Proof of Negation Practice (Conjunction of Negations)',
    description: [
      "If you want to use negation introduction to prove the target, you need to know which contradiciton you want to expose ahead of time.\nBut if you use proof of negation, you can get started right away.\nYou can set the proposition to \"(I like tea) ∨ (I like coffee)\" and figure out the contradiciton along the way.",
    ],
    rules: [
      ConjunctionElimination,
      ConditionalIntroduction,
      DisjunctionElimination,
      NegationElimination,
      NegationIntroduction,
      DetectContradiction,
      ProofOfNegation,
    ],
    propositions: [
      and(not(lit("I like tea")), not(lit("I like coffee"))),
    ],
    target: not(or(lit("I like tea"), lit("I like coffee"))),
    allowedPropositionTypes: BASE_TYPES,
  },

  {
    name: 'Proof of Negation Practice (Negation of Disjunction)',
    description: [
      "Negation of disjunction into conjunction of negations: If it's not true that you like one or the other, then you dislike like both.",
      "Try using proof of negation to prove both ¬(I like tea) and ¬(I like coffee) individually.",
    ],
    rules: [
      ConjunctionIntroduction,
      DisjunctionIntroduction,
      DetectContradiction,
      ProofOfNegation,
    ],
    propositions: [
      not(or(lit("I like tea"), lit("I like coffee"))),
    ],
    target: and(not(lit("I like tea")), not(lit("I like coffee"))),
    allowedPropositionTypes: BASE_TYPES,
  },

  
  {
    name: 'Proof of Negation Practice (Disjunction of Negations)',
    description: [
      "Disjunction of negations into negation of conjunction: If you dislike one or the other, then it's not true that you like both."
    ],
    rules: [
      ConjunctionElimination,
      ConditionalIntroduction,
      DisjunctionElimination,
      DetectContradiction,
      ProofOfNegation,
    ],
    propositions: [
      or(not(lit("I like tea")), not(lit("I like coffee"))),
    ],
    target: not(and(lit("I like tea"), lit("I like coffee"))),
    allowedPropositionTypes: BASE_TYPES,
  },


  {
    name: 'Rule #3: Proof by Contradiction',
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
    name: 'Practice Proof by Contradiction (Negation of Conjunction)',
    description: [
      "Negation of conjunction into disjunction of negations: If it's not true that you like both, then you dislike one or the other."
    ],
    hints: [
      "Start off with a proof by contradiction with \"(¬(I like tea)) ∨ (¬(I like coffee))\" as your proposition.",
      "Within your proof by contradiction, start another proof by contradiction to deduce \"I like tea\". Do the same to deduce \"I like coffee\".",
      "Once you have \"I like tea\" and \"I like coffe\", combine them with conjunction introduciton and notice the contradiction with \"¬((I like tea) ∧ (I like coffee))\".",
    ],
    rules: [
      ConjunctionIntroduction,
      DisjunctionIntroduction,
      DetectContradiction,
      ProofByContradiction,
    ],
    propositions: [
      not(and(lit("I like tea"), lit("I like coffee"))),
    ],
    target: or(not(lit("I like tea")), not(lit("I like coffee"))),
    allowedPropositionTypes: BASE_TYPES,
  },

];
export default PROPOSITIONAL_LOGIC_CONTRADICTION;
