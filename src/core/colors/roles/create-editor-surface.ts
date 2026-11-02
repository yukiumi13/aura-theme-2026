import { AuraPalette } from './types'
import { stripAlpha, withAlpha } from './utils'

// Surfaces for editors whose controls share one global foreground. Resolve
// after family overrides: never pair a VS Code-only on-fill foreground with a
// host that cannot select it. These roles do not change existing VS Code roles.
export function createEditorSurface(palette: AuraPalette) {
  const { base, ui, semantic } = palette
  const light = palette.appearance === 'light'
  const tint = (color: string, alpha: string) =>
    withAlpha(stripAlpha(color), alpha)
  return {
    activeTab: tint(ui.action.background, light ? '16' : '20'),
    control: base.surface,
    hover: ui.surfaceRole.hover,
    pressed: ui.selectionRole.listFocus,
    selected: ui.selectionRole.list,
    disabled: base.surfaceAlt,
    actionTint: tint(ui.action.background, light ? '24' : '28'),
    actionBorder: tint(ui.action.background, light ? '60' : '70'),
    lineNumber: base.foregroundSubtle,
    search: tint(semantic.status.warning, light ? '20' : '28'),
    searchActive: tint(semantic.status.warning, light ? '38' : '48'),
    modifiedTint: tint(ui.status.modified, light ? '14' : '24'),
    conflictTint: tint(ui.status.conflict, light ? '14' : '24'),
    predictiveTint: tint(base.foregroundMuted, '0C'),
    diffAdded: ui.status.successSurface,
    diffDeleted: ui.status.errorSurface,
    diffAddedWord: ui.status.successTextSurface,
    diffDeletedWord: ui.status.errorTextSurface,
    diffAddedBorder: tint(ui.status.success, '70'),
    diffDeletedBorder: tint(semantic.status.error, '70'),
    debuggerLine: tint(semantic.status.warning, light ? '18' : '20'),
    normalMode: ui.action.background,
    normalModeText: ui.action.foreground,
    insertMode: ui.badge.background,
    insertModeText: ui.badge.foreground,
    replaceMode: ui.status.errorSurface,
    replaceModeText: semantic.status.error,
    visualMode: ui.selectionRole.listFocus,
    visualModeText: ui.linkRole.foreground,
    yank: tint(ui.badge.background, '40'),
    // Collaborator selection opacity is appearance-specific; cursor ink uses
    // readable syntax roles rather than bright action fills on light paper.
    playerSelection1: tint(palette.syntax.string, light ? '24' : '38'),
    playerSelection2: tint(palette.syntax.type, light ? '24' : '38'),
    playerSelection3: tint(palette.syntax.function, light ? '24' : '38'),
    playerSelection4: tint(palette.syntax.property, light ? '24' : '38'),
    playerSelection5: tint(palette.syntax.number, light ? '24' : '38'),
    playerSelection6: tint(semantic.status.error, light ? '24' : '38'),
    playerSelection7: tint(ui.companion, light ? '24' : '38'),
  }
}
