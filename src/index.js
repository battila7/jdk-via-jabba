const path = require('path')

const core = require('@actions/core')
const cache = require('@actions/tool-cache')

const Jabba = require('./jabba')
const log = require('./util/log')

const INPUTS = {
  jdk: 'jdk',
  javaHomeEnvironmentVariable: 'javaHomeEnvironmentVariable',
  addBinDirectoryToPath: 'addBinDirectoryToPath'
};

(async function main () {
  try {
    const requestedJavaDistribution = core.getInput(INPUTS.jdk)
    log.info(`Requested distribution is: ${requestedJavaDistribution}`)

    const javaHomeEnvironmentVariable = core.getInput(INPUTS.javaHomeEnvironmentVariable)
    log.info(`The path to the downloaded distribution will be accessible via ${javaHomeEnvironmentVariable}`)

    const javaHome = await installJava(requestedJavaDistribution)

    log.info(`Local path to the distribution is: ${javaHome}`)

    core.exportVariable(javaHomeEnvironmentVariable, javaHome)

    if (shouldAddBinDirectoryToPath()) {
      core.addPath(path.join(javaHome, 'bin'))

      log.info('Exposed the bin directory of the downloaded distribution.')
    }
  } catch (error) {
    core.setFailed(error.message)
  }
})()

async function installJava (distribution) {
  const cachedDirectory = cache.find('java', distribution)

  if (cachedDirectory) {
    log.info('Distribution found in cache.')

    return cachedDirectory
  } else {
    log.info('Distribution not found in cache, downloading.')

    const jabba = Jabba.create()
    const javaHome = await jabba.retrieveDistribution(distribution)

    await cache.cacheDir(javaHome, 'java', distribution)

    log.info(`Cached directory "${javaHome}" for subsequent executions.`)

    return javaHome
  }
}

function shouldAddBinDirectoryToPath () {
  const value = core.getInput(INPUTS.addBinDirectoryToPath)

  return String(value).toLowerCase() === 'true'
}
