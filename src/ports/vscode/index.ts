import { AuraAPI } from 'core'
import { resolve } from 'path'
import { modernThemes } from '../shared/modern-themes'
import { promises as fs } from 'fs'
import { compileVscodeEnhancements } from './enhancements'

export async function VscodePort(Aura: AuraAPI) {
  const {
    copyExtraFiles,
    createPort,
    createReadme,
    createFromInMemoryPort,
    colorSchemes,
    constants,
  } = Aura
  const { info, folders, packageVersion } = constants
  const templateFolder = resolve(__dirname, 'templates')
  const outputDist = resolve(folders.distFolder, 'vscode', 'themes')
  const themes = modernThemes(colorSchemes)
  await copyExtraFiles(__dirname)
  await createPort({
    template: resolve(templateFolder, 'package.json'),
    outputFileName: 'package',
    replacements: {
      ...info,
      type: 'dark',
      portName: 'Visual Studio Code',
      version: packageVersion,
      accent12: colorSchemes.dark.accent12,
      variantThemes: JSON.stringify(
        themes.map(({ id, slug, name, appearance }) => ({
          id,
          label: name,
          uiTheme: appearance === 'light' ? 'vs' : 'vs-dark',
          path: './themes/' + slug + '-color-theme.json',
        })),
        null,
        8
      )
        .slice(1, -1)
        .trim(),
    },
  })
  for (const { slug, scheme, name, appearance } of themes) {
    await createPort({
      template: resolve(templateFolder, 'theme.json'),
      outputDist,
      outputFileName: slug + '-color-theme',
      replacements: { ...scheme, name, type: appearance },
    })
  }
  // Metadata and effect scope use the same registered themes as the JSON build.
  const packageDir = resolve(folders.distFolder, 'vscode')
  const extension = JSON.parse(
    await fs.readFile(resolve(packageDir, 'package.json'), 'utf8')
  )
  const enhancements = compileVscodeEnhancements(
    themes,
    extension,
    await fs.readFile(resolve(templateFolder, 'enhancements.css'), 'utf8')
  )
  await createFromInMemoryPort({
    template: enhancements.css,
    output: resolve(packageDir, 'extension/aqua-gradients.css'),
  })
  await createFromInMemoryPort({
    template: JSON.stringify(enhancements.manifest, null, 2) + '\n',
    output: resolve(packageDir, 'extension/aqua-effects.json'),
  })
  await createReadme({
    template: resolve(templateFolder, 'README.md'),
    replacements: {},
  })
}
