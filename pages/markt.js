import { useContext, useEffect, useState } from 'react'
import NFTCardList from '../src/components/organisms/NFTCardList'
import { Web3Context } from '../src/components/providers/Web3Provider'
import { LinearProgress } from '@mui/material'
import UnsupportedChain from '../src/components/molecules/UnsupportedChain'
import { mapAvailableMarketItems } from '../src/utils/nft'

export default function Markt () {
  const [nfts, setNfts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { marketplaceContract, nftContract, isReady, network, searchStr } = useContext(Web3Context)

  useEffect(() => {
    loadNFTs()
  }, [isReady])
  async function loadNFTs () {
    if (!isReady) return
    const data = await marketplaceContract.fetchAvailableMarketItems()
    const items = await Promise.all(data.map(mapAvailableMarketItems(nftContract)))
    // filter, sort items here
    items.sort(function (a, b) { const ai = parseInt(a.price); const bi = parseInt(b.price); return ai < bi ? 1 : (ai === bi ? 0 : -1) })
    const filteredItems = []
    let i = 0
    let j = 0
    for (i = 0; i < items.length; i++) { const r = new RegExp(searchStr, 'gi'); if (searchStr.length === 0 || (items[i].name && items[i].name.length && r.test(items[i].name)) || (items[i].description && items[i].description.length && r.test(items[i].description)) || (items[i].tags && items[i].tags.length && r.test(items[i].tags))) { filteredItems[j] = items[i]; j++ } }
    setNfts(filteredItems)
    setIsLoading(false)
  }

  if (!network) return <UnsupportedChain/>
  if (isLoading) return <LinearProgress/>
  if (!isLoading && !nfts.length) return <h1>No NFTs for sale</h1>
  return (
    <NFTCardList nfts={nfts} setNfts={setNfts} withCreateNFT={false}/>
  )
}
