import Term from './term.js'
import { emptySlot } from '../predicates/util.js'

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

export function func(s: string[], t: Term[]) {
  const f = new FunctionTerm(s);
  return f.withSlots(t);
}

export default class FunctionTerm extends Term {
  private slots: Slot[] = []
  constructor(private readonly sections: string[]) {
    super()
    for (let i = 0 ; i < this.sections.length - 1; ++i) {
      this.slots.push(null);
    }
  }

  public get numSlots(): number {
    return this.slots.length;
  }

  public toString(slotIndexStart: number = 0) {
    let result = ""
    let numBlanks = slotIndexStart + 1;
    for (let i = 0; i < this.slots.length; ++i) {
      result += this.sections[i];
      const slot = this.slots[i];
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
      const slot = this.slots[i];
      if (slot === null) {
        result += emptySlot(numBlanks);
        numBlanks++;
      } else {
        result += slot.toHTMLString();
      }
    }
    result += this.sections[this.sections.length - 1];
    return `<span class="term">${result}</span>`;
  }

  public equals(t: Term): boolean {
    if (t instanceof FunctionTerm) {
      if (this.sections.length != t.sections.length) {
        return false;
      }
      for (let i = 0; i < this.slots.length; ++i) {
        if (this.sections[i] != t.sections[i]) {
          return false;
        }
        if (!isSameSlot(this.slots[i], t.slots[i])) {
          return false;
        }
      }
      const last = t.sections.length - 1;
      return this.sections[last] == t.sections[last];
    }
    return false;
  }

  public withSlots(newSlots: Slot[]): FunctionTerm {
    const result = new FunctionTerm(this.sections);
    for (let i = 0; i < this.slots.length; ++i) {
      result.slots[i] = newSlots[i];
    }
    return result;
  }

  public setTerm(t: Term, index: SlotIndex): Term {
    console.log(index)
    const newSlots = this.slots.concat();
    if (index.length == 1) {
      newSlots[index[0]] = t;
    } else {
      console.log(newSlots);
      const f = newSlots[index[0]] as FunctionTerm;
      const i = index.shift()!;
      console.log(index);
      newSlots[i] = f.setTerm(t, index);
    }
    return this.withSlots(newSlots);
  }

  public replaceAll(a: Term, b: Term): FunctionTerm {
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

  public getAllFunctions(): FunctionTerm[] {
    const all: FunctionTerm[] = [];
    for (const slot of this.slots) {
      if (slot !== null) {
        for (const t of slot.getAllFunctions()) {
          if (!all.some(x => x.equals(t))) {
            all.push(t);
          }
        }
      }
    }
    const t = this.withSlots(this.slots.map(x => null));
    if (!all.some(x => x.equals(t))) {
      all.push(t);
    }
    return all;
  }
}
