import axios from 'axios'
import middleware from './middleware/middleware'
import nextConnect from 'next-connect'
import FormData from 'form-data'

const currentServer = process.env.CURRENT_SERVER
const currentServerPort = process.env.CURRENT_SERVER_PORT
const resServer = process.env.RES_SERVER

const burnedPlaceh = { name: 'Token Missing or Locked', description: 'Reload the page', image: 'https://' + currentServer + '.room-house.com' + currentServerPort + '/img/gd2560d.png', tags: 'photo' }

const nftBaseUrl = 'https://' + currentServer + '.room-house.com' + currentServerPort

const handler = nextConnect()
handler.use(middleware)

export const config = {
  api: {
    bodyParser: false
  }
}

handler.post(async function handlePost ({ body }, response) {
  const tokenUri = body.tokenUri[0]; const signed = body.signed[0]
  try {
    let metadata = {}
    const formData1 = new FormData()
    formData1.append('uri', tokenUri)
    formData1.append('signed', signed)
    const { data: responseData } = await axios.post(`${nftBaseUrl}/cgi/checkee_uri.pl`, formData1, { headers: { 'Content-Type': `multipart/form-data; boundary=${formData1._boundary}` } })
    const rdr = responseData.random
    // const isOne = responseData.with_verify === 1
    // const isOnee = responseData.with_verify === '1'
    // console.log('response data hash', responseData.hash, 'locked', responseData.with_sign, 'verify', responseData.with_verify, 'isOne', isOne, 'isOnee', isOnee)
    const tokenUriNew = responseData === '' ? tokenUri : responseData.result
    const isLocked = responseData === '' ? false : responseData.with_sign === 1 // must be int!
    const isSigned = responseData === '' ? false : responseData.with_verify === '1' // must be char!
    // console.log('response data hash', responseData.hash, 'isLocked', isLocked, 'isSigned', isSigned)
    if (isLocked) setTimeout(async () => { const formData2 = new FormData(); formData2.append('uri', tokenUri); formData2.append('signed', signed); formData2.append('random', rdr); await axios.post(`${nftBaseUrl}/cgi/rmee_uri.pl`, formData2, { headers: { 'Content-Type': `multipart/form-data; boundary=${formData2._boundary}` } }) }, 10000)
    // console.log('after check_uri.pl, tokenUriNew', tokenUriNew, 'isLocked', isLocked)
    const regex = new RegExp(`${resServer}.room-house.com`)
    const result = tokenUriNew.replace(regex, currentServer + '.room-house.com')

    let numProvider = 0

    try { await axios.get(result).then((response) => { return response.data }).catch(() => {}) } catch (e) { numProvider = 1; console.log('trying remote node') }
    if (numProvider) {
      try { await axios.get(tokenUriNew).then((response) => { return response.data }).catch(() => {}) } catch (e) { numProvider = -1; console.log('no metadata available'); return burnedPlaceh }
    }
    metadata = numProvider ? await axios.get(tokenUriNew).then((response) => { return response.data }).catch(() => { /* console.log('burn1'); */ return burnedPlaceh }) : await axios.get(result).then((response) => { return response.data }).catch(() => { /* console.log('burn2'); */ return burnedPlaceh })
    const { name, description, image, tags } = metadata
    // let curImg = tokenUri !== tokenUriNew ? tokenUriNew.replace('metadata', 'images') : image
    // let curImg = image // real location
    let curImg = tokenUri !== tokenUriNew ? tokenUri.replace('metadata', 'temp').replace(responseData.hash, responseData.random) : image
    curImg = numProvider ? curImg : curImg.replace(regex, currentServer + '.room-house.com')
    const m = image.split('?'); curImg = curImg.match(/\?/g) ? curImg : curImg + '?' + m[1]
    const metaData = { name: name, description: description, image: curImg, tags: tags, isLocked: isLocked, isSigned: isSigned }
    // console.log('5', metaData)
    return response.status(200).json({
      mData: metaData
    })
  } catch (error) {
    console.log('Error uploading file: ', error)
  }
})

export default handler
