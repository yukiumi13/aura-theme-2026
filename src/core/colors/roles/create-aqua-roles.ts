import {
  AuraAppearance,
  AuraBasePalette,
  AuraPalette,
  AuraSemanticPalette,
  AuraVariantFamily,
} from './types'
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

// Lime shares Aqua's interaction layout and syntax. Resolve its source inputs
// before deriving roles, so nested surfaces and terminal colors stay coherent.
interface AquaPaletteOptions {
  base?: AuraBasePalette
  family?: AuraVariantFamily
  semantic?: AuraSemanticPalette
  tabs?: string
  titleBorder?: string
  activityAccent?: string
  activityHoverBackground?: string
  selection?: string
  inactiveSelection?: string
  focusBorder?: string
}

export function createAquaPalette(
  appearance: AuraAppearance,
  options: AquaPaletteOptions = {}
): AuraPalette {
  const isLight = appearance === 'light'
  const auraDark = isLight ? undefined : createAuraPalette(auraDefaultFamily)
  const colors = isLight ? auraAquaColors.light : auraAquaColors.dark
  const palette = createAuraPalette(
    options.family ?? (isLight ? auraAquaLightFamily : auraAquaDarkFamily),
    options.base ?? (isLight ? auraAquaLightBase : auraAquaDarkBase),
    appearance,
    options.semantic ??
      (isLight ? auraAquaLightSemantic : auraAquaDarkSemantic)
  )
  const { base, ui, family, semantic } = palette
  const selection = options.selection ?? colors.selection
  const listFocus =
    options.selection ?? (isLight ? ui.listSelectionFocus : selection)
  const tabs = options.tabs ?? colors.tabs
  const activityAccent = options.activityAccent ?? auraAquaColors.aqua
  const syntaxAccents = auraAquaSyntaxAccents[appearance]
  const infoSurface = withAlpha(semantic.status.info, '1F')
  const successSurface = isLight
    ? ui.successSurface
    : withAlpha(semantic.status.success, '0F')
  const errorSurface = isLight
    ? ui.errorSurface
    : withAlpha(semantic.status.error, '0F')

  // Badges have their own accent instead of inheriting every action's fill.
  // Preserve Aura Dark's reading surfaces, syntax, and terminal foundation.
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
      focusBorder: options.focusBorder ?? ui.focusBorder,
      interactionForeground: base.foreground,
      onError: isLight ? base.elevated : base.background,
      listSelectionFocus: listFocus,
      foregroundOverlayLow: base.surfaceHover,
      linkHover: family.accentBright,
      selectionSolid: selection,
      successSurface,
      errorSurface,
      infoSurface,
      modified: auraDark?.ui.modified ?? ui.modified,
      badge: { ...ui.badge, background: auraAquaColors.mint },
      chrome: {
        ...ui.chrome,
        background: isLight ? base.appBackground : ui.chrome.background,
        titleBorder:
          options.titleBorder ??
          (isLight
            ? auraAquaColors.light.titleBorder
            : ui.chrome.titleBorder),
        activeBorder: auraAquaColors.lime,
        activeTabBackground: auraAquaColors.aqua,
        activeTabForeground: isLight
          ? auraAquaColors.onAquaLight
          : auraAquaColors.onAquaDark,
        // VS Code reuses the active icon foreground for unchecked hover/focus.
        // It must work on both the bare rail and the selected item's surface.
        activeActivityBackground: isLight ? activityAccent : selection,
        activeActivityForeground: isLight
          ? base.foregroundStrong
          : activityAccent,
        // Modern UI separates unchecked hover from selection. Keep keyboard
        // focus readable through the classic foreground on the unfilled rail.
        modernActivity: {
          // VS Code 1.138's later classic active-background rule can override
          // the Modern UI fill; both paths must share the selected surface.
          activeBackground: isLight ? activityAccent : selection,
          activeForeground: isLight
            ? auraAquaColors.onAquaLight
            : activityAccent,
          hoverBackground:
            options.activityHoverBackground ??
            (isLight
              ? auraAquaColors.light.activityHover
              : base.surfaceHover),
          hoverForeground: isLight ? base.foregroundStrong : activityAccent,
        },
        tabStripBackground: tabs,
        inactiveTabBackground: isLight
          ? tabs
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
        solid: selection,
        listFocus,
        listInactive:
          options.inactiveSelection ??
          (isLight ? selection : auraAquaColors.dark.selectionInactive),
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
