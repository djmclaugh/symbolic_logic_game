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
  DeonticAxiom,
  ReflexiveAxiom,
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
      "Use necessity equivalence with (I am polite) ∧ (I am courteous) as proposition 𝐴 and (I am courteous) ∧ (I am polite) as propoosition 𝐵.",
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
      "Any modal logic that has the necessitation and distribution rules is called a normal modal logic.",
      "Using the necessitation and distribution rules, you can derive the equivalence rule we saw earlier.",
    ],
    hints: [
      "Using necessitation, deduce □((it will rain) → (¬(¬(it will rain)))) and □((¬(¬(it will rain))) → (it will rain)) individually.",
      "Use distribution on both these necessary conditionals, then combine them with biconditional introduction.",
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
    name: 'Deontic Axiom',
    description: [
      "The deontic axiom says that if you have □(𝑃), then you can deduce ◇(𝑃).\nIf something is necessary, then it's possible.",
      "All the previous rules arguably applied to all natural concepts of necessity/possibility.\nBut this rule arguably doesn't always apply to the everyday meaning of necessity/possibility.\nFor example, if you have a very unreasonable boss, they might tell you that you need to have your report done by yesterday even though it's not possible to time travel.",
      "That being said, this situation is only possible if your concept of necessity is \"unreasonable\".\nIf your goal is to explore whether or not your concept of necessity is \"reasonable\", then don't assume the deontic axiom and see if you can deduce such a situation.\nBut if your goal is to work with a \"reasonable\" concept of necessity, then you probably want the deontic axiom (in some form or another).",
      "This rule is called the deontic axiom or just D because it is highly associated with deontic logic.\nMost other modal logics instead use a stronger version of this axiom that we'll see later.",
    ],
    rules: [
      Duality,
      DeonticAxiom,
    ],
    propositions: [
      not(can("it will rain"))
    ],
    target: can(not("it will rain")),
    allowedPropositionTypes: [
      PropositionType.LITERAL,
      PropositionType.POSSIBILITY,
    ],
  },

  {
    name: 'Deontic Axiom Practice',
    description: [
      "If it must rain, then it can't be necessary that it won't rain.",
    ],
    rules: [
      DetectContradiction,
      ProofOfNegation,
      Duality,
      DeonticAxiom,
    ],
    propositions: [
      must("it will rain"),
    ],
    target: not(must(not("it will rain"))),
    allowedPropositionTypes: [
      PropositionType.LITERAL,
      PropositionType.NEGATION,
      PropositionType.NECESSITY,
    ],
  },

  {
    name: 'T Axiom',
    description: [
      "The T axiom says that if you have □(𝑃), then you can deduce 𝑃.\nIf something is necessary, then it's also the case.\nAs you'll show in this level, this is an upgraded version of the deontic axiom (in the sense that you can deduce the deontic axiom by assuming axiom T).",
      "This rule is intuitive for must concepts of necessity, but it doesn't really hold for deontic necessity.\nEven though it could be argued that it's morally required to be honest, that doesn't mean that people are honest.",
      "That's why deontic logic sticks with the deontic axiom instead of accepting T.",
    ],
    rules: [
      DetectContradiction,
      ProofByContradiction,
      Duality,
      ReflexiveAxiom,
    ],
    propositions: [
      must("it will rain")
    ],
    target: can("it will rain"),
    allowedPropositionTypes: [
      PropositionType.LITERAL,
      PropositionType.POSSIBILITY,
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
