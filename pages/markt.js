import { useContext, useEffect, useState } from 'react'
import NFTCardList from '../src/components/organisms/NFTCardList'
import { Web3Context } from '../src/components/providers/Web3Provider'
import { LinearProgress } from '@mui/material'
import UnsupportedChain from '../src/components/molecules/UnsupportedChain'
import { mapAvailableMarketItems } from '../src/utils/nft'
import { useDispatch } from 'react-redux'
import { getData } from '../store/actions/dataAction'

export default function Markt () {
  const [nfts, setNfts] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { marketplaceContract, nftContract, isReady, network, searchStr } = useContext(Web3Context)
  const nDisp = 60
  const dispatch = useDispatch()

  useEffect(() => {
    loadNFTs()
  }, [isReady])
  async function loadNFTs () {
    if (!isReady) return
    const startTime = new Date()
    const data = await marketplaceContract.fetchAvailableMarketItems()

    // why this doesn't work? could sort the raw data now and avoid sorting later
    // data.forEach(element => { console.log('element6:', parseInt(element[6]._hex, 16)) })
    // data.sort(function (a, b) { const ai = parseInt(a[6]._hex, 16); const bi = parseInt(b[6]._hex, 16); return ai < bi ? 1 : (ai === bi ? 0 : -1) })

    const endTime0 = new Date()
    const diff = endTime0 - startTime
    console.log('data', data.length, 'time elapsed', diff)
    // some tests
    // const Data = [...data, ...data, ...data, ...data]
    // check if we need to cheat
    const items = searchStr.length || data.length < nDisp ? await Promise.all(data.map(mapAvailableMarketItems(nftContract))) : await getItems(data, 0, nDisp)
    const endTime = new Date()
    const diff1 = endTime - endTime0
    console.log('items', items.length, 'time elapsed', diff1)

    // filter, sort items here
    items.sort(function (a, b) { const ai = parseInt(a.price); const bi = parseInt(b.price); return ai < bi ? 1 : (ai === bi ? 0 : -1) })
    let i = 0
    let j = 0
    const fItems = []
    for (i = 0; i < items.length; i++) { const r = new RegExp(searchStr, 'gi'); if (searchStr.length === 0 || (items[i].name && items[i].name.length && r.test(items[i].name)) || (items[i].description && items[i].description.length && r.test(items[i].description)) || (items[i].tags && items[i].tags.length && r.test(items[i].tags))) { fItems[j] = items[i]; j++ } }
    setNfts(fItems)
    setFilteredItems(fItems)

    // now if we cheated earlier, do async mapping the rest and save results to store
    if (searchStr.length === 0 && data.length >= nDisp) {
      setItems(data, fItems)
    }
    setIsLoading(false)
  }
  async function setItems (data, items) {
    let i = 0
    let j = 0
    const restItems = await getItems(data, nDisp, data.length)
    const totalItems = [...items, ...restItems]
    totalItems.sort(function (a, b) { const ai = parseInt(a.price); const bi = parseInt(b.price); return ai < bi ? 1 : (ai === bi ? 0 : -1) })
    const totalFilteredItems = []
    for (i = 0; i < totalItems.length; i++) { const r = new RegExp(searchStr, 'gi'); if (searchStr.length === 0 || (totalItems[i].name && totalItems[i].name.length && r.test(totalItems[i].name)) || (totalItems[i].description && totalItems[i].description.length && r.test(totalItems[i].description)) || (totalItems[i].tags && totalItems[i].tags.length && r.test(totalItems[i].tags))) { totalFilteredItems[j] = totalItems[i]; j++ } }
    // if you await setItems, it's good
    setFilteredItems(totalFilteredItems)
    // save to store
    dispatch(getData(totalFilteredItems))
    console.log('totalFiltered', totalFilteredItems.length)
  }
  async function getItems (data, start, n) {
    const slicedArray = await data.slice(start, n)
    const Result = await Promise.all(slicedArray.map(mapAvailableMarketItems(nftContract)))
    return Result
  }
  if (!network) return <UnsupportedChain/>
  if (isLoading) return <LinearProgress/>
  if (!isLoading && !nfts.length) return <h1>No NFTs for sale</h1>
  return (
    <NFTCardList nfts={nfts} setNfts={setNfts} filteredItems={filteredItems} withCreateNFT={false}/>
  )
}
