import { AuraPalette } from './types'

// Resolve after the family has finished overriding UI roles (Aqua/Lime/Azure).
// These are terminal interaction roles, independent of editor syntax and ANSI.
export function createTerminalSurface({ base, ui }: AuraPalette) {
  const background = base.background
  const onFill = (fill: string) =>
    [base.background, base.foregroundStrong, base.elevated].sort(
      (a, b) => contrast(b, fill) - contrast(a, fill)
    )[0]
  return {
    background,
    foreground: base.foreground,
    cursor: ui.action.background,
    cursorText: onFill(ui.action.background),
    selectionBackground: composite(ui.selectionRole.solid, background),
    selectionForeground: base.foregroundStrong,
    searchBackground: composite(ui.selectionRole.editor, background),
    searchForeground: base.foregroundStrong,
    searchSelectedBackground: ui.action.background,
    searchSelectedForeground: onFill(ui.action.background),
    splitDivider: composite(base.border, background),
    unfocusedSplitFill: background,
    titlebarBackground: composite(ui.chrome.background, background),
    titlebarForeground: base.foregroundMuted,
    // TUI lists keep the normal text color, unlike terminal text selections.
    listBackground: composite(ui.selectionRole.list, background),
    listFocusBackground: composite(ui.selectionRole.listFocus, background),
    hoverBackground: composite(ui.surfaceRole.hover, background),
  }
}

// Ghostty color fields accept RGB, not RGBA. Preserve the existing role's
// appearance on its actual reading surface instead of dropping its alpha.
function composite(foreground: string, background: string): string {
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

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((offset) => {
    const c = parseInt(hex.slice(offset, offset + 2), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
}

function contrast(a: string, b: string): number {
  const [low, high] = [luminance(a), luminance(b)].sort((x, y) => x - y)
  return (high + 0.05) / (low + 0.05)
}
