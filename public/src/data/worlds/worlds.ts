import Level from '../level'
import NDS from './natural_deduction_system.js'
import BICONDITIONAL from './propositional_logic_biconditional.js'
import PROPOSITIONAL_LOGIC_DEMORGAN from './propositional_logic_demorgan.js'
import PROPOSITIONAL_LOGIC_CONTRADICTION from './propositional_logic_contradiction.js'
import FOL from './first_order_logic.js'
import FOL_WITH_EQ from './first_order_logic_with_equality.js'
import ROB from './robinson_arithmetic.js'
import MODAL from './modal_logic.js'

export type World = { name: string, levels: Level[] };

export const WORLDS: World[] = [
//  { name: "Propositional Logic", levels: NDS },
//  { name: "Propositional Logic: Biconditional", levels: BICONDITIONAL },
//  { name: "Propositional Logic: Contradictions", levels: PROPOSITIONAL_LOGIC_CONTRADICTION },
//  { name: "Propositional Logic: De Morgan's Laws", levels: PROPOSITIONAL_LOGIC_DEMORGAN },
  { name: "Modal Logic (Work in Progress)", levels: MODAL }, 
  { name: "First-Order Logic", levels: FOL },
  { name: "First-Order Logic With Equality", levels: FOL_WITH_EQ },
  { name: "Robinson Arithmetic", levels: ROB },
];

