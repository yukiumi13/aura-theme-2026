import { AuraAPI } from 'core'
import { resolve } from 'path'
import { existsSync } from 'fs'
import { fileSystemService } from 'services'
import { allowedPorts } from './allowed-ports'
import * as constants from 'shared/constants'

export async function loader(Aura: AuraAPI) {
  const { readDir } = fileSystemService()
  const folders = await readDir(constants.folders.portsFolder)
  const allowedPortList = allowedPorts(folders)

  const sanitizedAllowedPortList = allowedPortList.filter(
    (file) =>
      !constants.files.blackListedFiles.find((blackListedFile) =>
        file.includes(blackListedFile)
      )
  )

  for (const portFolderName of sanitizedAllowedPortList) {
    const portPath = resolve(constants.folders.portsFolder, portFolderName)
    // Shared helpers live beside ports but have no port entrypoint.
    if (
      !existsSync(resolve(portPath, 'index.ts')) &&
      !existsSync(resolve(portPath, 'index.js'))
    )
      continue
    const portModule = await import(portPath)
    const [key] = Object.keys(portModule)

    const loadPort = portModule[key]

    await loadPort(Aura)
  }
}
