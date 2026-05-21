import { AuraAPI } from 'core'
import { resolve } from 'path'
import {
  terminalAnsiLabel,
  terminalAnsiSuffix,
  withTerminalAuraAnsi,
  withTerminalSemanticAnsi,
} from '../shared/terminal-ansi'

type VariantScheme = typeof import('core/colors/schemes').variants[number]

export async function GhosttyPort(Aura: AuraAPI) {
  const { createPort, createReadme, colorSchemes, constants } = Aura
  const { info, packageVersion } = constants

  const portName = 'Ghostty'
  const version = packageVersion
  const templateFolder = resolve(__dirname, 'templates')
  const template = resolve(templateFolder, 'aura-theme.conf')

  const names = {
    auraDark: `${info.shortName} Dark`,
    auraDarkSoftText: `${info.shortName} Dark (Soft Text)`,
    auraSoftDark: `${info.shortName} Soft Dark`,
    auraSoftDarkSoftText: `${info.shortName} Soft Dark (Soft Text)`,
  }

  await createPort({
    template,
    outputFileName: 'aura-dark',
    replacements: {
      ...info,
      ...colorSchemes.dark,
      name: names.auraDark,
    },
  })

  await createPort({
    template,
    outputFileName: 'aura-dark-soft-text',
    replacements: {
      ...info,
      ...colorSchemes.darkSoft,
      name: names.auraDarkSoftText,
    },
  })

  await createPort({
    template,
    outputFileName: 'aura-soft-dark',
    replacements: {
      ...info,
      ...colorSchemes.softDark,
      name: names.auraSoftDark,
    },
  })

  await createPort({
    template,
    outputFileName: 'aura-soft-dark-soft-text',
    replacements: {
      ...info,
      ...colorSchemes.softDarkSoft,
      name: names.auraSoftDarkSoftText,
    },
  })

  await Promise.all(
    [...colorSchemes.variants, colorSchemes.inkVariant].flatMap(
      ({ family, scheme }: VariantScheme) => [
        createPort({
          template,
          outputFileName: family.slug,
          replacements: {
            ...info,
            ...withTerminalAuraAnsi(scheme),
            name: family.name,
          },
        }),
        createPort({
          template,
          outputFileName: family.slug + '-' + terminalAnsiSuffix,
          replacements: {
            ...info,
            ...withTerminalSemanticAnsi(scheme),
            name: family.name + ' ' + terminalAnsiLabel,
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
    },
  })
}
