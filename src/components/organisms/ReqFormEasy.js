import { isMobile } from 'react-device-detect'
import { useContext, useEffect } from 'react'
import { NFTModalContext } from '../providers/NFTModalProvider'
import ReqEasyCreation from '../molecules/ReqEasyCreation'

export default function ReqFormEasy () {
  const { isReqFormOpen, currLang } = useContext(NFTModalContext)
  const ifr = ''
  useEffect(() => {
    document.getElementById('alerter').addEventListener('click', showBanner2)
  }, [])

  async function showBanner2 () {
    document.getElementById('alerter').removeEventListener('click', showBanner2)
    document.getElementById('alerter').style.display = 'none'
    document.getElementById('reqformdiv4').style.visibility = 'visible' // flag goes up
    await navigator.clipboard.writeText(document.getElementById('reqformdiv4').innerText)
    setTimeout(() => {
      alert('Hash copied to clipboard! - Хэш копирован в буфер обмена!'); location.reload()
    }, 500)
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

  return (
        <div onClick={ (e) => e.stopPropagation() } style={{ position: 'fixed', top: '0px', paddingTop: '0px', textAlign: 'center', width: '100%', height: '100%', display: isReqFormOpen ? 'block' : 'none', backgroundColor: '#001122', zIndex: '100001' }} >{ifr}
          {currLang === 'EN' && !isMobile && <div style={{ position: 'relative', height: '15%', width: '100vw', backgroundColor: '#012', color: '#fed', fontSize: isMobile ? '2em' : '2em', lineHeight: '42px', paddingTop: isMobile ? '2px' : '2.5vh' }}>Mint your token FREE - any File with Size max 2GB!</div>}
          {currLang === 'RU' && !isMobile && <div style={{ position: 'relative', height: '15%', width: '100vw', backgroundColor: '#012', color: '#fed', fontSize: isMobile ? '2em' : '2em', lineHeight: '42px', paddingTop: isMobile ? '2px' : '2.5vh' }}>Напечатать токен БЕСПЛАТНО - любой файл размером до 2Гб!</div>}
          <div style={{ display: 'flex', position: 'relative', height: '70%', minHeight: '520px', width: '100vw', backgroundColor: '#012' }}>
            {currLang === 'EN' && <div style={{ position: 'relative', height: '100%', width: '20vw', background: '#012', float: 'left', padding: '3px' }}><div style={{ position: 'absolute', bottom: '3px', right: '3px', fontSize: '36px', color: '#001122', textAlign: 'left', background: '#ffeedd', display: isMobile ? 'none' : 'inline' }}></div></div>}
            {currLang === 'EN' && <div style={{ position: 'relative', height: '100%', width: '20vw', background: '#012', float: 'left' }}><div style={{ position: 'absolute', bottom: '3px', right: '3px', fontSize: '36px', color: '#001122', textAlign: 'left', background: '#ffeedd', display: isMobile ? 'none' : 'inline' }}></div></div>}
            {currLang === 'RU' && <div style={{ position: 'relative', height: '100%', width: '20vw', background: '#012', float: 'left', padding: '3px' }}><div style={{ position: 'absolute', bottom: '3px', right: '3px', fontSize: '36px', color: '#001122', textAlign: 'left', background: '#ffeedd', display: isMobile ? 'none' : 'inline' }}></div></div>}
            {currLang === 'RU' && <div style={{ position: 'relative', height: '100%', width: '20vw', background: '#012', float: 'left' }}><div style={{ position: 'absolute', bottom: '3px', right: '3px', fontSize: '36px', color: '#001122', textAlign: 'left', background: '#ffeedd', display: isMobile ? 'none' : 'inline' }}></div></div>}
            <div style={{ position: 'relative', height: '100%', width: '20vw', minWidth: '384px', minHeight: '640px', border: '0px solid #fff', backgroundColor: '#012', float: 'left' }}>
              <div id='reqformdiv2' onClick={ (e) => e.stopPropagation() } style={{ position: 'relative', top: isMobile ? '4vh' : '1vh', left: isMobile ? '4vw' : '-0.36vw', margin: '0 auto', width: '360px', border: '0px solid #fff', maxHeight: '600px', height: '96%', zIndex: '10002' }} >
                <ReqEasyCreation/>
              </div>
              <div id='alerter' style={{ display: 'none', margin: '-360px auto 10px auto', position: 'relative', left: isMobile ? '2vw' : '-2vw', width: isMobile ? '80vw' : '25vw', minWidth: '360px', textAlign: 'left', color: '#012', fontSize: isMobile ? '36px' : '36px', padding: '10px', background: '#ffeedd', zIndex: '10003' }}></div>
              <div id='reqformdiv4' onClick={ (e) => { e.stopPropagation(); copyContent() } } style={{ display: 'none', visibility: 'hidden', margin: '10px auto', position: 'relative', left: '-10vw', width: '100%', minWidth: '880px', textAlign: 'left', color: '#012', fontSize: isMobile ? '12px' : '24px', padding: '5px', background: '#ffeedd', zIndex: '10003' }}></div>
            </div>
            {currLang === 'EN' && <div style={{ position: 'relative', height: '100%', width: '20vw', background: '#012', float: 'left' }}><div style={{ position: 'absolute', bottom: '3px', right: '3px', fontSize: '36px', color: '#001122', textAlign: 'left', background: '#ffeedd', display: isMobile ? 'none' : 'inline' }}></div></div>}
            {currLang === 'RU' && <div style={{ position: 'relative', height: '100%', width: '20vw', background: '#012', float: 'left' }}><div style={{ position: 'absolute', bottom: '3px', right: '3px', fontSize: '36px', color: '#001122', textAlign: 'left', background: '#ffeedd', display: isMobile ? 'none' : 'inline' }}></div></div>}
            <div style={{ position: 'relative', height: '100%', width: '20vw', background: '#012', float: 'left' }}><div style={{ position: 'absolute', bottom: '3px', right: '3px', fontSize: '36px', color: '#001122', textAlign: 'left', background: '#ffeedd', display: isMobile ? 'none' : 'inline' }}></div></div>
          </div>
          {currLang === 'EN' && !isMobile && <div style={{ color: '#fff', position: 'relative', margin: '0 auto', textAlign: 'center', fontSize: '2em', marginTop: '3vh' }}>(C) FileTokenizer.com, 2026 | Powered by <a style={{ color: '#9cf' }} href='https://expanse.tech' target='new'>Expanse</a> | Based on <a style={{ color: '#c9f' }} href='https://mydocs.room-house.com?algorithm &HappyDox' target='new'>HappyDox</a> algorithm  | <a href='/help/metamask_import_en.html' target='new' style={{ textDecoration: 'none', color: '#58b' }}>Help</a></div>}
          {currLang === 'RU' && !isMobile && <div style={{ color: '#fff', position: 'relative', margin: '0 auto', textAlign: 'center', fontSize: '2em', marginTop: '3vh' }}>(C) FileTokenizer.com, 2026 | блокчейн <a style={{ color: '#9cf' }} href='https://expanse.tech' target='new'>Expanse</a> | алгоритм <a style={{ color: '#c9f' }} href='https://mydocs.room-house.com?algorithm &HappyDox' target='new'>HappyDox</a> | <a href='/help/metamask_import_ru.html' target='new' style={{ textDecoration: 'none', color: '#58b' }}>Помощь</a></div>}
        </div>
  )
}
