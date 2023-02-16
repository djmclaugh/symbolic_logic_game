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
  DoubleNegationEquivalence,
  ConjunctionCommutation,
  DoubleNegationIntroduction,
  ModusTollens,
  LawOfNoncontradiction,
  LawOfExcludedMiddle,
} from '../inference_rules/propositional_logic_derived.js'

import {
  DetectContradiction,
  ProofOfNegation,
  ProofByContradiction,
} from '../inference_rules/propositional_logic_negation.js'

import {
  NecessityEquivalence,
  PossibilityEquivalence,
  Necessitation,
  Distribution,
  Duality,
} from '../inference_rules/modal_logic.js'

import { lit } from '../predicates/literal.js'
import { not } from '../predicates/negation.js'
import { and } from '../predicates/conjunction.js'
import { then } from '../predicates/conditional.js'
import { iff } from '../predicates/biconditional.js'
import { or } from '../predicates/disjunction.js'
import { must } from '../predicates/box.js'
import { can } from '../predicates/diamond.js'
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

const MODAL_LOGIC: Level[] = [
  {
    name: 'Introduction to Modal Logic',
    description: [
      "Modal logic is built on top of propositional logic.\nAll inference rules (assumed and derived) will be taken for granted.",
      "I highly recommend you complete the propositional logic levels first.",
    ],
    rules: [
      ConditionalElimination,
    ],
    propositions: [
      then(can("It will rain"), must("I bring an umbrella")),
      can("It will rain"),
    ],
    target: must("I bring an umbrella"),
  },

  {
    name: 'Necessity Symbol',
    description: [
      "Modal logics introduce new logical symbols with the goal to express different modalities.",
      "For example, consider the sentences \"I eat breakfast\" and \"I must eat breakfast\".\n\"I eat breakfast\" is in the indicative mood. It makes a claim about the current state of affairs.\n\"I must eat breakfast\" is in the potential mood because of the modal verb \"must\". It's not saying anything about whether I'm currently having breakfast or not.\nIt's only saying that me eating breakfast is necessary.",
      "That's the idea behind the necessity symbol: □\nThe idea behind □(I eat breakfast) is to mean \"It's necessary that I eat breakfast\".",
      "There's a big issue with that idea though.\nThere are many different concepts of necessity!",
      "Relative Necessity: If someone says \"I must eat breakfast\", they probably don't mean it in an absolute sense.\nThey probably mean something like \"I must eat breakfast in order to ...\" followed by something that is assumed to be desired based on context.\nFor example, they could mean \"I must eat breakfast in order to have a good day\".\nAs another example, if someone says \"You must fill out the form\", they probably mean something like \"You must fill out the form in order to start your application\".",
      "Logical Necessity: Something is logically necessary if it's a tautology.",
      "Physical Necessity: Something is a physically necessary if it's implied by the laws of physics.",
      "Deontic Necessity: Something is deontically necessary if it's a moral obligation.",
      "And many more!",
      "So depending on which concept of necessity that we want to model with the □ symbol, we'll have to chose potentially very different inference rules.",
      "However, there's one inference rule that practically every modal logic has.\nIf 𝑃 and 𝑄 are logically equivalent propositions, then you can deduce that □(𝑃) and □(𝑄) are also equivalent.\nIn other words, if you can show that 𝑃 ↔ 𝑄 is a tautology, then you can deduce □(𝑃) ↔ □(𝑄).", 
    ],
    hints: [
      "The beat this level, use necessity equivalence with (I am polite) ∧ (I am courteous) as proposition 𝐴 and (I am courteous) ∧ (I am polite) as propoosition 𝐵.",
    ],
    rules: [
      ConjunctionCommutation,
      ConditionalIntroduction,
      BiconditionalIntroduction,
      NecessityEquivalence,
    ],
    propositions: [],
    target: iff(must(and("I am polite", "I am courteous")), must(and("I am courteous", "I am polite"))),
    allowedPropositionTypes: [
      PropositionType.LITERAL,
      PropositionType.CONJUNCTION,
    ],
  },

  {
    name: 'Possibility Symbol',
    description: [
      "The idea behind the □ symbol is necessity.\nThe idea is for □(I eat breakfast) to mean \"it's necessary that I eat breakfast\", or in other words, \"I must eat breakfast\".",
      "Most modal logics also introduce a second logical symbol: ◇\nThe idea behind the ◇ symbol is possibility.\nThe idea is for ◇(I eat breakfast) to mean \"it's possible that I eat breakfast\", or in other words, \"I can eat breakfast\".",
      "Just like necessity, there are many different concepts of possibility!\nDepending on which concept of possibility that we want to model with the ◇ symbol, we'll have to chose potentially very different inference rules.",
      "But again, there's one inference rule that practically every modal logic has.\nIf 𝑃 and 𝑄 are logically equivalent propositions, then you can deduce that ◇(𝑃) and ◇(𝑄) are also equivalent.\nIn other words, if you can show that 𝑃 ↔ 𝑄 is a tautology, then you can deduce ◇(𝑃) ↔ ◇(𝑄).",
    ],
    rules: [
      DoubleNegationIntroduction,
      DoubleNegationElimination,
      ConditionalIntroduction,
      BiconditionalIntroduction,
      PossibilityEquivalence,
    ],
    propositions: [],
    target: iff(can("it will rain"), can(not(not("it will rain")))),
    allowedPropositionTypes: [
      PropositionType.LITERAL,
      PropositionType.NEGATION,
    ],
  },

  {
    name: 'Duality',
    description: [
      "Another rule that practically every modal logic has is the duality between □ and ◇.\nIf you have ¬(◇(𝑃)), you can deduce □(¬(𝑃))) and vice versa.\nIf you have ¬(□(𝑃)), you can deduce ◇(¬(𝑃))) and vice versa.",
      "If something is not possible, then it must be false (and vice versa).\nIf something is not necessary, then it can be false (and vice versa).",

      "Any modal logic that has the equivalence and duality rules is called a classical modal logic.",
    ],
    rules: [
      DoubleNegationEquivalence,
      ConditionalElimination,
      BiconditionalElimination,
      NecessityEquivalence,
      Duality,
    ],
    propositions: [
	not(can(not("it will rain"))),
    ],
    target: must("it will rain"),
    allowedPropositionTypes: [
      PropositionType.LITERAL,
      PropositionType.NEGATION,
    ],
  },

  {
    name: 'Duality Practice',
    description: [
      "Same level, but in the reverse direction.",
    ],
    rules: [
      Duality,
      DetectContradiction,
      ProofOfNegation,
    ],
    propositions: [
	must("it will rain"),
    ],
    target: not(can(not("it will rain"))),
    allowedPropositionTypes: [
      PropositionType.LITERAL,
      PropositionType.NEGATION,
      PropositionType.POSSIBILITY,
    ],
  },

  {
    name: 'Necessitation',
    description: [
      "Another rule that's practically always accepted is necessitation (sometimes just called N).",
      "It says that if something is a tautology, then it's necessary.\nIn other words, if something is a logical necessity, then it's a relative/physical/deontic/whatever necessity.",
      "This rule is intuitive for physical necessity since it's usually accepted that the laws of physics also follow the laws of logic.\nBut an argument could be made against using this rule for deontic necessity.\nSaying that you're morally obligated to steal or not steal sounds a bit weird.\nBut then, as a counter argument, if your laws of morality don't follow the laws of the logic you're using, maybe you shouldn't be trying to model your laws of morality with that logic in the first place."
    ],
    hints: [
      "First use necessitation to deduce □(¬((it will rain) ∧ (¬(it will rain)))) by proving that ¬((it will rain) ∧ (¬(it will rain))) is a tautology.",
    ],
    rules: [
      LawOfNoncontradiction,
      Duality,
      Necessitation,
    ],
    propositions: [],
    target: not(can(and("it will rain", not("it will rain")))),
    allowedPropositionTypes: [
      PropositionType.LITERAL,
      PropositionType.CONJUNCTION,
      PropositionType.NEGATION,
    ],
  },

  {
    name: 'Distribution',
    description: [
      "Another rule that's practically always accepted is distribution (sometimes called the Kripke schema or just K).",
      "It says that if you have □((𝑃) → (𝑄)), then you can deduce (□(𝑃)) → (□(𝑄)).\nIn other words, you can distribute the □ symbol inside a conditional.",
      "Any modal logic that has the necessitation and distribution rules is called a normal modal logics.",
      "Using the necessitation and distribution rules, you can derive the equivalence rule we saw earlier.",
    ],
    rules: [
      DoubleNegationEquivalence,
      BiconditionalIntroduction,
      BiconditionalElimination,
      Necessitation,
      Distribution,
    ],
    propositions: [],
    target: iff(must("it will rain"), must(not(not("it will rain")))),
    allowedPropositionTypes: [
      PropositionType.LITERAL,
      PropositionType.CONDITIONAL,
      PropositionType.NEGATION,
    ],
  },


  {
    name: 'World Complete!',
    description: [
      "That's it for modal logic for now!",
      "More levels will hopefully be added.",
      "Until then, try out first-order logic.",
    ],
    rules: [
      DetectContradiction,
      ProofOfNegation,
      ProofByContradiction,
    ],
    propositions: [],
    target: lit("⊥"),
    allowedPropositionTypes: BASE_TYPES,
  },

];
export default MODAL_LOGIC;
