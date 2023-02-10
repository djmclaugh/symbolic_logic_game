import Predicate, { Slot } from './predicate.js'
import UnaryOperatorPredicate from './unary_operator.js';

export function not(p: Predicate) { return new NegationPredicate(p); }

export default class NegationPredicate extends UnaryOperatorPredicate {
  constructor(sub: Predicate) {
    super(sub);
  }

  public get symbol(): string {
    return "¬";
  }

  public withSlots(newSlots: Slot[]): NegationPredicate {
    return new NegationPredicate(this.sub.withSlots(newSlots));
  }
}
