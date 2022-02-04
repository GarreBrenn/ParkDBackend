# Caliper Usage

## Prerequisites

- [Install nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

- Install and use node.js 10.24.1 and npm 6.14.12 using nvm
  - `nvm install 10`
  - `nvm use 10`

- Install Caliper
  - Move into workspace: `cd caliper-workspace`
  - Set NPM project details: `npm init -y`
  - Install Caliper via NPM: `npm install --only=prod @hyperledger/caliper-cli@0.4.2`
  - Bind Caliper to Fabric: `npx caliper bind --caliper-bind-sut fabric:2.1`

## Setup Local Test Network

- Move into workspace: `cd caliper-workspace`
- Run script: `./setupNetwork.sh`

## Run Benchmark

- Move into workspace: `cd caliper-workspace`
- Run script: `./runTest.sh`
