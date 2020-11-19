const { spawnSync } = require('child_process')

const installerUri = 'https://github.com/shyiko/jabba/raw/master/install.ps1'

const log = require('../util/log')

const installerScript = `
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Invoke-Expression (
  Invoke-WebRequest ${installerUri} -UseBasicParsing
).Content`

async function installJabba () {
  const result = spawnSync('powershell', [this._deps.path.join(__dirname, '..', 'install-jabba.ps1')])

  log.info(result.output)

  if (result.error) {
    log.info('Fail: ' + result.error.message)
    throw result.error
  }
}

function jabbaPath () {
  const homeDirectory = require('os').homedir()

  log.info('homedir' + homeDirectory)

  const p = this._deps.path.join(homeDirectory, '.jabba', 'bin', 'jabba')

  log.info(p)

  return p
}

const windowsImpl = {
  installJabba,
  jabbaPath
}

module.exports = windowsImpl
