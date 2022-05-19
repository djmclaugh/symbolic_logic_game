import Predicate, { Slot } from './predicate.js'
import Term from '../terms/term.js'

export function not(p: Predicate) { return new NegationPredicate(p); }

export default class NegationPredicate extends Predicate {
  public get slots() {
    return this.subPredicate.slots;
  }

  constructor(public readonly subPredicate: Predicate) {
    super();
  }

  public toString(slotIndexStart: number = 0) {
    return `¬(${this.subPredicate.toString(slotIndexStart)})`;
  }

  public toHTMLString(slotIndexStart: number = 0) {
    return `¬(${this.subPredicate.toHTMLString(slotIndexStart)})`;
  }

  public allBoundVariables(): Term[] {
    return this.subPredicate.allBoundVariables();
  }

  public getLiteralPredicates() {
    return this.subPredicate.getLiteralPredicates();
  }

  public withSlots(newSlots: Slot[]): NegationPredicate {
    return new NegationPredicate(this.subPredicate.withSlots(newSlots));
  }

  public equals(p: Predicate): boolean {
    if (p instanceof NegationPredicate) {
      return p.subPredicate.equals(this.subPredicate);
    }
    return false;
  }
}
