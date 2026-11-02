import { AuraAPI } from 'core'
import { resolve } from 'path'
import { modernThemes } from '../shared/modern-themes'

export async function ZedPort(Aura: AuraAPI) {
  const {
    createPort,
    createReadme,
    copyExtraFiles,
    colorSchemes,
    constants,
  } = Aura
  const { info, packageVersion, folders } = constants
  const templateFolder = resolve(__dirname, 'templates')
  const themes = modernThemes(colorSchemes)
  await copyExtraFiles(__dirname)
  await createPort({
    template: resolve(templateFolder, 'extension.toml'),
    outputFileName: 'extension',
    replacements: { ...info, portName: 'Zed', version: packageVersion },
  })
  await createPort({
    template: resolve(templateFolder, 'semantic-token-settings.json'),
    outputFileName: 'semantic-token-settings',
    replacements: {},
  })
  for (const theme of themes) {
    await createPort({
      template: resolve(templateFolder, 'theme.json'),
      outputDist: resolve(folders.distFolder, 'zed', 'themes'),
      outputFileName: theme.name.toLowerCase().replace(/ /g, '-'),
      replacements: {
        ...info,
        ...theme.scheme,
        name: theme.name,
        type: theme.appearance,
      },
    })
  }
  await createReadme({
    template: resolve(templateFolder, 'README.md'),
    replacements: {
      portName: 'Zed',
      version: packageVersion,
      themeRows: themes
        .map(({ name, appearance }) => `| ${name} | ${appearance} |`)
        .join('\n'),
    },
  })
}
