import FunctionTerm from './function.js'

export default abstract class Term {
  public abstract toString(): string;
  public abstract toHTMLString(): string;
  public abstract equals(t: Term): boolean;
  public abstract getAllFunctions(): FunctionTerm[];
}

export type Variable = string;
