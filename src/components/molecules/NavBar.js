import { isMobile } from 'react-device-detect'
import { useContext, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
// import Select, { SelectChangeEvent } from '@mui/material/Select';
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import { Web3Context } from '../providers/Web3Provider'
import NavItem from '../atoms/NavItem'
import ConnectedAccountAddress from '../atoms/ConnectedAccountAddress'
import ConnectButton from '../atoms/ConnectButton'
import { useDispatch, useSelector } from 'react-redux'
import { setCateg, setLookup, setAutoScroll, setLightBgr, setLoading, setFullyLoaded, setScalingAllowed, setSomethingLoaded, setCurrentSlice, setCurrentDisp, getData, setRelo } from '../../../store/actions/dataAction'
import { store } from '../../../store/store'
import { NFTModalContext } from '../providers/NFTModalProvider'
import BasicSelect from '../molecules/BasicSelect'
import BasicSelectFineArts from '../molecules/BasicSelectFineArts'
import BasicSelectFineArtsRus from '../molecules/BasicSelectFineArtsRus'
import BasicSelectProfiRus from '../molecules/BasicSelectProfiRus'
import BasicSelectProfiEng from '../molecules/BasicSelectProfiEng'
import BasicSelectSelfiRus from '../molecules/BasicSelectSelfiRus'
import BasicSelectSelfiEng from '../molecules/BasicSelectSelfiEng'
import BasicSelectHDRus from '../molecules/BasicSelectHDRus'
import BasicSelectHDEng from '../molecules/BasicSelectHDEng'
import BasicSelectSplitEng from '../molecules/BasicSelectSplitEng'
// import NestedMenuExample from '../molecules/NestedMenuExample'

const onCli = (e) => {
  e.preventDefault()
  e.target.value = ''
}

const mydocs = typeof window !== 'undefined' && window.location.hostname === 'mydocs.room-house.com'
const split96 = typeof window !== 'undefined' && window.location.hostname === 'split.room-house.com'
const goodNotebook = typeof window !== 'undefined' && window.screen.width > 1600
const hiResScreen = typeof window !== 'undefined' && window.screen.width >= 1920

// const neverHappens = false

const NavBar = () => {
  const { account, isReady, hasInit } = useContext(Web3Context)
  const { setIsDescOpen, isDescOpen, setIsReqFormOpen, isReqFormOpen, setCurrLang, currLang, setIsCategChangedInMenu } = useContext(NFTModalContext)
  const { pathname } = useRouter()
  const disableBox = pathname === '/my-nfts' // let them be always enabled, change this name
  const dispatch = useDispatch()
  const storedFilteredItemsList = useSelector(state => state.storedFilteredItemsList)
  const { categStr, lookupStr, autoScroll, lightBgr, scalingAllowed } = storedFilteredItemsList
  const inputRef = useRef(null)

  const pages = [
    {
      title: currLang === 'EN' ? typeof window !== 'undefined' && window.location.hostname === 'shopping.room-house.com' ? 'Shop' : mydocs ? 'Aggregator' : 'Gallery' : mydocs ? 'Агрегатор' : 'Галерея',
      href: '/'
    },
    {
      title: currLang === 'EN' ? typeof window !== 'undefined' && window.location.hostname === 'shopping.room-house.com' ? 'Owner' : mydocs ? 'My Docs' : 'My' : 'Личные',
      href: '/my-nfts'
    }
  ]
  useEffect(() => {
    setTimeout(() => { if (typeof window !== 'undefined' && (window.location.hostname === 'shopping.room-house.com' || window.location.hostname === 'selfi.room-house.com' || window.location.hostname === 'selfie.room-house.com') && !isMobile) { setIsDescOpen(true) }; if (isMobile) { setIsDescOpen(false) } }, 1000)
  }, [])

  /* useEffect(() => {
    setTimeout(() => { if (categStr.length && inputRef && inputRef.current) inputRef.current.value = categStr; console.log('IN USE_EFFECT:', categStr) }, 1000)
  }, [categStr]) */ // --ash 02/26

  const toggleAutoScroll = () => {
    const state = store.getState()
    const storedFilteredItemsList = state.storedFilteredItemsList
    const { autoScroll } = storedFilteredItemsList
    if (autoScroll) {
      dispatch(setAutoScroll(false))
    } else {
      dispatch(setAutoScroll(true))
      dispatch(setFullyLoaded(false)); console.log('falser 6')
      setTimeout(() => { dispatch(setFullyLoaded(true)); console.log('truer 5') }, 2000)
    }
  }

  const toggleReqForm = () => {
    isReqFormOpen ? setIsReqFormOpen(false) : setIsReqFormOpen(true)
    document.getElementById('getRoom').style.display = document.getElementById('getRoom').style.display === 'block' ? 'none' : 'block'
  }

  const toggleLightBgr = () => {
    const state = store.getState()
    const storedFilteredItemsList = state.storedFilteredItemsList
    const { lightBgr } = storedFilteredItemsList
    lightBgr ? dispatch(setLightBgr(false)) : dispatch(setLightBgr(true))
  }

  const toggleInfo = () => {
    isDescOpen ? setIsDescOpen(false) : setIsDescOpen(true)
  }

  /* const toggleSize = () => {
    currSize === '84%' ? dispatch(setCurrSize('138%')) : dispatch(setCurrSize('84%'))
  } */
  const toggleScalingAllowed = () => {
    const state = store.getState()
    const storedFilteredItemsList = state.storedFilteredItemsList
    const { scalingAllowed } = storedFilteredItemsList
    // if (!scalingAllowed && hiResScreen) dispatch(setCurrDiff(4)) // ?! hack ash
    scalingAllowed ? dispatch(setScalingAllowed(false)) : dispatch(setScalingAllowed(true))
    setTimeout(() => { window.scrollTo({ top: 1, behavior: 'smooth' }) }, 200)
  }
  const toggleLang = () => {
    currLang === 'EN' ? setCurrLang('RU') : setCurrLang('EN')
  }

  const clickerHandler = (e) => {
    const state = store.getState()
    const storedFilteredItemsList = state.storedFilteredItemsList
    const { storedFilteredItems } = storedFilteredItemsList
    e.preventDefault()
    const { searchInput } = e.target
    if (searchInput.value === categStr || (searchInput.value.length < 3 && searchInput.value.length > 0)) return
    if (searchInput.value.length) {
      if (categStr.length) {
        if (searchInput.value.match(/\s/g) || !storedFilteredItems.length) { dispatch(setCateg(searchInput.value)); setIsCategChangedInMenu(false); dispatch(setLookup('')) } else { dispatch(setLookup(searchInput.value)) }
      } else {
        dispatch(setCateg(searchInput.value)); setIsCategChangedInMenu(false)
      }
    } else {
      if (!lookupStr.length) dispatch(setCateg('')); dispatch(setLookup(''))
    }

    dispatch(getData([]))
    dispatch(setCurrentSlice(0))
    dispatch(setCurrentDisp(0))
    dispatch(setRelo(false))
    dispatch(setLoading(true))
    setTimeout(() => { dispatch(setFullyLoaded(false)); dispatch(setSomethingLoaded(false)) }, 500) // to let existing items disappear before banner rolls out
    // here we change the URL string in browser
    const replacer = searchInput.value.length ? '/?' + searchInput.value : '/'
    history.replaceState('', '', replacer)
  }

  /* const emptyBucket = (event) => {
    console.log('event.target', event.target)
    dispatch(setCateg(''))
    dispatch(getData([]))
    dispatch(setCurrentSlice(0))
    dispatch(setCurrentDisp(0))
    dispatch(setRelo(false))
    dispatch(setLoading(true))
    dispatch(setFullyLoaded(false)); console.log('falser 8')
    // if (pathname === href) window.location.reload()
  } */
  const ifPath = () => {
    if (pathname === '/' && (categStr.length || lookupStr.length)) location.href = '/'
  }
  let reqNewRoom = currLang === 'EN' ? typeof window !== 'undefined' && window.location.hostname === 'ooc.room-house.com' ? 'Create an Office!' : typeof window !== 'undefined' && window.location.hostname === 'nft.room-house.com' ? 'Add NFT' : 'Add a Selfie!' : typeof window !== 'undefined' && window.location.hostname === 'ooc.room-house.com' ? 'Получить офис!' : typeof window !== 'undefined' && window.location.hostname === 'nft.room-house.com' ? 'Add NFT' : 'Добавить сэлфи'
  reqNewRoom = isMobile ? '+' : reqNewRoom

  const oOc = currLang === 'EN' ? 'ffice Center "Room-House"' : 'фис Центр "Room-House"'
  const globeO = '🌐 '

  return (
    <AppBar position="fixed" sx={{ marginBottom: '12px', zIndex: '1000' }}>
      <Container maxWidth="100%" sx={{ backgroundColor: '#001122' }}>
        <Toolbar disableGutters sx={{ backgroundColor: '#001122' }}>
          <Box sx={{ flexGrow: 1, display: 'flex', maxWidth: typeof window !== 'undefined' && window.location.hostname === 'ooc.room-house.com' ? '38%' : '100%' }}>
            {lightBgr && isMobile ? <div style={{ width: '1px' }}></div> : (isReady || hasInit) && (window.innerWidth > 640 || !lightBgr) && pages.map(({ title, href }) => <div key={title} onClick={href === '/my-nfts' ? () => { console.log('do nothing') } : ifPath}><NavItem title={title} href={href} key={title} style={{ maxWidth: isMobile ? '24px' : '120px', fontSize: isMobile ? '12px' : '16px' }}/></div>)}
            {isMobile ? <div style={{ width: '1px' }}></div> : <div onClick={toggleAutoScroll} style={{ display: (isReady || hasInit) ? 'block' : 'none', color: autoScroll ? '#def' : '#fff', backgroundColor: autoScroll ? '#369' : '#234', fontSize: '20px', width: '30px', height: '30px', borderRadius: '0px', cursor: 'pointer', textAlign: 'center', padding: '2px', margin: '10px 5px', lineHeight: '24px' }}>↑↓</div>}
            <div id="toggleLightBgr" onClick={toggleLightBgr} style={{ display: (isReady || hasInit) ? 'block' : 'none', color: lightBgr ? '#def' : '#fff', backgroundColor: '#234', fontSize: '20px', width: '30px', height: '30px', borderRadius: '0px', cursor: 'pointer', textAlign: 'center', padding: '2px', margin: '10px 5px', lineHeight: '24px' }}>💡</div>
            {isMobile ? <div style={{ width: '1px' }}></div> : <div onClick={toggleLang} style={{ display: (isReady || hasInit) ? 'block' : 'none', color: '#fff', backgroundColor: '#234', fontSize: '20px', width: '30px', height: '30px', borderRadius: '0px', cursor: 'pointer', textAlign: 'center', padding: '2px', margin: '10px 5px', lineHeight: '24px' }}>{currLang}</div>}
             {typeof window !== 'undefined' && window.location.hostname === 'ooc.room-house.com' ? <div id='toggleInfo' style={{ width: '1px' }}></div> : <div id='toggleInfo' onClick={toggleInfo} style={{ display: (isReady || hasInit) ? 'block' : 'none', color: isDescOpen ? '#def' : '#fff', backgroundColor: isDescOpen ? '#369' : '#234', fontSize: '20px', width: '30px', height: '30px', borderRadius: '0px', cursor: 'pointer', textAlign: 'center', padding: '2px', margin: '10px 10px 10px 5px', lineHeight: '24px' }}>...</div>}
          {(isReady || hasInit) && !account && typeof window !== 'undefined' && (window.location.hostname === 'ooc.room-house.com' || window.location.hostname === 'selfie.room-house.com' || window.location.hostname === 'selfi.room-house.com') && <div id='getRoom' onClick={toggleReqForm} style={{ display: (isMobile) ? 'block' : 'block', color: '#9cf', backgroundColor: '#234', fontSize: isMobile ? '18px' : '20px', fontWeight: 'bold', width: isMobile ? '30px' : currLang === 'EN' ? '240px' : '300px', height: '30px', borderRadius: '0px', cursor: 'pointer', textAlign: 'center', padding: '2px', margin: '10px 3px 10px -2px', lineHeight: '24px' }}>{reqNewRoom}</div>}
          {(!goodNotebook || hiResScreen) && (isReady || hasInit) && <div id='toggleScalingAllowed' onClick={toggleScalingAllowed} style={{ display: (isMobile) ? 'none' : 'block', color: scalingAllowed ? '#def' : '#fff', backgroundColor: scalingAllowed ? '#369' : '#234', fontSize: '20px', width: '30px', height: '30px', borderRadius: '0px', cursor: 'pointer', textAlign: 'center', padding: '2px', margin: '10px 5px', lineHeight: '24px' }}>Aa</div>}
          </Box>
          {typeof window !== 'undefined' && (window.location.hostname === 'nft.room-house.com' || window.location.hostname === 'supernft.room-house.com') && !isMobile && window.innerWidth > 640 && <Box sx={{ flexGrow: 1, display: 'flex' }}><div id='stats_bar' style={{ display: isMobile ? ' none' : 'block', color: '#fed', backgroundColor: 'transparent', fontSize: '18px', width: '390px', height: '42px', borderRadius: '0px', textAlign: 'center', padding: '2px', margin: '12px 0px 8px 0px', lineHeight: '30px' }}><div style={{ width: '380px', margin: '0 auto' }}><div id='globe' style={{ float: 'left', display: 'none' }}>{globeO}</div><div id='stats_bar_string' style={{ float: 'left', fontWeight: 'bold' }}></div><div style={{ clear: 'left' }}></div></div></div></Box>}
          {typeof window !== 'undefined' && window.location.hostname === 'ooc.room-house.com' && !isMobile && <Box sx={{ flexGrow: 1, display: 'flex' }}><div id='office_bar' style={{ display: (isMobile) ? 'none' : 'block', color: '#fed', backgroundColor: '#234', fontSize: '24px', width: '350px', height: '42px', borderRadius: '0px', textAlign: 'center', padding: '2px', margin: '10px 0px', lineHeight: '30px' }}><div style={{ width: '340px', margin: '0 auto' }}><div style={{ float: 'left', marginLeft: '10px' }}>{globeO}</div><div style={{ float: 'left', marginLeft: '0px', fontWeight: 'bold' }}>{oOc}</div><div style={{ clear: 'left' }}></div></div></div></Box>}
          {typeof window !== 'undefined' && window.location.hostname === 'shopping.room-house.com' && <BasicSelect style={{ zIndex: '1004' }}/>}
          {typeof window !== 'undefined' && (window.location.hostname === 'nft.room-house.com' || window.location.hostname === 'supernft.room-house.com') && currLang === 'RU' && <BasicSelectFineArtsRus disabledBox={disableBox} placeHolder={disableBox} style={{ zIndex: '1004' }}/>}
          {typeof window !== 'undefined' && (window.location.hostname === 'nft.room-house.com' || window.location.hostname === 'supernft.room-house.com') && currLang === 'EN' && <BasicSelectFineArts disabledBox={disableBox} placeHolder={disableBox} style={{ zIndex: '1004' }}/>}
          {typeof window !== 'undefined' && window.location.hostname === 'ooc.room-house.com' && currLang === 'RU' && <BasicSelectProfiRus style={{ zIndex: '1004' }}/>}
          {typeof window !== 'undefined' && window.location.hostname === 'ooc.room-house.com' && currLang === 'EN' && <BasicSelectProfiEng style={{ zIndex: '1004' }}/>}
          {typeof window !== 'undefined' && (window.location.hostname === 'selfi.room-house.com' || window.location.hostname === 'selfie.room-house.com') && currLang === 'RU' && <BasicSelectSelfiRus style={{ zIndex: '1004' }}/>}
          {typeof window !== 'undefined' && (window.location.hostname === 'selfi.room-house.com' || window.location.hostname === 'selfie.room-house.com') && currLang === 'EN' && <BasicSelectSelfiEng style={{ zIndex: '1004' }}/>}
          {mydocs && currLang === 'RU' && <BasicSelectHDRus disabledBox={disableBox} placeHolder={disableBox} style={{ zIndex: '1004' }}/>}
          {mydocs && currLang === 'EN' && <BasicSelectHDEng disabledBox={disableBox} placeHolder={disableBox} style={{ zIndex: '1004', marginRight: '8px' }}/>}
          {split96 && <BasicSelectSplitEng disabledBox={disableBox} placeHolder={disableBox} style={{ zIndex: '1004', minWidth: '120px' }}/>}
          <form onSubmit={clickerHandler}>
          {(isReady || hasInit) && <input id="searchInput" name="searchInput" disabled={disableBox} ref={inputRef} placeholder="🔍" type="text" onClick={onCli} style={{ display: isMobile ? 'block' : 'block', maxWidth: isMobile ? '102px' : '120px', marginRight: isMobile ? '0px' : '60px', fontSize: '30px', zIndex: '1004', position: 'relative' }} />}
          </form>
          {typeof window !== 'undefined' && window.location.hostname === 'ooc.room-house.com' ? <div style={{ width: '1px' }}></div> : account && isDescOpen ? <ConnectedAccountAddress account={account}/> : (isReady || hasInit) && !account && isDescOpen && <ConnectButton/>}
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default NavBar
// {account ? <ConnectedAccountAddress account={account}/> : (isReady || hasInit) && <ConnectButton/>}
// {account ? <div></div> : (isReady || hasInit) && <ConnectButton/>}
