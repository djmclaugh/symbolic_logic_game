// {
//   name: 'Shortcut: Contradiction',
//   rules: [
//     ConditionalElimination,
//     Contradiction,
//   ],
//   description: [
//     "New logical symbol: ⊥ (Contradiction).",
//     "The contradiction (⊥) symbol is also a proposition of its own.",
//     "The only way to get it is by having a statement and its negation in your bank at the same time.",
//     "Note: You can do propositional logic without \"⊥\", but it can make life easier as we'll see in the next levels.",
//   ],
//   propositions: [
//     lit("Socrates is a man"),
//     not(lit("Socrates is mortal")),
//     then(lit("Socrates is a man"), lit("Socrates is mortal")),
//   ],
//   target: lit("⊥"),
// },
//
// {
//   name: 'Shortcut: Proof Of Negation',
//   description: [
//     "The proof of negation inference rule is another version of the negation introduction rule.",
//     "Lets say you want to add ¬(𝑃) to your bank.",
//     "You first have to add (𝑃) → (𝑄) (probably by using conditional introduction).",
//     "You'll then have to add (𝑃) → (¬(𝑄)) (Again, probably by using conditional introduction).",
//     "And then you'll finally be able to use negation introduction.",
//     "Proof of negation lets you do all that in one shot. All you have to do is prove that 𝑃 leads to a contradiction. That way you only have to play one sublevel instead of two, and you don't need to specify 𝑄 ahead of time.",
//   ],
//   rules: [
//     ConditionalElimination,
//     Contradiction,
//     ProofOfNegation,
//   ],
//   propositions: [
//     then(lit('Socrates is an immortal man'), lit('Socrates is a man')),
//     then(lit('Socrates is a man'), lit('Socrates is mortal')),
//     then(lit('Socrates is an immortal man'), not(lit('Socrates is mortal'))),
//   ],
//   target: not(lit('Socrates is an immortal man')),
// },


// {
//   name: 'Prove Derived Rule: Proof By Contradiction',
//   description: [
//     "Proof by contradiction tells you that if ¬(𝑃) lead to a contradiction, then you can assume 𝑃.",
//     "Note: Proof of negation and proof by contradiction are very similar but the are not the same!",
//     "Proof of negation: Show that 𝑃 leads to a contradiction to get ¬(𝑃).",
//     "Proof by contradiction: Show that ¬(𝑃) leads to a contradiction to get 𝑃.",
//   ],
//   rules: [
//     DoubleNegationElimination,
//     Contradiction,
//     ProofByContradiction,
//   ],
//   propositions: [
//     then(lit('Socrates is an immortal man'), lit('Socrates is a man')),
//     then(lit('Socrates is a man'), lit('Socrates is mortal')),
//     then(lit('Socrates is an immortal man'), not(lit('Socrates is mortal'))),
//   ],
//   target: lit('Socrates is an mortal man'),
// },
//
// {
//   name: 'Proof By Contradiction Implies Double Negation Elimination',
//   description: [
//     "Win this level by using proof by contradiction instead of double negation elimination.",
//   ],
//   rules: [
//     Contradiction,
//     ProofByContradiction,
//   ],
//   propositions: [
//     not(not(lit('I like apples'))),
//   ],
//   target: lit('I like apples'),
// },
