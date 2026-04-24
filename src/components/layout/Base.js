import { isMobile } from 'react-device-detect'
import { useContext, useState, useEffect } from 'react'
import LowOnBalanceTip from '../molecules/LowOnBalanceTip'
import NavBar from '../molecules/NavBar'
import NFTModal from '../organisms/NFTModal'
import ReqFormDiv from '../organisms/ReqFormDiv'
import ReqFormDoc from '../organisms/ReqFormDoc'
// import NFTModalProvider, { NFTModalContext } from '../providers/NFTModalProvider'
import NFTModalProvider from '../providers/NFTModalProvider'
import { Web3Context } from '../providers/Web3Provider'
import styles from './Button.module.css'

export default function BaseLayout ({ children }) {
  const { network, balance, isReady, hasWeb3 } = useContext(Web3Context)
  // const { setIsReqFormOpen } = useContext(NFTModalContext)
  const isLowOnEther = balance < 0
  const [showButton, setShowButton] = useState(false)
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // for smoothly scrolling
    })
    // setTimeout(() => { window.scrollTo({ top: 2, behavior: 'smooth' }) }, 1000)
    document.getElementById('toggleLightBgr').style.backgroundColor = '#234' // set default
  }
  const hideBackButton = typeof window !== 'undefined' && window.location.hostname === 'shopping.room-house.com' && isMobile
  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300 && !hideBackButton) {
        setShowButton(true)
        if (document.getElementById('office_bar')) document.getElementById('office_bar').style.display = 'none'
      } else {
        setShowButton(false)
      }
    })
  }, [])

  return (
    <>
      <NFTModalProvider>
        {typeof window !== 'undefined' && window.location.hostname !== 'happyminter.room-house.com' && window.location.hostname !== 'happydox.room-house.com' && <NavBar/>}
        {hasWeb3 && isReady && network && isLowOnEther && <LowOnBalanceTip/>}
        {children}
        <NFTModal/>
        {typeof window !== 'undefined' && (window.location.hostname === 'ooc.room-house.com' || window.location.hostname === 'selfie.room-house.com' || window.location.hostname === 'selfi.room-house.com' || window.location.hostname === 'nft.room-house.com' || window.location.hostname === 'happyminter.room-house.com') && <ReqFormDiv/>}
        {typeof window !== 'undefined' && window.location.hostname === 'happydox.room-house.com' && <ReqFormDoc/>}
      </NFTModalProvider>
      {showButton && (
        <button onClick={scrollToTop} className={styles.back_to_top}>
          &#8679;
        </button>
      )}
    </>
  )
}
