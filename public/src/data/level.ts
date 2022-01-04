import InferenceRule from './inference_rules/inference_rule.js'
import Proposition from './propositions/proposition.js'

export default interface Level {
  name: string,
  description?: string[],
  rules: InferenceRule[],
  propositions: Proposition[],
  target: Proposition,
}
