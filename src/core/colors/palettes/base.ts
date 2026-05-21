import {
  AuraBasePalette,
  AuraSemanticPalette,
  AuraVariantFamily,
} from './types'

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
    pink: '#F694FF',
    pinkSoft: '#C17AC8',
  },
  status: {
    error: '#F87171',
    errorBright: '#FCA5A5',
    success: '#34D399',
    successBright: '#6EE7B7',
    warning: '#F6B86A',
    warningBright: '#FFCA85',
    orange: '#F59E0B',
    orangeBright: '#FFCA85',
    info: '#48A0C7',
    infoBright: '#67E8F9',
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
