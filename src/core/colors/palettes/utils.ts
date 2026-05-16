export function withAlpha(hex: string, alpha: string) {
  return `${hex}${alpha}`
}

export function stripAlpha(hex: string) {
  return hex.length === 9 ? hex.slice(0, 7) : hex
}
