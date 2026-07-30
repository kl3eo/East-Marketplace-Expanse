import { isMobile } from 'react-device-detect'
import { useContext, useEffect } from 'react'
import { NFTModalContext } from '../providers/NFTModalProvider'
import ReqEasyCreation from '../molecules/ReqEasyCreation'

export default function ReqFormEasy () {
  const { isReqFormOpen, setIsReqFormOpen, currLang } = useContext(NFTModalContext)
  const ifr = ''
  const currentDomain = 'room-house.com'
  useEffect(() => {
    document.getElementById('alerter').addEventListener('click', showBanner2)
  }, [])

  async function showBanner2 () {
    document.getElementById('alerter').removeEventListener('click', showBanner2)
    document.getElementById('reqformdiv4').style.display = 'block'
    await navigator.clipboard.writeText(document.getElementById('reqformdiv4').innerText)
    setTimeout(() => {
      alert('Hash copied to clipboard! - Хэш копирован в буфер обмена!')
    }, 1000)
  }

  function copyContent () {
    if (document.getElementById('reqformdiv4').style.display === 'block') return
    try {
      document.getElementById('alerter').innerHTML = currLang === 'EN' ? 'You understand what PRIVATE KEY is and how to use it? <span style="text-decoration: underline; color: #009; cursor: pointer;">YES</span>' : 'Вы понимаете, для чего нужен PRIVATE KEY? <span style="text-decoration: underline; color: #009; cursor: pointer;">ДА</span>'
      document.getElementById('alerter').style.display = 'block'
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
        <div onClick={ (e) => e.stopPropagation() } style={{ position: 'fixed', top: '0px', paddingTop: '0px', textAlign: 'center', width: '100%', height: '100%', display: isReqFormOpen ? 'block' : 'none', backgroundColor: '#001122', zIndex: '100001' }} >{ifr}
          {currLang === 'EN' && !isMobile && <div style={{ position: 'relative', height: '15%', width: '100vw', backgroundColor: '#012', color: '#fed', fontSize: isMobile ? '16px' : '36px', lineHeight: '42px', paddingTop: isMobile ? '2px' : '2.5vh' }}>Mint your token FREE - any File with Size max 2GB!</div>}
          {currLang === 'RU' && !isMobile && <div style={{ position: 'relative', height: '15%', width: '100vw', backgroundColor: '#012', color: '#fed', fontSize: isMobile ? '16px' : '36px', lineHeight: '42px', paddingTop: isMobile ? '2px' : '2.5vh' }}>Напечатать токен БЕСПЛАТНО - любой файл размером до 2Гб!</div>}
          <div style={{ display: 'flex', position: 'relative', height: '70%', minHeight: '520px', width: '100vw', backgroundColor: '#012' }}>
            {currLang === 'EN' && <div style={{ position: 'relative', height: '100%', width: '20vw', background: '#012', float: 'left', padding: '3px' }}><div style={{ position: 'absolute', bottom: '3px', right: '3px', fontSize: '36px', color: '#001122', textAlign: 'left', background: '#ffeedd', display: isMobile ? 'none' : 'inline' }}></div></div>}
            {currLang === 'EN' && <div style={{ position: 'relative', height: '100%', width: '20vw', background: '#012', float: 'left' }}><div style={{ position: 'absolute', bottom: '3px', right: '3px', fontSize: '36px', color: '#001122', textAlign: 'left', background: '#ffeedd', display: isMobile ? 'none' : 'inline' }}></div></div>}
            {currLang === 'RU' && <div style={{ position: 'relative', height: '100%', width: '20vw', background: '#012', float: 'left', padding: '3px' }}><div style={{ position: 'absolute', bottom: '3px', right: '3px', fontSize: '36px', color: '#001122', textAlign: 'left', background: '#ffeedd', display: isMobile ? 'none' : 'inline' }}></div></div>}
            {currLang === 'RU' && <div style={{ position: 'relative', height: '100%', width: '20vw', background: '#012', float: 'left' }}><div style={{ position: 'absolute', bottom: '3px', right: '3px', fontSize: '36px', color: '#001122', textAlign: 'left', background: '#ffeedd', display: isMobile ? 'none' : 'inline' }}></div></div>}
            <div style={{ position: 'relative', height: '100%', width: '20vw', minWidth: '384px', minHeight: '640px', border: '0px solid #fff', backgroundColor: '#012', float: 'left' }}>
              <div id='reqformdiv2' onClick={ (e) => e.stopPropagation() } style={{ position: 'relative', top: '1vh', left: '-0.36vw', margin: '0 auto', width: '360px', border: '0px solid #fff', maxHeight: '600px', height: '96%', zIndex: '10002' }} >
                <ReqEasyCreation/>
              </div>
              {currLang === 'EN' && <div id='reqformdiv1' style={{ margin: '0px auto', position: 'relative', width: isMobile ? '360px' : '20vw', minWidth: '360px', color: '#fff', fontSize: '18px', padding: '2px', backgroundColor: 'transparent', display: 'none' }}></div>}
              {currLang === 'RU' && <div id='reqformdiv1' style={{ margin: '0px auto', position: 'relative', width: isMobile ? '360px' : '20vw', minWidth: '360px', color: '#fff', fontSize: '18px', padding: '2px', backgroundColor: 'transparent', display: 'none' }}></div>}
              {currLang === 'EN' && <div id='reqformdiv3' onClick={ (e) => e.stopPropagation() } style={{ display: 'none', margin: '0 auto', position: 'relative', width: isMobile ? '360px' : '20vw', minWidth: '360px', color: '#fff', fontSize: isMobile ? '12px' : '16px', padding: '2px', backgroundColor: '#334455' }}><p>Thanks!</p><p>PLEASE SAVE THIS KEY AND KEEP IT SECRET!</p><p>Why do I need it? <a style={{ color: '#fed' }} href={'https://room-house.com/metamask_import_en.html'} target='new'>read</a></p></div>}
              {currLang === 'RU' && <div id='reqformdiv3' onClick={ (e) => e.stopPropagation() } style={{ display: 'none', margin: '0 auto', position: 'relative', width: isMobile ? '360px' : '20vw', minWidth: '360px', color: '#fff', fontSize: isMobile ? '12px' : '16px', padding: '2px', backgroundColor: '#334455' }}><p>Спасибо!</p><p>СОХРАНИТЕ КЛЮЧ И НИКОМУ ЕГО НЕ СООБЩАЙТЕ!</p><p>Зачем он нужен? <a style={{ color: '#fed' }} href={'https://room-house.com/metamask_import_ru.html'} target='new'>читать</a></p></div>}
              <div id='alerter' style={{ display: 'none', margin: '10px auto', position: 'relative', left: '-10vw', width: '100%', minWidth: '880px', textAlign: 'left', color: '#012', fontSize: isMobile ? '12px' : '36px', padding: '5px', background: '#ffeedd', zIndex: '10003' }}></div>
              <div id='reqformdiv4' onClick={ (e) => { e.stopPropagation(); copyContent() } } style={{ display: 'none', margin: '10px auto', position: 'relative', left: '-10vw', width: '100%', minWidth: '880px', textAlign: 'left', color: '#012', fontSize: isMobile ? '12px' : '24px', padding: '5px', background: '#ffeedd', zIndex: '10003' }}></div>
              {currLang === 'EN' && <div id='reqformdiv5' onClick={ (e) => { if (/Error/.test(document.getElementById('reqformdiv4').innerText)) location.href = '/'; e.stopPropagation(); const yon = window.confirm('Saved key, really?'); if (yon) { if (typeof window !== 'undefined' && window.location.hostname === 'tokenizer.' + currentDomain) { location.reload() } else { setIsReqFormOpen(false); if (document.getElementById('getRoom')) document.getElementById('getRoom').style.display = 'block'; document.getElementById('reqformdiv1').style.display = 'block'; document.getElementById('reqformdiv2').style.display = 'block'; document.getElementById('reqformdiv3').style.display = 'none'; document.getElementById('reqformdiv4').style.display = 'none'; document.getElementById('reqformdiv5').style.display = 'none' } } } } style={{ display: 'none', margin: '10px auto', position: 'relative', width: isMobile ? '360px' : '20vw', minWidth: '360px', color: '#fff', fontSize: isMobile ? '12px' : '16px', padding: '2px', backgroundColor: '#334455', cursor: 'pointer' }}>CLICK TO RETURN</div>}
              {currLang === 'RU' && <div id='reqformdiv5' onClick={ (e) => { if (/Ошибка/.test(document.getElementById('reqformdiv4').innerText)) location.href = '/'; e.stopPropagation(); const yon = window.confirm('Сохранили ключ, точно?'); if (yon) { if (typeof window !== 'undefined' && window.location.hostname === 'tokenizer.' + currentDomain) { location.reload() } else { setIsReqFormOpen(false); if (document.getElementById('getRoom')) document.getElementById('getRoom').style.display = 'block'; document.getElementById('reqformdiv1').style.display = 'block'; document.getElementById('reqformdiv2').style.display = 'block'; document.getElementById('reqformdiv3').style.display = 'none'; document.getElementById('reqformdiv4').style.display = 'none'; document.getElementById('reqformdiv5').style.display = 'none' } } } } style={{ display: 'none', margin: '10px auto', position: 'relative', width: isMobile ? '360px' : '20vw', minWidth: '360px', color: '#fff', fontSize: isMobile ? '12px' : '16px', padding: '2px', backgroundColor: '#334455', cursor: 'pointer' }}>Кликните, чтобы вернуться</div>}
            </div>
            {currLang === 'EN' && <div style={{ position: 'relative', height: '100%', width: '20vw', background: '#012', float: 'left' }}><div style={{ position: 'absolute', bottom: '3px', right: '3px', fontSize: '36px', color: '#001122', textAlign: 'left', background: '#ffeedd', display: isMobile ? 'none' : 'inline' }}></div></div>}
            {currLang === 'RU' && <div style={{ position: 'relative', height: '100%', width: '20vw', background: '#012', float: 'left' }}><div style={{ position: 'absolute', bottom: '3px', right: '3px', fontSize: '36px', color: '#001122', textAlign: 'left', background: '#ffeedd', display: isMobile ? 'none' : 'inline' }}></div></div>}
            <div style={{ position: 'relative', height: '100%', width: '20vw', background: '#012', float: 'left' }}><div style={{ position: 'absolute', bottom: '3px', right: '3px', fontSize: '36px', color: '#001122', textAlign: 'left', background: '#ffeedd', display: isMobile ? 'none' : 'inline' }}></div></div>
          </div>
          {currLang === 'EN' && !isMobile && <div style={{ position: 'relative', height: '15%', width: '100vw', backgroundColor: '#012', color: '#fed', fontSize: '36px', zIndex: '10003', lineHeight: '42px', paddingTop: '2.5vh' }}>Please read <a href='https://room-house.com/metamask_import_en.html' target='new' style={{ textDecoration: 'none', color: '#58b' }}>this help</a> before you mint a token!</div>}
          {currLang === 'RU' && !isMobile && <div style={{ position: 'relative', height: '15%', width: '100vw', backgroundColor: '#012', color: '#fed', fontSize: '36px', zIndex: '10003', lineHeight: '42px', paddingTop: '2.5vh' }}>Пожалуйста прочтите <a href='https://room-house.com/metamask_import_ru.html' target='new' style={{ textDecoration: 'none', color: '#58b' }}>эту помощь</a> перед печатью токена!</div>}
        </div>
  )
}
