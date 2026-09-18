import { AuraAppearance, AuraPalette } from './types'
import { createAuraPalette } from './create-aura-roles'
import { azureSource, fluentBlue } from '../source/azure'
import { withAlpha } from './utils'

export function createAzurePalette(appearance: AuraAppearance): AuraPalette {
  const light = appearance === 'light'
  const { base, semantic, family } = azureSource(appearance)
  const palette = createAuraPalette(family, base, appearance, semantic)
  const { ui } = palette
  const selected = light ? fluentBlue[160] : fluentBlue[20]
  const action = semantic.action!
  const linkHover = light ? fluentBlue[70] : fluentBlue[140]
  const successSurface = withAlpha(
    semantic.status.success,
    light ? '08' : '0F'
  )
  const errorSurface = withAlpha(semantic.status.error, light ? '08' : '0F')
  return {
    ...palette,
    syntax: { ...palette.syntax, ignored: base.foregroundMuted },
    ui: {
      ...ui,
      interactionForeground: base.foreground,
      focusBorder: family.accent,
      linkHover,
      linkRole: { foreground: family.accent, hoverForeground: linkHover },
      foregroundOverlayLow: base.surfaceHover,
      selectionSolid: selected,
      listSelectionFocus: selected,
      successSurface,
      errorSurface,
      chrome: {
        ...ui.chrome,
        background: base.appBackground,
        tabStripBackground: base.sidebar,
        inactiveTabBackground: base.sidebar,
        activeTabBackground: action.background,
        activeTabForeground: action.foreground,
        activeActivityBackground: selected,
        activeActivityForeground: family.accent,
        unfocusedTabForeground: base.foregroundMuted,
        tabHoverBackground: base.surfaceHover,
        tabHoverBorder: base.transparent,
      },
      editorDecoration: {
        ...ui.editorDecoration,
        lineNumber: base.foregroundSubtle,
        lineHighlight: base.surfaceAlt,
        rangeHighlight: withAlpha(family.accent, '08'),
        inlayHintForeground: base.foregroundMuted,
      },
      action: { ...ui.action, secondaryHoverBackground: base.surfaceHover },
      selectionRole: {
        editor: withAlpha(family.accent, light ? '16' : '20'),
        editorInactive: withAlpha(family.accent, '0D'),
        editorStrong: withAlpha(family.accent, light ? '20' : '24'),
        list: selected,
        listFocus: selected,
        listInactive: selected,
        solid: selected,
      },
      status: {
        ...ui.status,
        modified: family.accent,
        conflict: semantic.status.orangeBright,
        info: semantic.status.info,
        successSurface,
        errorSurface,
        successTextSurface: withAlpha(
          semantic.status.success,
          light ? '0D' : '10'
        ),
        errorTextSurface: withAlpha(
          semantic.status.error,
          light ? '0C' : '12'
        ),
      },
      surfaceRole: {
        ...ui.surfaceRole,
        hoverOverlay: base.surfaceHover,
        toolbarHover: base.surfaceHover,
      },
      highlight: { ...ui.highlight, foreground: family.accent },
    },
  }
}
