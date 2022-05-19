import Predicate from './predicate.js'
import Term from '../terms/term.js'

export default abstract class QuantifierPredicate extends Predicate {
  public abstract get symbol(): string;

  public get slots() {
    return this.subPredicate.slots;
  }

  constructor(public readonly variable: Term, public readonly subPredicate: Predicate) {
    super();
  }

  public toString(slotIndexStart: number = 0) {
    return `${this.symbol}${this.variable} (${this.subPredicate.toString(slotIndexStart)})`;
  }

  public toHTMLString(slotIndexStart: number = 0) {
    return `${this.symbol}${this.variable} (${this.subPredicate.toHTMLString(slotIndexStart)})`;
  }

  public allBoundVariables(): Term[] {
    return this.subPredicate.allBoundVariables().concat([this.variable]);
  }

  public getLiteralPredicates() {
    return this.subPredicate.getLiteralPredicates();
  }

  public equals(p: Predicate): boolean {
    if (p instanceof QuantifierPredicate) {
      return p.subPredicate.equals(this.subPredicate) && p.variable.equals(this.variable) && p.symbol == this.symbol;
    }
    return false;
  }
}
