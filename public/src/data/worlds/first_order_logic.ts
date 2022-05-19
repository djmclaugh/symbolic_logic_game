import Level from '../level.js'

import {
  ConjunctionIntroduction,
  ConditionalIntroduction,
  ConditionalElimination,
  NegationIntroduction,
  NegationElimination,
  DoubleNegationElimination,
} from '../inference_rules/natural_deduction_system.js'

import {
  ModusTollens,
  DoubleNegationIntroduction,
  HypotheticalSyllogism,
  LawOfExcludedMiddle,
  DisjunctiveSyllogism,
  // Explosion,
} from '../inference_rules/propositional_logic_derived.js'

import {
  Reflexivity,
  Substitution,
  UniversalIntroduction,
  UniversalElimination,
  ExistentialIntroduction,
  ExistentialElimination,
} from '../inference_rules/first_order_logic.js'

import {
  Symmetry,
  EqualityNegationSymmetry,
} from '../inference_rules/fol_derived.js'

import { litTerm } from '../terms/literal.js'
import { func } from '../terms/function.js'

import { lit, litWithTerms } from '../predicates/literal.js'
import { not } from '../predicates/negation.js'
import { and } from '../predicates/conjunction.js'
import { or } from '../predicates/disjunction.js'
import { then } from '../predicates/conditional.js'
import { eq } from '../predicates/equality.js'
import { forAll } from '../predicates/universal.js'
import { exists } from '../predicates/existential.js'
import { PropositionType } from '../propositions/propositions.js'

const x = litTerm("𝑥");
const y = litTerm("𝑦");

const FIRST_ORDER_LOGIC: Level[] = [];

const alice = litTerm("Alice");
const bob = litTerm("Bob");
const carol = litTerm("Carol");
const tallest = litTerm("tallest person");
const shortest = litTerm("shortest person");
const socrates = litTerm("Socrates");
const paws = litTerm("Mr. Paws");
const myDog = litTerm("my dog");
const clark = litTerm("Clark Kent");
const superman = litTerm("Superman");
const isTaller = lit(["", " is taller than ", ""]);
const isOlder = lit(["", " is older than ", ""]);
const alice_mother = func(["", "'s mom"], [alice])
const alice_gmother = func(["", "'s grandmother"], [alice])
const alice_friend = func(["", "'s friend"], [alice])
const alice_daughter = func(["", "'s daughter"], [alice])
const bob_mother = func(["", "'s mom"], [bob])
const myFavDrink = litTerm("my favourite drink");
const water = litTerm("water");
const h2o = litTerm("H₂O");

FIRST_ORDER_LOGIC.push({
  name: "Propositional Logic Background",
  description: [
    "First-order logic is built on top of propositional logic.\nAll inference rules (assumed and derived) from that world will be taken for granted.",
    "I highly recommend you complete that world first."
  ],
  rules: [
    ConditionalElimination,
  ],
  propositions: [
    then(isTaller.withSlots([alice, bob]), isTaller.withSlots([alice, carol])),
    isTaller.withSlots([alice, bob]),
  ],
  target: isTaller.withSlots([alice, carol]),
});

FIRST_ORDER_LOGIC.push({
  name: "Terms and Predicates",
  description: [
    "In propositional logic, we took propositional sentences as our atomic building blocks.",
    "In first-order logic, we go one step deeper.\nInstead of taking propositions for granted, we build them up from terms and predicates.",
    "Symbolically speaking, a term is just a sequence of symbols, just like a propositional sentence.\nThe difference is the idea behind what it \"should represent\".\nThe idea behind a proposition is that it should represent a statement, a truth value.\nThe idea behind a term is that it should represent a noun, a \"thing\".\nIn this level we have three base terms: Alice, Bob, and Carol.",
    "A predicate is just a proposition with a number of holes in it.\nYou can make a proposition by taking a predicate and filling in the holes with terms.\nIn this level we have two predicates: \"_____ is taller than _____\" and \"____ is the tallest\".",
    "Note: First-order logic is also called predicate logic.",
  ],
  rules: [
    ConjunctionIntroduction,
    ConditionalIntroduction,
    ConditionalElimination,
  ],
  terms: [
    alice,
    bob,
    carol,
  ],
  propositions: [
    isTaller.withSlots([alice, carol]),
    then(and(isTaller.withSlots([alice, bob]), isTaller.withSlots([alice, carol])), litWithTerms(["", " is the tallest"], [alice])),
  ],
  target: then(isTaller.withSlots([alice, bob]), litWithTerms(["", " is the tallest"], [alice])),
  allowedPropositionTypes: [
    PropositionType.LITERAL,
  ]
});

FIRST_ORDER_LOGIC.push({
  name: "Functions",
  description: [
    "First-order logic also adds the concept of functions.",
    "A function is just a term with a number of holes in it.\nYou can make a term by taking a function and filling in the holes with terms.\nIn this level we have one function: _____'s daughter.",
  ],
  rules: [
    ConditionalIntroduction,
    ConditionalElimination,
  ],
  terms: [
    alice,
  ],
  propositions: [
    then(litWithTerms(["", " helps with the dishes"], [alice_daughter]), litWithTerms(["", " will have more free time"], [alice])),
    then(litWithTerms(["", " will have more free time"], [alice]), litWithTerms(["", " will play with ", ""], [alice, alice_daughter])),
  ],
  target: then(litWithTerms(["", " helps with the dishes"], [alice_daughter]), litWithTerms(["", " will play with ", ""], [alice, alice_daughter])),
  allowedPropositionTypes: [
    PropositionType.LITERAL,
  ]
});

FIRST_ORDER_LOGIC.push({
  name: "Note: Symbolic Logic and Nonsense",
  description: [
    "It's possible that functions create \"nonsensical\" terms.",
    "For example, consider the term \"Alice\" and the function \"____'s daughter\".\nAlice might not have a daughter, in which case \"Alice's daughter\" doesn't refer to anything.\nAlice might have multiple daughters, in which case \"Alice's daughter\" is ambiguous.",
    "It's also possible that predicates create \"nonsensical\" propositions.",
    "For example, consider the terms \"red\" and \"blue\" and the predicate \"____ is taller than ____\".\nColours don't have height, so it's not clear what the meaning of \"red is taller than blue\" is (if it has one at all).",
    "But since symbolic logic only deals with the symbols of sentences and not the sense of sentences, whether a term/proposition is sensical or not doesn't matter.",
    "There are MANY philosophical positions regarding when a term/proposition is \"nonsensical\".\nThis is a very interesting topic, but but it deals with semantics which falls outside the scope of symbolic logic.\nIf you want to end up with sensical conclusions, it's up to you to only start with propositions you've determined to be sensical.",
  ],
  rules: [
    ConditionalIntroduction,
    ConditionalElimination,
  ],
  terms: [
    alice,
    litTerm("red"),
    litTerm("blue"),
  ],
  propositions: [
    then(
      litWithTerms(
        ["", " is tall"],
        [func(["", "'s imagination"], [alice])]
      ),
      lit("adkf;f")
    ),
    then(
      lit("adkf;f"),
      litWithTerms(
        ["", " is strong"],
        [func(["", " and ", "'s daughter"], [litTerm("red"), litTerm("blue")])]
      )
    ),
  ],
  target: then(litWithTerms(["", " is tall"], [func(["", "'s imagination"], [alice])]), litWithTerms(["", " is strong"], [func(["", " and ", "'s daughter"], [litTerm("red"), litTerm("blue")])])),
  allowedPropositionTypes: [
    PropositionType.LITERAL,
  ]
});

FIRST_ORDER_LOGIC.push({
  name: "Rule #1: Existential Introduction",
  description: [
    "New logical symbol: ∃ (Existential Quantifier)",
    "The existential quantifier (∃) symbol is inspired by the words \"there exists\".\nThe idea is for \"∃𝑥 (𝑃)\" (where 𝑃 is a proposition with some number of \"𝑥\"s) to mean that there's at least one value of 𝑥 that makes 𝑃 true.",
    "The term that comes right after the ∃ symbol is called a variable and doesn't need to be in your term bank.\nIn fact, in this game, to avoid edge cases, I require that the variable does NOT appear in the term bank and that it is NOT already a variable in 𝑃.",
    "By convention, we use italic letters for variables.",
    "The existential introduction rule lets you take a proposition you already have in your bank and add an existential version of it to your bank.\nAll you have to do is specify which term you want replaced and which variable you want to use.",
    "The idea behind existential introduction is that if you know that 𝑃 is true for a specific thing, then you know that there exists at least one thing that makes 𝑃 true.",
    "Note: Existential introduction is also called existential generalization.",
  ],
  rules: [
    ExistentialIntroduction,
  ],
  terms: [alice, bob, carol],
  propositions: [
    litWithTerms(["", " is tall"], [alice]),
    litWithTerms(["", " is short"], [carol]),
  ],
  target: exists(x, litWithTerms(["", " is short"], [x])),
});

FIRST_ORDER_LOGIC.push({
  name: "Existential Introduction Notes",
  description: [
    "Note: You don't have to replace ALL of the terms.",
    "Note: You don't even have to replace any of the terms (but then the existential part of the statement is pointless).",
    "Here are four statements that you could infer from \"Alice is taller than Alice's mom\":",
    "∃𝑥 (𝑥 is taller than Alice's mom): Someone is taller than Alice's mom.",
    "∃𝑥 (Alice is taller than 𝑥's mom): Alice is taller than someone's mom.",
    "∃𝑥 (𝑥 is taller than 𝑥's mom): Someone is taller than their mom.",
    "∃𝑥 (Alice is taller than 𝑥): Alice is taller than someone.",
  ],
  rules: [
    ExistentialIntroduction,
  ],
  terms: [alice],
  propositions: [
    isTaller.withSlots([alice, alice_mother]),
  ],
  target: exists(x, isTaller.withSlots([alice, x])),
});

FIRST_ORDER_LOGIC.push({
  name: "Nested Existentials",
  description: [
    "You can have existential statements inside other existential statements.",
    "∃𝑥 ∃𝑦 (𝑥 is taller than 𝑦's mom): Someone is taller than someone's mom.",
    "Notice how this is more general than ∃𝑥 (𝑥 is taller than 𝑥's mom): Someone is taller than their own mom.",
  ],
  rules: [
    ExistentialIntroduction,
  ],
  terms: [alice],
  propositions: [
    isTaller.withSlots([alice, alice_mother]),
  ],
  target: exists(x, exists(y, isTaller.withSlots([x, func(["", "'s mom"], [y])]))),
});

FIRST_ORDER_LOGIC.push({
  name: "Rule #2: Universal Elimination",
  description: [
    "New logical symbol: ∀ (Universal Quantifier)",
    "The universal quantifier (∀) symbol is inspired by the words \"for all\".\nThe idea is for \"∀𝑥 (𝑃)\" (where 𝑃 is a proposition with some number of \"𝑥\"s) to mean that all values of 𝑥 make 𝑃 true.",
    "The term that comes right after the ∀ symbol is called a variable and doesn't need to be in your term bank.\nIn fact, in this game, to avoid edge cases, I require that the variable does NOT appear in the term bank and that it is NOT already a variable in 𝑃.",
    "By convention, we use italic letters for variables.",
    "Universal elimination let's you take a universal statement from your bank, and replace the variable with any term from the bank.",
    "The idea behind universal elimination is that if something is true for all terms, then it should be true for any specific term.",
    "Note: Universal elimination is also called universal instantiation.",
  ],
  rules: [
    UniversalElimination,
  ],
  terms: [alice, bob, carol],
  propositions: [
    forAll(x, litWithTerms(["", " was younger yesterday"], [x])),
  ],
  target: litWithTerms(["", " was younger yesterday"], [bob_mother]),
});

FIRST_ORDER_LOGIC.push({
  name: "Universal Elimination Practice",
  description: [
    "It's very rare that a predicate is unconditionally true for all terms.",
    "Most universals you'll encount will be universals of conditionals: Propositions of the form ∀𝑥 ((𝑃) → (𝑄)).",
  ],
  rules: [
    ConditionalElimination,
    UniversalElimination,
  ],
  terms: [alice, bob, carol, socrates],
  propositions: [
    litWithTerms(["", " is a human"], [socrates]),
    forAll(x, then(litWithTerms(["", " is a human"], [x]), litWithTerms(["", " is mortal"], [x]))),
  ],
  target: litWithTerms(["", " is mortal"], [socrates]),
});

FIRST_ORDER_LOGIC.push({
  name: "Nested Universals",
  description: [
    "It's also possible to have universals within other universals.",
  ],
  rules: [
    UniversalElimination,
  ],
  terms: [alice, bob, carol],
  propositions: [
    forAll(x, forAll(y, litWithTerms(["", " is friends with ", ""], [x, y]))),
  ],
  target: litWithTerms(["", " is friends with ", ""], [carol, bob]),
});

FIRST_ORDER_LOGIC.push({
  name: "Prove Derived Rule: Universal Implies Existential",
  description: [],
  rules: [
    UniversalElimination,
    ExistentialIntroduction,
  ],
  terms: [alice, bob, carol],
  propositions: [
    forAll(x, litWithTerms(["", " is special"], [x]))
  ],
  target: exists(x, litWithTerms(["", " is special"], [x])),
});

FIRST_ORDER_LOGIC.push({
  name: "Rule #3: Existential Elimination",
  description: [
    "Existential elimination lets you take an existential proposition you already have in your bank and create a new term with that property.",
    "The idea behind existential introduction is that if you know that 𝑃 is true for some thing, then you can give that thing a name.\nIt has to be a completely new name though to make sure you don't slip in any unwanted assumptions.",
    "In this game, to make sure the term hasn't been used before, we'll use bold letters only for existential terms.",
    "Note: Existential elimination is also called existential instantiation."
  ],
  rules: [
    ConditionalElimination,
    ExistentialIntroduction,
    ExistentialElimination,
    UniversalElimination,
  ],
  terms: [alice, bob, carol],
  propositions: [
    exists(x, litWithTerms(["", " is taller than ", ""], [x, bob])),
    forAll(x, then(litWithTerms(["", " is taller than ", ""], [x, bob]), litWithTerms(["", " is taller than ", ""], [x, carol]))),
  ],
  target: exists(x, litWithTerms(["", " is taller than ", ""], [x, carol])),
})

FIRST_ORDER_LOGIC.push({
  name: "Prove Derived Rule: Existential Change Of Variable",
  description: [
    "Here we show that the variable we use with the existential quantifier doesn't matter."
  ],
  rules: [
    ExistentialIntroduction,
    ExistentialElimination,
  ],
  terms: [alice, bob, carol],
  propositions: [
    exists(x, litWithTerms(["", " is special"], [x])),
  ],
  target: exists(y, litWithTerms(["", " is special"], [y])),
  allowedPropositionTypes: [
    PropositionType.LITERAL,
  ]
});

FIRST_ORDER_LOGIC.push({
  name: "Rule #4: Universal Introduction",
  description: [
    "Universal introduction is a bit different form the other rules.\nBefore you can use it, you first have to create a completely new term.\nAfter that, whatever propositions you manage to prove with this new term can be transformed into a universal statement.",
    "The idea behind universal introduction is that if you can prove a proposition about something you know nothing about, then you could have proven that proposition about anything.",
    "In this game, to make sure the term hasn't been used before, we'll use fraktur letters only for universal terms.",
    "Note: Universal introduction is also called universal generalization."
  ],
  rules: [
    LawOfExcludedMiddle,
    UniversalIntroduction,
  ],
  terms: [alice, bob, carol],
  propositions: [],
  target: forAll(x, or(litWithTerms(["", " is taller than ", ""], [x, bob]), not(litWithTerms(["", " is taller than ", ""], [x, bob])))),
  allowedPropositionTypes: [
    PropositionType.LITERAL,
  ]
});

FIRST_ORDER_LOGIC.push({
  name: "Creating Nested Universals",
  description: [
    "Most of the time, you only need one universal term.\nBut if you want to create nested universals, you'll need multiple universal terms.",
  ],
  rules: [
    LawOfExcludedMiddle,
    UniversalIntroduction,
  ],
  terms: [alice, bob, carol],
  propositions: [],
  target: forAll(x, forAll(y, or(litWithTerms(["", " is taller than ", ""], [x, y]), not(litWithTerms(["", " is taller than ", ""], [x, y]))))),
  allowedPropositionTypes: [
    PropositionType.LITERAL,
  ]
})

FIRST_ORDER_LOGIC.push({
  name: "Universal Introduction Practice",
  description: [
    "It's very rare that you'll have to create universal propositions yourself. They are usually given as assumptions.\nBut if ever you need to, chances are you'll have other universals to help you.",
  ],
  rules: [
    ConditionalElimination,
    UniversalIntroduction,
    UniversalElimination,
  ],
  terms: [alice, bob, carol],
  propositions: [
    forAll(x, litWithTerms(["", " is a human"], [x])),
    forAll(x, then(litWithTerms(["", " is a human"], [x]), litWithTerms(["", " is an animal"], [x]))),
  ],
  target: forAll(x, litWithTerms(["", " is an animal"], [x])),
  allowedPropositionTypes: [
    PropositionType.LITERAL,
  ]
})

FIRST_ORDER_LOGIC.push({
  name: "Prove Derived Rule: Universal Change Of Variable",
  description: [
    "Here we show that the variable that we use with the universal quantifier doesn't matter."
  ],
  rules: [
    UniversalIntroduction,
    UniversalElimination,
  ],
  terms: [alice, bob, carol],
  propositions: [
    forAll(x, litWithTerms(["", " is special"], [x])),
  ],
  target: forAll(y, litWithTerms(["", " is special"], [y])),
  allowedPropositionTypes: [
    PropositionType.LITERAL,
  ]
});

FIRST_ORDER_LOGIC.push({
  name: "Existential of Universal into Universal of Existential",
  description: [
    "If there's someone that's friends with everyone, then for everyone, there's someone that's friends with them.",
    "Note: The converse however is not always true!\nIf for everyone, there's someone that's friends with them, then there might not be someone that's friends with everyone.\nFor example, Alice could be friends with Bob (and vice versa) and Carol could be friends with Socrates (and vice versa).\nIn that case, everyone would have a friend, but no one would be friends with everyone.",
  ],
  rules: [
    ExistentialIntroduction,
    ExistentialElimination,
    UniversalIntroduction,
    UniversalElimination,
  ],
  propositions: [
    exists(x, forAll(y, litWithTerms(["", " is friends with ", ""], [x, y]))),
  ],
  target: forAll(y, exists(x, litWithTerms(["", " is friends with ", ""], [x, y]))),
  allowedPropositionTypes: [
    PropositionType.LITERAL,
  ]
});

FIRST_ORDER_LOGIC.push({
  name: "Prove Derived Rule: De Morgan (Existential of Negation)",
  description: [
    "If someone doesn't like coffee, then it's not true that everyone likes coffee.",
  ],
  rules: [
    ConditionalIntroduction,
    ModusTollens,
    ExistentialElimination,
    UniversalElimination,
  ],
  propositions: [
    exists(x, not(litWithTerms(["", " likes coffee"], [x]))),
  ],
  target: not(forAll(x, litWithTerms(["", " likes coffee"], [x]))),
  allowedPropositionTypes: [
    PropositionType.LITERAL,
    PropositionType.UNIVERSAL,
  ]
});

FIRST_ORDER_LOGIC.push({
  name: "Prove Derived Rule: De Morgan (Negation of Existential)",
  description: [
    "If it's not true that someone likes coffee, then everyone doesn't like coffee.",
  ],
  rules: [
    ConditionalIntroduction,
    ModusTollens,
    ExistentialIntroduction,
    UniversalIntroduction,
  ],
  propositions: [
    not(exists(x, litWithTerms(["", " likes coffee"], [x]))),
  ],
  target: forAll(x, not(litWithTerms(["", " likes coffee"], [x]))),
  allowedPropositionTypes: [
    PropositionType.LITERAL,
    PropositionType.EXISTENTIAL,
  ]
});

FIRST_ORDER_LOGIC.push({
  name: "Prove Derived Rule: De Morgan (Universal of Negation)",
  description: [
    "If everyone doesn't like coffee, then it's not true that someone likes coffee.",
  ],
  rules: [
    ConditionalIntroduction,
    NegationIntroduction,
    // Explosion,
    ExistentialElimination,
    UniversalElimination,
  ],
  propositions: [
    forAll(x, not(litWithTerms(["", " likes coffee"], [x]))),
  ],
  target: not(exists(x, litWithTerms(["", " likes coffee"], [x]))),
  allowedPropositionTypes: [
    PropositionType.LITERAL,
    PropositionType.NEGATION,
    PropositionType.EXISTENTIAL,
    PropositionType.UNIVERSAL,
  ]
});

FIRST_ORDER_LOGIC.push({
  name: "Prove Derived Rule: De Morgan (Negation of Universal)",
  description: [
    "If it's not true that everyone likes coffee, then then someone doesn't like coffee.",
  ],
  rules: [
    ConditionalIntroduction,
    ModusTollens,
    DoubleNegationElimination,
    ExistentialIntroduction,
    UniversalIntroduction,
  ],
  propositions: [
    not(forAll(x, litWithTerms(["", " likes coffee"], [x]))),
  ],
  target: exists(x, not(litWithTerms(["", " likes coffee"], [x]))),
  allowedPropositionTypes: [
    PropositionType.LITERAL,
    PropositionType.NEGATION,
    PropositionType.EXISTENTIAL,
    PropositionType.UNIVERSAL,
  ]
});

  //
  // {
  //   name: "Prove Derieved Rule: De Morgan (Existential Negation)",
  //   description: [],
  //   rules: [
  //     ConditionalIntroduction,
  //     NegationIntroduction,
  //     NegationElimination,
  //     UniversalIntroduction,
  //     UniversalElimination,
  //     ExistentialIntroduction,
  //     ExistentialElimination,
  //   ],
  //   propositions: [
  //     exists("𝑥", not(lit("𝑥 is an elephant"))),
  //   ],
  //   target: not(forall("𝑥", lit("𝑥 is an elephant"))),
  // },
  //
  // {
  //   name: "Prove Derieved Rule: De Morgan (Negation of Existential)",
  //   description: [],
  //   rules: [
  //     ConditionalIntroduction,
  //     NegationIntroduction,
  //     NegationElimination,
  //     ModusTollens,
  //     UniversalIntroduction,
  //     UniversalElimination,
  //     ExistentialIntroduction,
  //     ExistentialElimination,
  //   ],
  //   propositions: [
  //     not(exists("𝑥", lit("𝑥 is an immortal human"))),
  //   ],
  //   target: forall("𝑥", not(lit("𝑥 is an immortal human"))),
  // },
  //
  // {
  //   name: "Prove Derieved Rule: De Morgan (Universal Negation)",
  //   description: [],
  //   rules: [
  //     ConditionalIntroduction,
  //     NegationIntroduction,
  //     NegationElimination,
  //     UniversalIntroduction,
  //     UniversalElimination,
  //     ExistentialIntroduction,
  //     ExistentialElimination,
  //   ],
  //   propositions: [
  //     forall("𝑥", not(lit("𝑥 is an immortal human"))),
  //   ],
  //   target: not(exists("𝑥", lit("𝑥 is an immortal human"))),
  // },
  //
  // {
  //   name: "Prove Derieved Rule: De Morgan (Negation of Universal)",
  //   description: [],
  //   rules: [
  //     ConditionalIntroduction,
  //     NegationIntroduction,
  //     NegationElimination,
  //     DoubleNegationElimination,
  //     UniversalIntroduction,
  //     UniversalElimination,
  //     ExistentialIntroduction,
  //     ExistentialElimination,
  //   ],
  //   propositions: [
  //     not(forall("𝑥", lit("𝑥 is an elephant"))),
  //   ],
  //   target: exists("𝑥", not(lit("𝑥 is an elephant"))),
  // },
export default FIRST_ORDER_LOGIC;
