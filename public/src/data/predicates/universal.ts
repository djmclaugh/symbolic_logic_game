import QuantifierPredicate from './quantifier.js'
import Predicate, { Slot } from './predicate.js'
import Term from '../terms/term.js'

export function forAll(v: Term, p: Predicate) {
  return new UniversalPredicate(v, p);
}

export default class UniversalPredicate extends QuantifierPredicate {
  public get symbol() {
    return '∀';
  }

  public withSlots(newSlots: Slot[]): UniversalPredicate {
    const newPredicate = this.subPredicate.withSlots(newSlots);
    return new UniversalPredicate(this.variable, newPredicate);
  }
}
