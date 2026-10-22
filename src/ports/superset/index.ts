import { AuraAPI } from 'core'
import { resolve } from 'path'
import { folders } from 'shared/constants'
import { modernThemes } from '../shared/modern-themes'

export async function SupersetPort(Aura: AuraAPI) {
  const {
    createInMemoryPort,
    createFromInMemoryPort,
    createReadme,
    copyExtraFiles,
  } = Aura
  const templateFolder = resolve(__dirname, 'templates')
  const outputFolder = resolve(folders.distFolder, 'superset')
  const themes = modernThemes(Aura.colorSchemes)
  const compiled = []
  await copyExtraFiles(__dirname)

  for (const theme of themes) {
    const id = theme.name.toLowerCase().replace(/ /g, '-')
    const text = await createInMemoryPort({
      template: resolve(templateFolder, 'theme.json'),
      replacements: {
        ...theme.scheme,
        id,
        name: theme.name,
        type: theme.appearance,
        version: Aura.constants.packageVersion,
      },
    })
    // Parse the compiler result once. The import pack contains the exact same
    // definitions as the individual files, with no second mapping or palette.
    compiled.push(JSON.parse(text))
    await createFromInMemoryPort({
      template: text,
      output: resolve(outputFolder, `${id}.json`),
    })
  }

  await createFromInMemoryPort({
    template: JSON.stringify({ themes: compiled }, null, 2) + '\n',
    output: resolve(outputFolder, 'aura-theme-2026.json'),
  })
  await createReadme({
    template: resolve(templateFolder, 'README.md'),
    replacements: {
      themeRows: themes
        .map(({ name, appearance }) => {
          const id = name.toLowerCase().replace(/ /g, '-')
          return `| ${name} | ${appearance} | \`${id}\` | \`${id}.json\` |`
        })
        .join('\n'),
    },
  })
}
