import { createAuraPalette } from '../roles'
import { auraLightFamily } from '../source'
import { createTemplateVars } from '../template-vars'

export const light = createTemplateVars(
  createAuraPalette(auraLightFamily, undefined, 'light')
)
