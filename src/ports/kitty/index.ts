import { AuraAPI } from 'core'
import { resolve } from 'path'
import { modernThemes } from '../shared/modern-themes'

export async function KittyPort(Aura: AuraAPI) {
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
