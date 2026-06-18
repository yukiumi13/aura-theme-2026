import {
  AuraBasePalette,
  AuraSemanticPalette,
  AuraVariantFamily,
} from '../roles/types'

export const auraBase2026: AuraBasePalette = {
  shadow: '#000000',
  background: '#09080D',
  appBackground: '#0A090F',
  sidebar: '#0A090F',
  panel: '#0A090F',
  surface: '#0F0D16',
  surfaceAlt: '#15121C',
  surfaceHover: '#1B1724',
  elevated: '#0D0B13',
  border: '#241F31',
  borderStrong: '#332C45',
  foreground: '#DDD9E7',
  foregroundStrong: '#F2F0F5',
  foregroundMuted: '#ADACAE',
  foregroundSubtle: '#6D6D6D',
  disabled: '#4D4D4D',
  comment: '#6D6D6D',
  transparent: '#00000000',
}

export const auraInkBase2026: AuraBasePalette = {
  ...auraBase2026,
}

export const auraSemantic2026: AuraSemanticPalette = {
  brand: {
    mint: '#61FFCA',
    lime: '#9DFF65',
    blue: '#82E2FF',
    teal: '#72DCC6',
    lavender: '#D49DFF',
    lavenderBright: '#E0A6FF',
    lavenderMuted: '#B8B4D6',
    pink: '#F694FF',
    pinkSoft: '#C17AC8',
  },
  status: {
    error: '#FF6767',
    errorBright: '#FF6767',
    success: '#61FFCA',
    successBright: '#9DFF65',
    warning: '#FFCA85',
    warningBright: '#FFCA85',
    orange: '#FFCA85',
    orangeBright: '#FFCA85',
    info: '#72DCC6',
    infoBright: '#82E2FF',
  },
}

export const auraDefaultFamily: AuraVariantFamily = {
  name: 'Aura 2026',
  slug: 'aura-2026',
  accent: '#A277FF',
  accentBright: '#C4B5FD',
  accentSoft: '#6F4FD8',
  companion: '#61FFCA',
  companionBright: '#9FFFE2',
  companionSoft: '#3EA784',
}
