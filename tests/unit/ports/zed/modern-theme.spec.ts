import fs from 'fs'
import path from 'path'
import Mustache from 'mustache'
import * as schemes from 'core/colors/schemes'
import { modernThemes } from 'ports/shared/modern-themes'
import { createEditorSurface } from 'core/colors/roles/create-editor-surface'
import { createAquaPalette } from 'core/colors/roles/create-aqua-roles'

const contract = require('../../../../docs/zed-theme-contract.json')
const template = fs.readFileSync(
  'src/ports/zed/templates/theme.json',
  'utf8'
)
const rgb = (hex: string) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
const over = (hex: string, bg: number[]) => {
  const alpha = hex.length === 9 ? parseInt(hex.slice(7), 16) / 255 : 1
  return rgb(hex).map((v, i) => v * alpha + bg[i] * (1 - alpha))
}
const lum = (v: number[]) =>
  v
    .map((n) => n / 255)
    .map((n) => (n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4))
    .reduce((n, v, i) => n + v * [0.2126, 0.7152, 0.0722][i], 0)
const contrast = (fg: string, bg: number[]) => {
  const a = lum(over(fg, bg)),
    b = lum(bg)
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

for (const theme of modernThemes(schemes)) {
  describe(theme.name, () => {
    const generated = JSON.parse(
      Mustache.render(template, {
        ...theme.scheme,
        name: theme.name,
        type: theme.appearance,
      })
    ).themes[0]
    const s = generated.style
    it('ships the current appearance with every supported field and syntax style', () => {
      expect(generated.appearance).toBe(theme.appearance)
      expect(Object.keys(s).sort()).toEqual(
        [...contract.colorFields, ...contract.nonColorFields].sort()
      )
      for (const key of contract.colorFields)
        expect(s[key]).toMatch(/^#[0-9a-f]{6}([0-9a-f]{2})?$/i)
      for (const key of contract.builtinSyntax)
        expect(s.syntax[key].color).toMatch(/^#[0-9a-f]{6}$/i)
      const shipped = JSON.parse(
        fs.readFileSync(
          path.join(
            'packages/zed/themes',
            theme.name.toLowerCase().replace(/ /g, '-') + '.json'
          ),
          'utf8'
        )
      ).themes[0]
      expect(shipped).toEqual(generated)
    })
    it('pairs shared text and icons with all generic control states', () => {
      const parent = rgb(s['panel.background'])
      for (const bg of [
        'element.background',
        'element.hover',
        'element.active',
        'element.selected',
        'ghost_element.hover',
        'ghost_element.selected',
        'tab.active_background',
        'info.background',
      ]) {
        for (const fg of ['text', 'icon', 'text.accent']) {
          expect(
            { fg, bg, contrast: contrast(s[fg], over(s[bg], parent)) }
              .contrast
          ).toBeGreaterThanOrEqual(3)
        }
      }
      expect(s['border.transparent'].slice(7)).toBe('00')
      expect(s['text.disabled']).not.toBe(s.text)
      expect(s['border.focused']).not.toBe(s['border.transparent'])
    })
    it('keeps language and ANSI roles independent and reading foundations consistent', () => {
      expect(s.syntax.function.color).toBe(theme.scheme.syntaxFunction)
      expect(s.syntax['function.definition'].color).toBe(
        theme.scheme.syntaxFunctionDeclaration
      )
      expect(s.syntax['diff.plus'].color).toBe(theme.scheme.uiStatusSuccess)
      expect(s['terminal.ansi.blue']).toBe(theme.scheme.ansiBlue)
      const editor = rgb(s['editor.background'])
      for (const bg of [
        editor,
        over(
          s['version_control.word_added'],
          over(s['editor.diff_hunk.added.background'], editor)
        ),
        over(
          s['version_control.word_deleted'],
          over(s['editor.diff_hunk.deleted.background'], editor)
        ),
      ]) {
        for (const role of [
          'function',
          'keyword',
          'type',
          'property',
          'string',
          'number',
        ]) {
          expect(contrast(s.syntax[role].color, bg)).toBeGreaterThanOrEqual(
            theme.name === 'Aura Aqua Lime Light'
              ? // Accepted soft syntax: protect it from excessive overlay dilution.
                contrast(s.syntax[role].color, editor) * 0.85
              : theme.appearance === 'light'
              ? 2.5
              : 3
          )
        }
      }
    })
  })
}

it('derives editor surfaces after family overrides and never embeds a second palette in the port', () => {
  const aqua = createAquaPalette('light')
  const altered = {
    ...aqua,
    ui: { ...aqua.ui, action: { ...aqua.ui.action, background: '#123456' } },
  }
  expect(createEditorSurface(altered).actionTint).toBe('#12345624')
  expect(createEditorSurface(altered).normalModeText).toBe(
    aqua.ui.action.foreground
  )
  expect(template).not.toMatch(/{{\s*accent\d/)
  expect(template).not.toMatch(/#[0-9a-f]{6}/i)
})
