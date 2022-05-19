import Predicate, { Slot, isSameSlot } from './predicate.js'
import { emptySlot } from './util.js'
import Term from '../terms/term.js'

export function eq(l: Slot, r: Slot) {
  const result =  new EqualityPredicate();
  result.left = l;
  result.right = r;
  return result;
}

export default class EqualityPredicate extends Predicate {
  public left: Slot = null;
  public right: Slot = null;

  public get slots() {
    return [this.left, this.right];
  }

  public toString(slotIndexStart: number = 0) {
    let result = ""
    let numBlanks = slotIndexStart + 1;
    if (this.left === null) {
      result += emptySlot(numBlanks);
      numBlanks++;
    } else {
      result += this.left.toString();
    }
    result += " = "
    if (this.right === null) {
      result += emptySlot(numBlanks);
    } else {
      result += this.right.toString();
    }
    return result;
  }

  public toHTMLString(slotIndexStart: number = 0) {
    let result = ""
    let numBlanks = slotIndexStart + 1;
    if (this.left === null) {
      result += emptySlot(numBlanks);
      numBlanks++;
    } else {
      result += this.left.toHTMLString();
    }
    result += " = "
    if (this.right === null) {
      result += emptySlot(numBlanks);
    } else {
      result += this.right.toHTMLString();
    }
    return result;
  }

  public allBoundVariables(): Term[] {
    return [];
  }

  public getLiteralPredicates() {
    return [];
  }

  public withSlots(newSlots: Slot[]): EqualityPredicate {
    const result = new EqualityPredicate();
    result.left = newSlots[0];
    result.right = newSlots[1];
    return result;
  }

  public equals(p: Predicate): boolean {
    if (p instanceof EqualityPredicate) {
      return isSameSlot(p.left, this.left) && isSameSlot(p.right, this.right);
    }
    return false;
  }
}
