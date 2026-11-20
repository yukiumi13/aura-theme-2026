export function withAlpha(hex: string, alpha: string) {
  return `${hex}${alpha}`
}

export function stripAlpha(hex: string) {
  return hex.length === 9 ? hex.slice(0, 7) : hex
}

// Terminal color fields use resolved RGB. Preserve the existing role's
// appearance on its actual reading surface instead of dropping its alpha.
export function composite(foreground: string, background: string): string {
  if (foreground.length !== 9) return foreground
  const alpha = parseInt(foreground.slice(7), 16) / 255
  return (
    '#' +
    [1, 3, 5]
      .map((offset) =>
        Math.round(
          parseInt(foreground.slice(offset, offset + 2), 16) * alpha +
            parseInt(background.slice(offset, offset + 2), 16) * (1 - alpha)
        )
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
      .toUpperCase()
  )
}
