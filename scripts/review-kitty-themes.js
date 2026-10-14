// Decoded configuration specimens, not Kitty or macOS runtime screenshots.
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const root = path.resolve(__dirname, '..')
const dir = path.join(root, 'packages/kitty')
const out = path.join(root, 'docs/reviews')
const { contributes } = JSON.parse(
  fs.readFileSync(path.join(root, 'packages/vscode/package.json'), 'utf8')
)

function decode(text) {
  const values = {}
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue
    const match = line.match(/^(\w+)\s+(.+)$/)
    if (!match || match[1] in values)
      throw Error(`Invalid or repeated field: ${line}`)
    values[match[1]] = match[2]
  }
  return values
}

function luminance(hex) {
  const c = [1, 3, 5].map((i) => {
    const value = parseInt(hex.slice(i, i + 2), 16) / 255
    return value <= 0.04045
      ? value / 12.92
      : ((value + 0.055) / 1.055) ** 2.4
  })
  return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722
}

function contrast(a, b) {
  const [low, high] = [luminance(a), luminance(b)].sort((x, y) => x - y)
  return Number(((high + 0.05) / (low + 0.05)).toFixed(2))
}

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
const styleFile = 'styles/aura-ui.conf'
const styleText = fs.readFileSync(path.join(dir, styleFile), 'utf8')
const hash = (text) => crypto.createHash('sha256').update(text).digest('hex')
const themes = contributes.themes.map(({ label }) => {
  const file = label.toLowerCase().replace(/ /g, '-') + '.conf'
  const text = fs.readFileSync(path.join(dir, file), 'utf8')
  const colors = decode(text)
  for (const color of Object.values(colors)) {
    if (!/^#[0-9a-f]{6}$/i.test(color))
      throw Error(`Unresolved color in ${file}: ${color}`)
  }
  return {
    name: label,
    file,
    sha256: hash(text),
    colors,
    contrast: {
      body: contrast(colors.foreground, colors.background),
      cursor: contrast(colors.cursor_text_color, colors.cursor),
      selection: contrast(
        colors.selection_foreground,
        colors.selection_background
      ),
      activeTab: contrast(
        colors.active_tab_foreground,
        colors.active_tab_background
      ),
      inactiveTab: contrast(
        colors.inactive_tab_foreground,
        colors.inactive_tab_background
      ),
      url: contrast(colors.url_color, colors.background),
    },
  }
})
const review = {
  kind: 'Decoded configuration review, not runtime screenshots or visual approval',
  style: {
    file: styleFile,
    sha256: hash(styleText),
    settings: decode(styleText),
  },
  themes,
}
const cards = themes
  .map(
    ({ name, colors: c, contrast: ratios }) => `<article><h2>${escape(
      name
    )}</h2>
<div class="tabs" style="background:${
      c.tab_bar_background
    }"><span style="background:${c.active_tab_background};color:${
      c.active_tab_foreground
    }">1: project</span><span style="background:${
      c.inactive_tab_background
    };color:${c.inactive_tab_foreground}">2: tests</span></div>
<pre style="background:${c.background};color:${c.foreground};border-color:${
      c.active_border_color
    }">source → roles → Kitty
<span style="color:${c.color2}">✓ compiled</span>  <span style="color:${
      c.color3
    }">warning</span>  <span style="color:${c.color1}">error</span>
<span style="color:${
      c.url_color
    };text-decoration:underline">README.md</span>  <span style="background:${
      c.cursor
    };color:${c.cursor_text_color}">▌</span>
<span style="background:${c.selection_background};color:${
      c.selection_foreground
    }">selected reading text</span></pre>
<p>Contrast observations: ${escape(JSON.stringify(ratios))}</p>
<details><summary>Every resolved field (${
      Object.keys(c).length
    })</summary><table>${Object.entries(c)
      .map(
        ([key, value]) =>
          `<tr><td>${escape(
            key
          )}</td><td><i style="background:${value}"></i>${escape(
            value
          )}</td></tr>`
      )
      .join('')}</table></details></article>`
  )
  .join('\n')
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><title>Aura Kitty resolved configuration review</title>
<style>body{font:14px system-ui;margin:24px;background:#eee;color:#222}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:20px}article{background:white;padding:16px;border-radius:8px}h2{font-size:18px}.tabs{padding:8px;display:flex;gap:8px;font:14px monospace}.tabs span{padding:4px 8px;font-weight:normal}pre{margin:0;padding:16px;border:1px solid;line-height:1.8}table{width:100%;font:12px monospace}td{padding:4px}i{display:inline-block;width:18px;height:18px;margin-right:8px;vertical-align:middle}p{overflow-wrap:anywhere}</style>
<h1>Aura Modern · Kitty configuration review</h1><p><strong>Configuration specimens, not actual Kitty or macOS screenshots.</strong> Tabs are illustrations of the resolved color relationships; their CSS geometry does not simulate Kitty's cell renderer. All nine themes and every field are decoded below. Contrast observations are diagnostics; accepted Aqua/Lime white-on-cyan active controls intentionally retain soft contrast. OS font rendering, titlebars and interaction states require runtime review.</p><main>${cards}</main></html>`
fs.mkdirSync(out, { recursive: true })
fs.writeFileSync(
  path.join(out, 'resolved-kitty.json'),
  JSON.stringify(review, null, 2) + '\n'
)
fs.writeFileSync(path.join(out, 'resolved-kitty.html'), html)
console.log(
  JSON.stringify(
    themes.map(({ name, contrast }) => ({ name, contrast })),
    null,
    2
  )
)
