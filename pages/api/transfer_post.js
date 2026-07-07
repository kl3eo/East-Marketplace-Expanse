/* export default async function handler (req) {
  if (req.method === 'POST') {
    const util = require('util')
    const exec = util.promisify(require('child_process').exec)
    async function updater () {
      const {
        stdout
      } = await exec('/opt/nvme/web3/transferee_postee.pl ' + req.body.id)
      return stdout
    }
    updater()
  }
}
*/
// above wouldn't work
import axios from 'axios'
import middleware from './middleware/middleware'
import nextConnect from 'next-connect'
import FormData from 'form-data'

const currentServer = process.env.CURRENT_SERVER
const currentServerPort = process.env.CURRENT_SERVER_PORT

const nftBaseUrl = 'https://' + currentServer + '.room-house.com' + currentServerPort

const handler = nextConnect()
handler.use(middleware)

export const config = {
  api: {
    bodyParser: false
  }
}

handler.post(async function handlePost ({ body }, response) {
  const id = body.id[0]; const network = typeof body.network !== 'undefined' ? body.network[0] : ''
  // console.log('transfer_post network', network)

  try {
    const formData1 = new FormData()
    formData1.append('tId', id)
    if (network !== '') formData1.append('network', network)
    const { data: responseData } = await axios.post(`${nftBaseUrl}/cgi/transferee_postee.pl`, formData1, { headers: { 'Content-Type': `multipart/form-data; boundary=${formData1._boundary}` } })
    // console.log('transferee_postee res', responseData.result)
    const metaData = { res: responseData.result, description: 'desc' }
    return response.status(200).json({
      mData: metaData
    })
  } catch (error) {
    console.log('Error: ', error)
  }
})

export default handler
