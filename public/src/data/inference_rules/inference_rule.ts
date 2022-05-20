import Term from '../terms/term.js'
import Predicate from '../predicates/predicate.js'
import Literal from '../predicates/literal.js'

// Returns a user-visible error message if the restriction is not satisfied.
// Returns the empty string if the restriction is satisfied.
export type Restriction = (inputs: Input[]) => string;
export type Transformation = (inputs: Input[]) => Predicate|[Predicate, Term];

export type Input = Predicate|Term|number[]|"Left"|"Right"|"done"|"not done";

export enum InputType {
  AnyProposition, // optional anyPropositionInfo
  BankProposition,
  LeftRight,
  Variable, // needs variableInfo
  NewExistentialTerm,
  UniversalTerm,
  FreeTerm,
  PropositionFreeTerm, // needs propositionFreeTermInfo.
  Replacement, // needs replacementInfo.
  Proof, // needs proofInfo.
  Axiom,
}

export default interface InferenceRule {
    readonly name: string,
    readonly inputDescriptions: string[],
    readonly outputDescription: string,
    readonly inputTypes: InputType[],
    readonly doesApply: Restriction,
    readonly apply: Transformation,
    readonly variableInfo?: (inputs: (Input|null)[]) => Predicate|string,
    readonly anyPropositionInfo?: (inputs: (Input|null)[]) => Term[],
    readonly propositionFreeTermInfo?: (inputs: (Input|null)[]) => Predicate|string,
    readonly replacementInfo?: (inputs: (Input|null)[]) => [Predicate, Term, Term]|string,
    // [What to add to proposition bank, what to add to term bank, new target]
    readonly proofInfo?: (inputs: (Input|null)[]) => [Predicate[], Term[], Predicate]|string,
    readonly axiomInfo?: (inputs: (Input|null)[]) => Predicate[],

}

export const Blank: InferenceRule = {
  name: "",
  inputDescriptions: [],
  outputDescription: "",
  inputTypes: [],
  doesApply: () => "",
  apply: () => {
    return new Literal([""]);
  },
};
