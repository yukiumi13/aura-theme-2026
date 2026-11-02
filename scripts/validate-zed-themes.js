const fs = require('fs')
const path = require('path')
const assert = require('assert')
const root = path.resolve(__dirname, '..')
const contract = require('../docs/zed-theme-contract.json')
const dir = path.join(root, 'packages/zed/themes')
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'))
assert.strictEqual(files.length, 9, 'Expected the nine modern themes only')
const names = new Set()
const hex = /^#[0-9a-f]{6}([0-9a-f]{2})?$/i
const color = (value, label) =>
  assert(hex.test(value), `${label}: invalid color ${value}`)
for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'))
  assert.strictEqual(data.themes.length, 1)
  const t = data.themes[0],
    s = t.style
  assert(!names.has(t.name), `Duplicate ${t.name}`)
  names.add(t.name)
  assert(['light', 'dark'].includes(t.appearance))
  assert.strictEqual(s['background.appearance'], 'opaque')
  assert.deepStrictEqual(
    Object.keys(s).sort(),
    [...contract.colorFields, ...contract.nonColorFields].sort(),
    `${t.name}: unknown or missing field`
  )
  for (const key of contract.colorFields) color(s[key], `${t.name}/${key}`)
  assert.strictEqual(s['border.transparent'].slice(7), '00')
  assert.strictEqual(s.accents.length, 8)
  s.accents.forEach((v) => color(v, 'accent'))
  assert.strictEqual(s.players.length, 8)
  for (const p of s.players)
    for (const k of ['cursor', 'background', 'selection'])
      color(p[k], `player/${k}`)
  for (const k of contract.builtinSyntax)
    assert(s.syntax[k], `Missing built-in syntax ${k}`)
  for (const [k, v] of Object.entries(s.syntax)) {
    color(v.color, `syntax/${k}`)
    color(v.background_color, `syntax background/${k}`)
    assert(['normal', 'italic', 'oblique'].includes(v.font_style))
    assert(
      [100, 200, 300, 400, 500, 600, 700, 800, 900].includes(v.font_weight)
    )
  }
  const settings = require('../packages/zed/semantic-token-settings.json')
  for (const rule of settings.global_lsp_settings.semantic_token_rules) {
    for (const name of rule.style || [])
      assert(s.syntax[name], `Missing semantic style ${name}`)
  }
}
console.log(
  `Validated ${files.length} themes: ${contract.colorFields.length} scalar colors each; complete pinned fields, syntax and semantic rules.`
)
