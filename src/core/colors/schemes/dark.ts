import { colorsService, functionCompositionService } from 'services'

import {
  auraDefaultFamily,
  compileLegacyScheme,
  createAuraPalette,
  inkVariantScheme,
  inkVariantSchemes,
  variantSchemes,
} from '../palettes'

const { shade, desaturate } = colorsService()
const { compose } = functionCompositionService()
const shadeAndDesaturate = compose(shade(0.2), desaturate(0.1))

const defaultPalette = createAuraPalette(auraDefaultFamily)

export const dark = compileLegacyScheme(defaultPalette)

export const variants = variantSchemes

export const inkVariants = inkVariantSchemes

export const inkVariant = inkVariantScheme

export const darkSoft = {
  ...dark,
  accent1: shadeAndDesaturate(dark.accent1),
  accent2: shadeAndDesaturate(dark.accent2),
  accent3: shadeAndDesaturate(dark.accent3),
  accent4: shadeAndDesaturate(dark.accent4),
  accent5: shadeAndDesaturate(dark.accent5),
  accent6: shadeAndDesaturate(dark.accent6),
  accent7: shadeAndDesaturate(dark.accent7),
  accent31: shadeAndDesaturate(dark.accent31),
  accent32: shadeAndDesaturate(dark.accent32),
  accent57: shadeAndDesaturate(dark.accent57),
  accent58: shadeAndDesaturate(dark.accent58),
  accent59: shadeAndDesaturate(dark.accent59),
  accent60: shadeAndDesaturate(dark.accent60),
  accent61: shadeAndDesaturate(dark.accent61),
}
