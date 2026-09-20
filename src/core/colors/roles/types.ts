export type AuraAppearance = 'dark' | 'light'

export interface AuraBasePalette {
  shadow: string
  background: string
  appBackground: string
  sidebar: string
  panel: string
  surface: string
  surfaceAlt: string
  surfaceHover: string
  elevated: string
  border: string
  borderStrong: string
  foreground: string
  foregroundStrong: string
  foregroundMuted: string
  foregroundSubtle: string
  disabled: string
  comment: string
  transparent: string
}

export interface AuraSemanticPalette {
  interaction?: {
    accent: string
  }
  // A family may assign its own filled-action colors while retaining Aura mint.
  action?: {
    background: string
    foreground: string
    hoverBackground: string
    border: string
  }
  brand: {
    mint: string
    mintText: string
    mintHover: string
    onMint: string
    lime: string
    blue: string
    teal: string
    lavender: string
    lavenderBright: string
    lavenderMuted: string
    pink: string
    pinkSoft: string
  }
  status: {
    error: string
    errorBright: string
    success: string
    successBright: string
    warning: string
    warningBright: string
    orange: string
    orangeBright: string
    info: string
    infoBright: string
  }
}

export interface AuraVariantFamily {
  name: string
  slug: string
  accent: string
  accentBright: string
  accentSoft: string
  companion: string
  companionBright: string
  companionSoft: string
}

export interface AuraAnsiPalette {
  black: string
  red: string
  green: string
  yellow: string
  blue: string
  magenta: string
  cyan: string
  white: string
  brightBlack: string
  brightRed: string
  brightGreen: string
  brightYellow: string
  brightBlue: string
  brightMagenta: string
  brightCyan: string
  brightWhite: string
  dimBlack: string
  dimRed: string
  dimGreen: string
  dimYellow: string
  dimBlue: string
  dimMagenta: string
  dimCyan: string
  dimWhite: string
}

export interface AuraTerminalPalette {
  background: string
  foreground: string
  foregroundBright: string
  muted: string
  red: string
  redBright: string
  yellow: string
  yellowBright: string
  green: string
  greenDim: string
  greenBright: string
  mintBright: string
  purple: string
  purpleSoft: string
  purpleBright: string
  pink: string
  pinkBright: string
  companionSoft: string
  info: string
  infoBright: string
}

export interface AuraSyntaxPalette {
  attribute: string
  boolean: string
  class: string
  comment: string
  commentDoc: string
  constant: string
  constructor: string
  decorator: string
  diffRange: string
  embedded: string
  ignored: string
  enum: string
  enumMember: string
  function: string
  functionDeclaration: string
  functionSpecial: string
  keyword: string
  label: string
  link: string
  macro: string
  method: string
  methodDeclaration: string
  namespace: string
  number: string
  operator: string
  parameter: string
  property: string
  punctuation: string
  punctuationMuted: string
  regexp: string
  selector: string
  string: string
  stringEscape: string
  stringSpecial: string
  tag: string
  title: string
  type: string
  variable: string
  variableSpecial: string
}

export interface AuraUiPalette {
  chrome: {
    background: string
    border: string
    titleBorder: string
    activeBorder: string
    tabStripBackground: string
    activeTabBackground: string
    activeTabForeground: string
    activeActivityBackground: string
    activeActivityForeground: string
    modernActivity?: {
      activeBackground: string
      activeForeground: string
      hoverBackground: string
      hoverForeground: string
    }
    inactiveTabBackground: string
    unfocusedTabForeground: string
    tabHoverBackground: string
    tabHoverBorder: string
    sectionHeaderBackground: string
  }
  editorDecoration: {
    lineNumber: string
    lineHighlight: string
    whitespace: string
    treeGuide: string
    indentGuide: string
    activeIndentGuide: string
    rangeHighlight: string
    inlayHintForeground: string
  }
  chartGrid: string
  onAccent: string
  onError: string
  onDebug: string
  interactionForeground: string
  accent: string
  accentBright: string
  accentSoft: string
  companion: string
  companionBright: string
  companionSoft: string
  badge: {
    background: string
    foreground: string
  }
  action: {
    background: string
    prominentBackground: string
    border: string
    foreground: string
    hoverBackground: string
    hoverForeground: string
    secondaryHoverBackground: string
  }
  linkRole: {
    foreground: string
    hoverForeground: string
  }
  remote: {
    compactHoverBackground: string
    background: string
    foreground: string
    hoverBackground: string
    hoverForeground: string
  }
  selectionRole: {
    editor: string
    editorInactive: string
    editorStrong: string
    list: string
    listFocus: string
    listInactive: string
    solid: string
  }
  status: {
    modified: string
    conflict: string
    info: string
    success: string
    successBright: string
    successSurface: string
    successTextSurface: string
    errorTextSurface: string
    warning: string
    warningSurface: string
    errorSurface: string
    infoSurface: string
  }
  surfaceRole: {
    elevated: string
    panel: string
    hover: string
    hoverOverlay: string
    strongOverlay: string
    toolbarHover: string
    tile: string
    tileHover: string
  }
  welcome: {
    background: string
    tileBackground: string
    tileHoverBackground: string
    tileBorder: string
    stepTitleForeground: string
  }
  highlight: {
    base: string
    bright: string
    hover: string
    foreground: string
  }
  focusBorder: string
  selection: string
  selectionSoft: string
  selectionStrong: string
  selectionSolid: string
  listSelection: string
  listSelectionFocus: string
  warning: string
  modified: string
  actionHover: string
  lineHighlight: string
  link: string
  linkHover: string
  button: string
  buttonHover: string
  successSurface: string
  warningSurface: string
  errorSurface: string
  infoSurface: string
  subtleAccentSurface: string
  mediumAccentSurface: string
  strongAccentSurface: string
  foregroundOverlayLow: string
  foregroundOverlayHigh: string
  scrollbar: string
  scrollbarHover: string
  scrollbarActive: string
  debugBackground: string
  breakpointBackground: string
}

export interface AuraPalette {
  appearance: AuraAppearance
  name: string
  slug: string
  base: AuraBasePalette
  semantic: AuraSemanticPalette
  family: AuraVariantFamily
  ui: AuraUiPalette
  ansi: AuraAnsiPalette
  terminal: AuraTerminalPalette
  syntax: AuraSyntaxPalette
}

export type LegacyAuraScheme = Record<string, string>
