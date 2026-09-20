import { auraBase2026 } from './aura'
import {
  auraAquaColors,
  auraAquaLightBase,
  auraAquaLightFamily,
  auraAquaDarkFamily,
  auraAquaLightSemantic,
  auraAquaDarkSemantic,
} from './aqua'
import { AuraSemanticPalette } from '../roles/types'

// A relationship between hues, not a single lime replacement for every accent.
// Mint and green-cyan are reference samples; the citrus edges are softened
// interpretations of the bottle's lemon yellow (#FED532).
export const auraLimeColors = {
  mint: '#64EBAF',
  greenCyan: '#00FED7',
  lemon: '#F5DF72',
  light: {
    paper: '#FBFDFB',
    chrome: '#F5F9F3',
    surface: '#F0F6F0',
    line: '#F3F9EB',
    hover: '#EDF5EA',
    tabs: '#F1F6ED',
    border: '#E2EBCF',
    borderStrong: '#BCCDA7',
    titleBorder: '#DCEAB0',
    focus: '#397C76',
    selection: '#E8F5D6',
    selectionTint: '#568E69',
  },
  dark: {
    selection: '#17352F',
    selectionTint: '#132A24',
    selectionInactive: '#132721',
    focus: auraAquaColors.lime,
  },
}

const { light } = auraLimeColors

export const auraLimeLightBase = {
  ...auraAquaLightBase,
  background: light.paper,
  appBackground: light.chrome,
  sidebar: light.chrome,
  panel: light.chrome,
  surface: light.surface,
  surfaceAlt: light.line,
  surfaceHover: light.hover,
  border: light.border,
  borderStrong: light.borderStrong,
}

export const auraLimeDarkBase = auraBase2026

export const auraLimeLightFamily = {
  ...auraAquaLightFamily,
  name: 'Aura Lime Light',
  slug: 'aura-lime-light',
  accentSoft: light.selectionTint,
}

export const auraLimeDarkFamily = {
  ...auraAquaDarkFamily,
  name: 'Aura Lime Dark',
  slug: 'aura-lime-dark',
  accent: auraLimeColors.mint,
  accentBright: auraLimeColors.greenCyan,
  accentSoft: auraLimeColors.dark.selectionTint,
}

function limeSemantic(source: AuraSemanticPalette): AuraSemanticPalette {
  return {
    ...source,
    action: {
      background: auraLimeColors.mint,
      foreground: source.action!.foreground,
      hoverBackground: auraLimeColors.greenCyan,
      border: auraLimeColors.lemon,
    },
  }
}

export const auraLimeLightSemantic = limeSemantic(auraAquaLightSemantic)
export const auraLimeDarkSemantic = limeSemantic(auraAquaDarkSemantic)
