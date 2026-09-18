import { createAzurePalette } from '../roles/create-azure-roles'
import { createTemplateVars } from '../template-vars'

export const azureLight = createTemplateVars(createAzurePalette('light'))
export const azureDark = createTemplateVars(createAzurePalette('dark'))
export const azureVariants = [azureLight, azureDark]
