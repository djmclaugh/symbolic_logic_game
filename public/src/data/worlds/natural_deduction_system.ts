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
  DoubleNegationIntroduction,
  ConjunctionCommutation,
  ConjunctionAssociation,
  DisjunctionCommutation,
  ConditionalTautology,
  HypotheticalSyllogism,
  ConstructiveDelimma,
  LawOfExcludedMiddle,
  DisjunctiveSyllogism,
  ModusTollens,
  Contradiction,
  ProofOfNegation,
  ProofByContradiction,
} from '../inference_rules/propositional_logic_derived.js'

import { lit } from '../predicates/literal.js'
import { not } from '../predicates/negation.js'
import { and } from '../predicates/conjunction.js'
import { or } from '../predicates/disjunction.js'
import { then } from '../predicates/conditional.js'
import { PropositionType } from '../propositions/propositions.js'

const NATURAL_DEDUCTION_SYSTEM: Level[] = [
  {
    name: "Propositional Logic Introduction",
    description: [
      "In this world you'll learn propositional logic.",
      "The goal of each level is to have an EXACT copy of the target proposition in your proposition bank.",
      "For this first level, we already start with the target proposition in our bank, so we already won!\nClick the \"Go to next level\" button to proceed.",
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
      "You can create new propositions by using the inference rules provided to you.\nEach rule has specific requirements, make sure you read them carefully!",
      "For this level, you're given conjunction introduction.\nIt lets you take any two propositions from your bank and combine them by putting a \"∧\" in between.",
      "The behaviour of the conjunction symbol (∧) is inspired by the word \"and\".\nThe idea is for \"(𝐿) ∧ (𝑅)\" to mean that both 𝐿 and 𝑅 are true.",
      "Conjunction introduction is one of the nine rules that are taken for granted in propositional logic.",
      "Remember, we're doing symbolic logic.\nYou need to make an EXACT copy of the target proposition.\nIt has to be the EXACT same sequence of symbols.",
      "For example, \"1+2\" is not the same as \"2+1\"; The symbols are not in the same order.",
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
    name: "Nested Conjunctions",
    description: [
      "It's possible to have conjunctions inside conjunctions.",
      "Again, remember that we're doing symbolic logic.\nYou need to make an EXACT copy of the target proposition.\nIt has to be the EXACT same sequence of symbols.",
      "For example, \"(1+2)+3\" is not the same as \"1+(2+3)\"; The parentheses are not at the same positions.",
    ],
    hints: [
      "If ever you're stuck, it's generally a good idea to try and work backwards."
      + "\nIn this case for example, we want \"(I like green) ∧ ((I like blue) ∧ (I like red))\"."
      + "\nTo be able to create that, we need to already have both \"I like green\" and \"(I like blue) ∧ (I like red)\" in our bank."
      + "\nSo that means that we need to create \"(I like blue) ∧ (I like red)\" first."
    ],
    rules: [ ConjunctionIntroduction ],
    propositions: [
      lit("I like red"),
      lit("I like green"),
      lit("I like blue"),
    ],
    target: and(lit("I like green"), and(lit("I like blue"), lit("I like red"))),
  },
  {
    name: "Rule #2: Conjunction Elimination",
    description: [
      "In this level you're given conjunction elimination (conjunction introduction's counterpart).",
      "If you have a conjunction already in your bank, it lets you make the proposition that consists of just one side of the conjunction.",
      "The idea behind conjunction elimination is that if the left and right sides of the \"∧\" are true together, then either should be true by itself.",
      "Note: Conjunction elimination is also called \"simplification\".",
    ],
    rules: [ ConjunctionElimination ],
    propositions: [
      and(lit("I like apples"), lit("I like oranges")),
    ],
    target: lit("I like oranges"),
  },
  {
    name: "Conjunction Practice",
    description: [
      "Let's see if you can use the two conjunction rules to clear this level.",
      "It's up to you to figure out how, in what order, and how many times to use each of the rules.",
    ],
    hints: [
      "Again, it's generally a good idea to try and work backwards."
      + "\nIn this case we want \"(Alice likes oranges) ∧ (Bob likes oranges)\"."
      + "\nTo be able to create that, we need to already have both \"Alice likes oranges\" and \"Bob likes oranges\" in our bank."
      + "\nWe can get those by using conjunction elimination."
    ],
    rules: [ ConjunctionIntroduction, ConjunctionElimination ],
    propositions: [
      and(lit("Alice likes apples"), lit("Alice likes oranges")),
      and(lit("Bob likes apples"), lit("Bob likes oranges")),
    ],
    target: and(lit("Alice likes oranges"), lit("Bob likes oranges")),
  },

  {
    name: "Note: Symbolic Logic and Nonsense",
    description: [
      "It's possible that some propositions are \"nonsensical\".",
      "But since symbolic logic only deals with the symbols of sentences and not the sense of sentences, whether a proposition is sensical or not doesn't matter.",
      "There are MANY philosophical positions about when a proposition is sensical or not.\nThis is a very interesting topic, but it deals with semantics which falls outside the scope of symbolic logic.\nIf you want to end up with sensical conclusions, it's up to you to only start with propositions you've determined to be sensical.",
    ],
    rules: [ ConjunctionIntroduction, ConjunctionElimination ],
    propositions: [
      lit("more people have been to Russia than I have"),
      and(lit("this sentence is a lie"), lit("sdlakfjhadls")),
    ],
    target: and(lit("sdlakfjhadls"), lit("more people have been to Russia than I have")),
  },

  {
    name: 'Prove Derived Rule: Conjunction Commutation',
    description: [
      "Conjunction introduction/elimination are the only 2 rules taken for granted about conjunctions.",
      "However, from these 2 rules we can derive many other rules!",
      "Here we'll derive a rule that tells us that conjunction is commutative. In other words, that we can swap the left and right sides of a conjunction as we please.",
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
    ],
    rules: [ConjunctionIntroduction, ConjunctionElimination],
    propositions: [
      and(lit("I like red"), and(lit("I like green"), lit("I like blue"))),
    ],
    target: and(and(lit("I like red"), lit("I like green")), lit("I like blue")),
  },

  {
    name: 'Conjunction Extra Practice',
    description: [
      "Note: If you feel comfortable with conjunctions, feel free to skip to the next level.",

    ],
    hints: [
      "If you ever have a conjunction in your proposition bank, it doesn't hurt to take it appart with conjunction elimination.",
      "If you ever have a conjunction as your target, try to create each side one at a time.",
    ],
    rules: [
      ConjunctionIntroduction,
      ConjunctionElimination,
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
      "New logical symbol: → (Conditional)",
      "The behaviour of the conditional symbol (→) is inspired by the word \"implies\".\nThe idea is for \"(𝑃) → (𝑄)\" to mean that whenever 𝑃 is true, then 𝑄 must be true as well.",
      "A statement of the form \"(𝑃) → (𝑄)\" is called a conditional statement.\nThe left side is called the antecedent.\nThe right side is called the consequent.",
      "The first rule we'll see about conditionals is conditional elimination.\nIf you have a conditional statement and you also have its antecedent, then it lets you add consequent to your bank.",
      "Note: Conditional elimination is also called modus ponens",
    ],
    rules: [ConditionalElimination],
    propositions: [
      lit("Socrates is a man"),
      then(lit("Socrates is a man"), lit("Socrates is mortal")),
    ],
    target: lit("Socrates is mortal"),
  },

  {
    name: 'Conditional Elimination Chaining',
    description: [],
    rules: [ConditionalElimination],
    propositions: [
      lit("I go to bed late"),
      then(lit("I go to bed late"), lit("I wake up late")),
      then(lit("I wake up late"), lit("I get to work late")),
    ],
    target: lit("I get to work late"),
  },

  {
    name: 'Conditionals and Conjunctions #1',
    description: [
      "Let's mix in conditionals with conjunctions.",
    ],
    rules: [
      ConjunctionIntroduction,
      ConditionalElimination
    ],
    propositions: [
      lit("I go to bed early"),
      lit("I don't forget my alarm"),
      then(and(lit("I go to bed early"), lit("I don't forget my alarm")), lit("I wake up on time")),
    ],
    target: lit("I wake up on time"),
  },

  {
    name: 'Conditionals and Conjunctions #2',
    description: [
      "Let's mix in conditionals with conjunctions, again.",
    ],
    rules: [
      ConjunctionElimination,
      ConditionalElimination
    ],
    propositions: [
      lit("I have breakfast"),
      then(lit("I have breakfast"), and(lit("I eat toast"), lit("I drink coffee"))),
    ],
    target: lit("I drink coffee"),
  },

  {
    name: 'Rule #4: Conditional Introduction',
    description: [
      "This rule is the most complicated, but one of the most useful out of the nine base rules.",
      "This rule says that if you can \"prove\" 𝑄 by assuming 𝑃, then you can add \"(𝑃) → (𝑄)\" to your proposition bank.",
      "To \"prove\" 𝑄, you have to beat the sublevel where 𝑃 has been added to the proposition bank and where 𝑄 is the target proposition.",
      "Note: Conditional introduction can use ANY propositions you can think of. The chosen propositions don't need to already be in the bank.",
    ],
    hints: [
      "Your target proposition is \"(I like meatballs) → ((I like spaghetti) ∧ (I like meatballs))\".\nSo you should set the antecedent to \"I like meatballs\".\nAnd you should set the consequent to \"(I like spaghetti) ∧ (I like meatballs)\"."
    ],
    rules: [ConjunctionIntroduction, ConditionalIntroduction],
    propositions: [
      lit("I like spaghetti"),
    ],
    target: then(lit("I like meatballs"), and(lit("I like spaghetti"), lit("I like meatballs"))),
    allowedPropositionTypes: [
      PropositionType.LITERAL,
      PropositionType.CONJUNCTION,
    ],
  },

  {
    name: 'Conditional Introduction Practice',
    description: [],
    rules: [ConjunctionIntroduction, ConditionalIntroduction, ConditionalElimination],
    propositions: [
      lit("I'm a citizen"),
      then(and(lit("I'm a citizen"), lit("I'm an adult")), lit("I can vote")),
    ],
    target: then(lit("I'm an adult"), lit("I can vote")),
    allowedPropositionTypes: [
      PropositionType.LITERAL,
      PropositionType.CONJUNCTION,
    ],
  },

  {
    name: 'Conditional Tautology',
    description: [
      "A tautology is any statement you can get starting with an empty proposition bank.",
      "Using conditional introduction, we can get our first tautology!",
    ],
    rules: [ConditionalIntroduction],
    propositions: [],
    target: then(lit("I'm happy"), lit("I'm happy")),
    allowedPropositionTypes: [
      PropositionType.LITERAL,
    ],
  },

  {
    name: 'Conjunction Tautology',
    description: [
      "Here's another tautology we can get.",
    ],
    rules: [
      ConjunctionIntroduction,
      ConditionalIntroduction
    ],
    propositions: [],
    target: then(lit("I'm happy"), and(lit("I'm happy"), lit("I'm happy"))),
    allowedPropositionTypes: [
      PropositionType.LITERAL,
      PropositionType.CONJUNCTION,
    ],
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
    allowedPropositionTypes: [
      PropositionType.LITERAL,
    ],
  },

  {
    name: 'Conditional Practice',
    description: [
      "Note: If you feel comfortable with conditionals, feel free to skip to the next level.",
      "Note: You have access to the hypothetical syllogism rule if you want, but this level can be cleared as easily without it."
    ],
    hints: [
      "If you ever have a conditional as your target, it's usually a good idea to use conditional introduction and chose the 𝑃 and 𝑄 to match the left and right side of the target.",
    ],
    rules: [
      ConjunctionIntroduction,
      ConjunctionElimination,
      ConditionalIntroduction,
      ConditionalElimination,
      HypotheticalSyllogism,
    ],
    propositions: [
      then(lit("It's morning"), lit("I drink coffee")),
      then(lit("It's evening"), lit("I drink water")),
      then(lit("I drink coffee"), and(lit("I need milk"), lit("I need sugar"))),
      then(and(lit("I drink water"), lit("I'm out of water")), lit("I need to go to the store")),
      then(and(lit("I drink coffee"), lit("I'm out of coffee")), lit("I need to go to the store")),
      then(and(lit("I need milk"), lit("I'm out of milk")), lit("I need to go to the store")),
      then(and(lit("I need sugar"), lit("I'm out of sugar")), lit("I need to go to the store")),
      then(lit("I made cookies"), lit("I'm out of sugar")),
    ],
    target: then(and(lit("It's morning"), lit("I made cookies")), lit("I need to go to the store")),
    allowedPropositionTypes: [
      PropositionType.LITERAL,
      PropositionType.CONJUNCTION,
    ],
  },

  {
    name: "Rule #5: Disjunction Introduction",
    description: [
      "New logical symbol: ∨ (Disjunction)",
      "The behaviour of the disjunction symbol (∨) is inspired by the word \"or\".\nThe idea is for \"(𝐿) ∨ (𝑅)\" to mean that at least one of 𝐿 or 𝑅 are true.",
      "Note: The conjunction (∧) and disjunction (∨) symbols are very similar. Be careful not to mix them up!",
      "Disjunction introduction let's you combine any proposition from your bank with any proposition whatsoever (regardless of whether it's in the bank or not) by putting a \"∨\" in between.",
      "The idea behind this rule is that if you know something is true, then \"that thing\" or \"anything else\" must also be true.",
      "Note: Disjunction introduction is also called addition.",
    ],
    rules: [ DisjunctionIntroduction ],
    propositions: [
      lit("I like apples"),
    ],
    target: or(lit("It's Sunday"), lit("I like apples")),
    allowedPropositionTypes: [
      PropositionType.LITERAL,
    ],
  },

  {
    name: "Rule #6: Disjunction Elimination",
    description: [
      "Creating a disjunction is much easier than creating a conjunction, but getting rid of a disjunction is much harder than getting rid of a conjunction.",
      "If both sides of a disjunction both imply the same thing, then you can use disjunction elimination to add that thing to your bank.",
      "Note: This rule is also called case analysis."
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
      "From disjunction elimination, we can derive the rule called constructive dilemma.",
      "Constructive delimma is very similar to disjunction elimination, but it's more general purpose since you don't need the consequents to match.",
    ],
    hints: [
      "Try adding \"(I drink coffee) → ((I drink coffee) ∨ (I drink water))\" and \"(I drink water) → ((I drink coffee) ∨ (I drink water))\" to your proposition bank first.",
    ],
    rules: [
      ConditionalIntroduction,
      ConditionalElimination,
      DisjunctionIntroduction,
      DisjunctionElimination
    ],
    propositions: [
      or(lit("It's breakfast"), lit("It's lunch")),
      then(lit("It's breakfast"), lit("I drink coffee")),
      then(lit("It's lunch"), lit("I drink water")),
    ],
    target: or(lit("I drink coffee"), lit("I drink water")),
    allowedPropositionTypes: [
      PropositionType.LITERAL,
      PropositionType.DISJUNCTION,
    ]
  },

  // Figure out!
  // {
  //   name: 'Disjunction Practice',
  //   description: [],
  //   rules: [
  //     ConjunctionIntroduction,
  //     ConjunctionElimination,
  //     ConditionalIntroduction,
  //     ConditionalElimination,
  //     DisjunctionIntroduction,
  //     DisjunctionElimination,
  //     HypotheticalSyllogism,
  //     ConstructiveDelimma,
  //   ],
  //   propositions: [],
  //   target: lit("I should buy chocolate"),
  //   allowedPropositionTypes: [
  //     PropositionType.LITERAL,
  //     PropositionType.CONJUNCTION,
  //     PropositionType.DISJUNCTION,
  //   ]
  // },

  {
    name: 'Rule #7: Negation Introduction',
    description: [
      "New logical symbol: ¬ (Negation)",
      "The behaviour of the negation (¬) symbol is inspired by the word \"not\".\nThe idea is for \"¬(𝑃)\" to mean that 𝑃 is not true.",
      "If you have (𝑃) → (𝑄) and (𝑃) → (¬(𝑄)) in your proposition bank, then negation introduction lets you add ¬(𝑃) to you bank.",
      "The idea behind negation introduction is that if you manage to prove contradictory results by assuming 𝑃, then you can assume that 𝑃 is not true.",
    ],
    hints: [
      "Frist try adding both \"(Socrates is an immortal man) → (Socrates is mortal)\" and \"(Socrates is an immortal man) → (¬(Socrates is mortal))\" to your bank."
    ],
    rules: [
      ConjunctionElimination,
      ConditionalIntroduction,
      ConditionalElimination,
      NegationIntroduction,
    ],
    propositions: [
      then(lit('Socrates is an immortal man'), and(not(lit('Socrates is mortal')), lit('Socrates is a man'))),
      then(lit('Socrates is a man'), lit('Socrates is mortal')),
    ],
    target: not(lit('Socrates is an immortal man')),
  },

  {
    name: 'Prove Derived Rule: Modus Tollens',
    rules: [ConditionalIntroduction, NegationIntroduction],
    hints: [
      "Try adding \"(I go to bed late) → ¬(I wake up late)\"."
    ],
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
    description: [
      "If something is true, then it's not true that it's not true."
    ],
    hints: [
      "Try adding \"¬(I like apples) → (I like apples)\" and \"¬(I like apples) → (¬(I like apples))\".",
    ],
    propositions: [
      lit("I like apples"),
    ],
    target: not(not(lit("I like apples"))),
    allowedPropositionTypes: [
      PropositionType.LITERAL,
      PropositionType.NEGATION,
    ]
  },

  {
    name: 'Prove Derived Rule: Self Contradiction',
    rules: [ConditionalTautology, NegationIntroduction],
    description: [
      "If something implies its own negation, then we can assume it's not true.",
    ],
    propositions: [
      then(lit("This sentence is a lie"), not(lit("This sentence is a lie"))),
    ],
    target: not(lit("This sentence is a lie")),
  },

  {
    name: 'Rule #8: Negation Elimination',
    description: [
      "This rule says that if you have the negation of a proposition, then this proposition implies anything.",
      "This rule might seem weird, but the idea behind it is that if you know that 𝑃 is not true for sure, then whenever 𝑃 is true (which is never), anything is possible.",
    ],
    rules: [NegationElimination],
    propositions: [
      not(lit('Pigs fly')),
    ],
    target: then(lit('Pigs fly'), lit('Hell will freeze over')),
  },

  {
    name: 'Prove Derived Rule: Disjunctive Syllogism',
    description: [
      "Note: This rule is sometimes taken for granted instead of negation elimination. From either you can prove the other, so it ends up not mattering which of the two you take for granted.",
    ],
    rules: [ConditionalTautology, DisjunctionElimination, NegationElimination],
    propositions: [
      or(lit("I like apples"), lit("I like oranges")),
      not(lit("I like apples")),
    ],
    target: lit("I like oranges"),
  },

  {
    name: 'Rule #9: Double Negation Elimination',
    description: [
      "Negation has a thrid rule: double negation elemination.",
      "This rules says that if you have the negation of a negation in your bank, then you can remove both negations at once.",
      "Note: We were able to prove double negation introduction from the other rules, but surprisingly (at least for me), it's impossible to prove double negation elimination from the 8 other base rules! We have to take it for granted if we want to use it.",
    ],
    rules: [DoubleNegationElimination],
    propositions: [
      not(not(lit('I like apples'))),
    ],
    target: lit('I like apples'),
  },

  {
    name: 'Prove Tautology: Law Of Noncontradiction',
    description: [
      "Congratulations! You now know all of the base rules of propositional logic!",
      "In the remaining levels, we'll derive fundamental rules that are often taken for granted even though they are technically not base rules.",
      "Law of noncontradiction: A thing cannot be true and not true at the same time."
    ],
    hints: [
      "Since you're trying to prove a negation, you'll need two conditional statments."
      + "\nYou'll need something like ((I like tea) ∧ (¬(I like tea))) → (𝑄) AND something like ((I like tea) ∧ (¬(I like tea))) → (¬(𝑄)).",
      "Try adding ((I like tea) ∧ (¬(I like tea))) → (I like tea) and ((I like tea) ∧ (¬(I like tea))) → (¬(I like tea)).",
    ],
    rules: [
      ConjunctionElimination,
      ConditionalIntroduction,
      NegationIntroduction,
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
    name: 'Prove Tautology: Law Of Excluded Middle',
    description: [
      "Law of exclude middle: A thing HAS to be either true or not true.",
      "Note: This law ends up being equivalent to double negation elimination.\nSo we actually don't have this law in intuitionistic logic since that logic doesn't use double negation elimination.",
    ],
    hints: [
      "This one is the trickiest so far!"
      + "\nTry to add ¬(¬((I like tea) ∨ (¬(I like tea)))) to your bank and then use double negation elimination on it.",
      "To add ¬(¬((I like tea) ∨ (¬(I like tea)))), you need to be able to prove contradictory statments by assuming ¬((I like tea) ∨ (¬(I like tea))).",
      "Try adding both ¬((I like tea) ∨ (¬(I like tea))) → ¬(I like tea) and ¬((I like tea) ∨ (¬(I like tea))) → ¬(¬(I like tea)).",
      "Adding both (I like tea) → ((I like tea) ∨ (¬(I like tea)))) and (¬(I like tea)) → ((I like tea) ∨ (¬(I like tea)))) can help you."
    ],
    rules: [
      ConditionalIntroduction,
      DisjunctionIntroduction,
      NegationIntroduction,
      DoubleNegationElimination,
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
      ConditionalTautology,
      DisjunctionCommutation,
      ConstructiveDelimma,
      LawOfExcludedMiddle,
    ],
    propositions: [
      then(lit("It's raining"), lit("The ground is wet")),
    ],
    target: or(not(lit("It's raining")), lit("The ground is wet")),
    allowedPropositionTypes: [
      PropositionType.LITERAL,
      PropositionType.NEGATION,
    ]
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
    allowedPropositionTypes: [
      PropositionType.LITERAL,
      PropositionType.NEGATION,
    ]
  },

  {
    name: 'Prove Derived Rule: Disjunction Commutation',
    rules: [
      DisjunctionIntroduction,
      DisjunctionElimination,
      ConditionalIntroduction
    ],
    description: [
      "Here we'll show that just like conjunctions, disjunctions are commutative. In other words, we'll show that the left and right side of a disjunction can be swapped.",
      "Note: Working with disjunctions is tricker than working with conjuncitons.",
    ],
    propositions: [
      or(lit("I like apples"), lit("I like oranges")),
    ],
    target: or(lit("I like oranges"), lit("I like apples")),
    allowedPropositionTypes: [
      PropositionType.LITERAL,
      PropositionType.DISJUNCTION,
    ]
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
];
export default NATURAL_DEDUCTION_SYSTEM;
