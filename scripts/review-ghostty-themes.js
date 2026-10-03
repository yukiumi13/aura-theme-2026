// Review the decoded outputs. These specimens are not Ghostty/Herdr screenshots.
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const { execFileSync } = require('child_process')
const root = path.resolve(__dirname, '..')
const dir = path.join(root, 'packages/ghostty')
const out = path.join(root, 'docs/reviews')
const manifest = JSON.parse(
  fs.readFileSync(path.join(root, 'packages/vscode/package.json'), 'utf8')
)
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
const luminance = (hex) =>
  rgb(hex)
    .map((v) => v / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0)
const contrast = (a, b) => {
  const [low, high] = [luminance(a), luminance(b)].sort((x, y) => x - y)
  return Number(((high + 0.05) / (low + 0.05)).toFixed(2))
}
const hash = (text) =>
  crypto
    .createHash('sha256')
    .update(text.replace(/\r\n/g, '\n'))
    .digest('hex')
const escape = (text) =>
  String(text).replace(
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
function decode(text) {
  const result = {}
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim() || line.startsWith('#')) continue
    const [, key, value] = line.match(/^([\w-]+) = (.+)$/) || []
    if (!key) throw Error(`Invalid line: ${line}`)
    const [index, color] = value.split('=')
    const name = key === 'palette' ? `palette.${index}` : key
    if (name in result) throw Error(`Duplicate key: ${name}`)
    result[name] = key === 'palette' ? color : value
    if (!/^#[0-9a-f]{6}$/i.test(result[name]))
      throw Error(`Invalid RGB: ${name}`)
  }
  return result
}
function herdrMode(text, mode) {
  const block = text.split(`[theme.custom.${mode}]`)[1].split('[')[0]
  return Object.fromEntries(
    [...block.matchAll(/^(\w+) = "(#[0-9A-F]{6})"$/gim)].map((m) => [
      m[1],
      m[2],
    ])
  )
}
const baseline = 'd2422b7f6aec5587a974d8a5261fb88d1727be6c'
const inventory = {
  baseline,
  runtimeNote:
    'See 2026-10-03-ghostty.md for actual runtime validation. This sheet is a decoded configuration preview.',
  themes: [],
}
for (const entry of manifest.contributes.themes) {
  const file = entry.label.toLowerCase().replace(/ /g, '-') + '.conf'
  const raw = fs.readFileSync(path.join(dir, file), 'utf8')
  const colors = decode(raw)
  const appearance = entry.uiTheme === 'vs' ? 'light' : 'dark'
  const family = /Aqua/.test(entry.label)
    ? 'aqua'
    : /Azure/.test(entry.label)
    ? 'azure'
    : /Lime/.test(entry.label)
    ? 'lime'
    : 'aura'
  const companion = herdrMode(
    fs.readFileSync(path.join(dir, 'herdr', `${family}.toml`), 'utf8'),
    appearance
  )
  const vscodePath = 'packages/vscode/' + entry.path.replace(/^\.\//, '')
  const current = fs.readFileSync(path.join(root, vscodePath), 'utf8')
  const previous = execFileSync(
    'git',
    ['show', `${baseline}:${vscodePath}`],
    { cwd: root, encoding: 'utf8' }
  )
  inventory.themes.push({
    name: entry.label,
    file,
    family,
    appearance,
    sha256LF: hash(raw),
    colors,
    vscode: {
      sha256LF: hash(current),
      unchanged:
        current.replace(/\r\n/g, '\n') === previous.replace(/\r\n/g, '\n'),
    },
    contrast: Object.fromEntries(
      [
        ['text', 'foreground', 'background'],
        ['cursor', 'cursor-text', 'cursor-color'],
        ['selection', 'selection-foreground', 'selection-background'],
        ['search', 'search-foreground', 'search-background'],
        [
          'activeSearch',
          'search-selected-foreground',
          'search-selected-background',
        ],
      ].map(([name, fg, bg]) => [name, contrast(colors[fg], colors[bg])])
    ),
    ansiContrast: Array.from({ length: 16 }, (_, i) =>
      contrast(colors[`palette.${i}`], colors.background)
    ),
    herdr: {
      defaultActiveRow: colors['palette.8'],
      defaultActiveRowContrast: contrast(
        colors.foreground,
        colors['palette.8']
      ),
      companion,
      contrast: Object.fromEntries(
        Object.entries(companion).map(([key, color]) => [
          key,
          contrast(colors.foreground, color),
        ])
      ),
    },
  })
}
const sample = (ink, fill, text) =>
  `<span style="color:${ink};background:${fill}">${escape(text)}</span>`
const cards = inventory.themes
  .map((t) => {
    const c = t.colors
    return `<article style="background:${c.background};color:${
      c.foreground
    }"><h2>${escape(t.name)}</h2>
  <div class="ansi">${Array.from({ length: 16 }, (_, i) =>
    sample(c[`palette.${i}`], c.background, `${i} Aa`)
  ).join(' ')}</div>
  <p>${sample(
    c['cursor-text'],
    c['cursor-color'],
    '▉'
  )} Ready to build · clean reading surface</p>
  <p>${sample(
    c['selection-foreground'],
    c['selection-background'],
    ' selected output '
  )} ${sample(
      c['search-foreground'],
      c['search-background'],
      ' match '
    )} ${sample(
      c['search-selected-foreground'],
      c['search-selected-background'],
      ' active '
    )}</p>
  <small>Herdr row specimens: default → companion</small>
  <p class="row" style="background:${
    t.herdr.defaultActiveRow
  }">● summer-app · main <small>${
      t.herdr.defaultActiveRowContrast
    }:1</small></p>
  <p class="row" style="background:${
    t.herdr.companion.active_row_bg
  }">● summer-app · main <small>${
      t.herdr.contrast.active_row_bg
    }:1</small></p>
  <p class="row" style="background:${
    t.herdr.companion.selection_bg
  }">› Navigate to agent <small>${
      t.herdr.contrast.selection_bg
    }:1</small></p>
  </article>`
  })
  .join('')
const tables = inventory.themes
  .map(
    (t) =>
      `<details><summary>${escape(
        t.name
      )} · all 30 Ghostty values + 3 companion values</summary><p>SHA-256 (LF): ${
        t.sha256LF
      }. VS Code baseline unchanged: ${
        t.vscode.unchanged
      }.</p><table><thead><tr><th>Field</th><th>Value</th><th>Swatch</th></tr></thead><tbody>${Object.entries(
        {
          ...t.colors,
          ...Object.fromEntries(
            Object.entries(t.herdr.companion).map(([key, val]) => [
              'herdr.' + key,
              val,
            ])
          ),
        }
      )
        .map(
          ([key, value]) =>
            `<tr><td>${escape(
              key
            )}</td><td>${value}</td><td style="background:${value}"></td></tr>`
        )
        .join('')}</tbody></table></details>`
  )
  .join('')
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><title>Aura Ghostty resolved color review</title><style>
body{font:15px system-ui;margin:28px;background:#e7e8ec;color:#242631}h1{font-size:26px}h2{font-size:17px;margin-top:0}p{line-height:1.6}small{font-size:12px}header{max-width:1100px}.grid{display:grid;grid-template-columns:repeat(3,minmax(300px,1fr));gap:18px}article{padding:20px;border-radius:8px}article p{font:14px/1.7 ui-monospace,monospace}article span{padding:2px}.ansi{font:13px/1.8 ui-monospace,monospace;display:grid;grid-template-columns:repeat(8,1fr)}.row{padding:3px 8px;margin:5px 0}.row small{float:right}details{background:white;margin:14px 0;padding:16px}summary{cursor:pointer}table{border-collapse:collapse;width:100%;max-width:900px}td,th{text-align:left;padding:6px;border:1px solid #ddd}td:last-child{width:90px}@media(max-width:1000px){.grid{grid-template-columns:repeat(2,minmax(280px,1fr))}}
</style><header><h1>Aura Modern · Ghostty color review</h1><p><strong>Decoded configuration specimens — not actual Ghostty or Herdr screenshots.</strong> All nine current themes and every generated color are included below. Text specimens show source colors without terminal bold/dim, user contrast settings or runtime app overrides. Ratios describe individual pairs, not an aesthetic score.</p><p>Herdr rows compare its default ANSI 8 background with optional compiled list roles. Actual interaction rendering, platform titlebars and palette refresh still need runtime review.</p></header><section class="grid">${cards}</section>${tables}</html>`
fs.mkdirSync(out, { recursive: true })
fs.writeFileSync(
  path.join(out, 'resolved-ghostty.json'),
  JSON.stringify(inventory, null, 2) + '\n'
)
fs.writeFileSync(path.join(out, 'resolved-ghostty.html'), html)
console.log(
  JSON.stringify(
    inventory.themes.map((t) => ({
      name: t.name,
      colors: Object.keys(t.colors).length,
      contrast: t.contrast,
      herdr: t.herdr.contrast,
      unchangedVSCode: t.vscode.unchanged,
    })),
    null,
    2
  )
)
