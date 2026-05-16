import {
  AuraBasePalette,
  AuraSemanticPalette,
  AuraVariantFamily,
} from './types'

export const auraBase2026: AuraBasePalette = {
  shadow: '#000000',
  background: '#09080D',
  appBackground: '#0D0B13',
  sidebar: '#0B0A10',
  panel: '#0D0B13',
  surface: '#121019',
  surfaceAlt: '#1A1722',
  surfaceHover: '#211D2B',
  elevated: '#100E17',
  border: '#2E2940',
  borderStrong: '#443D5F',
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
  red: '#F87171',
  redBright: '#FCA5A5',
  green: '#34D399',
  greenBright: '#6EE7B7',
  yellow: '#FBBF24',
  yellowBright: '#FCD34D',
  orange: '#F59E0B',
  orangeBright: '#FCD34D',
  info: '#48A0C7',
  infoBright: '#67E8F9',
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
