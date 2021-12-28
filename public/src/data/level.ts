import InferenceRule, {
  DoubleNegationIntroduction,
  DoubleNegationElimination,
  NegationIntroduction,
  NegationElimination,
  ConjunctionIntroduction,
  ConjunctionElimination,
  DisjunctionIntroduction,
  DisjunctionElimination,
  ConditionalIntroduction,
  ConditionalElimination,
  HypotheticalSyllogism,
  SelfConditional,
  ConditionalFromConsequent,
} from './inference_rule.js'
import PropHelper, { Proposition, lit, not, and, or, then } from './proposition.js'

export default interface Level {
  name: string,
  description?: string[],
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
    name: 'New Base Rule: Conditional Introduction',
    rules: [
      ConditionalIntroduction,
      ConjunctionIntroduction,
    ],
    propositions: [
      lit("It is cold"),
      lit("It is rainy")
    ],
    target: then(lit("It is windy"), and(lit("It is cold"), lit("It is windy"))),
  },

  {
    name: 'New Base Rule: Conditional Elimination',
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
    name: 'Prove Derived Rule: Hypothetical Syllogism',
    rules: [ConditionalIntroduction, ConditionalElimination],
    propositions: [
      then(lit("I go to bed late"), lit("I wake up late")),
      then(lit("I wake up late"), lit("I get to work late")),
    ],
    target: then(lit("I go to bed late"), lit("I get to work late")),
  },

  {
    name: 'New Base Rule: Disjunction Introduction',
    rules: [DisjunctionIntroduction],
    propositions: [
      lit("I have tea")
    ],
    target: or(lit("I have coffee"), lit("I have tea")),
  },

  {
    name: 'New Base Rule: Disjunction Elimination',
    rules: [DisjunctionElimination],
    propositions: [
      then(lit("It is breakfast"), lit("I drink orange juice")),
      then(lit("It is lunch"), lit("I drink water")),
      then(lit("It is dinner"), lit("I drink water")),
      or(lit('It is lunch'), lit('It is dinner')),
    ],
    target: lit('I drink water'),
  },

  {
    name: 'New Base Rule: Negation Introduction',
    rules: [HypotheticalSyllogism, NegationIntroduction],
    propositions: [
      then(lit('Socrates is an immortal man'), lit('Socrates is a man')),
      then(lit('Socrates is a man'), lit('Socrates is mortal')),
      then(lit('Socrates is an immortal man'), not(lit('Socrates is mortal'))),
    ],
    target: not(lit('Socrates is an immortal man')),
  },

  {
    name: 'Prove Derived Rule: Modus Tollens',
    rules: [ConditionalIntroduction, NegationIntroduction],
    propositions: [
      then(lit("I go to bed late"), lit("I wake up late")),
      not(lit("I wake up late")),
    ],
    target: not(lit("I go to bed late")),
  },

  {
    name: 'Prove Derived Rule: Conjunction Tautology',
    rules: [ConjunctionIntroduction],
    propositions: [
      lit("I like apples"),
    ],
    target: and(lit("I like apples"), lit("I like apples")),
  },

  {
    name: 'Prove Derived Rule: Self Conditional',
    rules: [ConditionalIntroduction],
    propositions: [],
    target: then(lit("I like apples"), lit("I like apples")),
  },

  {
    name: 'Prove Derived Rule: Disjunction Tautology',
    rules: [DisjunctionElimination, SelfConditional],
    propositions: [
      or(lit("I like apples"), lit("I like apples"))
    ],
    target: lit("I like apples"),
  },

  {
    name: 'Prove Derived Rule: Conditional From Consequent',
    rules: [ConditionalIntroduction],
    propositions: [
      lit("I like apples")
    ],
    target: then(lit("It's raining"), lit("I like apples")),
  },

  {
    name: 'Prove Derived Rule: Conjunction Tautology',
    rules: [ConjunctionIntroduction],
    propositions: [
      lit("I like apples"),
    ],
    target: and(lit("I like apples"), lit("I like apples")),
  },

  {
    name: 'Prove Derived Rule: Disjunctive Syllogism',
    rules: [SelfConditional, NegationElimination, DisjunctionElimination],
    propositions: [
      or(lit("I like oranges"), lit("I like apples")),
      not(lit("I like apples")),
    ],
    target: lit("I like oranges"),
  },

  {
    name: 'Prove Derived Rule: Double Negation Introduction',
    rules: [ConditionalIntroduction, NegationIntroduction],
    propositions: [
      lit("I like apples"),
    ],
    target: not(not(lit("I like apples"))),
  },

  {
    name: 'Prove Derived Rule: Conjunction Commutation',
    rules: [ConjunctionIntroduction, ConjunctionElimination],
    propositions: [
      and(lit("I like apples"), lit("I like oranges")),
    ],
    target: and(lit("I like oranges"), lit("I like apples")),
  },

  {
    name: 'Prove Derived Rule: Disjunction Commutation',
    rules: [DisjunctionIntroduction, DisjunctionElimination, ConditionalIntroduction],
    propositions: [
      or(lit("I like apples"), lit("I like oranges")),
    ],
    target: or(lit("I like oranges"), lit("I like apples")),
  },

  {
    name: 'Prove Derived Rule: Conjunction Association',
    rules: [ConjunctionIntroduction, ConjunctionElimination],
    propositions: [
      and(lit("I like apples"), and(lit("I like bananas"), lit("I like oranges"))),
    ],
    target: and(and(lit("I like apples"), lit("I like bananas")), lit("I like oranges")),
  },

  {
    name: 'Prove Derived Rule: Disjunction Association',
    rules: [DisjunctionIntroduction, DisjunctionElimination, ConditionalIntroduction],
    propositions: [
      or(lit("It's red"), or(lit("It's green"), lit("It's blue"))),
    ],
    target: or(or(lit("It's red"), lit("It's green")), lit("It's blue")),
  },

  {
    name: 'Prove Derived Rule: Conjunction Distribution',
    rules: [ConjunctionIntroduction, ConjunctionElimination, DisjunctionIntroduction, DisjunctionElimination, ConditionalIntroduction],
    propositions: [
      and(lit("I eat toast"), or(lit("I drink juice"), lit("I drink milk"))),
    ],
    target: or(and(lit("I eat toast"), lit("I drink juice")), and(lit("I eat toast"), lit("I drink milk"))),
  },

  {
    name: 'Prove Derived Rule: Disjunction Distribution',
    rules: [ConjunctionIntroduction, ConjunctionElimination, DisjunctionIntroduction, DisjunctionElimination, ConditionalIntroduction],
    propositions: [
      or(lit("I'll have pasta"), and(lit("I'll have soup"), lit("I'll have salad"))),
    ],
    target: and(or(lit("I'll have pasta"), lit("I'll have soup")), or(lit("I'll have pasta"), lit("I'll have salad"))),
  },

  {
    name: 'Prove Derived Rule: Constructive Dilemma',
    rules: [DisjunctionIntroduction, DisjunctionElimination, ConditionalIntroduction, HypotheticalSyllogism],
    propositions: [
      then(lit("It's breakfast"), lit("I drink coffee")),
      then(lit("It's lunch"), lit("I drink water")),
      or(lit("It's breakfast"), lit("It's lunch")),
    ],
    target: or(lit("I drink coffee"), lit("I drink water")),
  },
]
