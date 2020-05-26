const path = require('path')

const core = require('@actions/core')
const cache = require('@actions/tool-cache')

const Jabba = require('./jabba')
const log = require('./util/log')

const INPUTS = {
  jdk: 'jdk'
}

const EXPORTS = {
  JAVA_HOME: 'JAVA_HOME'
};

(async function main () {
  try {
    const requestedJavaDistribution = core.getInput(INPUTS.jdk)

    log.info(`Requested distribution is: ${requestedJavaDistribution}`)

    const javaDirectory = await installJava(requestedJavaDistribution)

    log.info(`Local path to the distribution is: ${javaDirectory}`)

    core.exportVariable(EXPORTS.JAVA_HOME, javaDirectory)
    core.addPath(path.join(javaDirectory, 'bin'))
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
