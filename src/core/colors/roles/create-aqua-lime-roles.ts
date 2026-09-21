import { createAquaPalette } from './create-aqua-roles'
import { createAuraSyntax } from './create-aura-syntax'
import { AuraPalette } from './types'
import { auraAquaSyntaxAccents } from '../source/aqua'
import { aquaLimeLightSyntaxSource as colors } from '../source/aqua-lime'

export function createAquaLimePalette(): AuraPalette {
  // Derive on every build so UI, terminal, diagnostics, and future Aqua fixes
  // stay in sync. Only the inputs to the shared syntax role mapper differ.
  const aqua = createAquaPalette('light')
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
