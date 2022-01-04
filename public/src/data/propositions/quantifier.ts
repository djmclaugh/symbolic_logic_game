import Proposition, { Predicate } from './proposition.js'
import Equality from './equality.js'
import { lit } from './propositions.js'
import { Term, Variable } from '../term.js'

export default abstract class QuantifierProposition extends Proposition {
  public readonly symbol: string;
  public readonly v: Variable;
  public readonly p: Proposition;

  constructor(v: Variable, p: Proposition, symbol: string) {
    super();
    this.v = v;
    this.p = p;
    this.symbol = symbol
  }

  public toString(): string {
    return `${this.symbol}${this.v}(${this.p.toString()})`;
  }

  public equals(p: Proposition): boolean {
    if (p instanceof QuantifierProposition) {
      return this.symbol == p.symbol && this.v == p.v && this.p.equals(p.p);
    }
    return false;
  }

  public allLiterals(): string[] {
    return this.p.allLiterals().filter(l => l.indexOf(this.v) == -1);
  }

  public allEqualities(): Equality[] {
    return this.p.allEqualities().filter(e => (e.l.indexOf(this.v) == -1 && e.r.indexOf(this.v) == -1));
  }

  public allTerms(): string[] {
    return this.p.allTerms().filter(l => l.indexOf(this.v) == -1);
  }

  public allBoundVariables(): string[] {
    return [this.v, ...this.p.allBoundVariables()];
  }

  public allPredicates(): Predicate[] {
    const result: Predicate[] = [];
    this.p.allLiterals().filter(l => l.indexOf(this.v) != -1).forEach(l => {
      result.push(new Predicate(lit(l), [this.v]))
    });
    // this.p.allEqualities().filter(e => e.l.indexOf(this.v) != -1 || e.r.indexOf(this.v) != -1).forEach(e => {
    //   result.push(new Predicate(e, [this.v]))
    // });
    this.p.allPredicates().forEach(p => {
      if (p.p.numOccurances(this.v) == 0) {
        result.push(p);
      } else {
        result.push(new Predicate(p.p, [this.v, ... p.v]))
      }
    })
    return result;
  }

  public numOccurances(target: Term): number {
    if (this.v == target) {
      return 0;
    }
    return this.p.numOccurances(target);
  }
}

export class UniversalProposition extends QuantifierProposition {
  constructor(v: Variable, p: Proposition) {
    super(v, p, '∀');
  }

  public replace(target: Term, replacement: Term, indices: number[]): UniversalProposition {
    return new UniversalProposition(this.v, this.p.replace(target, replacement, indices));
  }
}

export class ExistentialProposition extends QuantifierProposition {
  constructor(v: Variable, p: Proposition) {
    super(v, p, '∃');
  }

  public replace(target: Term, replacement: Term, indices: number[]): ExistentialProposition {
    return new ExistentialProposition(this.v, this.p.replace(target, replacement, indices));
  }
}
