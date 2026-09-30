import { readFileSync, existsSync } from 'fs'
import { createHash } from 'crypto'
import { createAquaPalette } from 'core/colors/roles/create-aqua-roles'
import { createAquaLimePalette } from 'core/colors/roles/create-aqua-lime-roles'
import { createAquaBadgeEmphasis } from 'core/colors/roles/create-aqua-effects'
import { auraAquaEffectColors } from 'core/colors/source/aqua'
import { createTemplateVars } from 'core/colors/template-vars'
import * as schemes from 'core/colors/schemes'
import { AuraPalette } from 'core/colors/roles'
import { compileVscodeEnhancements } from 'ports/vscode/enhancements'

const template = readFileSync(
  'src/ports/vscode/templates/enhancements.css',
  'utf8'
)
const extension = JSON.parse(
  readFileSync('packages/vscode/package.json', 'utf8')
)
const descriptor = (palette: AuraPalette) => ({
  id: palette.name,
  name: palette.name,
  slug: palette.slug,
  appearance: palette.appearance,
  scheme: createTemplateVars(palette),
})
const render = (palette: AuraPalette) =>
  compileVscodeEnhancements([descriptor(palette)], extension, template)

it('compiles a changed source anchor through roles and the adapter into shipped CSS declarations', () => {
  const original = createAquaPalette('light')
  const changed = createAquaPalette('light')
  changed.ui.badge.emphasis = createAquaBadgeEmphasis({
    ...auraAquaEffectColors,
    markerCyan: '#29E8CF',
  })
  const before = render(original)
  const after = render(changed)
  expect(after.css).toContain('#29E8CF 0%')
  expect(after.css).toContain('#29E8CF66')
  expect(after.css).not.toEqual(before.css)
  expect(after.manifest.themes[0].rules.slice(0, 3)).toEqual(
    before.manifest.themes[0].rules.slice(0, 3)
  )
})

it('keeps badge-only changes independent of action normal, hover and focus', () => {
  const palette = createAquaPalette('light')
  const before = render(palette)
  palette.ui.badge.background = '#778899'
  palette.ui.badge.emphasis!.fill.stops[1].color = '#778899'
  const after = render(palette)
  expect(after.manifest.themes[0].rules.slice(0, 3)).toEqual(
    before.manifest.themes[0].rules.slice(0, 3)
  )
  expect(after.manifest.themes[0].fallback.badge.background).toBe('#778899')
  expect(after.css).toContain('#778899 52%')
  expect(after.css).not.toContain('--vscode-badge-background')
})

it('inherits Aqua effects through roles and derives scopes from renamed registration metadata', () => {
  const aqua = createAquaPalette('light')
  const lime = createAquaLimePalette()
  expect(lime.ui.action.enhancement).toEqual(aqua.ui.action.enhancement)
  expect(lime.ui.badge.emphasis).toEqual(aqua.ui.badge.emphasis)
  lime.slug = 'future-aqua-derivative'
  const result = compileVscodeEnhancements(
    [descriptor(lime)],
    { ...extension, publisher: 'example', name: 'renamed' },
    template
  )
  expect(result.css).toContain(
    '.example-renamed-themes-future-aqua-derivative-color-theme-json'
  )
  expect(result.css).not.toContain('yukiumi13')
})

it('reproduces the complete generated CSS and inventory from the registered schemes', () => {
  const all = [
    schemes.dark,
    schemes.light,
    ...schemes.aquaVariants,
    schemes.aquaLimeLight,
    ...schemes.limeVariants,
    ...schemes.azureVariants,
  ]
  const inputs = extension.contributes.themes.map((entry: any) => ({
    id: entry.id,
    name: entry.label,
    slug: entry.path
      .replace('./themes/', '')
      .replace('-color-theme.json', ''),
    appearance: entry.uiTheme === 'vs' ? 'light' : 'dark',
    scheme:
      all.find(
        (s) => `./themes/${s.paletteSlug}-color-theme.json` === entry.path
      ) ?? schemes.dark,
  }))
  const result = compileVscodeEnhancements(inputs, extension, template)
  expect(result.css).toEqual(
    readFileSync('packages/vscode/extension/aqua-gradients.css', 'utf8')
  )
  expect(result.manifest).toEqual(
    JSON.parse(
      readFileSync('packages/vscode/extension/aqua-effects.json', 'utf8')
    )
  )
  expect(result.manifest.sha256).toBe(
    createHash('sha256').update(result.css).digest('hex')
  )
  expect(
    result.manifest.themes.filter((t) => t.rules.length).map((t) => t.label)
  ).toEqual(['Aura Aqua Light', 'Aura Aqua Lime Light'])
  for (const theme of result.manifest.themes.filter(
    (t) => !t.rules.length
  )) {
    expect(result.css).not.toContain(theme.scope)
  }
  expect(template).not.toMatch(/#[0-9a-f]{6}/i)
  expect(
    existsSync('src/ports/vscode/extra/extension/aqua-gradients.css')
  ).toBe(false)
})

it('produces no stale styles when all optional roles are absent', () => {
  const palette = createAquaPalette('light')
  delete palette.ui.action.enhancement
  delete palette.ui.badge.emphasis
  const result = render(palette)
  expect(result.css).not.toContain('linear-gradient')
  expect(result.css).not.toContain('.monaco-workbench')
  expect(result.manifest.themes[0].rules).toEqual([])
  expect(result.manifest.themes[0].fallback.action.background).toBe(
    palette.ui.action.background
  )
})

it('fails the build for invalid effect colors or unordered stop positions', () => {
  const palette = createAquaPalette('light')
  palette.ui.badge.emphasis!.edge = 'not-a-color'
  expect(() => render(palette)).toThrow('Invalid effect color')
  palette.ui.badge.emphasis!.edge = '#FFFFFF'
  palette.ui.badge.emphasis!.fill.stops[1].position = -2
  expect(() => render(palette)).toThrow('Invalid effect stop position')
})
