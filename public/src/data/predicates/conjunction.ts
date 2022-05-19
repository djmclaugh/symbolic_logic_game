import BinaryOperatorPredicate from './binary_operator.js'
import Predicate, { Slot } from './predicate.js'

export function and(l: Predicate, r: Predicate) {
  return new ConjunctionPredicate(l, r);
}

export default class ConjunctionPredicate extends BinaryOperatorPredicate {
  public get symbol() {
    return '∧';
  }

  public withSlots(newSlots: Slot[]): ConjunctionPredicate {
    const newLeft = this.left.withSlots(newSlots.slice(0, this.left.slots.length));
    const newRight = this.right.withSlots(newSlots.slice(this.right.slots.length));
    return new ConjunctionPredicate(newLeft, newRight);
  }
}
