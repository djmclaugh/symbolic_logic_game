import Proposition from './proposition.js'
import LiteralProposition from './literal.js'
import NegationProposition from './negation.js'
import {
  ConjunctionProposition,
  DisjunctionProposition,
  ConditionalProposition
} from './binary.js'
import EqualityProposition from './equality.js'
import {
  UniversalProposition,
  ExistentialProposition,
} from './quantifier.js'

import {Term, Variable} from '../term.js'

export function lit(symbols: string): LiteralProposition {
  return new LiteralProposition(symbols);
}

export function not(p: Proposition): NegationProposition {
  return new NegationProposition(p);
}

export function and(l: Proposition, r: Proposition): ConjunctionProposition {
  return new ConjunctionProposition(l, r);
}

export function or(l: Proposition, r: Proposition): DisjunctionProposition {
  return new DisjunctionProposition(l, r);
}

export function then(l: Proposition, r: Proposition): ConditionalProposition {
  return new ConditionalProposition(l, r);
}

export function eq(l: Term, r: Term): EqualityProposition {
  return new EqualityProposition(l, r);
}

export function forall(v: Variable, p: Proposition): UniversalProposition {
  return new UniversalProposition(v, p);
}

export function exists(v: Variable, p: Proposition): ExistentialProposition {
  return new ExistentialProposition(v, p);
}

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
      return "Literal";
    case PropositionType.NEGATION:
      return "Negation";
    case PropositionType.CONJUNCTION:
      return "Conjunction";
    case PropositionType.DISJUNCTION:
      return "Disjunction";
    case PropositionType.CONDITIONAL:
      return "Conditional";
    case PropositionType.EQUALITY:
      return "Equality";
    case PropositionType.UNIVERSAL:
      return "Universal";
    case PropositionType.EXISTENTIAL:
      return "Existential";
  }
}
