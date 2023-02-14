import Predicate, { Slot } from './predicate.js'
import UnaryOperatorPredicate from './unary_operator.js';

export function not(p: Predicate|string) { return new NegationPredicate(p); }

export default class NegationPredicate extends UnaryOperatorPredicate {
  public get symbol(): string {
    return "¬";
  }

  public withSlots(newSlots: Slot[]): NegationPredicate {
    return new NegationPredicate(this.sub.withSlots(newSlots));
  }
}
