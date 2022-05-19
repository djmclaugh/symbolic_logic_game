import Term from './term.js'

export function litTerm(s: string) {
  return new LiteralTerm(s);
}

export default class LiteralTerm extends Term {
  constructor(private readonly symbols: string) {
    super()
  }

  public toString() {
    return this.symbols;
  }

  public toHTMLString() {
    return `<span class="term">${this.symbols}</span>`;
  }

  public equals(t: Term): boolean {
    if (t instanceof LiteralTerm) {
      return this.symbols === t.symbols;
    }
    return false;
  }

  public getAllFunctions() {return [];}
}
