/* Generate a review aid from shipped JSON, never from source palette aliases. */
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const root = path.resolve(__dirname, '..')
const packageDir = path.join(root, 'packages/vscode')
const outputDir = path.join(root, 'docs/reviews')
const manifest = JSON.parse(
  fs.readFileSync(path.join(packageDir, 'package.json'), 'utf8')
)
const escape = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      }[c])
  )
const hash = (bytes) =>
  crypto.createHash('sha256').update(bytes).digest('hex')
const color = (hex) => {
  if (!/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(hex))
    throw new Error('Invalid color: ' + hex)
  return hex
}
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
const over = (hex, base) => {
  const a = hex.length === 9 ? parseInt(hex.slice(7), 16) / 255 : 1
  return rgb(hex).map((v, i) => v * a + base[i] * (1 - a))
}
const luminance = (v) =>
  v
    .map((x) => x / 255)
    .map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4))
    .reduce((n, x, i) => n + x * [0.2126, 0.7152, 0.0722][i], 0)
const contrast = (fg, bg) => {
  const a = luminance(over(fg, bg)),
    b = luminance(bg)
  return ((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(2)
}
const hexRgb = (v) =>
  '#' +
  v
    .map((c) => Math.round(c).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
const swatch = (v) =>
  `<span class="checker"><span class="swatch" style="background:${color(
    v
  )}"></span></span><code>${escape(v)}</code>`
const rows = (entries) =>
  entries
    .map(
      ([k, v]) =>
        `<tr><th scope="row">${escape(k)}</th><td>${swatch(v)}</td></tr>`
    )
    .join('')
const table = (body, headers) =>
  `<div class="table-scroll"><table><thead><tr>${headers
    .map((h) => `<th>${h}</th>`)
    .join('')}</tr></thead><tbody>${body}</tbody></table></div>`

const pairs = [
  [
    'Primary action',
    'button.foreground',
    'button.background',
    'editor.background',
  ],
  [
    'Primary hover',
    'button.foreground',
    'button.hoverBackground',
    'editor.background',
  ],
  [
    'Secondary action',
    'button.secondaryForeground',
    'button.secondaryBackground',
    'editor.background',
  ],
  [
    'Secondary hover',
    'button.secondaryForeground',
    'button.secondaryHoverBackground',
    'editor.background',
  ],
  ['Badge', 'badge.foreground', 'badge.background', 'sideBar.background'],
  [
    'Activity selected',
    'activityBar.foreground',
    'activityBar.activeBackground',
    'activityBar.background',
  ],
  [
    'Activity unchecked hover/focus',
    'activityBar.foreground',
    'activityBar.background',
    'activityBar.background',
  ],
  [
    'Activity inactive',
    'activityBar.inactiveForeground',
    'activityBar.background',
    'activityBar.background',
  ],
  [
    'Modern activity selected',
    'modernActivityBarItem.activeForeground',
    'modernActivityBarItem.activeBackground',
    'activityBar.background',
  ],
  [
    'Modern activity unchecked hover',
    'modernActivityBarItem.hoverForeground',
    'modernActivityBarItem.hoverBackground',
    'activityBar.background',
  ],
  [
    'Active tab',
    'tab.activeForeground',
    'tab.activeBackground',
    'editor.background',
  ],
  [
    'Unfocused active tab',
    'tab.unfocusedActiveForeground',
    'tab.unfocusedActiveBackground',
    'editor.background',
  ],
  [
    'Inactive tab hover',
    'tab.hoverForeground',
    'tab.hoverBackground',
    'editor.background',
  ],
  [
    'List selected',
    'list.activeSelectionForeground',
    'list.activeSelectionBackground',
    'sideBar.background',
  ],
  [
    'List inactive selection',
    'list.inactiveSelectionForeground',
    'list.inactiveSelectionBackground',
    'sideBar.background',
  ],
  [
    'List hover',
    'list.hoverForeground',
    'list.hoverBackground',
    'sideBar.background',
  ],
  [
    'SSH / Remote',
    'statusBarItem.remoteForeground',
    'statusBarItem.remoteBackground',
    'statusBar.background',
  ],
  [
    'SSH / Remote hover',
    'statusBarItem.remoteHoverForeground',
    'statusBarItem.remoteHoverBackground',
    'statusBar.background',
  ],
  [
    'Notification',
    'notifications.foreground',
    'notifications.background',
    'editor.background',
  ],
  [
    'Disabled text on sidebar',
    'disabledForeground',
    'sideBar.background',
    'sideBar.background',
  ],
]

const inventory = { version: manifest.version, themes: [] }
let totalUi = 0,
  totalTextMate = 0,
  totalSemantic = 0
const sections = manifest.contributes.themes
  .map((entry, index) => {
    const filename = path.resolve(packageDir, entry.path)
    if (!filename.startsWith(packageDir + path.sep))
      throw new Error('Theme path outside package')
    const bytes = fs.readFileSync(filename)
    const theme = JSON.parse(bytes)
    if (bytes.includes('{{'))
      throw new Error('Unresolved template: ' + filename)
    const c = theme.colors
    Object.values(c).forEach(color)
    const counts = {
      ui: Object.keys(c).length,
      textMate: theme.tokenColors.length,
      semantic: Object.keys(theme.semanticTokenColors).length,
    }
    totalUi += counts.ui
    totalTextMate += counts.textMate
    totalSemantic += counts.semantic
    inventory.themes.push({
      id: entry.id,
      label: entry.label,
      path: entry.path,
      sha256: hash(bytes),
      ...counts,
    })
    const samples = pairs
      .map(([label, fg, bg, parent]) => {
        const composed = over(c[bg], rgb(c[parent]))
        return `<div class="sample"><strong>${escape(
          label
        )}</strong><div class="specimen" style="background:${hexRgb(
          composed
        )};color:${color(c[fg])}">Sample · Aa / 123</div><small>${escape(
          fg
        )} / ${escape(bg)}<br>${escape(c[fg])} on ${hexRgb(
          composed
        )} · ${contrast(c[fg], composed)}:1</small></div>`
      })
      .join('')
    const groups = {}
    for (const [key, value] of Object.entries(c))
      (groups[key.split('.')[0]] ??= []).push([key, value])
    const ui = Object.entries(groups)
      .map(
        ([group, entries]) =>
          `<details><summary>${escape(group)} · ${
            entries.length
          }</summary>${table(rows(entries), [
            'Resolved UI token',
            'Stored color',
          ])}</details>`
      )
      .join('')
    const syntax = theme.tokenColors
      .map(
        (rule, i) =>
          `<tr><th scope="row">${i + 1}. ${escape(
            [rule.scope].flat().join(', ')
          )}</th><td>${
            rule.settings.foreground
              ? swatch(rule.settings.foreground)
              : 'Inherited foreground'
          }${
            rule.settings.background
              ? '<br>Background ' + swatch(rule.settings.background)
              : ''
          }</td><td>${escape(rule.settings.fontStyle || '—')}</td></tr>`
      )
      .join('')
    const semantic = Object.entries(theme.semanticTokenColors)
      .map(([key, style]) => {
        const v = typeof style === 'string' ? { foreground: style } : style
        return `<tr><th scope="row">${escape(key)}</th><td>${swatch(
          v.foreground
        )}</td><td>${escape(v.fontStyle || '—')}</td></tr>`
      })
      .join('')
    const layered = ['inserted', 'removed']
      .map((kind) => {
        const bg = over(
          c[`diffEditor.${kind}TextBackground`],
          over(
            c[`diffEditor.${kind}LineBackground`],
            rgb(c['editor.background'])
          )
        )
        const text = [
          'comment',
          'keyword',
          'type',
          'function',
          'string',
          'property',
          'number',
        ]
          .map((key) => {
            const v = theme.semanticTokenColors[key]
            const fg = typeof v === 'string' ? v : v.foreground
            return `<span style="color:${color(fg)}">${escape(
              key
            )} <small>${contrast(fg, bg)}:1</small></span>`
          })
          .join(' · ')
        return `<p>${kind} line + word over editor · ${hexRgb(
          bg
        )}</p><div class="specimen syntax" style="background:${hexRgb(
          bg
        )}">${text}</div>`
      })
      .join('')
    return `<section id="theme-${index}"><h2>${escape(entry.label)}</h2><p>${
      counts.ui
    } UI colors · ${counts.textMate} TextMate rules · ${
      counts.semantic
    } semantic tokens</p><small>SHA-256 ${hash(
      bytes
    )}</small><h3>Explicit state pairs</h3><div class="samples">${samples}</div><h3>Layered diff specimens</h3>${layered}<h3>Complete UI configuration</h3>${ui}<details><summary>All TextMate rules, in source order</summary>${table(
      syntax,
      ['Scope', 'Stored colors', 'Font style']
    )}</details><details><summary>All semantic tokens</summary>${table(
      semantic,
      ['Token', 'Stored color', 'Font style']
    )}</details></section>`
  })
  .join('')

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Aura resolved theme review</title><style>
*{box-sizing:border-box}body{margin:0 auto;padding:36px 24px;max-width:1200px;background:#f5f6f7;color:#20252a;font:15px/1.55 system-ui,sans-serif}h1{font-size:30px}h2{font-size:26px}h3{margin-top:32px}p{max-width:86ch}nav{display:flex;gap:10px 20px;flex-wrap:wrap;margin:26px 0}a{color:#365c8e}section{border-top:2px solid #bac4cd;padding:24px 0;margin-top:40px}small{font-size:12px;color:#56616b;overflow-wrap:anywhere}code{font:13px ui-monospace,monospace}.samples{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:18px}.sample strong{display:block;font-size:14px}.specimen{padding:15px 18px;font:17px/1.6 ui-monospace,monospace;margin:8px 0}.syntax{display:flex;gap:12px;flex-wrap:wrap}.syntax small{color:inherit}details{border-bottom:1px solid #d2d7dc;padding:9px 0}summary{cursor:pointer;font-weight:600}table{border-collapse:collapse;width:100%;table-layout:fixed}th,td{padding:8px;text-align:left;vertical-align:top;border-bottom:1px solid #dce0e3;overflow-wrap:anywhere}tbody th{font:12px/1.5 ui-monospace,monospace;width:60%}td{font-size:13px}.checker{display:inline-block;width:28px;height:22px;vertical-align:middle;margin-right:10px;background:repeating-conic-gradient(#ccd0d5 0% 25%,#fff 0% 50%) 50%/12px 12px}.swatch{display:block;width:100%;height:100%;outline:1px solid #aaa4}.table-scroll{overflow:auto}@media(max-width:500px){body{padding:20px 12px}h1{font-size:25px}.samples{grid-template-columns:1fr}}
</style></head><body><h1>Aura · Resolved theme review</h1><p>Configuration specimens, not VS Code screenshots. These are the actual generated values for version ${escape(
  manifest.version
)}. No aesthetic score is computed. Compare whole-screen distribution against the relevant reference and accepted design.</p><p>${
  manifest.contributes.themes.length
} themes · ${totalUi} UI entries · ${totalTextMate} TextMate rules · ${totalSemantic} semantic tokens. Every entry appears below. State specimens composite alpha against the named parent; generic chips use a checkerboard. Runtime grammar precedence, omitted tokens, and user overrides require separate inspection.</p><nav>${manifest.contributes.themes
  .map((entry, i) => `<a href="#theme-${i}">${escape(entry.label)}</a>`)
  .join('')}</nav>${sections}</body></html>`
fs.mkdirSync(outputDir, { recursive: true })
fs.writeFileSync(path.join(outputDir, 'resolved-themes.html'), html)
fs.writeFileSync(
  path.join(outputDir, 'resolved-themes.json'),
  JSON.stringify(inventory, null, 2) + '\n'
)
console.log(
  `Reviewed data inventory: ${inventory.themes.length} themes, ${totalUi} UI entries, ${totalTextMate} TextMate rules, ${totalSemantic} semantic tokens.`
)
console.log(
  'Wrote docs/reviews/resolved-themes.html and resolved-themes.json. Manual design judgment is still required.'
)
