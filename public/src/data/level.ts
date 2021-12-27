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
import PropHelper, { Proposition, lit, not, and, or, then } from './proposition.js'

export default interface Level {
  name: string,
  rules: InferenceRule[],
  propositions: Proposition[],
  target: Proposition,
}

export const LEVELS: Level[] = [
  {
    name: 'New Rule: Double Negation Introduction',
    rules: [DoubleNegationIntroduction],
    propositions: [
      lit("Adam likes apples"),
      lit("David likes apples"),
      lit("David likes oranges"),
    ],
    target: not(not(lit("David likes apples"))),
  },
  {
    name: 'New Rule: Double Negation Elimination',
    rules: [DoubleNegationElimination],
    propositions: [
      not(lit("Today is not Sunday")),
      not(not(lit("Today is Sunday"))),
      not(not(not(lit("Tomorrow is Sunday")))),
    ],
    target: lit("Today is Sunday"),
  },
  {
    name: 'New Rule: Conjunction Introduction',
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
    name: 'New Rule: Conjunction Elimination',
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
    name: 'Test 1',
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
    name: 'New Rule: Conditional Introduction',
    rules: [ConditionalIntroduction],
    propositions: [
      lit("It is cold"),
      lit("It is rainy")
    ],
    target: then(lit("It is windy"), and(lit("It is cold"), lit("It is windy"))),
  },

  {
    name: 'New Rule: Conditional Elimination',
    rules: [ConditionalElimination],
    propositions: [
      then(lit("It is breakfast"), lit("I drink orange juice")),
      then(lit("It is lunch"), lit("I drink water")),
      then(lit("It is dinner"), lit("I drink water")),
      lit('It is breakfast'),
    ],
    target: lit('I drink orange juice'),
  },

  {
    name: 'New Rule: Disjunction Introduction',
    rules: [DisjunctionIntroduction],
    propositions: [
      lit("I have tea")
    ],
    target: or(lit("I have coffee"), lit("I have tea")),
  },

  {
    name: 'New Rule: Disjunction Elimination',
    rules: [DisjunctionElimination],
    propositions: [
      then(lit("It is breakfast"), lit("I drink orange juice")),
      then(lit("It is lunch"), lit("I drink water")),
      then(lit("It is dinner"), lit("I drink water")),
      or(lit('It is lunch'), lit('It is dinner')),
    ],
    target: lit('I drink water'),
  },

]
