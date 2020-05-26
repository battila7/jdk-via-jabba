# JDK via Jabba

GitHub Action to download and activate a JDK using [jabba](https://github.com/shyiko/jabba).

## Inputs

### jdk

The JDK to install and activate. You can use any expression accepted by [jabba](https://github.com/shyiko/jabba).

Examples:

  * `1.8`
    * Oracle JDK 8.
  * `graalvm@20.1.0`
    * Release 20.1.0 of GraalVM.
  * `zulu@1.8.252`
    * Version 8, update 252 of the Zulu JDK.

## Usage

~~~~yml
steps:
- uses: actions/checkout@v2

- uses: battila7/jdk-via-jabba@v1
  with:
    jdk: graalvm@20.1.0

- run: java -version
~~~~
