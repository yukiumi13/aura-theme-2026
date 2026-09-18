import { readFileSync, readdirSync } from 'fs'
import { resolve } from 'path'
import Mustache from 'mustache'
import { azureVariants } from 'core/colors/schemes'
import { withTerminalAuraAnsi } from 'ports/shared/terminal-ansi'
import { Theme, rgb, over, contrast } from '../../../helpers/theme'

const manifest = JSON.parse(
  readFileSync('packages/vscode/package.json', 'utf8')
)
const template = readFileSync(
  'src/ports/vscode/templates/theme.json',
  'utf8'
)

it('ships three pairs with simple names and preserves all six selection IDs', () => {
  const entries = manifest.contributes.themes
  expect(manifest.displayName).toBe('Aura Theme')
  expect(entries).toHaveLength(6)
  expect(
    entries.filter((entry: any) => entry.uiTheme === 'vs')
  ).toHaveLength(3)
  expect(entries.map((entry: any) => entry.id)).toEqual(
    expect.arrayContaining([
      'Aura 2026 Dark',
      'Aura Light 2026',
      'Aura Aqua Light 2026',
      'Aura Aqua Dark 2026',
      'Aura Azure 2026',
      'Aura 2026 Azure Light',
    ])
  )
  expect(new Set(entries.map((entry: any) => entry.id)).size).toBe(6)
  expect(entries.map((entry: any) => entry.label).sort()).toEqual([
    'Aura Aqua Dark',
    'Aura Aqua Light',
    'Aura Azure Dark',
    'Aura Azure Light',
    'Aura Dark',
    'Aura Light',
  ])
  expect(readdirSync('packages/vscode/themes').sort()).toEqual(
    entries.map((entry: any) => entry.path.split('/').pop()).sort()
  )
})

describe.each(azureVariants.map((scheme) => [scheme.paletteName, scheme]))(
  '%s',
  (_name, value) => {
    const scheme = value as Record<string, string>
    const theme: Theme = JSON.parse(
      Mustache.render(template, {
        ...withTerminalAuraAnsi(scheme),
        name: scheme.paletteName,
        type: scheme.paletteAppearance,
      })
    )
    const c = theme.colors
    const light = theme.type === 'light'
    const syntax = Array.from(
      new Set([
        ...Object.values(theme.semanticTokenColors).map((style) =>
          typeof style === 'string' ? style : style.foreground
        ),
        ...theme.tokenColors.reduce<string[]>((result, token) => {
          if (token.settings.foreground && !token.settings.background)
            result.push(token.settings.foreground)
          return result
        }, []),
      ])
    )
    it('renders the published payload with complete theme tokens', () => {
      expect(
        JSON.parse(
          readFileSync(
            resolve(
              'packages/vscode/themes',
              scheme.paletteSlug + '-color-theme.json'
            ),
            'utf8'
          )
        )
      ).toEqual(theme)
      expect(JSON.stringify(theme)).not.toMatch(/\{\{/)
      Object.values(c).forEach((color) =>
        expect(color).toMatch(/^#[\da-f]{6}([\da-f]{2})?$/i)
      )
    })
    it.each([
      'editor.background',
      'editor.lineHighlightBackground',
      'editor.selectionBackground',
      'editor.inactiveSelectionBackground',
      'editor.findMatchBackground',
    ])('keeps soft syntax distinguishable on %s', (surface) => {
      const bg = over(c[surface], rgb(c['editor.background']))
      syntax.forEach((fg) => {
        if (contrast(fg, bg) < (light ? 3 : 4.5))
          throw new Error(`${surface}: ${fg} contrast ${contrast(fg, bg)}`)
      })
    })
    it.each(['inserted', 'removed'])(
      'keeps syntax readable on layered %s diffs',
      (kind) => {
        const bg = over(
          c[`diffEditor.${kind}TextBackground`],
          over(
            c[`diffEditor.${kind}LineBackground`],
            rgb(c['editor.background'])
          )
        )
        syntax.forEach((fg) =>
          expect(contrast(fg, bg)).toBeGreaterThanOrEqual(light ? 3 : 4.5)
        )
      }
    )
    it.each([
      ['button.foreground', 'button.background'],
      ['button.foreground', 'button.hoverBackground'],
      ['tab.activeForeground', 'tab.activeBackground'],
      ['tab.unfocusedActiveForeground', 'tab.unfocusedActiveBackground'],
      ['activityBar.foreground', 'activityBar.activeBackground'],
      ['list.hoverForeground', 'list.hoverBackground'],
      ['list.activeSelectionForeground', 'list.activeSelectionBackground'],
      ['editorInlayHint.foreground', 'editorInlayHint.background'],
    ])('keeps %s readable on %s', (fg, bg) => {
      expect(
        contrast(c[fg], over(c[bg], rgb(c['editor.background'])))
      ).toBeGreaterThanOrEqual(light ? 3 : 4.5)
    })
    it('gives each terminal foreground a readable role on its actual background', () => {
      for (const [key, fg] of Object.entries(c)) {
        if (
          !key.startsWith('terminal.ansi') ||
          (!light && key === 'terminal.ansiBlack')
        )
          continue
        expect(
          contrast(fg, rgb(c['terminal.background']))
        ).toBeGreaterThanOrEqual(light ? 3 : 4.5)
      }
    })
  }
)
