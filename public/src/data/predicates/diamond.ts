import Predicate, { Slot } from './predicate.js'
import UnaryOperatorPredicate from './unary_operator.js';

export function can(p: Predicate|string) { return new DiamondPredicate(p); }

export default class DiamondPredicate extends UnaryOperatorPredicate {
  public get symbol(): string {
    return "◇";
  }

  public withSlots(newSlots: Slot[]): DiamondPredicate {
    return new DiamondPredicate(this.sub.withSlots(newSlots));
  }
}
