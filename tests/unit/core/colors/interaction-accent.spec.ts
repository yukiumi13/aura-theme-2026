import { createAuraPalette } from 'core/colors/roles'
import {
  auraDefaultFamily,
  auraSemantic2026,
  auraInteractionAqua,
} from 'core/colors/source/aura'
import {
  auraLightFamily,
  auraLightSemantic2026,
} from 'core/colors/source/light'
import { AuraAppearance } from 'core/colors/roles/types'

describe.each(['light', 'dark'])('Aura %s interaction accent', (value) => {
  const appearance = value as AuraAppearance
  const isLight = appearance === 'light'
  const family = isLight ? auraLightFamily : auraDefaultFamily
  const semantic = isLight ? auraLightSemantic2026 : auraSemantic2026

  it('changes interaction feedback without recoloring syntax, status, or ANSI', () => {
    const normal = createAuraPalette(family, undefined, appearance, semantic)
    const changed = createAuraPalette(family, undefined, appearance, {
      ...semantic,
      interaction: { accent: '#FF00FF' },
    })
    expect(normal.ui.action.hoverBackground).toBe(auraInteractionAqua)
    expect(changed.ui.action.hoverBackground).toBe('#FF00FF')
    expect(changed.ui.remote.hoverBackground).toBe('#FF00FF')
    expect(changed.ui.action.background).toBe(normal.ui.action.background)
    expect(changed.ui.action.foreground).toBe(normal.ui.action.foreground)
    expect(changed.syntax).toEqual(normal.syntax)
    expect(changed.ansi).toEqual(normal.ansi)
    expect(changed.terminal).toEqual(normal.terminal)
    expect(changed.ui.status).toEqual(normal.ui.status)
    if (isLight) {
      expect(changed.ui.interactionForeground).toBe(normal.base.foreground)
      expect(changed.ui.linkRole).toEqual(normal.ui.linkRole)
    } else {
      expect(changed.ui.interactionForeground).toBe('#FF00FF')
      expect(changed.ui.linkRole.hoverForeground).toBe('#FF00FF')
    }
  })
})
