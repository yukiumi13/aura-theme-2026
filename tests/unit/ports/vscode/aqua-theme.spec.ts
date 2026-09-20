import { readFileSync } from 'fs'
import { resolve } from 'path'
import Mustache from 'mustache'
import { aquaVariants, limeVariants, dark } from 'core/colors/schemes'
import { auraMint } from 'core/colors/source/aura'
import { withTerminalAuraAnsi } from 'ports/shared/terminal-ansi'
import {
  Theme,
  rgb,
  over,
  contrast,
  expectReadable,
} from '../../../helpers/theme'

const template = readFileSync(
  resolve('src/ports/vscode/templates/theme.json'),
  'utf8'
)
const render = (scheme: Record<string, string>): Theme =>
  JSON.parse(
    Mustache.render(template, {
      ...scheme,
      name: scheme.paletteName,
      type: scheme.paletteAppearance,
    })
  )

it.each([aquaVariants[1], limeVariants[1]])(
  'keeps $paletteName rooted in Aura Dark',
  (scheme) => {
    const aura = render(withTerminalAuraAnsi(dark))
    const aqua = render(withTerminalAuraAnsi(scheme))
    expect(aqua.semanticTokenColors).toEqual(aura.semanticTokenColors)
    for (const key of [
      'editor.background',
      'editor.foreground',
      'sideBar.background',
      'activityBar.background',
      'panel.background',
      'titleBar.activeBackground',
      'input.background',
      'dropdown.background',
      'editorWidget.background',
      'editor.lineHighlightBackground',
      'editorLineNumber.foreground',
      'tab.inactiveBackground',
      'gitDecoration.modifiedResourceForeground',
      'terminal.background',
      'terminal.foreground',
      ...Object.keys(aura.colors).filter((key) =>
        key.startsWith('terminal.ansi')
      ),
    ]) {
      expect(aqua.colors[key]).toBeDefined()
      expect(aqua.colors[key]).toBe(aura.colors[key])
    }
    expect(aqua.colors['button.background']).toBe(
      scheme.paletteName.includes('Lime') ? '#64EBAF' : '#12DADD'
    )
    expect(aqua.colors['tab.activeBackground']).toBe('#12DADD')
    expect(aqua.colors['activityBar.activeBackground']).toBe(
      scheme.paletteName.includes('Lime') ? '#17352F' : '#13282D'
    )
  }
)

it('keeps Aqua cold paper separate from Lime green-white surfaces', () => {
  const aqua = render(withTerminalAuraAnsi(aquaVariants[0])).colors
  const lime = render(withTerminalAuraAnsi(limeVariants[0])).colors
  expect(aqua['editor.background']).toBe('#F8FCFE')
  expect(aqua['sideBar.background']).toBe('#F5F9FB')
  expect(lime['editor.background']).toBe('#FBFDFB')
  expect(lime['sideBar.background']).toBe('#F5F9F3')
  expect(lime['list.inactiveSelectionBackground']).not.toBe(
    aqua['list.inactiveSelectionBackground']
  )
})

describe.each(
  [...aquaVariants, ...limeVariants].map((scheme) => [
    scheme.paletteName,
    scheme,
  ])
)('%s', (_name, value) => {
  const scheme = value as Record<string, string>
  const theme = render(withTerminalAuraAnsi(scheme))
  const colors = theme.colors
  const isLight = theme.type === 'light'
  const isLime = scheme.paletteName.includes('Lime')
  const editor = rgb(colors['editor.background'])
  const syntax = Array.from(
    new Set([
      ...Object.values(theme.semanticTokenColors).map((style) =>
        typeof style === 'string' ? style : style.foreground
      ),
      ...theme.tokenColors.reduce<string[]>((result, { settings }) => {
        if (settings.foreground && !settings.background)
          result.push(settings.foreground)
        return result
      }, []),
    ])
  )
  const expectPaletteText = (
    foreground: string,
    background: number[],
    context: string,
    subdued = false
  ) => {
    // Retain Aura Dark's quiet comments and dim terminal text. The 3:1
    // design floor for these roles is not a WCAG normal-text claim.
    if (isLight || subdued) {
      expect(contrast(foreground, background)).toBeGreaterThanOrEqual(3)
    } else {
      expectReadable(foreground, background, context)
    }
  }

  it('registers and generates a complete theme with the right appearance', () => {
    const path = `./themes/${scheme.paletteSlug}-color-theme.json`
    const manifest = JSON.parse(
      readFileSync(resolve('packages/vscode/package.json'), 'utf8')
    )
    expect(manifest.contributes.themes).toContainEqual({
      id: isLime
        ? scheme.paletteName
        : isLight
        ? 'Aura Aqua Light 2026'
        : 'Aura Aqua Dark 2026',
      label: scheme.paletteName,
      uiTheme: isLight ? 'vs' : 'vs-dark',
      path,
    })
    expect(
      JSON.parse(readFileSync(resolve('packages/vscode', path), 'utf8'))
    ).toEqual(theme)
    expect(JSON.stringify(theme)).not.toMatch(/\{\{\s*[\w.]+\s*\}\}/)
    Object.values(colors).forEach((color) =>
      expect(color).toMatch(/^#[\da-f]{6}([\da-f]{2})?$/i)
    )
  })

  it('separates badges, family actions, navigation, citrus edges, and semantic status', () => {
    expect(colors['badge.background']).toBe('#64EBAF')
    expect(colors['activityBarBadge.background']).toBe('#64EBAF')
    expect(colors['button.background']).toBe(isLime ? '#64EBAF' : '#12DADD')
    expect(colors['button.hoverBackground']).toBe(
      isLime ? '#00FED7' : '#0FC9CE'
    )
    expect(colors['tab.activeBackground']).toBe('#12DADD')
    expect(colors['progressBar.background']).toBe('#12DADD')
    expect(colors['activityBar.activeBackground']).toBe(
      isLight
        ? isLime
          ? '#64EBAF'
          : '#12DADD'
        : isLime
        ? '#17352F'
        : '#13282D'
    )
    for (const key of [
      'extensionButton.background',
      'extensionButton.prominentBackground',
      'statusBarItem.prominentBackground',
    ]) {
      expect(colors[key]).toBe(colors['button.background'])
    }
    if (!isLime)
      expect(colors['button.background']).not.toBe(
        colors['badge.background']
      )
    expect(colors['button.background']).not.toBe(auraMint)
    expect(colors['statusBarItem.remoteBackground']).toBe(
      colors['button.background']
    )
    expect(colors['statusBarItem.remoteForeground']).toBe(
      colors['button.foreground']
    )
    expect(colors['list.hoverForeground']).toBe(colors['editor.foreground'])
    expect(colors['list.highlightForeground']).toBe(
      colors['textLink.foreground']
    )
    expect(colors['notificationsInfoIcon.foreground']).toBe(
      colors['inputValidation.infoBorder']
    )
    expect(colors['notificationsInfoIcon.foreground']).not.toBe(
      colors['gitDecoration.addedResourceForeground']
    )
    expect(theme.semanticTokenColors.keyword).not.toBe(
      theme.semanticTokenColors.type
    )
    expect(theme.semanticTokenColors.string).toBe(
      isLight ? '#007A58' : auraMint
    )
    for (const key of [
      'button.border',
      'button.secondaryBorder',
      'extensionButton.border',
      'tab.activeBorderTop',
      'tab.selectedBorderTop',
      'activityBar.activeBorder',
      'panelTitle.activeBorder',
    ]) {
      expect(colors[key]).toBe(
        isLime && key.toLowerCase().includes('button')
          ? '#F5DF72'
          : '#E4EF82'
      )
    }
    expect(colors['tab.hoverBorder']).toBe('#00000000')
    expect(colors['tab.activeBorderTop']).not.toBe(
      colors['editorWarning.foreground']
    )
    expect(contrast(colors.focusBorder, editor)).toBeGreaterThanOrEqual(3)
    expect(
      contrast(colors.focusBorder, rgb(colors['sideBar.background']))
    ).toBeGreaterThanOrEqual(3)
    const oldPaletteText = render({
      ...withTerminalAuraAnsi(scheme),
      ansiBrightGreen: '#FF00FF',
    })
    expect(
      oldPaletteText.colors['gitDecoration.addedResourceForeground']
    ).toBe(colors['gitDecoration.addedResourceForeground'])
  })

  it('uses the reference white-on-cyan and mint treatment for light active controls', () => {
    if (!isLight) return
    for (const key of [
      'button.foreground',
      'badge.foreground',
      'tab.activeForeground',
      'statusBarItem.remoteForeground',
    ]) {
      expect(colors[key]).toBe('#FFFFFF')
    }
    expect(colors['button.background']).toBe(isLime ? '#64EBAF' : '#12DADD')
    expect(colors['editor.foreground']).not.toBe('#FFFFFF')
  })

  it.each(['activityBar', 'activityBarTop'])(
    'keeps %s icons visible when hovering or focusing an unchecked item',
    (bar) => {
      // VS Code activityaction.css applies the same foreground to selected,
      // hovered and keyboard-focused icons, but fills only the selected item.
      for (const bg of [
        colors[`${bar}.background`],
        colors[`${bar}.activeBackground`],
        colors['toolbar.hoverBackground'],
      ]) {
        expect(
          contrast(colors[`${bar}.foreground`], rgb(bg))
        ).toBeGreaterThanOrEqual(3)
      }
    }
  )

  it('separates Modern UI hover ink from the filled selected icon', () => {
    const active = colors['modernActivityBarItem.activeBackground']
    const activeInk = colors['modernActivityBarItem.activeForeground']
    const hover = colors['modernActivityBarItem.hoverBackground']
    const hoverInk = colors['modernActivityBarItem.hoverForeground']
    expect(active).toBe(colors['activityBar.activeBackground'])
    expect(hover).not.toBe(active)
    expect(contrast(hoverInk, rgb(hover))).toBeGreaterThanOrEqual(3)
    // Unchecked keyboard focus still uses the classic rail foreground.
    expect(
      contrast(
        colors['activityBar.foreground'],
        rgb(colors['activityBar.background'])
      )
    ).toBeGreaterThanOrEqual(3)
    if (isLight) {
      expect(active).toBe(isLime ? '#64EBAF' : '#12DADD')
      expect(hoverInk).not.toBe(activeInk)
      expect(activeInk).toBe('#FFFFFF')
      expect(hoverInk).not.toBe('#FFFFFF')
    } else {
      expect(contrast(activeInk, rgb(active))).toBeGreaterThanOrEqual(3)
    }
  })

  it('keeps language roles distinct and TextMate/semantic foregrounds aligned', () => {
    const foreground = (key: string) => {
      const style = theme.semanticTokenColors[key]
      return typeof style === 'string' ? style : style.foreground
    }
    const roles = [
      'type',
      'keyword',
      'function',
      'string',
      'property',
      'number',
    ]
    expect(new Set(roles.map(foreground)).size).toBe(roles.length)
    for (const [role, scope] of [
      ['type', 'entity'],
      ['keyword', 'keyword'],
      ['function', 'support.function'],
      ['function.declaration', 'entity.name.function'],
      ['property', 'variable.other.property'],
      ['number', 'constant.numeric'],
      ['parameter', 'variable.parameter'],
    ]) {
      const rule = theme.tokenColors.find((token) =>
        (Array.isArray(token.scope) ? token.scope : [token.scope]).includes(
          scope
        )
      )
      expect(rule?.settings.foreground).toBe(foreground(role))
    }
    if (isLight) {
      expect(JSON.stringify(theme)).not.toMatch(/#006A73|#005760/i)
    }
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
  ])('keeps syntax readable on %s after compositing', (surface) => {
    const background = over(colors[surface], editor)
    syntax.forEach((fg) =>
      expectPaletteText(
        fg,
        background,
        surface,
        fg === theme.semanticTokenColors.comment
      )
    )
  })

  it.each(['inserted', 'removed'])(
    'keeps syntax readable on layered %s diff regions',
    (kind) => {
      const line = over(colors[`diffEditor.${kind}LineBackground`], editor)
      const word = over(colors[`diffEditor.${kind}TextBackground`], line)
      syntax.forEach((fg) =>
        expectPaletteText(
          fg,
          word,
          `diff ${kind}`,
          fg === theme.semanticTokenColors.comment
        )
      )
    }
  )

  it.each([
    ['button.foreground', 'button.background'],
    ['button.foreground', 'button.hoverBackground'],
    ['badge.foreground', 'badge.background'],
    ['statusBarItem.remoteForeground', 'statusBarItem.remoteBackground'],
    [
      'statusBarItem.remoteHoverForeground',
      'statusBarItem.remoteHoverBackground',
    ],
    [
      'extensionButton.prominentForeground',
      'extensionButton.prominentHoverBackground',
    ],
    ['list.hoverForeground', 'list.hoverBackground'],
    ['list.highlightForeground', 'list.activeSelectionBackground'],
    ['list.inactiveSelectionForeground', 'list.inactiveSelectionBackground'],
    ['menu.selectionForeground', 'menu.selectionBackground'],
    ['activityBar.foreground', 'activityBar.activeBackground'],
    ['activityBarTop.foreground', 'activityBarTop.activeBackground'],
    ['tab.activeForeground', 'tab.activeBackground'],
    ['tab.hoverForeground', 'tab.hoverBackground'],
    ['tab.unfocusedActiveForeground', 'tab.unfocusedActiveBackground'],
    ['tab.unfocusedInactiveForeground', 'tab.unfocusedInactiveBackground'],
    ['editorInlayHint.foreground', 'editorInlayHint.background'],
  ])('keeps %s readable on %s', (fg, bg) => {
    const whiteAccentRoles = new Set([
      'button.foreground',
      'badge.foreground',
      'statusBarItem.remoteForeground',
      'statusBarItem.remoteHoverForeground',
      'extensionButton.prominentForeground',
      'tab.activeForeground',
    ])
    if (isLight && whiteAccentRoles.has(fg)) {
      expect(colors[fg]).toBe('#FFFFFF')
    } else {
      expectPaletteText(
        colors[fg],
        over(colors[bg], rgb(colors['sideBar.background'])),
        fg
      )
    }
  })

  it('keeps ANSI text readable and preserves a usable black/white terminal pair', () => {
    const slots = Object.entries(colors).filter(([key]) =>
      key.startsWith('terminal.ansi')
    )
    expect(slots).toHaveLength(16)
    for (const [key, color] of slots) {
      // Dark ANSI black also serves as a TUI background, as in built-in themes.
      if (!isLight && key === 'terminal.ansiBlack') continue
      expectPaletteText(
        color,
        rgb(colors['terminal.background']),
        key,
        key === 'terminal.ansiBrightBlack'
      )
    }
    if (!isLight)
      expect(
        contrast(
          colors['terminal.ansiWhite'],
          rgb(colors['terminal.ansiBlack'])
        )
      ).toBeGreaterThanOrEqual(7)
  })
})
