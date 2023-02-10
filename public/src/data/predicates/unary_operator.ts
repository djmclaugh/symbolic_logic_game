import Predicate from './predicate.js'
import Term from '../terms/term.js'

export default abstract class UnaryOperatorPredicate extends Predicate {
  public abstract get symbol(): string;

  public get slots() {
    return this.sub.slots;
  }

  constructor(public readonly sub: Predicate) {
    super();
  }

  public toString(slotIndexStart: number = 0) {
    const s = this.sub.toString(slotIndexStart);
    return `${this.symbol}(${s})`;
  }

  public toHTMLString(slotIndexStart: number = 0) {
    const s = this.sub.toHTMLString(slotIndexStart);
    return `${this.symbol}(${s})`;
  }

  public allBoundVariables(): Term[] {
    return this.sub.allBoundVariables();
  }

  public getLiteralPredicates() {
    return this.sub.getLiteralPredicates();
  }

  public equals(p: Predicate): boolean {
    if (p instanceof UnaryOperatorPredicate) {
      return p.sub.equals(this.sub) && p.symbol == this.symbol;
    }
    return false;
  }
}
