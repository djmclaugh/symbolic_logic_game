import FunctionTerm from '../terms/function.js'
import Term from '../terms/term.js'
import LiteralPredicate from './literal.js'

export type Slot = Term|null;
export function isSameSlot(a: Slot, b: Slot): boolean {
  if (a === null && b === null) {
    return true;
  }
  if (a !== null && b !== null && a.equals(b)) {
    return true;
  }
  return false;
}

export type SlotIndex = number[];

export default abstract class Predicate {
  public abstract get slots(): Slot[];
  public abstract withSlots(newSlots: Slot[]): Predicate;
  public abstract toString(slotIndexStart?: number): string;
  public abstract toHTMLString(slotIndexStart?: number): string;
  public abstract equals(p: Predicate): boolean;
  public abstract allBoundVariables(): Term[];
  public abstract getLiteralPredicates(): LiteralPredicate[];

  public isProposition(): boolean {
    return !this.slots.includes(null);
  }

  public setTerm(t: Term, index: SlotIndex): Predicate {
    const newSlots = this.slots.concat();
    if (index.length == 1) {
      newSlots[index[0]] = t;
    } else {
      const f = newSlots[index[0]] as FunctionTerm;
      const i = index.shift()!;
      newSlots[i] = f.setTerm(t, index);
    }
    return this.withSlots(newSlots);
  }

  public replaceAll(a: Term, b: Term): Predicate {
    const newSlots = this.slots.map(x => {
      if (x == null) {
        return null;
      }
      if (isSameSlot(x, a)) {
        return b;
      }
      if (x instanceof FunctionTerm) {
        return x.replaceAll(a, b);
      }
      return x;
    });
    return this.withSlots(newSlots);
  }

  public emptySlots(): Predicate {
    return this.withSlots(this.slots.map(() => null));
  }

  public emptyIndices(): number[] {
    const result: number[] = [];
    this.slots.forEach((s, i) => {
      if (s === null) {
        result.push(i);
      }
    });
    return result;
  }

  public occuranceIndices(t: Term): SlotIndex[] {
    const result: SlotIndex[] = [];
    this.slots.forEach((s, i) => {
      if (s == null) {
        return;
      }
      if (t.equals(s)) {
        result.push([i]);
        return;
      }
      if (s instanceof FunctionTerm) {
        s.occuranceIndices(t).forEach((x) => {
          x.unshift(i);
          result.push(x);
        });
      }
    });
    return result;
  }

  public occures(t: Term): boolean {
    return this.slots.some(s => s !== null && s.equals(t));
  }

  public isBound(t: Term): boolean {
    return this.allBoundVariables().some(v => v.equals(t));
  }
}

export function allTerms(predicates: Predicate[]): Term[] {
  const allTerms: Term[] = [];
  for (const p of predicates) {
    for (const s of p.slots) {
      if (s === null) {
        continue;
      }
      if (allTerms.some(t => t.equals(s))) {
        continue;
      }
      allTerms.push(s);
    }
  }
  return allTerms;
}

export function allFunctions(predicates: Predicate[]): FunctionTerm[] {
  const all: FunctionTerm[] = [];
  for (const p of predicates) {
    for (const s of p.slots) {
      if (s === null) {
        continue;
      }
      for (const f of s.getAllFunctions()) {
        if (!all.some(x => x.equals(f))) {
          all.push(f);
        }
      }
    }
  }
  return all;
}
