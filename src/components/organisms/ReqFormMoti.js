import { isMobile, isAndroid } from 'react-device-detect'
import { useContext, useEffect, useState } from 'react'
import { NFTModalContext } from '../providers/NFTModalProvider'
import { Web3Context } from '../providers/Web3Provider'
// import ReqEasyCreation from '../molecules/ReqEasyCreation'
// import NFTCardList from '../organisms/NFTCardList'
import NFTCard from '../molecules/NFTCard'
import { useRouter } from 'next/router'
import { mapAvailableMarketItems } from '../../utils/nft'
import { CircularProgress } from '@mui/material'

const currentServer = process.env.CURRENT_SERVER
const currentDomain = 'room-house.com'
const currentServerPort = process.env.CURRENT_SERVER_PORT

export default function ReqFormMoti () {
  const { isReqFormOpen, setIsReqFormOpen, isAnswerShown, setIsAnswerShown, currLang } = useContext(NFTModalContext)
  const [nfts, setNfts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [already, setAlready] = useState(false)
  const { marketplaceContract, nftContract, isReady } = useContext(Web3Context)

  const { asPath } = useRouter()
  /* const [startX, setStartX] = useState(null)
  const [startY, setStartY] = useState(null)
  const [swipeDirection, setSwipeDirection] = useState(null)
  const handleTouchStart = (e) => {
    const touch = e.touches[0]
    setStartX(touch.clientX)
    setStartY(touch.clientY)
    setSwipeDirection(null)
  }
  const handleTouchEnd = (e) => {
    if (!startX || !startY) return
    const touch = e.changedTouches[0]
    const endX = touch.clientX
    const endY = touch.clientY
    const deltaX = endX - startX
    const deltaY = endY - startY
    const threshold = 50
    if (Math.abs(deltaX) > threshold && Math.abs(deltaX) > Math.abs(deltaY)) {
      setSwipeDirection(deltaX > 0 ? 'right' : 'left'); if (swipeDirection === 'left' || swipeDirection === 'right') alert(swipeDirection)
    }
    setStartX(null)
    setStartY(null)
  } */
  // both variants work "around" the NFT card but chaos in events click handles, so I'd rather not use any swipes at all
  /* const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const minSwipeDistance = 50

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    if (isRightSwipe || isLeftSwipe) loadNFTs()
  } */

  const ifr = ''
  const paths = asPath.split('?')
  useEffect(() => {
    document.getElementById('alerter').addEventListener('click', showBanner2); setTimeout(() => { if (document.getElementById('tennisMotivation')) document.getElementById('tennisMotivation').style.visibility = 'hidden'; if (document.getElementById('abouter')) document.getElementById('abouter').style.display = 'none' }, 3000)
    setTimeout(() => { if (document.getElementById('circu') && isReqFormOpen && !already && !/my-nfts$/i.test(paths[0])) alert('Please re-open Metamask and re-load this page') }, 10000)
  }, [])
  useEffect(() => {
    if (isReqFormOpen) loadNFTs()
  }, [isReady])
  async function showBanner2 () {
    document.getElementById('alerter').removeEventListener('click', showBanner2)
    document.getElementById('reqformdiv4').style.visibility = 'visible' // flag goes up
    await navigator.clipboard.writeText(document.getElementById('reqformdiv4').innerText)
    document.getElementById('alerter').innerHTML = 'Hash copied to clipboard! - Хэш копирован в буфер обмена!'
    setTimeout(() => {
      document.getElementById('alerter').style.display = 'none'; document.getElementById('alerter').addEventListener('click', showBanner2)
    }, 2000)
  }

  function copyContent () {
    if (document.getElementById('reqformdiv4').style.visibility === 'visible') return // flag is up
    try {
      document.getElementById('alerter').innerHTML = currLang === 'EN' ? 'You understand what PRIVATE KEY is and how to use it? <span style="text-decoration: underline; color: #009; cursor: pointer;">YES</span>' : 'Вы понимаете, для чего нужен PRIVATE KEY? <span style="text-decoration: underline; color: #009; cursor: pointer;">ДА</span>'
      document.getElementById('alerter').style.display = 'block'
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }
  async function loadNFTs () {
    if (!isReady) { return }
    let data = []; let rawData = []
    setIsLoading(true)
    const fData = new FormData()
    fData.append('grab', 1)
    await fetch('https://' + currentServer + '.' + currentDomain + currentServerPort + '/cgi/get_data.pl', { body: fData, method: 'post', enctype: 'multipart/form-data' })
      .then((response) => response.json())
      .then((result) => { rawData = result.map((element) => parseInt(element[0])) })
      .catch((err) => { console.log('Fetch fData Error', err) })
    data = await marketplaceContract.fetchMarketItemsByMarketItemIds(rawData, 1)
    const items = await Promise.all(data.map(mapAvailableMarketItems(nftContract))); setIsLoading(false)
    setNfts(items); setIsAnswerShown(false); if (document.getElementById('upTitle')) document.getElementById('upTitle').style.opacity = '1'; if (!already) { setAlready(true); setTimeout(() => { if (document.getElementById('clickanother')) document.getElementById('clickanother').style.visibility = 'hidden' }, 2000) }
  }
  function NFT ({ nft, i }) {
    return <NFTCard nft={nft} index={i} action="none"/>
  }
  return (
        <div id='coverDiv' onClick={ (e) => e.stopPropagation() } style={{ position: 'fixed', top: '0px', paddingTop: '0px', textAlign: 'center', width: '100%', height: '100%', display: isReqFormOpen ? 'block' : 'none', zIndex: '100001', background: '#001122 url(/gal1.png) center center no-repeat', color: '#fff', fontSize: '24px', overflowY: 'auto' }}>{ifr}
          {currLang === 'EN' && (((!isReady || (isLoading && !already)) && isMobile) || !isMobile) && <div style={{ position: 'relative', height: isMobile ? '30%' : '10%', width: '100vw', backgroundColor: 'transparent', color: '#fed', fontSize: isMobile ? '2rem' : '2rem', lineHeight: '42px', paddingTop: isMobile ? '5vh' : '2.5vh' }}>ONLINE GAME: FINE ARTS COLLECTORS</div>}
          {currLang === 'RU' && (((!isReady || (isLoading && !already)) && isMobile) || !isMobile) && <div style={{ position: 'relative', height: isMobile ? '35%' : '10%', width: '100vw', backgroundColor: 'transparent', color: '#fed', fontSize: isMobile ? '2rem' : '2rem', lineHeight: '42px', paddingTop: isMobile ? '5vh' : '2.5vh' }}>ОНЛАЙН ИГРА-МОТИВАЦИЯ: КОЛЛЕКЦИОНЕР</div>}
          <div style={{ display: 'flex', position: 'relative', height: '70%', minHeight: '520px', width: '100vw', backgroundColor: 'transparent' }}>
            {currLang === 'EN' && <div style={{ position: 'relative', height: '100%', width: '20vw', background: 'transparent', float: 'left', padding: '3px' }}><div style={{ position: 'absolute', bottom: '3px', right: '3px', fontSize: '36px', color: '#001122', textAlign: 'left', background: '#ffeedd', display: isMobile ? 'none' : 'inline' }}></div></div>}
            {currLang === 'EN' && <div style={{ position: 'relative', height: '100%', width: '20vw', background: 'transparent', float: 'left' }}><div style={{ position: 'absolute', bottom: '3px', right: '3px', fontSize: '36px', color: '#001122', textAlign: 'left', background: '#ffeedd', display: isMobile ? 'none' : 'inline' }}></div></div>}
            {currLang === 'RU' && <div style={{ position: 'relative', height: '100%', width: '20vw', background: 'transparent', float: 'left', padding: '3px' }}><div style={{ position: 'absolute', bottom: '3px', right: '3px', fontSize: '36px', color: '#001122', textAlign: 'left', background: '#ffeedd', display: isMobile ? 'none' : 'inline' }}></div></div>}
            {currLang === 'RU' && <div style={{ position: 'relative', height: '100%', width: '20vw', background: 'transparent', float: 'left' }}><div style={{ position: 'absolute', bottom: '3px', right: '3px', fontSize: '36px', color: '#001122', textAlign: 'left', background: '#ffeedd', display: isMobile ? 'none' : 'inline' }}></div></div>}
            <div style={{ position: 'relative', height: '100%', width: '20vw', minWidth: '384px', minHeight: '640px', border: '0px solid #fff', backgroundColor: 'transparent', float: 'left' }}>
              <div id='reqformdiv2' onClick={ (e) => e.stopPropagation() } style={{ position: 'relative', top: isMobile ? '4vh' : '1vh', left: isMobile ? '0vw' : '-0.36vw', margin: '0 auto', width: '360px', border: '0px solid #fff', maxHeight: '600px', height: '96%', zIndex: '10002' }}>
                {isReady && (!isLoading || already) ? nfts.map((nft, i) => <div style={{ opacity: '1', marginTop: isMobile ? '-5px' : '0', background: isMobile ? 'transparent' : 'transparent' }} key={i} onClick= { () => { loadNFTs() } }><div id='upTitle' onClick= { (e) => { e.stopPropagation(); if (document.getElementById('upTitle') && isAnswerShown) document.getElementById('upTitle').style.opacity = '0.5'; if (isAnswerShown) { loadNFTs() } } } style={{ fontSize: '20px', backgroundColor: 'transparent', color: '#fff', padding: '3px', position: 'relative', cursor: isAnswerShown ? 'pointer' : 'default' }}>{isAnswerShown ? currLang === 'RU' ? 'НА СЛЕДУЮЩУЮ КАРТИНУ' : 'NEXT PICTURE' : currLang === 'RU' ? 'НАЗОВИТЕ АВТОРА' : 'CAN YOU NAME THE ARTIST?'}<div id='clickanother' style={{ display: 'none', visibility: 'visible', minWidth: isMobile ? '210px' : '190px', minHeight: isMobile ? '20px' : '16px', width: '8vw', height: isMobile ? '3vw' : '4%', borderRadius: isMobile ? '24px' : '0.5vw', background: '#ead2a8', color: '#222', position: 'absolute', top: isMobile ? '7vh' : '5vh', right: '12px', zIndex: '999', fontStyle: 'italic', lineHeight: isMobile ? '20px' : '18px', fontSize: isMobile ? '18px' : '16px', fontFamily: 'Times', textAlign: 'center', cursor: 'pointer' }} onClick= { () => { loadNFTs() } }>{currLang === 'RU' ? 'КЛИК>ЕЩЁ КАРТИНЫ' : 'CLICK>MORE PICTURES'}</div></div><div style={{ opacity: isLoading ? '0.9' : '1' }}><NFT nft={nft} index={i} action="none" /></div><div style={{ textDecoration: 'underline', fontSize: '20px', backgroundColor: 'transparent', color: '#fff', padding: '3px', cursor: 'pointer', marginTop: isMobile ? '-10px' : '10px' }} onClick={ () => { setIsReqFormOpen(false) } }>{currLang === 'RU' ? 'ПРОПУСТИТЬ УГАДАЙКУ' : 'SKIP THE TEST'}</div></div>) : <CircularProgress id='circu' size="36px" style={{ marginLeft: isMobile ? '-2vw' : '0vw' }} />}
              </div>
              <div id='alerter' style={{ display: 'none', margin: '-360px auto 10px auto', position: 'relative', left: isMobile ? '2vw' : '-2vw', width: isMobile ? '80vw' : '25vw', minWidth: '360px', textAlign: 'left', color: 'transparent', fontSize: isMobile ? '36px' : '36px', padding: '10px', background: '#ffeedd', zIndex: '10003' }}></div>
              <div id='reqformdiv4' onClick={ (e) => { e.stopPropagation(); copyContent() } } style={{ display: 'none', visibility: 'hidden', margin: '10px auto', position: 'relative', left: '-10vw', width: '100%', minWidth: '880px', textAlign: 'left', color: 'transparent', fontSize: isMobile ? '12px' : '24px', padding: '5px', background: '#ffeedd', zIndex: '10003' }}></div>
            </div>
            {currLang === 'EN' && <div style={{ position: 'relative', height: '100%', width: '20vw', background: 'transparent', float: 'left' }}><div id='abo' style={{ position: 'absolute', bottom: '3px', right: '3px', fontSize: '36px', color: '#fff', textDecoration: 'underline', cursor: 'pointer', textAlign: 'left', background: 'transparent', display: isMobile ? 'none' : 'inline' }} onMouseOver={() => { document.getElementById('abo').style.color = '#9cf' }} onMouseOut={() => { document.getElementById('abo').style.color = '#fff' }} onClick={async () => { document.getElementById('abo').innerText = '..please wait'; const response = await fetch('https://room-house.com/game_rules_en.txt'); document.getElementById('coverDiv').innerText = await response.text() }}>About the Game</div></div>}
            {currLang === 'RU' && <div style={{ position: 'relative', height: '100%', width: '20vw', background: 'transparent', float: 'left' }}><div id='abo' style={{ position: 'absolute', bottom: '3px', right: '3px', fontSize: '36px', color: '#fff', textDecoration: 'underline', cursor: 'pointer', textAlign: 'left', background: 'transparent', display: isMobile ? 'none' : 'inline' }} onMouseOver={() => { document.getElementById('abo').style.color = '#9cf' }} onMouseOut={() => { document.getElementById('abo').style.color = '#fff' }} onClick={async () => { document.getElementById('abo').innerText = '..сейчас'; const response = await fetch('https://room-house.com/game_rules_rus.txt'); document.getElementById('coverDiv').innerText = await response.text() }}>Правила Игры</div></div>}
            <div style={{ position: 'relative', height: '100%', width: '20vw', background: 'transparent', float: 'left' }}><div style={{ position: 'absolute', bottom: '3px', right: '3px', fontSize: '36px', color: '#001122', textAlign: 'left', background: '#ffeedd', display: isMobile ? 'none' : 'inline' }}></div></div>
          </div>
          {currLang === 'EN' && !isMobile && <><div style={{ color: '#fff', position: 'relative', margin: '0 auto', textAlign: 'center', fontSize: '2rem', marginTop: '3vh', cursor: 'pointer' }}><div id='tennisMotivation' style={{ display: 'none', position: 'absolute', right: '2%', fontSize: '1rem', borderRadius: '10px', backgroundColor: '#9cf', padding: '5px', color: '#222' }}></div></div><div style={{ position: 'absolute', bottom: '10px', fontSize: '12px', color: '#136', marginTop: '5px', textAlign: 'center', backgroundColor: '#fed', width: '100%' }}>(C) Fine Arts Collectors, 2026. All Rights Reserved. Author: kl3eo (Alex Shevlaqouv) https://github.com/kl3eo/ Contact: <a href='https://ams.room-house.com' target='new'>ams.room-house.com</a></div></>}
          {currLang === 'RU' && !isMobile && <><div style={{ color: '#fff', position: 'relative', margin: '0 auto', textAlign: 'center', fontSize: '2rem', marginTop: '3vh', cursor: 'pointer' }}><div id='tennisMotivation' style={{ position: 'absolute', right: '2%', fontSize: '1rem', borderRadius: '10px', backgroundColor: '#9cf', padding: '5px', color: '#222' }}><img src='/tenn64.png'/><span>.. а теннисный Motivation теперь <a href='https://motivation.room-house.com' target='new' style={{ textDecoration: 'none', color: '#009' }}>здесь</a>!</span></div></div><div style={{ position: 'absolute', bottom: '10px', fontSize: '12px', color: '#136', marginTop: '5px', textAlign: 'center', backgroundColor: '#fed', width: '100%' }}>(C) Мотивация: Коллекционер, motivation.ru, 2026. Все права защищены. Автор kl3eo (Александр Шевляков, Alex Shevlaqouv) https://github.com/kl3eo/ Contact: <a href='https://ams.room-house.com' target='new'>ams.room-house.com</a></div></>}
          {currLang === 'EN' && isAndroid && false && <><div style={{ color: '#fff', position: 'relative', margin: '0 auto', textAlign: 'center', fontSize: '2rem', marginTop: '3vh', cursor: 'pointer' }}><div id='tennisMotivation' style={{ position: 'absolute', right: '2%', fontSize: '1rem', borderRadius: '10px', backgroundColor: '#9cf', padding: '5px', color: '#222', display: 'none' }}></div></div><div style={{ position: 'absolute', bottom: '2px', fontSize: '16px', color: '#9cf', marginTop: '5px', textAlign: 'center', backgroundColor: 'transparent', width: '100%' }}>(C) Fine Arts Collectors, 2026.</div></>}
          {currLang === 'RU' && isAndroid && false && <><div style={{ color: '#fff', position: 'relative', margin: '0 auto', textAlign: 'center', fontSize: '2rem', marginTop: '3vh', cursor: 'pointer' }}><div id='tennisMotivation' style={{ position: 'absolute', right: '2%', fontSize: '1rem', borderRadius: '10px', backgroundColor: '#9cf', padding: '5px', color: '#222', display: 'none' }}></div></div><div style={{ position: 'absolute', bottom: '2px', fontSize: '16px', color: '#9cf', marginTop: '5px', textAlign: 'center', backgroundColor: 'transparent', width: '100%' }}>(C) motivation.ru, 2026.</div></>}
        </div>
  )
}
