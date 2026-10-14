import { existsSync } from 'fs'
import { resolve } from 'path'
import { loader } from 'core/modules/loader'
import { KittyPort } from 'ports/kitty'
import { AuraAPI } from 'core'

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  existsSync: jest.fn(),
}))
jest.mock('services', () => ({
  fileSystemService: () => ({
    readDir: async () => ['shared', 'kitty', 'README.md'],
  }),
}))
jest.mock('core/modules/loader/allowed-ports', () => ({
  allowedPorts: (targets: string[]) => targets,
}))
jest.mock('ports/kitty', () => ({ KittyPort: jest.fn() }))

it('loads an application port while skipping adjacent shared helpers and non-port files', async () => {
  const entrypoint = resolve('src/ports/kitty/index.ts')
  ;(existsSync as jest.Mock).mockImplementation(
    (path: string) => path === entrypoint
  )
  const aura = {} as AuraAPI
  await loader(aura)
  expect(KittyPort).toHaveBeenCalledTimes(1)
  expect(KittyPort).toHaveBeenCalledWith(aura)
})
