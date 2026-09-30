import { createHash } from 'crypto'
import {
  AuraActionEnhancement,
  AuraBadgeEmphasis,
  AuraFocusEmphasis,
  AuraGradientFill,
  LegacyAuraScheme,
} from 'core/colors/roles'
import { templateEngineService } from 'services'

interface ThemeInput {
  id: string
  slug: string
  name: string
  appearance: string
  scheme: LegacyAuraScheme
}

export interface EffectRule {
  state: string
  selector: string
  declarations: Array<{
    property: string
    value: string
    important?: boolean
  }>
}

function color(value: string): string {
  if (!/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(value)) {
    throw new Error(`Invalid effect color: ${value}`)
  }
  return value
}

function gradient(fill: AuraGradientFill): string {
  if (!Number.isFinite(fill.angle) || fill.stops.length < 2) {
    throw new Error('Invalid effect gradient')
  }
  let previous = -Infinity
  const stops = fill.stops.map(({ color: value, position }) => {
    if (
      !Number.isFinite(position) ||
      position < 0 ||
      position > 100 ||
      position < previous
    ) {
      throw new Error('Invalid effect stop position')
    }
    previous = position
    return `${color(value)} ${position}%`
  })
  return `linear-gradient(${fill.angle}deg, ${stops.join(', ')})`
}

// The port owns native selectors, pixel geometry, and CSS serialization.
// All colors, opacity and fill distributions arrive as resolved role data.
export function compileVscodeEnhancements(
  themes: ThemeInput[],
  extension: { publisher: string; name: string; version: string },
  template: string
) {
  const entries = themes.map(({ id, slug, name, appearance, scheme }) => {
    const themePath = `./themes/${slug}-color-theme.json`
    const themeClass = `${extension.publisher}.${
      extension.name
    }-${themePath.slice(2)}`.replace(/[^a-zA-Z0-9_-]/g, '-')
    const scope = `.monaco-workbench.${
      appearance === 'light' ? 'vs' : 'vs-dark'
    }.${themeClass}`
    const action: AuraActionEnhancement | null = scheme.uiActionEnhancement
      ? JSON.parse(scheme.uiActionEnhancement)
      : null
    const badge: AuraBadgeEmphasis | null = scheme.uiBadgeEmphasis
      ? JSON.parse(scheme.uiBadgeEmphasis)
      : null
    const focus: AuraFocusEmphasis | null = scheme.uiFocusEmphasis
      ? JSON.parse(scheme.uiFocusEmphasis)
      : null
    const rules: EffectRule[] = []
    const add = (
      state: string,
      selector: string,
      declarations: EffectRule['declarations']
    ) =>
      rules.push({ state, selector: `${scope} ${selector}`, declarations })
    if (action) {
      const primary =
        ':is(.monaco-button:not(.secondary), .extension-action.label.prominent):not(.disabled):not([aria-disabled="true"])'
      const shine = `inset 0 1px 0 ${color(action.normal.shine)}`
      add('action.normal', primary, [
        {
          property: 'background-image',
          value: gradient(action.normal.fill),
          important: true,
        },
        {
          property: 'border-color',
          value: color(action.normal.edge),
          important: true,
        },
        {
          property: 'box-shadow',
          value: `${shine}, 0 1px 3px ${color(action.normal.shadow)}`,
        },
      ])
      add('action.hover', primary + ':hover', [
        {
          property: 'background-image',
          value: gradient(action.hover.fill),
          important: true,
        },
        {
          property: 'box-shadow',
          value: `${shine}, 0 2px 6px ${color(action.hover.shadow)}`,
        },
      ])
    }
    if (focus) {
      // The screenshot's dark perimeter belongs to a focused notification
      // list row, not to its action button or an input. Scope the replacement
      // to toast cards; notification-center lists keep native treatment.
      // Only the list itself can own the surface ring. A focused descendant
      // button or link takes over; :focus-within would incorrectly light both.
      const card =
        '.notifications-toasts .notification-toast:has(.monaco-list:focus)'
      add('focus.surface', card, [
        { property: 'position', value: 'relative' },
        {
          property: 'box-shadow',
          value: `0 0 7px ${color(focus.glow.surface)}`,
        },
      ])
      const ring = (
        state: string,
        selector: string,
        inset: string,
        width: string
      ) =>
        add(state, selector + '::after', [
          { property: 'content', value: '""' },
          { property: 'position', value: 'absolute' },
          { property: 'inset', value: inset },
          { property: 'padding', value: width },
          { property: 'border-radius', value: 'inherit' },
          { property: 'pointer-events', value: 'none' },
          { property: 'z-index', value: '1' },
          { property: 'background', value: gradient(focus.ring) },
          // Keep the ring hollow on older Electron builds as well.
          {
            property: '-webkit-mask',
            value:
              'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          },
          { property: '-webkit-mask-composite', value: 'xor' },
          {
            property: 'mask',
            value:
              'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          },
          { property: 'mask-composite', value: 'exclude' },
        ])
      ring('focus.surface.ring', card, '0', '2px')
      add('focus.surface.row', card + ' .monaco-list-row.focused', [
        {
          property: 'outline',
          value: '1px solid transparent',
          important: true,
        },
        {
          property: 'box-shadow',
          value: `inset 0 0 0 1px ${color(focus.innerEdge)}`,
        },
      ])
      add('focus.surface.list', card + ' .monaco-list:focus', [
        { property: 'outline-color', value: 'transparent', important: true },
      ])
      add(
        'focus.surface.listBoundary',
        card + ' .monaco-list:not(.element-focused):focus::before',
        [
          {
            property: 'outline-color',
            value: 'transparent',
            important: true,
          },
        ]
      )
      const input =
        '.monaco-inputbox:not(.error):not(.warning):not(.info):not(.disabled):not(:has(:disabled, [aria-invalid="true"])):has(> .ibwrapper > .input:focus)'
      const primary =
        ':is(.monaco-button:not(.secondary):not(.wizard-segmented-main), .extension-action.label.prominent):not(.disabled):not([aria-disabled="true"]):focus-visible'
      const icon =
        '.monaco-toolbar .action-item:not(.disabled):not([aria-disabled="true"]) > .action-label.codicon:not(.codicon-testing-autorun):not(.model-picker-split):not([aria-disabled="true"]):focus-visible'
      for (const [kind, selector, inset, width, blur] of [
        ['input', input, '-1px', '2px', '5px'],
        ['action', primary, '0', '2px', '5px'],
        ['icon', icon, '0', '1.5px', '3px'],
      ]) {
        add(`focus.${kind}`, selector, [
          { property: 'position', value: 'relative' },
          {
            property: 'outline',
            value: '1px solid transparent',
            important: true,
          },
          {
            property: 'box-shadow',
            value: `inset 0 0 0 1px ${color(
              focus.innerEdge
            )}, 0 0 ${blur} ${color(
              kind === 'icon' ? focus.glow.compact : focus.glow.control
            )}`,
            important: true,
          },
        ])
        ring(`focus.${kind}.ring`, selector, inset, width)
      }
      add('focus.input.text', input + ' > .ibwrapper > .input:focus', [
        { property: 'outline-color', value: 'transparent', important: true },
      ])
    }
    if (badge) {
      add(
        'badge.emphasis',
        '.monaco-action-bar .badge:not(.progress-badge):not(.icon-badge) > .badge-content:not(:empty)',
        [
          {
            property: 'background-image',
            value: gradient(badge.fill),
            important: true,
          },
          {
            property: 'box-shadow',
            value: `inset 0 0 0 1px ${color(badge.edge)}, 0 0 5px ${color(
              badge.glow
            )}`,
          },
          {
            property: 'text-shadow',
            value: `0 1px 1px ${color(badge.labelShadow)}`,
          },
        ]
      )
    }
    return {
      id,
      label: name,
      path: themePath,
      scope,
      action,
      badge,
      focus,
      rules,
      fallback: {
        action: {
          background: scheme.uiActionBackground,
          hoverBackground: scheme.uiActionHoverBackground,
          foreground: scheme.uiActionForeground,
          border: scheme.uiActionBorder,
        },
        badge: {
          background: scheme.uiBadgeBackground,
          foreground: scheme.uiBadgeForeground,
        },
        focus: scheme.uiFocusBorder,
      },
    }
  })
  const css =
    templateEngineService().render(template, { themes: entries }).trimEnd() +
    '\n'
  if (css.includes('{{')) throw new Error('Unresolved enhancement template')
  return {
    css,
    manifest: {
      version: extension.version,
      stylesheet: './extension/aqua-gradients.css',
      sha256: createHash('sha256').update(css).digest('hex'),
      themes: entries,
    },
  }
}
