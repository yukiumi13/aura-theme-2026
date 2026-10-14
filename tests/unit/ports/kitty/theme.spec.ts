import { readFileSync, readdirSync } from 'fs'
import Mustache from 'mustache'
import * as schemes from 'core/colors/schemes'
import { modernThemes } from 'ports/shared/modern-themes'
import { createAquaPalette } from 'core/colors/roles/create-aqua-roles'
import { createTemplateVars } from 'core/colors/template-vars'
import { contrast, rgb } from '../../../helpers/theme'

const themes = modernThemes(schemes)
const template = readFileSync(
  'src/ports/kitty/templates/aura-theme.conf',
  'utf8'
)
const fileName = (name: string) =>
  name.toLowerCase().replace(/ /g, '-') + '.conf'

function decode(text: string): Record<string, string> {
  const config: Record<string, string> = {}
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue
    const match = line.match(/^(\w+)\s+(.+)$/)
    if (!match) throw Error(`Invalid configuration line: ${line}`)
    const [, key, value] = match
    if (key in config) throw Error(`Repeated field: ${key}`)
    config[key] = value
  }
  return config
}

it('ships exactly the current shared lineup, excluding archived themes', () => {
  const manifest = JSON.parse(
    readFileSync('packages/vscode/package.json', 'utf8')
  )
  expect(themes.map((t) => t.name)).toEqual(
    manifest.contributes.themes.map((t: { label: string }) => t.label)
  )
  expect(themes).toHaveLength(9)
  expect(
    readdirSync('packages/kitty')
      .filter((f) => f.endsWith('.conf'))
      .sort()
  ).toEqual(themes.map((t) => fileName(t.name)).sort())
})

it.each(themes)(
  '$name preserves shared terminal colors and maps family chrome',
  ({ name, slug, scheme }) => {
    const rendered = Mustache.render(template, { ...scheme, name })
    const output = decode(
      readFileSync(`packages/kitty/${fileName(name)}`, 'utf8')
    )
    expect(output).toEqual(decode(rendered))
    expect(rendered).not.toMatch(/\{\{/)
    expect(Object.keys(output)).toHaveLength(33)
    Object.values(output).forEach((color) =>
      expect(color).toMatch(/^#[0-9A-F]{6}$/i)
    )

    const ghostty = readFileSync(
      `packages/ghostty/${fileName(name)}`,
      'utf8'
    )
    const ghosttyValue = (key: string) => {
      const match = ghostty.match(new RegExp(`^${key} = (.+)$`, 'm'))
      if (!match) throw Error(`Missing Ghostty value ${key}`)
      return match[1]
    }
    for (const [kittyKey, ghosttyKey] of [
      ['background', 'background'],
      ['foreground', 'foreground'],
      ['cursor', 'cursor-color'],
      ['cursor_text_color', 'cursor-text'],
      ['selection_background', 'selection-background'],
      ['selection_foreground', 'selection-foreground'],
    ])
      expect(output[kittyKey]).toBe(ghosttyValue(ghosttyKey))
    for (let index = 0; index < 16; index++) {
      const slot = ghostty.match(
        new RegExp(`^palette = ${index}=(.+)$`, 'm')
      )
      expect(slot).not.toBeNull()
      expect(output[`color${index}`]).toBe(slot![1])
    }

    const vscode = JSON.parse(
      readFileSync(`packages/vscode/themes/${slug}-color-theme.json`, 'utf8')
    ).colors
    expect(output.active_tab_background).toBe(vscode['tab.activeBackground'])
    expect(output.active_tab_foreground).toBe(vscode['tab.activeForeground'])
    expect(output.inactive_tab_background).toBe(
      vscode['tab.inactiveBackground']
    )
    expect(output.inactive_tab_foreground).toBe(
      scheme.terminalTitlebarForeground
    )
    expect(output.url_color).toBe(vscode['textLink.foreground'])

    for (const [ink, fill] of [
      ['foreground', 'background'],
      ['cursor_text_color', 'cursor'],
      ['selection_foreground', 'selection_background'],
    ])
      expect(
        contrast(output[ink], rgb(output[fill]))
      ).toBeGreaterThanOrEqual(4.5)
  }
)

it('resolves late chrome overrides and RGBA on the receiving surface', () => {
  const palette = createAquaPalette('light')
  palette.ui.chrome.activeTabBackground = '#12DADD80'
  palette.ui.focusBorder = '#12DADD80'
  palette.ui.linkRole.foreground = '#123456'
  const output = decode(
    Mustache.render(template, createTemplateVars(palette))
  )
  expect(output.active_tab_background).toBe('#85EBED')
  expect(output.active_border_color).toBe('#85EBED')
  expect(output.url_color).toBe('#123456')
})

it('keeps UI typography in an optional preset and leaves personal behavior intact', () => {
  const style = decode(
    readFileSync('packages/kitty/styles/aura-ui.conf', 'utf8')
  )
  expect(style).toEqual(
    decode(readFileSync('src/ports/kitty/extra/styles/aura-ui.conf', 'utf8'))
  )
  expect(style.tab_bar_style).toBe('separator')
  expect(style.active_tab_font_style).toBe('normal')
  expect(style.inactive_tab_font_style).toBe('normal')
  expect(style.tab_bar_edge).toBe('top')
  for (const config of [
    style,
    decode(Mustache.render(template, themes[0].scheme)),
  ]) {
    for (const key of [
      'font_family',
      'font_size',
      'bold_font',
      'text_composition_strategy',
      'background_opacity',
      'map',
      'mouse_map',
      'open_url_with',
    ]) {
      expect(config).not.toHaveProperty(key)
    }
  }
})
