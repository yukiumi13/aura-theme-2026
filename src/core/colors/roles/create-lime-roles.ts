import { AuraAppearance, AuraPalette } from './types'
import { createAquaPalette } from './create-aqua-roles'
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
    base: isLight ? auraLimeLightBase : auraLimeDarkBase,
    family: isLight ? auraLimeLightFamily : auraLimeDarkFamily,
    semantic: isLight ? auraLimeLightSemantic : auraLimeDarkSemantic,
    tabs: isLight ? auraLimeColors.light.tabs : auraLimeDarkBase.background,
    titleBorder: isLight ? auraLimeColors.light.titleBorder : undefined,
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
