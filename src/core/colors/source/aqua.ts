import {
  auraBase2026,
  auraSemantic2026,
  auraMint,
  auraInteractionAqua,
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
  onAqua: '#07363A',
  // Tuned against each appearance's surfaces; not copied from default syntax.
  syntax: {
    light: {
      blue: '#0868AF',
      blueStrong: '#005B9B',
      violet: '#7441CC',
      orchid: '#9A3FA9',
      orchidStrong: '#883399',
      rose: '#B23177',
      roseMuted: '#A23870',
      amber: '#A15315',
      blueMuted: '#355F87',
      slate: '#576979',
    },
    dark: {
      blue: '#64D8F3',
      violet: '#B6A0FF',
      orchid: '#DDA7FF',
      orchidStrong: '#E9BEFF',
      rose: '#FF9BCF',
      roseMuted: '#DD85B5',
      amber: '#FFC98A',
      blueMuted: '#96D0EC',
      slate: '#B4C8D3',
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
    foreground: '#29343C',
    foregroundStrong: '#1D2B34',
    foregroundMuted: '#536471',
    foregroundSubtle: '#657781',
    disabled: '#91A5AC',
    comment: '#596C75',
    selection: '#DDF6F7',
    shadow: '#14384410',
  },
  dark: {
    background: '#182C36',
    chrome: '#142630',
    surface: '#203642',
    line: '#1C333E',
    hover: '#293D48',
    tabs: '#172A35',
    elevated: '#243D49',
    border: '#304955',
    borderStrong: '#4C6775',
    foreground: '#E0F0F5',
    foregroundStrong: '#F0FAFD',
    foregroundMuted: '#B6CDD8',
    foregroundSubtle: '#90ABB9',
    disabled: '#617F8F',
    comment: '#9DB9C6',
    selection: '#19434D',
    selectionInactive: '#1B3B46',
    shadow: '#00000040',
  },
}

const { light, dark } = auraAquaColors
const syntax = auraAquaColors.syntax

// Type/constant and control-flow accents can differ from the UI family.
export const auraAquaSyntaxAccents = {
  light: { accent: syntax.light.blue, accentBright: syntax.light.violet },
  dark: { accent: syntax.dark.blue, accentBright: syntax.dark.violet },
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

export const auraAquaDarkBase = {
  ...auraBase2026,
  shadow: dark.shadow,
  background: dark.background,
  appBackground: dark.chrome,
  sidebar: dark.chrome,
  panel: dark.chrome,
  surface: dark.surface,
  surfaceAlt: dark.line,
  surfaceHover: dark.hover,
  elevated: dark.elevated,
  border: dark.border,
  borderStrong: dark.borderStrong,
  foreground: dark.foreground,
  foregroundStrong: dark.foregroundStrong,
  foregroundMuted: dark.foregroundMuted,
  foregroundSubtle: dark.foregroundSubtle,
  disabled: dark.disabled,
  comment: dark.comment,
}

const aquaAction = {
  background: auraAquaColors.aqua,
  foreground: auraAquaColors.onAqua,
  hoverBackground: auraAquaColors.aquaHover,
  border: '#00000000',
}

export const auraAquaLightSemantic: AuraSemanticPalette = {
  ...auraLightSemantic2026,
  action: aquaAction,
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
  action: aquaAction,
  brand: {
    ...auraSemantic2026.brand,
    blue: syntax.dark.blueMuted,
    lavender: syntax.dark.orchid,
    lavenderBright: syntax.dark.orchidStrong,
    lavenderMuted: syntax.dark.slate,
    pink: syntax.dark.rose,
    pinkSoft: syntax.dark.roseMuted,
  },
  status: {
    ...auraSemantic2026.status,
    error: '#FF9485',
    errorBright: '#FF9485',
    orange: syntax.dark.amber,
    info: auraAquaColors.aqua,
    infoBright: auraAquaColors.aquaBright,
  },
}

export const auraAquaLightFamily: AuraVariantFamily = {
  name: 'Aura Aqua Light 2026',
  slug: 'aura-aqua-light-2026',
  accent: syntax.light.blue,
  accentBright: syntax.light.blueStrong,
  accentSoft: auraAquaColors.selectionTint,
  companion: auraLightSemantic2026.brand.mintText,
  companionBright: auraLightSemantic2026.status.success,
  companionSoft: '#2F8869',
}

export const auraAquaDarkFamily: AuraVariantFamily = {
  name: 'Aura Aqua Dark 2026',
  slug: 'aura-aqua-dark-2026',
  accent: auraAquaColors.aqua,
  accentBright: auraAquaColors.aquaBright,
  accentSoft: dark.selection,
  companion: auraMint,
  companionBright: '#9FFFE2',
  companionSoft: '#3EA784',
}
