import { readFileSync, readdirSync } from 'fs'
import { spawnSync } from 'child_process'
import * as schemes from 'core/colors/schemes'
import { modernThemes } from 'ports/shared/modern-themes'

const directory = 'packages/oh-my-pi/themes'
const appearances = modernThemes(schemes)
const fileId = (name: string) => name.toLowerCase().replace(/ /g, '-')
const load = (id: string) =>
  JSON.parse(readFileSync(directory + '/' + id + '.json', 'utf8'))

it('ships the shared modern lineup and loadable theme files', () => {
  expect(readdirSync(directory).sort()).toEqual(
    appearances.map(({ name }) => fileId(name) + '.json').sort()
  )
})

it.each(appearances)(
  '$name maps TUI colors and the shared terminal palette',
  ({ name, scheme }) => {
    const id = fileId(name)
    const theme = load(id)
    expect(theme.name).toBe(id)
    expect(Object.keys(theme.colors)).toHaveLength(70)
    expect(theme.colors).toMatchObject({
      text: scheme.baseForeground,
      toolOutput: scheme.baseForeground,
      toolPendingBg: theme.colors.toolSuccessBg,
      userMessageText: scheme.baseForeground,
    })
    expect(theme.export.pageBg).toBe(theme.terminal.background)
    expect(theme.export.cardBg).toBe(theme.terminal.chrome)
    expect(theme.terminal.ansi).toHaveLength(16)
    const ghostty = readFileSync('packages/ghostty/' + id + '.conf', 'utf8')
    theme.terminal.ansi.forEach((color: string, i: number) =>
      expect(ghostty).toContain('palette = ' + i + '=' + color)
    )
    for (const color of [
      ...Object.values(theme.colors),
      ...Object.values(theme.export),
      ...theme.terminal.ansi,
    ])
      expect(color).toMatch(/^#[0-9A-F]{6}$/i)
  }
)

it('keeps the accepted Aqua Lime reading, input and selection surfaces', () => {
  const theme = load('aura-aqua-lime-light')
  expect(theme.terminal.background).toBe('#FFFFFF')
  expect(theme.colors).toMatchObject({
    statusLineBg: '#FBFBFB',
    userMessageBg: '#F4F4F4',
    selectedBg: '#E9F3F4',
    toolSuccessBg: '#FBFBFB',
    borderAccent: '#12DADD',
  })
})

it('refreshes managed copies and preserves custom profile files', () => {
  const result = spawnSync(
    process.execPath,
    ['tests/unit/ports/oh-my-pi/profile.mjs'],
    { encoding: 'utf8' }
  )
  if (result.status !== 0) throw Error(result.stderr || result.stdout)
})
