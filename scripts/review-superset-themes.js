// Full resolved-color inventory and configuration specimens. This is not a
// screenshot of Superset, its native editor, or its Electron compositor.
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const assert = require('assert')
const root = path.resolve(__dirname, '..')
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')
const contract = JSON.parse(read('docs/superset-theme-contract.json'))
const packText = read('packages/superset/aura-theme-2026.json')
const pack = JSON.parse(packText)
const hash = (text) => crypto.createHash('sha256').update(text).digest('hex')
const groups = (t) => ({
  ui: t.ui,
  terminal: t.terminal,
  'editor.colors': t.editor.colors,
  'editor.syntax': t.editor.syntax,
})
function over(foreground, background) {
  const alpha =
    foreground.length === 9 ? parseInt(foreground.slice(7), 16) / 255 : 1
  return (
    '#' +
    [1, 3, 5]
      .map((i) =>
        Math.round(
          parseInt(foreground.slice(i, i + 2), 16) * alpha +
            parseInt(background.slice(i, i + 2), 16) * (1 - alpha)
        )
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
  )
}
function luminance(hex) {
  const c = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722
}
function contrast(ink, fill) {
  const pair = [luminance(over(ink, fill)), luminance(fill)].sort(
    (a, b) => a - b
  )
  return Number(((pair[1] + 0.05) / (pair[0] + 0.05)).toFixed(2))
}
const themes = pack.themes.map((theme) => {
  const file = `packages/superset/${theme.id}.json`
  const text = read(file)
  assert.deepStrictEqual(JSON.parse(text), theme)
  for (const [name, colors] of Object.entries(groups(theme))) {
    assert.deepStrictEqual(
      Object.keys(colors).sort(),
      [...contract.groups[name]].sort(),
      `${theme.id}: ${name} coverage`
    )
    for (const value of Object.values(colors))
      assert.match(value, /^#[\da-f]{6}([\da-f]{2})?$/i)
  }
  const u = theme.ui,
    e = theme.editor.colors,
    t = theme.terminal
  return {
    ...theme,
    file,
    sha256: hash(text),
    contrast: {
      body: contrast(u.foreground, u.background),
      hover: contrast(u.accentForeground, over(u.accent, u.background)),
      sidebarSelection: contrast(
        u.sidebarAccentForeground,
        over(u.sidebarAccent, u.sidebar)
      ),
      primary: contrast(u.primaryForeground, u.primary),
      badge: contrast(u.highlightForeground, u.highlight),
      primaryLinkOnCanvas: contrast(u.primary, u.background),
      comment: contrast(theme.editor.syntax.comment, e.background),
      terminal: contrast(t.foreground, t.background),
      terminalSelection: contrast(
        t.selectionForeground,
        t.selectionBackground
      ),
      terminalCursor: contrast(t.cursorAccent, t.cursor),
    },
  }
})
const review = {
  kind: 'Configuration specimens, not native Superset screenshots or visual approval',
  reference: contract,
  packSha256: hash(packText),
  packBytes: Buffer.byteLength(packText),
  themes,
}
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
const inventory = themes
  .map(
    (t) =>
      `<details><summary>${esc(t.name)} — 101 fields · ${t.sha256.slice(
        0,
        12
      )}</summary>${Object.entries(groups(t))
        .map(
          ([g, cs]) =>
            `<h3>${g}</h3><table>${Object.entries(cs)
              .map(
                ([k, v]) =>
                  `<tr><td>${k}</td><td><i style="background:${v}"></i>${v}</td></tr>`
              )
              .join('')}</table>`
        )
        .join('')}</details>`
  )
  .join('')
const samples = {
  TSX: '<span class="comment">// fictional workspace · explicit syntax role specimens</span>\n<span class="keyword">export function</span> <span class="functionCall">Workspace</span>(label: <span class="typeName">string</span>) {\n  <span class="keyword">const</span> count = <span class="number">12</span>\n  <span class="keyword">return</span> &lt;<span class="tagName">button</span> <span class="attributeName">title</span>=<span class="string">"Review"</span>&gt;{label}&lt;/<span class="tagName">button</span>&gt;\n}',
  CSS: '<span class="comment">/* representative selector/property/string/number roles */</span>\n<span class="className">.workspace</span> {\n  <span class="attributeName">display</span>: <span class="constant">grid</span>;\n  <span class="attributeName">gap</span>: <span class="number">12px</span>;\n  <span class="attributeName">font-family</span>: <span class="string">"Monospace"</span>;\n}',
  'JSON / TOML':
    '<span class="comment"># fictional settings — no user data</span>\n<span class="attributeName">workspace</span> = <span class="string">"fictional-project"</span>\n<span class="attributeName">workers</span> = <span class="number">3</span>\n<span class="attributeName">enabled</span> = <span class="constant">true</span>\n{ <span class="attributeName">"target"</span>: <span class="string">"local"</span> }',
  Markdown:
    '<span class="keyword"># Project review</span>\n\n<span class="comment">A fictional note for palette review.</span>\n<span class="keyword">-</span> Inspect <span class="string">`theme.json`</span> and the terminal\n<span class="keyword">-</span> Keep <span class="constant">status</span> separate from selection\n<span class="tagName">[Documentation]</span>(<span class="string">docs/README.md</span>)',
}
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><title>Aura Superset resolved configuration review</title>
<style>
*{box-sizing:border-box}body{font:14px system-ui;margin:24px;background:#eee;color:#222}h1{font-size:26px}header{max-width:1100px}header p{line-height:1.6}select{padding:8px;font:inherit}#specimen{margin:24px 0;background:var(--ui-background);color:var(--ui-foreground);border:1px solid var(--ui-border);border-radius:10px;overflow:hidden;max-width:1260px}.title{padding:12px 18px;background:var(--ui-tertiary);border-bottom:1px solid var(--ui-border);display:flex;justify-content:space-between}.layout{display:grid;grid-template-columns:210px 1fr}.sidebar{padding:16px 12px;background:var(--ui-sidebar);color:var(--ui-sidebarForeground);border-right:1px solid var(--ui-sidebarBorder)}.row{padding:10px;margin:5px 0;border-radius:5px}.row:hover,.selected{background:var(--ui-sidebarAccent);color:var(--ui-sidebarAccentForeground)}.muted{color:var(--ui-mutedForeground)}.badge{background:var(--ui-highlight);color:var(--ui-highlightForeground);border-radius:4px;padding:2px 6px}.body{padding:18px}.controls{display:flex;flex-wrap:wrap;gap:10px;align-items:center}button,input{font:inherit;border-radius:5px;padding:8px 12px}button{cursor:pointer;border:1px solid transparent}button:focus-visible,input:focus{outline:3px solid color-mix(in srgb,var(--ui-ring) 50%,transparent);outline-offset:1px}.primary{background:var(--ui-primary);color:var(--ui-primaryForeground)}.primary:hover,.primary.hover{background:color-mix(in srgb,var(--ui-primary) 90%,transparent)}.secondary{background:var(--ui-secondary);color:var(--ui-secondaryForeground)}.secondary:hover{background:color-mix(in srgb,var(--ui-secondary) 80%,transparent)}.ghost{background:transparent;color:var(--ui-foreground)}.ghost:hover,.ghost.hover{background:var(--ui-accent);color:var(--ui-accentForeground)}button:disabled{opacity:.5;pointer-events:none}input{background:transparent;color:var(--ui-foreground);border:1px solid var(--ui-input);width:180px}.link{color:var(--ui-primary);text-decoration:underline}.cards{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:18px 0}.card{background:var(--ui-card);color:var(--ui-cardForeground);padding:14px;border:1px solid var(--ui-border);border-radius:6px}.popover{background:var(--ui-popover);color:var(--ui-popoverForeground);padding:12px;border:1px solid var(--ui-border);border-radius:6px}.menuitem{padding:6px}.menuitem:hover{background:var(--ui-accent);color:var(--ui-accentForeground)}.notice{padding:8px;margin:8px 0;border-left:3px solid}.warning{background:color-mix(in srgb,var(--ui-warning) 10%,transparent);color:var(--ui-warning)}.success{color:var(--ui-success)}.destructive{color:var(--ui-destructive)}.workspace{display:grid;grid-template-columns:1.2fr 1fr;gap:16px}.editor{background:var(--editor-colors-background);color:var(--editor-colors-foreground);border:1px solid var(--editor-colors-border);padding:12px;overflow:auto}.editor pre{line-height:1.7;margin:10px 0;min-height:150px}.selection{background:var(--editor-colors-selection)}.search{background:var(--editor-colors-search)}.search-active{background:var(--editor-colors-searchActive)}.line{background:var(--editor-colors-activeLine)}.added{background:color-mix(in srgb,var(--editor-colors-addition) 10%,var(--editor-colors-background))}.removed{background:color-mix(in srgb,var(--editor-colors-deletion) 10%,var(--editor-colors-background))}.added b{color:var(--editor-colors-addition)}.removed b{color:var(--editor-colors-deletion)}.terminal{background:var(--terminal-background);color:var(--terminal-foreground);padding:14px;font:13px/1.8 monospace;border:1px solid var(--ui-border)}.terminal .selection{background:var(--terminal-selectionBackground);color:var(--terminal-selectionForeground)}.cursor{background:var(--terminal-cursor);color:var(--terminal-cursorAccent)}.ansi{display:grid;grid-template-columns:repeat(8,1fr);margin-top:10px}.ansi span{padding:6px}#metrics{max-width:1260px;font:12px monospace;line-height:1.6;white-space:pre-wrap}details{background:white;padding:12px;margin:12px 0;max-width:1260px}summary{cursor:pointer}table{border-collapse:collapse;width:100%;font:12px monospace}td{border-bottom:1px solid #ddd;padding:5px}i{display:inline-block;vertical-align:middle;width:22px;height:18px;margin-right:12px;border:1px solid #aaa}#series{display:flex;gap:6px;margin-top:10px}#series span{height:16px;flex:1}
</style>
<header><h1>Aura Modern · Superset configuration review</h1><p><strong>Configuration specimens, not screenshots of Superset.</strong> All nine themes and all 101 color fields are decoded. The controls below approximate documented native CSS token relationships; syntax is labelled role specimens, not grammar evaluation. The app may use hard-coded colors, opacity and different layout. The diff rows illustrate a 10% status overlay; Pierre controls actual native overlay strength. No visual approval is implied.</p><label>Theme <select id="theme"></select></label> <label>Syntax specimen <select id="language">${Object.keys(
  samples
)
  .map((k) => `<option>${k}</option>`)
  .join('')}</select></label></header>
<section id="specimen"><div class="title"><span id="theme-name"></span><span class="muted">fictional-project · local</span></div><div class="layout"><aside class="sidebar"><b>Workspaces</b><div class="row selected">◉ theme-port <span class="badge">3</span></div><div class="row">◌ baseline</div><div class="row">◌ tests</div><p class="muted">Hover unselected rows.<br>Tab to test focus.</p><p class="success">✓ Connected</p><p class="destructive">× Failed check</p></aside><div class="body"><div class="controls"><button class="primary">Review changes</button><button class="primary hover">Hover</button><button class="primary" disabled>Disabled</button><button class="secondary">Secondary</button><button class="ghost hover">⌕ Hover icon</button><input aria-label="Find" placeholder="Find a file"><a class="link" href="#specimen">Native link token</a></div><div class="cards"><div class="card"><b>Review queue</b><p class="muted">Cards recede beneath the editor and floating menu.</p><div class="notice warning">⚠ Needs attention</div><div id="series"></div></div><div class="popover"><b>Command menu / notification surface</b><div class="menuitem">Open theme source</div><div class="menuitem">Inspect generated configuration</div><div class="menuitem muted">Unavailable command</div></div></div><div class="workspace"><div class="editor"><b>Syntax role specimens</b><pre id="code"></pre><div class="line">Active line · <span class="selection">selection</span> · <span class="search">match</span> · <span class="search-active">active match</span></div><pre><div class="removed"><b>−</b> old value</div><div class="added"><b>+</b> new value <span class="selection">selected text</span></div></pre></div><div class="terminal"><span style="color:var(--terminal-green)">✓ build completed</span><br><span style="color:var(--terminal-yellow)">warning: fictional example</span><br><span style="color:var(--terminal-red)">error: demonstration only</span><br><span class="selection">selected terminal text</span><br>$ review <span class="cursor">▌</span><div class="ansi" id="ansi"></div></div></div></div></div></section><pre id="metrics"></pre><h2>Complete resolved inventory</h2>${inventory}
<script>
const themes=${JSON.stringify(themes).replace(
  /</g,
  '\\u003c'
)};const samples=${JSON.stringify(samples).replace(
  /</g,
  '\\u003c'
)};const picker=document.querySelector('#theme');for(const t of themes)picker.add(new Option(t.name,t.id));
function apply(){const t=themes.find(t=>t.id===picker.value)||themes[0];const s=document.querySelector('#specimen').style;for(const [group,cs] of Object.entries({ui:t.ui,terminal:t.terminal,'editor-colors':t.editor.colors,'editor-syntax':t.editor.syntax}))for(const [k,v] of Object.entries(cs))s.setProperty('--'+group+'-'+k,v);for(const k of Object.keys(t.editor.syntax)){let style=document.getElementById('syntax-'+k);if(!style){style=document.createElement('style');style.id='syntax-'+k;document.head.append(style)}style.textContent='.editor .'+k+'{color:var(--editor-syntax-'+k+')}'}document.querySelector('#theme-name').textContent=t.name;document.querySelector('#code').innerHTML=samples[document.querySelector('#language').value];document.querySelector('#series').innerHTML=[1,2,3,4,5].map(i=>'<span style="background:'+t.ui['chart'+i]+'"></span>').join('');document.querySelector('#ansi').innerHTML=Object.entries(t.terminal).slice(6).map(([k,v])=>'<span style="color:'+v+'">Aa</span>').join('');document.querySelector('#metrics').textContent='Diagnostic contrast (not aesthetic scores): '+JSON.stringify(t.contrast,null,2)+'\\nSHA-256: '+t.sha256;location.hash=t.id;document.documentElement.dataset.theme=t.id;}
picker.value=location.hash.slice(1)||'aura-aqua-light';picker.onchange=apply;document.querySelector('#language').onchange=apply;apply();
</script></html>`
fs.mkdirSync(path.join(root, 'docs/reviews'), { recursive: true })
fs.writeFileSync(
  path.join(root, 'docs/reviews/resolved-superset.json'),
  JSON.stringify(review, null, 2) + '\n'
)
fs.writeFileSync(
  path.join(root, 'docs/reviews/resolved-superset.html'),
  html
)
console.log(
  JSON.stringify(
    themes.map((t) => ({
      name: t.name,
      sha256: t.sha256,
      contrast: t.contrast,
    })),
    null,
    2
  )
)
