import { getAgentDir } from '@oh-my-pi/pi-coding-agent'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { syncThemes } from './sync.js'

export default async function auraModern(pi) {
  const conflicts = await syncThemes(
    fileURLToPath(new URL('./themes/', import.meta.url)),
    join(getAgentDir(), 'themes')
  )
  if (conflicts.length) {
    pi.on('session_start', (_event, ctx) => {
      if (ctx.hasUI)
        ctx.ui.notify(
          'Aura Modern kept existing custom themes: ' + conflicts.join(', '),
          'warning'
        )
    })
  }
}
