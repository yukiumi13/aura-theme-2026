import { AuraAPI } from 'core'
import { resolve } from 'path'
import { withTerminalAuraAnsi } from '../shared/terminal-ansi'

export async function VscodePort(Aura: AuraAPI) {
  const {
    copyExtraFiles,
    createPort,
    createReadme,
    colorSchemes,
    constants,
  } = Aura
  const { info, folders, packageVersion } = constants
  const templateFolder = resolve(__dirname, 'templates')
  const outputDist = resolve(folders.distFolder, 'vscode', 'themes')
  // IDs preserve saved selections and theme-specific customizations across renames.
  const themes = [
    {
      id: 'Aura 2026 Dark',
      slug: 'aura-dark',
      scheme: colorSchemes.dark,
      name: 'Aura Dark',
      appearance: 'dark',
    },
    {
      id: 'Aura Light 2026',
      slug: colorSchemes.light.paletteSlug,
      scheme: withTerminalAuraAnsi(colorSchemes.light),
      name: colorSchemes.light.paletteName,
      appearance: 'light',
    },
    ...colorSchemes.aquaVariants.map((scheme) => ({
      id:
        scheme.paletteAppearance === 'light'
          ? 'Aura Aqua Light 2026'
          : 'Aura Aqua Dark 2026',
      slug: scheme.paletteSlug,
      scheme: withTerminalAuraAnsi(scheme),
      name: scheme.paletteName,
      appearance: scheme.paletteAppearance,
    })),
    ...colorSchemes.azureVariants.map((scheme) => ({
      id:
        scheme.paletteAppearance === 'light'
          ? 'Aura 2026 Azure Light'
          : 'Aura Azure 2026',
      slug: scheme.paletteSlug,
      scheme: withTerminalAuraAnsi(scheme),
      name: scheme.paletteName,
      appearance: scheme.paletteAppearance,
    })),
  ]
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
  await createReadme({
    template: resolve(templateFolder, 'README.md'),
    replacements: {},
  })
}
