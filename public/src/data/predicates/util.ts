const SUBSCRIPT_DIGITS = "₀₁₂₃₄₅₆₇₈₉";

export function emptySlot(x: number): string {
  return "?" + toSubscriptString(x);
}

export function toSubscriptString(x: number): string {
  const characters: string[] = x.toString().split("");
  for (let i = 0; i < characters.length; ++i) {
    const digit = parseInt(characters[i])
    if (!isNaN(digit)) {
      characters[i] = SUBSCRIPT_DIGITS[digit];
    }
  }
  return characters.join("");
}
