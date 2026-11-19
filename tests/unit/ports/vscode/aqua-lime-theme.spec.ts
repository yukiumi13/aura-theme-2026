import { readFileSync } from 'fs'
import Mustache from 'mustache'
import { aquaLight, aquaLimeLight } from 'core/colors/schemes'
import { createAquaPalette } from 'core/colors/roles/create-aqua-roles'
import { createAquaLimePalette } from 'core/colors/roles/create-aqua-lime-roles'
import { withTerminalAuraAnsi } from 'ports/shared/terminal-ansi'
import { Theme } from '../../../helpers/theme'

const template = readFileSync(
  'src/ports/vscode/templates/theme.json',
  'utf8'
)
const render = (scheme: Record<string, string>): Theme =>
  JSON.parse(
    Mustache.render(template, {
      ...withTerminalAuraAnsi(scheme),
      name: scheme.paletteName,
      type: scheme.paletteAppearance,
    })
  )
const theme = render(aquaLimeLight)

it('separates paper, chrome and input while preserving Aqua actions and ANSI', () => {
  const aqua = createAquaPalette('light')
  const lime = createAquaLimePalette()
  expect(lime.semantic).toEqual(aqua.semantic)
  expect(lime.ansi).toEqual(aqua.ansi)
  expect(lime.ui.action).toEqual({
    ...aqua.ui.action,
    secondaryHoverBackground: lime.base.surfaceHover,
  })
  expect(lime.ui.chrome.modernActivity).toEqual(
    aqua.ui.chrome.modernActivity
  )
  expect(theme.colors).toMatchObject({
    'editor.background': '#FFFFFF',
    'terminal.background': '#FFFFFF',
    'tab.activeBackground': '#FFFFFF',
    'tab.activeForeground': lime.base.foregroundStrong,
    'modernEditorTab.activeHoverActionBackground': '#FFFFFF',
    'sideBar.background': '#FBFBFB',
    'auxiliaryBar.background': '#FBFBFB',
    'titleBar.activeBackground': '#FBFBFB',
    'editorGroupHeader.tabsBackground': '#FBFBFB',
    'tab.inactiveBackground': '#FBFBFB',
    'titleBar.inactiveBackground': '#FBFBFB',
    'modernUI.inactiveShellBackground': '#FBFBFB',
    'sideBar.border': '#E5E5E5',
    'input.border': '#DFDFDF',
    'input.background': '#F4F4F4',
    'inlineChatInput.background': '#F4F4F4',
    'list.inactiveSelectionBackground': '#E9F3F4',
    'list.hoverBackground': '#E9E9E9',
    'button.background': '#12DADD',
    'activityBarBadge.background': '#64EBAF',
  })
})

it('retains the accepted 67 percent source groups without splitting syntax roles', () => {
  const syntax = theme.semanticTokenColors
  for (const key of ['type', 'class', 'boolean', 'enumMember', 'macro']) {
    expect(syntax[key]).toBe('#35BDCC')
  }
  expect(syntax.string).toBe('#47C491')
  expect(syntax.number).toBe('#DCB547')
  const scopeColor = (scope: string) =>
    [...theme.tokenColors]
      .reverse()
      .find((r) =>
        (Array.isArray(r.scope) ? r.scope : [r.scope]).includes(scope)
      )?.settings.foreground
  expect(scopeColor('markup.quote')).toBe(syntax.string)
  expect(scopeColor('entity.name.tag')).toBe(syntax.string)
  expect(scopeColor('constant.language.boolean')).toBe(syntax.boolean)
  expect(scopeColor('meta.selector.css')).toBe('#A9CD6E')
  const aqua = render(aquaLight)
  for (const role of [
    'keyword',
    'function',
    'function.declaration',
    'property',
    'comment',
    'variable',
  ]) {
    expect(syntax[role]).toEqual(aqua.semanticTokenColors[role])
  }
  expect(
    theme.tokenColors.map((r) => [r.scope, r.settings.fontStyle])
  ).toEqual(aqua.tokenColors.map((r) => [r.scope, r.settings.fontStyle]))
})

it('registers the derivative and builds the package from the shared template', () => {
  const path = './themes/aura-aqua-lime-light-color-theme.json'
  const manifest = JSON.parse(
    readFileSync('packages/vscode/package.json', 'utf8')
  )
  expect(manifest.contributes.themes).toContainEqual({
    id: 'Aura Aqua Lime Light',
    label: 'Aura Aqua Lime Light',
    uiTheme: 'vs',
    path,
  })
  expect(
    JSON.parse(readFileSync('packages/vscode/' + path, 'utf8'))
  ).toEqual(theme)
  expect(JSON.stringify(theme)).not.toMatch(/\{\{/)
})
