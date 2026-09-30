// Runs in the local extension host, including Remote SSH sessions. The optional
// loader owns installation patching; Aura only owns its stylesheet and import.
const vscode = require('vscode')
const { createController } = require('./gradients')

function activate(context) {
  const controller = createController(vscode, context)
  const run = (action) => controller.run(action)
  context.subscriptions.push(
    controller,
    vscode.commands.registerCommand('aura.gradients.apply', () =>
      run(() => controller.apply())
    ),
    vscode.commands.registerCommand('aura.gradients.status', () =>
      run(() => controller.showStatus())
    ),
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration('aura.experimental.gradients')) {
        run(() => controller.changed())
      }
    })
  )
  return run(() => controller.refresh())
}

module.exports = { activate }
