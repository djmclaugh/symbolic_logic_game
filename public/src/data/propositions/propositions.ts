export enum PropositionType {
  LITERAL,
  NEGATION,
  CONJUNCTION,
  DISJUNCTION,
  CONDITIONAL,
  EQUALITY,
  UNIVERSAL,
  EXISTENTIAL,
}

export const PROPOSITION_TYPES = [
  PropositionType.LITERAL,
  PropositionType.NEGATION,
  PropositionType.CONJUNCTION,
  PropositionType.DISJUNCTION,
  PropositionType.CONDITIONAL,
]

export const FOL_PROPOSITION_TYPES = [
  PropositionType.LITERAL,
  PropositionType.NEGATION,
  PropositionType.CONJUNCTION,
  PropositionType.DISJUNCTION,
  PropositionType.CONDITIONAL,
  PropositionType.EQUALITY,
  PropositionType.UNIVERSAL,
  PropositionType.EXISTENTIAL,
]

export function propositionTypeToString(t: PropositionType) {
  switch(t) {
    case PropositionType.LITERAL:
      return "No Logical Symbols";
    case PropositionType.NEGATION:
      return "Negation (¬)";
    case PropositionType.CONJUNCTION:
      return "Conjunction (∧)";
    case PropositionType.DISJUNCTION:
      return "Disjunction (∨)";
    case PropositionType.CONDITIONAL:
      return "Conditional (→)";
    case PropositionType.EQUALITY:
      return "Equality (=)";
    case PropositionType.UNIVERSAL:
      return "Universal (∀)";
    case PropositionType.EXISTENTIAL:
      return "Existential (∃)";
  }
}
