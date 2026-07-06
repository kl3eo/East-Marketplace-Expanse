import axios from 'axios'
import middleware from './middleware/middleware'
import nextConnect from 'next-connect'
import FormData from 'form-data'

const currentServer = process.env.CURRENT_SERVER
const currentServerPort = process.env.CURRENT_SERVER_PORT
// const resServer = process.env.RES_SERVER

const nftBaseUrl = 'https://' + currentServer + '.room-house.com' + currentServerPort

const handler = nextConnect()
handler.use(middleware)

export const config = {
  api: {
    bodyParser: false
  }
}

handler.post(async function handlePost ({ body }, response) {
  const tId = body.tId[0]; const network = typeof body.network !== 'undefined' ? body.network[0] : ''
  try {
    const formData1 = new FormData()
    formData1.append('checking', tId)
    if (network !== '') formData1.append('network', network)
    const { data: responseData } = await axios.post(`${nftBaseUrl}/cgi/gettee_filee_infee.pl`, formData1, { headers: { 'Content-Type': `multipart/form-data; boundary=${formData1._boundary}` } })
    const res = responseData.result
    const tx = responseData.tx
    const ts = responseData.ts
    const hs = responseData.hs
    const fn = responseData.fn
    const fs = responseData.fs
    const eq = responseData.eq
    const bn = responseData.bn
    const cr = responseData.cr

    const metaData = { res: res, tx: tx, ts: ts, hs: hs, fn: fn, fs: fs, eq: eq, bn: bn, cr: cr }
    return response.status(200).json({
      mData: metaData
    })
  } catch (error) {
    console.log('Error getting info for file: ', error)
  }
})

export default handler
