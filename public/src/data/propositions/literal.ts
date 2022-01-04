import { Term } from '../term.js'
import Equality from './equality.js'
import Proposition, { Predicate } from './proposition.js'

export default class LiteralProposition extends Proposition {
  public readonly symbols: string

  constructor(s: string) {
    super();
    this.symbols = s;
  }

  public toString() {
    return this.symbols;
  }

  public equals(p: Proposition): boolean {
    if (p instanceof LiteralProposition) {
      return this.symbols == p.symbols;
    }
    return false;
  }

  public allLiterals(): string[] {
    return [this.symbols];
  }

  public allEqualities(): Equality[] {
    return [];
  }

  public allTerms(): string[] {
    return this.symbols.split(" ");
  }

  public allBoundVariables(): string[] {
    return [];
  }

  public allPredicates(): Predicate[] {
    return [];
  }

  public numOccurances(target: Term): number {
    let total = 0;
    let currentIndex = this.symbols.indexOf(target);
    while (currentIndex != -1) {
      total += 1;
      currentIndex = this.symbols.indexOf(target, currentIndex + 1);
    }
    return total;
  }

  public replace(target: Term, replacement: Term, indices: number[]): Proposition {
    let occurence = 0;
    const newSymbols = this.symbols.replaceAll(target, (match) => {
      if (indices.indexOf(occurence++) == - 1) {
        return match;
      } else {
        return replacement;
      }
    });
    return new LiteralProposition(newSymbols);
  }
}
