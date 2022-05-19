import Predicate from './predicate.js'
import Term from '../terms/term.js'

export default abstract class BinaryOperatorPredicate extends Predicate {
  public abstract get symbol(): string;

  public get slots() {
    return this.left.slots.concat(this.right.slots);
  }

  constructor(public readonly left: Predicate, public readonly right: Predicate) {
    super();
  }

  public toString(slotIndexStart: number = 0) {
    const l = this.left.toString(slotIndexStart);
    const r = this.right.toString(slotIndexStart + this.left.emptyIndices().length);
    return `(${l}) ${this.symbol} (${r})`;
  }

  public toHTMLString(slotIndexStart: number = 0) {
    const l = this.left.toHTMLString(slotIndexStart);
    const r = this.right.toHTMLString(slotIndexStart + this.left.emptyIndices().length);
    return `(${l}) ${this.symbol} (${r})`;
  }

  public allBoundVariables(): Term[] {
    return this.left.allBoundVariables().concat(this.right.allBoundVariables());
  }

  public getLiteralPredicates() {
    return this.left.getLiteralPredicates().concat(this.right.getLiteralPredicates());
  }

  public equals(p: Predicate): boolean {
    if (p instanceof BinaryOperatorPredicate) {
      return p.left.equals(this.left) && p.right.equals(this.right) && p.symbol == this.symbol;
    }
    return false;
  }
}
