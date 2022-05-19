import QuantifierPredicate from './quantifier.js'
import Predicate, { Slot } from './predicate.js'
import Term from '../terms/term.js'

export function exists(v: Term, p: Predicate) {
  return new ExistentialPredicate(v, p);
}

export default class ExistentialPredicate extends QuantifierPredicate {
  public get symbol() {
    return '∃';
  }

  public withSlots(newSlots: Slot[]): ExistentialPredicate {
    const newPredicate = this.subPredicate.withSlots(newSlots);
    return new ExistentialPredicate(this.variable, newPredicate);
  }
}
