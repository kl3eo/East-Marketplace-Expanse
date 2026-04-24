import axios from 'axios'
import fs from 'fs'
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

handler.post(async function handlePost ({ body, files }, response) {
  // if (body.signed[0] === 'signed') { console.log('going out'); return response.status(200).json({ url: null }) }
  // console.log('HERE FILES IS', files, 'signed', body.signed)
  const si = Object.keys(files).length ? files.file[0].size : 0
  if (si > 102400000) return response.status(200).json({ check: null })
  if (typeof body.signed !== 'undefined') {
    const fn = Object.keys(files).length ? files.file[0].originalFilename : ''
    const formData2 = new FormData()
    Object.keys(files).length && formData2.append('file', fs.createReadStream(files.file[0].path), files.file[0].originalFilename)
    formData2.append('signed', body.signed[0])
    formData2.append('name', body.name[0])
    formData2.append('description', body.description[0])
    formData2.append('account', body.account[0])
    formData2.append('tid', body.tid[0])
    if (typeof body.network !== 'undefined' && body.network[0] === 'hd') formData2.append('network', 'hd')
    if (typeof body.network !== 'undefined' && body.network[0] === 'hd96') formData2.append('network', 'hd96')
    Object.keys(files).length && formData2.append('orig', fn)
    const { data: responseData } = await axios.post(`${nftBaseUrl}/cgi/upleedit.pl`, formData2, { headers: { 'Content-Type': `multipart/form-data; boundary=${formData2._boundary}` } })
    const check = `${responseData.result}`
    return response.status(200).json({
      check: check
    })
  }
  try {
    const fileUrl = await uploadFileToIPFS(files.file[0])
    // console.log('in upload.js, fileUrl', fileUrl, 'type', typeof fileUrl)
    if (typeof fileUrl === 'undefined') return response.status(200).json({ url: null })
    const metadata = {
      name: body.name[0],
      description: body.description[0],
      image: fileUrl,
      account: body.account[0]
    }

    const metadaUrl = await uploadJsonToIPFS(metadata, body.name[0])

    if (body.account[0] === 'DUMMY') {
      const m = metadaUrl.split('metadata/')
      const mtd = m[1].split('?')
      const formData1 = new FormData()
      formData1.append('hash', mtd[0])
      formData1.append('signed', 'signed')
      if (typeof body.network !== 'undefined' && body.network[0] === 'hd') formData1.append('network', 'hd')
      if (typeof body.network !== 'undefined' && body.network[0] === 'hd96') formData1.append('network', 'hd96')
      const { data: responseData } = await axios.post(`${nftBaseUrl}/cgi/uploadee_post.pl`, formData1, { headers: { 'Content-Type': `multipart/form-data; boundary=${formData1._boundary}` } })
      const hash2 = `${responseData.result}`; const check = `${responseData.check}`
      return response.status(200).json({
        url: metadaUrl,
        hash: hash2,
        check: check
      })
    }
    if (body.account[0] === 'DUMMY2') {
      const m = metadaUrl.split('metadata/')
      const mtd = m[1].split('?')
      const formData1 = new FormData()
      formData1.append('hash', mtd[0])
      if (typeof body.network !== 'undefined' && body.network[0] === 'hd') formData1.append('network', 'hd')
      if (typeof body.network !== 'undefined' && body.network[0] === 'hd96') formData1.append('network', 'hd96')
      const { data: responseData } = await axios.post(`${nftBaseUrl}/cgi/uploadee_post.pl`, formData1, { headers: { 'Content-Type': `multipart/form-data; boundary=${formData1._boundary}` } })
      const hash2 = `${responseData.result}`; const check = `${responseData.check}`
      return response.status(200).json({
        url: metadaUrl,
        hash: hash2,
        check: check
      })
    }
    return response.status(200).json({
      url: metadaUrl
    })
  } catch (error) {
    console.log('Error uploading file: ', error)
  }
})

async function uploadFileToIPFS (data) {
  const si = Object.keys(data).length ? data.size : 0
  if (si > 102400000 || si === 0) return
  const formData = new FormData()
  formData.append('file', fs.createReadStream(data.path), data.originalFilename)
  formData.append('type', 'i')

  try {
    const { data: responseData } = await axios.post(`${nftBaseUrl}/cgi/uploadee.pl`, formData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
        // pinata_api_key: process.env.PINATA_API_KEY,
        // pinata_secret_api_key: process.env.PINATA_SECRET_KEY
      }
    })
    // console.log('response', responseData)
    if (responseData.result === 'too_big') return
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
  formData1.append('account', json.account)
  formData1.append('type', 'j')
  try {
    const { data: responseData } = await axios.post(`${nftBaseUrl}/cgi/uploadee.pl`, formData1, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData1._boundary}`
        // pinata_api_key: process.env.PINATA_API_KEY,
        // pinata_secret_api_key: process.env.PINATA_SECRET_KEY
      }
    })
    // const url = `${nftBaseUrl}/store/metadata/${responseData.result}?filename=${fileName}`
    const url = `${nftBaseUrl}/store/metadata/${responseData.result}`
    return url
  } catch (error) {
    console.log(error.response.data)
  }
}

export default handler
