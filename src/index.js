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

    const {
      distributionPath,
      binaryFolderPath
    } = await installJava(requestedJavaDistribution)

    log.info(`Local path to the distribution is: ${distributionPath}`)

    core.exportVariable(javaHomeEnvironmentVariable, distributionPath)

    if (shouldAddBinDirectoryToPath()) {
      core.addPath(binaryFolderPath)

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
    const {
      distributionPath,
      binaryFolderPath
    } = await jabba.retrieveDistribution(distribution)

    await cache.cacheDir(distributionPath, 'java', distribution)

    log.info(`Cached directory "${distributionPath}" for subsequent executions.`)

    return {
      distributionPath,
      binaryFolderPath
    }
  }
}

function shouldAddBinDirectoryToPath () {
  const value = core.getInput(INPUTS.addBinDirectoryToPath)

  return String(value).toLowerCase() === 'true'
}
