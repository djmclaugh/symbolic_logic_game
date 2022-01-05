import InferenceRule from './inference_rules/inference_rule.js'
import Proposition from './propositions/proposition.js'
import { PropositionType } from './propositions/propositions.js'

export default interface Level {
  name: string,
  description?: string[],
  rules: InferenceRule[],
  propositions: Proposition[],
  target: Proposition,
  allowedPropositionTypes?: PropositionType[],
}
