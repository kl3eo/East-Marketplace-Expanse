import axios from 'axios'
import { ethers } from 'ethers'

export async function getTokenMetadataByTokenId (nftContract, tokenId) {
  try {
    let tokenUri = await nftContract.tokenURI(tokenId)
    const l = new RegExp('ipfs','ig')
    // if (l.test(tokenUri)) console.log('uri', tokenUri)
    // GREENHALL
    let r = new RegExp('QmRnRTeGjh6oSxgatFq5nmENAYJ7SF9vw19v717ZBBrNUX', 'gi')
    if (r.test(tokenUri)) tokenUri = 'https://aspen.room-house.com/store/metadata/QmRnRTeGjh6oSxgatFq5nmENAYJ7SF9vw19v717ZBBrNUX'
    // greenhall-m
    r = new RegExp('QmfWY1Yt5wBEaZdPqDBvck6X3fQ33soUoc2wDZnVk8z6WE', 'gi')
    if (r.test(tokenUri)) tokenUri = 'https://aspen.room-house.com/store/metadata/QmfWY1Yt5wBEaZdPqDBvck6X3fQ33soUoc2wDZnVk8z6WE'
    
    const { data: metadata } = await axios.get(tokenUri)
    // if (l.test(tokenUri)) console.log('metadata', metadata)
    return metadata
  } catch (error) {
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
    const metadata = await getTokenMetadataByTokenId(nftContract, marketItem.tokenId)
    return mapMarketItem(marketItem, metadata)
  }
}

export function mapCreatedAndOwnedTokenIdsAsMarketItems (marketplaceContract, nftContract, account) {
  return async (tokenId) => {
    const metadata = await getTokenMetadataByTokenId(nftContract, tokenId)
    const approveAddress = await nftContract.getApproved(tokenId)
    const hasMarketApproval = approveAddress === marketplaceContract.address
    const [foundMarketItem, hasFound] = await marketplaceContract.getLatestMarketItemByTokenId(tokenId)
    const marketItem = hasFound ? foundMarketItem : {}
    return mapMarketItem(marketItem, metadata, tokenId, account, hasMarketApproval)
  }
}

export function mapMarketItem (marketItem, metadata, tokenId, account, hasMarketApproval) {
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
    hasMarketApproval: hasMarketApproval || false
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
