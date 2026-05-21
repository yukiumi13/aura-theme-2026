import { LegacyAuraScheme } from 'core/colors/palettes/types'

export const terminalAnsiSuffix = 'ansi'
export const terminalAnsiLabel = 'ANSI'

export function withTerminalSemanticAnsi(
  scheme: LegacyAuraScheme
): LegacyAuraScheme {
  return {
    ...scheme,
    ansiBlue: '#7C8CF8',
    ansiMagenta: '#A277FF',
    ansiCyan: '#22D3EE',
    ansiBrightBlue: '#A5B4FC',
    ansiBrightMagenta: '#C4B5FD',
    ansiBrightCyan: '#9FFFE2',
    ansiDimBlue: '#4F5BBF',
    ansiDimMagenta: '#6F4FD8',
    ansiDimCyan: '#0891B2',
  }
}
