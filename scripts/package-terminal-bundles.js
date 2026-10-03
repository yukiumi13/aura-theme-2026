const path = require('path')
const fs = require('fs/promises')
const { constants } = require('fs')
const AdmZip = require('adm-zip')

async function exists(filePath) {
  try {
    await fs.access(filePath, constants.F_OK)
    return true
  } catch {
    return false
  }
}

async function bundlePort({ rootDir, sourceName, bundleName }) {
  const sourceDir = path.join(rootDir, 'packages', sourceName)
  const outputDir = path.join(rootDir, 'dist', sourceName)
  const zipFile = path.join(outputDir, `${bundleName}.zip`)
  const licenseFile = path.join(rootDir, 'LICENSE')

  if (!(await exists(sourceDir))) {
    throw new Error(
      `Terminal theme source directory not found: ${sourceDir}`
    )
  }

  await fs.mkdir(outputDir, { recursive: true })
  const zip = new AdmZip()
  zip.addLocalFolder(sourceDir, bundleName)

  if (await exists(licenseFile)) {
    zip.addLocalFile(licenseFile, bundleName)
  }

  zip.writeZip(zipFile)
  console.log(
    `${sourceName} themes zip created at: ${path.relative(rootDir, zipFile)}`
  )
}

async function main() {
  const rootDir = path.resolve(__dirname, '..')

  const ports = ['ghostty', 'windows-terminal', 'wezterm']
  const args = process.argv.slice(2)
  if (
    args.length &&
    (args.length !== 2 || args[0] !== '--only' || !ports.includes(args[1]))
  ) {
    throw new Error(
      'Usage: package-terminal-bundles.js [--only ghostty|windows-terminal|wezterm]'
    )
  }
  for (const sourceName of args.length ? [args[1]] : ports) {
    await bundlePort({
      rootDir,
      sourceName,
      bundleName: `aura-theme-2026-${sourceName}-themes`,
    })
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
