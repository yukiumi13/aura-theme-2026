type TokenStyle = string | { foreground: string; fontStyle?: string }
export interface Theme {
  name: string
  type: string
  colors: Record<string, string>
  tokenColors: {
    scope: string | string[]
    settings: {
      foreground?: string
      background?: string
      fontStyle?: string
    }
  }[]
  semanticTokenColors: Record<string, TokenStyle>
  semanticHighlighting: boolean
}

export function rgb(hex: string): number[] {
  return [1, 3, 5].map((offset) =>
    parseInt(hex.slice(offset, offset + 2), 16)
  )
}

export function over(hex: string, background: number[]): number[] {
  const alpha = hex.length === 9 ? parseInt(hex.slice(7), 16) / 255 : 1
  return rgb(hex).map(
    (value, i) => value * alpha + background[i] * (1 - alpha)
  )
}

export function luminance(color: number[]): number {
  const linear = color.map((channel) => {
    const value = channel / 255
    return value <= 0.04045
      ? value / 12.92
      : ((value + 0.055) / 1.055) ** 2.4
  })
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722
}

export function contrast(foreground: string, background: number[]): number {
  const values = [
    luminance(over(foreground, background)),
    luminance(background),
  ].sort((a, b) => a - b)
  return (values[1] + 0.05) / (values[0] + 0.05)
}

export function expectReadable(
  foreground: string,
  background: number[],
  context: string
) {
  const ratio = contrast(foreground, background)
  if (ratio < 4.5)
    throw new Error(
      `${context}: ${foreground} has contrast ${ratio.toFixed(
        2
      )}:1 (expected >= 4.5:1)`
    )
}
