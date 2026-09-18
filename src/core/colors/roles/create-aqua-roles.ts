import { AuraAppearance, AuraPalette } from './types'
import { createAuraPalette } from './create-aura-roles'
import { createAuraSyntax } from './create-aura-syntax'
import { withAlpha } from './utils'
import { auraDefaultFamily } from '../source/aura'
import {
  auraAquaColors,
  auraAquaSyntaxAccents,
  auraAquaLightBase,
  auraAquaDarkBase,
  auraAquaLightFamily,
  auraAquaDarkFamily,
  auraAquaLightSemantic,
  auraAquaDarkSemantic,
} from '../source/aqua'

export function createAquaPalette(appearance: AuraAppearance): AuraPalette {
  const isLight = appearance === 'light'
  const auraDark = isLight ? undefined : createAuraPalette(auraDefaultFamily)
  const colors = isLight ? auraAquaColors.light : auraAquaColors.dark
  const palette = createAuraPalette(
    isLight ? auraAquaLightFamily : auraAquaDarkFamily,
    isLight ? auraAquaLightBase : auraAquaDarkBase,
    appearance,
    isLight ? auraAquaLightSemantic : auraAquaDarkSemantic
  )
  const { base, ui, family, semantic } = palette
  const syntaxAccents = auraAquaSyntaxAccents[appearance]
  const infoSurface = withAlpha(semantic.status.info, '1F')
  const successSurface = isLight
    ? ui.successSurface
    : withAlpha(semantic.status.success, '0F')
  const errorSurface = isLight
    ? ui.errorSurface
    : withAlpha(semantic.status.error, '0F')

  // Both appearances use neutral interaction text and understated chrome.
  // Keep the compatibility aliases consistent with the structured roles.
  return {
    ...palette,
    // Aqua identifies UI interactions; syntax and terminal colors stay Aura.
    ansi: auraDark?.ansi ?? palette.ansi,
    terminal: auraDark?.terminal ?? palette.terminal,
    syntax: {
      ...createAuraSyntax(base, semantic, syntaxAccents, appearance),
      ignored: base.foregroundMuted,
    },
    ui: {
      ...ui,
      accent: auraAquaColors.aqua,
      interactionForeground: base.foreground,
      onError: isLight ? base.elevated : base.background,
      listSelectionFocus: isLight ? ui.listSelectionFocus : colors.selection,
      foregroundOverlayLow: base.surfaceHover,
      linkHover: family.accentBright,
      selectionSolid: colors.selection,
      successSurface,
      errorSurface,
      infoSurface,
      modified: auraDark?.ui.modified ?? ui.modified,
      chrome: {
        ...ui.chrome,
        background: isLight ? base.appBackground : ui.chrome.background,
        activeTabBackground: auraAquaColors.aqua,
        activeTabForeground: isLight
          ? auraAquaColors.onAquaLight
          : auraAquaColors.onAquaDark,
        activeActivityBackground: auraAquaColors.aqua,
        activeActivityForeground: isLight
          ? auraAquaColors.onAquaLight
          : auraAquaColors.onAquaDark,
        tabStripBackground: colors.tabs,
        inactiveTabBackground: isLight
          ? colors.tabs
          : ui.chrome.inactiveTabBackground,
        unfocusedTabForeground: base.foregroundMuted,
        tabHoverBackground: base.surfaceHover,
        tabHoverBorder: base.transparent,
      },
      editorDecoration: {
        ...ui.editorDecoration,
        lineNumber: isLight
          ? base.foregroundSubtle
          : ui.editorDecoration.lineNumber,
        lineHighlight: isLight
          ? base.surfaceAlt
          : ui.editorDecoration.lineHighlight,
        inlayHintForeground: base.foregroundMuted,
      },
      action: {
        ...ui.action,
        secondaryHoverBackground: base.surfaceHover,
      },
      remote: { ...ui.remote, compactHoverBackground: base.surfaceHover },
      linkRole: { ...ui.linkRole, hoverForeground: family.accentBright },
      highlight: { ...ui.highlight, foreground: family.accent },
      selectionRole: {
        ...ui.selectionRole,
        solid: colors.selection,
        listFocus: isLight ? ui.listSelectionFocus : colors.selection,
        listInactive: isLight
          ? colors.selection
          : auraAquaColors.dark.selectionInactive,
      },
      status: {
        ...ui.status,
        modified: auraDark?.ui.status.modified ?? ui.status.modified,
        info: semantic.status.info,
        infoSurface,
        conflict: semantic.status.orangeBright,
        successSurface,
        errorSurface,
        successTextSurface: isLight
          ? ui.status.successTextSurface
          : withAlpha(semantic.status.success, '12'),
        errorTextSurface: isLight
          ? ui.status.errorTextSurface
          : withAlpha(semantic.status.error, '12'),
      },
      surfaceRole: {
        ...ui.surfaceRole,
        hoverOverlay: base.surfaceHover,
        toolbarHover: base.surfaceHover,
      },
    },
  }
}
