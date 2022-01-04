import Proposition, { Predicate } from './proposition.js'
import Equality from './equality.js'
import { Term } from '../term.js'

function split(indices: number[], cutoff: number): [number[], number[]] {
  const l = indices.filter(index => index < cutoff);
  const r = indices.filter(index => index >= cutoff).map(index => index - cutoff);
  return [l, r];
}

export default abstract class BinaryProposition extends Proposition {
  public readonly symbol: string;
  public readonly l: Proposition;
  public readonly r: Proposition;

  constructor(l: Proposition, r: Proposition, symbol: string) {
    super();
    this.l = l;
    this.r = r;
    this.symbol = symbol
  }

  public toString(): string {
    return `(${this.l.toString()}) ${this.symbol} (${this.r.toString()})`;
  }

  public equals(p: Proposition): boolean {
    if (p instanceof BinaryProposition) {
      return this.symbol == p.symbol && this.l.equals(p.l) && this.r.equals(p.r);
    }
    return false;
  }

  public allLiterals(): string[] {
    return [...new Set(this.l.allLiterals().concat(this.r.allLiterals()))];
  }

  public allEqualities(): Equality[] {
    const lList = this.l.allEqualities();
    const rList = this.r.allEqualities().filter(rp => {
      for (const lp of lList) {
        if (rp.equals(lp)) {
          return false;
        }
        return true;
      }
    });
    return lList.concat(rList);
  }

  public allTerms(): string[] {
    return [...new Set(this.l.allTerms().concat(this.r.allTerms()))];
  }

  public allBoundVariables(): string[] {
    return [...new Set(this.l.allBoundVariables().concat(this.r.allBoundVariables()))];
  }

  public allPredicates(): Predicate[] {
    const lList = this.l.allPredicates();
    const rList = this.r.allPredicates().filter(rp => {
      for (const lp of lList) {
        if (rp.equals(lp)) {
          return false;
        }
        return true;
      }
    });
    return lList.concat(rList);
  }

  public numOccurances(target: Term): number {
    return this.l.numOccurances(target) + this.r.numOccurances(target);
  }
}

export class ConjunctionProposition extends BinaryProposition {
  constructor(l: Proposition, r: Proposition) {
    super(l, r, '∧');
  }

  public replace(target: Term, replacement: Term, indices: number[]): ConjunctionProposition {
    const s = split(indices, this.l.numOccurances(target));
    const newL = this.l.replace(target, replacement, s[0]);
    const newR = this.r.replace(target, replacement, s[1]);
    return new ConjunctionProposition(newL, newR);
  }
}

export class DisjunctionProposition extends BinaryProposition {
  constructor(l: Proposition, r: Proposition) {
    super(l, r, '∨');
  }

  public replace(target: Term, replacement: Term, indices: number[]): DisjunctionProposition {
    const s = split(indices, this.l.numOccurances(target));
    const newL = this.l.replace(target, replacement, s[0]);
    const newR = this.r.replace(target, replacement, s[1]);
    return new DisjunctionProposition(newL, newR);
  }
}

export class ConditionalProposition extends BinaryProposition {
  constructor(l: Proposition, r: Proposition) {
    super(l, r, '→');
  }

  public replace(target: Term, replacement: Term, indices: number[]): ConditionalProposition {
    const s = split(indices, this.l.numOccurances(target));
    const newL = this.l.replace(target, replacement, s[0]);
    const newR = this.r.replace(target, replacement, s[1]);
    return new ConditionalProposition(newL, newR);
  }
}
