import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import NFTCardList from '../src/components/organisms/NFTCardList'
import { Web3Context } from '../src/components/providers/Web3Provider'
import { LinearProgress } from '@mui/material'
import UnsupportedChain from '../src/components/molecules/UnsupportedChain'
import { mapAvailableMarketItems } from '../src/utils/nft'
import { useDispatch, useSelector } from 'react-redux'
import { getData, setCurrentDisp, setLoading, setFullyLoaded, setLookup } from '../store/actions/dataAction'
import { store } from '../store/store'

export default function Home () {
  const [nfts, setNfts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { marketplaceContract, nftContract, isReady, network } = useContext(Web3Context)
  const nDisp = 32
  const dispatch = useDispatch()
  const storedFilteredItemsList = useSelector(state => state.storedFilteredItemsList)
  const { lookupStr, currentDisp } = storedFilteredItemsList
  const { asPath } = useRouter()
  useEffect(() => {
    console.log('pathname', asPath)
    const paths = asPath.split('?')
    if (paths[1] && paths[1].length) {
      console.log('path', paths[1])
      dispatch(setLookup(decodeURIComponent(paths[1])))
    }
  }, [])
  useEffect(() => {
    loadNFTs()
  }, [isReady, lookupStr])

  async function loadNFTs () {
    console.log('point1')
    if (!isReady) { console.log('return not ready'); dispatch(setLoading(true)); return }
    const startTime = new Date()
    let data = await marketplaceContract.fetchAvailableMarketItems()
    console.log('got data length', data.length)
    const state = store.getState()
    const storedFilteredItemsList = state.storedFilteredItemsList
    const { storedFilteredItems, currentDisp, lookupStr, currentSlice } = storedFilteredItemsList
    console.log('got current disp', currentDisp, 'lookup', lookupStr, 'slice', currentSlice)

    // data.forEach(element => { console.log('element6:', parseInt(element[6]._hex, 16) / 1000000000000000000) })
    const arrayForSort = [...data]
    // arrayForSort.sort(function (a, b) { const ai = parseInt(a[6]._hex, 16) / 1000000000000000000; const bi = parseInt(b[6]._hex, 16) / 1000000000000000000; return ai < bi ? 1 : (ai === bi ? 0 : -1) })
    // data = arrayForSort.sort().reverse()
    data = arrayForSort.reverse()
    // data = arrayForSort

    const endTime0 = new Date()
    const diff = endTime0 - startTime
    console.log('data', data.length, 'time elapsed', diff)
    // some tests
    // const Data = [...data, ...data, ...data, ...data]
    // check if we need to cheat
    const items = lookupStr.length || data.length < nDisp ? await Promise.all(data.map(mapAvailableMarketItems(nftContract))) : await getItems(data, 0, nDisp)
    const endTime = new Date()
    const diff1 = endTime - endTime0
    // console.log('items', items.length, 'time elapsed', diff1)
    console.log('items', items, 'time elapsed', diff1)

    // filter, sort items here -- UPDATE: sorted already while receiving data
    // items.sort(function (a, b) { const ai = parseInt(a.price); const bi = parseInt(b.price); return ai < bi ? 1 : (ai === bi ? 0 : -1) })
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

    if (lookupStr.length === 0 && data.length >= nDisp && storedFilteredItems.length < data.length) {
      console.log('calling setItems, lookup', lookupStr, 'data length', data.length, 'currDisp', currentDisp)
      // not too slow, but iframes reload a couple times
      // dispatch(setLoading(false))
      dispatch(setFullyLoaded(false))
      setItems(data, fItems)
    }
    setIsLoading(false)
    if ((lookupStr && lookupStr.length > 0) || currentDisp < nDisp) dispatch(setLoading(false))
  }

  async function setItems (data, items) {
    let i = 0
    let j = 0
    // fake loading in 2 sec
    setTimeout(() => { dispatch(setLoading(false)) }, 2000)
    const restItems = await getItems(data, nDisp, data.length)
    const totalItems = [...items, ...restItems]
    // totalItems.sort(function (a, b) { const ai = parseInt(a.price); const bi = parseInt(b.price); return ai < bi ? 1 : (ai === bi ? 0 : -1) })
    const totalFilteredItems = []
    for (i = 0; i < totalItems.length; i++) { const r = new RegExp(lookupStr, 'gi'); if (lookupStr.length === 0 || (totalItems[i].name && totalItems[i].name.length && r.test(totalItems[i].name)) || (totalItems[i].description && totalItems[i].description.length && r.test(totalItems[i].description)) || (totalItems[i].tags && totalItems[i].tags.length && r.test(totalItems[i].tags))) { totalFilteredItems[j] = totalItems[i]; j++ } }

    // save to store
    dispatch(getData(totalFilteredItems))
    // too slow?
    dispatch(setLoading(false))
    dispatch(setFullyLoaded(true))
    console.log('totalFiltered', totalFilteredItems.length)
  }

  async function getItems (data, start, n) {
    const slicedArray = await data.slice(start, n)
    const Result = await Promise.all(slicedArray.map(mapAvailableMarketItems(nftContract)))
    return Result
  }
  /* async function getItems (data, n) {
    const slicedArray1 = await data.slice(0, n)
    const slicedArray2 = await data.slice(n, 2 * n)
    const Promise1 = Promise.all(slicedArray1.map(mapAvailableMarketItems(nftContract)))
    const Promise2 = Promise.all(slicedArray2.map(mapAvailableMarketItems(nftContract)))
    const Result1 = await Promise1
    const Result2 = await Promise2
    // return Result1.concat(Result2)
    return [...Result1, ...Result2]
  } */
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
  console.log('point2, nfts length', nfts.length, 'currDisp', currentDisp)
  return (
    <NFTCardList nfts={nfts} setNfts={setNfts} withCreateNFT={false}/>
  )
}
