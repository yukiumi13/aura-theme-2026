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
  aquaHover: '#0BC7CC',
  aquaBright: '#76E9EC',
  selectionTint: '#277D87',
  onAqua: '#07363A',
  // Tuned against each appearance's surfaces; not copied from default syntax.
  syntax: {
    light: {
      blue: '#215FA6',
      blueStrong: '#174D8C',
      violet: '#6550AE',
      orchid: '#874D9D',
      orchidStrong: '#78418F',
      rose: '#A13F70',
      roseMuted: '#93466D',
      amber: '#905C19',
      blueMuted: '#355F87',
      slate: '#576979',
    },
    dark: {
      blue: '#7DCDE9',
      violet: '#B9A4EF',
      orchid: '#D6B1F0',
      orchidStrong: '#E1C0F5',
      rose: '#EDABC8',
      roseMuted: '#C88FA9',
      amber: '#EDC58F',
      blueMuted: '#9ABED5',
      slate: '#A9BCC6',
    },
  },
  light: {
    paper: '#F8FCFE',
    chrome: '#EEF4F6',
    surface: '#E8F0F3',
    line: '#F1F7F9',
    hover: '#E2EDF0',
    tabs: '#E3EDF1',
    border: '#D7E4E8',
    borderStrong: '#B6C9D0',
    foreground: '#28363B',
    foregroundStrong: '#1E2A2F',
    foregroundMuted: '#51656D',
    foregroundSubtle: '#63777E',
    disabled: '#91A5AC',
    comment: '#596C75',
    selection: '#DDEEF0',
    shadow: '#102A3218',
  },
  dark: {
    background: '#111A1E',
    chrome: '#0C1418',
    surface: '#18252A',
    line: '#152126',
    hover: '#223239',
    tabs: '#0C1418',
    elevated: '#1B292F',
    border: '#273B42',
    borderStrong: '#3A525C',
    foreground: '#D8E6EA',
    foregroundStrong: '#EDF6F8',
    foregroundMuted: '#ACBDC3',
    foregroundSubtle: '#829AA3',
    disabled: '#566C74',
    comment: '#90A6AE',
    selection: '#133438',
    selectionInactive: '#132A2E',
    shadow: '#00000066',
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
