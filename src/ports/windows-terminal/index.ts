import { AuraAPI } from 'core'
import { resolve } from 'path'
import {
  terminalAnsiLabel,
  terminalAnsiSuffix,
  withTerminalSemanticAnsi,
} from '../shared/terminal-ansi'

type VariantScheme = typeof import('core/colors/schemes').variants[number]

export async function WindowsTerminalPort(Aura: AuraAPI) {
  const { createPort, createReadme, colorSchemes, constants } = Aura
  const { info, packageVersion } = constants

  const portName = 'Windows Terminal'
  const version = packageVersion
  const previewURL = `https://github.com/${info.author.username}/assets/blob/master/images/${info.slug}/aura-windows-terminal-preview.png?raw=true`
  const templateFolder = resolve(__dirname, 'templates')
  const template = resolve(templateFolder, 'aura-theme.json')
  const names = {
    auraDark: `${info.shortName} Dark`,
    auraDarkSoftText: `${info.shortName} Dark (Soft Text)`,
    auraSoftDark: `${info.shortName} Soft Dark`,
    auraSoftDarkSoftText: `${info.shortName} Soft Dark (Soft Text)`,
  }

  await createPort({
    template,
    outputFileName: 'aura-theme',
    replacements: {
      ...colorSchemes.dark,
      ...info,
      displayName: names.auraDark,
    },
  })

  await createPort({
    template,
    outputFileName: 'aura-theme-soft-text',
    replacements: {
      ...colorSchemes.darkSoft,
      ...info,
      displayName: names.auraDarkSoftText,
    },
  })

  await createPort({
    template,
    outputFileName: 'aura-theme-soft-dark',
    replacements: {
      ...colorSchemes.softDark,
      ...info,
      displayName: names.auraSoftDark,
    },
  })

  await createPort({
    template,
    outputFileName: 'aura-theme-soft-dark-soft-text',
    replacements: {
      ...colorSchemes.softDarkSoft,
      ...info,
      displayName: names.auraSoftDarkSoftText,
    },
  })

  await Promise.all(
    [...colorSchemes.variants, colorSchemes.inkVariant].flatMap(
      ({ family, scheme }: VariantScheme) => [
        createPort({
          template,
          outputFileName: family.slug,
          replacements: {
            ...scheme,
            ...info,
            displayName: family.name,
          },
        }),
        createPort({
          template,
          outputFileName: family.slug + '-' + terminalAnsiSuffix,
          replacements: {
            ...withTerminalSemanticAnsi(scheme),
            ...info,
            displayName: family.name + ' ' + terminalAnsiLabel,
          },
        }),
      ]
    )
  )

  await createReadme({
    template: resolve(templateFolder, 'README.md'),
    replacements: {
      portName,
      version,
      previewURL,
    },
  })
}
