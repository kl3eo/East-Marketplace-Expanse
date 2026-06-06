import { useContext, useEffect, useState } from 'react'
import { NFTModalContext } from '../src/components/providers/NFTModalProvider'
import { useRouter } from 'next/router'
import NFTCardList from '../src/components/organisms/NFTCardList'
import { Web3Context } from '../src/components/providers/Web3Provider'
import { LinearProgress } from '@mui/material'
import UnsupportedChain from '../src/components/molecules/UnsupportedChain'
import { mapAvailableMarketItems } from '../src/utils/nft'
import { useDispatch, useSelector } from 'react-redux'
import { getData, setCurrentDisp, setLoading, setFullyLoaded, setSomethingLoaded, setChu, setCateg, setLookup, setLooping, setNum, setBeau, setRelo, setCurrentSlice, setLightBgr } from '../store/actions/dataAction'
import { store } from '../store/store'
import { isMobile } from 'react-device-detect'

const currentServer = process.env.CURRENT_SERVER
const currentServerPort = process.env.CURRENT_SERVER_PORT

const randomBeauty = Math.floor(Math.random() * 1024)
const mydocs = typeof window !== 'undefined' && window.location.hostname === 'mydocs.room-house.com'
const split96 = typeof window !== 'undefined' && window.location.hostname === 'split.room-house.com'
const bestnft = typeof window !== 'undefined' && window.location.hostname === 'nft.room-house.com'
const goodNotebook = typeof window !== 'undefined' && window.screen.width > 1600
const hiResScreen = typeof window !== 'undefined' && window.screen.width >= 1920

export default function Home () {
  const [nfts, setNfts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { setIsDescOpen } = useContext(NFTModalContext)
  const { marketplaceContract, nftContract, isReady, network } = useContext(Web3Context)

  const dispatch = useDispatch()
  const storedFilteredItemsList = useSelector(state => state.storedFilteredItemsList)
  const { lookupStr, categStr, fullyLoaded } = storedFilteredItemsList

  const { asPath } = useRouter()
  useEffect(() => {
    dispatch(setRelo(false))
    dispatch(setCurrentSlice(0))
    dispatch(setCurrentDisp(0))
    dispatch(getData([]))
    if (mydocs || split96 || bestnft) dispatch(setLightBgr(true))
    if (mydocs || split96 || bestnft) setIsDescOpen(false)
    console.log('setting beau to', randomBeauty)
    dispatch(setBeau(randomBeauty))
    // here parse URL
    console.log('pathname', asPath)
    const paths = asPath.split('?')
    if (paths[1] && paths[1].length) {
      console.log('path', paths[1])
      const t = decodeURIComponent(paths[1]).length > 2 ? decodeURIComponent(paths[1]) : 'Please refine your search to contain at least 3 symbols!'
      if (!lookupStr.length && !t.match(/(&|\||!)/g)) dispatch(setCateg(t))
      if (lookupStr.length || t.match(/(&|\||!)/g)) { dispatch(setLookup(t)); dispatch(setSomethingLoaded(true)) }
    }
    // if (!/my-nfts$/i.test(paths[0]) && typeof window !== 'undefined' && window.location.hostname === 'mydocs.room-house.com') window.location.href = '/my-nfts'
  }, [])
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hostname !== 'happyminter.room-house.com' && window.location.hostname !== 'happydox.room-house.com') loadNFTs()
  }, [isReady, lookupStr, categStr])
  useEffect(() => {
    // document.body.style.zoom = typeof window !== 'undefined' && window.location.hostname === 'ooc.room-house.com' ? '110%' : '110%'
    if (document.getElementById('stats_bar') && !isMobile) document.getElementById('stats_bar').style.display = 'block'
  }, [])

  async function loadNFTs () {
    console.log('point1')
    if (!isReady) { console.log('return not ready'); dispatch(setLoading(true)); return }
    const startTime = new Date()
    const state = store.getState()
    const storedFilteredItemsList = state.storedFilteredItemsList
    const { storedFilteredItems, currentDisp, lookupStr, categStr, currentSlice, beau, scalingAllowed } = storedFilteredItemsList
    const grab = scalingAllowed && hiResScreen ? 96 : 48
    const nDisp = scalingAllowed && hiResScreen ? 24 : goodNotebook ? 12 : 12
    const nSizeArr = isMobile ? 1 : scalingAllowed && hiResScreen ? 12 : goodNotebook ? 6 : 4
    console.log('got current disp', currentDisp, 'lookup', lookupStr, 'categ', categStr, 'slice', currentSlice, 'beau', beau)
    let rawData = []
    if (lookupStr && lookupStr.length) {
      const fData = new FormData()
      fData.append('grab', grab)
      fData.append('beau', beau)
      fData.append('lookupstr', lookupStr)
      fData.append('sixinro', goodNotebook)
      if (typeof window !== 'undefined') fData.append('loco', window.location.hostname)
      if (categStr && categStr.length) fData.append('categstr', categStr)
      if (window.location.hostname === 'nudenft.room-house.com') fData.append('theme', 'nude')
      if (window.location.hostname === 'shopping.room-house.com') fData.append('theme', 'eshopping')
      if (window.location.hostname === 'selfi.room-house.com' || window.location.hostname === 'selfie.room-house.com') fData.append('theme', 'portrait')
      await fetch('https://' + currentServer + '.room-house.com' + currentServerPort + '/cgi/get_data.pl', { body: fData, method: 'post', enctype: 'multipart/form-data' })
        .then((response) => response.json())
        .then((result) => { rawData = result.map((element) => parseInt(element[0])); rawData = rawData.filter(item => item !== 9598); dispatch(setNum(rawData.length)) })
        .catch((err) => { console.log('Fetch fData Error', err) })
    } else {
      const fData = new FormData()
      fData.append('grab', grab)
      fData.append('beau', beau)
      fData.append('lookupstr', '')
      fData.append('nextchunk', 0)
      fData.append('sixinro', goodNotebook)
      if (typeof window !== 'undefined') fData.append('loco', window.location.hostname)
      if (categStr && categStr.length) fData.append('categstr', categStr)
      if (typeof window !== 'undefined' && window.location.hostname === 'nudenft.room-house.com') fData.append('theme', 'nude')
      if (typeof window !== 'undefined' && window.location.hostname === 'shopping.room-house.com') fData.append('theme', 'eshopping')
      if (typeof window !== 'undefined' && (window.location.hostname === 'selfi.room-house.com' || window.location.hostname === 'selfie.room-house.com')) fData.append('theme', 'portrait')
      await fetch('https://' + currentServer + '.room-house.com' + currentServerPort + '/cgi/get_data.pl', { body: fData, method: 'post', enctype: 'multipart/form-data' })
        .then((response) => response.json())
        .then((result) => { rawData = result.map((element) => parseInt(element[0])); rawData = rawData.filter(item => item !== 9598); dispatch(setNum(rawData.length)) })
        .catch((err) => { console.log('Fetch fData Error', err) })
    }
    console.log('rawData', rawData)

    let data = []

    try {
      if (rawData.length > nSizeArr && (lookupStr && lookupStr.length)) {
        const raw = rawData.slice(rawData.length - nSizeArr, rawData.length)
        const leave = rawData.slice(0, rawData.length - nSizeArr)
        data = split96 || mydocs ? await marketplaceContract.fetchMoreMarketItemsByMarketItemIds(raw, 1) : await marketplaceContract.fetchMarketItemsByMarketItemIds(raw, 1)
        dispatch(setFullyLoaded(false)); console.log('falser 1')
        dispatch(setLooping(true))
        setTimeout(() => { finishLookupResult(leave, data); console.log('delayed finishLookupResult') }, 500)
      } else {
        data = rawData.length ? split96 || mydocs ? await marketplaceContract.fetchMoreMarketItemsByMarketItemIds(rawData, 1) : await marketplaceContract.fetchMarketItemsByMarketItemIds(rawData, 1) : []
        // dispatch(setFullyLoaded(true)); console.log('truer 6')
        dispatch(setChu(1))
      }
    } catch (error) { console.log(error); alert('Please re-open Metamask and reload this page!'); return }

    console.log('got data length', data.length); if (!data.length) { alert('No data found!'); dispatch(setFullyLoaded(true)) }
    let arrayForSort = []
    if (rawData.length > 0) {
      const reduced = []; let ii = 0
      // check only marketplace items are scoped
      for (ii = 0; ii < data.length; ii++) { const el = data[ii]; if (parseInt(el[2]._hex, 16) !== 0) { reduced.push(el) } }
      arrayForSort = [...reduced]
    } else {
      arrayForSort = [...data]
    }

    // data = arrayForSort.reverse()
    data = arrayForSort

    const endTime0 = new Date()
    const diff = endTime0 - startTime
    console.log('data', data.length, 'time elapsed', diff)
    // some tests
    // const Data = [...data, ...data, ...data, ...data]
    // check if we need to cheat
    const items = lookupStr.length || data.length < nDisp ? await Promise.all(data.map(mapAvailableMarketItems(nftContract))) : await getItems(data, 0, nDisp)
    // const endTime = new Date()
    // const diff1 = endTime - endTime0
    // console.log('items', items, 'time elapsed', diff1)
    const ti = lookupStr.length ? 500 : 1000; setTimeout(() => { dispatch(setSomethingLoaded(true)) }, ti)
    const fItems = [...items]
    // console.log('Here stored', storedFilteredItems, 'lookupStr', lookupStr)

    let changer = ((storedFilteredItems && storedFilteredItems.length === 0) || (lookupStr && lookupStr.length)) ? fItems : storedFilteredItems
    // console.log('Here changer', changer, 'current', currentDisp)
    if (typeof changer === 'undefined') changer = fItems
    if ((storedFilteredItems && storedFilteredItems.length === 0) || (lookupStr && lookupStr.length) || (changer.length && currentDisp !== data.length)) { setNfts(changer); dispatch(setCurrentDisp(changer.length)); console.log('scroll10'); window.scrollTo({ top: 0, behavior: 'smooth' }); console.log('set nfts to changer!', changer.length, 'lookup is', lookupStr); if (changer.length < nSizeArr) { dispatch(setFullyLoaded(true)); console.log('truer 7') } }

    // now if we cheated earlier, do async mapping the rest and save results to store

    if (lookupStr.length === 0 && data.length >= nDisp && storedFilteredItems.length < data.length) {
      console.log('calling setItems, lookup', lookupStr, 'data length', data.length, 'currDisp', currentDisp)
      dispatch(setFullyLoaded(false)); console.log('falser 1a')
      dispatch(setLoading(true))
      setItems(data, fItems)
    } else { const ti1 = lookupStr.length ? 100 : 1000; setTimeout(() => { dispatch(setSomethingLoaded(true)) }, ti1) }
    setIsLoading(false)
    if ((lookupStr && lookupStr.length > 0) || data.length < nDisp) { console.log('scroll11'); window.scrollTo({ top: 0, behavior: 'smooth' }); dispatch(setLoading(false)); setTimeout(() => { dispatch(setSomethingLoaded(true)) }, 100) }
  } // end loadNFTs

  async function finishLookupResult (leave, data) {
    const state = store.getState()
    const storedFilteredItemsList = state.storedFilteredItemsList
    const { scalingAllowed } = storedFilteredItemsList
    const nSizeArr = isMobile ? 1 : scalingAllowed && hiResScreen ? 12 : goodNotebook ? 6 : 4
    let iii = 0; let iiii = 0; const k = Math.floor(leave.length / nSizeArr) + 1
    let dada = []; let lookupItems = []
    const firstData = [...data]
    let oldLookupStr = ''
    let oldCategStr = ''
    console.log('in finishLookupResult: leave is', leave, 'k is', k)
    for (iii = 0; iii < k; iii++) {
      const state = store.getState()
      const storedFilteredItemsList = state.storedFilteredItemsList
      const { fullyLoaded, lookupStr, categStr, looping } = storedFilteredItemsList
      // BREAK THE LOOP ON NEW SEARCH
      if (lookupStr.length === 0 || (oldLookupStr !== '' && oldLookupStr !== lookupStr) || (oldCategStr !== '' && oldCategStr !== categStr)) { console.log('loop broken, lookup:', lookupStr, 'categ:', categStr, 'looping:', looping); break }
      oldLookupStr = lookupStr; oldCategStr = categStr
      let spinner = fullyLoaded ? 1 : 0
      while (spinner === 1) {
        const state = store.getState()
        const storedFilteredItemsList = state.storedFilteredItemsList
        const { fullyLoaded } = storedFilteredItemsList
        await makeDelay(500)
        // console.log('after delay, fully?', fullyLoaded, 'old', oldLookupStr, 'cur', lookupStr)
        if (!fullyLoaded) spinner = 0
      }
      const reducedInt = []
      const start = leave.length - iii * nSizeArr - nSizeArr > 0 ? leave.length - iii * nSizeArr - nSizeArr : 0
      const raw = leave.slice(start, leave.length - iii * nSizeArr)
      const da = split96 || mydocs ? await marketplaceContract.fetchMoreMarketItemsByMarketItemIds(raw, 1) : await marketplaceContract.fetchMarketItemsByMarketItemIds(raw, 1)
      dada = [...da, ...dada]
      // console.log('more data', iii, dada.length)
      data = [...dada, ...firstData]
      for (iiii = 0; iiii < data.length; iiii++) { const el = data[iiii]; if (parseInt(el[2]._hex, 16) !== 0) { reducedInt.push(el) } }
      // save intermediate result to store
      if (!isMobile) { document.getElementById('toggleLightBgr').style.backgroundColor = '#369' }
      lookupItems = await getItems(reducedInt, 0, reducedInt.length)
      document.getElementById('toggleLightBgr').style.backgroundColor = '#234'
      setTimeout(() => { const state = store.getState(); const storedFilteredItemsList = state.storedFilteredItemsList; const { fullyLoaded, lookupStr } = storedFilteredItemsList; if ((!fullyLoaded && lookupStr.length) || iii === k - 1 || iii === k) setNfts(lookupItems) }, 100)
      if (iii === k - 1) dispatch(getData(lookupItems))
    }
    dispatch(setLooping(false))
    console.log('finished adding lookup result', data.length)
    dispatch(setFullyLoaded(true)); console.log('truer 7')
    if (isMobile) { document.getElementById('fixbar').style.display = 'none' }
  }

  async function setItems (data, items) {
    // fake loading in 1 sec
    const ti2 = lookupStr.length ? 100 : 1000
    const state = store.getState()
    const storedFilteredItemsList = state.storedFilteredItemsList
    const { scalingAllowed } = storedFilteredItemsList
    const nDisp = scalingAllowed && hiResScreen ? 24 : goodNotebook ? 12 : 12
    setTimeout(() => { dispatch(setLoading(false)); console.log('TIMEOUT2') }, 1000)
    const leave = data.slice(nDisp, data.length); let nowItems = [...items]
    let iii = 0; const k = Math.floor(leave.length / nDisp) + 1
    if (k <= 2) setTimeout(() => { dispatch(setSomethingLoaded(true)) }, ti2)
    for (iii = 0; iii < k; iii++) {
      const start = iii * nDisp
      const end = iii * nDisp + nDisp > leave.length ? leave.length : iii * nDisp + nDisp
      const da = leave.slice(start, end)
      // console.log('try to get more items on step', iii)
      const moreItems = await getItems(da, 0, da.length)
      // console.log('more items', moreItems)
      nowItems = [...nowItems, ...moreItems]; if (k > 2 && iii === 0) setTimeout(() => { dispatch(setSomethingLoaded(true)) }, ti2)
      const state = store.getState()
      const storedFilteredItemsList = state.storedFilteredItemsList
      const { lookupStr, categStr, fullyLoaded, loading } = storedFilteredItemsList
      // TODO: here is a subtle race condition - select a categ within ~1 sec after main window started loading
      if (lookupStr.length === 0 && iii === 0) {
        setNfts(nowItems)
        console.log('set to nowItems', nowItems)
        dispatch(getData(nowItems))
        dispatch(setFullyLoaded(true)); console.log('truer 8')
      } else {
        if (lookupStr.length) return
        if (categStr.length && (!fullyLoaded || loading)) return
        if (Math.floor(iii / 10) * 10 === iii || !isMobile) { dispatch(getData(nowItems)) /* dispatch(setAutoScroll(true)) */ }
        // if (isMobile) { dispatch(setAutoScroll(true)) }
        document.getElementById('toggleLightBgr').style.fontSize = '36px'
        setTimeout(() => { document.getElementById('toggleLightBgr').style.fontSize = '20px'; document.getElementById('toggleLightBgr').style.backgroundColor = '#234'; window.scrollTo({ top: window.pageYOffset - 1, behavior: 'smooth' }) }, 1000)
      }
    }
    if (lookupStr.length === 0) {
      dispatch(getData(nowItems))
      dispatch(setLoading(false))
      dispatch(setFullyLoaded(true)); console.log('truer 9')
      console.log('totalFiltered', nowItems.length)
    }
  }

  function makeDelay (milliseconds) {
    return new Promise(resolve => {
      setTimeout(resolve, milliseconds)
    })
  }

  async function getItems (data, start, n) {
    const slicedArray = await data.slice(start, n)
    console.log('in getItems: data', data, 'start', start, 'n', n)
    const Result = await Promise.all(slicedArray.map(mapAvailableMarketItems(nftContract)))
    return Result
  }

  if (!network) return <UnsupportedChain style={{ marginTop: '64px' }}/>
  if (isLoading) return <LinearProgress style={{ marginTop: '64px' }}/>
  if (!fullyLoaded && !isLoading && !nfts.length && lookupStr.length === 0 && categStr.length === 0) return <LinearProgress style={{ marginTop: '64px' }}/>
  if (fullyLoaded && !isLoading && !nfts.length && lookupStr.length) return <h1 style={{ marginTop: '64px' }}>No data found for search: { lookupStr } { categStr } </h1>

  return (
    typeof window !== 'undefined' && window.location.hostname !== 'happyminter.room-house.com' && window.location.hostname !== 'happydox.room-house.com' && <NFTCardList nfts={nfts} setNfts={setNfts} withCreateNFT={false}/>
  )
}
