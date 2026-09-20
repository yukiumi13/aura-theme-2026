import { createLimePalette } from '../roles/create-lime-roles'
import { createTemplateVars } from '../template-vars/create-template-vars'

export const limeLight = createTemplateVars(createLimePalette('light'))
export const limeDark = createTemplateVars(createLimePalette('dark'))
export const limeVariants = [limeLight, limeDark]
