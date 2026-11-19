import { auraAquaLightBase } from './aqua'

// Accepted Aqua Sample C: 2/3 OKLab interpolation from the published syntax
// toward the supplied summer reference. These are adapted text colors, not
// direct screenshot samples. See docs/reviews/2026-09-20-aqua-sampled/study.json.
export const aquaLimeLightSyntaxSource = {
  aqua: '#35BDCC',
  mint: '#47C491',
  lime: '#A9CD6E',
  yellow: '#DCB547',
}

// One quiet frame surrounds the white editor, including the empty secondary sidebar.
const chrome = '#FBFBFB'
export const aquaLimeFrameBorder = '#E5E5E5'
export const aquaLimeLightBase = {
  ...auraAquaLightBase,
  background: auraAquaLightBase.elevated,
  appBackground: chrome,
  sidebar: chrome,
  panel: chrome,
  surface: '#F0F0F0',
  surfaceAlt: '#F8F8F8',
  surfaceHover: '#E9E9E9',
  border: '#DFDFDF',
  borderStrong: '#BFC2C4',
}

export const aquaLimeLightInput = '#F4F4F4'
export const aquaLimeInactiveSelection = '#E9F3F4'
