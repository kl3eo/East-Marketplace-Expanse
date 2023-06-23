import { Button } from '@mui/material'
import { useContext, useEffect, useState, useRef } from 'react'
import { Web3Context } from '../providers/Web3Provider'
import { isMobile } from 'react-device-detect'

export default function ConnectButton () {
  const { initializeWeb3 } = useContext(Web3Context)
  const [hasWindowEthereum, setHasWindowEthereum] = useState(false)
  const inputRef = useRef(null)
  useEffect(() => {
    setHasWindowEthereum(window.ethereum)
  }, [])
  useEffect(() => {
    const timer = setTimeout(() => {
      // console.log('This will run after 1 second!')
      inputRef.current.click()
      // console.log('inputref', inputRef)
    }, 3000)
    // not enough?
    const timer2 = setTimeout(() => {
      // console.log('This will run after 1 second!')
      inputRef.current.click()
      // console.log('inputref', inputRef)
    }, 10000)
    return () => { clearTimeout(timer); clearTimeout(timer2) }
  }, [])
  const buttonText = hasWindowEthereum ? isMobile ? '🦊' : 'Connect' : 'Install Metamask'
  // var onlyOnce = true
  const onClick = () => {
    // because click works as an alarm against non-stop 'loading', somewhat
    // if (hasWindowEthereum) {
    // if (!hasWindowEthereum && onlyOnce) { window.open('https://metamask.io/', '_blank'); onlyOnce = false }
    return initializeWeb3()
    // }

    // return window.open('https://metamask.io/', '_blank')
  }
  return <Button color="inherit" ref={inputRef} onClick={onClick}>{buttonText}</Button>
}
