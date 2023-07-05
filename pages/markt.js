import { useContext, useEffect, useState } from 'react'
import NFTCardList from '../src/components/organisms/NFTCardList'
import { Web3Context } from '../src/components/providers/Web3Provider'
import { LinearProgress } from '@mui/material'
import UnsupportedChain from '../src/components/molecules/UnsupportedChain'
import { mapAvailableMarketItems } from '../src/utils/nft'
import { useDispatch, useSelector } from 'react-redux'
import { getData, setCurrentDisp, setLoading } from '../store/actions/dataAction'
import { store } from '../store/store'

export default function Markt () {
  const [nfts, setNfts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { marketplaceContract, nftContract, isReady, network } = useContext(Web3Context)
  const nDisp = 60
  const dispatch = useDispatch()
  const storedFilteredItemsList = useSelector(state => state.storedFilteredItemsList)
  const { lookupStr, currentDisp } = storedFilteredItemsList
  useEffect(() => {
    loadNFTs()
  }, [isReady, lookupStr])

  async function loadNFTs () {
    console.log('point1')
    if (!isReady) { console.log('return not ready'); dispatch(setLoading(true)); return }
    const startTime = new Date()
    const data = await marketplaceContract.fetchAvailableMarketItems()
    console.log('got data length', data.length)
    const state = store.getState()
    const storedFilteredItemsList = state.storedFilteredItemsList
    const { storedFilteredItems, currentDisp, lookupStr } = storedFilteredItemsList
    console.log('got current disp', currentDisp, 'lookup', lookupStr)

    // why this doesn't work? could sort the raw data now and avoid sorting later
    // data.forEach(element => { console.log('element6:', parseInt(element[6]._hex, 16)) })
    // data.sort(function (a, b) { const ai = parseInt(a[6]._hex, 16); const bi = parseInt(b[6]._hex, 16); return ai < bi ? 1 : (ai === bi ? 0 : -1) })

    const endTime0 = new Date()
    const diff = endTime0 - startTime
    console.log('data', data.length, 'time elapsed', diff)
    // some tests
    // const Data = [...data, ...data, ...data, ...data]
    // check if we need to cheat
    const items = lookupStr.length || data.length < nDisp ? await Promise.all(data.map(mapAvailableMarketItems(nftContract))) : await getItems(data, 0, nDisp)
    const endTime = new Date()
    const diff1 = endTime - endTime0
    console.log('items', items.length, 'time elapsed', diff1)

    // filter, sort items here
    items.sort(function (a, b) { const ai = parseInt(a.price); const bi = parseInt(b.price); return ai < bi ? 1 : (ai === bi ? 0 : -1) })
    let i = 0
    let j = 0
    const fItems = []
    for (i = 0; i < items.length; i++) { const r = new RegExp(lookupStr, 'gi'); if (lookupStr.length === 0 || (items[i].name && items[i].name.length && r.test(items[i].name)) || (items[i].description && items[i].description.length && r.test(items[i].description)) || (items[i].tags && items[i].tags.length && r.test(items[i].tags))) { fItems[j] = items[i]; j++ } }
    console.log('Here stored', storedFilteredItems, 'lookupStr', lookupStr)

    let changer = ((storedFilteredItems && storedFilteredItems.length === 0) || (lookupStr && lookupStr.length)) ? fItems : storedFilteredItems
    console.log('Here changer', changer, 'current', currentDisp)
    if (typeof changer === 'undefined') changer = fItems
    if ((storedFilteredItems && storedFilteredItems.length === 0) || (lookupStr && lookupStr.length) || (changer.length && currentDisp !== data.length)) { setNfts(changer); dispatch(setCurrentDisp(changer.length)); console.log('set nfts to changer!', changer.length, 'lookup is', lookupStr) }

    // now if we cheated earlier, do async mapping the rest and save results to store
    if (lookupStr.length === 0 && data.length >= nDisp && changer.length < data.length) {
      console.log('calling setItems, lookup', lookupStr, 'data length', data.length, 'currDisp', currentDisp)
      setItems(data, fItems)
    }
    setIsLoading(false)
    if (lookupStr && lookupStr.length > 0) dispatch(setLoading(false))
  }

  async function setItems (data, items) {
    let i = 0
    let j = 0
    const restItems = await getItems(data, nDisp, data.length)
    const totalItems = [...items, ...restItems]
    totalItems.sort(function (a, b) { const ai = parseInt(a.price); const bi = parseInt(b.price); return ai < bi ? 1 : (ai === bi ? 0 : -1) })
    const totalFilteredItems = []
    for (i = 0; i < totalItems.length; i++) { const r = new RegExp(lookupStr, 'gi'); if (lookupStr.length === 0 || (totalItems[i].name && totalItems[i].name.length && r.test(totalItems[i].name)) || (totalItems[i].description && totalItems[i].description.length && r.test(totalItems[i].description)) || (totalItems[i].tags && totalItems[i].tags.length && r.test(totalItems[i].tags))) { totalFilteredItems[j] = totalItems[i]; j++ } }

    // save to store
    dispatch(getData(totalFilteredItems))
    dispatch(setLoading(false))
    console.log('totalFiltered', totalFilteredItems.length)
  }

  async function getItems (data, start, n) {
    const slicedArray = await data.slice(start, n)
    const Result = await Promise.all(slicedArray.map(mapAvailableMarketItems(nftContract)))
    return Result
  }
  // return useMemo(() => {
  if (!network) return <UnsupportedChain/>
  if (isLoading) return <LinearProgress/>
  if (!isLoading && !nfts.length) return <h1>No NFTs for sale</h1>
  console.log('point2, nfts length', nfts.length, 'currDisp', currentDisp)
  return (
    <NFTCardList nfts={nfts} setNfts={setNfts} withCreateNFT={false}/>
  )
  // }, [isReady])
}
