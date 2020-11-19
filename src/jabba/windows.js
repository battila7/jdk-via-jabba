const { spawnSync } = require('child_process')

const log = require('../util/log')

const scriptPath = this._deps.path.join(__dirname, '..', 'install-jabba.ps1')

async function installJabba () {
  const { error, output } = spawnSync('powershell', [scriptPath])

  log.info(output)

  if (error) {
    throw error
  }
}

function jabbaPath () {
  const homeDirectory = require('os').homedir()

  return this._deps.path.join(homeDirectory, '.jabba', 'bin', 'jabba')
}

const windowsImpl = {
  installJabba,
  jabbaPath
}

module.exports = windowsImpl
