import {
  auraBase2026,
  auraSemantic2026,
  auraMint,
  auraInteractionAqua,
  auraDefaultFamily,
} from './aura'
import { auraLightBase2026, auraLightSemantic2026 } from './light'
import { AuraSemanticPalette, AuraVariantFamily } from '../roles/types'

// Representative of the supplied image's cyan buttons (#0CDADD–#15DADD).
// Only the color relationships are adapted; no reference artwork is bundled.
export const auraAquaColors = {
  aqua: auraInteractionAqua,
  aquaHover: '#46E4E6',
  aquaBright: '#76E9EC',
  selectionTint: '#277D87',
  // The light variant deliberately follows the reference's soft white-on-aqua UI.
  onAquaLight: '#FFFFFF',
  onAquaDark: auraBase2026.background,
  // Light has its own ink palette; dark inherits Aura's existing syntax.
  syntax: {
    light: {
      blue: '#4A80A7',
      blueStrong: '#39749D',
      violet: '#8669BA',
      orchid: '#A36CAF',
      orchidStrong: '#955FA4',
      rose: '#AD6B91',
      roseMuted: '#A06A89',
      amber: '#9C7954',
      blueMuted: '#5F829B',
      slate: '#71848D',
    },
  },
  light: {
    paper: '#F8FCFE',
    chrome: '#F5F9FB',
    surface: '#F0F5F8',
    line: '#F0FAFB',
    hover: '#ECF1F5',
    tabs: '#EFF5F8',
    border: '#E1E9ED',
    borderStrong: '#BDCFD8',
    foreground: '#4A5861',
    foregroundStrong: '#394952',
    foregroundMuted: '#6B7D86',
    foregroundSubtle: '#80919A',
    disabled: '#AAB7BD',
    comment: '#72858E',
    selection: '#DDF6F7',
    shadow: '#14384410',
  },
  dark: {
    // Only interaction tints are Aqua-specific. The dark base is inherited.
    tabs: auraBase2026.background,
    selection: '#13282D',
    selectionInactive: auraBase2026.surfaceAlt,
  },
}

const { light, dark } = auraAquaColors
const syntax = auraAquaColors.syntax

// Type/constant and control-flow accents can differ from the UI family.
export const auraAquaSyntaxAccents = {
  light: { accent: syntax.light.blue, accentBright: syntax.light.violet },
  dark: {
    accent: auraDefaultFamily.accent,
    accentBright: auraDefaultFamily.accentBright,
  },
}

export const auraAquaLightBase = {
  ...auraLightBase2026,
  shadow: light.shadow,
  background: light.paper,
  appBackground: light.chrome,
  sidebar: light.chrome,
  panel: light.chrome,
  surface: light.surface,
  surfaceAlt: light.line,
  surfaceHover: light.hover,
  border: light.border,
  borderStrong: light.borderStrong,
  foreground: light.foreground,
  foregroundStrong: light.foregroundStrong,
  foregroundMuted: light.foregroundMuted,
  foregroundSubtle: light.foregroundSubtle,
  disabled: light.disabled,
  comment: light.comment,
}

export const auraAquaDarkBase = auraBase2026

const aquaAction = (foreground: string) => ({
  background: auraAquaColors.aqua,
  foreground,
  hoverBackground: auraAquaColors.aquaHover,
  border: '#00000000',
})

export const auraAquaLightSemantic: AuraSemanticPalette = {
  ...auraLightSemantic2026,
  action: aquaAction(auraAquaColors.onAquaLight),
  brand: {
    ...auraLightSemantic2026.brand,
    blue: syntax.light.blueMuted,
    lavender: syntax.light.orchid,
    lavenderBright: syntax.light.orchidStrong,
    lavenderMuted: syntax.light.slate,
    pink: syntax.light.rose,
    pinkSoft: syntax.light.roseMuted,
  },
  status: {
    ...auraLightSemantic2026.status,
    orange: syntax.light.amber,
    info: syntax.light.blue,
    infoBright: syntax.light.blue,
  },
}

export const auraAquaDarkSemantic: AuraSemanticPalette = {
  ...auraSemantic2026,
  action: aquaAction(auraAquaColors.onAquaDark),
  status: {
    ...auraSemantic2026.status,
    info: auraAquaColors.aqua,
    infoBright: auraAquaColors.aquaBright,
  },
}

export const auraAquaLightFamily: AuraVariantFamily = {
  name: 'Aura 2026 Aqua Light',
  slug: 'aura-aqua-light-2026',
  accent: syntax.light.blue,
  accentBright: syntax.light.blueStrong,
  accentSoft: auraAquaColors.selectionTint,
  companion: auraLightSemantic2026.brand.mintText,
  companionBright: auraLightSemantic2026.status.success,
  companionSoft: '#2F8869',
}

export const auraAquaDarkFamily: AuraVariantFamily = {
  name: 'Aura 2026 Aqua Dark',
  slug: 'aura-aqua-dark-2026',
  accent: auraAquaColors.aqua,
  accentBright: auraAquaColors.aquaBright,
  accentSoft: dark.selection,
  companion: auraMint,
  companionBright: '#9FFFE2',
  companionSoft: '#3EA784',
}
