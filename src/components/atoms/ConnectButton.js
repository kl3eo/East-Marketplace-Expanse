import { Button } from '@mui/material'
import { useContext, useEffect, useState, useRef } from 'react'
import { Web3Context } from '../providers/Web3Provider'
import { isMobile } from 'react-device-detect'
import NavItem from './NavItem'

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
      inputRef.current && inputRef.current.click()
      // console.log('inputref', inputRef)
    }, 3000)
    return () => { clearTimeout(timer) }
  }, [])
  const buttonText = hasWindowEthereum ? isMobile ? '🦊' : 'Connect' : isMobile ? '🦊' : 'Install Metamask'
  // const buttonText = hasWindowEthereum ? isMobile ? 'Connect' : 'Connect' : isMobile ? 'Metamask' : 'Install Metamask'
  const onClick = () => {
    if (!already) {
      setAlready(true)
      return initializeWeb3()
    }
  }
  const url = 'https://metamask.io'
  return buttonText === '🦊' || buttonText === 'Install Metamask' ? <NavItem title={buttonText} href={url} openNewTab={true}/> : <Button color="inherit" ref={inputRef} onClick={onClick} style={{ fontSize: '24px' }}>{buttonText}</Button>
}
