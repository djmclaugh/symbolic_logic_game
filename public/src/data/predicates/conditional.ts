import BinaryOperatorPredicate from './binary_operator.js'
import Predicate, { Slot } from './predicate.js'

export function then(l: Predicate, r: Predicate) {
  return new ConditionalPredicate(l, r);
}

export default class ConditionalPredicate extends BinaryOperatorPredicate {
  public get symbol() {
    return '→';
  }

  public withSlots(newSlots: Slot[]): ConditionalPredicate {
    const newLeft = this.left.withSlots(newSlots.slice(0, this.left.slots.length));
    const newRight = this.right.withSlots(newSlots.slice(this.right.slots.length));
    return new ConditionalPredicate(newLeft, newRight);
  }
}
