import { useContext, useEffect, useState } from 'react'
import NFTCardList from '../src/components/organisms/NFTCardList'
import { Web3Context } from '../src/components/providers/Web3Provider'
import { LinearProgress } from '@mui/material'
import UnsupportedChain from '../src/components/molecules/UnsupportedChain'
import { mapAvailableMarketItems } from '../src/utils/nft'

export default function Home () {
  const [nfts, setNfts] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { marketplaceContract, nftContract, isReady, network, searchStr } = useContext(Web3Context)
  useEffect(() => {
    loadNFTs()
  }, [isReady])
  async function loadNFTs () {
    if (!isReady) return
    const startTime = new Date()
    const data = await marketplaceContract.fetchAvailableMarketItems()
    // data.forEach(element => { console.log('element6:', parseInt(element[6]._hex, 16)) })
    // data.sort(function (a, b) { const ai = parseInt(a[6]._hex, 16); const bi = parseInt(b[6]._hex, 16); return ai < bi ? 1 : (ai === bi ? 0 : -1) })
    const endTime0 = new Date()
    const diff = endTime0 - startTime
    console.log('data', data, 'time elapsed', diff)
    // const Data = [...data, ...data, ...data, ...data]
    const items = searchStr.length || data.length > 0 ? await Promise.all(data.map(mapAvailableMarketItems(nftContract))) : await getItems(data, 28)
    // const shortie = searchStr.length || data.length < 56 ? false : true
    const endTime = new Date()
    const diff1 = endTime - endTime0
    console.log('items', items, 'time elapsed', diff1)
    // filter, sort items here
    items.sort(function (a, b) { const ai = parseInt(a.price); const bi = parseInt(b.price); return ai < bi ? 1 : (ai === bi ? 0 : -1) })
    let i = 0
    let j = 0
    const fItems = []
    for (i = 0; i < items.length; i++) { const r = new RegExp(searchStr, 'gi'); if (searchStr.length === 0 || (items[i].name && items[i].name.length && r.test(items[i].name)) || (items[i].description && items[i].description.length && r.test(items[i].description)) || (items[i].tags && items[i].tags.length && r.test(items[i].tags))) { fItems[j] = items[i]; j++ } }
    setNfts(fItems)
    if (searchStr.length === 0 && data.length <= 0) {
      await setItems(data)
    } else {
      setFilteredItems(fItems)
    }
    setIsLoading(false)
  }
  async function setItems (data) {
    let i = 0
    let j = 0
    const realItems = await Promise.all(data.map(mapAvailableMarketItems(nftContract)))
    realItems.sort(function (a, b) { const ai = parseInt(a.price); const bi = parseInt(b.price); return ai < bi ? 1 : (ai === bi ? 0 : -1) })
    const realFilteredItems = []
    for (i = 0; i < realItems.length; i++) { const r = new RegExp(searchStr, 'gi'); if (searchStr.length === 0 || (realItems[i].name && realItems[i].name.length && r.test(realItems[i].name)) || (realItems[i].description && realItems[i].description.length && r.test(realItems[i].description)) || (realItems[i].tags && realItems[i].tags.length && r.test(realItems[i].tags))) { realFilteredItems[j] = realItems[i]; j++ } }
    setFilteredItems(realFilteredItems)
    console.log('realFiltered', realFilteredItems)
  }
  async function getItems (data, n) {
    const slicedArray1 = await data.slice(0, n)
    const slicedArray2 = await data.slice(n, 2 * n)
    const Promise1 = Promise.all(slicedArray1.map(mapAvailableMarketItems(nftContract)))
    const Promise2 = Promise.all(slicedArray2.map(mapAvailableMarketItems(nftContract)))
    const Result1 = await Promise1
    const Result2 = await Promise2
    // return Result1.concat(Result2)
    return [...Result1, ...Result2]
  }
  /* async function getItems (data, n) {
    const slicedArray1 = await data.slice(0, n)
    const slicedArray2 = await data.slice(n, 2 * n)
    const slicedArray3 = await data.slice(2 * n, 3 * n)
    const slicedArray4 = await data.slice(3 * n, data.length)
    const Promise1 = Promise.all(slicedArray1.map(mapAvailableMarketItems(nftContract)))
    const Promise2 = Promise.all(slicedArray2.map(mapAvailableMarketItems(nftContract)))
    const Promise3 = Promise.all(slicedArray3.map(mapAvailableMarketItems(nftContract)))
    const Promise4 = Promise.all(slicedArray4.map(mapAvailableMarketItems(nftContract)))
    const Result1 = await Promise1
    const Result2 = await Promise2
    const Result3 = await Promise3
    const Result4 = await Promise4
    // return Result1.concat(Result2.concat(Result3.concat(Result4)))
    return [...Result1, ...Result2, ...Result3, ...Result4]
  } */
  /* async function getItems (data, n) {
    const slicedArray1 = await data.slice(0, n)
    const slicedArray2 = await data.slice(n, 2 * n)
    const slicedArray3 = await data.slice(2 * n, 3 * n)
    const slicedArray4 = await data.slice(3 * n, 4 * n)
    const slicedArray5 = await data.slice(4 * n, 5 * n)
    const slicedArray6 = await data.slice(5 * n, 6 * n)
    const slicedArray7 = await data.slice(6 * n, 7 * n)
    const slicedArray8 = await data.slice(7 * n, data.length)
    const Promise1 = Promise.all(slicedArray1.map(mapAvailableMarketItems(nftContract)))
    const Promise2 = Promise.all(slicedArray2.map(mapAvailableMarketItems(nftContract)))
    const Promise3 = Promise.all(slicedArray3.map(mapAvailableMarketItems(nftContract)))
    const Promise4 = Promise.all(slicedArray4.map(mapAvailableMarketItems(nftContract)))
    const Promise5 = Promise.all(slicedArray5.map(mapAvailableMarketItems(nftContract)))
    const Promise6 = Promise.all(slicedArray6.map(mapAvailableMarketItems(nftContract)))
    const Promise7 = Promise.all(slicedArray7.map(mapAvailableMarketItems(nftContract)))
    const Promise8 = Promise.all(slicedArray8.map(mapAvailableMarketItems(nftContract)))
    const Result1 = await Promise1
    const Result2 = await Promise2
    const Result3 = await Promise3
    const Result4 = await Promise4
    const Result5 = await Promise5
    const Result6 = await Promise6
    const Result7 = await Promise7
    const Result8 = await Promise8
    return [...Result1, ...Result2, ...Result3, ...Result4, ...Result5, ...Result6, ...Result7, ...Result8]
  } */
  if (!network) return <UnsupportedChain/>
  if (isLoading) return <LinearProgress/>
  if (!isLoading && !nfts.length) return <h1>No NFTs for sale</h1>
  return (
    <NFTCardList nfts={nfts} setNfts={setNfts} filteredItems={filteredItems} withCreateNFT={false}/>
  )
}
