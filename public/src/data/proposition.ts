export enum PropositionType {
  LITERAL,
  NEGATION,
  CONJUNCTION,
  DISJUNCTION,
}

export type Proposition = Literal|Negation|Conjunction|Disjunction;

export default class PropositionHelpers {
  public static types = PropositionType;
  public static isLiteral(p: Proposition): p is Literal {
    return p.type == PropositionType.LITERAL;
  }
  public static isNegation(p: Proposition): p is Negation {
    return p.type == PropositionType.NEGATION;
  }
  public static isConjunction(p: Proposition): p is Conjunction {
    return p.type == PropositionType.CONJUNCTION;
  }
  public static isDisjunction(p: Proposition): p is Disjunction {
    return p.type == PropositionType.DISJUNCTION;
  }

  public static areTheSame(p1: Proposition, p2: Proposition): boolean {
    if (p1.type != p2.type) {
      return false;
    }
    if (PropositionHelpers.isLiteral(p1) && PropositionHelpers.isLiteral(p2)) {
      return p1.content == p2.content;
    } else if (PropositionHelpers.isNegation(p1) && PropositionHelpers.isNegation(p2)) {
      return PropositionHelpers.areTheSame(p1.proposition, p2.proposition);
    } else if (PropositionHelpers.isConjunction(p1) && PropositionHelpers.isConjunction(p2)) {
      return PropositionHelpers.areTheSame(p1.left, p2.left) && PropositionHelpers.areTheSame(p1.right, p2.right);
    } else if (PropositionHelpers.isDisjunction(p1) && PropositionHelpers.isDisjunction(p2)) {
      return PropositionHelpers.areTheSame(p1.left, p2.left) && PropositionHelpers.areTheSame(p1.right, p2.right);
    }
    throw new Error(`Unknown proposition types: ${JSON.stringify(p1)}\n${JSON.stringify(p2)}`);
  }

  public static toString(p: Proposition): string {
    if (PropositionHelpers.isLiteral(p)) {
      return p.content;
    } else if (PropositionHelpers.isNegation(p)) {
      let x = PropositionHelpers.toString(p.proposition);
      return `¬(${x})`;
    } else if (PropositionHelpers.isConjunction(p)) {
      let l = PropositionHelpers.toString(p.left);
      let r = PropositionHelpers.toString(p.right);
      return `(${l}) ∧ (${r})`;
    } else if (PropositionHelpers.isDisjunction(p)) {
      let l = PropositionHelpers.toString(p.left);
      let r = PropositionHelpers.toString(p.right);
      return `(${l}) ∨ (${r})`;
    }
    throw new Error("Unknown proposition type: " + JSON.stringify(p));
  }
}

export interface Literal {
  readonly type: PropositionType.LITERAL,
  readonly content: string,
}

export interface Negation {
  readonly type: PropositionType.NEGATION,
  readonly proposition: Proposition,
}

export interface Conjunction {
  readonly type: PropositionType.CONJUNCTION,
  readonly left: Proposition,
  readonly right: Proposition,
}

export interface Disjunction {
  readonly type: PropositionType.DISJUNCTION,
  readonly left: Proposition,
  readonly right: Proposition,
}

export function lit(content: string): Literal {
  return {
    type: PropositionType.LITERAL,
    content: content,
  };
}

export function not(p: Proposition): Negation {
  return {
    type: PropositionType.NEGATION,
    proposition: p,
  };
}

export function and(a: Proposition, b: Proposition): Conjunction {
  return {
    type: PropositionType.CONJUNCTION,
    left: a,
    right: b,
  };
}

export function or(a: Proposition, b: Proposition): Disjunction {
  return {
    type: PropositionType.DISJUNCTION,
    left: a,
    right: b,
  };
}
