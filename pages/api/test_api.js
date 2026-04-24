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
  const tId = body.tId[0]; const signed = body.signed[0]
  try {
    const formData1 = new FormData()
    formData1.append('checking', tId)
    formData1.append('signed', signed)
    await axios.post(`${nftBaseUrl}/cgi/check_token.pl`, formData1, { headers: { 'Content-Type': `multipart/form-data; boundary=${formData1._boundary}` } })
    // const { data: responseData } = await axios.post(`${nftBaseUrl}/cgi/check_token.pl`, formData1, { headers: { 'Content-Type': `multipart/form-data; boundary=${formData1._boundary}` } })
    // const res = responseData.result
    // console.log('checkee res', responseData.result)
    const metaData = { name: 'dummy', description: 'desc' }
    return response.status(200).json({
      mData: metaData
    })
  } catch (error) {
    console.log('Error uploading file: ', error)
  }
})

export default handler
