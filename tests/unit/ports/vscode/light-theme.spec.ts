import { readFileSync } from 'fs'
import { resolve } from 'path'
import Mustache from 'mustache'
import { light } from 'core/colors/schemes'
import { auraMint, auraInteractionAqua } from 'core/colors/source/aura'
import { auraLightSemantic2026 } from 'core/colors/source/light'
import { withTerminalAuraAnsi } from 'ports/shared/terminal-ansi'
import {
  Theme,
  rgb,
  over,
  luminance,
  contrast,
  expectReadable,
} from '../../../helpers/theme'

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
    expect(luminance(editor)).toBeGreaterThan(0.9)
    expect(luminance(editor)).toBeLessThan(1)
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

  it('preserves original mint fills with dark ink in controls and remote status', () => {
    expect(colors['button.background']).toBe(auraMint)
    expect(colors['button.hoverBackground']).toBe(auraInteractionAqua)
    expect(colors['badge.background']).toBe(auraMint)
    expect(colors['activityBarBadge.background']).toBe(auraMint)
    expect(colors['statusBarItem.remoteBackground']).toBe(auraMint)
    expect(colors['statusBarItem.remoteForeground']).toBe(
      colors['button.foreground']
    )
    expect(colors['statusBarItem.remoteHoverBackground']).toBe(
      colors['button.hoverBackground']
    )
    expect(colors['statusBarItem.remoteHoverForeground']).toBe(
      colors['button.foreground']
    )
    expect(luminance(rgb(colors['button.foreground']))).toBeLessThan(0.1)
    expect(theme.semanticTokenColors.string).not.toBe(auraMint)
    expect(colors['terminal.ansiGreen']).not.toBe(auraMint)
  })

  it('keeps neutral hover labels separate from purple match highlights', () => {
    for (const key of [
      'list.hoverForeground',
      'list.focusForeground',
      'list.activeSelectionIconForeground',
      'menu.selectionForeground',
      'tab.hoverForeground',
      'breadcrumb.focusForeground',
      'editorSuggestWidget.selectedIconForeground',
      'quickInputList.focusIconForeground',
    ]) {
      expect(colors[key]).toBe(colors['sideBar.foreground'])
    }
    expect(colors['list.hoverBackground']).toMatch(/^#[0-9a-f]{6}$/i)
    expect(colors['list.highlightForeground']).toBe(
      colors['textLink.foreground']
    )
    expect(colors['list.highlightForeground']).not.toBe(
      colors['list.hoverForeground']
    )
  })

  it('removes decorative button outlines while retaining keyboard focus contrast', () => {
    for (const key of [
      'button.border',
      'button.secondaryBorder',
      'extensionButton.border',
    ]) {
      expect(colors[key]).toBe('#00000000')
    }
    for (const surface of ['editor.background', 'sideBar.background']) {
      expect(
        contrast(colors.focusBorder, rgb(colors[surface]))
      ).toBeGreaterThanOrEqual(3)
    }
  })

  it('retains a visible selection after the list loses focus', () => {
    const sidebar = rgb(colors['sideBar.background'])
    const inactive = over(
      colors['list.inactiveSelectionBackground'],
      sidebar
    )
    const active = over(colors['list.activeSelectionBackground'], sidebar)
    // A subtle filled selection must still separate from the surrounding row.
    expect(
      contrast(colors['list.inactiveSelectionBackground'], sidebar)
    ).toBeGreaterThan(1.1)
    expect(luminance(active)).toBeLessThan(luminance(inactive))
    expectReadable(
      colors['list.inactiveSelectionForeground'],
      inactive,
      'inactive selection'
    )
  })

  it('uses light neutral hover fills across rows, tools, and tabs without decorative outlines', () => {
    const hover = colors['list.hoverBackground']
    for (const key of [
      'toolbar.hoverBackground',
      'tab.hoverBackground',
      'tab.unfocusedHoverBackground',
    ]) {
      expect(colors[key]).toBe(hover)
    }
    expect(colors['tab.hoverBorder']).toBe('#00000000')
    expect(colors['tab.unfocusedHoverBorder']).toBe('#00000000')
    expect(
      contrast(
        colors['tab.activeBorderTop'],
        rgb(colors['tab.activeBackground'])
      )
    ).toBeGreaterThanOrEqual(3)
  })

  it('makes inlay hints subordinate to code while keeping their text readable', () => {
    const background = rgb(colors['editorInlayHint.background'])
    expectReadable(
      colors['editorInlayHint.foreground'],
      background,
      'inlay hint'
    )
    expect(
      contrast(colors['editorInlayHint.foreground'], background)
    ).toBeLessThan(contrast(colors['editor.foreground'], background))
  })

  it('keeps Git and success indicators independent of terminal ANSI overrides', () => {
    const altered: Theme = JSON.parse(
      Mustache.render(template, {
        ...withTerminalAuraAnsi(light),
        ansiBrightGreen: '#FF00FF',
        name: light.paletteName,
        type: light.paletteAppearance,
      })
    )
    expect(altered.colors['terminal.ansiBrightGreen']).toBe('#FF00FF')
    for (const key of [
      'gitDecoration.addedResourceForeground',
      'gitDecoration.untrackedResourceForeground',
      'editorGutter.addedBackground',
      'editorOverviewRuler.addedForeground',
      'terminalCommandDecoration.successBackground',
      'chat.linesAddedForeground',
    ]) {
      expect(altered.colors[key]).toBe(auraLightSemantic2026.status.success)
      for (const surface of [
        'sideBar.background',
        'list.hoverBackground',
        'list.activeSelectionBackground',
        'list.inactiveSelectionBackground',
      ]) {
        expectReadable(
          altered.colors[key],
          over(colors[surface], rgb(colors['sideBar.background'])),
          key + ' on ' + surface
        )
      }
    }
    const conflict = colors['gitDecoration.conflictingResourceForeground']
    expect(conflict).toBe(auraLightSemantic2026.status.orangeBright)
    expect(conflict).not.toBe(
      colors['gitDecoration.modifiedResourceForeground']
    )
    expectReadable(
      conflict,
      over(
        colors['list.activeSelectionBackground'],
        rgb(colors['sideBar.background'])
      ),
      'selected Git conflict'
    )
    expect(altered.tokenColors).toEqual(theme.tokenColors)
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
    ['activityBarBadge.foreground', 'activityBarBadge.background'],
    ['panelTitleBadge.foreground', 'panelTitleBadge.background'],
    ['extensionButton.foreground', 'extensionButton.background'],
    ['extensionButton.foreground', 'extensionButton.hoverBackground'],
    [
      'extensionButton.prominentForeground',
      'extensionButton.prominentBackground',
    ],
    [
      'extensionButton.prominentForeground',
      'extensionButton.prominentHoverBackground',
    ],
    [
      'statusBarItem.prominentForeground',
      'statusBarItem.prominentBackground',
    ],
    [
      'statusBarItem.prominentHoverForeground',
      'statusBarItem.prominentHoverBackground',
    ],
    ['statusBar.foreground', 'statusBarItem.compactHoverBackground'],
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
    ['tab.unfocusedInactiveForeground', 'tab.unfocusedInactiveBackground'],
    ['tab.unfocusedActiveForeground', 'tab.unfocusedActiveBackground'],
    ['tab.unfocusedHoverForeground', 'tab.unfocusedHoverBackground'],
    ['list.inactiveSelectionForeground', 'list.inactiveSelectionBackground'],
    ['editorInlayHint.foreground', 'editorInlayHint.background'],
    ['icon.foreground', 'toolbar.hoverBackground'],
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
