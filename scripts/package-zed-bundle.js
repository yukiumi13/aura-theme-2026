const path = require('path')
const fs = require('fs/promises')
const { constants } = require('fs')
const { execFile } = require('child_process')

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    execFile(command, args, options, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr || stdout || error.message))
        return
      }

      resolve({ stdout, stderr })
    })
  })
}

async function exists(filePath) {
  try {
    await fs.access(filePath, constants.F_OK)
    return true
  } catch {
    return false
  }
}

async function main() {
  const rootDir = path.resolve(__dirname, '..')
  const sourceDir = path.join(rootDir, 'packages', 'zed')
  const outputDir = path.join(rootDir, 'dist', 'zed')
  const bundleName = 'aura-theme-2026-zed-extension'
  const stagedDir = path.join(outputDir, bundleName)
  const zipFile = path.join(outputDir, `${bundleName}.zip`)
  const licenseFile = path.join(rootDir, 'LICENSE')

  if (!(await exists(sourceDir))) {
    throw new Error(`Zed extension source directory not found: ${sourceDir}`)
  }

  await fs.rm(outputDir, { force: true, recursive: true })
  await fs.mkdir(outputDir, { recursive: true })
  await fs.cp(sourceDir, stagedDir, { recursive: true })

  if (await exists(licenseFile)) {
    await fs.copyFile(licenseFile, path.join(stagedDir, 'LICENSE'))
  }

  await run('zip', ['-rq', zipFile, bundleName], { cwd: outputDir })

  console.log(`Zed extension folder staged at: ${path.relative(rootDir, stagedDir)}`)
  console.log(`Zed extension zip created at: ${path.relative(rootDir, zipFile)}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
