import Level from '../level.js'

import {
  ConditionalElimination,
} from '../inference_rules/natural_deduction_system.js'

import {
  HypotheticalSyllogism,
  LawOfExcludedMiddle
} from '../inference_rules/propositional_logic_derived.js'

import {
  Reflexivity,
  Substitution,
  UniversalIntroduction,
  UniversalElimination,
  ExistentialIntroduction,
  ExistentialElimination,
} from '../inference_rules/first_order_logic.js'

import { lit, not, and, or, then, eq, forall, exists } from '../propositions/propositions.js'

const FIRST_ORDER_LOGIC: Level[] = [
  // {
  //   name: "Test",
  //   description: [],
  //   rules: [
  //     Reflexivity,
  //     Substitution,
  //     UniversalIntroduction,
  //     UniversalElimination,
  //     ExistentialIntroduction,
  //     ExistentialElimination,
  //   ],
  //   propositions: [
  //     then(lit("𝑥 is a multiple of 4"), lit("𝑥 is a multiple of 2")),
  //     then(lit("𝑥 is a multiple of 8"), lit("𝑥 is a multiple of 4")),
  //   ],
  //   target: then(lit("𝑥 is a multiple of 8"), lit("𝑥 is a multiple of 2")),
  // },
  {
    name: "First Order Logic Introduction",
    description: [
      "Propositional logic is great, but it's not quite expressive enough for math. One important feature that propositional logic is missing is the concept of variables.",
      "First order logic is built on top propositional logic. All inference rules from that world will be taken for granted, so it's recomended to complete that world first."
    ],
    rules: [
      HypotheticalSyllogism,
    ],
    propositions: [
      then(lit("𝑥 is a multiple of 4"), lit("𝑥 is a multiple of 2")),
      then(lit("𝑥 is a multiple of 8"), lit("𝑥 is a multiple of 4")),
    ],
    target: then(lit("𝑥 is a multiple of 8"), lit("𝑥 is a multiple of 2")),
  },
  {
    name: "Rule #1: Reflexivity",
    description: [
      "Just like in propositional logic, there are some rules that are just taken for granted in first order logic.",
      "The first one we'll is called reflexivity. It says that if a proposition consists of a term, the \"=\" symbol, and then the exact same term again, then you can add that proposition to your bank.",
      "The behaviour of the \"=\" symbol is inspired by the word \"equals\". The idea is for \"𝑥 = 𝘺\" to mean that 𝑥 and 𝘺 are exactly the same thing. But remember, we're doing symbolic logic; Any meaning we give to the symbols is only for our own intuition. At the end of the day, only the inference rule matters.",
      "The idea behind reflexivity is that anything is exactly the same as itself."
    ],
    rules: [
      Reflexivity,
    ],
    propositions: [],
    target: eq("my favourite food", "my favourite food"),
  },
  {
    name: "Rule #2: Substitution",
    description: [
      "The second rule we'll see is called substitution. It says that if a term is equal to another term, then the first term can replaced by the second term in any proposition.",
      "The idea behind substitution is that if two terms refer to the exact same thing, then it shouldn't matter which term is used."
    ],
    rules: [
      Substitution,
    ],
    propositions: [
      eq("my dog", "Mr. Paws"),
      lit("I love my dog; I play with my dog every day.")
    ],
    target: lit("I love my dog; I play with Mr. Paws every day."),
  },

  {
    name: "Prove Derived Rule: Symmetry",
    description: [
      "These are the only two rules that we'll take for granted about \"=\".",
      "\"=\" has many other properties that we are familiar with, but we can actually prove them from the first two rules.",
      "Here we prove that \"=\" is symmetric. In other words, we show that it doesn't mater if we write 𝑎 = 𝑏 or 𝑏 = 𝑎."
    ],
    rules: [
      Reflexivity,
      Substitution,
    ],
    propositions: [
      eq("Clark Kent", "Superman"),
    ],
    target: eq("Superman", "Clark Kent"),
  },

  {
    name: "Prove Derived Rule: Transitivity",
    description: [
      "Here we prove that \"=\" is tansitive. In other words, that we can chain equalities.",
      "Note: Because of that, in real life, if ever three things are equal to each other, people will write just \"𝑎 = 𝑏 = 𝑐\" instead of the three propositions \"𝑎 = 𝑏\", \"𝑎 = 𝑐\", and \"𝑏 = 𝑐\".",
    ],
    rules: [
      Reflexivity,
      Substitution,
    ],
    propositions: [
      eq("my favourite drink", "water"),
      eq("water", "H₂O"),
    ],
    target: eq("my favourite drink", "H₂O"),
  },

  {
    name: "Rule #3: Universal Elimination",
    description: [
      "One important thing that differentiates first order logic over propositional logic is the concept of quantifiers.",
      "The behaviour of the \"∀\" symbol is inspired by the words \"for all\". The idea is for \"∀𝑥(𝑃)\" to mean that 𝑃 will remain true no matter what 𝑥 is. But remember, we're doing symbolic logic; Any meaning we give to the symbols is only for our own intuition. At the end of the day, only the inference rule matters.",
      "The idea behind universal elimination is that if something is true regardless of the value of 𝑥, then we can just plug in any specific term we want for 𝑥 and get rid of the ∀.",
    ],
    rules: [
      UniversalElimination,
    ],
    propositions: [
      forall("𝑥", not(lit("𝑥 is the largest prime number"))),
    ],
    target: not(lit("101 is the largest prime number")),
  },

  {
    name: "Universal Elimination Practice",
    description: [
      "It's very common that universal propositions are of the form ∀𝑥((𝑃) → (𝑄)).",
    ],
    rules: [
      ConditionalElimination,
      UniversalElimination,
    ],
    propositions: [
      lit("Socrates is a human"),
      forall("𝑥", then(lit("𝑥 is a human"), lit("𝑥 is mortal"))),
    ],
    target: lit("Socrates is mortal"),
  },

  {
    name: "Rule #4: Universal Introduction",
    description: [
      "Propositions that start with \"∀\" are very useful when given, but they are very hard to add to your bank by yourself.",
      "The idea behind universal introduction is that if you can prove a proposition about something you know nothing about, then you could have proven that proposition about anything.",
    ],
    rules: [
      LawOfExcludedMiddle,
      UniversalIntroduction,
    ],
    propositions: [],
    target: forall("𝑥", or(eq("𝑥", "0"), not(eq("𝑥", "0")))),
  },

  {
    name: "Universal Introduction Practice",
    description: [
      "It's very rare that you will have to create universal propositions yourself. But if ever you need to, chances are you'll have other universals to help you.",
    ],
    rules: [
      HypotheticalSyllogism,
      UniversalIntroduction,
      UniversalElimination,
    ],
    propositions: [
      forall("𝑥", then(lit("𝑥 is a human"), lit("𝑥 is an animal"))),
      forall("𝑥", then(lit("𝑥 is an animal"), lit("𝑥 is mortal"))),
    ],
    target: forall("𝑥", then(lit("𝑥 is a human"), lit("𝑥 is mortal"))),
  },

  {
    name: "Rule #5: Existential Introduction",
    description: [
      "The behaviour of the \"∃\" symbol is inspired by the words \"there exists\". The idea is for \"∃𝑥(𝑃)\" to mean that theres exists a \"thing\" such that 𝑃 is true for that thing.",
      "The idea behind existential introduction is that if you now that 𝑃 is true for a specific thing, then you know that there exists a thing for which 𝑃 is true.",
    ],
    rules: [
      ConditionalElimination,
      UniversalElimination,
      ExistentialIntroduction,
    ],
    propositions: [
      lit("Socrates is a human"),
      forall("𝑥", then(lit("𝑥 is a human"), lit("𝑥 is mortal"))),
    ],
    target: exists("𝑥", lit("𝑥 is mortal")),
  },

  {
    name: "Rule #6: Existential Elimination",
    description: [],
    rules: [
      ConditionalElimination,
      UniversalElimination,
      ExistentialIntroduction,
      ExistentialElimination,
    ],
    propositions: [
      exists("𝑥", lit("𝑥 is a human")),
      forall("𝑥", then(lit("𝑥 is a human"), lit("𝑥 is an animal"))),
    ],
    target: exists("𝑥", lit("𝑥 is an animal")),
  },
];
export default FIRST_ORDER_LOGIC;
