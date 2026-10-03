import { withTerminalAuraAnsi } from './terminal-ansi'

// Shared curated lineup. Keep VS Code's persisted IDs/slugs stable; other ports
// use the display names to generate their current, year-free file names.
export function modernThemes(
  colorSchemes: typeof import('core/colors/schemes')
) {
  return [
    {
      id: 'Aura 2026 Dark',
      slug: 'aura-dark',
      scheme: colorSchemes.dark,
      name: 'Aura Dark',
      family: 'aura',
      appearance: 'dark',
    },
    {
      id: 'Aura Light 2026',
      slug: colorSchemes.light.paletteSlug,
      scheme: withTerminalAuraAnsi(colorSchemes.light),
      name: colorSchemes.light.paletteName,
      family: 'aura',
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
      family: 'aqua',
      appearance: scheme.paletteAppearance,
    })),
    {
      id: colorSchemes.aquaLimeLight.paletteName,
      slug: colorSchemes.aquaLimeLight.paletteSlug,
      scheme: withTerminalAuraAnsi(colorSchemes.aquaLimeLight),
      name: colorSchemes.aquaLimeLight.paletteName,
      family: 'aqua',
      appearance: 'light',
    },
    ...colorSchemes.limeVariants.map((scheme) => ({
      id: scheme.paletteName,
      slug: scheme.paletteSlug,
      scheme: withTerminalAuraAnsi(scheme),
      name: scheme.paletteName,
      family: 'lime',
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
      family: 'azure',
      appearance: scheme.paletteAppearance,
    })),
  ]
}
