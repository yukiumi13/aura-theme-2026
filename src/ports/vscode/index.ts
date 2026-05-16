import { AuraAPI } from 'core'
import { resolve } from 'path'

type VariantScheme = typeof import('core/colors/schemes').variants[number]

export async function VscodePort(Aura: AuraAPI) {
  const {
    copyExtraFiles,
    createPort,
    createReadme,
    colorSchemes,
    constants,
  } = Aura

  const { info, folders, packageVersion } = constants

  const portName = 'Visual Studio Code'
  const version = packageVersion
  const type = 'dark'
  const templateFolder = resolve(__dirname, 'templates')
  const template = resolve(templateFolder, 'theme.json')
  const outputDist = resolve(folders.distFolder, 'vscode', 'themes')
  const outputFileNameSuffix = 'color-theme'

  const names = {
    auraDark: `${info.shortName} Dark`,
    auraDarkSoftText: `${info.shortName} Dark (Soft Text)`,
    auraSoftDark: `${info.shortName} Soft Dark`,
    auraSoftDarkSoftText: `${info.shortName} Soft Dark (Soft Text)`,
  }

  const variantThemeEntries = [
    ...colorSchemes.variants,
    colorSchemes.inkVariant,
  ].map(({ family }: VariantScheme) => ({
    label: family.name,
    uiTheme: 'vs-dark',
    path: `./themes/${family.slug}-color-theme.json`,
  }))

  await copyExtraFiles(__dirname)

  await createPort({
    template: resolve(templateFolder, 'package.json'),
    outputFileName: `package`,
    replacements: {
      ...info,
      ...names,
      variantThemes: JSON.stringify(variantThemeEntries, null, 8)
        .slice(1, -1)
        .trim(),
      type,
      portName,
      version,
      accent12: colorSchemes.dark.accent12,
    },
  })

  await createPort({
    template,
    outputDist,
    outputFileName: `aura-dark-${outputFileNameSuffix}`,
    replacements: {
      type,
      ...colorSchemes.dark,
      name: names.auraDark,
    },
  })

  await createPort({
    template,
    outputDist,
    outputFileName: `aura-dark-soft-text-${outputFileNameSuffix}`,
    replacements: {
      type,
      ...colorSchemes.darkSoft,
      name: names.auraDarkSoftText,
    },
  })

  await createPort({
    template,
    outputDist,
    outputFileName: `aura-soft-dark-${outputFileNameSuffix}`,
    replacements: {
      type,
      ...colorSchemes.softDark,
      name: names.auraSoftDark,
    },
  })

  await createPort({
    template,
    outputDist,
    outputFileName: `aura-soft-dark-soft-text-${outputFileNameSuffix}`,
    replacements: {
      type,
      ...colorSchemes.softDarkSoft,
      name: names.auraSoftDarkSoftText,
    },
  })

  await Promise.all(
    [...colorSchemes.variants, colorSchemes.inkVariant].map(
      ({ family, scheme }: VariantScheme) =>
        createPort({
          template,
          outputDist,
          outputFileName: `${family.slug}-${outputFileNameSuffix}`,
          replacements: {
            type,
            ...scheme,
            name: family.name,
          },
        })
    )
  )

  await createReadme({
    template: resolve(templateFolder, 'README.md'),
    replacements: {},
  })
}
