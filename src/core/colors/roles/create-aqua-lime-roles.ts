import { createAquaPalette } from './create-aqua-roles'
import { createAuraSyntax } from './create-aura-syntax'
import { AuraPalette } from './types'
import { auraAquaSyntaxAccents } from '../source/aqua'
import {
  aquaLimeFrameBorder,
  aquaLimeInactiveSelection,
  aquaLimeLightBase as base,
  aquaLimeLightInput,
  aquaLimeLightSyntaxSource as colors,
} from '../source/aqua-lime'

export function createAquaLimePalette(): AuraPalette {
  const aqua = createAquaPalette('light', {
    base,
    tabs: base.appBackground,
    titleBorder: aquaLimeFrameBorder,
    inactiveSelection: aquaLimeInactiveSelection,
  })
  const syntaxSemantic = {
    ...aqua.semantic,
    brand: {
      ...aqua.semantic.brand,
      mintText: colors.mint,
      lime: colors.lime,
    },
    status: { ...aqua.semantic.status, orange: colors.yellow },
  }
  return {
    ...aqua,
    name: 'Aura Aqua Lime Light',
    slug: 'aura-aqua-lime-light',
    terminal: { ...aqua.terminal, background: base.background },
    ui: {
      ...aqua.ui,
      chrome: {
        ...aqua.ui.chrome,
        inactiveBackground: base.appBackground,
        border: aquaLimeFrameBorder,
        activeTabBackground: base.background,
        activeTabForeground: base.foregroundStrong,
      },
      surfaceRole: { ...aqua.ui.surfaceRole, input: aquaLimeLightInput },
    },
    syntax: {
      ...createAuraSyntax(
        aqua.base,
        syntaxSemantic,
        { ...auraAquaSyntaxAccents.light, accent: colors.aqua },
        'light'
      ),
      ignored: aqua.base.foregroundMuted,
    },
  }
}
