import Predicate, { Slot, isSameSlot } from './predicate.js'
import { emptySlot } from './util.js'
import Term from '../terms/term.js'

export function lit(sections: string[]|string) {
  if (typeof sections === 'string') {
    return new LiteralPredicate([sections]);
  } else {
    return new LiteralPredicate(sections);
  }
}

export function litWithTerms(sections: string[], terms: Slot[]) {
  const result = new LiteralPredicate(sections);
  return result.withSlots(terms);
}

export default class LiteralPredicate extends Predicate {
  private actualSlots: Slot[] = [];

  public get slots() {
    return this.actualSlots.concat();
  }

  constructor(public readonly sections: string[]) {
    super();
    for (let i = 0 ; i < this.sections.length - 1; ++i) {
      this.actualSlots.push(null);
    }
  }

  public toString(slotIndexStart: number = 0) {
    let result = ""
    let numBlanks = slotIndexStart + 1;
    for (let i = 0; i < this.slots.length; ++i) {
      result += this.sections[i];
      const slot = this.actualSlots[i];
      if (slot === null) {
        result += emptySlot(numBlanks);
        numBlanks++;
      } else {
        result += slot.toString();
      }
    }
    result += this.sections[this.sections.length - 1];
    return result;
  }

  public toHTMLString(slotIndexStart: number = 0) {
    let result = ""
    let numBlanks = slotIndexStart + 1;
    for (let i = 0; i < this.slots.length; ++i) {
      result += this.sections[i];
      const slot = this.actualSlots[i];
      if (slot === null) {
        result += emptySlot(numBlanks);
        numBlanks++;
      } else {
        result += slot.toHTMLString();
      }
    }
    result += this.sections[this.sections.length - 1];
    return result;
  }

  public allBoundVariables(): Term[] {
    return [];
  }

  public getLiteralPredicates() {
    return [this];
  }

  public withSlots(newSlots: Slot[]): LiteralPredicate {
    const result = new LiteralPredicate(this.sections);
    for (let i = 0; i < this.slots.length; ++i) {
      result.actualSlots[i] = newSlots[i];
    }
    return result;
  }

  public equals(p: Predicate): boolean {
    if (p instanceof LiteralPredicate) {
      if (p.sections.length != this.sections.length) {
        return false;
      }
      for (let i = 0; i < this.slots.length; ++i) {
        if (p.sections[i] != this.sections[i]) {
          return false;
        }
        if (!isSameSlot(p.actualSlots[i], this.actualSlots[i])) {
          return false;
        }
      }
      if (p.sections[p.sections.length - 1] !== this.sections[this.sections.length - 1]) {
        return false;
      }
      return true;
    }
    return false;
  }
}
