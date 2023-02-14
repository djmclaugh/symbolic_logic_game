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
  DetectContradiction,
  ProofOfNegation,
  ProofByContradiction,
} from '../inference_rules/propositional_logic_negation.js'

import { lit } from '../predicates/literal.js'
import { not } from '../predicates/negation.js'
import { and } from '../predicates/conjunction.js'
import { or } from '../predicates/disjunction.js'
import { iff } from '../predicates/biconditional.js'
import { PropositionType } from '../propositions/propositions.js'

const ALL_RULES = [
  ConjunctionIntroduction,
  ConjunctionElimination,
  ConditionalIntroduction,
  ConditionalElimination,
  DisjunctionIntroduction,
  DisjunctionElimination,
  NegationIntroduction,
  NegationElimination,
  BiconditionalIntroduction,
  BiconditionalElimination,
  DoubleNegationElimination,
  DetectContradiction,
  ProofOfNegation,
  ProofByContradiction,
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
    name: 'Negation of Disjunction',
    description: [
      "In these two levels, you'll prove both De Morgan's laws.",
      "All assumed inference rules seen so far will be available (but you probably won't need them all them).\nIt's up to you to figure out which ones are useful for each level.",
      "These levels are much trickier than the previous ones!",
      "This law is basically saying that \"it's not true that there's at least one you like\" is equivalent to \"You dislike both\".",
    ],
    rules: ALL_RULES,
    propositions: [],
    target: iff(not(or("I like tea", "I like coffee")), and(not("I like tea"), not("I like coffee"))),
    allowedPropositionTypes: BASE_TYPES,
  },

  {
    name: 'Negation of Conjunction',
    description: [
      "This law is basically saying that \"it's not true that you like both\" is equivalent to \"there's at least one you dislike\".",
    ],
    rules: ALL_RULES,
    propositions: [],
    target: iff(not(and("I like tea", "I like coffee")), or(not("I like tea"), not("I like coffee"))),
    allowedPropositionTypes: BASE_TYPES,
  },
  
  {
    name: 'World Complete!',
    description: [
      "That's it for De Morgan's laws!",
      "Try out first-order logic, to learn about terms, functions, and quantifiers.",
    ],
    rules: ALL_RULES,
    propositions: [],
    target: lit("⊥"),
    allowedPropositionTypes: BASE_TYPES,
  },
];
export default PROPOSITIONAL_LOGIC_DEMORGAN;
