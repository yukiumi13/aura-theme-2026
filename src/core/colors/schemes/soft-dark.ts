import { colorsService, functionCompositionService } from 'services'

import { LegacyAuraScheme } from '../palettes'
import { dark } from './dark'

const { shade, desaturate } = colorsService()
const { compose } = functionCompositionService()
const shadeAndDesaturate = compose(shade(0.2), desaturate(0.1))

export const softDark: LegacyAuraScheme = {
  ...dark,
  accent11: '#050507',
  accent12: '#0D0B13',
  accent13: '#3A344F',
  accent21: '#121019',
  accent24: '#100E17',
}

export const softDarkSoft = {
  ...softDark,
  accent1: shadeAndDesaturate(softDark.accent1),
  accent2: shadeAndDesaturate(softDark.accent2),
  accent3: shadeAndDesaturate(softDark.accent3),
  accent4: shadeAndDesaturate(softDark.accent4),
  accent5: shadeAndDesaturate(softDark.accent5),
  accent6: shadeAndDesaturate(softDark.accent6),
  accent7: shadeAndDesaturate(softDark.accent7),
  accent31: shadeAndDesaturate(softDark.accent31),
  accent32: shadeAndDesaturate(softDark.accent32),
  accent57: shadeAndDesaturate(softDark.accent57),
  accent58: shadeAndDesaturate(softDark.accent58),
  accent59: shadeAndDesaturate(softDark.accent59),
  accent60: shadeAndDesaturate(softDark.accent60),
  accent61: shadeAndDesaturate(softDark.accent61),
}
