import { auraBase2026, auraSemantic2026 } from '../source/aura'
import {
  auraLightBase2026,
  auraLightColors,
  auraLightSemantic2026,
} from '../source/light'
import {
  AuraAppearance,
  AuraBasePalette,
  AuraPalette,
  AuraVariantFamily,
} from './types'
import { withAlpha } from './utils'

export function createAuraPalette(
  family: AuraVariantFamily,
  baseOverride?: AuraBasePalette,
  appearance: AuraAppearance = 'dark'
): AuraPalette {
  const isLight = appearance === 'light'
  const base = baseOverride ?? (isLight ? auraLightBase2026 : auraBase2026)
  const semantic = isLight ? auraLightSemantic2026 : auraSemantic2026
  const { brand, status } = semantic
  const accent = family.accent
  const accentBright = family.accentBright
  const accentSoft = family.accentSoft
  const companion = family.companion
  const companionBright = family.companionBright
  const companionSoft = family.companionSoft
  const pink = brand.pink
  const pinkMuted = brand.pinkSoft
  const focusBorder = isLight ? accent : withAlpha(accent, 'B3')
  // Light selections need much less pigment so syntax stays readable beneath.
  const selection = withAlpha(accentSoft, isLight ? '18' : 'DD')
  const selectionSoft = withAlpha(accentSoft, isLight ? '0D' : '60')
  const selectionStrong = withAlpha(accentSoft, isLight ? '16' : '90')
  const listSelection = withAlpha(accentSoft, isLight ? '12' : '2E')
  const listSelectionFocus = withAlpha(accentSoft, isLight ? '1C' : '44')
  const selectionSolid = isLight ? auraLightColors.selection : accentSoft
  const actionBackground = isLight ? brand.mint : accentSoft
  const actionForeground = isLight ? brand.onMint : base.background
  const onAccent = isLight ? base.elevated : base.background
  const successSurface = withAlpha(status.success, isLight ? '08' : '1F')
  const warningSurface = withAlpha(status.warning, '24')
  const errorSurface = withAlpha(status.error, isLight ? '08' : '24')
  const infoSurface = withAlpha(accent, '1F')
  const subtleAccentSurface = withAlpha(accentSoft, '1A')
  const mediumAccentSurface = withAlpha(accentSoft, '26')
  const strongAccentSurface = withAlpha(accentSoft, '4D')
  const foregroundOverlayLow = isLight
    ? base.surfaceHover
    : withAlpha(base.surfaceHover, 'CC')
  const foregroundOverlayHigh = withAlpha(base.borderStrong, '99')

  return {
    appearance,
    name: family.name,
    slug: family.slug,
    base,
    semantic,
    family,
    ui: {
      chrome: {
        background: isLight ? base.appBackground : base.background,
        border: isLight ? base.border : base.shadow,
        titleBorder: isLight ? base.border : base.shadow,
        tabStripBackground: isLight ? auraLightColors.tabs : base.background,
        inactiveTabBackground: isLight ? auraLightColors.tabs : base.sidebar,
        unfocusedTabForeground: isLight
          ? base.foregroundMuted
          : base.disabled,
        tabHoverBackground: isLight ? base.surfaceHover : base.surface,
        tabHoverBorder: isLight ? base.transparent : base.border,
        sectionHeaderBackground: isLight ? base.sidebar : base.background,
      },
      editorDecoration: {
        lineNumber: isLight
          ? base.foregroundSubtle
          : withAlpha(base.foregroundSubtle, '33'),
        lineHighlight: isLight
          ? base.surfaceAlt
          : withAlpha(base.foregroundSubtle, '33'),
        whitespace: isLight ? base.borderStrong : base.disabled,
        treeGuide: isLight ? base.borderStrong : base.disabled,
        indentGuide: isLight ? base.border : base.disabled,
        activeIndentGuide: isLight
          ? base.borderStrong
          : base.foregroundSubtle,
        rangeHighlight: isLight ? withAlpha(accentSoft, '0D') : '#24222c88',
        inlayHintForeground: isLight
          ? base.foregroundMuted
          : base.foreground,
      },
      chartGrid: isLight ? withAlpha(base.borderStrong, '80') : '#3b334b80',
      onAccent,
      onError: isLight ? base.elevated : base.foregroundStrong,
      onDebug: isLight ? base.foregroundStrong : base.background,
      interactionForeground: isLight ? base.foreground : brand.mint,
      accent,
      accentBright,
      accentSoft,
      companion,
      companionBright,
      companionSoft,
      badge: {
        background: isLight ? brand.mint : accent,
        foreground: isLight ? brand.onMint : base.background,
      },
      action: {
        background: actionBackground,
        prominentBackground: isLight ? brand.mint : accent,
        border: isLight ? base.transparent : base.border,
        foreground: actionForeground,
        hoverBackground: brand.mintHover,
        hoverForeground: actionForeground,
        secondaryHoverBackground: foregroundOverlayLow,
      },
      linkRole: {
        foreground: accent,
        hoverForeground: isLight ? accentBright : brand.mintText,
      },
      remote: {
        background: isLight ? actionBackground : accent,
        foreground: actionForeground,
        hoverBackground: brand.mintHover,
        hoverForeground: actionForeground,
        compactHoverBackground: isLight ? base.surfaceHover : brand.mint,
      },
      selectionRole: {
        editor: selectionStrong,
        editorInactive: selectionSoft,
        editorStrong: selection,
        list: listSelection,
        listFocus: listSelectionFocus,
        listInactive: isLight ? selectionSolid : base.surfaceAlt,
        solid: selectionSolid,
      },
      status: {
        modified: accentBright,
        conflict: isLight ? status.orangeBright : accentBright,
        success: status.success,
        successBright: status.successBright,
        successSurface,
        successTextSurface: withAlpha(status.success, isLight ? '0D' : '23'),
        errorTextSurface: withAlpha(status.error, isLight ? '0C' : '20'),
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
        toolbarHover: isLight ? base.surfaceHover : foregroundOverlayHigh,
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
        foreground: isLight ? accent : brand.mint,
      },
      focusBorder,
      selection,
      selectionSoft,
      selectionStrong,
      selectionSolid,
      listSelection,
      listSelectionFocus,
      warning: status.warningBright,
      modified: accentBright,
      actionHover: brand.mintHover,
      lineHighlight: base.surfaceAlt,
      link: accent,
      linkHover: isLight ? accentBright : brand.mintText,
      button: actionBackground,
      buttonHover: isLight ? brand.mintHover : accent,
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
      debugBackground: isLight ? auraLightColors.debug : '#A19C77',
      breakpointBackground: isLight ? auraLightColors.breakpoint : '#353424',
    },
    ansi: {
      black: isLight ? base.foregroundStrong : base.appBackground,
      red: status.error,
      green: status.success,
      yellow: status.warning,
      blue: accent,
      magenta: companion,
      cyan: accent,
      white: isLight ? base.foregroundMuted : base.foreground,
      brightBlack: base.foregroundSubtle,
      brightRed: status.errorBright,
      brightGreen: brand.mintText,
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
    terminal: {
      background: base.appBackground,
      foreground: base.foreground,
      foregroundBright: base.foregroundStrong,
      muted: base.foregroundSubtle,
      red: status.error,
      redBright: status.errorBright,
      yellow: status.warning,
      yellowBright: status.warningBright,
      green: brand.mintText,
      greenDim: status.success,
      greenBright: brand.lime,
      mintBright: brand.mintText,
      purple: accent,
      purpleSoft: accentSoft,
      purpleBright: accentBright,
      pink: pinkMuted,
      pinkBright: pink,
      companionSoft,
      info: brand.teal,
      infoBright: brand.blue,
    },
    syntax: {
      attribute: accent,
      boolean: accent,
      class: accent,
      comment: base.comment,
      commentDoc: brand.lavenderMuted,
      constant: accent,
      constructor: accent,
      decorator: pink,
      embedded: base.foreground,
      ignored: isLight ? base.foregroundMuted : base.background,
      enum: accent,
      enumMember: accent,
      function: brand.lavender,
      functionDeclaration: brand.lavenderBright,
      functionSpecial: status.orangeBright,
      keyword: accentBright,
      label: pink,
      link: accent,
      macro: accent,
      method: brand.lavender,
      methodDeclaration: brand.lavenderBright,
      namespace: brand.blue,
      number: status.orange,
      operator: accentBright,
      parameter: brand.lavenderMuted,
      property: pink,
      punctuation: base.foreground,
      punctuationMuted: base.foregroundMuted,
      regexp: status.warningBright,
      selector: brand.lime,
      string: brand.mintText,
      stringEscape: status.warningBright,
      stringSpecial: status.warningBright,
      tag: brand.mintText,
      title: brand.lavenderBright,
      type: accent,
      variable: base.foreground,
      variableSpecial: pink,
    },
  }
}
