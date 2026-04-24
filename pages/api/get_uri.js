export default async function handler (req) {
  if (req.method === 'POST') {
    const util = require('util')
    const exec = util.promisify(require('child_process').exec)
    async function renamer () {
      const {
        stdout
      } = await exec('/opt/nvme/web3/renamer.pl ' + req.body.uri + ' ' + req.body.signed)
      return stdout
    }
    renamer()
  }
}
