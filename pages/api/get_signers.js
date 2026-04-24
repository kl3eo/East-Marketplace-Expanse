// const { ethers } = require('hardhat')
// const Web3 = require('web3')

export default async function handler (req) {
  if (req.method === 'POST') {
    // const exec = require('child_process').exec
    // exec('/bin/cat /etc/passwd', (stdout) => console.log(stdout))
    // const accounts = await ethers.getSigners()
    // console.log('acco', accounts)
    // const providerURL = 'https://wien.room-house.com'
    // const web3 = await new Web3(new Web3.providers.HttpProvider(providerURL))
    // console.log('accos', web3.eth.accounts)
    const util = require('util')
    const exec = util.promisify(require('child_process').exec)

    async function lsExample () {
      const {
        stdout,
        stderr
      } = await exec('ls')
      console.log('stdout:', stdout)
      console.error('stderr:', stderr)
    }
    lsExample()
  }
}
