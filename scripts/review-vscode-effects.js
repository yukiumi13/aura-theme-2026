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
        theme.fallback.badge.background !== actual['badge.background']
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
            declarations.push(...(byState['action.focus'] || []))
          return `<div class="sample"><strong>Action ${state}</strong><span style="--vscode-focusBorder:${escape(
            actual.focusBorder
          )};${escape(
            actionBase + styles(declarations)
          )}">Open Folder</span></div>`
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
      const roleRows = flatten({ action: theme.action, badge: theme.badge })
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
      return `<details open><summary>${escape(
        theme.label
      )} · generated effects</summary><p><code>${escape(
        theme.scope
      )}</code></p><div class="samples">${samples}<div class="sample"><strong>Numeric marker</strong><span style="${escape(
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
    html: `<section id="enhancements"><h2>Optional UI effects</h2><p>Generated CSS and plain-theme fallbacks. These are configuration specimens, not native VS Code screenshots. CSS SHA-256: <code>${sha}</code>. Native focus color overrides still apply; other effect colors are owned by their roles. Secondary/disabled buttons, progress indicators and icon badges retain native styling.</p>${sections}<details><summary>Complete shipped stylesheet</summary><pre style="white-space:pre-wrap">${escape(
      stylesheet
    )}</pre></details></section>`,
  }
}
