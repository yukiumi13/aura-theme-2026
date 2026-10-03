import { AuraAPI } from 'core'
import { resolve } from 'path'
import { modernThemes } from '../shared/modern-themes'

export async function GhosttyPort(Aura: AuraAPI) {
  const { createPort, createReadme, copyExtraFiles, colorSchemes } = Aura
  const templateFolder = resolve(__dirname, 'templates')
  const themes = modernThemes(colorSchemes)
  await copyExtraFiles(__dirname)

  for (const theme of themes) {
    await createPort({
      template: resolve(templateFolder, 'aura-theme.conf'),
      outputFileName: theme.name.toLowerCase().replace(/ /g, '-'),
      replacements: { ...theme.scheme, name: theme.name },
    })
  }

  // Optional Herdr surface corrections; its text and status colors continue
  // to inherit the host ANSI palette. Aqua Lime shares Aqua's terminal roles.
  for (const family of [...new Set(themes.map((theme) => theme.family))]) {
    const light = themes.find(
      (theme) => theme.family === family && theme.appearance === 'light'
    )!
    const dark = themes.find(
      (theme) => theme.family === family && theme.appearance === 'dark'
    )!
    await createPort({
      template: resolve(templateFolder, 'herdr.toml'),
      outputFileName: `herdr/${family}`,
      replacements: { light: light.scheme, dark: dark.scheme },
    })
  }

  await createReadme({
    template: resolve(templateFolder, 'README.md'),
    replacements: {
      themeRows: themes
        .map(
          ({ name }) =>
            `| ${name} | \`${name.toLowerCase().replace(/ /g, '-')}.conf\` |`
        )
        .join('\n'),
    },
  })
}
