import { readFileSync } from 'fs'
import { resolve } from 'path'
import Mustache from 'mustache'
import { light } from 'core/colors/schemes'
import { withTerminalAuraAnsi } from 'ports/shared/terminal-ansi'

type TokenStyle = string | { foreground: string; fontStyle?: string }
interface Theme {
  name: string
  type: string
  colors: Record<string, string>
  tokenColors: {
    scope: string | string[]
    settings: { foreground?: string; background?: string }
  }[]
  semanticTokenColors: Record<string, TokenStyle>
  semanticHighlighting: boolean
}

const template = readFileSync(
  resolve('src/ports/vscode/templates/theme.json'),
  'utf8'
)
const rendered = Mustache.render(template, {
  ...withTerminalAuraAnsi(light),
  name: light.paletteName,
  type: light.paletteAppearance,
})
const theme: Theme = JSON.parse(rendered)
const colors = theme.colors

function rgb(hex: string): number[] {
  return [1, 3, 5].map((offset) =>
    parseInt(hex.slice(offset, offset + 2), 16)
  )
}

function over(hex: string, background: number[]): number[] {
  const alpha = hex.length === 9 ? parseInt(hex.slice(7), 16) / 255 : 1
  return rgb(hex).map(
    (value, i) => value * alpha + background[i] * (1 - alpha)
  )
}

function luminance(color: number[]): number {
  const linear = color.map((channel) => {
    const value = channel / 255
    return value <= 0.04045
      ? value / 12.92
      : ((value + 0.055) / 1.055) ** 2.4
  })
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722
}

function contrast(foreground: string, background: number[]): number {
  const values = [
    luminance(over(foreground, background)),
    luminance(background),
  ].sort((a, b) => a - b)
  return (values[1] + 0.05) / (values[0] + 0.05)
}

function expectReadable(
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

const editor = rgb(colors['editor.background'])
const textMateColors = theme.tokenColors.reduce<string[]>(
  (result, { settings }) => {
    if (settings.foreground && !settings.background)
      result.push(settings.foreground)
    return result
  },
  []
)
const syntaxColors = Array.from(
  new Set([
    ...Object.values(theme.semanticTokenColors).map((style) =>
      typeof style === 'string' ? style : style.foreground
    ),
    ...textMateColors,
  ])
)

describe('Aura Light 2026', () => {
  it('renders a complete light theme and ships the same generated output', () => {
    expect(rendered).not.toMatch(/\{\{|\}\}/)
    expect(theme.type).toBe('light')
    expect(theme.semanticHighlighting).toBe(true)
    expect(
      JSON.parse(
        readFileSync(
          resolve('packages/vscode/themes/aura-light-2026-color-theme.json'),
          'utf8'
        )
      )
    ).toEqual(theme)
    Object.values(colors).forEach((color) =>
      expect(color).toMatch(/^#[0-9a-f]{6}([0-9a-f]{2})?$/i)
    )
    const manifest = JSON.parse(
      readFileSync(resolve('packages/vscode/package.json'), 'utf8')
    )
    expect(manifest.contributes.themes).toContainEqual({
      label: theme.name,
      uiTheme: 'vs',
      path: './themes/aura-light-2026-color-theme.json',
    })
  })

  it('separates paper, chrome, tab strip, and floating widgets', () => {
    expect(luminance(editor)).toBeGreaterThan(0.95)
    expect(luminance(rgb(colors['sideBar.background']))).toBeLessThan(
      luminance(editor)
    )
    expect(luminance(rgb(colors['tab.inactiveBackground']))).toBeLessThan(
      luminance(rgb(colors['sideBar.background']))
    )
    expect(
      luminance(rgb(colors['editorHoverWidget.background']))
    ).toBeGreaterThan(luminance(editor))
    expect(colors['sideBar.border']).not.toBe(colors['widget.shadow'])
  })

  it.each([
    'editor.background',
    'editor.lineHighlightBackground',
    'editor.selectionBackground',
    'editor.inactiveSelectionBackground',
    'editor.findMatchBackground',
    'editor.rangeHighlightBackground',
    'diffEditor.insertedLineBackground',
    'diffEditor.removedLineBackground',
  ])(
    'keeps syntax readable over %s, including alpha compositing',
    (surface) => {
      const background = over(colors[surface], editor)
      syntaxColors.forEach((foreground) =>
        expectReadable(foreground, background, surface)
      )
    }
  )

  it.each(['inserted', 'removed'])(
    'keeps syntax readable over layered %s diff highlights',
    (kind) => {
      const line = over(colors[`diffEditor.${kind}LineBackground`], editor)
      const word = over(colors[`diffEditor.${kind}TextBackground`], line)
      syntaxColors.forEach((foreground) =>
        expectReadable(foreground, word, `diff ${kind}`)
      )
    }
  )

  it('keeps every integrated terminal ANSI slot readable', () => {
    const background = rgb(colors['terminal.background'])
    const ansi = Object.entries(colors).filter(([key]) =>
      key.startsWith('terminal.ansi')
    )
    expect(ansi).toHaveLength(16)
    ansi.forEach(([key, foreground]) =>
      expectReadable(foreground, background, key)
    )
  })

  it.each([
    ['button.foreground', 'button.background'],
    ['button.foreground', 'button.hoverBackground'],
    ['button.secondaryForeground', 'button.secondaryHoverBackground'],
    ['badge.foreground', 'badge.background'],
    ['activityErrorBadge.foreground', 'activityErrorBadge.background'],
    ['activityWarningBadge.foreground', 'activityWarningBadge.background'],
    ['statusBar.debuggingForeground', 'statusBar.debuggingBackground'],
    ['statusBarItem.remoteForeground', 'statusBarItem.remoteBackground'],
    [
      'statusBarItem.remoteHoverForeground',
      'statusBarItem.remoteHoverBackground',
    ],
    ['statusBarItem.warningForeground', 'statusBarItem.warningBackground'],
    ['statusBarItem.errorForeground', 'statusBarItem.errorBackground'],
    ['list.hoverForeground', 'list.hoverBackground'],
    ['list.focusForeground', 'list.focusBackground'],
    ['menu.selectionForeground', 'menu.selectionBackground'],
    [
      'quickInputList.focusHighlightForeground',
      'quickInputList.focusBackground',
    ],
    [
      'editorSuggestWidget.selectedIconForeground',
      'editorSuggestWidget.selectedBackground',
    ],
  ])('keeps %s readable on %s', (foreground, background) => {
    // The darker chrome is conservative for translucent interactive surfaces.
    const surface = over(
      colors[background],
      rgb(colors['sideBar.background'])
    )
    expectReadable(colors[foreground], surface, foreground)
  })

  it('uses the number role even when semantic highlighting is unavailable', () => {
    const numberRule = theme.tokenColors.find(
      ({ scope }) =>
        Array.isArray(scope) && scope.includes('constant.numeric')
    )
    expect(numberRule?.settings.foreground).toBe(
      theme.semanticTokenColors.number
    )
    expect(numberRule?.settings.foreground).not.toBe(
      theme.semanticTokenColors.type
    )
  })
})
