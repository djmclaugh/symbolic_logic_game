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

import {
  Necessitation,
  Distribution,
  NecessityDuality,
} from '../inference_rules/modal_logic.js'

import { lit } from '../predicates/literal.js'
import { not } from '../predicates/negation.js'
import { and } from '../predicates/conjunction.js'
import { then } from '../predicates/conditional.js'
import { or } from '../predicates/disjunction.js'
import { must } from '../predicates/box.js'
import { can } from '../predicates/diamond.js'
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

const MODAL_LOGIC: Level[] = [
  {
    name: 'Introduction to Modal Logic',
    description: [
      "Modal logic is built on top of propositional logic.\nAll inference rules (assumed and derived) will be taken for granted.",
      "I highly recommend you complete the propositional logic levels first.",
    ],
    rules: [
      ConditionalElimination,
    ],
    propositions: [
      then(must(lit("Alice is in North America")), can(lit("Alice is in Canada"))),
      must(lit("Alice is in North America")),
    ],
    target: can(lit("Alice is in Canada")),
  },

  {
    name: 'Modal Operators',
    description: [
      "Most modal logics add two new logical symbols on top of propositional logic: □ (box) and ◇ (diamond).\nThe idea behind those symbols is to introduce modality of some sort to propositions, similarly to how modal verbs work.",
      "For example, consider the differences between the following sentences:\nI eat breakfast.\nI must eat breakfast.\nI can eat breakfast.",
      "There are many different modal logics and the exact idea behind the □ and ◇ symbols will depend on what kind of modality we'd like to model.\nHere are the most popular:",
      "Alethic Logic: □ is inspired by \"it's necessary that ___\" and ◇ is inspired by \"it's possible that ___\".",
      "Deontic Logic:  □ is inspired by \"it's morally required that ___\" and ◇ is inspired by \"it's morally allowed that ___\".",
      "Epistemic/Doxastic Logic: □ is inspired by \"it's known/believed to be true that ___\" and ◇ is inspired by \"it's known/believed to be possible that ___\".",
      "Temporal Logic: □ is inspired by \"it will always be true that ___\" and ◇ is inspired by \"it will be true at some point that ___\".",
      "Depending on what we want to model, the inference rules we choose will be different.\nHowever, in most modal logics, □ and ◇ are duals of each other in the following sense:\n□(𝑃) is equivalent to ¬(◇(¬(𝑃))).",
      "For example, saying \"it's morally required to follow the law\" is the same as saying \"it's not morally allowed to not follow the law\".\nSimilarly, saying \"it will always be true that I love you\" is the same as saying \"it will not be true at any point that I won't love you\".",
      "In this level, you'll assume what can arguably be translated as \"it's possible that it doesn't rain tomorrow\" and you'll try to prove what can arguably be translated as \"it's not necessary that it rains tomorrow\".",
    ],
    rules: [
      NecessityDuality,
      DetectContradiction,
      ProofOfNegation,
    ],
    propositions: [
      can(not(lit("It will rain tomorrow"))),
    ],
    target: not(must(lit("It will rain tomorrow"))),
    allowedPropositionTypes: [
      PropositionType.LITERAL,
      PropositionType.NECESSITY,
    ],
  },
  
  {
    name: 'Rule #2: Proof of Negation',
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
    name: 'Conjunction of Negations',
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
    name: 'Negation of Disjunction',
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
    name: 'Disjunction of Negations',
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
    name: 'Negation of Conjunction',
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
  
  {
    name: 'World Complete!',
    description: [
      "That's it for formal contradictions!",
      "Try out first-order logic next to learn about terms, functions, and quantifiers",
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
export default MODAL_LOGIC;
