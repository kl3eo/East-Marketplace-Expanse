import { isMobile } from 'react-device-detect'
import InfiniteScroll from 'react-infinite-scroll-component'
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import Fade from '@mui/material/Fade'
import { makeStyles } from '@mui/styles'
import NFTCard from '../molecules/NFTCard'
import EmailCard from '../molecules/EmailCard'
import NFTCardCreation from '../molecules/NFTCardCreation'
import NFTDummyCard from '../molecules/NFTDummyCard'
import useContactForm from '../../hooks/useContactForm'
import sendEmail from '../../utils/sendEmail'
import { render } from '@react-email/render'
import { ethers } from 'ethers'
import { Web3Context } from '../providers/Web3Provider'
import { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { mapCreatedAndOwnedTokenIdsAsMarketItemsOld, mapAvailableMarketItems } from '../../utils/nft'
import { store } from '../../../store/store'
import { useDispatch, useSelector } from 'react-redux'
import { setAutoScroll, setCurrentDisp, setCurrentSlice, getData, setFullyLoaded, setChu, setLoading, setLooping, setRelo, setNum, setCurrDiff } from '../../../store/actions/dataAction'
import { NFTModalContext } from '../providers/NFTModalProvider'
import axios from 'axios'

const useStyles = makeStyles((theme) => ({
  grid: {
    spacing: 3,
    alignItems: 'stretch'
  },
  gridItem: {
    display: 'flex',
    transition: 'all .3s',
    [theme.breakpoints.down('sm')]: {
      margin: '0 20px'
    }
  }
}))

const currentServer = process.env.CURRENT_SERVER
const currentServerPort = process.env.CURRENT_SERVER_PORT
const resServer = process.env.RES_SERVER
const resServerPort = process.env.RES_SERVER_PORT
let upTimeout
let downTimeout
// const withRetard = !isMobile
const withRetard = true
let retardSlice
let numSlice
let scrollingDisabled = false
let maxOffs = 0

const isMobb = isMobile || window.innerWidth <= 640
const happydox = typeof window !== 'undefined' && window.location.hostname === 'happydox.room-house.com'
const mydocs = typeof window !== 'undefined' && window.location.hostname === 'mydocs.room-house.com'
const split96 = typeof window !== 'undefined' && window.location.hostname === 'split.room-house.com'
// const bestnft = typeof window !== 'undefined' && window.location.hostname === 'nft.room-house.com'
const notebook = typeof window !== 'undefined' && window.screen.width < 1920
// const standardLaptop = typeof window !== 'undefined' && window.screen.width < 1440
const goodNotebook = typeof window !== 'undefined' && window.screen.width > 1600
const hiResScreen = typeof window !== 'undefined' && window.screen.width >= 1920
/* const hiResScreen1 = typeof window !== 'undefined' && window.screen.width > 2144
const hiResScreen2 = typeof window !== 'undefined' && window.screen.width > 2400
const hiResScreen3 = typeof window !== 'undefined' && window.screen.width > 2880 */

export default function NFTCardList ({ nfts, setNfts, withCreateNFT }) {
  const { pathname } = useRouter()
  const bigger = pathname === '/my-nfts'
  const classes = useStyles()
  const [dimmed, setDimmed] = useState(false)
  // const [isHover, setIsHover] = useState(false)
  const [updown, setUpDown] = useState('')
  const [loadingMsg, setLoadingMsg] = useState('')
  const { values, handleChange } = useContactForm()
  const [chunkLoaded, setChunkLoaded] = useState(false)
  // const [contactShown, setContactShown] = useState(false)
  const [transferShown, setTransferShown] = useState(false)
  const [toBurn, setToBurn] = useState(false)
  const [numFound, setNumFound] = useState(0)
  const { account, marketplaceContract, nftContract } = useContext(Web3Context)
  const storedFilteredItemsList = useSelector(state => state.storedFilteredItemsList)
  const { storedFilteredItems, lookupStr, categStr, autoScroll, lightBgr, loading, fullyLoaded, somethingLoaded, scalingAllowed, relo } = storedFilteredItemsList
  const hideOffReq = 7000
  const { isDescOpen, currSize, currLang, isCategChangedInMenu } = useContext(NFTModalContext)
  // this param is grab/2 = number of items displayed before the first scroll down makes new row. 8 rows by 6 = 48
  // const numParam = isMobb ? 4 : scalingAllowed && hiResScreen && !split96 && !bestnft ? 48 : goodNotebook ? 24 : 24
  // const grab = scalingAllowed && hiResScreen ? 96 : 48
  // this works with zoom 110% on index.js
  // const lazyLoaderCatchParam = isMobb ? -225 : hiResScreen3 ? -150 : hiResScreen2 ? -120 : hiResScreen1 ? -90 : hiResScreen ? -64 : standardLaptop ? -16 : -36 // ?! ad hoc: as "Ctrl-" increases width, this param should compensate for cond1 (see below)
  const lazyLoaderCatchParam = isMobb ? 0 : -48
  const loadStr = nfts.length ? currLang === 'EN' ? 'loading' : 'загрузка' : ''
  const pleaseWait = currLang === 'EN' ? '..please wait..' : '..секундочку..'
  const contiNue = currLang === 'EN' ? 'CLICK TO CONTINUE' : 'ПРОДОЛЖИТЬ?'
  const Cancel = <a href='' onClick='window.location.reload()'>Cancel</a>
  const commonInformer = <div id={'commonInformer'} style={{ zIndex: '1012', display: 'none', position: 'fixed', width: '360px', height: '480px', borderRadius: '0.5vw', background: '#fed', color: '#369', padding: '5px', fontSize: '16px', textAlign: 'center' }}><div style={{ display: 'table-cell', verticalAlign: 'middle', margin: '0 auto' }}><div id={'informer_text'} style={{ width: '100%', fontSize: '14px', lineHeight: '24px', textAlign: 'left', padding: '3px' }}>Hash Match: &#x2705; OK, &#x274C; no, ? no data<hr/><div><b>File:</b> <span id={'informer_text_0'} style={{ background: '#fff', padding: '2px' }}></span></div><div><b>File Size:</b> <span id={'informer_text_0a'} style={{ background: '#fff', padding: '2px' }}></span></div><div><b>Sha256:</b> <span id={'informer_text_1'} style={{ background: '#fff', padding: '2px' }}></span><span style={{ fontSize: '24px' }} id={'informer_checkbox_1'}></span><span style={{ display: 'none' }} id={'informer_hidden_1'}></span>&nbsp;<span style={{ cursor: 'pointer', color: '#963' }} onClick={ async () => await navigator.clipboard.writeText(document.getElementById('informer_hidden_1_').innerText) }>Copy</span></div><div><b>Creator:</b> <span id={'informer_text_6'} style={{ background: '#fff', padding: '2px' }}></span><span style={{ display: 'none' }} id={'informer_hidden_6'}></span>&nbsp;<span style={{ cursor: 'pointer', color: '#963' }} onClick={ async () => await navigator.clipboard.writeText(document.getElementById('informer_hidden_6_').innerText) }>Copy</span></div><div><b>TX with data:</b> <span id={'informer_text_3'} style={{ background: '#fff', padding: '2px' }}></span><span style={{ display: 'none' }} id={'informer_hidden_3'}></span>&nbsp;<span style={{ cursor: 'pointer', color: '#963' }} onClick={ async () => await navigator.clipboard.writeText(document.getElementById('informer_hidden_3_').innerText) }>Copy</span></div><div><b>Token ID:</b> <span id={'informer_text_7'} style={{ background: '#fff', padding: '2px' }}></span></div><div><b>Minted at:</b> <span id={'informer_text_2'} style={{ background: '#fff', padding: '2px' }}></span></div><div><b>Mint in Block:</b> <span id={'informer_text_5'} style={{ background: '#fff', padding: '2px' }}></span></div><div><b>Title:</b> <span id={'informer_text_8'} style={{ background: '#fff', padding: '2px' }}></span></div><div><b>Description:</b> <span id={'informer_text_4'} style={{ background: '#fff', padding: '2px' }}></span></div></div><div style={{ width: '75px', textAlign: 'center', position: 'absolute', bottom: isMobile ? '22vh' : '2vw', right: isMobile ? '33vw' : '5px' }} onClick={() => { document.getElementById('commonInformer').style.display = 'none' }}><span style={{ display: 'inline', background: 'transparent', border: '1px solid #222', borderRadius: '3px', padding: '4px', cursor: 'pointer' }}>Close</span></div></div></div>
  let lastScrollTop = 0
  let beforeLastScrollTop = 0
  let directionUpDown = 1 // down

  let recently = 0
  let canRoll = 0

  useEffect(() => {
    clearTimeout(numSlice)
    numSlice = setTimeout(() => {
      const state = store.getState()
      const storedFilteredItemsList = state.storedFilteredItemsList
      const { num, lookupStr, fullyLoaded, scalingAllowed } = storedFilteredItemsList
      const to = num < 5 ? 1500 : num < 17 ? 1500 : 2000
      // this param is grab/2 = number of items displayed before the first scroll down makes new row. 8 rows by 6 = 48
      const numParam = isMobb ? 4 : scalingAllowed && hiResScreen ? 48 : goodNotebook ? 24 : 24
      if (lookupStr.length && num) { if (document.getElementById('office_bar')) document.getElementById('office_bar').style.display = 'none'; if (document.getElementById('stats_bar')) document.getElementById('stats_bar').style.display = 'none'; const items = currLang === 'EN' ? num === 1 ? 'item found' : 'items found' : num === 1 ? 'найден' : 'найдены'; dispatch(setFullyLoaded(false)); console.log('falser 15'); setLoadingMsg(num + ' ' + items); setNumFound(num); dispatch(setNum(0)); setTimeout(() => { if (num > numParam && !fullyLoaded) { setLoadingMsg('click to pause'); /* dispatch(setFullyLoaded(false)); */ if (isMobb) { document.getElementById('fixbar').style.display = 'inline' } } }, to) }
    }, 5000)
    fullyLoaded ? setLoadingMsg('') : console.log('toggled FL to', fullyLoaded)
    if (document.getElementById('stats_bar') && document.getElementById('stats_bar').style.display === 'block' && !categStr.length && !lookupStr.length) getStats()
    setTimeout(() => { if (document.getElementById('getRoom') && window.location.hostname === 'ooc.room-house.com') document.getElementById('getRoom').style.display = 'none'; if (document.getElementById('stats_bar')) document.getElementById('stats_bar').style.display = 'none' }, hideOffReq)
    typeof window !== 'undefined' && console.log('width', window.screen.width, 'height', window.screen.height, 'notebook', notebook)
  }, [fullyLoaded])

  useEffect(() => {
    maxOffs = 0
    console.log('set maxOffs to zero')
  }, [isDescOpen, currSize])

  useEffect(() => {
    if (document.getElementById('office_bar')) document.getElementById('office_bar').style.display = 'none'
  }, [autoScroll])

  useEffect(() => {
    console.log('USE_EFF, relo is', relo, 'lookupstr', lookupStr, 'categstr', categStr)
    dispatch(getData([]))
    // dispatch(setFullyLoaded(false)); console.log('falser 3')
    dispatch(setLoading(true))

    if ((!lookupStr.length && isMobb) || withCreateNFT) setLoadingMsg('')

    if (!relo) {
      window.addEventListener('scroll', withRelo)
      console.log('ADDED relo')
      dispatch(setRelo(true))
    }
    dispatch(setCurrentSlice(0))
    setUpDown('')
    setChunkLoaded(false)
    dispatch(setAutoScroll(false))
    document.getElementById('toggleLightBgr').style.backgroundColor = '#234'; document.getElementById('toggleLightBgr').style.fontSize = ' 20px' // set default
  }, [lookupStr, categStr])

  useEffect(() => {
    setLoadingMsg('')
    clearTimeout(downTimeout)
    clearTimeout(upTimeout)
    if (withRetard) clearTimeout(retardSlice)
    dispatch(setCurrDiff(0))
    // uncomment to enable setLookup and lookupStr search filter --ash 02/26 for split96
    /* if (categStr.length) {
      document.getElementById('searchInput').value = ''
      history.replaceState('', '', '/')
      dispatch(setLookup('')) // clear lookup
    } */
    // console.log('!!!!!!!!set diff to 0')
    if (categStr.length && !isCategChangedInMenu) document.getElementById('searchInput').value = categStr
    if (categStr.length) dispatch(setLooping(false)) // this allows onclicli
    setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, 1000)
    maxOffs = 0; recently = 0; lastScrollTop = 0; beforeLastScrollTop = 0; canRoll = 0
  }, [categStr])

  useLayoutEffect(() => {
    return () => {
      window.removeEventListener('scroll', withRelo)
      dispatch(setRelo(false))
      setLoadingMsg('')
    }
  }, [lookupStr])

  const dispatch = useDispatch()
  // let diff = 0

  function withRelo () {
    const state = store.getState()
    const storedFilteredItemsList = state.storedFilteredItemsList
    const { storedFilteredItems, currentDisp, currentSlice, relo, autoScroll } = storedFilteredItemsList

    setInterval(() => { beforeLastScrollTop = 0 }, 100)

    if (withCreateNFT) {
      // console.log('RELO1 in withRelo!', relo)
      if (relo) {
        window.removeEventListener('scroll', withRelo)
        // console.log('REMOVED relo1')
      }
      dispatch(setCurrentSlice(0))
      return
    }
    const st = window.pageYOffset || document.documentElement.scrollTop
    /* if (recently) console.log('')
    if (recently) console.log('pageYOffset', window.pageYOffset)
    if (recently) console.log('scrollTop', document.documentElement.scrollTop)
    if (recently) console.log('st', st)
    if (recently) console.log('lastScrollTop', lastScrollTop)
    if (recently) console.log('beforeLast', beforeLastScrollTop) */

    if (st > lastScrollTop) {
      directionUpDown = 1 // down
      if (recently && lastScrollTop > beforeLastScrollTop && beforeLastScrollTop !== 0) { document.getElementById('toggleLightBgr').style.backgroundColor = '#234'; clearTimeout(upTimeout); if (withRetard) clearTimeout(retardSlice); recently = 0; maxOffs = 0 }
    } else if (st < lastScrollTop) {
      directionUpDown = 0 // up
      if (recently && lastScrollTop < beforeLastScrollTop) { document.getElementById('toggleLightBgr').style.backgroundColor = '#234'; clearTimeout(downTimeout); if (withRetard) clearTimeout(retardSlice); recently = 0; maxOffs = 0; if (!isMobb) canRoll = 0; if (isMobb) canRoll = 1 /* ; console.log('CLEARED IN UP!!, bef is', beforeLastScrollTop, 'last is', lastScrollTop) */ }
      if (!recently && lastScrollTop < beforeLastScrollTop) { if (!isMobb) canRoll = 0 } // mobiles wouldn't roll at all, desktops ok
    } // else was horizontal scroll

    beforeLastScrollTop = lastScrollTop
    lastScrollTop = st <= 0 ? 0 : st

    if (window.pageYOffset < 0 || (lookupStr && lookupStr.length)) {
      console.log('this can be')
    } else { // block with currDiff
      const state = store.getState()
      const storedFilteredItemsList = state.storedFilteredItemsList
      const { currDiff, scalingAllowed, looping } = storedFilteredItemsList
      // this param is grab/2 = number of items displayed before the first scroll down makes new row. 8 rows by 6 = 48
      const numParam = isMobb ? 4 : scalingAllowed && hiResScreen ? 48 : goodNotebook ? 24 : 24
      const approxRows = currentSlice < 1 && currDiff === 0 ? parseInt((document.body.offsetHeight - window.innerHeight) / 16) : parseInt((document.body.offsetHeight - window.innerHeight) / numParam)
      // this param tells how many new items appear on scroll up/down the edge of the frame; default is 6 for 6/12-in-row, 4 for 4-in-row
      const itemsInRow = isMobile ? 1 : approxRows < 240 ? scalingAllowed && hiResScreen ? 6 : goodNotebook ? 6 : 4 : approxRows < 400 ? 2 : 1 // 200 -> 240 ?
      // const itemsInRow = 1 // ?!
      const step = isMobb ? approxRows === 1 ? 4000 : 2000 : 500
      // console.log('pageOffset is', window.pageYOffset, 'step is', step, 'length is', storedFilteredItems.length, 'slice is', currentSlice, 'height is', document.body.offsetHeight, 'inH', window.innerHeight)

      if ((window.pageYOffset > step || currentDisp < 16) && currentSlice < 1 && storedFilteredItems.length && storedFilteredItems.length > currentDisp) {
        const slicedStoredFilteredItems = storedFilteredItems.slice(0, numParam)
        setNfts(slicedStoredFilteredItems)
        console.log('SET NFTS1, offset is', window.pageYOffset, 'window inner height is', window.innerHeight, 'slicedStoredFilteredItems', slicedStoredFilteredItems)
        setLoadingMsg('')
        dispatch(setCurrentDisp(slicedStoredFilteredItems.length))
        dispatch(setCurrentSlice(1))
        canRoll = 0 // good
      }

      // console.log('pageOffset', window.pageYOffset)
      // console.log('offsetHeight', document.body.offsetHeight)
      // console.log('innerHeight', window.innerHeight)
      // console.log('rightSide', document.body.offsetHeight - window.innerHeight - lazyLoaderCatchParam)
      // console.log('currentSlice', currentSlice)
      // console.log('length', storedFilteredItems.length)
      // console.log('itemsInRow', itemsInRow)
      // console.log('currDiff', currDiff)
      // console.log('recently', recently)

      // console.log('cond1 is', window.pageYOffset > document.body.offsetHeight - window.innerHeight - lazyLoaderCatchParam, 'dir is', directionUpDown, 'maooff is', maxOffs, 'cond2', currentSlice < 2 + currDiff, 'length is', storedFilteredItems.length, 'cond3', storedFilteredItems.length > numParam + itemsInRow * currDiff, 'TOTAL_CONDITION_TO_SCROLL_DOWN', (((maxOffs === 0 && window.pageYOffset > document.body.offsetHeight - window.innerHeight - lazyLoaderCatchParam) || (maxOffs && maxOffs - window.pageYOffset < 10)) && currentSlice <= (2 + currDiff) && storedFilteredItems.length && storedFilteredItems.length > numParam + itemsInRow * currDiff && (directionUpDown || autoScroll) && !recently))

      if (((maxOffs === 0 && window.pageYOffset > document.body.offsetHeight - window.innerHeight - lazyLoaderCatchParam) || (maxOffs && maxOffs - window.pageYOffset < 10)) && currentSlice <= (2 + currDiff) && storedFilteredItems.length && storedFilteredItems.length > numParam + itemsInRow * currDiff && (directionUpDown || autoScroll) && !recently) {
        // if (autoScroll) canRoll = 1 // good, double take on first scroll down
        // if ((!mydocs && !goodNotebook) || autoScroll || hiResScreen) canRoll = 1 // no double take on first scroll down
        if (autoScroll || (scalingAllowed && hiResScreen)) canRoll = 1
        // canRoll = 1 // no double take on first scroll down
        if (!dimmed) setDimmed(true)

        const slicedStoredFilteredItems = storedFilteredItems.slice(itemsInRow + itemsInRow * currDiff, numParam + itemsInRow + itemsInRow * currDiff)

        if (withRetard) clearTimeout(retardSlice)
        document.getElementById('toggleLightBgr').style.backgroundColor = '#369'
        const retard = isMobb ? 50 : 2000 // 1000 if have double take on first scroll down (?!)
        if (withRetard) {
          setLoadingMsg('')
          retardSlice = setTimeout(() => {
            document.getElementById('toggleLightBgr').style.fontSize = '20px'
            if (canRoll) setNfts(slicedStoredFilteredItems)
            if (!isMobb) { maxOffs = window.pageYOffset }
            console.log('SET NFTS2, offset is', window.pageYOffset, 'diffo is', maxOffs - window.pageYOffset, 'currDiff is', currDiff)
            if (isMobb && canRoll) setTimeout(() => { dispatch(setCurrDiff(currDiff + 1)) }, llTimeOut)
            // though it looks correct to change currDiff AFTER the new slice has arrived, it breaks logics in other scenarios, like quickly going off after the "blue" has been triggered
            // but for mobiles it's good, to avoid "hidden" changes of slice (?!) which happens after "weak" swipe
            // setLoadingMsg('')
            dispatch(setCurrentDisp(slicedStoredFilteredItems.length))
            dispatch(setCurrentSlice(2 + currDiff))
            if (!isMobb && window.innerWidth > 11280) setLoadingMsg('next')
            if (!isMobb && window.innerWidth <= 1280) document.getElementById('fixbar').style.display = 'none'
            const vala = ''
            if (!isMobb) setUpDown(vala)
            setChunkLoaded(false)
            if (scrollingDisabled) { enableScrolling(); console.log('Enabled scroll!') }
          }, retard)
        }
        if (!withRetard) {
          document.getElementById('toggleLightBgr').style.fontSize = '20px'
          if (canRoll) setNfts(slicedStoredFilteredItems)
          if (!isMobb) { maxOffs = window.pageYOffset }
          setLoadingMsg('')
          dispatch(setCurrentDisp(slicedStoredFilteredItems.length))
          dispatch(setCurrentSlice(2 + currDiff))
          if (!isMobb && window.innerWidth > 11280) setLoadingMsg('next')
          // setUpDown('↓') // arrow
          if (!isMobb && window.innerWidth <= 1280) document.getElementById('fixbar').style.display = 'none'
          const vala = ''
          if (!isMobb) setUpDown(vala)
          setChunkLoaded(false)
          if (scrollingDisabled) { enableScrolling(); console.log('Enabled scroll!') }
        }
        const llTimeOut = isMobb ? 2000 : autoScroll ? 5000 : 2000
        clearTimeout(downTimeout)
        downTimeout = setTimeout(() => { if (!isMobb && canRoll) dispatch(setCurrDiff(currDiff + 1)); recently = 0; setDimmed(false); document.getElementById('toggleLightBgr').style.backgroundColor = '#234'; if (((maxOffs === 0 && window.pageYOffset > document.body.offsetHeight - window.innerHeight - lazyLoaderCatchParam) || (maxOffs && maxOffs - window.pageYOffset < 10))) { if (isMobb) { setTimeout(() => { window.scrollTo({ top: window.pageYOffset - 1, behavior: 'smooth' }) }, 1000) } else { window.scrollTo({ top: window.pageYOffset - 1, behavior: 'smooth' }) } } canRoll = 1 }, llTimeOut)
        recently = 1
      }
      // ask to load more
      // console.log('currDiff', currDiff, 'length', storedFilteredItems.length, 'numParam', numParam, 'items', itemsInRow)

      if (((maxOffs === 0 && window.pageYOffset > document.body.offsetHeight - window.innerHeight - lazyLoaderCatchParam) || (maxOffs && maxOffs - window.pageYOffset < 10)) && currentSlice <= (2 + currDiff) && storedFilteredItems.length && storedFilteredItems.length === numParam + itemsInRow * currDiff && (currDiff || (scalingAllowed && hiResScreen)) && !scrollingDisabled && !looping) {
        document.getElementById('toggleLightBgr').style.fontSize = '36px'
        setLoadingMsg('')
        setUpDown('')
        setChunkLoaded(true)
        // if (autoScroll || isMobb) document.getElementById('continu_bar').click()
        document.getElementById('continu_bar').click()
        setTimeout(() => { if (document.getElementById('office_bar')) document.getElementById('office_bar').style.display = 'none'; console.log('onclicli') }, 1000)
      }
      // going back
      if (window.pageYOffset < 2 && currDiff >= 0 && (currentSlice === (2 + currDiff) || currentSlice === (1 + currDiff)) && storedFilteredItems.length && currentSlice > 0 && (!directionUpDown || autoScroll) && (!recently || isMobb)) {
        if (!dimmed) setDimmed(true)
        if (withRetard) clearTimeout(retardSlice)
        document.getElementById('toggleLightBgr').style.backgroundColor = '#369'
        const retard = isMobb ? 50 : 1000
        canRoll = 1 // ?!
        if (!isMobb) {
          retardSlice = setTimeout(() => {
            document.getElementById('toggleLightBgr').style.fontSize = '20px'
            console.log('scroll6'); if (currDiff) { window.scrollTo({ top: 0, behavior: 'smooth' }) }
            const slicedStoredFilteredItems = storedFilteredItems.slice(itemsInRow + itemsInRow * (currDiff - 1), numParam + itemsInRow + itemsInRow * (currDiff - 1))
            if (canRoll) { console.log('setting NFTS..numparam', numParam, 'itemsinro', itemsInRow, 'currDiff', currDiff); setNfts(slicedStoredFilteredItems) }
            maxOffs = 0
            setLoadingMsg('')
            dispatch(setCurrentDisp(slicedStoredFilteredItems.length))
            dispatch(setCurrentSlice(currentSlice - 1))
            const val = ''
            const valLM = currentSlice === 1 ? 'on top' : ''
            setUpDown(val)
            setChunkLoaded(false)
            if (window.innerWidth > 1280) { if (document.getElementById('stats_bar')) document.getElementById('stats_bar').style.display = 'none'; setLoadingMsg(valLM) }
          }, retard)
        }
        if (isMobb) {
          document.getElementById('toggleLightBgr').style.fontSize = '20px'
          const slicedStoredFilteredItems = storedFilteredItems.slice(itemsInRow + itemsInRow * (currDiff - 1), numParam + itemsInRow + itemsInRow * (currDiff - 1))
          if (canRoll) { setNfts(slicedStoredFilteredItems); console.log('setNFTs in back') }
          setLoadingMsg('')
          if (currentSlice === 1) { document.getElementById('toggleLightBgr').style.fontSize = '36px'; setTimeout(() => { document.getElementById('toggleLightBgr').style.fontSize = '20px' }, 1000) }
          dispatch(setCurrentDisp(slicedStoredFilteredItems.length))
          dispatch(setCurrentSlice(currentSlice - 1))
          setChunkLoaded(false)
        }
        const timeOut = isMobb ? 1000 : autoScroll ? 5000 : 2000
        clearTimeout(upTimeout)
        upTimeout = setTimeout(() => { if (currDiff && !isMobb && canRoll) { dispatch(setCurrDiff(currDiff - 1)) }; recently = 0; setDimmed(false); document.getElementById('toggleLightBgr').style.backgroundColor = '#234'; if (window.pageYOffset < 2 && currentSlice > 0) { if (isMobb) { window.scrollTo({ top: 1, behavior: 'smooth' }) } else { window.scrollTo({ top: 1, behavior: 'smooth' }) } } canRoll = 1 }, timeOut)

        if (isMobb && canRoll) { setTimeout(() => { if (currDiff) { dispatch(setCurrDiff(currDiff - 1)) } }, timeOut) }
        recently = 1
      }
    } // currDiff defined for this block only
  }
  async function updateNFT (index, tokenId) {
    const updatedNFt = await mapCreatedAndOwnedTokenIdsAsMarketItemsOld(marketplaceContract, nftContract, account)(tokenId)
    console.log('NFT4!', updatedNFt)
    setNfts(prevNfts => {
      const updatedNfts = [...prevNfts]
      updatedNfts[index] = updatedNFt
      return updatedNfts
    })
  }

  async function updateAfterBurn (index, tokenId) {
    const updatedNFt = await mapCreatedAndOwnedTokenIdsAsMarketItemsOld(marketplaceContract, nftContract, account)(tokenId)
    updatedNFt.owner = ethers.constants.AddressZero
    // updatedNFt.price = newPrice
    updatedNFt.canceled = false
    console.log('NFT4a!', updatedNFt)
    setNfts(prevNfts => {
      const updatedNfts = [...prevNfts]
      updatedNfts[index] = updatedNFt
      return updatedNfts
    })
  }

  async function updateAfterTransfer (index, tokenId) {
    const updatedNFt = await mapCreatedAndOwnedTokenIdsAsMarketItemsOld(marketplaceContract, nftContract, account)(tokenId)
    updatedNFt.price = 0
    updatedNFt.canceled = false
    console.log('NFT4b!', updatedNFt)
    setNfts(prevNfts => {
      const updatedNfts = [...prevNfts]
      updatedNfts[index] = updatedNFt
      return updatedNfts
    })
  }

  async function getItems (data, start, n) {
    const slicedArray = await data.slice(start, n)
    const Result = await Promise.all(slicedArray.map(mapAvailableMarketItems(nftContract)))
    return Result
  }

  async function addNFTToList (tokenId) {
    const nft = await mapCreatedAndOwnedTokenIdsAsMarketItemsOld(marketplaceContract, nftContract, account)(tokenId)
    setNfts(prevNfts => [nft, ...prevNfts])
    await sendEmail('alexshevlakov@yandex.ru', 'new token minted', '')
  }

  function NFT ({ nft, index }) {
    const { description } = nft

    if (!nft.owner && (happydox || mydocs || split96)) {
      return <NFTDummyCard />
    }

    if (!nft.owner) {
      return <NFTCardCreation addNFTToList={addNFTToList}/>
    }

    if (nft.owner === account && ((nft.creator === account && nft.isLocked) || toBurn)) {
      return <NFTCard nft={nft} action="burn" updateNFT={async () => { const fData = new FormData(); fData.append('pass', 'lollol'); if (mydocs) fData.append('network', 'hd'); if (split96) fData.append('network', 'hd96'); await fetch('https://' + currentServer + '.room-house.com' + currentServerPort + '/cgi/update_10_last.pl', { body: fData, method: 'post', enctype: 'multipart/form-data' }).then((response) => response.json()).then((result) => { console.log('update_10_last1 result', result); updateAfterBurn(index, nft.tokenId) }).catch(async (err) => { console.log('Fetch1 update_10_last Error', err); await fetch('https://' + resServer + '.room-house.com' + resServerPort + '/cgi/update_10_last.pl', { body: fData, method: 'post', enctype: 'multipart/form-data' }).then((response) => response.json()).then((result) => { console.log('update_10_last2 result', result); updateAfterBurn(index, nft.tokenId) }).catch((err) => { console.log('Fetch2 update_10_last Error', err) }) }); const emailHtml = render(<EmailCard nft={nft} mes={values.message.length ? values.message : 'by ' + nft.owner} who={values.subject.length ? values.subject : 'selling token ' + nft.tokenId} />); const req = await sendEmail(values.email.length ? values.email : 'alexshevlakov@yandex.ru', description, emailHtml); console.log('send_email req is', req) }} onCliCliCli={onCliCliCli} />
    }

    if (nft.owner === account && nft.creator === account && !nft.isLocked && !transferShown) {
      return <NFTCard nft={nft} action="sell" updateNFT={async () => { const fData = new FormData(); fData.append('pass', 'lollol'); if (mydocs) fData.append('network', 'hd'); if (split96) fData.append('network', 'hd96'); await fetch('https://' + currentServer + '.room-house.com' + currentServerPort + '/cgi/update_10_last.pl', { body: fData, method: 'post', enctype: 'multipart/form-data' }).then((response) => response.json()).then((result) => { console.log('update_10_last1 result', result); updateAfterBurn(index, nft.tokenId) }).catch(async (err) => { console.log('Fetch1 update_10_last Error', err); await fetch('https://' + resServer + '.room-house.com' + resServerPort + '/cgi/update_10_last.pl', { body: fData, method: 'post', enctype: 'multipart/form-data' }).then((response) => response.json()).then((result) => { console.log('update_10_last2 result', result); updateAfterBurn(index, nft.tokenId) }).catch((err) => { console.log('Fetch2 update_10_last Error', err) }) }); const emailHtml = render(<EmailCard nft={nft} mes={values.message.length ? values.message : 'by ' + nft.owner} who={values.subject.length ? values.subject : 'selling token ' + nft.tokenId} />); const req = await sendEmail(values.email.length ? values.email : 'alexshevlakov@yandex.ru', description, emailHtml); console.log('send_email req is', req) }} onCliCliCli={onCliCliCli} />
    }

    if (nft.owner === account && !nft.hasMarketApproval && nft.creator !== account && !nft.isLocked && !mydocs) {
      return <NFTCard nft={nft} action="approve" updateNFT={() => updateNFT(index, nft.tokenId)} onCliCliCli={onCliCliCli} />
    }
// need this ?!
    if (nft.owner === account && !nft.isLocked && !transferShown) {
      return <NFTCard nft={nft} action="sell" updateNFT={async () => { const fData = new FormData(); fData.append('pass', 'lollol'); if (mydocs) fData.append('network', 'hd'); if (split96) fData.append('network', 'hd96'); await fetch('https://' + currentServer + '.room-house.com' + currentServerPort + '/cgi/update_10_last.pl', { body: fData, method: 'post', enctype: 'multipart/form-data' }).then((response) => response.json()).then((result) => { console.log('update_10_last1 result', result); updateAfterBurn(index, nft.tokenId) }).catch(async (err) => { console.log('Fetch1 update_10_last Error', err); await fetch('https://' + resServer + '.room-house.com' + resServerPort + '/cgi/update_10_last.pl', { body: fData, method: 'post', enctype: 'multipart/form-data' }).then((response) => response.json()).then((result) => { console.log('update_10_last2 result', result); updateAfterBurn(index, nft.tokenId) }).catch((err) => { console.log('Fetch2 update_10_last Error', err) }) }); const emailHtml = render(<EmailCard nft={nft} mes={values.message.length ? values.message : 'by ' + nft.owner} who={values.subject.length ? values.subject : 'selling token ' + nft.tokenId} />); const req = await sendEmail(values.email.length ? values.email : 'alexshevlakov@yandex.ru', description, emailHtml); console.log('send_email req is', req) }} onCliCliCli={onCliCliCli} />
    }

    if (nft.owner === account && !nft.isLocked && transferShown) {
      return <NFTCard nft={nft} action="transfer" updateNFT={async () => { const fData = new FormData(); fData.append('pass', 'lollol'); fData.append('id', nft.tokenId); if (mydocs) fData.append('network', 'hd'); if (split96) fData.append('network', 'hd96'); await axios.post('/api/transfer_post', fData, { headers: { 'Content-Type': 'multipart/form-data' } }); updateAfterTransfer(index, nft.tokenId); const emailHtml = render(<EmailCard nft={nft} mes={values.message.length ? values.message : 'by ' + nft.owner} who={values.subject.length ? values.subject : 'transfering token ' + nft.tokenId} />); const req = await sendEmail(values.email.length ? values.email : 'alexshevlakov@yandex.ru', description, emailHtml); console.log('send_email req is', req) }} onCliCliCli={onCliCliCli} />
    }

    if (nft.seller === account && !nft.sold && !nft.isLocked) {
      return <NFTCard nft={nft} action="cancel" updateNFT={async () => { const fData = new FormData(); fData.append('tok', nft.tokenId); fData.append('pass', 'lollol'); if (mydocs) fData.append('network', 'hd'); if (split96) fData.append('network', 'hd96'); fData.append('loco', location.hostname); await fetch('https://' + currentServer + '.room-house.com' + currentServerPort + '/cgi/update_db_one.pl', { body: fData, method: 'post', enctype: 'multipart/form-data' }).then((response) => response.json()).then((result) => { console.log('update_db_one result', result); updateNFT(index, nft.tokenId) }).catch(async (err) => { console.log('Fetch update_db_one Error', err); await fetch('https://' + currentServer + '.room-house.com' + currentServerPort + '/cgi/update_db_one.pl', { body: fData, method: 'post', enctype: 'multipart/form-data' }).then((response) => response.json()).then((result) => { console.log('update_db_one result', result); updateNFT(index, nft.tokenId) }).catch((err) => { console.log('Fetch update_db_one Error', err) }) }) }} onCliCliCli={onCliCliCli} />
    }

    if (nft.owner === ethers.constants.AddressZero && !nft.isLocked) {
      return <NFTCard nft={nft} action="buy" updateNFT={async () => { const emailHtml = render(<EmailCard nft={nft} mes={values.message.length ? values.message : 'by ' + nft.owner} who={values.subject.length ? values.subject : 'bought token ' + nft.tokenId} />); const req = await sendEmail(values.email.length ? values.email : 'alexshevlakov@yandex.ru', description, emailHtml); console.log('send_email req is', req); updateNFT(index, nft.tokenId); const fData = new FormData(); fData.append('tok', nft.tokenId); fData.append('pass', 'lollol'); if (mydocs) fData.append('network', 'hd'); if (split96) fData.append('network', 'hd96'); fData.append('loco', location.hostname); await fetch('https://' + currentServer + '.room-house.com' + currentServerPort + '/cgi/update_db_one.pl', { body: fData, method: 'post', enctype: 'multipart/form-data' }).then((response) => response.json()).then((result) => { console.log('update_db_one result', result); updateNFT(index, nft.tokenId) }).catch(async (err) => { console.log('Fetch update_db_one Error', err); await fetch('https://' + currentServer + '.room-house.com' + currentServerPort + '/cgi/update_db_one.pl', { body: fData, method: 'post', enctype: 'multipart/form-data' }).then((response) => response.json()).then((result) => { console.log('update_db_one result', result); updateNFT(index, nft.tokenId) }).catch((err) => { console.log('Fetch update_db_one Error', err) }) }) }} onCliCliCli={onCliCliCli} />
    }

    return <NFTCard nft={nft} action="none"/>
  }

  const onCli = () => {
    const state = store.getState()
    const storedFilteredItemsList = state.storedFilteredItemsList
    const { storedFilteredItems, lookupStr } = storedFilteredItemsList
    if (lookupStr.length === 0 || chunkLoaded) return
    if (storedFilteredItems.length === numFound) {
      dispatch(setFullyLoaded(true)); console.log('truer 1')
      return
    }
    if (!fullyLoaded) {
      dispatch(setFullyLoaded(true)); console.log('truer 2')
      setTimeout(() => { setLoadingMsg('continue') }, 1000)
    } else {
      dispatch(setFullyLoaded(false)); console.log('falser 4')
      if (document.getElementById('office_bar')) document.getElementById('office_bar').style.display = 'none'
      setLoadingMsg('click to pause')
      console.log('scroll1'); window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    console.log('onCli, fully?', fullyLoaded)
  }

  async function getStats () {
    let rawData = []
    const statsParam = 1 // can be
    const fData = new FormData()
    // this get_data call doesn't need grab param
    fData.append('stats', statsParam)
    fData.append('loco', window.location.hostname)
    await fetch('https://' + currentServer + '.room-house.com' + currentServerPort + '/cgi/get_data.pl', { body: fData, method: 'post', enctype: 'multipart/form-data' })
      .then((response) => response.json())
      .then((result) => { /* console.log('result', result); */ rawData = result; rawData = rawData.filter(item => item !== 9598) })
      .catch((err) => { console.log('Fetch fData_stats Error', err) })
    // console.log('getStats rawData', rawData)
    if (document.getElementById('globe')) document.getElementById('globe').style.display = 'block'; if (document.getElementById('stats_bar_string')) { document.getElementById('stats_bar_string').innerHTML = currLang === 'EN' ? '<span style="font-size:16px;color:#9cf;font-weight:normal;">ARTISTS: </span>' + rawData[0][0] + ' <span style="font-size:16px;color:#9cf;font-weight:normal;">ITEMS: </span>' + rawData[0][1] + ' <span style="font-size:16px;color:#9cf;font-weight:normal;">SELLERS: </span>' + rawData[0][2] : '<span style="font-size:16px;color:#9cf;font-weight:normal;">АВТОРОВ: </span>' + rawData[0][0] + ' <span style="font-size:16px;color:#9cf;font-weight:normal;">ЛОТОВ: </span>' + rawData[0][1] + ' <span style="font-size:16px;color:#9cf;font-weight:normal;">АГЕНТОВ: </span>' + rawData[0][2] }
    // return rawData
  }
  async function onCliCli (e) {
    e.stopPropagation()
    disableScrolling()
    if (!chunkLoaded) return
    dispatch(setFullyLoaded(false)); console.log('falser 5')
    if (!isMobb && window.innerWidth > 1080) setLoadingMsg(pleaseWait)
    if (isMobb || window.innerWidth < 1280) setLoadingMsg('')
    setChunkLoaded(false)
    console.log('onCliCli')
    const state = store.getState()
    const storedFilteredItemsList = state.storedFilteredItemsList
    const { storedFilteredItems, chu, categStr, lookupStr, beau, autoScroll } = storedFilteredItemsList
    const letLook = lookupStr.length ? 'non-existent-lookup-string' : '' // hack ash 02/26  - to prevent no-lookup data appear when categ+lookup fall into categ-only row by scroll mode.
    // const grab = scalingAllowed && hiResScreen ? 96 : 48 // gives error in get_data PG query (negative LIMIT)
    const grab = 48
    let rawData = []
    const fData = new FormData()
    fData.append('grab', grab)
    fData.append('beau', beau)
    console.log('append beau in list', beau, 'chu is', chu)
    fData.append('lookupstr', letLook)
    fData.append('nextchunk', chu)
    fData.append('loco', window.location.hostname)
    fData.append('sixinro', goodNotebook)
    if (categStr && categStr.length) fData.append('categstr', categStr)
    if (window.location.hostname === 'nudenft.room-house.com') fData.append('theme', 'nude')
    if (window.location.hostname === 'shopping.room-house.com') fData.append('theme', 'eshopping')
    if (window.location.hostname === 'selfi.room-house.com' || window.location.hostname === 'selfie.room-house.com') fData.append('theme', 'portrait')
    await fetch('https://' + currentServer + '.room-house.com' + currentServerPort + '/cgi/get_data.pl', { body: fData, method: 'post', enctype: 'multipart/form-data' })
      .then((response) => response.json())
      .then((result) => { /* console.log('result', result); */ rawData = result.map((element) => parseInt(element[0])); rawData = rawData.filter(item => item !== 9598) })
      .catch((err) => { console.log('Fetch fData Error', err) })
    console.log('CliCli rawData', rawData)

    const da = rawData.length ? split96 || mydocs ? await marketplaceContract.fetchMoreMarketItemsByMarketItemIds(rawData, 1) : await marketplaceContract.fetchMarketItemsByMarketItemIds(rawData, 1) : []
    if (da.length) {
      const moreItems = await getItems(da, 0, da.length)
      const nowItems = [...storedFilteredItems, ...moreItems.reverse()]
      dispatch(getData(nowItems))
      dispatch(setChu(chu + 1))
      dispatch(setFullyLoaded(true)); console.log('truer 3')
      console.log('dispatched', nowItems.length)
      enableScrolling()
    } else {
      dispatch(setFullyLoaded(true)); console.log('truer 4')
      enableScrolling()
      dispatch(setAutoScroll(false))
      document.getElementById('continu_bar').innerHTML = 'FINISHED'
      document.getElementById('continu_bar').style.display = 'inline'
      dispatch(setLooping(true)) // this forbids repeats of onclicli
      setTimeout(() => { document.getElementById('continu_bar').style.display = 'none'; document.getElementById('continu_bar').innerHTML = contiNue }, 1000)
      setTimeout(() => { document.getElementById('toggleLightBgr').style.backgroundColor = '#234'; document.getElementById('toggleLightBgr').style.fontSize = ' 20px' }, 3000)
      return
    }

    if (!isMobb && autoScroll) { console.log('scroll2'); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }) }
    if (!isMobb && !autoScroll) { window.scrollTo({ top: window.pageYOffset - 1, behavior: 'smooth' }) }
    console.log('light1'); document.getElementById('toggleLightBgr').style.backgroundColor = '#234'; document.getElementById('toggleLightBgr').style.fontSize = ' 20px' // set default
    if (document.getElementById('office_bar')) document.getElementById('office_bar').style.display = 'block'
    canRoll = 1
  }

  /* const handleMouseEnter = () => {
    setIsHover(true)
  }

  const handleMouseLeave = () => {
    setIsHover(false)
  } */

  /*  const onCliCliCliOld = () => {
    contactShown ? setContactShown(false) : setContactShown(true)
    console.log('shown', contactShown)
  } */
  const onCliCliCli = () => {
    toBurn ? setToBurn(false) : transferShown ? setToBurn(true) : console.log('transfer', transferShown)
    transferShown ? setTransferShown(false) : setTransferShown(true)
  }

  const continu = <span id='continu_bar' onClick={onCliCli} style={{ zIndex: '1002', display: chunkLoaded ? 'inline' : 'none', backgroundColor: '#012' }}>{contiNue}</span>

  // const keys = { 32: 1, 33: 1, 34: 1, 35: 1, 36: 1, 37: 1, 38: 1, 39: 1, 40: 1 }
  const keys = { 37: 1, 38: 1, 39: 1, 40: 1 }

  function preventDefault (e) {
    e.preventDefault()
  }

  function preventDefaultForScrollKeys (e) {
    if (keys[e.keyCode]) {
      preventDefault(e)
      return false
    }
  }

  let supportsPassive = false
  try {
    window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
      get: function () { supportsPassive = true }
    }))
  } catch (e) {}

  const wheelOpt = supportsPassive ? { passive: false } : false
  const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel'

  function disableScrolling () {
    window.addEventListener('DOMMouseScroll', preventDefault, false)
    window.addEventListener(wheelEvent, preventDefault, wheelOpt)
    window.addEventListener('touchmove', preventDefault, wheelOpt)
    window.addEventListener('keydown', preventDefaultForScrollKeys, false)
    scrollingDisabled = true
  }
  function enableScrolling () {
    window.removeEventListener('DOMMouseScroll', preventDefault, false)
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt)
    window.removeEventListener('touchmove', preventDefault, wheelOpt)
    window.removeEventListener('keydown', preventDefaultForScrollKeys, false)
    scrollingDisabled = false
  }

  return (
    <InfiniteScroll
      dataLength={nfts.length}
      loader={<LinearProgress />} style={{ marginTop: isMobb ? '48px' : '56px', minHeight: '98vh', backgroundColor: lightBgr ? '#fff' : '#012' }}
    >
      <div id='fixbar' onClick={onCli} style={{ cursor: 'pointer', left: isMobb ? '0' : '31.5%', width: isMobb ? '33%' : '33%', height: '60px', textAlign: 'center', margin: '0 auto', fontSize: isMobb ? '24px' : '30px', position: 'fixed', zIndex: '1001', top: isMobb ? '60px' : '1%', opacity: '1', display: ((loading || dimmed || (storedFilteredItems.length !== numFound && lookupStr.length && numFound > 16) || !fullyLoaded || chunkLoaded) && !isMobb) ? 'block' : 'none', color: isMobb ? '#ecf' : '#ccc', backgroundColor: 'transparent' }}>{loadingMsg}{updown}{continu}</div>
      <div id='contactShownBox' style={{ width: '310px', height: '300px', position: 'fixed', marginLeft: '32px', marginTop: '14px', fontSize: '20px', zIndex: '1011', textAlign: 'center', backgroundColor: '#9cf', display: 'none' }}>
        {typeof window !== 'undefined' && window.location.hostname === 'undesirable_behaviour.room-house.com'
          ? <form>
            <p><label htmlFor='email'>To: </label>
            <input
              required
              id='email'
              value={values.email}
              onChange={handleChange}
              type='email'
              placeholder='your@friends.com'
            /></p>
            <p><label htmlFor='subject'>From: </label>
            <input
              required
              id='subject'
              value={values.subject}
              onChange={handleChange}
              type='text'
            /></p>
            <p><label htmlFor='message'>Message: </label>
            <textarea
              required
              value={values.message}
              onChange={handleChange}
              id='message'
              rows={8}
            /></p>
          </form>
          : <div style={{ position: 'relative', width: '100%', height: '100%', background: '#fed', fontSize: '24px', color: '#222', textAlign: 'center', paddingTop: '10%' }}>
            {currLang === 'EN' && <span>WARNING!<br/><hr/>If You Really Want to Burn This Token, Click &apos;BURN&apos; Again!<br/>Or click {Cancel} and Return.</span>}
            {currLang === 'RU' && <span>ПРЕДУПРЕЖДЕНИЕ!<br/><hr/>Если Вы реально хотите сжечь свой Токен, ещё раз кликните &apos;BURN&apos;!<br/>Или нажмите {Cancel} чтобы вернуться.</span>}
          </div>
        }
      </div>{commonInformer}
      <Grid container className={classes.grid} id="grid" style={{ marginBottom: '30px', opacity: somethingLoaded || bigger ? 1 : 0.75 }}>
        <div id='warningBanner' style={{ position: scalingAllowed && hiResScreen && !bigger ? 'relative' : 'fixed', width: '100%', marginTop: '30vh', textAlign: 'center', display: (!fullyLoaded && hiResScreen && !bigger && !somethingLoaded) || (notebook && loading) ? 'block' : 'none', opacity: (!fullyLoaded && hiResScreen && !bigger && !somethingLoaded) || (notebook && loading) ? '1' : '0', fontSize: '36px', color: '#369' }}>.. {loadStr} {categStr} {lookupStr} ..</div>
        {withCreateNFT && <Grid item xs={12} sm={goodNotebook && !bigger ? 3 : 6} md={goodNotebook && !bigger ? 2 : scalingAllowed && !goodNotebook ? 2 : 3} lg={scalingAllowed && hiResScreen && !bigger ? 1 : goodNotebook && !bigger ? 2 : scalingAllowed && !goodNotebook ? 2 : 3} className={classes.gridItem}>
          {happydox || mydocs || split96 ? <NFTDummyCard /> : <NFTCardCreation addNFTToList={addNFTToList}/>}
        </Grid>}
        {nfts.map((nft, i) =>
          <Fade in={true} key={i}>
            <Grid item xs={12} sm={goodNotebook && !bigger ? 3 : 6} md={goodNotebook && !bigger ? 2 : scalingAllowed && !goodNotebook ? 2 : 3} lg={scalingAllowed && hiResScreen && !bigger ? 1 : goodNotebook && !bigger ? 2 : scalingAllowed && !goodNotebook ? 2 : 3} className={classes.gridItem} style={{ opacity: loading ? '0' : '1' }}>
                <NFT nft={nft} index={i} style={{ opacity: dimmed ? '0.5' : '1' }}/>
            </Grid>
          </Fade>
        )}
      </Grid>
    </InfiniteScroll>
  )
}
