import { auraBase2026, auraSemantic2026 } from './base'
import { AuraBasePalette, AuraPalette, AuraVariantFamily } from './types'
import { withAlpha } from './utils'

export function createAuraPalette(
  family: AuraVariantFamily,
  baseOverride?: AuraBasePalette
): AuraPalette {
  const base = baseOverride ?? auraBase2026
  const semantic = auraSemantic2026
  const { brand, status } = semantic
  const accent = family.accent
  const accentBright = family.accentBright
  const accentSoft = family.accentSoft
  const companion = family.companion
  const companionBright = family.companionBright
  const companionSoft = family.companionSoft
  const focusBorder = withAlpha(accent, 'B3')
  const selection = withAlpha(accentSoft, 'DD')
  const selectionSoft = withAlpha(accentSoft, '60')
  const selectionStrong = withAlpha(accentSoft, '90')
  const listSelection = withAlpha(accentSoft, '2E')
  const listSelectionFocus = withAlpha(accentSoft, '44')
  const successSurface = withAlpha(status.success, '1F')
  const warningSurface = withAlpha(status.warning, '24')
  const errorSurface = withAlpha(status.error, '24')
  const infoSurface = withAlpha(accent, '1F')
  const subtleAccentSurface = withAlpha(accentSoft, '1A')
  const mediumAccentSurface = withAlpha(accentSoft, '26')
  const strongAccentSurface = withAlpha(accentSoft, '4D')
  const foregroundOverlayLow = withAlpha(base.surfaceHover, 'CC')
  const foregroundOverlayHigh = withAlpha(base.borderStrong, '99')

  return {
    name: family.name,
    slug: family.slug,
    base,
    semantic,
    family,
    ui: {
      accent,
      accentBright,
      accentSoft,
      companion,
      companionBright,
      companionSoft,
      action: {
        background: accentSoft,
        foreground: base.background,
        hoverBackground: brand.mint,
        hoverForeground: base.background,
        secondaryHoverBackground: foregroundOverlayLow,
      },
      linkRole: {
        foreground: accent,
        hoverForeground: brand.mint,
      },
      remote: {
        background: accent,
        foreground: base.background,
        hoverBackground: brand.mint,
        hoverForeground: base.background,
      },
      selectionRole: {
        editor: selectionStrong,
        editorInactive: selectionSoft,
        editorStrong: selection,
        list: listSelection,
        listFocus: listSelectionFocus,
        solid: accentSoft,
      },
      status: {
        modified: accentBright,
        successSurface,
        warning: status.warningBright,
        warningSurface,
        errorSurface,
        infoSurface,
      },
      surfaceRole: {
        elevated: base.elevated,
        panel: base.surface,
        hover: base.surfaceHover,
        hoverOverlay: foregroundOverlayLow,
        strongOverlay: foregroundOverlayHigh,
        tile: base.surface,
        tileHover: base.surfaceHover,
      },
      welcome: {
        background: base.background,
        tileBackground: base.surface,
        tileHoverBackground: base.surfaceHover,
        tileBorder: base.border,
        stepTitleForeground: accent,
      },
      highlight: {
        base: brand.mint,
        bright: companionBright,
        hover: companionSoft,
        foreground: brand.mint,
      },
      focusBorder,
      selection,
      selectionSoft,
      selectionStrong,
      selectionSolid: accentSoft,
      listSelection,
      listSelectionFocus,
      warning: status.warningBright,
      modified: accentBright,
      actionHover: brand.mint,
      lineHighlight: base.surfaceAlt,
      link: accent,
      linkHover: brand.mint,
      button: accentSoft,
      buttonHover: accent,
      successSurface,
      warningSurface,
      errorSurface,
      infoSurface,
      subtleAccentSurface,
      mediumAccentSurface,
      strongAccentSurface,
      foregroundOverlayLow,
      foregroundOverlayHigh,
      scrollbar: withAlpha(base.foregroundSubtle, '33'),
      scrollbarHover: withAlpha(base.foregroundSubtle, '66'),
      scrollbarActive: withAlpha(base.foregroundSubtle, '99'),
      debugBackground: '#A19C77',
      breakpointBackground: '#353424',
    },
    ansi: {
      black: base.appBackground,
      red: status.error,
      green: status.success,
      yellow: status.warning,
      blue: accent,
      magenta: companion,
      cyan: accent,
      white: base.foreground,
      brightBlack: base.foregroundSubtle,
      brightRed: status.errorBright,
      brightGreen: brand.mint,
      brightYellow: status.warningBright,
      brightBlue: accentBright,
      brightMagenta: companionBright,
      brightCyan: accentBright,
      brightWhite: base.foregroundStrong,
      dimBlack: base.disabled,
      dimRed: status.error,
      dimGreen: status.success,
      dimYellow: status.orange,
      dimBlue: accentSoft,
      dimMagenta: companionSoft,
      dimCyan: accentSoft,
      dimWhite: base.foregroundMuted,
    },
    syntax: {
      attribute: accent,
      boolean: accent,
      class: accent,
      comment: base.comment,
      commentDoc: base.foregroundMuted,
      constant: accent,
      constructor: accent,
      decorator: accent,
      embedded: base.foreground,
      enum: accent,
      enumMember: accent,
      function: accentBright,
      functionSpecial: status.orangeBright,
      keyword: accentBright,
      label: companionBright,
      link: accent,
      macro: accent,
      namespace: status.infoBright,
      number: status.orange,
      operator: accentBright,
      parameter: companionBright,
      property: accent,
      punctuation: base.foreground,
      punctuationMuted: base.foregroundMuted,
      regexp: status.warningBright,
      selector: brand.mint,
      string: brand.mint,
      stringEscape: status.warningBright,
      stringSpecial: status.warningBright,
      tag: brand.mint,
      title: accentBright,
      type: accent,
      variable: base.foreground,
      variableSpecial: accent,
    },
  }
}
