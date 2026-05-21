import { LegacyAuraScheme } from 'core/colors/palettes/types'

export const terminalAnsiSuffix = 'ansi'
export const terminalAnsiLabel = 'ANSI'

function createTerminalColors(scheme: LegacyAuraScheme) {
  return {
    background: scheme.terminalBackground,
    foreground: scheme.terminalForeground,
    foregroundBright: scheme.terminalForegroundBright,
    muted: scheme.terminalMuted,
    red: scheme.terminalRed,
    redBright: scheme.terminalRedBright,
    yellow: scheme.terminalYellow,
    yellowBright: scheme.terminalYellowBright,
    green: scheme.terminalGreen,
    greenDim: scheme.terminalGreenDim,
    greenBright: scheme.terminalGreenBright,
    mintBright: scheme.terminalMintBright,
    purple: scheme.terminalPurple,
    purpleSoft: scheme.terminalPurpleSoft,
    purpleBright: scheme.terminalPurpleBright,
    pink: scheme.terminalPink,
    pinkBright: scheme.terminalPinkBright,
    companionSoft: scheme.terminalCompanionSoft,
    info: scheme.terminalInfo,
    infoBright: scheme.terminalInfoBright,
  }
}

export function withTerminalAuraAnsi(
  scheme: LegacyAuraScheme
): LegacyAuraScheme {
  const colors = createTerminalColors(scheme)

  return {
    ...scheme,
    ansiGreen: colors.green,
    ansiBlue: colors.purple,
    ansiMagenta: colors.pink,
    ansiCyan: colors.info,
    ansiBrightGreen: colors.greenBright,
    ansiBrightBlue: colors.purpleBright,
    ansiBrightMagenta: colors.pinkBright,
    ansiBrightCyan: colors.infoBright,
    ansiDimGreen: colors.greenDim,
    ansiDimBlue: colors.purpleSoft,
    ansiDimMagenta: colors.companionSoft,
    ansiDimCyan: colors.info,
  }
}

export function withTerminalSemanticAnsi(
  scheme: LegacyAuraScheme
): LegacyAuraScheme {
  const colors = createTerminalColors(scheme)

  return {
    ...scheme,
    ansiGreen: colors.green,
    ansiBlue: colors.infoBright,
    ansiMagenta: colors.pink,
    ansiCyan: colors.info,
    ansiBrightGreen: colors.greenBright,
    ansiBrightBlue: colors.infoBright,
    ansiBrightMagenta: colors.pinkBright,
    ansiBrightCyan: colors.mintBright,
    ansiDimGreen: colors.greenDim,
    ansiDimBlue: colors.info,
    ansiDimMagenta: colors.pink,
    ansiDimCyan: colors.info,
  }
}
