import Level from '../level.js'
import {
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
} from '../inference_rule.js'
import { lit, not, and, or, then } from '../proposition.js'

const NATURAL_DEDUCTION_SYSTEM: Level[] = [
  {
    name: "Propositional Logic Introduction",
    description: [
      "Each level starts with a list of assumptions that are added to your proposition bank, a list of inference rules (in this level however, the list is empty), and a target proposition.",
      "The goal of each level is to have the target proposition inside of your proposition bank.",
      "In this level, we already start with the target proposition in our bank, so we already won! Click the \"Go to next level\" button to proceed."
    ],
    rules: [],
    propositions: [
      lit("Hello world!"),
    ],
    target: lit("Hello world!"),
  },
  {
    name: "Rule #1: Conjunction Introduction",
    description: [
      "The last level was too easy. From now on, you won't start with the target proposition already in your bank. You'll have to create the target proposition yourself by using the allowed inference rules.",
      "For this level you are only given conjunction introduction. It says that you can take any two propositions from your bank and combine them by putting a \"∧\" in between.",
      "The behaviour of the \"∧\" symbol is inspired by the word \"and\". The idea is for \"(𝐿) ∧ (𝑅)\" to mean that both 𝐿 and 𝑅 are true. But remember, we're doing symbolic logic; Any meaning we give to the symbols is only for our own intuition. At the end of the day, only the inference rule matters.",
      "Note: This rule is one of the 9 rules taken for granted under the \"natural deduction\" way of defining of propositional logic.",
      "Note: Again, remember we're doing symbolic logic. You have to create the target proposition EXACTLY. It has to be the exact same sequence of symbols. You can use copy/paste and ctrl-f to convince yourself whether or not the target proposition is in the proposition bank.",
    ],
    rules: [ ConjunctionIntroduction ],
    propositions: [
      lit("I like red"),
      lit("I like green"),
      lit("I like blue"),
    ],
    target: and(lit("I like blue"), lit("I like red")),
  },
  {
    name: "Rule #2: Conjunction Elimination",
    description: [
      "For this level you are given \"conjunction elimination\" which is also called \"simplification\". It says that if you have the \"∧\" symbol in a proposition and that it's not within parentheses, the you can make the proposition that consists of just what's on the left or just what's on the right.",
      "This rule is conjunction introduction's counterpart.",
      "Note: This rule is also one of the 9 rules taken for granted.",
    ],
    rules: [ ConjunctionElimination ],
    propositions: [
      and(lit("I like apples"), lit("I like oranges")),
    ],
    target: lit("I like oranges"),
  },
  {
    name: "Conjunction Test",
    description: [
      "Let's see if you can use the two conjunction rules to clear this level.",
    ],
    rules: [ ConjunctionIntroduction, ConjunctionElimination ],
    propositions: [
      and(lit("Alice likes apples"), lit("Alice likes oranges")),
      and(lit("Bob likes apples"), lit("Bob likes oranges")),
    ],
    target: and(lit("Alice likes oranges"), lit("Bob likes oranges")),
  },

  {
    name: 'Prove Derived Rule: Conjunction Commutation',
    description: [
      "From the rules that are taken for granted, we can derive new rules.",
      "Here we'll derive a rule that tells us that conjunction is commutative. In other words, that we can swap the left and right sides of a conjunction as we please.",
    ],
    rules: [ConjunctionIntroduction, ConjunctionElimination],
    propositions: [
      and(lit("I'll have toast"), lit("I'll have juice")),
    ],
    target: and(lit("I'll have juice"), lit("I'll have toast")),
  },

  {
    name: 'Prove Derived Rule: Conjunction Association',
    description: [
      "Here we'll derive a rule that tells us that conjunction is associative. In other words, it doesn't matter in what order we do the conjunction.",
      "Note: Because conjunction is associative, in real life, people will write \"𝑃 ∧ 𝑄 ∧ 𝑅\" instead of \"(𝑃 ∧ 𝑄) ∧ 𝑅\" or \"𝑃 ∧ (𝑄 ∧ 𝑅)\"."
    ],
    rules: [ConjunctionIntroduction, ConjunctionElimination],
    propositions: [
      and(lit("I like apples"), and(lit("I like bananas"), lit("I like oranges"))),
    ],
    target: and(and(lit("I like apples"), lit("I like bananas")), lit("I like oranges")),
  },

  {
    name: 'Rule #3: Conditional Introduction',
    description: [
      "This rule is the most complicated but the most useful of the 9 rules taken for granted.",
      "This rule says that if you can \"prove\" 𝑄 by assuming 𝑃, then you can add \"(𝑃) → (𝑄)\" to your proposition bank.",
      "To \"prove\" 𝑄, all you have to do is beat the sublevel where the 𝑄 is the target proposition.",
      "The behaviour of the \"→\" symbol is inspired by the word \"implies\". The idea is for \"(𝑃) → (𝑄)\" to mean that whenever 𝑃 is true, then 𝑄 must be true as well. But remember, we're doing symbolic logic; Any meaning we give to the symbols is only for our own intuition. At the end of the day, only the inference rules matter.",
    ],
    rules: [ConjunctionIntroduction, ConditionalIntroduction],
    propositions: [
      lit("I like peanut butter"),
    ],
    target: then(lit("I like jam"), and(lit("I like peanut butter"), lit("I like jam"))),
  },

  {
    name: 'Conditional Tautology',
    description: [
      "Using conditional introduction, we can prove our first tautology.",
      "A tautology is just a proposition that can be created with an empty proposition bank.",
    ],
    rules: [ConditionalIntroduction],
    propositions: [],
    target: then(lit("I'm sleeping"), lit("I'm sleeping")),
  },

  {
    name: 'Rule #4: Conditional Elimination',
    description: [
      "Conditional elimination (also called modus ponens) is one of the 9 rules taken for granted. It's the counter part of conditional introduction.",
      "It says that if you have a conditional and you have it's left side (also called its antecedent), then you can have the conditional's right side (also called its consequent).",
    ],
    rules: [ConditionalElimination],
    propositions: [
      lit("Socrates is a man"),
      then(lit("Socrates is a man"), lit("Socrates is mortal")),
    ],
    target: lit("Socrates is mortal"),
  },
  {
    name: 'Conditional Test',
    description: [
      "Let's see if you can use the rules you learned so far to clear this level.",
    ],
    rules: [ConjunctionIntroduction, ConjunctionElimination, ConditionalIntroduction, ConditionalElimination],
    propositions: [
      lit("It is Sunday"),
      then(and(lit("It's breakfast time"), lit("It is Sunday")), lit("I drink coffee")),
    ],
    target: then(lit("It's breakfast time"), lit("I drink coffee")),
  },
  {
    name: 'Prove Derived Rule: Hypothetical Syllogism',
    description: [
      "Here we'll derive a rule that tells us that conditionals can be chained together.",
    ],
    rules: [ConditionalIntroduction, ConditionalElimination],
    propositions: [
      then(lit("I go to bed late"), lit("I wake up late")),
      then(lit("I wake up late"), lit("I get to work late")),
    ],
    target: then(lit("I go to bed late"), lit("I get to work late")),
  },
  {
    name: "Rule #5: Disjunction Introduction",
    description: [
      "For this level you are only given disjunction introduction (also called addition). It says that you can add a proposition from your bank with any proposition whatsoever (even if they are unrelated) by putting a \"∨\" in between.",
      "The behaviour of the \"∨\" symbol is inspired by the word \"or\". The idea is for \"(𝐿) ∨ (𝑅)\" to mean that at least one of 𝐿 or 𝑅 are true. But remember, we're doing symbolic logic; Any meaning we give to the symbols is only for our own intuition. At the end of the day, only the inference rule matters.",
    ],
    rules: [ DisjunctionIntroduction ],
    propositions: [
      lit("I like apples"),
    ],
    target: or(lit("It's Sunday"), lit("I like apples")),
  },
  {
    name: "Rule #6: Disjunction Elimination",
    description: [
      "This rule is the counterpart of disjunction introduction. It says that if both sides of a disjunction imply the same thing, then that thing can be added to your proposition bank.",
      "This rule is also called \"case analysis\" because the intuition behind it is that we look at both cases."
    ],
    rules: [ DisjunctionElimination ],
    propositions: [
      then(lit("It's breakfast"), lit("I drink coffee")),
      then(lit("It's lunch"), lit("I drink water")),
      then(lit("It's dinner"), lit("I drink water")),
      or(lit("It's lunch"), lit("It's dinner")),
    ],
    target: lit("I drink water"),
  },
  {
    name: 'Prove Derived Rule: Constructive Dilemma',
    description: [
      "",
    ],
    rules: [ConditionalIntroduction, ConditionalElimination, DisjunctionIntroduction, DisjunctionElimination],
    propositions: [
      then(lit("It's breakfast"), lit("I drink coffee")),
      then(lit("It's lunch"), lit("I drink water")),
      or(lit("It's breakfast"), lit("It's lunch")),
    ],
    target: or(lit("I drink coffee"), lit("I drink water")),
  },
  {
    name: 'Rule #7: Negation Introduction',
    description: [
      "This rule says that if a proposition implies contradictory propositions, then the negation of the original proposition can be added to your proposition bank.",
      "The behaviour of the \"¬\" symbol is inspired by the word \"not\". The idea is for \"¬(𝑃)\" to mean that 𝑃 is not true. But remember, we're doing symbolic logic; Any meaning we give to the symbols is only for our own intuition. At the end of the day, only the inference rule matters.",
      "Note: You can use the hypothetical syllogism inference rule if you want instead of using conditional introduction and elimination."
    ],
    rules: [ConditionalIntroduction, ConditionalElimination, NegationIntroduction, HypotheticalSyllogism],
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
    name: 'Prove Derived Rule: Double Negation Introduction',
    rules: [ConditionalIntroduction, NegationIntroduction],
    propositions: [
      lit("I like apples"),
    ],
    target: not(not(lit("I like apples"))),
  },
  {
    name: 'Rule #8: Negation Elimination',
    description: [
      "This rule says that if you have the negation of a proposition, then you can add that this proposition implies anything.",
      "This rule might seem weird, but the idea behind it is that if you know that 𝑃 is false, then whenever 𝑃 is true (which is never), anything is possible.",
    ],
    rules: [NegationElimination],
    propositions: [
      not(lit('Pigs fly')),
    ],
    target: then(lit('Pigs fly'), lit('Hell freezes over')),
  },
  {
    name: 'Prove Derived Rule: Disjunctive Syllogism',
    description: [
      "Note: This rule is sometimes taken for granted instead of negation elimination. But from either you can prove the other, so it ends up not mattering which of the two you take for granted.",
    ],
    rules: [ConditionalIntroduction, DisjunctionElimination, NegationElimination],
    propositions: [
      or(lit("I like apples"), lit("I like oranges")),
      not(lit("I like apples")),
    ],
    target: lit("I like oranges"),
  },
  {
    name: 'Rule #9: Double Negation Elimination',
    description: [
      "This is the last of the rules taken for granted.",
      "Note: We were able to prove double negation introduction from the other rules, but we can't prove double negation elimination! We have to take it for granted if we want to use it.",
    ],
    rules: [DoubleNegationElimination],
    propositions: [
      not(not(lit('I like apples'))),
    ],
    target: lit('I like apples'),
  },
  {
    name: 'Impossible : Double Negation Elimination From Other Base Rules',
    description: [
      "If you want, you can try to prove double negation elimination by only using the 8 other base rules.",
      "Note: This is impossible and you should only attempt this if you are curious about what makes it impossible.",
      "Note: Propositional logic is not the only formal logic! If you chose to not include double negation elimination in the inference rules taken for granted, you get intuitionistic logic.",
    ],
    rules: [
      ConjunctionIntroduction,
      ConjunctionElimination,
      ConditionalIntroduction,
      ConditionalElimination,
      DisjunctionIntroduction,
      DisjunctionElimination,
      NegationIntroduction,
      NegationElimination,
    ],
    propositions: [
      not(not(lit('I like apples'))),
    ],
    target: lit('I like apples'),
  },
];
export default NATURAL_DEDUCTION_SYSTEM;
