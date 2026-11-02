/* Resolved configuration specimens. No native editor or grammar rendering claim. */
const fs = require('fs'),
  path = require('path'),
  crypto = require('crypto')
const root = path.resolve(__dirname, '..'),
  out = path.join(root, 'docs/reviews')
const contract = require('../docs/zed-theme-contract.json')
const mapping = require('../docs/zed-theme-mapping.json')
const esc = (s) =>
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
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const over = (h, b) => {
  const a = h.length === 9 ? parseInt(h.slice(7), 16) / 255 : 1
  return rgb(h).map((v, i) => v * a + b[i] * (1 - a))
}
const lum = (v) =>
  v
    .map((x) => x / 255)
    .map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4))
    .reduce((s, x, i) => s + x * [0.2126, 0.7152, 0.0722][i], 0)
const ratio = (h, b) => {
  const a = lum(over(h, b)),
    c = lum(b)
  return +((Math.max(a, c) + 0.05) / (Math.min(a, c) + 0.05)).toFixed(2)
}
const pairs = [
  ['Normal', 'text', 'element.background'],
  ['Hover', 'text', 'element.hover'],
  ['Pressed', 'text', 'element.active'],
  ['Selected', 'text.accent', 'element.selected'],
  ['Ghost hover', 'icon', 'ghost_element.hover'],
  ['Active tab', 'text', 'tab.active_background'],
  ['Inactive tab', 'text.muted', 'tab.inactive_background'],
  ['Disabled', 'text.disabled', 'element.disabled'],
  ['Tinted action', 'text', 'info.background'],
  ['Notification', 'text', 'elevated_surface.background'],
  ['Normal mode', 'vim.normal.foreground', 'vim.normal.background'],
  ['Insert mode', 'vim.insert.foreground', 'vim.insert.background'],
]
const themes = fs
  .readdirSync(path.join(root, 'packages/zed/themes'))
  .filter((f) => f.endsWith('.json'))
  .map((file) => {
    const bytes = fs.readFileSync(
        path.join(root, 'packages/zed/themes', file)
      ),
      t = JSON.parse(bytes).themes[0],
      s = t.style
    const parent = rgb(s['panel.background']),
      editor = rgb(s['editor.background'])
    const states = pairs.map(([name, fg, bg]) => ({
      name,
      foreground: fg,
      background: bg,
      contrast: ratio(s[fg], over(s[bg], parent)),
    }))
    const diff = {}
    for (const [name, line, word] of [
      [
        'added',
        'editor.diff_hunk.added.background',
        'version_control.word_added',
      ],
      [
        'deleted',
        'editor.diff_hunk.deleted.background',
        'version_control.word_deleted',
      ],
    ]) {
      const bg = over(s[word], over(s[line], editor))
      diff[name] = {
        composited:
          '#' +
          bg
            .map((n) => Math.round(n).toString(16).padStart(2, '0'))
            .join(''),
        syntaxContrast: Object.fromEntries(
          Object.entries(s.syntax).map(([k, v]) => [k, ratio(v.color, bg)])
        ),
      }
    }
    return {
      ...t,
      file,
      sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
      states,
      diff,
    }
  })
const token = (s, k, text) =>
  `<span style="color:${s.syntax[k].color};font-style:${
    s.syntax[k].font_style
  };font-weight:${s.syntax[k].font_weight}">${esc(text)}</span>`
const examples = (s) =>
  [
    [
      'TSX',
      token(s, 'keyword', 'export const ') +
        token(s, 'function', 'Card') +
        token(s, 'punctuation', ' = (') +
        token(s, 'variable.parameter', 'count') +
        token(s, 'punctuation', ': ') +
        token(s, 'type', 'number') +
        token(s, 'punctuation', ') => <') +
        token(s, 'tag', 'div') +
        ' ' +
        token(s, 'property', 'title') +
        '=' +
        token(s, 'string', '"Aura"') +
        '>{' +
        token(s, 'variable', 'count') +
        '}</' +
        token(s, 'tag', 'div') +
        '>',
    ],
    [
      'CSS',
      token(s, 'selector', '.card') +
        token(s, 'selector.pseudo', ':hover') +
        ' { ' +
        token(s, 'property', 'opacity') +
        ': ' +
        token(s, 'number', '0.8') +
        '; }',
    ],
    [
      'JSON',
      '{ ' +
        token(s, 'property', '"theme"') +
        ': ' +
        token(s, 'string', '"Aura"') +
        ', ' +
        token(s, 'property', '"enabled"') +
        ': ' +
        token(s, 'boolean', 'true') +
        ' }',
    ],
    [
      'TOML',
      token(s, 'title', '[workspace]') +
        '\n' +
        token(s, 'property', 'members') +
        ' = [' +
        token(s, 'string', '"example"') +
        ']',
    ],
    [
      'Markdown',
      token(s, 'title', '# Example') +
        '\n' +
        token(s, 'emphasis.strong', 'Strong') +
        ' ' +
        token(s, 'text.literal', '`code`') +
        ' ' +
        token(s, 'link_text', '[link]') +
        token(s, 'link_uri', '(https://example.org)'),
    ],
  ]
    .map(
      ([lang, code]) =>
        `<div><small>${lang} · assigned styles</small><pre>${code}</pre></div>`
    )
    .join('')
const specimen = (t) => {
  const s = t.style
  return `<article style="background:${s.background};color:${
    s.text
  };--hover:${s['ghost_element.hover']};--focus:${
    s['border.focused']
  }"><h2>${esc(t.name)}</h2><small>${
    t.appearance
  } · configuration specimen</small><div class="tabs" style="background:${
    s['tab_bar.background']
  }"><span style="background:${
    s['tab.active_background']
  }">example.tsx ×</span><span style="background:${
    s['tab.inactive_background']
  };color:${
    s['text.muted']
  }">notes.md</span></div><div class="workspace"><aside style="background:${
    s['panel.background']
  }">EXPLORER<div class="row">src</div><div class="row" style="background:${
    s['ghost_element.selected']
  };color:${
    s['text.accent']
  }">example.tsx</div><div class="row">package.json</div><div style="color:${
    s['text.disabled']
  }">disabled</div></aside><div class="code" style="background:${
    s['editor.background']
  };color:${s['editor.foreground']}">${examples(
    s
  )}</div></div><div class="states" style="background:${
    s['panel.background']
  }">${pairs
    .map(
      ([name, fg, bg]) =>
        `<button style="background:${s[bg]};color:${s[fg]};border-color:${
          name === 'Selected' ? s['border.selected'] : s['border.variant']
        }">${name}</button>`
    )
    .join('')}</div><div class="diff" style="background:${
    s['editor.background']
  }">${Object.entries(t.diff)
    .map(
      ([k, v]) =>
        `<div style="background:${v.composited}">${token(
          s,
          k === 'added' ? 'diff.plus' : 'diff.minus',
          k === 'added' ? '+ ' : '− '
        )}${token(s, 'keyword', 'const ')}${token(
          s,
          'variable',
          'value'
        )} = ${token(s, 'number', '42')}</div>`
    )
    .join('')}</div><div class="terminal" style="background:${
    s['terminal.background']
  };color:${s['terminal.foreground']}">$ build example ${[
    'red',
    'green',
    'yellow',
    'blue',
    'magenta',
    'cyan',
  ]
    .map(
      (c) => `<span style="color:${s['terminal.ansi.' + c]}"> ${c}</span>`
    )
    .join('')}</div></article>`
}
const table = (t) => {
  const s = t.style
  return `<details><summary>${esc(t.name)} · all ${
    contract.colorFields.length
  } colors, ${
    Object.keys(s.syntax).length
  } syntax styles, players and accents</summary><p>SHA-256 ${
    t.sha256
  }</p><table><tr><th>Token</th><th>Resolved value</th><th>Shared role</th></tr>${contract.colorFields
    .map(
      (k) =>
        `<tr><td>${k}</td><td><i style="background:${s[k]}"></i>${s[k]}</td><td>${mapping.colorRoles[k]}</td></tr>`
    )
    .join('')}</table><pre>${esc(
    JSON.stringify(
      {
        syntax: s.syntax,
        players: s.players,
        accents: s.accents,
        states: t.states,
        diff: t.diff,
      },
      null,
      2
    )
  )}</pre></details>`
}
const html = `<!doctype html><meta charset="utf-8"><title>Aura Zed resolved review</title><style>body{margin:24px;background:#e8eaed;color:#26313b;font:14px system-ui}h1{margin:0}h2{font-size:18px;margin:0 0 8px}.gallery{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin:20px 0}article{padding:16px;border-radius:8px;overflow:hidden}small{opacity:.7}.tabs{display:flex;margin-top:14px}.tabs span{padding:9px}.workspace{display:flex;min-height:260px}aside{width:100px;flex-shrink:0;padding:12px 4px;font-size:11px}.row{padding:7px 3px}.row:hover{background:var(--hover)}.code{padding:12px;overflow:auto}.code pre{font:11px/1.6 monospace;margin:4px 0 9px;white-space:pre-wrap}.states{display:flex;flex-wrap:wrap;gap:5px;padding:10px 5px}button{border:1px solid;border-radius:4px;padding:5px 7px;font:11px system-ui}button:focus-visible{outline:2px solid var(--focus);outline-offset:2px}.diff,.terminal{padding:10px;font:11px/1.6 monospace}.diff>div{padding:4px}.terminal{white-space:pre-wrap}details{padding:12px;background:white;margin:10px 0}table{border-collapse:collapse;width:100%}td,th{border-bottom:1px solid #ddd;padding:5px;text-align:left;font:12px monospace}i{display:inline-block;width:26px;height:18px;vertical-align:middle;margin-right:8px;border:1px solid #aaa}details pre{white-space:pre-wrap;font:11px monospace}@media(max-width:900px){.gallery{grid-template-columns:1fr}}</style><h1>Aura Modern · Zed resolved review</h1><p>Configuration specimens, not native Zed screenshots. Layout and syntax spans are illustrative. Hover the Explorer rows; tab to controls to inspect focus.</p><p>9 themes · ${
  contract.colorFields.length
} explicit scalar colors each · upstream ${contract.upstreamCommit.slice(
  0,
  12
)}. Expand the complete configuration inventory below.</p><div class="gallery">${themes
  .map(specimen)
  .join('')}</div>${themes.map(table).join('')}`
fs.writeFileSync(
  path.join(out, 'resolved-zed.json'),
  JSON.stringify({ contract, themes }, null, 2) + '\n'
)
fs.writeFileSync(path.join(out, 'resolved-zed.html'), html)
console.log(
  themes.map((t) => ({
    name: t.name,
    colors: contract.colorFields.length,
    syntax: Object.keys(t.style.syntax).length,
    minOrdinaryState: Math.min(
      ...t.states
        .filter(
          (s) => !['Disabled', 'Insert mode', 'Normal mode'].includes(s.name)
        )
        .map((s) => s.contrast)
    ),
  }))
)
