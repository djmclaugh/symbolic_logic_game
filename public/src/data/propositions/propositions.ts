export enum PropositionType {
  LITERAL,
  NEGATION,
  CONJUNCTION,
  DISJUNCTION,
  CONDITIONAL,
  BICONDITIONAL,
  EQUALITY,
  UNIVERSAL,
  EXISTENTIAL,
  NECESSITY,
  POSSIBILITY,
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

export const MODAL_LOGIC_PROPOSITION_TYPES = [
  PropositionType.LITERAL,
  PropositionType.NEGATION,
  PropositionType.CONJUNCTION,
  PropositionType.DISJUNCTION,
  PropositionType.CONDITIONAL,
  PropositionType.NECESSITY,
  PropositionType.POSSIBILITY,
]

export function propositionTypeToString(t: PropositionType) {
  switch(t) {
    case PropositionType.LITERAL:
      return "Simple Proposition";
    case PropositionType.NEGATION:
      return "Negation (¬)";
    case PropositionType.CONJUNCTION:
      return "Conjunction (∧)";
    case PropositionType.DISJUNCTION:
      return "Disjunction (∨)";
    case PropositionType.CONDITIONAL:
      return "Conditional (→)";
    case PropositionType.BICONDITIONAL:
      return "Biconditional (↔)";
    case PropositionType.EQUALITY:
      return "Equality (=)";
    case PropositionType.UNIVERSAL:
      return "Universal (∀)";
    case PropositionType.EXISTENTIAL:
      return "Existential (∃)";
    case PropositionType.NECESSITY:
      return "Necessity (□)";
    case PropositionType.POSSIBILITY:
      return "Possibility (◇)";
  }
}
