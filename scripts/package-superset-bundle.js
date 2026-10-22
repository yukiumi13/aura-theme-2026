const fs = require('fs')
const path = require('path')
const AdmZip = require('adm-zip')
const root = path.resolve(__dirname, '..')
const name = 'aura-theme-2026-superset-themes'
const output = path.join(root, 'dist/superset', `${name}.zip`)
const pack = JSON.parse(
  fs.readFileSync(
    path.join(root, 'packages/superset/aura-theme-2026.json'),
    'utf8'
  )
)
if (!pack.themes?.length)
  throw Error('Build the Superset port before packaging')
fs.mkdirSync(path.dirname(output), { recursive: true })
const zip = new AdmZip()
zip.addLocalFolder(path.join(root, 'packages/superset'), name)
zip.addLocalFile(path.join(root, 'LICENSE'), name)
zip.writeZip(output)
console.log(path.relative(root, output))
