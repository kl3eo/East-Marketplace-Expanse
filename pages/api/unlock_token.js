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
  const tId = body.tId[0]; const signed = body.signed[0]; const network = typeof body.network !== 'undefined' ? body.network[0] : ''
  // console.log('unlock_token: tId', tId, 'signed', signed, 'network', network)
  try {
    const formData1 = new FormData()
    formData1.append('tId', tId)
    formData1.append('signed', signed)
    if (network !== '') formData1.append('network', network)
    const { data: responseData } = await axios.post(`${nftBaseUrl}/cgi/unlockee_token.pl`, formData1, { headers: { 'Content-Type': `multipart/form-data; boundary=${formData1._boundary}` } })
    console.log('unlockee res', responseData.result)
    const metaData = { name: 'dummy', description: 'desc' }
    return response.status(200).json({
      mData: metaData
    })
  } catch (error) {
    console.log('Error uploading file: ', error)
  }
})

export default handler
