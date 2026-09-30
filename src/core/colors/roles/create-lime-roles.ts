import { AuraAppearance, AuraPalette } from './types'
import { createAquaPalette } from './create-aqua-roles'
import { auraAquaColors } from '../source/aqua'
import {
  auraLimeColors,
  auraLimeLightBase,
  auraLimeDarkBase,
  auraLimeLightFamily,
  auraLimeDarkFamily,
  auraLimeLightSemantic,
  auraLimeDarkSemantic,
} from '../source/lime'

export function createLimePalette(appearance: AuraAppearance): AuraPalette {
  const isLight = appearance === 'light'
  const colors = auraLimeColors[appearance]
  return createAquaPalette(appearance, {
    enhancements: false,
    base: isLight ? auraLimeLightBase : auraLimeDarkBase,
    family: isLight ? auraLimeLightFamily : auraLimeDarkFamily,
    semantic: isLight ? auraLimeLightSemantic : auraLimeDarkSemantic,
    tabs: isLight ? auraLimeColors.light.tabs : auraLimeDarkBase.background,
    titleBorder: isLight ? auraLimeColors.light.titleBorder : undefined,
    activeBorder: auraAquaColors.lime,
    activityAccent: auraLimeColors.mint,
    activityHoverBackground: isLight
      ? auraLimeColors.light.hover
      : undefined,
    selection: colors.selection,
    inactiveSelection: isLight
      ? colors.selection
      : auraLimeColors.dark.selectionInactive,
    focusBorder: colors.focus,
  })
}
