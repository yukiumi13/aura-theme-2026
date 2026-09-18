import { readFileSync } from 'fs'
import { resolve } from 'path'
import Mustache from 'mustache'
import { aquaVariants, dark } from 'core/colors/schemes'
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

it('keeps Aqua Dark rooted in Aura Dark while giving interactions an aqua identity', () => {
  const aura = render(withTerminalAuraAnsi(dark))
  const aqua = render(withTerminalAuraAnsi(aquaVariants[1]))
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
  expect(aqua.colors['button.background']).toBe('#12DADD')
  expect(aqua.colors['tab.activeBackground']).toBe('#12DADD')
  expect(aqua.colors['activityBar.activeBackground']).toBe('#12DADD')
})

describe.each(aquaVariants.map((scheme) => [scheme.paletteName, scheme]))(
  '%s',
  (_name, value) => {
    const scheme = value as Record<string, string>
    const theme = render(withTerminalAuraAnsi(scheme))
    const colors = theme.colors
    const isLight = theme.type === 'light'
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
        id: isLight ? 'Aura Aqua Light 2026' : 'Aura Aqua Dark 2026',
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

    it('separates aqua actions and information from Aura mint and neutral hover', () => {
      expect(colors['button.background']).toBe('#12DADD')
      expect(colors['button.background']).not.toBe(auraMint)
      expect(colors['statusBarItem.remoteBackground']).toBe(
        colors['button.background']
      )
      expect(colors['statusBarItem.remoteForeground']).toBe(
        colors['button.foreground']
      )
      expect(colors['list.hoverForeground']).toBe(
        colors['editor.foreground']
      )
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
        'tab.hoverBorder',
      ]) {
        expect(colors[key]).toBe('#00000000')
      }
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

    it('uses the reference white-on-aqua treatment only for light active controls', () => {
      if (!isLight) return
      for (const key of [
        'button.foreground',
        'badge.foreground',
        'tab.activeForeground',
        'activityBar.foreground',
        'activityBarTop.foreground',
        'statusBarItem.remoteForeground',
      ]) {
        expect(colors[key]).toBe('#FFFFFF')
      }
      expect(colors['button.background']).toBe('#12DADD')
      expect(colors['editor.foreground']).not.toBe('#FFFFFF')
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
          (Array.isArray(token.scope)
            ? token.scope
            : [token.scope]
          ).includes(scope)
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
      [
        'list.inactiveSelectionForeground',
        'list.inactiveSelectionBackground',
      ],
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
        'activityBar.foreground',
        'activityBarTop.foreground',
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
  }
)
