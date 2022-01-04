import Proposition, { Predicate } from './proposition.js'
import Equality from './equality.js'
import { Term } from '../term.js'

export default class NegationProposition extends Proposition {
  public readonly subProp: Proposition;

  constructor(subProp: Proposition) {
    super();
    this.subProp = subProp;
  }

  public toString(): string {
    return `¬(${this.subProp.toString()})`;
  }

  public equals(p: Proposition): boolean {
    if (p instanceof NegationProposition) {
      return this.subProp.equals(p.subProp);
    }
    return false;
  }

  public allLiterals(): string[] {
    return this.subProp.allLiterals();
  }

  public allEqualities(): Equality[] {
    return this.subProp.allEqualities();
  }

  public allTerms(): string[] {
    return this.subProp.allTerms();
  }

  public allBoundVariables(): string[] {
    return this.subProp.allBoundVariables();
  }

  public allPredicates(): Predicate[] {
    return this.subProp.allPredicates();
  }

  public numOccurances(target: Term): number {
    return this.subProp.numOccurances(target);
  }

  public replace(target: Term, replacement: Term, indices: number[]): NegationProposition {
    return new NegationProposition(this.subProp.replace(target, replacement, indices));
  }
}
