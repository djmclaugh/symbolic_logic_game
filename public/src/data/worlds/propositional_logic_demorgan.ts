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

import { lit } from '../predicates/literal.js'
import { not } from '../predicates/negation.js'
import { and } from '../predicates/conjunction.js'
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

const PROPOSITIONAL_LOGIC_DEMORGAN: Level[] = [
  {
    name: 'Conjunction of Negations',
    description: [
      "In this world, you'll prove both De Morgan's laws (in both directions).",
      "All nine base inference rules will be available, but you won't need them all for each level.\nIt's up to you to figure out which ones are usefull for each level.",
      "These levels are trickier than the previous ones.\nYou'll need to be comfortable with setting up negation introduction arguments.",
      "Conjunction of negations into negation of disjunction: If you dislike both, then it's not true that you like one or the other.",
    ],
    rules: ALL_BASE_RULES,
    propositions: [
      and(not(lit("I like tea")), not(lit("I like coffee"))),
    ],
    target: not(or(lit("I like tea"), lit("I like coffee"))),
    allowedPropositionTypes: BASE_TYPES,
  },

  {
    name: 'Negation of Disjunction',
    description: [
      "Negation of disjunction into conjunction of negations: If it's not true that you like one or the other, then you dislike like both."
    ],
    rules: ALL_BASE_RULES,
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
    rules: ALL_BASE_RULES,
    propositions: [
      or(not(lit("I like tea")), not(lit("I like coffee"))),
    ],
    target: not(and(lit("I like tea"), lit("I like coffee"))),
    allowedPropositionTypes: BASE_TYPES,
  },

  {
    name: 'Negation of Conjunction',
    description: [
      "Negation of conjunction into disjunction of negations: If it's not true that you like both, then you dislike one or the other."
    ],
    hints: [
      "First try to get (I like tea) ∨ (¬(I like tea)) in your bank.\nIf you forgot how to do that, retry the Law of Excluded Middle level in the first propositional logic world.",
      "Try to deduce \"(I like tea) → ¬(I like coffee)\".",
    ],
    rules: ALL_BASE_RULES,
    propositions: [
      not(and(lit("I like tea"), lit("I like coffee"))),
    ],
    target: or(not(lit("I like tea")), not(lit("I like coffee"))),
    allowedPropositionTypes: BASE_TYPES,
  },
];
export default PROPOSITIONAL_LOGIC_DEMORGAN;
