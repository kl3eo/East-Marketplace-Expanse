import { ethers } from 'ethers'
import axios from 'axios'
// import { useMemo } from 'react'
// import getUri from './getUri'

const currentServer = process.env.CURRENT_SERVER
const currentServerPort = process.env.CURRENT_SERVER_PORT
const resServer = process.env.RES_SERVER
const resServerPort = process.env.RES_SERVER_PORT
const mydocs = typeof window !== 'undefined' && window.location.hostname === 'mydocs.room-house.com'
const split96 = typeof window !== 'undefined' && window.location.hostname === 'split.room-house.com'

const cache1 = {}
const cache2 = {}

const test_placeh = {'name':'Hola!', 'description':'This is a Test', 'image':'https://' + currentServer + '.room-house.com' + currentServerPort + '/img/bluesky.jpg', 'tags':'photo'}
const placeh = {'name':'Please Wait', 'description':'..on approval by R-H', 'image':'https://' + currentServer + '.room-house.com' + currentServerPort + '/img/bluesky.jpg', 'tags':'photo'}
const burned_placeh = {'name':'Token Missing or Locked', 'description':'Reload the page', 'image':'https://' + currentServer + '.room-house.com' + currentServerPort + '/img/gd2560d.png', 'tags':'photo'}

export async function fetchCheckUri (tokenUri, tokenId, signed) {
  if (cache2[tokenId]) return cache2[tokenId]
  let res = ''; try { const fData1 = new FormData(); fData1.append('uri', tokenUri); fData1.append('signed', signed); res = await fetch('https://' + currentServer + '.room-house.com' + currentServerPort + '/cgi/check_uri.pl', { body: fData1, method: 'post', enctype: 'multipart/form-data' }).then((response) => response.json()).then((res) => { return res }) } catch (e) {  console.log('failed renamer') }

  cache2[tokenId] = res
  // console.log('tokenId', tokenId, 'cache2', cache2[tokenId])
  return res
} 

export async function getTokenMetadataByTokenId (nftContract, tokenId, signed , par) {
  // console.log('getTokenMetadataByTokenId tokenId', tokenId)
  if (cache2[tokenId]) return cache2[tokenId]
  try {

    let tokenUri = ''; try { if (cache1[tokenId]) { tokenUri = cache1[tokenId] } else { tokenUri = await nftContract.tokenURI(tokenId); cache1[tokenId] = tokenUri; /* console.log('No error, tokenUri', tokenUri) */ } } catch (error) { console.log('Caught get tokenUri err', error)
    /* if (par) { const fData = new FormData()
      fData.append('checking', tokenId); if (mydocs) fData.append('network', 'hd')
      const ret = await fetch('https://' + currentServer + '.room-house.com' + currentServerPort + '/cgi/check_token.pl', { body: fData, method: 'post', enctype: 'multipart/form-data' })
        .then((response) => response.json())
        .then((result) => { return result })
        .catch((err) => { console.log('Fetch checker Error', err); return err })
      if (ret.result !== 'OK') return placeh; return burned_placeh } */ return placeh }
    // console.log('nft.js, signed', signed)
    if (typeof signed !== 'undefined' && signed !== '') {
      // console.log('nft.js, signed1', signed)
      const fData = new FormData()
      fData.append('tokenUri', tokenUri)
      fData.append('tokenId', tokenId)
      fData.append('signed', signed)
      const { data } = await axios.post('/api/check_uri', fData, { headers: { 'Content-Type': 'multipart/form-data' }})
      cache2[tokenId] = data.mData
      return data.mData
    } else {
      // console.log('nft.js, signed2', signed)
      const regex = new RegExp(`${resServer}.room-house.com`)
      let result = tokenUri.replace(regex, currentServer + '.room-house.com')
    
      let num_provider = 0

      try { let ret = await fetch(result).then((response) => response.json()).then((res) => { return res }) } catch (e) { num_provider = 1; console.log('trying remote node');}
      if (num_provider) {
        try { let ret = await fetch(tokenUri).then((response) => response.json()).then((res) => { return res }) } catch (e) { num_provider = -1; console.log('no metadata available'); return burned_placeh}
      }    
      const metadata = num_provider ? await fetch(tokenUri).then((response) => response.json()).then((res) => { return res }) : await fetch(result).then((response) => response.json()).then((res) => { return res });
      const { name, description, image, tags } = metadata

      let curImg = image
      curImg = num_provider ? curImg : curImg.replace(regex, currentServer + '.room-house.com')

      // checking token state: signed? locked? - can be a lot of work!
      /* const fData = new FormData()
      fData.append('checking', tokenId); if (mydocs) fData.append('network', 'hd')
      const ret = await fetch('https://' + currentServer + '.room-house.com' + currentServerPort + '/cgi/check_token.pl', { body: fData, method: 'post', enctype: 'multipart/form-data' })
        .then((response) => response.json())
        .then((result) => { return result })
        .catch((err) => { console.log('Fetch checker Error', err); return err })
      const isLocked = ret === '' ? false : ret.with_sign === '1' // must be char!
      const isSigned = ret === '' ? false : ret.with_verify === '1' // must be char!
      const mData = {'name': name, 'description': description, 'image': curImg, 'tags': tags, 'isLocked': isLocked, 'isSigned': isSigned} */

      const mData = {'name': name, 'description': description, 'image': curImg, 'tags': tags, 'isLocked': false, 'isSigned': false}
      return mData
    }
  } catch (error) { // main try
    console.log(error)
  }
}

export async function getTokenOwnerByTokenId (nftContract, tokenId) {
  try {
    const tokenOwner = await nftContract.ownerOf(tokenId)
    return tokenOwner
  } catch (error) {
    console.log(error)
  }
}

export function mapAvailableMarketItems (nftContract) {
  return async (marketItem) => {
    const metadata = await getTokenMetadataByTokenId(nftContract, marketItem.tokenId, '', 0)
    return mapMarketItem(marketItem, metadata)
  }
}

export function mapCreatedAndOwnedTokenIdsAsMarketItemsOld (marketplaceContract, nftContract, account, signed) {
  return async (tokenId) => {
    const metadata = await getTokenMetadataByTokenId(nftContract, tokenId, signed, 1)
    if (metadata === burned_placeh ) return mapMarketItem({}, metadata, tokenId, account, false)
    // console.log('Here marketplace addr', marketplaceContract.address, 'nft contract addr', nftContract.address)
    let approveAddress = ''
    try { approveAddress = await nftContract.getApproved(tokenId) } catch (error) { console.log('Caught',error); return mapMarketItem({}, metadata, tokenId, account, false) }
    const hasMarketApproval = approveAddress === marketplaceContract.address

    let rawData = []
    const fData = new FormData()
    fData.append('tokenId', tokenId)
    // this get_data call doesn't need grab param
    if (typeof window !== 'undefined') fData.append('loco', window.location.hostname)
    // if (mydocs) fData.append('network', 'hd')
    // if (split96) fData.append('network', 'hd96')
    await fetch('https://' + currentServer + '.room-house.com' + currentServerPort + '/cgi/get_data.pl', { body: fData, method: 'post', enctype: 'multipart/form-data' })
      .then((response) => response.json())
      .then((result) => { rawData = result.map((element) => parseInt(element[0])); rawData = rawData.filter(item => item !== 9598) })
      .catch((err) => { console.log('Fetch fData Error', err) })
    // console.log('mapCreatedAndOwnedTokenIdsAsMarketItems rawdata is', rawData)
    const marketItems = split96 || mydocs ? await marketplaceContract.fetchMoreMarketItemsByMarketItemIds(rawData, 0) : await marketplaceContract.fetchMarketItemsByMarketItemIds(rawData, 0)
    const marketItem = marketItems[0] ? marketItems[0] : {}
    // console.log('with token', tokenId, 'what we have?', marketItems, 'and so', marketItem)
    return mapMarketItem(marketItem, metadata, tokenId, account, hasMarketApproval) 
  }
}

export function mapCreatedAndOwnedTokenIdsAsMarketItems (marketplaceContract, nftContract, account, signed) {
  return async (tokenData) => {
    const tokenId = tokenData[0]; const itemId = tokenData[1]; const itemIdArr = [itemId]
    // const itemIdArr = tokenData.slice(1)
    // const rawData = itemIdArr.map((element) => parseInt(element[0]))
    console.log('nfts.js: tok is', tokenId, 'item is', itemIdArr)
    const metadata = await getTokenMetadataByTokenId(nftContract, tokenId, signed, 1)
    if (metadata === burned_placeh ) return mapMarketItem({}, metadata, tokenId, account, false)

    let approveAddress = ''
    try { approveAddress = await nftContract.getApproved(tokenId) } catch (error) { console.log('Caught',error); return mapMarketItem({}, metadata, tokenId, account, false) }
    const hasMarketApproval = approveAddress === marketplaceContract.address

    const marketItems = split96 || mydocs ? await marketplaceContract.fetchMoreMarketItemsByMarketItemIds(itemIdArr, 0) : await marketplaceContract.fetchMarketItemsByMarketItemIds(itemIdArr, 0)
    const marketItem = marketItems[0] ? marketItems[0] : {}
    // console.log('with token', tokenId, 'what we have?', marketItems, 'and so', marketItem)
    return mapMarketItem(marketItem, metadata, tokenId, account, hasMarketApproval) 
  }
}

export async function mapMarketItem (marketItem, metadata, tokenId, account, hasMarketApproval) {

  return {
    price: marketItem.price ? ethers.utils.formatUnits(marketItem.price, 'ether') : undefined,
    tokenId: marketItem.tokenId || tokenId,
    marketItemId: marketItem.marketItemId || undefined,
    creator: marketItem.creator || account,
    seller: marketItem.seller || undefined,
    owner: marketItem.owner || account,
    sold: marketItem.sold || false,
    canceled: marketItem.canceled || false,
    image: metadata.image,
    name: metadata.name,
    description: metadata.description,
    tags: metadata.tags || '',
    hasMarketApproval: hasMarketApproval || false,
    isLocked: metadata.isLocked || false,
    isSigned: metadata.isSigned || false
  }
}

export async function getUniqueOwnedAndCreatedTokenIds (nftContract) {
  const nftIdsCreatedByMe = await nftContract.getTokensCreatedByMe()
  // const nftIdsOwnedByMe = await nftContract.getTokensOwnedByMe()
  let nftIdsOwnedByMe = []
  try { nftIdsOwnedByMe = await nftContract.getTokensOwnedByMe()} catch (error) { console.log(error) }
  const myNftIds = [...nftIdsCreatedByMe, ...nftIdsOwnedByMe]
  return [...new Map(myNftIds.map((item) => [item._hex, item])).values()]
}
