const fs = require('fs').promises
const path = require('path')
const { createHash } = require('crypto')

const LOADER = 'be5invis.vscode-custom-css'
const MARKER = '/* Aura Aqua gradients: '
const FILE = 'aura-aqua-gradients.css'

// Read-only inspection verifies that the loader installed our exact payload.
// It cannot prove a running window has reloaded it; status says so explicitly.
async function readWorkbench(appRoot) {
  for (const folder of [
    'electron-browser/workbench',
    'electron-browser',
    'electron-sandbox/workbench',
    'electron-sandbox',
  ]) {
    for (const file of [
      'workbench-dev.html',
      'workbench.esm.html',
      'workbench.html',
    ]) {
      const target = path.join(appRoot, 'out/vs/code', folder, file)
      try {
        return await fs.readFile(target, 'utf8')
      } catch (error) {
        if (error.code !== 'ENOENT') throw error
      }
    }
  }
  throw new Error(
    'Cannot locate the desktop workbench. Web VS Code is not supported.'
  )
}

function createController(vscode, context) {
  let queue = Promise.resolve()
  let disposed = false
  const cssPath = path.join(context.globalStorageUri.fsPath, FILE)
  const cssUrl = vscode.Uri.file(cssPath).toString()
  const status = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    1
  )
  status.command = 'aura.gradients.status'
  const enabled = () =>
    vscode.workspace
      .getConfiguration('aura.experimental')
      .get('gradients', false)
  const loaderConfig = () =>
    vscode.workspace.getConfiguration('vscode_custom_css')

  async function payload() {
    const css = await fs.readFile(
      path.join(context.extensionPath, 'extension/aqua-gradients.css'),
      'utf8'
    )
    const hash = createHash('sha256').update(css).digest('hex')
    return `${MARKER}${hash} */\n${css}`
  }

  function imports() {
    const values = loaderConfig().get('imports', [])
    if (
      !Array.isArray(values) ||
      values.some((value) => typeof value !== 'string')
    ) {
      throw new Error(
        'Custom CSS imports must be an array of URLs. Existing settings were not changed.'
      )
    }
    // Workspace overrides could execute unrelated scripts when the loader runs.
    const scoped = loaderConfig().inspect('imports')
    if (
      scoped &&
      (scoped.workspaceValue !== undefined ||
        scoped.workspaceFolderValue !== undefined)
    ) {
      throw new Error(
        'Move Custom CSS imports to User settings before applying Aura gradients. Workspace imports were not changed.'
      )
    }
    return values
  }

  function consentKey() {
    return JSON.stringify({
      installation: vscode.env.appRoot,
      otherImports: imports().filter((item) => item !== cssUrl),
    })
  }

  async function stage(desired) {
    const current = imports()
    const next = current.filter((item) => item !== cssUrl)
    if (desired) {
      await fs.mkdir(context.globalStorageUri.fsPath, { recursive: true })
      await fs.writeFile(cssPath, await payload(), 'utf8')
      next.push(cssUrl)
    } else {
      // Neutralize our file as well as removing our URL, so later loader runs
      // cannot restore a stale gradient from a cached imports configuration.
      try {
        await fs.writeFile(
          cssPath,
          '/* Aura gradients disabled. */\n',
          'utf8'
        )
      } catch (error) {
        if (error.code !== 'ENOENT') throw error
      }
    }
    if (JSON.stringify(next) !== JSON.stringify(current)) {
      await loaderConfig().update(
        'imports',
        next,
        vscode.ConfigurationTarget.Global
      )
    }
  }

  async function describe() {
    const html = await readWorkbench(vscode.env.appRoot)
    const installed = html.includes(MARKER)
    if (!enabled()) {
      return installed
        ? 'Gradients are switched off, but installed styles remain. Apply the setting, then reload all windows.'
        : 'Gradients are off. No Aura gradient styles are installed. Reload any windows that still show them.'
    }
    if (!vscode.extensions.getExtension(LOADER)) {
      return 'Setup needed: install or enable Custom CSS and JS Loader, then apply the gradient setting.'
    }
    if (!html.includes(await payload())) {
      return 'Gradients are enabled in settings but not installed, or need updating. Apply the setting.'
    }
    return 'The current gradient stylesheet is installed. Reload all windows to use it. It applies only to Aqua Light and Aqua Lime Light; live rendering cannot be verified by the extension.'
  }

  async function refresh() {
    const description = await describe()
    if (disposed) return description
    status.text = enabled()
      ? '$(paintcan) Aura gradients'
      : '$(paintcan) Aura: cleanup needed'
    status.tooltip = description
    if (enabled() || description.includes('installed styles remain'))
      status.show()
    else status.hide()
    return description
  }

  async function showStatus() {
    const description = await refresh()
    vscode.window
      .showInformationMessage(description, 'Apply setting', 'Open settings')
      .then((action) => {
        if (action === 'Apply setting') run(apply)
        if (action === 'Open settings')
          run(() =>
            vscode.commands.executeCommand(
              'workbench.action.openSettings',
              'aura.experimental.gradients'
            )
          )
      })
  }

  async function apply() {
    const loader = vscode.extensions.getExtension(LOADER)
    if (!loader) {
      vscode.window
        .showInformationMessage(
          'Aura gradients need Custom CSS and JS Loader. It modifies VS Code installation files and may need reapplying after editor updates.',
          'Open loader'
        )
        .then((action) => {
          if (action === 'Open loader')
            run(() =>
              vscode.commands.executeCommand('extension.open', LOADER)
            )
        })
      return refresh()
    }
    const consent = consentKey() // Validate before modifying anything.
    if (context.globalState.get('gradientLoaderConsent') !== consent) {
      const action = await vscode.window.showWarningMessage(
        'Apply the gradient setting using Custom CSS and JS Loader? It rewrites this VS Code installation, reapplies all your configured CSS/JS imports, and may trigger an integrity warning. Reload all windows afterward. Aura preserves your other imports.',
        { modal: true },
        'Apply'
      )
      if (action !== 'Apply') return refresh()
      await context.globalState.update('gradientLoaderConsent', consent)
    }
    const desired = enabled()
    await stage(desired)
    await loader.activate()
    await vscode.commands.executeCommand('extension.updateCustomCSS')
    const html = await readWorkbench(vscode.env.appRoot)
    const verified = desired
      ? html.includes(await payload())
      : !html.includes(MARKER)
    if (!verified)
      throw new Error(
        'The loader did not apply the requested state. Check its messages and installation write permissions, then run Aura: Apply Gradient Setting again.'
      )
    await refresh()
    // The loader supplies its own reload prompt. Do not call the whole-loader
    // uninstall command: other styles/scripts belong to the user.
  }

  async function changed() {
    await refresh()
    if (
      vscode.extensions.getExtension(LOADER) &&
      context.globalState.get('gradientLoaderConsent') === consentKey()
    )
      return apply()
    vscode.window
      .showInformationMessage(
        'Aura gradient preference changed. Apply it and reload to update the actual interface.',
        'Apply setting'
      )
      .then((action) => {
        if (action === 'Apply setting') run(apply)
      })
  }

  function run(action) {
    queue = queue
      .then(() => (disposed ? undefined : action()))
      .catch(async (error) => {
        if (!disposed) {
          status.text = '$(warning) Aura gradients'
          status.tooltip = error.message
          status.show()
          vscode.window.showErrorMessage(`Aura gradients: ${error.message}`)
        }
      })
    return queue
  }

  return {
    apply,
    changed,
    refresh,
    showStatus,
    run,
    dispose() {
      disposed = true
      status.dispose()
    },
  }
}

module.exports = { createController, readWorkbench }
