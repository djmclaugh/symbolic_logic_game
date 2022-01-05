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
  SelfConditional,
  DoubleNegationIntroduction,
  ConjunctionCommutation,
  ConjunctionAssociation,
  DisjunctionCommutation,
  HypotheticalSyllogism,
  ConstructiveDelimma,
  LawOfExcludedMiddle,
  DisjunctiveSyllogism,
  ModusTollens,
} from '../inference_rules/propositional_logic_derived.js'

import { lit, not, and, or, then } from '../propositions/propositions.js'

const NATURAL_DEDUCTION_SYSTEM: Level[] = [
  {
    name: "Propositional Logic Introduction",
    description: [
      "In this game you'll learn propositional logic, the most common formal logic.",
      "The goal of each level is to have an EXACT copy of the target proposition in your proposition bank.",
      "For this first level, we already start with the target proposition in our bank, so we already won! Click the \"Go to next level\" button to proceed.",
      "Note: \"Formal logic\" and \"symbolic logic\" are synonyms.",
      "Note: \"Propositional logic\", \"propositional calculus\", and \"zeroth-order logic\" are all synonyms.",
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
      "The last level was too easy. From now on, you won't start with the target proposition already in your bank. You'll have to create the target proposition yourself.",
      "You can create new propositions by using the inference rules provided to you. Each rule has specific requirements, make sure you read them carefully!",
      "For this level you are only given conjunction introduction. It says that you can take any two propositions from your bank and combine them by putting a \"∧\" in between.",
      "The behaviour of the conjunction symbol (∧) is inspired by the word \"and\". The idea is for \"(𝐿) ∧ (𝑅)\" to mean that both 𝐿 and 𝑅 are true.",
      "Remember, we're doing symbolic logic. You need to make an EXACT copy of the target proposition. It has to be the EXACT same sequence of symbols.",
      "\"1+2\" is not the same as \"2+1\"; The symbols are not in the same order.",
      "\"hello\" is not the same as \"Hello\"; \"h\" is a different symbol than \"H\".",
      "\"x = 2\" is not the same as \"𝑥 = 2\"; \"x\" is a different symbol than \"𝑥\".",
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
      "For this level you are given conjunction elimination (conjunction introduction's counterpart).",
      "This inference rule is also called \"simplification\".",
      "It says that if you have the \"∧\" symbol in a proposition and that the \"∧\" is not within parentheses, then you can make the proposition that consists of just what's on the left or just what's on the right.",
      "The idea behind conjunction elimination is that if the left and right sides of the \"∧\" are true together, then either should be true by itself.",
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
      "It's up to you to figure out how, in what order, and how many times to use each of the rules.",
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
      "Conjunction introduction/elimination are 2 of the 9 rules taken for granted. They are the only rules about conjunctions.",
      "However, from these 2 rules we can derive many other rules!",
      "Here we'll derive a rule that tells us that conjunction is commutative. In other words, that we can swap the left and right sides of a conjunction as we please.",
      "Note: After beating this level, you'll have access to the conjunction commutation rule. Since it's a derived rule, you'll never *need* to use it, but it might be more practical than using the base rules in some situations."
    ],
    rules: [ConjunctionIntroduction, ConjunctionElimination],
    propositions: [
      and(lit("I like red"), lit("I like blue")),
    ],
    target: and(lit("I like blue"), lit("I like red")),
  },

  {
    name: 'Prove Derived Rule: Conjunction Association',
    description: [
      "Here we'll derive a rule that tells us that conjunction is associative. In other words, we can rearange how the conjunctions are grouped.",
      "Note: Because conjunction is associative, in real life, people will write \"𝑃 ∧ 𝑄 ∧ 𝑅\" instead of \"(𝑃 ∧ 𝑄) ∧ 𝑅\" or \"𝑃 ∧ (𝑄 ∧ 𝑅)\", just like like people write \"2 × 3 × 4\" instead of \"(2 × 3) × 4\" or \"2 × (3 × 4)\".",
      "It's not that \"(𝑃 ∧ 𝑄) ∧ 𝑅\" is the same thing as \"𝑃 ∧ (𝑄 ∧ 𝑅)\". Remember, we're doing symbolic logic. It's just that we can jump from one to the other as we please."
    ],
    rules: [ConjunctionIntroduction, ConjunctionElimination, ConjunctionCommutation],
    propositions: [
      and(lit("I like red"), and(lit("I like green"), lit("I like blue"))),
    ],
    target: and(and(lit("I like red"), lit("I like green")), lit("I like blue")),
  },

  {
    name: 'Conjunction Practice',
    description: [
      "Note: If you feel comfortable with conjunctions, feel free to skip to the next level.",
      "Note: If you feel that the derived rules aren't that practical, it's because they aren't. In this case, the base rules are usually more convenient. The future derived rules are going to be a lot more helpful.",
      "Hint: If you ever have a conjunction in your proposition bank, it's usually a good idea to take it appart with conjunction elimination.",
      "Hint: If you ever have a conjunction as your target, it's usually a good idea to work backwards and try to create each side one at a time (and then finish off the level with conjunction introduction).",
    ],
    rules: [
      ConjunctionIntroduction,
      ConjunctionElimination,
      ConjunctionCommutation,
      ConjunctionAssociation,
    ],
    propositions: [
      and(lit("I ate cereal"), lit("I drank coffee")),
      and(and(lit("I ate soup"), lit("I ate salad")), lit("I drank water")),
    ],
    target: and(and(lit("I drank coffee"), lit("I drank water")), and(lit("I ate cereal"), and(lit("I ate soup"), lit("I ate salad")))),
  },

  {
    name: 'Rule #3: Conditional Elimination',
    description: [
      "Time for a new rule and a new logical symbol.",
      "The behaviour of the conditional (→) symbol is inspired by the word \"implies\". The idea is for \"(𝑃) → (𝑄)\" to mean that whenever 𝑃 is true, then 𝑄 must be true as well.",
      "The first rule about conditionals that we'll see is conditional elimination (also called modus ponens).",
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
    name: 'Conditional Elimination Practice',
    description: [
      "Let's mix in conditional elimination with the other rules we saw.",
    ],
    rules: [
      ConjunctionIntroduction,
      ConjunctionElimination,
      ConjunctionCommutation,
      ConjunctionAssociation,
      ConditionalElimination
    ],
    propositions: [
      then(and(lit("I ate well"), lit("I took the time to unwind")), lit("I will sleep well")),
      lit("I took the time to unwind"),
      and(lit("I ate soup"), lit("I ate salad")),
      then(and(lit("I ate salad"), lit("I ate soup")), lit("I ate well")),
    ],
    target: lit("I will sleep well"),
  },

  {
    name: 'Rule #4: Conditional Introduction',
    description: [
      "This rule is the most complicated but one of the most useful of the 9 base rules.",
      "This rule says that if you can \"prove\" 𝑄 by assuming 𝑃, then you can add \"(𝑃) → (𝑄)\" to your proposition bank.",
      "To \"prove\" 𝑄, all you have to do is beat the level where 𝑃 has been added to the proposition bank and where 𝑄 is the target proposition.",
    ],
    rules: [ConjunctionIntroduction, ConditionalIntroduction, ConditionalElimination],
    propositions: [
      lit("I'm a citizen"),
      then(and(lit("I'm a citizen"), lit("I'm an adult")), lit("I can vote")),
    ],
    target: then(lit("I'm an adult"), lit("I can vote")),
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
    name: 'Prove Derived Rule: Disjunction Commutation',
    rules: [DisjunctionIntroduction, DisjunctionElimination, ConditionalIntroduction],
    description: [
      "Here we'll show that just like conjunctions, disjunctions are commutative. In other words, we'll show that the left and right side of a disjunction can be swapped.",
      "Note: Working with disjunctions is tricker than working with conjuncitons.",
      "Hint: It usually helps to try to work out the solutions backwards. In this case, which inference rule could give you the target proposition? What would that inference rule need in order to give you the target proposition?"
    ],
    propositions: [
      or(lit("I like apples"), lit("I like oranges")),
    ],
    target: or(lit("I like oranges"), lit("I like apples")),
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
    name: 'Prove Derived Rule: Disjunction Association',
    description: [
      "",
    ],
    rules: [ConditionalIntroduction, ConditionalElimination, DisjunctionIntroduction, DisjunctionElimination],
    propositions: [
      or(lit("I like apples"), or(lit("I like bananas"), lit("I like oranges"))),
    ],
    target: or(or(lit("I like apples"), lit("I like bananas")), lit("I like oranges")),
  },

  {
    name: 'Prove Derived Rule: Conjunction Distribution',
    rules: [ConjunctionIntroduction, ConjunctionElimination, ConditionalIntroduction, ConstructiveDelimma],
    description: [
      "Hint: Whenever you have a conjunction, it's almost always a good idea to use conjunction elimination.",
    ],
    propositions: [
      and(lit("I eat toast"), or(lit("I drink juice"), lit("I drink milk"))),
    ],
    target: or(and(lit("I eat toast"), lit("I drink juice")), and(lit("I eat toast"), lit("I drink milk"))),
  },

  {
    name: 'Prove Derived Rule: Disjunction Distribution',
    rules: [ConjunctionIntroduction, ConjunctionElimination, ConditionalIntroduction, DisjunctionIntroduction, DisjunctionElimination,],
    description: [
      "Hint: When the target is a conjunction, it's almost always a good idea to first get each side in the bank and then finish off with conjunction introduction.",
    ],
    propositions: [
      or(lit("I'll have pasta"), and(lit("I'll have soup"), lit("I'll have salad"))),
    ],
    target: and(or(lit("I'll have pasta"), lit("I'll have soup")), or(lit("I'll have pasta"), lit("I'll have salad"))),
  },

  {
    name: 'Rule #7: Negation Introduction',
    description: [
      "This rule says that if a proposition implies both a proposition and that same proposition but with a \"¬\" in front, then the original proposition can be added to your proposition bank with a \"¬\" in front.",
      "The behaviour of the \"¬\" symbol is inspired by the word \"not\". The idea is for \"¬(𝑃)\" to mean that 𝑃 is not true. But remember, we're doing symbolic logic; Any meaning we give to the symbols is only for our own intuition. At the end of the day, only the inference rule matters.",
      "The idea behind negation introduction is that if you manage to prove contradictory results by assuming 𝑃, then you can assume that 𝑃 is not true.",
      "Note: You can use the hypothetical syllogism inference rule that we derived earlier (it will take fewer steps than using conditional introduction and elimination from scratch)."
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
    description: [
      "Modus tollens is very similar to modus ponens (conditional elimination).",
      "With modus ponens, if you know that the antecedent is true, then you can infer that the consequent is also true.",
      "With modus tollens, if you know that the consequent is not true, then you can infer that the antecedent is also not true."
    ],
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
    name: 'Prove Derived Rule: Self Contradiction',
    rules: [SelfConditional, NegationIntroduction],
    description: [
      "In this level we show that if something implies it's own negation, then we can assume it's negation.",
    ],
    propositions: [
      then(lit("I'll go tomorrow"), not(lit("I'll go tomorrow"))),
    ],
    target: not(lit("I'll go tomorrow")),
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
    name: 'Impossible: Double Negation Elimination From Other Base Rules',
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
  {
    name: 'Prove Tautology: Law Of Noncontradiction',
    description: [
      "A thing cannot be true and false at the same time."
    ],
    rules: [
      ConjunctionElimination,
      ConditionalIntroduction,
      NegationIntroduction,
    ],
    propositions: [],
    target: not(and(lit("I'm here"), not(lit("I'm here")))),
  },
  {
    name: 'Prove Tautology: Law Of Excluded Middle',
    description: [
      "A thing HAS to be either true or false.",
      "Note: This law ends up being equivalent to double negation elimination. So we actually do not have this law in intuitionistic logic since that logic doesn't use double negation elimination.",
    ],
    rules: [
      ConditionalIntroduction,
      DisjunctionIntroduction,
      NegationIntroduction,
      DoubleNegationElimination,
      ModusTollens,
    ],
    propositions: [],
    target: or(lit("I'm here"), not(lit("I'm here"))),
  },

  {
    name: 'Prove Derived Rule: Material Implication (Disjunction to Conditional)',
    description: [],
    rules: [
      ConditionalIntroduction,
      DisjunctiveSyllogism,
      DoubleNegationIntroduction,
    ],
    propositions: [
      or(not(lit("It's raining")), lit("The ground is wet")),
    ],
    target: then(lit("It's raining"), lit("The ground is wet")),
  },

  {
    name: 'Prove Derived Rule: Material Implication (Conditional to Disjunction)',
    description: [],
    rules: [
      ConditionalIntroduction,
      DisjunctionCommutation,
      ConstructiveDelimma,
      LawOfExcludedMiddle,
    ],
    propositions: [
      then(lit("It's raining"), lit("The ground is wet")),
    ],
    target: or(not(lit("It's raining")), lit("The ground is wet")),
  },

  {
    name: 'Prove Derived Rule: Transposition (Contrapositive)',
    description: [],
    rules: [
      ConditionalIntroduction,
      ModusTollens,
    ],
    propositions: [
      then(lit("It's raining"), lit("The ground is wet")),
    ],
    target: then(not(lit("The ground is wet")), not(lit("It's raining"))),
  },

  {
    name: 'Prove Derived Rule: De Morgan (Disjunction of Negations)',
    description: [],
    rules: [
      ConjunctionElimination,
      ConditionalIntroduction,
      DisjunctionElimination,
      NegationIntroduction,
      NegationElimination,
      ModusTollens,
    ],
    propositions: [
      or(not(lit("I drink tea")), not(lit("I drink coffee"))),
    ],
    target: not(and(lit("I drink tea"), lit("I drink coffee"))),
  },

  {
    name: 'Prove Derived Rule: De Morgan (Negation of Disjunction)',
    description: [],
    rules: [
      ConjunctionIntroduction,
      ConditionalIntroduction,
      DisjunctionIntroduction,
      NegationElimination,
      NegationIntroduction,
    ],
    propositions: [
      not(or(lit("I drink tea"), lit("I drink coffee"))),
    ],
    target: and(not(lit("I drink tea")), not(lit("I drink coffee"))),
  },

  {
    name: 'Prove Derived Rule: De Morgan (Conjunction of Negations)',
    description: [],
    rules: [
      ConjunctionElimination,
      ConditionalIntroduction,
      NegationIntroduction,
      NegationElimination,
      DisjunctiveSyllogism,
    ],
    propositions: [
      and(not(lit("I drink tea")), not(lit("I drink coffee"))),
    ],
    target: not(or(lit("I drink tea"), lit("I drink coffee"))),
  },

  {
    name: 'Prove Derived Rule: De Morgan (Negation of Conjunction)',
    description: [],
    rules: [
      ConjunctionIntroduction,
      ConditionalIntroduction,
      NegationIntroduction,
      NegationElimination,
      DoubleNegationElimination,
      ConstructiveDelimma,
      ModusTollens,
      LawOfExcludedMiddle
    ],
    propositions: [
      not(and(lit("I drink tea"), lit("I drink coffee"))),
    ],
    target: or(not(lit("I drink tea")), not(lit("I drink coffee"))),
  },
];
export default NATURAL_DEDUCTION_SYSTEM;
