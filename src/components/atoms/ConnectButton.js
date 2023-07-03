import { Button } from '@mui/material'
import { useContext, useEffect, useState, useRef } from 'react'
import { Web3Context } from '../providers/Web3Provider'
import { isMobile } from 'react-device-detect'

export default function ConnectButton () {
  const { initializeWeb3 } = useContext(Web3Context)
  const [hasWindowEthereum, setHasWindowEthereum] = useState(false)
  const [already, setAlready] = useState(false)
  const inputRef = useRef(null)
  useEffect(() => {
    setHasWindowEthereum(window.ethereum)
  }, [])
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current.click()
      // console.log('inputref', inputRef)
    }, 3000)
    return () => { clearTimeout(timer) }
  }, [])
  const buttonText = hasWindowEthereum ? isMobile ? '🦊' : 'Connect' : isMobile ? '🦊' : 'Install Metamask'
  const onClick = () => {
    if (!already) {
      setAlready(true)
      return initializeWeb3()
    }
  }
  return <Button color="inherit" ref={inputRef} onClick={onClick} style={{ fontSize: '24px' }}>{buttonText}</Button>
}
