import { useContext, useState, useEffect } from 'react'
import LowOnBalanceTip from '../molecules/LowOnBalanceTip'
import NavBar from '../molecules/NavBar'
import NFTModal from '../organisms/NFTModal'
import NFTModalProvider from '../providers/NFTModalProvider'
import { Web3Context } from '../providers/Web3Provider'
import styles from './Button.module.css'

export default function BaseLayout ({ children }) {
  const { network, balance, isReady, hasWeb3 } = useContext(Web3Context)
  const isLowOnEther = balance < 0.1
  const [showButton, setShowButton] = useState(false)
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // for smoothly scrolling
    })
  }
  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        setShowButton(true)
      } else {
        setShowButton(false)
      }
    })
  }, [])
  return (
    <>
      <NFTModalProvider>
        <NavBar/>
        {hasWeb3 && isReady && network && isLowOnEther && <LowOnBalanceTip/>}
        {children}
        <NFTModal/>
      </NFTModalProvider>
      {showButton && (
        <button onClick={scrollToTop} className={styles.back_to_top}>
          &#8679;
        </button>
      )}
    </>
  )
}
