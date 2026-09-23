import axios from 'axios'
// import fs from 'fs'
import middleware from './middleware/middleware'
import nextConnect from 'next-connect'
import FormData from 'form-data'

const currentServer = process.env.CURRENT_SERVER
const currentDomain = 'room-house.com'
const currentServerPort = process.env.CURRENT_SERVER_PORT

const nftBaseUrl = 'https://' + currentServer + '.' + currentDomain + currentServerPort
// const nftBaseUrl = 'http://127.0.0.1'

const handler = nextConnect()
handler.use(middleware)

export const config = {
  api: {
    bodyParser: false
  }
}

handler.post(async function handlePost ({ body, files }, response) {
  try {
    const metadata = {
      name: body.name[0],
      description: body.description[0],
      textContent: body.textContent[0]
    }
    const metadaUrl = await uploadJsonToIPFS(metadata)
    // console.log('metadataUrl', metadaUrl)
    const m = metadaUrl.split('metadata/')
    const mtd = m[1].split('?')
    const formData1 = new FormData()
    formData1.append('hash', mtd[0])
    formData1.append('signed', 'signed')

    const { data: responseData } = await axios.post(`${nftBaseUrl}/cgi/uploadee_post.pl`, formData1, { headers: { 'Content-Type': `multipart/form-data; boundary=${formData1._boundary}` } })
    const hash2 = `${responseData.result}`; const check = `${responseData.check}`
    return response.status(200).json({
      url: metadaUrl,
      hash: hash2,
      check: check
    })
  } catch (error) {
    console.log('Error uploading texts: ', error)
  }
})

async function uploadJsonToIPFS (json) {
  const formData1 = new FormData()
  formData1.append('name', json.name)
  formData1.append('description', json.description)
  formData1.append('text_content', json.textContent)
  try {
    const { data: responseData } = await axios.post(`${nftBaseUrl}/cgi/uploadee_text.pl`, formData1, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData1._boundary}`
      }
    })
    const url = `${nftBaseUrl}/store/metadata/${responseData.result}`
    return url
  } catch (error) {
    console.log(error.response.data)
  }
}

export default handler
