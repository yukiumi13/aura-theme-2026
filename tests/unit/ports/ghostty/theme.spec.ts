import { readFileSync, readdirSync } from 'fs'
import Mustache from 'mustache'
import * as schemes from 'core/colors/schemes'
import { modernThemes } from 'ports/shared/modern-themes'
import { createAquaPalette } from 'core/colors/roles/create-aqua-roles'
import { createTemplateVars } from 'core/colors/template-vars'
import { contrast, rgb } from '../../../helpers/theme'

const template = readFileSync(
  'src/ports/ghostty/templates/aura-theme.conf',
  'utf8'
)
const themes = modernThemes(schemes)
const ansiNames = [
  'Black',
  'Red',
  'Green',
  'Yellow',
  'Blue',
  'Magenta',
  'Cyan',
  'White',
  'BrightBlack',
  'BrightRed',
  'BrightGreen',
  'BrightYellow',
  'BrightBlue',
  'BrightMagenta',
  'BrightCyan',
  'BrightWhite',
]
function decode(text: string): Record<string, string> {
  const config: Record<string, string> = {}
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue
    const match = line.match(/^([\w-]+) = (.+)$/)
    if (!match) throw Error(`Invalid configuration line: ${line}`)
    const [, key, value] = match
    const [index, color] = value.split('=')
    const resolvedKey = key === 'palette' ? `palette.${index}` : key
    if (resolvedKey in config) throw Error(`Repeated field: ${resolvedKey}`)
    config[resolvedKey] = key === 'palette' ? color : value
  }
  return config
}

it('shares the complete curated lineup with VS Code and ships only nine current configs', () => {
  const manifest = JSON.parse(
    readFileSync('packages/vscode/package.json', 'utf8')
  )
  expect(themes.map((t) => t.name)).toEqual(
    manifest.contributes.themes.map((t: { label: string }) => t.label)
  )
  expect(themes).toHaveLength(9)
  expect(
    readdirSync('packages/ghostty')
      .filter((f) => f.endsWith('.conf'))
      .sort()
  ).toEqual(
    themes
      .map((t) => t.name.toLowerCase().replace(/ /g, '-') + '.conf')
      .sort()
  )
})

it.each(themes)(
  '$name uses the accepted terminal palette and independently readable interactions',
  (theme) => {
    const file =
      'packages/ghostty/' +
      theme.name.toLowerCase().replace(/ /g, '-') +
      '.conf'
    const rendered = Mustache.render(template, {
      ...theme.scheme,
      name: theme.name,
    })
    const output = decode(readFileSync(file, 'utf8'))
    expect(output).toEqual(decode(rendered))
    expect(rendered).not.toMatch(/\{\{/)
    expect(Object.keys(output)).toHaveLength(30)
    for (const color of Object.values(output))
      expect(color).toMatch(/^#[0-9A-F]{6}$/i)

    const vscode = JSON.parse(
      readFileSync(
        `packages/vscode/themes/${theme.slug}-color-theme.json`,
        'utf8'
      )
    ).colors
    expect(output.background).toBe(vscode['terminal.background'])
    expect(output.foreground).toBe(vscode['terminal.foreground'])
    ansiNames.forEach((name, index) =>
      expect(output[`palette.${index}`]).toBe(vscode[`terminal.ansi${name}`])
    )
    for (const [ink, fill] of [
      ['foreground', 'background'],
      ['cursor-text', 'cursor-color'],
      ['selection-foreground', 'selection-background'],
      ['search-foreground', 'search-background'],
      ['search-selected-foreground', 'search-selected-background'],
    ])
      expect(
        contrast(output[ink], rgb(output[fill]))
      ).toBeGreaterThanOrEqual(4.5)
    expect(output['search-background']).not.toBe(
      output['search-selected-background']
    )
  }
)

it('keeps Aqua Lime identical in terminal roles while its editor syntax remains independent', () => {
  const aqua = decode(
    readFileSync('packages/ghostty/aura-aqua-light.conf', 'utf8')
  )
  const lime = decode(
    readFileSync('packages/ghostty/aura-aqua-lime-light.conf', 'utf8')
  )
  expect(lime).toEqual(aqua)
  expect(schemes.aquaLimeLight.syntaxString).not.toBe(
    schemes.aquaLight.syntaxString
  )
})

it('propagates late family overrides through roles and composites RGBA instead of truncating alpha', () => {
  const palette = createAquaPalette('light')
  palette.ui.action.background = '#00FED7'
  palette.ui.selectionRole.editor = '#12DADD80'
  const config = decode(
    Mustache.render(template, createTemplateVars(palette))
  )
  expect(config['cursor-color']).toBe('#00FED7')
  expect(config['search-selected-background']).toBe('#00FED7')
  expect(config['search-background']).toBe('#85EBED')
  expect(config['cursor-text']).not.toBe(palette.ui.action.foreground)
})

it('contains only documented color fields, leaving behavior and extended palette policy to users', () => {
  const config = decode(
    readFileSync('packages/ghostty/aura-aqua-light.conf', 'utf8')
  )
  expect(
    Object.keys(config)
      .filter((k) => !k.startsWith('palette.'))
      .sort()
  ).toEqual(
    [
      'background',
      'foreground',
      'cursor-color',
      'cursor-text',
      'selection-background',
      'selection-foreground',
      'search-background',
      'search-foreground',
      'search-selected-background',
      'search-selected-foreground',
      'split-divider-color',
      'unfocused-split-fill',
      'window-titlebar-background',
      'window-titlebar-foreground',
    ].sort()
  )
  expect(readFileSync('packages/ghostty/README.md', 'utf8')).toContain(
    'theme = aura-aqua-light.conf'
  )
  expect(
    readFileSync('packages/ghostty/THIRD_PARTY_NOTICES.md', 'utf8')
  ).toContain('Copyright (c) Microsoft Corporation')
})

it.each(['aura', 'aqua', 'lime', 'azure'])(
  'gives Herdr %s readable active and navigation rows without replacing ANSI roles',
  (family) => {
    const text = readFileSync(
      `packages/ghostty/herdr/${family}.toml`,
      'utf8'
    )
    const light = themes.find(
      (t) => t.family === family && t.appearance === 'light'
    )!
    const dark = themes.find(
      (t) => t.family === family && t.appearance === 'dark'
    )!
    expect(text).toBe(
      Mustache.render(
        readFileSync('src/ports/ghostty/templates/herdr.toml', 'utf8'),
        { light: light.scheme, dark: dark.scheme }
      )
    )
    expect(text).toContain('light_name = "terminal"')
    expect(text).toContain('dark_name = "terminal"')
    expect(text).not.toMatch(
      /^\s*(accent|text|green|yellow|red|blue|teal)\s*=/m
    )
    for (const theme of [light, dark]) {
      for (const surface of [
        'terminalListBackground',
        'terminalListFocusBackground',
        'terminalHoverBackground',
      ]) {
        expect(
          contrast(
            theme.scheme.terminalSurfaceForeground,
            rgb(theme.scheme[surface])
          )
        ).toBeGreaterThanOrEqual(4.5)
      }
    }
  }
)
