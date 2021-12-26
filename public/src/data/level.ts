import InferenceRule, {
  DoubleNegationIntroduction,
  DoubleNegationElimination,
  ConjunctionIntroduction,
  ConjunctionElimination,
  DisjunctionIntroduction,
  DisjunctionElimination,
  ConditionalIntroduction,
  ConditionalElimination,
} from './inference_rule.js'
import PropHelper, { Proposition, lit, not, and, or } from './proposition.js'

export default interface Level {
  rules: InferenceRule[],
  propositions: Proposition[],
  target: Proposition,
}

export const LEVELS: Level[] = [
  {
    rules: [ConditionalIntroduction],
    propositions: [
      lit("Adam likes apples"),
      lit("David likes apples"),
      lit("David likes oranges"),
    ],
    target: not(not(lit("David likes apples"))),
  },
  {
    rules: [DoubleNegationIntroduction],
    propositions: [
      lit("It's not sunny"),
      lit("It's raining"),
      not(lit("It's sunny")),
      not(lit("It's not raining")),
    ],
    target: not(not(not(lit("It's sunny")))),
  },
  {
    rules: [
      DoubleNegationElimination,
    ],
    propositions: [
      not(lit("Today is not Sunday")),
      not(not(lit("Today is Sunday"))),
      not(not(not(lit("Tomorrow is Sunday")))),
    ],
    target: lit("Today is Sunday"),
  },
  {
    rules: [
      ConjunctionIntroduction,
    ],
    propositions: [
      lit("I like red"),
      lit("I like green"),
      lit("I like blue"),
    ],
    target: and(lit("I like blue"), lit("I like red")),
  },

  {
    rules: [
      ConjunctionElimination,
    ],
    propositions: [
      not(not(lit("I like green"))),
      lit("I like green and I like blue"),
      and(lit("I like red"), lit("I like green")),
    ],
    target: lit("I like green"),
  },

  {
    rules: [
      DoubleNegationIntroduction,
      DoubleNegationElimination,
      ConjunctionIntroduction,
      ConjunctionElimination,
    ],
    propositions: [
      and(lit("Alice likes apples"), not(not(lit("Alice likes oranges")))),
      not(not(and(lit("Bob likes apples"), lit("Bob likes oranges")))),
    ],
    target: and(lit("Alice likes oranges"), lit("Bob likes oranges")),
  },

  {
    rules: [
      DoubleNegationIntroduction,
      DoubleNegationElimination,
      ConjunctionIntroduction,
      ConjunctionElimination,
      DisjunctionIntroduction,
      DisjunctionElimination,
      ConditionalIntroduction,
      ConditionalElimination,
    ],
    propositions: [
      and(lit("Alice likes apples"), not(not(lit("Alice likes oranges")))),
      not(not(and(lit("Bob likes apples"), lit("Bob likes oranges")))),
    ],
    target: and(lit("Alice likes oranges"), lit("Bob likes oranges")),
  },
]
