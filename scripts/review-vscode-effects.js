/* Read generated effect artifacts, never source palettes. */
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

exports.reviewEnhancements = function (packageDir, manifest, escape) {
  const inventory = JSON.parse(
    fs.readFileSync(
      path.join(packageDir, 'extension/aqua-effects.json'),
      'utf8'
    )
  )
  const stylesheet = fs.readFileSync(
    path.join(packageDir, inventory.stylesheet),
    'utf8'
  )
  const sha = crypto.createHash('sha256').update(stylesheet).digest('hex')
  if (inventory.sha256 !== sha || inventory.version !== manifest.version)
    throw Error('Stale effect inventory; rebuild the VS Code port')
  if (inventory.themes.length !== manifest.contributes.themes.length)
    throw Error('Incomplete effect inventory')
  const styles = (declarations) =>
    declarations.map((d) => `${d.property}:${d.value}`).join(';')
  const flatten = (value, prefix = '') =>
    Object.entries(value || {}).flatMap(([key, item]) => {
      const name = prefix ? `${prefix}.${key}` : key
      return item && typeof item === 'object'
        ? flatten(item, name)
        : [[name, item]]
    })
  const sections = inventory.themes
    .map((theme, index) => {
      const registered = manifest.contributes.themes[index]
      if (theme.id !== registered.id || theme.path !== registered.path)
        throw Error('Effect scope differs from registered themes')
      const actual = JSON.parse(
        fs.readFileSync(path.join(packageDir, theme.path), 'utf8')
      ).colors
      if (
        theme.fallback.action.background !== actual['button.background'] ||
        theme.fallback.badge.background !== actual['badge.background'] ||
        theme.fallback.focus !== actual.focusBorder
      )
        throw Error('Effect fallback differs from theme JSON')
      for (const rule of theme.rules) {
        const block =
          rule.selector +
          ' {\n' +
          rule.declarations
            .map(
              (d) =>
                `  ${d.property}: ${d.value}${
                  d.important ? ' !important' : ''
                };\n`
            )
            .join('') +
          '}'
        if (!stylesheet.replace(/\r/g, '').includes(block))
          throw Error('Effect declarations differ from shipped CSS')
      }
      if (!theme.rules.length)
        return `<details><summary>${escape(
          theme.label
        )} · native theme only</summary><p>No enhancement rules emitted.</p></details>`
      const byState = Object.fromEntries(
        theme.rules.map((rule) => [rule.state, rule.declarations])
      )
      const actionBase = `display:inline-block;padding:7px 16px;border:1px solid ${actual['button.border']};border-radius:4px;background:${actual['button.background']};color:${actual['button.foreground']};`
      const samples = ['normal', 'hover', 'focus', 'hover + focus']
        .map((state) => {
          const declarations = [...(byState['action.normal'] || [])]
          if (state.includes('hover'))
            declarations.push(...(byState['action.hover'] || []))
          if (state.includes('focus'))
            declarations.push(...(byState['focus.action'] || []))
          return `<div class="sample"><strong>Action ${state}</strong><span style="--vscode-focusBorder:${escape(
            actual.focusBorder
          )};${escape(actionBase + styles(declarations))}">Open Folder${
            state.includes('focus')
              ? `<span aria-hidden="true" style="${escape(
                  styles(byState['focus.action.ring'] || [])
                )}"></span>`
              : ''
          }</span></div>`
        })
        .join('')
      const badgeStyle = `display:inline-block;width:16px;height:16px;line-height:16px;text-align:center;font-size:11px;border-radius:50%;background:${
        actual['activityBarBadge.background']
      };color:${actual['activityBarBadge.foreground']};${styles(
        byState['badge.emphasis'] || []
      )}`
      const fallback = `<p>CSS off: <span style="${escape(
        actionBase
      )}">Open Folder</span> <span style="background:${escape(
        actual['badge.background']
      )};color:${escape(
        actual['badge.foreground']
      )};padding:2px 6px;border-radius:12px">1</span></p>`
      const notificationSamples = ['normal', 'focused', 'CSS off']
        .map(
          (state) =>
            `<div class="sample"><strong>Notification ${state}</strong><span style="display:inline-block;padding:14px;border-radius:10px;background:${escape(
              actual['notifications.background']
            )};color:${escape(
              actual['notifications.foreground']
            )};border:1px solid ${escape(
              state === 'CSS off'
                ? actual['list.focusOutline']
                : actual['notificationToast.border']
            )};${escape(
              state === 'focused'
                ? styles(byState['focus.surface'] || [])
                : ''
            )}">Sample task is ready.${
              state === 'focused'
                ? `<span aria-hidden="true" style="${escape(
                    styles(byState['focus.surface.ring'] || [])
                  )}"></span>`
                : ''
            }</span></div>`
        )
        .join('')
      const roleRows = flatten({
        action: theme.action,
        badge: theme.badge,
        focus: theme.focus,
      })
        .map(
          ([key, value]) =>
            `<tr><th>${escape(key)}</th><td>${
              typeof value === 'string' &&
              /^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(value)
                ? `<span class="checker"><span class="swatch" style="background:${value}"></span></span>`
                : ''
            }${escape(value)}</td></tr>`
        )
        .join('')
      const controlSamples = ['input', 'icon']
        .map(
          (kind) =>
            `<div class="sample"><strong>Focus ${kind}</strong><span style="display:inline-block;padding:6px 9px;border-radius:4px;background:${escape(
              actual['input.background']
            )};color:${escape(actual['input.foreground'])};${escape(
              styles(byState[`focus.${kind}`] || [])
            )}">${
              kind === 'input' ? 'Search the sample' : '…'
            }<span aria-hidden="true" style="${escape(
              styles(byState[`focus.${kind}.ring`] || [])
            )}"></span></span></div>`
        )
        .join('')
      return `<details open><summary>${escape(
        theme.label
      )} · generated effects</summary><p><code>${escape(
        theme.scope
      )}</code></p><div class="samples">${samples}${notificationSamples}${controlSamples}<div class="sample"><strong>Numeric marker</strong><span style="${escape(
        badgeStyle
      )}">1</span> <span style="${escape(
        badgeStyle
      )}">10</span></div></div>${fallback}<details><summary>All resolved effect roles</summary><table>${roleRows}</table></details><details><summary>Native selector and declaration mappings</summary><pre style="white-space:pre-wrap">${escape(
        JSON.stringify(theme.rules, null, 2)
      )}</pre></details></details>`
    })
    .join('')
  return {
    inventory,
    html: `<section id="enhancements"><h2>Optional UI effects</h2><p>Generated CSS and plain-theme fallbacks. These are configuration specimens, not native VS Code screenshots. CSS SHA-256: <code>${sha}</code>. One focus role defines shared ring colors and control/compact/surface glow densities. Notification surfaces relinquish emphasis to their focused child controls. Native fallback palettes remain unchanged; severity, validation, disabled states and notification-center lists retain native treatment.</p>${sections}<details><summary>Complete shipped stylesheet</summary><pre style="white-space:pre-wrap">${escape(
      stylesheet
    )}</pre></details></section>`,
  }
}
