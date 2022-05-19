import InferenceRule from './inference_rules/inference_rule.js'
import Term from './terms/term.js'
import Predicate from './predicates/predicate.js'
import { PropositionType } from './propositions/propositions.js'

export default interface Level {
  name: string,
  description?: string[],
  hints?: string[],
  rules: InferenceRule[],
  propositions: Predicate[],
  terms?: Term[],
  target: Predicate,
  allowedPropositionTypes?: PropositionType[],
}
