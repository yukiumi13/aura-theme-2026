import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, rm, stat, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { syncThemes } from '../../../../packages/oh-my-pi/sync.js'

const root = await mkdtemp(join(tmpdir(), 'omp-aura-profile-'))
const source = join(root, 'source')
const profile = join(root, 'themes')
const name = 'aura-light.json'
const src = join(source, name)
const dst = join(profile, name)
try {
  await mkdir(source)
  await writeFile(src, 'first')
  assert.deepEqual(await syncThemes(source, profile), [])
  const created = await stat(dst)
  assert.deepEqual(await syncThemes(source, profile), [])
  assert.equal((await stat(dst)).mtimeMs, created.mtimeMs)
  await writeFile(src, 'second')
  assert.deepEqual(await syncThemes(source, profile), [])
  assert.equal(await readFile(dst, 'utf8'), 'second')
  await writeFile(dst, 'mine')
  assert.deepEqual(await syncThemes(source, profile), [name])
  assert.equal(await readFile(dst, 'utf8'), 'mine')
  if (process.platform !== 'win32') {
    await rm(dst)
    await symlink(src, dst)
    assert.deepEqual(await syncThemes(source, profile), [name])
  }
  const existing = join(root, 'existing')
  await mkdir(existing)
  await writeFile(join(existing, name), 'second')
  assert.deepEqual(await syncThemes(source, existing), [])
  await writeFile(src, 'third')
  assert.deepEqual(await syncThemes(source, existing), [name])
  assert.equal(await readFile(join(existing, name), 'utf8'), 'second')
} finally {
  await rm(root, { recursive: true, force: true })
}
