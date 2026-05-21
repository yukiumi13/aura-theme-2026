import { LegacyAuraScheme } from 'core/colors/palettes/types'

export const terminalAnsiSuffix = 'ansi'
export const terminalAnsiLabel = 'ANSI'

export function withTerminalAuraAnsi(
  scheme: LegacyAuraScheme
): LegacyAuraScheme {
  const magenta =
    scheme.uiCompanion === scheme.syntaxString
      ? '#C084FC'
      : scheme.uiCompanion
  const brightMagenta =
    scheme.uiCompanionBright === '#9FFFE2'
      ? '#D8B4FE'
      : scheme.uiCompanionBright

  return {
    ...scheme,
    ansiGreen: scheme.syntaxString,
    ansiBlue: scheme.uiAccent,
    ansiMagenta: magenta,
    ansiCyan: '#48A0C7',
    ansiBrightGreen: '#9FFFE2',
    ansiBrightBlue: scheme.uiAccentBright,
    ansiBrightMagenta: brightMagenta,
    ansiBrightCyan: scheme.syntaxNamespace,
    ansiDimGreen: scheme.uiCompanionSoft,
    ansiDimBlue: scheme.uiAccentSoft,
    ansiDimMagenta: scheme.uiAccentSoft,
    ansiDimCyan: '#2F6F8F',
  }
}

export function withTerminalSemanticAnsi(
  scheme: LegacyAuraScheme
): LegacyAuraScheme {
  return {
    ...scheme,
    ansiGreen: scheme.syntaxString,
    ansiBlue: '#7C8CF8',
    ansiMagenta: '#A277FF',
    ansiCyan: '#22D3EE',
    ansiBrightGreen: '#9FFFE2',
    ansiBrightBlue: '#A5B4FC',
    ansiBrightMagenta: '#C4B5FD',
    ansiBrightCyan: '#9FFFE2',
    ansiDimGreen: '#3EA784',
    ansiDimBlue: '#4F5BBF',
    ansiDimMagenta: '#6F4FD8',
    ansiDimCyan: '#0891B2',
  }
}
