const path = require('path')

const cache = require('@actions/tool-cache')

const exec = require('../util/exec')
const log = require('../util/log')

const platformDependentImpl = (function chooseImpl () {
  if (process.platform === 'win32') {
    return require('./windows')
  } else if (process.platform === 'darwin') {
    return require('./macos')
  } else {
    return require('./nix')
  }
})()

const Jabba = {
  _deps: {
    path,
    process,
    cache,
    exec
  },

  Jabba () {
    return this
  },

  async retrieveDistribution (distributionExpression) {
    await this.installJabba()

    log.info('Installed jabba.')

    await this.installJava(distributionExpression)

    log.info(`Installed distribution: ${distributionExpression}`)

    const javaHome = this.actualHomeDirectory(await this.getPathToJava(distributionExpression))

    return javaHome
  },

  async installJava (distributionExpression) {
    await this.runJabba('install', [distributionExpression])
  },

  async getPathToJava (distributionExpression) {
    let actualExpression = distributionExpression

    if (distributionExpression.includes('+http')) {
      actualExpression = distributionExpression.split('=')[0]
    }

    log.info(`Listing distribution ${actualExpression} from expression ${distributionExpression}`)
    const distributionName = await this.runJabba('ls', [actualExpression])

    log.info(`Local name of distribution is: ${distributionName}`)

    return await this.runJabba('which', [distributionName])
  },

  async runJabba (command, args) {
    const output = await this._deps.exec.execAndGrabStdout(this.jabbaPath(), [command, ...(args || [])])

    return output.trim()
  }
}

Object.setPrototypeOf(Jabba, platformDependentImpl)

Jabba.create = function create () {
  return Object.create(Jabba).Jabba()
}

module.exports = Jabba
