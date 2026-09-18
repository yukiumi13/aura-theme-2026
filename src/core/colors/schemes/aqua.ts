import { createAquaPalette } from '../roles/create-aqua-roles'
import { createTemplateVars } from '../template-vars'

export const aquaLight = createTemplateVars(createAquaPalette('light'))
export const aquaDark = createTemplateVars(createAquaPalette('dark'))

// Kept separate from the legacy dark-only accent families.
export const aquaVariants = [aquaLight, aquaDark]
