import { isMobile } from 'react-device-detect'
import { useContext, useEffect } from 'react'
import { NFTModalContext } from '../providers/NFTModalProvider'
import ReqCardCreation from '../molecules/ReqCardCreation'

export default function ReqFormDiv () {
  const { isReqFormOpen, setIsReqFormOpen, setCurrLang, currLang } = useContext(NFTModalContext)

  const toggleLang = () => {
    currLang === 'EN' ? setCurrLang('RU') : setCurrLang('EN')
  }

  useEffect(() => {
    document.getElementById('alerter').addEventListener('click', showBanner2)
  }, [])

  /* function showBanner () {
    document.getElementById('alerter').removeEventListener('click', showBanner)
    document.getElementById('alerter').addEventListener('click', showBanner2)
    // console.log('2: currLang', currLang)
    setTimeout(() => {
      document.getElementById('alerter').innerHTML = currLang === 'EN' ? 'You UNDERSTAND that we have a copy, too? <span style="text-decoration: underline; color: #009; cursor: pointer;">YES</span>' : 'Вы ПОНИМАЕТЕ, что у нас есть его копия? <span style="text-decoration: underline; color: #009; cursor: pointer;">ДА</span>'
      document.getElementById('alerter').style.display = 'block'
    }, 100)
  } */

  async function showBanner2 () {
    document.getElementById('alerter').removeEventListener('click', showBanner2)
    // document.getElementById('alerter').addEventListener('click', showBanner)
    document.getElementById('reqformdiv4').style.display = 'block'
    // console.log('3: currLang', currLang)
    await navigator.clipboard.writeText(document.getElementById('reqformdiv4').innerText)
    setTimeout(() => {
      // currLang === 'EN' && alert('Hash copied to clipboard!')
      // currLang === 'RU' && alert('Hash copied to clipboard! - Хэш копирован в буфер обмена!')
      alert('Hash copied to clipboard! - Хэш копирован в буфер обмена!')
    }, 1000)
  }

  function copyContent () {
    if (document.getElementById('reqformdiv4').style.display === 'block') return
    try {
      // console.log('1: currLang', currLang)
      document.getElementById('alerter').innerHTML = currLang === 'EN' ? 'You understand what PRIVATE KEY is and how to use it? <span style="text-decoration: underline; color: #009; cursor: pointer;">YES</span>' : 'Вы понимаете, для чего нужен PRIVATE KEY? <span style="text-decoration: underline; color: #009; cursor: pointer;">ДА</span>'
      document.getElementById('alerter').style.display = 'block'
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
        <div onClick={ (e) => e.stopPropagation() } style={{ position: 'fixed', top: '0px', paddingTop: '0px', textAlign: 'center', width: '100%', height: '100%', display: isReqFormOpen ? 'block' : 'none', backgroundColor: '#001122', zIndex: '100001' }} >
          {currLang === 'EN' && !isMobile && <div style={{ position: 'relative', height: '15%', width: '100vw', backgroundColor: '#99ccff', fontSize: isMobile ? '16px' : '36px', lineHeight: '42px', paddingTop: isMobile ? '2px' : '16px' }}>{typeof window !== 'undefined' && window.location.hostname === 'nft.room-house.com' && isMobile ? <div style={{ width: '1px' }}></div> : <div onClick={toggleLang} style={{ position: 'absolute', display: 'none', color: '#fff', backgroundColor: '#906', fontSize: '20px', width: '30px', height: '30px', borderRadius: '15px', cursor: 'pointer', textAlign: 'center', padding: '2px', margin: '10px 5px', lineHeight: '24px' }}>&#x2192;RU</div>}Create and Own a Renaissance NFT!<br/>Absolutely FREE - Room-House gives the gift!</div>}
          {currLang === 'RU' && !isMobile && <div style={{ position: 'relative', height: '15%', width: '100vw', backgroundColor: '#99ccff', fontSize: isMobile ? '16px' : '36px', lineHeight: '42px', paddingTop: isMobile ? '2px' : '16px' }}>{typeof window !== 'undefined' && window.location.hostname === 'nft.room-house.com' && isMobile ? <div style={{ width: '1px' }}></div> : <div onClick={toggleLang} style={{ position: 'absolute', display: 'none', color: '#fff', backgroundColor: '#906', fontSize: '20px', width: '30px', height: '30px', borderRadius: '15px', cursor: 'pointer', textAlign: 'center', padding: '2px', margin: '10px 5px', lineHeight: '24px' }}>&#x2192;EN</div>}Создать свой Ренессанс-NFT!<br/>Бесплатно - от Румхауса в подарок!</div>}
          <div style={{ display: 'flex', position: 'relative', height: '70%', minHeight: '520px', width: '100vw', backgroundColor: '#ccff99' }}>
            {currLang === 'EN' && <div style={{ position: 'relative', height: '100%', width: '19vw', background: '#990066 url(/giok_c.jpg) top left no-repeat', float: 'left', padding: '3px' }}><div style={{ position: 'absolute', bottom: '3px', right: '3px', fontSize: '36px', color: '#001122', textAlign: 'left', background: '#ffeedd', display: isMobile ? 'none' : 'inline' }}>..from Louvre? No. &#x274C;</div></div>}
            {currLang === 'EN' && <div style={{ position: 'relative', height: '100%', width: '19vw', background: '#006699 url(/bosch_c.jpg) top left no-repeat', float: 'left' }}><div style={{ position: 'absolute', bottom: '3px', right: '3px', fontSize: '36px', color: '#001122', textAlign: 'left', background: '#ffeedd', display: isMobile ? 'none' : 'inline' }}>..from Prado? No. &#x274C;</div></div>}
            {currLang === 'RU' && <div style={{ position: 'relative', height: '100%', width: '19vw', background: '#990066 url(/giok_c.jpg) top left no-repeat', float: 'left', padding: '3px' }}><div style={{ position: 'absolute', bottom: '3px', right: '3px', fontSize: '36px', color: '#001122', textAlign: 'left', background: '#ffeedd', display: isMobile ? 'none' : 'inline' }}>..из Лувра? Нет. &#x274C;</div></div>}
            {currLang === 'RU' && <div style={{ position: 'relative', height: '100%', width: '19vw', background: '#006699 url(/bosch_c.jpg) top left no-repeat', float: 'left' }}><div style={{ position: 'absolute', bottom: '3px', right: '3px', fontSize: '36px', color: '#001122', textAlign: 'left', background: '#ffeedd', display: isMobile ? 'none' : 'inline' }}>..из Прадо? Нет. &#x274C;</div></div>}
            <div style={{ position: 'relative', height: '100%', width: '21vw', minWidth: '384px', minHeight: '640px', backgroundColor: '#990066', float: 'left' }}>
              <div id='reqformdiv2' onClick={ (e) => e.stopPropagation() } style={{ position: 'relative', top: '1vh', left: '-0.36vw', margin: '0 auto', width: '360px', maxHeight: '600px', height: '96%', zIndex: '10002' }} >
                <ReqCardCreation/>
              </div>
              {currLang === 'EN' && <div id='reqformdiv1' style={{ margin: '0px auto', position: 'relative', width: isMobile ? '360px' : '20vw', minWidth: '360px', color: '#fff', fontSize: '18px', padding: '2px', backgroundColor: 'transparent', display: 'none' }}><p>1. Upload the image file.</p><p style={{ marginTop: '-1vh' }}>2. Add title and description.</p></div>}
              {currLang === 'RU' && <div id='reqformdiv1' style={{ margin: '0px auto', position: 'relative', width: isMobile ? '360px' : '20vw', minWidth: '360px', color: '#fff', fontSize: '18px', padding: '2px', backgroundColor: 'transparent', display: 'none' }}><p>1. Загрузите фото.</p><p>2. Укажите имя и описание.</p></div>}
              {currLang === 'EN' && <div id='reqformdiv3' onClick={ (e) => e.stopPropagation() } style={{ display: 'none', margin: '0 auto', position: 'relative', width: isMobile ? '360px' : '20vw', minWidth: '360px', color: '#fff', fontSize: isMobile ? '12px' : '16px', padding: '2px', backgroundColor: '#334455' }}><p>Thanks!</p><p>PLEASE SAVE THIS KEY AND KEEP IT SECRET!</p><p>Why do I need it? <a style={{ color: '#fed' }} href={'https://room-house.com/metamask_import_en.html'} target='new'>read</a></p></div>}
              {currLang === 'RU' && <div id='reqformdiv3' onClick={ (e) => e.stopPropagation() } style={{ display: 'none', margin: '0 auto', position: 'relative', width: isMobile ? '360px' : '20vw', minWidth: '360px', color: '#fff', fontSize: isMobile ? '12px' : '16px', padding: '2px', backgroundColor: '#334455' }}><p>Спасибо!</p><p>СОХРАНИТЕ КЛЮЧ И НИКОМУ ЕГО НЕ СООБЩАЙТЕ!</p><p>Зачем он нужен? <a style={{ color: '#fed' }} href={'https://room-house.com/metamask_import_ru.html'} target='new'>читать</a></p></div>}
              <div id='alerter' style={{ display: 'none', margin: '10px auto', position: 'relative', left: '-10vw', width: '100%', minWidth: '880px', textAlign: 'left', color: '#012', fontSize: isMobile ? '12px' : '36px', padding: '5px', background: '#ffeedd', zIndex: '10003' }}></div>
              <div id='reqformdiv4' onClick={ (e) => { e.stopPropagation(); copyContent() } } style={{ display: 'none', margin: '10px auto', position: 'relative', left: '-10vw', width: '100%', minWidth: '880px', textAlign: 'left', color: '#012', fontSize: isMobile ? '12px' : '24px', padding: '5px', background: '#ffeedd', zIndex: '10003' }}></div>
              {currLang === 'EN' && <div id='reqformdiv5' onClick={ (e) => { e.stopPropagation(); const yon = window.confirm('Saved key, really?'); if (yon) { if (typeof window !== 'undefined' && window.location.hostname === 'happyminter.room-house.com') { location.reload() } else { setIsReqFormOpen(false); if (document.getElementById('getRoom')) document.getElementById('getRoom').style.display = 'block'; document.getElementById('reqformdiv1').style.display = 'block'; document.getElementById('reqformdiv2').style.display = 'block'; document.getElementById('reqformdiv3').style.display = 'none'; document.getElementById('reqformdiv4').style.display = 'none'; document.getElementById('reqformdiv5').style.display = 'none' } } } } style={{ display: 'none', margin: '10px auto', position: 'relative', width: isMobile ? '360px' : '20vw', minWidth: '360px', color: '#fff', fontSize: isMobile ? '12px' : '16px', padding: '2px', backgroundColor: '#334455', cursor: 'pointer' }}>CLICK TO RETURN</div>}
              {currLang === 'RU' && <div id='reqformdiv5' onClick={ (e) => { e.stopPropagation(); const yon = window.confirm('Сохранили ключ, точно?'); if (yon) { if (typeof window !== 'undefined' && window.location.hostname === 'happyminter.room-house.com') { location.reload() } else { setIsReqFormOpen(false); if (document.getElementById('getRoom')) document.getElementById('getRoom').style.display = 'block'; document.getElementById('reqformdiv1').style.display = 'block'; document.getElementById('reqformdiv2').style.display = 'block'; document.getElementById('reqformdiv3').style.display = 'none'; document.getElementById('reqformdiv4').style.display = 'none'; document.getElementById('reqformdiv5').style.display = 'none' } } } } style={{ display: 'none', margin: '10px auto', position: 'relative', width: isMobile ? '360px' : '20vw', minWidth: '360px', color: '#fff', fontSize: isMobile ? '12px' : '16px', padding: '2px', backgroundColor: '#334455', cursor: 'pointer' }}>Кликните, чтобы вернуться</div>}
            </div>
            {currLang === 'EN' && <div style={{ position: 'relative', height: '100%', width: '19vw', background: '#006699 url(/tiz_b.jpg) top left no-repeat', float: 'left' }}><div style={{ position: 'absolute', bottom: '3px', right: '3px', fontSize: '36px', color: '#001122', textAlign: 'left', background: '#ffeedd', display: isMobile ? 'none' : 'inline' }}>..from Met? Yes. &#x2705;</div></div>}
            {currLang === 'RU' && <div style={{ position: 'relative', height: '100%', width: '19vw', background: '#006699 url(/tiz_b.jpg) top left no-repeat', float: 'left' }}><div style={{ position: 'absolute', bottom: '3px', right: '3px', fontSize: '36px', color: '#001122', textAlign: 'left', background: '#ffeedd', display: isMobile ? 'none' : 'inline' }}>..из Met? Да. &#x2705;</div></div>}
            <div style={{ position: 'relative', height: '100%', width: '24vw', background: '#990066 url(/leo_b.jpg) top left no-repeat', float: 'left' }}><div style={{ position: 'absolute', bottom: '3px', right: '3px', fontSize: '36px', color: '#001122', textAlign: 'left', background: '#ffeedd', display: isMobile ? 'none' : 'inline' }}>..Alte Pinakothek? &#x2705;</div></div>
          </div>
          {currLang === 'EN' && !isMobile && <div style={{ position: 'relative', height: '15%', width: '100vw', backgroundColor: '#ff99cc', fontSize: '36px', lineHeight: '42px', paddingTop: '2.5vh' }}>Please use images w/o copyright restrictions<br/>and check <a href='https://iberia.room-house.com/cgi/get_all.pl' target='new'>this list</a> before you mint!</div>}
          {currLang === 'RU' && !isMobile && <div style={{ position: 'relative', height: '15%', width: '100vw', backgroundColor: '#ff99cc', fontSize: '36px', lineHeight: '42px', paddingTop: '2.5vh' }}>Используйте изображения только из Public Domain<br/>и проверьте <a href='https://iberia.room-house.com/cgi/get_all.pl' target='new'>этот список</a> перед печатью!</div>}
        </div>
  )
}
