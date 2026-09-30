import { auraAquaEffectColors } from '../source/aqua'
import {
  AuraActionEnhancement,
  AuraBadgeEmphasis,
  AuraUiPalette,
} from './types'
import { withAlpha } from './utils'

// Action and badge effects share primitives, not each other's resolved roles.
export function createAquaActionEnhancement(
  action: Pick<AuraUiPalette['action'], 'background' | 'hoverBackground'>,
  colors = auraAquaEffectColors
): AuraActionEnhancement {
  const fill = (center: string, start: number, end: number) => ({
    angle: 105,
    stops: [
      { color: colors.mint, position: 0 },
      { color: center, position: start },
      { color: center, position: end },
      { color: colors.mint, position: 100 },
    ],
  })
  return {
    normal: {
      fill: fill(action.background, 46, 58),
      edge: colors.white,
      shine: withAlpha(colors.white, '70'),
      shadow: withAlpha(colors.shadowInk, '18'),
    },
    hover: {
      fill: fill(action.hoverBackground, 26, 74),
      shadow: withAlpha(colors.shadowInk, '26'),
    },
    focus: { glow: withAlpha(colors.mint, '60') },
  }
}

export function createAquaBadgeEmphasis(
  colors = auraAquaEffectColors
): AuraBadgeEmphasis {
  return {
    fill: {
      angle: 180,
      stops: [
        { color: colors.markerCyan, position: 0 },
        { color: colors.mint, position: 52 },
        { color: colors.markerGreen, position: 100 },
      ],
    },
    edge: withAlpha(colors.white, 'ED'),
    glow: withAlpha(colors.markerCyan, '66'),
    labelShadow: withAlpha(colors.labelShadowInk, '59'),
  }
}
