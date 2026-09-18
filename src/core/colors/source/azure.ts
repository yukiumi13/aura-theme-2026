import {
  AuraAppearance,
  AuraBasePalette,
  AuraSemanticPalette,
  AuraVariantFamily,
} from '../roles/types'
import { auraMint } from './aura'

// Fluent UI web brand ramp and shared colors (Microsoft, MIT).
// Provenance, exact token mappings, and adaptation decisions: docs/AZURE_DESIGN.md.
export const fluentBlue = {
  20: '#082338',
  40: '#0C3B5E',
  60: '#0F548C',
  70: '#115EA3',
  80: '#0F6CBD',
  100: '#479EF5',
  110: '#62ABF5',
  120: '#77B7F7',
  140: '#B4D6FA',
  150: '#CFE4FA',
  160: '#EBF3FC',
}

export function azureSource(appearance: AuraAppearance): {
  base: AuraBasePalette
  semantic: AuraSemanticPalette
  family: AuraVariantFamily
} {
  const light = appearance === 'light'
  const base: AuraBasePalette = light
    ? {
        shadow: '#00000014',
        background: '#FAFAFA',
        appBackground: '#F0F0F0',
        sidebar: '#F5F5F5',
        panel: '#F5F5F5',
        surface: '#F0F0F0',
        surfaceAlt: '#F5F5F5',
        surfaceHover: '#EBEBEB',
        elevated: '#FFFFFF',
        border: '#E0E0E0',
        borderStrong: '#BDBDBD',
        foreground: '#424242',
        foregroundStrong: '#292929',
        foregroundMuted: '#616161',
        foregroundSubtle: '#757575',
        disabled: '#B3B3B3',
        comment: '#757575',
        transparent: '#00000000',
      }
    : {
        shadow: '#00000040',
        background: '#1F1F1F',
        appBackground: '#141414',
        sidebar: '#141414',
        panel: '#141414',
        surface: '#292929',
        surfaceAlt: '#242424',
        surfaceHover: '#333333',
        elevated: '#292929',
        border: '#333333',
        borderStrong: '#525252',
        foreground: '#D6D6D6',
        foregroundStrong: '#F0F0F0',
        foregroundMuted: '#B3B3B3',
        foregroundSubtle: '#999999',
        disabled: '#666666',
        comment: '#9E9E9E',
        transparent: '#00000000',
      }
  const semantic: AuraSemanticPalette = {
    interaction: { accent: light ? fluentBlue[70] : fluentBlue[120] },
    action: {
      background: light ? fluentBlue[80] : fluentBlue[70],
      foreground: '#FFFFFF',
      hoverBackground: light ? fluentBlue[70] : fluentBlue[80],
      border: '#00000000',
    },
    brand: {
      mint: auraMint,
      mintText: light ? '#00723B' : '#5AE0A0',
      mintHover: light ? '#00723B' : '#A8F0CD',
      onMint: '#003D20',
      lime: light ? '#0E7A0B' : '#A7E3A5',
      blue: light ? fluentBlue[70] : fluentBlue[120],
      teal: light ? '#037679' : '#9BD9DB',
      lavender: light ? '#7C52AB' : '#C6B1DE',
      lavenderBright: light ? '#6B3F9E' : '#E0D3ED',
      lavenderMuted: light ? '#616161' : '#B3B3B3',
      pink: light ? '#AD2D7E' : '#EF85C8',
      pinkSoft: light ? '#80215D' : '#F7C0E3',
    },
    status: {
      error: light ? '#BC2F32' : '#E37D80',
      errorBright: light ? '#9F282B' : '#F1BBBC',
      success: light ? '#00723B' : '#5AE0A0',
      successBright: light ? '#00723B' : '#A8F0CD',
      warning: light ? '#835B00' : '#FFBA66',
      warningBright: light ? '#835B00' : '#FFDDB3',
      orange: light ? '#963A08' : '#FFBA66',
      orangeBright: light ? '#7F3107' : '#FFDDB3',
      info: light ? fluentBlue[80] : fluentBlue[110],
      infoBright: light ? fluentBlue[70] : fluentBlue[140],
    },
  }
  const family: AuraVariantFamily = {
    name: `Aura 2026 Azure ${light ? 'Light' : 'Dark'}`,
    slug: light ? 'aura-azure-light-2026' : 'aura-azure-2026',
    accent: light ? fluentBlue[80] : fluentBlue[110],
    accentBright: light ? '#6656D1' : '#A79CF1',
    accentSoft: light ? fluentBlue[80] : fluentBlue[40],
    companion: semantic.brand.mintText,
    companionBright: semantic.status.successBright,
    companionSoft: light ? '#00723B' : '#5AE0A0',
  }
  return { base, semantic, family }
}
