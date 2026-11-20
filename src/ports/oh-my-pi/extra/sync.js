import { createHash, randomUUID } from 'node:crypto'
import { constants } from 'node:fs'
import {
  copyFile,
  lstat,
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from 'node:fs/promises'
import { join } from 'node:path'

const checksum = (data) => createHash('sha256').update(data).digest('hex')

async function ifPresent(operation) {
  try {
    return await operation()
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
    return null
  }
}

async function replace(path, data) {
  const tmp = path + '.' + randomUUID() + '.tmp'
  try {
    await writeFile(tmp, data, { flag: 'wx' })
    await rename(tmp, path)
  } finally {
    await rm(tmp, { force: true })
  }
}

// OMP discovers JSON files in the active profile. Keep user edits and symlinks
// intact. Per-file receipts let a later plugin version refresh its own copies.
export async function syncThemes(source, directory) {
  const receipts = join(directory, '.aura-modern')
  await mkdir(receipts, { recursive: true })
  const conflicts = []
  for (const name of await readdir(source)) {
    if (!/^aura-[a-z-]+\.json$/.test(name)) continue
    const src = join(source, name)
    const dst = join(directory, name)
    const receipt = join(receipts, name + '.sha256')
    const bytes = await readFile(src)
    const next = checksum(bytes)
    const previous = await ifPresent(() => readFile(receipt, 'utf8'))
    let created = false
    let stat = await ifPresent(() => lstat(dst))
    if (!stat) {
      try {
        await copyFile(src, dst, constants.COPYFILE_EXCL)
        created = true
      } catch (error) {
        if (error.code !== 'EEXIST') throw error
      }
      stat = await lstat(dst)
    }
    const current = stat.isFile() ? checksum(await readFile(dst)) : null
    if (!created && previous === null && current === next) continue
    if (current === null || (current !== next && current !== previous)) {
      conflicts.push(name)
      continue
    }
    if (current !== next) await replace(dst, bytes)
    if (previous !== next) await replace(receipt, next)
  }
  return conflicts
}
