import { readFileSync, readdirSync } from 'fs'
import Mustache from 'mustache'
import * as schemes from 'core/colors/schemes'
import { modernThemes } from 'ports/shared/modern-themes'
import { createAquaPalette } from 'core/colors/roles/create-aqua-roles'
import { createTemplateVars } from 'core/colors/template-vars'
import { contrast, over, rgb } from '../../helpers/theme'

const themes = modernThemes(schemes)
const template = readFileSync(
  'src/ports/superset/templates/theme.json',
  'utf8'
)
const pack = JSON.parse(
  readFileSync('packages/superset/aura-theme-2026.json', 'utf8')
)
const idFor = (name: string) => name.toLowerCase().replace(/ /g, '-')
const render = (scheme: Record<string, string>) =>
  JSON.parse(Mustache.render(template, scheme))

it('ships the curated lineup as identical individual themes and one import pack', () => {
  expect(pack.themes.map((t: { name: string }) => t.name)).toEqual(
    themes.map((t) => t.name)
  )
  expect(new Set(pack.themes.map((t: { id: string }) => t.id)).size).toBe(9)
  expect(
    readdirSync('packages/superset')
      .filter((f) => f.endsWith('.json'))
      .sort()
  ).toEqual(
    [
      'aura-theme-2026.json',
      ...themes.map((t) => `${idFor(t.name)}.json`),
    ].sort()
  )
  expect(
    readFileSync('packages/superset/aura-theme-2026.json').length
  ).toBeLessThan(256 * 1024)
})

it.each(themes)(
  '$name has complete UI, editor and terminal colors without built-in fallback',
  ({ name, scheme, appearance, slug }) => {
    const output = JSON.parse(
      readFileSync(`packages/superset/${idFor(name)}.json`, 'utf8')
    )
    expect(output).toEqual(
      pack.themes.find((t: { id: string }) => t.id === idFor(name))
    )
    expect(output).toEqual(
      render({
        ...scheme,
        id: idFor(name),
        name,
        type: appearance,
        version: output.version,
      })
    )
    expect(output.type).toBe(appearance)
    const groups = [
      output.ui,
      output.terminal,
      output.editor.colors,
      output.editor.syntax,
    ]
    expect(groups.map(Object.keys).map((k) => k.length)).toEqual([
      41, 22, 24, 14,
    ])
    for (const group of groups)
      for (const value of Object.values(group))
        expect(value).toMatch(/^#[\da-f]{6}([\da-f]{2})?$/i)

    // Check against independently shipped editor and terminal contracts.
    const vscode = JSON.parse(
      readFileSync(`packages/vscode/themes/${slug}-color-theme.json`, 'utf8')
    )
    const kitty = readFileSync(`packages/kitty/${idFor(name)}.conf`, 'utf8')
      .split(/\r?\n/)
      .filter((l) => l.trim() && !l.startsWith('#'))
      .map((l) => l.split(/\s+/, 2))
      .reduce<Record<string, string>>((values, [key, value]) => {
        values[key] = value
        return values
      }, {})
    expect(output.editor.colors.background).toBe(
      vscode.colors['editor.background']
    )
    expect(output.editor.colors.cursor).toBe(
      vscode.colors['editorCursor.foreground']
    )
    expect(output.editor.colors.selection).toBe(
      vscode.colors['editor.selectionBackground']
    )
    expect(output.editor.syntax.functionCall).toBe(scheme.syntaxFunction)
    expect(output.editor.syntax.string).toBe(scheme.syntaxString)
    expect(output.editor.colors.addition).toBe(scheme.uiStatusSuccess)
    expect(output.editor.colors.deletion).toBe(scheme.uiStatusError)
    for (const [target, source] of [
      ['background', 'background'],
      ['foreground', 'foreground'],
      ['cursor', 'cursor'],
      ['cursorAccent', 'cursor_text_color'],
      ['selectionBackground', 'selection_background'],
      ['selectionForeground', 'selection_foreground'],
    ])
      expect(output.terminal[target]).toBe(kitty[source])
    const slots = [
      'black',
      'red',
      'green',
      'yellow',
      'blue',
      'magenta',
      'cyan',
      'white',
      'brightBlack',
      'brightRed',
      'brightGreen',
      'brightYellow',
      'brightBlue',
      'brightMagenta',
      'brightCyan',
      'brightWhite',
    ]
    slots.forEach((key, i) =>
      expect(output.terminal[key]).toBe(kitty[`color${i}`])
    )
    // Superset accent is a row hover, not a primary action fill. Neutral ink must
    // remain usable on both sidebar selection and repeated hover surfaces.
    expect(
      contrast(
        output.ui.accentForeground,
        over(output.ui.accent, rgb(output.ui.background))
      )
    ).toBeGreaterThan(4.5)
    expect(
      contrast(
        output.ui.sidebarAccentForeground,
        over(output.ui.sidebarAccent, rgb(output.ui.sidebar))
      )
    ).toBeGreaterThan(4.5)
    expect(
      contrast(output.terminal.cursorAccent, rgb(output.terminal.cursor))
    ).toBeGreaterThan(4.5)
    expect(
      new Set([1, 2, 3, 4, 5].map((i) => output.ui[`chart${i}`])).size
    ).toBe(5)
  }
)

it('propagates final base/role overrides while keeping syntax, ANSI and badge independent', () => {
  const palette = createAquaPalette('light')
  palette.base.background = '#F1F2F3'
  palette.ui.surfaceRole.hover = '#DDEEFF'
  palette.ui.action.background = '#12ABCD'
  palette.ui.badge.background = '#BBDDCC'
  palette.ui.chartSeries[3] = '#123456'
  palette.syntax.string = '#246810'
  const first = render(createTemplateVars(palette))
  expect(first.ui.background).toBe('#F1F2F3')
  expect(first.editor.colors.background).toBe('#F1F2F3')
  expect(first.ui.accent).toBe('#DDEEFF')
  expect(first.ui.primary).toBe('#12ABCD')
  expect(first.ui.highlight).toBe('#BBDDCC')
  expect(first.ui.chart4).toBe('#123456')
  expect(first.editor.syntax.string).toBe('#246810')
  const ansiBefore = first.terminal.green
  palette.ansi.green = '#456789'
  const second = render(createTemplateVars(palette))
  expect(second.terminal.green).toBe('#456789')
  expect(ansiBefore).not.toBe(second.terminal.green)
  expect(second.editor).toEqual(first.editor)
})

it('uses named role/base inputs and keeps app-specific colors out of the port', () => {
  expect(template).not.toMatch(/#[\da-f]{6}|\baccent\d+\b/i)
  expect(template).not.toMatch(/fontFamily|fontSize|isBuiltIn|isCustom/)
})
