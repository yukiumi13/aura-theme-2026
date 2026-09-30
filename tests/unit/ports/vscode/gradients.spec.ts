import fs from 'fs'
import os from 'os'
import path from 'path'
import { pathToFileURL } from 'url'

const {
  createController,
} = require('../../../../src/ports/vscode/extra/extension/gradients')

let root: string
let controller: any

function fixture(
  options: {
    enabled?: boolean
    loader?: boolean
    failure?: boolean
    workspaceImports?: boolean
  } = {}
) {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'aura-gradients-test-'))
  const storage = path.join(root, 'storage')
  const htmlPath = path.join(
    root,
    'out/vs/code/electron-browser/workbench/workbench.html'
  )
  fs.mkdirSync(path.dirname(htmlPath), { recursive: true })
  fs.writeFileSync(htmlPath, '<html></html>')
  const state = {
    enabled: options.enabled ?? true,
    imports: ['file:///personal.css'],
    confirm: 'Apply',
  }
  const updates = jest.fn(async (_key, values) => {
    state.imports = values
  })
  const status = {
    text: '',
    tooltip: '',
    show: jest.fn(),
    hide: jest.fn(),
    dispose: jest.fn(),
  }
  const loader = { activate: jest.fn() }
  const vscode = {
    env: { appRoot: root },
    Uri: {
      file: (p: string) => ({ toString: () => pathToFileURL(p).toString() }),
    },
    ConfigurationTarget: { Global: 1 },
    StatusBarAlignment: { Right: 2 },
    workspace: {
      getConfiguration: (section: string) =>
        section === 'aura.experimental'
          ? { get: () => state.enabled }
          : {
              get: () => state.imports,
              update: updates,
              inspect: () =>
                options.workspaceImports ? { workspaceValue: [] } : {},
            },
    },
    extensions: {
      getExtension: () => (options.loader === false ? undefined : loader),
    },
    window: {
      createStatusBarItem: () => status,
      showInformationMessage: jest.fn(async () => undefined),
      showWarningMessage: jest.fn(async () => state.confirm),
      showErrorMessage: jest.fn(),
    },
    commands: {
      executeCommand: jest.fn(async (command: string) => {
        if (command === 'extension.updateCustomCSS' && !options.failure) {
          const contents = state.imports
            .filter((p) => p !== 'file:///personal.css')
            .map((p) => fs.readFileSync(new URL(p), 'utf8'))
          fs.writeFileSync(htmlPath, `<html>${contents.join('\n')}</html>`)
        }
      }),
    },
  }
  const memory = new Map()
  controller = createController(vscode, {
    globalState: {
      get: (key: string) => memory.get(key),
      update: async (key: string, value: any) => memory.set(key, value),
    },
    globalStorageUri: { fsPath: storage },
    extensionPath: path.resolve(__dirname, '../../../../packages/vscode'),
  })
  return { state, updates, status, vscode, htmlPath, storage, loader }
}

afterEach(() => {
  controller?.dispose()
  if (root) fs.rmSync(root, { recursive: true, force: true })
})

it('does no writes or loader activation when the default setting is off', async () => {
  const { updates, status, loader, storage } = fixture({ enabled: false })
  await controller.refresh()
  expect(updates).not.toHaveBeenCalled()
  expect(loader.activate).not.toHaveBeenCalled()
  expect(fs.existsSync(storage)).toBe(false)
  expect(status.hide).toHaveBeenCalled()
})

it('reports a missing loader without pretending gradients were installed', async () => {
  const { updates, vscode } = fixture({ loader: false })
  await controller.apply()
  expect(updates).not.toHaveBeenCalled()
  expect(await controller.refresh()).toContain('Setup needed')
  expect(vscode.commands.executeCommand).not.toHaveBeenCalled()
})

it('cancel leaves imports, files and the installation untouched', async () => {
  const { state, updates, storage, vscode } = fixture()
  state.confirm = undefined as any
  await controller.apply()
  expect(updates).not.toHaveBeenCalled()
  expect(fs.existsSync(storage)).toBe(false)
  expect(vscode.commands.executeCommand).not.toHaveBeenCalled()
})

it('installs the exact payload and preserves other imports across apply, upgrade and disable', async () => {
  const { state, vscode, htmlPath, storage } = fixture()
  await controller.apply()
  const first = fs.readFileSync(htmlPath, 'utf8')
  expect(first).toContain('linear-gradient')
  expect(state.imports[0]).toBe('file:///personal.css')
  expect(state.imports).toHaveLength(2)
  expect(await controller.refresh()).toContain(
    'current gradient stylesheet is installed'
  )
  await controller.apply()
  expect(state.imports).toHaveLength(2)
  expect(vscode.window.showWarningMessage).toHaveBeenCalledTimes(1)
  // Editor upgrades replace the workbench and erase the injection.
  fs.writeFileSync(htmlPath, '<html>upgraded editor</html>')
  expect(await controller.refresh()).toContain('not installed')
  await controller.apply()
  expect(fs.readFileSync(htmlPath, 'utf8')).toBe(first)
  state.enabled = false
  expect(await controller.refresh()).toContain('installed styles remain')
  await controller.changed()
  expect(state.imports).toEqual(['file:///personal.css'])
  expect(fs.readFileSync(htmlPath, 'utf8')).not.toContain(
    'Aura Aqua gradients:'
  )
  expect(
    fs.readFileSync(path.join(storage, 'aura-aqua-gradients.css'), 'utf8')
  ).not.toContain('linear-gradient')
  expect(vscode.commands.executeCommand).not.toHaveBeenCalledWith(
    'extension.uninstallCustomCSS'
  )
})

it('detects a loader that returns without changing the workbench', async () => {
  fixture({ failure: true })
  await expect(controller.apply()).rejects.toThrow('did not apply')
  expect(await controller.refresh()).toContain('not installed')
})

it('refuses workspace imports before invoking the installation patcher', async () => {
  const { updates, vscode } = fixture({ workspaceImports: true })
  await expect(controller.apply()).rejects.toThrow('User settings')
  expect(updates).not.toHaveBeenCalled()
  expect(vscode.window.showWarningMessage).not.toHaveBeenCalled()
  expect(vscode.commands.executeCommand).not.toHaveBeenCalled()
})

it('recovers its serialized operation queue after an error', async () => {
  const { vscode } = fixture()
  const action = jest.fn()
  await controller.run(() => {
    throw new Error('test failure')
  })
  await controller.run(action)
  expect(vscode.window.showErrorMessage).toHaveBeenCalledWith(
    'Aura gradients: test failure'
  )
  expect(action).toHaveBeenCalledTimes(1)
})

it('leaves commands usable while a nonmodal preference notification is unanswered', async () => {
  const { vscode } = fixture()
  vscode.window.showInformationMessage.mockImplementation(
    () => new Promise(() => {})
  )
  await controller.run(() => controller.changed())
  const action = jest.fn()
  await controller.run(action)
  expect(action).toHaveBeenCalledTimes(1)
})
