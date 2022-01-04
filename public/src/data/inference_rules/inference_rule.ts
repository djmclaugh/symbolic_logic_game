import { Term } from '../term.js'
import Proposition from '../propositions/proposition.js'
import { lit } from '../propositions/propositions.js'

// Returns a user-visible error message if the restriction is not satisfied.
// Returns the empty string if the restriction is satisfied.
export type Restriction = (inputs: Input[]) => string;
export type Transformation = (inputs: Input[]) => Proposition;

export type Input = Proposition|Term|number[]|"Left"|"Right"|"done"|"not done";

export enum InputType {
  AnyProposition, // optional anyPropositionInfo
  BankProposition,
  LeftRight,
  Variable, // needs variableInfo
  NewTerm, // needs newTermInfo
  FreeTerm,
  PropositionFreeTerm, // needs propositionFreeTermInfo.
  Replacement, // needs replacementInfo.
  Proof, // needs proofInfo.
}

export default interface InferenceRule {
    readonly name: string,
    readonly inputDescriptions: string[],
    readonly outputDescription: string,
    readonly inputTypes: InputType[],
    readonly doesApply: Restriction,
    readonly apply: Transformation,
    readonly variableInfo?: (inputs: (Input|null)[]) => Proposition|string,
    readonly newTermInfo?: (inputs: (Input|null)[]) => Proposition|string,
    readonly anyPropositionInfo?: (inputs: (Input|null)[]) => string[],
    readonly propositionFreeTermInfo?: (inputs: (Input|null)[]) => Proposition|string,
    readonly replacementInfo?: (inputs: (Input|null)[]) => [Proposition, Term, Term]|string,
    readonly proofInfo?: (inputs: (Input|null)[]) => [Proposition[], Proposition]|string,

}

export const Blank: InferenceRule = {
  name: "",
  inputDescriptions: [],
  outputDescription: "",
  inputTypes: [],
  doesApply: () => "",
  apply: () => {
    return lit("");
  },
};
