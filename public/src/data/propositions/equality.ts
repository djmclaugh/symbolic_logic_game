import Proposition, { Predicate } from './proposition.js'
import { Term } from '../term.js'

export default class EqualityProposition extends Proposition {
  public readonly l: Term;
  public readonly r: Term;

  constructor(l: Term, r: Term) {
    super();
    this.l = l;
    this.r = r;
  }

  public toString(): string {
    return `${this.l} = ${this.r}`;
  }

  public equals(p: Proposition): boolean {
    if (p instanceof EqualityProposition) {
      return this.l == p.l && this.r == p.r;
    }
    return false;
  }

  public allLiterals(): string[] {
    return [];
  }

  public allEqualities(): EqualityProposition[] {
    return [this];
  }

  public allTerms(): string[] {
    let list = [];
    list.push(this.l);
    list.push(this.r);
    list = list.concat(this.l.split(" "));
    list = list.concat(this.r.split(" "));
    return [...new Set(list)];
  }

  public allBoundVariables(): string[] {
    return [];
  }

  public allPredicates(): Predicate[] {
    return [];
  }

  public numOccurances(target: Term): number {
    let total = 0;
    let currentIndex = this.l.indexOf(target);
    while (currentIndex != -1) {
      total += 1;
      currentIndex = this.l.indexOf(target, currentIndex + 1);
    }
    currentIndex = this.r.indexOf(target);
    while (currentIndex != -1) {
      total += 1;
      currentIndex = this.r.indexOf(target, currentIndex + 1);
    }
    return total;
  }

  public replace(target: Term, replacement: Term, indices: number[]): EqualityProposition {
    let occurence = 0;
    const newL = this.l.replaceAll(target, (match) => {
      if (indices.indexOf(occurence++) == - 1) {
        return match;
      } else {
        return replacement;
      }
    });
    const newR = this.r.replaceAll(target, (match) => {
      if (indices.indexOf(occurence++) == - 1) {
        return match;
      } else {
        return replacement;
      }
    });
    return new EqualityProposition(newL, newR);
  }
}
