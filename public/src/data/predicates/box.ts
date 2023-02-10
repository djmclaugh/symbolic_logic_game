import Predicate, { Slot } from './predicate.js'
import UnaryOperatorPredicate from './unary_operator.js';

export function box(p: Predicate) { return new BoxPredicate(p); }

export default class BoxPredicate extends UnaryOperatorPredicate {
  constructor(sub: Predicate) {
    super(sub);
  }

  public get symbol(): string {
    return "□";
  }

  public withSlots(newSlots: Slot[]): BoxPredicate {
    return new BoxPredicate(this.sub.withSlots(newSlots));
  }
}
