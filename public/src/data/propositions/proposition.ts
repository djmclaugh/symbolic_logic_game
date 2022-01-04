import { Term, Variable } from '../term.js'
import Equality from './equality.js'

const SUBSCRIPT_DIGITS = "₀₁₂₃₄₅₆₇₈₉";
function toSubscriptString(x: number): string {
  const characters: string[] = x.toString().split("");
  for (let i = 0; i < characters.length; ++i) {
    const digit = parseInt(characters[i])
    if (!isNaN(digit)) {
      characters[i] = SUBSCRIPT_DIGITS[digit];
    }
  }
  return characters.join("");
}

export class Predicate {
  public readonly p: Proposition;
  public readonly v: Variable[];

  constructor(p: Proposition, v: Variable[]) {
    this.p = p;
    this.v = v;
  }

  apply(terms: Term[]): Proposition {
    if (terms.length != this.v.length) {
      throw new Error(`This predicate requires ${this.v.length} terms but ${terms.length} were provided.` )
    }
    let result = this.p;
    for (let i = 0; i < this.v.length; ++i) {
      result = result.replaceAll(this.v[i], terms[i]);
    }
    return result;
  }

  toString(): string {
    let result = this.p;
    for (let i = 0; i < this.v.length; ++i) {
      result = result.replaceAll(this.v[i], `?${toSubscriptString(i)}`);
    }
    return result.toString();
  }

  equals(p: Predicate): boolean {
    return this.toString() == p.toString();
  }
}

export default abstract class Proposition {
  public abstract toString(): string;
  public abstract equals(p: Proposition): boolean;

  public abstract allLiterals(): string[];
  public abstract allEqualities(): Equality[];
  public abstract allTerms(): string[];
  public abstract allBoundVariables(): string[];
  public abstract allPredicates(): Predicate[];

  public abstract numOccurances(target: Term): number;
  public abstract replace(target: Term, replacement: Term, indices: number[]): Proposition;
  public replaceAll(target: Term, replacement: Term): Proposition {
    const count = this.numOccurances(target);
    const indices = [];
    for (let i = 0; i < count; ++i) {
      indices.push(i);
    }
    return this.replace(target, replacement, indices);
  }
}
