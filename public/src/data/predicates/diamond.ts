import Predicate, { Slot } from './predicate.js'
import UnaryOperatorPredicate from './unary_operator.js';

export function diamond(p: Predicate) { return new DiamondPredicate(p); }

export default class DiamondPredicate extends UnaryOperatorPredicate {
  constructor(sub: Predicate) {
    super(sub);
  }

  public get symbol(): string {
    return "◊";
  }

  public withSlots(newSlots: Slot[]): DiamondPredicate {
    return new DiamondPredicate(this.sub.withSlots(newSlots));
  }
}
