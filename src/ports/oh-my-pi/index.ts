import { resolve } from 'path'
import { AuraAPI } from 'core'
import { composite } from 'core/colors/roles/utils'
import { modernThemes } from '../shared/modern-themes'

export async function OhMyPiPort(Aura: AuraAPI) {
  await Aura.copyExtraFiles(__dirname)
  for (const { name, appearance, scheme } of modernThemes(
    Aura.colorSchemes
  )) {
    const id = name.toLowerCase().replace(/ /g, '-')
    await Aura.createPort({
      template: resolve(__dirname, 'templates/theme.json'),
      outputDist: resolve(
        Aura.constants.folders.distFolder,
        'oh-my-pi/themes'
      ),
      outputFileName: id,
      replacements: {
        ...scheme,
        id,
        messageBg:
          scheme.uiInputBackground === scheme.baseBackground
            ? scheme.baseSurface
            : scheme.uiInputBackground,
        selectedBg: composite(
          scheme.uiListSelectionInactiveBackground,
          scheme.baseBackground
        ),
        errorBg: composite(
          scheme.uiStatusErrorSurface,
          scheme.baseBackground
        ),
        // The accent also paints small labels on the selected band.
        labelAccent:
          appearance === 'light'
            ? scheme.uiLinkHoverForeground
            : scheme.uiLinkForeground,
      },
    })
  }
}
