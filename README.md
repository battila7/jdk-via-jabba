# JDK via Jabba

GitHub Action to download and activate a JDK using [jabba](https://github.com/shyiko/jabba).

## Quickstart

~~~~yml
steps:
# Will download the requested distribution and by default
#   - set the JAVA_HOME environment variable,
#   - add the /bin folder to the PATH.
# See Inputs for more information regarding configuration.
- uses: battila7/jdk-via-jabba@v1
  with:
    jdk: graalvm@20.1.0

# Thus, you can simply run:
- run: java -version
~~~~

## Inputs

### jdk

  * **Required**

The JDK to install. You can use any expression accepted by [jabba](https://github.com/shyiko/jabba).

Examples:

  * `1.8`
    * Oracle JDK 8.
  * `graalvm@20.1.0`
    * Release 20.1.0 of GraalVM.
  * `zulu@1.8.252`
    * Version 8, update 252 of the Zulu JDK.

### javaHomeEnvironmentVariable

  * **Not Required**
  * Default value: `JAVA_HOME`

The target environment variable into which the path to the downloaded distribution will be saved.

### addBinDirectoryToPath
  
  * **Not Required**
  * Default value: `true`

Whether to add the bin directory of the downloaded distribution to the PATH.
