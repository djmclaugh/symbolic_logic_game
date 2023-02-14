import Predicate from './predicate.js'
import Term from '../terms/term.js'
import { lit } from './literal.js';

export default abstract class UnaryOperatorPredicate extends Predicate {
  public readonly sub: Predicate;
  public abstract get symbol(): string;

  public get slots() {
    return this.sub.slots;
  }

  constructor(sub: Predicate|string) {
    super();
    this.sub = (sub instanceof Predicate) ? sub : lit(sub);
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
