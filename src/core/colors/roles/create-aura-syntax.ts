import {
  AuraAppearance,
  AuraBasePalette,
  AuraSemanticPalette,
  AuraSyntaxPalette,
  AuraVariantFamily,
} from './types'

// Shared syntax role mapping; callers choose the syntax family independently of UI.
export function createAuraSyntax(
  base: AuraBasePalette,
  semantic: AuraSemanticPalette,
  family: Pick<AuraVariantFamily, 'accent' | 'accentBright'>,
  appearance: AuraAppearance
): AuraSyntaxPalette {
  const { brand, status } = semantic
  const { accent, accentBright } = family
  const pink = brand.pink
  const isLight = appearance === 'light'
  return {
    attribute: accent,
    boolean: accent,
    class: accent,
    comment: base.comment,
    commentDoc: brand.lavenderMuted,
    constant: accent,
    constructor: accent,
    decorator: pink,
    diffRange: accentBright,
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
  }
}
