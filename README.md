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

Additional examples:

<details>
<summary>Using a custom environment variable instead of JAVA_HOME</summary>
<br>

For example, if you already have a Java installation that you do not want to mess up, then you can specify a custom environment variable to store the path to your new JDK installation.

By default, JDK via Jabba will add the `bin` directory of the installed JDK to the `PATH`. In scenarios like this, however, this behavior is often not desired, and therefore can be disabled using `addBinDirectoryToPath`.

~~~~yml
# Will 
#   - download the requested distribution,
#   - set the GRAAL_HOME environment variable.
- uses: battila7/jdk-via-jabba@v1
  with:
    jdk: graalvm@20.1.0
    javaHomeEnvironmentVariable: GRAAL_HOME
    addBinDirectoryToPath: false

- name: Print GraalVM path
  run: |
    echo $GRAAL_HOME
~~~~

</details>

<details>
<summary>Installing multiple JDKs</summary>
<br>

Using custom environment variables, we can also install multiple different JDKs on the same system.

By default, JDK via Jabba will add the `bin` directory of the installed JDK to the `PATH`. In scenarios like this, however, this behavior is often not desired, and therefore can be disabled using `addBinDirectoryToPath`.

~~~~yml
- uses: battila7/jdk-via-jabba@v1
  with:
    jdk: graalvm@20.1.0
    javaHomeEnvironmentVariable: GRAAL_HOME
    addBinDirectoryToPath: false

- uses: battila7/jdk-via-jabba@v1
  with:
    jdk: zulu@1.8.252
    javaHomeEnvironmentVariable: ZULU_HOME
    addBinDirectoryToPath: false

- name: Print JDK paths
  run: |
    echo $GRAAL_HOME
    echo $ZULU_HOME
~~~~

</details>

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

The target environment variable into which the path to the downloaded distribution will be saved. Using this input, and appropriate environment variables, you can easily install multiple different JDKs on the same system, without interfering with each other.

### addBinDirectoryToPath
  
  * **Not Required**
  * Default value: `true`

Whether to add the bin directory of the downloaded distribution to the PATH.
