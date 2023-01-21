import BinaryOperatorPredicate from './binary_operator.js'
import Predicate, { Slot } from './predicate.js'

export function or(l: Predicate, r: Predicate) {
  return new DisjunctionPredicate(l, r);
}

export default class DisjunctionPredicate extends BinaryOperatorPredicate {
  public get symbol() {
    return '∨';
  }

  public withSlots(newSlots: Slot[]): DisjunctionPredicate {
    const newLeft = this.left.withSlots(newSlots.slice(0, this.left.slots.length));
    const newRight = this.right.withSlots(newSlots.slice(this.left.slots.length));
    return new DisjunctionPredicate(newLeft, newRight);
  }
}
