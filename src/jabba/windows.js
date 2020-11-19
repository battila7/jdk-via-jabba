const { spawnSync } = require('child_process')

const installerUri = 'https://github.com/shyiko/jabba/raw/master/install.ps1'

const log = require('../util/log')

const installerScript = `
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Invoke-Expression (
  Invoke-WebRequest ${installerUri} -UseBasicParsing
).Content`

async function installJabba () {
  const { error } = spawnSync('powershell', {
    stdio: [
      installerScript,
      'inherit'
    ]
  })

  if (error) {
    log.info('Fail: ' + error.message)
    throw error
  }
}

function jabbaPath () {
  const homeDirectory = require('os').homedir

  const p = this._deps.path.join(homeDirectory, '.jabba', 'bin', 'jabba')

  log.info(p)

  return p
}

const windowsImpl = {
  installJabba,
  jabbaPath
}

module.exports = windowsImpl
