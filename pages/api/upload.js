import axios from 'axios'
import fs from 'fs'
import middleware from './middleware/middleware'
import nextConnect from 'next-connect'
import FormData from 'form-data'

const nftBaseUrl = 'https://aspen.room-house.com'

const handler = nextConnect()
handler.use(middleware)

export const config = {
  api: {
    bodyParser: false
  }
}

handler.post(async function handlePost ({ body, files }, response) {
  try {
    const fileUrl = await uploadFileToIPFS(files.file[0])
    const metadata = {
      name: body.name[0],
      description: body.description[0],
      image: fileUrl
    }

    const metadaUrl = await uploadJsonToIPFS(metadata, body.name[0])
    return response.status(200).json({
      url: metadaUrl
    })
  } catch (error) {
    console.log('Error uploading file: ', error)
  }
})

async function uploadFileToIPFS (data) {
  const formData = new FormData()
  formData.append('file', fs.createReadStream(data.path), data.originalFileName)
  formData.append('type', 'i')

  try {
    const { data: responseData } = await axios.post(`${nftBaseUrl}/cgi/upload.pl`, formData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_KEY
      }
    })
    const url = `${nftBaseUrl}/store/images/${responseData.result}?filename=${data.originalFilename}`
    return url
  } catch (error) {
    console.log(error)
  }
}
async function uploadJsonToIPFS (json, fileName) {
  const formData1 = new FormData()
  formData1.append('name', json.name)
  formData1.append('description', json.description)
  formData1.append('file', json.image)
  formData1.append('type', 'j')
  try {
    const { data: responseData } = await axios.post(`${nftBaseUrl}/cgi/upload.pl`, formData1, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData1._boundary}`,
        pinata_api_key: process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_KEY
      }
    })
    const url = `${nftBaseUrl}/store/metadata/${responseData.result}?filename=${fileName}`
    return url
  } catch (error) {
    console.log(error.response.data)
  }
}

export default handler
