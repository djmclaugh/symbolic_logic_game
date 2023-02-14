import BinaryOperatorPredicate from './binary_operator.js'
import Predicate, { Slot } from './predicate.js'

export function iff(l: Predicate|string, r: Predicate|string) {
  return new BiconditionalPredicate(l, r);
}

export default class BiconditionalPredicate extends BinaryOperatorPredicate {
  public get symbol() {
    return '↔';
  }

  public withSlots(newSlots: Slot[]): BiconditionalPredicate {
    const newLeft = this.left.withSlots(newSlots.slice(0, this.left.slots.length));
    const newRight = this.right.withSlots(newSlots.slice(this.left.slots.length));
    return new BiconditionalPredicate(newLeft, newRight);
  }
}
